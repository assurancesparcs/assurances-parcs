import { useState } from 'react';
import { getRenouvellementTemplate, RENOUVELLEMENT_TEMPLATES, daysUntil } from '../constants';

const TEMPLATE_ORDER = ['info_90j', 'relance_60j', 'relance_30j', 'confirmation'];

export default function EcheanceRelanceModal({ contrat, onSave, onClose }) {
  const jours = daysUntil(contrat.dateEcheance);

  const defaultTemplate = (() => {
    if (jours === null) return 'info_90j';
    if (jours <= 30) return 'relance_30j';
    if (jours <= 60) return 'relance_60j';
    return 'info_90j';
  })();

  const [tab, setTab]         = useState('nouveau');
  const [template, setTemplate] = useState(defaultTemplate);
  const [note, setNote]       = useState('');
  const [copied, setCopied]   = useState(false);
  const [saving, setSaving]   = useState(false);

  const tpl = getRenouvellementTemplate(template, contrat);
  const relances = contrat.relancesRenouvellement || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(`Objet : ${tpl.objet}\n\n${tpl.corps}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSend = async () => {
    setSaving(true);
    const newRelance = { date: new Date().toISOString(), template, note: note.trim() };
    await onSave(contrat.id, {
      relancesRenouvellement: [...relances, newRelance],
    });
    setSaving(false);
    onClose();
  };

  const fmtTs = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts.toDate ? ts.toDate() : ts);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const echeanceStr = (() => {
    if (!contrat.dateEcheance) return '—';
    const d = contrat.dateEcheance.toDate ? contrat.dateEcheance.toDate() : new Date(contrat.dateEcheance);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  })();

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <div>
            <h2>🔄 Renouvellement — {contrat.clientName || '—'}</h2>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
              {contrat.type}{contrat.numero ? ` n°${contrat.numero}` : ''} · Échéance le {echeanceStr}
              {jours !== null && (
                <span style={{ marginLeft: 8, fontWeight: 700, color: jours <= 15 ? '#f87171' : jours <= 30 ? '#fb923c' : jours <= 60 ? '#fbbf24' : '#60a5fa' }}>
                  ({jours < 0 ? 'Échu' : `J-${jours}`})
                </span>
              )}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
          {[
            { key: 'nouveau',    label: 'Nouveau courrier' },
            { key: 'historique', label: `Historique (${relances.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                padding: '10px 16px', background: 'none', border: 'none',
                borderBottom: tab === t.key ? '2px solid var(--orange)' : '2px solid transparent',
                color: tab === t.key ? 'var(--orange)' : 'var(--text-muted)',
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="modal-form">
          {tab === 'nouveau' && (
            <>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {TEMPLATE_ORDER.map(k => {
                  const t = RENOUVELLEMENT_TEMPLATES[k];
                  return (
                    <button key={k} onClick={() => setTemplate(k)}
                      style={{
                        padding: '7px 13px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                        border: `2px solid ${template === k ? 'var(--orange)' : 'var(--border)'}`,
                        background: template === k ? 'rgba(255,107,53,.15)' : 'var(--bg-input)',
                        color: template === k ? 'var(--orange)' : 'var(--text-muted)',
                        cursor: 'pointer',
                      }}>
                      {t.icon} {t.label}
                    </button>
                  );
                })}
              </div>

              <div className="mail-preview">
                <div className="mail-objet">📧 Objet : {tpl.objet}</div>
                <div className="mail-corps">{tpl.corps}</div>
              </div>

              <div className="form-group">
                <label>Note interne (optionnel)</label>
                <input className="form-input" value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Ex : envoyé par email + appel téléphonique…" />
              </div>
            </>
          )}

          {tab === 'historique' && (
            <div className="relance-historique">
              {relances.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '24px 0', fontSize: 13 }}>
                  Aucun courrier de renouvellement envoyé pour ce contrat.
                </div>
              ) : (
                [...relances].reverse().map((r, i) => {
                  const tInfo = RENOUVELLEMENT_TEMPLATES[r.template];
                  return (
                    <div key={i} className="historique-row">
                      <div className="historique-dot" style={{ background: 'var(--orange)' }} />
                      {i < relances.length - 1 && <div className="historique-line" />}
                      <div style={{ flex: 1, marginLeft: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span className="historique-badge" style={{ background: 'rgba(255,107,53,.15)', color: 'var(--orange)' }}>
                            {tInfo?.icon || '✉️'} {tInfo?.label || r.template}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{fmtTs(r.date)}</span>
                        </div>
                        {r.note && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>{r.note}</div>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Fermer</button>
          {tab === 'nouveau' && (
            <>
              <button className="btn-copy" onClick={handleCopy}>
                {copied ? '✅ Copié !' : '📋 Copier le mail'}
              </button>
              <button className="btn-primary" onClick={handleSend} disabled={saving}>
                {saving ? 'Enregistrement…' : '✅ Marquer comme envoyé'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
