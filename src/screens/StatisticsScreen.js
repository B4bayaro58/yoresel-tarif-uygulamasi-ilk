import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Heart,
  Star,
  Globe,
  Award,
} from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { getPlatformCounts } from '../services/statsService';

export default function StatisticsScreen() {
  const { colors, translate, recipes } = useApp();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFavorites: 0,
    totalRecipes: recipes.length,
    avgRating: 0,
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);

      const { totalUsers, totalFavorites } = await getPlatformCounts();

      // Ortalama puanı hesapla
      const avgRating = recipes.length > 0
        ? (recipes.reduce((sum, r) => sum + r.rating, 0) / recipes.length).toFixed(1)
        : '0.0';

      setStats({
        totalUsers,
        totalFavorites,
        totalRecipes: recipes.length,
        avgRating,
      });
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  // Kategori bazlı tarif sayıları
  const categoryCounts = recipes.reduce((acc, recipe) => {
    acc[recipe.category] = (acc[recipe.category] || 0) + 1;
    return acc;
  }, {});

  // Kıta bazlı tarif sayıları
  const continentCounts = recipes.reduce((acc, recipe) => {
    acc[recipe.continent] = (acc[recipe.continent] || 0) + 1;
    return acc;
  }, {});

  // En popüler tarifler (rating'e göre)
  const topRecipes = [...recipes]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {translate('loadingStats')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{translate('detailedStatistics')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {translate('appMetrics')}
        </Text>
      </View>

      {/* Main Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.statIcon, { backgroundColor: '#FF6B5720' }]}>
            <BookOpen size={24} color="#FF6B57" />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalRecipes}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{translate('totalRecipes')}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.statIcon, { backgroundColor: '#3B82F620' }]}>
            <Users size={24} color="#3B82F6" />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalUsers}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{translate('totalUsers')}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.statIcon, { backgroundColor: '#10B98120' }]}>
            <TrendingUp size={24} color="#10B981" />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.avgRating}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{translate('avgRating')}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.statIcon, { backgroundColor: '#F59E0B20' }]}>
            <Heart size={24} color="#F59E0B" />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalFavorites}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{translate('favorite')}</Text>
        </View>
      </View>

      {/* Category Distribution */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <BarChart3 size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {translate('categoryDistribution')}
          </Text>
        </View>

        {Object.entries(categoryCounts).map(([category, count]) => (
          <View
            key={category}
            style={[styles.barItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.barLabel, { color: colors.text }]}>{category}</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${(count / stats.totalRecipes) * 100}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.barValue, { color: colors.textSecondary }]}>{count}</Text>
          </View>
        ))}
      </View>

      {/* Continent Distribution */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Globe size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {translate('continentDistribution')}
          </Text>
        </View>

        {Object.entries(continentCounts).map(([continent, count]) => (
          <View
            key={continent}
            style={[styles.barItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.barLabel, { color: colors.text }]}>{continent}</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${(count / stats.totalRecipes) * 100}%`,
                    backgroundColor: '#10B981',
                  },
                ]}
              />
            </View>
            <Text style={[styles.barValue, { color: colors.textSecondary }]}>{count}</Text>
          </View>
        ))}
      </View>

      {/* Top Rated Recipes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Award size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {translate('topRecipes')}
          </Text>
        </View>

        {topRecipes.map((recipe, index) => (
          <View
            key={recipe.id}
            style={[styles.topRecipe, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.rank, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.rankText, { color: colors.primary }]}>#{index + 1}</Text>
            </View>
            <View style={styles.topRecipeInfo}>
              <Text style={[styles.topRecipeName, { color: colors.text }]}>
                {recipe.name}
              </Text>
              <Text style={[styles.topRecipeCategory, { color: colors.textSecondary }]}>
                {recipe.category} • {recipe.country}
              </Text>
            </View>
            <View style={styles.topRecipeRating}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={[styles.topRecipeRatingText, { color: colors.text }]}>
                {recipe.rating.toFixed(1)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  barItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 100,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  barValue: {
    fontSize: 14,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
  topRecipe: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  rank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '800',
  },
  topRecipeInfo: {
    flex: 1,
  },
  topRecipeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  topRecipeCategory: {
    fontSize: 13,
  },
  topRecipeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topRecipeRatingText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
