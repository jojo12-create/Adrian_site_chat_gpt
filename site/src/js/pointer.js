/* Interactions souris : curseur personnalisé, boutons magnétiques, inclinaison 3D légère.
   Actives uniquement avec une souris (pointer: fine) : rien sur tactile. */
import { gsap } from 'gsap';

export function initPointer() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  /* --- Curseur : point doré qui grossit sur les liens, étiquette « RDV » sur les boutons de réservation --- */
  const cur = document.querySelector('.cursor');
  const label = cur?.querySelector('.cursor-label');
  if (cur) {
    const x = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
    const y = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
    addEventListener('pointermove', (e) => { x(e.clientX); y(e.clientY); cur.classList.add('is-on'); }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('a, button, summary, [role="tab"], label');
      const txt = t?.dataset.cursor;
      cur.classList.toggle('is-link', !!t && !txt);
      cur.classList.toggle('is-label', !!txt);
      if (label) label.textContent = txt || '';
    });
  }

  /* --- Boutons magnétiques : le bouton suit légèrement la souris --- */
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.45)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.45)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.25);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });

  /* --- Inclinaison 3D légère (6° max) + reflet qui suit la souris --- */
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 12); rx((0.5 - py) * 12);
      el.style.setProperty('--mx', `${px * 100}%`); el.style.setProperty('--my', `${py * 100}%`);
      el.style.setProperty('--px', px.toFixed(3)); el.style.setProperty('--py', py.toFixed(3)); // symbole en relief : il se tourne vers la souris
    });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); el.style.removeProperty('--px'); el.style.removeProperty('--py'); });
  });
}
