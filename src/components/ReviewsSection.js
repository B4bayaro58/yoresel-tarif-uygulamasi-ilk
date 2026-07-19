import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Star, Send, Flag } from 'lucide-react-native';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

function StarRating({ value, onChange, size = 28, readonly = false }) {
  const { colors } = useApp();
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map(star => (
        <TouchableOpacity
          key={star}
          onPress={() => !readonly && onChange?.(star)}
          disabled={readonly}
          activeOpacity={readonly ? 1 : 0.7}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
        >
          <Star
            size={size}
            color="#FFD700"
            fill={star <= value ? '#FFD700' : 'transparent'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ReviewsSection({ recipe }) {
  const { colors, translate } = useApp();
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userReview, setUserReview] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const isMountedRef = React.useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    loadReviews();
    return () => { isMountedRef.current = false; };
  }, [recipe.id]);

  useEffect(() => {
    if (!user) { setIsBlocked(false); return; }
    getDoc(doc(db, 'users', user.uid))
      .then(snap => setIsBlocked(snap.exists() && snap.data().isBlocked === true))
      .catch(() => setIsBlocked(false));
  }, [user]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'reviews'),
        where('recipeId', '==', recipe.id),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      if (!isMountedRef.current) return;
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setReviews(loaded);

      if (user) {
        const mine = loaded.find(r => r.userId === user.uid);
        if (mine) {
          setUserReview(mine);
          setRating(mine.rating);
          setComment(mine.comment);
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Giriş Gerekli', 'Yorum yapmak için giriş yapmalısınız.');
      return;
    }
    if (isBlocked) {
      Alert.alert(translate('error'), translate('youAreBlockedFromReviews'));
      return;
    }
    if (rating === 0) {
      Alert.alert('Puan Gerekli', 'Lütfen bir puan seçin.');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        recipeId: recipe.id,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
      };

      if (userReview) {
        await updateDoc(doc(db, 'reviews', userReview.id), {
          rating,
          comment: comment.trim(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'reviews'), reviewData);

        // Update average rating on the recipe (Firebase recipes only)
        if (recipe.isFirebase) {
          const newCount = reviews.length + 1;
          const newAvg = ((recipe.rating || 0) * reviews.length + rating) / newCount;
          await updateDoc(doc(db, 'recipes', recipe.id), {
            rating: parseFloat(newAvg.toFixed(1)),
            reviewCount: increment(1),
          });
        }
      }

      setComment('');
      setRating(0);
      setUserReview(null);
      await loadReviews();
    } catch (error) {
      Alert.alert('Hata', 'Yorum gönderilemedi: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = (review) => {
    if (!user) {
      Alert.alert('Giriş Gerekli', 'Şikayet etmek için giriş yapmalısınız.');
      return;
    }
    Alert.alert(
      translate('reportReview'),
      translate('reportReviewConfirm'),
      [
        { text: translate('cancel'), style: 'cancel' },
        {
          text: translate('reportReview'),
          style: 'destructive',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'reviews', review.id), {
                reportedBy: arrayUnion(user.uid),
                reportCount: increment(1),
              });
              setReviews(prev => prev.map(r => r.id === review.id
                ? { ...r, reportedBy: [...(r.reportedBy || []), user.uid] }
                : r));
              Alert.alert(translate('reportReview'), translate('reportSubmitted'));
            } catch (error) {
              Alert.alert(translate('error'), error.message);
            }
          },
        },
      ]
    );
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Yorumlar</Text>
        {avgRating && (
          <View style={styles.avgRow}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Text style={[styles.avgText, { color: colors.text }]}>
              {avgRating} ({reviews.length} yorum)
            </Text>
          </View>
        )}
      </View>

      {/* Add Review Form */}
      <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.formLabel, { color: colors.text }]}>
          {userReview ? 'Yorumunuzu Düzenleyin' : 'Yorum Ekleyin'}
        </Text>
        <StarRating value={rating} onChange={setRating} />
        <TextInput
          style={[styles.commentInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
          placeholder="Tarifinizle ilgili düşüncelerinizi yazın..."
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          value={comment}
          onChangeText={setComment}
          autoCorrect={false}
          spellCheck={false}
        />
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: submitting ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.7}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Send size={18} color="#fff" />
          )}
          <Text style={styles.submitBtnText}>
            {submitting ? 'Gönderiliyor...' : userReview ? 'Güncelle' : 'Gönder'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 16 }} />
      ) : reviews.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Henüz yorum yok. İlk yorumu siz yapın!
        </Text>
      ) : (
        reviews.map(review => {
          const alreadyReported = user && review.reportedBy?.includes(user.uid);
          const isOwnReview = user && review.userId === user.uid;
          return (
            <View
              key={review.id}
              style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.reviewHeader}>
                <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.avatarText, { color: colors.primary }]}>
                    {review.userName?.[0]?.toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.reviewMeta}>
                  <Text style={[styles.reviewUser, { color: colors.text }]}>{review.userName}</Text>
                  <StarRating value={review.rating} size={14} readonly />
                </View>
                {!isOwnReview && (
                  <TouchableOpacity
                    onPress={() => !alreadyReported && handleReport(review)}
                    disabled={alreadyReported}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.reportButton}
                  >
                    <Flag
                      size={16}
                      color={alreadyReported ? colors.textTertiary : colors.textSecondary}
                      fill={alreadyReported ? colors.textTertiary : 'transparent'}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {review.comment ? (
                <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>
                  {review.comment}
                </Text>
              ) : null}
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  avgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avgText: {
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 20,
  },
  reviewCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reportButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  reviewMeta: {
    gap: 2,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
});
