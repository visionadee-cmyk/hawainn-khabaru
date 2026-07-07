import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

dotenv.config();

// Initialize Firebase Admin
let db;
try {
  const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    }
    db = getFirestore();
  } else {
    console.warn('Firebase service account file not found. Visitors endpoint will not work.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

const app = express();
const port = Number(process.env.PORT || 3001);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFilePath = path.join(__dirname, '.env');

const saveAccessToken = (token) => {
  if (!token) return;

  const normalizedToken = token.trim();
  if (!normalizedToken) return;

  const envContent = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, 'utf8') : '';
  const lines = envContent.split(/\r?\n/);
  const tokenLine = lines.findIndex((line) => line.startsWith('FACEBOOK_PAGE_ACCESS_TOKEN='));

  if (tokenLine >= 0) {
    lines[tokenLine] = `FACEBOOK_PAGE_ACCESS_TOKEN=${normalizedToken}`;
  } else {
    lines.push(`FACEBOOK_PAGE_ACCESS_TOKEN=${normalizedToken}`);
  }

  fs.writeFileSync(envFilePath, `${lines.join('\n')}\n`);
  process.env.FACEBOOK_PAGE_ACCESS_TOKEN = normalizedToken;
};

const getValidPageAccessToken = async (currentToken) => {
  const token = currentToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;

  if (!token || !appId || !appSecret) {
    return token || '';
  }

  try {
    const url = new URL('https://graph.facebook.com/oauth/access_token');
    url.searchParams.set('grant_type', 'fb_exchange_token');
    url.searchParams.set('client_id', appId);
    url.searchParams.set('client_secret', appSecret);
    url.searchParams.set('fb_exchange_token', token);

    const response = await fetch(url.toString());
    const data = await response.json().catch(() => ({}));

    if (data.access_token) {
      saveAccessToken(data.access_token);
      return data.access_token;
    }

    return token;
  } catch (error) {
    console.warn('Facebook token refresh failed; using the current token.', error);
    return token;
  }
};

app.use(cors());
app.use(express.json());

// Visitors endpoint
app.get('/api/visitors', async (req, res) => {
  if (!db) {
    return res.status(500).json({
      success: false,
      error: 'Firebase Admin not initialized. Service account file missing.',
    });
  }

  try {
    const visitorsSnapshot = await db.collection('visitors')
      .orderBy('timestamp', 'desc')
      .limit(1000)
      .get();

    const visitors = visitorsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json({ success: true, visitors });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch visitors',
    });
  }
});

app.post('/api/facebook/refresh-token', async (_req, res) => {
  const refreshedToken = await getValidPageAccessToken(process.env.FACEBOOK_PAGE_ACCESS_TOKEN);

  if (!refreshedToken) {
    return res.status(500).json({
      success: false,
      error: 'Facebook page token could not be refreshed.',
    });
  }

  return res.json({ success: true, accessToken: refreshedToken });
});

app.post('/api/facebook/post', async (req, res) => {
  const { title, excerpt, imageUrl, articleUrl } = req.body || {};
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = await getValidPageAccessToken(process.env.FACEBOOK_PAGE_ACCESS_TOKEN);

  console.log('Facebook Post Request:', { title, excerpt, imageUrl, articleUrl, pageId, hasToken: !!accessToken });

  if (!pageId || !accessToken) {
    return res.status(500).json({
      success: false,
      error: 'Facebook page credentials are not configured on the server.',
    });
  }

  const message = [title, excerpt].filter(Boolean).join('\n\n').trim();
  const messageWithLink = articleUrl ? `${message}\n\nRead more: ${articleUrl}` : message;

  try {
    let endpoint;
    let requestBody;

    // If image URL is provided, use photos endpoint for better visibility
    if (imageUrl) {
      endpoint = `https://graph.facebook.com/v20.0/${pageId}/photos`;
      requestBody = {
        url: imageUrl,
        caption: messageWithLink,
        access_token: accessToken,
        published: true,
      };
    } else {
      // If no image, use feed endpoint
      endpoint = `https://graph.facebook.com/v20.0/${pageId}/feed`;
      requestBody = {
        message: messageWithLink,
        access_token: accessToken,
        published: true,
        link: articleUrl,
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json().catch(() => ({}));
    console.log('Facebook API Response:', { status: response.status, data });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error?.message || 'Facebook API request failed.',
      });
    }

    // Photos endpoint returns {id: "postId"} while feed returns {id: "postId"}
    return res.json({
      success: true,
      postId: data.id,
      facebookUrl: `https://facebook.com/${data.id}`,
    });
  } catch (error) {
    console.error('Facebook API Error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
});

app.delete('/api/facebook/post/:postId', async (req, res) => {
  const { postId } = req.params;
  const accessToken = await getValidPageAccessToken(process.env.FACEBOOK_PAGE_ACCESS_TOKEN);

  if (!accessToken) {
    return res.status(500).json({
      success: false,
      error: 'Facebook page credentials are not configured on the server.',
    });
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v20.0/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error?.message || 'Facebook API request failed.',
      });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
});

app.get('/api/facebook/insights', async (req, res) => {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = await getValidPageAccessToken(process.env.FACEBOOK_PAGE_ACCESS_TOKEN);

  if (!pageId || !accessToken) {
    return res.status(500).json({
      success: false,
      error: 'Facebook page credentials are not configured on the server.',
    });
  }

  try {
    // Fetch page insights for page views, likes, and followers
    const metrics = 'page_views,page_fan_adds,page_fan_removes,page_fans';
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}/insights?metric=${metrics}&period=day&access_token=${accessToken}`
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error?.message || 'Facebook API request failed.',
      });
    }

    // Also fetch page info for current likes/followers count
    const pageInfoResponse = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}?fields=fan_count,followers_count&access_token=${accessToken}`
    );

    const pageInfoData = await pageInfoResponse.json().catch(() => ({}));

    const insights = {
      page_views: data.data?.find((m) => m.name === 'page_views')?.values[0]?.value || 0,
      page_likes: pageInfoData.fan_count || 0,
      page_followers: pageInfoData.followers_count || 0,
    };

    return res.json({ success: true, insights });
  } catch (error) {
    console.error('Facebook Insights API Error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
});

const server = app.listen(port, () => {
  console.log(`Facebook posting proxy listening on port ${port}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please kill the process using that port.`);
  }
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
