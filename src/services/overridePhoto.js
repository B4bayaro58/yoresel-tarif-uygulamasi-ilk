import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

// Statik tarif kartları için özel yüklenmiş fotoğraf (override) sonuçlarını
// önbelleğe alır -- aynı tarif farklı bir listede (favoriler, arama) tekrar
// görünse bile Firestore'a ikinci kez sorgu atılmaz. `null` de gecerli bir
// sonuçtur (override yok anlamına gelir), bu yüzden Map.has ile kontrol
// ediliyor.
//
// Salt bellek-içi bir Map, uygulama soğuk başlangıcında (cold start) her
// seferinde sıfırlanıyordu -- her açılış aynı ilk ekran kartlarını tekrar
// sorguluyordu. AsyncStorage'a yazılan bir gölge önbellekle sonuçlar TTL
// dolana kadar açılışlar arasında hayatta kalıyor.
const STORAGE_KEY = 'overridePhotoCache_v1';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 saat -- admin bir override değiştirirse çok uzun bayat kalmasın

const cache = new Map();
const pending = new Map();

let persistedLoadPromise = null;
async function ensurePersistedLoaded() {
  if (!persistedLoadPromise) {
    persistedLoadPromise = (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const now = Date.now();
        Object.entries(parsed).forEach(([staticId, entry]) => {
          if (entry && now - entry.savedAt < TTL_MS) {
            cache.set(staticId, entry.result);
          }
        });
      } catch {
        // AsyncStorage okunamazsa sessizce yok say
      }
    })();
  }
  return persistedLoadPromise;
}

let saveTimer = null;
function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(async () => {
    saveTimer = null;
    try {
      const now = Date.now();
      const obj = {};
      cache.forEach((result, staticId) => {
        obj[staticId] = { result, savedAt: now };
      });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch {
      // yazılamazsa sessizce yok say
    }
  }, 1000);
}

// Bir tarif kartı FlatList tarafından render edildiğinde (yani kullanıcının
// kaydırarak görüntüleme penceresine girdiğinde) çağrılır -- tek, hedefli bir
// sorguyla o tarifin admin panelinden özel fotoğrafla override edilip
// edilmediğine bakar. Böylece binlerce statik tarifin hepsi için toplu/limitli
// bir sorgu atmak yerine, FlatList'in fiilen render ettiği kartlar kadar
// Firestore okuması yapılır (bkz. web tarafındaki aynı yaklaşım,
// web/src/lib/overridePhoto.ts).
export async function getOverrideRecipe(staticId) {
  await ensurePersistedLoaded();

  if (cache.has(staticId)) return cache.get(staticId);
  const existing = pending.get(staticId);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const snap = await getDocs(
        query(collection(db, 'recipes'), where('overridesStaticId', '==', staticId), limit(1))
      );
      const result = snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data(), isFirebase: true };
      cache.set(staticId, result);
      scheduleSave();
      return result;
    } catch {
      // Firebase'e erişilemiyorsa override yok say, statik fotoğraf kalsın
      return null;
    } finally {
      pending.delete(staticId);
    }
  })();

  pending.set(staticId, promise);
  return promise;
}
