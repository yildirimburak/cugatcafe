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

  useEffect(() => {
    async function fetchBusinessInfo() {
      try {
        const info = await getBusinessInfo();
        setBusinessInfo(info);
      } catch (error) {
        console.error('Error fetching business info:', error);
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

  if (!businessInfo) {
    return null; // İşletme bilgisi yoksa hiçbir şey gösterme
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
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
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
    <div className="mt-20 pt-16 border-t border-gray-200">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('businessInfo')}
        </h2>
        <p className="text-lg text-gray-600">
          {t('contactUs')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Sol Kolon - İletişim Bilgileri */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">📞</span>
              {t('contact')}
            </h3>
            
            <div className="space-y-5">
              {/* Adres */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {t('address')}
                  </p>
                  <p className="text-gray-600 mb-2">
                    {getAddress()}
                  </p>
                  {businessInfo.googleMapsUrl && (
                    <a
                      href={businessInfo.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 text-sm font-medium inline-flex items-center gap-1"
                    >
                      {t('viewOnMap')} →
                    </a>
                  )}
                </div>
              </div>

              {/* Telefon */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {t('phone')}
                  </p>
                  <a
                    href={`tel:${businessInfo.phone}`}
                    className="text-gray-600 hover:text-amber-600 font-medium"
                  >
                    {businessInfo.phone}
                  </a>
                </div>
              </div>

              {/* E-posta */}
              {businessInfo.email && (
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      {t('email')}
                    </p>
                    <a
                      href={`mailto:${businessInfo.email}`}
                      className="text-gray-600 hover:text-amber-600 font-medium"
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
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GlobeAltIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      {t('socialMedia')}
                    </p>
                    <div className="flex gap-3">
                      {businessInfo.socialMedia?.instagram && (
                        <a
                          href={businessInfo.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
                        >
                          Instagram
                        </a>
                      )}
                      {businessInfo.socialMedia?.facebook && (
                        <a
                          href={businessInfo.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
                        >
                          Facebook
                        </a>
                      )}
                      {businessInfo.socialMedia?.twitter && (
                        <a
                          href={businessInfo.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
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
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🕐</span>
            {t('workingHours')}
          </h3>
          
          <div className="space-y-2">
            {workingHoursList.map(({ day, text }) => (
              <div
                key={day}
                className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <span className="text-gray-700 font-semibold">
                  {getDayName(day)}
                </span>
                <span className={`font-medium ${text === t('closed') ? 'text-red-600' : 'text-amber-600'}`}>
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Google Maps Embed (opsiyonel) */}
          {businessInfo.googlePlaceId && (
            <div className="mt-6 rounded-lg overflow-hidden border border-gray-200">
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

