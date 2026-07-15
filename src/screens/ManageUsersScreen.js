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
import { Users, Shield, UserX, Search } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { collection, getDocs, query, orderBy, limit, startAfter, documentId, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Kullanıcı sayısı büyüdükçe her ekran açılışında TÜM `users` koleksiyonunu
// limitsiz okumak maliyeti sınırsız büyütür. `documentId()` üzerinden
// sayfalanıyor (createdAt gibi bir alan üzerinden değil) çünkü her dokümanın
// ID'si garanti var — eski bir kullanıcı dokümanında createdAt eksikse
// orderBy(createdAt) o kullanıcıyı listeden sessizce düşürürdü.
const PAGE_SIZE = 100;

export default function ManageUsersScreen() {
  const { colors, translate } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastDocRef = useRef(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(
        query(collection(db, 'users'), orderBy(documentId()), limit(PAGE_SIZE))
      );
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      lastDocRef.current = usersSnapshot.docs[usersSnapshot.docs.length - 1] ?? null;
      setHasMore(usersSnapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
      Alert.alert(translate('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreUsers = async () => {
    if (!lastDocRef.current) return;
    try {
      setLoadingMore(true);
      const usersSnapshot = await getDocs(
        query(collection(db, 'users'), orderBy(documentId()), startAfter(lastDocRef.current), limit(PAGE_SIZE))
      );
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(prev => [...prev, ...usersData]);
      lastDocRef.current = usersSnapshot.docs[usersSnapshot.docs.length - 1] ?? null;
      setHasMore(usersSnapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      Alert.alert(translate('error'), error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleToggleAdmin = (user) => {
    const confirmMsg = user.isAdmin
      ? translate('revokeAdminConfirm', { email: user.email })
      : translate('grantAdminConfirm', { email: user.email });
    Alert.alert(
      translate('adminPermission'),
      confirmMsg,
      [
        { text: translate('cancel'), style: 'cancel' },
        {
          text: user.isAdmin ? translate('revoke') : translate('grant'),
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'users', user.id), { isAdmin: !user.isAdmin });
              setUsers(prev =>
                prev.map(u => u.id === user.id ? { ...u, isAdmin: !u.isAdmin } : u)
              );
            } catch (error) {
              Alert.alert(translate('error'), error.message);
            }
          },
        },
      ]
    );
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      translate('deleteUser'),
      translate('deleteUserConfirm', { email: user.email }),
      [
        { text: translate('cancel'), style: 'cancel' },
        {
          text: translate('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', user.id));
              setUsers(prev => prev.filter(u => u.id !== user.id));
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
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {translate('loadingUsers')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{translate('manageUsers')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {translate('usersRegistered', { count: hasMore ? `${users.length}+` : users.length })}
        </Text>
      </View>

      <ScrollView style={styles.list}>
        {users.map((user) => (
          <View
            key={user.id}
            style={[
              styles.userCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.userInfo}>
              <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.avatarText, { color: colors.primary }]}>
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>

              <View style={styles.userDetails}>
                <Text style={[styles.userEmail, { color: colors.text }]}>
                  {user.email}
                </Text>
                <View style={styles.userMeta}>
                  <Text style={[styles.userMetaText, { color: colors.textSecondary }]}>
                    {user.isAdmin ? `👑 ${translate('admin')}` : `👤 ${translate('user')}`}
                  </Text>
                  {user.createdAt && (
                    <Text style={[styles.userMetaText, { color: colors.textTertiary }]}>
                      •{' '}
                      {typeof user.createdAt === 'string'
                        ? new Date(user.createdAt).toLocaleDateString('tr-TR')
                        : new Date(user.createdAt.seconds * 1000).toLocaleDateString('tr-TR')}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: user.isAdmin ? '#F59E0B20' : '#3B82F620' },
                ]}
                onPress={() => handleToggleAdmin(user)}
                activeOpacity={0.7}
              >
                <Shield size={18} color={user.isAdmin ? '#F59E0B' : '#3B82F6'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#EF444420' }]}
                onPress={() => handleDeleteUser(user)}
                activeOpacity={0.7}
              >
                <UserX size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {users.length === 0 && (
          <View style={styles.emptyState}>
            <Users size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {translate('noUsers')}
            </Text>
          </View>
        )}

        {hasMore && !loading && (
          <TouchableOpacity
            style={[styles.loadMoreButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={loadMoreUsers}
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
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  userDetails: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMetaText: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
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
