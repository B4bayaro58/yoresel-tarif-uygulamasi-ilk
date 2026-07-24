/**
 * Türkiye tariflerinde `city` alanının Firestore override'larında statik
 * kaynakla (src/constants/recipes.js) tutarlı olup olmadığını denetler.
 * `city` admin panelindeki düzenleme formunda YOK (bkz. web/src/app/admin/
 * recipes/[id]/page.tsx FormState) -- yani bir override'da bu alan eksik/
 * yanlışsa bunun sebebi bir admin'in kasıtlı değişikliği değil, geçmişte bu
 * alana dokunan bir toplu işlemdir (bkz. proje hafızası:
 * ingredient_corruption_incident_2026-07-19, aynı kök neden sınıfı).
 *
 * Salt okunur bir denetim scriptidir, hiçbir şey yazmaz.
 *
 * Kurulum: scripts/serviceAccountKey.json (bkz. update-storage-cache-control.js)
 * Çalıştırma: node scripts/audit-turkey-cities.js
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

async function main() {
  const { RECIPES_DATA } = await import(
    pathToFileURL(path.join(__dirname, '..', 'src', 'constants', 'recipes.js')).href
  );
  const staticById = new Map(RECIPES_DATA.tr.map((r) => [String(r.id), r]));
  const staticTurkeyIds = new Set(
    RECIPES_DATA.tr.filter((r) => r.country === 'Türkiye').map((r) => String(r.id))
  );

  const snap = await db.collection('recipes').get();
  console.log('Toplam Firestore recipes dokümanı:', snap.size);

  let overridesOfTurkishStatics = 0;
  let missingCityInOverride = 0;
  let cityMismatch = 0;
  let nativeTurkeyDocs = 0;
  let nativeMissingCity = 0;
  const missingSamples = [];
  const mismatchSamples = [];
  const nativeMissingSamples = [];

  snap.forEach((doc) => {
    const d = doc.data();
    const overridesId = d.overridesStaticId != null ? String(d.overridesStaticId) : null;
    if (overridesId && staticTurkeyIds.has(overridesId)) {
      overridesOfTurkishStatics++;
      const staticRecipe = staticById.get(overridesId);
      if (!d.city) {
        missingCityInOverride++;
        if (missingSamples.length < 40) {
          missingSamples.push({ docId: doc.id, overridesId, name: d.name, staticCity: staticRecipe?.city });
        }
      } else if (staticRecipe?.city && d.city !== staticRecipe.city) {
        cityMismatch++;
        if (mismatchSamples.length < 40) {
          mismatchSamples.push({ docId: doc.id, overridesId, name: d.name, overrideCity: d.city, staticCity: staticRecipe.city });
        }
      }
    } else if (!overridesId && d.country === 'Türkiye') {
      nativeTurkeyDocs++;
      if (!d.city) {
        nativeMissingCity++;
        if (nativeMissingSamples.length < 40) nativeMissingSamples.push({ docId: doc.id, name: d.name });
      }
    }
  });

  console.log('Türkiye statiklerini override eden kayıt sayısı:', overridesOfTurkishStatics);
  console.log('  -> city alanı eksik:', missingCityInOverride);
  console.log('  -> city alanı statik kaynaktan farklı:', cityMismatch);
  console.log('Native (override olmayan) Türkiye dokümanı:', nativeTurkeyDocs);
  console.log('  -> city alanı eksik:', nativeMissingCity);

  console.log('\n--- city eksik örnekler (override) ---');
  console.log(JSON.stringify(missingSamples, null, 2));
  console.log('\n--- city uyuşmazlığı örnekleri (override vs statik) ---');
  console.log(JSON.stringify(mismatchSamples, null, 2));
  console.log('\n--- city eksik örnekler (native) ---');
  console.log(JSON.stringify(nativeMissingSamples, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
