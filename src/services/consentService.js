import { AppState, Platform } from 'react-native';
import { AdsConsent, AdsConsentStatus, MobileAds } from 'react-native-google-mobile-ads';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';

// iOS, uygulama 'active' olmadan (ör. splash ekranı açıkken) yapılan ATT
// isteğini hiçbir şey göstermeden yok sayıyor -- Apple review'da (iPadOS)
// "ATT isteği görünmüyor" diye red sebebi oldu. Önce active'i bekle, sonra
// ilk ekran otursun diye kısa bir gecikme ver.
function waitForActive() {
  if (AppState.currentState === 'active') return Promise.resolve();
  return new Promise((resolve) => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        sub.remove();
        resolve();
      }
    });
  });
}

async function requestTrackingIfNeeded() {
  const current = await getTrackingPermissionsAsync();
  if (current.status !== 'undetermined') return;
  await waitForActive();
  await new Promise((r) => setTimeout(r, 1000));
  await waitForActive();
  await requestTrackingPermissionsAsync();
}

// Uygulama açılışında bir kez çalışır: önce ATT (iOS), sonra gerekiyorsa UMP
// consent formu gösterilir, en son Mobile Ads SDK başlatılır. Reklam isteği
// bundan önce yapılmamalı (AdMob policy).
export async function initAdsConsentAndSdk() {
  try {
    if (Platform.OS === 'ios') {
      await requestTrackingIfNeeded();
    }

    const info = await AdsConsent.requestInfoUpdate();
    if (info.isConsentFormAvailable && info.status === AdsConsentStatus.REQUIRED) {
      await AdsConsent.showForm();
    }

    await MobileAds().initialize();
    return true;
  } catch {
    // Consent/init hata verirse reklamlar hiç gösterilmesin - sessiz fail.
    return false;
  }
}
