/**
 * Admin panelindeki istatistikler için görüntülenme sayaçları.
 *
 * Web'deki web/src/lib/viewStats.ts ile aynı dokümanlara aynı kurallarla yazar
 * (recipeStats/{id}, blogStats/{id}, statsDaily/{YYYY-MM-DD}) — ikisi birlikte
 * değiştirilmeli. Firestore kuralları sadece +1 artışa izin veriyor.
 *
 * - views: toplam açılma (aynı cihazdan 30 dk içindeki tekrarlar sayılmaz)
 * - uniqueViews: o öğeyi ilk kez açan cihaz sayısı ("kaç kişi")
 * - statsDaily.visitors: o gün en az bir tarif/yazı açan cihaz sayısı
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const STORAGE_KEY = 'yt_view_stats_v1';
const REPEAT_WINDOW_MS = 30 * 60 * 1000;

const inFlight = new Set();

const todayKey = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const trackView = async (kind, id) => {
  if (!id) return;
  const key = `${kind}:${id}`;
  if (inFlight.has(key)) return;
  inFlight.add(key);

  try {
    let data = { seen: {} };
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) data = JSON.parse(raw);
    } catch { /* bozuk/erişilemez — boş başla */ }

    const now = Date.now();
    const last = data.seen?.[key];
    if (last && now - last < REPEAT_WINDOW_MS) return;

    const isUnique = !last;
    const day = todayKey();
    const isNewDayVisitor = data.lastActiveDay !== day;

    data.seen = { ...data.seen, [key]: now };
    data.lastActiveDay = day;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});

    const collectionName = kind === 'recipe' ? 'recipeStats' : 'blogStats';
    const dailyField = kind === 'recipe' ? 'recipeViews' : 'blogViews';

    await Promise.all([
      setDoc(
        doc(db, collectionName, String(id)),
        { views: increment(1), uniqueViews: increment(isUnique ? 1 : 0), lastViewedAt: serverTimestamp() },
        { merge: true },
      ),
      setDoc(
        doc(db, 'statsDaily', day),
        { [dailyField]: increment(1), visitors: increment(isNewDayVisitor ? 1 : 0) },
        { merge: true },
      ),
    ]);
  } catch {
    // İstatistik hatası uygulamayı etkilememeli
  } finally {
    inFlight.delete(key);
  }
};

/** Override edilmiş tarifler statik id'leri altında sayılır (web ile aynı) */
export const trackRecipeView = (recipe) =>
  trackView('recipe', recipe?.overridesStaticId ?? recipe?.id);

export const trackBlogView = (postId) => trackView('blog', postId);
