/* ==========================================================================
   Point d'entrée. Le site fonctionne sans JS ; le JS ajoute confort et mouvement.
   Noyau (toutes les pages) : en-tête, menus, apparitions, progression.
   Le reste est chargé à la demande, seulement si la page contient l'élément :
     formulaire, carte, défilant d'avis, colonne vertébrale, séance épinglée.
   Aucune bibliothèque d'animation : transitions CSS + un peu de JS natif.
   ========================================================================== */
import { initHeader } from './core/header.js';
import { initMenu, initMegaMenus } from './core/menu.js';
import { initReveals } from './core/reveal.js';

const has = (sel) => document.querySelector(sel);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

initHeader();
initMenu();
initMegaMenus();
initReveals(reduced);
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

/* --- Modules à la demande --- */
if (has('[data-form]')) import('./components/form.js').then((m) => m.initForm());
if (has('[data-map]')) import('./components/map.js').then((m) => m.initMap());
if (has('[data-marquee]')) import('./components/marquee.js').then((m) => m.initMarquee());
if (has('[data-spine-section]')) import('./components/spine.js').then((m) => m.initSpine(reduced));

/* --- Mouvement : seulement si autorisé --- */
if (!reduced) {
  if (has('[data-pin-steps]')) import('./animations/steps-pin.js').then((m) => m.initStepsPin());
  if (finePointer && has('[data-tilt], [data-hero], .illu-xl')) import('./animations/tilt.js').then((m) => m.initPointerDepth());
}
