import { useState, useRef } from 'react';

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.65));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function RepasModal({ onSave, onClose, onDelete, initial }) {
  const isEdit = Boolean(initial?.id);

  const [date,         setDate]         = useState(initial?.date         || today());
  const [restaurant,   setRestaurant]   = useState(initial?.restaurant   || '');
  const [montant,      setMontant]      = useState(initial?.montant      || '');
  const [motif,        setMotif]        = useState(initial?.motif        || '');
  const [participants, setParticipants] = useState(initial?.participants || []);
  const [pInput,       setPInput]       = useState('');
  const [photo,        setPhoto]        = useState(initial?.photo        || null);
  const [saving,       setSaving]       = useState(false);
  const [compressing,  setCompressing]  = useState(false);
  const fileRef = useRef();

  // ── Participants ──────────────────────────────────────────────────────
  const addParticipant = () => {
    const name = pInput.trim();
    if (!name || participants.includes(name)) { setPInput(''); return; }
    setParticipants(prev => [...prev, name]);
    setPInput('');
  };

  const removeParticipant = (name) => {
    setParticipants(prev => prev.filter(p => p !== name));
  };

  const handlePKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addParticipant(); }
  };

  // ── Photo ─────────────────────────────────────────────────────────────
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    try {
      const compressed = await compressImage(file);
      setPhoto(compressed);
    } finally {
      setCompressing(false);
      e.target.value = '';
    }
  };

  // ── Save ──────────────────────────────────────────────────────────────
  const valid = restaurant.trim() && parseFloat(montant) > 0 && date && participants.length > 0;

  const handleSave = async () => {
    if (!valid) return;
    setSaving(true);
    try {
      await onSave({
        date,
        restaurant:   restaurant.trim(),
        montant:      parseFloat(montant),
        motif:        motif.trim(),
        participants,
        photo:        photo || null,
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
            {isEdit ? '✏️ Modifier repas' : '🍽️ Nouveau repas'}
          </span>
        </div>

        {/* Date + Montant */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Montant (€)</label>
            <input
              type="number"
              inputMode="decimal"
              className="form-input"
              value={montant}
              onChange={e => setMontant(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Restaurant */}
        <div className="form-group">
          <label className="form-label">Restaurant</label>
          <input
            className="form-input"
            value={restaurant}
            onChange={e => setRestaurant(e.target.value)}
            placeholder="Nom du restaurant"
            autoCapitalize="words"
          />
        </div>

        {/* Motif */}
        <div className="form-group">
          <label className="form-label">Motif professionnel</label>
          <input
            className="form-input"
            value={motif}
            onChange={e => setMotif(e.target.value)}
            placeholder="Déjeuner client, réunion, prospection…"
            autoCapitalize="sentences"
          />
        </div>

        {/* Participants — OBLIGATOIRE */}
        <div className="form-group">
          <label className="form-label">
            Participants <span style={{ color: 'var(--amber)' }}>*</span>
          </label>
          <div className="chips-input-row">
            <input
              className="form-input"
              value={pInput}
              onChange={e => setPInput(e.target.value)}
              onKeyDown={handlePKey}
              onBlur={addParticipant}
              placeholder="Nom, prénom (Entrée pour ajouter)"
              autoCapitalize="words"
            />
            <button className="btn btn-ghost btn-sm" onClick={addParticipant} type="button">+</button>
          </div>
          {participants.length > 0 && (
            <div className="chips">
              {participants.map(p => (
                <div className="chip" key={p}>
                  <span>{p}</span>
                  <button className="chip-x" onClick={() => removeParticipant(p)}>×</button>
                </div>
              ))}
            </div>
          )}
          {participants.length === 0 && (
            <div className="form-hint" style={{ color: 'var(--amber)' }}>
              ⚠️ Obligatoire : indiquez toutes les personnes présentes
            </div>
          )}
        </div>

        {/* Photo ticket */}
        <div className="form-group">
          <label className="form-label">Photo du ticket / addition</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
          {photo ? (
            <div className="photo-container">
              <img src={photo} className="photo-preview" alt="Ticket" />
              <button className="photo-remove" onClick={() => setPhoto(null)}>✕</button>
            </div>
          ) : (
            <div
              className="photo-upload-btn"
              onClick={() => fileRef.current?.click()}
            >
              {compressing ? (
                <>
                  <div className="spinner" style={{ width: 24, height: 24 }} />
                  <span>Compression…</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 28 }}>📷</span>
                  <span>Prendre une photo ou importer</span>
                  <span style={{ fontSize: 11 }}>Ticket, addition, reçu</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Delete (edit mode) */}
        {isEdit && onDelete && (
          <button
            className="btn btn-danger btn-full"
            style={{ marginBottom: 10 }}
            onClick={() => onDelete(initial.id)}
            disabled={saving}
          >
            🗑️ Supprimer ce repas
          </button>
        )}

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>
            Annuler
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!valid || saving || compressing}
          >
            {saving ? '…' : isEdit ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}
