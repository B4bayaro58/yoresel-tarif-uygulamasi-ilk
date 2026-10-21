'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdConsent, getAdConsent, setAdConsent, OPEN_PREFS_EVENT } from '@/lib/adConsent'
import { useAuth } from '@/contexts/AuthContext'
// @ts-ignore
import { AD_CONSENT_SUMMARY } from '@shared/legalTexts'

// KVKK çerez/reklam rızası bandı. "Kabul Et" ve "Reddet" eşit ağırlıkta
// (Kurul'un çerez rehberi: reddetmek kabul etmek kadar kolay olmalı).
// Zorunlu depolama (oturum, tema, favoriler) rızaya bağlı değil.
export default function ConsentBanner() {
  const [open, setOpen] = useState(false)
  const { ageBracket } = useAuth()

  useEffect(() => {
    if (getAdConsent() === null) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_PREFS_EVENT, reopen)
    return () => window.removeEventListener(OPEN_PREFS_EVENT, reopen)
  }, [])

  const choose = (value: AdConsent) => {
    const previous = getAdConsent()
    setAdConsent(value)
    setOpen(false)
    // Sayfada zaten istenmiş reklamlar eski ayarla yüklendi; rıza geri
    // alındıysa kişiselleştirilmiş reklam kalmasın diye sayfayı yenile.
    if (previous === 'granted' && value === 'denied') window.location.reload()
  }

  if (!open) return null

  // 15-17 yaş hesaplardan reklam rızası alınmaz (her zaman kişiselleştirilmemiş).
  if (ageBracket === '15-17') {
    return (
      <div role="dialog" aria-label="Reklam tercihleri" className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4">
        <div className="max-w-2xl mx-auto rounded-2xl p-4 sm:p-5" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
            15-17 yaş arası hesaplara yalnızca kişiselleştirilmemiş reklam gösterilir; reklam rızası istenmez.{' '}
            <Link href="/ebeveyn-bilgilendirme" className="underline">Ayrıntılar</Link>
          </p>
          <button type="button" onClick={() => setOpen(false)} className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            Tamam
          </button>
        </div>
      </div>
    )
  }

  const btn = 'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80'

  return (
    <div
      role="dialog"
      aria-label="Çerez ve reklam tercihleri"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4"
    >
      <div
        className="max-w-2xl mx-auto rounded-2xl p-4 sm:p-5"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
      >
        <p className="font-semibold text-sm mb-1.5" style={{ color: 'var(--text)' }}>🍪 Çerez ve Reklam Tercihleri</p>
        <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>
          {AD_CONSENT_SUMMARY} Sitenin çalışması için gereken zorunlu depolama (oturum, tema, favoriler) bu seçimden etkilenmez.
        </p>
        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          <Link href="/acik-riza-metni" className="underline">Açık Rıza Metni</Link>
          {' · '}
          <Link href="/kvkk" className="underline">KVKK Aydınlatma Metni</Link>
          {' · '}
          <Link href="/cerez-politikasi" className="underline">Çerez Politikası</Link>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => choose('denied')}
            className={btn}
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            Reddet
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className={btn}
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  )
}
