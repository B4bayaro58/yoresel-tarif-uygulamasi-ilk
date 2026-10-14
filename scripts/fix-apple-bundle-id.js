/**
 * Firebase'in apple.com sağlayıcısına iOS bundle ID'sini ekler. Sağlayıcı
 * yalnızca web Services ID'sini tanıdığı için iOS uygulamasından gelen Apple
 * token'ları (aud = bundle ID) reddediliyordu -- Apple ile giriş iOS'ta hiç
 * çalışmamıştı (2026-10-14).
 *
 * Çalıştırma: node scripts/fix-apple-bundle-id.js
 */
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');

const sa = require(path.join(__dirname, 'serviceAccountKey.json'));
const app = initializeApp({ credential: cert(sa) });

(async () => {
  const { access_token } = await app.options.credential.getAccessToken();
  const url = `https://identitytoolkit.googleapis.com/admin/v2/projects/${sa.project_id}/defaultSupportedIdpConfigs/apple.com?updateMask=appleSignInConfig.bundleIds`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: 'Bearer ' + access_token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ appleSignInConfig: { bundleIds: ['com.cagatay58.yoreseltarifuygulamasi'] } }),
  });
  const json = await res.json();
  if (json.appleSignInConfig?.codeFlowConfig) json.appleSignInConfig.codeFlowConfig.privateKey = '[gizlendi]';
  console.log(res.status, JSON.stringify(json, null, 1));
})().catch(e => console.error(e.message));
