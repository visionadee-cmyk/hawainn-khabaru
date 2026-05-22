import { motion } from 'framer-motion';

export default function Profile() {
  return (
    <motion.section className="space-y-8 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
          <div className="flex flex-col gap-5 text-right sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-violet-300">ޕްރޮފައިލް</p>
              <h2 className="mt-2 text-3xl font-bold text-white">އެޑްމިން މިންގެ</h2>
            </div>
            <button className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-400">ހެދިން ވިޔަދާ</button>
          </div>
          <div className="mt-8 rounded-[28px] border border-white/5 bg-slate-950/80 p-6">
            <p className="text-sm text-slate-300">ކަނޑައިގެ ހިމެނޭ ޕްރޮފައިލް އިން ސަވަރީ ހަމަޖެހޭ.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900/90 p-4 text-slate-300 shadow-soft">
                <p className="text-sm text-slate-500">ތަރުތީބާ</p>
                <p className="mt-2 text-2xl font-semibold text-white">Ah'dhamu</p>
              </div>
              <div className="rounded-3xl bg-slate-900/90 p-4 text-slate-300 shadow-soft">
                <p className="text-sm text-slate-500">ގަޑިއެއް</p>
                <p className="mt-2 text-2xl font-semibold text-white">މީހާން</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-white">ހިނގި ގޯދާ މައްސަލަ</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">ކަނޑައިގެ ޕްރޮފައިލްގެ ނިޔާރު ބަހައްޓާ އިން އެކެވެއްޖެ.</p>
          </div>
          <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-white">ސެޓިންގް</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <div className="flex items-center justify-between rounded-3xl bg-slate-950/80 px-4 py-3">
                <span>ޑާއްޓާ އެކްސްޕޯރޓް</span>
                <span className="text-brand-300">އެކްޓިވް</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-slate-950/80 px-4 py-3">
                <span>ޑާރކް މޯޑް</span>
                <span className="text-brand-300">އާވުޓު</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.section>
  );
}
