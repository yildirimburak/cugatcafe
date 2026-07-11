# Cugat Café - Menü Sistemi

Modern, çok dilli cafe menü yönetim sistemi. Next.js, Firebase ve Vercel ile geliştirilmiştir.

## Özellikler

- 🍽️ **Modern Menü Görünümü**: Kategorilere göre düzenlenmiş, görsel açıdan zengin menü
- 🔍 **Arama & Alerjen Filtresi**: Ürün arama ve alerjene göre "içermesin" filtreleme
- 🖼️ **Resim Yakınlaştırma**: Tam ekran lightbox — pinch-to-zoom, çift dokunma, kaydırma
- 🌍 **75+ Dil Desteği**: `next-intl` ile geniş dil listesi (12 dil tam çevrili, gerisi TR'ye fallback)
- 📲 **PWA**: Ana ekrana eklenebilir, temel offline destek (service worker)
- 🔗 **QR Kod Üreteci**: Admin panelde masalar için menü QR kodu oluştur/indir/yazdır
- 🔎 **SEO**: `generateMetadata`, Open Graph, `sitemap.xml`, `robots.txt`, manifest
- 🔐 **Admin Paneli**: Menü, kategori, dil, işletme, yorum ve QR yönetimi (e-posta allowlist ile korunabilir)
- 📱 **Responsive Tasarım**: Mobil öncelikli modern tasarım (RTL: ar, he, fa, ur, ps)
- 🔥 **Firebase Entegrasyonu**: Firestore veritabanı ve Firebase Storage
- ⚡ **Vercel Optimized**: Vercel platformuna özel optimizasyonlar + Analytics

## Teknolojiler

- **Next.js 16**: React framework (App Router)
- **TypeScript**: Tip güvenli kod
- **Tailwind CSS**: Modern CSS framework
- **Firebase**: Veritabanı, kimlik doğrulama ve storage
- **next-intl**: Çoklu dil desteği
- **react-hot-toast**: Bildirim sistemi

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Firebase projenizi oluşturun ve `.env.local` dosyasını oluşturun:
```bash
cp .env.local.example .env.local
```

3. Firebase yapılandırma bilgilerinizi `.env.local` dosyasına ekleyin:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Opsiyonel
NEXT_PUBLIC_SITE_URL=https://cugatcafe.vercel.app   # SEO / sitemap / robots için
NEXT_PUBLIC_ADMIN_EMAILS=admin@cugatcafe.com         # virgülle ayrılmış admin e-postaları (boşsa herkes girer)
NEXT_PUBLIC_CURRENCY=₺                                # para birimi sembolü (€, $, £ ...)
```

> **Güvenlik:** `firestore.rules` ve `storage.rules` içindeki `isAdmin()` fonksiyonundaki e-posta listesini kendi admin e-postalarınızla güncelleyin ve Firebase Console > Authentication'dan **self-signup'ı kapatın**. Kuralları dağıtmak için: `firebase deploy --only firestore:rules,storage`

4. Firebase Firestore'da şu koleksiyonları oluşturun:
   - `menuItems`: Menü öğeleri
   - `categories`: Kategoriler

5. Firebase Authentication'ı etkinleştirin (Email/Password)

6. Development server'ı başlatın:
```bash
npm run dev
```

## Firebase Firestore Yapısı

### menuItems Koleksiyonu
```typescript
{
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  category: string; // category id
  imageUrl?: string;
  available: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### categories Koleksiyonu
```typescript
{
  name: string;
  nameEn?: string;
  order: number;
  icon?: string;
  createdAt: Timestamp;
}
```

## Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Kategoriler - herkes okuyabilir, sadece admin yazabilir
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Menü öğeleri - herkes okuyabilir, sadece admin yazabilir
    match /menuItems/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Vercel Deployment

1. Projeyi GitHub'a push edin
2. Vercel'e giriş yapın ve yeni proje oluşturun
3. GitHub repository'nizi seçin
4. **ÖNEMLİ: Environment Variables'ları ekleyin** (Firebase config)
   
   Vercel Dashboard → Project Settings → Environment Variables sekmesine gidin ve şu değişkenleri ekleyin:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   
   **Not:** Tüm değişkenler için "Production", "Preview" ve "Development" ortamlarını seçtiğinizden emin olun.
   
5. Deploy edin!

**Hata alıyorsanız:** Browser console'u kontrol edin. Firebase config eksikse, hata mesajında hangi environment variables'ların eksik olduğu belirtilir.

Veya Vercel CLI ile:
```bash
vercel
```

## Proje Yapısı

```
cugatcafe/
├── app/
│   └── [locale]/          # i18n routing
│       ├── page.tsx       # Ana sayfa
│       ├── admin/         # Admin paneli
│       └── layout.tsx     # Layout
├── components/
│   ├── admin/             # Admin komponentleri
│   ├── Header.tsx
│   ├── MenuSection.tsx
│   └── ...
├── lib/
│   ├── firebase/          # Firebase yapılandırması
│   ├── hooks/             # Custom hooks
│   └── types/             # TypeScript tipleri
├── messages/              # Dil dosyaları
│   ├── tr.json
│   └── en.json
└── middleware.ts          # i18n middleware
```

## Kullanım

### Admin Paneline Erişim

1. `/admin` sayfasına gidin
2. Firebase Authentication ile giriş yapın
3. Menü öğeleri ve kategorileri yönetin

### Menü Öğesi Ekleme

1. Admin panelinde "Ürünler" sekmesine gidin
2. "Yeni Ürün Ekle" butonuna tıklayın
3. Formu doldurun ve kaydedin

### Kategori Ekleme

1. Admin panelinde "Kategoriler" sekmesine gidin
2. "Yeni Kategori Ekle" butonuna tıklayın
3. Kategori adını girin ve kaydedin

## Lisans

MIT
