import { getTranslations } from 'next-intl/server';
import { MenuSection } from '@/components/MenuSection';
import { MenuHeader } from '@/components/MenuHeader';

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
      </main>
    </div>
  );
}

