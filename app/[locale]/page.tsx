import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/Header';
import { BusinessInfoSection } from '@/components/BusinessInfo';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
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
      
      <main className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <HeroSection locale={locale} />

        {/* Features Section */}
        <FeaturesSection locale={locale} />

        {/* İşletme Bilgileri */}
        <div className="max-w-4xl mx-auto px-4 pb-12">
          <BusinessInfoSection locale={locale} />
        </div>
      </main>
    </div>
  );
}

