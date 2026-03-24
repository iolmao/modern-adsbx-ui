// Production server — serves the built React app and a CORS proxy endpoint
// Usage: node server.cjs [port]
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || process.argv[2] || 3000;
const DIST = path.join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Proxy endpoint
  if (url.pathname === '/proxy') {
    const target = url.searchParams.get('url');
    if (!target) { res.writeHead(400); res.end('Missing url'); return; }
    try {
      const lib = target.startsWith('https') ? https : http;
      lib.get(target, (upstream) => {
        res.writeHead(upstream.statusCode, { 'Content-Type': 'application/octet-stream' });
        upstream.pipe(res);
      }).on('error', (e) => { res.writeHead(502); res.end(String(e)); });
    } catch (e) { res.writeHead(502); res.end(String(e)); }
    return;
  }

  // Static files from dist/
  let filePath = path.join(DIST, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!fs.existsSync(filePath)) filePath = path.join(DIST, 'index.html'); // SPA fallback
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);

}).listen(PORT, () => console.log(`ADSB Tracker running at http://localhost:${PORT}`));
