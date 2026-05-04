# Commercialisation — Mon Espace Pro

Plan de transformation de l'app interne (Cabinet PONCEY LEBAS) en SaaS multi-tenant pour cabinets d'assurance.

## État actuel — Phase 1 ✅ (cette branche)

**Tenant config layer en place.**

Chaque valeur cabinet-spécifique est désormais centralisée dans `gestion/src/tenant/config.js` :
- Identité : nom, titre app, description
- Coordonnées : tél, ORIAS, adresse
- Sub-brand chasse (optionnel)
- Compagnie partenaire principale (Allianz, AXA, MMA…) — pilote le module MED
- Signataire par défaut (nom, titres standard/chasse)
- Équipe (liste collaborateurs)
- Modules activés (clients, contrats, échéances, sinistres standard, sinistres chasse, dashboard, MED, journal, stats)
- Branding (couleurs PWA)

**Sélection du tenant au build** : `VITE_TENANT_ID=<id> npm run build`. Fallback : `poncey-lebas`.

**PWA manifest** : surchargeable via env vars `VITE_PWA_NAME`, `VITE_PWA_SHORT_NAME`, `VITE_PWA_DESCRIPTION`, `VITE_PWA_THEME_COLOR`, `VITE_PWA_BG_COLOR`.

**Fichiers refactorés** :
- `src/constants.js` — signatures email + USERS lus depuis tenant
- `src/utils/exportPDF.js` — entête PDF tenant-aware
- `src/components/MEDModal.jsx`, `MEDImportModal.jsx`, `MEDRelanceModal.jsx` — partenaire MED dynamique
- `src/components/NavBar.jsx` — titre + filtrage des vues par modules activés
- `src/main.jsx` — title + theme-color + apple-title posés au runtime
- `vite.config.js` — manifest PWA env-driven

**Zéro régression** : PONCEY LEBAS reste le tenant par défaut, signatures et templates identiques, build OK.

---

## Phase 2 — Isolation des données Firestore

**Objectif** : chaque cabinet a ses propres données, isolation stricte.

**Migration de structure** :
- Avant : `clients/`, `contrats/`, `sinistres/`, `medDossiers/`, `activityLog/`, `items/`, `sinistresChasse/` (collections plates)
- Après : `tenants/{tenantId}/clients/`, `tenants/{tenantId}/contrats/`, etc.

**Tâches** :
1. Helper `tenantCol(name)` qui retourne `collection(db, 'tenants', tenant.id, name)` — un seul point de modif
2. Refactor de `App.jsx` (les 7 `onSnapshot` + tous les `addDoc/updateDoc/deleteDoc/doc(...)`)
3. Script de migration ponctuel pour PONCEY LEBAS (copier les collections existantes vers `tenants/poncey-lebas/...`)
4. Firestore Security Rules : `match /tenants/{tid}/{=path**} { allow read, write: if request.auth.token.tenantId == tid; }`
5. Tester la rétrocompat puis bascule en une fenêtre

**Risque** : downtime court pendant la migration. À faire un soir/weekend.

---

## Phase 3 — Authentification réelle + résolution dynamique du tenant

**Objectif** : remplacer l'auth anonyme + PIN par un vrai compte par utilisateur, avec rôles.

**Tâches** :
1. Activer Firebase Auth email/password (ou magic link Email)
2. Collection `users/{uid}` avec `{ tenantId, role: 'admin' | 'collab', name, email, signatory: {...} }`
3. Custom claim `tenantId` posé via Cloud Function au signup pour les Security Rules
4. Remplacer `PinScreen` + `UserNameScreen` par un écran login
5. Le `userName` actuel devient `currentUser.name` (et la signature email peut être personnalisée par utilisateur via `currentUser.signatory`)
6. Migrer le tenant singleton vers un `TenantContext` qui charge le tenant depuis Firestore après login (le tenant config part de Firestore, pas plus du code)
7. Sous-domaine par cabinet : `poncey.monespacepro.app`, `cabinetX.monespacepro.app` → résolution du tenant à partir du host

**Modèle de rôle** :
- `admin` (le patron du cabinet) : accès complet + back-office tenant
- `collab` : accès aux modules + données mais pas à la config tenant

---

## Phase 4 — Onboarding + back-office tenant

**Objectif** : un cabinet peut s'inscrire et configurer son instance sans intervention dev.

**Pages à créer** :
1. **Landing publique** (`/`) — pitch + démo + CTA "Essayer 14 jours"
2. **Signup** — création du compte admin + tenant Firestore
3. **Onboarding wizard** (3-4 étapes)
   - Identité cabinet (nom, ORIAS, tél, adresse)
   - Compagnie partenaire (pour le module MED)
   - Équipe (ajouter les collaborateurs avec emails)
   - Modules à activer (chasse oui/non, MED oui/non, etc.)
   - Branding (couleur primaire)
4. **Settings tenant** (`/settings`) — édition de tout ce qui précède + signatures email perso par utilisateur
5. **Invitation collaborateur** par email (envoi via Firebase + lien d'inscription pré-attribué au tenant)

**Templates email** : déjà parametrés en Phase 1, restent les mêmes — il suffit que le tenant Firestore charge les bons champs.

---

## Phase 5 — Pricing & facturation

**Stratégie de prix** (à valider en interviews cabinets) :
- **Starter** (~49 €/mois) : 1 utilisateur, modules clients + contrats + sinistres
- **Cabinet** (~149 €/mois) : 5 utilisateurs, tous modules
- **Cabinet+** (~299 €/mois) : 15 utilisateurs, support prioritaire, custom branding

**Stack technique facturation** :
- Stripe Checkout pour le signup payant
- Stripe Customer Portal pour la gestion abonnement (upgrade/cancel)
- Webhook Stripe → Cloud Function → Firestore (`tenants/{id}/subscription`)
- Garde d'accès : si `subscription.status !== 'active'`, redirect vers `/billing`

**Trial** : 14 jours gratuits sans CB. Email J-3 + J0 pour conversion.

---

## Phase 6 — Go-to-market

**Acquisition** :
1. Landing SEO (mots-clés : "logiciel cabinet assurance", "gestion sinistres assurance", "MED Allianz")
2. Démarchage direct des autres cabinets locaux Allianz (Caen, Bayeux, alentours) — Johann a le réseau
3. Présentations en réunion régionale Allianz / chambre des agents généraux
4. LinkedIn — case study "Comment le Cabinet PONCEY LEBAS gère N sinistres / mois avec 0 papier"
5. Programme parrainage — 1 mois offert par cabinet recommandé

**Lead magnets** existants déjà** :
- `Guide-Sinistres-MonEspacePro.docx`
- `Presentation-Generale-MonEspacePro.docx`

À réutiliser sur la landing.

---

## Risques & considérations

**Légal** :
- CGU + CGV à rédiger
- Mentions légales hébergement
- DPA / RGPD : un DPA par cabinet client (les données clients d'assurance sont sensibles)
- Hébergement Firebase = Google Cloud (régions UE à activer pour conformité)
- Politique de confidentialité claire : qui voit quoi

**Technique** :
- Limiter les coûts Firestore par tenant (quota reads/writes/storage)
- Backup automatique par tenant (Cloud Function quotidienne → bucket GCS)
- Monitoring : un cabinet en panne ne doit pas casser les autres

**Concurrence à étudier** :
- AssurOne, Sweep, Mes Assurances Pro… mapper leurs prix et features

---

## Prochaine étape concrète

→ **Phase 2 (isolation des données)**.

Démarrer par l'ajout du helper `tenantCol(name)` et la migration des `onSnapshot` dans `App.jsx`. Puis script de migration des données PONCEY LEBAS existantes. Puis Security Rules. Tout ça reste invisible côté UX.

Une fois Phase 2 livrée, l'app est techniquement prête à servir N cabinets — il restera l'auth réelle (Phase 3) et l'onboarding (Phase 4) pour ouvrir les inscriptions.
