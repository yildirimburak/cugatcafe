'use client';

import { useEffect, useRef } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getCategoryName = (category: Category) => {
    // Dinamik olarak locale'a göre name alanını bul
    if (locale === 'tr') return category.name;
    const nameKey = `name${(locale as string).charAt(0).toUpperCase() + (locale as string).slice(1)}` as keyof Category;
    const translatedName = (category as any)[nameKey];
    return translatedName || category.name; // Fallback to Turkish
  };

  // Seçili kategori değiştiğinde, butonu scroll container içinde görünür yap
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    
    // Seçili kategori butonunu bul (data-category-id attribute ile)
    const selectedButton = container.querySelector(
      `button[data-category-id="${selectedCategory}"]`
    ) as HTMLButtonElement;

    if (!selectedButton) return;

    // Kısa bir delay ile scroll et (DOM'un güncellenmesi için)
    setTimeout(() => {
      const buttonRect = selectedButton.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Buton container'ın dışındaysa scroll et
      if (buttonRect.left < containerRect.left) {
        // Buton solda dışarıda, sola scroll et
        container.scrollTo({
          left: container.scrollLeft + (buttonRect.left - containerRect.left) - 16,
          behavior: 'smooth'
        });
      } else if (buttonRect.right > containerRect.right) {
        // Buton sağda dışarıda, sağa scroll et
        container.scrollTo({
          left: container.scrollLeft + (buttonRect.right - containerRect.right) + 16,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, [selectedCategory]);

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
          const headerHeight = 56; // Kategori filtre yüksekliği
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

  return (
    <div className="sticky top-0 z-40 mb-8 bg-white/95 backdrop-blur-sm py-3 border-b border-gray-100 -mx-4 px-4">
      <div className="flex gap-4 items-center">
        {/* Tümü butonu - sabit kalacak */}
        <button
          data-category-id="all"
          onClick={() => handleCategoryClick('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
            selectedCategory === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t('all')}
        </button>
        
        {/* Diğer kategoriler - scroll edilebilir */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide flex-1"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              data-category-id={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                selectedCategory === category.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryName(category)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

