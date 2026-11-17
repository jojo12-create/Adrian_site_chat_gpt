# Style de référence pour le visualiseur anatomique 3D

Observations tirées des 18 illustrations « zones anatomiques » (7 motifs, 7 profils,
4 zones de colonne ; PNG 1122 × 1402, sans texte). Elles servent de cible visuelle au
restylage du modèle 3D. Couleurs mesurées directement sur les fichiers.

## Cadrage et pose
- Format portrait 4:5. Corps coupé à mi-cuisse, crâne à ~4 % du bord haut, axe de la
  colonne centré. Cadrage identique sur les 18 images (prévu pour un fondu enchaîné).
- Quatre vues seulement : `squelette_dos` (9), `squelette_face` (3), `muscles_dos` (4),
  `muscles_face` (3). Aucune vue de profil ni de trois quarts.
- Pose anatomique détendue : bras le long du corps, légèrement écartés (~10–15°),
  mains en pronation neutre, tête droite. Morphologie féminine, élancée.
- Caméra frontale, focale longue (perspective quasi orthographique).

## Palette (sépia monochrome chaud)
| Élément | Couleur |
|---|---|
| Fond (papier, quasi uniforme, léger vignettage) | `#6f584a` → `#755b4e` |
| Os, lumière | `#997f6e` – `#988171` |
| Os, ton moyen | `#8d7664` |
| Os, ombre | `#5e4b3d` |
| Voile de peau (silhouette translucide) | `#806657` |
| Muscle, ton chaud | `#856451` – `#886350` |
| Muscle, lumière | `#967966` |
| Fascia / aponévroses / tendons | `#ae8f7b` |
| Brillance, cœur | `#ceb397` – `#cbb195` |
| Brillance, bord du halo | `#bca085` – `#b89b81` |

Aucun noir, aucun blanc pur, aucune couleur saturée : tout tient dans une plage de
luminance étroite (≈ 30 % à 75 %).

## Rendu des os
- Matériau mat, crayeux, sans reflet spéculaire. Modelé doux par occlusion ambiante
  (creux des côtes, foramens du sacrum, sutures du crâne).
- Pas de trait de contour net : les bords se perdent dans le fond (effet sfumato),
  les membres s'estompent davantage que le tronc (avant-bras et fémurs plus fondus).
- Grain de papier visible sur toute l'image.

## Rendu des muscles
- Teinte brun-rosé à peine plus chaude que les os ; fibres dessinées par de fines
  stries claires suivant la direction du muscle.
- Tendons, aponévrose lombaire, ligne blanche et gaine des droits en beige clair.
- Sur les vues « muscles », le squelette reste lisible par transparence (cage
  thoracique, clavicules, bassin). Visage volontairement effacé, chignon dessiné.

## Silhouette
- Enveloppe de peau translucide, plus claire que le fond de ~8 %, bord doux type
  fresnel inversé (plus dense au centre du volume qu'au contour).

## Éclairage
- Lumière diffuse venant du haut et légèrement de face, sans ombre portée.
- Contraste faible ; l'essentiel du volume vient de l'occlusion, pas d'une source dure.

## Effet de brillance des zones
- Couleur : crème doré `#ceb397` au cœur, `#bca085` au bord ; jamais blanc.
- Deux composantes superposées :
  1. les structures de la zone (vertèbres, sacrum, ailes iliaques, muscles) sont
     éclaircies d'environ +25 à +30 % de luminance, en gardant leur modelé ;
  2. un halo flou, large (rayon ≈ 6–10 % de la hauteur d'image), à décroissance
     gaussienne, qui déborde des structures et se fond dans le fond.
- Le reste du corps n'est pas assombri de façon marquée : il reste tel quel, ou très
  légèrement en retrait.
- Selon l'image, le halo suit une forme (colonne cervicale : fuseau vertical ;
  bassin : nappe horizontale ; sciatique : nappe du bassin + traînée descendant dans
  la cuisse gauche du sujet) ou forme des taches rondes diffuses (épaules, poignets,
  hanches sur « articulations », « seniors », « sportifs »).

## Traduction 3D prévue
- Os : `MeshStandardMaterial` rugosité 1, métal 0, couleur `#93796a`, AO cuite dans
  les couleurs de sommets. Muscles : même base, `#876452`, stries par normal map légère.
- Peau : coque translucide avec opacité pilotée par un terme fresnel.
- Lumières : hémisphérique (ciel `#b39a86`, sol `#5e4b3d`) + directionnelle faible.
- Fond et grain : CSS (couleur + texture), canvas transparent ; brume sur les membres.
- Brillance : émissif `#ceb397` sur les maillages de la zone + halo (bloom sélectif ou
  sprite additif flou), pulsation ±8 % sur 2,4 s, désactivée si
  `prefers-reduced-motion`.
