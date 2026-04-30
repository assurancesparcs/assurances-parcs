import { useState, useMemo, useRef } from 'react';
import { PROSPECT_STATUTS, STRUCTURE_TYPES, fmtDate, fmtDateLong } from '../data.js';

const EMPTY_PROSPECT = {
  nom: '', cabinet: '', email: '', telephone: '',
  ville: '', structure: 'independant', statut: 'prospect',
  notes: '',
};

// ─── Modal prospect (édition + historique) ────────────────────────────────────
function ProspectModal({ prospect, envois, campagnes, onSave, onClose }) {
  const isNew = !prospect?.id;
  const [form, setForm] = useState({ ...EMPTY_PROSPECT, ...prospect });
  const [tab, setTab] = useState('infos');
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const historique = useMemo(() => {
    if (isNew) return [];
    return (envois || [])
      .filter(e => e.prospectId === prospect.id)
      .map(e => ({ ...e, campagne: campagnes?.find(c => c.id === e.campagneId) }))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [envois, campagnes, prospect?.id, isNew]);

  const handleSave = () => {
    if (!form.nom.trim()) { alert('Veuillez saisir un nom.'); return; }
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isNew ? '👤 Nouveau contact' : `✏️ ${form.nom}`}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {!isNew && (
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
            {[
              { id: 'infos', label: 'Informations' },
              { id: 'notes', label: `Notes` },
              { id: 'historique', label: `Historique (${historique.length})` },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: 'none', border: 'none', padding: '10px 16px',
                fontSize: 13, fontWeight: tab === t.id ? 700 : 400,
                color: tab === t.id ? 'var(--orange)' : 'var(--text-dim)',
                borderBottom: tab === t.id ? '2px solid var(--orange)' : '2px solid transparent',
                cursor: 'pointer', marginBottom: -1,
              }}>{t.label}</button>
            ))}
          </div>
        )}

        <div className="modal-body prospect-form">
          {tab === 'infos' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom / Prénom *</label>
                  <input className="form-control" placeholder="Dr Dupont"
                    value={form.nom} onChange={e => upd('nom', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Statut</label>
                  <select className="form-control" value={form.statut}
                    onChange={e => upd('statut', e.target.value)}>
                    {Object.entries(PROSPECT_STATUTS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Cabinet / Enseigne</label>
                <input className="form-control" placeholder="Centre Audition Plus…"
                  value={form.cabinet} onChange={e => upd('cabinet', e.target.value)} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" placeholder="contact@cabinet-audio.fr"
                    value={form.email} onChange={e => upd('email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input className="form-control" placeholder="06 XX XX XX XX"
                    value={form.telephone} onChange={e => upd('telephone', e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ville</label>
                  <input className="form-control" placeholder="Bayeux, Caen…"
                    value={form.ville} onChange={e => upd('ville', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Type de structure</label>
                  <select className="form-control" value={form.structure}
                    onChange={e => upd('structure', e.target.value)}>
                    {Object.entries(STRUCTURE_TYPES).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {form.statut === 'blacklist' && (
                <div className="info-box" style={{
                  background: 'rgba(107,116,148,0.1)', borderColor: 'rgba(107,116,148,0.3)',
                  fontSize: 12, color: 'var(--text-dim)',
                }}>
                  Ce contact ne recevra plus aucun email automatique.
                </div>
              )}
            </>
          )}

          {tab === 'notes' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Notes libres</label>
              <textarea className="form-control" rows={8}
                placeholder="Remarques, historique contact, besoins identifiés, date de rappel…"
                value={form.notes} onChange={e => upd('notes', e.target.value)} />
            </div>
          )}

          {tab === 'historique' && (
            <div>
              {historique.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: 13, padding: '24px 0' }}>
                  Aucun email envoyé à ce contact.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {historique.map(e => {
                    const statutColors = {
                      envoye: '#60a5fa', relance1: '#fbbf24', relance2: '#fb923c',
                      repondu: '#34d399', termine: '#6b7494',
                    };
                    const statutLabels = {
                      envoye: 'Envoyé', relance1: 'Relance 1', relance2: 'Relance 2',
                      repondu: 'Répondu', termine: 'Terminé',
                    };
                    return (
                      <div key={e.id} style={{
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        borderRadius: 10, padding: '12px 14px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{e.campagneNom || e.campagne?.nom || 'Campagne inconnue'}</div>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                            color: statutColors[e.statut] || '#9ca3c0',
                            background: (statutColors[e.statut] || '#9ca3c0') + '22',
                          }}>{statutLabels[e.statut] || e.statut}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          {e.envoye1At && <span>✉️ Envoyé le {fmtDate(e.envoye1At)}</span>}
                          {e.relance1At && <span>🔔 Relance 1 : {fmtDate(e.relance1At)}</span>}
                          {e.relance2At && <span>⚠️ Relance 2 : {fmtDate(e.relance2At)}</span>}
                          {e.reponduAt && <span>✅ Répondu le {fmtDate(e.reponduAt)}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          {tab !== 'historique' && (
            <button className="btn-primary" onClick={handleSave}>
              {isNew ? '+ Ajouter' : '💾 Enregistrer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Import CSV ────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return { rows: [], headers: [] };

  const sep = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(sep).map(h => h.trim().toLowerCase()
    .replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a').replace(/[ùûü]/g, 'u')
    .replace(/[^a-z0-9_]/g, '_'));

  const COL_MAP = {
    nom: ['nom', 'prenom', 'nom_prenom', 'name', 'contact'],
    cabinet: ['cabinet', 'enseigne', 'societe', 'company', 'structure', 'etablissement'],
    email: ['email', 'mail', 'courriel', 'e_mail'],
    telephone: ['telephone', 'tel', 'phone', 'mobile', 'portable'],
    ville: ['ville', 'city', 'localite', 'commune'],
    structure: ['type', 'type_structure', 'categorie'],
    notes: ['notes', 'commentaire', 'remarque', 'observation'],
  };

  const colIdx = {};
  Object.entries(COL_MAP).forEach(([field, aliases]) => {
    const idx = headers.findIndex(h => aliases.some(a => h.includes(a)));
    if (idx !== -1) colIdx[field] = idx;
  });

  const rows = lines.slice(1).map(line => {
    const cells = line.split(sep).map(c => c.trim().replace(/^["']|["']$/g, ''));
    const row = { statut: 'prospect' };
    Object.entries(colIdx).forEach(([field, idx]) => {
      if (cells[idx]) row[field] = cells[idx];
    });
    return row;
  }).filter(r => r.nom || r.email);

  return { rows, headers };
}

function ImportCSVModal({ onImport, onClose }) {
  const [step, setStep] = useState('upload');
  const [rows, setRows] = useState([]);
  const [filename, setFilename] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const { rows: parsed } = parseCSV(text);
      if (parsed.length === 0) {
        setError('Aucune ligne valide trouvée. Vérifiez que le fichier contient les colonnes Nom et/ou Email.');
      } else {
        setRows(parsed);
        setStep('preview');
        setError('');
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleImport = () => {
    onImport(rows);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 660 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📥 Importer des contacts CSV</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {step === 'upload' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="info-box blue" style={{ fontSize: 12 }}>
                <strong>Format accepté :</strong> fichier .csv ou .txt avec séparateur virgule ou point-virgule.<br />
                <strong>Colonnes reconnues :</strong> Nom, Cabinet, Email, Téléphone, Ville, Type, Notes<br />
                La première ligne doit contenir les en-têtes.
              </div>
              <div
                style={{
                  border: '2px dashed var(--border)', borderRadius: 12, padding: '32px',
                  textAlign: 'center', cursor: 'pointer', color: 'var(--text-dim)',
                  transition: 'border-color .2s',
                }}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { fileRef.current.files = e.dataTransfer.files; handleFile({ target: { files: [f] } }); } }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>📂</div>
                <div style={{ fontWeight: 600 }}>Cliquez ou déposez votre fichier CSV ici</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Formats : .csv, .txt</div>
                <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={handleFile} />
              </div>
              {error && <div style={{ color: 'var(--red, #ef4444)', fontSize: 13 }}>{error}</div>}
              <div className="info-box" style={{ fontSize: 11, color: 'var(--text-dim)', background: 'var(--bg)' }}>
                <strong>Exemple de fichier :</strong><br />
                <code>Nom;Cabinet;Email;Telephone;Ville<br />
                Dr Martin;Centre Audio Sud;martin@audio.fr;06 12 34 56 78;Marseille</code>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div>
              <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-dim)' }}>
                {rows.length} contact{rows.length > 1 ? 's' : ''} détecté{rows.length > 1 ? 's' : ''} dans <strong>{filename}</strong>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 10 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', position: 'sticky', top: 0 }}>
                      {['Nom', 'Cabinet', 'Email', 'Téléphone', 'Ville'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-dim)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 50).map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '7px 12px', fontWeight: 600 }}>{r.nom || '—'}</td>
                        <td style={{ padding: '7px 12px', color: 'var(--text-dim)' }}>{r.cabinet || '—'}</td>
                        <td style={{ padding: '7px 12px', color: 'var(--blue)' }}>{r.email || '—'}</td>
                        <td style={{ padding: '7px 12px', color: 'var(--text-dim)' }}>{r.telephone || '—'}</td>
                        <td style={{ padding: '7px 12px', color: 'var(--text-dim)' }}>{r.ville || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 50 && (
                  <div style={{ textAlign: 'center', padding: '8px', fontSize: 11, color: 'var(--text-dim)' }}>
                    … et {rows.length - 50} autres contacts
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          {step === 'preview' && (
            <>
              <button className="btn-secondary" onClick={() => setStep('upload')}>← Changer de fichier</button>
              <button className="btn-primary" onClick={handleImport}>
                ✅ Importer {rows.length} contact{rows.length > 1 ? 's' : ''}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Vue principale ────────────────────────────────────────────────────────────
export default function ProspectsView({ prospects, envois, campagnes, onAdd, onEdit, onDelete, onBulkAdd }) {
  const [search, setSearch]             = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterStructure, setFilterStructure] = useState('');
  const [modal, setModal]               = useState(null);
  const [showImport, setShowImport]     = useState(false);
  const [importDone, setImportDone]     = useState(null);

  const filtered = useMemo(() => prospects.filter(p => {
    if (filterStatut    && p.statut    !== filterStatut)    return false;
    if (filterStructure && p.structure !== filterStructure) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.nom?.toLowerCase().includes(q) &&
          !p.cabinet?.toLowerCase().includes(q) &&
          !p.email?.toLowerCase().includes(q) &&
          !p.ville?.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [prospects, search, filterStatut, filterStructure]);

  const statsParStatut = useMemo(() => {
    const m = {};
    prospects.forEach(p => { m[p.statut] = (m[p.statut] || 0) + 1; });
    return m;
  }, [prospects]);

  const hasFilter = search || filterStatut || filterStructure;

  const openNew  = () => setModal({});
  const openEdit = (p) => setModal(p);

  const handleSave = (data) => {
    if (data.id) onEdit(data);
    else onAdd(data);
    setModal(null);
  };

  const handleImport = async (rows) => {
    await onBulkAdd(rows);
    setImportDone(rows.length);
    setTimeout(() => setImportDone(null), 4000);
  };

  return (
    <div>
      {/* Statut pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(PROSPECT_STATUTS).map(([k, v]) => (
          <div key={k} style={{
            background: v.bg, border: `1px solid ${v.color}44`,
            borderRadius: 20, padding: '5px 14px',
            fontSize: 12, fontWeight: 700, color: v.color,
            cursor: 'pointer', opacity: filterStatut && filterStatut !== k ? .5 : 1,
          }}
            onClick={() => setFilterStatut(filterStatut === k ? '' : k)}
          >
            {v.label} {statsParStatut[k] ? `(${statsParStatut[k]})` : ''}
          </div>
        ))}
      </div>

      {/* Import success */}
      {importDone !== null && (
        <div className="info-box" style={{
          background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.3)',
          color: 'var(--green)', marginBottom: 16, fontSize: 13, fontWeight: 600,
        }}>
          ✅ {importDone} contact{importDone > 1 ? 's' : ''} importé{importDone > 1 ? 's' : ''} avec succès.
        </div>
      )}

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Nom, cabinet, email, ville…"
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <select className="filter-select" value={filterStructure}
          onChange={e => setFilterStructure(e.target.value)}>
          <option value="">Toutes structures</option>
          {Object.entries(STRUCTURE_TYPES).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        {hasFilter && (
          <button className="filter-reset"
            onClick={() => { setSearch(''); setFilterStatut(''); setFilterStructure(''); }}>
            Réinitialiser
          </button>
        )}
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <button className="btn-secondary" onClick={() => setShowImport(true)}>
            📥 Importer CSV
          </button>
          <button className="btn-primary" onClick={openNew}>
            + Nouveau contact
          </button>
        </div>
      </div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>{hasFilter ? 'Aucun contact trouvé' : 'Aucun contact'}</h3>
          <p>{hasFilter
            ? 'Modifiez vos filtres.'
            : 'Ajoutez vos prospects et clients audioprothésistes pour les cibler dans vos campagnes.'}
          </p>
          {!hasFilter && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" onClick={() => setShowImport(true)}>📥 Importer CSV</button>
              <button className="btn-primary" onClick={openNew}>+ Ajouter un contact</button>
            </div>
          )}
        </div>
      ) : (
        <div className="prospects-grid">
          {filtered.map(p => {
            const statut = PROSPECT_STATUTS[p.statut] || PROSPECT_STATUTS.prospect;
            const nbEnvois = (envois || []).filter(e => e.prospectId === p.id).length;
            return (
              <div key={p.id} className="prospect-card" onClick={() => openEdit(p)}
                style={{ opacity: p.statut === 'blacklist' ? 0.6 : 1 }}>
                <div className="prospect-avatar"
                  style={p.statut === 'blacklist' ? { background: 'var(--text-dim)' } : {}}>
                  {p.statut === 'blacklist' ? '🚫' : p.nom?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="prospect-info">
                  <div className="prospect-nom">{p.nom}</div>
                  <div className="prospect-cabinet">{p.cabinet || STRUCTURE_TYPES[p.structure] || ''}</div>
                  <div className="prospect-contacts">
                    {p.email     && <div className="prospect-contact-line">📧 {p.email}</div>}
                    {p.telephone && <div className="prospect-contact-line">📞 {p.telephone}</div>}
                    {p.ville     && <div className="prospect-contact-line">📍 {p.ville}</div>}
                    {nbEnvois > 0 && <div className="prospect-contact-line" style={{ color: 'var(--blue)' }}>✉️ {nbEnvois} email{nbEnvois > 1 ? 's' : ''} envoyé{nbEnvois > 1 ? 's' : ''}</div>}
                    {p.notes && <div className="prospect-contact-line" style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>📝 {p.notes.slice(0, 50)}{p.notes.length > 50 ? '…' : ''}</div>}
                  </div>
                </div>
                <div className="prospect-actions">
                  <span className="badge" style={{ color: statut.color, background: statut.bg }}>
                    {statut.label}
                  </span>
                  <button className="btn-icon danger"
                    onClick={e => { e.stopPropagation(); onDelete(p.id); }}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal !== null && (
        <ProspectModal
          prospect={modal}
          envois={envois}
          campagnes={campagnes}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {showImport && (
        <ImportCSVModal
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}
