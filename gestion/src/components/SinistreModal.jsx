import { useState } from 'react';
import { SINISTRE_TYPES, SINISTRE_STATUSES, PIECES_DEFAUT, USERS, fmtDate } from '../constants';

const COMPAGNIES = [
  'AXA', 'Allianz', 'Generali', 'Groupama', 'MMA', 'MAIF', 'MACIF',
  'AG2R La Mondiale', 'Covéa', 'Aviva', 'SwissLife', 'Autre',
];

function initPieces(type) {
  return (PIECES_DEFAUT[type] || PIECES_DEFAUT.autre).map(label => ({ label, recu: false }));
}

export default function SinistreModal({ sinistre, clients, contracts, onSave, onClose, userName }) {
  const isEdit = !!sinistre?.id;

  const fmtInput = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toISOString().split('T')[0];
  };

  const [form, setForm] = useState({
    numero: '',
    clientId: '', clientName: '',
    contractId: '',
    type: 'degats_eaux',
    status: 'declare',
    compagnie: '',
    dateSinistre: '',
    dateDeclaration: new Date().toISOString().split('T')[0],
    montantEstime: '',
    montantIndemnise: '',
    description: '',
    notes: '',
    assignedTo: userName || '',
    pieces: initPieces('degats_eaux'),
    ...sinistre,
    dateSinistre: fmtInput(sinistre?.dateSinistre),
    dateDeclaration: fmtInput(sinistre?.dateDeclaration) || new Date().toISOString().split('T')[0],
    pieces: sinistre?.pieces || initPieces(sinistre?.type || 'degats_eaux'),
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleClient = (id) => {
    const c = clients.find(c => c.id === id);
    set('clientId', id);
    set('clientName', c?.name || '');
    set('contractId', '');
  };

  const handleType = (type) => {
    set('type', type);
    if (!isEdit || !form.pieces?.length) {
      set('pieces', initPieces(type));
    }
  };

  const clientContracts = contracts?.filter(c => c.clientId === form.clientId) || [];

  const togglePiece = (idx) => {
    const pieces = form.pieces.map((p, i) => i === idx ? { ...p, recu: !p.recu } : p);
    set('pieces', pieces);
  };

  const addPiece = () => {
    set('pieces', [...form.pieces, { label: '', recu: false }]);
  };

  const updatePieceLabel = (idx, label) => {
    const pieces = form.pieces.map((p, i) => i === idx ? { ...p, label } : p);
    set('pieces', pieces);
  };

  const removePiece = (idx) => {
    set('pieces', form.pieces.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientName && !form.clientId) return;
    const payload = {
      ...form,
      dateSinistre: form.dateSinistre ? new Date(form.dateSinistre) : null,
      dateDeclaration: form.dateDeclaration ? new Date(form.dateDeclaration) : null,
      montantEstime: form.montantEstime ? Number(form.montantEstime) : null,
      montantIndemnise: form.montantIndemnise ? Number(form.montantIndemnise) : null,
      lastActivityAt: new Date(),
    };
    await onSave(payload);
    onClose();
  };

  const nbPiecesRecues = form.pieces.filter(p => p.recu).length;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <h2>
            {SINISTRE_TYPES[form.type]?.icon} {isEdit ? 'Modifier le sinistre' : 'Nouveau sinistre'}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">

          {/* Type + Statut */}
          <div className="form-row">
            <div className="form-group">
              <label>TYPE DE SINISTRE *</label>
              <select className="form-control" value={form.type} onChange={e => handleType(e.target.value)}>
                {Object.entries(SINISTRE_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>STATUT</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                {Object.entries(SINISTRE_STATUSES).map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Client + Contrat */}
          <div className="form-row">
            <div className="form-group">
              <label>CLIENT *</label>
              <select className="form-control" value={form.clientId} onChange={e => handleClient(e.target.value)} required>
                <option value="">— Sélectionner —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>CONTRAT LIÉ</label>
              <select className="form-control" value={form.contractId} onChange={e => set('contractId', e.target.value)}
                disabled={!form.clientId}>
                <option value="">— Aucun —</option>
                {clientContracts.map(c => (
                  <option key={c.id} value={c.id}>{c.type}{c.numero ? ` #${c.numero}` : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* N° sinistre + Compagnie */}
          <div className="form-row">
            <div className="form-group">
              <label>N° SINISTRE</label>
              <input className="form-control" value={form.numero}
                onChange={e => set('numero', e.target.value)} placeholder="Ex: SIN-2024-001" />
            </div>
            <div className="form-group">
              <label>COMPAGNIE D'ASSURANCE</label>
              <select className="form-control" value={form.compagnie} onChange={e => set('compagnie', e.target.value)}>
                <option value="">— Sélectionner —</option>
                {COMPAGNIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="form-row">
            <div className="form-group">
              <label>DATE DU SINISTRE</label>
              <input className="form-control" type="date" value={form.dateSinistre}
                onChange={e => set('dateSinistre', e.target.value)} />
            </div>
            <div className="form-group">
              <label>DATE DE DÉCLARATION</label>
              <input className="form-control" type="date" value={form.dateDeclaration}
                onChange={e => set('dateDeclaration', e.target.value)} />
            </div>
          </div>

          {/* Montants */}
          <div className="form-row">
            <div className="form-group">
              <label>MONTANT ESTIMÉ (€)</label>
              <input className="form-control" type="number" min="0" step="0.01"
                value={form.montantEstime} onChange={e => set('montantEstime', e.target.value)}
                placeholder="0" />
            </div>
            <div className="form-group">
              <label>MONTANT INDEMNISÉ (€)</label>
              <input className="form-control" type="number" min="0" step="0.01"
                value={form.montantIndemnise} onChange={e => set('montantIndemnise', e.target.value)}
                placeholder="0" />
            </div>
          </div>

          {/* Assigné */}
          <div className="form-group">
            <label>ASSIGNÉ À</label>
            <select className="form-control" value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
              <option value="">— Non assigné —</option>
              {USERS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>DESCRIPTION DU SINISTRE</label>
            <textarea className="form-control" rows={3} value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Circonstances, contexte, détails de l'événement…" />
          </div>

          {/* Pièces justificatives */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ margin: 0 }}>
                PIÈCES JUSTIFICATIVES
                <span style={{
                  marginLeft: 8, padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                  background: nbPiecesRecues === form.pieces.length && form.pieces.length > 0
                    ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.2)',
                  color: nbPiecesRecues === form.pieces.length && form.pieces.length > 0
                    ? '#34d399' : '#fbbf24',
                }}>
                  {nbPiecesRecues}/{form.pieces.length} reçues
                </span>
              </label>
              <button type="button" onClick={addPiece}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 6,
                  color: 'var(--text-muted)', padding: '3px 10px', fontSize: 12, cursor: 'pointer' }}>
                + Ajouter
              </button>
            </div>
            <div className="pieces-list">
              {form.pieces.map((p, i) => (
                <div key={i} className="piece-row">
                  <button type="button" className={`piece-check ${p.recu ? 'recu' : ''}`}
                    onClick={() => togglePiece(i)}>
                    {p.recu ? '✅' : '⬜'}
                  </button>
                  <input className="form-control piece-input" value={p.label}
                    onChange={e => updatePieceLabel(i, e.target.value)}
                    placeholder="Nom du document…"
                    style={{ textDecoration: p.recu ? 'line-through' : 'none', opacity: p.recu ? 0.6 : 1 }} />
                  <button type="button" className="btn-icon delete" onClick={() => removePiece(i)}>🗑️</button>
                </div>
              ))}
              {form.pieces.length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--text-dim)', padding: '8px 0' }}>
                  Aucune pièce — cliquez "+ Ajouter" pour en créer.
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>NOTES INTERNES</label>
            <textarea className="form-control" rows={2} value={form.notes}
              onChange={e => set('notes', e.target.value)} placeholder="Notes de suivi, observations…" />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary">
              {isEdit ? '💾 Enregistrer' : '+ Déclarer le sinistre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
