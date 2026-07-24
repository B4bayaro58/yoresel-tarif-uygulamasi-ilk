import type { Metadata } from 'next'
import { cache } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'
import { getOverrideRecipe } from '@/lib/overridePhoto'
import { buildRecipeJsonLd } from '@/lib/recipeJsonLd'
import RecipeDetailClient from './RecipeDetailClient'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const localRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

// 1 saat — anasayfadakiyle aynı gerekçe (bkz. web/src/app/page.tsx): sorgu
// trafikten bağımsız, en fazla saatte bir çalışır.
export const revalidate = 3600

// `generateMetadata` ve sayfa bileşeni aynı tarifi ayrı ayrı isteyecek --
// React'in `cache()`'i aynı istek içinde bu ikisini tek bir Firestore
// okumasına indirger (Next.js'in `fetch()` için yaptığı otomatik
// memoization'ın Firestore SDK'sı için elle yapılan karşılığı).
//
// Statik bir tarif id'siyse (ör. "adana-kebap") önce override var mı diye
// bakılıyor -- eskiden burada doğrudan statik veri döndürülüyordu, admin
// panelinden fotoğrafı/bilgisi güncellenmiş bir tarif için meta açıklaması
// ve (şimdi eklenen) JSON-LD hâlâ eski statik veriyi gösterirdi.
const fetchRecipe = cache(async (id: string): Promise<Recipe | undefined> => {
  const local = localRecipes.find((r) => r.id === id)
  if (local) {
    try {
      const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000))
      const override = await Promise.race([getOverrideRecipe(id), timeout])
      return override ?? local
    } catch {
      return local
    }
  }

  try {
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    const snap = await Promise.race([getDoc(doc(db, 'recipes', id)), timeout])
    if (snap.exists()) return { id: snap.id, ...snap.data() } as Recipe
  } catch {
    // Firestore'a ulaşılamadı / zaman aşımı — genel metadata'ya düş
  }
  return undefined
})

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const recipe = await fetchRecipe(id)

  if (!recipe) {
    return { title: 'Tarif Bulunamadı — Yöresel Tarifler' }
  }

  const description = `${recipe.name} tarifi — ${recipe.country}${recipe.city ? `, ${recipe.city}` : ''}. ${recipe.prepTime} dakikada hazırlanır. Malzemeler, yapılış adımları ve daha fazlası Yöresel Tarifler'de.`

  return {
    title: `${recipe.name} Tarifi — Yöresel Tarifler`,
    description,
    alternates: { canonical: `/recipes/${id}` },
    openGraph: {
      title: `${recipe.name} Tarifi`,
      description,
      images: recipe.photo ? [{ url: recipe.photo }] : undefined,
      type: 'article',
    },
  }
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const recipe = await fetchRecipe(id)

  return (
    <>
      {recipe && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildRecipeJsonLd(recipe)) }}
        />
      )}
      <RecipeDetailClient initialRecipe={recipe ?? null} />
    </>
  )
}
