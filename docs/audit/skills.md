# Skills utilisés pour l'audit et la refonte

Source des skills installés : dépôt `jojo12-create/skills`, copiés dans `.claude/skills/` (non versionné, voir `.gitignore`).
Règle d'arbitrage : en cas de conflit, `impeccable` et `emil-design-eng` priment sur le visuel et le mouvement ; les contraintes du cahier de mission priment sur tout.

## Retenus

### Installés depuis `jojo12-create/skills`

| Skill | Pourquoi il sert ici | Phase |
|---|---|---|
| `impeccable` | Référence visuelle : modes audit, critique, typeset, layout puis polish final | Audit (UX, typo) et fin de mise en œuvre |
| `design-taste-frontend` | Contrôle anti « site générique », un système, une entrée et un ou deux moments par page | Audit typo et contrôle final |
| `emil-design-eng` | Philosophie de finition : états, courbes, détails invisibles ; arbitre le mouvement | Audit animations et toute la mise en œuvre |
| `improve-animations` | Audit complet du mouvement et plans de correction priorisés | Audit animations |
| `review-animations` *(sur demande)* | Relecture stricte de chaque animation créée ou modifiée | Mise en œuvre, après chaque lot |
| `animation-performance` | Propriétés composites, budget d'image, cause des images perdues | Audit (mesures) et mise en œuvre |
| `choreograph` | Ordre, décalages et immobilité du hero et de la grille des 14 catégories | Audit et mise en œuvre |
| `find-animation-opportunities` | Repérer les rares endroits où le mouvement aiderait à comprendre | Audit animations |
| `remove-animations` | Retirer le mouvement répétitif, décoratif ou sur actions clavier | Audit puis mise en œuvre |
| `animate` | Construire chaque animation retenue dans le bon ordre de décisions | Mise en œuvre |
| `apple-design` | Mouvement physique, profondeur, typographie (approche, interlignage), mouvement réduit | Audit animations et typo |
| `mobile-native` | Survols collants, `100vh`, zoom des champs, encoche, flash au tap | Audit UX et mise en œuvre |
| `break-ui` | Cas limites : textes longs, `[À CONFIRMER]`, sans image, 320 et 2560 px | Audit UX |
| `animation-vocabulary` | Nommer précisément les effets dans les constats | Audit |
| `gestures` | Le glisser de la colonne vertébrale 3D (`spine3d.js`) doit suivre le doigt et rester interruptible | Audit animations et mise en œuvre |
| `ask-emil` *(sur demande)* | Aiguillage : a fixé l'ordre audit (improve / find / remove) → construction (animate, choreograph, gestures) → vérification (break-ui, review, mobile-native, performance) → learn-taste | Étape 0 |
| `pick-ui-library` *(sur demande)* | Vérifier le choix des dépendances (GSAP, Lenis, Three.js) face à la liste d'Emil Kowalski (`motion`) | Audit code |
| `prototype` *(sur demande)* | Présenter les associations de polices comme des variantes réelles, côte à côte dans un sélecteur | Point d'étape (choix de police) |
| `learn-taste` *(sur demande)* | Transformer en règles écrites les choix et corrections validés pendant la refonte | Fin de mission |

### Déjà disponibles dans Claude Code

| Skill | Pourquoi il sert ici | Phase |
|---|---|---|
| `frontend-design` (dépôt `anthropics/skills`) | Direction typographique et refus des choix par défaut | Audit typo |
| `design:design-critique` | Critique structurée : hiérarchie, cohérence, utilisabilité | Audit UX |
| `design:ux-copy` | Libellés des boutons, erreurs du formulaire, états | Audit UX |
| `design:accessibility-review` | Audit WCAG 2.2 AA | Audit accessibilité et vérification finale |
| `design:design-system` | Tokens centralisés, nommage, composants | Audit code |
| `engineering:tech-debt` | Code mort, doublons, dette classée | Audit code |
| `engineering:code-review` | Sûreté et justesse du code JS et du build | Audit code et relecture des commits |
| `engineering:architecture` | Arborescence cible et découpage des modules | Audit code |
| `engineering:testing-strategy` | Garde-fous : SEO, tests Playwright et axe existants (`scripts/qa.mjs`) | Mise en œuvre |
| `engineering:deploy-checklist` | Vérifications avant de proposer la fusion et la démo | Rapport final |

## Écartés

| Skill | Pourquoi |
|---|---|
| `write-swift` | Aucun code Swift ni iOS natif. |
| `animate-expo` | Pas de React Native ni d'Expo. |
| `ask-sonner` | Aucune notification (toast) ; le formulaire affiche son état sur place. |
| `design:user-research`, `design:research-synthesis` | Pas de données d'utilisateurs à analyser dans cette mission. |
| `design:design-handoff` | Pas de transmission à une équipe de développement externe. |
| `engineering:debug`, `engineering:incident-response` | Rien n'est en panne, il s'agit d'une amélioration. |
| `engineering:standup`, `engineering:system-design`, `engineering:documentation` | Hors sujet (pas de service ni d'équipe ; la documentation suit les règles du dépôt). |
| `dataviz` | Aucun graphique de données sur le site. |
