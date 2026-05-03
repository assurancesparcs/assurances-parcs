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
  const attendee = (booking.attendees && booking.attendees[0]) || {};
  const startTime = booking.startTime ? new Date(booking.startTime) : null;
  const dateStr   = startTime ? startTime.toISOString().split('T')[0] : '';
  const timeStr   = startTime ? startTime.toISOString().split('T')[1].substring(0, 5) : '';
  const nomComplet = attendee.name || '';

  const rdv = {
    title:      { stringValue: 'Bilan découverte — ' + nomComplet },
    type:       { stringValue: 'rdv' },
    status:     { stringValue: 'a_faire' },
    priority:   { stringValue: 'normal' },
    assignedTo: { stringValue: 'Johann' },
    date:       startTime ? { timestampValue: startTime.toISOString() } : { nullValue: null },
    time:       { stringValue: timeStr },
    description:{ stringValue: attendee.email || '' },
    notes:      { stringValue: 'Source: Cal.com — ' + nomComplet + (attendee.email ? ' — ' + attendee.email : '') },
    source:     { stringValue: 'cal.com' },
    createdAt:  { timestampValue: new Date().toISOString() },
  };

  try {
    const token = await getFirebaseToken();
    const firebaseRes = await fetch(
      'https://firestore.googleapis.com/v1/projects/' + process.env.FIREBASE_PROJECT_ID + '/databases/(default)/documents/items',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ fields: rdv }),
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
    body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + header + '.' + claimSet + '.' + signature,
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
