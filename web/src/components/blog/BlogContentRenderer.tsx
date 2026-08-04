'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { blogExtensions } from '@/lib/blogEditor/extensions'

export default function BlogContentRenderer({ content }: { content: unknown }) {
  const editor = useEditor({
    extensions: blogExtensions,
    content: (content as any) || '',
    editable: false,
    immediatelyRender: false,
  })

  if (!editor) return null

  return <EditorContent editor={editor} className="blog-content" />
}
