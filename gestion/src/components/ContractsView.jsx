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
  if (days <= 30) return `Dans ${days} jour${days > 1 ? 's' : ''}`;
  if (days <= 60) return `Dans ${days} jours`;
  if (days <= 90) return `Dans ${days} jours`;
  return `Dans ${days} jours`;
}

export default function ContractsView({ contracts, clients, onAdd, onEdit, onDelete, onTogglePaid }) {
  const [filter, setFilter] = useState('tous');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = useMemo(() => {
    let list = contracts.map(c => ({ ...c, days: daysUntil(c.dateEcheance) }));
    if (filter === 'urgents') list = list.filter(c => !c.primePayee && c.days !== null && c.days <= 90);
    if (filter === 'non_payes') list = list.filter(c => !c.primePayee);
    if (filter === 'payes') list = list.filter(c => c.primePayee);
    if (typeFilter) list = list.filter(c => c.type === typeFilter);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(c => c.clientName?.toLowerCase().includes(s) || c.numero?.toLowerCase().includes(s) || c.type?.toLowerCase().includes(s));
    }
    return list.sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));
  }, [contracts, filter, search, typeFilter]);

  const counts = useMemo(() => ({
    urgents: contracts.filter(c => !c.primePayee && daysUntil(c.dateEcheance) !== null && daysUntil(c.dateEcheance) <= 90).length,
    nonPayes: contracts.filter(c => !c.primePayee).length,
    payes: contracts.filter(c => c.primePayee).length,
  }), [contracts]);

  return (
    <div className="contracts-view">
      <div className="contracts-header">
        <div className="search-wrap" style={{ maxWidth: 300 }}>
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Client, n° contrat…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
          {[
            { key: 'tous', label: `Tous (${contracts.length})` },
            { key: 'urgents', label: `⚠️ Échéance -90j (${counts.urgents})`, color: '#f87171' },
            { key: 'non_payes', label: `⏳ Non payés (${counts.nonPayes})`, color: '#fbbf24' },
            { key: 'payes', label: `✅ Payés (${counts.payes})`, color: '#34d399' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{
                background: filter === f.key ? (f.color || 'var(--orange)') : 'var(--bg-input)',
                border: `1px solid ${filter === f.key ? (f.color || 'var(--orange)') : 'var(--border)'}`,
                borderRadius: 8, padding: '5px 12px', color: filter === f.key ? '#fff' : 'var(--text-muted)',
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
        <button className="btn-primary" onClick={onAdd}>+ Nouveau contrat</button>
      </div>

      {!filtered.length ? (
        <div className="empty-state">
          <div style={{ fontSize: 64 }}>📄</div>
          <h3>Aucun contrat</h3>
          <p>Ajoutez vos contrats pour suivre les échéances.</p>
          <button className="btn-primary" onClick={onAdd}>+ Ajouter un contrat</button>
        </div>
      ) : (
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
                  <button
                    className={`btn-paid ${contract.primePayee ? 'paid' : ''}`}
                    onClick={() => onTogglePaid(contract.id, !contract.primePayee)}>
                    {contract.primePayee ? '✅ Prime payée' : '⏳ Marquer payée'}
                  </button>
                  <button className="btn-icon delete" onClick={() => onDelete(contract.id)}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
