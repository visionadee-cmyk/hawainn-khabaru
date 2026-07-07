# Changelog

All notable changes to the Hawainn Khabaru news portal are documented in this file.

## [2.1.0] - 2026-07-07 - Serverless Backend Migration

### 🚀 Major Changes
- **Migrated backend to Vercel Functions** - No external server required anymore
- All API endpoints now run as serverless functions on Vercel
- Single deployment platform for frontend and backend (everything on Vercel)
- Automatic scaling with zero configuration

### ✨ New Features
- **Automatic Facebook Token Refresh** - Tokens automatically refresh before each Facebook operation
  - No more manual token updates needed
  - Tokens persist to `.env` automatically
  - Works with long-lived tokens (60-day expiration)
- **Auto-Posting to Facebook** - Articles automatically post to Facebook when created
  - Admin creates article → appears on Facebook page instantly
  - Includes article title, excerpt, featured image, and link
  - Non-blocking (failures don't prevent article creation)
- **Manual Token Refresh Endpoint** - POST `/api/facebook/refresh-token` to manually refresh

### 🔧 Technical Changes
- Created `/api/facebook/` directory with Vercel Functions:
  - `post.mjs` - POST endpoint for creating Facebook posts
  - `[postId].mjs` - DELETE endpoint for removing Facebook posts
  - `insights.mjs` - GET endpoint for Facebook page analytics
  - `refresh-token.mjs` - POST endpoint for manual token refresh
- Updated frontend to use relative API routes (`/api/facebook/...`)
- All functions handle CORS automatically
- Token refresh happens transparently before each operation

### 📝 Updated Files
- `README.md` - Complete rewrite with current features
- `src/utils/facebook.ts` - Updated to use Vercel Functions
- `src/pages/AdminDashboard.tsx` - Auto-posting on article creation
- `.env.example` - Added Facebook configuration template

### 🐛 Fixes
- Fixed TypeScript type annotation in server endpoint (server.mjs)
- CRLF/LF line ending warning resolved

### 📦 Deployment
- ✅ Changes pushed to GitHub (commit `5603dd6`)
- ✅ Vercel auto-deploys on git push
- ✅ No credit card required - uses Vercel free tier
- ✅ All environment variables configured in Vercel dashboard

### 🔐 Security
- Facebook credentials stored server-side only
- No sensitive data in frontend code
- Token refresh happens on backend
- `.env` file properly ignored in git

---

## [2.0.0] - 2026-07-06 - Facebook Integration & Token Refresh

### ✨ New Features
- **Facebook Auto-Posting** - Articles automatically posted to Facebook
  - When admin creates an article, it posts to Facebook page
  - Includes title, excerpt, image, and article link
- **Server-Side Token Refresh** - Automatic token refresh mechanism
  - Token exchanges before each Facebook operation
  - Extends token validity automatically
  - Fallback to current token if refresh fails

### 🔧 Technical Changes
- Added `saveAccessToken()` function to persist tokens
- Added `getValidPageAccessToken()` for auto-refresh
- New `/api/facebook/refresh-token` endpoint
- Modified POST, DELETE, and GET endpoints to refresh tokens

### 📝 Updated Files
- `server.mjs` - Token refresh implementation
- `src/pages/AdminDashboard.tsx` - Auto-posting logic
- `src/utils/facebook.ts` - Updated API calls
- `.env.example` - Facebook configuration

### 💾 Database Updates
- Facebook Page ID: 1233961369780982
- App ID: 2209454326568914

### 🚀 Deployment
- Express backend running on port 3001
- Token refresh before every Facebook operation
- Tokens persisted to `.env` for next server restart

---

## [1.5.0] - Previous Release

### Features
- Mobile-first PWA
- Admin dashboard
- Firebase backend
- Cloudinary integration
- Article management
- Category system
- Visitor analytics
- Push notifications
- Dark mode
- Dhivehi RTL support

---

## Version Format

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** - Breaking changes
- **MINOR** - New features, backwards compatible
- **PATCH** - Bug fixes

## Future Roadmap

- [ ] Comment system integration with Facebook comments
- [ ] Social sharing buttons
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advertisement integration
- [ ] Email newsletter subscription
- [ ] Trending topics widget
- [ ] Related articles recommendations

## Notes

- Facebook tokens have 60-day expiration (auto-refreshed)
- Vercel free tier includes up to 2M function invocations/month
- All dependencies kept up to date via npm
