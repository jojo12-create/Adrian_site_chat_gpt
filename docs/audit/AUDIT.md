# Audit qualité du site

Site d'Adrian Rodriguez, ostéopathe à Villefontaine. Audit mené en lecture seule sur le commit `6fe2986` (branche `claude/osteopathe-rodriguez-premium-tky1e7`), puis corrigé sur la branche `claude/audit-refonte-qualite`.

Ce document est la synthèse classée par priorité. Le détail de chaque constat (mesures, extraits, raisonnement) est dans les quatre sections :

| Section | Contenu |
|---|---|
| [sections/animations.md](sections/animations.md) | Mouvement, fluidité, 3D, chorégraphie, courbes et durées |
| [sections/ux-a11y.md](sections/ux-a11y.md) | Parcours, mobile, formulaire, microcopie, WCAG 2.2 AA |
| [sections/typographie.md](sections/typographie.md) | Polices, échelle, typographie française, hiérarchie, 3 associations comparées |
| [sections/code.md](sections/code.md) | Poids, code mort, découpage, architecture, garde-fous SEO |

Les numéros de ligne renvoient au code du commit `6fe2986` (`site/src/css/main.css`, `site/src/js/*.js`, `site/src/main.js`). La section animations distingue en plus l'état intermédiaire qu'elle a relu.

**Légende du statut :** ✅ corrigé · ◐ corrigé en partie · ⏳ attend une information d'Adrian · ↷ reporté (expliqué).

## Les 10 constats les plus importants

| # | Constat | Priorité | Statut |
|---|---|---|---|
| 1 | La 3D (125 Ko compressés) se charge sur téléphone et pendant le défilement : blocages jusqu'à 1,3 s, 43 images perdues sur l'accueil | P0 | ✅ |
| 2 | Un seul fichier JS de 55 Ko compressés sur les 27 pages, dont 46 Ko de bibliothèques d'animation inutiles à la plupart | P0 | ✅ |
| 3 | `robots.txt` fermé (`Disallow: /`) versionné après un build de démo : risque de désindexation | P0 | ✅ |
| 4 | Aucune espace insécable : ponctuation orpheline en début de ligne (255 cas) | P0 | ✅ |
| 5 | `[À CONFIRMER]` affiché 90 fois (tarifs, durée, horaires, ADELI, SIRET…) | P0 | ⏳ |
| 6 | Contrastes insuffisants non vus par les tests : bouton or du pied de page 2,6:1, focus 2,5:1, bordure des champs 1,6:1 | P1 | ✅ |
| 7 | Animations perpétuelles ou décoratives : morphing du hero, défilant d'avis, rotation des 14 symboles, curseur, boutons magnétiques, dégradé animé, compteurs | P1 | ✅ |
| 8 | Hiérarchie typographique incohérente : 31 tailles, avertissement médical plus petit que le texte, titres en coupe « texte » à 100 px | P1 | ✅ |
| 9 | Bouton flottant caché mais atteignable au clavier ; contenu coupé à 320 px ; formulaire muet sans JavaScript | P1 | ✅ |
| 10 | Cache longue durée du `.htaccess` jamais appliqué ; code et styles morts ; `will-change` permanent sur 63 éléments | P1 | ✅ |

## P0 : bloquant

| Constat | Où | Impact | Correctif appliqué |
|---|---|---|---|
| Three.js chargé sur mobile et à l'approche de la section | `js/v3.js:93-104`, `js/spine3d.js:10-16` | +125 Ko gzip et ~0,5 Mo à compiler sur téléphone ; tâches longues de 153 à 843 ms pendant le défilement sur ordinateur | Dessin SVG par défaut ; 3D seulement sur ordinateur (≥ 1024 px, souris, WebGL, mouvement autorisé) et **sur demande** (bouton « Explorer en 3D ») ✅ |
| Bundle unique `main` : gsap + CSSPlugin 27,7 Ko, ScrollTrigger 18,2 Ko, Lenis 5,0 Ko, code 7,4 Ko (gzip) | `main.js:6-63`, `content/layout.mjs:189` | 55,2 Ko sur chaque page, même légale | Noyau sans bibliothèque (2,8 Ko) + modules importés si la page contient l'élément ; GSAP et Lenis retirés ✅ |
| Morphing SVG infini du hero (attribut `d`, mise en page à chaque image) | `js/scroll.js:51-52` | Travail permanent du fil principal, même hero hors écran | Forme fixe ✅ |
| Fichiers générés versionnés ; la démo écrit `Disallow: /` | `scripts/build-pages.mjs:46-56`, `.gitignore` | Un commit après `build:demo` peut fermer le site aux moteurs | `robots.txt`, `sitemap.xml`, `site.webmanifest` ignorés par git, toujours générés ; manifeste préfixé par `BASE` ✅ |
| Typographie française absente | `content/*.mjs` (aucun `U+00A0`) | 13 lignes commençant par `: ; ? ! »` avec la police d'origine, davantage avec une autre | `frTypo()` à la génération (`content/layout.mjs`), texte du `<body>` seulement : `<title>`, `<meta>`, JSON-LD inchangés ✅ |
| `[À CONFIRMER]` visible 90 fois | `content/site.mjs` (`tbc`, `nearby`) | Tarif, durée, horaires absents : la page Tarifs ne remplit pas son rôle | Rien n'est inventé. Titre et bouton de la carte tarif reformulés pour ne plus promettre un prix affiché. ⏳ |

## P1 : important

### Animations

| Constat | Où | Correctif appliqué |
|---|---|---|
| Deux boucles (gsap.ticker + rAF de la 3D), 56 à 61 ScrollTrigger sur l'accueil | `main.js:20-24`, `js/spine3d.js:270-297` | Plus de ticker ; la 3D rend **à la demande** (0 image au repos) ✅ |
| Propriétés de mise en page animées : hauteur de la FAQ, `left`/`top` de l'aperçu, `width`/`height`/`margin` du curseur, `border-radius` des fonds de symbole | `js/ui.js:62-65`, `:92-93`, `main.css:594-598`, `:650` | FAQ native (`::details-content`), aperçu et curseur supprimés, fond fixe ✅ |
| Durées et courbes sans système : 20 durées de 0,2 à 2,4 s, interface à 0,5–0,9 s | `main.css` (47 transitions) | Jeu unique `--ease-out`, `--ease-in-out`, `--ease-drawer`, `--dur-press/fast/base/slow/enter` ; interface sous 300 ms ; sorties plus rapides que les entrées ✅ |
| Entrées empilées : menu puis liens en file, panneau puis liens, carte puis symbole | `main.css:152-160`, `:236-237`, `:637-646` | Une seule entrée par conteneur ✅ |
| Hero : 7 éléments animés jusqu'à 2,9 s, titre et photo en concurrence | `main.css:285-293`, `:705-710` | Le titre mène, tout est en place en 0,8 s, décor en simple fondu ✅ |
| Décor sans fonction : curseur personnalisé, boutons magnétiques, compteurs, dégradé animé, indicateur de défilement, reflets, inclinaison de blocs de texte | `js/pointer.js`, `js/scroll.js:33-41`, `main.css:277`, `:424` | Retirés ; l'inclinaison reste sur les cartes de catégories (4° max) ✅ |
| Défilant d'avis infini (70 et 80 s) | `main.css:306-309`, `js/ui.js:38-52` | Rangée que l'on fait défiler soi-même, grille sur ordinateur ✅ |
| Symboles : rotation infinie ×14, masque repeint, ombres floues en 3D | `main.css:637-650` | Rotation lente réservée au grand symbole de page ; cartes : relief au survol ; à plat sur téléphone ◐ (voir « Écarts assumés ») |
| Glisser de la colonne : vitesse par événement, inertie liée à l'écran, élan fantôme, pas de garde multi-doigts, rotation de 288° au défilement | `js/spine3d.js:237-255`, `:281-283` | Suivi 1:1, vitesse sur 100 ms en rad/ms, freinage indépendant de la fréquence, résistance aux bornes, ± 17° ✅ |
| Survols actifs au toucher (30 règles `:hover` non conditionnées) | `main.css` | Toutes sous `@media (hover: hover)` ✅ |
| Mouvement réduit : tout coupé, fondus compris | `main.css:606-610` | Les fondus courts restent, plus aucun déplacement ; rechargement si le réglage change ✅ |
| `will-change` permanent (63 éléments sur l'accueil) | `main.css:99`, `:473`, `:603`, `:678`, `:697`, `:702` | Retiré partout sauf la piste épinglée ✅ |

### Ergonomie et accessibilité

| Constat | Où | Correctif appliqué |
|---|---|---|
| Bouton or du pied de page : blanc sur or, 2,63:1 | `main.css:566-567` | `.footer a:not(.btn)` : encre sur or, 6,93:1 ✅ |
| Focus or sur fond clair : 2,48:1 | `main.css:79` | Contour forêt 11,2:1 + halo doré ; or clair sur fonds sombres ✅ |
| Bordure des champs : 1,64:1 | `main.css:542` | `#857f72`, 3,98:1 ✅ |
| Bouton flottant caché mais focalisable | `main.css:585`, `js/nav.js:26-30` | `inert` + `visibility: hidden` ✅ |
| 320 px : pied de page et colonne « Tarif » coupés | `main.css:571`, `:514-518`, `:85` | Colonnes `minmax(0, 1fr)`, tableau défilable, étiquettes repliables ✅ |
| Formulaire sans JS : ni confirmation ni erreur | `public/api/contact.php:21`, `js/form.js:27` | Messages `#envoye` / `#erreur` affichés en CSS (`:target`) ✅ |
| Erreur qui disparaît à la sortie du champ : la page remonte, le clic suivant tombe à côté | `js/form.js:34-38` | L'erreur disparaît pendant la saisie ✅ (trouvé pendant les tests) |
| Promesse « tarif clair » et « Réserver ce créneau » sans prix ni créneau | `content/pages.mjs:202-214` | « Ce que comprend la séance », « Voir les créneaux » ✅ |
| Adresse à 17 écrans sur l'accueil mobile, pas d'itinéraire dans le menu | `content/layout.mjs:202` | Lien « Itinéraire vers le cabinet » dans le menu mobile ✅ |

### Typographie

| Constat | Où | Correctif appliqué |
|---|---|---|
| Fraunces figée en coupe 9 pt, affichée à 94–115 px | `src/fonts/fraunces-*.woff2` | Source Serif 4 en coupe d'affichage ✅ |
| 3 tailles de H1, 5 de H3, 31 tailles de texte, 10 graisses | `main.css:71-73`, `:433`, `:561`, `:793-795` | Échelle fluide à 7 niveaux (`--fs-xs` … `--fs-display`), H1 unique ✅ |
| « Quand privilégier un avis médical » : 17,6 px pour un texte à 18 px | `main.css:795` | Niveau « chapô » en graisse 600 ✅ |
| 89,6 Ko de polices par page, italique préchargée, police du texte non préchargée | `vite.config.js:20`, `main.css:9-13` | 77,5 Ko ; serif droite et Figtree préchargées, italique seulement si le H1 en contient ✅ |
| Police de secours mal réglée | `main.css:16` | Métriques recalculées pour les deux familles ✅ |
| Étiquettes en capitales espacées (6) | `main.css:159, 276, 516, 575, 666, 791` | Minuscules, 13–14 px, graisse 600 ✅ |

### Code et architecture

| Constat | Où | Correctif appliqué |
|---|---|---|
| Cache `immutable` jamais envoyé ; `text/javascript` et SVG sans cache ni compression | `public/.htaccess:34`, `:47`, `:50-52` | Motif sur le nom versionné, types ajoutés ✅ (à confirmer sur l'hébergeur) |
| Code mort : `initTabs`, `initHoverPreview`, 42 règles CSS sans cible | `js/ui.js:5-36`, `:88-102`, `main.css:325-341`, `:438-451`, `:462-470` | Supprimés ✅ |
| Génération d'image déclenchée par un simple import | `content/illustrations.mjs:15`, `scripts/symbols.mjs` | Donnée dans `content/symbols.mjs` ✅ |
| Un fichier CSS de 811 lignes, section « V3 » ajoutée après coup | `src/css/main.css` | `src/styles/` en couches `@layer tokens, base, layout, components` + `motion.css` ✅ |
| Scripts regroupés par époque (`v3.js`) plutôt que par rôle | `src/js/` | `src/scripts/{core,animations,components,three}` ✅ |
| Dépendances inutiles | `package.json` | `gsap`, `lenis`, `@fontsource-variable/fraunces`, `@fontsource-variable/manrope` retirées ✅ |

## P2 : finition

| Constat | Statut |
|---|---|
| Icônes non carrées et lourdes (512 px : 370 Ko), `logo-320.webp` inutilisé | ✅ 129 Ko, carrées |
| `!important` inutiles sur le canvas 3D | ✅ |
| `aria-current="page"` aussi sur la rubrique parente | ✅ (`true` pour la rubrique) |
| Encoche : `viewport-fit`, `safe-area` ; couleur de barre d'état ; flash au tap ; `100vh` de la section épinglée | ✅ |
| Repères « L1 – L5 » et libellés de la carte tarif juste sous 4,5:1 | ✅ |
| Lecture puis écriture dans le même passage au défilement (en-tête) | ✅ hauteur mise en cache |
| « 24 vertèbres » présenté comme un chiffre du cabinet | ✅ retiré des chiffres |
| Champ unique « Téléphone ou e-mail » (`autocomplete="tel"` seulement) | ↷ demande de modifier aussi le PHP et le message reçu par Adrian |
| Focus perdu après l'envoi du formulaire | ↷ |
| Limite d'envois par adresse IP dans `contact.php` | ↷ |
| Accueil long sur mobile (22 écrans), réponse « l'ostéopathie peut-elle m'aider ? » à 3,4 écrans sur les pages catégorie | ↷ choix de contenu à valider |
| Tokens : 30 `#fff` et 42 `rgba()` codés en dur ; espacements non migrés vers `--sp-*` | ◐ tokens créés, migration partielle |
| Titres découpés mot par mot : lecture par VoiceOver à vérifier sur iPhone | ↷ nécessite un appareil |
| 404 : balise canonique sur une page `noindex` | ↷ laissé tel quel (consigne : canonicals inchangés) |

## Écarts assumés par rapport aux recommandations des skills

Trois recommandations n'ont pas été suivies, parce qu'elles contredisent une demande explicite ou la charte :

1. **Accent terracotta des symboles** (jugé hors charte, à remplacer par l'or) : conservé. Les 14 symboles ont été fournis ainsi et devaient être repris fidèlement.
2. **Mot en italique vert dans les titres** (31 titres, à supprimer) et **fond crème** : conservés. C'est l'identité validée ; la police plus sobre et les étiquettes en minuscules réduisent déjà l'effet « modèle ».
3. **Rotation des symboles** (à supprimer entièrement) : supprimée dans les 14 cartes, gardée lente sur le seul grand symbole des pages catégorie, puisque des symboles « animés en 3D » ont été demandés.

Ces trois points se changent chacun en quelques lignes si l'avis évolue.

## Associations de polices étudiées

| Option | Titres + texte | Poids | Avis |
|---|---|---|---|
| Actuelle | Fraunces + Manrope | 89,6 Ko | Chaleureuse mais lourde en grand, coupe inadaptée, très répandue |
| **A (retenue)** | **Source Serif 4 + Figtree** | **77,5 Ko** | Serif de lecture, calme et sérieuse ; garde l'empattement et l'italique de l'identité |
| B | Commissioner seule | 37,4 Ko | La plus légère et la plus originale, mais sans serif : change le caractère du site |
| C | Literata + Atkinson Hyperlegible Next | 98,7 Ko | La plus lisible, la plus lourde, moins haut de gamme |

Captures comparatives (accueil et page catégorie, 390 et 1440 px) : dossier [polices/](polices/). L'analyse typographique recommandait B ; A a été retenue pour rester fidèle à l'identité à empattements. Passer à B ou C ne touche que `site/src/styles/fonts.css`, deux lignes de `tokens.css` et `vite.config.js`.

## Garde-fous SEO

Les 26 URL indexables, les redirections et les invariants sont listés dans [sections/code.md](sections/code.md) (§ 5). Vérification automatique avant/après : mêmes URL, mêmes `title`, `description`, `canonical`, `robots`, Open Graph, JSON-LD, nombre de H1, `sitemap.xml` et `robots.txt` sur les 27 pages. Résultat dans [RESULTATS.md](RESULTATS.md).
