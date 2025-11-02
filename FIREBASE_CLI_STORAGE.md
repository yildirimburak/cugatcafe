# Firebase CLI ile Storage Kurulumu

Firebase Console'da "An unknown error occurred" alıyorsanız, Firebase CLI kullanarak Storage'ı oluşturabilirsiniz.

## Önkoşullar

1. Node.js yüklü olmalı
2. Firebase CLI yüklü olmalı (veya yüklenmeli)

## Firebase CLI Kurulumu

Terminal'de şu komutu çalıştırın:

```bash
npm install -g firebase-tools
```

## Storage Oluşturma

1. **Firebase'e giriş yapın:**
```bash
firebase login
```

2. **Firebase projenizi seçin:**
```bash
firebase use --add
# Projenizi listeden seçin
# Alias ismi için: default
```

3. **Storage'ı başlatın:**
```bash
firebase init storage
```

4. **Sorulara cevap verin:**
   - **What file should be used for Storage Rules?** → `storage.rules` (default)
   - **What do you want to use as your public directory?** → `public` (default)
   - **Configure as a single-page app (rewrite all urls to /index.html)?** → No
   - **Set up automatic builds and deploys with GitHub?** → No

5. **Firebase Storage Kurulumu:**
   - **Would you like to set up Cloud Storage for Firebase?** → Yes
   - **What do you want to use as your Cloud Storage folder?** → `storage` (default)
   - **File storage.rules already exists. Overwrite?** → No
   - **Select a default Firebase Realtime Database instance** → Default

6. **Storage Bucket Oluştur:**
   Firebase CLI otomatik olarak Storage bucket'ınızı oluşturacak ve Firebase Console'da görünecek!

## Manuel Bucket Oluşturma (Alternatif)

Eğer Firebase CLI de çalışmazsa, Google Cloud Console kullanın:

1. **Google Cloud Console'a gidin:**
   https://console.cloud.google.com/storage/browser?project=YOUR_PROJECT_ID

2. **CREATE BUCKET butonuna tıklayın**

3. **Bucket ayarları:**
   - **Name:** `YOUR_PROJECT_ID.appspot.com` (Firebase config'inizdeki storageBucket değeri)
   - **Location type:** Region
   - **Location:** us-central1 (Iowa, USA)
   - **Storage class:** Standard
   - **Access control:** Uniform
   - **Public access prevention:** Enforced
   - **Protect against deletion:** Unchecked

4. **CREATE butonuna tıklayın**

5. **Firebase Console'da kontrol edin:**
   Firebase Console → Storage → Bucket'ınız görünmeli!

## Firebase Storage Rules Ayarlayın

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

## Test Edin

Admin panelde bir menü öğesi eklerken resim yüklemeyi deneyin. Artık çalışmalı!

