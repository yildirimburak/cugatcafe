import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya adını güvenli hale getir
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const path = join(process.cwd(), 'public', 'menu-items', filename);

    // Dosyayı kaydet
    await writeFile(path, buffer);

    // Public URL'ini döndür
    const publicUrl = `/menu-items/${filename}`;

    return NextResponse.json({ url: publicUrl, filename });
  } catch (error: any) {
    console.error('Resim yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Resim yüklenirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
}

