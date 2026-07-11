// Para birimi tek yerden yönetilir. Değiştirmek için .env.local'e ekleyin:
//   NEXT_PUBLIC_CURRENCY=€   (veya $, £, TRY, vb.)
export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || '₺';

// Fiyatı biçimlendirir: "350 ₺"
export function formatPrice(price: number, fractionDigits: number = 0): string {
  const value = Number.isFinite(price) ? price : 0;
  return `${value.toFixed(fractionDigits)} ${CURRENCY}`;
}
