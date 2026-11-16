# Mesures de départ

État mesuré : branche `claude/osteopathe-rodriguez-premium-tky1e7` (commit `6fe2986`), avant toute modification.
Compilation de production servie en local avec compression gzip, comme chez l'hébergeur.

**Méthode.**
- Lighthouse 12.6 (Chromium 1243 sans écran), médiane de 3 passages, étendue entre parenthèses ; mobile = réseau et processeur bridés, ordinateur = profil « desktop ».
- Poids, LCP, CLS, INP et défilement : `node scripts/measure.mjs` (Playwright). Poids calculés sur les fichiers servis, en gzip (niveau 9) et brotli (qualité 11).
- INP : mesuré sur une vraie interaction, l'ouverture puis la fermeture du menu.
- Défilement : page parcourue en entier (molette sur ordinateur, pas de 500 px sur mobile), images comptées par `requestAnimationFrame`, compteurs de mise en page lus par le protocole de Chromium.
- **Limite :** le navigateur de test n'a pas de carte graphique. Les valeurs absolues de fluidité sont pessimistes ; les écarts avant/après restent comparables. Les passages Lighthouse de départ ont tourné pendant que d'autres analyses occupaient la machine.

## Lighthouse

| Page | Format | Performance | Accessibilité | Bonnes pratiques | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|---|
| Accueil `/` | mobile | 95 (94–96) | 100 | 100 | 100 | 1,47 s | 2,62 s | 130 ms | 0,003 |
| Accueil `/` | ordinateur | 100 (100–100) | 100 | 100 | 100 | 0,39 s | 0,58 s | 20 ms | 0,001 |
| Catégorie `/osteopathie/lombalgie/` | mobile | 98 (98–99) | 100 | 100 | 100 | 1,31 s | 2,24 s | 40 ms | 0,015 |
| Catégorie `/osteopathie/lombalgie/` | ordinateur | 100 (100–100) | 100 | 100 | 100 | 0,35 s | 0,48 s | 0 ms | 0,010 |
| Contact `/contact/` | mobile | 99 (99–99) | 100 | 100 | 100 | 1,30 s | 2,06 s | 9 ms | 0,004 |
| Contact `/contact/` | ordinateur | 100 (100–100) | 100 | 100 | 100 | 0,34 s | 0,47 s | 0 ms | 0,001 |
| Mentions `/mentions-legales/` | mobile | 99 (98–99) | 100 | 100 | 100 | 1,33 s | 2,10 s | 6 ms | 0,011 |
| Mentions `/mentions-legales/` | ordinateur | 100 (100–100) | 100 | 100 | 100 | 0,34 s | 0,45 s | 0 ms | 0,001 |

À noter : l'accueil sur mobile est sous les valeurs de `docs/checklist.md` (97–98, LCP < 2,5 s), mesure prise machine occupée.

## Poids transférés par page (Ko, gzip / brotli)

| Page | Format | HTML | CSS | JS | Polices | Images | Total |
|---|---|---|---|---|---|---|---|
| Accueil `/` | mobile | 14,6 / 11,1 | 12,5 / 11,0 | 55,2 / 49,4 (1 f.) | 89,6 | 47,0 | 218,9 / 201,3 |
| Accueil `/` | ordinateur | 14,6 / 11,1 | 12,5 / 11,0 | 55,2 / 49,4 (1 f.) | 89,6 | 67,9 | 239,8 / 222,2 |
| Catégorie `/osteopathie/lombalgie/` | mobile | 7,4 / 6,3 | 12,5 / 11,0 | 55,2 / 49,4 (1 f.) | 89,6 | 38,8 | 203,5 / 188,3 |
| Catégorie `/osteopathie/lombalgie/` | ordinateur | 7,4 / 6,3 | 12,5 / 11,0 | 55,2 / 49,4 (1 f.) | 89,6 | 60,6 | 225,3 / 210,2 |
| Contact `/contact/` | mobile | 7,0 / 6,1 | 12,5 / 11,0 | 55,2 / 49,4 (1 f.) | 89,6 | 25,2 | 189,5 / 174,5 |
| Contact `/contact/` | ordinateur | 7,0 / 6,1 | 12,5 / 11,0 | 55,2 / 49,4 (1 f.) | 89,6 | 25,2 | 189,5 / 174,5 |
| Mentions `/mentions-legales/` | mobile | 5,3 / 4,7 | 12,5 / 11,0 | 55,2 / 49,4 (1 f.) | 89,6 | 25,2 | 187,8 / 173,1 |
| Mentions `/mentions-legales/` | ordinateur | 5,3 / 4,7 | 12,5 / 11,0 | 55,2 / 49,4 (1 f.) | 89,6 | 25,2 | 187,8 / 173,1 |

Polices et images ne se recompressent pas : une seule valeur.

### Fichiers JS et CSS produits

| Fichier | Brut | gzip | brotli |
|---|---|---|---|
| `spine3d-BCKb1BLQ.js` | 493,6 Ko | 124,6 Ko | 102,9 Ko |
| `main-C7B07Mrn.js` | 147,9 Ko | 55,2 Ko | 49,4 Ko |
| `main-CzT-9SL-.css` | 54,5 Ko | 12,5 Ko | 11,0 Ko |

Le fichier `spine3d` (Three.js) est chargé à l'approche de la colonne vertébrale, sur l'accueil et la page Ostéopathie, **y compris sur mobile**.

## LCP, CLS, INP, tâches longues (chargement, sans bridage)

| Page | Format | LCP | CLS | INP (ouverture du menu) | Tâches longues au chargement |
|---|---|---|---|---|---|
| Accueil `/` | mobile | 164 ms | 0 | 104 ms | 2 (82 ms, 84 ms) |
| Accueil `/` | ordinateur | 176 ms | 0,0007 | 104 ms | 2 (57 ms, 77 ms) |
| Catégorie `/osteopathie/lombalgie/` | mobile | 120 ms | 0 | 72 ms | 1 (55 ms) |
| Catégorie `/osteopathie/lombalgie/` | ordinateur | 96 ms | 0,0076 | 64 ms | 0 |
| Contact `/contact/` | mobile | 148 ms | 0 | 48 ms | 1 (51 ms) |
| Contact `/contact/` | ordinateur | 100 ms | 0,0007 | 32 ms | 0 |
| Mentions `/mentions-legales/` | mobile | 96 ms | 0 | 48 ms | 0 |
| Mentions `/mentions-legales/` | ordinateur | 92 ms | 0,0012 | 32 ms | 0 |

TBT : voir le tableau Lighthouse.

## Défilement enregistré

| Page | Format | Images rendues | Images perdues (> 25 ms) | Pire image | Tâches longues | Mises en page | Recalculs de style | Temps de style |
|---|---|---|---|---|---|---|---|---|
| Accueil `/` | mobile | 397 | 11 | 300 ms | 2 (max 242 ms) | 407 | 466 | 275 ms |
| Accueil `/` | ordinateur | 384 | 43 | 1317 ms | 20 (max 843 ms) | 461 | 825 | 356 ms |
| Catégorie `/osteopathie/lombalgie/` | mobile | 182 | 0 | 17 ms | 0 | 4 | 203 | 98 ms |
| Catégorie `/osteopathie/lombalgie/` | ordinateur | 189 | 5 | 33 ms | 0 | 80 | 386 | 152 ms |

Sur l'accueil ordinateur, les blocages (jusqu'à 1,3 s) correspondent au chargement et à la construction du modèle 3D pendant le défilement.

## Captures d'écran (haut de page)

| Page | 390 px | 768 px | 1024 px | 1440 px |
|---|---|---|---|---|
| Accueil `/` | [390](captures/avant/accueil-390.jpg) | [768](captures/avant/accueil-768.jpg) | [1024](captures/avant/accueil-1024.jpg) | [1440](captures/avant/accueil-1440.jpg) |
| Catégorie `/osteopathie/lombalgie/` | [390](captures/avant/categorie-390.jpg) | [768](captures/avant/categorie-768.jpg) | [1024](captures/avant/categorie-1024.jpg) | [1440](captures/avant/categorie-1440.jpg) |
| Contact `/contact/` | [390](captures/avant/contact-390.jpg) | [768](captures/avant/contact-768.jpg) | [1024](captures/avant/contact-1024.jpg) | [1440](captures/avant/contact-1440.jpg) |
| Mentions `/mentions-legales/` | [390](captures/avant/mentions-390.jpg) | [768](captures/avant/mentions-768.jpg) | [1024](captures/avant/mentions-1024.jpg) | [1440](captures/avant/mentions-1440.jpg) |

## Accessibilité automatique (axe-core)

- `npm test` : **0 violation** sur 11 pages × 2 formats (règles WCAG 2.1 A et AA).
- Analyse étendue (WCAG 2.2 AA, 12 pages à 390 et 1440 px) : 0 violation également, mais axe classe plusieurs contrastes « à vérifier ». Mesurés au pixel, trois sont des échecs réels : texte du bouton or du pied de page (2,63:1), contour de focus or sur fond clair (2,48:1), bordure des champs (1,64:1). Détail dans [sections/ux-a11y.md](sections/ux-a11y.md).
