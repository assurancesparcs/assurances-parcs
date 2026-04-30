import { useMemo } from 'react';
import { CAMPAGNE_TYPES, CAMPAGNE_STATUTS, CAMPAGNE_RECURRENCES, MOIS_LABELS, daysUntil } from '../data.js';

export default function PlanifView({ campagnes, prospects, onEdit, onNew }) {
  const now = new Date();

  // All planified
  const withDate = useMemo(() =>
    campagnes
      .filter(c => c.planification?.dateEnvoi)
      .map(c => ({ ...c, jours: daysUntil(c.planification.dateEnvoi) }))
      .sort((a, b) => new Date(a.planification.dateEnvoi) - new Date(b.planification.dateEnvoi)),
  [campagnes]);

  const passees  = withDate.filter(c => c.jours < 0);
  const aVenir   = withDate.filter(c => c.jours >= 0);
  const sansDate = campagnes.filter(c => !c.planification?.dateEnvoi);

  // Regrouper par mois
  const parMois = useMemo(() => {
    const groups = {};
    aVenir.forEach(c => {
      const d    = new Date(c.planification.dateEnvoi);
      const key  = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const lab  = `${MOIS_LABELS[d.getMonth()]} ${d.getFullYear()}`;
      if (!groups[key]) groups[key] = { label: lab, items: [] };
      groups[key].items.push(c);
    });
    return Object.values(groups);
  }, [aVenir]);

  const nbCibles = (c) => c.cibles?.tous ? prospects.length : (c.cibles?.prospectIds || []).length;

  const CampagneRow = ({ c }) => {
    const type   = CAMPAGNE_TYPES[c.type]     || { icon: '📧', label: c.type, color: '#9ca3c0' };
    const statut = CAMPAGNE_STATUTS[c.statut] || CAMPAGNE_STATUTS.brouillon;
    const cibles = nbCibles(c);
    const recurrence = c.planification?.recurrence !== 'unique'
      ? CAMPAGNE_RECURRENCES[c.planification?.recurrence] : null;

    return (
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--rs)', cursor: 'pointer', transition: 'all .2s',
          borderLeft: `3px solid ${type.color}`,
        }}
        onClick={() => onEdit(c)}
        onMouseEnter={e => e.currentTarget.style.borderColor = type.color}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        {/* Date */}
        <div style={{ minWidth: 70, textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            {new Date(c.planification.dateEnvoi).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
          </div>
          {c.jours !== undefined && (
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: c.jours === 0 ? 'var(--green)' : c.jours > 0 && c.jours <= 7 ? 'var(--yellow)' : 'var(--text-dim)',
            }}>
              {c.jours === 0 ? "aujourd'hui" : c.jours > 0 ? `J-${c.jours}` : `J+${Math.abs(c.jours)}`}
            </div>
          )}
        </div>

        {/* Dot */}
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: type.color, flexShrink: 0 }} />

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>{c.nom}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
            {type.icon} {type.label}
            {recurrence && ` · 🔄 ${recurrence}`}
            {` · 👥 ${cibles} dest.`}
          </div>
        </div>

        {/* Statut */}
        <span className="badge" style={{ color: statut.color, background: statut.bg }}>{statut.label}</span>
      </div>
    );
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">📅 Planification des campagnes</div>
        <button className="btn-primary" onClick={() => onNew()}>+ Nouvelle campagne</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'À venir',        val: aVenir.length,   color: 'var(--blue)'   },
          { label: 'Passées',        val: passees.length,  color: 'var(--text-dim)'},
          { label: 'Sans date',      val: sansDate.length, color: 'var(--yellow)' },
          { label: 'Total planif.',  val: withDate.length, color: 'var(--orange)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '16px', textAlign: 'center',
          }}>
            <div style={{ fontWeight: 900, fontSize: '1.8rem', color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {aVenir.length === 0 && sansDate.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>Aucune campagne planifiée</h3>
          <p>Créez une campagne et définissez une date d'envoi pour la voir apparaître ici.</p>
          <button className="btn-primary" onClick={() => onNew()}>+ Créer une campagne</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* À venir — groupées par mois */}
          {parMois.map(grp => (
            <div key={grp.label}>
              <div className="dash-section-title">{grp.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {grp.items.map(c => <CampagneRow key={c.id} c={c} />)}
              </div>
            </div>
          ))}

          {/* Sans date */}
          {sansDate.length > 0 && (
            <div>
              <div className="dash-section-title">⏳ Sans date planifiée</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sansDate.map(c => {
                  const type   = CAMPAGNE_TYPES[c.type]     || { icon: '📧', label: c.type, color: '#9ca3c0' };
                  const statut = CAMPAGNE_STATUTS[c.statut] || CAMPAGNE_STATUTS.brouillon;
                  return (
                    <div key={c.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 'var(--rs)', cursor: 'pointer', opacity: .7,
                      }}
                      onClick={() => onEdit(c)}
                    >
                      <span style={{ fontSize: 20 }}>{type.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{c.nom}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{type.label}</div>
                      </div>
                      <span className="badge" style={{ color: statut.color, background: statut.bg }}>{statut.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Passées */}
          {passees.length > 0 && (
            <div>
              <div className="dash-section-title">✅ Campagnes passées</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...passees].reverse().map(c => <CampagneRow key={c.id} c={c} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
