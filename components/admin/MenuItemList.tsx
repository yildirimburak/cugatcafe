'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MenuItem, Category } from '@/lib/types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface MenuItemListProps {
  items: MenuItem[];
  categories: Category[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  locale: string;
}

export function MenuItemList({
  items,
  categories,
  onEdit,
  onDelete,
  locale
}: MenuItemListProps) {
  const t = useTranslations('common');

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return categoryId;
    return locale === 'en' && category.nameEn ? category.nameEn : category.name;
  };

  const getItemName = (item: MenuItem) => {
    return locale === 'en' && item.nameEn ? item.nameEn : item.name;
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
                  className="border-b border-slate-100 dark:border-gray-800 hover:bg-indigo-50/30 dark:hover:bg-gray-800/50 transition-colors"
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
                        onClick={() => onEdit(item)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all hover:scale-110"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
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
    </div>
  );
}

