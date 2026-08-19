'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Check } from 'lucide-react'
import clsx from 'clsx'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import RecipeCard from '@/components/RecipeCard'
import ContinentFilter from '@/components/ContinentFilter'
import { Recipe } from '@/types'
import { isPreOptimized } from '@/lib/image'
import { getCollections, EditorialCollection } from '@/lib/collections'
import { getLatestBlogPosts } from '@/lib/blog'
import { BlogPost } from '@/types'
import AdSlot from '@/components/AdSlot'
// @ts-ignore
import { QUICK_FILTERS, getRecipeTags } from '@shared/recipeTags'

const PAGE_SIZE = 20

interface QuickFilter {
  key: string
  emoji: string
  labelKey: string
  gradient: string[]
}

interface HomeClientProps {
  recipes: Recipe[]
  dailyMenuRecipes: Recipe[]
  popularRecipes: Recipe[]
}

function getGreeting(hour: number) {
  if (hour < 11) return 'Güne güzel bir kahvaltıyla başla'
  if (hour < 15) return 'Bugün öğle yemeğine ne dersin?'
  if (hour < 19) return 'Akşama doğru hafif bir şeyler mi?'
  return 'Hızlı bir akşam yemeğine ne dersin?'
}

export default function HomeClient({ recipes, dailyMenuRecipes, popularRecipes }: HomeClientProps) {
  const { t, favorites, toggleFavorite, preferredQuickFilters, onboardingPrefsSet, saveOnboardingPreferences } = useApp()
  const { user } = useAuth()
  const router = useRouter()
  const [selectedContinent, setSelectedContinent] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [searchQuery, setSearchQuery] = useState('')
  const [greeting, setGreeting] = useState('Dünyanın dört bir yanından özenle derlenen lezzetleri keşfedin.')
  const [onboardingSelection, setOnboardingSelection] = useState<string[]>([])
  const [collections, setCollections] = useState<EditorialCollection[]>([])
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([])
  const appliedDefaultRef = React.useRef(false)

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()))
  }, [])

  useEffect(() => {
    getLatestBlogPosts(4).then(setLatestPosts)
  }, [])

  useEffect(() => {
    getCollections().then(setCollections)
  }, [])

  const featuredCollection = useMemo(
    () => collections.find((c) => !c.region) ?? collections[0] ?? null,
    [collections]
  )
  const regionalCollections = useMemo(
    () => collections.filter((c) => c.region && c.id !== featuredCollection?.id),
    [collections, featuredCollection]
  )

  // Onboarding'de seçilen tercihi ana sayfaya varsayılan aktif çip olarak uygula (bir kez)
  useEffect(() => {
    if (!appliedDefaultRef.current && preferredQuickFilters.length > 0) {
      setSelectedQuickFilter(preferredQuickFilters[0])
      appliedDefaultRef.current = true
    }
  }, [preferredQuickFilters])

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (selectedContinent !== 'all' && r.continent !== selectedContinent) return false
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false
      if (selectedQuickFilter && !getRecipeTags(r).includes(selectedQuickFilter)) return false
      return true
    })
  }, [recipes, selectedContinent, selectedCategory, selectedQuickFilter])

  // Reset pagination when filter changes
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [selectedContinent, selectedCategory, selectedQuickFilter])

  const favSet = useMemo(() => new Set(favorites), [favorites])

  const hasFilter = selectedContinent !== 'all' || selectedCategory !== 'all' || !!selectedQuickFilter

  const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    router.push(q ? `/arama?q=${encodeURIComponent(q)}` : '/arama')
  }

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
            Dünya&apos;nın<br />
            <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Lezzetleri</em>
          </h1>
          <p className="text-base mb-6 max-w-lg" style={{ color: 'var(--text-muted)' }}>
            {greeting}
          </p>

          {/* ── Akıllı arama çubuğu ── */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl">
            <div
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
            >
              <Search size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchRecipes')}
                autoCorrect="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-base outline-none"
                style={{ color: 'var(--text)' }}
              />
            </div>
          </form>

          {/* ── Hızlı filtre çipleri ── */}
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hidden pb-1 mt-5">
            {QUICK_FILTERS.map((qf: QuickFilter) => {
              const active = selectedQuickFilter === qf.key
              return (
                <button
                  key={qf.key}
                  onClick={() => setSelectedQuickFilter(active ? null : qf.key)}
                  className={clsx(
                    'flex-shrink-0 flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap',
                    active ? 'text-white shadow-warm' : 'hover:opacity-80'
                  )}
                  style={
                    active
                      ? { background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }
                      : { backgroundColor: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }
                  }
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: active ? 'rgba(255,255,255,0.25)' : `${qf.gradient[0]}26` }}
                  >
                    {qf.emoji}
                  </span>
                  <span>{t(qf.labelKey)}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">

        {/* ── İlk ziyaret onboarding tercih kartı ────── */}
        {!onboardingPrefsSet && (
          <div
            className="rounded-3xl p-6 sm:p-7 mb-8 -mt-6 relative z-10"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 12px 40px rgba(28,18,10,0.10)' }}
          >
            <div className="flex items-start gap-3 mb-5">
              <span className="text-3xl leading-none">🍽️</span>
              <div>
                <p className="font-display font-bold text-xl mb-1" style={{ color: 'var(--text)' }}>
                  {t('onboardingPrefsTitle')}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {t('onboardingPrefsDesc')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {QUICK_FILTERS.map((qf: QuickFilter) => {
                const active = onboardingSelection.includes(qf.key)
                return (
                  <button
                    key={qf.key}
                    onClick={() =>
                      setOnboardingSelection((prev) =>
                        prev.includes(qf.key) ? prev.filter((k) => k !== qf.key) : [...prev, qf.key]
                      )
                    }
                    className="relative rounded-2xl overflow-hidden transition-transform duration-200 hover:scale-[1.03]"
                    style={{ aspectRatio: '1 / 0.85' }}
                  >
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-2 transition-opacity duration-200"
                      style={{
                        background: `linear-gradient(135deg, ${qf.gradient[0]} 0%, ${qf.gradient[1]} 100%)`,
                        opacity: active ? 1 : 0.55,
                      }}
                    >
                      <span className="text-3xl leading-none">{qf.emoji}</span>
                      <span className="text-white text-xs font-extrabold text-center leading-tight px-1">
                        {t(qf.labelKey)}
                      </span>
                    </div>
                    {active && (
                      <>
                        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: '3px solid white' }} />
                        <div
                          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }}
                        >
                          <Check size={13} strokeWidth={3.5} style={{ color: qf.gradient[0] }} />
                        </div>
                      </>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  saveOnboardingPreferences(onboardingSelection)
                  if (onboardingSelection.length > 0) setSelectedQuickFilter(onboardingSelection[0])
                }}
                className="btn-primary px-6 py-2.5 rounded-xl font-semibold text-sm"
              >
                Devam Et
              </button>
              <button
                onClick={() => saveOnboardingPreferences([])}
                className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-muted)' }}
              >
                {t('skip')}
              </button>
            </div>
          </div>
        )}

        {/* ── Günün Menüsü ──────────────────────────── */}
        {dailyMenuRecipes.length > 0 && (
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
              </div>
            </div>
          </div>
        )}

        {/* ── Popüler Tarifler ─────────────────────────── */}
        {popularRecipes.length > 0 && (
          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)' }}>
              Popüler Tarifler
            </p>
            <div className="flex gap-3 overflow-x-auto scrollbar-hidden pb-1">
              {popularRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="flex-shrink-0 relative rounded-xl overflow-hidden group"
                  style={{ width: '190px', height: '150px' }}
                >
                  {recipe.photo ? (
                    <Image
                      src={recipe.photoThumb || recipe.photo}
                      alt={recipe.name}
                      fill
                      sizes="190px"
                      loading="lazy"
                      unoptimized={isPreOptimized(recipe.photoThumb || recipe.photo)}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
                    style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
                  >
                    ⭐ {recipe.rating}
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
                    <p className="text-white font-semibold text-xs leading-tight line-clamp-2">{recipe.name}</p>
                    <p className="text-white/60 text-[10px] mt-0.5">{recipe.country}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Haftanın Özel Derlemesi ─────────────────── */}
        {featuredCollection && (
          <Link
            href={`/koleksiyon/${featuredCollection.id}`}
            className="block mb-8 rounded-2xl overflow-hidden relative group"
            style={{ minHeight: '200px' }}
          >
            {featuredCollection.coverPhoto && (
              <Image
                src={featuredCollection.coverPhoto}
                alt={featuredCollection.title}
                fill
                sizes="100vw"
                unoptimized={isPreOptimized(featuredCollection.coverPhoto)}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(185,122,26,0.92) 0%, rgba(217,149,32,0.75) 100%)' }}
            />
            <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-center" style={{ minHeight: '200px' }}>
              <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                {t('weeklyCollectionTitle')}
              </span>
              <p className="font-display font-bold text-2xl sm:text-3xl text-white mb-1">{featuredCollection.title}</p>
              {featuredCollection.subtitle && (
                <p className="text-sm text-white/85 max-w-md">{featuredCollection.subtitle}</p>
              )}
            </div>
          </Link>
        )}

        {/* ── Yöresel Keşif ────────────────────────────── */}
        {regionalCollections.length > 0 && (
          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)' }}>
              {t('regionalDiscoveryTitle')}
            </p>
            <div className="flex gap-3 overflow-x-auto scrollbar-hidden pb-1">
              {regionalCollections.map((c) => (
                <Link
                  key={c.id}
                  href={`/koleksiyon/${c.id}`}
                  className="flex-shrink-0 relative rounded-xl overflow-hidden group"
                  style={{ width: '220px', height: '140px' }}
                >
                  {c.coverPhoto ? (
                    <Image
                      src={c.coverPhoto}
                      alt={c.title}
                      fill
                      sizes="220px"
                      unoptimized={isPreOptimized(c.coverPhoto)}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: 'linear-gradient(145deg, #8B4513, #A0522D)' }} />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
                    <p className="text-white font-semibold text-sm leading-tight line-clamp-2">{c.title}</p>
                    <p className="text-white/70 text-[10px] mt-0.5">{c.region}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Reklam ────────────────────────────────────── */}
        <div className="mb-8">
          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME} label="Ana Sayfa Reklamı" />
        </div>

        {/* ── En Güncel Yazılar ────────────────────────── */}
        {latestPosts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                En Güncel Yazılar
              </p>
              <Link href="/blog" className="text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>
                Tüm Yazılar →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hidden pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="flex-shrink-0 w-[220px] sm:w-auto rounded-2xl overflow-hidden card-hover group"
                  style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
                >
                  <div className="relative w-full" style={{ aspectRatio: '3 / 2' }}>
                    {post.coverPhoto ? (
                      <Image
                        src={post.coverPhoto}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 220px, (max-width: 1024px) 50vw, 25vw"
                        loading="lazy"
                        unoptimized={isPreOptimized(post.coverPhoto)}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(145deg, #B97A1A, #D99520)' }}>
                        📝
                      </div>
                    )}
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-display font-bold text-sm mb-1 leading-snug line-clamp-2" style={{ color: 'var(--text)' }}>
                      {post.title}
                    </h3>
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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
              onClick={() => { setSelectedContinent('all'); setSelectedCategory('all'); setSelectedQuickFilter(null) }}
              className="text-xs underline underline-offset-2 hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-muted)' }}
            >
              Temizle
            </button>
          </div>
        )}

        {/* ── Recipe grid ───────────────────────────── */}
        {filtered.length === 0 ? (
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

              {/* ── Ekosistem senkron bandı (Whisk modeli) ── */}
              {(!user || user.isAnonymous) && (
                <div
                  className="mt-10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5"
                  style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
                >
                  <div className="text-center sm:text-left">
                    <p className="font-display font-bold text-lg sm:text-xl text-white mb-1">
                      {t('ecosystemSyncBannerTitle')}
                    </p>
                    <p className="text-sm text-white/85">{t('ecosystemSyncBannerDesc')}</p>
                  </div>
                  <Link
                    href="/login"
                    className="flex-shrink-0 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap"
                    style={{ backgroundColor: 'white', color: '#B97A1A' }}
                  >
                    Giriş Yap
                  </Link>
                </div>
              )}
            </>
          )
        })()}
      </div>
    </div>
  )
}
