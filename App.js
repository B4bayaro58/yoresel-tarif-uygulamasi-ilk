import React from 'react';
import { View, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { initSentry } from './src/services/sentryService';

// Initialize Sentry error tracking
initSentry();

// Suppress known react-native-svg harmless warning (RN 0.81 + svg 15.x)
LogBox.ignoreLogs(['Unsupported top level event type "topSvgLayout"']);
import { AppProvider, useApp } from './src/contexts/AppContext';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import AlternativesModal from './src/components/AlternativesModal';
import NotificationToast from './src/components/NotificationToast';
import ErrorBoundary from './src/components/ErrorBoundary';

function AppContent() {
  const { theme } = useApp();

  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
      <AlternativesModal />
      <NotificationToast />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
