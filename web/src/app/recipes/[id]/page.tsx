import type { Metadata } from 'next'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'
import RecipeDetailClient from './RecipeDetailClient'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const localRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

// Statik katalogda olmayan (yalnızca Firestore'da yaşayan, admin panelinden
// eklenmiş) tarifler için metadata üretirken ağ isteğinin sayfayı asla
// bloklamaması için kısa bir zaman aşımı — Firestore'a ulaşılamazsa genel
// site başlığına düşülür, sayfa yine de render edilir.
async function fetchRecipeForMetadata(id: string): Promise<Recipe | undefined> {
  const local = localRecipes.find((r) => r.id === id)
  if (local) return local

  try {
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    const snap = await Promise.race([getDoc(doc(db, 'recipes', id)), timeout])
    if (snap.exists()) return { id: snap.id, ...snap.data() } as Recipe
  } catch {
    // Firestore'a ulaşılamadı / zaman aşımı — genel metadata'ya düş
  }
  return undefined
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const recipe = await fetchRecipeForMetadata(id)

  if (!recipe) {
    return { title: 'Tarif Bulunamadı — Yöresel Tarifler' }
  }

  const description = `${recipe.name} tarifi — ${recipe.country}${recipe.city ? `, ${recipe.city}` : ''}. ${recipe.prepTime} dakikada hazırlanır. Malzemeler, yapılış adımları ve daha fazlası Yöresel Tarifler'de.`

  return {
    title: `${recipe.name} Tarifi — Yöresel Tarifler`,
    description,
    openGraph: {
      title: `${recipe.name} Tarifi`,
      description,
      images: recipe.photo ? [{ url: recipe.photo }] : undefined,
      type: 'article',
    },
  }
}

export default function RecipeDetailPage() {
  return <RecipeDetailClient />
}
