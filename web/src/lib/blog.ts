import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { BlogPost } from '@/types'

// `collections.ts` ile aynı desen: yayınlanan yazılar tek sorguyla çekilip TTL'li
// önbelleğe alınır, sıralama client-side yapılır (composite index gerektirmemek için).
const STORAGE_KEY = 'yt_blog_cache_v1'
const TTL_MS = 15 * 60 * 1000 // 15 dakika — blog içeriği koleksiyonlardan daha sık güncellenebilir

let memoryCache: BlogPost[] | null = null
let memoryCacheSavedAt = 0
let pending: Promise<BlogPost[]> | null = null

function toMillis(value: unknown): number {
  if (!value) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'object' && value !== null && 'seconds' in (value as any)) {
    return (value as any).seconds * 1000
  }
  const parsed = Date.parse(String(value))
  return Number.isNaN(parsed) ? 0 : parsed
}

function loadPersisted(): { data: BlogPost[]; savedAt: number } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.savedAt > TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function savePersisted(data: BlogPost[], savedAt: number) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data, savedAt }))
  } catch {
    // sessionStorage dolu/erişilemez olabilir, sessizce yut
  }
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  if (memoryCache && Date.now() - memoryCacheSavedAt < TTL_MS) return memoryCache

  const persisted = loadPersisted()
  if (persisted) {
    memoryCache = persisted.data
    memoryCacheSavedAt = persisted.savedAt
    return memoryCache
  }

  if (pending) return pending

  pending = (async () => {
    try {
      const snap = await getDocs(query(collection(db, 'blogPosts'), where('status', '==', 'published')))
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as BlogPost)
        .sort((a, b) => toMillis(b.publishedAt) - toMillis(a.publishedAt))
      memoryCache = data
      memoryCacheSavedAt = Date.now()
      savePersisted(data, memoryCacheSavedAt)
      return data
    } catch {
      return []
    } finally {
      pending = null
    }
  })()

  return pending
}

export async function getLatestBlogPosts(count: number): Promise<BlogPost[]> {
  const all = await getPublishedBlogPosts()
  return all.slice(0, count)
}

// Sorgu hem `slug` hem `status=='published'` filtresini birlikte taşır — tek
// başına `slug` filtresi, Firestore kuralının ("published || isAdmin()") tüm
// olası sonuçlar için statik olarak sağlanamaması nedeniyle TÜM sorguyu
// reddettirir (bkz. useAllRecipes.ts/page.tsx'teki aynı gerekçeyle ayrılmış
// sorgular). Taslak bir yazı, admin panelinden id ile ayrıca görüntülenir.
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const snap = await getDocs(
      query(collection(db, 'blogPosts'), where('slug', '==', slug), where('status', '==', 'published'))
    )
    if (snap.empty) return null
    const d = snap.docs[0]
    return { id: d.id, ...d.data() } as BlogPost
  } catch {
    return null
  }
}
