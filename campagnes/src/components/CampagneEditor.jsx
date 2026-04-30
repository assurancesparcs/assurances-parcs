import { useState } from 'react';
import {
  CAMPAGNE_TYPES, CAMPAGNE_STATUTS, CAMPAGNE_RECURRENCES,
  TEMPLATES, CABINET, fmtDateLong,
} from '../data.js';

const EMPTY = {
  nom: '', type: 'rc_pro', statut: 'brouillon',
  cibles: { tous: true, prospectIds: [] },
  template: { sujet: '', contenu: '' },
  planification: { dateEnvoi: '', recurrence: 'unique' },
  envoye: 0, notes: '',
};

function set(obj, path, val) {
  const [head, ...rest] = path.split('.');
  if (!rest.length) return { ...obj, [head]: val };
  return { ...obj, [head]: set(obj[head] || {}, rest.join('.'), val) };
}

function EmailPreview({ sujet, contenu }) {
  if (!sujet && !contenu) return (
    <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
      Rédigez l'email pour voir l'aperçu
    </div>
  );
  return (
    <div className="email-preview">
      <div className="email-preview-header">
        <div className="email-preview-from">De : {CABINET.contact} &lt;{CABINET.email}&gt;</div>
        <div className="email-preview-subject">{sujet || '(Pas d\'objet)'}</div>
      </div>
      <div className="email-preview-body">{contenu}</div>
      <div className="email-preview-footer">
        {CABINET.nom} · {CABINET.telephone} · Orias {CABINET.orias}
      </div>
    </div>
  );
}

export default function CampagneEditor({ campagne, prospects, onSave, onCancel }) {
  const isNew = !campagne?.id;
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...campagne,
    cibles:       { ...EMPTY.cibles,       ...(campagne?.cibles       || {}) },
    template:     { ...EMPTY.template,     ...(campagne?.template     || {}) },
    planification:{ ...EMPTY.planification,...(campagne?.planification || {}) },
  }));
  const [tab, setTab]       = useState('config');
  const [copied, setCopied] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  const upd = (path, val) => setForm(f => set(f, path, val));

  const loadTemplate = (type) => {
    const tpl = TEMPLATES[type];
    if (!tpl) { upd('type', type); return; }
    const doLoad = !form.template.sujet || window.confirm('Charger le modèle pour ce type ? Le contenu actuel sera remplacé.');
    if (doLoad) {
      setForm(f => ({ ...f, type, template: { sujet: tpl.sujet, contenu: tpl.contenu } }));
    } else {
      upd('type', type);
    }
  };

  const toggleProspect = (id) => {
    const ids = form.cibles.prospectIds || [];
    upd('cibles.prospectIds', ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);
  };

  const copyEmail = async () => {
    const text = `Objet : ${form.template.sujet}\n\n${form.template.contenu}`;
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    if (!form.nom.trim())           { alert('Veuillez saisir un nom pour la campagne.'); return; }
    if (!form.template.sujet.trim()){ alert('Veuillez saisir un objet d\'email.'); return; }
    const nb = form.cibles.tous ? prospects.length : (form.cibles.prospectIds || []).length;
    if (nb === 0) { alert('Veuillez sélectionner au moins un destinataire.'); return; }
    onSave(form);
  };

  const nbCibles = form.cibles.tous ? prospects.length : (form.cibles.prospectIds || []).length;
  const typeInfo = CAMPAGNE_TYPES[form.type] || {};

  const filteredProspects = prospects.filter(p =>
    !clientSearch ||
    p.nom?.toLowerCase().includes(clientSearch.toLowerCase()) ||
    p.cabinet?.toLowerCase().includes(clientSearch.toLowerCase()) ||
    p.email?.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const TABS = [
    { id: 'config', label: '⚙️ Config'          },
    { id: 'cibles', label: `👥 Destinataires (${nbCibles})` },
    { id: 'email',  label: '✉️ Email'            },
    { id: 'planif', label: '📅 Planification'    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="section-header">
        <div className="section-title">
          <button className="btn-ghost" onClick={onCancel}>← Retour</button>
          <span style={{ color: 'var(--text-dim)' }}>|</span>
          {isNew ? '📧 Nouvelle campagne' : `✏️ ${form.nom || 'Modifier la campagne'}`}
        </div>
        <div className="section-actions">
          <button className="btn-secondary" onClick={onCancel}>Annuler</button>
          <button className="btn-primary" onClick={handleSave}>
            {isNew ? '+ Créer la campagne' : '💾 Enregistrer'}
          </button>
        </div>
      </div>

      <div className="editor-layout">
        {/* Main */}
        <div className="editor-main">
          {/* Tabs */}
          <div className="editor-tabs">
            {TABS.map(t => (
              <button key={t.id} className={`editor-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>

          {/* ── CONFIG ── */}
          {tab === 'config' && (
            <div className="editor-card">
              <div className="editor-card-title">⚙️ Configuration</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label>Nom de la campagne *</label>
                  <input className="form-control" placeholder="Ex : Rappel RC Pro — Automne 2025"
                    value={form.nom} onChange={e => upd('nom', e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Type de campagne *</label>
                    <select className="form-control" value={form.type}
                      onChange={e => loadTemplate(e.target.value)}>
                      {Object.entries(CAMPAGNE_TYPES).map(([k, v]) => (
                        <option key={k} value={k}>{v.icon} {v.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Statut</label>
                    <select className="form-control" value={form.statut}
                      onChange={e => upd('statut', e.target.value)}>
                      {Object.entries(CAMPAGNE_STATUTS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Type card */}
                <div style={{
                  background: 'var(--bg-input)', border: `1px solid ${typeInfo.color}33`,
                  borderLeft: `4px solid ${typeInfo.color}`,
                  borderRadius: 'var(--rs)', padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <span style={{ fontSize: 32 }}>{typeInfo.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: typeInfo.color }}>{typeInfo.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{typeInfo.desc}</div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes internes</label>
                  <textarea className="form-control" rows={3}
                    placeholder="Objectif, contexte, remarques pour l'équipe…"
                    value={form.notes} onChange={e => upd('notes', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ── CIBLES ── */}
          {tab === 'cibles' && (
            <div className="editor-card">
              <div className="editor-card-title">👥 Destinataires</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="cibles-mode-btns">
                  <button className={`cible-mode-btn ${form.cibles.tous ? 'active' : ''}`}
                    onClick={() => upd('cibles', { tous: true, prospectIds: [] })}>
                    👥 Tous les prospects / clients<br />
                    <span style={{ fontSize: 11, fontWeight: 400 }}>({prospects.length} contact{prospects.length !== 1 ? 's' : ''})</span>
                  </button>
                  <button className={`cible-mode-btn ${!form.cibles.tous ? 'active' : ''}`}
                    onClick={() => upd('cibles', { tous: false, prospectIds: [] })}>
                    ✋ Sélection manuelle<br />
                    <span style={{ fontSize: 11, fontWeight: 400 }}>Choisissez contact par contact</span>
                  </button>
                </div>

                {form.cibles.tous ? (
                  <div className="tous-info-box">
                    <span style={{ fontSize: 28 }}>👥</span>
                    <div>
                      <div style={{ fontWeight: 700 }}>Tous les contacts sélectionnés</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                        {prospects.length} destinataire{prospects.length !== 1 ? 's' : ''} — la liste sera mise à jour automatiquement
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="search-wrap">
                      <span className="search-icon">🔍</span>
                      <input className="search-input" placeholder="Filtrer les contacts…"
                        value={clientSearch} onChange={e => setClientSearch(e.target.value)} />
                    </div>
                    <div className="clients-checklist">
                      {filteredProspects.length === 0 && (
                        <div style={{ padding: 16, color: 'var(--text-dim)', fontSize: 13 }}>
                          Aucun contact trouvé
                        </div>
                      )}
                      {filteredProspects.map(p => {
                        const sel = (form.cibles.prospectIds || []).includes(p.id);
                        return (
                          <label key={p.id}
                            className={`client-check-item ${sel ? 'selected' : ''}`}
                            onClick={() => toggleProspect(p.id)}
                          >
                            <input type="checkbox" checked={sel} onChange={() => toggleProspect(p.id)} />
                            <div className="client-mini-avatar">
                              {p.nom?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <div className="client-check-name">{p.nom}</div>
                              <div className="client-check-sub">{p.cabinet} {p.email ? `· ${p.email}` : ''}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {(form.cibles.prospectIds || []).length} sélectionné{(form.cibles.prospectIds || []).length > 1 ? 's' : ''}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── EMAIL ── */}
          {tab === 'email' && (
            <div className="editor-card">
              <div className="editor-card-title">✉️ Contenu de l'email</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Template picker */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 8, letterSpacing: '.5px', textTransform: 'uppercase' }}>
                    Charger un modèle
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {Object.entries(TEMPLATES).map(([k]) => {
                      const t = CAMPAGNE_TYPES[k];
                      if (!t) return null;
                      return (
                        <button key={k}
                          onClick={() => loadTemplate(k)}
                          style={{
                            background: form.type === k ? `${t.color}22` : 'var(--bg-input)',
                            border: `1px solid ${form.type === k ? t.color : 'var(--border)'}`,
                            borderRadius: 8, padding: '5px 10px',
                            fontSize: 11, fontWeight: 600,
                            color: form.type === k ? t.color : 'var(--text-dim)',
                            transition: 'all .2s',
                          }}
                        >
                          {t.icon} {t.label.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label>Objet de l'email *</label>
                  <input className="form-control"
                    placeholder="Objet qui apparaîtra dans la boîte de réception"
                    value={form.template.sujet}
                    onChange={e => upd('template.sujet', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Corps de l'email *</label>
                  <textarea className="form-control" rows={16}
                    style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7 }}
                    placeholder="Rédigez le contenu du message…"
                    value={form.template.contenu}
                    onChange={e => upd('template.contenu', e.target.value)} />
                </div>

                {copied ? (
                  <div className="copy-banner">✅ Email copié dans le presse-papiers !</div>
                ) : (
                  <button className="btn-primary" style={{ alignSelf: 'flex-start' }} onClick={copyEmail}>
                    📋 Copier l'email complet
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── PLANIFICATION ── */}
          {tab === 'planif' && (
            <div className="editor-card">
              <div className="editor-card-title">📅 Planification</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date d'envoi prévue</label>
                    <input type="date" className="form-control"
                      value={form.planification.dateEnvoi}
                      onChange={e => upd('planification.dateEnvoi', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Récurrence</label>
                    <select className="form-control" value={form.planification.recurrence}
                      onChange={e => upd('planification.recurrence', e.target.value)}>
                      {Object.entries(CAMPAGNE_RECURRENCES).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Résumé planif */}
                <div style={{
                  background: 'var(--bg-input)', border: '1px solid var(--border)',
                  borderRadius: 'var(--r)', padding: 16,
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                  {[
                    { icon: '📅', label: form.planification.dateEnvoi
                        ? fmtDateLong(form.planification.dateEnvoi)
                        : 'Aucune date planifiée' },
                    { icon: '🔄', label: CAMPAGNE_RECURRENCES[form.planification.recurrence] || 'Envoi unique' },
                    { icon: '👥', label: `${nbCibles} destinataire${nbCibles !== 1 ? 's' : ''} ciblé${nbCibles !== 1 ? 's' : ''}` },
                    { icon: '✉️', label: `${form.envoye || 0} email${(form.envoye || 0) !== 1 ? 's' : ''} déjà envoyé${(form.envoye || 0) !== 1 ? 's' : ''}` },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13 }}>
                      <span>{r.icon}</span><span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label>Emails envoyés (compteur manuel)</label>
                  <input type="number" min="0" className="form-control"
                    style={{ maxWidth: 160 }}
                    value={form.envoye}
                    onChange={e => upd('envoye', Number(e.target.value))} />
                </div>

                <div className="info-box blue">
                  <strong>Intégration email :</strong> Pour l'envoi automatique, connectez un service comme Mailjet ou SendGrid.
                  En attendant, utilisez "Copier l'email" dans l'onglet Email pour l'envoyer depuis votre client mail.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="editor-sidebar">
          {/* Résumé */}
          <div className="editor-card">
            <div className="editor-card-title">📋 Résumé</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{typeInfo.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: typeInfo.color }}>{typeInfo.label}</div>
                  <span className="badge" style={{
                    color: (CAMPAGNE_STATUTS[form.statut] || {}).color,
                    background: (CAMPAGNE_STATUTS[form.statut] || {}).bg,
                  }}>
                    {(CAMPAGNE_STATUTS[form.statut] || {}).label}
                  </span>
                </div>
              </div>
              {[
                { label: 'Destinataires', val: `${nbCibles} contact${nbCibles !== 1 ? 's' : ''}` },
                { label: 'Date d\'envoi', val: form.planification.dateEnvoi
                    ? new Date(form.planification.dateEnvoi).toLocaleDateString('fr-FR')
                    : '—' },
                { label: 'Récurrence', val: CAMPAGNE_RECURRENCES[form.planification.recurrence] || '—' },
                { label: 'Envoyés', val: form.envoye || 0 },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                  <span style={{ color: 'var(--text-dim)' }}>{r.label}</span>
                  <span style={{ fontWeight: 600 }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Aperçu email */}
          <div className="editor-card">
            <div className="editor-card-title">👁️ Aperçu email</div>
            <EmailPreview sujet={form.template.sujet} contenu={form.template.contenu} />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn-primary" onClick={handleSave}>
              {isNew ? '+ Créer la campagne' : '💾 Enregistrer'}
            </button>
            <button className="btn-secondary" onClick={onCancel}>Annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
}
