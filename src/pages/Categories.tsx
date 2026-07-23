import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import PromoBanner from '../components/PromoBanner';
import { categories } from '../data/mockData';

const getRelativeTime = (dateValue: any) => {
  let date: Date;
  
  if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
    // Firebase Timestamp
    date = new Date(dateValue.seconds * 1000);
  } else if (typeof dateValue === 'string') {
    // ISO string
    date = new Date(dateValue);
  } else {
    return 'އަވަސްޓެއް ނުވެއެވެ';
  }
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMs < 0) return 'އަންނަވަނީ';
  if (diffMins < 1) return 'އަންނަވަނީ';
  if (diffMins < 60) return `${diffMins} މިނިޓު ކުރިން`;
  if (diffHours < 24) return `${diffHours} ގަޑިއިރު ކުރިން`;
  if (diffDays < 7) return `${diffDays} ދުވަސް ކުރިން`;
  return date.toLocaleDateString('dv-MV');
};

export default function Categories() {
  const { categoryId } = useParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) return;

    const fetchArticles = async () => {
      setLoading(true);
      try {
        const articlesQuery = query(
          collection(db, 'articles'),
          where('category', '==', categoryId),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const snapshot = await getDocs(articlesQuery);
        const articlesData = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            publishedAt: data.createdAt || data.publishedAt
          };
        });
        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categoryId]);

  const selectedCategory = categories.find(cat => cat.id === categoryId);

  return (
    <motion.section className="space-y-4 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="hidden lg:block">
        <PromoBanner location="category" position="top" />
      </div>
      <div className="hidden lg:block">
        {categoryId && selectedCategory ? (
          <div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-sky-600">ބައި</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">{selectedCategory.title}</h2>
              </div>
              <p className="text-xs text-slate-500">{articles.length} ޚަބަރު</p>
            </div>
            
            {loading ? (
              <p className="mt-6 text-slate-500">ލޯޑް ވަނީ...</p>
            ) : articles.length > 0 ? (
              <div className="mt-6 space-y-3">
                {articles.map((article) => (
                  <Link 
                    key={article.id} 
                    to={`/article/${article.id}`}
                    className="block rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-slate-300 hover:bg-slate-100"
                  >
                    <h3 className="text-base font-semibold text-slate-900">{article.title}</h3>
                    <p className="mt-1 text-xs text-slate-600">{article.excerpt}</p>
                    <p className="mt-1 text-[10px] text-slate-500">{getRelativeTime(article.publishedAt)}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-slate-500">މި ބައިގައި ޚަބަރު ނެތް</p>
            )}
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-right">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sky-600">ހުރިހާ ބައިތައް</p>
              </div>
              <Link className="text-xs text-sky-700 transition hover:text-sky-900" to="/categories">އިތުރަށް ބަލާ</Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  to={`/categories/${category.id}`}
                  className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="hidden lg:block">
        <PromoBanner location="category" position="bottom" />
      </div>
    </motion.section>
  );
}
