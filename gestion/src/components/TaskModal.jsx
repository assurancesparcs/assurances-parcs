import { useState } from 'react';
import { TYPES, PRIORITIES, STATUSES, USERS } from '../constants';

export default function TaskModal({ item, clients, onSave, onClose, userName }) {
  const isEdit = !!item?.id;
  const initialDate = item?.date
    ? (item.date.toDate ? item.date.toDate() : new Date(item.date)).toISOString().split('T')[0]
    : '';
  const [form, setForm] = useState({
    title: '', type: 'tache', priority: 'normal', status: 'a_faire',
    clientId: '', clientName: '', time: '', timeFin: '', description: '', notes: '',
    assignedTo: userName || '',
    ...item,
    date: initialDate,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleClient = (id) => {
    const c = clients.find(c => c.id === id);
    set('clientId', id); set('clientName', c?.name || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await onSave({ ...form, date: form.date ? new Date(form.date) : null });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? '✏️ Modifier' : '+ Nouveau'} {TYPES[form.type]?.label || ''}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Type *</label>
              <select className="form-control" value={form.type} onChange={e => set('type', e.target.value)}>
                {Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priorité *</label>
              <select className="form-control" value={form.priority} onChange={e => set('priority', e.target.value)}>
                {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Titre *</label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="Titre de l'élément" required autoFocus />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Statut</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Assigné à</label>
              <select className="form-control" value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
                <option value="">— Non assigné —</option>
                {USERS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Client</label>
            <select className="form-control" value={form.clientId} onChange={e => handleClient(e.target.value)}>
              <option value="">— Aucun —</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{form.type === 'rdv' ? 'Date du RDV' : 'Échéance'}</label>
              <input className="form-control" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            {form.type === 'rdv' && (
              <div className="form-group">
                <label>Heure de début</label>
                <input className="form-control" type="time" value={form.time} onChange={e => set('time', e.target.value)} />
              </div>
            )}
            {form.type === 'rdv' && (
              <div className="form-group">
                <label>Heure de fin</label>
                <input className="form-control" type="time" value={form.timeFin} onChange={e => set('timeFin', e.target.value)} />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" rows={3} value={form.description}
              onChange={e => set('description', e.target.value)} placeholder="Détails, contexte…" />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea className="form-control" rows={2} value={form.notes}
              onChange={e => set('notes', e.target.value)} placeholder="Notes internes…" />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary">{isEdit ? '💾 Enregistrer' : '+ Créer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
