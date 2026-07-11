# Firebase Storage Hızlı Çözüm

Firebase Console'da "An unknown error occurred" hatası alıyorsunuz.

## 🚀 En Hızlı Çözüm: Google Cloud Console

### Adım 1: Google Cloud Console
1. Şu linke gidin (PROJECT_ID'yi değiştirin):
   ```
   https://console.cloud.google.com/storage/browser?project=YOUR_PROJECT_ID
   ```

2. **Firebase Console → Settings → Project Settings → General** sekmesinden Project ID'nizi kopyalayın

### Adım 2: Bucket Oluştur
1. **CREATE BUCKET** butonuna tıklayın
2. **Bucket name:** `your-project-id.appspot.com` (Config'inizdeki storageBucket değeri)
3. **Location type:** Region
4. **Location:** `us-central1` (Iowa, USA) - Spark Plan için uyumlu
5. **Storage class:** Standard
6. **Access control:** Uniform
7. **Public access prevention:** Enforced
8. **CREATE** butonuna tıklayın

### Adım 3: Firebase Console'da Kontrol
- Firebase Console → Storage
- Bucket'ınız görünmeli!

### Adım 4: Security Rules
Firebase Console → Storage → Rules:

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

**PUBLISH** butonuna tıklayın.

## ✅ Test
Admin panelde menü öğesi eklerken resim yükleme artık çalışmalı!

## ⚠️ Hala Hata Alıyorsanız

**Seçenek 1:** Storage olmadan devam edin (resim yükleme çalışmaz, emoji gösterilir)

**Seçenek 2:** Firebase CLI kullanın:
```bash
firebase login
firebase init storage
```

**Seçenek 3:** Firebase Destek ile iletişime geçin

