'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, Heart, Search, UserPlus, X, Eye, EyeOff } from 'lucide-react'
import {
  collection, getDocs, query, orderBy, limit, startAfter, documentId,
  doc, setDoc, serverTimestamp,
  QueryDocumentSnapshot, DocumentData,
} from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import { initializeApp, deleteApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { db } from '@/config/firebase'

interface UserDoc {
  uid: string
  email: string
  displayName: string
  isAdmin?: boolean
  favorites: string[]
  createdAt?: { seconds: number }
}

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  borderRadius: '0.75rem',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--surface)',
  color: 'var(--text)',
  fontSize: '0.875rem',
  outline: 'none',
}

// Kullanıcı sayısı büyüdükçe her admin panel açılışında TÜM `users`
// koleksiyonunu limitsiz okumak maliyeti sınırsız büyütür. `documentId()`
// üzerinden sayfalanıyor (createdAt gibi bir alan üzerinden değil) çünkü her
// dokümanın ID'si garanti var — eski bir kullanıcı dokümanında createdAt
// eksikse orderBy(createdAt) o kullanıcıyı listeden sessizce düşürürdü
// (tıpka recipes limit(200)'ün override'ları kaybettiği hataya benzer).
const PAGE_SIZE = 100

function mapError(code: string) {
  switch (code) {
    case 'auth/email-already-in-use': return 'Bu e-posta zaten kullanımda.'
    case 'auth/invalid-email':        return 'Geçersiz e-posta adresi.'
    case 'auth/weak-password':        return 'Şifre en az 6 karakter olmalı.'
    default:                          return 'Bir hata oluştu, tekrar deneyin.'
  }
}

export default function AdminUsersPage() {
  const [users, setUsers]       = useState<UserDoc[]>([])
  const [loading, setLoading]   = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore]   = useState(true)
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [search, setSearch]     = useState('')
  const [showModal, setShowModal] = useState(false)

  // form state
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole]         = useState<'member' | 'admin'>('member')
  const [showPw, setShowPw]     = useState(false)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')

  const loadUsers = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'users'), orderBy(documentId()), limit(PAGE_SIZE)))
      const list = snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserDoc))
      list.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      setUsers(list)
      lastDocRef.current = snap.docs[snap.docs.length - 1] ?? null
      setHasMore(snap.docs.length === PAGE_SIZE)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreUsers = async () => {
    if (!lastDocRef.current) return
    setLoadingMore(true)
    try {
      const snap = await getDocs(query(
        collection(db, 'users'),
        orderBy(documentId()),
        startAfter(lastDocRef.current),
        limit(PAGE_SIZE)
      ))
      const list = snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserDoc))
      setUsers((prev) => [...prev, ...list].sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)))
      lastDocRef.current = snap.docs[snap.docs.length - 1] ?? null
      setHasMore(snap.docs.length === PAGE_SIZE)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const openModal = () => {
    setName(''); setEmail(''); setPassword(''); setRole('member')
    setError(''); setSuccess(''); setShowPw(false)
    setShowModal(true)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim())   { setError('İsim zorunludur.'); return }
    if (!email.trim())  { setError('E-posta zorunludur.'); return }
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalı.'); return }

    setSaving(true); setError('')
    // Admin oturumunu bozmamak için ikincil Firebase app instance kullan.
    // Firestore yazma da ikincil instance üzerinden yapılıyor —
    // böylece yeni kullanıcı kendi dökümanını kendisi oluşturmuş sayılır (Firestore kurallarına uygun).
    const secondaryApp = initializeApp(firebaseConfig, `add-user-${Date.now()}`)
    const secondaryAuth = getAuth(secondaryApp)
    const secondaryDb   = getFirestore(secondaryApp)
    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email.trim(), password)
      await updateProfile(cred.user, { displayName: name.trim() })
      await setDoc(doc(secondaryDb, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: email.trim(),
        displayName: name.trim(),
        isAdmin: role === 'admin',
        favorites: [],
        createdAt: serverTimestamp(),
      })
      setSuccess(`"${name.trim()}" başarıyla eklendi.`)
      setName(''); setEmail(''); setPassword(''); setRole('member')
      await loadUsers()
    } catch (err: any) {
      setError(mapError(err.code || ''))
    } finally {
      await deleteApp(secondaryApp)
      setSaving(false)
    }
  }

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
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Kullanıcılar</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {loading ? '...' : `${users.length}${hasMore ? '+' : ''} kayıtlı kullanıcı`}
            </p>
          </div>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
        >
          <UserPlus size={15} />
          Kullanıcı Ekle
        </button>
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
      {hasMore && (
        <p className="text-xs mb-4 -mt-2" style={{ color: 'var(--text-muted)' }}>
          Arama yalnızca yüklenmiş kullanıcılar içinde çalışır — aradığınızı bulamazsanız &ldquo;Daha Fazla Yükle&rdquo;ye basın.
        </p>
      )}

      {/* List */}
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
          <div
            className="hidden sm:grid grid-cols-[1fr_1fr_90px_80px_100px] gap-4 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
          >
            <span>Kullanıcı</span><span>E-posta</span><span>Rol</span><span>Favoriler</span><span>Katılım</span>
          </div>
          {filtered.map((user, i) => (
            <div
              key={user.uid}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_90px_80px_100px] gap-1 sm:gap-4 px-5 py-3.5 items-center"
              style={i > 0 ? { borderTop: '1px solid var(--border)' } : undefined}
            >
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
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold w-fit"
                style={user.isAdmin
                  ? { backgroundColor: 'rgba(185,122,26,0.12)', color: '#B97A1A' }
                  : { backgroundColor: 'rgba(148,163,184,0.15)', color: '#64748b' }
                }
              >
                {user.isAdmin ? '🛡️ Admin' : '👤 Üye'}
              </span>
              <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <Heart size={12} />
                <span className="text-sm">{user.favorites?.length || 0}</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(user)}</span>
            </div>
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-5">
          <button
            onClick={loadMoreUsers}
            disabled={loadingMore}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', opacity: loadingMore ? 0.6 : 1 }}
          >
            {loadingMore ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div className="w-full max-w-md rounded-3xl p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Yeni Kullanıcı Ekle</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-xl hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-2xl text-sm" style={{ backgroundColor: 'rgba(196,89,58,0.1)', color: '#C4593A', border: '1px solid rgba(196,89,58,0.2)' }}>
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 px-4 py-3 rounded-2xl text-sm" style={{ backgroundColor: 'rgba(22,163,74,0.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }}>
                {success}
              </div>
            )}

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Ad Soyad</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  autoCorrect="off"
                  spellCheck={false}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>E-posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  autoCorrect="off"
                  spellCheck={false}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Rol</label>
                <div className="flex gap-2">
                  {(['member', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={role === r
                        ? { background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)', color: '#fff' }
                        : { border: '1px solid var(--border)', color: 'var(--text-muted)', backgroundColor: 'var(--card)' }
                      }
                    >
                      {r === 'admin' ? '🛡️ Admin' : '👤 Üye'}
                    </button>
                  ))}
                </div>
                <p className="text-xs mt-1.5 px-0.5" style={{ color: 'var(--text-muted)' }}>
                  {role === 'admin'
                    ? 'Admin paneline erişebilir, tarif düzenleyebilir.'
                    : 'Sadece giriş yapıp profilini yönetebilir.'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Şifre</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    style={{ ...inputStyle, paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ border: '1px solid var(--border)', color: 'var(--text)', backgroundColor: 'var(--card)' }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? 'Ekleniyor...' : 'Kullanıcı Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
