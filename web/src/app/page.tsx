import { collection, getDocs, query, where, limit, doc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'
import HomeClient from './HomeClient'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const localRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

// Bu sayfa eskiden client'ta her ziyarette ~1100+ dokümanlık bir Firestore
// sorgusu atıyordu (kullanıcı skeleton görürken). Artık sorgu sunucuda,
// sayfa üretimi sırasında çalışıyor ve sonuç bu süre boyunca CDN'den
// sunuluyor — hem ilk boyama gecikmesi hem de trafikle orantılı okuma
// maliyeti ortadan kalkıyor (bkz. proje hafızası: firebase-cost-incident-2026-07).
// 1 saat: günlük okuma tavanını (24 sorgu/gün) daha da düşürür; admin
// panelinden bir fotoğraf override'ı kaydedildiğinde veya günün menüsü
// değiştiğinde en geç bu süre içinde yayına yansır. Daha anlık gerekiyorsa
// admin kaydetme aksiyonuna `revalidatePath('/')` eklenebilir.
export const revalidate = 3600

// Statik tarif kataloğu (1100+) zaten Unsplash fotoğraflarıyla yerelde mevcut;
// bu sorgu sadece admin panelinden yüklenmiş özel fotoğraf override'larını ve
// Firebase-native tarifleri getirir. NOT: bu sayfa useAllRecipes hook'unu
// kullanmıyor, kendi ayrı sorgusunu tutuyor (bkz. useAllRecipes.ts'teki "tek
// doğru kaynak" yorumu — orası yalnız favorites/page.tsx için doğru).
// override+native doküman sayısı 2026-07-20 itibarıyla 1105 — eski limit(200)
// yeni eklenen tarifleri (rastgele doküman ID'si limitin dışında kalınca) ana
// sayfaya hiç düşürmüyordu. Limit tek seferlik bir sorgu olduğu için (canlı
// dinleyici değil) büyütmek maliyet insidentini geri getirmiyor.
const FIRESTORE_OVERRIDE_FETCH_LIMIT = 3000

// Sadece bu statüdeki Firestore kayıtları herkese açık sayfalarda gösterilir.
// Admin panelinden bir statik tarif "gizlenirse" (status: 'inactive' override),
// bu tarifin GÖRÜNTÜLENMEMESİ gerekir — ama overriddenIds hesaplaması her
// statüdeki override kaydını görebilmeli (aşağıya bkz.).
// firestore.rules artık recipes.read'i status/override/owner/admin'e göre
// kısıtlıyor (readiness-audit-round3) — bare bir `limit(N)` sorgusu anonim
// kullanıcılar için tamamen reddedilir, bu yüzden kuralın iki genel-erişim
// dalıyla birebir eşleşen iki ayrı sorgu atılıp sonuçlar birleştiriliyor.
const PUBLIC_STATUSES = ['published', 'approved']

// `revalidate` yalnızca `next build && next start` ile gerçek Full Route
// Cache sağlıyor — `npm run dev`'de bu üstteki iki limit(3000) sorgusu HER
// navigasyonda sıfırdan çalışıyor, bu da lokal test sırasında 5-10sn'lik
// yavaşlığın kaynağıydı (bkz. proje hafızası: food-tech-vision-build-
// checkpoint-2026-08-03). Modül-seviyeli bu önbellek sadece dev sunucusu
// process'i ayaktayken yaşar; production'da zaten ISR devrede olduğu için
// zararsız/gereksiz bir ek katman, sorgu şeklini veya maliyet modelini
// değiştirmiyor.
let homeDataCache: { data: Awaited<ReturnType<typeof fetchHomeData>>; expires: number } | null = null
const HOME_DATA_CACHE_TTL_MS = 60_000

async function getHomeData() {
  if (homeDataCache && homeDataCache.expires > Date.now()) {
    return homeDataCache.data
  }
  const data = await fetchHomeData()
  homeDataCache = { data, expires: Date.now() + HOME_DATA_CACHE_TTL_MS }
  return data
}

// Firestore `createdAt`/`updatedAt` gelirken `Timestamp` nesnesi olarak
// geliyor (ör. `{seconds, nanoseconds}` + `toJSON`), Recipe tipi bu alanları
// `string` olarak tanımlıyor ama `...d.data()` spread'i tip kontrolünden
// kaçıyordu. Sonuç: React dev modunda Server->Client Component prop
// aktarımında HER tarif için "Only plain objects..." uyarısı basılıyordu —
// ~1000+ tarif için bu, gerçek Firestore sorgu süresinden bağımsız, dev
// sunucusunu asıl yavaşlatan şeydi.
function toPlainRecipe(id: string, data: Record<string, unknown>): Recipe {
  const plain: Record<string, unknown> = { ...data }
  if (plain.createdAt instanceof Timestamp) plain.createdAt = plain.createdAt.toDate().toISOString()
  if (plain.updatedAt instanceof Timestamp) plain.updatedAt = plain.updatedAt.toDate().toISOString()
  return { id, ...plain } as Recipe
}

async function fetchHomeData() {
  try {
    const [menuSnap, popularSnap] = await Promise.all([
      getDoc(doc(db, 'settings', 'dailyMenu')),
      getDoc(doc(db, 'settings', 'popularRecipes')),
    ])
    const dailyIds: string[] = menuSnap.exists() ? menuSnap.data().recipeIds || [] : []
    const popularIds: string[] = popularSnap.exists() ? popularSnap.data().recipeIds || [] : []

    const queries = [
      getDocs(query(
        collection(db, 'recipes'),
        where('status', 'in', PUBLIC_STATUSES),
        limit(FIRESTORE_OVERRIDE_FETCH_LIMIT)
      )),
      getDocs(query(
        collection(db, 'recipes'),
        where('overridesStaticId', '!=', null),
        limit(FIRESTORE_OVERRIDE_FETCH_LIMIT)
      )),
    ]
    if (dailyIds.length > 0) {
      queries.push(getDocs(query(
        collection(db, 'recipes'),
        where('overridesStaticId', 'in', dailyIds.slice(0, 30))
      )))
    }
    if (popularIds.length > 0) {
      queries.push(getDocs(query(
        collection(db, 'recipes'),
        where('overridesStaticId', 'in', popularIds.slice(0, 30))
      )))
    }
    const snaps = await Promise.all(queries)

    const merged = new Map<string, Recipe>()
    snaps.forEach((snap) => snap.docs.forEach((d) => merged.set(d.id, toPlainRecipe(d.id, d.data()))))

    return { firestoreRecipes: Array.from(merged.values()), dailyIds, popularIds }
  } catch {
    // Firebase not configured or no connection — use local only
    return { firestoreRecipes: [] as Recipe[], dailyIds: [] as string[], popularIds: [] as string[] }
  }
}

export default async function HomePage() {
  const { firestoreRecipes, dailyIds, popularIds } = await getHomeData()

  const overriddenIds = new Set(
    firestoreRecipes
      .filter((r: any) => r.overridesStaticId != null)
      .map((r: any) => String(r.overridesStaticId))
  )
  const displayableFirestore = firestoreRecipes.filter((r: any) => PUBLIC_STATUSES.includes(r.status))
  const allMap = new Map<string, Recipe>()
  localRecipes
    .filter((r) => !overriddenIds.has(String(r.id)))
    .forEach((r) => allMap.set(String(r.id), r))
  displayableFirestore.forEach((r) => allMap.set(r.id, r))
  const allRecipes = Array.from(allMap.values())

  const dailyMenuRecipes = dailyIds
    .map((id) =>
      allRecipes.find((r) => String(r.id) === String(id)) ||
      allRecipes.find((r) => String((r as any).overridesStaticId) === String(id))
    )
    .filter(Boolean) as Recipe[]

  const popularRecipes = popularIds
    .map((id) =>
      allRecipes.find((r) => String(r.id) === String(id)) ||
      allRecipes.find((r) => String((r as any).overridesStaticId) === String(id))
    )
    .filter(Boolean) as Recipe[]

  // Fisher-Yates — bu revalidate penceresi (1 saat) boyunca sabit kalan tek bir
  // sırayla üretiliyor, önceki client-side shuffle'ın aksine (o da her ziyarette
  // yeniden karıştırıyordu, ki zaten CDN önbelleği bunu artık mümkün kılmıyor).
  const shuffled = [...allRecipes]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return <HomeClient recipes={shuffled} dailyMenuRecipes={dailyMenuRecipes} popularRecipes={popularRecipes} />
}
