import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

// Reklam / paylaşım için tek "uygulamayı indir" linki: yoreseltarif.com/indir
//
// Meta "Trafik" kampanyaları doğrudan Play Store / App Store URL'sini kabul
// etmiyor (yalnızca "Uygulama Yüklemeleri" amacında). Bu sayfa normal bir web
// sayfası olarak reklama girer, mobil ziyaretçiyi sunucu tarafında doğru
// mağazaya yönlendirir; masaüstü ve bot ziyaretçilere iki mağaza butonu gösterir.
//
// UTM parametreleri mağazaya taşınır:
//   Android -> Play "referrer" (Play Console > Kullanıcı edinme > UTM kampanyaları)
//   iOS     -> App Store "ct" (App Store Connect > Uygulama Analizi > Kampanyalar,
//              yalnızca APP_STORE_PROVIDER_TOKEN dolu ise sayılır)
//
// Örnek reklam linki:
//   https://yoreseltarif.com/indir?utm_source=meta&utm_medium=paid&utm_campaign=test1&utm_content=video1

const ANDROID_PACKAGE = 'com.cagatay58.yoreseltarifuygulamasi'
const APP_STORE_ID = '6801889814'
// App Store Connect > Uygulama Analizi > Kampanya oluşturucu'daki "pt" değeri.
// Boşken link yine çalışır, sadece kampanya kırılımı App Store Connect'te görünmez.
const APP_STORE_PROVIDER_TOKEN = ''

const PLAY_BASE = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`
const APP_STORE_BASE = `https://apps.apple.com/tr/app/id${APP_STORE_ID}`

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

type SearchParams = Record<string, string | string[] | undefined>

function pick(params: SearchParams, key: string): string | undefined {
  const v = params[key]
  const s = Array.isArray(v) ? v[0] : v
  if (!s) return undefined
  // Mağaza linkine gömüleceği için makul uzunluk ve karakter sınırı
  const clean = s.slice(0, 100).replace(/[^\w.\-]/g, '_')
  return clean || undefined
}

function utmFrom(params: SearchParams): Partial<Record<(typeof UTM_KEYS)[number], string>> {
  const utm: Partial<Record<(typeof UTM_KEYS)[number], string>> = {}
  for (const k of UTM_KEYS) {
    const v = pick(params, k)
    if (v) utm[k] = v
  }
  // Parametresiz gelenler de Play Console'da ayrı görünsün
  if (!utm.utm_source) {
    utm.utm_source = 'yoreseltarif.com'
    utm.utm_medium = utm.utm_medium || 'indir'
  }
  return utm
}

function playUrl(params: SearchParams): string {
  const referrer = new URLSearchParams(utmFrom(params) as Record<string, string>).toString()
  return `${PLAY_BASE}&referrer=${encodeURIComponent(referrer)}`
}

function appStoreUrl(params: SearchParams): string {
  if (!APP_STORE_PROVIDER_TOKEN) return APP_STORE_BASE
  const utm = utmFrom(params)
  // Apple kampanya adı en fazla 40 karakter
  const ct = [utm.utm_source, utm.utm_campaign, utm.utm_content].filter(Boolean).join('_').slice(0, 40)
  const q = new URLSearchParams({ pt: APP_STORE_PROVIDER_TOKEN, ct, mt: '8' })
  return `${APP_STORE_BASE}?${q.toString()}`
}

function detectPlatform(ua: string): 'android' | 'ios' | 'other' {
  if (/android/i.test(ua)) return 'android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  return 'other'
}

export const metadata: Metadata = {
  title: 'Uygulamayı İndir — Yöresel Tarif',
  description: '1.000+ yöresel ve dünya tarifi, adım adım. iOS ve Android için ücretsiz.',
  robots: { index: false, follow: true },
}

export default async function IndirPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const ua = (await headers()).get('user-agent') || ''
  const platform = detectPlatform(ua)

  if (platform === 'android') redirect(playUrl(params))
  if (platform === 'ios') redirect(appStoreUrl(params))

  const play = playUrl(params)
  const appStore = appStoreUrl(params)

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">🍲</div>
      <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--text)' }}>
        Yöresel Tarif uygulamasını indir
      </h1>
      <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
        1.000&apos;den fazla yöresel ve dünya tarifi, adım adım anlatım, alışveriş listesi ve tarif
        pasaportu. iOS ve Android için ücretsiz.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={appStore}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-xl"
          style={{ background: '#B97A1A' }}
        >
          🍎 App Store&apos;dan indir
        </a>
        <a
          href={play}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-xl"
          style={{ background: '#B97A1A' }}
        >
          🤖 Google Play&apos;den indir
        </a>
      </div>
    </div>
  )
}
