import { motion } from 'framer-motion';

const categories = [
  { id: 'politics', title: 'ސިޔާސީ', color: 'bg-sky-100' },
  { id: 'sports', title: 'ކުޅިވަރު', color: 'bg-emerald-100' },
  { id: 'business', title: 'ވިޔަފާރި', color: 'bg-amber-100' },
  { id: 'world', title: 'ދުނިޔެ', color: 'bg-violet-100' },
];

export default function Categories() {
  return (
    <motion.section className="space-y-8 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-600">ބައިތައް</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">ހުރިހާ ބައިތައް</h2>
          </div>
          <p className="text-sm text-slate-500">ހުރިހާ ޚަބަރު ބައިތައް ބަލާ.</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <div key={category.id} className={`rounded-2xl border border-slate-200 p-6 ${category.color} bg-opacity-10`}>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{category.id}</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">{category.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">ދިވެހި ބަހުން ބޭނުން ކުރޭ.</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
