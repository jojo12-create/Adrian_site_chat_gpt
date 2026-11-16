/* Profondeur à la souris (souris uniquement, jamais au toucher) :
   - cartes [data-tilt] : inclinaison légère (4° max) et reflet qui suit la souris
   - symboles en relief : la scène se tourne vers la souris
   - hero : le portrait s'incline, les calques décoratifs se décalent un peu
   Les transforms sont écrits directement sur l'élément (pas de variable CSS héritée),
   une fois par image au plus ; le lissage est une transition CSS, donc interruptible. */
const clamp = (v) => Math.max(0, Math.min(1, v));
const stageTransform = (px, py) => `rotateX(${((0.5 - py) * 22).toFixed(2)}deg) rotateY(${((px - 0.5) * 28).toFixed(2)}deg)`;

export function initPointerDepth() {
  /* Cartes */
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const stage = el.querySelector('.illu-stage');
    let raf = 0, ev = null;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const px = clamp((ev.clientX - r.left) / r.width), py = clamp((ev.clientY - r.top) / r.height);
      el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 8).toFixed(2)}deg) rotateY(${((px - 0.5) * 8).toFixed(2)}deg)`;
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      if (stage) stage.style.transform = stageTransform(px, py);
    };
    el.addEventListener('pointermove', (e) => { ev = e; if (!raf) raf = requestAnimationFrame(apply); });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf); raf = 0;
      el.style.transform = '';
      if (stage) stage.style.transform = '';
    });
  });

  /* Grand symbole (pages catégorie et article) et hero : suivent la souris dans la fenêtre */
  const bigs = [...document.querySelectorAll('.illu-xl .illu-stage')];
  const hero = document.querySelector('[data-hero]');
  const layers = hero ? [...hero.querySelectorAll('[data-depth]')].map((el) => ({ el, d: +el.dataset.depth })) : [];
  const arch = hero?.querySelector('[data-tilt-hero]');
  if (!bigs.length && !hero) return;
  let raf = 0, ev = null;
  const apply = () => {
    raf = 0;
    const nx = ev.clientX / innerWidth - 0.5, ny = ev.clientY / innerHeight - 0.5;
    bigs.forEach((s) => {
      const r = s.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      s.style.transform = stageTransform(clamp(0.5 + (ev.clientX - r.left - r.width / 2) / innerWidth), clamp(0.5 + (ev.clientY - r.top - r.height / 2) / innerHeight));
    });
    if (hero && scrollY < innerHeight) {
      layers.forEach((l) => { l.el.style.transform = `translate3d(${(-nx * 20 * l.d).toFixed(1)}px, ${(-ny * 14 * l.d).toFixed(1)}px, 0)`; });
      if (arch) arch.style.transform = `rotateX(${(-ny * 4).toFixed(2)}deg) rotateY(${(nx * 5).toFixed(2)}deg)`;
    }
  };
  addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; ev = e; if (!raf) raf = requestAnimationFrame(apply); }, { passive: true });
}
