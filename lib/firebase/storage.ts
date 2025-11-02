import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getStorageInstance } from './config';

// Resmi Base64'e çevir
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Base64 conversion failed'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

// Resim yükleme - Base64 veya Firebase Storage'a kaydeder
export const uploadImage = async (file: File, path: string, useBase64: boolean = true): Promise<string> => {
  try {
    // Base64 modunda çalışıyoruz
    if (useBase64) {
      console.log('Resim Base64 olarak kaydediliyor...');
      const base64 = await fileToBase64(file);
      return base64;
    }

    // Firebase Storage modunda (opsiyonel)
    const storage = getStorageInstance();
    
    // Dosya adını güvenli hale getir
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    
    // Storage path: menu-items/filename
    const storageRef = ref(storage, `menu-items/${filename}`);
    
    // Dosyayı yükle
    const snapshot = await uploadBytes(storageRef, file);
    
    // Download URL'i al
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error: any) {
    console.error('Resim yükleme hatası:', error);
    
    // Storage başarısız olursa Base64'e düş
    if (error.message?.includes('Storage') || error.message?.includes('firebasestorage')) {
      console.log('Storage başarısız oldu, Base64 kullanılıyor...');
      try {
        const base64 = await fileToBase64(file);
        return base64;
      } catch (base64Error) {
        throw new Error('Resim yüklenirken bir hata oluştu: ' + base64Error);
      }
    }
    
    throw new Error('Resim yüklenirken bir hata oluştu: ' + error.message);
  }
};

// Resim silme - Base64 için gerekli değil, Firebase Storage için
export const deleteImage = async (path: string): Promise<void> => {
  try {
    // Base64 resimlerse silme işlemi yapma
    if (path.startsWith('data:image/')) {
      return;
    }

    const storage = getStorageInstance();
    
    // Path bir URL ise, Firebase Storage path'ine çevir
    let storagePath = path;
    
    // Eğer Firebase Storage URL'i ise, path'i çıkar
    if (path.includes('firebasestorage.googleapis.com')) {
      // URL'den path'i çıkar: gs:// veya https:// URL'den
      const urlParts = path.split('/o/');
      if (urlParts.length > 1) {
        storagePath = decodeURIComponent(urlParts[1].split('?')[0]);
      }
    }
    
    // Storage reference oluştur
    const storageRef = ref(storage, storagePath);
    
    // Dosyayı sil
    await deleteObject(storageRef);
  } catch (error: any) {
    // Silme hatası için sessizce devam et (dosya zaten silinmiş olabilir)
    console.warn('Resim silinemedi:', error.message);
  }
};

