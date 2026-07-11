# Firebase Authentication Kurulumu - Detaylı Rehber

## ❌ "Invalid Credential" Hatası Çözümü

Bu hata genellikle şu nedenlerle oluşur:
1. Email/Password authentication yöntemi etkin değil
2. Kullanıcı Firebase'de düzgün oluşturulmamış
3. Email veya şifre yanlış girilmiş

## ✅ Adım Adım Çözüm

### 1. Email/Password Authentication'ı Etkinleştirin

1. [Firebase Console](https://console.firebase.google.com/) → Projenizi seçin
2. Sol menüden **Authentication** seçin
3. **"Get started"** butonuna tıklayın (eğer ilk kez açıyorsanız)
4. **"Sign-in method"** sekmesine gidin
5. **Email/Password** satırını bulun ve tıklayın
6. **"Enable"** toggle'ını açın
7. **"Email link (passwordless sign-in)"** seçeneğini KAPALI bırakın (sadece **"Email/Password"** açık olmalı)
8. **"Save"** butonuna tıklayın

### 2. Admin Kullanıcısı Oluşturun

**Yöntem 1: Firebase Console'dan (Önerilen)**

1. Firebase Console → **Authentication** → **Users** sekmesi
2. **"Add user"** butonuna tıklayın
3. **Email** girin: `admin@cugatcafe.com` (veya istediğiniz email)
4. **Password** girin: En az 6 karakter, güçlü bir şifre (örn: `Admin123!`)
5. **"Add user"** butonuna tıklayın
6. Kullanıcı listesinde görünmeli

**Yöntem 2: Admin Panelden Kayıt (Eğer kayıt özelliği eklenirse)**

Şu an için Firebase Console'dan oluşturmanız gerekiyor.

### 3. Giriş Bilgilerini Kontrol Edin

**Doğru Format:**
- ✅ Email: `admin@cugatcafe.com`
- ✅ Şifre: `Admin123!` (en az 6 karakter)

**Yanlış Format:**
- ❌ Email'de boşluk olmamalı
- ❌ Şifre en az 6 karakter olmalı
- ❌ Email formatı geçerli olmalı (örn: `@` işareti olmalı)

### 4. Admin Panelde Giriş Yapın

1. `http://localhost:3000/admin` adresine gidin
2. **Email** alanına: Firebase'de oluşturduğunuz email'i girin
3. **Password** alanına: Oluşturduğunuz şifreyi girin
4. **"Giriş Yap"** butonuna tıklayın

### 5. Hata Devam Ediyorsa

**Kontrol Listesi:**

- [ ] Email/Password authentication etkin mi?
  - Firebase Console → Authentication → Sign-in method → Email/Password → Enable

- [ ] Kullanıcı oluşturuldu mu?
  - Firebase Console → Authentication → Users → Kullanıcı listesinde görünüyor mu?

- [ ] Email ve şifre doğru mu?
  - Email'de yazım hatası var mı?
  - Şifrede büyük/küçük harf dikkat edildi mi?

- [ ] Firestore Database açık mı?
  - Firebase Console → Firestore Database → Açık olmalı

### 6. Konsol Hatalarını Kontrol Edin

Tarayıcıda **F12** tuşuna basın ve **Console** sekmesine bakın. Hata mesajlarını kontrol edin.

## 🔧 Test Etme

1. Firebase Console → Authentication → Users
2. Kullanıcı listesinde email'inizi görüyorsanız ✅
3. Admin panelde aynı email ve şifre ile giriş yapmayı deneyin

## 📝 Örnek Kullanıcı

**Email:** `admin@cugatcafe.com`
**Şifre:** `Admin123!`

Bu bilgilerle test edebilirsiniz (Firebase'de bu kullanıcıyı oluşturduktan sonra).

## ⚠️ Önemli Notlar

- Email/Password authentication **mutlaka etkin** olmalı
- Kullanıcı Firebase Console'dan oluşturulmalı (şu an için)
- Şifre en az 6 karakter olmalı
- Email formatı geçerli olmalı

