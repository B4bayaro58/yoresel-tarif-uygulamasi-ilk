import { cache } from 'react'
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { BlogPost } from '@/types'

// Sunucu tarafı (Server Component) blog okumaları. `blog.ts`'teki client
// sürümü sessionStorage önbelleği kullanıyor ve sayfa tarayıcıda boş
// başlayıp JS ile doluyordu — Google/AdSense tarayıcısı blog içeriğini hiç
// göremiyordu ("düşük değerli içerik" reddi, 2026-10). Bu fonksiyonlar
// sayfanın `revalidate` süresi boyunca CDN'den sunulan HTML'i besler.

// Firestore Timestamp'leri Server -> Client prop aktarımında düz değer olmalı
function toPlainPost(id: string, data: Record<string, unknown>): BlogPost {
  const plain: Record<string, unknown> = { ...data }
  for (const key of ['publishedAt', 'createdAt', 'updatedAt']) {
    if (plain[key] instanceof Timestamp) plain[key] = (plain[key] as Timestamp).toDate().toISOString()
  }
  return { id, ...plain } as BlogPost
}

function toMillis(value: unknown): number {
  const parsed = Date.parse(String(value ?? ''))
  return Number.isNaN(parsed) ? 0 : parsed
}

export const getPublishedPostsServer = cache(async (): Promise<BlogPost[]> => {
  try {
    const snap = await getDocs(query(collection(db, 'blogPosts'), where('status', '==', 'published')))
    return snap.docs
      .map((d) => toPlainPost(d.id, d.data()))
      .sort((a, b) => toMillis(b.publishedAt) - toMillis(a.publishedAt))
  } catch {
    return []
  }
})

// `blog.ts`'teki getBlogPostBySlug ile aynı gerekçe: slug filtresi tek başına
// firestore.rules tarafından reddedilir, status filtresiyle birlikte gitmeli.
export const getPostBySlugServer = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const snap = await getDocs(
      query(collection(db, 'blogPosts'), where('slug', '==', slug), where('status', '==', 'published'))
    )
    if (snap.empty) return null
    const d = snap.docs[0]
    return toPlainPost(d.id, d.data())
  } catch {
    return null
  }
})

export function formatPostDate(value: unknown): string {
  const millis = toMillis(value)
  if (!millis) return ''
  return new Date(millis).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}
