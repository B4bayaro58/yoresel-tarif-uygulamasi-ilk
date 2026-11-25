// Otomatik "Günün Menüsü" — mobil (doğrudan) ve web (@shared/dailyMenu) ortak kullanır.
//
// Her gün İstanbul saatiyle 10:00'da değişen 4'lü menü: çorba, ana yemek,
// salata, tatlı. Zamanlanmış bir iş (Cloud Function / cron) YOK: seçim tarihten
// deterministik olarak hesaplanıyor, yani aynı "menü günü" içinde her cihaz ve
// web sunucusu aynı menüyü üretir. Firestore'a yazma yok, kaçırılan tetikleme
// yok, ek maliyet yok.
//
// Admin panelinden elle kaydedilen menü (`settings/dailyMenu`) yalnızca
// kaydedildiği menü günü için geçerlidir (`menuDate` alanı); ertesi gün
// 10:00'da otomatik menüye dönülür. `menuDate` taşımayan eski kayıtlar yok
// sayılır.

export const DAILY_MENU_CATEGORIES = ['soup', 'main-course', 'salad', 'dessert'];

// Türkiye 2016'dan beri sabit UTC+3 (yaz saati yok).
const TR_OFFSET_MS = 3 * 60 * 60 * 1000;
export const DAILY_MENU_ROLLOVER_HOUR = 10;
const ROLLOVER_MS = DAILY_MENU_ROLLOVER_HOUR * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// 10:00'dan önce bir önceki günün menüsü geçerli.
export function getMenuDayNumber(now = Date.now()) {
  const t = typeof now === 'number' ? now : now.getTime();
  return Math.floor((t + TR_OFFSET_MS - ROLLOVER_MS) / DAY_MS);
}

// "2026-11-19" biçiminde menü günü anahtarı.
export function getMenuDateKey(now = Date.now()) {
  return new Date(getMenuDayNumber(now) * DAY_MS).toISOString().slice(0, 10);
}

// Bir sonraki 10:00 (TR) değişimine kalan süre (ms).
export function msUntilNextMenuRollover(now = Date.now()) {
  const t = typeof now === 'number' ? now : now.getTime();
  const nextStart = (getMenuDayNumber(t) + 1) * DAY_MS - TR_OFFSET_MS + ROLLOVER_MS;
  return Math.max(1000, nextStart - t);
}

// FNV-1a 32-bit — platformlar arası aynı sonucu veren basit, kararlı hash.
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// Override edilmiş statik tarifler Firestore ID'siyle duruyor; seçimin
// override'dan etkilenmemesi için statik kimlik esas alınıyor.
export function canonicalRecipeId(recipe) {
  return recipe.overridesStaticId != null ? String(recipe.overridesStaticId) : String(recipe.id);
}

// Her kategori kendi sabit (hash) sırasına diziliyor ve gün numarasıyla bu
// sırada bir adım ilerleniyor: kategorideki tüm tarifler bitmeden aynı tarif
// tekrar gelmez (ör. ~110 çorba ≈ 110 gün). Yeni tarif eklenince sıra yalnızca
// o noktada kayar, menü baştan karışmaz. Fotoğraflı tarifler tercih edilir.
export function pickAutoDailyMenu(recipes, now = Date.now()) {
  const day = getMenuDayNumber(now);
  const menu = [];
  for (const category of DAILY_MENU_CATEGORIES) {
    const inCategory = recipes.filter((r) => r && r.category === category);
    const withPhoto = inCategory.filter((r) => r.photo);
    const pool = withPhoto.length > 0 ? withPhoto : inCategory;
    if (pool.length === 0) continue;
    const ordered = pool
      .map((r) => ({ r, key: canonicalRecipeId(r) }))
      .sort((a, b) => {
        const ha = hash(category + ':' + a.key);
        const hb = hash(category + ':' + b.key);
        return ha - hb || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
      });
    const idx = ((day % ordered.length) + ordered.length) % ordered.length;
    menu.push(ordered[idx].r);
  }
  return menu;
}

// Elle kaydedilmiş menü bugüne aitse onun kimliklerini, değilse null döner.
// `auto: true` kayıtlar web'deki günlük cron'un (web/src/app/api/cron/daily-menu)
// yalnızca eski mobil sürümler (≤1.0.0, menüyü kendisi hesaplamayan) için
// yazdığı otomatik menüdür; yeni istemciler bunu elle menü saymaz, aynı menüyü
// kendileri hesaplar.
export function getActiveManualMenuIds(settings, now = Date.now()) {
  if (!settings || settings.auto === true) return null;
  if (!Array.isArray(settings.recipeIds) || settings.recipeIds.length === 0) return null;
  if (settings.menuDate !== getMenuDateKey(now)) return null;
  return settings.recipeIds.map(String);
}

function findByIdOrOverride(recipes, id) {
  return (
    recipes.find((r) => String(r.id) === id) ||
    recipes.find((r) => r.overridesStaticId != null && String(r.overridesStaticId) === id)
  );
}

// Geçerli menüyü çözer: bugüne ait elle menü varsa o, yoksa otomatik menü.
export function resolveDailyMenu(recipes, settings, now = Date.now()) {
  const manualIds = getActiveManualMenuIds(settings, now);
  if (manualIds) {
    const manual = manualIds.map((id) => findByIdOrOverride(recipes, id)).filter(Boolean);
    if (manual.length > 0) return { recipes: manual, isManual: true };
  }
  return { recipes: pickAutoDailyMenu(recipes, now), isManual: false };
}
