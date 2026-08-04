'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Newspaper } from 'lucide-react'
import { getPublishedBlogPosts } from '@/lib/blog'
import { BlogPost } from '@/types'
import { isPreOptimized } from '@/lib/image'

function formatDate(value: unknown): string {
  if (!value) return ''
  const millis =
    typeof value === 'object' && value !== null && 'seconds' in (value as any)
      ? (value as any).seconds * 1000
      : Date.parse(String(value))
  if (Number.isNaN(millis)) return ''
  return new Date(millis).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null)

  useEffect(() => {
    getPublishedBlogPosts().then(setPosts)
  }, [])

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

      <div className="flex items-center gap-2 mb-8">
        <div className="h-px w-8 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--primary)' }}>Blog</span>
      </div>
      <h1 className="font-display font-bold mb-2" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--text)' }}>
        Yöresel Mutfaktan Notlar
      </h1>
      <p className="text-sm mb-10 max-w-lg" style={{ color: 'var(--text-muted)' }}>
        Bayram sofralarından yöresel klasiklere, mutfağınıza ilham verecek yazılar.
      </p>

      {posts === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton rounded-2xl" style={{ height: '260px' }} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4" style={{ backgroundColor: 'var(--primary-dim)' }}>
            <Newspaper size={32} style={{ color: 'var(--primary)' }} />
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Henüz yazı yayınlanmadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="rounded-2xl overflow-hidden card-hover group"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
            >
              <div className="relative w-full" style={{ aspectRatio: '3 / 2' }}>
                {post.coverPhoto ? (
                  <Image
                    src={post.coverPhoto}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized={isPreOptimized(post.coverPhoto)}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: 'linear-gradient(145deg, #B97A1A, #D99520)' }}>
                    📝
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--primary)' }}>
                  {formatDate(post.publishedAt)}
                </p>
                <h2 className="font-display font-bold text-base mb-1.5 leading-snug line-clamp-2" style={{ color: 'var(--text)' }}>
                  {post.title}
                </h2>
                <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
