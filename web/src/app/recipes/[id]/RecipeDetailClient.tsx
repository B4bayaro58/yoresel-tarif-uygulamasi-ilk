'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Clock,
  Users,
  Flame,
  Star,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  List,
  LayoutGrid,
} from 'lucide-react'
import clsx from 'clsx'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useApp } from '@/contexts/AppContext'
import { Recipe, ShoppingItem } from '@/types'
import ReviewsSection from '@/components/ReviewsSection'
import { isPreOptimized } from '@/lib/image'
import { getOverrideRecipe } from '@/lib/overridePhoto'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const localRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

const DIFFICULTY_STYLE = {
  easy:   { bg: 'rgba(34,197,94,0.12)',  color: '#16a34a' },
  medium: { bg: 'rgba(234,179,8,0.12)',  color: '#a16207' },
  hard:   { bg: 'rgba(239,68,68,0.12)',  color: '#dc2626' },
}

interface RecipeDetailClientProps {
  // Sunucuda (page.tsx) zaten çözülmüş tarif -- override farkındalıklı aynı
  // mantık artık orada da çalışıyor (bkz. fetchRecipe/getOverrideRecipe).
  // Verilmişse burada ikinci bir Firestore okuması yapılmaz. `undefined`
  // (prop hiç verilmemiş) eski client-fetch davranışına düşer; `null` ise
  // sunucu da tarifi bulamadı demektir.
  initialRecipe?: Recipe | null
}

export default function RecipeDetailClient({ initialRecipe }: RecipeDetailClientProps) {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const { t, favorites, toggleFavorite, addToShoppingList } = useApp()

  const [recipe, setRecipe] = useState<Recipe | null>(initialRecipe ?? null)
  const [loading, setLoading] = useState(initialRecipe === undefined)
  const [expandedIngredient, setExpandedIngredient] = useState<number | null>(null)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [addedToList, setAddedToList] = useState(false)
  const [stepViewMode, setStepViewMode] = useState<'swipe' | 'list'>('swipe')
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const stepScrollRef = useRef<HTMLDivElement>(null)

  const isFav = recipe ? favorites.includes(recipe.id) : false
  const ingredients = recipe?.ingredients || []
  const steps = recipe?.steps || []

  useEffect(() => {
    if (initialRecipe !== undefined) return // sunucu zaten çözdü, tekrar sorgulamaya gerek yok

    const load = async () => {
      const local = localRecipes.find((r) => r.id === id)
      try {
        if (local) {
          // Statik bir tarif id'si (ör. "lasagna") hiçbir zaman gerçek bir
          // Firestore doküman id'si olamaz (onlar rastgele string) — bu yüzden
          // garanti-boş dönecek bir getDoc denemek yerine doğrudan paylaşılan
          // override önbelleğine bakılıyor. Kart listesinde (RecipeCard) bu
          // tarif zaten kaydırılarak görülmüşse burada ikinci bir Firestore
          // okuması bile yapılmaz (bkz. @/lib/overridePhoto).
          const override = await getOverrideRecipe(id)
          setRecipe(override ?? local)
          setLoading(false)
          return
        }

        // Statik katalogda yoksa gerçek bir Firestore doküman id'si olmalı
        // (native tarif ya da override'ın kendi id'si üzerinden erişim)
        const snap = await getDoc(doc(db, 'recipes', id))
        if (snap.exists()) {
          setRecipe({ id: snap.id, ...snap.data() } as Recipe)
          setLoading(false)
          return
        }
      } catch { /* ignore */ }

      setLoading(false)
    }
    if (id) load()
  }, [id, initialRecipe])

  const handleAddAllToShoppingList = () => {
    if (!recipe) return
    const items: ShoppingItem[] = ingredients.map((ing, i) => ({
      id: `${recipe.id}-${i}-${Date.now()}`,
      recipeId: recipe.id,
      recipeName: recipe.name,
      ingredientName: ing.name,
      amount: ing.amount,
      checked: false,
    }))
    addToShoppingList(items)
    setAddedToList(true)
    setTimeout(() => setAddedToList(false), 3000)
  }

  const toggleStep = (i: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const goToStep = (index: number) => {
    if (index < 0 || index >= steps.length || !stepScrollRef.current) return
    const el = stepScrollRef.current
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
    setActiveStepIndex(index)
  }

  const handleStepScroll = () => {
    const el = stepScrollRef.current
    if (!el || el.clientWidth === 0) return
    setActiveStepIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="skeleton rounded-3xl mb-6" style={{ height: '320px' }} />
        <div className="space-y-3">
          <div className="skeleton h-8 rounded" style={{ width: '60%' }} />
          <div className="skeleton h-4 rounded" style={{ width: '35%' }} />
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4"
          style={{ backgroundColor: 'var(--border)' }}
        >
          🍽️
        </div>
        <p className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>Tarif bulunamadı</p>
        <Link href="/" className="text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>
          Ana sayfaya dön
        </Link>
      </div>
    )
  }

  const diff = DIFFICULTY_STYLE[recipe.difficulty as keyof typeof DIFFICULTY_STYLE] || DIFFICULTY_STYLE.medium
  const difficultyLabel =
    recipe.difficulty === 'easy' ? t('difficulty-easy')
    : recipe.difficulty === 'medium' ? t('difficulty-medium')
    : t('difficulty-hard')

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* ── Back button ────────────────────────── */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm mb-5 transition-opacity hover:opacity-70"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={15} />
        Geri Dön
      </button>

      {/* ── Hero image ─────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden mb-6" style={{ height: '340px' }}>
        {recipe.photo ? (
          <Image
            src={recipe.photo}
            alt={recipe.name}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            unoptimized={isPreOptimized(recipe.photo)}
            className="object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(145deg, ${recipe.gradient?.[0] ?? '#B97A1A'}, ${recipe.gradient?.[1] ?? '#D99520'})`,
            }}
          >
            <span style={{ fontSize: '100px', lineHeight: 1 }}>{recipe.emoji}</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0) 100%)' }}
        />

        {/* Favorite button */}
        <button
          onClick={() => toggleFavorite(recipe.id)}
          className={clsx(
            'absolute top-4 right-4 w-11 h-11 rounded-2xl flex items-center justify-center transition-all'
          )}
          style={
            isFav
              ? { background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)', boxShadow: '0 4px 16px rgba(185,122,26,0.4)' }
              : { backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }
          }
        >
          <Heart size={18} className={isFav ? 'fill-white text-white' : 'text-white'} />
        </button>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          {/* Stars */}
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={12} className={s <= Math.round(recipe.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'} />
            ))}
            <span className="ml-1.5 text-xs text-white/80">{recipe.rating.toFixed(1)}</span>
          </div>
          <h1 className="font-display font-bold text-white leading-tight mb-1" style={{ fontSize: '26px' }}>
            {recipe.name}
          </h1>
          <p className="text-white/75 text-sm">{recipe.country}{recipe.city ? ` · ${recipe.city}` : ''}</p>
        </div>
      </div>

      {/* ── Stats bar ──────────────────────────── */}
      <div
        className="grid grid-cols-4 gap-2 rounded-2xl p-4 mb-5"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
      >
        {[
          { icon: <Clock size={16} />, label: t('prepTime'), value: `${recipe.prepTime} ${t('minutes')}` },
          { icon: <Users size={16} />, label: t('servings'), value: `${recipe.servings} ${t('people')}` },
          { icon: <Flame size={16} />, label: t('calories'), value: `${recipe.calories}` },
          { icon: <Star size={16} className="text-yellow-400 fill-yellow-400" />, label: 'Puan', value: recipe.rating.toFixed(1) },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-1">
            <div style={{ color: 'var(--primary)' }}>{stat.icon}</div>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Action row ─────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <span
          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold"
          style={{ backgroundColor: diff.bg, color: diff.color }}
        >
          {t('difficulty')}: {difficultyLabel}
        </span>
        <button
          onClick={handleAddAllToShoppingList}
          className={clsx(
            'flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all',
            addedToList ? '' : 'btn-primary'
          )}
          style={
            addedToList
              ? { backgroundColor: 'rgba(34,197,94,0.12)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.25)' }
              : undefined
          }
        >
          <ShoppingCart size={14} />
          {addedToList ? '✓ Eklendi!' : t('addToShoppingList')}
        </button>
      </div>

      {/* ── Ingredients ────────────────────────── */}
      <section className="mb-6">
        <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
          🥕 {t('ingredients')}
        </h2>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
        >
          {ingredients.map((ing, i) => (
            <div key={i} style={i > 0 ? { borderTop: '1px solid var(--border)' } : undefined}>
              <div
                className="flex items-center justify-between px-4 py-3.5"
                style={{ cursor: ing.alternatives?.length ? 'pointer' : 'default' }}
                onClick={() =>
                  ing.alternatives?.length
                    ? setExpandedIngredient(expandedIngredient === i ? null : i)
                    : undefined
                }
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: 'var(--primary)' }}
                  />
                  <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                    {ing.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 pl-3">
                  <span className="text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--primary)' }}>
                    {ing.amount}
                  </span>
                  {ing.alternatives?.length ? (
                    expandedIngredient === i
                      ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
                      : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                  ) : null}
                </div>
              </div>

              {expandedIngredient === i && ing.alternatives?.length && (
                <div className="px-4 pb-3.5 pt-0" style={{ backgroundColor: 'var(--card)' }}>
                  <p className="text-xs mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                    Alternatifler:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ing.alternatives.map((alt: string, j: number) => (
                      <span
                        key={j}
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Equipment ──────────────────────────── */}
      {recipe.equipment?.length > 0 && (
        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--text)' }}>
            🔪 {t('equipment')}
          </h2>
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
          >
            <div className="flex flex-wrap gap-2">
              {recipe.equipment.map((eq, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  {eq}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Steps ─────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>
            📋 {t('steps')}
          </h2>
          {steps.length > 0 && (
            <button
              onClick={() => setStepViewMode(stepViewMode === 'swipe' ? 'list' : 'swipe')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ border: '1px solid var(--border)', color: 'var(--primary)' }}
            >
              {stepViewMode === 'swipe' ? <List size={14} /> : <LayoutGrid size={14} />}
              {t(stepViewMode === 'swipe' ? 'stepViewList' : 'stepViewSwipe')}
            </button>
          )}
        </div>

        {steps.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Bu tarif için yapılış adımları henüz eklenmedi.</p>
        )}

        {steps.length > 0 && stepViewMode === 'swipe' ? (
          <div>
            <p className="text-center text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
              {t('stepCounter').replace('{current}', String(activeStepIndex + 1)).replace('{total}', String(steps.length))}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToStep(activeStepIndex - 1)}
                disabled={activeStepIndex === 0}
                className="flex-shrink-0 p-2 rounded-full disabled:opacity-30 transition-opacity hover:opacity-70"
                style={{ border: '1px solid var(--border)' }}
                aria-label="Önceki adım"
              >
                <ChevronLeft size={18} style={{ color: 'var(--text)' }} />
              </button>

              <div
                ref={stepScrollRef}
                onScroll={handleStepScroll}
                className="flex-1 flex overflow-x-auto scrollbar-hidden"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {steps.map((step, i) => {
                  const done = completedSteps.has(i)
                  return (
                    <div
                      key={i}
                      className="w-full flex-shrink-0 flex flex-col justify-between p-6 rounded-2xl"
                      style={{
                        scrollSnapAlign: 'start',
                        minHeight: '260px',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow)',
                      }}
                    >
                      <p
                        className="text-lg leading-relaxed font-semibold"
                        style={{
                          color: done ? 'var(--text-muted)' : 'var(--text)',
                          textDecoration: done ? 'line-through' : 'none',
                        }}
                      >
                        {step}
                      </p>
                      <button
                        onClick={() => {
                          toggleStep(i)
                          if (!done) goToStep(i + 1)
                        }}
                        className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white mt-6 transition-opacity hover:opacity-90"
                        style={{ backgroundColor: done ? '#22c55e' : 'var(--primary)' }}
                      >
                        {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        {t(done ? 'completed' : 'step')} {i + 1}
                      </button>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={() => goToStep(activeStepIndex + 1)}
                disabled={activeStepIndex === steps.length - 1}
                className="flex-shrink-0 p-2 rounded-full disabled:opacity-30 transition-opacity hover:opacity-70"
                style={{ border: '1px solid var(--border)' }}
                aria-label="Sonraki adım"
              >
                <ChevronRight size={18} style={{ color: 'var(--text)' }} />
              </button>
            </div>
          </div>
        ) : steps.length > 0 ? (
          <div className="space-y-3">
            {steps.map((step, i) => {
              const done = completedSteps.has(i)
              return (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200"
                  style={
                    done
                      ? { backgroundColor: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }
                      : { backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }
                  }
                  onClick={() => toggleStep(i)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {done ? (
                      <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
                    ) : (
                      <Circle size={20} style={{ color: 'var(--border)' }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--primary)' }}>
                      {t('step')} {i + 1}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: done ? 'var(--text-muted)' : 'var(--text)',
                        textDecoration: done ? 'line-through' : 'none',
                      }}
                    >
                      {step}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}

        {/* Completion message */}
        {steps.length > 0 && completedSteps.size === steps.length && (
          <div
            className="mt-4 p-5 rounded-2xl text-center animate-fade-in"
            style={{ backgroundColor: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <p className="text-3xl mb-2">🎉</p>
            <p className="font-display font-bold text-lg" style={{ color: '#16a34a' }}>
              Tebrikler! Tarif tamamlandı.
            </p>
          </div>
        )}
      </section>

      <ReviewsSection recipe={recipe} />
    </div>
  )
}
