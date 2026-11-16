/* ==========================================================================
   COLONNE VERTÉBRALE 3D PROCÉDURALE (Three.js, MIT)
   Aucun modèle à télécharger : géométrie paramétrique légère, construite
   dans le navigateur. Chargée en différé (import dynamique) après le contenu.
   - 7 cervicales, 12 dorsales, 5 lombaires (corps, arc, épineuse, transverses)
   - disques intervertébraux, sacrum, coccyx, bassin, base du crâne
   - cage thoracique et poussière holographique (desktop seulement)
   - rotation : défilement + glisser (souris/doigt) ; zones survolables/cliquables
   ========================================================================== */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, MeshStandardMaterial, MeshBasicMaterial,
  CylinderGeometry, LatheGeometry, BoxGeometry, SphereGeometry, TorusGeometry, CapsuleGeometry, ConeGeometry,
  CatmullRomCurve3, Vector2, Vector3, Raycaster, HemisphereLight, DirectionalLight, PointLight,
  EdgesGeometry, LineSegments, LineBasicMaterial, BufferGeometry, Float32BufferAttribute, PointsMaterial, Points,
  Box3, Quaternion, DoubleSide, MathUtils,
} from 'three';

const C = { bone: 0xe9e2cf, gold: 0xbe9b4e, gold2: 0xd4b56c, green: 0x3e5e42, forest: 0x1b2e24 };

export function createSpine(container, { reduced = false, mobile = false, initialZone = 'lombaires', onZone } = {}) {
  /* ---------- Rendu ---------- */
  const renderer = new WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  scene.add(new HemisphereLight(0xfff7e6, C.forest, 0.95));
  const key = new DirectionalLight(0xffffff, 1.7); key.position.set(4, 6, 8); scene.add(key);
  const rim = new DirectionalLight(C.gold2, 1.4); rim.position.set(-5, 2, -6); scene.add(rim);
  const focus = new PointLight(C.gold2, 0, 6, 1.6); scene.add(focus);

  /* ---------- Matériaux (palette du site) ---------- */
  const mat = {
    bone: new MeshStandardMaterial({ color: C.bone, roughness: 0.42, metalness: 0.06, emissive: C.green, emissiveIntensity: 0.06, side: DoubleSide }),
    hi: new MeshStandardMaterial({ color: 0xf6e3ad, roughness: 0.3, metalness: 0.1, emissive: C.gold, emissiveIntensity: 0.6, side: DoubleSide }),
    disc: new MeshStandardMaterial({ color: C.gold, roughness: 0.3, emissive: C.gold, emissiveIntensity: 0.35, transparent: true, opacity: 0.8 }),
    discHi: new MeshStandardMaterial({ color: C.gold2, roughness: 0.2, emissive: C.gold2, emissiveIntensity: 0.9, transparent: true, opacity: 0.95 }),
    wire: new MeshBasicMaterial({ color: C.gold2, wireframe: true, transparent: true, opacity: 0.16 }),
    wireHi: new MeshBasicMaterial({ color: C.gold2, wireframe: true, transparent: true, opacity: 0.45 }),
    rib: new MeshBasicMaterial({ color: C.gold2, transparent: true, opacity: 0.38 }),
    ribHi: new MeshBasicMaterial({ color: C.gold2, transparent: true, opacity: 0.75 }),
    edge: new LineBasicMaterial({ color: C.gold2, transparent: true, opacity: 0.35 }),
  };
  const seg = mobile ? 10 : 22;           // niveau de détail
  const root = new Group(); scene.add(root);
  const zones = { cervicales: [], dorsales: [], lombaires: [], sacrum: [] };
  const pickables = [];

  const add = (parent, geo, material, zone, { pick = true, edges = false } = {}) => {
    const m = new Mesh(geo, material);
    m.userData = { zone, base: material };
    parent.add(m);
    zones[zone].push(m);
    if (pick) pickables.push(m);
    if (edges && !mobile) { const e = new LineSegments(new EdgesGeometry(geo, 40), mat.edge); e.userData = { zone, isEdge: true }; m.add(e); }
    return m;
  };

  /* ---------- Courbure physiologique (lordoses / cyphoses), +z = avant ---------- */
  const curve = new CatmullRomCurve3([
    new Vector3(0, 4.35, 0.0), new Vector3(0, 3.7, 0.28), new Vector3(0, 3.05, 0.08),   // cervicales (lordose)
    new Vector3(0, 1.9, -0.32), new Vector3(0, 0.6, -0.5), new Vector3(0, -0.55, -0.12), // dorsales (cyphose)
    new Vector3(0, -1.55, 0.36), new Vector3(0, -2.45, 0.2),                           // lombaires (lordose)
    new Vector3(0, -3.15, -0.25), new Vector3(0, -3.95, -0.5), new Vector3(0, -4.45, -0.25), // sacrum + coccyx
  ], false, 'centripetal');
  const total = curve.getLength();
  let s = 0;
  const up = new Vector3(0, 1, 0);
  const place = (obj, dist) => {           // positionne et oriente selon la tangente
    const u = MathUtils.clamp(dist / total, 0, 1);
    obj.position.copy(curve.getPointAt(u));
    const tan = curve.getTangentAt(u).negate();
    obj.quaternion.copy(new Quaternion().setFromUnitVectors(up, tan));
  };

  /* Corps vertébral : profil tourné à « taille » creusée, plus anatomique qu'un cylindre */
  const bodyGeo = (r, h) => {
    const n = mobile ? 5 : 9, pts = [new Vector2(0, -h / 2)];
    for (let k = 0; k <= n; k++) { const t = k / n; pts.push(new Vector2(r * (1 - 0.16 * Math.sin(t * Math.PI)) * (k === 0 || k === n ? 0.94 : 1), (t - 0.5) * h)); }
    pts.push(new Vector2(0, h / 2));
    return new LatheGeometry(pts, seg);
  };

  /* ---------- Vertèbre paramétrique ---------- */
  function vertebra(type, i, zone) {
    const g = new Group();
    const P = {
      C: { r: 0.3, h: 0.17, disc: 0.07, sp: 0.3, spTilt: 0.35, tr: 0.22 },
      T: { r: 0.36 + i * 0.012, h: 0.25 + i * 0.006, disc: 0.08, sp: 0.62, spTilt: 1.0, tr: 0.36 },
      L: { r: 0.5 + i * 0.015, h: 0.36, disc: 0.13, sp: 0.45, spTilt: 0.08, tr: 0.42 },
    }[type];
    // corps vertébral (cylindre réniforme)
    const body = add(g, bodyGeo(P.r, P.h), mat.bone, zone, { edges: true });
    body.scale.set(1.18, 1, 0.86);
    // arc postérieur (pédicules + lames) : demi-anneau derrière le corps
    const arch = add(g, new TorusGeometry(P.r * 0.72, P.r * 0.17, 6, mobile ? 8 : 14, Math.PI), mat.bone, zone);
    arch.rotation.x = -Math.PI / 2; arch.position.z = -P.r * 0.9;
    // apophyse épineuse : vers l'arrière, inclinée vers le bas (très inclinée au thorax)
    const spGeo = type === 'L' ? new BoxGeometry(P.r * 0.22, P.h * 0.85, P.sp) : new ConeGeometry(P.r * 0.2, P.sp, mobile ? 5 : 8);
    const sp = add(g, spGeo, mat.bone, zone);
    if (type === 'L') { sp.position.set(0, -0.02, -P.r * 1.62 - P.sp / 2); }
    else { sp.rotation.x = -(Math.PI / 2 + P.spTilt * 0.6); sp.position.set(0, -Math.sin(P.spTilt * 0.6) * P.sp * 0.5, -P.r * 1.62 - Math.cos(P.spTilt * 0.6) * P.sp * 0.45); }
    if (type === 'C' && i < 6) sp.scale.set(1.4, 1, 1); // épineuses bifides des cervicales
    // apophyses transverses (gauche / droite)
    for (const side of [-1, 1]) {
      const tr = add(g, new CapsuleGeometry(P.r * 0.14, P.tr * 1.2, 3, mobile ? 6 : 10), mat.bone, zone);
      tr.rotation.z = Math.PI / 2; tr.rotation.y = side * (type === 'T' ? 0.35 : 0.12);
      tr.position.set(side * (P.r * 0.85 + P.tr * 0.6), 0, -P.r * 0.75);
    }
    return { g, P };
  }

  /* ---------- Assemblage : C1 → L5 ---------- */
  const plan = [...Array(7)].map((_, i) => ['C', i, 'cervicales']).concat([...Array(12)].map((_, i) => ['T', i, 'dorsales']), [...Array(5)].map((_, i) => ['L', i, 'lombaires']));
  const thoracic = [];
  plan.forEach(([type, i, zone], k) => {
    const { g, P } = vertebra(type, i, zone);
    s += P.h / 2; place(g, s); root.add(g); s += P.h / 2;
    if (type === 'T') thoracic.push({ g, i, P });
    if (k < plan.length - 1) {          // disque intervertébral
      s += P.disc / 2;
      const d = new Mesh(new CylinderGeometry(P.r * 0.96, P.r * 0.96, P.disc, seg, 1), mat.disc);
      d.scale.set(1.18, 1, 0.86); d.userData = { zone, base: mat.disc, disc: true };
      place(d, s); root.add(d); zones[zone].push(d); pickables.push(d);
      s += P.disc / 2;
    }
  });

  /* ---------- Sacrum (5 pièces soudées) + coccyx ---------- */
  s += 0.12;
  const sacrum = new Group();
  for (let k = 0; k < 5; k++) {
    const w = 0.62 - k * 0.1, h = 0.2;
    const piece = add(sacrum, new CylinderGeometry(w, w - 0.08, h, mobile ? 6 : 10, 1), mat.bone, 'sacrum', { edges: true });
    piece.scale.set(1.35, 1, 0.42);
    piece.position.y = -k * 0.21; piece.position.z = -k * k * 0.018;
  }
  place(sacrum, s + 0.45); root.add(sacrum);
  s += 1.05;
  for (let k = 0; k < 4; k++) {         // coccyx
    const c = add(root, new SphereGeometry(0.11 - k * 0.018, mobile ? 8 : 12, mobile ? 6 : 10), mat.bone, 'sacrum');
    c.scale.set(1.3, 0.8, 1);
    place(c, s); s += 0.15;
  }

  /* ---------- Bassin : ailes iliaques + anneau pubien ---------- */
  const pelvis = new Group();
  const sacrumPos = sacrum.position.clone();
  for (const side of [-1, 1]) {
    const wing = add(pelvis, new SphereGeometry(1, mobile ? 14 : 26, mobile ? 8 : 14, 0, Math.PI * 0.95, Math.PI * 0.18, Math.PI * 0.42), mat.bone, 'sacrum');
    wing.scale.set(0.9, 1.05, 0.4);
    wing.rotation.set(0.2, side > 0 ? -0.95 : Math.PI + 0.95, side * 0.3);
    wing.position.set(side * 1.0, 0.1, 0.1);
    const wire = add(pelvis, new SphereGeometry(1.02, mobile ? 10 : 18, mobile ? 6 : 10, 0, Math.PI * 0.95, Math.PI * 0.18, Math.PI * 0.42), mat.wire, 'sacrum', { pick: false });
    wire.scale.copy(wing.scale); wire.rotation.copy(wing.rotation); wire.position.copy(wing.position);
    const acetab = add(pelvis, new TorusGeometry(0.2, 0.05, 6, 18), mat.bone, 'sacrum');
    acetab.position.set(side * 1.15, -0.75, 0.35); acetab.rotation.y = side * 1.2;
  }
  const pubis = add(pelvis, new TorusGeometry(0.62, 0.075, 8, mobile ? 20 : 40, Math.PI * 1.15), mat.bone, 'sacrum');
  pubis.rotation.set(Math.PI / 2 + 0.5, 0, -Math.PI * 0.075 + Math.PI);
  pubis.position.set(0, -0.95, 0.75);
  pelvis.position.copy(sacrumPos).add(new Vector3(0, 0.05, 0.2));
  root.add(pelvis);

  /* ---------- Base du crâne (filaire holographique) + condyles ---------- */
  const top = curve.getPointAt(0);
  const skull = add(root, new SphereGeometry(0.95, mobile ? 14 : 24, mobile ? 10 : 16, 0, Math.PI * 2, 0, Math.PI * 0.72), mat.wire, 'cervicales', { pick: false });
  skull.scale.set(1, 0.9, 1.15); skull.position.set(top.x, top.y + 0.85, top.z + 0.18);
  const occ = add(root, new TorusGeometry(0.42, 0.06, 6, 24), mat.bone, 'cervicales');
  occ.rotation.x = Math.PI / 2 - 0.2; occ.position.set(top.x, top.y + 0.2, top.z - 0.05);

  /* ---------- Cage thoracique (desktop) ---------- */
  if (!mobile) thoracic.forEach(({ g, i, P }) => {
    const R = 0.75 + Math.sin(((i + 1) / 13) * Math.PI) * 0.75;
    const floating = i >= 10, gap = floating ? Math.PI * 1.1 : Math.PI * 0.45;
    // anneau ouvert devant (sternum) : le tore est couché à plat, l'ouverture tournée vers l'avant
    const rib = new Mesh(new TorusGeometry(R, 0.045, 5, 48, Math.PI * 2 - gap), mat.rib);
    rib.rotation.set(-Math.PI / 2, 0, 0);
    const holder = new Group();
    const spin = new Group(); spin.rotation.y = -Math.PI / 2 + gap / 2; spin.add(rib); holder.add(spin);
    holder.scale.set(1.25, 1, 1);
    holder.position.set(0, -0.05, R - P.r * 0.75);
    holder.rotation.x = -0.32;
    rib.userData = { zone: 'dorsales', base: mat.rib, rib: true };
    zones.dorsales.push(rib);
    g.add(holder);
  });

  /* ---------- Poussière holographique ---------- */
  let dust = null;
  if (!mobile) {
    const n = 380, pos = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) { const a = Math.random() * Math.PI * 2, r = 1.6 + Math.random() * 2.6; pos.set([Math.cos(a) * r, (Math.random() - 0.5) * 11, Math.sin(a) * r], k * 3); }
    const geo = new BufferGeometry(); geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
    dust = new Points(geo, new PointsMaterial({ color: C.gold2, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false }));
    scene.add(dust);
  }

  /* ---------- Centrage ---------- */
  const box = new Box3().setFromObject(root); const center = box.getCenter(new Vector3());
  root.position.sub(center);
  const height = box.max.y - box.min.y;

  /* ---------- Surbrillance d'une zone ---------- */
  let selected = null, hovered = null;
  const swap = (m, on) => {
    if (m.userData.isEdge) return;
    const b = m.userData.base;
    m.material = !on ? b : b === mat.disc ? mat.discHi : b === mat.wire ? mat.wireHi : b === mat.rib ? mat.ribHi : mat.hi;
  };
  function paint() {
    for (const [z, list] of Object.entries(zones)) list.forEach((m) => swap(m, z === selected || z === hovered));
    const active = hovered || selected;
    if (active) {
      const zb = new Box3(); zones[active].forEach((m) => zb.expandByObject(m));
      focus.position.copy(zb.getCenter(new Vector3())).add(new Vector3(0, 0, 2.2));
      focus.intensity = 6;
    } else focus.intensity = 0;
    requestRender();
  }
  const setZone = (z) => { selected = z; paint(); };

  /* ---------- Interaction : glisser + survol + clic ---------- */
  const el = renderer.domElement;
  const ray = new Raycaster(), ptr = new Vector2();
  let drag = 0, tilt = 0, velocity = 0, down = null, moved = false;
  const pick = (e) => {
    const r = el.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(pickables, false)[0];
    return hit ? hit.object.userData.zone : null;
  };
  el.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; moved = false; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove', (e) => {
    if (down) {
      const dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      velocity = dx * 0.006; drag += velocity; tilt = MathUtils.clamp(tilt + dy * 0.003, -0.35, 0.35);
      down = { x: e.clientX, y: e.clientY }; requestRender();
    } else if (e.pointerType === 'mouse') {
      const z = pick(e);
      if (z !== hovered) { hovered = z; el.style.cursor = z ? 'pointer' : 'grab'; paint(); }
    }
  });
  const end = (e) => {
    if (down && !moved) { const z = pick(e); if (z) { selected = z; paint(); onZone?.(z); } }
    down = null;
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', () => { down = null; });
  el.addEventListener('pointerleave', () => { if (hovered) { hovered = null; paint(); } });

  /* ---------- Taille ---------- */
  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fit = (height / 2 + 0.6) / Math.tan(MathUtils.degToRad(camera.fov / 2));
    camera.position.set(0, 0, Math.max(fit, (2.6 / camera.aspect) / Math.tan(MathUtils.degToRad(camera.fov / 2))));
    camera.updateProjectionMatrix();
    requestRender();
  }
  new ResizeObserver(resize).observe(container);

  /* ---------- Boucle : seulement quand la section est visible ---------- */
  let visible = true, raf = 0, t0 = performance.now();
  function requestRender() { if (reduced && !raf) raf = requestAnimationFrame(frame); }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); }).observe(container);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(frame); });

  function frame(now) {
    raf = 0;
    const t = (now - t0) / 1000;
    // rotation pilotée par le défilement de la section
    const r = container.getBoundingClientRect();
    const p = MathUtils.clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
    if (!down) { velocity *= 0.92; drag += velocity; }
    const idle = reduced ? 0 : t * 0.12;
    root.rotation.y = (reduced ? 0.5 : (p - 0.5) * Math.PI * 1.6) + drag + idle;
    root.rotation.x = tilt;
    if (!reduced) {
      root.position.y = -center.y + Math.sin(t * 0.8) * 0.06;  // légère flottaison
      if (dust) dust.rotation.y = t * 0.04;
      const pulse = 0.5 + Math.sin(t * 2.4) * 0.18;
      mat.hi.emissiveIntensity = pulse; mat.discHi.emissiveIntensity = pulse + 0.3;
    }
    renderer.render(scene, camera);
    if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }

  resize();
  setZone(initialZone);
  raf = requestAnimationFrame(frame);
  return { setZone };
}
