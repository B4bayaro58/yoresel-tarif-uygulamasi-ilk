import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Star, Clock, Users, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../contexts/AppContext';
import { getOverrideRecipe } from '../services/overridePhoto';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

function RecipeCard({ recipe, onPress }) {
  const { colors, translate, isFavorite, toggleFavorite } = useApp();
  const [override, setOverride] = useState(null);

  // Kart FlatList tarafından render edildiğinde (virtualization sayesinde bu
  // zaten sadece görünüm penceresine yakın kartlar için olur) o tarife özel
  // yüklenmiş bir fotoğraf var mı diye tek seferlik, hedefli bir sorgu
  // çalıştırır. Toplu/limitli bir sorguyla önceden hepsini çekmek yerine
  // yalnızca kullanıcının fiilen kaydırıp gördüğü kartlar Firestore okuması
  // tetikler (bkz. src/services/overridePhoto.js).
  useEffect(() => {
    if (recipe.isFirebase) return; // zaten çözülmüş bir Firestore kaydı
    let cancelled = false;
    getOverrideRecipe(String(recipe.id)).then(found => {
      if (!cancelled && found) setOverride(found);
    });
    return () => { cancelled = true; };
  }, [recipe]);

  const displayRecipe = override || recipe;
  const isFav = isFavorite(recipe.id);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => onPress(displayRecipe)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${displayRecipe.name}, ${displayRecipe.city ? `${displayRecipe.country}, ${displayRecipe.city}` : displayRecipe.country}, ${displayRecipe.prepTime} ${translate('minutes')}`}
      accessibilityHint={translate('tapToViewRecipe')}
    >
      {/* Hybrid Visual System: Gradient + Emoji + Photo */}
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={displayRecipe.gradient || ['#667EEA', '#764BA2']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Emoji Watermark */}
          <Text style={styles.emojiWatermark}>{displayRecipe.emoji}</Text>

          {/* Photo Overlay — expo-image: disk cache + kart boyutuna göre otomatik
              downsampling (bkz. maliyet denetimi 2026-07-09, önceden RN Image her
              açılışta tam çözünürlüğü ağdan tekrar çekiyordu) */}
          <View style={styles.photoOverlay}>
            <Image
              source={displayRecipe.photo ? { uri: displayRecipe.photo } : require('../../assets/icon.png')}
              style={styles.photoImage}
              contentFit="cover"
              cachePolicy="disk"
              transition={150}
            />

            {/* Rating Badge — sol üst */}
            <View style={styles.ratingBadge}>
              <Star size={12} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{displayRecipe.rating}</Text>
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
          </View>
        </LinearGradient>
      </View>

      {/* Recipe Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.recipeName, { color: colors.text }]} numberOfLines={2}>
          {displayRecipe.name}
        </Text>
        <Text style={[styles.recipeCountry, { color: colors.textSecondary }]} numberOfLines={1}>
          {displayRecipe.city ? `${displayRecipe.country}, ${displayRecipe.city}` : displayRecipe.country}
        </Text>

        {/* Meta Info */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={13} color={colors.textTertiary} />
            <Text style={[styles.metaText, { color: colors.textTertiary }]}>
              {displayRecipe.prepTime}dk
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={13} color={colors.textTertiary} />
            <Text style={[styles.metaText, { color: colors.textTertiary }]}>
              {displayRecipe.servings}
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
    ...StyleSheet.absoluteFillObject,
    opacity: 0.85,
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