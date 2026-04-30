import { TYPES, PRIORITIES, STATUSES, fmtDate, isOverdue } from '../constants';

function fmtTimestamp(ts) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function TaskCard({ item, onEdit, onDelete, onStatusChange }) {
  const type = TYPES[item.type] || TYPES.tache;
  const pr = PRIORITIES[item.priority] || PRIORITIES.normal;
  const st = STATUSES[item.status] || STATUSES.a_faire;
  const overdue = isOverdue(item);
  const isDone = item.status === 'termine';

  return (
    <div className={`task-card ${overdue ? 'overdue' : ''}`} onClick={() => onEdit(item)}>
      <div className="card-header">
        <div className="card-type" style={{ color: type.color }}>{type.icon} {type.label}</div>
        <div className="card-badges">
          <span className="badge" style={{ color: pr.color, background: pr.bg }}>{pr.label}</span>
          <span className="badge" style={{ color: st.color, background: st.bg }}>{st.label}</span>
        </div>
      </div>
      <div className="card-title">{item.title}</div>
      {item.clientName && <div className="card-client">👥 {item.clientName}</div>}
      {item.description && <div className="card-desc">{item.description}</div>}
      <div className="card-footer">
        {isDone && item.termineAt ? (
          <span className="card-date" style={{ color: '#34d399' }}>✅ Clôturé le {fmtTimestamp(item.termineAt)}</span>
        ) : item.date ? (
          <span className={`card-date ${overdue ? 'overdue-text' : ''}`}>
            📅 {fmtDate(item.date)}{item.type === 'rdv' && item.time ? ` · ${item.time}` : ''}
          </span>
        ) : null}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 'auto' }}>
          {item.assignedTo ? (
            <span className="card-creator" style={{ background: 'rgba(168,139,250,.15)', color: '#a78bfa' }}>
              👤 {item.assignedTo}
            </span>
          ) : item.createdBy ? (
            <span className="card-creator">{item.createdBy === 'Johann' ? '👨‍💼' : '👩‍💼'} {item.createdBy}</span>
          ) : null}
        </div>
        <div className="card-actions" onClick={e => e.stopPropagation()}>
          <select className="status-select" value={item.status || 'a_faire'}
            onChange={e => onStatusChange(item.id, e.target.value)} style={{ color: st.color }}>
            {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button className="btn-icon delete" onClick={() => onDelete(item.id)} title="Supprimer">🗑️</button>
        </div>
      </div>
    </div>
  );
}
