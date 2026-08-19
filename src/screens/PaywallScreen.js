import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, X, Sparkles, Tag, Users, UtensilsCrossed, CheckCircle2, Circle, ShieldCheck } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { useSubscription } from '../contexts/SubscriptionContext';

const HERO_GRADIENT = ['#FF7A5C', '#E8432A'];

const PAYWALL_FEATURES = [
  { key: 'adFreeExperience', descKey: 'adFreeExperienceDesc', Icon: Sparkles },
  { key: 'shoppingCategoriesFeature', descKey: 'shoppingCategoriesFeatureDesc', Icon: Tag },
  { key: 'portionScalingFeature', descKey: 'portionScalingFeatureDesc', Icon: Users },
  { key: 'personalMenuFeature', descKey: 'personalMenuFeatureDesc', Icon: UtensilsCrossed },
];

export default function PaywallScreen() {
  const navigation = useNavigation();
  const { colors, translate, showNotification } = useApp();
  const { isPremium, isLoading, offerings, purchasePackage, restorePurchases } = useSubscription();
  const [purchasing, setPurchasing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const packages = offerings?.current?.availablePackages || [];
  const monthlyPkg = packages.find(p => p.packageType === 'MONTHLY');
  const annualPkg = packages.find(p => p.packageType === 'ANNUAL');

  // Paketler yüklenince varsayılan olarak yıllığı (yoksa ilk paketi) seçili getir
  useEffect(() => {
    if (!selectedId && packages.length > 0) {
      setSelectedId((annualPkg || packages[0]).identifier);
    }
  }, [packages, annualPkg, selectedId]);

  const savingsPercent = useMemo(() => {
    const monthlyPrice = monthlyPkg?.product?.price;
    const annualPrice = annualPkg?.product?.price;
    if (!monthlyPrice || !annualPrice) return null;
    const pct = Math.round((1 - annualPrice / (monthlyPrice * 12)) * 100);
    return pct > 0 ? pct : null;
  }, [monthlyPkg, annualPkg]);

  const selectedPackage = packages.find(p => p.identifier === selectedId);

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    setPurchasing(true);
    try {
      await purchasePackage(selectedPackage);
      showNotification(translate('purchaseSuccess'));
      navigation.goBack();
    } catch (e) {
      if (!e.userCancelled) {
        showNotification(translate('purchaseError'));
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    try {
      const info = await restorePurchases();
      const restored = !!info.entitlements.active.premium;
      showNotification(translate(restored ? 'restoreSuccess' : 'restoreNoneFound'));
      if (restored) navigation.goBack();
    } catch {
      showNotification(translate('purchaseError'));
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={HERO_GRADIENT} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel={translate('close')}
        >
          <X color="#FFFFFF" size={20} />
        </TouchableOpacity>

        <View style={styles.crownBadge}>
          <Crown color="#FFFFFF" size={32} />
        </View>
        <Text style={styles.heroTitle}>{translate('paywallTitle')}</Text>
        <Text style={styles.heroSubtitle}>{translate('paywallSubtitle')}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.featureList}>
          {PAYWALL_FEATURES.map(({ key, descKey, Icon }) => (
            <View key={key} style={styles.featureRow}>
              <View style={[styles.featureIconCircle, { backgroundColor: colors.primary + '18' }]}>
                <Icon color={colors.primary} size={20} />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>{translate(key)}</Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                  {translate(descKey)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {isPremium ? (
          <View style={[styles.activeBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Crown color={colors.primary} size={22} />
            <Text style={[styles.activeText, { color: colors.primary }]}>
              {translate('premiumActive')}
            </Text>
          </View>
        ) : isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loading} />
        ) : packages.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {translate('paywallUnavailable')}
          </Text>
        ) : (
          <View style={styles.packageList}>
            {packages.map((pkg) => {
              const isAnnual = pkg.packageType === 'ANNUAL';
              const isSelected = pkg.identifier === selectedId;
              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[
                    styles.packageCard,
                    { backgroundColor: colors.card, borderColor: isSelected ? colors.primary : colors.border },
                    isSelected && styles.packageCardSelected,
                  ]}
                  onPress={() => setSelectedId(pkg.identifier)}
                  disabled={purchasing}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  {isAnnual && savingsPercent && (
                    <View style={[styles.bestValueRibbon, { backgroundColor: colors.primary }]}>
                      <Text style={styles.bestValueRibbonText}>{translate('bestValueBadge')}</Text>
                    </View>
                  )}
                  <View style={styles.packageRow}>
                    {isSelected ? (
                      <CheckCircle2 color={colors.primary} size={22} />
                    ) : (
                      <Circle color={colors.textSecondary} size={22} />
                    )}
                    <View style={styles.packageTextWrap}>
                      <Text style={[styles.packageTitle, { color: colors.text }]}>
                        {isAnnual ? translate('subscribeYearly') : translate('subscribeMonthly')}
                      </Text>
                      {isAnnual && savingsPercent && (
                        <Text style={[styles.packageSavings, { color: colors.success }]}>
                          {translate('saveBadge', { percent: savingsPercent })}
                        </Text>
                      )}
                    </View>
                    <Text style={[styles.packagePrice, { color: colors.text }]}>
                      {pkg.product.priceString}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {!isPremium && packages.length > 0 && (
          <View style={styles.trustRow}>
            <ShieldCheck color={colors.textSecondary} size={14} />
            <Text style={[styles.trustText, { color: colors.textSecondary }]}>
              {translate('cancelAnytime')} · {translate(Platform.OS === 'ios' ? 'securePaymentIOS' : 'securePayment')}
            </Text>
          </View>
        )}

        {!isPremium && (
          <TouchableOpacity onPress={handleRestore} disabled={purchasing} style={styles.restoreButton}>
            <Text style={[styles.restoreText, { color: colors.textSecondary }]}>
              {translate('restorePurchases')}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {!isPremium && packages.length > 0 && (
        <View style={[styles.ctaBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity
            onPress={handlePurchase}
            disabled={purchasing || !selectedPackage}
            accessibilityRole="button"
            accessibilityLabel={translate('paywallCta')}
          >
            <LinearGradient
              colors={HERO_GRADIENT}
              style={[styles.ctaButton, purchasing && { opacity: 0.7 }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {purchasing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.ctaButtonText}>{translate('paywallCta')}</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} disabled={purchasing} style={styles.notNowButton}>
            <Text style={[styles.notNowText, { color: colors.textSecondary }]}>{translate('notNow')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 32,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  body: { flex: 1 },
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  featureList: {
    gap: 18,
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  featureIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextWrap: { flex: 1 },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  packageList: {
    gap: 12,
    marginBottom: 16,
  },
  packageCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    paddingTop: 20,
  },
  packageCardSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  bestValueRibbon: {
    position: 'absolute',
    top: -10,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  bestValueRibbonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  packageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  packageTextWrap: { flex: 1 },
  packageTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  packageSavings: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  packagePrice: {
    fontSize: 17,
    fontWeight: '800',
  },
  loading: {
    marginVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 24,
  },
  activeBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  activeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  trustText: {
    fontSize: 12,
  },
  restoreButton: {
    alignSelf: 'center',
    padding: 8,
  },
  restoreText: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  ctaBar: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 28 : 18,
  },
  ctaButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  notNowButton: {
    alignItems: 'center',
    paddingTop: 10,
  },
  notNowText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
