'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Recipe } from '@/types'
// @ts-ignore
import { RECIPES_DATA } from '@shared/recipes'

const staticRecipes: Recipe[] = (RECIPES_DATA as any).tr || []

// Statik tarif id'leri (ör. "lasagna") anında bulunur. Admin-eklenen/override
// tarifler gerçek bir Firestore doküman id'sine sahip olduğundan statik listede
// yoksa tek seferlik bir `getDoc` ile çözülür — tarif kartı ve tarif bağlantısı
// node'ları (blog editörü) bu hook'u paylaşır.
export function useNodeRecipe(recipeId: string) {
  const [recipe, setRecipe] = useState<Recipe | null | undefined>(() =>
    staticRecipes.find((r) => String(r.id) === recipeId)
  )

  useEffect(() => {
    if (recipe !== undefined || !recipeId) return
    let cancelled = false
    getDoc(doc(db, 'recipes', recipeId))
      .then((snap) => {
        if (cancelled) return
        setRecipe(snap.exists() ? ({ id: snap.id, ...snap.data() } as Recipe) : null)
      })
      .catch(() => { if (!cancelled) setRecipe(null) })
    return () => { cancelled = true }
  }, [recipeId, recipe])

  return recipe
}
