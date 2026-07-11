# Firebase Kurulum Rehberi

## 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Add project" butonuna tıklayın
3. Proje adını girin (örn: `cugat-cafe`)
4. Google Analytics'i isteğe bağlı olarak etkinleştirin
5. "Create project" butonuna tıklayın

## 2. Web App Oluşturma

1. Firebase Console'da projenizi açın
2. Sol menüden **⚙️ Project Settings** (Proje Ayarları) seçin
3. Aşağı kaydırın ve **"Your apps"** bölümüne gelin
4. **Web (</>)** ikonuna tıklayın
5. App nickname girin (örn: `cugat-cafe-web`)
6. Firebase Hosting'i şimdilik atlayabilirsiniz
7. **"Register app"** butonuna tıklayın

## 3. Config Değerlerini Alma

Firebase size şu şekilde bir config kodu gösterecek:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## 4. .env.local Dosyasını Güncelleme

Proje kök dizinindeki `.env.local` dosyasını açın ve değerleri güncelleyin:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza... (apiKey değeri)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 5. Firebase Servislerini Etkinleştirme

### Authentication
1. Sol menüden **Authentication** seçin
2. **"Get started"** butonuna tıklayın
3. **"Sign-in method"** sekmesine gidin
4. **Email/Password** seçeneğini etkinleştirin
5. **Save** butonuna tıklayın

### Firestore Database
1. Sol menüden **Firestore Database** seçin
2. **"Create database"** butonuna tıklayın
3. **"Start in test mode"** seçeneğini seçin (geliştirme için)
4. Location seçin (örn: `europe-west3` - Frankfurt)
5. **"Enable"** butonuna tıklayın

### Storage
1. Sol menüden **Storage** seçin
2. **"Get started"** butonuna tıklayın
3. **"Start in test mode"** seçeneğini seçin
4. Location seçin (Firestore ile aynı olabilir)
5. **"Done"** butonuna tıklayın

## 6. Firestore Security Rules

Geliştirme aşamasında test mode yeterlidir. Production için şu kuralları kullanın:

**Firestore Rules:**
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

**Storage Rules:**
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

## 7. İlk Admin Kullanıcı Oluşturma

1. Firebase Console > Authentication > Users
2. **"Add user"** butonuna tıklayın
3. Email ve şifre girin
4. **"Add user"** butonuna tıklayın
5. Bu kullanıcı ile admin panele giriş yapabilirsiniz

## 8. Server'ı Yeniden Başlatma

`.env.local` dosyasını güncelledikten sonra:

```bash
# Development server'ı durdurun (Ctrl+C)
# Sonra tekrar başlatın:
npm run dev
```

## Sorun Giderme

- **"Invalid API Key" hatası**: `.env.local` dosyasındaki değerlerin doğru olduğundan emin olun
- **"Permission denied" hatası**: Firestore Rules'ı kontrol edin
- **Resim yüklenmiyor**: Storage Rules'ı kontrol edin

## Önemli Notlar

- `.env.local` dosyası git'e commit edilmemeli (zaten `.gitignore`'da)
- Production'da Vercel Environment Variables kullanın
- Firebase config değerleri public olabilir, ama yine de güvenlik kurallarına dikkat edin

