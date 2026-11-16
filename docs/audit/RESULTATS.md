# Résultats : avant / après

Avant : commit `6fe2986` (branche `claude/osteopathe-rodriguez-premium-tky1e7`). Après : branche `claude/audit-refonte-qualite`.
Mêmes outils, mêmes réglages et même machine pour les deux séries (méthode dans [baseline.md](baseline.md)). Les deux séries Lighthouse ont été prises machine au repos.

**Limite à garder en tête :** tout est mesuré dans un navigateur sans écran ni carte graphique. Les écarts avant/après sont fiables, les valeurs absolues de fluidité sont pessimistes. Aucun essai n'a été fait sur un vrai téléphone.

## En bref

| Mesure | Avant | Après |
|---|---|---|
| JS chargé sur toutes les pages (gzip) | 55,2 Ko | **2,8 Ko** |
| JS total du site hors 3D (gzip) | 55,2 Ko | **6,7 Ko** (noyau + 5 modules à la demande) |
| 3D (Three.js, 125,0 Ko gzip) | chargée à l'approche de la section, mobile compris | **ordinateur seulement, sur demande** |
| Lighthouse mobile, accueil | 97, LCP 2,54 s | **99, LCP 1,96 s** |
| Images perdues au défilement de l'accueil (ordinateur) | 43, pire 1317 ms | **3, pire 33 ms** |
| Polices par page | 89,6 Ko | **77,5 Ko** |
| Dépendances d'exécution | gsap, lenis, three, 2 paquets de polices | **three** |
| axe-core (`npm test`, 22 passages) | 0 violation | 0 violation |
| Contrastes réels en échec | 3 | **0** |
| Pages, titres, descriptions, canonicals, JSON-LD, sitemap, robots | — | **identiques (27 pages comparées, 0 différence)** |

## Lighthouse (médiane de 3 passages)

| Page | Format | Performance | LCP | TBT | CLS | Accessibilité / Bonnes pratiques / SEO |
|---|---|---|---|---|---|---|
| Accueil `/` | mobile | 97 → **99** | 2,54 s → **1,96 s** | 54 → 18 ms | 0,003 → 0,000 | 100 / 100 / 100 (inchangé) |
| Accueil `/` | ordinateur | 100 → **100** | 0,57 s → **0,45 s** | 9 → 0 ms | 0,001 → 0,000 | 100 / 100 / 100 (inchangé) |
| Catégorie `/osteopathie/lombalgie/` | mobile | 99 → **100** | 2,16 s → **1,73 s** | 8 → 2 ms | 0,015 → 0,000 | 100 / 100 / 100 (inchangé) |
| Catégorie `/osteopathie/lombalgie/` | ordinateur | 100 → **100** | 0,48 s → **0,38 s** | 0 → 0 ms | 0,010 → 0,000 | 100 / 100 / 100 (inchangé) |
| Contact `/contact/` | mobile | 99 → **100** | 2,14 s → **1,66 s** | 6 → 0 ms | 0,004 → 0,000 | 100 / 100 / 100 (inchangé) |
| Contact `/contact/` | ordinateur | 100 → **100** | 0,44 s → **0,40 s** | 0 → 0 ms | 0,001 → 0,000 | 100 / 100 / 100 (inchangé) |
| Mentions `/mentions-legales/` | mobile | 99 → **100** | 2,08 s → **1,81 s** | 0 → 0 ms | 0,011 → 0,000 | 100 / 100 / 100 (inchangé) |
| Mentions `/mentions-legales/` | ordinateur | 100 → **100** | 0,45 s → **0,37 s** | 0 → 0 ms | 0,001 → 0,000 | 100 / 100 / 100 (inchangé) |

Aucun score ne baisse. Les planchers de la checklist (97–99 / 100 / 100 / 100, LCP < 2,5 s) sont tenus sur les 8 mesures.

## Poids transférés par page, mobile (Ko, gzip)

| Page (mobile) | JS | CSS | Polices | Images | HTML | Total | Écart |
|---|---|---|---|---|---|---|---|
| Accueil `/` | 55,2 → **4,7** | 12,5 → 11,2 | 89,6 → 77,5 | 47,0 → 47,0 | 14,6 → 13,9 | 218,9 → **154,3** | −30 % |
| Catégorie `/osteopathie/lombalgie/` | 55,2 → **2,8** | 12,5 → 11,2 | 89,6 → 77,5 | 38,8 → 38,8 | 7,4 → 7,4 | 203,5 → **137,8** | −32 % |
| Contact `/contact/` | 55,2 → **4,4** | 12,5 → 11,2 | 89,6 → 77,5 | 25,2 → 25,2 | 7,0 → 7,2 | 189,5 → **125,5** | −34 % |
| Mentions `/mentions-legales/` | 55,2 → **2,8** | 12,5 → 11,2 | 89,6 → 77,5 | 25,2 → 25,2 | 5,3 → 5,4 | 187,8 → **122,1** | −35 % |

Sur l'accueil et la page Ostéopathie, s'ajoutaient avant 124,6 Ko de 3D dès que la section approchait, sur tous les appareils. Ce téléchargement n'existe plus sur mobile.

### Fichiers JS et CSS produits (après)

| Fichier | Brut | gzip | brotli |
|---|---|---|---|
| `spine3d-BwJAOGxv.js` | 494,3 Ko | 125,0 Ko | 103,3 Ko |
| `main-DtnZ6F_T.js` | 7,4 Ko | 2,8 Ko | 2,5 Ko |
| `form-PROEa_0v.js` | 2,3 Ko | 1,2 Ko | 1,0 Ko |
| `spine-mHCi_sK2.js` | 1,9 Ko | 1,0 Ko | 0,9 Ko |
| `tilt-1IVQREWS.js` | 1,6 Ko | 0,7 Ko | 0,6 Ko |
| `steps-pin-BeKNyDfM.js` | 0,9 Ko | 0,5 Ko | 0,4 Ko |
| `map-D2wwLF1-.js` | 0,4 Ko | 0,3 Ko | 0,3 Ko |
| `main-Dpa4j7Nf.css` | 49,1 Ko | 11,2 Ko | 9,9 Ko |

## LCP, CLS, INP (chargement réel, sans bridage)

| Page | Format | LCP | CLS | INP | Tâches longues au chargement |
|---|---|---|---|---|---|
| Accueil `/` | mobile | 164 → 152 ms | 0 → 0 | 104 → **40 ms** | 2 → 1 |
| Accueil `/` | ordinateur | 176 → 188 ms | 0,0007 → 0 | 104 → **32 ms** | 2 → 1 |
| Catégorie `/osteopathie/lombalgie/` | mobile | 120 → 88 ms | 0 → 0 | 72 → **40 ms** | 1 → 0 |
| Catégorie `/osteopathie/lombalgie/` | ordinateur | 96 → 144 ms | 0,0076 → 0 | 64 → **48 ms** | 0 → 0 |
| Contact `/contact/` | mobile | 148 → 80 ms | 0 → 0 | 48 → **40 ms** | 1 → 0 |
| Contact `/contact/` | ordinateur | 100 → 68 ms | 0,0007 → 0 | 32 → **24 ms** | 0 → 0 |
| Mentions `/mentions-legales/` | mobile | 96 → 76 ms | 0 → 0 | 48 → **40 ms** | 0 → 0 |
| Mentions `/mentions-legales/` | ordinateur | 92 → 76 ms | 0,0012 → 0 | 32 → **24 ms** | 0 → 0 |

INP mesuré sur l'ouverture puis la fermeture du menu. Les valeurs de LCP sans bridage sont très basses dans les deux cas : la comparaison utile est celle de Lighthouse.

## Défilement enregistré

| Page | Format | Images perdues | Pire image | Tâches longues | Mises en page | Recalculs de style | Temps de style |
|---|---|---|---|---|---|---|---|
| Accueil `/` | mobile | 11 → **1** | 300 → **33 ms** | 2 → 0 | 407 → 35 | 466 → 301 | 275 → 78 ms |
| Accueil `/` | ordinateur | 43 → **3** | 1317 → **33 ms** | 20 → 0 | 461 → 33 | 825 → 287 | 356 → 77 ms |
| Catégorie `/osteopathie/lombalgie/` | mobile | 0 → **0** | 17 → **17 ms** | 0 → 0 | 4 → 10 | 203 → 126 | 98 → 31 ms |
| Catégorie `/osteopathie/lombalgie/` | ordinateur | 5 → **1** | 33 → **33 ms** | 0 → 0 | 80 → 12 | 386 → 117 | 152 → 33 ms |

## Captures avant / après (haut de page)

| Page | 390 px | 768 px | 1024 px | 1440 px |
|---|---|---|---|---|
| Accueil `/` | [avant](captures/avant/accueil-390.jpg) · [après](captures/apres/accueil-390.jpg) | [avant](captures/avant/accueil-768.jpg) · [après](captures/apres/accueil-768.jpg) | [avant](captures/avant/accueil-1024.jpg) · [après](captures/apres/accueil-1024.jpg) | [avant](captures/avant/accueil-1440.jpg) · [après](captures/apres/accueil-1440.jpg) |
| Catégorie `/osteopathie/lombalgie/` | [avant](captures/avant/categorie-390.jpg) · [après](captures/apres/categorie-390.jpg) | [avant](captures/avant/categorie-768.jpg) · [après](captures/apres/categorie-768.jpg) | [avant](captures/avant/categorie-1024.jpg) · [après](captures/apres/categorie-1024.jpg) | [avant](captures/avant/categorie-1440.jpg) · [après](captures/apres/categorie-1440.jpg) |
| Contact `/contact/` | [avant](captures/avant/contact-390.jpg) · [après](captures/apres/contact-390.jpg) | [avant](captures/avant/contact-768.jpg) · [après](captures/apres/contact-768.jpg) | [avant](captures/avant/contact-1024.jpg) · [après](captures/apres/contact-1024.jpg) | [avant](captures/avant/contact-1440.jpg) · [après](captures/apres/contact-1440.jpg) |
| Mentions `/mentions-legales/` | [avant](captures/avant/mentions-390.jpg) · [après](captures/apres/mentions-390.jpg) | [avant](captures/avant/mentions-768.jpg) · [après](captures/apres/mentions-768.jpg) | [avant](captures/avant/mentions-1024.jpg) · [après](captures/apres/mentions-1024.jpg) | [avant](captures/avant/mentions-1440.jpg) · [après](captures/apres/mentions-1440.jpg) |

## Vérifications

- `npm test` : 0 violation axe sur 11 pages × 2 formats, 0 erreur JavaScript sur les 3 formats, formulaire PHP réel envoyé (e-mails capturés dans un fichier, aucun envoi réel), menu mobile.
- SEO : script de comparaison des deux compilations (URL, `title`, `description`, `canonical`, `robots`, Open Graph, JSON-LD, nombre de H1, `sitemap.xml`, `robots.txt`) : 27 pages, 0 différence.
- `npm run build:demo` : fonctionne ; `robots.txt` fermé et manifeste préfixé, sans rien laisser dans git.
- Découpage des styles : rendu comparé page par page avant et après, à trois largeurs ; couleurs calculées identiques.
- Typographie française : 0 espace simple restante avant `: ; ? ! »` ou après `«` sur les 27 pages.

## Commits

| Commit | Sujet |
|---|---|
| `c3787f9` | Audit : synthèse priorisée, mesures de départ, checklist à jour |
| `0e19e4a` | Animations : passe de relecture (review-animations) |
| `8f83f49` | Polices : l'italique n'est préchargée que si le titre principal en contient |
| `a0bf762` | Styles découpés en couches (@layer) dans site/src/styles |
| `02ea902` | Icônes carrées et allégées (512 px : 370 → 129 Ko), logo inutilisé retiré |
| `68e5899` | .htaccess : cache longue durée réellement appliqué aux fichiers versionnés |
| `705741c` | Symboles : la donnée dans content/, plus d'écriture de fichier à l'import |
| `61d9cba` | Typographie : Source Serif 4 + Figtree, échelle fluide à 7 niveaux |
| `7bfd513` | Scripts allégés : plus de GSAP ni de Lenis, modules chargés à la demande |
| `36b039a` | Accessibilité et ergonomie : contrastes, focus, 320 px, formulaire sans JS |
| `533d3bd` | robots.txt, sitemap.xml et manifeste : générés, plus versionnés |
| `42e89e9` | Typographie française appliquée à la génération des pages |
| `4e4639f` | Audit : section typographie et hiérarchie |
| `2d9e933` | Audit : section ergonomie et accessibilité |
| `d4de6f5` | Audit : section code, ressources et architecture |
| `fccb0b6` | Audit : captures comparatives des associations de polices |
| `f083af8` | Audit : skills retenus, script de mesures, skills locaux ignorés |

## Ce qui reste à faire

**En attente d'informations d'Adrian** (tout est dans `content/site.mjs`, rien n'a été inventé) : tarifs par public, durée des séances, horaires, délai d'annulation, temps de trajet depuis les 5 communes, années d'expérience, année de diplôme et formations, ADELI/RPPS, SIRET, hébergeur, moyens de paiement, durée de conservation des données. Tant qu'ils manquent, `[À CONFIRMER]` reste affiché.

**À décider**
- Police : l'association A (Source Serif 4 + Figtree) est en place. B et C restent possibles, voir [AUDIT.md](AUDIT.md).
- Trois recommandations non suivies par fidélité à l'identité : accent terracotta, mot en italique dans les titres, rotation lente du grand symbole.
- Accueil long sur mobile (22 écrans) : regrouper ou raccourcir des sections est un choix de contenu.

**Technique, reporté**
- Essai sur de vrais téléphones (iPhone et Android) : fluidité, survol, encoche, lecture des titres par VoiceOver.
- Vérifier sur l'hébergeur que le `.htaccess` envoie bien `Cache-Control: immutable` sur `/assets/` et les redirections 301.
- Formulaire : deux champs séparés téléphone / e-mail, focus après l'envoi, limite d'envois par adresse (touche aussi `contact.php`).
- Migrer les couleurs et espacements encore codés en dur vers les tokens (`--sp-*`, couleurs translucides).
- Démo GitHub Pages (`gh-pages`) : non mise à jour, en attente d'accord.
