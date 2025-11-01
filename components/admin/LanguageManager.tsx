'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getLanguages, addLanguage, updateLanguage, deleteLanguage, Language } from '@/lib/firebase/languages';
import { LanguageForm } from './LanguageForm';
import { LanguageList } from './LanguageList';
import toast from 'react-hot-toast';

interface LanguageManagerProps {
  locale: string;
}

export function LanguageManager({ locale }: LanguageManagerProps) {
  const t = useTranslations('admin');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const langs = await getLanguages();
      setLanguages(langs);
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error('Diller yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData: any) => {
    try {
      // Code'un zaten var olup olmadığını kontrol et
      const existing = languages.find(l => l.code.toLowerCase() === formData.code.toLowerCase());
      if (existing) {
        toast.error('Bu dil kodu zaten mevcut!');
        return;
      }

      const languageData = {
        code: formData.code.toLowerCase(),
        name: formData.name,
        nativeName: formData.nativeName,
        enabled: formData.enabled !== false,
      };

      await addLanguage(languageData);
      await fetchLanguages();
      setShowForm(false);
      toast.success(t('saveSuccess'));
      toast(`Not: messages/${formData.code.toLowerCase()}.json dosyasını manuel olarak eklemeyi unutmayın!`, { icon: 'ℹ️' });
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const handleEdit = async (id: string, formData: any) => {
    try {
      // Code değiştirilmişse kontrol et
      const currentLang = languages.find(l => l.id === id);
      if (currentLang && currentLang.code !== formData.code.toLowerCase()) {
        const existing = languages.find(l => l.id !== id && l.code.toLowerCase() === formData.code.toLowerCase());
        if (existing) {
          toast.error('Bu dil kodu zaten mevcut!');
          return;
        }
      }

      await updateLanguage(id, {
        code: formData.code.toLowerCase(),
        name: formData.name,
        nativeName: formData.nativeName,
        enabled: formData.enabled !== false,
      });

      await fetchLanguages();
      setEditingLanguage(null);
      toast.success(t('saveSuccess'));
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu dili silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

    try {
      await deleteLanguage(id);
      await fetchLanguages();
      toast.success(t('deleteSuccess'));
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    try {
      await updateLanguage(id, { enabled });
      await fetchLanguages();
      toast.success(enabled ? 'Dil etkinleştirildi' : 'Dil devre dışı bırakıldı');
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dil Yönetimi
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Desteklenen dilleri yönetin. Yeni dil ekledikten sonra messages/{'{'}code{'}'}.json dosyasını eklemeyi unutmayın.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLanguage(null);
            setShowForm(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 font-medium"
        >
          + Yeni Dil Ekle
        </button>
      </div>

      {showForm && (
        <LanguageForm
          language={editingLanguage}
          onSave={editingLanguage ? (data) => handleEdit(editingLanguage.id, data) : handleAdd}
          onCancel={() => {
            setShowForm(false);
            setEditingLanguage(null);
          }}
          existingCodes={languages.map(l => l.code)}
          editingCode={editingLanguage?.code}
        />
      )}

      <LanguageList
        languages={languages}
        onEdit={(language) => {
          setEditingLanguage(language);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        onToggleEnabled={handleToggleEnabled}
      />
    </div>
  );
}

