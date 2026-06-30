'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, ChevronRight, ChevronDown } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const staticRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

const STATUS_INFO: Record<string, { label: string; bg: string; color: string }> = {
  published: { label: 'Yayında',       bg: 'rgba(34,197,94,0.12)',  color: '#16a34a' },
  approved:  { label: 'Onaylı',        bg: 'rgba(34,197,94,0.12)',  color: '#16a34a' },
  pending:   { label: 'Onay Bekliyor', bg: 'rgba(234,179,8,0.12)', color: '#a16207' },
  draft:     { label: 'Taslak',        bg: 'rgba(148,163,184,0.15)',color: '#64748b' },
  static:    { label: 'Statik',        bg: 'rgba(185,122,26,0.12)', color: '#B97A1A' },
  inactive:  { label: 'Pasif',         bg: 'rgba(239,68,68,0.12)',  color: '#dc2626' },
}

interface Row extends Recipe { _source: 'static' | 'firebase' }

export default function AdminRecipesPage() {
  const [firestoreRecipes, setFirestoreRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'static' | 'firebase'>('all')

  useEffect(() => {
    getDocs(collection(db, 'recipes'))
      .then((snap) => setFirestoreRecipes(snap.docs.map((d) => ({ ...d.data(), id: d.id } as Recipe))))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const allRows = useMemo<Row[]>(() => {
    const overriddenIds = new Set(
      firestoreRecipes
        .filter((r: any) => r.overridesStaticId != null)
        .map((r: any) => String(r.overridesStaticId))
    )
    const staticRows: Row[] = staticRecipes
      .filter((r) => !overriddenIds.has(String(r.id)))
      .map((r) => ({ ...r, _source: 'static' }))
    const fbRows: Row[] = firestoreRecipes.map((r) => ({ ...r, _source: 'firebase' }))
    return [...staticRows, ...fbRows]
  }, [firestoreRecipes])

  const filtered = useMemo(() => allRows.filter((r) => {
    const q = search.toLocaleLowerCase('tr')
    return (
      (!q || r.name.toLocaleLowerCase('tr').includes(q) || r.country?.toLocaleLowerCase('tr').includes(q)) &&
      (sourceFilter === 'all' || r._source === sourceFilter)
    )
  }), [allRows, search, sourceFilter])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Tarif Yönetimi</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {loading ? 'Yükleniyor...' : `${allRows.length} tarif · ${staticRecipes.length} statik + ${firestoreRecipes.length} Firebase`}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tarif veya ülke ara..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
        <div className="relative">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as any)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm outline-none"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            <option value="all">Tümü ({allRows.length})</option>
            <option value="static">Statik ({staticRecipes.length})</option>
            <option value="firebase">Firebase ({firestoreRecipes.length})</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton h-14 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <p className="text-4xl mb-3">🍽️</p>
          <p className="text-sm">Tarif bulunamadı.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
          {filtered.map((recipe, i) => {
            const statusKey = recipe._source === 'static' ? 'static' : (recipe.status || 'draft')
            const si = STATUS_INFO[statusKey] || STATUS_INFO.draft
            const href = recipe._source === 'firebase'
              ? `/admin/recipes/${recipe.id}`
              : `/admin/recipes/static-${recipe.id}`

            return (
              <Link
                key={`${recipe._source}-${recipe.id}`}
                href={href}
                className="flex items-center gap-3 px-4 py-3.5 hover:opacity-80 transition-opacity"
                style={i > 0 ? { borderTop: '1px solid var(--border)' } : undefined}
              >
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{recipe.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{recipe.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{recipe.country} · {recipe.prepTime} dk · {recipe.calories} kal</p>
                </div>
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                  style={{ backgroundColor: si.bg, color: si.color }}>
                  {si.label}
                </span>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
