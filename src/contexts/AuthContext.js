import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  revokeAccessToken,
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs, writeBatch, updateDoc } from 'firebase/firestore';
import { MINOR_PUBLIC_NAME } from '../constants/legalTexts';
import { setMinorMode } from '../services/adConsentService';
import { auth, db } from '../config/firebase';
import { useApp } from './AppContext';
import { deleteImageByUrl } from '../services/imageUploadService';
import { setUser as setSentryUser, captureError } from '../services/sentryService';
import { signInWithGoogle, isGoogleSignInAvailable } from '../services/googleAuthService';
import { signInWithApple, isAppleSignInAvailable } from '../services/appleAuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { setCurrentUserId, translate } = useApp();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  // 15 yaş beyanı (5651 ek 4 + Yaş Doğrulama Yönetmeliği). null = henüz
  // bilinmiyor / okunamadı -- bu durumda AgeGateModal engellemez.
  const [ageConfirmed, setAgeConfirmed] = useState(null);
  // '18+' | '15-17' | null. '15-17' hesaplarda Yönetmelik md.8 korumaları
  // uygulanır (kişiselleştirilmemiş reklam, herkese açık içerikte gerçek ad yok).
  const [ageBracket, setAgeBracket] = useState(null);

  useEffect(() => {
    if (ageBracket === '15-17') setMinorMode(true);
  }, [ageBracket]);
  const [appleSignInAvailable, setAppleSignInAvailable] = useState(false);

  useEffect(() => {
    isAppleSignInAvailable().then(setAppleSignInAvailable);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setCurrentUserId(firebaseUser.uid);
        setSentryUser(firebaseUser);
        // Don't block startup on a Firestore round-trip: isAdmin starts false
        // and the per-user flag (set via ManageUsersScreen's "promote to
        // admin") upgrades it right after -- same source as web and as
        // firestore.rules' isAdmin(). (A hardcoded admin email used to grant
        // the admin UI here, on a dead domain anyone could register.)
        setIsAdmin(false);
        setLoading(false);

        getDoc(doc(db, 'users', firebaseUser.uid))
          .then((snap) => {
            if (snap.exists() && snap.data().isAdmin === true) {
              setIsAdmin(true);
            }
            const b = snap.exists() ? snap.data().ageBracket : null;
            const bracket = b === '18+' || b === '15-17' ? b : null;
            setAgeBracket(bracket);
            setAgeConfirmed(bracket !== null);
          })
          .catch(() => {
            setAgeBracket(null);
            setAgeConfirmed(null);
          });
      } else {
        setUser(null);
        setIsAdmin(false);
        setAgeConfirmed(null);
        setAgeBracket(null);
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

  const loginWithApple = async () => {
    try {
      const appleResult = await signInWithApple();
      if (!appleResult) return { success: false, error: null }; // kullanıcı vazgeçti, hata değil

      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: appleResult.identityToken,
        rawNonce: appleResult.rawNonce,
      });
      const result = await signInWithCredential(auth, credential);
      const fUser = result.user;

      // Apple sadece ilk girişte fullName döner (sonraki girişlerde null) --
      // bu yüzden Firebase Auth profiline hemen yazılmalı, yoksa bir daha
      // hiç elde edilemez.
      const appleFullName = appleResult.fullName;
      const displayName = fUser.displayName ||
        [appleFullName?.givenName, appleFullName?.familyName].filter(Boolean).join(' ');
      if (displayName && !fUser.displayName) {
        await updateProfile(fUser, { displayName });
      }

      // Apple ile ilk kez giriş yapan kullanıcı için register()'ın
      // oluşturduğu şekille aynı users/{uid} dokümanını oluştur. Var olan
      // dokümana asla dokunma -- isAdmin/favorites gibi alanlar korunmalı.
      const userDocRef = doc(db, 'users', fUser.uid);
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        await setDoc(userDocRef, {
          uid: fUser.uid,
          email: fUser.email,
          displayName: displayName || '',
          createdAt: new Date().toISOString(),
          favorites: [],
          createdRecipes: [],
        });
      }

      return { success: true };
    } catch (error) {
      // Hata kodu mesaja eklenir: Apple girişi iOS'ta hiç çalışmamıştı ve
      // genel mesaj sebebi gizliyordu (2026-10-14).
      console.error('Apple sign-in error:', error);
      captureError(error, { flow: 'apple-sign-in', code: error?.code });
      const code = error?.code || error?.message;
      return { success: false, error: code ? `${translate('appleSignInError')} (${code})` : translate('appleSignInError') };
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

  // Hesap silmeden önce kimlik doğrulamanın hangi yolla yapılacağı: şifreli
  // hesaplar şifre sorar, Google/Apple ile girenlerin şifresi olmadığı için
  // aynı sağlayıcıyla yeniden giriş istenir.
  const getDeleteAuthMethod = () => {
    const providers = (auth.currentUser?.providerData || []).map(p => p.providerId);
    if (providers.includes('password')) return 'password';
    if (providers.includes('google.com')) return 'google';
    if (providers.includes('apple.com')) return 'apple';
    return 'password';
  };

  const reauthenticateForDelete = async (currentUser, password) => {
    const method = getDeleteAuthMethod();
    if (method === 'google') {
      const idToken = await signInWithGoogle();
      if (!idToken) return { cancelled: true };
      await reauthenticateWithCredential(currentUser, GoogleAuthProvider.credential(idToken));
      return {};
    }
    if (method === 'apple') {
      // Apple ile giriş yalnızca iOS'ta var -- Android'deki Apple
      // kullanıcısı e-postayla silme talebine yönlendirilir.
      if (!(await isAppleSignInAvailable())) return { error: 'deleteAccountAppleUnavailable' };
      const appleResult = await signInWithApple();
      if (!appleResult) return { cancelled: true };
      const credential = new OAuthProvider('apple.com').credential({
        idToken: appleResult.identityToken,
        rawNonce: appleResult.rawNonce,
      });
      await reauthenticateWithCredential(currentUser, credential);
      return { appleAuthorizationCode: appleResult.authorizationCode };
    }
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
    return {};
  };

  const deleteAccount = async (password) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return { success: false, error: 'No user' };

      // Firebase requires recent authentication before deletion
      const reauth = await reauthenticateForDelete(currentUser, password);
      if (reauth.cancelled) return { success: false, error: null };
      if (reauth.error) return { success: false, error: reauth.error };

      const uid = currentUser.uid;
      const avatarUrl = currentUser.photoURL;
      const batch = writeBatch(db);

      // Delete user's Firestore document
      batch.delete(doc(db, 'users', uid));

      // Delete user's reviews
      const reviewsSnap = await getDocs(
        query(collection(db, 'reviews'), where('userId', '==', uid))
      );
      const reviewPhotoUrls = reviewsSnap.docs.map(d => d.data().photoUrl).filter(Boolean);
      reviewsSnap.forEach(d => batch.delete(d.ref));

      // Tarif hata bildirimleri uid + e-posta içeriyor -- hesapla birlikte
      // silinmeli (KVKK md.7).
      const errorReportsSnap = await getDocs(
        query(collection(db, 'recipeErrorReports'), where('userId', '==', uid))
      );
      errorReportsSnap.forEach(d => batch.delete(d.ref));

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
      await Promise.all([avatarUrl, ...recipePhotoUrls, ...reviewPhotoUrls].map(deleteImageByUrl));

      // Apple ile giriş yapan hesaplarda uygulamanın Apple token'ı iptal
      // edilmeli (App Store kuralı 5.1.1(v)). Başarısız olursa silmeyi
      // engellememeli -- veriler zaten silindi.
      if (reauth.appleAuthorizationCode) {
        try {
          await revokeAccessToken(auth, reauth.appleAuthorizationCode);
        } catch {}
      }

      // Delete Firebase Auth user last
      await deleteUser(currentUser);

      return { success: true };
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        return { success: false, error: 'wrongPasswordDelete' };
      }
      if (error.code === 'auth/user-mismatch') {
        return { success: false, error: 'deleteAccountWrongAccount' };
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

  // merge: kayıt/Google/Apple akışının oluşturduğu users/{uid} dokümanındaki
  // diğer alanlara dokunma (firestore.rules sahibin bu alanları yazmasına
  // izin veriyor; isAdmin/isBlocked değişmediği sürece).
  const confirmAge = async (bracket) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    await setDoc(
      doc(db, 'users', uid),
      { ageBracket: bracket, ageConfirmed15: true, ageConfirmedAt: new Date().toISOString() },
      { merge: true }
    );
    setAgeBracket(bracket);
    setAgeConfirmed(true);
    if (bracket === '15-17') {
      // Beyandan önce yazılmış yorumlar da gerçek adla yayında kalmasın.
      try {
        const snap = await getDocs(query(collection(db, 'reviews'), where('userId', '==', uid)));
        await Promise.all(snap.docs.map((d) => updateDoc(d.ref, { userName: MINOR_PUBLIC_NAME })));
      } catch {}
    }
  };

  const declineAge = async () => {
    if (!auth.currentUser) return;
    try {
      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        { ageDeclaredUnder15: true, ageDeclaredAt: new Date().toISOString() },
        { merge: true }
      );
    } finally {
      await signOut(auth);
    }
  };

  const value = {
    user,
    ageConfirmed,
    ageBracket,
    confirmAge,
    declineAge,
    isAdmin,
    isGuest,
    loading,
    register,
    login,
    loginWithGoogle,
    isGoogleSignInAvailable: isGoogleSignInAvailable(),
    loginWithApple,
    isAppleSignInAvailable: appleSignInAvailable,
    logout,
    resetPassword,
    deleteAccount,
    getDeleteAuthMethod,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
