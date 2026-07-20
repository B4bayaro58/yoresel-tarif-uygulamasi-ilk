import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@shared': path.resolve(__dirname, '../src/constants'),
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },
  // www ve apex aynı içeriği 200 ile dönüyordu (Google için yinelenen içerik
  // riski) — www'yi kalıcı olarak apex'e yönlendirip tek bir kanonik host
  // bırakıyoruz. Vercel bu host-koşullu redirect'i edge'de uyguluyor.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.yoreseltarif.com' }],
        destination: 'https://yoreseltarif.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
