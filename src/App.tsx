import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Videos from './pages/Videos';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import ArticlePage from './pages/ArticlePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import DesktopNav from './components/DesktopNav';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';



import AdBanner from './components/AdBanner';
import NewsTicker from './components/NewsTicker';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'en' | 'dv'>('dv');
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdBanner />
      <NewsTicker />
      <DesktopNav theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} />
      <BottomNav 
        links={[
          { label: language === 'en' ? 'Home' : 'މަހު', path: '/' },
          { label: language === 'en' ? 'Categories' : 'ކެޓަގަރީ', path: '/categories' },
          { label: language === 'en' ? 'Videos' : 'ވިޑިއޯ', path: '/videos' },
          { label: language === 'en' ? 'Notifications' : 'ނައިފިރިކަން', path: '/notifications' },
          { label: language === 'en' ? 'Profile' : 'ޕްރޮފައިލް', path: '/profile' },
        ]}
        activePath={location.pathname}
      />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mx-auto max-w-[1600px] px-4 pb-24 pt-24 lg:px-6"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
