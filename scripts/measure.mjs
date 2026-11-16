/* ==========================================================================
   Mesures de référence (audit) : node scripts/measure.mjs <url de base> <dossier de sortie> [dist]
   - poids transférés par page et par type (JS, CSS, polices, images), brut / gzip / brotli
   - LCP, CLS, INP (interaction réelle : ouverture du menu), long tasks
   - défilement complet enregistré : images perdues (frames > 25 ms), long tasks,
     recalculs de style et de mise en page (CDP Performance.getMetrics)
   - captures à 390, 768, 1024 et 1440 px
   Sortie : <dossier>/mesures.json + <dossier>/captures/*.jpg
   ========================================================================== */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [base = 'http://127.0.0.1:4173', out = 'mesures', dist = 'dist'] = process.argv.slice(2);
mkdirSync(join(out, 'captures'), { recursive: true });

const pages = { accueil: '/', categorie: '/osteopathie/lombalgie/', contact: '/contact/', mentions: '/mentions-legales/' };
const widths = [390, 768, 1024, 1440];
const kind = (url, type) => {
  if (/\.(woff2?)(\?|$)/.test(url)) return 'polices';
  if (/\.(avif|webp|jpe?g|png|svg|gif)(\?|$)/.test(url)) return 'images';
  if (/\.js(\?|$)/.test(url)) return 'js';
  if (/\.css(\?|$)/.test(url)) return 'css';
  if (type === 'document') return 'html';
  return 'autres';
};
// Taille brute, gzip et brotli calculées sur le fichier servi (indépendant du serveur)
const sizes = (url) => {
  const path = new URL(url).pathname.replace(/^\/Adrianosteo/, '');
  let f = join(dist, decodeURIComponent(path));
  if (path.endsWith('/')) f = join(f, 'index.html');
  if (!existsSync(f)) return null;
  const b = readFileSync(f);
  const compressible = !/\.(woff2|avif|webp|jpe?g|png)$/.test(f);
  return {
    brut: b.length,
    gzip: compressible ? gzipSync(b, { level: 9 }).length : b.length,
    brotli: compressible ? brotliCompressSync(b, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length : b.length,
  };
};

const browser = await chromium.launch();
const result = { base, date: new Date().toISOString(), pages: {} };

for (const [name, path] of Object.entries(pages)) {
  const r = (result.pages[name] = { path });
  for (const vp of [{ n: 'mobile', w: 390, h: 844, mobile: true }, { n: 'desktop', w: 1440, h: 900, mobile: false }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const res = [];
    page.on('response', async (resp) => { const s = sizes(resp.url()); if (s) res.push({ url: resp.url(), k: kind(resp.url(), resp.request().resourceType()), ...s }); });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.addInitScript(() => {
      window.__m = { lcp: 0, cls: 0, inp: 0, lt: [] };
      new PerformanceObserver((l) => { const e = l.getEntries().at(-1); window.__m.lcp = e.startTime; window.__m.lcpEl = e.element ? e.element.tagName + '.' + (e.element.className || '') : ''; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lt.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.interactionId) window.__m.inp = Math.max(window.__m.inp, e.duration); }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
    });
    await page.goto(base + path, { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    // Interaction réelle pour l'INP : ouverture puis fermeture du menu (mobile) / du méga-menu (desktop)
    if (vp.mobile) { await page.tap('[data-burger]'); await page.waitForTimeout(900); await page.tap('[data-burger]'); }
    else { const b = page.locator('.nav-more').first(); if (await b.count()) { await b.click(); await page.waitForTimeout(600); await b.click(); } }
    await page.waitForTimeout(600);
    const m = await page.evaluate(() => window.__m);
    const totals = {};
    for (const x of res) { const t = (totals[x.k] ||= { fichiers: 0, brut: 0, gzip: 0, brotli: 0 }); t.fichiers++; t.brut += x.brut; t.gzip += x.gzip; t.brotli += x.brotli; }
    // Défilement complet enregistré (molette, comme un utilisateur), images perdues et recalculs
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Performance.enable');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    const before = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
    await page.evaluate(() => { window.__f = []; let last = performance.now(); const loop = (t) => { window.__f.push(t - last); last = t; if (!window.__stop) requestAnimationFrame(loop); }; requestAnimationFrame(loop); window.__lt0 = window.__m.lt.length; });
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    if (vp.mobile) {
      for (let y = 0; y < height; y += 500) { await page.evaluate((d) => window.scrollBy(0, d), 500); await page.waitForTimeout(120); }
    } else {
      await page.mouse.move(vp.w / 2, vp.h / 2);
      for (let y = 0; y < height; y += 300) { await page.mouse.wheel(0, 300); await page.waitForTimeout(60); }
    }
    await page.waitForTimeout(1200);
    const scroll = await page.evaluate(() => { window.__stop = true; const f = window.__f.slice(2); return { frames: f.length, perdues: f.filter((d) => d > 25).length, pire: Math.round(Math.max(...f)), longTasks: window.__m.lt.slice(window.__lt0) }; });
    const after = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
    const d = (k) => +(after[k] - before[k]).toFixed(3);
    r[vp.n] = {
      lcp: Math.round(m.lcp), lcpEl: m.lcpEl, cls: +m.cls.toFixed(4), inp: Math.round(m.inp), longTasksChargement: m.lt,
      poids: totals, totalTransfert: res.reduce((a, x) => a + (/\.(js|css|html|svg)/.test(x.url) || x.k === 'html' ? x.gzip : x.brut), 0),
      defilement: { hauteur: height, ...scroll, layouts: d('LayoutCount'), recalcStyles: d('RecalcStyleCount'), layoutMs: Math.round(d('LayoutDuration') * 1000), styleMs: Math.round(d('RecalcStyleDuration') * 1000), scriptMs: Math.round(d('ScriptDuration') * 1000) },
      erreursJS: errors,
    };
    await ctx.close();
  }
  // Captures aux 4 largeurs (haut de page, après l'entrée)
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : w < 1440 ? 1024 : 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(base + path, { waitUntil: 'load' });
    await page.waitForTimeout(2200);
    await page.screenshot({ path: join(out, 'captures', `${name}-${w}.jpg`), type: 'jpeg', quality: 78 });
    await ctx.close();
  }
}

// Poids JS / CSS de l'ensemble du site (tous les fichiers produits)
const { readdirSync } = await import('node:fs');
const all = { js: [], css: [] };
for (const f of readdirSync(join(dist, 'assets'))) {
  const k = f.endsWith('.js') ? 'js' : f.endsWith('.css') ? 'css' : null;
  if (k) all[k].push({ fichier: f, ...sizes(base + '/assets/' + f) });
}
result.assets = all;
writeFileSync(join(out, 'mesures.json'), JSON.stringify(result, null, 2));
await browser.close();
console.log('✓ mesures écrites dans', out);
