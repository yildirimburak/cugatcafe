'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MenuItem, Category } from '@/lib/types';
import { 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '@/lib/firebase/menu';
import { uploadImage } from '@/lib/firebase/storage';
import { MenuItemForm } from './MenuItemForm';
import { MenuItemList } from './MenuItemList';
import { locales } from '@/i18n';
import toast from 'react-hot-toast';

interface MenuItemManagerProps {
  items: MenuItem[];
  categories: Category[];
  onItemsChange: (items: MenuItem[]) => void;
  locale: string;
}

export function MenuItemManager({
  items,
  categories,
  onItemsChange,
  locale
}: MenuItemManagerProps) {
  const t = useTranslations('admin');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleAdd = async (formData: any) => {
    try {
      let imageUrl = formData.imageUrl;
      
      if (formData.imageFile) {
        try {
          // Local public klasörüne kaydet
          imageUrl = await uploadImage(formData.imageFile, '');
        } catch (imageError: any) {
          console.warn('Resim yüklenemedi, resim olmadan devam ediliyor:', imageError.message);
          toast.error('Resim yüklenemedi: ' + imageError.message);
          // Resim yükleme hatası olsa bile devam et
        }
      }

      // Tüm diller için dinamik itemData oluştur
      const itemData: any = {
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: imageUrl || '',
        available: formData.available !== false,
      };
      
      // Her dil için name ve description alanlarını ekle
      locales.forEach((loc: string) => {
        const nameKey = `name${loc.charAt(0).toUpperCase() + loc.slice(1)}`;
        const descKey = `description${loc.charAt(0).toUpperCase() + loc.slice(1)}`;
        itemData[nameKey] = formData[nameKey] || '';
        itemData[descKey] = formData[descKey] || '';
      });

      const id = await addMenuItem(itemData);
      const newItem: MenuItem = {
        id,
        ...itemData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      onItemsChange([newItem, ...items]);
      setShowForm(false);
      toast.success(t('saveSuccess'));
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const handleEdit = async (id: string, formData: any) => {
    try {
      let imageUrl = formData.imageUrl;
      
      if (formData.imageFile) {
        try {
          // Local public klasörüne kaydet
          imageUrl = await uploadImage(formData.imageFile, '');
        } catch (imageError: any) {
          console.warn('Resim yüklenemedi, mevcut resim korunuyor:', imageError.message);
          toast.error('Resim yüklenemedi: ' + imageError.message);
          // Resim yükleme hatası olsa bile mevcut imageUrl'i kullan
        }
      }

      // Tüm diller için dinamik updateData oluştur
      const updateData: any = {
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: imageUrl || formData.imageUrl,
        available: formData.available !== false,
      };
      
      // Her dil için name ve description alanlarını ekle
      locales.forEach((loc: string) => {
        const nameKey = `name${loc.charAt(0).toUpperCase() + loc.slice(1)}`;
        const descKey = `description${loc.charAt(0).toUpperCase() + loc.slice(1)}`;
        updateData[nameKey] = formData[nameKey] || '';
        updateData[descKey] = formData[descKey] || '';
      });

      await updateMenuItem(id, updateData);

      onItemsChange(
        items.map(item =>
          item.id === id
            ? {
                ...item,
                ...updateData,
                updatedAt: new Date(),
              }
            : item
        )
      );

      setEditingItem(null);
      toast.success(t('saveSuccess'));
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

    try {
      await deleteMenuItem(id);
      onItemsChange(items.filter(item => item.id !== id));
      toast.success(t('deleteSuccess'));
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('items')}
        </h2>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 font-medium"
        >
          + {t('addItem')}
        </button>
      </div>

      {showForm && (
        <MenuItemForm
          categories={categories}
          item={editingItem}
          onSave={editingItem ? (data) => handleEdit(editingItem.id, data) : handleAdd}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          locale={locale}
        />
      )}

      <MenuItemList
        items={items}
        categories={categories}
        onEdit={(item) => {
          setEditingItem(item);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        locale={locale}
      />
    </div>
  );
}

