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

export const USERS = ['Johann', 'Ombeline', 'Julie', 'Priscillia', 'Amélie', 'Justine'];

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

export function getEmailTemplate(type, sinistre, piecesMisquantes = []) {
  const client    = sinistre.clientName || 'Madame, Monsieur';
  const num       = sinistre.numero ? ` n° ${sinistre.numero}` : '';
  const compagnie = sinistre.compagnie || 'votre compagnie d\'assurance';
  const typeSin   = (SINISTRE_TYPES[sinistre.type] || SINISTRE_CHASSE_TYPES[sinistre.type] || {}).label || 'sinistre';
  const dateDec   = fmtDate(sinistre.dateDeclaration) || 'récente';
  const listePieces = piecesMisquantes.length
    ? piecesMisquantes.map(p => `  • ${p}`).join('\n')
    : '  • (aucune pièce manquante identifiée)';

  const signatures = '\n\nCordialement,\n[Votre prénom]\nCabinet Assurances Parcs de Loisirs Indoor\nTél : [Votre numéro]';

  switch (type) {
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
