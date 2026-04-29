import { useState } from 'react';
import { CONTRACT_TYPES } from '../constants';

export default function ContractModal({ contract, clients, onSave, onClose }) {
  const isEdit = !!contract?.id;
  const initialDate = contract?.dateEcheance
    ? (contract.dateEcheance.toDate ? contract.dateEcheance.toDate() : new Date(contract.dateEcheance)).toISOString().split('T')[0]
    : '';

  const [form, setForm] = useState({
    clientId: '', clientName: '', type: CONTRACT_TYPES[0], numero: '',
    dateEcheance: '', primeMontant: '', primePayee: false, notes: '',
    ...contract, dateEcheance: initialDate,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleClient = (id) => {
    const c = clients.find(c => c.id === id);
    set('clientId', id); set('clientName', c?.name || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientId || !form.dateEcheance) return;
    await onSave({
      ...form,
      dateEcheance: form.dateEcheance ? new Date(form.dateEcheance) : null,
      primeMontant: form.primeMontant ? parseFloat(form.primeMontant) : null,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? '✏️ Modifier' : '+ Nouveau'} contrat</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Client *</label>
              <select className="form-control" value={form.clientId} onChange={e => handleClient(e.target.value)} required>
                <option value="">— Choisir —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Type de contrat</label>
              <select className="form-control" value={form.type} onChange={e => set('type', e.target.value)}>
                {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>N° de contrat</label>
              <input className="form-control" value={form.numero} onChange={e => set('numero', e.target.value)} placeholder="Ex: CT-2024-001" />
            </div>
            <div className="form-group">
              <label>Date d'échéance *</label>
              <input className="form-control" type="date" value={form.dateEcheance} onChange={e => set('dateEcheance', e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Prime annuelle (€)</label>
              <input className="form-control" type="number" value={form.primeMontant} onChange={e => set('primeMontant', e.target.value)} placeholder="0.00" />
            </div>
            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              <label>Prime payée</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <input type="checkbox" id="primePayee" checked={form.primePayee}
                  onChange={e => set('primePayee', e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer' }} />
                <label htmlFor="primePayee" style={{ fontSize: 13, color: form.primePayee ? '#34d399' : '#9ca3c0', cursor: 'pointer' }}>
                  {form.primePayee ? '✅ Payée' : 'Non payée'}
                </label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea className="form-control" rows={2} value={form.notes}
              onChange={e => set('notes', e.target.value)} placeholder="Remarques sur ce contrat…" />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary">{isEdit ? '💾 Enregistrer' : '+ Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
