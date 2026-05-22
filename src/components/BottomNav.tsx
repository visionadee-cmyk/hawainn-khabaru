import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type BottomNavProps = {
  links: { label: string; path: string }[];
  activePath: string;
};

export default function BottomNav({ links, activePath }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 block border-t border-slate-800 bg-slate-950/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-5xl justify-between px-4 py-3 text-slate-300">
        {links.map((link) => {
          const active = activePath === link.path;
          return (
            <Link key={link.path} to={link.path} className="group flex flex-col items-center gap-1 text-[11px] font-semibold transition">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl transition ${active ? 'bg-brand-500 text-white shadow-soft' : 'bg-slate-800/90 text-slate-400 hover:bg-slate-700/90'}`}>
                {link.label.slice(0, 2)}
              </span>
              <span className={active ? 'text-white' : 'text-slate-500'}>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
