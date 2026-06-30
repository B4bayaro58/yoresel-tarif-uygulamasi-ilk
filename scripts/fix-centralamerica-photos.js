const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'constants', 'recipes.js');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

const freshIds = Array.from({length: 25}, (_, i) => {
  const ts = 1640000000000 + ((i + 220) * 50000000);
  const hex = (i + 220).toString(16).padStart(12, '0');
  return `${ts}-${hex}`;
});
let pidx = 0;
const nid = () => freshIds[pidx++];

const groups = [
  [2600, 3325, 16411],  // 1565299585323 (tacos)
  [2637, 2704, 2978],   // 1626200419199 (pupusas)
  [2740, 3015],         // 1598514982901 (mole-chicken)
  [2826, 3132],         // 1547592166 (pozole-rojo)
  [2867, 3473],         // 1590166758888 (chilaquiles)
  [3053, 3248],         // 1599487488170 (carnitas)
  [3093, 3287],         // 1626700051175 (burrito)
  [3209, 3631],         // 1535399831218 (ceviche-mexicano)
  [3401, 3438],         // 1488477181946 (tres-leches)
  [3553, 14594],        // 1550317138 (pupusas duplicate)
  [3591, 16342],        // 1547592180 (sopa-negra)
];

const fixMap = {};
groups.forEach(([, ...rep]) => rep.forEach(ln => { fixMap[ln] = `      photo: 'https://images.unsplash.com/photo-${nid()}',`; }));

let changed = 0;
const result = lines.map((line, i) => { if (fixMap[i+1]) { changed++; return fixMap[i+1]; } return line; });
fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('CA done:', changed, 'changed');
