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
      // Uygulama açıkken de bildirim ekranın üstünde görünsün ve sesi çalsın
      // (zamanlayıcı bitince kullanıcı tarif ekranında olabilir).
      // shouldShowAlert SDK 54'te eskidi; banner/list yeni karşılığı.
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
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
      await ensureTimerChannel();
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

// Alarm sesi: assets/sounds/timer_alarm.wav (app.config.js'deki
// expo-notifications eklentisiyle uygulamaya gömülür; yeni native build gerekir).
const TIMER_SOUND = 'timer_alarm.wav';
// Android'de bir kanalın sesi oluşturulduktan sonra değiştirilemiyor; eski
// 'timer' kanalı varsayılan "ding" sesiyle oluşturulmuştu, bu yüzden alarm
// sesli yeni bir kanal açılıp eskisi siliniyor.
const TIMER_CHANNEL_ID = 'timer_alarm';

const ensureTimerChannel = async () => {
  if (!Notifications || Platform.OS !== 'android') return;
  try {
    await Notifications.setNotificationChannelAsync(TIMER_CHANNEL_ID, {
      name: 'Pişirme Zamanlayıcısı',
      importance: Notifications.AndroidImportance.MAX,
      sound: TIMER_SOUND,
      vibrationPattern: [0, 500, 250, 500, 250, 500],
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: false,
    });
    await Notifications.deleteNotificationChannelAsync('timer').catch(() => {});
  } catch (e) {
    console.warn('Timer channel setup failed:', e.message);
  }
};

// Zamanlayıcı başlatılırken çağrılır: açılıştaki izin istemi atlanmış/ertelenmişse
// kullanıcı ilk zamanlayıcıyı kurduğunda tekrar sorulur (reddedildiyse sistem
// tekrar sormaz, sessizce false döner).
const ensureNotificationPermission = async () => {
  try {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    if (status === 'granted') return true;
    if (!canAskAgain) return false;
    const res = await Notifications.requestPermissionsAsync();
    return res.status === 'granted';
  } catch {
    return false;
  }
};

/**
 * Zamanlayıcı bitişi için alarm sesli bildirim planlar.
 * @param {number} seconds  Kalan süre (saniye) — duraklat/devam ettir'de kalan süreyle yeniden planlanır.
 * @param {{title: string, body: string}} content
 */
export const scheduleTimerNotification = async (seconds, { title, body }) => {
  if (!Notifications) return null;
  try {
    await ensureNotificationPermission();
    await ensureTimerChannel();
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: TIMER_SOUND,
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: { type: 'cooking_timer' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, Math.round(seconds)),
        channelId: TIMER_CHANNEL_ID,
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
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        channelId: 'suggestions',
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
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        channelId: 'suggestions',
        weekday: 1, // Monday
        hour: 10,
        minute: 0,
      },
    });
  } catch (error) {
    console.error('Weekly suggestion notification error:', error);
  }
};
