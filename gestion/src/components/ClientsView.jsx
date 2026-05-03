import { useState, useMemo } from 'react';

export default function ClientsView({ clients, items, onAddClient, onEditClient, onDeleteClient, onView360, onImport }) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => clients.filter(c => !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  ), [clients, search]);

  const stats = (id) => {
    const its = items.filter(i => i.clientId === id);
    return {
      total: its.length,
      pending: its.filter(i => i.status !== 'termine').length,
      urgent: its.filter(i => i.priority === 'urgent' && i.status !== 'termine').length,
    };
  };

  return (
    <div className="clients-view">
      <div className="clients-header">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Rechercher un client…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-secondary" onClick={onImport}>📥 Import CSV</button>
        <button className="btn-primary" onClick={onAddClient}>+ Nouveau client</button>
      </div>
      {!filtered.length ? (
        <div className="empty-state">
          <div style={{ fontSize: 64 }}>👥</div>
          <h3>Aucun client</h3>
          <p>Ajoutez vos clients pour organiser vos RDV et suivis.</p>
          <button className="btn-primary" onClick={onAddClient}>+ Ajouter un client</button>
        </div>
      ) : (
        <div className="clients-grid">
          {filtered.map(client => {
            const s = stats(client.id);
            return (
              <div key={client.id} className="client-card" onClick={() => onEditClient(client)}>
                <div className="client-avatar">{client.name?.[0]?.toUpperCase() || '?'}</div>
                <div className="client-info">
                  <div className="client-name">{client.name}</div>
                  {client.company && <div className="client-company">🏢 {client.company}</div>}
                  {client.email && <div className="client-contact">📧 {client.email}</div>}
                  {client.phone && <div className="client-contact">📞 {client.phone}</div>}
                </div>
                <div className="client-stats">
                  <div className="client-stat"><div className="stat-value">{s.total}</div><div className="stat-label">total</div></div>
                  <div className="client-stat"><div className="stat-value" style={{ color: '#fbbf24' }}>{s.pending}</div><div className="stat-label">actifs</div></div>
                  {s.urgent > 0 && <div className="client-stat"><div className="stat-value" style={{ color: '#f87171' }}>{s.urgent}</div><div className="stat-label">urgent</div></div>}
                </div>
                <div className="client-actions" onClick={e => e.stopPropagation()}>
                  <button className="btn-icon" title="Vue 360°" onClick={() => onView360(client)}>👁️</button>
                  <button className="btn-icon delete" onClick={() => onDeleteClient(client.id)}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
