'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { BusinessInfo } from '@/lib/firebase/business';
import { getBusinessInfo } from '@/lib/firebase/business';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface BusinessInfoProps {
  locale: string;
}

export function BusinessInfoSection({ locale }: BusinessInfoProps) {
  const t = useTranslations('home');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBusinessInfo() {
      try {
        setLoading(true);
        setError(null);
        const info = await getBusinessInfo();
        setBusinessInfo(info);
      } catch (error) {
        console.error('Error fetching business info:', error);
        setBusinessInfo(null);
        setError(error instanceof Error ? error.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }
    fetchBusinessInfo();
  }, []);

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 pt-16 border-t border-gray-200">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-2">İşletme bilgileri yüklenirken bir sorun oluştu.</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!businessInfo) {
    return (
      <div className="mt-20 pt-16 border-t border-gray-200">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏪</div>
          <p className="text-gray-600">İşletme bilgileri henüz ayarlanmamış.</p>
          <p className="text-sm text-gray-500">Admin panelinden işletme bilgilerini ekleyebilirsiniz.</p>
        </div>
      </div>
    );
  }

  const getAddress = () => {
    if (locale === 'tr') {
      return businessInfo.address;
    }
    return businessInfo.addressEn || businessInfo.address;
  };

  const getName = () => {
    if (locale === 'tr') {
      return businessInfo.name;
    }
    return businessInfo.nameEn || businessInfo.name;
  };

  const getDayName = (day: string) => {
    const days: Record<string, Record<string, string>> = {
      monday: { tr: 'Pazartesi', en: 'Monday' },
      tuesday: { tr: 'Salı', en: 'Tuesday' },
      wednesday: { tr: 'Çarşamba', en: 'Wednesday' },
      thursday: { tr: 'Perşembe', en: 'Thursday' },
      friday: { tr: 'Cuma', en: 'Friday' },
      saturday: { tr: 'Cumartesi', en: 'Saturday' },
      sunday: { tr: 'Pazar', en: 'Sunday' },
    };
    return days[day]?.[locale] || day;
  };

  const formatWorkingHours = () => {
    if (!businessInfo) return [];
    const days: Array<keyof typeof businessInfo.workingHours> = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map((day) => {
      const hours = businessInfo.workingHours[day];
      if (!hours || hours.closed) {
        return { day, text: t('closed') };
      }
      return {
        day,
        text: `${hours.open} - ${hours.close}`,
      };
    });
  };

  const workingHoursList = formatWorkingHours();

  return (
    <div className="py-32">
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="w-16 h-px bg-green-600/20"></div>
          <span className="text-green-600 text-sm font-light uppercase tracking-widest">{t('businessInfo')}</span>
          <div className="w-16 h-px bg-green-600/20"></div>
        </div>
        <p className="text-lg text-slate-600 font-light">
          {t('contactUs')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
        {/* Sol Kolon - İletişim Bilgileri */}
        <div className="space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-px h-12 bg-green-600/30"></div>
              <h3 className="text-2xl font-light text-gray-900 tracking-wide">
                {t('contact')}
              </h3>
            </div>

            <div className="space-y-8">
              {/* Adres */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 border border-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-5 h-5 text-green-600" strokeWidth={1} />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-green-600 mb-2 font-light">
                    {t('address')}
                  </p>
                  <p className="text-gray-700 mb-3 font-light">
                    {getAddress()}
                  </p>
                  {businessInfo.googleMapsUrl && (
                    <a
                      href={businessInfo.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 text-sm font-light inline-flex items-center gap-1 border-b border-green-600/20 hover:border-green-600/40 transition-colors"
                    >
                      {t('viewOnMap')} →
                    </a>
                  )}
                </div>
              </div>

              {/* Telefon */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 border border-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-5 h-5 text-green-600" strokeWidth={1} />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-green-600 mb-2 font-light">
                    {t('phone')}
                  </p>
                  <a
                    href={`tel:${businessInfo.phone}`}
                    className="text-gray-700 font-light hover:text-green-600 transition-colors"
                  >
                    {businessInfo.phone}
                  </a>
                </div>
              </div>

              {/* E-posta */}
              {businessInfo.email && (
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 border border-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="w-5 h-5 text-green-600" strokeWidth={1} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider text-green-600 mb-2 font-light">
                      {t('email')}
                    </p>
                    <a
                      href={`mailto:${businessInfo.email}`}
                      className="text-gray-700 font-light hover:text-green-600 transition-colors"
                    >
                      {businessInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Sosyal Medya */}
              {(businessInfo.socialMedia?.instagram ||
                businessInfo.socialMedia?.facebook ||
                businessInfo.socialMedia?.twitter) && (
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 border border-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <GlobeAltIcon className="w-5 h-5 text-green-600" strokeWidth={1} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider text-green-600 mb-4 font-light">
                      {t('socialMedia')}
                    </p>
                    <div className="flex gap-2">
                      {businessInfo.socialMedia?.instagram && (
                        <a
                          href={businessInfo.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 border border-green-600/20 text-green-600 hover:bg-green-600/5 hover:border-green-600/40 transition-all font-light text-sm rounded-full"
                        >
                          Instagram
                        </a>
                      )}
                      {businessInfo.socialMedia?.facebook && (
                        <a
                          href={businessInfo.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 border border-green-600/20 text-green-600 hover:bg-green-600/5 hover:border-green-600/40 transition-all font-light text-sm rounded-full"
                        >
                          Facebook
                        </a>
                      )}
                      {businessInfo.socialMedia?.twitter && (
                        <a
                          href={businessInfo.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 border border-green-600/20 text-green-600 hover:bg-green-600/5 hover:border-green-600/40 transition-all font-light text-sm rounded-full"
                        >
                          Twitter
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sağ Kolon - Çalışma Saatleri */}
        <div className="space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-px h-12 bg-green-600/30"></div>
              <h3 className="text-2xl font-light text-gray-900 tracking-wide">
                {t('workingHours')}
              </h3>
            </div>
          
            <div className="space-y-4">
              {workingHoursList.map(({ day, text }) => (
                <div
                  key={day}
                  className="flex justify-between items-center py-4 border-b border-green-600/10 last:border-0"
                >
                  <span className="text-gray-700 font-light">
                    {getDayName(day)}
                  </span>
                  <span className={`font-light ${text === t('closed') ? 'text-red-400' : 'text-green-600'}`}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Google Maps Embed (opsiyonel) */}
          {businessInfo.googlePlaceId && (
            <div className="mt-12 rounded-lg overflow-hidden border border-green-600/20">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:${businessInfo.googlePlaceId}`}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

