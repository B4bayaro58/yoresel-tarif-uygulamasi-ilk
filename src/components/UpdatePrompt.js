import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useApp } from '../contexts/AppContext';
import { subscribeAdConsentPrompt } from '../services/adConsentService';
import {
  ANDROID_STORE_URL,
  IOS_STORE_URL,
  getUpdateRequirement,
  shouldShowSoftPrompt,
} from '../constants/appVersion';

const SNOOZE_KEY = 'updatePromptSnooze';
// Açılış anını (onboarding, KVKK rıza penceresi, bildirim izni) kalabalıklaştırmamak için.
const CHECK_DELAY_MS = 4000;

// Mağazada daha yeni bir sürüm varsa kullanıcıyı mağazaya yönlendirir.
// Ayarlar: Firestore settings/appConfig (bkz. src/constants/appVersion.js).
export default function UpdatePrompt() {
  const { colors, translate, language } = useApp();
  const [requirement, setRequirement] = useState(null); // 'soft' | 'force' | null
  const [config, setConfig] = useState(null);
  const [consentOpen, setConsentOpen] = useState(false);

  // iOS aynı anda iki Modal gösteremiyor; KVKK rıza penceresi açıkken bekle.
  useEffect(() => subscribeAdConsentPrompt(({ open }) => setConsentOpen(open)), []);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const currentVersion = Constants.expoConfig?.version;
        const snap = await getDoc(doc(db, 'settings', 'appConfig'));
        if (cancelled || !snap.exists()) return;
        const data = snap.data();
        const req = getUpdateRequirement(currentVersion, data);
        if (!req) return;
        if (req === 'soft') {
          const raw = await AsyncStorage.getItem(SNOOZE_KEY);
          const snooze = raw ? JSON.parse(raw) : null;
          if (!shouldShowSoftPrompt(data.latestVersion, snooze)) return;
        }
        if (!cancelled) {
          setConfig(data);
          setRequirement(req);
        }
      } catch (e) {
        // Ağ yoksa / doküman yoksa sessizce geç — güncelleme kontrolü uygulamayı asla engellememeli.
      }
    }, CHECK_DELAY_MS);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  if (!requirement) return null;

  const isForce = requirement === 'force';
  const customMessage = config?.message?.[language] || config?.message?.tr;

  const openStore = () => {
    Linking.openURL(Platform.OS === 'ios' ? IOS_STORE_URL : ANDROID_STORE_URL).catch(() => {});
  };

  const later = async () => {
    setRequirement(null);
    try {
      await AsyncStorage.setItem(SNOOZE_KEY, JSON.stringify({ version: config?.latestVersion, at: Date.now() }));
    } catch {}
  };

  return (
    <Modal
      visible={!consentOpen}
      transparent
      animationType="fade"
      // Zorunlu güncellemede Android geri tuşu pencereyi kapatmasın.
      onRequestClose={isForce ? () => {} : later}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={[styles.title, { color: colors.text }]}>
            {translate(isForce ? 'updateRequiredTitle' : 'updateAvailableTitle')}
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {customMessage || translate(isForce ? 'updateRequiredBody' : 'updateAvailableBody')}
          </Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={openStore}
            accessibilityRole="button"
            accessibilityLabel={translate('updateNow')}
          >
            <Text style={styles.primaryBtnText}>{translate('updateNow')}</Text>
          </TouchableOpacity>
          {!isForce && (
            <TouchableOpacity
              onPress={later}
              style={styles.laterBtn}
              accessibilityRole="button"
              accessibilityLabel={translate('updateLater')}
            >
              <Text style={[styles.laterText, { color: colors.textSecondary }]}>{translate('updateLater')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 24 },
  card: { borderRadius: 18, borderWidth: 1, padding: 22, alignItems: 'center' },
  emoji: { fontSize: 40, marginBottom: 8 },
  title: { fontSize: 19, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  body: { fontSize: 15, lineHeight: 22, textAlign: 'center', marginBottom: 18 },
  primaryBtn: { alignSelf: 'stretch', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  laterBtn: { marginTop: 12, paddingVertical: 6, paddingHorizontal: 12 },
  laterText: { fontSize: 14, fontWeight: '600' },
});
