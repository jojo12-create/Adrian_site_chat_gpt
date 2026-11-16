/* En-tête et progression de lecture : un seul passage par image au défilement.
   - fond de l'en-tête au défilement, masqué en descendant, réaffiché en remontant
   - barre de progression (mobile) / « axe » doré à gauche (grand écran)
   - bouton flottant mobile caché quand un autre bouton de RDV est déjà visible */
export function initHeader() {
  const header = document.querySelector('[data-header]');
  const bar = document.querySelector('.progress span');
  const fab = document.querySelector('.fab');
  const vertical = matchMedia('(min-width: 1200px)');
  let last = 0, ticking = false;

  // Hauteur de page mise en cache : aucune lecture de mise en page pendant le défilement
  let max = 0;
  const measure = () => { max = document.documentElement.scrollHeight - innerHeight; };
  new ResizeObserver(measure).observe(document.body);
  measure();

  const update = () => {
    ticking = false;
    const y = scrollY;
    header.classList.toggle('is-solid', y > 24);
    const open = document.body.classList.contains('menu-open') || header.querySelector('.has-menu.is-open');
    if (y < last - 4) header.classList.remove('is-hidden');
    else if (!open && y > 400 && y > last + 4) header.classList.add('is-hidden');
    last = y;
    if (bar) {
      const p = max > 0 ? Math.min(1, y / max) : 0;
      bar.style.transform = vertical.matches ? `scaleY(${p})` : `scaleX(${p})`;
    }
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => { measure(); request(); });
  update();

  // L'en-tête reste visible quand un élément y reçoit le focus clavier
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  if (fab && 'IntersectionObserver' in window) {
    const watched = [document.querySelector('main .actions'), document.querySelector('.footer')].filter(Boolean);
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      fab.classList.toggle('is-hidden', visible.size > 0);
      fab.inert = visible.size > 0; // caché = ni focus clavier ni lecture d'écran
    });
    watched.forEach((el) => io.observe(el));
  }
}
