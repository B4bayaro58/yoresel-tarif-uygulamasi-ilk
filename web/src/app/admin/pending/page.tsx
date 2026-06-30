'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, X, Clock } from 'lucide-react'
import {
  collection, getDocs, query, where, updateDoc, deleteDoc, doc,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'

export default function AdminPendingPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'recipes'), where('status', '==', 'pending')))
      setRecipes(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Recipe)))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const approve = async (id: string) => {
    setActionId(id)
    try {
      await updateDoc(doc(db, 'recipes', id), { status: 'published' })
      setRecipes((prev) => prev.filter((r) => r.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setActionId(null)
    }
  }

  const reject = async (id: string) => {
    if (!confirm('Bu tarifi reddetmek ve silmek istediğinize emin misiniz?')) return
    setActionId(id)
    try {
      await deleteDoc(doc(db, 'recipes', id))
      setRecipes((prev) => prev.filter((r) => r.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Onay Bekleyenler</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {loading ? '...' : `${recipes.length} tarif inceleme bekliyor`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : recipes.length === 0 ? (
        <div
          className="rounded-2xl p-16 text-center"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <Clock size={36} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="font-semibold" style={{ color: 'var(--text)' }}>Onay bekleyen tarif yok</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Kullanıcı tarafından gönderilen tarifler burada görünür.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="rounded-2xl p-5"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
            >
              <div className="flex items-start gap-4">
                <span style={{ fontSize: '36px' }}>{recipe.emoji || '🍽️'}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>{recipe.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {recipe.country} · {recipe.prepTime} dk · {recipe.difficulty === 'easy' ? 'Kolay' : recipe.difficulty === 'medium' ? 'Orta' : 'Zor'}
                  </p>
                  {recipe.authorName && (
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      Gönderen: <span style={{ color: 'var(--primary)' }}>{recipe.authorName}</span>
                    </p>
                  )}
                  <div className="mt-2">
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Malzemeler:</p>
                    <p className="text-xs" style={{ color: 'var(--text)' }}>
                      {recipe.ingredients?.slice(0, 5).map((i) => i.name).join(', ')}
                      {recipe.ingredients?.length > 5 && ` +${recipe.ingredients.length - 5} daha`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 justify-end">
                <button
                  onClick={() => reject(recipe.id)}
                  disabled={actionId === recipe.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: 'rgba(196,89,58,0.1)', color: '#C4593A' }}
                >
                  <X size={14} /> Reddet
                </button>
                <button
                  onClick={() => approve(recipe.id)}
                  disabled={actionId === recipe.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
                >
                  <Check size={14} /> {actionId === recipe.id ? 'İşleniyor...' : 'Onayla'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
