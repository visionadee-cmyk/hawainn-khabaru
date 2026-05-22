import { Link } from 'react-router-dom';

const categories = ['ލޯކަލް', 'ސެޓިންގް', 'ސްޕޯރޓް', 'އިސްލާމިކް', 'ބިޒްނަސް', 'ޓެކްނޮލޮޖީ', 'ވޯލްޑް', 'އެންޓެރޓޭންމަންޓް'];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/95 text-slate-300">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-4 py-12 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="space-y-4 text-right">
            <div className="flex items-center gap-3 justify-end">
              <img src="/logo.png" alt="Ah'dhamu" className="h-12 w-12 rounded-3xl object-cover" />
              <div>
                <p className="text-xl font-bold text-white">އަހްދަމު</p>
                <p className="text-sm text-slate-400">Maldives news portal with Dhivehi RTL design.</p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-400">Authentic Maldives news, video coverage and quick updates in Dhivehi. Simple browsing for visitors, powerful admin control behind the scenes.</p>
          </div>

          <div className="text-right">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">ކެޓަގަރީ</p>
            <div className="mt-4 grid gap-2 text-sm text-slate-300">
              {categories.map((category) => (
                <Link key={category} to="/categories" className="transition hover:text-white">{category}</Link>
              ))}
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">އެއްޖެ</p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>ފެންނަގައި ނިތްވެރި ބޭނުން</p>
              <a href="mailto:ahdhamunews@gmail.com" className="transition hover:text-white">ahdhamunews@gmail.com</a>
              <Link to="/admin" className="inline-block text-brand-300 hover:text-brand-100">Admin Login</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 Ah'dhamu. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="/manifest.json" className="transition hover:text-white">PWA</a>
            <a href="/robots.txt" className="transition hover:text-white">Robots</a>
            <a href="/sitemap.xml" className="transition hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
