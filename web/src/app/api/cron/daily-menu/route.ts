// Günlük cron (web/vercel.json, her gün 07:00 UTC = 10:00 TR civarı):
// mağazadaki ESKİ mobil sürümler (≤1.0.0) günün menüsünü kendileri
// hesaplamıyor, yalnızca settings/dailyMenu.recipeIds listesini okuyor —
// bu yüzden onlarda menü hep sabit kalıyordu. Bu uç nokta web anasayfasıyla
// (app/page.tsx) birebir aynı tarif havuzundan otomatik menüyü hesaplayıp
// `auto: true` işaretiyle yazar. Yeni istemciler (web + mobil ≥1.1.0) `auto`
// kayıtları yok sayıp aynı menüyü kendileri hesaplar (@shared/dailyMenu).
//
// Gerekli Vercel ortam değişkenleri:
//   FIREBASE_SERVICE_ACCOUNT_KEY  servis hesabı JSON'u (tek satır ya da base64)
//   CRON_SECRET                   Vercel cron isteğine "Authorization: Bearer <değer>" ekler
import { NextResponse } from 'next/server'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'
// @ts-ignore
import { pickAutoDailyMenu, canonicalRecipeId, getMenuDateKey } from '@shared/dailyMenu'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PUBLIC_STATUSES = ['published', 'approved']
const FETCH_LIMIT = 3000 // app/page.tsx FIRESTORE_OVERRIDE_FETCH_LIMIT ile aynı

function adminDb() {
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY tanımlı değil')
    const json = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8')
    initializeApp({ credential: cert(JSON.parse(json)) })
  }
  return getFirestore()
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const db = adminDb()
    const menuRef = db.doc('settings/dailyMenu')
    const today = getMenuDateKey()

    // Admin bugün için elle menü kaydettiyse ona dokunma.
    const current = await menuRef.get()
    const cur = current.exists ? current.data() : null
    if (cur && cur.menuDate === today && cur.auto !== true && Array.isArray(cur.recipeIds) && cur.recipeIds.length > 0) {
      return NextResponse.json({ skipped: 'manual menu for today', menuDate: today })
    }

    // app/page.tsx ile aynı havuz: override edilmemiş statik tarifler + yayında Firebase tarifleri.
    const [publicSnap, overridesSnap] = await Promise.all([
      db.collection('recipes').where('status', 'in', PUBLIC_STATUSES).limit(FETCH_LIMIT).get(),
      db.collection('recipes').where('overridesStaticId', '!=', null).limit(FETCH_LIMIT).get(),
    ])
    const firestore = new Map<string, any>()
    for (const snap of [publicSnap, overridesSnap]) {
      snap.docs.forEach((d) => firestore.set(d.id, { id: d.id, ...d.data() }))
    }
    const all = Array.from(firestore.values())
    const overriddenIds = new Set(all.filter((r) => r.overridesStaticId != null).map((r) => String(r.overridesStaticId)))
    const pool = new Map<string, any>()
    ;((RECIPES_DATA as any).tr || [])
      .filter((r: any) => !overriddenIds.has(String(r.id)))
      .forEach((r: any) => pool.set(String(r.id), r))
    all.filter((r) => PUBLIC_STATUSES.includes(r.status)).forEach((r) => pool.set(r.id, r))

    const menu = pickAutoDailyMenu(Array.from(pool.values()))
    // Eski mobil sürüm kimliği `r.id === id || r.overridesStaticId === id` ile
    // buluyor; statik kimlik (canonical) iki durumu da karşılıyor.
    const recipeIds: string[] = menu.map(canonicalRecipeId)
    if (recipeIds.length === 0) {
      return NextResponse.json({ error: 'empty menu' }, { status: 500 })
    }

    await menuRef.set({ recipeIds, menuDate: today, auto: true, updatedAt: FieldValue.serverTimestamp() })
    return NextResponse.json({ ok: true, menuDate: today, recipeIds })
  } catch (e: any) {
    console.error('daily-menu cron failed:', e)
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}
