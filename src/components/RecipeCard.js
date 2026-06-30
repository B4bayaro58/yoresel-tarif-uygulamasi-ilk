import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Star, Clock, Users, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../contexts/AppContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

function RecipeCard({ recipe, onPress }) {
  const { colors, translate, isFavorite, toggleFavorite } = useApp();
  const isFav = isFavorite(recipe.id);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${recipe.name}, ${recipe.city ? `${recipe.country}, ${recipe.city}` : recipe.country}, ${recipe.prepTime} ${translate('minutes')}`}
      accessibilityHint={translate('tapToViewRecipe')}
    >
      {/* Hybrid Visual System: Gradient + Emoji + Photo */}
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={recipe.gradient || ['#667EEA', '#764BA2']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Emoji Watermark */}
          <Text style={styles.emojiWatermark}>{recipe.emoji}</Text>

          {/* Photo Overlay */}
          <ImageBackground
            source={recipe.photo ? { uri: recipe.photo } : require('../../assets/icon.png')}
            style={styles.photoOverlay}
            imageStyle={styles.photoImage}
          >
            {/* Rating Badge — sol üst */}
            <View style={styles.ratingBadge}>
              <Star size={12} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{recipe.rating}</Text>
            </View>

            {/* Favori butonu — sağ üst */}
            <TouchableOpacity
              style={[styles.favButton, isFav && { backgroundColor: colors.primary }]}
              onPress={(e) => { e.stopPropagation(); toggleFavorite(recipe.id); }}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessibilityRole="button"
              accessibilityLabel={isFav ? translate('removeFromFavorites') : translate('addToFavorites')}
            >
              <Heart
                size={14}
                color="#FFFFFF"
                fill={isFav ? '#FFFFFF' : 'transparent'}
              />
            </TouchableOpacity>
          </ImageBackground>
        </LinearGradient>
      </View>

      {/* Recipe Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.recipeName, { color: colors.text }]} numberOfLines={2}>
          {recipe.name}
        </Text>
        <Text style={[styles.recipeCountry, { color: colors.textSecondary }]} numberOfLines={1}>
          {recipe.city ? `${recipe.country}, ${recipe.city}` : recipe.country}
        </Text>

        {/* Meta Info */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={13} color={colors.textTertiary} />
            <Text style={[styles.metaText, { color: colors.textTertiary }]}>
              {recipe.prepTime}dk
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={13} color={colors.textTertiary} />
            <Text style={[styles.metaText, { color: colors.textTertiary }]}>
              {recipe.servings}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(RecipeCard);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  emojiWatermark: {
    position: 'absolute',
    fontSize: 80,
    opacity: 0.3,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
  },
  photoOverlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  photoImage: {
    opacity: 0.85,
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    padding: 12,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  recipeCountry: {
    fontSize: 13,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
});