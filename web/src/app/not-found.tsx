import Link from 'next/link'

export const metadata = { title: 'Sayfa Bulunamadı — Yöresel Tarif' }

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4" aria-hidden>🍲</div>
      <h1 className="font-display font-bold text-2xl mb-3" style={{ color: 'var(--text)' }}>
        Aradığınız sayfa bulunamadı
      </h1>
      <p className="mb-8 text-[15px]" style={{ color: 'var(--text-muted)' }}>
        Bağlantı değişmiş ya da sayfa kaldırılmış olabilir. Ana sayfadan veya tarif dizininden
        aradığınız lezzete ulaşabilirsiniz.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary px-6 py-3 rounded-2xl font-semibold text-sm">
          Ana Sayfa
        </Link>
        <Link
          href="/recipes"
          className="px-6 py-3 rounded-2xl font-semibold text-sm border"
          style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
        >
          Tüm Tarifler
        </Link>
      </div>
    </div>
  )
}
