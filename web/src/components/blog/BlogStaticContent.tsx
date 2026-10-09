import React from 'react'
import Link from 'next/link'
import { Recipe } from '@/types'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

// TipTap JSON belgesini sunucuda düz HTML'e çeviren salt-okunur renderer.
// Herkese açık blog sayfası eskiden salt-okunur bir TipTap editörüyle
// (`immediatelyRender: false`) render ediliyordu: sunucu HTML'inde içerik
// hiç yoktu, arama motorları yazıları boş görüyordu. Bu dosya
// `extensions.ts`'teki node/mark setinin (BlogEditor ile ortak) karşılığını
// üretir; yeni bir node eklenirse buraya da eklenmeli (bilinmeyen node'ların
// sadece çocukları render edilir, içerik kaybolmaz).

const staticRecipes: Recipe[] = (RECIPES_DATA as any).tr || []
const recipeById = new Map(staticRecipes.map((r) => [String(r.id), r]))

type JSONNode = {
  type?: string
  text?: string
  attrs?: Record<string, any>
  marks?: { type: string; attrs?: Record<string, any> }[]
  content?: JSONNode[]
}

function renderMarks(text: React.ReactNode, marks: JSONNode['marks'], key: React.Key): React.ReactNode {
  return (marks || []).reduce<React.ReactNode>((acc, mark, i) => {
    const k = `${key}-m${i}`
    switch (mark.type) {
      case 'bold': return <strong key={k}>{acc}</strong>
      case 'italic': return <em key={k}>{acc}</em>
      case 'strike': return <s key={k}>{acc}</s>
      case 'underline': return <u key={k}>{acc}</u>
      case 'code': return <code key={k}>{acc}</code>
      case 'link': {
        const href = String(mark.attrs?.href || '')
        const internal = href.startsWith('/') || href.includes('yoreseltarif.com')
        return (
          <a key={k} href={href} {...(internal ? {} : { target: '_blank', rel: 'noopener noreferrer nofollow' })}>
            {acc}
          </a>
        )
      }
      default: return acc
    }
  }, text)
}

function RecipeCard({ recipeId }: { recipeId: string }) {
  const recipe = recipeById.get(recipeId)
  const thumb = recipe?.photoThumb || recipe?.photo
  return (
    <div className="not-prose my-4" data-recipe-card="">
      <Link
        href={`/recipes/${recipeId}`}
        className="flex items-center gap-3 p-3 rounded-2xl no-underline transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', textDecoration: 'none' }}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={recipe?.name || ''} loading="lazy" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: 'var(--primary-dim)' }}>
            {recipe?.emoji || '🍽️'}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--primary)' }}>Tarif</p>
          <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>{recipe?.name || 'Tarifi görüntüle'}</p>
          {recipe?.country && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{recipe.country}</p>}
        </div>
      </Link>
    </div>
  )
}

function RecipeLink({ recipeId }: { recipeId: string }) {
  const recipe = recipeById.get(recipeId)
  return (
    <span data-recipe-link="" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <Link
        href={`/recipes/${recipeId}`}
        className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full no-underline align-middle"
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
          {recipe?.emoji || '🍽️'}
        </span>
        <span className="truncate max-w-[220px]">{recipe?.name || 'Tarif'}</span>
      </Link>
    </span>
  )
}

function renderNode(node: JSONNode, key: React.Key): React.ReactNode {
  const children = (node.content || []).map((child, i) => renderNode(child, `${key}-${i}`))
  switch (node.type) {
    case 'text': return renderMarks(node.text || '', node.marks, key)
    case 'paragraph': return <p key={key}>{children}</p>
    case 'heading': return node.attrs?.level === 3 ? <h3 key={key}>{children}</h3> : <h2 key={key}>{children}</h2>
    case 'bulletList': return <ul key={key}>{children}</ul>
    case 'orderedList': return <ol key={key} start={node.attrs?.start}>{children}</ol>
    case 'listItem': return <li key={key}>{children}</li>
    case 'blockquote': return <blockquote key={key}>{children}</blockquote>
    case 'codeBlock': return <pre key={key}><code>{children}</code></pre>
    case 'hardBreak': return <br key={key} />
    case 'horizontalRule': return <hr key={key} />
    case 'image':
      return node.attrs?.src
        // eslint-disable-next-line @next/next/no-img-element
        ? <img key={key} src={node.attrs.src} alt={node.attrs.alt || ''} title={node.attrs.title || undefined} loading="lazy" className="blog-content-image" />
        : null
    case 'recipeCard': return node.attrs?.recipeId ? <RecipeCard key={key} recipeId={String(node.attrs.recipeId)} /> : null
    case 'recipeLink': return node.attrs?.recipeId ? <RecipeLink key={key} recipeId={String(node.attrs.recipeId)} /> : null
    default: return <React.Fragment key={key}>{children}</React.Fragment>
  }
}

// Editörün ürettiği `.blog-content > .ProseMirror > ...` yapısı korunuyor ki
// globals.css'teki .blog-content kuralları birebir aynı sonucu versin.
export default function BlogStaticContent({ content }: { content: unknown }) {
  const doc = content as JSONNode | null
  return (
    <div className="blog-content">
      <div className="ProseMirror" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {(doc?.content || []).map((node, i) => renderNode(node, i))}
      </div>
    </div>
  )
}

// Meta açıklaması/arama sonuçları için düz metin (özet boşsa kullanılır)
export function blogPlainText(content: unknown, maxLength = 160): string {
  const parts: string[] = []
  const walk = (n: JSONNode) => {
    if (n.text) parts.push(n.text)
    ;(n.content || []).forEach(walk)
    if (n.type === 'paragraph' || n.type === 'heading') parts.push(' ')
  }
  if (content) walk(content as JSONNode)
  const text = parts.join('').replace(/\s+/g, ' ').trim()
  return text.length > maxLength ? text.slice(0, maxLength - 1).trimEnd() + '…' : text
}
