module.exports = async function handler(req, res) {
  console.log('START - method:', req.method);
  console.log('ENV:', {
    hasEmail:   !!process.env.FIREBASE_CLIENT_EMAIL,
    hasKey:     !!process.env.FIREBASE_PRIVATE_KEY,
    hasProject: !!process.env.FIREBASE_PROJECT_ID,
    emailVal:   (process.env.FIREBASE_CLIENT_EMAIL || '').substring(0, 30),
    keyStart:   (process.env.FIREBASE_PRIVATE_KEY  || '').substring(0, 30),
  });
  return res.status(200).json({ ok: true });
};
