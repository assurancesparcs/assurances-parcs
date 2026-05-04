import { useState } from 'react';
import { getMEDEmailTemplate, MED_TEMPLATES, MED_STATUSES } from '../constants';
import { tenant } from '../tenant/config';

const TEMPLATE_ORDER = ['relance_1_cb', 'relance_2', 'med_officielle'];

const STATUS_AFTER = {
  relance_1_cb:   'relance_1',
  relance_2:      'relance_2',
  med_officielle: 'mise_en_demeure',
};

export default function MEDRelanceModal({ dossier, onSave, onClose }) {
  const [tab, setTab]           = useState('nouveau');
  const [template, setTemplate] = useState('relance_1_cb');
  const [note, setNote]         = useState('');
  const [copied, setCopied]     = useState(false);
  const [saving, setSaving]     = useState(false);

  const tpl = getMEDEmailTemplate(template, dossier);

  const handleCopy = () => {
    const text = `Objet : ${tpl.objet}\n\n${tpl.corps}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSend = async () => {
    setSaving(true);
    const newRelance = {
      date:     new Date().toISOString(),
      template,
      note:     note.trim(),
    };
    const relances   = [...(dossier.relances || []), newRelance];
    const newStatus  = STATUS_AFTER[template] || dossier.status;
    await onSave(dossier.id, { relances, status: newStatus, lastActivityAt: new Date().toISOString() });
    setSaving(false);
    onClose();
  };

  const fmtTs = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts.toDate ? ts.toDate() : ts);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const relances = dossier.relances || [];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <div>
            <h2>✉️ Courrier — {dossier.clientName || '—'}</h2>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
              {dossier.typeContrat} n°{dossier.numeroContrat || '—'} · {tenant.primaryInsurer.name} ·{' '}
              {dossier.montantDu ? Number(dossier.montantDu).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €' : '—'}
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
                borderBottom: tab === t.key ? '2px solid #f87171' : '2px solid transparent',
                color: tab === t.key ? '#f87171' : 'var(--text-muted)',
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="modal-form">
          {tab === 'nouveau' && (
            <>
              {/* Sélecteur de template */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {TEMPLATE_ORDER.map(k => {
                  const t = MED_TEMPLATES[k];
                  return (
                    <button key={k}
                      onClick={() => setTemplate(k)}
                      style={{
                        padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                        border: `2px solid ${template === k ? '#f87171' : 'var(--border)'}`,
                        background: template === k ? 'rgba(248,113,113,.15)' : 'var(--bg-input)',
                        color: template === k ? '#f87171' : 'var(--text-muted)',
                        cursor: 'pointer',
                      }}>
                      {t.icon} {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Aperçu mail */}
              <div className="mail-preview">
                <div className="mail-objet">📧 Objet : {tpl.objet}</div>
                <div className="mail-corps">{tpl.corps}</div>
              </div>

              {/* Note interne */}
              <div className="form-group">
                <label>Note interne (optionnel)</label>
                <input className="form-input" value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Ex : envoyé par email + courrier recommandé…" />
              </div>

              {/* Info statut futur */}
              <div style={{ fontSize: 12, color: 'var(--text-dim)', background: 'var(--bg-input)', borderRadius: 8, padding: '8px 12px' }}>
                En marquant comme envoyé, le statut du dossier passera à :
                <strong style={{ color: MED_STATUSES[STATUS_AFTER[template]]?.color, marginLeft: 6 }}>
                  {MED_STATUSES[STATUS_AFTER[template]]?.icon} {MED_STATUSES[STATUS_AFTER[template]]?.label}
                </strong>
              </div>
            </>
          )}

          {tab === 'historique' && (
            <div className="relance-historique">
              {relances.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '24px 0', fontSize: 13 }}>
                  Aucun courrier envoyé pour ce dossier.
                </div>
              ) : (
                [...relances].reverse().map((r, i) => {
                  const tInfo = MED_TEMPLATES[r.template];
                  return (
                    <div key={i} className="historique-row">
                      <div className="historique-dot" style={{ background: '#f87171' }} />
                      {i < relances.length - 1 && <div className="historique-line" />}
                      <div style={{ flex: 1, marginLeft: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span className="historique-badge" style={{ background: 'rgba(248,113,113,.15)', color: '#f87171' }}>
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
              <button className="btn-primary"
                style={{ background: '#f87171', borderColor: '#f87171' }}
                onClick={handleSend} disabled={saving}>
                {saving ? 'Enregistrement…' : '✅ Marquer comme envoyé'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
