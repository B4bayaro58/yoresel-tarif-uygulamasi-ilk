'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Sun, Moon, LogOut, LogIn, Edit2, Check, X } from 'lucide-react'
import { updateProfile } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5 mb-4"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
    >
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest mb-4"
      style={{ color: 'var(--text-muted)' }}
    >
      <span className="inline-block w-3 h-0.5 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
      {children}
    </p>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { toggleTheme, isDark, favorites, shoppingList } = useApp()
  const { user, logout } = useAuth()

  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState(user?.displayName || '')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameError, setNameError] = useState('')

  const handleLogout = async () => { await logout(); router.push('/') }

  const handleSaveName = async () => {
    if (!newName.trim()) { setNameError('İsim boş olamaz.'); return }
    if (!auth.currentUser) return
    setNameLoading(true)
    try {
      await updateProfile(auth.currentUser, { displayName: newName.trim() })
      setEditingName(false)
      setNameError('')
    } catch {
      setNameError('İsim güncellenemedi.')
    } finally {
      setNameLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      {/* Page title */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
        >
          👤
        </div>
        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>
          Profil
        </h1>
      </div>

      {/* ── Account ──────────────────────────────── */}
      <Section>
        <SectionLabel>Hesap</SectionLabel>
        {user ? (
          <div>
            <div className="flex items-center gap-4 mb-5">
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
              >
                {user.isAnonymous ? '?' : (user.displayName?.[0] || user.email?.[0] || '?').toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                {user.isAnonymous ? (
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>Misafir Kullanıcı</p>
                ) : editingName ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoCorrect="off"
                        spellCheck={false}
                        className="flex-1 px-3 py-1.5 rounded-xl text-sm outline-none"
                        style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--text)' }}
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={nameLoading}
                        className="btn-primary p-1.5 rounded-xl"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => { setEditingName(false); setNameError(''); setNewName(user.displayName || '') }}
                        className="p-1.5 rounded-xl hover:opacity-70 transition-opacity"
                        style={{ backgroundColor: 'var(--border)', color: 'var(--text-muted)' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {nameError && <p className="text-xs mt-1" style={{ color: '#C4593A' }}>{nameError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate" style={{ color: 'var(--text)' }}>
                      {user.displayName || 'İsimsiz'}
                    </p>
                    <button onClick={() => setEditingName(true)} className="hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>
                      <Edit2 size={13} />
                    </button>
                  </div>
                )}
                {!user.isAnonymous && (
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Favori', value: favorites.length, emoji: '❤️' },
                { label: 'Alışveriş', value: shoppingList.length, emoji: '🛒' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl p-4 text-center"
                  style={{ backgroundColor: 'var(--card)' }}
                >
                  <p className="text-2xl mb-1">{stat.emoji}</p>
                  <p className="text-2xl font-display font-bold" style={{ color: 'var(--primary)' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ backgroundColor: 'var(--border)' }}
            >
              <User size={28} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Giriş yaparak tüm özelliklere erişin
            </p>
            <Link
              href="/login"
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold"
            >
              <LogIn size={14} />
              Giriş Yap
            </Link>
          </div>
        )}
      </Section>

      {/* ── Theme ──────────────────────────────────── */}
      <Section>
        <SectionLabel>Görünüm</SectionLabel>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark
              ? <Moon size={20} style={{ color: 'var(--primary)' }} />
              : <Sun size={20} style={{ color: 'var(--primary)' }} />
            }
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              {isDark ? 'Koyu Tema' : 'Açık Tema'}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="relative w-12 h-6 rounded-full transition-colors duration-300"
            style={{ background: isDark ? 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' : 'var(--border)' }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
              style={{ transform: isDark ? 'translateX(24px)' : 'translateX(0)' }}
            />
          </button>
        </div>
      </Section>

      {/* ── Logout ──────────────────────────────────── */}
      {user && (
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-80"
          style={{ border: '1px solid rgba(196,89,58,0.25)', color: '#C4593A', backgroundColor: 'rgba(196,89,58,0.06)' }}
        >
          <LogOut size={15} />
          Çıkış Yap
        </button>
      )}
    </div>
  )
}
