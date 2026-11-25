// Uygulama içi güncelleme kontrolü — saf mantık (UpdatePrompt.js kullanır).
//
// Firestore `settings/appConfig` dokümanı (admin yazar, herkes okur):
//   latestVersion: '1.1.0'   -> bundan eski sürümlere kapatılabilir "Yeni sürüm var" penceresi
//   minVersion:    '1.0.0'   -> bundan eski sürümlere kapatılamaz "Güncelleme gerekli" ekranı
//   message: { tr, en, fr, it }  (isteğe bağlı, pencere metnini değiştirir)
// Değerleri değiştirmek için: node scripts/set-app-version.js <latest> [min]

export const ANDROID_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.cagatay58.yoreseltarifuygulamasi';
export const IOS_STORE_URL = 'https://apps.apple.com/tr/app/id6801889814';

// Kapatılabilir pencere kapatıldıktan sonra aynı sürüm için tekrar gösterilmeden önce beklenen süre.
export const UPDATE_PROMPT_SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;

// "1.10.0" > "1.9.2" gibi sayısal karşılaştırma. a<b: -1, a==b: 0, a>b: 1.
export function compareVersions(a, b) {
  const pa = String(a || '0').split('.').map((n) => parseInt(n, 10) || 0);
  const pb = String(b || '0').split('.').map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}

// 'force' | 'soft' | null
export function getUpdateRequirement(currentVersion, config) {
  if (!currentVersion || !config) return null;
  if (config.minVersion && compareVersions(currentVersion, config.minVersion) < 0) return 'force';
  if (config.latestVersion && compareVersions(currentVersion, config.latestVersion) < 0) return 'soft';
  return null;
}

// Kapatılabilir pencere bu sürüm için yakın zamanda kapatıldıysa tekrar gösterme.
export function shouldShowSoftPrompt(latestVersion, snooze, now = Date.now()) {
  if (!snooze || snooze.version !== latestVersion) return true;
  return now - (snooze.at || 0) >= UPDATE_PROMPT_SNOOZE_MS;
}
