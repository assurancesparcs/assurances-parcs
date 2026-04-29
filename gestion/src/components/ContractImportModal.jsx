import { useState, useRef } from 'react';
import { CONTRACT_TYPES } from '../constants';

const TEMPLATE_HEADERS = ['Client', 'Type', 'N° Contrat', 'Date Echeance (JJ/MM/AAAA)', 'Annee', 'Prime (€)', 'Notes'];

function parseDate(str) {
  if (!str) return null;
  const parts = str.trim().split(/[\/\-\.]/);
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const year = y.length === 2 ? '20' + y : y;
    const date = new Date(`${year}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`);
    if (!isNaN(date)) return date;
  }
  return null;
}

function downloadTemplate() {
  const rows = [TEMPLATE_HEADERS, ['Jean Dupont', 'Multi-risques', 'CT-2024-001', '01/03/2026', '2025', '1200', '']];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(';')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'modele_import_contrats.csv'; a.click();
}

export default function ContractImportModal({ clients, onImport, onClose }) {
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState([]);
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
        const [client, type, numero, dateStr, anneeStr, primeStr, notes] = cols;
        if (!client) return;
        const date = parseDate(dateStr);
        const annee = parseInt(anneeStr) || new Date().getFullYear();
        const prime = parseFloat(primeStr?.replace(',', '.')) || 0;
        if (!date) errs.push(`Ligne ${i + 2} : date invalide "${dateStr}"`);
        const matched = clients.find(c => c.name.toLowerCase().trim() === client.toLowerCase().trim());
        parsed.push({
          clientName: client, clientId: matched?.id || '',
          type: CONTRACT_TYPES.includes(type) ? type : CONTRACT_TYPES[0],
          numero: numero || '', dateEcheance: date, notes: notes || '',
          primePayee: false,
          historique: prime ? [{ annee, montant: prime, payee: false }] : [],
          _matched: !!matched,
        });
      });
      setRows(parsed); setErrors(errs);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleImport = async () => {
    setImporting(true);
    await onImport(rows);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 720 }}>
        <div className="modal-header">
          <h2>📥 Import en lot — Contrats</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-form">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={downloadTemplate}>⬇️ Télécharger le modèle CSV</button>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Remplis le modèle puis importe-le</span>
          </div>
          <div style={{ background: 'var(--bg-input)', border: '2px dashed var(--border)', borderRadius: 12, padding: 24, textAlign: 'center', cursor: 'pointer' }}
            onClick={() => fileRef.current.click()}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Cliquer pour sélectionner le fichier CSV</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Séparateur ; ou , — Encodage UTF-8</div>
            <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} style={{ display: 'none' }} />
          </div>

          {errors.length > 0 && (
            <div style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.3)', borderRadius: 8, padding: 12 }}>
              {errors.map((e, i) => <div key={i} style={{ fontSize: 12, color: '#f87171' }}>⚠️ {e}</div>)}
            </div>
          )}

          {rows.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>
                {rows.length} contrat{rows.length > 1 ? 's' : ''} détecté{rows.length > 1 ? 's' : ''}
                {' · '}{rows.filter(r => r._matched).length} client{rows.filter(r => r._matched).length > 1 ? 's' : ''} reconnu{rows.filter(r => r._matched).length > 1 ? 's' : ''}
              </div>
              <div style={{ maxHeight: 280, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-input)', position: 'sticky', top: 0 }}>
                      {['Client', 'Type', 'N°', 'Échéance', 'Année', 'Prime', 'Client lié?'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '7px 10px', fontWeight: 600 }}>{r.clientName}</td>
                        <td style={{ padding: '7px 10px', color: 'var(--purple)' }}>{r.type}</td>
                        <td style={{ padding: '7px 10px', color: 'var(--text-dim)' }}>{r.numero || '—'}</td>
                        <td style={{ padding: '7px 10px' }}>{r.dateEcheance ? r.dateEcheance.toLocaleDateString('fr-FR') : '⚠️ invalide'}</td>
                        <td style={{ padding: '7px 10px' }}>{r.historique[0]?.annee || '—'}</td>
                        <td style={{ padding: '7px 10px', color: 'var(--green)' }}>{r.historique[0]?.montant ? r.historique[0].montant.toLocaleString('fr-FR') + ' €' : '—'}</td>
                        <td style={{ padding: '7px 10px' }}>{r._matched ? <span style={{ color: '#34d399' }}>✅</span> : <span style={{ color: '#f87171' }}>Non trouvé</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                ℹ️ Les primes sont importées comme <strong style={{ color: '#fbbf24' }}>non payées</strong>. Les clients non reconnus seront importés sans lien client.
              </div>
            </>
          )}
        </div>
        <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn-primary" onClick={handleImport}
            disabled={!rows.length || importing || errors.some(e => e.includes('invalide'))}>
            {importing ? 'Import en cours…' : `📥 Importer ${rows.length} contrat${rows.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
