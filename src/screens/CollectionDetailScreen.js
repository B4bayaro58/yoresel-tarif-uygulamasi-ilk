import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../contexts/AppContext';
import { getCollectionById } from '../services/collectionsService';
import RecipeCard from '../components/RecipeCard';

export default function CollectionDetailScreen({ route, navigation }) {
  const { collectionId } = route.params;
  const { colors, translate, recipes } = useApp();
  const [collection, setCollection] = useState(undefined);

  useEffect(() => {
    getCollectionById(collectionId).then(setCollection);
  }, [collectionId]);

  useEffect(() => {
    if (collection) {
      navigation.setOptions({ headerTitle: collection.title });
    }
  }, [collection, navigation]);

  // Koleksiyon `recipeIds`'i statik slug veya override edilmiş bir tarifin
  // kendi Firestore id'si olabilir — Günlük Menü/Kişisel Menü ile aynı
  // çift-arama fallback'i (bkz. AppContext.js findByIdOrOverride).
  const collectionRecipes = useMemo(() => {
    if (!collection) return [];
    return collection.recipeIds
      .map(id =>
        recipes.find(r => String(r.id) === id) ||
        recipes.find(r => String(r.overridesStaticId) === id)
      )
      .filter(Boolean);
  }, [collection, recipes]);

  if (collection === undefined) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (collection === null) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>{translate('noResults')}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={collectionRecipes}
      numColumns={2}
      keyExtractor={item => String(item.id)}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.hero}>
          {collection.coverPhoto ? (
            <Image source={{ uri: collection.coverPhoto }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
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
            style={styles.heroOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {!!collection.region && <Text style={styles.heroRegion}>{collection.region}</Text>}
            <Text style={styles.heroTitle}>{collection.title}</Text>
            {!!collection.subtitle && <Text style={styles.heroSubtitle}>{collection.subtitle}</Text>}
          </LinearGradient>
        </View>
      }
      renderItem={({ item }) => (
        <RecipeCard
          recipe={item}
          onPress={displayRecipe => navigation.navigate('RecipeDetail', { recipe: displayRecipe })}
        />
      )}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{translate('noResults')}</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: 20 },
  row: { paddingHorizontal: 16, justifyContent: 'space-between' },
  hero: { height: 200, marginBottom: 16, overflow: 'hidden' },
  heroOverlay: { flex: 1, padding: 20, justifyContent: 'flex-end' },
  heroRegion: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', marginBottom: 4 },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  emptyText: { textAlign: 'center', marginTop: 60, fontSize: 15 },
});
