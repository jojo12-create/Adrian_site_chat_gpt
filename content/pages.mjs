/* ==========================================================================
   CONTENUS DES PAGES
   Ton : calme, concret, orienté bénéfices. Aucune promesse de guérison :
   l'ostéopathie est présentée en complément du suivi médical.
   Chaque page : 1 mot-clé principal + 3 à 5 secondaires (commentaire « SEO »).
   ========================================================================== */
import { site, reviews, reviewCount, TBC } from './site.mjs';
import { pic, rdv, call, faq, ctaFinal, icon, stars, tbc, splitWords, esc } from './layout.mjs';

const T = site.tbc, A = site.address, L = site.links;
const home = { href: '/', label: 'Accueil' };
const osteo = { href: '/osteopathie/', label: 'Ostéopathie' };

/* =====================================================================
   MOTIFS DE CONSULTATION (6 pages)
   ===================================================================== */
export const motifs = [
  {
    slug: 'mal-de-dos', label: 'Mal de dos', photo: 'soin-dos-table',
    // SEO : « ostéopathe mal de dos Villefontaine » · lombalgie, sciatique, dos bloqué, travail assis
    title: 'Ostéopathe mal de dos à Villefontaine | Lombalgie',
    description: "Lombalgie, dos bloqué, sciatique, raideurs du travail assis : une prise en charge ostéopathique attentive à Villefontaine. Rendez-vous sur Doctolib.",
    h1: 'Mal de dos : retrouver un dos plus libre',
    lead: "Travail assis, port de charges, gestes répétés, stress : le dos encaisse beaucoup. La séance cherche d'où vient la gêne, pas seulement là où elle se fait sentir.",
    cases: ["Vous passez la journée sur un écran et le bas du dos tire chaque soir.", "Un faux mouvement en portant un carton, et le dos s'est « bloqué ».", "Une douleur qui descend dans la fesse ou la jambe depuis quelques jours."],
    when: ['Lombalgies, dos bloqué, raideurs au réveil', 'Douleurs entre les omoplates, haut du dos tendu', 'Sciatique ou cruralgie, après avis médical si la douleur est forte', 'Reprise après une période sédentaire ou une blessure'],
    session: "Nous parlons de votre poste de travail, de votre sommeil et de votre activité. Les techniques sont choisies selon votre confort, et vous repartez avec des conseils simples pour la suite.",
    note: "Douleur avec fièvre, perte de force, fourmillements importants ou troubles urinaires : consultez un médecin sans attendre.",
    faq: [
      { q: 'Faut-il attendre que la douleur passe pour consulter ?', a: "Non. Vous pouvez consulter pendant une crise : les techniques sont alors très douces et adaptées à votre douleur." },
      { q: 'Je ne veux pas de « craquements », est-ce possible ?', a: "Oui. Il existe de nombreuses techniques douces, et rien n'est fait sans votre accord." },
    ],
  },
  {
    slug: 'nuque-cervicales', label: 'Nuque & épaules', photo: 'soin-nuque',
    // SEO : « ostéopathe cervicales Villefontaine » · torticolis, nuque raide, maux de tête de tension, épaules
    title: 'Ostéopathe nuque et cervicales à Villefontaine',
    description: "Nuque raide, torticolis, épaules tendues, maux de tête de tension : l'ostéopathie à Villefontaine pour retrouver de la mobilité. Rendez-vous en ligne.",
    h1: 'Nuque, cervicales et épaules : relâcher les tensions',
    lead: "Écran trop bas, nuit sur un mauvais oreiller, stress qui se loge dans les épaules : la nuque se raidit vite. Une séance aide à redonner de la mobilité au cou et au haut du dos.",
    cases: ["Vous vous réveillez avec un torticolis, impossible de tourner la tête.", "Les épaules remontent vers les oreilles en fin de journée.", "Des maux de tête qui partent de la nuque quand vous êtes tendu."],
    when: ['Torticolis, nuque raide, cervicalgies', 'Épaules tendues, douleur entre les omoplates', 'Maux de tête de tension, après avis médical', 'Gêne après un « coup du lapin », une fois le bilan médical fait'],
    session: "J'observe la mobilité du cou, des épaules et du haut du dos, qui fonctionnent ensemble. Les gestes au niveau de la nuque sont toujours expliqués avant d'être faits.",
    note: "Maux de tête brutaux et inhabituels, vertiges importants ou troubles de la vision : consultez un médecin en priorité.",
    faq: [
      { q: 'Les manipulations du cou sont-elles risquées ?', a: "Elles ne sont jamais systématiques. Je les propose seulement si elles sont indiquées, après un bilan, et avec votre accord. Des techniques douces existent." },
      { q: 'Combien de temps après un torticolis consulter ?', a: "Dès les premiers jours si la gêne persiste. La séance s'adapte à la douleur du moment." },
    ],
  },
  {
    slug: 'sportifs', label: 'Sportifs', photo: 'soin-dos',
    // SEO : « ostéopathe du sport Villefontaine » · récupération, prévention blessures, préparation compétition, Nord-Isère
    title: 'Ostéopathe du sport à Villefontaine',
    description: "Ostéopathie du sport à Villefontaine : prévention des blessures, récupération après l'effort, préparation d'une compétition. Amateurs et confirmés.",
    h1: 'Ostéopathie du sport : prévenir, récupérer, progresser',
    lead: "Passionné de sport, j'accompagne les sportifs amateurs comme confirmés. L'objectif : un corps mobile et équilibré pour encaisser l'entraînement, et une récupération mieux gérée.",
    cases: ["Vous préparez un trail ou un semi et une gêne au genou revient à chaque sortie.", "Après chaque match, le dos ou les adducteurs mettent des jours à récupérer.", "Vous reprenez le sport après une entorse et vous n'osez plus forcer."],
    when: ['Douleurs liées à la pratique, après avis médical si besoin', "Préparation d'une compétition ou d'un objectif", 'Récupération après un entraînement intensif', 'Recherche de souplesse et de mobilité'],
    session: "Nous parlons de votre discipline, de votre charge d'entraînement et de votre calendrier. La séance est construite autour de vos objectifs.",
    note: "Après un choc, une chute ou un craquement entendu, faites d'abord un bilan médical pour écarter une lésion.",
    faq: [
      { q: 'Quand consulter avant une compétition ?', a: "Idéalement quelques jours avant, pour laisser le corps s'adapter. Évitez la veille d'un effort important." },
      { q: 'Faut-il venir en tenue de sport ?', a: 'Une tenue souple est idéale : short, legging ou brassière.' },
    ],
  },
  {
    slug: 'bebe-enfant', label: 'Bébé & enfant', photo: null,
    // SEO : « ostéopathe bébé Villefontaine » · nourrisson, torticolis bébé, enfant, croissance
    title: 'Ostéopathe bébé et enfant à Villefontaine',
    description: "Ostéopathie douce pour nourrissons et enfants à Villefontaine : naissance difficile, torticolis, inconfort digestif, croissance, posture.",
    h1: 'Bébés et enfants : une ostéopathie toute en douceur',
    lead: "Des premières semaines à l'adolescence, le corps change vite. Une consultation douce aide à repérer les tensions qui peuvent gêner le confort de votre enfant, en lien avec votre pédiatre.",
    cases: ["Votre bébé tourne toujours la tête du même côté.", "La naissance a été longue, avec ventouse ou forceps.", "Votre ado grandit vite, a mal au dos et enchaîne les entraînements."],
    when: ['Naissance difficile, torticolis, tête toujours tournée du même côté', 'Coliques, reflux, inconfort digestif, sommeil agité', 'Douleurs de croissance, posture, cartable lourd', 'Jeune sportif : prévention et récupération'],
    session: "Bébé reste dans vos bras ou sur la table, à son rythme : pause, câlin ou tétée quand il le faut. Un parent est toujours présent pour les mineurs.",
    note: "<strong>Avant 6 mois</strong>, la réglementation impose une attestation de votre médecin ou pédiatre indiquant l'absence de contre-indication (décret n° 2007-435). Pensez à l'apporter.",
    faq: [
      { q: 'À partir de quel âge peut-on consulter ?', a: "Dès les premières semaines. Avant 6 mois, l'attestation médicale de non contre-indication est obligatoire." },
      { q: 'Que faut-il apporter ?', a: "Le carnet de santé de l'enfant et, avant 6 mois, l'attestation du médecin." },
    ],
  },
  {
    slug: 'femme-enceinte', label: 'Grossesse', photo: null,
    // SEO : « ostéopathe femme enceinte Villefontaine » · sciatique grossesse, bassin, après accouchement
    title: 'Ostéopathe femme enceinte à Villefontaine',
    description: "Ostéopathie pendant la grossesse à Villefontaine : dos, sciatique, bassin, jambes lourdes, préparation à l'accouchement et suivi après la naissance.",
    h1: "Grossesse : accompagner un corps qui change",
    lead: "En neuf mois, le dos et le bassin s'adaptent beaucoup. L'ostéopathie accompagne ces transformations pour aider à soulager certains inconforts et préparer la mobilité du bassin.",
    cases: ["Le bas du dos tire dès que vous restez debout.", "Une douleur part dans la fesse et descend dans la jambe.", "Après l'accouchement, vous voulez faire le point sur votre dos et votre bassin."],
    when: ['Douleurs lombaires, sciatiques ou pelviennes', 'Fatigue, sommeil difficile, tensions liées au stress', "Préparation de la mobilité du bassin avant l'accouchement", "Après la naissance : dos, bassin, portage"],
    session: "Les positions sont adaptées à chaque trimestre : sur le côté, assise, avec des coussins. Vous pouvez demander une pause à tout moment.",
    note: "L'ostéopathie complète le suivi de votre sage-femme ou de votre gynécologue, sans le remplacer. Au moindre signe inhabituel, contactez-les en priorité.",
    faq: [
      { q: 'À quel moment de la grossesse consulter ?', a: "À tout moment, dès qu'une gêne apparaît. Beaucoup de futures mamans consultent aussi en fin de grossesse, puis après l'accouchement." },
      { q: 'Peut-on venir avec bébé après la naissance ?', a: "Oui, et une séance pour bébé peut avoir lieu le même jour." },
    ],
  },
  {
    slug: 'seniors', label: 'Seniors', photo: 'soin-epaule',
    // SEO : « ostéopathe senior Villefontaine » · arthrose, mobilité, équilibre, raideurs
    title: 'Ostéopathe pour seniors à Villefontaine',
    description: "Ostéopathie douce pour les seniors à Villefontaine : raideurs, arthrose, mobilité, équilibre. Cabinet de plain-pied avec parking gratuit.",
    h1: 'Seniors : garder sa mobilité au quotidien',
    lead: "Avec les années, les raideurs gagnent du terrain et les gestes simples deviennent moins faciles. Des techniques douces, adaptées à l'âge, aident à préserver la souplesse et l'autonomie.",
    cases: ["Se baisser pour lacer ses chaussures devient difficile.", "Les épaules ou les hanches sont raides le matin.", "Vous voulez garder de l'assurance dans vos déplacements."],
    when: ["Raideurs, douleurs articulaires liées à l'arthrose", 'Difficulté à se baisser, à tourner la tête', "Envie de garder de l'équilibre et de l'assurance", 'Fatigue générale et tensions'],
    session: "Le rythme est calme et les techniques toujours douces. Le cabinet est de plain-pied, avec un parking gratuit à proximité.",
    note: "Apportez la liste de vos traitements et vos derniers examens : ils permettent d'adapter la séance.",
    faq: [
      { q: "Est-ce adapté en cas d'ostéoporose ?", a: "Oui, en adaptant les techniques. Signalez-la à la prise de rendez-vous : seules des techniques douces seront utilisées." },
      { q: 'Peut-on venir accompagné ?', a: 'Bien sûr, un proche peut assister à la séance.' },
    ],
  },
];

/* Silhouette « vertébrale » interactive de l'accueil : zone → motif */
const zones = [
  { id: 'nuque', label: 'Nuque', motif: 'nuque-cervicales', range: [0, 6], text: "Torticolis, nuque raide, maux de tête de tension après une journée d'écran." },
  { id: 'epaules', label: 'Épaules', motif: 'nuque-cervicales', range: [4, 9], text: "Épaules qui remontent, douleur entre les omoplates, bras lourd." },
  { id: 'dos', label: 'Bas du dos', motif: 'mal-de-dos', range: [15, 20], text: "Lombalgie, dos bloqué après un faux mouvement, raideur du matin." },
  { id: 'bassin', label: 'Bassin', motif: 'mal-de-dos', range: [19, 23], text: "Sciatique, douleur de hanche ou de fesse, gêne en position assise." },
  { id: 'sport', label: 'Sport', motif: 'sportifs', range: [0, 23], text: "Préparer un objectif, mieux récupérer, reprendre après une blessure." },
  { id: 'bebe', label: 'Bébé & enfant', motif: 'bebe-enfant', range: [0, 23], text: "Naissance difficile, torticolis du nourrisson, croissance, posture." },
  { id: 'grossesse', label: 'Grossesse', motif: 'femme-enceinte', range: [14, 23], text: "Dos et bassin qui tirent, sciatique, préparation à l'accouchement." },
  { id: 'senior', label: 'Senior', motif: 'seniors', range: [0, 23], text: "Raideurs, arthrose, mobilité et équilibre au quotidien." },
];
const spineSvg = () => {
  // 24 vertèbres : colonne en S douce, rappel du bonsaï-colonne du logo
  let v = '';
  for (let i = 0; i < 24; i++) {
    const y = 18 + i * 19.5;
    const x = 110 + Math.sin((i / 23) * Math.PI * 2) * 14;
    const w = 26 + Math.min(i, 18) * 1.6;
    v += `<rect class="vert" data-v="${i}" x="${(x - w / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="14" rx="7"/>`;
  }
  return `<svg class="spine-svg" viewBox="0 0 220 500" aria-hidden="true"><path class="spine-cord" d="M110 10 C 128 120, 92 250, 110 380 S 104 470, 110 495"/>${v}</svg>`;
};

/* =====================================================================
   ACCUEIL
   ===================================================================== */
const homeFaq = [
  { q: "Ai-je vraiment besoin d'une séance ?", a: `Si une gêne revient, limite vos mouvements ou s'installe depuis plusieurs jours, une séance peut aider. En cas de doute, <a href="/contact/">décrivez votre situation</a> : si l'ostéopathie n'est pas adaptée, je vous oriente vers votre médecin.` },
  { q: "Je n'habite pas Villefontaine, est-ce loin ?", a: `Le cabinet est aux Ravinelles, avec un parking gratuit et une entrée de plain-pied. Il est proche de L'Isle-d'Abeau, Bourgoin-Jallieu, Saint-Quentin-Fallavier et La Verpillière. <a href="/tarifs/#acces">Voir l'accès</a>.` },
  { q: 'Combien coûte une séance ?', a: `Tarif adulte : ${tbc(T.price)}. Tous les tarifs sont sur la page <a href="/tarifs/">Tarifs & infos</a>.` },
  { q: 'Est-ce remboursé par la mutuelle ?', a: "L'Assurance maladie ne rembourse pas l'ostéopathie, mais beaucoup de mutuelles prennent en charge une partie des séances selon votre contrat. Une facture vous est remise." },
  { q: 'Comment se déroule une séance ?', a: "Un échange sur votre histoire, des tests de mobilité, un traitement manuel adapté et expliqué, puis des conseils pour la suite. Rien n'est fait sans votre accord." },
];

const pageHome = {
  id: 'accueil', path: '/', file: 'index.html',
  // SEO : « ostéopathe Villefontaine » · ostéopathe Nord-Isère · ostéopathe L'Isle-d'Abeau · cabinet ostéopathie 38090 · ostéopathe Bourgoin-Jallieu
  title: 'Ostéopathe à Villefontaine (38090) | Adrian Rodriguez',
  description: "Adrian Rodriguez, ostéopathe diplômé de l'ATSA à Villefontaine : dos, nuque, sportifs, bébés, grossesse, seniors. Rendez-vous en ligne sur Doctolib.",
  faq: homeFaq,
  body: `
<section class="hero" aria-labelledby="h1">
  <div class="hero-shape" aria-hidden="true">
    <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3e5e42"/><stop offset="1" stop-color="#243c2f"/></linearGradient></defs>
    <path data-morph d="M421,317Q401,384,343,424Q285,464,214,438Q143,412,121,341Q99,270,140,206Q181,142,254,121Q327,100,384,149Q441,198,441,257.5Q441,317,421,317Z" fill="url(#g-hero)"/></svg>
  </div>
  <div class="wrap hero-grid">
    <div class="hero-text">
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
    <div class="hero-visual">
      <div class="arch" data-parallax="-8">${pic('adrian-bureau', { eager: true, sizes: '(min-width: 1024px) 38vw, 90vw' })}</div>
      <div class="hero-badge" data-parallax="10"><img src="/images/logo-160.webp" width="80" height="80" alt=""><span>Ostéopathie<br><em>tous âges</em></span></div>
    </div>
  </div>
  <a class="scroll-hint" href="#avis"><span>Découvrir</span><i aria-hidden="true"></i></a>
</section>

<section class="marquee-sec" id="avis" aria-labelledby="avis-t">
  <div class="wrap marquee-head">
    <h2 id="avis-t" data-reveal>Ils en parlent <em>mieux que moi</em></h2>
    <button class="marquee-toggle" type="button" aria-pressed="false" data-marquee-toggle>${icon('pause', 'ico i-pause')}${icon('play', 'ico i-play')}<span>Mettre en pause</span></button>
  </div>
  <div class="marquee" data-marquee>
    ${[0, 1].map((row) => `<div class="marquee-row${row ? ' reverse' : ''}"><ul class="marquee-track">${(row ? reviews.slice(4).concat(reviews.slice(0, 4)) : reviews).map((r) => `<li class="review"><blockquote><p>« ${esc(r.t)} »</p></blockquote><p class="review-by">${stars()} <span>${esc(r.a)}</span></p></li>`).join('')}</ul><ul class="marquee-track" aria-hidden="true">${(row ? reviews.slice(4).concat(reviews.slice(0, 4)) : reviews).map((r) => `<li class="review"><p>« ${esc(r.t)} »</p><p class="review-by">${stars()} <span>${esc(r.a)}</span></p></li>`).join('')}</ul></div>`).join('')}
  </div>
  <p class="wrap marquee-foot"><a class="link" href="${L.google}" target="_blank" rel="noopener">Lire les avis sur Google ${icon('arrow')}</a></p>
</section>

<section class="section where" aria-labelledby="where-t">
  <div class="wrap where-grid">
    <div class="where-intro" data-reveal>
      <h2 id="where-t">Où est-ce que <em>ça coince ?</em></h2>
      <p class="lead">Choisissez une zone ou une situation : vous saurez si une séance peut vous aider, et comment elle se passe.</p>
    </div>
    <div class="where-tabs" role="tablist" aria-label="Zones et situations" data-tabs>
      ${zones.map((z, i) => `<button role="tab" type="button" id="tab-${z.id}" aria-controls="panel-${z.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-range="${z.range.join(',')}">${z.label}</button>`).join('')}
    </div>
    <div class="where-spine" data-spine>${spineSvg()}</div>
    <div class="where-panels">
      ${zones.map((z, i) => `<div class="where-panel" role="tabpanel" id="panel-${z.id}" aria-labelledby="tab-${z.id}" tabindex="0"${i ? ' hidden' : ''}><p class="where-kicker">${z.label}</p><p class="where-text">${z.text}</p><a class="link" href="/osteopathie/${z.motif}/">Comment je vous accompagne ${icon('arrow')}</a></div>`).join('')}
    </div>
  </div>
</section>

<section class="steps-sec" aria-labelledby="steps-t" data-pin-steps>
  <div class="steps-head wrap">
    <h2 id="steps-t" data-reveal>Une séance <em>en quatre temps</em></h2>
    <p data-reveal>Pas de mystère : vous savez ce qui se passe, et pourquoi.</p>
  </div>
  <ol class="steps-track">
    <li class="step"><div class="step-media">${pic('adrian-echange', { sizes: '(min-width: 1024px) 30vw, 90vw' })}</div><div class="step-body"><span class="step-n" aria-hidden="true">01</span><h3>L'échange</h3><p>Vos symptômes, votre histoire, votre quotidien, vos traitements. C'est le moment de tout dire et de poser vos questions.</p></div></li>
    <li class="step"><div class="step-media">${pic('soin-nuque', { sizes: '(min-width: 1024px) 30vw, 90vw' })}</div><div class="step-body"><span class="step-n" aria-hidden="true">02</span><h3>Les tests</h3><p>J'observe votre posture et la mobilité de chaque région pour repérer les zones de tension.</p></div></li>
    <li class="step"><div class="step-media">${pic('soin-bassin', { sizes: '(min-width: 1024px) 30vw, 90vw' })}</div><div class="step-body"><span class="step-n" aria-hidden="true">03</span><h3>Le traitement</h3><p>Des techniques manuelles adaptées à votre âge et à votre confort, toujours expliquées avant d'être faites.</p></div></li>
    <li class="step"><div class="step-media">${pic('adrian-ecoute', { sizes: '(min-width: 1024px) 30vw, 90vw' })}</div><div class="step-body"><span class="step-n" aria-hidden="true">04</span><h3>Les conseils</h3><p>Des gestes simples pour la suite, et un avis honnête sur l'utilité d'une nouvelle séance.</p></div></li>
  </ol>
</section>

<section class="section numbers" aria-labelledby="num-t">
  <div class="wrap">
    <h2 id="num-t" class="sr-only">Le cabinet en chiffres</h2>
    <ul class="num-list">
      <li data-reveal><strong><span data-count="${reviewCount}">${reviewCount}</span></strong><span>avis Google 5 étoiles publiés</span></li>
      <li data-reveal><strong><span data-count="6">6</span></strong><span>profils accompagnés, du bébé au senior</span></li>
      <li data-reveal><strong>${tbc(T.years)}</strong><span>années d'expérience</span></li>
      <li data-reveal><strong>0</strong><span>geste sans votre accord</span></li>
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
  { q: 'Quelle différence avec un kinésithérapeute ?', a: "Le kinésithérapeute rééduque, souvent sur prescription, avec des exercices et des séances rapprochées. L'ostéopathe travaille avec les mains sur l'origine des tensions, en séances plus espacées. Les deux se complètent." },
  { q: 'Combien de séances faut-il ?', a: "Il n'y a pas de nombre fixe. À la fin de chaque séance, je vous dis franchement si un suivi est utile." },
  { q: "Quand faut-il voir un médecin plutôt qu'un ostéopathe ?", a: "En cas de fièvre, de douleur après un choc important, de perte de force, de douleur dans la poitrine ou de troubles urinaires : consultez un médecin ou appelez le 15." },
];

const pageOsteo = {
  id: 'osteopathie', path: '/osteopathie/', file: 'osteopathie/index.html',
  // SEO : « ostéopathie Villefontaine » · motifs de consultation ostéopathe · quand consulter un ostéopathe · ostéopathe Nord-Isère
  title: 'Ostéopathie à Villefontaine : motifs de consultation',
  description: "Dos, nuque, sport, bébé, grossesse, seniors : quand consulter un ostéopathe à Villefontaine et comment se déroule la prise en charge.",
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

<section class="section motifs-sec" aria-labelledby="motifs-t">
  <div class="wrap">
    <h2 id="motifs-t" data-reveal>Six motifs <em>de consultation</em></h2>
    <ul class="motif-index" data-hover-preview>
      ${motifs.map((m, i) => `<li data-reveal><a href="/osteopathie/${m.slug}/" data-preview="${m.photo || 'carte-cabinet'}"><span class="mi-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="mi-title">${m.label}</span><span class="mi-text">${m.cases[0]}</span>${icon('arrow', 'ico mi-go')}</a></li>`).join('')}
    </ul>
    <div class="hover-preview" aria-hidden="true">${motifs.map((m) => (m.photo ? pic(m.photo, { sizes: '320px', alt: '' }).replace('<picture class="', `<picture data-for="${m.photo}" class="`) : '')).join('')}${pic('carte-cabinet', { sizes: '320px', alt: '' }).replace('<picture class="', '<picture data-for="carte-cabinet" class="')}</div>
  </div>
</section>

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
   PAGES MOTIF
   ===================================================================== */
const babyArt = (label) => `<div class="art-panel" aria-hidden="true"><svg viewBox="0 0 400 500"><path class="art-line" d="M200 470 C 230 380, 170 300, 200 220 S 190 90, 200 30"/>${Array.from({ length: 14 }, (_, i) => `<rect x="${186 - i * 0.4}" y="${440 - i * 29}" width="${28 + i * 0.8}" height="12" rx="6"/>`).join('')}<circle cx="200" cy="30" r="58" class="art-sun"/></svg><span>${label}</span></div>`;

const motifPages = motifs.map((m) => ({
  id: 'motif', path: `/osteopathie/${m.slug}/`, file: `osteopathie/${m.slug}/index.html`,
  title: m.title, description: m.description,
  crumbs: [home, osteo, { href: `/osteopathie/${m.slug}/`, label: m.label }],
  faq: m.faq, service: { name: `Ostéopathie : ${m.label.toLowerCase()}`, description: m.lead },
  body: `
<section class="motif-hero" aria-labelledby="h1">
  <div class="wrap motif-hero-grid">
    <div>
      <h1 id="h1" class="split">${splitWords(m.h1.replace(/ : (.*)$/, ' : <em>$1</em>'))}</h1>
      <p class="lead" data-reveal>${m.lead}</p>
      <div class="actions" data-reveal>${rdv()}${call()}</div>
    </div>
    <div class="motif-visual" data-reveal>${m.photo ? `<div class="arch arch-sm" data-parallax="-6">${pic(m.photo, { eager: true, sizes: '(min-width: 1024px) 34vw, 90vw' })}</div>` : babyArt(m.label)}</div>
  </div>
</section>

<section class="section cases" aria-labelledby="cases-t">
  <div class="wrap">
    <h2 id="cases-t" data-reveal>Vous vous <em>reconnaissez ?</em></h2>
    <ul class="case-list">${m.cases.map((c, i) => `<li data-tilt data-reveal><span class="case-n" aria-hidden="true">${['I', 'II', 'III'][i]}</span><p>${c}</p></li>`).join('')}</ul>
  </div>
</section>

<section class="section detail" aria-labelledby="quand-t">
  <div class="wrap detail-grid">
    <div data-reveal>
      <h2 id="quand-t">Quand consulter</h2>
      <ul class="checks">${m.when.map((w) => `<li>${icon('check')}<span>${w}</span></li>`).join('')}</ul>
    </div>
    <div data-reveal>
      <h2>Comment ça se passe</h2>
      <p>${m.session}</p>
      <p class="note">${m.note}</p>
      <p class="price-inline">Séance : <strong>${tbc(T.price)}</strong> · Durée : <strong>${tbc(T.duration)}</strong> · <a href="/tarifs/">Tarifs et remboursement</a></p>
    </div>
  </div>
</section>
${faq(m.faq)}
<section class="section others" aria-labelledby="others-t">
  <div class="wrap">
    <h2 id="others-t" class="h3">Les autres motifs de consultation</h2>
    <ul class="chips">${motifs.filter((o) => o.slug !== m.slug).map((o) => `<li><a href="/osteopathie/${o.slug}/" data-magnetic>${o.label}</a></li>`).join('')}<li><a href="/osteopathie/" data-magnetic>Tous les motifs</a></li></ul>
  </div>
</section>
${ctaFinal()}
`,
}));

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

export const pages = [pageHome, pageOsteo, ...motifPages, pageCabinet, pageTarifs, pageContact, pageLegal, pagePrivacy, page404];
