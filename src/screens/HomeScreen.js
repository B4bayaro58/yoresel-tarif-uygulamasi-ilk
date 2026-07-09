import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, X, Check, Clock, Star } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { CONTINENTS } from '../constants/continents';
import { CATEGORIES } from '../constants/categories';
import RecipeCard from '../components/RecipeCard';
import SearchModal from '../components/SearchModal';
import { RecipeGridSkeleton } from '../components/SkeletonLoader';
import AdBanner from '../components/AdBanner';

const { width } = Dimensions.get('window');
const CAROUSEL_WIDTH = width - 32;
const CARD_GAP = 12;
const CONTINENT_CARD_WIDTH = (width - 48 - CARD_GAP) / 2;
const CONTINENT_CARD_HEIGHT = CONTINENT_CARD_WIDTH * 0.72;

const CONTINENT_CARD_COLORS = {
  europe: { bg: ['#EDF2FF', '#DBE4FF'], bgDark: ['#1A2744', '#243B6A'], accent: '#4A6CF7', accentLight: ['#DBE4FF', '#C5D0FF'] },
  asia: { bg: ['#FFF4E6', '#FFE8CC'], bgDark: ['#2D1A00', '#4A2E08'], accent: '#E8590C', accentLight: ['#FFE8CC', '#FFD4A8'] },
  africa: { bg: ['#EBFBEE', '#D3F9D8'], bgDark: ['#0A2E12', '#144A22'], accent: '#2B8A3E', accentLight: ['#D3F9D8', '#B5F5C4'] },
  'north-america': { bg: ['#E7F5FF', '#D0EBFF'], bgDark: ['#0A1F38', '#132F54'], accent: '#1864AB', accentLight: ['#D0EBFF', '#A5D8FF'] },
  'south-america': { bg: ['#F3F0FF', '#E5DBFF'], bgDark: ['#1A1040', '#2B1A6A'], accent: '#7048E8', accentLight: ['#E5DBFF', '#D0BFFF'] },
  'central-america': { bg: ['#E6FCF5', '#C3FAE8'], bgDark: ['#0A2E22', '#0E4A38'], accent: '#087F5B', accentLight: ['#C3FAE8', '#96F2D7'] },
  oceania: { bg: ['#FFF5F5', '#FFE3E3'], bgDark: ['#2E0A0A', '#4A1414'], accent: '#C92A2A', accentLight: ['#FFE3E3', '#FFC9C9'] },
  'turkish-cuisine': { bg: ['#FFF0F0', '#FFD6D6'], bgDark: ['#2E0A0A', '#4A1A1A'], accent: '#C0392B', accentLight: ['#FFD6D6', '#FFBDBD'] },
};

// === Gunun Menusu ============================================================
function DailyMenuSection({ colors, translate, dailyMenu, dailyMenuLoading, navigation }) {
  if (dailyMenuLoading) {
    return (
      <View style={styles.dailyMenuSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{translate('dailyMenu')}</Text>
        <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 8 }} />
      </View>
    );
  }

  return (
    <View style={styles.dailyMenuSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{translate('dailyMenu')}</Text>
      {dailyMenu.length === 0 ? (
        <View style={[styles.dailyMenuEmpty, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.dailyMenuEmptyText, { color: colors.textSecondary }]}>
            {translate('dailyMenuEmpty')}
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dailyMenuScroll}
        >
          {dailyMenu.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.dailyMenuCard}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={item.gradient || ['#4A6CF7', '#3A5CE5']}
                style={styles.dailyMenuGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.dailyMenuEmoji}>{item.emoji}</Text>
                <View style={styles.dailyMenuInfo}>
                  <Text style={styles.dailyMenuName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.dailyMenuCountry} numberOfLines={1}>{item.country}</Text>
                  <View style={styles.dailyMenuMeta}>
                    <View style={styles.dailyMenuMetaItem}>
                      <Star size={11} color="rgba(255,255,255,0.9)" fill="rgba(255,255,255,0.9)" />
                      <Text style={styles.dailyMenuMetaText}>{item.rating}</Text>
                    </View>
                    <View style={styles.dailyMenuMetaItem}>
                      <Clock size={11} color="rgba(255,255,255,0.9)" />
                      <Text style={styles.dailyMenuMetaText}>{item.prepTime} dk</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const MemoDailyMenuSection = React.memo(DailyMenuSection);

// Header ayri component -- stable referans icin HomeScreen disinda tanimlanir
function HomeHeader({
  colors, translate, featuredRecipes, navigation,
  selectedContinent, selectedCategory,
  onContinentPress, onCategoryPress,
  activeFilters, clearFilters,
  filteredCount, recipesLoading,
  dailyMenu, dailyMenuLoading,
}) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef(null);
  const isDark = colors.background === '#121212';

  useEffect(() => {
    if (!featuredRecipes.length) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev => {
        const next = (prev + 1) % featuredRecipes.length;
        carouselRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredRecipes.length]);

  return (
    <View>
      {/* Hero Carousel */}
      <View style={styles.carouselSection}>
        <Text style={[styles.sectionTitle, { color: colors.text, paddingHorizontal: 16 }]}>
          {translate('featuredRecipes')}
        </Text>
        <FlatList
          ref={carouselRef}
          data={featuredRecipes}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          snapToInterval={CAROUSEL_WIDTH + 16}
          decelerationRate="fast"
          onMomentumScrollEnd={event => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (CAROUSEL_WIDTH + 16)
            );
            setCarouselIndex(index);
          }}
          contentContainerStyle={styles.carouselContent}
          getItemLayout={(_, index) => ({
            length: CAROUSEL_WIDTH + 16,
            offset: (CAROUSEL_WIDTH + 16) * index,
            index,
          })}
          onScrollToIndexFailed={info => {
            setTimeout(() => {
              carouselRef.current?.scrollToIndex({ index: info.index, animated: false });
            }, 100);
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.carouselItem}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={item.gradient || ['#4A6CF7', '#3A5CE5']}
                style={styles.carouselGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.carouselEmoji}>{item.emoji}</Text>
                <View style={styles.carouselImage}>
                  <Image
                    source={item.photo ? { uri: item.photo } : require('../../assets/icon.png')}
                    style={styles.carouselImageStyle}
                    contentFit="cover"
                    cachePolicy="disk"
                    transition={150}
                  />
                  <View style={styles.carouselOverlay}>
                    <Text style={styles.carouselName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.carouselCountry}>{item.country}</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
        <View style={styles.dotsContainer}>
          {featuredRecipes.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === carouselIndex ? colors.primary : colors.textTertiary,
                  width: index === carouselIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Continents Filter */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {translate('continentFilter')}
        </Text>
        <View style={styles.continentsGrid}>
          {CONTINENTS.map(continent => {
            const isSelected = selectedContinent === continent.id;
            const cardColors = CONTINENT_CARD_COLORS[continent.id];
            const gradientBg = isDark ? cardColors.bgDark : cardColors.bg;
            return (
              <TouchableOpacity
                key={continent.id}
                style={[
                  styles.continentCard,
                  { width: CONTINENT_CARD_WIDTH, height: CONTINENT_CARD_HEIGHT },
                  isSelected && styles.continentCardSelected,
                ]}
                onPress={() => onContinentPress(continent.id)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={translate('continent-' + continent.id)}
                accessibilityState={{ selected: isSelected }}
              >
                <LinearGradient
                  colors={isSelected ? cardColors.accentLight : gradientBg}
                  style={styles.continentCardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isSelected && (
                    <View style={[styles.selectionBadge, { backgroundColor: cardColors.accent }]}>
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                  <View style={styles.chefEmojiContainer}>
                    <Text style={styles.chefEmoji}>{continent.chef}</Text>
                    <Text style={styles.foodEmoji}>{continent.food}</Text>
                  </View>
                  <View style={styles.continentLabelContainer}>
                    <Text
                      style={[
                        styles.continentName,
                        { color: isSelected ? cardColors.accent : colors.text },
                        isSelected && styles.continentNameSelected,
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      {translate('continent-' + continent.id)}
                    </Text>
                  </View>
                </LinearGradient>
                {isSelected && (
                  <View
                    style={[styles.continentSelectedBorder, { borderColor: cardColors.accent }]}
                    pointerEvents="none"
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Daily Menu */}
      <MemoDailyMenuSection
        colors={colors}
        translate={translate}
        dailyMenu={dailyMenu}
        dailyMenuLoading={dailyMenuLoading}
        navigation={navigation}
      />

      {/* ── AD: Banner — Günün Menüsü ile Kategori arası ── */}
      <View style={styles.adRow}>
        <AdBanner size="banner" />
      </View>

      {/* Categories Filter */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {translate('categoryFilter')}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                { backgroundColor: colors.card, borderColor: colors.border },
                selectedCategory === category.id && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => onCategoryPress(category.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={translate('category-' + category.id)}
              accessibilityState={{ selected: selectedCategory === category.id }}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  { color: colors.text },
                  selectedCategory === category.id && { color: '#FFFFFF' },
                ]}
              >
                {translate('category-' + category.id)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Clear Filters */}
      {activeFilters && (
        <View style={styles.clearFiltersContainer}>
          <TouchableOpacity
            style={[styles.clearFiltersButton, { backgroundColor: colors.error }]}
            onPress={clearFilters}
            activeOpacity={0.8}
          >
            <X size={18} color="#FFFFFF" />
            <Text style={styles.clearFiltersText}>{translate('clearFilters')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Recipe section header */}
      <View style={styles.recipeHeaderRow}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
          {translate('allRecipes')}
        </Text>
        <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.countText}>{filteredCount}</Text>
        </View>
      </View>

      {recipesLoading && (
        <View style={styles.skeletonWrapper}>
          <RecipeGridSkeleton count={6} />
        </View>
      )}
    </View>
  );
}

const MemoHomeHeader = React.memo(HomeHeader);

// Module seviyesinde sabit referans -- FlatList her render'da header'ı unmount/remount ETMEZ
const HomeHeaderWrapper = React.memo(function HomeHeaderWrapper(props) {
  const { onLayout, ...rest } = props;
  return (
    <View onLayout={onLayout}>
      <MemoHomeHeader {...rest} />
    </View>
  );
});

// === Ana ekran ================================================================
export default function HomeScreen({ navigation }) {
  const {
    colors,
    translate,
    recipes,
    selectedContinent,
    setSelectedContinent,
    selectedCategory,
    setSelectedCategory,
    getFilteredRecipes,
    clearFilters,
    hasActiveFilters,
    setShowSearch,
    recipesLoading,
    dailyMenu,
    dailyMenuLoading,
  } = useApp();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerSearchButton}
          onPress={() => setShowSearch(true)}
          accessibilityRole="button"
          accessibilityLabel={translate('search')}
        >
          <Search size={24} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  const featuredRecipes = useMemo(() => recipes.slice(0, 4), [recipes]);

  // getFilteredRecipes useCallback ile stable -- sadece filtreler degisince hesaplar
  const filteredRecipes = useMemo(() => getFilteredRecipes(), [getFilteredRecipes]);

  const activeFilters = !!hasActiveFilters();

  const flatListRef = useRef(null);
  const headerHeight = useRef(0);

  const handleContinentPress = useCallback(
    id => setSelectedContinent(id === selectedContinent ? null : id),
    [setSelectedContinent, selectedContinent]
  );

  const handleCategoryPress = useCallback(
    id => setSelectedCategory(id === selectedCategory ? null : id),
    [setSelectedCategory, selectedCategory]
  );

  const headerOnLayout = useCallback(e => {
    headerHeight.current = e.nativeEvent.layout.height;
  }, []);

  useEffect(() => {
    if (selectedContinent || selectedCategory) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: headerHeight.current, animated: true });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedContinent, selectedCategory]);

  const renderItem = useCallback(
    ({ item }) => (
      <RecipeCard
        recipe={item}
        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      />
    ),
    [navigation]
  );

  const keyExtractor = useCallback(item => String(item.id), []);

  const renderEmpty = useCallback(
    () =>
      !recipesLoading ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {translate('noResults')}
          </Text>
        </View>
      ) : null,
    [recipesLoading, colors, translate]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={recipesLoading ? [] : filteredRecipes}
        numColumns={2}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={
          <HomeHeaderWrapper
            onLayout={headerOnLayout}
            colors={colors}
            translate={translate}
            featuredRecipes={featuredRecipes}
            navigation={navigation}
            selectedContinent={selectedContinent}
            selectedCategory={selectedCategory}
            onContinentPress={handleContinentPress}
            onCategoryPress={handleCategoryPress}
            activeFilters={activeFilters}
            clearFilters={clearFilters}
            filteredCount={filteredRecipes.length}
            recipesLoading={recipesLoading}
            dailyMenu={dailyMenu}
            dailyMenuLoading={dailyMenuLoading}
          />
        }
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={<View style={{ height: 20 }} />}
        columnWrapperStyle={styles.recipesRow}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        maxToRenderPerBatch={6}
        initialNumToRender={8}
        removeClippedSubviews
      />
      <SearchModal navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSearchButton: { marginRight: 16, padding: 8 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  recipeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  countBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  countText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  carouselSection: { paddingTop: 16, marginBottom: 8 },
  carouselContent: { paddingHorizontal: 16 },
  carouselItem: {
    width: CAROUSEL_WIDTH,
    height: 220,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  carouselGradient: { flex: 1, position: 'relative' },
  carouselEmoji: {
    position: 'absolute',
    fontSize: 100,
    opacity: 0.2,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 1,
  },
  carouselImage: { flex: 1, position: 'relative' },
  carouselImageStyle: { ...StyleSheet.absoluteFillObject, opacity: 0.85 },
  carouselOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  carouselName: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  carouselCountry: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', opacity: 0.9 },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  dot: { height: 8, borderRadius: 4 },
  continentsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP },
  continentCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  continentCardSelected: {
    elevation: 8,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  continentCardGradient: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  selectionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  chefEmojiContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  chefEmoji: { fontSize: 36 },
  foodEmoji: { fontSize: 20, position: 'absolute', bottom: 0, right: -6 },
  continentLabelContainer: { alignItems: 'center', paddingTop: 4, paddingHorizontal: 4 },
  continentName: { fontSize: 11, fontWeight: '600', textAlign: 'center', letterSpacing: 0.2 },
  continentNameSelected: { fontWeight: '800', letterSpacing: 0.4 },
  continentSelectedBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 20, borderWidth: 2.5 },
  categoriesContainer: { paddingRight: 16 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 2,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: { fontSize: 18 },
  categoryText: { fontSize: 14, fontWeight: '600' },
  clearFiltersContainer: { paddingHorizontal: 16, marginBottom: 16 },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  clearFiltersText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  recipesRow: { paddingHorizontal: 16, justifyContent: 'space-between' },
  skeletonWrapper: { paddingHorizontal: 16 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, textAlign: 'center' },
  adRow: { alignItems: 'center', marginBottom: 24 },

  // Daily Menu
  dailyMenuSection: { paddingHorizontal: 16, marginBottom: 24 },
  dailyMenuScroll: { paddingRight: 4 },
  dailyMenuEmpty: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  dailyMenuEmptyText: { fontSize: 14 },
  dailyMenuCard: {
    width: 160,
    height: 200,
    borderRadius: 18,
    marginRight: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  dailyMenuGradient: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  dailyMenuEmoji: { fontSize: 44 },
  dailyMenuInfo: { gap: 3 },
  dailyMenuName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  dailyMenuCountry: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  dailyMenuMeta: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  dailyMenuMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dailyMenuMetaText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
});
