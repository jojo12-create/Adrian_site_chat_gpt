/* « Une séance en quatre temps » : la section reste en place (position: sticky, en CSS)
   pendant que les quatre étapes défilent à l'horizontale, au rythme du défilement vertical.

   Rythme : sur téléphone, il faut défiler PACE_MOBILE fois la distance horizontale pour la
   parcourir (mouvement plus lent, plus posé). Une courte pause en début et en fin (HOLD)
   laisse lire la première et la dernière étape avant que la piste ne bouge.

   Coût : rien n'est calculé tant que la section est loin de l'écran ; pendant le
   défilement, aucune mesure de mise en page (positions mises en cache), un seul
   transform écrit par image. Sous 480 px de hauteur ou en mouvement réduit : pile verticale. */
const PACE_MOBILE = 1.5;   // 1 = suivi 1:1 ; 1,5 = une fois et demie plus de défilement pour la même distance
const PACE_DESKTOP = 1;
const HOLD = 0.06;         // part du parcours immobile au début et à la fin

export function initStepsPin() {
  const sec = document.querySelector('[data-pin-steps]');
  const track = sec?.querySelector('.steps-track');
  const sticky = sec?.querySelector('.steps-sticky');
  if (!sec || !track || !sticky) return;
  const desktop = matchMedia('(min-width: 1024px)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let distance = 0, range = 1, top = 0, active = false, near = false, raf = 0, lastWidth = 0, lastX = null;

  const canPin = () => !reduce.matches && (desktop.matches || (innerWidth >= 320 && innerHeight >= 480));

  // Toutes les lectures de mise en page sont ici, jamais dans draw()
  const measure = () => {
    distance = Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
    range = Math.max(1, distance * (desktop.matches ? PACE_DESKTOP : PACE_MOBILE));
    sec.style.setProperty('--pin-dist', `${Math.round(range)}px`);
    top = sec.getBoundingClientRect().top + scrollY;
  };
  const draw = () => {
    raf = 0;
    if (!active) return;
    const p = Math.max(0, Math.min(1, (scrollY - top) / range));
    const q = Math.max(0, Math.min(1, (p - HOLD) / (1 - 2 * HOLD)));
    const x = Math.round(-distance * q * 10) / 10;
    if (x === lastX) return; // rien n'a bougé : aucune écriture
    lastX = x;
    track.style.transform = `translate3d(${x}px,0,0)`;
  };
  const request = () => { if (active && near && !raf) raf = requestAnimationFrame(draw); };
  const refresh = () => {
    active = canPin();
    sec.classList.toggle('is-pinned', active);
    lastX = null;
    if (active) { measure(); if (!raf) raf = requestAnimationFrame(draw); }
    else { sec.style.removeProperty('--pin-dist'); track.style.transform = ''; }
  };

  // La section approche de l'écran : on réserve la couche graphique et on se recale
  // (les images et polices chargées plus haut ont pu déplacer la section)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      near = e.isIntersecting;
      sec.classList.toggle('is-near', near);
      if (near && active) { measure(); request(); }
    }, { rootMargin: '50% 0px' }).observe(sec);
  } else near = true;

  lastWidth = document.documentElement.clientWidth;
  desktop.addEventListener('change', refresh);
  reduce.addEventListener('change', refresh);
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => {
    const width = document.documentElement.clientWidth;
    if (Math.abs(width - lastWidth) > 2) { lastWidth = width; refresh(); }
    else request(); // Safari iOS : la barre d'adresse change la hauteur, pas la distance
  });
  addEventListener('orientationchange', refresh);
  addEventListener('load', () => { if (active) { measure(); request(); } });
  document.fonts?.ready.then(() => { if (active) { measure(); request(); } });
  if ('ResizeObserver' in window) {
    let pending = 0;
    new ResizeObserver(() => {
      if (!active || pending) return;
      pending = requestAnimationFrame(() => { pending = 0; measure(); request(); });
    }).observe(track);
  }
  refresh();
}
