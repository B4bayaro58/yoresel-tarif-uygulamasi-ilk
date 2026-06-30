export interface Ingredient {
  name: string
  amount: string
  alternatives?: string[]
}

export interface Recipe {
  id: string
  name: string
  country: string
  city?: string
  continent: string
  category: string
  emoji: string
  gradient: string[]
  photo: string
  ingredients: Ingredient[]
  equipment: string[]
  steps: string[]
  servings: number
  prepTime: number
  calories: number
  rating: number
  difficulty: 'easy' | 'medium' | 'hard'
  isFavorite?: boolean
  // Firestore additional fields
  status?: 'published' | 'pending' | 'draft'
  authorId?: string
  authorName?: string
  createdAt?: string
}

export interface ShoppingItem {
  id: string
  recipeId: string
  recipeName: string
  ingredientName: string
  amount: string
  checked: boolean
}

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  favorites: string[]
  isAdmin: boolean
  createdAt: string
}

export type Language = 'tr' | 'en' | 'fr' | 'it'
export type Theme = 'light' | 'dark'
export type Continent =
  | 'europe'
  | 'asia'
  | 'africa'
  | 'north-america'
  | 'south-america'
  | 'central-america'
  | 'oceania'
  | 'middle-east'

export type Category =
  | 'main-course'
  | 'dessert'
  | 'soup'
  | 'salad'
  | 'breakfast'
  | 'appetizer'
  | 'snack'
  | 'beverage'

export interface ContinentItem {
  id: string
  emoji: string
  chef: string
  food: string
}

export interface CategoryItem {
  id: string
  icon: string
}

export interface Review {
  id: string
  recipeId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}
