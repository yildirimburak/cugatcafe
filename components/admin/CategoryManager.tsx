'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Category } from '@/lib/types';
import { addCategory, updateCategory, deleteCategory } from '@/lib/firebase/menu';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';
import toast from 'react-hot-toast';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface CategoryManagerProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  locale: string;
}

export function CategoryManager({ categories, onCategoriesChange, locale }: CategoryManagerProps) {
  const t = useTranslations('admin');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleAdd = async (formData: any) => {
    try {
      const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) : 0;
      const categoryData: any = {
        order: maxOrder + 1,
        // name alanını nameTr'den set et (eski format uyumluluğu)
        name: formData.nameTr || '',
      };

      // Tüm dil alanlarını formData'dan al
      Object.keys(formData).forEach(key => {
        if (key.startsWith('name')) {
          categoryData[key] = formData[key] || '';
        }
      });

      const id = await addCategory(categoryData);
      onCategoriesChange([...categories, { id, ...categoryData, createdAt: new Date() }].sort((a, b) => a.order - b.order));
      setShowForm(false);
      toast.success(t('saveSuccess'));
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const handleEdit = async (id: string, formData: any) => {
    try {
      const updateData: any = {
        // name alanını nameTr'den güncelle
        name: formData.nameTr || '',
      };

      Object.keys(formData).forEach(key => {
        if (key.startsWith('name')) {
          updateData[key] = formData[key] || '';
        }
      });

      await updateCategory(id, updateData);
      onCategoriesChange(categories.map(cat => cat.id === id ? { ...cat, ...updateData } : cat));
      setEditingCategory(null);
      setShowForm(false);
      toast.success(t('saveSuccess'));
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      await deleteCategory(id);
      onCategoriesChange(categories.filter(cat => cat.id !== id));
      toast.success(t('deleteSuccess'));
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{categories.length} kategori</p>
        <button
          onClick={() => { setEditingCategory(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          Yeni Kategori
        </button>
      </div>

      {/* Form Popup */}
      {mounted && showForm && createPortal(
        <div className="fixed inset-0 z-[9999]" onClick={() => { setShowForm(false); setEditingCategory(null); }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center">
            <div
              className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col animate-[slideUp_0.2s_ease-out] sm:animate-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sm:hidden flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 bg-zinc-300 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 flex-shrink-0">
                <h2 className="text-sm font-semibold text-zinc-900">
                  {editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
                </h2>
                <button onClick={() => { setShowForm(false); setEditingCategory(null); }} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 overscroll-contain p-5">
                <CategoryForm
                  category={editingCategory}
                  onSave={editingCategory ? (data) => handleEdit(editingCategory.id, data) : handleAdd}
                  onCancel={() => { setShowForm(false); setEditingCategory(null); }}
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <CategoryList
        categories={categories}
        onEdit={(category) => { setEditingCategory(category); setShowForm(true); }}
        onDelete={handleDelete}
        locale={locale}
      />
    </div>
  );
}
