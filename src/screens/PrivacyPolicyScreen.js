import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../contexts/AppContext';

const SECTIONS = [
  {
    titleKey: 'ppCollectedData',
    bodyKey: 'ppCollectedDataBody',
  },
  {
    titleKey: 'ppHowWeUse',
    bodyKey: 'ppHowWeUseBody',
  },
  {
    titleKey: 'ppDataSharing',
    bodyKey: 'ppDataSharingBody',
  },
  {
    titleKey: 'ppDataRetention',
    bodyKey: 'ppDataRetentionBody',
  },
  {
    titleKey: 'ppYourRights',
    bodyKey: 'ppYourRightsBody',
  },
  {
    titleKey: 'ppSecurity',
    bodyKey: 'ppSecurityBody',
  },
  {
    titleKey: 'ppContact',
    bodyKey: 'ppContactBody',
  },
  {
    titleKey: 'ppAgeRestriction',
    bodyKey: 'ppAgeRestrictionBody',
  },
];

export default function PrivacyPolicyScreen() {
  const { colors, translate } = useApp();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
        {translate('ppLastUpdated')}
      </Text>

      <Text style={[styles.intro, { color: colors.text }]}>
        {translate('ppIntro')}
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
