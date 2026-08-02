/**
 * Salt okunur denetim: firestore.rules'taki `recipes.read` kuralı artık
 * isAdmin() için SADECE users/{uid}.isAdmin Firestore alanına bakıyor (mobil
 * istemcideki ADMIN_EMAIL hardcoded fallback'ini DEĞİL). Bu script, mevcut
 * admin hesaplarının gerçekten Firestore'da isAdmin:true'ya sahip olup
 * olmadığını kontrol eder -- değilse, o hesap kural değişikliğinden sonra
 * PendingRecipesScreen gibi admin ekranlarında "izin reddedildi" ile kilitlenir.
 *
 * Çalıştırma: node scripts/audit-admin-accounts.js
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

const ADMIN_EMAIL = 'admin@yoreseltarifler.com';

async function main() {
  const snap = await db.collection('users').get();
  console.log('Toplam users dokümanı:', snap.size);

  const admins = [];
  let hardcodedEmailDoc = null;
  snap.forEach((doc) => {
    const d = doc.data();
    if (d.isAdmin === true) admins.push({ id: doc.id, email: d.email });
    if (d.email === ADMIN_EMAIL) hardcodedEmailDoc = { id: doc.id, isAdmin: d.isAdmin === true };
  });

  console.log('\nisAdmin:true olan kullanıcılar:');
  if (admins.length === 0) console.log('  (yok)');
  admins.forEach((a) => console.log(`  ${a.id}  ${a.email || '(email yok)'}`));

  console.log(`\nHardcoded ADMIN_EMAIL (${ADMIN_EMAIL}) durumu:`);
  if (!hardcodedEmailDoc) {
    console.log('  ⚠ Bu e-postayla bir users dokümanı bulunamadı.');
  } else if (hardcodedEmailDoc.isAdmin) {
    console.log(`  ✓ users/${hardcodedEmailDoc.id}.isAdmin == true (kural değişikliğinden etkilenmez)`);
  } else {
    console.log(`  ⚠ users/${hardcodedEmailDoc.id}.isAdmin != true — bu hesap mobil istemcide hardcoded e-posta`);
    console.log('    eşleşmesiyle Admin Panel görüyor ama Firestore kuralları artık isAdmin() alanına');
    console.log('    bakıyor, yani bu hesap recipes.read (pending vb.) için 403 alacak.');
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
