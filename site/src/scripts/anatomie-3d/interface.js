import { ZONES3D } from '../../../../content/anatomie-3d.mjs';

export async function initAnatomie(root) {
const DATA = JSON.parse(root.querySelector('[data-anatomie-content]').textContent);
const RDV = DATA.rdv, BASE = import.meta.env.BASE_URL;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id) => root.querySelector('#' + id);
const stage = $('stage'), legend = $('legend'), panel = $('panel'), chooser = $('chooser'), drawer = $('drawer');
const zones = DATA.troubles.map((t) => ({ ...t }));
zones.forEach((z) => {
  z.z3 = ZONES3D[z.slug];
  const list = z.z3.steps || [z.z3], all = { g: {}, joints: [], layers: [] };          // union des étapes : sert au clic sur le modèle
  for (const c of list) {
    for (const [g, w] of Object.entries(c.g || {})) all.g[g] = Math.max(all.g[g] || 0, w);
    for (const j of (c.joints || [])) if (!all.joints.includes(j)) all.joints.push(j);
    for (const l of c.layers) if (!all.layers.includes(l)) all.layers.push(l);
  }
  z.all = all;
});
const cfg = (z, i = state.step) => (z.z3.steps ? z.z3.steps[i] : z.z3);


const state = { sk: true, mu: false, ne: false, vi: false, sel: null, step: 0 };
const LAYERS = ['sk', 'mu', 'ne', 'vi'];
let api = null;                                                          // moteur 3D ou repli 2D

/* ---------- Légende, panneau, tiroir ---------- */
legend.replaceChildren();
zones.forEach((z) => {
  const li = document.createElement('li');
  const b = document.createElement('button');
  b.type = 'button'; b.textContent = z.label; b.setAttribute('aria-pressed', 'false'); b.dataset.slug = z.slug;
  b.addEventListener('click', () => select(state.sel === z ? null : z));
  li.appendChild(b); legend.appendChild(li);
});
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function renderPanel(z) {
  panel.innerHTML = z ? `
    <h2>${esc(z.h1)}</h2>
    ${z.z3.steps ? `<div class="steps" role="group" aria-label="Parcours du motif">${z.z3.steps.map((st, i) => `<button type="button" class="step" data-step="${i}" aria-pressed="${i === state.step}">${esc(st.label)}</button>`).join('')}</div>` : ''}
    ${z.z3.steps && cfg(z).detail ? `<p class="detail">${esc(cfg(z).detail)}</p>` : ''}
    <p class="short">${esc(z.short)}</p>
    <p>${esc(z.lead)}</p>
    <div class="actions">
      <a class="anatomie-btn anatomie-btn-primary" href="${RDV}" target="_blank" rel="noopener">Prendre rendez-vous</a>
      <a class="anatomie-btn anatomie-btn-ghost" href="${BASE}osteopathie/${z.slug}/">En savoir plus</a>
    </div>
    <p class="note">Information générale, ne remplace pas une consultation.</p>`
    : '<p class="hint">Sélectionnez un motif dans la liste, ou touchez une zone du corps. Faites glisser pour tourner, pincez ou utilisez la molette pour zoomer.</p>';
  $('handle-sub').textContent = z ? z.label + (z.z3.steps ? ' · ' + cfg(z).label : '') : 'Choisissez une zone';
  panel.querySelectorAll('.step').forEach((b) => b.addEventListener('click', () => goStep(Number(b.dataset.step), false)));
}
function setDrawer(open) { drawer.classList.toggle('open', open); $('handle').setAttribute('aria-expanded', String(open)); }
$('handle').addEventListener('click', () => setDrawer(!drawer.classList.contains('open')));

function syncLayers() { LAYERS.forEach((k) => $('l-' + k).setAttribute('aria-pressed', String(state[k]))); }
function toggleLayer(k) {
  state[k] = !state[k];
  if (!LAYERS.some((l) => state[l])) state[k] = true;                    // toujours une couche visible
  stopTour();
  if (state.sel && cfg(state.sel).layers.some((l) => !state[l])) select(null, { keepView: true });
  syncLayers(); api && api.layers();
}
LAYERS.forEach((k) => $('l-' + k).addEventListener('click', () => toggleLayer(k)));
$('reset').addEventListener('click', () => { select(null, { keepView: true }); api && api.reset(); });

/* Parcours : certains motifs se visitent étape par étape (articulation par articulation, puis vue d'ensemble) */
let tourTimer = null;
function stopTour() { clearTimeout(tourTimer); tourTimer = null; }
function goStep(i, auto) {
  const z = state.sel; if (!z) return;
  stopTour(); state.step = i;
  const c = cfg(z), hadFocus = document.activeElement && document.activeElement.classList.contains('step');
  LAYERS.forEach((k) => { state[k] = c.layers.includes(k); }); syncLayers();
  renderPanel(z);
  if (hadFocus) { const b = panel.querySelector('.step[aria-pressed="true"]'); if (b) b.focus(); }
  if (api) { api.layers(); api.highlight(z, i); api.focus(z, i); }
  if (auto && !reduced && z.z3.steps && i < z.z3.steps.length - 1) tourTimer = setTimeout(() => goStep(i + 1, true), 4800);
}
function select(z, { keepView = false } = {}) {
  closeChooser(); stopTour();
  state.sel = z; state.step = 0;
  legend.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(!!z && b.dataset.slug === z.slug)));
  if (z) { setDrawer(true); goStep(0, true); return; }
  renderPanel(null);
  if (api) { api.layers(); api.highlight(null); if (!keepView) api.reset(); }
}
function closeChooser() { chooser.classList.remove('open'); chooser.innerHTML = ''; }
function openChooser(list, x, y) {
  chooser.innerHTML = '<p>Plusieurs motifs ici :</p>';
  list.forEach((z) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = z.label;
    b.addEventListener('click', () => select(z)); chooser.appendChild(b);
  });
  const r = stage.getBoundingClientRect();
  chooser.style.left = Math.max(8, Math.min(x - r.left, r.width - 210)) + 'px';
  chooser.style.top = Math.max(60, Math.min(y - r.top, r.height - 60 - 44 * list.length)) + 'px';
  chooser.classList.add('open'); chooser.querySelector('button').focus();
}
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeChooser(); });


const ctx = { $, stage, zones, state, cfg, reduced, LAYERS, stopTour, select, closeChooser, openChooser };
$('loading').textContent = 'Chargement de la vue 3D…';
try {
  const c = document.createElement('canvas');
  // Three.js r171 requires WebGL 2.
  const gl = c.getContext('webgl2');
  if (!gl) throw new Error('WebGL 2 indisponible');
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  const { start3D } = await import('./engine.js');
  api = await start3D(ctx);
  root.dataset.mode = '3d';
} catch (error) {
  console.warn('Repli anatomique 2D :', error);
  stage.querySelectorAll('canvas').forEach((n) => n.remove());
  try {
    const { start2D } = await import('./fallback.js');
    api = await start2D(ctx);
    root.dataset.mode = '2d';
  } catch (fallbackError) {
    console.warn('Illustrations indisponibles :', fallbackError);
    $('loading').textContent = 'La vue anatomique est indisponible. Les motifs restent accessibles dans la liste.';
    $('reset').hidden = true;
    root.dataset.mode = 'unavailable';
    return;
  }
}
api.layers();
if (state.sel) { api.highlight(state.sel, state.step); api.focus(state.sel, state.step); }
}
