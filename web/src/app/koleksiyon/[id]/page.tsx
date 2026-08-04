'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { useAllRecipes } from '@/hooks/useAllRecipes'
import { getCollectionById, EditorialCollection } from '@/lib/collections'
import { isPreOptimized } from '@/lib/image'
import RecipeCard from '@/components/RecipeCard'

export default function CollectionDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { favorites, toggleFavorite } = useApp()
  const { allRecipes } = useAllRecipes()

  const [collection, setCollection] = useState<EditorialCollection | null | undefined>(undefined)

  useEffect(() => {
    if (id) getCollectionById(id).then(setCollection)
  }, [id])

  const favSet = useMemo(() => new Set(favorites), [favorites])

  // Koleksiyon `recipeIds`'i statik slug veya override edilmiş bir tarifin
  // kendi Firestore id'si olabilir — Günlük Menü / Kişisel Menü ile aynı
  // çift-arama fallback'i (bkz. web/src/app/admin/daily-menu/page.tsx).
  const recipes = useMemo(() => {
    if (!collection) return []
    return collection.recipeIds
      .map((rid) =>
        allRecipes.find((r) => String(r.id) === rid) ||
        allRecipes.find((r) => String((r as any).overridesStaticId) === rid)
      )
      .filter(Boolean)
  }, [collection, allRecipes])

  if (collection === undefined) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="skeleton rounded-3xl mb-6" style={{ height: '220px' }} />
      </div>
    )
  }

  if (collection === null) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-lg font-display font-bold" style={{ color: 'var(--text)' }}>Koleksiyon bulunamadı</p>
        <Link href="/" className="text-sm underline mt-2 inline-block" style={{ color: 'var(--primary)' }}>Ana sayfaya dön</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="relative overflow-hidden" style={{ minHeight: '260px' }}>
        {collection.coverPhoto && (
          <Image
            src={collection.coverPhoto}
            alt={collection.title}
            fill
            sizes="100vw"
            priority
            unoptimized={isPreOptimized(collection.coverPhoto)}
            className="object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(185,122,26,0.92) 0%, rgba(217,149,32,0.75) 100%)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col justify-end" style={{ minHeight: '260px' }}>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium mb-4 text-white/90 hover:text-white w-fit">
            <ArrowLeft size={15} />
            Ana Sayfa
          </Link>
          {collection.region && (
            <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">{collection.region}</span>
          )}
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">{collection.title}</h1>
          {collection.subtitle && <p className="text-white/85 max-w-xl">{collection.subtitle}</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {recipes.length === 0 ? (
          <p className="text-sm text-center py-16" style={{ color: 'var(--text-muted)' }}>Bu koleksiyonda henüz tarif yok.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recipes.map((recipe: any) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFav={favSet.has(recipe.id)}
                onFavoriteToggle={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
