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

export const SINISTRE_STATUSES = {
  declare:        { label: 'Déclaré',           color: '#9ca3c0', bg: 'rgba(156,163,192,0.15)', icon: '📨' },
  en_instruction: { label: 'En instruction',    color: '#60a5fa', bg: 'rgba(96,165,250,0.15)',  icon: '🔍' },
  attente_pieces: { label: 'Attente pièces',    color: '#fbbf24', bg: 'rgba(251,191,36,0.15)',  icon: '📎' },
  expertise:      { label: 'Expertise en cours',color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', icon: '🔬' },
  indemnise:      { label: 'Indemnisé',         color: '#34d399', bg: 'rgba(52,211,153,0.15)',  icon: '✅' },
  cloture:        { label: 'Clôturé',           color: '#6b7494', bg: 'rgba(107,116,148,0.15)', icon: '🗄️' },
  refuse:         { label: 'Refusé',            color: '#f87171', bg: 'rgba(248,113,113,0.15)', icon: '❌' },
};

export const PIECES_DEFAUT = {
  incendie:           ['Déclaration de sinistre', 'Rapport des pompiers', 'Photos des dégâts', 'Inventaire des biens détruits', 'Devis de réparation'],
  vol:                ['Déclaration de sinistre', 'Dépôt de plainte (police)', 'Inventaire des biens volés', 'Photos', 'Factures/preuves d\'achat'],
  degats_eaux:        ['Déclaration de sinistre', 'Constat amiable', 'Photos des dégâts', 'Devis de réparation', 'Rapport de plomberie'],
  bris_glace:         ['Déclaration de sinistre', 'Photos', 'Devis de remplacement'],
  rc_corporel:        ['Déclaration de sinistre', 'Rapport de police / gendarmerie', 'Certificats médicaux', 'Témoignages', 'PV d\'accident'],
  rc_materiel:        ['Déclaration de sinistre', 'Constat amiable', 'Photos des dégâts', 'Devis de réparation', 'PV d\'accident'],
  accident:           ['Déclaration de sinistre', 'Constat amiable', 'Photos', 'Rapport de police', 'Devis de réparation'],
  catastrophe_nat:    ['Déclaration de sinistre', 'Arrêté de catastrophe naturelle', 'Photos des dégâts', 'Inventaire des biens', 'Devis de réparation'],
  perte_exploitation: ['Déclaration de sinistre', 'Bilans comptables', 'Justificatifs de perte', 'Rapport d\'expertise'],
  autre:              ['Déclaration de sinistre', 'Photos / preuves', 'Devis ou justificatifs'],
};

export const INACTIVITE_ALERTE_JOURS = 15;

export const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
export const DAYS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

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
