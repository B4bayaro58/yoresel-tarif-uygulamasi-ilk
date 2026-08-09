import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../contexts/AppContext';
import { getPublishedBlogPosts, formatBlogDate } from '../services/blogService';

export default function BlogListScreen({ navigation }) {
  const { colors, translate } = useApp();
  const [posts, setPosts] = useState(undefined);

  useEffect(() => {
    getPublishedBlogPosts().then(setPosts);
  }, []);

  if (posts === undefined) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={posts}
      numColumns={2}
      keyExtractor={item => item.id}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.navigate('BlogDetail', { slug: item.slug })}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={item.title}
        >
          {item.coverPhoto ? (
            <Image source={{ uri: item.coverPhoto }} style={styles.cardImg} contentFit="cover" cachePolicy="disk" transition={150} />
          ) : (
            <LinearGradient colors={['#B97A1A', '#D99520']} style={styles.cardImg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
          )}
          <View style={styles.cardBody}>
            <Text style={[styles.cardDate, { color: colors.primary }]}>{formatBlogDate(item.publishedAt)}</Text>
            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
            {!!item.excerpt && (
              <Text style={[styles.cardExcerpt, { color: colors.textSecondary }]} numberOfLines={2}>{item.excerpt}</Text>
            )}
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{translate('blogEmpty')}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 32 },
  row: { justifyContent: 'space-between' },
  card: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImg: { width: '100%', aspectRatio: 3 / 2 },
  cardBody: { padding: 12 },
  cardDate: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  cardTitle: { fontSize: 14, fontWeight: '800', lineHeight: 18, marginBottom: 4 },
  cardExcerpt: { fontSize: 12, lineHeight: 16 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: 14 },
});
