/* ==========================================================================
   Optimisation des images (gratuit, local) : npm run images
   Sources : assets/raw (logo et photos récupérés du site officiel et de la démo)
   Sortie  : site/public/images/<nom>-<largeur>.(avif|webp) + manifest.json
   ========================================================================== */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = join(root, 'assets/raw');
const out = join(root, 'site/public/images');
mkdirSync(out, { recursive: true });

// nom → source. Chaque photo est déclinée en plusieurs largeurs (srcset).
const photos = {
  'adrian-bureau':   'demo/adrian-consultation-hq.png',       // Adrian assis au bureau, papier peint japonais
  'adrian-echange':  'demo/adrian-soin-hq.png',               // échange au bureau, regard attentif
  'adrian-ecoute':   'demo/adrian-portrait-ecoute-hq.png',    // Adrian penché vers un patient
  'soin-epaule':     'demo/adrian-portrait-profil-hq.png',    // mains sur l'épaule
  'carte-cabinet':   'demo/adrian-portrait-discussion-hq.png',// carte de visite au logo
  'soin-bassin':     'demo/adrian-detail-hq.png',             // technique sur la hanche
  'soin-nuque':      'officiel/images/instagram3.jpg',        // travail cervical, patient assis
  'soin-dos':        'officiel/images/instagram2.jpg',        // technique sur le dos
  'soin-dos-table':  'officiel/images/site-header/1.jpg',     // patiente allongée, cabinet
  'adrian-portrait': 'officiel/images/instagram.jpg',         // portrait chemise blanche
};
const widths = [480, 800, 1200, 1600];
const manifest = {};

for (const [name, src] of Object.entries(photos)) {
  const img = sharp(join(raw, src)).rotate();
  const { width, height } = await img.metadata();
  const ws = widths.filter((w) => w < width).concat(width > 1600 ? [] : [width]).filter((w, i, a) => a.indexOf(w) === i);
  for (const w of ws) {
    const r = sharp(join(raw, src)).rotate().resize({ width: w });
    await r.clone().avif({ quality: 52, effort: 6 }).toFile(join(out, `${name}-${w}.avif`));
    await r.clone().webp({ quality: 74 }).toFile(join(out, `${name}-${w}.webp`));
  }
  manifest[name] = { w: width, h: height, widths: ws };
  console.log(`✓ ${name.padEnd(16)} ${width}×${height} → ${ws.join(', ')}`);
}

// Logo : PNG net + favicons (le logo officiel est un JPEG de 752 px)
const logo = join(raw, 'officiel/images/1.jpg');
await sharp(logo).resize(160).webp({ quality: 85 }).toFile(join(out, 'logo-160.webp'));
await sharp(logo).resize(320).webp({ quality: 85 }).toFile(join(out, 'logo-320.webp'));
await sharp(logo).resize(180).png().toFile(join(root, 'site/public/apple-touch-icon.png'));
await sharp(logo).resize(32).png().toFile(join(root, 'site/public/favicon-32.png'));
await sharp(logo).resize(512).png().toFile(join(root, 'site/public/icon-512.png'));

// Image de partage Open Graph 1200×630 (JPEG : lu par tous les réseaux)
await sharp(join(raw, 'demo/adrian-consultation-hq.png')).resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 80, mozjpeg: true }).toFile(join(out, 'og-adrian-rodriguez.jpg'));

writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('✓ logo, favicons, image Open Graph, manifest.json');
