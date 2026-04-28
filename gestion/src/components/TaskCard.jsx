import { TYPES, PRIORITIES, STATUSES, fmtDate, isOverdue } from '../constants';

export default function TaskCard({ item, onEdit, onDelete, onStatusChange }) {
  const type = TYPES[item.type] || TYPES.tache;
  const pr = PRIORITIES[item.priority] || PRIORITIES.normal;
  const st = STATUSES[item.status] || STATUSES.a_faire;
  const overdue = isOverdue(item);

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
        {item.date && (
          <span className={`card-date ${overdue ? 'overdue-text' : ''}`}>
            📅 {fmtDate(item.date)}{item.type === 'rdv' && item.time ? ` · ${item.time}` : ''}
          </span>
        )}
        {item.createdBy && <span className="card-creator">{item.createdBy === 'Patron' ? '👨‍💼' : '👩‍💼'} {item.createdBy}</span>}
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
