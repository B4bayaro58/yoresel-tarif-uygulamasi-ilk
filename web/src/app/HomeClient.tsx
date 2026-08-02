'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useApp } from '@/contexts/AppContext'
import RecipeCard from '@/components/RecipeCard'
import ContinentFilter from '@/components/ContinentFilter'
import { Recipe } from '@/types'
import { isPreOptimized } from '@/lib/image'

const PAGE_SIZE = 20

interface HomeClientProps {
  recipes: Recipe[]
  dailyMenuRecipes: Recipe[]
}

export default function HomeClient({ recipes, dailyMenuRecipes }: HomeClientProps) {
  const { t, favorites, toggleFavorite } = useApp()
  const [selectedContinent, setSelectedContinent] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (selectedContinent !== 'all' && r.continent !== selectedContinent) return false
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false
      return true
    })
  }, [recipes, selectedContinent, selectedCategory])

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
            Dünya&apos;nın<br />
            <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Lezzetleri</em>
          </h1>
          <p className="text-base mb-6 max-w-lg" style={{ color: 'var(--text-muted)' }}>
            Dünyanın dört bir yanından özenle derlenen lezzetleri keşfedin.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">

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
            </>
          )
        })()}
      </div>
    </div>
  )
}
