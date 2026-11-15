# Charte graphique

Ambiance : **élégant, professionnel, calme**. L'identité du site officiel (logo, couleurs, police League Spartan) est conservée. Le gabarit d'offres d'emploi est abandonné.

## Couleurs

| Rôle | Hex | Origine | Usage | Contraste |
|---|---|---|---|---|
| Vert principal | `#3e5e42` | site officiel | boutons, liens, bandeau de conversion | blanc sur vert : 7,3:1 ✔ |
| Vert profond | `#2e4632` | dérivé (vert assombri) | survol des boutons | blanc : 10:1 ✔ |
| Or | `#be9b4e` | site officiel | filets, étoiles, puces d'étapes, bouton du bandeau (texte foncé) | encre sur or : 6,9:1 ✔ · **jamais en texte sur fond clair (2,6:1)** |
| Or clair | `#f4ecd9` | dérivé | encadrés de note, placeholders `[À FOURNIR]` | — |
| Olive | `#5f5e34` | site officiel | petits libellés, en-têtes de tableau | sur blanc : 6,7:1 ✔ |
| Encre | `#161515` | site officiel | titres, pied de page | — |
| Texte | `#2b2c2e` | dérivé | texte courant (plus lisible que le `#717275` d'origine) | 14:1 ✔ |
| Texte secondaire | `#5b5c60` | dérivé | chapôs, descriptions | 6,7:1 ✔ |
| Fond teinté | `#f3f5f1` | dérivé du vert | une section sur deux | — |

*Choix :* le `#f0f8ff` (bleu glacier) du gabarit Tooplate jurait avec le vert et l'or. Il est remplacé par un fond tiré du vert, qui garde l'ensemble cohérent et apaisé.

## Typographie

| Rôle | Police | Graisses | Pourquoi |
|---|---|---|---|
| Titres | **League Spartan** (police du site officiel) | variable, 500–600 | identité imposée, géométrique et nette |
| Texte | **Source Sans 3** | variable, 400–600 | humaniste et très lisible en petite taille ; elle adoucit la géométrie de League Spartan |

Les polices sont auto-hébergées en WOFF2 variable, sous-ensemble latin (24 + 29 Ko), préchargées, avec `font-display: swap`. Il n'y a aucun appel à Google, ce qui est mieux pour le RGPD et la vitesse.
Échelle : H1 de 36 à 64 px, H2 de 28 à 44 px (avec `clamp`), texte de 17 à 18 px, interligne 1,65, mesure maximale de 68 caractères.

## Formes et composants
- Rayons du site officiel : 10 px (champs, encadrés), 30 px (photos, cartes Contact), 100 px (boutons « pilule »).
- Un seul style de bouton : vert plein (RDV), contour (téléphone, itinéraire), or (dans le bandeau vert).
- Listes à filets plutôt que grilles de cartes identiques (motifs, publics, FAQ, avis).
- Icônes : un jeu SVG maison, trait de 1,6 px, en 24 px.
- Photos : AVIF haute définition (images secondaires en différé), dimensions fixées pour éviter les décalages.

## Mouvement
Discret, joué une seule fois :
- entrée douce du hero au chargement ;
- photos révélées par un rideau (`clip-path`) au défilement ;
- zoom de 3 % de la photo au survol ;
- soulignés qui se dessinent ;
- boutons qui se soulèvent de 2 px au survol et s'enfoncent au clic.

Avec « réduire les animations », tout est immobile et visible.

## Ce qu'on a refusé
Carrousels (avis, publics), diaporama dans le hero, sur-titres, numéros de section décoratifs, ombres décalées, texte doré sur fond clair.
