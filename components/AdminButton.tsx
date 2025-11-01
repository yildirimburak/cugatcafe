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
      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
    >
      <LockClosedIcon className="w-4 h-4" />
      <span>{t('admin')}</span>
    </Link>
  );
}

