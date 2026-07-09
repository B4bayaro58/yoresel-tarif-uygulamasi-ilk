import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

let ImagePicker = null;
let ImageManipulator = null;

try {
  ImagePicker = require('expo-image-picker');
} catch (e) {
  console.warn('expo-image-picker not available:', e.message);
}

try {
  ImageManipulator = require('expo-image-manipulator');
} catch (e) {
  console.warn('expo-image-manipulator not available:', e.message);
}

// Uygulamada kullanılan fotoğraf oranı: 4:3, max 1024x768
const TARGET_WIDTH = 1024;
const TARGET_HEIGHT = 768;

export const pickImage = async () => {
  if (!ImagePicker) {
    return { success: false, error: 'Resim seçici bu ortamda desteklenmiyor.' };
  }

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    return { success: false, error: 'Galeri izni reddedildi.' };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (result.canceled) return { success: false, error: 'cancelled' };

  const asset = result.assets[0];
  let finalUri = asset.uri;

  // Resmi 1024×768 (4:3) ölçeğine küçült ve sıkıştır
  if (ImageManipulator) {
    try {
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: TARGET_WIDTH, height: TARGET_HEIGHT } }],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      finalUri = manipulated.uri;
    } catch (manipError) {
      console.warn('Image resize failed, using original:', manipError.message);
    }
  }

  return { success: true, uri: finalUri };
};

export const uploadRecipeImage = async (uri, recipeId) => {
  try {
    // Blob tabanlı yükleme — base64'e göre çok daha güvenilir ve hızlı
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Dosya okunamadı: ${response.status}`);
    }
    const blob = await response.blob();

    const storageRef = ref(storage, `recipes/${recipeId}_${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob, {
      contentType: 'image/jpeg',
      cacheControl: 'public, max-age=31536000, immutable',
    });
    const downloadURL = await getDownloadURL(storageRef);

    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Image upload error:', error);
    return { success: false, error: error.message };
  }
};
