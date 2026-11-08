/* Builds js/photo-pack.js from the JSON photo books, and refreshes the
   offline picture list in sw.js. New pictures are new file names, so the
   image cache (explorer-img-1) keeps what the phone already stored. */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = rel => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));

const animals = read('animals/animals.json');
const people = read('people/people.json');
const vehicles = read('vehicles/vehicles.json');
const babies = read('babies/babies.json');
const body = read('body/body.json');
const things = read('things/things.json');
const dinos = read('dinos/dinos.json');

const pack = {
  habitats: animals.habitats,
  animals: animals.animals,
  groups: people.groups,
  people: people.people,
  vehicleGroups: vehicles.groups,
  vehicles: vehicles.vehicles,
  pairs: babies.pairs,
  bodyGroups: body.groups,
  body: body.body,
  thingGroups: things.groups,
  things: things.things,
  dinos: dinos.dinos
};
const out = '/* Photo books, built from the JSON files so the app can open them from a file:// page.\n   Do not edit by hand. */\nconst PHOTO_PACK = ' + JSON.stringify(pack) + ';\n';
fs.writeFileSync(path.join(root, 'js/photo-pack.js'), out);

function webps(dir) {
  return fs.readdirSync(path.join(root, dir)).filter(f => f.endsWith('.webp')).sort()
    .map(f => './' + dir + '/' + f);
}
let sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
sw = sw.replace(/const CACHE='explorer-v\d+';/, "const CACHE='explorer-v59';");
for (const dir of ['animals', 'people', 'vehicles', 'babies', 'body']) {
  const re = new RegExp('\\.\\.\\.\\["\\./' + dir + '/[^\\]]+\\]');
  if (!re.test(sw)) throw new Error('missing picture list for ' + dir);
  sw = sw.replace(re, '...' + JSON.stringify(webps(dir)));
}
if (!sw.includes('./things/things.json')) {
  sw = sw.replace("'./body/body.json'", "'./body/body.json','./things/things.json','./dinos/dinos.json'");
}
if (!sw.includes('"./things/')) {
  sw = sw.replace(
    '...["./js/',
    '...' + JSON.stringify(webps('things')) + ',\n  ...' + JSON.stringify(webps('dinos')) + ',\n  ...["./js/'
  );
} else {
  for (const dir of ['things', 'dinos']) {
    const re = new RegExp('\\.\\.\\.\\["\\./' + dir + '/[^\\]]+\\]');
    sw = sw.replace(re, '...' + JSON.stringify(webps(dir)));
  }
}
fs.writeFileSync(path.join(root, 'sw.js'), sw);
console.log('photo-pack', pack.animals.length, 'animals,', pack.vehicles.length, 'vehicles,', pack.things.length, 'things,', pack.dinos.length, 'dinos');
console.log('cache', (sw.match(/explorer-v\d+/) || [])[0]);
