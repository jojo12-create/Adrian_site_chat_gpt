/* ==========================================================================
   ILLUSTRATIONS : une par catégorie (7 patients + 7 troubles).
   Style unique : trait forêt 3 px à bouts ronds, accents or, fond organique.
   Animation (CSS + JS) : tracé du trait au défilement (pathLength=1),
   flottaison douce, étincelle qui scintille, fond qui se transforme.
   ========================================================================== */

const spark = (x, y, s = 1) => `<path class="illu-spark" style="transform-origin:${x}px ${y}px" d="M${x} ${y - 9 * s}l${2.4 * s} ${6.6 * s} ${6.6 * s} ${2.4 * s}-${6.6 * s} ${2.4 * s}-${2.4 * s} ${6.6 * s}-${2.4 * s}-${6.6 * s}-${6.6 * s}-${2.4 * s} ${6.6 * s}-${2.4 * s}z"/>`;
const L = (d) => `<path class="l" pathLength="1" d="${d}"/>`;          // trait principal
const G = (d) => `<path class="g" pathLength="1" d="${d}"/>`;          // trait or
const F = (d, cls = 'f') => `<path class="${cls}" d="${d}"/>`;         // aplat
const C = (cx, cy, r, cls = 'l') => `<circle class="${cls}" pathLength="1" cx="${cx}" cy="${cy}" r="${r}"/>`;
const vert = (x, y, w, h = 11) => `M${x} ${y}h${w}a${h / 2} ${h / 2} 0 0 1 0 ${h}h-${w}a${h / 2} ${h / 2} 0 0 1 0-${h}z`;

const art = {
  /* ---------- PATIENTS ---------- */
  nourrissons: [
    F('M57 76Q55 114 80 126Q105 114 103 76Q92 67 80 71Q68 67 57 76Z', 'f gold-soft'),
    C(80, 56, 17), L('M57 76Q55 114 80 126Q105 114 103 76Q92 67 80 71Q68 67 57 76Z'),
    L('M62 86Q80 102 100 82'), L('M64 106Q82 95 98 109'),
    L('M73 55q2.5 2.5 5 0'), L('M83 55q2.5 2.5 5 0'), G('M75 63q5 4 10 0'),
    F('M118 44c-4-6-12-2-10 4 1 4 10 9 10 9s9-5 10-9c2-6-6-10-10-4z', 'f gold'), spark(40, 46),
  ],
  'enfants-adolescents': [
    F('M84 60h16a5 5 0 0 1 5 5v22a5 5 0 0 1-5 5H84z', 'f gold'),
    C(78, 42, 13), L('M78 55V94'), L('M78 66L60 80'), L('M78 66L98 58'), L('M78 94L66 122'), L('M78 94L92 120'),
    L('M84 60h16a5 5 0 0 1 5 5v22a5 5 0 0 1-5 5H84'), G('M104 40l14-16 12 14-14 16z'), G('M116 54q-4 10 4 20'), spark(42, 40),
  ],
  'femme-enceinte': [
    F('M74 80Q100 86 98 106Q96 118 80 121Q70 104 74 80Z', 'f gold-soft'),
    C(74, 38, 12), C(63, 31, 5.5, 'f gold'), L('M76 50Q79 57 74 63'),
    L('M74 63Q69 72 74 80Q100 86 98 106Q96 120 78 123'), L('M68 60Q58 86 64 124'), L('M71 84Q84 91 90 104'),
    F('M88 98c-3-4-9-1-7 3 1 3 7 6 7 6s6-3 7-6c2-4-4-7-7-3z', 'f gold'), spark(112, 44),
  ],
  adultes: [
    F('M56 92h48v22H56z', 'f gold-soft'),
    C(80, 46, 13), L('M55 106Q57 73 80 71Q103 73 105 106'), L('M56 92h48v22H56z'), L('M46 116h68'), G('M74 102h12'), spark(118, 40),
  ],
  seniors: [
    F('M64 36Q70 26 82 28Q90 30 90 40Q80 34 64 36Z', 'f gold-soft'),
    C(77, 42, 12), L('M64 37Q70 27 82 29Q90 31 90 40'), L('M77 54Q72 78 76 96'), L('M77 64Q88 74 97 79'),
    G('M99 74V124'), G('M99 74q-7-5-12 0'), L('M76 96L69 122'), L('M76 96L85 122'), spark(44, 50),
  ],
  sportifs: [
    C(94, 36, 10), L('M90 47L76 79'), L('M88 54L104 64L112 56'), L('M88 54L72 61L63 53'),
    L('M76 79L96 95L94 120'), L('M76 79L63 99L45 103'), G('M36 68h16'), G('M30 80h18'), G('M38 92h12'), spark(124, 34),
  ],
  'mobilite-equilibre': [
    C(80, 32, 10), L('M80 43L66 20'), L('M80 43L94 20'), L('M80 43V88'), L('M80 88V124'), L('M80 88L97 100L82 108'),
    G('M56 128Q80 118 104 128'), G('M50 66q-6 8 0 16'), G('M110 66q6 8 0 16'), spark(118, 34),
  ],

  /* ---------- TROUBLES ---------- */
  lombalgie: [
    F('M80 104m-30 0a30 22 0 1 0 60 0a30 22 0 1 0-60 0', 'f glow'),
    L(vert(66, 30, 28)), L(vert(64, 47, 32)), L(vert(62, 64, 36, 12)), L(vert(61, 82, 38, 12)), L(vert(60, 100, 40, 13)),
    G('M66 66h28M65 84h30M64 102h32'), L('M44 128Q80 112 116 128'), spark(118, 44),
  ],
  cervicalgie: [
    F('M80 84m-18 0a18 16 0 1 0 36 0a18 16 0 1 0-36 0', 'f glow'),
    C(80, 42, 21), L(vert(72, 68, 16, 9)), L(vert(71, 79, 18, 9)), L(vert(70, 90, 20, 10)),
    G('M73 72h14M72 83h16M71 95h18'), L('M40 118Q80 100 120 118'), spark(116, 30),
  ],
  dorsalgie: [
    F('M80 80m-22 0a22 18 0 1 0 44 0a22 18 0 1 0-44 0', 'f glow'),
    L('M50 124Q46 70 63 52Q80 44 97 52Q114 70 110 124'), L('M62 66Q66 84 74 89'), L('M98 66Q94 84 86 89'),
    G('M80 52V120'), C(80, 62, 3, 'f gold'), C(80, 74, 3, 'f gold'), C(80, 86, 3, 'f gold'), C(80, 98, 3, 'f gold'), C(80, 110, 3, 'f gold'), spark(122, 42),
  ],
  sciatique: [
    L('M48 48Q80 70 112 48Q106 78 80 82Q54 78 48 48Z'), L('M68 82Q64 110 68 138'), L('M92 82Q95 110 88 138'),
    G('M79 64Q74 88 81 104Q88 120 79 138'), C(79, 64, 4, 'f gold'), spark(122, 40),
  ],
  articulations: [
    F('M80 80m-15 0a15 15 0 1 0 30 0a15 15 0 1 0-30 0', 'f glow'),
    L('M68 18Q73 46 68 68'), L('M92 18Q87 46 92 68'), L('M66 68Q80 82 94 68'),
    L('M68 94Q73 120 71 142'), L('M92 94Q87 120 89 142'), L('M66 94Q80 87 94 94'), C(80, 80, 8, 'f gold'), spark(120, 36),
  ],
  'stress-tensions': [
    C(66, 62, 22), L('M66 84V102'), L('M36 120Q66 102 96 120'), G('M100 50q7-7 14 0t14 0'), G('M100 64q7-7 14 0t14 0'), G('M100 78q7-7 14 0t14 0'),
    L('M58 60q3 3 6 0'), L('M70 60q3 3 6 0'), L('M60 71q6 3 12 0'), spark(38, 36),
  ],
  'troubles-digestifs': [
    F('M86 42Q102 44 97 60Q90 71 75 64Q72 50 86 42Z', 'f gold-soft'),
    L('M54 28Q50 80 58 132'), L('M106 28Q110 80 102 132'), L('M86 42Q102 44 97 60Q90 71 75 64Q72 50 86 42Z'),
    G('M68 78h24q8 0 8 8t-8 8H68q-8 0-8 8t8 8h24q8 0 8 8'), spark(124, 36),
  ],
};

/* Fond organique : 3 variantes de couleur, alternées */
export function illu(key, { size = '', tone = 'gold' } = {}) {
  const parts = art[key];
  if (!parts) throw new Error('Illustration manquante : ' + key);
  return `<div class="illu ${size}" data-illu data-tone="${tone}" aria-hidden="true"><span class="illu-bg"></span><svg viewBox="0 0 160 160" focusable="false"><g class="illu-float">${parts.join('')}</g></svg></div>`;
}
export const illuKeys = Object.keys(art);
