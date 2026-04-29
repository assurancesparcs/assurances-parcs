import { useState, useMemo } from 'react';
import { SINISTRE_TYPES, SINISTRE_STATUSES, fmtDate, INACTIVITE_ALERTE_JOURS } from '../constants';

function daysSince(ts) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

function PiecesBar({ pieces }) {
  if (!pieces?.length) return null;
  const recu = pieces.filter(p => p.recu).length;
  const pct = Math.round((recu / pieces.length) * 100);
  const color = pct === 100 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#f87171';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: 'var(--bg-input)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width .3s' }} />
      </div>
      <span style={{ fontSize: 10, color, fontWeight: 700, whiteSpace: 'nowrap' }}>{recu}/{pieces.length}</span>
    </div>
  );
}

function SinistreCard({ s, onEdit, onDelete, onStatusChange }) {
  const st = SINISTRE_STATUSES[s.status] || SINISTRE_STATUSES.declare;
  const tp = SINISTRE_TYPES[s.type] || SINISTRE_TYPES.autre;
  const inactif = daysSince(s.lastActivityAt || s.updatedAt);
  const isInactif = inactif !== null && inactif >= INACTIVITE_ALERTE_JOURS
    && s.status !== 'cloture' && s.status !== 'indemnise' && s.status !== 'refuse';

  return (
    <div
      className={`sinistre-card${isInactif ? ' sinistre-inactif' : ''}`}
      style={{ borderLeft: `4px solid ${tp.color}` }}
      onClick={() => onEdit(s)}
    >
      {isInactif && (
        <div className="sinistre-inactif-badge">⏰ Inactif depuis {inactif}j</div>
      )}

      <div className="sinistre-top">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sinistre-client">{s.clientName || '—'}</div>
          <div className="sinistre-type">
            <span style={{ color: tp.color }}>{tp.icon} {tp.label}</span>
            {s.numero && <span className="sinistre-num">#{s.numero}</span>}
          </div>
          {s.compagnie && <div className="sinistre-compagnie">🏢 {s.compagnie}</div>}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span className="sinistre-status-badge" style={{ background: st.bg, color: st.color }}>
            {st.icon} {st.label}
          </span>
          {s.dateSinistre && (
            <div className="sinistre-date">📅 {fmtDate(s.dateSinistre)}</div>
          )}
        </div>
      </div>

      {s.description && (
        <div className="sinistre-desc">{s.description}</div>
      )}

      <div className="sinistre-mid">
        {s.montantEstime ? (
          <span className="sinistre-montant">
            Estimé : <strong>{Number(s.montantEstime).toLocaleString('fr-FR')} €</strong>
          </span>
        ) : null}
        {s.montantIndemnise ? (
          <span className="sinistre-montant indemnise">
            Indemnisé : <strong>{Number(s.montantIndemnise).toLocaleString('fr-FR')} €</strong>
          </span>
        ) : null}
        {s.assignedTo && (
          <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 'auto' }}>👤 {s.assignedTo}</span>
        )}
      </div>

      {s.pieces?.length > 0 && <PiecesBar pieces={s.pieces} />}

      <div className="sinistre-footer" onClick={e => e.stopPropagation()}>
        <select
          className="status-select"
          value={s.status}
          onChange={e => onStatusChange(s.id, e.target.value)}
          style={{ color: st.color, borderColor: st.color + '55' }}
        >
          {Object.entries(SINISTRE_STATUSES).map(([k, v]) => (
            <option key={k} value={k}>{v.icon} {v.label}</option>
          ))}
        </select>
        <button className="btn-icon delete" onClick={() => onDelete(s.id)}>🗑️</button>
      </div>
    </div>
  );
}

const ACTIVE_STATUSES = ['declare', 'en_instruction', 'attente_pieces', 'expertise'];

export default function SinistresView({ sinistres, clients, contracts, onAdd, onEdit, onDelete, onStatusChange }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tab, setTab] = useState('actifs');

  const filtered = useMemo(() => {
    let list = tab === 'actifs'
      ? sinistres.filter(s => ACTIVE_STATUSES.includes(s.status))
      : tab === 'clotures'
        ? sinistres.filter(s => ['cloture', 'indemnise', 'refuse'].includes(s.status))
        : sinistres;

    if (typeFilter) list = list.filter(s => s.type === typeFilter);
    if (statusFilter) list = list.filter(s => s.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.clientName?.toLowerCase().includes(q) ||
        s.numero?.toLowerCase().includes(q) ||
        s.compagnie?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      const da = (a.updatedAt?.toDate?.() || new Date(a.updatedAt || 0)).getTime();
      const db = (b.updatedAt?.toDate?.() || new Date(b.updatedAt || 0)).getTime();
      return db - da;
    });
  }, [sinistres, tab, typeFilter, statusFilter, search]);

  const counts = useMemo(() => ({
    actifs: sinistres.filter(s => ACTIVE_STATUSES.includes(s.status)).length,
    inactifs: sinistres.filter(s => {
      const j = daysSince(s.lastActivityAt || s.updatedAt);
      return j !== null && j >= INACTIVITE_ALERTE_JOURS && ACTIVE_STATUSES.includes(s.status);
    }).length,
    attentePieces: sinistres.filter(s => s.status === 'attente_pieces').length,
    clotures: sinistres.filter(s => ['cloture', 'indemnise', 'refuse'].includes(s.status)).length,
  }), [sinistres]);

  return (
    <div className="sinistres-view">

      {/* KPIs */}
      <div className="sinistres-kpis">
        {[
          { label: 'Sinistres actifs', value: counts.actifs, color: 'var(--blue)' },
          { label: `Inactifs +${INACTIVITE_ALERTE_JOURS}j`, value: counts.inactifs, color: counts.inactifs > 0 ? 'var(--red)' : 'var(--text-dim)' },
          { label: 'Attente pièces', value: counts.attentePieces, color: 'var(--yellow)' },
          { label: 'Clôturés / Total', value: `${counts.clotures}/${sinistres.length}`, color: 'var(--text-muted)' },
        ].map(k => (
          <div key={k.label} className="sinistre-kpi">
            <div className="sinistre-kpi-value" style={{ color: k.color }}>{k.value}</div>
            <div className="sinistre-kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Header toolbar */}
      <div className="sinistres-header">
        <div className="search-wrap" style={{ maxWidth: 300 }}>
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Client, n°, compagnie…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
          {[
            { key: 'actifs',   label: `En cours (${counts.actifs})` },
            { key: 'clotures', label: `Clôturés (${counts.clotures})` },
            { key: 'tous',     label: `Tous (${sinistres.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                background: tab === t.key ? 'var(--orange)' : 'var(--bg-input)',
                border: `1px solid ${tab === t.key ? 'var(--orange)' : 'var(--border)'}`,
                borderRadius: 8, padding: '5px 12px', color: tab === t.key ? '#fff' : 'var(--text-muted)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">Tous types</option>
          {Object.entries(SINISTRE_TYPES).map(([k, v]) => (
            <option key={k} value={k}>{v.icon} {v.label}</option>
          ))}
        </select>

        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Tous statuts</option>
          {Object.entries(SINISTRE_STATUSES).map(([k, v]) => (
            <option key={k} value={k}>{v.icon} {v.label}</option>
          ))}
        </select>

        <button className="btn-primary" onClick={onAdd}>+ Déclarer sinistre</button>
      </div>

      {/* Liste */}
      {!filtered.length ? (
        <div className="empty-state">
          <div style={{ fontSize: 64 }}>🛡️</div>
          <h3>Aucun sinistre{tab !== 'tous' ? ' dans cet onglet' : ''}</h3>
          <p>
            {tab === 'actifs'
              ? 'Tous vos sinistres sont clôturés ou aucun n\'a encore été déclaré.'
              : 'Aucun sinistre ne correspond à ces filtres.'}
          </p>
          <button className="btn-primary" onClick={onAdd}>+ Déclarer un sinistre</button>
        </div>
      ) : (
        <div className="sinistres-grid">
          {filtered.map(s => (
            <SinistreCard
              key={s.id}
              s={s}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
