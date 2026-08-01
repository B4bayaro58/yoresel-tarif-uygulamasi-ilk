/**
 * Salt okunur denetim: firestore.rules'taki `recipes.read` kuralını
 * `status in ['published','approved']`'a kısıtlamadan önce, mevcut hiçbir
 * dokümanın status alanı eksik/beklenmedik olup olmadığını kontrol eder --
 * öyle bir doküman varsa kural değişikliği onu herkesten gizler.
 *
 * Kurulum: scripts/serviceAccountKey.json (bkz. update-storage-cache-control.js)
 * Çalıştırma: node scripts/audit-recipe-status.js
 */
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

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
  const snap = await db.collection('recipes').get();
  console.log('Toplam Firestore recipes dokümanı:', snap.size);

  const counts = {};
  const missingStatusSamples = [];
  snap.forEach((doc) => {
    const d = doc.data();
    const status = d.status === undefined ? '(yok)' : String(d.status);
    counts[status] = (counts[status] || 0) + 1;
    if (d.status === undefined) {
      missingStatusSamples.push({ id: doc.id, name: d.name, overridesStaticId: d.overridesStaticId });
    }
  });

  console.log('\nStatus dağılımı:');
  for (const [status, count] of Object.entries(counts)) {
    console.log(`  ${status}: ${count}`);
  }

  if (missingStatusSamples.length > 0) {
    console.log(`\n⚠ status alanı eksik ${missingStatusSamples.length} doküman (ilk 20):`);
    missingStatusSamples.slice(0, 20).forEach((s) => console.log(' ', JSON.stringify(s)));
  } else {
    console.log('\n✓ Tüm dokümanlarda status alanı mevcut.');
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
