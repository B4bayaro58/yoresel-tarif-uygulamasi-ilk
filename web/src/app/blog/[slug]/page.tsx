import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPostBySlugServer, formatPostDate } from '@/lib/blogServer'
import { isPreOptimized } from '@/lib/image'
import BlogStaticContent, { blogPlainText } from '@/components/blog/BlogStaticContent'
import BlogViewTracker from '@/components/blog/BlogViewTracker'

// Sunucuda üretiliyor -- yazının tam metni HTML'de hazır gelir (eskiden
// client'ta yükleniyordu, arama motorları boş sayfa görüyordu).
export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlugServer(slug)
  if (!post) return { title: 'Yazı Bulunamadı — Yöresel Tarif' }
  const description = post.excerpt || blogPlainText(post.content)
  return {
    title: `${post.title} — Yöresel Tarif`,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.coverPhoto ? [{ url: post.coverPhoto }] : undefined,
    },
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlugServer(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || blogPlainText(post.content),
    image: post.coverPhoto ? [post.coverPhoto] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { '@type': post.authorName ? 'Person' : 'Organization', name: post.authorName || 'Yöresel Tarif' },
    publisher: { '@type': 'Organization', name: 'Yöresel Tarif', url: 'https://yoreseltarif.com' },
    mainEntityOfPage: `https://yoreseltarif.com/blog/${post.slug}`,
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\u003c') }} />
      <BlogViewTracker postId={post.id} />
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
            {formatPostDate(post.publishedAt)}{post.authorName ? ` · ${post.authorName}` : ''}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <BlogStaticContent content={post.content} />
      </div>
    </div>
  )
}
