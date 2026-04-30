import { useState, useEffect } from 'react';
import { db } from './firebase.js';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp,
} from 'firebase/firestore';

import Navbar          from './components/Navbar.jsx';
import Dashboard       from './components/Dashboard.jsx';
import CampagnesList   from './components/CampagnesList.jsx';
import CampagneEditor  from './components/CampagneEditor.jsx';
import TemplateLibrary from './components/TemplateLibrary.jsx';
import ProspectsView   from './components/ProspectsView.jsx';
import PlanifView      from './components/PlanifView.jsx';
import SuiviView       from './components/SuiviView.jsx';

// ─── COLLECTIONS INDÉPENDANTES ─────────────────────────────────────────────────
const COL_CAMPAGNES = 'campagnes_audio';
const COL_PROSPECTS = 'prospects_audio';
const COL_ENVOIS    = 'envois_audio';

const MOT_DE_PASSE = 'Cabinetpl';

function LoginScreen({ onLogin }) {
  const [input, setInput] = useState('');
  const [erreur, setErreur] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === MOT_DE_PASSE) {
      sessionStorage.setItem('cpl_auth', '1');
      onLogin();
    } else {
      setErreur(true);
      setInput('');
      setTimeout(() => setErreur(false), 2000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '40px 48px', display: 'flex',
        flexDirection: 'column', alignItems: 'center', gap: 20, minWidth: 320,
      }}>
        <div style={{ fontSize: 48 }}>🎧</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Campagnes Emailing</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Cabinet Poncey Lebas</div>
        <input
          type="password"
          placeholder="Mot de passe"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 8,
            border: `1.5px solid ${erreur ? 'var(--red,#ef4444)' : 'var(--border)'}`,
            background: 'var(--bg)', color: 'var(--text)', fontSize: 15,
            outline: 'none', transition: 'border .2s',
          }}
        />
        {erreur && (
          <div style={{ color: 'var(--red,#ef4444)', fontSize: 13, marginTop: -10 }}>
            Mot de passe incorrect
          </div>
        )}
        <button type="submit" style={{
          width: '100%', padding: '10px 0', borderRadius: 8,
          background: 'var(--orange)', color: '#fff', fontWeight: 700,
          fontSize: 15, border: 'none', cursor: 'pointer',
        }}>
          Accéder
        </button>
      </form>
    </div>
  );
}

export default function App() {
  const [auth, setAuth]           = useState(sessionStorage.getItem('cpl_auth') === '1');
  const [view, setView]           = useState('dashboard');
  const [campagnes, setCampagnes] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [envois, setEnvois]       = useState([]);
  const [loading, setLoading]     = useState(true);

  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />;

  const [editorData, setEditorData] = useState(null);
  const [editorFrom, setEditorFrom] = useState('campagnes');

  // ─── Firestore listeners ───────────────────────────────────────────────────
  useEffect(() => {
    const u1 = onSnapshot(collection(db, COL_CAMPAGNES),
      s => { setCampagnes(s.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      e => { console.error(e); setLoading(false); });
    const u2 = onSnapshot(collection(db, COL_PROSPECTS),
      s => setProspects(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u3 = onSnapshot(collection(db, COL_ENVOIS),
      s => setEnvois(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { u1(); u2(); u3(); };
  }, []);

  // ─── Campagnes CRUD ────────────────────────────────────────────────────────
  const saveCampagne = async (data) => {
    const { id, ...rest } = data;
    const payload = { ...rest, updatedAt: serverTimestamp() };
    try {
      if (id) await updateDoc(doc(db, COL_CAMPAGNES, id), payload);
      else    await addDoc(collection(db, COL_CAMPAGNES), { ...payload, createdAt: serverTimestamp() });
    } catch (e) { alert('Erreur : ' + e.message); }
  };

  const deleteCampagne = async (id) => {
    if (!window.confirm('Supprimer cette campagne ?')) return;
    await deleteDoc(doc(db, COL_CAMPAGNES, id));
  };

  const duplicateCampagne = async (c) => {
    const { id, createdAt, updatedAt, envoye, ...rest } = c;
    await addDoc(collection(db, COL_CAMPAGNES), {
      ...rest, nom: `${rest.nom} (copie)`,
      statut: 'brouillon', envoye: 0,
      createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
  };

  const changeStatut = async (id, statut) => {
    await updateDoc(doc(db, COL_CAMPAGNES, id), { statut, updatedAt: serverTimestamp() });
  };

  // ─── Prospects CRUD ────────────────────────────────────────────────────────
  const addProspect = async (data) => {
    const { id, ...rest } = data;
    await addDoc(collection(db, COL_PROSPECTS), { ...rest, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  };

  const editProspect = async (data) => {
    const { id, ...rest } = data;
    await updateDoc(doc(db, COL_PROSPECTS, id), { ...rest, updatedAt: serverTimestamp() });
  };

  const deleteProspect = async (id) => {
    if (!window.confirm('Supprimer ce contact ?')) return;
    await deleteDoc(doc(db, COL_PROSPECTS, id));
  };

  // ─── Envois — actions manuelles ────────────────────────────────────────────
  const marquerRepondu = async (id) => {
    await updateDoc(doc(db, COL_ENVOIS, id), {
      statut: 'repondu',
      reponduAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const marquerTermine = async (id) => {
    await updateDoc(doc(db, COL_ENVOIS, id), {
      statut: 'termine',
      updatedAt: serverTimestamp(),
    });
  };

  // ─── Editor navigation ─────────────────────────────────────────────────────
  const openNew  = (type, from = 'campagnes') => { setEditorData(type ? { type } : {}); setEditorFrom(from); };
  const openEdit = (campagne, from = 'campagnes') => { setEditorData(campagne); setEditorFrom(from); };
  const closeEditor = () => setEditorData(null);

  const handleSaveCampagne = async (data) => {
    await saveCampagne(data);
    closeEditor();
    setView(editorFrom === 'planif' ? 'planif' : 'campagnes');
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column', gap: 16, background: 'var(--bg)',
      }}>
        <div style={{ fontSize: 56 }}>🎧</div>
        <div style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 600 }}>Chargement…</div>
        <div style={{ width: 200, height: 4, background: 'var(--bg-card)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--orange)', borderRadius: 2, animation: 'lb 1.4s ease infinite' }} />
        </div>
        <style>{`@keyframes lb{0%{width:0;margin-left:0}50%{width:60%;margin-left:20%}100%{width:0;margin-left:100%}}`}</style>
      </div>
    );
  }

  // ─── Editor mode (full page) ───────────────────────────────────────────────
  if (editorData !== null) {
    return (
      <div className="app">
        <Navbar view={view} setView={v => { closeEditor(); setView(v); }}
          campagnes={campagnes} prospects={prospects} envois={envois} />
        <main className="main-content">
          <CampagneEditor
            campagne={editorData} prospects={prospects}
            onSave={handleSaveCampagne} onCancel={closeEditor}
          />
        </main>
      </div>
    );
  }

  // ─── Main views ────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <Navbar view={view} setView={setView}
        campagnes={campagnes} prospects={prospects} envois={envois} />

      <main className="main-content">

        {view === 'dashboard' && (
          <Dashboard
            campagnes={campagnes} prospects={prospects}
            onViewCampagnes={() => setView('campagnes')}
            onNewCampagne={(type) => openNew(type, 'dashboard')}
            onViewPlanif={() => setView('planif')}
          />
        )}

        {view === 'campagnes' && (
          <div>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <div className="section-title">📧 Campagnes</div>
            </div>
            <CampagnesList
              campagnes={campagnes} prospects={prospects}
              onEdit={(c) => openEdit(c, 'campagnes')}
              onDelete={deleteCampagne} onDuplicate={duplicateCampagne}
              onChangeStatut={changeStatut}
              onNew={() => openNew(null, 'campagnes')}
            />
          </div>
        )}

        {view === 'templates' && (
          <TemplateLibrary onCreateCampagne={(type) => openNew(type, 'templates')} />
        )}

        {view === 'prospects' && (
          <div>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <div className="section-title">👥 Contacts & Prospects</div>
            </div>
            <ProspectsView
              prospects={prospects}
              onAdd={addProspect} onEdit={editProspect} onDelete={deleteProspect}
            />
          </div>
        )}

        {view === 'planif' && (
          <PlanifView
            campagnes={campagnes} prospects={prospects}
            onEdit={(c) => openEdit(c, 'planif')}
            onNew={() => openNew(null, 'planif')}
          />
        )}

        {view === 'suivi' && (
          <div>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <div className="section-title">📬 Suivi des envois & relances</div>
              <div className="info-box blue" style={{ fontSize: 12 }}>
                Les envois sont créés automatiquement par le script Google Apps Script.
                Cliquez ✅ pour marquer une réponse reçue — le script stoppera les relances.
              </div>
            </div>
            <SuiviView
              envois={envois} campagnes={campagnes} prospects={prospects}
              onMarquerRepondu={marquerRepondu}
              onMarquerTermine={marquerTermine}
            />
          </div>
        )}

      </main>
    </div>
  );
}
