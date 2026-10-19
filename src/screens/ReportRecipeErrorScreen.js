import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { AlertTriangle, Send } from 'lucide-react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

// Tarif detayındaki "Hata Bildir" butonundan açılır. Yazma kuralı
// firestore.rules'taki recipeErrorReports bloğunda (alan listesi/uzunluklar
// orayla birebir aynı tutulmalı); admin tarafı RecipeErrorReportsScreen.js.
const MIN_LENGTH = 5;
const MAX_LENGTH = 2000;

export default function ReportRecipeErrorScreen({ route, navigation }) {
  const { colors, translate } = useApp();
  const { user } = useAuth();
  const { recipeId, recipeName } = route.params || {};
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const text = message.trim();
    if (text.length < MIN_LENGTH) {
      Alert.alert(translate('reportRecipeError'), translate('reportRecipeErrorTooShort'));
      return;
    }
    if (!user) return;
    try {
      setSending(true);
      await addDoc(collection(db, 'recipeErrorReports'), {
        recipeId: String(recipeId).slice(0, 128),
        recipeName: String(recipeName || '').slice(0, 200),
        message: text.slice(0, MAX_LENGTH),
        userId: user.uid,
        userName: (user.displayName || user.email?.split('@')[0] || '').slice(0, 100),
        userEmail: user.email || '',
        platform: Platform.OS === 'ios' ? 'ios' : 'android',
        createdAt: serverTimestamp(),
      });
      Alert.alert(translate('reportRecipeError'), translate('reportRecipeErrorThanks'), [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(translate('error'), error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.iconWrap, { backgroundColor: '#F59E0B20' }]}>
          <AlertTriangle size={28} color="#F59E0B" />
        </View>
        {recipeName ? (
          <Text style={[styles.recipeName, { color: colors.text }]}>{recipeName}</Text>
        ) : null}
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          {translate('reportRecipeErrorHint')}
        </Text>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder={translate('reportRecipeErrorPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={MAX_LENGTH}
          textAlignVertical="top"
          autoCorrect={false}
          spellCheck={false}
          accessibilityLabel={translate('reportRecipeError')}
        />
        <Text style={[styles.counter, { color: colors.textTertiary }]}>
          {message.length}/{MAX_LENGTH}
        </Text>

        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary, opacity: sending ? 0.7 : 1 }]}
          onPress={handleSend}
          disabled={sending}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={translate('reportRecipeErrorSend')}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Send size={18} color="#fff" />
              <Text style={styles.sendText}>{translate('reportRecipeErrorSend')}</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 24,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  recipeName: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  hint: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  input: {
    minHeight: 160,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    lineHeight: 21,
  },
  counter: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 6,
    marginBottom: 20,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
