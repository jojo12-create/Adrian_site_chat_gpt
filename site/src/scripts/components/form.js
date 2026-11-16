/* Formulaire « Être rappelé » : validation claire, erreurs sous chaque champ,
   envoi vers /api/contact.php (PHP, gratuit, présent chez la plupart des hébergeurs).
   Sans JS, le formulaire s'envoie normalement et le PHP redirige vers /contact/#envoye ou #erreur. */

const rules = {
  name: (v) => (v.trim().length >= 2 ? '' : 'Indiquez votre nom et prénom.'),
  contact: (v) => {
    const s = v.trim();
    if (!s) return 'Indiquez un téléphone ou un e-mail pour que je puisse vous répondre.';
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
    const phone = /^(\+33|0033|0)[1-9]\d{8}$/.test(s.replace(/[\s.\-()]/g, ''));
    return email || phone ? '' : 'Ce numéro ou cet e-mail ne semble pas valide. Exemple : 06 12 34 56 78 ou nom@exemple.fr';
  },
  for: (v) => (v ? '' : 'Choisissez la personne concernée par la séance.'),
  consent: (_, el) => (el.checked ? '' : 'Cochez la case pour que je puisse vous recontacter.'),
};
const ids = { name: 'e-name', contact: 'e-contact', for: 'e-for', consent: 'e-consent' };

export function initForm() {
  const form = document.querySelector('[data-form]');
  if (!form) return;
  const status = form.querySelector('[data-status]');
  const btn = form.querySelector('[type="submit"]');
  const time = form.querySelector('[data-time]');
  if (time) time.value = String(Date.now()); // anti-robot : délai minimal côté serveur


  const show = (name, msg) => {
    const el = form.elements[name], err = document.getElementById(ids[name]);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    err.textContent = msg; err.hidden = !msg;
  };
  const check = (name) => { const el = form.elements[name]; const msg = rules[name](el.value, el); show(name, msg); return !msg; };
  Object.keys(rules).forEach((n) => {
    const el = form.elements[n];
    // Une erreur affichée disparaît dès que la saisie devient valide (pendant la frappe), pas à la sortie du champ :
    // sinon la page remonte au moment où l'on clique sur l'élément suivant, et le clic tombe à côté.
    const recheck = () => el.getAttribute('aria-invalid') === 'true' && check(n);
    el.addEventListener('input', recheck);
    el.addEventListener('change', recheck);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = ''; status.className = 'form-status';
    const bad = Object.keys(rules).filter((n) => !check(n));
    if (bad.length) { form.elements[bad[0]].focus(); status.textContent = 'Merci de corriger les champs signalés.'; status.classList.add('ko'); return; }
    // Maquette en ligne : aucune donnée n'est envoyée
    if (document.body.hasAttribute('data-demo')) { status.textContent = 'Démonstration : le formulaire sera actif sur le site définitif. Aucune donnée n’a été envoyée.'; status.classList.add('ok'); return; }
    const label = btn.querySelector('.btn-label'); const original = label.textContent;
    btn.disabled = true; label.textContent = 'Envoi en cours…';
    try {
      const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) { if (j.field) { show(j.field, j.error); form.elements[j.field].focus(); } throw new Error(j.error || r.status); }
      form.reset(); if (time) time.value = String(Date.now() - 60000);
      status.textContent = 'Merci, votre demande est bien envoyée. Je vous recontacte dès que possible.';
      status.classList.add('ok');
    } catch {
      status.textContent = "L'envoi n'a pas abouti. Réessayez, ou appelez le 06 09 22 49 38.";
      status.classList.add('ko');
    } finally { btn.disabled = false; label.textContent = original; }
  });
}
