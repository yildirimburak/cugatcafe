'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/routing';
import { locales, Locale, localeNames } from '@/i18n';
import { getEnabledLanguages, Language } from '@/lib/firebase/languages';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// Bayrak emojileri
const localeFlags: Record<Locale, string> = {
  'tr': '🇹🇷',
  'en': '🇺🇸',
  'de': '🇩🇪',
  'fr': '🇫🇷',
  'es': '🇪🇸',
  'it': '🇮🇹',
  'pt': '🇵🇹',
  'nl': '🇳🇱',
  'pl': '🇵🇱',
  'ru': '🇷🇺',
  'uk': '🇺🇦',
  'ro': '🇷🇴',
  'cs': '🇨🇿',
  'hu': '🇭🇺',
  'sv': '🇸🇪',
  'no': '🇳🇴',
  'da': '🇩🇰',
  'fi': '🇫🇮',
  'el': '🇬🇷',
  'bg': '🇧🇬',
  'hr': '🇭🇷',
  'sk': '🇸🇰',
  'sl': '🇸🇮',
  'sr': '🇷🇸',
  'mk': '🇲🇰',
  'sq': '🇦🇱',
  'lv': '🇱🇻',
  'lt': '🇱🇹',
  'et': '🇪🇪',
  'is': '🇮🇸',
  'ga': '🇮🇪',
  'mt': '🇲🇹',
  'eu': '🇪🇸',
  'ca': '🇪🇸',
  'zh': '🇨🇳',
  'zh-TW': '🇹🇼',
  'ja': '🇯🇵',
  'ko': '🇰🇷',
  'hi': '🇮🇳',
  'th': '🇹🇭',
  'vi': '🇻🇳',
  'id': '🇮🇩',
  'ms': '🇲🇾',
  'tl': '🇵🇭',
  'my': '🇲🇲',
  'km': '🇰🇭',
  'lo': '🇱🇦',
  'bn': '🇧🇩',
  'ta': '🇮🇳',
  'te': '🇮🇳',
  'mr': '🇮🇳',
  'gu': '🇮🇳',
  'pa': '🇮🇳',
  'ur': '🇵🇰',
  'fa': '🇮🇷',
  'ps': '🇦🇫',
  'uz': '🇺🇿',
  'kk': '🇰🇿',
  'ky': '🇰🇬',
  'mn': '🇲🇳',
  'ne': '🇳🇵',
  'si': '🇱🇰',
  'ar': '🇸🇦',
  'he': '🇮🇱',
  'sw': '🇰🇪',
  'am': '🇪🇹',
  'zu': '🇿🇦',
  'af': '🇿🇦',
  'yo': '🇳🇬',
  'ig': '🇳🇬',
  'ha': '🇳🇬',
  'es-MX': '🇲🇽',
  'pt-BR': '🇧🇷',
  'fr-CA': '🇨🇦',
  'mi': '🇳🇿'
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');
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
    // next-intl'in useRouter'ı locale parametresi ile kullan
    router.push(pathname, { locale: newLocale });
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
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-green-50 hover:border-green-400 hover:text-green-700 transition-all shadow-sm hover:shadow-md"
        disabled={loading}
      >
        <span className="text-lg">
          {loading ? '...' : localeFlags[locale as Locale]}
        </span>
        <span className="text-sm font-medium">
          {loading ? '...' : (currentLanguage?.nativeName || localeNames[locale as Locale] || locale.toUpperCase())}
        </span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !loading && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50]" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Popup Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">{t('changeLanguage')}</h2>
              </div>

              {/* Languages Grid */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  {displayLanguages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => switchLocale(lang.code)}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        locale === lang.code
                          ? 'border-green-600 bg-green-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl">{localeFlags[lang.code as Locale] || '🌐'}</span>
                      <span className={`text-sm font-medium ${
                        locale === lang.code ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {lang.nativeName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

