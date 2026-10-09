'use client'

import { useEffect } from 'react'
import { trackView } from '@/lib/viewStats'

// Blog yazısı sayfası artık Server Component -- görüntülenme sayacı
// tarayıcıda çalışması gereken tek parça, ayrı bir client bileşeni.
export default function BlogViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    trackView('blog', postId)
  }, [postId])
  return null
}
