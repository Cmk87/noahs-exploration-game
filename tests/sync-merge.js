/* Merge rules for family sync. No browser, no network. */
const assert = require('assert');
const M = require('../sync/merge.js');
const { syncMergeDoc, syncIsProgress, syncCodeOk, syncNormalizeCode, syncMakeCode } = M;

let failures = 0;
const check = (ok, what) => { console.log((ok ? '  ✓ ' : '  ✗ ') + what); if (!ok) failures++; };

check(!syncIsProgress('sl_name') && !syncIsProgress('sl_pgame') && !syncIsProgress('sl_sync') && !syncIsProgress('sl_synctime') && !syncIsProgress('sl_syncurl'), 'name, the prize marker and sync bookkeeping stay on the device');
check(syncIsProgress('sl_power') && syncIsProgress('sl_write') && syncIsProgress('sl_voice_de'), 'points, weak words and voice choices are progress');

{
  const r = syncMergeDoc(
    { sl_power: '12', sl_dinos: '["trex"]', sl_name: 'Noah' },
    { sl_power: 10, sl_dinos: 10 },
    { sl_power: { t: 20, v: '40' }, sl_dinos: { t: 5, v: '["stego"]' }, sl_name: { t: 99, v: 'Nope' } },
    30
  );
  check(r.keys.sl_power.v === '40' && r.adopt.sl_power === '40', 'points take the higher number');
  const dinos = JSON.parse(r.keys.sl_dinos.v).sort();
  check(dinos.join() === 'stego,trex' && !r.keys.sl_name, 'dinosaur finds are joined, and a name is never stored ' + dinos.join());
}

{
  const r = syncMergeDoc(
    { sl_treasure: JSON.stringify({ bone: 2, gem: 1 }), sl_stats: JSON.stringify({ 'de|Katze': 3 }) },
    { sl_treasure: 1, sl_stats: 1 },
    { sl_treasure: { t: 2, v: JSON.stringify({ bone: 1, star: 4 }) }, sl_stats: { t: 2, v: JSON.stringify({ 'de|Katze': 1, 'en|cat': 2 }) } },
    3
  );
  const tr = JSON.parse(r.keys.sl_treasure.v);
  const st = JSON.parse(r.keys.sl_stats.v);
  check(tr.bone === 2 && tr.gem === 1 && tr.star === 4 && st['de|Katze'] === 3 && st['en|cat'] === 2, 'treasure and miss counts keep each highest');
}

{
  const r = syncMergeDoc(
    { sl_write: JSON.stringify({ 'de|cat': { miss: 1, retry: 0, skip: 0, slow: 0, ok: 2, at: 5 } }) },
    { sl_write: 10 },
    { sl_write: { t: 8, v: JSON.stringify({ 'de|cat': { miss: 4, retry: 1, skip: 0, slow: 2, ok: 1, at: 9 }, 'en|dog': { miss: 1, ok: 0, at: 3 } }) } },
    11
  );
  const w = JSON.parse(r.keys.sl_write.v);
  check(w['de|cat'].miss === 4 && w['de|cat'].ok === 2 && w['de|cat'].retry === 1 && w['en|dog'].miss === 1, 'weak-word counts never go backwards');
}

{
  const r = syncMergeDoc(
    { sl_langs: 'de,en', sl_city: JSON.stringify({ found: ['fox'], stars: 3, round: 1, done: 0 }) },
    { sl_langs: 50, sl_city: 10 },
    { sl_langs: { t: 20, v: 'de' }, sl_city: { t: 40, v: JSON.stringify({ found: ['owl'], stars: 1, round: 2, done: 1 }) } },
    60
  );
  const city = JSON.parse(r.keys.sl_city.v);
  check(r.keys.sl_langs.v === 'de,en' && city.stars === 3 && city.round === 2 && city.done === 1 && city.found.sort().join() === 'fox,owl', 'newer language choice wins, city stars and finds combine');
}

{
  const r = syncMergeDoc(
    { sl_passport: JSON.stringify({ a: ['cow'], v: ['car'] }), sl_stkseen: '["fox"]' },
    { sl_passport: 1, sl_stkseen: 1 },
    { sl_passport: { t: 2, v: JSON.stringify({ a: ['eagle'], t: ['hammer'] }) }, sl_stkseen: { t: 2, v: '["owl"]' } },
    3
  );
  const p = JSON.parse(r.keys.sl_passport.v);
  const seen = JSON.parse(r.keys.sl_stkseen.v).sort();
  check(p.a.sort().join() === 'cow,eagle' && p.v[0] === 'car' && p.t[0] === 'hammer' && seen.join() === 'fox,owl', 'passport stamps and seen stickers are unions');
}

{
  const phone = syncMergeDoc(
    { sl_power: '15', sl_dinos: '["trex"]' },
    { sl_power: 100, sl_dinos: 100 },
    {},
    100
  );
  const tablet = syncMergeDoc(
    { sl_power: '9', sl_dinos: '["stego"]', sl_langs: 'en' },
    { sl_power: 80, sl_dinos: 80, sl_langs: 80 },
    phone.keys,
    90
  );
  const again = syncMergeDoc(
    { sl_power: '15', sl_dinos: '["trex"]' },
    { sl_power: 100, sl_dinos: 100 },
    tablet.keys,
    110
  );
  check(again.keys.sl_power.v === '15' && JSON.parse(again.keys.sl_dinos.v).sort().join() === 'stego,trex' && again.keys.sl_langs.v === 'en', 'two devices used offline both keep their finds');
}

{
  const r = syncMergeDoc(
    { sl_skill: JSON.stringify({ 'words|de': { s: 2, n: 3, h: [1] } }) },
    { sl_skill: 10 },
    { sl_skill: { t: 20, v: JSON.stringify({ 'words|de': { s: 4.5, n: 1, h: [0, 1] } }) } },
    30
  );
  const s = JSON.parse(r.keys.sl_skill.v)['words|de'];
  check(s.s === 4.5 && s.n === 3 && s.h.join() === '0,1', 'a newer skill level is kept and the round count is the higher one');
}

{
  const code = syncMakeCode(() => 0.5);
  check(syncCodeOk(code) && syncCodeOk('  tiger-4821-k7qm9p2x ') && syncNormalizeCode(' tiger-4821-k7qm9p2x ') === 'TIGER-4821-K7QM9P2X', 'a family code is a word, four digits and a secret ' + code);
  check(!syncCodeOk('TIGER-4821') && !syncCodeOk('TIGER-4821-OOOOOOOO'), 'a short code or an ambiguous secret is refused');
  const codes = new Set();
  for (let i = 0; i < 20; i++) codes.add(syncMakeCode());
  check(codes.size === 20, 'codes are not stuck on one value');
}

{
  const r = syncMergeDoc(
    { sl_adv: JSON.stringify({ date: '2026-11-9', plan: [{ tab: 'words', got: 1 }], idx: 0, done: false }) },
    { sl_adv: 1 },
    { sl_adv: { t: 2, v: JSON.stringify({ date: '2026-11-22', plan: [{ tab: 'ear', got: 0 }], idx: 1, done: false }) } },
    3
  );
  check(JSON.parse(r.keys.sl_adv.v).date === '2026-11-22', 'a later adventure day replaces an earlier one');
}

console.log(failures ? `\n${failures} check(s) failed` : '\nSync merge passed');
process.exit(failures ? 1 : 0);
