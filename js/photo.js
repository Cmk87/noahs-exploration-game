/* =============================================================
   ANIMAL KINGDOM + PEOPLE OF THE WORLD
   Big photo tiles. The voice says the name in each ticked word-bridge
   language (the articles come from the photo pack, e.g. "el águila"),
   then a sound and one fact. No reading needed. First look at a card
   earns a passport stamp, kept on this device only.
============================================================= */
const PASS={a:[],p:[]};
try{
  const s=JSON.parse(localStorage.getItem('sl_passport')||'{}');
  if(s&&Array.isArray(s.a))PASS.a=s.a.filter(id=>PHOTO_PACK.animals.some(a=>a.id===id));
  if(s&&Array.isArray(s.p))PASS.p=s.p.filter(id=>PHOTO_PACK.people.some(p=>p.id===id));
}catch(e){}
function photoSave(){try{localStorage.setItem('sl_passport',JSON.stringify(PASS));}catch(e){}}
function photoStamp(kind,id){
  const arr=PASS[kind];if(!arr||arr.includes(id))return false;
  arr.push(id);photoSave();return true;
}
function photoCount(kind){return (PASS[kind]||[]).length;}

const HAB_COL={farm:'#E7A23A',pets:'#E07A6A',forest:'#2F9A45',jungle:'#1B7A48',savanna:'#D4922A',ocean:'#1E86C4',polar:'#6AAED4',birds:'#4AA0D8',bugs:'#7CB342',world:'#C47B3A'};
const PH={kind:'a',screen:'pick',hab:null,grp:null,idx:0};
let PUZ=null,photoGen=0,photoBound=false,photoDrag=null,photoSwallow=false;
const factN={};

function photoRoot(){return document.getElementById(PH.kind==='a'?'v-king':'v-folk');}
function photoNames(item){return {en:item.names.en.full,es:item.names.es.full,de:item.names.de.full};}
function photoEsc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function photoFact(item){
  const n=(item.facts||[]).length;if(!n)return null;
  const i=factN[item.id]||0;factN[item.id]=(i+1)%n;return item.facts[i];
}
function photoList(){
  if(PH.kind==='a')return PHOTO_PACK.animals.filter(a=>a.habitat===PH.hab);
  return PHOTO_PACK.people.filter(p=>p.group===PH.grp);
}
function photoCover(hab){const a=PHOTO_PACK.animals.find(x=>x.habitat===hab);return a?a.image:'';}
function photoCoverG(grp){const p=PHOTO_PACK.people.find(x=>x.group===grp);return p?p.image:'';}
function photoStop(){
  photoGen++;
  if(typeof bridgeStop==='function')bridgeStop();
  try{if('speechSynthesis' in window)speechSynthesis.cancel();}catch(e){}
}
function photoYay(){
  const a={es:['¡Muy bien!','¡Genial!','¡Sí!','¡Bravo!'],en:['Well done!','Great!','Yes!','Bravo!'],de:['Sehr gut!','Super!','Ja!','Bravo!']}[lang];
  return a[Math.floor(Math.random()*a.length)];
}
function photoLook(){return {es:'Mira otra vez',en:'Look again',de:'Schau noch mal'}[lang];}
function photoDoneLine(){return {es:'¡Lo has conseguido!',en:'You did it!',de:'Geschafft!'}[lang];}

/* Name in every ticked language, then (animals) the sound, then ONE fact
   in the learning language. The next tap of the same card says the other fact. */
function photoSpeak(item){
  const gen=++photoGen;
  const facts=()=>{
    if(gen!==photoGen)return;
    const f=photoFact(item);
    if(f&&f[lang])sayAt(f[lang],0.82);
  };
  sayWordBridge(photoNames(item),{then(){
    if(gen!==photoGen)return;
    if(PH.kind==='a'){
      const snd=item.sound&&item.sound[lang];
      if(snd){sayAt(snd,0.78);setTimeout(facts,Math.min(1800,Math.max(650,360+String(snd).length*80)));}
      else facts();
    }else{
      const w=item.where&&item.where[lang];
      if(w){sayAt(w,0.8);setTimeout(facts,Math.min(5200,Math.max(1200,520+String(w).length*46)));}
      else facts();
    }
  }});
}

function photoBind(){
  if(photoBound)return;photoBound=true;
  ['v-king','v-folk'].forEach(id=>{
    const el=document.getElementById(id);
    el.addEventListener('click',photoClick);
    el.addEventListener('pointerdown',photoDown);
    el.addEventListener('pointermove',photoMove);
    el.addEventListener('pointerup',photoUp);
    el.addEventListener('pointercancel',photoUp);
  });
}
function showKing(){photoEnter('a');}
function showFolk(){photoEnter('p');}
function photoEnter(kind){
  photoBind();photoStop();
  PH.kind=kind;PH.screen='pick';PH.hab=null;PH.grp=null;PH.idx=0;PUZ=null;
  renderPhoto();
}
function photoRelang(){
  const root=document.querySelector('.view.on');if(!root)return;
  const item=PH.screen==='card'?photoList()[PH.idx]:null;
  const nm=root.querySelector('.phName');
  if(nm&&item)nm.textContent=item.names[lang].full;
  root.querySelectorAll('.phCap').forEach(el=>{
    const id=el.dataset.cap;if(!id)return;
    const h=PHOTO_PACK.habitats.find(x=>x.id===id)||PHOTO_PACK.groups.find(x=>x.id===id);
    if(h)el.textContent=h[lang];
  });
  const hero=root.querySelector('.phHero');
  if(hero&&item)hero.alt=item.names[lang].full;
}

function photoClick(e){
  if(photoSwallow){photoSwallow=false;return;}
  const b=e.target.closest('[data-act]');if(!b||!photoRoot().contains(b))return;
  const act=b.dataset.act,id=b.dataset.id;
  if(act==='drag')return;
  if(typeof ac==='function')ac();
  if(act==='hab'){PH.hab=id;PH.screen='list';renderPhoto();const h=PHOTO_PACK.habitats.find(x=>x.id===id);if(h)say(h[lang]);}
  else if(act==='grp'){PH.grp=id;PH.screen='list';renderPhoto();const g=PHOTO_PACK.groups.find(x=>x.id===id);if(g)say(g[lang]);}
  else if(act==='open')openCard(id);
  else if(act==='back')photoBack();
  else if(act==='prev')stepCard(-1);
  else if(act==='next')stepCard(1);
  else if(act==='replay'){const it=photoList()[PH.idx];if(it)photoSpeak(it);}
  else if(act==='hide')startHide();
  else if(act==='live')startLive();
  else if(act==='pass'){photoStop();PH.screen='pass';renderPhoto();}
  else if(act==='pick')hideAnswer(b.dataset.ok==='1',b);
  else if(act==='drop')liveAnswer(b.dataset.ok==='1',b);
  else if(act==='stamp'){
    const items=b.dataset.kind==='p'?PHOTO_PACK.people:PHOTO_PACK.animals;
    const it=items.find(x=>x.id===id);if(it)sayWordBridge(photoNames(it));
  }
}
function photoBack(){
  photoStop();PUZ=null;
  if(PH.screen==='card')PH.screen='list';
  else PH.screen='pick';
  renderPhoto();
}
function openCard(id){
  const list=photoList();
  const i=list.findIndex(x=>x.id===id);
  PH.idx=i<0?0:i;PH.screen='card';
  const item=list[PH.idx];if(!item)return;
  const fresh=photoStamp(PH.kind,item.id);
  renderCard(item,fresh);
  photoSpeak(item);
}
function stepCard(d){
  const list=photoList();if(!list.length)return;
  PH.idx=(PH.idx+d+list.length)%list.length;
  const item=list[PH.idx];
  const fresh=photoStamp(PH.kind,item.id);
  renderCard(item,fresh);
  photoSpeak(item);
}

function toolsHTML(){
  const live=PH.kind==='a'?'<button type="button" class="phTool phLive" data-act="live" aria-label="habitat">🏡</button>':'';
  return `<div class="phTools"><button type="button" class="phTool phHide" data-act="hide" aria-label="hide">🙈</button>${live}<button type="button" class="phTool" data-act="pass" aria-label="passport">🛂</button></div>`;
}
function barHTML(emoji){
  return `<div class="phBar"><button type="button" class="phBack" data-act="back" aria-label="back">⬅️</button><span class="phTitle">${emoji||''}</span></div>`;
}
function renderPhoto(){
  if(PH.screen==='pick')renderPick();
  else if(PH.screen==='list')renderList();
  else if(PH.screen==='card'){const it=photoList()[PH.idx];if(it)renderCard(it,false);}
  else if(PH.screen==='pass')renderPass();
  else if(PH.screen==='hide')renderHide();
  else if(PH.screen==='live')renderLive();
  const root=photoRoot();if(root)root.scrollTop=0;
}
function renderPick(){
  const root=photoRoot();
  let tiles;
  if(PH.kind==='a'){
    tiles=PHOTO_PACK.habitats.map(h=>`<button type="button" class="phHab" data-act="hab" data-id="${h.id}" aria-label="${photoEsc(h[lang])}"><img src="${photoCover(h.id)}" alt="" loading="lazy" decoding="async" draggable="false"><span class="phEm">${h.emoji}</span><span class="phCap" data-cap="${h.id}">${photoEsc(h[lang])}</span></button>`).join('');
    root.innerHTML=toolsHTML()+`<div class="phGrid">${tiles}</div>`;
  }else{
    tiles=PHOTO_PACK.groups.map(g=>`<button type="button" class="phGrp" data-act="grp" data-id="${g.id}" aria-label="${photoEsc(g[lang])}"><img src="${photoCoverG(g.id)}" alt="" loading="lazy" decoding="async" draggable="false"><span class="phEm">${g.emoji}</span><span class="phCap" data-cap="${g.id}">${photoEsc(g[lang])}</span></button>`).join('');
    root.innerHTML=toolsHTML()+`<div class="phGrid phGroups">${tiles}</div>`;
  }
}
function renderList(){
  const meta=PH.kind==='a'?PHOTO_PACK.habitats.find(h=>h.id===PH.hab):PHOTO_PACK.groups.find(g=>g.id===PH.grp);
  const tiles=photoList().map(it=>`<button type="button" class="phAn" data-act="open" data-id="${it.id}" aria-label="${photoEsc(it.names[lang].full)}"><img src="${it.image}" alt="" loading="lazy" decoding="async" draggable="false"></button>`).join('');
  photoRoot().innerHTML=barHTML(meta?meta.emoji:'')+`<div class="phGrid">${tiles}</div>`;
}
function renderCard(item,fresh){
  photoRoot().innerHTML=`${barHTML(fresh?'🛂':'')}
    <img class="phHero${fresh?' fresh':''}" src="${item.image}" alt="${photoEsc(item.names[lang].full)}" draggable="false">
    <div class="phName">${photoEsc(item.names[lang].full)}</div>
    <div class="phNav">
      <button type="button" class="phArrow" data-act="prev" aria-label="previous">◀</button>
      <button type="button" class="phReplay" data-act="replay" aria-label="again">🔊</button>
      <button type="button" class="phArrow" data-act="next" aria-label="next">▶</button>
    </div>`;
}
function renderPass(){
  const block=(kind,emoji,items)=>{
    const tiles=(PASS[kind]||[]).map(id=>{
      const it=items.find(x=>x.id===id);if(!it)return '';
      return `<button type="button" class="phStamp" data-act="stamp" data-kind="${kind}" data-id="${id}" aria-label="${photoEsc(it.names[lang].full)}"><img src="${it.image}" alt="" loading="lazy" decoding="async" draggable="false"></button>`;
    }).join('');
    return `<div class="phPassHead">${emoji}</div>${tiles?`<div class="phStamps">${tiles}</div>`:'<div class="phEmpty">○</div>'}`;
  };
  photoRoot().innerHTML=barHTML('🛂')+block('a','🦁',PHOTO_PACK.animals)+block('p','👥',PHOTO_PACK.people);
}

/* ---- Who's hiding? The photo sharpens on its own. Three pictures, no losing. ---- */
function startHide(){
  photoStop();PH.screen='hide';
  PUZ={got:0,miss:0,locked:false,item:null,opts:[]};
  hideRound();
}
function hideRound(){
  const all=PH.kind==='a'?PHOTO_PACK.animals:PHOTO_PACK.people;
  const item=all[Math.floor(Math.random()*all.length)];
  const pool=all.filter(x=>x.id!==item.id);
  const opts=[item];
  while(opts.length<3&&pool.length)opts.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
  for(let i=opts.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=opts[i];opts[i]=opts[j];opts[j]=t;}
  PUZ.item=item;PUZ.opts=opts;PUZ.locked=false;PUZ.miss=0;
  PH.screen='hide';renderHide();
}
function renderHide(){
  const opts=PUZ.opts.map(it=>`<button type="button" class="phChoice" data-act="pick" data-ok="${it.id===PUZ.item.id?'1':'0'}"><img src="${it.image}" alt="" draggable="false"></button>`).join('');
  photoRoot().innerHTML=`${barHTML('🙈')}<div class="phReveal"><img class="phBlur" src="${PUZ.item.image}" alt="" draggable="false"></div><div class="phChoices">${opts}</div>`;
}
function hideAnswer(ok,btn){
  if(!PUZ||PUZ.locked||PH.screen!=='hide')return;
  if(!ok){
    PUZ.miss++;
    btn.classList.remove('phBad');void btn.offsetWidth;btn.classList.add('phBad');
    say(photoLook());
    if(PUZ.miss>=2){const c=photoRoot().querySelector('.phChoice[data-ok="1"]');if(c)c.classList.add('phHint');}
    return;
  }
  PUZ.locked=true;btn.classList.add('phGood');
  if(typeof award==='function')award(0);
  [523,659,784].forEach((f,i)=>beep(f,i*0.07,0.15,'triangle',0.15));
  const gen=++photoGen,item=PUZ.item,got=PUZ.got;
  sayWordBridge(photoNames(item),{then(){
    if(gen!==photoGen||!PUZ)return;
    sayAt(photoYay(),0.8);
    setTimeout(()=>{
      if(gen!==photoGen||!PUZ)return;
      PUZ.got=got+1;
      if(PUZ.got>=4)photoCheer('🙈');
      else hideRound();
    },900);
  }});
}

/* ---- Where do I live? Drag or tap the animal onto its habitat. ---- */
function startLive(){
  if(PH.kind!=='a')return;
  photoStop();PH.screen='live';
  PUZ={got:0,miss:0,locked:false,item:null,habs:[]};
  liveRound();
}
function liveRound(){
  const all=PHOTO_PACK.animals;
  const item=all[Math.floor(Math.random()*all.length)];
  const right=PHOTO_PACK.habitats.find(h=>h.id===item.habitat);
  const pool=PHOTO_PACK.habitats.filter(h=>h.id!==item.habitat);
  const extra=Math.random()<0.5?1:2;
  const habs=[right];
  while(habs.length<1+extra&&pool.length)habs.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
  for(let i=habs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=habs[i];habs[i]=habs[j];habs[j]=t;}
  PUZ.item=item;PUZ.habs=habs;PUZ.locked=false;PUZ.miss=0;
  PH.screen='live';renderLive();
}
function renderLive(){
  const habs=PUZ.habs.map(h=>`<button type="button" class="phLiveHab" data-act="drop" data-ok="${h.id===PUZ.item.habitat?'1':'0'}" style="background:${HAB_COL[h.id]||'#888'}" aria-label="${photoEsc(h[lang])}"><span class="phLiveEm">${h.emoji}</span></button>`).join('');
  photoRoot().innerHTML=`${barHTML('🏡')}<div class="phStage"><div class="phDrag" data-act="drag"><img src="${PUZ.item.image}" alt="" draggable="false"></div><div class="phLiveRow">${habs}</div></div>`;
}
function liveAnswer(ok,btn){
  if(!PUZ||PUZ.locked||PH.screen!=='live')return;
  if(!ok){
    PUZ.miss++;
    if(btn){btn.classList.remove('phBad');void btn.offsetWidth;btn.classList.add('phBad');}
    say(photoLook());
    if(PUZ.miss>=2){const c=photoRoot().querySelector('.phLiveHab[data-ok="1"]');if(c)c.classList.add('phHint');}
    return;
  }
  PUZ.locked=true;if(btn)btn.classList.add('phGood');
  if(typeof award==='function')award(0);
  [523,659,784].forEach((f,i)=>beep(f,i*0.07,0.15,'triangle',0.15));
  const gen=++photoGen,item=PUZ.item,got=PUZ.got;
  sayWordBridge(photoNames(item),{then(){
    if(gen!==photoGen||!PUZ)return;
    sayAt(photoYay(),0.8);
    setTimeout(()=>{
      if(gen!==photoGen||!PUZ)return;
      PUZ.got=got+1;
      if(PUZ.got>=4)photoCheer('🏡');
      else liveRound();
    },900);
  }});
}
function photoCheer(emoji){
  PH.screen='cheer';PUZ=null;
  const again=emoji==='🏡'?'live':'hide';
  photoRoot().innerHTML=`${barHTML('')}<div class="phCheer"><div class="phCup">🏆</div><button type="button" class="phAgain" data-act="${again}" aria-label="again">🔁</button></div>`;
  if(typeof rainEmoji==='function')rainEmoji(['⭐','🎉','🏆','✨'],16);
  if(typeof fanfare==='function')fanfare();
  say(photoDoneLine());
}

function photoDown(e){
  const el=e.target.closest('.phDrag');
  if(!el||PH.screen!=='live'||!photoRoot().contains(el))return;
  photoDrag={el,id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};
  try{el.setPointerCapture(e.pointerId);}catch(err){}
}
function photoMove(e){
  const d=photoDrag;if(!d||e.pointerId!==d.id)return;
  const dx=e.clientX-d.x,dy=e.clientY-d.y;
  if(Math.hypot(dx,dy)>10)d.moved=true;
  d.el.style.transform=`translate(${dx}px,${dy}px) scale(1.06)`;
}
function photoUp(e){
  const d=photoDrag;if(!d||e.pointerId!==d.id)return;
  photoDrag=null;
  d.el.style.transform='';
  if(!d.moved)return;
  d.el.style.pointerEvents='none';
  const under=document.elementFromPoint(e.clientX,e.clientY);
  d.el.style.pointerEvents='';
  const hab=under&&under.closest&&under.closest('.phLiveHab');
  if(!hab)return;
  photoSwallow=true;
  liveAnswer(hab.dataset.ok==='1',hab);
}
