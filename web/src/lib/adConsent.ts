// Kişiselleştirilmiş reklam için KVKK açık rızası (bkz. @shared/legalTexts
// AD_CONSENT_TEXT). Seçim yalnızca bu tarayıcıda tutulur; seçim yoksa veya
// reddedildiyse AdSense kişiselleştirilmemiş reklam ister (AdSlot.tsx).
export type AdConsent = 'granted' | 'denied'

const KEY = 'kvkkAdConsent'
export const CONSENT_CHANGE_EVENT = 'adconsentchange'
export const OPEN_PREFS_EVENT = 'openconsentprefs'

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
