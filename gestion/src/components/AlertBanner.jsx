import { useState, useMemo } from 'react';
import { TYPES, fmtDate, daysUntil } from '../constants';

export default function AlertBanner({ items, contracts }) {
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

  if (!urgentItems.length && !urgentContracts.length) return null;

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
      </div>
    </div>
  );
}
