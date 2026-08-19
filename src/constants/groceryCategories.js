// Alışveriş listesi ürünlerini bölüm bölüm gruplamak için market kategorileri.
// 'diger' her zaman son sırada -- kategorisi belirlenmemiş ürünlerin varsayılanı.
export const GROCERY_CATEGORIES = [
  { id: 'kasap', translationKey: 'groceryKasap' },
  { id: 'manav', translationKey: 'groceryManav' },
  { id: 'sarkuteri', translationKey: 'grocerySarkuteri' },
  { id: 'firin', translationKey: 'groceryFirin' },
  { id: 'sutUrunleri', translationKey: 'grocerySutUrunleri' },
  { id: 'kuruBakliyat', translationKey: 'groceryKuruBakliyat' },
  { id: 'baharat', translationKey: 'groceryBaharat' },
  { id: 'temizlik', translationKey: 'groceryTemizlik' },
  { id: 'diger', translationKey: 'groceryDiger' },
];

export const DEFAULT_GROCERY_CATEGORY = 'diger';
