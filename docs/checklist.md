# Checklist finale (refonte qualité, vérifiée le 16/11/2026)

**Outils :** `npm test` (Playwright, Chromium, desktop 1440×900, iPhone 13 et 320×640, axe-core WCAG 2.1 AA), `node scripts/measure.mjs` (poids, LCP, CLS, INP, fluidité) et Lighthouse 12.6. Mesures détaillées et comparaison avant/après : [audit/RESULTATS.md](audit/RESULTATS.md).

## SEO
- [x] 26 pages indexables + 404 : title ≤ 60, description ≤ 155, toutes uniques (contrôlé à chaque build)
- [x] Un seul H1 par page, hiérarchie H2/H3 logique, HTML sémantique (header, nav, main, section, footer, address, figure)
- [x] URL propres, fil d'Ariane visible et balisé, maillage : accueil → motifs, motifs ↔ motifs, CTA vers tarifs et contact
- [x] JSON-LD : MedicalBusiness + LocalBusiness, Person, WebPage, BreadcrumbList, FAQPage (10 pages : accueil, ostéopathie, tarifs, contact + 6 motifs), Service (6 motifs)
- [x] Open Graph (image 1200×630), Twitter Card, canonical, `sitemap.xml` (26 URL), `robots.txt`, `site.webmanifest`
- [x] Alt descriptif et width/height sur toutes les images (contrôlé au build)
- [x] SEO local : NAP identique partout, `geo.*`, `areaServed`, carte Google (au clic), lien vers la fiche Google, communes voisines
- [x] Redirections 301 des 8 anciennes URL (`.htaccess`)
- [ ] Horaires et tarifs dans le JSON-LD : dès confirmation

## Performance
- [x] LCP < 2,5 s en mobile bridé (2,0 à 2,3 s), CLS 0 sur les 9 pages testées
- [x] Images AVIF + WebP en 3–4 tailles (`srcset`/`sizes`), hors écran en `loading="lazy"`, photo du hero en `fetchpriority="high"`
- [x] Polices auto-hébergées (Source Serif 4, Figtree), réduites au français, 77,5 Ko ; préchargées selon la page ; polices de secours ajustées (CLS 0)
- [x] Aucune bibliothèque d'animation : transitions CSS + JS natif. JS 2,8 Ko gzip sur toutes les pages (au lieu de 55), modules chargés seulement si la page en a besoin, CSS 11 Ko gzip
- [x] Animations en transform/opacity (exceptions admises : volet du menu mobile, FAQ native) ; interface sous 300 ms ; jeu unique de courbes et durées
- [x] `.htaccess` : cache longue durée réellement appliqué aux fichiers versionnés (à confirmer sur l'hébergeur)
- [x] Carte Google chargée seulement au clic

## Accessibilité
- [x] axe-core : **0 violation** sur 11 pages × 2 formats (22 tests)
- [x] Contraste AA mesuré au pixel, y compris ce qu'axe ne tranche pas : bouton or du pied de page 6,9:1, focus 11:1, bordure des champs 3,9:1
- [x] Lien d'évitement, focus visible, menu mobile (`aria-expanded`, Échap, focus piégé), onglets ARIA au clavier (flèches, Début, Fin)
- [x] Avis : rangée fixe que l'on fait défiler soi-même (plus de contenu en mouvement automatique)
- [x] Formulaire : labels visibles, erreurs sous chaque champ (`aria-invalid`, `aria-describedby`), statut annoncé
- [x] Contenu révélé au défilement atteignable au clavier (opacité seule, révélé au focus)
- [x] `prefers-reduced-motion` : plus aucun déplacement, les fondus courts restent ; bouton flottant caché hors du parcours clavier (`inert`)
- [x] Cibles de 44 px minimum (exception : lien dans le texte de la case de consentement, exempté par WCAG 2.5.8)

## Menus déroulants
- [x] Ostéopathie et Le cabinet : sous-pages listées dans un menu déroulant (ordinateur) et dans un volet (mobile) ; Avis et Conseils désormais accessibles depuis le menu principal
- [x] Clavier : flèche = bouton `aria-expanded`, Échap referme et rend le focus, focus sorti referme ; le lien de rubrique mène toujours à sa page
- [x] Volet fermé hors du parcours clavier (`visibility: hidden`), piège à focus du menu mobile mis à jour

## Typographie
- [x] Typographie française à la génération : espaces insécables avant `: ; ? ! »`, après `«`, entre nombre et unité, dans le téléphone ; apostrophes typographiques (0 cas restant sur 27 pages)
- [x] Échelle fluide à 7 niveaux, un seul H1 par page, aucun intertitre plus petit que le texte

## Mobile
- [x] Aucun contenu coupé à 320, 390 et 1440 px (pied de page et tableau des tarifs corrigés à 320 px)
- [x] Bouton RDV visible sans défiler sur toutes les pages et tous les formats
- [x] RDV répété : en-tête fixe, sections, bandeau final, pied de page, bouton flottant mobile (masqué quand un autre RDV est visible)
- [x] Menu plein écran animé ; défilement horizontal remplacé par une pile verticale sous 1024 px

## Fonctionnel
- [x] Formulaire PHP testé en vrai (`php -S`) : 4 erreurs affichées, envoi réussi, anti-robots (champ piège + délai de 3 s). E-mails capturés dans un fichier, **aucun envoi réel pendant les tests**
- [x] Formulaire sans JS : envoi classique, puis message affiché (`/contact/#envoye` ou `#erreur`)
- [x] Aucune erreur JavaScript en console
- [x] Vraie 404 (`node scripts/serve.mjs` et `.htaccess`)

## V3 : catégories, illustrations, 3D
- [x] 7 catégories patients + 7 troubles : 14 pages, **14 symboles au pinceau fournis, mis en relief en 3D**, tracés d'origine non retouchés. Cartes : relief qui répond à la souris ; grand symbole de page : coup de pinceau à l'entrée et rotation lente ; à plat sur téléphone
- [x] Cartes : inclinaison 3D, reflet doré, zoom doux ; 14 cartes sur l'accueil et le hub
- [x] Colonne : dessin SVG synchronisé avec des onglets HTML accessibles partout ; modèle 3D Three.js sur ordinateur, à la demande (bouton « Explorer en 3D », 125 Ko gzip), rendu seulement quand on le manipule
- [x] Mouvement réduit : 3D statique, symboles immobiles, navigation clavier testée
- [x] Mobile : aucune 3D téléchargée, titre sans délai, 2 colonnes de cartes

## Contenus et déontologie
- [x] Aucune promesse de guérison ; l'ostéopathie est présentée en complément du médecin, avec les signes d'alerte
- [x] Nourrisson de moins de 6 mois : attestation médicale (décret 2007-435)
- [x] Avis : extraits réels (11 avis Google 5★ publiés sur le site officiel et la démo) ; seule l'orthographe a été corrigée
- [x] Chiffres réels uniquement ; tout le reste est en `[À CONFIRMER]`
- [x] Mentions légales et RGPD (aucun cookie, aucun traceur ; carte Google chargée au clic)

## À fournir
Tarifs par public · durée · horaires · délai d'annulation · temps de trajet depuis les 5 communes · années d'expérience · année de diplôme et formations · ADELI/RPPS · SIRET · hébergeur · moyens de paiement (chèque et carte selon lemedecin.fr) · durée de conservation RGPD.
