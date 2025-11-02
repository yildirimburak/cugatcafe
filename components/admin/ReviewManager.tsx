'use client';

import { useState, useEffect } from 'react';
import { Review, getReviews, addReview, updateReview, deleteReview } from '@/lib/firebase/reviews';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface ReviewManagerProps {
  locale: string;
}

export function ReviewManager({ locale }: ReviewManagerProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    authorName: '',
    authorPhoto: '',
    rating: 5,
    text: '',
    textEn: '',
    visible: true,
    featured: false,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const fetchedReviews = await getReviews(false); // Tüm yorumlar (gizli dahil)
      setReviews(fetchedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Yorumlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingReview) {
        await updateReview(editingReview.id, formData);
        toast.success('Yorum başarıyla güncellendi');
      } else {
        await addReview(formData);
        toast.success('Yorum başarıyla eklendi');
      }
      
      setShowForm(false);
      setEditingReview(null);
      resetForm();
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      authorName: review.authorName,
      authorPhoto: review.authorPhoto || '',
      rating: review.rating,
      text: review.text,
      textEn: review.textEn || '',
      visible: review.visible,
      featured: review.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;

    try {
      await deleteReview(id);
      toast.success('Yorum başarıyla silindi');
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const toggleVisibility = async (review: Review) => {
    try {
      await updateReview(review.id, { visible: !review.visible });
      toast.success(`Yorum ${!review.visible ? 'görünür' : 'gizli'} yapıldı`);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const toggleFeatured = async (review: Review) => {
    try {
      await updateReview(review.id, { featured: !review.featured });
      toast.success(`Yorum ${!review.featured ? 'öne çıkarıldı' : 'öne çıkarma kaldırıldı'}`);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const resetForm = () => {
    setFormData({
      authorName: '',
      authorPhoto: '',
      rating: 5,
      text: '',
      textEn: '',
      visible: true,
      featured: false,
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarSolidIcon key={star} className="w-4 h-4 text-amber-400" />
          ) : (
            <StarIcon key={star} className="w-4 h-4 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Müşteri Yorumları
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Müşteri yorumlarını yönetin ve düzenleyin
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingReview(null);
            setShowForm(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 font-medium"
        >
          + Yeni Yorum Ekle
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl space-y-4 border border-slate-200/50 dark:border-gray-700/50 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {editingReview ? 'Yorumu Düzenle' : 'Yeni Yorum Ekle'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Müşteri Adı *
              </label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Profil Fotoğrafı URL (opsiyonel)
              </label>
              <input
                type="url"
                value={formData.authorPhoto}
                onChange={(e) => setFormData({ ...formData, authorPhoto: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Rating (1-5) *
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                required
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} ⭐
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Yorum (Türkçe) *
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Yorum (İngilizce) (opsiyonel)
            </label>
            <textarea
              value={formData.textEn}
              onChange={(e) => setFormData({ ...formData, textEn: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visible}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Görünür</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Öne Çıkan</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingReview(null);
                resetForm();
              }}
              className="px-5 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 font-medium"
            >
              {editingReview ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      )}

      {/* Yorumlar Listesi */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700">
            <p className="text-slate-500 dark:text-slate-400">Henüz yorum eklenmemiş</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 border transition-all ${
                  review.visible 
                    ? 'border-slate-200 dark:border-gray-700' 
                    : 'border-gray-300 dark:border-gray-600 opacity-60'
                } ${review.featured ? 'ring-2 ring-amber-300 dark:ring-amber-700' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {review.authorPhoto ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={review.authorPhoto}
                            alt={review.authorName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {review.authorName}
                        </p>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      {review.featured && (
                        <span className="px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold rounded-full">
                          ⭐ Öne Çıkan
                        </span>
                      )}
                      {!review.visible && (
                        <span className="px-2 py-1 bg-gray-400 text-white text-xs font-semibold rounded-full">
                          Gizli
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mb-2">
                      {review.text}
                    </p>
                    {review.textEn && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                        EN: {review.textEn}
                      </p>
                    )}
                    {review.createdAt && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleVisibility(review)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                      title={review.visible ? 'Gizle' : 'Göster'}
                    >
                      {review.visible ? (
                        <EyeIcon className="w-5 h-5" />
                      ) : (
                        <EyeSlashIcon className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleFeatured(review)}
                      className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                      title={review.featured ? 'Öne çıkarmayı kaldır' : 'Öne çıkar'}
                    >
                      <StarSolidIcon className={`w-5 h-5 ${review.featured ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleEdit(review)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

