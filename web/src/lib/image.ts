// Firebase Storage'daki tarif fotoğrafları yüklenmeden önce zaten 1200×800/q0.88
// JPEG'e sıkıştırılıp uzun ömürlü Cache-Control ile saklanıyor — next/image'ın bunları
// tekrar optimize etmesi (varsayılan quality=75) gereksiz ikinci bir işleme adımı ekliyor.
// Unsplash kaynaklı statik tarif fotoğrafları optimize edilmemiş olduğundan onlar için
// next/image optimizasyonu hâlâ değerli.
export function isPreOptimized(url: string | undefined | null): boolean {
  return !!url && url.includes('firebasestorage.googleapis.com')
}
