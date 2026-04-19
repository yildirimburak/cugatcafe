'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { MenuItem, Category } from '@/lib/types';
import { addMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/firebase/menu';
import { uploadImage } from '@/lib/firebase/storage';
import { MenuItemForm } from './MenuItemForm';
import { MenuItemList } from './MenuItemList';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

interface MenuItemManagerProps {
  items: MenuItem[];
  categories: Category[];
  onItemsChange: (items: MenuItem[]) => void;
  locale: string;
}

export function MenuItemManager({ items, categories, onItemsChange, locale }: MenuItemManagerProps) {
  const t = useTranslations('admin');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getItemName = (item: MenuItem) => {
    if (locale === 'tr') return (item as any).nameTr || item.name || (item as any).nameEn || '';
    const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof MenuItem;
    return (item as any)[nameKey] || (item as any).nameTr || item.name || (item as any).nameEn || '';
  };

  const getItemDescription = (item: MenuItem) => {
    if (locale === 'tr') return (item as any).descriptionTr || item.description || (item as any).descriptionEn || '';
    const descKey = `description${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof MenuItem;
    return (item as any)[descKey] || (item as any).descriptionTr || item.description || (item as any).descriptionEn || '';
  };

  const handleAdd = async (formData: any) => {
    try {
      let imageUrl = formData.imageUrl;
      if (formData.imageFile) {
        try { imageUrl = await uploadImage(formData.imageFile, ''); }
        catch (e: any) { toast.error('Resim yüklenemedi: ' + e.message); }
      }
      const { imageFile, ...rest } = formData;
      const itemData: any = { ...rest, price: parseFloat(formData.price), imageUrl: imageUrl || '', available: formData.available !== false, allergies: formData.allergies || [] };
      const id = await addMenuItem(itemData);
      onItemsChange([{ id, ...itemData, createdAt: new Date(), updatedAt: new Date() }, ...items]);
      setShowForm(false);
      toast.success(t('saveSuccess'));
    } catch (error: any) { toast.error(error.message || 'Bir hata oluştu'); }
  };

  const handleEdit = async (id: string, formData: any) => {
    try {
      let imageUrl = formData.imageUrl;
      if (formData.imageFile) {
        try { imageUrl = await uploadImage(formData.imageFile, ''); }
        catch (e: any) { toast.error('Resim yüklenemedi: ' + e.message); }
      }
      const { imageFile, price, category, imageUrl: fUrl, available, allergies, ...rest } = formData;
      const updateData: any = { ...rest, price: parseFloat(formData.price), category: formData.category, imageUrl: imageUrl || formData.imageUrl, available: formData.available !== false, allergies: formData.allergies || [] };
      await updateMenuItem(id, updateData);
      onItemsChange(items.map(item => item.id === id ? { ...item, ...updateData, updatedAt: new Date() } : item));
      setEditingItem(null);
      toast.success(t('saveSuccess'));
    } catch (error: any) { toast.error(error.message || 'Bir hata oluştu'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await deleteMenuItem(id);
      onItemsChange(items.filter(item => item.id !== id));
      toast.success(t('deleteSuccess'));
    } catch (error: any) { toast.error(error.message || 'Bir hata oluştu'); }
  };

  const getCategoryName = (category: Category) => {
    if (locale === 'tr') return (category as any).nameTr || category.name;
    const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof Category;
    return (category as any)[nameKey] || category.name;
  };

  // Counts
  const categoryCounts = useMemo(() => {
    const base = items.filter(item => {
      if (statusFilter === 'available' && !item.available) return false;
      if (statusFilter === 'unavailable' && item.available) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return getItemName(item).toLowerCase().includes(q) || getItemDescription(item).toLowerCase().includes(q) || item.price.toString().includes(q);
      }
      return true;
    });
    const counts: Record<string, number> = { all: base.length };
    categories.forEach(c => { counts[c.id] = base.filter(i => i.category === c.id).length; });
    return counts;
  }, [items, categories, statusFilter, searchQuery, locale]);

  const availableCount = items.filter(i => i.available).length;
  const unavailableCount = items.length - availableCount;

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (statusFilter === 'available' && !item.available) return false;
      if (statusFilter === 'unavailable' && item.available) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return getItemName(item).toLowerCase().includes(q) || getItemDescription(item).toLowerCase().includes(q) || item.price.toString().includes(q);
      }
      return true;
    });
  }, [items, selectedCategory, statusFilter, searchQuery, locale]);

  const hasActiveFilter = selectedCategory !== 'all' || statusFilter !== 'all' || searchQuery.trim() !== '';
  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (searchQuery.trim() ? 1 : 0);

  const clearAll = () => { setSelectedCategory('all'); setStatusFilter('all'); setSearchQuery(''); };

  const selectedCategoryName = selectedCategory !== 'all'
    ? getCategoryName(categories.find(c => c.id === selectedCategory)!)
    : null;

  return (
    <div className="space-y-4">
      {/* Top bar: count + add */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 tabular-nums">
          {hasActiveFilter && <span className="text-zinc-900 font-medium">{filteredItems.length}</span>}
          {hasActiveFilter && <span className="text-zinc-400"> / </span>}
          <span>{items.length} ürün</span>
        </p>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          Yeni Ürün
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-zinc-200 p-3 space-y-3">
        {/* Row 1: Search */}
        <div className={`relative transition-all ${searchFocused ? 'ring-2 ring-zinc-900/10 rounded-lg' : ''}`}>
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Ürün adı veya fiyat ile ara..."
            className="w-full pl-9 pr-8 py-2 bg-zinc-50 border-0 rounded-lg text-sm focus:outline-none focus:bg-white placeholder:text-zinc-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Row 2: Category + Status */}
        <div className="flex gap-2">
          {/* Category dropdown */}
          <div className="relative flex-1" ref={categoryDropdownRef}>
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory !== 'all'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <span className="truncate">
                {selectedCategoryName || 'Kategori'}
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {selectedCategory !== 'all' && (
                  <span
                    onClick={(e) => { e.stopPropagation(); setSelectedCategory('all'); }}
                    className="w-4 h-4 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 cursor-pointer"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </span>
                )}
                <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''} ${selectedCategory !== 'all' ? 'text-white/60' : 'text-zinc-400'}`} />
              </div>
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 py-1 max-h-[280px] overflow-y-auto">
                <button
                  onClick={() => { setSelectedCategory('all'); setShowCategoryDropdown(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-zinc-50 transition-colors ${
                    selectedCategory === 'all' ? 'text-zinc-900 font-medium bg-zinc-50' : 'text-zinc-600'
                  }`}
                >
                  <span>Tüm Kategoriler</span>
                  <span className="text-xs text-zinc-400 tabular-nums">{categoryCounts.all}</span>
                </button>
                <div className="border-t border-zinc-100 my-1" />
                {categories.map(cat => {
                  const count = categoryCounts[cat.id] || 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setShowCategoryDropdown(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-zinc-50 transition-colors ${
                        selectedCategory === cat.id ? 'text-zinc-900 font-medium bg-zinc-50' : 'text-zinc-600'
                      } ${count === 0 ? 'opacity-40' : ''}`}
                    >
                      <span className="truncate">{getCategoryName(cat)}</span>
                      <span className="text-xs text-zinc-400 tabular-nums ml-2 flex-shrink-0">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status segmented control */}
          <div className="flex bg-zinc-50 rounded-lg p-0.5 flex-shrink-0">
            {([
              { key: 'all', label: 'Tümü', count: null },
              { key: 'available', label: 'Mevcut', count: null },
              { key: 'unavailable', label: 'Yok', count: unavailableCount },
            ] as const).map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(statusFilter === f.key && f.key !== 'all' ? 'all' : f.key)}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  statusFilter === f.key
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {f.label}
                {f.count !== null && f.count > 0 && statusFilter !== f.key && (
                  <span className="ml-1 text-red-500">{f.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilter && (
          <div className="flex items-center gap-1.5 pt-1 border-t border-zinc-100 flex-wrap">
            <span className="text-[11px] text-zinc-400 mr-1">Filtre:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-900 text-white rounded-full text-[11px]">
                {selectedCategoryName}
                <button onClick={() => setSelectedCategory('all')} className="hover:text-zinc-300"><XMarkIcon className="w-3 h-3" /></button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${
                statusFilter === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {statusFilter === 'available' ? 'Mevcut' : 'Stok Dışı'}
                <button onClick={() => setStatusFilter('all')} className="hover:opacity-60"><XMarkIcon className="w-3 h-3" /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[11px]">
                &ldquo;{searchQuery.length > 15 ? searchQuery.slice(0, 15) + '...' : searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')} className="hover:opacity-60"><XMarkIcon className="w-3 h-3" /></button>
              </span>
            )}
            <button onClick={clearAll} className="text-[11px] text-zinc-400 hover:text-zinc-600 ml-auto">
              Temizle
            </button>
          </div>
        )}
      </div>

      {/* Form Popup */}
      {mounted && showForm && createPortal(
        <div className="fixed inset-0 z-[9999]" onClick={() => { setShowForm(false); setEditingItem(null); }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center">
            <div
              className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[94vh] sm:max-h-[85vh] flex flex-col animate-[slideUp_0.2s_ease-out] sm:animate-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar (mobile) */}
              <div className="sm:hidden flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 bg-zinc-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 flex-shrink-0">
                <h2 className="text-sm font-semibold text-zinc-900">
                  {editingItem ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </h2>
                <button onClick={() => { setShowForm(false); setEditingItem(null); }} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 overscroll-contain p-5">
                <MenuItemForm
                  categories={categories}
                  item={editingItem}
                  onSave={editingItem ? (data) => handleEdit(editingItem.id, data) : handleAdd}
                  onCancel={() => { setShowForm(false); setEditingItem(null); }}
                  locale={locale}
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Results */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-zinc-200">
          <div className="text-3xl mb-3">{searchQuery ? '🔍' : '📋'}</div>
          <p className="text-zinc-500 text-sm">
            {searchQuery
              ? `"${searchQuery}" ile eşleşen ürün bulunamadı`
              : hasActiveFilter
                ? 'Bu filtreyle eşleşen ürün yok'
                : 'Henüz ürün eklenmemiş'}
          </p>
          {hasActiveFilter && (
            <button onClick={clearAll} className="mt-3 text-xs text-zinc-900 hover:underline font-medium">
              Filtreleri temizle
            </button>
          )}
        </div>
      ) : (
        <MenuItemList
          items={filteredItems}
          categories={categories}
          onEdit={(item) => { setEditingItem(item); setShowForm(true); }}
          onUpdate={handleEdit}
          onDelete={handleDelete}
          locale={locale}
        />
      )}
    </div>
  );
}
