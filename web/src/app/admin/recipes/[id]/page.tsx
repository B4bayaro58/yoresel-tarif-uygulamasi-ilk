'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import NextImage from 'next/image'
import {
  ArrowLeft, Save, Trash2, Plus, X, Image as ImageIcon,
} from 'lucide-react'
import {
  doc, getDoc, getDocs, updateDoc, addDoc, deleteDoc, collection, query, where, serverTimestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/config/firebase'
import { Recipe } from '@/types'
import { isPreOptimized } from '@/lib/image'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const staticRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

const CONTINENTS = [
  { value: 'europe',        label: 'Avrupa' },
  { value: 'asia',          label: 'Asya' },
  { value: 'africa',        label: 'Afrika' },
  { value: 'north-america', label: 'Kuzey Amerika' },
  { value: 'south-america', label: 'Güney Amerika' },
  { value: 'central-america',label: 'Orta Amerika' },
  { value: 'oceania',       label: 'Okyanusya' },
  { value: 'middle-east',   label: 'Orta Doğu' },
]

const CATEGORIES = [
  { value: 'main-course', label: 'Ana Yemek' },
  { value: 'dessert',     label: 'Tatlı' },
  { value: 'soup',        label: 'Çorba' },
  { value: 'salad',       label: 'Salata' },
  { value: 'breakfast',   label: 'Kahvaltı' },
  { value: 'appetizer',   label: 'Meze' },
  { value: 'snack',       label: 'Atıştırmalık' },
  { value: 'beverage',    label: 'İçecek' },
  { value: 'side-dish',   label: 'Ara Sıcak' },
]

interface FormState {
  name: string; country: string; continent: string; category: string
  emoji: string; photo: string; photoThumb: string; difficulty: string; status: string
  prepTime: string; servings: string; calories: string; rating: string
  ingredients: { name: string; amount: string; alternatives: string }[]
  equipment: string[]
  steps: string[]
}

const emptyForm = (): FormState => ({
  name: '', country: '', continent: 'europe', category: 'main-course',
  emoji: '🍽️', photo: '', photoThumb: '', difficulty: 'medium', status: 'published',
  prepTime: '', servings: '', calories: '', rating: '0',
  ingredients: [{ name: '', amount: '', alternatives: '' }],
  equipment: [''],
  steps: [''],
})

const recipeToForm = (r: Recipe): FormState => ({
  name: r.name || '',
  country: r.country || '',
  continent: r.continent || 'europe',
  category: r.category || 'main-course',
  emoji: r.emoji || '🍽️',
  photo: r.photo || '',
  photoThumb: r.photoThumb || '',
  difficulty: r.difficulty || 'medium',
  status: r.status || 'published',
  prepTime: String(r.prepTime ?? ''),
  servings: String(r.servings ?? ''),
  calories: String(r.calories ?? ''),
  rating: String(r.rating ?? 0),
  ingredients: r.ingredients?.length
    ? r.ingredients.map((ing) => ({
        name: ing.name,
        amount: ing.amount,
        alternatives: ing.alternatives?.join(', ') || '',
      }))
    : [{ name: '', amount: '', alternatives: '' }],
  equipment: r.equipment?.length ? r.equipment : [''],
  steps: r.steps?.length ? r.steps : [''],
})

const formToRecipe = (f: FormState) => ({
  name: f.name, country: f.country, continent: f.continent, category: f.category,
  emoji: f.emoji, photo: f.photo, photoThumb: f.photoThumb, difficulty: f.difficulty, status: f.status,
  prepTime: Number(f.prepTime), servings: Number(f.servings),
  calories: Number(f.calories), rating: Number(f.rating),
  ingredients: f.ingredients
    .filter((i) => i.name.trim())
    .map((i) => ({
      name: i.name.trim(), amount: i.amount.trim(),
      alternatives: i.alternatives ? i.alternatives.split(',').map((s) => s.trim()).filter(Boolean) : [],
    })),
  equipment: f.equipment.filter((e) => e.trim()),
  steps: f.steps.filter((s) => s.trim()),
})

export default function AdminRecipeDetailPage() {
  const params  = useParams()
  const router  = useRouter()
  const rawId   = params?.id ? decodeURIComponent(params.id as string) : ''
  const isNew    = rawId === 'new'
  const isStatic = !isNew && rawId.startsWith('static-')
  const staticId = isStatic ? rawId.replace('static-', '') : null
  const firebaseId = isNew || isStatic ? null : rawId

  const [form, setForm]       = useState<FormState>(emptyForm())
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImageEl = (file: File): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => { URL.revokeObjectURL(objectUrl); resolve(img) }
      img.onerror = reject
      img.src = objectUrl
    })

  // Görseli hedef en-boy oranına (3:2) kırpıp verilen boyuta küçültür ve JPEG'e dönüştürür
  const cropToBlob = (img: HTMLImageElement, targetW: number, targetH: number, quality: number): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const srcRatio = img.width / img.height
      const tgtRatio = targetW / targetH
      let sx = 0, sy = 0, sw = img.width, sh = img.height
      if (srcRatio > tgtRatio) {
        // Görsel daha geniş → yanlarda kırp
        sw = Math.round(img.height * tgtRatio)
        sx = Math.round((img.width - sw) / 2)
      } else {
        // Görsel daha uzun → üst/alt kırp
        sh = Math.round(img.width / tgtRatio)
        sy = Math.round((img.height - sh) / 2)
      }
      const canvas = document.createElement('canvas')
      canvas.width  = targetW
      canvas.height = targetH
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH)
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Canvas boş')),
        'image/jpeg', quality
      )
    })

  // Detay sayfası için tam boyut (1200×800) ve tarif kartları için küçük bir
  // "kart" versiyonu (480×320) üretir — kartlar artık ~180KB'lık tam görseli
  // değil, ~20-30KB'lık küçük versiyonu indirir.
  const resizeImage = async (file: File): Promise<{ full: Blob; thumb: Blob }> => {
    const img = await loadImageEl(file)
    const [full, thumb] = await Promise.all([
      cropToBlob(img, 1200, 800, 0.88),
      cropToBlob(img, 480, 320, 0.8),
    ])
    return { full, thumb }
  }

  // ── Load recipe ──────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        if (isNew) {
          setForm(emptyForm())
        } else if (firebaseId) {
          const snap = await getDoc(doc(db, 'recipes', firebaseId))
          if (snap.exists()) setForm(recipeToForm({ ...snap.data(), id: snap.id } as Recipe))
        } else if (staticId) {
          const r = staticRecipes.find((r) => String(r.id) === staticId)
          if (r) setForm(recipeToForm(r))
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [rawId])

  // ── Photo upload ─────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // input'u sıfırla (aynı dosya tekrar seçilebilsin)
    e.target.value = ''

    setUploading(true)
    setUploadError(null)
    try {
      const { full, thumb } = await resizeImage(file)
      const stamp = Date.now()
      const fullRef  = ref(storage, `recipes/${stamp}.jpg`)
      const thumbRef = ref(storage, `recipes-thumb/${stamp}.jpg`)

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Zaman aşımı (30s). Firebase Storage kurallarını kontrol edin.')), 30_000)
      )
      const uploadBoth = Promise.all([
        uploadBytes(fullRef, full, { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000, immutable' }),
        uploadBytes(thumbRef, thumb, { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000, immutable' }),
      ])
      const [fullSnap, thumbSnap] = await Promise.race([uploadBoth, timeout])
      const [url, thumbUrl] = await Promise.all([
        getDownloadURL(fullSnap.ref),
        getDownloadURL(thumbSnap.ref),
      ])
      setForm((f) => ({ ...f, photo: url, photoThumb: thumbUrl }))
      // Fotoğrafı hemen Firestore'a kaydet (manuel Kaydet'e gerek kalmasın)
      // Yeni tarifte henüz doküman yok — form içinde tutulup Kaydet ile birlikte yazılır
      if (firebaseId) {
        await updateDoc(doc(db, 'recipes', firebaseId), { photo: url, photoThumb: thumbUrl })
      } else if (staticId) {
        // Statik tarif: override kaydı oluştur veya güncelle
        const existing = await getDocs(
          query(collection(db, 'recipes'), where('overridesStaticId', '==', staticId))
        )
        if (!existing.empty) {
          await updateDoc(doc(db, 'recipes', existing.docs[0].id), { photo: url, photoThumb: thumbUrl })
        } else {
          const staticRecipe = staticRecipes.find((r) => String(r.id) === staticId)
          if (staticRecipe) {
            const { id: _sid, ...staticBase } = staticRecipe as any
            await addDoc(collection(db, 'recipes'), {
              ...staticBase,
              photo: url,
              photoThumb: thumbUrl,
              overridesStaticId: staticId,
              status: 'published',
              createdAt: serverTimestamp(),
            })
          }
        }
      }
    } catch (err: any) {
      console.error('Yükleme hatası:', err)
      const msg =
        err?.code === 'storage/unauthorized' ? 'Yetki hatası — Firebase Storage kurallarını deploy edin.' :
        err?.code === 'storage/canceled'     ? 'Yükleme iptal edildi.' :
        err?.message || 'Yükleme başarısız.'
      setUploadError(msg)
    } finally {
      setUploading(false)
    }
  }

  // ── Save ─────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    try {
      const data = formToRecipe(form)
      if (isNew) {
        await addDoc(collection(db, 'recipes'), { ...data, createdAt: serverTimestamp() })
      } else if (firebaseId) {
        await updateDoc(doc(db, 'recipes', firebaseId), data)
      } else {
        // Static tarifi Firebase'e override olarak kaydet.
        // baseStatic spread edilir ki gradient gibi FormState dışı alanlar korunur.
        // `id` alanı kasıtla çıkarılıyor — Firestore kendi döküman ID'sini atar.
        const { id: _sid, ...baseStatic } = (staticRecipes.find((r) => String(r.id) === staticId) || {}) as any
        // Mevcut override varsa güncelle (duplikasyon önleme)
        const existingSnap = await getDocs(
          query(collection(db, 'recipes'), where('overridesStaticId', '==', staticId))
        )
        if (!existingSnap.empty) {
          await updateDoc(doc(db, 'recipes', existingSnap.docs[0].id), { ...baseStatic, ...data })
        } else {
          await addDoc(collection(db, 'recipes'), {
            ...baseStatic, ...data, overridesStaticId: staticId, createdAt: serverTimestamp(),
          })
        }
      }
      setSaved(true)
      setTimeout(() => { setSaved(false); router.push('/admin/recipes') }, 1200)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  // ── Delete ───────────────────────────────────────────────
  const handleDelete = async () => {
    if (!firebaseId) return
    if (!confirm('Bu tarifi kalıcı olarak silmek istediğinize emin misiniz?')) return
    setDeleting(true)
    try {
      await deleteDoc(doc(db, 'recipes', firebaseId))
      router.push('/admin/recipes')
    } catch (e) { console.error(e) }
    finally { setDeleting(false) }
  }

  // ── Ingredient helpers ───────────────────────────────────
  const setIng = (i: number, field: keyof FormState['ingredients'][0], val: string) =>
    setForm((f) => { const arr = [...f.ingredients]; arr[i] = { ...arr[i], [field]: val }; return { ...f, ingredients: arr } })
  const addIng = () => setForm((f) => ({ ...f, ingredients: [...f.ingredients, { name: '', amount: '', alternatives: '' }] }))
  const removeIng = (i: number) => setForm((f) => ({ ...f, ingredients: f.ingredients.filter((_, j) => j !== i) }))

  // ── Step helpers ─────────────────────────────────────────
  const setStep = (i: number, val: string) =>
    setForm((f) => { const arr = [...f.steps]; arr[i] = val; return { ...f, steps: arr } })
  const addStep = () => setForm((f) => ({ ...f, steps: [...f.steps, ''] }))
  const removeStep = (i: number) => setForm((f) => ({ ...f, steps: f.steps.filter((_, j) => j !== i) }))

  // ── Equipment helpers ────────────────────────────────────
  const setEq = (i: number, val: string) =>
    setForm((f) => { const arr = [...f.equipment]; arr[i] = val; return { ...f, equipment: arr } })
  const addEq = () => setForm((f) => ({ ...f, equipment: [...f.equipment, ''] }))
  const removeEq = (i: number) => setForm((f) => ({ ...f, equipment: f.equipment.filter((_, j) => j !== i) }))

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
      {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-12 rounded-2xl" />)}
    </div>
  )

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm outline-none"
  const inputStyle = { backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }
  const labelCls = "block text-xs font-semibold mb-1.5"
  const labelStyle = { color: 'var(--text-muted)' }
  const sectionTitle = "font-display font-bold text-base mb-4 pb-2"
  const sectionTitleStyle = { color: 'var(--text)', borderBottom: '1px solid var(--border)' }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/recipes" className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold truncate max-w-xs" style={{ color: 'var(--text)' }}>{form.name || (isNew ? 'Yeni Tarif' : 'Tarif Düzenle')}</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {isNew ? '✨ Yeni tarif oluşturuluyor' : isStatic ? '📌 Statik tarif — kaydedince Firebase\'e override olarak eklenir' : `Firebase ID: ${firebaseId}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {firebaseId && (
            <button onClick={handleDelete} disabled={deleting} className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: '#C4593A' }}>
              <Trash2 size={17} />
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={saved ? { backgroundColor: '#16a34a' } : { background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
          >
            <Save size={14} />
            {saved ? '✓ Kaydedildi' : saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      <div className="space-y-6">

        {/* ── Fotoğraf ── */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className={sectionTitle} style={sectionTitleStyle}>Fotoğraf</p>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Preview */}
            <div className="relative w-full sm:w-48 h-36 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              {form.photo ? (
                <NextImage
                  src={form.photo}
                  alt="Önizleme"
                  fill
                  sizes="192px"
                  unoptimized={isPreOptimized(form.photo)}
                  className="object-cover"
                />
              ) : (
                <div className="text-center">
                  <span style={{ fontSize: '48px' }}>{form.emoji}</span>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Fotoğraf yok</p>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              {/* Upload button */}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium w-full justify-center transition-opacity"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', opacity: uploading ? 0.6 : 1 }}
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Boyutlandırılıyor ve yükleniyor...
                  </>
                ) : (
                  <>
                    <ImageIcon size={15} />
                    Bilgisayardan Yükle
                  </>
                )}
              </button>
              {uploadError && (
                <p className="text-xs px-1" style={{ color: '#C4593A' }}>⚠ {uploadError}</p>
              )}
              {/* URL input */}
              <div>
                <label className={labelCls} style={labelStyle}>veya URL girin</label>
                <input
                  value={form.photo}
                  onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value, photoThumb: '' }))}
                  placeholder="https://..."
                  className={inputCls}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Temel Bilgiler ── */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className={sectionTitle} style={sectionTitleStyle}>Temel Bilgiler</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls} style={labelStyle}>Tarif Adı</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} style={inputStyle} placeholder="Tarif adı" />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Ülke</label>
              <input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className={inputCls} style={inputStyle} placeholder="Türkiye" />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Emoji</label>
              <input value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))} className={inputCls} style={inputStyle} placeholder="🍽️" />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Kıta</label>
              <select value={form.continent} onChange={(e) => setForm((f) => ({ ...f, continent: e.target.value }))} className={inputCls} style={inputStyle}>
                {CONTINENTS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Kategori</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inputCls} style={inputStyle}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Zorluk</label>
              <select value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))} className={inputCls} style={inputStyle}>
                <option value="easy">Kolay</option>
                <option value="medium">Orta</option>
                <option value="hard">Zor</option>
              </select>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Durum</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className={inputCls} style={inputStyle}>
                <option value="published">Yayında</option>
                <option value="pending">Onay Bekliyor</option>
                <option value="draft">Taslak</option>
                <option value="inactive">Pasif (Gizli)</option>
              </select>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Hazırlık Süresi (dk)</label>
              <input type="number" value={form.prepTime} onChange={(e) => setForm((f) => ({ ...f, prepTime: e.target.value }))} className={inputCls} style={inputStyle} placeholder="30" />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Porsiyon</label>
              <input type="number" value={form.servings} onChange={(e) => setForm((f) => ({ ...f, servings: e.target.value }))} className={inputCls} style={inputStyle} placeholder="4" />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Kalori</label>
              <input type="number" value={form.calories} onChange={(e) => setForm((f) => ({ ...f, calories: e.target.value }))} className={inputCls} style={inputStyle} placeholder="450" />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Puan (0–5)</label>
              <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} className={inputCls} style={inputStyle} placeholder="4.5" />
            </div>
          </div>
        </div>

        {/* ── Malzemeler ── */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className={sectionTitle} style={sectionTitleStyle}>Malzemeler</p>
          <div className="space-y-3">
            {form.ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <input value={ing.name} onChange={(e) => setIng(i, 'name', e.target.value)} placeholder="Malzeme adı" className={inputCls} style={inputStyle} />
                  <input value={ing.amount} onChange={(e) => setIng(i, 'amount', e.target.value)} placeholder="Miktar (200g)" className={inputCls} style={inputStyle} />
                  <div className="col-span-2">
                    <input value={ing.alternatives} onChange={(e) => setIng(i, 'alternatives', e.target.value)} placeholder="Alternatifler (virgülle): tereyağı, zeytinyağı" className={inputCls} style={{ ...inputStyle, fontSize: '12px' }} />
                  </div>
                </div>
                <button onClick={() => removeIng(i)} disabled={form.ingredients.length === 1} className="mt-1 p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: '#C4593A' }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addIng} className="flex items-center gap-2 mt-3 px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}>
            <Plus size={14} /> Malzeme Ekle
          </button>
        </div>

        {/* ── Ekipman ── */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className={sectionTitle} style={sectionTitleStyle}>Ekipman / Araçlar</p>
          <div className="space-y-2">
            {form.equipment.map((eq, i) => (
              <div key={i} className="flex gap-2">
                <input value={eq} onChange={(e) => setEq(i, e.target.value)} placeholder="Tencere, Fırın..." className={`${inputCls} flex-1`} style={inputStyle} />
                <button onClick={() => removeEq(i)} disabled={form.equipment.length === 1} className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: '#C4593A' }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addEq} className="flex items-center gap-2 mt-3 px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}>
            <Plus size={14} /> Ekipman Ekle
          </button>
        </div>

        {/* ── Yapılış Adımları ── */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className={sectionTitle} style={sectionTitleStyle}>Yapılış Adımları</p>
          <div className="space-y-3">
            {form.steps.map((step, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="mt-2.5 text-xs font-bold w-5 text-center flex-shrink-0" style={{ color: 'var(--primary)' }}>{i + 1}</span>
                <textarea
                  value={step}
                  onChange={(e) => setStep(i, e.target.value)}
                  placeholder={`${i + 1}. adımı yazın...`}
                  rows={2}
                  className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={inputStyle}
                />
                <button onClick={() => removeStep(i)} disabled={form.steps.length === 1} className="mt-1 p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: '#C4593A' }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addStep} className="flex items-center gap-2 mt-3 px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}>
            <Plus size={14} /> Adım Ekle
          </button>
        </div>

        {/* ── Bottom save ── */}
        <div className="flex justify-end gap-3 pb-8">
          {firebaseId && (
            <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: 'rgba(196,89,58,0.1)', color: '#C4593A' }}>
              <Trash2 size={14} /> {deleting ? 'Siliniyor...' : 'Tarifi Sil'}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={saved ? { backgroundColor: '#16a34a' } : { background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
          >
            <Save size={14} />
            {saved ? '✓ Kaydedildi' : saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>

      </div>
    </div>
  )
}
