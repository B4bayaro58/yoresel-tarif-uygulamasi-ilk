// Yorumlardan herkese açık metin/ad/fotoğraf alanlarını siler, yalnızca
// anonim puan (recipeId, userId, rating, tarih) kalır. Yorum özelliği anonim
// puana çevrildiğinde (2026-10-21) bir kez çalıştırıldı.
// Çalıştırma: node scripts/strip-review-text.js
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

initializeApp({ credential: cert(require(path.join(__dirname, 'serviceAccountKey.json'))) });

(async () => {
  const db = getFirestore();
  const snap = await db.collection('reviews').get();
  let changed = 0;
  for (const d of snap.docs) {
    const r = d.data();
    const del = {};
    for (const k of ['comment', 'userName', 'photoUrl', 'reportedBy', 'reportCount']) {
      if (k in r) del[k] = FieldValue.delete();
    }
    if (Object.keys(del).length) { await d.ref.update(del); changed++; }
  }
  console.log({ total: snap.size, changed });
})();
