'use client';

import { useTranslations } from 'next-intl';
import {
  SparklesIcon,
  ClockIcon,
  HeartIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

interface FeaturesSectionProps {
  locale: string;
}

const features = [
  {
    icon: SparklesIcon,
    titleKey: 'feature1Title',
    descriptionKey: 'feature1Desc',
    emoji: '🌿',
  },
  {
    icon: ClockIcon,
    titleKey: 'feature2Title',
    descriptionKey: 'feature2Desc',
    emoji: '⏰',
  },
  {
    icon: HeartIcon,
    titleKey: 'feature3Title',
    descriptionKey: 'feature3Desc',
    emoji: '💚',
  },
  {
    icon: SunIcon,
    titleKey: 'feature4Title',
    descriptionKey: 'feature4Desc',
    emoji: '☀️',
  },
];

export function FeaturesSection({ locale }: FeaturesSectionProps) {
  const t = useTranslations('home');

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-white">
      <div className="relative max-w-6xl mx-auto px-8">
        {/* Section Header - Minimal */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-16 h-px bg-green-600/20"></div>
            <span className="text-green-600 text-sm font-light uppercase tracking-widest">{t('whyChooseUs')}</span>
            <div className="w-16 h-px bg-green-600/20"></div>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            {t('whyChooseUsDesc')}
          </p>
        </div>

        {/* Features Grid - Ultra Minimal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group text-center space-y-6"
              >
                {/* Icon - Subtle */}
                <div className="relative inline-block">
                  <div className="w-20 h-20 border border-green-600/20 rounded-full flex items-center justify-center group-hover:border-green-600/40 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-green-600" strokeWidth={1} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 text-3xl opacity-30 group-hover:opacity-60 transition-opacity">
                    {feature.emoji}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-light text-slate-800 tracking-wide">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

