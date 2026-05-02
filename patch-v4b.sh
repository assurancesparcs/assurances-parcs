#!/bin/bash
# Patch v4b — pages mentions/rgpd/sinistre + API claim
set -e
echo "Application du patch v4b..."
mkdir -p api templates

echo "  templates/mentions-legales.html"
cat > 'templates/mentions-legales.html' << 'PATCH_EOF_TEMPLATES_MENTIONS_LEGALES_HTML'
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mentions légales — {{siteTitle}}</title>
<style>
{{stylesCommon}}
.content { max-width: 760px; margin: 0 auto; padding: 48px 32px 64px; }
.content h1 { font-size: 28px; color: #0d1b4b; font-weight: normal; margin-bottom: 8px; }
.content .subtitle { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #7a8a9e; margin-bottom: 36px; }
.content h2 { font-size: 18px; color: #0d1b4b; font-weight: 600; margin-top: 32px; margin-bottom: 12px; font-family: 'Helvetica Neue',Arial,sans-serif; }
.content p, .content li { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; color: #3a4e3a; line-height: 1.75; margin-bottom: 12px; }
.content strong { color: #0d1b4b; }
.content ul { margin-left: 20px; margin-bottom: 16px; }
.content a { color: #2d6a3f; text-decoration: none; }
.content a:hover { text-decoration: underline; }
.box { background: #f5f8f0; border-radius: 10px; padding: 20px 24px; margin: 16px 0; }
</style>
</head>
<body>
{{nav}}
<div class="content">
  <h1>Mentions légales</h1>
  <p class="subtitle">Site {{domain}} · Édition {{name}} ({{code}})</p>
  <h2>Éditeur du site</h2>
  <div class="box">
    <p><strong>{{fullName}}</strong><br>
    {{address}} — {{addressZip}} {{addressCity}}<br>
    Téléphone : {{phone}} ({{phoneNote}})<br>
    Email : <a href="mailto:{{emailGeneral}}">{{emailGeneral}}</a></p>
    <p><strong>ORIAS :</strong> {{orias}}<br>
    Intermédiaire en assurance enregistré auprès de l'ORIAS — <a href="https://www.orias.fr" target="_blank">www.orias.fr</a><br>
    Soumis au contrôle de l'Autorité de Contrôle Prudentiel et de Résolution (ACPR), 4 Place de Budapest, CS 92459, 75436 Paris Cedex 09 — <a href="https://acpr.banque-france.fr" target="_blank">www.acpr.banque-france.fr</a></p>
  </div>
  <h2>Hébergeur</h2>
  <p><strong>Vercel Inc.</strong><br>340 S Lemon Ave #4133, Walnut, CA 91789, USA<br><a href="https://vercel.com" target="_blank">vercel.com</a></p>
  <h2>Activité et partenaires</h2>
  <p>Le site {{domain}} est édité par {{fullName}}, courtier en assurance, dans le cadre d'un partenariat avec la <strong>{{fdcName}}</strong> ({{fdcShort}}).</p>
  <p>Les garanties d'assurance proposées sont souscrites auprès de :</p>
  <ul>
    <li><strong>MIC Insurance Company SA</strong> — 29 rue de Bassano, 75008 Paris (RCS Paris 885.241.208) pour la garantie chiens de chasse et la responsabilité civile.</li>
    <li><strong>Allianz</strong> pour la garantie corporelle Sécurité chasse.</li>
  </ul>
  <h2>Propriété intellectuelle</h2>
  <p>L'ensemble du site (textes, images, logos, charte graphique, code) est la propriété de {{fullName}} ou de ses partenaires. Toute reproduction ou utilisation non autorisée est interdite et constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.</p>
  <h2>Données personnelles et RGPD</h2>
  <p>Les données collectées via ce site sont traitées conformément au RGPD. Pour plus de détails, consultez notre <a href="/rgpd-cookies.html">politique de confidentialité</a>.</p>
  <h2>Cookies</h2>
  <p>Ce site utilise des cookies techniques nécessaires à son fonctionnement et, sous réserve de votre consentement, des cookies analytiques. Vous pouvez gérer vos préférences via le bandeau cookies en bas de page.</p>
  <h2>Médiation</h2>
  <p>En cas de réclamation et si aucune solution n'a pu être trouvée avec {{fullName}}, vous pouvez saisir gratuitement le Médiateur de l'Assurance :<br>
  <strong>La Médiation de l'Assurance</strong> — TSA 50110, 75441 Paris cedex 09 — <a href="https://www.mediation-assurance.org" target="_blank">www.mediation-assurance.org</a></p>
  <h2>Loi applicable et juridiction</h2>
  <p>Le présent site et les contrats souscrits via celui-ci sont régis par le droit français. Tout litige relève de la compétence exclusive des juridictions françaises.</p>
</div>
{{footer}}
</body>
</html>
PATCH_EOF_TEMPLATES_MENTIONS_LEGALES_HTML

echo "  templates/rgpd-cookies.html"
cat > 'templates/rgpd-cookies.html' << 'PATCH_EOF_TEMPLATES_RGPD_COOKIES_HTML'
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cookies & RGPD — {{siteTitle}}</title>
<style>
{{stylesCommon}}
.content { max-width: 760px; margin: 0 auto; padding: 48px 32px 64px; }
.content h1 { font-size: 28px; color: #0d1b4b; font-weight: normal; margin-bottom: 36px; }
.content h2 { font-size: 18px; color: #0d1b4b; font-weight: 600; margin-top: 28px; margin-bottom: 10px; font-family: 'Helvetica Neue',Arial,sans-serif; }
.content p, .content li { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; color: #3a4e3a; line-height: 1.75; margin-bottom: 12px; }
.content strong { color: #0d1b4b; }
.content ul { margin-left: 20px; }
.content a { color: #2d6a3f; }
.btn-config { display: inline-block; background: #0d1b4b; color: #e0eaf8; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px; cursor: pointer; border: none; margin: 20px 0; }
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9995; align-items: center; justify-content: center; padding: 20px; }
.modal-overlay.open { display: flex; }
.modal-box { background: #fff; border-radius: 14px; max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; }
.modal-header { background: linear-gradient(135deg,#0d1b4b,#162e1a); padding: 20px 24px; border-radius: 14px 14px 0 0; display: flex; align-items: center; justify-content: space-between; }
.modal-header h3 { font-size: 16px; font-weight: 400; color: #e0eaf8; font-family: 'Helvetica Neue',Arial,sans-serif; }
.btn-close-modal { background: transparent; border: none; color: #9ab8d8; font-size: 20px; cursor: pointer; }
.modal-body { padding: 24px; }
.cookie-cat { border: 1px solid #e0e8d0; border-radius: 10px; margin-bottom: 12px; overflow: hidden; }
.cookie-cat-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: #f5f8f0; }
.cookie-cat-header h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; font-weight: 600; color: #1a2e0a; }
.cookie-cat-header p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; color: #7a8a7e; margin-top: 2px; }
.cookie-cat-body { padding: 12px 16px; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 12px; color: #5a6a5e; line-height: 1.6; }
.toggle { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-track { position: absolute; inset: 0; background: #c0c8d0; border-radius: 22px; transition: background 0.2s; cursor: pointer; }
.toggle input:checked + .toggle-track { background: #2d6a3f; }
.toggle-thumb { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: transform 0.2s; pointer-events: none; }
.toggle input:checked ~ .toggle-thumb { transform: translateX(18px); }
.toggle input:disabled + .toggle-track { background: #2d6a3f; cursor: not-allowed; opacity: 0.7; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #e0e8d0; display: flex; gap: 10px; justify-content: flex-end; }
.btn-save { background: #0d1b4b; color: #e0eaf8; border: none; border-radius: 7px; padding: 10px 24px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-refuse { background: transparent; color: #5a6a5e; border: 1px solid #c0c8b0; border-radius: 7px; padding: 10px 18px; font-size: 13px; cursor: pointer; }
#cookie-banner { position: fixed; bottom: 0; left: 0; right: 0; background: #0d1b4b; border-top: 3px solid #2d6a3f; padding: 18px 32px; z-index: 9990; display: none; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
#cookie-banner.visible { display: flex; }
@media(max-width:600px) { #cookie-banner { padding: 16px 20px; flex-direction: column; align-items: flex-start; } }
.cookie-text { flex: 1; min-width: 200px; }
.cookie-text h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; font-weight: 600; color: #e0eaf8; margin-bottom: 5px; }
.cookie-text p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 12px; color: #8aaac8; line-height: 1.55; }
.cookie-text a { color: #6abf7b; cursor: pointer; }
.cookie-btns { display: flex; gap: 10px; flex-shrink: 0; flex-wrap: wrap; }
.btn-accept { background: #2d6a3f; color: #e0f5e8; border: none; border-radius: 7px; padding: 10px 22px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
</style>
</head>
<body>
{{nav}}
<div id="cookie-banner">
  <div class="cookie-text">
    <h4>Ce site utilise des cookies</h4>
    <p>Nous utilisons des cookies techniques nécessaires et, sous réserve de votre consentement, des cookies analytiques. <a onclick="openPrefs()">Personnaliser mes choix</a></p>
  </div>
  <div class="cookie-btns">
    <button class="btn-refuse" onclick="refuseCookies()" style="color:#8aaac8;border-color:rgba(255,255,255,0.2)">Refuser</button>
    <button class="btn-accept" onclick="acceptCookies()">Tout accepter</button>
  </div>
</div>
<div class="modal-overlay" id="modal-prefs">
  <div class="modal-box">
    <div class="modal-header"><h3>Gestion des cookies</h3><button class="btn-close-modal" onclick="closePrefs()">✕</button></div>
    <div class="modal-body">
      <p style="font-size:13px;color:#3a4e3a;line-height:1.7;margin-bottom:16px;">Choisissez les catégories de cookies que vous acceptez. Certains sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.</p>
      <div class="cookie-cat">
        <div class="cookie-cat-header">
          <div><h4>Cookies essentiels</h4><p>Indispensables au fonctionnement du site</p></div>
          <label class="toggle"><input type="checkbox" checked disabled><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
        </div>
        <div class="cookie-cat-body">Nécessaires pour la navigation, la souscription en ligne et la sécurité.</div>
      </div>
      <div class="cookie-cat">
        <div class="cookie-cat-header">
          <div><h4>Cookies analytiques</h4><p>Mesure d'audience anonyme</p></div>
          <label class="toggle"><input type="checkbox" id="toggle-analytics"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
        </div>
        <div class="cookie-cat-body">Nous permettent de comprendre comment les visiteurs utilisent le site.</div>
      </div>
      <div class="cookie-cat">
        <div class="cookie-cat-header">
          <div><h4>Cookies fonctionnels</h4><p>Mémorisation de vos préférences</p></div>
          <label class="toggle"><input type="checkbox" id="toggle-fonct"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
        </div>
        <div class="cookie-cat-body">Permettent de mémoriser vos choix (langue, formulaires pré-remplis).</div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-refuse" onclick="refuseCookies()">Tout refuser</button>
      <button class="btn-save" onclick="savePrefs()">Enregistrer mes choix</button>
    </div>
  </div>
</div>
<div class="content">
  <h1>Politique de confidentialité &amp; gestion des cookies</h1>
  <h2>Responsable du traitement</h2>
  <p><strong>{{fullName}}</strong> — {{address}}, {{addressZip}} {{addressCity}}<br>Email : {{emailGeneral}} · Tél : {{phone}}<br>ORIAS : {{orias}}</p>
  <h2>Données collectées</h2>
  <p>Dans le cadre de votre souscription ou déclaration de sinistre, nous collectons :</p>
  <ul>
    <li>Identité : nom, prénom, date de naissance</li>
    <li>Coordonnées : adresse, email, téléphone</li>
    <li>Données liées au contrat : numéro de permis, options souscrites, informations sur vos chiens</li>
    <li>Documents justificatifs : copie du permis, validation {{fdcShort}}, documents sinistre</li>
  </ul>
  <h2>Finalités du traitement</h2>
  <ul>
    <li>Gestion et exécution de votre contrat d'assurance</li>
    <li>Traitement des déclarations de sinistre</li>
    <li>Envoi de votre attestation d'assurance</li>
    <li>Obligations légales et réglementaires (ACPR, ORIAS)</li>
  </ul>
  <h2>Base légale</h2>
  <p>Le traitement de vos données est fondé sur l'exécution du contrat d'assurance (art. 6.1.b RGPD) et le respect de nos obligations légales (art. 6.1.c RGPD).</p>
  <h2>Durée de conservation</h2>
  <p>Vos données sont conservées pendant la durée de votre contrat, augmentée des délais légaux de prescription applicables en matière d'assurance (2 ans à compter de la résiliation).</p>
  <h2>Vos droits</h2>
  <p>Conformément au RGPD, vous disposez des droits suivants :</p>
  <ul>
    <li>Droit d'accès à vos données personnelles</li>
    <li>Droit de rectification</li>
    <li>Droit à l'effacement (sous conditions légales)</li>
    <li>Droit à la limitation du traitement</li>
    <li>Droit à la portabilité de vos données</li>
    <li>Droit d'opposition au traitement</li>
  </ul>
  <p>Pour exercer vos droits : <strong>{{emailGeneral}}</strong> ou par courrier à {{fullName}}, {{address}}, {{addressZip}} {{addressCity}}.<br>Vous pouvez également introduire une réclamation auprès de la <strong>CNIL</strong> (cnil.fr).</p>
  <h2>Cookies</h2>
  <p>Ce site utilise des cookies techniques nécessaires à son fonctionnement, ainsi que des cookies analytiques et fonctionnels soumis à votre consentement.</p>
  <button class="btn-config" onclick="openPrefs()">Gérer mes cookies</button>
</div>
{{footer}}
<script>
function getConsent() { return localStorage.getItem('adce_cookie_consent'); }
function showBanner() { if (!getConsent()) setTimeout(function(){ document.getElementById('cookie-banner').classList.add('visible'); }, 800); }
function acceptCookies() { localStorage.setItem('adce_cookie_consent', JSON.stringify({essential:true,analytics:true,fonctionnel:true,date:new Date().toISOString()})); hideBanner(); }
function refuseCookies() { localStorage.setItem('adce_cookie_consent', JSON.stringify({essential:true,analytics:false,fonctionnel:false,date:new Date().toISOString()})); hideBanner(); closePrefs(); }
function savePrefs() {
  var a = document.getElementById('toggle-analytics').checked;
  var f = document.getElementById('toggle-fonct').checked;
  localStorage.setItem('adce_cookie_consent', JSON.stringify({essential:true,analytics:a,fonctionnel:f,date:new Date().toISOString()}));
  hideBanner(); closePrefs();
}
function hideBanner() { document.getElementById('cookie-banner').classList.remove('visible'); }
function openPrefs() { document.getElementById('modal-prefs').classList.add('open'); }
function closePrefs() { document.getElementById('modal-prefs').classList.remove('open'); }
showBanner();
</script>
</body>
</html>
PATCH_EOF_TEMPLATES_RGPD_COOKIES_HTML

echo "  templates/sinistre.html"
cat > 'templates/sinistre.html' << 'PATCH_EOF_TEMPLATES_SINISTRE_HTML'
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Déclarer un sinistre — {{siteTitle}}</title>
<style>
{{stylesCommon}}
.hero { background: linear-gradient(135deg, #1a0a2e 0%, #0d1b4b 100%); padding: 48px 32px 40px; text-align: center; }
.hero-badge { display: inline-block; background: rgba(180,150,220,0.15); color: #b49ae0; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; letter-spacing: 0.1em; padding: 5px 16px; border-radius: 20px; border: 1px solid rgba(180,150,220,0.3); margin-bottom: 20px; text-transform: uppercase; }
.hero h1 { font-size: clamp(20px,3.5vw,32px); color: #e8e0f5; font-weight: normal; line-height: 1.35; max-width: 520px; margin: 0 auto 12px; }
.hero p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; color: #9a8ac0; line-height: 1.7; max-width: 480px; margin: 0 auto; }
.content { max-width: 720px; margin: 0 auto; padding: 48px 32px; }
.delai-band { background: #f0ecf8; border-left: 3px solid #6a4ab0; border-radius: 0 8px 8px 0; padding: 14px 20px; margin-bottom: 36px; }
.delai-band p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #3a2a5e; line-height: 1.6; }
.delai-band strong { color: #1a0a2e; }
.etapes { display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
.etape-row { display: flex; gap: 16px; align-items: flex-start; }
.etape-num { width: 32px; height: 32px; border-radius: 50%; background: #0d1b4b; display: flex; align-items: center; justify-content: center; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; font-weight: 700; color: #b49ae0; flex-shrink: 0; }
.etape-row h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; font-weight: 600; color: #1a0a2e; margin-bottom: 4px; }
.etape-row p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #6a5a8e; line-height: 1.55; }
.section-title { font-size: 20px; color: #1a0a2e; font-weight: normal; margin-bottom: 20px; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media(max-width:520px){.two-col{grid-template-columns:1fr;}}
.field { margin-bottom: 14px; }
.field label { display: block; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 12px; color: #5a4a7e; margin-bottom: 5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
.req { color: #c0306a; }
.field input, .field select, .field textarea { width: 100%; border: 1px solid #d0c8e0; border-radius: 8px; padding: 10px 14px; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; color: #1a0a2e; background: #fff; outline: none; box-sizing: border-box; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: #6a4ab0; }
.radio-group, .check-group { display: flex; flex-direction: column; gap: 6px; }
.radio-opt, .check-opt { display: flex; align-items: center; gap: 10px; background: #f8f5ff; border-radius: 8px; padding: 10px 14px; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #2a1a4e; cursor: pointer; border: 1px solid transparent; }
.radio-opt:hover, .check-opt:hover { border-color: #b49ae0; }
.upload-section { background: #f8f5ff; border-radius: 12px; padding: 24px; margin-bottom: 28px; border: 1px solid #e0d8f0; }
.upload-section h3 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 15px; font-weight: 600; color: #1a0a2e; margin-bottom: 6px; }
.upload-section p.sub { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 12px; color: #7a6a9e; margin-bottom: 20px; line-height: 1.5; }
.upload-slots { display: flex; flex-direction: column; gap: 10px; }
.upload-slot { background: #fff; border: 1.5px dashed #c0b0e0; border-radius: 10px; padding: 16px 18px; display: flex; align-items: center; gap: 14px; cursor: pointer; position: relative; }
.upload-slot:hover { border-color: #6a4ab0; background: #f5f0ff; }
.upload-slot.has-file { border-color: #2d6a3f; border-style: solid; background: #f0faf4; }
.upload-slot input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
.slot-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #eeeeff; }
.slot-text h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; font-weight: 600; color: #1a0a2e; margin-bottom: 2px; }
.slot-text p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; color: #8a7aae; margin: 0; }
.slot-badge { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 10px; padding: 2px 8px; border-radius: 20px; margin-left: auto; white-space: nowrap; flex-shrink: 0; background: #ede8ff; color: #5a3ab0; }
.slot-status { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; color: #2d6a3f; font-weight: 600; margin-left: auto; flex-shrink: 0; display: none; }
.upload-slot.has-file .slot-status { display: block; }
.upload-slot.has-file .slot-badge { display: none; }
.btn-submit { width: 100%; background: #3a1a7a; color: #e8e0f5; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 15px; font-weight: 600; padding: 16px; border: none; border-radius: 10px; cursor: pointer; margin-top: 8px; }
.btn-submit:hover { background: #4a2a9a; }
.envoi-band { background: #f8f5ff; border-radius: 12px; padding: 24px 28px; margin-top: 32px; }
.envoi-band h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 15px; font-weight: 600; color: #1a0a2e; margin-bottom: 16px; }
.envoi-row { display: flex; gap: 12px; margin-bottom: 12px; }
.envoi-row p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #5a4a7e; line-height: 1.6; }
.envoi-row a { color: #6a4ab0; }
.popup-overlay { position: fixed; inset: 0; background: rgba(10,5,30,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.3s; padding: 20px; }
.popup-overlay.visible { opacity: 1; pointer-events: all; }
.popup-box { background: #fff; border-radius: 16px; padding: 40px 36px; max-width: 480px; width: 100%; text-align: center; transform: translateY(20px); transition: transform 0.3s; }
.popup-overlay.visible .popup-box { transform: translateY(0); }
.popup-icon { width: 72px; height: 72px; background: #eaf3de; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.popup-box h2 { font-size: 22px; font-weight: normal; color: #0d1b4b; margin-bottom: 10px; font-family: Georgia, serif; }
.popup-box p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; color: #5a6a7e; line-height: 1.7; margin-bottom: 8px; }
.popup-num { display: inline-block; background: #f0ecf8; border: 1.5px solid #b49ae0; border-radius: 8px; padding: 10px 24px; font-family: 'Courier New', monospace; font-size: 20px; font-weight: 700; color: #3a1a7a; letter-spacing: 2px; margin: 12px 0 20px; }
.popup-note { font-size: 12px; color: #9a9ab0; }
.btn-close { background: #0d1b4b; color: #e0eaf8; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; font-weight: 600; padding: 12px 32px; border: none; border-radius: 8px; cursor: pointer; margin-top: 16px; width: 100%; }
.btn-close:hover { background: #162770; }
</style>
</head>
<body>
{{nav}}
<div class="popup-overlay" id="popup">
  <div class="popup-box">
    <div class="popup-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d6a3f" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>
    <h2>Déclaration bien envoyée !</h2>
    <p>Votre déclaration de sinistre a été transmise au {{fullName}}. Voici votre numéro de dossier :</p>
    <div class="popup-num" id="popup-ref">—</div>
    <p><strong>Conservez ce numéro</strong> — il vous sera demandé pour tout suivi de votre dossier.</p>
    <p class="popup-note">Un email de confirmation a été envoyé à <span id="popup-email">votre adresse</span>.<br>Nous vous contacterons sous 48h ouvrées.</p>
    <button class="btn-close" onclick="closePopup()">Fermer et retourner à l'accueil</button>
  </div>
</div>
<div class="hero">
  <span class="hero-badge">Déclaration de sinistre</span>
  <h1>Déclarez votre sinistre en ligne</h1>
  <p>Remplissez ce formulaire et joignez les pièces nécessaires. Nous traitons votre dossier dans les meilleurs délais.</p>
</div>
<div class="content">
  <div class="delai-band"><p>Vous disposez de <strong>5 jours ouvrés</strong> suivant le sinistre pour effectuer votre déclaration. En cas d'urgence, appelez-nous au <strong>{{phone}}</strong> ({{phoneNote}}).</p></div>
  <div class="etapes">
    <div class="etape-row"><div class="etape-num">1</div><div><h4>Remplissez le formulaire</h4><p>Décrivez les circonstances et les dommages subis.</p></div></div>
    <div class="etape-row"><div class="etape-num">2</div><div><h4>Joignez vos documents</h4><p>Permis, validation {{fdcShort}}, photos, tout document utile.</p></div></div>
    <div class="etape-row"><div class="etape-num">3</div><div><h4>Recevez votre numéro de sinistre</h4><p>Un numéro unique est généré à l'envoi. Conservez-le pour suivre votre dossier.</p></div></div>
  </div>
  <h2 class="section-title">Formulaire de déclaration</h2>
  <form id="sin-form" onsubmit="event.preventDefault(); submitForm();">
    <div class="two-col">
      <div class="field"><label>Nom <span class="req">*</span></label><input type="text" id="s-nom" required placeholder="Dupont"/></div>
      <div class="field"><label>Prénom <span class="req">*</span></label><input type="text" id="s-prenom" required placeholder="Jean"/></div>
    </div>
    <div class="two-col">
      <div class="field"><label>Téléphone <span class="req">*</span></label><input type="tel" id="s-tel" required placeholder="06 00 00 00 00"/></div>
      <div class="field"><label>Email <span class="req">*</span></label><input type="email" id="s-email" required placeholder="jean@email.com"/></div>
    </div>
    <div class="field"><label>Adresse postale <span class="req">*</span></label><input type="text" id="s-adresse" required placeholder="12 rue de la Forêt, {{addressZip}} {{addressCity}}"/></div>
    <div class="field"><label>Date du sinistre <span class="req">*</span></label><input type="date" id="s-date" required/></div>
    <div class="field">
      <label>Qui a causé le sinistre ? <span class="req">*</span></label>
      <div class="radio-group">
        <label class="radio-opt"><input type="radio" name="cause"> Vous-même</label>
        <label class="radio-opt"><input type="radio" name="cause"> Votre chien</label>
        <label class="radio-opt"><input type="radio" name="cause"> Un autre chasseur</label>
        <label class="radio-opt"><input type="radio" name="cause"> Le chien d'un autre chasseur</label>
      </div>
    </div>
    <div class="field">
      <label>Type(s) de dommages <span class="req">*</span></label>
      <div class="check-group">
        <label class="check-opt"><input type="checkbox"> Blessure corporelle (chasseur)</label>
        <label class="check-opt"><input type="checkbox"> Blessure d'un chien</label>
        <label class="check-opt"><input type="checkbox"> Dommages à un véhicule</label>
        <label class="check-opt"><input type="checkbox"> Dommages à des volailles ou animaux d'élevage</label>
        <label class="check-opt"><input type="checkbox"> Autres dommages matériels</label>
      </div>
    </div>
    <div class="field">
      <label>Le sinistre s'est produit <span class="req">*</span></label>
      <div class="radio-group">
        <label class="radio-opt"><input type="radio" name="moment"> Pendant une partie de chasse</label>
        <label class="radio-opt"><input type="radio" name="moment"> Hors d'une partie de chasse</label>
      </div>
    </div>
    <div class="field"><label>Nom et coordonnées du tiers éventuel</label><input type="text" id="s-tiers" placeholder="Si un tiers est impliqué"/></div>
    <div class="field"><label>Description des circonstances <span class="req">*</span></label><textarea id="s-desc" rows="5" required placeholder="Décrivez brièvement comment le sinistre s'est produit…" style="resize:vertical;font-family:inherit"></textarea></div>
    <div class="upload-section">
      <h3>Pièces justificatives</h3>
      <p class="sub">Joignez vos documents directement ici (PDF, JPG, PNG — 10 Mo max par fichier). Vous pouvez aussi nous les envoyer après à {{emailSinistres}}.</p>
      <div class="upload-slots">
        <label class="upload-slot" id="slot-permis"><input type="file" id="file-permis" accept=".pdf,.jpg,.jpeg,.png" onchange="fileSelected('slot-permis','file-permis')"><div class="slot-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3a2ab0" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div class="slot-text"><h4>Copie du permis de chasse</h4><p>Recto-verso · PDF ou photo</p></div><span class="slot-badge">Facultatif</span><span class="slot-status">✓ Ajouté</span></label>
        <label class="upload-slot" id="slot-valid"><input type="file" id="file-valid" accept=".pdf,.jpg,.jpeg,.png" onchange="fileSelected('slot-valid','file-valid')"><div class="slot-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3a2ab0" stroke-width="1.5" stroke-linecap="round"><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div class="slot-text"><h4>Validation {{fdcShort}} (saison en cours)</h4><p>Timbre de validation · PDF ou photo</p></div><span class="slot-badge">Facultatif</span><span class="slot-status">✓ Ajouté</span></label>
        <label class="upload-slot" id="slot-photos"><input type="file" id="file-photos" accept=".jpg,.jpeg,.png,.heic" multiple onchange="fileSelected('slot-photos','file-photos',true)"><div class="slot-icon" style="background:#fff8ee"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5e0a" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div><div class="slot-text"><h4>Photos du sinistre</h4><p>Blessures, dommages, lieu · sélection multiple</p></div><span class="slot-badge">Facultatif</span><span class="slot-status">✓ Ajoutées</span></label>
        <label class="upload-slot" id="slot-annexe"><input type="file" id="file-annexe" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" multiple onchange="fileSelected('slot-annexe','file-annexe',true)"><div class="slot-icon" style="background:#f0f8ff"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a5a7a" stroke-width="1.5" stroke-linecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></div><div class="slot-text"><h4>Document annexe</h4><p>Certificat médical, facture vétérinaire, rapport…</p></div><span class="slot-badge">Facultatif</span><span class="slot-status">✓ Ajouté(s)</span></label>
      </div>
    </div>
    <button class="btn-submit" type="submit">Envoyer ma déclaration</button>
  </form>
  <div class="envoi-band">
    <h4>Vous préférez envoyer vos documents séparément ?</h4>
    <div class="envoi-row"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a4ab0" stroke-width="1.5" stroke-linecap="round" style="flex-shrink:0;margin-top:2px"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><p>Par email : <a href="mailto:{{emailSinistres}}"><strong>{{emailSinistres}}</strong></a> — en mentionnant votre nom et votre numéro de sinistre.</p></div>
    <div class="envoi-row"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a4ab0" stroke-width="1.5" stroke-linecap="round" style="flex-shrink:0;margin-top:2px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><p><strong>{{fullName}} — {{address}}, {{addressZip}} {{addressCity}}</strong></p></div>
  </div>
</div>
{{footer}}
<script>
var filesAdded = {};
function fileSelected(slotId, inputId) {
  var input = document.getElementById(inputId);
  var slot = document.getElementById(slotId);
  if (input.files && input.files.length > 0) {
    slot.classList.add('has-file');
    filesAdded[slotId] = Array.from(input.files).map(function(f){ return f.name; });
  }
}
function generateRef() {
  var now = new Date();
  var yy = now.getFullYear();
  var mm = String(now.getMonth() + 1).padStart(2, '0');
  var dd = String(now.getDate()).padStart(2, '0');
  var rand = Math.floor(Math.random() * 90000) + 10000;
  return 'SIN-' + yy + mm + dd + '-' + rand;
}
async function submitForm() {
  var nom = document.getElementById('s-nom').value.trim();
  var email = document.getElementById('s-email').value.trim();
  var desc = document.getElementById('s-desc').value.trim();
  if (!nom || !email || !desc) { alert('Merci de remplir tous les champs obligatoires.'); return; }
  var ref = generateRef();
  var payload = {
    department: '{{slug}}',
    ref: ref,
    nom: nom, prenom: document.getElementById('s-prenom').value.trim(),
    tel: document.getElementById('s-tel').value.trim(), email: email,
    adresse: document.getElementById('s-adresse').value.trim(),
    date_sin: document.getElementById('s-date').value,
    desc: desc,
    tiers: document.getElementById('s-tiers').value.trim(),
    files: filesAdded
  };
  try {
    await fetch('/api/claim-submit', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  } catch(e) {}
  document.getElementById('popup-ref').textContent = ref;
  document.getElementById('popup-email').textContent = email;
  document.getElementById('popup').classList.add('visible');
}
function closePopup() {
  document.getElementById('popup').classList.remove('visible');
  window.location.href = '/';
}
</script>
</body>
</html>
PATCH_EOF_TEMPLATES_SINISTRE_HTML

echo "  api/claim-submit.js"
cat > 'api/claim-submit.js' << 'PATCH_EOF_API_CLAIM_SUBMIT_JS'
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const claim = req.body || {};
  if (!claim.email || !claim.nom || !claim.desc || !claim.ref) {
    return res.status(400).json({ error: 'Données manquantes' });
  }
  console.log('Sinistre reçu', { ref: claim.ref, department: claim.department, nom: claim.nom, email: claim.email, date_sin: claim.date_sin });
  // TODO Email via Gmail SMTP (cabinet + AR au déclarant)
  return res.status(200).json({ received: true, ref: claim.ref });
};
PATCH_EOF_API_CLAIM_SUBMIT_JS

echo "Patch v4b applique."
