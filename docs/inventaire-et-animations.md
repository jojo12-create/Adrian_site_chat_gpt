# Inventaire de la démo et plan d'animation (V3)

Le brief « Brief Client Adrian Rodriguez Ostéopathe » est **introuvable** : il n'est ni dans les dépôts, ni sur le disque, ni dans les artifacts claude.ai. L'inventaire s'appuie sur la démo (16 pages relues) et sur le site officiel.

## 1. Inventaire exhaustif de la démo → couverture en V3

### Catégories de patients (7)
| Démo | V3 | Illustration animée |
|---|---|---|
| Nouveau-nés | `/osteopathie/nourrissons/` | ✅ symbole au pinceau, en relief |
| Enfants & adolescents | `/osteopathie/enfants-adolescents/` | ✅ symbole au pinceau, en relief |
| Femmes enceintes | `/osteopathie/femme-enceinte/` | ✅ symbole au pinceau, en relief |
| Adultes & quotidien | `/osteopathie/adultes/` | ✅ symbole au pinceau, en relief |
| Seniors | `/osteopathie/seniors/` | ✅ symbole au pinceau, en relief |
| Sportifs (« Ostéopathie du sport ») | `/osteopathie/sportifs/` | ✅ symbole au pinceau, en relief |
| Mobilité & équilibre | `/osteopathie/mobilite-equilibre/` | ✅ symbole au pinceau, en relief |

### Troubles (démo + site officiel) (7)
| Source | V3 | Illustration animée | Zone 3D |
|---|---|---|---|
| Tensions cervicales (démo), cervicales (officiel) | `/osteopathie/cervicalgie/` | ✅ symbole au pinceau, en relief | Cervicales |
| Douleurs entre les omoplates (officiel) | `/osteopathie/dorsalgie/` | ✅ symbole au pinceau, en relief | Dorsales |
| Mal de dos (démo), lombaires (officiel) | `/osteopathie/lombalgie/` | ✅ symbole au pinceau, en relief | Lombaires |
| Sciatiques (officiel) | `/osteopathie/sciatique/` | ✅ symbole au pinceau, en relief | Sacrum & bassin |
| Entorses, tendinites, arthrose (officiel) | `/osteopathie/articulations/` | ✅ symbole au pinceau, en relief | — |
| Stress (officiel et démo) | `/osteopathie/stress-tensions/` | ✅ symbole au pinceau, en relief | — |
| Troubles digestifs (officiel) | `/osteopathie/troubles-digestifs/` | ✅ symbole au pinceau, en relief | — |

### Sections et pages
| Démo | V3 |
|---|---|
| Hero « Retrouvez votre liberté de mouvement » | Hero en profondeur (accueil) |
| Trustbar : À l'écoute · Explications claires · Du quotidien au sport | Bandeau « 3 engagements » |
| Intro « Votre corps a son histoire. Votre accompagnement aussi. » | Section intro (reprise) |
| « Un accompagnement pour chacun » (7 profils) | Section catégories : 7 patients + 7 troubles |
| Bandeau sport « Votre pratique évolue » + boxeurs | Bandeau sport (avant l'effort / saison / récupération, boxe) |
| Aperçu des avis | Défilant d'avis + page `/avis/` (mosaïque) |
| « On fait le point ensemble ? » | Bandeau final de RDV (chaque page) |
| Ressources : 3 articles | `/conseils/` + 3 articles (première consultation, mal de dos, récupération sportive) |
| Page Approche + page Cabinet | `/cabinet/` (approche, valeurs, galerie, formation) |
| Page Sport (disciplines, terrain, préparation) | Enrichie dans `/osteopathie/sportifs/` |

**Résultat : 0 catégorie manquante, 14 symboles sur 14.**

### Symboles (fournis le 16/11/2026)
Les 14 symboles au pinceau fournis (`assets/raw/symboles/`, vert encre `#1d3526` + accent terracotta `#b35941`) remplacent les illustrations au trait de la première V3. Tracés repris sans retouche, réunis par `npm run symbols` dans un seul fichier `site/public/images/symboles.svg` (63 Ko, 21 Ko compressé, mis en cache pour tout le site).

## 2. Plan d'animation par section

| Section | Effet | Technique |
|---|---|---|
| Hero | Titre révélé mot par mot (desktop), portrait en arche qui se dévoile, halos en profondeur qui suivent la souris, portrait incliné en 3D, anneaux dorés qui se tracent, forme organique qui se transforme, sortie en parallaxe | CSS + GSAP `quickTo` + ScrollTrigger + morphing SVG |
| 3 engagements | Apparition échelonnée | GSAP ScrollTrigger.batch |
| Intro | Apparition, soulignement dessiné | GSAP + CSS |
| Catégories (14 cartes) | Symbole au pinceau en relief : calques empilés en profondeur (ombre, tranche de l'encre, encre, accent terracotta) sur un médaillon ; l'encre est posée d'un coup de pinceau à l'entrée, l'accent se dépose ensuite ; rotation lente dans l'espace, le symbole se tourne vers la souris ; carte inclinée en 3D, reflet doré | CSS 3D (`preserve-3d`, `translateZ`, masque animé) + IntersectionObserver (pause hors écran) + GSAP `quickTo` |
| Avis | Défilant sur deux rangées opposées, pause au survol, au focus et par bouton | CSS |
| **Colonne 3D** | Squelette procédural ; rotation pilotée par le défilement et le glisser ; zones survolables et cliquables, surbrillance dorée pulsée et lumière ciblée ; cage thoracique holographique ; poussière dorée ; flottaison | Three.js chargé en différé, raycasting, ARIA tabs |
| Séance en 4 temps | Section épinglée à défilement horizontal, photos qui se dévoilent | ScrollTrigger `pin` + `containerAnimation` |
| Sport | Parallaxe photo, bouton magnétique | GSAP |
| Chiffres | Compteurs animés (chiffres réels uniquement) | GSAP |
| Tarif | Carte inclinée en 3D avec reflet | GSAP `quickTo` |
| Accès | Carte Google au clic | JS |
| Conseils | Cartes illustrées inclinables | idem catégories |
| FAQ | Ouverture animée en hauteur | GSAP |
| Bandeau final | Dégradé qui dérive | CSS |
| Global | Défilement fluide, curseur personnalisé, boutons magnétiques, transitions de page, menu mobile en cercle, « axe » doré de progression | Lenis, GSAP, View Transitions, CSS |

**Mouvement réduit :** symboles affichés d'emblée et immobiles (le relief reste visible), colonne 3D statique (toujours pilotable par les boutons), pas de Lenis, de curseur, de défilant ni de transitions.
**Mobile :** symboles sans calques de tranche, 3D allégée (environ 2× moins de polygones, sans côtes, contours ni particules, densité de pixels limitée à 1,5), titre affiché sans délai.

## 3. Colonne vertébrale 3D : détails
- **Anatomie :** 7 cervicales (épineuses bifides), 12 dorsales (épineuses très inclinées, côtes), 5 lombaires (épineuses horizontales), disques intervertébraux, sacrum (5 pièces soudées), coccyx (4 pièces), bassin (ailes iliaques, cotyles, anneau pubien), base du crâne (condyles + dôme filaire). Lordose cervicale, cyphose dorsale, lordose lombaire et cyphose sacrée respectées.
- **Matériaux :** os ivoire, contours dorés fins, disques dorés lumineux, éléments holographiques filaires, lumière dorée ciblée sur la zone active.
- **Performance :** géométrie procédurale (0 fichier modèle), fichier JS séparé de 128 Ko gzip chargé après `load` et à l'approche de la section, rendu suspendu hors écran ou onglet masqué.
- **Accessibilité :** zones, textes et liens en HTML (indexables), onglets ARIA au clavier, description du canvas, colonne SVG de secours sans WebGL.
