'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Category } from '@/lib/types';
import { addCategory, updateCategory, deleteCategory } from '@/lib/firebase/menu';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';
import toast from 'react-hot-toast';

interface CategoryManagerProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  locale: string;
}

export function CategoryManager({
  categories,
  onCategoriesChange,
  locale
}: CategoryManagerProps) {
  const t = useTranslations('admin');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAdd = async (formData: any) => {
    try {
      const maxOrder = categories.length > 0 
        ? Math.max(...categories.map(c => c.order)) 
        : 0;

      // Tüm diller için dinamik categoryData oluştur
      const categoryData: any = {
        order: maxOrder + 1,
      };
      
      // Her dil için name alanlarını ekle
      locales.forEach((loc: string) => {
        const nameKey = `name${loc.charAt(0).toUpperCase() + loc.slice(1)}`;
        categoryData[nameKey] = formData[nameKey] || '';
      });

      const id = await addCategory(categoryData);
      const newCategory: Category = {
        id,
        ...categoryData,
        createdAt: new Date(),
      };

      onCategoriesChange([...categories, newCategory].sort((a, b) => a.order - b.order));
      setShowForm(false);
      toast.success(t('saveSuccess'));
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const handleEdit = async (id: string, formData: any) => {
    try {
      // Tüm diller için dinamik updateData oluştur
      const updateData: any = {};
      locales.forEach((loc: string) => {
        const nameKey = `name${loc.charAt(0).toUpperCase() + loc.slice(1)}`;
        updateData[nameKey] = formData[nameKey] || '';
      });

      await updateCategory(id, updateData);

      onCategoriesChange(
        categories.map(cat =>
          cat.id === id
            ? {
                ...cat,
                ...updateData,
              }
            : cat
        )
      );

      setEditingCategory(null);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('categories')}
        </h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 font-medium"
        >
          + {t('addCategory')}
        </button>
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSave={editingCategory ? (data) => handleEdit(editingCategory.id, data) : handleAdd}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      <CategoryList
        categories={categories}
        onEdit={(category) => {
          setEditingCategory(category);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        locale={locale}
      />
    </div>
  );
}

