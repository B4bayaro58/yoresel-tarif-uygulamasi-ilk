'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Send, CheckCircle2, LogIn, AlertTriangle } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuth } from '@/contexts/AuthContext'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

// Tarif detayındaki "Hata Bildir" butonunun açtığı sayfa (?tarif=<id>).
// Alan listesi/uzunluklar firestore.rules'taki recipeErrorReports bloğu ve
// mobil ReportRecipeErrorScreen.js ile aynı tutulmalı.
const MIN_LENGTH = 5
const MAX_LENGTH = 2000

const localRecipes: any[] = (RECIPES_DATA as any).tr || []

const inputStyle = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
}

function HataBildirContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const recipeId = (searchParams.get('tarif') || '').slice(0, 128)
  const recipeName =
    localRecipes.find((r) => String(r.id) === recipeId)?.name || searchParams.get('ad') || ''

  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const backHref = recipeId ? `/recipes/${encodeURIComponent(recipeId)}` : '/'

  if (!user || user.isAnonymous) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
          style={{ backgroundColor: 'var(--primary-dim)' }}
        >
          <AlertTriangle size={36} style={{ color: 'var(--primary)' }} />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text)' }}>
          Hata Bildir
        </h2>
        <p className="text-sm text-center mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
          Hata bildirebilmek için bir hesapla giriş yapmanız gerekir.
        </p>
        <Link href="/login" className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm">
          <LogIn size={15} />
          Giriş Yap
        </Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
          style={{ backgroundColor: 'var(--primary-dim)' }}
        >
          <CheckCircle2 size={40} style={{ color: 'var(--primary)' }} />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text)' }}>
          Teşekkürler!
        </h2>
        <p className="text-sm mb-6 max-w-sm" style={{ color: 'var(--text-muted)' }}>
          Bildiriminiz bize ulaştı. İnceleyip en kısa sürede düzelteceğiz.
        </p>
        <Link href={backHref} className="btn-primary px-6 py-3 rounded-2xl font-semibold text-sm">
          Tarife Dön
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const text = message.trim()
    if (!recipeId) {
      setError('Hangi tarif için bildirim yaptığınız anlaşılamadı. Lütfen tarif sayfasından tekrar deneyin.')
      return
    }
    if (text.length < MIN_LENGTH) {
      setError('Lütfen hatayı en az birkaç kelimeyle açıklayın.')
      return
    }

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'recipeErrorReports'), {
        recipeId,
        recipeName: recipeName.slice(0, 200),
        message: text.slice(0, MAX_LENGTH),
        userId: user.uid,
        userName: (user.displayName || user.email?.split('@')[0] || '').slice(0, 100),
        userEmail: user.email || '',
        platform: 'web',
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError('Bildirim gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={15} />
        Tarife Dön
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}
        >
          <AlertTriangle size={22} style={{ color: '#F59E0B' }} />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>
            Hata Bildir
          </h1>
          {recipeName && (
            <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              {recipeName}
            </p>
          )}
        </div>
      </div>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Bu tarifte yanlış bir malzeme, ölçü, adım veya bilgi mi gördünüz? Nerede hata olduğunu
        bize anlatın, inceleyip düzeltelim.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={7}
            maxLength={MAX_LENGTH}
            className="w-full px-4 py-2.5 rounded-xl text-sm focus-ring resize-none"
            style={inputStyle}
            placeholder="Örn: 3. adımda fırın sıcaklığı 180 değil 200 derece olmalı."
            aria-label="Hata açıklaması"
            autoCorrect="off"
            spellCheck={false}
          />
          <p className="text-xs text-right mt-1" style={{ color: 'var(--text-muted)' }}>
            {message.length}/{MAX_LENGTH}
          </p>
        </div>

        {error && (
          <p className="text-sm px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(196,89,58,0.1)', color: '#C4593A' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm disabled:opacity-60"
        >
          <Send size={15} />
          {submitting ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </form>
    </div>
  )
}

export default function HataBildirPage() {
  return (
    <Suspense fallback={null}>
      <HataBildirContent />
    </Suspense>
  )
}
