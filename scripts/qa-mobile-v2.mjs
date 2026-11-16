/* Adrianosteo Mobile V2 — assertions de rendu et captures multi-écrans.
   Exécuter après npm run build:demo et npm i --no-save playwright. */
import { spawn } from 'node:child_process';
import { mkdirSync, symlinkSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { categories } from '../content/categories.mjs';

const basePath = '/Adrian_site_chat_gpt/';
const root = resolve('.preview-root');
const shots = resolve('qa-mobile-v2');
mkdirSync(root, { recursive: true });
mkdirSync(shots, { recursive: true });
try { rmSync(join(root, 'Adrian_site_chat_gpt'), { recursive:true, force:true }); } catch {}
symlinkSync(resolve('dist'), join(root, 'Adrian_site_chat_gpt'), 'dir');
const port = 9778;
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', root], { stdio: 'ignore' });
const origin = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ headless: true });
let failures = [];
const report = [];

async function visit(page, path = '') {
  const url = origin + basePath + path;
  await page.goto(url, { waitUntil:'load' });
  await page.evaluate(() => document.fonts.ready);
  return url;
}
function check(ok, message) { if (!ok) failures.push(message); }
try {
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440]) {
    const height = width < 768 ? 780 : width < 1024 ? 1024 : 900;
    const context = await browser.newContext({ viewport:{ width, height }, deviceScaleFactor:1, isMobile:width<1024, hasTouch:width<1024 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await visit(page);
    const basics = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      heroImage: document.querySelector('.hero-visual img')?.complete,
      heroGrid: getComputedStyle(document.querySelector('.hero-grid')).display,
      titleRow: getComputedStyle(document.querySelector('.hero h1')).gridRowStart
    }));
    check(basics.h1 === 1, `${width}px: accueil sans H1 unique`);
    check(basics.heroImage === true, `${width}px: image principale non chargée`);
    check(basics.overflow <= 2, `${width}px: débordement horizontal ${basics.overflow}px`);
    if (width < 1024) {
      check(basics.titleRow === '1', `${width}px: titre principal non superposé à la photo`);
      const burger = page.locator('[data-burger]');
      await burger.click();
      check(await page.locator('#nav').evaluate(el => el.classList.contains('is-open')), `${width}px: menu ne s'ouvre pas`);
      const mega = page.locator('.nav-more').first();
      await mega.click();
      check(await page.locator('#nav').evaluate(el => el.classList.contains('has-expanded')), `${width}px: menu clair non activé`);
      const backdrop = await page.locator('#nav').evaluate(el => getComputedStyle(el).backgroundColor);
      check(backdrop !== 'rgb(36, 60, 47)', `${width}px: fond du menu non adapté`);
      await burger.click();
      check(!(await page.locator('body').evaluate(el => el.classList.contains('menu-open'))), `${width}px: menu non refermé`);
      const sec = page.locator('[data-pin-steps]');
      await sec.scrollIntoViewIfNeeded();
      const pinned = await sec.evaluate(el => el.classList.contains('is-pinned'));
      check(pinned, `${width}px: section quatre temps non épinglée`);
      const before = await page.locator('.steps-track').evaluate(el => getComputedStyle(el).transform);
      await page.mouse.wheel(0, 480);
      await page.waitForTimeout(160);
      const after = await page.locator('.steps-track').evaluate(el => getComputedStyle(el).transform);
      check(before !== after, `${width}px: animation des étapes ne progresse pas`);
    }
    await page.screenshot({ path:join(shots, `accueil-${width}.png`) });
    if (width === 390 || width === 1440) {
      for (const c of categories) {
        await visit(page, `osteopathie/${c.slug}/`);
        const metrics = await page.evaluate(() => ({
          h1: document.querySelectorAll('h1').length,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          hero: !!document.querySelector('.cat-hero'),
          symbol: !!document.querySelector('.cat-hero-visual .illu-xl')
        }));
        check(metrics.hero && metrics.symbol && metrics.h1===1 && metrics.overflow<=2,
          `${width}px: page ${c.slug} problème hero / contenu / largeur`);
        if (width===390) await page.screenshot({ path:join(shots, `categorie-${c.slug}-390.png`) });
      }
    }
    check(errors.length===0, `${width}px: erreurs JS ${errors.join(' | ')}`);
    report.push({width, ...basics, errors});
    await context.close();
  }
} finally {
  await browser.close();
  server.kill();
}
writeFileSync(join(shots,'report.json'), JSON.stringify({passed:failures.length===0,failures,report},null,2));
console.log(JSON.stringify({passed:failures.length===0, failures, testedWidths:report.map(x=>x.width)},null,2));
if (failures.length) process.exit(1);
