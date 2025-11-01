import { unlink } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl || !imageUrl.startsWith('/menu-items/')) {
      return NextResponse.json({ error: 'Geçersiz resim URL\'i' }, { status: 400 });
    }

    const filename = imageUrl.replace('/menu-items/', '');
    const filePath = join(process.cwd(), 'public', 'menu-items', filename);

    try {
      await unlink(filePath);
      return NextResponse.json({ success: true });
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // Dosya zaten yok, sorun değil
        return NextResponse.json({ success: true, message: 'Dosya zaten mevcut değil' });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Resim silme hatası:', error);
    return NextResponse.json(
      { error: 'Resim silinirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
}

