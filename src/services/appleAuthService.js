import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

// Apple Sign-In sadece iOS'ta var (Android/web'de expo-apple-authentication
// çalışmaz) -- Google'daki "eksik key = sessiz no-op" deseninin iOS-only
// karşılığı.
export async function isAppleSignInAvailable() {
  if (Platform.OS !== 'ios') return false;
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
}

// Apple hesabıyla oturum açtırır, Firebase'in OAuthProvider('apple.com')
// credential'ına verilecek identityToken + rawNonce'u döner. Apple'ın replay
// saldırılarına karşı önerdiği nonce deseni: ham nonce Apple'a hash'lenmiş
// halde gönderilir, Firebase'e doğrulama için ham hali verilir. İptal
// edilirse `null` döner (hata fırlatmaz -- kullanıcının vazgeçmesi hata değil).
export async function signInWithApple() {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce
  );

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    if (!credential.identityToken) return null;

    return {
      identityToken: credential.identityToken,
      rawNonce,
      fullName: credential.fullName,
      // Hesap silmede Apple token'ını iptal etmek (revokeAccessToken) için
      // gerekli -- App Store kuralı 5.1.1(v).
      authorizationCode: credential.authorizationCode,
    };
  } catch (error) {
    if (error.code === 'ERR_REQUEST_CANCELED') return null;
    throw error;
  }
}
