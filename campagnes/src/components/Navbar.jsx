import { CAMPAGNE_STATUTS } from '../data.js';

const VIEWS = [
  { id: 'dashboard',  icon: '📊', label: 'Tableau de bord' },
  { id: 'campagnes',  icon: '📧', label: 'Campagnes'        },
  { id: 'templates',  icon: '📝', label: 'Modèles'          },
  { id: 'prospects',  icon: '👥', label: 'Prospects'        },
  { id: 'planif',     icon: '📅', label: 'Planification'    },
  { id: 'suivi',      icon: '📬', label: 'Suivi envois'     },
];

export default function Navbar({ view, setView, campagnes, prospects, envois }) {
  const actives    = campagnes.filter(c => c.statut === 'active').length;
  const planifees  = campagnes.filter(c => c.statut === 'planifiee').length;
  const sansReponse = (envois || []).filter(e =>
    ['relance1', 'relance2'].includes(e.statut)
  ).length;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-brand-icon">🎧</span>
        <div className="nav-brand-text">
          <div className="nav-brand-title">Campagnes Emailing</div>
          <div className="nav-brand-sub">Audioprothésistes</div>
        </div>
      </div>

      <div className="nav-tabs">
        {VIEWS.map(v => (
          <button
            key={v.id}
            className={`nav-tab ${view === v.id ? 'active' : ''}`}
            onClick={() => setView(v.id)}
          >
            <span>{v.icon}</span>
            <span className="nav-tab-label">{v.label}</span>
            {v.id === 'campagnes' && actives > 0 && (
              <span className="nav-badge green">{actives}</span>
            )}
            {v.id === 'planif' && planifees > 0 && (
              <span className="nav-badge yellow">{planifees}</span>
            )}
            {v.id === 'prospects' && prospects.length > 0 && (
              <span className="nav-badge" style={{ background: 'var(--purple)' }}>
                {prospects.filter(p => p.statut === 'prospect').length || null}
              </span>
            )}
            {v.id === 'suivi' && sansReponse > 0 && (
              <span className="nav-badge yellow">{sansReponse}</span>
            )}
          </button>
        ))}
      </div>

      <div className="nav-right">
        <div style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'right' }}>
          <div>{campagnes.length} campagne{campagnes.length !== 1 ? 's' : ''}</div>
          <div>{prospects.length} prospect{prospects.length !== 1 ? 's' : ''}</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg,var(--orange),#ff8c5a)',
          borderRadius: 10, padding: '6px 12px',
          fontSize: 12, fontWeight: 700, color: '#fff',
        }}>
          Cabinet Poncey Lebas
        </div>
      </div>
    </nav>
  );
}
