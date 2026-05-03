import { useState, useMemo } from 'react';
import { calcIKTotal } from '../utils/ikCalculator';
import { exportKmCSV, exportRepasCSV } from '../utils/exportUtils';
import SettingsModal from './SettingsModal';

const MONTHS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

function fmt(n) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function DashboardView({ trips, repas, settings, saveSettings }) {
  const [showSettings, setShowSettings] = useState(false);
  const year = new Date().getFullYear();

  const yearTrips = useMemo(
    () => trips.filter(t => t.date?.startsWith(String(year))),
    [trips, year]
  );
  const yearRepas = useMemo(
    () => repas.filter(r => r.date?.startsWith(String(year))),
    [repas, year]
  );

  const totalKm = useMemo(() => yearTrips.reduce((s, t) => s + (t.km || 0), 0), [yearTrips]);
  const totalIK = useMemo(
    () => calcIKTotal(totalKm, settings.cv, year),
    [totalKm, settings.cv, year]
  );
  const totalRepas = useMemo(
    () => yearRepas.reduce((s, r) => s + (r.montant || 0), 0),
    [yearRepas]
  );

  // Monthly km for chart
  const monthlyKm = useMemo(() => {
    const arr = Array(12).fill(0);
    yearTrips.forEach(t => {
      const m = parseInt(t.date?.slice(5, 7)) - 1;
      if (m >= 0 && m < 12) arr[m] += t.km || 0;
    });
    return arr;
  }, [yearTrips]);
  const maxKm = Math.max(...monthlyKm, 1);

  // Recent items (last 4 trips + last 4 repas combined, sorted by date)
  const recent = useMemo(() => {
    const t = trips.slice(-4).reverse().map(x => ({ ...x, type: 'km' }));
    const r = repas.slice(0, 4).map(x => ({ ...x, type: 'repas' }));
    return [...t, ...r].sort((a, b) => b.date?.localeCompare(a.date)).slice(0, 6);
  }, [trips, repas]);

  return (
    <div className="view">
      {/* Header */}
      <div className="view-header">
        <div>
          <div className="view-title">
            {settings.nom ? settings.nom.split(' ')[0] : 'Frais Pro'}
          </div>
          <div className="view-sub">Récapitulatif {year}</div>
        </div>
        <button className="icon-btn" onClick={() => setShowSettings(true)} title="Réglages">⚙️</button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card c-green">
          <div className="stat-value">{fmt(totalIK)} €</div>
          <div className="stat-label">Indemnités km</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalKm.toLocaleString('fr-FR')} km</div>
          <div className="stat-label">Km parcourus</div>
        </div>
        <div className="stat-card c-amber">
          <div className="stat-value">{fmt(totalRepas)} €</div>
          <div className="stat-label">Total repas</div>
        </div>
        <div className="stat-card c-primary">
          <div className="stat-value">{yearRepas.length}</div>
          <div className="stat-label">Repas d'affaires</div>
        </div>
      </div>

      {/* Monthly chart */}
      <div className="card">
        <div className="section-label">Km par mois — {year}</div>
        <div className="bar-chart">
          {monthlyKm.map((km, i) => (
            <div className="bar-col" key={i}>
              <div
                className="bar"
                style={{
                  height: Math.max(3, (km / maxKm) * 52),
                  background: km > 0 ? 'var(--green)' : 'rgba(255,255,255,0.06)',
                }}
                title={`${km} km`}
              />
              <div className="bar-label">{MONTHS[i].slice(0,1)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      {recent.length > 0 && (
        <>
          <div className="section-label">Dernières saisies</div>
          {recent.map(item => (
            item.type === 'km' ? (
              <div className="list-item" key={item.id} style={{ cursor: 'default' }}>
                <div className="list-icon icon-km">🚗</div>
                <div className="list-body">
                  <div className="list-title">{item.depart} → {item.arrivee}</div>
                  <div className="list-sub">{item.motif || '—'}</div>
                </div>
                <div className="list-right">
                  <div className="list-amount c-green">{item.km} km</div>
                  <div className="list-date-r">{fmtDate(item.date)}</div>
                </div>
              </div>
            ) : (
              <div className="list-item" key={item.id} style={{ cursor: 'default' }}>
                <div className="list-icon icon-repas">🍽️</div>
                <div className="list-body">
                  <div className="list-title">{item.restaurant || '—'}</div>
                  <div className="list-sub">
                    {Array.isArray(item.participants) && item.participants.length > 0
                      ? item.participants.join(', ')
                      : item.motif || '—'}
                  </div>
                </div>
                <div className="list-right">
                  <div className="list-amount c-amber">{fmt(item.montant || 0)} €</div>
                  <div className="list-date-r">{fmtDate(item.date)}</div>
                </div>
              </div>
            )
          ))}
        </>
      )}

      {recent.length === 0 && (
        <div className="empty" style={{ padding: '32px 0' }}>
          <div className="empty-icon">📋</div>
          <div className="empty-text">Aucune saisie pour l'instant</div>
          <div className="empty-sub">Ajoutez vos premiers trajets et repas</div>
        </div>
      )}

      {/* Exports */}
      <div className="divider" />
      <div className="section-label">Export pour votre comptable</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ flex: 1 }}
          onClick={() => exportKmCSV(trips, settings, year)}
          disabled={yearTrips.length === 0}
        >
          📊 Export km
        </button>
        <button
          className="btn btn-ghost btn-sm"
          style={{ flex: 1 }}
          onClick={() => exportRepasCSV(repas, year)}
          disabled={yearRepas.length === 0}
        >
          🍽️ Export repas
        </button>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 8, textAlign: 'center' }}>
        Fichier CSV — ouvrable dans Excel ou Google Sheets
      </div>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
