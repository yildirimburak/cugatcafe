'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { getEnabledLanguages, Language } from '@/lib/firebase/languages';
import { CheckIcon } from '@heroicons/react/24/outline';

interface CategoryFormProps {
  category?: Category | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const t = useTranslations('admin');
  const [enabledLanguages, setEnabledLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const langs = await getEnabledLanguages();
        const hasTr = langs.some(l => l.code === 'tr');
        if (!hasTr) langs.unshift({ id: 'tr', code: 'tr', name: 'Turkish', nativeName: 'Türkçe', enabled: true, createdAt: new Date(), updatedAt: new Date() });
        else { const i = langs.findIndex(l => l.code === 'tr'); if (i > 0) { const tr = langs.splice(i, 1)[0]; langs.unshift(tr); } }
        setEnabledLanguages(langs);
      } catch {
        setEnabledLanguages([{ id: 'tr', code: 'tr', name: 'Turkish', nativeName: 'Türkçe', enabled: true, createdAt: new Date(), updatedAt: new Date() }]);
      } finally { setLoading(false); }
    }
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (enabledLanguages.length > 0) {
      const data: any = {};
      enabledLanguages.forEach(lang => { data[fieldKey(lang.code)] = ''; });
      if (category) {
        enabledLanguages.forEach(lang => {
          const key = fieldKey(lang.code);
          if (lang.code === 'tr') {
            data[key] = (category as any)[key] || category.name || '';
          } else {
            data[key] = (category as any)[key] || '';
          }
        });
      }
      setFormData(data);
    }
  }, [category, enabledLanguages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameTr?.trim()) { alert('Türkçe kategori adı zorunludur!'); return; }
    onSave(formData);
  };

  const fieldKey = (code: string) => `name${code.charAt(0).toUpperCase() + code.slice(1)}`;
  const hasContent = (code: string) => !!(formData[fieldKey(code)]?.trim());

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tüm diller için inputlar */}
      <div className="space-y-3">
        {enabledLanguages.map(lang => {
          const key = fieldKey(lang.code);
          const filled = hasContent(lang.code);
          const isRequired = lang.code === 'tr';

          return (
            <div key={lang.code}>
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-1.5">
                <span className={`inline-flex items-center justify-center w-6 h-5 text-[10px] font-bold uppercase rounded ${
                  filled
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : isRequired
                      ? 'bg-red-50 text-red-400 border border-red-200'
                      : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                }`}>
                  {filled ? <CheckIcon className="w-3 h-3" /> : lang.code}
                </span>
                <span>{lang.nativeName}</span>
                {isRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                required={isRequired}
                placeholder={`${lang.nativeName} dilinde kategori adı`}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-colors ${
                  filled
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-zinc-200'
                } focus:border-zinc-400`}
              />
            </div>
          );
        })}
      </div>

      {/* Doluluk özeti */}
      {enabledLanguages.length > 1 && (
        <div className="flex items-center gap-2 py-2 px-3 bg-zinc-50 rounded-lg">
          <div className="flex-1 bg-zinc-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(enabledLanguages.filter(l => hasContent(l.code)).length / enabledLanguages.length) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-zinc-500 tabular-nums flex-shrink-0">
            {enabledLanguages.filter(l => hasContent(l.code)).length}/{enabledLanguages.length} dil
          </span>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">İptal</button>
        <button type="submit" className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">Kaydet</button>
      </div>
    </form>
  );
}
