/* Offline support. Network first, so every launch with a connection picks
   up the newest version from the server; the cached copy is only used
   when there is no network (car, plane, flaky Wi-Fi). */
const CACHE='explorer-v11';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-180.png','./css/app.css','./fonts/baloo-2-latin-700-normal.woff2','./fonts/baloo-2-latin-800-normal.woff2','./fonts/nunito-latin-600-normal.woff2','./fonts/nunito-latin-800-normal.woff2',
  ...['core','shapes','vocab','audio','trace','learn','space','dinoshow','prizes','world-data','world','city-wild','city-far','city-west','city','app'].map(n=>`./js/${n}.js`)];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  e.respondWith(fetch(req).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
    return res;
  }).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});
