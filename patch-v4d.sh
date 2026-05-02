#!/bin/bash
# Patch v4d — dashboards (back-office) + tableau-sinistres
set -e
echo "Application du patch v4d..."
mkdir -p api templates

echo "  templates/dashboard.html"
cat > 'templates/dashboard.html' << 'PATCH_EOF_TEMPLATES_DASHBOARD_HTML'
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tableau de bord — {{fullName}}</title>
<meta name="robots" content="noindex">
<style>
{{stylesCommon}}
.db-header { background: linear-gradient(135deg,#0d1b4b,#162e1a); padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.db-header h1 { font-size: 20px; font-weight: 400; color: #e0eaf8; }
.db-header p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 12px; color: #7a9ab8; margin-top: 3px; }
.btn { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 12px; font-weight: 600; padding: 9px 18px; border-radius: 7px; cursor: pointer; border: none; white-space: nowrap; }
.btn-green { background: #2d6a3f; color: #e0f5e8; }
.btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.3); color: #c0d0e8; }
.btn-danger { background: transparent; border: 1px solid #c05050; color: #c05050; }
.stats-bar { display: grid; grid-template-columns: repeat(5,1fr); gap: 12px; padding: 20px 32px; background: #fff; border-bottom: 1px solid #e0e8f0; }
@media(max-width:800px){.stats-bar{grid-template-columns:repeat(3,1fr);}}
@media(max-width:500px){.stats-bar{grid-template-columns:1fr 1fr;}}
.stat { background: #f5f8ff; border-radius: 10px; padding: 14px 18px; border-top: 3px solid #0d1b4b; }
.stat.green{border-top-color:#2d6a3f}.stat.amber{border-top-color:#8b5e0a}.stat.red{border-top-color:#a03030}.stat.purple{border-top-color:#5a3ab0}
.stat .val { font-size: 26px; color: #0d1b4b; font-family: Georgia,serif; }
.stat.green .val{color:#2d6a3f}.stat.amber .val{color:#8b5e0a}.stat.red .val{color:#a03030}.stat.purple .val{color:#5a3ab0}
.stat .lbl { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; color: #7a8a9e; margin-top: 3px; text-transform: uppercase; }
.tabs { display: flex; padding: 0 32px; background: #fff; border-bottom: 1px solid #e0e8f0; overflow-x: auto; }
.tab { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; padding: 14px 20px; cursor: pointer; border-bottom: 2px solid transparent; color: #7a8a9e; white-space: nowrap; }
.tab.active { color: #0d1b4b; border-bottom-color: #0d1b4b; }
.toolbar { padding: 16px 32px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; background: #fff; border-bottom: 1px solid #e0e8f0; }
.search { flex: 1; min-width: 180px; border: 1px solid #d0d8e0; border-radius: 7px; padding: 8px 14px; font-size: 13px; outline: none; font-family: 'Helvetica Neue',Arial,sans-serif; }
.filter { border: 1px solid #d0d8e0; border-radius: 7px; padding: 8px 12px; font-size: 12px; font-family: 'Helvetica Neue',Arial,sans-serif; outline: none; background: #fff; }
.table-wrap { padding: 20px 32px 40px; overflow-x: auto; }
@media(max-width:700px){.table-wrap,.toolbar,.stats-bar,.db-header,.tabs{padding-left:16px;padding-right:16px;}}
table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 900px; font-family: 'Helvetica Neue',Arial,sans-serif; }
thead th { background: #0d1b4b; color: #c0d0e8; font-weight: 600; padding: 11px 12px; text-align: left; font-size: 10px; text-transform: uppercase; }
tbody tr { border-bottom: 1px solid #eef2f8; }
tbody tr:hover { background: #f5f8ff; }
tbody td { padding: 11px 12px; color: #1a2e0a; }
.badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; white-space: nowrap; }
.badge-souscription { background: #dce8ff; color: #1a3a7a; }
.badge-sinistre { background: #ede8ff; color: #3a1a7a; }
.badge-recu { background: #dce8ff; color: #1a3a7a; }
.badge-encours { background: #fff3dc; color: #7a5010; }
.badge-clos { background: #dcf0e0; color: #1a5a2a; }
tbody tr.no-contract { background: #fff8f0; }
.ref-cell { font-family: 'Courier New',monospace; font-weight: 700; font-size: 11px; color: #3a1a7a; }
.ref-cell.souscription { color: #1a3a7a; }
.statut-sel { border: none; background: transparent; font-size: 11px; font-weight: 700; cursor: pointer; padding: 3px 6px; border-radius: 6px; outline: none; font-family: 'Helvetica Neue',Arial,sans-serif; }
.empty { text-align: center; padding: 60px 20px; color: #9aaab8; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; }
</style>
</head>
<body>
{{nav}}
<div class="db-header">
  <div><h1>Tableau de bord — {{fullName}} {{name}}</h1><p>Souscriptions &amp; sinistres · Synchronisation locale</p></div>
  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <button class="btn btn-green" onclick="exportCSV()">Exporter CSV</button>
    <button class="btn btn-outline" onclick="addTestData()">Données de démo</button>
    <button class="btn btn-danger" onclick="clearAll()">Vider</button>
  </div>
</div>
<div class="stats-bar">
  <div class="stat green"><div class="val" id="st-souscriptions">0</div><div class="lbl">Souscriptions</div></div>
  <div class="stat purple"><div class="val" id="st-sinistres">0</div><div class="lbl">Sinistres</div></div>
  <div class="stat amber"><div class="val" id="st-encours">0</div><div class="lbl">En cours</div></div>
  <div class="stat red"><div class="val" id="st-noncouverts">0</div><div class="lbl">Sans souscription</div></div>
  <div class="stat"><div class="val" id="st-ca">0 €</div><div class="lbl">CA souscriptions</div></div>
</div>
<div class="tabs">
  <div class="tab active" id="tab-all" onclick="setTab('all')">Tout voir</div>
  <div class="tab" id="tab-souscriptions" onclick="setTab('souscriptions')">Souscriptions</div>
  <div class="tab" id="tab-sinistres" onclick="setTab('sinistres')">Sinistres</div>
  <div class="tab" id="tab-alertes" onclick="setTab('alertes')">⚠ Alertes</div>
</div>
<div class="toolbar">
  <input class="search" type="text" id="search" placeholder="Rechercher nom, référence, email…" oninput="renderTable()">
  <select class="filter" id="f-statut" onchange="renderTable()"><option value="">Tous les statuts</option><option>Reçu</option><option>En cours</option><option>Clôturé</option></select>
</div>
<div class="table-wrap">
  <table>
    <thead><tr><th>Type</th><th>Référence</th><th>Date</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Détails</th><th>Montant</th><th>Statut</th></tr></thead>
    <tbody id="tbody"></tbody>
  </table>
  <div class="empty" id="empty" style="display:none">Aucune entrée pour cette sélection.</div>
</div>
{{footer}}
<script>
var currentTab = 'all';
function getSouscriptions() { return JSON.parse(localStorage.getItem('adce_souscriptions') || '[]'); }
function getSinistres() { return JSON.parse(localStorage.getItem('adce_sinistres') || '[]'); }
function saveSouscriptions(d) { localStorage.setItem('adce_souscriptions', JSON.stringify(d)); }
function saveSinistres(d) { localStorage.setItem('adce_sinistres', JSON.stringify(d)); }
function findSouscription(sin) {
  return getSouscriptions().find(function(s) {
    return (s.email && sin.email && s.email.toLowerCase() === sin.email.toLowerCase()) ||
           (s.nom && sin.nom && s.nom.toLowerCase() === sin.nom.toLowerCase());
  }) || null;
}
function updateStats() {
  var S = getSouscriptions(), X = getSinistres();
  var nonCouverts = X.filter(function(x){ return !findSouscription(x); }).length;
  var ca = S.reduce(function(a,s){ return a + (parseFloat(s.montant)||0); }, 0);
  var encours = X.filter(function(x){ return x.statut === 'En cours'; }).length + S.filter(function(s){ return s.statut === 'En cours'; }).length;
  document.getElementById('st-souscriptions').textContent = S.length;
  document.getElementById('st-sinistres').textContent = X.length;
  document.getElementById('st-encours').textContent = encours;
  document.getElementById('st-noncouverts').textContent = nonCouverts;
  document.getElementById('st-ca').textContent = ca.toFixed(0) + ' €';
  document.getElementById('tab-alertes').textContent = nonCouverts > 0 ? '⚠ Alertes (' + nonCouverts + ')' : '⚠ Alertes';
}
function setTab(t) {
  currentTab = t;
  document.querySelectorAll('.tab').forEach(function(el){ el.classList.remove('active'); });
  document.getElementById('tab-' + t).classList.add('active');
  renderTable();
}
function renderTable() {
  updateStats();
  var search = document.getElementById('search').value.toLowerCase();
  var fStat = document.getElementById('f-statut').value;
  var S = getSouscriptions().map(function(s,i){ return Object.assign({}, s, {_type:'souscription', _idx:i}); });
  var X = getSinistres().map(function(x,i){ return Object.assign({}, x, {_type:'sinistre', _idx:i}); });
  var rows = [];
  if (currentTab === 'all') rows = S.concat(X);
  else if (currentTab === 'souscriptions') rows = S;
  else if (currentTab === 'sinistres') rows = X;
  else if (currentTab === 'alertes') rows = X.filter(function(x){ return !findSouscription(x); });
  rows = rows.filter(function(r) {
    var ms = !search || (r.nom && r.nom.toLowerCase().includes(search)) || (r.email && r.email.toLowerCase().includes(search)) || (r.ref && r.ref.toLowerCase().includes(search));
    var mst = !fStat || r.statut === fStat;
    return ms && mst;
  });
  rows.sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
  var tbody = document.getElementById('tbody');
  var empty = document.getElementById('empty');
  if (rows.length === 0) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = rows.map(function(r) {
    var isSin = r._type === 'sinistre';
    var sub = isSin ? findSouscription(r) : null;
    var noContract = isSin && !sub;
    var typeBadge = isSin ? '<span class="badge badge-sinistre">Sinistre</span>' : '<span class="badge badge-souscription">Souscription</span>';
    var detailCell = isSin ? (r.desc ? r.desc.substring(0,40) + (r.desc.length>40?'…':'') : '—') : (r.options || '—');
    var montantCell = isSin ? '—' : ((r.montant || '0') + ' €');
    var statClass = r.statut === 'En cours' ? 'encours' : r.statut === 'Clôturé' ? 'clos' : 'recu';
    var statutOpts = ['Reçu','En cours','Clôturé'].map(function(s){ return '<option' + (r.statut===s?' selected':'') + '>' + s + '</option>'; }).join('');
    return '<tr' + (noContract ? ' class="no-contract"' : '') + '>' +
      '<td>' + typeBadge + '</td>' +
      '<td><span class="ref-cell ' + (isSin?'':'souscription') + '">' + (r.ref||'—') + '</span></td>' +
      '<td>' + (r.date||'—') + '</td>' +
      '<td><strong>' + (r.nom||'') + '</strong> ' + (r.prenom||'') + '</td>' +
      '<td><a href="mailto:' + (r.email||'') + '" style="color:#2d6a3f;font-size:11px">' + (r.email||'—') + '</a></td>' +
      '<td style="font-size:11px;color:#5a6a7e">' + (r.tel||'—') + '</td>' +
      '<td style="font-size:11px;max-width:160px">' + detailCell + '</td>' +
      '<td style="font-weight:600;color:#2d6a3f">' + montantCell + '</td>' +
      '<td><select class="statut-sel badge badge-' + statClass + '" data-type="' + r._type + '" data-idx="' + r._idx + '" onchange="changeStatut(this)">' + statutOpts + '</select></td>' +
    '</tr>';
  }).join('');
}
function changeStatut(el) {
  var type = el.getAttribute('data-type');
  var idx = parseInt(el.getAttribute('data-idx'));
  var val = el.value;
  if (type === 'souscription') { var d = getSouscriptions(); if (d[idx]) { d[idx].statut = val; saveSouscriptions(d); } }
  else { var d = getSinistres(); if (d[idx]) { d[idx].statut = val; saveSinistres(d); } }
  var cls = val === 'En cours' ? 'encours' : val === 'Clôturé' ? 'clos' : 'recu';
  el.className = 'statut-sel badge badge-' + cls;
  updateStats();
}
function exportCSV() {
  var S = getSouscriptions().map(function(s){ return ['Souscription',s.ref,s.date,s.nom,s.prenom,s.email,s.tel,s.options,s.saison,(s.montant||0)+' €','—',s.statut].join(';'); });
  var X = getSinistres().map(function(x){ var f = findSouscription(x); return ['Sinistre',x.ref,x.date,x.nom,x.prenom,x.email,x.tel,'—','—','—',f?'Couvert ('+f.ref+')':'NON COUVERT',x.statut].join(';'); });
  var csv = 'Type;Référence;Date;Nom;Prénom;Email;Téléphone;Options;Saison;Montant;Couverture;Statut\n' + S.concat(X).join('\n');
  var blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ADCE_{{slug}}_' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
}
function addTestData() {
  var now = new Date().toLocaleDateString('fr-FR');
  var S = getSouscriptions(), X = getSinistres();
  S.push({ref:'ADCE-2025-01234', date:now, nom:'Dupont', prenom:'Jean', email:'jean@test.fr', tel:'06 12 34 56 78', options:'Sécurité chasse + Chiens', saison:'2025-2026', montant:77, statut:'Reçu'});
  X.push({ref:'SIN-20251015-54321', date:now, nom:'Dupont', prenom:'Jean', email:'jean@test.fr', tel:'06 12 34 56 78', desc:'Chien blessé par sanglier lors d\'une battue.', statut:'En cours'});
  saveSouscriptions(S); saveSinistres(X); renderTable();
}
function clearAll() {
  if (confirm('Vider toutes les données ?')) {
    localStorage.removeItem('adce_souscriptions');
    localStorage.removeItem('adce_sinistres');
    renderTable();
  }
}
renderTable();
setInterval(renderTable, 8000);
</script>
</body>
</html>
PATCH_EOF_TEMPLATES_DASHBOARD_HTML

echo "  templates/tableau-sinistres.html"
cat > 'templates/tableau-sinistres.html' << 'PATCH_EOF_TEMPLATES_TABLEAU_SINISTRES_HTML'
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Suivi sinistres — {{fullName}}</title>
<meta name="robots" content="noindex">
<style>
{{stylesCommon}}
.header { background: linear-gradient(135deg,#0d1b4b,#1a0a2e); padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.header h1 { font-size: 22px; font-weight: 400; color: #e0eaf8; }
.header p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #7a9ab8; margin-top: 4px; }
.btn-export { background: #2d6a3f; color: #e0f5e8; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; font-weight: 600; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; }
.btn-clear { background: transparent; color: #c05050; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; border: 1px solid #c05050; padding: 10px 16px; border-radius: 8px; cursor: pointer; }
.stats-bar { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; padding: 24px 40px; background: #f5f0e8; border-bottom: 1px solid #e0d8c8; }
@media(max-width:600px){.stats-bar{grid-template-columns:1fr 1fr;}}
.stat-card { background: #fff; border-radius: 10px; padding: 16px 20px; }
.stat-card .val { font-size: 28px; font-weight: 400; color: #0d1b4b; font-family: Georgia,serif; }
.stat-card .lbl { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 12px; color: #7a8a9e; margin-top: 2px; }
.toolbar { padding: 20px 40px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.search-box { flex: 1; min-width: 200px; border: 1px solid #d0d8e0; border-radius: 8px; padding: 9px 14px; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; outline: none; }
.filter-sel { border: 1px solid #d0d8e0; border-radius: 8px; padding: 9px 14px; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; outline: none; background: #fff; }
.table-wrap { padding: 0 40px 40px; overflow-x: auto; }
@media(max-width:700px){.table-wrap,.toolbar,.stats-bar,.header{padding-left:16px;padding-right:16px;}}
table { width: 100%; border-collapse: collapse; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; min-width: 760px; }
thead th { background: #0d1b4b; color: #c0d0e8; font-weight: 600; padding: 12px 14px; text-align: left; font-size: 11px; text-transform: uppercase; }
tbody tr { border-bottom: 1px solid #e8f0e0; }
tbody tr:hover { background: #f5f8f0; }
tbody td { padding: 12px 14px; color: #1a2e0a; vertical-align: top; }
.ref-cell { font-family: 'Courier New',monospace; font-weight: 700; color: #3a1a7a; font-size: 12px; }
.statut-sel { border: none; background: transparent; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; padding: 3px 6px; border-radius: 6px; outline: none; }
.badge { display: inline-block; font-size: 11px; padding: 3px 10px; border-radius: 20px; font-weight: 600; }
.badge.recu { background: #dce8ff; color: #1a3a7a; }
.badge.encours { background: #fff3dc; color: #7a5010; }
.badge.clos { background: #dcf0e0; color: #1a5a2a; }
.empty-state { text-align: center; padding: 60px 20px; color: #7a8a9e; font-family: 'Helvetica Neue',Arial,sans-serif; }
</style>
</head>
<body>
{{nav}}
<div class="header">
  <div><h1>Suivi sinistres — {{name}} ({{code}})</h1><p>Vue dédiée des déclarations · Mis à jour en temps réel</p></div>
  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <button class="btn-export" onclick="exportCSV()">Exporter CSV</button>
    <button class="btn-clear" onclick="clearAll()">Vider</button>
  </div>
</div>
<div class="stats-bar">
  <div class="stat-card"><div class="val" id="stat-total">0</div><div class="lbl">Total</div></div>
  <div class="stat-card"><div class="val" id="stat-recu">0</div><div class="lbl">Reçus</div></div>
  <div class="stat-card"><div class="val" id="stat-encours">0</div><div class="lbl">En traitement</div></div>
  <div class="stat-card"><div class="val" id="stat-clos">0</div><div class="lbl">Clôturés</div></div>
</div>
<div class="toolbar">
  <input class="search-box" type="text" id="search" placeholder="Rechercher nom, référence, email…" oninput="renderTable()">
  <select class="filter-sel" id="filter-statut" onchange="renderTable()"><option value="">Tous les statuts</option><option>Reçu</option><option>En cours</option><option>Clôturé</option></select>
</div>
<div class="table-wrap">
  <table>
    <thead><tr><th>Référence</th><th>Date</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Date sinistre</th><th>Description</th><th>Statut</th></tr></thead>
    <tbody id="tbody"></tbody>
  </table>
  <div class="empty-state" id="empty" style="display:none">Aucune déclaration pour le moment.</div>
</div>
{{footer}}
<script>
function getData() { return JSON.parse(localStorage.getItem('adce_sinistres') || '[]'); }
function saveData(d) { localStorage.setItem('adce_sinistres', JSON.stringify(d)); }
function badgeClass(s) { return s === 'En cours' ? 'encours' : s === 'Clôturé' ? 'clos' : 'recu'; }
function renderTable() {
  var data = getData();
  var search = document.getElementById('search').value.toLowerCase();
  var fstat = document.getElementById('filter-statut').value;
  document.getElementById('stat-total').textContent = data.length;
  document.getElementById('stat-recu').textContent = data.filter(function(d){ return d.statut === 'Reçu'; }).length;
  document.getElementById('stat-encours').textContent = data.filter(function(d){ return d.statut === 'En cours'; }).length;
  document.getElementById('stat-clos').textContent = data.filter(function(d){ return d.statut === 'Clôturé'; }).length;
  var filtered = data.filter(function(d) {
    var ms = !search || (d.ref && d.ref.toLowerCase().includes(search)) || (d.nom && d.nom.toLowerCase().includes(search)) || (d.email && d.email.toLowerCase().includes(search));
    var st = !fstat || d.statut === fstat;
    return ms && st;
  });
  var tbody = document.getElementById('tbody');
  var empty = document.getElementById('empty');
  if (filtered.length === 0) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = filtered.slice().reverse().map(function(d) {
    var realIdx = data.indexOf(d);
    return '<tr><td><span class="ref-cell">' + (d.ref||'—') + '</span></td>' +
      '<td>' + (d.date||'') + '</td>' +
      '<td><strong>' + (d.nom||'') + '</strong><br>' + (d.prenom||'') + '</td>' +
      '<td><a href="mailto:' + (d.email||'') + '" style="color:#2d6a3f">' + (d.email||'') + '</a></td>' +
      '<td>' + (d.tel||'—') + '</td>' +
      '<td>' + (d.date_sin ? d.date_sin.split('-').reverse().join('/') : '—') + '</td>' +
      '<td style="max-width:180px;color:#5a6a7e">' + (d.desc||'') + '</td>' +
      '<td><select class="statut-sel badge ' + badgeClass(d.statut) + '" onchange="changeStatut(' + realIdx + ',this.value,this)">' +
        '<option' + (d.statut==='Reçu'?' selected':'') + '>Reçu</option>' +
        '<option' + (d.statut==='En cours'?' selected':'') + '>En cours</option>' +
        '<option' + (d.statut==='Clôturé'?' selected':'') + '>Clôturé</option>' +
      '</select></td></tr>';
  }).join('');
}
function changeStatut(idx, val, el) {
  var d = getData();
  if (d[idx]) { d[idx].statut = val; saveData(d); el.className = 'statut-sel badge ' + badgeClass(val); renderTable(); }
}
function exportCSV() {
  var d = getData();
  if (d.length === 0) { alert('Aucune déclaration à exporter.'); return; }
  var rows = d.map(function(x){ return [x.ref,x.date,x.heure,x.nom,x.prenom,x.email,x.tel,x.date_sin,'"'+(x.desc||'').replace(/"/g,'""')+'"',x.statut].join(';'); });
  var csv = 'Référence;Date;Heure;Nom;Prénom;Email;Téléphone;Date sinistre;Description;Statut\n' + rows.join('\n');
  var blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ADCE_{{slug}}_sinistres_' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
}
function clearAll() {
  if (confirm('Vider toutes les déclarations ?')) {
    localStorage.removeItem('adce_sinistres'); renderTable();
  }
}
renderTable();
setInterval(renderTable, 10000);
</script>
</body>
</html>
PATCH_EOF_TEMPLATES_TABLEAU_SINISTRES_HTML

echo "Patch v4d applique."
