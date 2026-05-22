import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '../firebase';

export default function AdminLogin() {
  const [email, setEmail] = useState('ahdhamunews@gmail.com');
  const [password, setPassword] = useState('Ziyad@123');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        navigate('/admin/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (error) {
      setMessage('އެއްޗާ ހިތާ އައްޔާ ބުރި ނުވާ.');
    }
  };

  if (loading) {
    return (
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-8 shadow-soft text-right">
        <h2 className="text-2xl font-semibold text-white">ސްލޯއެޑުން...</h2>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <motion.div className="space-y-8 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">Admin Login</p>
            <h2 className="mt-2 text-3xl font-bold text-white">އެޑްމިން އިންޓްރީ</h2>
          </div>
        </div>
        {message && (
          <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
            {message}
          </div>
        )}
      </div>

      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-8 shadow-soft">
        <h3 className="text-2xl font-bold text-white">އެޑްމިން ސިނިކުރުވި</h3>
        <p className="mt-2 text-sm text-slate-400">ކުރިއަށް އެޑްމިން ހުންނަން އެންމެ ސެޓިންގު އިތުރުވިއްޖެ.</p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300">އީމޭލް</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300">ޕާސްވޯޑް</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
            ސިނިކުރުވި
          </button>
        </form>
      </div>
    </motion.div>
  );
}
