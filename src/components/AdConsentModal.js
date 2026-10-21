import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../contexts/AppContext';
import {
  subscribeAdConsentPrompt,
  setAdConsent,
  getAdConsent,
  closeAdConsentPreferences,
} from '../services/adConsentService';
import { AD_CONSENT_TEXT, AD_CONSENT_UI } from '../constants/legalTexts';

// KVKK açık rıza penceresi (kişiselleştirilmiş reklam). "Kabul Et" ve
// "Reddet" eşit ağırlıkta; reddetmek hiçbir özelliği kısıtlamaz. Açılışı
// consentService.initAdsConsentAndSdk ve Profil > Reklam Tercihleri tetikler.
export default function AdConsentModal() {
  const { colors, language } = useApp();
  const [open, setOpen] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const ui = AD_CONSENT_UI[language === 'tr' ? 'tr' : 'en'];

  useEffect(() => subscribeAdConsentPrompt(({ open: o }) => {
    setOpen(o);
    if (!o) setShowFull(false);
  }), []);

  const current = getAdConsent();

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={closeAdConsentPreferences}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{ui.title}</Text>
          <ScrollView style={styles.scroll}>
            <Text style={[styles.body, { color: colors.textSecondary }]}>{ui.summary}</Text>
            {showFull &&
              AD_CONSENT_TEXT.map((b, i) =>
                b.ul ? (
                  b.ul.map((item, j) => (
                    <Text key={`${i}-${j}`} style={[styles.small, { color: colors.textSecondary }]}>• {item}</Text>
                  ))
                ) : (
                  <Text key={i} style={[styles.small, { color: colors.textSecondary }]}>{b.p}</Text>
                )
              )}
          </ScrollView>
          <TouchableOpacity onPress={() => setShowFull((v) => !v)} accessibilityRole="button">
            <Text style={[styles.link, { color: colors.primary }]}>{showFull ? ui.hideFull : ui.readFull}</Text>
          </TouchableOpacity>
          {!!ui.current(current) && (
            <Text style={[styles.small, { color: colors.textTertiary }]}>{ui.current(current)}</Text>
          )}
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, { borderColor: colors.border }]}
              onPress={() => setAdConsent('denied')}
              accessibilityRole="button"
              accessibilityLabel={ui.reject}
            >
              <Text style={[styles.btnText, { color: colors.text }]}>{ui.reject}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { borderColor: colors.border }]}
              onPress={() => setAdConsent('granted')}
              accessibilityRole="button"
              accessibilityLabel={ui.accept}
            >
              <Text style={[styles.btnText, { color: colors.text }]}>{ui.accept}</Text>
            </TouchableOpacity>
          </View>
          {current !== null && (
            <TouchableOpacity onPress={closeAdConsentPreferences} accessibilityRole="button">
              <Text style={[styles.close, { color: colors.textSecondary }]}>{ui.close}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 20 },
  card: { borderRadius: 18, borderWidth: 1, padding: 20, maxHeight: '85%' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  scroll: { flexGrow: 0 },
  body: { fontSize: 14, lineHeight: 21, marginBottom: 8 },
  small: { fontSize: 12, lineHeight: 18, marginBottom: 6 },
  link: { fontSize: 13, fontWeight: '600', marginVertical: 8 },
  row: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btn: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  btnText: { fontSize: 15, fontWeight: '700' },
  close: { fontSize: 13, textAlign: 'center', marginTop: 12 },
});
