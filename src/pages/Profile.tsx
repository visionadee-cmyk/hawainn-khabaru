import { motion } from 'framer-motion';

export default function Profile() {
  return (
    <motion.section className="space-y-8 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-5 text-right sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-violet-600">އެޕް</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">ހަވާއިން ޚަބަރު</h2>
            </div>
            <button className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">އެޕް އިންފޯ</button>
          </div>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-600">ދިވެހި ބަހުން ލޯކަލް ޚަބަރު އެޕް</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 text-slate-700 border border-slate-200 shadow-soft">
                <p className="text-sm text-slate-500">އެޕް ނަން</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">Hawainn Khabaru</p>
              </div>
              <div className="rounded-2xl bg-white p-4 text-slate-700 border border-slate-200 shadow-soft">
                <p className="text-sm text-slate-500">ބަސް</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">ދިވެހި ބަހުން</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-900">އެޕް އިންފޯ</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">ދިވެހިރާއްޖެގެ ލޯކަލް ޚަބަރު އެޕްއެއް ކަމުގައި، ހަވާއިން ޚަބަރު އިން އެންމެ ފަހުގެ ޚަބަރުތައް ލިބިގަންނަން އެދެއެވެ.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-900">ސެޓިންގްސް</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl bg-white border border-slate-200 px-4 py-3">
                <span>ބަސް</span>
                <span className="text-violet-600">ދިވެހިބަހުން</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white border border-slate-200 px-4 py-3">
                <span>ތީމް</span>
                <span className="text-violet-600">ޑާރކް</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.section>
  );
}
