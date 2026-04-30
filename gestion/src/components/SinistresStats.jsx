import { useMemo } from 'react';
import { SINISTRE_TYPES, SINISTRE_CHASSE_TYPES, SINISTRE_STATUSES, fmtDate } from '../constants';

const MOIS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

function Bar({ label, count, total, color }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="bar-row">
      <div className="bar-label" style={{ fontSize: 11 }}>{label}</div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%`, background: color || 'var(--orange)' }} />
      </div>
      <div className="bar-count">{count}</div>
    </div>
  );
}

function KPI({ label, value, color, sub }) {
  return (
    <div className="kpi-card" style={{ borderColor: color ? color + '55' : undefined }}>
      <div className="kpi-value" style={{ color: color || 'var(--orange)', fontSize: '1.6rem' }}>{value}</div>
      <div className="kpi-label">{label}</div>
      {sub && <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function SinistresStats({ sinistres, sinistresChasse }) {
  const all = useMemo(() => [
    ...sinistres.map(s => ({ ...s, _module: 'standard' })),
    ...sinistresChasse.map(s => ({ ...s, _module: 'chasse' })),
  ], [sinistres, sinistresChasse]);

  const stats = useMemo(() => {
    const total    = all.length;
    const actifs   = all.filter(s => ['declare','en_instruction','attente_pieces','expertise'].includes(s.status)).length;
    const clotures = all.filter(s => ['cloture','indemnise','refuse'].includes(s.status)).length;
    const indemnises = all.filter(s => s.status === 'indemnise').length;
    const refuses  = all.filter(s => s.status === 'refuse').length;
    const tauxCloture = total ? Math.round((clotures / total) * 100) : 0;

    const montantEstime    = all.reduce((acc, s) => acc + (Number(s.montantEstime)    || 0), 0);
    const montantIndemnise = all.reduce((acc, s) => acc + (Number(s.montantIndemnise) || 0), 0);

    // Délai moyen déclaration → clôture (jours)
    const closedWithDates = all.filter(s =>
      ['cloture','indemnise'].includes(s.status) && s.dateDeclaration && s.updatedAt
    );
    const delaiMoyen = closedWithDates.length
      ? Math.round(closedWithDates.reduce((acc, s) => {
          const dec  = (s.dateDeclaration?.toDate ? s.dateDeclaration.toDate() : new Date(s.dateDeclaration)).getTime();
          const upd  = (s.updatedAt?.toDate ? s.updatedAt.toDate() : new Date(s.updatedAt)).getTime();
          return acc + (upd - dec) / 86400000;
        }, 0) / closedWithDates.length)
      : null;

    // Par statut
    const byStatut = Object.entries(SINISTRE_STATUSES).map(([k, v]) => ({
      key: k, label: `${v.icon} ${v.label}`, color: v.color,
      count: all.filter(s => s.status === k).length,
    })).filter(b => b.count > 0);

    // Par type (top 8 toutes collections)
    const allTypes = { ...SINISTRE_TYPES, ...SINISTRE_CHASSE_TYPES };
    const byType = Object.entries(allTypes).map(([k, v]) => ({
      key: k, label: `${v.icon} ${v.label}`, color: v.color,
      count: all.filter(s => s.type === k).length,
    })).filter(b => b.count > 0).sort((a, b) => b.count - a.count).slice(0, 8);

    // Par compagnie
    const compagnies = {};
    all.forEach(s => { if (s.compagnie) compagnies[s.compagnie] = (compagnies[s.compagnie] || 0) + 1; });
    const byCompagnie = Object.entries(compagnies)
      .map(([k, v]) => ({ label: k, count: v }))
      .sort((a, b) => b.count - a.count).slice(0, 6);

    // Évolution 12 mois
    const now = new Date();
    const mensuel = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return {
        label: MOIS[d.getMonth()],
        count: all.filter(s => {
          if (!s.dateDeclaration) return false;
          const dec = s.dateDeclaration.toDate ? s.dateDeclaration.toDate() : new Date(s.dateDeclaration);
          return dec.getFullYear() === d.getFullYear() && dec.getMonth() === d.getMonth();
        }).length,
      };
    });

    // Standard vs Chasse
    const nbStandard = sinistres.length;
    const nbChasse   = sinistresChasse.length;

    // Top clients
    const clients = {};
    all.forEach(s => { if (s.clientName) clients[s.clientName] = (clients[s.clientName] || 0) + 1; });
    const topClients = Object.entries(clients)
      .map(([k, v]) => ({ label: k, count: v }))
      .sort((a, b) => b.count - a.count).slice(0, 5);

    return {
      total, actifs, clotures, indemnises, refuses, tauxCloture,
      montantEstime, montantIndemnise, delaiMoyen,
      byStatut, byType, byCompagnie, mensuel, nbStandard, nbChasse, topClients,
    };
  }, [all, sinistres, sinistresChasse]);

  const maxMensuel = Math.max(...stats.mensuel.map(m => m.count), 1);
  const fmtEur = (n) => n.toLocaleString('fr-FR', { minimumFractionDigits: 0 }) + ' €';

  if (!stats.total) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: 64 }}>📊</div>
        <h3>Aucun sinistre enregistré</h3>
        <p>Les statistiques apparaîtront dès qu'un sinistre sera déclaré.</p>
      </div>
    );
  }

  return (
    <div className="stats-view">

      {/* KPIs */}
      <div className="kpi-grid">
        <KPI label="Total sinistres"     value={stats.total}      color="#60a5fa" />
        <KPI label="Dossiers actifs"     value={stats.actifs}     color="#fbbf24" />
        <KPI label="Indemnisés"          value={stats.indemnises} color="#34d399" />
        <KPI label="Refusés"             value={stats.refuses}    color="#f87171" />
        <KPI label="Taux de clôture"     value={`${stats.tauxCloture}%`} color="#a78bfa" />
        <KPI label="Délai moyen clôture" value={stats.delaiMoyen !== null ? `${stats.delaiMoyen}j` : '—'} color="#fb923c" sub="(déclaration → clôture)" />
        <KPI label="Montant estimé"      value={fmtEur(stats.montantEstime)}    color="#60a5fa" />
        <KPI label="Montant indemnisé"   value={fmtEur(stats.montantIndemnise)} color="#34d399" />
      </div>

      {/* Sinistres standard vs chasse */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Standard vs Chasse</h3>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
            {[
              { label: '🛡️ Sinistres',  value: stats.nbStandard, color: 'var(--orange)' },
              { label: '🏹 Chasse',      value: stats.nbChasse,   color: '#34d399' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center', flex: 1, padding: '16px 8px', background: 'var(--bg-input)', borderRadius: 'var(--rs)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{item.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>
                  {stats.total ? Math.round((item.value / stats.total) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 className="chart-title">Par statut</h3>
            {stats.byStatut.map(b => <Bar key={b.key} label={b.label} count={b.count} total={stats.total} color={b.color} />)}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Par type de sinistre</h3>
          {stats.byType.map(b => <Bar key={b.key} label={b.label} count={b.count} total={stats.total} color={b.color} />)}
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Par compagnie d'assurance</h3>
          {stats.byCompagnie.length > 0
            ? stats.byCompagnie.map((b, i) => <Bar key={i} label={b.label} count={b.count} total={stats.total} color="var(--purple)" />)
            : <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Aucune compagnie renseignée.</div>
          }
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Top clients (sinistres)</h3>
          {stats.topClients.length > 0
            ? stats.topClients.map((b, i) => <Bar key={i} label={b.label} count={b.count} total={stats.total} color="var(--pink)" />)
            : <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Aucune donnée.</div>
          }
        </div>
      </div>

      {/* Évolution mensuelle */}
      <div className="chart-card">
        <h3 className="chart-title">Déclarations — 12 derniers mois</h3>
        <div className="weekly-chart" style={{ height: 120, gap: 6 }}>
          {stats.mensuel.map((m, i) => (
            <div key={i} className="week-col">
              <div className="week-bar-wrap">
                <div className="week-bar" style={{ height: `${(m.count / maxMensuel) * 100}%`, background: 'var(--blue)' }} />
              </div>
              <div className="week-label">{m.label}</div>
              <div className="week-count">{m.count || ''}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
