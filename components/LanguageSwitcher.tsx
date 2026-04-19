'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/routing';
import { locales, Locale, localeNames } from '@/i18n';
import { getEnabledLanguages, Language } from '@/lib/firebase/languages';

const localeFlags: Record<Locale, string> = {
  'tr': '🇹🇷', 'en': '🇺🇸', 'de': '🇩🇪', 'fr': '🇫🇷', 'es': '🇪🇸', 'it': '🇮🇹', 'pt': '🇵🇹',
  'nl': '🇳🇱', 'pl': '🇵🇱', 'ru': '🇷🇺', 'uk': '🇺🇦', 'ro': '🇷🇴', 'cs': '🇨🇿', 'hu': '🇭🇺',
  'sv': '🇸🇪', 'no': '🇳🇴', 'da': '🇩🇰', 'fi': '🇫🇮', 'el': '🇬🇷', 'bg': '🇧🇬', 'hr': '🇭🇷',
  'sk': '🇸🇰', 'sl': '🇸🇮', 'sr': '🇷🇸', 'mk': '🇲🇰', 'sq': '🇦🇱', 'lv': '🇱🇻', 'lt': '🇱🇹',
  'et': '🇪🇪', 'is': '🇮🇸', 'ga': '🇮🇪', 'mt': '🇲🇹', 'eu': '🇪🇸', 'ca': '🇪🇸', 'zh': '🇨🇳',
  'zh-TW': '🇹🇼', 'ja': '🇯🇵', 'ko': '🇰🇷', 'hi': '🇮🇳', 'th': '🇹🇭', 'vi': '🇻🇳', 'id': '🇮🇩',
  'ms': '🇲🇾', 'tl': '🇵🇭', 'my': '🇲🇲', 'km': '🇰🇭', 'lo': '🇱🇦', 'bn': '🇧🇩', 'ta': '🇮🇳',
  'te': '🇮🇳', 'mr': '🇮🇳', 'gu': '🇮🇳', 'pa': '🇮🇳', 'ur': '🇵🇰', 'fa': '🇮🇷', 'ps': '🇦🇫',
  'uz': '🇺🇿', 'kk': '🇰🇿', 'ky': '🇰🇬', 'mn': '🇲🇳', 'ne': '🇳🇵', 'si': '🇱🇰', 'ar': '🇸🇦',
  'he': '🇮🇱', 'sw': '🇰🇪', 'am': '🇪🇹', 'zu': '🇿🇦', 'af': '🇿🇦', 'yo': '🇳🇬', 'ig': '🇳🇬',
  'ha': '🇳🇬', 'es-MX': '🇲🇽', 'pt-BR': '🇧🇷', 'fr-CA': '🇨🇦', 'mi': '🇳🇿'
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEnabledLanguages()
      .then(setAvailableLanguages)
      .catch(() => {
        setAvailableLanguages(locales.map(code => ({
          id: code, code, name: localeNames[code as Locale] || code,
          nativeName: localeNames[code as Locale] || code, enabled: true,
          createdAt: new Date(), updatedAt: new Date(),
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  const switchLocale = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  const displayLanguages = availableLanguages.length > 0
    ? availableLanguages
    : locales.map(code => ({
        id: code, code, name: localeNames[code as Locale] || code,
        nativeName: localeNames[code as Locale] || code, enabled: true,
        createdAt: new Date(), updatedAt: new Date(),
      }));

  if (loading) {
    return <div className="w-16 h-8 bg-zinc-100 rounded-full animate-pulse" />;
  }

  return (
    <div className="flex items-center bg-zinc-100 rounded-full p-0.5">
      {displayLanguages.map((lang) => {
        const isActive = locale === lang.code;
        const flag = localeFlags[lang.code as Locale] || '🌐';
        return (
          <button
            key={lang.id}
            onClick={() => !isActive && switchLocale(lang.code)}
            title={lang.nativeName}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              isActive
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <span className="text-sm leading-none">{flag}</span>
            <span className="hidden sm:inline">{lang.code.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}
