'use client'

import React from 'react'
import NextImage from 'next/image'
import Link from 'next/link'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { isPreOptimized } from '@/lib/image'
import { useNodeRecipe } from './useNodeRecipe'

function RecipeCardNodeView({ node }: any) {
  const recipeId = node.attrs.recipeId as string
  const recipe = useNodeRecipe(recipeId)

  return (
    <NodeViewWrapper className="not-prose my-4" data-recipe-card="">
      <Link
        href={`/recipes/${recipeId}`}
        className="flex items-center gap-3 p-3 rounded-2xl no-underline transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', textDecoration: 'none' }}
        contentEditable={false}
      >
        {recipe?.photo ? (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
            <NextImage
              src={recipe.photoThumb || recipe.photo}
              alt={recipe.name}
              fill
              sizes="64px"
              unoptimized={isPreOptimized(recipe.photoThumb || recipe.photo)}
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: 'var(--primary-dim)' }}
          >
            {recipe?.emoji || '🍽️'}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--primary)' }}>
            Tarif
          </p>
          <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>
            {recipe?.name || `Tarif #${recipeId}`}
          </p>
          {recipe?.country && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{recipe.country}</p>
          )}
        </div>
      </Link>
    </NodeViewWrapper>
  )
}

export const RecipeCardExtension = Node.create({
  name: 'recipeCard',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      recipeId: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-recipe-card]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-recipe-card': '' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(RecipeCardNodeView)
  },
})
