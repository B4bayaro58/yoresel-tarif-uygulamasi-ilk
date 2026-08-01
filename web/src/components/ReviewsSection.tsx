'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Star, Send, Flag, Camera, X } from 'lucide-react'
import {
  collection, addDoc, getDocs, getDoc, query, where, orderBy,
  serverTimestamp, updateDoc, doc, increment, arrayUnion,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/config/firebase'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import { Recipe, Review } from '@/types'
import { isPreOptimized, resizeImageToJpegBlob } from '@/lib/image'

interface StarRatingProps {
  value: number
  onChange?: (v: number) => void
  size?: number
  readonly?: boolean
}

function StarRating({ value, onChange, size = 22, readonly = false }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(s)}
          className={readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}
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

  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [isBlocked, setIsBlocked] = useState(false)

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const snap = await getDocs(query(
          collection(db, 'reviews'),
          where('recipeId', '==', recipe.id),
          orderBy('createdAt', 'desc')
        ))
        if (cancelled) return
        const loaded = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review))
        setReviews(loaded)
        if (user) {
          const mine = loaded.find((r) => r.userId === user.uid)
          if (mine) {
            setUserReview(mine)
            setRating(mine.rating)
            setComment(mine.comment)
            setExistingPhotoUrl(mine.photoUrl || null)
          }
        }
      } catch (e) {
        console.error('Yorumlar yüklenemedi:', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [recipe.id, user])

  useEffect(() => {
    if (!user) { setIsBlocked(false); return }
    getDoc(doc(db, 'users', user.uid))
      .then((snap) => setIsBlocked(snap.exists() && snap.data().isBlocked === true))
      .catch(() => setIsBlocked(false))
  }, [user])

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploadError(null)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const clearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoFile(null)
    setPhotoPreview(null)
    setExistingPhotoUrl(null)
  }

  const handleSubmit = async () => {
    if (!user) {
      alert('Yorum yapmak için giriş yapmalısınız.')
      return
    }
    if (isBlocked) {
      alert(t('youAreBlockedFromReviews'))
      return
    }
    if (rating === 0) {
      alert('Lütfen bir puan seçin.')
      return
    }

    setSubmitting(true)
    try {
      let photoUrl = existingPhotoUrl || undefined
      if (photoFile) {
        const blob = await resizeImageToJpegBlob(photoFile)
        const fileRef = ref(storage, `review-photos/${user.uid}_${Date.now()}.jpg`)
        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Zaman aşımı (30s)')), 30_000)
        )
        const snap = await Promise.race([
          uploadBytes(fileRef, blob, { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000, immutable' }),
          timeout,
        ])
        photoUrl = await getDownloadURL(snap.ref)
      }

      if (userReview) {
        await updateDoc(doc(db, 'reviews', userReview.id), {
          rating, comment: comment.trim(), photoUrl: photoUrl ?? null, updatedAt: serverTimestamp(),
        })
      } else {
        await addDoc(collection(db, 'reviews'), {
          recipeId: recipe.id,
          userId: user.uid,
          userName: user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
          rating,
          comment: comment.trim(),
          photoUrl: photoUrl ?? null,
          createdAt: serverTimestamp(),
        })

        // Sadece Firebase kaynaklı tarifler için ortalama puanı güncelle
        // (statik katalogdaki tarifler koddan geliyor, üzerine yazılamaz).
        // Ayrı try/catch: yorum zaten kaydedildi, bu adım başarısız olsa bile
        // kullanıcıya "yorum gönderilemedi" gibi yanlış bir hata gösterip
        // formu kirli bırakmamalı (aksi halde tekrar denemek mükerrer yorum
        // oluşturur).
        if (recipe.isFirebase) {
          try {
            const newCount = reviews.length + 1
            const newAvg = ((recipe.rating || 0) * reviews.length + rating) / newCount
            await updateDoc(doc(db, 'recipes', recipe.id), {
              rating: parseFloat(newAvg.toFixed(1)),
              reviewCount: increment(1),
            })
          } catch (e) {
            console.error('Ortalama puan güncellenemedi:', e)
          }
        }
      }

      setComment('')
      setRating(0)
      setUserReview(null)
      setPhotoFile(null)
      setPhotoPreview(null)
      setExistingPhotoUrl(null)

      const snap = await getDocs(query(
        collection(db, 'reviews'),
        where('recipeId', '==', recipe.id),
        orderBy('createdAt', 'desc')
      ))
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review)))
    } catch (e: any) {
      setUploadError(e?.message || 'Yorum gönderilemedi.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReport = async (review: Review) => {
    if (!user) {
      alert('Şikayet etmek için giriş yapmalısınız.')
      return
    }
    if (!confirm(t('reportReviewConfirm'))) return
    try {
      await updateDoc(doc(db, 'reviews', review.id), {
        reportedBy: arrayUnion(user.uid),
        reportCount: increment(1),
      })
      setReviews((prev) => prev.map((r) =>
        r.id === review.id ? { ...r, reportedBy: [...(r.reportedBy || []), user.uid] } : r
      ))
    } catch (e: any) {
      alert(e?.message || 'Şikayet gönderilemedi.')
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const displayedPreview = photoPreview || existingPhotoUrl

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>💬 Yorumlar</h2>
        {avgRating && (
          <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text)' }}>
            <Star size={15} color="#FFD700" fill="#FFD700" />
            {avgRating} ({reviews.length} yorum)
          </div>
        )}
      </div>

      {/* Yorum ekleme formu */}
      <div
        className="rounded-2xl p-4 mb-4 space-y-3"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
      >
        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          {userReview ? 'Yorumunuzu Düzenleyin' : 'Yorum Ekleyin'}
        </p>
        <StarRating value={rating} onChange={setRating} />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tarifinizle ilgili düşüncelerinizi yazın..."
          rows={3}
          autoCorrect="off"
          spellCheck={false}
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
        {displayedPreview ? (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <Image src={displayedPreview} alt="Fotoğraf önizleme" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
            >
              <X size={12} color="#fff" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            <Camera size={14} /> Fotoğraf Ekle
          </button>
        )}
        {uploadError && <p className="text-xs" style={{ color: '#C4593A' }}>⚠ {uploadError}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white w-full sm:w-auto transition-opacity"
          style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)', opacity: submitting ? 0.7 : 1 }}
        >
          <Send size={14} />
          {submitting ? 'Gönderiliyor...' : userReview ? 'Güncelle' : 'Gönder'}
        </button>
      </div>

      {/* Yorum listesi */}
      {loading ? (
        <div className="skeleton h-16 rounded-2xl" />
      ) : reviews.length === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
          Henüz yorum yok. İlk yorumu siz yapın!
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const alreadyReported = !!user && !!review.reportedBy?.includes(user.uid)
            const isOwnReview = !!user && review.userId === user.uid
            return (
              <div
                key={review.id}
                className="rounded-2xl p-4"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}
                  >
                    {review.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{review.userName}</p>
                    <StarRating value={review.rating} size={12} readonly />
                  </div>
                  {!isOwnReview && (
                    <button
                      type="button"
                      onClick={() => !alreadyReported && handleReport(review)}
                      disabled={alreadyReported}
                      title={t('reportReview')}
                      className="p-1.5 flex-shrink-0"
                    >
                      <Flag size={15} color={alreadyReported ? 'var(--text-muted)' : 'var(--text-muted)'} fill={alreadyReported ? 'var(--text-muted)' : 'transparent'} />
                    </button>
                  )}
                </div>
                {review.comment && (
                  <p className="text-sm mt-2.5" style={{ color: 'var(--text-muted)' }}>{review.comment}</p>
                )}
                {review.photoUrl && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden mt-3" style={{ border: '1px solid var(--border)' }}>
                    <Image
                      src={review.photoUrl}
                      alt={`${review.userName} fotoğrafı`}
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized={isPreOptimized(review.photoUrl)}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
