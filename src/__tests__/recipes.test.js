import { RECIPES_DATA } from '../constants/recipes';

const RECIPES = RECIPES_DATA.tr;

describe('Recipes data', () => {
  test('has at least 100 recipes', () => {
    expect(RECIPES.length).toBeGreaterThanOrEqual(100);
  });

  test('every recipe has required fields', () => {
    const requiredFields = ['id', 'name', 'continent', 'country', 'category', 'difficulty'];

    RECIPES.forEach((recipe) => {
      requiredFields.forEach((field) => {
        expect(recipe).toHaveProperty(field);
        expect(recipe[field]).toBeTruthy();
      });
    });
  });

  test('every recipe has ingredients array', () => {
    RECIPES.forEach((recipe) => {
      expect(Array.isArray(recipe.ingredients)).toBe(true);
      expect(recipe.ingredients.length).toBeGreaterThan(0);
    });
  });

  test('every recipe has steps array', () => {
    RECIPES.forEach((recipe) => {
      expect(Array.isArray(recipe.steps)).toBe(true);
      expect(recipe.steps.length).toBeGreaterThan(0);
    });
  });

  test('all recipe IDs are unique', () => {
    const ids = RECIPES.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('difficulty is valid enum value', () => {
    const validDifficulties = ['easy', 'medium', 'hard'];

    RECIPES.forEach((recipe) => {
      expect(validDifficulties).toContain(recipe.difficulty);
    });
  });

  test('category is valid enum value', () => {
    const validCategories = ['main-course', 'dessert', 'soup', 'salad', 'breakfast', 'appetizer', 'beverage', 'snack', 'side-dish'];

    RECIPES.forEach((recipe) => {
      expect(validCategories).toContain(recipe.category);
    });
  });

  test('continent is valid enum value', () => {
    const validContinents = [
      'europe', 'asia', 'africa', 'north-america', 'south-america',
      'central-america', 'oceania', 'turkish-cuisine',
    ];

    RECIPES.forEach((recipe) => {
      expect(validContinents).toContain(recipe.continent);
    });
  });
});
