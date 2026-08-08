// Statik tarif kataloğundaki Unsplash fotoğraflarının büyük çoğunluğu (915
// tariften sadece 30'u hariç) boyutsuz tam çözünürlük URL'i taşıyor -- küçük
// bir grid kartında bunu olduğu gibi indirmek gereksiz ağ/decode maliyeti
// yaratıyor. images.unsplash.com imgix tabanlı olduğu için sorgu parametreleriyle
// anlık yeniden boyutlandırma destekliyor; Firebase Storage'daki admin
// fotoğrafları (override/photoThumb) bu servisten gelmediği için dokunulmuyor.
export function getGridPhotoUrl(url, width = 400) {
  if (!url || !url.includes('images.unsplash.com')) return url;
  const base = url.split('?')[0];
  return `${base}?w=${width}&q=70&auto=format&fit=crop`;
}
