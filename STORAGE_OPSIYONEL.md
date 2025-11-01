# Storage Olmadan Kullanım Rehberi

## ✅ Storage Olmadan Çalışan Özellikler

- ✅ Menü öğeleri ekleme/düzenleme/silme
- ✅ Kategori yönetimi
- ✅ Çoklu dil desteği
- ✅ Admin paneli
- ✅ Menü görüntüleme
- ⚠️ Resim yükleme (çalışmaz, emoji gösterilir)

## Hemen Başlayın

Storage olmadan da menünüzü kullanabilirsiniz:

1. **Admin kullanıcısı oluşturun:**
   - Firebase Console → Authentication → Users → Add user

2. **Admin panele giriş yapın:**
   - `http://localhost:3000/admin`
   - Oluşturduğunuz kullanıcı ile giriş yapın

3. **Kategorileri ekleyin:**
   - Admin panel → Kategoriler sekmesi
   - "Yeni Kategori Ekle"
   - Örnek: Kahvaltı/Breakfast, İçecekler/Drinks

4. **Menü öğelerini ekleyin:**
   - Admin panel → Ürünler sekmesi
   - "Yeni Ürün Ekle"
   - **Resim yüklemeyin** - boş bırakın, emoji gösterilecek
   - Diğer bilgileri doldurun ve kaydedin

## Storage'ı Daha Sonra Açmak İçin

Eğer daha sonra Storage'ı açmak isterseniz:

### Alternatif Yöntemler:

1. **Firebase Console'dan manuel bucket oluşturma:**
   - Firebase Console → Storage
   - "Get started" yerine üç nokta (⋮) menüsünden
   - "Add bucket" seçeneğini deneyin

2. **Google Cloud Console üzerinden:**
   - [Google Cloud Console](https://console.cloud.google.com/)
   - Storage → Buckets
   - Create bucket
   - Firebase projenizle aynı project ID'yi seçin

3. **Firebase CLI ile:**
   ```bash
   firebase init storage
   ```

## Önemli Notlar

- ✅ Proje Storage olmadan **tamamen çalışır**
- ✅ Menü öğeleri **resim olmadan da eklenebilir**
- ✅ Resim yükleme özelliği Storage açıldığında **otomatik çalışacak**
- ⚠️ Resim yüklemeyi denerseniz hata alırsınız ama ürün kaydedilir (resim olmadan)

## Resim Yükleme Hatası Alırsanız

Eğer admin panelde resim yüklemeyi denerseniz:
- Hata mesajı göreceksiniz: "Resim yüklenemedi"
- Ancak ürün **resim olmadan kaydedilecek**
- Ana sayfada emoji (🍽️) gösterilecek
- Bu normaldir, sorun değil!

