'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AdminButton } from './AdminButton';

export function Header() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex h-14 items-center justify-end">
          <LanguageSwitcher />
          <AdminButton />
        </div>
      </div>
    </header>
  );
}

