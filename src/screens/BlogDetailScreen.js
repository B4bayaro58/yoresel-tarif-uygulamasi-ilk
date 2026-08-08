import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../contexts/AppContext';
import { getBlogPostBySlug, formatBlogDate } from '../services/blogService';
import BlogContentRenderer from '../components/BlogContentRenderer';

export default function BlogDetailScreen({ route, navigation }) {
  const { slug } = route.params;
  const { colors, translate, recipes } = useApp();
  const [post, setPost] = useState(undefined);

  useEffect(() => {
    getBlogPostBySlug(slug).then(setPost);
  }, [slug]);

  useEffect(() => {
    if (post) {
      navigation.setOptions({ headerTitle: post.title });
    }
  }, [post, navigation]);

  if (post === undefined) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (post === null) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>{translate('blogPostNotFound')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        {post.coverPhoto ? (
          <Image source={{ uri: post.coverPhoto }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
        ) : (
          <LinearGradient colors={['#B97A1A', '#D99520']} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.heroOverlay}
        >
          <Text style={styles.heroTitle}>{post.title}</Text>
          <Text style={styles.heroMeta}>
            {formatBlogDate(post.publishedAt)}{post.authorName ? ` · ${post.authorName}` : ''}
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.body}>
        <BlogContentRenderer content={post.content} recipes={recipes} colors={colors} navigation={navigation} translate={translate} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { height: 320, justifyContent: 'flex-end' },
  heroOverlay: { padding: 20, paddingTop: 60 },
  heroTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', lineHeight: 32, marginBottom: 6 },
  heroMeta: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  body: { padding: 20, paddingBottom: 48 },
});
