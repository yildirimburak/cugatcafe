'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getBusinessInfo } from '@/lib/firebase/business';

interface InstagramGalleryProps {
  locale: string;
}

export function InstagramGallery({ locale }: InstagramGalleryProps) {
  const t = useTranslations('home');
  const [instagramUrl, setInstagramUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstagramUrl() {
      try {
        const businessInfo = await getBusinessInfo();
        setInstagramUrl(businessInfo?.socialMedia?.instagram);
      } catch (error) {
        console.error('Error fetching Instagram URL:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInstagramUrl();
  }, []);

  // Instagram profil adını URL'den çıkar (örn: https://instagram.com/username -> username)
  const getUsername = (url?: string) => {
    if (!url) return null;
    const match = url.match(/instagram\.com\/([^/?]+)/);
    return match ? match[1] : null;
  };

  // Fallback to hardcoded username if no URL found
  const username = getUsername(instagramUrl) || 'cugatcafe_galata';

  return (
    <section className="relative py-32 overflow-hidden bg-white">
      <div className="relative max-w-6xl mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-16 h-px bg-green-600/20"></div>
            <span className="text-green-600 text-sm font-light uppercase tracking-widest">Instagram</span>
            <div className="w-16 h-px bg-green-600/20"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-black mb-6">
            {t('instagramTitle')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            {t('instagramSubtitle')}
          </p>
        </div>

        {/* Instagram Feed */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-6"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        ) : username ? (
          <div className="max-w-6xl mx-auto">
            {/* Instagram Feed - Placeholder Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Placeholder posts */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <a
                  key={i}
                  href={instagramUrl || `https://www.instagram.com/${username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-green-600/30 text-4xl group-hover:text-green-600/50 transition-colors">
                    📸
                  </div>
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg"></div>
                </a>
              ))}
            </div>
            
            {/* Instagram profil linkine yönlendirme */}
            <div className="text-center mt-12">
              <a
                href={instagramUrl || `https://www.instagram.com/${username}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-light border-b border-green-600/20 hover:border-green-600/40 transition-colors"
              >
                Instagram'da Bizi Takip Edin →
              </a>
            </div>
            
            {/* Note about Instagram integration */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Instagram gönderileri için API entegrasyonu gerekmektedir
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📸</div>
            <p className="text-gray-600 mb-4">Instagram feed hazırlanıyor</p>
            <p className="text-sm text-gray-500">
              Instagram entegrasyonu için lütfen admin panelinden Instagram URL'sini ekleyin
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

