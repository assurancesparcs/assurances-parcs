import { useMemo } from 'react';
import TaskCard from './TaskCard';

export default function ListView({ items, onEdit, onDelete, onStatusChange, onAdd }) {
  const grouped = useMemo(() => {
    const g = { urgent: [], haute: [], normal: [] };
    items.forEach(i => { const p = i.priority || 'normal'; if (g[p]) g[p].push(i); });
    return g;
  }, [items]);

  if (!items.length) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: 64 }}>📋</div>
        <h3>Aucun élément</h3>
        <p>Commencez par créer un RDV, une tâche ou un suivi.</p>
        <button className="btn-primary" onClick={onAdd}>+ Créer le premier élément</button>
      </div>
    );
  }

  const groups = [
    { key: 'urgent', label: '🔴 Urgent', cls: 'urgent' },
    { key: 'haute',  label: '🟠 Haute priorité', cls: 'haute' },
    { key: 'normal', label: '🔵 Normal', cls: 'normal' },
  ];

  return (
    <div className="list-view">
      {groups.map(g => grouped[g.key].length > 0 && (
        <div key={g.key} className="list-group">
          <div className={`group-title ${g.cls}`}>{g.label} ({grouped[g.key].length})</div>
          <div className="cards-grid">
            {grouped[g.key].map(item => (
              <TaskCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
