import Constants from 'expo-constants';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

const extra = Constants.expoConfig?.extra ?? {};

export function configurePurchases() {
  const apiKey = Platform.OS === 'ios' ? extra.revenueCatApiKeyIos : extra.revenueCatApiKeyAndroid;
  if (!apiKey) return; // iOS key henüz yok (Apple Developer kaydı bekleniyor) -- sessizce atla
  Purchases.configure({ apiKey });
}

export async function loginPurchases(uid) {
  try {
    await Purchases.logIn(uid);
  } catch {
    // sessiz fail -- login olamazsa anonim RevenueCat kullanıcısı olarak devam eder
  }
}

export async function logoutPurchases() {
  try {
    await Purchases.logOut();
  } catch {
    // zaten anonimse logOut hata verir, yok sayılabilir
  }
}
