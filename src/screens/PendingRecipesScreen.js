import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CheckCircle2, XCircle, Eye } from 'lucide-react-native';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useApp } from '../contexts/AppContext';

export default function PendingRecipesScreen({ navigation }) {
  const { colors, translate, approveRecipe, showNotification } = useApp();
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingRecipes();
  }, []);

  const loadPendingRecipes = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'recipes'), where('status', '==', 'pending'));
      const snapshot = await getDocs(q);
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPendingRecipes(loaded);
    } catch (error) {
      Alert.alert(translate('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (recipe) => {
    Alert.alert(
      translate('approveRecipe'),
      translate('approveRecipeConfirm', { name: recipe.name }),
      [
        { text: translate('cancel'), style: 'cancel' },
        {
          text: translate('approve'),
          onPress: async () => {
            const result = await approveRecipe(recipe.id);
            if (result.success) {
              setPendingRecipes(prev => prev.filter(r => r.id !== recipe.id));
              showNotification(translate('recipeApproved'));
            } else {
              Alert.alert(translate('error'), result.error);
            }
          },
        },
      ]
    );
  };

  const handleReject = (recipe) => {
    Alert.alert(
      translate('rejectRecipe'),
      translate('rejectRecipeConfirm', { name: recipe.name }),
      [
        { text: translate('cancel'), style: 'cancel' },
        {
          text: translate('reject'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'recipes', recipe.id));
              setPendingRecipes(prev => prev.filter(r => r.id !== recipe.id));
              showNotification(translate('recipeRejected'));
            } catch (error) {
              Alert.alert(translate('error'), error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{translate('pendingRecipesTitle')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {translate('recipesAwaitingReview', { count: pendingRecipes.length })}
        </Text>
      </View>

      <ScrollView style={styles.list}>
        {pendingRecipes.length === 0 ? (
          <View style={styles.emptyState}>
            <CheckCircle2 size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {translate('noPendingRecipes')}
            </Text>
          </View>
        ) : (
          pendingRecipes.map(recipe => (
            <View
              key={recipe.id}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.cardInfo}>
                <Text style={[styles.recipeName, { color: colors.text }]}>
                  {recipe.emoji || '🍽️'} {recipe.name}
                </Text>
                <Text style={[styles.recipeMeta, { color: colors.textSecondary }]}>
                  {recipe.country} • {recipe.category}
                </Text>
                <Text style={[styles.submitter, { color: colors.textTertiary }]}>
                  {translate('submittedBy')}: {recipe.submittedBy || translate('unknown')}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: colors.primary + '20' }]}
                  onPress={() => navigation.navigate('RecipeDetail', { recipe: { ...recipe, isFirebase: true } })}
                  activeOpacity={0.7}
                >
                  <Eye size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#22C55E20' }]}
                  onPress={() => handleApprove(recipe)}
                  activeOpacity={0.7}
                >
                  <CheckCircle2 size={18} color="#22C55E" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#EF444420' }]}
                  onPress={() => handleReject(recipe)}
                  activeOpacity={0.7}
                >
                  <XCircle size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingTop: 24 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 16 },
  list: { flex: 1, paddingHorizontal: 20 },
  emptyState: { padding: 60, alignItems: 'center', gap: 16 },
  emptyText: { fontSize: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardInfo: { flex: 1 },
  recipeName: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  recipeMeta: { fontSize: 13, marginBottom: 2 },
  submitter: { fontSize: 12 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
