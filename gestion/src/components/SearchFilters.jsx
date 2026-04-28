import { TYPES, PRIORITIES, STATUSES } from '../constants';

export default function SearchFilters({ search, setSearch, filters, setFilters, clients }) {
  const hasFilter = filters.type || filters.priority || filters.status || filters.clientId;
  return (
    <div className="search-filters">
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input className="search-input" placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
      </div>
      <div className="filters">
        <select className="filter-select" value={filters.type} onChange={e => setFilters(f => ({...f, type: e.target.value}))}>
          <option value="">Tous types</option>
          {Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
        </select>
        <select className="filter-select" value={filters.priority} onChange={e => setFilters(f => ({...f, priority: e.target.value}))}>
          <option value="">Toutes priorités</option>
          {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select className="filter-select" value={filters.status} onChange={e => setFilters(f => ({...f, status: e.target.value}))}>
          <option value="">Tous statuts</option>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select className="filter-select" value={filters.clientId} onChange={e => setFilters(f => ({...f, clientId: e.target.value}))}>
          <option value="">Tous clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {hasFilter && <button className="filter-clear" onClick={() => setFilters({type:'',priority:'',status:'',clientId:''})}>Effacer</button>}
      </div>
    </div>
  );
}
