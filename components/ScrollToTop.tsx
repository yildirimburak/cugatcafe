'use client';

import { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:bottom-6 sm:right-6 z-40 w-10 h-10 bg-zinc-900/90 backdrop-blur-sm text-white rounded-full shadow-lg flex items-center justify-center hover:bg-zinc-700 active:scale-95 transition-all"
      aria-label="Yukarı çık"
    >
      <ChevronUpIcon className="w-5 h-5" />
    </button>
  );
}
