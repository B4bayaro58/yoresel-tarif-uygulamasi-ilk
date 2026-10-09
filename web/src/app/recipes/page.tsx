import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Recipe } from '@/types'
import { getPublicRecipes } from '@/lib/publicRecipes'

// Tüm tariflerin bölge bölge dizini. Footer'daki "Tarifler" bağlantısı
// eskiden 404'e gidiyordu; bu sayfa hem o boşluğu kapatıyor hem de arama
// motorlarına her tarife ana sayfadaki karıştırılmış listeden bağımsız,
// kalıcı bir iç bağlantı yolu veriyor.
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Tüm Tarifler — Şehir Şehir Türk Mutfağı ve Dünya Mutfağı | Yöresel Tarif',
  description: "Türkiye'nin 90'dan fazla şehrinden yöresel tarifler ve dünyanın dört bir yanından mutfak klasikleri. Tüm tarifleri şehir, ülke ve kıtaya göre keşfedin.",
  alternates: { canonical: '/recipes' },
}

const CONTINENT_LABELS: Record<string, string> = {
  europe: 'Avrupa',
  asia: 'Asya',
  'middle-east': 'Orta Doğu',
  africa: 'Afrika',
  'north-america': 'Kuzey Amerika',
  'central-america': 'Orta Amerika',
  'south-america': 'Güney Amerika',
  oceania: 'Okyanusya',
}
const CONTINENT_ORDER = Object.keys(CONTINENT_LABELS)

const trSort = (a: string, b: string) => a.localeCompare(b, 'tr')

function groupBy<T>(items: T[], keyOf: (item: T) => string): [string, T[]][] {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const key = keyOf(item)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(item)
  }
  return Array.from(map.entries())
}

function RecipeLinks({ recipes }: { recipes: Recipe[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
      {[...recipes].sort((a, b) => trSort(a.name, b.name)).map((r) => (
        <li key={r.id}>
          <Link href={`/recipes/${r.id}`} className="text-sm hover:underline" style={{ color: 'var(--text)' }}>
            {r.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="py-4" style={{ borderTop: '1px solid var(--border)' }}>
      <h3 className="font-display font-bold text-base mb-2" style={{ color: 'var(--text)' }}>
        {title} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>({count})</span>
      </h3>
      {children}
    </div>
  )
}

export default async function RecipesIndexPage() {
  const recipes = await getPublicRecipes()

  const turkish = recipes.filter((r) => r.country === 'Türkiye')
  const world = recipes.filter((r) => r.country !== 'Türkiye')

  const cities = groupBy(turkish, (r) => r.city || 'Diğer').sort(([a], [b]) =>
    a === 'Diğer' ? 1 : b === 'Diğer' ? -1 : trSort(a, b)
  )
  const continents = groupBy(world, (r) => (CONTINENT_LABELS[r.continent] ? r.continent : 'other')).sort(
    ([a], [b]) => (CONTINENT_ORDER.indexOf(a) + 1 || 99) - (CONTINENT_ORDER.indexOf(b) + 1 || 99)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={15} />
        Ana Sayfa
      </Link>

      <h1 className="font-display font-bold mb-2" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--text)' }}>
        Tüm Tarifler
      </h1>
      <p className="text-sm mb-6 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
        Türkiye&apos;nin {cities.length} şehrinden {turkish.length} yöresel tarif ve dünya mutfaklarından {world.length} tarif.
        Aradığınız lezzeti şehrine, ülkesine ya da kıtasına göre bulun.
      </p>

      <nav className="flex flex-wrap gap-2 mb-10" aria-label="Bölümler">
        <a href="#turk-mutfagi" className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}>
          Türk Mutfağı
        </a>
        {continents.map(([key]) => (
          <a key={key} href={`#${key}`} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ border: '1px solid var(--border)', color: 'var(--text)' }}>
            {CONTINENT_LABELS[key] || 'Diğer'}
          </a>
        ))}
      </nav>

      <section id="turk-mutfagi" className="mb-12 scroll-mt-24">
        <h2 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text)' }}>Türk Mutfağı</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Şehir şehir Anadolu&apos;nun yöresel lezzetleri.</p>
        {cities.map(([city, list]) => (
          <Group key={city} title={city} count={list.length}>
            <RecipeLinks recipes={list} />
          </Group>
        ))}
      </section>

      {continents.map(([key, list]) => (
        <section key={key} id={key} className="mb-12 scroll-mt-24">
          <h2 className="font-display font-bold text-2xl mb-4" style={{ color: 'var(--text)' }}>
            {CONTINENT_LABELS[key] || 'Diğer'} Mutfağı
          </h2>
          {groupBy(list, (r) => r.country || 'Diğer')
            .sort(([a], [b]) => trSort(a, b))
            .map(([country, items]) => (
              <Group key={country} title={country} count={items.length}>
                <RecipeLinks recipes={items} />
              </Group>
            ))}
        </section>
      ))}
    </div>
  )
}
