import { Platform } from 'react-native';
import { AdsConsent, AdsConsentStatus, MobileAds } from 'react-native-google-mobile-ads';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

// Uygulama açılışında bir kez çalışır: önce ATT (iOS), sonra gerekiyorsa UMP
// consent formu gösterilir, en son Mobile Ads SDK başlatılır. Reklam isteği
// bundan önce yapılmamalı (AdMob policy).
export async function initAdsConsentAndSdk() {
  try {
    if (Platform.OS === 'ios') {
      await requestTrackingPermissionsAsync();
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
