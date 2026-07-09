import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, query, where, limit, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  requestNotificationPermissions,
  scheduleTimerNotification,
  cancelNotification,
  scheduleWeeklyRecipeSuggestion,
  scheduleFavoriteReminder,
} from '../services/notificationService';
import { THEMES } from '../constants/themes';
import { t } from '../constants/translations';
import { RECIPES_DATA } from '../constants/recipes';
import { COUNTRY_I18N, RECIPE_I18N } from '../constants/recipeI18n';
import { INGREDIENT_I18N, STEPS_I18N } from '../constants/recipeTranslationsI18n';
import { getRank, getNextRank } from '../constants/ranks';
import { getEarnedBadges } from '../constants/badges';
import { logFavoriteToggle, logShoppingAdd, logSearch, logRecipeComplete } from '../services/analyticsService';
import { Alert, Linking, Platform } from 'react-native';

const AppContext = createContext();

// Statik tarif kataloğu zaten Unsplash fotoğraflarıyla yerelde mevcut; bu sorgu
// sadece admin panelinden yüklenmiş özel fotoğraf override'larını getirir.
// Önceden onSnapshot ile filtresiz/limitsiz canlı dinleniyordu — uygulama açık
// olan her kullanıcı için sürekli 1000+ doküman okunuyordu. Tek seferlik ve
// limitli hale getirildi; limit dışında kalan tarifler statik fotoğrafına düşer.
const FIREBASE_RECIPE_FETCH_LIMIT = 200;

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Core Settings
  const [language, setLanguage] = useState('tr');
  const [theme, setTheme] = useState('light');

  // App State
  const [favorites, setFavorites] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [completedSteps, setCompletedSteps] = useState({});
  const [firebaseRecipes, setFirebaseRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Filters
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // UI State
  const [showSearch, setShowSearch] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [notification, setNotification] = useState(null);

  // Daily Menu State
  const [dailyMenuIds, setDailyMenuIds] = useState([]);
  const [dailyMenuLoading, setDailyMenuLoading] = useState(true);

  // Personal Menu State
  const [personalMenuIds, setPersonalMenuIds] = useState([]);

  // Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerNotificationId, setTimerNotificationId] = useState(null);
  const [timerRecipeName, setTimerRecipeName] = useState('');

  // Load persisted data and Firebase recipes on mount
  useEffect(() => {
    loadPersistedData();
    loadFirebaseRecipes();
    loadDailyMenu();
    initNotifications();
  }, []);

  const initNotifications = async () => {
    const granted = await requestNotificationPermissions();
    if (granted) {
      const staticRecipes = RECIPES_DATA.tr;
      const random = staticRecipes[Math.floor(Math.random() * staticRecipes.length)];
      scheduleWeeklyRecipeSuggestion(random.name);
    }
  };

  // Sync favorites from Firebase when user logs in
  useEffect(() => {
    if (currentUserId) {
      syncFavoritesFromFirebase(currentUserId);
    }
  }, [currentUserId]);

  const syncFavoritesFromFirebase = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (Array.isArray(data.favorites)) {
          setFavorites(data.favorites);
          await AsyncStorage.setItem('favorites', JSON.stringify(data.favorites));
        }
      }
    } catch (error) {
      console.error('Error syncing favorites:', error);
    }
  };

  const saveFavoritesToFirebase = async (uid, updatedFavorites) => {
    try {
      await updateDoc(doc(db, 'users', uid), { favorites: updatedFavorites });
    } catch (error) {
      console.error('Error saving favorites to Firebase:', error);
    }
  };

  const loadFirebaseRecipes = async () => {
    setRecipesLoading(true);
    try {
      const snapshot = await getDocs(query(
        collection(db, 'recipes'),
        where('status', 'in', ['published', 'approved']),
        limit(FIREBASE_RECIPE_FETCH_LIMIT)
      ));
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data(), isFirebase: true }));
      setFirebaseRecipes(loaded);
      try {
        await AsyncStorage.setItem('cachedFirebaseRecipes', JSON.stringify(loaded));
      } catch {}
    } catch (error) {
      console.error('Firebase recipes unavailable, loading from cache:', error);
      try {
        const cached = await AsyncStorage.getItem('cachedFirebaseRecipes');
        if (cached) setFirebaseRecipes(JSON.parse(cached));
      } catch (cacheError) {
        console.error('Cache load error:', cacheError);
      }
    } finally {
      setRecipesLoading(false);
    }
  };

  const loadDailyMenu = async () => {
    setDailyMenuLoading(true);
    try {
      const snap = await getDoc(doc(db, 'settings', 'dailyMenu'));
      if (snap.exists()) {
        setDailyMenuIds(snap.data().recipeIds || []);
      }
    } catch (error) {
      console.error('Daily menu load error:', error);
    } finally {
      setDailyMenuLoading(false);
    }
  };

  const saveDailyMenu = async (recipeIds) => {
    try {
      await setDoc(doc(db, 'settings', 'dailyMenu'), {
        recipeIds,
        updatedAt: serverTimestamp(),
      });
      setDailyMenuIds(recipeIds);
      return { success: true };
    } catch (error) {
      console.error('Daily menu save error:', error);
      return { success: false, error: error.message };
    }
  };

  const addRecipe = async (recipeData, status = 'approved') => {
    try {
      const docRef = await addDoc(collection(db, 'recipes'), {
        ...recipeData,
        rating: 0,
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      if (status === 'approved') {
        const newRecipe = { id: docRef.id, ...recipeData, rating: 0, status, isFirebase: true };
        setFirebaseRecipes(prev => [...prev, newRecipe]);
      }
      return { success: true };
    } catch (error) {
      console.error('Error adding recipe:', error);
      return { success: false, error: error.message };
    }
  };

  const approveRecipe = async (recipeId) => {
    try {
      await updateDoc(doc(db, 'recipes', recipeId), { status: 'approved' });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateRecipe = async (recipeId, recipeData) => {
    try {
      const dataWithTimestamp = { ...recipeData, updatedAt: serverTimestamp() };
      await updateDoc(doc(db, 'recipes', recipeId), dataWithTimestamp);
      setFirebaseRecipes(prev =>
        prev.map(r => (r.id === recipeId ? { ...r, ...recipeData } : r))
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating recipe:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteRecipe = async (recipeId) => {
    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      setFirebaseRecipes(prev => prev.filter(r => r.id !== recipeId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return { success: false, error: error.message };
    }
  };

  // Save data when it changes
  useEffect(() => {
    savePersistedData();
  }, [favorites, shoppingList, language, theme, completedSteps, personalMenuIds]);

  const loadPersistedData = async () => {
    try {
      const [favs, shopping, lang, thm, steps, personalMenu] = await Promise.all([
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('shoppingList'),
        AsyncStorage.getItem('language'),
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('completedSteps'),
        AsyncStorage.getItem('personalMenuIds'),
      ]);

      if (favs) setFavorites(JSON.parse(favs));
      if (shopping) setShoppingList(JSON.parse(shopping));
      if (lang) setLanguage(lang);
      if (thm) setTheme(thm);
      if (steps) setCompletedSteps(JSON.parse(steps));
      if (personalMenu) setPersonalMenuIds(JSON.parse(personalMenu));
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  };

  const savePersistedData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('favorites', JSON.stringify(favorites)),
        AsyncStorage.setItem('shoppingList', JSON.stringify(shoppingList)),
        AsyncStorage.setItem('language', language),
        AsyncStorage.setItem('theme', theme),
        AsyncStorage.setItem('completedSteps', JSON.stringify(completedSteps)),
        AsyncStorage.setItem('personalMenuIds', JSON.stringify(personalMenuIds)),
      ]);
    } catch (error) {
      console.error('Error saving persisted data:', error);
    }
  };

  // Get current theme colors
  const colors = THEMES[theme];

  // Get translated text
  const translate = useCallback((key, params) => t(key, language, params), [language]);

  // Memoized recipes array — applies i18n translations for non-Turkish languages
  const recipes = useMemo(() => {
    const base = RECIPES_DATA.tr;
    const localized = language === 'tr'
      ? base
      : base.map(r => ({
          ...r,
          name: RECIPE_I18N[r.id]?.[language] || r.name,
          country: COUNTRY_I18N[r.country]?.[language] || r.country,
          ingredients: INGREDIENT_I18N[r.id]?.[language] || r.ingredients,
          steps: STEPS_I18N[r.id]?.[language] || r.steps,
        }));
    // Override edilmiş statik tarifleri gizle (inactive override'lar da dahil)
    const overriddenIds = new Set(
      firebaseRecipes
        .filter(r => r.overridesStaticId != null)
        .map(r => String(r.overridesStaticId))
    );
    const filteredStatic = localized.filter(r => !overriddenIds.has(String(r.id)));
    // Yalnızca aktif/onaylı Firebase tariflerini göster
    const visibleFirebase = firebaseRecipes.filter(
      r => !r.status || r.status === 'approved' || r.status === 'published'
    );
    return [...filteredStatic, ...visibleFirebase];
  }, [language, firebaseRecipes]);

  // Daily menu resolved recipes
  const dailyMenu = useMemo(() => {
    if (!dailyMenuIds.length) return [];
    return dailyMenuIds.map(id => recipes.find(r => r.id === id)).filter(Boolean);
  }, [dailyMenuIds, recipes]);

  // Personal menu resolved recipes
  const personalMenuRecipes = useMemo(() => {
    if (!personalMenuIds.length) return [];
    return personalMenuIds.map(id => recipes.find(r => r.id === id)).filter(Boolean);
  }, [personalMenuIds, recipes]);

  // Notification Toast
  const notificationTimeoutRef = React.useRef(null);
  const showNotification = useCallback((message) => {
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    setNotification(message);
    notificationTimeoutRef.current = setTimeout(() => setNotification(null), 2000);
  }, []);

  const togglePersonalMenu = useCallback((recipeId) => {
    setPersonalMenuIds(prev => {
      const isIn = prev.includes(recipeId);
      const updated = isIn ? prev.filter(id => id !== recipeId) : [...prev, recipeId];
      showNotification(isIn ? t('removedFromMyMenu', language) : t('addedToMyMenu', language));
      return updated;
    });
  }, [language, showNotification]);

  const isInPersonalMenu = useCallback((recipeId) => personalMenuIds.includes(recipeId), [personalMenuIds]);

  // Favorites
  const toggleFavorite = useCallback((recipeId) => {
    setFavorites(prev => {
      const isAlreadyFav = prev.includes(recipeId);
      const updated = isAlreadyFav
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId];
      showNotification(
        isAlreadyFav
          ? t('removeFromFavorites', language)
          : t('addToFavorites', language)
      );
      if (currentUserId) saveFavoritesToFirebase(currentUserId, updated);
      logFavoriteToggle(recipeId, '', !isAlreadyFav);
      // Yeni favori eklenince o tarif için kişiselleştirilmiş bildirim planla
      if (!isAlreadyFav) {
        const recipe = recipes.find(r => String(r.id) === String(recipeId));
        if (recipe?.name) scheduleFavoriteReminder(recipe.name);
      }
      return updated;
    });
  }, [currentUserId, language, showNotification]);

  const isFavorite = useCallback((recipeId) => favorites.includes(recipeId), [favorites]);

  // Shopping List
  const addToShoppingList = useCallback((item) => {
    const newItem = {
      id: Date.now().toString(),
      name: item.name,
      amount: item.amount,
      checked: false,
    };
    setShoppingList(prev => [...prev, newItem]);
    showNotification(t('addToShoppingList', language));
    logShoppingAdd(item.name);
  }, [language, showNotification]);

  const toggleShoppingItem = useCallback((itemId) => {
    setShoppingList(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const deleteShoppingItem = useCallback((itemId) => {
    setShoppingList(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const deleteSelectedShoppingItems = useCallback(() => {
    setShoppingList(prev => prev.filter(item => !item.checked));
    showNotification(t('deleteSelected', language));
  }, [language, showNotification]);

  const clearShoppingList = useCallback(() => {
    setShoppingList([]);
    showNotification(t('clearAll', language));
  }, [language, showNotification]);

  // Steps Completion
  const toggleStep = useCallback((recipeId, stepIndex, totalSteps, recipeName) => {
    const key = `${recipeId}-${stepIndex}`;
    setCompletedSteps(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      // Tüm adımlar tamamlandıysa analytics logu
      if (totalSteps && updated[key]) {
        const allDone = Array.from({ length: totalSteps }, (_, i) =>
          updated[`${recipeId}-${i}`]
        ).every(Boolean);
        if (allDone) logRecipeComplete(recipeId, recipeName || recipeId);
      }
      return updated;
    });
  }, []);

  const isStepCompleted = useCallback((recipeId, stepIndex) => {
    const key = `${recipeId}-${stepIndex}`;
    return completedSteps[key] || false;
  }, [completedSteps]);

  const getRecipeProgress = useCallback((recipeId, totalSteps) => {
    let completed = 0;
    for (let i = 0; i < totalSteps; i++) {
      if (completedSteps[`${recipeId}-${i}`]) completed++;
    }
    const percentage = Math.round((completed / totalSteps) * 100);
    return { completed, total: totalSteps, percentage };
  }, [completedSteps]);

  // Count fully completed recipes (all steps done) + collect earned countries
  const { completedRecipesCount, completedCountries } = useMemo(() => {
    const recipeIds = new Set(
      Object.keys(completedSteps).map(key => {
        const parts = key.split('-');
        return parts.slice(0, -1).join('-');
      })
    );
    let count = 0;
    const countries = new Map(); // country -> continent
    for (const recipeId of recipeIds) {
      const recipe = recipes.find(r => String(r.id) === recipeId);
      if (recipe?.steps?.length) {
        let completed = 0;
        for (let i = 0; i < recipe.steps.length; i++) {
          if (completedSteps[`${recipeId}-${i}`]) completed++;
        }
        if (completed === recipe.steps.length) {
          count++;
          if (recipe.country) countries.set(recipe.country, recipe.continent || 'unknown');
        }
      }
    }
    return { completedRecipesCount: count, completedCountries: countries };
  }, [completedSteps, recipes]);

  // In-app review prompt: completedRecipesCount 3'e ulaşınca bir kez sor
  const reviewPromptShownRef = React.useRef(false);
  const reviewPromptTimeoutRef = React.useRef(null);
  useEffect(() => {
    if (completedRecipesCount < 3 || reviewPromptShownRef.current) return;
    let cancelled = false;
    AsyncStorage.getItem('reviewPromptShown').then(val => {
      if (val || cancelled) return;
      reviewPromptShownRef.current = true;
      AsyncStorage.setItem('reviewPromptShown', '1');
      reviewPromptTimeoutRef.current = setTimeout(() => {
        if (cancelled) return;
        Alert.alert(
          t('reviewTitle', language),
          t('reviewMessage', language),
          [
            { text: t('reviewLater', language), style: 'cancel' },
            {
              text: t('reviewNow', language),
              onPress: () => {
                const url = Platform.OS === 'ios'
                  ? 'itms-apps://itunes.apple.com/app/id0000000000?action=write-review'
                  : 'market://details?id=com.cagatay58.yoreseltarifuygulamasi';
                Linking.openURL(url).catch(() => {});
              },
            },
          ]
        );
      }, 1500);
    });
    return () => {
      cancelled = true;
      if (reviewPromptTimeoutRef.current) clearTimeout(reviewPromptTimeoutRef.current);
    };
  }, [completedRecipesCount]);

  // Rank-up notification
  const prevCompletedCountRef = React.useRef(completedRecipesCount);
  useEffect(() => {
    const prev = prevCompletedCountRef.current;
    prevCompletedCountRef.current = completedRecipesCount;
    if (completedRecipesCount <= prev) return;
    const prevRank = getRank(prev, language);
    const newRank = getRank(completedRecipesCount, language);
    if (newRank.id !== prevRank.id) {
      showNotification(`${newRank.emoji} ${newRank.titleText} rütbesine ulaştın!`);
    }
  }, [completedRecipesCount]);

  // Travel badge notification
  const prevCountryCountRef = React.useRef(completedCountries.size);
  useEffect(() => {
    const prev = prevCountryCountRef.current;
    prevCountryCountRef.current = completedCountries.size;
    if (completedCountries.size <= prev) return;
    const prevBadges = getEarnedBadges(prev);
    const newBadges = getEarnedBadges(completedCountries.size);
    if (newBadges.length > prevBadges.length) {
      const unlocked = newBadges[newBadges.length - 1];
      showNotification(`${unlocked.emoji} "${unlocked.title}" rozeti kazanıldı!`);
    }
  }, [completedCountries.size]);

  // Filtered Recipes — memoized function, recreated only when deps change
  const getFilteredRecipes = useCallback(() => {
    let filtered = recipes;

    if (selectedContinent) {
      filtered = filtered.filter(r => r.continent === selectedContinent);
    }

    if (selectedCategory) {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    if (selectedCountry) {
      filtered = filtered.filter(r => r.country === selectedCountry);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        const nameMatch = r.name?.toLowerCase().includes(query) ?? false;
        const ingredientMatch = Array.isArray(r.ingredients) && r.ingredients.some(ing =>
          ing.name?.toLowerCase().includes(query) ?? false
        );
        return nameMatch || ingredientMatch;
      });
    }

    return filtered;
  }, [recipes, selectedContinent, selectedCategory, selectedCountry, searchQuery]);

  // Arama logunu yalnızca kullanıcı yazmayı bıraktıktan 600ms sonra tek sefer yaz
  // (önceden her tuş vuruşunda Firestore'a yazıyordu — bkz. maliyet denetimi 2026-07-09)
  useEffect(() => {
    if (!searchQuery) return;
    const timeout = setTimeout(() => logSearch(searchQuery), 600);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Clear Filters
  const clearFilters = useCallback(() => {
    setSelectedContinent(null);
    setSelectedCategory(null);
    setSelectedCountry(null);
    setSearchQuery('');
  }, []);

  const hasActiveFilters = useCallback(() => {
    return selectedContinent || selectedCategory || selectedCountry || searchQuery;
  }, [selectedContinent, selectedCategory, selectedCountry, searchQuery]);

  // Timer Functions
  const startTimer = useCallback(async (minutes, recipeName = '') => {
    setTimeRemaining(minutes * 60);
    setTimerActive(true);
    setTimerPaused(false);
    setTimerRecipeName(recipeName);
    const notifId = await scheduleTimerNotification(minutes, recipeName);
    setTimerNotificationId(notifId);
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerPaused(prev => !prev);
  }, []);

  const stopTimer = useCallback(() => {
    setTimerActive(false);
    setTimerPaused(false);
    setTimeRemaining(0);
    setTimerNotificationId(prev => {
      cancelNotification(prev);
      return null;
    });
    setTimerRecipeName('');
  }, []);

  // Timer countdown — single interval for the full duration (not recreated each second)
  useEffect(() => {
    if (!timerActive || timerPaused) return;
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timerPaused]);

  // Show notification when timer finishes naturally
  useEffect(() => {
    if (!timerActive && timeRemaining === 0 && timerRecipeName) {
      showNotification(t('timerFinished', language));
    }
  }, [timerActive]);

  // Alternatives Modal
  const openAlternatives = useCallback((ingredient) => {
    setSelectedIngredient(ingredient);
    setShowAlternatives(true);
  }, []);

  const closeAlternatives = useCallback(() => {
    setShowAlternatives(false);
    setSelectedIngredient(null);
  }, []);

  const value = {
    // Settings
    language,
    setLanguage,
    theme,
    setTheme,
    colors,
    translate,

    // Data
    recipes,
    favorites,
    shoppingList,
    completedSteps,
    recipesLoading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    approveRecipe,
    loadFirebaseRecipes,
    setCurrentUserId,

    // Daily Menu
    dailyMenu,
    dailyMenuIds,
    dailyMenuLoading,
    saveDailyMenu,
    loadDailyMenu,

    // Personal Menu
    personalMenuRecipes,
    personalMenuIds,
    togglePersonalMenu,
    isInPersonalMenu,

    // Favorites
    toggleFavorite,
    isFavorite,

    // Shopping List
    addToShoppingList,
    toggleShoppingItem,
    deleteShoppingItem,
    deleteSelectedShoppingItems,
    clearShoppingList,

    // Steps
    toggleStep,
    isStepCompleted,
    getRecipeProgress,
    completedRecipesCount,
    completedCountries,

    // Filters
    selectedContinent,
    setSelectedContinent,
    selectedCategory,
    setSelectedCategory,
    selectedCountry,
    setSelectedCountry,
    searchQuery,
    setSearchQuery,
    getFilteredRecipes,
    clearFilters,
    hasActiveFilters,

    // Search
    showSearch,
    setShowSearch,

    // Alternatives
    showAlternatives,
    openAlternatives,
    closeAlternatives,
    selectedIngredient,

    // Notification
    notification,
    showNotification,

    // Timer
    timerActive,
    timerPaused,
    timeRemaining,
    startTimer,
    pauseTimer,
    stopTimer,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
