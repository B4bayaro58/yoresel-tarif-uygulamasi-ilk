// app.config.js — app.json'ın yerini alır.
// Firebase değerleri: lokal geliştirmede .env, production'da EAS Secrets'tan gelir.
// EAS Secrets eklemek için: eas secret:create --name FIREBASE_API_KEY --value "..."
import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: 'Yöresel Tarifler',
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
    buildNumber: '1',
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [],
    },
    infoPlist: {
      NSPhotoLibraryUsageDescription:
        'Tarif fotoğrafı eklemek için fotoğraf galerinize erişim gerekiyor.',
      NSUserNotificationsUsageDescription:
        'Pişirme sayacı ve tarif önerileri için bildirim göndermek istiyoruz.',
    },
  },
  android: {
    package: 'com.cagatay58.yoreseltarifuygulamasi',
    versionCode: 1,
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
            host: 'yoreseltarifler.com',
            pathPrefix: '/recipe',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  scheme: 'yoreseltarifler',
  owner: 'cagatay58',
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
  },
});
