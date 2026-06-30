const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'constants', 'recipes.js');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Fresh IDs starting at offset 160
const freshIds = Array.from({length: 15}, (_, i) => {
  const ts = 1640000000000 + ((i + 160) * 50000000);
  const hex = (i + 160).toString(16).padStart(12, '0');
  return `${ts}-${hex}`;
});
let pidx = 0;
const nid = () => freshIds[pidx++];

const groups = [
  [1463, 1955, 16234],   // burger photo
  [1879, 2151],          // key-lime-pie photo
  [18033, 18107, 18214], // cobb-salatasi photo
  [18070, 18284],        // waldorf-salatasi photo
];

const fixMap = {};
groups.forEach(([, ...rep]) => rep.forEach(ln => { fixMap[ln] = `      photo: 'https://images.unsplash.com/photo-${nid()}',`; }));

let changed = 0;
const result = lines.map((line, i) => { if (fixMap[i+1]) { changed++; return fixMap[i+1]; } return line; });
fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('NA done:', changed, 'changed');
