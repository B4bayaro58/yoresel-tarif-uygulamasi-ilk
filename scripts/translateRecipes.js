/**
 * Yöresel Tarif - DeepL Çeviri Pipeline
 * Kullanım: node scripts/translateRecipes.js  (.env dosyasından key okunur)
 *
 * Tüm 300 tarifi Türkçe'den EN / FR / IT'ye çevirir.
 * Çıktı: src/constants/recipeTranslationsI18n.js
 *
 * DeepL free tier: 500.000 karakter/ay ücretsiz
 * Bu script tahminen ~350.000 karakter kullanır.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────────
const API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_URL = 'https://api-free.deepl.com/v2/translate';
const LANG_MAP = { en: 'EN-US', fr: 'FR', it: 'IT' };
const DELAY_MS = 300;   // DeepL rate limit çok cömert
const MAX_RETRIES = 3;
const PROGRESS_FILE = path.join(__dirname, '.translate-progress.json');
const OUTPUT_FILE = path.join(__dirname, '../src/constants/recipeTranslationsI18n.js');

// ── Validation ───────────────────────────────────────────────────────────────
if (!API_KEY) {
  console.error('\n❌  DEEPL_API_KEY bulunamadı!');
  console.error('   .env dosyasına şunu ekle: DEEPL_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx\n');
  process.exit(1);
}

const { RECIPES_DATA } = require('../src/constants/recipes.js');
const allRecipes = RECIPES_DATA.tr;
console.log(`\n📖  ${allRecipes.length} tarif yüklendi.\n`);

// ── DeepL API ─────────────────────────────────────────────────────────────────
async function deeplTranslate(texts, targetLang, attempt = 1) {
  try {
    const res = await fetch(DEEPL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texts,
        source_lang: 'TR',
        target_lang: LANG_MAP[targetLang],
      }),
    });

    if (res.status === 429) {
      const wait = Math.min(parseInt(res.headers.get('retry-after') || '15') + 1, 60) * 1000;
      console.warn(`\n  ⏳ Rate limit — ${wait / 1000}s bekleniyor...`);
      await sleep(wait);
      return deeplTranslate(texts, targetLang, attempt);
    }

    if (res.status === 456) {
      console.error('\n  ❌ Aylık ücretsiz karakter kotası doldu (500k).');
      console.error('   deepl.com/pro adresinden planı yükselt veya yarın tekrar dene.\n');
      process.exit(1);
    }

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DeepL ${res.status}: ${err.slice(0, 200)}`);
    }

    const data = await res.json();
    return data.translations.map(t => t.text);
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      const wait = attempt * 3000;
      console.warn(`\n  ⚠️  Deneme ${attempt} başarısız, ${wait / 1000}s sonra...`);
      await sleep(wait);
      return deeplTranslate(texts, targetLang, attempt + 1);
    }
    throw err;
  }
}

// ── Metin Çıkarma & Yeniden Oluşturma ────────────────────────────────────────
function extractTexts(recipe) {
  const texts = [];
  const meta = { ingCount: recipe.ingredients.length, altCounts: [], stepCount: recipe.steps.length };

  // Malzeme adı + miktar
  recipe.ingredients.forEach(ing => {
    texts.push(ing.name);
    texts.push(ing.amount);
  });

  // Alternatifler
  recipe.ingredients.forEach(ing => {
    const alts = ing.alternatives || [];
    meta.altCounts.push(alts.length);
    alts.forEach(a => texts.push(a));
  });

  // Adımlar
  recipe.steps.forEach(s => texts.push(s));

  return { texts, meta };
}

function reconstructFromTranslation(recipe, translated, meta) {
  const ingredients = recipe.ingredients.map((_, i) => ({
    name: translated[i * 2],
    amount: translated[i * 2 + 1],
    alternatives: [],
  }));

  let idx = meta.ingCount * 2;
  recipe.ingredients.forEach((_, i) => {
    for (let j = 0; j < meta.altCounts[i]; j++) {
      ingredients[i].alternatives.push(translated[idx++]);
    }
  });

  const steps = recipe.steps.map((_, i) => translated[idx + i]);
  return { ingredients, steps };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')); }
    catch { return null; }
  }
  return null;
}

function saveProgress(data) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
}

function writeOutputFile(ingredientI18n, stepsI18n) {
  const content = `// AUTO-GENERATED — scripts/translateRecipes.js tarafından oluşturuldu
// Yeniden üretmek için: node scripts/translateRecipes.js

export const INGREDIENT_I18N = ${JSON.stringify(ingredientI18n, null, 2)};

export const STEPS_I18N = ${JSON.stringify(stepsI18n, null, 2)};
`;
  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const ingredientI18n = {};
  const stepsI18n = {};
  let startIndex = 0;
  let totalChars = 0;

  const progress = loadProgress();
  if (progress) {
    Object.assign(ingredientI18n, progress.ingredientI18n);
    Object.assign(stepsI18n, progress.stepsI18n);
    startIndex = progress.nextIndex;
    totalChars = progress.totalChars || 0;
    const done = Object.keys(ingredientI18n).length;
    console.log(`▶️   İlerleme: ${done}/${allRecipes.length} tarif çevrilmiş. ${startIndex}. tariften devam...\n`);
  }

  for (let i = startIndex; i < allRecipes.length; i++) {
    const recipe = allRecipes[i];
    const pct = Math.round(((i + 1) / allRecipes.length) * 100);

    process.stdout.write(`[${String(i + 1).padStart(3)}/${allRecipes.length}] %${pct} — ${recipe.id}... `);

    try {
      const { texts, meta } = extractTexts(recipe);
      totalChars += texts.join('').length * 3; // × 3 dil

      const [enResult, frResult, itResult] = await Promise.all([
        deeplTranslate(texts, 'en'),
        deeplTranslate(texts, 'fr'),
        deeplTranslate(texts, 'it'),
      ]);

      const en = reconstructFromTranslation(recipe, enResult, meta);
      const fr = reconstructFromTranslation(recipe, frResult, meta);
      const it = reconstructFromTranslation(recipe, itResult, meta);

      ingredientI18n[recipe.id] = { en: en.ingredients, fr: fr.ingredients, it: it.ingredients };
      stepsI18n[recipe.id] = { en: en.steps, fr: fr.steps, it: it.steps };

      console.log(`✓  (~${Math.round(totalChars / 1000)}k kar)`);

      saveProgress({ ingredientI18n, stepsI18n, nextIndex: i + 1, totalChars });

    } catch (err) {
      console.error('\n❌  Hata:', err.message);
      console.log('   İlerleme kaydedildi. Komutu tekrar çalıştır.\n');
      if (Object.keys(ingredientI18n).length > 0) writeOutputFile(ingredientI18n, stepsI18n);
      process.exit(1);
    }

    if (i < allRecipes.length - 1) await sleep(DELAY_MS);
  }

  writeOutputFile(ingredientI18n, stepsI18n);
  if (fs.existsSync(PROGRESS_FILE)) fs.unlinkSync(PROGRESS_FILE);

  const count = Object.keys(ingredientI18n).length;
  console.log(`\n✅  Tamamlandı! ${count}/${allRecipes.length} tarif çevrildi.`);
  console.log(`   Toplam kullanılan karakter: ~${Math.round(totalChars / 1000)}k`);
  console.log(`   Çıktı: src/constants/recipeTranslationsI18n.js\n`);
}

main().catch(err => {
  console.error('\n💥 Beklenmedik hata:', err);
  process.exit(1);
});
