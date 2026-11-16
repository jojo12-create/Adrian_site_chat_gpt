# Checklist finale V3 (vérifiée le 16/11/2026)

**Outils :** `npm test` (Playwright, Chromium, desktop 1440×900, iPhone 13 et 320×640, axe-core WCAG 2.1 AA) et Lighthouse 12.6 (mobile bridé, servi avec gzip comme en production).

## Résultats Lighthouse (mobile)

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 97–98 | 100 | 100 | 100 | 2,39–2,44 s | 0,003 | 30–80 ms |
| `/osteopathie/` | 99 | 100 | 100 | 100 | 1,96 s | 0,012 | 30 ms |
| `/osteopathie/lombalgie/` | 99 | 100 | 100 | 100 | 2,13 s | 0,015 | 0 ms |
| `/contact/` | 99 | 100 | 100 | 100 | 1,87 s | 0,004 | 0 ms |

Sans compression (serveur PHP de test), le LCP monte à 3,0–3,3 s : le `.htaccess` active la compression sur l'hébergeur.

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
- [x] Polices auto-hébergées, latines préchargées, polices de secours ajustées (aucun décalage)
- [x] Animations en transform/opacity uniquement ; JS 54 Ko gzip chargé en module (différé), CSS 9 Ko gzip
- [x] Carte Google chargée seulement au clic

## Accessibilité
- [x] axe-core : **0 violation** sur 11 pages × 2 formats (22 tests)
- [x] Contraste AA (l'or n'est jamais du texte sur fond clair)
- [x] Lien d'évitement, focus visible, menu mobile (`aria-expanded`, Échap, focus piégé), onglets ARIA au clavier (flèches, Début, Fin)
- [x] Défilant d'avis : bouton pause, pause au survol et au focus
- [x] Formulaire : labels visibles, erreurs sous chaque champ (`aria-invalid`, `aria-describedby`), statut annoncé
- [x] Contenu révélé au défilement atteignable au clavier (opacité seule, révélé au focus)
- [x] `prefers-reduced-motion` : tout est immobile et visible
- [x] Cibles de 44 px minimum (exception : lien dans le texte de la case de consentement, exempté par WCAG 2.5.8)

## Mobile
- [x] Aucun débordement horizontal à 320, 390 et 1440 px
- [x] Bouton RDV visible sans défiler sur toutes les pages et tous les formats
- [x] RDV répété : en-tête fixe, sections, bandeau final, pied de page, bouton flottant mobile (masqué quand un autre RDV est visible)
- [x] Menu plein écran animé ; défilement horizontal remplacé par une pile verticale sous 1024 px

## Fonctionnel
- [x] Formulaire PHP testé en vrai (`php -S`) : 4 erreurs affichées, envoi réussi, anti-robots (champ piège + délai de 3 s). E-mails capturés dans un fichier, **aucun envoi réel pendant les tests**
- [x] Formulaire sans JS : envoi classique, puis redirection vers `/contact/?envoye=1`
- [x] Aucune erreur JavaScript en console
- [x] Vraie 404 (`node scripts/serve.mjs` et `.htaccess`)

## V3 : catégories, illustrations, 3D
- [x] 7 catégories patients + 7 troubles : 14 pages, **14 symboles au pinceau fournis, mis en relief en 3D** (calques en profondeur, coup de pinceau à l'entrée, rotation lente, suivi de la souris), tracés d'origine non retouchés
- [x] Cartes : inclinaison 3D, reflet doré, zoom doux ; 14 cartes sur l'accueil et le hub
- [x] Colonne 3D Three.js procédurale : zones cervicales, dorsales, lombaires, sacrum ; synchronisée avec des onglets HTML accessibles ; chargée en différé (128 Ko gzip)
- [x] Mouvement réduit : 3D statique, symboles immobiles, navigation clavier testée
- [x] Mobile : 3D allégée, titre sans délai, 2 colonnes de cartes, aucun débordement à 320 px

## Contenus et déontologie
- [x] Aucune promesse de guérison ; l'ostéopathie est présentée en complément du médecin, avec les signes d'alerte
- [x] Nourrisson de moins de 6 mois : attestation médicale (décret 2007-435)
- [x] Avis : extraits réels (11 avis Google 5★ publiés sur le site officiel et la démo) ; seule l'orthographe a été corrigée
- [x] Chiffres réels uniquement ; tout le reste est en `[À CONFIRMER]`
- [x] Mentions légales et RGPD (aucun cookie, aucun traceur ; carte Google chargée au clic)

## À fournir
Tarifs par public · durée · horaires · délai d'annulation · temps de trajet depuis les 5 communes · années d'expérience · année de diplôme et formations · ADELI/RPPS · SIRET · hébergeur · moyens de paiement (chèque et carte selon lemedecin.fr) · durée de conservation RGPD.
