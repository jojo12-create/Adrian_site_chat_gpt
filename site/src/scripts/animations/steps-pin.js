/* « Une séance en quatre temps » : même mouvement desktop et mobile.
   Sticky + transform unique, synchronisé 1:1 avec le défilement vertical.
   Sous 480px de hauteur et en reduced motion : lecture verticale native. */
export function initStepsPin() {
  const sec = document.querySelector('[data-pin-steps]');
  const track = sec?.querySelector('.steps-track');
  const sticky = sec?.querySelector('.steps-sticky');
  if (!sec || !track || !sticky) return;
  const desktop = matchMedia('(min-width: 1024px)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let distance = 0, active = false, raf = 0, lastWidth = 0;

  const canPin = () => !reduce.matches &&
    (desktop.matches || (innerWidth >= 320 && innerHeight >= 480));
  const measure = () => {
    distance = Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
    sec.style.setProperty('--pin-dist', `${distance}px`);
  };
  const draw = () => {
    raf = 0;
    if (!active) return;
    const rect = sec.getBoundingClientRect();
    const range = Math.max(1, sec.offsetHeight - sticky.offsetHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / range));
    track.style.transform = `translate3d(${(-distance * progress).toFixed(2)}px,0,0)`;
  };
  const request = () => { if (!raf) raf = requestAnimationFrame(draw); };
  const refresh = () => {
    const next = canPin();
    active = next;
    sec.classList.toggle('is-pinned', next);
    if (next) { measure(); request(); }
    else {
      sec.style.removeProperty('--pin-dist');
      track.style.transform = '';
      track.style.removeProperty('will-change');
    }
  };

  lastWidth = document.documentElement.clientWidth;
  desktop.addEventListener('change', refresh);
  reduce.addEventListener('change', refresh);
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => {
    const width = document.documentElement.clientWidth;
    if (Math.abs(width - lastWidth) > 2) {
      lastWidth = width;
      refresh();
    } else request(); // Safari iOS : barre d'adresse, ne pas recalculer la distance.
  });
  addEventListener('orientationchange', refresh);
  addEventListener('load', () => { if (active) { measure(); request(); } });
  document.fonts?.ready.then(() => { if (active) { measure(); request(); } });
  if ('ResizeObserver' in window) {
    let timeout;
    const ro = new ResizeObserver(() => {
      if (!active) return;
      clearTimeout(timeout);
      timeout = requestAnimationFrame(() => { measure(); request(); });
    });
    ro.observe(track);
  }
  refresh();
}
