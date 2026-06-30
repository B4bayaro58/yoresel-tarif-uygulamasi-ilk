'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, Heart, Search } from 'lucide-react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/config/firebase'

interface UserDoc {
  uid: string
  email: string
  displayName: string
  favorites: string[]
  createdAt?: { seconds: number }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')))
        setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserDoc)))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = users.filter(
    (u) =>
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (u: UserDoc) => {
    if (!u.createdAt?.seconds) return '—'
    return new Date(u.createdAt.seconds * 1000).toLocaleDateString('tr-TR')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Kullanıcılar</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {loading ? '...' : `${users.length} kayıtlı kullanıcı`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="İsim veya e-posta ara..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users size={36} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Kullanıcı bulunamadı.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
          {/* Table head */}
          <div
            className="hidden sm:grid grid-cols-[1fr_1fr_80px_100px] gap-4 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
          >
            <span>Kullanıcı</span>
            <span>E-posta</span>
            <span>Favoriler</span>
            <span>Katılım</span>
          </div>
          {filtered.map((user, i) => (
            <div
              key={user.uid}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_80px_100px] gap-1 sm:gap-4 px-5 py-3.5 items-center"
              style={i > 0 ? { borderTop: '1px solid var(--border)' } : undefined}
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
                >
                  {(user.displayName?.[0] || user.email?.[0] || '?').toUpperCase()}
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  {user.displayName || '—'}
                </span>
              </div>
              <span className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</span>
              <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <Heart size={12} />
                <span className="text-sm">{user.favorites?.length || 0}</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(user)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
