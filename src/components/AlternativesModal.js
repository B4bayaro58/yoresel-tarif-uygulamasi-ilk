import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';

export default function AlternativesModal() {
  const {
    colors,
    translate,
    showAlternatives,
    closeAlternatives,
    selectedIngredient,
  } = useApp();

  if (!selectedIngredient) return null;

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
            <TouchableOpacity onPress={closeAlternatives}>
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
                {selectedIngredient.alternatives.map((alt, index) => (
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
                ))}
              </View>
            )}
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.primary }]}
            onPress={closeAlternatives}
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
