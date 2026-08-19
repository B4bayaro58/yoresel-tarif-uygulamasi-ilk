'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInAnonymously,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  loginAsGuest: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
          const firestoreAdmin = snap.exists() && snap.data().isAdmin === true
          // Geçici fallback: ilk kurulum için — setup-admin sayfası ziyaret edildikten sonra kaldırılacak
          const emailFallback = firebaseUser.email === 'cagatylmz@gmail.com'
          setIsAdmin(firestoreAdmin || emailFallback)
        } catch {
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (email: string, password: string, displayName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email,
      displayName,
      favorites: [],
      createdAt: serverTimestamp(),
    })
  }

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, new GoogleAuthProvider())
    const gUser = result.user

    // Google ile ilk kez giriş yapan kullanıcı için register()'ın oluşturduğu
    // şekille aynı users/{uid} dokümanını oluştur. Var olan dokümana asla
    // dokunma -- isAdmin/favorites gibi alanlar korunmalı.
    const userDocRef = doc(db, 'users', gUser.uid)
    const snap = await getDoc(userDocRef)
    if (!snap.exists()) {
      await setDoc(userDocRef, {
        uid: gUser.uid,
        email: gUser.email,
        displayName: gUser.displayName || '',
        favorites: [],
        createdAt: serverTimestamp(),
      })
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  const loginAsGuest = async () => {
    await signInAnonymously(auth)
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, register, loginWithGoogle, logout, loginAsGuest, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
