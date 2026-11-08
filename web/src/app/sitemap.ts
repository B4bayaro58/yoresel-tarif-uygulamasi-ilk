import type { MetadataRoute } from 'next'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'
import { getPublishedPostsServer } from '@/lib/blogServer'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'
// @ts-ignore
import { getRecipeIntro } from '@shared/recipeIntros'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoreseltarif.com'
const localRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

// Günde bir kez yenilenir — her ziyaretçide değil, tek bir build/revalidate
// döngüsünde en fazla ~1100 Firestore okuması yapar (bkz. firebase maliyet
// denetimi 2026-07: sorun her sayfa görüntülemede tekrarlanan okumalardı,
// günde bir kereye sınırlı bir okuma bunun kapsamı dışında).
export const revalidate = 86400

const PUBLIC_STATUSES = ['published', 'approved']

const STATIC_PAGES = [
  '', 'recipes', 'blog', 'arama', 'tarif-oner', 'gizlilik-politikasi', 'kullanim-kosullari',
  'kvkk', 'acik-riza-metni', 'cerez-politikasi', 'icerik-politikasi', 'hakkimizda', 'sss', 'iletisim',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: p ? `${SITE_URL}/${p}` : SITE_URL,
    lastModified: new Date(),
  }))

  // Tanıtım yazısı olmayan tarifler noindex (bkz. recipes/[id]/page.tsx) ve
  // sitemap'e girmez. Intro'lar statik tarif id'sine bağlı; yalnızca
  // Firestore'da yaşayan (admin/kullanıcı eklemesi) tariflerin intro'su yok.
  // Admin panelinden pasife alınmış statik tarifler (override'ı yayında
  // olmayan) da girmez -- sayfaları ziyaretçiye gösterilmiyor.
  const hiddenStaticIds = new Set<string>()
  try {
    const overrideSnap = await getDocs(query(collection(db, 'recipes'), where('overridesStaticId', '!=', null)))
    overrideSnap.docs
      .filter((d) => !PUBLIC_STATUSES.includes(d.data().status))
      .forEach((d) => hiddenStaticIds.add(String(d.data().overridesStaticId)))
  } catch {
    // Firestore'a ulaşılamadı — sitemap yine de statik tariflerle üretilsin
  }

  const staticRecipeEntries: MetadataRoute.Sitemap = localRecipes
    .filter((r) => !hiddenStaticIds.has(String(r.id)) && getRecipeIntro(String(r.id)))
    .map((r) => ({
      url: `${SITE_URL}/recipes/${encodeURIComponent(String(r.id))}`,
      lastModified: new Date(),
    }))

  // Blog yazıları eskiden site haritasında hiç yoktu (2026-10 AdSense reddi
  // incelemesinde fark edildi) -- sitenin en özgün içeriği bunlar.
  const blogEntries: MetadataRoute.Sitemap = (await getPublishedPostsServer()).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : post.publishedAt ? new Date(post.publishedAt) : new Date(),
  }))

  return [...staticEntries, ...blogEntries, ...staticRecipeEntries]
}
