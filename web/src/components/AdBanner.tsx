import React from 'react'

type AdSize =
  | 'leaderboard'       // 728×90  — yatay banner, masaüstü
  | 'rectangle'         // 300×250 — klasik dikdörtgen
  | 'large-rectangle'   // 336×280 — büyük dikdörtgen
  | 'responsive'        // %100 genişlik, sabit yükseklik
  | 'skyscraper'        // 160×600 — dikey gökdelen, kenar sütunlar
  | 'half-page'         // 300×600 — yarım sayfa dikey

interface AdBannerProps {
  size: AdSize
  label?: string
  className?: string
}

const SIZE_CONFIG: Record<AdSize, { width: number | string; height: number; display: string }> = {
  leaderboard:     { width: 728,   height: 90,  display: '728 × 90'  },
  rectangle:       { width: 300,   height: 250, display: '300 × 250' },
  'large-rectangle': { width: 336, height: 280, display: '336 × 280' },
  responsive:      { width: '100%', height: 90, display: 'Responsive' },
  skyscraper:      { width: 160,   height: 600, display: '160 × 600' },
  'half-page':     { width: 300,   height: 600, display: '300 × 600' },
}

export default function AdBanner({ size, label = 'Reklam Alanı', className = '' }: AdBannerProps) {
  const cfg = SIZE_CONFIG[size]

  return (
    <div
      className={`flex items-center justify-center mx-auto ${className}`}
      style={{
        width: cfg.width,
        maxWidth: '100%',
        height: cfg.height,
        border: '2px dashed #c9a84c',
        borderRadius: '10px',
        backgroundColor: 'rgba(185,122,26,0.05)',
        flexDirection: 'column',
        gap: '4px',
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: '#c9a84c', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontSize: '11px', fontWeight: 500, color: '#a07830', opacity: 0.8 }}>
        {cfg.display}
      </span>
    </div>
  )
}
