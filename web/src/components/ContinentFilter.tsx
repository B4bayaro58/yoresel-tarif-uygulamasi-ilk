'use client'

import React from 'react'
import clsx from 'clsx'
import { useApp } from '@/contexts/AppContext'
// @ts-ignore
import { CONTINENTS } from '@shared/continents'
// @ts-ignore
import { CATEGORIES } from '@shared/categories'
import { ContinentItem, CategoryItem } from '@/types'

interface ContinentFilterProps {
  selectedContinent: string
  selectedCategory: string
  onContinentChange: (continent: string) => void
  onCategoryChange: (category: string) => void
}

export default function ContinentFilter({
  selectedContinent,
  selectedCategory,
  onContinentChange,
  onCategoryChange,
}: ContinentFilterProps) {
  const { t } = useApp()

  const continents = [
    { id: 'all', emoji: '🌐', label: 'Tümü' },
    ...(CONTINENTS as ContinentItem[]).map((c) => ({
      id: c.id,
      emoji: c.emoji,
      label: t(`continent-${c.id}`),
    })),
  ]

  const categories = [
    { id: 'all', icon: '🍴', label: 'Tümü' },
    ...(CATEGORIES as CategoryItem[]).map((cat) => ({
      id: cat.id,
      icon: cat.icon,
      label: t(`category-${cat.id}`),
    })),
  ]

  return (
    <div className="space-y-4">
      {/* ── Section label ── */}
      <div>
        <p
          className="text-[11px] font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5"
          style={{ color: 'var(--text-muted)' }}
        >
          <span
            className="inline-block w-3 h-0.5 rounded-full"
            style={{ backgroundColor: 'var(--primary)' }}
          />
          {t('continentFilter')}
        </p>

        <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
          {continents.map((c) => {
            const active = selectedContinent === c.id
            return (
              <button
                key={c.id}
                onClick={() => onContinentChange(c.id)}
                className={clsx(
                  'flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap',
                  active ? 'text-white shadow-warm' : 'hover:opacity-80'
                )}
                style={
                  active
                    ? { background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }
                    : {
                        backgroundColor: 'var(--surface)',
                        color: 'var(--text)',
                        border: '1px solid var(--border)',
                      }
                }
              >
                <span className="text-base leading-none">{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Category filter ── */}
      <div>
        <p
          className="text-[11px] font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5"
          style={{ color: 'var(--text-muted)' }}
        >
          <span
            className="inline-block w-3 h-0.5 rounded-full"
            style={{ backgroundColor: 'var(--primary)' }}
          />
          {t('categoryFilter')}
        </p>

        <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={clsx(
                  'flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap',
                  active ? 'text-white shadow-warm' : 'hover:opacity-80'
                )}
                style={
                  active
                    ? { background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }
                    : {
                        backgroundColor: 'var(--surface)',
                        color: 'var(--text)',
                        border: '1px solid var(--border)',
                      }
                }
              >
                <span className="text-base leading-none">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
