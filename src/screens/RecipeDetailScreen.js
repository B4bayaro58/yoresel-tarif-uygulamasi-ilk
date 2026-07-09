import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  Clock,
  Users,
  Flame,
  Star,
  ShoppingCart,
  Play,
  Pause,
  Square,
  CheckCircle2,
  Circle,
  Share2,
  Youtube,
  Wrench,
} from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import AdBanner from '../components/AdBanner';
import ReviewsSection from '../components/ReviewsSection';
import RecipeCard from '../components/RecipeCard';
import { logRecipeView, logShare } from '../services/analyticsService';

const { width } = Dimensions.get('window');

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe } = route.params;
  const {
    colors,
    translate,
    recipes,
    isFavorite,
    toggleFavorite,
    addToShoppingList,
    toggleStep,
    isStepCompleted,
    getRecipeProgress,
    timerActive,
    timerPaused,
    timeRemaining,
    startTimer,
    pauseTimer,
    stopTimer,
    openAlternatives,
  } = useApp();

  // Sayfa açılınca görüntüleme logu
  React.useEffect(() => {
    logRecipeView(recipe.id, recipe.name, recipe.continent);
  }, [recipe.id]);

  const similarRecipes = useMemo(() => {
    return recipes
      .filter(r => r.id !== recipe.id && (r.category === recipe.category || r.continent === recipe.continent))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [recipe.id, recipes]);

  const handleShare = async () => {
    const ingredientList = recipe.ingredients
      .map(i => `• ${i.amount ? i.amount + ' ' : ''}${i.name}`)
      .join('\n');
    const stepList = recipe.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');

    logShare(recipe.id, recipe.name);
    try {
      await Share.share({
        title: recipe.name,
        message:
          `🍽️ ${recipe.name}\n` +
          `📍 ${recipe.city ? `${recipe.country}, ${recipe.city}` : recipe.country} • ⭐ ${recipe.rating} • ⏱️ ${recipe.prepTime} dk\n\n` +
          `📋 Malzemeler:\n${ingredientList}\n\n` +
          `👨‍🍳 Hazırlanışı:\n${stepList}\n\n` +
          `Yöresel Tarifler uygulamasından paylaşıldı.\n` +
          `yoreseltarifler://recipe/${recipe.id}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };
  const [scaledServings, setScaledServings] = useState(recipe.servings || 4);
  const [timerMinutes, setTimerMinutes] = useState(recipe.prepTime || 10);
  const isFav = isFavorite(recipe.id);
  const progress = getRecipeProgress(recipe.id, recipe.steps.length);

  const scaleRatio = scaledServings / (recipe.servings || 4);

  const isSafeVideoUrl = (url) => {
    try {
      const parsed = new URL(url);
      const allowed = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com'];
      return parsed.protocol === 'https:' && allowed.some(d => parsed.hostname.endsWith(d));
    } catch {
      return false;
    }
  };

  const adjustTimer = (delta) => {
    setTimerMinutes(prev => Math.max(1, prev + delta));
  };

  const formatNumber = (n) => {
    if (n === Math.round(n)) return Math.round(n).toString();
    return parseFloat(n.toFixed(1)).toString();
  };

  const scaleAmount = (amount) => {
    if (!amount || scaleRatio === 1) return amount;
    const fracMatch = amount.match(/^(\d+)\/(\d+)(.*)/);
    if (fracMatch) {
      const scaled = (parseInt(fracMatch[1]) / parseInt(fracMatch[2])) * scaleRatio;
      return formatNumber(scaled) + fracMatch[3];
    }
    const rangeMatch = amount.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)(.*)/);
    if (rangeMatch) {
      return `${formatNumber(parseFloat(rangeMatch[1]) * scaleRatio)}-${formatNumber(parseFloat(rangeMatch[2]) * scaleRatio)}${rangeMatch[3]}`;
    }
    const numMatch = amount.match(/^(\d+(?:\.\d+)?)(.*)/);
    if (numMatch) {
      return formatNumber(parseFloat(numMatch[1]) * scaleRatio) + numMatch[2];
    }
    return amount;
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image with Hybrid Visual System */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={recipe.gradient || ['#667EEA', '#764BA2']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Emoji Watermark */}
            <Text style={styles.heroEmoji}>{recipe.emoji}</Text>

            {/* Photo Overlay */}
            <View style={styles.heroImage}>
              <Image
                source={recipe.photo ? { uri: recipe.photo } : require('../../assets/icon.png')}
                style={styles.heroImageStyle}
                contentFit="cover"
                cachePolicy="disk"
                transition={150}
              />
              {/* Action Buttons */}
              <View style={styles.heroActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <View style={styles.heroRightButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}
                    onPress={handleShare}
                  >
                    <Share2 size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: isFav ? colors.primary : 'rgba(0, 0, 0, 0.6)' },
                    ]}
                    onPress={() => toggleFavorite(recipe.id)}
                  >
                    <Heart
                      size={24}
                      color="#FFFFFF"
                      fill={isFav ? '#FFFFFF' : 'transparent'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Recipe Info */}
        <View style={styles.content}>
          <Text style={[styles.recipeName, { color: colors.text }]}>
            {recipe.name}
          </Text>
          <Text style={[styles.recipeCountry, { color: colors.textSecondary }]}>
            {recipe.city ? `${recipe.country}, ${recipe.city}` : recipe.country}
          </Text>

          {/* Meta Info Grid */}
          <View style={styles.metaGrid}>
            <View style={[styles.metaCard, { backgroundColor: colors.card }]}>
              <Star size={20} color="#FFD700" fill="#FFD700" />
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {recipe.rating}
              </Text>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                {translate('rating')}
              </Text>
            </View>
            <View style={[styles.metaCard, { backgroundColor: colors.card }]}>
              <Clock size={20} color={colors.primary} />
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {recipe.prepTime}
              </Text>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                {translate('minutes')}
              </Text>
            </View>
            <View style={[styles.metaCard, { backgroundColor: colors.card }]}>
              <Users size={20} color={colors.primary} />
              <View style={styles.servingsRow}>
                <TouchableOpacity
                  onPress={() => setScaledServings(s => Math.max(1, s - 1))}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={[styles.servingsBtn, { color: colors.primary }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.metaValue, { color: colors.text }]}>
                  {scaledServings}
                </Text>
                <TouchableOpacity
                  onPress={() => setScaledServings(s => s + 1)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={[styles.servingsBtn, { color: colors.primary }]}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                {translate('people')}
              </Text>
            </View>
            <View style={[styles.metaCard, { backgroundColor: colors.card }]}>
              <Flame size={20} color="#FF6B35" />
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {recipe.calories}
              </Text>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                {translate('calories')}
              </Text>
            </View>
          </View>

          {/* Video Link */}
          {recipe.videoUrl && isSafeVideoUrl(recipe.videoUrl) ? (
            <TouchableOpacity
              style={[styles.videoButton, { backgroundColor: '#FF0000' }]}
              onPress={() => Linking.openURL(recipe.videoUrl)}
              activeOpacity={0.8}
            >
              <Youtube size={22} color="#fff" />
              <Text style={styles.videoButtonText}>{translate('watchVideo')}</Text>
            </TouchableOpacity>
          ) : null}

          {/* Nutrition Info */}
          {(recipe.protein || recipe.carbs || recipe.fat) ? (
            <View style={[styles.nutritionContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.nutritionTitle, { color: colors.text }]}>{translate('nutritionInfo')}</Text>
              <View style={styles.nutritionGrid}>
                {recipe.protein > 0 && (
                  <View style={styles.nutritionItem}>
                    <Text style={[styles.nutritionValue, { color: '#3B82F6' }]}>{recipe.protein}g</Text>
                    <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>{translate('protein')}</Text>
                  </View>
                )}
                {recipe.carbs > 0 && (
                  <View style={styles.nutritionItem}>
                    <Text style={[styles.nutritionValue, { color: '#F59E0B' }]}>{recipe.carbs}g</Text>
                    <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>{translate('carbs')}</Text>
                  </View>
                )}
                {recipe.fat > 0 && (
                  <View style={styles.nutritionItem}>
                    <Text style={[styles.nutritionValue, { color: '#EF4444' }]}>{recipe.fat}g</Text>
                    <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>{translate('fat')}</Text>
                  </View>
                )}
              </View>
            </View>
          ) : null}

          {/* Difficulty */}
          <View style={[styles.difficultyContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.difficultyLabel, { color: colors.textSecondary }]}>
              {translate('difficulty')}:
            </Text>
            <Text style={[styles.difficultyValue, { color: colors.primary }]}>
              {translate(`difficulty-${recipe.difficulty}`)}
            </Text>
          </View>

          {/* ── AD: Medium Rectangle — malzeme listesinden önce ── */}
          <View style={styles.adContainer}>
            <AdBanner size="rectangle" />
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {translate('ingredients')}
            </Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View
                key={index}
                style={[
                  styles.ingredientItem,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.ingredientInfo}>
                  <Text style={[styles.ingredientName, { color: colors.text }]}>
                    {ingredient.name}
                  </Text>
                  <Text style={[styles.ingredientAmount, { color: colors.textSecondary }]}>
                    {scaleAmount(ingredient.amount)}
                    {scaleRatio !== 1 && (
                      <Text style={{ color: colors.primary, fontSize: 11 }}> ({translate('scaled')})</Text>
                    )}
                  </Text>
                </View>
                <View style={styles.ingredientActions}>
                  {ingredient.alternatives && (
                    <TouchableOpacity
                      style={[styles.alternativeButton, { borderColor: colors.primary }]}
                      onPress={() => openAlternatives(ingredient)}
                    >
                      <Text style={[styles.alternativeButtonText, { color: colors.primary }]}>
                        {translate('alternatives')}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.shoppingButton, { backgroundColor: colors.primary }]}
                    onPress={() => addToShoppingList({ ...ingredient, amount: scaleAmount(ingredient.amount) })}
                  >
                    <ShoppingCart size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Equipment */}
          {recipe.equipment && recipe.equipment.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {translate('equipment')}
              </Text>
              <View style={styles.equipmentGrid}>
                {recipe.equipment.map((item, index) => (
                  <View
                    key={index}
                    style={[styles.equipmentChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                  >
                    <Wrench size={13} color={colors.primary} />
                    <Text style={[styles.equipmentChipText, { color: colors.text }]}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Timer */}
          <View style={[styles.timerContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.timerTitle, { color: colors.text }]}>
              {translate('cookingTimer')}
            </Text>
            <Text style={[styles.timerHint, { color: colors.textSecondary }]}>
              {translate('timerAdjustHint')}
            </Text>

            {!timerActive ? (
              /* Ayar modu */
              <View style={styles.timerControls}>
                <View style={styles.timerAdjustRow}>
                  <TouchableOpacity
                    style={[styles.timerAdjustBtn, { backgroundColor: colors.border }]}
                    onPress={() => adjustTimer(-5)}
                  >
                    <Text style={[styles.timerAdjustBtnText, { color: colors.text }]}>−5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.timerAdjustBtn, { backgroundColor: colors.border }]}
                    onPress={() => adjustTimer(-1)}
                  >
                    <Text style={[styles.timerAdjustBtnText, { color: colors.text }]}>−1</Text>
                  </TouchableOpacity>

                  <Text style={[styles.timerDisplay, { color: colors.text }]}>
                    {String(timerMinutes).padStart(2, '0')}:00
                  </Text>

                  <TouchableOpacity
                    style={[styles.timerAdjustBtn, { backgroundColor: colors.border }]}
                    onPress={() => adjustTimer(1)}
                  >
                    <Text style={[styles.timerAdjustBtnText, { color: colors.text }]}>+1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.timerAdjustBtn, { backgroundColor: colors.border }]}
                    onPress={() => adjustTimer(5)}
                  >
                    <Text style={[styles.timerAdjustBtnText, { color: colors.text }]}>+5</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.timerStartBtn, { backgroundColor: colors.success }]}
                  onPress={() => startTimer(timerMinutes, recipe.name)}
                >
                  <Play size={20} color="#FFFFFF" />
                  <Text style={styles.timerButtonText}>{translate('startTimer')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Çalışma modu */
              <View style={styles.timerControls}>
                <Text style={[styles.timerDisplay, { color: colors.text }]}>
                  {formatTime(timeRemaining)}
                </Text>
                <View style={styles.timerButtons}>
                  <TouchableOpacity
                    style={[styles.timerButton, { backgroundColor: colors.warning }]}
                    onPress={pauseTimer}
                  >
                    {timerPaused ? (
                      <>
                        <Play size={20} color="#FFFFFF" />
                        <Text style={styles.timerButtonText}>{translate('resume')}</Text>
                      </>
                    ) : (
                      <>
                        <Pause size={20} color="#FFFFFF" />
                        <Text style={styles.timerButtonText}>{translate('pauseTimer')}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.timerButton, { backgroundColor: colors.error }]}
                    onPress={stopTimer}
                  >
                    <Square size={20} color="#FFFFFF" />
                    <Text style={styles.timerButtonText}>{translate('stopTimer')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: colors.text }]}>
                {translate('progress')}
              </Text>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                {progress.completed}/{progress.total} {translate('completed')}
              </Text>
            </View>
            <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { backgroundColor: colors.success, width: `${progress.percentage}%` },
                ]}
              />
            </View>
          </View>

          {/* Reviews */}
          <ReviewsSection recipe={recipe} />

          {/* Steps */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {translate('steps')}
            </Text>
            {recipe.steps.map((step, index) => {
              const completed = isStepCompleted(recipe.id, index);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.stepItem,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    completed && { borderColor: colors.success, borderWidth: 2 },
                  ]}
                  onPress={() => toggleStep(recipe.id, index, recipe.steps.length, recipe.name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.stepHeader}>
                    {completed ? (
                      <CheckCircle2 size={24} color={colors.success} />
                    ) : (
                      <Circle size={24} color={colors.textTertiary} />
                    )}
                    <Text style={[styles.stepNumber, { color: colors.textSecondary }]}>
                      {translate('step')} {index + 1}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.stepText,
                      { color: colors.text },
                      completed && { textDecorationLine: 'line-through', opacity: 0.6 },
                    ]}
                  >
                    {step}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── AD: Banner — adımlar bitti, benzer tariflerden önce ── */}
          <View style={styles.adContainer}>
            <AdBanner size="banner" />
          </View>

          {/* Similar Recipes */}
          {similarRecipes.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {translate('youMayAlsoLike')}
              </Text>
              <View style={styles.similarGrid}>
                {similarRecipes.map(similar => (
                  <RecipeCard
                    key={similar.id}
                    recipe={similar}
                    onPress={() => navigation.replace('RecipeDetail', { recipe: similar })}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    width: width,
    height: 300,
  },
  heroGradient: {
    flex: 1,
    position: 'relative',
  },
  heroEmoji: {
    position: 'absolute',
    fontSize: 150,
    opacity: 0.25,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -75 }],
    zIndex: 1,
  },
  heroImage: {
    flex: 1,
    position: 'relative',
  },
  heroImageStyle: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.85,
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingTop: 60,
  },
  heroRightButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  recipeName: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  recipeCountry: {
    fontSize: 18,
    marginBottom: 20,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metaCard: {
    flex: 1,
    minWidth: (width - 64) / 4,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  metaValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  servingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  servingsBtn: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  metaLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  difficultyLabel: {
    fontSize: 14,
  },
  difficultyValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ingredientAmount: {
    fontSize: 14,
  },
  ingredientActions: {
    flexDirection: 'row',
    gap: 8,
  },
  alternativeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  alternativeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  shoppingButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  equipmentChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  timerContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  timerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  timerHint: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  timerControls: {
    alignItems: 'center',
  },
  timerAdjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  timerAdjustBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerAdjustBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 16,
    minWidth: 120,
    textAlign: 'center',
  },
  timerStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  timerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressText: {
    fontSize: 14,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  stepItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  stepText: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 36,
  },
  adContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  similarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  videoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  nutritionContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
    gap: 4,
  },
  nutritionValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  nutritionLabel: {
    fontSize: 12,
  },
});
