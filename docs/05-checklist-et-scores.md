# Vérification : scores avant / après et checklist finale

Même grille que l'audit (`docs/01-audit.md`). Mesures faites sur la version déployée (Hatchable v2) par le même script que pour l'audit, plus des tests locaux Playwright + axe-core (WCAG 2.1 AA) à 1440, 390 et 320 px.

## Scores (/10)

| Axe | Site officiel | Démo Hatchable | **Ma version** | Ce qui manque pour 10 |
|---|---|---|---|---|
| SEO technique | 2 | 6 | **9** | page 404 non servie par Hatchable (URL inconnue → accueil) ; à régler chez l'hébergeur final |
| SEO local | 3 | 5 | **8** | horaires `[À FOURNIR]` (site + `openingHoursSpecification`) ; fiche Google à aligner |
| Performance | 3 | 6 | **8** | LCP non mesuré en navigateur réel (test refusé) ; estimation : ~129 Ko pour l'accueil |
| Accessibilité | 3 | 6 | **9** | non testé avec un vrai lecteur d'écran |
| UX / conversion | 4 | 6 | **8** | tarifs et horaires `[À FOURNIR]` : le frein « prix » ne sera levé qu'une fois remplis |
| Design | 4 | 4 | **8** | cadrage des vraies photos non vérifié à l'écran (photos visibles seulement sur Hatchable) |
| Mobile-first | 4 | 6 | **9** | idem photos |
| **Moyenne** | **3,3** | **5,6** | **8,4** | |

## Checklist

### SEO
- [x] 13 pages, un title unique de 60 caractères maximum (35 à 58), une meta description de 155 maximum (135 à 153), contrôlés par le build
- [x] Un seul H1 par page ; hiérarchie H1 → H2 → H3 sans saut
- [x] Canonical sur chaque page (domaine définitif)
- [x] `sitemap.xml` (13 URL) et `robots.txt`
- [x] JSON-LD `MedicalBusiness` + `LocalBusiness`, `Person`, `WebPage`, `BreadcrumbList` (pages intérieures), `FAQPage` (7 pages) : JSON valide
- [x] Open Graph (10 balises) et Twitter Card avec image
- [x] Texte alternatif sur toutes les images (0 manquant)
- [x] Fil d'Ariane visible et balisé ; maillage entre les pages par public
- [ ] Redirections 301 des anciennes URL (voir `02-cahier-des-charges.md`) : à poser à la mise en ligne
- [ ] Horaires dans le JSON-LD : dès qu'ils sont fournis

### SEO local
- [x] NAP identique partout : 1 rue Louis Ganel, bâtiment B, Les Ravinelles, 38090 Villefontaine · 06 09 22 49 38
- [x] Coordonnées géographiques, `areaServed` (Villefontaine + 5 communes voisines), lien vers la fiche Google
- [x] Bloc Accès : parking, plain-pied, itinéraire
- [ ] Horaires `[À FOURNIR]`

### Performance
- [x] 1 CSS (23 Ko) et 1 JS (5 Ko, chargé en `defer`), aucune bibliothèque (le site officiel en chargeait environ 480 Ko)
- [x] Polices auto-hébergées, variables, préchargées (52 Ko au total)
- [x] Photo du hero en AVIF de 20 Ko, préchargée en `fetchpriority="high"`, les autres en `loading="lazy"`
- [x] width/height sur toutes les images (0 manquant), aucune iframe de carte
- [ ] LCP réel à mesurer (PageSpeed Insights) une fois le site public

### Accessibilité
- [x] axe-core : 0 violation WCAG 2.1 AA sur 9 pages, à 1440 et 390 px
- [x] Contrastes vérifiés (tableau dans `03-charte-graphique.md`)
- [x] Lien d'évitement, focus visible (or, 3 px), menu au clavier (Échap, `aria-expanded`, focus déplacé)
- [x] Zoom autorisé (le site officiel le bloquait)
- [x] Formulaire : labels visibles, erreurs claires sous chaque champ (`aria-invalid`, `aria-describedby`), statut annoncé (`role=status`)
- [x] Cibles tactiles de 44 px minimum (seule exception : un lien dans le texte de la case de consentement, exempté par WCAG 2.5.8)
- [x] `prefers-reduced-motion` respecté

### UX / conversion
- [x] Bouton RDV visible sans défiler sur toutes les pages, à 1440, 390 et 320 px
- [x] Barre RDV + téléphone fixe sur mobile ; CTA répété dans un bandeau en bas de page
- [x] Preuve sociale : 6 avis Google réels cités mot pour mot, lien vers la fiche
- [x] Freins : distance (Accès), besoin (Quand consulter, pages par public, signes d'alerte), prix (page Tarifs)
- [x] Formulaire court : 4 champs + consentement, pot de miel anti-robots, enregistrement en base + e-mail
- [ ] Tarifs et horaires à remplir

### Mobile
- [x] Pas de défilement horizontal à 320, 390 et 1440 px
- [x] Menu plein écran, boutons pleine largeur, une colonne

### Déontologie et légal
- [x] Aucune promesse de guérison ; l'ostéopathie est présentée en complément du médecin, avec les signes d'alerte
- [x] Nourrisson de moins de 6 mois : attestation médicale mentionnée (décret 2007-435)
- [x] Aucun avis, chiffre ou diplôme inventé ; données manquantes en `[À FOURNIR]`
- [x] Photo du Dauphiné Libéré (droits non acquis) retirée
- [x] Mentions légales et page Confidentialité (RGPD, aucun cookie, aucun traceur)
- [ ] ADELI/RPPS, SIRET, hébergeur définitif, durée de conservation à valider

## Données à fournir (toutes dans `src/site.mjs`, puis `node src/build.mjs`)
Tarifs par public et durée · horaires · délai d'annulation · année de diplôme et formations · ADELI/RPPS · SIRET · hébergeur définitif · note et nombre d'avis Google (optionnel) · confirmation des moyens de paiement (chèque et carte, source lemedecin.fr) et de l'accès (parking gratuit, plain-pied, source lemedecin.fr).
