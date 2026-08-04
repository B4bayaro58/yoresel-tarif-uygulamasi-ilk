'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, BookMarked } from 'lucide-react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { EditorialCollection } from '@/lib/collections'

export default function AdminCollectionsPage() {
  const [items, setItems] = useState<EditorialCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'collections'))
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as EditorialCollection)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Bu koleksiyonu silmek istediğinize emin misiniz?')) return
    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'collections', id))
      setItems((prev) => prev.filter((c) => c.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Koleksiyonlar</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Editöryal derlemeler ve yöresel keşif modülleri</p>
          </div>
        </div>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
        >
          <Plus size={14} />
          Yeni Koleksiyon
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <BookMarked size={28} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Henüz koleksiyon oluşturulmadı.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
          {items.map((c, i) => (
            <div
              key={c.id}
              className="flex items-center gap-3 px-4 py-3"
              style={i > 0 ? { borderTop: '1px solid var(--border)' } : undefined}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--primary-dim)' }}
              >
                {c.isActive ? (
                  <Eye size={16} style={{ color: 'var(--primary)' }} />
                ) : (
                  <EyeOff size={16} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{c.title}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {c.recipeIds?.length ?? 0} tarif{c.region ? ` • ${c.region}` : ''} • sıra {c.order ?? 0}
                </p>
              </div>
              <Link
                href={`/admin/collections/${c.id}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}
              >
                Düzenle
              </Link>
              <button
                onClick={() => handleDelete(c.id)}
                disabled={deletingId === c.id}
                className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                style={{ color: '#C4593A' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
