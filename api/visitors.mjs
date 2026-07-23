import admin from 'firebase-admin';

const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  const serviceAccountKeyRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

  let serviceAccountKey = serviceAccountKeyRaw?.trim();
  if (serviceAccountKey?.startsWith("'") && serviceAccountKey.endsWith("'")) {
    serviceAccountKey = serviceAccountKey.slice(1, -1).trim();
  } else if (serviceAccountKey?.startsWith('"') && serviceAccountKey.endsWith('"')) {
    serviceAccountKey = serviceAccountKey.slice(1, -1).trim();
  }

  if (!projectId) {
    throw new Error('Firebase project ID is not configured.');
  }

  const credentials = serviceAccountKey
    ? (() => {
        const normalizedKey = serviceAccountKey
          .replace(/\\n/g, '\n')
          .replace(/\r\n/g, '\n')
          .trim();

        try {
          return admin.credential.cert(JSON.parse(normalizedKey));
        } catch (error) {
          console.error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON:', error);
          console.error('Raw service account key preview:', normalizedKey?.slice(0, 60));
          throw new Error('Invalid Firebase service account key configuration.');
        }
      })()
    : admin.credential.applicationDefault();

  return admin.initializeApp({
    credential: credentials,
    projectId,
  });
};

const handleCors = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

export default async function handler(req, res) {
  handleCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  initializeFirebaseAdmin();
  const db = admin.firestore();

  if (req.method === 'POST') {
    try {
      const visitorData = req.body || {};
      const savedVisitor = {
        path: typeof visitorData.path === 'string' ? visitorData.path : '/',
        userAgent: typeof visitorData.userAgent === 'string' ? visitorData.userAgent : '',
        language: typeof visitorData.language === 'string' ? visitorData.language : '',
        isNewVisitor: typeof visitorData.isNewVisitor === 'boolean' ? visitorData.isNewVisitor : false,
        deviceType: typeof visitorData.deviceType === 'string' ? visitorData.deviceType : '',
        browser: typeof visitorData.browser === 'string' ? visitorData.browser : '',
        os: typeof visitorData.os === 'string' ? visitorData.os : '',
        screenResolution: typeof visitorData.screenResolution === 'string' ? visitorData.screenResolution : '',
        viewport: typeof visitorData.viewport === 'string' ? visitorData.viewport : '',
        referrer: typeof visitorData.referrer === 'string' ? visitorData.referrer : 'direct',
        timezone: typeof visitorData.timezone === 'string' ? visitorData.timezone : '',
        visitTime: typeof visitorData.visitTime === 'string' ? visitorData.visitTime : '',
        deviceFingerprint: typeof visitorData.deviceFingerprint === 'string' ? visitorData.deviceFingerprint : '',
        isSameDevice: typeof visitorData.isSameDevice === 'boolean' ? visitorData.isSameDevice : false,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection('visitors').add(savedVisitor);
      return res.status(201).json({ success: true });
    } catch (error) {
      console.error('Visitor API write error:', error);
      const message = error instanceof Error ? error.message : 'Failed to save visitor';
      return res.status(500).json({ error: message });
    }
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization || req.headers.Authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return res.status(500).json({ error: 'Firebase admin credentials are not configured on the server.' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken.uid) {
      return res.status(401).json({ error: 'Invalid authorization token' });
    }

    const snapshot = await db.collection('visitors').orderBy('timestamp', 'desc').limit(1000).get();
    const visitors = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({ success: true, visitors });
  } catch (error) {
    console.error('Visitor API read error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch visitors';
    return res.status(500).json({ error: message });
  }
}
