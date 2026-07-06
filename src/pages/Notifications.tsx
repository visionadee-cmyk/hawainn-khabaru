import { motion } from 'framer-motion';

const notifications = [
  { id: 'n1', title: 'ބްރޭކިންގް ނިންގެ ހިޔާރު: ބިޒްނަސް ޕްރޮޖެކްޓް މީހުންނާ ހަމަޖެހޭ', time: 'މާރޗް 22, 2:40 PM' },
  { id: 'n2', title: 'ދިވެހި ސްޕޯރޓް ފެންނަށް ކުރަން ދީން ނިފައި', time: 'މެއި 03, 11:20 AM' },
  { id: 'n3', title: 'މިހާން ހޯދާ ތަރައްޤީ ރަނގަޅުން ދިސްކްރިޕްޝަން', time: 'އޯކްޓޯބަރ 10, 09:00 AM' },
];

export default function Notifications() {
  return (
    <motion.section className="space-y-6 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-600">ނޮޓިފިކޭޝަންތައް</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">ޔޫޒަރ ނޮޓިފިކޭޝަންތައް</h2>
          </div>
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">ކިޔާފައިވާ ކަމަށް މާރކް ކުރޭ</button>
        </div>
        <div className="mt-8 space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-soft">
              <div className="flex items-center justify-between gap-4 text-sm text-slate-700">
                <p>{notification.title}</p>
                <span className="text-xs text-slate-500">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
