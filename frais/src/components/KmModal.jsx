import { useState, useRef, useCallback } from 'react';
import { calcTripIK, calcIKTotal } from '../utils/ikCalculator';
import { getRouteDistance, parseVoiceTrip } from '../utils/routing';

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ── Speech recognition ─────────────────────────────────────────────────────
const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;

function useMic(onResult) {
  const [active, setActive] = useState(false);
  const recRef = useRef(null);

  const start = useCallback(() => {
    if (!SR) { alert('Reconnaissance vocale non disponible sur ce navigateur.'); return; }
    if (active) { recRef.current?.stop(); setActive(false); return; }

    const r = new SR();
    r.lang            = 'fr-FR';
    r.continuous      = false;
    r.interimResults  = false;
    r.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript || '';
      onResult(text);
      setActive(false);
    };
    r.onerror  = () => setActive(false);
    r.onend    = () => setActive(false);
    recRef.current = r;
    r.start();
    setActive(true);
  }, [active, onResult]);

  return { active, start, supported: Boolean(SR) };
}

// ── Small mic button ───────────────────────────────────────────────────────
function MicBtn({ onResult }) {
  const { active, start, supported } = useMic(useCallback(onResult, []));
  if (!supported) return null;
  return (
    <button
      type="button"
      className={`mic-btn${active ? ' mic-active' : ''}`}
      onClick={start}
      title={active ? 'Arrêter' : 'Dicter'}
    >
      {active ? '🔴' : '🎤'}
    </button>
  );
}

// ── Main modal ─────────────────────────────────────────────────────────────
export default function KmModal({ trips, settings, onSave, onClose, onDelete, initial }) {
  const isEdit = Boolean(initial?.id);

  const [date,    setDate]    = useState(initial?.date    || today());
  const [depart,  setDepart]  = useState(initial?.depart  || '');
  const [arrivee, setArrivee] = useState(initial?.arrivee || '');
  const [km,      setKm]      = useState(initial?.km      || '');
  const [motif,   setMotif]   = useState(initial?.motif   || '');
  const [saving,  setSaving]  = useState(false);
  const [routing, setRouting] = useState(false);
  const [routeErr, setRouteErr] = useState('');

  // Full-sentence mic
  const [voiceActive, setVoiceActive] = useState(false);
  const voiceRef = useRef(null);

  const year = date.slice(0, 4);
  const cv   = settings?.cv || 5;

  // Cumul km de l'année (hors ce trajet si édition)
  const cumBefore = (() => {
    return trips
      .filter(t => t.date?.slice(0, 4) === year && !(isEdit && t.id === initial.id))
      .reduce((s, t) => s + (t.km || 0), 0);
  })();

  const tripKm   = parseFloat(km) || 0;
  const tripIK   = calcTripIK(tripKm, cumBefore, cv, parseInt(year));
  const cumAfter = cumBefore + tripKm;
  const yearTotal = calcIKTotal(cumAfter, cv, parseInt(year));
  const valid     = depart.trim() && arrivee.trim() && tripKm > 0 && date;

  // ── Calculer la distance automatiquement ──
  const handleCalcKm = async () => {
    if (!depart.trim() || !arrivee.trim()) return;
    setRouting(true);
    setRouteErr('');
    try {
      const d = await getRouteDistance(depart.trim(), arrivee.trim());
      setKm(String(d));
    } catch (e) {
      setRouteErr(e.message || 'Calcul impossible');
    } finally {
      setRouting(false);
    }
  };

  // ── Saisie vocale complète ──
  const startVoiceTrip = () => {
    if (!SR) { alert('Reconnaissance vocale non disponible sur ce navigateur.'); return; }
    if (voiceActive) { voiceRef.current?.stop(); setVoiceActive(false); return; }

    const r = new SR();
    r.lang           = 'fr-FR';
    r.continuous     = false;
    r.interimResults = false;
    r.onresult = async (e) => {
      const text = e.results[0]?.[0]?.transcript || '';
      setVoiceActive(false);
      const parsed = parseVoiceTrip(text);
      if (parsed.depart)  setDepart(parsed.depart);
      if (parsed.arrivee) setArrivee(parsed.arrivee);
      if (parsed.motif)   setMotif(parsed.motif);
      // Auto-calcul km
      if (parsed.depart && parsed.arrivee) {
        setRouting(true);
        setRouteErr('');
        try {
          const d = await getRouteDistance(parsed.depart, parsed.arrivee);
          setKm(String(d));
        } catch (err) {
          setRouteErr(err.message);
        } finally {
          setRouting(false);
        }
      }
    };
    r.onerror = () => setVoiceActive(false);
    r.onend   = () => setVoiceActive(false);
    voiceRef.current = r;
    r.start();
    setVoiceActive(true);
  };

  // ── Save ──
  const handleSave = async () => {
    if (!valid) return;
    setSaving(true);
    try {
      await onSave({ date, depart: depart.trim(), arrivee: arrivee.trim(), km: tripKm, motif: motif.trim() });
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

        {/* ── Saisie vocale complète ── */}
        {SR && (
          <button
            type="button"
            className={`voice-quick-btn${voiceActive ? ' active' : ''}`}
            onClick={startVoiceTrip}
          >
            {voiceActive
              ? '🔴 Écoute… (ex: "Paris à Lyon visite client")'
              : '🎤 Saisie vocale complète'}
          </button>
        )}

        {/* Date */}
        <div className="form-group">
          <label className="form-label">Date</label>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        {/* Départ + Arrivée */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Départ</label>
            <div className="input-with-mic">
              <input
                className="form-input"
                value={depart}
                onChange={e => setDepart(e.target.value)}
                placeholder="Ville…"
                autoCapitalize="words"
              />
              <MicBtn onResult={setDepart} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Arrivée</label>
            <div className="input-with-mic">
              <input
                className="form-input"
                value={arrivee}
                onChange={e => setArrivee(e.target.value)}
                placeholder="Ville…"
                autoCapitalize="words"
              />
              <MicBtn onResult={setArrivee} />
            </div>
          </div>
        </div>

        {/* Bouton calcul auto distance */}
        <button
          type="button"
          className="calc-distance-btn"
          onClick={handleCalcKm}
          disabled={!depart.trim() || !arrivee.trim() || routing}
        >
          {routing
            ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Calcul en cours…</>
            : <>📍 Calculer la distance automatiquement</>}
        </button>
        {routeErr && (
          <div style={{ fontSize: 12, color: 'var(--red)', marginTop: -8, marginBottom: 12 }}>
            ⚠️ {routeErr}
          </div>
        )}

        {/* Km + CV */}
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
              step="1"
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

        {/* Motif */}
        <div className="form-group">
          <label className="form-label">Motif professionnel</label>
          <div className="input-with-mic">
            <input
              className="form-input"
              value={motif}
              onChange={e => setMotif(e.target.value)}
              placeholder="Visite client, formation…"
              autoCapitalize="sentences"
            />
            <MicBtn onResult={setMotif} />
          </div>
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

        {/* Delete */}
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
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Annuler</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!valid || saving}>
            {saving ? '…' : isEdit ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}
