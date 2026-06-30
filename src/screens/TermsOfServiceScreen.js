import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../contexts/AppContext';

const SECTIONS = [
  { titleKey: 'tosSection1Title', bodyKey: 'tosSection1Body' },
  { titleKey: 'tosSection2Title', bodyKey: 'tosSection2Body' },
  { titleKey: 'tosSection3Title', bodyKey: 'tosSection3Body' },
  { titleKey: 'tosSection4Title', bodyKey: 'tosSection4Body' },
  { titleKey: 'tosSection5Title', bodyKey: 'tosSection5Body' },
  { titleKey: 'tosSection6Title', bodyKey: 'tosSection6Body' },
  { titleKey: 'tosSection7Title', bodyKey: 'tosSection7Body' },
];

export default function TermsOfServiceScreen() {
  const { colors, translate } = useApp();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
        {translate('tosLastUpdated')}
      </Text>

      <Text style={[styles.intro, { color: colors.text }]}>
        {translate('tosIntro')}
      </Text>

      {SECTIONS.map(section => (
        <View key={section.titleKey} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {translate(section.titleKey)}
          </Text>
          <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
            {translate(section.bodyKey)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },
  lastUpdated: { fontSize: 12, marginBottom: 16 },
  intro: { fontSize: 14, lineHeight: 22, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  sectionBody: { fontSize: 14, lineHeight: 22 },
});
