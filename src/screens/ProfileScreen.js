import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Globe, Palette, Settings, LogOut, User as UserIcon, ChevronRight, Trash2, Shield, Camera } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { getRank, getNextRank, RANKS } from '../constants/ranks';
import { TRAVEL_BADGES, getEarnedBadges, getNextBadge } from '../constants/badges';
import { pickAvatarImage, uploadRecipeImage } from '../services/imageUploadService';
import { updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';

const THEMES = [
  { value: 'light', icon: '☀️' },
  { value: 'dark', icon: '🌙' },
];

const CONTINENT_COLORS = {
  europe: '#3F51B5',
  asia: '#F44336',
  africa: '#FF9800',
  'north-america': '#4CAF50',
  'south-america': '#9C27B0',
  'central-america': '#00BCD4',
  oceania: '#009688',
  'turkish-cuisine': '#C0392B',
  unknown: '#607D8B',
};

const CONTINENT_EMOJIS = {
  europe: '🇪🇺',
  asia: '🌏',
  africa: '🌍',
  'north-america': '🌎',
  'south-america': '🌎',
  'central-america': '🌎',
  oceania: '🏝️',
  'turkish-cuisine': '🇹🇷',
  unknown: '🌐',
};

function PassportStamp({ country, continent }) {
  const color = CONTINENT_COLORS[continent] || CONTINENT_COLORS.unknown;
  const emoji = CONTINENT_EMOJIS[continent] || '🌐';
  return (
    <View style={[stampStyles.stamp, { borderColor: color }]}>
      <View style={[stampStyles.innerRing, { borderColor: color + '60' }]}>
        <Text style={stampStyles.stampEmoji}>{emoji}</Text>
        <Text style={[stampStyles.stampCountry, { color }]} numberOfLines={2} adjustsFontSizeToFit>
          {country}
        </Text>
      </View>
    </View>
  );
}

const stampStyles = StyleSheet.create({
  stamp: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    padding: 4,
  },
  innerRing: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  stampEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  stampCountry: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default function ProfileScreen({ navigation }) {
  const { colors, translate, theme, setTheme, showNotification, completedRecipesCount, completedCountries, language } = useApp();
  const { user, isAdmin, isGuest, logout, deleteAccount } = useAuth();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const currentRank = getRank(completedRecipesCount, language);
  const nextRank = getNextRank(completedRecipesCount, language);
  const progressToNext = nextRank
    ? (completedRecipesCount - currentRank.minCount) / (nextRank.minCount - currentRank.minCount)
    : 1;

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      showNotification(translate('logoutSuccess'));
    } else {
      showNotification(translate('logoutError'));
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return;
    setDeleteLoading(true);
    const result = await deleteAccount(deletePassword);
    setDeleteLoading(false);
    if (result.success) {
      showNotification(translate('deleteAccountSuccess'));
      setShowDeleteModal(false);
    } else {
      showNotification(translate(result.error));
    }
  };

  const handlePickProfilePhoto = async () => {
    if (isGuest) return;
    const result = await pickAvatarImage();
    if (!result.success) return;
    setPhotoLoading(true);
    const upload = await uploadRecipeImage(result.uri, `profile_${user.uid}`);
    setPhotoLoading(false);
    if (upload.success) {
      try {
        await updateProfile(auth.currentUser, { photoURL: upload.url });
        showNotification(translate('photoUpdated'));
      } catch {
        showNotification(translate('photoUpdateFailed'));
      }
    } else {
      showNotification(translate('photoUpdateFailed'));
    }
  };

  const handleThemeChange = (value) => {
    setTheme(value);
    setShowThemeModal(false);
    showNotification(translate(value === 'light' ? 'lightMode' : 'darkMode'));
  };

  const currentTheme = THEMES.find(t => t.value === theme);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Guest Sign-Up Banner */}
      {isGuest && (
        <TouchableOpacity
          style={[styles.guestBanner, { backgroundColor: colors.primary }]}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={styles.guestBannerEmoji}>🌟</Text>
          <View style={styles.guestBannerText}>
            <Text style={styles.guestBannerTitle}>{translate('guestBannerTitle')}</Text>
            <Text style={styles.guestBannerDesc}>{translate('guestBannerDesc')}</Text>
          </View>
          <View style={styles.guestBannerBtn}>
            <Text style={styles.guestBannerBtnText}>{translate('signUpNow')}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* User Info Section */}
      <View style={[styles.userSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={handlePickProfilePhoto}
          activeOpacity={isGuest ? 1 : 0.8}
          disabled={isGuest}
        >
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.avatarImage}
              contentFit="cover"
              cachePolicy="disk"
            />
          ) : (
            <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
              <UserIcon size={32} color={colors.primary} />
            </View>
          )}
          {!isGuest && (
            <View style={[styles.avatarCameraBadge, { backgroundColor: colors.primary }]}>
              {photoLoading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Camera size={12} color="#fff" />}
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {isGuest ? translate('guestUser') : (user?.displayName || translate('user'))}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {isGuest ? translate('continueAsGuest') : user?.email}
          </Text>
          {isAdmin && (
            <View style={[styles.adminBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.adminBadgeText}>👑 Admin</Text>
            </View>
          )}
        </View>
      </View>

      {/* Rank Card */}
      <View style={[styles.rankCard, { backgroundColor: colors.card, borderColor: currentRank.color + '60' }]}>
        <View style={styles.rankHeader}>
          <Text style={styles.rankEmoji}>{currentRank.emoji}</Text>
          <View style={styles.rankInfo}>
            <Text style={[styles.rankTitle, { color: currentRank.color }]}>
              {currentRank.titleText}
            </Text>
            <Text style={[styles.rankSub, { color: colors.textSecondary }]}>
              {completedRecipesCount} tarif tamamlandı
            </Text>
          </View>
          {!nextRank && (
            <View style={[styles.maxBadge, { backgroundColor: currentRank.color + '20' }]}>
              <Text style={[styles.maxBadgeText, { color: currentRank.color }]}>MAX</Text>
            </View>
          )}
        </View>

        {nextRank && (
          <View style={styles.progressSection}>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.round(progressToNext * 100)}%`, backgroundColor: currentRank.color },
                ]}
              />
            </View>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
              {nextRank.emoji} {nextRank.titleText} için {nextRank.minCount - completedRecipesCount} tarif daha
            </Text>
          </View>
        )}

        {/* Rank milestones */}
        <View style={styles.milestones}>
          {RANKS.map((r, i) => (
            <View key={r.id} style={styles.milestone}>
              <Text style={[
                styles.milestoneEmoji,
                completedRecipesCount < r.minCount && styles.milestoneInactive,
              ]}>
                {r.emoji}
              </Text>
              {i < RANKS.length - 1 && (
                <View style={[
                  styles.milestoneLine,
                  { backgroundColor: completedRecipesCount >= RANKS[i + 1].minCount ? r.color : colors.border },
                ]} />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Passport Section */}
      <View style={[styles.passportCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.passportTitleRow}>
          <Text style={styles.passportIcon}>📔</Text>
          <View>
            <Text style={[styles.passportTitle, { color: colors.text }]}>Pasaportum</Text>
            <Text style={[styles.passportSub, { color: colors.textSecondary }]}>
              {completedCountries.size > 0
                ? `${completedCountries.size} ülke keşfedildi`
                : 'Henüz hiç ülke keşfedilmedi'}
            </Text>
          </View>
        </View>

        {completedCountries.size === 0 ? (
          <View style={styles.passportEmpty}>
            <Text style={styles.passportEmptyEmoji}>🗺️</Text>
            <Text style={[styles.passportEmptyText, { color: colors.textSecondary }]}>
              Bir tarifteki tüm adımları tamamla{'\n'}ve damganı kazan!
            </Text>
          </View>
        ) : (
          <View style={styles.stampsGrid}>
            {Array.from(completedCountries.entries()).map(([country, continent]) => (
              <PassportStamp key={country} country={country} continent={continent} />
            ))}
          </View>
        )}

        {/* Travel Badges */}
        <View style={[styles.badgesDivider, { backgroundColor: colors.border }]} />
        <Text style={[styles.badgesSectionTitle, { color: colors.textSecondary }]}>
          SEYAHAT ROZETLERİ
        </Text>
        <View style={styles.badgesList}>
          {TRAVEL_BADGES.map(badge => {
            const earned = completedCountries.size >= badge.requiredCountries;
            const nextBadge = getNextBadge(completedCountries.size);
            const isNext = nextBadge?.id === badge.id;
            return (
              <View
                key={badge.id}
                style={[
                  styles.badgeRow,
                  { borderColor: earned ? badge.color + '40' : colors.border },
                  earned && { backgroundColor: badge.color + '12' },
                ]}
              >
                <View style={[
                  styles.badgeEmojiContainer,
                  { backgroundColor: earned ? badge.color + '25' : colors.border + '80' },
                  !earned && styles.badgeLocked,
                ]}>
                  <Text style={[styles.badgeEmoji, !earned && styles.badgeEmojiLocked]}>
                    {earned ? badge.emoji : '🔒'}
                  </Text>
                </View>
                <View style={styles.badgeTextBlock}>
                  <Text style={[
                    styles.badgeName,
                    { color: earned ? badge.color : colors.textSecondary },
                  ]}>
                    {badge.title}
                  </Text>
                  <Text style={[styles.badgeDesc, { color: colors.textSecondary }]}>
                    {badge.description}
                  </Text>
                  {!earned && isNext && (
                    <View style={styles.badgeProgressRow}>
                      <View style={[styles.badgeProgressBar, { backgroundColor: colors.border }]}>
                        <View style={[
                          styles.badgeProgressFill,
                          {
                            width: `${Math.min((completedCountries.size / badge.requiredCountries) * 100, 100)}%`,
                            backgroundColor: badge.color,
                          },
                        ]} />
                      </View>
                      <Text style={[styles.badgeProgressLabel, { color: colors.textSecondary }]}>
                        {completedCountries.size}/{badge.requiredCountries}
                      </Text>
                    </View>
                  )}
                </View>
                {earned && (
                  <View style={[styles.earnedBadge, { backgroundColor: badge.color }]}>
                    <Text style={styles.earnedBadgeText}>✓</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {translate('settings')}
        </Text>

        {/* Language Setting — Coming Soon */}
        <View
          style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border, opacity: 0.6 }]}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Globe color={colors.primary} size={20} />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                {translate('language')}
              </Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                {translate('comingSoon')}
              </Text>
            </View>
          </View>
          <View style={[styles.comingSoonBadge, { backgroundColor: colors.primary + '25' }]}>
            <Text style={[styles.comingSoonText, { color: colors.primary }]}>
              {translate('comingSoon')}
            </Text>
          </View>
        </View>

        {/* Theme Setting */}
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setShowThemeModal(true)}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Palette color={colors.primary} size={20} />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                {translate('theme')}
              </Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                {currentTheme.icon} {translate(theme === 'light' ? 'lightMode' : 'darkMode')}
              </Text>
            </View>
          </View>
          <ChevronRight color={colors.textSecondary} size={20} />
        </TouchableOpacity>

        {/* Other Settings */}
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => showNotification(translate('comingSoon'))}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Settings color={colors.primary} size={20} />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                {translate('otherSettings')}
              </Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                {translate('comingSoon')}
              </Text>
            </View>
          </View>
          <ChevronRight color={colors.textSecondary} size={20} />
        </TouchableOpacity>

        {/* Privacy Policy */}
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Shield color={colors.primary} size={20} />
            </View>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              {translate('privacyPolicy')}
            </Text>
          </View>
          <ChevronRight color={colors.textSecondary} size={20} />
        </TouchableOpacity>

        {/* Terms of Service */}
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.navigate('TermsOfService')}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Settings color={colors.primary} size={20} />
            </View>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              {translate('termsOfService')}
            </Text>
          </View>
          <ChevronRight color={colors.textSecondary} size={20} />
        </TouchableOpacity>

        {/* Suggest Recipe Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.primary, marginBottom: 12 }]}
          onPress={() => navigation.navigate('AddRecipe')}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>🍽️ {translate('suggestRecipe')}</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#FFFFFF" />
          <Text style={styles.logoutButtonText}>
            {isGuest ? translate('loginButton') : translate('logout')}
          </Text>
        </TouchableOpacity>

        {/* Delete Account Button — sadece giriş yapmış gerçek kullanıcılara göster */}
        {!isGuest && user && (
          <TouchableOpacity
            style={[styles.deleteAccountButton, { borderColor: colors.error }]}
            onPress={() => { setDeletePassword(''); setShowDeleteModal(true); }}
          >
            <Trash2 size={16} color={colors.error} />
            <Text style={[styles.deleteAccountText, { color: colors.error }]}>
              {translate('deleteAccount')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.deleteModalIcon}>
              <Trash2 size={32} color={colors.error} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {translate('deleteAccountConfirmTitle')}
            </Text>
            <Text style={[styles.deleteWarningText, { color: colors.textSecondary }]}>
              {translate('deleteAccountWarning')}
            </Text>
            <TextInput
              style={[styles.deletePasswordInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder={translate('enterPasswordToConfirm')}
              placeholderTextColor={colors.textTertiary}
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
              autoCorrect={false}
              spellCheck={false}
            />
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalBtn, { backgroundColor: colors.border }]}
                onPress={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                <Text style={[styles.deleteModalBtnText, { color: colors.text }]}>
                  {translate('cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteModalBtn, { backgroundColor: colors.error }, (!deletePassword || deleteLoading) && { opacity: 0.5 }]}
                onPress={handleDeleteAccount}
                disabled={!deletePassword || deleteLoading}
              >
                {deleteLoading
                  ? <ActivityIndicator size="small" color="#FFFFFF" />
                  : <Text style={[styles.deleteModalBtnText, { color: '#FFFFFF' }]}>{translate('confirm')}</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Theme Modal */}
      <Modal
        visible={showThemeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {translate('changeTheme')}
            </Text>
            {THEMES.map((themeOption) => (
              <TouchableOpacity
                key={themeOption.value}
                style={[
                  styles.modalItem,
                  { borderColor: colors.border },
                  theme === themeOption.value && { backgroundColor: colors.primary + '20' },
                ]}
                onPress={() => handleThemeChange(themeOption.value)}
              >
                <Text style={[styles.modalItemText, { color: colors.text }]}>
                  {themeOption.icon} {translate(themeOption.value === 'light' ? 'lightMode' : 'darkMode')}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: colors.border }]}
              onPress={() => setShowThemeModal(false)}
            >
              <Text style={[styles.modalCloseText, { color: colors.text }]}>
                {translate('close')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  guestBannerEmoji: {
    fontSize: 28,
  },
  guestBannerText: {
    flex: 1,
  },
  guestBannerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 3,
  },
  guestBannerDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    lineHeight: 17,
  },
  guestBannerBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  guestBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    marginRight: 16,
    position: 'relative',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  adminBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rankCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  rankEmoji: {
    fontSize: 36,
  },
  rankInfo: {
    flex: 1,
  },
  rankTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  rankSub: {
    fontSize: 13,
  },
  maxBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  maxBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
  },
  milestones: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  milestone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneEmoji: {
    fontSize: 20,
  },
  milestoneInactive: {
    opacity: 0.3,
  },
  milestoneLine: {
    width: 18,
    height: 2,
    marginHorizontal: 2,
  },
  passportCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  passportTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  passportIcon: {
    fontSize: 28,
  },
  passportTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  passportSub: {
    fontSize: 12,
    marginTop: 2,
  },
  passportEmpty: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  passportEmptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  passportEmptyText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  stampsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 4,
  },
  badgesDivider: {
    height: 1,
    marginVertical: 14,
  },
  badgesSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  badgesList: {
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  badgeEmojiContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeEmoji: {
    fontSize: 22,
  },
  badgeEmojiLocked: {
    fontSize: 18,
  },
  badgeTextBlock: {
    flex: 1,
  },
  badgeName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  badgeDesc: {
    fontSize: 12,
  },
  badgeProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  badgeProgressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  badgeProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  badgeProgressLabel: {
    fontSize: 11,
    fontWeight: '600',
    minWidth: 32,
    textAlign: 'right',
  },
  earnedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnedBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalCloseButton: {
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  comingSoonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  deleteAccountText: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteModalIcon: {
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteWarningText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  deletePasswordInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 20,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteModalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModalBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
