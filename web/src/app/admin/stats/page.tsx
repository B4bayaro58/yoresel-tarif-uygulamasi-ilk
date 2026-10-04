'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Eye, Users, Newspaper, UtensilsCrossed } from 'lucide-react'
import {
  collection,
  doc,
  documentId,
  getAggregateFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  sum,
  where,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { todayKey } from '@/lib/viewStats'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

// Görüntülenme sayaçları web/src/lib/viewStats.ts ve mobil viewStatsService.js
// tarafından yazılıyor. Bu sayfa maliyet bilinciyle okuyor: toplamlar sunucu
// tarafı sum() ile (1000 doküman başına 1 okuma), tarif listesi ilk N ile
// sınırlı, isimler önce statik katalogdan çözülüyor.

const localRecipes: any[] = (RECIPES_DATA as any).tr || []
const localById = new Map<string, any>(localRecipes.map((r) => [String(r.id), r]))

const RANGES = [7, 30, 90] as const
const TOP_LIMIT = 50

interface DayStat {
  day: string
  recipeViews: number
  blogViews: number
  visitors: number
}

interface ItemStat {
  id: string
  views: number
  uniqueViews: number
  name?: string
  href?: string
}

const fmt = (n: number) => n.toLocaleString('tr-TR')

function daysBack(n: number): string[] {
  const out: string[] = []
  const d = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i)
    out.push(todayKey(x))
  }
  return out
}

function shortDay(key: string) {
  const [, m, d] = key.split('-')
  return `${d}.${m}`
}

export default function AdminStatsPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]>(30)
  const [daily, setDaily] = useState<Map<string, DayStat>>(new Map())
  const [totals, setTotals] = useState<{ recipeViews: number; recipeUnique: number; blogViews: number; blogUnique: number } | null>(null)
  const [topRecipes, setTopRecipes] = useState<ItemStat[] | null>(null)
  const [recipeSort, setRecipeSort] = useState<'views' | 'uniqueViews'>('views')
  const [blogItems, setBlogItems] = useState<ItemStat[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Toplamlar + blog (bir kez)
  useEffect(() => {
    const load = async () => {
      try {
        // Her sum() ayrı sorgu: tek sorguda iki alanı toplamak bileşik index
        // (uniqueViews+views) istiyor, tek alanlı toplam otomatik index'le çalışıyor
        const total = async (col: string, field: string) =>
          (await getAggregateFromServer(collection(db, col), { s: sum(field) })).data().s || 0
        const [recipeViews, recipeUnique, blogViews, blogUnique, blogStatsSnap, postsSnap] = await Promise.all([
          total('recipeStats', 'views'),
          total('recipeStats', 'uniqueViews'),
          total('blogStats', 'views'),
          total('blogStats', 'uniqueViews'),
          getDocs(collection(db, 'blogStats')),
          getDocs(collection(db, 'blogPosts')),
        ])
        setTotals({ recipeViews, recipeUnique, blogViews, blogUnique })
        const statById = new Map(blogStatsSnap.docs.map((d) => [d.id, d.data()]))
        // Hiç okunmamış yazılar da 0 ile listede görünsün
        const items: ItemStat[] = postsSnap.docs.map((p) => {
          const s: any = statById.get(p.id) || {}
          const data: any = p.data()
          return {
            id: p.id,
            name: data.title || '(başlıksız)',
            href: data.status === 'published' ? `/blog/${data.slug}` : `/admin/blog/${p.id}`,
            views: s.views || 0,
            uniqueViews: s.uniqueViews || 0,
          }
        })
        items.sort((a, b) => b.views - a.views)
        setBlogItems(items)
      } catch (e: any) {
        console.error(e)
        setError(e?.message || 'İstatistikler yüklenemedi')
      }
    }
    load()
  }, [])

  // Günlük seri (aralık değişince)
  useEffect(() => {
    const load = async () => {
      try {
        const keys = daysBack(range)
        const snap = await getDocs(query(collection(db, 'statsDaily'), where(documentId(), '>=', keys[0])))
        const map = new Map<string, DayStat>()
        snap.docs.forEach((d) => {
          const x: any = d.data()
          map.set(d.id, { day: d.id, recipeViews: x.recipeViews || 0, blogViews: x.blogViews || 0, visitors: x.visitors || 0 })
        })
        setDaily(map)
      } catch (e: any) {
        console.error(e)
        setError(e?.message || 'Günlük istatistikler yüklenemedi')
      }
    }
    load()
  }, [range])

  // En çok görüntülenen tarifler (sıralama değişince)
  useEffect(() => {
    const load = async () => {
      setTopRecipes(null)
      try {
        const snap = await getDocs(query(collection(db, 'recipeStats'), orderBy(recipeSort, 'desc'), limit(TOP_LIMIT)))
        const items: ItemStat[] = await Promise.all(
          snap.docs.map(async (d) => {
            const x: any = d.data()
            const item: ItemStat = { id: d.id, views: x.views || 0, uniqueViews: x.uniqueViews || 0, href: `/recipes/${d.id}` }
            const local = localById.get(d.id)
            if (local) {
              item.name = local.name
            } else {
              // Statik katalogda olmayan = Firebase-native tarif, adını tek tek çöz
              try {
                const r = await getDoc(doc(db, 'recipes', d.id))
                item.name = r.exists() ? (r.data() as any).name : undefined
              } catch { /* ignore */ }
            }
            return item
          }),
        )
        setTopRecipes(items)
      } catch (e: any) {
        console.error(e)
        setError(e?.message || 'Tarif istatistikleri yüklenemedi')
      }
    }
    load()
  }, [recipeSort])

  const series = useMemo(
    () => daysBack(range).map((day) => daily.get(day) || { day, recipeViews: 0, blogViews: 0, visitors: 0 }),
    [daily, range],
  )
  const rangeTotals = useMemo(
    () =>
      series.reduce(
        (acc, d) => ({ views: acc.views + d.recipeViews + d.blogViews, visitors: acc.visitors + d.visitors }),
        { views: 0, visitors: 0 },
      ),
    [series],
  )
  const today = series[series.length - 1]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>İstatistikler</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tarif ve blog görüntülenmeleri (web + mobil)</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ backgroundColor: 'rgba(196,89,58,0.1)', color: 'var(--spice)' }}>
          {error}
        </div>
      )}

      {/* Özet kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatTile icon={<Eye size={16} />} label="Bugün görüntülenme" value={today ? fmt(today.recipeViews + today.blogViews) : '…'} sub={today ? `${fmt(today.visitors)} ziyaretçi` : undefined} />
        <StatTile icon={<Users size={16} />} label={`Son ${range} gün`} value={fmt(rangeTotals.views)} sub={`${fmt(rangeTotals.visitors)} günlük ziyaretçi toplamı`} />
        <StatTile icon={<UtensilsCrossed size={16} />} label="Tarif görüntülenme (toplam)" value={totals ? fmt(totals.recipeViews) : '…'} sub={totals ? `${fmt(totals.recipeUnique)} tekil kişi` : undefined} />
        <StatTile icon={<Newspaper size={16} />} label="Blog okunma (toplam)" value={totals ? fmt(totals.blogViews) : '…'} sub={totals ? `${fmt(totals.blogUnique)} tekil okuyucu` : undefined} />
      </div>

      {/* Günlük grafik */}
      <section className="rounded-2xl p-4 sm:p-5 mb-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Günlük görüntülenme</h2>
          <div className="flex gap-1 rounded-xl p-1" style={{ backgroundColor: 'var(--bg)' }}>
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="px-3 py-1 rounded-lg text-xs font-semibold"
                style={range === r ? { backgroundColor: 'var(--surface)', color: 'var(--text)', boxShadow: 'var(--shadow)' } : { color: 'var(--text-muted)' }}
              >
                {r} gün
              </button>
            ))}
          </div>
        </div>
        <DailyChart series={series} />
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tarifler */}
        <section className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between gap-3 px-4 py-3 flex-wrap" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>En çok görüntülenen tarifler</h2>
            <select
              value={recipeSort}
              onChange={(e) => setRecipeSort(e.target.value as any)}
              className="text-xs rounded-lg px-2 py-1"
              style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
            >
              <option value="views">Toplam görüntülenme</option>
              <option value="uniqueViews">Tekil kişi</option>
            </select>
          </div>
          <RecipeLookup />
          <ItemTable items={topRecipes} emptyText="Henüz tarif görüntülenmesi yok." />
        </section>

        {/* Blog */}
        <section className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Blog yazıları</h2>
          </div>
          <ItemTable items={blogItems} emptyText="Henüz blog yazısı yok." />
        </section>
      </div>

      <p className="text-[11px] mt-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        &quot;Tekil kişi&quot; cihaz/tarayıcı bazlı sayılır: aynı kişi farklı cihazdan girerse ya da tarayıcı verilerini silerse tekrar sayılır.
        Aynı cihazdan 30 dakika içindeki tekrar açılışlar görüntülenmeye eklenmez. Sayım bu özelliğin yayına alındığı günden itibaren başlar.
      </p>
    </div>
  )
}

function StatTile({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text)' }}>{value}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
    </div>
  )
}

function DailyChart({ series }: { series: DayStat[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const totals = series.map((d) => d.recipeViews + d.blogViews)
  const max = Math.max(1, ...totals)
  // Eksen için yuvarlak bir üst değer
  const step = Math.pow(10, Math.floor(Math.log10(max)))
  const top = Math.ceil(max / step) * step
  const labelEvery = series.length > 30 ? 14 : series.length > 7 ? 5 : 1
  const h = series[hover ?? -1]

  return (
    <div>
      <div className="relative">
        <div className="flex gap-2">
          {/* y ekseni */}
          <div className="flex flex-col justify-between text-[10px] tabular-nums text-right h-44 py-0" style={{ color: 'var(--text-muted)', minWidth: '2rem' }}>
            <span>{fmt(top)}</span>
            <span>{fmt(Math.round(top / 2))}</span>
            <span>0</span>
          </div>
          <div className="relative flex-1 h-44" onMouseLeave={() => setHover(null)}>
            {/* ızgara */}
            {[0, 0.5, 1].map((f) => (
              <div key={f} className="absolute left-0 right-0" style={{ top: `${f * 100}%`, borderTop: '1px solid var(--border)', opacity: f === 1 ? 1 : 0.6 }} />
            ))}
            <div className="absolute inset-0 flex items-end" style={{ gap: '2px' }}>
              {series.map((d, i) => {
                const v = totals[i]
                return (
                  <div
                    key={d.day}
                    className="relative flex-1 h-full flex items-end cursor-default"
                    onMouseEnter={() => setHover(i)}
                    aria-label={`${shortDay(d.day)}: ${v} görüntülenme`}
                  >
                    <div
                      className="w-full"
                      style={{
                        height: v > 0 ? `max(2px, ${(v / top) * 100}%)` : 0,
                        backgroundColor: 'var(--chart-bar)',
                        borderRadius: '4px 4px 0 0',
                        opacity: hover === null || hover === i ? 1 : 0.45,
                        transition: 'opacity 120ms',
                      }}
                    />
                  </div>
                )
              })}
            </div>
            {h && (
              <div
                className="absolute z-10 pointer-events-none rounded-xl px-3 py-2 text-xs whitespace-nowrap"
                style={{
                  left: `${((hover! + 0.5) / series.length) * 100}%`,
                  top: 0,
                  transform: `translateX(${hover! > series.length / 2 ? 'calc(-100% - 8px)' : '8px'})`,
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-hover)',
                  color: 'var(--text)',
                }}
              >
                <p className="font-semibold mb-1">{h.day.split('-').reverse().join('.')}</p>
                <p className="tabular-nums">Tarif: <b>{fmt(h.recipeViews)}</b></p>
                <p className="tabular-nums">Blog: <b>{fmt(h.blogViews)}</b></p>
                <p className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{fmt(h.visitors)} ziyaretçi</p>
              </div>
            )}
          </div>
        </div>
        {/* x ekseni */}
        <div className="flex mt-1.5" style={{ marginLeft: 'calc(2rem + 0.5rem)', gap: '2px' }}>
          {series.map((d, i) => (
            <div key={d.day} className="flex-1 text-[10px] text-center tabular-nums overflow-visible whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
              {(series.length - 1 - i) % labelEvery === 0 ? shortDay(d.day) : ''}
            </div>
          ))}
        </div>
      </div>
      {/* Erişilebilir tablo görünümü */}
      <details className="mt-3">
        <summary className="text-xs cursor-pointer" style={{ color: 'var(--text-muted)' }}>Tablo olarak göster</summary>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs tabular-nums">
            <thead>
              <tr style={{ color: 'var(--text-muted)' }}>
                <th className="text-left py-1 font-medium">Gün</th>
                <th className="text-right py-1 font-medium">Tarif</th>
                <th className="text-right py-1 font-medium">Blog</th>
                <th className="text-right py-1 font-medium">Ziyaretçi</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text)' }}>
              {[...series].reverse().map((d) => (
                <tr key={d.day} style={{ borderTop: '1px solid var(--border)' }}>
                  <td className="py-1">{d.day.split('-').reverse().join('.')}</td>
                  <td className="text-right py-1">{fmt(d.recipeViews)}</td>
                  <td className="text-right py-1">{fmt(d.blogViews)}</td>
                  <td className="text-right py-1">{fmt(d.visitors)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

function ItemTable({ items, emptyText }: { items: ItemStat[] | null; emptyText: string }) {
  if (items === null) {
    return (
      <div className="p-4 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-8 rounded-lg" />)}
      </div>
    )
  }
  if (items.length === 0) {
    return <p className="p-6 text-sm text-center" style={{ color: 'var(--text-muted)' }}>{emptyText}</p>
  }
  return (
    <div className="max-h-[520px] overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0" style={{ backgroundColor: 'var(--surface)' }}>
          <tr className="text-xs" style={{ color: 'var(--text-muted)' }}>
            <th className="text-left font-medium px-4 py-2 w-8">#</th>
            <th className="text-left font-medium py-2">Başlık</th>
            <th className="text-right font-medium py-2 px-2">Görüntülenme</th>
            <th className="text-right font-medium py-2 pr-4">Kişi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={it.id} style={{ borderTop: '1px solid var(--border)' }}>
              <td className="px-4 py-2 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
              <td className="py-2 max-w-0 w-full">
                {it.href ? (
                  <Link href={it.href} target="_blank" className="block truncate hover:underline" style={{ color: 'var(--text)' }}>
                    {it.name || it.id}
                  </Link>
                ) : (
                  <span className="block truncate" style={{ color: 'var(--text)' }}>{it.name || it.id}</span>
                )}
              </td>
              <td className="py-2 px-2 text-right tabular-nums font-semibold" style={{ color: 'var(--text)' }}>{fmt(it.views)}</td>
              <td className="py-2 pr-4 text-right tabular-nums" style={{ color: 'var(--text-muted)' }}>{fmt(it.uniqueViews)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// İlk 50'de olmayan bir tarifin sayısını görmek için: isimle ara, tek doküman oku
function RecipeLookup() {
  const [q, setQ] = useState('')
  const [result, setResult] = useState<{ name: string; views: number; uniqueViews: number } | 'loading' | null>(null)

  const matches = useMemo(() => {
    const term = q.trim().toLocaleLowerCase('tr-TR')
    if (term.length < 2) return []
    return localRecipes.filter((r) => String(r.name || '').toLocaleLowerCase('tr-TR').includes(term)).slice(0, 6)
  }, [q])

  const pick = async (r: any) => {
    setQ('')
    setResult('loading')
    try {
      const snap = await getDoc(doc(db, 'recipeStats', String(r.id)))
      const x: any = snap.exists() ? snap.data() : {}
      setResult({ name: r.name, views: x.views || 0, uniqueViews: x.uniqueViews || 0 })
    } catch {
      setResult(null)
    }
  }

  return (
    <div className="px-4 py-3 relative" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
        <Search size={14} style={{ color: 'var(--text-muted)' }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Bir tarifin sayısını ara…"
          autoCorrect="off"
          spellCheck={false}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: 'var(--text)' }}
        />
      </div>
      {matches.length > 0 && (
        <div className="absolute left-4 right-4 z-20 mt-1 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-hover)' }}>
          {matches.map((r) => (
            <button key={r.id} onClick={() => pick(r)} className="block w-full text-left px-3 py-2 text-sm hover:opacity-70" style={{ color: 'var(--text)' }}>
              {r.name}
            </button>
          ))}
        </div>
      )}
      {result === 'loading' && <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Yükleniyor…</p>}
      {result && result !== 'loading' && (
        <p className="text-xs mt-2" style={{ color: 'var(--text)' }}>
          <b>{result.name}</b>: {fmt(result.views)} görüntülenme · {fmt(result.uniqueViews)} kişi
        </p>
      )}
    </div>
  )
}
