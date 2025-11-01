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
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-16 md:h-18 items-center justify-between">
          {/* Logo & Site Name */}
          <Link 
            href={`/${locale}`} 
            className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <img 
                src="/favicon.ico" 
                alt="Logo" 
                className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-lg shadow-md group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {t('siteName')}
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                {t('siteTagline')}
              </p>
            </div>
          </Link>

          {/* Navigation Menu - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href={`/${locale}`}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('') || pathname === `/${locale}`
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              <span className="flex items-center gap-2">
                <HomeIcon className="w-4 h-4" />
                {t('home')}
              </span>
            </Link>
            <Link
              href={`/${locale}/menu`}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/menu')
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              {t('menu')}
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <AdminButton />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
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
          <div className="md:hidden pb-4 border-t border-gray-200 mt-2 pt-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2">
            <Link
              href={`/${locale}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive('') || pathname === `/${locale}`
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              {t('home')}
            </Link>
            <Link
              href={`/${locale}/menu`}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                isActive('/menu')
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
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

