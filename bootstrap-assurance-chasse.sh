#!/bin/bash
# Bootstrap script — recree le projet assurance-chasse
# Usage: bash bootstrap-assurance-chasse.sh (depuis un dossier vide ou un repo clone)
set -e
echo "Creation de la structure..."
mkdir -p config templates/_partials scripts public api lib

echo "  README.md"
cat > 'README.md' << 'BOOTSTRAP_EOF_README_MD'
# Assurance Chasse — ADC&E

Sites jumeaux pour l'assurance chasse, partenariat **Cabinet ADCE Assurances** × Fédérations Départementales des Chasseurs.

| Département | Code | Domaine | FDC |
|---|---|---|---|
| Gironde | 33 | www.assurancechasse33.fr | FDC33 |
| Calvados | 14 | www.assurancechasse14.fr | FDC14 |
| Dordogne | 24 | www.assurancechasse24.fr | FDC24 |
| Lot-et-Garonne | 47 | www.assurancechasse47.fr | FDC47 |

## Architecture

- **1 repo, 4 sites** : tous les sites partagent le même code. Seul `config/<dept>.json` change.
- **Build statique** : `templates/*.html` + `config/*.json` → `dist/<dept>/*.html`.
- **Déploiement** : 4 projets Vercel pointant vers ce repo, chacun avec une variable d'env `DEPT=<slug>`.
- **Stripe** : 1 compte unique, mêmes `price_id` pour les 4 sites. `metadata.department` permet le suivi par fédération.
- **Firebase** : 1 projet Firestore unique pour stocker souscriptions, sinistres, contacts.

## Commandes

```bash
npm run build              # Build les 4 sites
npm run build:gironde      # Build un seul site
DEPT=gironde npm run build # Vercel
```

## TODO

- [x] Structure projet + page d'accueil
- [ ] options-chasse.html (tunnel souscription + Stripe)
- [ ] sinistre.html, confirmation.html, contact.html
- [ ] chatbot.html (avec proxy serverless Anthropic)
- [ ] dashboard.html (back-office, à protéger par auth)
- [ ] api/stripe-checkout.js, stripe-webhook.js, chatbot.js, claim-submit.js
- [ ] Création des produits Stripe
- [ ] Setup Firebase + Gmail SMTP
BOOTSTRAP_EOF_README_MD

echo "  vercel.json"
cat > 'vercel.json' << 'BOOTSTRAP_EOF_VERCEL_JSON'
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "node scripts/build.js",
  "outputDirectory": "dist",
  "framework": null,
  "trailingSlash": false,
  "cleanUrls": true
}
BOOTSTRAP_EOF_VERCEL_JSON

echo "  .gitignore"
cat > '.gitignore' << 'BOOTSTRAP_EOF__GITIGNORE'
node_modules/
dist/
.vercel/
.env
.env.local
.DS_Store
*.log
BOOTSTRAP_EOF__GITIGNORE

echo "  package.json"
cat > 'package.json' << 'BOOTSTRAP_EOF_PACKAGE_JSON'
{
  "name": "assurance-chasse",
  "version": "0.1.0",
  "private": true,
  "description": "Sites ADC&E Assurances Chasse — Gironde, Calvados, Dordogne, Lot-et-Garonne",
  "scripts": {
    "build": "node scripts/build.js",
    "build:gironde": "node scripts/build.js gironde",
    "build:calvados": "node scripts/build.js calvados",
    "build:dordogne": "node scripts/build.js dordogne",
    "build:lot-et-garonne": "node scripts/build.js lot-et-garonne",
    "vercel-build": "node scripts/build.js"
  }
}
BOOTSTRAP_EOF_PACKAGE_JSON

echo "  .env.example"
cat > '.env.example' << 'BOOTSTRAP_EOF__ENV_EXAMPLE'
# DEPT=gironde

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_SECURITE=price_xxxxx
STRIPE_PRICE_CHIENS=price_xxxxx
STRIPE_PRICE_ADMIN=price_xxxxx

# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Gmail SMTP
GMAIL_USER=chasse.assurance@gmail.com
GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
BOOTSTRAP_EOF__ENV_EXAMPLE

echo "  config/calvados.json"
cat > 'config/calvados.json' << 'BOOTSTRAP_EOF_CALVADOS'
{
  "slug": "calvados",
  "code": "14",
  "name": "Calvados",
  "domain": "www.assurancechasse14.fr",
  "fdcName": "Fédération Départementale des Chasseurs du Calvados",
  "fdcShort": "FDC14",
  "siteTitle": "ADC&E Assurances Chasse 14"
}
BOOTSTRAP_EOF_CALVADOS

echo "  config/lot-et-garonne.json"
cat > 'config/lot-et-garonne.json' << 'BOOTSTRAP_EOF_LOT'
{
  "slug": "lot-et-garonne",
  "code": "47",
  "name": "Lot-et-Garonne",
  "domain": "www.assurancechasse47.fr",
  "fdcName": "Fédération Départementale des Chasseurs du Lot-et-Garonne",
  "fdcShort": "FDC47",
  "siteTitle": "ADC&E Assurances Chasse 47"
}
BOOTSTRAP_EOF_LOT

echo "  config/_brand.json"
cat > 'config/_brand.json' << 'BOOTSTRAP_EOF_BRAND'
{
  "brand": "ADC&E",
  "fullName": "Cabinet ADCE Assurances",
  "phone": "0 800 014 033",
  "phoneFormatted": "0800014033",
  "phoneNote": "Appel gratuit",
  "emailGeneral": "chasse.assurance@gmail.com",
  "emailSinistres": "chasse.assurance@gmail.com",
  "address": "5 allée de Tourny",
  "addressZip": "33000",
  "addressCity": "Bordeaux",
  "courtierName": "Cabinet Poncey Lebas",
  "courtierAddress": "BP 22214 — 14402 Bayeux Cedex",
  "orias": "21006219",
  "siteUrlBase": "https://www.assurancechasse",
  "tagline": "L'assureur référence de votre fédération départementale",
  "slogan": "Avec ADCE, Chassez Heureux",
  "tarifs": {
    "securiteChasse": 25,
    "chiensChassePerDog": 50,
    "fraisAdminPerOption": 1
  }
}
BOOTSTRAP_EOF_BRAND

echo "  config/dordogne.json"
cat > 'config/dordogne.json' << 'BOOTSTRAP_EOF_DORDOGNE'
{
  "slug": "dordogne",
  "code": "24",
  "name": "Dordogne",
  "domain": "www.assurancechasse24.fr",
  "fdcName": "Fédération Départementale des Chasseurs de la Dordogne",
  "fdcShort": "FDC24",
  "siteTitle": "ADC&E Assurances Chasse 24"
}
BOOTSTRAP_EOF_DORDOGNE

echo "  config/gironde.json"
cat > 'config/gironde.json' << 'BOOTSTRAP_EOF_GIRONDE'
{
  "slug": "gironde",
  "code": "33",
  "name": "Gironde",
  "domain": "www.assurancechasse33.fr",
  "fdcName": "Fédération Départementale des Chasseurs de la Gironde",
  "fdcShort": "FDC33",
  "siteTitle": "ADC&E Assurances Chasse 33"
}
BOOTSTRAP_EOF_GIRONDE

echo "  scripts/build.js"
cat > 'scripts/build.js' << 'BOOTSTRAP_EOF_BUILD'
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'templates');
const PARTIALS = path.join(TEMPLATES, '_partials');
const CONFIG_DIR = path.join(ROOT, 'config');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');

const brand = JSON.parse(fs.readFileSync(path.join(CONFIG_DIR, '_brand.json'), 'utf8'));

const articleByName = {
  Gironde: 'de Gironde',
  Calvados: 'du Calvados',
  Dordogne: 'de Dordogne',
  'Lot-et-Garonne': 'du Lot-et-Garonne'
};

const localSpecialistByName = {
  Gironde: 'en Gironde',
  Calvados: 'dans le Calvados',
  Dordogne: 'en Dordogne',
  'Lot-et-Garonne': 'en Lot-et-Garonne'
};

function readPartial(name) {
  return fs.readFileSync(path.join(PARTIALS, name), 'utf8');
}

function applyVars(content, vars) {
  return content.replace(/\{\{(\w+)\}\}/g, (m, key) => {
    if (Object.prototype.hasOwnProperty.call(vars, key)) return vars[key];
    return m;
  });
}

function buildDept(deptFile) {
  const cfg = JSON.parse(fs.readFileSync(path.join(CONFIG_DIR, deptFile), 'utf8'));
  const vars = {
    ...brand,
    ...cfg,
    tarifSecurite: brand.tarifs.securiteChasse,
    tarifChienPerDog: brand.tarifs.chiensChassePerDog,
    fraisAdminPerOption: brand.tarifs.fraisAdminPerOption,
    nameLowerArticle: articleByName[cfg.name] || `du ${cfg.name}`,
    nameLocalSpecialist: localSpecialistByName[cfg.name] || `dans ${cfg.name}`,
    stylesCommon: fs.readFileSync(path.join(PARTIALS, 'styles-common.css'), 'utf8'),
  };
  vars.logoSvg = applyVars(readPartial('logo.svg'), vars);
  vars.nav = applyVars(readPartial('nav.html'), vars);
  vars.footer = applyVars(readPartial('footer.html'), vars);
  const outDir = path.join(DIST, cfg.slug);
  fs.mkdirSync(outDir, { recursive: true });
  const templates = fs.readdirSync(TEMPLATES).filter(f => f.endsWith('.html'));
  for (const tpl of templates) {
    const src = fs.readFileSync(path.join(TEMPLATES, tpl), 'utf8');
    const out = applyVars(src, vars);
    fs.writeFileSync(path.join(outDir, tpl), out);
  }
  if (fs.existsSync(PUBLIC_DIR)) copyRecursive(PUBLIC_DIR, outDir);
  console.log(`✓ ${cfg.slug.padEnd(15)} → dist/${cfg.slug}/  (${cfg.domain})`);
}

function copyRecursive(src, dest) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(d, { recursive: true });
      copyRecursive(s, d);
    } else fs.copyFileSync(s, d);
  }
}

const argDept = process.argv[2] || process.env.DEPT;
const allDepts = fs.readdirSync(CONFIG_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));
let toBuild = allDepts;
if (argDept) {
  const match = `${argDept}.json`;
  if (!allDepts.includes(match)) {
    console.error(`✗ Département inconnu: ${argDept}`);
    process.exit(1);
  }
  toBuild = [match];
}
console.log(`Building ${toBuild.length} site(s)...`);
fs.rmSync(DIST, { recursive: true, force: true });
toBuild.forEach(buildDept);
console.log('Done.');
if (argDept && process.env.VERCEL) {
  const srcDir = path.join(DIST, argDept);
  const files = fs.readdirSync(srcDir);
  for (const f of files) fs.renameSync(path.join(srcDir, f), path.join(DIST, f));
  fs.rmdirSync(srcDir);
}
BOOTSTRAP_EOF_BUILD

echo "  templates/_partials/styles-common.css"
cat > 'templates/_partials/styles-common.css' << 'BOOTSTRAP_EOF_STYLES'
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Georgia, serif; background: #f5f0e8; color: #2c2c2a; }
nav { background: #0d1b4b; display: flex; align-items: center; justify-content: space-between; padding: 12px 32px; gap: 16px; flex-wrap: wrap; }
.nav-logo svg { display: block; }
.nav-logo { display: block; text-decoration: none; }
.nav-links { display: flex; gap: 24px; flex-wrap: wrap; }
.nav-links a { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; color: #9ab8d8; text-decoration: none; letter-spacing: 0.03em; transition: color 0.2s; }
.nav-links a:hover { color: #6abf7b; }
.nav-cta { background: #2d6a3f; color: #e0f5e8; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 600; padding: 9px 20px; border-radius: 7px; text-decoration: none; white-space: nowrap; transition: background 0.2s; }
.nav-cta:hover { background: #3b8050; }
footer { background: #0a1530; padding: 32px; margin-top: 0; }
.footer-inner { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 800px; margin: 0 auto; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #6a8aaa; line-height: 1.8; }
.footer-inner strong { color: #9ab8d8; font-weight: 600; }
.footer-inner a { color: #6abf7b; text-decoration: none; }
@media (max-width: 560px) { .footer-inner { grid-template-columns: 1fr; } }
BOOTSTRAP_EOF_STYLES

echo "  templates/_partials/logo.svg"
cat > 'templates/_partials/logo.svg' << 'BOOTSTRAP_EOF_LOGO'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420" width="160" height="93"><defs><linearGradient id="logobg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#0d1b4b"/><stop offset="85%" style="stop-color:#0f2255"/><stop offset="100%" style="stop-color:#162e1a"/></linearGradient><linearGradient id="logogreen" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#2d6a3f"/><stop offset="100%" style="stop-color:#4a9e5c"/></linearGradient></defs><rect width="720" height="420" rx="10" fill="url(#logobg)"/><rect x="14" y="14" width="692" height="392" rx="7" fill="none" stroke="#3a7a4a" stroke-width="1" opacity="0.45"/><line x1="60" y1="68" x2="660" y2="68" stroke="url(#logogreen)" stroke-width="1.2" opacity="0.7"/><text x="360" y="185" font-family="Georgia,serif" font-size="118" font-weight="700" fill="white" text-anchor="middle" letter-spacing="4">ADC&amp;E</text><text x="360" y="234" font-family="Georgia,serif" font-size="36" font-weight="300" fill="white" text-anchor="middle" letter-spacing="20" opacity="0.88">ASSURANCES</text><line x1="60" y1="258" x2="660" y2="258" stroke="url(#logogreen)" stroke-width="1.2" opacity="0.7"/><text x="360" y="295" font-family="Georgia,serif" font-size="17" font-style="italic" font-weight="300" fill="#6abf7b" text-anchor="middle" letter-spacing="3" opacity="0.9">Avec ADCE, Chassez Heureux</text><line x1="88" y1="295" x2="112" y2="295" stroke="#3a7a4a" stroke-width="1" opacity="0.6"/><line x1="608" y1="295" x2="632" y2="295" stroke="#3a7a4a" stroke-width="1" opacity="0.6"/><line x1="160" y1="322" x2="560" y2="322" stroke="white" stroke-width="0.5" opacity="0.2"/><text x="360" y="352" font-family="Georgia,serif" font-size="13.5" font-weight="400" fill="white" text-anchor="middle" letter-spacing="2" opacity="0.75">L&apos;assureur référence de votre fédération départementale</text><text x="360" y="388" font-family="Georgia,serif" font-size="22" font-weight="600" fill="#6abf7b" text-anchor="middle" letter-spacing="5">Tél. {{phone}}</text></svg>
BOOTSTRAP_EOF_LOGO

echo "  templates/_partials/footer.html"
cat > 'templates/_partials/footer.html' << 'BOOTSTRAP_EOF_FOOTER'
<footer>
  <div class="footer-inner">
    <div>
      <strong>{{fullName}}</strong><br>
      {{address}} — {{addressZip}} {{addressCity}}
    </div>
    <div>
      <strong>{{phone}}</strong> ({{phoneNote}})<br>
      <a href="mailto:{{emailGeneral}}">{{emailGeneral}}</a>
    </div>
    <div>
      ORIAS {{orias}}<br>
      <a href="/mentions-legales.html">Mentions légales</a> · <a href="/rgpd-cookies.html">Cookies</a>
    </div>
  </div>
</footer>
BOOTSTRAP_EOF_FOOTER

echo "  templates/_partials/nav.html"
cat > 'templates/_partials/nav.html' << 'BOOTSTRAP_EOF_NAV'
<nav>
  <a href="/" class="nav-logo">{{logoSvg}}</a>
  <div class="nav-links">
    <a href="/">Accueil</a>
    <a href="/options-chasse.html">Nos options</a>
    <a href="/guichet-unique.html">Documents</a>
    <a href="/sinistre.html">Sinistre</a>
    <a href="/contact.html">Contact</a>
  </div>
  <a href="/options-chasse.html" class="nav-cta">Souscrire</a>
</nav>
BOOTSTRAP_EOF_NAV

echo "  templates/index.html"
cat > 'templates/index.html' << 'BOOTSTRAP_EOF_INDEX'
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Accueil — {{siteTitle}}</title>
<meta name="description" content="{{brand}} Assurances : courtier partenaire de la {{fdcName}}. Garanties complémentaires chiens de chasse, sécurité chasse, installations cynégétiques.">
<link rel="canonical" href="https://{{domain}}/">
<style>
{{stylesCommon}}

.hero { background: linear-gradient(135deg, #0d1b4b 0%, #0f2255 70%, #162e1a 100%); padding: 56px 32px 48px; text-align: center; }
.hero-badge { display: inline-block; background: rgba(106,191,123,0.15); color: #6abf7b; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; letter-spacing: 0.1em; padding: 5px 16px; border-radius: 20px; border: 1px solid rgba(106,191,123,0.3); margin-bottom: 24px; text-transform: uppercase; }
.hero h1 { font-size: clamp(22px,4vw,36px); color: #e8f0f8; font-weight: normal; line-height: 1.35; max-width: 580px; margin: 0 auto 16px; }
.hero p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 15px; color: #8aaac8; line-height: 1.75; max-width: 520px; margin: 0 auto 40px; }
.cta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 14px; max-width: 960px; margin: 0 auto; align-items: stretch; }
@media(max-width:860px){ .cta-grid { grid-template-columns: 1fr 1fr; } }
@media(max-width:520px){ .cta-grid { grid-template-columns: 1fr; } }
.cta-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.13); border-radius: 12px; padding: 14px 16px; text-align: left; text-decoration: none; display: flex; flex-direction: column; justify-content: center; align-self: center; transition: background 0.2s, border-color 0.2s; }
.cta-card:hover { background: rgba(255,255,255,0.1); }
.cta-card.green:hover { border-color: #4a9e5c; }
.cta-card.amber:hover { border-color: #c8860a; }
.cta-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; flex-shrink: 0; }
.cta-icon.green { background: rgba(74,158,92,0.2); }
.cta-icon.amber { background: rgba(200,134,10,0.2); }
.cta-icon svg { width: 18px; height: 18px; }
.cta-card h3 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; font-weight: 600; color: #dce8f5; margin-bottom: 4px; }
.cta-card p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; color: #7a9ab8; line-height: 1.4; margin-bottom: 8px; }
.cta-link { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 12px; font-weight: 600; margin-top: auto; }
.cta-link.green { color: #6abf7b; }
.cta-link.amber { color: #d4970a; }
.cta-card-premium { border-radius: 14px; padding: 26px 20px; text-align: left; text-decoration: none; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; position: relative; overflow: hidden; }
.cta-card-premium:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.3); }
.cta-card-premium.securite { background: linear-gradient(160deg, #1a3a6a 0%, #0d2040 100%); border: 1.5px solid rgba(106,191,123,0.35); }
.cta-card-premium.installation { background: linear-gradient(160deg, #0f3d20 0%, #072010 100%); border: 1.5px solid rgba(106,191,123,0.35); }
.premium-badge { display: inline-block; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 10px; border-radius: 20px; margin-bottom: 14px; background: rgba(106,191,123,0.2); color: #6abf7b; border: 1px solid rgba(106,191,123,0.3); }
.cta-card-premium h3 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 16px; font-weight: 700; line-height: 1.3; margin-bottom: 10px; }
.cta-card-premium.securite h3 { color: #e0f0ff; }
.cta-card-premium.installation h3 { color: #e0f5e8; }
.cta-card-premium .argument { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 12px; line-height: 1.6; margin-bottom: 14px; flex: 1; }
.cta-card-premium.securite .argument { color: #90b8d8; }
.cta-card-premium.installation .argument { color: #90c8a0; }
.prix-tag { font-size: 22px; font-weight: 700; font-family: Georgia,serif; margin-bottom: 4px; color: #6abf7b; }
.prix-sub { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; margin-bottom: 16px; color: #5a8a6a; }
.btn-premium { display: inline-block; text-align: center; padding: 10px 20px; border-radius: 8px; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; font-weight: 700; text-decoration: none; transition: opacity 0.2s; margin-top: auto; background: #2d6a3f; color: #e0f5e8; }
.btn-premium:hover { opacity: 0.88; }
.stat-choc { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.06); border-radius: 8px; padding: 8px 12px; margin-bottom: 14px; }
.stat-num { font-size: 28px; font-weight: 700; color: #6abf7b; font-family: Georgia,serif; line-height: 1; }
.stat-label { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; color: #7ab8a0; line-height: 1.4; }
.section { padding: 52px 32px; text-align: center; }
.section-label { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #8a7a6a; margin-bottom: 8px; }
.section-title { font-size: clamp(20px,3vw,28px); color: #1a2e0a; font-weight: normal; margin-bottom: 32px; }
.garanties-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; max-width: 960px; margin: 0 auto; }
@media(max-width:560px){.garanties-grid{grid-template-columns:1fr;}}
.garantie-card { background: #fff; border-radius: 12px; padding: 28px 24px; text-align: left; border-top: 3px solid #3b6d11; }
.garantie-card.amber { border-top-color: #8b5e0a; }
.garantie-card.purple { border-top-color: #5a3ab0; }
.tag { display: inline-block; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; margin-bottom: 12px; }
.tag.green { background: #eaf3de; color: #2d5016; }
.tag.amber { background: #faeeda; color: #633806; }
.tag.purple { background: #ede8ff; color: #3a1a7a; }
.garantie-card h4 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 16px; font-weight: 600; color: #1a2e0a; margin-bottom: 10px; }
.garantie-card p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #5a6a4e; line-height: 1.65; }
.societe-band { background: #fff; margin: 0 32px 52px; border-radius: 12px; padding: 28px 32px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border: 1px solid #e0d8cc; }
@media(max-width:600px){.societe-band{flex-direction:column;text-align:center;margin:0 16px 40px;}}
.societe-band h3 { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 16px; font-weight: 600; color: #1a2e0a; margin-bottom: 6px; }
.societe-band p { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; color: #6b7a5e; line-height: 1.55; }
.btn-doc { background: #0d1b4b; color: #e0eaf8; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; white-space: nowrap; display: inline-block; transition: background 0.2s; }
.btn-doc:hover { background: #162770; }
.confiance { background: linear-gradient(135deg, #0d1b4b, #162e1a); padding: 48px 32px; text-align: center; }
.confiance .label { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #5a9a6a; margin-bottom: 28px; }
.confiance-items { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; max-width: 500px; margin: 0 auto; }
@media(max-width:480px){.confiance-items{grid-template-columns:1fr;}}
.confiance-item strong { display: block; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 18px; font-weight: 700; color: #e0f0e8; margin-bottom: 4px; }
.confiance-item span { font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 12px; color: #7aaa8a; line-height: 1.4; }
</style>
</head>
<body>
{{nav}}
<div class="hero">
  <span class="hero-badge">Assurance chasse — {{name}} ({{code}})</span>
  <h1>L'assurance chasse pensée pour les chasseurs {{nameLowerArticle}}</h1>
  <p>Vous êtes déjà assuré en responsabilité civile auprès de votre fédération. Nous complétons votre couverture là où elle s'arrête.</p>
  <div class="cta-grid">
    <a href="/options-chasse.html" class="cta-card-premium securite">
      <span class="premium-badge">Garantie corporelle</span>
      <h3>Je souhaite prendre une garantie corporelle Sécurité chasse</h3>
      <div class="stat-choc">
        <div class="stat-num">30%</div>
        <div class="stat-label">des accidents de chasse sont des auto-accidents</div>
      </div>
      <p class="argument">Souscrivez cette garantie auprès d'Allianz et couvrez vos blessures corporelles, ITT et invalidité lors de vos parties de chasse.</p>
      <div class="prix-tag">{{tarifSecurite}} €<span style="font-size:13px;font-weight:400;color:#5a9a7a"> / an</span></div>
      <div class="prix-sub">par saison de chasse</div>
      <span class="btn-premium">Souscrire cette garantie →</span>
    </a>
    <a href="/options-chasse.html" class="cta-card green">
      <div class="cta-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="#6abf7b" stroke-width="1.5" stroke-linecap="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z"/></svg></div>
      <h3>Je suis chasseur individuel</h3>
      <p>Je veux protéger mes chiens ou me couvrir avec une garantie corporelle en cas d'accident de chasse</p>
      <span class="cta-link green">Voir les options →</span>
    </a>
    <a href="/guichet-unique.html" class="cta-card amber">
      <div class="cta-icon amber"><svg viewBox="0 0 24 24" fill="none" stroke="#d4970a" stroke-width="1.5" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
      <h3>Je représente une société de chasse</h3>
      <p>Je cherche nos conditions générales et documents contractuels</p>
      <span class="cta-link amber">Accéder aux documents →</span>
    </a>
    <a href="/options-chasse.html" class="cta-card-premium installation">
      <span class="premium-badge">Nouvelle garantie</span>
      <h3>Assurer mon installation cynégétique</h3>
      <p class="argument">Cabane de chasse, palombière, tonne, mirador… Protégez votre installation contre les dommages et le vandalisme.</p>
      <span class="btn-premium">Découvrir cette garantie →</span>
    </a>
  </div>
</div>
<div class="section">
  <p class="section-label">Nos offres</p>
  <h2 class="section-title">Trois options pour chasseurs individuels</h2>
  <div class="garanties-grid">
    <div class="garantie-card"><span class="tag green">Option 1</span><h4>Protection de vos chiens</h4><p>Prise en charge des frais vétérinaires en cas de blessure pendant la chasse. Parce qu'un chien blessé, c'est aussi une saison compromise.</p></div>
    <div class="garantie-card amber"><span class="tag amber">Option 2</span><h4>Sécurité chasse</h4><p>Indemnisation de vos blessures corporelles survenues lors d'une partie de chasse. Vous aussi, vous méritez d'être protégé.</p></div>
    <div class="garantie-card purple"><span class="tag purple">Option 3</span><h4>Installation cynégétique</h4><p>Cabane de chasse, palombière, tonne, mirador — couvrez votre installation contre les dommages accidentels et le vandalisme.</p></div>
  </div>
</div>
<div class="societe-band">
  <div><h3>Vous êtes une société ou association de chasse ?</h3><p>Retrouvez directement vos conditions générales et documents contractuels, disponibles en téléchargement libre.</p></div>
  <a href="/guichet-unique.html" class="btn-doc">Accéder aux documents</a>
</div>
<div class="confiance">
  <p class="label">Pourquoi nous faire confiance</p>
  <div class="confiance-items">
    <div class="confiance-item"><strong>Local</strong><span>Spécialisé chasse {{nameLocalSpecialist}}</span></div>
    <div class="confiance-item"><strong>Simple</strong><span>Souscription 100&nbsp;% en ligne</span></div>
    <div class="confiance-item"><strong>Rapide</strong><span>Documents envoyés automatiquement</span></div>
  </div>
</div>
{{footer}}
</body>
</html>
BOOTSTRAP_EOF_INDEX

echo ""
echo "✓ Projet recree avec succes."
echo ""
echo "Etapes suivantes :"
echo "  1. Verifier le build : npm run build"
echo "  2. Push :"
echo "     git init -b main"
echo "     git add -A"
echo "     git commit -m \"Initial commit\""
echo "     git remote add origin https://github.com/assurancesparcs/assurance-chasse.git"
echo "     git push -u origin main"
