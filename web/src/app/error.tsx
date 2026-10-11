'use client'

import Link from 'next/link'
import { useEffect } from 'react'

// Beklenmeyen çalışma zamanı hataları için — Next'in varsayılan İngilizce
// "Application error" ekranı yerine. Header/Footer layout'ta kalır.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4" aria-hidden>🔥</div>
      <h1 className="font-display font-bold text-2xl mb-3" style={{ color: 'var(--text)' }}>
        Bir şeyler ters gitti
      </h1>
      <p className="mb-8 text-[15px]" style={{ color: 'var(--text-muted)' }}>
        Sayfa yüklenirken beklenmeyen bir hata oluştu. Tekrar denemek çoğu zaman yeterli olur.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="btn-primary px-6 py-3 rounded-2xl font-semibold text-sm">
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl font-semibold text-sm border"
          style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
        >
          Ana Sayfa
        </Link>
      </div>
    </div>
  )
}
