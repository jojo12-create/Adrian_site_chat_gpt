// Production build, real Chromium/WebGL, screenshots and assertions. No medical
// mappings or renderer internals are changed by the test.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { ZONES3D } from '../content/anatomie-3d.mjs';
import { troubles } from '../content/categories.mjs';
import { site } from '../content/site.mjs';

const out = 'qa-shots/anatomie-3d';
mkdirSync(out, { recursive: true });
const server = spawn(process.execPath, ['scripts/serve.mjs', '8766'], { stdio: 'ignore' });
const base = 'http://127.0.0.1:8766';
const report = [], errors = [];
let browser;
const screenshot = async (page, name) => { await page.screenshot({ path: `${out}/${name}.png` }); console.log('Capture :', name); };
const settle = (p) => p.waitForTimeout(850);
const pressed = async (p) => p.locator('.seg button[aria-pressed="true"]').evaluateAll((els) => els.map((e) => e.id.slice(2)).sort());
async function open(options = {}, prepare) {
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 }, ...options });
  p.on('pageerror', (e) => errors.push(e.message));
  if (prepare) await prepare(p);
  await p.goto(`${base}/anatomie-3d/`);
  await p.waitForSelector('[data-mode]', { timeout: 60000 });
  return p;
}
async function axe(p, name) {
  await p.addScriptTag({ content: readFileSync('node_modules/axe-core/axe.min.js', 'utf8') });
  const violations = await p.evaluate(async () => (await window.axe.run(document)).violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })));
  report.push({ name, axe: violations });
  assert.deepEqual(violations, [], `axe ${name}`);
}
try {
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(base)).ok) break; } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--enable-unsafe-swiftshader'] });
  // Verify HTTP compression, not just the size of a locally compressed file.
  const response = await fetch(`${base}/anatomie-3d/model.bin`, { headers: { 'Accept-Encoding': 'gzip' } });
  assert.equal(response.headers.get('content-encoding'), 'gzip');
  assert.equal((await response.arrayBuffer()).byteLength, 8785070);
  assert.equal(response.headers.get('vary'), 'Accept-Encoding');
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  assert(!sitemap.includes('/anatomie-3d/'));

  // Move viewer below the fold before its entry point runs: no heavy request.
  const lazy = await browser.newPage({ reducedMotion: 'reduce' }); const requests = [];
  await lazy.route('**/anatomie-3d/', async (route) => {
    const r = await route.fetch();
    await route.fulfill({ response: r, body: (await r.text()).replace('<div class="anatomie-app"', '<div style="margin-top:3000px" class="anatomie-app"') });
  });
  lazy.on('request', (r) => requests.push(r.url()));
  await lazy.goto(`${base}/anatomie-3d/`); await lazy.waitForTimeout(1000);
  assert(!requests.some((u) => /\/(engine-|interface-|three\.module-|model\.bin)/.test(u)), 'Chargement avant visibilité');
  await lazy.locator('[data-anatomie]').scrollIntoViewIfNeeded();
  await lazy.waitForSelector('[data-mode="3d"]', { timeout: 60000 });
  report.push({ name: 'lazy-load', passed: true }); await lazy.close();

  const p = await open({ reducedMotion: 'reduce' });
  assert.equal(await p.locator('[data-anatomie]').getAttribute('data-mode'), '3d');
  assert.match(await p.locator('meta[name=robots]').getAttribute('content'), /noindex/);
  await screenshot(p, 'desktop-initial');
  for (const t of troubles) {
    await p.click(`[data-slug="${t.slug}"]`); await settle(p);
    const cfg = ZONES3D[t.slug].steps?.[0] || ZONES3D[t.slug];
    assert.deepEqual(await pressed(p), [...cfg.layers].sort());
    assert.equal(await p.locator('#panel h2').textContent(), t.h1);
    assert.equal(await p.locator('#panel .short').textContent(), t.short);
    assert.equal(await p.locator('#panel a').first().getAttribute('href'), site.links.doctolib);
    assert.equal(await p.locator('#panel a').last().getAttribute('href'), `/osteopathie/${t.slug}/`);
    assert.match(await p.locator('#panel').textContent(), /Information générale, ne remplace pas une consultation/);
    await screenshot(p, `motif-${t.slug}`);
    report.push({ name: t.slug, layers: await pressed(p), panel: true });
  }
  for (const slug of ['articulations', 'stress-tensions']) {
    await p.click(`[data-slug="${slug}"]`);
    for (const [i, cfg] of ZONES3D[slug].steps.entries()) {
      await p.click(`[data-step="${i}"]`); await settle(p);
      assert.deepEqual(await pressed(p), [...cfg.layers].sort());
      await screenshot(p, `${slug}-etape-${i}`);
    }
  }
  await p.click('#reset');
  const keys = ['sk', 'mu', 'ne', 'vi'];
  for (let mask = 1; mask < 16; mask++) {
    const desired = keys.filter((_, i) => mask & (1 << i));
    for (const k of desired) if (!(await pressed(p)).includes(k)) await p.click(`#l-${k}`);
    for (const k of keys.filter((k) => !desired.includes(k))) if ((await pressed(p)).includes(k)) await p.click(`#l-${k}`);
    await settle(p); assert.deepEqual(await pressed(p), [...desired].sort());
    if ([1, 2, 4, 8, 15].includes(mask)) await screenshot(p, `couches-${mask}`);
  }
  report.push({ name: 'couches', combinations: 15 });
  // Zoom and drag followed by layer and legend controls.
  const box = await p.locator('#stage canvas').boundingBox();
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await p.mouse.wheel(0, -450); await settle(p);
  await p.click('#l-mu'); await p.click('[data-slug="cervicalgie"]');
  assert.equal(await p.locator('#panel h2').textContent(), troubles.find((t) => t.slug === 'cervicalgie').h1);
  await p.click('#reset'); await settle(p);
  // Click on the visible body, including the menu for overlapping motifs.
  let hit = false;
  for (const [x, y] of [[.5,.43],[.5,.37],[.52,.31],[.5,.5],[.52,.6]]) {
    await p.mouse.click(box.x + box.width*x, box.y + box.height*y);
    if (await p.locator('#chooser.open').count()) {
      await screenshot(p, 'choix-sur-modele');
      await p.locator('#chooser button').first().click(); hit = true; break;
    }
    if (await p.locator('#legend [aria-pressed="true"]').count()) { hit = true; break; }
  }
  assert(hit, 'Le clic sur le corps doit sélectionner un motif');
  await p.click('[data-slug="articulations"]');
  await settle(p);
  const still = await p.locator('#stage canvas').screenshot();
  await p.waitForTimeout(5100);
  assert.equal(await p.locator('.step[aria-pressed="true"]').getAttribute('data-step'), '0', 'Mouvement réduit : avance désactivée');
  assert(still.equals(await p.locator('#stage canvas').screenshot()), 'Mouvement réduit : aucune pulsation ni rotation');
  await axe(p, 'desktop-reduced'); await p.close();

  const auto = await open({ viewport: { width: 1000, height: 760 }, deviceScaleFactor: 0.5 });
  for (const slug of ['articulations', 'stress-tensions']) {
    console.log('Parcours automatique :', slug);
    await auto.click(`[data-slug="${slug}"]`, { noWaitAfter: true });
    await auto.waitForSelector('[data-step="1"][aria-pressed="true"]', { timeout: 60000 });
    const r = await auto.locator('#stage canvas').boundingBox();
    await auto.mouse.move(r.x+r.width*.5,r.y+r.height*.5);
    await auto.mouse.down(); await auto.mouse.move(r.x+r.width*.5+40,r.y+r.height*.5+10,{steps:5}); await auto.mouse.up();
    const step = await auto.locator('.step[aria-pressed="true"]').getAttribute('data-step');
    await auto.waitForTimeout(5300);
    assert.equal(await auto.locator('.step[aria-pressed="true"]').getAttribute('data-step'), step, 'Le toucher doit arrêter le parcours');
    report.push({ name: `parcours-${slug}`, automatic: true, cancelledByInteraction: true });
  }
  await auto.close();

  for (const width of [390, 320]) {
    const mobile = await open({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await screenshot(mobile, `mobile-${width}-ferme`);
    await mobile.click('#handle'); await mobile.click('[data-slug="articulations"]');
    await screenshot(mobile, `mobile-${width}-ouvert`);
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0);
    assert.equal(await mobile.locator('#handle').getAttribute('aria-expanded'), 'true');
    await axe(mobile, `mobile-${width}`); await mobile.close();
  }
  for (const failure of ['webgl', 'model']) {
    const fallback = await open({ reducedMotion: 'reduce' }, async (page) => {
      if (failure === 'model') await page.route('**/model.bin', (route) => route.fulfill({ status: 503, body: '' }));
      else await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) { return /^webgl/.test(type) ? null : original.call(this, type, ...args); };
      });
    });
    assert.equal(await fallback.locator('[data-anatomie]').getAttribute('data-mode'), '2d');
    await fallback.click('[data-slug="lombalgie"]');
    await screenshot(fallback, `repli-${failure}`);
    await axe(fallback, `repli-${failure}`); await fallback.close();
  }
  const nojs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await nojs.goto(`${base}/anatomie-3d/`);
  assert.equal(await nojs.locator('#legend a').count(), 7);
  assert(await nojs.locator('#legend a').first().isVisible());
  await screenshot(nojs, 'sans-javascript'); await nojs.close();
  assert.deepEqual(errors, []);
  report.push({ name: 'javascript', errors });
  console.log(JSON.stringify(report, null, 2));
} finally {
  writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser?.close(); server.kill();
}
