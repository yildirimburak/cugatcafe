'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { getEnabledLanguages, Language } from '@/lib/firebase/languages';

interface CategoryFormProps {
  category?: Category | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
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
  const [formData, setFormData] = useState<any>({});

  // Form state'i aktif dillere göre güncelle
  useEffect(() => {
    if (enabledLanguages.length > 0) {
      const data: any = {};
      
      // Sadece aktif diller için alanlar oluştur
      enabledLanguages.forEach(lang => {
        data[`name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`] = '';
      });
      
      if (category) {
        // Mevcut category'den sadece aktif diller için değerleri yükle
        enabledLanguages.forEach(lang => {
          const nameKey = `name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`;
          data[nameKey] = (category as any)[nameKey] || '';
        });
      }
      
      setFormData(data);
    }
  }, [category, enabledLanguages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Türkçe alanının dolu olduğunu kontrol et
    const turkishName = formData.nameTr?.trim() || '';
    
    if (!turkishName) {
      alert('Türkçe kategori adı zorunludur!');
      setActiveLanguage('tr');
      return;
    }
    
    onSave(formData);
  };

  const getFieldName = (localeCode: string) => {
    return `name${localeCode.charAt(0).toUpperCase() + localeCode.slice(1)}`;
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

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t('categoryName') || 'Kategori Adı'} ({enabledLanguages.find(l => l.code === activeLanguage)?.nativeName || activeLanguage})
            {activeLanguage === 'tr' && <span className="text-red-500 ml-1">* (Zorunlu)</span>}
          </label>
          <input
            type="text"
            value={formData[getFieldName(activeLanguage)] || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              [getFieldName(activeLanguage)]: e.target.value 
            })}
            required={activeLanguage === 'tr'}
            className={`w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all ${activeLanguage === 'tr' ? 'ring-1 ring-red-200' : ''}`}
          />
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

