'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, X, Search, Save } from 'lucide-react'
import {
  doc, getDoc, setDoc, addDoc, collection, getDocs, query, orderBy, limit, startAfter,
  documentId, QueryDocumentSnapshot, DocumentData, serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const staticRecipes: Recipe[] = (RECIPES_DATA as any).tr || []
const PAGE_SIZE = 3000
const PUBLIC_STATUSES = ['published', 'approved']

export default function AdminCollectionEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const isNew = id === 'new'

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [coverPhoto, setCoverPhoto] = useState('')
  const [region, setRegion] = useState('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [recipeIds, setRecipeIds] = useState<string[]>([])

  const [firestoreRecipes, setFirestoreRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        if (!isNew) {
          const snap = await getDoc(doc(db, 'collections', id))
          if (snap.exists()) {
            const data = snap.data()
            setTitle(data.title || '')
            setSubtitle(data.subtitle || '')
            setCoverPhoto(data.coverPhoto || '')
            setRegion(data.region || '')
            setOrder(data.order ?? 0)
            setIsActive(data.isActive ?? true)
            setRecipeIds(data.recipeIds || [])
          }
        }

        const recipeSnap = await getDocs(query(collection(db, 'recipes'), orderBy(documentId()), limit(PAGE_SIZE)))
        setFirestoreRecipes(recipeSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Recipe))
        lastDocRef.current = recipeSnap.docs[recipeSnap.docs.length - 1] ?? null
        setHasMore(recipeSnap.docs.length === PAGE_SIZE)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [id, isNew])

  const loadMoreRecipes = async () => {
    if (!lastDocRef.current) return
    setLoadingMore(true)
    try {
      const snap = await getDocs(query(
        collection(db, 'recipes'), orderBy(documentId()), startAfter(lastDocRef.current), limit(PAGE_SIZE)
      ))
      setFirestoreRecipes((prev) => [...prev, ...snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Recipe)])
      lastDocRef.current = snap.docs[snap.docs.length - 1] ?? null
      setHasMore(snap.docs.length === PAGE_SIZE)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingMore(false)
    }
  }

  // Aynı statik+override birleştirme deseni admin/daily-menu/page.tsx'te de kullanılıyor.
  const allRecipes = useMemo(() => {
    const overriddenIds = new Set(
      firestoreRecipes.filter((r: any) => r.overridesStaticId != null).map((r: any) => String(r.overridesStaticId))
    )
    const displayable = firestoreRecipes.filter((r: any) => PUBLIC_STATUSES.includes(r.status) || r.overridesStaticId == null)
    const map = new Map<string, Recipe>()
    staticRecipes.filter((r) => !overriddenIds.has(String(r.id))).forEach((r) => map.set(String(r.id), r))
    displayable.forEach((r) => map.set(String(r.id), r))
    return Array.from(map.values())
  }, [firestoreRecipes])

  const selectedRecipes = useMemo(
    () => recipeIds.map((rid) => allRecipes.find((r) => String(r.id) === rid)).filter(Boolean) as Recipe[],
    [recipeIds, allRecipes]
  )

  const available = useMemo(() => {
    return allRecipes.filter((r) => !recipeIds.includes(String(r.id)) && r.name.toLowerCase().includes(search.toLowerCase()))
  }, [allRecipes, recipeIds, search])

  const addRecipe = (recipe: Recipe) => setRecipeIds((prev) => [...prev, String(recipe.id)])
  const removeRecipe = (rid: string) => setRecipeIds((prev) => prev.filter((i) => i !== rid))

  const save = async () => {
    if (!title.trim()) return
    setSaving(true)
    setSaveError(false)
    try {
      const data = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        coverPhoto: coverPhoto.trim(),
        region: region.trim(),
        order: Number(order) || 0,
        isActive,
        recipeIds,
        updatedAt: serverTimestamp(),
      }
      if (isNew) {
        const ref = await addDoc(collection(db, 'collections'), { ...data, createdAt: serverTimestamp() })
        router.replace(`/admin/collections/${ref.id}`)
      } else {
        await setDoc(doc(db, 'collections', id), data, { merge: true })
      }
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
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/collections" className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
              {isNew ? 'Yeni Koleksiyon' : 'Koleksiyonu Düzenle'}
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Editöryal derleme / yöresel keşif</p>
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving || loading || !title.trim()}
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

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Başlık *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sivas'tan Sofranıza: Modern Yorumlar"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Alt Başlık</label>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Yöresel köklerini koruyan, modern sofralara uyarlanmış tarifler"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Kapak Fotoğrafı (URL)</label>
          <input
            value={coverPhoto}
            onChange={(e) => setCoverPhoto(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Yöre (opsiyonel — "Yöresel Keşif" rayı için)</label>
          <input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Sivas"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Sıra</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="isActive" className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            Yayında (ana sayfada göster)
          </label>
        </div>
      </div>

      {/* Recipe picker */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-14 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>
              Koleksiyondaki Tarifler ({selectedRecipes.length})
            </h2>
            {selectedRecipes.length === 0 ? (
              <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Henüz tarif eklenmedi.</p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                {selectedRecipes.map((recipe, i) => (
                  <div key={recipe.id} className="flex items-center gap-3 px-4 py-3" style={i > 0 ? { borderTop: '1px solid var(--border)' } : undefined}>
                    <span style={{ fontSize: '22px' }}>{recipe.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{recipe.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{recipe.country}</p>
                    </div>
                    <button onClick={() => removeRecipe(String(recipe.id))} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" style={{ color: '#C4593A' }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
            <div className="rounded-2xl overflow-hidden overflow-y-auto" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)', maxHeight: '480px' }}>
              {available.slice(0, 50).map((recipe, i) => (
                <button
                  key={recipe.id}
                  onClick={() => addRecipe(recipe)}
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
            {hasMore && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={loadMoreRecipes}
                  disabled={loadingMore}
                  className="px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', opacity: loadingMore ? 0.6 : 1 }}
                >
                  {loadingMore ? 'Yükleniyor...' : 'Daha Fazla Firebase Tarifi Yükle'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
