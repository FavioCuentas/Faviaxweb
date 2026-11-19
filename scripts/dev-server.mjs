import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '127.0.0.1';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

async function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const data = await fs.readFile(filePath);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url || '/', `http://${HOST}:${PORT}`);
    let safePath = path.posix.normalize(decodeURIComponent(reqUrl.pathname));
    if (safePath.startsWith('..')) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    const candidate = path.join(ROOT, safePath === '/' ? 'index.html' : safePath.slice(1));
    try {
      const stat = await fs.stat(candidate);
      if (stat.isFile()) {
        await serveFile(res, candidate);
        return;
      }
    } catch {
      // Fall through to extension check or SPA fallback
    }

    // Missing explicit asset/module should 404 instead of returning HTML
    if (path.extname(safePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    // Clean SPA routes fallback to index.html
    await serveFile(res, path.join(ROOT, 'index.html'));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(String(err));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`FAVIAX local server ready at http://${HOST}:${PORT}/`);
});
