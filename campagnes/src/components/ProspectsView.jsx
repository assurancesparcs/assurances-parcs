import { useState, useMemo } from 'react';
import { PROSPECT_STATUTS, STRUCTURE_TYPES, fmtDate } from '../data.js';

const EMPTY_PROSPECT = {
  nom: '', cabinet: '', email: '', telephone: '',
  ville: '', structure: 'independant', statut: 'prospect',
  notes: '',
};

function ProspectModal({ prospect, onSave, onClose }) {
  const isNew = !prospect?.id;
  const [form, setForm] = useState({ ...EMPTY_PROSPECT, ...prospect });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.nom.trim()) { alert('Veuillez saisir un nom.'); return; }
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isNew ? '👤 Nouveau contact' : `✏️ ${form.nom}`}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body prospect-form">
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
            <input className="form-control" placeholder="Centre Audition Plus, Alain Afflelou Acousticien…"
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

          <div className="form-group">
            <label>Notes</label>
            <textarea className="form-control" rows={3}
              placeholder="Remarques, historique contact, besoins identifiés…"
              value={form.notes} onChange={e => upd('notes', e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn-primary" onClick={handleSave}>
            {isNew ? '+ Ajouter' : '💾 Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProspectsView({ prospects, onAdd, onEdit, onDelete }) {
  const [search, setSearch]           = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterStructure, setFilterStructure] = useState('');
  const [modal, setModal]             = useState(null);

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
        <button className="btn-primary" style={{ marginLeft: 'auto' }} onClick={openNew}>
          + Nouveau contact
        </button>
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
          {!hasFilter && <button className="btn-primary" onClick={openNew}>+ Ajouter un contact</button>}
        </div>
      ) : (
        <div className="prospects-grid">
          {filtered.map(p => {
            const statut = PROSPECT_STATUTS[p.statut] || PROSPECT_STATUTS.prospect;
            return (
              <div key={p.id} className="prospect-card" onClick={() => openEdit(p)}>
                <div className="prospect-avatar">{p.nom?.[0]?.toUpperCase() || '?'}</div>
                <div className="prospect-info">
                  <div className="prospect-nom">{p.nom}</div>
                  <div className="prospect-cabinet">{p.cabinet || STRUCTURE_TYPES[p.structure] || ''}</div>
                  <div className="prospect-contacts">
                    {p.email     && <div className="prospect-contact-line">📧 {p.email}</div>}
                    {p.telephone && <div className="prospect-contact-line">📞 {p.telephone}</div>}
                    {p.ville     && <div className="prospect-contact-line">📍 {p.ville}</div>}
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
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
