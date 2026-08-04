'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Newspaper } from 'lucide-react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { BlogPost } from '@/types'

const STATUS_INFO: Record<string, { label: string; bg: string; color: string }> = {
  published: { label: 'Yayında', bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
  draft: { label: 'Taslak', bg: 'rgba(148,163,184,0.15)', color: '#64748b' },
}

function toMillis(value: unknown): number {
  if (!value) return 0
  if (typeof value === 'object' && value !== null && 'seconds' in (value as any)) return (value as any).seconds * 1000
  const parsed = Date.parse(String(value))
  return Number.isNaN(parsed) ? 0 : parsed
}

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'blogPosts'))
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as BlogPost)
        .sort((a, b) => toMillis(b.updatedAt || b.createdAt) - toMillis(a.updatedAt || a.createdAt))
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return
    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'blogPosts', id))
      setItems((prev) => prev.filter((p) => p.id !== id))
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
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Blog Yazıları</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Editöryal içerik ve tarif tanıtım yazıları</p>
          </div>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
        >
          <Plus size={14} />
          Yeni Yazı
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <Newspaper size={28} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Henüz yazı oluşturulmadı.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
          {items.map((post, i) => {
            const statusInfo = STATUS_INFO[post.status] || STATUS_INFO.draft
            return (
              <div
                key={post.id}
                className="flex items-center gap-3 px-4 py-3"
                style={i > 0 ? { borderTop: '1px solid var(--border)' } : undefined}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                >
                  {statusInfo.label}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{post.title}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>/blog/{post.slug}</p>
                </div>
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}
                >
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                  className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                  style={{ color: '#C4593A' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
