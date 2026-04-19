import { getTranslations } from 'next-intl/server';
import { MenuSection } from '@/components/MenuSection';
import { MenuHeader } from '@/components/MenuHeader';
import { Header } from '@/components/Header';

// Sayfayı dinamik yap - cache'lenmesin
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MenuPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 pt-20 md:pt-24 pb-6">
        <MenuHeader locale={locale} />

        <MenuSection locale={locale} />
      </main>
    </div>
  );
}

