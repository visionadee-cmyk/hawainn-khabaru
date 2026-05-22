import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArticleCard from '../components/ArticleCard';
import { Article, categories, articles as mockArticles } from '../data/mockData';

export default function Home() {
  const [articlesState] = useState<Article[]>(mockArticles);
  const [heroIndex, setHeroIndex] = useState(0);

  const heroArticles = articlesState.slice(0, 3);
  const trending = useMemo(() => articlesState.filter((article) => article.trending), [articlesState]);
  const latest = useMemo(() => articlesState.slice(0, 4), [articlesState]);
  const videoItems = useMemo(() => articlesState.filter((article) => article.videoUrl || article.category === 'technology'), [articlesState]);

  const activeHero = heroArticles[heroIndex % heroArticles.length];

  return (
    <div className="space-y-8 text-right lg:space-y-12">
      {/* Categories Section */}
      <section className="rounded-[32px] border border-white/5 bg-slate-900/80 p-5 shadow-soft lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-right">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">ސަހުވެ ކެޓަގަރި</p>
            <h2 className="mt-2 text-2xl font-bold text-white">ފުރިހަމަ ކެޓަގަރީތައް</h2>
          </div>
          <Link to="/categories" className="text-sm text-brand-200 transition hover:text-brand-100">ހޯރުދާ</Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <span key={category.id} className="rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800/90">
              {category.title}
            </span>
          ))}
        </div>
      </section>

      {/* Bottom Section with More Content */}
      <section className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/5 bg-slate-900/80 p-4 shadow-soft sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">ފުރަތަމަ ނިއުސް</p>
                <h2 className="mt-2 text-2xl font-bold text-white">ފަދަ ކާނެ ނިއުސް</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                {heroArticles.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2.5 w-2.5 rounded-full transition ${heroIndex === index ? 'bg-white' : 'bg-slate-600'}`}
                    onClick={() => setHeroIndex(index)}
                    aria-label={`Show hero slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-[28px] bg-slate-950/70">
              <div className="relative h-72 overflow-hidden sm:h-80">
                <img src={activeHero.image} alt={activeHero.title} className="h-full w-full object-cover transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-right">
                  <span className="inline-flex rounded-full bg-brand-500/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-soft">{activeHero.category}</span>
                  <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">{activeHero.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">{activeHero.excerpt}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {trending.map((article) => (
              <div key={article.id} className="rounded-[28px] border border-white/5 bg-slate-900/80 p-5 shadow-soft">
                <span className="inline-flex rounded-full bg-rose-500/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">ފަދަ</span>
                <h3 className="mt-4 text-xl font-semibold text-white">{article.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{article.excerpt}</p>
                <Link to={`/article/${article.id}`} className="mt-5 inline-flex rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-400">އަރާ ކިނާވުވެ</Link>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-white/5 bg-slate-900/80 p-5 shadow-soft">
            <h3 className="text-lg font-semibold text-white">ތައާރަފު ކެޓަގަރި</h3>
            <div className="mt-5 grid gap-4">
              {categories.slice(4).map((category) => (
                <div key={category.id} className={`rounded-3xl border border-white/5 px-4 py-4 ${category.color} bg-opacity-10`}>
                  <p className="text-sm font-semibold text-white">{category.title}</p>
                  <p className="mt-1 text-xs text-slate-300">ވެ އަވަދިވާ ނިއުސް</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/5 bg-slate-900/80 p-5 shadow-soft">
            <h3 className="text-lg font-semibold text-white">ވިޑިއޮ ނިއުސް</h3>
            <div className="mt-5 space-y-4">
              {videoItems.slice(0, 2).map((video) => (
                <Link key={video.id} to={`/article/${video.id}`} className="block overflow-hidden rounded-3xl border border-white/5 bg-slate-950/90 p-4 transition hover:border-cyan-400/40">
                  <div className="mb-3 rounded-2xl overflow-hidden bg-slate-800">
                    <img src={video.image} alt={video.title} className="h-40 w-full object-cover" />
                  </div>
                  <p className="text-sm font-semibold text-white">{video.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{video.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* Latest Articles Grid */}
      <section className="rounded-[32px] border border-white/5 bg-slate-900/80 p-5 shadow-soft lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">ސަވާފާ</p>
            <h2 className="mt-2 text-2xl font-bold text-white">ތާޒާ ނިއުސް</h2>
          </div>
          <Link to="/categories" className="text-sm font-semibold text-brand-200 hover:text-brand-100">ހޯރުދާ</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {latest.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
