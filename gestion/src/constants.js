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
