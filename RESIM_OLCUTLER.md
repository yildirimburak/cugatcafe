# Resim Boyut Önerileri

## 📏 Önerilen Resim Boyutları

### Menü Öğeleri İçin

#### Küçük Kart Görünümü (Liste)
- **Boyut:** 200x200px
- **Format:** JPEG
- **Dosya boyutu:** ~20-50KB
- **Aspect ratio:** 1:1 (kare)

#### Büyük Popup Görünümü
- **Boyut:** 800x800px (maksimum)
- **Format:** JPEG
- **Dosya boyutu:** ~100-300KB
- **Aspect ratio:** 1:1 (kare) veya 4:3

### Kategori İkonları
- **Boyut:** 64x64px
- **Format:** PNG veya SVG
- **Dosya boyutu:** ~5-10KB
- **Aspect ratio:** 1:1 (kare)

## 🎨 Tasarım Önerileri

### Menü Öğeleri
1. **Ürün odaklı:** Ürün merkezi görünmeli
2. **Arka plan:** Temiz, nötr arka plan
3. **Aydınlatma:** İyi aydınlatılmış
4. **Stil:** Minimal, profesyonel

### Aspect Ratios
```
Kare (1:1):        ⬜ 800x800px   → En popüler
Dikey (3:4):       ⬛ 600x800px   → Instagram benzeri
Yatay (4:3):       ⬜ 800x600px   → Klasik
Geniş (16:9):      ⬜ 800x450px   → Banner stili
```

## ⚙️ Otomatik İşleme

Sistem otomatik olarak:
- ✅ 800px'e küçültülür
- ✅ JPEG formatına çevrilir
- ✅ 80% kalite ile sıkıştırılır
- ✅ 1MB limitine uygun hale getirilir

**Yani şu boyutlarda resim yükleyebilirsiniz:**
- ✅ 2000x2000px → 800x800px'e küçültülür
- ✅ 5000x3000px → 800x480px'e küçültülür
- ✅ PNG formatı → JPEG'e çevrilir

## 📊 Dosya Boyutu Karşılaştırması

| Format | Dosya Boyutu | Kalite |
|--------|--------------|--------|
| PNG (orijinal) | ~2-5MB | 100% |
| JPEG (yüksek) | ~500KB-1MB | 90-95% |
| JPEG (otomatik) | ~100-300KB | 80% |
| JPEG (sıkıştırılmış) | ~50-150KB | 70% |

## 🎯 Kullanım Önerileri

### iPhone/Android Fotoğrafları
- **Sorun:** Çok büyük boyutlar (3-10MB)
- **Çözüm:** Sistem otomatik küçültür
- **Öneri:** Direkt telefonla çekip yükleyin

### Fotoğraf Makinesi
- **Sorun:** RAW formatlar, 50-100MB dosyalar
- **Çözüm:** Önce JPEG'e export edin
- **Öneri:** Maksimum 1920x1920px export edin

### Tasarım Programları
- **Figma/Canva:** PNG export → Sistem otomatik çevirir
- **Photoshop:** JPEG quality 80% export et

## ⚠️ Limitler

### Firestore
- **Maksimum:** 1MB (1,048,576 bytes)
- **Otomatik:** Sistem kontrol eder
- **Hata:** Limit aşılırsa hata mesajı

### Ekran Boyutları
- **Desktop:** Kart listesi 100px
- **Mobile:** Kart listesi 80px
- **Popup:** 400px (desktop), 300px (mobile)

## ✅ Örnek Resimler

### İyi Örnekler ✅
```
Kahve: 800x800px, 150KB JPEG
Pasta: 800x600px, 120KB JPEG
Sandwich: 600x800px, 100KB JPEG
```

### Kötü Örnekler ❌
```
Çok büyük: 4000x4000px, 8MB PNG → Çok yavaş
Çok küçük: 50x50px, 2KB → Pixel görünümlü
Yanlış format: RAW, TIFF → Kullanılamaz
```

## 🚀 Hızlı İpuçları

1. **Telefon:** Direkt fotoğraf çek, yükle
2. **Düzenleme:** Instagram filtre kullanabilirsin
3. **Boyut:** Endişelenme, sistem otomatik ayarlar
4. **Format:** JPG/JPEG önerilir ama PNG de olur
5. **Kalite:** Yüksek çözünürlükte çek, sistem optimize eder

## 📱 Mobil Optimizasyon

Mobil cihazlarda:
- Daha küçük kart boyutları
- Daha hızlı yükleme
- Otomatik format dönüşümü
- Lazy loading

## 🎨 Renk Profilleri

- **sRGB:** Web için standart
- **RGB:** Ekranlar için
- **CMYK:** Baskı için (kullanmayın)

Sistem otomatik olarak web için optimize eder.

