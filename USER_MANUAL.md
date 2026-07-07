# User Manual - Hawainn Khabaru News Portal

Complete guide for using Hawainn Khabaru as a reader and as an administrator.

## 📖 Table of Contents

1. [For Readers](#for-readers)
2. [For Administrators](#for-administrators)
3. [Troubleshooting](#troubleshooting)
4. [Keyboard Shortcuts](#keyboard-shortcuts)

---

## 👥 For Readers

### Installation (Mobile App)

**On Android:**
1. Open the app in your browser
2. Tap the **⋮** (menu) icon
3. Select "Install app" or "Add to Home screen"
4. Confirm the installation
5. The app will appear as a native app on your home screen

**On iOS (Safari):**
1. Open the app in Safari
2. Tap the **Share** button
3. Select "Add to Home Screen"
4. Confirm to add to home screen
5. The app will work like a native app

### Navigating the App

**Bottom Navigation (Mobile)**
- 🏠 **Home** - Latest news and trending articles
- 📚 **Categories** - Browse news by category
- 🎥 **Videos** - Watch video content
- 🔔 **Notifications** - News updates and alerts
- 👤 **Profile** - Your account and history

**Desktop Navigation**
- Top header with logo and search
- Category menu below header
- Sidebar for navigation
- Same content areas as mobile

### Reading Articles

1. **Browse articles**
   - Scroll through the home page
   - Tap on any article card to read full content

2. **Article details**
   - **Title & Excerpt** - Headline and summary
   - **Featured Image** - Main visual for the article
   - **Date & Time** - When the article was published
   - **Author** - Who wrote the article
   - **Category Tag** - Article topic

3. **Reading options**
   - Tap to scroll through the full article
   - Use **Back** button to return to list
   - Swipe left/right to go to previous/next article (on mobile)

4. **Dark Mode**
   - Toggle **☀️/🌙** icon in the header
   - Saves your preference automatically
   - Better reading experience in low light

### Categories

Browse news by category:
- **Home** - All latest news
- **📚 Education** - Academic and learning news
- **⚽ Sports** - Sports news and updates
- **🏛️ Politics** - Political news
- **💼 Business** - Business and economy
- **🎬 Entertainment** - Entertainment and culture

### Watching Videos

1. Tap the **Videos** tab
2. Select any video to watch
3. Videos play in full screen
4. Swipe to go back to the list

### Notifications

1. Tap the **🔔 Notifications** tab
2. See all latest news updates
3. Tap any notification to read the full article
4. Notifications are sent for breaking news

### Your Profile

1. Tap the **👤 Profile** tab
2. See your account information
3. View your reading history
4. Manage notification preferences
5. Toggle dark mode settings

### Sharing Articles

1. While reading an article
2. Look for **Share** button (usually near the title)
3. Choose where to share:
   - Copy article link
   - Share to WhatsApp, Email, etc.
   - Share to Facebook
4. Article link opens in the app or browser

### Search

1. Tap the **🔍 Search** icon (usually in header)
2. Type your search query
3. Results appear instantly
4. Tap any result to read the article

---

## 👨‍💼 For Administrators

### Admin Login

1. Navigate to `/admin` in your browser
2. Enter your email: `hawainnkhabaru@gmail.com`
3. Enter your password: `Adhu1447`
4. Click **Login**
5. You'll see the Admin Dashboard

### Admin Dashboard Overview

The dashboard has three main sections:

#### 1. **Article Management**
Create, edit, and manage articles

#### 2. **Analytics**
View page statistics and engagement

#### 3. **Settings**
Manage categories and system settings

---

### Creating a New Article

1. **Click "New Article" button**
2. **Fill in article details:**
   - **Title** - Headline (required)
   - **Excerpt** - Short summary for previews (required)
   - **Content** - Full article text (required)
   - **Category** - Select from dropdown (required)
   - **Featured Image** - Upload or select image (required)

3. **Article editor features:**
   - **Bold (B)** - Make text bold
   - **Italic (I)** - Italicize text
   - **Links** - Add hyperlinks
   - **Lists** - Bullet points and numbered lists
   - **Headings** - H1, H2, H3 formatting

4. **Upload Featured Image:**
   - Click "Upload Image" button
   - Select image from computer
   - Or drag-drop image into the field
   - Image must be under 5MB
   - Recommended size: 1200x630px

5. **Preview:**
   - Click "Preview" to see how article looks
   - Check formatting and image placement

6. **Publish:**
   - Click "Post to Facebook" to publish
   - Article saves to database immediately
   - **Automatically posts to Facebook page** (no manual step needed)
   - Visible to readers instantly
   - Facebook post includes article title, excerpt, image, and link

### Editing Existing Articles

1. Go to **"Articles"** section
2. Find article in the list
3. Click the **✏️ Edit** button
4. Make changes to content, image, category
5. Click **"Update Article"**
6. Changes appear instantly

### Deleting Articles

1. Go to **"Articles"** section
2. Find article in the list
3. Click the **🗑️ Delete** button
4. Confirm deletion
5. Article removed from database
6. **Note:** Does NOT automatically delete from Facebook (manual deletion needed)

### Managing Categories

1. Go to **"Categories"** section
2. View all available categories:
   - Home
   - Education
   - Sports
   - Politics
   - Business
   - Entertainment

3. **Add New Category:**
   - Click "New Category"
   - Enter category name
   - Add icon/color (optional)
   - Save

4. **Edit Category:**
   - Click **✏️** next to category
   - Modify name and settings
   - Save changes

### Analytics Dashboard

#### Visitor Statistics
- **Total Visits** - Total number of page visits
- **Unique Visitors** - Number of different users
- **Today's Visits** - Visits in the last 24 hours
- **This Month** - Visits this month

#### Recent Visitor Details
- Visitor IP address
- Location (if available)
- Visit timestamp
- Device type

#### Article Performance
- **Article Views** - How many times article was read
- **Visit Trends** - Graph of visits over time
- **Popular Articles** - Most read articles

#### Facebook Page Statistics (if connected)
- **Page Likes** - Total page likes
- **Followers** - Total followers
- **Post Engagement** - Likes, comments, shares
- **Page Views** - Facebook page views

### Facebook Integration

#### Auto-Posting Feature

When you click **"Post to Facebook"**:
1. Article saves to database
2. ✅ Automatically posts to Facebook page
3. Facebook post includes:
   - Article title
   - Article excerpt
   - Featured image
   - Link to article
4. Post appears on your Facebook page immediately

#### Token Management

The Facebook token **automatically refreshes**:
- No manual updates needed
- Tokens last 60 days
- Refresh happens automatically before posting
- Old tokens remain valid for fallback

#### Troubleshooting Facebook Posts

**Post didn't appear on Facebook:**
1. Check Facebook page is connected
2. Check token is valid (see `.env`)
3. Try "Post to Facebook" again
4. Check article has required fields

**Getting error "Facebook page credentials not configured":**
1. Check `.env` file has:
   - `FACEBOOK_PAGE_ID`
   - `FACEBOOK_PAGE_ACCESS_TOKEN`
   - `FACEBOOK_APP_ID`
   - `FACEBOOK_APP_SECRET`
2. Restart the server
3. Try posting again

**Manual Token Refresh:**
If token expires, use the refresh endpoint:
```
POST /api/facebook/refresh-token
```
Or see [FACEBOOK_TOKEN_SETUP.md](FACEBOOK_TOKEN_SETUP.md)

---

## 🔧 Troubleshooting

### App won't load

**Solution:**
1. Check internet connection
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try opening in a different browser
4. Force refresh (Ctrl+F5)

### Images not uploading

**Solution:**
1. Check image file size (max 5MB)
2. Check image format (PNG, JPG, WebP supported)
3. Check internet connection
4. Try a different image
5. Clear browser cache

### Can't log into admin

**Solution:**
1. Check spelling of email
2. Check CAPS LOCK is off
3. Verify password is correct
4. Clear browser cookies and try again
5. Try private/incognito mode
6. Contact admin if issue persists

### Articles not appearing

**Solution:**
1. Check article was published (not just saved as draft)
2. Check article is in a visible category
3. Try refreshing the page
4. Check filters (category filters might hide articles)
5. Wait 5-10 seconds for Firebase sync

### Push notifications not working

**Solution:**
1. Check notifications are enabled in browser settings
2. Check app is installed (not just bookmarked)
3. Check service worker is registered (DevTools > Application > Service Workers)
4. Try reinstalling the app
5. Check app isn't disabled in notification settings

### Dark mode not saving

**Solution:**
1. Check cookies are enabled in browser
2. Check browser isn't in private/incognito mode
3. Clear cache and try again
4. Try different browser

### Facebook posting fails

**Solution:**
1. Check token is set in `.env`
2. Check page ID is correct: `1233961369780982`
3. Check article has all required fields
4. Check internet connection
5. Try posting a simpler article (fewer special characters)
6. See "Facebook Integration" section above

---

## ⌨️ Keyboard Shortcuts

### Reader

| Key | Action |
|-----|--------|
| `/` | Open search |
| `Escape` | Close modals |
| `←` / `→` | Next/previous article |
| `D` | Toggle dark mode |

### Administrator

| Key | Action |
|-----|--------|
| `Ctrl+S` | Save article (when editing) |
| `Ctrl+B` | Bold text (in editor) |
| `Ctrl+I` | Italic text (in editor) |
| `Escape` | Cancel editing |
| `?` | Show all shortcuts |

---

## 📞 Getting Help

**For Technical Issues:**
- Check this User Manual first
- Check [CHANGELOG.md](CHANGELOG.md) for recent updates
- Check [README.md](README.md) for setup information

**For Account Issues:**
- Contact admin email: hawainnkhabaru@gmail.com
- Provide details about the issue
- Include browser and device information

**For Bug Reports:**
- Describe what happened
- Include error messages
- Include browser version
- Include steps to reproduce

---

## 📋 FAQ

**Q: How often do articles update?**  
A: Articles are published immediately when admin creates them. Check back throughout the day for new news.

**Q: Can I share articles?**  
A: Yes! Click the Share button on any article to share via WhatsApp, Email, Facebook, or copy the link.

**Q: Is my data private?**  
A: Yes. The app only tracks visits (anonymously) and your reading history (stored locally in your browser).

**Q: Can I download articles?**  
A: The app works offline once loaded. Install as PWA to download articles automatically.

**Q: How are comments moderated?**  
A: Comments are reviewed by administrators before appearing publicly.

**Q: Can I change my password?**  
A: Currently passwords are managed by admin. Contact admin for password changes.

**Q: Will there be an iOS native app?**  
A: The PWA works like a native app on iOS. No need for separate app store installation.

---

## 📝 Version

This manual is for **Hawainn Khabaru v2.1.0** (July 2026)

Last updated: July 7, 2026
