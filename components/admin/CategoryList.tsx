'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/lib/types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getEnabledLanguages, Language } from '@/lib/firebase/languages';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  locale: string;
}

export function CategoryList({ categories, onEdit, onDelete, locale }: CategoryListProps) {
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    getEnabledLanguages().then(setLanguages).catch(() => {});
  }, []);

  const getCategoryName = (category: Category) => {
    if (locale === 'tr') return (category as any).nameTr || category.name;
    const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof Category;
    return (category as any)[nameKey] || category.name;
  };

  const getFilledLanguages = (category: Category) => {
    return languages.filter(lang => {
      const key = `name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`;
      const val = (category as any)[key];
      // Türkçe: nameTr veya name (eski format)
      if (lang.code === 'tr') return !!(val || category.name);
      return !!val && val.trim() !== '';
    });
  };

  const getMissingLanguages = (category: Category) => {
    return languages.filter(lang => {
      const key = `name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`;
      const val = (category as any)[key];
      if (lang.code === 'tr') return !(val || category.name);
      return !val || val.trim() === '';
    });
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
        <p className="text-zinc-400">Henüz kategori eklenmemiş</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      {categories.map((category, i) => {
        const filled = getFilledLanguages(category);
        const missing = getMissingLanguages(category);
        const total = languages.length;
        const allFilled = missing.length === 0 && total > 0;

        return (
          <div
            key={category.id}
            className={`px-4 py-4 hover:bg-zinc-50 transition-colors cursor-pointer ${
              i < categories.length - 1 ? 'border-b border-zinc-100' : ''
            }`}
            onClick={() => onEdit(category)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="w-7 h-7 bg-zinc-100 rounded-md flex items-center justify-center text-xs font-mono text-zinc-500 flex-shrink-0">
                  {category.order}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-900 truncate">{getCategoryName(category)}</p>
                  {/* Dil durumu */}
                  {total > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {languages.map(lang => {
                        const key = `name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`;
                        const val = (category as any)[key];
                        const hasTr = lang.code === 'tr' && (val || category.name);
                        const hasContent = hasTr || (val && val.trim() !== '');
                        return (
                          <span
                            key={lang.code}
                            title={`${lang.nativeName}: ${hasContent ? 'Var' : 'Eksik'}`}
                            className={`inline-flex items-center justify-center w-6 h-5 text-[10px] font-bold uppercase rounded ${
                              hasContent
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : 'bg-red-50 text-red-400 border border-red-200'
                            }`}
                          >
                            {lang.code}
                          </span>
                        );
                      })}
                      {!allFilled && missing.length > 0 && (
                        <span className="text-[10px] text-red-500 ml-1">
                          {missing.length} eksik
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0 ml-3">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(category); }}
                  className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(category.id); }}
                  className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
