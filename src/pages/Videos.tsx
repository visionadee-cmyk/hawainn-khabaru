import { motion } from 'framer-motion';
import { articles } from '../data/mockData';

export default function Videos() {
  const videoItems = articles.filter((item) => item.videoUrl || item.category === 'technology');

  return (
    <motion.section className="space-y-8 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">ވިޑިއޮ ސެކްޝަން</p>
            <h2 className="mt-2 text-3xl font-bold text-white">ބިޑިއޮ ނިޔާރު</h2>
          </div>
          <p className="text-sm text-slate-400">މިކޯސް ވިޑިއޮތައް އެކު ހާނަން ލޯކަލް އެންޖާއު ދިވެހި ލިޔުން.</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {videoItems.map((video) => (
            <div key={video.id} className="overflow-hidden rounded-[28px] border border-white/5 bg-slate-950/90 shadow-soft">
              <div className="relative h-56 overflow-hidden bg-slate-800">
                <img src={video.image} alt={video.title} className="h-full w-full object-cover" />
                <span className="absolute inset-x-4 bottom-4 rounded-full bg-slate-950/80 px-3 py-2 text-xs font-semibold text-white">Play</span>
              </div>
              <div className="p-5 text-right">
                <p className="text-sm font-semibold text-white">{video.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{video.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
