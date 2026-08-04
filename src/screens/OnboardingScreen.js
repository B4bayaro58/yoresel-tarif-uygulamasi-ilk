import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { QUICK_FILTERS } from '../constants/recipeTags';

const { width } = Dimensions.get('window');
const PREF_GRID_GAP = 14;
const PREF_TILE_WIDTH = (width - 64 - PREF_GRID_GAP) / 2;

const SLIDES = [
  {
    key: '1',
    emoji: '🌍',
    gradients: ['#4A6CF7', '#3A5CE5'],
    titleKey: 'onboarding1Title',
    descKey: 'onboarding1Desc',
  },
  {
    key: '2',
    emoji: '👨‍🍳',
    gradients: ['#FF6B57', '#FF4D3A'],
    titleKey: 'onboarding2Title',
    descKey: 'onboarding2Desc',
  },
  {
    key: '3',
    emoji: '🏆',
    gradients: ['#10B981', '#059669'],
    titleKey: 'onboarding3Title',
    descKey: 'onboarding3Desc',
  },
  {
    key: '4',
    type: 'prefs',
    titleKey: 'onboardingPrefsTitle',
    descKey: 'onboardingPrefsDesc',
  },
];

export default function OnboardingScreen({ onFinish }) {
  const { colors, translate, saveOnboardingPreferences } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const togglePref = (key) => {
    setSelectedPrefs(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      saveOnboardingPreferences(selectedPrefs);
      onFinish();
    }
  };

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.skipButton} onPress={onFinish}>
        <Text style={[styles.skipText, { color: colors.textSecondary }]}>
          {translate('skip')}
        </Text>
      </TouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {item.type === 'prefs' ? (
              <Text style={styles.prefsEmoji}>🍽️</Text>
            ) : (
              <LinearGradient
                colors={item.gradients}
                style={styles.emojiCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.slideEmoji}>{item.emoji}</Text>
              </LinearGradient>
            )}
            <Text style={[styles.slideTitle, item.type === 'prefs' && styles.prefsTitle, { color: colors.text }]}>
              {translate(item.titleKey)}
            </Text>
            <Text style={[styles.slideDesc, item.type === 'prefs' && styles.prefsDesc, { color: colors.textSecondary }]}>
              {translate(item.descKey)}
            </Text>
            {item.type === 'prefs' && (
              <View style={styles.prefsGrid}>
                {QUICK_FILTERS.map(qf => {
                  const isSelected = selectedPrefs.includes(qf.key);
                  return (
                    <TouchableOpacity
                      key={qf.key}
                      style={[styles.prefTile, { width: PREF_TILE_WIDTH, height: PREF_TILE_WIDTH * 0.88 }]}
                      onPress={() => togglePref(qf.key)}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={qf.gradient}
                        style={[styles.prefTileGradient, { opacity: isSelected ? 1 : 0.55 }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.prefTileEmoji}>{qf.emoji}</Text>
                        <Text style={styles.prefTileLabel} numberOfLines={2}>
                          {translate(qf.labelKey)}
                        </Text>
                      </LinearGradient>
                      {isSelected && (
                        <>
                          <View style={styles.prefTileBorder} pointerEvents="none" />
                          <View style={styles.prefTileCheck}>
                            <Check size={13} color={qf.gradient[0]} strokeWidth={3} />
                          </View>
                        </>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === currentIndex ? colors.primary : colors.border,
                width: i === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: colors.primary }]}
        onPress={goNext}
        activeOpacity={0.85}
      >
        <Text style={styles.nextButtonText}>
          {isLast ? translate('getStarted') : translate('next')}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 20,
    paddingTop: 56,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  emojiCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  slideEmoji: {
    fontSize: 80,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  slideDesc: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
  },
  prefsEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  prefsTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  prefsDesc: {
    fontSize: 14,
    marginBottom: 8,
  },
  prefsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: PREF_GRID_GAP,
    marginTop: 20,
  },
  prefTile: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  prefTileGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 8,
  },
  prefTileEmoji: { fontSize: 32 },
  prefTileLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 17,
  },
  prefTileBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  prefTileCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginVertical: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    marginHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});
