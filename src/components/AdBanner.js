import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../contexts/AppContext';

/**
 * Mobil reklam alanı placeholder bileşeni.
 * Google AdMob entegrasyonu yapılana kadar görsel yer tutucu olarak kullanılır.
 *
 * size:
 *   'banner'     — 320×50   (standart banner)
 *   'rectangle'  — 300×250  (medium rectangle, en yüksek gelirli format)
 *   'large'      — 320×100  (büyük banner)
 */
const SIZE_CONFIG = {
  banner:    { width: 320, height: 50,  label: '320 × 50' },
  rectangle: { width: 300, height: 250, label: '300 × 250' },
  large:     { width: 320, height: 100, label: '320 × 100' },
};

export default function AdBanner({ size = 'banner', style }) {
  const { colors } = useApp();
  const cfg = SIZE_CONFIG[size];

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: cfg.width,
          height: cfg.height,
          borderColor: colors.primary + '55',
          backgroundColor: colors.primary + '08',
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: colors.primary }]}>REKLAM ALANI</Text>
      <Text style={[styles.size, { color: colors.textSecondary }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 10,
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  size: {
    fontSize: 11,
    fontWeight: '500',
  },
});
