/* Navigation mobile V2 : ouverture circulaire, verrouillage iOS et thème adaptatif. */
const items = () => [...document.querySelectorAll('[data-menu]')];

function syncMenuTheme() {
  const hasOpen = items().some(li => li.classList.contains('is-open'));
  const nav = document.getElementById('nav');
  nav?.classList.toggle('has-expanded', hasOpen);
  document.body.classList.toggle('menu-light', hasOpen && document.body.classList.contains('menu-open'));
}
function setMega(li, open) {
  li.classList.toggle('is-open', open);
  li.querySelector('.nav-more')?.setAttribute('aria-expanded', String(open));
  syncMenuTheme();
}
function closeMegas(except) {
  items().forEach(li => { if (li !== except && li.classList.contains('is-open')) setMega(li, false); });
  syncMenuTheme();
}

export function initMenu() {
  const btn = document.querySelector('[data-burger]');
  const nav = document.getElementById('nav');
  if (!btn || !nav) return;
  const label = btn.querySelector('.sr-only');
  const mobile = matchMedia('(max-width: 1023px)');
  let open = false;
  let savedY = 0;
  let savedStyles = null;

  const lockScroll = () => {
    savedY = window.scrollY;
    savedStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      htmlOverflow: document.documentElement.style.overflow,
    };
    Object.assign(document.body.style, {
      position: 'fixed', top: `-${savedY}px`, left: '0', right: '0', width: '100%'
    });
    document.documentElement.style.overflow = 'hidden';
  };
  const unlockScroll = () => {
    if (!savedStyles) return;
    Object.assign(document.body.style, {
      position: savedStyles.position, top: savedStyles.top,
      left: savedStyles.left, right: savedStyles.right, width: savedStyles.width
    });
    document.documentElement.style.overflow = savedStyles.htmlOverflow;
    savedStyles = null;
    window.scrollTo(0, savedY);
  };
  const focusables = () => [btn, ...[...nav.querySelectorAll('a, button')]
    .filter(el => getComputedStyle(el).visibility !== 'hidden' && !el.closest('.mega:not([style])')?.closest('.has-menu:not(.is-open)'))];

  const set = (next) => {
    if (!mobile.matches && next) return;
    if (open === next) { if (!mobile.matches) nav.inert = false; return; }
    open = next;
    if (next) {
      lockScroll();
      document.querySelector('[data-header]')?.classList.remove('is-hidden');
    }
    btn.setAttribute('aria-expanded', String(next));
    if (label) label.textContent = next ? 'Fermer le menu' : 'Ouvrir le menu';
    nav.inert = !next && mobile.matches;
    nav.classList.toggle('is-open', next);
    document.body.classList.toggle('menu-open', next);
    if (!next) {
      closeMegas();
      unlockScroll();
    } else {
      nav.querySelector('.nav-link')?.focus({ preventScroll: true });
    }
    syncMenuTheme();
  };
  nav.inert = mobile.matches;
  btn.addEventListener('click', () => set(!open));
  document.addEventListener('keydown', e => {
    if (!open) return;
    if (e.key === 'Escape') { set(false); btn.focus(); }
    if (e.key === 'Tab') {
      const f = focusables();
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
  });
  mobile.addEventListener('change', () => {
    if (!mobile.matches) { set(false); nav.inert = false; }
    else nav.inert = !open;
  });
}

/* Navigation desktop inchangée ; le blanc ne concerne que le menu ouvert mobile. */
export function initMegaMenus() {
  const desktop = matchMedia('(min-width: 1024px)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  items().forEach(li => {
    const btn = li.querySelector('.nav-more');
    const preview = li.querySelector('[data-mega-preview]');
    btn?.addEventListener('click', () => {
      const next = !li.classList.contains('is-open');
      if (next) closeMegas(li);
      setMega(li, next);
    });
    let t;
    li.addEventListener('pointerenter', e => {
      if (!desktop.matches || !hover.matches || e.pointerType !== 'mouse') return;
      clearTimeout(t); t = setTimeout(() => { closeMegas(li); setMega(li, true); }, 90);
    });
    li.addEventListener('pointerleave', e => {
      if (!desktop.matches || e.pointerType !== 'mouse') return;
      clearTimeout(t); t = setTimeout(() => setMega(li, false), 220);
    });
    li.addEventListener('focusout', e => {
      if (desktop.matches && !li.contains(e.relatedTarget)) setMega(li, false);
    });
    if (preview) {
      let swap;
      const show = txt => {
        if (preview.textContent === txt) return;
        clearTimeout(swap); preview.classList.add('is-swap');
        swap = setTimeout(() => { preview.textContent = txt; preview.classList.remove('is-swap'); }, 160);
      };
      li.querySelectorAll('[data-preview]').forEach(a => {
        a.addEventListener('pointerenter', () => show(a.dataset.preview));
        a.addEventListener('focus', () => show(a.dataset.preview));
      });
      li.querySelector('.mega-in')?.addEventListener('pointerleave', () => show(preview.dataset.default));
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const li = items().find(x => x.classList.contains('is-open'));
    if (li && desktop.matches) { setMega(li, false); li.querySelector('.nav-more')?.focus(); }
  });
  document.addEventListener('pointerdown', e => {
    if (desktop.matches && !e.target.closest('[data-menu]')) closeMegas();
  });
  desktop.addEventListener('change', () => closeMegas());
}
