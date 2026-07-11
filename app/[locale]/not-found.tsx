'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/routing';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-6xl font-bold text-zinc-200">404</p>
        <h1 className="mt-4 text-xl font-semibold text-zinc-900">{t('notFoundTitle')}</h1>
        <p className="mt-2 text-sm text-zinc-500">{t('notFoundText')}</p>
        <Link
          href="/menu"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
        >
          {t('backToMenu')}
        </Link>
      </div>
    </div>
  );
}
