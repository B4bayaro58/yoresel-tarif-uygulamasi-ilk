import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppProvider } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthGuard from '@/components/AuthGuard'

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Yöresel Tarifler — Lezzet Atlası',
  description:
    '1000\'den fazla yöresel tarif, 8 kıtadan özenle seçilmiş dünya lezzetleri. Favori tariflerinizi kaydedin, alışveriş listesi oluşturun.',
  keywords: 'tarif, yemek, dünya mutfağı, yöresel, recipe, lezzet atlası',
  openGraph: {
    title: 'Yöresel Tarifler — Lezzet Atlası',
    description: '8 kıtadan 1000\'den fazla özgün yöresel tarif',
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
      </head>
      <body>
        <AuthProvider>
          <AppProvider>
            <AuthGuard>
              <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </AuthGuard>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
