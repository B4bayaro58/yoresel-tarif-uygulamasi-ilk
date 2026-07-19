import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  BarChart3,
  PlusCircle,
  Edit3,
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  ChevronRight,
  UtensilsCrossed,
  Flag,
} from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { getPlatformCounts } from '../services/statsService';

export default function AdminPanelScreen({ navigation }) {
  const { colors, translate, recipes } = useApp();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFavorites: 0,
    totalRecipes: recipes.length,
    avgRating: 0,
  });

  useEffect(() => {
    if (isAdmin) {
      loadStatistics();
    }
  }, [isAdmin]);

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
      // Hata durumunda default değerler kullan
      setStats({
        totalUsers: 0,
        totalFavorites: 0,
        totalRecipes: recipes.length,
        avgRating: (recipes.reduce((sum, r) => sum + r.rating, 0) / recipes.length).toFixed(1),
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          {translate('noAccessPermission')}
        </Text>
      </View>
    );
  }

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

  // Calculate statistics
  const totalRecipes = stats.totalRecipes;
  const totalUsers = stats.totalUsers;
  const totalFavorites = stats.totalFavorites;
  const avgRating = stats.avgRating;

  const statCards = [
    { icon: BookOpen, label: translate('totalRecipes'), value: totalRecipes, color: '#FF6B57' },
    { icon: Users, label: translate('totalUsers'), value: totalUsers, color: '#3B82F6' },
    { icon: TrendingUp, label: translate('avgRating'), value: avgRating, color: '#10B981' },
    { icon: BarChart3, label: translate('totalFavorites'), value: totalFavorites, color: '#F59E0B' },
  ];

  const adminActions = [
    {
      icon: PlusCircle,
      title: translate('addNewRecipe'),
      subtitle: translate('addNewRecipeDesc'),
      color: '#10B981',
      onPress: () => navigation.navigate('AddRecipe'),
    },
    {
      icon: Edit3,
      title: translate('editRecipes'),
      subtitle: translate('editRecipesDesc'),
      color: '#3B82F6',
      onPress: () => navigation.navigate('ManageRecipes'),
    },
    {
      icon: Users,
      title: translate('manageUsers'),
      subtitle: translate('manageUsersDesc'),
      color: '#8B5CF6',
      onPress: () => navigation.navigate('ManageUsers'),
    },
    {
      icon: BarChart3,
      title: translate('statistics'),
      subtitle: translate('statisticsDesc'),
      color: '#F59E0B',
      onPress: () => navigation.navigate('Statistics'),
    },
    {
      icon: Clock,
      title: translate('pendingRecipes'),
      subtitle: translate('pendingRecipesDesc'),
      color: '#EF4444',
      onPress: () => navigation.navigate('PendingRecipes'),
    },
    {
      icon: Flag,
      title: translate('reportedReviews'),
      subtitle: translate('reportedReviewsDesc'),
      color: '#DC2626',
      onPress: () => navigation.navigate('ReportedReviews'),
    },
    {
      icon: UtensilsCrossed,
      title: translate('manageDailyMenu'),
      subtitle: translate('manageDailyMenuDesc'),
      color: '#0EA5E9',
      onPress: () => navigation.navigate('DailyMenu'),
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>
          {translate('welcomeAdmin')} 👋
        </Text>
        <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
          {user?.email}
        </Text>
      </View>

      {/* Statistics Grid */}
      <View style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <View
            key={index}
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
              <stat.icon size={24} color={stat.color} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Admin Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {translate('adminActions')}
        </Text>
        {adminActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: action.color + '20' }]}>
              <action.icon size={24} color={action.color} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                {action.title}
              </Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                {action.subtitle}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Info */}
      <View style={[styles.infoBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
        <Text style={[styles.infoTitle, { color: colors.primary }]}>
          💡 {translate('adminTip')}
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          {translate('adminTipText')}
        </Text>
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
  welcomeSection: {
    padding: 20,
    paddingTop: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  welcomeSubtitle: {
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
  statIconContainer: {
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  infoBox: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    padding: 40,
  },
});
