import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoreseltarif.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Admin ve oturum gerektiren, arama motoru için anlamsız sayfalar
        disallow: ['/admin', '/login', '/setup-admin', '/profile', '/favorites', '/shopping-list'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
