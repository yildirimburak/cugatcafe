import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { GoogleReviews } from '@/components/GoogleReviews';
import { OurStory } from '@/components/OurStory';
import { InstagramGallery } from '@/components/InstagramGallery';
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

      <main>
        {/* Hero Section */}
        <HeroSection locale={locale} />

        {/* Our Story Section */}
        <OurStory locale={locale} />

        {/* Müşteri Yorumları */}
        <div className="relative bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <GoogleReviews locale={locale} />
          </div>
        </div>

        {/* Instagram Gallery */}
        <InstagramGallery locale={locale} />
      </main>
    </div>
  );
}

