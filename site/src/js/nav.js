/* En-tête et menu mobile */

/* En-tête : fond au défilement, masqué en descendant, réaffiché en remontant.
   Le bouton flottant mobile se cache quand le pied de page (qui a son propre CTA) est visible. */
export function initHeader() {
  const header = document.querySelector('[data-header]');
  const fab = document.querySelector('.fab');
  const footer = document.querySelector('.footer');
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-solid', y > 24);
    const menuOpen = document.body.classList.contains('menu-open');
    header.classList.toggle('is-hidden', !menuOpen && y > 400 && y > last + 4);
    if (y < last - 4) header.classList.remove('is-hidden');
    last = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  // Le header reste visible quand un élément y reçoit le focus clavier
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  if (fab && 'IntersectionObserver' in window) {
    // Caché tant que les boutons du haut de page ou le pied de page (qui ont leur propre RDV) sont visibles
    const watched = [document.querySelector('main .actions'), footer].filter(Boolean);
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      fab.classList.toggle('is-hidden', visible.size > 0);
    });
    watched.forEach((el) => io.observe(el));
  }
}

/* Menu mobile : ouverture en cercle (CSS), état annoncé, Échap, focus piégé */
export function initMenu(lenis) {
  const btn = document.querySelector('[data-burger]');
  const nav = document.getElementById('nav');
  if (!btn || !nav) return;
  const label = btn.querySelector('.sr-only');
  const focusables = () => [btn, ...nav.querySelectorAll('a')];
  const set = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    open ? lenis?.stop() : lenis?.start();
    if (open) setTimeout(() => nav.querySelector('a')?.focus(), 350);
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (btn.getAttribute('aria-expanded') !== 'true') return;
    if (e.key === 'Escape') { set(false); btn.focus(); }
    if (e.key === 'Tab') { // piège à focus dans le menu ouvert
      const f = focusables(); const first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    }
  });
  matchMedia('(min-width: 1024px)').addEventListener('change', (m) => m.matches && set(false));
}
