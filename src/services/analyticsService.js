/**
 * Analytics Service
 * Firebase Analytics web SDK React Native'de tam desteklenmez (özellikle Expo Go'da).
 * Bu servis Firestore tabanlı event logging kullanır — her ortamda çalışır.
 */
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// Expo Go'da Firestore yazma hataları sessizce yutulur
const safeLog = async (eventName, params = {}) => {
  try {
    await addDoc(collection(db, 'analytics_events'), {
      event: eventName,
      ...params,
      timestamp: serverTimestamp(),
    });
  } catch {
    // Analytics hatası uygulamayı durdurmamalı
  }
};

/** Tarif detay sayfası açıldı */
export const logRecipeView = (recipeId, recipeName, continent) =>
  safeLog('recipe_view', { recipeId, recipeName, continent });

/** Favoriye eklendi / çıkarıldı */
export const logFavoriteToggle = (recipeId, recipeName, added) =>
  safeLog('favorite_toggle', { recipeId, recipeName, added });

/** Arama yapıldı */
export const logSearch = (query) =>
  safeLog('search', { query });

/** Tarif paylaşıldı */
export const logShare = (recipeId, recipeName) =>
  safeLog('recipe_share', { recipeId, recipeName });

/** Alışveriş listesine malzeme eklendi */
export const logShoppingAdd = (ingredientName) =>
  safeLog('shopping_add', { ingredientName });

/** Tarif adımları tamamlandı */
export const logRecipeComplete = (recipeId, recipeName) =>
  safeLog('recipe_complete', { recipeId, recipeName });

/** Yorum gönderildi */
export const logReviewSubmit = (recipeId) =>
  safeLog('review_submit', { recipeId });

/** Kullanıcı giriş yaptı */
export const logLogin = (method = 'email') =>
  safeLog('login', { method });

/** Kullanıcı kayıt oldu */
export const logSignUp = (method = 'email') =>
  safeLog('sign_up', { method });
