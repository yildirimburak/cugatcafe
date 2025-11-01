import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/Header';
import Link from 'next/link';

export default async function HomePage({
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
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('home.welcome')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('home.welcomeMessage')}
          </p>
          <Link
            href={`/${locale}/menu`}
            className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
          >
            {t('home.viewMenu')}
          </Link>
        </div>
      </main>
    </div>
  );
}

