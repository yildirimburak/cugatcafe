'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { getReviews, Review } from '@/lib/firebase/reviews';

interface GoogleReviewsProps {
  locale: string;
}

export function GoogleReviews({ locale }: GoogleReviewsProps) {
  const t = useTranslations('home');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching reviews...');
        const fetchedReviews = await getReviews(true); // Sadece görünür yorumlar
        console.log('Fetched reviews:', fetchedReviews.length);
        setReviews(fetchedReviews);
      } catch (err: any) {
        console.error('Error fetching reviews:', err);
        setReviews([]); // Hata durumunda boş array
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
        return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIcon key={star} className="w-5 h-5 text-green-600 fill-current" strokeWidth={0.5} />
          ) : (
            <StarOutlineIcon key={star} className="w-5 h-5 text-gray-300" strokeWidth={0.5} />
          )
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mt-16 pt-16 border-t border-gray-200">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">{t('loadingReviews')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 pt-16 border-t border-gray-200">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⭐</div>
          <p className="text-gray-600 mb-2">Müşteri yorumları yüklenirken bir sorun oluştu.</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    console.log('No reviews found');
    return (
      <div className="mt-16 pt-16 border-t border-gray-200">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-gray-600">Henüz müşteri yorumu bulunmuyor.</p>
          <p className="text-sm text-gray-500">İlk yorumlar eklendikten sonra burada görünecek.</p>
        </div>
      </div>
    );
  }
  
  console.log('Rendering reviews:', reviews.length);

  // Ortalama rating hesapla
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // En fazla 6 yorum göster (öne çıkanlar önce)
  const displayedReviews = reviews.slice(0, 6);

  const getReviewText = (review: Review) => {
    // Locale mapping
    const localeMap: Record<string, keyof Review> = {
      'tr': 'textTr',
      'en': 'textEn',
      'fr': 'textFr',
      'de': 'textDe',
      'it': 'textIt',
      'es': 'textEs',
      'pt': 'textPt',
      'ru': 'textRu',
      'ja': 'textJa',
      'zh': 'textZh',
      'ar': 'textAr',
    };

    const localeKey = localeMap[locale];
    if (localeKey && review[localeKey]) {
      return review[localeKey] as string;
    }
    
    // Fallback to English if available
    if (review.textEn) {
      return review.textEn;
    }
    
    // Final fallback to original text
    return review.text;
  };

  return (
    <div className="py-32">
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="w-16 h-px bg-green-600/20"></div>
          <span className="text-green-600 text-sm font-light uppercase tracking-widest">{t('customerReviews')}</span>
          <div className="w-16 h-px bg-green-600/20"></div>
        </div>
        
        {/* Ortalama Rating */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <StarIcon className="w-8 h-8 text-green-600 fill-current" strokeWidth={0.5} />
            <span className="text-4xl font-light text-gray-900">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <div className="w-px h-12 bg-green-600/20"></div>
          <span className="text-gray-600 font-light">
            +100 {t('reviews')}
          </span>
        </div>
      </div>

      {/* Yorumlar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="group space-y-6 p-8 border border-green-600/10 hover:border-green-600/30 transition-colors duration-300"
          >
            {/* Öne Çıkan Badge */}
            {review.featured && (
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 border border-green-600/40 text-green-600 text-xs font-light tracking-wider">
                  ⭐ {t('featured')}
                </span>
              </div>
            )}

            {/* Kullanıcı Bilgileri */}
            <div className="flex items-center gap-4">
              {review.authorPhoto ? (
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-green-600/20">
                  <Image
                    src={review.authorPhoto}
                    alt={review.authorName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full border border-green-600/20 flex items-center justify-center text-green-600 font-light text-xl flex-shrink-0">
                  {review.authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-light text-gray-900 truncate">
                  {review.authorName}
                </p>
                {review.createdAt && (
                  <p className="text-xs text-gray-500 font-light">
                    {new Date(review.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Rating */}
            <div>
              {renderStars(review.rating)}
            </div>

            {/* Yorum Metni */}
            <p className="text-gray-700 leading-relaxed line-clamp-4 font-light">
              {getReviewText(review)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

