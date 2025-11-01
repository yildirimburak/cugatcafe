'use client';

import { useState, useEffect } from 'react';
import { BusinessInfo, getBusinessInfo, updateBusinessInfo } from '@/lib/firebase/business';
import toast from 'react-hot-toast';

interface BusinessManagerProps {
  locale: string;
}

export function BusinessManager({ locale }: BusinessManagerProps) {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    address: '',
    addressEn: '',
    phone: '',
    email: '',
    googleMapsUrl: '',
    googlePlaceId: '',
    instagram: '',
    facebook: '',
    twitter: '',
    workingHours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '22:00', closed: false },
      saturday: { open: '09:00', close: '22:00', closed: false },
      sunday: { open: '10:00', close: '20:00', closed: false },
    },
  });

  useEffect(() => {
    async function fetchBusinessInfo() {
      try {
        const info = await getBusinessInfo();
        if (info) {
          setBusinessInfo(info);
          setFormData({
            name: info.name || '',
            nameEn: info.nameEn || '',
            address: info.address || '',
            addressEn: info.addressEn || '',
            phone: info.phone || '',
            email: info.email || '',
            googleMapsUrl: info.googleMapsUrl || '',
            googlePlaceId: info.googlePlaceId || '',
            instagram: info.socialMedia?.instagram || '',
            facebook: info.socialMedia?.facebook || '',
            twitter: info.socialMedia?.twitter || '',
            workingHours: info.workingHours || formData.workingHours,
          });
        }
      } catch (error) {
        console.error('Error fetching business info:', error);
        toast.error('İşletme bilgileri yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    }
    fetchBusinessInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateBusinessInfo({
        name: formData.name,
        nameEn: formData.nameEn || undefined,
        address: formData.address,
        addressEn: formData.addressEn || undefined,
        phone: formData.phone,
        email: formData.email || undefined,
        googleMapsUrl: formData.googleMapsUrl || undefined,
        googlePlaceId: formData.googlePlaceId || undefined,
        workingHours: formData.workingHours,
        socialMedia: {
          instagram: formData.instagram || undefined,
          facebook: formData.facebook || undefined,
          twitter: formData.twitter || undefined,
        },
      });

      toast.success('İşletme bilgileri başarıyla güncellendi');
      // Yeniden yükle
      const updatedInfo = await getBusinessInfo();
      if (updatedInfo) {
        setBusinessInfo(updatedInfo);
      }
    } catch (error: any) {
      console.error('Error updating business info:', error);
      toast.error(error.message || 'Güncelleme sırasında hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const updateWorkingHours = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const days = [
    { key: 'monday', label: 'Pazartesi' },
    { key: 'tuesday', label: 'Salı' },
    { key: 'wednesday', label: 'Çarşamba' },
    { key: 'thursday', label: 'Perşembe' },
    { key: 'friday', label: 'Cuma' },
    { key: 'saturday', label: 'Cumartesi' },
    { key: 'sunday', label: 'Pazar' },
  ];

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
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          İşletme Bilgileri
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Google işletme bilgilerinizi ve iletişim detaylarınızı yönetin
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl space-y-6 border border-slate-200/50 dark:border-gray-700/50 shadow-lg">
        {/* Temel Bilgiler */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Temel Bilgiler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                İşletme Adı (Türkçe) *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                İşletme Adı (İngilizce)
              </label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* İletişim Bilgileri */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            İletişim Bilgileri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Adres (Türkçe) *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                rows={2}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Adres (İngilizce)
              </label>
              <textarea
                value={formData.addressEn}
                onChange={(e) => setFormData({ ...formData, addressEn: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Telefon *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Google Maps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Google Maps URL
              </label>
              <input
                type="url"
                value={formData.googleMapsUrl}
                onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Google Place ID (Harita gösterimi için)
              </label>
              <input
                type="text"
                value={formData.googlePlaceId}
                onChange={(e) => setFormData({ ...formData, googlePlaceId: e.target.value })}
                placeholder="ChIJ..."
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Sosyal Medya
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Twitter URL
              </label>
              <input
                type="url"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Çalışma Saatleri */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Çalışma Saatleri
          </h3>
          <div className="space-y-3">
            {days.map(({ key, label }) => {
              const hours = formData.workingHours[key];
              return (
                <div key={key} className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700">
                  <div className="w-24 flex-shrink-0">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {label}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hours.closed}
                      onChange={(e) => updateWorkingHours(key, 'closed', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Kapalı</span>
                  </div>
                  {!hours.closed && (
                    <>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateWorkingHours(key, 'open', e.target.value)}
                        className="px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
                      />
                      <span className="text-slate-600 dark:text-slate-400">-</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateWorkingHours(key, 'close', e.target.value)}
                        className="px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}

