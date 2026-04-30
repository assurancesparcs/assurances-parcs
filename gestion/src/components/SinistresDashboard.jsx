import { useMemo } from 'react';
import { SINISTRE_TYPES, SINISTRE_CHASSE_TYPES, SINISTRE_STATUSES, fmtDate, joursDepuisRelance, relanceUrgence } from '../constants';

const ACTIVE_STATUSES = ['declare', 'en_instruction', 'attente_pieces', 'expertise'];

function buildRows(sinistres, mode) {
  const types = mode === 'chasse' ? SINISTRE_CHASSE_TYPES : SINISTRE_TYPES;
  return sinistres
    .filter(s => ACTIVE_STATUSES.includes(s.status))
    .map(s => {
      const joursClient    = joursDepuisRelance(s, 'client');
      const joursCompagnie = joursDepuisRelance(s, 'compagnie');
      const urgClient      = relanceUrgence(joursClient);
      const urgCompagnie   = relanceUrgence(joursCompagnie);
      const piecesMisquantes = (s.pieces || []).filter(p => !p.recu).length;
      const tp = types[s.type] || SINISTRE_TYPES.autre || { icon: '📋', color: '#9ca3c0' };
      return { ...s, joursClient, joursCompagnie, urgClient, urgCompagnie, piecesMisquantes, tp };
    })
    .filter(s => s.urgClient?.level !== 'ok' || s.urgCompagnie?.level !== 'ok')
    .sort((a, b) => {
      const maxA = Math.max(a.joursClient || 0, a.joursCompagnie || 0);
      const maxB = Math.max(b.joursClient || 0, b.joursCompagnie || 0);
      return maxB - maxA;
    });
}

function RelanceTag({ jours, cible, urgence, onRelance }) {
  if (!urgence || urgence.level === 'ok') return null;
  return (
    <button className="relance-tag" style={{ borderColor: urgence.color, color: urgence.color }}
      onClick={onRelance}>
      {cible === 'client' ? '👤' : '🏢'} {urgence.label}
    </button>
  );
}

export default function SinistresDashboard({ sinistres, sinistresChasse, onRelance }) {
  const rowsStandard = useMemo(() => buildRows(sinistres, 'standard'), [sinistres]);
  const rowsChasse   = useMemo(() => buildRows(sinistresChasse, 'chasse'), [sinistresChasse]);

  const critiques = [...rowsStandard, ...rowsChasse].filter(
    s => s.urgClient?.level === 'critique' || s.urgCompagnie?.level === 'critique'
  ).length;

  const alertes = [...rowsStandard, ...rowsChasse].filter(
    s => s.urgClient?.level === 'alerte' || s.urgCompagnie?.level === 'alerte'
  ).length;

  const total = rowsStandard.length + rowsChasse.length;

  if (total === 0) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: 64 }}>☀️</div>
        <h3>Aucune relance à effectuer aujourd'hui</h3>
        <p>Tous vos dossiers actifs sont à jour. Bonne journée !</p>
      </div>
    );
  }

  return (
    <div className="dashboard-matin">
      {/* Résumé du jour */}
      <div className="dashboard-header">
        <div style={{ flex: 1 }}>
          <h2 className="dashboard-title">☀️ Tableau de bord du matin</h2>
          <p className="dashboard-sub">Dossiers nécessitant une relance aujourd'hui</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {critiques > 0 && (
            <div className="dashboard-kpi" style={{ borderColor: '#f87171' }}>
              <div style={{ color: '#f87171', fontSize: '1.4rem', fontWeight: 900 }}>{critiques}</div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>Critiques ≥30j</div>
            </div>
          )}
          <div className="dashboard-kpi" style={{ borderColor: '#fbbf24' }}>
            <div style={{ color: '#fbbf24', fontSize: '1.4rem', fontWeight: 900 }}>{alertes}</div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>Alertes ≥15j</div>
          </div>
          <div className="dashboard-kpi" style={{ borderColor: 'var(--border)' }}>
            <div style={{ color: 'var(--text)', fontSize: '1.4rem', fontWeight: 900 }}>{total}</div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>Total à relancer</div>
          </div>
        </div>
      </div>

      {/* Section Sinistres standard */}
      {rowsStandard.length > 0 && (
        <Section title="🛡️ Sinistres" rows={rowsStandard} onRelance={onRelance} collection="sinistres" />
      )}

      {/* Section Sinistres chasse */}
      {rowsChasse.length > 0 && (
        <Section title="🏹 Sinistres Chasse" rows={rowsChasse} onRelance={onRelance} collection="sinistresChasse" />
      )}
    </div>
  );
}

function Section({ title, rows, onRelance, collection }) {
  return (
    <div className="dashboard-section">
      <div className="dashboard-section-title">{title} — {rows.length} dossier{rows.length > 1 ? 's' : ''}</div>
      <div className="dashboard-table">
        <div className="dtable-head">
          <div>Client</div>
          <div>Type / N°</div>
          <div>Statut</div>
          <div>Pièces manquantes</div>
          <div>Relance client</div>
          <div>Relance compagnie</div>
          <div></div>
        </div>
        {rows.map(s => {
          const st = SINISTRE_STATUSES[s.status] || SINISTRE_STATUSES.declare;
          return (
            <div key={s.id} className={`dtable-row ${s.urgClient?.level === 'critique' || s.urgCompagnie?.level === 'critique' ? 'row-critique' : ''}`}>
              <div className="dtable-client">
                <span style={{ color: s.tp.color }}>{s.tp.icon}</span>
                <span>{s.clientName || '—'}</span>
                {s.assignedTo && <span className="dtable-assignee">👤 {s.assignedTo}</span>}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{s.tp.label}</div>
                {s.numero && <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>#{s.numero}</div>}
                {s.compagnie && <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{s.compagnie}</div>}
              </div>
              <div>
                <span className="sinistre-status-badge" style={{ background: st.bg, color: st.color }}>
                  {st.icon} {st.label}
                </span>
              </div>
              <div>
                {s.piecesMisquantes > 0
                  ? <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 12 }}>
                      📎 {s.piecesMisquantes} manquante{s.piecesMisquantes > 1 ? 's' : ''}
                    </span>
                  : <span style={{ color: '#34d399', fontSize: 12 }}>✅ Complètes</span>
                }
              </div>
              <div>
                <RelanceTag jours={s.joursClient} cible="client" urgence={s.urgClient}
                  onRelance={() => onRelance(s, collection, 'client_15j')} />
              </div>
              <div>
                <RelanceTag jours={s.joursCompagnie} cible="compagnie" urgence={s.urgCompagnie}
                  onRelance={() => onRelance(s, collection, 'compagnie_15j')} />
              </div>
              <div>
                <button className="btn-icon" title="Relancer" style={{ fontSize: 16 }}
                  onClick={() => onRelance(s, collection)}>✉️</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
