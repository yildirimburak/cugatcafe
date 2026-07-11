import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { MenuSection } from '@/components/MenuSection';
import { MenuHeader } from '@/components/MenuHeader';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Footer } from '@/components/Footer';

// Sayfayı dinamik yap - cache'lenmesin
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'menu' });
  return { title: t('title') };
}

export default async function MenuPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 pt-6 pb-6">
        <MenuHeader locale={locale} />

        <MenuSection locale={locale} />

        <Footer />
      </main>
      <ScrollToTop />
    </div>
  );
}

