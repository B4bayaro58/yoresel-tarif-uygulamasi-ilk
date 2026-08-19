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
import {
  Search, X, Clock, Star, SlidersHorizontal,
  UtensilsCrossed, Flame, Compass, Newspaper, LayoutGrid, LogIn,
} from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { CONTINENTS } from '../constants/continents';
import { CATEGORIES } from '../constants/categories';
import { QUICK_FILTERS } from '../constants/recipeTags';
import RecipeCard from '../components/RecipeCard';
import AdBanner from '../components/AdBanner';
import SearchModal from '../components/SearchModal';
import { RecipeGridSkeleton } from '../components/SkeletonLoader';
import { getCollections } from '../services/collectionsService';
import { getLatestBlogPosts, formatBlogDate } from '../services/blogService';
import { getGridPhotoUrl } from '../utils/imageResize';

const { width } = Dimensions.get('window');

// Kıta/kategori çiplerinin seçili hali, Koleksiyon/Blog fallback'leri ve
// misafir CTA banner'ı için tek, tutarlı marka gradyanı -- web sitesiyle
// aynı amber/turuncu (bkz. web/src/app/HomeClient.tsx). Hızlı filtreler
// kendi (çeşitlilik katan) gradyanını korur.
const PRIMARY_GRADIENT = ['#B97A1A', '#D99520'];
// Filtreler kartının çevresini saran ince çizgi için PRIMARY_GRADIENT'in
// açık/pastel tonu.
const PRIMARY_GRADIENT_LIGHT = ['#F5DDA8', '#F0C874'];
// Bölüm başlıklarının arka planı için açık gümüş gri (koyu temada karşılığı).
const SILVER_LIGHT = '#EEF0F3';
const SILVER_DARK = '#2C2F36';

// Anasayfadaki her bölüm başlığı kendi ikon rozeti + gradyanıyla ayrışıyor
// ki "Günün Menüsü", "Popüler Tarifler" vb. göz gezdirirken birbirinden
// belirgin şekilde ayırt edilsin (bkz. SectionHeader bileşeni).
const AMBER_GRADIENT = ['#F6A93B', '#DB8A1A'];
const ROSE_GRADIENT = ['#FB6F92', '#E23F63'];
const TEAL_GRADIENT = ['#2DD4BF', '#0D9488'];
const INDIGO_GRADIENT = ['#818CF8', '#5457D8'];

// Kıta ve kategori filtreleri birebir aynı görsel yapıyı paylaşıyor --
// tekrar etmemek için ortak bir çip bileşeni (seçiliyken gradyan dolgu +
// renkli "glow" gölge, seçili değilken ince kenarlıklı düz yüzey).
function FilterChip({ emoji, label, isSelected, onPress, colors, accessibilityLabel }) {
  if (isSelected) {
    // Gölge (shadow) ve gradyanın kendi köşe kırpması (overflow:hidden) aynı
    // view'de çakışınca iOS'ta gölge tamamen kayboluyor -- gölgeyi dıştaki
    // düz TouchableOpacity'de, yuvarlatılmış gradyan dolgusunu iç view'de
    // tutuyoruz.
    return (
      <TouchableOpacity
        style={[styles.chipTouchable, { shadowColor: PRIMARY_GRADIENT[1] }]}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ selected: true }}
      >
        <LinearGradient
          colors={PRIMARY_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.categoryChip, styles.categoryChipSelected]}
        >
          <Text style={styles.categoryIcon}>{emoji}</Text>
          <Text style={[styles.categoryText, styles.categoryTextSelected]}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        styles.chipSpacing,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: false }}
    >
      <Text style={styles.categoryIcon}>{emoji}</Text>
      <Text style={[styles.categoryText, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// Anasayfadaki büyük bölüm başlıkları (Günün Menüsü, Popüler Tarifler, Tüm
// Tarifler vb.) hepsi düz metindi, göz gezdirirken birbirinden ayrışmıyordu.
// Her bölüm artık kendi renkli gradyan ikon rozetiyle görsel olarak belirgin.
function SectionHeader({ icon: Icon, gradient, title, colors, right, style }) {
  const isDark = colors.background === '#121212';
  return (
    <View style={[styles.sectionHeaderRow, style]}>
      <View style={styles.sectionHeaderLeft}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sectionIconBadge}
        >
          <Icon size={15} color="#FFFFFF" strokeWidth={2.5} />
        </LinearGradient>
        <View style={[styles.sectionHeaderTitleBadge, { backgroundColor: isDark ? SILVER_DARK : SILVER_LIGHT }]}>
          <Text style={[styles.sectionHeaderTitle, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>
      {right}
    </View>
  );
}

// Web'deki ana sayfanın saat bazlı selamlama eşikleriyle birebir aynı.
function getGreetingKey(hour) {
  if (hour < 11) return 'greetingMorning';
  if (hour < 15) return 'greetingNoon';
  if (hour < 19) return 'greetingAfternoon';
  return 'greetingEvening';
}

// "Dünyanın {Lezzetleri}" gibi bir başlık metnini düz/vurgulu iki parçaya
// ayırır -- {...} içindeki kısım marka gradyanının rengiyle vurgulanır
// (bkz. translations.js homeHeroHeading, her dilde vurgulanan kelime farklı
// yerde olabildiği için düz string birleştirme yerine bu ayraç kullanılıyor).
function parseAccentHeading(text) {
  const match = text.match(/^(.*?)\{(.+)\}(.*)$/);
  if (!match) return { before: text, accent: '', after: '' };
  return { before: match[1], accent: match[2], after: match[3] };
}

// === Hero (selamlama + arama) ================================================
function HeroSection({ colors, translate, onSearchPress }) {
  const greetingKey = useMemo(() => getGreetingKey(new Date().getHours()), []);
  const heading = useMemo(() => parseAccentHeading(translate('homeHeroHeading')), [translate]);

  return (
    <View style={styles.heroSection}>
      <View style={[styles.heroEyebrow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.heroEyebrowText, { color: colors.primary }]}>
          ✦ {translate('homeHeroEyebrow')}
        </Text>
      </View>
      <Text style={[styles.heroHeading, { color: colors.text }]}>
        {heading.before}
        <Text style={[styles.heroHeadingAccent, { color: colors.primary }]}>{heading.accent}</Text>
        {heading.after}
      </Text>
      <Text style={[styles.heroGreeting, { color: colors.textSecondary }]}>
        {translate(greetingKey)}
      </Text>
      <TouchableOpacity
        style={[styles.heroSearchBar, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={onSearchPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={translate('search')}
      >
        <Search size={18} color={colors.textSecondary} />
        <Text style={[styles.heroSearchPlaceholder, { color: colors.textTertiary }]} numberOfLines={1}>
          {translate('homeHeroSearchPlaceholder')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const MemoHeroSection = React.memo(HeroSection);

// === Hızlı Filtreler (hero'nun altında, web ile aynı konumda) ===============
// Not: bu çip listesi Filtreler kartında TEKRARLANMIYOR -- web de aynı
// şekilde hızlı filtreleri yalnızca burada gösteriyor, ayrı bir kontrol
// olarak tekrar sunmuyor.
function QuickFilterRow({ selectedQuickFilter, onQuickFilterPress, colors, translate }) {
  return (
    <View style={styles.quickFilterSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickFilterScroll}
      >
        {QUICK_FILTERS.map(qf => {
          const isSelected = selectedQuickFilter === qf.key;
          if (isSelected) {
            return (
              <TouchableOpacity
                key={qf.key}
                style={[styles.chipTouchable, { shadowColor: qf.gradient[1] }]}
                onPress={() => onQuickFilterPress(qf.key)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={translate(qf.labelKey)}
                accessibilityState={{ selected: true }}
              >
                <LinearGradient
                  colors={qf.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.quickFilterChip, styles.categoryChipSelected]}
                >
                  <View style={[styles.quickFilterBadge, { backgroundColor: 'rgba(255,255,255,0.28)' }]}>
                    <Text style={styles.quickFilterBadgeEmoji}>{qf.emoji}</Text>
                  </View>
                  <Text style={[styles.categoryText, styles.categoryTextSelected]}>
                    {translate(qf.labelKey)}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={qf.key}
              style={[
                styles.quickFilterChip,
                styles.chipSpacing,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => onQuickFilterPress(qf.key)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={translate(qf.labelKey)}
              accessibilityState={{ selected: false }}
            >
              <View style={[styles.quickFilterBadge, { backgroundColor: qf.gradient[0] + '26' }]}>
                <Text style={styles.quickFilterBadgeEmoji}>{qf.emoji}</Text>
              </View>
              <Text style={[styles.categoryText, { color: colors.text }]}>
                {translate(qf.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const MemoQuickFilterRow = React.memo(QuickFilterRow);

// === Gunun Menusu ============================================================
function DailyMenuSection({ colors, translate, dailyMenu, dailyMenuLoading, navigation }) {
  if (dailyMenuLoading) {
    return (
      <View style={styles.dailyMenuSection}>
        <SectionHeader icon={UtensilsCrossed} gradient={AMBER_GRADIENT} title={translate('dailyMenu')} colors={colors} />
        <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 8 }} />
      </View>
    );
  }

  return (
    <View style={styles.dailyMenuSection}>
      <SectionHeader icon={UtensilsCrossed} gradient={AMBER_GRADIENT} title={translate('dailyMenu')} colors={colors} />
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
      <SectionHeader icon={Flame} gradient={ROSE_GRADIENT} title={translate('popularRecipesTitle')} colors={colors} />
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
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.75)']}
              style={styles.popularCardOverlay}
            >
              <Text style={styles.popularCardName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.popularCardCountry} numberOfLines={1}>{item.country}</Text>
            </LinearGradient>
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
              colors={PRIMARY_GRADIENT}
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
          <SectionHeader icon={Compass} gradient={TEAL_GRADIENT} title={translate('regionalDiscoveryTitle')} colors={colors} />
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
      <SectionHeader
        icon={Newspaper}
        gradient={INDIGO_GRADIENT}
        title={translate('blogSectionTitle')}
        colors={colors}
        style={styles.sectionHeaderNoMargin}
        right={
          <TouchableOpacity
            onPress={() => navigation.navigate('BlogList')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={translate('blogSeeAll')}
          >
            <Text style={[styles.blogSeeAll, { color: colors.primary }]}>{translate('blogSeeAll')}</Text>
          </TouchableOpacity>
        }
      />
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
                colors={PRIMARY_GRADIENT}
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

// === Misafir/anonim giriş çağrısı (grid'in altında, yalnızca oturum
// açılmamışken -- web'deki anonim kullanıcı CTA banner'ının karşılığı) ====
function GuestCTABanner({ colors, translate, onPress }) {
  return (
    <LinearGradient
      colors={PRIMARY_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.guestCta}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.guestCtaTitle}>{translate('ecosystemSyncBannerTitle')}</Text>
        <Text style={styles.guestCtaDesc}>{translate('ecosystemSyncBannerDesc')}</Text>
      </View>
      <TouchableOpacity
        style={styles.guestCtaButton}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={translate('loginButton')}
      >
        <LogIn size={15} color={PRIMARY_GRADIENT[1]} strokeWidth={2.5} />
        <Text style={[styles.guestCtaButtonText, { color: PRIMARY_GRADIENT[1] }]}>
          {translate('loginButton')}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

// Header ayri component -- stable referans icin HomeScreen disinda tanimlanir
function HomeHeader({
  colors, translate, navigation,
  onSearchPress,
  selectedContinent, selectedCategory,
  onContinentPress, onCategoryPress,
  selectedQuickFilter, onQuickFilterPress,
  activeFilters, clearFilters,
  recipesLoading,
  dailyMenu, dailyMenuLoading,
  popularRecipes, popularRecipesLoading,
  collections,
  latestPosts,
}) {
  // Bölüm sırası web ana sayfasıyla birebir eşleşiyor: Hero -> Hızlı
  // Filtreler -> Günün Menüsü -> Popüler -> Koleksiyonlar -> Blog ->
  // Filtreler kartı (artık yalnızca Kıta/Kategori) -> Tüm Tarifler.
  return (
    <View>
      <MemoHeroSection colors={colors} translate={translate} onSearchPress={onSearchPress} />

      <MemoQuickFilterRow
        colors={colors}
        translate={translate}
        selectedQuickFilter={selectedQuickFilter}
        onQuickFilterPress={onQuickFilterPress}
      />

      {/* Daily Menu */}
      <MemoDailyMenuSection
        colors={colors}
        translate={translate}
        dailyMenu={dailyMenu}
        dailyMenuLoading={dailyMenuLoading}
        navigation={navigation}
      />

      {/* Popüler Tarifler */}
      <MemoPopularRecipesSection
        colors={colors}
        translate={translate}
        popularRecipes={popularRecipes}
        popularRecipesLoading={popularRecipesLoading}
        navigation={navigation}
      />

      {/* Koleksiyonlar (Haftanın Özel Derlemesi + Yöresel Keşif) */}
      <MemoCollectionsSection
        colors={colors}
        translate={translate}
        collections={collections}
        navigation={navigation}
      />

      <View style={styles.adRow}>
        <AdBanner size="banner" />
      </View>

      {/* Blog */}
      <MemoBlogSection
        colors={colors}
        translate={translate}
        latestPosts={latestPosts}
        navigation={navigation}
      />

      {/* Filtreler -- Kıta / Kategori tek bir premium kart içinde. Hızlı
          filtreler artık burada tekrarlanmıyor, hero'nun hemen altında
          (web'deki gibi) -- aynı kontrolü iki yerde göstermemek için.
          Çevresini saran ince gradyan çizgi için üç katman: gölgeyi taşıyan
          düz dış kabuk + gradyan "çerçeve" + kartın gerçek arka planını
          taşıyan iç yüzey (gölge ve yuvarlatılmış gradyan aynı view'de
          olursa iOS'ta gölge kayboluyor, bkz. FilterChip'teki aynı çözüm). */}
      <View style={[styles.filtersCardOuter, { shadowColor: colors.shadow }]}>
        <LinearGradient
          colors={PRIMARY_GRADIENT_LIGHT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.filtersCardBorder}
        >
          <View style={[styles.filtersCard, { backgroundColor: colors.card }]}>
            <View style={styles.filtersCardHeader}>
              <LinearGradient
                colors={PRIMARY_GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.filtersIconBadge}
              >
                <SlidersHorizontal size={15} color="#FFFFFF" strokeWidth={2.5} />
              </LinearGradient>
              <Text style={[styles.filtersCardTitle, { color: colors.text }]}>
                {translate('filtersTitle')}
              </Text>
            </View>

            <View style={styles.filterRow}>
              <View style={styles.filterRowLabelRow}>
                <View style={[styles.filterRowLabelAccent, { backgroundColor: colors.primary }]} />
                <Text style={[styles.filterRowLabel, { color: colors.textSecondary }]}>
                  {translate('continentFilter')}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              >
                {CONTINENTS.map(continent => (
                  <FilterChip
                    key={continent.id}
                    emoji={continent.emoji}
                    label={translate('continent-' + continent.id)}
                    isSelected={selectedContinent === continent.id}
                    onPress={() => onContinentPress(continent.id)}
                    colors={colors}
                    accessibilityLabel={translate('continent-' + continent.id)}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={[styles.filterDivider, { backgroundColor: colors.border }]} />

            <View style={[styles.filterRow, styles.filterRowLast]}>
              <View style={styles.filterRowLabelRow}>
                <View style={[styles.filterRowLabelAccent, { backgroundColor: colors.primary }]} />
                <Text style={[styles.filterRowLabel, { color: colors.textSecondary }]}>
                  {translate('categoryFilter')}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              >
                {CATEGORIES.map(category => (
                  <FilterChip
                    key={category.id}
                    emoji={category.icon}
                    label={translate('category-' + category.id)}
                    isSelected={selectedCategory === category.id}
                    onPress={() => onCategoryPress(category.id)}
                    colors={colors}
                    accessibilityLabel={translate('category-' + category.id)}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </LinearGradient>
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
      <SectionHeader
        icon={LayoutGrid}
        gradient={PRIMARY_GRADIENT}
        title={translate('allRecipes')}
        colors={colors}
        style={styles.recipeHeaderRow}
      />

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
    registerHomeScrollToTop,
  } = useApp();
  const { user, loading: authLoading, logout } = useAuth();

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

  useEffect(() => {
    registerHomeScrollToTop(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
    return () => registerHomeScrollToTop(null);
  }, [registerHomeScrollToTop]);

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

  // Misafir "Giriş Yap" CTA'sı guest oturumundan çıkar -- AppNavigator zaten
  // (user || isGuest) false olunca AuthStack'e geçiyor (bkz. ProfileScreen'in
  // aynı deseni kullanan çıkış butonu).
  const handleGuestLoginPress = useCallback(() => {
    logout();
  }, [logout]);

  const renderFooter = useCallback(
    () => (
      <View>
        {!authLoading && !user && (
          <GuestCTABanner colors={colors} translate={translate} onPress={handleGuestLoginPress} />
        )}
        <View style={{ height: 20 }} />
      </View>
    ),
    [authLoading, user, colors, translate, handleGuestLoginPress]
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
            onSearchPress={() => setShowSearch(true)}
            selectedContinent={selectedContinent}
            selectedCategory={selectedCategory}
            onContinentPress={handleContinentPress}
            onCategoryPress={handleCategoryPress}
            selectedQuickFilter={selectedQuickFilter}
            onQuickFilterPress={handleQuickFilterPress}
            activeFilters={activeFilters}
            clearFilters={clearFilters}
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
        ListFooterComponent={renderFooter}
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
  adRow: { alignItems: 'center', marginBottom: 24 },

  // Hero
  heroSection: { paddingHorizontal: 16, paddingTop: 4, marginBottom: 4 },
  heroEyebrow: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  heroEyebrowText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroHeading: { fontSize: 26, fontWeight: '800', letterSpacing: -0.2, lineHeight: 32, marginBottom: 6 },
  heroHeadingAccent: { fontWeight: '800' },
  heroGreeting: { fontSize: 14, marginBottom: 16 },
  heroSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  heroSearchPlaceholder: { fontSize: 14, flexShrink: 1 },

  // Hızlı Filtreler (hero'nun altında)
  quickFilterSection: { marginBottom: 24 },
  quickFilterScroll: { paddingHorizontal: 16, paddingRight: 8 },

  // Misafir giriş CTA'sı
  guestCta: {
    marginHorizontal: 16,
    marginTop: 4,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  guestCtaTitle: { color: '#FFF9EE', fontSize: 15, fontWeight: '800', lineHeight: 20, marginBottom: 4 },
  guestCtaDesc: { color: 'rgba(255,249,238,0.9)', fontSize: 12, lineHeight: 17 },
  guestCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF9EE',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  guestCtaButtonText: { fontSize: 12.5, fontWeight: '800' },
  // paddingHorizontal yok -- bu satır her zaman zaten 16px yatay boşluklu bir
  // sarmalayıcının (dailyMenuSection vb.) içinde kullanılıyor, tek istisna
  // (recipeHeaderRow, "Tüm Tarifler") kendi paddingHorizontal'ını ekliyor.
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeaderNoMargin: { marginBottom: 12 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  sectionIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderTitleBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexShrink: 1,
  },
  sectionHeaderTitle: { fontSize: 17, fontWeight: '800', letterSpacing: 0.1, flexShrink: 1 },
  recipeHeaderRow: { marginBottom: 12, paddingHorizontal: 16 },
  filtersCardOuter: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 24,
    elevation: 4,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  // Gradyanın kendisi "çerçeve" -- padding kadarlık kısmı çerçeve kalınlığı
  // olarak görünür kalıyor, geri kalanını içteki düz renkli View kaplıyor.
  filtersCardBorder: {
    borderRadius: 24,
    padding: 1.5,
    overflow: 'hidden',
  },
  filtersCard: {
    borderRadius: 22.5,
    paddingTop: 21,
    paddingBottom: 18,
    paddingHorizontal: 18,
  },
  filtersCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  filtersIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersCardTitle: { fontSize: 17, fontWeight: '800', letterSpacing: 0.2 },
  filterRow: { marginBottom: 16 },
  filterRowLast: { marginBottom: 0 },
  filterRowLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  filterRowLabelAccent: { width: 3, height: 12, borderRadius: 2 },
  filterRowLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  filterDivider: { height: 1, opacity: 0.6, marginBottom: 16 },
  categoriesContainer: { paddingRight: 8 },
  chipSpacing: { marginRight: 10 },
  // Seçili çip: gölgeyi taşıyan düz dış kabuk (bkz. FilterChip yorumu --
  // gradyanın kendi köşe kırpmasıyla aynı view'de olursa iOS'ta gölge kayboluyor).
  chipTouchable: {
    marginRight: 10,
    borderRadius: 20,
    elevation: 6,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 9,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryChipSelected: { borderWidth: 0 },
  categoryIcon: { fontSize: 16 },
  categoryText: { fontSize: 13.5, fontWeight: '600', letterSpacing: 0.1 },
  categoryTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  quickFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  quickFilterBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickFilterBadgeEmoji: { fontSize: 14 },
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
    borderRadius: 18,
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
    paddingTop: 32,
  },
  popularCardName: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', lineHeight: 17 },
  popularCardCountry: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 },

  // Blog
  blogSeeAll: { fontSize: 13, fontWeight: '700' },
  blogCard: {
    width: 200,
    height: 150,
    borderRadius: 18,
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
    borderRadius: 18,
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
    borderRadius: 18,
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
