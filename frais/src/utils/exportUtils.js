import { calcIKTotal } from './ikCalculator';

function toCSV(rows) {
  return '﻿' + rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');
}

function download(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportKmCSV(trips, settings, year = new Date().getFullYear()) {
  const cv = settings?.cv || 5;
  const yearTrips = trips
    .filter(t => t.date?.startsWith(String(year)))
    .sort((a, b) => a.date.localeCompare(b.date));

  const header = ['Date', 'Départ', 'Arrivée', 'Km', 'Motif', 'IK (€)', 'Cumul km', 'Cumul IK (€)'];
  let cumKm = 0;
  const rows = yearTrips.map(t => {
    const km = t.km || 0;
    const prevCum = cumKm;
    cumKm += km;
    const tripIK = calcIKTotal(cumKm, cv, year) - calcIKTotal(prevCum, cv, year);
    const cumIK = calcIKTotal(cumKm, cv, year);
    return [
      t.date,
      t.depart || '',
      t.arrivee || '',
      km,
      t.motif || '',
      tripIK.toFixed(2),
      cumKm,
      cumIK.toFixed(2),
    ];
  });

  download(toCSV([header, ...rows]), `km-${year}.csv`);
}

export function exportRepasCSV(repas, year = new Date().getFullYear()) {
  const yearRepas = repas
    .filter(r => r.date?.startsWith(String(year)))
    .sort((a, b) => a.date.localeCompare(b.date));

  const header = ['Date', 'Restaurant', 'Montant (€)', 'Participants', 'Motif professionnel'];
  const rows = yearRepas.map(r => [
    r.date,
    r.restaurant || '',
    (r.montant || 0).toFixed(2),
    Array.isArray(r.participants) ? r.participants.join(', ') : (r.participants || ''),
    r.motif || '',
  ]);

  download(toCSV([header, ...rows]), `repas-${year}.csv`);
}
