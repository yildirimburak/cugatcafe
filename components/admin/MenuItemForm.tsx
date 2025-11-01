'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MenuItem, Category } from '@/lib/types';
import { getEnabledLanguages, Language } from '@/lib/firebase/languages';

interface MenuItemFormProps {
  categories: Category[];
  item?: MenuItem | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  locale: string;
}

export function MenuItemForm({
  categories,
  item,
  onSave,
  onCancel,
  locale
}: MenuItemFormProps) {
  const t = useTranslations('admin');
  const [activeLanguage, setActiveLanguage] = useState<string>('tr');
  const [enabledLanguages, setEnabledLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Aktif dilleri yükle
  useEffect(() => {
    async function fetchLanguages() {
      try {
        const langs = await getEnabledLanguages();
        // Türkçe'yi mutlaka listeye ekle (eğer yoksa)
        const hasTurkish = langs.some(lang => lang.code === 'tr');
        if (!hasTurkish) {
          langs.unshift({ 
            id: 'tr', 
            code: 'tr', 
            name: 'Turkish', 
            nativeName: 'Türkçe', 
            enabled: true, 
            createdAt: new Date(), 
            updatedAt: new Date() 
          });
        } else {
          // Türkçe'yi en başa taşı
          const trIndex = langs.findIndex(l => l.code === 'tr');
          if (trIndex > 0) {
            const trLang = langs.splice(trIndex, 1)[0];
            langs.unshift(trLang);
          }
        }
        setEnabledLanguages(langs);
        // Türkçe'yi varsayılan olarak seç
        setActiveLanguage('tr');
      } catch (error) {
        console.error('Error fetching languages:', error);
        // Hata durumunda en azından tr'yi göster
        setEnabledLanguages([{ id: 'tr', code: 'tr', name: 'Turkish', nativeName: 'Türkçe', enabled: true, createdAt: new Date(), updatedAt: new Date() }]);
        setActiveLanguage('tr');
      } finally {
        setLoading(false);
      }
    }
    fetchLanguages();
  }, []);
  
  // Aktif diller için dinamik form state
  const initialFormData: any = {
    price: '',
    category: categories[0]?.id || '',
    imageFile: null as File | null,
    imageUrl: '',
    available: true,
  };
  
  const [formData, setFormData] = useState(initialFormData);

  // Form state'i aktif dillere göre güncelle
  useEffect(() => {
    if (enabledLanguages.length > 0) {
      const data: any = {
        price: '',
        category: categories[0]?.id || '',
        imageFile: null,
        imageUrl: '',
        available: true,
      };
      
      // Sadece aktif diller için alanlar oluştur
      enabledLanguages.forEach(lang => {
        data[`name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`] = '';
        data[`description${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`] = '';
      });
      
      if (item) {
        data.price = item.price.toString();
        data.category = item.category;
        data.imageUrl = item.imageUrl || '';
        data.available = item.available;
        
        // Mevcut item'dan sadece aktif diller için değerleri yükle
        enabledLanguages.forEach(lang => {
          const nameKey = `name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`;
          const descKey = `description${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`;
          data[nameKey] = (item as any)[nameKey] || '';
          data[descKey] = (item as any)[descKey] || '';
        });
      }
      
      setFormData(data);
    }
  }, [item, enabledLanguages, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Türkçe alanlarının dolu olduğunu kontrol et
    const turkishName = formData.nameTr?.trim() || '';
    const turkishDescription = formData.descriptionTr?.trim() || '';
    
    if (!turkishName) {
      alert('Türkçe ürün adı zorunludur!');
      setActiveLanguage('tr');
      return;
    }
    
    if (!turkishDescription) {
      alert('Türkçe ürün açıklaması zorunludur!');
      setActiveLanguage('tr');
      return;
    }
    
    onSave(formData);
  };

  const getFieldName = (localeCode: string, field: 'name' | 'description') => {
    return `${field}${localeCode.charAt(0).toUpperCase() + localeCode.slice(1)}`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl border border-slate-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">Diller yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl space-y-4 border border-slate-200/50 dark:border-gray-700/50 shadow-lg">
      {/* Dil Seçici */}
      <div className="border-b border-slate-200 dark:border-gray-700 mb-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {enabledLanguages.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setActiveLanguage(lang.code)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all font-medium ${
                activeLanguage === lang.code
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-gray-600 border border-slate-200 dark:border-gray-600'
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Seçili dil için alanlar */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t('itemName')} ({enabledLanguages.find(l => l.code === activeLanguage)?.nativeName || activeLanguage})
            {activeLanguage === 'tr' && <span className="text-red-500 ml-1">* (Zorunlu)</span>}
          </label>
          <input
            type="text"
            value={formData[getFieldName(activeLanguage, 'name')] || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              [getFieldName(activeLanguage, 'name')]: e.target.value 
            })}
            required={activeLanguage === 'tr'}
            className={`w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all ${activeLanguage === 'tr' ? 'ring-1 ring-red-200' : ''}`}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t('itemDescription')} ({enabledLanguages.find(l => l.code === activeLanguage)?.nativeName || activeLanguage})
            {activeLanguage === 'tr' && <span className="text-red-500 ml-1">* (Zorunlu)</span>}
          </label>
          <textarea
            value={formData[getFieldName(activeLanguage, 'description')] || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              [getFieldName(activeLanguage, 'description')]: e.target.value 
            })}
            required={activeLanguage === 'tr'}
            rows={3}
            className={`w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all ${activeLanguage === 'tr' ? 'ring-1 ring-red-200' : ''}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t('itemPrice')} (₺)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t('itemCategory')}
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {locale === 'en' && cat.nameEn ? cat.nameEn : cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('itemImage')}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({
                ...formData,
                imageFile: e.target.files?.[0] || null,
              })
            }
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
          />
          {formData.imageUrl && !formData.imageFile && (
            <div className="mt-2">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Mevcut</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all font-medium"
        >
          İptal
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 font-medium"
        >
          Kaydet
        </button>
      </div>
    </form>
  );
}

