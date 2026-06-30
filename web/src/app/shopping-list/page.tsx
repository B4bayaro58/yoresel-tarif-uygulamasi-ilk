'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { ShoppingCart, Trash2, CheckSquare, Square, X } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { ShoppingItem } from '@/types'
import AdBanner from '@/components/AdBanner'

export default function ShoppingListPage() {
  const { t, shoppingList, toggleShoppingItem, removeShoppingItem, clearShoppingList } = useApp()

  const grouped = useMemo(() => {
    const map = new Map<string, { recipeName: string; items: ShoppingItem[] }>()
    shoppingList.forEach((item) => {
      if (!map.has(item.recipeId)) map.set(item.recipeId, { recipeName: item.recipeName, items: [] })
      map.get(item.recipeId)!.items.push(item)
    })
    return Array.from(map.entries())
  }, [shoppingList])

  const checkedCount = shoppingList.filter((i) => i.checked).length
  const totalCount = shoppingList.length
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0

  return (
    <div className="max-w-[1060px] mx-auto px-4 py-8">
      <div className="flex gap-6 items-start">

        {/* ── Sol dikey reklam — sadece geniş ekranlarda ── */}
        <aside className="hidden xl:flex flex-col items-center gap-4 flex-shrink-0" style={{ width: '160px', paddingTop: '8px' }}>
          <AdBanner size="skyscraper" />
        </aside>

        {/* ── Ana içerik ── */}
        <div className="flex-1 min-w-0 sm:px-2">
      {/* ── Page header ─────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
          >
            🛒
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>
              {t('shoppingList')}
            </h1>
            {totalCount > 0 && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {checkedCount}/{totalCount} tamamlandı
              </p>
            )}
          </div>
        </div>
        {totalCount > 0 && (
          <button
            onClick={clearShoppingList}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ color: '#C4593A', border: '1px solid rgba(196,89,58,0.25)', backgroundColor: 'rgba(196,89,58,0.06)' }}
          >
            <Trash2 size={13} />
            Temizle
          </button>
        )}
      </div>

      {/* ── Progress bar ─────────────────────────── */}
      {totalCount > 0 && (
        <div
          className="h-1.5 rounded-full mb-6 overflow-hidden"
          style={{ backgroundColor: 'var(--border)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #B97A1A 0%, #D99520 100%)',
            }}
          />
        </div>
      )}

      {/* ── Empty state ───────────────────────────── */}
      {totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
            style={{ backgroundColor: 'var(--border)' }}
          >
            <ShoppingCart size={36} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>
            Alışveriş listeniz boş
          </p>
          <p className="text-sm text-center mb-6" style={{ color: 'var(--text-muted)' }}>
            Tarif detay sayfasından malzemeleri listenize ekleyin
          </p>
          <Link
            href="/"
            className="btn-primary px-6 py-3 rounded-2xl font-semibold text-sm"
          >
            Tarifleri Keşfet
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {grouped.map(([recipeId, group]) => (
            <div
              key={recipeId}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
              }}
            >
              {/* Recipe header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
              >
                <Link
                  href={`/recipes/${recipeId}`}
                  className="text-sm font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--primary)' }}
                >
                  {group.recipeName}
                </Link>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {group.items.filter((i) => i.checked).length}/{group.items.length}
                </span>
              </div>

              {/* Items */}
              <div>
                {group.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3"
                    style={idx > 0 ? { borderTop: '1px solid var(--border)' } : undefined}
                  >
                    <button
                      onClick={() => toggleShoppingItem(item.id)}
                      className="flex-shrink-0 transition-all hover:scale-110"
                      style={{ color: item.checked ? '#22c55e' : 'var(--border)' }}
                    >
                      {item.checked ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate transition-all"
                        style={{
                          color: item.checked ? 'var(--text-muted)' : 'var(--text)',
                          textDecoration: item.checked ? 'line-through' : 'none',
                          opacity: item.checked ? 0.6 : 1,
                        }}
                      >
                        {item.ingredientName}
                      </p>
                    </div>
                    <span
                      className="text-xs font-semibold flex-shrink-0"
                      style={{ color: item.checked ? 'var(--text-muted)' : 'var(--primary)', opacity: item.checked ? 0.5 : 1 }}
                    >
                      {item.amount}
                    </span>
                    <button
                      onClick={() => removeShoppingItem(item.id)}
                      className="flex-shrink-0 p-1 rounded-lg transition-all hover:opacity-70"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {checkedCount === totalCount && totalCount > 0 && (
            <div
              className="text-center py-6 rounded-2xl animate-fade-in"
              style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <p className="text-3xl mb-2">🎉</p>
              <p className="font-semibold" style={{ color: '#16a34a' }}>
                Harika! Tüm malzemeleri aldınız.
              </p>
            </div>
          )}
        </div>
      )}
        </div>{/* /Ana içerik */}

        {/* ── Sağ dikey reklam — sadece geniş ekranlarda ── */}
        <aside className="hidden xl:flex flex-col items-center gap-4 flex-shrink-0" style={{ width: '160px', paddingTop: '8px' }}>
          <AdBanner size="skyscraper" />
        </aside>

      </div>
    </div>
  )
}
