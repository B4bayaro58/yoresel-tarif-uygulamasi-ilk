import React from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { useApp } from '../contexts/AppContext';

export default function NotificationToast() {
  const { colors, notification } = useApp();
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!notification) return;

    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, 1800);

    return () => clearTimeout(timeout);
  }, [notification]);

  if (!notification) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.text, opacity },
      ]}
    >
      <Text style={[styles.text, { color: colors.background }]}>
        {notification}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
