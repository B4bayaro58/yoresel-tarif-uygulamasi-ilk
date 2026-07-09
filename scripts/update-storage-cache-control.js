/**
 * Firebase Storage'daki mevcut tarif fotoğraflarına (recipes/ altında) uzun ömürlü
 * Cache-Control metadata'sı ekler. Yeni yüklenen fotoğraflar zaten bu başlıkla
 * yükleniyor (bkz. src/services/imageUploadService.js ve
 * web/src/app/admin/recipes/[id]/page.tsx); bu script geçmişte yüklenmiş dosyaları
 * aynı seviyeye getirir.
 *
 * Kurulum:
 *   1. Firebase Console > Project Settings > Service Accounts >
 *      "Generate new private key" ile bir JSON anahtarı indir.
 *   2. İndirilen dosyayı scripts/serviceAccountKey.json olarak kaydet
 *      (bu dosya .gitignore'da, asla commit'lenmez).
 *   3. node scripts/update-storage-cache-control.js
 *
 * Farklı bir bucket kullanmak istersen: FIREBASE_STORAGE_BUCKET env değişkenini set et.
 */
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const keyPath = path.join(__dirname, 'serviceAccountKey.json');
let serviceAccount;
try {
  serviceAccount = require(keyPath);
} catch {
  console.error(
    `Servis hesabı anahtarı bulunamadı: ${keyPath}\n` +
    'Firebase Console > Project Settings > Service Accounts üzerinden indirip bu isimle kaydet.'
  );
  process.exit(1);
}

const bucketName =
  process.env.FIREBASE_STORAGE_BUCKET || 'yoresel-tarifler.firebasestorage.app';

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: bucketName,
});

const CACHE_CONTROL = 'public, max-age=31536000, immutable';

async function main() {
  const bucket = getStorage().bucket();
  const [files] = await bucket.getFiles({ prefix: 'recipes/' });

  if (files.length === 0) {
    console.log('recipes/ altında dosya bulunamadı.');
    return;
  }

  console.log(`${files.length} dosya bulundu, Cache-Control güncelleniyor...`);

  let updated = 0;
  let skipped = 0;
  for (const file of files) {
    const [metadata] = await file.getMetadata();
    if (metadata.cacheControl === CACHE_CONTROL) {
      skipped++;
      continue;
    }
    await file.setMetadata({ cacheControl: CACHE_CONTROL });
    updated++;
    if ((updated + skipped) % 20 === 0) {
      console.log(`  ${updated + skipped}/${files.length} işlendi...`);
    }
  }

  console.log(`Tamamlandı: ${updated} dosya güncellendi, ${skipped} zaten güncel.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Hata:', err);
    process.exit(1);
  });
