#!/usr/bin/env node
// Downloads vradarserver/standing-data (CC0-1.0) and builds flat route/airport lookup files.
// Output: data/routes.csv.gz (callsign;airports) and data/airports-routes.csv.gz (code;iata;location;lat;lng)
// Run: node scripts/download-routes-db.cjs

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const TARBALL_URL = 'https://github.com/vradarserver/standing-data/archive/refs/heads/main.tar.gz';
const ROUTES_OUT = path.join(__dirname, '..', 'data', 'routes.csv.gz');
const AIRPORTS_OUT = path.join(__dirname, '..', 'data', 'airports-routes.csv.gz');

if (process.env.NETLIFY) {
  console.log('Netlify build detected — skipping routes database download (not used in static deployment).');
  process.exit(0);
}

if (fs.existsSync(ROUTES_OUT) && fs.existsSync(AIRPORTS_OUT)) {
  console.log('Routes database already present, skipping. Delete data/routes.csv.gz to force re-download.');
  process.exit(0);
}

function downloadToBuffer(url, redirectsLeft = 10) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: { 'User-Agent': 'adsb-tracker' },
    };
    lib.get(options, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirectsLeft > 0) {
        res.resume();
        return resolve(downloadToBuffer(new URL(res.headers.location, url).toString(), redirectsLeft - 1));
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode} from ${url}`)); return; }
      const total = parseInt(res.headers['content-length'] || '0', 10);
      let received = 0;
      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
        received += chunk.length;
        if (total) process.stdout.write(`\rDownloading routes database... ${Math.round(received / total * 100)}%  `);
      });
      res.on('end', () => { process.stdout.write('\n'); resolve(Buffer.concat(chunks)); });
      res.on('error', reject);
    }).on('error', reject);
  });
}

// Parse a tar buffer, calling onFile(name, contentBuffer) for each regular file.
// Handles UStar format (prefix + name) used by GitHub archive tarballs.
function parseTar(buf, onFile) {
  let offset = 0;
  while (offset + 512 <= buf.length) {
    const header = buf.slice(offset, offset + 512);
    // Two consecutive zero blocks = end of archive
    let allZero = true;
    for (let i = 0; i < 512 && allZero; i++) if (header[i] !== 0) allZero = false;
    if (allZero) break;

    // Filename: bytes 0-99; prefix: bytes 345-499 (UStar extension)
    let name = header.slice(0, 100).toString('utf8').replace(/\0.*/, '');
    const prefix = header.slice(345, 500).toString('utf8').replace(/\0.*/, '');
    if (prefix) name = prefix + '/' + name;

    // File size: bytes 124-135, null-terminated octal ASCII
    const size = parseInt(header.slice(124, 136).toString('ascii').replace(/\0/g, '').trim(), 8) || 0;
    // Type flag: byte 156 — 48 = '0' (regular), 0 = '\0' (also regular in old format)
    const typeFlag = header[156];

    offset += 512;
    if (typeFlag === 48 || typeFlag === 0) {
      onFile(name, buf.slice(offset, offset + size));
    }
    offset += Math.ceil(size / 512) * 512;
  }
}

async function main() {
  fs.mkdirSync(path.dirname(ROUTES_OUT), { recursive: true });

  console.log('Downloading vradarserver/standing-data (CC0-1.0)...');
  const tarGz = await downloadToBuffer(TARBALL_URL);
  console.log(`Downloaded ${(tarGz.length / 1024 / 1024).toFixed(1)} MB, decompressing...`);

  const tar = zlib.gunzipSync(tarGz);
  console.log(`Decompressed to ${(tar.length / 1024 / 1024).toFixed(1)} MB, parsing CSV files...`);

  // callsign → "ICAO1-ICAO2-..." (raw AirportCodes string from CSV)
  const routesMap = new Map();
  // code → semicolon-joined "iata;location;lat;lng"
  const airportsMap = new Map();

  let routeFiles = 0, airportFiles = 0;

  parseTar(tar, (name, content) => {
    // Routes: .../routes/schema-01/X/XXX-*.csv  (handles both XXX-all.csv and XXX-1.csv .. XXX-9.csv)
    if (/\/routes\/schema-01\/[A-Z]\/[A-Z0-9]{3}-.+\.csv$/.test(name)) {
      routeFiles++;
      const lines = content.toString('utf8').split('\n');
      // Header: Callsign,Code,Number,AirlineCode,AirportCodes  (indices 0 and 4)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        if (parts.length >= 5 && parts[0] && parts[4]) {
          routesMap.set(parts[0], parts[4].trim());
        }
      }
    }
    // Airports: .../airports/schema-01/X/XX.csv
    else if (/\/airports\/schema-01\/[A-Z0-9]\/[A-Z0-9]{2}\.csv$/.test(name)) {
      airportFiles++;
      const lines = content.toString('utf8').split('\n');
      // Header: Code, Name, ICAO, IATA, Location, CountryISO2, Latitude, Longitude, AltitudeFeet
      // Indices:   0     1     2     3      4           5          6          7            8
      // Note: AltitudeFeet can contain commas (e.g. "1,000") but is the last field, safe to ignore.
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        if (parts.length < 8) continue;
        const code = parts[0].trim();
        if (!code) continue;
        airportsMap.set(code, `${parts[3].trim()};${parts[4].trim()};${parseFloat(parts[6]) || 0};${parseFloat(parts[7]) || 0}`);
      }
    }
  });

  console.log(`Processed ${routeFiles} route files → ${routesMap.size.toLocaleString()} routes`);
  console.log(`Processed ${airportFiles} airport files → ${airportsMap.size.toLocaleString()} airports`);

  // routes.csv.gz: one line per callsign → "CALLSIGN;ICAO1-ICAO2-..."
  const routeLines = [];
  for (const [cs, ap] of routesMap) routeLines.push(`${cs};${ap}`);
  fs.writeFileSync(ROUTES_OUT, zlib.gzipSync(routeLines.join('\n')));
  console.log(`Saved routes: ${(fs.statSync(ROUTES_OUT).size / 1024).toFixed(0)} KB → ${ROUTES_OUT}`);

  // airports-routes.csv.gz: one line per airport → "CODE;IATA;LOCATION;LAT;LNG"
  const airportLines = [];
  for (const [code, vals] of airportsMap) airportLines.push(`${code};${vals}`);
  fs.writeFileSync(AIRPORTS_OUT, zlib.gzipSync(airportLines.join('\n')));
  console.log(`Saved airports: ${(fs.statSync(AIRPORTS_OUT).size / 1024).toFixed(0)} KB → ${AIRPORTS_OUT}`);
}

main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
