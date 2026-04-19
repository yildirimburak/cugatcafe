'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MenuHeaderProps {
  locale: string;
}

export function MenuHeader({ locale }: MenuHeaderProps) {
  const t = useTranslations('menu');

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden">
          <Image src="/logo.png" alt="Cugat Cafe" fill className="object-contain" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-900 leading-tight">CUGAT CAFE</h1>
          <p className="text-[11px] text-zinc-400 uppercase tracking-wider">{t('title')}</p>
        </div>
      </div>
      <LanguageSwitcher />
    </div>
  );
}
