import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useApp } from './AppContext';
import { deleteImageByUrl } from '../services/imageUploadService';
import { setUser as setSentryUser } from '../services/sentryService';
import { signInWithGoogle, isGoogleSignInAvailable } from '../services/googleAuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Admin email - hardcoded for security
const ADMIN_EMAIL = 'admin@yoreseltarifler.com';

export const AuthProvider = ({ children }) => {
  const { setCurrentUserId, translate } = useApp();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setCurrentUserId(firebaseUser.uid);
        setSentryUser(firebaseUser);
        // Resolve immediately from the hardcoded email so the app doesn't block
        // startup on a Firestore round-trip; the real per-user flag (set via
        // ManageUsersScreen's "promote to admin") arrives right after and only
        // ever upgrades isAdmin to true, never downgrades it mid-session.
        setIsAdmin(firebaseUser.email === ADMIN_EMAIL);
        setLoading(false);

        getDoc(doc(db, 'users', firebaseUser.uid))
          .then((snap) => {
            if (snap.exists() && snap.data().isAdmin === true) {
              setIsAdmin(true);
            }
          })
          .catch(() => {});
      } else {
        setUser(null);
        setIsAdmin(false);
        setCurrentUserId(null);
        setSentryUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const register = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, { displayName });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        createdAt: new Date().toISOString(),
        favorites: [],
        createdRecipes: [],
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let errorMessage = translate('loginFailed');
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        errorMessage = translate('userNotFound');
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = translate('wrongPassword');
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = translate('invalidEmail');
      }
      return { success: false, error: errorMessage };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const idToken = await signInWithGoogle();
      if (!idToken) return { success: false, error: null }; // kullanıcı vazgeçti, hata değil

      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      const fUser = result.user;

      // Google ile ilk kez giriş yapan kullanıcı için register()'ın
      // oluşturduğu şekille aynı users/{uid} dokümanını oluştur. Var olan
      // dokümana asla dokunma -- isAdmin/favorites gibi alanlar korunmalı.
      const userDocRef = doc(db, 'users', fUser.uid);
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        await setDoc(userDocRef, {
          uid: fUser.uid,
          email: fUser.email,
          displayName: fUser.displayName || '',
          createdAt: new Date().toISOString(),
          favorites: [],
          createdRecipes: [],
        });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: translate('googleSignInError') };
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteAccount = async (password) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return { success: false, error: 'No user' };

      // Firebase requires recent authentication before deletion
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);

      const uid = currentUser.uid;
      const avatarUrl = currentUser.photoURL;
      const batch = writeBatch(db);

      // Delete user's Firestore document
      batch.delete(doc(db, 'users', uid));

      // Delete user's reviews
      const reviewsSnap = await getDocs(
        query(collection(db, 'reviews'), where('userId', '==', uid))
      );
      reviewsSnap.forEach(d => batch.delete(d.ref));

      // Delete user's pending recipes
      const recipesSnap = await getDocs(
        query(collection(db, 'recipes'), where('submittedBy', '==', uid))
      );
      const recipePhotoUrls = recipesSnap.docs.map(d => d.data().photo).filter(Boolean);
      recipesSnap.forEach(d => batch.delete(d.ref));

      await batch.commit();

      // Firestore kayıtları silindikten sonra Storage'daki yetim dosyaları
      // temizle (profil fotoğrafı + gönderilen tariflerin fotoğrafları) --
      // hesap silme politikasının "ilişkili tüm veriler" şartı Storage'ı da
      // kapsıyor (bkz. mağaza inceleme denetimi 2026-08-09).
      await Promise.all([avatarUrl, ...recipePhotoUrls].map(deleteImageByUrl));

      // Delete Firebase Auth user last
      await deleteUser(currentUser);

      return { success: true };
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        return { success: false, error: 'wrongPasswordDelete' };
      }
      return { success: false, error: 'deleteAccountError' };
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
  };

  const logout = async () => {
    if (isGuest) {
      setIsGuest(false);
      return { success: true };
    }
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAdmin,
    isGuest,
    loading,
    register,
    login,
    loginWithGoogle,
    isGoogleSignInAvailable: isGoogleSignInAvailable(),
    logout,
    resetPassword,
    deleteAccount,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
