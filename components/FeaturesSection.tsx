'use client';

import { useTranslations } from 'next-intl';
import {
  SparklesIcon,
  ClockIcon,
  HeartIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

interface FeaturesSectionProps {
  locale: string;
}

const features = [
  {
    icon: SparklesIcon,
    titleKey: 'feature1Title',
    descriptionKey: 'feature1Desc',
    emoji: '✨',
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
    emoji: '❤️',
  },
  {
    icon: FireIcon,
    titleKey: 'feature4Title',
    descriptionKey: 'feature4Desc',
    emoji: '🔥',
  },
];

export function FeaturesSection({ locale }: FeaturesSectionProps) {
  const t = useTranslations('home');

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('whyChooseUs')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('whyChooseUsDesc')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-bl-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
                
                {/* Emoji */}
                <div className="text-4xl mb-4 relative z-10">
                  {feature.emoji}
                </div>

                {/* Icon */}
                <div className="mb-4 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-gray-600 leading-relaxed relative z-10">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

