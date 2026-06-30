import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Home, Heart, ShoppingCart, User, Shield, UtensilsCrossed } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import MenuScreen from '../screens/MenuScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';
import ManageRecipesScreen from '../screens/ManageRecipesScreen';
import ManageUsersScreen from '../screens/ManageUsersScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import PendingRecipesScreen from '../screens/PendingRecipesScreen';
import DailyMenuScreen from '../screens/DailyMenuScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['yoreseltarifler://', 'https://yoreseltarifler.com'],
  config: {
    screens: {
      Main: {
        screens: {
          HomeTab: 'home',
          FavoritesTab: 'favorites',
        },
      },
      RecipeDetail: 'recipe/:recipeId',
    },
  },
};

function ModernHeaderTitle({ title, colors }) {
  return (
    <View style={headerStyles.titleContainer}>
      <LinearGradient
        colors={[colors.primary, colors.primary + 'CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={headerStyles.titleBadge}
      >
        <Text style={headerStyles.titleEmoji}>🍽️</Text>
      </LinearGradient>
      <Text style={[headerStyles.titleText, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

function HomeTabs() {
  const { colors, translate } = useApp();
  const { isAdmin } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 0.5,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
        },
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          height: 72,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 20,
        },
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <ModernHeaderTitle title={translate('appTitle')} colors={colors} />
          ),
          headerTitleAlign: 'left',
          tabBarLabel: translate('home'),
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          headerTitle: translate('favorites'),
          tabBarLabel: translate('favorites'),
          tabBarIcon: ({ color, size }) => (
            <Heart color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ShoppingListTab"
        component={ShoppingListScreen}
        options={{
          headerTitle: translate('shoppingList'),
          tabBarLabel: translate('shoppingList'),
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart color={color} size={size} />
          ),
        }}
      />
      {/* Menu Tab - Only visible for non-admins */}
      {!isAdmin && (
        <Tab.Screen
          name="MenuTab"
          component={MenuScreen}
          options={{
            headerTitle: translate('menu'),
            tabBarLabel: translate('menu'),
            tabBarIcon: ({ color, size }) => (
              <UtensilsCrossed color={color} size={size} />
            ),
          }}
        />
      )}

      {/* Admin Panel Tab - Only visible for admins */}
      {isAdmin && (
        <Tab.Screen
          name="AdminTab"
          component={AdminPanelScreen}
          options={{
            headerTitle: translate('adminPanel'),
            tabBarLabel: translate('admin'),
            tabBarIcon: ({ color, size }) => (
              <Shield color={color} size={size} />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          headerTitle: translate('settings'),
          tabBarLabel: translate('profile'),
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  const { colors, translate } = useApp();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{
          headerShown: true,
          headerTitle: translate('termsOfService'),
          headerBackTitle: translate('back'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          headerShown: true,
          headerTitle: translate('privacyPolicy'),
          headerBackTitle: translate('back'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
    </Stack.Navigator>
  );
}

function MainStack() {
  const { colors, translate } = useApp();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen
        name="Main"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerBackTitle: translate('back'),
        }}
      />
      <Stack.Screen
        name="AddRecipe"
        component={AddRecipeScreen}
        options={{
          headerTitle: translate('addNewRecipe'),
          headerBackTitle: translate('back'),
        }}
      />
      <Stack.Screen
        name="ManageRecipes"
        component={ManageRecipesScreen}
        options={{
          headerTitle: translate('manageRecipes'),
          headerBackTitle: translate('back'),
        }}
      />
      <Stack.Screen
        name="ManageUsers"
        component={ManageUsersScreen}
        options={{
          headerTitle: translate('manageUsers'),
          headerBackTitle: translate('back'),
        }}
      />
      <Stack.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          headerTitle: translate('statistics'),
          headerBackTitle: translate('back'),
        }}
      />
      <Stack.Screen
        name="PendingRecipes"
        component={PendingRecipesScreen}
        options={{
          headerTitle: translate('pendingRecipes'),
          headerBackTitle: translate('back'),
        }}
      />
      <Stack.Screen
        name="DailyMenu"
        component={DailyMenuScreen}
        options={{
          headerTitle: translate('manageDailyMenu'),
          headerBackTitle: translate('back'),
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          headerTitle: translate('privacyPolicy'),
          headerBackTitle: translate('back'),
        }}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{
          headerTitle: translate('termsOfService'),
          headerBackTitle: translate('back'),
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isGuest, loading } = useAuth();
  const { colors } = useApp();
  const [onboardingDone, setOnboardingDone] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('onboardingCompleted').then(val => {
      setOnboardingDone(!!val);
    });
  }, []);

  if (loading || onboardingDone === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!onboardingDone) {
    return (
      <OnboardingScreen
        onFinish={() => {
          AsyncStorage.setItem('onboardingCompleted', '1');
          setOnboardingDone(true);
        }}
      />
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {(user || isGuest) ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const headerStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleEmoji: {
    fontSize: 18,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
