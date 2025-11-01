'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Language } from '@/lib/firebase/languages';

interface LanguageFormProps {
  language?: Language | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  existingCodes: string[];
  editingCode?: string;
}

export function LanguageForm({ language, onSave, onCancel, existingCodes, editingCode }: LanguageFormProps) {
  const t = useTranslations('admin');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nativeName: '',
    enabled: true,
  });

  useEffect(() => {
    if (language) {
      setFormData({
        code: language.code,
        name: language.name,
        nativeName: language.nativeName,
        enabled: language.enabled,
      });
    }
  }, [language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Code validasyonu
    if (!/^[a-z]{2}$/.test(formData.code.toLowerCase())) {
      alert('Dil kodu 2 harfli küçük harf olmalıdır (örn: en, tr, de)');
      return;
    }

    // Mevcut kodları kontrol et (edit ederken kendi kodunu hariç tut)
    const codeToCheck = formData.code.toLowerCase();
    if (codeToCheck !== editingCode?.toLowerCase()) {
      if (existingCodes.includes(codeToCheck)) {
        alert('Bu dil kodu zaten kullanılıyor!');
        return;
      }
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl space-y-4 border border-slate-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Dil Kodu (ISO 639-1) <span className="text-red-500">*</span>
            <span className="text-xs text-slate-500 block mt-1">2 harfli kod (örn: en, tr, de, fr)</span>
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
            required
            maxLength={2}
            pattern="[a-z]{2}"
            placeholder="en"
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Dil Adı (İngilizce) <span className="text-red-500">*</span>
            <span className="text-xs text-slate-500 block mt-1">Örn: English, Turkish</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="English"
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Yerel Dil Adı <span className="text-red-500">*</span>
            <span className="text-xs text-slate-500 block mt-1">O dildeki adı (örn: English, Türkçe, Deutsch)</span>
          </label>
          <input
            type="text"
            value={formData.nativeName}
            onChange={(e) => setFormData({ ...formData, nativeName: e.target.value })}
            required
            placeholder="English"
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Etkin</span>
          </label>
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 mt-4">
        <p className="text-sm text-indigo-800 dark:text-indigo-200">
          <strong>Önemli:</strong> Yeni dil ekledikten sonra <code className="bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded">messages/{formData.code || '{code}'}.json</code> dosyasını manuel olarak oluşturmanız gerekmektedir.
        </p>
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

