'use client'

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, ArrowLeft } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { useAllRecipes } from '@/hooks/useAllRecipes'
import RecipeCard from '@/components/RecipeCard'

function AramaContent() {
  const { t, favorites, toggleFavorite } = useApp()
  const { allRecipes } = useAllRecipes()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const url = debouncedQuery.trim() ? `/arama?q=${encodeURIComponent(debouncedQuery.trim())}` : '/arama'
    router.replace(url)
  }, [debouncedQuery, router])

  const favSet = useMemo(() => new Set(favorites), [favorites])

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (q.length < 2) return []
    return allRecipes.filter((r) => {
      if (r.name.toLowerCase().includes(q)) return true
      if (r.country?.toLowerCase().includes(q)) return true
      if (r.ingredients?.some((ing: { name: string }) => ing.name.toLowerCase().includes(q))) return true
      return false
    })
  }, [debouncedQuery, allRecipes])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={15} />
        Ana Sayfa
      </Link>

      {/* Search input */}
      <div
        className="flex items-center gap-3 px-5 py-4 rounded-2xl mb-8"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <Search size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchRecipes')}
          autoCorrect="off"
          spellCheck={false}
          className="flex-1 bg-transparent text-lg outline-none"
          style={{ color: 'var(--text)' }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 rounded-lg transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results */}
      {query.trim().length < 2 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4"
            style={{ backgroundColor: 'var(--primary-dim)' }}
          >
            🔍
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            Tarif adı, ülke veya malzeme yazın
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4"
            style={{ backgroundColor: 'var(--border)' }}
          >
            😕
          </div>
          <p className="text-lg font-display font-bold mb-1" style={{ color: 'var(--text)' }}>
            {t('noResults')}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            &ldquo;{query}&rdquo; için sonuç bulunamadı
          </p>
        </div>
      ) : (
        <>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}
          >
            {results.length} sonuç
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((recipe) => (
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
    </div>
  )
}

export default function AramaPage() {
  return (
    <Suspense fallback={null}>
      <AramaContent />
    </Suspense>
  )
}
