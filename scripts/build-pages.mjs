/* ==========================================================================
   Génère les pages HTML (site/…/index.html), sitemap.xml, robots.txt,
   site.webmanifest et docs/textes.md. Les trois fichiers de site/public sont
   générés à chaque build et ignorés par git (la démo écrit un robots.txt fermé). Échoue si une règle SEO est violée.
   Usage : npm run pages (lancé automatiquement par dev et build)
   ========================================================================== */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages as existingPages } from '../content/pages.mjs';
import { anatomiePage } from '../content/anatomie-page.mjs';
import { render, frTypo, DEMO } from '../content/layout.mjs';
import { site } from '../content/site.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const siteDir = join(root, 'site');
const len = (s) => [...s].length;
const BASE = process.env.BASE || '/';
const errors = [];
const pages = [...existingPages, anatomiePage];
const today = new Date().toISOString().slice(0, 10);
const titles = new Set(), descs = new Set();

for (const p of pages) {
  let html = frTypo(render(p));
  // Mode démo hébergé dans un sous-dossier (GitHub Pages) : préfixe les liens internes.
  // Les fichiers /src/… sont laissés à Vite, qui applique lui-même la base.
  if (BASE !== '/') html = html
    .replace(/(href|src|action)="\/(?!\/|src\/)/g, `$1="${BASE}`)
    .replace(/srcset="([^"]*)"/g, (m, v) => `srcset="${v.replace(/(^|, )\/images\//g, `$1${BASE}images/`)}"`);
  // Maquette : l'adresse canonique, les balises de partage et les données structurées pointent vers la maquette
  // elle-même (sinon « Partager » renvoie vers le site officiel). La page reste en noindex.
  if (DEMO && process.env.DEMO_URL) html = html.replaceAll(site.url, process.env.DEMO_URL.replace(/\/$/, ''));
  if (len(p.title) > 60) errors.push(`${p.path} : title ${len(p.title)} car.`);
  if (len(p.description) > 155) errors.push(`${p.path} : description ${len(p.description)} car.`);
  if (titles.has(p.title) || descs.has(p.description)) errors.push(`${p.path} : title ou description en double`);
  titles.add(p.title); descs.add(p.description);
  const h1 = (html.match(/<h1\b/g) || []).length;
  if (h1 !== 1) errors.push(`${p.path} : ${h1} H1`);
  const imgs = html.match(/<img\b[^>]*>/g) || [];
  if (imgs.some((i) => !/\balt="/.test(i))) errors.push(`${p.path} : image sans alt`);
  if (imgs.some((i) => !/\bwidth="/.test(i) || !/\bheight="/.test(i))) errors.push(`${p.path} : image sans width/height`);
  const file = join(siteDir, p.file);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log(`✓ ${p.path.padEnd(36)} title ${String(len(p.title)).padStart(2)} · desc ${len(p.description)}`);
}

const pub = join(siteDir, 'public');
mkdirSync(pub, { recursive: true });
const indexable = pages.filter((p) => !p.noindex);
writeFileSync(join(pub, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${site.url}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.path === '/' ? '1.0' : p.path.split('/').length > 3 ? '0.7' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(pub, 'robots.txt'), DEMO ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap.xml\n`);
writeFileSync(join(pub, 'site.webmanifest'), JSON.stringify({
  name: site.name, short_name: 'Adrian Ostéo', lang: 'fr', start_url: BASE, display: 'browser',
  background_color: '#faf8f3', theme_color: '#243c2f',
  icons: [{ src: BASE + 'icon-512.png', sizes: '512x512', type: 'image/png' }, { src: BASE + 'apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
}, null, 2));

// Export texte de tous les contenus (livrable « textes »)
const toText = (h) => h.replace(/<script[\s\S]*?<\/script>|<svg[\s\S]*?<\/svg>|<span class="sr-only">[\s\S]*?<\/span>|<ul class="marquee-track" aria-hidden="true">[\s\S]*?<\/ul>|<div class="hover-preview"[\s\S]*?<\/div>/g, '')
  .replace(/<h([1-3])[^>]*>/g, (_, n) => '\n\n' + '#'.repeat(+n + 1) + ' ').replace(/<\/h[1-3]>/g, '\n')
  .replace(/<li[^>]*>/g, '\n- ').replace(/<summary>/g, '\n\n**').replace(/<\/summary>/g, '**\n')
  .replace(/<(p|tr|blockquote)[^>]*>/g, '\n\n').replace(/<br>/g, '\n').replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(join(root, 'docs/textes.md'), ['# Textes du site\n', '_Généré depuis `content/pages.mjs`. Les mentions **[À CONFIRMER]** se complètent dans `content/site.mjs`._\n',
  ...pages.map((p) => `\n---\n\n## ${p.path}\n\n- **Title** (${len(p.title)}) : ${p.title}\n- **Description** (${len(p.description)}) : ${p.description}\n\n${toText(p.body)}\n`)].join('\n'));

if (errors.length) { console.error('\n✗ SEO :\n  ' + errors.join('\n  ')); process.exit(1); }
console.log(`\n${pages.length} pages · sitemap ${indexable.length} URL · robots.txt · manifest · docs/textes.md`);
