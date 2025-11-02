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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Split Screen Diagonal Layout */}
      <div className="absolute inset-0 flex">
        {/* Left Side - Green */}
        <div className="relative w-1/2 bg-gradient-to-br from-green-600 to-emerald-700">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMEgxMDBWMTBIMTBDMTAwIDEwMCAxMDAgMTAwIDEwMCAwWiIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] opacity-30"></div>
        </div>
        
        {/* Right Side - Black */}
        <div className="relative w-1/2 bg-black">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(135deg, transparent 0%, rgba(34, 197, 94, 0.03) 100%)`
          }}></div>
        </div>
        
        {/* Diagonal Split Line */}
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-green-600"></div>
        <div className="absolute top-0 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-green-600 to-green-600 origin-center" style={{
          transform: 'rotate(-15deg)',
          transformOrigin: 'left center'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-8">
          {/* Full Width Content */}
          <div className="text-center">
            <div className="space-y-16">
              {/* Number Badge */}
              <div className="inline-flex items-center gap-3">
                <div className="w-16 h-px bg-white/30"></div>
                <span className="text-white/60 text-sm font-light uppercase tracking-[0.3em]">Est. 2024</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-9xl md:text-[15rem] font-black leading-none tracking-tighter">
                <span className="block text-white mb-2">CUGAT</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">CAFE</span>
              </h1>

              {/* Subtitle */}
              <p className="text-3xl md:text-4xl text-white/80 leading-relaxed max-w-3xl mx-auto font-light">
                {t('welcomeMessage')}
              </p>

              {/* CTA Button */}
              <div className="pt-8">
                <Link
                  href={`/${locale}/menu`}
                  className="group inline-flex items-center gap-4 bg-white text-green-700 px-16 py-6 font-black text-2xl tracking-wider hover:bg-green-50 transition-colors duration-300 uppercase border-2 border-white"
                >
                  {t('viewMenu')}
                  <ArrowRightIcon className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-40 w-3 h-3 bg-emerald-500 rounded-full opacity-60"></div>
    </section>
  );
}

