// ─── CABINET ──────────────────────────────────────────────────────────────────

export const CABINET = {
  nom:       'Cabinet Poncey Lebas',
  telephone: '02 31 92 81 31',
  orias:     '07022305 - 12066667',
  contact:   'Amélie BLANCO',
  email:     'assuraudio@gmail.com',
  adresse:   'Bayeux (14)',
};

// ─── SUIVI ENVOIS ──────────────────────────────────────────────────────────────
// Collection Firestore : envois_audio
// Chaque document = 1 envoi (1 prospect × 1 campagne)

export const ENVOI_STATUTS = {
  envoye:   { label: 'Envoyé',       color: '#60a5fa', bg: 'rgba(96,165,250,0.15)',   icon: '✉️'  },
  relance1: { label: 'Relance 1',    color: '#fbbf24', bg: 'rgba(251,191,36,0.15)',   icon: '🔔'  },
  relance2: { label: 'Relance 2',    color: '#fb923c', bg: 'rgba(251,146,60,0.15)',   icon: '⚠️'  },
  repondu:  { label: 'Répondu',      color: '#34d399', bg: 'rgba(52,211,153,0.15)',   icon: '✅'  },
  termine:  { label: 'Terminé',      color: '#6b7494', bg: 'rgba(107,116,148,0.15)',  icon: '🗄️'  },
};

// Délais de relance (en jours)
export const DELAI_RELANCE_1 = 7;
export const DELAI_RELANCE_2 = 14; // jours depuis relance 1

const SIG = `\n\nCordialement,\n\n${CABINET.contact}\n${CABINET.nom}\nTél : ${CABINET.telephone}\nN° Orias : ${CABINET.orias}`;

// ─── TYPES DE CAMPAGNE ─────────────────────────────────────────────────────────

export const CAMPAGNE_TYPES = {
  echeance:       { label: 'Rappel d\'échéance',         icon: '📅', color: '#f87171',  desc: 'Renouvellement de contrat imminent' },
  rc_pro:         { label: 'RC Professionnelle',          icon: '🛡️', color: '#a78bfa',  desc: 'Responsabilité civile pro audioprothésiste' },
  prevoyance:     { label: 'Prévoyance Dirigeant',        icon: '💼', color: '#60a5fa',  desc: 'Invalidité, incapacité, décès' },
  sante_100:      { label: '100% Santé Auditif',          icon: '💚', color: '#34d399',  desc: 'Réforme remboursement appareils auditifs' },
  nouveau_cabinet:{ label: 'Nouveau Cabinet',             icon: '🏥', color: '#fbbf24',  desc: 'Ouverture ou reprise d\'un cabinet' },
  cyber:          { label: 'Cyber-risques & RGPD',        icon: '🔐', color: '#f472b6',  desc: 'Protection données patients' },
  multirisques:   { label: 'Multirisques Pro',            icon: '🏢', color: '#fb923c',  desc: 'Local, matériel, pertes exploitation' },
  info_reglementaire: { label: 'Actualité Réglementaire', icon: '📋', color: '#9ca3c0',  desc: 'Évolutions législatives du secteur' },
  bilan_annuel:   { label: 'Bilan Annuel',                icon: '📊', color: '#a78bfa',  desc: 'Revue complète des garanties' },
  prospection:    { label: 'Prospection',                 icon: '🎯', color: '#ff6b35',  desc: 'Premier contact, prise de RDV' },
};

// ─── STATUTS ───────────────────────────────────────────────────────────────────

export const CAMPAGNE_STATUTS = {
  brouillon:  { label: 'Brouillon',   color: '#9ca3c0', bg: 'rgba(156,163,192,0.15)' },
  planifiee:  { label: 'Planifiée',   color: '#60a5fa', bg: 'rgba(96,165,250,0.15)'  },
  active:     { label: 'Active',      color: '#34d399', bg: 'rgba(52,211,153,0.15)'  },
  terminee:   { label: 'Terminée',    color: '#6b7494', bg: 'rgba(107,116,148,0.15)' },
  annulee:    { label: 'Annulée',     color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
};

export const CAMPAGNE_RECURRENCES = {
  unique:         'Envoi unique',
  mensuelle:      'Mensuelle',
  trimestrielle:  'Trimestrielle',
  semestrielle:   'Semestrielle',
  annuelle:       'Annuelle',
};

// ─── CATÉGORIES DE PROSPECTS ───────────────────────────────────────────────────

export const PROSPECT_STATUTS = {
  prospect:   { label: 'Prospect',      color: '#fbbf24', bg: 'rgba(251,191,36,0.15)'  },
  contact:    { label: 'Contacté',      color: '#60a5fa', bg: 'rgba(96,165,250,0.15)'  },
  rdv_pris:   { label: 'RDV pris',      color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  client:     { label: 'Client',        color: '#34d399', bg: 'rgba(52,211,153,0.15)'  },
  perdu:      { label: 'Perdu',         color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
};

export const STRUCTURE_TYPES = {
  independant:   'Indépendant',
  centre:        'Centre audio (groupe)',
  clinique:      'Clinique / Hôpital',
  orl:           'Cabinet ORL',
  autre:         'Autre',
};

// ─── TEMPLATES EMAILS ─────────────────────────────────────────────────────────

export const TEMPLATES = {

  // ── ÉCHÉANCE ──
  echeance: {
    label: 'Rappel d\'échéance contrat',
    sujet: 'Votre contrat d\'assurance arrive à échéance — Prenons rendez-vous',
    contenu: `Madame, Monsieur,

Votre contrat d'assurance professionnelle arrive prochainement à échéance.

À cette occasion, nous souhaiterions vous proposer un entretien de 30 minutes afin de :

  • Faire le point sur vos garanties actuelles
  • Vérifier l'adéquation de votre couverture avec l'évolution de votre activité
  • Vous présenter les nouvelles offres disponibles sur le marché
  • Optimiser votre budget assurance

En tant que spécialiste de l'assurance pour les professions de santé audiologiques, nous connaissons les spécificités de votre métier et les risques propres à votre secteur.

Pouvez-vous me proposer quelques créneaux dans les prochaines semaines ?${SIG}`,
  },

  // ── RC PRO ──
  rc_pro: {
    label: 'RC Professionnelle audioprothésiste',
    sujet: 'Votre RC Professionnelle : êtes-vous bien couvert(e) en tant qu\'audioprothésiste ?',
    contenu: `Madame, Monsieur,

La Responsabilité Civile Professionnelle est l'assurance fondamentale de tout audioprothésiste. Elle vous protège face aux réclamations de patients en cas de :

  🎧 Appareillage inadapté entraînant une aggravation de la perte auditive
  🔧 Erreur de réglage ou défaut de conseil
  📋 Manquement à l'obligation d'information du patient
  ⚕️ Tout acte réalisé dans le cadre de votre activité paramédicale

Depuis la réforme 100% Santé (2021), les audioprothésistes font face à une hausse des contentieux liés aux déceptions de patients sur les appareils de classe I.

Notre offre RC Pro dédiée aux audioprothésistes vous garantit :
  ✅ Couverture des actes de bilan, appareillage et suivi
  ✅ Garantie rétroactive sur votre historique
  ✅ Défense pénale incluse
  ✅ Tarifs adaptés à votre chiffre d'affaires

Souhaitez-vous recevoir un devis personnalisé sans engagement ?${SIG}`,
  },

  // ── PRÉVOYANCE ──
  prevoyance: {
    label: 'Prévoyance Dirigeant',
    sujet: 'Et si vous étiez dans l\'impossibilité d\'exercer demain ? — Votre prévoyance',
    contenu: `Madame, Monsieur,

En tant qu'audioprothésiste indépendant(e), votre revenu repose entièrement sur votre capacité à exercer. Une incapacité de travail, même temporaire, peut avoir des conséquences financières lourdes.

Savez-vous ce que vous percevriez en cas d'arrêt de travail prolongé ?

Les indemnités journalières de la Sécurité Sociale pour les travailleurs indépendants sont souvent insuffisantes pour maintenir votre niveau de vie et couvrir vos charges fixes (loyer du cabinet, salaires, emprunts…).

Une bonne prévoyance vous permet de :

  💰 Maintenir vos revenus en cas d'incapacité temporaire
  🏥 Percevoir un capital en cas d'invalidité permanente
  👨‍👩‍👧 Protéger vos proches en cas de décès
  🏢 Assurer la pérennité de votre cabinet

Nous proposons des solutions sur-mesure pour les audioprothésistes libéraux et les gérants de centres audio.

Contactez-nous pour un audit gratuit de votre protection sociale.${SIG}`,
  },

  // ── 100% SANTÉ ──
  sante_100: {
    label: 'Réforme 100% Santé — Impact cabinet',
    sujet: '100% Santé Auditif : avez-vous adapté votre assurance ?',
    contenu: `Madame, Monsieur,

La réforme 100% Santé a profondément transformé le paysage audiologique depuis 2021 :

  📊 Panier libre (classe II) : liberté tarifaire maintenue
  🆓 Panier 100% Santé (classe I) : remboursement intégral Sécu + complémentaire
  📈 Résultat : explosion des volumes, nouvelles typologies de patients

Ces évolutions ont un impact direct sur vos risques assurantiels :

1. HAUSSE DU RISQUE RC PRO
   Les patients bénéficiant d'appareils de classe I ont parfois des attentes supérieures au niveau de qualité proposé, générant davantage de réclamations.

2. AUGMENTATION DU PARC MATÉRIEL
   Plus de patients = plus d'appareils prêtés/vendus = besoin d'une couverture matériel renforcée.

3. VOLUME DE DONNÉES PATIENTS EN HAUSSE
   Plus de dossiers = risque RGPD accru en cas de violation de données.

Avez-vous revu vos garanties depuis la mise en œuvre de la réforme ?

Nous vous proposons un audit gratuit de votre couverture actuelle.${SIG}`,
  },

  // ── NOUVEAU CABINET ──
  nouveau_cabinet: {
    label: 'Ouverture / Reprise de cabinet',
    sujet: 'Vous ouvrez (ou reprenez) un cabinet audio ? Voici ce qu\'il faut assurer',
    contenu: `Madame, Monsieur,

Félicitations pour ce nouveau projet professionnel !

L'ouverture ou la reprise d'un cabinet d'audioprothèse est une étape importante qui nécessite de bien sécuriser votre activité dès le premier jour.

Voici les assurances indispensables au lancement :

  🛡️ RC Professionnelle — obligatoire, protège vos actes dès le jour 1
  🏢 Multirisques Pro — local, matériel audiologique, vitrine, stocks
  💼 Prévoyance Dirigeant — protégez votre revenu si vous êtes arrêté(e)
  🔐 Cyber-risques — dossiers patients, logiciel de gestion, RGPD
  ⚖️ Protection Juridique — litiges fournisseurs, bailleur, patients

Notre accompagnement pour les nouveaux cabinets :
  ✅ Audit des risques spécifiques à votre situation
  ✅ Mise en place de toutes les garanties en moins de 48h
  ✅ Tarifs dégressifs la 1ère année

Prenons 30 minutes pour faire le point ensemble.${SIG}`,
  },

  // ── CYBER & RGPD ──
  cyber: {
    label: 'Cyber-risques & RGPD patients',
    sujet: 'Données patients : votre cabinet est-il protégé contre les cyber-risques ?',
    contenu: `Madame, Monsieur,

Les cabinets d'audioprothèse traitent quotidiennement des données de santé sensibles : audiogrammes, dossiers médicaux, informations personnelles. Ces données font l'objet de convoitises croissantes.

Les risques cyber pour votre cabinet :

  💻 Ransomware — vos données chiffrées, votre activité bloquée
  🔓 Vol de données patients — obligation de notification CNIL
  📧 Phishing — usurpation d'identité, fraude bancaire
  🖥️ Panne système — perte de vos dossiers, interruption d'activité

RGPD : vos obligations en tant que professionnel de santé
  • Registre des traitements à jour
  • Consentement patient documenté
  • Notification en cas de violation dans les 72h
  • Amendes CNIL jusqu'à 4% du CA mondial

Notre assurance Cyber dédiée aux professions de santé :
  ✅ Prise en charge des frais de notification et communication de crise
  ✅ Restauration des systèmes et données
  ✅ Perte d'exploitation pendant la coupure
  ✅ Responsabilité civile cyber vis-à-vis des patients

Demandez votre devis en ligne en 5 minutes.${SIG}`,
  },

  // ── MULTIRISQUES ──
  multirisques: {
    label: 'Multirisques Professionnelle',
    sujet: 'Votre cabinet audio : local, matériel et exploitation — tout est couvert ?',
    contenu: `Madame, Monsieur,

Un sinistre dans votre cabinet d'audioprothèse peut survenir à tout moment : dégâts des eaux, incendie, vol d'appareils auditifs, bris de matériel audiologique…

Ce que couvre notre Multirisques Pro pour audioprothésistes :

  🏢 Locaux professionnels — reconstruction, aménagements
  🎧 Matériel audiologique — audiomètres, cabines insonorisées, stocks d'appareils
  💻 Informatique et logiciels métier — PC, serveurs, logiciels de gestion
  📦 Stocks d'appareils auditifs et accessoires
  📉 Perte d'exploitation — maintien de votre chiffre d'affaires après sinistre
  🪟 Bris de glace — vitrine, cabine d'essai
  🚗 Vol dans véhicule — matériels en déplacement pour domicile patients

Points forts de notre offre :
  ✅ Expertise spécialisée professions de santé
  ✅ Remplacement rapide du matériel en 24-48h
  ✅ Garantie valeur à neuf sur le matériel audiologique

Comparons votre contrat actuel. Vous êtes peut-être sur-assuré(e) ou sous-protégé(e).${SIG}`,
  },

  // ── ACTU RÉGLEMENTAIRE ──
  info_reglementaire: {
    label: 'Actualité réglementaire du secteur',
    sujet: 'Actualité réglementaire audioprothèse — Ce qui change pour vous',
    contenu: `Madame, Monsieur,

Le secteur de l'audioprothèse est en constante évolution réglementaire. Voici les points clés à retenir pour votre activité :

[POINT 1 — À PERSONNALISER]
Décrivez ici la première actualité réglementaire impactant le secteur.

[POINT 2 — À PERSONNALISER]
Décrivez ici la deuxième actualité réglementaire ou normative.

[IMPACT SUR VOS ASSURANCES]
Ces évolutions peuvent impacter vos garanties et obligations assurantielles. Nous vous recommandons de faire le point sur votre couverture.

Notre cabinet est spécialisé dans les professions de santé et suit activement les évolutions du secteur audiologique. Nous sommes à votre disposition pour analyser l'impact sur votre situation personnelle.

N'hésitez pas à nous contacter pour un entretien gratuit.${SIG}`,
  },

  // ── BILAN ANNUEL ──
  bilan_annuel: {
    label: 'Bilan annuel de vos garanties',
    sujet: 'Bilan annuel : faisons le point sur vos assurances professionnelles',
    contenu: `Madame, Monsieur,

Chaque année, votre activité évolue : nouveau matériel, changement de local, évolution du chiffre d'affaires, embauche… Votre protection assurantielle doit évoluer en conséquence.

Notre bilan annuel gratuit comprend :

  📋 Revue de toutes vos garanties en cours
  🔍 Identification des éventuels doublons ou lacunes de couverture
  💰 Analyse de l'adéquation garanties / primes payées
  📊 Comparatif marché sur vos contrats principaux
  🗓️ Planification des renouvellements à venir

En moyenne, nos clients audioprothésistes économisent entre 15% et 30% sur leur budget assurance après bilan, tout en améliorant leur niveau de protection.

Ce bilan est offert, sans engagement de votre part. Il dure environ 45 minutes (en cabinet ou en visioconférence).

Répondez simplement à cet email pour convenir d'un créneau.${SIG}`,
  },

  // ── PROSPECTION ──
  prospection: {
    label: 'Premier contact / Prospection',
    sujet: 'Cabinet Poncey Lebas — Spécialiste assurance audioprothésistes en Normandie',
    contenu: `Madame, Monsieur,

Je me permets de vous contacter car notre cabinet est spécialisé dans l'accompagnement des audioprothésistes en matière d'assurance professionnelle.

Nous travaillons avec de nombreux professionnels de l'audioprothèse en Normandie et connaissons parfaitement les spécificités de votre secteur :

  🎧 Enjeux de la réforme 100% Santé sur la RC Pro
  🏥 Couvertures adaptées aux différents modes d'exercice (libéral, salarié, gérant de centre)
  🔐 Protection des données de santé (RGPD, cyber-risques)
  💼 Prévoyance adaptée aux professions libérales de santé

Notre approche :
  1️⃣ Un audit gratuit de votre situation actuelle (30 min)
  2️⃣ Des recommandations personnalisées et sans engagement
  3️⃣ Un accompagnement sur-mesure tout au long de l'année

Seriez-vous disponible pour un échange téléphonique de 20 minutes dans les prochains jours ?

Dans l'attente de votre retour.${SIG}`,
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function fmtDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function fmtDateLong(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function daysSince(ts) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d - today) / 86400000);
}

export function genId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ─── MOIS / SAISONS ───────────────────────────────────────────────────────────

export const MOIS_LABELS = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
  'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc',
];

export const SAISONS_RECOMMANDEES = [
  { mois: [1, 2],   label: 'Bilan annuel + Prévoyance', type: 'bilan_annuel' },
  { mois: [3, 4],   label: 'RC Pro + Cyber',            type: 'rc_pro'       },
  { mois: [6],      label: 'Prospection estivale',      type: 'prospection'  },
  { mois: [9, 10],  label: 'Rappels échéances Q4',      type: 'echeance'     },
  { mois: [11, 12], label: 'Renouvellements fin d\'an', type: 'echeance'     },
];
