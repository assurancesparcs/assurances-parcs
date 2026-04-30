import { useState } from 'react';

export default function ClientModal({ client, onSave, onClose }) {
  const isEdit = !!client?.id;
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', notes: '', ...client });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <h2>{isEdit ? '✏️ Modifier' : '+ Nouveau'} client</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nom *</label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="Nom du client" required autoFocus />
          </div>
          <div className="form-group">
            <label>Entreprise</label>
            <input className="form-control" value={form.company} onChange={e => set('company', e.target.value)}
              placeholder="Nom de l'entreprise" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="email" value={form.email}
                onChange={e => set('email', e.target.value)} placeholder="email@exemple.fr" />
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input className="form-control" type="tel" value={form.phone}
                onChange={e => set('phone', e.target.value)} placeholder="06 XX XX XX XX" />
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea className="form-control" rows={3} value={form.notes}
              onChange={e => set('notes', e.target.value)} placeholder="Notes sur ce client…" />
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
