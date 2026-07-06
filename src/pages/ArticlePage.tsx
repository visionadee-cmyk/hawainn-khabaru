import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReadingProgress from '../components/ReadingProgress';
import { Article, articles as mockArticles } from '../data/mockData';

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setArticle(null);
      return;
    }
    const found = mockArticles.find((item) => item.id === id);
    setArticle(found ?? null);
  }, [id]);

  if (article === undefined) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft text-right">
        <h2 className="text-2xl font-semibold text-slate-900">ސްލޯއެޑުން...</h2>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft text-right">
        <h2 className="text-2xl font-semibold text-slate-900">މި ހިޔާރު ނުފެނުން</h2>
        <p className="mt-4 text-slate-500">ދިވެހި ހިޔާރު އެހެން ނުމިން ކޮށްފިނަމަށް.</p>
      </div>
    );
  }

  const related = mockArticles.filter((item) => item.category === article.category && item.id !== article.id).slice(0, 3);

  return (
    <div className="space-y-8 text-right">
      <ReadingProgress />
      <motion.section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
        <button
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
          onClick={() => navigate(-1)}
        >
          ← ބެހޭ ފުރިކޮށް
        </button>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.5fr] lg:items-start">
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-slate-100 shadow-soft">
              <img src={article.image} alt={article.title} className="h-[360px] w-full object-cover" />
            </div>
            <div className="space-y-2 text-slate-700">
              <span className="inline-flex rounded-full bg-sky-600/95 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white">{article.category}</span>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>{article.publishedAt}</span>
                <span>{article.author}</span>
                <span>{article.readingTime}</span>
              </div>
              <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{article.title}</h1>
              <p className="text-sm leading-7 text-slate-600">{article.excerpt}</p>
            </div>
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-soft">
              {article.body.map((paragraph, index) => (
                <p key={index} className="text-base leading-8 text-slate-700">{paragraph}</p>
              ))}
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">ޕްރޮގްރެސް ބާރު ފަށާއިރު</p>
              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">Share</button>
                <button className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900">Bookmark</button>
              </div>
            </div>
          </div>
          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-soft">
              <h3 className="text-xl font-semibold text-slate-900">ދީން ހިޔާރުތައް</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                {related.map((item) => (
                  <button
                    key={item.id}
                    className="block w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-right transition hover:border-sky-400/40"
                    onClick={() => navigate(`/article/${item.id}`)}
                  >
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-[13px] text-slate-500">{item.publishedAt}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-soft">
              <h3 className="text-xl font-semibold text-slate-900">ކޮމެންޓް</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">ކޮމެންޓް ސެކްޝަން ހިމެނޭ. އެހެން ފަހު ޕޮންކެއް އިތުރު ކުރެވޭ ނުވަތަ ނެތް.</p>
            </div>
          </aside>
        </div>
      </motion.section>
    </div>
  );
}
