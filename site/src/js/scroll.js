/* Animations liées au défilement (GSAP + ScrollTrigger).
   Toutes en transform/opacity pour rester fluides et ne pas pénaliser le LCP. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* Apparitions : montée douce + fondu, par lots, une seule fois.
   Les éléments déjà visibles au chargement ne sont pas masqués (pas de flash). */
export function initReveals() {
  const els = gsap.utils.toArray('[data-reveal]').filter((el) => el.getBoundingClientRect().top > innerHeight * 0.92);
  // Opacité seule (pas visibility) : le contenu reste atteignable au clavier et par les lecteurs d'écran
  gsap.set(els, { y: 40, opacity: 0 });
  const show = (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true });
  ScrollTrigger.batch(els, { start: 'top 88%', once: true, onEnter: show });
  // Un élément qui reçoit le focus clavier est révélé immédiatement
  document.addEventListener('focusin', (e) => {
    const el = e.target.closest('[data-reveal]');
    if (el && gsap.getProperty(el, 'opacity') < 1) gsap.to(el, { y: 0, opacity: 1, duration: 0.3, overwrite: true });
  });
}

/* Parallaxe : data-parallax="-8" = déplacement en % sur la traversée de l'écran */
export function initParallax() {
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax) || 0;
    gsap.fromTo(el, { yPercent: -amount / 2 }, { yPercent: amount / 2, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    // Image intérieure légèrement agrandie : effet de profondeur
    const img = el.querySelector('img');
    if (img) gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* Compteurs animés (uniquement des chiffres réels) */
export function initCounters() {
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const end = +el.dataset.count, obj = { v: 0 };
    el.textContent = '0';
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to(obj, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(obj.v); } }) });
  });
}

/* Forme organique du hero : morphing SVG entre plusieurs contours (même structure de points) */
export function initMorph() {
  const path = document.querySelector('[data-morph]');
  if (!path) return;
  const shapes = [
    'M421,317Q401,384,343,424Q285,464,214,438Q143,412,121,341Q99,270,140,206Q181,142,254,121Q327,100,384,149Q441,198,441,257.5Q441,317,421,317Z',
    'M446,300Q414,360,365,410Q316,460,244,449Q172,438,131,377Q90,316,111,245Q132,174,195,135Q258,96,331,117Q404,138,441,189Q478,240,446,300Z',
    'M400,330Q420,400,350,436Q280,472,215,427Q150,382,118,315Q86,248,139,193Q192,138,264,112Q336,86,372,152Q408,218,394,274Q380,330,400,330Z',
  ];
  const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 6, ease: 'sine.inOut' } });
  shapes.slice(1).concat(shapes[0]).forEach((d) => tl.to(path, { attr: { d } }));
  gsap.to('.hero-shape', { rotate: 25, yPercent: 15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}

/* « Une séance en 4 temps » : section épinglée, défilement horizontal (grand écran seulement) */
export function initStepsPin() {
  const sec = document.querySelector('[data-pin-steps]');
  if (!sec) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    sec.classList.add('is-pinned');
    const track = sec.querySelector('.steps-track');
    const dist = () => track.scrollWidth - innerWidth;
    const tween = gsap.to(track, { x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 } });
    // Chaque étape : image qui se dévoile en entrant
    sec.querySelectorAll('.step-media').forEach((m) => gsap.fromTo(m, { clipPath: 'inset(0 0 0 30% round 30px)' }, { clipPath: 'inset(0 0 0 0% round 30px)', ease: 'none',
      scrollTrigger: { trigger: m, containerAnimation: tween, start: 'left 95%', end: 'left 45%', scrub: true } }));
    return () => sec.classList.remove('is-pinned');
  });
}

/* Progression de lecture : barre en haut (mobile), « axe » doré à gauche (grand écran) */
export function initProgress(reduced) {
  const bar = document.querySelector('.progress span');
  if (!bar) return;
  const vertical = () => matchMedia('(min-width: 1200px)').matches;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, scrollY / max) : 0;
    bar.style.transform = vertical() ? `scaleY(${p})` : `scaleX(${p})`;
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}
