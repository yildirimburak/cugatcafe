'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MenuItem, Category, AllergyTag } from '@/lib/types';
import { MenuCard } from './MenuCard';
import { CategoryFilter } from './CategoryFilter';
import { getMenuItems, getCategories } from '@/lib/firebase/menu';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MenuSectionProps {
  locale: string;
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

export function MenuSection({ locale }: MenuSectionProps) {
  const t = useTranslations('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
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
  };

  useEffect(() => {
    fetchData();
    
    // Sayfa focus olduğunda verileri yenile
    const handleFocus = () => {
      fetchData();
    };
    
    // Sayfa görünür olduğunda da yenile (visibility API)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Scroll spy: Hangi kategori görünürse onu seç
  useEffect(() => {
    if (loading || categories.length === 0 || typeof window === 'undefined') return;

    const headerHeight = 56; // Kategori filtre yüksekliği
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
          if (scrollY < menuRect.top + scrollY - 100) {
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

        // Kategori filtrenin hemen altına geçen en son kategoriyi bul
        const checkPoint = scrollY + headerHeight + 50; // Kategori filtre + biraz offset
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
    if (locale === 'tr') {
      // Türkçe için önce nameTr field'ını dene (yeni format), sonra name (eski format), sonra nameEn
      return (item as any).nameTr || item.name || (item as any).nameEn || 'İsimsiz';
    }
    const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof MenuItem;
    const translatedName = (item as any)[nameKey];
    // Önce çevrilmiş ismi dene, sonra nameTr (yeni Türkçe format), sonra name (eski Türkçe format), en son nameEn
    return translatedName || (item as any).nameTr || item.name || (item as any).nameEn || 'İsimsiz';
  };

  const getItemDescription = (item: MenuItem) => {
    // Dinamik olarak locale'a göre description alanını bul
    if (locale === 'tr') {
      return (item as any).descriptionTr || item.description || (item as any).descriptionEn || '';
    }
    const descKey = `description${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof MenuItem;
    const translatedDesc = (item as any)[descKey];
    return translatedDesc || (item as any).descriptionTr || item.description || (item as any).descriptionEn || '';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Yükleniyor...</p>
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
              className="mb-8 scroll-mt-[56px]"
            >
              {category && (
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">
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
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detay Popup */}
      {selectedItem && (
        <div className="fixed inset-0 z-50" onClick={() => setSelectedItem(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center">
            <div
              className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-[slideUp_0.2s_ease-out] sm:animate-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar (mobile) */}
              <div className="sm:hidden flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 bg-zinc-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 flex-shrink-0">
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-zinc-900 truncate">{getItemName(selectedItem)}</h2>
                  <p className="text-[11px] text-zinc-400">
                    {getCategoryName(categories.find(c => c.id === selectedItem.category) || null)} · {selectedItem.price.toFixed(0)} {locale === 'en' ? 'TRY' : '₺'}
                  </p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors flex-shrink-0 ml-2">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 overscroll-contain">
                {selectedItem.imageUrl && (
                  <div className="relative w-full aspect-[16/10] bg-zinc-100">
                    <Image
                      src={selectedItem.imageUrl}
                      alt={getItemName(selectedItem)}
                      fill
                      className="object-cover"
                      unoptimized={selectedItem.imageUrl.startsWith('data:image/')}
                    />
                  </div>
                )}

                <div className="p-5 space-y-4">
                  {getItemDescription(selectedItem) && (
                    <p className="text-sm text-zinc-600 leading-relaxed">{getItemDescription(selectedItem)}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-50 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">{t('category')}</p>
                      <p className="text-xs font-medium text-zinc-700">{getCategoryName(categories.find(c => c.id === selectedItem.category) || null)}</p>
                    </div>
                    <div className="bg-zinc-50 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">{t('price')}</p>
                      <p className="text-xs font-semibold text-zinc-900">{selectedItem.price.toFixed(0)} {locale === 'en' ? 'TRY' : '₺'}</p>
                    </div>
                  </div>

                  {selectedItem.allergies && selectedItem.allergies.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-2">{t('allergyInfo')}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedItem.allergies.map((allergy) => {
                          const info = allergyInfo[allergy];
                          if (!info) return null;
                          const label = t(`allergies.${allergy}`);
                          return (
                            <span key={allergy} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium ${info.color}`}>
                              <span>{info.icon}</span>
                              <span>{label}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

