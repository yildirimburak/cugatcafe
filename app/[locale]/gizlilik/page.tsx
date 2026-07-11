import type { Metadata } from 'next';
import { Link } from '@/routing';

export const metadata: Metadata = {
  title: 'Gizlilik & KVKK',
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-2xl mx-auto px-5 py-10">
        <Link href="/menu" className="text-sm text-zinc-500 hover:text-zinc-800">
          ← Menüye dön
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-zinc-900">Gizlilik ve KVKK Aydınlatma Metni</h1>
        <p className="mt-2 text-sm text-zinc-400">Son güncelleme: Temmuz 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-700">
          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">1. Toplanan Veriler</h2>
            <p>
              Cugat Café dijital menüsü, ziyaretçilerinden ad, e-posta veya telefon gibi
              <strong> kişisel veri toplamaz</strong>. Menü, herhangi bir üyelik veya giriş
              gerektirmeden görüntülenebilir.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">2. Analitik</h2>
            <p>
              Site kullanımını iyileştirmek için çerez kullanmayan, kişisel veri işlemeyen
              anonim ziyaret istatistikleri (Vercel Analytics) kullanılabilir. Bu veriler
              tek bir kişiyi tanımlamak için kullanılamaz.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">3. Çerezler</h2>
            <p>
              Uygulama, yalnızca dil tercihiniz gibi temel işlevler için gerekli teknik
              çerezleri kullanır. Reklam veya takip amaçlı çerez kullanılmaz.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">4. Admin Hesapları</h2>
            <p>
              Yalnızca yetkili işletme personeli, yönetim paneline e-posta/şifre ile giriş
              yapar. Bu kimlik bilgileri Firebase Authentication üzerinde güvenli şekilde
              saklanır.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">5. İletişim</h2>
            <p>
              KVKK kapsamındaki talepleriniz için işletmeyle doğrudan iletişime
              geçebilirsiniz.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
