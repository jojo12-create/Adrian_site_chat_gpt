/* ==========================================================================
   Adrian Rodriguez, ostéopathe : comportements du site (sans dépendance).
   Le site reste entièrement utilisable sans JavaScript (liens Doctolib,
   téléphone, menu accessible via le pied de page).
   ========================================================================== */
(() => {
  'use strict';
  const doc = document.documentElement;
  doc.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- En-tête : filet au défilement --- */
  const header = document.querySelector('[data-header]');
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle('is-scrolled', y > 8);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Menu mobile : état annoncé, Échap pour fermer, focus maîtrisé --- */
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('menu');
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      if (open) menu.querySelector('a')?.focus();
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    matchMedia('(min-width: 1024px)').addEventListener('change', (m) => m.matches && setOpen(false));
  }

  /* --- Révélation des photos (une fois, au défilement) --- */
  const reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  /* --- Année du copyright --- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* --- Formulaire de rappel : validation claire, erreurs sous chaque champ --- */
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector('[data-status]');
  const submit = form.querySelector('[data-submit]');
  const rules = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Indiquez votre nom et prénom.'),
    contact: (v) => {
      const s = v.trim();
      if (!s) return 'Indiquez un téléphone ou un e-mail pour que je puisse vous répondre.';
      const email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
      const phone = s.replace(/[\s.\-()]/g, '').match(/^(\+33|0033|0)[1-9]\d{8}$/);
      return email || phone ? '' : 'Ce numéro ou cet e-mail ne semble pas valide. Exemple : 06 12 34 56 78 ou nom@exemple.fr';
    },
    for: (v) => (v ? '' : 'Choisissez la personne concernée par la séance.'),
    consent: (_, el) => (el.checked ? '' : 'Cochez la case pour que je puisse vous recontacter.'),
  };
  const showError = (name, msg) => {
    const el = form.elements[name];
    const err = document.getElementById('e-' + name);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) { err.textContent = msg; err.hidden = !msg; }
  };
  const check = (name) => { const el = form.elements[name]; const msg = rules[name](el.value, el); showError(name, msg); return !msg; };
  Object.keys(rules).forEach((name) => {
    const el = form.elements[name];
    el.addEventListener('blur', () => el.getAttribute('aria-invalid') !== null && check(name));
    el.addEventListener('change', () => el.getAttribute('aria-invalid') === 'true' && check(name));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = ''; status.className = 'form-status';
    const invalid = Object.keys(rules).filter((n) => !check(n));
    if (invalid.length) { form.elements[invalid[0]].focus(); status.textContent = 'Merci de corriger les champs signalés.'; status.classList.add('ko'); return; }
    submit.disabled = true;
    const label = submit.querySelector('span');
    const original = label.textContent;
    label.textContent = 'Envoi en cours…';
    try {
      const data = Object.fromEntries(new FormData(form));
      data.consent = form.elements.consent.checked;
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (j.field) { showError(j.field, j.error); form.elements[j.field].focus(); }
        throw new Error(j.error || 'Erreur ' + r.status);
      }
      form.reset();
      status.textContent = 'Merci, votre demande est bien envoyée. Je vous recontacte rapidement.';
      status.classList.add('ok');
    } catch (err) {
      status.textContent = "L'envoi n'a pas abouti. Réessayez, ou appelez le 06 09 22 49 38.";
      status.classList.add('ko');
    } finally {
      submit.disabled = false; label.textContent = original;
    }
  });
})();
