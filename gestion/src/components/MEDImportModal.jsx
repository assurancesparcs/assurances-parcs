import { useState, useRef } from 'react';

const HEADERS = ['Nom client', 'Email', 'Téléphone', 'Adresse', 'Type contrat', 'N° contrat', 'Montant dû (€)', 'Notes'];

function downloadTemplate() {
  const rows = [
    HEADERS,
    ['Dupont Jean', 'jean.dupont@email.fr', '06 12 34 56 78', '12 rue de la Paix 14000 Caen', 'Auto', 'ALZ-2024-001234', '385.50', ''],
    ['Martin Sophie', 'sophie.martin@email.fr', '06 98 76 54 32', '5 avenue du Maréchal 14400 Bayeux', 'Habitation', 'ALZ-2024-005678', '720.00', 'Déjà relancé par téléphone'],
  ];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(';')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'modele_import_MED.csv';
  a.click();
}

export default function MEDImportModal({ onImport, onClose }) {
  const [rows, setRows]       = useState([]);
  const [errors, setErrors]   = useState([]);
  const [moisImport, setMoisImport] = useState(new Date().toISOString().slice(0, 7));
  const [importing, setImporting]   = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result.replace(/^﻿/, '');
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      const parsed = []; const errs = [];
      lines.slice(1).forEach((line, i) => {
        const cols = line.split(/;|,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
        const [clientName, clientEmail, clientPhone, adresse, typeContrat, numeroContrat, montantStr, notes] = cols;
        if (!clientName) return;
        const montantDu = parseFloat(montantStr?.replace(',', '.')) || 0;
        if (!montantDu) errs.push(`Ligne ${i + 2} : montant invalide pour "${clientName}"`);
        parsed.push({
          clientName, clientEmail: clientEmail || '', clientPhone: clientPhone || '',
          adresse: adresse || '', typeContrat: typeContrat || 'Auto',
          numeroContrat: numeroContrat || '', montantDu,
          notes: notes || '', status: 'en_cours',
        });
      });
      setRows(parsed); setErrors(errs);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleImport = async () => {
    setImporting(true);
    await onImport(rows.map(r => ({ ...r, moisImport })));
    onClose();
  };

  const totalMontant = rows.reduce((acc, r) => acc + (r.montantDu || 0), 0);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 760 }}>
        <div className="modal-header">
          <h2>📥 Import mensuel — Dossiers MED Allianz</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-form">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={downloadTemplate}>⬇️ Télécharger le modèle CSV</button>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ marginRight: 8, fontSize: 12 }}>Mois d'import</label>
              <input className="form-input" type="month" value={moisImport}
                onChange={e => setMoisImport(e.target.value)}
                style={{ width: 160 }} />
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-dim)', background: 'var(--bg-input)', borderRadius: 8, padding: '10px 14px' }}>
            <strong>Colonnes attendues :</strong> {HEADERS.join(' · ')}
            <br />Séparateur <strong>;</strong> (point-virgule) — Encodage UTF-8 — Première ligne = en-têtes (ignorée)
          </div>

          <div
            style={{ background: 'var(--bg-input)', border: '2px dashed var(--border)', borderRadius: 12, padding: 24, textAlign: 'center', cursor: 'pointer' }}
            onClick={() => fileRef.current.click()}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Cliquer pour sélectionner le fichier CSV</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Export Excel → Enregistrer sous → CSV UTF-8</div>
            <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} style={{ display: 'none' }} />
          </div>

          {errors.length > 0 && (
            <div style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.3)', borderRadius: 8, padding: 12 }}>
              {errors.map((e, i) => <div key={i} style={{ fontSize: 12, color: '#f87171' }}>⚠️ {e}</div>)}
            </div>
          )}

          {rows.length > 0 && (
            <>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, fontWeight: 700 }}>
                <span style={{ color: '#60a5fa' }}>{rows.length} dossier{rows.length > 1 ? 's' : ''} détecté{rows.length > 1 ? 's' : ''}</span>
                <span style={{ color: '#f87171' }}>Total impayés : {totalMontant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-input)', position: 'sticky', top: 0 }}>
                      {['Client', 'Type contrat', 'N° contrat', 'Email', 'Montant dû', 'Notes'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '7px 10px', fontWeight: 600 }}>{r.clientName}</td>
                        <td style={{ padding: '7px 10px', color: 'var(--text-muted)' }}>{r.typeContrat}</td>
                        <td style={{ padding: '7px 10px', color: 'var(--text-dim)' }}>{r.numeroContrat || '—'}</td>
                        <td style={{ padding: '7px 10px', color: 'var(--text-dim)' }}>{r.clientEmail || '—'}</td>
                        <td style={{ padding: '7px 10px', color: '#f87171', fontWeight: 700 }}>
                          {r.montantDu ? r.montantDu.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €' : <span style={{ color: '#f87171' }}>⚠️ manquant</span>}
                        </td>
                        <td style={{ padding: '7px 10px', color: 'var(--text-dim)', fontStyle: 'italic' }}>{r.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                ℹ️ Tous les dossiers seront importés avec le statut <strong style={{ color: '#60a5fa' }}>En cours</strong> pour le mois <strong>{moisImport}</strong>.
              </div>
            </>
          )}
        </div>

        <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn-primary"
            style={{ background: '#f87171', borderColor: '#f87171' }}
            onClick={handleImport}
            disabled={!rows.length || importing}>
            {importing ? 'Import en cours…' : `📥 Importer ${rows.length} dossier${rows.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
