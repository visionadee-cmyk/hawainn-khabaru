import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <motion.section className="space-y-8 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-5 text-right sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-violet-600">ޕްރޮފައިލް</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">ހަވާ ނޫސް</h2>
          </div>
        </div>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-600">ދިވެހި ބަހުން ލޯކަލް ނޫސް އެޕް</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 text-slate-700 border border-slate-200 shadow-soft">
              <p className="text-sm text-slate-500">އެޕް ނަން</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">ހަވާ ނޫސް</p>
            </div>
            <div className="rounded-2xl bg-white p-4 text-slate-700 border border-slate-200 shadow-soft">
              <p className="text-sm text-slate-500">ބަސް</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">ދިވެހި ބަހުން</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
