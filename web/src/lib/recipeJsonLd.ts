import { Recipe } from '@/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoreseltarif.com'
const SITE_NAME = 'Yöresel Tarif'

// Dakika cinsinden bir süreyi schema.org'un beklediği ISO 8601 duration
// formatına çevirir (ör. 45 -> "PT45M").
function toIsoDuration(minutes: number | undefined): string | undefined {
  if (!minutes || minutes <= 0) return undefined
  return `PT${Math.round(minutes)}M`
}

// Google'ın Recipe zengin sonuçları için schema.org/Recipe JSON-LD üretir.
// BİLİNÇLİ OLARAK `aggregateRating`/`review` EKLEMİYORUZ: elimizdeki
// `recipe.rating` alanı statik katalogda baştan editoryal olarak girilmiş bir
// değer, gerçek kullanıcı yorumlarından toplanmış bir sayı değil — Google'ın
// structured data politikaları kullanıcı tarafından üretilmemiş puan/yorum
// işaretlemesini yasaklıyor ve bu tür ihlaller manuel eylem (site genelinde
// zengin sonuç kaybı) riski taşıyor. Gerçek bir `Reviews` koleksiyonundan
// toplanan bir ratingCount elde edilirse o zaman eklenmeli.
export function buildRecipeJsonLd(recipe: Recipe) {
  const url = `${SITE_URL}/recipes/${recipe.id}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    image: recipe.photo ? [recipe.photo] : undefined,
    author: { '@type': 'Organization', name: SITE_NAME },
    description: `${recipe.name} tarifi — ${recipe.country}${recipe.city ? `, ${recipe.city}` : ''}.`,
    recipeCuisine: recipe.country,
    recipeCategory: recipe.category,
    prepTime: toIsoDuration(recipe.prepTime),
    recipeYield: recipe.servings ? `${recipe.servings} porsiyon` : undefined,
    recipeIngredient: recipe.ingredients?.map((ing) => `${ing.amount} ${ing.name}`.trim()),
    recipeInstructions: recipe.steps?.map((step) => ({ '@type': 'HowToStep', text: step })),
    nutrition: recipe.calories
      ? { '@type': 'NutritionInformation', calories: `${recipe.calories} kcal` }
      : undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
}
