'use client';

import { Category } from '@/lib/types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  locale: string;
}

export function CategoryList({
  categories,
  onEdit,
  onDelete,
  locale
}: CategoryListProps) {
  const getCategoryName = (category: Category) => {
    // Dinamik olarak locale'a göre name alanını bul
    if (locale === 'tr') return category.name;
    const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof Category;
    const translatedName = (category as any)[nameKey];
    return translatedName || category.name; // Fallback to Turkish
  };

  return (
    <div className="space-y-4">
      {categories.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          Henüz kategori eklenmemiş
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200 dark:border-gray-700 flex justify-between items-center hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
            >
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">
                  {getCategoryName(category)}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(category)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all hover:scale-110"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all hover:scale-110"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

