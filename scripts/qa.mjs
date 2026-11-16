/* ==========================================================================
   Tests en conditions réelles : npm test (après npm run build)
   - lance le site compilé (dist/) avec le serveur PHP intégré (formulaire réel)
   - Playwright : desktop 1440, mobile 390 (iPhone), petit écran 320
   - axe-core (WCAG 2.1 AA), débordements, H1, RDV visible sans défiler,
     cibles tactiles, LCP / CLS, formulaire, menu mobile, captures d'écran
   ========================================================================== */
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shots = join(root, 'qa-shots');
mkdirSync(shots, { recursive: true });
const PORT = 8765, base = `http://127.0.0.1:${PORT}`;

// Le mail() de PHP est redirigé vers un fichier : aucun e-mail réel n'est envoyé pendant les tests.
const mailLog = join(root, 'qa-shots', 'mails.log');
writeFileSync(mailLog, '');
const php = spawn('php', ['-d', `sendmail_path=tee -a ${mailLog} > /dev/null`, '-S', `127.0.0.1:${PORT}`, '-t', join(root, 'dist')], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));

const pages = ['/', '/osteopathie/', '/osteopathie/nourrissons/', '/osteopathie/lombalgie/', '/osteopathie/mobilite-equilibre/', '/cabinet/', '/tarifs/', '/contact/', '/avis/', '/conseils/mal-de-dos/', '/mentions-legales/'];
const axeSrc = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const browser = await chromium.launch();
const report = [];

const probe = () => new Promise((res) => {
  let lcp = 0, el = '', cls = 0;
  new PerformanceObserver((l) => { const e = l.getEntries().at(-1); lcp = e.startTime; el = e.element ? e.element.tagName + (e.element.className ? '.' + String(e.element.className).split(' ')[0] : '') : ''; }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  setTimeout(() => {
    const vh = innerHeight;
    const rdv = [...document.querySelectorAll('a[href*="doctolib"]')].filter((a) => { const r = a.getBoundingClientRect(); return r.width && r.top >= 0 && r.bottom <= vh && getComputedStyle(a).visibility !== 'hidden'; }).length;
    const small = [...document.querySelectorAll('a, button, summary, select, input:not([type=hidden]):not([type=checkbox])')].filter((x) => {
      const r = x.getBoundingClientRect(); if (!r.width || x.closest('p, .hp, .nav:not(.is-open), .marquee, .faq-a, .crumbs, address, .footer-legal p:first-child')) return false;
      return r.height < 44 && getComputedStyle(x).visibility !== 'hidden';
    }).map((x) => (x.textContent.trim() || x.getAttribute('aria-label') || x.tagName).slice(0, 28));
    res({ lcp: Math.round(lcp), lcpEl: el, cls: +cls.toFixed(3), h1: document.querySelectorAll('h1').length, overflow: document.documentElement.scrollWidth - innerWidth, rdvVisible: rdv, small: [...new Set(small)].slice(0, 5) });
  }, 2500);
});

const profiles = [
  { n: 'desktop', ctx: { viewport: { width: 1440, height: 900 } } },
  { n: 'mobile', ctx: { ...devices['iPhone 13'] } },
  { n: 'small', ctx: { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true } },
];
for (const pr of profiles) {
  // 1) Mesures avec animations actives (rendu réel)
  const ctx = await browser.newContext(pr.ctx);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'load' });
    const r = await page.evaluate(probe);
    report.push({ vp: pr.n, p, ...r });
    if (pr.n !== 'small' && ['/', '/osteopathie/', '/contact/', '/osteopathie/lombalgie/'].includes(p)) {
      await page.screenshot({ path: join(shots, `${pr.n}${p.replace(/\//g, '_')}fold.png`) });
      for (let y = 0; y < 30; y++) { await page.mouse.wheel(0, 500); await page.waitForTimeout(120); }
      await page.waitForTimeout(800);
      await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
      await page.screenshot({ path: join(shots, `${pr.n}${p.replace(/\//g, '_')}full.png`), fullPage: true });
    }
  }
  // Formulaire réel (PHP) + menu mobile
  if (pr.n !== 'small') {
    await page.goto(base + '/contact/');
    await page.locator('#f-name').scrollIntoViewIfNeeded(); await page.waitForTimeout(1500);
    await page.click('form [type=submit]');
    const errs = await page.$$eval('.err:not([hidden])', (els) => els.map((e) => e.textContent));
    await page.waitForTimeout(3100); // le serveur refuse les envois en moins de 3 s (anti-robots)
    await page.fill('#f-name', 'Test Local'); await page.fill('#f-contact', '06 12 34 56 78');
    await page.selectOption('#f-for', 'Un adulte'); await page.check('#f-ok');
    await page.click('form [type=submit]'); await page.waitForTimeout(1200);
    report.push({ vp: pr.n, form: { errorsShown: errs.length, status: await page.textContent('[data-status]') } });
  }
  if (pr.n === 'mobile') {
    await page.goto(base + '/'); await page.click('[data-burger]'); await page.waitForTimeout(900);
    report.push({ vp: pr.n, menu: { expanded: await page.getAttribute('[data-burger]', 'aria-expanded'), focus: await page.evaluate(() => document.activeElement.textContent.trim()) } });
    await page.screenshot({ path: join(shots, 'mobile_menu.png') });
  }
  report.push({ vp: pr.n, jsErrors: errors.slice(0, 5) });
  await ctx.close();

  // 2) Accessibilité (axe) avec mouvement réduit : contenu entièrement visible
  if (pr.n === 'small') continue;
  const actx = await browser.newContext({ ...pr.ctx, reducedMotion: 'reduce' });
  const ap = await actx.newPage();
  for (const p of pages) {
    await ap.goto(base + p, { waitUntil: 'load' });
    await ap.addScriptTag({ content: axeSrc });
    const v = await ap.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] })).violations.map((x) => `${x.id} (${x.impact}) ×${x.nodes.length} : ${x.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`));
    report.push({ vp: pr.n + '-a11y', p, axe: v });
  }
  await actx.close();
}
// 404 réelle
const http = require('node:http');
const status404 = await new Promise((res) => http.get(base + '/page-inexistante/', (r) => { r.resume(); res(r.statusCode); }).on('error', () => res('erreur')));
report.push({ http404: status404 });
await browser.close();
php.kill();
report.push({ mailsCaptured: readFileSync(mailLog, 'utf8').split('Subject:').length - 1 });
writeFileSync(join(shots, 'report.json'), JSON.stringify(report, null, 1));

for (const x of report) {
  if (x.axe) console.log(`${x.vp.padEnd(13)} ${x.p.padEnd(28)} axe: ${x.axe.length ? x.axe.join(' ; ') : '0 violation'}`);
  else if (x.p) console.log(`${x.vp.padEnd(13)} ${x.p.padEnd(28)} LCP ${x.lcp} ms (${x.lcpEl}) · CLS ${x.cls} · H1 ${x.h1} · débord ${x.overflow} · RDV visibles ${x.rdvVisible}${x.small.length ? ' · petites cibles: ' + x.small.join(', ') : ''}`);
  else console.log(JSON.stringify(x));
}
