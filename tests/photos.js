/* Data checks for the photo books: counts, languages, pictures, offline list.
   No browser. */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
let failures = 0;
const check = (ok, what) => { console.log((ok ? '  ✓ ' : '  ✗ ') + what); if (!ok) failures++; };

function webpSize(file) {
  const data = fs.readFileSync(file);
  if (data.slice(0, 4).toString() !== 'RIFF' || data.slice(8, 12).toString() !== 'WEBP') return null;
  let i = 12;
  while (i + 8 <= data.length) {
    const four = data.slice(i, i + 4).toString();
    const size = data.readUInt32LE(i + 4);
    const chunk = data.slice(i + 8, i + 8 + size);
    if (four === 'VP8 ' ) {
      const j = chunk.indexOf(Buffer.from([0x9d, 0x01, 0x2a]));
      if (j >= 0) return [chunk.readUInt16LE(j + 3) & 0x3fff, chunk.readUInt16LE(j + 5) & 0x3fff];
    } else if (four === 'VP8X' && chunk.length >= 10) {
      return [1 + chunk.readUIntLE(4, 3), 1 + chunk.readUIntLE(7, 3)];
    }
    i += 8 + size + (size & 1);
  }
  return null;
}

const packSrc = fs.readFileSync(path.join(root, 'js/photo-pack.js'), 'utf8');
const pack = JSON.parse(packSrc.slice(packSrc.indexOf('{')).replace(/;\s*$/, ''));
const animals = JSON.parse(fs.readFileSync(path.join(root, 'animals/animals.json'), 'utf8'));
const vehicles = JSON.parse(fs.readFileSync(path.join(root, 'vehicles/vehicles.json'), 'utf8'));
const things = JSON.parse(fs.readFileSync(path.join(root, 'things/things.json'), 'utf8'));
const dinos = JSON.parse(fs.readFileSync(path.join(root, 'dinos/dinos.json'), 'utf8'));
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const prizes = fs.readFileSync(path.join(root, 'js/prizes.js'), 'utf8');
const dinoBlock = prizes.slice(prizes.indexOf('const DINOS=['), prizes.indexOf('const GOLD_BONES'));
const digKeys = [...dinoBlock.matchAll(/\{k:'([a-z0-9-]+)'/g)].map(m => m[1]);

check(animals.animals.length === 93 && pack.animals.length === 93, '93 animals in the book');
check(vehicles.vehicles.length === 48 && pack.vehicles.length === 48, '48 vehicles in the book');
check(things.things.length === 24 && pack.things.length === 24, '24 things in the book');
check(dinos.dinos.length === 15 && pack.dinos.length === 15, '15 dinosaurs in the picture book');
check(digKeys.length === 16 && digKeys.includes('ptera'), 'the dig still has its 16 species, including the pterosaur');
check(!pack.dinos.some(d => d.id === 'ptera'), 'the pterosaur is not filed as a dinosaur in the picture book');
check(pack.dinos.every(d => digKeys.includes(d.id)), 'every picture-book dinosaur is one you can dig up');

const by = {};
for (const a of animals.animals) by[a.habitat] = (by[a.habitat] || 0) + 1;
check(by.jungle === 15 && by.farm === 10 && by.birds === 10 && by.bugs === 8 && by.polar === 6, 'habitat counts match the approved list (' + JSON.stringify(by) + ')');
const vg = {};
for (const v of vehicles.vehicles) vg[v.group] = (vg[v.group] || 0) + 1;
check(vg.road === 12 && vg.buildingSite === 8 && vg.helpers === 6 && vg.rails === 5 && vg.air === 8 && vg.water === 9, 'vehicle group counts (' + JSON.stringify(vg) + ')');

check(animals.animals.every(a => a.sound == null), 'no animal has a noise line in the data');
const panther = animals.animals.find(a => a.id === 'black-panther');
check(panther && /leopard|Leopard/.test(panther.facts[0].en) && /jaguar|Jaguar/.test(panther.facts[1].en), 'black panther facts name the leopard and the jaguar');
check(pack.dinos.every(d => d.facts.length === 1 && !/roar|grrr|ROAR/i.test(d.facts[0].en)), 'each dinosaur picture has one fact and no roar');

function langsOk(item) {
  return ['en', 'es', 'de'].every(L => item.names && item.names[L] && item.names[L].full && item.facts.every(f => f && f[L] && f[L].length > 8));
}
check(animals.animals.every(langsOk) && vehicles.vehicles.every(langsOk) && things.things.every(langsOk) && dinos.dinos.every(langsOk), 'every new and old card has a name and facts in es, en and de');

const expect = [
  ...animals.animals.map(a => a.image),
  ...vehicles.vehicles.map(v => v.image),
  ...things.things.map(t => t.image),
  ...dinos.dinos.map(d => d.image),
  'dinos/ptera.webp'
];
let badImg = [];
for (const rel of expect) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) { badImg.push(rel + ' missing'); continue; }
  const wh = webpSize(file);
  if (!wh || wh[0] !== 512 || wh[1] !== 512) badImg.push(rel + ' ' + JSON.stringify(wh));
}
check(badImg.length === 0, 'every photo is a 512px WebP' + (badImg.length ? ': ' + badImg.slice(0, 4).join(', ') : ''));
check(sw.includes("const CACHE='explorer-v58';") && expect.every(rel => sw.includes('./' + rel)), 'the offline list names cache v58 and every new picture');
const photoJs = fs.readFileSync(path.join(root, 'js/photo.js'), 'utf8');
check(/PH\.kind==='a'\|\|PH\.kind==='t'\|\|PH\.kind==='d'\)return null/.test(photoJs), 'animals, things and dinosaurs do not speak a noise');

console.log(failures ? `\n${failures} check(s) failed` : '\nPhoto data passed');
process.exit(failures ? 1 : 0);
