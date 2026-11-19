// Tiny static server for dist/ with SPA fallback (smoke test and prints).
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';

const tipos = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };

export function servir(dist, porta) {
  const server = createServer((req, res) => {
    const caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let arquivo = join(dist, caminho);
    if (!arquivo.startsWith(dist) || !existsSync(arquivo) || statSync(arquivo).isDirectory()) {
      arquivo = join(dist, 'index.html');
    }
    res.writeHead(200, { 'content-type': tipos[extname(arquivo)] ?? 'application/octet-stream' });
    createReadStream(arquivo).pipe(res);
  });
  return new Promise((ok) => server.listen(porta, '127.0.0.1', () => ok(server)));
}
