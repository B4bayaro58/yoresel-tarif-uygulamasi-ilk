'use client'

import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { Bold, Italic, Heading2, List, Link as LinkIcon, UtensilsCrossed, Link2 } from 'lucide-react'
import { blogExtensions } from '@/lib/blogEditor/extensions'
import RecipePickerPopover from './RecipePickerPopover'

interface BlogEditorProps {
  content: unknown
  onChange: (json: unknown) => void
}

function ToolbarButton({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2 rounded-lg transition-opacity hover:opacity-80"
      style={active ? { backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' } : { color: 'var(--text-muted)' }}
    >
      {children}
    </button>
  )
}

type RecipePickerMode = 'card' | 'link' | null

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const [pickerMode, setPickerMode] = useState<RecipePickerMode>(null)

  const editor = useEditor({
    extensions: blogExtensions,
    content: (content as any) || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class: 'blog-content px-4 py-3 min-h-[320px]',
      },
    },
  })

  if (!editor) return null

  const toggleLink = () => {
    const previousUrl = editor.getAttributes('link').href || ''
    const url = window.prompt("Bağlantı URL'si (boş bırakırsanız kaldırılır):", previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  const handleRecipeSelect = (recipeId: string) => {
    if (pickerMode === 'card') {
      editor.chain().focus().insertContent({ type: 'recipeCard', attrs: { recipeId } }).run()
    } else if (pickerMode === 'link') {
      editor.chain().focus().insertContent({ type: 'recipeLink', attrs: { recipeId } }).run()
    }
    setPickerMode(null)
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="flex items-center gap-1 p-2 border-b flex-wrap" style={{ borderColor: 'var(--border)' }}>
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('link')} onClick={toggleLink}>
          <LinkIcon size={15} />
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--border)' }} />

        <div className="relative">
          <button
            type="button"
            onClick={() => setPickerMode((v) => (v === 'link' ? null : 'link'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}
          >
            <Link2 size={13} /> Tarife Bağlantı Ekle
          </button>
          {pickerMode === 'link' && (
            <RecipePickerPopover onSelect={handleRecipeSelect} onClose={() => setPickerMode(null)} />
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setPickerMode((v) => (v === 'card' ? null : 'card'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)' }}
          >
            <UtensilsCrossed size={13} /> Tarif Kartı Ekle
          </button>
          {pickerMode === 'card' && (
            <RecipePickerPopover onSelect={handleRecipeSelect} onClose={() => setPickerMode(null)} />
          )}
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
