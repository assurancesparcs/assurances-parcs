import { useState, useMemo } from 'react';
import { calcIKTotal } from '../utils/ikCalculator';
import KmModal from './KmModal';

function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function KmView({ trips, settings, addTrip, updateTrip, deleteTrip }) {
  const now    = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(0); // 0 = all
  const [modal, setModal] = useState(null); // null | 'new' | {trip}

  const years = useMemo(() => {
    const s = new Set(trips.map(t => parseInt(t.date?.slice(0, 4))).filter(Boolean));
    s.add(now.getFullYear());
    return [...s].sort((a, b) => b - a);
  }, [trips]);

  const filtered = useMemo(() => {
    return trips
      .filter(t => {
        if (t.date?.slice(0, 4) !== String(year)) return false;
        if (month && t.date?.slice(5, 7) !== String(month).padStart(2, '0')) return false;
        return true;
      })
      .slice()
      .reverse();
  }, [trips, year, month]);

  // IK per trip (using cumulative over filtered year, in chronological order)
  const yearTrips = useMemo(
    () => trips.filter(t => t.date?.slice(0, 4) === String(year)).sort((a, b) => a.date.localeCompare(b.date)),
    [trips, year]
  );

  const ikMap = useMemo(() => {
    let cum = 0;
    const map = {};
    yearTrips.forEach(t => {
      const km = t.km || 0;
      const after = cum + km;
      map[t.id] = calcIKTotal(after, settings.cv, year) - calcIKTotal(cum, settings.cv, year);
      cum = after;
    });
    return map;
  }, [yearTrips, settings.cv, year]);

  const totalKm = useMemo(() => filtered.reduce((s, t) => s + (t.km || 0), 0), [filtered]);
  const totalIK = useMemo(
    () => filtered.reduce((s, t) => s + (ikMap[t.id] || 0), 0),
    [filtered, ikMap]
  );

  const handleSave = async (data) => {
    if (modal?.id) await updateTrip(modal.id, data);
    else await addTrip(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce trajet ?')) {
      await deleteTrip(id);
      setModal(null);
    }
  };

  const MONTH_LABELS = ['Tous','Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

  return (
    <div className="view">
      {/* Header */}
      <div className="view-header">
        <div>
          <div className="view-title">🚗 Kilométrage</div>
          <div className="view-sub">
            {totalKm > 0 ? `${totalKm.toLocaleString('fr-FR')} km — ${totalIK.toFixed(2)} € IK` : 'Aucun trajet'}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-row">
        <select className="select" value={year} onChange={e => setYear(parseInt(e.target.value))}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select className="select" value={month} onChange={e => setMonth(parseInt(e.target.value))}>
          {MONTH_LABELS.map((l, i) => <option key={i} value={i}>{l}</option>)}
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🗺️</div>
          <div className="empty-text">Aucun trajet</div>
          <div className="empty-sub">Appuyez sur + pour ajouter un déplacement</div>
        </div>
      ) : (
        filtered.map(t => (
          <div className="list-item" key={t.id} onClick={() => setModal(t)}>
            <div className="list-icon icon-km">🚗</div>
            <div className="list-body">
              <div className="list-title">{t.depart} → {t.arrivee}</div>
              <div className="list-sub">{t.motif || '—'}</div>
            </div>
            <div className="list-right">
              <div className="list-amount c-green">{t.km} km</div>
              <div className="list-date-r">{fmtDate(t.date)}</div>
            </div>
          </div>
        ))
      )}

      {/* FAB */}
      <button className="fab" onClick={() => setModal('new')} title="Nouveau trajet">+</button>

      {/* Modal */}
      {modal && (
        <KmModal
          trips={trips}
          settings={settings}
          initial={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
          onDelete={modal !== 'new' ? () => handleDelete(modal.id) : null}
        />
      )}

      {/* Delete button inside modal is rendered there; expose delete here via context */}
    </div>
  );
}
