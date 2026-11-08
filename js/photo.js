/* =============================================================
   ANIMAL KINGDOM + PEOPLE OF THE WORLD (and vehicles, babies, body)
   Big photo tiles. The voice says the name in the app language (the
   articles come from the photo pack, e.g. "el águila"), then a sound or
   where they live, and one fact. Small flags on the card say the same
   name, sound and fact in the other languages, only when tapped.
   First look at a card earns a passport stamp, kept on this device only.
============================================================= */
const PASS={a:[],p:[],v:[],b:[],y:[],t:[]};
try{
  const s=JSON.parse(localStorage.getItem('sl_passport')||'{}');
  if(s&&Array.isArray(s.a))PASS.a=s.a.filter(id=>PHOTO_PACK.animals.some(a=>a.id===id));
  if(s&&Array.isArray(s.p))PASS.p=s.p.filter(id=>PHOTO_PACK.people.some(p=>p.id===id));
  if(s&&Array.isArray(s.v))PASS.v=s.v.filter(id=>PHOTO_PACK.vehicles.some(x=>x.id===id));
  if(s&&Array.isArray(s.b))PASS.b=s.b.filter(id=>PHOTO_PACK.pairs.some(x=>x.id===id));
  if(s&&Array.isArray(s.y))PASS.y=s.y.filter(id=>(PHOTO_PACK.body||[]).some(x=>x.id===id));
  if(s&&Array.isArray(s.t))PASS.t=s.t.filter(id=>(PHOTO_PACK.things||[]).some(x=>x.id===id));
}catch(e){}
function photoSave(){try{localStorage.setItem('sl_passport',JSON.stringify(PASS));}catch(e){}}
function photoStamp(kind,id){
  const arr=PASS[kind];if(!arr||arr.includes(id))return false;
  arr.push(id);photoSave();return true;
}
function photoCount(kind){return (PASS[kind]||[]).length;}

const HAB_COL={farm:'#E7A23A',pets:'#E07A6A',forest:'#2F9A45',jungle:'#1B7A48',savanna:'#D4922A',ocean:'#1E86C4',polar:'#6AAED4',birds:'#4AA0D8',bugs:'#7CB342',world:'#C47B3A'};
const VEH_ORDER=['helpers','buildingSite','road','rails','air','water'];
const PHOTO_VIEW={a:'v-king',p:'v-folk',v:'v-ride',b:'v-baby',y:'v-body',t:'v-things',d:'v-dinos'};
const PH={kind:'a',screen:'pick',hab:null,grp:null,idx:0,fact:null,playId:null,pickTop:0,listTop:0};
let PUZ=null,photoGen=0,photoBound=false,photoDrag=null,photoSwallow=false;
const factN={};

function photoRoot(){return document.getElementById(PHOTO_VIEW[PH.kind]);}
function vehicleGroups(){return VEH_ORDER.map(id=>(PHOTO_PACK.vehicleGroups||[]).find(g=>g.id===id)).filter(Boolean);}
function thingGroups(){return PHOTO_PACK.thingGroups||[];}
function bodyGroups(){return PHOTO_PACK.bodyGroups||[];}
function isInline(){return PH.kind==='a'||PH.kind==='v'||PH.kind==='t'||PH.kind==='d';}
function bodyItems(gid){
  const list=(PHOTO_PACK.body||[]).filter(x=>x.group===gid);
  return list.slice().sort((a,b)=>(b.overview?1:0)-(a.overview?1:0));
}
/* a sense card ("smelling") is shown and spoken as the sense; games that point at the body use the part ("the nose") */
function partNames(item){return item.part||item.names;}
function photoNames(item){return {en:item.names.en.full,es:item.names.es.full,de:item.names.de.full};}
function photoEsc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function photoFact(item){
  const n=(item.facts||[]).length;if(!n)return null;
  const i=factN[item.id]||0;factN[item.id]=(i+1)%n;return item.facts[i];
}
function photoList(){
  if(PH.kind==='a')return PHOTO_PACK.animals.filter(a=>a.habitat===PH.hab);
  if(PH.kind==='v')return PHOTO_PACK.vehicles.filter(x=>x.group===PH.grp);
  if(PH.kind==='t')return (PHOTO_PACK.things||[]).filter(x=>x.group===PH.grp);
  if(PH.kind==='d')return PHOTO_PACK.dinos||[];
  if(PH.kind==='y')return bodyItems(PH.grp);
  if(PH.kind==='b')return PHOTO_PACK.pairs;
  return PHOTO_PACK.people.filter(p=>p.group===PH.grp);
}
function photoCover(hab){const a=PHOTO_PACK.animals.find(x=>x.habitat===hab);return a?a.image:'';}
function photoCoverG(grp){const p=PHOTO_PACK.people.find(x=>x.group===grp);return p?p.image:'';}
function photoCoverV(grp){const x=PHOTO_PACK.vehicles.find(v=>v.group===grp);return x?x.image:'';}
function photoCoverT(grp){const x=(PHOTO_PACK.things||[]).find(v=>v.group===grp);return x?x.image:'';}
function photoCoverY(grp){const x=bodyItems(grp)[0];return x?x.image:'';}
function photoStop(){
  photoGen++;
  if(typeof bridgeStop==='function')bridgeStop();
  try{if('speechSynthesis' in window)speechSynthesis.cancel();}catch(e){}
}
/* A fresh line (a habitat, "look again"). The chain helper waits out an
   iPhone cancel() before speaking. A follow-on line (the sound, the fact,
   the little bit of praise) must NOT cancel: the names are already finished
   and the next line simply waits its turn. */
function photoSay(text,L){
  if(!text)return;
  speakFresh(text,L||lang,0.8);
}
function photoAfter(text,L,done){
  if(!text){if(done)done();return;}
  speakChained(text,L||lang,0.82,done||function(){},bridgeGen);
}
function photoYay(){
  const a={es:['¡Muy bien!','¡Genial!','¡Sí!','¡Bravo!'],en:['Well done!','Great!','Yes!','Bravo!'],de:['Sehr gut!','Super!','Ja!','Bravo!']}[lang];
  return a[Math.floor(Math.random()*a.length)];
}
function photoLook(){return {es:'Mira otra vez',en:'Look again',de:'Schau noch mal'}[lang];}
function photoDoneLine(){return {es:'¡Lo has conseguido!',en:'You did it!',de:'Geschafft!'}[lang];}

/* Lines one after the other in one language: the first stops whatever was talking,
   the rest wait their turn. */
function photoSeq(lines,L,done){
  const gen=++photoGen,list=lines.filter(Boolean);
  const go=i=>{
    if(gen!==photoGen)return;
    if(i>=list.length){if(done)done();return;}
    if(i===0)speakFresh(list[0],L,0.8,()=>go(1));
    else photoAfter(list[i],L,()=>go(i+1));
  };
  go(0);
}
/* Name, then a vehicle or body sound, or where a person lived, then ONE fact.
   Animals, things and dinosaurs skip straight to the fact: no animal noises.
   In the app language the next tap says the other fact; a flag says the same fact. */
function midLine(item,L){
  if(PH.kind==='a'||PH.kind==='t'||PH.kind==='d')return null;
  if(PH.kind==='v'||PH.kind==='y')return item.sound&&item.sound[L];
  return item.where&&item.where[L];
}
function photoSpeak(item,L){
  const own=!L||L===lang;L=L||lang;
  if(own||!PH.fact)PH.fact=photoFact(item);
  const f=PH.fact;
  photoSeq([item.names[L].full,midLine(item,L),f&&f[L]],L);
}
/* say the fact already chosen, without moving on to the next one */
function photoAgain(){
  if(!isInline()||PH.screen!=='list'||!PH.playId)return false;
  const item=photoList()[PH.idx];if(!item||item.id!==PH.playId)return false;
  const f=PH.fact||photoFact(item);
  photoSeq([item.names[lang].full,midLine(item,lang),f&&f[lang]],lang);
  return true;
}
/* the other languages, as small flags: tap one to hear it all in that language */
function otherLangs(){return flagLangs();}
const LANG_NAME={es:'español',en:'English',de:'Deutsch'};
function langsHTML(item){
  const ls=otherLangs();if(!ls.length)return '';
  return `<div class="phLangs">${ls.map(c=>{
    const said=item&&item.names&&item.names[c]?item.names[c].full:c;
    return `<button type="button" class="phLang" data-act="lang" data-l="${c}" aria-label="${photoEsc(LANG_NAME[c]+': '+said)}">${BRIDGE_MARK[c]}</button>`;
  }).join('')}</div>`;
}

function photoBind(){
  if(photoBound)return;photoBound=true;
  ['v-king','v-folk','v-ride','v-baby','v-body','v-things','v-dinos'].forEach(id=>{
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
function showRide(){photoEnter('v');}
function showBaby(){photoEnter('b');}
function showBody(){photoEnter('y');}
function showThings(){photoEnter('t');}
function showDinos(){
  photoBind();photoStop();
  PH.kind='d';PH.screen='list';PH.hab=null;PH.grp=null;PH.idx=0;PH.playId=null;PUZ=null;
  renderPhoto();
}
function photoEnter(kind){
  photoBind();photoStop();
  PH.kind=kind;PH.screen='pick';PH.hab=null;PH.grp=null;PH.idx=0;PH.playId=null;PUZ=null;
  renderPhoto();
}
function photoRelang(){
  const root=document.querySelector('.view.on');if(!root)return;
  if((isInline()||PH.kind==='y')&&PH.screen==='list'){
    const item=PH.playId?photoList().find(x=>x.id===PH.playId):null;
    const bar=root.querySelector('#phNow');
    if(bar){if(item)fillNow(item);else fillGroupTitle();}
  }
  const item=PH.screen==='card'?photoList()[PH.idx]:null;
  const nm=root.querySelector('.phName');
  if(nm&&PH.screen==='touch'&&PUZ&&PUZ.item)nm.textContent=partNames(PUZ.item)[lang].full;
  else if(nm&&item&&PH.kind==='b'){
    const who=root.querySelector('.phMorphTop.gone')?item.adult:item.baby;
    nm.textContent=who.names[lang].full;
  }else if(nm&&item&&item.names)nm.textContent=item.names[lang].full;
  root.querySelectorAll('.phCap').forEach(el=>{
    const id=el.dataset.cap;if(!id)return;
    const h=PHOTO_PACK.habitats.find(x=>x.id===id)||PHOTO_PACK.groups.find(x=>x.id===id)||vehicleGroups().find(x=>x.id===id)||thingGroups().find(x=>x.id===id)||bodyGroups().find(x=>x.id===id);
    if(h)el.textContent=h[lang];
  });
  const lg=root.querySelector('.phLangs');if(lg)lg.outerHTML=langsHTML()||'<div class="phLangs"></div>';
  const hero=root.querySelector('.phHero');
  if(hero&&item&&item.names)hero.alt=item.names[lang].full;
}

function photoClick(e){
  if(photoSwallow){photoSwallow=false;return;}
  const b=e.target.closest('[data-act]');if(!b||!photoRoot().contains(b))return;
  const act=b.dataset.act,id=b.dataset.id;
  if(act==='drag')return;
  if(typeof ac==='function')ac();
  if((act==='hab'||act==='grp')&&PH.screen==='pick')PH.pickTop=photoRoot().scrollTop;
  if(act==='open'&&PH.screen==='list')PH.listTop=photoRoot().scrollTop;
  if(act==='open'&&PH.screen==='pick'&&PH.kind==='b')PH.pickTop=photoRoot().scrollTop;
  if(act==='hab'){PH.hab=id;PH.playId=null;PH.screen='list';renderPhoto();const h=PHOTO_PACK.habitats.find(x=>x.id===id);if(h)photoSay(h[lang]);}
  else if(act==='grp'){PH.grp=id;PH.playId=null;PH.screen='list';renderPhoto();const g=(PH.kind==='y'?bodyGroups():PH.kind==='t'?thingGroups():PH.kind==='v'?vehicleGroups():PHOTO_PACK.groups).find(x=>x.id===id);if(g)photoSay(g[lang]);}
  else if(act==='play')playItem(id);
  else if(act==='part'){if(BV.suppress){BV.suppress=false;clearTimeout(BV.hold);return;}playBody(id);}
  else if(act==='zin')bodyZoom(1.35);
  else if(act==='zout')bodyZoom(1/1.35);
  else if(act==='zfit')bodyFit();
  else if(act==='open')openCard(id);
  else if(act==='back')photoBack();
  else if(act==='prev')stepCard(-1);
  else if(act==='next')stepCard(1);
  else if(act==='replay'){const it=photoList()[PH.idx];if(it){if(PH.kind==='b')photoSpeakBaby(it);else photoSpeak(it);}}
  else if(act==='lang'){const it=photoList()[PH.idx],L=b.dataset.l;if(it&&L){if(PH.kind==='b')photoSpeakBaby(it,L);else photoSpeak(it,L);}}
  else if(act==='find')findAnswer(id,b);
  else if(act==='findSay'){if(PUZ&&PUZ.item)photoSay(findQ(PUZ.item));}
  else if(act==='hide')startHide();
  else if(act==='live')startLive();
  else if(act==='grow')startGrow();
  else if(act==='touch')startTouch();
  else if(act==='touched')touchYes();
  else if(act==='pass'){photoStop();PH.screen='pass';renderPhoto();}
  else if(act==='drop')liveAnswer(b.dataset.ok==='1',b);
  else if(act==='growPick')growAnswer(b.dataset.ok==='1',b);
  else if(act==='stamp'){
    const it=stampItem(b.dataset.kind,id);
    if(it)photoSay((b.dataset.kind==='b'?it.baby:it).names[lang].full);
  }
}
function stampItem(kind,id){
  if(kind==='p')return PHOTO_PACK.people.find(x=>x.id===id);
  if(kind==='v')return PHOTO_PACK.vehicles.find(x=>x.id===id);
  if(kind==='b')return PHOTO_PACK.pairs.find(x=>x.id===id);
  if(kind==='y')return (PHOTO_PACK.body||[]).find(x=>x.id===id);
  if(kind==='t')return (PHOTO_PACK.things||[]).find(x=>x.id===id);
  return PHOTO_PACK.animals.find(x=>x.id===id);
}
/* back goes to where he was in the list, not to the top; if he paged on with the
   arrows, the picture he last looked at is brought into view */
function photoBack(){
  photoStop();PUZ=null;
  if(PH.kind==='d'&&PH.screen==='list'){showTab('home');return;}
  const from=PH.screen,root=photoRoot();
  let top=0;
  if(from==='card'&&PH.kind!=='b'){PH.screen='list';top=PH.listTop;}
  else{PH.screen='pick';top=from==='card'||from==='list'?PH.pickTop:0;}
  renderPhoto();
  root.scrollTop=top;
  if(from==='card'){const it=photoList()[PH.idx],t=it&&root.querySelector(`[data-act="open"][data-id="${it.id}"]`);
    if(t){const r=t.getBoundingClientRect(),v=root.getBoundingClientRect();if(r.top<v.top||r.bottom>v.bottom)t.scrollIntoView({block:'center'});}}
}
function openCard(id){
  const list=photoList();
  const i=list.findIndex(x=>x.id===id);
  PH.idx=i<0?0:i;PH.screen='card';
  const item=list[PH.idx];if(!item)return;
  const fresh=photoStamp(PH.kind,item.id);
  if(PH.kind==='b'){renderBabyCard(item,fresh);photoSpeakBaby(item);}
  else{renderCard(item,fresh);photoSpeak(item);}
}
function stepCard(d){
  const list=photoList();if(!list.length)return;
  PH.idx=(PH.idx+d+list.length)%list.length;
  const item=list[PH.idx];
  const fresh=photoStamp(PH.kind,item.id);
  if(PH.kind==='b'){renderBabyCard(item,fresh);photoSpeakBaby(item);}
  else{renderCard(item,fresh);photoSpeak(item);}
}
/* Baby photo slides aside, then the grown-up name, then one growing-up fact. */
function photoSpeakBaby(pair,L){
  const own=!L||L===lang;L=L||lang;
  if(own||!PH.fact)PH.fact=photoFact(pair);
  const f=PH.fact;
  const gen=++photoGen;
  const root=photoRoot();
  const top=root.querySelector('.phMorphTop');
  const nm=root.querySelector('.phName');
  if(top)top.classList.remove('gone');
  if(nm)nm.textContent=pair.baby.names[lang].full;
  speakFresh(pair.baby.names[L].full,L,0.8,()=>{
    if(gen!==photoGen)return;
    if(top)top.classList.add('gone');
    if(nm)nm.textContent=pair.adult.names[lang].full;
    setTimeout(()=>{
      if(gen!==photoGen)return;
      photoAfter(pair.adult.names[L].full,L,()=>{
        if(gen!==photoGen)return;
        if(f&&f[L])photoAfter(f[L],L);
      });
    },450);
  });
}

function toolsHTML(){
  const hide=PH.kind==='b'?'':'<button type="button" class="phTool phHide" data-act="hide" aria-label="find">👂</button>';
  const live=PH.kind==='a'?'<button type="button" class="phTool phLive" data-act="live" aria-label="habitat">🏡</button>':'';
  const grow=PH.kind==='b'?'<button type="button" class="phTool phGrow" data-act="grow" aria-label="match">🐣</button>':'';
  const touch=PH.kind==='y'?'<button type="button" class="phTool phTouch" data-act="touch" aria-label="touch">👆</button>':'';
  return `<div class="phTools">${hide}${live}${grow}${touch}<button type="button" class="phTool" data-act="pass" aria-label="passport">🛂</button></div>`;
}
function barHTML(emoji){
  return `<div class="phBar"><button type="button" class="phBack" data-act="back" aria-label="back">⬅️</button><span class="phTitle">${emoji||''}</span></div>`;
}
function renderPhoto(){
  if(PH.screen==='pick')renderPick();
  else if(PH.screen==='list'&&PH.kind==='y')renderBodyMap();
  else if(PH.screen==='list')renderList();
  else if(PH.screen==='card'){const it=photoList()[PH.idx];if(it){if(PH.kind==='b')renderBabyCard(it,false);else renderCard(it,false);}}
  else if(PH.screen==='pass')renderPass();
  else if(PH.screen==='hide')renderFind();
  else if(PH.screen==='live')renderLive();
  const root=photoRoot();if(root)root.scrollTop=0;
}
function renderPick(){
  const root=photoRoot();
  let tiles;
  if(PH.kind==='a'){
    tiles=PHOTO_PACK.habitats.map(h=>`<button type="button" class="phHab" data-act="hab" data-id="${h.id}" aria-label="${photoEsc(h[lang])}"><img src="${photoCover(h.id)}" alt="" loading="lazy" decoding="async" draggable="false"><span class="phEm">${h.emoji}</span><span class="phCap" data-cap="${h.id}">${photoEsc(h[lang])}</span></button>`).join('');
    root.innerHTML=toolsHTML()+`<div class="phGrid">${tiles}</div>`;
  }else if(PH.kind==='v'){
    tiles=vehicleGroups().map(g=>`<button type="button" class="phHab" data-act="grp" data-id="${g.id}" aria-label="${photoEsc(g[lang])}"><img src="${photoCoverV(g.id)}" alt="" loading="lazy" decoding="async" draggable="false"><span class="phEm">${g.emoji}</span><span class="phCap" data-cap="${g.id}">${photoEsc(g[lang])}</span></button>`).join('');
    root.innerHTML=toolsHTML()+`<div class="phGrid">${tiles}</div>`;
  }else if(PH.kind==='t'){
    tiles=thingGroups().map(g=>`<button type="button" class="phHab" data-act="grp" data-id="${g.id}" aria-label="${photoEsc(g[lang])}"><img src="${photoCoverT(g.id)}" alt="" loading="lazy" decoding="async" draggable="false"><span class="phEm">${g.emoji}</span><span class="phCap" data-cap="${g.id}">${photoEsc(g[lang])}</span></button>`).join('');
    root.innerHTML=toolsHTML()+`<div class="phGrid">${tiles}</div>`;
  }else if(PH.kind==='y'){
    tiles=bodyGroups().map(g=>`<button type="button" class="phHab" data-act="grp" data-id="${g.id}" aria-label="${photoEsc(g[lang])}"><img src="${photoCoverY(g.id)}" alt="" loading="lazy" decoding="async" draggable="false"><span class="phEm">${g.emoji}</span><span class="phCap" data-cap="${g.id}">${photoEsc(g[lang])}</span></button>`).join('');
    root.innerHTML=toolsHTML()+`<div class="phGrid">${tiles}</div>`;
  }else if(PH.kind==='b'){
    tiles=PHOTO_PACK.pairs.map(p=>`<button type="button" class="phAn" data-act="open" data-id="${p.id}" aria-label="${photoEsc(p.baby.names[lang].full)}"><img src="${p.baby.image}" alt="" loading="lazy" decoding="async" draggable="false"></button>`).join('');
    root.innerHTML=toolsHTML()+`<div class="phGrid">${tiles}</div>`;
  }else{
    tiles=PHOTO_PACK.groups.map(g=>`<button type="button" class="phGrp" data-act="grp" data-id="${g.id}" aria-label="${photoEsc(g[lang])}"><img src="${photoCoverG(g.id)}" alt="" loading="lazy" decoding="async" draggable="false"><span class="phEm">${g.emoji}</span><span class="phCap" data-cap="${g.id}">${photoEsc(g[lang])}</span></button>`).join('');
    root.innerHTML=toolsHTML()+`<div class="phGrid phGroups">${tiles}</div>`;
  }
}
function renderBabyCard(pair,fresh){
  photoRoot().innerHTML=`${barHTML(fresh?'🛂':'')}
    <div class="phMorph">
      <img class="phHero phAdult" src="${pair.adult.image}" alt="${photoEsc(pair.adult.names[lang].full)}" draggable="false">
      <img class="phHero phMorphTop" src="${pair.baby.image}" alt="${photoEsc(pair.baby.names[lang].full)}" draggable="false">
    </div>
    <div class="phName">${photoEsc(pair.baby.names[lang].full)}</div>${langsHTML()}
    <div class="phNav">
      <button type="button" class="phArrow" data-act="prev" aria-label="previous">◀</button>
      <button type="button" class="phReplay" data-act="replay" aria-label="again">🔊</button>
      <button type="button" class="phArrow" data-act="next" aria-label="next">▶</button>
    </div>`;
}
function listMeta(){
  if(PH.kind==='a')return PHOTO_PACK.habitats.find(h=>h.id===PH.hab);
  if(PH.kind==='v')return vehicleGroups().find(g=>g.id===PH.grp);
  if(PH.kind==='t')return thingGroups().find(g=>g.id===PH.grp);
  if(PH.kind==='d')return {emoji:'🦕',en:'Dinosaurs',es:'Dinosaurios',de:'Dinosaurier'};
  if(PH.kind==='y')return bodyGroups().find(g=>g.id===PH.grp);
  return PHOTO_PACK.groups.find(g=>g.id===PH.grp);
}
function fillGroupTitle(){
  const bar=photoRoot().querySelector('#phNow');if(!bar)return;
  const meta=listMeta();
  bar.hidden=false;bar.classList.remove('on');
  bar.innerHTML=`<div class="phName">${photoEsc(meta?meta[lang]:'')}</div>`;
}
function fillNow(item){
  const root=photoRoot(),bar=root.querySelector('#phNow');if(!bar||!item)return;
  const y=root.scrollTop;
  bar.hidden=false;bar.classList.add('on');
  bar.innerHTML=`<div class="phName">${photoEsc(item.names[lang].full)}</div>${langsHTML(item)}`;
  root.scrollTop=y;
}
function playItem(id){
  const list=photoList();
  const i=list.findIndex(x=>x.id===id);if(i<0)return;
  const item=list[i];
  PH.idx=i;PH.playId=id;
  const root=photoRoot();
  root.querySelectorAll('.phAn').forEach(b=>{
    const on=b.dataset.id===id;
    b.classList.toggle('on',on);
    b.setAttribute('aria-pressed',on?'true':'false');
  });
  fillNow(item);
  if(PH.kind!=='d')photoStamp(PH.kind,item.id);
  photoSpeak(item);
}
const BV={k:1,x:0,y:0,fit:1,mode:'',moved:false,suppress:false,pts:new Map(),hot:null,hold:0,ro:null};
function bodyMetrics(){
  const box=document.getElementById('phZoom'),stage=document.getElementById('phMap');
  if(!box||!stage)return null;
  return {box,stage,bw:box.clientWidth,bh:box.clientHeight,sw:stage.offsetWidth,sh:stage.offsetHeight||stage.offsetWidth*BODY_VB.h/BODY_VB.w};
}
function bodyApply(){const stage=document.getElementById('phMap');if(stage)stage.style.transform=`translate(${BV.x}px,${BV.y}px) scale(${BV.k})`;}
function bodyClamp(){
  const m=bodyMetrics();if(!m)return;
  BV.k=Math.max(BV.fit,Math.min(BV.fit*5,BV.k));
  const sw=m.sw*BV.k,sh=m.sh*BV.k;
  BV.x=Math.min(Math.max(0,m.bw-sw)+24,Math.max(Math.min(0,m.bw-sw)-24,BV.x));
  BV.y=Math.min(Math.max(0,m.bh-sh)+24,Math.max(Math.min(0,m.bh-sh)-24,BV.y));
}
function bodyFit(){
  const m=bodyMetrics();if(!m||!m.sw||!m.sh)return;
  BV.fit=Math.min(m.bw/m.sw,m.bh/m.sh);
  BV.k=BV.fit;
  BV.x=(m.bw-m.sw*BV.k)/2;BV.y=(m.bh-m.sh*BV.k)/2;
  bodyApply();
}
function bodyZoom(factor){
  const m=bodyMetrics();if(!m)return;
  const cx=m.bw/2,cy=m.bh/2,px=(cx-BV.x)/BV.k,py=(cy-BV.y)/BV.k;
  BV.k*=factor;bodyClamp();
  BV.x=cx-px*BV.k;BV.y=cy-py*BV.k;bodyClamp();bodyApply();
}
function bodyFocus(id){
  const hot=photoRoot()&&photoRoot().querySelector(`.phHot[data-id="${id}"]`);
  const m=bodyMetrics();if(!hot||!m)return;
  BV.k=Math.min(BV.fit*3.2,BV.fit*5);
  const px=parseFloat(hot.style.left)/100*m.sw;
  const py=parseFloat(hot.style.top)/100*m.sh;
  BV.x=m.bw/2-px*BV.k;BV.y=m.bh/2-py*BV.k;
  bodyClamp();bodyApply();
}
function bodyArmSuppress(){
  BV.suppress=true;
  clearTimeout(BV.hold);
  BV.hold=setTimeout(()=>{BV.suppress=false;},80);
}
function bodyBindZoom(box){
  if(!box||box.dataset.bound)return;box.dataset.bound='1';
  const end=e=>{
    if(!BV.pts.has(e.pointerId))return;
    BV.pts.delete(e.pointerId);
    if(BV.pts.size===0){
      const moved=BV.moved,hot=BV.hot;
      BV.mode='';BV.hot=null;
      if(moved)bodyArmSuppress();
      else if(hot){bodyArmSuppress();playBody(hot);}
    }else if(BV.pts.size===1){
      const p=[...BV.pts.values()][0];
      BV.mode='pan';BV.sx=p.x;BV.sy=p.y;BV.ox=BV.x;BV.oy=BV.y;BV.moved=true;BV.hot=null;
    }
  };
  box.addEventListener('pointerdown',e=>{
    if(e.target.closest('.phZoomBtns'))return;
    if(e.button!=null&&e.button!==0)return;
    try{box.setPointerCapture(e.pointerId);}catch(err){}
    BV.pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(BV.pts.size===1){
      BV.mode='pan';BV.moved=false;BV.sx=e.clientX;BV.sy=e.clientY;BV.ox=BV.x;BV.oy=BV.y;
      const hot=e.target.closest&&e.target.closest('.phHot');
      BV.hot=hot?hot.dataset.id:null;
    }else if(BV.pts.size===2){
      const [a,b]=[...BV.pts.values()];
      BV.mode='pinch';BV.moved=true;BV.hot=null;BV.dist=Math.hypot(a.x-b.x,a.y-b.y)||1;BV.sk=BV.k;
      const rect=box.getBoundingClientRect();
      BV.mx=(a.x+b.x)/2-rect.left;BV.my=(a.y+b.y)/2-rect.top;
      BV.cx=(BV.mx-BV.x)/BV.k;BV.cy=(BV.my-BV.y)/BV.k;
    }
  });
  box.addEventListener('pointermove',e=>{
    if(!BV.pts.has(e.pointerId))return;
    BV.pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(BV.mode==='pan'&&BV.pts.size===1){
      const dx=e.clientX-BV.sx,dy=e.clientY-BV.sy;
      if(Math.hypot(dx,dy)>8)BV.moved=true;
      if(BV.moved){BV.x=BV.ox+dx;BV.y=BV.oy+dy;bodyClamp();bodyApply();}
    }else if(BV.pts.size>=2){
      BV.moved=true;BV.hot=null;
      const [a,b]=[...BV.pts.values()];
      const dist=Math.hypot(a.x-b.x,a.y-b.y)||1;
      const rect=box.getBoundingClientRect();
      const mx=(a.x+b.x)/2-rect.left,my=(a.y+b.y)/2-rect.top;
      BV.k=BV.sk*(dist/BV.dist);bodyClamp();
      BV.x=mx-BV.cx*BV.k;BV.y=my-BV.cy*BV.k;bodyClamp();bodyApply();
    }
  },{passive:false});
  box.addEventListener('pointerup',end);
  box.addEventListener('pointercancel',e=>{BV.moved=true;BV.hot=null;end(e);});
}
function playBody(id){
  const item=(PHOTO_PACK.body||[]).find(x=>x.id===id);if(!item)return;
  PH.playId=id;PH.idx=Math.max(0,photoList().findIndex(x=>x.id===id));
  const root=photoRoot();
  root.querySelectorAll('.phHot').forEach(b=>{const on=b.dataset.id===id;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');});
  fillNow(item);
  photoStamp('y',id);
  photoSpeak(item);
}
function renderBodyMap(){
  const meta=listMeta();
  const d=BODY_DIAGRAMS[PH.grp];
  const root=photoRoot();
  if(!d){root.innerHTML=barHTML(meta?meta.emoji:'');return;}
  const hero=bodyItems(PH.grp).find(x=>x.overview)||bodyItems(PH.grp)[0];
  const spots=d.spots.map(s=>{
    const item=(PHOTO_PACK.body||[]).find(x=>x.id===s.id);
    const label=item?item.names[lang].full:s.id;
    const on=PH.playId===s.id;
    return `<button type="button" class="phHot${on?' on':''}" data-act="part" data-id="${s.id}" style="left:${s.x}%;top:${s.y}%" aria-label="${photoEsc(label)}" aria-pressed="${on?'true':'false'}"></button>`;
  }).join('');
  root.innerHTML=`<div class="phHead">${barHTML(meta?meta.emoji:'')}<div class="phNow" id="phNow"></div></div><div class="phZoom" id="phZoom"><div class="phMap" id="phMap"><img src="${hero.image}" alt="" draggable="false">${spots}</div></div><div class="phZoomBtns"><button type="button" data-act="zout" aria-label="smaller">➖</button><button type="button" data-act="zfit" aria-label="whole">⤢</button><button type="button" data-act="zin" aria-label="bigger">➕</button></div>`;
  const item=PH.playId&&(PHOTO_PACK.body||[]).find(x=>x.id===PH.playId&&x.group===PH.grp);
  if(item)fillNow(item);else{PH.playId=null;fillGroupTitle();}
  const box=root.querySelector('#phZoom');
  bodyBindZoom(box);
  if(window.ResizeObserver){
    if(BV.ro)BV.ro.disconnect();
    BV.ro=new ResizeObserver(()=>{
      if(!document.getElementById('phMap'))return;
      const atFit=Math.abs(BV.k-BV.fit)<0.05;
      if(atFit){bodyFit();return;}
      const m=bodyMetrics();if(!m||!m.sw||!m.sh)return;
      const fit=Math.min(m.bw/m.sw,m.bh/m.sh),rel=BV.fit>0?BV.k/BV.fit:1;
      BV.fit=fit;BV.k=fit*rel;bodyClamp();bodyApply();
    });
    BV.ro.observe(box);
  }
  requestAnimationFrame(()=>requestAnimationFrame(()=>bodyFit()));
}
function renderList(){
  const meta=listMeta();
  const inline=isInline();
  const tiles=photoList().map(it=>{
    const on=inline&&PH.playId===it.id;
    return `<button type="button" class="phAn${on?' on':''}" data-act="${inline?'play':'open'}" data-id="${it.id}" aria-pressed="${on?'true':'false'}" aria-label="${photoEsc(it.names[lang].full)}"><img src="${it.image}" alt="" loading="lazy" decoding="async" draggable="false"></button>`;
  }).join('');
  const now=inline?'<div class="phNow" id="phNow"></div>':'';
  const head=inline?`<div class="phHead">${barHTML(meta?meta.emoji:'')}${now}</div>`:barHTML(meta?meta.emoji:'');
  photoRoot().innerHTML=head+`<div class="phGrid">${tiles}</div>`;
  if(inline){const item=PH.playId&&photoList().find(x=>x.id===PH.playId);if(item)fillNow(item);else fillGroupTitle();}
}
function renderCard(item,fresh){
  photoRoot().innerHTML=`${barHTML(fresh?'🛂':'')}
    <img class="phHero${fresh?' fresh':''}" src="${item.image}" alt="${photoEsc(item.names[lang].full)}" draggable="false">
    <div class="phName">${photoEsc(item.names[lang].full)}</div>${langsHTML(item)}
    <div class="phNav">
      <button type="button" class="phArrow" data-act="prev" aria-label="previous">◀</button>
      <button type="button" class="phReplay" data-act="replay" aria-label="again">🔊</button>
      <button type="button" class="phArrow" data-act="next" aria-label="next">▶</button>
    </div>`;
}
function renderPass(){
  const block=(kind,emoji,items,pic,label)=>{
    const tiles=(PASS[kind]||[]).map(id=>{
      const it=items.find(x=>x.id===id);if(!it)return '';
      const img=pic?pic(it):it.image;
      const name=label?label(it):it.names[lang].full;
      return `<button type="button" class="phStamp" data-act="stamp" data-kind="${kind}" data-id="${id}" aria-label="${photoEsc(name)}"><img src="${img}" alt="" loading="lazy" decoding="async" draggable="false"></button>`;
    }).join('');
    return `<div class="phPassHead">${emoji}</div>${tiles?`<div class="phStamps">${tiles}</div>`:'<div class="phEmpty">○</div>'}`;
  };
  photoRoot().innerHTML=barHTML('🛂')
    +block('a','🦁',PHOTO_PACK.animals)
    +block('p','👥',PHOTO_PACK.people)
    +block('v','🚗',PHOTO_PACK.vehicles)
    +block('t','🧰',PHOTO_PACK.things||[])
    +block('b','🐣',PHOTO_PACK.pairs,p=>p.baby.image,p=>p.baby.names[lang].full)
    +bodyPass();
}
function bodyPass(){
  const items=PHOTO_PACK.body||[];
  const have=(PASS.y||[]).length;
  if(!have)return '<div class="phPassHead">🧒</div><div class="phEmpty">○</div>';
  return bodyGroups().map(g=>{
    const tiles=(PASS.y||[]).map(id=>{
      const it=items.find(x=>x.id===id);if(!it||it.group!==g.id)return '';
      return `<button type="button" class="phStamp" data-act="stamp" data-kind="y" data-id="${id}" aria-label="${photoEsc(it.names[lang].full)}"><img src="${it.image}" alt="" loading="lazy" decoding="async" draggable="false"></button>`;
    }).join('');
    return tiles?`<div class="phPassHead">${g.emoji}</div><div class="phStamps">${tiles}</div>`:'';
  }).join('');
}

/* ---- Listen and find: the voice says a name, he taps the right photo out of four.
   A wrong tap says what that one is (so even a miss teaches a word); after two
   misses the right one glows. A right answer: the name again and one fact. ---- */
function findPool(){return PH.kind==='v'?PHOTO_PACK.vehicles:PH.kind==='t'?(PHOTO_PACK.things||[]):PH.kind==='y'?(PHOTO_PACK.body||[]).filter(x=>!x.diagram):PH.kind==='a'?PHOTO_PACK.animals:PHOTO_PACK.people;}
function findPlural(item){
  const n=partNames(item)[lang];
  if(n&&n.number==='sg')return false;
  if(n&&(n.number==='pl'||n.gender==='pl'))return true;
  return Object.values(partNames(item)).some(x=>x&&(x.number==='pl'||x.gender==='pl'));
}
function findQ(item){
  const n=partNames(item)[lang].full,pl=findPlural(item);
  if(lang==='de')return (pl?'Wo sind ':'Wo ist ')+n+'?';
  if(lang==='es')return (pl?'¿Dónde están ':'¿Dónde está ')+n+'?';
  return 'Where '+(pl?'are ':'is ')+n+'?';
}
function findThat(item){
  const n=partNames(item)[lang].full,pl=findPlural(item);
  if(lang==='de')return (pl?'Das sind ':'Das ist ')+n+'.';
  if(lang==='es')return (pl?'Esos son ':'Eso es ')+n+'.';
  return (pl?'Those are ':'That is ')+n+'.';
}
function startHide(){
  photoStop();PH.screen='hide';
  PUZ={got:0,miss:0,locked:false,item:null,opts:[],seen:[]};
  findRound();
}
function findRound(){
  const all=findPool(),mode='find:'+PH.kind;
  const fresh=all.filter(x=>!PUZ.seen.includes(x.id));
  const src=fresh.length?fresh:all;
  const cb=comeBack(mode,k=>all.some(x=>x.id===k)&&(!PUZ.item||PUZ.item.id!==k));   // something he missed comes back soon
  const item=cb?all.find(x=>x.id===cb):src[Math.floor(Math.random()*src.length)];PUZ.seen.push(item.id);
  const pool=all.filter(x=>x.id!==item.id);
  const opts=[item],n=[0,3,4,6][level('find',3)];   // the level sets how many photos: 3, 4 or 6
  while(opts.length<n&&pool.length)opts.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
  for(let i=opts.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=opts[i];opts[i]=opts[j];opts[j]=t;}
  PUZ.item=item;PUZ.opts=opts;PUZ.locked=false;PUZ.miss=0;
  PH.screen='hide';renderFind();
  photoSay(findQ(item));
}
function renderFind(){
  const opts=PUZ.opts.map(it=>`<button type="button" class="phChoice" data-act="find" data-id="${it.id}"><img src="${it.image}" alt="" draggable="false"></button>`).join('');
  photoRoot().innerHTML=`${barHTML('👂')}<div class="phFindTop"><button type="button" class="phFindSay" data-act="findSay" aria-label="again">🔊</button><span class="phFindDots">${'●'.repeat(PUZ.got)}${'○'.repeat(Math.max(0,5-PUZ.got))}</span></div><div class="phChoices phFind${PUZ.opts.length>4?' six':''}">${opts}</div>`;
}
function findAnswer(id,btn){
  if(!PUZ||PUZ.locked||PH.screen!=='hide')return;
  const it=PUZ.opts.find(x=>x.id===id);if(!it)return;
  if(it!==PUZ.item){
    PUZ.miss++;
    btn.classList.remove('phBad');void btn.offsetWidth;btn.classList.add('phBad');
    if(typeof nope==='function')nope();
    photoSeq([findThat(it),findQ(PUZ.item)],lang);
    if(PUZ.miss>=2){const c=photoRoot().querySelector(`.phChoice[data-id="${PUZ.item.id}"]`);if(c)c.classList.add('phHint');}
    return;
  }
  PUZ.locked=true;btn.classList.add('phGood');
  photoRoot().querySelectorAll('.phChoice').forEach(c=>{if(c!==btn)c.classList.add('phDim');});
  if(typeof award==='function')award(PUZ.miss?1:0);
  adapt('find',3,PUZ.miss===0);practice('find:'+PH.kind,PUZ.item.id,partNames(PUZ.item)[lang].full,PUZ.miss===0);
  [523,659,784].forEach((f,i)=>beep(f,i*0.07,0.15,'triangle',0.15));
  const item=PUZ.item,got=PUZ.got,f=photoFact(item);
  photoSeq([photoYay()+' '+partNames(item)[lang].full+'!',f&&f[lang]],lang,()=>{
    if(!PUZ)return;
    PUZ.got=got+1;
    if(PUZ.got>=5)photoCheer('🙈');
    else findRound();
  });
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
    photoSay(photoLook());
    if(PUZ.miss>=2){const c=photoRoot().querySelector('.phLiveHab[data-ok="1"]');if(c)c.classList.add('phHint');}
    return;
  }
  PUZ.locked=true;if(btn)btn.classList.add('phGood');
  if(typeof award==='function')award(0);
  [523,659,784].forEach((f,i)=>beep(f,i*0.07,0.15,'triangle',0.15));
  const gen=++photoGen,item=PUZ.item,got=PUZ.got;
  photoSeq([item.names[lang].full,photoYay()],lang,()=>{
    if(!PUZ)return;
    PUZ.got=got+1;
    if(PUZ.got>=4)photoCheer('🏡');
    else liveRound();
  });
}
/* ---- Baby and grown-up: the baby is showing, tap its grown-up photo. ---- */
function startGrow(){
  if(PH.kind!=='b')return;
  photoStop();PH.screen='grow';
  PUZ={got:0,miss:0,locked:false,pair:null,opts:[]};
  growRound();
}
function growRound(){
  const all=PHOTO_PACK.pairs.slice();
  const pair=all[Math.floor(Math.random()*all.length)];
  const pool=all.filter(x=>x.id!==pair.id);
  const opts=[pair];
  while(opts.length<3&&pool.length)opts.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
  for(let i=opts.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=opts[i];opts[i]=opts[j];opts[j]=t;}
  PUZ.pair=pair;PUZ.opts=opts;PUZ.locked=false;PUZ.miss=0;
  PH.screen='grow';renderGrow();
  photoSay(pair.baby.names[lang].full);
}
function renderGrow(){
  const opts=PUZ.opts.map(p=>`<button type="button" class="phChoice" data-act="growPick" data-ok="${p.id===PUZ.pair.id?'1':'0'}"><img src="${p.adult.image}" alt="" draggable="false"></button>`).join('');
  photoRoot().innerHTML=`${barHTML('🐣')}<div class="phReveal"><img class="phClear" src="${PUZ.pair.baby.image}" alt="" draggable="false"></div><div class="phChoices">${opts}</div>`;
}
function growAnswer(ok,btn){
  if(!PUZ||PUZ.locked||PH.screen!=='grow')return;
  if(!ok){
    PUZ.miss++;
    btn.classList.remove('phBad');void btn.offsetWidth;btn.classList.add('phBad');
    photoSay(photoLook());
    if(PUZ.miss>=2){const c=photoRoot().querySelector('.phChoice[data-ok="1"]');if(c)c.classList.add('phHint');}
    return;
  }
  PUZ.locked=true;btn.classList.add('phGood');
  if(typeof award==='function')award(0);
  [523,659,784].forEach((f,i)=>beep(f,i*0.07,0.15,'triangle',0.15));
  const gen=++photoGen,pair=PUZ.pair,got=PUZ.got;
  photoSeq([pair.adult.names[lang].full,photoYay()],lang,()=>{
    if(!PUZ)return;
    PUZ.got=got+1;
    if(PUZ.got>=4)photoCheer('🐣');
    else growRound();
  });
}
/* ---- Touch your ___! He touches it on himself, then taps the picture. No missing. ---- */
function touchPrompt(item){
  const full=partNames(item)[lang].full,noun=partNames(item).en.noun;
  if(lang==='es')return '¡Toca '+full+'!';
  if(lang==='de')return 'Fass '+full+' an!';
  return 'Touch your '+noun+'!';
}
function startTouch(){
  if(PH.kind!=='y')return;
  photoStop();PH.screen='touch';
  PUZ={got:0,miss:0,locked:false,item:null};
  touchRound();
}
function touchRound(){
  const all=(PHOTO_PACK.body||[]).filter(x=>x.touchable);
  if(!all.length)return;
  let item=all[Math.floor(Math.random()*all.length)],guard=0;
  if(PUZ.item&&all.length>1)while(item.id===PUZ.item.id&&guard++<8)item=all[Math.floor(Math.random()*all.length)];
  PUZ.item=item;PUZ.locked=false;PH.screen='touch';
  renderTouch();
  photoSay(touchPrompt(item));
}
function renderTouch(){
  const it=PUZ.item;
  photoRoot().innerHTML=`${barHTML('👆')}
    <button type="button" class="phTouchCard" data-act="touched"><img class="phHero" src="${it.image}" alt="${photoEsc(partNames(it)[lang].full)}" draggable="false"></button>
    <div class="phName">${photoEsc(partNames(it)[lang].full)}</div>
    <button type="button" class="phTouchGo" data-act="touched" aria-label="done">👆</button>`;
}
function touchYes(){
  if(!PUZ||PUZ.locked||PH.screen!=='touch')return;
  PUZ.locked=true;
  if(typeof award==='function')award(0);
  [523,659,784].forEach((f,i)=>beep(f,i*0.07,0.15,'triangle',0.15));
  const gen=++photoGen,got=PUZ.got;
  speakFresh(photoYay(),lang,0.8,()=>{
    if(gen!==photoGen||!PUZ)return;
    PUZ.got=got+1;
    if(PUZ.got>=4)photoCheer('👆');
    else touchRound();
  });
}
function photoCheer(emoji){
  PH.screen='cheer';PUZ=null;
  const again=emoji==='🏡'?'live':emoji==='🐣'?'grow':emoji==='👆'?'touch':'hide';
  photoRoot().innerHTML=`${barHTML('')}<div class="phCheer"><div class="phCup">🏆</div><button type="button" class="phAgain" data-act="${again}" aria-label="again">🔁</button></div>`;
  if(typeof rainEmoji==='function')rainEmoji(['⭐','🎉','🏆','✨'],16);
  if(typeof fanfare==='function')fanfare();
  photoSay(photoDoneLine());
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
