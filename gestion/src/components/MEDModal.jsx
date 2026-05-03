import { useState } from 'react';
import { MED_STATUSES } from '../constants';

const TYPE_CONTRATS = [
  'Auto', 'Habitation', 'Multi-risques', 'RC Professionnelle',
  'Prévoyance', 'Santé', 'Moto', 'Bateau', 'Chasse', 'Autre',
];

export default function MEDModal({ dossier, onSave, onClose }) {
  const [form, setForm] = useState({
    clientName:    '',
    clientEmail:   '',
    clientPhone:   '',
    adresse:       '',
    typeContrat:   'Auto',
    numeroContrat: '',
    montantDu:     '',
    moisImport:    new Date().toISOString().slice(0, 7),
    status:        'en_cours',
    notes:         '',
    ...dossier,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.clientName?.trim()) { alert('Le nom du client est obligatoire.'); return; }
    await onSave(form);
    onClose();
  };

  const isEdit = !!dossier?.id;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 620 }}>
        <div className="modal-header">
          <h2>📬 {isEdit ? 'Modifier' : 'Nouveau'} dossier MED — Allianz</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-form">
          {/* Client */}
          <div className="form-section-title">Informations client</div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>Nom client *</label>
              <input className="form-input" value={form.clientName}
                onChange={e => set('clientName', e.target.value)}
                placeholder="Nom Prénom" />
            </div>
            <div className="form-group">
              <label>Mois d'import</label>
              <input className="form-input" type="month" value={form.moisImport}
                onChange={e => set('moisImport', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input className="form-input" type="email" value={form.clientEmail}
                onChange={e => set('clientEmail', e.target.value)}
                placeholder="client@email.fr" />
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input className="form-input" type="tel" value={form.clientPhone}
                onChange={e => set('clientPhone', e.target.value)}
                placeholder="06 XX XX XX XX" />
            </div>
          </div>

          <div className="form-group">
            <label>Adresse</label>
            <input className="form-input" value={form.adresse}
              onChange={e => set('adresse', e.target.value)}
              placeholder="Adresse postale" />
          </div>

          {/* Contrat */}
          <div className="form-section-title" style={{ marginTop: 8 }}>Contrat Allianz</div>
          <div className="form-row">
            <div className="form-group">
              <label>Type de contrat</label>
              <select className="form-input" value={form.typeContrat}
                onChange={e => set('typeContrat', e.target.value)}>
                {TYPE_CONTRATS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>N° de contrat</label>
              <input className="form-input" value={form.numeroContrat}
                onChange={e => set('numeroContrat', e.target.value)}
                placeholder="N° contrat Allianz" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Montant dû (€)</label>
              <input className="form-input" type="number" min="0" step="0.01"
                value={form.montantDu} onChange={e => set('montantDu', e.target.value)}
                placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Statut</label>
              <select className="form-input" value={form.status}
                onChange={e => set('status', e.target.value)}>
                {Object.entries(MED_STATUSES).map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>Notes internes</label>
            <textarea className="form-input" rows={3} value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Observations, éléments de contexte…" />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn-primary" style={{ background: '#f87171', borderColor: '#f87171' }}
            onClick={handleSave}>
            {isEdit ? '💾 Enregistrer' : '+ Créer le dossier'}
          </button>
        </div>
      </div>
    </div>
  );
}
