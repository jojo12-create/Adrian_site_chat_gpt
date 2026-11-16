// Vite : multi-pages statiques. Chaque index.html généré devient une entrée.
import { defineConfig } from 'vite';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const htmlFiles = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  if (['node_modules', 'dist', 'public', 'src'].includes(f)) return [];
  return statSync(p).isDirectory() ? htmlFiles(p) : f.endsWith('.html') ? [p] : [];
});

/* Précharge les polices latines (titres + texte) : évite le décalage au chargement
   de la police et accélère l'affichage du titre principal. */
const preloadFonts = () => ({
  name: 'preload-fonts',
  transformIndexHtml: { order: 'post', handler(html, ctx) {
    if (!ctx.bundle) return html;
    const files = Object.keys(ctx.bundle).filter((f) => /(fraunces-latin-wght-normal|fraunces-latin-wght-italic|manrope-latin-wght-normal)-.*\.woff2$/.test(f));
    return { html, tags: files.map((f) => ({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: (process.env.BASE || '/') + f, crossorigin: '' }, injectTo: 'head-prepend' })) };
  } },
});

export default defineConfig({
  root,
  base: process.env.BASE || '/',
  plugins: [preloadFonts()],
  appType: 'mpa', // pas de repli SPA : une URL inconnue donne une vraie 404
  build: {
    outDir: join(root, '../dist'),
    rollupOptions: { input: Object.fromEntries(htmlFiles(root).map((f) => [relative(root, f).replace(/\.html$/, '').replace(/\//g, '-') || 'index', f])) },
    assetsInlineLimit: 0,
    cssMinify: true,
  },
  server: { port: 5173 },
});
