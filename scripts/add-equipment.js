/**
 * Script: add-equipment.js
 * Adds equipment: [...] field to every recipe in recipes.js
 * Run: node scripts/add-equipment.js
 */

const fs = require('fs');
const path = require('path');

// ─── Equipment rules ────────────────────────────────────────────────────────
// Each rule: { ids?: string[], keywords?: string[], add: string[] }
// ids = recipe id substrings, keywords = step-text substrings

const RULES = [
  // Sushi / onigiri / gimbap
  { ids: ['sushi','gimbap'], add: ['Bambu sarma matı', 'Pirinç pişirici'] },
  { ids: ['onigiri'], add: ['Pirinç pişirici', 'Plastik streç film veya bambu mat'] },

  // Wok
  { ids: ['pad-thai','pad-see-ew','pad-kra-pao','khao-pad','nasi-goreng','nasi',
          'kung-pao','mapo','bulgogi','japchae','zhajiangmian','dan-dan',
          'gaeng-keow','moo','kai-med','tod-mun','khao-soi','larb',
          'som-tum','dakgalbi','yangnyeom','jollof','jollof-rice',
          'suya','egusi','thieboudienne','piri-piri','maafe','ful-medames',
          'doro-wat','plov','tsuivan','lagman','kuzu-tandir'],
    add: ['Wok veya büyük tava'] },

  // Kızartma tavaları (derin yağ)
  { ids: ['tempura','arancini','calamari','falafel','churros','samosa',
          'spring-roll-fried','spring-rolls-thai','yuca-frita','tostones',
          'mozzarella-stick','onion-ring','fish-and-chips','tonkatsu',
          'katsu','coxinha','puff-puff','akara','brik','maakouda','kibbeh',
          'lumpia','agedashi','bindaetteok','briouats','chiko-roll',
          'mandazi','sambusa','moin-moin','lahmacun','icli-kofte',
          'cig-kofte','jalapeno','momo','takoyaki','gyoza',
          'chickenwaffles','chicken-waffles','buffalo-wing','onion-bhaji',
          'pao-de-queijo','siu-mai','har-gow'],
    add: ['Derin kızartma tavası veya fritöz', 'Yağ süzgeçli kevgir'] },

  // Waffle
  { ids: ['waffle','chicken-waffles'], add: ['Waffle makinesi'] },

  // Buharlı pişirici / buğulama
  { ids: ['xiaolongbao','siu-mai','har-gow','momo','tamale',
          'tamales','tamales-mexicanos','injera','dosa','dosa-sambar',
          'umu','lovo','hangi','rewena','congee','hobak-juk',
          'matoke','ugali','sadza','nshima','aseeda','isombe',
          'bossam','cochinita-pibil','dim-sum'],
    add: ['Buharlı pişirici (bambu veya metal)'] },

  // Izgara / barbekü
  { ids: ['kebap','kebab','yakitori','anticucho','suya','asado','churrasco',
          'bbq','pljeskavica','cevapi','satay','chicken-satay','nyama-choma',
          'bulgogi','samgyeopsal','dakgalbi','grilladas','barramundi',
          'fish-chips-nz','lobster-roll','shrimp'],
    add: ['Izgara tava veya dış mekan barbekü', 'Metal veya bambu şişler'] },

  // Tajin
  { ids: ['tagine','tajine','moroccan-tagine','tagine','bobotie'],
    add: ['Tajin tenceresi (veya kapaklı ağır tencere)'] },

  // Crème brûlée / meşale
  { ids: ['creme-brulee','kazandibi'],
    add: ['Mutfak meşalesi (brülör)', 'Fırına dayanıklı ramekinler'] },

  // Kalıplı tatlılar
  { ids: ['cheesecake','ny-cheesecake','tarte-tatin','quiche','key-lime-pie',
          'pecan-pie','far-breton','galette-bretonne','tourtiere','meat-pie',
          'torta-della','torta-nonna','pavlova','lamington','tim-tam',
          'tres-leches','flan-mexicano','sutlac','kunefe'],
    add: ['Çıkarılabilir kenarlı fırın kalıbı veya yuvarlak pasta tepsisi'] },

  // Pizza / pide / lahmacun
  { ids: ['pizza','lahmacun','pide','focaccia'],
    add: ['Pizza taşı veya fırın tepsisi', 'Hamur oklava'] },

  // Düz tava / sac (gözleme, tortilla, krep vb.)
  { ids: ['tortilla','tortilla-espanola','tacos','taco','roti','roti-canai',
          'crepe','crepes','galette','pancake','maple-pancake',
          'hotteok','scallion-pancake','arepas','arepas-colombianas',
          'pupusas','lahmacun','dosa','injera','gözleme',
          'flatbread','maldives','atayef','blinis'],
    add: ['Düz tava veya demir sac (tava)'] },

  // Hamur işleri (mixer gerektirebilir)
  { ids: ['croissant','focaccia','rewena','baklava','briouats',
          'madeleines','gougeres','far-breton','anzac','lamington',
          'churros','sarmale','coxinha','pao-de-queijo',
          'brigadeiros','brigadeiro','alfajores','tiramisu',
          'cheesecake','ny-cheesecake','tres-leches','butter-tart',
          'tarte-tatin','pecan-pie','key-lime-pie','torta-nonna',
          'foie-gras','galette-bretonne'],
    add: ['Hamur yoğurma kabı', 'Oklava'] },

  // Havan
  { ids: ['som-tum','miang','larb','green-curry','curry-paste',
          'red-curry','massaman','panang','thai-iced-tea','harira',
          'muhammara','harissa','tapenade','dukkah'],
    add: ['Havan ve tokmak'] },

  // Blender / mutfak robotu
  { ids: ['hummus','gazpacho','vichyssoise','guacamole','muhammara',
          'harissa','tapenade','tzatziki','labneh','soupe-oignon',
          'clam-chowder','scotch-cullen','scotland-cullen',
          'vichyssoise','harira','bouillabaisse','ribollita',
          'minestrone','soupe-au-pistou','injera','dal-tadka',
          'india-dal','dal-bhat','pav-bhaji','chole','palak-paneer',
          'bastilla','mole-chicken'],
    add: ['Blender veya mutfak robotu'] },

  // Düdüklü tencere
  { ids: ['biryani','nihari','kabuli-pulao','kuru-fasulye',
          'feijoada','chole-bhature','ghormeh','locro',
          'sancocho','bandeja','cassoulet','bigos','gulyas',
          'boeuf-bourguignon','sauerbraten','daube','ribollita',
          'pot-au-feu','irish-stew','scotch','tsuivan','seswaa',
          'botswana','palm-butter','moambe','muamba'],
    add: ['Düdüklü tencere (veya kapaklı ağır döküm tencere)'] },

  // Rende gerektiren tarifler
  { ids: ['lasagna','moussaka','pizza','tiramisu','cacio-e-pepe',
          'pasta-amatriciana','pasta-carbonara','risotto','gnocchi',
          'mac-and-cheese','gratin','schnitzel','spanakopita','börek'],
    add: ['Rende'] },

  // Özel aletler
  { ids: ['eggs-benedict','cilbir'], add: ['Derin tencere (haşlama için)', 'Su ısıtıcı veya tencere'] },
  { ids: ['miso-ramen','pho','bun-bo-hue','taiwan-beef-noodle','mohinga',
          'harira','tteokguk','sikhye','congee'],
    add: ['Büyük çorba tenceresi', 'Kevgir veya süzgeç'] },
  { ids: ['takoyaki'], add: ['Takoyaki tavası (özel bölmeli)'] },
  { ids: ['okonomiyaki'], add: ['Düz demir sac veya teflon tava', 'Geniş spatula'] },
  { ids: ['cheese-fondue','fondue'], add: ['Fondue seti (veya çift katmanlı tencere)', 'Uzun çatallı şişler'] },
  { ids: ['panna-cotta','sutlac','flan','creme-brulee'],
    add: ['Küçük servis kapları (ramekin)'] },
  { ids: ['risotto','risotto-milanese'], add: ['Büyük ağır tabanlı tava veya sote tavası', 'Kepçe'] },
  { ids: ['ossobuco','boeuf-bourguignon','coq-au-vin','cassoulet','daube'],
    add: ['Döküm veya ağır kapaklı tencere (Dutch oven)'] },
  { ids: ['gimbap','sushi'], add: ['Bambu sarma matı'] },
  { ids: ['bouillabaisse'], add: ['Büyük derin tencere', 'Ekmek tost tepsisi'] },
  { ids: ['crème-brûlée','creme-brulee'], add: ['Mutfak meşalesi'] },
  { ids: ['naengmyeon'], add: ['Soğuk servis kasesi', 'Makarna süzgeci'] },
  { ids: ['hotteok'], add: ['Basma spatulası veya pres'] },
  { ids: ['gyeran-mari'], add: ['Dikdörtgen Japon omlette tavası (tamagoyaki pan)'] },
  { ids: ['gimbap'], add: ['Bambu sarma matı'] },
  { ids: ['peking-duck','confit-de-canard'], add: ['Asma kancası veya ızgara rafı', 'Fırın'] },
  { ids: ['dim-sum','baozi','char-siu-bao'], add: ['Bambu buhar sepeti'] },
  { ids: ['tandoor','kuzu-tandir'], add: ['Toprak fırın (tandır) veya yavaş pişirici'] },
  { ids: ['ema-datshi'], add: ['Orta boy tencere', 'Ahşap kaşık'] },
  { ids: ['manti','armenia-manti'], add: ['Geniş buharlı pişirici veya büyük tencere', 'Oklava'] },
  { ids: ['khachapuri'], add: ['Fırın tepsisi', 'Oklava'] },
  { ids: ['mas-huni'], add: ['Hindistan cevizi rendesi', 'Karıştırma kabı'] },
  { ids: ['dushbara','azerba'], add: ['Büyük tencere', 'Küçük hamur kalıbı'] },
  { ids: ['lagman'], add: ['Büyük tencere', 'Makarna makinesi veya oklava'] },
  { ids: ['beshbarmak'], add: ['Büyük kazanda tencere', 'Geniş servis tabağı'] },
  { ids: ['briouats'], add: ['Fırın tepsisi', 'Fırça (yağ için)'] },
  { ids: ['bastilla'], add: ['Yuvarlak fırın tepsisi', 'Mutfak robotu'] },
  { ids: ['harira'], add: ['Büyük tencere', 'Blender (isteğe bağlı)'] },
  { ids: ['bunny-chow'], add: ['Tencere', 'Ekmek bıçağı'] },
];

// Category-based fallback equipment
const CATEGORY_EQUIPMENT = {
  'soup':        ['Büyük tencere', 'Kepçe'],
  'stew':        ['Derin tencere veya güveç', 'Tahta kaşık'],
  'salad':       ['Salata kasesi', 'Çırpma teli'],
  'dessert':     ['Karıştırma kabı', 'Fırın tepsisi'],
  'appetizer':   ['Kesme tahtası', 'Küçük servis tabakları'],
  'main-course': ['Tava veya tencere'],
  'breakfast':   ['Tava', 'Çırpma teli'],
  'side-dish':   ['Tencere veya tava'],
  'beverage':    ['Çaydanlık veya tencere', 'Süzgeç'],
};

// Always-added basics
const ALWAYS = ['Kesme tahtası', 'Şef bıçağı'];

function getEquipment(id, category, stepsText) {
  const equipment = new Set(ALWAYS);
  const s = stepsText.toLowerCase();
  const idL = id.toLowerCase();

  // Apply specific rules
  for (const rule of RULES) {
    if (rule.ids && rule.ids.some(x => idL.includes(x))) {
      rule.add.forEach(e => equipment.add(e));
    }
    if (rule.keywords && rule.keywords.some(x => s.includes(x))) {
      rule.add.forEach(e => equipment.add(e));
    }
  }

  // Keyword-based from steps
  if (s.includes('fırın') || /\d{3}°/i.test(s) || s.includes('180') && s.includes('°c') || s.includes('200') && s.includes('°c')) {
    equipment.add('Fırın');
    equipment.add('Fırın tepsisi');
  }
  if ((s.includes('tava') || s.includes('kavur') || s.includes('sotele') || s.includes('kızart')) && !equipment.has('Wok veya büyük tava')) {
    equipment.add('Tava');
  }
  if (s.includes('tencere') || s.includes('kaynat') || s.includes('haşla')) {
    equipment.add('Tencere');
  }
  if (s.includes('wok')) {
    equipment.add('Wok veya büyük tava');
  }
  if (s.includes('blender') || s.includes('mikser')) {
    equipment.add('Blender veya mutfak robotu');
  }
  if (s.includes('hamur') && (s.includes('yoğur') || s.includes('aç'))) {
    equipment.add('Hamur yoğurma kabı');
    equipment.add('Oklava');
  }
  if (s.includes('rende') || s.includes('rendelendi')) {
    equipment.add('Rende');
  }
  if (s.includes('ızgara') || s.includes('izgara')) {
    equipment.add('Izgara tava veya dış mekan barbekü');
  }
  if (s.includes('buharda') || s.includes('buhar')) {
    equipment.add('Buharlı pişirici');
  }
  if (s.includes('şiş') || s.includes('sis ')) {
    equipment.add('Metal veya bambu şişler');
  }
  if (s.includes('çırp') || s.includes('çırpma')) {
    equipment.add('Çırpma teli');
  }

  // Category fallback
  const catItems = CATEGORY_EQUIPMENT[category] || [];
  catItems.forEach(e => equipment.add(e));

  return Array.from(equipment);
}

// ─── Main transformation ─────────────────────────────────────────────────────
const filePath = path.join(__dirname, '../src/constants/recipes.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const result = [];
let currentId = null;
let currentCategory = null;
let currentSteps = [];
let inSteps = false;
let stepDepth = 0;

// First pass: collect steps text per recipe id
const recipeStepsMap = {};
{
  let cid = null;
  let csteps = [];
  let inS = false;
  let depth = 0;

  for (const line of lines) {
    const idMatch = line.match(/^\s+id:\s+'([^']+)'/);
    if (idMatch) {
      cid = idMatch[1];
      csteps = [];
      inS = false;
      depth = 0;
    }
    if (cid) {
      if (!inS && line.match(/^\s+steps:\s*\[/)) {
        inS = true;
        depth = 1;
        continue;
      }
      if (inS) {
        for (const ch of line) {
          if (ch === '[') depth++;
          if (ch === ']') depth--;
        }
        if (depth > 0) {
          csteps.push(line);
        } else {
          inS = false;
          recipeStepsMap[cid] = csteps.join(' ');
        }
      }
    }
  }
}

// Second pass: collect category per recipe id
const recipeCategoryMap = {};
{
  let cid = null;
  for (const line of lines) {
    const idMatch = line.match(/^\s+id:\s+'([^']+)'/);
    if (idMatch) cid = idMatch[1];
    if (cid) {
      const catMatch = line.match(/^\s+category:\s+'([^']+)'/);
      if (catMatch) {
        recipeCategoryMap[cid] = catMatch[1];
      }
    }
  }
}

// Third pass: insert equipment before steps
let processedId = null;
let equipmentInserted = new Set();

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const idMatch = line.match(/^\s+id:\s+'([^']+)'/);
  if (idMatch) {
    processedId = idMatch[1];
  }

  // Skip existing equipment lines (idempotent)
  if (line.match(/^\s+equipment:\s*\[/)) {
    // Skip until closing ]
    let depth = 0;
    for (const ch of line) {
      if (ch === '[') depth++;
      if (ch === ']') depth--;
    }
    if (depth <= 0) {
      // Single line equipment, skip
      continue;
    } else {
      // Multi-line, skip until done
      while (depth > 0 && i < lines.length - 1) {
        i++;
        for (const ch of lines[i]) {
          if (ch === '[') depth++;
          if (ch === ']') depth--;
        }
      }
      continue;
    }
  }

  // Insert equipment before steps
  if (line.match(/^\s+steps:\s*\[/) && processedId && !equipmentInserted.has(processedId)) {
    const indent = (line.match(/^(\s+)/) || ['','      '])[1];
    const stepsText = recipeStepsMap[processedId] || '';
    const category = recipeCategoryMap[processedId] || 'main-course';
    const equipment = getEquipment(processedId, category, stepsText);
    const equipLine = `${indent}equipment: [${equipment.map(e => `'${e}'`).join(', ')}],`;
    result.push(equipLine);
    equipmentInserted.add(processedId);
  }

  result.push(line);
}

const newContent = result.join('\n');
fs.writeFileSync(filePath, newContent, 'utf8');
console.log(`✅ Done! Added equipment to ${equipmentInserted.size} recipes.`);
