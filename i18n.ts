import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { notFound } from 'next/navigation';

export const locales = [
  'tr', 'en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'ru', 'uk', 'ro', 'cs', 'hu', 
  'sv', 'no', 'da', 'fi', 'el', 'bg', 'hr', 'sk', 'sl', 'sr', 'mk', 'sq', 'lv', 'lt', 
  'et', 'is', 'ga', 'mt', 'eu', 'ca', 'zh', 'zh-TW', 'ja', 'ko', 'hi', 'th', 'vi', 'id', 
  'ms', 'tl', 'my', 'km', 'lo', 'bn', 'ta', 'te', 'mr', 'gu', 'pa', 'ur', 'fa', 'ps', 
  'uz', 'kk', 'ky', 'mn', 'ne', 'si', 'ar', 'he', 'sw', 'am', 'zu', 'af', 'yo', 'ig', 
  'ha', 'es-MX', 'pt-BR', 'fr-CA', 'mi'
] as const;
export type Locale = (typeof locales)[number];

// Dil isimleri (LanguageSwitcher için fallback - Firebase'den gelenler öncelikli)
export const localeNames: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  ru: 'Русский',
  uk: 'Українська',
  ro: 'Română',
  cs: 'Čeština',
  hu: 'Magyar',
  sv: 'Svenska',
  no: 'Norsk',
  da: 'Dansk',
  fi: 'Suomi',
  el: 'Ελληνικά',
  bg: 'Български',
  hr: 'Hrvatski',
  sk: 'Slovenčina',
  sl: 'Slovenščina',
  sr: 'Српски',
  mk: 'Македонски',
  sq: 'Shqip',
  lv: 'Latviešu',
  lt: 'Lietuvių',
  et: 'Eesti',
  is: 'Íslenska',
  ga: 'Gaeilge',
  mt: 'Malti',
  eu: 'Euskara',
  ca: 'Català',
  zh: '中文',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
  hi: 'हिन्दी',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
  ms: 'Bahasa Melayu',
  tl: 'Filipino',
  my: 'မြန်မာ',
  km: 'ខ្មែរ',
  lo: 'ລາວ',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  pa: 'ਪੰਜਾਬੀ',
  ur: 'اردو',
  fa: 'فارسی',
  ps: 'پښتو',
  uz: 'O\'zbek',
  kk: 'Қазақ',
  ky: 'Кыргызча',
  mn: 'Монгол',
  ne: 'नेपाली',
  si: 'සිංහල',
  ar: 'العربية',
  he: 'עברית',
  sw: 'Kiswahili',
  am: 'አማርኛ',
  zu: 'isiZulu',
  af: 'Afrikaans',
  yo: 'Yorùbá',
  ig: 'Igbo',
  ha: 'Hausa',
  'es-MX': 'Español (México)',
  'pt-BR': 'Português (Brasil)',
  'fr-CA': 'Français (Canada)',
  mi: 'Te Reo Māori'
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Eğer locale yoksa veya desteklenmiyorsa default locale kullan
  if (!locale || !locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  try {
    return {
      locale,
      messages: (await import(`./messages/${locale}.json`)).default
    };
  } catch (error) {
    // Eğer dil dosyası yoksa default locale kullan
    console.warn(`Translation file for ${locale} not found, using default`);
    return {
      locale: routing.defaultLocale,
      messages: (await import(`./messages/${routing.defaultLocale}.json`)).default
    };
  }
});

