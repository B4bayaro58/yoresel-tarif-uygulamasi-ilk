import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Firebase config — app.config.js extra alanından gelir (EAS Secrets / .env)
const {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseProjectId,
  firebaseStorageBucket,
  firebaseMessagingSenderId,
  firebaseAppId,
  firebaseMeasurementId,
} = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  measurementId: firebaseMeasurementId,
};

// iOS'ta Apple ile giriş: Apple'ın native token'ının audience'ı uygulamanın
// bundle ID'sidir, ama Firebase JS SDK isteği web istemcisi gibi gönderdiği
// için Firebase web Services ID'sini bekleyip "audience does not match" ile
// reddediyordu (Apple girişi iOS'ta hiç çalışmamıştı, 2026-10-14). Native
// iOS SDK'nın gönderdiği bundle başlığını sadece Apple signInWithIdp
// isteklerine ekliyoruz; Firebase o zaman apple.com sağlayıcısının
// `bundleIds` listesine göre doğruluyor (scripts/fix-apple-bundle-id.js).
// Firebase Auth fetch'i her istekte global'den okuduğu için sarmalamak yeterli.
if (Platform.OS === 'ios' && typeof globalThis.fetch === 'function') {
  const IOS_BUNDLE_ID = Constants.expoConfig?.ios?.bundleIdentifier;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : input?.url;
    if (
      IOS_BUNDLE_ID &&
      url?.includes('identitytoolkit.googleapis.com') &&
      url.includes('accounts:signInWithIdp') &&
      typeof init?.body === 'string' &&
      init.body.includes('providerId=apple.com')
    ) {
      const headers = new Headers(init.headers);
      headers.set('X-Ios-Bundle-Identifier', IOS_BUNDLE_ID);
      return originalFetch(input, { ...init, headers });
    }
    return originalFetch(input, init);
  };
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth — use browser localStorage on web, AsyncStorage on native
const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web'
    ? browserLocalPersistence
    : getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage };
export default app;
