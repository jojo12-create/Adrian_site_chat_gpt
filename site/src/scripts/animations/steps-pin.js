/* « Une séance en quatre temps » : sur grand écran, la section reste en place
   (position: sticky, en CSS) pendant que les étapes défilent à l'horizontale.
   Le déplacement suit le défilement 1:1 (pas d'inertie ajoutée, rien à rattraper
   si l'on défile vite) ; un seul transform, écrit une fois par image.
   Sous 1024 px ou en mouvement réduit : pile verticale classique. */
export function initStepsPin() {
  const sec = document.querySelector('[data-pin-steps]');
  const track = sec?.querySelector('.steps-track');
  if (!track) return;
  const wide = matchMedia('(min-width: 1024px)');
  let dist = 0, ticking = false, on = false;

  const measure = () => {
    dist = Math.max(0, track.scrollWidth - innerWidth);
    sec.style.setProperty('--pin-dist', `${dist}px`);
  };
  const update = () => {
    ticking = false;
    if (!on) return;
    const r = sec.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, -r.top / (r.height - innerHeight || 1)));
    track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px, 0, 0)`;
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  const set = () => {
    on = wide.matches;
    sec.classList.toggle('is-pinned', on);
    if (on) { measure(); update(); } else { track.style.transform = ''; sec.style.removeProperty('--pin-dist'); }
  };
  wide.addEventListener('change', set);
  addEventListener('resize', () => { if (on) { measure(); request(); } });
  addEventListener('scroll', request, { passive: true });
  addEventListener('load', () => on && measure());
  set();
}
