const loadImg = (src) => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = src; });
function pixels(img, w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0, w, h);
  return { w, h, d: x.getImageData(0, 0, w, h).data };
}
const sample = (p, u, v, ch) => {
  const x = Math.min(p.w - 1, Math.max(0, Math.round(u * (p.w - 1)))), y = Math.min(p.h - 1, Math.max(0, Math.round(v * (p.h - 1))));
  return p.d[(y * p.w + x) * 4 + ch];
};
export async function start2D({ $, stage, zones, state, select, openChooser }) {
  const base = `${import.meta.env.BASE_URL}anatomie-3d/`;
  const response = await fetch(base + 'fallback.json');
  if (!response.ok) throw new Error('illustrations introuvables');
  const DATA = await response.json(), assets = {};
  await Promise.all(Object.entries(DATA.views).map(async ([v, d]) => {
    assets[v] = { base: await loadImg(base + d.base) };
  }));
  await Promise.all(zones.map(async (z) => {
    Object.assign(z, DATA.zones[z.slug]);
    [z.layer, z.side] = z.view.split('_');
    z.img = await loadImg(base + z.glow); z.gp = pixels(z.img, 187, 234);
  }));
  function zonesAt(side, u, v) {
    return zones.filter((z) => z.side === side && Math.max(sample(z.gp, u, v, 0), sample(z.gp, u, v, 1)) > 9);
  }
  const c = document.createElement('canvas'); c.width = 842; c.height = 1052;
  c.style.objectFit = 'contain';
  c.setAttribute('role', 'img'); c.setAttribute('aria-label', 'Illustration anatomique. Les motifs sont accessibles depuis la liste.');
  stage.insertBefore(c, $('loading')); stage.classList.add('flat', 'ready');
  $('reset').hidden = true;
  $('loading').classList.add('msg');
  $('loading').textContent = 'Vue 2D — choisissez un motif dans la liste.';
  const x = c.getContext('2d');
  function draw() {
    const z = state.sel, v = z ? z.view : (state.mu && !state.sk ? 'muscles_face' : 'squelette_face');
    x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.drawImage(assets[v].base, 0, 0, c.width, c.height);
    if (!z && state.mu && state.sk) { x.globalAlpha = 0.55; x.drawImage(assets.muscles_face.base, 0, 0, c.width, c.height); x.globalAlpha = 1; }
    if (z) { x.globalCompositeOperation = 'lighter'; x.drawImage(z.img, 0, 0, c.width, c.height); }
  }
  c.addEventListener('click', (e) => {
    const r = c.getBoundingClientRect(), s = Math.min(r.width / c.width, r.height / c.height);
    const u = (e.clientX - r.left - (r.width - c.width * s) / 2) / (c.width * s), v = (e.clientY - r.top - (r.height - c.height * s) / 2) / (c.height * s);
    if (u < 0 || u > 1 || v < 0 || v > 1) return;
    const side = state.sel ? state.sel.side : 'face';
    const list = zonesAt(side, u, v);
    if (list.length === 1) select(list[0]); else if (list.length > 1) openChooser(list, e.clientX, e.clientY);
  });
  draw();
  return { layers: draw, highlight: draw, focus() {}, reset: draw };
}
