#!/bin/bash
# Patch v4a — pages info chiens/securite/contact/guichet + API contact
set -e
echo "Application du patch v4a..."
mkdir -p api templates

echo "  templates/chiens-de-chasse.html"
cat > 'templates/chiens-de-chasse.html' << 'PATCH_EOF_TEMPLATES_CHIENS_DE_CHASSE_HTML'
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chiens de chasse — {{siteTitle}}</title>
<meta name="description" content="Option Chiens de chasse — frais vétérinaires, chirurgie, hospitalisation. À partir de {{tarifChienPerDog}} €/chien/an.">
<style>
{{stylesCommon}}
.hero { background: linear-gradient(135deg, #2a1a06 0%, #3d2a08 60%, #0d1b4b 100%); padding: 52px 32px 44px; text-align: center; }
.hero-badge { display: inline-block; background: rgba(212,151,10,0.15); color: #d4970a; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; letter-spacing: 0.1em; padding: 5px 16px; border-radius: 20px; border: 1px solid rgba(212,151,10,0.3); margin-bottom: 20px; text-transform: uppercase; }
.hero h1 { font-size: clamp(22px,4vw,34px); color: #f5e8d0; font-weight: normal; line-height: 1.35; max-width: 560px; margin: 0 auto 14px; }
.hero p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 15px; color: #b8986a; line-height: 1.75; max-width: 520px; margin: 0 auto; }
.content { max-width: 760px; margin: 0 auto; padding: 48px 32px; }
.section-title { font-size: 22px; color: #1a0e00; font-weight: normal; margin-bottom: 24px; }
.garanties-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px; }
.garantie-row { display: flex; align-items: flex-start; gap: 16px; background: #fff; border-radius: 10px; padding: 20px; border-left: 3px solid #8b5e0a; }
.g-dot { width: 10px; height: 10px; border-radius: 50%; background: #8b5e0a; margin-top: 5px; flex-shrink: 0; }
.garantie-row h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 15px; font-weight: 600; color: #1a0e00; margin-bottom: 4px; }
.garantie-row p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #6a5a3e; line-height: 1.6; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
@media(max-width:520px){.info-grid{grid-template-columns:1fr;}}
.info-card { background: #faf6ee; border-radius: 10px; padding: 20px; }
.info-card h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; font-weight: 600; color: #1a0e00; margin-bottom: 6px; }
.info-card p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #6a5a3e; line-height: 1.55; }
.tarif-band { background: linear-gradient(135deg, #2a1a06, #3d2a08); border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 40px; }
.tarif-band p.label { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #8a7040; margin-bottom: 8px; }
.tarif-band .prix { font-size: 48px; font-weight: normal; color: #d4970a; line-height: 1; margin-bottom: 4px; }
.tarif-band .prix-sub { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #9a8060; margin-bottom: 24px; }
.btn-souscrire { display: inline-block; background: #8b5e0a; color: #faf0d8; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; transition: background 0.2s; }
.btn-souscrire:hover { background: #a8720c; }
.note { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; color: #a08040; margin-top: 10px; }
.condition { background: #faf6ee; border-radius: 10px; padding: 20px 24px; margin-bottom: 40px; border: 1px solid #e8d8b0; }
.condition p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #5a4a2e; line-height: 1.65; }
.condition strong { color: #1a0e00; }
.warn-band { background: #fff8ee; border-left: 3px solid #c8860a; border-radius: 0 8px 8px 0; padding: 14px 20px; margin-bottom: 32px; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #7a5010; line-height: 1.6; }
.warn-band strong { color: #4a3010; }
.faq-item { border-top: 1px solid #e0d8c0; padding: 18px 0; }
.faq-item:last-child { border-bottom: 1px solid #e0d8c0; }
.faq-item h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; font-weight: 600; color: #1a0e00; margin-bottom: 6px; }
.faq-item p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #6a5a3e; line-height: 1.6; }
</style>
</head>
<body>
{{nav}}
<div class="hero">
  <span class="hero-badge">Option 1 — Chiens de chasse</span>
  <h1>Votre chien mérite autant de protection que vous</h1>
  <p>Un chien blessé sur le terrain, c'est des frais vétérinaires imprévus et parfois une saison entière compromise. Notre option vous couvre pour que vous chassiez l'esprit tranquille.</p>
</div>
<div class="content">
  <h2 class="section-title">Ce que couvre l'option chiens de chasse</h2>
  <div class="garanties-list">
    <div class="garantie-row"><div class="g-dot"></div><div><h4>Frais vétérinaires suite à blessure</h4><p>Prise en charge des soins après une blessure survenue pendant la chasse : coupures, fractures, morsures, piqûres de sanglier.</p></div></div>
    <div class="garantie-row"><div class="g-dot"></div><div><h4>Chirurgie et hospitalisation</h4><p>Couverture des interventions chirurgicales et des nuits en clinique vétérinaire si l'état de votre chien le nécessite.</p></div></div>
    <div class="garantie-row"><div class="g-dot"></div><div><h4>Blessure par arme à feu accidentelle</h4><p>Votre chien est pris en charge même en cas de tir accidentel, un risque réel sur le terrain que peu de contrats couvrent.</p></div></div>
    <div class="garantie-row"><div class="g-dot"></div><div><h4>Décès accidentel</h4><p>Indemnisation en cas de décès de votre chien consécutif à un accident de chasse, sur la base de la valeur vénale de l'animal.</p></div></div>
  </div>
  <div class="info-grid">
    <div class="info-card"><h4>Quels chiens sont assurables ?</h4><p>Tous les chiens de chasse identifiés (tatouage ou puce électronique), quelle que soit la race ou le gibier chassé, et âgés de <strong>11 ans maximum</strong>.</p></div>
    <div class="info-card"><h4>Combien de chiens puis-je assurer ?</h4><p>Jusqu'à 3 chiens par chasseur dans un même contrat. La cotisation s'adapte au nombre de chiens déclarés.</p></div>
  </div>
  <div class="warn-band"><strong>Condition d'âge :</strong> les chiens de plus de 11 ans ne peuvent pas être couverts par cette option. Cette limite s'applique à la date de souscription.</div>
  <div class="tarif-band">
    <p class="label">Cotisation annuelle</p>
    <div class="prix">À partir de {{tarifChienPerDog}} €</div>
    <p class="prix-sub">par chien · maximum 3 chiens par chasseur</p>
    <a href="/options-chasse.html" class="btn-souscrire">Souscrire en ligne</a>
    <p class="note">Attestation envoyée automatiquement après souscription</p>
  </div>
  <div class="condition"><p><strong>Condition préalable :</strong> cette option est réservée aux chasseurs titulaires d'un permis de chasse valide et assurés en responsabilité civile chasse auprès de la {{fdcShort}}.</p></div>
  <h3 style="font-size:18px;font-weight:normal;color:#1a0e00;margin-bottom:20px;">Questions fréquentes</h3>
  <div>
    <div class="faq-item"><h4>Mon chien est-il couvert s'il se blesse à l'entraînement ?</h4><p>La garantie s'applique pendant les parties de chasse et les entraînements officiels. Renseignez-vous lors de la souscription pour les situations spécifiques.</p></div>
    <div class="faq-item"><h4>Y a-t-il une limite d'âge pour mes chiens ?</h4><p>Oui. L'option Chiens de chasse est réservée aux chiens âgés de 11 ans maximum à la date de souscription.</p></div>
    <div class="faq-item"><h4>Y a-t-il un délai de carence ?</h4><p>Non. La couverture est effective dès la confirmation de votre souscription et le paiement de votre cotisation.</p></div>
    <div class="faq-item"><h4>Comment déclarer un sinistre ?</h4><p>Contactez-nous dans les 5 jours suivant l'accident avec le compte-rendu vétérinaire, à {{emailSinistres}} ou au {{phone}}.</p></div>
  </div>
</div>
{{footer}}
</body>
</html>
PATCH_EOF_TEMPLATES_CHIENS_DE_CHASSE_HTML

echo "  templates/securite-chasse.html"
cat > 'templates/securite-chasse.html' << 'PATCH_EOF_TEMPLATES_SECURITE_CHASSE_HTML'
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sécurité chasse — {{siteTitle}}</title>
<meta name="description" content="Option Sécurité chasse — protection corporelle du chasseur (décès, blessures, ITT, invalidité). {{tarifSecurite}} €/an.">
<style>
{{stylesCommon}}
.hero { background: linear-gradient(135deg, #0d1b4b 0%, #162e1a 100%); padding: 52px 32px 44px; text-align: center; }
.hero-badge { display: inline-block; background: rgba(106,191,123,0.15); color: #6abf7b; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; letter-spacing: 0.1em; padding: 5px 16px; border-radius: 20px; border: 1px solid rgba(106,191,123,0.3); margin-bottom: 20px; text-transform: uppercase; }
.hero h1 { font-size: clamp(22px,4vw,34px); color: #e8f0f8; font-weight: normal; line-height: 1.35; max-width: 560px; margin: 0 auto 14px; }
.hero p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 15px; color: #8aaac8; line-height: 1.75; max-width: 520px; margin: 0 auto; }
.content { max-width: 760px; margin: 0 auto; padding: 48px 32px; }
.section-title { font-size: 22px; color: #1a2e0a; font-weight: normal; margin-bottom: 24px; }
.garanties-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px; }
.garantie-row { display: flex; align-items: flex-start; gap: 16px; background: #fff; border-radius: 10px; padding: 20px; border-left: 3px solid #2d6a3f; }
.g-dot { width: 10px; height: 10px; border-radius: 50%; background: #2d6a3f; margin-top: 5px; flex-shrink: 0; }
.garantie-row h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 15px; font-weight: 600; color: #1a2e0a; margin-bottom: 4px; }
.garantie-row p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #5a6a4e; line-height: 1.6; }
.condition { background: #f0f4e8; border-radius: 10px; padding: 20px 24px; margin-bottom: 40px; }
.condition p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #3a4e2a; line-height: 1.65; }
.condition strong { color: #1a2e0a; }
.tarif-band { background: linear-gradient(135deg, #0d1b4b, #162e1a); border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 40px; }
.tarif-band p.label { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #5a9a6a; margin-bottom: 8px; }
.tarif-band .prix { font-size: 48px; font-weight: normal; color: #6abf7b; line-height: 1; margin-bottom: 4px; }
.tarif-band .prix-sub { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #7aaab8; margin-bottom: 24px; }
.btn-souscrire { display: inline-block; background: #2d6a3f; color: #e0f5e8; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; transition: background 0.2s; }
.btn-souscrire:hover { background: #3b8050; }
.note { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; color: #4a8a5a; margin-top: 10px; }
.faq-item { border-top: 1px solid #e0d8cc; padding: 18px 0; }
.faq-item:last-child { border-bottom: 1px solid #e0d8cc; }
.faq-item h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; font-weight: 600; color: #1a2e0a; margin-bottom: 6px; }
.faq-item p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #6a7a5e; line-height: 1.6; }
</style>
</head>
<body>
{{nav}}
<div class="hero">
  <span class="hero-badge">Option 2 — Sécurité chasse</span>
  <h1>Vous aussi, protégez-vous sur le terrain</h1>
  <p>La responsabilité civile couvre les dommages que vous causez à autrui. Mais si c'est vous qui êtes blessé, qui prend en charge vos frais ? C'est précisément ce que couvre la Sécurité chasse.</p>
</div>
<div class="content">
  <h2 class="section-title">Ce que couvre la Sécurité chasse</h2>
  <div class="garanties-list">
    <div class="garantie-row"><div class="g-dot"></div><div><h4>Frais médicaux et chirurgicaux</h4><p>Prise en charge des frais engagés suite à un accident corporel survenu pendant la chasse, en complément de votre sécurité sociale et mutuelle.</p></div></div>
    <div class="garantie-row"><div class="g-dot"></div><div><h4>Incapacité temporaire de travail</h4><p>Indemnisation journalière si votre blessure vous empêche de travailler pendant votre convalescence.</p></div></div>
    <div class="garantie-row"><div class="g-dot"></div><div><h4>Invalidité permanente</h4><p>Capital versé en cas de séquelles définitives consécutives à un accident de chasse.</p></div></div>
    <div class="garantie-row"><div class="g-dot"></div><div><h4>Décès accidentel</h4><p>Capital versé à vos proches en cas de décès survenu lors d'une activité de chasse. Décès : 400 € · Blessures : 500 € à concurrence · Franchise : 50 € · Cotisation : {{tarifSecurite}} €/an.</p></div></div>
  </div>
  <div class="tarif-band">
    <p class="label">Cotisation annuelle</p>
    <div class="prix">{{tarifSecurite}} €</div>
    <p class="prix-sub">par saison de chasse</p>
    <a href="/options-chasse.html" class="btn-souscrire">Souscrire en ligne</a>
    <p class="note">Attestation envoyée automatiquement après souscription</p>
  </div>
  <div class="condition"><p><strong>Condition préalable :</strong> cette option est réservée aux chasseurs ayant déjà souscrit leur responsabilité civile chasse auprès de la {{fdcName}} ({{fdcShort}}). Elle vient en complément, pas en remplacement.</p></div>
  <h3 style="font-size:18px;font-weight:normal;color:#1a2e0a;margin-bottom:20px;">Questions fréquentes</h3>
  <div>
    <div class="faq-item"><h4>Suis-je couvert si je chasse dans un autre département ?</h4><p>Oui, la garantie s'applique partout en France dès lors que vous exercez une activité de chasse autorisée.</p></div>
    <div class="faq-item"><h4>Et si je suis blessé par un autre chasseur ?</h4><p>La Sécurité chasse intervient quelle que soit l'origine de l'accident — arme, chute, animal — y compris si le responsable n'est pas identifié.</p></div>
    <div class="faq-item"><h4>Quand commence la couverture ?</h4><p>Dès réception de votre confirmation de souscription et du paiement. Vous recevez votre attestation par email dans la foulée.</p></div>
  </div>
</div>
{{footer}}
</body>
</html>
PATCH_EOF_TEMPLATES_SECURITE_CHASSE_HTML

echo "  templates/contact.html"
cat > 'templates/contact.html' << 'PATCH_EOF_TEMPLATES_CONTACT_HTML'
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contact — {{siteTitle}}</title>
<style>
{{stylesCommon}}
.hero { background: linear-gradient(135deg, #0d1b4b 0%, #162e1a 100%); padding: 48px 32px 40px; text-align: center; }
.hero-badge { display: inline-block; background: rgba(106,191,123,0.15); color: #6abf7b; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; letter-spacing: 0.1em; padding: 5px 16px; border-radius: 20px; border: 1px solid rgba(106,191,123,0.3); margin-bottom: 20px; text-transform: uppercase; }
.hero h1 { font-size: clamp(20px,3.5vw,32px); color: #e0f0e8; font-weight: normal; line-height: 1.35; max-width: 480px; margin: 0 auto 12px; }
.hero p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; color: #7aaa8a; line-height: 1.7; max-width: 440px; margin: 0 auto; }
.content { max-width: 760px; margin: 0 auto; padding: 48px 32px; }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 40px; }
@media(max-width:540px){.contact-grid{grid-template-columns:1fr;}}
.contact-card { background: #fff; border-radius: 12px; padding: 22px; border-top: 3px solid #0d1b4b; }
.contact-card h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #5a6a7e; margin-bottom: 6px; }
.contact-card .val { font-size: 18px; font-weight: normal; color: #0d1b4b; margin: 6px 0 2px; display: block; font-family: Georgia,serif; }
.contact-card .sub { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; color: #9aaabe; }
.contact-card p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #7a8a9e; line-height: 1.6; margin-top: 4px; }
.contact-card a { color: #2d6a3f; text-decoration: none; }
.tel-green { color: #2d6a3f !important; font-size: 20px !important; }
.section-title { font-size: 20px; color: #1a2e0a; font-weight: normal; margin-bottom: 20px; }
.field { margin-bottom: 14px; }
.field label { display: block; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 12px; color: #5a6a4e; margin-bottom: 5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
.field label .req { color: #c0306a; }
.field input, .field select, .field textarea { width: 100%; border: 1px solid #d0d8c0; border-radius: 8px; padding: 10px 14px; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; color: #1a2e0a; background: #fff; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: #2d6a3f; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media(max-width:520px){.two-col{grid-template-columns:1fr;}}
.btn-send { width: 100%; background: #0d1b4b; color: #e0eaf8; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 15px; font-weight: 600; padding: 16px; border: none; border-radius: 10px; cursor: pointer; transition: background 0.2s; margin-top: 8px; }
.btn-send:hover { background: #162770; }
.adresse-band { background: #f5f0e8; border-radius: 12px; padding: 24px 28px; margin-top: 32px; display: flex; gap: 14px; align-items: flex-start; }
.adresse-band p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #5a6a4e; line-height: 1.8; }
.adresse-band strong { color: #1a2e0a; }
.orias-line { text-align: center; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; color: #9a9a8a; margin-top: 28px; }
.success-band { display: none; background: #eaf3de; border: 1px solid #6abf7b; border-radius: 10px; padding: 16px 20px; margin-bottom: 16px; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #2d5016; }
.success-band.show { display: block; }
.error-band { display: none; background: #ffeeee; border: 1px solid #c08080; border-radius: 10px; padding: 16px 20px; margin-bottom: 16px; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #7a1a1a; }
.error-band.show { display: block; }
</style>
</head>
<body>
{{nav}}
<div class="hero">
  <span class="hero-badge">{{fullName}} — {{name}} ({{code}})</span>
  <h1>Nous sommes là pour vous répondre</h1>
  <p>Une question sur votre contrat, une option à souscrire, ou simplement besoin d'un renseignement ? Contactez-nous.</p>
</div>
<div class="content">
  <div class="contact-grid">
    <div class="contact-card"><h4>Téléphone</h4><span class="val tel-green">{{phone}}</span><span class="sub">{{phoneNote}} · lun–ven 9h–17h30</span></div>
    <div class="contact-card"><h4>Email général</h4><span class="val" style="font-size:14px"><a href="mailto:{{emailGeneral}}">{{emailGeneral}}</a></span><span class="sub">Réponse sous 48h ouvrées</span></div>
    <div class="contact-card"><h4>Sinistres</h4><span class="val" style="font-size:14px"><a href="mailto:{{emailSinistres}}">{{emailSinistres}}</a></span><span class="sub">Joindre permis + validation {{fdcShort}}</span></div>
    <div class="contact-card"><h4>Horaires</h4><p>Lun – Ven : 9h00 – 12h30 / 14h00 – 17h30<br>Fermé le week-end et jours fériés</p></div>
  </div>
  <h2 class="section-title">Formulaire de contact</h2>
  <div class="success-band" id="success-band">✓ Votre message a bien été envoyé. Nous vous répondrons sous 48h ouvrées.</div>
  <div class="error-band" id="error-band"></div>
  <form id="contact-form" onsubmit="event.preventDefault(); sendMessage();">
    <div class="two-col">
      <div class="field"><label>Nom <span class="req">*</span></label><input type="text" id="ct-nom" required placeholder="Dupont"/></div>
      <div class="field"><label>Prénom <span class="req">*</span></label><input type="text" id="ct-prenom" required placeholder="Jean"/></div>
    </div>
    <div class="two-col">
      <div class="field"><label>Email <span class="req">*</span></label><input type="email" id="ct-email" required placeholder="jean@email.com"/></div>
      <div class="field"><label>Téléphone</label><input type="tel" id="ct-tel" placeholder="06 00 00 00 00"/></div>
    </div>
    <div class="field">
      <label>Objet <span class="req">*</span></label>
      <select id="ct-objet" required>
        <option value="">Sélectionnez…</option>
        <option>Question sur une option (sécurité chasse / chiens)</option>
        <option>Question sur mon contrat en cours</option>
        <option>Déclaration ou suivi de sinistre</option>
        <option>Documents contractuels (CG, notices)</option>
        <option>Autre demande</option>
      </select>
    </div>
    <div class="field"><label>Message <span class="req">*</span></label><textarea id="ct-message" rows="5" required placeholder="Décrivez votre demande…" style="resize:vertical;font-family:inherit;font-size:14px;color:#1a2e0a;border:1px solid #d0d8c0;border-radius:8px;padding:10px 14px;width:100%;outline:none;box-sizing:border-box"></textarea></div>
    <button class="btn-send" id="btn-send" type="submit">Envoyer mon message</button>
  </form>
  <div class="adresse-band">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5a6a4e" stroke-width="1.5" stroke-linecap="round" style="flex-shrink:0;margin-top:2px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    <p><strong>{{fullName}}</strong><br>{{address}} — {{addressZip}} {{addressCity}}<br>Pour tout envoi postal (dossiers sinistres, courriers contractuels)</p>
  </div>
  <p class="orias-line">{{fullName}} · ORIAS {{orias}} · Intermédiaire en assurance enregistré auprès de l'ORIAS</p>
</div>
{{footer}}
<script>
async function sendMessage() {
  var btn = document.getElementById('btn-send');
  var success = document.getElementById('success-band');
  var error = document.getElementById('error-band');
  success.classList.remove('show'); error.classList.remove('show');
  btn.disabled = true; btn.textContent = 'Envoi en cours…';
  var payload = {
    department: '{{slug}}',
    nom: document.getElementById('ct-nom').value,
    prenom: document.getElementById('ct-prenom').value,
    email: document.getElementById('ct-email').value,
    tel: document.getElementById('ct-tel').value,
    objet: document.getElementById('ct-objet').value,
    message: document.getElementById('ct-message').value
  };
  try {
    var res = await fetch('/api/contact-submit', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Erreur ' + res.status);
    success.classList.add('show');
    document.getElementById('contact-form').reset();
  } catch(e) {
    error.textContent = 'Une erreur est survenue. Contactez-nous directement au {{phone}} ou à {{emailGeneral}}.';
    error.classList.add('show');
  }
  btn.disabled = false; btn.textContent = 'Envoyer mon message';
}
</script>
</body>
</html>
PATCH_EOF_TEMPLATES_CONTACT_HTML

echo "  templates/guichet-unique.html"
cat > 'templates/guichet-unique.html' << 'PATCH_EOF_TEMPLATES_GUICHET_UNIQUE_HTML'
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Documents — {{siteTitle}}</title>
<style>
{{stylesCommon}}
.hero { background: linear-gradient(135deg, #0d1b4b 0%, #0a3020 100%); padding: 48px 32px 40px; text-align: center; }
.hero-badge { display: inline-block; background: rgba(106,191,123,0.15); color: #6abf7b; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; letter-spacing: 0.1em; padding: 5px 16px; border-radius: 20px; border: 1px solid rgba(106,191,123,0.3); margin-bottom: 20px; text-transform: uppercase; }
.hero h1 { font-size: clamp(20px,3.5vw,32px); color: #e0f0e8; font-weight: normal; line-height: 1.35; max-width: 520px; margin: 0 auto 12px; }
.hero p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; color: #7aaa8a; line-height: 1.7; max-width: 480px; margin: 0 auto; }
.content { max-width: 760px; margin: 0 auto; padding: 48px 32px; }
.doc-group { margin-bottom: 40px; }
.doc-group-title { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #8a9a8a; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e0d8cc; }
.doc-list { display: flex; flex-direction: column; gap: 8px; }
.doc-row { display: flex; align-items: center; justify-content: space-between; background: #fff; border-radius: 10px; padding: 16px 20px; gap: 16px; }
.doc-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
.doc-icon { width: 36px; height: 36px; background: #eaf3de; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.doc-icon svg { width: 18px; height: 18px; }
.doc-row h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 14px; font-weight: 600; color: #1a2e0a; margin-bottom: 2px; }
.doc-row p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 12px; color: #7a8a7a; margin: 0; }
.btn-dl { background: transparent; border: 1px solid #c0d0b0; border-radius: 7px; padding: 8px 18px; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 12px; font-weight: 600; color: #2d5016; text-decoration: none; white-space: nowrap; }
.btn-dl:hover { background: #eaf3de; border-color: #2d5016; }
.info-band { background: #f0f4e8; border-radius: 10px; padding: 18px 24px; margin-bottom: 32px; display: flex; gap: 12px; }
.info-band p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #4a5e3a; line-height: 1.65; }
.info-band strong { color: #1a2e0a; }
.contact-band { background: linear-gradient(135deg, #0d1b4b, #0a3020); border-radius: 12px; padding: 28px 32px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
@media(max-width:560px){.contact-band{flex-direction:column;text-align:center;}}
.contact-band h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 15px; font-weight: 600; color: #e0f0e8; margin-bottom: 4px; }
.contact-band p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #7aaa8a; }
.tel-big { font-size: 22px; font-weight: 600; color: #6abf7b; font-family: Georgia,serif; letter-spacing: 2px; }
.tel-sub { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; color: #5a9a6a; margin-top: 2px; }
</style>
</head>
<body>
{{nav}}
<div class="hero">
  <span class="hero-badge">Sociétés et associations de chasse — {{name}} ({{code}})</span>
  <h1>Vos documents contractuels, disponibles à tout moment</h1>
  <p>Téléchargez librement l'ensemble des conditions générales et notices de vos contrats. Sans compte requis.</p>
</div>
<div class="content">
  <div class="doc-group">
    <div class="doc-group-title">Chasseur individuel</div>
    <div class="doc-list">
      <div class="doc-row">
        <div class="doc-left">
          <div class="doc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#2d6a3f" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <div><h4>Bulletin d'adhésion RC chasseur individuel</h4><p>MIC Insurance / ELKYIA — Document 2026</p></div>
        </div>
        <a href="/bulletin-adhesion-rc-individuel.pdf" target="_blank" class="btn-dl">Télécharger PDF</a>
      </div>
      <div class="doc-row">
        <div class="doc-left">
          <div class="doc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#2d6a3f" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <div><h4>IPID — Document d'information sur le produit 2026</h4><p>Fiche synthétique RCCH — MIC Insurance / ELKYIA Poncey</p></div>
        </div>
        <a href="/IPID_RCCH_2026_E_PONCEY.docx" target="_blank" class="btn-dl">Télécharger</a>
      </div>
      <div class="doc-row">
        <div class="doc-left">
          <div class="doc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#2d6a3f" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <div><h4>Conditions générales RC Chasse — MIC Insurance</h4><p>CGRCCH_MIC_FX_202504 — Garanties principales et complémentaires</p></div>
        </div>
        <a href="/conditions-generales-chasse.pdf" target="_blank" class="btn-dl">Télécharger PDF</a>
      </div>
    </div>
  </div>
  <div class="info-band">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a7a4a" stroke-width="1.5" stroke-linecap="round" style="flex-shrink:0;margin-top:2px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <p><strong>Les sociétés et associations de chasse ne peuvent pas souscrire d'options en ligne</strong> sur ce site. Ces documents sont fournis à titre informatif. Pour toute question, contactez-nous.</p>
  </div>
  <div class="contact-band">
    <div><h4>Une question sur votre contrat ?</h4><p>Notre équipe répond du lundi au vendredi aux heures ouvrées.</p></div>
    <div style="text-align:right">
      <div class="tel-big">{{phone}}</div>
      <div class="tel-sub">{{phoneNote}}</div>
    </div>
  </div>
</div>
{{footer}}
</body>
</html>
PATCH_EOF_TEMPLATES_GUICHET_UNIQUE_HTML

echo "  api/contact-submit.js"
cat > 'api/contact-submit.js' << 'PATCH_EOF_API_CONTACT_SUBMIT_JS'
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const msg = req.body || {};
  if (!msg.email || !msg.nom || !msg.message || !msg.objet) {
    return res.status(400).json({ error: 'Données manquantes' });
  }
  console.log('Contact reçu', { department: msg.department, nom: msg.nom, email: msg.email, objet: msg.objet });
  // TODO Email via Gmail SMTP (nodemailer)
  return res.status(200).json({ received: true });
};
PATCH_EOF_API_CONTACT_SUBMIT_JS

echo "Patch v4a applique."
