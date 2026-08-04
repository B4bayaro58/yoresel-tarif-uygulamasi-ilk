// Paylaşılan hızlı-filtre / etiket sözlüğü — mobil (doğrudan) ve web (@shared/recipeTags) tarafından kullanılır.
// Onboarding, ana sayfa hızlı filtreleri ve admin etiket override editörü aynı QUICK_FILTERS listesini paylaşır.

// Gradyanlar uygulamada zaten kullanılan renklerle eşleşir (Avrupa kıta kartı,
// Musakka/Güney Amerika, onboarding slayt 2-3) — yeni bir renk paleti icat
// etmek yerine mevcut görsel dille tutarlılık sağlanır.
export const QUICK_FILTERS = [
  { key: 'quick', emoji: '⏱️', labelKey: 'quickFilterQuick', gradient: ['#4A6CF7', '#3A5CE5'] },
  { key: 'highProtein', emoji: '💪', labelKey: 'quickFilterHighProtein', gradient: ['#8E44AD', '#9B59B6'] },
  { key: 'onePot', emoji: '🍲', labelKey: 'quickFilterOnePot', gradient: ['#10B981', '#059669'] },
  { key: 'noOven', emoji: '🔥', labelKey: 'quickFilterNoOven', gradient: ['#FF6B57', '#FF4D3A'] },
];

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
  return tags;
}

export function recipeHasTag(recipe, tagKey) {
  return getRecipeTags(recipe).includes(tagKey);
}
