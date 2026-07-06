import { Link } from 'react-router-dom';

const categories = ['ލޯކަލް', 'ސެޓިންގްސް', 'ކުޅިވަރު', 'އިސްލާމީ', 'ވިޔަފާރި', 'ޓެކްނޮލޮޖީ', 'ވޯލްޑް', 'އެންޓެރޓޭންމަންޓް', 'ސިއްޙަތު'];
const quickLinks = ['އިޑިޝަން', 'ދޯ؟', 'ކްލާސިފައިޑްސް', 'ހަވާއިން ޚަބަރު ކޮނެކްޓް', 'ފްލައިޓް ޝެޑިއުލް', 'ސަލާތު ވަގުތު', 'އަޅުގަނޑާ ގުޅުއްވާ'];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 text-slate-300">
      <div className="mx-auto max-w-[1600px] px-4 py-16 lg:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr] lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-0.5">
                <img src="/logo.png" alt="Hawainn Khabaru" className="h-full w-full rounded-2xl object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">ހަވާއިން ޚަބަރު</h3>
                <p className="text-sm text-slate-400">ދިވެހި ބަހުން ލޯކަލް ޚަބަރު</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-400">
              މޯލްޑިވްސްގެ ލޯކަލް ޚަބަރު، ވީޑިއޯ އަދި ފަހު އަޕްޑޭޓްތައް
            </p>
            <div className="flex gap-3">
              <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/50 text-slate-300 transition hover:bg-sky-600 hover:text-white">
                <span className="text-lg">📘</span>
              </a>
              <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/50 text-slate-300 transition hover:bg-sky-500 hover:text-white">
                <span className="text-lg">🐦</span>
              </a>
              <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/50 text-slate-300 transition hover:bg-pink-600 hover:text-white">
                <span className="text-lg">📸</span>
              </a>
              <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/50 text-slate-300 transition hover:bg-red-600 hover:text-white">
                <span className="text-lg">📺</span>
              </a>
            </div>
          </div>

          {/* Categories - Hidden on mobile */}
          <div className="hidden space-y-6 lg:block">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">ބައިތައް</h4>
            <div className="space-y-3 text-sm">
              {categories.slice(0, 6).map((item) => (
                <Link key={item} to="/categories" className="block text-slate-400 transition hover:text-white hover:translate-x-1">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links - Hidden on mobile */}
          <div className="hidden space-y-6 lg:block">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">ކުރިއަށް ލިންކްތައް</h4>
            <div className="space-y-3 text-sm">
              {quickLinks.slice(0, 5).map((item) => (
                <Link key={item} to="/" className="block text-slate-400 transition hover:text-white hover:translate-x-1">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* App Download & SMS - Hidden on mobile */}
          <div className="hidden space-y-6 lg:block">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">އެޕް ޑައުންލޯޑް</h4>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 transition hover:border-sky-500/50 hover:bg-slate-800/50">
                <span className="text-2xl">▶️</span>
                <div className="text-left">
                  <p className="text-xs text-slate-400">GET IT ON</p>
                  <p className="text-sm font-semibold text-white">Google Play</p>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 transition hover:border-sky-500/50 hover:bg-slate-800/50">
                <span className="text-2xl">🍎</span>
                <div className="text-left">
                  <p className="text-xs text-slate-400">Download on the</p>
                  <p className="text-sm font-semibold text-white">App Store</p>
                </div>
              </a>
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
              <p className="text-sm font-semibold text-white mb-2">SMS އެލާޓްތައް</p>
              <p className="text-xs text-slate-400">sub hawainnkhabaru އަށް 5454 އަށް ފޮނުވާ</p>
              <p className="text-xs text-slate-400">unsub hawainnkhabaru އަށް 5454 އަށް ފޮނުވާ</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-500">© 2026 ހަވާއިން ޚަބަރު. ހުރިހާ ހައްގުތައް ހިމާޔަތްކޮށްފައި.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link to="/" className="transition hover:text-white">ޕްރައިވަސީ ޕޮލިސީ</Link>
              <Link to="/" className="transition hover:text-white">ޓާމްސް އޮފް ޔޫސް</Link>
              <Link to="/" className="transition hover:text-white">ކުކީ ޕޮލިސީ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
