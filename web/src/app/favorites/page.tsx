'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { Heart, LogIn } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import RecipeCard from '@/components/RecipeCard'
import { Recipe } from '@/types'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const localRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

export default function FavoritesPage() {
  const { favorites, toggleFavorite, t } = useApp()
  const { user } = useAuth()

  const favoriteRecipes = useMemo(
    () => localRecipes.filter((r) => favorites.includes(r.id)),
    [favorites]
  )

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
          style={{ backgroundColor: 'var(--primary-dim)' }}
        >
          ❤️
        </div>
        <h2 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text)' }}>
          Favorilerinizi Görüntüleyin
        </h2>
        <p className="text-sm text-center mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
          Favori tariflerinizi kaydetmek ve görüntülemek için giriş yapın.
        </p>
        <Link
          href="/login"
          className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm"
        >
          <LogIn size={15} />
          Giriş Yap
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
        >
          ❤️
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>
            {t('favorites')}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {favoriteRecipes.length} favori tarif
          </p>
        </div>
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4"
            style={{ backgroundColor: 'var(--border)' }}
          >
            <Heart size={36} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>
            Henüz favori tarif yok
          </p>
          <p className="text-sm text-center mb-6" style={{ color: 'var(--text-muted)' }}>
            Tariflerdeki ❤️ butonuna tıklayarak favorilerinize ekleyin
          </p>
          <Link
            href="/"
            className="btn-primary px-6 py-3 rounded-2xl font-semibold text-sm"
          >
            Tarifleri Keşfet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} isFav={true} onFavoriteToggle={toggleFavorite} />
          ))}
        </div>
      )}
    </div>
  )
}
