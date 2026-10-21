import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Star } from 'lucide-react-native';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

// Yalnızca anonim yıldız puanı: yorum metni, ad ve fotoğraf yok. Kullanıcıların
// herkese açık içerik paylaşmaması uygulamayı 5651 ek 4'teki "sosyal ağ
// sağlayıcı" tanımının (ve 15 yaş/yaş doğrulama yükümlülüklerinin) dışında
// tutuyor -- yorum/şikâyet/engelleme özellikleri bu yüzden kaldırıldı.
function StarRating({ value, onChange, size = 28, readonly = false }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map(star => (
        <TouchableOpacity
          key={star}
          onPress={() => !readonly && onChange?.(star)}
          disabled={readonly}
          activeOpacity={readonly ? 1 : 0.7}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
          {...(!readonly ? {
            accessibilityRole: 'button',
            accessibilityLabel: `${star} yıldız`,
            accessibilityState: { selected: star <= value },
          } : {})}
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

  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [myRating, setMyRating] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const isMountedRef = React.useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    loadRatings();
    return () => { isMountedRef.current = false; };
  }, [recipe.id, user?.uid]);

  useEffect(() => {
    if (!user) { setIsBlocked(false); return; }
    getDoc(doc(db, 'users', user.uid))
      .then(snap => setIsBlocked(snap.exists() && snap.data().isBlocked === true))
      .catch(() => setIsBlocked(false));
  }, [user]);

  const loadRatings = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(
        query(collection(db, 'reviews'), where('recipeId', '==', recipe.id))
      );
      if (!isMountedRef.current) return;
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setRatings(loaded);
      const mine = user ? loaded.find(r => r.userId === user.uid) : null;
      setMyRating(mine || null);
      setRating(mine ? mine.rating : 0);
    } catch (error) {
      console.error('Error loading ratings:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Giriş Gerekli', 'Puan vermek için giriş yapmalısınız.');
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
      if (myRating) {
        await updateDoc(doc(db, 'reviews', myRating.id), {
          rating,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'reviews'), {
          recipeId: recipe.id,
          userId: user.uid,
          rating,
          createdAt: serverTimestamp(),
        });

        // Update average rating on the recipe (Firebase recipes only).
        // Separate try/catch: the rating itself is already saved, so a
        // failure here shouldn't surface as an error and invite a duplicate.
        if (recipe.isFirebase) {
          try {
            const newCount = ratings.length + 1;
            const newAvg = ((recipe.rating || 0) * ratings.length + rating) / newCount;
            await updateDoc(doc(db, 'recipes', recipe.id), {
              rating: parseFloat(newAvg.toFixed(1)),
              reviewCount: increment(1),
            });
          } catch (error) {
            console.error('Error updating recipe average rating:', error);
          }
        }
      }
      await loadRatings();
    } catch (error) {
      Alert.alert('Hata', 'Puan kaydedilemedi: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Puanlar</Text>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : avgRating ? (
          <View style={styles.avgRow}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Text style={[styles.avgText, { color: colors.text }]}>
              {avgRating} ({ratings.length} puan)
            </Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.formLabel, { color: colors.text }]}>
          {myRating ? 'Puanınızı güncelleyin' : 'Bu tarifi puanlayın'}
        </Text>
        <StarRating value={rating} onChange={setRating} />
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: submitting ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={myRating ? translate('update') : 'Puanla'}
        >
          {submitting ? <ActivityIndicator size="small" color="#fff" /> : null}
          <Text style={styles.submitBtnText}>
            {submitting ? 'Kaydediliyor...' : myRating ? 'Güncelle' : 'Puanla'}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.note, { color: colors.textTertiary }]}>
          Puanlar anonimdir; adınız gösterilmez.
        </Text>
      </View>
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
  note: {
    fontSize: 12,
    textAlign: 'center',
  },
});
