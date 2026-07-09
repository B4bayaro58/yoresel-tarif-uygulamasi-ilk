'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, CheckCircle2, LogIn } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
// @ts-ignore
import { CONTINENTS } from '@shared/continents'
// @ts-ignore
import { CATEGORIES } from '@shared/categories'

interface ContinentItem { id: string; food: string }
interface CategoryItem { id: string; icon: string }

const inputStyle = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
}

export default function TarifOnerPage() {
  const router = useRouter()
  const { t } = useApp()
  const { user } = useAuth()

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [continent, setContinent] = useState((CONTINENTS as ContinentItem[])[0]?.id || '')
  const [category, setCategory] = useState((CATEGORIES as CategoryItem[])[0]?.id || '')
  const [servings, setServings] = useState(4)
  const [prepTime, setPrepTime] = useState(30)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [ingredientsText, setIngredientsText] = useState('')
  const [stepsText, setStepsText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  if (!user || user.isAnonymous) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
          style={{ backgroundColor: 'var(--primary-dim)' }}
        >
          👨‍🍳
        </div>
        <h2 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text)' }}>
          Tarifinizi Paylaşın
        </h2>
        <p className="text-sm text-center mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
          Tarif önerebilmek için bir hesapla giriş yapmanız gerekir.
        </p>
        <Link href="/login" className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm">
          <LogIn size={15} />
          Giriş Yap
        </Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
          style={{ backgroundColor: 'var(--primary-dim)' }}
        >
          <CheckCircle2 size={40} style={{ color: 'var(--primary)' }} />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text)' }}>
          Tarifiniz Alındı!
        </h2>
        <p className="text-sm mb-6 max-w-sm" style={{ color: 'var(--text-muted)' }}>
          Editör ekibimiz tarifinizi inceledikten sonra sitede yayınlanacak. İlginiz için teşekkürler.
        </p>
        <Link href="/" className="btn-primary px-6 py-3 rounded-2xl font-semibold text-sm">
          Ana Sayfaya Dön
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const ingredients = ingredientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [ing, amount] = line.split(',').map((s) => s.trim())
        return { name: ing, amount: amount || '' }
      })
    const steps = stepsText.split('\n').map((s) => s.trim()).filter(Boolean)

    if (!name.trim() || !country.trim() || ingredients.length === 0 || steps.length === 0) {
      setError('Lütfen tarif adı, ülke, en az bir malzeme ve bir adım girin.')
      return
    }

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'recipes'), {
        name: name.trim(),
        country: country.trim(),
        continent,
        category,
        emoji: (CONTINENTS as ContinentItem[]).find((c) => c.id === continent)?.food || '🍽️',
        gradient: ['#B97A1A', '#D99520'],
        photo: '',
        ingredients,
        equipment: [],
        steps,
        servings,
        prepTime,
        calories: 0,
        rating: 0,
        difficulty,
        status: 'pending',
        authorId: user.uid,
        authorName: user.displayName || user.email || 'Anonim',
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError('Tarif gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={15} />
        Ana Sayfa
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
        >
          👨‍🍳
        </div>
        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>
          Tarif Öner
        </h1>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Kendi yöresel tarifinizi paylaşın, incelendikten sonra sitede yayınlansın.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>Tarif Adı</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm focus-ring"
            style={inputStyle}
            placeholder="Örn. Denizli Çöp Şiş"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>Ülke / Şehir</label>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus-ring"
              style={inputStyle}
              placeholder="Örn. Türkiye"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>Kıta</label>
            <select
              value={continent}
              onChange={(e) => setContinent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus-ring"
              style={inputStyle}
            >
              {(CONTINENTS as ContinentItem[]).map((c) => (
                <option key={c.id} value={c.id}>{t(`continent-${c.id}`)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus-ring"
              style={inputStyle}
            >
              {(CATEGORIES as CategoryItem[]).map((c) => (
                <option key={c.id} value={c.id}>{t(`category-${c.id}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>Porsiyon</label>
            <input
              type="number"
              min={1}
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus-ring"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>Süre (dk)</label>
            <input
              type="number"
              min={1}
              value={prepTime}
              onChange={(e) => setPrepTime(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus-ring"
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>Zorluk</label>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setDifficulty(d)}
                className="flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={
                  difficulty === d
                    ? { background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)', color: '#fff' }
                    : { ...inputStyle, color: 'var(--text-muted)' }
                }
              >
                {d === 'easy' ? 'Kolay' : d === 'medium' ? 'Orta' : 'Zor'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>
            Malzemeler <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(her satıra bir malzeme, virgülle miktar: &quot;Un, 2 su bardağı&quot;)</span>
          </label>
          <textarea
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            rows={5}
            className="w-full px-4 py-2.5 rounded-xl text-sm focus-ring resize-none"
            style={inputStyle}
            placeholder={'Un, 2 su bardağı\nYumurta, 2 adet\nSüt, 1 su bardağı'}
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>
            Hazırlanışı <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(her satıra bir adım)</span>
          </label>
          <textarea
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            rows={6}
            className="w-full px-4 py-2.5 rounded-xl text-sm focus-ring resize-none"
            style={inputStyle}
            placeholder={'Malzemeleri bir kapta karıştırın\nHamuru 10 dakika yoğurun\n...'}
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        {error && (
          <p className="text-sm px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(196,89,58,0.1)', color: '#C4593A' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm disabled:opacity-60"
        >
          <Send size={15} />
          {submitting ? 'Gönderiliyor...' : 'Tarifi Gönder'}
        </button>
      </form>
    </div>
  )
}
