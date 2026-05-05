export default function NavBar({ page, setPage }) {
  const tabs = [
    { id: 'dashboard', icon: '📊', label: 'Tableau' },
    { id: 'km',        icon: '🚗', label: 'Km' },
    { id: 'repas',     icon: '🍽️',  label: 'Repas' },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`nav-item${page === t.id ? ' active' : ''}`}
          onClick={() => setPage(t.id)}
        >
          <span className="nav-icon">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
