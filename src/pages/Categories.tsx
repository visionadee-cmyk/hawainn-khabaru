import { motion } from 'framer-motion';
import { categories } from '../data/mockData';

export default function Categories() {
  return (
    <motion.section className="space-y-8 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">ކެޓަގަރީތައް</p>
            <h2 className="mt-2 text-3xl font-bold text-white">އެއްކުރެނީ ނިޔާރު</h2>
          </div>
          <p className="text-sm text-slate-400">ބަހުގެ ހިސާބު އަކުރި ހިޔާރުތަކެއް ހަދާ ކުރެވޭ.</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <div key={category.id} className={`rounded-[28px] border border-white/5 p-6 ${category.color} bg-opacity-10`}>
              <p className="text-xs uppercase tracking-[0.24em] text-white/70">{category.id}</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">{category.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-200">އެކޮށް ދިވެހި ނިޔާރުތައް ބޭނުން ހަކަދައްކަވާ.</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
