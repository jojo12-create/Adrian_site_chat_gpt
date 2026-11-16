/* ==========================================================================
   CONTENUS DES PAGES
   Ton : calme, concret, orienté bénéfices. Aucune promesse de guérison :
   l'ostéopathie est présentée en complément du suivi médical.
   Chaque page : 1 mot-clé principal + 3 à 5 secondaires (commentaire « SEO »).
   ========================================================================== */
import { site, reviews, reviewCount, TBC } from './site.mjs';
import { pic, rdv, call, faq, ctaFinal, icon, stars, tbc, splitWords, esc } from './layout.mjs';
import { patients, troubles, categories, spineZones } from './categories.mjs';
import { illu } from './illustrations.mjs';

const T = site.tbc, A = site.address, L = site.links;
const home = { href: '/', label: 'Accueil' };
const osteo = { href: '/osteopathie/', label: 'Ostéopathie' };

/* =====================================================================
   CATÉGORIES (7 patients + 7 troubles) : composants partagés
   ===================================================================== */
const catHref = (c) => `/osteopathie/${c.slug}/`;
const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

/* Carte catégorie : illustration animée, inclinaison 3D, reflet lumineux, zoom doux */
const catCard = (c, i = 0) => `<li class="cat-card" data-tilt data-reveal style="--d:${i % 4}"><a href="${catHref(c)}">
  ${illu(c.slug, { tone: c.tone })}
  <span class="cat-body"><span class="cat-label">${c.label}</span><span class="cat-short">${c.short}</span><span class="cat-go">Découvrir ${icon('arrow')}</span></span>
</a></li>`;
const catGrid = (list, id) => `<ul class="cat-grid" id="${id}">${list.map(catCard).join('')}</ul>`;

/* Section catégories (accueil et hub) : deux familles */
const catSection = (h = 'h2') => `
<section class="section cats" aria-labelledby="cats-t">
  <div class="wrap">
    <div class="cats-head">
      <${h} id="cats-t" data-reveal>Un accompagnement <em>pour chacun</em></${h}>
      <p class="lead" data-reveal>À chaque âge et à chaque étape de vie, une histoire différente à écouter. Choisissez votre profil ou ce qui vous gêne.</p>
    </div>
    <h3 class="cats-sub" data-reveal>Pour qui ?</h3>
    ${catGrid(patients.map((c) => ({ ...c })), 'grid-patients')}
    <h3 class="cats-sub" data-reveal>Pour quoi ?</h3>
    ${catGrid(troubles, 'grid-troubles')}
  </div>
</section>`;

/* =====================================================================
   COLONNE VERTÉBRALE 3D (Three.js, chargée en différé)
   Le texte (zones, troubles, liens) est en HTML : indexable et accessible.
   ===================================================================== */
const spineFallback = () => {
  let v = '';
  for (let i = 0; i < 24; i++) {
    const y = 18 + i * 19.5, x = 110 + Math.sin((i / 23) * Math.PI * 2) * 14, w = 26 + Math.min(i, 18) * 1.6;
    const zone = i < 7 ? 'cervicales' : i < 19 ? 'dorsales' : 'lombaires';
    v += `<rect class="vert" data-zone="${zone}" x="${(x - w / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="14" rx="7"/>`;
  }
  v += `<path class="vert" data-zone="sacrum" d="M86 492 Q110 470 134 492 L120 540 Q110 552 100 540 Z"/>`;
  return `<svg class="spine-fallback" viewBox="0 0 220 560" aria-hidden="true"><path class="spine-cord" d="M110 10 C 128 120, 92 250, 110 380 S 104 470, 110 540"/>${v}</svg>`;
};
const spineSection = (h = 'h2') => `
<section class="spine-sec" id="colonne" aria-labelledby="spine-t" data-spine-section>
  <div class="spine-glow" aria-hidden="true"></div>
  <div class="wrap spine-grid">
    <div class="spine-intro">
      <${h} id="spine-t" data-reveal>Votre colonne, <em>vertèbre par vertèbre</em></${h}>
      <p class="lead" data-reveal>24 vertèbres mobiles, des disques, le sacrum et le bassin : faites tourner la colonne et choisissez une zone pour voir les troubles qui s'y rattachent.</p>
      <div class="spine-tabs" role="tablist" aria-label="Zones de la colonne vertébrale" data-spine-tabs>
        ${spineZones.map((z, i) => `<button role="tab" type="button" id="sz-${z.id}" aria-controls="sp-${z.id}" aria-selected="${i === 2}" tabindex="${i === 2 ? 0 : -1}" data-zone="${z.id}"><span>${z.label}</span><small>${z.range}</small></button>`).join('')}
      </div>
    </div>
    <div class="spine-stage" data-spine-stage>
      <div class="spine-canvas" data-spine-canvas role="img" aria-label="Modèle 3D interactif de la colonne vertébrale : cervicales, dorsales, lombaires, sacrum, coccyx et bassin. Les zones sont aussi accessibles par les boutons ci-contre.">${spineFallback()}</div>
      <p class="spine-hint" aria-hidden="true">${icon('arrow')} Glissez pour faire tourner · survolez une zone</p>
    </div>
    <div class="spine-panels">
      ${spineZones.map((z, i) => `<div class="spine-panel" role="tabpanel" id="sp-${z.id}" aria-labelledby="sz-${z.id}" tabindex="0"${i === 2 ? '' : ' hidden'}>
        <p class="spine-panel-title">${z.label} <small>${z.range}</small></p>
        <p>${z.text}</p>
        <ul class="spine-troubles">${z.troubles.map((s) => `<li><a href="${catHref(bySlug[s])}">${bySlug[s].label} ${icon('arrow')}</a></li>`).join('')}${z.extra.map((e) => `<li><span>${e}</span></li>`).join('')}</ul>
      </div>`).join('')}
    </div>
  </div>
</section>`;

/* Articles conseils (utilisés par l'accueil et la page Conseils) */
const articles = [
  { slug: 'premiere-consultation', illu: 'adultes', h1: 'Première consultation : le temps de se rencontrer',
    title: "Première consultation chez l'ostéopathe : déroulé", description: "Comment se passe une première consultation chez l'ostéopathe à Villefontaine : entretien, examen, gestes expliqués, droit de refuser.",
    points: ["Le rendez-vous commence par un entretien sur vos symptômes, antécédents et attentes.", "Le praticien peut ensuite proposer un examen et discuter des techniques envisagées.", "Vous pouvez refuser un geste ou interrompre la séance à tout moment.", "Une orientation médicale est proposée lorsque les signes le justifient."] },
  { slug: 'mal-de-dos', illu: 'lombalgie', h1: "Mal de dos : comprendre avant d'agir",
    title: 'Mal de dos : quand consulter, quels signes surveiller', description: "Mal de dos : rester actif, signes d'alerte qui imposent un avis médical rapide, et place de l'ostéopathie. Conseils généraux d'un ostéopathe.",
    points: ["Le mal de dos a de nombreuses causes ; la prise en charge dépend du contexte.", "Rester actif dans la mesure du possible est souvent conseillé.", "Consultez rapidement en cas de faiblesse, de troubles urinaires ou intestinaux, de fièvre, de traumatisme important ou de douleur inhabituelle."] },
  { slug: 'sport-recuperation', illu: 'sportifs', h1: "La récupération fait aussi partie de l'entraînement",
    title: 'Sport et récupération : les fondamentaux', description: "Sommeil, progression des charges, jours de repos, alimentation : les bases de la récupération sportive, et ce que l'ostéopathie peut (ou non) apporter.",
    points: ["Le sommeil, la progression des charges, les jours de récupération et une alimentation adaptée sont les bases de la récupération.", "L'ostéopathie peut s'intégrer à une démarche globale de confort et de mobilité.", "Elle ne remplace ni une rééducation indiquée ni une évaluation médicale après blessure."] },
];

/* =====================================================================
   ACCUEIL
   ===================================================================== */
const homeFaq = [
  { q: "Ai-je vraiment besoin d'une séance ?", a: `Si une gêne revient, limite vos mouvements ou s'installe depuis plusieurs jours, une séance peut aider. En cas de doute, <a href="/contact/">décrivez votre situation</a> : si l'ostéopathie n'est pas adaptée, je vous oriente vers votre médecin.` },
  { q: "Je n'habite pas Villefontaine, est-ce loin ?", a: `Le cabinet est aux Ravinelles, avec un parking gratuit et une entrée de plain-pied, près de L'Isle-d'Abeau, Bourgoin-Jallieu, Saint-Quentin-Fallavier et La Verpillière. <a href="/tarifs/#acces">Voir l'accès</a>.` },
  { q: 'Combien coûte une séance ?', a: `Tarif adulte : ${tbc(T.price)}. Tous les tarifs sont sur la page <a href="/tarifs/">Tarifs & infos</a>.` },
  { q: 'Est-ce remboursé par la mutuelle ?', a: "L'Assurance maladie ne rembourse pas l'ostéopathie, mais beaucoup de mutuelles prennent en charge une partie des séances selon votre contrat. Une facture vous est remise." },
  { q: 'Comment se déroule une séance ?', a: "Un échange sur votre histoire, des tests de mobilité, un traitement manuel adapté et expliqué, puis des conseils pour la suite. Vous pouvez refuser un geste ou interrompre la séance." },
];

const pageHome = {
  id: 'accueil', path: '/', file: 'index.html',
  // SEO : « ostéopathe Villefontaine » · ostéopathe Nord-Isère · ostéopathe L'Isle-d'Abeau · cabinet ostéopathie 38090 · ostéopathe Bourgoin-Jallieu
  title: 'Ostéopathe à Villefontaine (38090) | Adrian Rodriguez',
  description: "Adrian Rodriguez, ostéopathe diplômé de l'ATSA à Villefontaine : bébés, enfants, grossesse, adultes, seniors, sportifs. Rendez-vous sur Doctolib.",
  faq: homeFaq,
  body: `
<section class="hero" aria-labelledby="h1" data-hero>
  <div class="hero-depth" aria-hidden="true">
    <span class="orb orb-1" data-depth="0.15"></span><span class="orb orb-2" data-depth="0.3"></span>
    <svg class="hero-shape" data-depth="0.25" viewBox="0 0 600 600"><defs><linearGradient id="g-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3e5e42"/><stop offset="1" stop-color="#243c2f"/></linearGradient></defs><path data-morph d="M421,317Q401,384,343,424Q285,464,214,438Q143,412,121,341Q99,270,140,206Q181,142,254,121Q327,100,384,149Q441,198,441,257.5Q441,317,421,317Z" fill="url(#g-hero)"/></svg>
  </div>
  <div class="wrap hero-grid">
    <div class="hero-text" data-hero-text>
      <p class="hero-place">${icon('pin')} Villefontaine · Nord-Isère</p>
      <h1 id="h1" class="split">${splitWords('Ostéopathe à Villefontaine, <em>pour que votre corps</em> retrouve son axe')}</h1>
      <p class="lead hero-lead">Mal de dos, nuque raide, grossesse, sport ou premiers mois de bébé : j'écoute, j'explique chaque geste et je n'agis qu'avec votre accord.</p>
      <div class="actions hero-actions">${rdv()}${call()}</div>
      <ul class="hero-proof">
        <li>${stars()}<a href="${L.google}" target="_blank" rel="noopener">Avis Google</a></li>
        <li>${icon('check')} Diplômé de l'école ATSA</li>
        <li>${icon('car')} Parking gratuit</li>
      </ul>
    </div>
    <div class="hero-visual" data-hero-visual>
      <svg class="hero-rings" viewBox="0 0 400 400" aria-hidden="true" data-depth="0.6"><ellipse cx="200" cy="200" rx="190" ry="70" pathLength="1"/><ellipse cx="200" cy="200" rx="170" ry="60" pathLength="1" transform="rotate(-24 200 200)"/></svg>
      <div class="arch" data-tilt-hero>${pic('adrian-bureau', { eager: true, sizes: '(min-width: 1024px) 38vw, 90vw' })}</div>
      <div class="hero-badge" data-depth="0.9"><img src="/images/logo-160.webp" width="80" height="80" alt=""><span>Ostéopathie<br><em>tous âges</em></span></div>
      <div class="hero-chip" data-depth="1.2">${stars()}<span>${reviewCount} avis 5★</span></div>
    </div>
  </div>
  <a class="scroll-hint" href="#promesses"><span>Découvrir</span><i aria-hidden="true"></i></a>
</section>

<section class="trust" id="promesses" aria-label="Trois engagements">
  <ul class="wrap trust-list">
    <li data-reveal><span class="trust-n" aria-hidden="true">I</span><strong>À l’écoute</strong><span>Une prise en charge adaptée à vos besoins</span></li>
    <li data-reveal><span class="trust-n" aria-hidden="true">II</span><strong>Explications claires</strong><span>Comprendre avant d’agir</span></li>
    <li data-reveal><span class="trust-n" aria-hidden="true">III</span><strong>Du quotidien au sport</strong><span>Un accompagnement individualisé</span></li>
  </ul>
</section>

<section class="section intro" aria-labelledby="intro-t">
  <div class="wrap intro-grid">
    <h2 id="intro-t" data-reveal>Votre corps a son histoire. <em>Votre accompagnement aussi.</em></h2>
    <div data-reveal>
      <p class="lead">Je suis Adrian Rodriguez, ostéopathe diplômé de l'école ATSA. Au cabinet de Villefontaine, je prends le temps d'écouter votre histoire, de comprendre ce qui vous gêne et de discuter avec vous d'une approche adaptée à votre situation.</p>
      <a class="link" href="/cabinet/">Découvrir mon approche ${icon('arrow')}</a>
    </div>
  </div>
</section>

${catSection()}

<section class="marquee-sec" id="avis" aria-labelledby="avis-t">
  <div class="wrap marquee-head">
    <h2 id="avis-t" data-reveal>Ils en parlent <em>mieux que moi</em></h2>
    <button class="marquee-toggle" type="button" aria-pressed="false" data-marquee-toggle>${icon('pause', 'ico i-pause')}${icon('play', 'ico i-play')}<span>Mettre en pause</span></button>
  </div>
  <div class="marquee" data-marquee>
    ${[0, 1].map((row) => { const list = row ? reviews.slice(4).concat(reviews.slice(0, 4)) : reviews; return `<div class="marquee-row${row ? ' reverse' : ''}"><ul class="marquee-track">${list.map((r) => `<li class="review"><blockquote><p>« ${esc(r.t)} »</p></blockquote><p class="review-by">${stars()} <span>${esc(r.a)}</span></p></li>`).join('')}</ul><ul class="marquee-track" aria-hidden="true">${list.map((r) => `<li class="review"><p>« ${esc(r.t)} »</p><p class="review-by">${stars()} <span>${esc(r.a)}</span></p></li>`).join('')}</ul></div>`; }).join('')}
  </div>
  <p class="wrap marquee-foot"><a class="link" href="/avis/">Tous les avis ${icon('arrow')}</a></p>
</section>

${spineSection()}

<section class="steps-sec" aria-labelledby="steps-t" data-pin-steps>
  <div class="steps-head wrap">
    <h2 id="steps-t" data-reveal>Une séance <em>en quatre temps</em></h2>
    <p data-reveal>Pas de mystère : vous savez ce qui se passe, et pourquoi.</p>
  </div>
  <ol class="steps-track">
    <li class="step"><div class="step-media">${pic('adrian-echange', { sizes: '(min-width: 1024px) 30vw, 90vw' })}</div><div class="step-body"><span class="step-n" aria-hidden="true">01</span><h3>L'échange</h3><p>Vos symptômes, votre histoire, votre quotidien, vos traitements. C'est le moment de tout dire et de poser vos questions.</p></div></li>
    <li class="step"><div class="step-media">${pic('soin-nuque', { sizes: '(min-width: 1024px) 30vw, 90vw' })}</div><div class="step-body"><span class="step-n" aria-hidden="true">02</span><h3>Les tests</h3><p>J'observe votre posture et la mobilité de chaque région pour repérer les zones de tension.</p></div></li>
    <li class="step"><div class="step-media">${pic('soin-bassin', { sizes: '(min-width: 1024px) 30vw, 90vw' })}</div><div class="step-body"><span class="step-n" aria-hidden="true">03</span><h3>Le traitement</h3><p>Des techniques manuelles adaptées à votre âge et à votre confort, toujours expliquées. Vous pouvez refuser un geste ou interrompre la séance.</p></div></li>
    <li class="step"><div class="step-media">${pic('adrian-ecoute', { sizes: '(min-width: 1024px) 30vw, 90vw' })}</div><div class="step-body"><span class="step-n" aria-hidden="true">04</span><h3>Les conseils</h3><p>Des gestes simples pour la suite, et un avis honnête sur l'utilité d'une nouvelle séance.</p></div></li>
  </ol>
</section>

<section class="section sport-band" aria-labelledby="sport-t">
  <div class="wrap sport-grid">
    <div class="sport-media" data-parallax="-6">${pic('soin-dos', { sizes: '(min-width: 1024px) 45vw, 90vw' })}</div>
    <div class="sport-text">
      <h2 id="sport-t" data-reveal>Votre pratique évolue. <em>Votre corps aussi.</em></h2>
      <p data-reveal>Course à pied, sports collectifs, musculation ou boxe : chaque discipline impose ses contraintes. Adrian travaille notamment avec les boxeurs Jordan Rodriguez et Yanis Meha et participe au suivi des boxeurs du Ring Berjallien.</p>
      <ol class="season" data-reveal><li><strong>Avant l’effort</strong><span>Mobilité et objectifs</span></li><li><strong>Au fil de la saison</strong><span>Charge et contraintes</span></li><li><strong>En récupération</strong><span>Une séance adaptée à votre état</span></li></ol>
      <a class="btn btn-gold" href="/osteopathie/sportifs/" data-magnetic><span class="btn-label">Ostéopathie du sport</span>${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section numbers" aria-labelledby="num-t">
  <div class="wrap">
    <h2 id="num-t" class="sr-only">Le cabinet en chiffres</h2>
    <ul class="num-list">
      <li data-reveal><strong><span data-count="${reviewCount}">${reviewCount}</span></strong><span>avis Google 5 étoiles publiés</span></li>
      <li data-reveal><strong><span data-count="${patients.length}">${patients.length}</span></strong><span>profils accompagnés, du nouveau-né au senior</span></li>
      <li data-reveal><strong><span data-count="24">24</span></strong><span>vertèbres mobiles, une approche globale</span></li>
      <li data-reveal><strong>${tbc(T.years)}</strong><span>années d'expérience</span></li>
    </ul>
  </div>
</section>

<section class="section offer" aria-labelledby="offer-t">
  <div class="wrap offer-grid">
    <div class="offer-text" data-reveal>
      <h2 id="offer-t">Un tarif <em>clair</em>, sans surprise</h2>
      <p class="lead">Le prix est affiché avant la réservation. Une facture vous est remise pour votre mutuelle, qui rembourse souvent une partie de la séance.</p>
      <a class="link" href="/tarifs/">Tous les tarifs et infos pratiques ${icon('arrow')}</a>
    </div>
    <div class="price-card" data-tilt data-reveal>
      <p class="price-label">Consultation adulte</p>
      <p class="price">${tbc(T.price)}</p>
      <ul class="price-incl">
        <li>${icon('clock')} Durée : ${tbc(T.duration)}</li>
        <li>${icon('euro')} Facture pour la mutuelle</li>
        <li>${icon('check')} Sans ordonnance (sauf bébé de moins de 6 mois)</li>
      </ul>
      ${rdv('Réserver ce créneau', 'btn btn-primary btn-block')}
    </div>
  </div>
</section>

<section class="section access" id="acces" aria-labelledby="acces-t">
  <div class="wrap access-grid">
    <div class="access-text" data-reveal>
      <h2 id="acces-t">Plus proche <em>que vous ne le pensez</em></h2>
      <p class="lead">Aux Ravinelles, à Villefontaine. Parking gratuit, entrée de plain-pied.</p>
      <ul class="travel">${site.nearby.map((n) => `<li><span>${n.name}</span><span>${tbc(n.time)}</span></li>`).join('')}</ul>
      <p class="addr">${icon('pin')} <span>${A.street}, ${A.area}<br>${A.postalCode} ${A.city}</span></p>
      <div class="actions"><a class="btn btn-ghost" href="${L.directions}" target="_blank" rel="noopener" data-magnetic>${icon('pin')}<span class="btn-label">Itinéraire</span></a>${rdv()}</div>
    </div>
    ${mapCard()}
  </div>
</section>

<section class="section conseils-teaser" aria-labelledby="ct-t">
  <div class="wrap">
    <h2 id="ct-t" data-reveal>Comprendre votre santé <em>et vos mouvements</em></h2>
    <ul class="article-list">${articles.map((a, i) => `<li data-reveal data-tilt style="--d:${i}"><a href="/conseils/${a.slug}/">${illu(a.illu, { tone: i % 2 ? 'green' : 'gold', size: 'illu-sm' })}<span class="art-title">${a.h1}</span><span class="cat-go">Lire ${icon('arrow')}</span></a></li>`).join('')}</ul>
  </div>
</section>

${faq(homeFaq)}
${ctaFinal()}
`,
};

/* Carte Google Maps chargée au clic : gratuit, sans clé, sans traceur avant consentement */
function mapCard() {
  return `<div class="map-card" data-reveal>
      <div class="map-frame" data-map="${esc(L.mapEmbed)}">
        <div class="map-placeholder">
          <svg class="map-art" viewBox="0 0 400 300" aria-hidden="true"><path d="M0 210 C80 180 120 240 200 200 S 330 140 400 170" /><path d="M60 0 C90 90 40 160 110 300" /><path d="M260 0 C240 80 300 150 280 300" /><circle cx="200" cy="150" r="10"/></svg>
          <button class="btn btn-light" type="button" data-map-load>${icon('pin')}<span class="btn-label">Afficher la carte Google</span></button>
          <p class="map-note">La carte est fournie par Google : elle n'est chargée qu'après votre clic.</p>
        </div>
      </div>
      <a class="map-gbp" href="${L.google}" target="_blank" rel="noopener">Voir la fiche Google du cabinet ${icon('arrow')}</a>
    </div>`;
}

/* =====================================================================
   OSTÉOPATHIE (hub)
   ===================================================================== */
const osteoFaq = [
  { q: "Qu'est-ce que l'ostéopathie ?", a: "Une approche manuelle qui recherche les pertes de mobilité (articulations, muscles, tissus) pouvant entretenir une gêne, et cherche à les relâcher avec les mains." },
  { q: 'Quelle différence avec un kinésithérapeute ?', a: "Le kinésithérapeute rééduque, souvent sur prescription, avec des exercices. L'ostéopathe travaille avec les mains sur l'origine des tensions, en séances plus espacées. Les deux se complètent." },
  { q: 'Combien de séances faut-il ?', a: "Il n'y a pas de nombre fixe. À la fin de chaque séance, je vous dis franchement si un suivi est utile." },
  { q: "Quand faut-il voir un médecin plutôt qu'un ostéopathe ?", a: "En cas de fièvre, de douleur après un choc important, de perte de force, de douleur dans la poitrine ou de troubles urinaires : consultez un médecin ou appelez le 15." },
];

const pageOsteo = {
  id: 'osteopathie', path: '/osteopathie/', file: 'osteopathie/index.html',
  // SEO : « ostéopathie Villefontaine » · motifs de consultation ostéopathe · quand consulter un ostéopathe · ostéopathe Nord-Isère
  title: 'Ostéopathie à Villefontaine : patients et motifs',
  description: "Nouveau-nés, enfants, grossesse, adultes, seniors, sportifs ; lombalgie, cervicalgie, sciatique : quand consulter un ostéopathe à Villefontaine.",
  crumbs: [home, osteo], faq: osteoFaq,
  body: `
<section class="page-hero" aria-labelledby="h1">
  <div class="wrap">
    <h1 id="h1" class="split display">${splitWords("L'ostéopathie, <em>pour qui, pour quoi ?</em>")}</h1>
    <div class="page-hero-sub" data-reveal>
      <p class="lead">Une approche manuelle qui cherche à redonner de la mobilité là où le corps se crispe. Chaque séance s'adapte à votre âge, votre histoire et ce que vous ressentez.</p>
      ${rdv()}
    </div>
  </div>
</section>
${catSection()}
${spineSection()}
<section class="section alert-sec" aria-labelledby="alert-t">
  <div class="wrap alert-grid">
    <h2 id="alert-t" data-reveal>Quand voir <em>d'abord un médecin</em></h2>
    <div data-reveal>
      <p>L'ostéopathie ne remplace pas un diagnostic médical. Consultez votre médecin, ou appelez le 15 en cas d'urgence, si la douleur s'accompagne :</p>
      <ul class="dash">
        <li>de fièvre ou d'une perte de poids inexpliquée ;</li>
        <li>d'une perte de force ou de fourmillements importants ;</li>
        <li>de troubles urinaires ou digestifs inhabituels ;</li>
        <li>d'une douleur dans la poitrine, ou après un choc important.</li>
      </ul>
    </div>
  </div>
</section>
${faq(osteoFaq)}
${ctaFinal()}
`,
};

/* =====================================================================
   PAGES CATÉGORIE (14)
   ===================================================================== */
const categoryPages = categories.map((c) => {
  const famLabel = c.family === 'patients' ? 'Pour qui ?' : 'Pour quoi ?';
  const others = categories.filter((o) => o.family === c.family && o.slug !== c.slug).slice(0, 3);
  const otherFam = categories.filter((o) => o.family !== c.family).slice(0, 3);
  return {
    id: 'categorie', path: catHref(c), file: `osteopathie/${c.slug}/index.html`,
    title: c.title, description: c.description,
    crumbs: [home, osteo, { href: catHref(c), label: c.label }],
    faq: c.faq, service: { name: `Ostéopathie : ${c.label.toLowerCase()}`, description: c.lead },
    body: `
<section class="cat-hero" aria-labelledby="h1">
  <div class="wrap cat-hero-grid">
    <div>
      <p class="cat-family">${famLabel}</p>
      <h1 id="h1" class="split">${splitWords(c.h1.replace(/ : (.*)$/, ' : <em>$1</em>'))}</h1>
      <p class="lead" data-reveal>${c.lead}</p>
      <div class="actions" data-reveal>${rdv()}${call()}</div>
    </div>
    <div class="cat-hero-visual" data-reveal>${illu(c.slug, { tone: c.tone, size: 'illu-xl' })}</div>
  </div>
</section>

<section class="section cases" aria-labelledby="cases-t">
  <div class="wrap">
    <h2 id="cases-t" data-reveal>Vous vous <em>reconnaissez ?</em></h2>
    <ul class="case-list">${c.cases.map((x, i) => `<li data-tilt data-reveal><span class="case-n" aria-hidden="true">${['I', 'II', 'III'][i]}</span><p>${x}</p></li>`).join('')}</ul>
  </div>
</section>

<section class="section detail" aria-labelledby="quand-t">
  <div class="wrap detail-grid">
    <div data-reveal>
      <h2 id="quand-t">Quand consulter</h2>
      <ul class="checks">${c.when.map((w) => `<li>${icon('check')}<span>${w}</span></li>`).join('')}</ul>
      ${c.photo ? `<div class="detail-photo" data-parallax="-5">${pic(c.photo, { sizes: '(min-width: 1024px) 40vw, 90vw' })}</div>` : ''}
    </div>
    <div data-reveal>
      <h2>Comment ça se passe</h2>
      <p>${c.session}</p>
      ${c.note ? `<p class="note">${c.note}</p>` : ''}
      ${c.terrain ? `<h3>Sur le terrain</h3><p>${c.terrain}</p>` : ''}
      <h3>Ce que l'ostéopathie peut apporter, et ses limites</h3>
      <p>${c.limits}</p>
      <div class="medical"><h3>Quand privilégier un avis médical</h3><p>${c.medical}</p></div>
      <p class="price-inline">Séance : <strong>${tbc(T.price)}</strong> · Durée : <strong>${tbc(T.duration)}</strong> · <a href="/tarifs/">Tarifs et remboursement</a></p>
    </div>
  </div>
</section>
${faq(c.faq)}
<section class="section others" aria-labelledby="others-t">
  <div class="wrap">
    <h2 id="others-t" data-reveal>À découvrir <em>aussi</em></h2>
    <ul class="cat-grid cat-grid-3">${[...others, ...otherFam].slice(0, 6).map(catCard).join('')}</ul>
    <p><a class="link" href="/osteopathie/">Toutes les catégories ${icon('arrow')}</a></p>
  </div>
</section>
${ctaFinal()}
`,
  };
});

/* =====================================================================
   CONSEILS (3 articles de la démo, enrichis)
   ===================================================================== */
const conseilsCrumb = { href: '/conseils/', label: 'Conseils' };
const pageConseils = {
  id: 'conseils', path: '/conseils/', file: 'conseils/index.html',
  // SEO : « conseils ostéopathe » · mal de dos · première consultation · récupération sportive
  title: 'Conseils santé et mouvement | Ostéopathe Villefontaine',
  description: "Conseils pratiques d'un ostéopathe à Villefontaine : première consultation, mal de dos, récupération sportive. Des repères simples et prudents.",
  crumbs: [home, conseilsCrumb],
  body: `
<section class="page-hero" aria-labelledby="h1"><div class="wrap"><h1 id="h1" class="split display">${splitWords('Comprendre son corps, <em>un article à la fois</em>')}</h1><p class="lead" data-reveal>Des repères généraux sur la consultation, le dos et le sport. Ils ne remplacent pas un avis médical.</p></div></section>
<section class="section"><div class="wrap"><ul class="article-list">${articles.map((a, i) => `<li data-reveal data-tilt style="--d:${i}"><a href="/conseils/${a.slug}/">${illu(a.illu, { tone: i % 2 ? 'green' : 'gold', size: 'illu-sm' })}<span class="art-title">${a.h1}</span><span class="cat-go">Lire ${icon('arrow')}</span></a></li>`).join('')}</ul></div></section>
${ctaFinal()}`,
};
const articlePages = articles.map((a) => ({
  id: 'article', path: `/conseils/${a.slug}/`, file: `conseils/${a.slug}/index.html`, title: a.title, description: a.description,
  crumbs: [home, conseilsCrumb, { href: `/conseils/${a.slug}/`, label: a.h1.split(' :')[0] }],
  body: `
<article class="section article" aria-labelledby="h1"><div class="wrap article-grid">
  <div><h1 id="h1" class="split">${splitWords(a.h1.replace(/ : (.*)$/, ' : <em>$1</em>'))}</h1>
  <h2>Les points essentiels</h2><ul class="checks">${a.points.map((p) => `<li>${icon('check')}<span>${p}</span></li>`).join('')}</ul>
  <p class="note">Ces informations sont générales et ne remplacent pas un avis médical. Pour aller plus loin : <a href="https://www.ameli.fr" target="_blank" rel="noopener">ameli.fr</a>.</p>
  <div class="actions">${rdv()}</div></div>
  <div class="article-visual">${illu(a.illu, { size: 'illu-xl' })}</div>
</div></article>
${ctaFinal()}`,
}));

/* =====================================================================
   AVIS
   ===================================================================== */
const pageAvis = {
  id: 'avis', path: '/avis/', file: 'avis/index.html',
  // SEO : « avis ostéopathe Villefontaine » · avis Adrian Rodriguez · témoignages patients
  title: 'Avis patients | Adrian Rodriguez, ostéopathe Villefontaine',
  description: "Avis Google de patients d'Adrian Rodriguez, ostéopathe à Villefontaine : écoute, explications, bienveillance. Lisez leurs retours et laissez le vôtre.",
  crumbs: [home, { href: '/avis/', label: 'Avis' }],
  body: `
<section class="page-hero" aria-labelledby="h1"><div class="wrap"><h1 id="h1" class="split display">${splitWords('Leurs mots <em>comptent le plus</em>')}</h1><p class="lead" data-reveal>Des avis laissés sur Google par des patients du cabinet (extraits).</p></div></section>
<section class="section"><div class="wrap"><div class="mosaic">${reviews.map((r, i) => `<figure class="quote" data-tilt data-reveal style="--d:${i % 3}"><blockquote><p>« ${esc(r.t)} »</p></blockquote><figcaption>${stars()} ${esc(r.a)} · avis Google</figcaption></figure>`).join('')}</div>
<div class="actions"><a class="btn btn-ghost" href="${L.google}" target="_blank" rel="noopener" data-magnetic><span class="btn-label">Lire et laisser un avis sur Google</span>${icon('arrow')}</a>${rdv()}</div></div></section>
${ctaFinal()}`,
};

/* =====================================================================
   LE CABINET / À PROPOS
   ===================================================================== */
const pageCabinet = {
  id: 'cabinet', path: '/cabinet/', file: 'cabinet/index.html',
  // SEO : « Adrian Rodriguez ostéopathe » · ostéopathe diplômé ATSA · avis ostéopathe Villefontaine · cabinet Les Ravinelles
  title: 'Le cabinet | Adrian Rodriguez, ostéopathe à Villefontaine',
  description: "Adrian Rodriguez, ostéopathe diplômé de l'école ATSA, vous reçoit aux Ravinelles à Villefontaine. Son approche, son parcours, le cabinet et les avis.",
  crumbs: [home, { href: '/cabinet/', label: 'Le cabinet' }],
  body: `
<section class="about-hero" aria-labelledby="h1">
  <div class="wrap about-grid">
    <div class="about-text">
      <h1 id="h1" class="split">${splitWords('Adrian Rodriguez, <em>ostéopathe</em>')}</h1>
      <p class="lead" data-reveal>Diplômé de l'école ATSA, je reçois au cabinet des Ravinelles des patients de tous âges, du nourrisson au senior. Passionné de sport, j'accompagne aussi les sportifs dans leur récupération et leur préparation.</p>
      <div class="actions" data-reveal>${rdv()}</div>
    </div>
    <div class="about-photos">
      <div class="arch" data-parallax="-6">${pic('adrian-portrait', { eager: true, sizes: '(min-width: 1024px) 30vw, 80vw' })}</div>
    </div>
  </div>
</section>

<section class="section principles" aria-labelledby="pr-t">
  <div class="wrap">
    <h2 id="pr-t" data-reveal>Ma façon <em>de travailler</em></h2>
    <ol class="principle-list">
      <li data-reveal><h3>Écouter avant d'agir</h3><p>La première partie de la séance est consacrée à votre histoire : ce que vous ressentez, depuis quand, ce qui soulage ou aggrave.</p></li>
      <li data-reveal><h3>Expliquer chaque geste</h3><p>Vous savez ce que je fais et pourquoi. Aucune technique n'est réalisée sans votre accord.</p></li>
      <li data-reveal><h3>Être honnête</h3><p>Si l'ostéopathie n'est pas adaptée à votre situation, je vous le dis et je vous oriente vers le bon professionnel.</p></li>
    </ol>
  </div>
</section>

<section class="section gallery-sec" aria-labelledby="gal-t">
  <div class="wrap">
    <h2 id="gal-t" data-reveal>Le cabinet <em>des Ravinelles</em></h2>
    <div class="gallery">
      <figure class="g1" data-parallax="-4">${pic('adrian-bureau', { sizes: '(min-width: 1024px) 40vw, 90vw' })}</figure>
      <figure class="g2" data-parallax="6">${pic('carte-cabinet', { sizes: '(min-width: 1024px) 25vw, 45vw' })}</figure>
      <figure class="g3" data-parallax="-2">${pic('soin-dos-table', { sizes: '(min-width: 1024px) 25vw, 45vw' })}</figure>
    </div>
  </div>
</section>

<section class="section cv" aria-labelledby="cv-t">
  <div class="wrap detail-grid">
    <div data-reveal>
      <h2 id="cv-t">Formation</h2>
      <ul class="checks">
        <li>${icon('check')}<span>Diplômé de l'école ATSA, année ${tbc(T.graduation)}</span></li>
        <li>${icon('check')}<span>Formations complémentaires : ${tbc(TBC)}</span></li>
        <li>${icon('check')}<span>N° ADELI / RPPS : ${tbc(T.adeli)}</span></li>
      </ul>
    </div>
    <div data-reveal>
      <h2>Sur Instagram</h2>
      <p>Conseils pratiques et vie du cabinet sur <a href="${L.instagram}" target="_blank" rel="noopener">@adrianosteo</a>.</p>
      <a class="btn btn-ghost" href="${L.instagram}" target="_blank" rel="noopener" data-magnetic>${icon('insta')}<span class="btn-label">Suivre @adrianosteo</span></a>
    </div>
  </div>
</section>

<section class="section quotes" aria-labelledby="q-t">
  <div class="wrap">
    <h2 id="q-t" data-reveal>Ce que les patients <em>retiennent</em></h2>
    <div class="quote-grid">${[reviews[0], reviews[1], reviews[3]].map((r) => `<figure class="quote" data-tilt data-reveal><blockquote><p>« ${esc(r.t)} »</p></blockquote><figcaption>${stars()} ${esc(r.a)} · avis Google</figcaption></figure>`).join('')}</div>
  </div>
</section>
${ctaFinal('Faisons le point <em>ensemble</em>')}
`,
};

/* =====================================================================
   TARIFS & INFOS PRATIQUES
   ===================================================================== */
const tarifsFaq = [
  { q: 'Ma mutuelle rembourse-t-elle les séances ?', a: "La plupart des mutuelles prennent en charge un certain nombre de séances par an, selon votre contrat. Vérifiez votre tableau de garanties ; une facture vous est remise à chaque séance." },
  { q: 'Quels moyens de paiement ?', a: `${tbc(TBC)} (chèque et carte bancaire selon l'annuaire lemedecin.fr).` },
  { q: 'Comment annuler un rendez-vous ?', a: `Depuis Doctolib ou par téléphone au <a href="${site.phone.href}">${site.phone.display}</a>. Délai : ${tbc(T.cancel)}.` },
  { q: "Faut-il une ordonnance ?", a: "Non, sauf pour un nourrisson de moins de 6 mois : une attestation médicale de non contre-indication est obligatoire." },
  { q: 'Où se garer ?', a: "Un parking gratuit se trouve à proximité du cabinet, dont l'entrée est de plain-pied." },
];

const pageTarifs = {
  id: 'tarifs', path: '/tarifs/', file: 'tarifs/index.html',
  // SEO : « tarif ostéopathe Villefontaine » · prix séance ostéopathie · remboursement mutuelle · déroulé consultation · parking
  title: 'Tarifs et infos pratiques | Ostéopathe Villefontaine',
  description: "Tarif d'une séance d'ostéopathie à Villefontaine, remboursement mutuelle, déroulé, accès, parking et horaires du cabinet d'Adrian Rodriguez.",
  crumbs: [home, { href: '/tarifs/', label: 'Tarifs & infos' }], faq: tarifsFaq,
  body: `
<section class="page-hero" aria-labelledby="h1">
  <div class="wrap">
    <h1 id="h1" class="split display">${splitWords('Tarifs <em>& infos pratiques</em>')}</h1>
    <div class="page-hero-sub" data-reveal><p class="lead">Un prix affiché, une séance expliquée, un accès simple : tout ce qu'il faut savoir avant de réserver.</p>${rdv()}</div>
  </div>
</section>

<section class="section" aria-labelledby="prix-t">
  <div class="wrap tarif-grid">
    <h2 id="prix-t" data-reveal>Les tarifs</h2>
    <div data-reveal>
      <table class="tarif-table">
        <caption class="sr-only">Tarifs des consultations</caption>
        <thead><tr><th scope="col">Consultation</th><th scope="col">Durée</th><th scope="col">Tarif</th></tr></thead>
        <tbody>
          <tr><th scope="row">Adulte</th><td>${tbc(T.duration)}</td><td>${tbc(T.price)}</td></tr>
          <tr><th scope="row">Enfant et adolescent</th><td>${tbc(TBC)}</td><td>${tbc(T.priceChild)}</td></tr>
          <tr><th scope="row">Nourrisson</th><td>${tbc(TBC)}</td><td>${tbc(T.priceBaby)}</td></tr>
          <tr><th scope="row">Femme enceinte</th><td>${tbc(TBC)}</td><td>${tbc(TBC)}</td></tr>
          <tr><th scope="row">Sportif</th><td>${tbc(TBC)}</td><td>${tbc(TBC)}</td></tr>
        </tbody>
      </table>
      <ul class="checks">
        <li>${icon('euro')}<span><strong>Remboursement :</strong> pas par l'Assurance maladie, mais souvent par les mutuelles. Une facture vous est remise.</span></li>
        <li>${icon('check')}<span><strong>Sans ordonnance,</strong> sauf nourrisson de moins de 6 mois (attestation médicale).</span></li>
      </ul>
    </div>
  </div>
</section>

<section class="section tint" aria-labelledby="prep-t">
  <div class="wrap detail-grid">
    <div data-reveal>
      <h2 id="prep-t">Préparer votre venue</h2>
      <ul class="checks">
        <li>${icon('check')}<span>Vos examens récents : radio, IRM, comptes rendus</span></li>
        <li>${icon('check')}<span>La liste de vos traitements</span></li>
        <li>${icon('check')}<span>Une tenue souple</span></li>
        <li>${icon('check')}<span>Pour un enfant : son carnet de santé</span></li>
        <li>${icon('check')}<span>Avant 6 mois : l'attestation du médecin</span></li>
      </ul>
    </div>
    <div data-reveal>
      <h2>Horaires</h2>
      <p class="big-info">${tbc(T.hours)}</p>
      <p>Les créneaux disponibles sont à jour en temps réel sur Doctolib.</p>
      ${rdv('Voir les créneaux')}
    </div>
  </div>
</section>

<section class="section access" id="acces" aria-labelledby="acces-t">
  <div class="wrap access-grid">
    <div class="access-text" data-reveal>
      <h2 id="acces-t">Accès <em>et parking</em></h2>
      <p class="addr">${icon('pin')} <span>${A.street}, ${A.area}<br>${A.postalCode} ${A.city}</span></p>
      <ul class="checks">
        <li>${icon('car')}<span>Parking gratuit à proximité</span></li>
        <li>${icon('access')}<span>Entrée de plain-pied</span></li>
      </ul>
      <h3>Temps de trajet</h3>
      <ul class="travel">${site.nearby.map((n) => `<li><span>${n.name}</span><span>${tbc(n.time)}</span></li>`).join('')}</ul>
      <div class="actions"><a class="btn btn-ghost" href="${L.directions}" target="_blank" rel="noopener" data-magnetic>${icon('pin')}<span class="btn-label">Itinéraire</span></a></div>
    </div>
    ${mapCard()}
  </div>
</section>
${faq(tarifsFaq)}
${ctaFinal()}
`,
};

/* =====================================================================
   CONTACT / PRENDRE RDV
   ===================================================================== */
const contactFaq = [
  { q: 'Quel est le moyen le plus rapide ?', a: 'Doctolib : vous voyez les créneaux libres et réservez en quelques clics, jour et nuit.' },
  { q: 'Recevez-vous en urgence ?', a: "Appelez directement pour un créneau rapide. En cas d'urgence médicale, composez le 15." },
  { q: "Que se passe-t-il après l'envoi du formulaire ?", a: "Je vous recontacte pour fixer un rendez-vous. Le formulaire ne réserve pas de créneau à lui seul." },
];

const pageContact = {
  id: 'contact', path: '/contact/', file: 'contact/index.html',
  // SEO : « rendez-vous ostéopathe Villefontaine » · ostéopathe Doctolib · ostéopathe Bourgoin-Jallieu · ostéopathe Saint-Quentin-Fallavier
  title: 'Prendre rendez-vous | Ostéopathe Villefontaine',
  description: "Prenez rendez-vous avec Adrian Rodriguez, ostéopathe à Villefontaine : Doctolib, téléphone, WhatsApp ou formulaire. Adresse, carte et parking.",
  crumbs: [home, { href: '/contact/', label: 'Contact' }], faq: contactFaq,
  body: `
<section class="page-hero" aria-labelledby="h1">
  <div class="wrap">
    <h1 id="h1" class="split display">${splitWords('Prendre <em>rendez-vous</em>')}</h1>
    <p class="lead" data-reveal>Réservez en ligne, appelez, ou laissez un message : je vous réponds pour trouver le bon créneau.</p>
  </div>
</section>

<section class="section ways-sec" aria-label="Moyens de prise de rendez-vous">
  <div class="wrap ways">
    <a class="way way-main" href="${L.doctolib}" target="_blank" rel="noopener" data-tilt data-reveal><span class="way-ico">${icon('cal')}</span><span class="way-title">En ligne, 24 h/24</span><span class="way-text">Créneaux en temps réel sur Doctolib</span><span class="way-go">Réserver ${icon('arrow')}</span></a>
    <a class="way" href="${site.phone.href}" data-tilt data-reveal><span class="way-ico">${icon('phone')}</span><span class="way-title">Par téléphone</span><span class="way-text">${site.phone.display}</span><span class="way-go">Appeler ${icon('arrow')}</span></a>
    <a class="way" href="${L.whatsapp}" target="_blank" rel="noopener" data-tilt data-reveal><span class="way-ico">${icon('chat')}</span><span class="way-title">Par WhatsApp</span><span class="way-text">Écrivez quand vous voulez</span><span class="way-go">Envoyer un message ${icon('arrow')}</span></a>
  </div>
</section>

<section class="section tint" aria-labelledby="form-t">
  <div class="wrap form-grid">
    <div data-reveal>
      <h2 id="form-t">Être <em>rappelé</em></h2>
      <p>Quatre champs, une minute. Je vous recontacte pour fixer le rendez-vous.</p>
      <form class="form" action="/api/contact.php" method="post" novalidate data-form>
        <div class="field"><label for="f-name">Nom et prénom</label><input id="f-name" name="name" type="text" autocomplete="name" required maxlength="100" aria-describedby="e-name"><p class="err" id="e-name" hidden></p></div>
        <div class="field"><label for="f-contact">Téléphone ou e-mail</label><input id="f-contact" name="contact" type="text" autocomplete="tel" required maxlength="120" aria-describedby="h-contact e-contact"><p class="hint" id="h-contact">Pour que je puisse vous répondre.</p><p class="err" id="e-contact" hidden></p></div>
        <div class="field"><label for="f-for">La séance concerne</label>
          <select id="f-for" name="for" required aria-describedby="e-for"><option value="">Choisir…</option>${['Un adulte', 'Un bébé ou un enfant', 'Une femme enceinte', 'Un sportif', 'Une personne âgée', 'Autre'].map((o) => `<option>${o}</option>`).join('')}</select><p class="err" id="e-for" hidden></p></div>
        <div class="field"><label for="f-msg">Message <span class="opt">(facultatif)</span></label><textarea id="f-msg" name="message" rows="4" maxlength="1000" aria-describedby="h-msg"></textarea><p class="hint" id="h-msg">Vos disponibilités, par exemple. Évitez les informations médicales détaillées.</p></div>
        <div class="hp" aria-hidden="true"><label for="f-web">Site web</label><input id="f-web" name="website" type="text" tabindex="-1" autocomplete="off"></div>
        <input type="hidden" name="t" value="" data-time>
        <div class="field check"><input id="f-ok" name="consent" type="checkbox" value="1" required aria-describedby="e-consent"><label for="f-ok">J'accepte que mes coordonnées soient utilisées pour me recontacter (<a href="/confidentialite/">confidentialité</a>).</label><p class="err" id="e-consent" hidden></p></div>
        <button class="btn btn-primary" type="submit" data-magnetic><span class="btn-label">Envoyer ma demande</span>${icon('arrow')}</button>
        <p class="form-status" role="status" aria-live="polite" data-status></p>
      </form>
    </div>
    <div class="contact-side" data-reveal>
      <h2>Le cabinet</h2>
      <ul class="checks">
        <li>${icon('pin')}<span><strong>${A.street}</strong><br>${A.area}, ${A.postalCode} ${A.city}</span></li>
        <li>${icon('car')}<span>Parking gratuit, entrée de plain-pied</span></li>
        <li>${icon('clock')}<span>${tbc(T.hours)}</span></li>
        <li>${icon('mail')}<span><a href="mailto:${site.email}">${site.email}</a></span></li>
      </ul>
      ${mapCard()}
    </div>
  </div>
</section>
${faq(contactFaq)}
`,
};

/* =====================================================================
   PAGES LÉGALES + 404
   ===================================================================== */
const legal = (id, path, title, description, h1, html) => ({
  id, path, file: path.slice(1) + 'index.html', title, description,
  crumbs: [home, { href: path, label: h1 }],
  body: `<section class="section legal"><div class="wrap prose"><h1 id="h1">${h1}</h1>${html}</div></section>`,
});

const pageLegal = legal('legal', '/mentions-legales/', 'Mentions légales | Adrian Rodriguez, ostéopathe',
  "Mentions légales du site d'Adrian Rodriguez, ostéopathe à Villefontaine : éditeur, numéro professionnel, hébergeur, propriété intellectuelle.", 'Mentions légales', `
<h2>Éditeur</h2><p>Adrian Rodriguez, ostéopathe<br>${A.street}, ${A.area}, ${A.postalCode} ${A.city}<br>Téléphone : ${site.phone.display} · ${site.email}</p>
<p>N° ADELI / RPPS : ${tbc(T.adeli)}<br>SIRET : ${tbc(T.siret)}<br>Directeur de la publication : Adrian Rodriguez.</p>
<h2>Hébergement</h2><p>${tbc(T.host)}</p>
<h2>Activité</h2><p>L'ostéopathie est encadrée par le décret n° 2007-435 du 25 mars 2007. Les informations de ce site sont générales : elles ne remplacent ni une consultation ni un avis médical.</p>
<h2>Propriété intellectuelle</h2><p>Textes, logo et photographies : © Adrian Rodriguez, sauf mention contraire. Polices Fraunces et Manrope sous licence SIL Open Font License. Bibliothèques : GSAP (licence standard gratuite), Lenis (MIT).</p>
<h2>Données personnelles</h2><p>Voir la page <a href="/confidentialite/">Confidentialité</a>.</p>`);

const pagePrivacy = legal('privacy', '/confidentialite/', 'Confidentialité et données personnelles | Ostéopathe',
  "Données collectées par le formulaire du site d'Adrian Rodriguez, ostéopathe à Villefontaine, durée de conservation, cookies et droits RGPD.", 'Confidentialité', `
<h2>Responsable du traitement</h2><p>Adrian Rodriguez, ostéopathe, ${A.street}, ${A.postalCode} ${A.city}, ${site.email}.</p>
<h2>Données collectées</h2><p>Le formulaire recueille votre nom, un moyen de vous joindre, la personne concernée et, si vous le souhaitez, un message. Aucune information médicale n'est demandée : merci de ne pas en transmettre par ce biais.</p>
<h2>Finalité et base légale</h2><p>Vous recontacter pour organiser un rendez-vous, sur la base de votre consentement (case à cocher).</p>
<h2>Conservation</h2><p>Les messages sont conservés au plus 12 mois ${tbc(TBC)}, puis supprimés.</p>
<h2>Destinataires</h2><p>Seul Adrian Rodriguez y a accès. Les données ne sont ni vendues ni cédées. La réservation en ligne est assurée par Doctolib, selon sa propre politique de confidentialité.</p>
<h2>Cookies</h2><p>Ce site ne dépose aucun cookie publicitaire ni de mesure d'audience. Les polices sont hébergées sur le site. La carte Google n'est chargée qu'après votre clic ; Google peut alors déposer ses propres cookies.</p>
<h2>Vos droits</h2><p>Accès, rectification, effacement : écrivez à ${site.email}. Réclamation possible auprès de la CNIL (cnil.fr).</p>`);

const page404 = {
  id: 'notfound', path: '/404.html', file: '404.html', noindex: true,
  title: 'Page introuvable | Adrian Rodriguez, ostéopathe',
  description: "Cette page n'existe pas ou a été déplacée. Retrouvez l'accueil, les motifs de consultation ou la prise de rendez-vous du cabinet.",
  body: `<section class="page-hero"><div class="wrap"><h1 id="h1" class="display">Cette page <em>s'est égarée</em></h1><p class="lead">Le site a été refait : l'adresse a peut-être changé.</p><ul class="chips"><li><a href="/">Accueil</a></li><li><a href="/osteopathie/">Ostéopathie</a></li><li><a href="/tarifs/">Tarifs</a></li><li><a href="/contact/">Contact</a></li></ul><div class="actions">${rdv()}</div></div></section>`,
};

export const pages = [pageHome, pageOsteo, ...categoryPages, pageCabinet, pageTarifs, pageContact, pageAvis, pageConseils, ...articlePages, pageLegal, pagePrivacy, page404];
