import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

// `collectionsService.js` ile aynı desen: yayınlanan yazılar tek sorguyla
// çekilip TTL'li önbelleğe alınır, sıralama client-side yapılır (composite
// index gerektirmemek için). TTL/sorgu mantığı web/src/lib/blog.ts ile aynı.
const STORAGE_KEY = 'blogCache_v1';
const TTL_MS = 15 * 60 * 1000; // 1 saat değil 15 dakika — blog içeriği koleksiyonlardan daha sık güncellenebilir

let memoryCache = null;
let memoryCacheSavedAt = 0;
let pending = null;

function toMillis(value) {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && value !== null && 'seconds' in value) {
    return value.seconds * 1000;
  }
  const parsed = Date.parse(String(value));
  return Number.isNaN(parsed) ? 0 : parsed;
}

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

export async function getPublishedBlogPosts() {
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
      const snap = await getDocs(query(collection(db, 'blogPosts'), where('status', '==', 'published')));
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => toMillis(b.publishedAt) - toMillis(a.publishedAt));
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

export async function getLatestBlogPosts(count) {
  const all = await getPublishedBlogPosts();
  return all.slice(0, count);
}

// Sorgu hem `slug` hem `status=='published'` filtresini birlikte taşır — tek
// başına `slug` filtresi, Firestore kuralının ("published || isAdmin()") tüm
// olası sonuçlar için statik olarak sağlanamaması nedeniyle TÜM sorguyu
// reddettirir (bkz. web/src/lib/blog.ts'teki aynı gerekçe).
export async function getBlogPostBySlug(slug) {
  try {
    const snap = await getDocs(
      query(collection(db, 'blogPosts'), where('slug', '==', slug), where('status', '==', 'published'))
    );
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  } catch {
    return null;
  }
}

export function formatBlogDate(value) {
  if (!value) return '';
  const millis = toMillis(value);
  if (!millis) return '';
  return new Date(millis).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}
