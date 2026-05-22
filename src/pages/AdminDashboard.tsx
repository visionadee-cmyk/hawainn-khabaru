import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { categories } from '../data/mockData';

type AdminTab = 'articles' | 'analytics' | 'settings';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [articlesCount, setArticlesCount] = useState(0);
  const [visitorDetails, setVisitorDetails] = useState<any[]>([]);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [activeTab, setActiveTab] = useState<AdminTab>('articles');

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState(categories[0].title);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80');
  const [readingTime, setReadingTime] = useState('5މިނިޓް');
  const [body1, setBody1] = useState('');
  const [body2, setBody2] = useState('');
  const [body3, setBody3] = useState('');
  const [trending, setTrending] = useState(false);
  const [breaking, setBreaking] = useState(false);

  const navigate = useNavigate();

  const loadDashboard = async () => {
    try {
      const articleSnapshot = await getDocs(collection(db, 'articles'));
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

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setMessage('ލޮގްއުޓް ކުރެވިދާ.');
    navigate('/admin');
  };

  const handleCreateArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setMessage('ސިނިކުރުވި ނުހުވާ.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'articles'), {
        title,
        excerpt,
        category,
        image: imageUrl,
        publishedAt: new Date().toLocaleDateString('dv'),
        author: user.email || 'admin',
        views: 0,
        readingTime,
        body: [body1, body2, body3].filter(Boolean),
        trending,
        breaking,
        createdAt: serverTimestamp(),
      });
      setMessage('ނޫސް ކުރި ހާ! ވިވިދާ.');
      setTitle('');
      setExcerpt('');
      setImageUrl('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80');
      setBody1('');
      setBody2('');
      setBody3('');
      setTrending(false);
      setBreaking(false);
      loadDashboard();
    } catch (error) {
      setMessage('ނޫސް ކުރި ނާ. ފިކުރާ.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const visitorCount = visitorDetails.length;
  const topVisitors = visitorDetails.slice(0, 8);

  if (user === undefined) {
    return (
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-8 shadow-soft text-right">
        <h2 className="text-2xl font-semibold text-white">ސްލޯއެޑުން...</h2>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-8 shadow-soft text-right">
        <h2 className="text-2xl font-semibold text-white">ނޫންތައް ސިނިކުރުން ނުފެނުނު</h2>
        <p className="mt-4 text-slate-400">ކުރިއަށް އެޑުމިން މިނިސްޓްރީ ކޮންސޯލް އިތުރުވެއްޖެ.</p>
      </div>
    );
  }

  return (
    <motion.div className="space-y-8 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">Admin Panel</p>
            <h2 className="mt-2 text-3xl font-bold text-white">އެޑުމިން ޑޭޝްބޯޑް</h2>
          </div>
          {user && (
            <div className="rounded-3xl bg-slate-950/90 p-4 text-sm text-slate-300 shadow-soft">
              <p>ނިވެސް: {articlesCount}</p>
              <p>ވިޒިޓްސް: {visitorCount}</p>
              <button
                onClick={handleLogout}
                className="mt-3 w-full rounded-2xl border border-rose-600 px-3 py-2 text-rose-400 transition hover:bg-rose-600/20"
              >
                ލޮގްއުޓް
              </button>
            </div>
          )}
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
          {(['articles', 'analytics', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? 'bg-brand-500 text-slate-950'
                  : 'border border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {tab === 'articles' && 'ނިވެސް ކުރެވި'}
              {tab === 'analytics' && 'ވިސްނިވި'}
              {tab === 'settings' && 'ސެޓިންގް'}
            </button>
          ))}
        </div>

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
            <h3 className="text-2xl font-bold text-white">ނިވެސް ކުރެވި</h3>
            <p className="mt-2 text-sm text-slate-400">ނިވެސްތަކުވެވޭނެ ކުރިއަށްވި ވަޒީފާ.</p>
            <form onSubmit={handleCreateArticle} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-300">ސަވާލް</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder="ނިވެސް ސަވާލް"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">ކެޓަގަރި</label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder="ކެޓަގަރި"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300">ވާނާ</label>
                <input
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  placeholder="ތާވަލުރާ ވާނާ"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-300">ފޮޓޯ URL</label>
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder="https://..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">ރީޑިްނވި ފުރިހަމަ</label>
                  <input
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder="5 މިނިޓް"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">ނިވެސް</label>
                <textarea
                  value={body1}
                  onChange={(e) => setBody1(e.target.value)}
                  className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  placeholder="ނިވެސް ވާނާ ބަހުއް 1"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <textarea
                  value={body2}
                  onChange={(e) => setBody2(e.target.value)}
                  className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  placeholder="ބަހުއް 2 (ވި ނުވަތަ އަވެ)"
                />
                <textarea
                  value={body3}
                  onChange={(e) => setBody3(e.target.value)}
                  className="min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  placeholder="ބަހުއް 3 (ވި ނުވަތަ އަވެ)"
                />
              </div>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={trending}
                    onChange={(e) => setTrending(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                  />
                  ހަތަރުވި
                </label>
                <label className="inline-flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={breaking}
                    onChange={(e) => setBreaking(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                  />
                  ބްރেކިގް
                </label>
              </div>
              <button
                disabled={submitting}
                className="w-full rounded-3xl bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'ކުރިއަށްވި އިތުރާ...' : 'ނިވެސް ކުރުވި'}
              </button>
            </form>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
              <h3 className="text-xl font-semibold text-white">ވިސިއިތި</h3>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-950/80 p-4">
                  <p className="text-sm text-slate-400">ކުލް ނިވެސް</p>
                  <p className="mt-2 text-3xl font-bold text-white">{articlesCount}</p>
                </div>
                <div className="rounded-2xl bg-slate-950/80 p-4">
                  <p className="text-sm text-slate-400">އިތުރާ ވިޒިޓްސް</p>
                  <p className="mt-2 text-3xl font-bold text-white">{visitorCount}</p>
                </div>
                <div className="rounded-2xl bg-slate-950/80 p-4">
                  <p className="text-sm text-slate-400">ވިވި އާރި</p>
                  <p className="mt-2 text-3xl font-bold text-white">{uniqueVisitors}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
              <h3 className="text-xl font-semibold text-white">ވިވި ލޮގް</h3>
              <div className="mt-4 space-y-3 text-sm">
                {topVisitors.length > 0 ? (
                  topVisitors.map((visitor) => (
                    <div key={visitor.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                      <p className="font-semibold text-white">{visitor.path || 'Home'}</p>
                      <p className="mt-1 text-xs text-slate-500">{visitor.language || 'Unknown'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">ވިވި ނެތް</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
            <h3 className="text-2xl font-bold text-white">ސެޓިންގް</h3>
            <div className="mt-6 space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white">ވިސިޅާ ކުރުވި</h4>
                <p className="mt-2 text-sm text-slate-400">ވިސިޅާ ކުރުވި އިކާ ބަސްވެ ވާނާ.</p>
                <button className="mt-4 rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/80">
                  ބަދަލް ކުރުވި
                </button>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white">ވިސި ސި</h4>
                <p className="mt-2 text-sm text-slate-400">ވިސި ސި ކުރުވި ބިލާ.</p>
                <button className="mt-4 rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/80">
                  ބަދަލް ކުރުވި
                </button>
              </div>
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4">
                <h4 className="font-semibold text-rose-400">ވިސި ސީ އިތުރާ ވި</h4>
                <p className="mt-2 text-sm text-slate-400">ވިސި ސީ ވިވި އިތުރާ</p>
                <button className="mt-4 rounded-2xl border border-rose-600 px-4 py-2 text-sm text-rose-400 transition hover:bg-rose-600/20">
                  ވިވި އިތުރާ
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </motion.div>
  );
}
