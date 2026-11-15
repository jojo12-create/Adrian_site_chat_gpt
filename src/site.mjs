/* ==========================================================================
   Source unique de vérité : identité, coordonnées (NAP), liens, placeholders.
   Toute donnée manquante est marquée TODO : elle s'affiche « [À FOURNIR] »
   sur le site pour qu'aucun chiffre ne soit inventé.
   ========================================================================== */

export const TODO = '[À FOURNIR]';

export const site = {
  // Domaine définitif visé : sert aux canonical, sitemap, Open Graph et JSON-LD.
  // Tant que le site tourne sur Hatchable, le canonical pointe déjà vers ce domaine
  // pour éviter le contenu dupliqué entre la préversion et le site en ligne.
  url: 'https://osteovillefontaine.fr',
  name: 'Adrian Rodriguez, ostéopathe à Villefontaine',
  shortName: 'Adrian Rodriguez',
  locale: 'fr_FR',
  practitioner: 'Adrian Rodriguez',
  school: "l'école ATSA",

  // NAP : doit rester identique au profil Google Business et aux annuaires.
  address: {
    street: '1 rue Louis Ganel, bâtiment B',
    area: 'Les Ravinelles',
    postalCode: '38090',
    city: 'Villefontaine',
    region: 'Auvergne-Rhône-Alpes',
    country: 'FR',
    geo: { lat: 45.618656, lng: 5.152221 }, // relevé sur la carte Google du site actuel
  },
  phone: { display: '06 09 22 49 38', href: 'tel:+33609224938', intl: '+33609224938' },
  email: 'adrian.osteo38@gmail.com',

  links: {
    doctolib: 'https://www.doctolib.fr/osteopathe/villefontaine/adrian-rodriguez',
    whatsapp: 'https://wa.me/33609224938?text=' + encodeURIComponent('Bonjour, je souhaite prendre rendez-vous.'),
    instagram: 'https://www.instagram.com/adrianosteo/',
    linkedin: 'https://fr.linkedin.com/in/adrian-rodriguez-885029bb',
    googleReviews: 'https://www.google.com/maps/search/?api=1&query=Adrian%20Rodriguez%20Ost%C3%A9opathe%20Villefontaine&query_place_id=ChIJu848JRDT9EcRTB1imlNjPtU',
    directions: 'https://www.google.com/maps/dir/?api=1&destination=1%20rue%20Louis%20Ganel%2038090%20Villefontaine&destination_place_id=ChIJu848JRDT9EcRTB1imlNjPtU',
  },

  // Données à fournir par Adrian (affichées « [À FOURNIR] » tant qu'elles sont vides).
  pending: {
    price: TODO,          // ex. « 60 € »
    duration: TODO,       // ex. « 45 à 60 min »
    hours: TODO,          // ex. « Lundi au samedi, 9 h – 20 h »
    adeli: TODO,          // numéro ADELI / RPPS
    siret: TODO,
    graduation: TODO,     // année d'obtention du diplôme
    host: TODO,           // hébergeur définitif (nom, adresse, téléphone)
  },

  // Communes voisines (zone de chalandise), utilisées dans le texte et areaServed.
  nearby: ["L'Isle-d'Abeau", 'La Verpillière', 'Vaulx-Milieu', 'Saint-Quentin-Fallavier', 'Bourgoin-Jallieu'],

  // Image de partage (JPEG, lisible par tous les réseaux sociaux).
  ogImage: '/images/adrian-pratique.jpg',
};

/* Navigation principale : 5 entrées maximum (le RDV est un bouton à part). */
export const nav = [
  { href: '/', label: 'Accueil' },
  { href: '/osteopathie', label: 'Ostéopathie' },
  { href: '/tarifs-seance', label: 'Tarifs & séance' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

/* Avis Google réels, cités mot pour mot depuis le site actuel et la démo.
   Choix déontologique : on retient les avis qui décrivent l'écoute et la
   pédagogie, pas ceux qui promettent un résultat. */
export const reviews = [
  { author: 'Elodie Haon', text: "Adrian est top ! À l'écoute et sait très bien expliquer la cause de vos douleurs et vous manipule que si vous êtes ok. Il sait mettre à l'aise et est très pro. Je le conseille vraiment :)" },
  { author: 'Flavie Beal', text: "Je recommande Adrian sans aucun doute. Des explications sur chaque manipulation, des conseils, de la bienveillance. Très pro. Enfin un ostéo à l'écoute du patient." },
  { author: 'Ophélie Robert', text: "Très bonne séance, merci pour vos explications et le temps accordé à mon genou qui est plutôt capricieux ^^, un ostéopathe vraiment sympathique qui sait vous mettre à l'aise ^^" },
  { author: 'Quentin Vivancos', text: "Tombé par hasard dessus ! Première fois qu'un ostéopathe me garde aussi longtemps ! Adrian est super tant humainement que professionnellement ! Je recommande !!" },
  { author: 'Martin Jzql', text: "Séance au top comme à chaque fois : déblocage des tensions cervicales et thoraco-lombaires ! Un professionnel à recommander sans aucune hésitation : foncez !" },
  { author: 'Théo Reynard', text: "Très bonne expérience, ostéo à l'écoute et qui met à l'aise, je recommande." },
];

/* Photos : fichiers déjà présents dans le projet Hatchable (photos de la démo).
   AVIF haute définition + miniature WebP de secours pour les vieux navigateurs. */
export const photos = {
  ecoute:       { avif: '/images/adrian-portrait-ecoute-hq.avif', fallback: '/images/adrian-portrait-ecoute.webp', w: 1250, h: 1563 },
  profil:       { avif: '/images/adrian-portrait-profil-hq.avif', fallback: '/images/adrian-portrait-profil.webp', w: 1250, h: 1563 },
  discussion:   { avif: '/images/adrian-portrait-discussion-hq.avif', fallback: '/images/adrian-portrait-discussion.webp', w: 1250, h: 1563 },
  consultation: { avif: '/images/adrian-consultation-hq.avif', fallback: '/images/adrian-consultation.webp', w: 1250, h: 1563 },
  soin:         { avif: '/images/adrian-soin-hq.avif', fallback: '/images/adrian-soin.webp', w: 1133, h: 1700 },
  detail:       { avif: '/images/adrian-detail-hq.avif', fallback: '/images/adrian-detail.webp', w: 1133, h: 1700 },
  cabinet1:     { jpg: '/images/cabinet-doctolib-01.jpg', w: 675, h: 900 },
  cabinet2:     { jpg: '/images/cabinet-doctolib-02.jpg', w: 720, h: 900 },
};
