'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Review, getReviews, addReview, updateReview, deleteReview } from '@/lib/firebase/reviews';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface ReviewManagerProps {
  locale: string;
}

export function ReviewManager({ locale }: ReviewManagerProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'visible' | 'hidden' | 'featured'>('all');
  const [formData, setFormData] = useState({
    authorName: '', authorPhoto: '', rating: 5, text: '', textEn: '', visible: true, featured: false,
  });

  useEffect(() => { setMounted(true); fetchReviews(); }, []);

  const fetchReviews = async () => {
    try { setLoading(true); setReviews(await getReviews(false)); }
    catch { toast.error('Yorumlar yüklenirken hata oluştu'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) { await updateReview(editingReview.id, formData); toast.success('Güncellendi'); }
      else { await addReview(formData); toast.success('Eklendi'); }
      setShowForm(false); setEditingReview(null); resetForm(); fetchReviews();
    } catch (error: any) { toast.error(error.message || 'Bir hata oluştu'); }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({ authorName: review.authorName, authorPhoto: review.authorPhoto || '', rating: review.rating, text: review.text, textEn: review.textEn || '', visible: review.visible, featured: review.featured });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    try { await deleteReview(id); toast.success('Silindi'); fetchReviews(); }
    catch (error: any) { toast.error(error.message || 'Bir hata oluştu'); }
  };

  const toggleVisibility = async (review: Review) => {
    try { await updateReview(review.id, { visible: !review.visible }); toast.success(`${!review.visible ? 'Görünür' : 'Gizli'} yapıldı`); fetchReviews(); }
    catch (error: any) { toast.error(error.message || 'Bir hata oluştu'); }
  };

  const toggleFeatured = async (review: Review) => {
    try { await updateReview(review.id, { featured: !review.featured }); toast.success(`${!review.featured ? 'Öne çıkarıldı' : 'Kaldırıldı'}`); fetchReviews(); }
    catch (error: any) { toast.error(error.message || 'Bir hata oluştu'); }
  };

  const resetForm = () => setFormData({ authorName: '', authorPhoto: '', rating: 5, text: '', textEn: '', visible: true, featured: false });
  const closeForm = () => { setShowForm(false); setEditingReview(null); resetForm(); };

  const renderStars = (rating: number, size = 'w-3.5 h-3.5') => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <StarSolidIcon key={s} className={`${size} ${s <= rating ? 'text-amber-400' : 'text-zinc-200'}`} />
      ))}
    </div>
  );

  const visibleCount = reviews.filter(r => r.visible).length;
  const hiddenCount = reviews.length - visibleCount;
  const featuredCount = reviews.filter(r => r.featured).length;

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      if (statusFilter === 'visible' && !r.visible) return false;
      if (statusFilter === 'hidden' && r.visible) return false;
      if (statusFilter === 'featured' && !r.featured) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return r.authorName.toLowerCase().includes(q) || r.text.toLowerCase().includes(q) || (r.textEn || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [reviews, statusFilter, searchQuery]);

  const hasActiveFilter = statusFilter !== 'all' || searchQuery.trim() !== '';

  if (loading) {
    return <div className="text-center py-16"><div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin mx-auto"></div></div>;
  }

  const inputClass = "w-full px-3.5 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 tabular-nums">
          {hasActiveFilter && <span className="text-zinc-900 font-medium">{filteredReviews.length}</span>}
          {hasActiveFilter && <span className="text-zinc-400"> / </span>}
          <span>{reviews.length} yorum</span>
        </p>
        <button
          onClick={() => { resetForm(); setEditingReview(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          Yeni Yorum
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-zinc-200 p-3 space-y-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Yazar adı veya yorum içeriği ara..."
            className="w-full pl-9 pr-8 py-2 bg-zinc-50 border-0 rounded-lg text-sm focus:outline-none focus:bg-white placeholder:text-zinc-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex bg-zinc-50 rounded-lg p-0.5">
          {([
            { key: 'all' as const, label: 'Tümü', count: reviews.length },
            { key: 'visible' as const, label: 'Görünür', count: visibleCount },
            { key: 'hidden' as const, label: 'Gizli', count: hiddenCount },
            { key: 'featured' as const, label: 'Öne Çıkan', count: featuredCount },
          ]).map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(statusFilter === f.key && f.key !== 'all' ? 'all' : f.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] sm:text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                statusFilter === f.key
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <span className="hidden sm:inline">{f.label}</span>
              <span className="sm:hidden">{f.label.slice(0, 4)}</span>
              <span className="text-zinc-400 tabular-nums">{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Popup */}
      {mounted && showForm && createPortal(
        <div className="fixed inset-0 z-[9999]" onClick={closeForm}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center">
            <div
              className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[94vh] sm:max-h-[85vh] flex flex-col animate-[slideUp_0.2s_ease-out] sm:animate-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sm:hidden flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 bg-zinc-300 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 flex-shrink-0">
                <h2 className="text-sm font-semibold text-zinc-900">
                  {editingReview ? 'Yorumu Düzenle' : 'Yeni Yorum Ekle'}
                </h2>
                <button onClick={closeForm} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 overscroll-contain">
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5">Müşteri Adı *</label>
                      <input type="text" value={formData.authorName} onChange={(e) => setFormData({ ...formData, authorName: e.target.value })} required className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5">Fotoğraf URL</label>
                      <input type="url" value={formData.authorPhoto} onChange={(e) => setFormData({ ...formData, authorPhoto: e.target.value })} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button key={s} type="button" onClick={() => setFormData({ ...formData, rating: s })} className="p-0.5">
                          <StarSolidIcon className={`w-7 h-7 ${s <= formData.rating ? 'text-amber-400' : 'text-zinc-200'} hover:text-amber-300 transition-colors`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5">Yorum (TR) *</label>
                    <textarea value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} required rows={3} className={inputClass + ' resize-none'} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5">Yorum (EN)</label>
                    <textarea value={formData.textEn} onChange={(e) => setFormData({ ...formData, textEn: e.target.value })} rows={3} className={inputClass + ' resize-none'} />
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.visible} onChange={(e) => setFormData({ ...formData, visible: e.target.checked })} className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/20" />
                      <span className="text-sm text-zinc-700">Görünür</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/20" />
                      <span className="text-sm text-zinc-700">Öne Çıkan</span>
                    </label>
                  </div>
                </div>
                <div className="sticky bottom-0 bg-white border-t border-zinc-100 px-5 py-3 flex justify-end gap-2">
                  <button type="button" onClick={closeForm} className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">İptal</button>
                  <button type="submit" className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">{editingReview ? 'Güncelle' : 'Kaydet'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
          <p className="text-zinc-400 text-sm">
            {hasActiveFilter ? 'Filtreyle eşleşen yorum bulunamadı' : 'Henüz yorum eklenmemiş'}
          </p>
          {hasActiveFilter && (
            <button onClick={() => { setSearchQuery(''); setStatusFilter('all'); }} className="mt-2 text-xs text-zinc-900 hover:underline font-medium">
              Filtreleri temizle
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden divide-y divide-zinc-100">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`p-4 hover:bg-zinc-50 transition-colors ${!review.visible ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                {review.authorPhoto ? (
                  <img src={review.authorPhoto} alt={review.authorName} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-semibold text-zinc-600 flex-shrink-0">
                    {review.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-medium text-zinc-900">{review.authorName}</p>
                    {renderStars(review.rating)}
                    {review.featured && <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-700 rounded">Öne Çıkan</span>}
                    {!review.visible && <span className="px-1.5 py-0.5 text-[10px] font-medium bg-zinc-100 text-zinc-500 rounded">Gizli</span>}
                  </div>
                  <p className="text-sm text-zinc-600 line-clamp-2">{review.text}</p>
                  {review.createdAt && (
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
                <div className="flex gap-0.5 flex-shrink-0">
                  <button onClick={() => toggleVisibility(review)} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors" title={review.visible ? 'Gizle' : 'Göster'}>
                    {review.visible ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                  </button>
                  <button onClick={() => toggleFeatured(review)} className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors">
                    <StarSolidIcon className={`w-4 h-4 ${review.featured ? 'text-amber-400' : ''}`} />
                  </button>
                  <button onClick={() => handleEdit(review)} className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
