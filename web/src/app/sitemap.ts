import type { MetadataRoute } from 'next'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'
import { getPublishedPostsServer } from '@/lib/blogServer'
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
  '', 'recipes', 'blog', 'arama', 'tarif-oner', 'gizlilik-politikasi', 'kullanim-kosullari',
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

  // Blog yazıları eskiden site haritasında hiç yoktu (2026-10 AdSense reddi
  // incelemesinde fark edildi) -- sitenin en özgün içeriği bunlar.
  const blogEntries: MetadataRoute.Sitemap = (await getPublishedPostsServer()).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : post.publishedAt ? new Date(post.publishedAt) : new Date(),
  }))

  return [...staticEntries, ...blogEntries, ...staticRecipeEntries, ...nativeRecipeEntries]
}
