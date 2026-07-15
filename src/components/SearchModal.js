import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { X, Search, SlidersHorizontal } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import RecipeCard from './RecipeCard';

const CATEGORY_FILTER_KEYS = [
  { key: 'all', value: null },
  { key: 'category-main-course', value: 'main-course' },
  { key: 'category-dessert', value: 'dessert' },
  { key: 'category-soup', value: 'soup' },
  { key: 'category-salad', value: 'salad' },
  { key: 'category-breakfast', value: 'breakfast' },
];

const DIFFICULTY_FILTER_KEYS = [
  { key: 'all', value: null },
  { key: 'difficulty-easy', value: 'easy' },
  { key: 'difficulty-medium', value: 'medium' },
  { key: 'difficulty-hard', value: 'hard' },
];

const TIME_FILTERS = [
  { label: '≤ 30 dk', value: 30 },
  { label: '≤ 60 dk', value: 60 },
  { label: '> 60 dk', value: 61 },
];

const FilterChips = React.memo(function FilterChips({ label, options, selected, onSelect, colors }) {
  return (
    <View style={styles.filterGroup}>
      <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipsRow}>
          {options.map(opt => (
            <TouchableOpacity
              key={String(opt.value)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected === opt.value ? colors.primary : colors.card,
                  borderColor: selected === opt.value ? colors.primary : colors.border,
                },
              ]}
              onPress={() => onSelect(opt.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: selected === opt.value ? '#fff' : colors.text },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
});

export default function SearchModal({ navigation }) {
  const { colors, translate, showSearch, setShowSearch, recipes } = useApp();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState(null);
  const [timeFilter, setTimeFilter] = useState(null);

  const hasActiveFilters = categoryFilter || difficultyFilter || timeFilter;

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      if (query.trim()) {
        const q = query.toLowerCase();
        const nameMatch = recipe.name.toLowerCase().includes(q);
        const ingredientMatch = recipe.ingredients?.some(ing =>
          ing.name.toLowerCase().includes(q)
        );
        const countryMatch = recipe.country?.toLowerCase().includes(q);
        if (!nameMatch && !ingredientMatch && !countryMatch) return false;
      }
      if (categoryFilter && recipe.category !== categoryFilter) return false;
      if (difficultyFilter && recipe.difficulty !== difficultyFilter) return false;
      if (timeFilter !== null) {
        const total = (recipe.prepTime || 0) + (recipe.cookTime || 0);
        if (timeFilter === 61 && total <= 60) return false;
        if (timeFilter !== 61 && total > timeFilter) return false;
      }
      return true;
    });
  }, [query, recipes, categoryFilter, difficultyFilter, timeFilter]);

  const handleClose = () => {
    setShowSearch(false);
    setQuery('');
    setCategoryFilter(null);
    setDifficultyFilter(null);
    setTimeFilter(null);
    setShowFilters(false);
  };

  const handleRecipePress = (recipe) => {
    handleClose();
    navigation.navigate('RecipeDetail', { recipe });
  };

  const showContent = query.trim().length > 0 || hasActiveFilters;

  return (
    <Modal visible={showSearch} animationType="slide" onRequestClose={handleClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={translate('searchRecipes')}
              placeholderTextColor={colors.textSecondary}
              value={query}
              onChangeText={setQuery}
              autoFocus
              autoCorrect={false}
              spellCheck={false}
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: hasActiveFilters ? colors.primary : colors.card },
            ]}
            onPress={() => setShowFilters(prev => !prev)}
          >
            <SlidersHorizontal
              size={20}
              color={hasActiveFilters ? '#fff' : colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClose}>
            <Text style={[styles.cancelText, { color: colors.primary }]}>
              {translate('cancel')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Panel */}
        {showFilters && (
          <View style={[styles.filterPanel, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <FilterChips
              label={translate('category')}
              options={CATEGORY_FILTER_KEYS.map(c => ({ label: translate(c.key), value: c.value }))}
              selected={categoryFilter}
              onSelect={setCategoryFilter}
              colors={colors}
            />
            <FilterChips
              label={translate('difficulty')}
              options={DIFFICULTY_FILTER_KEYS.map(d => ({ label: translate(d.key), value: d.value }))}
              selected={difficultyFilter}
              onSelect={setDifficultyFilter}
              colors={colors}
            />
            <FilterChips
              label={translate('timeFilter')}
              options={[{ label: translate('all'), value: null }, ...TIME_FILTERS]}
              selected={timeFilter}
              onSelect={setTimeFilter}
              colors={colors}
            />
          </View>
        )}

        {/* Results */}
        {showContent ? (
          filteredRecipes.length > 0 ? (
            <>
              <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                {translate('recipesFound', { count: filteredRecipes.length })}
              </Text>
              <FlatList
                data={filteredRecipes}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <RecipeCard recipe={item} onPress={handleRecipePress} />
                )}
              />
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Search size={64} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                {translate('noResults')}
              </Text>
            </View>
          )
        ) : (
          <View style={styles.emptyContainer}>
            <Search size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              {translate('searchRecipes')}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              {translate('searchByNameIngredientCountry')}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    gap: 10,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterPanel: {
    padding: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  filterGroup: {
    gap: 6,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  resultCount: {
    fontSize: 13,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
