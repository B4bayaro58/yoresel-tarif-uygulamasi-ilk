import Link from 'next/link'
import { ArrowLeft, Mail, MapPin, Instagram, Youtube, Twitter } from 'lucide-react'

export const metadata = { title: 'İletişim — Yöresel Tarifler' }

const CHANNELS = [
  { icon: Mail, label: 'E-posta', value: 'info@yoreseltarif.com', href: 'mailto:info@yoreseltarif.com' },
  { icon: MapPin, label: 'Konum', value: 'Türkiye', href: undefined },
]

const SOCIAL = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Twitter, label: 'Twitter / X', href: '#' },
]

export default function IletisimPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={15} />
        Ana Sayfa
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
        >
          ✉️
        </div>
        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>
          İletişim
        </h1>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Sorularınız, önerileriniz veya geri bildirimleriniz için bize ulaşın.
      </p>

      <div
        className="rounded-2xl p-6 sm:p-8 flex flex-col gap-5 mb-6"
        style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
      >
        {CHANNELS.map((c) => {
          const Icon = c.icon
          const content = (
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}
              >
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{c.label}</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{c.value}</p>
              </div>
            </div>
          )
          return c.href ? (
            <a key={c.label} href={c.href} className="hover:opacity-80 transition-opacity">{content}</a>
          ) : (
            <div key={c.label}>{content}</div>
          )
        })}
      </div>

      <div className="flex items-center gap-2 mb-8">
        {SOCIAL.map((s) => {
          const Icon = s.icon
          return (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', backgroundColor: 'var(--card)' }}
            >
              <Icon size={17} />
            </a>
          )
        })}
      </div>

      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Bir tarif önermek mi istiyorsunuz?{' '}
        <Link href="/tarif-oner" className="underline font-medium" style={{ color: 'var(--primary)' }}>
          Tarif Öner
        </Link>{' '}
        sayfasından gönderebilirsiniz. Sık sorulan sorular için{' '}
        <Link href="/sss" className="underline font-medium" style={{ color: 'var(--primary)' }}>
          SSS
        </Link>{' '}
        sayfamıza göz atın.
      </p>
    </div>
  )
}
