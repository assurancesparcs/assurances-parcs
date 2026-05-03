module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const triggerEvent = req.body && req.body.triggerEvent;
  const payload      = req.body && req.body.payload;

  if (!triggerEvent) {
    return res.status(200).json({ ok: true, ignored: 'no_trigger' });
  }

  if (triggerEvent !== 'BOOKING_CREATED' && triggerEvent !== 'BOOKING_RESCHEDULED') {
    console.log('Ignored event:', triggerEvent);
    return res.status(200).json({ ok: true, ignored: triggerEvent });
  }

  const booking = payload || {};
  const rdv = {
    id_cal:          String(booking.uid || booking.id || ''),
    prenom:          String(((booking.attendees && booking.attendees[0] && booking.attendees[0].name) || '').split(' ')[0]),
    nom:             String(((booking.attendees && booking.attendees[0] && booking.attendees[0].name) || '').split(' ').slice(1).join(' ')),
    email:           String((booking.attendees && booking.attendees[0] && booking.attendees[0].email) || ''),
    telephone:       String((booking.attendees && booking.attendees[0] && booking.attendees[0].phoneNumber) || (booking.responses && booking.responses.phone && booking.responses.phone.value) || ''),
    date_rdv:        String(booking.startTime || ''),
    date_fin:        String(booking.endTime || ''),
    type:            String(booking.type || 'bilan-decouverte'),
    statut:          'confirme',
    notes:           String(booking.description || ''),
    organizer_email: String((booking.organizer && booking.organizer.email) || ''),
    created_at:      new Date().toISOString(),
    source:          'cal.com',
    evenement:       triggerEvent,
  };

  try {
    const token = await getFirebaseToken();
    const firebaseRes = await fetch(
      'https://firestore.googleapis.com/v1/projects/' + process.env.FIREBASE_PROJECT_ID + '/databases/(default)/documents/rdv_audio',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(toFirestoreFields(rdv)),
      }
    );
    const responseText = await firebaseRes.text();
    if (!firebaseRes.ok) {
      console.error('Firestore error:', responseText);
      return res.status(500).json({ error: 'Firestore write failed' });
    }
    console.log('RDV saved:', rdv.email, rdv.date_rdv);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

function toFirestoreFields(obj) {
  const fields = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value === null || value === undefined) fields[key] = { nullValue: null };
    else if (typeof value === 'boolean')       fields[key] = { booleanValue: value };
    else if (typeof value === 'number')        fields[key] = { doubleValue: value };
    else                                       fields[key] = { stringValue: String(value) };
  }
  return { fields };
}

function toBase64Url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function getFirebaseToken() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  const now = Math.floor(Date.now() / 1000);

  const header   = toBase64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claimSet = toBase64Url(JSON.stringify({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));

  const crypto = require('crypto');
  const sign   = crypto.createSign('RSA-SHA256');
  sign.update(header + '.' + claimSet);
  const signature = sign.sign(privateKey, 'base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn:ietf:grants:jwt-bearer&assertion=' + header + '.' + claimSet + '.' + signature,
  });

  const rawText = await tokenRes.text();
  let tokenData;
  try { tokenData = JSON.parse(rawText); } catch(e) {
    throw new Error('OAuth error: ' + rawText.substring(0, 200));
  }
  if (!tokenData.access_token) {
    throw new Error('No token: ' + JSON.stringify(tokenData));
  }
  return tokenData.access_token;
}
