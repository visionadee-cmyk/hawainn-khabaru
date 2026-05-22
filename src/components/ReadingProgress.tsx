import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      setScroll(height > 0 ? Math.min(100, Math.round((scrollY / height) * 100)) : 0);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed inset-x-0 top-20 z-40 h-1 bg-slate-800 lg:top-24">
      <div style={{ width: `${scroll}%` }} className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 transition-all"></div>
    </div>
  );
}
