# Audit des animations et du mouvement

_Branche `claude/audit-refonte-qualite`, 16/11/2026. Lecture seule : aucun fichier du dépôt modifié hormis ce livrable._

**Deux états du code, parce que le dépôt a changé pendant l'audit :**

| Nom dans ce document | Commit | Ce que c'est |
|---|---|---|
| **Réf.** | `533d3bd` | Le code lu au début de l'audit. Il correspond à la compilation de référence servie sur `127.0.0.1:4180` : GSAP + ScrollTrigger + Lenis, `site/src/js/*.js`, `site/src/css/main.css`. Toutes les mesures « Réf. » viennent de là. |
| **HEAD** | `a0bf762` | L'état au moment de la rédaction. Le commit `7bfd513` (« Scripts allégés : plus de GSAP ni de Lenis ») a réécrit le JS dans `site/src/scripts/`. Le commit `a0bf762` a découpé la CSS en couches dans `site/src/styles/`. J'ai compilé une copie de HEAD dans le scratchpad et je l'ai mesurée de la même façon. |

Les constats **ouverts** (section 2) citent HEAD. Les constats de la référence **déjà corrigés** par `7bfd513` sont listés à part (section 3) : j'ai vérifié chacun dans le code de HEAD, ils restent ici pour la traçabilité.

Priorités :
- **P0** : bloquant. Fait perdre des images ou du calme à chaque visite, ou casse une interaction.
- **P1** : important. Écart net à la règle (propriété coûteuse, boucle sans fin, geste faux), à corriger pendant la refonte.
- **P2** : finition.

---

## 1. Synthèse

| # | Constat (état HEAD) | Prio | Preuve |
|---|---|---|---|
| 1 | Les **symboles 3D en CSS** (14 sur l'accueil) concentrent le coût de rendu restant. Au défilement mobile avec CPU ×4, 29,5 % des images dépassent 25 ms ; sans les symboles, 3,8 %. Une entrée en plusieurs temps (masque peint, ombres floutées, accent) s'ajoute à celle de la carte, puis une rotation infinie. | **P1** | Mesure §4.4 ; `symbols.css:16-38` |
| 2 | **Colonne 3D** : une fois chargée, elle rend une image à chaque frame tant qu'elle est visible, même immobile (rotation au repos, flottaison, poussière, pulsation). Elle lance aussi sa propre boucle `requestAnimationFrame` et lit `getBoundingClientRect` à chaque frame. | **P1** | `spine3d.js:270-297` ; Réf. : 48 tâches longues (max. 364 ms) au défilement desktop, 0 sans la 3D |
| 3 | **Geste de glisser de la colonne** : vitesse calculée par événement et non par temps, inertie qui dépend de la fréquence d'affichage, élan fantôme au relâcher après une pause, pas de protection multi-doigts, dérive pendant le suivi. | **P1** | `spine3d.js:237-255, 281-283` |
| 4 | **Boucles infinies restantes** : défilant d'avis (70 s / 80 s, `linear`), balancement des symboles (12 s), pulsation dorée de la 3D (≈ 0,38 Hz). Ce site de santé doit rester calme, et un texte qui bouge se lit mal. | **P1** | `sections.css:28-32`, `symbols.css:35-36`, `spine3d.js:288` |
| 5 | **Rotation de la colonne pilotée par le défilement sur 288°** : le modèle tourne presque d'un tour complet pendant qu'on passe la section. C'est un effet de démonstration technique. | **P1** | `spine3d.js:283` |
| 6 | **Menu mobile** : son entrée utilise `ease-in-out` (500 ms), alors qu'une entrée doit utiliser `ease-out` ou la courbe tiroir. Le cercle `clip-path` est redessiné à chaque image sur tout l'écran. | P2 | `header.css:50-51` |
| 7 | **Jeu de jetons incomplet** : 4 durées et 2 courbes existent, mais 14 valeurs restent codées en dur (.3s, .4s, .9s, 1.2s, 12s, 70s…). Il manque la courbe tiroir. | P2 | §5 |
| 8 | **Mouvement réduit** : la règle globale `transition-duration: .01ms` supprime aussi les fondus utiles. Le réglage est lu une seule fois au chargement. | P2 | `motion.css:19-21`, `main.js:13` |
| 9 | **Hero** : sept groupes bougent au chargement (fin à 1,7 s). Il y a deux éléments principaux (titre et arche), des anneaux qui se tracent, et des halos `blur(60px)` qui suivent la souris. | P2 | `hero.css:36-63`, `tilt.js:47-50` |
| 10 | **Propriétés de peinture au survol** : `box-shadow` (carte, bouton), `background-size` (lien), dégradé radial piloté par `--mx`/`--my` à chaque image. | P2 | `symbols.css:59-64`, `buttons.css:9,23-24`, `tilt.js:20-21` |

**Déjà corrigé entre Réf. et HEAD (vérifié, détail en §3)** : GSAP et Lenis retirés, donc plus de boucle concurrente côté site. 56 à 61 ScrollTrigger sur l'accueil → 0. 63 `will-change` permanents → 2-3. Morphing SVG infini, curseur personnalisé, boutons magnétiques élastiques, compteurs, dégradé dérivant, indicateur de défilement infini, FAQ non interruptible et animations au clavier sur les onglets : tous supprimés. La 3D ne se charge plus sur mobile, ni pendant le défilement.

---

## 2. Constats ouverts (HEAD `a0bf762`)

### P1-1. Symboles en relief : une entrée de trop, un coût de rendu élevé, une boucle infinie

- **Où** :
  - `site/src/styles/components/symbols.css:16` et `:21` : deux calques d'ombre en `filter: blur(calc(var(--z) * 3))` et `blur(calc(var(--z) * 1.6))`, empilés en `preserve-3d`.
  - `:25-26` : `mask-position` en transition sur 0,9 s, sur l'encre et les deux tranches (jusqu'à 3 calques par symbole).
  - `:27-33` : ombres, accent et fond, avec des délais de 0,3 à 0,6 s. Fin à environ 1,1 s.
  - `:35-36` : `illu-sway 12s infinite alternate`.
  - `site/src/scripts/core/reveal.js:22` : les symboles sont observés en plus des cartes qui les contiennent.
  - `content/pages.mjs:24` : la carte porte déjà `data-reveal` et `data-tilt`.
- **Problème** :
  1. Chaque carte catégorie a **deux entrées imbriquées** : la carte monte et se fond, puis le symbole se « peint » en quatre temps. Cela enfreint la règle « une seule entrée par conteneur » (skill choreograph, règle 1).
  2. `mask-position` est une propriété de peinture. Elle est redessinée à chaque image sur 3 calques × 14 symboles.
  3. Le balancement infini n'a pas d'autre but que décoratif. Il s'arrête bien hors écran (`is-live`), mais tourne en continu sous les yeux.
- **Impact mesuré** (HEAD, accueil, 390×844 mobile, CPU ×4, défilement complet à la molette ; méthode §4) :

  | Variante injectée | Images > 25 ms |
  |---|---|
  | Telle quelle | **29,5 %** (156/529) |
  | Sans masque peint | 26,3 % |
  | Sans flous (halos et ombres) | 30,9 % |
  | Sans balancement | 28,4 % |
  | Sans transitions d'entrée des symboles | 18,5 % |
  | Sans balancement ni transitions d'entrée | 17,1 % |
  | **Sans symboles** | **3,8 %** (19/506) |

  Il n'y a aucune tâche longue : le coût vient de la peinture et de la composition des calques 3D, pas du JS. Le rendu headless est logiciel et grossit ce coût, mais la répartition entre variantes reste valable.
- **Correctif** :
  1. **Une seule entrée** : la carte entre, le symbole arrive avec elle. Supprimer `:25-33`. Garder au plus un fondu de l'accent, sur la même horloge que la carte :
     ```css
     @media (prefers-reduced-motion: no-preference) {
       .js .reveal .illu-accent { opacity: 0; }
       .js .reveal.is-in .illu-accent { opacity: 1; transition: opacity var(--dur-base) var(--ease-out) 120ms; }
     }
     ```
     Et dans `reveal.js:22`, n'observer `[data-illu]` que hors carte : `document.querySelectorAll('[data-illu]:not(.cat-card [data-illu], [data-tilt] [data-illu])')`.
  2. **Supprimer `illu-sway`** (`:35-41`). L'état statique (`rotateY(0)`) suffit. La profondeur reste visible grâce à `translateZ` et elle réagit déjà à la souris (`tilt.js:22`).
  3. **Sous 640 px**, aplatir le symbole : `.illu-stage, .illu-sway { transform-style: flat; } .illu-shadow, .illu-accent-shadow { filter: none; opacity: .12; }`. L'ombre floutée devient une ombre nette légère, ce qui supprime 2 rasterisations floues par symbole sur téléphone.
  4. Après correction, refaire la mesure : il faut passer sous 8 % d'images > 25 ms dans les mêmes conditions.

### P1-2. Colonne 3D : boucle de rendu continue et concurrente

- **Où** : `site/src/scripts/three/spine3d.js`.
  - `:270-273` : la boucle s'arrête bien hors écran (IntersectionObserver) et quand l'onglet est caché (`visibilitychange`).
  - `:271` : `requestRender()` ne relance la boucle **qu'en mouvement réduit**.
  - `:279` : `getBoundingClientRect()` à chaque frame.
  - `:282` : rotation au repos `t * 0.12`.
  - `:286` : flottaison.
  - `:287` : rotation de la poussière.
  - `:288-289` : pulsation `sin(t * 2.4)`.
  - `:292` : la boucle se relance sans condition tant que la colonne est visible.
- **Problème** :
  1. Une fois chargée, la colonne rend **une image à chaque frame** tant qu'elle est à l'écran, même quand personne n'y touche. Ce rendu passe par sa propre boucle `requestAnimationFrame`, distincte du reste. À la Réf., c'était une seconde boucle à côté de `gsap.ticker`.
  2. Les quatre mouvements de repos ne servent à rien (skill remove-animations : « décoration sans but »).
  3. La pulsation à environ 0,38 Hz est le genre d'oscillation lente que le skill apple-design (§14) demande d'éviter.
- **Impact** (Réf., accueil 1440×900, défilement complet) :
  - avec la 3D : **48 tâches longues, max. 364 ms, 4,06 s au total**, 11,5 % d'images > 25 ms ;
  - colonne bloquée : **0 tâche longue**, 3,9 % d'images > 25 ms.

  WebGL tourne en logiciel en headless, donc les valeurs absolues sont pessimistes. L'écart montre qui coûte. À HEAD, la colonne n'est plus chargée que sur ordinateur, au clic sur « Explorer en 3D » (`spine.js:37-58`). Le problème reste entier une fois qu'elle est chargée.
- **Correctif** : rendre à la demande.
  ```js
  // remplace :270-297
  let visible = true, raf = 0, dirty = true, last = performance.now(), lastP = -1;
  const invalidate = () => { dirty = true; if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) invalidate(); }).observe(container);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) invalidate(); });
  addEventListener('scroll', () => { if (visible) invalidate(); }, { passive: true });
  function frame(now) {
    raf = 0;
    const dt = Math.min(now - last, 50); last = now;
    const r = container.getBoundingClientRect();           // une lecture par image rendue, plus à chaque frame à vide
    const p = MathUtils.clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
    let moving = false;
    if (!down && Math.abs(velocity) > 1e-5) { drag += velocity * dt; velocity *= Math.pow(0.995, dt); moving = true; }
    if (p !== lastP) { lastP = p; dirty = true; }
    root.rotation.y = (reduced ? 0.5 : (p - 0.5) * 0.6) + drag;   // ±0,3 rad au lieu de ±2,5 rad (voir P1-4)
    root.rotation.x = tilt;
    if (dirty || moving) { renderer.render(scene, camera); dirty = false; }
    if (moving) invalidate();
  }
  ```
  `requestRender()` devient `invalidate()` partout (`paint`, `resize`, `pointermove`). Supprimer :
  - la rotation au repos (`:282`) ;
  - la flottaison (`:286`) ;
  - la rotation de la poussière (`:287`), ou la poussière entière (`:193-200`, 380 points) ;
  - la pulsation (`:288-289`), en fixant `mat.hi.emissiveIntensity = 0.6` et `mat.discHi.emissiveIntensity = 0.9`.

### P1-3. Geste de glisser de la colonne (skill gestures)

- **Où** : `spine3d.js:237` (pointerdown), `:238-248` (pointermove), `:242` (`velocity = dx * 0.006`), `:249-255`, `:281` (`velocity *= 0.92` à chaque frame), `:282-283`.
- **Ce qui est juste** : `setPointerCapture` (`:237`), `touch-action: pan-y` sur le canvas (`spine.css`, `.spine-canvas`), seuil de 4 px pour distinguer un clic d'un glisser (`:241`), sélection des zones au raycast.
- **Problèmes** :
  1. **Phase de suivi pas 1:1** : la rotation au repos (`t * 0.12`, `:282`) continue pendant que le doigt tient le modèle, qui dérive donc sous le doigt.
  2. **Vitesse par événement** : `dx * 0.006` dépend du nombre d'événements par seconde (60, 120 ou 240 selon l'appareil), pas du temps écoulé.
  3. **Élan fantôme** : si l'on s'arrête puis relâche, `velocity` garde la valeur du dernier mouvement et le modèle repart seul.
  4. **Inertie liée à la fréquence d'affichage** : `0.92` par frame donne une décroissance deux fois plus rapide à 120 Hz qu'à 60 Hz.
  5. **Pas de protection multi-doigts** : un second `pointerdown` remplace `down`.
  6. **Arrêt sec en inclinaison** : `MathUtils.clamp(tilt, -0.35, 0.35)` au lieu d'une résistance progressive.
- **Correctif** (en plus de P1-2) :
  ```js
  let pid = null, hist = [], tiltRaw = 0;
  const rubber = (v, lim, c = 0.55) => { const o = Math.abs(v) - lim; return o <= 0 ? v : Math.sign(v) * (lim + (o * lim * c) / (lim + c * o)); };
  el.addEventListener('pointerdown', (e) => {
    if (pid !== null) return;                          // un seul doigt pilote
    pid = e.pointerId; el.setPointerCapture(pid);
    down = { x: e.clientX, y: e.clientY }; moved = false; velocity = 0;
    hist = [{ x: e.clientX, t: e.timeStamp }];
  });
  el.addEventListener('pointermove', (e) => {
    if (pid === null) { /* survol à la souris : code actuel :244-247, inchangé */ return; }
    if (e.pointerId !== pid) return;                   // second doigt ignoré
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
    drag += dx * 0.006;                                // 1:1, sans lissage
    tiltRaw += dy * 0.003; tilt = rubber(tiltRaw, 0.35);
    down = { x: e.clientX, y: e.clientY };
    hist.push({ x: e.clientX, t: e.timeStamp });
    while (hist.length > 2 && e.timeStamp - hist[0].t > 100) hist.shift();
    invalidate();
  });
  const release = (e) => {
    if (e.pointerId !== pid) return;
    const a = hist[0], b = hist[hist.length - 1], dt = b.t - a.t;
    velocity = (e.timeStamp - b.t > 50 || dt < 8 || reduced) ? 0 : ((b.x - a.x) * 0.006) / dt; // rad/ms
    tiltRaw = tilt = MathUtils.clamp(tilt, -0.35, 0.35);   // retour dans les bornes
    pid = null; down = null; invalidate();
  };
  el.addEventListener('pointerup', (e) => { if (!moved && e.pointerId === pid) { /* clic zone : code actuel :250 */ } release(e); });
  el.addEventListener('pointercancel', release);
  ```
  La décroissance `Math.pow(0.995, dt)` (dt en ms) ne dépend plus de la fréquence d'affichage. Elle suit la forme exponentielle de la décélération iOS (skill apple-design §6, valeur « plus vive » que 0.998, adaptée à une rotation). En mouvement réduit, il n'y a ni élan ni rebond : le suivi direct reste.

### P1-4. Rotation de la colonne pilotée par le défilement : 288°

- **Où** : `spine3d.js:283` : `(p - 0.5) * Math.PI * 1.6`, soit de −144° à +144° pendant la traversée de la section.
- **Problème** : le modèle fait presque un tour complet quand on fait défiler la page. Un objet qui tourne sous les yeux pendant qu'on lit les zones et les troubles à côté gêne la lecture. Le skill remove-animations demande de retirer ce genre d'effet de démonstration, et le calme est la ligne directrice d'un site de santé.
- **Correctif** : `(p - 0.5) * 0.6` (±0,3 rad, environ ±17°). Cela suffit à montrer le relief. On peut aussi supprimer complètement le couplage au défilement, puisque le modèle est maintenant explicitement demandé par l'utilisateur et se manipule au glisser.

### P1-5. Défilant d'avis infini

- **Où** :
  - `site/src/styles/components/sections.css:28-32` : `animation: marquee 70s linear infinite`, la seconde rangée en sens inverse à 80 s ;
  - `site/src/scripts/components/marquee.js` ;
  - la pause hors écran est assurée par `reveal.js:31-32` (`data-live`).
- **Ce qui est juste** : bouton pause (WCAG 2.2.2), pause au survol (limitée aux appareils qui survolent), pause au focus, pause hors écran, grille statique en mouvement réduit (`sections.css:39-43`).
- **Problème** : un témoignage qui défile se lit mal, surtout pour un public âgé. Le skill remove-animations classe la boucle infinie sur un élément permanent parmi ce qu'on retire en premier. Le site perd en calme sans rien gagner en information.
- **Correctif** : reprendre le rendu actuel du mouvement réduit pour tout le monde. Ce sera une rangée en `overflow-x: auto; scroll-snap-type: x mandatory;` sur mobile, avec des cartes `scroll-snap-align: start`, et une grille de 3 colonnes à partir de 1024 px. Il faut aussi supprimer `@keyframes marquee`, `.marquee-row.reverse`, les doublons `aria-hidden`, le bouton pause et `components/marquee.js`. Aucune animation ne remplace celle-ci.

### P2-1. Menu mobile : courbe d'entrée et coût du cercle

- **Où** : `site/src/styles/components/header.css:50` (fermeture : `clip-path .3s var(--ease-in-out)`) et `:51` (ouverture : `clip-path var(--dur-slow) var(--ease-in-out)`, soit 500 ms).
- **Problème** : une entrée en `ease-in-out` démarre lentement, précisément au moment où l'œil suit le menu. Le cercle `circle(150%)` couvre tout l'écran et se redessine à chaque image : `clip-path` est l'exception admise par les skills, mais la peinture reste plein écran. La valeur `.3s` n'est pas un jeton.
- **Correctif** : garder le cercle, qui part du bouton et donne donc une origine spatiale juste. Changer la courbe et les durées :
  ```css
  .nav { transition: clip-path var(--dur-base) var(--ease-out), visibility 0s var(--dur-base); }          /* fermeture 240 ms */
  .nav.is-open { transition: clip-path var(--dur-slow) var(--ease-drawer); }                              /* ouverture 400 ms */
  ```
  avec `--ease-drawer: cubic-bezier(.32, .72, 0, 1)` et `--dur-slow: .4s` (§5).

### P2-2. Hero : trop de « moments », deux éléments principaux

- **Où** :
  - `site/src/styles/components/hero.css:7-10` : mots du titre, 0,7 s, pas uniforme de 30 ms ;
  - `:36-45` : texte, arche en `clip-path` 0,9 s, badge et puce ;
  - `:49` et `:63` : halos `filter: blur(60px)`, `blur(40px)` sur mobile, `will-change: transform` ;
  - `:57-61` : anneaux tracés sur 1,2 s, fin à 1,7 s ;
  - `site/src/scripts/animations/tilt.js:47-50` : 6 calques et l'arche suivent la souris.
- **Chronologie actuelle (ordinateur)** :

  | Élément | Début | Durée | Fin |
  |---|---|---|---|
  | Titre (10 mots, pas de 30 ms) | 0 | 700 ms | 970 ms |
  | Arche (`clip-path`) | 100 ms | 900 ms | 1 000 ms |
  | Chapeau | 180 ms | 700 ms | 880 ms |
  | Boutons | 240 ms | 700 ms | 940 ms |
  | Preuves | 320 ms | 700 ms | 1 020 ms |
  | Anneau 1 / anneau 2 | 350 / 500 ms | 1 200 ms | 1 700 ms |
  | Badge + puce | 500 ms | 500 ms | 1 000 ms |

  Le titre et l'arche se disputent le rôle d'élément principal : c'est un problème de hiérarchie (skill choreograph, étape 1). Le pas uniforme des mots fait un effet de métronome (règle 3). Les halos `blur(60px)` sont redondants avec leur propre `radial-gradient(… transparent 65%)` (`hero.css:50-51`) : le flou est un coût sans effet visible net. À la Réf., le flou combiné au morphing faisait perdre 30 à 54 % des images au repos sur desktop ; les supprimer l'un ou l'autre ramenait à 0 (§4.3).
- **Correctif (chronologie proposée)** :

  | Élément | Rôle | Début | Durée | Mouvement | Relation |
  |---|---|---|---|---|---|
  | Titre | Principal | 0 | 600 ms | mots `translateY(105%)→0`, délais décroissants | — |
  | Chapeau + boutons | Secondaire | 120 ms | 500 ms | fondu + 8 px | ensemble, chevauche le titre |
  | Preuves | Secondaire | 180 ms | 400 ms | fondu seul | chevauche |
  | Arche | Secondaire visuel | 60 ms | 600 ms | `opacity 0→1` + `scale(.98)→1` | en même temps que le titre |
  | Badge, puce, anneaux | Décor | 300 ms | 400 ms | fondu seul, sans tracé | ensemble |
  | Halos, forme | Immobiles | — | — | aucun suivi de souris | — |

  ```css
  .split .w > span { animation: word-up var(--dur-enter) var(--ease-out) both;
    animation-delay: calc(var(--i) * 28ms - var(--i) * var(--i) * .8ms); }   /* 0, 27, 53, 77… 200 ms au 10e mot */
  .hero-lead, .hero-actions { animation: fade-up .5s var(--ease-out) .12s both; }
  .hero-proof { animation: fade-in .4s var(--ease-out) .18s both; }
  .hero-visual .arch { animation: arch-in var(--dur-enter) var(--ease-out) 60ms both; }
  @keyframes arch-in { from { opacity: 0; transform: scale(.98); } }
  .hero-badge, .hero-chip, .hero-rings { animation: fade-in .4s var(--ease-out) .3s both; }
  .orb { filter: none; will-change: auto; }   /* le dégradé radial suffit, élargir son arrêt à 72 % */
  @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } }
  ```
  Tout est fini en 800 ms au plus. Retirer `data-depth` des halos, de la forme et des anneaux (`content/pages.mjs:105-106,121`, lus par `tilt.js:35,48`). Le décalage de profondeur ne garde que le badge et la puce, ou rien du tout. L'arche cesse d'être révélée par `clip-path` : c'est l'image LCP du hero sur ordinateur, et l'opacité laisse le navigateur la peindre dès la première image. Ce dernier point est à vérifier par une mesure LCP avant et après.

### P2-3. Jeu de jetons incomplet, valeurs codées en dur

Voir le §5 pour l'inventaire et le jeu proposé.

### P2-4. Mouvement réduit : trop radical, lu une seule fois

- **Où** :
  - `site/src/styles/motion.css:19-21` : `*, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; … }` ;
  - `site/src/scripts/main.js:13` : `reduced` évalué au chargement, sans écouter `change`.
- **Ce qui est juste** :
  - tout le JS de mouvement est conditionné : `main.js:29-32`, `reveal.js:10`, `spine.js:37` ;
  - le défilant passe en grille ;
  - les symboles s'affichent d'emblée ;
  - les transitions de page sont coupées ;
  - à la Réf., `initFaq`, `initTabs`, `initSpine` et Lenis étaient eux aussi conditionnés.
- **Problème** : « mouvement réduit » veut dire moins de mouvement, pas zéro. Les fondus d'opacité et de couleur aident à comprendre (menu, FAQ, état des boutons) : ils sont coupés comme les déplacements.
- **Correctif** :
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; scroll-behavior: auto !important;
      transition-property: opacity, color, background-color, border-color !important;
      transition-duration: var(--dur-fast) !important; }
    .reveal { transform: none; }                       /* fondu seul */
    .nav, .nav.is-open { transition: opacity var(--dur-fast) ease, visibility 0s var(--dur-fast) !important; clip-path: none; }
    .nav { opacity: 0; } .nav.is-open { opacity: 1; transition-delay: 0s !important; }
    ::view-transition-old(root), ::view-transition-new(root) { animation-duration: var(--dur-fast); }
  }
  ```
  Côté JS, `main.js:13` : `matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => location.reload())`. Sans bibliothèque, c'est le plus sûr pour désarmer les observateurs et la 3D. Si GSAP revenait un jour, il faudrait déclarer chaque animation dans `gsap.matchMedia()` sous `{ motion: '(prefers-reduced-motion: no-preference)' }` : c'est le seul moyen d'annuler proprement tweens et ScrollTrigger quand le réglage change.

### P2-5. Survols qui repeignent

- **Où** :
  - `symbols.css:59` + `:63` : `box-shadow` de `.cat-card` en transition ;
  - `buttons.css:9` + `:11` : `box-shadow` du bouton ;
  - `buttons.css:23-24` : soulignement en `background-size` ;
  - `tilt.js:20-21` : `--mx`/`--my` écrits à chaque image sur la carte, qui pilotent le `radial-gradient` de `.cat-card a::after` (`symbols.css:62`) et `.price-card::after` (`sections.css:89`).
- **Problème** : ces propriétés sont de la peinture, pas de la composition. La variable CSS posée sur le parent force aussi un recalcul de style de tout le sous-arbre de la carte, symbole compris (skill animation-performance, « variables héritées »).
- **Correctif** :
  - **Ombre** : ombre de survol posée une fois sur un `::before` et animer seulement son opacité. `.cat-card::before { content:''; position:absolute; inset:0; border-radius:inherit; box-shadow: 0 30px 60px -30px rgba(36,60,47,.45), 0 0 0 1px rgba(190,155,78,.35); opacity:0; transition: opacity var(--dur-base) var(--ease-out); }`, puis `.cat-card:hover::before { opacity:1 }`. Même principe pour `.btn`.
  - **Soulignement** : `.link::after { … transform: scaleX(0); transform-origin: left; transition: transform var(--dur-base) var(--ease-out); }`.
  - **Reflet** : le supprimer (décoration sans fonction, skill remove-animations), donc supprimer `tilt.js:20-21` et les deux `::after`. À défaut, le déplacer en `transform: translate()` sur un élément enfant à dégradé fixe.

### P2-6. Inclinaison au survol sur des contenus qui ne sont pas des actions

- **Où** : `data-tilt` sur les citations (`content/pages.mjs`, `figure.quote` ×2), les cas (`.case-list li`), la carte tarif, les « façons de prendre RDV » et l'arche du cabinet. Tout est piloté par `tilt.js:12-30`.
- **Problème** : incliner un bloc de texte qu'on lit (avis, tarif) est de la décoration au survol, vue des dizaines de fois par visite (skill remove-animations : « hover scale or lift on cards that aren't the primary action »).
- **Correctif** : garder `data-tilt` sur `.cat-card` seulement, à 4° maximum comme aujourd'hui, et le retirer ailleurs dans `content/pages.mjs`.

### P2-7. Écriture puis lecture dans le même passage (en-tête)

- **Où** : `site/src/scripts/core/header.js:15-21`. Les `classList.toggle` (écritures) précèdent la lecture de `document.documentElement.scrollHeight`.
- **Problème** : si les classes changent (`is-solid`, `is-hidden`), la lecture force une mise en page synchrone dans la même frame. C'est le motif du « layout thrashing ».
- **Correctif** : lire d'abord, écrire ensuite, et mettre `max` en cache.
  ```js
  let max = 0; const measure = () => { max = document.documentElement.scrollHeight - innerHeight; };
  new ResizeObserver(measure).observe(document.body); measure();
  const update = () => { ticking = false; const y = scrollY; const p = max > 0 ? Math.min(1, y / max) : 0; /* puis toutes les écritures */ … };
  ```

### P2-8. Apparitions : pas uniforme, re-mesure de la séance épinglée

- **Où** :
  - `site/src/scripts/core/reveal.js:17` : `Math.min(i, 4) * 60` ms, soit un pas constant ;
  - `site/src/scripts/animations/steps-pin.js:33` : `measure()` seulement à `load` et `resize`.
- **Correctif** :
  - délais décroissants `[0, 50, 90, 120, 140][Math.min(i, 4)]` ms (skill choreograph, règle 3) ;
  - re-mesurer quand les polices changent la largeur : `document.fonts.ready.then(() => on && (measure(), request()))`, ou `new ResizeObserver(() => on && (measure(), request())).observe(track)`.

### P2-9. Divers

- **Sonde WebGL** : `site/src/scripts/components/spine.js:40` crée un contexte WebGL de test et ne le libère pas. Ajouter `gl?.getExtension('WEBGL_lose_context')?.loseContext()`.
- **Préférence GPU** : `spine3d.js:22` utilise `powerPreference: 'high-performance'`, ce qui réveille le GPU dédié des portables. Passer à `'default'`.
- **Densité de pixels** : `spine3d.js:23` plafonne déjà la densité de pixels, à 2 sur ordinateur. Proposer 1,5 : sur une colonne de 640 px de haut, la différence ne se voit pas, et c'est 44 % de pixels en moins.
- **Libération mémoire** : `spine3d.js` n'a aucun `dispose()`. Sur `pagehide`, parcourir la scène (`scene.traverse(o => { o.geometry?.dispose(); })`), disposer chaque matériau de `mat`, puis `renderer.dispose(); renderer.forceContextLoss();`. Sans cela, la mémoire GPU reste prise si la page entre dans le cache aller-retour.
- **Géométrie** : sur ordinateur, `seg = 22` (`:47`), 380 particules (`:195`), 12 côtes en tores de 48 segments et des `EdgesGeometry` sur chaque corps vertébral. Proposer `seg = 16` et la suppression de la poussière (P1-2).
- **Commentaire obsolète** : `header.css:100` dit « Filet doré qui se trace à l'ouverture », mais le filet n'est plus animé (`:101`).
- **Menu mobile** : les sous-volets (`header.css:62-63`) s'ouvrent en `grid-template-rows 0fr→1fr`. C'est une propriété de mise en page, mais c'est la technique d'accordéon admise par les skills, à 240 ms. **On la garde.**

---

## 3. Constats de la référence déjà corrigés par `7bfd513` (vérifiés)

| Réf. `533d3bd` | Constat | Prio d'origine | État HEAD |
|---|---|---|---|
| `main.js:21-25` | Lenis (`duration: 1.1`, quartOut) piloté par `gsap.ticker`, `lagSmoothing(0)` : intégration conforme. `spine3d.js:271-298` ajoute une **seconde boucle rAF** | P1 | GSAP et Lenis retirés. Défilement natif. Seule boucle propre restante : la 3D, voir P1-2 |
| `scroll.js:13` (batch), `:25,28` (parallaxe ×2), `:37` (compteurs), `:53`, `v3.js:51-52`, `scroll.js:66,69` | **56 ScrollTrigger (mobile) / 61 (1440)** sur l'accueil, dont 5 / 10 en scrub et 1 épinglé. 20 sur `/osteopathie/lombalgie/`. Encore 10 à 12 actifs en bas de page | P1 | 0. Remplacés par `IntersectionObserver` (`reveal.js`), `animation-timeline: view()` (`motion.css:11-16`) et `position: sticky` + transform 1:1 (`steps-pin.js`) |
| `main.css:603` (`.js [data-reveal] { will-change }`), `:99`, `:373`, `:473`, `:678`, `:697`, `:702` | **63 éléments en `will-change` permanent** sur l'accueil, 28 sur lombalgie | P1 | 2 (mobile) à 3 (1440) sur l'accueil, 0 sur lombalgie (mesuré). Restent `.orb` (`hero.css:49`, à retirer : P2-2) et la piste épinglée (`sections.css:59`, justifiée) |
| `scroll.js:51` | Morphing SVG du hero `repeat: -1`, 6 s, `attr d`. **Une mise en page à chaque frame**, même immobile (182 layouts en 3 s au repos, 0 sans le morphing) | **P0** | Supprimé |
| `main.css:650`, `:656-660` | `illu-morph` : `border-radius` infini (peinture), **jamais en pause hors écran** | P1 | Supprimé |
| `main.css:424-425` | Dégradé du bandeau final qui dérive (18 s infini) | P1 | Supprimé |
| `main.css:277-278` | Indicateur de défilement en `background-position` infini | P1 | Supprimé avec l'indicateur |
| `pointer.js:9-23`, `main.css:594-599` | Curseur personnalisé qui anime `width/height/margin` (mise en page) avec `mix-blend-mode`. Pur effet de démonstration | P1 | Supprimé |
| `pointer.js:26-35` | Boutons magnétiques en `elastic.out(1, 0.45)` (rebond sur un CTA de santé). Le `transform` en ligne de GSAP **écrasait `.btn:active { scale(.97) }`** : plus de retour d'appui sur les boutons de RDV | P1 | Supprimé. `.btn` a maintenant `transform var(--dur-fast) var(--ease-out)` (`buttons.css:9`) et `:active` fonctionne (`:13`) |
| `scroll.js:33-40` | Compteurs (12, 7, 24) qui partent de 0 au chargement : donnée animée sans changement réel | P1 | Supprimés |
| `ui.js:55-69` | FAQ en GSAP `height` 0,45 s `power3.inOut` / 0,6 s. **Non interruptible** : un second clic pendant la fermeture refermait au lieu de rouvrir, car `d.open` restait vrai | P1 | `::details-content` + `block-size` 240 ms `--ease-out`, interruptible (`sections.css:145-147`) |
| `ui.js:5-36`, `v3.js:75,79-83` | Panneau d'onglets animé (`y: 14→0`, 0,6 s `expo.out`) **à chaque flèche du clavier** | P1 | `spine.js:15-25` : bascule instantanée ; `initTabs` (code mort) supprimé |
| `ui.js:88-102` | Aperçu photo qui anime `left`/`top` (mise en page). Code mort : 0 page avec `[data-hover-preview]` | P2 | Supprimé |
| `v3.js:41,43-44` ; `main.css:286-289,706-708` | Hero : fin de chorégraphie à **3,2 s** (anneaux 2,4 s), boutons visibles entre 0,7 et 1,7 s | P1 | Fin à 1,7 s, boutons à 0,24 s. Reste P2-2 |
| `scroll.js:9-13` | Apparitions : `y: 40`, 1,1 s `expo.out`, pas de 90 ms | P1 | 16 px, 0,7 s `--ease-out`, pas de 60 ms plafonné à 4 (`reveal.js:16-17`, `motion.css:5`). Reste P2-8 |
| `main.css:169-173,196` ; `nav.js:49` | Menu mobile : cercle 0,8 s, liens échelonnés 0,7 s + 0,25 s de délai (≈ 1,3 s au total), **focus déplacé après un `setTimeout` de 350 ms** | P1 | Échelonnement supprimé. Focus immédiat (`menu.js:17`). Cercle 500 / 300 ms. Reste P2-1 |
| `main.css:217-218,221,236-237` | Méga-menu desktop : liens échelonnés, filet tracé en 0,9 s, sortie aussi lente que l'entrée (0,3 / 0,5 s) | P1 | Sans échelonnement, sortie 160 ms et entrée 240 ms (`header.css:97-98`) |
| `main.css:55-58` | Transitions de page : sortie 0,35 s, entrée 0,55 s avec glissement | P2 | Opacité seule, 150 / 250 ms (`base.css:4-8`) |
| `main.css` (tous les `:hover`) | Aucun survol réservé aux appareils qui survolent : survols « collants » au toucher | P2 | `@media (hover: hover)` partout |
| `scroll.js:56-72` | Séance épinglée : `pin` + `scrub: 0.8` (rattrapage) + `clip-path` en scrub sur chaque photo | P1 | `sticky` + transform 1:1, sans `clip-path` (`steps-pin.js`) |
| `v3.js:88-101` | 3D chargée à l'approche (600 px) **y compris sur mobile**, après `load` ; densité de pixels 1,5 sur mobile | **P0** | Jamais sur mobile ni tablette. Sur ordinateur, au clic seulement (`spine.js:37-58`) |
| `v3.js:25-26` ; `pointer.js:45-47` | Variables `--px/--py/--mx/--my` posées sur le parent à chaque `pointermove` → recalcul du sous-arbre | P2 | Transform écrit directement sur `.illu-stage` (`tilt.js:22,45`). Reste `--mx/--my` : P2-5 |

---

## 4. Mesures

### 4.1 Méthode

- **Outil** : Playwright 1.x, Chromium headless (`chromium.launch()` sans option), avec une session CDP par page.
  - **Image perdue** : intervalle entre deux `requestAnimationFrame` de plus de 25 ms. L'affichage headless est cadencé à 60 Hz.
  - **Tâches longues** : `PerformanceObserver({ type: 'longtask' })`, au-delà de 50 ms.
  - **Mises en page et recalculs** : `Performance.getMetrics` (`LayoutCount`, `RecalcStyleCount`, `LayoutDuration`, `RecalcStyleDuration`, `ScriptDuration`, `TaskDuration`), en différence avant/après.
- **Scénario** :
  1. Chargement complet, puis 2,5 s d'attente.
  2. **3 s de repos** en haut de page.
  3. **Défilement complet à la molette** : `mouse.wheel(0, 120)` toutes les 40 ms jusqu'au bas de page, puis 1,5 s d'attente.
- **Fenêtres** :
  - 390×844 en émulation mobile (`isMobile`, `hasTouch`, DPR 3, donc `pointer: coarse`) ;
  - 1440×900 souris ;
  - 390×844 avec CPU ×4 (`Emulation.setCPUThrottlingRate`).
- **ScrollTrigger (Réf.)** : la Réf. n'expose pas GSAP. J'ai servi le bundle `main-C7B07Mrn.js` réécrit à la volée (`page.route`) pour y ajouter `window.__ST = ScrollTrigger`, puis lu `ScrollTrigger.getAll()`.
- **Attribution** : mêmes scénarios en bloquant le chunk `spine3d-*.js`, en injectant de la CSS (sans flou, sans masque, sans symbole…) ou en tuant le tween du morphing.
- **HEAD** : copie de `a0bf762` compilée dans le scratchpad (`vite build`, `node_modules` partagé en lecture), servie sur `127.0.0.1:4190`, mesurée avec les mêmes scripts. HEAD défile en natif et la Réf. avec Lenis : les nombres d'images diffèrent, il faut comparer les **pourcentages**.
- **Limites** : headless sans GPU, donc rasterisation et WebGL logiciels (SwiftShader). Les coûts de peinture et de WebGL sont surévalués en absolu. Les écarts entre variantes et entre versions restent probants. Il faut confirmer sur un téléphone milieu de gamme réel (skill animation-performance, règle 3).
- **Scripts et résultats bruts** : `/tmp/claude-0/-home-user/8a0742d5-728a-5ce4-a91d-36778fa4e5da/scratchpad/audit-anim/` (`measure2.js`, `measure3.js`, `attrib.js`, `attrib3.js`, `idle.js`, `results2.jsonl`, `results3.jsonl`).

### 4.2 Défilement complet

**Accueil `/`**

| Version | Fenêtre | ScrollTrigger (dont scrub / pin) | `will-change` | Images > 25 ms | > 50 ms | p95 | Tâches longues (n / max / total) | Layouts / Recalc. style | Durée tâches |
|---|---|---|---|---|---|---|---|---|---|
| Réf. | 390 mobile | 56 (5 / 0), 12 en bas | 63 | 85 / 2 100 (**4,0 %**) | 2 | 16,8 ms | 2 / 208 ms / 260 ms | 2 162 / 4 555 | 13,2 s |
| Réf. | 1440 | 61 (10 / 1), 10 en bas | 63 | 85 / 760 (**11,2 %**) | 54 | 83,3 ms | **50 / 420 ms / 4,80 s** | 847 / 1 591 | 8,5 s |
| Réf. | 390 CPU ×4 | 56 | 63 | 291 / 2 348 (**12,4 %**) | 40 | 33,4 ms | **50 / 297 ms / 3,05 s** | 2 412 / 5 240 | 43,4 s |
| HEAD | 390 mobile | 0 | 2 | 0 / 617 (**0 %**) | 0 | 16,7 ms | 0 | 45 / 644 | 1,4 s |
| HEAD | 1440 | 0 | 3 | 16 / 512 (**3,1 %**) | 0 | 16,8 ms | 0 | 37 / 544 | 1,0 s |
| HEAD | 390 CPU ×4 | 0 | 2 | 129 / 551 (**23,4 %**) | 0 | 33,4 ms | 0 | 45 / 587 | 5,1 s |

**`/osteopathie/lombalgie/`**

| Version | Fenêtre | ScrollTrigger | `will-change` | Images > 25 ms | Tâches longues | Layouts / Recalc. |
|---|---|---|---|---|---|---|
| Réf. | 390 mobile | 20 (2 scrub), 2 en bas | 28 | 0 / 924 (0 %) | 0 | 16 / 1 935 |
| Réf. | 1440 | 20 | 28 | 17 / 332 (5,1 %) | 0 | 78 / 654 |
| Réf. | 390 CPU ×4 | 20 | 28 | 2 / 913 (0,2 %) | 0 | 16 / 1 901 |
| HEAD | 390 mobile | 0 | 0 | 0 / 277 (0 %) | 0 | 13 / 246 |
| HEAD | 1440 | 0 | 0 | 1 / 229 (0,4 %) | 0 | 16 / 202 |
| HEAD | 390 CPU ×4 | 0 | 0 | 9 / 277 (3,2 %) | 0 | 13 / 246 |

**Lecture** :
- À la Réf., l'accueil fait **environ une mise en page par image** pendant le défilement (2 162 pour 2 100 images). La cause est le morphing SVG (§4.3). À HEAD : 45 sur toute la page.
- Les tâches longues de la Réf. sur desktop viennent toutes de la 3D (§4.3).
- Sur l'accueil HEAD en CPU ×4, le taux de 23,4 % ne vient pas du JS (0 tâche longue). Il vient du rendu des symboles 3D (P1-1, §2).
- Sur lombalgie, le recalcul de style a lieu à **chaque image au repos** (181 en 3 s), à la Réf. comme à HEAD. La cause est le balancement infini du grand symbole (`illu-sway`) et, à la Réf., `illu-morph`.

### 4.3 Attribution (Réf.)

| Expérience | Repos 3 s (images > 25 ms) | Défilement (images > 25 ms) | Tâches longues au défilement |
|---|---|---|---|
| Accueil 1440, tel quel | 67/112 (59,8 %) | 87/759 (11,5 %) | 48, max 364 ms, total 4,06 s |
| Accueil 1440, chunk `spine3d` bloqué | 61/115 (53 %) | 33/847 (**3,9 %**) | **0** |
| Accueil 390 mobile, tel quel | 0/180 | 41/2 117 (1,9 %) | 2, max 179 ms |
| Accueil 390 mobile, `spine3d` bloqué | 0/180 | **0/2 488 (0 %)** | 0 |

Repos en haut de l'accueil, 1440, 3D bloquée :

| Variante | Images > 25 ms | Layouts / 3 s | Recalc. / 3 s |
|---|---|---|---|
| Telle quelle | 54/126 (43 %) | 127 | 128 |
| Halos sans `blur(60px)` | 0/181 | 182 | 182 |
| Morphing arrêté | 0/180 | **0** | 182 |
| Les deux | 0/180 | 0 | 181 |

Au repos, le morphing force une mise en page à chaque image, et le flou de 60 px rend chaque repeinture du hero coûteuse. L'association des deux fait perdre les images.

### 4.4 Attribution (HEAD, accueil, 390 mobile, CPU ×4)

Voir le tableau de P1-1 : 29,5 % tel quel, 3,8 % sans les symboles.

---

## 5. Courbes et durées : inventaire et jeu unique

### 5.1 Inventaire Réf. (`533d3bd`)

- **Jetons** :
  - `--ease: cubic-bezier(.16, 1, .3, 1)` : 56 usages ;
  - `--ease-in-out: cubic-bezier(.65, 0, .35, 1)` : 8 usages ;
  - aucun jeton de durée.
- **Courbes nommées en CSS** : `ease-in-out` ×1 (`illu-morph`), `linear` ×1 (défilant). Beaucoup de transitions de couleur sans courbe, donc `ease`.
- **Durées CSS** (nombre d'occurrences) :
  - délais et pas : 0s ×3, .025s ×2, .05s ×2, .06s ×3 ;
  - durées : .15s ×1, .2s ×3, .25s ×6, **.3s ×31**, .35s ×5, .4s ×12, .45s ×1, **.5s ×19**, .55s ×2, .6s ×8, .7s ×6, .8s ×5, .85s ×3, .9s ×2, 1s ×4, 1.2s ×3, 1.3s ×1, 1.4s ×2, 1.5s ×2, 1.9s ×1, 2.2s ×1, 2.4s ×1, 11s, 16s, 18s, 70s, 80s.
  - Soit **31 valeurs distinctes**.
- **GSAP** :

  | Durée | Courbe | Usage |
  |---|---|---|
  | 1.1 | `expo.out` | Apparitions, pas de 0.09 |
  | 0.3 | défaut `power1.out` | Apparition au focus |
  | 1.6 | `power2.out` | Compteurs |
  | 6 | `sine.inOut` | Morphing, yoyo infini |
  | 0.6 | `expo.out` | Onglets, panneau colonne, ouverture FAQ |
  | 0.45 | `power3.inOut` | Fermeture FAQ |
  | 0.35 | `power3` | Curseur |
  | 0.6 | `elastic.out(1, 0.45)` | Boutons magnétiques |
  | 0.6 | `power3` | Inclinaison |
  | 1.2 | `power3` | Calques du hero |
  | 1 | `power3` | Arche |
  | 0.5 | `power3` | Aperçu photo |
  | — | `none` | Tous les scrubs (justifié), `scrub: 0.8` sur la séance |

- **Lenis** : `duration: 1.1`, `1 - (1 - t)^4`.
- **Bilan Réf.** :
  - `none` / `linear` n'apparaissaient que dans des scrubs et dans le défilant, ce qui est conforme ;
  - sorties égales aux entrées : méga-menu, menu mobile, en-tête, bouton flottant.

### 5.2 Inventaire HEAD (`a0bf762`)

- **Jetons** (`site/src/styles/tokens.css:45-50`) :
  - `--ease-out: cubic-bezier(.23, 1, .32, 1)` ;
  - `--ease-in-out: cubic-bezier(.77, 0, .175, 1)` ;
  - `--dur-fast: .16s`, `--dur-base: .24s`, `--dur-slow: .5s`, `--dur-enter: .7s`.
- **Valeurs encore codées en dur** :

  | Emplacement | Valeur | Remplacer par |
  |---|---|---|
  | `base.css:5` / `:6` | .15s / .25s (transitions de page) | `--dur-fast` / `--dur-base` |
  | `header.css:50` | .3s `--ease-in-out` (fermeture menu) | `--dur-base` `--ease-out` |
  | `header.css:51` | `--dur-slow` `--ease-in-out` (ouverture) | `--dur-slow` `--ease-drawer` |
  | `hero.css:8` | pas .03s uniforme | délais décroissants (P2-2) |
  | `hero.css:39` | délais .18 / .24 / .32s | .12 / .12 / .18s (P2-2) |
  | `hero.css:40` | .9s, délai .1s | `--dur-enter`, 60 ms |
  | `hero.css:41` | délai .5s | .3s |
  | `hero.css:58-59` | 1.2s, délais .35 / .5s | fondu .4s, délai .3s |
  | `motion.css:9`, `symbols.css:14` | .4s (suivi souris) | `--dur-slow` (.4s) |
  | `symbols.css:25` | .9s `--ease-in-out` (masque) | supprimé (P1-1) |
  | `symbols.css:27-33` | délais .3 / .4 / .6s | supprimés (P1-1) |
  | `symbols.css:35` | 12s infini | supprimé (P1-1) |
  | `sections.css:28-29` | 70s / 80s `linear` infini | supprimé (P1-5) |
  | `footer.css:25` | délai de visibilité .3s | `var(--dur-base)` |
  | `reveal.js:17` | 60 ms × i | `[0,50,90,120,140]` ms |

### 5.3 Jeu unique proposé (valeurs exactes)

```css
:root {
  /* Courbes */
  --ease-out:    cubic-bezier(.23, 1, .32, 1);   /* toute entrée, toute sortie, tout retour d'état (défaut) */
  --ease-in-out: cubic-bezier(.77, 0, .175, 1);  /* uniquement un élément déjà à l'écran qui va de A à B */
  --ease-drawer: cubic-bezier(.32, .72, 0, 1);   /* menu plein écran mobile (courbe Ionic / Vaul) */
  /* survols de couleur : `ease` natif, voulu */

  /* Durées */
  --dur-press: .12s;  /* :active (scale .97) */
  --dur-fast:  .16s;  /* sorties, survols, changements de couleur */
  --dur-base:  .24s;  /* entrées d'interface : méga-menu, volets, FAQ, fermeture du menu mobile */
  --dur-slow:  .4s;   /* ouverture du menu mobile ; suivi souris lissé */
  --dur-enter: .6s;   /* entrées éditoriales : hero, apparitions au défilement */
}
```

- **Règles** :
  - une sortie dure `--dur-fast` (160 ms) quand l'entrée dure `--dur-base` (240 ms) ;
  - aucune interface au-delà de 240 ms, sauf le menu plein écran (400 ms, tiroir) et les entrées éditoriales (600 ms, vues une fois par section) ;
  - `linear` est réservé aux animations pilotées par le défilement (`motion.css:13`, conforme) ;
  - pas de rebond nulle part.
- **Appui** : `.btn` passe à `transition: … transform var(--dur-press) var(--ease-out)` (aujourd'hui `--dur-fast`, `buttons.css:9`).

Table de revue (format du skill emil-design-eng) :

| Avant | Après | Pourquoi |
|---|---|---|
| `clip-path var(--dur-slow) var(--ease-in-out)` (ouverture du menu) | `clip-path .4s var(--ease-drawer)` | Entrée : démarrage immédiat, arrivée douce |
| `illu-sway 12s … infinite` | supprimé | Boucle décorative sur un élément permanent |
| `marquee 70s linear infinite` | rangée `scroll-snap` statique | Un texte à lire ne doit pas bouger |
| `mask-position .9s` + 3 transitions retardées dans chaque carte | fondu de l'accent seul, 240 ms, avec la carte | Une seule entrée par conteneur ; peinture évitée |
| `animation-delay: calc(var(--i) * .03s)` | `calc(var(--i) * 28ms - var(--i) * var(--i) * .8ms)` | Pas décroissant, pas de métronome |
| `arch-in` en `clip-path` .9s | `opacity` + `scale(.98)` 600 ms | Composé par le GPU ; image LCP peinte dès la 1re image |
| `filter: blur(60px)` + suivi souris des halos | dégradé seul, immobile | Flou coûteux et redondant |
| `velocity *= 0.92` par frame | `velocity *= Math.pow(0.995, dt)` | Même inertie à 60 et 120 Hz |
| `(p - 0.5) * Math.PI * 1.6` | `(p - 0.5) * 0.6` | ±17° au lieu de ±144° |
| `transition-duration: .01ms` global en réduit | fondus d'opacité et de couleur gardés à 160 ms | Réduit ne veut pas dire nul |

---

## 6. Chorégraphie

### 6.1 Nombre de « moments »

- **Accueil Réf.** : plus de 20 mouvements distincts.
  - Au chargement : titre mot à mot, quatre blocs échelonnés, arche, anneaux, badge et puce.
  - En continu : morphing infini, indicateur infini.
  - À la souris : halos, forme et anneaux, inclinaison de l'arche.
  - Au défilement : sortie du hero en parallaxe (3 scrubs), apparitions, 14 symboles peints puis balancés et morphés, inclinaison des cartes, défilant ×2.
  - Colonne 3D : rotation au défilement, au repos, pulsation, poussière, flottaison.
  - Ailleurs : séance épinglée avec `clip-path`, parallaxe, compteurs, carte tarif inclinée, dégradé dérivant.
  - Sur tout le site : curseur, boutons magnétiques, axe de progression, Lenis, transitions de page.
- **Accueil HEAD** : environ 9 mouvements.
  - Au chargement : entrée du hero.
  - À la souris : décalage des calques.
  - Au défilement : apparitions, symboles (entrée + balancement), cartes inclinables, défilant, séance épinglée, parallaxe CSS.
  - Sur tout le site : axe de progression.
- **Cible** :
  1. **Une entrée de page** : le hero, ou le titre sur les pages intérieures.
  2. **Les apparitions de section**, sobres.
  3. **Un seul moment « signature » par page** : la colonne 3D sur l'accueil, à la demande ; le grand symbole sur les pages catégorie et article (statique, il suit seulement la souris).
  4. Tout le reste est immobile.

### 6.2 Grille des 14 catégories (accueil et `/osteopathie/`)

| Élément | Rôle | Début | Durée | Mouvement | Relation |
|---|---|---|---|---|---|
| Titre de section + chapeau | Principal | 0 | 600 ms | fondu + 16 px | groupés en un seul temps |
| Intertitre « Pour qui ? » / « Pour quoi ? » | Décor | 0 | 600 ms | fondu seul | avec le titre ou avec sa grille |
| Cartes 1 à 4 de chaque grille | Secondaire | 0 / 50 / 90 / 120 ms | 600 ms | fondu + 16 px | chevauchement (une rangée desktop) |
| Cartes 5 à 7 | Secondaire | 140 ms | 600 ms | idem | arrivent avec la 4e |
| Symbole dans la carte | Porté | — | — | aucun mouvement propre (accent en fondu 240 ms au plus) | porté par la carte |
| Balancement, reflet, inclinaison au repos | Immobile | — | — | — | supprimés |

### 6.3 Ce qui doit rester immobile, et pourquoi

1. **Les symboles une fois posés** : la profondeur se voit sans rotation, et ils sont 14 sur la même page.
2. **Les avis** : c'est du texte à lire.
3. **Les halos et la forme du hero** : ce sont des décors derrière le titre, et le flou coûte cher.
4. **La colonne 3D au repos** : elle ne tourne que sous le doigt ou au défilement, dans ±17°.
5. **Les panneaux d'onglets et le méga-menu** : ils se déclenchent au clavier et sont vus des dizaines de fois. Bascule instantanée (déjà le cas) ou fondu de 160 à 240 ms sans échelonnement (déjà le cas).

### 6.4 Vérification du ressenti

Ce point ne se juge pas sur le code. Il faut enregistrer l'entrée du hero et la grille, puis les lire image par image (panneau Animations de DevTools, vitesse 25 %). Une vague doit se lire comme un seul geste, pas comme une file d'attente. Le glisser de la colonne se teste sur un vrai trackpad et une vraie souris : un lancer franc doit tourner, un arrêt suivi d'un relâcher ne doit rien faire.

---

## 7. Opportunités manquantes (filtrées)

| # | Emplacement | Aujourd'hui | But | Fréquence | Mouvement proposé |
|---|---|---|---|---|---|
| 1 | `.cat-card a`, `.way` (`symbols.css`, `pages.css`) | Aucun retour d'appui sur les cartes cliquables. Un `:active` sur `.cat-card` serait écrasé par le transform en ligne de `tilt.js:19` | Retour d'appui | Dizaines par visite | Sur le **lien intérieur** : `.cat-card a:active, .way:active { transform: scale(.98); transition: transform var(--dur-press) var(--ease-out); }` |
| 2 | `[data-status]` du formulaire (`components/form.js`, `pages.css:112-114`) | Le message de succès ou d'erreur apparaît d'un coup | Éviter un changement brusque, confirmer l'envoi | Rare | `.form-status.ok, .form-status.ko { animation: fade-up var(--dur-base) var(--ease-out) both; }` avec `fade-up` à 8 px ; en réduit, fondu seul |

**Candidats écartés** :
- **Panneau des onglets de la colonne** (`spine.js:15-25`) : déclenché au clavier (flèches). Jamais d'animation.
- **Liens du méga-menu échelonnés** : surface très fréquente. Le retrait est déjà fait, ne pas le remettre.
- **Compteurs de chiffres** : donnée qui ne change pas ; animer au chargement relève de la décoration.
- **Transition de page avec glissement** : chaque navigation la jouerait. Le fondu de 150 / 250 ms suffit.
- **Défilement lissé (Lenis)** : la molette native est plus prévisible pour un public large, et le lissage ajoutait 1,1 s d'inertie.

**Verdict** : l'interface a besoin de **moins** de mouvement, pas de plus. L'opportunité qui rapporte le plus est le retour d'appui sur les cartes (n° 1).

---

## 8. Skills appliqués

| Skill | Ce qu'il a fait ressortir |
|---|---|
| emil-design-eng | Fréquence avant tout (pas d'animation au clavier), entrées en `ease-out`, interface sous 300 ms, sortie plus rapide que l'entrée ; format de revue Avant / Après / Pourquoi (§5.3) ; conflit entre le transform en ligne et `:active` (boutons magnétiques à la Réf., cartes inclinables à HEAD). |
| improve-animations | Démarche reconnaissance → audit en 8 catégories → vérification de chaque constat dans le code → priorisation par effet de levier ; refus de signaler ce qui est voulu et conforme (accordéon `grid-template-rows`, scrubs en `linear`). |
| review-animations | Barème des déclencheurs à signaler d'office : `elastic`, durées de plus de 300 ms, `ease-in-out` sur une entrée, survols non réservés aux appareils qui survolent, propriétés de mise en page animées (curseur, aperçu photo). |
| animation-performance | Classement composition / peinture / mise en page : `mask-position`, `box-shadow`, `background-size` et `border-radius` animés, morphing SVG (1 layout par image), flou de 60 px, variables CSS héritées, écriture puis lecture dans l'en-tête ; mesure avant conclusion, avec la limite du headless. |
| choreograph | Une entrée par conteneur (carte + symbole), délais décroissants plutôt qu'uniformes, rôles principal / secondaire / décor / immobile (hero, grille) ; deux éléments principaux dans le hero = problème de hiérarchie. |
| find-animation-opportunities | Filtre strict (fréquence, but, durée, fonction) : 2 propositions retenues, 5 candidats écartés. |
| remove-animations | Boucles infinies (défilant, balancement, pulsation, morphing, dérive), effets de démonstration (curseur, magnétisme, 288° de rotation), compteurs ; points de vigilance au retrait (états initiaux masqués, focus décalé par un `setTimeout` de 350 ms). |
| apple-design | Interruptibilité, vitesse transmise au relâcher, élan projeté en décroissance exponentielle, résistance progressive aux bornes, oscillations lentes (≈ 0,2-0,4 Hz) à éviter, réduit = fondus et non zéro. |
| animation-vocabulary | Nommage précis dans le rapport : *stagger*, *scrub* / *scroll-driven*, *reveal* en `clip-path`, *marquee*, *idle animation*, *rubber-banding*, *layout thrashing*. |
| gestures | Distinction entre suivi et relâcher pour la colonne : suivi non 1:1 (dérive), vitesse par événement, élan fantôme, inertie liée aux images, multi-doigts, `touch-action: pan-y` correct, capture du pointeur correcte. |
| animate | Ordre de décision (animer ? but ? outil le plus léger ? propriétés ? courbe et durée ? interruption ? réduit ?) appliqué à chaque correctif ; extension des jetons existants plutôt qu'un système parallèle (§5.3). |
