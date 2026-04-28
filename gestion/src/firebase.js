// ─── FIREBASE CONFIGURATION ───────────────────────────────────────────────────
// ÉTAPE 1 : Allez sur https://console.firebase.google.com
// ÉTAPE 2 : Créez un projet > Ajoutez une app Web > Copiez la config ci-dessous
// ÉTAPE 3 : Activez Firestore Database (mode test) et Authentication > Anonymous

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "VOTRE_API_KEY",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "VOTRE_PROJECT.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "VOTRE_PROJECT_ID",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "VOTRE_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| "VOTRE_SENDER_ID",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "VOTRE_APP_ID",
};

export const isConfigured = !firebaseConfig.apiKey.startsWith('VOTRE');

let app, db, auth;

if (isConfigured) {
  app  = initializeApp(firebaseConfig);
  db   = getFirestore(app);
  auth = getAuth(app);
}

export { db, auth };
export const signInAnon = () => signInAnonymously(auth);
export { onAuthStateChanged };
