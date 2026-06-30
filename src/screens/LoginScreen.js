import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LogIn, Mail, Lock, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

export default function LoginScreen() {
  const { login, register, continueAsGuest, resetPassword } = useAuth();
  const { colors, translate, showNotification } = useApp();
  const navigation = useNavigation();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      showNotification(translate('fillAllFieldsLogin'));
      return;
    }

    if (!isLogin && !displayName) {
      showNotification(translate('enterName'));
      return;
    }

    setLoading(true);

    if (isLogin) {
      const result = await login(email, password);
      if (result.success) {
        showNotification(translate('loginSuccess'));
      } else {
        showNotification(result.error);
      }
    } else {
      const result = await register(email, password, displayName);
      if (result.success) {
        showNotification(translate('registerSuccess'));
      } else {
        showNotification(result.error);
      }
    }

    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!resetEmail.trim()) return;
    setResetLoading(true);
    const result = await resetPassword(resetEmail);
    setResetLoading(false);
    if (result.success) {
      showNotification(translate('resetPasswordSent'));
      setShowResetModal(false);
      setResetEmail('');
    } else {
      showNotification(translate('resetPasswordError'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#9333EA', '#EC4899']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>👨‍🍳</Text>
            <Text style={styles.title}>{translate('appTitle')}</Text>
            <Text style={styles.subtitle}>
              {isLogin ? translate('welcome') : translate('createAccount')}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <User size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={translate('fullName')}
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                  accessibilityLabel={translate('fullName')}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Mail size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translate('password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                accessibilityLabel={translate('password')}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={isLogin ? translate('loginButton') : translate('registerButton')}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <LogIn size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>
                    {isLogin ? translate('loginButton') : translate('registerButton')}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Şifremi Unuttum — sadece login modunda */}
            {isLogin && (
              <TouchableOpacity
                style={styles.forgotButton}
                onPress={() => { setResetEmail(email); setShowResetModal(true); }}
              >
                <Text style={styles.forgotButtonText}>
                  {translate('resetPassword')}
                </Text>
              </TouchableOpacity>
            )}

            {/* Toggle Login/Register */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.toggleText}>
                {isLogin ? translate('noAccount') : translate('hasAccount')}
                <Text style={styles.toggleTextBold}>
                  {isLogin ? translate('registerButton') : translate('loginButton')}
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Continue as Guest */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={continueAsGuest}
            >
              <Text style={styles.guestButtonText}>
                {translate('continueAsGuest')}
              </Text>
            </TouchableOpacity>

            {/* Legal Links */}
            <View style={styles.legalLinks}>
              <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
                <Text style={styles.legalLinkText}>{translate('termsOfService')}</Text>
              </TouchableOpacity>
              <Text style={styles.legalSeparator}>·</Text>
              <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                <Text style={styles.legalLinkText}>{translate('privacyPolicy')}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </LinearGradient>

      {/* Şifre Sıfırlama Modalı */}
      {showResetModal && (
        <KeyboardAvoidingView
          style={styles.resetOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={styles.resetBackdrop} onPress={() => setShowResetModal(false)} />
          <View style={styles.resetSheet}>
            <Text style={styles.resetTitle}>{translate('resetPassword')}</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={resetEmail}
                onChangeText={setResetEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity
              style={[styles.submitButton, (!resetEmail.trim() || resetLoading) && { opacity: 0.5 }]}
              onPress={handleResetPassword}
              disabled={!resetEmail.trim() || resetLoading}
            >
              {resetLoading
                ? <ActivityIndicator color="#FFFFFF" />
                : <Text style={styles.submitButtonText}>{translate('confirm')}</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.forgotButton} onPress={() => setShowResetModal(false)}>
              <Text style={styles.forgotButtonText}>{translate('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  submitButton: {
    backgroundColor: '#FF6B57',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
  },
  toggleTextBold: {
    fontWeight: '700',
    color: '#FF6B57',
  },
  forgotButton: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  forgotButtonText: {
    fontSize: 13,
    color: '#FF6B57',
    fontWeight: '600',
  },
  guestButton: {
    marginTop: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  resetOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  resetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  resetSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  resetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  legalLinkText: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 12,
    color: '#999',
  },
});
