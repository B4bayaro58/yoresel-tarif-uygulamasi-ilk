import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Save, X, Camera } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { pickImage, uploadRecipeImage } from '../services/imageUploadService';

const CONTINENT_KEYS = [
  { key: 'continent-europe', value: 'europe' },
  { key: 'continent-asia', value: 'asia' },
  { key: 'continent-africa', value: 'africa' },
  { key: 'continent-north-america', value: 'north-america' },
  { key: 'continent-south-america', value: 'south-america' },
  { key: 'continent-central-america', value: 'central-america' },
  { key: 'continent-oceania', value: 'oceania' },
  { key: 'continent-turkish-cuisine', value: 'turkish-cuisine' },
];

const CATEGORY_KEYS = [
  { key: 'category-main-course', value: 'main-course' },
  { key: 'category-dessert', value: 'dessert' },
  { key: 'category-soup', value: 'soup' },
  { key: 'category-salad', value: 'salad' },
  { key: 'category-breakfast', value: 'breakfast' },
  { key: 'category-appetizer', value: 'appetizer' },
];

const DIFFICULTY_KEYS = [
  { key: 'difficulty-easy', value: 'easy' },
  { key: 'difficulty-medium', value: 'medium' },
  { key: 'difficulty-hard', value: 'hard' },
];

const GRADIENT_MAP = {
  europe: ['#E74C3C', '#C0392B'],
  asia: ['#F39C12', '#E67E22'],
  africa: ['#27AE60', '#2ECC71'],
  'north-america': ['#2980B9', '#3498DB'],
  'south-america': ['#8E44AD', '#9B59B6'],
  'central-america': ['#16A085', '#1ABC9C'],
  oceania: ['#2C3E50', '#34495E'],
  'turkish-cuisine': ['#C0392B', '#E74C3C'],
};

const parseIngredients = (text) => {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      const match = line.match(/^([\d\/.,]+\s*[a-zA-ZğüşıöçĞÜŞİÖÇ]*)\s+(.+)/);
      if (match) {
        return { amount: match[1].trim(), name: match[2].trim() };
      }
      return { amount: '', name: line };
    });
};

const parseSteps = (text) => {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/^\d+\.\s*/, ''));
};

function SelectGroup({ label, options, value, onSelect, colors }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.selectRow}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.selectChip,
              {
                backgroundColor: value === opt.value ? colors.primary : colors.card,
                borderColor: value === opt.value ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.selectChipText,
                { color: value === opt.value ? '#fff' : colors.text },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function AddRecipeScreen({ navigation, route }) {
  const { colors, translate, showNotification, addRecipe, updateRecipe } = useApp();
  const { isAdmin, user } = useAuth();

  const editRecipe = route?.params?.recipe;
  const isEditMode = !!editRecipe;

  const formatIngredientsForEdit = (ingredients) =>
    (ingredients || []).map(i => `${i.amount} ${i.name}`.trim()).join('\n');

  const formatStepsForEdit = (steps) =>
    (steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n');

  const [recipeName, setRecipeName] = useState(editRecipe?.name || '');
  const [continent, setContinent] = useState(editRecipe?.continent || '');
  const [country, setCountry] = useState(editRecipe?.country || '');
  const [category, setCategory] = useState(editRecipe?.category || '');
  const [difficulty, setDifficulty] = useState(editRecipe?.difficulty || 'medium');
  const [prepTime, setPrepTime] = useState(editRecipe?.prepTime?.toString() || '');
  const [cookTime, setCookTime] = useState(editRecipe?.cookTime?.toString() || '');
  const [servings, setServings] = useState(editRecipe?.servings?.toString() || '');
  const [calories, setCalories] = useState(editRecipe?.calories?.toString() || '');
  const [protein, setProtein] = useState(editRecipe?.protein?.toString() || '');
  const [carbs, setCarbs] = useState(editRecipe?.carbs?.toString() || '');
  const [fat, setFat] = useState(editRecipe?.fat?.toString() || '');
  const [videoUrl, setVideoUrl] = useState(editRecipe?.videoUrl || '');
  const [emoji, setEmoji] = useState(editRecipe?.emoji || '');
  const [description, setDescription] = useState(editRecipe?.description || '');
  const [ingredients, setIngredients] = useState(
    isEditMode ? formatIngredientsForEdit(editRecipe.ingredients) : ''
  );
  const [steps, setSteps] = useState(
    isEditMode ? formatStepsForEdit(editRecipe.steps) : ''
  );
  const [loading, setLoading] = useState(false);
  const [photoUri, setPhotoUri] = useState(editRecipe?.photo || '');
  const [uploading, setUploading] = useState(false);

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result.success) {
      setPhotoUri(result.uri);
    } else if (result.error !== 'cancelled') {
      Alert.alert(translate('error'), result.error);
    }
  };

  const handleSave = async () => {
    // Required fields
    if (!recipeName.trim() || !continent || !country.trim() || !category) {
      Alert.alert(translate('error'), translate('requiredFields'));
      return;
    }
    if (recipeName.trim().length < 2 || recipeName.trim().length > 100) {
      Alert.alert(translate('error'), translate('recipeNameLength'));
      return;
    }
    if (!ingredients.trim() || !steps.trim()) {
      Alert.alert(translate('error'), translate('requiredIngredientsSteps'));
      return;
    }
    // Numeric validation
    if (prepTime && (isNaN(Number(prepTime)) || Number(prepTime) < 0 || Number(prepTime) > 1440)) {
      Alert.alert(translate('error'), translate('invalidPrepTime'));
      return;
    }
    if (cookTime && (isNaN(Number(cookTime)) || Number(cookTime) < 0 || Number(cookTime) > 1440)) {
      Alert.alert(translate('error'), translate('invalidCookTime'));
      return;
    }
    if (servings && (isNaN(Number(servings)) || Number(servings) < 1 || Number(servings) > 100)) {
      Alert.alert(translate('error'), translate('invalidServings'));
      return;
    }
    if (calories && (isNaN(Number(calories)) || Number(calories) < 0 || Number(calories) > 10000)) {
      Alert.alert(translate('error'), translate('invalidCalories'));
      return;
    }
    // URL validation
    if (videoUrl.trim() && !/^https?:\/\/.+/.test(videoUrl.trim())) {
      Alert.alert(translate('error'), translate('invalidVideoUrl'));
      return;
    }

    setLoading(true);

    // Upload image if a new local URI was selected
    let photoUrl = photoUri;
    if (photoUri && photoUri.startsWith('file')) {
      setUploading(true);
      const uploadResult = await uploadRecipeImage(photoUri, recipeName.trim());
      setUploading(false);
      if (uploadResult.success) {
        photoUrl = uploadResult.url;
      } else {
        Alert.alert(translate('warning'), translate('photoUploadFailed'));
        photoUrl = '';
      }
    }

    const recipeData = {
      name: recipeName.trim(),
      continent,
      country: country.trim(),
      category,
      difficulty,
      emoji: emoji.trim() || '🍽️',
      gradient: GRADIENT_MAP[continent] || ['#FF6B57', '#FF8C57'],
      photo: photoUrl,
      prepTime: parseInt(prepTime) || 30,
      cookTime: parseInt(cookTime) || 0,
      servings: parseInt(servings) || 4,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      videoUrl: videoUrl.trim(),
      description: description.trim(),
      ingredients: parseIngredients(ingredients),
      steps: parseSteps(steps),
    };

    const status = isAdmin ? 'approved' : 'pending';
    const fullData = isAdmin
      ? recipeData
      : { ...recipeData, submittedBy: user?.email || user?.uid || 'unknown' };

    // Statik tarif düzenleniyorsa Firebase'e yeni kayıt olarak ekle (override)
    const isStaticEdit = isEditMode && !editRecipe.isFirebase;
    const result = isEditMode && !isStaticEdit
      ? await updateRecipe(editRecipe.id, recipeData)
      : isStaticEdit
        ? await addRecipe({ ...recipeData, overridesStaticId: editRecipe.id }, 'approved')
        : await addRecipe(fullData, status);

    setLoading(false);

    if (result.success) {
      if (!isEditMode && !isAdmin) {
        Alert.alert(
          translate('recipeSubmitted'),
          translate('recipeSubmittedDesc'),
          [{ text: translate('ok'), onPress: () => navigation.goBack() }]
        );
      } else {
        showNotification(isEditMode ? translate('recipeUpdated') : translate('recipeAdded'));
        navigation.goBack();
      }
    } else {
      Alert.alert(translate('error'), translate('operationFailed') + ': ' + result.error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {isEditMode ? translate('editRecipe') : translate('addNewRecipe')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {translate('fillAllFields')}
        </Text>
      </View>

      <View style={styles.form}>
        {/* Photo Picker */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{translate('recipePhoto')}</Text>
          <TouchableOpacity
            style={[styles.photoPicker, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handlePickImage}
            activeOpacity={0.7}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            ) : (
              <>
                <Camera size={32} color={colors.textTertiary} />
                <Text style={[styles.photoPickerText, { color: colors.textTertiary }]}>
                  {translate('selectPhoto')}
                </Text>
              </>
            )}
          </TouchableOpacity>
          {uploading && (
            <View style={styles.uploadingRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.hint, { color: colors.textSecondary }]}>
                {translate('uploadingPhoto')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{translate('recipeName')} *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="Örn: Mantı"
            placeholderTextColor={colors.textTertiary}
            value={recipeName}
            onChangeText={setRecipeName}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <SelectGroup
          label={`${translate('continent')} *`}
          options={CONTINENT_KEYS.map(c => ({ label: translate(c.key), value: c.value }))}
          value={continent}
          onSelect={setContinent}
          colors={colors}
        />

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: colors.text }]}>{translate('country')} *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="Örn: Türkiye"
              placeholderTextColor={colors.textTertiary}
              value={country}
              onChangeText={setCountry}
            />
          </View>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: colors.text }]}>{translate('emoji')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="🍽️"
              placeholderTextColor={colors.textTertiary}
              value={emoji}
              onChangeText={setEmoji}
            />
          </View>
        </View>

        <SelectGroup
          label={`${translate('category')} *`}
          options={CATEGORY_KEYS.map(c => ({ label: translate(c.key), value: c.value }))}
          value={category}
          onSelect={setCategory}
          colors={colors}
        />

        <SelectGroup
          label={translate('difficulty')}
          options={DIFFICULTY_KEYS.map(d => ({ label: translate(d.key), value: d.value }))}
          value={difficulty}
          onSelect={setDifficulty}
          colors={colors}
        />

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: colors.text }]}>{translate('prepTimeMin')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="30"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={prepTime}
              onChangeText={setPrepTime}
            />
          </View>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: colors.text }]}>{translate('cookTimeMin')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="45"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={cookTime}
              onChangeText={setCookTime}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: colors.text }]}>{translate('portion')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="4"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={servings}
              onChangeText={setServings}
            />
          </View>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: colors.text }]}>{translate('caloriesKcal')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="350"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: colors.text }]}>{translate('proteinG')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="20"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={protein}
              onChangeText={setProtein}
            />
          </View>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: colors.text }]}>{translate('carbsG')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="45"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={carbs}
              onChangeText={setCarbs}
            />
          </View>
        </View>

        <View style={[styles.inputGroup, { maxWidth: '48%' }]}>
          <Text style={[styles.label, { color: colors.text }]}>{translate('fatG')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="12"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            value={fat}
            onChangeText={setFat}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{translate('videoUrl')}</Text>
          <Text style={[styles.hint, { color: colors.textTertiary }]}>
            {translate('videoUrlHint')}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="https://youtube.com/..."
            placeholderTextColor={colors.textTertiary}
            value={videoUrl}
            onChangeText={setVideoUrl}
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{translate('description')}</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder={translate('descriptionPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{translate('ingredientsLabel')} *</Text>
          <Text style={[styles.hint, { color: colors.textTertiary }]}>
            {translate('ingredientsHint')}
          </Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder={'500g un\n250ml su\n1 yumurta'}
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={5}
            value={ingredients}
            onChangeText={setIngredients}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{translate('stepsLabel')} *</Text>
          <Text style={[styles.hint, { color: colors.textTertiary }]}>
            {translate('stepsHint')}
          </Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder={'Unu bir kaba alın\nSuyu ekleyin\nYoğurun'}
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={6}
            value={steps}
            onChangeText={setSteps}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          disabled={loading}
        >
          <X size={20} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>{translate('cancel')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSave}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Save size={20} color="#fff" />
          )}
          <Text style={[styles.buttonText, { color: '#fff' }]}>
            {loading ? translate('saving') : isEditMode ? translate('update') : translate('save')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    padding: 20,
    paddingTop: 0,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  photoPicker: {
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 8,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPickerText: {
    fontSize: 14,
  },
  uploadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  selectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
