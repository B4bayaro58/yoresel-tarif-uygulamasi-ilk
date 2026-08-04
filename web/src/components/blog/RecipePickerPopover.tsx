'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Search, UtensilsCrossed } from 'lucide-react'
import { collection, getDocs, orderBy, query, documentId, limit } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const staticRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

// Tüm katalog (statik + Firestore) yalnızca popover ilk açıldığında, bir kez
// çekilir ve modül-seviyeli bir değişkende önbelleğe alınır — aynı admin
// oturumunda tekrar tekrar açılıp kapansa da ikinci bir sorgu atılmaz
// (bkz. admin/daily-menu/page.tsx'teki aynı tek-seferlik-sorgu deseni).
let cachedCatalog: Recipe[] | null = null

async function loadCatalog(): Promise<Recipe[]> {
  if (cachedCatalog) return cachedCatalog
  const snap = await getDocs(query(collection(db, 'recipes'), orderBy(documentId()), limit(3000)))
  const firestoreRecipes = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Recipe)
  const overriddenIds = new Set(
    firestoreRecipes.filter((r: any) => r.overridesStaticId != null).map((r: any) => String(r.overridesStaticId))
  )
  const map = new Map<string, Recipe>()
  staticRecipes.filter((r) => !overriddenIds.has(String(r.id))).forEach((r) => map.set(String(r.id), r))
  firestoreRecipes.forEach((r) => map.set(String(r.id), r))
  cachedCatalog = Array.from(map.values())
  return cachedCatalog
}

interface RecipePickerPopoverProps {
  onSelect: (recipeId: string) => void
  onClose: () => void
}

export default function RecipePickerPopover({ onSelect, onClose }: RecipePickerPopoverProps) {
  const [catalog, setCatalog] = useState<Recipe[] | null>(null)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { loadCatalog().then(setCatalog) }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const results = (catalog || []).filter((r) => r.name.toLowerCase().includes(search.toLowerCase())).slice(0, 30)

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 w-80 rounded-2xl overflow-hidden z-30 animate-slide-down"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 12px 40px rgba(28,18,10,0.18)' }}
    >
      <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tarif ara..."
            className="w-full pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {catalog === null ? (
          <p className="text-xs text-center py-6" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</p>
        ) : results.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: 'var(--text-muted)' }}>Sonuç yok</p>
        ) : (
          results.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => onSelect(String(recipe.id))}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:opacity-80 transition-opacity"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <span className="text-lg flex-shrink-0">{recipe.emoji || <UtensilsCrossed size={16} />}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{recipe.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{recipe.country}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
