/* ==========================================================================
   CATÉGORIES : 7 profils de patients (inventaire de la démo) + 7 troubles
   (site officiel et démo). Une page, un symbole en relief par catégorie.
   Ton prudent (repris de la démo) : pas de promesse de résultat,
   l'ostéopathie complète le suivi médical.
   ========================================================================== */

const commonLimits = "L'ostéopathie peut être envisagée pour certaines gênes, avec des bénéfices variables selon la situation. Elle ne remplace ni un diagnostic ni un traitement médical lorsqu'ils sont nécessaires.";

export const patients = [
  {
    slug: 'nourrissons', label: 'Nouveau-nés', tone: 'gold', photo: null,
    short: 'Une consultation douce, pensée pour le tout-petit et ses parents.',
    // SEO : « ostéopathe nourrisson Villefontaine » · bébé · torticolis du nourrisson · après l'accouchement
    title: 'Ostéopathe pour nourrissons à Villefontaine',
    description: "Ostéopathie douce pour les nouveau-nés à Villefontaine : écoute des parents, respect du suivi pédiatrique, attestation médicale avant 6 mois.",
    h1: 'Nouveau-nés : les premiers instants, avec douceur',
    lead: "Un bébé découvre le monde à son rythme. L'accueil au cabinet commence par l'écoute des parents, dans le respect du tout-petit et de son suivi pédiatrique.",
    cases: ["La naissance a été longue, avec ventouse ou forceps.", "Votre bébé tourne toujours la tête du même côté.", "Vous voulez faire le point en douceur, en complément du pédiatre."],
    when: ['Après une naissance difficile', 'Tête souvent tournée du même côté', 'Inconfort, en complément du suivi pédiatrique', 'Questions des parents sur le confort de bébé'],
    session: "Bébé reste dans vos bras ou sur la table, à son rythme : pause, câlin ou tétée quand il le faut. Les gestes sont très doux et toujours expliqués.",
    limits: "Les preuves d'efficacité de l'ostéopathie pour les troubles courants du nourrisson sont limitées : aucune séance n'est présentée comme un traitement garanti des coliques, du reflux ou du sommeil. Le suivi par le pédiatre reste prioritaire.",
    medical: "Fièvre chez un bébé de moins de trois mois, difficultés respiratoires, refus de s'alimenter ou somnolence inhabituelle : demandez un avis médical urgent.",
    note: "<strong>Avant 6 mois</strong>, une attestation de votre médecin ou pédiatre indiquant l'absence de contre-indication est obligatoire (décret n° 2007-435).",
    faq: [
      { q: 'À partir de quel âge peut-on consulter ?', a: "Dès les premières semaines. Avant 6 mois, l'attestation médicale de non contre-indication est obligatoire." },
      { q: 'Que faut-il apporter ?', a: "Le carnet de santé de bébé et, avant 6 mois, l'attestation du médecin." },
    ],
  },
  {
    slug: 'enfants-adolescents', label: 'Enfants & adolescents', tone: 'green', photo: null,
    short: "Une prise en charge à l'écoute de la croissance, des activités et des habitudes.",
    // SEO : « ostéopathe enfant Villefontaine » · adolescent · croissance · posture · jeune sportif
    title: 'Ostéopathe enfants et adolescents à Villefontaine',
    description: "Ostéopathie pour enfants et adolescents à Villefontaine : croissance, posture, cartable, sport intensif. Une consultation attentive à chaque âge.",
    h1: 'Enfants et ados : grandir, bouger, découvrir',
    lead: "De l'enfance à l'adolescence, les habitudes changent et le corps évolue vite. Une consultation attentive à l'âge, aux activités et à la parole de chacun.",
    cases: ["Votre ado grandit vite et se plaint du dos après les cours.", "Votre enfant enchaîne les entraînements et ressent des gênes.", "Le cartable lourd et les écrans laissent des tensions."],
    when: ['Douleurs liées à la croissance (dos, genoux)', 'Posture, cartable, temps d’écran', 'Sport intensif : prévention et récupération', 'Tensions liées au stress scolaire'],
    session: "Un parent est toujours présent pour les mineurs. J'explique chaque geste avec des mots simples, et rien n'est fait sans l'accord de l'enfant.",
    limits: commonLimits,
    medical: "Douleur persistante, fièvre, boiterie inexpliquée ou douleur après une chute importante : consultez d'abord votre médecin.",
    faq: [
      { q: 'Faut-il être accompagné ?', a: "Oui, un parent ou un responsable légal accompagne l'enfant mineur pendant toute la séance." },
      { q: 'Mon enfant fait beaucoup de sport, est-ce utile ?', a: "Une séance permet de faire le point sur sa mobilité et ses sensations. Je vous dis honnêtement si un suivi est utile." },
    ],
  },
  {
    slug: 'femme-enceinte', label: 'Femmes enceintes', tone: 'gold', photo: null,
    short: 'Un accompagnement ajusté au confort et aux changements de la grossesse.',
    // SEO : « ostéopathe femme enceinte Villefontaine » · grossesse · sciatique · bassin · post-partum
    title: 'Ostéopathe femme enceinte à Villefontaine',
    description: "Ostéopathie pendant la grossesse à Villefontaine : dos, bassin, sciatique, confort au quotidien et suivi après l'accouchement, avec votre sage-femme.",
    h1: 'Grossesse : accompagner les changements du corps',
    lead: "Le corps se transforme, les repères évoluent. Un temps d'écoute pour parler de votre confort, avec des précautions adaptées et dans le respect de votre suivi de grossesse.",
    cases: ["Le bas du dos tire dès que vous restez debout.", "Une douleur part dans la fesse et descend dans la jambe.", "Après l'accouchement, vous voulez faire le point sur votre dos et votre bassin."],
    when: ['Douleurs lombaires, sciatiques ou pelviennes', 'Fatigue, sommeil difficile, tensions', 'Mobilité du bassin avant l’accouchement', 'Après la naissance : dos, bassin, portage'],
    session: "Les positions sont adaptées à chaque trimestre : sur le côté, assise, avec des coussins. Vous pouvez demander une pause à tout moment.",
    limits: "L'ostéopathie complète le suivi de votre sage-femme ou de votre gynécologue, sans le remplacer. " + commonLimits,
    medical: "Saignements, contractions, maux de tête intenses, troubles de la vision ou baisse des mouvements du bébé : contactez immédiatement votre maternité.",
    faq: [
      { q: 'À quel moment de la grossesse consulter ?', a: "À tout moment, dès qu'une gêne apparaît, et aussi après l'accouchement." },
      { q: 'Peut-on venir avec bébé après la naissance ?', a: 'Oui, et une séance pour bébé peut avoir lieu le même jour.' },
    ],
  },
  {
    slug: 'adultes', label: 'Adultes & quotidien', tone: 'green', photo: 'adrian-ecoute',
    short: "Tensions, inconforts et contraintes d'un rythme de vie soutenu.",
    // SEO : « ostéopathe Villefontaine adulte » · travail assis · tensions · douleurs du quotidien
    title: 'Ostéopathe pour adultes à Villefontaine',
    description: "Ostéopathie pour adultes à Villefontaine : tensions du travail assis, gestes répétés, port de charges, stress. Une consultation sans précipitation.",
    h1: 'Adultes : prendre soin de ses mouvements au quotidien',
    lead: "Au fil des journées, le corps s'adapte aux gestes répétés, aux heures assises et aux élans du quotidien. Une consultation pour faire le point, avec attention et sans précipitation.",
    cases: ["Huit heures devant l'écran, et la nuque comme les épaules s'en ressentent.", "Les trajets, le port des enfants ou des courses fatiguent le dos.", "Une gêne s'installe depuis quelques semaines sans raison claire."],
    when: ['Tensions de la nuque, du dos ou des épaules', 'Raideurs liées au travail assis ou physique', 'Gêne dans les mouvements du quotidien', 'Tensions liées au stress et à la fatigue'],
    session: "Nous échangeons sur vos antécédents, votre travail, vos activités et l'évolution de votre gêne. Après une évaluation adaptée, les gestes proposés sont expliqués et réalisés avec votre accord.",
    limits: commonLimits,
    medical: "Une douleur après un traumatisme, associée à de la fièvre, une perte de force ou des troubles neurologiques doit conduire à une évaluation médicale.",
    faq: [
      { q: 'Je ne veux pas de « craquements », est-ce possible ?', a: "Oui. Il existe de nombreuses techniques douces, et rien n'est fait sans votre accord." },
      { q: 'Combien de séances faut-il ?', a: "Il n'y a pas de nombre fixe. À la fin de chaque séance, je vous dis franchement si un suivi est utile." },
    ],
  },
  {
    slug: 'seniors', label: 'Seniors', tone: 'gold', photo: 'soin-epaule',
    short: 'Des consultations attentives à la mobilité, au confort et au rythme de chacun.',
    // SEO : « ostéopathe senior Villefontaine » · arthrose · raideurs · mobilité · autonomie
    title: 'Ostéopathe pour seniors à Villefontaine',
    description: "Ostéopathie douce pour les seniors à Villefontaine : raideurs, arthrose, mobilité au quotidien. Cabinet de plain-pied avec parking gratuit.",
    h1: 'Seniors : préserver le plaisir de bouger',
    lead: "Chaque âge porte son expérience. La consultation prend en compte votre histoire, votre mobilité et ce qui vous permet de rester actif à votre rythme.",
    cases: ["Se baisser pour lacer ses chaussures devient difficile.", "Les épaules ou les hanches sont raides le matin.", "Vous voulez rester actif pour le jardin, la marche, les petits-enfants."],
    when: ["Raideurs, douleurs articulaires liées à l'arthrose", 'Difficulté à se baisser, à tourner la tête', 'Envie de rester actif à son rythme', 'Tensions et fatigue générale'],
    session: "Le rythme est calme et les techniques toujours douces. Le cabinet est de plain-pied, avec un parking gratuit à proximité.",
    limits: commonLimits,
    medical: "Chute récente, douleur brutale, perte de force ou vertiges nouveaux : consultez votre médecin en priorité.",
    note: "Apportez la liste de vos traitements et vos derniers examens : ils permettent d'adapter la séance.",
    faq: [
      { q: "Est-ce adapté en cas d'ostéoporose ?", a: "Oui, en adaptant les techniques. Signalez-la à la prise de rendez-vous : seules des techniques douces seront utilisées." },
      { q: 'Peut-on venir accompagné ?', a: 'Bien sûr, un proche peut assister à la séance.' },
    ],
  },
  {
    slug: 'sportifs', label: 'Sportifs', tone: 'green', photo: 'soin-dos',
    short: 'Préparation, récupération et suivi adaptés aux exigences de votre discipline.',
    // SEO : « ostéopathe du sport Villefontaine » · récupération · boxe · course à pied · Nord-Isère
    title: 'Ostéopathe du sport à Villefontaine',
    description: "Ostéopathie du sport à Villefontaine : préparation, saison, récupération. Course, sports collectifs, musculation, boxe : un suivi adapté à chacun.",
    h1: 'Sportifs : à l’écoute du mouvement',
    lead: "Derrière chaque entraînement, il y a un rythme, une exigence, une histoire. La consultation tient compte de votre discipline, de vos sensations et de votre parcours.",
    cases: ["Vous préparez un trail ou un semi et une gêne au genou revient à chaque sortie.", "Après chaque match, le dos ou les adducteurs mettent des jours à récupérer.", "Vous reprenez après une entorse et vous n'osez plus forcer."],
    when: ['Avant l’effort : faire le point sur mobilité et objectifs', 'Au fil de la saison : charge et contraintes de pratique', 'En récupération : adapter la séance à votre état', 'Course, sports collectifs, musculation, boxe, disciplines techniques'],
    session: "La séance commence par un échange sur votre activité, votre charge d'entraînement, vos sensations et ce que vous souhaitez retrouver dans le mouvement.",
    limits: "L'accompagnement ostéopathique peut s'intégrer à une démarche globale de confort et de mobilité. Il ne garantit pas une performance, ne remplace pas l'entraînement ou la rééducation prescrite et ne se substitue pas à un diagnostic médical.",
    medical: "Après un choc, une chute, un craquement entendu ou un gonflement important : faites d'abord un bilan médical.",
    terrain: "Adrian Rodriguez accompagne les sportifs dans leur préparation et leur suivi. Il travaille notamment avec les boxeurs Jordan Rodriguez et Yanis Meha, est intervenu lors de galas de boxe à Bourgoin-Jallieu et participe au suivi des boxeurs du Ring Berjallien.",
    faq: [
      { q: 'Quand consulter avant une compétition ?', a: "Idéalement quelques jours avant, pour laisser le corps s'adapter. Évitez la veille d'un effort important." },
      { q: 'Faut-il venir en tenue de sport ?', a: 'Une tenue souple est idéale : short, legging ou brassière.' },
    ],
  },
  {
    slug: 'mobilite-equilibre', label: 'Mobilité & équilibre', tone: 'gold', photo: null,
    short: "Un accompagnement qui tient compte de votre âge, de votre histoire et de vos objectifs.",
    // SEO : « ostéopathe mobilité Villefontaine » · raideurs · équilibre · reprise d'activité
    title: 'Ostéopathe mobilité et équilibre à Villefontaine',
    description: "Marcher, se pencher, lever les bras, reprendre une activité : l'ostéopathie à Villefontaine pour bouger avec plus de confiance et d'aisance.",
    h1: 'Mobilité et équilibre : bouger avec plus de confiance',
    lead: "Marcher, se pencher, lever les bras : les gestes les plus simples méritent parfois qu'on s'y attarde. Explorons ensemble ce qui limite votre aisance et ce qui compte pour vous.",
    cases: ["Monter les escaliers devient inconfortable.", "Tourner la tête en voiture est difficile.", "Vous voulez reprendre une activité en confiance."],
    when: ['Raideurs, amplitude de mouvement réduite', 'Reprise d’une activité après une pause', 'Gestes du quotidien devenus difficiles', 'Envie de gagner en aisance et en confiance'],
    session: "La consultation tient compte de vos activités, de vos antécédents, de votre confort et de vos objectifs. Si une prise en charge ostéopathique paraît appropriée, elle est discutée avec vous.",
    limits: "Le mouvement régulier et progressif, adapté à vos capacités, reste un élément important de la santé. Un accompagnement médical ou de kinésithérapie peut être préférable selon les cas.",
    medical: "Pertes d'équilibre nouvelles, chutes répétées, vertiges importants ou troubles neurologiques : un avis médical est nécessaire.",
    faq: [
      { q: 'Est-ce différent de la kinésithérapie ?', a: "Oui : le kinésithérapeute rééduque avec des exercices, souvent sur prescription. L'ostéopathe travaille avec les mains. Les deux se complètent." },
      { q: "À quel âge est-ce utile ?", a: "À tout âge : la mobilité concerne autant l'actif qui reprend le sport que le senior qui veut rester autonome." },
    ],
  },
];

export const troubles = [
  {
    slug: 'lombalgie', label: 'Lombalgie', zone: 'lombaires', tone: 'green', photo: 'soin-dos-table',
    short: 'Bas du dos bloqué, raideur du matin, douleur après un faux mouvement.',
    // SEO : « ostéopathe lombalgie Villefontaine » · mal de dos · dos bloqué · lumbago
    title: 'Ostéopathe lombalgie et mal de dos à Villefontaine',
    description: "Lombalgie, dos bloqué, lumbago, raideurs du travail assis : une prise en charge ostéopathique attentive à Villefontaine. Rendez-vous sur Doctolib.",
    h1: 'Lombalgie : retrouver un bas du dos plus libre',
    lead: "Le mal de dos a de nombreuses causes. La séance cherche à comprendre d'où vient la gêne, pas seulement là où elle se fait sentir.",
    cases: ["Vous passez la journée sur un écran et le bas du dos tire chaque soir.", "Un faux mouvement en portant un carton, et le dos s'est « bloqué ».", "Une raideur au réveil qui met du temps à passer."],
    when: ['Lombalgie, lumbago, dos « bloqué »', 'Raideurs au réveil', 'Douleurs liées au travail assis ou au port de charges', 'Reprise après une période sédentaire'],
    session: "Nous parlons de votre poste de travail, de votre sommeil et de votre activité. Rester actif dans la mesure du possible est souvent conseillé : vous repartez avec des conseils simples.",
    limits: commonLimits,
    medical: "Faiblesse dans une jambe, troubles urinaires ou intestinaux, fièvre, traumatisme important ou douleur inhabituelle : consultez rapidement un médecin.",
    faq: [
      { q: 'Faut-il attendre que la douleur passe pour consulter ?', a: "Non. Vous pouvez consulter pendant une crise : les techniques sont alors très douces et adaptées à votre douleur." },
      { q: 'Faut-il rester au repos ?', a: "Rester actif dans la mesure du possible est souvent conseillé. Nous en parlons selon votre situation." },
    ],
  },
  {
    slug: 'cervicalgie', label: 'Cervicalgie', zone: 'cervicales', tone: 'gold', photo: 'soin-nuque',
    short: 'Nuque raide, torticolis, maux de tête de tension après une journée d’écran.',
    // SEO : « ostéopathe cervicalgie Villefontaine » · torticolis · nuque raide · cervicales
    title: 'Ostéopathe cervicalgie et torticolis à Villefontaine',
    description: "Nuque raide, torticolis, cervicales tendues, maux de tête de tension : l'ostéopathie à Villefontaine pour retrouver de la mobilité dans le cou.",
    h1: 'Cervicalgie : relâcher la nuque et les épaules',
    lead: "Écran trop bas, nuit sur un mauvais oreiller, stress qui se loge dans les épaules : la nuque se raidit vite. Une séance aide à redonner de la mobilité au cou.",
    cases: ["Vous vous réveillez avec un torticolis, impossible de tourner la tête.", "Les épaules remontent vers les oreilles en fin de journée.", "Des maux de tête qui partent de la nuque quand vous êtes tendu."],
    when: ['Torticolis, nuque raide', 'Cervicales tendues après une journée d’écran', 'Maux de tête de tension, après avis médical', 'Gêne après un « coup du lapin », bilan médical fait'],
    session: "J'observe la mobilité du cou, des épaules et du haut du dos, qui fonctionnent ensemble. Les gestes au niveau de la nuque sont toujours expliqués et jamais systématiques.",
    limits: commonLimits,
    medical: "Maux de tête brutaux et inhabituels, vertiges importants, troubles de la vision ou de la parole : consultez un médecin en urgence.",
    faq: [
      { q: 'Les manipulations du cou sont-elles risquées ?', a: "Elles ne sont jamais systématiques : je les propose seulement si elles sont indiquées, après un bilan, et avec votre accord. Des techniques douces existent." },
      { q: 'Combien de temps après un torticolis consulter ?', a: "Dès les premiers jours si la gêne persiste." },
    ],
  },
  {
    slug: 'dorsalgie', label: 'Dorsalgie', zone: 'dorsales', tone: 'green', photo: 'adrian-echange',
    short: 'Douleur entre les omoplates, haut du dos tendu, respiration gênée.',
    // SEO : « ostéopathe dorsalgie Villefontaine » · haut du dos · entre les omoplates · thoracique
    title: 'Ostéopathe dorsalgie et haut du dos à Villefontaine',
    description: "Douleur entre les omoplates, haut du dos tendu, raideur thoracique : l'ostéopathie à Villefontaine pour soulager les tensions dorsales du quotidien.",
    h1: 'Dorsalgie : détendre le haut du dos',
    lead: "Entre les omoplates, la tension s'installe souvent sans prévenir : posture penchée, port de sac, stress. La séance s'intéresse aux vertèbres dorsales, aux côtes et aux épaules.",
    cases: ["Une barre entre les omoplates en fin de journée.", "Le haut du dos se raidit quand vous êtes stressé.", "Respirer profondément tire dans le dos."],
    when: ['Douleur entre les omoplates', 'Raideur du haut du dos', 'Gêne à la respiration profonde liée au dos', 'Tensions posturales (écran, sac, conduite)'],
    session: "J'évalue la mobilité des vertèbres dorsales, des côtes et des épaules. Les techniques sont choisies selon votre confort et expliquées avant d'être faites.",
    limits: commonLimits,
    medical: "Douleur dans la poitrine, essoufflement, douleur irradiant dans le bras ou la mâchoire : appelez le 15 sans attendre.",
    faq: [
      { q: 'Est-ce lié à ma posture ?', a: "Souvent en partie, mais pas toujours. L'échange permet de comprendre le contexte de votre gêne." },
      { q: 'Peut-on consulter si on a mal en respirant ?', a: "Seulement après avoir écarté une cause médicale : en cas de doute, voyez d'abord votre médecin." },
    ],
  },
  {
    slug: 'sciatique', label: 'Sciatique', zone: 'sacrum', tone: 'gold', photo: 'soin-bassin',
    short: 'Douleur qui descend dans la fesse et la jambe, gêne en position assise.',
    // SEO : « ostéopathe sciatique Villefontaine » · nerf sciatique · fesse · bassin · cruralgie
    title: 'Ostéopathe sciatique à Villefontaine',
    description: "Sciatique, douleur de fesse ou de jambe, gêne du bassin : une prise en charge ostéopathique à Villefontaine, en complément de l'avis médical si besoin.",
    h1: 'Sciatique : soulager le bassin et la jambe',
    lead: "Quand la douleur descend dans la fesse ou la jambe, le bas du dos et le bassin sont souvent concernés. La séance s'adapte à l'intensité de la douleur du moment.",
    cases: ["Une douleur part de la fesse et descend derrière la cuisse.", "Rester assis en voiture devient pénible.", "Pendant la grossesse, une douleur de fesse irradie dans la jambe."],
    when: ['Sciatique ou cruralgie, après avis médical si la douleur est forte', 'Douleur de fesse, de hanche ou de bassin', 'Gêne en position assise prolongée', 'Raideur du bas du dos associée'],
    session: "J'évalue le bas du dos, le bassin et les hanches. En période douloureuse, seules des techniques très douces sont utilisées.",
    limits: commonLimits,
    medical: "Faiblesse de la jambe, perte de sensibilité au niveau du périnée, troubles urinaires ou intestinaux : consultez en urgence.",
    faq: [
      { q: 'Faut-il une imagerie avant de consulter ?', a: "Pas forcément. Si vous en avez une, apportez-la. En cas de signe d'alerte, un avis médical passe en premier." },
      { q: 'Est-ce adapté pendant la grossesse ?', a: "Oui, avec des positions adaptées. Voir la page femmes enceintes." },
    ],
  },
  {
    slug: 'articulations', label: 'Articulations & tendons', zone: null, tone: 'green', photo: null,
    short: "Épaule, genou, cheville : gênes après une entorse, une tendinite, ou liées à l'arthrose.",
    // SEO : « ostéopathe tendinite Villefontaine » · entorse · épaule · genou · arthrose
    title: 'Ostéopathe épaule, genou, entorse à Villefontaine',
    description: "Épaule raide, genou capricieux, entorse ancienne, tendinite, arthrose : l'ostéopathie à Villefontaine pour retrouver de l'aisance dans les articulations.",
    h1: 'Articulations et tendons : retrouver de l’aisance',
    lead: "Une entorse mal récupérée, une épaule qui coince, un genou capricieux : les articulations travaillent ensemble. La séance regarde la zone douloureuse et ce qui l'entoure.",
    cases: ["Votre genou est « plutôt capricieux » depuis une vieille blessure.", "Lever le bras au-dessus de la tête coince l'épaule.", "Une entorse de cheville qui ne se fait jamais vraiment oublier."],
    when: ['Épaule raide ou douloureuse', 'Genou ou cheville après une entorse', 'Tendinite, une fois le bilan médical fait', "Raideurs liées à l'arthrose"],
    session: "J'évalue l'articulation concernée et ses voisines (une cheville influence le genou, la hanche…). Vous repartez avec des conseils adaptés à votre activité.",
    limits: commonLimits,
    medical: "Articulation gonflée, chaude et rouge, déformation, impossibilité de prendre appui après un choc : consultez un médecin ou les urgences.",
    faq: [
      { q: 'Combien de temps après une entorse consulter ?', a: "Une fois le bilan médical fait et la phase aiguë passée, souvent après quelques jours." },
      { q: "L'ostéopathie soigne-t-elle l'arthrose ?", a: "Non, elle ne la fait pas disparaître. Elle peut aider à garder de la mobilité et du confort au quotidien." },
    ],
  },
  {
    slug: 'stress-tensions', label: 'Stress & tensions', zone: null, tone: 'gold', photo: 'adrian-bureau',
    short: 'Tensions qui s’installent avec le stress, la fatigue, un sommeil agité.',
    // SEO : « ostéopathe stress Villefontaine » · tensions musculaires · sommeil · fatigue
    title: 'Ostéopathe stress et tensions à Villefontaine',
    description: "Tensions musculaires liées au stress, mâchoire serrée, sommeil agité, fatigue : une séance d'ostéopathie à Villefontaine pour relâcher le corps.",
    h1: 'Stress et tensions : relâcher ce que le corps retient',
    lead: "Le stress se loge souvent dans le corps : nuque, mâchoire, diaphragme, épaules. Une séance au rythme calme aide à relâcher ces tensions physiques.",
    cases: ["Vous serrez la mâchoire sans vous en rendre compte.", "Les épaules restent hautes même en vacances.", "Le sommeil est agité, et le réveil courbaturé."],
    when: ['Tensions musculaires liées au stress', 'Mâchoire serrée, nuque tendue', 'Sommeil agité, fatigue physique', 'Respiration courte, diaphragme crispé'],
    session: "La séance se déroule dans un cadre calme, avec des techniques douces. Nous parlons aussi de ce qui, au quotidien, peut vous aider à relâcher.",
    limits: "L'ostéopathie agit sur les tensions physiques ; elle ne traite pas l'anxiété ni la dépression, qui relèvent d'un médecin ou d'un psychologue. " + commonLimits,
    medical: "Idées noires, détresse importante, troubles du sommeil sévères : parlez-en à votre médecin. En urgence, appelez le 3114 (prévention du suicide).",
    faq: [
      { q: "L'ostéopathie remplace-t-elle un suivi psychologique ?", a: "Non. Elle agit sur les tensions physiques et peut compléter un suivi adapté." },
      { q: 'Combien de temps dure l’effet ?', a: "C'est variable selon chacun. Nous en reparlons après la première séance." },
    ],
  },
  {
    slug: 'troubles-digestifs', label: 'Troubles digestifs', zone: null, tone: 'green', photo: null,
    short: 'Inconforts digestifs fonctionnels, ballonnements, ventre tendu.',
    // SEO : « ostéopathe digestion Villefontaine » · ballonnements · ventre tendu · troubles fonctionnels
    title: 'Ostéopathe et troubles digestifs à Villefontaine',
    description: "Inconforts digestifs fonctionnels, ballonnements, ventre tendu : une approche ostéopathique douce à Villefontaine, en complément du suivi médical.",
    h1: 'Troubles digestifs : une approche douce du ventre',
    lead: "Certaines gênes digestives liées au stress ou aux tensions du dos et du diaphragme peuvent être abordées en ostéopathie, toujours après un avis médical.",
    cases: ["Le ventre se tend dès que la pression monte.", "Des ballonnements qui reviennent, examens normaux.", "Une gêne digestive associée à des tensions du dos."],
    when: ['Inconforts digestifs fonctionnels, bilan médical fait', 'Ventre tendu lié au stress', 'Tensions du diaphragme et du dos associées', 'Gêne après une chirurgie abdominale ancienne, avec accord médical'],
    session: "Les techniques viscérales sont douces et toujours expliquées. Elles s'accompagnent d'un travail sur le dos et le diaphragme.",
    limits: "Les troubles digestifs ont de nombreuses causes : un avis médical est indispensable avant toute séance. " + commonLimits,
    medical: "Sang dans les selles, perte de poids inexpliquée, vomissements, fièvre ou douleur abdominale intense : consultez un médecin rapidement.",
    faq: [
      { q: 'Faut-il voir un médecin avant ?', a: "Oui, pour écarter une cause médicale. L'ostéopathie intervient en complément." },
      { q: 'Les techniques sur le ventre sont-elles douloureuses ?', a: "Non, elles sont douces, et vous pouvez les interrompre à tout moment." },
    ],
  },
];

export const categories = [...patients.map((c) => ({ ...c, family: 'patients' })), ...troubles.map((c) => ({ ...c, family: 'troubles' }))];

/* Zones de l'ancienne section « colonne 3D » → troubles associés.
   Plus affichées depuis que le visualiseur anatomique la remplace ; textes conservés pour réemploi. */
export const spineZones = [
  { id: 'cervicales', label: 'Cervicales', range: 'C1 – C7', troubles: ['cervicalgie'], extra: ['Torticolis', 'Maux de tête de tension'], text: "Les 7 vertèbres du cou portent la tête et permettent de la tourner. Tensions d'écran, torticolis, nuque raide." },
  { id: 'dorsales', label: 'Dorsales', range: 'T1 – T12', troubles: ['dorsalgie'], extra: ['Douleur entre les omoplates', 'Raideur thoracique'], text: "Les 12 vertèbres dorsales s'articulent avec les côtes. Barre entre les omoplates, haut du dos tendu." },
  { id: 'lombaires', label: 'Lombaires', range: 'L1 – L5', troubles: ['lombalgie'], extra: ['Lumbago', 'Dos bloqué'], text: "Les 5 vertèbres lombaires, les plus massives, portent le poids du haut du corps. Lombalgie, dos bloqué, raideur du matin." },
  { id: 'sacrum', label: 'Sacrum & bassin', range: 'S1 – coccyx', troubles: ['sciatique'], extra: ['Douleur de fesse', 'Bassin pendant la grossesse'], text: "Le sacrum relie la colonne au bassin. Sciatique, douleur de fesse ou de hanche, bassin pendant la grossesse." },
];
