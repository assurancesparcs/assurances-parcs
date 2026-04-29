const VIEWS = [
  { id: 'liste',      icon: '📋', label: 'Liste' },
  { id: 'calendrier', icon: '📅', label: 'Calendrier' },
  { id: 'clients',    icon: '👥', label: 'Clients' },
  { id: 'contrats',   icon: '📄', label: 'Contrats' },
  { id: 'stats',      icon: '📊', label: 'Stats' },
];

export default function NavBar({ view, setView, userName, onAdd, onChangeUser, count }) {
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
          <button key={v.id} className={`nav-tab ${view === v.id ? 'active' : ''}`} onClick={() => setView(v.id)}>
            <span>{v.icon}</span>
            <span className="nav-tab-label">{v.label}</span>
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
