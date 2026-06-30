'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Language, ShoppingItem } from '@/types'
// @ts-ignore
import { TRANSLATIONS } from '@shared/translations'
import { useAuth } from './AuthContext'

interface AppContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isDark: boolean
  toggleTheme: () => void
  favorites: string[]
  toggleFavorite: (recipeId: string) => void
  shoppingList: ShoppingItem[]
  addToShoppingList: (items: ShoppingItem[]) => void
  toggleShoppingItem: (id: string) => void
  removeShoppingItem: (id: string) => void
  clearShoppingList: () => void
  t: (key: string) => string
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr')
  const [isDark, setIsDark] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([])
  const { user } = useAuth()

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedLang = localStorage.getItem('language') as Language | null
    if (storedLang && ['tr', 'en', 'fr', 'it'].includes(storedLang)) {
      setLanguageState(storedLang)
    }

    const storedTheme = localStorage.getItem('theme')
    const prefersDark =
      storedTheme === 'dark' ||
      (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDark(prefersDark)
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Load guest shopping list
    const storedShopping = localStorage.getItem('shoppingList')
    if (storedShopping) {
      try {
        setShoppingList(JSON.parse(storedShopping))
      } catch {
        // ignore
      }
    }
  }, [])

  // Sync favorites with Firestore when user changes
  useEffect(() => {
    if (!user || user.isAnonymous) {
      // Load from localStorage for guests
      const storedFavs = localStorage.getItem('favorites')
      if (storedFavs) {
        try {
          setFavorites(JSON.parse(storedFavs))
        } catch {
          setFavorites([])
        }
      }
      return
    }

    const userDocRef = doc(db, 'users', user.uid)
    const unsubscribe = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setFavorites(data.favorites || [])
      }
    })

    return () => unsubscribe()
  }, [user])

  // Persist shopping list to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shoppingList', JSON.stringify(shoppingList))
    }
  }, [shoppingList])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', next ? 'dark' : 'light')
        if (next) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      return next
    })
  }, [])

  const toggleFavorite = useCallback(
    async (recipeId: string) => {
      if (!user || user.isAnonymous) {
        // Guest: use localStorage
        setFavorites((prev) => {
          const next = prev.includes(recipeId)
            ? prev.filter((id) => id !== recipeId)
            : [...prev, recipeId]
          localStorage.setItem('favorites', JSON.stringify(next))
          return next
        })
        return
      }

      // Logged-in user: sync with Firestore
      const userDocRef = doc(db, 'users', user.uid)
      const isFav = favorites.includes(recipeId)
      try {
        if (isFav) {
          await updateDoc(userDocRef, { favorites: arrayRemove(recipeId) })
        } else {
          await updateDoc(userDocRef, { favorites: arrayUnion(recipeId) })
        }
      } catch (err) {
        console.error('Favori güncellenemedi:', err)
      }
    },
    [user, favorites]
  )

  const addToShoppingList = useCallback((items: ShoppingItem[]) => {
    setShoppingList((prev) => {
      const existingIds = new Set(prev.map((i) => `${i.recipeId}-${i.ingredientName}`))
      const newItems = items.filter(
        (item) => !existingIds.has(`${item.recipeId}-${item.ingredientName}`)
      )
      return [...prev, ...newItems]
    })
  }, [])

  const toggleShoppingItem = useCallback((id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }, [])

  const removeShoppingItem = useCallback((id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearShoppingList = useCallback(() => {
    setShoppingList([])
  }, [])

  const t = useCallback(
    (key: string): string => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const entry = (TRANSLATIONS as any)[key]
      if (!entry) return key
      return entry[language] || entry['tr'] || key
    },
    [language]
  )

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        isDark,
        toggleTheme,
        favorites,
        toggleFavorite,
        shoppingList,
        addToShoppingList,
        toggleShoppingItem,
        removeShoppingItem,
        clearShoppingList,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
