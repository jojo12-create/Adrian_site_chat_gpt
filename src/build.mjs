/* ==========================================================================
   Build statique : node src/build.mjs
   - génère public/*.html à partir de pages.mjs + layout.mjs
   - génère sitemap.xml, robots.txt et docs/04-textes.md
   - échoue si une règle SEO de base n'est pas respectée
   ========================================================================== */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages } from './pages.mjs';
import { render } from './layout.mjs';
import { site } from './site.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public');
mkdirSync(out, { recursive: true });

const len = (s) => [...s].length;
const errors = [];
const today = new Date().toISOString().slice(0, 10);

for (const p of pages) {
  const html = render(p);
  // Contrôles SEO automatiques
  if (len(p.title) > 60) errors.push(`${p.file} : title ${len(p.title)} car. (> 60)`);
  if (len(p.description) > 155) errors.push(`${p.file} : description ${len(p.description)} car. (> 155)`);
  const h1 = (html.match(/<h1\b/g) || []).length;
  if (h1 !== 1) errors.push(`${p.file} : ${h1} balise(s) H1`);
  const noAlt = (html.match(/<img\b(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (noAlt) errors.push(`${p.file} : ${noAlt} image(s) sans alt`);
  writeFileSync(join(out, p.file), html);
  console.log(`✓ ${p.file.padEnd(32)} title ${String(len(p.title)).padStart(2)} · desc ${len(p.description)}`);
}

// Sitemap : toutes les pages indexables, URL canoniques du domaine définitif.
const urls = pages.filter((p) => !p.noindex).map((p) =>
  `  <url><loc>${site.url}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n');
writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap.xml\n`);

// Export lisible de tous les textes (livrable « textes »).
const toText = (h) => h
  .replace(/<script[\s\S]*?<\/script>|<svg[\s\S]*?<\/svg>|<span class="sr-only">[\s\S]*?<\/span>/g, '')
  .replace(/<h([1-3])[^>]*>/g, (_, n) => '\n\n' + '#'.repeat(Number(n) + 1) + ' ')
  .replace(/<\/h[1-3]>/g, '\n')
  .replace(/<li[^>]*>/g, '\n- ').replace(/<summary>/g, '\n\n**').replace(/<\/summary>/g, '**\n')
  .replace(/<(p|tr|figure|blockquote)[^>]*>/g, '\n\n').replace(/<br>/g, '\n')
  .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
const doc = ['# Textes du site (générés depuis src/pages.mjs)\n',
  'Les mentions **[À FOURNIR]** sont à compléter dans `src/site.mjs`.\n',
  ...pages.map((p) => `\n---\n\n## Page ${p.path}\n\n- **Title** (${len(p.title)} car.) : ${p.title}\n- **Meta description** (${len(p.description)} car.) : ${p.description}\n\n${toText(p.body)}\n`)].join('\n');
mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(join(root, 'docs', '04-textes.md'), doc);

if (errors.length) { console.error('\n✗ Contrôles SEO :\n  ' + errors.join('\n  ')); process.exit(1); }
console.log(`\n${pages.length} pages générées, sitemap (${pages.filter((p) => !p.noindex).length} URL), robots.txt, docs/04-textes.md`);
