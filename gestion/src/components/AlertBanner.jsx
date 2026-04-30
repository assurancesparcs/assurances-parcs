import { useState, useMemo } from 'react';
import { TYPES, SINISTRE_TYPES, SINISTRE_CHASSE_TYPES, fmtDate, daysUntil, INACTIVITE_ALERTE_JOURS, joursDepuisRelance } from '../constants';

function daysSince(ts) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

const ACTIVE_SIN = ['declare', 'en_instruction', 'attente_pieces', 'expertise'];

export default function AlertBanner({ items, contracts, sinistres, sinistresChasse }) {
  const [dismissed, setDismissed] = useState(new Set());
  const dismiss = (id) => setDismissed(s => new Set([...s, id]));

  const urgentItems = useMemo(() =>
    items.filter(i => i.priority === 'urgent' && i.status !== 'termine' && !dismissed.has(i.id)).slice(0, 3),
    [items, dismissed]);

  const urgentContracts = useMemo(() =>
    (contracts || []).filter(c => {
      if (c.primePayee || dismissed.has('c_' + c.id)) return false;
      const d = daysUntil(c.dateEcheance);
      return d !== null && d <= 30;
    }).slice(0, 3),
    [contracts, dismissed]);

  const sinistresInactifs = useMemo(() =>
    (sinistres || []).filter(s => {
      if (!ACTIVE_SIN.includes(s.status) || dismissed.has('s_' + s.id)) return false;
      return daysSince(s.lastActivityAt || s.updatedAt) >= INACTIVITE_ALERTE_JOURS;
    }).slice(0, 2),
    [sinistres, dismissed]);

  const relancesUrgentes = useMemo(() => {
    const all = [
      ...(sinistres || []).map(s => ({ ...s, _col: 'sin' })),
      ...(sinistresChasse || []).map(s => ({ ...s, _col: 'chasse' })),
    ];
    return all.filter(s => {
      if (!ACTIVE_SIN.includes(s.status) || dismissed.has('r_' + s.id)) return false;
      const jc = joursDepuisRelance(s, 'client');
      const jp = joursDepuisRelance(s, 'compagnie');
      return (jc !== null && jc >= 30) || (jp !== null && jp >= 30);
    }).slice(0, 3);
  }, [sinistres, sinistresChasse, dismissed]);

  if (!urgentItems.length && !urgentContracts.length && !sinistresInactifs.length && !relancesUrgentes.length) return null;

  return (
    <div className="alert-banner">
      <div className="alert-icon">🚨</div>
      <div className="alert-items">
        {urgentItems.map(item => (
          <div key={item.id} className="alert-item">
            <span>{TYPES[item.type]?.icon}</span>
            <span className="alert-title">{item.title}</span>
            {item.date && <span className="alert-date">{fmtDate(item.date)}</span>}
            <button className="alert-dismiss" onClick={() => dismiss(item.id)}>✕</button>
          </div>
        ))}
        {urgentContracts.map(c => {
          const days = daysUntil(c.dateEcheance);
          return (
            <div key={c.id} className="alert-item" style={{ borderColor: 'rgba(251,191,36,0.4)', background: 'rgba(251,191,36,0.1)' }}>
              <span>📄</span>
              <span className="alert-title">{c.clientName}</span>
              <span className="alert-date">{c.type} — {days <= 0 ? 'Échu !' : `${days}j`}</span>
              <button className="alert-dismiss" onClick={() => dismiss('c_' + c.id)}>✕</button>
            </div>
          );
        })}
        {sinistresInactifs.map(s => {
          const tp = SINISTRE_TYPES[s.type] || SINISTRE_TYPES.autre;
          const j  = daysSince(s.lastActivityAt || s.updatedAt);
          return (
            <div key={s.id} className="alert-item" style={{ borderColor: 'rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.1)' }}>
              <span>{tp.icon}</span>
              <span className="alert-title">{s.clientName}</span>
              <span className="alert-date">Sinistre inactif {j}j</span>
              <button className="alert-dismiss" onClick={() => dismiss('s_' + s.id)}>✕</button>
            </div>
          );
        })}
        {relancesUrgentes.map(s => {
          const tp = (SINISTRE_TYPES[s.type] || SINISTRE_CHASSE_TYPES[s.type] || { icon: '📋' });
          const jc = joursDepuisRelance(s, 'client');
          const jp = joursDepuisRelance(s, 'compagnie');
          const cible = jc >= jp ? `client (${jc}j)` : `compagnie (${jp}j)`;
          return (
            <div key={s.id} className="alert-item" style={{ borderColor: 'rgba(248,113,113,0.4)', background: 'rgba(248,113,113,0.1)' }}>
              <span>{tp.icon}</span>
              <span className="alert-title">{s.clientName}</span>
              <span className="alert-date">Relance {cible} en attente</span>
              <button className="alert-dismiss" onClick={() => dismiss('r_' + s.id)}>✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
