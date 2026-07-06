import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Article } from '../data/mockData';
import { categories } from '../data/mockData';

export default function ArticleCard({ article }: { article: Article }) {
  const getCategoryTitle = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.title : categoryId;
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft text-right"
    >
      <Link to={`/article/${article.id}`} className="block">
        <div className="relative h-48 overflow-hidden bg-slate-100 sm:h-56">
          <img src={article.image} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <span className="absolute left-4 top-4 rounded-full bg-sky-600/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-soft">
            {getCategoryTitle(article.category)}
          </span>
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>{article.publishedAt}</span>
          <span>{article.readingTime}</span>
        </div>
        <Link to={`/article/${article.id}`} className="block">
          <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-sky-700 line-clamp-2">{article.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600 line-clamp-2">{article.excerpt}</p>
        </Link>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
          <span>ހަވާއިން ޚަބަރު</span>
          <span>👁️ {article.views}</span>
        </div>
      </div>
    </motion.article>
  );
}
