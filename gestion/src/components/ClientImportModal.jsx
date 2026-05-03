import { useState, useRef } from 'react';

const HEADERS = ['Nom', 'Prénom', 'Société', 'Email', 'Téléphone', 'Adresse', 'Notes'];

function downloadTemplate() {
  const rows = [
    HEADERS,
    ['Dupont', 'Jean', '', 'jean.dupont@email.fr', '06 12 34 56 78', '12 rue de la Paix 14000 Caen', ''],
    ['Martin', 'Sophie', 'SARL Martin', 'sophie.martin@email.fr', '06 98 76 54 32', '5 av. du Maréchal 14400 Bayeux', 'Client depuis 2019'],
  ];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(';')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'modele_import_clients.csv';
  a.click();
}

export default function ClientImportModal({ clients, onImport, onClose }) {
  const [rows, setRows]         = useState([]);
  const [errors, setErrors]     = useState([]);
  const [importing, setImporting] = useState(false);
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
        const [nom, prenom, societe, email, phone, adresse, notes] = cols;
        if (!nom) return;

        const fullName = [nom, prenom].filter(Boolean).join(' ');
        const duplicate = clients.find(c =>
          c.name?.toLowerCase().trim() === fullName.toLowerCase().trim() ||
          (email && c.email?.toLowerCase().trim() === email.toLowerCase().trim())
        );

        if (!email && !phone) errs.push(`Ligne ${i + 2} : "${fullName}" sans email ni téléphone`);

        parsed.push({
          name: fullName,
          company: societe || '',
          email:   email   || '',
          phone:   phone   || '',
          address: adresse || '',
          notes:   notes   || '',
          _duplicate: !!duplicate,
          _duplicateName: duplicate?.name || '',
        });
      });

      setRows(parsed);
      setErrors(errs);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleImport = async () => {
    setImporting(true);
    const toImport = rows.filter(r => !r._duplicate);
    const { _duplicate: _d, _duplicateName: _dn, ...rest } = toImport[0] || {};
    await onImport(toImport.map(({ _duplicate, _duplicateName, ...r }) => r));
    onClose();
  };

  const duplicates  = rows.filter(r => r._duplicate).length;
  const toImport    = rows.filter(r => !r._duplicate).length;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 760 }}>
        <div className="modal-header">
          <h2>📥 Import en lot — Clients</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-form">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={downloadTemplate}>⬇️ Télécharger le modèle CSV</button>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-dim)', background: 'var(--bg-input)', borderRadius: 8, padding: '10px 14px' }}>
            <strong>Colonnes :</strong> {HEADERS.join(' · ')}
            <br />Séparateur <strong>;</strong> — Encodage UTF-8 — Première ligne = en-têtes (ignorée)
            <br />Les doublons (même nom ou même email) sont détectés et exclus automatiquement.
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
            <div style={{ background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.3)', borderRadius: 8, padding: 12 }}>
              {errors.map((e, i) => <div key={i} style={{ fontSize: 12, color: '#fbbf24' }}>⚠️ {e}</div>)}
            </div>
          )}

          {rows.length > 0 && (
            <>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, fontWeight: 700, flexWrap: 'wrap' }}>
                <span style={{ color: '#34d399' }}>✅ {toImport} client{toImport > 1 ? 's' : ''} à importer</span>
                {duplicates > 0 && (
                  <span style={{ color: '#fbbf24' }}>⚠️ {duplicates} doublon{duplicates > 1 ? 's' : ''} ignoré{duplicates > 1 ? 's' : ''}</span>
                )}
              </div>

              <div style={{ maxHeight: 320, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-input)', position: 'sticky', top: 0 }}>
                      {['Nom complet', 'Société', 'Email', 'Téléphone', 'Statut'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--border)', opacity: r._duplicate ? 0.45 : 1 }}>
                        <td style={{ padding: '7px 10px', fontWeight: 600 }}>{r.name}</td>
                        <td style={{ padding: '7px 10px', color: 'var(--text-muted)' }}>{r.company || '—'}</td>
                        <td style={{ padding: '7px 10px', color: 'var(--text-dim)' }}>{r.email || '—'}</td>
                        <td style={{ padding: '7px 10px', color: 'var(--text-dim)' }}>{r.phone || '—'}</td>
                        <td style={{ padding: '7px 10px' }}>
                          {r._duplicate
                            ? <span style={{ color: '#fbbf24', fontSize: 11 }}>⚠️ Doublon ({r._duplicateName})</span>
                            : <span style={{ color: '#34d399', fontSize: 11 }}>✅ OK</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn-primary"
            onClick={handleImport}
            disabled={!toImport || importing}>
            {importing ? 'Import en cours…' : `📥 Importer ${toImport} client${toImport > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
