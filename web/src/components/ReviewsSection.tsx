'use client'

import React, { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import {
  collection, addDoc, getDocs, getDoc, query, where,
  serverTimestamp, updateDoc, doc, increment,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import { Recipe, Review } from '@/types'

// Yalnızca anonim yıldız puanı: yorum metni, ad ve fotoğraf yok. Kullanıcıların
// herkese açık içerik paylaşmaması siteyi 5651 ek 4'teki "sosyal ağ sağlayıcı"
// tanımının (ve 15 yaş/yaş doğrulama yükümlülüklerinin) dışında tutuyor --
// yorum, fotoğraf ve şikâyet özellikleri bu yüzden kaldırıldı.

interface StarRatingProps {
  value: number
  onChange?: (v: number) => void
  size?: number
}

function StarRating({ value, onChange, size = 24 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          aria-label={`${s} yıldız`}
          aria-pressed={s <= value}
          className="cursor-pointer hover:scale-110 transition-transform"
          style={{ lineHeight: 0 }}
        >
          <Star size={size} color="#FFD700" fill={s <= value ? '#FFD700' : 'transparent'} />
        </button>
      ))}
    </div>
  )
}

export default function ReviewsSection({ recipe }: { recipe: Recipe & { isFirebase?: boolean } }) {
  const { t } = useApp()
  const { user } = useAuth()

  const [ratings, setRatings] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [myRating, setMyRating] = useState<Review | null>(null)
  const [isBlocked, setIsBlocked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async (cancelled?: () => boolean) => {
    try {
      setLoading(true)
      const snap = await getDocs(query(collection(db, 'reviews'), where('recipeId', '==', recipe.id)))
      if (cancelled?.()) return
      const loaded = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review))
      setRatings(loaded)
      const mine = user ? loaded.find((r) => r.userId === user.uid) ?? null : null
      setMyRating(mine)
      setRating(mine ? mine.rating : 0)
    } catch (e) {
      console.error('Puanlar yüklenemedi:', e)
    } finally {
      if (!cancelled?.()) setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    load(() => cancelled)
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe.id, user])

  useEffect(() => {
    if (!user) { setIsBlocked(false); return }
    getDoc(doc(db, 'users', user.uid))
      .then((snap) => setIsBlocked(snap.exists() && snap.data().isBlocked === true))
      .catch(() => setIsBlocked(false))
  }, [user])

  const handleSubmit = async () => {
    if (!user) { alert('Puan vermek için giriş yapmalısınız.'); return }
    if (isBlocked) { alert(t('youAreBlockedFromReviews')); return }
    if (rating === 0) { alert('Lütfen bir puan seçin.'); return }

    setSubmitting(true)
    setError(null)
    try {
      if (myRating) {
        await updateDoc(doc(db, 'reviews', myRating.id), { rating, updatedAt: serverTimestamp() })
      } else {
        await addDoc(collection(db, 'reviews'), {
          recipeId: recipe.id,
          userId: user.uid,
          rating,
          createdAt: serverTimestamp(),
        })

        // Sadece Firebase kaynaklı tarifler için ortalama puanı güncelle
        // (statik katalogdaki tarifler koddan geliyor, üzerine yazılamaz).
        // Ayrı try/catch: puan zaten kaydedildi, bu adım başarısız olsa bile
        // yanlış hata gösterip mükerrer kayda yol açmamalı.
        if (recipe.isFirebase) {
          try {
            const newCount = ratings.length + 1
            const newAvg = ((recipe.rating || 0) * ratings.length + rating) / newCount
            await updateDoc(doc(db, 'recipes', recipe.id), {
              rating: parseFloat(newAvg.toFixed(1)),
              reviewCount: increment(1),
            })
          } catch (e) {
            console.error('Ortalama puan güncellenemedi:', e)
          }
        }
      }
      await load()
    } catch (e: any) {
      setError(e?.message || 'Puan kaydedilemedi.')
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : null

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>⭐ Puanlar</h2>
        {!loading && avgRating && (
          <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text)' }}>
            <Star size={15} color="#FFD700" fill="#FFD700" />
            {avgRating} ({ratings.length} puan)
          </div>
        )}
      </div>

      <div
        className="rounded-2xl p-4 space-y-3"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
      >
        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          {myRating ? 'Puanınızı güncelleyin' : 'Bu tarifi puanlayın'}
        </p>
        <StarRating value={rating} onChange={setRating} />
        {error && <p className="text-xs" style={{ color: '#C4593A' }}>⚠ {error}</p>}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white w-full sm:w-auto transition-opacity"
          style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)', opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? 'Kaydediliyor...' : myRating ? 'Güncelle' : 'Puanla'}
        </button>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Puanlar anonimdir; adınız gösterilmez.</p>
      </div>
    </section>
  )
}
