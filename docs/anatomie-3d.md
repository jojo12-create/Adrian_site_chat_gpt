# Intégration du prototype anatomique

Page de validation : `/anatomie-3d/`, `noindex, nofollow`, exclue du sitemap.
Base du portage : `main` au commit `cd96ca2b21573186458ab7046d88de7d11186388`.

## Section de l'accueil et du hub Ostéopathie

Le visualiseur remplace l'ancienne section « Votre colonne, vertèbre par vertèbre »
sur `/` et `/osteopathie/` (`anatomieSection()` dans `content/anatomie-page.mjs`,
même balisage que la page dédiée). Différences avec la page `/anatomie-3d/` :

- **Démarrage au clic.** Rien n'est téléchargé (moteur, GSAP, modèle de 4,4 Mo gzip)
  et aucun geste n'est capté tant que le visiteur n'a pas cliqué « Explorer en 3D »,
  un motif ou la poignée du tiroir ; ce premier clic est rejoué une fois la 3D prête.
  L'image de substitution est en `loading="lazy"`.
- **Hauteur inférieure à l'écran** (84 % de la hauteur, 780 px au plus) pour qu'il
  reste une bande de page à saisir pour défiler, la 3D captant molette et glisser.
- Les raccourcis flottants de RDV se masquent tant que le visualiseur est à l'écran.
- Titre et phrase d'introduction de la section : texte d'interface nouveau, **à valider**.
- L'ancien code de la colonne (`spine.js`, `spine3d.js`, `spine.css`) est supprimé ;
  les textes `spineZones` restent dans `content/categories.mjs` mais ne sont plus
  affichés (quatre paragraphes et leurs liens internes en moins sur ces deux pages).

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

Suites rejouées sur le commit d'intégration (Chromium, WebGL logiciel) : `npm run build`,
`npm test` (axe : 0 violation sur les 11 pages, 3 gabarits d'écran, aucune erreur JS)
et `npm run test:anatomie` passent. Résultats détaillés : [`qa-visualiseur.json`](anatomie-3d/qa-visualiseur.json).

Lighthouse mobile (performance), `main` → intégration, mêmes réglages :

| Page | Score | LCP (ms) |
|---|---|---|
| `/` | 100 → 100 | 901 → 903 |
| `/osteopathie/` | 100 → 100 | 756 → 760 |
| `/osteopathie/lombalgie/` | 100 → 100 | 757 → 761 |
| `/contact/` | 100 → 100 | 758 → 938 |
| `/mentions-legales/` | 100 → 100 | 754 → 754 |

Les écarts sont dans le bruit de mesure : l'accueil, répété quatre fois de chaque
côté, donne 100 partout (une première mesure isolée avait donné 75 côté intégration,
non reproduite). Aucune ressource du visualiseur n'est chargée par ces pages.

| Contrôle | Capture |
|---|---|
| État initial | [desktop-initial](anatomie-3d/captures/desktop-initial.png) |
| Sept motifs | [lombalgie](anatomie-3d/captures/motif-lombalgie.png) · [cervicalgie](anatomie-3d/captures/motif-cervicalgie.png) · [dorsalgie](anatomie-3d/captures/motif-dorsalgie.png) · [sciatique](anatomie-3d/captures/motif-sciatique.png) · [articulations](anatomie-3d/captures/motif-articulations.png) · [stress](anatomie-3d/captures/motif-stress-tensions.png) · [digestif](anatomie-3d/captures/motif-troubles-digestifs.png) |
| Couches seules et combinées | [squelette](anatomie-3d/captures/couches-1.png) · [muscles](anatomie-3d/captures/couches-2.png) · [nerfs](anatomie-3d/captures/couches-4.png) · [viscères](anatomie-3d/captures/couches-8.png) · [les quatre](anatomie-3d/captures/couches-15.png) |
| Contrôles après zoom | [motif choisi après zoom et rotation](anatomie-3d/captures/zoom-puis-motif.png) |
| Clic sur le modèle | [choix entre motifs](anatomie-3d/captures/choix-sur-modele.png) |
| Mobile, tiroir bas | [390 fermé](anatomie-3d/captures/mobile-390-ferme.png) · [390 ouvert](anatomie-3d/captures/mobile-390-ouvert.png) · [320 fermé](anatomie-3d/captures/mobile-320-ferme.png) · [320 ouvert](anatomie-3d/captures/mobile-320-ouvert.png) |
| Replis | [sans WebGL](anatomie-3d/captures/repli-webgl.png) · [modèle indisponible](anatomie-3d/captures/repli-model.png) · [sans JavaScript](anatomie-3d/captures/sans-javascript.png) |
| Défauts du modèle | [muscles du dos en gros plan](anatomie-3d/captures/muscles-dos-zoom.png) · [prototype d'origine](anatomie-3d/captures/prototype-muscles.png) |

La capture « muscles du dos en gros plan » montre les deux écarts au cahier de
recette, tous deux hérités du prototype (code et modèle identiques) : petits éclats
sombres près des omoplates, et enveloppe de peau encore visible en bandes claires
sur les hanches en gros plan au lieu de s'effacer complètement.
