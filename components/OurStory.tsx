'use client';

import { useTranslations } from 'next-intl';

interface OurStoryProps {
  locale: string;
}

export function OurStory({ locale }: OurStoryProps) {
  const t = useTranslations('home');

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-black via-emerald-950 to-black">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-24 h-px bg-green-600/30"></div>
            <span className="text-green-600 text-sm font-light uppercase tracking-[0.3em]">Hikayemiz</span>
            <div className="w-24 h-px bg-green-600/30"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            {t('ourStoryTitle')}
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed">
            {t('ourStorySubtitle')}
          </p>
        </div>

        {/* Story Timeline */}
        <div className="space-y-24">
          {/* Story Item 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3">
                <div className="text-6xl font-black text-green-600/20">01</div>
                <div className="w-px h-12 bg-green-600/30"></div>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white">
                {t('story1Title')}
              </h3>
              <p className="text-lg text-white/70 leading-relaxed font-light">
                {t('story1Desc')}
              </p>
            </div>
            <div className="relative h-80 bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl flex items-center justify-center overflow-hidden group">
              <div className="text-8xl opacity-20 group-hover:opacity-30 transition-opacity">🌿</div>
              <div className="absolute inset-0 border border-green-600/20 rounded-2xl"></div>
            </div>
          </div>

          {/* Story Item 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl flex items-center justify-center overflow-hidden group order-2 md:order-1">
              <div className="text-8xl opacity-20 group-hover:opacity-30 transition-opacity">☕</div>
              <div className="absolute inset-0 border border-green-600/20 rounded-2xl"></div>
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-flex items-center gap-3">
                <div className="text-6xl font-black text-green-600/20">02</div>
                <div className="w-px h-12 bg-green-600/30"></div>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white">
                {t('story2Title')}
              </h3>
              <p className="text-lg text-white/70 leading-relaxed font-light">
                {t('story2Desc')}
              </p>
            </div>
          </div>

          {/* Story Item 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3">
                <div className="text-6xl font-black text-green-600/20">03</div>
                <div className="w-px h-12 bg-green-600/30"></div>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white">
                {t('story3Title')}
              </h3>
              <p className="text-lg text-white/70 leading-relaxed font-light">
                {t('story3Desc')}
              </p>
            </div>
            <div className="relative h-80 bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl flex items-center justify-center overflow-hidden group">
              <div className="text-8xl opacity-20 group-hover:opacity-30 transition-opacity">🏡</div>
              <div className="absolute inset-0 border border-green-600/20 rounded-2xl"></div>
            </div>
          </div>

          {/* Story Item 4 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl flex items-center justify-center overflow-hidden group order-2 md:order-1">
              <div className="text-8xl opacity-20 group-hover:opacity-30 transition-opacity">💚</div>
              <div className="absolute inset-0 border border-green-600/20 rounded-2xl"></div>
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-flex items-center gap-3">
                <div className="text-6xl font-black text-green-600/20">04</div>
                <div className="w-px h-12 bg-green-600/30"></div>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white">
                {t('story4Title')}
              </h3>
              <p className="text-lg text-white/70 leading-relaxed font-light">
                {t('story4Desc')}
              </p>
            </div>
          </div>

          {/* Closing Statement */}
          <div className="text-center space-y-8 pt-16 border-t border-green-600/20">
            <div className="text-6xl mb-6">✨</div>
            <h4 className="text-2xl md:text-3xl font-black text-white">
              {t('storyClosing')}
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
}

