'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, X, Search, Save, CalendarDays } from 'lucide-react'
import {
  doc, getDoc, setDoc, getDocs, collection, query, where, serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const staticRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

export default function AdminDailyMenuPage() {
  const [menuIds, setMenuIds] = useState<string[]>([])
  const [firestoreRecipes, setFirestoreRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        const [menuSnap, recipeSnap] = await Promise.all([
          getDoc(doc(db, 'settings', 'dailyMenu')),
          getDocs(query(collection(db, 'recipes'), where('status', '==', 'published'))),
        ])
        if (menuSnap.exists()) {
          setMenuIds(menuSnap.data().recipeIds || [])
        }
        setFirestoreRecipes(recipeSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Recipe)))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const allRecipes = useMemo(() => {
    const overriddenIds = new Set(
      firestoreRecipes
        .filter((r: any) => r.overridesStaticId != null)
        .map((r: any) => String(r.overridesStaticId))
    )
    const map = new Map<string, Recipe>()
    staticRecipes
      .filter((r) => !overriddenIds.has(String(r.id)))
      .forEach((r) => map.set(String(r.id), r))
    firestoreRecipes.forEach((r) => map.set(String(r.id), r))
    return Array.from(map.values())
  }, [firestoreRecipes])

  // Override edilmiş statik tarifler allRecipes'te kendi Firestore ID'siyle
  // duruyor, statik slug (ör. "lasagna") artık haritada yok — overridesStaticId
  // fallback'i olmadan bu tarifler "kayıp" görünüyordu (bkz. 2026-07-10 canlı
  // hata raporu, aynı kök neden anasayfadaki Günün Menüsü hatasıyla ortak).
  const menuRecipes = useMemo(
    () => menuIds.map((id) =>
      allRecipes.find((r) => String(r.id) === id) ||
      allRecipes.find((r) => String((r as any).overridesStaticId) === id)
    ).filter(Boolean) as Recipe[],
    [menuIds, allRecipes]
  )

  const available = useMemo(() => {
    return allRecipes.filter(
      (r) =>
        !menuIds.includes(String(r.id)) &&
        !menuIds.includes(String((r as any).overridesStaticId)) &&
        r.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [allRecipes, menuIds, search])

  const addToMenu = (recipe: Recipe) => {
    const canonicalId = (recipe as any).overridesStaticId != null
      ? String((recipe as any).overridesStaticId)
      : String(recipe.id)
    setMenuIds((prev) => [...prev, canonicalId])
  }

  const removeFromMenu = (id: string) => {
    setMenuIds((prev) => prev.filter((i) => i !== id))
  }

  const save = async () => {
    setSaving(true)
    setSaveError(false)
    try {
      await setDoc(doc(db, 'settings', 'dailyMenu'), {
        recipeIds: menuIds,
        updatedAt: serverTimestamp(),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      console.error(e)
      setSaveError(true)
      setTimeout(() => setSaveError(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Günlük Menü</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Öne çıkan tarifleri belirleyin</p>
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving || loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          style={
            saveError
              ? { backgroundColor: '#C4593A' }
              : saved
              ? { backgroundColor: '#16a34a' }
              : { background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }
          }
        >
          <Save size={14} />
          {saveError ? '✗ Hata oluştu' : saved ? '✓ Kaydedildi' : saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-14 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Current menu */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays size={15} style={{ color: 'var(--primary)' }} />
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                Günlük Menüde ({menuRecipes.length} tarif)
              </h2>
            </div>
            {menuRecipes.length === 0 ? (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Henüz tarif eklenmedi.</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Sağdan tarif seçin</p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                {menuRecipes.map((recipe, i) => (
                  <div
                    key={recipe.id}
                    className="flex items-center gap-3 px-4 py-3"
                    style={i > 0 ? { borderTop: '1px solid var(--border)' } : undefined}
                  >
                    <span style={{ fontSize: '22px' }}>{recipe.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{recipe.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{recipe.country}</p>
                    </div>
                    <button
                      onClick={() => removeFromMenu(
                        (recipe as any).overridesStaticId != null
                          ? String((recipe as any).overridesStaticId)
                          : String(recipe.id)
                      )}
                      className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
                      style={{ color: '#C4593A' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available recipes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Tarifler</h2>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}>
                {available.length}
              </span>
            </div>
            <div className="relative mb-3">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tarif ara..."
                className="w-full pl-8 pr-4 py-2 rounded-xl text-sm outline-none"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div
              className="rounded-2xl overflow-hidden overflow-y-auto"
              style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)', maxHeight: '480px' }}
            >
              {available.slice(0, 50).map((recipe, i) => (
                <button
                  key={recipe.id}
                  onClick={() => addToMenu(recipe)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:opacity-80 transition-opacity"
                  style={i > 0 ? { borderTop: '1px solid var(--border)' } : undefined}
                >
                  <span style={{ fontSize: '22px' }}>{recipe.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{recipe.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{recipe.country}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}>
                    + Ekle
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
