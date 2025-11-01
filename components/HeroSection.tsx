'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 opacity-50"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="text-center">
          {/* Cafe Emoji Icons */}
          <div className="flex justify-center gap-4 mb-6 text-5xl md:text-6xl animate-bounce-slow">
            <span className="animate-pulse">☕</span>
            <span className="animate-pulse delay-75">🥐</span>
            <span className="animate-pulse delay-150">🍰</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
              {t('welcome')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            {t('welcomeMessage')}
          </p>

          {/* Additional Tagline */}
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            {t('tagline')}
          </p>

          {/* CTA Button */}
          <Link
            href={`/${locale}/menu`}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
          >
            {t('viewMenu')}
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Decorative Elements */}
          <div className="mt-16 flex justify-center gap-8 text-gray-300 opacity-30">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            <span className="text-4xl">✨</span>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

