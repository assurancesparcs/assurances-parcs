const VIEWS = [
  { id: 'liste',            icon: '📋', label: 'Liste' },
  { id: 'calendrier',       icon: '📅', label: 'Calendrier' },
  { id: 'clients',          icon: '👥', label: 'Clients' },
  { id: 'contrats',         icon: '📄', label: 'Contrats' },
  { id: 'echeances',        icon: '🔔', label: 'Échéances' },
  { id: 'sinistres',        icon: '🛡️', label: 'Sinistres' },
  { id: 'sinistres_chasse', icon: '🏹', label: 'Chasse' },
  { id: 'dashboard_sin',    icon: '☀️', label: 'Matin' },
  { id: 'med',              icon: '📬', label: 'MED' },
  { id: 'journal',          icon: '📓', label: 'Journal' },
  { id: 'stats',            icon: '📊', label: 'Stats' },
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
  medAlertCount, echeancesAlertCount, onSearch, theme, onToggleTheme,
}) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span>⚡</span>
        <div>
          <div className="nav-title">Mon Espace Pro</div>
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
            {v.id === 'med'              && <Badge count={medAlertCount} color="#f87171" />}
            {v.id === 'echeances'        && <Badge count={echeancesAlertCount} color="#fb923c" />}
          </button>
        ))}
      </div>
      <div className="nav-right">
        <button className="btn-theme" onClick={onToggleTheme} title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="btn-search" onClick={onSearch} title="Recherche globale (Ctrl+K)">
          🔍 <span className="nav-tab-label">Recherche</span>
          <span className="search-kbd">Ctrl+K</span>
        </button>
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
