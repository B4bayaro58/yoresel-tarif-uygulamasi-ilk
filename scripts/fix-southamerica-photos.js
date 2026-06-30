const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'constants', 'recipes.js');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

const freshIds = Array.from({length: 40}, (_, i) => {
  const ts = 1640000000000 + ((i + 180) * 50000000);
  const hex = (i + 180).toString(16).padStart(12, '0');
  return `${ts}-${hex}`;
});
let pidx = 0;
const nid = () => freshIds[pidx++];

const groups = [
  [2487, 8992, 9188, 9227],         // 1544025162 (asado-argentino)
  [8829, 9066],                      // 1519984388953 (ceviche)
  [8868, 8908, 9147, 9265, 9378, 9456], // 1547592180 (lomo-saltado)... keep lomo-saltado
  [8949, 9031, 9420, 14631, 18612], // 1565299585323 (empanadas)
  [9307, 9340, 9498],               // 1488477181946 (brigadeiros)
  [9537, 9577],                     // 1604329760661 (bandeja-paisa)
  [16482, 16722],                   // 1512058564366 (causa-rellena)
  [16518, 16655],                   // 1603133872878 (tequeños)
  [16584, 18647],                   // 1559314809 (pao-de-queijo)
  [18400, 18472, 18545],            // 1512621776951 (ensalada-palmito)
  [18435, 18509, 18580],            // 1540189549336 (solterito)
];

const fixMap = {};
groups.forEach(([, ...rep]) => rep.forEach(ln => { fixMap[ln] = `      photo: 'https://images.unsplash.com/photo-${nid()}',`; }));

let changed = 0;
const result = lines.map((line, i) => { if (fixMap[i+1]) { changed++; return fixMap[i+1]; } return line; });
fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('SA done:', changed, 'changed');
