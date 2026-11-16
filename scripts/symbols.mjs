/* ==========================================================================
   Symboles des 14 catégories : assets/raw/symboles/*.svg → un seul fichier
   site/public/images/symboles.svg (sprite, mis en cache une fois pour tout le site).
   Les dessins sont ceux fournis : cadrage normalisé (carré 240 × 240, symbole centré)
   et contours lissés pour rester nets à toutes les tailles (voir « Lissage » plus bas).
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

/* ---------- Lissage des contours ----------
   Les fichiers d'origine sont des relevés pixel par pixel (200 px) : agrandis, leurs bords
   font des « marches d'escalier ». On reconstruit ici un contour net :
     1. simplification (Ramer–Douglas–Peucker, tolérance SIMPLIFY) : supprime les marches,
        garde la silhouette et les irrégularités du pinceau plus grandes qu'un pixel ;
     2. courbe lisse passant par les points restants (Catmull-Rom centripète → Bézier cubiques).
   Les pointes vives (angle fermé) restent des pointes : pas d'arrondi des fins de trait. */
const SIMPLIFY = 0.85;      // en pixels d'origine
const CORNER = Math.cos((62 * Math.PI) / 180); // en dessous de 62° d'ouverture, le point reste anguleux
const r2 = (n) => Math.round(n * 100) / 100;

function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  let max = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(dy * (pts[i][0] - a[0]) - dx * (pts[i][1] - a[1])) / len;
    if (d > max) { max = d; idx = i; }
  }
  if (max <= eps) return [a, b];
  return [...rdp(pts.slice(0, idx + 1), eps).slice(0, -1), ...rdp(pts.slice(idx), eps)];
}
function simplifyClosed(pts, eps) {
  // Contour fermé : on coupe au point le plus éloigné du premier, puis on simplifie les deux moitiés
  let far = 0, fd = -1;
  pts.forEach((p, i) => { const d = Math.hypot(p[0] - pts[0][0], p[1] - pts[0][1]); if (d > fd) { fd = d; far = i; } });
  if (far === 0) return pts;
  const h1 = rdp(pts.slice(0, far + 1), eps), h2 = rdp([...pts.slice(far), pts[0]], eps);
  return [...h1.slice(0, -1), ...h2.slice(0, -1)];
}
function smoothClosed(pts) {
  const n = pts.length;
  if (n < 4) return 'M' + pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join(' ') + 'Z';
  const at = (i) => pts[(i + n) % n];
  // tangente en chaque point (nulle sur une pointe vive)
  const tan = pts.map((p, i) => {
    const a = at(i - 1), b = at(i + 1);
    const u = [p[0] - a[0], p[1] - a[1]], v = [b[0] - p[0], b[1] - p[1]];
    const lu = Math.hypot(...u) || 1, lv = Math.hypot(...v) || 1;
    const cos = (u[0] * v[0] + u[1] * v[1]) / (lu * lv);
    if (cos < CORNER) return null; // pointe : pas de tangente commune
    const t = [u[0] / lu + v[0] / lv, u[1] / lu + v[1] / lv], lt = Math.hypot(...t) || 1;
    return [t[0] / lt, t[1] / lt, lu, lv];
  });
  let d = `M${r2(pts[0][0])} ${r2(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p = at(i), q = at(i + 1), tp = tan[i], tq = tan[(i + 1) % n];
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]), k = len / 3;
    const c1 = tp ? [p[0] + tp[0] * k, p[1] + tp[1] * k] : p;
    const c2 = tq ? [q[0] - tq[0] * k, q[1] - tq[1] * k] : q;
    d += (tp || tq) ? `C${r2(c1[0])} ${r2(c1[1])} ${r2(c2[0])} ${r2(c2[1])} ${r2(q[0])} ${r2(q[1])}` : `L${r2(q[0])} ${r2(q[1])}`;
  }
  return d + 'Z';
}
const refine = (d) => d.split(/Z/i).map((sub) => sub.trim()).filter(Boolean).map((sub) => {
  const nums = sub.replace(/[ML]/gi, ' ').trim().split(/[\s,]+/).map(Number);
  const pts = []; for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
  return smoothClosed(simplifyClosed(pts, SIMPLIFY));
}).join('');

const layer = (svg, id, file) => {
  const m = svg.match(new RegExp(`<g id="${id}"[^>]*>([\\s\\S]*?)</g>`));
  if (!m) throw new Error(`Calque « ${id} » introuvable dans ${file}`);
  // un <path> par coup de pinceau : les traits qui se croisent restent pleins
  return [...m[1].matchAll(/\sd="([^"]+)"/g)].map((p) => `<path d="${refine(p[1])}"/>`).join('');
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
