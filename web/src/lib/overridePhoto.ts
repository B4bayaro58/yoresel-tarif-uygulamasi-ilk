import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'

// Statik tarif kartları için özel yüklenmiş fotoğraf (override) arama sonuçlarını
// önbelleğe alır — aynı tarif kartı filtre değişince yeniden mount olsa da
// veya farklı bir listede (arama/favoriler) tekrar görünse de Firestore'a
// ikinci kez sorgu atılmaz. `null` de geçerli bir sonuçtur (override yok
// anlamına gelir), bu yüzden Map.has ile kontrol ediliyor.
//
// Salt modül-seviyeli bir Map, sekme içi client-side navigasyonda hayatta
// kalıyor ama tam sayfa yenilemede (F5) sıfırlanıyordu — her yenileme aynı
// ilk birkaç kartı tekrar sorguluyordu. sessionStorage'a yazılan bir gölge
// önbellekle sonuçlar sekme kapanana ya da TTL dolana kadar hayatta kalıyor.
const STORAGE_KEY = 'yt_override_cache_v1'
const TTL_MS = 24 * 60 * 60 * 1000 // 24 saat — admin bir override değiştirirse çok uzun bayat kalmasın

type PersistedEntry = { result: Recipe | null; savedAt: number }

function loadPersisted(): Record<string, PersistedEntry> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, PersistedEntry>
    const now = Date.now()
    const fresh: Record<string, PersistedEntry> = {}
    for (const [k, v] of Object.entries(parsed)) {
      if (v && now - v.savedAt < TTL_MS) fresh[k] = v
    }
    return fresh
  } catch {
    return {}
  }
}

const persisted: Record<string, PersistedEntry> = loadPersisted()

function savePersisted() {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  } catch {
    // sessionStorage dolu/erişilemez olabilir, sessizce yut
  }
}

const cache = new Map<string, Recipe | null>(
  Object.entries(persisted).map(([k, v]) => [k, v.result])
)
const pending = new Map<string, Promise<Recipe | null>>()

// Bir statik tarif kartı ekrana yaklaştığında (IntersectionObserver ile)
// çağrılır — tek, hedefli bir sorguyla o tarifin admin panelinden özel
// fotoğrafla override edilip edilmediğine bakar. Böylece binlerce statik
// tarifin hepsi için toplu bir sorgu atmak yerine, kullanıcının o an
// kaydırarak gördüğü kartlar kadar okuma yapılır.
export function getOverrideRecipe(staticId: string): Promise<Recipe | null> {
  if (cache.has(staticId)) return Promise.resolve(cache.get(staticId) ?? null)
  const existing = pending.get(staticId)
  if (existing) return existing

  const promise = (async () => {
    try {
      const snap = await getDocs(
        query(collection(db, 'recipes'), where('overridesStaticId', '==', staticId), limit(1))
      )
      const result = snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as Recipe)
      cache.set(staticId, result)
      persisted[staticId] = { result, savedAt: Date.now() }
      savePersisted()
      return result
    } catch {
      // Firebase yoksa/erişilemezse override yok say, statik fotoğraf kalsın
      return null
    } finally {
      pending.delete(staticId)
    }
  })()

  pending.set(staticId, promise)
  return promise
}
