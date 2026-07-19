import type { MetadataRoute } from 'next'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoreseltarif.com'
const localRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

// Günde bir kez yenilenir — her ziyaretçide değil, tek bir build/revalidate
// döngüsünde en fazla ~1100 Firestore okuması yapar (bkz. firebase maliyet
// denetimi 2026-07: sorun her sayfa görüntülemede tekrarlanan okumalardı,
// günde bir kereye sınırlı bir okuma bunun kapsamı dışında).
export const revalidate = 86400

const STATIC_PAGES = [
  '', 'arama', 'tarif-oner', 'gizlilik-politikasi', 'kullanim-kosullari',
  'kvkk', 'cerez-politikasi', 'icerik-politikasi', 'hakkimizda', 'sss', 'iletisim',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: p ? `${SITE_URL}/${p}` : SITE_URL,
    lastModified: new Date(),
  }))

  const staticRecipeEntries: MetadataRoute.Sitemap = localRecipes.map((r) => ({
    url: `${SITE_URL}/recipes/${r.id}`,
    lastModified: new Date(),
  }))

  // Statik kataloğun dışında, sadece Firestore'da yaşayan (admin panelinden
  // sıfırdan eklenmiş, bir override olmayan) yayındaki tarifler
  let nativeRecipeEntries: MetadataRoute.Sitemap = []
  try {
    const snap = await getDocs(
      query(collection(db, 'recipes'), where('status', 'in', ['published', 'approved']))
    )
    nativeRecipeEntries = snap.docs
      .filter((d) => !d.data().overridesStaticId)
      .map((d) => ({ url: `${SITE_URL}/recipes/${d.id}`, lastModified: new Date() }))
  } catch {
    // Firestore'a ulaşılamadı — sitemap yine de statik tariflerle üretilsin
  }

  return [...staticEntries, ...staticRecipeEntries, ...nativeRecipeEntries]
}
