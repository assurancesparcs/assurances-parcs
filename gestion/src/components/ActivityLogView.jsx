import { useState, useMemo } from 'react';

const TYPE_META = {
  sinistre_cree:      { icon: '🛡️', label: 'Sinistre déclaré',       color: '#fb923c' },
  sinistre_modifie:   { icon: '✏️',  label: 'Sinistre modifié',       color: '#fbbf24' },
  sinistre_statut:    { icon: '🔄',  label: 'Statut sinistre modifié', color: '#fbbf24' },
  sinistre_relance:   { icon: '✉️',  label: 'Courrier sinistre envoyé',color: '#60a5fa' },
  sinistre_supprime:  { icon: '🗑️',  label: 'Sinistre supprimé',      color: '#6b7494' },
  chasse_cree:        { icon: '🏹',  label: 'Sinistre chasse déclaré', color: '#34d399' },
  chasse_modifie:     { icon: '✏️',  label: 'Sinistre chasse modifié', color: '#34d399' },
  chasse_statut:      { icon: '🔄',  label: 'Statut chasse modifié',   color: '#34d399' },
  chasse_relance:     { icon: '✉️',  label: 'Courrier chasse envoyé',  color: '#34d399' },
  med_cree:           { icon: '📬',  label: 'Dossier MED créé',        color: '#f87171' },
  med_modifie:        { icon: '✏️',  label: 'Dossier MED modifié',     color: '#fbbf24' },
  med_paye:           { icon: '✅',  label: 'MED marqué payé',         color: '#34d399' },
  med_relance:        { icon: '✉️',  label: 'Courrier MED envoyé',     color: '#f87171' },
  med_supprime:       { icon: '🗑️',  label: 'Dossier MED supprimé',   color: '#6b7494' },
  med_importe:        { icon: '📥',  label: 'Import MED',              color: '#a78bfa' },
  contrat_cree:       { icon: '📄',  label: 'Contrat ajouté',          color: '#a78bfa' },
  contrat_modifie:    { icon: '✏️',  label: 'Contrat modifié',         color: '#fbbf24' },
  contrat_paye:       { icon: '💶',  label: 'Prime marquée payée',     color: '#34d399' },
  contrat_supprime:   { icon: '🗑️',  label: 'Contrat supprimé',       color: '#6b7494' },
  client_cree:        { icon: '👤',  label: 'Client ajouté',           color: '#60a5fa' },
  client_modifie:     { icon: '✏️',  label: 'Client modifié',          color: '#fbbf24' },
  tache_creee:        { icon: '📋',  label: 'Tâche créée',             color: '#9ca3c0' },
  tache_terminee:     { icon: '✅',  label: 'Tâche terminée',          color: '#34d399' },
};

const USER_COLORS = {
  Johann:    '#a78bfa',
  'E.Poncey':'#c084fc',
  Ombeline:  '#f472b6',
  Julie:     '#60a5fa',
  Priscillia:'#34d399',
  Amélie:    '#fb923c',
  Justine:   '#fbbf24',
  Wiam:      '#38bdf8',
  Wendy:     '#e879f9',
};

function fmtTime(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function fmtDayLabel(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.round((now.setHours(0,0,0,0) - d.setHours(0,0,0,0)) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return 'Hier';
  if (diff <= 6) return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ActivityLogView({ logs }) {
  const [userFilter, setUserFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [period, setPeriod]         = useState('7');

  const users = useMemo(() => [...new Set(logs.map(l => l.userName).filter(Boolean))].sort(), [logs]);

  const filtered = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(period || '7'));
    return logs
      .filter(l => {
        const d = l.createdAt?.toDate ? l.createdAt.toDate() : new Date(l.createdAt || 0);
        if (d < cutoff) return false;
        if (userFilter && l.userName !== userFilter) return false;
        if (typeFilter && l.type !== typeFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const da = (a.createdAt?.toDate?.() || new Date(a.createdAt || 0)).getTime();
        const db = (b.createdAt?.toDate?.() || new Date(b.createdAt || 0)).getTime();
        return db - da;
      });
  }, [logs, userFilter, typeFilter, period]);

  // Group by day
  const byDay = useMemo(() => {
    const map = {};
    filtered.forEach(l => {
      const d = l.createdAt?.toDate ? l.createdAt.toDate() : new Date(l.createdAt || 0);
      const key = d.toISOString().slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(l);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  // Stats par user sur la période
  const userStats = useMemo(() => {
    const map = {};
    filtered.forEach(l => {
      if (!l.userName) return;
      map[l.userName] = (map[l.userName] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  return (
    <div className="journal-view">
      {/* Header filters */}
      <div className="journal-header">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>📓 Journal d'activité</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <select className="filter-select" value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="1">Aujourd'hui</option>
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">3 derniers mois</option>
          </select>
          <select className="filter-select" value={userFilter} onChange={e => setUserFilter(e.target.value)}>
            <option value="">Toute l'équipe</option>
            {users.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">Tous types</option>
            {Object.entries(TYPE_META).map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats rapides par collaboratrice */}
      {userStats.length > 0 && (
        <div className="journal-userstats">
          {userStats.map(([user, count]) => (
            <div key={user} className="journal-userstat"
              onClick={() => setUserFilter(f => f === user ? '' : user)}
              style={{ borderColor: userFilter === user ? (USER_COLORS[user] || 'var(--orange)') : 'var(--border)', cursor: 'pointer' }}>
              <span className="journal-user-dot" style={{ background: USER_COLORS[user] || 'var(--orange)' }} />
              <span style={{ fontWeight: 700, fontSize: 13 }}>{user}</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: USER_COLORS[user] || 'var(--orange)' }}>{count}</span>
              <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>action{count > 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>
      )}

      {/* Feed */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 64 }}>📓</div>
          <h3>Aucune activité sur cette période</h3>
          <p>Le journal se remplit automatiquement à chaque action de l'équipe.</p>
        </div>
      ) : (
        <div className="journal-feed">
          {byDay.map(([dateStr, entries]) => (
            <div key={dateStr} className="journal-day">
              <div className="journal-day-label">{fmtDayLabel(dateStr)}
                <span className="journal-day-count">{entries.length}</span>
              </div>
              {entries.map((l, i) => {
                const meta = TYPE_META[l.type] || { icon: '⚡', label: l.type, color: 'var(--text-dim)' };
                const userColor = USER_COLORS[l.userName] || 'var(--orange)';
                return (
                  <div key={l.id || i} className="journal-row">
                    <div className="journal-row-icon" style={{ background: meta.color + '22', color: meta.color }}>
                      {meta.icon}
                    </div>
                    <div className="journal-row-body">
                      <div className="journal-row-main">
                        <span style={{ fontWeight: 700 }}>{meta.label}</span>
                        {l.description && (
                          <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>— {l.description}</span>
                        )}
                      </div>
                      {l.detail && (
                        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{l.detail}</div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                      <span className="journal-user-badge" style={{ background: userColor + '22', color: userColor }}>
                        {l.userName || '?'}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{fmtTime(l.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
