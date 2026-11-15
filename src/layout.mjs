/* ==========================================================================
   Gabarit commun : <head> SEO, en-tête, pied de page, JSON-LD, composants.
   ========================================================================== */
import { site, nav, photos, TODO } from './site.mjs';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p) => site.url + (p === '/' ? '/' : p);
const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
/* Un placeholder visible et repérable, jamais un chiffre inventé. */
export const todo = (v) => (v === TODO ? `<mark class="todo">${TODO}</mark>` : esc(v));

/* --- Icônes : un seul jeu SVG maison, trait 1.6, même gabarit 24 px --- */
const ICONS = {
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  phone: '<path d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  arrow: '<path d="M5 12h13M13 6l6 6-6 6"/>',
  check: '<path d="m5 12.5 4.2 4L19 7"/>',
  car: '<path d="M5 16.5V12l1.8-4.6A2 2 0 0 1 8.7 6h6.6a2 2 0 0 1 1.9 1.4L19 12v4.5M5 12h14M5 16.5h14v2H5zM7.5 14.2h.01M16.5 14.2h.01"/>',
  chat: '<path d="M4.5 18.5 6 15a7.5 7.5 0 1 1 3 2.6Z"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.2 6.8h.01"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  star: '<path d="m12 3.8 2.5 5.1 5.6.8-4 4 .9 5.6L12 16.6l-5 2.7.9-5.6-4-4 5.6-.8Z"/>',
};
export const icon = (name, cls = 'ico') =>
  `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;

/* --- Image responsive : AVIF + secours, dimensions fixées (pas de CLS) --- */
export function picture(key, alt, { cls = '', eager = false, sizes = '(min-width: 960px) 45vw, 100vw' } = {}) {
  const p = photos[key];
  const load = eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  if (p.jpg) return `<img class="${cls}" src="${p.jpg}" width="${p.w}" height="${p.h}" alt="${esc(alt)}" ${load}>`;
  return `<picture class="${cls}"><source type="image/avif" srcset="${p.avif}" sizes="${sizes}"><img src="${p.fallback}" width="${p.w}" height="${p.h}" alt="${esc(alt)}" ${load}></picture>`;
}

/* --- Boutons d'action : le RDV est toujours le bouton principal --- */
export const btnRdv = (label = 'Prendre rendez-vous', cls = 'btn btn-primary') =>
  `<a class="${cls}" href="${site.links.doctolib}" target="_blank" rel="noopener" data-track="doctolib">${icon('calendar')}<span>${label}</span><span class="sr-only"> (Doctolib, nouvel onglet)</span></a>`;
export const btnCall = (cls = 'btn btn-ghost') =>
  `<a class="${cls}" href="${site.phone.href}" data-track="phone">${icon('phone')}<span>${site.phone.display}</span></a>`;

/* --- Bandeau de conversion répété en bas de chaque page --- */
export const ctaBand = (title = 'Un créneau qui vous convient, en ligne ou par téléphone', text = 'Les disponibilités sont à jour sur Doctolib. Vous préférez parler avant de réserver ? Appelez ou écrivez sur WhatsApp.') => `
<section class="band" aria-labelledby="band-title">
  <div class="wrap band-inner">
    <div>
      <h2 id="band-title">${title}</h2>
      <p>${text}</p>
    </div>
    <div class="actions">
      ${btnRdv('Prendre rendez-vous', 'btn btn-gold')}
      ${btnCall('btn btn-on-dark')}
    </div>
  </div>
</section>`;

/* --- FAQ accessible (details/summary) + données pour FAQPage --- */
export const faqBlock = (items, title = 'Questions fréquentes') => `
<section class="section faq" aria-labelledby="faq-title">
  <div class="wrap narrow">
    <h2 id="faq-title">${title}</h2>
    <div class="faq-list">
      ${items.map((f) => `<details><summary>${f.q}</summary><div class="faq-a">${f.a}</div></details>`).join('\n      ')}
    </div>
  </div>
</section>`;

/* --- Fil d'Ariane visible --- */
const crumbsHtml = (crumbs) => `
<nav class="crumbs wrap" aria-label="Fil d'Ariane"><ol>${crumbs
  .map((c, i) => (i < crumbs.length - 1 ? `<li><a href="${c.href}">${c.label}</a></li>` : `<li aria-current="page">${c.label}</li>`))
  .join('')}</ol></nav>`;

/* --- JSON-LD ---------------------------------------------------------------
   Type : MedicalBusiness (sous-type de LocalBusiness). « Physician » est réservé
   aux médecins : un ostéopathe non médecin ne doit pas s'en prévaloir. */
function jsonLd(page) {
  const a = site.address;
  const business = {
    '@type': ['MedicalBusiness', 'LocalBusiness'],
    '@id': site.url + '/#cabinet',
    name: site.name,
    description: "Cabinet d'ostéopathie à Villefontaine (38090) : nourrissons, enfants, femmes enceintes, adultes, seniors et sportifs.",
    url: site.url + '/',
    image: site.url + site.ogImage,
    logo: site.url + '/images/adrian-logo.webp',
    telephone: site.phone.intl,
    email: site.email,
    address: { '@type': 'PostalAddress', streetAddress: `${a.street}, ${a.area}`, postalCode: a.postalCode, addressLocality: a.city, addressRegion: a.region, addressCountry: a.country },
    geo: { '@type': 'GeoCoordinates', latitude: a.geo.lat, longitude: a.geo.lng },
    hasMap: site.links.googleReviews,
    areaServed: [a.city, ...site.nearby].map((n) => ({ '@type': 'City', name: n })),
    medicalSpecialty: 'Osteopathic',
    paymentAccepted: 'Chèque, carte bancaire', // source : lemedecin.fr, à confirmer
    sameAs: [site.links.doctolib, site.links.instagram, site.links.linkedin],
    founder: { '@id': site.url + '/#adrian' },
    // openingHoursSpecification : à ajouter dès que les horaires sont fournis.
  };
  const person = {
    '@type': 'Person',
    '@id': site.url + '/#adrian',
    name: site.practitioner,
    jobTitle: 'Ostéopathe',
    alumniOf: { '@type': 'EducationalOrganization', name: 'ATSA' },
    worksFor: { '@id': site.url + '/#cabinet' },
    sameAs: [site.links.instagram, site.links.linkedin],
  };
  const graph = [business, person, {
    '@type': 'WebPage', '@id': abs(page.path) + '#page', url: abs(page.path), name: page.title,
    description: page.description, inLanguage: 'fr-FR', isPartOf: { '@type': 'WebSite', url: site.url + '/', name: site.name },
    about: { '@id': site.url + '/#cabinet' },
  }];
  if (page.crumbs) graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: page.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: abs(c.href) })),
  });
  if (page.faq) graph.push({
    '@type': 'FAQPage',
    mainEntity: page.faq.map((f) => ({ '@type': 'Question', name: strip(f.q), acceptedAnswer: { '@type': 'Answer', text: strip(f.a) } })),
  });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

/* --- Page complète ------------------------------------------------------- */
export function render(page) {
  const canonical = abs(page.path);
  const current = (href) => (href === '/' ? page.path === '/' : page.path === href || page.path.startsWith(href + '-'));
  const a = site.address;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
<meta name="theme-color" content="#3e5e42">
<link rel="icon" href="/images/adrian-logo.webp" type="image/webp">
<link rel="apple-touch-icon" href="/images/adrian-logo.webp">
<link rel="preload" href="/assets/fonts/league-spartan-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/source-sans-3-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
${page.preloadHero ? `<link rel="preload" as="image" href="${photos[page.preloadHero].avif}" type="image/avif" fetchpriority="high">\n` : ''}<link rel="stylesheet" href="/assets/site.css?v=1">
<meta property="og:type" content="website">
<meta property="og:locale" content="${site.locale}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.url}${site.ogImage}">
<meta property="og:image:width" content="1536">
<meta property="og:image:height" content="1317">
<meta property="og:image:alt" content="Adrian Rodriguez, ostéopathe à Villefontaine">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${site.url}${site.ogImage}">
<script type="application/ld+json">${jsonLd(page)}</script>
<script src="/assets/site.js?v=1" defer></script>
</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
<header class="header" data-header>
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="Adrian Rodriguez, ostéopathe à Villefontaine : accueil">
      <img src="/images/adrian-logo.webp" width="44" height="44" alt="">
      <span class="brand-text"><strong>Adrian Rodriguez</strong><small>Ostéopathe · Villefontaine</small></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle>
      ${icon('menu', 'ico ico-open')}${icon('close', 'ico ico-close')}<span class="sr-only">Menu</span>
    </button>
    <nav class="menu" id="menu" aria-label="Navigation principale">
      <ul>${nav.map((n) => `<li><a href="${n.href}"${current(n.href) ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('')}</ul>
      <div class="menu-actions">${btnCall('btn btn-ghost btn-sm menu-call')}${btnRdv('Prendre RDV', 'btn btn-primary btn-sm')}</div>
    </nav>
  </div>
</header>
${page.crumbs ? crumbsHtml(page.crumbs) : ''}
<main id="contenu" tabindex="-1">
${page.body}
</main>
<footer class="footer">
  <div class="wrap footer-grid">
    <div class="footer-id">
      <p class="footer-name">Adrian Rodriguez, ostéopathe</p>
      <address>
        ${a.street}<br>${a.area}<br>${a.postalCode} ${a.city}
      </address>
      <p><a href="${site.phone.href}">${site.phone.display}</a><br><a href="mailto:${site.email}">${site.email}</a></p>
    </div>
    <div>
      <p class="footer-title">Horaires</p>
      <p>${todo(site.pending.hours)}</p>
      <p>Créneaux en temps réel sur <a href="${site.links.doctolib}" target="_blank" rel="noopener">Doctolib</a>.</p>
    </div>
    <div>
      <p class="footer-title">Le site</p>
      <ul class="footer-links">
        ${nav.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}
      </ul>
    </div>
    <div>
      <p class="footer-title">Suivre et réserver</p>
      <ul class="footer-links">
        <li><a href="${site.links.doctolib}" target="_blank" rel="noopener">Doctolib</a></li>
        <li><a href="${site.links.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>
        <li><a href="${site.links.instagram}" target="_blank" rel="noopener">Instagram @adrianosteo</a></li>
        <li><a href="${site.links.googleReviews}" target="_blank" rel="noopener">Avis Google</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap footer-legal">
    <p>© <span data-year>2026</span> Adrian Rodriguez · Ostéopathe à Villefontaine (38090)</p>
    <p><a href="/mentions-legales">Mentions légales</a> · <a href="/confidentialite">Confidentialité</a></p>
  </div>
</footer>
<aside class="mobile-bar" aria-label="Prise de rendez-vous rapide">
  ${btnCall('btn btn-ghost')}
  ${btnRdv('Prendre RDV', 'btn btn-primary')}
</aside>
</body>
</html>
`;
}
