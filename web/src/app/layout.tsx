import type { Metadata } from 'next'
import Script from 'next/script'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppProvider } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Yayıncı ID'si tanımlıysa AdSense script'i yüklenir (bkz. AdSlot.tsx).
// Tanımlı değilse script hiç eklenmez -- boşuna network isteği/CSP uyarısı yok.
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoreseltarif.com'

// Site artık herkese açık (AuthGuard kaldırıldı, 2026-08-19) -- Google
// indexleyebilir.
const SITE_IS_PUBLIC = true

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Yöresel Tarif — Lezzet Atlası',
  description:
    '1000\'den fazla yöresel tarif, dünyanın dört bir yanından özenle seçilmiş lezzetler. Favori tariflerinizi kaydedin, alışveriş listesi oluşturun.',
  keywords: 'tarif, yemek, dünya mutfağı, yöresel, recipe, lezzet atlası',
  robots: SITE_IS_PUBLIC ? undefined : { index: false, follow: false },
  openGraph: {
    title: 'Yöresel Tarif — Lezzet Atlası',
    description: 'Dünyanın dört bir yanından 1000\'den fazla özgün yöresel tarif',
    type: 'website',
  },
  verification: {
    google: 'bGfnIuyP7Ny7f2u_gAhdN0BIDqZubrma-OxRh3E0KIc',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        {ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>
        <AuthProvider>
          <AppProvider>
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
