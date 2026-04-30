import { useState } from 'react';
import { getEmailTemplate, fmtDate, joursDepuisRelance } from '../constants';

const TYPES_RELANCE = [
  { key: 'client_15j',    label: 'Client — Pièces manquantes (1re relance 15j)',  cible: 'client',    delai: '15j' },
  { key: 'client_30j',    label: 'Client — Pièces manquantes (2e relance 30j)',   cible: 'client',    delai: '30j' },
  { key: 'compagnie_15j', label: 'Compagnie — Suivi dossier (1re relance 15j)',   cible: 'compagnie', delai: '15j' },
  { key: 'compagnie_30j', label: 'Compagnie — Relance urgente (2e relance 30j)',  cible: 'compagnie', delai: '30j' },
];

export default function RelanceModal({ sinistre, onSave, onClose }) {
  const piecesMisquantes = (sinistre.pieces || []).filter(p => !p.recu).map(p => p.label);

  const joursClient    = joursDepuisRelance(sinistre, 'client');
  const joursCompagnie = joursDepuisRelance(sinistre, 'compagnie');

  const defaultType = joursClient >= joursCompagnie
    ? (joursClient >= 30 ? 'client_30j' : 'client_15j')
    : (joursCompagnie >= 30 ? 'compagnie_30j' : 'compagnie_15j');

  const [selected, setSelected] = useState(defaultType);
  const [note, setNote]         = useState('');
  const [copied, setCopied]     = useState(false);

  const tpl = getEmailTemplate(selected, sinistre, piecesMisquantes);
  const fullText = `Objet : ${tpl.objet}\n\n${tpl.corps}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSave = async () => {
    const cible = TYPES_RELANCE.find(t => t.key === selected)?.cible || 'client';
    const delai = TYPES_RELANCE.find(t => t.key === selected)?.delai || '15j';
    const now   = new Date();
    const relance = { type: cible, delai, date: now, template: selected, note: note.trim() };
    const relances = [...(sinistre.relances || []), relance];
    const update = {
      relances,
      lastActivityAt: now,
      ...(cible === 'client'    ? { derniereRelanceClient:    now } : {}),
      ...(cible === 'compagnie' ? { derniereRelanceCompagnie: now } : {}),
    };
    await onSave(sinistre.id, update);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <h2>✉️ Relance — {sinistre.clientName}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Infos relances actuelles */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="relance-info-box">
              <div className="relance-info-label">Dernière relance client</div>
              <div className="relance-info-val">
                {sinistre.derniereRelanceClient
                  ? `${fmtDate(sinistre.derniereRelanceClient)} (${joursClient}j)`
                  : joursClient !== null ? `Jamais — ${joursClient}j depuis déclaration` : '—'}
              </div>
            </div>
            <div className="relance-info-box">
              <div className="relance-info-label">Dernière relance compagnie</div>
              <div className="relance-info-val">
                {sinistre.derniereRelanceCompagnie
                  ? `${fmtDate(sinistre.derniereRelanceCompagnie)} (${joursCompagnie}j)`
                  : joursCompagnie !== null ? `Jamais — ${joursCompagnie}j depuis déclaration` : '—'}
              </div>
            </div>
          </div>

          {/* Pièces manquantes */}
          {piecesMisquantes.length > 0 && (
            <div className="relance-pieces">
              <div className="relance-pieces-title">📎 Pièces manquantes ({piecesMisquantes.length})</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {piecesMisquantes.map((p, i) => (
                  <span key={i} className="piece-badge">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* Choix du template */}
          <div className="form-group">
            <label>TYPE DE RELANCE</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
              {TYPES_RELANCE.map(t => (
                <label key={t.key} className={`relance-option ${selected === t.key ? 'selected' : ''}`}>
                  <input type="radio" name="relance" value={t.key}
                    checked={selected === t.key}
                    onChange={() => setSelected(t.key)}
                    style={{ display: 'none' }} />
                  <span className={`relance-cible ${t.cible}`}>
                    {t.cible === 'client' ? '👤 Client' : '🏢 Compagnie'}
                  </span>
                  <span style={{ flex: 1, fontSize: 12 }}>{t.label}</span>
                  <span className={`relance-delai ${t.delai === '30j' ? 'urgent' : ''}`}>{t.delai}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Aperçu du mail */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ margin: 0 }}>APERÇU DU MAIL</label>
              <button onClick={handleCopy} className={`btn-copy ${copied ? 'copied' : ''}`}>
                {copied ? '✅ Copié !' : '📋 Copier le mail'}
              </button>
            </div>
            <div className="mail-preview">
              <div className="mail-objet">Objet : {tpl.objet}</div>
              <pre className="mail-corps">{tpl.corps}</pre>
            </div>
          </div>

          {/* Note interne */}
          <div className="form-group">
            <label>NOTE INTERNE (optionnel)</label>
            <textarea className="form-control" rows={2} value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Contexte de la relance, réponse attendue…" />
          </div>

          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>Annuler</button>
            <button className="btn-primary" onClick={handleSave}>
              ✅ Enregistrer la relance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
