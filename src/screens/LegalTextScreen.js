import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../contexts/AppContext';
import { KVKK_AYDINLATMA, AD_CONSENT_TEXT, PARENT_INFO, LEGAL_UPDATED_AT } from '../constants/legalTexts';

// KVKK Aydınlatma Metni ve Reklam Açık Rıza Metni -- web sitesindeki
// /kvkk ve /acik-riza-metni ile aynı kaynaktan (constants/legalTexts.js).
// Hukuki metnin aslı Türkçe, tüm dillerde Türkçe gösterilir.
const DOCS = { kvkk: KVKK_AYDINLATMA, adConsent: AD_CONSENT_TEXT, parents: PARENT_INFO };

export default function LegalTextScreen({ route }) {
  const { colors } = useApp();
  const blocks = DOCS[route?.params?.doc] || KVKK_AYDINLATMA;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.updated, { color: colors.textSecondary }]}>Son güncelleme: {LEGAL_UPDATED_AT}</Text>
      {blocks.map((b, i) => {
        if (b.h) return <Text key={i} style={[styles.h, { color: colors.text }]}>{b.h}</Text>;
        if (b.ul) {
          return (
            <View key={i} style={styles.list}>
              {b.ul.map((item, j) => (
                <Text key={j} style={[styles.p, { color: colors.textSecondary }]}>• {item}</Text>
              ))}
            </View>
          );
        }
        return <Text key={i} style={[styles.p, styles.para, { color: colors.textSecondary }]}>{b.p}</Text>;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },
  updated: { fontSize: 12, marginBottom: 16 },
  h: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  p: { fontSize: 14, lineHeight: 22, marginBottom: 4 },
  para: { marginBottom: 12 },
  list: { marginBottom: 12 },
});
