# Ah'dhamu

Modern Maldives news portal with full Dhivehi RTL support, mobile-first PWA UI, desktop newsroom layout, shared Firebase backend, and admin dashboard.

## Features

- Mobile-first Progressive Web App experience
- Desktop news portal layout
- Full Dhivehi RTL support with custom font
- Tailwind CSS + Framer Motion animations
- Firebase Auth + Firestore backend
- Cloudinary image upload support
- PWA install support with service worker
- Admin dashboard for article management
- SEO meta tags, sitemap, robots, and fast caching

## Local development

1. Copy the font file to `public/fonts/Dhivehi.ttf`
2. Create `.env` from `.env.example`
3. Add your Firebase credentials to `.env`
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Admin credentials

- Email: `hawainnkhabaru@gmail.com`
- Password: `Adhu1447`

Use `/admin` to sign in and add news directly from the dashboard.

## Visitor analytics

- The home page now tracks visitor visits into Firestore `visitors` collection.
- Admin dashboard displays total visits, unique visitor details, and the latest visitor logs.

## Recommended tooling

- Install React DevTools for your browser: https://reactjs.org/link/react-devtools
- Use the browser console to verify Firebase auth config and API key values.

## Build

```bash
npm run build
```

## Deployment

- Host frontend on Vercel
- Configure Firebase project for Authentication and Firestore
- Configure Cloudinary upload preset

## Firebase backend structure

Collections:
- users
- articles
- categories
- comments
- notifications
- trending

## Notes

- The app registers `public/sw.js` for offline support.
- Use `public/logo.png` as the PWA icon.
- Install the app from a supported browser for mobile PWA mode.
