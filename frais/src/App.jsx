import { useState, useEffect, useCallback } from 'react';
import { db, auth, isConfigured, signInAnon, onAuthStateChanged } from './firebase';
import {
  collection, query, where, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import NavBar from './components/NavBar';
import DashboardView from './components/DashboardView';
import KmView from './components/KmView';
import RepasView from './components/RepasView';

const DEFAULT_SETTINGS = { cv: 5, nom: '' };

function loadSettings() {
  try { return JSON.parse(localStorage.getItem('frais_settings')) || DEFAULT_SETTINGS; }
  catch { return DEFAULT_SETTINGS; }
}

export default function App() {
  const [user, setUser]       = useState(null);
  const [trips, setTrips]     = useState([]);
  const [repas, setRepas]     = useState([]);
  const [page, setPage]       = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(loadSettings);

  const saveSettings = useCallback((s) => {
    setSettings(s);
    localStorage.setItem('frais_settings', JSON.stringify(s));
  }, []);

  // ── Auth ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isConfigured) { setLoading(false); return; }
    return onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else signInAnon().catch(() => setLoading(false));
    });
  }, []);

  // ── Firestore listeners ───────────────────────────────────────────────
  useEffect(() => {
    if (!user || !isConfigured) { setLoading(false); return; }

    const kUnsub = onSnapshot(
      query(collection(db, 'frais_km'), where('userId', '==', user.uid)),
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => a.date.localeCompare(b.date));
        setTrips(data);
        setLoading(false);
      },
      () => setLoading(false)
    );

    const rUnsub = onSnapshot(
      query(collection(db, 'frais_repas'), where('userId', '==', user.uid)),
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => b.date.localeCompare(a.date));
        setRepas(data);
      }
    );

    return () => { kUnsub(); rUnsub(); };
  }, [user]);

  // ── CRUD — Kilométrage ────────────────────────────────────────────────
  const addTrip = useCallback(async (data) => {
    if (!user) return;
    await addDoc(collection(db, 'frais_km'), {
      ...data, userId: user.uid, createdAt: serverTimestamp(),
    });
  }, [user]);

  const updateTrip = useCallback(async (id, data) => {
    await updateDoc(doc(db, 'frais_km', id), data);
  }, []);

  const deleteTrip = useCallback(async (id) => {
    await deleteDoc(doc(db, 'frais_km', id));
  }, []);

  // ── CRUD — Repas ──────────────────────────────────────────────────────
  const addRepas = useCallback(async (data) => {
    if (!user) return;
    await addDoc(collection(db, 'frais_repas'), {
      ...data, userId: user.uid, createdAt: serverTimestamp(),
    });
  }, [user]);

  const updateRepas = useCallback(async (id, data) => {
    await updateDoc(doc(db, 'frais_repas', id), data);
  }, []);

  const deleteRepas = useCallback(async (id) => {
    await deleteDoc(doc(db, 'frais_repas', id));
  }, []);

  // ── Loading screen ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner" />
          <span>Chargement…</span>
        </div>
      </div>
    );
  }

  const shared = {
    trips, repas, settings, saveSettings,
    addTrip, updateTrip, deleteTrip,
    addRepas, updateRepas, deleteRepas,
  };

  return (
    <div className="app">
      {page === 'dashboard' && <DashboardView {...shared} />}
      {page === 'km'        && <KmView        {...shared} />}
      {page === 'repas'     && <RepasView      {...shared} />}
      <NavBar page={page} setPage={setPage} />
    </div>
  );
}
