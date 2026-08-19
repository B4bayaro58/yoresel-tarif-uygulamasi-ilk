import React, { createContext, useContext, useEffect, useState } from 'react';
import Purchases from 'react-native-purchases';
import { useAuth } from './AuthContext';
import { configurePurchases, loginPurchases, logoutPurchases } from '../services/purchasesService';

const SubscriptionContext = createContext(null);

export const useSubscription = () => useContext(SubscriptionContext);

const ENTITLEMENT_ID = 'premium';

export function SubscriptionProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [offerings, setOfferings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    configurePurchases();

    const listener = (info) => setIsPremium(!!info.entitlements.active[ENTITLEMENT_ID]);
    Purchases.addCustomerInfoUpdateListener(listener);

    Purchases.getCustomerInfo()
      .then(listener)
      .catch(() => {})
      .finally(() => setIsLoading(false));

    Purchases.getOfferings()
      .then(setOfferings)
      .catch(() => {});

    return () => Purchases.removeCustomerInfoUpdateListener(listener);
  }, []);

  useEffect(() => {
    // Firebase oturumu henüz çözülmeden (authLoading) user'ı "çıkış yapılmış"
    // sanıp RevenueCat'i anonime düşürmeyelim -- gerçekten çıkış yapılana kadar bekle.
    if (authLoading) return;
    if (user?.uid) {
      loginPurchases(user.uid);
    } else {
      logoutPurchases();
    }
  }, [user?.uid, authLoading]);

  async function purchasePackage(pkg) {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    setIsPremium(!!customerInfo.entitlements.active[ENTITLEMENT_ID]);
    return customerInfo;
  }

  async function restorePurchases() {
    const customerInfo = await Purchases.restorePurchases();
    setIsPremium(!!customerInfo.entitlements.active[ENTITLEMENT_ID]);
    return customerInfo;
  }

  return (
    <SubscriptionContext.Provider
      value={{ isPremium, isLoading, offerings, purchasePackage, restorePurchases }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
