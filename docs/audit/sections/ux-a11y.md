# Audit ergonomie, UX et accessibilité

**Périmètre :** version compilée de référence (`http://127.0.0.1:4180/`, 26 pages) et formulaire PHP testé en local (`php -S`, `sendmail_path` redirigé vers un fichier : aucun e-mail réel envoyé). Lecture seule : aucun fichier source modifié.
**Outils :** Playwright (Chromium, 390×844 en émulation tactile `isMobile/hasTouch`, 320×640, 1440×900, 2560×1440), axe-core (`wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`), contrôle de contraste au pixel (capture du fond réel sous chaque texte), détecteur `impeccable detect`.
**Limite :** rien n'a été testé sur un vrai téléphone. Les points marqués *(appareil)* se vérifient sur iPhone/Android réels (survol collant, flash au toucher, encoche).

Visuel attendu : calme, rassurant, premium. L'ensemble tient cette promesse (palette forêt/papier, Fraunces, rythme aéré, aucune promesse de guérison). Les défauts trouvés sont surtout des **finitions qui trahissent le « premium »** sur mobile et des **cas limites** (320 px, sans JS, focus).

---

## Synthèse

| # | Dimension | Note /4 | Constat clé |
|---|---|---|---|
| 1 | Accessibilité | 3 | axe : 0 violation, mais 3 échecs WCAG AA trouvés à la main (bouton or du pied de page 2,63:1, contour de focus 2,48:1, bordure des champs 1,64:1) et le bouton flottant caché reste focusable |
| 2 | Responsive / tactile | 2 | 320 px : colonne « Tarif » et e-mail du pied de page coupés ; 30 lignes `:hover`, aucune conditionnée par `(hover: hover)` ; pas de `viewport-fit=cover` |
| 3 | Parcours | 3 | RDV et appel en 1 tap, partout ; adresse lointaine (17,5 écrans sur l'accueil, 3 taps minimum) |
| 4 | Microcopie | 3 | Vocabulaire calme et cohérent ; « Un tarif clair, sans surprise » et « Réserver ce créneau » contredits par les données absentes |
| 5 | Intégrité du système | 3 | Système cohérent et propre au cabinet ; `[À CONFIRMER]` visible 90 fois sur 26 pages |
| **Total** | | **14/20** | **Bon : quelques corrections ciblées avant mise en ligne** |

Décompte : **P0 : 1 · P1 : 7 · P2 : 14**.

---

## P0 : bloquant pour la mise en ligne

### P0-1. `[À CONFIRMER]` affiché 90 fois aux visiteurs, sur les 26 pages
- **Où :** `content/layout.mjs:18` (`tbc()` rend `<mark class="tbc">[À CONFIRMER]</mark>`), données `content/site.mjs:41-53`. Style `site/src/css/main.css:85` (fond `--gold-tint`, contour pointillé olive, `white-space: nowrap`).
- **Inventaire (comptage dans la version compilée, pied de page compris) :**

| Page | Nb | Emplacements |
|---|---|---|
| `/` | 10 | chiffre « années d'expérience » (`pages.mjs:194`, affiché en très grand dans la grille de chiffres) ; carte tarif « Consultation adulte » prix + durée (`pages.mjs:208-210`) ; 5 temps de trajet (`pages.mjs:224`) ; FAQ « Combien coûte une séance ? » (`pages.mjs:90`) ; pied de page « Horaires » |
| `/tarifs/` | 19 | tableau des tarifs : 10 cellules (`pages.mjs:520-524`) ; « Horaires » en gros caractères (`pages.mjs:549`) ; 5 temps de trajet (`pages.mjs:566`) ; FAQ paiement (`pages.mjs:492`) et délai d'annulation (`pages.mjs:493`) ; pied de page |
| 14 pages catégorie | 3 chacune | ligne « Séance : … · Durée : … » (`pages.mjs:352`) ; pied de page |
| `/cabinet/` | 4 | année de diplôme, formations complémentaires, n° ADELI/RPPS (`pages.mjs:464-466`) ; pied de page |
| `/mentions-legales/` | 4 | ADELI/RPPS, SIRET, hébergeur (`pages.mjs:654-655`) ; pied de page |
| `/confidentialite/` | 2 | « conservés au plus 12 mois [À CONFIRMER] » (`pages.mjs:665`) ; pied de page |
| `/contact/` | 2 | horaires (`pages.mjs:631`) ; pied de page |
| autres (avis, conseils ×4, hub, 404) | 1 | pied de page « Horaires » (`layout.mjs:226`) |

- **Impact :** sur un site de santé, une étiquette de chantier dans le prix, les horaires et le n° ADELI casse la confiance au moment exact où le patient décide. C'est une donnée manquante, pas un défaut de code ; le marquage est volontaire et doit le rester tant que rien n'est fourni.
- **Correctif (sans rien inventer) :**
  1. Obtenir d'Adrian : tarifs, durée, horaires, ADELI/RPPS, SIRET, hébergeur, délai d'annulation, moyens de paiement, durée de conservation, temps de trajet.
  2. Ajouter un garde-fou de build : en production (`DEMO !== '1'`), `npm run build` échoue si une valeur vaut `TBC` (ex. dans `content/layout.mjs`, `if (!DEMO && v === TBC) throw new Error('Donnée à confirmer : ' + champ)`).
  3. Si une donnée doit rester absente au lancement, ne pas afficher de valeur : **masquer la ligne** (temps de trajet, chiffre « années d'expérience », durée) ou renvoyer vers la source réelle (« Tarifs et créneaux affichés sur Doctolib », « Horaires : voir les créneaux sur Doctolib »). Ces formulations ne créent aucune donnée.

---

## P1 : à corriger avant mise en ligne

### P1-1. Bouton « Prendre rendez-vous » du pied de page : texte blanc sur or, 2,63:1 (toutes les pages)
- **Où :** `site/src/css/main.css:566` `.footer a { color: #fff; … }` (spécificité 0,1,1) écrase `.btn-gold { --fg: var(--ink) }` (`main.css:108`, appliqué via `.btn { color: var(--fg) }`). Bouton émis par `content/layout.mjs:215`. Au survol, `main.css:567` `.footer a:hover { color: var(--gold-2) }` met du texte or clair sur le remplissage or clair (≈1,2:1).
- **Mesure :** couleur calculée `rgb(255,255,255)` sur `rgb(190,155,78)` = **2,63:1** (exigé 4,5:1). Confirmé par capture et par le détecteur (« 2.6:1 text #ffffff on #be9b4e »). axe l'a classé « incomplet » (pseudo-élément `::before`), d'où le 0 violation de `docs/checklist.md:35-36`.
- **Impact :** CTA principal illisible pour les malvoyants, sur 26 pages. WCAG 1.4.3.
- **Correctif :** `main.css:566-567` → `.footer a:not(.btn) { color: #fff; … }` et `.footer a:not(.btn):hover { color: var(--gold-2); }`. Résultat : encre `#161515` sur or = **6,93:1**, sur or clair au survol = **9,22:1**.

### P1-2. Contour de focus or sur fond clair : 2,48:1
- **Où :** `site/src/css/main.css:79` `:focus-visible { outline: 2.5px solid var(--gold); … }`.
- **Mesure :** `#be9b4e` sur papier `#faf8f3` = **2,48:1**, sur blanc = **2,63:1** (exigé 3:1). Les fonds sombres sont corrects (or sur `#1b2e24` = 5,46:1 ; `.spine-sec` passe déjà en `--gold-2`, `main.css:760`).
- **Impact :** au clavier, l'élément actif se repère mal sur la majorité des sections (fond papier ou blanc). WCAG 1.4.11 (indicateur d'état) ; aussi 2.4.13 (AAA).
- **Correctif :** `main.css:79` → `:focus-visible { outline: 2.5px solid var(--forest); outline-offset: 3px; box-shadow: 0 0 0 6px rgba(190,155,78,.35); border-radius: 6px; }` (forêt/papier **11,23:1**, garde la touche dorée en halo), puis sur fonds sombres : `.footer :focus-visible, .cta-final :focus-visible, .marquee-sec :focus-visible, .price-card :focus-visible, .way-main:focus-visible, .nav.is-open :focus-visible { outline-color: var(--gold-2); }`.

### P1-3. Bordure des champs du formulaire : 1,64:1
- **Où :** `site/src/css/main.css:542` `border: 1.5px solid #c9c4b7` ; champ sur fond `--paper` dans une section `.tint` blanche.
- **Mesure :** `#c9c4b7` sur `#faf8f3` = **1,64:1** (exigé 3:1 pour repérer un champ).
- **Impact :** les limites des 4 champs se devinent à peine, surtout en plein soleil sur téléphone. WCAG 1.4.11.
- **Correctif :** `border-color: #857f72` (3,98:1 sur blanc, 3,75:1 sur papier). Garder l'état focus actuel (`main.css:544`).

### P1-4. Bouton flottant caché mais toujours atteignable au clavier
- **Où :** `content/layout.mjs:243-246` (`.fab`), `site/src/css/main.css:585` `.fab.is-hidden { transform: translateY(140%); opacity: 0; }`, `site/src/js/nav.js:26-30`.
- **Mesure :** parcours clavier de l'accueil à 390 px : les tabulations n° 63 et 64 (« Appeler le 06 09 22 49 38 », « Prendre RDV sur Doctolib ») donnent le focus au bouton flottant **hors écran** (`top: 850px` pour une fenêtre de 844). Idem pour un lecteur d'écran, qui lit deux liens invisibles.
- **Impact :** focus invisible (WCAG 2.4.7) ; utilisateurs de clavier sur tablette et de lecteur d'écran perdus.
- **Correctif :** `nav.js:28` → `fab.classList.toggle('is-hidden', visible.size > 0); fab.inert = visible.size > 0;` et en CSS `main.css:585` ajouter `visibility: hidden;` avec `transition: transform .5s var(--ease), opacity .3s, visibility 0s .5s;` (et `visibility: visible; transition-delay: 0s` à l'état visible).

### P1-5. 320 px : colonne « Tarif » et e-mail du pied de page coupés, sans possibilité de défiler
- **Où :** pied de page `site/src/css/main.css:571` `.footer-grid { grid-template-columns: 1fr 1fr }` ; tableau `main.css:514-518` ; étiquette `main.css:85` `mark.tbc { white-space: nowrap }` ; `main.css:65` `body { overflow-x: clip }` masque le débordement au lieu de le révéler.
- **Mesure (320×640) :** `scrollWidth` = 368 px sur toutes les pages (la deuxième colonne du pied de page va de 154 à 368 px : « adrian.osteo38@gma… » coupé) ; `/tarifs/` = 385 px, l'en-tête « TARIF » et toute la colonne des prix sont hors écran et inaccessibles (capture). Contredit `docs/checklist.md:50` (« Aucun débordement horizontal à 320 »).
- **Impact :** sur petit téléphone (iPhone SE 1re génération, zoom texte 125 % sur 390 px), la colonne la plus attendue de la page Tarifs est invisible. WCAG 1.4.10 (redistribution).
- **Correctif :** `main.css:571` → `grid-template-columns: repeat(2, minmax(0, 1fr));` et `.footer a { overflow-wrap: anywhere; }` ; tableau : envelopper `.tarif-table` dans `<div class="table-scroll" role="region" aria-label="Tarifs" tabindex="0">` avec `.table-scroll { overflow-x: auto; }`, ou sous 400 px passer en liste (`@media (max-width: 400px) { .tarif-table thead { position:absolute; clip:rect(0 0 0 0) } .tarif-table tr { display:grid; grid-template-columns: 1fr auto; } }`) ; `mark.tbc` : `white-space: normal` sous 400 px.

### P1-6. Formulaire sans JavaScript : aucune confirmation ni erreur affichée
- **Où :** `site/public/api/contact.php:21` redirige vers `/contact/?envoye=1#form-t` ou `?erreur=1#form-t` ; le message n'est écrit que par `site/src/js/form.js:150-153` (et `?erreur=1` n'est géré nulle part).
- **Mesure :** Playwright, `javaScriptEnabled: false` : envoi valide → URL `?envoye=1`, `[data-status]` vide ; envoi invalide → `?erreur=1`, `[data-status]` vide, saisie perdue.
- **Impact :** le chemin de secours annoncé en tête de `form.js:3` ne donne aucun retour : le patient ne sait pas si sa demande est partie et risque de renvoyer ou d'abandonner. Même effet si le module JS ne se charge pas. WCAG 3.3.1 sur ce chemin.
- **Correctif :** rendre les deux messages sans JS : soit `contact.php` répond une page HTML minimale (titre « Demande envoyée » + lien retour) au lieu de rediriger, soit le gabarit `/contact/` contient `<p class="form-status ok" data-when="envoye" hidden>` et une règle CSS `:target` (`#envoye:target { display:block }`) avec une redirection vers `/contact/#envoye` et `/contact/#erreur` (texte d'erreur : « L'envoi n'a pas abouti. Vérifiez les champs, ou appelez le 06 09 22 49 38. »).

### P1-7. Promesse « Un tarif clair, sans surprise » et bouton « Réserver ce créneau » contredits par le contenu
- **Où :** `content/pages.mjs:202-203` (« Un tarif clair, sans surprise » / « Le prix est affiché avant la réservation ») au-dessus d'un prix `[À CONFIRMER]` ; `content/pages.mjs:214` `rdv('Réserver ce créneau', …)` alors qu'aucun créneau n'est proposé.
- **Impact :** le titre promet ce que la carte ne montre pas ; le bouton suggère une réservation immédiate d'un horaire précis. Sur un site de santé, ce décalage coûte plus que l'absence de promesse.
- **Correctif :** bouton → `rdv('Voir les créneaux')` (libellé déjà employé sur `/tarifs/`, `pages.mjs:551`). Tant que le prix manque : titre « Ce que comprend la séance » et retirer la phrase « Le prix est affiché avant la réservation » ; la remettre quand le tarif est confirmé.

---

## P2 : à corriger au prochain passage

### Mobile natif

**P2-1. Aucun `:hover` conditionné : survol collant au toucher** *(appareil)*
`main.css` compte 30 lignes avec `:hover` et aucune n’est dans `@media (hover: hover)` (seuls `.hover-preview` et `.cursor` sont masqués par `(hover: none)`, `main.css:451` et `:600`). Les plus visibles après un tap : `.btn:hover::before` (`main.css:102-103`, le bouton « 06 09 22 49 38 » reste rempli en vert forêt au retour de l'appel), `.where-tabs button:hover` (`:328`, décalé de 2 px), `.spine-tabs button:hover` (`:738`, décalé de 4 px), `.chips a:hover` (`:487`), `.cat-card:hover` (`:682-686`), `.motif-index a:hover` (`:445-446`). **Correctif :** regrouper ces règles dans `@media (hover: hover) and (pointer: fine) { … }` et donner un retour au toucher via `:active` (déjà présent sur `.btn:active`, `main.css:104`).

**P2-2. Pas de `-webkit-tap-highlight-color`** *(appareil)*
Aucune occurrence. Flash gris rectangulaire sur les boutons en pilule et les cartes. **Correctif :** `main.css:62` → `html { -webkit-tap-highlight-color: transparent; … }` et `button, a { touch-action: manipulation; }`.

**P2-3. `env(safe-area-inset-bottom)` sans `viewport-fit=cover`**
`content/layout.mjs:172` `<meta name="viewport" content="width=device-width, initial-scale=1">` ; `.fab` utilise `env(safe-area-inset-bottom)` (`main.css:582`) qui vaut donc 0, et `right: 16px` ignore l'encoche en paysage. **Correctif :** `content="width=device-width, initial-scale=1, viewport-fit=cover"` ; `.fab { right: calc(16px + env(safe-area-inset-right, 0px)); bottom: calc(16px + env(safe-area-inset-bottom, 0px)); }` ; `.header-in { padding-inline: max(var(--gutter), env(safe-area-inset-left)) max(var(--gutter), env(safe-area-inset-right)); }`.

**P2-4. Couleur de barre d'état forêt au-dessus d'un en-tête papier**
`content/layout.mjs:177` `theme-color #243c2f` alors que le haut de page est `#faf8f3`. Bandeau vert foncé collé à un en-tête clair *(appareil)*. **Correctif :** `<meta name="theme-color" content="#faf8f3">`.

**P2-5. `100vh` sur la section épinglée**
`main.css:354` `.steps-sec.is-pinned { height: 100vh }` (≥ 1024 px, donc iPad paysage tactile). **Correctif :** `height: 100svh` (ligne `100vh` gardée avant en repli). `main.css:127` (barre décorative) peut rester.

**Points vérifiés et conformes :** hero en `min-height: 100svh` (`main.css:257`) ; champs à 17 px (aucun zoom iOS) ; menu mobile `overscroll-behavior: contain` (`main.css:168`) ; zoom non bloqué ; colonne 3D `touch-action: pan-y` (`main.css:742`) et sélection d'une zone au tap (`spine3d.js:249-251`).

### Navigation et parcours

**P2-6. Adresse et itinéraire trop loin, absents du menu**
Accueil à 390 px : adresse à **14 769 px** (17,5 écrans), pied de page à 18 275 px. Chemin le plus court : burger → « Tarifs & infos » → défiler 2,6 écrans jusqu'à `#acces` → « Itinéraire » = **3 taps + défilement**. `/contact/` affiche l'adresse (`pages.mjs:629`) mais **aucun bouton « Itinéraire »** (`mapCard`, `pages.mjs:245-255`, n'a que « Voir la fiche Google »). **Correctif :** dans `content/layout.mjs:202` (`.nav-extra`), ajouter `<a href="${site.links.directions}" target="_blank" rel="noopener">${icon('pin')} Itinéraire · Les Ravinelles</a>` → 2 taps ; ajouter le même lien dans `mapCard()` ; sur l'accueil, faire de « Parking gratuit » (`pages.mjs:116`) un lien vers `/tarifs/#acces`.

**P2-7. Accueil de 19 151 px sur mobile (22,7 écrans)**
13 sections avant le pied de page. Sans bouton « retour en haut », l'en-tête réapparaît bien en remontant (`nav.js:14-15`), donc pas bloquant. **Correctif :** fusionner « Le cabinet en chiffres » dans le bandeau d'engagements, ne garder que 4 cartes « Pour quoi ? » sur l'accueil avec un lien « Les 7 motifs » (les 14 restent sur `/osteopathie/`).

**P2-8. La réponse « l'ostéopathie peut-elle m'aider ? » est enterrée sur les pages catégorie**
`/osteopathie/sciatique/` à 390 px : « Ce que l'ostéopathie peut apporter, et ses limites » à **2 840 px** (3,4 écrans), après « Vous vous reconnaissez ? » et « Quand consulter » (`pages.mjs:330-351`). **Correctif :** remonter ce bloc et l'encadré `.medical` juste sous le hero, ou ajouter dans le hero (`pages.mjs:323`) une ligne courte tirée de `c.limits`.

**P2-9. `aria-current="page"` posé sur la rubrique parente**
`content/layout.mjs:166` (`startsWith`) + `:153` : sur `/osteopathie/sciatique/`, « Ostéopathie » et « Sciatique » portent tous deux `aria-current="page"` ; le lecteur d'écran annonce deux « page actuelle ». **Correctif :** `aria-current="${p.path === n.href ? 'page' : 'true'}"` pour le lien de rubrique.

### Formulaire

**P2-10. Champ unique « Téléphone ou e-mail » avec `autocomplete="tel"`**
`content/pages.mjs:615`. iOS/Android ne proposent que le téléphone ; pas d'`inputmode`, pas d'`enterkeyhint`. **Correctif :** deux champs : `<input type="tel" name="phone" autocomplete="tel" inputmode="tel">` et `<input type="email" name="email" autocomplete="email" inputmode="email" autocapitalize="none">` avec la règle « au moins l'un des deux » (adapter `form.js:130-136` et `contact.php:40-42`) ; `enterkeyhint="send"` sur le dernier champ ; `autocapitalize="words"` sur le nom.

**P2-11. Focus perdu après l'envoi**
`form.js:175` désactive le bouton qui a le focus ; mesure : après succès, `document.activeElement` = `BODY`. Le message `role="status"` est bien annoncé (`pages.mjs:623`). **Correctif :** `aria-disabled="true"` au lieu de `disabled` pendant l'envoi, ou `status.tabIndex = -1; status.focus()` après succès.

**P2-12. Messages d'erreur serveur et navigateur différents**
`form.js:135` « Ce numéro ou cet e-mail ne semble pas valide. Exemple : 06 12 34 56 78 ou nom@exemple.fr » ; `contact.php:42` sans l'exemple. **Correctif :** reprendre la phrase complète dans `contact.php:42`.

**Vérifié et conforme :** libellés `<label for>` sur tous les champs ; « (facultatif) » sur le seul champ optionnel ; envoi vide → 4 messages précis sous chaque champ, `aria-invalid="true"`, `aria-describedby`, focus sur le premier champ en erreur, résumé « Merci de corriger les champs signalés. » ; revalidation au blur une fois l'erreur affichée ; « Envoi en cours… » pendant l'envoi ; succès « Merci, votre demande est bien envoyée… » (testé contre le PHP local, réponse `{"ok":true}`) ; erreur 500 simulée → « L'envoi n'a pas abouti. Réessayez, ou appelez le 06 09 22 49 38. » ; consigne « Évitez les informations médicales détaillées ». WCAG 3.3.7 (saisie redondante) et 3.3.8 (authentification) : sans objet (formulaire en une étape, pas de connexion).

### Contraste fin et lecture

**P2-13. Petits textes blancs translucides et or clair sur fonds dégradés, juste sous 4,5:1**
- Repères « L1 – L5 », « S1 – coccyx » des onglets de la colonne : `main.css:737` `rgba(255,255,255,.6)`, mesurés **4,37:1** (1440) et **4,49:1** (390) sur le dégradé `#2c4a38`. **Correctif :** `.75` → 6,35:1.
- Carte tarif de l'accueil : `.price-label` et `mark.tbc` en `--gold-2` mesurés **4,15 à 4,59:1** là où le reflet `.price-card::after` (`main.css:374`, or à 28 %) passe dessous. **Correctif :** reflet à `rgba(212,181,108,.14)` ou texte `#e3c98c` (5,08:1 sur la zone la plus claire).

**P2-14. Titres découpés en un `<span>` par mot, et consigne « survolez » sur tactile**
`content/layout.mjs:54-57` (`splitWords`) : VoiceOver iOS peut lire le H1 mot par mot en balayage *(appareil, à vérifier)*. **Correctif :** `aria-label` portant le texte complet sur le `<h1>`, spans internes en `aria-hidden="true"`. Indication `pages.mjs:72` « Glissez pour faire tourner · survolez une zone » : sur téléphone, il n'y a pas de survol → « Glissez pour faire tourner · touchez une zone ».

---

## Microcopie (revue ux-copy)

| Élément | Actuel | Constat | Proposition |
|---|---|---|---|
| CTA principal | « Prendre rendez-vous » / « Prendre RDV » (en-tête, bouton flottant) | Cohérent, l'abréviation reste comprise | Garder |
| Carte tarif accueil | « Réserver ce créneau » (`pages.mjs:214`) | Aucun créneau affiché | « Voir les créneaux » (P1-7) |
| Section tarif | « Un tarif clair, sans surprise » (`pages.mjs:202`) | Contredit par `[À CONFIRMER]` | « Ce que comprend la séance » tant que le prix manque |
| Chiffres | « 24 vertèbres mobiles, une approche globale » (`pages.mjs:193`) | Fait anatomique présenté comme un chiffre du cabinet ; affaiblit les vrais chiffres | Retirer de `.num-list` (garder dans la section colonne) |
| Cartes | « Découvrir » (catégories), « Lire » (articles) | Clairs et distincts | Garder |
| Formulaire, aide | « Pour que je puisse vous répondre. » (`pages.mjs:615`) | Répète le libellé | « Je vous rappelle ou vous écris, selon ce que vous indiquez. » |
| Formulaire, succès | « Je vous recontacte rapidement. » | Pas d'attente précisée ; ne pas inventer de délai | « Je vous recontacte dès que possible, en dehors des séances. » (délai réel à ajouter quand Adrian le donne) |
| Formulaire, erreurs | Quoi + comment corriger, ton calme | Bon modèle | Aligner le PHP (P2-12) |
| Colonne 3D | « survolez une zone » | Faux sur tactile | « touchez une zone » |
| Bandeau final | H2 « Prenez le temps d'aller mieux » sur presque toutes les pages | Répétition perçue de page en page | Variante par gabarit (ex. catégories : « Parlons de votre {motif} ») |
| 404 | « Cette page s'est égarée » + 4 liens + RDV | État vide exemplaire : quoi, pourquoi, où aller | Garder |

Vocabulaire : « séance » et « consultation » coexistent (« Consultation adulte » sur la carte tarif, « séance » partout ailleurs). Choisir « séance » pour le patient, « consultation » seulement dans le tableau des tarifs.

---

## Hiérarchie visuelle et structure

Un seul H1 vérifié sur les 14 gabarits testés. Plans :

- **Accueil :** H1 › H2 ×12 (« Le cabinet en chiffres » en `sr-only`) › H3 « Pour qui ? / Pour quoi ? » et 4 étapes. Ordre logique, pas de saut de niveau.
- **Catégorie (×14, ex. sciatique) :** H1 › H2 « Vous vous reconnaissez ? », « Quand consulter », « Comment ça se passe » › H3 « Ce que l'ostéopathie peut apporter, et ses limites », « Quand privilégier un avis médical » › H2 FAQ, « À découvrir aussi » (6 cartes : 3 de la même famille, 3 de l'autre ; bon maillage), bandeau final.
- **Tarifs :** H1 › H2 Les tarifs, Préparer votre venue, Horaires, Accès et parking › H3 Temps de trajet › H2 FAQ.
- **Contact :** H1 › H2 Être rappelé, Le cabinet, Questions fréquentes.
- **Avis, Conseils :** H1 › H2 bandeau final uniquement (la grille d'avis et la liste d'articles n'ont pas de titre propre ; acceptable).
- **Légal :** H1 › H2 par rubrique.

Fil d'Ariane présent sur toutes les pages intérieures (`<nav aria-label="Fil d'Ariane">`, dernier élément `aria-current="page"`).

---

## Accessibilité : points conformes vérifiés

- Lien d'évitement en 1re tabulation, `main#contenu tabindex="-1"`.
- Ordre de tabulation de l'accueil logique (70 arrêts à 1440 px, 64 à 390 px) : en-tête → hero → cartes → pause du défilant → onglets colonne → tarif → accès → articles → FAQ → pied de page.
- **2.4.11 (focus non masqué) :** aucun élément masqué par l'en-tête fixe, en tabulation ni en tabulation inverse (`scroll-padding-top: calc(var(--header) + 24px)`, `main.css:62`, et en-tête réaffiché au focus, `nav.js:21`). À 390 px, le résumé de FAQ « Combien coûte une séance ? » est **partiellement** couvert par le bouton flottant (2 points de contrôle sur 3) : conforme au niveau AA (pas entièrement masqué), à améliorer avec `@media (max-width:1023px) { html { scroll-padding-bottom: 96px; } }`.
- **2.5.8 (taille de cible) :** aucun échec. Cibles < 44 px restantes (conformes par exception) : liens dans le texte (« 06 09 22 49 38 », « Écrivez-moi », « Itinéraire · Fiche Google » du pied de page : 23 px de haut) ; fil d'Ariane « Accueil » 49×19 px (espacé) ; case de consentement 22×22 px (son libellé est cliquable).
- Menu mobile : `aria-expanded`, libellé « Ouvrir/Fermer le menu », Échap, focus piégé, volets fermés hors tabulation (`visibility: hidden`), liens 63 px et boutons de volet 48×48 px. Méga-menus ordinateur : motif « disclosure », Échap rend le focus.
- Onglets « Où ça coince ? » et colonne : `role="tablist/tab/tabpanel"`, flèches, Début, Fin.
- Défilant d'avis : bouton pause (2.2.2), pause au survol et au focus, grille statique en mouvement réduit.
- Canvas 3D : conteneur `role="img"` avec description complète, `<canvas aria-hidden="true">` (`spine3d.js:26`), toutes les zones accessibles par les onglets HTML (alternative au glisser, 2.5.7).
- Textes alternatifs descriptifs (`site.mjs:83-94`) ; logos décoratifs en `alt=""`. Sans images, la page reste lisible (fonds forêt sous les arches).
- Or et terracotta : jamais utilisés en texte sur fond clair (terracotta `#b35941` uniquement en remplissage d'illustration ; or `#be9b4e` en texte seulement sur fonds sombres). Le seul cas or/clair trouvé est le contour de focus (P1-2).
- Liens externes annoncés « (nouvel onglet) » sur les boutons RDV.

---

## Mesures

### Taps par parcours (accueil, 390×844, émulation tactile)

| Parcours | Chemin mesuré | Taps | Défilement |
|---|---|---|---|
| (a) Prendre RDV | Bouton hero « Prendre rendez-vous » (y = 526 à 580, visible sans défiler) | **1** | 0 |
| (a) Appeler | Bouton hero « 06 09 22 49 38 » `tel:` (y = 592 à 646) | **1** | 0 |
| (a) RDV/appel en cours de lecture | Bouton flottant (caché tant que les boutons du hero ou le pied de page sont visibles ; visible à y = 900, 2000, 4000, 6000 ; caché en bas de page) | **1** | — |
| (b) « L'ostéo peut-il m'aider pour une sciatique ? » | Burger → flèche « Ostéopathie » → « Sciatique » | **3** | réponse « Ce que l'ostéopathie peut apporter » à 2 840 px sur la page (3,4 écrans) |
| (b) variante | Défiler jusqu'aux cartes « Pour quoi ? » (y = 4 266) → carte | **1** | 5 écrans |
| (c) Adresse / itinéraire | Burger → « Tarifs & infos » → `#acces` (2 185 px), adresse 2 355 px, « Itinéraire » 2 929 px | **3** | 2,6 à 3,5 écrans |
| (c) variante | Défiler l'accueil jusqu'à l'adresse | 0 | 14 769 px (17,5 écrans) |
| (c) via Contact | Burger → « Contact » → adresse (h2 « Le cabinet » à 2 585 px) | 2 | 3 écrans, pas de bouton Itinéraire |

### Cibles tactiles < 44 px (390 px, 12 pages, menu exclu, mesuré au `getBoundingClientRect`)

| Taille | Élément | Pages | Statut 2.5.8 |
|---|---|---|---|
| 115×23 | lien « 06 09 22 49 38 » dans un paragraphe (FAQ, pied de page) | 17 occurrences | exception « dans le texte » |
| 70×23 | « Itinéraire » (pied de page) | 12 | exception « dans le texte » |
| 213×23 | « adrian.osteo38@gmail.com » | 12 | exception « dans le texte » |
| 49×19 | « Accueil » (fil d'Ariane) | 10 | conforme (espacement 24 px) |
| 92×23 | « Écrivez-moi » (tête de FAQ) | 5 | exception « dans le texte » |
| 86×23 / 100×23 | « Voir l'accès », « Tarifs & infos » dans réponses FAQ | 1 chacun | exception « dans le texte » |
| 193×23 | « Tarifs et remboursement » (pages catégorie) | 1 par page | exception « dans le texte » |
| 22×22 | case de consentement | `/contact/` | conforme (libellé cliquable, équivalent) |

Menu mobile : liens 350×63 / 286×63, boutons de volet 48×48, liens de volet 48 px de haut. Bouton flottant : appel 54×54, RDV 54 px de haut.

### axe-core (`wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`, mouvement réduit, page parcourue avant analyse)

| Page | 390 px violations | 390 px « incomplet » (contraste) | 1440 px violations | 1440 px « incomplet » |
|---|---|---|---|---|
| `/` | 0 | 96 | 0 | 93 |
| `/osteopathie/` | 0 | 66 | 0 | 66 |
| `/osteopathie/lombalgie/` | 0 | 30 | 0 | 28 |
| `/osteopathie/nourrissons/` | 0 | 27 | 0 | 28 |
| `/cabinet/` | 0 | 9 | 0 | 9 |
| `/tarifs/` | 0 | 13 | 0 | 12 |
| `/contact/` | 0 | 6 | 0 | 6 |
| `/avis/` | 0 | 9 | 0 | 9 |
| `/conseils/` | 0 | 8 | 0 | 7 |
| `/conseils/mal-de-dos/` | 0 | 8 | 0 | 8 |
| `/mentions-legales/` | 0 | 2 | 0 | 2 |
| `/404.html` | 0 | 2 | 0 | 3 |

Les « incomplets » (pseudo-éléments `::before` des boutons, dégradés, images) ont été repris au pixel : seuls P1-1 et P2-13 en sortent comme vrais échecs ; les autres écarts relevés par le script venaient du bouton flottant passant au-dessus du texte pendant la capture.

### Autres mesures
- **320×640 :** débordement 368 px (toutes pages, pied de page) et 385 px (`/tarifs/`). **2560×1440 :** aucun débordement, contenu plafonné à 1 320 px (`.wrap`).
- **Contrastes de référence :** vert/papier 6,86 ; gris `--muted`/papier 6,83 ; olive/`--gold-tint` 5,59 ; encre/or 6,93 ; blanc/or **2,63** ; or/papier **2,48** ; bordure champ/papier **1,64**.
- **Détecteur `impeccable detect`** (accueil, contact, sciatique, HTML statique) : 67 signalements. Confirmés : blanc sur or 2,6:1 (P1-1), or clair sur dégradé de `#colonne` 4,2:1 (avis, cf. P2-13). Faux positifs : « blanc sur papier » (le HTML seul ne voit pas les fonds sombres), « enfants collés au bord » (marges portées par `.wrap`), Fraunces italique (choix assumé de la direction artistique).

---

## Skills appliqués

| Skill | Application |
|---|---|
| impeccable (`audit` + `critique`) | Contexte chargé (`impeccable context` : pas de PRODUCT.md, système existant pris comme référence) ; grille 5 dimensions et sévérités P0-P2 ; détecteur lancé. ⚠️ Critique en mode dégradé, contexte unique (aucun outil de sous-agent disponible pour isoler les évaluations A et B). |
| mobile-native | Contrôle du tableau des symptômes : survol non conditionné, flash au toucher, `vh/svh`, taille des champs (17 px, OK), `viewport-fit`, `theme-color`, `touch-action` ; points marqués *(appareil)* à confirmer sur téléphone réel. |
| break-ui | Données extrêmes réelles : 320 px et 2560 px, e-mail long (`bartholomew.fitzgerald@northwind-industries-holdings.example.com`, accepté par le formulaire), nom à diacritiques, images bloquées, sans JS, erreur serveur 500, inventaire des `[À CONFIRMER]`. |
| apple-design | Retour à la pression (`:active` présent sur `.btn`, absent ailleurs), cohérence spatiale du menu (cercle depuis le burger), repères « où suis-je / comment sortir » (fil d'Ariane, `aria-current`), étiquettes directes. |
| design:design-critique | Première impression (calme, premium, H1 et RDV visibles sans défiler), hiérarchie, cohérence, parcours ; recommandations prioritaires ci-dessus. |
| design:ux-copy | Revue des CTA, erreurs, états vides (404), confirmation ; tableau « Microcopie ». |
| design:accessibility-review | Grille WCAG 2.2 AA : axe à 390/1440 sur 12 pages, contraste au pixel, clavier, focus masqué, tailles de cible, formulaire, canvas. |

---

## Ordre de correction recommandé

1. **P0-1** données à fournir + garde-fou de build (`/impeccable harden`).
2. **P1-1, P1-2, P1-3** trois corrections CSS de contraste (`/impeccable polish`).
3. **P1-4** bouton flottant `inert` (`/impeccable harden`).
4. **P1-5** 320 px : pied de page et tableau (`/impeccable adapt`).
5. **P1-6, P2-10 à P2-12** formulaire (`/impeccable harden`).
6. **P1-7** et microcopie (`/impeccable clarify`).
7. **P2-1 à P2-5** socle mobile natif (`/impeccable adapt`), puis **P2-6 à P2-9** parcours (`/impeccable layout`), puis `/impeccable polish`.
