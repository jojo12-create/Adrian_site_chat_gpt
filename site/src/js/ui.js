/* Composants d'interface accessibles */
import { gsap } from 'gsap';

/* Onglets « Où ça coince ? » : clavier (flèches, Début, Fin) + colonne vertébrale qui s'allume */
export function initTabs() {
  const list = document.querySelector('[data-tabs]');
  if (!list) return;
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const verts = [...document.querySelectorAll('[data-spine] .vert')];
  const light = (range) => {
    const [a, b] = range.split(',').map(Number);
    verts.forEach((v, i) => setTimeout(() => v.classList.toggle('on', i >= a && i <= b), Math.abs(i - a) * 18));
  };
  const select = (tab, focus = true) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    light(tab.dataset.range);
    if (focus) tab.focus();
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.fromTo(panel, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t, false));
    t.addEventListener('keydown', (e) => {
      const k = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (k === undefined) return;
      e.preventDefault();
      select(tabs[(k + tabs.length) % tabs.length]);
    });
  });
  light(tabs[0].dataset.range);
}

/* Défilant d'avis : bouton pause (WCAG 2.2.2), pause au survol et au focus */
export function initMarquee() {
  const m = document.querySelector('[data-marquee]');
  const btn = document.querySelector('[data-marquee-toggle]');
  if (!m || !btn) return;
  const label = btn.querySelector('span');
  btn.addEventListener('click', () => {
    const paused = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(paused));
    label.textContent = paused ? 'Reprendre le défilement' : 'Mettre en pause';
    m.classList.toggle('is-paused', paused);
  });
  m.addEventListener('focusin', () => m.classList.add('is-paused'));
  m.addEventListener('focusout', () => btn.getAttribute('aria-pressed') !== 'true' && m.classList.remove('is-paused'));
}

/* FAQ : <details> natif, ouverture animée en hauteur */
export function initFaq(reduced) {
  if (reduced) return;
  document.querySelectorAll('.faq-item').forEach((d) => {
    const sum = d.querySelector('summary'), body = d.querySelector('.faq-a');
    sum.addEventListener('click', (e) => {
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, duration: 0.45, ease: 'power3.inOut', onComplete: () => { d.open = false; gsap.set(body, { clearProps: 'height' }); } });
      } else {
        d.open = true;
        gsap.fromTo(body, { height: 0 }, { height: 'auto', duration: 0.6, ease: 'expo.out', clearProps: 'height' });
      }
    });
  });
}

/* Carte Google Maps : iframe chargée seulement au clic (vitesse + RGPD) */
export function initMap() {
  document.querySelectorAll('[data-map-load]').forEach((btn) => btn.addEventListener('click', () => {
    const frame = btn.closest('[data-map]');
    const iframe = document.createElement('iframe');
    iframe.src = frame.dataset.map;
    iframe.title = 'Carte : cabinet d’ostéopathie, 1 rue Louis Ganel, Villefontaine';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    frame.querySelector('.map-placeholder').remove();
    frame.appendChild(iframe);
    iframe.focus();
  }));
}

/* Index des motifs : aperçu photo qui suit la souris (souris uniquement) */
export function initHoverPreview() {
  const list = document.querySelector('[data-hover-preview]');
  const box = document.querySelector('.hover-preview');
  if (!list || !box || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const x = gsap.quickTo(box, 'left', { duration: 0.5, ease: 'power3' });
  const y = gsap.quickTo(box, 'top', { duration: 0.5, ease: 'power3' });
  list.addEventListener('pointermove', (e) => { x(e.clientX + 160); y(e.clientY); });
  list.querySelectorAll('a').forEach((a) => {
    a.addEventListener('pointerenter', () => {
      box.classList.add('on');
      box.querySelectorAll('picture').forEach((p) => p.classList.toggle('on', p.dataset.for === a.dataset.preview));
    });
  });
  list.addEventListener('pointerleave', () => box.classList.remove('on'));
}
