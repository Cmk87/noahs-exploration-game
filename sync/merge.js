/* Merge rules for family sync. Pure data: no network, no DOM.
   Loaded in the browser as a plain script (sets globalThis.SyncMerge)
   and required by the Cloudflare worker and the tests. */
(function (factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else globalThis.SyncMerge = api;
})(function () {
  /* Not progress: the child's name, the in-progress prize marker, and this
     device's own sync bookkeeping. Nothing here identifies a person or a device. */
  const SYNC_SKIP = { sl_name: 1, sl_pgame: 1, sl_sync: 1, sl_synctime: 1, sl_syncurl: 1 };
  const MAX_NUM = { sl_power: 1, sl_dinoround: 1 };
  const UNION_ARR = { sl_dinos: 1, sl_stkseen: 1 };
  const MAX_MAP = { sl_treasure: 1, sl_stats: 1 };
  const LATEST = { sl_langs: 1, sl_bridge: 1, sl_limit: 1, sl_advsize: 1 };
  const WORDS = ['TIGER','LION','BEAR','WOLF','FOX','DEER','FROG','CRAB','GOAT','LAMB','PONY','MOLE','SWAN','DOVE','HAWK','LARK','PUMA','LYNX','ORCA','KIWI','NEWT','TOAD','MOTH','WASP','DUCK','SEAL','GOOSE','HORSE','MOUSE','SHEEP','WHALE','ZEBRA','PANDA','KOALA','LLAMA','CAMEL','EAGLE','ROBIN','FINCH','BISON','MOOSE','HERON','SNAIL','CORAL','MAPLE','OLIVE','PEACH','MANGO','LEMON','APPLE','COMET','CLOUD','RIVER','STONE','SHELL','FLAME','STORM','OCEAN','MEADOW','FOREST','DESERT','CANYON','ISLAND','CASTLE'];
  const SECRET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  function syncIsProgress(k) {
    return typeof k === 'string' && k.indexOf('sl_') === 0 && !SYNC_SKIP[k] && k.indexOf('sl_sync') !== 0;
  }
  function parseJSON(s) { try { return JSON.parse(s); } catch (e) { return null; } }
  function num(s) { const n = +s; return isFinite(n) ? n : 0; }
  function dayNum(s) {
    const m = String(s || '').match(/(\d+)-(\d+)-(\d+)/);
    return m ? (+m[1]) * 10000 + (+m[2]) * 100 + (+m[3]) : 0;
  }
  function unionArr(a, b) {
    const out = [];
    (Array.isArray(a) ? a : []).concat(Array.isArray(b) ? b : []).forEach(x => {
      const s = String(x);
      if (out.indexOf(s) < 0) out.push(s);
    });
    return out;
  }
  function maxMap(a, b) {
    const out = {};
    [a || {}, b || {}].forEach(o => {
      if (!o || typeof o !== 'object' || Array.isArray(o)) return;
      Object.keys(o).forEach(k => { out[k] = Math.max(out[k] || 0, +o[k] || 0); });
    });
    return out;
  }
  function latest(lv, lt, rv, rt) {
    if (rt > lt) return { v: rv, t: rt };
    return { v: lv, t: lt || rt };
  }
  function mergeWrite(a, b) {
    const A = a && typeof a === 'object' ? a : {};
    const B = b && typeof b === 'object' ? b : {};
    const out = {};
    Object.keys(A).concat(Object.keys(B)).forEach(k => {
      if (out[k]) return;
      const x = A[k] || {}, y = B[k] || {};
      out[k] = {
        miss: Math.max(x.miss || 0, y.miss || 0),
        retry: Math.max(x.retry || 0, y.retry || 0),
        skip: Math.max(x.skip || 0, y.skip || 0),
        slow: Math.max(x.slow || 0, y.slow || 0),
        ok: Math.max(x.ok || 0, y.ok || 0),
        at: Math.max(x.at || 0, y.at || 0)
      };
    });
    return out;
  }
  function mergeCity(a, b) {
    const A = a || {}, B = b || {};
    return {
      found: unionArr(A.found, B.found),
      stars: Math.max(A.stars || 0, B.stars || 0),
      round: Math.max(A.round || 0, B.round || 0),
      done: Math.max(A.done || 0, B.done || 0)
    };
  }
  function mergePassport(a, b) {
    const A = a || {}, B = b || {}, out = {};
    Object.keys(A).concat(Object.keys(B)).forEach(k => {
      if (out[k]) return;
      const x = A[k], y = B[k];
      out[k] = Array.isArray(x) || Array.isArray(y) ? unionArr(x, y) : (y != null ? y : x);
    });
    return out;
  }
  function mergeLog(a, b) {
    const A = a || {}, B = b || {}, out = {};
    Object.keys(A).concat(Object.keys(B)).forEach(day => {
      if (out[day]) return;
      out[day] = maxMap(A[day], B[day]);
    });
    return out;
  }
  function mergeSkill(a, b, takeB) {
    const A = a || {}, B = b || {}, out = {};
    Object.keys(A).concat(Object.keys(B)).forEach(k => {
      if (out[k]) return;
      const x = A[k], y = B[k];
      if (!x || !y) { out[k] = y || x; return; }
      const newer = takeB ? y : x;
      out[k] = { s: newer.s, n: Math.max(x.n || 0, y.n || 0), h: Array.isArray(newer.h) ? newer.h.slice() : [] };
    });
    return out;
  }
  function mergeSrs(a, b, takeB) {
    const A = a || {}, B = b || {}, out = {};
    Object.keys(A).concat(Object.keys(B)).forEach(lang => {
      if (out[lang]) return;
      const x = A[lang] || {}, y = B[lang] || {}, cards = {};
      Object.keys(x).concat(Object.keys(y)).forEach(card => {
        if (cards[card]) return;
        const p = x[card], q = y[card];
        if (!p || !q) { cards[card] = q || p; return; }
        const newer = takeB ? q : p;
        cards[card] = { b: newer.b, d: newer.d, n: Math.max(p.n || 0, q.n || 0), ok: Math.max(p.ok || 0, q.ok || 0) };
      });
      out[lang] = cards;
    });
    return out;
  }
  function mergeJournal(a, b) {
    const A = a || {}, B = b || {}, out = {};
    Object.keys(A).concat(Object.keys(B)).forEach(id => {
      if (out[id]) return;
      const x = A[id], y = B[id];
      if (!x || !y) { out[id] = Object.assign({}, y || x); return; }
      const newer = (y.at || 0) >= (x.at || 0) ? y : x;
      const ms = unionArr(x.ms, y.ms).map(Number).filter(n => isFinite(n));
      out[id] = Object.assign({}, newer, {
        seen: Math.max(x.seen || 0, y.seen || 0),
        miss: Math.max(x.miss || 0, y.miss || 0),
        ok1: Math.max(x.ok1 || 0, y.ok1 || 0),
        first: Math.min(x.first || newer.first || 0, y.first || newer.first || 0) || newer.first,
        ms: ms,
        at: Math.max(x.at || 0, y.at || 0)
      });
    });
    return out;
  }
  function advScore(x) {
    return (x && x.done ? 1000 : 0) + ((x && x.idx) || 0) * 10 + ((x && x.plan) || []).reduce((s, p) => s + (p.got || 0), 0);
  }
  function mergeAdv(a, b) {
    if (!a) return b;
    if (!b) return a;
    if (dayNum(a.date) !== dayNum(b.date)) return dayNum(a.date) > dayNum(b.date) ? a : b;
    const pickA = advScore(a) > advScore(b) || (advScore(a) === advScore(b));
    const base = JSON.parse(JSON.stringify(pickA ? a : b));
    const other = pickA ? b : a;
    const tabs = p => (p.plan || []).map(s => s.tab).join('|');
    if (tabs(a) && tabs(a) === tabs(b)) {
      base.plan = base.plan.map((step, i) => ({ tab: step.tab, got: Math.max(step.got || 0, (other.plan[i] && other.plan[i].got) || 0) }));
    }
    if (tabs(a) && tabs(a) === tabs(b)) base.idx = Math.max(a.idx || 0, b.idx || 0);
    base.done = !!(a.done || b.done);
    base.started = !!(a.started || b.started);
    base.bonus = !!(a.bonus || b.bonus);
    return base;
  }
  /* rv === undefined means the other side has no record. null means a newer delete. */
  function mergeValue(k, lv, lt, rv, rt) {
    if (rv === undefined) return { v: lv, t: lt || 0 };
    if (lv == null && rv == null) return { v: null, t: Math.max(lt || 0, rt || 0) };
    if (lv == null) return lt > rt ? { v: null, t: lt } : { v: rv, t: rt };
    if (rv == null) return rt > lt ? { v: null, t: rt } : { v: lv, t: lt };
    if (MAX_NUM[k] || (/^sl_voice_/.test(k) === false && LATEST[k])) {
      if (MAX_NUM[k]) {
        const n = Math.max(num(lv), num(rv));
        const t = num(lv) === n && num(rv) === n ? Math.max(lt, rt) : (num(lv) >= num(rv) ? lt : rt);
        return { v: String(n), t: t || Math.max(lt, rt) };
      }
      return latest(lv, lt, rv, rt);
    }
    if (/^sl_voice_/.test(k)) return latest(lv, lt, rv, rt);
    const a = parseJSON(lv), b = parseJSON(rv);
    if (a == null || b == null) return latest(lv, lt, rv, rt);
    let merged;
    if (UNION_ARR[k]) merged = unionArr(a, b);
    else if (MAX_MAP[k]) merged = maxMap(a, b);
    else if (k === 'sl_write') merged = mergeWrite(a, b);
    else if (k === 'sl_city') merged = mergeCity(a, b);
    else if (k === 'sl_passport') merged = mergePassport(a, b);
    else if (k === 'sl_log') merged = mergeLog(a, b);
    else if (k === 'sl_skill') merged = mergeSkill(a, b, rt > lt);
    else if (k === 'sl_srs') merged = mergeSrs(a, b, rt > lt);
    else if (k === 'sl_journal') merged = mergeJournal(a, b);
    else if (k === 'sl_adv') merged = mergeAdv(a, b);
    else return latest(lv, lt, rv, rt);
    return { v: JSON.stringify(merged), t: Math.max(lt || 0, rt || 0) };
  }
  /* local: {key: string}, times: {key: ms}, remoteKeys: {key: {t, v}} */
  function syncMergeDoc(local, times, remoteKeys, now) {
    const keys = {};
    const adopt = {};
    const seen = {};
    Object.keys(local || {}).forEach(k => { if (syncIsProgress(k)) seen[k] = 1; });
    Object.keys(remoteKeys || {}).forEach(k => { if (syncIsProgress(k) && remoteKeys[k]) seen[k] = 1; });
    Object.keys(seen).forEach(k => {
      const hasL = !!(local && Object.prototype.hasOwnProperty.call(local, k) && local[k] != null);
      const hasR = !!(remoteKeys && Object.prototype.hasOwnProperty.call(remoteKeys, k) && remoteKeys[k]);
      const rec = hasR ? remoteKeys[k] : null;
      const lv = hasL ? String(local[k]) : null;
      const lt = (times && times[k]) || 0;
      const rv = !hasR ? undefined : (rec.v == null ? null : String(rec.v));
      const rt = hasR ? (rec.t || 0) : 0;
      const m = mergeValue(k, hasL ? lv : (lt ? null : undefined), lt, rv, rt);
      if (m.v == null && !hasL && !hasR && !lt && !rt) return;
      if (m.v == null) {
        if (m.t) keys[k] = { t: m.t, v: null };
        if (hasL) adopt[k] = null;
        return;
      }
      keys[k] = { t: m.t || now || 0, v: m.v };
      if (lv !== m.v) adopt[k] = m.v;
    });
    return { keys: keys, adopt: adopt };
  }
  function syncNormalizeCode(s) {
    return String(s || '').toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9-]/g, '');
  }
  function syncCodeOk(s) {
    return /^[A-Z]+-\d{4}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/.test(syncNormalizeCode(s));
  }
  function syncMakeCode(rand) {
    const r = rand || Math.random;
    const word = WORDS[Math.floor(r() * WORDS.length)];
    let digits = '';
    for (let i = 0; i < 4; i++) digits += Math.floor(r() * 10);
    let secret = '';
    for (let i = 0; i < 8; i++) secret += SECRET[Math.floor(r() * SECRET.length)];
    return word + '-' + digits + '-' + secret;
  }
  return {
    SYNC_SKIP: SYNC_SKIP,
    WORDS: WORDS,
    syncIsProgress: syncIsProgress,
    syncMergeDoc: syncMergeDoc,
    syncNormalizeCode: syncNormalizeCode,
    syncCodeOk: syncCodeOk,
    syncMakeCode: syncMakeCode,
    mergeValue: mergeValue
  };
});
