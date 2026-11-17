# Modèle anatomique

Le modèle livré dans `site/public/anatomie-3d/model.bin` est la conversion exacte
du champ `b64` du `model.json` fourni : aucune géométrie ni couleur n'a été modifiée.
Il fonctionne sans Python ni Blender sur le serveur.

## Reprendre le modèle fourni

Depuis la racine du dépôt :

```sh
node scripts/anatomie-3d/convert-model.mjs /chemin/model.json
```

SHA-256 de référence :
`9abdf4d1670e0cd6c774d0a5df81231a8067fdc8c0cf191f8215e785109010cf`.

## Reconstruire depuis Z-Anatomy

Les trois scripts Python du prototype sont conservés. Seuls leurs chemins
locaux et le nom d'import `zlib_` (désormais `zanatomy_lecture`) ont été adaptés.
Les filtres anatomiques, groupes, simplifications, occlusion et quantification
restent inchangés. `blend.py` lit le fichier `.blend` directement, sans lancer Blender.

Prérequis : Python 3, NumPy, SciPy, un `Startup.blend` non compressé de
[Z-Anatomy](https://github.com/Z-Anatomy/Models), **et son index `tree.pkl`**.
Cet index contient `sysof` (adresses des objets vers codes des systèmes) et `path`.
Il doit provenir de la même version du `.blend` ; n'utiliser qu'un pickle de confiance.

**Limite des sources fournies :** ni le `.blend`, ni `tree.pkl`, ni le script
qui produit cet index ne sont joints. La reconstruction complète n'a donc pas
été exécutée et ne peut pas être annoncée reproductible avec ces seuls fichiers.
Demander ces sources à l'auteur avant de reconstruire ou de modifier le modèle.

```sh
python -m venv work/venv-anatomie
work/venv-anatomie/bin/pip install numpy scipy
ZANATOMY_BLEND=/chemin/Startup.blend \
ZANATOMY_TREE=/chemin/tree.pkl \
ZANATOMY_OUT=work/modele-reconstruit \
work/venv-anatomie/bin/python scripts/anatomie-3d/zanatomy_construction.py
```

La sortie comprend `model.bin` et `model_dbg.npz`. Comparer les rendus et faire
valider les associations avant de remplacer le modèle public. Ne pas réintroduire
dents, disques, cartilages ou ligaments dans Squelette, ni nez/yeux dans Muscles.
Les ligaments du parcours Articulations forment leur propre couche temporaire.

## Format binaire et compression

`uint32` little-endian : longueur de l'en-tête JSON (complété à un multiple de 4),
puis cet en-tête UTF-8, puis les données. Les offsets `p/g/a/x` sont relatifs au
début des données. Par maillage : positions XYZ `uint16` en différences entre
sommets (modulo 65536), groupe `uint8`, quatre attributs `uint8` normalisés,
indices `uint16` en différences entre indices. Les positions sont déquantifiées
par `q * ext / 65535 + min`. Les normales sont calculées par Three.js.

Apache/LiteSpeed : `.htaccess` active gzip pour `application/octet-stream`.
Le serveur local `node scripts/serve.mjs` compresse aussi le `.bin` et envoie
`Vary: Accept-Encoding`. Aucun fichier JSON base64 n'est déployé.
Sur un autre hébergement, activer gzip/brotli pour ce type MIME et vérifier
`Content-Encoding` : GitHub Pages ignore `.htaccess`, sa compression n'est pas
configurable depuis ce dépôt. Aucune offre payante n'est nécessaire.

Voir [source, licence et adaptations](../../docs/licences-3d.md).
