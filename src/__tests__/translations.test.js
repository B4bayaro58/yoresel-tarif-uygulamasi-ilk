import { TRANSLATIONS } from '../constants/translations';

const SUPPORTED_LANGUAGES = ['tr', 'en', 'fr', 'it'];

describe('Translations', () => {
  test('all translation keys have all 4 languages', () => {
    const missingKeys = [];

    Object.entries(TRANSLATIONS).forEach(([key, value]) => {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        if (typeof value[lang] !== 'string') {
          missingKeys.push(`${key}.${lang}`);
        }
      });
    });

    if (missingKeys.length > 0) {
      console.warn('Missing translations:', missingKeys);
    }
    expect(missingKeys).toEqual([]);
  });

  test('no empty translation values', () => {
    const emptyKeys = [];

    Object.entries(TRANSLATIONS).forEach(([key, value]) => {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        if (typeof value[lang] === 'string' && value[lang].trim() === '') {
          emptyKeys.push(`${key}.${lang}`);
        }
      });
    });

    expect(emptyKeys).toEqual([]);
  });

  test('essential keys exist', () => {
    const essentialKeys = [
      'appTitle', 'home', 'favorites', 'shoppingList', 'profile',
      'search', 'searchRecipes', 'noResults', 'allRecipes',
      'loginButton', 'registerButton', 'password', 'fullName',
    ];

    essentialKeys.forEach((key) => {
      expect(TRANSLATIONS).toHaveProperty(key);
    });
  });

  test('parameterized translations contain placeholders', () => {
    // Check that keys with parameters have {param} pattern in at least TR
    const paramKeys = ['recipesFound', 'manageRecipesSubtitle', 'manageUsersSubtitle', 'pendingRecipesSubtitle'];

    paramKeys.forEach((key) => {
      if (TRANSLATIONS[key]) {
        const hasBrackets = /\{.+?\}/.test(TRANSLATIONS[key].tr);
        expect(hasBrackets).toBe(true);
      }
    });
  });
});
