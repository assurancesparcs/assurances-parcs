const VIEWS_AUDIO = [
  { id: 'liste',            icon: '📋', label: 'Liste' },
  { id: 'calendrier',       icon: '📅', label: 'Calendrier' },
  { id: 'clients',          icon: '👥', label: 'Clients' },
  { id: 'contrats',         icon: '📄', label: 'Contrats' },
  { id: 'sinistres',        icon: '🛡️', label: 'Sinistres' },
  { id: 'sinistres_chasse', icon: '🏹', label: 'Chasse' },
  { id: 'dashboard_sin',    icon: '☀️', label: 'Matin' },
  { id: 'stats',            icon: '📊', label: 'Stats' },
];

const VIEWS_PARCS = [
  { id: 'liste',         icon: '📋', label: 'Liste' },
  { id: 'calendrier',    icon: '📅', label: 'Calendrier' },
  { id: 'clients',       icon: '👥', label: 'Clients' },
  { id: 'contrats',      icon: '📄', label: 'Contrats' },
  { id: 'sinistres',     icon: '🛡️', label: 'Sinistres' },
  { id: 'dashboard_sin', icon: '☀️', label: 'Matin' },
  { id: 'stats',         icon: '📊', label: 'Stats' },
];

function Badge({ count, color = '#f87171' }) {
  if (!count) return null;
  return (
    <span style={{
      position: 'absolute', top: 2, right: 2,
      background: color, color: '#fff', borderRadius: '50%',
      width: 16, height: 16, fontSize: 9, fontWeight: 800,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{count > 9 ? '9+' : count}</span>
  );
}

export default function NavBar({
  view, setView, userName, onAdd, onChangeUser, count,
  sinistresAlertCount, sinistresRelanceCount, sinistresChassseAlertCount,
  module, setModule,
}) {
  const VIEWS = module === 'parcs' ? VIEWS_PARCS : VIEWS_AUDIO;
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => setModule('audio')}
              style={{
                padding: '2px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                background: module === 'audio' ? '#6366f1' : '#e5e7eb',
                color: module === 'audio' ? '#fff' : '#374151',
              }}>🎧 Audio</button>
            <button
              onClick={() => setModule('parcs')}
              style={{
                padding: '2px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                background: module === 'parcs' ? '#10b981' : '#e5e7eb',
                color: module === 'parcs' ? '#fff' : '#374151',
              }}>🎡 Parcs</button>
          </div>
          <div className="nav-sub">{count} élément{count !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <div className="nav-tabs">
        {VIEWS.map(v => (
          <button key={v.id} className={`nav-tab ${view === v.id ? 'active' : ''}`}
            onClick={() => setView(v.id)} style={{ position: 'relative' }}>
            <span>{v.icon}</span>
            <span className="nav-tab-label">{v.label}</span>
            {v.id === 'sinistres'        && <Badge count={sinistresAlertCount} />}
            {v.id === 'sinistres_chasse' && <Badge count={sinistresChassseAlertCount} />}
            {v.id === 'dashboard_sin'    && <Badge count={sinistresRelanceCount} color="#fbbf24" />}
          </button>
        ))}
      </div>
      <div className="nav-right">
        <button className="btn-add" onClick={onAdd}>+ Nouveau</button>
        <div className={`user-badge ${userName === 'Johann' ? 'patron' : 'assistante'}`}
          onClick={onChangeUser} title="Changer d'utilisateur" style={{ cursor: 'pointer' }}>
          {userName === 'Johann' ? '👨‍💼' : '👩‍💼'} {userName || '?'}
          <span className="sync-dot" title="Synchronisé" />
        </div>
      </div>
    </nav>
  );
}
