# Firebase Storage Manuel Kurulum

Firebase Console'da "An unknown error occurred" hatası için bu manuel çözümü kullanın.

## 📋 Önce Project ID'nizi Bulun

Firebase Console'da:
1. Settings (⚙️) → Project Settings
2. **General** sekmesi
3. **Project ID** değerini kopyalayın (örn: `cugatcafe-12345`)

## 🛠️ Google Cloud Console'dan Bucket Oluşturma

### Adım 1: Google Cloud Console'a Gidin
```
https://console.cloud.google.com/storage?project=YOUR_PROJECT_ID
```
(YOUR_PROJECT_ID yerine Firebase Project ID'nizi yazın)

### Adım 2: CREATE BUCKET
1. **CREATE BUCKET** butonuna tıklayın

### Adım 3: Bucket Ayarları
- **Name:** `YOUR_PROJECT_ID.appspot.com`
  - Örnek: `cugatcafe-12345.appspot.com`
  - ⚠️ Bu isim Firebase config'inizdeki `storageBucket` değeri ile TAM AYNI olmalı!
  
- **Location type:** **Region**
- **Location:** **us-central1 (Iowa, USA)** ← ÖNEMLİ
- **Storage class:** **Standard**
- **Access control:** **Uniform**
- **Public access prevention:** **Enforced**
- **Object versioning:** **Disabled**
- **Encryption:** **Google-managed key**

### Adım 4: CREATE
CREATE butonuna tıklayın

## ✅ Doğrulama

1. Firebase Console → Storage
2. Bucket'ınızı görmelisiniz!

## 🔐 Security Rules Ayarlayın

Firebase Console → Storage → Rules sekmesi:

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

## 🧪 Test

Admin panelde bir menü öğesi ekleyin ve resim yüklemeyi deneyin!

## ❓ Project ID Bulamıyorum

Firebase Console'da:
- Sol üst köşe → Proje adının yanında Project ID yazıyor
- Veya Settings → General → Project ID

## ❓ storageBucket Değeri Nereden?

Firebase Console → Settings → Your apps → Web app → Config:
```javascript
storageBucket: "your-project.appspot.com"
```

Bu değer bucket adıyla TAM AYNI olmalı!

