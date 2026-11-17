# Sources, licence et adaptations du visualiseur

## Modèle

Le modèle anatomique provient de **Z-Anatomy**, d'après **BodyParts3D © DBCLS**.

- Projet : <https://www.z-anatomy.com/> ; modèles : <https://github.com/Z-Anatomy/Models>.
- BodyParts3D : <https://lifesciencedb.jp/bp3d/>.
- Licence du modèle adapté fourni : **Creative Commons Attribution – Partage
  dans les mêmes conditions 4.0 International (CC BY-SA 4.0)** :
  <https://creativecommons.org/licenses/by-sa/4.0/> ; texte intégral :
  <https://creativecommons.org/licenses/by-sa/4.0/legalcode.fr>.
- Fichier distribuable : [`model.bin`](../site/public/anatomie-3d/model.bin),
  servi à `/anatomie-3d/model.bin`. Le crédit et le lien de licence restent
  affichés dans le visualiseur, y compris en mode 2D.

La version exacte du `.blend` source n'est pas précisée dans les pièces jointes.
Le modèle binaire transmis, qui fait référence pour cette intégration, est
identifié par SHA-256 dans le README des scripts.

Adaptations présentes dans le prototype fourni : sélection des structures,
exclusions anatomiques volontaires, simplification des maillages et conversion
des courbes en tubes, changement de repère, groupes anatomiques et repères
d'articulations, occlusion et attributs par sommet, positions et indices
quantifiés sur 16 bits avec codage différentiel. Présentation en sépia, couches,
halos et correspondances illustratives avec les motifs de consultation.

Adaptation effectuée lors de ce portage : décodage du conteneur JSON/base64 en
binaire **sans modification des octets du modèle**, transport HTTP compressé,
séparation du code et des ressources. Le modèle et ses adaptations restent
partageables sous CC BY-SA 4.0. Cette licence ne s'étend pas au reste du site.

Les quatre illustrations et sept masques lumineux du repli 2D sont extraits
sans réencodage du prototype joint ; ce sont les illustrations existantes du
site. Leur provenance distincte ne doit pas être confondue avec celle du modèle.

## Logiciels et polices

Three.js 0.171 : MIT. GSAP 3.12.5 : cœur gratuit sous la licence standard
GreenSock distribuée avec le paquet npm (`node_modules/gsap/LICENSE`) ; aucun
plugin Club, abonnement ou service payant utilisé. GSAP est empaqueté localement,
sans CDN. L'ajout a été choisi par le propriétaire pour conserver les animations.

Source Serif 4 et Figtree : fichiers WOFF2 déjà embarqués dans le site,
licence SIL Open Font License. Aucun appel à Google Fonts.

## Validation éditoriale

Associations motif → structures et libellés d'étapes (dont « Coiffe des
rotateurs… ») : **à valider par Adrian**. Ce sont des indications illustratives,
pas une carte diagnostique. Modèle masculin, contrairement aux illustrations
féminines. La mention « Information générale, ne remplace pas une consultation »
est conservée dans chaque panneau.
