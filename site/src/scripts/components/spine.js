/* Colonne vertébrale : onglets accessibles (toujours) + modèle 3D (à la demande).
   - Par défaut, la colonne est un dessin SVG léger, synchronisé avec les onglets.
   - Le modèle 3D (Three.js, ~125 Ko compressés) n'est chargé que sur ordinateur
     (souris, écran ≥ 1024 px, WebGL, mouvement autorisé) et seulement quand la
     personne le demande (bouton « Explorer en 3D ») : jamais pendant le défilement.
     Téléphones et tablettes gardent le dessin : aucun téléchargement. */
export function initSpine(reduced) {
  const sec = document.querySelector('[data-spine-section]');
  if (!sec) return;
  const tabs = [...sec.querySelectorAll('[data-spine-tabs] [role="tab"]')];
  const box = sec.querySelector('[data-spine-canvas]');
  const verts = [...box.querySelectorAll('.spine-fallback .vert')];
  let api = null, current = tabs.find((t) => t.getAttribute('aria-selected') === 'true')?.dataset.zone || 'lombaires';

  const select = (zone, { focus = false, from3d = false } = {}) => {
    current = zone;
    tabs.forEach((t) => {
      const on = t.dataset.zone === zone;
      t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
      sec.querySelector('#' + t.getAttribute('aria-controls')).hidden = !on;
      if (on && focus) t.focus();
    });
    verts.forEach((v) => v.classList.toggle('on', v.dataset.zone === zone));
    if (!from3d) api?.setZone(zone);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t.dataset.zone));
    t.addEventListener('keydown', (e) => {
      const k = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (k === undefined) return; e.preventDefault();
      select(tabs[(k + tabs.length) % tabs.length].dataset.zone, { focus: true });
    });
  });
  select(current);

  /* --- 3D : appareil capable + intention --- */
  const capable = !reduced
    && matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches
    && (navigator.hardwareConcurrency || 8) > 2
    && (() => { try { const gl = document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl'); gl?.getExtension('WEBGL_lose_context')?.loseContext(); return !!gl; } catch { return false; } })();
  if (!capable) return;
  const btn = sec.querySelector('[data-spine-load]');
  const hint = sec.querySelector('[data-spine-hint]');
  btn.hidden = false;
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.querySelector('.btn-label').textContent = 'Chargement…';
    try {
      const { createSpine } = await import('../three/spine3d.js');
      api = createSpine(box, { reduced, mobile: false, initialZone: current, onZone: (z) => select(z, { from3d: true }) });
      box.classList.add('is-3d');
      btn.hidden = true;
      if (hint) hint.textContent = 'Glissez pour faire tourner, cliquez sur une zone';
    } catch { // réseau coupé : le dessin reste, on peut réessayer
      btn.disabled = false;
      btn.querySelector('.btn-label').textContent = 'Explorer en 3D';
    }
  });
}
