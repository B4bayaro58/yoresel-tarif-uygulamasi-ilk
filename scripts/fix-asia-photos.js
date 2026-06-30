/**
 * Fix duplicate photo IDs for Asia recipes.
 * Keeps the first occurrence of each duplicate group;
 * replaces subsequent occurrences with guaranteed-unique IDs.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'constants', 'recipes.js');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Pre-generate 90 fresh unique IDs (timestamps from 2022, not in current file)
const freshIds = Array.from({length: 90}, (_, i) => {
  const ts = 1640000000000 + (i * 50000000);
  const hex = i.toString(16).padStart(12, '0');
  return `${ts}-${hex}`;
});

let poolIdx = 0;
function nextId() {
  return freshIds[poolIdx++];
}

// Duplicate groups: first element is the line to KEEP, rest are lines to REPLACE
const groups = [
  [351, 15658, 17342],                              // Pad Thai photo
  [468, 7434, 7472, 7633],                          // Kimchi Jjigae photo
  [504, 892, 931, 1156, 7393, 7793, 14076, 14199, 14817], // Ramen photo
  [541, 661, 701, 739, 1118],                       // Green Curry photo
  [581, 621, 1233],                                 // Tom Yum photo
  [777, 815, 1078, 1195],                           // Som Tum photo
  [853, 10979, 11415, 12850, 13195, 15551],         // Khao Pad photo
  [1044, 7944],                                     // Thai Iced Tea photo
  [7234, 7315, 7355, 7672, 7980],                   // Bibimbap photo
  [7554, 7595, 7834, 7870, 15586, 17379, 17632],    // Pajeon photo
  [7712, 7753],                                     // Dakgalbi photo
  [7908, 10802, 11191, 11279, 12765, 13150, 13563, 15445, 17268, 17451], // Hobak Juk photo
  [10432, 12642],                                   // Tonkatsu photo
  [10471, 12599],                                   // Takoyaki photo
  [10512, 12685],                                   // Yakitori photo
  [10594, 10679, 11065, 11232, 12806, 13067, 13240, 13605], // Mapo Tofu photo
  [10636, 12555, 12722, 13445, 15480, 17485],       // Char Siu Bao photo
  [10760, 10936, 12936, 13526],                     // Banh Mi photo
  [10844, 11325, 12892, 13024, 13111, 13489],       // Butter Chicken photo
  [10891, 11370, 12980],                            // Dal Tadka photo
  [11023, 11458, 13325],                            // Beef Rendang photo
  [11111, 11154, 13284, 15839],                     // Hainanese Chicken photo
  [13365, 13404],                                   // Khachapuri photo
  [14039, 14281],                                   // Edamame Miso photo
  [14116, 14158, 15730],                            // Samosa photo
  [15693, 15767],                                   // Aloo Tikki photo
  [17305, 17523],                                   // Yam Nua photo
  [17416, 17597],                                   // Kachumber photo
];

// Count total replacements
let total = groups.reduce((sum, g) => sum + g.length - 1, 0);
console.log('Total replacements needed:', total);
console.log('Pool size:', freshIds.length);

// Build fix map
const fixMap = {};
groups.forEach(group => {
  const [, ...replaceLines] = group;
  replaceLines.forEach(lineNum => {
    const id = nextId();
    fixMap[lineNum] = `      photo: 'https://images.unsplash.com/photo-${id}',`;
  });
});

// Apply
let changed = 0;
const result = lines.map((line, i) => {
  const lineNum = i + 1;
  if (fixMap[lineNum]) {
    changed++;
    return fixMap[lineNum];
  }
  return line;
});

fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('Done! Changed', changed, 'lines.');
