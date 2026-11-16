/* ==========================================================================
   Gabarit commun : <head> SEO, en-tête, pied de page, JSON-LD, composants.
   ========================================================================== */
import { readFileSync } from 'node:fs';
import { site, nav, photoAlt, TBC } from './site.mjs';
import { patients, troubles } from './categories.mjs';
import { articles } from './articles.mjs';
import { symMini } from './illustrations.mjs';

/* Mode démo (DEMO=1) : maquette en ligne pour présentation au client, non indexée */
export const DEMO = process.env.DEMO === '1';
const manifest = JSON.parse(readFileSync(new URL('../site/public/images/manifest.json', import.meta.url)));
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (h) => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const abs = (p) => site.url + p;

/* Valeur à confirmer : visible et repérable, jamais inventée */
export const tbc = (v) => (v === TBC ? `<mark class="tbc">${TBC}</mark>` : esc(v));

/* --- Icônes SVG maison : trait 1.5, grille 24 --- */
const I = {
  cal: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  phone: '<path d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  arrow: '<path d="M5 12h13M13 6l6 6-6 6"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  check: '<path d="m5 12.5 4.2 4L19 7"/>',
  car: '<path d="M5 16.5V12l1.8-4.6A2 2 0 0 1 8.7 6h6.6a2 2 0 0 1 1.9 1.4L19 12v4.5M5 12h14M5 16.5h14v2H5z"/>',
  chat: '<path d="M4.5 18.5 6 15a7.5 7.5 0 1 1 3 2.6Z"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
  star: '<path d="m12 3.8 2.5 5.1 5.6.8-4 4 .9 5.6L12 16.6l-5 2.7.9-5.6-4-4 5.6-.8Z"/>',
  euro: '<path d="M17 6.5A6.5 6.5 0 1 0 17 17.5M4 10.5h9M4 13.5h9"/>',
  access: '<circle cx="12" cy="4.5" r="1.8"/><path d="M6 8.5h12M12 8.5v5l-3.5 6.5M12 13.5l3.5 6.5"/>',
  pause: '<path d="M9 6v12M15 6v12"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  insta: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.2 6.8h.01"/>',
};
export const icon = (n, c = 'ico') => `<svg class="${c}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${I[n]}</svg>`;
export const stars = () => `<span class="stars" role="img" aria-label="5 étoiles sur 5">${icon('star', 'ico star').repeat(5)}</span>`;

/* --- Image responsive AVIF/WebP, dimensions fixées (pas de décalage) --- */
export function pic(name, { cls = '', sizes = '100vw', eager = false, alt } = {}) {
  const m = manifest[name];
  const set = (ext) => m.widths.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(', ');
  const mid = m.widths.find((w) => w >= 800) || m.widths.at(-1);
  const load = eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"';
  return `<picture class="${cls}"><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img src="/images/${name}-${mid}.webp" width="${m.w}" height="${m.h}" alt="${esc(alt ?? photoAlt[name])}" decoding="async" ${load}></picture>`;
}

/* --- Titre découpé en mots (révélation mot par mot, texte présent dès le HTML) --- */
export const splitWords = (html) => {
  let i = 0;
  // La ponctuation haute reste collée au mot qui précède (espace insécable), sinon elle formerait un « mot » seul
  return html.replace(/ ([:;?!»])/g, '\u00a0$1').replace(/« /g, '«\u00a0')
    .replace(/(<[^>]+>)|([^ \t\n<]+)/g, (m, tag, word) => (tag ? tag : `<span class="w"><span style="--i:${i++}">${word}</span></span>`));
};

/* --- Typographie française, appliquée au texte du <body> à la génération ---
   (jamais aux balises, aux scripts ni au JSON-LD ; <title> et <meta> ne sont pas touchés)
   Espace insécable avant : ; ? ! et dans « », entre un nombre et son unité, dans le téléphone ;
   apostrophe typographique. */
const NBSP = '\u00a0';
const UNITS = '€|%|h\\b|min\\b|km\\b|ans?\\b|mois\\b|jours?\\b|semaines?\\b|séances?\\b|vertèbres\\b|avis\\b|étoiles\\b|profils\\b|temps\\b|★';
export const frTypo = (html) => {
  const at = html.indexOf('<body');
  if (at < 0) return html;
  return html.slice(0, at) + html.slice(at).replace(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<textarea[\s\S]*?<\/textarea>|<[^>]+>)|([^<]+)/g, (m, tag, t) => tag ?? t
    .replace(/(\p{L})'(\p{L})/gu, '$1’$2')
    .replace(/ ([:;?!»])/g, NBSP + '$1')
    .replace(/« /g, '«' + NBSP)
    .replace(new RegExp(`(\\d) (?=${UNITS})`, 'g'), '$1' + NBSP)
    .replace(/\b(0\d) (\d\d) (\d\d) (\d\d) (\d\d)\b/g, ['$1', '$2', '$3', '$4', '$5'].join(NBSP)));
};

/* --- Boutons --- */
export const rdv = (label = 'Prendre rendez-vous', cls = 'btn btn-primary') =>
  `<a class="${cls}" href="${site.links.doctolib}" target="_blank" rel="noopener"><span class="btn-label">${label}</span>${icon('arrow')}<span class="sr-only"> sur Doctolib (nouvel onglet)</span></a>`;
export const call = (cls = 'btn btn-ghost') =>
  `<a class="${cls}" href="${site.phone.href}">${icon('phone')}<span class="btn-label">${site.phone.display}</span></a>`;

/* --- FAQ accessible --- */
export const faq = (items, title = 'Questions fréquentes', id = 'faq') => `
<section class="section faq" aria-labelledby="${id}-t">
  <div class="wrap faq-grid">
    <div class="faq-head" data-reveal>
      <h2 id="${id}-t">${title}</h2>
      <p>Une autre question ? <a href="/contact/">Écrivez-moi</a> ou appelez le <a href="${site.phone.href}">${site.phone.display}</a>.</p>
    </div>
    <div class="faq-list" data-reveal>
      ${items.map((f) => `<details class="faq-item"><summary><span>${f.q}</span><span class="faq-plus" aria-hidden="true"></span></summary><div class="faq-a"><div>${f.a}</div></div></details>`).join('\n      ')}
    </div>
  </div>
</section>`;

/* --- Bandeau final de prise de RDV (dégradé animé) --- */
export const ctaFinal = (title = 'Prenez le temps <em>d’aller mieux</em>') => `
<section class="cta-final" aria-labelledby="cta-t">
  <div class="cta-bg" aria-hidden="true"></div>
  <div class="wrap cta-inner">
    <h2 id="cta-t" data-reveal>${title}</h2>
    <p data-reveal>Créneaux en temps réel sur Doctolib. Une question avant de réserver ? Appelez ou écrivez sur WhatsApp.</p>
    <div class="actions" data-reveal>${rdv('Prendre rendez-vous', 'btn btn-gold btn-lg')}${call('btn btn-light')}</div>
  </div>
</section>`;

/* --- JSON-LD ---------------------------------------------------------------
   MedicalBusiness (sous-type de LocalBusiness) : le type « Physician » est réservé
   aux médecins ; un ostéopathe non médecin ne doit pas s'en prévaloir. */
function jsonLd(p) {
  const a = site.address;
  const graph = [
    {
      '@type': ['MedicalBusiness', 'LocalBusiness'], '@id': site.url + '/#cabinet',
      name: site.name, url: site.url + '/', image: site.url + '/images/og-adrian-rodriguez.jpg', logo: site.url + '/icon-512.png',
      description: "Cabinet d'ostéopathie à Villefontaine (38090) : mal de dos, nuque, sportifs, bébés et enfants, femmes enceintes, seniors.",
      telephone: site.phone.intl, email: site.email,
      address: { '@type': 'PostalAddress', streetAddress: `${a.street}, ${a.area}`, postalCode: a.postalCode, addressLocality: a.city, addressRegion: a.region, addressCountry: a.country },
      geo: { '@type': 'GeoCoordinates', latitude: a.geo.lat, longitude: a.geo.lng },
      hasMap: site.links.google,
      areaServed: ['Villefontaine', ...site.nearby.map((n) => n.name), 'Nord-Isère'].map((name) => ({ '@type': 'Place', name })),
      medicalSpecialty: 'Osteopathic',
      sameAs: [site.links.doctolib, site.links.instagram, site.links.linkedin],
      founder: { '@id': site.url + '/#adrian' },
      // openingHoursSpecification et priceRange : à ajouter dès confirmation
    },
    { '@type': 'Person', '@id': site.url + '/#adrian', name: site.practitioner, jobTitle: 'Ostéopathe', alumniOf: { '@type': 'EducationalOrganization', name: 'ATSA' }, worksFor: { '@id': site.url + '/#cabinet' }, sameAs: [site.links.instagram, site.links.linkedin] },
    { '@type': 'WebPage', '@id': abs(p.path) + '#page', url: abs(p.path), name: p.title, description: p.description, inLanguage: 'fr-FR', isPartOf: { '@type': 'WebSite', '@id': site.url + '/#site', url: site.url + '/', name: site.name } },
  ];
  if (p.crumbs) graph.push({ '@type': 'BreadcrumbList', itemListElement: p.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: abs(c.href) })) });
  if (p.faq) graph.push({ '@type': 'FAQPage', mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: strip(f.q), acceptedAnswer: { '@type': 'Answer', text: strip(f.a) } })) });
  if (p.service) graph.push({ '@type': 'Service', name: p.service.name, serviceType: 'Ostéopathie', description: p.service.description, provider: { '@id': site.url + '/#cabinet' }, areaServed: { '@type': 'City', name: 'Villefontaine' }, url: abs(p.path) });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

/* ---------- Menus déroulants des rubriques à plusieurs pages ----------
   Ordinateur : panneau sous l'en-tête, ouvert au survol ou au clic sur la flèche.
   Mobile : volet qui se déplie dans le menu plein écran.
   Accessibilité : motif « disclosure » (lien + bouton aria-expanded), Échap ferme. */
const subLink = (href, label, path, extra = '') => `<li><a href="${href}"${path === href ? ' aria-current="page"' : ''}${extra}>${label}</a></li>`;
const catLink = (c, path) => {
  const href = `/osteopathie/${c.slug}/`;
  return `<li><a class="mega-cat" href="${href}" data-preview="${esc(c.short)}"${path === href ? ' aria-current="page"' : ''}>${symMini(c.slug)}<span>${c.label}</span></a></li>`;
};
const megaMenus = {
  osteo: (path) => `
        <div class="mega-intro" aria-hidden="true">
          <p class="mega-kicker">L'ostéopathie</p>
          <p class="mega-preview" data-mega-preview data-default="Pour chaque âge et chaque gêne, une séance adaptée. Choisissez votre profil ou ce qui vous gêne.">Pour chaque âge et chaque gêne, une séance adaptée. Choisissez votre profil ou ce qui vous gêne.</p>
        </div>
        <div class="mega-group"><p class="mega-title" id="mt-qui">Pour qui ?</p><ul aria-labelledby="mt-qui">${patients.map((c) => catLink(c, path)).join('')}</ul></div>
        <div class="mega-group"><p class="mega-title" id="mt-quoi">Pour quoi ?</p><ul aria-labelledby="mt-quoi">${troubles.map((c) => catLink(c, path)).join('')}</ul></div>
        <a class="mega-all" href="/osteopathie/">Vue d'ensemble de l'ostéopathie ${icon('arrow')}</a>`,
  cabinet: (path) => `
        <div class="mega-intro" aria-hidden="true">
          <p class="mega-kicker">Le cabinet</p>
          <p class="mega-preview" data-mega-preview data-default="Un lieu calme à Villefontaine, une approche expliquée pas à pas, et des repères pour prendre soin de vous entre deux séances.">Un lieu calme à Villefontaine, une approche expliquée pas à pas, et des repères pour prendre soin de vous entre deux séances.</p>
        </div>
        <div class="mega-group"><p class="mega-title" id="mt-cab">Découvrir</p><ul class="mega-plain" aria-labelledby="mt-cab">${
          subLink('/cabinet/', "L'approche et le cabinet", path, ' data-preview="Ma formation, ma façon de travailler et le cabinet en images."')}${
          subLink('/avis/', 'Avis des patients', path, ' data-preview="Les avis Google laissés par les patients, cités tels quels."')}${
          subLink('/tarifs/', 'Tarifs et déroulé de la séance', path, ' data-preview="Prix, durée, remboursement par la mutuelle et ce qu’il faut apporter."')}</ul></div>
        <div class="mega-group"><p class="mega-title" id="mt-cons">Conseils</p><ul aria-labelledby="mt-cons">${articles.map((a) => {
          const href = `/conseils/${a.slug}/`;
          return `<li><a class="mega-cat" href="${href}" data-preview="${esc(a.description)}"${path === href ? ' aria-current="page"' : ''}>${symMini(a.illu)}<span>${a.h1.replace(/ :.*$/, '')}</span></a></li>`;
        }).join('')}</ul></div>
        <a class="mega-all" href="/conseils/">Tous les conseils ${icon('arrow')}</a>`,
};
const navItem = (n, i, p, isCurrent) => {
  // « page » pour la page elle-même, « true » pour la rubrique qui contient la page affichée
  const cur = isCurrent(n.href, n.also) ? ` aria-current="${p.path === n.href ? 'page' : 'true'}"` : '';
  if (!n.menu) return `<li style="--i:${i}"><a class="nav-link" href="${n.href}"${cur}>${n.label}</a></li>`;
  const id = `menu-${n.menu}`;
  return `<li class="has-menu" style="--i:${i}" data-menu>
        <span class="nav-row"><a class="nav-link" href="${n.href}"${cur}>${n.label}</a><button class="nav-more" type="button" aria-expanded="false" aria-controls="${id}"><span class="sr-only">Afficher les pages de la rubrique ${n.label}</span>${icon('chevron')}</button></span>
        <div class="mega mega-${n.menu}" id="${id}"><div class="mega-in"><div class="mega-grid">${megaMenus[n.menu](p.path)}</div></div></div>
      </li>`;
};

const crumbsHtml = (c) => `<nav class="crumbs wrap" aria-label="Fil d'Ariane"><ol>${c.map((x, i) => (i < c.length - 1 ? `<li><a href="${x.href}">${x.label}</a></li>` : `<li aria-current="page">${x.label}</li>`)).join('')}</ol></nav>`;

/* --- Page complète --- */
export function render(p) {
  const isCurrent = (h, also = []) => (h === '/' ? p.path === '/' : [h, ...also].some((x) => p.path.startsWith(x)));
  const a = site.address;
  return `<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${abs(p.path)}">
<meta name="robots" content="${p.noindex || DEMO ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}">
<meta name="theme-color" content="#faf8f3">
<meta name="geo.region" content="FR-38"><meta name="geo.placename" content="Villefontaine"><meta name="geo.position" content="${a.geo.lat};${a.geo.lng}">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="website"><meta property="og:locale" content="${site.locale}"><meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.description)}"><meta property="og:url" content="${abs(p.path)}">
<meta property="og:image" content="${site.url}/images/og-adrian-rodriguez.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Adrian Rodriguez, ostéopathe à Villefontaine">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(p.title)}"><meta name="twitter:description" content="${esc(p.description)}"><meta name="twitter:image" content="${site.url}/images/og-adrian-rodriguez.jpg">
<script>document.documentElement.classList.replace('no-js','js')</script>
<link rel="stylesheet" href="/src/styles/main.css">
<script type="application/ld+json">${jsonLd(p)}</script>
<script type="module" src="/src/scripts/main.js"></script>
</head>
<body data-page="${p.id}"${DEMO ? ' data-demo' : ''}>
<a class="skip" href="#contenu">Aller au contenu</a>
<div class="progress" aria-hidden="true"><span></span></div>
<header class="header" data-header>
  <div class="wrap header-in">
    <a class="brand" href="/" aria-label="Adrian Rodriguez, ostéopathe à Villefontaine : accueil">
      <img src="/images/logo-160.webp" width="44" height="44" alt="">
      <span><strong>Adrian Rodriguez</strong><small>Ostéopathe · Villefontaine</small></span>
    </a>
    <nav class="nav" id="nav" aria-label="Navigation principale">
      <ul class="nav-top">${nav.map((n, i) => navItem(n, i, p, isCurrent)).join('')}</ul>
      <div class="nav-extra"><a href="${site.phone.href}">${icon('phone')} ${site.phone.display}</a><a href="${site.links.directions}" target="_blank" rel="noopener">${icon('pin')} Itinéraire vers le cabinet</a><a href="${site.links.instagram}" target="_blank" rel="noopener">${icon('insta')} @adrianosteo</a></div>
    </nav>
    ${rdv('Prendre RDV', 'btn btn-primary btn-sm header-cta')}
    <button class="burger" type="button" aria-expanded="false" aria-controls="nav" data-burger><span class="sr-only">Ouvrir le menu</span><i></i><i></i></button>
  </div>
</header>
${p.crumbs ? crumbsHtml(p.crumbs) : ''}
<main id="contenu" tabindex="-1">
${p.body}
</main>
<footer class="footer">
  <div class="wrap footer-top">
    <p class="footer-claim">Ostéopathie à Villefontaine,<br><em>pour tout le Nord-Isère.</em></p>
    ${rdv('Prendre rendez-vous', 'btn btn-gold')}
  </div>
  <div class="wrap footer-grid">
    <div>
      <p class="f-title">Le cabinet</p>
      <address>${a.street}<br>${a.area}<br>${a.postalCode} ${a.city}</address>
      <p><a href="${site.links.directions}" target="_blank" rel="noopener">Itinéraire</a> · <a href="${site.links.google}" target="_blank" rel="noopener">Fiche Google</a></p>
    </div>
    <div>
      <p class="f-title">Contact</p>
      <p><a href="${site.phone.href}">${site.phone.display}</a><br><a href="mailto:${site.email}">${site.email}</a></p>
      <p>Horaires : ${tbc(site.tbc.hours)}</p>
    </div>
    <div>
      <p class="f-title">Navigation</p>
      <ul>${nav.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}</ul>
    </div>
    <div>
      <p class="f-title">Ressources</p>
      <ul><li><a href="/avis/">Avis patients</a></li><li><a href="/conseils/">Conseils</a></li><li><a href="${site.links.instagram}" target="_blank" rel="noopener">Instagram</a></li><li><a href="${site.links.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li><li><a href="${site.links.doctolib}" target="_blank" rel="noopener">Doctolib</a></li></ul>
    </div>
  </div>
  <div class="wrap footer-legal">
    <p>© <span data-year>2026</span> Adrian Rodriguez, ostéopathe · Villefontaine (38090)</p>
    <p><a href="/mentions-legales/">Mentions légales</a> · <a href="/confidentialite/">Confidentialité</a></p>
  </div>
</footer>
${DEMO ? '<p class="demo-badge">Maquette · version de démonstration</p>' : ''}
<aside class="fab" aria-label="Prise de rendez-vous rapide">
  <a class="fab-call" href="${site.phone.href}" aria-label="Appeler le ${site.phone.display}">${icon('phone')}</a>
  ${rdv('Prendre RDV', 'btn btn-primary fab-rdv')}
</aside>
</body>
</html>
`;
}
