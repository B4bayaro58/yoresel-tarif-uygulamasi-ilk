import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { AGE_GATE_TEXT, AGE_GATE_TEXT_EN } from '../constants/legalTexts';
import { subscribeAdConsentPrompt } from '../services/adConsentService';

// Giriş yapmış ve henüz 15 yaş beyanı vermemiş her hesaba (yeni ve mevcut,
// e-posta/Google/Apple) bir kez sorulur -- 5651 ek 4 + Yaş Doğrulama
// Yönetmeliği (mevcut hesaplar 31/3/2027'ye kadar). Misafir modu hesap
// olmadığı için kapsam dışı.
export default function AgeGateModal() {
  const { colors, language } = useApp();
  const { user, ageConfirmed, confirmAge, declineAge } = useAuth();
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);
  // iOS aynı anda iki Modal sunamıyor -- reklam rıza penceresi açıkken bekle.
  const [adPromptOpen, setAdPromptOpen] = useState(false);
  useEffect(() => subscribeAdConsentPrompt(({ open }) => setAdPromptOpen(open)), []);
  const txt = language === 'tr' ? AGE_GATE_TEXT : AGE_GATE_TEXT_EN;

  const visible = !adPromptOpen && (denied || (!!user && !user.isAnonymous && ageConfirmed === false));

  const run = async (fn, after) => {
    setBusy(true);
    try {
      await fn();
      after?.();
    } catch {
      // Ağ hatası: pencere açık kalır, tekrar denenebilir.
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {denied ? (
            <>
              <Text style={[styles.body, { color: colors.text }]}>{txt.deniedMessage}</Text>
              <TouchableOpacity
                style={[styles.primary, { backgroundColor: colors.primary }]}
                onPress={() => setDenied(false)}
                accessibilityRole="button"
              >
                <Text style={styles.primaryText}>OK</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: colors.text }]}>{txt.title}</Text>
              <Text style={[styles.body, { color: colors.textSecondary }]}>{txt.body}</Text>
              <Text style={[styles.note, { color: colors.textTertiary }]}>{txt.teenNote}</Text>
              {busy ? (
                <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.primary, { backgroundColor: colors.primary }]}
                    onPress={() => run(() => confirmAge('18+'))}
                    accessibilityRole="button"
                    accessibilityLabel={txt.adult}
                  >
                    <Text style={styles.primaryText}>{txt.adult}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.secondary, { borderColor: colors.border, marginBottom: 10 }]}
                    onPress={() => run(() => confirmAge('15-17'))}
                    accessibilityRole="button"
                    accessibilityLabel={txt.teen}
                  >
                    <Text style={[styles.secondaryText, { color: colors.text }]}>{txt.teen}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.secondary, { borderColor: colors.border }]}
                    onPress={() => run(declineAge, () => setDenied(true))}
                    accessibilityRole="button"
                    accessibilityLabel={txt.deny}
                  >
                    <Text style={[styles.secondaryText, { color: colors.text }]}>{txt.deny}</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 20 },
  card: { borderRadius: 18, borderWidth: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  body: { fontSize: 14, lineHeight: 21, marginBottom: 10 },
  note: { fontSize: 12, lineHeight: 18, marginBottom: 16 },
  primary: { borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginBottom: 10 },
  primaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondary: { borderRadius: 12, borderWidth: 1, paddingVertical: 13, alignItems: 'center' },
  secondaryText: { fontSize: 15, fontWeight: '600' },
});
