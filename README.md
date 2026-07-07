# Hawainn Khabaru - Modern Maldives News Portal

A production-ready news portal with full Dhivehi RTL support, PWA capabilities, admin dashboard, and **automatic Facebook integration with serverless backend**.

## ✨ Features

### User-Facing
- 📱 **Mobile-first Progressive Web App** - Install as native app
- 🌙 **Dark mode support** - Comfortable reading any time
- 🔤 **Full Dhivehi RTL support** - Native language experience with custom fonts
- 📰 **Article categories** - Home, Education, Sports, Politics, Business, Entertainment
- 🎥 **Video content** - Embedded video support
- 📲 **Push notifications** - Real-time news updates
- 💬 **User profiles** - Comment history and preferences
- ⚡ **Fast performance** - Optimized for slow networks

### Admin Dashboard
- ✍️ **Article management** - Create, edit, delete articles with rich editor
- 📸 **Image uploads** - Cloudinary integration for fast image delivery
- 📊 **Analytics** - Visitor tracking, page engagement, traffic insights
- 🔐 **Access control** - Admin-only dashboard with email authentication
- 📤 **Auto-posting to Facebook** - Articles automatically post to Facebook when published
- 🔄 **Token management** - Automatic Facebook token refresh

### Technical Stack
- **Frontend**: React 18.3.1 + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Vercel Functions (serverless)
- **Database**: Firebase Firestore (NoSQL)
- **Media**: Cloudinary image hosting
- **Social**: Facebook Graph API integration
- **Hosting**: Vercel (frontend + serverless backend)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Cloudinary account
- Facebook Page + App (for auto-posting)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/visionadee-cmyk/hawainn-khabaru.git
   cd hawainn-khabaru
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add:
   - Firebase credentials
   - Cloudinary settings
   - Facebook API keys

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access the app**
   - Frontend: http://localhost:5173
   - Admin: http://localhost:5173/admin

## 📖 Documentation

- [USER_MANUAL.md](USER_MANUAL.md) - How to use the app as a reader and admin
- [CHANGELOG.md](CHANGELOG.md) - Version history and recent updates
- [FACEBOOK_TOKEN_SETUP.md](FACEBOOK_TOKEN_SETUP.md) - Facebook integration setup

## 🔐 Admin Access

Email: `hawainnkhabaru@gmail.com`  
Password: `Adhu1447`

Navigate to `/admin` to access the admin dashboard.

## 📊 Analytics

The app tracks:
- **Visitor analytics** - Visit counts, unique visitors, visitor details
- **Article engagement** - Views, shares, comments
- **Facebook page stats** - Page likes, followers, post engagement (if Facebook integrated)

## 🔄 Automatic Facebook Posting

When an admin creates an article:
1. Article saves to Firestore
2. Automatically posts to Facebook page
3. Includes article title, excerpt, featured image
4. Token automatically refreshes before posting
5. No manual Facebook posting needed

**Note:** Requires Facebook Page Access Token configured in environment.

## 📦 Build & Deploy

### Build for production
```bash
npm run build
```

### Deploy to Vercel
```bash
git push origin master
```

Vercel automatically detects:
- React app in `src/`
- Serverless functions in `api/`
- Environment variables from Vercel dashboard

## 📁 Project Structure

```
.
├── src/                      # React frontend
│   ├── pages/               # Page components
│   ├── components/          # Reusable components
│   ├── utils/               # Utility functions
│   └── data/                # Mock data & translations
├── api/                     # Vercel serverless functions
│   └── facebook/            # Facebook API routes
├── public/                  # Static assets
└── server.mjs              # Legacy Express server (can be deleted)
```

## 🌐 Environment Variables

**Frontend (VITE_ prefix)**
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_CLOUDINARY_CLOUD_NAME
- VITE_CLOUDINARY_API_KEY
- VITE_CLOUDINARY_UPLOAD_PRESET
- VITE_APP_URL

**Backend (Vercel Functions)**
- FACEBOOK_PAGE_ID
- FACEBOOK_PAGE_ACCESS_TOKEN
- FACEBOOK_APP_ID
- FACEBOOK_APP_SECRET
- PORT (optional, defaults to 3001)

## 🛠️ Development

### Local Testing with Facebook Functions
For local testing, use the legacy Express server:
```bash
node server.mjs
```

For production, Vercel Functions in `/api/facebook/` are used automatically.

### Build TypeScript
```bash
npm run build
```

### Check for errors
```bash
npm run lint
```

## 📝 License

Proprietary - Hawainn Khabaru News Portal

## 🤝 Support

For issues or questions, contact the development team.

## 🎉 Recent Updates

- ✅ Migrated backend to Vercel Functions (no external server needed)
- ✅ Automatic Facebook token refresh
- ✅ Auto-posting articles to Facebook
- ✅ Environment variables in Vercel dashboard
- ✅ Fully serverless deployment

See [CHANGELOG.md](CHANGELOG.md) for full history.
