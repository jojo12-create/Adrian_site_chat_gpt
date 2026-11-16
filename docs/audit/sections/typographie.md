# Audit typographie et hiérarchie

Site d'Adrian Rodriguez, ostéopathe à Villefontaine. Branche `claude/audit-refonte-qualite`, commit `d4de6f5`.
Ce qu'on attend du site : un cabinet de santé haut de gamme, chaleureux, calme et rassurant. Charte imposée : vert `#3e5e42`, or `#be9b4e`, olive `#5f5e34` et forêt `#243c2f`, d'après le logo.

**Méthode.** J'ai compilé une copie du dépôt dans le scratchpad, sans toucher au dépôt ni lancer de build dedans. Le rendu a été mesuré avec Playwright (Chromium, `deviceScaleFactor: 1`) sur la version servie (`:4180`) et sur la copie (`:4191`). Trois variantes de polices tournaient sur `:4192` à `:4194`. Les 26 pages ont été analysées pour la typographie française. J'ai aussi lancé le détecteur `impeccable detect --scope type` (et `layout`) sur la copie.
Tous les chiffres ci-dessous viennent de ces mesures. Les poids sont en **Ko de 1 024 octets**, tels qu'ils sont servis (woff2).

---

## 1. Constats

### P0 : à corriger avant la mise en ligne

**P0-1. Aucune espace insécable en typographie française : la ponctuation se retrouve seule en début de ligne.**
- **Où.** Tous les textes de `content/pages.mjs`, `content/categories.mjs`, `content/site.mjs`, `content/articles.mjs`, `content/illustrations.mjs` et `content/layout.mjs`. Le code source ne contient aucun `U+00A0`, `U+202F` ni `&nbsp;`.
- **Mesuré dans le HTML rendu (26 pages, texte visible).**
  - 255 espaces normales avant `: ; ? !`.
  - 64 guillemets `« »` suivis ou précédés d'une espace normale.
  - 20 nombres séparés de leur unité par une espace normale : `12 mois`, `24 h/24`, `6 mois`, `1000 %`, `7 vertèbres`…
- **Lignes réellement cassées avec la police actuelle : 13.** Ce sont des lignes qui commencent par `: ; ? !` ou `»`, dans `main`, à 390, 768, 1 024 et 1 440 px. Exemples :
  - « …vous mettre à l'aise. / » » sur l'accueil à 768, 1 024 et 1 440 ;
  - « …dos s'est « bloqué ». / » » sur `/osteopathie/lombalgie/` ;
  - « …une séance / ? » sur l'accueil à 390 ;
  - « …tensions physiques / ; elle… » sur `/osteopathie/stress-tensions/`.
- **Changer de police fait apparaître d'autres cassures.** Avec les variantes A et C, le chapô de l'accueil se coupe en « …premiers mois de bébé / : j'écoute » (voir [A-accueil-hero-1440](../polices/A-accueil-hero-1440.jpg) et [C-accueil-hero-1440](../polices/C-accueil-hero-1440.jpg)). Sur `/osteopathie/lombalgie/`, toutes les variantes donnent « …souvent conseillé / : vous repartez » ([A-lombalgie-texte-1440](../polices/A-lombalgie-texte-1440.jpg)).
- **Impact.** Sur un site médical haut de gamme, une ponctuation orpheline est le défaut français le plus visible. Elle réapparaît aussi à chaque modification de texte ou de largeur.
- **Correctif.** Une transformation à la génération, dans `scripts/build-pages.mjs:22` (`let html = frTypo(render(p));`), plutôt que 300 corrections à la main :
  ```js
  // content/layout.mjs : typographie française appliquée au texte seul (jamais aux balises, scripts, JSON-LD)
  const NBSP = ' ';
  export const frTypo = (html) => html.replace(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)|([^<]+)/g, (m, tag, t) => tag ?? t
    .replace(/(\p{L})'(\p{L})/gu, '$1’$2')                  // apostrophe typographique
    .replace(/ ([:;?!])/g, NBSP + '$1')                      // espace insécable avant : ; ? !
    .replace(/« /g, '«' + NBSP).replace(/ »/g, NBSP + '»')   // guillemets français
    .replace(/(\d) (?=€|%|h\b|min\b|km\b|ans\b|mois\b|jours?\b|semaines?\b|séances?\b|vertèbres\b)/g, '$1' + NBSP));
  ```
  - Utiliser `U+00A0` partout tant que les polices ne sont pas resoumises au sous-ensemble. **Le sous-ensemble Fraunces actuel et Manrope n'ont pas de glyphe `U+202F`** (vérifié avec fontTools). Les sous-ensembles proposés plus bas l'incluent : on pourra alors passer à `U+202F` (espace fine insécable) devant `; ? !` et à l'intérieur de `« »`.
  - Rendre `content/layout.mjs:56` (`splitWords`) compatible : remplacer `[^\s<]+` par `[^ \t\n<]+`. En JavaScript, `\s` reconnaît aussi `U+00A0`, ce qui séparerait « Lombalgie » et « : » dans deux blocs.
  - Rendre `content/pages.mjs:322` et `:389` compatibles : `/ : (.*)$/` devient `/[  ]: (.*)$/`.
  - Numéro de téléphone `content/site.mjs:24` : `display: '06 09 22 49 38'` pour éviter « 06 09 / 22 49 38 ».

### P1 : important

**P1-1. L'ensemble crème, serif d'affichage et terracotta, plus le mot en italique coloré : c'est le cliché n° 1 des sites générés.**
- Je le dis franchement : oui, c'est un problème. Le site cumule exactement le cliché n° 1 décrit par `frontend-design`.
  - Un fond crème `--paper: #faf8f3` (`main.css:32`).
  - Fraunces, que le détecteur `impeccable` classe parmi les polices surutilisées (`overused-font`, `main.css:12` et `:16`).
  - Un accent terracotta `#b35941` qui **ne fait pas partie de la charte** (`main.css:154` `.sym-accent`, `main.css:619` `.illu { --accent }`, ombre `#5c2416` en `main.css:634`).
  - Le procédé « un mot en italique vert dans chaque titre » : 31 titres concernés (29 `<em>` dans `content/pages.mjs`, 2 dans `content/layout.mjs`), avec la règle `main.css:74`. Le détecteur relève `italic-serif-display` 15 fois sur deux pages seulement (accueil et lombalgie).
  - Plusieurs habillages typiques que `frontend-design` liste dans le cliché n° 5 :
    - 6 étiquettes en capitales espacées (`main.css:159, 276, 516, 575, 666, 791`) ;
    - des chaînes séparées par un point médian (« Ostéopathe · Villefontaine », `layout.mjs:198` ; « Villefontaine · Nord-Isère », `pages.mjs:109`) ;
    - des numéros décoratifs I/II/III sur des contenus qui ne sont pas des séquences (`pages.mjs:131-133`, `:333`).
- **Impact.** Le site ressemble à mille autres. Le « calme » voulu est contredit par 31 effets d'accent : quand tout est mis en valeur, plus rien ne l'est.
- **Correctif qui respecte la charte.**
  1. **Accent :** remplacer `#b35941` par l'or de la charte (`.sym-accent { fill: var(--gold); }`, `.illu { --accent: var(--gold); }`, ombre `#5c2416` vers `#6b5420`). Le terracotta n'a jamais été dans la charte : c'est un écart, pas une identité.
  2. **Italique d'accent :** le retirer de tous les titres. Garder **au plus un** moment en italique (la signature du pied de page `.footer-claim em`), ou aucun. On économise du même coup la police italique : 36,1 Ko préchargés sur **toutes** les pages, voir P1-4.
  3. **Fond :** passer du crème chaud à un blanc teinté du vert de la charte, `--paper: #f5f6f2`. Contrastes mesurés : texte 13,1:1, `--muted` 6,7:1, vert 6,7:1, olive 6,2:1, AA conservé.
  4. **Étiquettes :** en minuscules, sans espacement, 14 px, graisse 600, olive : `font: 600 .875rem/1.3 var(--f-text); letter-spacing: 0; text-transform: none;`. Supprimer l'étiquette « Pour quoi ? » au-dessus du H1 des pages catégorie (`pages.mjs:321`, détecteur `hero-eyebrow-chip`). Le fil d'Ariane donne déjà cette information.
  5. **Police de titre :** voir la section « Associations proposées ». La variante B (sans-serif évasée) sort entièrement du cliché. La variante A le désamorce sans renoncer à l'empattement.

**P1-2. Les titres Fraunces sont dessinés pour du texte en 9 pt, mais affichés entre 94 et 115 px.**
- **Où.** `site/src/fonts/fraunces-latin-wght-*-fr.woff2` provient du fichier « wght » de Fontsource. Ce fichier ne garde que l'axe `wght` et fige `opsz` à sa valeur par défaut, **9**. Vérifié : les chasses de `a e n o O V` à graisse 420 valent `1087 1044 1237 1169 1589 1405`, contre `1093 1049 1244 1174 1592 1411` pour la version complète à `opsz 9` et `869 837 1000 970 1457 1182` à `opsz 144`.
- Conséquences :
  - `font-optical-sizing: auto` (`main.css:70`) est sans effet.
  - Le sous-ensemble n'a pas de fonctionnalité `tnum`, donc `font-variant-numeric: tabular-nums` sur `.num-list strong` (`main.css:365`) ne fait rien.
- **Impact.** On affiche à 94–115 px la coupe prévue pour le texte courant : lettres larges, peu de contraste, aspect lourd. C'est l'inverse du « calme haut de gamme ». La coupe d'affichage serait environ 20 % plus étroite et plus fine.
- **Correctif si l'on garde Fraunces.** Refaire le sous-ensemble à partir de `fraunces-latin-full-normal.woff2` avec `opsz` figé à 72, `SOFT` 50, `WONK` 0 et `wght` de 300 à 460, en ajoutant `tnum` et `U+202F`. Sinon, adopter l'une des associations ci-dessous.

**P1-3. Les titres ne suivent pas de hiérarchie cohérente : trois tailles de H1, cinq tailles de H3, et des H3 plus petits que le texte.**
- **Rendu mesuré à 1 440 px (texte courant à 18 px).**
  - H1 : 94,4 px (`main.css:71`), 114,56 px avec `.display` (`main.css:433`) et 72 px (`.prose h1`, `main.css:561`).
  - H2 : 66,88 px, et 25,6 px dans les pages légales (`main.css:562`).
  - H3 : 40,96 px (étapes, `main.css:351`), 27,68 px (`main.css:73`), 20,8 px (`.detail h3`, `main.css:793`), **17,6 px** (`.medical h3`, `main.css:795`) et **12,8 px en capitales** (« Pour qui ? », `.cats-sub`, `main.css:666` et `pages.mjs:38` / `:40`).
- **Rapports entre niveaux sur la page lombalgie.** H1/H2 = 1,41 ; **H2/H3 = 3,2** (de 66,88 à 20,8 px) ; H3/texte = **1,16**. Le H3 « Quand privilégier un avis médical », le message de sécurité le plus important de la page, est **plus petit que le texte courant** : 17,6 contre 18 px.
- **Impact.** Le lecteur ne distingue plus un intertitre d'un paragraphe. L'avertissement médical est noyé. Un même rôle change d'apparence d'une page à l'autre.
- **Correctif.** Adopter l'échelle de la section 2 : un seul H1 de taille `--fs-display`, un H2 `--fs-h2` et un H3 `--fs-h3` partout.
  - `.medical h3` et `.detail h3` passent à `--fs-lead` en graisse 600 de la police de texte, ou à `--fs-h3`.
  - `.cats-sub` reste un `h3` mais en `--fs-lead`, sans capitales.
  - `.display` est plafonné à 5,5 rem, en dessous du plafond de 6 rem de `craft-floor`. Il atteint aujourd'hui 7,5 rem.

**P1-4. Polices chargées : 89,6 Ko et 3 fichiers sur chaque page, dont 36,1 Ko d'italique préchargés pour quelques mots.**
- **Mesuré sur les 9 pages testées, à 1 440 et 390 px.**
  - `fraunces-…-italic-fr` : 36 956 o.
  - `fraunces-…-normal-fr` : 29 948 o.
  - `manrope-latin-wght-normal` : 24 836 o.
  - Total : 91 740 o, soit 89,6 Ko.
- **Préchargement** (`site/vite.config.js:20`) : Fraunces normale **et italique** sont préchargées. **Manrope, la police du texte et des boutons, ne l'est pas.**
- `@import '@fontsource-variable/manrope/index.css'` (`main.css:9`) déclare 6 `@font-face` (cyrillique, grec, vietnamien…). Seul le latin est téléchargé grâce à `unicode-range`, mais l'axe complet 200–800 est livré alors que le site n'utilise que 400 à 700.
- `font-display: swap` est présent partout. Correct.
- **Impact.** Le préchargement de l'italique fait concurrence au chargement de l'image du hero (LCP) pour un ornement. Le texte arrive après le titre.
- **Correctifs.**
  1. Retirer l'italique (voir P1-1), ou au minimum ne plus la précharger : la regex de `vite.config.js:20` devient `/(fraunces-latin-wght-normal-fr|manrope-texte-normal-fr)-.*\.woff2$/`.
  2. Remplacer l'`@import` par un sous-ensemble Manrope local, axe `wght` 400–700, français plus `U+202F` : **20,8 Ko** mesurés au lieu de 24,3.
  3. Précharger la police de texte.

**P1-5. CLS : déplacement de mise en page de 0,20 lors de l'échange de police sur les pages catégorie, à cause des grilles centrées verticalement.**
- **Mesure.** Polices retardées de 800 ms, 3 répétitions identiques. Sur `/osteopathie/lombalgie/` à 1 440 px, le CLS vaut **0,2007**. Il vient d'un seul décalage à environ 840 ms, au moment de l'échange de police, sur `cat-hero-visual` et les nœuds de texte du titre.
  - Sans délai : 0,0076.
  - Accueil : 0,011 (1 440 px) et 0,005 (390 px).
  - Lombalgie à 390 px : 0,0067.
- **Cause.** `.cat-hero-grid { align-items: center }` (`main.css:789`) et `.hero { justify-content: center }` / `.hero-grid { align-items: center }` (`main.css:257`, `:260`). Quand la hauteur du titre change à l'échange, tout le bloc se recentre et le visuel bouge.
- **Réserve.** Georgia et Arial sont absentes du conteneur de test, donc la police de secours réelle était DejaVu. Chez un patient sous Windows ou macOS, l'écart sera plus faible. La fragilité, elle, est structurelle.
- **Correctifs.**
  - `.cat-hero-grid, .motif-hero-grid { align-items: start; }` à partir de 1 024 px.
  - Corriger la police de secours Fraunces (`main.css:16`) : avec `size-adjust: 96%` (calé sur Georgia), il faut `ascent-override: 101.9%; descent-override: 26.6%`. On trouve aujourd'hui 95 % et 24 %, alors que les métriques de Fraunces sont ascendante 0,978 et descendante 0,255.
  - La police de secours Manrope (`main.css:17`, 103 / 103 / 29 %) est **juste** : recalculée à 103,2 / 103,3 / 29,1 %.

**P1-6. Trop de graisses et trop de tailles : aucun système.**
- **Graisses** utilisées dans `main.css` : 300, 360, 400, 420, 450, 500, 550, 600, 650, 700, soit **10 valeurs**.
- **Tailles :** 61 déclarations `font-size` / `font:`, **31 tailles de base distinctes** et 16 `clamp()` différents. Il y a 6 tailles sous 13 px :
  - `.cursor-label` à 0,7 rem (`main.css:595`) ;
  - `.mega-title` à 0,74 rem (`main.css:159`) ;
  - `.demo-badge` à 0,75 rem (`main.css:590`) ;
  - `mark.tbc` à 0,78 em (`main.css:85`) ;
  - `.f-title` à 0,78 rem (`main.css:575`) ;
  - `.scroll-hint` à 0,78 rem (`main.css:276`).
- **Correctif.** Pour le texte, 400 et 600 (550 accepté pour la navigation). Pour les titres, une seule graisse (420 Fraunces, ou celle de l'association retenue). Plus rien sous 13 px. L'échelle de la section 2 remplace les 31 tailles.

### P2 : finitions

- **P2-1. Apostrophes droites : 352 dans le rendu, sur toutes les pages.** Le code source les mélange : 230 `'` pour 15 `’` (`ctaFinal` utilise `d’aller`, `pages.mjs:131` utilise `À l’écoute`). Le `frTypo()` de P0-1 corrige les deux.
- **P2-2. Pas de césure.** `hyphens` est calculé à `manual` alors que `lang="fr"` est bien présent (`layout.mjs:169`). Dans les cartes mobiles à deux colonnes (environ 150 px, `.cat-short` 0,86 rem, `main.css:674`), les mots longs (« ostéopathique », « accompagnement ») rendent les lignes très inégales. Ajouter :
  `@media (max-width: 639px) { .cat-short, .faq-a, .prose p, .lead { hyphens: auto; hyphenate-limit-chars: 10 4 4; } }`
  et `h1, h2, h3 { hyphens: manual; overflow-wrap: break-word; }`.
- **P2-3. `text-wrap: pretty` absent sur les paragraphes.** Il est déjà sur les titres (`balance`, `main.css:70`). Ajouter `p, li, .lead { text-wrap: pretty; }`.
- **P2-4. Mesure du texte : correcte, sauf les colonnes étroites.** Comptage réel par ligne avec `Range.getClientRects` :
  - `/osteopathie/lombalgie/` à 1 440 px : **66 caractères en moyenne, 69 au plus**, sur 556 px.
  - Accueil : chapô 50/53, paragraphes de colonne 46/48 sur 362 px.
  - Mobile à 390 px : 40 à 44 caractères (normal).
  - La règle `p { max-width: 66ch }` (`main.css:75`) dépend de la police. Avec Figtree ou Commissioner, la même colonne passe à 71/72 caractères, toujours sous 75. Passer à `max-width: var(--measure)` avec `--measure: 65ch` et garder `.lead { max-width: 52ch }`.
- **P2-5. Interlignage du texte : 1,7 (`main.css:65`), généreux pour une police à grand œil comme Manrope (x-height 0,54).** Passer à 1,6 pour le texte et 1,5 pour le chapô. Le détecteur relève aussi un `tight-leading` à 1,2 sur l'accueil : les titres de cartes multilignes, `.art-title` et `.season strong` à 1,2. Les passer à 1,3.
- **P2-6. Approche des titres uniforme.** `letter-spacing: -0.025em` s'applique de 28 à 115 px (`main.css:70`), soit -2,36 px sur le H1. `apple-design` et `typeset` demandent une approche propre à chaque taille. Valeurs : voir l'échelle en section 2.
- **P2-7. Espacement après un bloc.** `Séance : [À CONFIRMER]…` est collé au cadre `.medical` sur la page lombalgie : pas d'espace sous `.medical`, `main.css:794` (voir [actuel-lombalgie-texte-1440](../polices/actuel-lombalgie-texte-1440.jpg)). Ajouter `margin-bottom: var(--sp-5)`.

### Ce qui est déjà bien

- Un seul H1 par page, sur les 9 pages mesurées aux deux largeurs. L'ordre des titres ne saute aucun niveau (H1 → H2 → H3) sur toutes les pages. Le générateur vérifie le nombre de H1 (`build-pages.mjs:32`).
- `lang="fr"`, `font-display: swap`, polices de secours aux métriques ajustées, sous-ensemble français fait à la main, `text-wrap: balance` sur les titres.
- Le titre découpé en mots reste du texte réel dans le HTML. Il n'est animé que sur ordinateur, ce qui préserve le LCP mobile.

---

## 2. Échelle typographique et rythme vertical

### Relevé actuel
- 61 déclarations de taille, 31 tailles de base distinctes, 16 `clamp()`.
- Niveaux réellement rendus à 1 440 px : 11,2 / 11,8 / 12 / 12,5 / 12,8 / 13,6 / 13,8 / 14,4 / 14,7 / 15,2 / 15,7 / 16 / 16,8 / 17 / 17,3 / 17,6 / 18 / 18,4 / 19,2 / 20,8 / 21,6 / 22,4 / 23,2 / 25,6 / 27,7 / 28,8 / 32 / 41 / 48 / 66,9 / 72 / 94,4 / 114,6 px. Cela fait **plus de 30 niveaux pour 7 rôles réels.**

### Proposition : 7 niveaux fluides de 390 à 1 440 px
Formule : `clamp(min, a + b·vw, max)` avec `b = (max − min) / 1 050 × 100` et `a = min − b × 3,9`, en rem pour respecter le zoom.

```css
:root {
  --fs-xs:      clamp(0.8125rem, 0.789rem + 0.095vw, 0.875rem);  /* 13 → 14  étiquettes, méta, mentions */
  --fs-sm:      clamp(0.9375rem, 0.914rem + 0.095vw, 1rem);      /* 15 → 16  textes de carte, notes */
  --fs-body:    clamp(1.0625rem, 1.039rem + 0.095vw, 1.125rem);  /* 17 → 18  texte courant */
  --fs-lead:    clamp(1.1875rem, 1.095rem + 0.381vw, 1.4375rem); /* 19 → 23  chapô, titres de carte, FAQ, citations, H4 */
  --fs-h3:      clamp(1.5rem, 1.314rem + 0.762vw, 2rem);         /* 24 → 32  H3 */
  --fs-h2:      clamp(2rem, 1.443rem + 2.286vw, 3.5rem);         /* 32 → 56  H2 */
  --fs-display: clamp(2.625rem, 1.557rem + 4.381vw, 5.5rem);     /* 42 → 88  H1 (toutes les pages) */
  --measure: 65ch;
}
```

| Niveau | 390 px | 1 440 px | Rapport au niveau inférieur à 1 440 | Interlignage | Approche (letter-spacing) | Graisse |
|---|---|---|---|---|---|---|
| display (H1) | 42 | 88 | 1,57 | 1,02 | -0,025em (Fraunces) / -0,02em | titre unique |
| h2 | 32 | 56 | 1,75 | 1,08 | -0,02em | titre unique |
| h3 | 24 | 32 | 1,39 | 1,15 | -0,01em | titre unique |
| lead | 19 | 23 | 1,28 | 1,5 | 0 | 400 |
| body | 17 | 18 | 1,125 | 1,6 | 0 | 400 / 600 |
| sm | 15 | 16 | 1,14 | 1,55 | 0 | 400 |
| xs | 13 | 14 | | 1,4 | +0,01em, sans capitales | 600 |

Le H2 passe de 66,9 à 56 px à 1 440 : la page devient plus calme et il garde un rapport de 1,57 avec le H1. Le H1 est plafonné à 88 px, sous les 6 rem de `craft-floor`. Chaque niveau fait au moins 1,25 fois le suivant au-dessus du texte courant.
**Rattachements.**
- `.lead`, `.cat-label`, `.faq-item summary`, `.review p`, `.quote p`, `.art-title`, `.trust-list strong`, `.medical h3` et `.detail h3` passent à `--fs-lead`.
- `.where-kicker`, `.spine-panel-title`, `.mi-title`, `.way-title` et `.big-info` passent à `--fs-h3`.
- `.footer-claim` et `.mega-kicker` passent à `--fs-h2`.
- Les chiffres `.num-list strong` et `.price` restent un rôle « nombre » à part, avec `clamp(2.625rem, 1.557rem + 4.381vw, 5.5rem)` : la même taille que le display, sans jamais le dépasser.

### Rythme vertical : relevé et échelle unique
- **Relevé.** 311 valeurs d'espacement (`margin`, `padding`, `gap`). **26 valeurs px positives distinctes** :
  - 2, 3, 4, 6, 8×20, 10×24, 11, 12×20, 14×14, 16×13, 18×11, 20×21, 22×8, 24×17, 26×4, 28×13, 32×22, 34, 36×5, 40×11, 48×13, 56×9, 64, 72×3, 80, 96×11 ;
  - plus 7 `clamp()` ponctuels et `--section: clamp(80px, 11vw, 160px)` (`main.css:47`).
- Les paires 10/12, 14/16, 18/20, 22/24/26, 28/32/34/36 font double emploi.
- **Proposition (base 4, `impeccable/layout`, `design-taste-frontend/system`).**
  ```css
  :root {
    --sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px; --sp-5: 24px; --sp-6: 32px;
    --sp-7: clamp(2.5rem, 2.036rem + 1.905vw, 3.75rem);  /* 40 → 60 : entre blocs d'une section */
    --sp-8: clamp(3rem, 2.443rem + 2.286vw, 4.5rem);     /* 48 → 72 : titre de section → contenu, colonnes */
    --sp-9: clamp(4rem, 3.257rem + 3.048vw, 6rem);       /* 64 → 96 : gouttières de grilles larges */
    --section: clamp(4.5rem, 2.829rem + 6.857vw, 9rem);  /* 72 → 144 : marge haute et basse des sections */
  }
  ```
- **Correspondance.**
  - 2–6 deviennent `--sp-1` ou `--sp-2` ; 10 devient `--sp-2` ou `--sp-3` ; 14 et 18 deviennent `--sp-4` ; 20 à 26 deviennent `--sp-5` ; 28 à 36 deviennent `--sp-6`.
  - 40 et 56 deviennent `--sp-7` ; 48 et 72 deviennent `--sp-8` ; 80 et 96 deviennent `--sp-9`.
- **Règles.**
  - Titre vers contenu : `--sp-5` pour un H3 et `--sp-6` pour un H2, au lieu de `.45em`, qui varie de 12 à 30 px.
  - Toujours plus d'espace au-dessus d'un intertitre qu'en dessous : `.detail h3 { margin: var(--sp-7) 0 var(--sp-3); }`.
  - Cartes séparées de `--sp-4` (et `--sp-3` sous 640 px).

---

## 3. Associations proposées

Toutes les polices sont sous licence **OFL 1.1**. Leur existence a été vérifiée sur le registre npm : `@fontsource-variable/source-serif-4@5.3.1`, `figtree@5.3.0`, `commissioner@5.3.0`, `literata@5.3.0`, `atkinson-hyperlegible-next@5.3.0`.
Chaque variante a été soumise à un sous-ensemble comme Fraunces aujourd'hui : mêmes 207 caractères français, plus `U+00A0`, `U+202F`, `U+2009`, `U+2011` et `U+2212`. Les axes ont été limités avec fontTools.
**Les poids indiqués sont ceux des fichiers réellement servis par chaque variante compilée.** Les captures sont faites à 1 440×900 et 390×844 (`deviceScaleFactor: 1`, mouvement réduit pour figer les apparitions). À part la police, la mise en page est identique.

### Comparatif

| | Actuel | **A** Source Serif 4 + Figtree | **B** Commissioner seule | **C** Literata + Atkinson Hyperlegible Next |
|---|---|---|---|---|
| Fichiers par page | 3 | 3 (2 sans l'italique) | **1** | 3 (2 sans l'italique) |
| Poids servi | 89,6 Ko | 77,5 Ko (46,2 Ko sans l'italique) | **37,4 Ko** | 98,7 Ko (58,3 Ko sans l'italique) |
| CLS accueil 1 440 px, polices +800 ms | 0,011 | 0,270* | 0,014 | 0,012 |
| CLS lombalgie 1 440 px, polices +800 ms | 0,201 | 0,013 | 0,012 | 0,197* |
| Détecteur `impeccable` (type) | overused-font ×2, italic-serif-display ×15 | italic-serif-display ×15 | aucun signalement de police | italic-serif-display ×15 |

\* Ces valeurs reflètent surtout la fragilité des grilles centrées (P1-5). C pour lombalgie et A pour l'accueil se déplacent déjà **sans délai de police** (0,189 et 0,128), parce que le titre change de hauteur. Avec `align-items: start`, ces écarts disparaissent. Les signalements « italic » viennent du `<em>` conservé dans A et C, pas des polices elles-mêmes.

| Page | Actuel | A | B | C |
|---|---|---|---|---|
| Accueil, hero 1 440 | ![actuel](../polices/actuel-accueil-hero-1440.jpg) | ![A](../polices/A-accueil-hero-1440.jpg) | ![B](../polices/B-accueil-hero-1440.jpg) | ![C](../polices/C-accueil-hero-1440.jpg) |
| Accueil, hero 390 | ![actuel](../polices/actuel-accueil-hero-390.jpg) | ![A](../polices/A-accueil-hero-390.jpg) | ![B](../polices/B-accueil-hero-390.jpg) | ![C](../polices/C-accueil-hero-390.jpg) |
| Accueil, catégories 1 440 | ![actuel](../polices/actuel-accueil-categories-1440.jpg) | ![A](../polices/A-accueil-categories-1440.jpg) | ![B](../polices/B-accueil-categories-1440.jpg) | ![C](../polices/C-accueil-categories-1440.jpg) |
| Accueil, catégories 390 | ![actuel](../polices/actuel-accueil-categories-390.jpg) | ![A](../polices/A-accueil-categories-390.jpg) | ![B](../polices/B-accueil-categories-390.jpg) | ![C](../polices/C-accueil-categories-390.jpg) |
| Lombalgie 1 440 | ![actuel](../polices/actuel-lombalgie-1440.jpg) | ![A](../polices/A-lombalgie-1440.jpg) | ![B](../polices/B-lombalgie-1440.jpg) | ![C](../polices/C-lombalgie-1440.jpg) |
| Lombalgie 390 | ![actuel](../polices/actuel-lombalgie-390.jpg) | ![A](../polices/A-lombalgie-390.jpg) | ![B](../polices/B-lombalgie-390.jpg) | ![C](../polices/C-lombalgie-390.jpg) |
| Lombalgie, texte courant 1 440 | ![actuel](../polices/actuel-lombalgie-texte-1440.jpg) | ![A](../polices/A-lombalgie-texte-1440.jpg) | ![B](../polices/B-lombalgie-texte-1440.jpg) | ![C](../polices/C-lombalgie-texte-1440.jpg) |
| Lombalgie, texte courant 390 | ![actuel](../polices/actuel-lombalgie-texte-390.jpg) | ![A](../polices/A-lombalgie-texte-390.jpg) | ![B](../polices/B-lombalgie-texte-390.jpg) | ![C](../polices/C-lombalgie-texte-390.jpg) |

### Actuel : Fraunces + Manrope
- **Caractère.** Fraunces, une serif « molle » à l'allure ancienne, est chaleureuse mais devenue la police par défaut des pages générées. Elle est en plus servie dans sa coupe 9 pt (P1-2), d'où des titres larges et lourds. Manrope est une grotesque géométrique au grand œil (x-height 0,54), lisible mais connotée « SaaS » et fintech, peu chaleureuse pour un soin.
- **Mesures.** 89,6 Ko, 3 fichiers, 36,1 Ko d'italique préchargés. Police de secours Manrope juste, police de secours Fraunces approximative.

### A : Source Serif 4 (titres) + Figtree (texte), dite « Serif apaisée »
- **Rôles et graisses.**
  - Titres : Source Serif 4, `wght` 400–560 (titres à 440), `opsz` figé à 48. Fichiers : `source-serif-4-titres-normal-opsz48-fr.woff2` (30,2 Ko) et, en option, l'italique (31,3 Ko).
  - Texte : Figtree, `wght` 400–700 (texte 400, boutons 600). Fichier : `figtree-texte-normal-fr.woff2` (16,0 Ko).
- **Pourquoi elle convient.**
  - Source Serif 4 est une serif de lecture transitionnelle (Adobe, Frank Grießhammer), au contraste modéré. Elle fait « soin sérieux et attentif » plutôt que « mode ».
  - Elle garde l'empattement auquel le cabinet est peut-être attaché, sans la mollesse ni la renommée de Fraunces.
  - Figtree est une sans-serif amicale et ouverte, à grand œil. Elle est plus chaleureuse que Manrope et deux fois plus légère.
  - Les titres paraissent nettement plus fins et plus calmes (voir le hero).
- **Polices de secours.** Titres : `local('Times New Roman')`, `size-adjust: 104.7%; ascent-override: 98.9%; descent-override: 32%`. Texte : `local('Arial')`, `size-adjust: 100.1%; ascent-override: 94.9%; descent-override: 25%`.
- **Avantages.** -14 % de poids (-48 % sans l'italique). Un vrai `tnum` pour les chiffres. Le « Comment ça se passe » est plus élégant.
- **Risques.**
  1. L'`opsz` figé à 48 rend les petits titres (H3 de 20 px, titres de cartes) trop fins et trop contrastés, comme on le voit sur [A-lombalgie-texte-1440](../polices/A-lombalgie-texte-1440.jpg). Deux solutions : garder l'axe `opsz` 20–60 (fichier de 66,4 Ko mesuré), ou composer les titres de moins de 24 px en Figtree 600.
  2. Le fond crème plus une serif restent proches du cliché n° 1 : il faut appliquer P1-1 (italique, fond, terracotta) en même temps.

### B : Commissioner, une seule famille (titres avec empattements évasés, texte sans), dite « Humaniste évasée »
- **Rôles et graisses.** Un seul fichier variable, `commissioner-titres-flar-fr.woff2` (37,4 Ko), avec les axes `wght` 300–600 et `FLAR` 0–100.
  - Titres : `font-variation-settings: 'FLAR' 100`, graisse 380, approche -0,022em.
  - Texte : `FLAR` 0, graisse 400 (600 pour les libellés et boutons).
- **Pourquoi elle convient.**
  - Commissioner est une humaniste de Kostas Bartsokas. Son axe `FLAR` évase les extrémités des traits, à la manière des lettres lapidaires et d'Optima : ce registre « soin, sérénité, savoir-faire » est celui des maisons de santé et de bien-être, sans être une serif.
  - Un seul fichier porte les deux voix. Les titres gagnent une douceur gravée, le texte reste neutre, chaleureux et très lisible.
  - Elle sort complètement du cliché crème plus serif tout en gardant la charte : vert, or et olive ressortent mieux sur une typo plus sobre.
- **Police de secours.** `local('Arial')`, `size-adjust: 99%; ascent-override: 102.7%; descent-override: 20.8%; line-gap-override: 0%`.
- **Avantages.**
  - **-58 % de poids (89,6 → 37,4 Ko), 1 requête au lieu de 3.**
  - CLS le plus bas mesuré : au plus 0,045 sur tous les cas testés, polices retardées comprises.
  - Le détecteur ne relève plus aucun motif de police.
  - Hiérarchie lisible par la graisse et l'évasement, pas seulement par la taille.
  - Les guillemets, les apostrophes et `U+202F` sont inclus.
- **Risques.**
  1. Pas de vraie italique : les `<em>` des titres deviennent des passages en vert, en graisse 300 et en romain (choix fait dans la capture). C'est cohérent avec P1-1.
  2. Le nom écrit « Adrian Rodriguez » de l'en-tête change de voix. Il faut vérifier la typographie des documents imprimés du cabinet (carte, plaque) : s'ils sont en serif, A garde la continuité.
  3. Œil plus petit que Manrope (0,495 contre 0,54). Garder le texte à 18 px sur ordinateur.
  4. Le genre « évasé » rappelle un peu le spa : à doser avec des titres sobres (graisse 380, sans italique).

### C : Literata (titres) + Atkinson Hyperlegible Next (texte), dite « Lisibilité soin »
- **Rôles et graisses.**
  - Titres : Literata, `wght` 350–560 (titres à 400), `opsz` figé à 60. Fichiers : 40,1 Ko pour le romain, 40,4 Ko pour l'italique.
  - Texte : Atkinson Hyperlegible Next, `wght` 400–700. Fichier de 18,2 Ko.
- **Pourquoi elle convient.**
  - Literata (TypeTogether, conçue pour la lecture longue) est une serif de livre robuste et douce.
  - Atkinson Hyperlegible Next a été dessinée pour le Braille Institute afin de bien distinguer les caractères. C'est un argument fort pour une patientèle de seniors et de personnes malvoyantes.
- **Polices de secours.** Titres : `size-adjust: 116.4%; ascent-override: 101.1%; descent-override: 26.5%` (Times New Roman). Texte : `size-adjust: 98.7%; ascent-override: 99.7%; descent-override: 32%` (Arial).
- **Avantages.** Le meilleur argument d'accessibilité. Literata au format affichage est plus fine et plus élégante que Fraunces en coupe 9 pt.
- **Risques.**
  - La plus lourde : +10 %, soit 98,7 Ko.
  - Le zéro barré et les formes asymétriques d'Atkinson font « technique » : voir le téléphone « 06 09 22 49 38 » sur [C-accueil-hero-390](../polices/C-accueil-hero-390.jpg). C'est moins haut de gamme.
  - On reste dans le registre serif sur crème.

### Ma recommandation
**B, Commissioner seule**, avec les correctifs de P1-1 : plus de mot en italique dans les titres, l'or de la charte à la place du terracotta, le fond `#f5f6f2`, et des étiquettes sans capitales. C'est l'option qui :
1. répond le mieux à « calme, chaleureux, rassurant » sans retomber dans le cliché ;
2. divise le poids des polices par 2,4 et passe de 3 requêtes à 1 ;
3. donne le CLS le plus stable ;
4. reste fidèle à la charte, car la couleur et le logo ne bougent pas.

**Repli : A** si le cabinet tient à l'empattement (documents imprimés en serif). Dans ce cas, garder l'axe `opsz` 20–60 pour les titres (66,4 Ko) et retirer l'italique. Le total est alors d'environ 82 Ko pour 2 fichiers.
**Dans tous les cas**, P0-1 (insécables) et P1-3 (hiérarchie) sont indépendants de la police et doivent être faits en premier.

---

## 4. Skills appliqués

- **impeccable** (`SKILL.md`, `reference/typeset.md`, `reference/layout.md`, `reference/craft-floor.md`).
  - Les deux évaluations séparées de `typeset` : d'abord l'évaluation typographique (autorité et adéquation, hiérarchie, échelle, mesure de 45 à 75 caractères, stress, chargement), puis le passage mécanique `impeccable detect --scope type` et `--scope layout` sur la copie.
  - Exigences de `typeset` reprises : une police de secours aux métriques compatibles, ne charger que les axes utilisés, `text-wrap: balance`/`pretty`, rien sous 16 px pour le texte.
  - `craft-floor` : affichage plafonné à 6 rem, approche jamais sous -0,04em, une seule étiquette au-dessus d'un titre étant déjà une interdiction (eyebrow), et pas de numéros 01/02 hors séquence.
  - `layout` : une échelle d'espacement documentée en base 4, et plus d'espace au-dessus d'un titre qu'en dessous.
- **design-taste-frontend** (`SKILL.md`, `references/system.md`, `references/layout-v4.md` §5).
  - Le seuil « chaque niveau au moins 1,3 fois le suivant à partir de 1 024 px », rien sous 13 px, des étiquettes de 13 px en graisse 500 sans capitales espacées.
  - Une famille, ou une police d'affichage plus une police de texte aux rôles fixes, et 4 fichiers au plus.
  - Une seule taille par type d'élément, des guillemets typographiques, un nombre jamais séparé de son unité.
  - La césure liée à `lang`, l'échelle d'espacement 4/8/12/16/24/32/48/64/96.
  - Pas de couleur à l'intérieur des titres : le mot en italique coloré est déconseillé.
- **frontend-design.** Le diagnostic franc du cliché n° 1 (crème, serif, terracotta) et des habillages n° 5 (capitales espacées, points médians, flèche ajoutée aux liens). Le principe « choisir une police pour ce sujet, pas par défaut ». Des lignes de moins de 80 caractères, avec un interlignage plus généreux pour une serif.
- **apple-design** (§15). L'approche propre à chaque taille (négative pour les grands titres, nulle pour le texte), l'interlignage qui diminue quand la taille augmente, la hiérarchie construite par la graisse, la taille et l'interlignage ensemble, et des tailles en `rem` pour suivre le réglage de taille du texte de l'utilisateur.

### Limites et ce qui n'a pas été vérifié
- **Georgia et Arial sont absentes du conteneur.** Les valeurs de secours sont calculées contre Liberation Serif et Liberation Sans, qui ont les mêmes métriques que Times New Roman et Arial. La valeur `size-adjust: 96%` actuelle, calée sur Georgia, n'a pas pu être recalculée. Les CLS « polices retardées » ont été mesurés avec DejaVu comme police de secours.
- **Les captures des variantes ne changent que la police**, avec quelques ajustements de graisse et d'approche par variante. Les correctifs de P1-1 et de la section 2 ne sont pas appliqués dans les captures.
- **Largeur de 320 px non testée** pour les débordements de titres.
- **Outils et fichiers de travail**, hors dépôt, dans `/tmp/claude-0/-home-user/8a0742d5-728a-5ce4-a91d-36778fa4e5da/scratchpad/audit-typo/` : `measure.cjs`, `frtypo.cjs`, `orphans.cjs`, `cls.cjs`, `subset.py`, `make_variant.py` et les polices dans `fonts-out/`.
