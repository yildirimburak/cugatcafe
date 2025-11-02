'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AdminButton } from './AdminButton';
import { HomeIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function Header() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}` || pathname === `/${locale}${path}/`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black/80 backdrop-blur-2xl border-b border-green-600/20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo & Site Name */}
          <Link 
            href={`/${locale}`} 
            className="flex items-center gap-4 group"
          >
            <div className="relative w-16 h-16 border-2 border-green-600 flex items-center justify-center group-hover:border-green-500 transition-colors">
              <span className="text-3xl">☕</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                CUGAT
              </h1>
            </div>
          </Link>

          {/* Navigation Menu - Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href={`/${locale}`}
              className={`px-6 py-3 font-light transition-all ${
                isActive('') || pathname === `/${locale}`
                  ? 'bg-green-600 text-black border border-green-600'
                  : 'text-white border border-transparent hover:border-green-600/50 hover:text-green-400'
              }`}
            >
              <span className="flex items-center gap-2 uppercase tracking-wider text-sm">
                {t('home')}
              </span>
            </Link>
            <Link
              href={`/${locale}/menu`}
              className={`px-6 py-3 font-light transition-all ${
                isActive('/menu')
                  ? 'bg-green-600 text-black border border-green-600'
                  : 'text-white border border-transparent hover:border-green-600/50 hover:text-green-400'
              }`}
            >
              <span className="uppercase tracking-wider text-sm">
                {t('menu')}
              </span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <AdminButton />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 text-white hover:text-green-400 transition-colors border border-white/20 hover:border-green-600"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 border-t border-green-600/20 mt-2 pt-6">
          <nav className="flex flex-col gap-2">
            <Link
              href={`/${locale}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-6 py-4 font-light transition-all uppercase tracking-wider text-sm ${
                isActive('') || pathname === `/${locale}`
                  ? 'bg-green-600 text-black border border-green-600'
                  : 'text-white border border-transparent hover:border-green-600/50 hover:text-green-400'
              }`}
            >
              {t('home')}
            </Link>
            <Link
              href={`/${locale}/menu`}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-6 py-4 font-light transition-all uppercase tracking-wider text-sm ${
                isActive('/menu')
                  ? 'bg-green-600 text-black border border-green-600'
                  : 'text-white border border-transparent hover:border-green-600/50 hover:text-green-400'
              }`}
            >
              {t('menu')}
            </Link>
          </nav>
          </div>
        )}
      </div>
    </header>
  );
}

