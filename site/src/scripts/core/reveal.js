/* Apparitions au défilement, sans bibliothèque (IntersectionObserver + transitions CSS).
   - [data-reveal] : fondu + légère montée, une seule fois. Seuls les éléments sous
     la ligne de flottaison sont préparés : rien de visible au chargement ne clignote.
   - [data-illu] : le symbole est « peint » à l'entrée (.is-in) et ne bouge
     que tant qu'il est à l'écran (.is-live).
   - [data-live] : animations CSS continues (défilant d'avis) en pause hors écran.
   Mouvement réduit : tout est affiché d'emblée, immobile. */
export function initReveals(reduced) {
  const illus = document.querySelectorAll('[data-illu]');
  if (reduced || !('IntersectionObserver' in window)) { illus.forEach((e) => e.classList.add('is-in')); return; }

  const below = [...document.querySelectorAll('[data-reveal]')].filter((el) => el.getBoundingClientRect().top > innerHeight * 0.92);
  below.forEach((el) => el.classList.add('reveal'));
  const enter = new IntersectionObserver((entries) => {
    // Éléments entrés ensemble : léger décalage (60 ms, 4 au plus), jamais une file d'attente
    entries.filter((e) => e.isIntersecting).forEach((e, i) => {
      e.target.style.transitionDelay = `${Math.min(i, 4) * 60}ms`;
      e.target.classList.add('is-in');
      enter.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  [...below, ...illus].forEach((el) => enter.observe(el));
  // Une fois apparu, l'élément redevient ordinaire : ses propres transitions (survol, inclinaison) reprennent la main
  document.addEventListener('transitionend', (e) => {
    const el = e.target;
    if (e.propertyName === 'opacity' && el.classList?.contains('reveal') && el.classList.contains('is-in')) { el.classList.remove('reveal'); el.style.transitionDelay = ''; }
  });
  // Un élément qui reçoit le focus clavier est révélé immédiatement
  document.addEventListener('focusin', (e) => e.target.closest?.('.reveal:not(.is-in)')?.classList.add('is-in'));

  const live = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('is-live', e.isIntersecting)));
  document.querySelectorAll('[data-illu], [data-live]').forEach((el) => live.observe(el));
}
