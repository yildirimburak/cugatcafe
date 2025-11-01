'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MenuItem, Category } from '@/lib/types';
import { MenuCard } from './MenuCard';
import { CategoryFilter } from './CategoryFilter';
import { getMenuItems, getCategories } from '@/lib/firebase/menu';

interface MenuSectionProps {
  locale: string;
}

export function MenuSection({ locale }: MenuSectionProps) {
  const t = useTranslations('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [menuItems, categoryList] = await Promise.all([
          getMenuItems(),
          getCategories()
        ]);
        setItems(menuItems);
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Scroll spy: Hangi kategori görünürse onu seç
  useEffect(() => {
    if (loading || categories.length === 0 || typeof window === 'undefined') return;

    const headerHeight = 112; // Header (56px) + kategori filtre (56px) yüksekliği
    let rafId: number | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (isScrolling || ticking) return;
      
      ticking = true;
      rafId = requestAnimationFrame(() => {
        ticking = false;
        
        const scrollY = window.scrollY;

        // Eğer sayfa çok üstteyse "all" seç
        const menuSection = document.getElementById('menu');
        if (menuSection) {
          const menuRect = menuSection.getBoundingClientRect();
          if (scrollY < menuRect.top + scrollY - 150) {
            setSelectedCategory((prev) => prev !== 'all' ? 'all' : prev);
            return;
          }
        }

        // Tüm kategori başlıklarını kontrol et
        const allSections: Array<{ id: string; top: number }> = [];

        categories.forEach(category => {
          const element = document.getElementById(`category-${category.id}`);
          if (element) {
            const rect = element.getBoundingClientRect();
            allSections.push({ 
              id: category.id, 
              top: rect.top + scrollY
            });
          }
        });

        // "other" bölümünü de ekle
        const otherElement = document.getElementById('other');
        if (otherElement) {
          const rect = otherElement.getBoundingClientRect();
          allSections.push({ 
            id: 'other', 
            top: rect.top + scrollY
          });
        }

        // Kategorileri pozisyona göre sırala
        allSections.sort((a, b) => a.top - b.top);

        // Header'ın hemen altına geçen en son kategoriyi bul
        const checkPoint = scrollY + headerHeight + 50; // Header + biraz offset
        let activeCategory: string | null = null;

        for (let i = allSections.length - 1; i >= 0; i--) {
          const section = allSections[i];
          if (section.top <= checkPoint) {
            activeCategory = section.id;
            break;
          }
        }

        // Eğer hiç kategori geçmediyse, ilk kategoriyi seç
        if (!activeCategory && allSections.length > 0) {
          activeCategory = allSections[0].id;
        }

        if (activeCategory) {
          setSelectedCategory((prev) => {
            if (prev !== activeCategory) {
              return activeCategory!;
            }
            return prev;
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // İlk yüklemede kontrol et
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      clearTimeout(timeoutId);
    };
  }, [loading, categories, isScrolling]);

  // Tüm mevcut ürünleri göster (filtreleme yapmıyoruz, sadece scroll için)
  const filteredItems = items.filter(item => item.available);

  const getItemName = (item: MenuItem) => {
    // Dinamik olarak locale'a göre name alanını bul
    if (locale === 'tr') return item.name;
    const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof MenuItem;
    const translatedName = (item as any)[nameKey];
    return translatedName || item.name; // Fallback to Turkish
  };

  const getItemDescription = (item: MenuItem) => {
    // Dinamik olarak locale'a göre description alanını bul
    if (locale === 'tr') return item.description;
    const descKey = `description${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof MenuItem;
    const translatedDesc = (item as any)[descKey];
    return translatedDesc || item.description; // Fallback to Turkish
  };

  const getCategoryName = (category: Category | null) => {
    if (!category) return '';
    // Dinamik olarak locale'a göre name alanını bul
    if (locale === 'tr') return category.name;
    const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof Category;
    const translatedName = (category as any)[nameKey];
    return translatedName || category.name; // Fallback to Turkish
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Yükleniyor...</p>
      </div>
    );
  }

  // Kategorilere göre grupla
  const itemsByCategory = categories.reduce((acc, category) => {
    const categoryItems = filteredItems.filter(item => item.category === category.id);
    if (categoryItems.length > 0) {
      acc.push({ category, items: categoryItems });
    }
    return acc;
  }, [] as Array<{ category: Category | null; items: MenuItem[] }>);

  const allItems = filteredItems.filter(item => !item.category || !categories.find(c => c.id === item.category));
  if (allItems.length > 0) {
    itemsByCategory.push({ category: null, items: allItems });
  }

  const handleCategorySelect = (categoryId: string) => {
    setIsScrolling(true);
    setSelectedCategory(categoryId);
    // Manuel scroll bittikten sonra otomatik seçimi tekrar etkinleştir
    setTimeout(() => setIsScrolling(false), 1000);
  };

  return (
    <section id="menu">
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        locale={locale}
      />

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {t('noItems')}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Tüm kategorileri göster, scroll için ID'ler ekle */}
          {itemsByCategory.map(({ category, items }) => (
            <div 
              key={category?.id || 'other'} 
              id={category ? `category-${category.id}` : 'other'}
              className="mb-8 scroll-mt-[112px]"
            >
              {category && (
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {getCategoryName(category)}
                </h2>
              )}
              <div className="bg-white rounded-lg">
                {items.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    name={getItemName(item)}
                    description={getItemDescription(item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

