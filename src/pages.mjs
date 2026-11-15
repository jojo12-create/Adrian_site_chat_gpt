/* ==========================================================================
   Contenus de toutes les pages. Règles de rédaction :
   - bénéfices concrets, ton calme, phrases courtes ;
   - aucune promesse de guérison ; l'ostéopathie vient en complément du médecin ;
   - aucun chiffre ni diplôme inventé : les manques passent par todo().
   ========================================================================== */
import { site, reviews, TODO } from './site.mjs';
import { picture, btnRdv, btnCall, ctaBand, faqBlock, icon, todo, esc } from './layout.mjs';

const P = site.pending;
const A = site.address;
const home = { href: '/', label: 'Accueil' };
const osteo = { href: '/osteopathie', label: 'Ostéopathie' };

/* --- Publics : une page par profil (reprend les 6 pages du site actuel) --- */
const audiences = [
  {
    slug: 'nourrissons', label: 'Nourrissons', photo: 'detail',
    title: 'Ostéopathe pour nourrissons à Villefontaine',
    description: "Ostéopathie douce pour nourrissons à Villefontaine : naissance difficile, torticolis, inconfort digestif, sommeil agité. Rendez-vous sur Doctolib.",
    h1: 'Ostéopathie pour les nourrissons à Villefontaine',
    lead: "Les premières semaines demandent beaucoup au corps d'un bébé. Une consultation douce permet de repérer les tensions qui peuvent gêner son confort, en lien avec vous et votre pédiatre.",
    when: ['Naissance longue ou difficile, utilisation de forceps ou de ventouse', 'Torticolis ou tête toujours tournée du même côté', 'Coliques, reflux, inconfort digestif', 'Agitation, sommeil difficile'],
    session: "Bébé reste dans vos bras ou sur la table, à son rythme. Les gestes sont très doux et s'interrompent dès qu'il a besoin d'une pause, d'un câlin ou d'une tétée. Prévoyez son carnet de santé.",
    note: "<strong>Avant 6 mois</strong>, la réglementation demande une attestation de votre médecin ou pédiatre indiquant l'absence de contre-indication. Pensez à l'apporter le jour de la séance.",
    faq: [
      { q: 'À partir de quel âge peut-on consulter ?', a: "Dès les premières semaines. Avant 6 mois, une attestation médicale de non contre-indication est obligatoire." },
      { q: 'Combien de temps dure la séance pour un bébé ?', a: `Le temps dont votre enfant a besoin, sans le brusquer. Durée habituelle : ${todo(P.duration)}.` },
    ],
  },
  {
    slug: 'enfants', label: 'Enfants & ados', photo: 'consultation',
    title: 'Ostéopathe pour enfants et ados à Villefontaine',
    description: "Ostéopathie pour enfants et ados à Villefontaine : douleurs de croissance, posture, sport intensif, stress des études. Rendez-vous en ligne.",
    h1: 'Ostéopathie pour les enfants et les adolescents',
    lead: "Croissance rapide, cartable lourd, entraînements répétés, examens : le corps des plus jeunes encaisse beaucoup. La séance vise à préserver une posture et une mobilité confortables pendant ces années de changement.",
    when: ['Douleurs liées à la croissance (dos, genoux, articulations)', 'Posture déséquilibrée, gêne de coordination', 'Tensions dues au sport intensif ou à la fatigue scolaire', 'Prévention des blessures chez le jeune sportif'],
    session: "Un parent est présent pour les mineurs. J'explique chaque geste à l'enfant avec des mots simples, et rien n'est fait sans son accord.",
    note: "En cas de douleur persistante, de fièvre ou après une chute importante, consultez d'abord votre médecin.",
    faq: [
      { q: 'Faut-il être accompagné ?', a: "Oui, un parent ou un responsable légal accompagne l'enfant mineur pendant toute la séance." },
      { q: 'Mon enfant fait beaucoup de sport, est-ce utile ?', a: "Une séance peut aider à repérer des tensions ou une raideur avant qu'elles ne gênent sa pratique. Je vous dis honnêtement si un suivi est utile." },
    ],
  },
  {
    slug: 'grossesse', label: 'Grossesse', photo: 'soin',
    title: 'Ostéopathe femme enceinte à Villefontaine',
    description: "Ostéopathie pendant la grossesse à Villefontaine : lombaires, sciatique, bassin, jambes lourdes, préparation à l'accouchement. Rendez-vous en ligne.",
    h1: "L'ostéopathie pendant la grossesse",
    lead: "Le corps change vite pendant neuf mois. L'ostéopathie accompagne ces transformations pour aider à soulager certains inconforts du dos et du bassin, et préparer la mobilité du bassin avant l'accouchement.",
    when: ['Douleurs lombaires, sciatiques ou pelviennes', 'Fatigue, sommeil difficile, tensions liées au stress', "Préparation de la mobilité du bassin avant l'accouchement", 'Jambes lourdes, sensation de gonflement'],
    session: "Les positions sont adaptées à chaque trimestre : sur le côté, assise, avec des coussins. Vous pouvez demander une pause à tout moment.",
    note: "L'ostéopathie complète le suivi de votre sage-femme ou de votre gynécologue sans le remplacer. Au moindre signe inhabituel, contactez-les en priorité.",
    faq: [
      { q: 'À quel moment de la grossesse consulter ?', a: "À tout moment, dès qu'une gêne apparaît. Beaucoup de futures mamans consultent aussi en fin de grossesse, puis après l'accouchement." },
      { q: 'Peut-on consulter après la naissance ?', a: "Oui. Une séance après l'accouchement aide à faire le point sur le dos et le bassin. Vous pouvez venir avec votre bébé." },
    ],
  },
  {
    slug: 'adultes', label: 'Adultes', photo: 'ecoute',
    title: 'Ostéopathe mal de dos à Villefontaine | Adultes',
    description: "Ostéopathie pour adultes à Villefontaine : mal de dos, nuque, épaules, tensions liées au stress ou au travail assis. Rendez-vous en ligne.",
    h1: 'Ostéopathie pour les adultes : dos, nuque et tensions du quotidien',
    lead: "Travail assis, gestes répétés, port de charges, stress : les tensions s'installent souvent sans prévenir. La séance cherche à comprendre d'où vient la gêne, pas seulement là où elle se fait sentir.",
    when: ['Douleurs de dos, de nuque, d’épaules ou articulaires qui durent', 'Raideurs liées au travail sur écran ou à la sédentarité', 'Tensions liées au stress et à la fatigue', 'Reprise après une blessure, une chirurgie ou un accident, avec l’accord de votre médecin'],
    session: "Nous faisons le point sur vos habitudes : poste de travail, sommeil, activité physique. Vous repartez avec des conseils simples à appliquer au quotidien.",
    note: "Une douleur avec fièvre, perte de force, fourmillements importants ou troubles urinaires doit être vue par un médecin sans attendre.",
    faq: [
      { q: 'Je ne veux pas de « craquements », est-ce possible ?', a: "Oui. Il existe de nombreuses techniques douces. Rien n'est fait sans votre accord, et je vous explique chaque geste avant de le faire." },
      { q: 'Au bout de combien de temps peut-on revenir ?', a: "Cela dépend de votre situation. En fin de séance, je vous dis franchement si un suivi est utile ou non." },
    ],
  },
  {
    slug: 'seniors', label: 'Seniors', photo: 'profil',
    title: 'Ostéopathe pour seniors à Villefontaine',
    description: "Ostéopathie pour seniors à Villefontaine : raideurs, mobilité, équilibre, douleurs liées à l'arthrose. Accès de plain-pied, parking gratuit.",
    h1: 'Ostéopathie pour les seniors : mobilité et confort au quotidien',
    lead: "Avec les années, les raideurs gagnent du terrain et les gestes simples deviennent moins faciles. Des techniques douces, adaptées à l'âge, aident à préserver la souplesse et l'autonomie.",
    when: ["Douleurs articulaires ou musculaires, notamment liées à l'arthrose", 'Raideurs, difficulté à se baisser, à tourner la tête', "Envie de garder de l'équilibre et de l'assurance", 'Fatigue générale et tensions liées au stress'],
    session: "Le rythme est calme et les techniques toujours douces. Le cabinet est de plain-pied, avec un parking gratuit à proximité.",
    note: "Apportez la liste de vos traitements et vos derniers examens : ils m'aident à adapter la séance.",
    faq: [
      { q: "L'ostéopathie est-elle adaptée en cas d'ostéoporose ?", a: "Oui, à condition d'adapter les techniques. Signalez-la dès la prise de rendez-vous : seules des techniques douces seront utilisées." },
      { q: 'Peut-on venir accompagné ?', a: 'Bien sûr, un proche peut assister à la séance.' },
    ],
  },
  {
    slug: 'sportifs', label: 'Sportifs', photo: 'discussion',
    title: 'Ostéopathe du sport à Villefontaine',
    description: "Ostéopathie du sport à Villefontaine : prévention des blessures, récupération après l'effort, préparation d'une compétition. Pour amateurs et confirmés.",
    h1: 'Ostéopathie du sport : prévenir, récupérer, progresser',
    lead: "Passionné de sport, j'accompagne les sportifs amateurs comme confirmés. L'objectif : un corps mobile et équilibré pour encaisser l'entraînement, et une récupération mieux gérée.",
    when: ['Douleurs liées à la pratique (entorse, tendinite, lombaires…), après avis médical si besoin', "Préparation d'une compétition ou d'un objectif", 'Récupération après un entraînement intensif ou une course', 'Recherche de souplesse et de mobilité'],
    session: "Nous parlons de votre discipline, de votre charge d'entraînement et de vos sensations. La séance est construite autour de vos objectifs et de votre calendrier.",
    note: "Après un traumatisme (chute, choc, craquement entendu), faites d'abord un bilan médical pour écarter une lésion.",
    faq: [
      { q: 'Combien de temps avant une compétition consulter ?', a: "Idéalement quelques jours avant, pour laisser le corps s'adapter. Évitez la veille d'un effort important." },
      { q: 'Faut-il venir en tenue de sport ?', a: 'Une tenue souple est idéale : short, legging ou brassière.' },
    ],
  },
];

/* --- Blocs réutilisés --- */
const quote = (r, cls = '') => `
<figure class="quote ${cls}">
  <blockquote><p>« ${esc(r.text)} »</p></blockquote>
  <figcaption><span class="stars" role="img" aria-label="5 étoiles sur 5">${icon('star', 'ico s')}${icon('star', 'ico s')}${icon('star', 'ico s')}${icon('star', 'ico s')}${icon('star', 'ico s')}</span>${esc(r.author)} · avis Google</figcaption>
</figure>`;

const steps = `
<ol class="steps">
  <li><h3>L'échange</h3><p>Vos symptômes, vos antécédents, votre quotidien et vos traitements. C'est le moment de poser toutes vos questions.</p></li>
  <li><h3>Les tests</h3><p>J'observe votre posture et la mobilité de chaque région pour repérer les zones de tension.</p></li>
  <li><h3>Le traitement</h3><p>Des techniques manuelles adaptées à votre âge et à votre confort, toujours expliquées avant d'être faites.</p></li>
  <li><h3>Les conseils</h3><p>Des gestes ou des postures simples pour la suite, et un avis honnête sur l'utilité d'une nouvelle séance.</p></li>
</ol>`;

const facts = `
<ul class="facts">
  <li>${icon('check')}<span>Diplômé de l'école ATSA</span></li>
  <li>${icon('car')}<span>Parking gratuit, accès de plain-pied</span></li>
  <li>${icon('chat')}<span>Chaque geste expliqué avant d'être fait</span></li>
</ul>`;

const accessBlock = (headingLevel = 'h2') => `
<section class="section access" aria-labelledby="acces-title">
  <div class="wrap split">
    <div class="split-media reveal">${picture('cabinet1', "Salle de consultation du cabinet d'ostéopathie à Villefontaine")}</div>
    <div class="split-text">
      <${headingLevel} id="acces-title">Un cabinet facile d'accès dans le Nord-Isère</${headingLevel}>
      <p>Le cabinet se trouve aux Ravinelles, à Villefontaine, près de ${site.nearby.slice(0, -1).join(', ')} et ${site.nearby.at(-1)}.</p>
      <ul class="info-list">
        <li>${icon('pin')}<span><strong>${A.street}</strong><br>${A.area}, ${A.postalCode} ${A.city}</span></li>
        <li>${icon('car')}<span>Parking gratuit, entrée de plain-pied</span></li>
        <li>${icon('clock')}<span>${todo(P.hours)}<br>Créneaux à jour sur Doctolib</span></li>
      </ul>
      <div class="actions">
        <a class="btn btn-ghost" href="${site.links.directions}" target="_blank" rel="noopener">${icon('pin')}<span>Itinéraire</span></a>
        ${btnRdv()}
      </div>
    </div>
  </div>
</section>`;

const priceLine = `<p class="price-line"><span>Séance : <strong>${todo(P.price)}</strong></span><span>Durée : <strong>${todo(P.duration)}</strong></span><span>Chèque et carte bancaire</span></p>`;

/* =========================== ACCUEIL =========================== */
const homeFaq = [
  { q: "L'ostéopathie est-elle remboursée ?", a: "Elle n'est pas prise en charge par l'Assurance maladie. En revanche, beaucoup de mutuelles remboursent une partie des séances selon votre contrat. Une facture vous est remise pour votre mutuelle." },
  { q: 'Faut-il une ordonnance ?', a: "Non, vous pouvez consulter directement. Seule exception : pour un nourrisson de moins de 6 mois, une attestation médicale de non contre-indication est obligatoire." },
  { q: 'Comment savoir si une séance est utile pour moi ?', a: `Décrivez votre situation par téléphone ou via le <a href="/contact">formulaire</a>. Si l'ostéopathie n'est pas la bonne réponse, je vous oriente vers votre médecin.` },
  { q: 'Les manipulations font-elles mal ?', a: "Non, elles ne doivent pas faire mal. Les techniques sont adaptées à chacun, très douces chez l'enfant et la personne âgée, et rien n'est fait sans votre accord." },
  { q: 'Que faut-il apporter ?', a: "Vos examens récents (radio, IRM, comptes rendus), la liste de vos traitements et, pour un enfant, son carnet de santé. Prévoyez une tenue souple." },
];

const pageHome = {
  path: '/', file: 'index.html', preloadHero: 'ecoute',
  title: 'Ostéopathe à Villefontaine (38090) | Adrian Rodriguez',
  description: "Adrian Rodriguez, ostéopathe diplômé de l'ATSA à Villefontaine : nourrissons, grossesse, adultes, seniors et sportifs. Prenez rendez-vous sur Doctolib.",
  faq: homeFaq,
  body: `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-text" data-enter>
      <h1>Ostéopathe à Villefontaine, à chaque âge de la vie</h1>
      <p class="lead">Mal de dos, nuque raide, grossesse, reprise du sport ou premiers mois de bébé : je prends le temps de comprendre ce qui vous gêne, je vous explique chaque geste et je n'agis qu'avec votre accord.</p>
      <div class="actions">${btnRdv()}${btnCall()}</div>
      ${facts}
    </div>
    <div class="hero-media" data-enter>
      ${picture('ecoute', "Adrian Rodriguez, ostéopathe, à l'écoute d'un patient dans son cabinet de Villefontaine", { eager: true, sizes: '(min-width: 960px) 40vw, 100vw' })}
    </div>
  </div>
</section>

<section class="section motifs" aria-labelledby="motifs-title">
  <div class="wrap">
    <div class="section-head">
      <h2 id="motifs-title">Quand consulter un ostéopathe ?</h2>
      <p>L'ostéopathie s'intéresse aux tensions et aux pertes de mobilité qui entretiennent une gêne. Elle complète le suivi de votre médecin, sans le remplacer.</p>
    </div>
    <ul class="motif-list">
      <li><a href="/osteopathie-adultes"><h3>Dos, nuque, épaules</h3><p>Lombalgies, cervicalgies, raideurs du travail assis ou après un effort.</p>${icon('arrow', 'ico go')}</a></li>
      <li><a href="/osteopathie-adultes"><h3>Stress et fatigue</h3><p>Tensions qui s'installent avec un rythme de vie soutenu.</p>${icon('arrow', 'ico go')}</a></li>
      <li><a href="/osteopathie-grossesse"><h3>Grossesse</h3><p>Dos, bassin, jambes lourdes, préparation à l'accouchement.</p>${icon('arrow', 'ico go')}</a></li>
      <li><a href="/osteopathie-nourrissons"><h3>Nourrissons</h3><p>Naissance difficile, torticolis, inconfort digestif, sommeil agité.</p>${icon('arrow', 'ico go')}</a></li>
      <li><a href="/osteopathie-enfants"><h3>Enfants et ados</h3><p>Croissance, posture, sport intensif, fatigue scolaire.</p>${icon('arrow', 'ico go')}</a></li>
      <li><a href="/osteopathie-sportifs"><h3>Sportifs</h3><p>Prévention, récupération, préparation d'une compétition.</p>${icon('arrow', 'ico go')}</a></li>
      <li><a href="/osteopathie-seniors"><h3>Seniors</h3><p>Raideurs, mobilité et équilibre au quotidien.</p>${icon('arrow', 'ico go')}</a></li>
    </ul>
    <p class="aside-note">Un doute ? <a href="/contact">Décrivez votre situation</a> : si une séance n'est pas indiquée, je vous oriente vers votre médecin.</p>
  </div>
</section>

<section class="section tint seance" aria-labelledby="seance-title">
  <div class="wrap split split-reverse">
    <div class="split-media reveal">${picture('soin', "Adrian Rodriguez pratique une technique d'ostéopathie douce sur une patiente")}</div>
    <div class="split-text">
      <h2 id="seance-title">Comment se passe une séance</h2>
      ${steps}
      ${priceLine}
      <a class="link" href="/tarifs-seance">Tarifs, remboursement et déroulé complet ${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section avis" aria-labelledby="avis-title">
  <div class="wrap">
    <div class="section-head">
      <h2 id="avis-title">Ce que disent les patients</h2>
      <p>Des avis laissés sur Google, cités tels quels.</p>
    </div>
    <div class="quote-layout">
      ${quote(reviews[0], 'quote-lead')}
      <div class="quote-stack">${quote(reviews[1])}${quote(reviews[3])}</div>
    </div>
    <a class="link" href="${site.links.googleReviews}" target="_blank" rel="noopener">Lire tous les avis sur Google ${icon('arrow')}</a>
  </div>
</section>

${accessBlock()}
${faqBlock(homeFaq)}
${ctaBand()}
`,
};

/* =========================== OSTÉOPATHIE (hub) =========================== */
const osteoFaq = [
  { q: "Qu'est-ce que l'ostéopathie ?", a: "Une approche manuelle qui recherche les pertes de mobilité des tissus (articulations, muscles, viscères) susceptibles d'entretenir une gêne, puis cherche à les relâcher avec les mains." },
  { q: 'Quelle différence avec un kinésithérapeute ?', a: "Le kinésithérapeute rééduque, souvent sur prescription et en plusieurs séances, avec des exercices. L'ostéopathe travaille avec les mains sur l'origine des tensions, en séances plus espacées. Les deux se complètent." },
  { q: 'Combien de séances faut-il ?', a: "Il n'y a pas de nombre fixe. Je vous dis à la fin de chaque séance si un suivi est utile, et à quel intervalle." },
  { q: "Dans quels cas ne faut-il pas consulter un ostéopathe ?", a: "En cas de fièvre, de douleur après un choc important, de perte de force, de douleur dans la poitrine ou de troubles urinaires, consultez un médecin ou appelez le 15." },
];

const pageOsteo = {
  path: '/osteopathie', file: 'osteopathie.html',
  title: 'Ostéopathie à Villefontaine : motifs de consultation',
  description: "Mal de dos, grossesse, nourrissons, sport, seniors : découvrez quand consulter un ostéopathe à Villefontaine et comment se passe la prise en charge.",
  crumbs: [home, osteo], faq: osteoFaq,
  body: `
<section class="page-hero">
  <div class="wrap page-hero-grid">
    <div data-enter>
      <h1>L'ostéopathie à Villefontaine : pour qui, pour quoi ?</h1>
      <p class="lead">Une approche manuelle qui cherche à redonner de la mobilité là où le corps se crispe. Chaque séance est adaptée à votre âge, à votre histoire et à ce que vous ressentez.</p>
      <div class="actions">${btnRdv()}</div>
    </div>
    <div class="page-hero-media" data-enter>${picture('consultation', "Adrian Rodriguez en consultation d'ostéopathie à Villefontaine", { eager: true, sizes: '(min-width: 960px) 35vw, 100vw' })}</div>
  </div>
</section>

<section class="section" aria-labelledby="publics-title">
  <div class="wrap">
    <div class="section-head">
      <h2 id="publics-title">Un accompagnement selon votre âge et votre situation</h2>
      <p>Chaque profil a ses besoins. Choisissez le vôtre pour savoir quand consulter et comment se déroule la séance.</p>
    </div>
    <ul class="audience-list">
      ${audiences.map((a) => `<li><a href="/osteopathie-${a.slug}"><h3>${a.label}</h3><p>${a.lead.split('. ')[0]}.</p><span class="link-txt">En savoir plus ${icon('arrow')}</span></a></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="section tint" aria-labelledby="motifs2-title">
  <div class="wrap split">
    <div class="split-text">
      <h2 id="motifs2-title">Les motifs de consultation les plus fréquents</h2>
      <ul class="check-list">
        <li>${icon('check')}Douleurs de dos, lombalgies, sciatiques</li>
        <li>${icon('check')}Nuque raide, cervicalgies, maux de tête de tension</li>
        <li>${icon('check')}Épaules, genoux, chevilles après un effort ou une entorse ancienne</li>
        <li>${icon('check')}Tensions liées au stress, troubles du sommeil</li>
        <li>${icon('check')}Inconforts digestifs fonctionnels</li>
        <li>${icon('check')}Suivi de grossesse et après l'accouchement</li>
        <li>${icon('check')}Suivi du nourrisson et de l'enfant</li>
      </ul>
    </div>
    <div class="split-text callout">
      <h2>Quand voir d'abord un médecin</h2>
      <p>L'ostéopathie ne remplace pas un diagnostic médical. Consultez votre médecin, ou appelez le 15 en cas d'urgence, si la douleur s'accompagne :</p>
      <ul class="dash-list">
        <li>de fièvre ou d'une perte de poids inexpliquée ;</li>
        <li>d'une perte de force, de fourmillements importants ;</li>
        <li>de troubles urinaires ou digestifs inhabituels ;</li>
        <li>d'une douleur dans la poitrine, ou après un choc important.</li>
      </ul>
    </div>
  </div>
</section>

${faqBlock(osteoFaq)}
${ctaBand()}
`,
};

/* =========================== PAGES PUBLICS =========================== */
const audiencePages = audiences.map((a) => ({
  path: `/osteopathie-${a.slug}`, file: `osteopathie-${a.slug}.html`,
  title: a.title, description: a.description,
  crumbs: [home, osteo, { href: `/osteopathie-${a.slug}`, label: a.label }],
  faq: a.faq,
  body: `
<section class="page-hero">
  <div class="wrap page-hero-grid">
    <div data-enter>
      <h1>${a.h1}</h1>
      <p class="lead">${a.lead}</p>
      <div class="actions">${btnRdv()}${btnCall()}</div>
    </div>
    <div class="page-hero-media" data-enter>${picture(a.photo, `Séance d'ostéopathie avec Adrian Rodriguez à Villefontaine (${a.label.toLowerCase()})`, { eager: true, sizes: '(min-width: 960px) 35vw, 100vw' })}</div>
  </div>
</section>

<section class="section" aria-labelledby="quand-title">
  <div class="wrap split split-top">
    <div class="split-text">
      <h2 id="quand-title">Quand consulter ?</h2>
      <ul class="check-list">${a.when.map((w) => `<li>${icon('check')}${w}</li>`).join('')}</ul>
    </div>
    <div class="split-text">
      <h2>Comment se passe la séance</h2>
      <p>${a.session}</p>
      <p class="note">${a.note}</p>
      ${priceLine}
      <a class="link" href="/tarifs-seance">Tarifs et déroulé détaillé ${icon('arrow')}</a>
    </div>
  </div>
</section>

${faqBlock(a.faq)}

<section class="section tint" aria-labelledby="autres-title">
  <div class="wrap">
    <h2 id="autres-title">Les autres accompagnements</h2>
    <ul class="pill-list">${audiences.filter((b) => b.slug !== a.slug).map((b) => `<li><a href="/osteopathie-${b.slug}">${b.label}</a></li>`).join('')}<li><a href="/osteopathie">Tous les motifs</a></li></ul>
  </div>
</section>
${ctaBand()}
`,
}));

/* =========================== TARIFS & SÉANCE =========================== */
const tarifsFaq = [
  { q: 'Ma mutuelle rembourse-t-elle les séances ?', a: "La plupart des mutuelles prennent en charge un certain nombre de séances par an, avec un montant qui dépend de votre contrat. Vérifiez votre tableau de garanties ; je vous remets une facture à chaque séance." },
  { q: 'Comment annuler ou déplacer un rendez-vous ?', a: `Directement depuis Doctolib, ou par téléphone au <a href="${site.phone.href}">${site.phone.display}</a>. Délai d'annulation : ${todo(TODO)}.` },
  { q: 'Le tarif est-il le même pour un enfant ou un nourrisson ?', a: `Tarif enfant et nourrisson : ${todo(TODO)}.` },
  { q: 'Quels moyens de paiement sont acceptés ?', a: 'Chèque et carte bancaire.' },
];

const pageTarifs = {
  path: '/tarifs-seance', file: 'tarifs-seance.html',
  title: "Tarifs et déroulé d'une séance d'ostéopathie",
  description: "Prix d'une séance d'ostéopathie à Villefontaine, durée, remboursement par la mutuelle et déroulé complet d'une consultation avec Adrian Rodriguez.",
  crumbs: [home, { href: '/tarifs-seance', label: 'Tarifs & séance' }], faq: tarifsFaq,
  body: `
<section class="page-hero page-hero-text">
  <div class="wrap narrow" data-enter>
    <h1>Tarifs et déroulé d'une séance d'ostéopathie</h1>
    <p class="lead">Un tarif affiché, une séance expliquée étape par étape : vous savez à quoi vous attendre avant de réserver.</p>
    <div class="actions">${btnRdv()}${btnCall()}</div>
  </div>
</section>

<section class="section" aria-labelledby="prix-title">
  <div class="wrap narrow">
    <h2 id="prix-title">Les tarifs</h2>
    <table class="price-table">
      <caption class="sr-only">Tarifs des consultations d'ostéopathie</caption>
      <thead><tr><th scope="col">Consultation</th><th scope="col">Durée</th><th scope="col">Tarif</th></tr></thead>
      <tbody>
        <tr><th scope="row">Adulte</th><td>${todo(P.duration)}</td><td>${todo(P.price)}</td></tr>
        <tr><th scope="row">Enfant et adolescent</th><td>${todo(TODO)}</td><td>${todo(TODO)}</td></tr>
        <tr><th scope="row">Nourrisson</th><td>${todo(TODO)}</td><td>${todo(TODO)}</td></tr>
        <tr><th scope="row">Femme enceinte</th><td>${todo(TODO)}</td><td>${todo(TODO)}</td></tr>
        <tr><th scope="row">Sportif</th><td>${todo(TODO)}</td><td>${todo(TODO)}</td></tr>
      </tbody>
    </table>
    <ul class="info-list compact">
      <li>${icon('check')}<span><strong>Remboursement :</strong> non pris en charge par l'Assurance maladie, mais souvent par les mutuelles. Une facture vous est remise.</span></li>
      <li>${icon('check')}<span><strong>Paiement :</strong> chèque ou carte bancaire.</span></li>
      <li>${icon('check')}<span><strong>Sans ordonnance,</strong> sauf pour un nourrisson de moins de 6 mois (attestation médicale obligatoire).</span></li>
    </ul>
    <div class="actions">${btnRdv()}</div>
  </div>
</section>

<section class="section tint" aria-labelledby="deroule-title">
  <div class="wrap split split-reverse">
    <div class="split-media reveal">${picture('detail', "Geste d'ostéopathie précis réalisé par Adrian Rodriguez")}</div>
    <div class="split-text">
      <h2 id="deroule-title">Le déroulé d'une séance</h2>
      ${steps}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="prep-title">
  <div class="wrap narrow">
    <h2 id="prep-title">Préparer votre venue</h2>
    <ul class="check-list two-col">
      <li>${icon('check')}Vos examens récents : radio, IRM, comptes rendus</li>
      <li>${icon('check')}La liste de vos traitements en cours</li>
      <li>${icon('check')}Une tenue souple, ou des sous-vêtements confortables</li>
      <li>${icon('check')}Pour un enfant : son carnet de santé</li>
      <li>${icon('check')}Avant 6 mois : l'attestation du médecin</li>
      <li>${icon('check')}Votre carte de mutuelle si besoin d'une facture</li>
    </ul>
  </div>
</section>

${faqBlock(tarifsFaq)}
${ctaBand()}
`,
};

/* =========================== À PROPOS =========================== */
const pageAbout = {
  path: '/a-propos', file: 'a-propos.html',
  title: 'Adrian Rodriguez, ostéopathe diplômé ATSA à Villefontaine',
  description: "Adrian Rodriguez, ostéopathe diplômé de l'école ATSA, vous reçoit à Villefontaine : écoute, explications claires et suivi des sportifs.",
  crumbs: [home, { href: '/a-propos', label: 'À propos' }],
  body: `
<section class="page-hero">
  <div class="wrap page-hero-grid">
    <div data-enter>
      <h1>Adrian Rodriguez, ostéopathe à Villefontaine</h1>
      <p class="lead">Diplômé de l'école ATSA, je reçois au cabinet des Ravinelles des patients de tous âges, du nourrisson au senior. Passionné de sport, j'accompagne aussi les sportifs dans leur récupération et leur préparation.</p>
      <div class="actions">${btnRdv()}</div>
    </div>
    <div class="page-hero-media" data-enter>${picture('profil', 'Portrait d’Adrian Rodriguez, ostéopathe à Villefontaine', { eager: true, sizes: '(min-width: 960px) 35vw, 100vw' })}</div>
  </div>
</section>

<section class="section" aria-labelledby="approche-title">
  <div class="wrap split split-top">
    <div class="split-text">
      <h2 id="approche-title">Ma façon de travailler</h2>
      <p><strong>Écouter avant d'agir.</strong> La première partie de la séance est consacrée à votre histoire : ce que vous ressentez, depuis quand, ce qui soulage ou aggrave.</p>
      <p><strong>Expliquer chaque geste.</strong> Vous savez ce que je fais et pourquoi. Aucune technique n'est réalisée sans votre accord.</p>
      <p><strong>Être honnête.</strong> Si l'ostéopathie n'est pas adaptée à votre situation, je vous le dis et je vous oriente vers le bon professionnel.</p>
    </div>
    <div class="split-text">
      <h2>Formation et parcours</h2>
      <ul class="info-list compact">
        <li>${icon('check')}<span>Diplômé de l'école ATSA (année : ${todo(P.graduation)})</span></li>
        <li>${icon('check')}<span>Formations complémentaires : ${todo(TODO)}</span></li>
        <li>${icon('check')}<span>N° ADELI / RPPS : ${todo(P.adeli)}</span></li>
      </ul>
      <p>Suivez la vie du cabinet et des conseils pratiques sur <a href="${site.links.instagram}" target="_blank" rel="noopener">Instagram @adrianosteo</a>.</p>
    </div>
  </div>
</section>

<section class="section tint avis" aria-labelledby="avis2-title">
  <div class="wrap">
    <div class="section-head"><h2 id="avis2-title">Ce que les patients retiennent</h2></div>
    <div class="quote-grid">${[reviews[1], reviews[2], reviews[5]].map((r) => quote(r)).join('')}</div>
    <a class="link" href="${site.links.googleReviews}" target="_blank" rel="noopener">Tous les avis sur Google ${icon('arrow')}</a>
  </div>
</section>
${ctaBand('Faisons le point ensemble')}
`,
};

/* =========================== CONTACT & RDV =========================== */
const contactFaq = [
  { q: 'Quel est le moyen le plus rapide pour avoir un rendez-vous ?', a: "Doctolib : vous voyez les créneaux libres et réservez en quelques clics, jour et nuit." },
  { q: "Est-ce que vous recevez en urgence ?", a: "Je fais au mieux pour proposer un créneau rapide : appelez directement. En cas d'urgence médicale, composez le 15." },
  { q: 'Que se passe-t-il après l’envoi du formulaire ?', a: "Je vous recontacte par téléphone ou par e-mail pour convenir d'un créneau. Le formulaire ne réserve pas de rendez-vous à lui seul." },
];

const pageContact = {
  path: '/contact', file: 'contact.html',
  title: 'Rendez-vous ostéopathe à Villefontaine | Contact',
  description: "Prenez rendez-vous avec Adrian Rodriguez, ostéopathe à Villefontaine : Doctolib, téléphone, WhatsApp ou formulaire. Adresse, accès et parking gratuit.",
  crumbs: [home, { href: '/contact', label: 'Contact' }], faq: contactFaq,
  body: `
<section class="page-hero page-hero-text">
  <div class="wrap narrow" data-enter>
    <h1>Prendre rendez-vous avec votre ostéopathe à Villefontaine</h1>
    <p class="lead">Réservez en ligne, appelez, ou laissez un message : je vous réponds pour trouver le bon créneau.</p>
  </div>
</section>

<section class="section contact-ways" aria-label="Moyens de prise de rendez-vous">
  <div class="wrap ways">
    <div class="way way-main">
      <h2>${icon('calendar')} En ligne, 24 h/24</h2>
      <p>Les créneaux disponibles en temps réel, confirmation immédiate.</p>
      ${btnRdv('Réserver sur Doctolib')}
    </div>
    <div class="way">
      <h2>${icon('phone')} Par téléphone</h2>
      <p>Pour une question ou un créneau rapide.</p>
      ${btnCall()}
    </div>
    <div class="way">
      <h2>${icon('chat')} Par WhatsApp</h2>
      <p>Écrivez quand vous voulez, je réponds dès que possible.</p>
      <a class="btn btn-ghost" href="${site.links.whatsapp}" target="_blank" rel="noopener">${icon('chat')}<span>Envoyer un message</span></a>
    </div>
  </div>
</section>

<section class="section tint" aria-labelledby="form-title">
  <div class="wrap split split-top">
    <div class="split-text">
      <h2 id="form-title">Être rappelé</h2>
      <p>Quatre champs, une minute. Je vous recontacte pour fixer le rendez-vous.</p>
      <form class="form" id="contact-form" novalidate data-contact-form>
        <div class="field">
          <label for="f-name">Nom et prénom</label>
          <input id="f-name" name="name" type="text" autocomplete="name" required maxlength="100" aria-describedby="e-name">
          <p class="error" id="e-name" hidden></p>
        </div>
        <div class="field">
          <label for="f-contact">Téléphone ou e-mail</label>
          <input id="f-contact" name="contact" type="text" autocomplete="tel" inputmode="email" required maxlength="120" aria-describedby="h-contact e-contact">
          <p class="hint" id="h-contact">Pour que je puisse vous répondre.</p>
          <p class="error" id="e-contact" hidden></p>
        </div>
        <div class="field">
          <label for="f-for">La séance concerne</label>
          <select id="f-for" name="for" required aria-describedby="e-for">
            <option value="">Choisir…</option>
            <option>Un adulte</option><option>Un enfant ou un adolescent</option><option>Un nourrisson</option>
            <option>Une femme enceinte</option><option>Un sportif</option><option>Une personne âgée</option><option>Autre</option>
          </select>
          <p class="error" id="e-for" hidden></p>
        </div>
        <div class="field">
          <label for="f-msg">Message <span class="optional">(facultatif)</span></label>
          <textarea id="f-msg" name="message" rows="4" maxlength="1000" aria-describedby="h-msg"></textarea>
          <p class="hint" id="h-msg">Vos disponibilités, par exemple. Évitez les informations médicales détaillées.</p>
        </div>
        <div class="field hp" aria-hidden="true"><label for="f-web">Site web</label><input id="f-web" name="website" type="text" tabindex="-1" autocomplete="off"></div>
        <div class="field check">
          <input id="f-consent" name="consent" type="checkbox" required aria-describedby="e-consent">
          <label for="f-consent">J'accepte que mes coordonnées soient utilisées pour me recontacter. <a href="/confidentialite">En savoir plus</a></label>
          <p class="error" id="e-consent" hidden></p>
        </div>
        <button class="btn btn-primary" type="submit" data-submit>${icon('arrow')}<span>Envoyer ma demande</span></button>
        <p class="form-status" role="status" aria-live="polite" data-status></p>
      </form>
    </div>
    <div class="split-text">
      <h2>Le cabinet</h2>
      <ul class="info-list">
        <li>${icon('pin')}<span><strong>${A.street}</strong><br>${A.area}<br>${A.postalCode} ${A.city}</span></li>
        <li>${icon('car')}<span>Parking gratuit, entrée de plain-pied</span></li>
        <li>${icon('clock')}<span>${todo(P.hours)}</span></li>
        <li>${icon('phone')}<span><a href="${site.phone.href}">${site.phone.display}</a></span></li>
        <li>${icon('mail')}<span><a href="mailto:${site.email}">${site.email}</a></span></li>
      </ul>
      <a class="btn btn-ghost" href="${site.links.directions}" target="_blank" rel="noopener">${icon('pin')}<span>Itinéraire Google Maps</span></a>
      <div class="map-card reveal">${picture('cabinet2', "Intérieur du cabinet d'ostéopathie d'Adrian Rodriguez à Villefontaine")}</div>
    </div>
  </div>
</section>

${faqBlock(contactFaq)}
`,
};

/* =========================== LÉGAL =========================== */
const pageLegal = {
  path: '/mentions-legales', file: 'mentions-legales.html',
  title: 'Mentions légales | Adrian Rodriguez, ostéopathe',
  description: "Mentions légales du site d'Adrian Rodriguez, ostéopathe à Villefontaine : éditeur, numéro professionnel, hébergeur et propriété intellectuelle.",
  crumbs: [home, { href: '/mentions-legales', label: 'Mentions légales' }],
  body: `
<section class="section legal">
  <div class="wrap narrow prose">
    <h1>Mentions légales</h1>
    <h2>Éditeur du site</h2>
    <p>Adrian Rodriguez, ostéopathe<br>${A.street}, ${A.area}, ${A.postalCode} ${A.city}<br>Téléphone : ${site.phone.display} · E-mail : ${site.email}</p>
    <p>N° ADELI / RPPS : ${todo(P.adeli)}<br>SIRET : ${todo(P.siret)}</p>
    <p>Directeur de la publication : Adrian Rodriguez.</p>
    <h2>Hébergement</h2>
    <p>${todo(P.host)}</p>
    <h2>Activité</h2>
    <p>L'ostéopathie est une pratique de soins manuels encadrée par le décret n° 2007-435 du 25 mars 2007. Les informations publiées sur ce site sont générales : elles ne remplacent ni une consultation ni un avis médical.</p>
    <h2>Propriété intellectuelle</h2>
    <p>Les textes et photographies de ce site sont la propriété d'Adrian Rodriguez, sauf mention contraire. Toute reproduction sans autorisation est interdite. Les polices League Spartan et Source Sans 3 sont distribuées sous licence SIL Open Font License.</p>
    <h2>Données personnelles</h2>
    <p>Voir la page <a href="/confidentialite">Confidentialité</a>.</p>
  </div>
</section>`,
};

const pagePrivacy = {
  path: '/confidentialite', file: 'confidentialite.html',
  title: 'Confidentialité et données personnelles | Adrian Rodriguez',
  description: "Comment sont traitées les données envoyées via le formulaire de contact du site d'Adrian Rodriguez, ostéopathe à Villefontaine, et quels sont vos droits.",
  crumbs: [home, { href: '/confidentialite', label: 'Confidentialité' }],
  body: `
<section class="section legal">
  <div class="wrap narrow prose">
    <h1>Confidentialité et données personnelles</h1>
    <h2>Responsable du traitement</h2>
    <p>Adrian Rodriguez, ostéopathe, ${A.street}, ${A.postalCode} ${A.city}, ${site.email}.</p>
    <h2>Données collectées</h2>
    <p>Le formulaire de contact recueille votre nom, un moyen de vous joindre, la personne concernée par la séance et, si vous le souhaitez, un message. Aucune information médicale n'est demandée : merci de ne pas en transmettre par ce biais.</p>
    <h2>Finalité et base légale</h2>
    <p>Ces données servent uniquement à vous recontacter pour organiser un rendez-vous. Le traitement repose sur votre consentement, donné en cochant la case du formulaire.</p>
    <h2>Durée de conservation</h2>
    <p>Les demandes sont supprimées au plus tard 12 mois après leur réception <mark class="todo">[durée à valider]</mark>.</p>
    <h2>Destinataires</h2>
    <p>Seul Adrian Rodriguez a accès à vos données. Elles ne sont ni vendues ni cédées. La prise de rendez-vous en ligne est assurée par Doctolib, selon sa propre politique de confidentialité.</p>
    <h2>Cookies et mesure d'audience</h2>
    <p>Ce site ne dépose aucun cookie publicitaire ni de mesure d'audience. Les polices sont hébergées sur le site : aucune donnée n'est envoyée à un service tiers lors de votre visite.</p>
    <h2>Vos droits</h2>
    <p>Vous pouvez accéder à vos données, les rectifier ou demander leur suppression en écrivant à ${site.email}. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).</p>
  </div>
</section>`,
};

const page404 = {
  path: '/404', file: '404.html', noindex: true,
  title: 'Page introuvable | Adrian Rodriguez, ostéopathe',
  description: "Cette page n'existe pas ou a été déplacée. Retrouvez l'accueil, les tarifs ou la prise de rendez-vous avec Adrian Rodriguez, ostéopathe à Villefontaine.",
  body: `
<section class="section page-hero-text">
  <div class="wrap narrow">
    <h1>Cette page n'existe pas (ou plus)</h1>
    <p class="lead">Le site a été refait : l'adresse que vous cherchez a peut-être changé.</p>
    <ul class="pill-list"><li><a href="/">Accueil</a></li><li><a href="/osteopathie">Ostéopathie</a></li><li><a href="/tarifs-seance">Tarifs</a></li><li><a href="/contact">Contact</a></li></ul>
    <div class="actions">${btnRdv()}</div>
  </div>
</section>`,
};

export const pages = [pageHome, pageOsteo, ...audiencePages, pageTarifs, pageAbout, pageContact, pageLegal, pagePrivacy, page404];
