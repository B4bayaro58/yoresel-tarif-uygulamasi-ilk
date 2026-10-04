import { doc, setDoc, increment, serverTimestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'

// Admin panelindeki istatistikler için görüntülenme sayaçları.
//
// Cloud Function kullanılmıyor (bkz. 2026-07 maliyet olayı) — sayaçlar client'tan
// `increment()` ile yazılıyor, firestore.rules sadece +1 artışa izin veriyor.
// Bir görüntüleme 2 yazma: öğenin kendi sayacı + günlük toplam dokümanı.
//
// - views: toplam açılma (aynı cihazdan 30 dk içindeki tekrarlar sayılmaz —
//   sayfa yenileme ve React StrictMode çift effect'i şişirmesin)
// - uniqueViews: o öğeyi ilk kez açan cihaz/tarayıcı sayısı ("kaç kişi")
// - statsDaily/{YYYY-MM-DD}.visitors: o gün en az bir tarif/yazı açan cihaz sayısı
//
// Tekil sayımı cihaz bazlı: localStorage temizlenirse veya farklı tarayıcıdan
// girilirse aynı kişi tekrar sayılır. Mobil uygulama da aynı dokümanlara yazar
// (src/services/viewStatsService.js).

type Kind = 'recipe' | 'blog'

const STORAGE_KEY = 'yt_view_stats_v1'
const REPEAT_WINDOW_MS = 30 * 60 * 1000

interface Persisted {
  seen: Record<string, number> // `${kind}:${id}` -> son sayılan görüntüleme zamanı
  lastActiveDay?: string
}

function load(): Persisted {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* erişilemez/bozuk — boş başla */ }
  return { seen: {} }
}

function save(data: Persisted) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* sessizce yut */ }
}

export function todayKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Aynı sayfa yüklemesinde ikinci çağrıyı localStorage'a yazılmadan önce de engelle
const inFlight = new Set<string>()

export function trackView(kind: Kind, id: string | undefined | null) {
  if (typeof window === 'undefined' || !id) return
  const key = `${kind}:${id}`
  if (inFlight.has(key)) return

  const data = load()
  const now = Date.now()
  const last = data.seen[key]
  if (last && now - last < REPEAT_WINDOW_MS) return

  const isUnique = !last
  const day = todayKey()
  const isNewDayVisitor = data.lastActiveDay !== day

  inFlight.add(key)
  data.seen[key] = now
  data.lastActiveDay = day
  save(data)

  const collectionName = kind === 'recipe' ? 'recipeStats' : 'blogStats'
  const dailyField = kind === 'recipe' ? 'recipeViews' : 'blogViews'

  Promise.all([
    setDoc(
      doc(db, collectionName, id),
      { views: increment(1), uniqueViews: increment(isUnique ? 1 : 0), lastViewedAt: serverTimestamp() },
      { merge: true },
    ),
    setDoc(
      doc(db, 'statsDaily', day),
      { [dailyField]: increment(1), visitors: increment(isNewDayVisitor ? 1 : 0) },
      { merge: true },
    ),
  ]).catch(() => {
    // İstatistik hatası sayfayı etkilememeli
  })
}
