// Barème kilométrique officiel BIC/BNC (profession libérale)
// Format: { cv: [rate_≤5000, rate2_5001-20000, fixed_5001-20000, rate_>20000] }
const BAREME = {
  2023: {
    3: [0.529, 0.316, 1065, 0.370],
    4: [0.606, 0.340, 1330, 0.400],
    5: [0.636, 0.357, 1395, 0.418],
    6: [0.665, 0.374, 1457, 0.438],
    7: [0.697, 0.394, 1515, 0.462],
  },
  2024: {
    3: [0.529, 0.316, 1065, 0.370],
    4: [0.606, 0.340, 1330, 0.400],
    5: [0.636, 0.357, 1395, 0.418],
    6: [0.665, 0.374, 1457, 0.438],
    7: [0.697, 0.394, 1515, 0.462],
  },
  2025: {
    3: [0.529, 0.316, 1065, 0.370],
    4: [0.606, 0.340, 1330, 0.400],
    5: [0.636, 0.357, 1395, 0.418],
    6: [0.665, 0.374, 1457, 0.438],
    7: [0.697, 0.394, 1515, 0.462],
  },
};

function getBareme(cv, year) {
  const cvKey = Math.min(Math.max(Math.round(cv || 5), 3), 7);
  return (BAREME[year] || BAREME[2024])[cvKey];
}

/** Calcule l'IK total pour un cumul annuel donné */
export function calcIKTotal(totalKm, cv = 5, year = 2024) {
  if (!totalKm || totalKm <= 0) return 0;
  const [r1, r2, fixed, r3] = getBareme(cv, year);
  if (totalKm <= 5000) return totalKm * r1;
  if (totalKm <= 20000) return totalKm * r2 + fixed;
  return totalKm * r3;
}

/** Calcule l'IK marginal d'un trajet (méthode différentielle exacte) */
export function calcTripIK(tripKm, prevCumKm, cv = 5, year = 2024) {
  if (!tripKm || tripKm <= 0) return 0;
  return calcIKTotal(prevCumKm + tripKm, cv, year) - calcIKTotal(prevCumKm, cv, year);
}

/** Retourne le taux courant (€/km) pour un cumul donné */
export function getCurrentRate(cumKm, cv = 5, year = 2024) {
  const [r1, r2, , r3] = getBareme(cv, year);
  if (cumKm <= 5000) return r1;
  if (cumKm <= 20000) return r2;
  return r3;
}

/** Calcule les IK pour chaque trajet d'une liste triée par date */
export function enrichTripsWithIK(trips, cv = 5, year = null) {
  let cumKm = 0;
  return trips.map(t => {
    const tripYear = parseInt(t.date?.slice(0, 4));
    if (year !== null && tripYear !== year) return { ...t, ik: 0 };
    const km = t.km || 0;
    const ik = calcTripIK(km, cumKm, cv, tripYear || year || 2024);
    cumKm += km;
    return { ...t, ik };
  });
}

export const CV_OPTIONS = [3, 4, 5, 6, 7];
