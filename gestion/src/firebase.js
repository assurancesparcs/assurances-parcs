// ─── FIREBASE CONFIGURATION ───────────────────────────────────────────────────
// ÉTAPE 1 : Allez sur https://console.firebase.google.com
// ÉTAPE 2 : Créez un projet > Ajoutez une app Web > Copiez la config ci-dessous
// ÉTAPE 3 : Activez Firestore Database (mode test) et Authentication > Anonymous

import { initializeApp } from 'firebase/app';
import {
  initializeFirestore, persistentLocalCache, persistentMultipleTabManager,
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "AIzaSyBlWYj-tOLHL_lAoY2ibXpx7QF2m4gvRfY",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "gestion-assurances-parcs.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "gestion-assurances-parcs",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "gestion-assurances-parcs.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| "549084650030",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "1:549084650030:web:7905ea4d025d6f56e05dbf",
};

export const isConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app, db, auth;

if (isConfigured) {
  app  = initializeApp(firebaseConfig);
  db   = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  auth = getAuth(app);
  // Connexion anonyme déclenchée immédiatement au démarrage
  signInAnonymously(auth).catch(() => {});
}

export { db, auth };
export const signInAnon = () => signInAnonymously(auth);
export { onAuthStateChanged };
