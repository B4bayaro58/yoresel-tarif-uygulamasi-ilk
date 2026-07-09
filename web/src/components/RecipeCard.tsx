'use client'

import React, { useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Clock, Users, Flame, Star } from 'lucide-react'
import clsx from 'clsx'
import { Recipe } from '@/types'
import { useApp } from '@/contexts/AppContext'
import { isPreOptimized } from '@/lib/image'

interface RecipeCardProps {
  recipe: Recipe
  isFav?: boolean
  onFavoriteToggle?: (recipeId: string) => void
}

const DIFFICULTY_STYLE = {
  easy:   { bg: 'rgba(34,197,94,0.12)',  color: '#16a34a', label: '' },
  medium: { bg: 'rgba(234,179,8,0.12)',  color: '#a16207', label: '' },
  hard:   { bg: 'rgba(239,68,68,0.12)',  color: '#dc2626', label: '' },
}

function MiniStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={10}
          className={s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}
        />
      ))}
      <span className="ml-1 text-[11px] text-white/80 font-medium">{rating.toFixed(1)}</span>
    </div>
  )
}

function RecipeCard({ recipe, isFav = false, onFavoriteToggle }: RecipeCardProps) {
  const { t } = useApp()

  const diff = DIFFICULTY_STYLE[recipe.difficulty as keyof typeof DIFFICULTY_STYLE] || DIFFICULTY_STYLE.medium
  const difficultyLabel =
    recipe.difficulty === 'easy'
      ? t('difficulty-easy')
      : recipe.difficulty === 'medium'
      ? t('difficulty-medium')
      : t('difficulty-hard')

  const handleFavClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavoriteToggle?.(recipe.id)
  }, [recipe.id, onFavoriteToggle])

  return (
    <Link href={`/recipes/${recipe.id}`} className="block group">
      <article
        className="rounded-2xl overflow-hidden card-hover"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* ── Image area (cinematic 3:2 ratio) ──────── */}
        <div className="relative overflow-hidden" style={{ height: '210px' }}>
          {recipe.photo ? (
            <Image
              src={recipe.photo}
              alt={recipe.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              loading="lazy"
              unoptimized={isPreOptimized(recipe.photo)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
              style={{
                background: `linear-gradient(145deg, ${recipe.gradient?.[0] ?? '#B97A1A'}, ${recipe.gradient?.[1] ?? '#D99520'})`,
              }}
            >
              <span style={{ fontSize: '64px', lineHeight: 1 }}>{recipe.emoji}</span>
            </div>
          )}

          {/* Gradient overlay — bottom heavy */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0) 100%)',
            }}
          />

          {/* Country chip — top left */}
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            {recipe.country}{recipe.city ? ` · ${recipe.city}` : ''}
          </div>

          {/* Favorite button — top right */}
          <button
            onClick={handleFavClick}
            className={clsx(
              'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
              isFav
                ? 'text-white shadow-warm'
                : 'backdrop-blur-sm text-white hover:scale-110'
            )}
            style={
              isFav
                ? { background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }
                : { backgroundColor: 'rgba(0,0,0,0.3)' }
            }
            aria-label={isFav ? t('removeFromFavorites') : t('addToFavorites')}
          >
            <Heart size={14} className={isFav ? 'fill-white' : ''} />
          </button>

          {/* Bottom overlay — recipe info */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-6">
            <MiniStars rating={recipe.rating} />
            <h3
              className="font-display font-bold text-white leading-tight line-clamp-1 mt-1"
              style={{ fontSize: '15px' }}
            >
              {recipe.name}
            </h3>
          </div>
        </div>

        {/* ── Card body ─────────────────────────────── */}
        <div className="px-3 py-2.5 flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <Clock size={11} />
              <span>{recipe.prepTime}{t('minutes')[0]}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <Users size={11} />
              <span>{recipe.servings}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <Flame size={11} />
              <span>{recipe.calories}</span>
            </div>
          </div>

          {/* Difficulty badge */}
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: diff.bg, color: diff.color }}
          >
            {difficultyLabel}
          </span>
        </div>
      </article>
    </Link>
  )
}

export default React.memo(RecipeCard)
