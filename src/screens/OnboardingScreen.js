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
import { useApp } from '../contexts/AppContext';

const { width } = Dimensions.get('window');

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
];

export default function OnboardingScreen({ onFinish }) {
  const { colors, translate } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
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
            <LinearGradient
              colors={item.gradients}
              style={styles.emojiCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.slideEmoji}>{item.emoji}</Text>
            </LinearGradient>
            <Text style={[styles.slideTitle, { color: colors.text }]}>
              {translate(item.titleKey)}
            </Text>
            <Text style={[styles.slideDesc, { color: colors.textSecondary }]}>
              {translate(item.descKey)}
            </Text>
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
