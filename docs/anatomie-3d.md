# Intégration du prototype anatomique

Page de validation : `/anatomie-3d/`, `noindex, nofollow`, exclue du sitemap.
Base du portage : `main` au commit `cd96ca2b21573186458ab7046d88de7d11186388`.

## Organisation

- `content/anatomie-3d.mjs` : l'objet `ZONES3D` du prototype, inchangé.
- `content/anatomie-page.mjs` : page générée avec l'en-tête et le pied communs ;
  seulement les champs nécessaires de `content/categories.mjs` sont sérialisés.
- `site/src/scripts/anatomie-3d/load.js` : observation de visibilité et première
  peinture du poster, puis import dynamique de l'interface.
- `interface.js` : sélection, couches, tiroir, panneau et parcours de 4,8 secondes.
- `engine.js` : Three.js et GSAP npm, shaders et géométrie du prototype.
- `fallback.js` : illustrations et masques lumineux du prototype, chargés
  seulement si WebGL 2 ou le chargement du modèle échoue.
- `site/public/anatomie-3d/` : modèle binaire et illustrations extraites sans
  réencodage. Les cartes de profondeur 2D inutilisées ne sont pas transportées.

Aucun téléchargement du moteur, de GSAP ou du modèle avant la visibilité du
visualiseur ; aucune ressource anatomique supplémentaire sur les autres pages.
Le poster est présent dans le HTML avec ses dimensions, et les liens des sept
motifs restent utilisables sans JavaScript. Le corps de la page est encadré par
le gabarit commun ; aucun CDN ni appel Google Fonts n'est nécessaire.

## Fidélité et adaptations d'intégration

Comparaison avec les pièces jointes : `ZONES3D`, les trois sources GLSL et les
octets du modèle sont identiques. Les couleurs, les matériaux, les coefficients
de brillance, les angles, l'ordre des étapes et les textes provisoires sont conservés.

Les différences intentionnelles sont :

- Source Serif 4 / Figtree locales au lieu de Fraunces / Manrope distantes,
  comme demandé ; leur métrique change légèrement les retours à la ligne.
- En-tête, H1 et pied du site ; CSS limité au visualiseur. Sur mobile, le tiroir
  ouvert est limité en hauteur pour préserver la zone de manipulation sous
  l'en-tête. Les raccourcis flottants de RDV sont masqués sur cette page ; les
  liens de l'en-tête, du panneau et du pied restent disponibles.
- Liens « En savoir plus » internes et compatibles avec `BASE` en sous-dossier ;
  URL RDV issue de `content/site.mjs`.
- Chargement binaire, images 2D différées, messages de repli sans détails techniques.
- En mouvement réduit, rendu seulement si la caméra ou l'état change ; la
  mise à jour des contrôles est conservée. Hors écran / onglet caché, le rendu
  est suspendu. Les images produites par les shaders restent identiques.
- Désélection / réinitialisation : mise à jour des couches pour enlever les
  ligaments du parcours Articulations. Le prototype omettait cet appel.
- Suppression du `aria-label` du lien de marque, qui remplaçait son texte visible
  par un libellé différent : le nom accessible vient maintenant de son contenu,
  avec « Accueil » en titre. Aucun changement visuel.

## Vérification reproductible

```sh
npm ci
npx playwright install chromium  # ou CHROMIUM_PATH=/chemin/chromium
npm run build
npm test                       # PHP CLI requis, mail intercepté localement
npm run test:anatomie
node scripts/compare-lighthouse.mjs http://127.0.0.1:4174 http://127.0.0.1:4173
```

Le dernier script compare une version de référence et l'intégration sur cinq
gabarits existants : accueil, hub ostéopathie, lombalgie, contact, mentions.
Les captures et rapports complets des suites sont écrits dans `qa-shots/`.
Un échec d'accessibilité, de JS, de H1, de débordement ou de 404 fait désormais
échouer `npm test` au lieu de seulement apparaître dans son rapport.

Le contrôle du modèle vérifie le SHA-256, les limites des buffers, tous les
indices des triangles et les groupes / articulations référencés. La suite
navigateur couvre les sept motifs, toutes les étapes, les quinze combinaisons
de couches, le zoom suivi d'une sélection, le clic sur le corps, l'avance et
l'arrêt des parcours, le mouvement réduit, les tiroirs 390/320 px, WebGL absent,
échec HTTP du modèle, le mode sans JS et la négociation gzip HTTP.

## Limites à conserver dans la revue

Le prototype n'avait jamais été validé par son auteur dans un navigateur ;
seules les captures du propriétaire et des rendus calculés avaient servi de
contrôle. Cette intégration a été comparée au prototype dans Chromium.

**Le critère « aucun éclat sombre ni trou dans les muscles » n'est pas acquis.**
De petits triangles sombres / discontinuités se voient sur les trapèzes et le
cuir chevelu, aussi dans le prototype d'origine. Les captures comparatives
ci-dessous les montrent. Le modèle et les matériaux n'ont pas été retouchés pour
masquer ce défaut : une correction du modèle nécessiterait une validation séparée.

Le modèle masculin diffère des illustrations féminines du site. Les associations
motif → structures et les libellés d'étapes, notamment « Coiffe des rotateurs… »,
sont **à valider par Adrian**. Aucun texte médical nouveau n'a été créé.

Le binaire pèse 8 785 070 octets, gzip 4 431 731 octets (niveau par défaut Node).
La compression est configurée pour Apache/LiteSpeed et le serveur local ; les
en-têtes réels de l'hébergement final restent à vérifier. GitHub Pages ignore
`.htaccess`. Le `.blend` et l'index `tree.pkl` nécessaires à la reconstruction
ne font pas partie des fichiers fournis : voir le [README Python](../scripts/anatomie-3d/README.md).

Les profils mobiles ont été émulés dans Chromium avec rendu WebGL logiciel ;
cela ne constitue pas un test de fluidité sur un téléphone physique. Voir aussi
les [licences et sources](licences-3d.md).

## Captures de revue

Les captures et les résultats mesurés sont ajoutés après la dernière suite QA.
