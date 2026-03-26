import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import zlib from 'zlib'
import readline from 'readline'
import type { IncomingMessage, ServerResponse } from 'http'

// Shared aircraft db for dev server (loaded once)
const devAircraftDb = new Map<string, { reg: string; type: string; desc: string }>();
const dbPath = path.resolve(__dirname, 'data/aircraft.csv.gz');
if (fs.existsSync(dbPath)) {
  const rl = readline.createInterface({ input: fs.createReadStream(dbPath).pipe(zlib.createGunzip()), crlfDelay: Infinity });
  rl.on('line', (line) => {
    const parts = line.split(';');
    if (parts[0]) devAircraftDb.set(parts[0].toLowerCase(), { reg: parts[1] || '', type: parts[2] || '', desc: parts[4] || '' });
  });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'aircraft-proxy',
      configureServer(server) {
        server.middlewares.use('/api/aircraft-db', (req: IncomingMessage, res: ServerResponse) => {
          const hex = (req.url ?? '').replace(/^\//, '').toLowerCase();
          const entry = devAircraftDb.get(hex);
          res.writeHead(entry ? 200 : 404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(entry || null));
        });

        server.middlewares.use('/proxy', async (req: IncomingMessage, res: ServerResponse) => {
          const rawUrl = req.url ?? '';
          const targetUrl = new URLSearchParams(rawUrl.slice(rawUrl.indexOf('?') + 1)).get('url');
          if (!targetUrl) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Missing url parameter' }));
            return;
          }
          try {
            const response = await fetch(targetUrl);
            const buffer = await response.arrayBuffer();
            res.writeHead(response.status, { 'Content-Type': 'application/octet-stream' });
            res.end(Buffer.from(buffer));
          } catch (err) {
            res.writeHead(502);
            res.end(JSON.stringify({ error: 'Proxy fetch failed', detail: String(err) }));
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
