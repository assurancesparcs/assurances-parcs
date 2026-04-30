import { useState, useMemo } from 'react';
import { TYPES, PRIORITIES, STATUSES, isOverdue } from '../constants';
import SinistresStats from './SinistresStats';

export default function StatsView({ items, clients, sinistres, sinistresChasse }) {
  const [tab, setTab] = useState('activite');

  const s = useMemo(() => {
    const total = items.length;
    const done = items.filter(i => i.status === 'termine').length;
    const urgent = items.filter(i => i.priority === 'urgent' && i.status !== 'termine').length;
    const overdue = items.filter(i => isOverdue(i)).length;
    const rate = total ? Math.round((done / total) * 100) : 0;

    const byType     = Object.entries(TYPES).map(([k, v]) => ({ k, ...v, count: items.filter(i => i.type === k).length }));
    const byStatus   = Object.entries(STATUSES).map(([k, v]) => ({ k, ...v, count: items.filter(i => i.status === k).length }));
    const byPriority = Object.entries(PRIORITIES).map(([k, v]) => ({ k, ...v, count: items.filter(i => i.priority === k).length }));

    const now = new Date();
    const weekly = Array.from({ length: 4 }, (_, i) => {
      const ws = new Date(now); ws.setDate(now.getDate() - (3 - i) * 7 - now.getDay());
      const we = new Date(ws); we.setDate(ws.getDate() + 6);
      return {
        label: i === 3 ? 'Cette sem.' : `S-${3 - i}`,
        count: items.filter(it => {
          if (!it.createdAt) return false;
          const d = it.createdAt.toDate ? it.createdAt.toDate() : new Date(it.createdAt);
          return d >= ws && d <= we;
        }).length,
      };
    });

    return { total, done, urgent, overdue, rate, byType, byStatus, byPriority, weekly };
  }, [items]);

  const maxW = Math.max(...s.weekly.map(w => w.count), 1);

  const Bar = ({ count, color, label, total }) => (
    <div className="bar-row">
      <div className="bar-label">{label}</div>
      <div className="bar-track"><div className="bar-fill" style={{ width: `${total ? (count / total) * 100 : 0}%`, background: color }} /></div>
      <div className="bar-count">{count}</div>
    </div>
  );

  const totalSin = (sinistres?.length || 0) + (sinistresChasse?.length || 0);

  return (
    <div className="stats-view">

      {/* Sélecteur onglet */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { key: 'activite',  label: '📋 Activité & Tâches' },
          { key: 'sinistres', label: `🛡️ Sinistres (${totalSin})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700,
              background: tab === t.key ? 'var(--orange)' : 'var(--bg-input)',
              color: tab === t.key ? '#fff' : 'var(--text-muted)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ONGLET ACTIVITÉ ── */}
      {tab === 'activite' && <>
        <div className="kpi-grid">
          <div className="kpi-card"><div className="kpi-value">{s.total}</div><div className="kpi-label">Total</div></div>
          <div className="kpi-card" style={{ borderColor: 'rgba(52,211,153,0.4)' }}><div className="kpi-value" style={{ color: '#34d399' }}>{s.done}</div><div className="kpi-label">Terminés</div></div>
          <div className="kpi-card" style={{ borderColor: 'rgba(248,113,113,0.4)' }}><div className="kpi-value" style={{ color: '#f87171' }}>{s.urgent}</div><div className="kpi-label">Urgents</div></div>
          <div className="kpi-card" style={{ borderColor: 'rgba(251,191,36,0.4)' }}><div className="kpi-value" style={{ color: '#fbbf24' }}>{s.rate}%</div><div className="kpi-label">Complétion</div></div>
          <div className="kpi-card" style={{ borderColor: 'rgba(251,146,60,0.4)' }}><div className="kpi-value" style={{ color: '#fb923c' }}>{s.overdue}</div><div className="kpi-label">En retard</div></div>
          <div className="kpi-card"><div className="kpi-value">{clients.length}</div><div className="kpi-label">Clients</div></div>
        </div>
        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Par type</h3>
            {s.byType.map(b => <Bar key={b.k} count={b.count} color={b.color} label={`${b.icon} ${b.label}`} total={s.total} />)}
          </div>
          <div className="chart-card">
            <h3 className="chart-title">Par statut</h3>
            {s.byStatus.map(b => <Bar key={b.k} count={b.count} color={b.color} label={b.label} total={s.total} />)}
          </div>
          <div className="chart-card">
            <h3 className="chart-title">Par priorité</h3>
            {s.byPriority.map(b => <Bar key={b.k} count={b.count} color={b.color} label={b.label} total={s.total} />)}
          </div>
          <div className="chart-card">
            <h3 className="chart-title">Activité hebdomadaire</h3>
            <div className="weekly-chart">
              {s.weekly.map((w, i) => (
                <div key={i} className="week-col">
                  <div className="week-bar-wrap"><div className="week-bar" style={{ height: `${(w.count / maxW) * 100}%` }} /></div>
                  <div className="week-label">{w.label}</div>
                  <div className="week-count">{w.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="completion-section">
          <div className="donut-wrap">
            <svg viewBox="0 0 42 42" className="donut">
              <circle cx="21" cy="21" r="15.915" fill="none" stroke="#1e2440" strokeWidth="4" />
              <circle cx="21" cy="21" r="15.915" fill="none" stroke="#34d399" strokeWidth="4"
                strokeDasharray={`${s.rate} ${100 - s.rate}`} strokeDashoffset="25" strokeLinecap="round" />
              <text x="21" y="21" textAnchor="middle" dy=".3em" fill="#fff" fontSize="7" fontWeight="bold">{s.rate}%</text>
            </svg>
            <div className="donut-label">Taux de complétion</div>
          </div>
        </div>
      </>}

      {/* ── ONGLET SINISTRES ── */}
      {tab === 'sinistres' && (
        <SinistresStats sinistres={sinistres || []} sinistresChasse={sinistresChasse || []} />
      )}

    </div>
  );
}
