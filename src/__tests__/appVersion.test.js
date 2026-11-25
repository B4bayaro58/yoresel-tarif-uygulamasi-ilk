import { compareVersions, getUpdateRequirement, shouldShowSoftPrompt, UPDATE_PROMPT_SNOOZE_MS } from '../constants/appVersion';

describe('compareVersions', () => {
  test('sayısal karşılaştırır', () => {
    expect(compareVersions('1.10.0', '1.9.2')).toBe(1);
    expect(compareVersions('1.0.0', '1.1.0')).toBe(-1);
    expect(compareVersions('1.1', '1.1.0')).toBe(0);
    expect(compareVersions('2.0.0', '1.99.99')).toBe(1);
  });
});

describe('getUpdateRequirement', () => {
  const config = { latestVersion: '1.2.0', minVersion: '1.1.0' };
  test('minVersion altı zorunlu', () => expect(getUpdateRequirement('1.0.0', config)).toBe('force'));
  test('latestVersion altı isteğe bağlı', () => expect(getUpdateRequirement('1.1.0', config)).toBe('soft'));
  test('güncel sürüm', () => expect(getUpdateRequirement('1.2.0', config)).toBe(null));
  test('yeni sürüm (mağazadan önce) uyarı görmez', () => expect(getUpdateRequirement('1.3.0', config)).toBe(null));
  test('config yoksa sessiz', () => expect(getUpdateRequirement('1.0.0', null)).toBe(null));
});

describe('shouldShowSoftPrompt', () => {
  const now = 1_000_000_000_000;
  test('hiç kapatılmadıysa göster', () => expect(shouldShowSoftPrompt('1.2.0', null, now)).toBe(true));
  test('yakın zamanda kapatıldıysa gösterme', () =>
    expect(shouldShowSoftPrompt('1.2.0', { version: '1.2.0', at: now - 1000 }, now)).toBe(false));
  test('bekleme süresi dolunca göster', () =>
    expect(shouldShowSoftPrompt('1.2.0', { version: '1.2.0', at: now - UPDATE_PROMPT_SNOOZE_MS }, now)).toBe(true));
  test('daha yeni bir sürüm çıkınca hemen göster', () =>
    expect(shouldShowSoftPrompt('1.3.0', { version: '1.2.0', at: now - 1000 }, now)).toBe(true));
});
