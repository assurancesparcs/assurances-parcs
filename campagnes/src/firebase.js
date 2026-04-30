import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "AIzaSyBlWYj-tOLHL_lAoY2ibXpx7QF2m4gvRfY",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "gestion-assurances-parcs.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "gestion-assurances-parcs",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "gestion-assurances-parcs.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| "549084650030",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "1:549084650030:web:7905ea4d025d6f56e05dbf",
};

const app = initializeApp(firebaseConfig, 'campagnes');
export const db = getFirestore(app);
