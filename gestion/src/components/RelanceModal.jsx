import { useState } from 'react';
import { getEmailTemplate, fmtDate, joursDepuisRelance } from '../constants';

const TYPES_RELANCE = [
  { key: 'confirmation_reception', label: 'Confirmation de réception de déclaration', cible: 'client',    delai: '—',   icon: '📬' },
  { key: 'client_15j',             label: 'Client — Pièces manquantes (1re relance 15j)',  cible: 'client',    delai: '15j', icon: '👤' },
  { key: 'client_30j',             label: 'Client — Pièces manquantes (2e relance 30j)',   cible: 'client',    delai: '30j', icon: '👤' },
  { key: 'compagnie_15j',          label: 'Compagnie — Suivi dossier (1re relance 15j)',   cible: 'compagnie', delai: '15j', icon: '🏢' },
  { key: 'compagnie_30j',          label: 'Compagnie — Relance urgente (2e relance 30j)',  cible: 'compagnie', delai: '30j', icon: '🏢' },
  { key: 'cloture',                label: 'Clôture du sinistre — Notification au client',  cible: 'client',    delai: '—',   icon: '🏁' },
];

const TEMPLATE_LABELS = {
  confirmation_reception: { label: 'Confirmation réception', color: '#34d399', bg: 'rgba(52,211,153,.15)' },
  client_15j:             { label: 'Relance client 15j',      color: '#fbbf24', bg: 'rgba(251,191,36,.15)' },
  client_30j:             { label: 'Relance client 30j',      color: '#f87171', bg: 'rgba(248,113,113,.15)' },
  compagnie_15j:          { label: 'Relance compagnie 15j',   color: '#a78bfa', bg: 'rgba(167,139,250,.15)' },
  compagnie_30j:          { label: 'Relance compagnie 30j',   color: '#f87171', bg: 'rgba(248,113,113,.15)' },
  cloture:                { label: 'Clôture dossier',          color: '#34d399', bg: 'rgba(52,211,153,.15)' },
};

function fmtTs(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function RelanceModal({ sinistre, onSave, onClose, mode }) {
  const piecesMisquantes = (sinistre.pieces || []).filter(p => !p.recu).map(p => p.label);

  const joursClient    = joursDepuisRelance(sinistre, 'client');
  const joursCompagnie = joursDepuisRelance(sinistre, 'compagnie');

  const historique = (sinistre.relances || []).slice().reverse();

  const defaultType = !sinistre.derniereRelanceClient && !sinistre.derniereRelanceCompagnie
    ? 'confirmation_reception'
    : joursClient >= joursCompagnie
      ? (joursClient >= 30 ? 'client_30j' : 'client_15j')
      : (joursCompagnie >= 30 ? 'compagnie_30j' : 'compagnie_15j');

  const [selected, setSelected]   = useState(defaultType);
  const [note, setNote]           = useState('');
  const [copied, setCopied]       = useState(false);
  const [tab, setTab]             = useState('nouveau');

  const tpl      = getEmailTemplate(selected, sinistre, piecesMisquantes, mode);
  const fullText = `Objet : ${tpl.objet}\n\n${tpl.corps}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSave = async () => {
    const found = TYPES_RELANCE.find(t => t.key === selected);
    const cible = found?.cible || 'client';
    const delai = found?.delai || '—';
    const now   = new Date();
    const relance = { type: cible, delai, date: now, template: selected, note: note.trim(), envoye: true };
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
      <div className="modal" style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <div>
            <h2>✉️ Courriers — {sinistre.clientName}</h2>
            {sinistre.numero && <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>Dossier n° {sinistre.numero}</div>}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
          {[
            { key: 'nouveau',    label: '+ Nouveau courrier' },
            { key: 'historique', label: `📋 Historique (${historique.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.key ? 'var(--orange)' : 'transparent'}`,
                color: tab === t.key ? 'var(--text)' : 'var(--text-dim)',
                padding: '10px 16px', cursor: 'pointer', fontSize: 12, fontWeight: 700, marginBottom: -1,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* ── TAB NOUVEAU ── */}
          {tab === 'nouveau' && <>

            {/* Infos relances actuelles */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
              <label>TYPE DE COURRIER</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                {TYPES_RELANCE.map(t => {
                  const isSpecial = t.key === 'confirmation_reception' || t.key === 'cloture';
                  return (
                    <label key={t.key} className={`relance-option ${selected === t.key ? 'selected' : ''}`}
                      style={isSpecial ? { borderColor: 'rgba(52,211,153,.4)', background: selected === t.key ? 'rgba(52,211,153,.08)' : undefined } : {}}>
                      <input type="radio" name="relance" value={t.key}
                        checked={selected === t.key}
                        onChange={() => setSelected(t.key)}
                        style={{ display: 'none' }} />
                      <span className={`relance-cible ${t.cible}`}
                        style={isSpecial ? { background: 'rgba(52,211,153,.15)', color: '#34d399' } : {}}>
                        {t.icon} {t.key === 'confirmation_reception' ? 'Confirmation' : t.key === 'cloture' ? 'Clôture' : t.cible === 'client' ? 'Client' : 'Compagnie'}
                      </span>
                      <span style={{ flex: 1, fontSize: 12 }}>{t.label}</span>
                      {t.delai !== '—' && (
                        <span className={`relance-delai ${t.delai === '30j' ? 'urgent' : ''}`}>{t.delai}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Aperçu mail */}
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
                placeholder="Contexte, réponse attendue, précisions…" />
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={onClose}>Annuler</button>
              <button className="btn-primary" onClick={handleSave}>
                ✅ Marquer comme envoyé
              </button>
            </div>
          </>}

          {/* ── TAB HISTORIQUE ── */}
          {tab === 'historique' && (
            historique.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                <div style={{ fontSize: 13 }}>Aucun courrier enregistré pour ce dossier.</div>
              </div>
            ) : (
              <div className="relance-historique">
                {historique.map((r, i) => {
                  const tplInfo = TEMPLATE_LABELS[r.template] || { label: r.template, color: '#9ca3c0', bg: 'rgba(156,163,192,.15)' };
                  const dateStr = fmtTs(r.date);
                  return (
                    <div key={i} className="historique-row">
                      <div className="historique-check">
                        <div className="historique-dot" />
                        {i < historique.length - 1 && <div className="historique-line" />}
                      </div>
                      <div className="historique-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span className="historique-badge" style={{ background: tplInfo.bg, color: tplInfo.color }}>
                            ✅ {tplInfo.label}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>📅 {dateStr}</span>
                          {r.delai && r.delai !== '—' && (
                            <span style={{ fontSize: 10, color: 'var(--text-dim)', background: 'var(--bg-input)', padding: '1px 6px', borderRadius: 10 }}>
                              {r.delai}
                            </span>
                          )}
                        </div>
                        {r.note && (
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                            {r.note}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
