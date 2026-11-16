/* Défilant d'avis : bouton pause (WCAG 2.2.2), pause au survol et au focus.
   La pause hors écran est gérée par core/reveal.js (data-live). */
export function initMarquee() {
  const m = document.querySelector('[data-marquee]');
  const btn = document.querySelector('[data-marquee-toggle]');
  if (!m || !btn) return;
  const label = btn.querySelector('span');
  btn.addEventListener('click', () => {
    const paused = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(paused));
    label.textContent = paused ? 'Reprendre le défilement' : 'Mettre en pause';
    m.classList.toggle('is-paused', paused);
  });
  m.addEventListener('focusin', () => m.classList.add('is-paused'));
  m.addEventListener('focusout', () => btn.getAttribute('aria-pressed') !== 'true' && m.classList.remove('is-paused'));
}
