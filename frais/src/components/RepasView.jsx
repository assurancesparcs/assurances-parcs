import { useState, useMemo } from 'react';
import RepasModal from './RepasModal';

function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function fmt(n) {
  return (n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function RepasView({ repas, addRepas, updateRepas, deleteRepas }) {
  const now    = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(0);
  const [modal, setModal] = useState(null);

  const years = useMemo(() => {
    const s = new Set(repas.map(r => parseInt(r.date?.slice(0, 4))).filter(Boolean));
    s.add(now.getFullYear());
    return [...s].sort((a, b) => b - a);
  }, [repas]);

  const filtered = useMemo(() => {
    return repas.filter(r => {
      if (r.date?.slice(0, 4) !== String(year)) return false;
      if (month && r.date?.slice(5, 7) !== String(month).padStart(2, '0')) return false;
      return true;
    });
  }, [repas, year, month]);

  const total = useMemo(() => filtered.reduce((s, r) => s + (r.montant || 0), 0), [filtered]);

  const handleSave = async (data) => {
    if (modal?.id) await updateRepas(modal.id, data);
    else await addRepas(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce repas ?')) {
      await deleteRepas(id);
      setModal(null);
    }
  };

  const MONTH_LABELS = ['Tous','Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

  return (
    <div className="view">
      {/* Header */}
      <div className="view-header">
        <div>
          <div className="view-title">🍽️ Repas</div>
          <div className="view-sub">
            {filtered.length > 0
              ? `${filtered.length} repas — ${fmt(total)} €`
              : 'Aucun repas'}
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
          <div className="empty-icon">🍴</div>
          <div className="empty-text">Aucun repas enregistré</div>
          <div className="empty-sub">Appuyez sur + pour ajouter un repas d'affaires</div>
        </div>
      ) : (
        filtered.map(r => (
          <div className="list-item" key={r.id} onClick={() => setModal(r)}>
            {/* Photo thumbnail ou icône */}
            {r.photo ? (
              <img src={r.photo} className="list-thumb" alt="ticket" />
            ) : (
              <div className="list-icon icon-repas">🍽️</div>
            )}

            <div className="list-body">
              <div className="list-title">{r.restaurant || '—'}</div>
              <div className="list-sub">
                {Array.isArray(r.participants) && r.participants.length > 0
                  ? `👥 ${r.participants.join(', ')}`
                  : r.motif || '—'}
              </div>
            </div>

            <div className="list-right">
              <div className="list-amount c-amber">{fmt(r.montant)} €</div>
              <div className="list-date-r">{fmtDate(r.date)}</div>
            </div>
          </div>
        ))
      )}

      {/* FAB */}
      <button className="fab" onClick={() => setModal('new')} title="Nouveau repas">+</button>

      {/* Modal */}
      {modal && (
        <RepasModal
          initial={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
          onDelete={modal !== 'new' ? () => handleDelete(modal.id) : null}
        />
      )}
    </div>
  );
}
