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
import { QUICK_FILTERS } from '../constants/recipeTags';
import RecipeCard from '../components/RecipeCard';
import SearchModal from '../components/SearchModal';
import { RecipeGridSkeleton } from '../components/SkeletonLoader';
import { getCollections } from '../services/collectionsService';
import { getLatestBlogPosts, formatBlogDate } from '../services/blogService';
import { getGridPhotoUrl } from '../utils/imageResize';

const { width } = Dimensions.get('window');
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
          {dailyMenu.map(item => {
            const photo = getGridPhotoUrl(item.photoThumb || item.photo);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.dailyMenuCard}
                onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`${item.name}, ${item.country}`}
                accessibilityHint={translate('tapToViewRecipe')}
              >
                <View style={styles.dailyMenuGradient}>
                  {photo ? (
                    <Image
                      source={{ uri: photo }}
                      style={StyleSheet.absoluteFillObject}
                      contentFit="cover"
                      cachePolicy="disk"
                      transition={150}
                    />
                  ) : (
                    <LinearGradient
                      colors={item.gradient || ['#4A6CF7', '#3A5CE5']}
                      style={StyleSheet.absoluteFillObject}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  )}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.75)']}
                    style={styles.dailyMenuOverlay}
                  >
                    {!photo && <Text style={styles.dailyMenuEmoji}>{item.emoji}</Text>}
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
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const MemoDailyMenuSection = React.memo(DailyMenuSection);

// === Populer Tarifler ========================================================
function PopularRecipesSection({ colors, translate, popularRecipes, popularRecipesLoading, navigation }) {
  if (popularRecipesLoading || !popularRecipes.length) return null;

  return (
    <View style={styles.dailyMenuSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{translate('popularRecipesTitle')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dailyMenuScroll}>
        {popularRecipes.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.popularCard}
            onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${item.country}`}
            accessibilityHint={translate('tapToViewRecipe')}
          >
            {item.photo ? (
              <Image
                source={{ uri: item.photo }}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
                cachePolicy="disk"
                transition={150}
              />
            ) : (
              <LinearGradient
                colors={item.gradient || ['#4A6CF7', '#3A5CE5']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}
            <View style={styles.popularRatingBadge}>
              <Star size={10} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.popularRatingText}>{item.rating}</Text>
            </View>
            <View style={styles.popularCardOverlay}>
              <Text style={styles.popularCardName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.popularCardCountry} numberOfLines={1}>{item.country}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const MemoPopularRecipesSection = React.memo(PopularRecipesSection);

// === Koleksiyonlar (Haftanın Özel Derlemesi + Yöresel Keşif) ================
function CollectionsSection({ colors, translate, collections, navigation }) {
  if (!collections.length) return null;

  const featured = collections.find(c => !c.region) || collections[0];
  const regional = collections.filter(c => c.region && c.id !== featured?.id);

  return (
    <View style={styles.collectionsSection}>
      {featured && (
        <TouchableOpacity
          style={styles.featuredCollectionCard}
          onPress={() => navigation.navigate('CollectionDetail', { collectionId: featured.id })}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel={`${translate('weeklyCollectionTitle')}: ${featured.title}`}
        >
          {featured.coverPhoto ? (
            <Image source={{ uri: featured.coverPhoto }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
          ) : (
            <LinearGradient
              colors={['#B97A1A', '#D99520']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          <LinearGradient
            colors={['rgba(185,122,26,0.92)', 'rgba(217,149,32,0.75)']}
            style={styles.featuredCollectionOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.featuredCollectionEyebrow}>{translate('weeklyCollectionTitle')}</Text>
            <Text style={styles.featuredCollectionTitle} numberOfLines={2}>{featured.title}</Text>
            {!!featured.subtitle && (
              <Text style={styles.featuredCollectionSubtitle} numberOfLines={2}>{featured.subtitle}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}

      {regional.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {translate('regionalDiscoveryTitle')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dailyMenuScroll}>
            {regional.map(c => (
              <TouchableOpacity
                key={c.id}
                style={styles.regionalCard}
                onPress={() => navigation.navigate('CollectionDetail', { collectionId: c.id })}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`${c.title}, ${c.region}`}
              >
                {c.coverPhoto ? (
                  <Image source={{ uri: c.coverPhoto }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
                ) : (
                  <LinearGradient
                    colors={['#8B4513', '#A0522D']}
                    style={StyleSheet.absoluteFillObject}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                )}
                <View style={styles.regionalCardOverlay}>
                  <Text style={styles.regionalCardTitle} numberOfLines={2}>{c.title}</Text>
                  <Text style={styles.regionalCardRegion}>{c.region}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const MemoCollectionsSection = React.memo(CollectionsSection);

// === Blog ====================================================================
function BlogSection({ colors, translate, latestPosts, navigation }) {
  if (!latestPosts.length) return null;

  return (
    <View style={styles.dailyMenuSection}>
      <View style={styles.blogHeaderRow}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>{translate('blogSectionTitle')}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('BlogList')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={translate('blogSeeAll')}
        >
          <Text style={[styles.blogSeeAll, { color: colors.primary }]}>{translate('blogSeeAll')}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dailyMenuScroll}>
        {latestPosts.map(post => (
          <TouchableOpacity
            key={post.id}
            style={styles.blogCard}
            onPress={() => navigation.navigate('BlogDetail', { slug: post.slug })}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={post.title}
          >
            {post.coverPhoto ? (
              <Image
                source={{ uri: post.coverPhoto }}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
                cachePolicy="disk"
                transition={150}
              />
            ) : (
              <LinearGradient
                colors={['#B97A1A', '#D99520']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}
            <View style={styles.blogCardOverlay}>
              <Text style={styles.blogCardDate} numberOfLines={1}>{formatBlogDate(post.publishedAt)}</Text>
              <Text style={styles.blogCardTitle} numberOfLines={2}>{post.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const MemoBlogSection = React.memo(BlogSection);

// Header ayri component -- stable referans icin HomeScreen disinda tanimlanir
function HomeHeader({
  colors, translate, navigation,
  selectedContinent, selectedCategory,
  onContinentPress, onCategoryPress,
  selectedQuickFilter, onQuickFilterPress,
  activeFilters, clearFilters,
  filteredCount, recipesLoading,
  dailyMenu, dailyMenuLoading,
  popularRecipes, popularRecipesLoading,
  collections,
  latestPosts,
}) {
  const isDark = colors.background === '#121212';

  return (
    <View>
      {/* Popüler Tarifler */}
      <MemoPopularRecipesSection
        colors={colors}
        translate={translate}
        popularRecipes={popularRecipes}
        popularRecipesLoading={popularRecipesLoading}
        navigation={navigation}
      />

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

      {/* Quick Filters */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {translate('quickFiltersTitle')}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {QUICK_FILTERS.map(qf => {
            const isSelected = selectedQuickFilter === qf.key;
            return (
              <TouchableOpacity
                key={qf.key}
                style={[
                  styles.quickFilterChip,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => onQuickFilterPress(qf.key)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={translate(qf.labelKey)}
                accessibilityState={{ selected: isSelected }}
              >
                <View style={[styles.quickFilterBadge, { backgroundColor: isSelected ? '#FFFFFF' : qf.gradient[0] + '26' }]}>
                  <Text style={styles.quickFilterBadgeEmoji}>{qf.emoji}</Text>
                </View>
                <Text style={[styles.categoryText, { color: colors.text }, isSelected && { color: '#FFFFFF' }]}>
                  {translate(qf.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Daily Menu */}
      <MemoDailyMenuSection
        colors={colors}
        translate={translate}
        dailyMenu={dailyMenu}
        dailyMenuLoading={dailyMenuLoading}
        navigation={navigation}
      />

      {/* Koleksiyonlar (Haftanın Özel Derlemesi + Yöresel Keşif) */}
      <MemoCollectionsSection
        colors={colors}
        translate={translate}
        collections={collections}
        navigation={navigation}
      />

      {/* Blog */}
      <MemoBlogSection
        colors={colors}
        translate={translate}
        latestPosts={latestPosts}
        navigation={navigation}
      />

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
            accessibilityRole="button"
            accessibilityLabel={translate('clearFilters')}
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
    selectedQuickFilter,
    setSelectedQuickFilter,
    getFilteredRecipes,
    clearFilters,
    hasActiveFilters,
    setShowSearch,
    recipesLoading,
    dailyMenu,
    dailyMenuLoading,
    popularRecipes,
    popularRecipesLoading,
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

  const [collections, setCollections] = useState([]);
  useEffect(() => {
    getCollections().then(setCollections);
  }, []);

  const [latestPosts, setLatestPosts] = useState([]);
  useEffect(() => {
    getLatestBlogPosts(6).then(setLatestPosts);
  }, []);

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

  const handleQuickFilterPress = useCallback(
    key => setSelectedQuickFilter(key === selectedQuickFilter ? null : key),
    [setSelectedQuickFilter, selectedQuickFilter]
  );

  const headerOnLayout = useCallback(e => {
    headerHeight.current = e.nativeEvent.layout.height;
  }, []);

  useEffect(() => {
    if (selectedContinent || selectedCategory || selectedQuickFilter) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: headerHeight.current, animated: true });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedContinent, selectedCategory, selectedQuickFilter]);

  const renderItem = useCallback(
    ({ item }) => (
      <RecipeCard
        recipe={item}
        onPress={(displayRecipe) => navigation.navigate('RecipeDetail', { recipe: displayRecipe })}
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
            navigation={navigation}
            selectedContinent={selectedContinent}
            selectedCategory={selectedCategory}
            onContinentPress={handleContinentPress}
            onCategoryPress={handleCategoryPress}
            selectedQuickFilter={selectedQuickFilter}
            onQuickFilterPress={handleQuickFilterPress}
            activeFilters={activeFilters}
            clearFilters={clearFilters}
            filteredCount={filteredRecipes.length}
            recipesLoading={recipesLoading}
            dailyMenu={dailyMenu}
            dailyMenuLoading={dailyMenuLoading}
            popularRecipes={popularRecipes}
            popularRecipesLoading={popularRecipesLoading}
            collections={collections}
            latestPosts={latestPosts}
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
  quickFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 26,
    borderWidth: 2,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickFilterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickFilterBadgeEmoji: { fontSize: 15 },
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
    position: 'relative',
  },
  dailyMenuOverlay: {
    flex: 1,
    padding: 14,
    justifyContent: 'flex-end',
  },
  dailyMenuEmoji: { fontSize: 44, marginBottom: 6 },
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

  // Popüler Tarifler
  popularCard: {
    width: 150,
    height: 190,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  popularRatingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  popularRatingText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  popularCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingTop: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popularCardName: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', lineHeight: 17 },
  popularCardCountry: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 },

  // Blog
  blogHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  blogSeeAll: { fontSize: 13, fontWeight: '700' },
  blogCard: {
    width: 200,
    height: 150,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  blogCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  blogCardDate: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  blogCardTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', lineHeight: 18 },

  // Collections
  collectionsSection: { paddingHorizontal: 16, marginBottom: 24 },
  featuredCollectionCard: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  featuredCollectionOverlay: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
  },
  featuredCollectionEyebrow: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  featuredCollectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  featuredCollectionSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  regionalCard: {
    width: 180,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  regionalCardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  regionalCardTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
  },
  regionalCardRegion: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 2,
  },
});
