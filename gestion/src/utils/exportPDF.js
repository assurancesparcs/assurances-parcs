import { SINISTRE_TYPES, SINISTRE_CHASSE_TYPES, SINISTRE_STATUSES, fmtDate } from '../constants';
import { tenant } from '../tenant/config';

const TEMPLATE_LABELS = {
  confirmation_reception: 'Confirmation de réception',
  client_15j:             'Relance client 15j',
  client_30j:             'Relance client 30j',
  compagnie_15j:          'Relance compagnie 15j',
  compagnie_30j:          'Relance compagnie 30j',
  cloture:                'Clôture du dossier',
};

function fmtTs(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtEur(n) {
  if (!n) return '—';
  return Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';
}

export function exportSinistrePDF(sinistre, mode = 'standard') {
  const isChasse = mode === 'chasse';
  const types    = isChasse ? SINISTRE_CHASSE_TYPES : SINISTRE_TYPES;
  const tp       = types[sinistre.type] || { label: sinistre.type, icon: '📋' };
  const st       = SINISTRE_STATUSES[sinistre.status] || { label: sinistre.status };

  const cabinetInfo = (isChasse && tenant.contactChasse) ? {
    name: tenant.contactChasse.name,
    phone: `${tenant.contactChasse.phone}${tenant.contactChasse.phoneCaption ? ' ' + tenant.contactChasse.phoneCaption : ''}`,
    address: tenant.contactChasse.address,
    orias: tenant.contactChasse.orias,
  } : {
    name: tenant.name,
    phone: tenant.contact.phone,
    address: tenant.contact.address,
    orias: tenant.contact.orias,
  };
  const cabinet = [
    cabinetInfo.name,
    `Tél : ${cabinetInfo.phone}`,
    cabinetInfo.address,
    cabinetInfo.orias ? `N° Orias : ${cabinetInfo.orias}` : '',
  ].filter(Boolean).join('<br>');

  const pieces = (sinistre.pieces || []);
  const piecesHtml = pieces.length
    ? pieces.map(p => `
        <tr>
          <td style="padding:5px 8px;">${p.recu ? '✅' : '⬜'}</td>
          <td style="padding:5px 8px;${!p.recu ? 'color:#c0392b;' : ''}">${p.label}</td>
          <td style="padding:5px 8px;font-weight:600;${p.recu ? 'color:#27ae60;' : 'color:#c0392b;'}">${p.recu ? 'Reçue' : 'Manquante'}</td>
        </tr>`).join('')
    : '<tr><td colspan="3" style="padding:8px;color:#888;">Aucune pièce renseignée</td></tr>';

  const relances = (sinistre.relances || []);
  const relancesHtml = relances.length
    ? relances.map(r => `
        <tr>
          <td style="padding:5px 8px;">${fmtTs(r.date)}</td>
          <td style="padding:5px 8px;">${TEMPLATE_LABELS[r.template] || r.template || '—'}</td>
          <td style="padding:5px 8px;">${r.type === 'client' ? '👤 Client' : '🏢 Compagnie'}</td>
          <td style="padding:5px 8px;color:#555;font-style:italic;">${r.note || '—'}</td>
        </tr>`).join('')
    : '<tr><td colspan="4" style="padding:8px;color:#888;">Aucun courrier enregistré</td></tr>';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Dossier sinistre — ${sinistre.clientName || 'Client'}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #222; background: #fff; padding: 20px 30px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2c3e50; padding-bottom: 14px; margin-bottom: 20px; }
    .header-left h1 { font-size: 18px; color: #2c3e50; margin-bottom: 4px; }
    .header-left p { font-size: 11px; color: #666; }
    .header-right { text-align: right; font-size: 11px; color: #555; line-height: 1.6; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-bottom: 4px; }
    .section { margin-bottom: 18px; }
    .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #2c3e50; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .info-cell { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 12px; }
    .info-cell .lbl { font-size: 9px; text-transform: uppercase; color: #888; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 3px; }
    .info-cell .val { font-size: 12px; font-weight: 600; color: #222; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th { background: #2c3e50; color: #fff; padding: 7px 8px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    tr:nth-child(even) { background: #f8f9fa; }
    .notes-box { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 6px; padding: 10px 14px; font-size: 11px; color: #444; line-height: 1.6; white-space: pre-wrap; }
    .footer { margin-top: 28px; border-top: 1px solid #ddd; padding-top: 10px; display: flex; justify-content: space-between; font-size: 10px; color: #888; }
    @media print {
      body { padding: 10px 16px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>${isChasse ? '🏹' : '🛡️'} Dossier Sinistre — ${sinistre.clientName || '—'}</h1>
      <p>Édité le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      <div style="margin-top:8px;">
        <span class="badge" style="background:#eef2f7;color:#2c3e50;">${tp.icon} ${tp.label}</span>
        <span class="badge" style="background:#e8f8f0;color:#1a7a40;margin-left:4px;">${st.label}</span>
        ${isChasse ? '<span class="badge" style="background:#e8f5e9;color:#2e7d32;margin-left:4px;">Sinistre Chasse</span>' : ''}
      </div>
    </div>
    <div class="header-right">
      <strong>${tenant.defaultSignatory.name}</strong><br>
      ${cabinet}
    </div>
  </div>

  <!-- Informations générales -->
  <div class="section">
    <div class="section-title">Informations générales</div>
    <div class="info-grid">
      <div class="info-cell"><div class="lbl">N° Dossier agence</div><div class="val">${sinistre.numero || '—'}</div></div>
      <div class="info-cell"><div class="lbl">Client</div><div class="val">${sinistre.clientName || '—'}</div></div>
      <div class="info-cell"><div class="lbl">Compagnie</div><div class="val">${sinistre.compagnie || '—'}</div></div>
      <div class="info-cell"><div class="lbl">Date du sinistre</div><div class="val">${fmtDate(sinistre.dateSinistre) || '—'}</div></div>
      <div class="info-cell"><div class="lbl">Date de déclaration</div><div class="val">${fmtDate(sinistre.dateDeclaration) || '—'}</div></div>
      <div class="info-cell"><div class="lbl">Gestionnaire</div><div class="val">${sinistre.assignedTo || '—'}</div></div>
      <div class="info-cell"><div class="lbl">Montant estimé</div><div class="val">${fmtEur(sinistre.montantEstime)}</div></div>
      <div class="info-cell"><div class="lbl">Montant indemnisé</div><div class="val">${fmtEur(sinistre.montantIndemnise)}</div></div>
      <div class="info-cell"><div class="lbl">Statut</div><div class="val">${st.label}</div></div>
    </div>
  </div>

  <!-- Description -->
  ${sinistre.description ? `
  <div class="section">
    <div class="section-title">Description du sinistre</div>
    <div class="notes-box">${sinistre.description}</div>
  </div>` : ''}

  <!-- Pièces justificatives -->
  <div class="section">
    <div class="section-title">Pièces justificatives (${pieces.filter(p => p.recu).length}/${pieces.length} reçues)</div>
    <table>
      <thead><tr><th style="width:40px;"></th><th>Document</th><th style="width:100px;">Statut</th></tr></thead>
      <tbody>${piecesHtml}</tbody>
    </table>
  </div>

  <!-- Historique des courriers -->
  <div class="section">
    <div class="section-title">Historique des courriers (${relances.length})</div>
    <table>
      <thead><tr><th>Date</th><th>Type de courrier</th><th>Destinataire</th><th>Note</th></tr></thead>
      <tbody>${relancesHtml}</tbody>
    </table>
  </div>

  <!-- Notes internes -->
  ${sinistre.notes ? `
  <div class="section">
    <div class="section-title">Notes internes</div>
    <div class="notes-box">${sinistre.notes}</div>
  </div>` : ''}

  <div class="footer">
    <span>Dossier n° ${sinistre.numero || '—'} — ${sinistre.clientName || '—'}</span>
    <span>${cabinetInfo.name} — Document confidentiel</span>
  </div>

  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.write(html);
  win.document.close();
}
