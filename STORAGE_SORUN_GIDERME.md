# Firebase Storage Sorun Giderme

## ❌ Sorun: "An unknown error occurred. Please refresh the page and try again."

Bu hata genellikle Firebase Console'da Storage açarken oluşur.

## ✅ Çözüm 1: Google Cloud Console Üzerinden Bucket Oluşturun (Önerilen)

Firebase Console'da hata alıyorsanız, Google Cloud Console kullanın:

### Adımlar:

1. **Google Cloud Console'a gidin:**
   - https://console.cloud.google.com/storage/browser

2. **Projenizi seçin:**
   - Üst kısımda Firebase projenizi seçin

3. **Bucket oluşturun:**
   - "CREATE BUCKET" butonuna tıklayın
   - Bucket adı: Firebase projenizin `storageBucket` değeri (örn: `your-project.appspot.com`)
   - Location type: **"Region"** seçin
   - Location: **"us-central1"** (Iowa, USA) - Önerilen
   - Storage class: Standard
   - Access control: **"Uniform"**
   - Public access prevention: **"Enforced"** (Security için)
   - Object versioning: Disabled
   - Encryption: Google-managed key

4. **Firebase Console'da kontrol edin:**
   - Firebase Console → Storage
   - Bucket'ınız görünüyor olmalı

### Security Rules Ayarlayın:

Firebase Console → Storage → Rules sekmesine gidin ve şunu yapıştırın:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /menu-items/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## ✅ Çözüm 2: Firebase CLI ile

Terminal'de şu komutu çalıştırın:

```bash
firebase login
firebase init storage
```

## ✅ Çözüm 3: Storage Olmadan Devam Edin

Storage açmadan da proje çalışır:
- ✅ Menü öğeleri ekleyebilirsiniz
- ✅ Resim olmadan ürünler emoji ile gösterilir
- ✅ Tüm diğer özellikler çalışır
- ❌ Resim yükleme çalışmaz

Daha sonra Storage'ı açtığınızda resim yükleme otomatik çalışacaktır.

## 🔍 Storage Bucket Mevcut Mu Kontrol Edin

Firebase Console'da:
1. Storage'a tıklayın
2. Eğer zaten bir bucket görüyorsanız → Sorun yok! Devam edin
3. Eğer "Get started" görüyorsanız → Yukarıdaki çözümleri deneyin

## 📝 Önemli Notlar

- **Bucket adı:** Firebase config'inizdeki `storageBucket` ile aynı olmalı
- **Location:** `us-central1` önerilir (Spark Plan için uyumlu)
- **Security rules:** Test mode veya production rules kullanın
- **Permissions:** Firebase Authentication ile yazma işlemleri için giriş gerekir

## 🆘 Hala Çalışmıyor Mu?

1. Firebase Console → Settings → Project Settings → General
2. "Storage bucket" alanını kontrol edin
3. Eğer boşsa, manuel olarak ekleyin: `your-project-id.appspot.com`

Structured Data sonrası bir adım daha gerekiyorsa Firebase Destek ile iletişime geçin.

