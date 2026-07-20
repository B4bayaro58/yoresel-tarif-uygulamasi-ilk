'use client'

import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, query, where, limit } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const localRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

// Statik tarif kataloğu (1100+) zaten Unsplash fotoğraflarıyla yerelde mevcut;
// bu sorgu sadece admin panelinden yüklenmiş özel fotoğraf override'larını ve
// Firebase-native (yalnızca Firestore'da var olan) tarifleri getirir.
// NOT: override+native doküman sayısı 2026-07-20 itibarıyla zaten 1105 — eski
// limit(200) yeni eklenen tarifleri (rastgele doküman ID'si limitin dışında
// kalınca) ana listeye hiç düşürmüyordu. Limit tek seferlik bir sorgu olduğu
// için (canlı dinleyici değil) büyütmek maliyet insidentini geri getirmiyor.
const FIRESTORE_OVERRIDE_FETCH_LIMIT = 3000

// Statik katalogla Firestore'dan gelen tarifleri (override'lar + Firebase-native
// tarifler) birleştiren ortak birleştirme mantığı. Şu an yalnızca favorites/page.tsx
// bu hook'u kullanıyor — favorites/page.tsx eskiden yalnızca statik kataloğu
// kullandığı için Firebase-native/override edilmiş tarifleri favorilerken
// gösteremiyordu (bkz. 2026-07-10 canlı hata raporu), o yüzden buraya taşındı.
// NOT: anasayfa (page.tsx) ve arama (arama/page.tsx) bu hook'u KULLANMIYOR,
// kendi ayrı sorgu/veri mantıklarını tutuyorlar — buradaki bir değişiklik
// onlara otomatik yansımaz (bkz. 2026-07-20 "Divriği Pilavı görünmüyor" hatası,
// page.tsx'in kendi limit(200)'ü ayrı bir yerde unutulmuştu).
export function useAllRecipes() {
  const [firestoreRecipes, setFirestoreRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        const snap = await getDocs(query(
          collection(db, 'recipes'),
          where('status', 'in', ['published', 'approved']),
          limit(FIRESTORE_OVERRIDE_FETCH_LIMIT)
        ))
        if (cancelled) return
        setFirestoreRecipes(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Recipe)))
      } catch {
        // Firebase not configured or no connection — use local only
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [])

  const allRecipes = useMemo(() => {
    const overriddenIds = new Set(
      firestoreRecipes
        .filter((r: any) => r.overridesStaticId != null)
        .map((r: any) => String(r.overridesStaticId))
    )
    const map = new Map<string, Recipe>()
    localRecipes
      .filter((r) => !overriddenIds.has(String(r.id)))
      .forEach((r) => map.set(String(r.id), r))
    firestoreRecipes.forEach((r) => map.set(r.id, r))
    return Array.from(map.values())
  }, [firestoreRecipes])

  return { allRecipes, loading }
}
