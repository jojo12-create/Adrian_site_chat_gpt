/* Correspondance motif → structures du modèle (groupes anatomiques de model.bin), couches et angle de vue.
   Os : 2 cervicales · 3 dorsales · 4 L1-L3 · 5 L4-L5 · 6 sacrum et coccyx · 7 os iliaques · 8 côtes et sternum · 9 omoplates · 11 fémur gauche
   Muscles : 21 trapèzes · 22 muscles de la nuque · 25 rhomboïdes · 29 masséters et temporaux
   Nerfs : 33 plexus cervical et brachial · 34 nerfs intercostaux · 35 plexus lombaire · 36 nerf sciatique gauche et ses branches
   Viscères : 24 diaphragme · 41 estomac · 42 intestin grêle · 43 côlon
   Associations illustratives, à faire valider par le praticien. */
const BACK = Math.PI + 0.42, FRONT = 0.42;
const ALLJ = ['epaule', 'hanche', 'genou', 'cheville', 'poignet'];
/* Groupes ajoutés pour les parcours — ligaments : 13 épaule · 14 hanche · 15 genou · 16 cheville · 17 poignet
   tendons et muscles : 51 coiffe des rotateurs · 52 tendon calcanéen et triceps sural · 53 quadriceps · 54 fibulaires · 55 biceps brachial
   56 psoas-iliaque · 57 fléchisseurs et extenseurs du poignet · 58 tibiaux · 60 trapèze supérieur */
export const ZONES3D = {
  cervicalgie: { layers: ['sk', 'ne'], g: { 2: 1, 33: 1 }, focus: [2], az: BACK },
  dorsalgie: { layers: ['sk', 'ne'], g: { 3: 1, 8: 0.22, 9: 0.3, 34: 1 }, focus: [3], az: BACK },
  lombalgie: { layers: ['sk', 'ne'], g: { 4: 1, 5: 1, 35: 0.9 }, focus: [4, 5], az: BACK },
  sciatique: { layers: ['sk', 'ne'], g: { 5: 1, 6: 1, 7: 0.6, 36: 1 }, focus: [5, 6, 7, 11], az: BACK },
  articulations: { steps: [
    { label: 'Épaule', detail: 'Coiffe des rotateurs, ligaments gléno-huméraux et coraco-huméral, bourrelet glénoïdien, biceps.', layers: ['sk', 'mu'], joints: ['epaule'], cam: 'epaule_left', g: { 13: 1, 51: 1, 55: 0.8 }, az: 0.75 },
    { label: 'Genou', detail: 'Ligaments croisés et collatéraux, ménisques, tendon du quadriceps.', layers: ['sk', 'mu'], joints: ['genou'], cam: 'genou_left', g: { 15: 1, 53: 0.9 }, az: 0.6 },
    { label: 'Cheville', detail: 'Ligaments talo-fibulaires et tibio-fibulaires, tendon calcanéen (d’Achille), tendons fibulaires et tibiaux.', layers: ['sk', 'mu'], joints: ['cheville'], cam: 'cheville_left', g: { 16: 1, 52: 1, 54: 0.9, 58: 0.8 }, az: 2.3 },
    { label: 'Hanche', detail: 'Ligaments ilio-fémoral, pubo-fémoral et ischio-fémoral, bourrelet acétabulaire, psoas-iliaque.', layers: ['sk', 'mu'], joints: ['hanche'], cam: 'hanche_left', g: { 14: 1, 56: 0.8 }, az: 0.6 },
    { label: 'Poignet', detail: 'Ligaments du carpe, tendons fléchisseurs et extenseurs.', layers: ['sk', 'mu'], joints: ['poignet'], cam: 'poignet_left', g: { 17: 1, 57: 0.9 }, az: 0.95 },
    { label: 'Vue d’ensemble', detail: 'Les articulations travaillent ensemble : épaules, hanches, genoux, chevilles et poignets.', layers: ['sk', 'mu'], joints: ALLJ, g: { 13: 1, 14: 1, 15: 1, 16: 1, 17: 1, 51: 0.7, 52: 0.7, 53: 0.5, 54: 0.6, 55: 0.5, 56: 0.5, 57: 0.5, 58: 0.5 }, az: FRONT },
  ] },
  'stress-tensions': { steps: [
    { label: 'Nuque et épaules', detail: 'Trapèzes supérieurs, sterno-cléido-mastoïdiens, muscles sous-occipitaux, élévateurs de la scapula.', layers: ['mu'], g: { 60: 1, 22: 1, 21: 0.3 }, focus: [60, 22], az: BACK },
    { label: 'Mâchoire', detail: 'Masséters et muscles temporaux.', layers: ['mu'], g: { 29: 1 }, focus: [29], az: 1.2 },
    { label: 'Diaphragme', detail: 'Le muscle de la respiration, sous les poumons.', layers: ['sk', 'vi'], g: { 24: 1 }, focus: [24], az: FRONT },
    { label: 'Vue d’ensemble', detail: 'Nuque, épaules, mâchoire et diaphragme.', layers: ['mu', 'vi'], g: { 60: 1, 22: 1, 29: 1, 24: 1 }, focus: [60, 22, 29, 24], az: 0.9 },
  ] },
  'troubles-digestifs': { layers: ['sk', 'vi'], g: { 41: 1, 42: 1, 43: 1, 24: 0.6 }, focus: [41, 42, 43], az: FRONT },
};
