import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppProvider } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthGuard from '@/components/AuthGuard'

export const metadata: Metadata = {
  title: 'Yöresel Tarifler — Lezzet Atlası',
  description:
    '107 yöresel tarif, 8 kıtadan özenle seçilmiş dünya lezzetleri. Favori tariflerinizi kaydedin, alışveriş listesi oluşturun.',
  keywords: 'tarif, yemek, dünya mutfağı, yöresel, recipe, lezzet atlası',
  openGraph: {
    title: 'Yöresel Tarifler — Lezzet Atlası',
    description: '8 kıtadan 107 özgün yöresel tarif',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
