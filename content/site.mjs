/* ==========================================================================
   SOURCE UNIQUE : identité, coordonnées (NAP), liens, données à confirmer.
   Une donnée inconnue = TBC → affichée « [À CONFIRMER] » sur le site.
   Rien n'est inventé : tarifs, horaires, temps de trajet restent à fournir.
   ========================================================================== */

export const TBC = '[À CONFIRMER]';

export const site = {
  url: 'https://osteovillefontaine.fr', // domaine définitif (canonical, sitemap, OG)
  name: 'Adrian Rodriguez, ostéopathe à Villefontaine',
  practitioner: 'Adrian Rodriguez',
  locale: 'fr_FR',

  address: {
    street: '1 rue Louis Ganel, bâtiment B',
    area: 'Les Ravinelles',
    postalCode: '38090',
    city: 'Villefontaine',
    region: 'Isère',
    country: 'FR',
    geo: { lat: 45.618656, lng: 5.152221 }, // carte Google du site officiel
  },
  phone: { display: '06 09 22 49 38', href: 'tel:+33609224938', intl: '+33609224938' },
  email: 'adrian.osteo38@gmail.com',

  links: {
    // Prise de RDV existante, reprise du site officiel
    doctolib: 'https://www.doctolib.fr/osteopathe/villefontaine/adrian-rodriguez',
    whatsapp: 'https://wa.me/33609224938?text=' + encodeURIComponent('Bonjour, je souhaite prendre rendez-vous.'),
    instagram: 'https://www.instagram.com/adrianosteo/',
    linkedin: 'https://fr.linkedin.com/in/adrian-rodriguez-885029bb',
    // Fiche Google Business Profile (place_id relevé sur la carte du site officiel)
    google: 'https://www.google.com/maps/search/?api=1&query=Adrian%20Rodriguez%20Ost%C3%A9opathe&query_place_id=ChIJu848JRDT9EcRTB1imlNjPtU',
    directions: 'https://www.google.com/maps/dir/?api=1&destination=1%20rue%20Louis%20Ganel%2C%2038090%20Villefontaine&destination_place_id=ChIJu848JRDT9EcRTB1imlNjPtU',
    // Carte intégrée gratuite (sans clé d'API), chargée seulement au clic
    mapEmbed: 'https://www.google.com/maps?q=Adrian%20Rodriguez%20Ost%C3%A9opathe%2C%201%20rue%20Louis%20Ganel%2C%2038090%20Villefontaine&output=embed',
  },

  // À fournir par Adrian
  tbc: {
    price: TBC, priceChild: TBC, priceBaby: TBC, duration: TBC,
    hours: TBC, cancel: TBC, adeli: TBC, siret: TBC, graduation: TBC, host: TBC, years: TBC,
  },

  // Communes voisines : temps de trajet à confirmer (aucune estimation inventée)
  nearby: [
    { name: "L'Isle-d'Abeau", time: TBC },
    { name: 'Bourgoin-Jallieu', time: TBC },
    { name: 'Saint-Quentin-Fallavier', time: TBC },
    { name: 'La Verpillière', time: TBC },
    { name: 'Vaulx-Milieu', time: TBC },
  ],
};

/* Navigation : 5 entrées maximum (le bouton RDV est à part).
   « menu » : la rubrique a plusieurs pages et ouvre un menu déroulant
   (contenu construit dans content/layout.mjs, à partir des catégories et des articles). */
export const nav = [
  { href: '/', label: 'Accueil' },
  { href: '/osteopathie/', label: 'Ostéopathie', menu: 'osteo' },
  { href: '/cabinet/', label: 'Le cabinet', menu: 'cabinet', also: ['/avis/', '/conseils/'] },
  { href: '/tarifs/', label: 'Tarifs & infos' },
  { href: '/contact/', label: 'Contact' },
];

/* Avis Google : textes ENTIERS, recopiés mot pour mot (fautes, ponctuation et émojis compris).
   Aucun avis n'est raccourci, corrigé ni recomposé ; le nom est écrit comme sur Google.
   Sources (archives du dépôt) :
     - assets/raw/officiel/index.html  → rubrique « Retour des Patients » du site officiel
     - assets/raw/demo/pages/avis.html → avis Google relevés pour la démo
   Seuls les avis dont le texte complet est disponible sont repris (ceux coupés par « … » sont écartés).
   Pour en ajouter : copier le texte exact depuis la fiche Google. */
export const reviews = [
  { a: 'elodie HAON', t: "Adrian est top! À l’écoute et sait très bien expliquer la cause de vos douleurs et vous manipule que si vous êtes ok. Il sait mettre à l’aise et est très pro. Je le conseille vraiment :)" },
  { a: 'Flavie Beal', t: "Je recommande Adrian sans aucun doute. Des explications sur chaque manipulation, des conseils, de la bienveillance. Très pro. Enfin un ostéo à l'écoute du patient." },
  { a: 'Martin Jzql', t: "Séance au top comme à chaque fois: déblocage des tensions cervicales et thoraco-lombaires ! Un professionnel à recommander sans aucune hésitation: foncez! 👌🏻" },
  { a: 'Ophelie Robert', t: "Très bonne séance, merci pour vos explications et le temps accordé à mon genou qui est plutôt capricieux ^^, un ostéopathe vraiment sympathique qui sait vous mettre à l’aise ^^" },
  { a: 'quentin vivancos', t: "Tombé par hasard dessus! Première fois qu’un ostéopathe me garde aussi longtemps! Adrian est super tant humainement que professionnellement! Je recommande!!" },
  { a: 'Joris Asl', t: "Séance au top ! Je me sens comme neuf !" },
  { a: 'Virginie Serroul', t: "Très bon praticien, prends le temps et à l écoute je recommande vivement" },
  { a: 'Chloé de Fraiteur', t: "Super praticien, à l'écoute et efficace!" },
  { a: 'Theo Reynard', t: "Très bonne expérience, Osteo a l’écoute et qui met à l’aise je recommande" },
  { a: 'alexandre di noto', t: "Très professionnel à l’écoute du client Je recommande à 100%" },
  { a: 'villard villard', t: "professionnel très attentif et efficace, et à l'écoute de ses patients. je le recommande." },
  { a: 'Lucille Varraud', t: "Manipule bien, donne le sourire, mes les personnes alaise. Je le recommande totalement" },
];
/* Nombre d'avis sur la fiche Google. 154 au dernier relevé archivé (assets/raw/demo/pages/avis.html) ;
   affiché en « plus de 150 » pour rester vrai. À ACTUALISER avec le chiffre du jour sur la fiche Google. */
export const reviewCount = 154;
export const reviewCountLabel = '150+';

/* Photos optimisées (voir scripts/images.mjs) : nom → texte alternatif */
export const photoAlt = {
  'adrian-bureau': "Adrian Rodriguez, ostéopathe, assis à son bureau dans le cabinet de Villefontaine",
  'adrian-echange': "Adrian Rodriguez écoute un patient lors de l'échange en début de séance",
  'adrian-ecoute': "Adrian Rodriguez penché vers un patient pendant une séance d'ostéopathie",
  'soin-epaule': "Mains de l'ostéopathe posées sur l'épaule d'une patiente",
  'carte-cabinet': "Carte de visite du cabinet avec le logo bonsaï d'Adrian Rodriguez",
  'soin-bassin': "Technique d'ostéopathie douce sur la hanche et le bassin",
  'soin-nuque': "Adrian Rodriguez traite la nuque d'un patient assis, devant une planche d'anatomie",
  'soin-dos': "Technique d'ostéopathie sur le dos d'un patient allongé sur le côté",
  'soin-dos-table': "Patiente allongée sur la table, Adrian Rodriguez travaille le haut du dos",
  'adrian-portrait': "Portrait d'Adrian Rodriguez, ostéopathe à Villefontaine",
};
