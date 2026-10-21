// Salt-okunur: yorum koleksiyonunun durumunu raporlar (metin/ad/fotoğraf
// içeren yorum sayısı). Yorumları anonim puana çevirme kararı öncesi.
// Çalıştırma: node scripts/audit-reviews.js
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({ credential: cert(require(path.join(__dirname, 'serviceAccountKey.json'))) });

(async () => {
  const snap = await getFirestore().collection('reviews').get();
  let withComment = 0, withPhoto = 0, reported = 0;
  const users = new Set();
  snap.forEach((d) => {
    const r = d.data();
    if (r.comment && String(r.comment).trim()) withComment++;
    if (r.photoUrl) withPhoto++;
    if (r.reportCount) reported++;
    users.add(r.userId);
  });
  console.log({ total: snap.size, withComment, withPhoto, reported, distinctUsers: users.size });
})();
