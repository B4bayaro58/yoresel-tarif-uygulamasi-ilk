/**
 * Uygulama içi güncelleme penceresini yönetir (Firestore settings/appConfig).
 * Mantık: src/constants/appVersion.js, pencere: src/components/UpdatePrompt.js
 *
 * Kurulum: scripts/serviceAccountKey.json
 * Kullanım:
 *   node scripts/set-app-version.js                 -> mevcut değerleri göster
 *   node scripts/set-app-version.js 1.1.0           -> 1.1.0'dan eskilere "Yeni sürüm var" (kapatılabilir)
 *   node scripts/set-app-version.js 1.1.0 1.0.5     -> ayrıca 1.0.5'ten eskilere zorunlu güncelleme
 *
 * ÖNEMLİ: latestVersion'ı yalnızca o sürüm HEM App Store HEM Google Play'de
 * yayına girdikten sonra yükseltin; yoksa kullanıcı mağazada güncelleme bulamaz.
 */
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

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

const VERSION_RE = /^\d+\.\d+\.\d+$/;

async function main() {
  const [latest, min] = process.argv.slice(2);
  const ref = db.doc('settings/appConfig');
  if (!latest) {
    const snap = await ref.get();
    console.log(snap.exists ? snap.data() : '(settings/appConfig yok — pencere kimseye gösterilmiyor)');
    return;
  }
  for (const v of [latest, min].filter(Boolean)) {
    if (!VERSION_RE.test(v)) throw new Error(`Geçersiz sürüm: ${v} (ör. 1.1.0)`);
  }
  const data = { latestVersion: latest, updatedAt: FieldValue.serverTimestamp() };
  if (min) data.minVersion = min;
  await ref.set(data, { merge: true });
  console.log('Kaydedildi:', { latestVersion: latest, ...(min ? { minVersion: min } : {}) });
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
