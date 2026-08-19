// app.config.js — app.json'ın yerini alır.
// Firebase değerleri: lokal geliştirmede .env, production'da EAS Secrets'tan gelir.
// EAS Secrets eklemek için: eas secret:create --name FIREBASE_API_KEY --value "..."
import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: 'Yöresel Tarif',
  slug: 'yoresel-tarif-uygulamasi',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  platforms: ['ios', 'android', 'web'],
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#E86C2C',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.cagatay58.yoreseltarifuygulamasi',
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [],
    },
    infoPlist: {
      NSPhotoLibraryUsageDescription:
        'Tarif fotoğrafı eklemek için fotoğraf galerinize erişim gerekiyor.',
      NSUserNotificationsUsageDescription:
        'Pişirme sayacı ve tarif önerileri için bildirim göndermek istiyoruz.',
      // Uygulama standart HTTPS/TLS dışında özel bir şifreleme kullanmıyor --
      // bu olmadan her TestFlight/App Store yüklemesinde App Store Connect'te
      // elle "export compliance" sorusu cevaplanması gerekiyordu.
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.cagatay58.yoreseltarifuygulamasi',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#E86C2C',
    },
    edgeToEdgeEnabled: true,
    permissions: [
      'android.permission.INTERNET',
      'android.permission.VIBRATE',
    ],
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'yoreseltarif.com',
            pathPrefix: '/recipe',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  scheme: 'yoreseltarif',
  owner: 'cagatay58',
  plugins: [
    [
      'react-native-google-mobile-ads',
      {
        // AdMob hesabı kurulana kadar Google'ın resmi test App ID'leri kullanılır.
        androidAppId: process.env.ADMOB_ANDROID_APP_ID || 'ca-app-pub-3940256099942544~3347511713',
        iosAppId: process.env.ADMOB_IOS_APP_ID || 'ca-app-pub-3940256099942544~1458002511',
        userTrackingUsageDescription:
          'Reklamların ilginizi çekebilecek içerikler göstermesi için kullanım verilerinizi kullanabiliriz.',
      },
    ],
    [
      '@react-native-google-signin/google-signin',
      {
        // Bu proje @react-native-firebase değil, JS Firebase SDK'sı kullanıyor
        // (google-services.json/GoogleService-Info.plist yok) -- bu yüzden
        // plugin'in "Firebase config dosyasından oku" moduna değil,
        // iosUrlScheme ile "Firebase'siz" moduna giriyoruz. iOS OAuth client
        // ID'si oluşturulana kadar geçerli-format bir placeholder kullanılır
        // (gerçek değer olmadan prebuild "geçersiz format" hatasıyla çöküyor).
        iosUrlScheme:
          process.env.GOOGLE_IOS_URL_SCHEME ||
          'com.googleusercontent.apps.000000000000-placeholder',
      },
    ],
    'expo-dev-client',
  ],
  extra: {
    eas: {
      projectId: 'c017d1d9-fffd-4ec4-a617-292ae9de5487',
    },
    // Firebase config — EAS Secrets üzerinden gelir, lokal'de .env'den
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
    firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    sentryDsn: process.env.SENTRY_DSN,
    // AdMob ad unit ID'leri — AdMob hesabı kurulup gerçek ID'ler EAS Secrets'a
    // eklenene kadar boş kalır, src/constants/adUnits.js test ID'lerine düşer.
    admobBannerIdAndroid: process.env.ADMOB_BANNER_ID_ANDROID,
    admobBannerIdIos: process.env.ADMOB_BANNER_ID_IOS,
    admobInterstitialIdAndroid: process.env.ADMOB_INTERSTITIAL_ID_ANDROID,
    admobInterstitialIdIos: process.env.ADMOB_INTERSTITIAL_ID_IOS,
    admobRewardedIdAndroid: process.env.ADMOB_REWARDED_ID_ANDROID,
    admobRewardedIdIos: process.env.ADMOB_REWARDED_ID_IOS,
    // RevenueCat API key'leri — Android hesabı kurulunca dolacak, iOS Apple
    // Developer Program kaydı yapılana kadar boş kalır (purchasesService.js
    // eksik key'de sessizce no-op yapar).
    revenueCatApiKeyAndroid: process.env.REVENUECAT_ANDROID_API_KEY,
    revenueCatApiKeyIos: process.env.REVENUECAT_IOS_API_KEY,
    // Google ile giriş — Firebase Console > Authentication > Sign-in method >
    // Google etkinleştirilince oluşan "Web client ID" + ayrıca oluşturulacak
    // iOS OAuth client ID. İkisi de boşken googleAuthService.js sessizce no-op
    // yapar (buton gösterilmez), AdMob/RevenueCat ile aynı desen.
    googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
    googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
  },
});
