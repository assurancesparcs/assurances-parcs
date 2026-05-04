import { useState, useMemo } from 'react';
import { fmtDate, daysUntil, CONTRACT_TYPES } from '../constants';

function urgencyColor(days) {
  if (days < 0) return '#f87171';
  if (days <= 30) return '#f87171';
  if (days <= 60) return '#fb923c';
  if (days <= 90) return '#fbbf24';
  return '#34d399';
}

function urgencyLabel(days) {
  if (days < 0) return `Échu depuis ${Math.abs(days)}j`;
  if (days === 0) return "Aujourd'hui !";
  return `Dans ${days} j.`;
}

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <span style={{ opacity: .3, fontSize: 10 }}>⇅</span>;
  return <span style={{ fontSize: 10 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>;
}

export default function ContractsView({ contracts, clients, onAdd, onEdit, onDelete, onTogglePaid, onImport }) {
  const [filter, setFilter]       = useState('tous');
  const [search, setSearch]       = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode]   = useState('vignette'); // 'vignette' | 'liste'
  const [sortCol, setSortCol]     = useState('days');
  const [sortDir, setSortDir]     = useState('asc');

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let list = contracts.map(c => ({ ...c, days: daysUntil(c.dateEcheance) }));
    if (filter === 'urgents')   list = list.filter(c => !c.primePayee && c.days !== null && c.days <= 90);
    if (filter === 'non_payes') list = list.filter(c => !c.primePayee);
    if (filter === 'payes')     list = list.filter(c => c.primePayee);
    if (typeFilter) list = list.filter(c => c.type === typeFilter);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(c =>
        c.clientName?.toLowerCase().includes(s) ||
        c.numero?.toLowerCase().includes(s) ||
        c.type?.toLowerCase().includes(s)
      );
    }

    if (viewMode === 'liste') {
      list.sort((a, b) => {
        let va, vb;
        switch (sortCol) {
          case 'client':  va = (a.clientName || '').toLowerCase(); vb = (b.clientName || '').toLowerCase(); break;
          case 'type':    va = a.type || ''; vb = b.type || ''; break;
          case 'numero':  va = a.numero || ''; vb = b.numero || ''; break;
          case 'prime':   va = Number(a.primeMontant) || 0; vb = Number(b.primeMontant) || 0; break;
          case 'echeance':va = a.days ?? 9999; vb = b.days ?? 9999; break;
          case 'statut':  va = a.primePayee ? 1 : 0; vb = b.primePayee ? 1 : 0; break;
          default:        va = a.days ?? 9999; vb = b.days ?? 9999;
        }
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      list.sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));
    }

    return list;
  }, [contracts, filter, search, typeFilter, viewMode, sortCol, sortDir]);

  const counts = useMemo(() => ({
    urgents:  contracts.filter(c => !c.primePayee && daysUntil(c.dateEcheance) !== null && daysUntil(c.dateEcheance) <= 90).length,
    nonPayes: contracts.filter(c => !c.primePayee).length,
    payes:    contracts.filter(c => c.primePayee).length,
  }), [contracts]);

  const COLS = [
    { key: 'client',   label: 'Client' },
    { key: 'type',     label: 'Type' },
    { key: 'numero',   label: 'N° contrat' },
    { key: 'prime',    label: 'Prime' },
    { key: 'echeance', label: 'Échéance' },
    { key: 'statut',   label: 'Statut' },
  ];

  return (
    <div className="contracts-view">
      <div className="contracts-header">
        <div className="search-wrap" style={{ maxWidth: 280 }}>
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Client, n° contrat…" value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
          {[
            { key: 'tous',      label: `Tous (${contracts.length})` },
            { key: 'urgents',   label: `⚠️ Échéance -90j (${counts.urgents})`, color: '#f87171' },
            { key: 'non_payes', label: `⏳ Non payés (${counts.nonPayes})`,    color: '#fbbf24' },
            { key: 'payes',     label: `✅ Payés (${counts.payes})`,            color: '#34d399' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{
                background: filter === f.key ? (f.color || 'var(--orange)') : 'var(--bg-input)',
                border: `1px solid ${filter === f.key ? (f.color || 'var(--orange)') : 'var(--border)'}`,
                borderRadius: 8, padding: '5px 12px',
                color: filter === f.key ? '#fff' : 'var(--text-muted)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>
              {f.label}
            </button>
          ))}
          <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">Tous types</option>
            {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Basculement vue */}
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

        <button className="btn-secondary" onClick={onImport} style={{ whiteSpace: 'nowrap' }}>📥 Import CSV</button>
        <button className="btn-primary" onClick={onAdd}>+ Nouveau contrat</button>
      </div>

      {!filtered.length ? (
        <div className="empty-state">
          <div style={{ fontSize: 64 }}>📄</div>
          <h3>Aucun contrat</h3>
          <p>Ajoutez vos contrats pour suivre les échéances.</p>
          <button className="btn-primary" onClick={onAdd}>+ Ajouter un contrat</button>
        </div>
      ) : viewMode === 'vignette' ? (
        <div className="contracts-grid">
          {filtered.map(contract => {
            const days = contract.days;
            const color = contract.primePayee ? '#34d399' : urgencyColor(days ?? 999);
            return (
              <div key={contract.id} className="contract-card" onClick={() => onEdit(contract)}
                style={{ borderLeft: `4px solid ${color}` }}>
                <div className="contract-top">
                  <div>
                    <div className="contract-client">{contract.clientName || '—'}</div>
                    <div className="contract-type">{contract.type}</div>
                    {contract.numero && <div className="contract-num">#{contract.numero}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {contract.primeMontant && (
                      <div className="contract-prime">{Number(contract.primeMontant).toLocaleString('fr-FR')} €</div>
                    )}
                    <div className="contract-date" style={{ color }}>
                      📅 {fmtDate(contract.dateEcheance)}
                    </div>
                    {!contract.primePayee && days !== null && (
                      <div className="contract-urgency" style={{ color }}>{urgencyLabel(days)}</div>
                    )}
                  </div>
                </div>
                {contract.notes && <div className="contract-notes">{contract.notes}</div>}
                <div className="contract-footer" onClick={e => e.stopPropagation()}>
                  <button className={`btn-paid ${contract.primePayee ? 'paid' : ''}`}
                    onClick={() => onTogglePaid(contract.id, !contract.primePayee)}>
                    {contract.primePayee ? '✅ Prime payée' : '⏳ Marquer payée'}
                  </button>
                  <button className="btn-icon delete" onClick={() => onDelete(contract.id)}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ─── VUE LISTE ─── */
        <div className="contracts-table-wrap">
          <table className="contracts-table">
            <thead>
              <tr>
                {COLS.map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)}
                    className={`sortable-th ${sortCol === col.key ? 'active' : ''}`}>
                    {col.label} <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />
                  </th>
                ))}
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(contract => {
                const days = contract.days;
                const color = contract.primePayee ? '#34d399' : urgencyColor(days ?? 999);
                return (
                  <tr key={contract.id} className="contracts-table-row"
                    onClick={() => onEdit(contract)}>
                    <td>
                      <span style={{ fontWeight: 700 }}>{contract.clientName || '—'}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--purple)', fontWeight: 600, fontSize: 12 }}>
                        {contract.type || '—'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                      {contract.numero ? `#${contract.numero}` : '—'}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--green)' }}>
                      {contract.primeMontant
                        ? `${Number(contract.primeMontant).toLocaleString('fr-FR')} €`
                        : '—'}
                    </td>
                    <td>
                      <div style={{ fontSize: 12, fontWeight: 600, color }}>
                        {fmtDate(contract.dateEcheance) || '—'}
                      </div>
                      {!contract.primePayee && days !== null && (
                        <div style={{ fontSize: 10, color, marginTop: 2 }}>{urgencyLabel(days)}</div>
                      )}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 12,
                        fontSize: 11, fontWeight: 700,
                        background: contract.primePayee ? 'rgba(52,211,153,.15)' : 'rgba(251,191,36,.15)',
                        color: contract.primePayee ? '#34d399' : '#fbbf24',
                      }}>
                        {contract.primePayee ? '✅ Payée' : '⏳ Non payée'}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button
                          style={{
                            fontSize: 11, padding: '4px 8px', borderRadius: 6, border: 'none',
                            cursor: 'pointer', fontWeight: 700,
                            background: contract.primePayee ? 'rgba(52,211,153,.15)' : 'rgba(251,191,36,.15)',
                            color: contract.primePayee ? '#34d399' : '#fbbf24',
                          }}
                          title={contract.primePayee ? 'Marquer non payée' : 'Marquer payée'}
                          onClick={() => onTogglePaid(contract.id, !contract.primePayee)}>
                          {contract.primePayee ? '↩ Annuler' : '✅ Payée'}
                        </button>
                        <button className="btn-icon delete" title="Supprimer"
                          onClick={() => onDelete(contract.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', padding: '8px 4px' }}>
            {filtered.length} contrat{filtered.length > 1 ? 's' : ''}
            {' — cliquer sur une colonne pour trier, sur une ligne pour modifier'}
          </div>
        </div>
      )}
    </div>
  );
}
