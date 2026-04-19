'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MenuItem, Category, AllergyTag } from '@/lib/types';
import { PencilIcon, TrashIcon, XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { MenuItemForm } from './MenuItemForm';

interface MenuItemListProps {
  items: MenuItem[];
  categories: Category[];
  onEdit: (item: MenuItem) => void;
  onUpdate: (id: string, formData: any) => Promise<void>;
  onDelete: (id: string) => void;
  locale: string;
}

const allergyInfo: Record<AllergyTag, { icon: string; color: string }> = {
  gluten: { icon: '🌾', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  dairy: { icon: '🥛', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  nuts: { icon: '🥜', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  eggs: { icon: '🥚', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  fish: { icon: '🐟', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  shellfish: { icon: '🦐', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  soy: { icon: '🫘', color: 'bg-green-50 text-green-700 border-green-200' },
  sesame: { icon: '🌰', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  vegetarian: { icon: '🌿', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  vegan: { icon: '🥬', color: 'bg-lime-50 text-lime-700 border-lime-200' },
};

export function MenuItemList({ items, categories, onEdit, onUpdate, onDelete, locale }: MenuItemListProps) {
  const tMenu = useTranslations('menu');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (selectedItem && !isEditing) {
      const updatedItem = items.find(i => i.id === selectedItem.id);
      if (updatedItem) {
        const a = JSON.stringify({ ...selectedItem, updatedAt: undefined });
        const b = JSON.stringify({ ...updatedItem, updatedAt: undefined });
        if (a !== b) setSelectedItem(updatedItem);
      }
    }
  }, [items, isEditing]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [selectedItem]);

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return '';
    if (locale === 'tr') return (cat as any).nameTr || cat.name;
    const k = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof Category;
    return (cat as any)[k] || cat.name;
  };

  const getItemName = (item: MenuItem) => {
    if (locale === 'tr') return (item as any).nameTr || item.name || (item as any).nameEn || 'İsimsiz';
    const k = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof MenuItem;
    return (item as any)[k] || (item as any).nameTr || item.name || 'İsimsiz';
  };

  const getItemDescription = (item: MenuItem) => {
    if (locale === 'tr') return (item as any).descriptionTr || item.description || (item as any).descriptionEn || '';
    const k = `description${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof MenuItem;
    return (item as any)[k] || (item as any).descriptionTr || item.description || '';
  };

  const closeModal = () => { setSelectedItem(null); setIsEditing(false); };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
        <p className="text-zinc-400">Henüz ürün eklenmemiş</p>
      </div>
    );
  }

  return (
    <>
      {/* Item list */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden divide-y divide-zinc-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-zinc-50 active:bg-zinc-100 transition-colors group"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('button')) return;
              setSelectedItem(item);
            }}
          >
            {/* Image */}
            {item.imageUrl ? (
              <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
                <Image src={item.imageUrl} alt={getItemName(item)} fill className="object-cover" unoptimized={item.imageUrl.startsWith('data:image/')} />
              </div>
            ) : (
              <div className="w-11 h-11 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0 text-base">🍽️</div>
            )}

            {/* Info */}
            <div className={`flex-1 min-w-0 ${!item.available ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-zinc-900 truncate">{getItemName(item)}</p>
                {!item.available && (
                  <span className="px-1 py-px text-[9px] font-semibold rounded bg-red-100 text-red-600 flex-shrink-0 uppercase">Yok</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-zinc-400 truncate">{getCategoryName(item.category)}</span>
                <span className="text-zinc-300">·</span>
                <span className="text-[11px] font-semibold text-zinc-600 tabular-nums flex-shrink-0">{item.price.toFixed(0)} ₺</span>
              </div>
              {item.allergies && item.allergies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {item.allergies.map(allergy => {
                    const info = allergyInfo[allergy];
                    if (!info) return null;
                    return (
                      <span key={allergy} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] border ${info.color}`}>
                        <span>{info.icon}</span>
                        <span>{tMenu(`allergies.${allergy}`)}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Arrow */}
            <ChevronRightIcon className="w-4 h-4 text-zinc-300 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
          </div>
        ))}
      </div>

      {/* Detail / Edit Modal */}
      {mounted && selectedItem && createPortal(
        <div className="fixed inset-0 z-[9999]" onClick={closeModal}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

          {/* Panel - slides up on mobile, centered on desktop */}
          <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center">
            <div
              className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[94vh] sm:max-h-[85vh] flex flex-col animate-[slideUp_0.2s_ease-out] sm:animate-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar (mobile) */}
              <div className="sm:hidden flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 bg-zinc-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {!isEditing && selectedItem.imageUrl && (
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
                      <Image src={selectedItem.imageUrl} alt="" fill className="object-cover" unoptimized={selectedItem.imageUrl.startsWith('data:image/')} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-zinc-900 truncate">
                      {isEditing ? 'Ürünü Düzenle' : getItemName(selectedItem)}
                    </h2>
                    {!isEditing && (
                      <p className="text-[11px] text-zinc-400">{getCategoryName(selectedItem.category)} · {selectedItem.price.toFixed(0)} ₺</p>
                    )}
                  </div>
                </div>
                <button onClick={closeModal} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors flex-shrink-0 ml-2">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 overscroll-contain">
                {isEditing ? (
                  <div className="p-5">
                    <MenuItemForm
                      categories={categories}
                      item={selectedItem}
                      onSave={async (formData) => { await onUpdate(selectedItem.id, formData); setIsEditing(false); }}
                      onCancel={() => setIsEditing(false)}
                      locale={locale}
                    />
                  </div>
                ) : (
                  <>
                    {/* Image */}
                    {selectedItem.imageUrl && (
                      <div className="relative w-full aspect-[16/10] bg-zinc-100">
                        <Image src={selectedItem.imageUrl} alt={getItemName(selectedItem)} fill className="object-cover" unoptimized={selectedItem.imageUrl.startsWith('data:image/')} />
                      </div>
                    )}

                    <div className="p-5 space-y-4">
                      {/* Description */}
                      {getItemDescription(selectedItem) && (
                        <p className="text-sm text-zinc-600 leading-relaxed">{getItemDescription(selectedItem)}</p>
                      )}

                      {/* Details grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-zinc-50 rounded-lg p-3">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Kategori</p>
                          <p className="text-xs font-medium text-zinc-700">{getCategoryName(selectedItem.category)}</p>
                        </div>
                        <div className="bg-zinc-50 rounded-lg p-3">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Fiyat</p>
                          <p className="text-xs font-semibold text-zinc-900">{selectedItem.price.toFixed(2)} ₺</p>
                        </div>
                        <div className="bg-zinc-50 rounded-lg p-3">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Durum</p>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${selectedItem.available ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="text-xs font-medium text-zinc-700">
                              {selectedItem.available ? 'Mevcut' : 'Yok'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Allergies */}
                      {selectedItem.allergies && selectedItem.allergies.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-2">Alerjenler</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedItem.allergies.map((allergy) => {
                              const info = allergyInfo[allergy];
                              if (!info) return null;
                              return (
                                <span key={allergy} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] border ${info.color}`}>
                                  <span>{info.icon}</span>
                                  <span>{tMenu(`allergies.${allergy}`)}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions - sticky bottom */}
                    <div className="sticky bottom-0 bg-white border-t border-zinc-100 px-5 py-3 flex gap-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
                            onDelete(selectedItem.id);
                            setSelectedItem(null);
                          }
                        }}
                        className="px-4 py-2.5 border border-zinc-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-200 transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
