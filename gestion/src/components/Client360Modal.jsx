import { useMemo } from 'react';
import { SINISTRE_STATUSES, SINISTRE_TYPES, SINISTRE_CHASSE_TYPES, MED_STATUSES, fmtDate } from '../constants';

function Section({ icon, title, count, color, children }) {
  return (
    <div className="c360-section">
      <div className="c360-section-title" style={{ borderColor: color }}>
        <span>{icon} {title}</span>
        <span className="c360-badge" style={{ background: color + '22', color }}>{count}</span>
      </div>
      {children}
    </div>
  );
}

function EmptyRow({ text }) {
  return <div className="c360-empty">{text}</div>;
}

function ContractRow({ c }) {
  const isExpiring = (() => {
    if (!c.dateEcheance) return false;
    const d = c.dateEcheance.toDate ? c.dateEcheance.toDate() : new Date(c.dateEcheance);
    return (d - new Date()) / 86400000 <= 60;
  })();
  return (
    <div className="c360-row">
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className="c360-row-title">{c.type || '—'}</span>
        {c.numero && <span className="c360-row-sub">n°{c.numero}</span>}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        {c.dateEcheance && (
          <span style={{ fontSize: 11, color: isExpiring ? '#fbbf24' : 'var(--text-dim)' }}>
            {isExpiring ? '⚠️ ' : '📅 '}{fmtDate(c.dateEcheance)}
          </span>
        )}
        <span style={{ fontSize: 11, color: c.primePayee ? '#34d399' : '#f87171', fontWeight: 700 }}>
          {c.primePayee ? '✅ Payé' : '❌ Impayé'}
        </span>
      </div>
    </div>
  );
}

function SinistreRow({ s, types }) {
  const st = SINISTRE_STATUSES[s.status] || SINISTRE_STATUSES.declare;
  const tp = types[s.type] || { icon: '📋', label: s.type };
  return (
    <div className="c360-row">
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className="c360-row-title">{tp.icon} {tp.label}</span>
        {s.numero && <span className="c360-row-sub">#{s.numero}</span>}
        {s.compagnie && <span className="c360-row-sub">🏢 {s.compagnie}</span>}
      </div>
      <span className="c360-status-badge" style={{ background: st.bg, color: st.color }}>
        {st.icon} {st.label}
      </span>
    </div>
  );
}

function MEDRow({ d }) {
  const st = MED_STATUSES[d.status] || MED_STATUSES.en_cours;
  return (
    <div className="c360-row">
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className="c360-row-title">{d.typeContrat || '—'}</span>
        {d.numeroContrat && <span className="c360-row-sub">n°{d.numeroContrat}</span>}
        {d.montantDu && (
          <span className="c360-row-sub" style={{ color: '#f87171' }}>
            {Number(d.montantDu).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </span>
        )}
      </div>
      <span className="c360-status-badge" style={{ background: st.bg, color: st.color }}>
        {st.icon} {st.label}
      </span>
    </div>
  );
}

function TaskRow({ t }) {
  const colors = { urgent: '#f87171', haute: '#fb923c', normal: '#60a5fa' };
  const statusColors = { a_faire: '#9ca3c0', en_cours: '#fbbf24', suivi_requis: '#fb923c', termine: '#34d399' };
  return (
    <div className="c360-row">
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className="c360-row-title">{t.title || '—'}</span>
        {t.date && <span className="c360-row-sub">📅 {fmtDate(t.date)}</span>}
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
        {t.priority && (
          <span style={{ fontSize: 10, color: colors[t.priority], fontWeight: 700 }}>
            {t.priority.toUpperCase()}
          </span>
        )}
        {t.status && (
          <span style={{ fontSize: 10, color: statusColors[t.status] || 'var(--text-dim)' }}>
            {t.status === 'termine' ? '✅' : t.status === 'en_cours' ? '🔄' : '⏳'}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Client360Modal({ client, contracts, sinistres, sinistresChasse, medDossiers, items, onClose, onGoTo }) {
  const match = (obj) =>
    obj.clientId === client.id ||
    obj.clientName?.toLowerCase().trim() === client.name?.toLowerCase().trim();

  const data = useMemo(() => ({
    contracts:       contracts.filter(match),
    sinistres:       sinistres.filter(match),
    sinistresChasse: sinistresChasse.filter(match),
    med:             medDossiers.filter(d =>
      d.clientName?.toLowerCase().trim() === client.name?.toLowerCase().trim()
    ),
    tasks:           items.filter(match),
  }), [client, contracts, sinistres, sinistresChasse, medDossiers, items]);

  const totalAlerts =
    data.contracts.filter(c => !c.primePayee).length +
    data.sinistres.filter(s => ['declare','en_instruction','attente_pieces','expertise'].includes(s.status)).length +
    data.sinistresChasse.filter(s => ['declare','en_instruction','attente_pieces','expertise'].includes(s.status)).length +
    data.med.filter(d => ['en_cours','relance_1','relance_2','mise_en_demeure'].includes(d.status)).length;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal c360-modal">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="c360-avatar">{client.name?.[0]?.toUpperCase() || '?'}</div>
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{client.name}</h2>
              {client.company && <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>🏢 {client.company}</div>}
              <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 11, color: 'var(--text-dim)' }}>
                {client.email && <span>📧 {client.email}</span>}
                {client.phone && <span>📞 {client.phone}</span>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {totalAlerts > 0 && (
              <span style={{ fontSize: 11, background: 'rgba(248,113,113,.15)', color: '#f87171', borderRadius: 20, padding: '3px 10px', fontWeight: 700 }}>
                ⚠️ {totalAlerts} point{totalAlerts > 1 ? 's' : ''} d'attention
              </span>
            )}
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="c360-body">

          {/* Contrats */}
          <Section icon="📄" title="Contrats" count={data.contracts.length} color="#a78bfa">
            {!data.contracts.length
              ? <EmptyRow text="Aucun contrat enregistré." />
              : data.contracts.map(c => <ContractRow key={c.id} c={c} />)
            }
            <button className="c360-goto" onClick={() => onGoTo('contrats')}>
              → Aller dans Contrats
            </button>
          </Section>

          {/* Sinistres standard */}
          <Section icon="🛡️" title="Sinistres" count={data.sinistres.length} color="#fb923c">
            {!data.sinistres.length
              ? <EmptyRow text="Aucun sinistre enregistré." />
              : data.sinistres.map(s => <SinistreRow key={s.id} s={s} types={SINISTRE_TYPES} />)
            }
            <button className="c360-goto" onClick={() => onGoTo('sinistres')}>
              → Aller dans Sinistres
            </button>
          </Section>

          {/* Sinistres chasse */}
          {(data.sinistresChasse.length > 0) && (
            <Section icon="🏹" title="Sinistres Chasse" count={data.sinistresChasse.length} color="#34d399">
              {data.sinistresChasse.map(s => <SinistreRow key={s.id} s={s} types={SINISTRE_CHASSE_TYPES} />)}
              <button className="c360-goto" onClick={() => onGoTo('sinistres_chasse')}>
                → Aller dans Chasse
              </button>
            </Section>
          )}

          {/* MED */}
          <Section icon="📬" title="Dossiers MED" count={data.med.length} color="#f87171">
            {!data.med.length
              ? <EmptyRow text="Aucun dossier MED." />
              : data.med.map(d => <MEDRow key={d.id} d={d} />)
            }
            <button className="c360-goto" onClick={() => onGoTo('med')}>
              → Aller dans MED
            </button>
          </Section>

          {/* Tâches */}
          <Section icon="📋" title="Tâches & suivis" count={data.tasks.length} color="#60a5fa">
            {!data.tasks.length
              ? <EmptyRow text="Aucune tâche liée à ce client." />
              : data.tasks.slice(0, 5).map(t => <TaskRow key={t.id} t={t} />)
            }
            {data.tasks.length > 5 && (
              <div style={{ fontSize: 11, color: 'var(--text-dim)', padding: '6px 12px' }}>
                +{data.tasks.length - 5} autre{data.tasks.length - 5 > 1 ? 's' : ''} tâche{data.tasks.length - 5 > 1 ? 's' : ''}
              </div>
            )}
            <button className="c360-goto" onClick={() => onGoTo('liste')}>
              → Aller dans Liste
            </button>
          </Section>

        </div>
      </div>
    </div>
  );
}
