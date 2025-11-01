# Sonraki Adımlar - Cugat Cafe Menü Sistemi

## ✅ Tamamlanan Adımlar
- ✅ Firebase Database (Firestore) açıldı
- ✅ Firebase Authentication açıldı

## 📋 Yapılacaklar

### 1. Firebase Storage'ı Açın (Resim Yükleme İçin)
1. Firebase Console → **Storage**
2. **"Get started"** butonuna tıklayın
3. **"Start in test mode"** seçin (geliştirme için)
4. Location seçin (Firestore ile aynı olabilir: `europe-west3`)
5. **"Done"** butonuna tıklayın

### 2. İlk Admin Kullanıcısı Oluşturun
1. Firebase Console → **Authentication** → **Users**
2. **"Add user"** butonuna tıklayın
3. Email girin (örn: `admin@cugatcafe.com`)
4. Şifre girin (güçlü bir şifre seçin)
5. **"Add user"** butonuna tıklayın
6. Bu kullanıcı ile admin panele giriş yapabilirsiniz

### 3. İlk Kategorileri Ekleyin
1. Tarayıcıda `http://localhost:3000/admin` adresine gidin
2. Oluşturduğunuz admin kullanıcısı ile giriş yapın
3. **"Kategoriler"** sekmesine geçin
4. **"Yeni Kategori Ekle"** butonuna tıklayın
5. Örnek kategoriler:
   - **Kahvaltı** (TR) / **Breakfast** (EN)
   - **İçecekler** (TR) / **Drinks** (EN)
   - **Tatlılar** (TR) / **Desserts** (EN)
   - **Ana Yemekler** (TR) / **Main Courses** (EN)

### 4. İlk Menü Öğelerini Ekleyin
1. Admin panelinde **"Ürünler"** sekmesine geçin
2. **"Yeni Ürün Ekle"** butonuna tıklayın
3. Formu doldurun:
   - Ürün Adı (TR ve EN)
   - Açıklama (TR ve EN)
   - Fiyat
   - Kategori seçin
   - Resim yükleyin (opsiyonel)
   - "Mevcut" kutusunu işaretleyin
4. **"Kaydet"** butonuna tıklayın

### 5. Ana Sayfayı Kontrol Edin
1. `http://localhost:3000` adresine gidin
2. Menü öğelerinizi görüntüleyin
3. Kategori filtrelerini test edin
4. Dil değiştirmeyi test edin (TR/EN)

### 6. Firestore Security Rules (İsteğe Bağlı - Production İçin)

**Firestore Rules** (Firebase Console → Firestore Database → Rules):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /menuItems/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Rules** (Firebase Console → Storage → Rules):
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

## 🎯 Hızlı Başlangıç Kontrol Listesi

- [ ] Storage açıldı
- [ ] Admin kullanıcısı oluşturuldu
- [ ] İlk kategori eklendi
- [ ] İlk menü öğesi eklendi
- [ ] Ana sayfa test edildi
- [ ] Dil değiştirme test edildi

## 💡 İpuçları

1. **Resim Boyutu**: Menü öğeleri için önerilen resim boyutu 800x600px
2. **Kategori Sıralaması**: Kategoriler `order` alanına göre sıralanır
3. **Mevcut Değil**: Bir ürünü geçici olarak menüden kaldırmak için "Mevcut" kutusunun işaretini kaldırın
4. **Çoklu Dil**: Her ürün için TR ve EN versiyonlarını ekleyin

## 🚀 Vercel'e Deploy (Hazır Olduğunuzda)

1. Projeyi GitHub'a push edin
2. Vercel'e giriş yapın
3. Yeni proje oluşturun
4. GitHub repository'nizi seçin
5. **Environment Variables** bölümüne Firebase config değerlerini ekleyin
6. Deploy edin!

