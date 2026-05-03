import { useState, useMemo } from 'react';
import { daysUntil, echeanceUrgence, fmtDate } from '../constants';

function UrgenceBadge({ jours }) {
  const u = echeanceUrgence(jours);
  if (!u) return null;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: u.bg, color: u.color, whiteSpace: 'nowrap' }}>
      {jours < 0 ? '⛔ Échu' : jours === 0 ? '🔴 Aujourd\'hui' : `${jours}j`}
    </span>
  );
}

function ContratRow({ c, onRelance, onRenew }) {
  const jours = daysUntil(c.dateEcheance);
  const u     = echeanceUrgence(jours);
  const lastRelance = c.relancesRenouvellement?.slice(-1)[0];

  const fmtTs = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  return (
    <div className="echeance-row" style={{ borderLeft: `3px solid ${u?.color || 'var(--border)'}` }}>
      <div className="echeance-row-main">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="echeance-client">{c.clientName || '—'}</div>
          <div className="echeance-type">
            {c.type && <span>{c.type}</span>}
            {c.numero && <span className="echeance-num">n°{c.numero}</span>}
          </div>
          {lastRelance && (
            <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 3 }}>
              ✅ Dernière relance : {fmtTs(lastRelance.date)}
              {c.relancesRenouvellement.length > 1 && ` (${c.relancesRenouvellement.length} envoyées)`}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <UrgenceBadge jours={jours} />
          <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
            📅 {fmtDate(c.dateEcheance) || '—'}
          </div>
          {c.primePayee
            ? <span style={{ fontSize: 10, color: '#34d399', fontWeight: 700 }}>✅ Prime payée</span>
            : <span style={{ fontSize: 10, color: '#f87171', fontWeight: 700 }}>❌ Prime impayée</span>
          }
        </div>
      </div>
      <div className="echeance-row-actions" onClick={e => e.stopPropagation()}>
        <button className="btn-icon" title="Envoyer un courrier de renouvellement" onClick={() => onRelance(c)}>✉️</button>
        <button className="btn-renew" onClick={() => onRenew(c)}>🔄 Renouvelé</button>
      </div>
    </div>
  );
}

export default function EcheancesView({ contracts, onRelance, onRenew }) {
  const [tab, setTab]       = useState('urgents');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const withEcheance = useMemo(() =>
    contracts
      .filter(c => c.dateEcheance)
      .map(c => ({ ...c, _jours: daysUntil(c.dateEcheance) }))
      .filter(c => c._jours !== null && c._jours <= 90)
      .sort((a, b) => a._jours - b._jours),
    [contracts]
  );

  const filtered = useMemo(() => {
    let list = tab === 'urgents'
      ? withEcheance.filter(c => c._jours <= 30)
      : tab === 'attention'
        ? withEcheance.filter(c => c._jours > 30 && c._jours <= 90)
        : withEcheance;

    if (typeFilter) list = list.filter(c => c.type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.clientName?.toLowerCase().includes(q) ||
        c.numero?.toLowerCase().includes(q) ||
        c.type?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [withEcheance, tab, typeFilter, search]);

  const counts = useMemo(() => ({
    echus:    withEcheance.filter(c => c._jours < 0).length,
    critique: withEcheance.filter(c => c._jours >= 0 && c._jours <= 15).length,
    urgent:   withEcheance.filter(c => c._jours > 15 && c._jours <= 30).length,
    attention:withEcheance.filter(c => c._jours > 30 && c._jours <= 60).length,
    ok:       withEcheance.filter(c => c._jours > 60 && c._jours <= 90).length,
  }), [withEcheance]);

  const types = useMemo(() =>
    [...new Set(contracts.filter(c => c.type).map(c => c.type))].sort(),
    [contracts]
  );

  return (
    <div className="echeances-view">

      {/* KPIs */}
      <div className="echeances-kpis">
        {[
          { label: 'Échus',       value: counts.echus,    color: '#6b7494' },
          { label: '< 15 jours',  value: counts.critique, color: '#f87171' },
          { label: '< 30 jours',  value: counts.urgent,   color: '#fb923c' },
          { label: '< 60 jours',  value: counts.attention,color: '#fbbf24' },
          { label: '< 90 jours',  value: counts.ok,       color: '#60a5fa' },
        ].map(k => (
          <div key={k.label} className="echeance-kpi">
            <div className="echeance-kpi-value" style={{ color: k.color }}>{k.value}</div>
            <div className="echeance-kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="echeances-header">
        <div className="search-wrap" style={{ maxWidth: 260 }}>
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Client, n° contrat…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { key: 'urgents',   label: `🔴 Urgents ≤ 30j (${counts.echus + counts.critique + counts.urgent})` },
            { key: 'attention', label: `🟡 À venir 31–90j (${counts.attention + counts.ok})` },
            { key: 'tous',      label: `Tous (${withEcheance.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                background: tab === t.key ? 'var(--orange)' : 'var(--bg-input)',
                border: `1px solid ${tab === t.key ? 'var(--orange)' : 'var(--border)'}`,
                borderRadius: 8, padding: '5px 12px',
                color: tab === t.key ? '#fff' : 'var(--text-muted)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">Tous types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Liste */}
      {!withEcheance.length ? (
        <div className="empty-state">
          <div style={{ fontSize: 64 }}>📅</div>
          <h3>Aucun contrat avec échéance dans les 90 jours</h3>
          <p>Les contrats arrivant à échéance apparaîtront ici automatiquement.</p>
        </div>
      ) : !filtered.length ? (
        <div className="empty-state">
          <div style={{ fontSize: 48 }}>✅</div>
          <h3>Aucun contrat dans cet onglet</h3>
          <p>Tous les contrats urgents ont été traités.</p>
        </div>
      ) : (
        <div className="echeances-list">
          {filtered.map(c => (
            <ContratRow key={c.id} c={c} onRelance={onRelance} onRenew={onRenew} />
          ))}
        </div>
      )}
    </div>
  );
}
