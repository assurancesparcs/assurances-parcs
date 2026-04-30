import { useMemo } from 'react';
import {
  CAMPAGNE_TYPES, CAMPAGNE_STATUTS, CAMPAGNE_RECURRENCES,
  MOIS_LABELS, SAISONS_RECOMMANDEES, fmtDate, daysUntil,
} from '../data.js';

function KpiCard({ value, label, sub, color, c2 }) {
  return (
    <div className="kpi-card" style={{ '--c1': color, '--c2': c2 || color }}>
      <div className="kpi-value" style={{ color }}>{value}</div>
      <div className="kpi-label">{label}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

export default function Dashboard({ campagnes, prospects, onViewCampagnes, onNewCampagne, onViewPlanif }) {
  const now = new Date();
  const moisActuel = now.getMonth(); // 0-indexed

  const stats = useMemo(() => ({
    total:      campagnes.length,
    actives:    campagnes.filter(c => c.statut === 'active').length,
    planifiees: campagnes.filter(c => c.statut === 'planifiee').length,
    terminees:  campagnes.filter(c => c.statut === 'terminee').length,
    totalEnvoyes: campagnes.reduce((a, c) => a + (c.envoye || 0), 0),
    clients:    prospects.filter(p => p.statut === 'client').length,
    newProspects: prospects.filter(p => p.statut === 'prospect').length,
  }), [campagnes, prospects]);

  // Campagnes à venir dans les 30 jours
  const aVenir = useMemo(() => campagnes
    .filter(c => c.planification?.dateEnvoi && ['planifiee', 'active'].includes(c.statut))
    .map(c => ({ ...c, jours: daysUntil(c.planification.dateEnvoi) }))
    .filter(c => c.jours !== null && c.jours >= 0 && c.jours <= 60)
    .sort((a, b) => a.jours - b.jours)
    .slice(0, 5),
  [campagnes]);

  // Répartition par type
  const parType = useMemo(() => {
    const counts = {};
    campagnes.forEach(c => { counts[c.type] = (counts[c.type] || 0) + 1; });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [campagnes]);

  // Campagnes par mois de l'année
  const parMois = useMemo(() => {
    const m = Array(12).fill(0);
    campagnes.forEach(c => {
      if (c.planification?.dateEnvoi) {
        const mo = new Date(c.planification.dateEnvoi).getMonth();
        m[mo]++;
      }
    });
    return m;
  }, [campagnes]);

  // Récentes
  const recentes = useMemo(() =>
    [...campagnes]
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, 5),
  [campagnes]);

  const saisonActuelle = SAISONS_RECOMMANDEES.find(s => s.mois.includes(now.getMonth() + 1));

  return (
    <div className="dashboard">

      {/* KPIs */}
      <div className="kpi-grid">
        <KpiCard value={stats.total}        label="Campagnes total"   color="var(--orange)" />
        <KpiCard value={stats.actives}      label="Actives"           color="var(--green)"  sub="en cours" />
        <KpiCard value={stats.planifiees}   label="Planifiées"        color="var(--blue)"   sub="à venir" />
        <KpiCard value={stats.totalEnvoyes} label="Emails envoyés"    color="var(--purple)" />
        <KpiCard value={stats.clients}      label="Clients prospects" color="var(--teal)"   sub="en portefeuille" />
        <KpiCard value={stats.newProspects} label="Nouveaux prospects" color="var(--yellow)" sub="à contacter" />
      </div>

      {/* Alerte saison */}
      {saisonActuelle && (
        <div className="info-box blue" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 24 }}>💡</span>
          <div>
            <strong>Conseil du mois ({MOIS_LABELS[moisActuel]}) : </strong>
            {saisonActuelle.label}
            {' — '}
            <button
              style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 700, fontSize: 12, textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => onNewCampagne(saisonActuelle.type)}
            >
              Créer une campagne {CAMPAGNE_TYPES[saisonActuelle.type]?.label}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Prochains envois */}
        <div>
          <div className="dash-section-title">📅 Prochains envois</div>
          {aVenir.length === 0 ? (
            <div className="info-box blue" style={{ fontSize: 13 }}>
              Aucune campagne planifiée.{' '}
              <button style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => onViewPlanif()}>Planifier une campagne →</button>
            </div>
          ) : (
            <div className="timeline">
              {aVenir.map(c => {
                const type = CAMPAGNE_TYPES[c.type] || {};
                return (
                  <div key={c.id} className="timeline-item">
                    <div className="timeline-date-col">
                      <div className="timeline-date">
                        {new Date(c.planification.dateEnvoi).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                      </div>
                      <div className="timeline-rel" style={{ color: c.jours === 0 ? 'var(--green)' : c.jours <= 7 ? 'var(--yellow)' : 'var(--text-dim)' }}>
                        {c.jours === 0 ? "aujourd'hui" : `J-${c.jours}`}
                      </div>
                    </div>
                    <div className="timeline-dot" style={{ '--type-color': type.color }} />
                    <div className="timeline-content">
                      <div className="timeline-nom">{c.nom}</div>
                      <div className="timeline-type">{type.icon} {type.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Répartition par type */}
        <div>
          <div className="dash-section-title">📊 Par type de campagne</div>
          {parType.length === 0 ? (
            <div className="info-box blue" style={{ fontSize: 13 }}>Aucune campagne créée.</div>
          ) : (
            <div className="stat-bar-list">
              {parType.map(([typeKey, count]) => {
                const type = CAMPAGNE_TYPES[typeKey] || { label: typeKey, color: '#9ca3c0', icon: '📧' };
                const pct = Math.round((count / campagnes.length) * 100);
                return (
                  <div key={typeKey} className="stat-bar-row">
                    <div className="stat-bar-label">
                      {type.icon} {type.label}
                    </div>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill" style={{ width: `${pct}%`, background: type.color }} />
                    </div>
                    <div className="stat-bar-count" style={{ color: type.color }}>{count}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Calendrier annuel */}
      <div>
        <div className="dash-section-title">📆 Calendrier d'envois annuel</div>
        <div className="calendar-grid">
          {MOIS_LABELS.map((m, i) => (
            <div key={i} className={`cal-month ${parMois[i] > 0 ? 'has-campagne' : ''} ${i === moisActuel ? 'current' : ''}`}>
              <div className="cal-month-label">{m}</div>
              <div className="cal-month-count" style={{ color: parMois[i] > 0 ? 'var(--orange)' : 'var(--text-dim)' }}>
                {parMois[i] || '—'}
              </div>
              {parMois[i] > 0 && <div className="cal-month-hint">campagne{parMois[i] > 1 ? 's' : ''}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Conseils saisonniers */}
      <div>
        <div className="dash-section-title">💡 Recommandations saisonnières</div>
        <div className="conseil-grid">
          {SAISONS_RECOMMANDEES.map((s, i) => {
            const type = CAMPAGNE_TYPES[s.type] || {};
            const moisStr = s.mois.map(m => MOIS_LABELS[m - 1]).join(' / ');
            return (
              <div key={i} className="conseil-card" style={{ '--type-color': type.color }}>
                <div className="conseil-mois">{moisStr}</div>
                <div className="conseil-label">{type.icon} {s.label}</div>
                <button className="conseil-btn" onClick={() => onNewCampagne(s.type)}>
                  + Créer cette campagne
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Récentes */}
      {recentes.length > 0 && (
        <div>
          <div className="dash-section-title">🕐 Campagnes récentes</div>
          <div className="recent-campagnes">
            {recentes.map(c => {
              const type = CAMPAGNE_TYPES[c.type] || { icon: '📧', label: c.type };
              const statut = CAMPAGNE_STATUTS[c.statut] || {};
              return (
                <div key={c.id} className="recent-item" onClick={() => onViewCampagnes(c.id)}>
                  <div className="recent-item-icon">{type.icon}</div>
                  <div className="recent-item-info">
                    <div className="recent-item-nom">{c.nom}</div>
                    <div className="recent-item-meta">
                      {type.label} · créée le {fmtDate(c.createdAt)}
                      {c.envoye > 0 && ` · ${c.envoye} envoyé${c.envoye > 1 ? 's' : ''}`}
                    </div>
                  </div>
                  <span className="badge" style={{ color: statut.color, background: statut.bg }}>
                    {statut.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
