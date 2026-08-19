'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, User, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'
import GoogleIcon from '@/components/GoogleIcon'

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
  const { user, login, register, loginWithGoogle, loginAsGuest, resetPassword } = useAuth()
  const { t } = useApp()

  const [isRegister, setIsRegister] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [guestLoading, setGuestLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const [showResetModal, setShowResetModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  useEffect(() => { if (user) router.push('/') }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError(t('fillAllFieldsLogin')); return }
    if (isRegister && !displayName.trim()) { setError(t('enterName')); return }
    setLoading(true)
    try {
      if (isRegister) await register(email, password, displayName.trim())
      else await login(email, password)
      router.push('/')
    }
    catch (err: any) { setError(mapFirebaseError(err.code || '')) }
    finally { setLoading(false) }
  }

  const handleGuestLogin = async () => {
    setError('')
    setGuestLoading(true)
    try { await loginAsGuest(); router.push('/') }
    catch { setError('Bir hata oluştu. Lütfen tekrar deneyin.') }
    finally { setGuestLoading(false) }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setGoogleLoading(true)
    try { await loginWithGoogle(); router.push('/') }
    catch (err: any) {
      // Kullanıcı popup'ı kapatırsa hata gösterme, sadece gerçek hatalarda göster
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        setError(t('googleSignInError'))
      }
    }
    finally { setGoogleLoading(false) }
  }

  const openResetModal = () => {
    setResetEmail(email)
    setResetError('')
    setResetSent(false)
    setShowResetModal(true)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail.trim()) return
    setResetLoading(true)
    setResetError('')
    try {
      await resetPassword(resetEmail.trim())
      setResetSent(true)
    } catch {
      setResetError(t('resetPasswordError'))
    } finally {
      setResetLoading(false)
    }
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
            Yöresel Tarif
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {isRegister ? t('createAccount') : "Lezzet Atlası'na hoş geldiniz"}
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

            <form onSubmit={handleSubmit} className="space-y-3">
              {isRegister && (
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={t('fullName')}
                    autoCorrect="off"
                    spellCheck={false}
                    style={inputBase}
                  />
                </div>
              )}
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
                  placeholder={t('password')}
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
              {!isRegister && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={openResetModal}
                    className="text-xs font-semibold hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--primary)' }}
                  >
                    {t('resetPassword')}
                  </button>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm mt-2"
              >
                {isRegister ? <UserPlus size={15} /> : <LogIn size={15} />}
                {loading
                  ? (isRegister ? 'Kayıt olunuyor...' : 'Giriş yapılıyor...')
                  : t(isRegister ? 'registerButton' : 'loginButton')}
              </button>
            </form>

            <div className="flex items-center gap-3 mt-4">
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{t('orDivider')}</span>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl text-sm font-semibold mt-4 transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #DADCE0', color: '#3C4043' }}
            >
              <GoogleIcon size={18} />
              {googleLoading ? '...' : t('continueWithGoogle')}
            </button>

            <button
              type="button"
              onClick={() => { setIsRegister((v) => !v); setError('') }}
              className="w-full text-center text-sm mt-4 hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-muted)' }}
            >
              {t(isRegister ? 'hasAccount' : 'noAccount')}
              <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                {t(isRegister ? 'loginButton' : 'registerButton')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={guestLoading}
              className="w-full text-center text-sm mt-3 underline underline-offset-2 hover:opacity-70 transition-opacity disabled:opacity-50"
              style={{ color: 'var(--text-muted)' }}
            >
              {t('continueAsGuest')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Şifre sıfırlama modalı ─────────────────── */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowResetModal(false) }}
        >
          <div className="w-full max-w-sm rounded-3xl p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{t('resetPassword')}</h2>
              <button
                onClick={() => setShowResetModal(false)}
                className="p-1.5 rounded-xl hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {resetSent ? (
              <div className="text-center py-2">
                <p className="text-sm mb-5" style={{ color: 'var(--text)' }}>{t('resetPasswordSent')}</p>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="btn-primary w-full py-2.5 rounded-2xl text-sm font-semibold"
                >
                  {t('confirm')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                {resetError && (
                  <div
                    className="px-4 py-3 rounded-2xl text-sm"
                    style={{ backgroundColor: 'rgba(196,89,58,0.1)', color: '#C4593A', border: '1px solid rgba(196,89,58,0.2)' }}
                  >
                    {resetError}
                  </div>
                )}
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="E-posta adresi"
                    autoCorrect="off"
                    spellCheck={false}
                    style={inputBase}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!resetEmail.trim() || resetLoading}
                  className="btn-primary w-full py-2.5 rounded-2xl text-sm font-semibold disabled:opacity-50"
                >
                  {resetLoading ? '...' : t('confirm')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
