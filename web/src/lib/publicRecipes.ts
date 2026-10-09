import { collection, getDocs, query, where, limit } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const localRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

// Ana sayfadaki (app/page.tsx) birleştirmeyle aynı kurallar: admin panelinden
// override edilmiş statik tarif, override'ın kendisiyle değiştirilir; override
// 'inactive' ise tarif hiç gösterilmez; sadece Firestore'da yaşayan yayındaki
// tarifler de eklenir. firestore.rules iki genel-erişim dalına (status ve
// overridesStaticId) birebir uyan iki ayrı sorgu gerektiriyor.
const PUBLIC_STATUSES = ['published', 'approved']
const FETCH_LIMIT = 3000

export async function getPublicRecipes(): Promise<Recipe[]> {
  let firestoreRecipes: any[] = []
  try {
    const snaps = await Promise.all([
      getDocs(query(collection(db, 'recipes'), where('status', 'in', PUBLIC_STATUSES), limit(FETCH_LIMIT))),
      getDocs(query(collection(db, 'recipes'), where('overridesStaticId', '!=', null), limit(FETCH_LIMIT))),
    ])
    const merged = new Map<string, any>()
    snaps.forEach((snap) => snap.docs.forEach((d) => merged.set(d.id, { id: d.id, ...d.data() })))
    firestoreRecipes = Array.from(merged.values())
  } catch {
    // Firestore'a ulaşılamadı -- statik katalogla devam
  }

  const overriddenIds = new Set(
    firestoreRecipes.filter((r) => r.overridesStaticId != null).map((r) => String(r.overridesStaticId))
  )
  const all = new Map<string, Recipe>()
  localRecipes.filter((r) => !overriddenIds.has(String(r.id))).forEach((r) => all.set(String(r.id), r))
  firestoreRecipes
    .filter((r) => PUBLIC_STATUSES.includes(r.status))
    // Liste sayfası yalnız ad/ülke/şehir kullanıyor; Timestamp gibi alanları taşımaya gerek yok
    .forEach((r) => all.set(r.id, { id: r.id, name: r.name, country: r.country, city: r.city, continent: r.continent } as Recipe))
  return Array.from(all.values()).filter((r) => r.name)
}
