# Facebook Page Access Token Setup

**NEW (v2.1.0):** Facebook tokens now **automatically refresh** before each operation. You no longer need to manually update tokens every 60 days!

## ⚡ Quick Reference

- **Automatic Refresh**: ✅ Enabled (tokens refresh automatically)
- **Token Expiration**: 60 days (auto-refreshed)
- **Manual Update**: Only needed for initial setup
- **Auto-Posting**: ✅ Enabled (articles post to Facebook automatically)

---

## Initial Setup (One-Time)

Follow these steps **only once** to set up Facebook integration:

### Step 1: Create Facebook App & Page

1. Go to [Facebook Developer Site](https://developers.facebook.com/)
2. Create a new app (if not already created)
3. Add "Facebook Login" product to your app
4. Create a Facebook Page for your news outlet

### Step 2: Get User Access Token

1. Visit: https://developers.facebook.com/tools/explorer/
2. Select your app from the dropdown
3. Click "Add or Remove Permissions"
4. Select these permissions:
   - ✅ `pages_manage_posts` - Create/delete posts
   - ✅ `pages_read_engagement` - Read page analytics
5. Click "Generate Access Token"
6. Authorize with your Facebook account
7. Copy the generated token

### Step 3: Exchange for Long-Lived Token

Use PowerShell or curl to exchange for a long-lived token (valid 60 days):

**PowerShell:**
```powershell
$userToken = "YOUR_USER_TOKEN_FROM_STEP_2"
$appId = "2209454326568914"
$appSecret = "0fb965d14dca0716e3a4dc6c1f8b91f9"

$uri = "https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$appId&client_secret=$appSecret&fb_exchange_token=$userToken"

$response = Invoke-RestMethod -Uri $uri -Method Get
$response | ConvertTo-Json
```

**Bash/cURL:**
```bash
curl -s "https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=2209454326568914&client_secret=0fb965d14dca0716e3a4dc6c1f8b91f9&fb_exchange_token=YOUR_USER_TOKEN"
```

Copy the `access_token` from response.

### Step 4: Get Page Access Token

Use your long-lived user token to get page-specific token:

**PowerShell:**
```powershell
$userToken = "YOUR_LONG_LIVED_TOKEN_FROM_STEP_3"

$response = Invoke-RestMethod -Uri "https://graph.facebook.com/v20.0/me/accounts?access_token=$userToken" -Method Get
$response.data | Format-Table name, id, access_token
```

Find your page (ID: 1233961369780982) and copy its `access_token`.

### Step 5: Configure Environment Variables

**On Vercel Dashboard:**
1. Go to your project Settings → Environment Variables
2. Add these 4 variables:

```
FACEBOOK_PAGE_ID = 1233961369780982
FACEBOOK_PAGE_ACCESS_TOKEN = {YOUR_PAGE_ACCESS_TOKEN_FROM_STEP_4}
FACEBOOK_APP_ID = 2209454326568914
FACEBOOK_APP_SECRET = 0fb965d14dca0716e3a4dc6c1f8b91f9
```

**Locally (in `.env`):**
```
FACEBOOK_PAGE_ID=1233961369780982
FACEBOOK_PAGE_ACCESS_TOKEN={YOUR_PAGE_ACCESS_TOKEN}
FACEBOOK_APP_ID=2209454326568914
FACEBOOK_APP_SECRET=0fb965d14dca0716e3a4dc6c1f8b91f9
```

### Step 6: Test the Setup

Try posting an article from the admin dashboard:
1. Go to `/admin`
2. Create a test article
3. Click "Post to Facebook"
4. Article should appear on your Facebook page within seconds

---

## How Automatic Token Refresh Works

### How It Works
```
Admin Creates Article
        ↓
Article Saves to Database
        ↓
Automatic Token Refresh (triggered)
        ↓
Exchange Current Token for New Token
        ↓
Post Article to Facebook
        ↓
New Token Saved to Environment
```

### Benefits
✅ **No manual updates** - Token automatically refreshes  
✅ **Extended validity** - Tokens last 60 days with auto-refresh  
✅ **Seamless operation** - Posting never fails due to expired token  
✅ **Production-ready** - Works on Vercel Functions  

---

## Manual Token Refresh (If Needed)

If for some reason the automatic refresh fails, you can manually refresh:

**Using the API endpoint:**
```bash
curl -X POST https://your-app.vercel.app/api/facebook/refresh-token
```

**Result:**
```json
{
  "success": true,
  "accessToken": "EAAf...new_token..."
}
```

---

## Checking Token Status

### Check Token Expiration

**PowerShell:**
```powershell
$token = "YOUR_PAGE_ACCESS_TOKEN"
$appId = "2209454326568914"
$appSecret = "0fb965d14dca0716e3a4dc6c1f8b91f9"
$appAccessToken = "$appId|$appSecret"

$response = Invoke-RestMethod -Uri "https://graph.facebook.com/debug_token?input_token=$token&access_token=$appAccessToken" -Method Get
$response.data | ConvertTo-Json
```

**Expected output:**
```json
{
  "app_id": "2209454326568914",
  "type": "PAGE",
  "is_valid": true,
  "expires_at": 1791191129
}
```

### Verify Configuration

Check environment variables are set:

**Vercel Dashboard:**
1. Settings → Environment Variables
2. All 4 Facebook variables should be visible

**Locally:**
```bash
grep FACEBOOK .env
```

Should show all 4 variables:
```
FACEBOOK_PAGE_ID=1233961369780982
FACEBOOK_PAGE_ACCESS_TOKEN=EAA...
FACEBOOK_APP_ID=2209454326568914
FACEBOOK_APP_SECRET=0fb965d14dca0716e3a4dc6c1f8b91f9
```

---

## Troubleshooting

### "Facebook page credentials not configured"

**Cause:** Environment variables missing  
**Solution:**
1. Check all 4 variables are set in Vercel dashboard
2. Check `.env` file locally has all 4 variables
3. Restart the app / redeploy to Vercel
4. Try posting again

### "Token Validation Error" or "Session has expired"

**Cause:** Token is invalid or very old  
**Solution:**
1. Follow **Initial Setup** steps 2-5 to get new token
2. Update `FACEBOOK_PAGE_ACCESS_TOKEN` in environment
3. Restart/redeploy
4. Try posting again

### Post doesn't appear on Facebook

**Cause:** Various reasons  
**Solution:**
1. Verify token is valid (see "Checking Token Status" above)
2. Check article has all required fields (title, excerpt, image)
3. Try posting a simpler article (fewer special characters)
4. Check Facebook page is not restricted
5. Try manual token refresh (see "Manual Token Refresh" above)
6. Check Facebook page still exists and you're admin

### "Failed to fetch Facebook insights"

**Cause:** Page analytics disabled or token permissions insufficient  
**Solution:**
1. Ensure token has `pages_read_engagement` permission
2. Check page has public analytics enabled
3. Try refreshing token (see "Manual Token Refresh" above)

---

## Security Notes

🔐 **Important:**
- Never share your **App Secret** or **Access Token** publicly
- Never commit `.env` to Git (use `.env.example` as template)
- Tokens should be in environment variables only
- Rotate tokens if you suspect they've been compromised
- Use HTTPS only (Vercel provides this automatically)

---

## Reference Information

**Facebook Configuration for Hawainn Khabaru:**
- App Name: kahabru
- App ID: 2209454326568914
- App Secret: 0fb965d14dca0716e3a4dc6c1f8b91f9
- Page Name: Hawainn Khabaru
- Page ID: 1233961369780982
- Page URL: https://www.facebook.com/people/Hawainn-Khabaru/61591869200851/

**API Resources:**
- [Facebook Graph API Docs](https://developers.facebook.com/docs/graph-api)
- [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Permissions Reference](https://developers.facebook.com/docs/permissions/reference)

---

## Changelog

**v2.1.0 (July 2026)**
- ✅ Automatic token refresh implemented
- ✅ Tokens refresh before each Facebook operation
- ✅ Auto-posting to Facebook page
- ✅ Manual refresh endpoint available
- ✅ Migrated to Vercel Functions (serverless)

**v2.0.0 (June 2026)**
- Initial Facebook integration
- Server-side token refresh (manual)
- Express backend running on port 3001
