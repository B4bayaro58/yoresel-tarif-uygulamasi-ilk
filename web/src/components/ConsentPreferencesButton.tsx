'use client'

import { openConsentPreferences } from '@/lib/adConsent'

export default function ConsentPreferencesButton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <button type="button" onClick={openConsentPreferences} className={className ?? 'underline font-semibold'} style={style}>
      Çerez Tercihleri
    </button>
  )
}
