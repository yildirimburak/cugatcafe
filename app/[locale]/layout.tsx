import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { locales, isRtlLocale } from '@/i18n';
import { Providers } from '@/components/Providers';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cugatcafe.vercel.app';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: 'Cugat Café',
      template: '%s · Cugat Café',
    },
    description: t('description'),
    applicationName: 'Cugat Café',
    manifest: '/manifest.webmanifest',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Cugat Café',
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/logo.png',
    },
    openGraph: {
      type: 'website',
      siteName: 'Cugat Café',
      title: 'Cugat Café',
      description: t('description'),
      locale,
      images: [{ url: '/logo.png', width: 1408, height: 1422, alt: 'Cugat Café' }],
    },
    twitter: {
      card: 'summary',
      title: 'Cugat Café',
      description: t('description'),
      images: ['/logo.png'],
    },
  };
}

export const viewport = {
  themeColor: '#18181b',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = isRtlLocale(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
        <ServiceWorkerRegister />
        <Analytics />
      </body>
    </html>
  );
}
