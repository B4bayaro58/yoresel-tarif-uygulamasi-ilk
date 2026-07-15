'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Heart,
  ShoppingCart,
  Home,
  User,
  LogOut,
  Shield,
} from 'lucide-react'
import clsx from 'clsx'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { t, isDark, toggleTheme, shoppingList, favorites } = useApp()
  const { user, logout, isAdmin } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const userMenuRef = useRef<HTMLDivElement>(null)

  const uncheckedItems = shoppingList.filter((i) => !i.checked).length

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const navLinks = [
    { href: '/', label: t('home'), icon: <Home size={15} /> },
    { href: '/favorites', label: t('favorites'), icon: <Heart size={15} />, badge: favorites.length },
    { href: '/shopping-list', label: t('shoppingList'), icon: <ShoppingCart size={15} />, badge: uncheckedItems },
  ]

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    router.push('/')
  }

  return (
    <>
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          backgroundColor: isDark ? 'rgba(35,23,16,0.92)' : 'rgba(255,253,248,0.92)',
          borderBottom: `1px solid ${isDark ? '#3E2A18' : '#E8DDD0'}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between" style={{ height: '108px' }}>

            {/* ── Logo ────────────────────────────────── */}
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo.png"
                alt="Yöresel Tarif"
                width={340}
                height={136}
                className="object-contain"
                style={{ maxHeight: '104px', width: 'auto' }}
                priority
              />
            </Link>

            {/* ── Desktop Nav ─────────────────────────── */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive(link.href)
                      ? 'text-white shadow-warm'
                      : 'hover:opacity-80'
                  )}
                  style={
                    isActive(link.href)
                      ? { background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }
                      : { color: 'var(--text-muted)' }
                  }
                >
                  {link.icon}
                  {link.label}
                  {link.badge != null && link.badge > 0 && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1"
                      style={{ background: '#C4593A' }}
                    >
                      {link.badge > 9 ? '9+' : link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Right Controls ───────────────────────── */}
            <div className="flex items-center gap-1">

              {/* Search */}
              <Link
                href="/arama"
                className="p-2 rounded-xl transition-all hover:opacity-80"
                style={{ color: 'var(--text-muted)' }}
                title={t('search')}
              >
                <Search size={19} />
              </Link>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl transition-all hover:opacity-80"
                style={{ color: isDark ? '#F0C040' : 'var(--text-muted)' }}
                title={isDark ? 'Açık Tema' : 'Koyu Tema'}
              >
                {isDark ? <Sun size={19} /> : <Moon size={19} />}
              </button>

              {/* User menu / Login */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-xl transition-all hover:opacity-80"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
                    >
                      {user.isAnonymous
                        ? '?'
                        : (user.displayName?.[0] || user.email?.[0] || '?').toUpperCase()}
                    </div>
                    <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden animate-slide-down"
                      style={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        boxShadow: '0 12px 40px rgba(28,18,10,0.14)',
                      }}
                    >
                      <div
                        className="px-4 py-3 border-b text-xs font-medium"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                      >
                        {user.isAnonymous ? 'Misafir' : user.displayName || user.email}
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:opacity-80"
                        style={{ color: 'var(--text)' }}
                      >
                        <User size={14} style={{ color: 'var(--text-muted)' }} />
                        {t('profile')}
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:opacity-80"
                          style={{ color: 'var(--text)' }}
                        >
                          <Shield size={14} style={{ color: 'var(--text-muted)' }} />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:opacity-80"
                        style={{ color: '#C4593A' }}
                      >
                        <LogOut size={14} />
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="btn-primary px-4 py-1.5 rounded-xl text-sm font-semibold"
                >
                  Giriş Yap
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl transition-all hover:opacity-80"
                style={{ color: 'var(--text-muted)' }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Nav ──────────────────────────────── */}
        {mobileOpen && (
          <div
            className="md:hidden border-t animate-slide-down"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive(link.href) ? 'text-white' : 'hover:opacity-80'
                  )}
                  style={
                    isActive(link.href)
                      ? { background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }
                      : { color: 'var(--text)' }
                  }
                >
                  {link.icon}
                  {link.label}
                  {link.badge != null && link.badge > 0 && (
                    <span
                      className="ml-auto text-xs font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ background: '#C4593A' }}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                href="/profile"
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium hover:opacity-80"
                style={{ color: 'var(--text)' }}
              >
                <User size={15} style={{ color: 'var(--text-muted)' }} />
                {t('profile')}
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
