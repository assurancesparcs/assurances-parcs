import { useState, useMemo } from 'react';
import { CAMPAGNE_TYPES, CAMPAGNE_STATUTS, CAMPAGNE_RECURRENCES, fmtDate } from '../data.js';

function StatusSelect({ statut, onChange }) {
  return (
    <select
      className="filter-select"
      style={{ fontSize: 11, padding: '3px 7px', borderRadius: 6 }}
      value={statut}
      onChange={e => onChange(e.target.value)}
      onClick={e => e.stopPropagation()}
    >
      {Object.entries(CAMPAGNE_STATUTS).map(([k, v]) => (
        <option key={k} value={k}>{v.label}</option>
      ))}
    </select>
  );
}

function StatsCampagne({ campagneId, envois }) {
  const stats = useMemo(() => {
    const mine = (envois || []).filter(e => e.campagneId === campagneId);
    if (mine.length === 0) return null;
    const repondus  = mine.filter(e => e.statut === 'repondu').length;
    const enCours   = mine.filter(e => ['envoye','relance1','relance2'].includes(e.statut)).length;
    const taux      = Math.round((repondus / mine.length) * 100);
    const delais    = mine.filter(e => e.reponduAt && e.envoye1At)
      .map(e => Math.floor((new Date(e.reponduAt) - new Date(e.envoye1At)) / 86400000));
    const delaiMoyen = delais.length ? Math.round(delais.reduce((a,b) => a+b,0) / delais.length) : null;
    return { total: mine.length, repondus, enCours, taux, delaiMoyen };
  }, [campagneId, envois]);

  if (!stats) return null;

  return (
    <div style={{
      display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6,
      paddingTop: 8, borderTop: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
        <span style={{ fontWeight: 700, color: 'var(--blue)' }}>{stats.total}</span> suivi{stats.total > 1 ? 's' : ''}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
        <span style={{ fontWeight: 700, color: 'var(--green)' }}>{stats.repondus}</span> réponse{stats.repondus > 1 ? 's' : ''}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
        <span style={{ fontWeight: 700, color: 'var(--orange)' }}>{stats.taux}%</span> taux réponse
      </div>
      {stats.enCours > 0 && (
        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
          <span style={{ fontWeight: 700, color: 'var(--yellow)' }}>{stats.enCours}</span> en attente
        </div>
      )}
      {stats.delaiMoyen !== null && (
        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
          délai moyen <span style={{ fontWeight: 700, color: 'var(--purple)' }}>{stats.delaiMoyen}j</span>
        </div>
      )}
    </div>
  );
}

export default function CampagnesList({
  campagnes, prospects, envois,
  onEdit, onDelete, onDuplicate, onChangeStatut, onNew,
}) {
  const [search, setSearch]         = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  const filtered = useMemo(() => campagnes.filter(c => {
    if (filterType   && c.type   !== filterType)   return false;
    if (filterStatut && c.statut !== filterStatut) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.nom?.toLowerCase().includes(q) &&
          !c.template?.sujet?.toLowerCase().includes(q) &&
          !c.notes?.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [campagnes, search, filterType, filterStatut]);

  const stats = useMemo(() => {
    const totalEnvois  = (envois || []).length;
    const totalRepondus = (envois || []).filter(e => e.statut === 'repondu').length;
    return {
      actives:    campagnes.filter(c => c.statut === 'active').length,
      planifiees: campagnes.filter(c => c.statut === 'planifiee').length,
      terminees:  campagnes.filter(c => c.statut === 'terminee').length,
      envoyes:    campagnes.reduce((a, c) => a + (c.envoye || 0), 0),
      tauxReponse: totalEnvois > 0 ? Math.round((totalRepondus / totalEnvois) * 100) : null,
    };
  }, [campagnes, envois]);

  const nbCibles = (c) => {
    if (c.cibles?.tous) return prospects.length;
    return (c.cibles?.prospectIds || []).length;
  };

  const hasFilter = filterType || filterStatut || search;

  return (
    <div>
      {/* Mini stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Actives',       val: stats.actives,    color: 'var(--green)'  },
          { label: 'Planifiées',    val: stats.planifiees, color: 'var(--blue)'   },
          { label: 'Terminées',     val: stats.terminees,  color: 'var(--text-dim)'},
          { label: 'Envoyés',       val: stats.envoyes,    color: 'var(--orange)' },
          ...(stats.tauxReponse !== null ? [{ label: 'Taux réponse', val: stats.tauxReponse + '%', color: 'var(--green)' }] : []),
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '8px 16px', display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <span style={{ fontWeight: 900, fontSize: 18, color: s.color }}>{s.val}</span>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Rechercher une campagne…"
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">Tous les types</option>
          {Object.entries(CAMPAGNE_TYPES).map(([k, v]) => (
            <option key={k} value={k}>{v.icon} {v.label}</option>
          ))}
        </select>
        <select className="filter-select" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
          <option value="">Tous les statuts</option>
          {Object.entries(CAMPAGNE_STATUTS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        {hasFilter && (
          <button className="filter-reset" onClick={() => { setSearch(''); setFilterType(''); setFilterStatut(''); }}>
            Réinitialiser
          </button>
        )}
        <button className="btn-primary" style={{ marginLeft: 'auto' }} onClick={() => onNew()}>
          + Nouvelle campagne
        </button>
      </div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📧</div>
          <h3>{hasFilter ? 'Aucune campagne trouvée' : 'Aucune campagne créée'}</h3>
          <p>{hasFilter
            ? 'Modifiez vos filtres pour voir d\'autres résultats.'
            : 'Créez votre première campagne d\'emailing ciblant les audioprothésistes.'}
          </p>
          {!hasFilter && <button className="btn-primary" onClick={() => onNew()}>+ Créer une campagne</button>}
        </div>
      ) : (
        <div className="campagnes-grid">
          {filtered.map(c => {
            const type   = CAMPAGNE_TYPES[c.type]     || { icon: '📧', label: c.type, color: '#9ca3c0' };
            const statut = CAMPAGNE_STATUTS[c.statut] || CAMPAGNE_STATUTS.brouillon;
            const cibles = nbCibles(c);
            const dateStr = c.planification?.dateEnvoi
              ? new Date(c.planification.dateEnvoi).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
              : null;
            const recurrence = c.planification?.recurrence !== 'unique'
              ? CAMPAGNE_RECURRENCES[c.planification?.recurrence]
              : null;

            return (
              <div
                key={c.id}
                className="campagne-card"
                style={{ '--type-color': type.color, '--type-bg': type.color + '18' }}
                onClick={() => onEdit(c)}
              >
                <div className="campagne-card-top">
                  <div className="campagne-type-chip">
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </div>
                  <span className="badge" style={{ color: statut.color, background: statut.bg }}>
                    {statut.label}
                  </span>
                </div>

                <div className="campagne-nom">{c.nom || '(Sans titre)'}</div>
                {c.template?.sujet && (
                  <div className="campagne-sujet">✉️ {c.template.sujet}</div>
                )}

                <div className="campagne-footer">
                  <div className="campagne-meta-pill">👥 {cibles} dest.</div>
                  {dateStr && (
                    <div className="campagne-meta-pill">
                      📅 {dateStr}{recurrence ? ` · ${recurrence}` : ''}
                    </div>
                  )}
                  {c.envoye > 0 && (
                    <div className="campagne-meta-pill" style={{ color: 'var(--green)', background: 'rgba(52,211,153,.08)' }}>
                      ✅ {c.envoye} envoyé{c.envoye > 1 ? 's' : ''}
                    </div>
                  )}
                  <div className="campagne-actions-bar">
                    <StatusSelect statut={c.statut} onChange={st => onChangeStatut(c.id, st)} />
                    <button className="btn-icon success" title="Dupliquer"
                      onClick={e => { e.stopPropagation(); onDuplicate(c); }}>📋</button>
                    <button className="btn-icon danger" title="Supprimer"
                      onClick={e => { e.stopPropagation(); onDelete(c.id); }}>🗑️</button>
                  </div>
                </div>

                {c.notes && (
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4 }}>
                    📝 {c.notes.slice(0, 80)}{c.notes.length > 80 ? '…' : ''}
                  </div>
                )}
                <StatsCampagne campagneId={c.id} envois={envois} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
