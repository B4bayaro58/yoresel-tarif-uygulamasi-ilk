import { RECIPES_DATA } from '../constants/recipes';
import {
  DAILY_MENU_CATEGORIES,
  getMenuDateKey,
  getMenuDayNumber,
  msUntilNextMenuRollover,
  pickAutoDailyMenu,
  resolveDailyMenu,
} from '../constants/dailyMenu';

const recipes = RECIPES_DATA.tr;
// İstanbul saati = UTC+3
const tr = (iso) => Date.parse(iso + '+03:00');

describe('günün menüsü', () => {
  test('menü İstanbul saatiyle 10:00da değişir', () => {
    expect(getMenuDateKey(tr('2026-11-19T09:59:59'))).toBe('2026-11-18');
    expect(getMenuDateKey(tr('2026-11-19T10:00:00'))).toBe('2026-11-19');
    expect(getMenuDateKey(tr('2026-11-20T03:00:00'))).toBe('2026-11-19');
    expect(msUntilNextMenuRollover(tr('2026-11-19T09:00:00'))).toBe(60 * 60 * 1000);
    expect(msUntilNextMenuRollover(tr('2026-11-19T10:00:00'))).toBe(24 * 60 * 60 * 1000);
  });

  test('çorba, ana yemek, salata, tatlı sırasıyla 4 tarif seçer', () => {
    const menu = pickAutoDailyMenu(recipes, tr('2026-11-19T12:00:00'));
    expect(menu.map((r) => r.category)).toEqual(DAILY_MENU_CATEGORIES);
    menu.forEach((r) => expect(r.photo).toBeTruthy());
  });

  test('aynı menü günü içinde ve liste sırasından bağımsız olarak aynı sonucu verir', () => {
    const a = pickAutoDailyMenu(recipes, tr('2026-11-19T10:00:00')).map((r) => r.id);
    const shuffled = [...recipes].reverse();
    const b = pickAutoDailyMenu(shuffled, tr('2026-11-20T09:59:00')).map((r) => r.id);
    expect(b).toEqual(a);
    const next = pickAutoDailyMenu(recipes, tr('2026-11-20T10:00:00')).map((r) => r.id);
    expect(next).not.toEqual(a);
  });

  test('kategori tükenmeden aynı tarif tekrar gelmez', () => {
    const start = getMenuDayNumber(tr('2026-11-19T12:00:00'));
    const salads = new Set();
    const saladPool = recipes.filter((r) => r.category === 'salad' && r.photo).length;
    for (let d = 0; d < saladPool; d++) {
      const now = (start + d) * 86400000 + 12 * 3600000;
      salads.add(pickAutoDailyMenu(recipes, now)[2].id);
    }
    expect(salads.size).toBe(saladPool);
  });

  test('elle menü yalnızca kaydedildiği menü günü geçerlidir', () => {
    const now = tr('2026-11-19T15:00:00');
    const settings = { recipeIds: ['lasagna'], menuDate: '2026-11-19' };
    expect(resolveDailyMenu(recipes, settings, now)).toMatchObject({ isManual: true });
    expect(resolveDailyMenu(recipes, settings, now).recipes.map((r) => r.id)).toEqual(['lasagna']);
    expect(resolveDailyMenu(recipes, settings, tr('2026-11-20T10:00:00')).isManual).toBe(false);
    // menuDate taşımayan eski kayıt ve boş liste → otomatik
    expect(resolveDailyMenu(recipes, { recipeIds: ['lasagna'] }, now).isManual).toBe(false);
    expect(resolveDailyMenu(recipes, { recipeIds: [], menuDate: '2026-11-19' }, now).isManual).toBe(false);
  });

  test('override edilmiş tarif statik kimliğiyle aynı sırada kalır', () => {
    const now = tr('2026-11-19T12:00:00');
    const soup = pickAutoDailyMenu(recipes, now)[0];
    const overridden = recipes.map((r) =>
      r.id === soup.id ? { ...r, id: 'fb123', overridesStaticId: soup.id } : r
    );
    expect(pickAutoDailyMenu(overridden, now)[0].id).toBe('fb123');
  });
});
