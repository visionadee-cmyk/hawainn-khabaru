import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type DesktopNavProps = {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
};

export default function DesktopNav({ theme, setTheme }: DesktopNavProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 hidden border-b border-slate-800/80 bg-slate-950/95 backdrop-blur lg:block">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-6 px-6">
        <Link to="/" className="group inline-flex items-center gap-3 text-xl font-black uppercase tracking-[0.2em] text-white transition">
          <img src="/logo.png" alt="Ah'dhamu logo" className="h-12 w-12 rounded-3xl object-cover" />
          <div>
            <p className="text-xs text-slate-400">Ah'dhamu</p>
            <p className="text-sm text-slate-100">މޯލްޑިވްސް ނިޔާރު</p>
          </div>
        </Link>
        <div className="flex items-center gap-3 text-slate-300">
          <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-right shadow-soft">
            <p className="text-xs text-slate-500">ތައުރީފު</p>
            <p className="text-sm font-semibold">ތަނައްޓޮޢީ އިންޓެލް</p>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-300 transition hover:border-slate-500 hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
}
