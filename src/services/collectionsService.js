import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

// Editöryal koleksiyonlar (ör. "Sivas'tan Sofranıza") — admin panelinden
// yönetilir, tüm liste tek sorguyla çekilip TTL'li önbelleğe alınır (bkz. web
// tarafındaki aynı yaklaşım, web/src/lib/collections.ts). Sıralama client-side
// yapılır: `isActive` eşitlik filtresi + `order` alanında orderBy birleşimi
// composite index gerektirebilir ve bu projede indexes.json/deploy akışı yok.
const STORAGE_KEY = 'collectionsCache_v1';
const TTL_MS = 60 * 60 * 1000; // 1 saat

let memoryCache = null;
let memoryCacheSavedAt = 0;
let pending = null;

async function loadPersisted() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function savePersisted(data, savedAt) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ data, savedAt }));
  } catch {
    // AsyncStorage yazılamazsa sessizce yok say
  }
}

export async function getCollections() {
  if (memoryCache && Date.now() - memoryCacheSavedAt < TTL_MS) return memoryCache;

  const persisted = await loadPersisted();
  if (persisted) {
    memoryCache = persisted.data;
    memoryCacheSavedAt = persisted.savedAt;
    return memoryCache;
  }

  if (pending) return pending;

  pending = (async () => {
    try {
      const snap = await getDocs(query(collection(db, 'collections'), where('isActive', '==', true)));
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      memoryCache = data;
      memoryCacheSavedAt = Date.now();
      await savePersisted(data, memoryCacheSavedAt);
      return data;
    } catch {
      return [];
    } finally {
      pending = null;
    }
  })();

  return pending;
}

export async function getCollectionById(id) {
  const all = await getCollections();
  return all.find(c => c.id === id) ?? null;
}
