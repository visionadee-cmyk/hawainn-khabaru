import admin from 'firebase-admin';

const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

  const credentials = serviceAccountKey
    ? admin.credential.cert(JSON.parse(serviceAccountKey))
    : admin.credential.applicationDefault();

  return admin.initializeApp({
    credential: credentials,
    projectId,
  });
};

const handleCors = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

export default async function handler(req, res) {
  handleCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    initializeFirebaseAdmin();
    const authHeader = req.headers.authorization || req.headers.Authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken.uid) {
      return res.status(401).json({ error: 'Invalid authorization token' });
    }

    const db = admin.firestore();
    const snapshot = await db.collection('visitors').orderBy('timestamp', 'desc').limit(1000).get();
    const visitors = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({ success: true, visitors });
  } catch (error) {
    console.error('Visitor API error:', error);
    return res.status(500).json({ error: 'Failed to fetch visitors' });
  }
}
