/* ==========================================================================
   Symboles des 14 catégories : assets/raw/symboles/*.svg → un seul fichier
   site/public/images/symboles.svg (sprite, mis en cache une fois pour tout le site).
   Les tracés sont repris tels quels (aucune simplification) : seuls le cadrage
   (carré 240 × 240, symbole centré) et l'écriture des chemins sont normalisés.
   Chaque symbole donne deux calques, colorés en CSS et empilés en profondeur :
     #<slug>-encre   le trait au pinceau (vert)
     #<slug>-accent  la touche terracotta
   Lancer : npm run symbols
   ========================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { symbolFiles } from '../content/symbols.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BOX = 240;

const layer = (svg, id, file) => {
  const m = svg.match(new RegExp(`<g id="${id}"[^>]*>([\\s\\S]*?)</g>`));
  if (!m) throw new Error(`Calque « ${id} » introuvable dans ${file}`);
  // « M1 2 L3 4 L5 6 Z » → « M1 2 3 4 5 6Z » : même tracé, écriture plus courte
  // (un <path> par coup de pinceau : les traits qui se croisent restent pleins)
  return [...m[1].matchAll(/\sd="([^"]+)"/g)].map((p) => `<path d="${p[1].replace(/ L/g, ' ').replace(/ Z/g, 'Z')}"/>`).join('');
};

let out = '<svg xmlns="http://www.w3.org/2000/svg">';
for (const [slug, file] of Object.entries(symbolFiles)) {
  const svg = readFileSync(join(root, 'assets/raw/symboles', file + '.svg'), 'utf8');
  const [, w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);
  if (w > BOX || h > BOX) throw new Error(`${file} dépasse le cadre de ${BOX} px`);
  const t = `translate(${(BOX - w) / 2} ${(BOX - h) / 2})`;
  for (const [suffix, id] of [['encre', 'encre_verte'], ['accent', 'accent_terracotta']])
    out += `<symbol id="${slug}-${suffix}" viewBox="0 0 ${BOX} ${BOX}"><g fill-rule="evenodd" transform="${t}">${layer(svg, id, file)}</g></symbol>`;
}
out += '</svg>\n';
writeFileSync(join(root, 'site/public/images/symboles.svg'), out);
console.log(`✓ symboles.svg : ${Object.keys(symbolFiles).length} symboles, ${(out.length / 1024).toFixed(1)} Ko`);
