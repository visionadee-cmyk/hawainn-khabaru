import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { categories } from '../data/mockData';
import { postToFacebook, deleteFromFacebook } from '../utils/facebook';

type AdminTab = 'articles' | 'manage' | 'analytics' | 'settings';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [articlesCount, setArticlesCount] = useState(0);
  const [articles, setArticles] = useState<any[]>([]);
  const [visitorDetails, setVisitorDetails] = useState<any[]>([]);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [activeTab, setActiveTab] = useState<AdminTab>('articles');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'en' | 'dv'>('dv');

  const translations = {
    en: {
      adminPanel: 'Admin Panel',
      adminDashboard: 'Admin Dashboard',
      news: 'News',
      visits: 'Visits',
      logout: 'Logout',
      createNews: 'Create News',
      analytics: 'Analytics',
      settings: 'Settings',
      newsDescription: 'Create and publish news articles.',
      title: 'Title',
      titleDv: 'Title (Dhivehi)',
      category: 'Category',
      excerpt: 'Excerpt',
      excerptDv: 'Excerpt (Dhivehi)',
      photoUrl: 'Photo URL',
      readingTime: 'Reading Time',
      newsContent: 'News Content',
      paragraph1: 'Paragraph 1',
      paragraph1Dv: 'Paragraph 1 (Dhivehi)',
      paragraph2: 'Paragraph 2 (optional)',
      paragraph2Dv: 'Paragraph 2 (Dhivehi - optional)',
      paragraph3: 'Paragraph 3 (optional)',
      paragraph3Dv: 'Paragraph 3 (Dhivehi - optional)',
      paragraph1En: 'Paragraph 1 (English)',
      paragraph2En: 'Paragraph 2 (English - optional)',
      paragraph3En: 'Paragraph 3 (English - optional)',
      trending: 'Trending',
      breaking: 'Breaking',
      submit: 'Submit News',
      submitting: 'Submitting...',
      totalNews: 'Total News',
      totalVisits: 'Total Visits',
      uniqueVisitors: 'Unique Visitors',
      visitorLog: 'Visitor Log',
      noVisitors: 'No visitors',
      translateTitle: 'English to Dhivehi Translation',
      translateDesc: 'Type or paste English text to translate to Dhivehi.',
      englishPlaceholder: 'Type English text here...',
      translate: 'Translate',
      translating: 'Translating...',
      dhivehi: 'Dhivehi',
      copy: 'Copy',
      loading: 'Loading...',
      notLoggedIn: 'Not logged in',
      pleaseLogin: 'Please login to access admin console.',
      typeEnglish: 'Please type English text.',
      translated: 'Translation complete.',
      translateError: 'Translation failed. Please try again.',
      copied: 'Copied to clipboard.',
      newsCreated: 'News created successfully!',
      newsError: 'Failed to create news. Please try again.',
      changePassword: 'Change Password',
      changePasswordDesc: 'Change your account password.',
      change: 'Change',
      deleteAccount: 'Delete Account',
      deleteAccountDesc: 'Delete your account and data.',
      delete: 'Delete',
      manageNews: 'Manage News',
      deleteNews: 'Delete News',
      deleteNewsDesc: 'Delete news articles from the system.',
      confirmDelete: 'Are you sure you want to delete this article?',
      newsDeleted: 'News deleted successfully!',
      newsDeleteError: 'Failed to delete news. Please try again.',
      postToFb: 'Post to FB',
      postingToFb: 'Posting...',
      postedToFb: 'Posted to Facebook!',
      postToFbError: 'Failed to post to Facebook. Please try again.',
      editNews: 'Edit News',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      newsUpdated: 'News updated successfully!',
      newsUpdateError: 'Failed to update news. Please try again.',
    },
    dv: {
      adminPanel: 'އެޑްމިން ޕެނަލް',
      adminDashboard: 'އެޑްމިން ޑޭޝްބޯޑް',
      news: 'ޚަބަރު',
      visits: 'ޒިޔާރަތްތައް',
      logout: 'ލޮގްއައުޓް',
      createNews: 'ޚަބަރު އުފައްދާ',
      analytics: 'ތަޙުލީލް',
      settings: 'ސެޓިންގްސް',
      newsDescription: 'ޚަބަރު ލިޔުމަށާއި ޝާއިޢު ކުރުމަށް',
      title: 'ސުރުޚީ',
      titleDv: 'ސުރުޚީ (ދިވެހި)',
      category: 'ބައި',
      excerpt: 'ކުރު ޚުލާސާ',
      excerptDv: 'ކުރު ޚުލާސާ (ދިވެހި)',
      photoUrl: 'ފޮޓޯ URL',
      readingTime: 'ކިޔާލުމަށް ނަގާ ވަގުތު',
      newsContent: 'ޚަބަރުގެ މައިގަނޑު',
      paragraph1: 'ޕެރެގްރާފް 1',
      paragraph1Dv: 'ޕެރެގްރާފް 1 (ދިވެހި)',
      paragraph2: 'ޕެރެގްރާފް 2 (އިޚްތިޔާރީ)',
      paragraph2Dv: 'ޕެރެގްރާފް 2 (ދިވެހި - އިޚްތިޔާރީ)',
      paragraph3: 'ޕެރެގްރާފް 3 (އިޚްތިޔާރީ)',
      paragraph3Dv: 'ޕެރެގްރާފް 3 (ދިވެހި - އިޚްތިޔާރީ)',
      paragraph1En: 'ޕެރެގްރާފް 1 (އިނގިރޭސި)',
      paragraph2En: 'ޕެރެގްރާފް 2 (އިނގިރޭސި - އިޚްތިޔާރީ)',
      paragraph3En: 'ޕެރެގްރާފް 3 (އިނގިރޭސި - އިޚްތިޔާރީ)',
      trending: 'މަޝްހޫރު',
      breaking: 'އެންމެ ފަހުގެ',
      submit: 'ޚަބަރު ފޮނުވާ',
      submitting: 'ފޮނުވަނީ...',
      totalNews: 'ޖުމްލަ ޚަބަރު',
      totalVisits: 'ޖުމްލަ ޒިޔާރަތް',
      uniqueVisitors: 'ތަފާތު ޒިޔާރަތްތެރިން',
      visitorLog: 'ޒިޔާރަތް ލޮގް',
      noVisitors: 'ޒިޔާރަތްތެރިން ނެތް',
      translateTitle: 'އިނގިރޭސިން ދިވެހިއަށް ތަރުޖަމާ',
      translateDesc: 'އިނގިރޭސި ލިޔުން ލިޔާ ނުވަތަ ޕޭސްޓް ކުރޭ',
      englishPlaceholder: 'މިތާނގައި އިނގިރޭސި ލިޔުން ލިޔާ...',
      translate: 'ތަރުޖަމާ ކުރޭ',
      translating: 'ތަރުޖަމާ ކުރަނީ...',
      dhivehi: 'ދިވެހި',
      copy: 'ކޮޕީ',
      loading: 'ލޯޑް ވަނީ...',
      notLoggedIn: 'ލޮގްއިން ނުވެފަ',
      pleaseLogin: 'އެޑްމިން ކޮންސޯލް ބެލުމަށް ލޮގްއިން ކުރޭ',
      typeEnglish: 'އިނގިރޭސި ލިޔުން ލިޔާ',
      translated: 'ތަރުޖަމާ ނިމިއްޖެ',
      translateError: 'ތަރުޖަމާ ކުރުމަށް ފެއިލް ވެއްޖެ. އަލުން މަސައްކަތް ކުރޭ',
      copied: 'ކްލިޕްބޯޑަށް ކޮޕީ ކުރެވިއްޖެ',
      newsCreated: 'ޚަބަރު ކުރެވިއްޖެ',
      newsError: 'ޚަބަރު ކުރުމަށް ފެއިލް ވެއްޖެ. އަލުން މަސައްކަތް ކުރޭ',
      changePassword: 'ޕާސްވޯޑް ބަދަލް ކުރޭ',
      changePasswordDesc: 'އަށް ޕާސްވޯޑް ބަދަލް ކުރޭ',
      change: 'ބަދަލް ކުރޭ',
      deleteAccount: 'އެކައުންޓް ޑިލީޓް ކުރޭ',
      deleteAccountDesc: 'އެކައުންޓް އަދި ޑޭޓާ ޑިލީޓް ކުރޭ',
      delete: 'ޑިލީޓް',
      manageNews: 'ޚަބަރު މެނޭޖް ކުރޭ',
      deleteNews: 'ޚަބަރު ޑިލީޓް ކުރޭ',
      deleteNewsDesc: 'ޚަބަރު ސިސްޓަމްއިން ޑިލީޓް ކުރޭ',
      confirmDelete: 'މި ޚަބަރު ޑިލީޓް ކުރާނީތަ؟',
      newsDeleted: 'ޚަބަރު ޑިލީޓް ކުރެވިއްޖެ',
      newsDeleteError: 'ޚަބަރު ޑިލީޓް ކުރުމަށް ފެއިލް ވެއްޖެ',
      postToFb: 'Facebook އަށް ޕޯސްޓް ކުރޭ',
      postingToFb: 'ޕޯސްޓް ކުރަނީ...',
      postedToFb: 'Facebook އަށް ޕޯސްޓް ކުރެވިއްޖެ',
      postToFbError: 'Facebook އަށް ޕޯސްޓް ކުރުމަށް ފެއިލް ވެއްޖެ',
      editNews: 'ޚަބަރު އެޑިޓް ކުރޭ',
      saveChanges: 'ބަދަލް ސޭވް ކުރޭ',
      cancel: 'ކެންސަލް',
      newsUpdated: 'ޚަބަރު އަޕްޑޭޓް ކުރެވިއްޖެ',
      newsUpdateError: 'ޚަބަރު އަޕްޑޭޓް ކުރުމަށް ފެއިލް ވެއްޖެ',
    },
  };

  const t = translations[language];

  const [title, setTitle] = useState('');
  const [titleDv, setTitleDv] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptDv, setExcerptDv] = useState('');
  const [category, setCategory] = useState(categories[0].id);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80');
  const [readingTime, setReadingTime] = useState(language === 'en' ? '5 min' : '5މިނިޓް');
  const [body1, setBody1] = useState('');
  const [body1Dv, setBody1Dv] = useState('');
  const [body2, setBody2] = useState('');
  const [body2Dv, setBody2Dv] = useState('');
  const [body3, setBody3] = useState('');
  const [body3Dv, setBody3Dv] = useState('');
  const [trending, setTrending] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [englishText, setEnglishText] = useState('');
  const [dhivehiText, setDhivehiText] = useState('');
  const [translating, setTranslating] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTitleDv, setEditTitleDv] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editExcerptDv, setEditExcerptDv] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editBody1, setEditBody1] = useState('');
  const [editBody1Dv, setEditBody1Dv] = useState('');
  const [editBody2, setEditBody2] = useState('');
  const [editBody2Dv, setEditBody2Dv] = useState('');
  const [editBody3, setEditBody3] = useState('');
  const [editBody3Dv, setEditBody3Dv] = useState('');
  const [editTrending, setEditTrending] = useState(false);
  const [editBreaking, setEditBreaking] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light', theme === 'light');
  }, [theme]);

  const loadDashboard = async () => {
    try {
      const articleSnapshot = await getDocs(query(collection(db, 'articles'), orderBy('createdAt', 'desc'), limit(20)));
      const articlesData = articleSnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
      setArticles(articlesData);
      setArticlesCount(articleSnapshot.size);
      const visitorQuery = query(collection(db, 'visitors'), orderBy('timestamp', 'desc'), limit(100));
      const visitorSnapshot = await getDocs(visitorQuery);
      const visitors = visitorSnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
      setVisitorDetails(visitors);
      setUniqueVisitors(new Set(visitors.map((item: any) => item.userAgent || item.referrer || item.path)).size);
    } catch (error) {
      console.warn('Unable to load dashboard data', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        loadDashboard();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTranslate = async () => {
    if (!englishText.trim()) {
      setMessage(t.typeEnglish);
      return;
    }
    setTranslating(true);
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishText)}&langpair=en|dv`
      );
      const data = await response.json();
      if (data.responseStatus === 200) {
        setDhivehiText(data.responseData.translatedText);
        setMessage(t.translated);
      } else {
        setMessage(t.translateError);
      }
    } catch (error) {
      setMessage(t.translateError);
      console.error(error);
    } finally {
      setTranslating(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setMessage(t.logout);
    navigate('/admin');
  };

  const handleCreateArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setMessage(t.notLoggedIn);
      return;
    }

    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'articles'), {
        title: titleDv || title,
        titleEn: title,
        excerpt: excerptDv || excerpt,
        excerptEn: excerpt,
        category,
        image: imageUrl,
        publishedAt: new Date().toLocaleDateString('dv'),
        author: user.email || 'admin',
        views: 0,
        readingTime,
        body: [body1Dv, body2Dv, body3Dv].filter(Boolean),
        bodyEn: [body1, body2, body3].filter(Boolean),
        trending,
        breaking,
        createdAt: serverTimestamp(),
      });
      
      setMessage(t.newsCreated);
      setTitle('');
      setTitleDv('');
      setExcerpt('');
      setExcerptDv('');
      setImageUrl('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80');
      setBody1('');
      setBody1Dv('');
      setBody2('');
      setBody2Dv('');
      setBody3('');
      setBody3Dv('');
      setTrending(false);
      setBreaking(false);
      loadDashboard();
    } catch (error) {
      setMessage(t.newsError);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArticle = async (articleId: string, facebookPostId?: string) => {
    if (!confirm(t.confirmDelete)) {
      return;
    }

    try {
      // Delete from Facebook if post ID exists
      if (facebookPostId) {
        const fbResult = await deleteFromFacebook(facebookPostId);
        if (!fbResult.success) {
          console.error('Failed to delete from Facebook:', fbResult.error);
        }
      }

      // Delete from Firebase
      await deleteDoc(doc(db, 'articles', articleId));
      
      setMessage(t.newsDeleted);
      loadDashboard();
    } catch (error) {
      setMessage(t.newsDeleteError);
      console.error(error);
    }
  };

  const handlePostToFacebook = async (article: any) => {
    if (article.facebookPostId) {
      setMessage('Already posted to Facebook');
      return;
    }

    try {
      const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      const articleUrl = `${appUrl}/article/${article.id}`;
      // Use Dhivehi text for Facebook posting, fallback to English if not available
      const fbTitle = article.title || article.titleEn;
      const fbExcerpt = article.excerpt || article.excerptEn;
      const fbResult = await postToFacebook(fbTitle, fbExcerpt, article.image, articleUrl);
      
      if (fbResult.success && fbResult.postId) {
        // Store Facebook post ID in the article document
        await updateDoc(doc(db, 'articles', article.id), { facebookPostId: fbResult.postId });
        setMessage(t.postedToFb);
        loadDashboard();
      } else {
        setMessage(t.postToFbError);
        console.error('Failed to post to Facebook:', fbResult.error);
      }
    } catch (error) {
      setMessage(t.postToFbError);
      console.error(error);
    }
  };

  const handleEditArticle = (article: any) => {
    setEditingArticle(article);
    setEditTitle(article.titleEn || '');
    setEditTitleDv(article.title || '');
    setEditExcerpt(article.excerptEn || '');
    setEditExcerptDv(article.excerpt || '');
    setEditImageUrl(article.image || '');
    setEditCategory(article.category || '');
    setEditBody1(article.bodyEn?.[0] || '');
    setEditBody1Dv(article.body?.[0] || '');
    setEditBody2(article.bodyEn?.[1] || '');
    setEditBody2Dv(article.body?.[1] || '');
    setEditBody3(article.bodyEn?.[2] || '');
    setEditBody3Dv(article.body?.[2] || '');
    setEditTrending(article.trending || false);
    setEditBreaking(article.breaking || false);
  };

  const handleSaveEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingArticle) return;

    try {
      await updateDoc(doc(db, 'articles', editingArticle.id), {
        title: editTitleDv || editTitle,
        titleEn: editTitle,
        excerpt: editExcerptDv || editExcerpt,
        excerptEn: editExcerpt,
        image: editImageUrl,
        category: editCategory,
        body: [editBody1Dv, editBody2Dv, editBody3Dv].filter(Boolean),
        bodyEn: [editBody1, editBody2, editBody3].filter(Boolean),
        trending: editTrending,
        breaking: editBreaking,
      });

      setMessage(t.newsUpdated);
      setEditingArticle(null);
      loadDashboard();
    } catch (error) {
      setMessage(t.newsUpdateError);
      console.error(error);
    }
  };

  const visitorCount = visitorDetails.length;
  const topVisitors = visitorDetails.slice(0, 8);

  if (user === undefined) {
    return (
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-8 shadow-soft text-right">
        <h2 className="text-2xl font-semibold text-white">{t.loading}</h2>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-8 shadow-soft text-right">
        <h2 className="text-2xl font-semibold text-white">{t.notLoggedIn}</h2>
        <p className="mt-4 text-slate-400">{t.pleaseLogin}</p>
      </div>
    );
  }

  return (
    <motion.div className="space-y-8 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">{t.adminPanel}</p>
            <h2 className="mt-2 text-3xl font-bold text-white">{t.adminDashboard}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'dv' : 'en')}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-300 transition hover:border-slate-500 hover:text-white"
              aria-label="Toggle language"
              title="Toggle language"
            >
              {language === 'en' ? '🇬🇧' : '🇲🇻'}
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-300 transition hover:border-slate-500 hover:text-white"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            {user && (
            <div className="rounded-3xl bg-slate-950/90 p-4 text-sm text-slate-300 shadow-soft">
              <p>{t.news}: {articlesCount}</p>
              <p>{t.visits}: {visitorCount}</p>
              <button
                onClick={handleLogout}
                className="mt-3 w-full rounded-2xl border border-rose-600 px-3 py-2 text-rose-400 transition hover:bg-rose-600/20"
              >
                {t.logout}
              </button>
            </div>
          )}
          </div>
        </div>
        {message && (
          <div className="mt-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm text-cyan-400">
            {message}
          </div>
        )}
      </div>

      {/* Admin Content */}
      <>
        {/* Tabs */}
        <div className="flex gap-3 border-b border-slate-800 pb-4">
          {(['articles', 'manage', 'analytics', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? 'bg-brand-500 text-slate-950'
                  : 'border border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {tab === 'articles' && t.createNews}
              {tab === 'manage' && t.manageNews}
              {tab === 'analytics' && t.analytics}
              {tab === 'settings' && t.settings}
            </button>
          ))}
        </div>

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
            <h3 className="text-2xl font-bold text-white">{t.createNews}</h3>
            <p className="mt-2 text-sm text-slate-400">{t.newsDescription}</p>
            <form onSubmit={handleCreateArticle} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.titleDv}</label>
                  <input
                    value={titleDv}
                    onChange={(e) => setTitleDv(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder={t.titleDv}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.title}</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder={t.title}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300">{t.category}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {language === 'en' ? cat.titleEn : cat.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300">{t.excerptDv}</label>
                <input
                  value={excerptDv}
                  onChange={(e) => setExcerptDv(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  placeholder={t.excerptDv}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300">{t.excerpt}</label>
                <input
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  placeholder={t.excerpt}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.photoUrl}</label>
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder="https://..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.readingTime}</label>
                  <input
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder={language === 'en' ? '5 min' : '5 މިނިޓް'}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">{t.paragraph1}</label>
                <textarea
                  value={body1Dv}
                  onChange={(e) => setBody1Dv(e.target.value)}
                  className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  placeholder={t.paragraph1}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">{t.paragraph1En}</label>
                <textarea
                  value={body1}
                  onChange={(e) => setBody1(e.target.value)}
                  className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  placeholder={t.paragraph1En}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">{t.paragraph2}</label>
                  <textarea
                    value={body2Dv}
                    onChange={(e) => setBody2Dv(e.target.value)}
                    className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder={t.paragraph2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">{t.paragraph2En}</label>
                  <textarea
                    value={body2}
                    onChange={(e) => setBody2(e.target.value)}
                    className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder={t.paragraph2En}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">{t.paragraph3}</label>
                  <textarea
                    value={body3Dv}
                    onChange={(e) => setBody3Dv(e.target.value)}
                    className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder={t.paragraph3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">{t.paragraph3En}</label>
                  <textarea
                    value={body3}
                    onChange={(e) => setBody3(e.target.value)}
                    className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder={t.paragraph3En}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={trending}
                    onChange={(e) => setTrending(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                  />
                  {t.trending}
                </label>
                <label className="inline-flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={breaking}
                    onChange={(e) => setBreaking(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                  />
                  {t.breaking}
                </label>
              </div>
              <button
                disabled={submitting}
                className="w-full rounded-3xl bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? t.submitting : t.submit}
              </button>
            </form>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
            <h3 className="text-2xl font-bold text-white">{t.manageNews}</h3>
            <p className="mt-2 text-sm text-slate-400">{t.deleteNewsDesc}</p>
            <div className="mt-6 space-y-3">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <div key={article.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{article.title}</h4>
                        <p className="mt-1 text-xs text-slate-400">{article.publishedAt}</p>
                        {article.facebookPostId ? (
                          <p className="mt-1 text-xs text-emerald-400">✓ Posted to Facebook</p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-500">Not posted to Facebook</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!article.facebookPostId && (
                          <button
                            onClick={() => handlePostToFacebook(article)}
                            className="rounded-xl border border-blue-600 px-3 py-1.5 text-sm text-blue-400 transition hover:bg-blue-600/20"
                          >
                            {t.postToFb}
                          </button>
                        )}
                        <button
                          onClick={() => handleEditArticle(article)}
                          className="rounded-xl border border-emerald-600 px-3 py-1.5 text-sm text-emerald-400 transition hover:bg-emerald-600/20"
                        >
                          {t.editNews}
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id, article.facebookPostId)}
                          className="rounded-xl border border-rose-600 px-3 py-1.5 text-sm text-rose-400 transition hover:bg-rose-600/20"
                        >
                          {t.delete}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">{t.noVisitors}</p>
              )}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
              <h3 className="text-2xl font-bold text-white">{t.editNews}</h3>
              <form onSubmit={handleSaveEdit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300">{t.titleDv}</label>
                    <input
                      value={editTitleDv}
                      onChange={(e) => setEditTitleDv(e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                      placeholder={t.titleDv}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300">{t.title}</label>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                      placeholder={t.title}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.category}</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {language === 'en' ? cat.titleEn : cat.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.excerptDv}</label>
                  <input
                    value={editExcerptDv}
                    onChange={(e) => setEditExcerptDv(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder={t.excerptDv}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.excerpt}</label>
                  <input
                    value={editExcerpt}
                    onChange={(e) => setEditExcerpt(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder={t.excerpt}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.photoUrl}</label>
                  <input
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder="https://..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">{t.paragraph1}</label>
                  <textarea
                    value={editBody1Dv}
                    onChange={(e) => setEditBody1Dv(e.target.value)}
                    className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder={t.paragraph1}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">{t.paragraph1En}</label>
                  <textarea
                    value={editBody1}
                    onChange={(e) => setEditBody1(e.target.value)}
                    className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder={t.paragraph1En}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">{t.paragraph2}</label>
                    <textarea
                      value={editBody2Dv}
                      onChange={(e) => setEditBody2Dv(e.target.value)}
                      className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                      placeholder={t.paragraph2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">{t.paragraph2En}</label>
                    <textarea
                      value={editBody2}
                      onChange={(e) => setEditBody2(e.target.value)}
                      className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                      placeholder={t.paragraph2En}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">{t.paragraph3}</label>
                    <textarea
                      value={editBody3Dv}
                      onChange={(e) => setEditBody3Dv(e.target.value)}
                      className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                      placeholder={t.paragraph3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">{t.paragraph3En}</label>
                    <textarea
                      value={editBody3}
                      onChange={(e) => setEditBody3(e.target.value)}
                      className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                      placeholder={t.paragraph3En}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={editTrending}
                      onChange={(e) => setEditTrending(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                    />
                    {t.trending}
                  </label>
                  <label className="inline-flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={editBreaking}
                      onChange={(e) => setEditBreaking(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                    />
                    {t.breaking}
                  </label>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-3xl bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-400"
                  >
                    {t.saveChanges}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="flex-1 rounded-3xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/80"
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
              <h3 className="text-xl font-semibold text-white">{t.analytics}</h3>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-950/80 p-4">
                  <p className="text-sm text-slate-400">{t.totalNews}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{articlesCount}</p>
                </div>
                <div className="rounded-2xl bg-slate-950/80 p-4">
                  <p className="text-sm text-slate-400">{t.totalVisits}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{visitorCount}</p>
                </div>
                <div className="rounded-2xl bg-slate-950/80 p-4">
                  <p className="text-sm text-slate-400">{t.uniqueVisitors}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{uniqueVisitors}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
              <h3 className="text-xl font-semibold text-white">{t.visitorLog}</h3>
              <div className="mt-4 space-y-3 text-sm">
                {topVisitors.length > 0 ? (
                  topVisitors.map((visitor) => (
                    <div key={visitor.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                      <p className="font-semibold text-white">{visitor.path || 'Home'}</p>
                      <p className="mt-1 text-xs text-slate-500">{visitor.language || 'Unknown'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">{t.noVisitors}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
            <h3 className="text-2xl font-bold text-white">{t.settings}</h3>
            <div className="mt-6 space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white">{t.translateTitle}</h4>
                <p className="mt-2 text-sm text-slate-400">{t.translateDesc}</p>
                <div className="mt-4 space-y-3">
                  <textarea
                    value={englishText}
                    onChange={(e) => setEnglishText(e.target.value)}
                    className="min-h-[80px] w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder={t.englishPlaceholder}
                  />
                  <button
                    onClick={handleTranslate}
                    disabled={translating || !englishText.trim()}
                    className="w-full rounded-2xl bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {translating ? t.translating : t.translate}
                  </button>
                  {dhivehiText && (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                      <p className="text-sm font-semibold text-emerald-400 mb-2">{t.dhivehi}:</p>
                      <p className="text-slate-100">{dhivehiText}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(dhivehiText);
                          setMessage(t.copied);
                        }}
                        className="mt-3 rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800/80"
                      >
                        {t.copy}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white">{t.changePassword}</h4>
                <p className="mt-2 text-sm text-slate-400">{t.changePasswordDesc}</p>
                <button className="mt-4 rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/80">
                  {t.change}
                </button>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white">{t.deleteAccount}</h4>
                <p className="mt-2 text-sm text-slate-400">{t.deleteAccountDesc}</p>
                <button className="mt-4 rounded-2xl border border-rose-600 px-4 py-2 text-sm text-rose-400 transition hover:bg-rose-600/20">
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </motion.div>
  );
}
