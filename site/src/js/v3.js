/* ==========================================================================
   V3 : illustrations animées, hero en profondeur, colonne 3D (chargement différé)
   ========================================================================== */
import { gsap } from 'gsap';

/* Symboles en relief : entrée (une fois) puis rotation lente, en pause hors écran */
export function initIllus(reduced) {
  const els = document.querySelectorAll('[data-illu]');
  if (reduced || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
  const enter = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); enter.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  const live = new IntersectionObserver((entries) => entries.forEach((en) => en.target.classList.toggle('is-live', en.isIntersecting)));
  els.forEach((e) => { enter.observe(e); live.observe(e); });

  // Grand symbole des pages catégorie et article : il se tourne vers la souris, où qu'elle soit
  const big = [...document.querySelectorAll('.illu-xl')];
  if (!big.length || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  let raf = 0;
  addEventListener('pointermove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      big.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const clamp = (v) => Math.max(0, Math.min(1, v)).toFixed(3);
        el.style.setProperty('--px', clamp(0.5 + (e.clientX - r.left - r.width / 2) / innerWidth));
        el.style.setProperty('--py', clamp(0.5 + (e.clientY - r.top - r.height / 2) / innerHeight));
      });
    });
  }, { passive: true });
}

/* Hero : profondeur à la souris (calques data-depth), inclinaison 3D du portrait,
   et sortie en parallaxe au défilement */
export function initHeroDepth() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const layers = [...hero.querySelectorAll('[data-depth]')].map((el) => ({ el, d: +el.dataset.depth,
    x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }) }));
  const arch = hero.querySelector('[data-tilt-hero]');
  const rx = arch && gsap.quickTo(arch, 'rotationX', { duration: 1, ease: 'power3' });
  const ry = arch && gsap.quickTo(arch, 'rotationY', { duration: 1, ease: 'power3' });
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      layers.forEach((l) => { l.x(-nx * 40 * l.d); l.y(-ny * 30 * l.d); });
      if (arch) { ry(nx * 10); rx(-ny * 8); }
    });
    hero.addEventListener('pointerleave', () => { layers.forEach((l) => { l.x(0); l.y(0); }); if (arch) { rx(0); ry(0); } });
  }
  // Sortie au défilement : le texte monte et s'efface, le visuel recule
  gsap.to('[data-hero-text]', { yPercent: -12, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('[data-hero-visual]', { yPercent: 10, scale: 0.94, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
}

/* Colonne vertébrale : onglets accessibles + 3D chargée seulement à l'approche */
export function initSpine(reduced) {
  const sec = document.querySelector('[data-spine-section]');
  if (!sec) return;
  const tabs = [...sec.querySelectorAll('[data-spine-tabs] [role="tab"]')];
  const box = sec.querySelector('[data-spine-canvas]');
  const fallbackVerts = [...box.querySelectorAll('.spine-fallback .vert')];
  let api = null, current = tabs.find((t) => t.getAttribute('aria-selected') === 'true')?.dataset.zone || 'lombaires';

  const select = (zone, { focus = false, from3d = false } = {}) => {
    current = zone;
    tabs.forEach((t) => {
      const on = t.dataset.zone === zone;
      t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
      sec.querySelector('#' + t.getAttribute('aria-controls')).hidden = !on;
      if (on && focus) t.focus();
    });
    fallbackVerts.forEach((v) => v.classList.toggle('on', v.dataset.zone === zone));
    if (!from3d) api?.setZone(zone);
    const panel = sec.querySelector(`#sp-${zone}`);
    if (!reduced) gsap.fromTo(panel, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t.dataset.zone));
    t.addEventListener('keydown', (e) => {
      const k = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (k === undefined) return; e.preventDefault();
      select(tabs[(k + tabs.length) % tabs.length].dataset.zone, { focus: true });
    });
  });
  select(current);

  // WebGL disponible ? Sinon, la colonne SVG reste affichée (alternative statique).
  const gl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();
  if (!gl) return;
  const mobile = matchMedia('(max-width: 767px)').matches || (navigator.hardwareConcurrency || 8) <= 2;
  const load = async () => {
    const { createSpine } = await import('./spine3d.js');
    api = createSpine(box, { reduced, mobile, initialZone: current, onZone: (z) => select(z, { from3d: true }) });
    box.classList.add('is-3d');
  };
  // Chargement différé : après le contenu critique, à l'approche de la section
  const arm = () => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '600px 0px' });
    io.observe(sec);
  };
  if (document.readyState === 'complete') arm(); else addEventListener('load', arm, { once: true });
}
