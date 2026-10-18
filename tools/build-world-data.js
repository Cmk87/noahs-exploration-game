/* Builds js/world-data.js from Natural Earth (world-atlas 50m) + ISO names.
   Output per country: [alpha2, continent, encodedRings]; names per language.
   Rings: Douglas–Peucker simplified, quantised to 1/20°, delta-encoded. */
const fs = require('fs');
const topo = require('topojson-client');
const world = require('./node_modules/world-atlas/countries-50m.json');
const iso = require('i18n-iso-countries');
['de', 'en', 'es'].forEach(l => iso.registerLocale(require('i18n-iso-countries/langs/' + l + '.json')));
const CL = require('./node_modules/countries-list/countries.min.json');

const Q = 20;            // 1/20 degree grid
const TOL = 0.06;        // simplification tolerance in degrees
function dp(pts, tol) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const st = [[0, pts.length - 1]];
  while (st.length) {
    const [a, b] = st.pop(); let md = 0, mi = -1;
    const [x1, y1] = pts[a], [x2, y2] = pts[b], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1e-9;
    for (let i = a + 1; i < b; i++) { const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / L; if (d > md) { md = d; mi = i; } }
    if (md > tol) { keep[mi] = 1; st.push([a, mi], [mi, b]); }
  }
  return pts.filter((p, i) => keep[i]);
}
const area = r => { let s = 0; for (let i = 0; i < r.length; i++) { const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % r.length]; s += x1 * y2 - x2 * y1; } return Math.abs(s / 2); };

const fc = topo.feature(world, world.objects.countries);
const out = [], names = { de: {}, en: {}, es: {} };
const SHORT = {  // short, child-friendly names where the official one is long
  US: { de: 'USA', en: 'United States', es: 'Estados Unidos' }, GB: { de: 'Großbritannien', en: 'United Kingdom', es: 'Reino Unido' },
  RU: { de: 'Russland', en: 'Russia', es: 'Rusia' }, KR: { de: 'Südkorea', en: 'South Korea', es: 'Corea del Sur' },
  KP: { de: 'Nordkorea', en: 'North Korea', es: 'Corea del Norte' }, CD: { de: 'Kongo', en: 'DR Congo', es: 'R. D. del Congo' },
  CG: { de: 'Republik Kongo', en: 'Congo', es: 'Congo' }, IR: { de: 'Iran', en: 'Iran', es: 'Irán' }, SY: { de: 'Syrien', en: 'Syria', es: 'Siria' },
  BO: { de: 'Bolivien', en: 'Bolivia', es: 'Bolivia' }, VE: { de: 'Venezuela', en: 'Venezuela', es: 'Venezuela' }, TZ: { de: 'Tansania', en: 'Tanzania', es: 'Tanzania' },
  LA: { de: 'Laos', en: 'Laos', es: 'Laos' }, VN: { de: 'Vietnam', en: 'Vietnam', es: 'Vietnam' }, MD: { de: 'Moldau', en: 'Moldova', es: 'Moldavia' },
  CZ: { de: 'Tschechien', en: 'Czechia', es: 'Chequia' }, CF: { de: 'Zentralafrika', en: 'Central Africa', es: 'Centroáfrica' },
  AE: { de: 'Emirate', en: 'UAE', es: 'Emiratos Árabes' }, DO: { de: 'Dominikanische Rep.', en: 'Dominican Rep.', es: 'Rep. Dominicana' },
  BA: { de: 'Bosnien', en: 'Bosnia', es: 'Bosnia' }, MK: { de: 'Nordmazedonien', en: 'North Macedonia', es: 'Macedonia del Norte' },
  TW: { de: 'Taiwan', en: 'Taiwan', es: 'Taiwán' }, PS: { de: 'Palästina', en: 'Palestine', es: 'Palestina' }, AQ: { de: 'Antarktis', en: 'Antarctica', es: 'Antártida' },
  FM: { de: 'Mikronesien', en: 'Micronesia', es: 'Micronesia' }, VA: { de: 'Vatikan', en: 'Vatican', es: 'Vaticano' }, BN: { de: 'Brunei', en: 'Brunei', es: 'Brunéi' },
  TL: { de: 'Osttimor', en: 'East Timor', es: 'Timor Oriental' }, CI: { de: 'Elfenbeinküste', en: 'Ivory Coast', es: 'Costa de Marfil' },
  SZ: { de: 'Eswatini', en: 'Eswatini', es: 'Esuatini' }, GQ: { de: 'Äquatorialguinea', en: 'Equatorial Guinea', es: 'Guinea Ecuatorial' }
};
let pts = 0, skipped = [];
for (const f of fc.features) {
  const a2 = f.id ? iso.numericToAlpha2(f.id) : null;
  if (!a2) { skipped.push(f.properties.name); continue; }
  const cont = a2 === 'AQ' ? 'AN' : (CL[a2] && CL[a2].continent);
  if (!cont) { skipped.push(a2); continue; }
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  // closed rings start and end on the same point: split at the farthest point, simplify both halves
  const dpRing = r => { const o = r[0]; let fi = 1, fd = -1; r.forEach((p, i) => { const d = Math.hypot(p[0] - o[0], p[1] - o[1]); if (d > fd) { fd = d; fi = i; } });
    return dp(r.slice(0, fi + 1), TOL).concat(dp(r.slice(fi), TOL).slice(1)); };
  // rings that cross the 180° line jump from +180 to -180: unwrap them so they stay one piece
  const unwrap = r => { let off = 0; const o = r.map((p, i) => { if (i) { const d = p[0] + off - (r[i - 1][0] + offPrev); if (d > 180) off -= 360; else if (d < -180) off += 360; }
      offPrev = off; return [p[0] + off, p[1]]; }); const mean = o.reduce((s, p) => s + p[0], 0) / o.length; return mean > 180 ? o.map(p => [p[0] - 360, p[1]]) : mean < -180 ? o.map(p => [p[0] + 360, p[1]]) : o; };
  let offPrev = 0;
  let rings = polys.map(p => p[0]).map(r => { offPrev = 0; return unwrap(r); }).map(dpRing).filter(r => r.length >= 4);
  rings.sort((x, y) => area(y) - area(x));
  const big = rings.length ? area(rings[0]) : 0;
  rings = rings.filter((r, i) => i === 0 || area(r) > Math.min(0.15, big * 0.02));
  if (!rings.length) { skipped.push(a2); continue; }
  const enc = rings.map(r => {
    let px = 0, py = 0; const o = [];
    const qr = r.map(([x, y]) => [Math.round(x * Q), Math.round(y * Q)]).filter((p, i, A) => i === 0 || p[0] !== A[i - 1][0] || p[1] !== A[i - 1][1]);
    qr.forEach(([x, y]) => { o.push(x - px, y - py); px = x; py = y; }); pts += qr.length; return o.join(',');
  }).join(';');
  out.push([a2, cont, enc]);
  for (const l of ['de', 'en', 'es']) names[l][a2] = (SHORT[a2] && SHORT[a2][l]) || iso.getName(a2, l, { select: 'alias' }) || iso.getName(a2, l);
}
const js = `/* Country outlines: Natural Earth 1:50m (public domain) via world-atlas, simplified
   to ~${TOL}° and stored on a 1/${Q}° grid, delta-encoded. Names: i18n-iso-countries (MIT).
   Generated by a build script — do not edit by hand. */
const WORLD_Q=${Q};
const WORLD_COUNTRIES=${JSON.stringify(out)};
const WORLD_NAMES=${JSON.stringify(names)};
`;
fs.writeFileSync(process.argv[2], js);
console.log('countries', out.length, 'points', pts, 'bytes', js.length, 'skipped', skipped.join(', '));
const long = Object.entries(names.de).filter(([k, v]) => v.length > 18).map(([k, v]) => k + ':' + v);
console.log('long de names:', long.join(' | '));
const longEs = Object.entries(names.es).filter(([k, v]) => v.length > 20).map(([k, v]) => k + ':' + v);
console.log('long es names:', longEs.join(' | '));
