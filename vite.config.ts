import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { IncomingMessage, ServerResponse } from 'http'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'aircraft-proxy',
      configureServer(server) {
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
