'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MenuItem, Category, AllergyTag } from '@/lib/types';
import { getEnabledLanguages, Language } from '@/lib/firebase/languages';
import { CheckIcon } from '@heroicons/react/24/outline';

interface MenuItemFormProps {
  categories: Category[];
  item?: MenuItem | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  locale: string;
}

const allergyOptions: Array<{ value: AllergyTag; label: string; icon: string }> = [
  { value: 'gluten', label: 'Gluten', icon: '🌾' },
  { value: 'dairy', label: 'Süt Ürünleri', icon: '🥛' },
  { value: 'nuts', label: 'Fındık/Fıstık', icon: '🥜' },
  { value: 'eggs', label: 'Yumurta', icon: '🥚' },
  { value: 'fish', label: 'Balık', icon: '🐟' },
  { value: 'shellfish', label: 'Kabuklu Deniz Ürünleri', icon: '🦐' },
  { value: 'soy', label: 'Soya', icon: '🫘' },
  { value: 'sesame', label: 'Susam', icon: '🌰' },
  { value: 'vegetarian', label: 'Vejetaryen', icon: '🌿' },
  { value: 'vegan', label: 'Vegan', icon: '🥬' },
];

export function MenuItemForm({ categories, item, onSave, onCancel, locale }: MenuItemFormProps) {
  const t = useTranslations('admin');
  const [enabledLanguages, setEnabledLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({
    price: '', category: categories[0]?.id || '', imageFile: null, imageUrl: '', available: true, allergies: [],
  });

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const langs = await getEnabledLanguages();
        const hasTurkish = langs.some(l => l.code === 'tr');
        if (!hasTurkish) {
          langs.unshift({ id: 'tr', code: 'tr', name: 'Turkish', nativeName: 'Türkçe', enabled: true, createdAt: new Date(), updatedAt: new Date() });
        } else {
          const trIdx = langs.findIndex(l => l.code === 'tr');
          if (trIdx > 0) { const tr = langs.splice(trIdx, 1)[0]; langs.unshift(tr); }
        }
        setEnabledLanguages(langs);
      } catch {
        setEnabledLanguages([{ id: 'tr', code: 'tr', name: 'Turkish', nativeName: 'Türkçe', enabled: true, createdAt: new Date(), updatedAt: new Date() }]);
      } finally { setLoading(false); }
    }
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (enabledLanguages.length > 0) {
      const data: any = { price: '', category: categories[0]?.id || '', imageFile: null, imageUrl: '', available: true, allergies: [] };
      enabledLanguages.forEach(lang => {
        const key = lang.code.charAt(0).toUpperCase() + lang.code.slice(1);
        data[`name${key}`] = '';
        data[`description${key}`] = '';
      });
      if (item) {
        data.price = item.price.toString();
        data.category = item.category;
        data.imageUrl = item.imageUrl || '';
        data.available = item.available;
        data.allergies = item.allergies || [];
        enabledLanguages.forEach(lang => {
          const key = lang.code.charAt(0).toUpperCase() + lang.code.slice(1);
          if (lang.code === 'tr') {
            data[`name${key}`] = (item as any)[`name${key}`] || item.name || '';
            data[`description${key}`] = (item as any)[`description${key}`] || item.description || '';
          } else {
            data[`name${key}`] = (item as any)[`name${key}`] || (lang.code === 'en' ? item.nameEn : '') || '';
            data[`description${key}`] = (item as any)[`description${key}`] || (lang.code === 'en' ? (item as any).descriptionEn : '') || '';
          }
        });
      }
      setFormData(data);
    }
  }, [item, enabledLanguages, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameTr?.trim()) { alert('Türkçe ürün adı zorunludur!'); return; }
    if (!formData.descriptionTr?.trim()) { alert('Türkçe açıklama zorunludur!'); return; }
    onSave(formData);
  };

  const fld = (code: string, field: string) => `${field}${code.charAt(0).toUpperCase() + code.slice(1)}`;
  const hasLangContent = (code: string) => !!(formData[fld(code, 'name')]?.trim());

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin mx-auto"></div>
        <p className="mt-3 text-sm text-zinc-500">Diller yükleniyor...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── SECTION 1: Çeviriler ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Çeviriler</h3>
          {enabledLanguages.length > 1 && (
            <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-full tabular-nums">
              {enabledLanguages.filter(l => hasLangContent(l.code)).length}/{enabledLanguages.length}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {enabledLanguages.map(lang => {
            const nameKey = fld(lang.code, 'name');
            const descKey = fld(lang.code, 'description');
            const filled = hasLangContent(lang.code);
            const isRequired = lang.code === 'tr';

            return (
              <div
                key={lang.code}
                className={`rounded-lg border p-3 transition-colors ${
                  filled ? 'border-emerald-200 bg-emerald-50/30' : isRequired ? 'border-red-200 bg-red-50/20' : 'border-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center justify-center w-6 h-5 text-[10px] font-bold uppercase rounded ${
                    filled
                      ? 'bg-emerald-100 text-emerald-600'
                      : isRequired
                        ? 'bg-red-100 text-red-500'
                        : 'bg-zinc-100 text-zinc-400'
                  }`}>
                    {filled ? <CheckIcon className="w-3 h-3" /> : lang.code}
                  </span>
                  <span className="text-xs font-medium text-zinc-600">{lang.nativeName}</span>
                  {isRequired && <span className="text-[10px] text-red-500">zorunlu</span>}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData[nameKey] || ''}
                    onChange={(e) => setFormData({ ...formData, [nameKey]: e.target.value })}
                    required={isRequired}
                    placeholder="Ürün adı"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 bg-white"
                  />
                  <textarea
                    value={formData[descKey] || ''}
                    onChange={(e) => setFormData({ ...formData, [descKey]: e.target.value })}
                    required={isRequired}
                    placeholder="Açıklama"
                    rows={2}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 resize-none bg-white"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: Genel Bilgiler ── */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Genel Bilgiler</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Fiyat (₺)</label>
              <input
                type="number" step="0.01" value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{(cat as any).nameTr || cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Resim</label>
            <input
              type="file" accept="image/*"
              onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
              className="w-full text-sm text-zinc-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
            />
            {formData.imageUrl && !formData.imageFile && (
              <img src={formData.imageUrl} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg" />
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">Alerjenler</label>
            <div className="flex flex-wrap gap-1.5">
              {allergyOptions.map(a => (
                <label key={a.value} className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs cursor-pointer border transition-colors ${
                  formData.allergies?.includes(a.value)
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.allergies?.includes(a.value) || false}
                    onChange={(e) => {
                      const current = formData.allergies || [];
                      setFormData({
                        ...formData,
                        allergies: e.target.checked ? [...current, a.value] : current.filter((x: AllergyTag) => x !== a.value),
                      });
                    }}
                    className="sr-only"
                  />
                  <span>{a.icon}</span>
                  <span>{a.label}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox" checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/20"
            />
            <span className="text-sm text-zinc-700">Mevcut</span>
          </label>
        </div>
      </div>

      {/* ── ACTIONS ── */}
      <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">
          İptal
        </button>
        <button type="submit" className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">
          Kaydet
        </button>
      </div>
    </form>
  );
}
