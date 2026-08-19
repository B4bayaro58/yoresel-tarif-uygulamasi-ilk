import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useApp } from '../contexts/AppContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { BANNER_AD_UNIT_ID } from '../constants/adUnits';

const SIZE_MAP = {
  banner: BannerAdSize.BANNER,
  rectangle: BannerAdSize.MEDIUM_RECTANGLE,
  large: BannerAdSize.LARGE_BANNER,
};

export default function AdBanner({ size = 'banner', style }) {
  const { colors } = useApp();
  const { isPremium } = useSubscription();
  const [failed, setFailed] = useState(false);

  if (isPremium) return null;
  if (failed) return null;

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }, style]}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={SIZE_MAP[size] || BannerAdSize.BANNER}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
