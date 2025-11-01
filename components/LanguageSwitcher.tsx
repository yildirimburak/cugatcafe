'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, Locale, localeNames } from '@/i18n';
import { getEnabledLanguages, Language } from '@/lib/firebase/languages';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLanguages() {
      try {
        const langs = await getEnabledLanguages();
        setAvailableLanguages(langs);
      } catch (error) {
        console.error('Error loading languages:', error);
        // Hata durumunda varsayılan dilleri kullan
        setAvailableLanguages(locales.map(code => ({
          id: code,
          code,
          name: localeNames[code as Locale] || code,
          nativeName: localeNames[code as Locale] || code,
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })));
      } finally {
        setLoading(false);
      }
    }
    loadLanguages();
  }, []);

  const switchLocale = (newLocale: string) => {
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
    setIsOpen(false);
  };

  // Görüntülenecek diller: Firebase'den gelenler veya varsayılanlar
  const displayLanguages = availableLanguages.length > 0 
    ? availableLanguages 
    : locales.map(code => ({
        id: code,
        code,
        name: localeNames[code as Locale] || code,
        nativeName: localeNames[code as Locale] || code,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

  const currentLanguage = displayLanguages.find(l => l.code === locale) || displayLanguages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        disabled={loading}
      >
        <span className="text-sm font-medium">
          {loading ? '...' : (currentLanguage?.nativeName || localeNames[locale as Locale] || locale.toUpperCase())}
        </span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !loading && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            {displayLanguages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => switchLocale(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  locale === lang.code
                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

