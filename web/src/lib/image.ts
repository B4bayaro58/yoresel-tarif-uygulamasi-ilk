// Firebase Storage'daki tarif fotoğrafları yüklenmeden önce zaten 1200×800/q0.88
// JPEG'e sıkıştırılıp uzun ömürlü Cache-Control ile saklanıyor — next/image'ın bunları
// tekrar optimize etmesi (varsayılan quality=75) gereksiz ikinci bir işleme adımı ekliyor.
// Unsplash kaynaklı statik tarif fotoğrafları optimize edilmemiş olduğundan onlar için
// next/image optimizasyonu hâlâ değerli.
export function isPreOptimized(url: string | undefined | null): boolean {
  return !!url && url.includes('firebasestorage.googleapis.com')
}

// Kullanıcı tarafından yüklenen serbest formatlı fotoğrafları (ör. yorum
// fotoğrafları) sabit bir en-boy oranına kırpmadan, yalnızca uzun kenarını
// `maxDim`'e küçültüp JPEG'e çevirir — admin panelindeki tarif kapak
// fotoğrafı akışının aksine (orası kart tutarlılığı için 3:2 kırpıyor),
// burada kullanıcının kendi fotoğrafının oranını bozmamak istiyoruz.
export function resizeImageToJpegBlob(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) { URL.revokeObjectURL(objectUrl); reject(new Error('Canvas context alınamadı')); return }
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl)
          blob ? resolve(blob) : reject(new Error('Canvas boş'))
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Görsel yüklenemedi')) }
    img.src = objectUrl
  })
}
