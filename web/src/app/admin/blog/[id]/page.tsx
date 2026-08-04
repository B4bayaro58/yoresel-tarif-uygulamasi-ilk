'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Image as ImageIcon, Trash2 } from 'lucide-react'
import {
  doc, getDoc, setDoc, addDoc, deleteDoc, collection, serverTimestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/config/firebase'
import { resizeImageToJpegBlob, isPreOptimized } from '@/lib/image'
import { slugify } from '@/lib/slugify'
import BlogEditor from '@/components/blog/BlogEditor'

export default function AdminBlogEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const isNew = id === 'new'

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [excerpt, setExcerpt] = useState('')
  const [coverPhoto, setCoverPhoto] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [content, setContent] = useState<unknown>(null)

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const contentRef = useRef<unknown>(null)

  useEffect(() => {
    if (isNew) return
    getDoc(doc(db, 'blogPosts', id)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setTitle(data.title || '')
        setSlug(data.slug || '')
        setExcerpt(data.excerpt || '')
        setCoverPhoto(data.coverPhoto || '')
        setStatus(data.status || 'draft')
        setContent(data.content ?? null)
        contentRef.current = data.content ?? null
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id, isNew])

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    setUploadError(null)
    try {
      const blob = await resizeImageToJpegBlob(file, 1600, 0.85)
      const storageRef = ref(storage, `blog/${Date.now()}.jpg`)
      await uploadBytes(storageRef, blob, { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000, immutable' })
      const url = await getDownloadURL(storageRef)
      setCoverPhoto(url)
    } catch (err: any) {
      setUploadError(err?.message || 'Yükleme başarısız.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) return
    setSaving(true)
    setSaveError(null)
    try {
      const data = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        coverPhoto,
        content: contentRef.current,
        status,
        updatedAt: serverTimestamp(),
        ...(status === 'published' ? { publishedAt: serverTimestamp() } : {}),
      }
      if (isNew) {
        const docRef = await addDoc(collection(db, 'blogPosts'), { ...data, createdAt: serverTimestamp() })
        setSaved(true)
        setTimeout(() => { setSaved(false); router.push(`/admin/blog/${docRef.id}`) }, 800)
      } else {
        await setDoc(doc(db, 'blogPosts', id), data, { merge: true })
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (e: any) {
      console.error(e)
      const msg =
        e?.code === 'permission-denied'
          ? 'Yetki hatası — Firestore kurallarının deploy edildiğinden emin olun.'
          : e?.message || 'Kaydedilemedi.'
      setSaveError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (isNew) return
    if (!confirm('Bu yazıyı kalıcı olarak silmek istediğinize emin misiniz?')) return
    setDeleting(true)
    try {
      await deleteDoc(doc(db, 'blogPosts', id))
      router.push('/admin/blog')
    } catch (e) {
      console.error(e)
      setDeleting(false)
    }
  }

  const inputCls = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none'
  const inputStyle = { backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' } as const
  const labelCls = 'text-xs font-semibold mb-1.5 block'
  const labelStyle = { color: 'var(--text-muted)' } as const

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
              {isNew ? 'Yeni Yazı' : 'Yazıyı Düzenle'}
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Blog / editöryal içerik</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2.5 rounded-xl hover:opacity-70 transition-opacity"
              style={{ color: '#C4593A', border: '1px solid var(--border)' }}
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || loading || !title.trim() || !slug.trim()}
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
      </div>

      {saveError && (
        <div
          className="mb-4 px-4 py-3 rounded-xl text-sm"
          style={{ backgroundColor: 'rgba(196,89,58,0.1)', border: '1px solid rgba(196,89,58,0.25)', color: '#C4593A' }}
        >
          {saveError}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className={labelCls} style={labelStyle}>Başlık *</label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Kurban Bayramı İçin 10 Yöresel Tarif"
              className={inputCls}
              style={inputStyle}
            />
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>URL (slug) *</label>
            <input
              value={slug}
              onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true) }}
              placeholder="kurban-bayrami-icin-10-yoresel-tarif"
              className={inputCls}
              style={inputStyle}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>/blog/{slug || '...'}</p>
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>Özet</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Liste sayfasında ve arama sonuçlarında görünecek kısa özet"
              className={inputCls}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={labelStyle}>Kapak Fotoğrafı</label>
              <label
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-opacity hover:opacity-80"
                style={inputStyle}
              >
                <ImageIcon size={14} />
                {uploading ? 'Yükleniyor...' : 'Fotoğraf Seç'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
              </label>
              {uploadError && <p className="text-xs mt-1" style={{ color: '#C4593A' }}>{uploadError}</p>}
              {coverPhoto && (
                <div className="relative w-full mt-2 rounded-xl overflow-hidden" style={{ aspectRatio: '3 / 2' }}>
                  <NextImage src={coverPhoto} alt="Kapak" fill unoptimized={isPreOptimized(coverPhoto)} className="object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Durum</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')} className={inputCls} style={inputStyle}>
                <option value="draft">Taslak</option>
                <option value="published">Yayında</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>İçerik</label>
            <BlogEditor
              content={content}
              onChange={(json) => { contentRef.current = json }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
