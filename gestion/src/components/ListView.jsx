import { useMemo, useState } from 'react';
import TaskCard from './TaskCard';

const ARCHIVE_DAYS = 90;

function isInArchiveWindow(item) {
  if (item.type === 'rdv') return false;
  if (item.status !== 'termine') return false;
  if (!item.termineAt) return true;
  const done = item.termineAt.toDate ? item.termineAt.toDate() : new Date(item.termineAt);
  return (Date.now() - done.getTime()) / 86400000 <= ARCHIVE_DAYS;
}

export default function ListView({ items, onEdit, onDelete, onStatusChange, onAdd, userName, globalView, setGlobalView }) {
  const [showArchives, setShowArchives] = useState(false);

  const { active, archived } = useMemo(() => {
    const active = [], archived = [];
    items.forEach(i => {
      if (i.status === 'termine' && i.type !== 'rdv') archived.push(i);
      else active.push(i);
    });
    return { active, archived: archived.filter(isInArchiveWindow) };
  }, [items]);

  const grouped = useMemo(() => {
    const g = { urgent: [], haute: [], normal: [] };
    active.forEach(i => { const p = i.priority || 'normal'; if (g[p]) g[p].push(i); });
    return g;
  }, [active]);

  const groups = [
    { key: 'urgent', label: '🔴 Urgent', cls: 'urgent' },
    { key: 'haute',  label: '🟠 Haute priorité', cls: 'haute' },
    { key: 'normal', label: '🔵 Normal', cls: 'normal' },
  ];

  const isEmpty = !active.length && !archived.length;

  return (
    <div className="list-view">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setGlobalView(false)}
            style={{ padding: '5px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700,
              background: !globalView ? 'var(--orange)' : 'var(--bg-input)',
              color: !globalView ? '#fff' : 'var(--text-muted)' }}>
            👤 Ma vue
          </button>
          <button onClick={() => setGlobalView(true)}
            style={{ padding: '5px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700,
              background: globalView ? '#7c3aed' : 'var(--bg-input)',
              color: globalView ? '#fff' : 'var(--text-muted)' }}>
            🌐 Vue globale
          </button>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
          {!globalView ? `Tâches assignées à ${userName}` : 'Toutes les tâches de l\'équipe'}
        </div>
      </div>

      {isEmpty ? (
        <div className="empty-state">
          <div style={{ fontSize: 64 }}>📋</div>
          <h3>Aucun élément</h3>
          <p>{globalView ? 'Commencez par créer un RDV, une tâche ou un suivi.' : `Aucune tâche assignée à ${userName}.`}</p>
          <button className="btn-primary" onClick={onAdd}>+ Créer le premier élément</button>
        </div>
      ) : (
        <>
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

          {archived.length > 0 && (
            <div className="list-group" style={{ marginTop: 24 }}>
              <button onClick={() => setShowArchives(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, padding: 0 }}>
                <span style={{ display: 'inline-block', transition: 'transform .2s',
                  transform: showArchives ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                🗄️ Archives — {archived.length} tâche{archived.length > 1 ? 's' : ''} terminée{archived.length > 1 ? 's' : ''}
                <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 400 }}>(90 derniers jours)</span>
              </button>
              {showArchives && (
                <div className="cards-grid" style={{ marginTop: 12, opacity: 0.7 }}>
                  {archived.map(item => (
                    <TaskCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
