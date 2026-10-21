import AsyncStorage from '@react-native-async-storage/async-storage';

// Kişiselleştirilmiş reklam için KVKK açık rızası (metin:
// constants/legalTexts.js AD_CONSENT_TEXT). AB/İngiltere kullanıcılarında
// Google'ın UMP formu (TCF) zaten rıza alıyor -- orada bu katman devreye
// girmez, reklam isteği UMP sonucuna bırakılır. Diğer herkeste (Türkiye
// dahil) rıza yoksa veya reddedildiyse yalnızca kişiselleştirilmemiş reklam
// istenir.
const KEY = 'kvkkAdConsent';

let consent = null; // 'granted' | 'denied' | null
let umpApplies = false;
const listeners = new Set();
let pendingResolve = null;
let promptOpen = false; // modal henüz abone olmadan istenirse kaybolmasın

export async function loadAdConsent() {
  try {
    const v = await AsyncStorage.getItem(KEY);
    consent = v === 'granted' || v === 'denied' ? v : null;
  } catch {
    consent = null;
  }
  return consent;
}

export function setUmpApplies(value) {
  umpApplies = value;
}

export function isUmpRegion() {
  return umpApplies;
}

export function getAdConsent() {
  return consent;
}

// BannerAd `requestOptions`, InterstitialAd.createForAdRequest ve
// useRewardedAd'e verilir. İstek anındaki rıza durumunu yansıtır.
export function getAdRequestOptions() {
  if (umpApplies) return {};
  return { requestNonPersonalizedAdsOnly: consent !== 'granted' };
}

export async function setAdConsent(value) {
  consent = value;
  try {
    await AsyncStorage.setItem(KEY, value);
  } catch {
    // Kaydedilemezse bu oturumla sınırlı kalır; varsayılan zaten
    // kişiselleştirilmemiş reklam.
  }
  if (pendingResolve) {
    pendingResolve(value);
    pendingResolve = null;
  }
  promptOpen = false;
  listeners.forEach((l) => l({ open: false }));
}

// AdConsentModal bu olaylarla açılıp kapanır.
export function subscribeAdConsentPrompt(listener) {
  listeners.add(listener);
  if (promptOpen) listener({ open: true });
  return () => listeners.delete(listener);
}

// İlk açılışta: kullanıcı seçim yapana kadar bekler.
export function promptAdConsent() {
  return new Promise((resolve) => {
    pendingResolve = resolve;
    promptOpen = true;
    listeners.forEach((l) => l({ open: true }));
  });
}

// Profil > Reklam Tercihleri: rızayı geri alma/değiştirme (KVKK: rıza her
// an geri alınabilir olmalı).
export function openAdConsentPreferences() {
  promptOpen = true;
  listeners.forEach((l) => l({ open: true }));
}

// Tercihler ekranı seçim yapılmadan kapatılırsa (yalnızca Profil'den
// açıldığında mümkün; ilk açılıştaki pencere bir seçim bekler).
export function closeAdConsentPreferences() {
  if (pendingResolve) return;
  promptOpen = false;
  listeners.forEach((l) => l({ open: false }));
}
