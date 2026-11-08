import { AppState, Platform } from 'react-native';
import { AdsConsent, AdsConsentStatus, MobileAds } from 'react-native-google-mobile-ads';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import {
  getAdConsent,
  loadAdConsent,
  promptAdConsent,
  setTrackingAllowed,
  setUmpApplies,
} from './adConsentService';

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

// ATT sonucunu döner: true yalnızca kullanıcı takibe izin verdiyse.
async function requestTrackingIfNeeded() {
  const current = await getTrackingPermissionsAsync();
  if (current.status !== 'undetermined') return current.status === 'granted';
  await waitForActive();
  await new Promise((r) => setTimeout(r, 1000));
  await waitForActive();
  const result = await requestTrackingPermissionsAsync();
  return result.status === 'granted';
}

// Uygulama açılışında bir kez çalışır: önce ATT (iOS), sonra gerekiyorsa UMP
// consent formu (AB/İngiltere), UMP kapsamı dışındaysa KVKK açık rıza
// penceresi (AdConsentModal), en son Mobile Ads SDK başlatılır. Reklam
// isteği bundan önce yapılmamalı (AdMob policy); yapılırsa
// getAdRequestOptions() varsayılan olarak kişiselleştirilmemiş ister.
//
// iOS'ta ATT reddedildiyse (veya kısıtlıysa) UMP/KVKK pencereleri HİÇ
// gösterilmez -- Apple 5.1.1(iv) reddi: "Ask App Not to Track" sonrası
// GDPR formu tekrar takip izni istiyordu. O durumda yalnızca
// kişiselleştirilmemiş reklam istenir; kullanıcı fikrini iOS Ayarlar'dan
// değiştirirse sonraki açılışta akış normal çalışır.
export async function initAdsConsentAndSdk() {
  await loadAdConsent();
  try {
    let trackingAllowed = true;
    if (Platform.OS === 'ios') {
      try {
        trackingAllowed = await requestTrackingIfNeeded();
      } catch {
        trackingAllowed = false;
      }
    }
    setTrackingAllowed(trackingAllowed);

    if (!trackingAllowed) {
      await MobileAds().initialize();
      return true;
    }

    let umpApplies = false;
    try {
      const info = await AdsConsent.requestInfoUpdate();
      if (info.isConsentFormAvailable && info.status === AdsConsentStatus.REQUIRED) {
        await AdsConsent.showForm();
      }
      umpApplies =
        info.status === AdsConsentStatus.REQUIRED || info.status === AdsConsentStatus.OBTAINED;
    } catch {
      // UMP'ye ulaşılamadı -- KVKK katmanı yine de çalışsın.
    }
    setUmpApplies(umpApplies);

    if (!umpApplies && getAdConsent() === null) {
      await promptAdConsent();
    }

    await MobileAds().initialize();
    return true;
  } catch {
    // Consent/init hata verirse reklamlar hiç gösterilmesin - sessiz fail.
    return false;
  }
}
