import { useState } from 'react';
import { TYPES, PRIORITIES, MONTHS, DAYS, sameDay, today } from '../constants';

export default function CalendarView({ items, onEdit, userName }) {
  const [cal, setCal] = useState(new Date());
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

  return (
    <div className="calendar-view">
      <div className="cal-header">
        <button className="cal-nav" onClick={() => setCal(new Date(year, month - 1, 1))}>‹</button>
        <h2 className="cal-title">{MONTHS[month]} {year}</h2>
        <button className="cal-nav" onClick={() => setCal(new Date(year, month + 1, 1))}>›</button>
        <button className="cal-today" onClick={() => setCal(new Date())}>Aujourd'hui</button>
        <span style={{ fontSize: 12, color: 'var(--text-dim)', marginLeft: 12 }}>
          📅 Agenda personnel — {userName}
        </span>
      </div>
      <div className="cal-grid">
        {DAYS.map(d => <div key={d} className="cal-day-header">{d}</div>)}
        {cells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} className="cal-cell empty" />;
          const dayItems = itemsForDay(date);
          const isToday = date.getTime() === td.getTime();
          const isPast = date < td;
          return (
            <div key={date.getTime()} className={`cal-cell ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}>
              <div className="cal-date">{date.getDate()}</div>
              <div className="cal-items">
                {dayItems.slice(0, 3).map(item => (
                  <div key={item.id} className="cal-item"
                    style={{ background: TYPES[item.type]?.color + '22',
                             borderLeft: `3px solid ${PRIORITIES[item.priority]?.color || '#60a5fa'}` }}
                    onClick={() => onEdit(item)} title={item.title}>
                    {TYPES[item.type]?.icon} {item.title}
                  </div>
                ))}
                {dayItems.length > 3 && <div className="cal-more">+{dayItems.length - 3}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
