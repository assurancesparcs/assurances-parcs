import { useState } from 'react';
import { CONTRACT_TYPES } from '../constants';

export default function ContractModal({ contract, clients, onSave, onClose }) {
  const isEdit = !!contract?.id;
  const initialDate = contract?.dateEcheance
    ? (contract.dateEcheance.toDate ? contract.dateEcheance.toDate() : new Date(contract.dateEcheance)).toISOString().split('T')[0]
    : '';

  const [form, setForm] = useState({
    clientId: '', clientName: '', type: CONTRACT_TYPES[0], numero: '',
    dateEcheance: '', primePayee: false, notes: '',
    historique: [],
    ...contract, dateEcheance: initialDate,
  });
  const [newAnnee, setNewAnnee] = useState(String(new Date().getFullYear()));
  const [newMontant, setNewMontant] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleClient = (id) => {
    const c = clients.find(c => c.id === id);
    set('clientId', id); set('clientName', c?.name || '');
  };

  const addHistorique = () => {
    if (!newMontant) return;
    const annee = parseInt(newAnnee);
    const montant = parseFloat(newMontant.replace(',', '.'));
    const hist = [...(form.historique || []).filter(h => h.annee !== annee), { annee, montant, payee: false }];
    hist.sort((a, b) => a.annee - b.annee);
    set('historique', hist);
    setNewMontant('');
  };

  const toggleHistPayee = (annee) => {
    set('historique', (form.historique || []).map(h => h.annee === annee ? { ...h, payee: !h.payee } : h));
  };

  const removeHistorique = (annee) => {
    set('historique', (form.historique || []).filter(h => h.annee !== annee));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientId || !form.dateEcheance) return;
    await onSave({ ...form, dateEcheance: form.dateEcheance ? new Date(form.dateEcheance) : null });
    onClose();
  };

  const hist = form.historique || [];
  const maxMontant = Math.max(...hist.map(h => h.montant), 1);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600 }}>
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

          {/* HISTORIQUE COTISATIONS */}
          <div className="form-group">
            <label>Historique des cotisations</label>
            {hist.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                {/* Mini graphique */}
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 60, marginBottom: 10 }}>
                  {hist.map(h => (
                    <div key={h.annee} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <div style={{ fontSize: 9, color: 'var(--text-dim)', fontWeight: 700 }}>
                        {h.montant >= 1000 ? (h.montant/1000).toFixed(1)+'k' : h.montant}€
                      </div>
                      <div style={{ width: '100%', background: h.payee ? '#34d399' : '#a78bfa', borderRadius: '3px 3px 0 0',
                        height: `${Math.max((h.montant / maxMontant) * 40, 4)}px`, transition: 'height .3s' }} />
                      <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>{h.annee}</div>
                    </div>
                  ))}
                </div>
                {/* Liste années */}
                {hist.map(h => (
                  <div key={h.annee} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, width: 40 }}>{h.annee}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', flex: 1 }}>
                      {h.montant.toLocaleString('fr-FR')} €
                    </span>
                    <button type="button" onClick={() => toggleHistPayee(h.annee)}
                      style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: h.payee ? 'rgba(52,211,153,.2)' : 'rgba(251,191,36,.2)',
                        color: h.payee ? '#34d399' : '#fbbf24', fontWeight: 700 }}>
                      {h.payee ? '✅ Payée' : '⏳ Non payée'}
                    </button>
                    <button type="button" className="btn-icon delete" onClick={() => removeHistorique(h.annee)}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input className="form-control" type="number" min="2000" max="2100" value={newAnnee}
                onChange={e => setNewAnnee(e.target.value)} style={{ width: 90 }} placeholder="Année" />
              <input className="form-control" type="number" value={newMontant}
                onChange={e => setNewMontant(e.target.value)} placeholder="Montant (€)" />
              <button type="button" className="btn-primary" onClick={addHistorique} style={{ whiteSpace: 'nowrap', padding: '9px 14px' }}>
                + Ajouter
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Statut prime actuelle</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <input type="checkbox" id="primePayee" checked={form.primePayee}
                  onChange={e => set('primePayee', e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer' }} />
                <label htmlFor="primePayee" style={{ fontSize: 13, color: form.primePayee ? '#34d399' : '#9ca3c0', cursor: 'pointer', fontWeight: 600 }}>
                  {form.primePayee ? '✅ Prime payée' : '⏳ Non payée'}
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
