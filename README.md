# Adrian Rodriguez, ostéopathe à Villefontaine : site premium SEO

Site statique (HTML/CSS/JS, sans framework) + un endpoint Hatchable pour le formulaire de rappel.

```
src/site.mjs      identité, NAP, liens, données [À FOURNIR]  ← à compléter ici
src/pages.mjs     tous les textes, page par page
src/layout.mjs    <head> SEO, en-tête, pied de page, JSON-LD, composants
src/build.mjs     génère public/*.html, sitemap.xml, robots.txt, docs/04-textes.md
public/assets/    site.css, site.js, polices auto-hébergées (OFL)
api/contact.js    POST /api/contact (validation, base de données, e-mail)
migrations/       table contact_requests
docs/             audit, cahier des charges, charte, textes, checklist
```

Build : `node src/build.mjs` (Node 18+). Le build échoue si un title dépasse 60 caractères,
une description 155, s'il y a plus ou moins d'un H1 ou une image sans alt.

Les photos (`public/images/`) sont hébergées dans le projet Hatchable (reprises de la démo).
