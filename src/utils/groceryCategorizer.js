// Malzeme adına bakarak otomatik market kategorisi (kasap/manav/şarküteri...) tahmini.
// Anahtar kelime listesi öncelik sırasına göre kontrol edilir, ilk eşleşen kategori kullanılır.
const CATEGORY_KEYWORDS = [
  {
    id: 'kasap',
    keywords: [
      // tr
      'kıyma', 'tavuk', 'hindi', 'kuzu', 'dana', 'biftek', 'pirzola', 'but', 'kanat',
      'göğüs', 'antrikot', 'kontrfile', 'bonfile', 'kuşbaşı', 'balık', 'somon', 'levrek',
      'çipura', 'karides', 'midye', 'ciğer', 'et', 'köfte',
      // en
      'chicken', 'turkey', 'lamb', 'beef', 'steak', 'mince', 'ground meat', 'pork',
      'salmon', 'shrimp', 'prawn', 'mussel', 'fish', 'meat',
      // fr
      'poulet', 'dinde', 'agneau', 'bœuf', 'boeuf', 'porc', 'viande hachée', 'saumon', 'crevette', 'poisson',
      // it
      'pollo', 'tacchino', 'agnello', 'manzo', 'maiale', 'macinato', 'salmone', 'gamberi', 'pesce',
    ],
  },
  {
    id: 'sarkuteri',
    keywords: [
      // tr
      'sosis', 'sucuk', 'salam', 'pastırma', 'jambon', 'zeytin', 'turşu', 'lor peyniri',
      // en
      'sausage', 'salami', 'ham', 'olive', 'pickle', 'bacon',
      // fr
      'saucisse', 'jambon', 'olive', 'cornichon',
      // it
      'salsiccia', 'prosciutto', 'oliva', 'pancetta',
    ],
  },
  {
    id: 'sutUrunleri',
    keywords: [
      // tr
      'süt', 'yoğurt', 'peynir', 'tereyağı', 'krema', 'kaymak', 'ayran', 'kaşar',
      'lor', 'labne', 'mozzarella', 'parmesan', 'yumurta', 'queso',
      // en
      'milk', 'yogurt', 'yoghurt', 'cheese', 'butter', 'cream', 'egg',
      // fr
      'lait', 'yaourt', 'fromage', 'beurre', 'crème', 'œuf', 'oeuf',
      // it
      'latte', 'yogurt', 'formaggio', 'burro', 'panna', 'uovo', 'uova',
    ],
  },
  {
    id: 'manav',
    keywords: [
      // tr
      'domates', 'biber', 'soğan', 'sarımsak', 'patates', 'havuç', 'kabak', 'patlıcan',
      'salatalık', 'marul', 'ıspanak', 'broko', 'karnabahar', 'mantar', 'limon', 'elma',
      'muz', 'portakal', 'çilek', 'üzüm', 'kavun', 'karpuz', 'fesleğen', 'maydanoz',
      'dereotu', 'nane', 'taze', 'roka', 'pazı', 'kereviz', 'pırasa', 'bezelye', 'armut',
      'lahana', 'kayısı', 'erik', 'mısır', 'papaya', 'avokado', 'jalapeno', 'guacamole',
      'turp', 'tomatillo',
      // en
      'tomato', 'pepper', 'onion', 'garlic', 'potato', 'carrot', 'zucchini', 'eggplant',
      'cucumber', 'lettuce', 'spinach', 'broccoli', 'cauliflower', 'mushroom', 'lemon',
      'apple', 'banana', 'orange', 'strawberry', 'grape', 'basil', 'parsley', 'mint', 'fresh',
      // fr
      'tomate', 'poivron', 'oignon', 'ail', 'pomme de terre', 'carotte', 'courgette',
      'aubergine', 'concombre', 'laitue', 'épinard', 'champignon', 'citron', 'pomme',
      'basilic', 'persil', 'menthe',
      // it
      'pomodoro', 'peperone', 'cipolla', 'aglio', 'patata', 'carota', 'zucchina',
      'melanzana', 'cetriolo', 'lattuga', 'spinaci', 'fungo', 'limone', 'mela',
      'basilico', 'prezzemolo', 'menta',
    ],
  },
  {
    id: 'firin',
    keywords: [
      // tr
      'ekme', 'yufka', 'lavaş', 'pide', 'simit', 'kek', 'bisküvi', 'kruvasan',
      'lazanya yaprağı', 'galeta unu',
      // en
      'bread', 'tortilla', 'pita', 'cake', 'biscuit', 'croissant', 'breadcrumb', 'lasagna sheet',
      // fr
      'pain', 'galette', 'gâteau', 'biscuit', 'chapelure',
      // it
      'pane', 'focaccia', 'torta', 'biscotto', 'pangrattato',
    ],
  },
  {
    id: 'kuruBakliyat',
    keywords: [
      // tr
      'un', 'pirin', 'bulgur', 'mercimek', 'nohut', 'fasulye', 'makarna', 'şeker',
      'yağ', 'sirke', 'salça', 'tuz', 'zeytinyağı', 'ayçiçek', 'maya', 'kabartma tozu',
      'fıst', 'badem', 'kaju', 'fınd', 'ceviz', 'nişasta', 'reçel', 'erişte',
      'soya', 'tofu', 'miso', 'wasabi', 'nori', 'hoisin', 'sriracha', 'istiridye sos',
      'tamarind', 'galanga', 'kafir lime', 'kaffir lime', 'bambu',
      'mayonez', 'hardal', 'ketçap', 'bbq sos', 'worcestershire', 'oyster sauce',
      'acı sos', 'hot sauce', 'salsa', 'vanilya', 'kakao', 'çikolata', 'karbonat',
      'şurup', 'yulaf', 'masa harina', 'achiote', 'recado rojo',
      // en
      'flour', 'rice', 'lentil', 'chickpea', 'bean', 'pasta', 'sugar', 'oil', 'vinegar',
      'paste', 'olive oil', 'yeast', 'baking powder',
      // fr
      'farine', 'riz', 'lentille', 'pois chiche', 'haricot', 'pâtes', 'sucre', 'huile',
      'vinaigre', 'levure',
      // it
      'farina', 'riso', 'lenticchia', 'ceci', 'fagiolo', 'pasta', 'zucchero', 'olio',
      'aceto', 'lievito',
    ],
  },
  {
    id: 'baharat',
    keywords: [
      // tr
      'karabiber', 'kimyon', 'pul biber', 'kırmızı biber', 'tarçın', 'zencefil',
      'zerdeçal', 'defne yaprağı', 'susam', 'çörek otu', 'sumak', 'safran', 'muskat',
      'kişniş', 'baharat', 'kekik', 'kekik otu', 'köri', 'garam masala', 'kakule',
      'anason', 'galangal', 'karanfil', 'yenibahar', 'chili', 'chile',
      // en
      'black pepper', 'cumin', 'chili flakes', 'paprika', 'cinnamon', 'ginger',
      'turmeric', 'bay leaf', 'sesame', 'saffron', 'nutmeg', 'coriander', 'spice', 'oregano', 'thyme',
      // fr
      'poivre', 'cumin', 'paprika', 'cannelle', 'gingembre', 'curcuma', 'laurier',
      'sésame', 'safran', 'muscade', 'coriandre', 'épice', 'thym',
      // it
      'pepe', 'cumino', 'paprika', 'cannella', 'zenzero', 'curcuma', 'alloro',
      'sesamo', 'zafferano', 'noce moscata', 'coriandolo', 'spezie', 'timo', 'origano',
    ],
  },
  {
    id: 'temizlik',
    keywords: [
      'deterjan', 'bulaşık', 'çamaşır suyu', 'sabun', 'dezenfektan',
      'detergent', 'dish soap', 'bleach', 'disinfectant',
      'lessive', 'savon', 'désinfectant',
      'detersivo', 'sapone', 'disinfettante',
    ],
  },
];

export function categorizeIngredient(name) {
  if (!name) return 'diger';
  const normalized = name.toLocaleLowerCase('tr');
  for (const { id, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return id;
    }
  }
  return 'diger';
}
