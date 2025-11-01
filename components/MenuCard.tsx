'use client';

import Image from 'next/image';
import { MenuItem } from '@/lib/types';

interface MenuCardProps {
  item: MenuItem;
  name: string;
  description: string;
}

export function MenuCard({ item, name, description }: MenuCardProps) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">
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
            {/* İkonlar (vejetaryen, vb.) */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">🌿</span>
              <span className="text-xs text-gray-400">🥚</span>
            </div>
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

