import { useState, useMemo } from 'react';
import { MED_STATUSES, fmtDate } from '../constants';

const ACTIVE_STATUSES = ['en_cours', 'relance_1', 'relance_2', 'mise_en_demeure'];
const CLOSED_STATUSES = ['paye', 'resiliation'];

function fmtTs(ts) {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function MEDCard({ d, onEdit, onDelete, onRelance, onMarkPaye }) {
  const st = MED_STATUSES[d.status] || MED_STATUSES.en_cours;
  const lastRelance = d.relances?.length ? d.relances[d.relances.length - 1] : null;

  return (
    <div className="med-card" onClick={() => onEdit(d)}>
      <div className="med-card-top">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="med-client">{d.clientName || '—'}</div>
          <div className="med-contrat">
            {d.typeContrat && <span>{d.typeContrat}</span>}
            {d.numeroContrat && <span className="med-num">n°{d.numeroContrat}</span>}
          </div>
          {d.moisImport && (
            <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>📅 Import {d.moisImport}</div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span className="med-status-badge" style={{ background: st.bg, color: st.color }}>
            {st.icon} {st.label}
          </span>
          <div className="med-montant">
            💰 <strong>{d.montantDu ? Number(d.montantDu).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €' : '—'}</strong>
          </div>
        </div>
      </div>
      {d.clientEmail && (
        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
          ✉️ {d.clientEmail}
          {d.clientPhone && <span style={{ marginLeft: 10 }}>📞 {d.clientPhone}</span>}
        </div>
      )}
      {lastRelance && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: '#34d399' }}>✅</span>
          Dernière relance : {fmtTs(lastRelance.date)}
          {lastRelance.template && (
            <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>
              — {lastRelance.template === 'relance_1_cb' ? 'Relance 1' : lastRelance.template === 'relance_2' ? 'Relance 2' : 'MED'}
            </span>
          )}
          {d.relances.length > 1 && <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>({d.relances.length} courriers)</span>}
        </div>
      )}
      {d.notes && <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 6, fontStyle: 'italic' }}>{d.notes}</div>}
      <div className="med-footer" onClick={e => e.stopPropagation()}>
        {!CLOSED_STATUSES.includes(d.status) && (
          <button className="btn-paye" onClick={() => onMarkPaye(d.id)}>✅ Marquer payé</button>
        )}
        <button className="btn-icon" title="Courrier / Relance" onClick={() => onRelance(d)}>✉️</button>
        <button className="btn-icon delete" title="Supprimer" onClick={() => onDelete(d.id)}>🗑️</button>
      </div>
    </div>
  );
}

function MEDRow({ d, onEdit, onDelete, onRelance, onMarkPaye }) {
  const st = MED_STATUSES[d.status] || MED_STATUSES.en_cours;
  const lastRelance = d.relances?.length ? d.relances[d.relances.length - 1] : null;

  return (
    <tr className="contracts-table-row" onClick={() => onEdit(d)}>
      <td style={{ fontWeight: 700 }}>{d.clientName || '—'}</td>
      <td style={{ fontSize: 12, color: 'var(--purple)', fontWeight: 600 }}>{d.typeContrat || '—'}</td>
      <td style={{ fontSize: 12, color: 'var(--text-dim)' }}>{d.numeroContrat ? `n°${d.numeroContrat}` : '—'}</td>
      <td style={{ fontWeight: 700, color: '#f87171' }}>
        {d.montantDu ? Number(d.montantDu).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €' : '—'}
      </td>
      <td>
        <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700,
          background: st.bg, color: st.color }}>
          {st.icon} {st.label}
        </span>
      </td>
      <td style={{ fontSize: 11, color: 'var(--text-dim)' }}>
        {lastRelance ? (
          <>
            {fmtTs(lastRelance.date)}
            <span style={{ marginLeft: 4, fontSize: 10 }}>
              ({d.relances.length} courrier{d.relances.length > 1 ? 's' : ''})
            </span>
          </>
        ) : '—'}
      </td>
      <td onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {!CLOSED_STATUSES.includes(d.status) && (
            <button style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, border: 'none',
              cursor: 'pointer', fontWeight: 700,
              background: 'rgba(52,211,153,.15)', color: '#34d399' }}
              onClick={() => onMarkPaye(d.id)}>✅ Payé</button>
          )}
          <button className="btn-icon" title="Courrier" onClick={() => onRelance(d)}>✉️</button>
          <button className="btn-icon delete" title="Supprimer" onClick={() => onDelete(d.id)}>🗑️</button>
        </div>
      </td>
    </tr>
  );
}

export default function MEDView({ dossiers, onAdd, onEdit, onDelete, onRelance, onMarkPaye, onImport }) {
  const [tab, setTab]             = useState('actifs');
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode]   = useState('vignette');

  const filtered = useMemo(() => {
    let list = tab === 'actifs'
      ? dossiers.filter(d => ACTIVE_STATUSES.includes(d.status))
      : tab === 'clotures'
        ? dossiers.filter(d => CLOSED_STATUSES.includes(d.status))
        : dossiers;
    if (statusFilter) list = list.filter(d => d.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.clientName?.toLowerCase().includes(q) ||
        d.numeroContrat?.toLowerCase().includes(q) ||
        d.clientEmail?.toLowerCase().includes(q) ||
        d.typeContrat?.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      const da = (a.updatedAt?.toDate?.() || new Date(a.updatedAt || 0)).getTime();
      const db = (b.updatedAt?.toDate?.() || new Date(b.updatedAt || 0)).getTime();
      return db - da;
    });
  }, [dossiers, tab, statusFilter, search]);

  const counts = useMemo(() => {
    const actifs   = dossiers.filter(d => ACTIVE_STATUSES.includes(d.status)).length;
    const clotures = dossiers.filter(d => CLOSED_STATUSES.includes(d.status)).length;
    const aRelancer = dossiers.filter(d => d.status === 'en_cours' || d.status === 'relance_1').length;
    const montantTotal = dossiers
      .filter(d => ACTIVE_STATUSES.includes(d.status))
      .reduce((acc, d) => acc + (Number(d.montantDu) || 0), 0);
    return { actifs, clotures, aRelancer, montantTotal };
  }, [dossiers]);

  const fmtEur = (n) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';

  return (
    <div className="med-view">
      {/* KPIs */}
      <div className="med-kpis">
        {[
          { label: 'Dossiers actifs',  value: counts.actifs,    color: '#60a5fa' },
          { label: 'À relancer',       value: counts.aRelancer, color: counts.aRelancer > 0 ? '#fbbf24' : 'var(--text-dim)' },
          { label: 'Clos / Total',     value: `${counts.clotures}/${dossiers.length}`, color: 'var(--text-muted)' },
          { label: 'Encours impayés',  value: fmtEur(counts.montantTotal), color: '#f87171' },
        ].map(k => (
          <div key={k.label} className="med-kpi">
            <div className="med-kpi-value" style={{ color: k.color }}>{k.value}</div>
            <div className="med-kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="med-header">
        <div className="search-wrap" style={{ maxWidth: 260 }}>
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Client, n° contrat…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { key: 'actifs',   label: `Actifs (${counts.actifs})` },
            { key: 'clotures', label: `Clos (${counts.clotures})` },
            { key: 'tous',     label: `Tous (${dossiers.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                background: tab === t.key ? '#f87171' : 'var(--bg-input)',
                border: `1px solid ${tab === t.key ? '#f87171' : 'var(--border)'}`,
                borderRadius: 8, padding: '5px 12px',
                color: tab === t.key ? '#fff' : 'var(--text-muted)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Tous statuts</option>
          {Object.entries(MED_STATUSES).map(([k, v]) => (
            <option key={k} value={k}>{v.icon} {v.label}</option>
          ))}
        </select>

        {/* Toggle vignette / liste */}
        <div style={{ display: 'flex', gap: 2, background: 'var(--bg-input)', borderRadius: 8, padding: 3 }}>
          {[
            { mode: 'vignette', icon: '⊞', title: 'Vue vignettes' },
            { mode: 'liste',    icon: '☰', title: 'Vue liste' },
          ].map(v => (
            <button key={v.mode} title={v.title} onClick={() => setViewMode(v.mode)}
              style={{
                background: viewMode === v.mode ? '#f87171' : 'transparent',
                border: 'none', borderRadius: 6, padding: '5px 10px',
                color: viewMode === v.mode ? '#fff' : 'var(--text-muted)',
                fontSize: 16, cursor: 'pointer', lineHeight: 1,
              }}>
              {v.icon}
            </button>
          ))}
        </div>

        <button className="btn-secondary" onClick={onImport} style={{ fontSize: 12, padding: '6px 14px' }}>
          📥 Import mensuel
        </button>
        <button className="btn-primary" style={{ background: '#f87171', borderColor: '#f87171' }} onClick={onAdd}>
          + Ajouter dossier
        </button>
      </div>

      {/* Contenu */}
      {!filtered.length ? (
        <div className="empty-state">
          <div style={{ fontSize: 64 }}>📬</div>
          <h3>Aucun dossier{tab !== 'tous' ? ' dans cet onglet' : ''}</h3>
          <p>{tab === 'actifs' ? "Tous les dossiers sont clôturés ou aucun n'a été ajouté." : 'Aucun résultat pour ces filtres.'}</p>
          <button className="btn-primary" style={{ background: '#f87171' }} onClick={onAdd}>+ Ajouter un dossier</button>
        </div>
      ) : viewMode === 'vignette' ? (
        <div className="med-grid">
          {filtered.map(d => (
            <MEDCard key={d.id} d={d} onEdit={onEdit} onDelete={onDelete} onRelance={onRelance} onMarkPaye={onMarkPaye} />
          ))}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="contracts-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Type contrat</th>
                <th>N° contrat</th>
                <th>Montant dû</th>
                <th>Statut</th>
                <th>Dernière relance</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <MEDRow key={d.id} d={d} onEdit={onEdit} onDelete={onDelete} onRelance={onRelance} onMarkPaye={onMarkPaye} />
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', padding: '8px 4px' }}>
            {filtered.length} dossier{filtered.length > 1 ? 's' : ''}
            {' — cliquer sur une ligne pour modifier'}
          </div>
        </div>
      )}
    </div>
  );
}
