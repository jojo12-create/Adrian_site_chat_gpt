// Only this small entry point loads with the page. The renderer, GSAP and model
// are requested after the viewer intersects the viewport and the poster paints
// (dedicated page), or once the visitor asks for it (embedded sections).
const root = document.querySelector('[data-anatomie]');
let started = false;
async function start() {
  if (started) return;
  started = true;
  root.classList.add('is-started');
  try {
    const poster = root.querySelector('.poster');
    await poster.decode().catch(() => {});
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const { initAnatomie } = await import('./interface.js');
    await initAnatomie(root);
  } catch (error) {
    console.warn('Visualiseur indisponible :', error);
    root.querySelector('#loading').textContent = 'La vue anatomique est indisponible. Consultez les motifs dans la liste.';
  }
}
if (root && root.hasAttribute('data-anatomie-embedded')) {
  // Embedded in a scrolling page: nothing is downloaded and no gesture is
  // captured until the visitor asks. The first click on the button, a motif or
  // (desktop) nothing else starts the viewer, then is replayed on the live interface.
  const button = root.querySelector('[data-anatomie-load]');
  button.hidden = false;
  const onFirstClick = async (event) => {
    const target = event.target.closest('[data-anatomie-load], #legend a, #handle, .seg button');
    if (!target) return;
    event.preventDefault(); event.stopPropagation();
    root.removeEventListener('click', onFirstClick, true);
    const slug = target.matches('#legend a') ? target.getAttribute('href').replace(/\/$/, '').split('/').pop() : null;
    const replay = target.id && !target.matches('[data-anatomie-load]') ? '#' + target.id : null;
    button.disabled = true; button.textContent = 'Chargement…';
    await start();
    button.hidden = true;
    const next = slug ? root.querySelector(`#legend button[data-slug="${slug}"]`) : replay && root.querySelector(replay);
    if (next) { next.click(); next.focus({ preventScroll: true }); }
  };
  root.addEventListener('click', onFirstClick, true);
} else if (root) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        start();
      }
    });
    observer.observe(root);
  } else {
    start();
  }
}
