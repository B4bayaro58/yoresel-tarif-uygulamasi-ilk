'use client'

import { useState } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuth } from '@/contexts/AuthContext'

export default function SetupAdminPage() {
  const { user } = useAuth()
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSetup = async () => {
    if (!user) { setError('Önce giriş yapmalısın.'); return }
    setLoading(true)
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Admin',
        isAdmin: true,
        favorites: [],
        createdAt: serverTimestamp(),
      }, { merge: true })
      setDone(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)' }}>
      <div style={{ textAlign: 'center', padding: '2rem', maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
        <h1 style={{ color: 'var(--text)', marginBottom: 8, fontWeight: 700 }}>Admin Kurulumu</h1>

        {!user && <p style={{ color: 'var(--text-muted)' }}>Giriş yapılmamış.</p>}

        {user && !done && (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
              <strong>{user.email}</strong> hesabı Firestore'da admin olarak kaydedilecek.
            </p>
            {error && <p style={{ color: '#C4593A', marginBottom: 16, fontSize: 14 }}>{error}</p>}
            <button
              onClick={handleSetup}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)',
                color: '#fff', border: 'none', borderRadius: 12,
                padding: '12px 32px', fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Kaydediliyor...' : 'Admin Olarak Kaydet'}
            </button>
          </>
        )}

        {done && (
          <div>
            <p style={{ color: '#16a34a', fontWeight: 600, marginBottom: 16 }}>✓ Başarıyla kaydedildi!</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              Bu sayfayı silebilirsin. Şimdi <a href="/admin" style={{ color: '#B97A1A' }}>admin paneline</a> git.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
