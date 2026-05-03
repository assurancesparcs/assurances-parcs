import { useState, useEffect, useMemo, useRef } from 'react';
import { SINISTRE_STATUSES, SINISTRE_TYPES, SINISTRE_CHASSE_TYPES, MED_STATUSES } from '../constants';

const SECTIONS = [
  { key: 'clients',    icon: '👥', label: 'Clients',          view: 'clients',          color: '#a78bfa' },
  { key: 'contrats',   icon: '📄', label: 'Contrats',         view: 'contrats',         color: '#60a5fa' },
  { key: 'sinistres',  icon: '🛡️', label: 'Sinistres',        view: 'sinistres',        color: '#fb923c' },
  { key: 'chasse',     icon: '🏹', label: 'Sinistres Chasse', view: 'sinistres_chasse', color: '#34d399' },
  { key: 'med',        icon: '📬', label: 'MED',              view: 'med',              color: '#f87171' },
  { key: 'taches',     icon: '📋', label: 'Tâches',           view: 'liste',            color: '#9ca3c0' },
];

function highlight(text, query) {
  if (!text || !query) return text || '';
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: 'rgba(255,107,53,.35)', color: 'inherit', borderRadius: 2 }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function GlobalSearch({ clients, contracts, sinistres, sinistresChasse, medDossiers, items, onNavigate, onClose }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef();
  const listRef  = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const out = [];

    clients.forEach(c => {
      if (
        c.name?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      ) {
        out.push({
          section: 'clients', id: c.id,
          main: c.name, sub: c.company || c.email || '',
          view: 'clients', item: c,
        });
      }
    });

    contracts.forEach(c => {
      if (
        c.clientName?.toLowerCase().includes(q) ||
        c.numero?.toLowerCase().includes(q) ||
        c.type?.toLowerCase().includes(q)
      ) {
        out.push({
          section: 'contrats', id: c.id,
          main: c.clientName || '—',
          sub: [c.type, c.numero].filter(Boolean).join(' · '),
          badge: c.primePayee ? { label: 'Payé', color: '#34d399', bg: 'rgba(52,211,153,.15)' } : { label: 'Impayé', color: '#f87171', bg: 'rgba(248,113,113,.15)' },
          view: 'contrats', item: c,
        });
      }
    });

    sinistres.forEach(s => {
      if (
        s.clientName?.toLowerCase().includes(q) ||
        s.numero?.toLowerCase().includes(q) ||
        s.compagnie?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
      ) {
        const st = SINISTRE_STATUSES[s.status];
        const tp = SINISTRE_TYPES[s.type];
        out.push({
          section: 'sinistres', id: s.id,
          main: s.clientName || '—',
          sub: [tp?.label || s.type, s.numero ? '#' + s.numero : '', s.compagnie].filter(Boolean).join(' · '),
          badge: st ? { label: st.label, color: st.color, bg: st.bg } : null,
          view: 'sinistres', item: s,
        });
      }
    });

    sinistresChasse.forEach(s => {
      if (
        s.clientName?.toLowerCase().includes(q) ||
        s.numero?.toLowerCase().includes(q) ||
        s.compagnie?.toLowerCase().includes(q)
      ) {
        const st = SINISTRE_STATUSES[s.status];
        const tp = SINISTRE_CHASSE_TYPES[s.type];
        out.push({
          section: 'chasse', id: s.id,
          main: s.clientName || '—',
          sub: [tp?.label || s.type, s.numero ? '#' + s.numero : ''].filter(Boolean).join(' · '),
          badge: st ? { label: st.label, color: st.color, bg: st.bg } : null,
          view: 'sinistres_chasse', item: s,
        });
      }
    });

    medDossiers.forEach(d => {
      if (
        d.clientName?.toLowerCase().includes(q) ||
        d.numeroContrat?.toLowerCase().includes(q) ||
        d.typeContrat?.toLowerCase().includes(q) ||
        d.clientEmail?.toLowerCase().includes(q)
      ) {
        const st = MED_STATUSES[d.status];
        out.push({
          section: 'med', id: d.id,
          main: d.clientName || '—',
          sub: [d.typeContrat, d.numeroContrat ? 'n°' + d.numeroContrat : '', d.montantDu ? Number(d.montantDu).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €' : ''].filter(Boolean).join(' · '),
          badge: st ? { label: st.label, color: st.color, bg: st.bg } : null,
          view: 'med', item: d,
        });
      }
    });

    items.forEach(t => {
      if (
        t.title?.toLowerCase().includes(q) ||
        t.clientName?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      ) {
        out.push({
          section: 'taches', id: t.id,
          main: t.title || '—',
          sub: t.clientName || '',
          view: 'liste', item: t,
        });
      }
    });

    return out.slice(0, 40);
  }, [query, clients, contracts, sinistres, sinistresChasse, medDossiers, items]);

  // Keyboard navigation
  useEffect(() => {
    setSelected(0);
  }, [results]);

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && results[selected]) {
      onNavigate(results[selected].view);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selected}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  // Group results by section for display
  const grouped = useMemo(() => {
    const map = {};
    results.forEach((r, i) => {
      if (!map[r.section]) map[r.section] = [];
      map[r.section].push({ ...r, _idx: i });
    });
    return map;
  }, [results]);

  const noQuery = query.trim().length < 2;

  return (
    <div className="gsearch-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="gsearch-box">
        {/* Input */}
        <div className="gsearch-input-wrap">
          <span className="gsearch-icon">🔍</span>
          <input
            ref={inputRef}
            className="gsearch-input"
            placeholder="Rechercher un client, contrat, sinistre, dossier MED…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
          />
          {query && (
            <button className="gsearch-clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>

        {/* Results */}
        <div className="gsearch-results" ref={listRef}>
          {noQuery && (
            <div className="gsearch-hint">
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <div>Tapez au moins 2 caractères pour rechercher</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 8 }}>
                Recherche dans : clients · contrats · sinistres · chasse · MED · tâches
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
                ↑↓ naviguer · Entrée pour ouvrir · Échap pour fermer
              </div>
            </div>
          )}

          {!noQuery && results.length === 0 && (
            <div className="gsearch-hint">
              <div style={{ fontSize: 32, marginBottom: 8 }}>😶</div>
              <div>Aucun résultat pour <strong>"{query}"</strong></div>
            </div>
          )}

          {!noQuery && results.length > 0 && SECTIONS.map(sec => {
            const rows = grouped[sec.key];
            if (!rows?.length) return null;
            return (
              <div key={sec.key} className="gsearch-group">
                <div className="gsearch-group-title" style={{ color: sec.color }}>
                  {sec.icon} {sec.label} <span className="gsearch-group-count">{rows.length}</span>
                </div>
                {rows.map(r => (
                  <div
                    key={r.id}
                    data-idx={r._idx}
                    className={`gsearch-row ${r._idx === selected ? 'selected' : ''}`}
                    onClick={() => onNavigate(r.view)}
                    onMouseEnter={() => setSelected(r._idx)}
                  >
                    <div className="gsearch-row-icon" style={{ color: sec.color }}>{sec.icon}</div>
                    <div className="gsearch-row-content">
                      <div className="gsearch-row-main">{highlight(r.main, query)}</div>
                      {r.sub && <div className="gsearch-row-sub">{highlight(r.sub, query)}</div>}
                    </div>
                    {r.badge && (
                      <span className="gsearch-badge" style={{ background: r.badge.bg, color: r.badge.color }}>
                        {r.badge.label}
                      </span>
                    )}
                    <span className="gsearch-arrow">→</span>
                  </div>
                ))}
              </div>
            );
          })}

          {!noQuery && results.length > 0 && (
            <div className="gsearch-footer">
              {results.length} résultat{results.length > 1 ? 's' : ''} · ↑↓ naviguer · Entrée pour ouvrir
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
