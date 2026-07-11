import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../firebase';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch recent articles as notifications
        const articlesQuery = query(
          collection(db, 'articles'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const snapshot = await getDocs(articlesQuery);
        
        const articleNotifications = snapshot.docs.map(doc => {
          const data = doc.data();
          const title = data.title || data.titleEn || 'ޚަބަރު';
          const createdAt = data.createdAt;
          let time = 'އަވަސްޓެއް ނުވެއެވެ';
          
          if (createdAt) {
            const date = new Date(createdAt.seconds * 1000);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 1) {
              time = 'ހަތަރުވަނަ ހިސާބުގައި';
            } else if (diffMins < 60) {
              time = `${diffMins} މިނިޓް ކުރިން`;
            } else if (diffHours < 24) {
              time = `${diffHours} ގަޑިއަކު ކުރިން`;
            } else {
              time = `${diffDays} ދުވަސް ކުރިން`;
            }
          }
          
          return {
            id: doc.id,
            title: `އާ ޚަބަރު: ${title}`,
            time,
            articleId: doc.id
          };
        });
        
        setNotifications(articleNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <motion.section className="space-y-6 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-600">ނޮޓިފިކޭޝަންތައް</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">ހަވާއިން ޚަބަރު ނޮޓިފިކޭޝަންތައް</h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="rounded-full bg-slate-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              އެޑްމިން ޑޭޝްބޯޑް
            </button>
            <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">ކިޔާފައިވާ ކަމަށް މާރކް ކުރޭ</button>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-center text-slate-500">ލޯޑް ކުރަމުން...</p>
          ) : notifications.length === 0 ? (
            <p className="text-center text-slate-500">ނޮޓިފިކޭޝަންތައް ނެތް</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-soft">
                <div className="flex items-center justify-between gap-4 text-sm text-slate-700">
                  <p>{notification.title}</p>
                  <span className="text-xs text-slate-500">{notification.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.section>
  );
}
