export const TYPES = {
  rdv:   { label: 'RDV',   icon: '📅', color: '#a78bfa' },
  tache: { label: 'Tâche', icon: '✅', color: '#60a5fa' },
  suivi: { label: 'Suivi', icon: '🔄', color: '#34d399' },
};

export const PRIORITIES = {
  urgent: { label: 'Urgent', color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
  haute:  { label: 'Haute',  color: '#fb923c', bg: 'rgba(251,146,60,0.15)' },
  normal: { label: 'Normal', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
};

export const STATUSES = {
  a_faire:      { label: 'À faire',      color: '#9ca3c0', bg: 'rgba(156,163,192,0.15)' },
  en_cours:     { label: 'En cours',     color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  suivi_requis: { label: 'Suivi requis', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' },
  termine:      { label: 'Terminé',      color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
};

export const CONTRACT_TYPES = [
  'Multi-risques', 'RC Professionnelle', 'Prévoyance Dirigeant',
  'Homme-Clé', 'RC Dirigeants', 'Pertes d\'Exploitation', 'Autre',
];

export const USERS = ['Johann', 'E.Poncey', 'Ombeline', 'Julie', 'Priscillia', 'Amélie', 'Justine', 'Wiam', 'Wendy'];

// ─── SINISTRES STANDARD ────────────────────────────────────────────────────────

export const SINISTRE_TYPES = {
  incendie:            { label: 'Incendie',              icon: '🔥', color: '#f87171' },
  vol:                 { label: 'Vol / Cambriolage',      icon: '🔓', color: '#fb923c' },
  degats_eaux:         { label: 'Dégâts des eaux',        icon: '💧', color: '#60a5fa' },
  bris_glace:          { label: 'Bris de glace',          icon: '🪟', color: '#a78bfa' },
  rc_corporel:         { label: 'RC Corporelle',          icon: '🚑', color: '#f472b6' },
  rc_materiel:         { label: 'RC Matérielle',          icon: '🔧', color: '#fbbf24' },
  accident:            { label: 'Accident',               icon: '💥', color: '#fb923c' },
  catastrophe_nat:     { label: 'Catastrophe naturelle',  icon: '🌪️', color: '#34d399' },
  perte_exploitation:  { label: 'Perte d\'exploitation',  icon: '📉', color: '#f87171' },
  autre:               { label: 'Autre',                  icon: '📋', color: '#9ca3c0' },
};

// ─── SINISTRES CHASSE ──────────────────────────────────────────────────────────

export const SINISTRE_CHASSE_TYPES = {
  accident_corporel:   { label: 'Accident corporel',         icon: '🚑', color: '#f87171' },
  rc_tiers_corporel:   { label: 'RC Tiers — Corporel',       icon: '👤', color: '#f472b6' },
  rc_tiers_materiel:   { label: 'RC Tiers — Matériel',       icon: '🔧', color: '#fbbf24' },
  degats_cultures:     { label: 'Dégâts aux cultures',        icon: '🌾', color: '#34d399' },
  degats_gibier:       { label: 'Dégâts de gibier',           icon: '🦌', color: '#60a5fa' },
  tir_involontaire:    { label: 'Tir involontaire',           icon: '🎯', color: '#f87171' },
  morsure_chien:       { label: 'Morsure / Chien de chasse',  icon: '🐕', color: '#fb923c' },
  accident_vehicule:   { label: 'Accident véhicule (chasse)', icon: '🚗', color: '#a78bfa' },
  autre:               { label: 'Autre',                      icon: '📋', color: '#9ca3c0' },
};

export const SINISTRE_STATUSES = {
  declare:        { label: 'Déclaré',            color: '#9ca3c0', bg: 'rgba(156,163,192,0.15)', icon: '📨' },
  en_instruction: { label: 'En instruction',     color: '#60a5fa', bg: 'rgba(96,165,250,0.15)',  icon: '🔍' },
  attente_pieces: { label: 'Attente pièces',     color: '#fbbf24', bg: 'rgba(251,191,36,0.15)',  icon: '📎' },
  expertise:      { label: 'Expertise en cours', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', icon: '🔬' },
  indemnise:      { label: 'Indemnisé',          color: '#34d399', bg: 'rgba(52,211,153,0.15)',  icon: '✅' },
  cloture:        { label: 'Clôturé',            color: '#6b7494', bg: 'rgba(107,116,148,0.15)', icon: '🗄️' },
  refuse:         { label: 'Refusé',             color: '#f87171', bg: 'rgba(248,113,113,0.15)', icon: '❌' },
};

export const SINISTRE_ETAPES = [
  { key: 'declare',        label: 'Déclaré' },
  { key: 'en_instruction', label: 'Instruction' },
  { key: 'attente_pieces', label: 'Pièces' },
  { key: 'expertise',      label: 'Expertise' },
  { key: 'indemnise',      label: 'Indemnisé' },
];

export const PIECES_DEFAUT = {
  incendie:           ['Déclaration de sinistre', 'Rapport des pompiers', 'Photos des dégâts', 'Inventaire des biens détruits', 'Devis de réparation'],
  vol:                ['Déclaration de sinistre', 'Dépôt de plainte (police)', 'Inventaire des biens volés', 'Photos', 'Factures / preuves d\'achat'],
  degats_eaux:        ['Déclaration de sinistre', 'Constat amiable', 'Photos des dégâts', 'Devis de réparation', 'Rapport de plomberie'],
  bris_glace:         ['Déclaration de sinistre', 'Photos', 'Devis de remplacement'],
  rc_corporel:        ['Déclaration de sinistre', 'Rapport de police / gendarmerie', 'Certificats médicaux', 'Témoignages', 'PV d\'accident'],
  rc_materiel:        ['Déclaration de sinistre', 'Constat amiable', 'Photos des dégâts', 'Devis de réparation', 'PV d\'accident'],
  accident:           ['Déclaration de sinistre', 'Constat amiable', 'Photos', 'Rapport de police', 'Devis de réparation'],
  catastrophe_nat:    ['Déclaration de sinistre', 'Arrêté de catastrophe naturelle', 'Photos des dégâts', 'Inventaire des biens', 'Devis de réparation'],
  perte_exploitation: ['Déclaration de sinistre', 'Bilans comptables', 'Justificatifs de perte', 'Rapport d\'expertise'],
  autre:              ['Déclaration de sinistre', 'Photos / preuves', 'Devis ou justificatifs'],
  // chasse
  accident_corporel:  ['Déclaration de sinistre', 'Certificats médicaux', 'PV de gendarmerie', 'Liste des participants', 'Attestation permis de chasser'],
  rc_tiers_corporel:  ['Déclaration de sinistre', 'PV de gendarmerie', 'Certificats médicaux victime', 'Coordonnées du tiers', 'Attestation permis de chasser'],
  rc_tiers_materiel:  ['Déclaration de sinistre', 'Constat amiable', 'Photos des dégâts', 'Devis de réparation', 'Coordonnées du tiers'],
  degats_cultures:    ['Déclaration de sinistre', 'Constat dégâts (huissier ou mairie)', 'Photos', 'Estimation agriculteur', 'Bail de chasse'],
  degats_gibier:      ['Déclaration de sinistre', 'Constat dégâts', 'Photos', 'Estimation chiffrée', 'Bail de chasse'],
  tir_involontaire:   ['Déclaration de sinistre', 'PV de gendarmerie', 'Photos', 'Attestation permis de chasser', 'Liste des participants'],
  morsure_chien:      ['Déclaration de sinistre', 'Certificat médical victime', 'Certificat vétérinaire chien', 'PV de gendarmerie', 'Coordonnées du tiers'],
  accident_vehicule:  ['Déclaration de sinistre', 'Constat amiable', 'PV de police / gendarmerie', 'Photos', 'Permis de conduire'],
};

export const INACTIVITE_ALERTE_JOURS = 15;
export const RELANCE_DELAIS = [15, 30];

// ─── HELPERS RELANCE ───────────────────────────────────────────────────────────

export function daysSince(ts) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

export function joursDepuisRelance(sinistre, type) {
  const ts = type === 'client'
    ? sinistre.derniereRelanceClient
    : sinistre.derniereRelanceCompagnie;
  return daysSince(ts || sinistre.dateDeclaration || sinistre.createdAt);
}

export function relanceUrgence(jours) {
  if (jours === null) return null;
  if (jours >= 30) return { level: 'critique', color: '#f87171', label: `${jours}j — Relance urgente` };
  if (jours >= 15) return { level: 'alerte',   color: '#fbbf24', label: `${jours}j — À relancer` };
  return { level: 'ok', color: '#34d399', label: `${jours}j` };
}

// ─── TEMPLATES MAILS ───────────────────────────────────────────────────────────

export function getEmailTemplate(type, sinistre, piecesMisquantes = [], mode = 'standard') {
  const client    = sinistre.clientName || 'Madame, Monsieur';
  const num       = sinistre.numero ? ` n° ${sinistre.numero}` : '';
  const numAgence = sinistre.numero || '[ à compléter ]';
  const compagnie = sinistre.compagnie || 'votre compagnie d\'assurance';
  const typeSin   = (SINISTRE_TYPES[sinistre.type] || SINISTRE_CHASSE_TYPES[sinistre.type] || {}).label || 'sinistre';
  const dateDec   = fmtDate(sinistre.dateDeclaration) || 'récente';
  const montant   = sinistre.montantIndemnise
    ? Number(sinistre.montantIndemnise).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €'
    : '[ montant à compléter ]';
  const toutesLesPieces = (sinistre.pieces || []).map(p => `  • ${p.label}`).join('\n')
    || '  • (liste des pièces à compléter)';
  const listePieces = piecesMisquantes.length
    ? piecesMisquantes.map(p => `  • ${p}`).join('\n')
    : '  • (aucune pièce manquante identifiée)';

  const sigStandard = `\n\nCordialement,\n\nAmélie BLANCO\nCABINET PONCEY LEBAS\nTél : 02 31 92 81 31\nN° Orias : 07022305 - 12066667`;
  const sigChasse   = `\n\nCordialement,\n\nAmélie BLANCO — Collaboratrice d'agence\nCabinet PONCEY Assurance Chasse\nTél : 0 800 014 033 (appel gratuit)\nSiège administratif : 97 rue de Bretagne — 14400 Bayeux`;
  const signatures  = mode === 'chasse' ? sigChasse : sigStandard;

  switch (type) {
    case 'confirmation_reception':
      return {
        objet: `Confirmation de réception — Déclaration sinistre n° ${numAgence}`,
        corps: `Madame, Monsieur ${client},

Nous avons bien reçu votre déclaration de sinistre "${typeSin}" en date du ${dateDec} et nous vous en remercions.

Votre dossier a été enregistré auprès de notre cabinet sous le numéro : ${numAgence}
Compagnie d'assurance saisie : ${compagnie}

Afin d'instruire votre dossier dans les meilleurs délais, nous vous invitons à nous faire parvenir les pièces justificatives suivantes :

${toutesLesPieces}

Ces documents peuvent être transmis :
  • Par email à l'adresse de votre interlocutrice
  • En courrier à notre cabinet
  • Ou déposés directement à nos locaux

Nous vous tiendrons informé(e) de l'avancement de votre dossier.

N'hésitez pas à nous contacter pour toute question.${signatures}`,
      };

    case 'client_15j':
      return {
        objet: `Dossier sinistre${num} — Documents manquants`,
        corps: `Madame, Monsieur ${client},

Suite à la déclaration de votre sinistre "${typeSin}" du ${dateDec}, nous revenons vers vous concernant votre dossier${num}.

Afin de permettre l'instruction rapide de votre dossier auprès de ${compagnie}, nous avons besoin des documents suivants, qui n'ont pas encore été reçus :

${listePieces}

Nous vous remercions de bien vouloir nous transmettre ces éléments dans les meilleurs délais, à l'adresse email de votre interlocutrice habituelle ou par courrier à notre cabinet.

Sans retour de votre part dans les 15 jours, nous ne pourrons pas garantir la prise en charge de votre dossier dans les délais impartis.

N'hésitez pas à nous contacter pour toute question.${signatures}`,
      };

    case 'client_30j':
      return {
        objet: `RELANCE — Dossier sinistre${num} — Documents toujours manquants`,
        corps: `Madame, Monsieur ${client},

Nous revenons vers vous pour la deuxième fois concernant votre dossier sinistre "${typeSin}"${num}, déclaré le ${dateDec}.

Malgré notre précédent message, nous n'avons pas encore reçu les documents suivants, indispensables au traitement de votre dossier :

${listePieces}

Sans ces documents, ${compagnie} ne pourra pas instruire votre dossier et procéder à l'indemnisation éventuelle.

Nous vous demandons de nous faire parvenir ces pièces en urgence. À défaut de réponse sous 8 jours, nous serons dans l'obligation de vous informer du blocage de votre dossier.

Merci de votre compréhension.${signatures}`,
      };

    case 'compagnie_15j':
      return {
        objet: `Relance — Dossier sinistre${num} — ${client}`,
        corps: `Madame, Monsieur,

Nous revenons vers vous concernant le dossier sinistre de notre client ${client}${num}, de type "${typeSin}", déclaré le ${dateDec}.

À ce jour, nous n'avons reçu aucun retour sur l'avancement de l'instruction de ce dossier.

Pourriez-vous nous indiquer :
  • L'état d'avancement de l'instruction
  • Les éventuels documents complémentaires nécessaires
  • Le délai prévisionnel de traitement

Nous restons disponibles pour tout complément d'information.${signatures}`,
      };

    case 'compagnie_30j':
      return {
        objet: `RELANCE URGENTE — Dossier sinistre${num} — ${client} — Sans réponse depuis 30 jours`,
        corps: `Madame, Monsieur,

Nous revenons vers vous pour la deuxième fois concernant le dossier sinistre de notre client ${client}${num}, de type "${typeSin}", déclaré le ${dateDec}.

Ce dossier est sans réponse depuis plus de 30 jours, ce qui est préjudiciable à notre client.

Nous vous demandons expressément de :
  • Nous communiquer l'état d'avancement de ce dossier sous 5 jours ouvrés
  • Ou de nous indiquer les raisons du blocage et les actions nécessaires

Sans retour de votre part, nous serons contraints d'escalader ce dossier auprès de votre direction et, si nécessaire, de saisir le médiateur de l'assurance.

Dans l'attente de votre retour.${signatures}`,
      };

    case 'cloture':
      return {
        objet: `Clôture de votre dossier sinistre${num}`,
        corps: `Madame, Monsieur ${client},

Nous revenons vers vous concernant votre dossier sinistre "${typeSin}"${num}, déclaré le ${dateDec} auprès de ${compagnie}.

Nous avons le plaisir de vous informer que votre dossier est désormais clôturé.

Le règlement de votre sinistre est intervenu pour un montant de : ${montant}

Nous restons à votre disposition pour toute question concernant ce dossier ou pour toute nouvelle démarche.

Nous vous remercions de la confiance que vous accordez à notre cabinet.${signatures}`,
      };

    default:
      return { objet: '', corps: '' };
  }
}

// ─── DATE HELPERS ──────────────────────────────────────────────────────────────

export const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
export const DAYS   = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

export function fmtDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function today() { const d = new Date(); d.setHours(0,0,0,0); return d; }

export function sameDay(ts, date) {
  if (!ts) return false;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate();
}

export function isOverdue(item) {
  if (!item.date || item.status === 'termine') return false;
  const d = item.date.toDate ? item.date.toDate() : new Date(item.date);
  return d < today();
}

export function daysUntil(ts) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  d.setHours(0,0,0,0);
  return Math.round((d - today()) / 86400000);
}

// ─── MODULE MED (MISE EN DEMEURE) ─────────────────────────────────────────────

export const MED_STATUSES = {
  en_cours:        { label: 'En cours',      icon: '🔵', color: '#60a5fa',  bg: 'rgba(96,165,250,.15)' },
  relance_1:       { label: 'Relance 1',     icon: '🟡', color: '#fbbf24',  bg: 'rgba(251,191,36,.15)' },
  relance_2:       { label: 'Relance 2',     icon: '🟠', color: '#fb923c',  bg: 'rgba(251,146,60,.15)' },
  mise_en_demeure: { label: 'MED envoyée',   icon: '🔴', color: '#f87171',  bg: 'rgba(248,113,113,.15)' },
  paye:            { label: 'Payé',          icon: '✅', color: '#34d399',  bg: 'rgba(52,211,153,.15)' },
  resiliation:     { label: 'Résilié',       icon: '⛔', color: '#6b7494',  bg: 'rgba(107,116,148,.15)' },
};

export const MED_TEMPLATES = {
  relance_1_cb:    { label: 'Relance 1 + solutions paiement', icon: '💳' },
  relance_2:       { label: 'Relance 2 — avant MED',          icon: '⚠️' },
  med_officielle:  { label: 'Mise en demeure officielle',     icon: '🔴' },
};

const SIG_MED = `Cordialement,\nAmélie BLANCO\nCABINET PONCEY LEBAS — Agent Général Allianz\nTél : 02 31 92 81 31 — N° Orias : 07022305-12066667`;

export function getMEDEmailTemplate(type, d) {
  const montant  = d.montantDu ? Number(d.montantDu).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €' : '[MONTANT]';
  const contrat  = d.numeroContrat || '[N° CONTRAT]';
  const typeC    = d.typeContrat   || 'assurance';
  const client   = d.clientName   || 'Madame, Monsieur';

  switch (type) {
    case 'relance_1_cb':
      return {
        objet: `Votre contrat ${typeC} n°${contrat} — Impayé ${montant} — Solutions de règlement`,
        corps: `${client},

Nous avons le regret de constater que la prime de votre contrat ${typeC} n°${contrat}, souscrit auprès d'Allianz, d'un montant de ${montant}, n'a pas été réglée à ce jour.

Afin de régulariser votre situation dans les meilleurs délais, nous vous proposons plusieurs solutions :

💳 Par carte bancaire en ligne :
Vous pouvez régler directement et en toute sécurité via le lien suivant : [LIEN CB À COMPLÉTER]

📅 Par mensualisation :
Nous pouvons mettre en place un prélèvement mensuel automatique pour faciliter le règlement de vos primes futures. Contactez-nous pour en faire la demande.

🏦 Par virement bancaire :
IBAN : FR76 [À COMPLÉTER]
BIC : [À COMPLÉTER]
Référence obligatoire : ${contrat} / ${client}

Nous vous remercions de bien vouloir régulariser cette situation dans un délai de 15 jours à compter de la réception du présent courrier.

Pour toute question, notre équipe reste à votre disposition au 02 31 92 81 31.

${SIG_MED}`,
      };

    case 'relance_2':
      return {
        objet: `URGENT — Contrat ${typeC} n°${contrat} — Dernière relance amiable avant mise en demeure`,
        corps: `${client},

Malgré notre précédent courrier, votre prime d'assurance ${typeC} n°${contrat} souscrit auprès d'Allianz, d'un montant de ${montant}, demeure impayée à ce jour.

Sans règlement de votre part dans un délai de 10 jours à compter de la réception du présent courrier, nous nous verrons dans l'obligation :
• D'engager la procédure de mise en demeure officielle conformément à l'article L. 113-3 du Code des assurances
• De procéder à la résiliation de votre contrat pour non-paiement de prime

Nous vous rappelons les modes de règlement disponibles :
💳 CB en ligne : [LIEN CB À COMPLÉTER]
🏦 Virement : IBAN FR76 [À COMPLÉTER] — Réf. ${contrat} / ${client}
📞 Contact : 02 31 92 81 31

Nous restons à votre disposition pour trouver ensemble une solution adaptée à votre situation.

${SIG_MED}`,
      };

    case 'med_officielle':
      return {
        objet: `MISE EN DEMEURE — Contrat ${typeC} n°${contrat} — Résiliation pour non-paiement`,
        corps: `${client},

Par la présente, et conformément aux dispositions de l'article L. 113-3 du Code des assurances, nous vous adressons une MISE EN DEMEURE formelle de régler la prime échue de votre contrat ${typeC} n°${contrat} souscrit auprès de la compagnie Allianz, d'un montant de ${montant}.

Sans règlement intégral de votre part dans un délai de 30 jours à compter de la réception de la présente mise en demeure, votre contrat d'assurance sera résilié de plein droit pour non-paiement de prime, en application de l'article L. 113-3 précité et des conditions générales de votre contrat.

Cette résiliation entraînera la perte définitive de toutes vos garanties. Tout sinistre survenant après la date de résiliation ne pourra donner lieu à aucune indemnisation.

Règlement à effectuer sans délai :
🏦 Virement : IBAN FR76 [À COMPLÉTER] — Réf. ${contrat} / ${client}
💳 CB en ligne : [LIEN CB À COMPLÉTER]
📞 Contact : 02 31 92 81 31

Veuillez agréer, ${client}, l'expression de nos salutations distinguées.

${SIG_MED}`,
      };

    default: return { objet: '', corps: '' };
  }
}

// ─── MODULE ÉCHÉANCES / RENOUVELLEMENTS ───────────────────────────────────────

export const ECHEANCE_URGENCE = {
  critique:  { label: '< 15 jours', color: '#f87171', bg: 'rgba(248,113,113,.15)', seuil: 15 },
  urgent:    { label: '< 30 jours', color: '#fb923c', bg: 'rgba(251,146,60,.15)',  seuil: 30 },
  attention: { label: '< 60 jours', color: '#fbbf24', bg: 'rgba(251,191,36,.15)',  seuil: 60 },
  ok:        { label: '< 90 jours', color: '#60a5fa', bg: 'rgba(96,165,250,.15)',  seuil: 90 },
};

export function echeanceUrgence(jours) {
  if (jours === null || jours === undefined) return null;
  if (jours < 0)   return { ...ECHEANCE_URGENCE.critique, label: 'Échu', color: '#6b7494' };
  if (jours <= 15) return ECHEANCE_URGENCE.critique;
  if (jours <= 30) return ECHEANCE_URGENCE.urgent;
  if (jours <= 60) return ECHEANCE_URGENCE.attention;
  if (jours <= 90) return ECHEANCE_URGENCE.ok;
  return null;
}

export const RENOUVELLEMENT_TEMPLATES = {
  info_90j:    { label: 'Information 90 jours',          icon: '📅' },
  relance_60j: { label: 'Relance 60 jours',              icon: '🔔' },
  relance_30j: { label: 'Relance urgente 30 jours',      icon: '⚠️' },
  confirmation:{ label: 'Confirmation renouvellement',   icon: '✅' },
};

const SIG_STD = `Cordialement,\nAmélie BLANCO\nCABINET PONCEY LEBAS\nTél : 02 31 92 81 31 — N° Orias : 07022305-12066667`;

export function getRenouvellementTemplate(type, contrat) {
  const client   = contrat.clientName || 'Madame, Monsieur';
  const typeC    = contrat.type       || 'votre contrat';
  const num      = contrat.numero     ? ` n°${contrat.numero}` : '';
  const echeance = (() => {
    if (!contrat.dateEcheance) return '[DATE ÉCHÉANCE]';
    const d = contrat.dateEcheance.toDate ? contrat.dateEcheance.toDate() : new Date(contrat.dateEcheance);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  })();
  const jours    = daysUntil(contrat.dateEcheance);
  const joursStr = jours !== null && jours > 0 ? `dans ${jours} jour${jours > 1 ? 's' : ''}` : 'prochainement';

  switch (type) {
    case 'info_90j':
      return {
        objet: `Votre contrat ${typeC}${num} — Échéance le ${echeance}`,
        corps: `${client},

Nous vous contactons afin de vous informer que votre contrat ${typeC}${num} arrive à échéance le ${echeance}, soit ${joursStr}.

À l'approche de cette date, nous souhaitons prendre contact avec vous pour faire le point sur vos besoins et vous proposer les meilleures conditions de renouvellement.

N'hésitez pas à nous contacter au 02 31 92 81 31 ou à répondre directement à ce mail pour convenir d'un rendez-vous.

${SIG_STD}`,
      };

    case 'relance_60j':
      return {
        objet: `Renouvellement de votre contrat ${typeC}${num} — Échéance le ${echeance}`,
        corps: `${client},

Nous revenons vers vous concernant l'échéance de votre contrat ${typeC}${num} prévue le ${echeance} (${joursStr}).

Afin de vous garantir une continuité de couverture sans interruption, nous vous invitons à nous contacter rapidement pour procéder au renouvellement dans les meilleures conditions.

Nous restons à votre disposition pour répondre à toutes vos questions ou adapter votre couverture si vos besoins ont évolué.

📞 02 31 92 81 31

${SIG_STD}`,
      };

    case 'relance_30j':
      return {
        objet: `URGENT — Votre contrat ${typeC}${num} expire le ${echeance} — Action requise`,
        corps: `${client},

Nous vous rappelons en urgence que votre contrat ${typeC}${num} expire le ${echeance}, soit ${joursStr}.

Sans renouvellement avant cette date, vous ne bénéficierez plus d'aucune garantie à compter du ${echeance}.

Merci de nous contacter sans délai au 02 31 92 81 31 afin de régulariser le renouvellement de votre contrat.

${SIG_STD}`,
      };

    case 'confirmation':
      return {
        objet: `Confirmation de renouvellement — Contrat ${typeC}${num}`,
        corps: `${client},

Nous avons le plaisir de vous confirmer le renouvellement de votre contrat ${typeC}${num}.

Votre couverture est maintenue sans interruption. Vous recevrez prochainement votre avis d'échéance et les documents contractuels correspondants.

Nous vous remercions de votre confiance renouvelée et restons à votre disposition pour toute question.

📞 02 31 92 81 31

${SIG_STD}`,
      };

    default: return { objet: '', corps: '' };
  }
}
