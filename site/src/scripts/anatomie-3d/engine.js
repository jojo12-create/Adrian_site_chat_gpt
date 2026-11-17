import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';

export async function start3D({ $, stage, zones, state, cfg, reduced, LAYERS, stopTour, select, closeChooser, openChooser }) {
  let dirty = true;

  /* ---------- Modèle : BodyParts3D allégé (positions 16 bits, groupes anatomiques) ---------- */
  const res = await fetch(`${import.meta.env.BASE_URL}anatomie-3d/model.bin`);
  if (!res.ok) throw new Error('modèle introuvable');
  const buf = await res.arrayBuffer();
  const hl = new DataView(buf).getUint32(0, true), base = 4 + hl;
  const head = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, hl)));

  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Corps humain en 3D, squelette et muscles, à faire tourner. Les motifs sont aussi accessibles depuis la liste.');
  stage.insertBefore(canvas, $('loading'));

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(28, 1, 0.05, 50);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.minDistance = 0.35; controls.maxDistance = 9;
  controls.minPolarAngle = 0.2; controls.maxPolarAngle = 2.95;
  controls.screenSpacePanning = true;

  /* ---------- Matériaux : sépia mat, bords fondus dans le fond, brillance crème ---------- */
  const NS = 10;                                                         // halos sphériques (articulations)
  const lutData = new Uint8Array(64 * 4);
  const lut = new T.DataTexture(lutData, 64, 1); lut.magFilter = lut.minFilter = T.NearestFilter; lut.needsUpdate = true;
  const spheres = Array.from({ length: NS }, () => new T.Vector4(0, 0, 0, 0));
  const shared = { lut: { value: lut }, spheres: { value: spheres }, glow: { value: 0 }, dim: { value: 1 },
    glowCol: { value: new T.Vector3(0.808, 0.702, 0.592) }, bg: { value: new T.Vector3(0.44, 0.35, 0.295) } };
  /* Teinte de chaque organe (couche viscères), dans la gamme sépia */
  const tintData = new Uint8Array(64 * 4).fill(255);
  const TINT = { 24: [0.60, 0.40, 0.33], 41: [0.80, 0.57, 0.47], 42: [0.82, 0.62, 0.51], 43: [0.72, 0.51, 0.41], 44: [0.52, 0.28, 0.22],
    45: [0.78, 0.62, 0.58], 46: [0.64, 0.27, 0.24], 47: [0.56, 0.33, 0.27], 48: [0.71, 0.53, 0.45] };
  for (const [g, c] of Object.entries(TINT)) c.forEach((x, i) => { tintData[g * 4 + i] = Math.round(x * 255); });
  const tintLut = new T.DataTexture(tintData, 64, 1); tintLut.magFilter = tintLut.minFilter = T.NearestFilter; tintLut.needsUpdate = true;
  shared.tintLut = { value: tintLut }; shared.bySphere = { value: 0 };
  const VERT = `
    attribute float gid; attribute vec4 aux;
    varying vec3 vN; varying vec3 vV; varying vec3 vW; varying vec3 vNw; varying float vG; varying vec4 vA;
    void main(){ vG = gid; vA = aux; vW = position; vNw = normal; vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalMatrix * normal; vV = -mv.xyz; gl_Position = projectionMatrix * mv; }`;
  const FRAG = `
    precision highp float;
    uniform sampler2D lut, tintLut; uniform vec4 spheres[${NS}];
    uniform vec3 cLo, cHi, glowCol, bg; uniform float opacity, glow, dim, kind, bySphere;
    varying vec3 vN; varying vec3 vV; varying vec3 vW; varying vec3 vNw; varying float vG; varying vec4 vA;
    float h1(float n){ return fract(sin(n * 127.1) * 43758.5453); }
    float n1(float x){ float i = floor(x), f = fract(x); f = f*f*(3.0-2.0*f); return mix(h1(i), h1(i+1.0), f); }
    float h3(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
    float n3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
      return mix(mix(mix(h3(i), h3(i+vec3(1,0,0)), f.x), mix(h3(i+vec3(0,1,0)), h3(i+vec3(1,1,0)), f.x), f.y),
                 mix(mix(h3(i+vec3(0,0,1)), h3(i+vec3(1,0,1)), f.x), mix(h3(i+vec3(0,1,1)), h3(i+vec3(1,1,1)), f.x), f.y), f.z); }
    void main(){
      vec3 V = normalize(vV);
      vec3 N = dot(vN, vN) > 1e-12 ? normalize(vN) : V;                     // normale dégénérée : pas de pixel parasite
      float ndv = clamp(dot(N, V), 0.0, 1.0);
      vec3 Ld = normalize(vec3(0.25, 0.75, 0.6));
      float h = dot(N, Ld) * 0.5 + 0.5;                                     // lumière diffuse, haut et face
      float px = length(fwidth(vW));                                        // taille d'un pixel sur le modèle : les détails fins s'effacent de loin
      vec3 lo = cLo, hi = cHi; float spec = 0.05;
      if (kind > 2.5) {                                                     // viscères : teinte par organe, tissu finement marbré, aspect humide
        vec3 t = texture2D(tintLut, vec2((vG + 0.5) / 64.0, 0.5)).rgb; hi = t; lo = t * 0.36;
        float m = (n3(vW * 110.0) - 0.5) * clamp(1.0 - px * 80.0, 0.0, 1.0) + (n3(vW * 330.0) - 0.5) * 0.7 * clamp(1.0 - px * 240.0, 0.0, 1.0);
        hi *= 1.0 + 0.26 * m; spec = 0.22;
      } else if (kind > 1.5) {                                              // nerfs : gaine lisse, léger satiné
        hi *= 1.0 + 0.14 * (n3(vW * 260.0) - 0.5) * clamp(1.0 - px * 190.0, 0.0, 1.0); spec = 0.16;
      } else if (kind > 0.5) {                                              // muscles : surface unie, extrémités tendineuses plus claires
        float tend = smoothstep(0.80, 0.985, abs(vA.w * 2.0 - 1.0));
        hi = mix(hi, vec3(0.78, 0.67, 0.58), tend); lo = mix(lo, vec3(0.42, 0.34, 0.28), tend);
        spec = 0.08 * (1.0 - tend) + 0.03;
      } else {                                                              // os : grain fin et légères variations de teinte
        float gr = (n3(vW * 620.0) - 0.5) * clamp(1.0 - px * 450.0, 0.0, 1.0) + (n3(vW * 150.0) - 0.5) * clamp(1.0 - px * 110.0, 0.0, 1.0);
        hi *= 1.0 + 0.13 * gr; lo *= 1.0 + 0.08 * gr; spec = 0.06;
      }
      vec3 col = mix(lo, hi, pow(h, 1.5));
      col *= mix(1.0, vA.x, kind > 0.5 && kind < 1.5 ? 0.3 : 0.8);                                          // ombrage des creux, calculé à la construction du modèle
      col += spec * pow(max(dot(N, normalize(Ld + V)), 0.0), 26.0) * vA.x;
      col = mix(bg, col, 0.5 + 0.5 * pow(ndv, 0.55));                       // contours estompés (sfumato)
      float wl = texture2D(lut, vec2((vG + 0.5) / 64.0, 0.5)).r, sp = 0.0, near = 0.0;
      for (int i = 0; i < ${NS}; i++) { vec4 s = spheres[i]; if (s.w > 0.0) { float d = distance(vW, s.xyz);
        sp = max(sp, 1.0 - smoothstep(s.w * 0.3, s.w, d)); near = max(near, 1.0 - smoothstep(s.w, s.w * 2.4, d)); } }
      float w = max(sp * 0.55, wl * mix(1.0, near, bySphere));               // articulation : portion d'os éclairée, tendons et ligaments voisins en pleine brillance
      float g = w * glow;
      vec3 lit = min(col * vec3(1.62, 1.52, 1.38) + glowCol * 0.10, vec3(0.93, 0.86, 0.76));   // la zone s'éclaire en gardant son modelé
      col = mix(col * dim, lit, g);
      gl_FragColor = vec4(col, opacity);
    }`;
  const SKIN_FRAG = `
    precision highp float;
    uniform float opacity; varying vec3 vN; varying vec3 vV;
    void main(){
      float ndv = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
      float rim = smoothstep(0.4, 1.0, 1.0 - ndv);                         // transparent partout, sauf le contour
      gl_FragColor = vec4(0.80, 0.70, 0.61, rim * rim * 0.42 * opacity);
    }`;
  const mk = (lo, hi, o, kind) => new T.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, transparent: true, side: T.FrontSide,   // faces externes seules : les parois internes ne transparaissent plus
    uniforms: { ...shared, cLo: { value: new T.Vector3(...lo) }, cHi: { value: new T.Vector3(...hi) }, opacity: { value: o }, kind: { value: kind } } });
  const mat = {
    skeleton: mk([0.33, 0.26, 0.21], [0.72, 0.62, 0.54], 1, 0),
    ligaments: mk([0.42, 0.35, 0.29], [0.82, 0.73, 0.64], 0, 0),            // ligaments et ménisques : affichés seulement pendant le parcours des articulations
    muscles: mk([0.29, 0.19, 0.15], [0.66, 0.46, 0.38], 0, 1),
    nerves: mk([0.40, 0.34, 0.22], [0.84, 0.75, 0.52], 0, 2),
    viscera: mk([0.30, 0.18, 0.16], [0.72, 0.53, 0.46], 0, 3),
    skin: new T.ShaderMaterial({ vertexShader: VERT, fragmentShader: SKIN_FRAG, transparent: true, depthWrite: false, depthTest: false, side: T.FrontSide, uniforms: { opacity: { value: 1 } } }),
  };
  const depthOnly = mk([0, 0, 0], [0, 0, 0], 1, 0); depthOnly.colorWrite = false;   // même programme que les muscles : profondeurs identiques        // pré-passe : une seule épaisseur de muscle en transparence
  const group = { skeleton: [], ligaments: [], muscles: [], nerves: [], viscera: [], pre: [] };
  for (const m of head.meshes) {
    const q = new Uint16Array(buf.slice(base + m.p, base + m.p + m.v * 6));
    for (let i = 3; i < q.length; i++) q[i] += q[i - 3];                    // positions codées par différences
    const g8 = new Uint8Array(buf, base + m.g, m.v);
    const idx = new Uint16Array(buf.slice(base + m.x, base + m.x + m.i * 2));
    for (let i = 1; i < idx.length; i++) idx[i] += idx[i - 1];
    const pos = new Float32Array(m.v * 3), gid = new Float32Array(m.v), k = head.ext / 65535;
    for (let i = 0; i < m.v; i++) { pos[3 * i] = q[3 * i] * k + head.min[0]; pos[3 * i + 1] = q[3 * i + 1] * k + head.min[1]; pos[3 * i + 2] = q[3 * i + 2] * k + head.min[2]; gid[i] = g8[i]; }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    geo.setAttribute('gid', new T.BufferAttribute(gid, 1));
    geo.setAttribute('aux', new T.BufferAttribute(new Uint8Array(buf.slice(base + m.a, base + m.a + m.v * 4)), 4, true));
    geo.setIndex(new T.BufferAttribute(idx, 1));
    geo.computeVertexNormals(); geo.computeBoundingSphere(); geo.computeBoundingBox();
    const mesh = new T.Mesh(geo, mat[m.layer]);
    mesh.renderOrder = { skeleton: 1, ligaments: 1, nerves: 1, viscera: 1, muscles: 3, skin: 4 }[m.layer];
    if (m.layer !== 'skeleton' && m.layer !== 'skin') mesh.visible = false;
    mesh.userData.layer = m.layer;
    scene.add(mesh);
    if (m.layer === 'muscles') {
      const pre = new T.Mesh(geo, depthOnly); pre.renderOrder = 2; pre.visible = false; scene.add(pre); group.pre.push(pre);
    }
    if (group[m.layer]) group[m.layer].push(mesh);
  }

  /* ---------- Halos (débordent des structures, comme sur les illustrations) ---------- */
  const hc = document.createElement('canvas'); hc.width = hc.height = 128;
  const hx = hc.getContext('2d'), gr = hx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  hx.fillStyle = gr; hx.fillRect(0, 0, 128, 128);
  const haloTex = new T.CanvasTexture(hc); haloTex.colorSpace = T.SRGBColorSpace;
  const halos = Array.from({ length: NS }, () => {
    const s = new T.Sprite(new T.SpriteMaterial({ map: haloTex, color: 0xceb397, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false }));
    s.renderOrder = 5; s.visible = false; s.userData.k = 0; scene.add(s); return s;
  });

  /* ---------- Zones 3D ---------- */
  const SIDES = ['left', 'right'];
  function zoneGeom(c) {
    const pts = [], hl = [];
    if (c.joints) for (const j of c.joints) for (const s of SIDES) { const p = head.joints[j + '_' + s]; pts.push(p); hl.push({ p, sx: 0.26, sy: 0.26 }); }
    const mn = [9, 9, 9], mx = [-9, -9, -9];
    const grow = (p) => { for (let a = 0; a < 3; a++) { mn[a] = Math.min(mn[a], p[a]); mx[a] = Math.max(mx[a], p[a]); } };
    pts.forEach(grow);
    for (const g of (c.focus || [])) { grow(head.groups[g].min); grow(head.groups[g].max); }
    let ctr = mn.map((v, a) => (v + mx[a]) / 2); const size = mx.map((v, a) => v - mn[a]);
    let ext = Math.max(size[0], size[1]) / 2;
    if (!c.joints) hl.push({ p: ctr, sx: size[0] * 1.5 + 0.22, sy: size[1] * 1.25 + 0.2 });
    if (c.cam) { ctr = head.joints[c.cam]; ext = 0.095; }                    // gros plan sur une articulation
    return { ctr, ext, halos: hl.slice(0, NS) };
  }
  zones.forEach((z) => { z.g3s = (z.z3.steps || [z.z3]).map(zoneGeom); });

  /* ---------- Caméra : coordonnées sphériques autour de la cible ---------- */
  const narrow = () => Math.max(1, 0.62 / camera.aspect);
  const HOME = { target: new T.Vector3(0, 0.88, 0), az: 0.5, pol: 1.5, r: 4.3 };
  const sph = new T.Spherical(), off = new T.Vector3();
  function place(target, az, pol, r) {
    off.setFromSphericalCoords(r, pol, az);
    controls.target.copy(target); camera.position.copy(target).add(off); camera.lookAt(target);
  }
  let travel = null;
  const stopTravel = () => { if (travel) { travel.kill(); travel = null; } };
  controls.autoRotate = !reduced; controls.autoRotateSpeed = 1.6;         // rotation lente tant qu'on n'a pas touché
  controls.addEventListener('start', () => { controls.autoRotate = false; stopTravel(); stopTour(); });   // toute interaction interrompt le travelling
  function flyTo(target, az, pol, r) {
    stopTravel(); controls.autoRotate = false;
    if (reduced) { place(target, az, pol, r); controls.update(); return; }
    const t0 = controls.target.clone();
    sph.setFromVector3(off.copy(camera.position).sub(t0));
    const a0 = sph.theta, p0 = sph.phi, r0 = sph.radius;
    let da = (az - a0) % (2 * Math.PI);                                   // arc le plus court
    if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI;
    const turn = Math.min(1, Math.abs(da) / Math.PI);
    const o = { p: 0 }, cur = new T.Vector3();
    travel = gsap.to(o, {
      p: 1, duration: 1.2 + 0.6 * turn, ease: 'power2.inOut',
      onUpdate() {
        const p = o.p, lift = 0.9 * turn * Math.sin(Math.PI * p);         // recul pendant les grands tours : jamais à travers le corps
        place(cur.lerpVectors(t0, target, p), a0 + da * p, p0 + (pol - p0) * p, r0 + (r - r0) * p + lift);
      },
      onComplete() { travel = null; },
    });
  }
  function zoneView(z, i) {
    const g = z.g3s[i], c = cfg(z, i), fit = (g.ext * 1.9 + 0.14) / Math.tan(T.MathUtils.degToRad(camera.fov / 2));
    return { target: new T.Vector3(...g.ctr), az: c.az, pol: c.cam ? 1.32 : 1.45, r: Math.min(7, fit * (c.cam ? 1 : narrow())) };
  }

  /* ---------- Couches et brillance ---------- */
  const KEY = { sk: 'skeleton', mu: 'muscles', ne: 'nerves', vi: 'viscera', li: 'ligaments' };
  function layers() {
    dirty = true;
    const inner = state.ne || state.vi;                                   // les muscles s'effacent pour laisser voir l'intérieur
    /* Muscles seuls : le squelette reste dessous (crâne, mains, pieds), sinon on voit à travers les zones sans muscle */
    const want = { sk: state.sk || state.mu ? 1 : 0, ne: state.ne ? 1 : 0, vi: state.vi ? 1 : 0, mu: state.mu ? (inner ? 0.32 : state.sk ? 0.5 : 1) : 0 };
    want.li = state.sel && cfg(state.sel).joints ? 1 : 0;
    for (const k of [...LAYERS, 'li']) {
      const u = mat[KEY[k]].uniforms.opacity, to = want[k];
      /* la pré-passe de profondeur ne sert qu'aux muscles translucides : coupée quand ils sont opaques, pour ne rien superposer */
      const show = (on) => { group[KEY[k]].forEach((m) => { m.visible = on; }); if (k === 'mu') group.pre.forEach((m) => { m.visible = on && to < 0.99; }); };
      gsap.killTweensOf(u);
      if (to > 0) show(true);
      if (reduced) { u.value = to; show(to > 0); continue; }
      gsap.to(u, { value: to, duration: 0.55, ease: 'power1.inOut', onComplete: () => show(u.value > 0.01) });
    }
  }
  const sel = { k: 0 };
  function highlight(z, step = 0) {
    dirty = true;
    gsap.killTweensOf(sel); gsap.killTweensOf(shared.dim);
    if (z) {
      const c = cfg(z, step), G = z.g3s[step];
      lutData.fill(0);
      for (const [g, w] of Object.entries(c.g || {})) lutData[g * 4] = Math.round(w * 255);
      lut.needsUpdate = true;
      shared.bySphere.value = c.joints ? 1 : 0;
      const js = c.joints ? c.joints.flatMap((j) => SIDES.map((s) => head.joints[j + '_' + s])) : [];
      spheres.forEach((v, i) => { const p = js[i]; if (p) v.set(p[0], p[1], p[2], 0.075); else v.set(0, 0, 0, 0); });
      halos.forEach((h, i) => {
        const d = G.halos[i]; h.visible = !!d;
        if (d) { h.position.set(d.p[0], d.p[1], d.p[2]); h.scale.set(d.sx, d.sy, 1); }
      });
    }
    const to = z ? 1 : 0, d = z ? 0.74 : 1;
    if (reduced) { sel.k = to; shared.dim.value = d; if (!z) halos.forEach((h) => { h.visible = false; }); return; }
    gsap.to(sel, { k: to, duration: 0.6, ease: 'power2.out', onComplete: () => { if (!to) halos.forEach((h) => { h.visible = false; }); } });
    gsap.to(shared.dim, { value: d, duration: 0.6 });
  }

  /* ---------- Clic sur le modèle ---------- */
  const ray = new T.Raycaster(), ndc = new T.Vector2(), hp = new T.Vector3();
  const CODE = { skeleton: 'sk', muscles: 'mu', nerves: 'ne', viscera: 'vi' };
  function zonesFor(hit) {
    const layer = CODE[hit.object.userData.layer];
    const g = hit.object.geometry.attributes.gid.getX(hit.face.a);
    return zones.filter((z) => {
      const c = z.all;
      if (c.joints.some((j) => SIDES.some((s) => hp.fromArray(head.joints[j + '_' + s]).distanceTo(hit.point) < 0.085))) return true;
      return !c.joints.length && c.layers.includes(layer) && (c.g[g] || 0) >= 0.5;
    });
  }
  let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; closeChooser(); });
  canvas.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6 || performance.now() - down.t > 500) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const targets = LAYERS.filter((k) => state[k]).flatMap((k) => group[KEY[k]]);
    for (const h of ray.intersectObjects(targets, false)) {               // on traverse jusqu'à la première structure associée à un motif
      const list = zonesFor(h);
      if (list.length === 1) { select(list[0]); return; }
      if (list.length > 1) { openChooser(list, e.clientX, e.clientY); return; }
    }
  });

  /* ---------- Boucle ---------- */
  function resize() {
    dirty = true;
    const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage); resize();
  place(HOME.target, HOME.az, HOME.pol, HOME.r * narrow());
  let inView = true;
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; dirty = true; }).observe(stage);
  const clock = new T.Clock();
  renderer.setAnimationLoop(() => {
    if (document.hidden || !inView) return;
    const pulse = reduced ? 1 : 1 + 0.1 * Math.sin(clock.getElapsedTime() * 2.6);
    shared.glow.value = sel.k * pulse;
    /* L'enveloppe ne sert qu'aux vues larges : elle s'efface en gros plan, où ses facettes deviendraient visibles */
    mat.skin.uniforms.opacity.value = T.MathUtils.smoothstep(camera.position.distanceTo(controls.target), 1.5, 3.0);
    for (const h of halos) if (h.visible) h.material.opacity = 0.2 * sel.k * pulse;
    const changed = controls.update();
    // In reduced-motion mode the picture is static until a control changes it.
    // Keep updating OrbitControls so manual damping still settles as before.
    if (!reduced || dirty || changed) {
      renderer.render(scene, camera);
      dirty = false;
    }
  });
  stage.classList.add('ready');

  return {
    layers, highlight,
    focus(z, i = 0) { const v = zoneView(z, i); flyTo(v.target, v.az, v.pol, v.r); },
    reset() { flyTo(HOME.target, HOME.az, HOME.pol, HOME.r * narrow()); },
  };
}
