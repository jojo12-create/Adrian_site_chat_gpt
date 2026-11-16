/* ==========================================================================
   SYMBOLES : un par catégorie (7 patients + 7 troubles), dessinés au pinceau.
   Sources : assets/raw/symboles/*.svg, réunies dans /images/symboles.svg
   (npm run symbols). Les tracés sont ceux fournis, sans retouche.

   Mise en relief (CSS 3D, sans WebGL) : chaque symbole est un empilement
   de calques posés à des profondeurs différentes au-dessus d'un fond papier.
     ombre portée → tranche de l'encre (2 calques) → encre → accent terracotta
   La scène tourne lentement sur elle-même et suit la souris : les calques
   se décalent les uns par rapport aux autres, l'encre prend de l'épaisseur
   et l'accent flotte au-dessus. À l'entrée dans l'écran, l'encre est posée
   d'un coup de pinceau, puis l'accent vient se déposer.
   Styles : site/src/css/main.css (« Symboles en relief »). JS : site/src/js/v3.js.
   ========================================================================== */
import { symbolFiles } from '../scripts/symbols.mjs';

const SPRITE = '/images/symboles.svg';
const layer = (key, part, cls) => `<svg class="illu-l ${cls}" viewBox="0 0 240 240" focusable="false"><use href="${SPRITE}#${key}-${part}"/></svg>`;

export function illu(key, { size = '', tone = 'gold' } = {}) {
  if (!symbolFiles[key]) throw new Error('Symbole manquant : ' + key);
  return `<div class="illu ${size}" data-illu data-tone="${tone}" aria-hidden="true"><span class="illu-bg"></span><span class="illu-stage"><span class="illu-sway">${
    layer(key, 'encre', 'illu-shadow')}${layer(key, 'encre', 'illu-edge illu-edge-1')}${layer(key, 'encre', 'illu-edge illu-edge-2')}${
    layer(key, 'encre', 'illu-ink')}${layer(key, 'accent', 'illu-accent-shadow')}${layer(key, 'accent', 'illu-accent')}</span></span></div>`;
}
/* Petit symbole à plat (menus) : encre + accent, couleurs réglées en CSS */
export const symMini = (key) => `<svg class="sym" viewBox="0 0 240 240" aria-hidden="true" focusable="false"><use class="sym-ink" href="${SPRITE}#${key}-encre"/><use class="sym-accent" href="${SPRITE}#${key}-accent"/></svg>`;
export const illuKeys = Object.keys(symbolFiles);
