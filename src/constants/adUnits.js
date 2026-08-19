import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

const extra = Constants.expoConfig?.extra ?? {};

function pick(devTestId, prodAndroid, prodIos) {
  if (__DEV__) return devTestId;
  const real = Platform.OS === 'ios' ? prodIos : prodAndroid;
  return real || devTestId; // gerçek ID henüz set edilmemişse test ID'ye düş
}

export const BANNER_AD_UNIT_ID = pick(
  TestIds.ADAPTIVE_BANNER,
  extra.admobBannerIdAndroid,
  extra.admobBannerIdIos,
);

export const INTERSTITIAL_AD_UNIT_ID = pick(
  TestIds.INTERSTITIAL,
  extra.admobInterstitialIdAndroid,
  extra.admobInterstitialIdIos,
);

export const REWARDED_AD_UNIT_ID = pick(
  TestIds.REWARDED,
  extra.admobRewardedIdAndroid,
  extra.admobRewardedIdIos,
);
