// Resim yükleme - Local public klasörüne kaydeder
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Resim yüklenemedi');
    }

    const data = await response.json();
    return data.url;
  } catch (error: any) {
    console.error('Resim yükleme hatası:', error);
    throw error;
  }
};

// Resim silme - Local dosya silme
export const deleteImage = async (path: string): Promise<void> => {
  try {
    // Eğer path /menu-items/ ile başlıyorsa local dosya
    if (path.startsWith('/menu-items/')) {
      const response = await fetch(`/api/delete-image?url=${encodeURIComponent(path)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        console.warn('Resim silinemedi:', error.error);
      }
    }
  } catch (error: any) {
    console.warn('Resim silinemedi:', error.message);
  }
};

