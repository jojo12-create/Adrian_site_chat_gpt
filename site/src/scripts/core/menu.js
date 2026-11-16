/* Menu mobile et menus déroulants */

/* Menu mobile : ouverture en cercle (CSS), état annoncé, Échap, focus piégé */
export function initMenu() {
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
    if (!open) closeMegas();
    if (open) nav.querySelector('a')?.focus({ preventScroll: true });
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
