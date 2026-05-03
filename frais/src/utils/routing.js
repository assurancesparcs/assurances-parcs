const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const OSRM      = 'https://router.project-osrm.org/route/v1/driving';

// Respect Nominatim rate limit: 1 req/sec
let lastCall = 0;
async function geocode(query) {
  const wait = Math.max(0, 1100 - (Date.now() - lastCall));
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastCall = Date.now();

  const url = `${NOMINATIM}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=fr,be,ch,lu`;
  const res  = await fetch(url, { headers: { 'Accept-Language': 'fr-FR,fr;q=0.9' } });
  if (!res.ok) throw new Error('Erreur réseau');
  const data = await res.json();
  if (!data[0]) throw new Error(`Adresse introuvable : « ${query} »`);
  return { lat: data[0].lat, lon: data[0].lon };
}

/** Retourne la distance routière en km entre deux adresses/villes */
export async function getRouteDistance(from, to) {
  const a = await geocode(from);
  const b = await geocode(to);
  const url = `${OSRM}/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error('Erreur réseau OSRM');
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('Itinéraire introuvable');
  return Math.round(data.routes[0].distance / 1000);
}

/** Parse une phrase vocale en champs trajet
 *  Exemples reconnus :
 *   "de Paris à Lyon visite client"
 *   "Bordeaux Toulouse réunion Dupont"
 *   "Paris à Strasbourg pour une formation"
 */
export function parseVoiceTrip(text) {
  const cap = s => s.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const t    = text.trim();

  // "de X à Y [pour/—] motif"
  const m1 = t.match(/^(?:de\s+)?(.+?)\s+(?:à|a)\s+([^p].*?)(?:\s+(?:pour\s+|pour une\s+|pour un\s+)?(.+))?$/i);
  if (m1) {
    return {
      depart:  cap(m1[1]),
      arrivee: cap(m1[2]),
      motif:   m1[3] ? cap(m1[3]) : '',
    };
  }

  // "X Y motif" (deux premiers mots = villes)
  const words = t.split(/\s+/);
  if (words.length >= 2) {
    return {
      depart:  cap(words[0]),
      arrivee: cap(words[1]),
      motif:   cap(words.slice(2).join(' ')),
    };
  }

  return { depart: cap(t), arrivee: '', motif: '' };
}
