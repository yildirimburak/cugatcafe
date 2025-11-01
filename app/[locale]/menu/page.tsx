import { getTranslations } from 'next-intl/server';
import { MenuSection } from '@/components/MenuSection';
import { Header } from '@/components/Header';

export default async function MenuPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 pt-14 pb-6">
        <div className="text-center mb-8 pt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('menu.title')}
          </h1>
        </div>

        <MenuSection locale={locale} />
      </main>
    </div>
  );
}

