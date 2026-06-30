import { Platform } from 'react-native';

// Dynamic import guard - expo-notifications native module may not exist in Expo Go SDK 54+
let Notifications = null;
let Device = null;

try {
  Notifications = require('expo-notifications');
  Device = require('expo-device');
} catch (e) {
  console.warn('expo-notifications not available:', e.message);
}

// Configure how notifications appear when app is in foreground
try {
  if (Notifications) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
} catch (e) {
  // Silently ignore - expo-notifications not fully supported in Expo Go SDK 54+
}

export const requestNotificationPermissions = async () => {
  if (!Notifications || !Device || !Device.isDevice) return false;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('timer', {
        name: 'Pişirme Zamanlayıcısı',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
      await Notifications.setNotificationChannelAsync('suggestions', {
        name: 'Tarif Önerileri',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    return finalStatus === 'granted';
  } catch (e) {
    console.warn('Notification permissions request failed:', e.message);
    return false;
  }
};

export const scheduleTimerNotification = async (minutes, recipeName) => {
  if (!Notifications) return null;
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Süre Doldu!',
        body: `${recipeName || 'Tarifin'} pişme süresi tamamlandı.`,
        sound: true,
        channelId: 'timer',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: minutes * 60,
      },
    });
    return id;
  } catch (error) {
    console.error('Timer notification error:', error);
    return null;
  }
};

export const cancelNotification = async (notificationId) => {
  if (!Notifications || !notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Cancel notification error:', error);
  }
};

/**
 * Kullanıcının favori tarifine göre kişiselleştirilmiş hatırlatma.
 * Haftanın farklı bir günü planlanır (Perşembe) ki generic öneriden ayrışsın.
 */
export const scheduleFavoriteReminder = async (recipeName) => {
  if (!Notifications) return;
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const previous = scheduled.find(n => n.content.data?.type === 'favorite_reminder');
    if (previous) {
      await Notifications.cancelScheduledNotificationAsync(previous.identifier);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '❤️ Favori Tarifin Seni Bekliyor',
        body: `"${recipeName}" tarifini bugün denemek ister misin?`,
        data: { type: 'favorite_reminder' },
        channelId: 'suggestions',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 5, // Thursday
        hour: 18,
        minute: 30,
      },
    });
  } catch (error) {
    console.error('Favorite reminder notification error:', error);
  }
};

export const scheduleWeeklyRecipeSuggestion = async (recipeName) => {
  if (!Notifications) return;
  try {
    // Cancel previous weekly suggestion first
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const previous = scheduled.find(n => n.content.data?.type === 'weekly_suggestion');
    if (previous) {
      await Notifications.cancelScheduledNotificationAsync(previous.identifier);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🍽️ Bu Hafta Ne Pişirsek?',
        body: `${recipeName} tarifini denediniz mi? Hemen bakın!`,
        data: { type: 'weekly_suggestion' },
        channelId: 'suggestions',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 1, // Monday
        hour: 10,
        minute: 0,
      },
    });
  } catch (error) {
    console.error('Weekly suggestion notification error:', error);
  }
};
