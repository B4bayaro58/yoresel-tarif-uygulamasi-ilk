'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react'
import {
  collection, getDocs, query, orderBy, limit, startAfter, deleteDoc, doc,
  QueryDocumentSnapshot, DocumentData, Timestamp,
} from 'firebase/firestore'
import { db } from '@/config/firebase'

// Kullanıcıların tarif detayından gönderdiği "Hata Bildir" kayıtları
// (/hata-bildir ve mobil ReportRecipeErrorScreen.js). "Çözüldü" kaydı siler.
const PAGE_SIZE = 50

interface ErrorReport {
  id: string
  recipeId: string
  recipeName?: string
  message: string
  userName?: string
  userEmail?: string
  platform?: string
  createdAt?: Timestamp
}

const formatDate = (ts?: Timestamp) =>
  ts?.toDate
    ? ts.toDate().toLocaleString('tr-TR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : ''

export default function AdminErrorReportsPage() {
  const [reports, setReports] = useState<ErrorReport[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  const loadPage = async (more: boolean) => {
    more ? setLoadingMore(true) : setLoading(true)
    try {
      const q = more && lastDoc
        ? query(collection(db, 'recipeErrorReports'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE))
        : query(collection(db, 'recipeErrorReports'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE))
      const snap = await getDocs(q)
      const loaded = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ErrorReport))
      setReports((prev) => (more ? [...prev, ...loaded] : loaded))
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null)
      setHasMore(snap.docs.length === PAGE_SIZE)
    } catch (e) {
      console.error(e)
    } finally {
      more ? setLoadingMore(false) : setLoading(false)
    }
  }

  useEffect(() => { loadPage(false) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const resolve = async (id: string) => {
    if (!confirm('Bu bildirim çözüldü olarak işaretlenip listeden silinsin mi?')) return
    setActionId(id)
    try {
      await deleteDoc(doc(db, 'recipeErrorReports', id))
      setReports((prev) => prev.filter((r) => r.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Hata Bildirimleri</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {loading ? '...' : `${reports.length}${hasMore ? '+' : ''} açık bildirim`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : reports.length === 0 ? (
        <div
          className="rounded-2xl p-16 text-center"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <AlertTriangle size={36} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="font-semibold" style={{ color: 'var(--text)' }}>Henüz hata bildirimi yok</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Kullanıcıların tarif sayfalarından gönderdiği hata bildirimleri burada görünür.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl p-5"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
            >
              <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>{r.recipeName || r.recipeId}</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {[r.userName, r.userEmail].filter(Boolean).join(' · ')}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {formatDate(r.createdAt)}{r.platform ? ` · ${r.platform}` : ''}
              </p>
              <p className="text-sm mt-3 whitespace-pre-wrap" style={{ color: 'var(--text)' }}>{r.message}</p>
              <div className="flex gap-2 mt-4 justify-end">
                <Link
                  href={`/recipes/${encodeURIComponent(r.recipeId)}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
                >
                  <ExternalLink size={14} /> Tarife Git
                </Link>
                <button
                  onClick={() => resolve(r.id)}
                  disabled={actionId === r.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#059669' }}
                >
                  <CheckCircle2 size={14} /> {actionId === r.id ? 'İşleniyor...' : 'Çözüldü'}
                </button>
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => loadPage(true)}
                disabled={loadingMore}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
              >
                {loadingMore ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
