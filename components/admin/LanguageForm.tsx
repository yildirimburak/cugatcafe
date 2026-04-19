'use client';

import { useState, useEffect } from 'react';
import { Language } from '@/lib/firebase/languages';

interface LanguageFormProps {
  language?: Language | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  existingCodes: string[];
  editingCode?: string;
}

export function LanguageForm({ language, onSave, onCancel, existingCodes, editingCode }: LanguageFormProps) {
  const [formData, setFormData] = useState({ code: '', name: '', nativeName: '', enabled: true });

  useEffect(() => {
    if (language) setFormData({ code: language.code, name: language.name, nativeName: language.nativeName, enabled: language.enabled });
  }, [language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[a-z]{2}$/.test(formData.code.toLowerCase())) { alert('Dil kodu 2 harfli küçük harf olmalıdır (örn: en, tr, de)'); return; }
    const code = formData.code.toLowerCase();
    if (code !== editingCode?.toLowerCase() && existingCodes.includes(code)) { alert('Bu dil kodu zaten kullanılıyor!'); return; }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">
            Dil Kodu <span className="text-red-500">*</span>
          </label>
          <input
            type="text" value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
            required maxLength={2} pattern="[a-z]{2}" placeholder="en"
            className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">
            Dil Adı (İngilizce) <span className="text-red-500">*</span>
          </label>
          <input
            type="text" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required placeholder="English"
            className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">
            Yerel Adı <span className="text-red-500">*</span>
          </label>
          <input
            type="text" value={formData.nativeName}
            onChange={(e) => setFormData({ ...formData, nativeName: e.target.value })}
            required placeholder="English"
            className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={formData.enabled} onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
          className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/20" />
        <span className="text-sm text-zinc-700">Etkin</span>
      </label>

      <div className="bg-zinc-50 rounded-lg p-3 text-xs text-zinc-500 border border-zinc-100">
        Yeni dil ekledikten sonra <code className="bg-zinc-200 px-1.5 py-0.5 rounded font-mono">messages/{formData.code || 'xx'}.json</code> dosyasını oluşturun.
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">İptal</button>
        <button type="submit" className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">Kaydet</button>
      </div>
    </form>
  );
}
