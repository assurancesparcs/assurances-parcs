export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { triggerEvent, payload } = req.body;

  // Only process booking confirmations
  if (triggerEvent !== 'BOOKING_CREATED' && triggerEvent !== 'BOOKING_RESCHEDULED') {
    return res.status(200).json({ ok: true, ignored: true });
  }

  const booking = payload || {};

  const rdv = {
    id_cal: booking.uid || booking.id || null,
    prenom: booking.attendees?.[0]?.name?.split(' ')[0] || '',
    nom: booking.attendees?.[0]?.name?.split(' ').slice(1).join(' ') || '',
    email: booking.attendees?.[0]?.email || '',
    telephone: booking.attendees?.[0]?.phoneNumber || booking.responses?.phone?.value || '',
    date_rdv: booking.startTime || null,
    date_fin: booking.endTime || null,
    type: booking.type || 'bilan-decouverte',
    statut: 'confirme',
    notes: booking.description || '',
    organizer_email: booking.organizer?.email || '',
    created_at: new Date().toISOString(),
    source: 'cal.com',
    evenement: triggerEvent,
  };

  try {
    const firebaseRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents/rdv_audio`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getFirebaseToken()}`,
        },
        body: JSON.stringify(toFirestoreFields(rdv)),
      }
    );

    if (!firebaseRes.ok) {
      const err = await firebaseRes.text();
      console.error('Firestore error:', err);
      return res.status(500).json({ error: 'Firestore write failed' });
    }

    console.log('RDV saved:', rdv.email, rdv.date_rdv);
    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

function toFirestoreFields(obj) {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      fields[key] = { nullValue: null };
    } else if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
    } else if (typeof value === 'number') {
      fields[key] = { doubleValue: value };
    } else {
      fields[key] = { stringValue: String(value) };
    }
  }
  return { fields };
}

function toBase64Url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function getFirebaseToken() {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  const now = Math.floor(Date.now() / 1000);

  const header    = toBase64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claimSet  = toBase64Url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));

  const { createSign } = await import('crypto');
  const sign = createSign('RSA-SHA256');
  sign.update(`${header}.${claimSet}`);
  const signature = sign.sign(serviceAccount.private_key, 'base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const jwt = `${header}.${claimSet}.${signature}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:grants:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    console.error('Token error:', JSON.stringify(tokenData));
    throw new Error('Failed to get Firebase token');
  }
  return tokenData.access_token;
}
