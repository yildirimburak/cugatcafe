'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { getLanguages, addLanguage, updateLanguage, deleteLanguage, Language } from '@/lib/firebase/languages';
import { LanguageForm } from './LanguageForm';
import { LanguageList } from './LanguageList';
import toast from 'react-hot-toast';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface LanguageManagerProps {
  locale: string;
}

export function LanguageManager({ locale }: LanguageManagerProps) {
  const t = useTranslations('admin');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'passive'>('all');

  useEffect(() => { setMounted(true); fetchLanguages(); }, []);

  const fetchLanguages = async () => {
    try { setLanguages(await getLanguages()); }
    catch { toast.error('Diller yüklenirken hata oluştu'); }
    finally { setLoading(false); }
  };

  const handleAdd = async (formData: any) => {
    try {
      if (languages.find(l => l.code.toLowerCase() === formData.code.toLowerCase())) {
        toast.error('Bu dil kodu zaten mevcut!'); return;
      }
      await addLanguage({ code: formData.code.toLowerCase(), name: formData.name, nativeName: formData.nativeName, enabled: formData.enabled !== false });
      await fetchLanguages();
      setShowForm(false);
      toast.success(t('saveSuccess'));
    } catch (error: any) { toast.error(error.message || 'Bir hata oluştu'); }
  };

  const handleEdit = async (id: string, formData: any) => {
    try {
      const current = languages.find(l => l.id === id);
      if (current && current.code !== formData.code.toLowerCase()) {
        if (languages.find(l => l.id !== id && l.code.toLowerCase() === formData.code.toLowerCase())) {
          toast.error('Bu dil kodu zaten mevcut!'); return;
        }
      }
      await updateLanguage(id, { code: formData.code.toLowerCase(), name: formData.name, nativeName: formData.nativeName, enabled: formData.enabled !== false });
      await fetchLanguages();
      setEditingLanguage(null);
      setShowForm(false);
      toast.success(t('saveSuccess'));
    } catch (error: any) { toast.error(error.message || 'Bir hata oluştu'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu dili silmek istediğinize emin misiniz?')) return;
    try { await deleteLanguage(id); await fetchLanguages(); toast.success(t('deleteSuccess')); }
    catch (error: any) { toast.error(error.message || 'Bir hata oluştu'); }
  };

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    try { await updateLanguage(id, { enabled }); await fetchLanguages(); toast.success(enabled ? 'Dil etkinleştirildi' : 'Dil devre dışı bırakıldı'); }
    catch (error: any) { toast.error(error.message || 'Bir hata oluştu'); }
  };

  const activeCount = languages.filter(l => l.enabled).length;
  const passiveCount = languages.length - activeCount;

  const filteredLanguages = useMemo(() => {
    return languages.filter(lang => {
      if (statusFilter === 'active' && !lang.enabled) return false;
      if (statusFilter === 'passive' && lang.enabled) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return lang.code.toLowerCase().includes(q) || lang.name.toLowerCase().includes(q) || lang.nativeName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [languages, statusFilter, searchQuery]);

  const hasActiveFilter = statusFilter !== 'all' || searchQuery.trim() !== '';

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 tabular-nums">
          {hasActiveFilter && <span className="text-zinc-900 font-medium">{filteredLanguages.length}</span>}
          {hasActiveFilter && <span className="text-zinc-400"> / </span>}
          <span>{languages.length} dil</span>
        </p>
        <button
          onClick={() => { setEditingLanguage(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          Yeni Dil
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-zinc-200 p-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Dil adı veya kodu ara..."
            className="w-full pl-9 pr-8 py-2 bg-zinc-50 border-0 rounded-lg text-sm focus:outline-none focus:bg-white placeholder:text-zinc-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status segmented control */}
        <div className="flex bg-zinc-50 rounded-lg p-0.5">
          {([
            { key: 'all' as const, label: 'Tümü', count: languages.length },
            { key: 'active' as const, label: 'Aktif', count: activeCount },
            { key: 'passive' as const, label: 'Pasif', count: passiveCount },
          ]).map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(statusFilter === f.key && f.key !== 'all' ? 'all' : f.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                statusFilter === f.key
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {f.label}
              <span className={`tabular-nums ${statusFilter === f.key ? 'text-zinc-400' : 'text-zinc-400'}`}>{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Popup */}
      {mounted && showForm && createPortal(
        <div className="fixed inset-0 z-[9999]" onClick={() => { setShowForm(false); setEditingLanguage(null); }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center">
            <div
              className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col animate-[slideUp_0.2s_ease-out] sm:animate-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sm:hidden flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 bg-zinc-300 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 flex-shrink-0">
                <h2 className="text-sm font-semibold text-zinc-900">
                  {editingLanguage ? 'Dili Düzenle' : 'Yeni Dil Ekle'}
                </h2>
                <button onClick={() => { setShowForm(false); setEditingLanguage(null); }} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 overscroll-contain p-5">
                <LanguageForm
                  language={editingLanguage}
                  onSave={editingLanguage ? (data) => handleEdit(editingLanguage.id, data) : handleAdd}
                  onCancel={() => { setShowForm(false); setEditingLanguage(null); }}
                  existingCodes={languages.map(l => l.code)}
                  editingCode={editingLanguage?.code}
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* List */}
      {filteredLanguages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
          <p className="text-zinc-400 text-sm">
            {hasActiveFilter ? 'Filtreyle eşleşen dil bulunamadı' : 'Henüz dil eklenmemiş'}
          </p>
          {hasActiveFilter && (
            <button onClick={() => { setSearchQuery(''); setStatusFilter('all'); }} className="mt-2 text-xs text-zinc-900 hover:underline font-medium">
              Filtreleri temizle
            </button>
          )}
        </div>
      ) : (
        <LanguageList
          languages={filteredLanguages}
          onEdit={(lang) => { setEditingLanguage(lang); setShowForm(true); }}
          onDelete={handleDelete}
          onToggleEnabled={handleToggleEnabled}
        />
      )}
    </div>
  );
}
