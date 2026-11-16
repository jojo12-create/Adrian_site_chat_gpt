# Adrian Rodriguez, ostéopathe à Villefontaine : site web

Site vitrine en code pur (HTML, CSS, JavaScript), sans framework ni plateforme. Il tourne en local et s'héberge n'importe où : le dossier `dist/` est un site statique, et le formulaire tourne avec un script PHP.
**100 % gratuit :** Vite (MIT), Three.js (MIT, chargé à la demande), sharp (Apache-2.0), polices Source Serif 4 et Figtree (OFL), `mail()` de PHP. Aucune bibliothèque d'animation : transitions CSS et JavaScript natif.

## Démarrer

```bash
npm install          # une fois
npm run dev          # serveur local http://127.0.0.1:5173 (rechargement à chaud)
npm run build        # version de production dans dist/
node scripts/serve.mjs 4173   # sert dist/ comme l'hébergeur (gzip, vraie 404)
npm test             # tests réels : Playwright desktop/mobile, axe, LCP, formulaire PHP
node scripts/measure.mjs http://127.0.0.1:4173 mesures   # poids, LCP/CLS/INP, fluidité du défilement, captures
npm run images       # ré-optimise les photos (assets/raw → site/public/images)
npm run symbols      # regroupe les 14 symboles (assets/raw/symboles → site/public/images/symboles.svg)
```

Pour tester le formulaire en local : `php -S 127.0.0.1:8000 -t dist`.

## Mettre en ligne (n'importe quel hébergeur)
1. `npm run build`
2. Copier **le contenu** de `dist/` à la racine du site (FTP, gestionnaire de fichiers…).
3. Sur un hébergement Apache/LiteSpeed (comme l'actuel), le `.htaccess` fourni gère la page 404, les redirections 301 des anciennes pages, la compression et le cache. Décommenter le bloc HTTPS une fois le certificat actif.
4. Sur un hébergement statique sans PHP (Netlify, GitHub Pages…), le site fonctionne ; seul le formulaire de rappel a besoin de PHP. Doctolib, le téléphone et WhatsApp restent disponibles.

## Organisation

```
content/site.mjs        ← identité, NAP, liens, données [À CONFIRMER] : À COMPLÉTER ICI
content/pages.mjs       textes de toutes les pages (+ mots-clés SEO en commentaire)
content/layout.mjs      <head> SEO, JSON-LD, en-tête, pied de page, composants
scripts/build-pages.mjs génère site/…/index.html, sitemap.xml, robots.txt, docs/textes.md (+ contrôles SEO)
scripts/images.mjs      AVIF/WebP responsive, favicons, image Open Graph
scripts/symbols.mjs     symboles des 14 catégories (un seul fichier SVG)
content/illustrations.mjs  symbole en relief : calques empilés en profondeur
scripts/qa.mjs          tests en conditions réelles
scripts/serve.mjs       serveur local de production
site/src/styles/        styles en couches (@layer) : tokens, base, layout, components/, motion
site/src/scripts/main.js  point d'entrée JS : noyau + modules chargés à la demande
site/src/scripts/core/        en-tête, menus, apparitions
site/src/scripts/components/  formulaire, carte, défilant d'avis, colonne (onglets)
site/src/scripts/animations/  profondeur à la souris, séance épinglée
site/src/scripts/three/       colonne vertébrale 3D (ordinateur, sur demande)
content/symbols.mjs     liste des 14 symboles (donnée)
site/public/            images, favicons, .htaccess, api/contact.php
assets/raw/             logo et photos d'origine (site officiel + démo)
docs/                   audit, cahier des charges, DA, textes, checklist
```

## Données à confirmer
Elles sont toutes dans `content/site.mjs`, sous `tbc` et `nearby` : tarifs, durée, horaires, délai d'annulation, temps de trajet, années d'expérience, année de diplôme, ADELI/RPPS, SIRET et hébergeur. Les compléter, puis lancer `npm run build`.
