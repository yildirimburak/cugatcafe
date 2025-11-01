import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

// Tüm desteklenen diller (build-time için gerekli)
// Admin panelden aktif/pasif yapılan diller LanguageSwitcher'da gösterilir
export const routing = defineRouting({
  locales: [
    'tr', 'en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'ru', 'uk', 'ro', 'cs', 'hu', 
    'sv', 'no', 'da', 'fi', 'el', 'bg', 'hr', 'sk', 'sl', 'sr', 'mk', 'sq', 'lv', 'lt', 
    'et', 'is', 'ga', 'mt', 'eu', 'ca', 'zh', 'zh-TW', 'ja', 'ko', 'hi', 'th', 'vi', 'id', 
    'ms', 'tl', 'my', 'km', 'lo', 'bn', 'ta', 'te', 'mr', 'gu', 'pa', 'ur', 'fa', 'ps', 
    'uz', 'kk', 'ky', 'mn', 'ne', 'si', 'ar', 'he', 'sw', 'am', 'zu', 'af', 'yo', 'ig', 
    'ha', 'es-MX', 'pt-BR', 'fr-CA', 'mi'
  ],
  defaultLocale: 'tr',
  localePrefix: 'as-needed',
  localeDetection: true
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

