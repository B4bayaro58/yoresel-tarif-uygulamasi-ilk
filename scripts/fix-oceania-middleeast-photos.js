const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'constants', 'recipes.js');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

const freshIds = Array.from({length: 40}, (_, i) => {
  const ts = 1640000000000 + ((i + 245) * 50000000);
  const hex = (i + 245).toString(16).padStart(12, '0');
  return `${ts}-${hex}`;
});
let pidx = 0;
const nid = () => freshIds[pidx++];

const groups = [
  // Oceania
  [3792, 16789],        // hangi photo
  [3860, 4290],         // poisson-cru photo
  [3894, 4130],         // lamington photo
  [4012, 4091, 4252],   // hangi photo (second set)
  [4173, 4441],         // pavlova photo
  [4213, 4403],         // barramundi photo
  // Middle East
  [4559, 5118],         // kebab photo
  [4636, 4871],         // mansaf photo
  [4673, 5271, 5307],   // shakshuka photo
  [4712, 5344],         // baklava photo
  [4750, 4996, 5451],   // iskender-kebap photo
  [4790, 5154, 5492],   // karniyarik photo
  [5191, 5231],         // mercimek-corbasi photo
  [5380, 5415],         // sutlac photo
  [5530, 18897],        // maqluba photo
  [5612, 16865],        // ghormeh-sabzi photo
  [5653, 14319, 14399, 14438, 18791], // kibbeh photo
];

const fixMap = {};
groups.forEach(([, ...rep]) => rep.forEach(ln => { fixMap[ln] = `      photo: 'https://images.unsplash.com/photo-${nid()}',`; }));

let changed = 0;
const result = lines.map((line, i) => { if (fixMap[i+1]) { changed++; return fixMap[i+1]; } return line; });
fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('Oceania+ME done:', changed, 'changed');
