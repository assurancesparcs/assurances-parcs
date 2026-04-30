# Guide d'installation — Automatisation emails (Google Apps Script)

## Ce que ça fait
Chaque matin à **8h30**, le script :
- Envoie les emails des campagnes planifiées du jour **depuis assuraudio@gmail.com**
- Envoie une **relance 1** automatique après 7 jours sans réponse
- Envoie une **relance 2** automatique après 7 jours supplémentaires
- Clôture l'envoi après la 2ème relance sans réponse

---

## Installation — 5 étapes

### Étape 1 — Ouvrir Google Apps Script

1. Connecte-toi sur **assuraudio@gmail.com**
2. Va sur [script.google.com](https://script.google.com)
3. Clique sur **"Nouveau projet"**
4. Renomme le projet : **"Campagnes Audio"** (clic sur "Projet sans titre" en haut)

---

### Étape 2 — Coller le script

1. Efface tout le contenu du fichier `Code.gs` existant
2. Ouvre le fichier **`daily-sender.gs`** (dans ce même dossier)
3. Copie **tout le contenu** et colle-le dans l'éditeur Apps Script
4. Clique sur **💾 Sauvegarder** (ou Ctrl+S)

---

### Étape 3 — Tester une première fois

1. Dans le menu déroulant en haut, sélectionne la fonction **`lancerEnvoisDuJour`**
2. Clique sur **▶ Exécuter**
3. Une fenêtre s'ouvre pour demander les autorisations → clique **"Examiner les autorisations"**
4. Sélectionne le compte **assuraudio@gmail.com**
5. Clique **"Avancé"** puis **"Accéder à Campagnes Audio (non sécurisé)"**
6. Clique **"Autoriser"**
7. Le script s'exécute — vérifie les **Journaux** (Ctrl+Entrée) pour voir le résultat

> **Normal au premier lancement :** "0 email(s) envoyé(s)" si aucune campagne n'est planifiée pour aujourd'hui.

---

### Étape 4 — Programmer le déclencheur automatique (8h30 chaque matin)

1. Dans le menu de gauche, clique sur l'icône **⏰ Déclencheurs** (horloge)
2. Clique sur **"+ Ajouter un déclencheur"** (en bas à droite)
3. Configure comme suit :

| Paramètre | Valeur |
|-----------|--------|
| Fonction à exécuter | `lancerEnvoisDuJour` |
| Source de l'événement | **Déclencheur temporel** |
| Type de déclencheur | **Minuterie horaire** puis **Jour spécifique de la semaine** → non, choisir **Heure de la journée** |
| Type de minuterie | **Heure de la journée** |
| Heure de la journée | **8h00 – 9h00** |

4. Clique **Enregistrer**

✅ Le script s'exécutera maintenant automatiquement chaque matin entre 8h et 9h.

---

### Étape 5 — Vérifier dans l'application

1. Ouvre l'app Campagnes (`npm run dev` dans le dossier `campagnes/`)
2. Va dans l'onglet **📬 Suivi envois**
3. Dès qu'une campagne est envoyée, les destinataires apparaissent ici avec leur statut

---

## Utilisation quotidienne

### Pour planifier un envoi
1. Dans l'app, crée une campagne avec une **date d'envoi** et le statut **"Planifiée"** ou **"Active"**
2. Le lendemain matin, le script l'enverra automatiquement

### Quand tu reçois une réponse
1. Va dans **📬 Suivi envois**
2. Clique ✅ sur le contact qui a répondu
3. Le script ne lui enverra plus de relance

### Pour arrêter les relances sur un contact
- Clique 🗄️ sur le contact dans la vue Suivi → les relances s'arrêtent

---

## Modifier les délais de relance

Ouvre le script dans Apps Script et modifie ces deux lignes dans la section `CONFIG` :

```javascript
DELAI_RELANCE_1: 7,   // Relance 1 après 7 jours → change ce chiffre
DELAI_RELANCE_2: 7,   // Relance 2 après 7 jours → change ce chiffre
```

---

## Consulter les journaux d'envoi

Dans Google Apps Script :
1. Menu gauche → **Exécutions** (icône ▶)
2. Tu vois toutes les exécutions passées avec les logs détaillés
3. Les emails envoyés sont aussi visibles dans **Gmail → Envoyés**

---

## Limites gratuites Google

| Ressource | Limite gratuite |
|-----------|-----------------|
| Emails par jour | **500 emails** (largement suffisant) |
| Exécutions Apps Script | **6 min par exécution** |
| Appels URL (Firestore) | **20 000/jour** |

---

## En cas de problème

**Le script ne s'exécute pas :**
→ Vérifie dans "Déclencheurs" que le trigger est bien configuré

**"Impossible d'obtenir le token Firebase" :**
→ Vérifie que la clé API dans `CONFIG.FIREBASE_API_KEY` est correcte

**Les emails arrivent en spam :**
→ Demande à tes contacts d'ajouter assuraudio@gmail.com à leurs contacts
→ Dans Gmail, active l'authentification (SPF/DKIM sont automatiques avec Gmail)

**Erreur lors de l'autorisation :**
→ Déconnecte-toi de tous les comptes Google, reconnecte-toi uniquement avec assuraudio@gmail.com
