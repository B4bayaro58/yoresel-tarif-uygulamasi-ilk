/**
 * Firestore "recipes" koleksiyonundaki her dokümanın Firebase Storage'da barınan
 * `photo` alanı için küçük bir "kart" versiyonu (480×320, ~q78 JPEG) üretip
 * `recipes-thumb/` altına yükler ve dokümana `photoThumb` alanı olarak yazar.
 *
 * Neden: Tarif kartları (ana sayfa ızgarası, arama, favoriler) ortalama ~180KB'lık
 * 1200×800 tam boyut fotoğrafı ~380×210'luk bir alanda gösteriyordu — next/image
 * optimizasyonu (Vercel maliyeti nedeniyle) bilinçli olarak kapalı olduğundan bu
 * boyut hiç küçültülmeden indiriliyordu. Bu script mevcut ~1100 fotoğraf için
 * geriye dönük küçük versiyon üretir; web/src/app/admin/recipes/[id]/page.tsx
 * artık yeni yüklemelerde bunu otomatik yapıyor.
 *
 * Yeniden çalıştırılabilir: `photoThumb` alanı zaten dolu olan dokümanlar atlanır,
 * yarıda kesilirse kaldığı yerden devam eder.
 *
 * Kurulum: scripts/serviceAccountKey.json gerekli (bkz. update-storage-cache-control.js).
 * Kullanım: node scripts/generate-recipe-thumbnails.js
 */
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
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

const CACHE_CONTROL = 'public, max-age=31536000, immutable';
const THUMB_W = 480;
const THUMB_H = 320;
const CONCURRENCY = 6;

function extractStoragePath(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/\/o\/([^?]+)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

async function buildThumbUrl(bucket, docId, sourcePath) {
  const [buffer] = await bucket.file(sourcePath).download();
  const thumbBuffer = await sharp(buffer)
    .resize(THUMB_W, THUMB_H, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 78 })
    .toBuffer();

  const thumbPath = `recipes-thumb/${docId}.jpg`;
  const token = crypto.randomUUID();
  const thumbFile = bucket.file(thumbPath);
  await thumbFile.save(thumbBuffer, {
    contentType: 'image/jpeg',
    metadata: {
      cacheControl: CACHE_CONTROL,
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(thumbPath)}?alt=media&token=${token}`;
}

async function processDoc(db, bucket, doc, stats) {
  const data = doc.data();
  if (data.photoThumb) { stats.skipped++; return; }

  const sourcePath = extractStoragePath(data.photo);
  if (!sourcePath) { stats.notFirebase++; return; }

  try {
    const thumbUrl = await buildThumbUrl(bucket, doc.id, sourcePath);
    await db.collection('recipes').doc(doc.id).update({ photoThumb: thumbUrl });
    stats.done++;
  } catch (err) {
    stats.failed.push({ id: doc.id, error: err.message });
  }
}

async function runPool(items, worker, concurrency) {
  let i = 0;
  async function next() {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, next));
}

async function main() {
  const db = getFirestore();
  const bucket = getStorage().bucket();

  console.log('Firestore "recipes" koleksiyonu okunuyor...');
  const snap = await db.collection('recipes').get();
  console.log(`${snap.size} doküman bulundu.\n`);

  const stats = { done: 0, skipped: 0, notFirebase: 0, failed: [] };
  const limit = process.env.THUMB_LIMIT ? Number(process.env.THUMB_LIMIT) : null;
  const docs = limit ? snap.docs.filter((d) => !d.data().photoThumb).slice(0, limit) : snap.docs;
  if (limit) console.log(`THUMB_LIMIT=${limit} — sadece ilk ${docs.length} eksik doküman işlenecek (test modu).\n`);
  let processed = 0;

  await runPool(docs, async (doc) => {
    await processDoc(db, bucket, doc, stats);
    processed++;
    if (processed % 25 === 0) {
      console.log(`  ${processed}/${docs.length} işlendi... (${stats.done} oluşturuldu, ${stats.skipped} zaten vardı, ${stats.notFirebase} Firebase değil, ${stats.failed.length} hata)`);
    }
  }, CONCURRENCY);

  console.log('\n── SONUÇ ──────────────────────────────────────');
  console.log(`Oluşturulan küçük görsel: ${stats.done}`);
  console.log(`Zaten mevcut (atlandı):   ${stats.skipped}`);
  console.log(`Firebase Storage değil (statik/Unsplash, atlandı): ${stats.notFirebase}`);
  console.log(`Hatalı: ${stats.failed.length}`);
  if (stats.failed.length > 0) {
    console.log('\nHatalı dokümanlar:');
    stats.failed.slice(0, 20).forEach((f) => console.log(`  ${f.id}: ${f.error}`));
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Hata:', err);
    process.exit(1);
  });
