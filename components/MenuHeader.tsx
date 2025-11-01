'use client';

import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MenuHeaderProps {
  locale: string;
}

export function MenuHeader({ locale }: MenuHeaderProps) {
  const t = useTranslations('menu');

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        {t('title')}
      </h1>
      <LanguageSwitcher />
    </div>
  );
}

