/**
 * Fix duplicate photo IDs for Africa recipes.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'constants', 'recipes.js');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Generate fresh unique IDs (continue from where Asia left off: index 90+)
// Use offset 100 to give a clear gap
const freshIds = Array.from({length: 60}, (_, i) => {
  const ts = 1640000000000 + ((i + 100) * 50000000);
  const hex = (i + 100).toString(16).padStart(12, '0');
  return `${ts}-${hex}`;
});

let poolIdx = 0;
function nextId() {
  return freshIds[poolIdx++];
}

// Duplicate groups for Africa: [keepLine, ...replaceLines]
const groups = [
  // (1) 1604329760661-e71dc83f8385 (bobotie, jollof)
  [1316, 1385],
  // (2) 1547592180-85f173990554 (generic soup - 14 occurrences)
  [1423, 8065, 8145, 8229, 8311, 8431, 11551, 11595, 11638, 12419, 15916, 16020, 17743, 17960],
  // (3) 1604329760661-e71dc83f8f26 (jollof-rice - 7 occurrences)
  [8023, 8553, 8633, 8706, 8783, 15988, 16054],
  // (4) 1598103442097-8b74394b95c7 (doro-wat)
  [8107, 8392],
  // (5) 1544025162-d76694265947 (suya)
  [8271, 8475, 8515],
  // (6) 1565299585323-38d6b0865b47 (bastilla - 7 occurrences)
  [8592, 8673, 8744, 15952, 16088, 17781, 17889],
  // (7) 1512058564366-18510be2db19 (egypt-kushari - 5 occurrences)
  [11508, 11842, 11929, 16158, 17924],
  // (8) 1603133872878-684f208fb84b (yassa-poulet - 4 occurrences)
  [11718, 11760, 12057, 12097],
  // (9) 1569050467447-ce54b3bbc37d (cameroon-ndole - 5 occurrences)
  [11801, 12016, 12217, 12299, 12460],
  // (10) 1585937421612-70a008356fbe (ugandan-matoke)
  [11887, 12376],
  // (11) 1574484284002-952d92456975 (eritrea-zigni - 5 occurrences)
  [11975, 12139, 12178, 12338, 12502],
  // (12) 1512621776951-a57141f2eefd (kachumbari - 3 occurrences)
  [17674, 17818, 17994],
  // (13) 1540189549336-e6e99c3679fe (timatim-salata)
  [17708, 17854],
];

let total = groups.reduce((sum, g) => sum + g.length - 1, 0);
console.log('Africa: total replacements needed:', total);

const fixMap = {};
groups.forEach(group => {
  const [, ...replaceLines] = group;
  replaceLines.forEach(lineNum => {
    const id = nextId();
    fixMap[lineNum] = `      photo: 'https://images.unsplash.com/photo-${id}',`;
  });
});

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
