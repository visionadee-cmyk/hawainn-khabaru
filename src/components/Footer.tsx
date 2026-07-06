import { Link } from 'react-router-dom';

const categories = ['ލޯކަލް', 'ސެޓިންގްސް', 'ކުޅިވަރު', 'އިސްލާމީ', 'ވިޔަފާރި', 'ޓެކްނޮލޮޖީ', 'ވޯލްޑް', 'އެންޓެރޓޭންމަންޓް'];
const topLinks = ['Majlis Election 2024', 'Presidential Election 2023', 'School Guide 2024', 'UEFA Euro 2021', 'Fifa Worldcup 2018'];
const printLinks = ['Subscribe', 'Available Outlets', 'E-Paper'];
const quickLinks = ['އިޑިޝަން', 'ދޯ؟', 'ކްލާސިފައިޑްސް', 'ހަވާއިން ޚަބަރު ކޮނެކްޓް', 'ފްލައިޓް ޝެޑިއުލް', 'ސަލާތު ވަގުތު', 'އަޅުގަނޑާ ގުޅުއްވާ'];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/95 text-slate-300">
      <div className="mx-auto max-w-[1600px] px-4 py-12 lg:px-6">
        <div className="grid gap-10 text-center lg:grid-cols-[1.7fr_1fr_1fr_1.3fr] lg:gap-16 lg:text-right">
          <div className="space-y-4 flex flex-col items-center lg:items-end text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <img src="/logo.png" alt="Hawainn Khabaru" className="h-12 w-12 rounded-3xl object-cover" />
              <div>
                <p className="text-xl font-bold text-white">ހަވާއިން ޚަބަރު</p>
                <p className="text-sm text-slate-400">ދިވެހި ބަހުން ލޯކަލް ޚަބަރު، ވީޑިއޯ އަދި ފަހު އަޕްޑޭޓްތައް.</p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-400">ދިވެހި ބަހުން ލޯކަލް ޚަބަރު، ވީޑިއޯ އަދި ފަހު އަޕްޑޭޓްތައް.</p>
            <button className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-400">ސަބްސްކްރައިބް</button>
          </div>

          <div className="text-center lg:text-right">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">އިތުރު ބައިތައް</p>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              {topLinks.map((item) => (
                <Link key={item} to="/categories" className="block transition hover:text-white">{item}</Link>
              ))}
            </div>
          </div>

          <div className="text-center lg:text-right">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">ހަވާއިން ޚަބަރު ޕްރިންޓް އިޑިޝަން</p>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              {printLinks.map((item) => (
                <Link key={item} to="/" className="block transition hover:text-white">{item}</Link>
              ))}
            </div>
          </div>

          <div className="text-center lg:text-right">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Download Hawainn Khabaru News App</p>
            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-end">
              <a href="#" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 transition hover:border-brand-500 hover:text-white">
                <span className="h-5 w-5 rounded bg-white/10" />
                Google Play
              </a>
              <a href="#" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 transition hover:border-brand-500 hover:text-white">
                <span className="h-5 w-5 rounded bg-white/10" />
                App Store
              </a>
            </div>
            <div className="mt-6 space-y-2 text-sm text-slate-300">
              <p className="font-semibold text-slate-100">SMS އެލާޓްތައް</p>
              <p>sub hawainnkhabaru އަށް 5454 އަށް ފޮނުވާ</p>
              <p>unsub hawainnkhabaru އަށް 5454 އަށް ފޮނުވާ</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-10">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            {['އިޑިޝަން', 'ދޯ!?'].map((icon) => (
              <a key={icon} href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/95 text-sm text-slate-300 transition hover:bg-brand-500 hover:text-white">
                {icon}
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
            {quickLinks.map((item) => (
              <Link key={item} to="/" className="transition hover:text-white">{item}</Link>
            ))}
          </div>

          <p className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">© 2026 ހަވާއިން ޚަބަރު. ހުރިހާ ހައްގުތައް ހިމާޔަތްކޮށްފައި.</p>
        </div>
      </div>
    </footer>
  );
}
