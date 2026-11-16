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
    const menuOpen = document.body.classList.contains('menu-open') || !!document.querySelector('.has-menu.is-open');
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
      fab.inert = visible.size > 0; // caché = ni focus clavier ni lecture d'écran
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
  // Éléments atteignables au clavier : ceux d'un volet fermé (visibility: hidden) sont exclus
  const focusables = () => [btn, ...[...nav.querySelectorAll('a, button')].filter((el) => getComputedStyle(el).visibility !== 'hidden')];
  const set = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    open ? lenis?.stop() : lenis?.start();
    if (!open) closeMegas();
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

/* Menus déroulants des rubriques à plusieurs pages (motif « disclosure »).
   - Ordinateur : ouverture au survol (léger délai, pour ne pas s'ouvrir en passant)
     ou au clic sur la flèche ; Échap, clic ailleurs ou focus sorti referment.
   - Mobile : la flèche déplie le volet dans le menu plein écran.
   - Le lien de la rubrique reste un vrai lien vers sa page d'ensemble. */
const items = () => [...document.querySelectorAll('[data-menu]')];
function closeMegas(except) {
  items().forEach((li) => { if (li !== except) setMega(li, false); });
}
function setMega(li, open) {
  li.classList.toggle('is-open', open);
  li.querySelector('.nav-more').setAttribute('aria-expanded', String(open));
}
export function initMegaMenus() {
  const desktop = matchMedia('(min-width: 1024px)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  items().forEach((li) => {
    const btn = li.querySelector('.nav-more');
    const preview = li.querySelector('[data-mega-preview]');
    li.querySelectorAll('.mega-group li').forEach((x, k) => x.style.setProperty('--k', k));
    btn.addEventListener('click', () => {
      const open = !li.classList.contains('is-open');
      if (desktop.matches) closeMegas(li);
      setMega(li, open);
    });
    // Survol (souris, ordinateur)
    let t;
    li.addEventListener('pointerenter', (e) => {
      if (!desktop.matches || !hover.matches || e.pointerType !== 'mouse') return;
      clearTimeout(t); t = setTimeout(() => { closeMegas(li); setMega(li, true); }, 90);
    });
    li.addEventListener('pointerleave', (e) => {
      if (!desktop.matches || e.pointerType !== 'mouse') return;
      clearTimeout(t); t = setTimeout(() => setMega(li, false), 220);
    });
    // Le focus quitte la rubrique : on referme (ordinateur)
    li.addEventListener('focusout', (e) => { if (desktop.matches && !li.contains(e.relatedTarget)) setMega(li, false); });
    // Aperçu : la colonne de gauche décrit le lien survolé ou focalisé
    if (preview) {
      let swap;
      const show = (txt) => {
        if (preview.textContent === txt) return;
        clearTimeout(swap); preview.classList.add('is-swap');
        swap = setTimeout(() => { preview.textContent = txt; preview.classList.remove('is-swap'); }, 160);
      };
      li.querySelectorAll('[data-preview]').forEach((a) => {
        a.addEventListener('pointerenter', () => show(a.dataset.preview));
        a.addEventListener('focus', () => show(a.dataset.preview));
      });
      li.querySelector('.mega-in').addEventListener('pointerleave', () => show(preview.dataset.default));
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = items().find((li) => li.classList.contains('is-open'));
    if (open && desktop.matches) { setMega(open, false); open.querySelector('.nav-more').focus(); }
  });
  document.addEventListener('pointerdown', (e) => { if (desktop.matches && !e.target.closest('[data-menu]')) closeMegas(); });
  desktop.addEventListener('change', () => closeMegas());
}
