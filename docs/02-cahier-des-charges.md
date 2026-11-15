# Cahier des charges : arborescence et mots-clés

**Objectif n°1 :** des rendez-vous (Doctolib en action principale, téléphone et WhatsApp en secondaire, formulaire de rappel en filet de sécurité).
**Freins à lever :** distance → bloc Accès sur l'accueil et la page Contact ; « est-ce pour moi ? » → « Quand consulter », pages par public, FAQ ; prix → page Tarifs (montants `[À FOURNIR]`).

## Arborescence (5 entrées de menu)

| Menu | URL | Mot-clé principal | Secondaires |
|---|---|---|---|
| Accueil | `/` | ostéopathe Villefontaine | ostéopathe 38090 · cabinet d'ostéopathie Villefontaine · ostéopathe Nord-Isère · ostéopathe près de L'Isle-d'Abeau |
| Ostéopathie | `/osteopathie` | ostéopathie Villefontaine | motifs de consultation ostéopathe · mal de dos · différence ostéopathe / kiné · quand consulter |
| ↳ Nourrissons | `/osteopathie-nourrissons` | ostéopathe nourrisson Villefontaine | torticolis bébé · coliques · naissance difficile |
| ↳ Enfants & ados | `/osteopathie-enfants` | ostéopathe enfant Villefontaine | douleurs de croissance · posture · jeune sportif |
| ↳ Grossesse | `/osteopathie-grossesse` | ostéopathe femme enceinte Villefontaine | sciatique grossesse · bassin · après accouchement |
| ↳ Adultes | `/osteopathie-adultes` | ostéopathe mal de dos Villefontaine | lombalgie · cervicalgie · tensions stress |
| ↳ Seniors | `/osteopathie-seniors` | ostéopathe senior Villefontaine | arthrose · mobilité · équilibre |
| ↳ Sportifs | `/osteopathie-sportifs` | ostéopathe du sport Villefontaine | récupération · prévention des blessures · compétition |
| Tarifs & séance | `/tarifs-seance` | tarif ostéopathe Villefontaine | prix séance ostéopathie · remboursement mutuelle · déroulement consultation · première consultation |
| À propos | `/a-propos` | Adrian Rodriguez ostéopathe | ostéopathe diplômé ATSA · ostéopathe du sportif · avis ostéopathe Villefontaine |
| Contact | `/contact` | rendez-vous ostéopathe Villefontaine | ostéopathe Doctolib Villefontaine · adresse cabinet Les Ravinelles · ostéopathe La Verpillière / Saint-Quentin-Fallavier |
| Pied de page | `/mentions-legales`, `/confidentialite` | — | — (pages légales) |

**Pourquoi les 6 pages par public hors du menu :** elles reprennent les 6 pages du site actuel et visent des recherches précises à forte intention (« ostéopathe nourrisson Villefontaine »), sans dépasser 5 entrées de menu. Elles sont reliées depuis l'accueil, le hub Ostéopathie et entre elles (maillage).

## Redirections 301 à poser lors de la mise en ligne sur osteovillefontaine.fr

| Ancienne URL | Nouvelle URL |
|---|---|
| `/index.html` | `/` |
| `/nourrissons.html` | `/osteopathie-nourrissons` |
| `/enfants.html` | `/osteopathie-enfants` |
| `/adultes.html` | `/osteopathie-adultes` |
| `/femmes-enceintes.html` | `/osteopathie-grossesse` |
| `/seniors.html` | `/osteopathie-seniors` |
| `/sportifs.html` | `/osteopathie-sportifs` |
| `/mentionslegales.html` (404 actuellement) | `/mentions-legales` |

## Balises par page
Toutes les pages ont un title de 60 caractères maximum, une meta description de 155 caractères maximum, un seul H1, un canonical vers `https://osteovillefontaine.fr/…`, les balises Open Graph et Twitter Card, ainsi que le JSON-LD `MedicalBusiness` + `LocalBusiness` et `Person`. S'y ajoutent `BreadcrumbList` sur les pages intérieures et `FAQPage` sur les pages qui ont une FAQ. Les valeurs exactes figurent dans `docs/04-textes.md`. Le build les contrôle à chaque génération.

**Choix SEO, en bref**
- *Type Schema.org :* `MedicalBusiness`, et non `Physician`, réservé aux médecins. Un ostéopathe non médecin qui s'en prévaudrait commettrait une faute déontologique et exposerait le site à un risque de données structurées trompeuses.
- *Canonical vers le domaine définitif dès la préversion :* la copie Hatchable ne concurrence jamais le site en ligne.
- *Une FAQ par page clé :* elle répond aux questions réellement tapées (« remboursé ? », « ordonnance ? ») et rend la page éligible aux résultats enrichis.
- *NAP identique partout* (pied de page, Contact, JSON-LD), aligné sur les annuaires (lemedecin.fr, Bottin) : c'est le premier signal du SEO local.
