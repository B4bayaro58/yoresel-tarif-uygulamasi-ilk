import Constants from 'expo-constants';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';

const extra = Constants.expoConfig?.extra ?? {};

let configured = false;

// Web client ID (Firebase Console > Authentication > Sign-in method > Google
// etkinleştirilince oluşur) yoksa buton hiç gösterilmez -- AdMob/RevenueCat'te
// kullanılan "eksik key = sessiz no-op" deseniyle aynı.
export const isGoogleSignInAvailable = () => !!extra.googleWebClientId;

function ensureConfigured() {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: extra.googleWebClientId,
    iosClientId: extra.googleIosClientId || undefined,
  });
  configured = true;
}

// Google hesabıyla oturum açtırır, Firebase'in signInWithCredential'ına
// verilecek idToken'ı döner. İptal edilirse `null` döner (hata fırlatmaz --
// kullanıcının vazgeçmesi bir hata değil).
export async function signInWithGoogle() {
  if (!extra.googleWebClientId) {
    throw new Error('Google Sign-In henüz yapılandırılmadı');
  }
  ensureConfigured();
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) {
    return null;
  }
  return response.data.idToken;
}
