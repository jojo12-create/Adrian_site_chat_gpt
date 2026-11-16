# Audit code, performance des ressources et architecture

_Branche `claude/audit-refonte-qualite`, 16/11/2026. Lecture seule : aucun fichier du dépôt modifié hormis ce livrable. Mesures sur la compilation de référence `baseline-dist` (servie en gzip par `serve-dir.mjs`, port 4180) et sur une copie du dépôt compilée à part (scratchpad `audit-code/`, découpage `manualChunks` + sourcemaps pour attribuer les octets)._

Légende des priorités :
- **P0** : bloque la refonte ou coûte cher à chaque visite.
- **P1** : gain net mesurable, à faire pendant la refonte.
- **P2** : dette ou hygiène.

Score « tech-debt » = (Impact + Risque) × (6 − Effort), chaque note sur 5.

---

## 1. Synthèse

| # | Constat | Prio | Gain chiffré | Score |
|---|---|---|---|---|
| 1 | Three.js (493,6 Ko brut, **125,0 Ko gzip**) chargé aussi sur mobile, sur `/` et `/osteopathie/` | P0 | −125 Ko gzip et −494 Ko de JS à analyser par visite mobile | (5+4)×4 = 36 |
| 2 | Un seul bundle `main` (147,9 Ko brut, **55,4 Ko gzip**) servi sur les 27 pages, avec GSAP, ScrollTrigger et Lenis partout | P0 | −50 à −51 Ko gzip sur les pages légales, contact, tarifs, avis et conseils | (5+3)×3 = 24 |
| 3 | Fichiers générés **versionnés** (`robots.txt`, `sitemap.xml`, `site.webmanifest`, `docs/textes.md`) : `build:demo` écrit `Disallow: /` dans un fichier suivi par git | P0 | Risque de désindexation complète au déploiement | (3+5)×5 = 40 |
| 4 | `.htaccess` : `<FilesMatch "^assets/">` ne correspond jamais (le test porte sur le nom du fichier seul), donc pas de `immutable` ; le JS est mis en cache sous `application/javascript` uniquement | P1 | Revalidations inutiles du JS, de la CSS et des polices | (3+3)×5 = 30 |
| 5 | Code mort : 2 fonctions JS jamais utiles (`initTabs`, `initHoverPreview`), 42 règles CSS sans cible (≈ 3,9 Ko minifié) | P1 | −3,9 Ko min. / −0,65 Ko gzip CSS ; < 1 Ko gzip JS | (2+2)×5 = 20 |
| 6 | Animations qui ne s'arrêtent jamais : morphing SVG du hero (`repeat: -1`, attribut `d`, thread principal), `illu-morph` (border-radius, peinture) jamais mis en pause hors écran | P1 | Supprime un travail permanent de peinture et de JS à chaque image | (3+2)×4 = 20 |
| 7 | 63 éléments en `will-change` permanent sur l'accueil (dont 48 `[data-reveal]` déjà révélés) | P1 | Moins de calques GPU (mémoire), surtout sur mobile | (2+2)×5 = 20 |
| 8 | Tokens incomplets : 30 `#fff` codés en dur (le token `--white` existe), 60 `rgba()` dont 42 valeurs différentes, `--ink` redéfini dans `.illu` | P2 | Maintenance, thème | (2+2)×3 = 12 |
| 9 | `content/illustrations.mjs` importe `scripts/symbols.mjs`, qui **réécrit `symboles.svg` à chaque import** (effet de bord) | P1 | Couplage contenu ↔ script, écritures disque cachées | (2+3)×5 = 25 |
| 10 | Dépendances : `@fontsource-variable/fraunces` inutilisée, `playwright` utilisée par `npm test` mais non déclarée | P2 | `npm ci` plus léger, tests reproductibles | (1+3)×5 = 20 |

**Total JS par page aujourd'hui** (gzip, transféré) :
- 55,4 Ko sur toutes les pages ;
- 180,4 Ko sur `/` et `/osteopathie/` dès que la section colonne approche, **y compris sur mobile**.

**Cible proposée** (détail au § 4.3) :
- ≈ 4 Ko sur les pages sans animation pilotée par le défilement ;
- ≈ 50 Ko sur l'accueil ;
- Three.js seulement sur ordinateur, à la demande.

---

## 2. Constats détaillés

### P0

**P0-1. Three.js chargé sur mobile.** Fichiers : `site/src/js/v3.js:93-104` et `site/src/js/spine3d.js:10-16`.
- **Problème.** `initSpine` calcule `mobile` (ligne 93), mais s'en sert seulement pour baisser le niveau de détail. L'import dynamique `./spine3d.js` part dès que la section est à 600 px. Mesure Playwright (390 × 844, DPR 3, défilement complet de `/`) : `spine3d-BCKb1BLQ.js` = **125,0 Ko gzip** transférés, soit 493,6 Ko de JS à analyser et compiler.
- **Tree-shaking de `three`.** Les imports sont nommés, et Rollup élague bien : 497 Ko contre 685 Ko pour `export * from 'three'` (esbuild, minifié). Le plancher reste toutefois `WebGLRenderer` seul, à **474 Ko minifiés**. Le poids vient de `three.module.js` (312 Ko : moteur WebGL et shaders) et de `three.core.js` (170 Ko). Il n'y a donc presque rien à gagner côté imports. Le gain passe par la condition de chargement.
- **Impact.**
  - Le plus gros fichier du site, servi sur le support où il coûte le plus (CPU mobile).
  - Le rendu tourne ensuite en continu à 60 i/s (`spine3d.js:280-293`) tant que la section est visible.
- **Correctif.**
  - Si `mobile` est vrai, ne jamais importer `spine3d.js` : la colonne SVG `.spine-fallback` reste affichée (elle existe déjà).
  - Sur ordinateur, déclencher l'import au premier `pointerenter` ou `focusin` dans `[data-spine-canvas]`, ou au clic sur un bouton « Explorer en 3D ». Garder l'`IntersectionObserver` seulement pour précharger via `<link rel="modulepreload">`.
  - Supprimer la variable morte `needs` (`spine3d.js:270`, `:271`, `:292` : écrite, jamais lue).
- **Gain.**
  - Mobile : −125,0 Ko gzip et −493,6 Ko brut sur `/` et `/osteopathie/`.
  - Ordinateur : la même économie pour tout visiteur qui n'interagit pas avec la colonne.

**P0-2. Bundle unique sur toutes les pages.** Fichiers : `site/src/main.js:6-63` et `content/layout.mjs:189` (un seul `<script type="module" src="/src/main.js">` pour 27 pages).
- **Problème.** Contenu exact de `main-C7B07Mrn.js` (151 417 o), attribué par sourcemap sur une compilation découpée :

  | Composant | Brut | gzip |
  |---|---|---|
  | gsap (gsap-core 50,0 Ko + CSSPlugin 18,2 Ko) | 70,0 Ko | 27,7 Ko |
  | ScrollTrigger (33,5 Ko, dont Observer 9,0 Ko) | 43,6 Ko | 18,2 Ko |
  | Lenis | 17,5 Ko | 5,0 Ko |
  | Code du site (v3 3,6 · form 3,6 · nav 3,4 · ui 2,9 · scroll 2,8 · pointer 1,7 · main 0,7) | 20,2 Ko | 7,4 Ko |

  GSAP n'est pas « complet » : seulement le cœur, CSSPlugin et ScrollTrigger. Three n'est pas dans `main` (import dynamique, correct).

- **Ce dont chaque page a réellement besoin** (comptage des attributs dans `baseline-dist`) :
  - `/mentions-legales/`, `/confidentialite/` et `404` : aucun `data-reveal`, `data-parallax`, `data-illu` ni formulaire.
  - `/contact/` : 9 `data-reveal`, 1 formulaire, 2 cartes.
  - `/tarifs/` et `/avis/` : des `data-reveal` seulement.
  - Pages catégorie : `data-reveal` et `data-illu`. Un `data-parallax` sur 9 des 14 pages.
  - Seul `/` utilise `data-pin-steps`, `data-hero`, `data-morph`, `data-count` et `data-marquee`.
- **Impact.** Chaque page paie 55,4 Ko gzip, et ~148 Ko à analyser, pour des effets absents de la page.
- **Correctif.** Découpage par page, détaillé au § 4.3 :
  - Noyau sans GSAP : menus, en-tête, progression, apparitions par `IntersectionObserver` et classe CSS (le principe existe déjà dans `initIllus`, `v3.js:7-14`), FAQ native, carte.
  - Modules importés seulement si le sélecteur est présent.
- **Gain.** −50 à −51 Ko gzip sur 8 pages ; −5 Ko sur l'accueil (suppression de Lenis) ; −125 Ko sur l'accueil mobile (P0-1).

**P0-3. Fichiers générés versionnés, `build:demo` dangereux.** Fichiers : `scripts/build-pages.mjs:46-56` et `:64-66`, `.gitignore`. Suivis par git : `site/public/robots.txt`, `site/public/sitemap.xml`, `site/public/site.webmanifest`, `docs/textes.md`.
- **Problème.**
  - `npm run build:demo` réécrit `site/public/robots.txt` en `User-agent: *\nDisallow: /`. Le fichier est versionné : un commit après une démo, puis un `vite build` sans `npm run pages` (ou une copie manuelle), et la production est fermée aux robots.
  - Le `sitemap.xml` versionné change à chaque compilation (`lastmod` = date du jour pour les 26 URL), ce qui crée du bruit dans les diffs et des `lastmod` non significatifs.
- **Correctif.**
  - Ajouter au `.gitignore` : `site/public/robots.txt`, `site/public/sitemap.xml`, `site/public/site.webmanifest`. Les générer dans `dist/` seulement (plugin Vite `generateBundle` ou écriture après `vite build`).
  - Pour `lastmod`, utiliser la date du dernier commit du fichier de contenu, par exemple `git log -1 --format=%cs -- content/pages.mjs`, ou un `updated` par page dans `content/`.
  - Faire tourner le garde-fou SEO du § 6 dans `npm test`.

### P1

**P1-1. `.htaccess` : cache immuable inopérant.** Fichier : `site/public/.htaccess:50-52` et `:47`.
- **Problème.**
  - `<FilesMatch "^assets/">` compare une expression au **nom du fichier** (`main-C7B07Mrn.js`), jamais au chemin : l'en-tête `immutable` n'est jamais envoyé.
  - `ExpiresByType application/javascript` ne couvre pas `text/javascript`, le type servi par les `mime.types` Apache récents. Le JS risque alors de n'avoir aucune durée de cache.
  - Rien pour `image/svg+xml` (le sprite `symboles.svg`, 20,3 Ko gzip, chargé sur toutes les pages).
- **Correctif.**
  - Remplacer le bloc par `<FilesMatch "-[A-Za-z0-9_-]{8}\.(js|css|woff2)$"> Header set Cache-Control "public, max-age=31536000, immutable" </FilesMatch>`.
  - Ajouter `ExpiresByType text/javascript "access plus 1 year"` et `ExpiresByType image/svg+xml "access plus 30 days"`.
  - Ajouter `image/svg+xml` et `text/javascript` à `AddOutputFilterByType DEFLATE` (ligne 34 : `text/javascript` absent).

**P1-2. Code mort JS.** Fichiers : `site/src/js/ui.js:5-36` (`initTabs`) et `:88-102` (`initHoverPreview`), appelés en `main.js:41` et `:59`.
- **Problème.** `[data-tabs]` et `[data-hover-preview]` sont présents sur **0 page** de `baseline-dist`. `initHoverPreview` anime en plus `left` et `top` (lignes 92-93), donc des propriétés de mise en page.
- **Doublon.** Deux implémentations du motif d'onglets clavier : `ui.js:5-36` et `v3.js:59-87`.
- **Correctif.** Supprimer les deux fonctions et leurs appels. Garder une seule fonction `tabs(root, { onSelect })` dans `components/tabs.js`.
- **Paramètres inutilisés.** `initProgress(reduced)` (`scroll.js:75`) n'utilise pas `reduced`. `illuKeys` (`content/illustrations.mjs:28`) n'est importé nulle part.

**P1-3. Code mort CSS** (mesure croisée : sélecteurs de `main.css` contre les classes des 27 HTML de `baseline-dist` et les classes écrites par le JS, Lenis compris).
- **Règles sans cible.** 42 règles, toutes de `site/src/css/main.css` :
  - `.arch-sm` (272) ;
  - bloc « Où ça coince ? » `.where-*` et `.spine-svg *` (325-341) ;
  - `.motif-index`, `.mi-*` (438-446) ;
  - `.hover-preview*` (447-451) ;
  - `.motif-hero*` (462-464) ;
  - `.art-panel`, `.art-line`, `.art-sun` (465-470).
- **Gain mesuré.** CSS minifiée (esbuild, hors @font-face Manrope) de 53 473 à 49 617 o, soit **−3,9 Ko** ; gzip de 12 204 à 11 556 o (−0,65 Ko) ; brotli de 10 767 à 10 181 o (−0,59 Ko).
- **Faux positifs écartés.**
  - `.demo-badge` (589-591) : sert en mode démo.
  - `.lenis-smooth` : posée par Lenis.
  - `.art-title` : utilisée.
- **Classes HTML sans CSS** (27, inoffensives mais à trier) : `no-js`, `mega-osteo`, `mega-cabinet`, `btn-primary`, `btn-label`, `cta-inner`, `about-text`, `principles`, `gallery-sec`, `cv`, `quotes`, `article-visual`, `ways-sec`, `faq`, `hero-text`, `intro`, `cats`, `spine-intro`, `spine-panels`, `sport-text`, `offer`, `offer-text`, `access`, `access-text`, `conseils-teaser`, `cat-hero-visual`, `cases`. Certaines servent de crochets JS (`btn-label` dans `form.js:51`) : à conserver ou à passer en `data-*`.

**P1-4. Animations perpétuelles** (skill `animation-performance`, « où ça tourne » et « quoi »).
- **Morphing du hero, `site/src/js/scroll.js:51-52`.**
  - Cause : un `gsap.timeline({ repeat: -1, yoyo: true })` interpole l'attribut `d` d'un `<path>`. C'est du thread principal, avec une peinture à chaque image, **pour toujours**, même quand le hero est sorti de l'écran.
  - Avant : timeline infinie.
  - Après : `ScrollTrigger.create({ trigger: '.hero', onToggle: (s) => s.isActive ? tl.play() : tl.pause() })`, ou une forme fixe.
  - Vérifié depuis le code ; un enregistrement sur appareil est nécessaire pour chiffrer les images perdues.
- **`.illu-bg`, `site/src/css/main.css:650`.**
  - Cause : `animation: illu-morph 16s infinite` anime `border-radius` (peinture), sans `animation-play-state` lié à `.is-live`, contrairement à `.illu-sway` (648-649). Ces fonds continuent de peindre même hors écran. Il y en a 17 sur l'accueil et 7 par page catégorie.
  - Après : `.illu.is-in .illu-bg { animation-play-state: paused } .illu.is-in.is-live .illu-bg { animation-play-state: running }`.
- **Défilant et dégradé, `main.css:309` et `:425`.** Les animations `marquee` (×4) et `drift` tournent hors écran au chargement de `/` (mesure : 6 animations actives hors écran sur 7). Elles ne coûtent que du `transform`, donc composite seul. Mise en pause hors écran recommandée par la même classe `.is-live`.
- **Curseur, `main.css:594-598`.**
  - Cause : `transition: width .35s, height .35s, margin .35s` provoque une mise en page à chaque survol de lien.
  - Après : élément fixe de 72 × 72 px, `transform: scale(.194)` au repos, `scale(.64)` en `.is-link`, `scale(1)` en `.is-label`, et `transition: transform .35s var(--ease), opacity .3s, background-color .3s`.
- **FAQ, `site/src/js/ui.js:62` et `:65`.**
  - Cause : la hauteur est animée par GSAP (mise en page sur toute la colonne).
  - Après : CSS natif `details::details-content { transition: block-size .5s var(--ease), content-visibility .5s allow-discrete; block-size: 0 } details[open]::details-content { block-size: auto }` avec `interpolate-size: allow-keywords` sur `:root`. Navigateurs sans support : ouverture instantanée. On retire GSAP du composant.

**P1-5. `will-change` permanent.** Fichiers : `main.css:99` (`.btn`), `:473` (`.case-list li`), `:603` (`.js [data-reveal]`), `:678` (`.cat-card`), `:697` (`.orb`), `:702` (`.hero-visual .arch`).
- **Mesure.** 63 éléments promus sur `/` (48 hors `.btn`/`.cat-card`), 28 sur une page catégorie.
- **Correctif.**
  - Retirer `will-change` de `[data-reveal]` (GSAP promeut l'élément pendant l'animation) ; sinon `gsap.set(el, { willChange: 'auto' })` dans `onComplete`.
  - Retirer de `.btn` et `.cat-card`.
  - Le garder seulement sur `.orb` (grand flou, 60 px).

**P1-6. Effet de bord à l'import.** Fichiers : `content/illustrations.mjs:15` et `scripts/symbols.mjs:162-181`.
- **Problème.** Le corps de `symbols.mjs` (lecture des SVG et `writeFileSync('site/public/images/symboles.svg')`) s'exécute au niveau du module. `npm run pages` affiche donc « ✓ symboles.svg : 14 symboles, 62.6 Ko » à chaque compilation : la donnée `symbolFiles` vit dans un script de build, et la génération de pages écrit un fichier d'image sans le dire.
- **Correctif.**
  - Déplacer `symbolFiles` dans `content/symbols.mjs` (donnée pure).
  - Dans `scripts/symbols.mjs`, envelopper la génération dans `if (import.meta.url === pathToFileURL(process.argv[1]).href)`, ou l'importer depuis `content/`.

**P1-7. Polices.** Fichiers : `site/vite.config.js:16-23` et `main.css:9-13`.
- **Mesure.** Les polices pèsent **89,6 Ko par page**, soit 48 % du transfert de `/mentions-legales/` (188 Ko) :
  - Fraunces italique : 36,1 Ko ;
  - Fraunces romain : 29,3 Ko ;
  - Manrope latin : 24,3 Ko.
- **Problèmes.**
  - Fraunces est déjà réduite (graisses 300-460, caractères français). Manrope est importée **entière** par `@fontsource-variable/manrope/index.css` : 6 sous-ensembles émis, seul `latin` téléchargé grâce à `unicode-range`.
  - Le préchargement porte sur les deux Fraunces. Manrope n'est pas préchargée, alors que le LCP est un **paragraphe en Manrope** (`P.lead`) sur `/contact/` et `/osteopathie/lombalgie/` (mobile).
  - `.brand strong` (139) et `.hero-badge` (273) demandent `font: 500 … var(--f-title)` alors que l'axe Fraunces s'arrête à 460.
- **Correctif.**
  - Réduire Manrope comme Fraunces (fonttools, `--unicodes` latin et français, axe 400-700). Gain estimé à mesurer, l'outil n'est pas installé ici.
  - Précharger `manrope-latin` à la place de `fraunces-…-italic` sur les pages dont le H1 n'a pas d'`<em>` (`/mentions-legales/`).
  - Remplacer 500 par 460 dans ces deux règles.

**P1-8. Mode démo.** Fichier : `scripts/build-pages.mjs:52-56`. Le manifeste garde `start_url: "/"` et des icônes en `/icon-512.png`, non préfixés par `BASE` : sous `/Adrianosteo/`, icônes en 404 (vérifié dans une compilation démo de la copie). Correctif : `start_url: BASE`, `src: BASE + 'icon-512.png'`.

### P2

- **Règles qui s'annulent.**
  - `.btn:active { transform: scale(.97) }` (`main.css:104`) est sans effet sur les boutons `data-magnetic` en souris : GSAP y écrit un `transform` en ligne (`pointer.js:26-35`), qui l'emporte. Correctif : appliquer la pression à un enfant (`.btn-label`), ou utiliser `scale` (propriété individuelle) au lieu de `transform`.
  - `.footer-claim em` hérite de `color: var(--green)` (74), aussitôt remplacé par `--gold-2` (570) : retirer `.footer-claim em` de la ligne 74 et porter `font-style` et `font-weight` en 570.
- **Règles en double ou éclatées.** `.hero-visual` (269 et 701), `.illu-stage` (626 et 627), `.map-note` (398 et 399), `.spine-troubles a` (756 et 757), `.hero-lead/.hero-actions/.hero-proof/.hero-place` (286 et 287). La section « V3 » (612-802) est ajoutée **après** le bloc « mouvement réduit » (605-610) et complète des composants définis plus haut. À regrouper par composant.
- **`!important`.** 7 occurrences :
  - `main.css:64` `.lenis.lenis-smooth { scroll-behavior: auto }` : légitime, CSS officielle de Lenis.
  - `main.css:607` ×4 : `animation-duration`, `animation-iteration-count`, `transition-duration`, `scroll-behavior` dans `prefers-reduced-motion: reduce`. Légitimes ; à placer en `@layer` le plus haut ou garder `!important`.
  - `main.css:744` ×2 : `.spine-canvas canvas { width: 100% !important; height: 100% !important }`. **Inutiles** : `renderer.setSize(w, h, false)` (`spine3d.js:260`) n'écrit aucun style en ligne. À retirer.
- **Sélecteurs trop spécifiques** : 20 au-delà de (0,4,0), sans aucun id. Les plus lourds :
  - `.nav.is-open .nav-top > li > .nav-link` (174, 0-4-1) ;
  - `.js .illu.is-in .illu-*` (639-646) ;
  - `.has-menu.is-open .mega-in::before` (222).

  Avec `@layer` et des états en attributs (`[data-state=open]`), viser (0,2,0) au plus.
- **Collision de token.** `.illu { --ink: #1d3526 }` (`main.css:619`) redéfinit le token global `--ink: #161515`. Renommer en `--illu-ink`, `--illu-ink-edge` et `--illu-accent`.
- **Valeurs magiques JS ↔ CSS.** `lenis.scrollTo(target, { offset: -80 })` (`main.js:31`) alors que `--header` vaut 72 puis 84 px et que `scroll-padding-top` vaut `calc(var(--header) + 24px)` (`main.css:62`). Lire `getComputedStyle(document.documentElement).scrollPaddingTop`.
- **Défilement.**
  - `initProgress` (`scroll.js:84`) écrit le style à chaque évènement `scroll`, sans `requestAnimationFrame`, et appelle `matchMedia()` à chaque fois (ligne 82).
  - `initHeader` (`nav.js:13`) exécute `querySelector('.has-menu.is-open')` à chaque défilement.
  - Correctif : mémoriser le `MediaQueryList`, regrouper les deux gestionnaires dans un seul passage rAF.
- **Variables CSS héritées écrites à chaque image.** `--px`, `--py`, `--mx` et `--my` sur `.illu-xl` (`v3.js:28-29`) et `[data-tilt]` (`pointer.js:46-47`) : recalcul de style de tout le sous-arbre (piège « Inherited CSS variables » du skill). Les sous-arbres sont petits (7 calques), donc impact faible. Écrire directement `transform` sur `.illu-stage`.
- **Images.**
  - `scripts/images.mjs:120` : `resize(512)` sans hauteur donne `icon-512.png` en **512 × 516** et 361,6 Ko, alors que le manifeste annonce 512 × 512. `apple-touch-icon.png` sort en 180 × 181 (49,2 Ko), `logo-160.webp` en 160 × 161.
  - Correctif : `resize(512, 512, { fit: 'contain', background: '#ffffff' })` et `.png({ palette: true, quality: 90 })`. Mesuré : 119,5 Ko au lieu de 361,6 Ko pour l'icône, 19,3 Ko au lieu de 49,2 Ko pour `apple-touch`.
  - `logo-320.webp` (14,4 Ko) n'est référencé par aucune page.
  - Largeurs quasi doublons (1200 et 1250) pour 4 photos : filtrer une largeur si elle dépasse la précédente de moins de 15 % (`images.mjs:104`).
- **404.** La page `404.html` porte `canonical=https://osteovillefontaine.fr/404.html` alors qu'elle est en `noindex` : retirer la balise canonique sur la 404 (`layout.mjs:175`).
- **`contact.php`.** Correct sur l'essentiel : CR/LF retirés, `Reply-To` posé seulement sur un e-mail validé, liste blanche `for`, pot de miel et délai minimal. Il manque une limite de fréquence par IP (fichier `sys_get_temp_dir()`, par exemple 5 envois par heure).
- **Lenis.** La CSS officielle n'est reprise qu'en partie (`main.css:63-64`) : manque `.lenis.lenis-smooth iframe { pointer-events: none }`, utile pour l'iframe Google Maps chargée au clic.

---

## 3. Mesures

### 3.1 Chunks de `baseline-dist/assets` (zlib Node : gzip niveau 9, brotli qualité 11)

| Fichier | Brut (Ko) | gzip (Ko) | brotli (Ko) |
|---|---|---|---|
| `main-C7B07Mrn.js` | 147,9 | 55,2 | 49,4 |
| `spine3d-BCKb1BLQ.js` (Three inclus) | 493,6 | 124,6 | 102,9 |
| `main-CzT-9SL-.css` | 54,5 | 12,5 | 11,0 |
| `fraunces-latin-wght-italic-fr.woff2` | 36,1 | — | — |
| `fraunces-latin-wght-normal-fr.woff2` | 29,2 | — | — |
| `manrope-latin-wght-normal.woff2` | 24,3 | — | — |
| `manrope-latin-ext` / `cyrillic` / `greek` / `vietnamese` / `cyrillic-ext` (émis, non téléchargés) | 14,8 / 14,2 / 9,2 / 8,3 / 2,5 | — | — |

Briques mesurées isolément (esbuild minifié, gzip et brotli) :

| Brique | min. | gzip | brotli |
|---|---|---|---|
| `gsap` (cœur et CSSPlugin) | 68,6 | 26,9 | 24,3 |
| `gsap` et `ScrollTrigger` | 111,6 | 43,9 | 39,5 |
| `lenis` | 15,8 | 4,5 | 4,1 |
| `nav.js` seul | 3,4 | 1,3 | 1,1 |
| `form.js` seul | 2,5 | 1,2 | 1,1 |
| `nav.js` et `form.js` | 5,9 | 2,4 | 2,1 |
| `three` entier (`export *`) | 685,3 | — | — |
| `three`, `WebGLRenderer` seul | 473,6 | — | — |

### 3.2 Transfert par page (Playwright Chromium, gzip du serveur de référence, cache vide)

Mobile 390 × 844, DPR 3 :

| Page | Chargement | Après défilement complet | JS | Polices | CSS | Images | Sprite SVG | HTML | LCP |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 262 Ko | **491 Ko** | 55,4 + **125,0** | 89,6 | 12,6 | 173,4 (5 fichiers) | 20,3 | 14,8 | `H1.split` |
| `/osteopathie/lombalgie/` | 261 Ko | 261 Ko | 55,4 | 89,6 | 12,6 | 75,3 (2) | 20,3 | 7,4 | `P.lead` |
| `/contact/` | 190 Ko | 190 Ko | 55,4 | 89,6 | 12,6 | 4,9 (1) | 20,3 | 7,0 | `P.lead` |
| `/mentions-legales/` | 188 Ko | 188 Ko | 55,4 | 89,6 | 12,6 | 4,9 (1) | 20,3 | 5,4 | `P` |

Ordinateur 1440 × 900, DPR 1 :

| Page | Chargement | Après défilement complet | JS | Images | LCP |
|---|---|---|---|---|---|
| `/` | 240 Ko | **448 Ko** | 55,4 + 125,0 | 130,6 (7) | `H1.split` |
| `/osteopathie/lombalgie/` | 226 Ko | 226 Ko | 55,4 | 40,4 (2) | `H1.split` |
| `/contact/` | 190 Ko | 190 Ko | 55,4 | 4,9 | `P.lead` |
| `/mentions-legales/` | 188 Ko | 188 Ko | 55,4 | 4,9 | `P` |

### 3.3 Images

- **Contrôles en place.** `pic()` (`content/layout.mjs:45-51`) produit `<picture>` avec AVIF et WebP, `srcset` de 3 ou 4 largeurs et `sizes` fournis, `width`/`height` intrinsèques, `decoding="async"` et `loading="lazy"`. La compilation échoue si `alt`, `width` ou `height` manque (`build-pages.mjs:34-36`).
- **Choix de source.** Ils sont cohérents :
  - mobile DPR 3 : `adrian-bureau-1200.avif` pour 301 px affichés (903 px utiles) ;
  - ordinateur : `adrian-bureau-800.avif` pour 483 px.
- **`fetchpriority="high"`.** Il est posé sur l'image du hero de `/` (`pages.mjs:121`) et de `/cabinet/` (`pages.mjs:432`). Sur `/`, le LCP mesuré est le **H1** (texte) : l'image prioritaire, 64 Ko sur mobile, concurrence les deux polices préchargées. À garder, l'image reste visible dès l'arrivée, mais à revérifier après la refonte du hero.
- **Taille de l'accueil.** `/` compte 1 697 nœuds DOM et 136 `<use>` (6 calques SVG par symbole en relief × 17, plus le menu). Les pages sans illustrations chargent quand même `symboles.svg` (62,6 Ko brut, 20,3 Ko gzip) pour les 17 mini-symboles du méga-menu.

### 3.4 CSS

- **Poids.** Source de 802 lignes (56,7 Ko de règles), compilée en 55,8 Ko, dont ≈ 2,3 Ko d'`@font-face` Manrope, soit 12,5 Ko gzip.
- **Inventaire.** 265 classes déclarées, 248 classes dans le HTML. 42 règles mortes, soit −3,9 Ko min. (§ 2, P1-3).
- **Points d'arrêt.** 15 media queries différentes :
  - 1024 px (24 fois), 900 px (6), 1200 px (3), max 1023 px (5) ;
  - et aussi 340, 639, 640, 700, 768 et 1100 px.

  Proposition : 3 jetons, `--bp-md: 640px`, `--bp-lg: 1024px`, `--bp-xl: 1200px` (en `@custom-media` si un post-traitement est ajouté, sinon par convention).

---

## 4. Architecture cible

### 4.1 Arborescence actuelle

```
content/ site.mjs · pages.mjs (46,8 Ko : textes et HTML) · categories.mjs · layout.mjs (gabarit, composants, JSON-LD) · illustrations.mjs · articles.mjs
scripts/ build-pages.mjs · images.mjs · symbols.mjs (effet de bord) · qa.mjs · serve.mjs
site/    vite.config.js · src/main.js · src/js/{nav,pointer,scroll,ui,v3,form,spine3d}.js · src/css/main.css · src/fonts/
         public/ (images, .htaccess, api/contact.php, robots/sitemap/manifest générés MAIS versionnés)
         **/*.html générés dans l'arbre source (ignorés par git)
```

Le nom `v3.js` désigne une version, pas une responsabilité : il mélange illustrations, hero, onglets et chargement 3D. `ui.js` mélange 5 composants, dont 2 morts.

### 4.2 Arborescence cible (un module = une responsabilité)

```
content/                      données pures, sans HTML ni effet de bord
  site.mjs  nav.mjs  categories.mjs  articles.mjs  symbols.mjs (ex-symbolFiles)
  pages/ home.mjs  osteopathie.mjs  cabinet.mjs  tarifs.mjs  contact.mjs  legal.mjs …
templates/                    gabarits HTML (ex-layout.mjs éclaté)
  head.mjs (title/meta/canonical/OG)  jsonld.mjs  header.mjs  footer.mjs
  components/ pic.mjs  btn.mjs  faq.mjs  illu.mjs  cta.mjs
scripts/
  build-pages.mjs (HTML → .cache/pages/)  build-meta.mjs (robots, sitemap, manifest → dist/)
  images.mjs  symbols.mjs (garde « exécuté directement »)  qa.mjs  seo-guard.mjs  serve.mjs
site/
  vite.config.js              root = .cache/pages ou plugin d'entrée virtuelle
  src/styles/
    index.css                 @layer reset, tokens, base, layout, components, utilities, overrides;
    tokens.css  reset.css  base.css  layout.css  utilities.css  motion.css (réduit, view transitions)
    components/ btn.css header.css mega.css faq.css illu.css cat-card.css spine.css form.css footer.css …
  src/scripts/
    main.js                   noyau : init core + imports conditionnels
    core/ dom.js (qs, onIdle)  motion.js (reduced, hover-fine)  header.js  menu.js  mega.js  progress.js  reveal.js (IO + classe)
    components/ tabs.js  faq.js  map.js  form.js  marquee.js
    animations/ gsap.js (registerPlugin unique)  hero.js  morph.js  steps-pin.js  parallax.js  counters.js  pointer.js
    three/ spine-loader.js (décision : mobile ? interaction ?)  spine-scene.js (ex-spine3d)
  public/  images/  fonts?/  .htaccess  api/contact.php   (plus aucun fichier généré)
```

### 4.3 Découpage JS par page proposé

`main.js` (noyau) importe statiquement `core/*` sans GSAP ni Lenis. Le reste est chargé par :

```js
const has = (s) => document.querySelector(s);
if (has('[data-form]')) import('./components/form.js').then((m) => m.init());
if (has('[data-spine-section]')) import('./three/spine-loader.js').then((m) => m.init({ reduced }));
if (!reduced && has('[data-hero], [data-pin-steps], [data-morph], [data-count]')) import('./animations/home.js');
if (!reduced && fine && has('[data-magnetic], [data-tilt]')) import('./animations/pointer.js'); // ordinateur seulement
```

Les parallaxes des pages catégorie passent en CSS (`animation-timeline: view()` dans `@supports`, sans effet ailleurs), ce qui retire ScrollTrigger de toutes les pages sauf l’accueil.

| Page (JS gzip transféré) | Actuel | Cible | Gain |
|---|---|---|---|
| `/mentions-legales/`, `/confidentialite/`, `404` | 55,4 | ≈ 4 (noyau) | **≈ −51** |
| `/contact/` | 55,4 | ≈ 5 (noyau et formulaire 1,2) | **≈ −50** |
| `/tarifs/`, `/avis/`, `/conseils/*` (4) | 55,4 | ≈ 4 | **≈ −51** |
| 14 pages catégorie et `/osteopathie/` (sans 3D) | 55,4 | ≈ 4 (parallaxe CSS) ; ≈ 48 si ScrollTrigger est gardé | ≈ −51 ou −7 |
| `/` mobile, après défilement | 180,4 | ≈ 50 (noyau, gsap et ScrollTrigger 43,9, code d'accueil) | **≈ −130** |
| `/` ordinateur, après défilement | 180,4 | ≈ 50, plus 125 si la 3D est demandée | −5 à −130 |
| Effets souris (ordinateur, si gardés avec GSAP) | — | + 26,9 (gsap cœur), chargé à la demande | — |

« Noyau ≈ 4 Ko » est une estimation construite à partir des mesures réelles : `nav.js` et `form.js` font 2,4 Ko gzip, auxquels s'ajoutent apparitions, progression, carte, FAQ et illustrations (≈ 1,5 Ko). Le chiffre est à confirmer par la compilation de la refonte.

### 4.4 CSS : `@layer` et tokens

```css
@layer reset, tokens, base, layout, components, utilities, overrides;
/* overrides : prefers-reduced-motion (remplace les !important de la ligne 607), mode démo */
```

**Tokens à centraliser** (valeurs codées en dur relevées dans `main.css`) :

- **Couleurs.**
  - `#fff` : 30 fois (lignes 83, 84, 95, 102, 109, 175, 192, 200, 296, 297, 300, 312, 329, 373, 416, 422, 426, 446, 470, 487, 526, 527, 544, 566, 569, 590, 731, 736, 756) alors que `--white` existe.
  - `rgba()` : 60 fois, dont 42 valeurs différentes. Blanc translucide ×30 (.06 à .92), or clair `212,181,108` ×9, or `190,155,78` ×7, forêt `36,60,47` ×4, vert `62,94,66` ×3, encre `22,21,21` ×2.
  - Hex hors tokens : `#1d3526`, `#0f1e15`, `#b35941`, `#5c2416`, `#fffdf7`, `#ead9b6`, `#fbfcf8`, `#e6ecdf`, `#d3dccb`, `#c9c4b7`, `#bdb5a2`, `#fbf3f1`, `#2c4a38`.
  - Proposition : `--white-a-12: rgb(255 255 255 / .12)` ou `color-mix(in srgb, var(--white) 12%, transparent)`, et des tokens d'illustration `--illu-ink`, `--illu-ink-edge`, `--illu-accent`, `--illu-accent-shadow`, `--paper-warm`, `--sage-1` à `--sage-3`, `--danger-tint`, `--field-border`.
- **Espacements.** Les `gap` prennent 25 valeurs différentes (8 ×14, 12 ×12, 10 ×11, 96 ×10, 48 ×8, 16 ×8, 20 ×7, 14 ×7, 32 ×6…). Dans `padding` et `margin`, les valeurs en px les plus fréquentes sont 32, 20, 10, 28, 24 et 18. Échelle proposée : `--s-1: 4px`, `--s-2: 8px`, `--s-3: 12px`, `--s-4: 16px`, `--s-5: 24px`, `--s-6: 32px`, `--s-7: 48px`, `--s-8: 64px`, `--s-9: 96px`. Les valeurs 10, 14, 18, 20, 22, 26, 28 et 36 se ramènent à la valeur la plus proche.
- **Rayons.** Tokens `--r-s/m/l/pill` bien employés (32 fois). Restent `50%` ×10, `6px` ×2 (→ `--r-xs`), `999px 999px var(--r-l) var(--r-l)` ×2 et dans `arch-in` (→ `--r-arch`), et 3 formes organiques (→ `--blob-1` à `--blob-3`).
- **Ombres.** `--shadow` et `--shadow-s` (13 usages). 7 ombres ponctuelles (`main.css` : cartes au survol, champs au focus, `.illu-bg`) à nommer `--shadow-lift`, `--ring-focus` et `--shadow-inset-illu`.
- **Mouvement.** Les deux courbes sont centralisées (`--ease`, `--ease-in-out`). Les durées sont libres : .3s ×31, .5s ×19, .4s ×12, .6s ×8, .7s ×6, .25s ×6, .8s ×5, .35s ×5, 1s ×4… Proposition : `--dur-1: .2s`, `--dur-2: .35s`, `--dur-3: .5s`, `--dur-4: .8s`, `--dur-5: 1.2s`. Côté JS, les durées GSAP (0,6 ; 1,1 ; 1,6 s…) gagnent à lire les mêmes valeurs via `getComputedStyle`.
- **Typographie.**
  - 45 raccourcis `font:` (42 différents) et 39 `font-size` (dont `.98rem`, `.95rem`, `.92rem` et `.9rem`, quatre tailles quasi identiques).
  - Graisses : 300, 360, 400, 420, 450, 500, 550, 600, 650, 700.
  - 10 `letter-spacing` différents.
  - Proposition : `--fs--1: .9rem`, `--fs-0: 1rem`, `--fs-1: 1.125rem`, `--fs-2: 1.35rem`, `--fs-3` à `--fs-6` = les 4 `clamp()` existants ; `--fw-light: 300`, `--fw-title: 420`, `--fw-medium: 600`, `--fw-bold: 650` ; `--track-caps: .14em`, `--track-tight: -.02em`.
- **Plans (`z-index`).** 11 valeurs, de −1 à 300. Échelle proposée : `--z-header: 100`, `--z-menu: 120`, `--z-fab: 90`, `--z-overlay: 200`, `--z-cursor: 300`.

### 4.5 Dépendances et scripts

| Paquet | Constat | Action |
|---|---|---|
| `@fontsource-variable/fraunces` | Aucun import : Fraunces vient de `site/src/fonts/*-fr.woff2` | Retirer |
| `@fontsource-variable/manrope` | Importée entière (6 sous-ensembles émis) | Remplacer par un woff2 réduit dans `src/fonts/` |
| `gsap` 3.13, `lenis` 1.3.4, `three` 0.171 | Voir § 2 | Lenis : retirer (−4,5 Ko gzip) ou garder sur l'accueil seulement |
| `playwright` | `require('playwright')` dans `scripts/qa.mjs:15`, absent du `package.json` (installé globalement ici) | Ajouter en `devDependencies` |
| `php` | Requis par `npm test` (`qa.mjs:24`) | Documenter dans le README |

- **Absences.** Il n'y a ni CI, ni linter, ni `npm run seo`.
- **Script `build`.** Il enchaîne `pages` puis `vite build`. Le HTML généré dans `site/**` (ignoré par git) se mêle aux sources : la cible `.cache/pages` les sépare.
- **Mode démo.** `build:demo` reste fonctionnel (vérifié dans une copie : HTML, sprite et polices préfixés `/Adrianosteo/`, `robots.txt` = `Disallow: /`, `noindex`). Seul défaut : le manifeste (P1-8).

---

## 5. Garde-fous SEO (inventaire à préserver)

### 5.1 Les 26 URL indexables (= `sitemap.xml`, toutes en `index, follow, max-image-preview:large`, 1 H1 chacune)

| URL | `<title>` | JSON-LD (en plus de `MedicalBusiness+LocalBusiness`, `Person` et `WebPage`) |
|---|---|---|
| `https://osteovillefontaine.fr/` | Ostéopathe à Villefontaine (38090) \| Adrian Rodriguez | FAQPage |
| `https://osteovillefontaine.fr/osteopathie/` | Ostéopathie à Villefontaine : patients et motifs | BreadcrumbList, FAQPage |
| `https://osteovillefontaine.fr/osteopathie/nourrissons/` | Ostéopathe pour nourrissons à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/osteopathie/enfants-adolescents/` | Ostéopathe enfants et adolescents à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/osteopathie/femme-enceinte/` | Ostéopathe femme enceinte à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/osteopathie/adultes/` | Ostéopathe pour adultes à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/osteopathie/seniors/` | Ostéopathe pour seniors à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/osteopathie/sportifs/` | Ostéopathe du sport à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/osteopathie/mobilite-equilibre/` | Ostéopathe mobilité et équilibre à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/osteopathie/lombalgie/` | Ostéopathe lombalgie et mal de dos à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/osteopathie/cervicalgie/` | Ostéopathe cervicalgie et torticolis à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/osteopathie/dorsalgie/` | Ostéopathe dorsalgie et haut du dos à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/osteopathie/sciatique/` | Ostéopathe sciatique à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/osteopathie/articulations/` | Ostéopathe épaule, genou, entorse à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/osteopathie/stress-tensions/` | Ostéopathe stress et tensions à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/osteopathie/troubles-digestifs/` | Ostéopathe et troubles digestifs à Villefontaine | BreadcrumbList, FAQPage, Service |
| `https://osteovillefontaine.fr/cabinet/` | Le cabinet \| Adrian Rodriguez, ostéopathe à Villefontaine | BreadcrumbList |
| `https://osteovillefontaine.fr/tarifs/` | Tarifs et infos pratiques \| Ostéopathe Villefontaine | BreadcrumbList, FAQPage |
| `https://osteovillefontaine.fr/contact/` | Prendre rendez-vous \| Ostéopathe Villefontaine | BreadcrumbList, FAQPage |
| `https://osteovillefontaine.fr/avis/` | Avis patients \| Adrian Rodriguez, ostéopathe Villefontaine | BreadcrumbList |
| `https://osteovillefontaine.fr/conseils/` | Conseils santé et mouvement \| Ostéopathe Villefontaine | BreadcrumbList |
| `https://osteovillefontaine.fr/conseils/premiere-consultation/` | Première consultation chez l'ostéopathe : déroulé | BreadcrumbList |
| `https://osteovillefontaine.fr/conseils/mal-de-dos/` | Mal de dos : quand consulter, quels signes surveiller | BreadcrumbList |
| `https://osteovillefontaine.fr/conseils/sport-recuperation/` | Sport et récupération : les fondamentaux | BreadcrumbList |
| `https://osteovillefontaine.fr/mentions-legales/` | Mentions légales \| Adrian Rodriguez, ostéopathe | BreadcrumbList |
| `https://osteovillefontaine.fr/confidentialite/` | Confidentialité et données personnelles \| Ostéopathe | BreadcrumbList |

**Hors index.** `/404.html` (`noindex, nofollow`) et `/api/` (`Disallow` dans `robots.txt`).

### 5.2 Invariants à conserver

- **Balises par page** (`content/layout.mjs:173-189`) : `title` ≤ 60 caractères, `description` ≤ 155, les deux uniques ; `canonical` absolu = `https://osteovillefontaine.fr` + chemin, avec barre finale ; `og:*` et `twitter:*` ; `og:image` 1200 × 630 ; `geo.*` ; `lang="fr"`. Les contrôles de `build-pages.mjs:28-36` sont à garder.
- **JSON-LD** (`layout.mjs:93-117`) :
  - `@graph` avec `@id` stables : `/#cabinet`, `/#adrian`, `/#site`, `<url>#page` ;
  - type `MedicalBusiness` (jamais `Physician`) ;
  - `BreadcrumbList` sur toute page autre que l'accueil ;
  - `FAQPage` identique à la FAQ visible ;
  - `Service` sur les 14 pages catégorie.
- **`robots.txt` en production** : `User-agent: *`, `Allow: /`, `Disallow: /api/`, `Sitemap: https://osteovillefontaine.fr/sitemap.xml`.
- **Redirections 301** (`site/public/.htaccess:17-29`), toutes à conserver :
  - `/index.html` → `/`
  - `/nourrissons.html` et `/nourissons.html` → `/osteopathie/nourrissons/`
  - `/enfants.html` → `/osteopathie/enfants-adolescents/`
  - `/adultes.html` → `/osteopathie/adultes/`
  - `/femmes-enceintes.html` → `/osteopathie/femme-enceinte/`
  - `/seniors.html` → `/osteopathie/seniors/`
  - `/sportifs.html` → `/osteopathie/sportifs/`
  - `/mentionslegales.html` → `/mentions-legales/`
  - `/osteopathie/mal-de-dos/` → `/osteopathie/lombalgie/`
  - `/osteopathie/nuque-cervicales/` → `/osteopathie/cervicalgie/`
  - `/osteopathie/bebe-enfant/` → `/osteopathie/nourrissons/`
- **Page d'erreur.** `ErrorDocument 404 /404.html` : une URL inconnue doit répondre 404 (`appType: 'mpa'` dans Vite).
- **À activer à la mise en ligne.** Le bloc HTTPS et sans `www` (`.htaccess:12-14`) est commenté : tant qu'il l'est, `http://`, `https://www.` et `https://` coexistent (doublons canoniques).

### 5.3 Script de vérification proposé (non ajouté au dépôt)

Testé contre `baseline-dist` (`http://127.0.0.1:4180`) : `✓ SEO : 26 URL, sitemap, robots, 404`.

L'option `--redirects` ne peut se tester que derrière Apache ou LiteSpeed (préproduction ou production), car `php -S` et `serve.mjs` ignorent `.htaccess`.

Usage :
- avant la refonte : `node scripts/seo-guard.mjs http://127.0.0.1:4173 --write docs/audit/seo-ref.json` ;
- après : `--snapshot docs/audit/seo-ref.json`.

```js
// scripts/seo-guard.mjs : node scripts/seo-guard.mjs <base> [--write ref.json | --snapshot ref.json] [--redirects]
import { readFileSync, writeFileSync } from 'node:fs';
const [base = 'http://127.0.0.1:4173', mode, file] = process.argv.slice(2).filter((a) => a !== '--redirects');
const checkRedirects = process.argv.includes('--redirects');
const PROD = 'https://osteovillefontaine.fr';
const URLS = ['/', '/osteopathie/', '/osteopathie/nourrissons/', '/osteopathie/enfants-adolescents/', '/osteopathie/femme-enceinte/',
  '/osteopathie/adultes/', '/osteopathie/seniors/', '/osteopathie/sportifs/', '/osteopathie/mobilite-equilibre/', '/osteopathie/lombalgie/',
  '/osteopathie/cervicalgie/', '/osteopathie/dorsalgie/', '/osteopathie/sciatique/', '/osteopathie/articulations/', '/osteopathie/stress-tensions/',
  '/osteopathie/troubles-digestifs/', '/cabinet/', '/tarifs/', '/contact/', '/avis/', '/conseils/', '/conseils/premiere-consultation/',
  '/conseils/mal-de-dos/', '/conseils/sport-recuperation/', '/mentions-legales/', '/confidentialite/'];
const REDIRECTS = { '/index.html': '/', '/nourrissons.html': '/osteopathie/nourrissons/', '/nourissons.html': '/osteopathie/nourrissons/',
  '/enfants.html': '/osteopathie/enfants-adolescents/', '/adultes.html': '/osteopathie/adultes/', '/femmes-enceintes.html': '/osteopathie/femme-enceinte/',
  '/seniors.html': '/osteopathie/seniors/', '/sportifs.html': '/osteopathie/sportifs/', '/mentionslegales.html': '/mentions-legales/',
  '/osteopathie/mal-de-dos/': '/osteopathie/lombalgie/', '/osteopathie/nuque-cervicales/': '/osteopathie/cervicalgie/', '/osteopathie/bebe-enfant/': '/osteopathie/nourrissons/' };
const errs = []; const snap = {};
const pick = (h, re) => (h.match(re) || [])[1]?.trim() ?? null;
for (const u of URLS) {
  const r = await fetch(base + u, { redirect: 'manual' }); const h = await r.text();
  if (r.status !== 200) { errs.push(`${u} : HTTP ${r.status}`); continue; }
  const ld = pick(h, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let types = []; try { types = JSON.parse(ld)['@graph'].map((x) => [].concat(x['@type']).join('+')); } catch { errs.push(`${u} : JSON-LD illisible`); }
  const s = { title: pick(h, /<title>([^<]*)<\/title>/), description: pick(h, /<meta name="description" content="([^"]*)"/),
    canonical: pick(h, /<link rel="canonical" href="([^"]*)"/), robots: pick(h, /<meta name="robots" content="([^"]*)"/),
    h1: (h.match(/<h1\b/g) || []).length, jsonld: types, ogUrl: pick(h, /<meta property="og:url" content="([^"]*)"/) };
  if (s.canonical !== PROD + u) errs.push(`${u} : canonical ${s.canonical}`);
  if (s.ogUrl !== PROD + u) errs.push(`${u} : og:url ${s.ogUrl}`);
  if (!/^index, follow/.test(s.robots || '')) errs.push(`${u} : robots « ${s.robots} »`);
  if (s.h1 !== 1) errs.push(`${u} : ${s.h1} H1`);
  if (!s.title || [...s.title].length > 60) errs.push(`${u} : title absent ou > 60`);
  if (!s.description || [...s.description].length > 155) errs.push(`${u} : description absente ou > 155`);
  for (const t of ['MedicalBusiness+LocalBusiness', 'Person', 'WebPage']) if (!types.includes(t)) errs.push(`${u} : JSON-LD sans ${t}`);
  if (u !== '/' && !types.includes('BreadcrumbList')) errs.push(`${u} : JSON-LD sans BreadcrumbList`);
  snap[u] = s;
}
const sm = await (await fetch(base + '/sitemap.xml')).text();
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(PROD, '')).sort();
if (JSON.stringify(locs) !== JSON.stringify([...URLS].sort())) errs.push(`sitemap ≠ liste attendue : ${locs.length} URL`);
const robots = await (await fetch(base + '/robots.txt')).text();
if (!/Allow: \/\n/.test(robots) || !robots.includes(`Sitemap: ${PROD}/sitemap.xml`) || /Disallow: \/\s*$/m.test(robots)) errs.push('robots.txt inattendu');
const nf = await fetch(base + '/page-inexistante-' + Date.now() + '/');
if (nf.status !== 404) errs.push(`URL inconnue : HTTP ${nf.status} (attendu 404)`);
if (checkRedirects) for (const [from, to] of Object.entries(REDIRECTS)) {
  const r = await fetch(base + from, { redirect: 'manual' }); const loc = (r.headers.get('location') || '').replace(/^https?:\/\/[^/]+/, '');
  if (r.status !== 301 || loc !== to) errs.push(`redirection ${from} : ${r.status} → ${loc} (attendu 301 → ${to})`);
}
if (mode === '--write') writeFileSync(file, JSON.stringify(snap, null, 2));
if (mode === '--snapshot') { const ref = JSON.parse(readFileSync(file, 'utf8'));
  for (const u of URLS) for (const k of Object.keys(ref[u] || {})) if (JSON.stringify(ref[u][k]) !== JSON.stringify(snap[u]?.[k])) errs.push(`${u} : ${k} modifié`); }
console.log(errs.length ? '✗ SEO\n  ' + errs.join('\n  ') : `✓ SEO : ${URLS.length} URL, sitemap, robots, 404${checkRedirects ? ', redirections' : ''}`);
process.exit(errs.length ? 1 : 0);
```

---

## 6. Plan de remédiation (à mener avec la refonte)

1. **Lot 1, sans risque visuel.**
   - P0-3 : fichiers générés hors git.
   - P1-1 : `.htaccess`.
   - P1-2 et P1-3 : code mort JS et CSS.
   - `!important` de la ligne 744.
   - Dépendances.
   - Ajout de `seo-guard` dans `npm test`.
2. **Lot 2, performance.**
   - P0-1 : 3D hors mobile et à la demande.
   - P1-4 et P1-5 : pauses hors écran, curseur en `scale`, `will-change`.
   - Polices (P1-7).
3. **Lot 3, architecture.**
   - Nouvelle arborescence (§ 4.2).
   - `@layer` et tokens (§ 4.4).
   - Découpage JS par page (§ 4.3).
   - Garde-fou SEO avant et après chaque lot ; `npm run build` et `npm run build:demo` à chaque lot.

---

## 7. Skills appliqués

- **`engineering:tech-debt`.** Classement code, architecture, tests et dépendances ; score (Impact + Risque) × (6 − Effort) dans la synthèse ; plan par lots compatible avec la refonte.
- **`engineering:code-review`.** Relecture de `site/src/**/*.js`, `content/layout.mjs`, `scripts/*.mjs`, `.htaccess` et `api/contact.php` sous l'angle sécurité, performance, exactitude et maintenabilité. Constats : `FilesMatch` inopérant, effet de bord à l'import, variable morte, doublon d'onglets, manifeste démo.
- **`engineering:architecture`.** Évaluation de la structure actuelle et proposition d'une cible « un module = une responsabilité ». Arbitrages explicites :
  - parallaxe CSS ou ScrollTrigger ;
  - Lenis retiré ou réservé à l'accueil ;
  - Three.js à la demande ou supprimé.
- **`design:design-system`.** Audit des tokens (couleurs, espacements, rayons, ombres, mouvement, typographie, plans) avec comptage des valeurs codées en dur, collision de nommage `--ink`, proposition de couches `@layer`.
- **`animation-performance`** (`.claude/skills/animation-performance/SKILL.md`). Chaque constat nomme sa cause :
  - propriétés de mise en page animées (curseur `width/height/margin`, FAQ `height`, aperçu `left/top`) ;
  - peinture permanente (`border-radius`, attribut `d`) ;
  - thread principal (timeline GSAP infinie, rendu WebGL continu) ;
  - variables CSS héritées ;
  - `will-change` à demeure.

  Les éléments vérifiés depuis le code sont signalés comme tels. Le nombre d'images perdues reste **à mesurer sur un mobile réel** : Playwright sur poste rapide ne le prouve pas.

**Outils de mesure (scratchpad, hors dépôt)** :
- `audit-code/sizes.mjs` : brut, gzip et brotli ;
- `attrib.mjs` : attribution par sourcemap ;
- `cssdead.mjs` et `cssgain.mjs` : CSS morte et gain ;
- `spec.mjs` : spécificité et doublons ;
- `weigh.mjs` : transfert par page ;
- `dom.mjs` : `will-change` et animations actives ;
- `seo-guard.mjs`.
