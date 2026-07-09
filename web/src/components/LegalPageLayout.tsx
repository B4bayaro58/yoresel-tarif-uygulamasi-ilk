import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface LegalPageLayoutProps {
  emoji: string
  title: string
  updatedAt: string
  children: React.ReactNode
}

export default function LegalPageLayout({ emoji, title, updatedAt, children }: LegalPageLayoutProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
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
          {emoji}
        </div>
        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>
          {title}
        </h1>
      </div>
      <p className="text-xs mb-8" style={{ color: 'var(--text-muted)' }}>
        Son güncelleme: {updatedAt}
      </p>

      <div
        className="rounded-2xl p-6 sm:p-8 legal-content"
        style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
      >
        {children}
      </div>
    </div>
  )
}
