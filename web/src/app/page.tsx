'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { collection, getDocs, query, where, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useApp } from '@/contexts/AppContext'
import RecipeCard from '@/components/RecipeCard'
import ContinentFilter from '@/components/ContinentFilter'
import SkeletonCard from '@/components/SkeletonCard'
import AdBanner from '@/components/AdBanner'
import { Recipe } from '@/types'
import { isPreOptimized } from '@/lib/image'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const localRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

const PAGE_SIZE = 20

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

export default function HomePage() {
  const { t, favorites, toggleFavorite } = useApp()
  const [selectedContinent, setSelectedContinent] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [firestoreRecipes, setFirestoreRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [dailyMenuIds, setDailyMenuIds] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        const menuSnap = await getDoc(doc(db, 'settings', 'dailyMenu'))
        const dailyIds: string[] = menuSnap.exists() ? menuSnap.data().recipeIds || [] : []

        // Genel liste limit(200) ile sınırlı (maliyet denetimi 2026-07-09) — 1100+
        // tariften rastgele bir 200'lük dilim döner, günün menüsündeki override'lar
        // bu dilimin dışında kalabilir ve tarif eski statik fotoğrafla görünürdü.
        // Günün menüsündeki override'ları ayrı, hedefli bir sorguyla garantiye alıyoruz.
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
        if (cancelled) return

        const merged = new Map<string, Recipe>()
        recipesSnap.docs.forEach((d) => merged.set(d.id, { id: d.id, ...d.data() } as Recipe))
        dailyOverridesSnap?.docs.forEach((d) => merged.set(d.id, { id: d.id, ...d.data() } as Recipe))

        setFirestoreRecipes(Array.from(merged.values()))
        setDailyMenuIds(dailyIds)
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

  const dailyMenuRecipes = useMemo(() =>
    dailyMenuIds
      .map((id) =>
        allRecipes.find((r) => String(r.id) === String(id)) ||
        allRecipes.find((r) => String((r as any).overridesStaticId) === String(id))
      )
      .filter(Boolean) as Recipe[],
    [dailyMenuIds, allRecipes]
  )

  const shuffledRecipes = useMemo(() => {
    const arr = [...allRecipes]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [allRecipes])

  const filtered = useMemo(() => {
    return shuffledRecipes.filter((r) => {
      if (selectedContinent !== 'all' && r.continent !== selectedContinent) return false
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false
      return true
    })
  }, [shuffledRecipes, selectedContinent, selectedCategory])

  // Reset pagination when filter changes
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [selectedContinent, selectedCategory])

  const favSet = useMemo(() => new Set(favorites), [favorites])

  const hasFilter = selectedContinent !== 'all' || selectedCategory !== 'all'

  const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div>
      {/* ── Hero ──────────────────────────────────── */}
      <div
        className="relative overflow-hidden hero-glow"
        style={{ paddingTop: '56px', paddingBottom: '52px' }}
      >
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-display font-black uppercase tracking-[0.25em] whitespace-nowrap"
            style={{ fontSize: 'clamp(60px, 14vw, 160px)', color: 'var(--primary)', opacity: 0.04, lineHeight: 1 }}
          >
            LEZZET
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-8 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--primary)' }}>
              Lezzet Atlası
            </span>
          </div>
          <h1
            className="font-display font-bold leading-[1.05] mb-3"
            style={{ fontSize: 'clamp(36px, 6vw, 68px)', color: 'var(--text)' }}
          >
            Dünya'nın<br />
            <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Lezzetleri</em>
          </h1>
          <p className="text-base mb-6 max-w-lg" style={{ color: 'var(--text-muted)' }}>
            8 kıtadan özenle derlenen dünya lezzetlerini keşfedin.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">

        {/* ── Günün Menüsü ──────────────────────────── */}
        {(loading || dailyMenuRecipes.length > 0) && (
          <div className="mb-8 -mt-6 relative z-10">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)',
                boxShadow: '0 8px 32px rgba(185,122,26,0.25)',
              }}
            >
              {/* Header */}
              <div className="px-5 pt-5 pb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Günün Menüsü</span>
                  </div>
                  <p className="text-white font-display font-bold text-lg capitalize">{today}</p>
                </div>
                <span style={{ fontSize: '36px' }}>🍽️</span>
              </div>

              {/* Recipe scroll */}
              <div className="px-5 pb-5">
                {loading ? (
                  <div className="flex gap-3 overflow-hidden">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex-shrink-0 w-48 h-32 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
                    {dailyMenuRecipes.map((recipe) => (
                      <a
                        key={recipe.id}
                        href={`/recipes/${recipe.id}`}
                        className="flex-shrink-0 relative rounded-xl overflow-hidden group transition-transform hover:scale-[1.02]"
                        style={{ width: '200px', height: '130px', scrollSnapAlign: 'start' }}
                      >
                        {recipe.photo ? (
                          <Image
                            src={recipe.photoThumb || recipe.photo}
                            alt={recipe.name}
                            fill
                            sizes="200px"
                            loading="lazy"
                            unoptimized={isPreOptimized(recipe.photoThumb || recipe.photo)}
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: `linear-gradient(145deg, ${recipe.gradient?.[0] ?? '#8B4513'}, ${recipe.gradient?.[1] ?? '#A0522D'})` }}
                          >
                            <span style={{ fontSize: '42px' }}>{recipe.emoji}</span>
                          </div>
                        )}
                        <div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)' }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
                          <p className="text-white font-semibold text-xs leading-tight line-clamp-2">{recipe.name}</p>
                          <p className="text-white/60 text-[10px] mt-0.5">{recipe.country}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── AD: Leaderboard — Günün Menüsü ile filtre arası ── */}
        <div className="flex justify-center mb-6">
          <AdBanner size="leaderboard" />
        </div>

        {/* ── Filter panel ──────────────────────────── */}
        <div
          className="rounded-2xl p-5 mb-6 relative z-10"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
        >
          <ContinentFilter
            selectedContinent={selectedContinent}
            selectedCategory={selectedCategory}
            onContinentChange={setSelectedContinent}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* ── Active filter info ──────────────────── */}
        {hasFilter && (
          <div className="flex items-center gap-3 mb-4 animate-fade-in">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}
            >
              <span>{filtered.length} tarif bulundu</span>
            </div>
            <button
              onClick={() => { setSelectedContinent('all'); setSelectedCategory('all') }}
              className="text-xs underline underline-offset-2 hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-muted)' }}
            >
              Temizle
            </button>
          </div>
        )}

        {/* ── Recipe grid ───────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4" style={{ backgroundColor: 'var(--primary-dim)' }}>
              🍽️
            </div>
            <p className="text-lg font-display font-bold mb-1" style={{ color: 'var(--text)' }}>{t('noResults')}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Farklı bir filtre deneyin</p>
          </div>
        ) : (() => {
          const visible = filtered.slice(0, visibleCount)
          const firstChunk = visible.slice(0, 8)
          const secondChunk = visible.slice(8)
          const hasMore = visibleCount < filtered.length
          return (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {firstChunk.map((recipe, i) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFav={favSet.has(recipe.id)}
                    onFavoriteToggle={toggleFavorite}
                    priority={i < 4}
                  />
                ))}
              </div>

              {secondChunk.length > 0 && (
                <>
                  {/* ── AD: Rectangle — 8 karttan sonra ── */}
                  <div className="flex justify-center my-6">
                    <AdBanner size="rectangle" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {secondChunk.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        isFav={favSet.has(recipe.id)}
                        onFavoriteToggle={toggleFavorite}
                      />
                    ))}
                  </div>
                </>
              )}

              {hasMore && (
                <div className="flex justify-center mt-8 mb-4">
                  <button
                    onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                    className="btn-primary px-8 py-3 rounded-2xl font-semibold text-sm"
                  >
                    Daha Fazla Göster
                  </button>
                </div>
              )}
            </>
          )
        })()}
      </div>
    </div>
  )
}
