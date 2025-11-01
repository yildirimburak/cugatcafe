'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MenuItem, AllergyTag } from '@/lib/types';

interface MenuCardProps {
  item: MenuItem;
  name: string;
  description: string;
  onClick?: () => void;
}

// Alerji tag ikonları ve renkleri
const allergyInfo: Record<AllergyTag, { icon: string; color: string }> = {
  gluten: { icon: '🌾', color: 'bg-amber-100 text-amber-800' },
  dairy: { icon: '🥛', color: 'bg-blue-100 text-blue-800' },
  nuts: { icon: '🥜', color: 'bg-orange-100 text-orange-800' },
  eggs: { icon: '🥚', color: 'bg-yellow-100 text-yellow-800' },
  fish: { icon: '🐟', color: 'bg-cyan-100 text-cyan-800' },
  shellfish: { icon: '🦐', color: 'bg-pink-100 text-pink-800' },
  soy: { icon: '🫘', color: 'bg-green-100 text-green-800' },
  sesame: { icon: '🌰', color: 'bg-amber-100 text-amber-800' },
  vegetarian: { icon: '🌿', color: 'bg-emerald-100 text-emerald-800' },
  vegan: { icon: '🥬', color: 'bg-lime-100 text-lime-800' },
};

export function MenuCard({ item, name, description, onClick }: MenuCardProps) {
  const t = useTranslations('menu');
  return (
    <div 
      className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      {/* Yuvarlak küçük resim */}
      <div className="flex-shrink-0">
        {item.imageUrl ? (
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {name}
            </h3>
            <p className="text-sm text-gray-500 mb-2 leading-relaxed">
              {description}
            </p>
            {/* Alerji tag'leri */}
            {item.allergies && item.allergies.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {item.allergies.map((allergy) => {
                  const info = allergyInfo[allergy];
                  if (!info) return null;
                  const label = t(`allergies.${allergy}`);
                  return (
                    <span
                      key={allergy}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${info.color}`}
                      title={label}
                    >
                      <span>{info.icon}</span>
                      <span>{label}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Fiyat */}
          <div className="flex-shrink-0">
            <span className="text-base font-semibold text-gray-900">
              {item.price.toFixed(0)} TL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

