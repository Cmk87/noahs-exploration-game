/* Family sync. Offline the game is unchanged. When a parent has created
   or joined a code, changes are pushed a moment later and pulled on
   start and when the app comes back to the front. */
const SYNC_TEXT = {
  en: {
    title: '🔁 Sync devices',
    notSet: 'Not set up yet. Add the Supabase address and the anon key in js/sync-config.js, then publish the site again.',
    help: 'One device creates a code. The other types that same code once. Stars, points and stickers then stay together. No name is sent.',
    create: 'Create family code',
    join: 'Join',
    placeholder: 'TIGER-4821-XXXXXXXX',
    active: 'This device is syncing',
    stop: 'Stop syncing',
    stopAsk: 'Stop syncing this device? The other device keeps its copy.',
    bad: 'That code does not look right.',
    offline: 'Saved on this device. It will send when the internet is back.',
    ok: 'Synced.',
    working: 'Syncing…'
  },
  de: {
    title: '🔁 Geräte abgleichen',
    notSet: 'Noch nicht eingerichtet. Die Supabase-Adresse und den anon-Schlüssel in js/sync-config.js eintragen und die Seite neu veröffentlichen.',
    help: 'Ein Gerät macht einen Code. Das andere tippt genau diesen Code einmal ein. Sterne, Punkte und Sticker bleiben dann zusammen. Es wird kein Name geschickt.',
    create: 'Familiencode erstellen',
    join: 'Beitreten',
    placeholder: 'TIGER-4821-XXXXXXXX',
    active: 'Dieses Gerät gleicht ab',
    stop: 'Abgleich stoppen',
    stopAsk: 'Abgleich auf diesem Gerät stoppen? Das andere Gerät behält seine Kopie.',
    bad: 'Dieser Code sieht nicht richtig aus.',
    offline: 'Auf diesem Gerät gespeichert. Es wird gesendet, sobald das Internet wieder da ist.',
    ok: 'Abgeglichen.',
    working: 'Gleichen ab…'
  },
  es: {
    title: '🔁 Sincronizar',
    notSet: 'Aún no está preparado. Escribe la dirección de Supabase y la clave anon en js/sync-config.js y vuelve a publicar.',
    help: 'Un aparato crea un código. El otro escribe ese mismo código una vez. Estrellas, puntos y stickers se quedan juntos. No se envía ningún nombre.',
    create: 'Crear código familiar',
    join: 'Unirse',
    placeholder: 'TIGER-4821-XXXXXXXX',
    active: 'Este aparato se sincroniza',
    stop: 'Dejar de sincronizar',
    stopAsk: '¿Dejar de sincronizar este aparato? El otro conserva su copia.',
    bad: 'Ese código no parece correcto.',
    offline: 'Guardado en este aparato. Se enviará cuando vuelva internet.',
    ok: 'Sincronizado.',
    working: 'Sincronizando…'
  }
};
function syncT() { return SYNC_TEXT[typeof lang === 'string' && SYNC_TEXT[lang] ? lang : 'en']; }
function syncConfigured() {
  return typeof SYNC_URL === 'string' && SYNC_URL.indexOf('https://') === 0 && typeof SYNC_ANON_KEY === 'string' && SYNC_ANON_KEY.length > 20;
}
function syncState() {
  try { return JSON.parse(localStorage.getItem('sl_sync') || 'null'); } catch (e) { return null; }
}
function syncSaveState(s) {
  try { syncRawSet('sl_sync', JSON.stringify(s)); } catch (e) {}
}
function syncTimes() {
  try { return JSON.parse(localStorage.getItem('sl_synctime') || '{}') || {}; } catch (e) { return {}; }
}
function syncSaveTimes(t) {
  try { syncRawSet('sl_synctime', JSON.stringify(t)); } catch (e) {}
}
let syncApplying = false, syncTimer = 0, syncMsg = '';
const syncRawSet = localStorage.setItem.bind(localStorage);
const syncRawRemove = localStorage.removeItem.bind(localStorage);
localStorage.setItem = function (k, v) {
  syncRawSet(k, v);
  if (!syncApplying && SyncMerge.syncIsProgress(k)) syncNote(k);
};
localStorage.removeItem = function (k) {
  syncRawRemove(k);
  if (!syncApplying && SyncMerge.syncIsProgress(k)) syncNote(k);
};
function syncNote(k) {
  const t = syncTimes();
  t[k] = Date.now();
  syncSaveTimes(t);
  if (syncState() && syncState().code) syncSchedule();
}
function syncSchedule() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => { syncPush().catch(() => {}); }, 1500);
}
function syncSnapshot() {
  const local = {}, times = syncTimes();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (SyncMerge.syncIsProgress(k)) local[k] = localStorage.getItem(k);
    }
  } catch (e) {}
  Object.keys(times).forEach(k => {
    if (SyncMerge.syncIsProgress(k) && !Object.prototype.hasOwnProperty.call(local, k)) local[k] = null;
  });
  return { local, times };
}
function syncApply(adopt, keys) {
  const times = syncTimes();
  let changed = false;
  syncApplying = true;
  try {
    Object.keys(adopt).forEach(k => {
      if (adopt[k] == null) { syncRawRemove(k); changed = true; }
      else if (localStorage.getItem(k) !== adopt[k]) { syncRawSet(k, adopt[k]); changed = true; }
      if (keys[k]) times[k] = keys[k].t || Date.now();
    });
    Object.keys(keys).forEach(k => { if (keys[k]) times[k] = keys[k].t || times[k] || Date.now(); });
    syncSaveTimes(times);
  } finally { syncApplying = false; }
  return changed;
}
async function syncHash(code) {
  const data = new TextEncoder().encode(SyncMerge.syncNormalizeCode(code));
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function syncRpc(name, body) {
  const res = await fetch(SYNC_URL.replace(/\/$/, '') + '/rest/v1/rpc/' + name, {
    method: 'POST',
    headers: {
      apikey: SYNC_ANON_KEY,
      Authorization: 'Bearer ' + SYNC_ANON_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
  if (!res.ok) throw new Error((data && data.message) || ('HTTP ' + res.status));
  return data;
}
async function syncPull() {
  const st = syncState();
  if (!st || !st.code || !syncConfigured()) return;
  syncMsg = syncT().working;
  syncRender();
  let remote;
  try { remote = await syncRpc('sync_pull', { p_id: await syncHash(st.code) }); }
  catch (e) { syncMsg = syncT().offline; syncRender(); return; }
  const snap = syncSnapshot();
  const merged = SyncMerge.syncMergeDoc(snap.local, snap.times, remote.keys || {}, Date.now());
  const changed = syncApply(merged.adopt, merged.keys);
  const same = JSON.stringify(merged.keys) === JSON.stringify(remote.keys || {});
  if (!same) {
    try { await syncPushKeys(merged.keys, remote.rev || 0); syncMsg = syncT().ok; }
    catch (e) { syncMsg = syncT().offline; }
  } else syncMsg = syncT().ok;
  syncRender();
  if (changed) location.reload();
}
async function syncPushKeys(keys, rev) {
  const st = syncState();
  if (!st || !st.code || !syncConfigured()) return;
  let base = rev != null ? rev : (st.rev || 0);
  for (let i = 0; i < 4; i++) {
    const res = await syncRpc('sync_push', { p_id: await syncHash(st.code), p_rev: base, p_keys: keys });
    if (res && res.conflict) {
      const snap = syncSnapshot();
      const merged = SyncMerge.syncMergeDoc(snap.local, snap.times, res.keys || {}, Date.now());
      syncApply(merged.adopt, merged.keys);
      keys = merged.keys;
      base = res.rev || 0;
      continue;
    }
    st.rev = res && res.rev || base;
    syncSaveState(st);
    return res;
  }
}
async function syncPush() {
  const st = syncState();
  if (!st || !st.code || !syncConfigured()) return;
  const snap = syncSnapshot();
  const merged = SyncMerge.syncMergeDoc(snap.local, snap.times, {}, Date.now());
  try {
    await syncPushKeys(merged.keys, st.rev || 0);
    syncMsg = syncT().ok;
  } catch (e) { syncMsg = syncT().offline; }
  syncRender();
}
function syncRender() {
  const box = document.getElementById('syncBody');
  const title = document.getElementById('syncTitle');
  if (!box) return;
  const T = syncT();
  if (title) title.textContent = T.title;
  const st = syncState();
  if (!syncConfigured()) {
    box.innerHTML = `<p class="syncNote">${T.notSet}</p>`;
    return;
  }
  if (st && st.code) {
    box.innerHTML = `<p class="syncNote">${T.active}</p><div class="syncCode">${st.code}</div><p class="syncNote">${syncMsg || ''}</p><button type="button" class="btn" id="syncStop">${T.stop}</button>`;
    const b = document.getElementById('syncStop');
    if (b) b.onclick = () => {
      if (!confirm(T.stopAsk)) return;
      syncRawRemove('sl_sync');
      syncMsg = '';
      syncRender();
    };
    return;
  }
  box.innerHTML = `<p class="syncNote">${T.help}</p><button type="button" class="btn" id="syncCreate">${T.create}</button><div class="syncJoin"><input id="syncCodeInput" maxlength="40" placeholder="${T.placeholder}" autocomplete="off" autocapitalize="characters"><button type="button" class="btn" id="syncJoin">${T.join}</button></div><p class="syncNote" id="syncMsg">${syncMsg || ''}</p>`;
  document.getElementById('syncCreate').onclick = () => {
    const code = SyncMerge.syncMakeCode();
    const times = syncTimes();
    const now = Date.now();
    const snap = syncSnapshot();
    Object.keys(snap.local).forEach(k => { if (snap.local[k] != null && !times[k]) times[k] = now; });
    syncSaveTimes(times);
    syncSaveState({ code, rev: 0 });
    syncMsg = '';
    syncRender();
    syncPush().catch(() => {});
  };
  document.getElementById('syncJoin').onclick = () => {
    const code = SyncMerge.syncNormalizeCode(document.getElementById('syncCodeInput').value);
    if (!SyncMerge.syncCodeOk(code)) { syncMsg = T.bad; syncRender(); return; }
    syncSaveState({ code, rev: 0 });
    syncMsg = '';
    syncPull().catch(() => {});
  };
}
function syncBoot() {
  syncRender();
  if (syncState() && syncState().code && syncConfigured()) syncPull().catch(() => {});
  window.addEventListener('focus', () => { if (syncState() && syncState().code) syncPull().catch(() => {}); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && syncState() && syncState().code) syncPull().catch(() => {});
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncBoot);
else syncBoot();
