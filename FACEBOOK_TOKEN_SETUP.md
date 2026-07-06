# Facebook Page Access Token Setup

When the Facebook Page Access Token expires, follow these steps to generate a new one:

## Step 1: Go to Facebook Graph API Explorer
Visit: https://developers.facebook.com/tools/explorer/

## Step 2: Select Your App
- Select "Hawainn Khabaru" from the app dropdown
- Select your Facebook Page from the "User or Page" dropdown

## Step 3: Generate User Access Token
- Click "Add or remove permissions"
- Select these permissions:
  - `pages_manage_posts`
  - `pages_read_engagement`
- Click "Generate Access Token"
- Authorize with your Facebook account when prompted

## Step 4: Exchange for Long-Lived User Access Token
Use this URL in your browser or with curl:

```
https://graph.facebook.com/v20.0/oauth/access_token?
  grant_type=fb_exchange_token&
  client_id=2209454326568914&
  client_secret=0fb965d14dca0716e3a4dc6c1f8b91f9&
  fb_exchange_token={YOUR_USER_ACCESS_TOKEN}
```

Copy the `access_token` from the response - this is your long-lived user token (valid for 60 days).

## Step 5: Get Page Access Token
Use this URL with your long-lived user token:

```
https://graph.facebook.com/v20.0/me/accounts?access_token={LONG_LIVED_USER_TOKEN}
```

Find your page (Hawainn Khabaru, ID: 1233961369780982) and copy the `access_token` value.

## Step 6: Update .env File
Replace the `FACEBOOK_PAGE_ACCESS_TOKEN` value in the `.env` file:

```
FACEBOOK_PAGE_ACCESS_TOKEN={YOUR_NEW_PAGE_ACCESS_TOKEN}
```

## Step 7: Restart the Server
```bash
# Kill existing server process
netstat -ano | findstr :3001
taskkill /F /PID {PID}

# Start server again
npm run server
```

## Important Notes
- Page Access Tokens expire after 60 days
- You can check token expiration using the Facebook Debugger: https://developers.facebook.com/tools/debug/accesstoken/
- Keep your tokens secure - never commit `.env` to Git
- The `.env` file is already in `.gitignore`

## Current Facebook Configuration
- **App ID**: 2209454326568914
- **App Secret**: 0fb965d14dca0716e3a4dc6c1f8b91f9
- **Page ID**: 1233961369780982
