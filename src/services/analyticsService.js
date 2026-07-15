/**
 * Analytics Service
 * Firebase Analytics web SDK React Native'de tam desteklenmez (özellikle Expo Go'da).
 * Bu servis Firestore tabanlı event logging kullanır — her ortamda çalışır.
 *
 * Firestore ücretlendirmesi doküman başına yazma sayısına göre yapılır — art
 * arda gelen olaylar (ör. bir tarifteki malzemeleri tek tek market listesine
 * ekleme) kısa bir bekleme penceresinde biriktirilip TEK bir dokümana
 * yazılıyor. Bu şekilde 10 ayrı kullanıcı aksiyonu 10 yazma yerine 1 yazma
 * oluşturuyor (writeBatch()'in aksine — o sadece ağ round-trip'ini azaltır,
 * yazma sayısını değil, çünkü Firestore batch içindeki her .set()'i de ayrı
 * ayrı faturalandırır).
 */
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AppState } from 'react-native';
import { db } from '../config/firebase';

const FLUSH_DELAY_MS = 3000;
const MAX_QUEUE_SIZE = 25;

let queue = [];
let flushTimer = null;

const flush = async () => {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (queue.length === 0) return;
  const batch = queue;
  queue = [];
  try {
    await addDoc(collection(db, 'analytics_events'), {
      events: batch,
      count: batch.length,
      timestamp: serverTimestamp(),
    });
  } catch {
    // Analytics hatası uygulamayı durdurmamalı
  }
};

const scheduleFlush = () => {
  if (flushTimer) return;
  flushTimer = setTimeout(flush, FLUSH_DELAY_MS);
};

// Uygulama arka plana alındığında bekleyen olayları hemen yaz -- yoksa
// kullanıcı bir aksiyon yapıp hemen uygulamayı kapatırsa kuyruktaki olaylar
// hiç yazılmadan kaybolabilir.
AppState.addEventListener('change', (state) => {
  if (state === 'background' || state === 'inactive') flush();
});

const safeLog = (eventName, params = {}) => {
  queue.push({ event: eventName, ...params, at: Date.now() });
  if (queue.length >= MAX_QUEUE_SIZE) {
    flush();
  } else {
    scheduleFlush();
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
