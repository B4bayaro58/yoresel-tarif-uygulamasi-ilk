'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  BookOpen,
  Users,
  CalendarDays,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import clsx from 'clsx'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const localCount = ((RECIPES_DATA as any).tr || []).length

interface Stats {
  totalRecipes: number
  totalUsers: number
  pendingRecipes: number
  publishedRecipes: number
}

export default function AdminPage() {
  const router = useRouter()
  const { isDark } = useApp()
  const { user, isAdmin, loading: authLoading } = useAuth()

  const [stats, setStats] = useState<Stats>({
    totalRecipes: localCount,
    totalUsers: 0,
    pendingRecipes: 0,
    publishedRecipes: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.replace('/')
    }
  }, [user, isAdmin, authLoading, router])

  useEffect(() => {
    if (!isAdmin) return
    const fetchStats = async () => {
      try {
        const [usersSnap, pendingSnap, publishedSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(query(collection(db, 'recipes'), where('status', '==', 'pending'))),
          getDocs(query(collection(db, 'recipes'), where('status', '==', 'published'))),
        ])
        setStats({
          totalRecipes: localCount + publishedSnap.size,
          totalUsers: usersSnap.size,
          pendingRecipes: pendingSnap.size,
          publishedRecipes: publishedSnap.size,
        })
      } catch {
        // Firebase not configured
      } finally {
        setStatsLoading(false)
      }
    }
    fetchStats()
  }, [isAdmin])

  if (authLoading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={clsx('text-sm', isDark ? 'text-dark-muted' : 'text-light-muted')}>
            Yükleniyor...
          </p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Toplam Tarif',
      value: statsLoading ? '...' : stats.totalRecipes.toString(),
      emoji: '🍽️',
      color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Kullanıcılar',
      value: statsLoading ? '...' : stats.totalUsers.toString(),
      emoji: '👥',
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Onay Bekleyen',
      value: statsLoading ? '...' : stats.pendingRecipes.toString(),
      emoji: '⏳',
      color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Yayınlanan (DB)',
      value: statsLoading ? '...' : stats.publishedRecipes.toString(),
      emoji: '✅',
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      textColor: 'text-green-600 dark:text-green-400',
    },
  ]

  const quickLinks = [
    {
      href: '/admin/recipes',
      label: 'Tarifleri Yönet',
      description: 'Firebase tariflerini görüntüle ve düzenle',
      icon: <BookOpen size={20} />,
      color: 'text-orange-500',
    },
    {
      href: '/admin/users',
      label: 'Kullanıcılar',
      description: 'Kullanıcı listesi ve favoriler',
      icon: <Users size={20} />,
      color: 'text-blue-500',
    },
    {
      href: '/admin/daily-menu',
      label: 'Günlük Menü',
      description: 'Öne çıkan tarif ve menü planlaması',
      icon: <CalendarDays size={20} />,
      color: 'text-green-500',
    },
    {
      href: '/admin/pending',
      label: 'Onay Bekleyenler',
      description: `${stats.pendingRecipes} tarif onay bekliyor`,
      icon: <Clock size={20} />,
      color: 'text-yellow-500',
      badge: stats.pendingRecipes,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h1
            className={clsx(
              'text-2xl font-bold',
              isDark ? 'text-dark-text' : 'text-light-text'
            )}
          >
            Admin Paneli
          </h1>
          <p className={clsx('text-sm', isDark ? 'text-dark-muted' : 'text-light-muted')}>
            Yöresel Tarifler yönetim merkezi
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={clsx('rounded-2xl border p-4 text-center', card.color)}
          >
            <p className="text-2xl mb-1">{card.emoji}</p>
            <p className={clsx('text-2xl font-bold', card.textColor)}>{card.value}</p>
            <p
              className={clsx(
                'text-xs mt-0.5',
                isDark ? 'text-dark-muted' : 'text-light-muted'
              )}
            >
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div
        className={clsx(
          'rounded-2xl border overflow-hidden',
          isDark
            ? 'bg-dark-surface border-dark-border'
            : 'bg-white border-light-border shadow-card'
        )}
      >
        <div
          className={clsx(
            'flex items-center gap-2 px-5 py-4 border-b',
            isDark
              ? 'border-dark-border'
              : 'border-light-border'
          )}
        >
          <TrendingUp size={16} className="text-primary" />
          <h2
            className={clsx(
              'text-sm font-semibold',
              isDark ? 'text-dark-text' : 'text-light-text'
            )}
          >
            Hızlı Erişim
          </h2>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={clsx(
                'flex items-center gap-4 px-5 py-4 transition-colors',
                isDark
                  ? 'hover:bg-dark-card'
                  : 'hover:bg-gray-50'
              )}
            >
              <div className={clsx('flex-shrink-0', link.color)}>{link.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={clsx(
                      'text-sm font-medium',
                      isDark ? 'text-dark-text' : 'text-light-text'
                    )}
                  >
                    {link.label}
                  </p>
                  {link.badge != null && link.badge > 0 && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
                      {link.badge}
                    </span>
                  )}
                </div>
                <p className={clsx('text-xs', isDark ? 'text-dark-muted' : 'text-light-muted')}>
                  {link.description}
                </p>
              </div>
              <ChevronRight
                size={16}
                className={isDark ? 'text-dark-muted' : 'text-light-muted'}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
