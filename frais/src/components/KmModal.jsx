import { useState, useMemo } from 'react';
import { calcTripIK, calcIKTotal } from '../utils/ikCalculator';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function KmModal({ trips, settings, onSave, onClose, onDelete, initial }) {
  const isEdit = Boolean(initial?.id);

  const [date,    setDate]    = useState(initial?.date    || today());
  const [depart,  setDepart]  = useState(initial?.depart  || '');
  const [arrivee, setArrivee] = useState(initial?.arrivee || '');
  const [km,      setKm]      = useState(initial?.km      || '');
  const [motif,   setMotif]   = useState(initial?.motif   || '');
  const [saving,  setSaving]  = useState(false);

  const year = date.slice(0, 4);
  const cv   = settings?.cv || 5;

  // Cumul km pour l'année (sans ce trajet si édition)
  const cumBefore = useMemo(() => {
    return trips
      .filter(t => {
        if (t.date?.slice(0, 4) !== year) return false;
        if (isEdit && t.id === initial.id) return false;
        return true;
      })
      .reduce((s, t) => s + (t.km || 0), 0);
  }, [trips, year, isEdit, initial]);

  const tripKm    = parseFloat(km) || 0;
  const tripIK    = calcTripIK(tripKm, cumBefore, cv, parseInt(year));
  const cumAfter  = cumBefore + tripKm;
  const yearTotal = calcIKTotal(cumAfter, cv, parseInt(year));

  const valid = depart.trim() && arrivee.trim() && tripKm > 0 && date;

  const handleSave = async () => {
    if (!valid) return;
    setSaving(true);
    try {
      await onSave({
        date,
        depart:  depart.trim(),
        arrivee: arrivee.trim(),
        km:      tripKm,
        motif:   motif.trim(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-header">
          <span className="modal-title">
            {isEdit ? '✏️ Modifier trajet' : '🚗 Nouveau trajet'}
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Départ</label>
            <input
              className="form-input"
              value={depart}
              onChange={e => setDepart(e.target.value)}
              placeholder="Ville / adresse"
              autoCapitalize="words"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Arrivée</label>
            <input
              className="form-input"
              value={arrivee}
              onChange={e => setArrivee(e.target.value)}
              placeholder="Ville / adresse"
              autoCapitalize="words"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Distance (km)</label>
            <input
              type="number"
              inputMode="decimal"
              className="form-input"
              value={km}
              onChange={e => setKm(e.target.value)}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label className="form-label">CV fiscal</label>
            <input
              className="form-input"
              value={`${cv} CV`}
              readOnly
              style={{ color: 'var(--text2)', cursor: 'default' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Motif professionnel</label>
          <input
            className="form-input"
            value={motif}
            onChange={e => setMotif(e.target.value)}
            placeholder="Visite client, formation, déplacement…"
            autoCapitalize="sentences"
          />
        </div>

        {/* IK preview */}
        {tripKm > 0 && (
          <div className="ik-preview">
            <div>
              <div className="ik-preview-label">Indemnité ce trajet</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
                Cumul {year} : {cumAfter.toLocaleString('fr-FR')} km → {yearTotal.toFixed(2)} €
              </div>
            </div>
            <div className="ik-preview-value">+ {tripIK.toFixed(2)} €</div>
          </div>
        )}

        {isEdit && onDelete && (
          <button
            className="btn btn-danger btn-full"
            style={{ marginBottom: 10 }}
            onClick={() => onDelete(initial.id)}
            disabled={saving}
          >
            🗑️ Supprimer ce trajet
          </button>
        )}

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>
            Annuler
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!valid || saving}
          >
            {saving ? '…' : isEdit ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}
