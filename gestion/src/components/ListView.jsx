import { useMemo, useState } from 'react';
import TaskCard from './TaskCard';
import { TYPES, PRIORITIES, STATUSES, fmtDate, isOverdue } from '../constants';

const ARCHIVE_DAYS = 90;

function isInArchiveWindow(item) {
  if (item.type === 'rdv') return false;
  if (item.status !== 'termine') return false;
  if (!item.termineAt) return true;
  const done = item.termineAt.toDate ? item.termineAt.toDate() : new Date(item.termineAt);
  return (Date.now() - done.getTime()) / 86400000 <= ARCHIVE_DAYS;
}

function fmtTimestamp(ts) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function TaskRow({ item, onEdit, onDelete, onStatusChange }) {
  const type = TYPES[item.type] || TYPES.tache;
  const pr   = PRIORITIES[item.priority] || PRIORITIES.normal;
  const st   = STATUSES[item.status] || STATUSES.a_faire;
  const over = isOverdue(item);
  const isDone = item.status === 'termine';

  const dateStr = isDone && item.termineAt
    ? `✅ ${fmtTimestamp(item.termineAt)}`
    : item.date
      ? `📅 ${fmtDate(item.date)}${item.type === 'rdv' && item.time ? ` · ${item.time}${item.timeFin ? ` – ${item.timeFin}` : ''}` : ''}`
      : '—';

  return (
    <tr className={`task-table-row${over ? ' overdue-row' : ''}`} onClick={() => onEdit(item)}>
      <td>
        <span style={{ color: type.color, fontWeight: 700 }}>{type.icon} {type.label}</span>
      </td>
      <td style={{ fontWeight: 700 }}>{item.title}</td>
      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.clientName || '—'}</td>
      <td>
        <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700,
          background: pr.bg, color: pr.color }}>
          {pr.label}
        </span>
      </td>
      <td>
        <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700,
          background: st.bg, color: st.color }}>
          {st.label}
        </span>
      </td>
      <td style={{ fontSize: 11, color: over ? '#f87171' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
        {dateStr}
      </td>
      <td style={{ fontSize: 12, color: 'var(--text-dim)' }}>
        {item.assignedTo || item.createdBy || '—'}
      </td>
      <td onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <select className="status-select" value={item.status || 'a_faire'}
            onChange={e => onStatusChange(item.id, e.target.value)}
            style={{ color: st.color, fontSize: 11 }}>
            {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button className="btn-icon delete" onClick={() => onDelete(item.id)} title="Supprimer">🗑️</button>
        </div>
      </td>
    </tr>
  );
}

export default function ListView({ items, onEdit, onDelete, onStatusChange, onAdd, userName, globalView, setGlobalView }) {
  const [showArchives, setShowArchives] = useState(false);
  const [viewMode, setViewMode]         = useState('vignette');

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
    { key: 'urgent', label: '🔴 Urgent',         cls: 'urgent' },
    { key: 'haute',  label: '🟠 Haute priorité',  cls: 'haute' },
    { key: 'normal', label: '🔵 Normal',           cls: 'normal' },
  ];

  const isEmpty = !active.length && !archived.length;

  return (
    <div className="list-view">
      {/* Barre supérieure */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, flexWrap: 'wrap', gap: 8 }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
            {!globalView ? `Tâches assignées à ${userName}` : "Toutes les tâches de l'équipe"}
          </div>
          {/* Toggle vignette / liste */}
          <div style={{ display: 'flex', gap: 2, background: 'var(--bg-input)', borderRadius: 8, padding: 3 }}>
            {[
              { mode: 'vignette', icon: '⊞', title: 'Vue vignettes' },
              { mode: 'liste',    icon: '☰', title: 'Vue liste' },
            ].map(v => (
              <button key={v.mode} title={v.title} onClick={() => setViewMode(v.mode)}
                style={{
                  background: viewMode === v.mode ? 'var(--orange)' : 'transparent',
                  border: 'none', borderRadius: 6, padding: '5px 10px',
                  color: viewMode === v.mode ? '#fff' : 'var(--text-muted)',
                  fontSize: 16, cursor: 'pointer', lineHeight: 1,
                }}>
                {v.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="empty-state">
          <div style={{ fontSize: 64 }}>📋</div>
          <h3>Aucun élément</h3>
          <p>{globalView ? 'Commencez par créer un RDV, une tâche ou un suivi.' : `Aucune tâche assignée à ${userName}.`}</p>
          <button className="btn-primary" onClick={onAdd}>+ Créer le premier élément</button>
        </div>
      ) : viewMode === 'vignette' ? (
        /* ─── VUE VIGNETTES ─── */
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
      ) : (
        /* ─── VUE LISTE ─── */
        <div style={{ overflowX: 'auto' }}>
          <table className="contracts-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Titre</th>
                <th>Client</th>
                <th>Priorité</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Assigné</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map(g =>
                grouped[g.key].map(item => (
                  <TaskRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
                ))
              )}
            </tbody>
          </table>

          {archived.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <button onClick={() => setShowArchives(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, padding: '0 0 10px' }}>
                <span style={{ display: 'inline-block', transition: 'transform .2s',
                  transform: showArchives ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                🗄️ Archives — {archived.length} tâche{archived.length > 1 ? 's' : ''} terminée{archived.length > 1 ? 's' : ''}
              </button>
              {showArchives && (
                <table className="contracts-table" style={{ opacity: 0.7 }}>
                  <tbody>
                    {archived.map(item => (
                      <TaskRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          <div style={{ fontSize: 12, color: 'var(--text-dim)', padding: '8px 4px' }}>
            {active.length} élément{active.length > 1 ? 's' : ''} actif{active.length > 1 ? 's' : ''}
            {' — cliquer sur une ligne pour modifier'}
          </div>
        </div>
      )}
    </div>
  );
}
