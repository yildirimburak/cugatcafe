'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export function AdminButton() {
  const t = useTranslations('common');
  const locale = useLocale();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Link
      href={`/${locale}/admin`}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
    >
      <LockClosedIcon className="w-4 h-4" />
      <span className="hidden sm:inline">{t('admin')}</span>
    </Link>
  );
}

