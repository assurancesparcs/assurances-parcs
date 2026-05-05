import { useState, useEffect, useMemo } from 'react';
import { db, isConfigured } from './firebase';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp,
} from 'firebase/firestore';
import { TYPES, PRIORITIES, STATUSES, INACTIVITE_ALERTE_JOURS, joursDepuisRelance, daysSince, CONTRACT_TYPES_PARCS } from './constants';
import AlertBanner from './components/AlertBanner';
import NavBar from './components/NavBar';
import SearchFilters from './components/SearchFilters';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';
import ClientsView from './components/ClientsView';
import ContractsView from './components/ContractsView';
import SinistresView from './components/SinistresView';
import SinistresDashboard from './components/SinistresDashboard';
import StatsView from './components/StatsView';
import TaskModal from './components/TaskModal';
import ClientModal from './components/ClientModal';
import ContractModal from './components/ContractModal';
import ContractImportModal from './components/ContractImportModal';
import SinistreModal from './components/SinistreModal';
import RelanceModal from './components/RelanceModal';
import { LoadingScreen, UserNameScreen, ConfigScreen, PinScreen } from './components/Screens';

const ACTIVE_SIN = ['declare', 'en_instruction', 'attente_pieces', 'expertise'];

export default function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('unlocked') === '1');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName'));
  const [module, setModule]             = useState(() => localStorage.getItem('module') || 'audio');
  const [items, setItems]               = useState([]);
  const [clients, setClients]           = useState([]);
  const [contracts, setContracts]       = useState([]);
  const [sinistres, setSinistres]       = useState([]);
  const [sinistresChasse, setSinistresChasse] = useState([]);
  const [view, setView]                 = useState('liste');
  const [taskModal, setTaskModal]       = useState(null);
  const [clientModal, setClientModal]   = useState(null);
  const [contractModal, setContractModal] = useState(null);
  const [importModal, setImportModal]   = useState(false);
  const [sinistreModal, setSinistreModal] = useState(null);
  const [sinistreMode, setSinistreMode] = useState('standard');
  const [relanceModal, setRelanceModal] = useState(null);
  const [relanceCollection, setRelanceCollection] = useState('sinistres');
  const [search, setSearch]             = useState('');
  const [filters, setFilters]           = useState({ type: '', priority: '', status: '', clientId: '' });
  const [loading, setLoading]           = useState(true);
  const [globalView, setGlobalView]     = useState(false);

  const COLS = useMemo(() => module === 'audio'
    ? { items: 'items', clients: 'clients', contrats: 'contrats', sinistres: 'sinistres', sinistresChasse: 'sinistresChasse' }
    : { items: 'items_parcs', clients: 'clients_parcs', contrats: 'contrats_parcs', sinistres: 'sinistres_parcs', sinistresChasse: null },
    [module]);

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return; }
    setLoading(true);
    const u1 = onSnapshot(collection(db, COLS.items),
      s => { setItems(s.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      e => { alert('Erreur Firestore items: ' + e.message); setLoading(false); });
    const u2 = onSnapshot(collection(db, COLS.clients),
      s => setClients(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u3 = onSnapshot(collection(db, COLS.contrats),
      s => setContracts(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u4 = onSnapshot(collection(db, COLS.sinistres),
      s => setSinistres(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubs = [u1, u2, u3, u4];
    if (COLS.sinistresChasse) {
      const u5 = onSnapshot(collection(db, COLS.sinistresChasse),
        s => setSinistresChasse(s.docs.map(d => ({ id: d.id, ...d.data() }))));
      unsubs.push(u5);
    } else {
      setSinistresChasse([]);
    }
    return () => unsubs.forEach(u => u());
  }, [COLS]);

  useEffect(() => { if (userName) localStorage.setItem('userName', userName); }, [userName]);
  useEffect(() => { localStorage.setItem('module', module); }, [module]);

  // ─── Items handlers ────────────────────────────────────────────────────────
  const saveItem = async (data) => {
    const { id, ...rest } = data;
    const payload = { ...rest, updatedAt: serverTimestamp() };
    try {
      if (id) await updateDoc(doc(db, COLS.items, id), payload);
      else await addDoc(collection(db, COLS.items), { ...payload, createdBy: userName, createdAt: serverTimestamp() });
    } catch (e) { alert('Erreur : ' + e.message); }
  };
  const deleteItem   = async (id) => { if (confirm('Supprimer ?')) await deleteDoc(doc(db, COLS.items, id)); };
  const updateStatus = async (id, status) => {
    const payload = { status, updatedAt: serverTimestamp() };
    if (status === 'termine') payload.termineAt = serverTimestamp();
    await updateDoc(doc(db, COLS.items, id), payload);
  };

  // ─── Clients handlers ──────────────────────────────────────────────────────
  const saveClient   = async (data) => {
    const { id, ...rest } = data;
    const payload = { ...rest, updatedAt: serverTimestamp() };
    if (id) await updateDoc(doc(db, COLS.clients, id), payload);
    else await addDoc(collection(db, COLS.clients), { ...payload, createdAt: serverTimestamp() });
  };
  const deleteClient = async (id) => { if (confirm('Supprimer ce client ?')) await deleteDoc(doc(db, COLS.clients, id)); };

  // ─── Contracts handlers ────────────────────────────────────────────────────
  const saveContract = async (data) => {
    const { id, ...rest } = data;
    const payload = { ...rest, updatedAt: serverTimestamp() };
    try {
      if (id) await updateDoc(doc(db, COLS.contrats, id), payload);
      else await addDoc(collection(db, COLS.contrats), { ...payload, createdBy: userName, createdAt: serverTimestamp() });
    } catch (e) { alert('Erreur : ' + e.message); }
  };
  const deleteContract = async (id) => { if (confirm('Supprimer ce contrat ?')) await deleteDoc(doc(db, COLS.contrats, id)); };
  const togglePaid     = async (id, primePayee) => updateDoc(doc(db, COLS.contrats, id), { primePayee, updatedAt: serverTimestamp() });
  const importContracts = async (rows) => {
    for (const r of rows) {
      try { await addDoc(collection(db, COLS.contrats), { ...r, primePayee: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); }
      catch (e) { console.error(e); }
    }
  };

  // ─── Sinistres handlers (réutilisé pour standard + chasse) ─────────────────
  const saveSinistre = async (data, colName = 'sinistres') => {
    const { id, ...rest } = data;
    const payload = { ...rest, updatedAt: serverTimestamp() };
    try {
      if (id) await updateDoc(doc(db, colName, id), payload);
      else await addDoc(collection(db, colName), { ...payload, createdBy: userName, createdAt: serverTimestamp() });
    } catch (e) { alert('Erreur : ' + e.message); }
  };
  const deleteSinistre = async (id, colName = 'sinistres') => {
    if (confirm('Supprimer ce sinistre ?')) await deleteDoc(doc(db, colName, id));
  };
  const updateSinistreStatus = async (id, status, colName = 'sinistres') => {
    await updateDoc(doc(db, colName, id), { status, lastActivityAt: serverTimestamp(), updatedAt: serverTimestamp() });
  };

  // ─── Relance handler ───────────────────────────────────────────────────────
  const saveRelance = async (sinistreId, updateData, colName = 'sinistres') => {
    const payload = { ...updateData, updatedAt: serverTimestamp() };
    await updateDoc(doc(db, colName, sinistreId), payload);
  };

  const openRelance = (sinistre, colName = 'sinistres') => {
    setRelanceCollection(colName);
    setRelanceModal(sinistre);
  };

  // ─── Computed badges ───────────────────────────────────────────────────────
  const sinistresAlertCount = useMemo(() =>
    sinistres.filter(s => ACTIVE_SIN.includes(s.status) &&
      daysSince(s.lastActivityAt || s.updatedAt) >= INACTIVITE_ALERTE_JOURS).length,
    [sinistres]);

  const sinistresChassseAlertCount = useMemo(() =>
    sinistresChasse.filter(s => ACTIVE_SIN.includes(s.status) &&
      daysSince(s.lastActivityAt || s.updatedAt) >= INACTIVITE_ALERTE_JOURS).length,
    [sinistresChasse]);

  const sinistresRelanceCount = useMemo(() => {
    const all = [...sinistres, ...sinistresChasse];
    return all.filter(s => {
      if (!ACTIVE_SIN.includes(s.status)) return false;
      const jc = joursDepuisRelance(s, 'client');
      const jp = joursDepuisRelance(s, 'compagnie');
      return (jc !== null && jc >= 15) || (jp !== null && jp >= 15);
    }).length;
  }, [sinistres, sinistresChasse]);

  // ─── Filtered items ────────────────────────────────────────────────────────
  const filtered = useMemo(() => items.filter(i => {
    if (!globalView) {
      const mine = i.assignedTo ? i.assignedTo === userName : i.createdBy === userName;
      if (!mine) return false;
    }
    if (search) {
      const s = search.toLowerCase();
      if (!i.title?.toLowerCase().includes(s) && !i.description?.toLowerCase().includes(s) &&
          !i.clientName?.toLowerCase().includes(s)) return false;
    }
    if (filters.type     && i.type     !== filters.type)     return false;
    if (filters.priority && i.priority !== filters.priority) return false;
    if (filters.status   && i.status   !== filters.status)   return false;
    if (filters.clientId && i.clientId !== filters.clientId) return false;
    return true;
  }), [items, search, filters, globalView, userName]);

  if (!isConfigured) return <ConfigScreen />;
  if (!unlocked)     return <PinScreen onUnlock={() => setUnlocked(true)} />;
  if (loading)       return <LoadingScreen />;
  if (!userName)     return <UserNameScreen onSelect={setUserName} />;

  const currentSinistreCol = sinistreMode === 'chasse' ? 'sinistresChasse' : 'sinistres';
  const currentSinistres   = sinistreMode === 'chasse' ? sinistresChasse : sinistres;

  return (
    <div className="app">
      <AlertBanner items={items} contracts={contracts}
        sinistres={sinistres} sinistresChasse={sinistresChasse} />
      <NavBar view={view} setView={setView} userName={userName}
        onAdd={() => setTaskModal({})} count={items.length}
        onChangeUser={() => { localStorage.removeItem('userName'); setUserName(null); }}
        sinistresAlertCount={sinistresAlertCount}
        sinistresChassseAlertCount={sinistresChassseAlertCount}
        sinistresRelanceCount={sinistresRelanceCount}
        module={module} setModule={m => { setModule(m); setView('liste'); }} />
      {view === 'liste' && (
        <SearchFilters search={search} setSearch={setSearch}
          filters={filters} setFilters={setFilters} clients={clients} />
      )}
      <main className="main-content">
        {view === 'liste' && <ListView items={filtered} onEdit={setTaskModal}
          onDelete={deleteItem} onStatusChange={updateStatus} onAdd={() => setTaskModal({})}
          userName={userName} globalView={globalView} setGlobalView={setGlobalView} />}
        {view === 'calendrier' && <CalendarView items={items} onEdit={setTaskModal} userName={userName} />}
        {view === 'clients' && <ClientsView clients={clients} items={items}
          onAddClient={() => setClientModal({})} onEditClient={setClientModal}
          onDeleteClient={deleteClient} />}
        {view === 'contrats' && <ContractsView contracts={contracts} clients={clients}
          onAdd={() => setContractModal({})} onEdit={setContractModal}
          onDelete={deleteContract} onTogglePaid={togglePaid} onImport={() => setImportModal(true)} />}
        {view === 'sinistres' && (
          <SinistresView sinistres={sinistres} clients={clients} contracts={contracts}
            mode="standard"
            onAdd={() => { setSinistreMode('standard'); setSinistreModal({}); }}
            onEdit={s  => { setSinistreMode('standard'); setSinistreModal(s); }}
            onDelete={id => deleteSinistre(id, COLS.sinistres)}
            onStatusChange={(id, st) => updateSinistreStatus(id, st, COLS.sinistres)}
            onRelance={s => openRelance(s, COLS.sinistres)} />
        )}
        {view === 'sinistres_chasse' && module === 'audio' && (
          <SinistresView sinistres={sinistresChasse} clients={clients} contracts={contracts}
            mode="chasse"
            onAdd={() => { setSinistreMode('chasse'); setSinistreModal({}); }}
            onEdit={s  => { setSinistreMode('chasse'); setSinistreModal(s); }}
            onDelete={id => deleteSinistre(id, 'sinistresChasse')}
            onStatusChange={(id, st) => updateSinistreStatus(id, st, 'sinistresChasse')}
            onRelance={s => openRelance(s, 'sinistresChasse')} />
        )}
        {view === 'dashboard_sin' && (
          <SinistresDashboard
            sinistres={sinistres}
            sinistresChasse={module === 'audio' ? sinistresChasse : []}
            onRelance={(s, col) => openRelance(s, col)} />
        )}
        {view === 'stats' && <StatsView items={items} clients={clients} sinistres={sinistres} sinistresChasse={sinistresChasse} />}
      </main>

      {taskModal     && <TaskModal item={taskModal} clients={clients} userName={userName}
        onSave={saveItem} onClose={() => setTaskModal(null)} />}
      {clientModal   && <ClientModal client={clientModal}
        onSave={saveClient} onClose={() => setClientModal(null)} />}
      {contractModal && <ContractModal contract={contractModal} clients={clients}
        module={module}
        onSave={saveContract} onClose={() => setContractModal(null)} />}
      {importModal   && <ContractImportModal clients={clients}
        onImport={importContracts} onClose={() => setImportModal(false)} />}
      {sinistreModal !== null && <SinistreModal
        sinistre={sinistreModal} clients={clients} contracts={contracts}
        userName={userName} mode={sinistreMode}
        onSave={data => saveSinistre(data, currentSinistreCol)}
        onClose={() => setSinistreModal(null)} />}
      {relanceModal !== null && <RelanceModal
        sinistre={relanceModal}
        mode={relanceCollection === 'sinistresChasse' ? 'chasse' : 'standard'}
        onSave={(id, upd) => saveRelance(id, upd, relanceCollection)}
        onClose={() => setRelanceModal(null)} />}
    </div>
  );
}
