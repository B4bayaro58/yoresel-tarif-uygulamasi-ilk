import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

// Misafir modundaki (isGuest) kullanıcılara gösterilen kilit ekranı --
// tab/bölüm başlığı görünür kalır, sadece içerik bu bileşenle değişir.
// "Giriş Yap" butonu logout() çağırıyor: guest için logout sadece isGuest'i
// false yapıyor, bu da AppNavigator'ı AuthStack'e (Login ekranı) düşürüyor --
// ProfileScreen.js'deki mevcut "guest logout = login'e dön" deseniyle aynı.
export default function LockedFeature({ title, message, compact = false }) {
  const { colors, translate } = useApp();
  const { logout } = useAuth();

  return (
    <View style={[styles.container, compact ? styles.compact : styles.fullScreen]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primary + '18' }]}>
        <Lock size={compact ? 24 : 30} color={colors.primary} />
      </View>
      {!!title && (
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      )}
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={logout}
        accessibilityRole="button"
        accessibilityLabel={translate('loginButton')}
      >
        <Text style={styles.buttonText}>{translate('loginButton')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  fullScreen: {
    flex: 1,
    paddingVertical: 40,
  },
  compact: {
    paddingVertical: 28,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
