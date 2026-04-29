import { useState, useEffect, useMemo } from 'react';
import { db, isConfigured } from './firebase';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp,
} from 'firebase/firestore';
import { TYPES, PRIORITIES, STATUSES, INACTIVITE_ALERTE_JOURS } from './constants';
import AlertBanner from './components/AlertBanner';
import NavBar from './components/NavBar';
import SearchFilters from './components/SearchFilters';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';
import ClientsView from './components/ClientsView';
import ContractsView from './components/ContractsView';
import SinistresView from './components/SinistresView';
import StatsView from './components/StatsView';
import TaskModal from './components/TaskModal';
import ClientModal from './components/ClientModal';
import ContractModal from './components/ContractModal';
import ContractImportModal from './components/ContractImportModal';
import SinistreModal from './components/SinistreModal';
import { LoadingScreen, UserNameScreen, ConfigScreen, PinScreen } from './components/Screens';

export default function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('unlocked') === '1');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName'));
  const [items, setItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [sinistres, setSinistres] = useState([]);
  const [view, setView] = useState('liste');
  const [taskModal, setTaskModal] = useState(null);
  const [clientModal, setClientModal] = useState(null);
  const [contractModal, setContractModal] = useState(null);
  const [importModal, setImportModal] = useState(false);
  const [sinistreModal, setSinistreModal] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', priority: '', status: '', clientId: '' });
  const [loading, setLoading] = useState(true);
  const [globalView, setGlobalView] = useState(false);

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return; }
    const u1 = onSnapshot(collection(db, 'items'),
      s => { setItems(s.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      e => { alert('Erreur Firestore items: ' + e.message); setLoading(false); });
    const u2 = onSnapshot(collection(db, 'clients'),
      s => setClients(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u3 = onSnapshot(collection(db, 'contrats'),
      s => setContracts(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u4 = onSnapshot(collection(db, 'sinistres'),
      s => setSinistres(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { u1(); u2(); u3(); u4(); };
  }, []);

  useEffect(() => { if (userName) localStorage.setItem('userName', userName); }, [userName]);

  const saveItem = async (data) => {
    const { id, ...rest } = data;
    const payload = { ...rest, updatedAt: serverTimestamp() };
    try {
      if (id) await updateDoc(doc(db, 'items', id), payload);
      else await addDoc(collection(db, 'items'), { ...payload, createdBy: userName, createdAt: serverTimestamp() });
    } catch (e) { alert('Erreur : ' + e.message); }
  };

  const deleteItem = async (id) => { if (confirm('Supprimer ?')) await deleteDoc(doc(db, 'items', id)); };

  const updateStatus = async (id, status) => {
    const payload = { status, updatedAt: serverTimestamp() };
    if (status === 'termine') payload.termineAt = serverTimestamp();
    await updateDoc(doc(db, 'items', id), payload);
  };

  const saveClient = async (data) => {
    const { id, ...rest } = data;
    const payload = { ...rest, updatedAt: serverTimestamp() };
    if (id) await updateDoc(doc(db, 'clients', id), payload);
    else await addDoc(collection(db, 'clients'), { ...payload, createdAt: serverTimestamp() });
  };
  const deleteClient = async (id) => { if (confirm('Supprimer ce client ?')) await deleteDoc(doc(db, 'clients', id)); };

  const saveContract = async (data) => {
    const { id, ...rest } = data;
    const payload = { ...rest, updatedAt: serverTimestamp() };
    try {
      if (id) await updateDoc(doc(db, 'contrats', id), payload);
      else await addDoc(collection(db, 'contrats'), { ...payload, createdBy: userName, createdAt: serverTimestamp() });
    } catch (e) { alert('Erreur : ' + e.message); }
  };
  const deleteContract = async (id) => { if (confirm('Supprimer ce contrat ?')) await deleteDoc(doc(db, 'contrats', id)); };
  const togglePaid = async (id, primePayee) => updateDoc(doc(db, 'contrats', id), { primePayee, updatedAt: serverTimestamp() });

  const saveSinistre = async (data) => {
    const { id, ...rest } = data;
    const payload = { ...rest, updatedAt: serverTimestamp() };
    try {
      if (id) await updateDoc(doc(db, 'sinistres', id), payload);
      else await addDoc(collection(db, 'sinistres'), { ...payload, createdBy: userName, createdAt: serverTimestamp() });
    } catch (e) { alert('Erreur : ' + e.message); }
  };

  const deleteSinistre = async (id) => {
    if (confirm('Supprimer ce sinistre ?')) await deleteDoc(doc(db, 'sinistres', id));
  };

  const updateSinistreStatus = async (id, status) => {
    await updateDoc(doc(db, 'sinistres', id), {
      status,
      lastActivityAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const importContracts = async (rows) => {
    for (const r of rows) {
      try {
        await addDoc(collection(db, 'contrats'), {
          ...r, primePayee: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        });
      } catch (e) { console.error(e); }
    }
  };

  const sinistresAlertCount = useMemo(() => {
    const activeStatuses = ['declare', 'en_instruction', 'attente_pieces', 'expertise'];
    return sinistres.filter(s => {
      if (!activeStatuses.includes(s.status)) return false;
      const ts = s.lastActivityAt || s.updatedAt;
      if (!ts) return false;
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return Math.floor((Date.now() - d.getTime()) / 86400000) >= INACTIVITE_ALERTE_JOURS;
    }).length;
  }, [sinistres]);

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
    if (filters.type && i.type !== filters.type) return false;
    if (filters.priority && i.priority !== filters.priority) return false;
    if (filters.status && i.status !== filters.status) return false;
    if (filters.clientId && i.clientId !== filters.clientId) return false;
    return true;
  }), [items, search, filters, globalView, userName]);

  if (!isConfigured) return <ConfigScreen />;
  if (!unlocked) return <PinScreen onUnlock={() => setUnlocked(true)} />;
  if (loading) return <LoadingScreen />;
  if (!userName) return <UserNameScreen onSelect={setUserName} />;

  return (
    <div className="app">
      <AlertBanner items={items} contracts={contracts} sinistres={sinistres} />
      <NavBar view={view} setView={setView} userName={userName}
        onAdd={() => setTaskModal({})} count={items.length}
        onChangeUser={() => { localStorage.removeItem('userName'); setUserName(null); }}
        sinistresAlertCount={sinistresAlertCount} />
      {(view === 'liste') && (
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
        {view === 'sinistres' && <SinistresView sinistres={sinistres} clients={clients} contracts={contracts}
          onAdd={() => setSinistreModal({})} onEdit={setSinistreModal}
          onDelete={deleteSinistre} onStatusChange={updateSinistreStatus} />}
        {view === 'stats' && <StatsView items={items} clients={clients} />}
      </main>
      {taskModal && <TaskModal item={taskModal} clients={clients} userName={userName}
        onSave={saveItem} onClose={() => setTaskModal(null)} />}
      {clientModal && <ClientModal client={clientModal}
        onSave={saveClient} onClose={() => setClientModal(null)} />}
      {contractModal && <ContractModal contract={contractModal} clients={clients}
        onSave={saveContract} onClose={() => setContractModal(null)} />}
      {importModal && <ContractImportModal clients={clients}
        onImport={importContracts} onClose={() => setImportModal(false)} />}
      {sinistreModal !== null && <SinistreModal sinistre={sinistreModal} clients={clients} contracts={contracts}
        userName={userName} onSave={saveSinistre} onClose={() => setSinistreModal(null)} />}
    </div>
  );
}
