'use client'

import { useEffect, useRef } from 'react'
import clsx from 'clsx'

// Google AdSense hesabı henüz onaylanmadı/kurulmadı. Env değişkenleri
// (NEXT_PUBLIC_ADSENSE_CLIENT_ID + slot ID'leri) ayarlanana kadar bu bileşen
// gerçek reklam yerine sadece dev ortamında bir yer tutucu gösterir,
// production'da hiçbir şey render etmez -- boş <ins> ya da "REKLAM ALANI"
// yazısı gerçek kullanıcılara asla gitmez.
interface AdSlotProps {
  slot: string | undefined
  format?: string
  className?: string
  label?: string
}

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

export default function AdSlot({ slot, format = 'auto', className, label }: AdSlotProps) {
  const pushedRef = useRef(false)

  useEffect(() => {
    if (!ADSENSE_CLIENT_ID || !slot || pushedRef.current) return
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushedRef.current = true
    } catch {
      // AdSense script henüz yüklenmemiş olabilir -- sessizce geç
    }
  }, [slot])

  if (!ADSENSE_CLIENT_ID || !slot) {
    if (process.env.NODE_ENV !== 'development') return null
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '90px',
          borderRadius: '16px',
          border: '1px dashed var(--border)',
          color: 'var(--text-muted)',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textAlign: 'center',
          padding: '8px 16px',
        }}
      >
        {label ?? 'REKLAM ALANI'} (yalnızca dev — AdSense henüz bağlanmadı)
      </div>
    )
  }

  return (
    <ins
      className={clsx('adsbygoogle', className)}
      style={{ display: 'block' }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}
