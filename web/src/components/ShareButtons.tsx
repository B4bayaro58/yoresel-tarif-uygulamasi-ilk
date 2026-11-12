'use client'

import { useEffect, useState } from 'react'
import { Check, Link2, Share2 } from 'lucide-react'

// Tarif / blog paylaşım düğmeleri. Marka simgeleri satır içi SVG (lucide'de yok).
type Props = { url: string; title: string; className?: string }

const ICONS = {
  whatsapp:
    'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.43-9.43a9.37 9.37 0 0 1 9.42 9.44c0 5.2-4.23 9.43-9.43 9.43M20.07 3.98A11.27 11.27 0 0 0 12.05.66C5.8.66.7 5.75.7 12.01c0 2 .52 3.95 1.52 5.67L.6 23.5l5.95-1.56a11.33 11.33 0 0 0 5.5 1.4c6.25 0 11.34-5.09 11.35-11.34 0-3.03-1.18-5.88-3.33-8.02',
  x: 'M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z',
  facebook:
    'M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07',
  telegram:
    'M11.94 0a12 12 0 1 0 .12 0zm4.96 7.22c.1 0 .32.02.47.14.12.1.15.23.17.33.01.06.03.21.02.33-.18 1.9-.96 6.5-1.36 8.63-.17.9-.5 1.2-.82 1.23-.7.06-1.23-.46-1.9-.9-1.06-.7-1.65-1.13-2.68-1.8-1.19-.79-.42-1.22.26-1.92.18-.18 3.25-2.98 3.3-3.23.01-.03.01-.15-.06-.21s-.17-.04-.25-.02q-.16.03-5.06 3.34-.72.5-1.3.48c-.43-.01-1.25-.24-1.86-.44-.75-.24-1.35-.37-1.3-.79q.04-.32.9-.66 5.24-2.28 6.99-3.01c3.33-1.39 4.02-1.63 4.47-1.64',
} as const

const BRAND_COLORS: Record<keyof typeof ICONS, string> = {
  whatsapp: '#25D366',
  x: 'var(--text)',
  facebook: '#1877F2',
  telegram: '#229ED9',
}

export default function ShareButtons({ url, title, className = '' }: Props) {
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Eski tarayıcı / izinsiz bağlam: gizli textarea ile kopyala.
      const ta = document.createElement('textarea')
      ta.value = url
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url })
    } catch {
      // Kullanıcı vazgeçti.
    }
  }

  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  const links = [
    { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    { key: 'x', label: 'X', href: `https://x.com/intent/post?text=${t}&url=${u}` },
    { key: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { key: 'telegram', label: 'Telegram', href: `https://t.me/share/url?url=${u}&text=${t}` },
  ] as const

  const btn = 'w-10 h-10 rounded-xl flex items-center justify-center transition-opacity hover:opacity-70'
  const btnStyle = { border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
      <span className="text-sm font-semibold mr-1" style={{ color: 'var(--text-muted)' }}>
        Paylaş
      </span>
      <button
        type="button"
        onClick={copy}
        className={`${btn} ${copied ? 'px-3 w-auto gap-1.5' : ''}`}
        style={{ ...btnStyle, color: copied ? 'var(--primary)' : 'var(--text)' }}
        aria-label={copied ? 'Bağlantı kopyalandı' : 'Bağlantıyı kopyala'}
        title="Bağlantıyı kopyala"
      >
        {copied ? <Check size={16} aria-hidden /> : <Link2 size={16} aria-hidden />}
        {copied && <span className="text-xs font-semibold">Kopyalandı</span>}
      </button>
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
          style={{ ...btnStyle, color: BRAND_COLORS[l.key] }}
          aria-label={`${l.label} ile paylaş`}
          title={`${l.label} ile paylaş`}
        >
          <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden>
            <path d={ICONS[l.key]} />
          </svg>
        </a>
      ))}
      {canNativeShare && (
        <button
          type="button"
          onClick={nativeShare}
          className={btn}
          style={{ ...btnStyle, color: 'var(--text)' }}
          aria-label="Diğer uygulamalarla paylaş"
          title="Diğer"
        >
          <Share2 size={16} aria-hidden />
        </button>
      )}
    </div>
  )
}
