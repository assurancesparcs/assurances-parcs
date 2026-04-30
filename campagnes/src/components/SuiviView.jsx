import { useState, useMemo } from 'react';
import { ENVOI_STATUTS, CAMPAGNE_TYPES, fmtDate, daysSince } from '../data.js';

export default function SuiviView({ envois, campagnes, prospects, onMarquerRepondu, onMarquerTermine }) {
  const [filterStatut, setFilterStatut]     = useState('');
  const [filterCampagne, setFilterCampagne] = useState('');
  const [search, setSearch]                 = useState('');

  // Enrichir chaque envoi avec les données campagne + prospect
  const enriched = useMemo(() => envois.map(e => ({
    ...e,
    campagne: campagnes.find(c => c.id === e.campagneId),
    prospect: prospects.find(p => p.id === e.prospectId),
  })), [envois, campagnes, prospects]);

  const filtered = useMemo(() => enriched.filter(e => {
    if (filterStatut   && e.statut        !== filterStatut)   return false;
    if (filterCampagne && e.campagneId    !== filterCampagne) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.prospectNom?.toLowerCase().includes(q) &&
          !e.prospectEmail?.toLowerCase().includes(q) &&
          !e.campagneNom?.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [enriched, filterStatut, filterCampagne, search]);

  // Stats globales
  const stats = useMemo(() => {
    const s = { envoye: 0, relance1: 0, relance2: 0, repondu: 0, termine: 0 };
    envois.forEach(e => { if (s[e.statut] !== undefined) s[e.statut]++; });
    return s;
  }, [envois]);

  const hasFilter = filterStatut || filterCampagne || search;

  // Grouper par campagne pour l'affichage
  const parCampagne = useMemo(() => {
    const groups = {};
    filtered.forEach(e => {
      const key = e.campagneId || 'unknown';
      if (!groups[key]) groups[key] = { nom: e.campagneNom, type: e.campagne?.type, items: [] };
      groups[key].items.push(e);
    });
    return Object.values(groups);
  }, [filtered]);

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(ENVOI_STATUTS).map(([k, v]) => (
          <div key={k}
            style={{
              background: filterStatut === k ? v.bg : 'var(--bg-card)',
              border: `1px solid ${filterStatut === k ? v.color : 'var(--border)'}`,
              borderRadius: 10, padding: '8px 16px',
              display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer',
              transition: 'all .2s',
            }}
            onClick={() => setFilterStatut(filterStatut === k ? '' : k)}
          >
            <span>{v.icon}</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: v.color }}>{stats[k] || 0}</span>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{v.label}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Nom, email, campagne…"
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <select className="filter-select" value={filterCampagne}
          onChange={e => setFilterCampagne(e.target.value)}>
          <option value="">Toutes les campagnes</option>
          {campagnes.map(c => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
        {hasFilter && (
          <button className="filter-reset"
            onClick={() => { setSearch(''); setFilterStatut(''); setFilterCampagne(''); }}>
            Réinitialiser
          </button>
        )}
      </div>

      {envois.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📬</div>
          <h3>Aucun envoi enregistré</h3>
          <p>
            Les envois apparaîtront ici automatiquement une fois le script Google Apps Script activé.
            Chaque email envoyé (initial + relances) sera tracké ici.
          </p>
          <div className="info-box blue" style={{ marginTop: 16, textAlign: 'left' }}>
            <strong>Pour activer l'automatisation :</strong> suivez les instructions dans le fichier
            <code style={{ background: 'rgba(96,165,250,.15)', padding: '1px 6px', borderRadius: 4, marginLeft: 4 }}>
              campagnes/automation/SETUP.md
            </code>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>Aucun résultat</h3>
          <p>Modifiez vos filtres.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {parCampagne.map((grp, gi) => {
            const type = CAMPAGNE_TYPES[grp.type] || { icon: '📧', label: '', color: '#9ca3c0' };
            return (
              <div key={gi}>
                <div className="dash-section-title">
                  {type.icon} {grp.nom}
                  <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 8 }}>
                    — {grp.items.length} envoi{grp.items.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {grp.items.map(e => {
                    const st    = ENVOI_STATUTS[e.statut] || ENVOI_STATUTS.envoye;
                    const jours = e.envoye1At ? daysSince(e.envoye1At) : null;
                    return (
                      <div key={e.id} style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 'var(--rs)', padding: '12px 16px',
                        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
                      }}>
                        {/* Avatar */}
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: 'linear-gradient(135deg,var(--purple),var(--blue))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, color: '#fff', fontSize: 15,
                        }}>
                          {e.prospectNom?.[0]?.toUpperCase() || '?'}
                        </div>

                        {/* Info prospect */}
                        <div style={{ flex: 1, minWidth: 180 }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{e.prospectNom}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{e.prospectEmail}</div>
                        </div>

                        {/* Timeline envois */}
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11 }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--text-dim)', marginBottom: 2 }}>Email initial</div>
                            <div style={{ fontWeight: 700, color: e.envoye1At ? 'var(--blue)' : 'var(--text-dim)' }}>
                              {e.envoye1At ? fmtDate(e.envoye1At) : '—'}
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--text-dim)', marginBottom: 2 }}>Relance 1</div>
                            <div style={{ fontWeight: 700, color: e.relance1At ? 'var(--yellow)' : 'var(--text-dim)' }}>
                              {e.relance1At ? fmtDate(e.relance1At) : '—'}
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--text-dim)', marginBottom: 2 }}>Relance 2</div>
                            <div style={{ fontWeight: 700, color: e.relance2At ? 'var(--orange)' : 'var(--text-dim)' }}>
                              {e.relance2At ? fmtDate(e.relance2At) : '—'}
                            </div>
                          </div>
                          {jours !== null && (
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ color: 'var(--text-dim)', marginBottom: 2 }}>Âge</div>
                              <div style={{ fontWeight: 700, color: jours > 14 ? 'var(--red)' : jours > 7 ? 'var(--yellow)' : 'var(--green)' }}>
                                {jours}j
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Statut + actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="badge" style={{ color: st.color, background: st.bg }}>
                            {st.icon} {st.label}
                          </span>
                          {e.statut !== 'repondu' && e.statut !== 'termine' && (
                            <button className="btn-icon success"
                              title="Marquer comme répondu"
                              onClick={() => onMarquerRepondu(e.id)}>
                              ✅
                            </button>
                          )}
                          {e.statut !== 'termine' && (
                            <button className="btn-icon"
                              title="Arrêter les relances"
                              style={{ fontSize: 13 }}
                              onClick={() => onMarquerTermine(e.id)}>
                              🗄️
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
