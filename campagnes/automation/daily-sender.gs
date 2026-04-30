// ═══════════════════════════════════════════════════════════════════════════════
//  CAMPAGNES EMAILING AUDIOPROTHÉSISTES — Automation quotidienne
//  Cabinet Poncey Lebas — assuraudio@gmail.com
//
//  Ce script s'exécute chaque matin à 8h30 et :
//    1. Envoie les emails du jour (campagnes planifiées)
//    2. Envoie les relances automatiques (si pas de réponse après X jours)
//
//  PRÉREQUIS : Firestore en mode test (règles ouvertes)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── CONFIGURATION ─────────────────────────────────────────────────────────────

var CONFIG = {
  FIREBASE_API_KEY:  'AIzaSyBlWYj-tOLHL_lAoY2ibXpx7QF2m4gvRfY',
  PROJECT_ID:        'gestion-assurances-parcs',
  FROM_EMAIL:        'assuraudio@gmail.com',
  FROM_NAME:         'Amélie BLANCO — Cabinet Poncey Lebas',

  // Délais de relance (en jours)
  DELAI_RELANCE_1:   7,   // Relance 1 après 7 jours sans réponse
  DELAI_RELANCE_2:   7,   // Relance 2 après 7 jours supplémentaires

  // Collections Firestore
  COL_CAMPAGNES:  'campagnes_audio',
  COL_PROSPECTS:  'prospects_audio',
  COL_ENVOIS:     'envois_audio',

  // Heure limite d'envoi (pour éviter les doublons si le script tourne deux fois)
  MAX_EMAILS_PAR_RUN: 50,
};

// ─── POINT D'ENTRÉE PRINCIPAL ──────────────────────────────────────────────────

function lancerEnvoisDuJour() {
  Logger.log('═══ Démarrage script — ' + new Date().toLocaleString('fr-FR') + ' ═══');

  try {
    var token     = getFirebaseToken();
    var prospects = chargerCollection(token, CONFIG.COL_PROSPECTS);
    var campagnes = chargerCollection(token, CONFIG.COL_CAMPAGNES);
    var envois    = chargerCollection(token, CONFIG.COL_ENVOIS);

    Logger.log('Chargé : ' + campagnes.length + ' campagnes, ' +
               prospects.length + ' prospects, ' + envois.length + ' envois existants');

    var totalEnvoyes = 0;

    // 1. ENVOIS INITIAUX — campagnes planifiées pour aujourd'hui
    totalEnvoyes += traiterEnvoisInitiaux(token, campagnes, prospects, envois);

    // 2. RELANCES AUTOMATIQUES — si pas de réponse après X jours
    totalEnvoyes += traiterRelances(token, envois, campagnes, prospects);

    Logger.log('═══ Terminé — ' + totalEnvoyes + ' email(s) envoyé(s) ═══');

  } catch (err) {
    Logger.log('ERREUR CRITIQUE : ' + err.toString());
    // En cas d'erreur grave, envoyer un email d'alerte
    GmailApp.sendEmail(
      CONFIG.FROM_EMAIL,
      '[ERREUR] Script campagnes audio — ' + new Date().toLocaleDateString('fr-FR'),
      'Erreur lors de l\'exécution du script :\n\n' + err.toString() + '\n\n' + err.stack
    );
  }
}

// ─── ENVOIS INITIAUX ────────────────────────────────────────────────────────────

function traiterEnvoisInitiaux(token, campagnes, prospects, envoisExistants) {
  var aujourd_hui = dateAujourdhui();
  var nbEnvoyes   = 0;

  campagnes.forEach(function(campagne) {
    if (!doitEnvoyerAujourdhui(campagne, aujourd_hui)) return;
    if (!campagne.template || !campagne.template.sujet || !campagne.template.contenu) {
      Logger.log('Campagne "' + campagne.nom + '" : template incomplet, ignorée');
      return;
    }

    var cibles = getCibles(campagne, prospects);
    Logger.log('Campagne "' + campagne.nom + '" : ' + cibles.length + ' cible(s)');

    cibles.forEach(function(prospect) {
      if (!prospect.email) return;
      if (nbEnvoyes >= CONFIG.MAX_EMAILS_PAR_RUN) return;

      // Vérifier qu'on n'a pas déjà envoyé pour cette campagne × prospect
      var dejàEnvoye = envoisExistants.some(function(e) {
        return e.campagneId === campagne.id && e.prospectId === prospect.id;
      });
      if (dejàEnvoye) return;

      // Envoyer l'email
      var ok = envoyerEmail(
        prospect.email,
        campagne.template.sujet,
        campagne.template.contenu,
        prospect.nom
      );

      if (ok) {
        // Créer le document de suivi dans Firestore
        var envoiDoc = {
          campagneId:    campagne.id,
          campagneNom:   campagne.nom || '',
          prospectId:    prospect.id,
          prospectNom:   prospect.nom || '',
          prospectEmail: prospect.email,
          statut:        'envoye',
          envoye1At:     new Date().toISOString(),
          relance1At:    null,
          relance2At:    null,
          reponduAt:     null,
          createdAt:     new Date().toISOString(),
          updatedAt:     new Date().toISOString(),
        };
        creerDocument(token, CONFIG.COL_ENVOIS, envoiDoc);

        // Incrémenter le compteur sur la campagne
        incrementerEnvoye(token, campagne.id);

        nbEnvoyes++;
        Logger.log('  ✉️  Envoyé → ' + prospect.email);
        Utilities.sleep(500); // pause 0.5s entre les envois
      }
    });
  });

  return nbEnvoyes;
}

// ─── RELANCES AUTOMATIQUES ─────────────────────────────────────────────────────

function traiterRelances(token, envois, campagnes, prospects) {
  var maintenant = new Date();
  var nbEnvoyes  = 0;

  envois.forEach(function(envoi) {
    if (nbEnvoyes >= CONFIG.MAX_EMAILS_PAR_RUN) return;
    if (['repondu', 'termine'].includes(envoi.statut)) return;

    var campagne = campagnes.find(function(c) { return c.id === envoi.campagneId; });
    if (!campagne || !campagne.template) return;

    var prospect = prospects.find(function(p) { return p.id === envoi.prospectId; });
    if (!prospect || !prospect.email) return;

    // ── RELANCE 1 ──
    if (envoi.statut === 'envoye' && envoi.envoye1At && !envoi.relance1At) {
      var joursDepuisEnvoi = joursEcoulés(envoi.envoye1At);
      if (joursDepuisEnvoi >= CONFIG.DELAI_RELANCE_1) {
        var sujet  = 'Relance — ' + campagne.template.sujet;
        var corps  = buildRelance(1, campagne.template.contenu, prospect.nom, joursDepuisEnvoi);
        var ok = envoyerEmail(prospect.email, sujet, corps, prospect.nom);
        if (ok) {
          majEnvoi(token, envoi.id, {
            statut:     'relance1',
            relance1At: new Date().toISOString(),
            updatedAt:  new Date().toISOString(),
          });
          nbEnvoyes++;
          Logger.log('  🔔 Relance 1 → ' + prospect.email + ' (J+' + joursDepuisEnvoi + ')');
          Utilities.sleep(500);
        }
      }
    }

    // ── RELANCE 2 ──
    else if (envoi.statut === 'relance1' && envoi.relance1At && !envoi.relance2At) {
      var joursDepuisRelance1 = joursEcoulés(envoi.relance1At);
      if (joursDepuisRelance1 >= CONFIG.DELAI_RELANCE_2) {
        var sujet2  = '2ème relance — ' + campagne.template.sujet;
        var corps2  = buildRelance(2, campagne.template.contenu, prospect.nom, joursDepuisRelance1);
        var ok2 = envoyerEmail(prospect.email, sujet2, corps2, prospect.nom);
        if (ok2) {
          majEnvoi(token, envoi.id, {
            statut:     'relance2',
            relance2At: new Date().toISOString(),
            updatedAt:  new Date().toISOString(),
          });
          nbEnvoyes++;
          Logger.log('  ⚠️  Relance 2 → ' + prospect.email + ' (J+' + joursDepuisRelance1 + ')');
          Utilities.sleep(500);
        }
      }
    }

    // ── APRÈS RELANCE 2 : clôturer ──
    else if (envoi.statut === 'relance2' && envoi.relance2At) {
      var joursDepuisRelance2 = joursEcoulés(envoi.relance2At);
      if (joursDepuisRelance2 >= CONFIG.DELAI_RELANCE_2) {
        majEnvoi(token, envoi.id, {
          statut:    'termine',
          updatedAt: new Date().toISOString(),
        });
        Logger.log('  🗄️  Clôturé (sans réponse) → ' + prospect.email);
      }
    }
  });

  return nbEnvoyes;
}

// ─── HELPERS EMAIL ─────────────────────────────────────────────────────────────

function envoyerEmail(destinataire, sujet, corps, nomProspect) {
  try {
    GmailApp.sendEmail(destinataire, sujet, corps, {
      name: CONFIG.FROM_NAME,
      replyTo: CONFIG.FROM_EMAIL,
    });
    return true;
  } catch (err) {
    Logger.log('  ❌ Échec envoi vers ' + destinataire + ' : ' + err.toString());
    return false;
  }
}

function buildRelance(numero, corpsOriginal, nomProspect, joursEcoules) {
  var intro = numero === 1
    ? 'Madame, Monsieur ' + (nomProspect || '') + ',\n\n' +
      'Je me permets de revenir vers vous suite à mon message de la semaine dernière, ' +
      'resté sans réponse de votre part.\n\n' +
      'Je vous le retransmets ci-dessous dans l\'espoir qu\'il n\'est pas été égaré.\n\n' +
      '─────────────────────────────────────\n\n'
    : 'Madame, Monsieur ' + (nomProspect || '') + ',\n\n' +
      'Il s\'agit de mon dernier message concernant ce sujet. ' +
      'Je reste bien entendu disponible si vous souhaitez en discuter à votre convenance.\n\n' +
      '─────────────────────────────────────\n\n';

  return intro + corpsOriginal;
}

// ─── LOGIQUE DE PLANIFICATION ──────────────────────────────────────────────────

function doitEnvoyerAujourdhui(campagne, aujourd_hui) {
  if (!['active', 'planifiee'].includes(campagne.statut)) return false;

  var planif = campagne.planification;
  if (!planif || !planif.dateEnvoi) return false;

  var dateEnvoi = new Date(planif.dateEnvoi);
  dateEnvoi.setHours(0, 0, 0, 0);

  var recurrence = planif.recurrence || 'unique';

  if (recurrence === 'unique') {
    return dateEnvoi.getTime() === aujourd_hui.getTime();
  }

  // Pour les récurrences : vérifier si aujourd'hui correspond au cycle
  if (dateEnvoi > aujourd_hui) return false; // Pas encore commencée

  var diffJours = Math.round((aujourd_hui - dateEnvoi) / 86400000);

  switch (recurrence) {
    case 'mensuelle':
      // Même jour du mois que la date initiale
      return aujourd_hui.getDate() === dateEnvoi.getDate() && diffJours > 0;
    case 'trimestrielle':
      return diffJours % 91 === 0 && diffJours > 0;
    case 'semestrielle':
      return diffJours % 182 === 0 && diffJours > 0;
    case 'annuelle':
      return aujourd_hui.getDate() === dateEnvoi.getDate() &&
             aujourd_hui.getMonth() === dateEnvoi.getMonth() &&
             aujourd_hui.getFullYear() > dateEnvoi.getFullYear();
    default:
      return false;
  }
}

function getCibles(campagne, prospects) {
  if (!campagne.cibles) return [];
  if (campagne.cibles.tous) return prospects.filter(function(p) { return p.email; });
  var ids = campagne.cibles.prospectIds || [];
  return prospects.filter(function(p) { return ids.includes(p.id) && p.email; });
}

// ─── HELPERS DATE ──────────────────────────────────────────────────────────────

function dateAujourdhui() {
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function joursEcoulés(isoString) {
  if (!isoString) return 0;
  var d = new Date(isoString);
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

// ─── FIREBASE / FIRESTORE REST API ─────────────────────────────────────────────

function getFirebaseToken() {
  var url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInAnonymously?key=' + CONFIG.FIREBASE_API_KEY;
  var resp = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ returnSecureToken: true }),
    muteHttpExceptions: true,
  });

  var code = resp.getResponseCode();
  var text = resp.getContentText();

  if (code !== 200) {
    throw new Error(
      'Firebase Auth échouée (HTTP ' + code + ').\n' +
      'Vérifiez que l\'API "Identity Toolkit" est activée dans Google Cloud Console\n' +
      'et que la clé API n\'a pas de restriction HTTP referrer.\n' +
      'Réponse reçue : ' + text.substring(0, 300)
    );
  }

  var data;
  try { data = JSON.parse(text); }
  catch (e) {
    throw new Error('Réponse Firebase Auth non-JSON (HTTP ' + code + ').\nDébut : ' + text.substring(0, 300));
  }

  if (!data.idToken) {
    throw new Error('Token absent de la réponse Firebase.\nErreur : ' + JSON.stringify(data.error || data));
  }
  return data.idToken;
}

function chargerCollection(token, col) {
  var url = 'https://firestore.googleapis.com/v1/projects/' + CONFIG.PROJECT_ID +
            '/databases/(default)/documents/' + col + '?pageSize=500';
  var resp = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true,
  });

  var code = resp.getResponseCode();
  var text = resp.getContentText();

  if (code !== 200) {
    throw new Error('Firestore GET /' + col + ' échoué (HTTP ' + code + ').\nRéponse : ' + text.substring(0, 300));
  }

  var data;
  try { data = JSON.parse(text); }
  catch (e) {
    throw new Error('Réponse Firestore non-JSON pour /' + col + '.\nDébut : ' + text.substring(0, 300));
  }

  if (!data.documents) return [];
  return data.documents.map(function(doc) {
    var id  = doc.name.split('/').pop();
    var obj = parseFirestoreDoc(doc.fields || {});
    obj.id  = id;
    return obj;
  });
}

function creerDocument(token, col, data) {
  var url = 'https://firestore.googleapis.com/v1/projects/' + CONFIG.PROJECT_ID +
            '/databases/(default)/documents/' + col;
  var resp = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify({ fields: buildFirestoreFields(data) }),
    muteHttpExceptions: true,
  });
  return JSON.parse(resp.getContentText());
}

function majEnvoi(token, docId, data) {
  var fields  = buildFirestoreFields(data);
  var mask    = Object.keys(fields).map(function(k) { return 'updateMask.fieldPaths=' + k; }).join('&');
  var url = 'https://firestore.googleapis.com/v1/projects/' + CONFIG.PROJECT_ID +
            '/databases/(default)/documents/' + CONFIG.COL_ENVOIS + '/' + docId + '?' + mask;
  UrlFetchApp.fetch(url, {
    method: 'patch',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify({ fields: fields }),
    muteHttpExceptions: true,
  });
}

function incrementerEnvoye(token, campagneId) {
  // Lire la valeur actuelle puis incrémenter
  var url = 'https://firestore.googleapis.com/v1/projects/' + CONFIG.PROJECT_ID +
            '/databases/(default)/documents/' + CONFIG.COL_CAMPAGNES + '/' + campagneId;
  var resp = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true,
  });
  var doc  = JSON.parse(resp.getContentText());
  var actuel = doc.fields && doc.fields.envoye ? (Number(doc.fields.envoye.integerValue) || 0) : 0;

  majDoc(token, CONFIG.COL_CAMPAGNES, campagneId, { envoye: actuel + 1 });
}

function majDoc(token, col, docId, data) {
  var fields = buildFirestoreFields(data);
  var mask   = Object.keys(fields).map(function(k) { return 'updateMask.fieldPaths=' + k; }).join('&');
  var url = 'https://firestore.googleapis.com/v1/projects/' + CONFIG.PROJECT_ID +
            '/databases/(default)/documents/' + col + '/' + docId + '?' + mask;
  UrlFetchApp.fetch(url, {
    method: 'patch',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify({ fields: fields }),
    muteHttpExceptions: true,
  });
}

// ─── SÉRIALISATION FIRESTORE ────────────────────────────────────────────────────

function buildFirestoreFields(obj) {
  var fields = {};
  Object.keys(obj).forEach(function(k) {
    var v = obj[k];
    if (v === null || v === undefined) {
      fields[k] = { nullValue: null };
    } else if (typeof v === 'boolean') {
      fields[k] = { booleanValue: v };
    } else if (typeof v === 'number') {
      fields[k] = Number.isInteger(v) ? { integerValue: v } : { doubleValue: v };
    } else if (typeof v === 'string') {
      // Détecter les timestamps ISO
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
        fields[k] = { timestampValue: v };
      } else {
        fields[k] = { stringValue: v };
      }
    } else if (Array.isArray(v)) {
      fields[k] = { arrayValue: { values: v.map(function(i) {
        return typeof i === 'string' ? { stringValue: i } : { integerValue: i };
      }) } };
    } else if (typeof v === 'object') {
      fields[k] = { mapValue: { fields: buildFirestoreFields(v) } };
    }
  });
  return fields;
}

function parseFirestoreDoc(fields) {
  var obj = {};
  Object.keys(fields).forEach(function(k) {
    var f = fields[k];
    if (f.stringValue    !== undefined) obj[k] = f.stringValue;
    else if (f.integerValue  !== undefined) obj[k] = Number(f.integerValue);
    else if (f.doubleValue   !== undefined) obj[k] = f.doubleValue;
    else if (f.booleanValue  !== undefined) obj[k] = f.booleanValue;
    else if (f.nullValue     !== undefined) obj[k] = null;
    else if (f.timestampValue !== undefined) obj[k] = f.timestampValue;
    else if (f.arrayValue) {
      obj[k] = (f.arrayValue.values || []).map(function(v) {
        return v.stringValue || v.integerValue || null;
      });
    } else if (f.mapValue) {
      obj[k] = parseFirestoreDoc(f.mapValue.fields || {});
    }
  });
  return obj;
}

// ─── DIAGNOSTIC ────────────────────────────────────────────────────────────────
// Lance cette fonction EN PREMIER pour identifier ce qui ne fonctionne pas.
// Menu déroulant → sélectionner "diagnostiquer" → ▶ Exécuter
// Regarde ensuite les Journaux (Ctrl+Entrée)

function diagnostiquer() {
  Logger.log('══════════════════════════════════════');
  Logger.log('  DIAGNOSTIC — ' + new Date().toLocaleString('fr-FR'));
  Logger.log('══════════════════════════════════════');

  // ── ÉTAPE 1 : Firebase Auth ──
  Logger.log('\n[1/3] Test Firebase Auth (connexion anonyme)...');
  var authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInAnonymously?key=' + CONFIG.FIREBASE_API_KEY;
  var authResp = UrlFetchApp.fetch(authUrl, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ returnSecureToken: true }),
    muteHttpExceptions: true,
  });

  var authCode = authResp.getResponseCode();
  var authText = authResp.getContentText();
  Logger.log('  → HTTP ' + authCode);
  Logger.log('  → Réponse : ' + authText.substring(0, 250));

  var token = null;
  if (authCode === 200) {
    try {
      var authData = JSON.parse(authText);
      if (authData.idToken) {
        token = authData.idToken;
        Logger.log('  ✅ Token Firebase obtenu.');
      } else {
        Logger.log('  ❌ Erreur Firebase : ' + JSON.stringify(authData.error));
        Logger.log('\n  → SOLUTION : Allez sur console.firebase.google.com');
        Logger.log('    Authentication → Méthodes de connexion → Activez "Anonyme"');
      }
    } catch(e) {
      Logger.log('  ❌ Réponse non-JSON. Probablement une restriction sur la clé API.');
      Logger.log('\n  → SOLUTION : Allez sur console.cloud.google.com → APIs & Services → Identifiants');
      Logger.log('    Cliquez sur votre clé API → supprimez les restrictions HTTP referrer');
    }
  } else {
    Logger.log('  ❌ Firebase Auth inaccessible (HTTP ' + authCode + ').');
    Logger.log('\n  → SOLUTION A : Dans console.cloud.google.com → APIs & Services → Bibliothèque');
    Logger.log('    Cherchez "Identity Toolkit API" et activez-la.');
    Logger.log('\n  → SOLUTION B : La clé API a des restrictions. Supprimez-les ou créez une clé sans restriction.');
  }

  if (!token) {
    Logger.log('\n══ Diagnostic arrêté — Firebase Auth bloqué ══');
    return;
  }

  // ── ÉTAPE 2 : Firestore ──
  Logger.log('\n[2/3] Test Firestore (lecture collection campagnes_audio)...');
  var fsUrl = 'https://firestore.googleapis.com/v1/projects/' + CONFIG.PROJECT_ID +
              '/databases/(default)/documents/campagnes_audio?pageSize=2';
  var fsResp = UrlFetchApp.fetch(fsUrl, {
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true,
  });

  var fsCode = fsResp.getResponseCode();
  var fsText = fsResp.getContentText();
  Logger.log('  → HTTP ' + fsCode);
  Logger.log('  → Réponse : ' + fsText.substring(0, 250));

  if (fsCode === 200) {
    try {
      var fsData = JSON.parse(fsText);
      var nbDocs = (fsData.documents || []).length;
      Logger.log('  ✅ Firestore accessible. ' + nbDocs + ' campagne(s) trouvée(s).');
    } catch(e) {
      Logger.log('  ❌ Réponse Firestore non-JSON.');
    }
  } else {
    Logger.log('  ❌ Firestore inaccessible (HTTP ' + fsCode + ').');
    Logger.log('\n  → SOLUTION : Dans console.cloud.google.com → APIs & Services → Bibliothèque');
    Logger.log('    Cherchez "Cloud Firestore API" et activez-la.');
  }

  // ── ÉTAPE 3 : Gmail ──
  Logger.log('\n[3/3] Test Gmail (envoi email de test)...');
  try {
    GmailApp.sendEmail(
      CONFIG.FROM_EMAIL,
      '[TEST] Script campagnes audio — diagnostic OK — ' + new Date().toLocaleDateString('fr-FR'),
      'Bonjour,\n\nCe message confirme que le script peut envoyer des emails depuis votre compte Gmail.\n\nLe script est opérationnel.'
    );
    Logger.log('  ✅ Email de test envoyé à ' + CONFIG.FROM_EMAIL + ' — vérifiez votre boîte "Envoyés".');
  } catch(e) {
    Logger.log('  ❌ Gmail échoué : ' + e.toString());
    Logger.log('\n  → SOLUTION : Réexécutez et ré-autorisez les permissions Gmail.');
  }

  Logger.log('\n══════════════════════════════════════');
  Logger.log('  FIN DIAGNOSTIC');
  Logger.log('══════════════════════════════════════');
}

// ─── TEST MANUEL ───────────────────────────────────────────────────────────────
// Pour tester sans attendre 8h30 — sélectionner "testerScript" dans le menu déroulant

function testerScript() {
  lancerEnvoisDuJour();
}
