'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/user-not-found':      return 'Bu e-posta adresine ait hesap bulunamadı.'
    case 'auth/wrong-password':      return 'Şifre hatalı. Lütfen tekrar deneyin.'
    case 'auth/email-already-in-use':return 'Bu e-posta adresi zaten kullanımda.'
    case 'auth/weak-password':       return 'Şifre en az 6 karakter olmalıdır.'
    case 'auth/invalid-email':       return 'Geçersiz e-posta adresi.'
    case 'auth/too-many-requests':   return 'Çok fazla başarısız deneme. Daha sonra tekrar deneyin.'
    case 'auth/invalid-credential':  return 'E-posta veya şifre hatalı.'
    default:                         return 'Bir hata oluştu. Lütfen tekrar deneyin.'
  }
}

const inputBase: React.CSSProperties = {
  width: '100%',
  paddingLeft: '2.5rem',
  paddingRight: '1rem',
  paddingTop: '0.75rem',
  paddingBottom: '0.75rem',
  borderRadius: '0.875rem',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--card)',
  color: 'var(--text)',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.15s',
}

export default function LoginPage() {
  const router = useRouter()
  const { user, login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (user) router.push('/') }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('E-posta ve şifre zorunludur.'); return }
    setLoading(true)
    try { await login(email, password); router.push('/') }
    catch (err: any) { setError(mapFirebaseError(err.code || '')) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* ── Brand header ─────────────────────────── */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)', boxShadow: '0 8px 32px rgba(185,122,26,0.3)' }}
          >
            🍽️
          </div>
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text)' }}>
            Yöresel Tarifler
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Lezzet Atlası'na hoş geldiniz
          </p>
        </div>

        {/* ── Card ─────────────────────────────────── */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="px-6 py-6">
            {/* Error */}
            {error && (
              <div
                className="mb-4 px-4 py-3 rounded-2xl text-sm"
                style={{ backgroundColor: 'rgba(196,89,58,0.1)', color: '#C4593A', border: '1px solid rgba(196,89,58,0.2)' }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresi"
                  autoCorrect="off"
                  spellCheck={false}
                  style={inputBase}
                />
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifre"
                  style={{ ...inputBase, paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm mt-2"
              >
                <LogIn size={15} />
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          Sadece yetkili hesaplar giriş yapabilir.
        </p>
      </div>
    </div>
  )
}
