import { collection, getDocs, query, where, limit, doc, getDoc } from 'firebase/firestore'
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

async function getHomeData() {
  try {
    const menuSnap = await getDoc(doc(db, 'settings', 'dailyMenu'))
    const dailyIds: string[] = menuSnap.exists() ? menuSnap.data().recipeIds || [] : []

    const queries = [
      getDocs(query(
        collection(db, 'recipes'),
        where('status', 'in', ['published', 'approved']),
        limit(FIRESTORE_OVERRIDE_FETCH_LIMIT)
      )),
    ]
    if (dailyIds.length > 0) {
      queries.push(getDocs(query(
        collection(db, 'recipes'),
        where('overridesStaticId', 'in', dailyIds.slice(0, 30))
      )))
    }
    const [recipesSnap, dailyOverridesSnap] = await Promise.all(queries)

    const merged = new Map<string, Recipe>()
    recipesSnap.docs.forEach((d) => merged.set(d.id, { id: d.id, ...d.data() } as Recipe))
    dailyOverridesSnap?.docs.forEach((d) => merged.set(d.id, { id: d.id, ...d.data() } as Recipe))

    return { firestoreRecipes: Array.from(merged.values()), dailyIds }
  } catch {
    // Firebase not configured or no connection — use local only
    return { firestoreRecipes: [] as Recipe[], dailyIds: [] as string[] }
  }
}

export default async function HomePage() {
  const { firestoreRecipes, dailyIds } = await getHomeData()

  const overriddenIds = new Set(
    firestoreRecipes
      .filter((r: any) => r.overridesStaticId != null)
      .map((r: any) => String(r.overridesStaticId))
  )
  const allMap = new Map<string, Recipe>()
  localRecipes
    .filter((r) => !overriddenIds.has(String(r.id)))
    .forEach((r) => allMap.set(String(r.id), r))
  firestoreRecipes.forEach((r) => allMap.set(r.id, r))
  const allRecipes = Array.from(allMap.values())

  const dailyMenuRecipes = dailyIds
    .map((id) =>
      allRecipes.find((r) => String(r.id) === String(id)) ||
      allRecipes.find((r) => String((r as any).overridesStaticId) === String(id))
    )
    .filter(Boolean) as Recipe[]

  // Fisher-Yates — bu revalidate penceresi (15 dk) boyunca sabit kalan tek bir
  // sırayla üretiliyor, önceki client-side shuffle'ın aksine (o da her ziyarette
  // yeniden karıştırıyordu, ki zaten CDN önbelleği bunu artık mümkün kılmıyor).
  const shuffled = [...allRecipes]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return <HomeClient recipes={shuffled} dailyMenuRecipes={dailyMenuRecipes} />
}
