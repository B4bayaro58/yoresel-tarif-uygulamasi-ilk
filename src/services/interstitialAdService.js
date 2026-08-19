import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import { INTERSTITIAL_AD_UNIT_ID } from '../constants/adUnits';

const VIEW_COUNT_KEY = 'admobInterstitial_recipeViewCount';
const SHOW_EVERY_N_VIEWS = 3; // her 3. tarif açılışında bir kez göster

let interstitial = null;
let isLoaded = false;

function preload() {
  interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);
  isLoaded = false;

  const unsubLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    isLoaded = true;
  });
  const unsubClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    isLoaded = false;
    unsubLoaded();
    unsubClosed();
    preload(); // bir sonraki gösterim için hemen yeniden yükle
  });

  interstitial.load();
}

preload();

// RecipeDetail her açıldığında çağrılır. İlk açılışta hiç göstermez, sonra
// her 3. açılışta bir gösterir (AdMob'un "excessive interruption" politikasından
// kaçınmak için).
export async function maybeShowInterstitial(isPremium) {
  if (isPremium) return;
  try {
    const raw = await AsyncStorage.getItem(VIEW_COUNT_KEY);
    const count = raw ? parseInt(raw, 10) + 1 : 1;
    await AsyncStorage.setItem(VIEW_COUNT_KEY, String(count));

    if (count > 1 && count % SHOW_EVERY_N_VIEWS === 0 && isLoaded && interstitial) {
      interstitial.show();
    }
  } catch {
    // sessiz fail -- reklam gösterilmemesi kritik değil
  }
}
