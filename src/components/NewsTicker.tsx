import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

export default function NewsTicker() {
  const [newsItems, setNewsItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const newsQuery = query(collection(db, 'articles'), orderBy('createdAt', 'desc'), limit(10));
        const snapshot = await getDocs(newsQuery);
        const items = snapshot.docs.map(doc => doc.data().title || doc.data().titleEn || '');
        setNewsItems(items);
      } catch (error) {
        console.error('Error fetching news ticker:', error);
      }
    };

    fetchLatestNews();
  }, []);

  return (
    <div className="w-full bg-sky-600 text-white py-1 px-4 overflow-hidden flex items-center">
      <span className="font-bold mr-4">ފަހުގެ ޚަބަރު:</span>
      <div className="flex-1 whitespace-nowrap overflow-hidden">
        <div className="inline-block animate-marquee">
          {newsItems.length > 0 ? (
            newsItems.map((item, idx) => (
              <span key={idx} className="mx-8">
                {item}
              </span>
            ))
          ) : (
            <span className="mx-8">ލޯޑް ވަނީ...</span>
          )}
        </div>
      </div>
    </div>
  );
}
