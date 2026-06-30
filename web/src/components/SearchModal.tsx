'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'
import { useApp } from '@/contexts/AppContext'
import { Recipe } from '@/types'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { t, isDark } = useApp()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const allRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200)
    return () => clearTimeout(timer)
  }, [query])

  const results = debouncedQuery.trim().length < 2
    ? []
    : allRecipes.filter((r) => {
        const q = debouncedQuery.toLowerCase()
        if (r.name.toLowerCase().includes(q)) return true
        if (r.country.toLowerCase().includes(q)) return true
        if (r.ingredients?.some((ing: { name: string }) => ing.name.toLowerCase().includes(q))) return true
        return false
      }).slice(0, 8)

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80)
    else { setQuery(''); setDebouncedQuery('') }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center" style={{ paddingTop: '80px', paddingLeft: '16px', paddingRight: '16px' }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ backgroundColor: 'rgba(22,15,8,0.7)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl rounded-3xl overflow-hidden animate-slide-up"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        }}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <Search size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchRecipes')}
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-base outline-none"
            style={{ color: 'var(--text)' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl transition-all hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {query.trim().length < 2 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
                style={{ backgroundColor: 'var(--primary-dim)' }}
              >
                🔍
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Tarif adı, ülke veya malzeme yazın
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
                style={{ backgroundColor: 'var(--border)' }}
              >
                😕
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
                {t('noResults')}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                &ldquo;{query}&rdquo; için sonuç bulunamadı
              </p>
            </div>
          ) : (
            <div className="p-3">
              <p className="text-[11px] font-bold uppercase tracking-widest px-2 mb-3" style={{ color: 'var(--text-muted)' }}>
                {results.length} sonuç
              </p>
              <div className="flex flex-col gap-1">
                {results.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group hover:opacity-90"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--card)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                  >
                    {/* Emoji thumb */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{
                        background: recipe.photo
                          ? undefined
                          : `linear-gradient(145deg, ${recipe.gradient?.[0] ?? '#B97A1A'}, ${recipe.gradient?.[1] ?? '#D99520'})`,
                        overflow: 'hidden',
                      }}
                    >
                      {recipe.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={recipe.photo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        recipe.emoji
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                        {recipe.name}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                        {recipe.country} · <Clock size={10} className="inline" /> {recipe.prepTime} dk
                      </p>
                    </div>

                    <ArrowRight
                      size={15}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--primary)' }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
