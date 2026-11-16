/* ==========================================================================
   Point d'entrée JS. Chaque module est indépendant et documenté.
   Principe : le site fonctionne sans JS ; le JS ajoute mouvement et confort.
   Tout est désactivé si l'utilisateur préfère réduire les animations.
   ========================================================================== */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initMenu, initHeader, initMegaMenus } from './js/nav.js';
import { initPointer } from './js/pointer.js';
import { initReveals, initParallax, initCounters, initMorph, initStepsPin, initProgress } from './js/scroll.js';
import { initTabs, initMarquee, initFaq, initMap, initHoverPreview } from './js/ui.js';
import { initForm } from './js/form.js';
import { initIllus, initHeroDepth, initSpine } from './js/v3.js';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --- Défilement fluide (Lenis), synchronisé avec ScrollTrigger --- */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // Ancres internes : défilement fluide, focus déplacé pour le clavier
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -80 });
    target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
  }));
}

/* --- Modules communs à toutes les pages --- */
initHeader();
initMenu(lenis);
initMegaMenus();      // menus déroulants des rubriques à plusieurs pages
initProgress(reduced);
initTabs();
initMarquee();
initFaq(reduced);
initMap();
initForm();
initIllus(reduced);   // symboles en relief : entrée + rotation lente (immobiles si mouvement réduit)
initSpine(reduced);   // colonne 3D chargée en différé (statique si mouvement réduit)
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

/* --- Mouvement : seulement si autorisé --- */
if (!reduced) {
  initReveals();
  initParallax();
  initCounters();
  initMorph();
  initStepsPin();
  initHeroDepth();    // hero : profondeur à la souris, parallaxe de sortie
  initPointer();      // curseur, boutons magnétiques, inclinaison (souris uniquement)
  initHoverPreview(); // aperçu photo des motifs (souris uniquement)
}

/* Recalcul après chargement des polices et images (positions exactes) */
window.addEventListener('load', () => ScrollTrigger.refresh());
