import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Article } from '../data/mockData';

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-[28px] border border-white/5 bg-slate-900/90 shadow-soft"
    >
      <Link to={`/article/${article.id}`} className="block">
        <div className="relative h-56 overflow-hidden bg-slate-800 sm:h-64">
          <img src={article.image} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <span className="absolute left-4 top-4 rounded-full bg-brand-500/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-soft">
            {article.category}
          </span>
        </div>
      </Link>
      <div className="space-y-3 p-5 text-right">
        <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
          <span>{article.publishedAt}</span>
          <span>{article.readingTime}</span>
        </div>
        <Link to={`/article/${article.id}`} className="block">
          <h3 className="text-lg font-semibold text-white transition group-hover:text-brand-300">{article.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{article.excerpt}</p>
        </Link>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>ގަޑިއެއް {article.author}</span>
          <span>👁️ {article.views}</span>
        </div>
      </div>
    </motion.article>
  );
}
