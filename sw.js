/* Offline support. Network first, so every launch with a connection picks
   up the newest version from the server; the cached copy is only used
   when there is no network (car, plane, flaky Wi-Fi). */
const CACHE='explorer-v24';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-180.png','./css/app.css','./fonts/baloo-2-latin-700-normal.woff2','./fonts/baloo-2-latin-800-normal.woff2','./fonts/nunito-latin-600-normal.woff2','./fonts/nunito-latin-800-normal.woff2',
  ...['core','shapes','vocab','audio','trace','learn','read','space','dinoshow','prizes','world-data','world','city-wild','city-far','city-west','city-industry','city','stickers','app'].map(n=>`./js/${n}.js`)];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  // a connection without real internet (car hotspot) can hang for ages: after 3 s use the cached copy
  const fromCache=()=>caches.match(req,{ignoreSearch:true}).then(r=>r||(req.mode==='navigate'?caches.match('./index.html'):r));
  e.respondWith(new Promise(resolve=>{
    let done=false;const finish=r=>{if(!done&&r){done=true;resolve(r);}};
    const t=setTimeout(()=>fromCache().then(finish),3000);
    fetch(req).then(res=>{
      if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
      clearTimeout(t);finish(res);
    }).catch(()=>{clearTimeout(t);fromCache().then(r=>finish(r||Response.error()));});
  }));
});
