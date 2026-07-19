import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Flag, Trash2, UserX, Star } from 'lucide-react-native';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useApp } from '../contexts/AppContext';

// Şikayet kuyruğu da (tıpkı onay bekleyen tarifler gibi) kötüye kullanımla
// sınırsız büyüyebilir — sayfalanarak yükleniyor.
const PAGE_SIZE = 100;

export default function ReportedReviewsScreen() {
  const { colors, translate, recipes } = useApp();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastDocRef = useRef(null);

  useEffect(() => {
    loadReported();
  }, []);

  const loadReported = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'reviews'),
        where('reportCount', '>', 0),
        orderBy('reportCount', 'desc'),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setReviews(loaded);
      lastDocRef.current = snapshot.docs[snapshot.docs.length - 1] ?? null;
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      Alert.alert(translate('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreReported = async () => {
    if (!lastDocRef.current) return;
    try {
      setLoadingMore(true);
      const q = query(
        collection(db, 'reviews'),
        where('reportCount', '>', 0),
        orderBy('reportCount', 'desc'),
        startAfter(lastDocRef.current),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setReviews(prev => [...prev, ...loaded]);
      lastDocRef.current = snapshot.docs[snapshot.docs.length - 1] ?? null;
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      Alert.alert(translate('error'), error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const recipeName = (recipeId) => {
    const found = recipes.find(r => r.id === recipeId);
    return found?.name || recipeId;
  };

  const handleDeleteReview = (review) => {
    Alert.alert(
      translate('deleteReview'),
      translate('deleteReviewConfirm'),
      [
        { text: translate('cancel'), style: 'cancel' },
        {
          text: translate('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'reviews', review.id));
              setReviews(prev => prev.filter(r => r.id !== review.id));
            } catch (error) {
              Alert.alert(translate('error'), error.message);
            }
          },
        },
      ]
    );
  };

  const handleBlockUser = (review) => {
    Alert.alert(
      translate('blockUser'),
      translate('blockUserConfirm'),
      [
        { text: translate('cancel'), style: 'cancel' },
        {
          text: translate('blockUser'),
          style: 'destructive',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'users', review.userId), { isBlocked: true });
              Alert.alert(translate('blockUser'), translate('userBlocked'));
            } catch (error) {
              Alert.alert(translate('error'), error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{translate('reportedReviews')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {translate('reportedReviewsDesc')}
        </Text>
      </View>

      <ScrollView style={styles.list}>
        {reviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Flag size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {translate('noReportedReviews')}
            </Text>
          </View>
        ) : (
          reviews.map(review => (
            <View
              key={review.id}
              style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.reviewTopRow}>
                <Text style={[styles.reviewUser, { color: colors.text }]}>{review.userName}</Text>
                <View style={[styles.reportBadge, { backgroundColor: '#EF444420' }]}>
                  <Flag size={12} color="#EF4444" />
                  <Text style={styles.reportBadgeText}>
                    {review.reportCount} {translate('reportsCount')}
                  </Text>
                </View>
              </View>
              <Text style={[styles.recipeName, { color: colors.textTertiary }]}>
                {recipeName(review.recipeId)}
              </Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    size={13}
                    color="#FFD700"
                    fill={s <= review.rating ? '#FFD700' : 'transparent'}
                  />
                ))}
              </View>
              {review.comment ? (
                <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>
                  {review.comment}
                </Text>
              ) : null}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#EF444420' }]}
                  onPress={() => handleDeleteReview(review)}
                  activeOpacity={0.7}
                >
                  <Trash2 size={15} color="#EF4444" />
                  <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>
                    {translate('deleteReview')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#F59E0B20' }]}
                  onPress={() => handleBlockUser(review)}
                  activeOpacity={0.7}
                >
                  <UserX size={15} color="#F59E0B" />
                  <Text style={[styles.actionButtonText, { color: '#F59E0B' }]}>
                    {translate('blockUser')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {hasMore && !loading && (
          <TouchableOpacity
            style={[styles.loadMoreButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={loadMoreReported}
            disabled={loadingMore}
            activeOpacity={0.7}
          >
            {loadingMore ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={[styles.loadMoreText, { color: colors.text }]}>Daha Fazla Yükle</Text>
            )}
          </TouchableOpacity>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
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
    fontSize: 15,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    gap: 6,
  },
  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: '700',
  },
  reportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  reportBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  recipeName: {
    fontSize: 13,
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loadMoreButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
