# Audit : Adrian Rodriguez, ostéopathe à Villefontaine (38090)

Date : 15/11/2026. Périmètre : site officiel https://osteovillefontaine.fr/ (accueil + 6 pages « services ») et démo https://adrian-rodriguez.hatchable.site/ (projet Hatchable `proj_pyXI5Hp8gkU8`, v36, 44 fichiers, 0 fonction, aucun log).

Méthode : le HTML et les CSS ont été récupérés en direct côté serveur (le conteneur ne pouvait pas joindre les deux domaines), puis mesurés avec le même script pour les deux sites : balises, Hn, images, poids des ressources, liens. **Le LCP réel n'a pas été mesuré** (le test navigateur a été refusé), les notes de performance s'appuient donc sur le poids et le type des ressources.

---

## 1. Identité imposée (relevée sur le site officiel)

| Élément | Valeur |
|---|---|
| Logo | `images/1.jpg` (JPEG 60 Ko, sans alt), servant aussi de favicon. La démo en a une version WebP (`adrian-logo.webp`, 2 Ko) |
| Couleur principale | `#3e5e42` (vert forêt) |
| Couleur secondaire | `#5f5e34` (olive) |
| Accent / boutons | `#be9b4e` (or) |
| Texte foncé | `#161515` · texte courant `#717275` · fond de section `#f0f8ff` · bordure `#e9eaeb` |
| Police | **League Spartan** (100/300/400/600/700), une seule famille, 20 px pour le texte |
| Rayons | 100 / 30 / 10 px |
| Gabarit | Tooplate 2134 « Gotto Job » (Bootstrap 5), un modèle d'offres d'emploi, d'où les classes `job-*` |

**NAP** (recoupé avec lemedecin.fr, Fresha et Bottin) :
- Nom : Adrian Rodriguez, ostéopathe
- Adresse : 1 rue Louis Ganel, bâtiment B, Les Ravinelles, 38090 Villefontaine (absente du site officiel en texte : seule la carte l'indique)
- Téléphone : +33 6 09 22 49 38 · e-mail : adrian.osteo38@gmail.com
- RDV : https://www.doctolib.fr/osteopathe/villefontaine/adrian-rodriguez · WhatsApp
- Réseaux : instagram.com/adrianosteo · LinkedIn adrian-rodriguez-885029bb
- Fiche Google : place_id `ChIJu848JRDT9EcRTB1imlNjPtU`
- Accès (lemedecin.fr) : rez-de-chaussée, entrée accessible, parking gratuit

**Contenus réels** : diplômé de l'école ATSA ; « 7 jours sur 7 » ; douleurs articulaires, musculaires, digestives, stress ; accompagnement des sportifs. Six publics : nourrissons, enfants/ados, adultes, grossesse, seniors, sportifs (chaque page propose Description, Bienfaits et Quand consulter). Cinq avis Google cités en entier (Elodie Haon, Martin Jzql, Flavie Beal, Nozzha Hamouda, Ophélie Robert, 5★ chacun). La démo en cite six autres (Quentin Vivancos, Melody Becquelin, Théo Reynard, K-ro, Chloé de Fraiteur, Jessica C).

**Absents partout** : tarifs, durée de séance, horaires fiables, ADELI/RPPS, SIRET, mentions légales, politique RGPD.

**Horaires contradictoires** : le site dit « 7j/7 », lemedecin.fr « lun.–ven. 9 h–13 h / 14 h–22 h » et Doqi « jeu.–sam. 9 h–22 h ».

---

## 2. Notes par axe (/10)

| Axe | Site officiel | Démo Hatchable |
|---|---|---|
| SEO technique | **2** | **6** |
| SEO local | **3** | **5** |
| Performance | **3** | **6** |
| Accessibilité | **3** | **6** |
| UX / conversion | **4** | **6** |
| Design (fidélité + premium) | **4** | **4** |
| Mobile-first | **4** | **6** |
| **Moyenne** | **3,3** | **5,6** |

---

## 3. Site officiel : constats et corrections

### SEO technique (2/10)
| Défaut | Gravité | Correction |
|---|---|---|
| Même `<title>` « Ostéopathe Villefontaine » (24 car.) sur toutes les pages | critique | Un titre unique par page, de 60 caractères maximum, avec la ville |
| `meta description` vide partout | critique | Une description de 155 caractères maximum, orientée bénéfice et RDV |
| Pas de canonical, `robots.txt` absent, `sitemap.xml` en 404 | critique | Ajouter les trois |
| Aucun JSON-LD ni balise Open Graph / Twitter | critique | Physician + LocalBusiness, FAQPage, BreadcrumbList, OG/Twitter avec image |
| 20 images sur 21 sans `alt` (accueil) | important | Un `alt` descriptif, ou `alt=""` pour les images décoratives |
| Avis en `<h4>`, 12 H4 sur l'accueil, hiérarchie cassée | important | Avis en `<blockquote>` ; Hn = structure seulement |
| Lien footer « Mentions légales » → 404 ; « nourissons.html » → 404 ; domaine mal écrit sur sportifs.html (« osteo-villefontaine.fr ») | important | Corriger les liens et créer les pages |
| Fil d'Ariane visuel sur les sous-pages, mais sans balisage | mineur | Ajouter BreadcrumbList |

### SEO local (3/10)
| Défaut | Gravité | Correction |
|---|---|---|
| Adresse et code postal absents en texte (seulement dans l'iframe Maps) | critique | NAP complet en texte dans le pied de page et la page contact, identique au balisage |
| Pas d'horaires, et trois versions différentes sur les annuaires | important | Une seule version, alignée avec Google Business Profile |
| Pas de lien vers la fiche Google pour lire les avis (seulement un lien « laisser un avis » de 600 caractères) | mineur | Lien court vers la fiche via son place_id |
| Zone desservie non dite (L'Isle-d'Abeau, La Verpillière, Saint-Quentin-Fallavier, Bourgoin-Jallieu) | important | Une phrase « Accès et zone » + `areaServed` |

### Performance (3/10)
| Défaut | Gravité | Correction |
|---|---|---|
| Environ 480 Ko de CSS/JS bloquants (Bootstrap 214 Ko, Bootstrap Icons 79, jQuery 84, Bootstrap JS 58, Owl 43) pour une page vitrine | critique | CSS maison d'environ 15 Ko, JS minimal, sans dépendance |
| Photos JPEG de 124 à 163 Ko, pas de WebP/AVIF, 0 `loading="lazy"`, 18 images sur 21 sans width/height | important | AVIF/WebP + `srcset`, lazy sous la ligne de flottaison, dimensions explicites |
| Iframe Google Maps chargée dans le pied de page de chaque page | important | Façade statique (image + lien), carte uniquement sur la page contact, au clic |
| 5 graisses League Spartan chargées | mineur | 2 à 3 graisses, `font-display: swap`, preconnect |

### Accessibilité (3/10)
| Défaut | Gravité | Correction |
|---|---|---|
| `user-scalable=no, maximum-scale=1` : zoom bloqué | critique | Supprimer |
| Boutons or `#be9b4e` avec texte blanc : contraste 2,6:1 (AA exige 4,5:1) | critique | Texte foncé `#161515` sur or (6,9:1) ou bouton vert `#3e5e42` / blanc (7,3:1) |
| Icônes sociales sans nom accessible, `aria-label="Toggle navigation"` en anglais | important | `aria-label` en français |
| Carrousel Owl sans pause ni contrôle clavier | important | Grille statique |

### UX / conversion (4/10)
| Défaut | Gravité | Correction |
|---|---|---|
| Le bouton du hero mène à « Mes Services ! », pas au RDV | critique | « Prendre rendez-vous » dans le hero, visible sans défiler |
| Aucun prix, durée ou déroulé de séance (frein « prix ») | critique | Page Tarifs & séance |
| Aucune réponse au frein « distance » (parking, accès, communes) | important | Bloc Accès |
| Aucune réponse au frein « ai-je vraiment besoin ? » sur l'accueil | important | Bloc « Quand consulter » + FAQ |
| Points forts à garder : téléphone dans la nav, bouton Doctolib flottant, WhatsApp, 5 vrais avis | — | Conserver |

### Design (4/10) et mobile (4/10)
Modèle d'offres d'emploi réutilisé : vignettes de services en cartes « job », points d'exclamation dans les titres, aucun caractère premium. Bootstrap reste responsive, mais le zoom est bloqué et l'iframe fait 350 px de large en dur.

---

## 4. Démo Hatchable : constats et corrections

### SEO technique (6/10)
| Défaut | Gravité | Correction |
|---|---|---|
| JSON-LD présent uniquement sur l'accueil (MedicalBusiness, sans géo, horaires ni `priceRange`) ; pas de FAQPage ni de BreadcrumbList | important | Physician + LocalBusiness complet, FAQPage sur les pages qui ont une FAQ |
| Pas d'`og:image`, pas de Twitter Card ; OG incomplet sur les pages publics (2 balises) | important | OG/Twitter complets |
| Titres trop longs : conseil-mal-de-dos (76 car.), nourrissons (61) ; meta d'approche.html à 162 car. | mineur | Raccourcir |
| Canonical pointé vers `*.hatchable.site` | important (à la mise en ligne) | Canonical vers le domaine définitif |
| `source-original.html` publique (copie du site officiel = contenu dupliqué) | important | Supprimer de ma version |
| Mentions légales absentes (404) | critique (légal) | Créer la page |

### SEO local (5/10)
Adresse présente dans le JSON-LD et sur certaines pages, « 38090 » dans le title (bien). Pas d'horaires, pas de carte, pas de zone desservie, pas de NAP complet en pied de page.

### Performance (6/10)
| Défaut | Gravité | Correction |
|---|---|---|
| Image du hero en `background-image` CSS, en diaporama de 3 images : le navigateur ne la découvre pas tôt (LCP retardé) | important | `<img>` du hero en `fetchpriority="high"`, sans diaporama |
| 3 feuilles CSS qui se surchargent (style 23 Ko + polish 16 + brand 12), avec des `!important` | important | Une feuille unique |
| 3 familles de polices (DM Sans, Manrope, Fraunces) | important | 2 familles maximum, dont League Spartan |
| Photo chargée directement depuis ledauphine.com | critique | Voir « Légal » ci-dessous |
| width/height manquants sur 4 images sur 6 (cabinet, sport) | mineur | Ajouter |

### Accessibilité (6/10)
Zoom autorisé, `aria-expanded` sur le menu, `aria-label` sur les cartes : c'est bien. Restent un menu « ☰ » en glyphe, deux carrousels à boutons et un texte d'eyebrow à 10 px.

### UX / conversion (6/10)
| Défaut | Gravité | Correction |
|---|---|---|
| « 5,0/5 · Avis Google » affiché sans nombre d'avis ni source vérifiable | critique (déontologie, pas d'invention) | Afficher la note seulement si elle est fournie, avec lien vers la fiche |
| Navigation de 7 liens, plus un menu déroulant de 7 publics | important | 5 entrées maximum |
| Pas de tarifs, d'horaires, d'accès ni de formulaire | critique | Pages Tarifs et Contact |
| Points forts : CTA Doctolib dans le header et le hero, CTA répété en bas, vrais avis | — | Conserver |

### Design (4/10)
Couleurs dérivées (`#254b37` et `#d3a755` au lieu de `#3e5e42` et `#be9b4e`), polices remplacées : **la charte du site officiel n'est pas respectée**. Rendu soigné, mais générique (éléments décoratifs, eyebrows).

### Légal / déontologie
- **Critique** : `sport-band` charge directement une photo du Dauphiné Libéré (« jordan-rodriguez-pret-pour-son-9-e-combat… ») : droits d'auteur non acquis, et la personne photographiée n'est pas Adrian. À retirer.
- Aucun mentions légales ni RGPD sur les deux sites (obligatoire pour un professionnel de santé : identité, ADELI/RPPS, hébergeur).

---

## 5. Concurrence (Villefontaine)

Aucune URL de concurrent n'ayant été fournie, j'ai analysé ce que Google remonte.

| Concurrent | Présence | Points forts | Mots-clés et structure |
|---|---|---|---|
| **Emma Jungen, ostéopathe D.O.** (Google Sites `cabinetdostopathie`, cabinet rue Serge Mauroit) | Site d'une page | FAQ, « Pour qui prendre rdv ? », segments sportif / pédiatrique et obstétrique, CTA final | Consultation ostéopathique, ostéopathie pour sportif, ostéopathie pédiatrique et obstétrique |
| **Gwladys Raffier, ostéopathe D.O.** (210 av. de la République) | Annuaires seulement (lemedecin, Bottin, Fresha) | Diplôme ISOstéo Lyon affiché, horaires lun.–ven. clairs, accès rez-de-chaussée | Ostéopathie périnatale, de l'enfant, structurelle |
| Cabinet Ikébana, Emilie Marey | Annuaires seulement | — | — |

**À retenir** : aucun concurrent local n'a de site premium et optimisé. Les points à reprendre (FAQ, « pour qui », horaires clairs) sont simples, et personne n'affiche de tarifs : c'est un avantage facile à prendre.

## 6. Instagram
Non consulté : instagram.com exige une connexion et n'est pas lisible par un outil automatique. Seul le compte @adrianosteo a été vérifié (il est lié depuis les deux sites).
