'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
// @ts-ignore
import { AGE_GATE_TEXT } from '@shared/legalTexts'

// Giriş yapmış ve henüz 15 yaş beyanı vermemiş her hesaba (yeni ve mevcut,
// e-posta/Google/Apple) bir kez sorulur. Yaş Doğrulama Yönetmeliği mevcut
// hesapların da 31/3/2027'ye kadar doğrulanmasını istiyor.
export default function AgeGate() {
  const { user, ageConfirmed, confirmAge, declineAge } = useAuth()
  const [busy, setBusy] = useState(false)
  const [denied, setDenied] = useState(false)

  if (denied) {
    return (
      <Overlay>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text)' }}>{AGE_GATE_TEXT.deniedMessage}</p>
        <button type="button" onClick={() => setDenied(false)} className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold">
          Tamam
        </button>
      </Overlay>
    )
  }

  if (!user || user.isAnonymous || ageConfirmed !== false) return null

  const run = async (fn: () => Promise<void>, after?: () => void) => {
    setBusy(true)
    try { await fn(); after?.() } catch { /* ağ hatası: kapı açık kalır, tekrar denenebilir */ }
    finally { setBusy(false) }
  }

  return (
    <Overlay>
      <p className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>{AGE_GATE_TEXT.title}</p>
      <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>{AGE_GATE_TEXT.body}</p>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        Ayrıntılar: <Link href="/kvkk" className="underline">KVKK Aydınlatma Metni</Link>
      </p>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => run(confirmAge)}
          className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
        >
          {AGE_GATE_TEXT.confirm}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => run(declineAge, () => setDenied(true))}
          className="w-full py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          {AGE_GATE_TEXT.deny}
        </button>
      </div>
    </Overlay>
  )
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
      <div className="w-full max-w-sm rounded-2xl p-5" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        {children}
      </div>
    </div>
  )
}
