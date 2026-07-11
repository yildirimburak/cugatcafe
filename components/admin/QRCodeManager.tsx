'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';

export function QRCodeManager() {
  const [url, setUrl] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  const [size, setSize] = useState(512);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(`${window.location.origin}/menu`);
    }
  }, []);

  useEffect(() => {
    if (!url) {
      setDataUrl('');
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#18181b', light: '#ffffff' },
    })
      .then((d) => {
        if (!cancelled) setDataUrl(d);
      })
      .catch((err) => console.error('QR üretilemedi:', err));
    return () => {
      cancelled = true;
    };
  }, [url, size]);

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'cugat-cafe-menu-qr.png';
    a.click();
  };

  const print = () => {
    if (!dataUrl) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Cugat Café QR</title></head>
      <body style="margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif">
        <h2 style="margin-bottom:8px">Cugat Café</h2>
        <p style="margin:0 0 16px;color:#666">Menü için okutun</p>
        <img src="${dataUrl}" style="width:320px;height:320px" />
      </body></html>
    `);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-zinc-900">Menü QR Kodu</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Masalara koymak için menü QR kodunuzu oluşturun, indirin veya yazdırın.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Ayarlar */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">Menü adresi</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Boyut: {size}px
            </label>
            <input
              type="range"
              min={256}
              max={1024}
              step={64}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-zinc-900"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={download}
              disabled={!dataUrl}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              PNG indir
            </button>
            <button
              onClick={print}
              disabled={!dataUrl}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
            >
              <PrinterIcon className="w-4 h-4" />
              Yazdır
            </button>
          </div>
        </div>

        {/* Önizleme */}
        <div className="flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 p-6">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt="Menü QR kodu" className="w-48 h-48" />
          ) : (
            <p className="text-sm text-zinc-400">Geçerli bir adres girin</p>
          )}
        </div>
      </div>
    </div>
  );
}
