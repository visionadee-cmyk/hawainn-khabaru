import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Article, categories } from '../data/mockData';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit, addDoc, deleteDoc, setDoc, updateDoc, getDocsFromCache } from 'firebase/firestore';
import { auth } from '../firebase';
import PromoBanner from '../components/PromoBanner';

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'އަންނަވަނީ';
  if (diffMins < 60) return `${diffMins} މިނިޓު ކުރިން`;
  if (diffHours < 24) return `${diffHours} ގަޑިއިރު ކުރިން`;
  if (diffDays < 7) return `${diffDays} ދުވަސް ކުރިން`;
  return dateString;
};

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null | undefined>(undefined);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!id) {
      setArticle(null);
      setLoading(false);
      return;
    }
    
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'articles', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const articleData = { id: docSnap.id, ...docSnap.data() } as Article;
          setArticle(articleData);

          // Increment view count if allowed, but don't fail the page load if the user is not authorized to write.
          try {
            const currentViews = articleData.views || 0;
            await updateDoc(docRef, { views: currentViews + 1 });
          } catch (viewError) {
            console.warn('Unable to increment article views:', viewError);
          }

          // Fetch likes/dislikes if permissions allow it.
          try {
            const likesDoc = await getDoc(doc(db, 'articles', id, 'likes', 'count'));
            const dislikesDoc = await getDoc(doc(db, 'articles', id, 'dislikes', 'count'));
            setLikes(likesDoc.exists() ? likesDoc.data().count : 0);
            setDislikes(dislikesDoc.exists() ? dislikesDoc.data().count : 0);
          } catch (countError) {
            console.warn('Unable to load like/dislike counts:', countError);
          }

          // Check user's reaction and bookmarks only for signed-in users.
          if (auth.currentUser) {
            try {
              const userLikeDoc = await getDoc(doc(db, 'articles', id, 'userReactions', auth.currentUser.uid));
              if (userLikeDoc.exists()) {
                setUserReaction(userLikeDoc.data().type);
              }

              const bookmarkDoc = await getDoc(doc(db, 'users', auth.currentUser.uid, 'bookmarks', id));
              setIsBookmarked(bookmarkDoc.exists());
            } catch (userMetaError) {
              console.warn('Unable to load user reaction/bookmark state:', userMetaError);
            }
          }

          // Fetch comments if allowed.
          try {
            const commentsQuery = query(collection(db, 'articles', id, 'comments'), orderBy('createdAt', 'desc'));
            const commentsSnap = await getDocs(commentsQuery);
            setComments(commentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          } catch (commentsError) {
            console.warn('Unable to load article comments:', commentsError);
          }

          // Fetch related articles from the same category.
          if (articleData.category) {
            try {
              const allArticlesQuery = query(collection(db, 'articles'), limit(50));
              const allSnap = await getDocs(allArticlesQuery);
              const related = allSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Article))
                .filter(item => item.category === articleData.category && item.id !== id)
                .sort((a, b) => {
                  const dateA = new Date(a.publishedAt || 0).getTime();
                  const dateB = new Date(b.publishedAt || 0).getTime();
                  return dateB - dateA;
                })
                .slice(0, 3);
              setRelatedArticles(related);
            } catch (relatedError) {
              console.warn('Unable to load related articles:', relatedError);
            }
          }
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setError(error instanceof Error ? error.message : 'Unable to load article.');
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading || article === undefined) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft text-right">
        <h2 className="text-2xl font-semibold text-slate-900">ލޯޑް ވަނީ...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 shadow-soft text-right">
        <h2 className="text-2xl font-semibold text-rose-700">ސިސްޓަމް އޮތް އިންޓަރނެޓް ޑިސްޓރިބިއުޝަން އެރަރ</h2>
        <p className="mt-4 text-rose-700">{error}</p>
        <p className="mt-2 text-sm text-rose-600">ތިބާ ކޮންމެ ސުވާލަކަށް ތައާރަފް ކޮށްލާ.</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft text-right">
        <h2 className="text-2xl font-semibold text-slate-900">މި ލިޔުން ނުފެނުން</h2>
        <p className="mt-4 text-slate-500">އެހެން ލިޔުންތަކެއް ހޯއްދަވާ</p>
      </div>
    );
  }

  const related = relatedArticles;

  // Handler functions
  const handleBookmark = async () => {
    if (!auth.currentUser || !id) return;
    
    try {
      if (isBookmarked) {
        await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'bookmarks', id));
        setIsBookmarked(false);
      } else {
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'bookmarks', id), {
          articleId: id,
          createdAt: new Date().toISOString()
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: article?.title,
      text: article?.excerpt,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('ލިންކް ކޮޕީ ކުރެވިއްޖެ');
    }
  };

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!auth.currentUser || !id) return;

    try {
      const userReactionRef = doc(db, 'articles', id, 'userReactions', auth.currentUser.uid);
      const userReactionDoc = await getDoc(userReactionRef);
      
      if (userReactionDoc.exists()) {
        const currentType = userReactionDoc.data().type;
        
        if (currentType === type) {
          // Remove reaction
          await deleteDoc(userReactionRef);
          await updateReactionCount(type, -1);
          setUserReaction(null);
        } else {
          // Change reaction
          await setDoc(userReactionRef, { type, createdAt: new Date().toISOString() });
          await updateReactionCount(currentType, -1);
          await updateReactionCount(type, 1);
          setUserReaction(type);
        }
      } else {
        // Add new reaction
        await setDoc(userReactionRef, { type, createdAt: new Date().toISOString() });
        await updateReactionCount(type, 1);
        setUserReaction(type);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  const updateReactionCount = async (type: 'like' | 'dislike', delta: number) => {
    if (!id) return;
    const countRef = doc(db, 'articles', id, type === 'like' ? 'likes' : 'dislikes', 'count');
    const countDoc = await getDoc(countRef);
    const currentCount = countDoc.exists() ? countDoc.data().count : 0;
    await setDoc(countRef, { count: currentCount + delta });
    
    if (type === 'like') {
      setLikes(prev => prev + delta);
    } else {
      setDislikes(prev => prev + delta);
    }
  };

  const handleAddComment = async () => {
    if (!auth.currentUser || !id || !newComment.trim()) return;

    try {
      await addDoc(collection(db, 'articles', id, 'comments'), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        text: newComment,
        createdAt: new Date().toISOString()
      });
      setNewComment('');
      
      // Refresh comments
      const commentsQuery = query(collection(db, 'articles', id, 'comments'), orderBy('createdAt', 'desc'));
      const commentsSnap = await getDocs(commentsQuery);
      setComments(commentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="space-y-8 text-right">
      <Helmet>
        <title>{article?.title} | ހަވާއިން ޙަބަރު</title>
        <meta property="og:title" content={article?.title} />
        <meta property="og:description" content={article?.excerpt} />
        <meta property="og:image" content={article?.image} />
        <meta property="og:image:url" content={article?.image} />
        <meta property="og:image:secure_url" content={article?.image} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:image" content={article?.image} />
      </Helmet>
      <PromoBanner location="article" position="top" />
      <motion.section className="lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:p-5 lg:shadow-soft sm:p-8">
        <button
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
          onClick={handleGoBack}
        >
          ← ފަހަތަށް
        </button>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.5fr] lg:items-start">
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-slate-100 shadow-soft">
              <img src={article.image} alt={article.title} className="h-[360px] w-full object-cover" />
            </div>
            <div className="space-y-2 text-slate-700">
              <span className="inline-flex rounded-full bg-sky-600/95 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white">{article.category}</span>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>{getRelativeTime(article.publishedAt)}</span>
                <span>{article.author}</span>
                <span>{article.readingTime}</span>
              </div>
              <h1 className="mt-4 mb-6 text-2xl font-bold leading-[2.5] text-white lg:text-slate-900 sm:text-3xl">{article.title}</h1>
              <p className="text-sm leading-7 text-white lg:text-slate-600">{article.excerpt}</p>
            </div>
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-soft">
              {article.body.map((paragraph, index) => (
                <p key={index} className="text-base leading-8 text-slate-700">{paragraph}</p>
              ))}
            </div>
            <div className="flex flex-col gap-3 lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:p-5 lg:shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => handleReaction('like')}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    userReaction === 'like' 
                      ? 'bg-sky-600 text-white' 
                      : 'border border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-500 hover:text-slate-900'
                  }`}
                >
                  👍 {likes}
                </button>
                <button 
                  onClick={() => handleReaction('dislike')}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    userReaction === 'dislike' 
                      ? 'bg-red-600 text-white' 
                      : 'border border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-500 hover:text-slate-900'
                  }`}
                >
                  👎 {dislikes}
                </button>
                <button 
                  onClick={handleBookmark}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isBookmarked 
                      ? 'bg-amber-500 text-white' 
                      : 'border border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-500 hover:text-slate-900'
                  }`}
                >
                  {isBookmarked ? '🔖' : '📑'} ބުކްމާރކް
                </button>
                <button 
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
                >
                  📤 ޝެއަރ
                </button>
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
                >
                  💬 {comments.length}
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-soft">
                <h3 className="text-lg font-semibold text-slate-900">ކޮމެންޓްތައް</h3>
                
                {auth.currentUser ? (
                  <div className="flex gap-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="ކޮމެންޓް ލިޔޭ..."
                      className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-sky-500 focus:outline-none"
                      rows={3}
                    />
                    <button 
                      onClick={handleAddComment}
                      className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      ފޮނުވާ
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">ކޮމެންޓް ލިޔުމަށް ލޮގްއިން ކުރޭ</p>
                )}

                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">{comment.userName}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(comment.createdAt).toLocaleDateString('dv-MV')}
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{comment.text}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-sm text-slate-500">ކޮމެންޓް ނެތް</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-soft">
              <h3 className="text-xl font-semibold text-slate-900">ގުޅުން ލިޔުންތައް</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                {related.map((item: Article) => (
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
              <p className="mt-3 text-sm leading-7 text-slate-500">ކޮމެންޓް ސެކްޝަން ހިމެނޭ. ފަހުން އިތުރު ފީޗާތަކެއް އިތުރު ކުރެވޭނެ</p>
            </div>
          </aside>
        </div>
      </motion.section>
      <PromoBanner location="article" position="bottom" />
    </div>
  );
}
