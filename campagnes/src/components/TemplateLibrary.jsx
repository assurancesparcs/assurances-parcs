import { useState } from 'react';
import { CAMPAGNE_TYPES, TEMPLATES, CABINET } from '../data.js';

function EmailPreview({ sujet, contenu }) {
  return (
    <div className="email-preview" style={{ maxHeight: 500, overflow: 'hidden' }}>
      <div className="email-preview-header">
        <div className="email-preview-from">De : {CABINET.contact} &lt;{CABINET.email}&gt;</div>
        <div className="email-preview-subject">{sujet}</div>
      </div>
      <div className="email-preview-body" style={{ maxHeight: 340 }}>{contenu}</div>
      <div className="email-preview-footer">
        {CABINET.nom} · {CABINET.telephone} · Orias {CABINET.orias}
      </div>
    </div>
  );
}

export default function TemplateLibrary({ onCreateCampagne }) {
  const [selected, setSelected] = useState(null);
  const [copied, setCopied]     = useState(null);

  const entries = Object.entries(TEMPLATES);

  const copy = async (key, tpl) => {
    const text = `Objet : ${tpl.sujet}\n\n${tpl.contenu}`;
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2500);
  };

  const sel = selected ? TEMPLATES[selected] : null;
  const selType = selected ? CAMPAGNE_TYPES[selected] : null;

  return (
    <div>
      <div className="section-header">
        <div className="section-title">📝 Modèles d'emails — Audioprothésistes</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {entries.length} modèles disponibles
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 480px' : '1fr', gap: 24 }}>
        {/* Grid */}
        <div className="template-grid">
          {entries.map(([key, tpl]) => {
            const type = CAMPAGNE_TYPES[key] || { icon: '📧', label: key, color: '#9ca3c0' };
            const isSel = selected === key;
            const isCopied = copied === key;
            return (
              <div
                key={key}
                className={`template-card ${isSel ? 'selected' : ''}`}
                onClick={() => setSelected(isSel ? null : key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="template-icon">{type.icon}</span>
                  <div>
                    <div className="template-type" style={{ color: type.color }}>{type.label}</div>
                    <div className="template-name">{tpl.label}</div>
                  </div>
                </div>
                <div className="template-sujet">✉️ {tpl.sujet}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <button
                    className="btn-ghost"
                    style={{ fontSize: 11, padding: '4px 10px' }}
                    onClick={e => { e.stopPropagation(); copy(key, tpl); }}
                  >
                    {isCopied ? '✅ Copié !' : '📋 Copier'}
                  </button>
                  <button
                    className="btn-primary"
                    style={{ fontSize: 11, padding: '4px 10px' }}
                    onClick={e => { e.stopPropagation(); onCreateCampagne(key); }}
                  >
                    + Créer campagne
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Preview panel */}
        {selected && sel && (
          <div style={{ position: 'sticky', top: 84 }}>
            <div className="editor-card">
              <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, marginBottom: 2 }}>{selType?.icon}</div>
                  <div style={{ fontWeight: 800, color: selType?.color, fontSize: 14 }}>{selType?.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sel.label}</div>
                </div>
                <button className="btn-icon" onClick={() => setSelected(null)}>✕</button>
              </div>

              <EmailPreview sujet={sel.sujet} contenu={sel.contenu} />

              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button className="btn-secondary" style={{ flex: 1 }}
                  onClick={() => copy(selected, sel)}>
                  {copied === selected ? '✅ Copié !' : '📋 Copier l\'email'}
                </button>
                <button className="btn-primary" style={{ flex: 1 }}
                  onClick={() => onCreateCampagne(selected)}>
                  + Créer campagne
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
