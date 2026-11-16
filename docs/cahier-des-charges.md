# Cahier des charges : arborescence, mots-clés, direction artistique, animations

## Objectif et parcours
- **Objectif :** des rendez-vous. Doctolib est l'action principale, le téléphone et WhatsApp les actions secondaires, et le formulaire de rappel le filet de sécurité.
- **Parcours de l'accueil :** accroche (hero) → preuve (avis, chiffres) → besoin (« Où ça coince ? ») → déroulé (4 temps) → offre (tarif) → accès → FAQ → RDV.
- **Freins traités :**
  - *distance* : bloc Accès, parking, plain-pied, communes, carte et fiche Google ;
  - *besoin* : « Où ça coince ? », cas concrets « Vous vous reconnaissez ? », signes d'alerte ;
  - *prix* : carte tarif, page Tarifs, remboursement mutuelle.

## Arborescence (5 entrées de menu)

| Menu | URL | Mot-clé principal | Secondaires |
|---|---|---|---|
| Accueil | `/` | ostéopathe Villefontaine | ostéopathe Nord-Isère · ostéopathe L'Isle-d'Abeau · cabinet ostéopathie 38090 · ostéopathe Bourgoin-Jallieu |
| Ostéopathie | `/osteopathie/` | ostéopathie Villefontaine | motifs de consultation · quand consulter un ostéopathe · ostéopathe ou kiné |
| ↳ Mal de dos | `/osteopathie/mal-de-dos/` | ostéopathe mal de dos Villefontaine | lombalgie · sciatique · dos bloqué · travail assis |
| ↳ Nuque & épaules | `/osteopathie/nuque-cervicales/` | ostéopathe cervicales Villefontaine | torticolis · nuque raide · maux de tête de tension · épaules |
| ↳ Sportifs | `/osteopathie/sportifs/` | ostéopathe du sport Villefontaine | récupération · prévention des blessures · compétition |
| ↳ Bébé & enfant | `/osteopathie/bebe-enfant/` | ostéopathe bébé Villefontaine | nourrisson · torticolis bébé · enfant · croissance |
| ↳ Grossesse | `/osteopathie/femme-enceinte/` | ostéopathe femme enceinte Villefontaine | sciatique grossesse · bassin · après accouchement |
| ↳ Seniors | `/osteopathie/seniors/` | ostéopathe senior Villefontaine | arthrose · mobilité · équilibre |
| Le cabinet | `/cabinet/` | Adrian Rodriguez ostéopathe | ostéopathe diplômé ATSA · avis ostéopathe Villefontaine · cabinet Les Ravinelles |
| Tarifs & infos | `/tarifs/` | tarif ostéopathe Villefontaine | prix séance ostéopathie · remboursement mutuelle · déroulé consultation · parking |
| Contact | `/contact/` | rendez-vous ostéopathe Villefontaine | ostéopathe Doctolib · ostéopathe Saint-Quentin-Fallavier · adresse cabinet |
| Pied de page | `/mentions-legales/`, `/confidentialite/`, `404.html` | — | — |

**Choix SEO :**
- *URL en dossiers* (`/osteopathie/mal-de-dos/`) : lisibles et hiérarchiques, elles alimentent le fil d'Ariane.
- *Six pages par motif :* elles ciblent les recherches à forte intention sans dépasser 5 entrées de menu.
- *Redirections 301* des anciennes pages dans `.htaccess`, pour conserver le référencement acquis.
- *Données structurées :* `MedicalBusiness` + `LocalBusiness`, `Person`, `WebPage`, `BreadcrumbList`, `FAQPage` (pages clés) et `Service` (pages motif). Le type `Physician` est volontairement écarté : il est réservé aux médecins.
- *Canonical* vers `https://osteovillefontaine.fr`, ainsi que les balises `geo.*`, `areaServed` (Villefontaine + 5 communes + Nord-Isère), la carte Google et le lien vers la fiche Google Business Profile.

## Direction artistique : « L'axe »
Le logo d'Adrian est un bonsaï dont le tronc est une colonne vertébrale. Le site en fait son fil conducteur :
- une colonne dorée qui se remplit au fil de la lecture (sur grand écran) ;
- un sélecteur vertébral interactif ;
- des portraits en arche.

La mise en page, la structure et les composants n'ont rien en commun avec le site officiel (gabarit Bootstrap d'offres d'emploi) ni avec la démo (hero partagé et carrousels).

| | Choix | Raison |
|---|---|---|
| Couleurs | forêt `#243c2f` (logo), vert `#3e5e42`, or `#be9b4e`, olive `#5f5e34`, encre `#161515` (site officiel), papier `#faf8f3` | identité conservée ; papier chaud plutôt que le bleu glacier `#f0f8ff` du gabarit, qui jurait avec le vert |
| Titres | **Fraunces** (variable, italique pour l'accent) | serif expressif et doux, élégant et calme ; prolonge l'italique de la démo |
| Texte | **Manrope** | sans-serif très lisible en petite taille |
| Formes | arches, rayons 10 / 22 / 30 px, boutons pilule | douceur, rappel du pot du bonsaï |
| Contraste | AA vérifié (axe : 0 violation) | l'or n'est jamais du texte sur fond clair |

## Plan d'animations (GSAP + ScrollTrigger + Lenis)

| Animation | Où | Technique |
|---|---|---|
| Défilement fluide | partout | Lenis synchronisé avec ScrollTrigger |
| Titre révélé mot par mot | H1 de chaque page | CSS (texte présent dans le HTML : LCP préservé) |
| Portrait en arche qui se dévoile | hero | `clip-path` en CSS |
| Forme organique qui se transforme | fond du hero | morphing SVG (GSAP, chemins de même structure) |
| Parallaxe | photos | `yPercent` + zoom de l'image interne, au défilement |
| Apparitions | blocs | montée + fondu, par lots, une fois (opacité seule : reste accessible au clavier) |
| Section épinglée horizontale | « Une séance en 4 temps » (≥ 1024 px) | `pin` + `containerAnimation`, photos qui se dévoilent |
| Compteurs | chiffres réels uniquement | tween numérique au défilement |
| Défilant d'avis | accueil | CSS, 2 rangées opposées, pause au survol, au focus et par bouton |
| Colonne vertébrale qui s'allume | « Où ça coince ? » | onglets ARIA + vertèbres en cascade |
| Aperçu photo qui suit le curseur | index des motifs | `quickTo` |
| Curseur personnalisé, boutons magnétiques, inclinaison 3D (6°) | souris uniquement | `quickTo` |
| Dégradé animé | bandeau final | CSS |
| Menu mobile en cercle | mobile | `clip-path` en CSS |
| Transitions de page | navigation | View Transitions natives (CSS) |
| Progression de lecture | barre (mobile) / « axe » doré (desktop) | `scale` au défilement |

**Mouvement réduit :** Lenis, GSAP, le défilant, le curseur et les transitions sont coupés, et tout le contenu reste visible.
