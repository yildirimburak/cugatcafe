'use client';

import { useState, useEffect } from 'react';
import { BusinessInfo, getBusinessInfo, updateBusinessInfo } from '@/lib/firebase/business';
import type { BusinessInfo as BusinessInfoType } from '@/lib/firebase/business';
import toast from 'react-hot-toast';

interface BusinessManagerProps {
  locale: string;
}

export function BusinessManager({ locale }: BusinessManagerProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', nameEn: '', address: '', addressEn: '', phone: '', email: '',
    googleMapsUrl: '', googlePlaceId: '', instagram: '', facebook: '', twitter: '',
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
    async function fetch() {
      try {
        const info = await getBusinessInfo();
        if (info) {
          const wh = Object.fromEntries(
            Object.entries(info.workingHours).map(([k, v]) => [k, { ...v, closed: v.closed ?? false }])
          ) as typeof formData.workingHours;
          setFormData({
            name: info.name || '', nameEn: info.nameEn || '', address: info.address || '', addressEn: info.addressEn || '',
            phone: info.phone || '', email: info.email || '', googleMapsUrl: info.googleMapsUrl || '', googlePlaceId: info.googlePlaceId || '',
            instagram: info.socialMedia?.instagram || '', facebook: info.socialMedia?.facebook || '', twitter: info.socialMedia?.twitter || '',
            workingHours: wh,
          });
        }
      } catch { toast.error('İşletme bilgileri yüklenirken hata oluştu'); }
      finally { setLoading(false); }
    }
    fetch();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const wh: BusinessInfoType['workingHours'] = Object.fromEntries(
        Object.entries(formData.workingHours).map(([k, v]) => [k, { ...v, closed: v.closed || undefined }])
      ) as any;
      await updateBusinessInfo({
        name: formData.name, nameEn: formData.nameEn || undefined,
        address: formData.address, addressEn: formData.addressEn || undefined,
        phone: formData.phone, email: formData.email || undefined,
        googleMapsUrl: formData.googleMapsUrl || undefined, googlePlaceId: formData.googlePlaceId || undefined,
        workingHours: wh,
        socialMedia: { instagram: formData.instagram || undefined, facebook: formData.facebook || undefined, twitter: formData.twitter || undefined },
      });
      toast.success('Başarıyla güncellendi');
    } catch (error: any) { toast.error(error.message || 'Güncelleme hatası'); }
    finally { setSaving(false); }
  };

  const updateWH = (day: keyof typeof formData.workingHours, field: string, value: any) => {
    setFormData(prev => ({
      ...prev, workingHours: { ...prev.workingHours, [day]: { ...prev.workingHours[day], [field]: value } },
    }));
  };

  const days: Array<{ key: keyof typeof formData.workingHours; label: string }> = [
    { key: 'monday', label: 'Pazartesi' }, { key: 'tuesday', label: 'Salı' }, { key: 'wednesday', label: 'Çarşamba' },
    { key: 'thursday', label: 'Perşembe' }, { key: 'friday', label: 'Cuma' }, { key: 'saturday', label: 'Cumartesi' },
    { key: 'sunday', label: 'Pazar' },
  ];

  if (loading) {
    return <div className="text-center py-16"><div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin mx-auto"></div></div>;
  }

  const inputClass = "w-full px-3.5 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400";
  const labelClass = "block text-xs font-medium text-zinc-500 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Temel Bilgiler */}
      <section className="bg-white rounded-xl border border-zinc-200 p-5">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">Temel Bilgiler</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>İşletme Adı (TR) *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={inputClass} /></div>
          <div><label className={labelClass}>İşletme Adı (EN)</label><input type="text" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} className={inputClass} /></div>
        </div>
      </section>

      {/* İletişim */}
      <section className="bg-white rounded-xl border border-zinc-200 p-5">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">İletişim</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Adres (TR) *</label><textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required rows={2} className={inputClass + ' resize-none'} /></div>
          <div><label className={labelClass}>Adres (EN)</label><textarea value={formData.addressEn} onChange={(e) => setFormData({ ...formData, addressEn: e.target.value })} rows={2} className={inputClass + ' resize-none'} /></div>
          <div><label className={labelClass}>Telefon *</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className={inputClass} /></div>
          <div><label className={labelClass}>E-posta</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} /></div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="bg-white rounded-xl border border-zinc-200 p-5">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">Google Maps</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Maps URL</label><input type="url" value={formData.googleMapsUrl} onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })} placeholder="https://maps.google.com/..." className={inputClass} /></div>
          <div><label className={labelClass}>Place ID</label><input type="text" value={formData.googlePlaceId} onChange={(e) => setFormData({ ...formData, googlePlaceId: e.target.value })} placeholder="ChIJ..." className={inputClass} /></div>
        </div>
      </section>

      {/* Sosyal Medya */}
      <section className="bg-white rounded-xl border border-zinc-200 p-5">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">Sosyal Medya</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className={labelClass}>Instagram</label><input type="url" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Facebook</label><input type="url" value={formData.facebook} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Twitter</label><input type="url" value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} className={inputClass} /></div>
        </div>
      </section>

      {/* Çalışma Saatleri */}
      <section className="bg-white rounded-xl border border-zinc-200 p-5">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">Çalışma Saatleri</h3>
        <div className="space-y-2">
          {days.map(({ key, label }) => {
            const h = formData.workingHours[key];
            return (
              <div key={key} className="flex flex-wrap items-center gap-3 py-2.5 border-b border-zinc-50 last:border-0">
                <span className="w-20 text-sm text-zinc-700 flex-shrink-0">{label}</span>
                <label className="flex items-center gap-1.5 flex-shrink-0">
                  <input type="checkbox" checked={h.closed} onChange={(e) => updateWH(key, 'closed', e.target.checked)} className="w-3.5 h-3.5 rounded border-zinc-300 text-zinc-900" />
                  <span className="text-xs text-zinc-500">Kapalı</span>
                </label>
                {!h.closed && (
                  <div className="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                    <input type="time" value={h.open} onChange={(e) => updateWH(key, 'open', e.target.value)} className="flex-1 sm:flex-none px-2.5 py-1.5 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
                    <span className="text-zinc-400 text-xs">—</span>
                    <input type="time" value={h.close} onChange={(e) => updateWH(key, 'close', e.target.value)} className="flex-1 sm:flex-none px-2.5 py-1.5 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50">
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
}
