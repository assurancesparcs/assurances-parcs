import { useState } from 'react';
import { CV_OPTIONS } from '../utils/ikCalculator';

const BAREME_LABELS = {
  3: '0,529 €/km (≤5000 km)',
  4: '0,606 €/km (≤5000 km)',
  5: '0,636 €/km (≤5000 km)',
  6: '0,665 €/km (≤5000 km)',
  7: '0,697 €/km (≤5000 km)',
};

export default function SettingsModal({ settings, onSave, onClose }) {
  const [cv,  setCv]  = useState(settings.cv  || 5);
  const [nom, setNom] = useState(settings.nom || '');

  const save = () => {
    onSave({ cv: parseInt(cv), nom: nom.trim() });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-header">
          <span className="modal-title">⚙️ Réglages</span>
        </div>

        <div className="form-group">
          <label className="form-label">Votre nom / cabinet</label>
          <input
            className="form-input"
            value={nom}
            onChange={e => setNom(e.target.value)}
            placeholder="Dr. Dupont — Cabinet XYZ"
          />
        </div>

        <div className="form-group">
          <label className="form-label">CV fiscal du véhicule</label>
          <select className="form-input" value={cv} onChange={e => setCv(e.target.value)}>
            {CV_OPTIONS.map(v => (
              <option key={v} value={v}>{v} CV{v === 7 ? ' et plus' : ''}</option>
            ))}
          </select>
          <div className="form-hint">
            Taux {new Date().getFullYear()} — {BAREME_LABELS[cv] || ''}
          </div>
        </div>

        <div style={{
          background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
          borderRadius: 8, padding: '10px 13px', marginBottom: 16, fontSize: 12, color: 'var(--text2)',
          lineHeight: 1.6
        }}>
          <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 4 }}>
            Barème kilométrique {new Date().getFullYear()}
          </strong>
          ≤ 5 000 km : taux direct<br />
          5 001 – 20 000 km : taux réduit + forfait fixe<br />
          {'>'} 20 000 km : taux supérieur<br />
          <span style={{ marginTop: 4, display: 'block' }}>
            Source : Art. 6 B annexe IV CGI — mis à jour chaque année.
          </span>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={save}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}
