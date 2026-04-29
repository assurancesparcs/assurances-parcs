import { useState, useEffect, useMemo } from 'react';
import { db, auth, isConfigured, signInAnon, onAuthStateChanged } from './firebase';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy,
} from 'firebase/firestore';
import { TYPES, PRIORITIES, STATUSES } from './constants';
import AlertBanner from './components/AlertBanner';
import NavBar from './components/NavBar';
import SearchFilters from './components/SearchFilters';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';
import ClientsView from './components/ClientsView';
import StatsView from './components/StatsView';
import TaskModal from './components/TaskModal';
import ClientModal from './components/ClientModal';
import { LoadingScreen, UserNameScreen, ConfigScreen, PinScreen } from './components/Screens';

export default function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('unlocked') === '1');
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(() => localStorage.getItem('userName'));
  const [items, setItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [view, setView] = useState('liste');
  const [taskModal, setTaskModal] = useState(null);
  const [clientModal, setClientModal] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', priority: '', status: '', clientId: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return; }
    const u1 = onSnapshot(query(collection(db, 'items'), orderBy('createdAt', 'desc')),
      s => { setItems(s.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      () => setLoading(false));
    const u2 = onSnapshot(query(collection(db, 'clients'), orderBy('name')),
      s => setClients(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { u1(); u2(); };
  }, []);

  useEffect(() => { if (userName) localStorage.setItem('userName', userName); }, [userName]);

  const saveItem = async (data) => {
    const { id, ...rest } = data;
    const payload = { ...rest, updatedAt: serverTimestamp() };
    try {
      if (id) await updateDoc(doc(db, 'items', id), payload);
      else await addDoc(collection(db, 'items'), { ...payload, createdBy: userName, createdAt: serverTimestamp() });
    } catch (e) {
      alert('Erreur sauvegarde : ' + e.message);
    }
  };
  const deleteItem = async (id) => { if (confirm('Supprimer ?')) await deleteDoc(doc(db, 'items', id)); };
  const updateStatus = async (id, status) => updateDoc(doc(db, 'items', id), { status, updatedAt: serverTimestamp() });
  const saveClient = async (data) => {
    const { id, ...rest } = data;
    const payload = { ...rest, updatedAt: serverTimestamp() };
    if (id) await updateDoc(doc(db, 'clients', id), payload);
    else await addDoc(collection(db, 'clients'), { ...payload, createdAt: serverTimestamp() });
  };
  const deleteClient = async (id) => { if (confirm('Supprimer ce client ?')) await deleteDoc(doc(db, 'clients', id)); };

  const filtered = useMemo(() => items.filter(i => {
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
  }), [items, search, filters]);

  if (!isConfigured) return <ConfigScreen />;
  if (!unlocked) return <PinScreen onUnlock={() => setUnlocked(true)} />;
  if (loading) return <LoadingScreen />;
  if (!userName) return <UserNameScreen onSelect={setUserName} />;

  return (
    <div className="app">
      <AlertBanner items={items} />
      <NavBar view={view} setView={setView} userName={userName}
        onAdd={() => setTaskModal({})} count={items.length} />
      {(view === 'liste') && (
        <SearchFilters search={search} setSearch={setSearch}
          filters={filters} setFilters={setFilters} clients={clients} />
      )}
      <main className="main-content">
        {view === 'liste' && <ListView items={filtered} onEdit={setTaskModal}
          onDelete={deleteItem} onStatusChange={updateStatus} onAdd={() => setTaskModal({})} />}
        {view === 'calendrier' && <CalendarView items={items} onEdit={setTaskModal} />}
        {view === 'clients' && <ClientsView clients={clients} items={items}
          onAddClient={() => setClientModal({})} onEditClient={setClientModal}
          onDeleteClient={deleteClient} />}
        {view === 'stats' && <StatsView items={items} clients={clients} />}
      </main>
      {taskModal && <TaskModal item={taskModal} clients={clients}
        onSave={saveItem} onClose={() => setTaskModal(null)} />}
      {clientModal && <ClientModal client={clientModal}
        onSave={saveClient} onClose={() => setClientModal(null)} />}
    </div>
  );
}
