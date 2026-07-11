import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cugatcafe.vercel.app';

// Gerçek çevirisi olan diller (tr varsayılan, prefix'siz)
const TRANSLATED_LOCALES = ['tr', 'en', 'de', 'fr', 'es', 'it', 'ja', 'ko', 'pt', 'ru', 'zh', 'ar'];
const DEFAULT_LOCALE = 'tr';

function urlFor(locale: string, path: string) {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    TRANSLATED_LOCALES.map((loc) => [loc, urlFor(loc, '/menu')])
  );

  return TRANSLATED_LOCALES.map((locale) => ({
    url: urlFor(locale, '/menu'),
    changeFrequency: 'weekly',
    priority: locale === DEFAULT_LOCALE ? 1 : 0.8,
    alternates: { languages },
  }));
}
