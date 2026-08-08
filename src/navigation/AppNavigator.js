import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import ReportedReviewsScreen from '../screens/ReportedReviewsScreen';
import DailyMenuScreen from '../screens/DailyMenuScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import CollectionDetailScreen from '../screens/CollectionDetailScreen';
import ManageCollectionsScreen from '../screens/ManageCollectionsScreen';
import PopularRecipesScreen from '../screens/PopularRecipesScreen';
import FeaturedRecipesScreen from '../screens/FeaturedRecipesScreen';
import BlogListScreen from '../screens/BlogListScreen';
import BlogDetailScreen from '../screens/BlogDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['yoreseltarif://', 'https://yoreseltarif.com'],
  config: {
    screens: {
      Main: {
        screens: {
          HomeTab: 'home',
          FavoritesTab: 'favorites',
        },
      },
      RecipeDetail: 'recipe/:recipeId',
      CollectionDetail: 'koleksiyon/:collectionId',
      BlogList: 'blog',
      BlogDetail: 'blog/:slug',
    },
  },
};

function ModernHeaderTitle() {
  return (
    <View style={headerStyles.titleContainer}>
      <Image
        source={require('../../assets/logo.png')}
        style={headerStyles.logo}
        resizeMode="contain"
      />
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
          height: 84,
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
          headerTitle: () => <ModernHeaderTitle />,
          headerTitleAlign: 'center',
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
        name="ReportedReviews"
        component={ReportedReviewsScreen}
        options={{
          headerTitle: translate('reportedReviews'),
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
        name="CollectionDetail"
        component={CollectionDetailScreen}
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerBackTitle: translate('back'),
        }}
      />
      <Stack.Screen
        name="ManageCollections"
        component={ManageCollectionsScreen}
        options={{
          headerTitle: translate('manageCollections'),
          headerBackTitle: translate('back'),
        }}
      />
      <Stack.Screen
        name="PopularRecipes"
        component={PopularRecipesScreen}
        options={{
          headerTitle: translate('managePopularRecipes'),
          headerBackTitle: translate('back'),
        }}
      />
      <Stack.Screen
        name="FeaturedRecipes"
        component={FeaturedRecipesScreen}
        options={{
          headerTitle: translate('manageFeaturedRecipes'),
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
      <Stack.Screen
        name="BlogList"
        component={BlogListScreen}
        options={{
          headerTitle: translate('blogTitle'),
          headerBackTitle: translate('back'),
        }}
      />
      <Stack.Screen
        name="BlogDetail"
        component={BlogDetailScreen}
        options={{
          headerTitle: '',
          headerTransparent: true,
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
  },
  // logo.png web'deki üst banner logosuyla aynı dosya (yoreseltarif.com
  // yazısı görselin içinde) -- 749x566 orijinal orana sabit piksel ölçüsüyle
  // uyarlandı (aspectRatio + tek boyut kombinasyonu native header içinde
  // güvenilir çalışmadı, logo header'ı taşıp tüm ekranı kaplıyordu).
  logo: {
    width: 77,
    height: 58,
  },
});
