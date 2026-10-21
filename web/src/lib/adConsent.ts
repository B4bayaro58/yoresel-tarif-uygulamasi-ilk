// Kişiselleştirilmiş reklam için KVKK açık rızası (bkz. @shared/legalTexts
// AD_CONSENT_TEXT). Seçim yalnızca bu tarayıcıda tutulur; seçim yoksa veya
// reddedildiyse AdSense kişiselleştirilmemiş reklam ister (AdSlot.tsx).
export type AdConsent = 'granted' | 'denied'

const KEY = 'kvkkAdConsent'
export const CONSENT_CHANGE_EVENT = 'adconsentchange'
export const OPEN_PREFS_EVENT = 'openconsentprefs'

// 15-17 yaş hesaplar (Yönetmelik md.8/5-h): rıza ne olursa olsun yalnızca
// kişiselleştirilmemiş reklam. AuthContext oturumdaki yaş grubuna göre ayarlar.
// Cihazda da tutulur: sayfa açılışında yaş grubu Firestore'dan gelmeden
// istenen ilk reklam da kişiselleştirilmemiş olsun.
const MINOR_KEY = 'kvkkMinor'
let minorMode = (() => {
  try { return typeof window !== 'undefined' && window.localStorage.getItem(MINOR_KEY) === '1' } catch { return false }
})()
export function setMinorMode(value: boolean) {
  minorMode = value
  try {
    if (value) window.localStorage.setItem(MINOR_KEY, '1')
  } catch {
    // depolama kapalı -- bellek içi değer yeterli
  }
}
export function isMinorMode() {
  return minorMode
}

// AdSlot bunu okur: true ise kişiselleştirilmiş reklam istenebilir.
export function personalizedAdsAllowed() {
  return !minorMode && getAdConsent() === 'granted'
}

export function getAdConsent(): AdConsent | null {
  try {
    const v = window.localStorage.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

export function setAdConsent(value: AdConsent) {
  try {
    window.localStorage.setItem(KEY, value)
  } catch {
    // Depolama kapalıysa seçim bu oturumla sınırlı kalır; varsayılan zaten
    // kişiselleştirilmemiş reklam.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: value }))
}

export function openConsentPreferences() {
  window.dispatchEvent(new Event(OPEN_PREFS_EVENT))
}
