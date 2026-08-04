'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getBlogPostBySlug } from '@/lib/blog'
import { BlogPost } from '@/types'
import { isPreOptimized } from '@/lib/image'
import BlogContentRenderer from '@/components/blog/BlogContentRenderer'

function formatDate(value: unknown): string {
  if (!value) return ''
  const millis =
    typeof value === 'object' && value !== null && 'seconds' in (value as any)
      ? (value as any).seconds * 1000
      : Date.parse(String(value))
  if (Number.isNaN(millis)) return ''
  return new Date(millis).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined)

  useEffect(() => {
    if (slug) getBlogPostBySlug(slug).then(setPost)
  }, [slug])

  if (post === undefined) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="skeleton rounded-3xl mb-6" style={{ height: '280px' }} />
        <div className="skeleton h-6 rounded mb-3" style={{ width: '70%' }} />
        <div className="skeleton h-4 rounded" style={{ width: '40%' }} />
      </div>
    )
  }

  if (post === null) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-lg font-display font-bold" style={{ color: 'var(--text)' }}>Yazı bulunamadı</p>
        <Link href="/blog" className="text-sm underline mt-2 inline-block" style={{ color: 'var(--primary)' }}>Blog&apos;a dön</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="relative overflow-hidden" style={{ minHeight: '320px' }}>
        {post.coverPhoto && (
          <Image
            src={post.coverPhoto}
            alt={post.title}
            fill
            sizes="100vw"
            priority
            unoptimized={isPreOptimized(post.coverPhoto)}
            className="object-cover"
          />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 60%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col justify-end" style={{ minHeight: '320px' }}>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium mb-4 text-white/90 hover:text-white w-fit">
            <ArrowLeft size={15} />
            Blog
          </Link>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3 leading-tight">{post.title}</h1>
          <p className="text-white/75 text-sm">
            {formatDate(post.publishedAt)}{post.authorName ? ` · ${post.authorName}` : ''}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <BlogContentRenderer content={post.content} />
      </div>
    </div>
  )
}
