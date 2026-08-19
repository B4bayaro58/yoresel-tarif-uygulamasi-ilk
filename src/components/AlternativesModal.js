import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, PlayCircle } from 'lucide-react-native';
import { useRewardedAd } from 'react-native-google-mobile-ads';
import { useApp } from '../contexts/AppContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { REWARDED_AD_UNIT_ID } from '../constants/adUnits';

export default function AlternativesModal() {
  const {
    colors,
    translate,
    showAlternatives,
    closeAlternatives,
    selectedIngredient,
  } = useApp();
  const { isPremium } = useSubscription();

  // Bir kez reklam izleyince, oturum boyunca (uygulama kapanana kadar) tüm
  // malzeme alternatifleri açık kalır -- her seferinde yeniden reklam istemek
  // yerine tek seferlik bir "kilit açma" deneyimi.
  const [unlockedByAd, setUnlockedByAd] = useState(false);
  const { isLoaded, isEarnedReward, isClosed, load, show } = useRewardedAd(REWARDED_AD_UNIT_ID);
  const wasClosed = useRef(false);

  useEffect(() => {
    if (!isPremium) load();
  }, [load, isPremium]);

  useEffect(() => {
    if (isEarnedReward) {
      setUnlockedByAd(true);
    }
  }, [isEarnedReward]);

  useEffect(() => {
    if (isClosed && !wasClosed.current) {
      wasClosed.current = true;
      load(); // bir sonraki gösterim için hemen yeniden yükle
    } else if (!isClosed) {
      wasClosed.current = false;
    }
  }, [isClosed, load]);

  if (!selectedIngredient) return null;

  const canViewAlternatives = isPremium || unlockedByAd;

  return (
    <Modal
      visible={showAlternatives}
      transparent
      animationType="slide"
      onRequestClose={closeAlternatives}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {translate('alternativesFor')} {selectedIngredient.name}
            </Text>
            <TouchableOpacity
              onPress={closeAlternatives}
              accessibilityRole="button"
              accessibilityLabel={translate('close')}
            >
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Original Ingredient */}
            <View style={[styles.section, { borderBottomColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                {translate('originalIngredient')}
              </Text>
              <View style={[styles.ingredientCard, { backgroundColor: colors.background }]}>
                <Text style={[styles.ingredientName, { color: colors.text }]}>
                  {selectedIngredient.name}
                </Text>
                <Text style={[styles.ingredientAmount, { color: colors.textSecondary }]}>
                  {selectedIngredient.amount}
                </Text>
              </View>
            </View>

            {/* Alternatives */}
            {selectedIngredient.alternatives && selectedIngredient.alternatives.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                  {translate('alternatives')}
                </Text>
                {canViewAlternatives ? (
                  selectedIngredient.alternatives.map((alt, index) => (
                    <View
                      key={index}
                      style={[
                        styles.alternativeCard,
                        { backgroundColor: colors.background, borderColor: colors.border },
                      ]}
                    >
                      <View style={[styles.alternativeNumber, { backgroundColor: colors.primary }]}>
                        <Text style={styles.alternativeNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={[styles.alternativeName, { color: colors.text }]}>
                        {alt}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={[styles.lockedBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={[styles.lockedMessage, { color: colors.textSecondary }]}>
                      {translate('alternativesLockedMessage')}
                    </Text>
                    <TouchableOpacity
                      style={[styles.watchAdButton, { backgroundColor: colors.primary, opacity: isLoaded ? 1 : 0.6 }]}
                      onPress={() => (isLoaded ? show() : null)}
                      disabled={!isLoaded}
                      accessibilityRole="button"
                      accessibilityLabel={translate('watchAdToUnlock')}
                    >
                      {isLoaded ? (
                        <PlayCircle size={18} color="#FFFFFF" />
                      ) : (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      )}
                      <Text style={styles.watchAdButtonText}>{translate('watchAdToUnlock')}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.primary }]}
            onPress={closeAlternatives}
            accessibilityRole="button"
            accessibilityLabel={translate('close')}
          >
            <Text style={styles.closeButtonText}>{translate('close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  ingredientCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  ingredientName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  ingredientAmount: {
    fontSize: 14,
  },
  alternativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  alternativeNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alternativeNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  alternativeName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  lockedBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  lockedMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  watchAdButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  watchAdButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  closeButton: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
