'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, UtensilsCrossed } from 'lucide-react'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useNodeRecipe } from './useNodeRecipe'

// "Tarif Kartı" (recipeCard) blok halinde büyük bir görsel kart ekliyor.
// Bu node ise metnin ORTASINA, bir cümle içine gömülebilen küçük, satır-içi
// bir bağlantı çipi — ör. "...bunun için [🍝 Lazanya] tarifimize göz atın."
function RecipeLinkNodeView({ node }: any) {
  const recipeId = node.attrs.recipeId as string
  const recipe = useNodeRecipe(recipeId)

  return (
    <NodeViewWrapper
      as="span"
      data-recipe-link=""
      contentEditable={false}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <Link
        href={`/recipes/${recipeId}`}
        className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full no-underline align-middle transition-all hover:-translate-y-px hover:shadow-md"
        style={{
          backgroundColor: 'var(--primary-dim)',
          border: '1px solid var(--primary)',
          color: 'var(--primary)',
          fontWeight: 700,
          fontSize: '0.9em',
          lineHeight: 1.4,
          textDecoration: 'none',
        }}
      >
        <span
          className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
        >
          {recipe?.emoji || <UtensilsCrossed size={11} />}
        </span>
        <span className="truncate max-w-[220px]">{recipe?.name || 'Tarif'}</span>
        <ArrowUpRight size={12} strokeWidth={2.5} className="flex-shrink-0" />
      </Link>
    </NodeViewWrapper>
  )
}

export const RecipeLinkExtension = Node.create({
  name: 'recipeLink',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      recipeId: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-recipe-link]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-recipe-link': '' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(RecipeLinkNodeView)
  },
})
