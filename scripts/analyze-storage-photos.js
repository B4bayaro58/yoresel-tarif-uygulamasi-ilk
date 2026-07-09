/**
 * Salt-okunur analiz: Firebase Storage'daki recipes/ altındaki dosyalardan
 * hangilerinin Firestore'daki hiçbir tarif dokümanında referans verilmediğini
 * (yani "yetim" olduğunu) tespit eder. Hiçbir dosyayı silmez/değiştirmez.
 *
 * Kullanım: node scripts/analyze-storage-photos.js
 */
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const { getFirestore } = require('firebase-admin/firestore');

const keyPath = path.join(__dirname, 'serviceAccountKey.json');
let serviceAccount;
try {
  serviceAccount = require(keyPath);
} catch {
  console.error(`Servis hesabı anahtarı bulunamadı: ${keyPath}`);
  process.exit(1);
}

const bucketName =
  process.env.FIREBASE_STORAGE_BUCKET || 'yoresel-tarifler.firebasestorage.app';

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: bucketName,
});

// Firebase Storage download URL'inden "recipes/xxx.jpg" gibi bucket-relative path'i çıkarır.
function extractStoragePath(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/\/o\/([^?]+)/); // .../o/recipes%2F123.jpg?...
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

async function main() {
  const db = getFirestore();
  const bucket = getStorage().bucket();

  console.log('Firestore "recipes" koleksiyonu okunuyor...');
  const snap = await db.collection('recipes').get();

  const referencedPaths = new Set();
  snap.forEach((doc) => {
    const photo = doc.data().photo;
    const storagePath = extractStoragePath(photo);
    if (storagePath) referencedPaths.add(storagePath);
  });
  console.log(`${snap.size} tarif dokümanı bulundu, ${referencedPaths.size} tanesi Storage fotoğrafına referans veriyor.`);

  console.log('\nStorage "recipes/" klasörü listeleniyor...');
  const [files] = await bucket.getFiles({ prefix: 'recipes/' });
  console.log(`${files.length} dosya bulundu.\n`);

  const orphans = [];
  let referencedCount = 0;
  let totalOrphanBytes = 0;

  for (const file of files) {
    if (referencedPaths.has(file.name)) {
      referencedCount++;
      continue;
    }
    // getFiles() zaten tam metadata döndürür — ayrı bir getMetadata() çağrısı
    // (billing hesabı kapalıyken 403 veren, gereksiz bir istek) atmaya gerek yok.
    const size = Number(file.metadata.size) || 0;
    totalOrphanBytes += size;
    orphans.push({
      name: file.name,
      size,
      updated: file.metadata.updated,
    });
  }

  orphans.sort((a, b) => new Date(a.updated) - new Date(b.updated));

  console.log('── SONUÇ ──────────────────────────────────────');
  console.log(`Toplam dosya:        ${files.length}`);
  console.log(`Kullanımda (referanslı): ${referencedCount}`);
  console.log(`Yetim (referanssız):     ${orphans.length}`);
  console.log(`Yetim dosyaların toplam boyutu: ${(totalOrphanBytes / 1024 / 1024).toFixed(2)} MB`);

  if (orphans.length > 0) {
    console.log('\nİlk 15 yetim dosya (en eskiden yeniye):');
    orphans.slice(0, 15).forEach((f) => {
      console.log(`  ${f.name}  (${(f.size / 1024).toFixed(0)} KB, son değişiklik: ${f.updated})`);
    });

    const fs = require('fs');
    const outPath = path.join(__dirname, 'orphan-photos.json');
    fs.writeFileSync(outPath, JSON.stringify(orphans, null, 2));
    console.log(`\nTüm yetim dosya listesi kaydedildi: ${outPath}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Hata:', err);
    process.exit(1);
  });
