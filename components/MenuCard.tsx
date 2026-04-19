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
      className="flex items-start gap-3 py-3 border-b border-zinc-100 last:border-b-0 cursor-pointer active:bg-zinc-50 transition-colors"
      onClick={onClick}
    >
      {/* Resim */}
      <div className="flex-shrink-0">
        {item.imageUrl ? (
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-zinc-100">
            <Image
              src={item.imageUrl}
              alt={name}
              fill
              className="object-cover"
              unoptimized={item.imageUrl.startsWith('data:image/')}
            />
          </div>
        ) : (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-zinc-100 flex items-center justify-center">
            <span className="text-xl">🍽️</span>
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-zinc-900 leading-tight">
            {name}
          </h3>
          <span className="text-sm font-semibold text-zinc-900 tabular-nums flex-shrink-0">
            {item.price.toFixed(0)} ₺
          </span>
        </div>
        {description && (
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
        {item.allergies && item.allergies.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-1.5">
            {item.allergies.map((allergy) => {
              const info = allergyInfo[allergy];
              if (!info) return null;
              return (
                <span
                  key={allergy}
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${info.color}`}
                >
                  <span>{info.icon}</span>
                  <span className="hidden sm:inline">{t(`allergies.${allergy}`)}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
