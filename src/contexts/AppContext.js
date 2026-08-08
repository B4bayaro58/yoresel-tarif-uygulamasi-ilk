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
import { getRecipeTags } from '../constants/recipeTags';
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
// NOT: override+native doküman sayısı 2026-07-20 itibarıyla zaten 1105 —
// limit(200) yeni eklenen tarifleri (rastgele doküman ID'si limitin dışında
// kalınca) ana listeye hiç düşürmüyordu. Limit tek seferlik bir sorgu olduğu
// için (canlı dinleyici değil) büyütmek maliyet insidentini geri getirmiyor.
const FIREBASE_RECIPE_FETCH_LIMIT = 3000;

// AsyncStorage'ın Android'deki SQLite backend'i tek bir satırı ~2MB'ta
// sınırlıyor -- tüm override+native tarif listesini (900+ doküman, foto/
// malzeme/adım metinleriyle kolayca bu sınırı aşıyor) TEK bir JSON string
// olarak yazmak "Row too big to fit into CursorWindow" hatasıyla sessizce
// başarısız oluyordu (hem okuma hem yazmada), yani cache hiç çalışmıyor ve
// her soğuk açılış tam ağ sorgusunu bekliyordu. Listeyi küçük parçalara
// bölüp ayrı anahtarlarda tutmak bu sınırın altında kalıyor.
const RECIPE_CACHE_CHUNK_SIZE = 150;
const RECIPE_CACHE_KEY_PREFIX = 'cachedFirebaseRecipes_v2_chunk_';
const RECIPE_CACHE_META_KEY = 'cachedFirebaseRecipes_v2_meta';

async function loadCachedRecipesChunked() {
  try {
    const metaRaw = await AsyncStorage.getItem(RECIPE_CACHE_META_KEY);
    if (!metaRaw) return null;
    const { chunkCount } = JSON.parse(metaRaw);
    const keys = Array.from({ length: chunkCount }, (_, i) => `${RECIPE_CACHE_KEY_PREFIX}${i}`);
    const pairs = await AsyncStorage.multiGet(keys);
    const all = [];
    for (const [, value] of pairs) {
      if (!value) return null; // eksik parça varsa tüm cache güvenilmez sayılır
      all.push(...JSON.parse(value));
    }
    return all;
  } catch {
    return null;
  }
}

async function saveCachedRecipesChunked(recipesList) {
  try {
    const chunks = [];
    for (let i = 0; i < recipesList.length; i += RECIPE_CACHE_CHUNK_SIZE) {
      chunks.push(recipesList.slice(i, i + RECIPE_CACHE_CHUNK_SIZE));
    }
    const pairs = chunks.map((chunk, i) => [`${RECIPE_CACHE_KEY_PREFIX}${i}`, JSON.stringify(chunk)]);
    await AsyncStorage.multiSet(pairs);
    await AsyncStorage.setItem(RECIPE_CACHE_META_KEY, JSON.stringify({ chunkCount: chunks.length }));
  } catch {
    // yazılamazsa sessizce yok say -- sıradaki soğuk açılış yine network'e düşer
  }
}

// Herkese açık (yayında) tarifler. Sadece bununla filtrelemek admin panelinden
// "Pasif (Gizli)" yapılmış override'ları sorgu seviyesinde tamamen dışarıda
// bırakırdı -- aşağıdaki `recipes` useMemo'sunun statik orijinali gizleyebilmesi
// için o override dokümanının (durumu ne olursa olsun) yine de fetch edilmiş
// olması gerekiyor. Web tarafı bunu zaten iki ayrı sorguyla çözüyor (bkz.
// web/src/hooks/useAllRecipes.ts, web/src/app/page.tsx) -- aynı desen burada.
const PUBLIC_STATUSES = ['published', 'approved'];

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
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Onboarding sırasında seçilen beslenme tercihleri (quick-filter anahtarları)
  const [preferredQuickFilters, setPreferredQuickFilters] = useState([]);

  // UI State
  const [showSearch, setShowSearch] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [notification, setNotification] = useState(null);

  // Daily Menu State
  const [dailyMenuIds, setDailyMenuIds] = useState([]);
  const [dailyMenuLoading, setDailyMenuLoading] = useState(true);

  // Popular Recipes State
  const [popularRecipeIds, setPopularRecipeIds] = useState([]);
  const [popularRecipesLoading, setPopularRecipesLoading] = useState(true);

  // Featured Recipes State (anasayfa "Öne Çıkanlar" carousel'i)
  const [featuredRecipeIds, setFeaturedRecipeIds] = useState([]);
  const [featuredRecipesLoading, setFeaturedRecipesLoading] = useState(true);

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
    loadPopularRecipes();
    loadFeaturedRecipes();
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

  // Sync favorites + shopping list from Firebase when user logs in
  useEffect(() => {
    if (currentUserId) {
      syncFavoritesFromFirebase(currentUserId);
      syncShoppingListFromFirebase(currentUserId);
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

  // Alışveriş listesi bulut senkronu — favoriler ile aynı desen, ama
  // `favorites/{docId}` kuralının aksine (sahiplik kontrolsüz) mevcut
  // düzgün scope'lanmış `users/{uid}` update kuralı üzerinden yazılır.
  const syncShoppingListFromFirebase = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (Array.isArray(data.shoppingList)) {
          setShoppingList(data.shoppingList);
          await AsyncStorage.setItem('shoppingList', JSON.stringify(data.shoppingList));
        }
      }
    } catch (error) {
      console.error('Error syncing shopping list:', error);
    }
  };

  const saveShoppingListToFirebase = async (uid, updatedList) => {
    try {
      await updateDoc(doc(db, 'users', uid), { shoppingList: updatedList });
    } catch (error) {
      console.error('Error saving shopping list to Firebase:', error);
    }
  };

  const loadFirebaseRecipes = async () => {
    setRecipesLoading(true);
    // Cache-first (stale-while-revalidate): son bilinen override listesini
    // AsyncStorage'dan hemen gösteriyoruz ki soğuk açılışta kullanıcı boş
    // liste/skeleton yerine anında içerik görsün. Ağ isteği yine aşağıda
    // devam ediyor ve sonucu arka planda günceliyor -- önceden cache sadece
    // ağ hatasında bir fallback olarak kullanılıyordu, her açılışta boşuna
    // network round-trip'i bekleniyordu.
    let hadCache = false;
    const cached = await loadCachedRecipesChunked();
    if (cached) {
      setFirebaseRecipes(cached);
      setRecipesLoading(false);
      hadCache = true;
    }

    try {
      const [publicSnap, overridesSnap] = await Promise.all([
        getDocs(query(
          collection(db, 'recipes'),
          where('status', 'in', PUBLIC_STATUSES),
          limit(FIREBASE_RECIPE_FETCH_LIMIT)
        )),
        getDocs(query(
          collection(db, 'recipes'),
          where('overridesStaticId', '!=', null),
          limit(FIREBASE_RECIPE_FETCH_LIMIT)
        )),
      ]);
      const merged = new Map();
      publicSnap.docs.forEach(d => merged.set(d.id, { id: d.id, ...d.data(), isFirebase: true }));
      overridesSnap.docs.forEach(d => merged.set(d.id, { id: d.id, ...d.data(), isFirebase: true }));
      const loaded = Array.from(merged.values());
      setFirebaseRecipes(loaded);
      await saveCachedRecipesChunked(loaded);
    } catch (error) {
      console.error('Firebase recipes unavailable' + (hadCache ? ' (cache already shown)' : ', no cache') + ':', error);
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

  const loadPopularRecipes = async () => {
    setPopularRecipesLoading(true);
    try {
      const snap = await getDoc(doc(db, 'settings', 'popularRecipes'));
      if (snap.exists()) {
        setPopularRecipeIds(snap.data().recipeIds || []);
      }
    } catch (error) {
      console.error('Popular recipes load error:', error);
    } finally {
      setPopularRecipesLoading(false);
    }
  };

  const savePopularRecipes = async (recipeIds) => {
    try {
      await setDoc(doc(db, 'settings', 'popularRecipes'), {
        recipeIds,
        updatedAt: serverTimestamp(),
      });
      setPopularRecipeIds(recipeIds);
      return { success: true };
    } catch (error) {
      console.error('Popular recipes save error:', error);
      return { success: false, error: error.message };
    }
  };

  const loadFeaturedRecipes = async () => {
    setFeaturedRecipesLoading(true);
    try {
      const snap = await getDoc(doc(db, 'settings', 'featuredRecipes'));
      if (snap.exists()) {
        setFeaturedRecipeIds(snap.data().recipeIds || []);
      }
    } catch (error) {
      console.error('Featured recipes load error:', error);
    } finally {
      setFeaturedRecipesLoading(false);
    }
  };

  const saveFeaturedRecipes = async (recipeIds) => {
    try {
      await setDoc(doc(db, 'settings', 'featuredRecipes'), {
        recipeIds,
        updatedAt: serverTimestamp(),
      });
      setFeaturedRecipeIds(recipeIds);
      return { success: true };
    } catch (error) {
      console.error('Featured recipes save error:', error);
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
  }, [favorites, shoppingList, language, theme, completedSteps, personalMenuIds, preferredQuickFilters]);

  const loadPersistedData = async () => {
    try {
      const [favs, shopping, lang, thm, steps, personalMenu, quickPrefs] = await Promise.all([
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('shoppingList'),
        AsyncStorage.getItem('language'),
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('completedSteps'),
        AsyncStorage.getItem('personalMenuIds'),
        AsyncStorage.getItem('preferredQuickFilters'),
      ]);

      if (favs) setFavorites(JSON.parse(favs));
      if (shopping) setShoppingList(JSON.parse(shopping));
      if (lang) setLanguage(lang);
      if (thm) setTheme(thm);
      if (steps) setCompletedSteps(JSON.parse(steps));
      if (personalMenu) setPersonalMenuIds(JSON.parse(personalMenu));
      if (quickPrefs) {
        const parsed = JSON.parse(quickPrefs);
        setPreferredQuickFilters(parsed);
        // İlk açılışta onboarding'de seçilen tercihi varsayılan aktif çip yap
        if (parsed.length > 0) setSelectedQuickFilter(parsed[0]);
      }
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
        AsyncStorage.setItem('preferredQuickFilters', JSON.stringify(preferredQuickFilters)),
      ]);
    } catch (error) {
      console.error('Error saving persisted data:', error);
    }
  };

  // Onboarding'de seçilen tercihleri kaydeder (OnboardingScreen tarafından çağrılır)
  const saveOnboardingPreferences = useCallback((quickFilterKeys) => {
    setPreferredQuickFilters(quickFilterKeys);
    if (quickFilterKeys.length > 0) setSelectedQuickFilter(quickFilterKeys[0]);
  }, []);

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

  // Override edilmiş statik tarifler `recipes`'te artık kendi Firebase ID'siyle
  // duruyor, statik slug (ör. "lasagna") listede yok — overridesStaticId fallback'i
  // olmadan bu tarifler menüden "kayboluyordu" (web'deki aynı hata için bkz.
  // maliyet denetimi 2026-07-09/10 notları, commit 9ff3cca).
  const findByIdOrOverride = (id) =>
    recipes.find(r => r.id === id) || recipes.find(r => r.overridesStaticId === id);

  // Daily menu resolved recipes
  const dailyMenu = useMemo(() => {
    if (!dailyMenuIds.length) return [];
    return dailyMenuIds.map(findByIdOrOverride).filter(Boolean);
  }, [dailyMenuIds, recipes]);

  const popularRecipes = useMemo(() => {
    if (!popularRecipeIds.length) return [];
    return popularRecipeIds.map(findByIdOrOverride).filter(Boolean);
  }, [popularRecipeIds, recipes]);

  // Featured recipes (anasayfa hero carousel) -- admin henüz seçim yapmadıysa
  // (veya seçtiği tarifler artık mevcut değilse) katalogdan ilk 4 tarife düşer,
  // böylece carousel hiç boş kalmaz.
  const featuredRecipes = useMemo(() => {
    const curated = featuredRecipeIds.map(findByIdOrOverride).filter(Boolean);
    return curated.length ? curated : recipes.slice(0, 4);
  }, [featuredRecipeIds, recipes]);

  // Personal menu resolved recipes
  const personalMenuRecipes = useMemo(() => {
    if (!personalMenuIds.length) return [];
    return personalMenuIds.map(findByIdOrOverride).filter(Boolean);
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
    setShoppingList(prev => {
      const updated = [...prev, newItem];
      if (currentUserId) saveShoppingListToFirebase(currentUserId, updated);
      return updated;
    });
    showNotification(t('addToShoppingList', language));
    logShoppingAdd(item.name);
  }, [currentUserId, language, showNotification]);

  const toggleShoppingItem = useCallback((itemId) => {
    setShoppingList(prev => {
      const updated = prev.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );
      if (currentUserId) saveShoppingListToFirebase(currentUserId, updated);
      return updated;
    });
  }, [currentUserId]);

  const deleteShoppingItem = useCallback((itemId) => {
    setShoppingList(prev => {
      const updated = prev.filter(item => item.id !== itemId);
      if (currentUserId) saveShoppingListToFirebase(currentUserId, updated);
      return updated;
    });
  }, [currentUserId]);

  const deleteSelectedShoppingItems = useCallback(() => {
    setShoppingList(prev => {
      const updated = prev.filter(item => !item.checked);
      if (currentUserId) saveShoppingListToFirebase(currentUserId, updated);
      return updated;
    });
    showNotification(t('deleteSelected', language));
  }, [currentUserId, language, showNotification]);

  const clearShoppingList = useCallback(() => {
    setShoppingList([]);
    if (currentUserId) saveShoppingListToFirebase(currentUserId, []);
    showNotification(t('clearAll', language));
  }, [currentUserId, language, showNotification]);

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

    if (selectedQuickFilter) {
      filtered = filtered.filter(r => getRecipeTags(r).includes(selectedQuickFilter));
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
  }, [recipes, selectedContinent, selectedCategory, selectedCountry, selectedQuickFilter, searchQuery]);

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
    setSelectedQuickFilter(null);
    setSearchQuery('');
  }, []);

  const hasActiveFilters = useCallback(() => {
    return selectedContinent || selectedCategory || selectedCountry || selectedQuickFilter || searchQuery;
  }, [selectedContinent, selectedCategory, selectedCountry, selectedQuickFilter, searchQuery]);

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

    // Popular Recipes
    popularRecipes,
    popularRecipeIds,
    popularRecipesLoading,
    savePopularRecipes,
    loadPopularRecipes,
    featuredRecipes,
    featuredRecipeIds,
    featuredRecipesLoading,
    saveFeaturedRecipes,
    loadFeaturedRecipes,

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
    selectedQuickFilter,
    setSelectedQuickFilter,
    preferredQuickFilters,
    saveOnboardingPreferences,
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
