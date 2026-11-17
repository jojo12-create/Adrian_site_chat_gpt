// Only this small entry point loads with the page. The renderer, GSAP and model
// are requested after the viewer intersects the viewport and the poster paints.
const root = document.querySelector('[data-anatomie]');
let started = false;
async function start() {
  if (started) return;
  started = true;
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
if (root) {
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
