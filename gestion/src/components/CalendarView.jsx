import { useState } from 'react';
import { TYPES, PRIORITIES, STATUSES, MONTHS, DAYS, sameDay, today, fmtDate } from '../constants';

function fmtDayFull(date) {
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function fmtTimeRange(item) {
  if (!item.time) return null;
  return item.timeFin ? `${item.time} – ${item.timeFin}` : item.time;
}

function DayPanel({ date, items, onEdit, onClose }) {
  const pr = (item) => PRIORITIES[item.priority] || PRIORITIES.normal;
  const st = (item) => STATUSES[item.status] || STATUSES.a_faire;
  const tp = (item) => TYPES[item.type] || TYPES.tache;

  const sorted = [...items].sort((a, b) => {
    const ta = a.time || '99:99', tb = b.time || '99:99';
    return ta.localeCompare(tb);
  });

  return (
    <div className="cal-day-panel">
      <div className="cal-day-panel-header">
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'capitalize' }}>{fmtDayFull(date)}</div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>
            {items.length} événement{items.length > 1 ? 's' : ''}
          </div>
        </div>
        <button className="modal-close" onClick={onClose} title="Fermer">✕</button>
      </div>

      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-dim)', fontSize: 13 }}>
          Aucun élément ce jour.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map(item => {
            const type = tp(item);
            const priority = pr(item);
            const status = st(item);
            const timeRange = fmtTimeRange(item);
            return (
              <div key={item.id} className="cal-day-item"
                style={{ borderLeft: `3px solid ${priority.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                      <span style={{ fontSize: 13 }}>{type.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{item.title}</span>
                    </div>
                    {timeRange && (
                      <div style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 700, marginBottom: 3 }}>
                        🕐 {timeRange}
                      </div>
                    )}
                    {item.clientName && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>
                        👥 {item.clientName}
                      </div>
                    )}
                    {item.description && (
                      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4, lineHeight: 1.4 }}>
                        {item.description}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10,
                        background: priority.bg, color: priority.color, fontWeight: 700 }}>
                        {priority.label}
                      </span>
                      <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10,
                        background: status.bg, color: status.color, fontWeight: 700 }}>
                        {status.label}
                      </span>
                      {item.assignedTo && (
                        <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10,
                          background: 'rgba(167,139,250,.15)', color: '#a78bfa', fontWeight: 700 }}>
                          👤 {item.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="btn-secondary" style={{ fontSize: 11, padding: '4px 10px', flexShrink: 0 }}
                    onClick={() => onEdit(item)}>
                    ✏️ Modifier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CalendarView({ items, onEdit, userName }) {
  const [cal, setCal] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const year = cal.getFullYear(), month = cal.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let start = firstDay.getDay() - 1; if (start < 0) start = 6;

  const cells = [];
  for (let i = 0; i < start; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(year, month, d));

  const td = today();

  const myItems = items.filter(i => {
    if (i.assignedTo) return i.assignedTo === userName;
    return i.createdBy === userName;
  });

  const itemsForDay = (date) => myItems.filter(i => i.date && sameDay(i.date, date));

  const handleDayClick = (date) => {
    if (selectedDay && sameDay(date, selectedDay)) {
      setSelectedDay(null);
    } else {
      setSelectedDay(date);
    }
  };

  const selectedItems = selectedDay ? itemsForDay(selectedDay) : [];

  return (
    <div className="calendar-view">
      <div className="cal-header">
        <button className="cal-nav" onClick={() => { setCal(new Date(year, month - 1, 1)); setSelectedDay(null); }}>‹</button>
        <h2 className="cal-title">{MONTHS[month]} {year}</h2>
        <button className="cal-nav" onClick={() => { setCal(new Date(year, month + 1, 1)); setSelectedDay(null); }}>›</button>
        <button className="cal-today" onClick={() => { setCal(new Date()); setSelectedDay(null); }}>Aujourd'hui</button>
        <span style={{ fontSize: 12, color: 'var(--text-dim)', marginLeft: 12 }}>
          📅 Agenda personnel — {userName}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div className="cal-grid" style={{ flex: 1, minWidth: 0 }}>
          {DAYS.map(d => <div key={d} className="cal-day-header">{d}</div>)}
          {cells.map((date, i) => {
            if (!date) return <div key={`e-${i}`} className="cal-cell empty" />;
            const dayItems = itemsForDay(date);
            const isToday = date.getTime() === td.getTime();
            const isPast = date < td;
            const isSelected = selectedDay && sameDay(date, selectedDay);
            return (
              <div key={date.getTime()}
                className={`cal-cell ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDayClick(date)}
                style={{ cursor: 'pointer' }}>
                <div className="cal-date">{date.getDate()}</div>
                <div className="cal-items">
                  {dayItems.slice(0, 3).map(item => {
                    const timeRange = fmtTimeRange(item);
                    return (
                      <div key={item.id} className="cal-item"
                        style={{ background: TYPES[item.type]?.color + '22',
                                 borderLeft: `3px solid ${PRIORITIES[item.priority]?.color || '#60a5fa'}` }}
                        title={item.title + (timeRange ? ` · ${timeRange}` : '')}>
                        {TYPES[item.type]?.icon} {item.title}
                        {timeRange && <span style={{ opacity: .7 }}> · {timeRange}</span>}
                      </div>
                    );
                  })}
                  {dayItems.length > 3 && <div className="cal-more">+{dayItems.length - 3}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {selectedDay && (
          <DayPanel
            date={selectedDay}
            items={selectedItems}
            onEdit={(item) => { setSelectedDay(null); onEdit(item); }}
            onClose={() => setSelectedDay(null)}
          />
        )}
      </div>
    </div>
  );
}
