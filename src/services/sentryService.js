import { Platform } from 'react-native';
import Constants from 'expo-constants';

// @sentry/react-native is native-only — skip on web
let Sentry = null;
if (Platform.OS !== 'web') {
  try {
    Sentry = require('@sentry/react-native');
  } catch (e) {
    console.warn('[Sentry] Not available:', e.message);
  }
}

// DSN comes from EAS Secrets in production, .env in local dev
const SENTRY_DSN = Constants.expoConfig?.extra?.sentryDsn ?? '';

export function initSentry() {
  if (!Sentry || !SENTRY_DSN) {
    console.log('[Sentry] No DSN configured or not available, skipping initialization');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    debug: __DEV__,
    enabled: !__DEV__,
    tracesSampleRate: 0.2,
    environment: __DEV__ ? 'development' : 'production',
  });
}

export function captureError(error, context) {
  if (!Sentry || !SENTRY_DSN) return;

  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

export function setUser(user) {
  if (!Sentry || !SENTRY_DSN) return;

  if (user) {
    Sentry.setUser({ id: user.uid, email: user.email });
  } else {
    Sentry.setUser(null);
  }
}

export { Sentry };
