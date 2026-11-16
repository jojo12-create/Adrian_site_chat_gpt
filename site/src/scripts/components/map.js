/* Carte Google Maps : iframe chargée seulement au clic (vitesse + RGPD) */
export function initMap() {
  document.querySelectorAll('[data-map-load]').forEach((btn) => btn.addEventListener('click', () => {
    const frame = btn.closest('[data-map]');
    const iframe = document.createElement('iframe');
    iframe.src = frame.dataset.map;
    iframe.title = 'Carte : cabinet d’ostéopathie, 1 rue Louis Ganel, Villefontaine';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    frame.querySelector('.map-placeholder').remove();
    frame.appendChild(iframe);
    iframe.focus();
  }));
}
