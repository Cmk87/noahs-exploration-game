/* Merge the approved photo-book additions into the JSON sources.
   Safe to run again: entries already present are left in place. */
const fs = require('fs');
const path = require('path');
const { animals, vehicles, thingGroups, things, dinos } = require('./new-content');

const root = path.join(__dirname, '..');
function read(rel) { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }
function write(rel, data) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(data, null, 2) + '\n');
}

const animalFile = read('animals/animals.json');
for (const a of animalFile.animals) a.sound = null;
const haveA = new Set(animalFile.animals.map(a => a.id));
for (const a of animals) if (!haveA.has(a.id)) animalFile.animals.push(a);
write('animals/animals.json', animalFile);

const vehicleFile = read('vehicles/vehicles.json');
const haveV = new Set(vehicleFile.vehicles.map(v => v.id));
for (const v of vehicles) if (!haveV.has(v.id)) vehicleFile.vehicles.push(v);
write('vehicles/vehicles.json', vehicleFile);

const bin = things.find(t => t.id === 'binoculars');
bin.names.en.number = 'pl';
bin.names.es.number = 'pl';
bin.names.de.number = 'sg';
write('things/things.json', {
  version: 1,
  imageSize: 512,
  format: 'webp',
  groups: thingGroups,
  things
});
write('dinos/dinos.json', {
  version: 1,
  imageSize: 512,
  format: 'webp',
  note: 'Picture-book dinosaurs only. dinos/ptera.webp is the pterosaur reconstruction for the dig and the museum, and is not listed here.',
  dinos
});

const by = {};
for (const a of animalFile.animals) by[a.habitat] = (by[a.habitat] || 0) + 1;
console.log('animals', animalFile.animals.length, 'sounds', animalFile.animals.filter(a => a.sound).length, by);
console.log('vehicles', vehicleFile.vehicles.length);
console.log('things', things.length, 'dinos', dinos.length);
