import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useApp } from '../contexts/AppContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

function SkeletonBox({ style }) {
  const { colors } = useApp();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        { backgroundColor: colors.border, opacity },
      ]}
    />
  );
}

export function RecipeCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonBox style={styles.cardImage} />
      <View style={styles.cardContent}>
        <SkeletonBox style={styles.titleLine} />
        <SkeletonBox style={styles.subtitleLine} />
        <SkeletonBox style={styles.metaLine} />
      </View>
    </View>
  );
}

export function RecipeGridSkeleton({ count = 6 }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 140,
    borderRadius: 16,
  },
  cardContent: {
    padding: 8,
    gap: 6,
  },
  titleLine: {
    height: 14,
    borderRadius: 7,
    width: '80%',
  },
  subtitleLine: {
    height: 12,
    borderRadius: 6,
    width: '60%',
  },
  metaLine: {
    height: 10,
    borderRadius: 5,
    width: '40%',
  },
});
