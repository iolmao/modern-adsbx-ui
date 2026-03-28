#!/usr/bin/env node
// Downloads aircraft.csv.gz from tar1090-db (wiedehopf) into data/
// Run: node scripts/download-db.cjs

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DB_URL = 'https://github.com/wiedehopf/tar1090-db/raw/csv/aircraft.csv.gz';
const DEST = path.join(__dirname, '..', 'data', 'aircraft.csv.gz');

function download(url, dest, redirectsLeft = 5) {
  const lib = url.startsWith('https') ? https : http;
  lib.get(url, (res) => {
    if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) && res.headers.location && redirectsLeft > 0) {
      res.resume();
      return download(new URL(res.headers.location, url).toString(), dest, redirectsLeft - 1);
    }
    if (res.statusCode !== 200) {
      console.error(`Download failed: HTTP ${res.statusCode}`);
      process.exit(1);
    }
    const total = parseInt(res.headers['content-length'] || '0', 10);
    let received = 0;
    const file = fs.createWriteStream(dest);
    res.on('data', (chunk) => {
      received += chunk.length;
      if (total) process.stdout.write(`\rDownloading aircraft database... ${Math.round(received / total * 100)}%`);
    });
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`\nSaved to ${dest} (${(received / 1024 / 1024).toFixed(1)} MB)`);
    });
  }).on('error', (e) => {
    console.error('Download error:', e.message);
    process.exit(1);
  });
}

if (process.env.NETLIFY) {
  console.log('Netlify build detected — skipping aircraft database download (not used in static deployment).');
  process.exit(0);
}

if (fs.existsSync(DEST)) {
  console.log('Aircraft database already present, skipping download. Delete data/aircraft.csv.gz to force re-download.');
  process.exit(0);
}

fs.mkdirSync(path.dirname(DEST), { recursive: true });
console.log('Downloading aircraft database from tar1090-db...');
download(DB_URL, DEST);
