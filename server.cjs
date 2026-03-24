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

    function proxyFetch(targetUrl, redirectsLeft) {
      const lib = targetUrl.startsWith('https') ? https : http;
      lib.get(targetUrl, (upstream) => {
        const status = upstream.statusCode;
        // Follow redirects
        if ((status === 301 || status === 302 || status === 307 || status === 308) && upstream.headers.location && redirectsLeft > 0) {
          upstream.resume(); // drain
          const next = new URL(upstream.headers.location, targetUrl).toString();
          return proxyFetch(next, redirectsLeft - 1);
        }
        // Forward Content-Encoding so the browser decompresses gzip/br correctly
        const headers = { 'Content-Type': 'application/octet-stream' };
        if (upstream.headers['content-encoding']) headers['Content-Encoding'] = upstream.headers['content-encoding'];
        res.writeHead(status, headers);
        upstream.pipe(res);
      }).on('error', (e) => { res.writeHead(502); res.end(String(e)); });
    }

    try {
      proxyFetch(target, 5);
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
