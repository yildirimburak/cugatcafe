'use client';

import { useState, useMemo } from 'react';
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
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

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

      // FormData'dan gelen tüm alanları kullan (sadece aktif diller için alanlar var)
      // imageFile'ı hariç tut
      const { imageFile, ...itemDataWithoutFile } = formData;
      
      const itemData: any = {
        ...itemDataWithoutFile,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: imageUrl || '',
        available: formData.available !== false,
        allergies: formData.allergies || [],
      };

      console.log('Eklenen veri:', itemData);
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

      // FormData'dan gelen tüm alanları kullan (sadece aktif diller için alanlar var)
      // imageFile'ı hariç tut ve temel alanları override et
      const { imageFile, price, category, imageUrl: formImageUrl, available, allergies, ...restFormData } = formData;
      
      const updateData: any = {
        ...restFormData, // nameTr, nameEn, descriptionTr, descriptionEn vb. tüm dil alanları burada
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: imageUrl || formData.imageUrl,
        available: formData.available !== false,
        allergies: formData.allergies || [],
      };

      console.log('Güncellenecek veri (tüm alanlar):', updateData);
      console.log('Rest form data (dil alanları):', restFormData);
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

  // Ürün ismini almak için helper fonksiyon
  const getItemName = (item: MenuItem) => {
    if (locale === 'tr') {
      return (item as any).nameTr || item.name || (item as any).nameEn || '';
    }
    const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof MenuItem;
    const translatedName = (item as any)[nameKey];
    return translatedName || (item as any).nameTr || item.name || (item as any).nameEn || '';
  };

  // Ürün açıklamasını almak için helper fonksiyon
  const getItemDescription = (item: MenuItem) => {
    if (locale === 'tr') {
      return (item as any).descriptionTr || item.description || (item as any).descriptionEn || '';
    }
    const descKey = `description${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof MenuItem;
    const translatedDesc = (item as any)[descKey];
    return translatedDesc || (item as any).descriptionTr || item.description || (item as any).descriptionEn || '';
  };

  // Filtrelenmiş ürünler
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Kategori filtresi
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Arama filtresi
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const name = getItemName(item).toLowerCase();
        const description = getItemDescription(item).toLowerCase();
        const price = item.price.toString();
        
        return name.includes(query) || description.includes(query) || price.includes(query);
      }

      return true;
    });
  }, [items, selectedCategory, searchQuery, locale]);

  // Kategori ismini almak için helper fonksiyon
  const getCategoryName = (category: Category) => {
    if (locale === 'tr') return category.name;
    const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof Category;
    const translatedName = (category as any)[nameKey];
    return translatedName || category.name;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('items')} ({filteredItems.length})
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all font-medium flex items-center gap-2"
          >
            <FunnelIcon className="w-5 h-5" />
            Filtrele
          </button>
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
      </div>

      {/* Filtreleme paneli */}
      {showFilters && (
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border border-slate-200/50 dark:border-gray-700/50 shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filtrele</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Arama kutusu */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Arama
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün adı, açıklama veya fiyat ile ara..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Kategori filtresi */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryName(category)}
                </option>
              ))}
            </select>
          </div>

          {/* Filtreleri temizle */}
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="w-full px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-all font-medium"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      )}

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
        items={filteredItems}
        categories={categories}
        onEdit={(item) => {
          setEditingItem(item);
          setShowForm(true);
        }}
        onUpdate={handleEdit}
        onDelete={handleDelete}
        locale={locale}
      />
    </div>
  );
}

