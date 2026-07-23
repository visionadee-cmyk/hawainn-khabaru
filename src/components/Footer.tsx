import { Link } from 'react-router-dom';
import { categories } from '../data/mockData';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-[1600px] px-4 py-16 lg:px-6">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20">
                <img src="/logo.png" alt="Hawa Daily" className="h-full w-full rounded-2xl object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">ހަވާ ޑެއިލީ</h3>
                <p className="text-sm text-slate-400">ދިވެހި ބަހުން ލޯކަލް ޚަބަރު</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-400">
              މޯލްޑިވްސްގެ ލޯކަލް ޚަބަރު، ވީޑިއޯ އަދި ފަހު އަޕްޑޭޓްތައް
            </p>
            <div className="flex gap-4">
              <a href="https://web.facebook.com/profile.php?id=61591869200851" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-sky-500 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-pink-500 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-sky-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-red-500 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">ބައިތައް</h4>
            <div className="space-y-3 text-sm">
              {categories.slice(0, 6).map((category) => (
                <Link key={category.id} to={`/categories/${category.id}`} className="block text-slate-400 transition hover:text-sky-400 hover:translate-x-1">
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">ކުރިއަށް ލިންކްތައް</h4>
            <div className="space-y-3 text-sm">
              <Link to="/" className="block text-slate-400 transition hover:text-sky-400 hover:translate-x-1">މައި ޞަފްޙާ</Link>
              <Link to="/categories" className="block text-slate-400 transition hover:text-sky-400 hover:translate-x-1">ބައިތައް</Link>
              <Link to="/videos" className="block text-slate-400 transition hover:text-sky-400 hover:translate-x-1">ވީޑިއޯތައް</Link>
              <Link to="/notifications" className="block text-slate-400 transition hover:text-sky-400 hover:translate-x-1">ނޮޓިފިކޭޝަންތައް</Link>
              <Link to="/profile" className="block text-slate-400 transition hover:text-sky-400 hover:translate-x-1">ޕްރޮފައިލް</Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">ގުޅުން</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-slate-400">
                <Mail className="h-5 w-5 flex-shrink-0 text-sky-400" />
                <span>info@hawadaily.mv</span>
              </div>
              <div className="flex items-start gap-3 text-slate-400">
                <Phone className="h-5 w-5 flex-shrink-0 text-sky-400" />
                <span>+960 123-4567</span>
              </div>
              <div className="flex items-start gap-3 text-slate-400">
                <MapPin className="h-5 w-5 flex-shrink-0 text-sky-400" />
                <span>މާލެ، މޯލްޑިވްސް</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-400">© 2026 ހަވާ ޑެއިލީ. ހުރިހާ ހައްގުތައް ހިމާޔަތްކޮށްފައި.</p>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link to="#" className="transition hover:text-sky-400">އެއްބަސް އަޅާލުން</Link>
              <Link to="#" className="transition hover:text-sky-400">ހައްގުތައް</Link>
              <Link to="#" className="transition hover:text-sky-400">ރައްކާތެރިކަން</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
