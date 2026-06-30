import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Search, Edit3, Trash2, Eye, Lock } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';

export default function ManageRecipesScreen({ navigation }) {
  const { colors, translate, recipes, deleteRecipe, showNotification } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = useMemo(
    () => recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [recipes, searchQuery]
  );

  const handleEdit = useCallback((recipe) => {
    navigation.navigate('AddRecipe', { recipe });
  }, [navigation]);

  const handleDelete = useCallback((recipe) => {
    if (!recipe.isFirebase) {
      Alert.alert(translate('info'), translate('staticRecipeInfo'));
      return;
    }
    Alert.alert(
      translate('deleteRecipe'),
      translate('deleteRecipeConfirm', { name: recipe.name }),
      [
        { text: translate('cancel'), style: 'cancel' },
        {
          text: translate('delete'),
          style: 'destructive',
          onPress: async () => {
            const result = await deleteRecipe(recipe.id);
            if (result.success) {
              showNotification(translate('recipeDeleted'));
            } else {
              Alert.alert(translate('error'), result.error);
            }
          },
        },
      ]
    );
  }, [translate, deleteRecipe, showNotification]);

  const handleView = useCallback((recipe) => {
    navigation.navigate('RecipeDetail', { recipe });
  }, [navigation]);

  const renderItem = useCallback(({ item: recipe }) => (
    <View
      style={[
        styles.recipeCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.recipeInfo}>
        <View style={styles.nameRow}>
          <Text style={[styles.recipeName, { color: colors.text }]} numberOfLines={1}>
            {recipe.name}
          </Text>
          {!recipe.isFirebase && (
            <View style={[styles.staticBadge, { backgroundColor: colors.border }]}>
              <Lock size={10} color={colors.textTertiary} />
              <Text style={[styles.staticBadgeText, { color: colors.textTertiary }]}>{translate('static')}</Text>
            </View>
          )}
          {recipe.overridesStaticId != null && (
            <View style={[styles.staticBadge, { backgroundColor: '#10B98120' }]}>
              <Text style={[styles.staticBadgeText, { color: '#10B981' }]}>✓ özel</Text>
            </View>
          )}
        </View>
        <Text style={[styles.recipeCategory, { color: colors.textSecondary }]}>
          {recipe.category} • {recipe.country}
        </Text>
        <View style={styles.recipeStats}>
          <Text style={[styles.recipeStat, { color: colors.textTertiary }]}>
            ⭐ {recipe.rating}
          </Text>
          <Text style={[styles.recipeStat, { color: colors.textTertiary }]}>
            🕐 {(recipe.prepTime || 0) + (recipe.cookTime || 0)} dk
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
          onPress={() => handleView(recipe)}
          activeOpacity={0.7}
        >
          <Eye size={18} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#3B82F620' }]}
          onPress={() => handleEdit(recipe)}
          activeOpacity={0.7}
        >
          <Edit3 size={18} color="#3B82F6" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: recipe.isFirebase ? '#EF444420' : colors.border },
          ]}
          onPress={() => handleDelete(recipe)}
          activeOpacity={0.7}
        >
          <Trash2 size={18} color={recipe.isFirebase ? '#EF4444' : colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </View>
  ), [colors, translate, handleView, handleEdit, handleDelete]);

  const keyExtractor = useCallback((item) => String(item.id), []);

  const ListEmpty = useCallback(() => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {translate('recipeNotFound')}
      </Text>
    </View>
  ), [colors, translate]);

  const ListFooter = useCallback(() => <View style={{ height: 20 }} />, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{translate('manageRecipes')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {translate('recipesFound', { count: filteredRecipes.length })}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={translate('searchRecipe')}
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>
      </View>

      <FlatList
        data={filteredRecipes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={ListFooter}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  recipeCard: {
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
  recipeInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '700',
  },
  staticBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  staticBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  recipeCategory: {
    fontSize: 14,
    marginBottom: 8,
  },
  recipeStats: {
    flexDirection: 'row',
    gap: 12,
  },
  recipeStat: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
