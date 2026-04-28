import { useState, useMemo } from 'react';
import { TYPES, fmtDate } from '../constants';

export default function AlertBanner({ items }) {
  const [dismissed, setDismissed] = useState(new Set());
  const alerts = useMemo(() =>
    items.filter(i => i.priority === 'urgent' && i.status !== 'termine' && !dismissed.has(i.id)).slice(0, 3),
    [items, dismissed]);

  if (!alerts.length) return null;

  return (
    <div className="alert-banner">
      <div className="alert-icon">🚨</div>
      <div className="alert-items">
        {alerts.map(item => (
          <div key={item.id} className="alert-item">
            <span>{TYPES[item.type]?.icon}</span>
            <span className="alert-title">{item.title}</span>
            {item.date && <span className="alert-date">{fmtDate(item.date)}</span>}
            <button className="alert-dismiss" onClick={() => setDismissed(s => new Set([...s, item.id]))}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
