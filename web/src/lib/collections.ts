import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/config/firebase'

export interface EditorialCollection {
  id: string
  title: string
  subtitle?: string
  coverPhoto?: string
  region?: string
  recipeIds: string[]
  order: number
  isActive: boolean
}

// Sıralama client-side yapılıyor — `isActive` eşitlik filtresi + `order` alanında
// orderBy birleşimi bir composite index gerektirebilir ve bu projede
// firestore.indexes.json / Firebase CLI deploy akışı yok (bkz. maliyet
// denetimi notları); tek eşitlik filtresiyle sorgulayıp sıralamayı burada
// yapmak index'siz çalışmayı garantiliyor.
const STORAGE_KEY = 'yt_collections_cache_v1'
const TTL_MS = 60 * 60 * 1000 // 1 saat

let memoryCache: EditorialCollection[] | null = null
let memoryCacheSavedAt = 0
let pending: Promise<EditorialCollection[]> | null = null

function loadPersisted(): { data: EditorialCollection[]; savedAt: number } | null {
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

function savePersisted(data: EditorialCollection[], savedAt: number) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data, savedAt }))
  } catch {
    // sessionStorage dolu/erişilemez olabilir, sessizce yut
  }
}

export async function getCollections(): Promise<EditorialCollection[]> {
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
      const snap = await getDocs(query(collection(db, 'collections'), where('isActive', '==', true)))
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as EditorialCollection)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
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

export async function getCollectionById(id: string): Promise<EditorialCollection | null> {
  const all = await getCollections()
  return all.find((c) => c.id === id) ?? null
}
