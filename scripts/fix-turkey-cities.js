/**
 * Türkiye tariflerinin Firestore override'larında eksik `city` alanını statik
 * kaynaktan (src/constants/recipes.js) resync eder. `city` admin panelindeki
 * düzenleme formunda YOK -- yani bu alana hiçbir admin elle dokunmuyor, eksik
 * olması geçmişte bu alana dokunan bir toplu işlemden kaynaklanıyor (bkz.
 * proje hafızası: ingredient_corruption_incident_2026-07-19, aynı kök neden
 * sınıfı). Denetim: scripts/audit-turkey-cities.js.
 *
 * Sadece `city` alanını yazar, başka hiçbir alana dokunmaz.
 *
 * Kurulum: scripts/serviceAccountKey.json (bkz. update-storage-cache-control.js)
 * Çalıştırma: node scripts/fix-turkey-cities.js
 */
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { pathToFileURL } = require('url');

const keyPath = path.join(__dirname, 'serviceAccountKey.json');
let serviceAccount;
try {
  serviceAccount = require(keyPath);
} catch {
  console.error(`Servis hesabı anahtarı bulunamadı: ${keyPath}`);
  process.exit(1);
}
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// Statik karşılığı olmayan (native) ama isminden şehri belli olan tek istisna.
const NATIVE_CITY_OVERRIDES = {
  CB3TckXFHtotrVGdoVXG: 'Sivas', // "Sivas Divriği Pilavı"
};

async function main() {
  const { RECIPES_DATA } = await import(
    pathToFileURL(path.join(__dirname, '..', 'src', 'constants', 'recipes.js')).href
  );
  const staticById = new Map(RECIPES_DATA.tr.map((r) => [String(r.id), r]));
  const staticTurkeyIds = new Set(
    RECIPES_DATA.tr.filter((r) => r.country === 'Türkiye').map((r) => String(r.id))
  );

  const snap = await db.collection('recipes').get();

  const toFix = [];
  snap.forEach((doc) => {
    const d = doc.data();
    if (d.city) return;
    const overridesId = d.overridesStaticId != null ? String(d.overridesStaticId) : null;
    if (overridesId && staticTurkeyIds.has(overridesId)) {
      const staticRecipe = staticById.get(overridesId);
      if (staticRecipe?.city) toFix.push({ docId: doc.id, city: staticRecipe.city, name: d.name });
    } else if (NATIVE_CITY_OVERRIDES[doc.id]) {
      toFix.push({ docId: doc.id, city: NATIVE_CITY_OVERRIDES[doc.id], name: d.name });
    }
  });

  console.log(`Düzeltilecek doküman sayısı: ${toFix.length}`);

  const BATCH_SIZE = 400;
  let written = 0;
  for (let i = 0; i < toFix.length; i += BATCH_SIZE) {
    const chunk = toFix.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    for (const item of chunk) {
      batch.update(db.collection('recipes').doc(item.docId), { city: item.city });
    }
    await batch.commit();
    written += chunk.length;
    console.log(`  ${written}/${toFix.length} yazıldı...`);
  }

  console.log('Tamamlandı. Toplam güncellenen doküman:', written);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
