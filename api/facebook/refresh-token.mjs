// Helper to get or refresh Facebook access token
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
      return data.access_token;
    }

    return token;
  } catch (error) {
    console.warn('Facebook token refresh failed; using the current token.', error);
    return token;
  }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const refreshedToken = await getValidPageAccessToken(process.env.FACEBOOK_PAGE_ACCESS_TOKEN);

  if (!refreshedToken) {
    return res.status(500).json({
      success: false,
      error: 'Facebook page token could not be refreshed.',
    });
  }

  return res.json({ success: true, accessToken: refreshedToken });
}
