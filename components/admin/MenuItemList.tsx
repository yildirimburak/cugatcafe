'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MenuItem, Category, AllergyTag } from '@/lib/types';
import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MenuItemListProps {
  items: MenuItem[];
  categories: Category[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  locale: string;
}

// Alerji tag ikonları ve renkleri
const allergyInfo: Record<AllergyTag, { icon: string; label: string; color: string }> = {
  gluten: { icon: '🌾', label: 'Gluten', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  dairy: { icon: '🥛', label: 'Süt', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  nuts: { icon: '🥜', label: 'Fındık', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  eggs: { icon: '🥚', label: 'Yumurta', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  fish: { icon: '🐟', label: 'Balık', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300' },
  shellfish: { icon: '🦐', label: 'Kabuklu', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
  soy: { icon: '🫘', label: 'Soya', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  sesame: { icon: '🌰', label: 'Susam', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  vegetarian: { icon: '🌿', label: 'Vejetaryen', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' },
  vegan: { icon: '🥬', label: 'Vegan', color: 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300' },
};

export function MenuItemList({
  items,
  categories,
  onEdit,
  onDelete,
  locale
}: MenuItemListProps) {
  const t = useTranslations('common');
  const tMenu = useTranslations('menu');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return categoryId;
    // Dinamik olarak locale'a göre name alanını bul
    if (locale === 'tr') return category.name;
    const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof Category;
    const translatedName = (category as any)[nameKey];
    return translatedName || category.name; // Fallback to Turkish
  };

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

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
          Henüz ürün eklenmemiş
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-gray-700 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-gray-800 dark:to-gray-800">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Resim</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Ad</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Kategori</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Fiyat</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Durum</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 dark:border-gray-800 hover:bg-indigo-50/30 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={(e) => {
                    // İşlem butonlarına tıklanırsa popup açılmasın
                    if ((e.target as HTMLElement).closest('button')) return;
                    setSelectedItem(item);
                  }}
                >
                  <td className="py-3 px-4">
                    {item.imageUrl ? (
                      <div className="relative w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={getItemName(item)}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-xl">🍽️</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {getItemName(item)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {getCategoryName(item.category)}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {item.price.toFixed(2)} ₺
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.available
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {item.available ? 'Mevcut' : 'Mevcut Değil'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item);
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all hover:scale-110"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all hover:scale-110"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detay Popup */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {getItemName(selectedItem)}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Resim */}
              {selectedItem.imageUrl && (
                <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Image
                    src={selectedItem.imageUrl}
                    alt={getItemName(selectedItem)}
                    fill
                    className="object-contain p-4"
                  />
                </div>
              )}

              {/* Açıklama */}
              {getItemDescription(selectedItem) && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {tMenu('description')}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {getItemDescription(selectedItem)}
                  </p>
                </div>
              )}

              {/* Detaylar */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {tMenu('category')}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {getCategoryName(selectedItem.category)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {tMenu('price')}
                  </h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                    {selectedItem.price.toFixed(2)} {locale === 'en' ? 'TRY' : '₺'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {tMenu('status')}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 text-sm rounded-full ${
                      selectedItem.available
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {selectedItem.available ? tMenu('available') : tMenu('notAvailable')}
                  </span>
                </div>
              </div>

              {/* Alerji Bilgileri */}
              {selectedItem.allergies && selectedItem.allergies.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    {tMenu('allergyInfo')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.allergies.map((allergy) => {
                      const info = allergyInfo[allergy];
                      if (!info) return null;
                      return (
                        <span
                          key={allergy}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${info.color}`}
                          title={info.label}
                        >
                          <span className="text-base">{info.icon}</span>
                          <span>{info.label}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* İşlemler */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    onEdit(selectedItem);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <PencilIcon className="w-5 h-5" />
                  Düzenle
                </button>
                <button
                  onClick={() => {
                    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
                      onDelete(selectedItem.id);
                      setSelectedItem(null);
                    }
                  }}
                  className="px-4 py-2.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <TrashIcon className="w-5 h-5" />
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

