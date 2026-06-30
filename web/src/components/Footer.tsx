'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'
import { Instagram, Youtube, Twitter, Mail, MapPin, Phone } from 'lucide-react'

const FOOTER_LINKS = {
  discover: [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Tarifler', href: '/recipes' },
    { label: 'Favoriler', href: '/favorites' },
    { label: 'Alışveriş Listesi', href: '/shopping-list' },
  ],
  account: [
    { label: 'Giriş Yap / Kayıt Ol', href: '/login' },
    { label: 'Profilim', href: '/profile' },
  ],
  legal: [
    { label: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
    { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
    { label: 'KVKK Aydınlatma Metni', href: '/kvkk' },
    { label: 'Çerez Politikası', href: '/cerez-politikasi' },
    { label: 'İçerik Politikası', href: '/icerik-politikasi' },
  ],
  support: [
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'İletişim', href: '/iletisim' },
    { label: 'Sıkça Sorulan Sorular', href: '/sss' },
    { label: 'Tarif Öner', href: '/tarif-oner' },
  ],
}

const SOCIAL = [
  { icon: <Instagram size={18} />, href: '#', label: 'Instagram' },
  { icon: <Youtube size={18} />, href: '#', label: 'YouTube' },
  { icon: <Twitter size={18} />, href: '#', label: 'Twitter / X' },
]

export default function Footer() {
  const { isDark } = useApp()
  const year = new Date().getFullYear()

  return (
    <footer style={{ borderTop: '1px solid var(--border)' }}>

      {/* ── Mobil uygulama CTA ─────────────────────────── */}
      <div
        className="py-10 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative z-10 max-w-lg mx-auto">
          <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
            Mobil Uygulama
          </p>
          <h3 className="font-display text-white text-2xl font-bold mb-2">
            Tarifleri Cebinizde Taşıyın
          </h3>
          <p className="text-white/75 text-sm mb-5">
            iOS ve Android için ücretsiz indirin
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-white/25 transition-colors">
              🍎 App Store
            </span>
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-white/25 transition-colors">
              🤖 Google Play
            </span>
          </div>
        </div>
      </div>

      {/* ── Ana Footer Gövdesi ─────────────────────────── */}
      <div style={{ backgroundColor: isDark ? '#1A110A' : '#FAF6F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

            {/* Marka Sütunu */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Yöresel Tarif"
                  width={440}
                  height={176}
                  className="object-contain"
                  style={{ maxHeight: '160px', width: 'auto' }}
                />
              </Link>
              <p className="text-xs leading-relaxed max-w-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Tüm dünyadan binlerce yöresel tarifi tek platformda keşfedin. Geleneksel lezzetleri modern
                bir deneyimle sunuyoruz.
              </p>

              {/* İletişim */}
              <div className="flex flex-col gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <a href="mailto:info@yoreseltarif.com" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Mail size={14} style={{ color: 'var(--primary)' }} />
                  info@yoreseltarif.com
                </a>
                <span className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: 'var(--primary)' }} />
                  Türkiye
                </span>
              </div>

              {/* Sosyal Medya */}
              <div className="flex items-center gap-2">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                    style={{
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)',
                      backgroundColor: 'var(--card)',
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Keşfet */}
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Keşfet
              </h4>
              <ul className="flex flex-col gap-2.5">
                {FOOTER_LINKS.discover.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destek */}
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Destek
              </h4>
              <ul className="flex flex-col gap-2.5">
                {FOOTER_LINKS.support.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Yasal */}
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Yasal
              </h4>
              <ul className="flex flex-col gap-2.5">
                {FOOTER_LINKS.legal.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Divider ─────────────────────────────────── */}
          <div className="mt-12 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <p>
                © {year} <strong style={{ color: 'var(--primary)' }}>yoreseltarif.com</strong> — Tüm hakları saklıdır.
              </p>
              <p className="text-center sm:text-right leading-relaxed">
                Bu site, 6698 sayılı KVKK kapsamında kişisel verilerinizi koruma altına almaktadır.
                &nbsp;|&nbsp;
                <Link href="/kvkk" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
                  KVKK
                </Link>
                &nbsp;·&nbsp;
                <Link href="/gizlilik-politikasi" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
                  Gizlilik
                </Link>
                &nbsp;·&nbsp;
                <Link href="/cerez-politikasi" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
                  Çerezler
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}
