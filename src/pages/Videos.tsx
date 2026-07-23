import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase';

export default function Videos() {
  const [videoArticles, setVideoArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const videosQuery = query(
          collection(db, 'articles'),
          where('videoUrl', '!=', null),
          limit(50)
        );
        const snapshot = await getDocs(videosQuery);
        const articlesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        // Sort by createdAt client-side to avoid composite index requirement
        articlesData.sort((a: any, b: any) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });
        setVideoArticles(articlesData.slice(0, 12));
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <motion.section className="space-y-8 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-600">ވީޑިއޯ ޚަބަރު</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">ހަވާ ޑެއިލީ ވީޑިއޯތައް</h2>
          </div>
          <p className="text-sm text-slate-500">ދިވެހި ބަހުން ލޯކަލް ނޫސް ވީޑިއޯތައް ބަލާ.</p>
        </div>
        
        {loading ? (
          <p className="mt-8 text-slate-500">ލޯޑް ވަނީ...</p>
        ) : videoArticles.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {videoArticles.map((video) => (
              <div key={video.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-soft">
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img src={video.image} alt={video.title} className="h-full w-full object-cover" />
                  <span className="absolute inset-x-4 bottom-4 rounded-full bg-sky-600/90 px-3 py-2 text-xs font-semibold text-white">ބަލާ</span>
                </div>
                <div className="p-5 text-right">
                  <p className="text-sm font-semibold text-slate-900">{video.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{video.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-slate-500">ވީޑިއޯ ޚަބަރު ނެތް</p>
        )}
      </div>
    </motion.section>
  );
}
