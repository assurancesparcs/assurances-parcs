// ─── TENANT CONFIGURATION ─────────────────────────────────────────────────────
// Chaque cabinet utilisateur de l'app a une entrée dans TENANTS.
// La résolution se fait au build via VITE_TENANT_ID, fallback = 'poncey-lebas'.
// Phase 2 (à venir) : résolution runtime via sous-domaine + Firestore.
//
// Pour ajouter un cabinet :
//   1. Ajouter une entrée dans TENANTS ci-dessous
//   2. Build avec VITE_TENANT_ID=<id> npm run build
//   3. Déployer sur le sous-domaine du cabinet

const PONCEY_LEBAS = {
  id: 'poncey-lebas',

  // Identité
  name: 'CABINET PONCEY LEBAS',
  shortName: 'Mon Espace Pro',
  appTitle: 'Espace Pro — Cabinet PONCEY LEBAS',
  description: 'Gestion sinistres, contrats, clients et MED',

  // Branding (PWA + UI)
  branding: {
    themeColor: '#0d0f1a',
    backgroundColor: '#0d0f1a',
    pwaName: 'Mon Espace Pro — Cabinet PONCEY LEBAS',
    pwaShortName: 'Espace Pro',
  },

  // Cabinet principal — utilisé dans signatures, PDF, templates
  contact: {
    phone: '02 31 92 81 31',
    orias: '07022305 - 12066667',
    address: '',
  },

  // Sub-brand "chasse" (optionnel — laisser null si non utilisé)
  contactChasse: {
    name: 'Cabinet PONCEY Assurance Chasse',
    phone: '0 800 014 033',
    phoneCaption: '(appel gratuit)',
    address: '97 rue de Bretagne — 14400 Bayeux',
    orias: '07022305',
  },

  // Compagnie partenaire principale (mise en avant dans le module MED)
  primaryInsurer: {
    name: 'Allianz',
    agentStatus: 'Agent Général Allianz',
  },

  // Signataire par défaut pour les emails et PDF
  defaultSignatory: {
    name: 'Amélie BLANCO',
    titleStandard: '',
    titleChasse: 'Collaboratrice d\'agence',
  },

  // Équipe — alimente les sélecteurs "Assigné à" / "Créé par"
  team: ['Johann', 'E.Poncey', 'Ombeline', 'Julie', 'Priscillia', 'Amélie', 'Justine', 'Wiam', 'Wendy'],

  // Modules activés — pilote la NavBar et les vues exposées
  modules: {
    clients: true,
    contracts: true,
    echeances: true,
    sinistresStandard: true,
    sinistresChasse: true,
    sinistresDashboard: true,
    med: true,
    activityLog: true,
    stats: true,
  },
};

const TENANTS = {
  'poncey-lebas': PONCEY_LEBAS,
};

const TENANT_ID = import.meta.env.VITE_TENANT_ID || 'poncey-lebas';

export const tenant = TENANTS[TENANT_ID] || PONCEY_LEBAS;

export function getCabinetBlock(mode = 'standard') {
  if (mode === 'chasse' && tenant.contactChasse) {
    const c = tenant.contactChasse;
    const lines = [c.name, `Tél : ${c.phone}${c.phoneCaption ? ' ' + c.phoneCaption : ''}`];
    if (c.address) lines.push(c.address);
    if (c.orias) lines.push(`N° Orias : ${c.orias}`);
    return lines.join('\n');
  }
  const c = tenant.contact;
  const lines = [tenant.name, `Tél : ${c.phone}`];
  if (c.address) lines.push(c.address);
  if (c.orias) lines.push(`N° Orias : ${c.orias}`);
  return lines.join('\n');
}

export function getEmailSignature(mode = 'standard', signatory = null) {
  const s = signatory || tenant.defaultSignatory;
  if (mode === 'chasse' && tenant.contactChasse) {
    const c = tenant.contactChasse;
    const title = s.titleChasse ? ` — ${s.titleChasse}` : '';
    const seat = c.address ? `\nSiège administratif : ${c.address}` : '';
    return `\n\nCordialement,\n\n${s.name}${title}\n${c.name}\nTél : ${c.phone}${c.phoneCaption ? ' ' + c.phoneCaption : ''}${seat}`;
  }
  const c = tenant.contact;
  const orias = c.orias ? `\nN° Orias : ${c.orias}` : '';
  return `\n\nCordialement,\n\n${s.name}\n${tenant.name}\nTél : ${c.phone}${orias}`;
}

export function getMEDSignature(signatory = null) {
  const s = signatory || tenant.defaultSignatory;
  const c = tenant.contact;
  const agent = tenant.primaryInsurer?.agentStatus
    ? ` — ${tenant.primaryInsurer.agentStatus}`
    : '';
  const orias = c.orias ? ` — N° Orias : ${c.orias}` : '';
  return `Cordialement,\n${s.name}\n${tenant.name}${agent}\nTél : ${c.phone}${orias}`;
}

export function getRenouvellementSignature(signatory = null) {
  const s = signatory || tenant.defaultSignatory;
  const c = tenant.contact;
  const orias = c.orias ? ` — N° Orias : ${c.orias}` : '';
  return `Cordialement,\n${s.name}\n${tenant.name}\nTél : ${c.phone}${orias}`;
}
