/* Serveur statique local de production (gzip, cache, vraie 404) : node scripts/serve.mjs [port]
   Sert dist/ comme le ferait l'hébergeur. Le formulaire PHP nécessite `php -S` ou l'hébergeur. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
const port = +process.argv[2] || 4173;
createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let file = join(dist, p);
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch { file = null; }
  let body, code = 200;
  try { body = await readFile(file); } catch { body = await readFile(join(dist, '404.html')); code = 404; file = '404.html'; }
  const ext = extname(file), type = types[ext] || 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Cache-Control': p.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache' };
  if (/text|javascript|json|xml|svg|manifest|octet-stream/.test(type)) {
    headers.Vary = 'Accept-Encoding';
    const acceptsGzip = (req.headers['accept-encoding'] || '').split(',').some((item) => {
      const [name, ...params] = item.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return name === 'gzip' && (!q || Number(q.split('=')[1]) > 0);
    });
    if (acceptsGzip) { body = gzipSync(body); headers['Content-Encoding'] = 'gzip'; }
  }
  res.writeHead(code, headers); res.end(body);
}).listen(port, '127.0.0.1', () => console.log(`Site servi sur http://127.0.0.1:${port}`));
