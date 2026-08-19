// Paylaşılan hızlı-filtre / etiket sözlüğü — mobil (doğrudan) ve web (@shared/recipeTags) tarafından kullanılır.
// Onboarding, ana sayfa hızlı filtreleri ve admin etiket override editörü aynı QUICK_FILTERS listesini paylaşır.

// Gradyanlar uygulamada zaten kullanılan renklerle eşleşir (Avrupa kıta kartı,
// Musakka/Güney Amerika, onboarding slayt 2-3) — yeni bir renk paleti icat
// etmek yerine mevcut görsel dille tutarlılık sağlanır.
export const QUICK_FILTERS = [
  { key: 'quick', emoji: '⏱️', labelKey: 'quickFilterQuick', gradient: ['#4A6CF7', '#3A5CE5'] },
  { key: 'vegan', emoji: '🌱', labelKey: 'quickFilterVegan', gradient: ['#66BB6A', '#43A047'] },
  { key: 'fit', emoji: '🥗', labelKey: 'quickFilterFit', gradient: ['#00ACC1', '#0097A7'] },
  { key: 'highProtein', emoji: '💪', labelKey: 'quickFilterHighProtein', gradient: ['#8E44AD', '#9B59B6'] },
  { key: 'onePot', emoji: '🍲', labelKey: 'quickFilterOnePot', gradient: ['#10B981', '#059669'] },
  { key: 'noOven', emoji: '🔥', labelKey: 'quickFilterNoOven', gradient: ['#FF6B57', '#FF4D3A'] },
];

// "Fit" = düşük kalorili tek porsiyon (bkz. veri analizi 2026-08-09: 1118 statik
// tarif üzerinde ~300 kcal eşiği tarifin %39'unu kapsıyor -- ne çok dar ne çok
// geniş bir küme).
const FIT_CALORIE_THRESHOLD = 300;

// Vegan tespiti malzeme adı üzerinden anahtar-kelime sezgiseliyle yapılır --
// Türkçe eklerin (peynir→peyniri, süt→sütü gibi) ayrı token olmaması yüzünden
// ne salt alt-dize (`.includes`) ne salt tam-kelime eşleşmesi tek başına
// güvenilir: alt-dize "bal"→"baldo" (pirinç), "et"→"galeta"/"bonnet" gibi
// yanlış eşleşmeler üretiyor; tam-kelime ise "peyniri" gibi çekimli halleri
// kaçırıyor. Çözüm: kelimeleri tokenize edip anahtar kelime listesiyle TAM
// eşleştirmek, yaygın çekim halini ayrı birer giriş olarak listeye eklemek.
// Liste 1118 statik tarifin tüm malzeme adları üzerinde test edilip
// (ör. "hindi" tek başına "Hindistancevizi"yle çakışıyordu, "kavurma" ve
// "köfte" un/bulgur/kum gibi et içermeyen malzeme adlarında da geçtiği için
// listeden çıkarıldı) yanlış pozitifler elendi. Yine de bu bir sezgisel
// yöntem -- admin bir tarifte `tags` alanını elle override ederse (bkz.
// getRecipeTags üstündeki not) bu heuristiğin önüne geçer.
const NON_VEGAN_TOKENS = new Set([
  // Et/kümes
  'et', 'eti', 'etler', 'etli', 'etin', 'dana', 'kuzu', 'kuzusu', 'tavuk',
  'hindi', 'kıyma', 'kıyması', 'pastırma', 'pastırması', 'sucuk', 'sosis',
  'sosisi', 'jambon', 'jambonu', 'ciğer', 'ciğeri', 'pirzola', 'biftek',
  'domuz', 'döner', 'döş', 'bonfile', 'bonfilesi', 'kanat',
  // Balık/deniz ürünü
  'balık', 'balığı', 'karides', 'midye', 'ahtapot', 'kalamar', 'somon',
  'hamsi', 'levrek', 'çipura', 'ton', 'morina', 'mercan', 'palamut',
  'lüfer', 'istavrit', 'orfoz',
  // Süt ürünü
  'süt', 'sütü', 'yoğurt', 'peynir', 'peyniri', 'tereyağı', 'krema',
  'kreması', 'kremamsı', 'kaymak', 'lor', 'kefir',
  // Yumurta / bal / jelatin
  'yumurta', 'yumurtası', 'bal', 'balı', 'jelatin',
]);

// "X sütü" bitkisel süt (hindistancevizi/soya/badem sütü vb.) demekse
// "süt"/"sütü" eşleşmesi yanlış pozitif -- bu kaynak kelimelerden biri de
// malzeme adında varsa süt eşleşmesi göz ardı edilir.
const PLANT_MILK_SOURCES = new Set(['hindistancevizi', 'hindistan', 'soya', 'badem', 'yulaf']);

function tokenizeIngredientName(name) {
  return (name || '').toLocaleLowerCase('tr-TR').split(/[^a-zçğıöşü]+/).filter(Boolean);
}

function isNonVeganIngredient(ingredient) {
  const tokens = tokenizeIngredientName(ingredient?.name);
  // "Bal kabağı" (pumpkin) -- "bal" burada bileşik ad, gerçek bal değil.
  if ((tokens.includes('bal') || tokens.includes('balı')) && tokens.includes('kabağı')) {
    return tokens.some(t => NON_VEGAN_TOKENS.has(t) && t !== 'bal' && t !== 'balı');
  }
  const hasPlantMilk = PLANT_MILK_SOURCES.has(tokens[0]) || tokens.some(t => PLANT_MILK_SOURCES.has(t));
  if (hasPlantMilk && (tokens.includes('süt') || tokens.includes('sütü'))) {
    return tokens.some(t => NON_VEGAN_TOKENS.has(t) && t !== 'süt' && t !== 'sütü');
  }
  // Türkçe balık türü bileşik adları ayraçsız birleşiyor (alabalık, kılıçbalığı
  // gibi) -- tam-kelime eşleşmesi bunları kaçırıyor, sonek kontrolü ekleniyor.
  if (tokens.some(t => t.endsWith('balık') || t.endsWith('balığı'))) {
    return true;
  }
  return tokens.some(t => NON_VEGAN_TOKENS.has(t));
}

const OVEN_KEYWORDS = ['fırın', 'oven'];
const VESSEL_KEYWORDS = ['tava', 'tencere', 'wok', 'güveç', 'cast iron', 'skillet', 'pot', 'pan', 'fritöz', 'buharlı'];

function hasOven(equipment) {
  return (equipment || []).some(item =>
    OVEN_KEYWORDS.some(keyword => item.toLowerCase().includes(keyword))
  );
}

function countDistinctVessels(equipment) {
  const found = new Set();
  (equipment || []).forEach(item => {
    const lower = item.toLowerCase();
    VESSEL_KEYWORDS.forEach(keyword => {
      if (lower.includes(keyword)) found.add(keyword);
    });
  });
  return found.size;
}

// Bir tarifin hızlı-filtre etiketlerini döndürür. Admin bir tarifte elle `tags`
// override etmişse (Firestore override dokümanı üzerinden) o liste heuristikten
// önce gelir — böylece admin panelinden yanlış otomatik etiketler düzeltilebilir.
export function getRecipeTags(recipe) {
  if (Array.isArray(recipe?.tags) && recipe.tags.length > 0) {
    return recipe.tags;
  }

  const tags = [];
  if (typeof recipe?.prepTime === 'number' && recipe.prepTime <= 30) {
    tags.push('quick');
  }
  const ovenPresent = hasOven(recipe?.equipment);
  if (!ovenPresent) {
    tags.push('noOven');
    if (countDistinctVessels(recipe?.equipment) <= 1) {
      tags.push('onePot');
    }
  }
  if (typeof recipe?.protein === 'number' && recipe.protein >= 20) {
    tags.push('highProtein');
  }
  if (typeof recipe?.calories === 'number' && recipe.calories <= FIT_CALORIE_THRESHOLD) {
    tags.push('fit');
  }
  const ingredients = recipe?.ingredients;
  if (Array.isArray(ingredients) && ingredients.length > 0 && !ingredients.some(isNonVeganIngredient)) {
    tags.push('vegan');
  }
  return tags;
}

export function recipeHasTag(recipe, tagKey) {
  return getRecipeTags(recipe).includes(tagKey);
}
