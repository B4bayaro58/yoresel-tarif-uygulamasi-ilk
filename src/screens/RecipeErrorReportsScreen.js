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
import { AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react-native';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useApp } from '../contexts/AppContext';

// Kullanıcıların tarif detayından gönderdiği "Hata Bildir" kayıtları
// (ReportRecipeErrorScreen.js / web /hata-bildir). "Çözüldü" kaydı siler --
// koleksiyon sadece açık işleri tutuyor. Sayfalı, ReportedReviewsScreen ile aynı.
const PAGE_SIZE = 50;

const formatDate = (ts) => {
  if (!ts?.seconds) return '';
  return new Date(ts.seconds * 1000).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function RecipeErrorReportsScreen({ navigation }) {
  const { colors, translate } = useApp();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const lastDocRef = useRef(null);

  useEffect(() => {
    loadPage(false);
  }, []);

  const loadPage = async (more) => {
    try {
      more ? setLoadingMore(true) : setLoading(true);
      const parts = [collection(db, 'recipeErrorReports'), orderBy('createdAt', 'desc')];
      if (more && lastDocRef.current) parts.push(startAfter(lastDocRef.current));
      parts.push(limit(PAGE_SIZE));
      const snapshot = await getDocs(query(...parts));
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setReports(prev => (more ? [...prev, ...loaded] : loaded));
      lastDocRef.current = snapshot.docs[snapshot.docs.length - 1] ?? null;
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      Alert.alert(translate('error'), error.message);
    } finally {
      more ? setLoadingMore(false) : setLoading(false);
    }
  };

  const handleResolve = (report) => {
    Alert.alert(translate('markResolved'), translate('markResolvedConfirm'), [
      { text: translate('cancel'), style: 'cancel' },
      {
        text: translate('markResolved'),
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'recipeErrorReports', report.id));
            setReports(prev => prev.filter(r => r.id !== report.id));
          } catch (error) {
            Alert.alert(translate('error'), error.message);
          }
        },
      },
    ]);
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
        <Text style={[styles.title, { color: colors.text }]}>{translate('recipeErrorReports')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {translate('recipeErrorReportsDesc')}
        </Text>
      </View>

      <ScrollView style={styles.list}>
        {reports.length === 0 ? (
          <View style={styles.emptyState}>
            <AlertTriangle size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {translate('noRecipeErrorReports')}
            </Text>
          </View>
        ) : (
          reports.map(report => (
            <View
              key={report.id}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.recipeName, { color: colors.text }]}>
                {report.recipeName || report.recipeId}
              </Text>
              <Text style={[styles.meta, { color: colors.textTertiary }]}>
                {[report.userName, report.userEmail].filter(Boolean).join(' · ')}
              </Text>
              <Text style={[styles.meta, { color: colors.textTertiary }]}>
                {formatDate(report.createdAt)} · {report.platform}
              </Text>
              <Text style={[styles.message, { color: colors.textSecondary }]}>{report.message}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#3B82F620' }]}
                  onPress={() => navigation.navigate('RecipeDetail', { recipeId: report.recipeId })}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`${translate('openRecipe')} - ${report.recipeName}`}
                >
                  <ExternalLink size={15} color="#3B82F6" />
                  <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>
                    {translate('openRecipe')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#10B98120' }]}
                  onPress={() => handleResolve(report)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`${translate('markResolved')} - ${report.recipeName}`}
                >
                  <CheckCircle2 size={15} color="#10B981" />
                  <Text style={[styles.actionButtonText, { color: '#10B981' }]}>
                    {translate('markResolved')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {hasMore && (
          <TouchableOpacity
            style={[styles.loadMoreButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => loadPage(true)}
            disabled={loadingMore}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Daha Fazla Yükle"
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
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    gap: 4,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    fontSize: 12,
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
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
