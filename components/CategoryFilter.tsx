'use client';

import { useTranslations } from 'next-intl';
import { Category } from '@/lib/types';
import { type Locale } from '@/i18n';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  locale: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  locale
}: CategoryFilterProps) {
  const t = useTranslations('common');

  const getCategoryName = (category: Category) => {
    // Dinamik olarak locale'a göre name alanını bul
    if (locale === 'tr') return category.name;
    const nameKey = `name${(locale as string).charAt(0).toUpperCase() + (locale as string).slice(1)}` as keyof Category;
    const translatedName = (category as any)[nameKey];
    return translatedName || category.name; // Fallback to Turkish
  };

  const handleCategoryClick = (categoryId: string) => {
    onSelectCategory(categoryId);
    
    // Scroll işlemi için kısa bir delay (DOM güncellenmesi için)
    setTimeout(() => {
      if (categoryId === 'all') {
        // "Tümü" seçilirse en üste scroll et
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Kategori bölümüne scroll et
        const element = document.getElementById(`category-${categoryId}`);
        if (element) {
          const headerHeight = 130; // Header (56px) + kategori filtre (74px) yüksekliği
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }, 150);
  };

  // Kategori ikonları için renkli gradient'ler
  const categoryColors = [
    'bg-gradient-to-br from-pink-400 to-red-500',
    'bg-gradient-to-br from-yellow-400 to-orange-500',
    'bg-gradient-to-br from-blue-400 to-purple-500',
    'bg-gradient-to-br from-green-400 to-teal-500',
    'bg-gradient-to-br from-indigo-400 to-pink-500',
    'bg-gradient-to-br from-amber-400 to-yellow-500',
    'bg-gradient-to-br from-cyan-400 to-blue-500',
    'bg-gradient-to-br from-rose-400 to-pink-500',
  ];

  return (
    <div className="sticky top-14 z-40 mb-8 bg-white/95 backdrop-blur-sm pt-4 pb-2 -mx-4 px-4">
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        <button
          onClick={() => handleCategoryClick('all')}
          className="flex flex-col items-center gap-2 flex-shrink-0 group"
        >
          <div
            className={`w-16 h-16 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 transition-transform group-hover:scale-110 ${
              selectedCategory === 'all' ? 'ring-2 ring-gray-900 ring-offset-2' : ''
            }`}
          />
          <span
            className={`text-xs text-center max-w-[80px] ${
              selectedCategory === 'all'
                ? 'text-gray-900 font-semibold'
                : 'text-gray-600'
            }`}
          >
            {t('all')}
          </span>
        </button>
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div
              className={`w-16 h-16 rounded-lg ${categoryColors[index % categoryColors.length]} transition-transform group-hover:scale-110 ${
                selectedCategory === category.id ? 'ring-2 ring-gray-900 ring-offset-2' : ''
              }`}
            />
            <span
              className={`text-xs text-center max-w-[80px] ${
                selectedCategory === category.id
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-600'
              }`}
            >
              {getCategoryName(category)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

