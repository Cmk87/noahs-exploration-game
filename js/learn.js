/* =============================================================
   6. WORDS QUIZ  (adaptive)
============================================================= */
const CATS=[
 {k:'*',    icon:'🌈', es:'Todo',    en:'All',      de:'Alles'},
 {k:'animal',icon:'🦁',es:'Animales',en:'Animals',  de:'Tiere'},
 {k:'anat', icon:'🫀', es:'Cuerpo',  en:'Body',     de:'Körper'},
 {k:'food', icon:'🍎', es:'Comida',  en:'Food',     de:'Essen'},
 {k:'vehic',icon:'🚗', es:'Vehículos',en:'Vehicles',de:'Fahrzeuge'},
 {k:'space',icon:'🪐', es:'Espacio', en:'Space',    de:'Weltall'},
 {k:'nature',icon:'🌳',es:'Naturaleza',en:'Nature', de:'Natur'},
 {k:'home', icon:'🛋️', es:'Casa',    en:'Home',     de:'Zuhause'},
 {k:'cloth',icon:'🧥', es:'Ropa',    en:'Clothes',  de:'Kleidung'},
 {k:'thing',icon:'🔑', es:'Cosas',   en:'Things',   de:'Dinge'},
 {k:'toy',  icon:'🧩', es:'Juguetes',en:'Toys',     de:'Spielzeug'},
 {k:'job',  icon:'👮', es:'Oficios', en:'Jobs',     de:'Berufe'},
 {k:'people',icon:'👪',es:'Personas',en:'People',  de:'Menschen'},
 {k:'music',icon:'🎵', es:'Música',  en:'Music',    de:'Musik'},
 {k:'place',icon:'🏙️', es:'Lugares', en:'Places',   de:'Orte'},
 {k:'form', icon:'🔵', es:'Colores', en:'Colours',  de:'Farben'}
];
let activeCat='*';
const catPool=()=>activeCat==='*'?VOCAB:VOCAB.filter(v=>v.c===activeCat);
function buildChips(){
  const box=document.getElementById('catChips');box.innerHTML='';
  CATS.forEach(c=>{
    const b=document.createElement('button');
    b.className='chip'+(activeCat===c.k?' on':'');
    b.textContent=c.icon+' '+c[lang];
    b.onclick=()=>{ac();activeCat=c.k;recent=[];buildChips();newRound();};
    box.appendChild(b);
  });
}
/* =============================================================
   ADAPTIVE DIFFICULTY — one engine for every quiz.
   A weighted up-down staircase (Kaernbach 1991): +1/3 of a level for
   a round solved on the first try, −1 level for a round with any
   miss. It settles where P(right)·⅓ = P(wrong)·1, i.e. where he gets
   about 3 in 4 right: hard enough that he makes mistakes, easy
   enough that he stays happy. The first 6 rounds of a mode move a
   whole level per answer so it finds his level quickly. Levels are
   saved per mode and per language, so they survive a reload.
============================================================= */
const SKILL_START={words:{es:4,en:2,de:2},ear:{es:2,en:1,de:1},act:{es:2,en:1,de:1},space:{es:1,en:1,de:1},geo:{es:1,en:1,de:1},
  geoC:{es:1,en:1,de:1},geoK:{es:1,en:1,de:1},geoF:{es:1,en:1,de:1},geoO:{es:1,en:1,de:1}};
const SKILL_MAX={words:8,ear:6,act:6,space:4,geo:3,geoC:2,geoK:5,geoF:5,geoO:2};
SKILL_START.art={es:1,en:1,de:1};SKILL_START.plural={es:1,en:1,de:1};SKILL_START.find={es:2,en:2,de:2};
SKILL_MAX.art=3;SKILL_MAX.plural=3;SKILL_MAX.find=3;
let SKILL={};try{SKILL=JSON.parse(localStorage.getItem('sl_skill')||'{}');}catch(e){}
function skillRec(mode,lg){const k=mode+'|'+(lg||lang);
  return SKILL[k]||(SKILL[k]={s:SKILL_START[mode][lg||lang],n:0,h:[]});}
function level(mode,max,lg){return Math.max(1,Math.min(max,Math.floor(skillRec(mode,lg).s)));}
function adapt(mode,max,ok){
  const r=skillRec(mode),before=level(mode,max);
  r.s+=ok?(r.n<6?1:1/3):-1;
  r.s=Math.max(1,Math.min(max+0.99,r.s));r.n++;
  r.h.push(ok?1:0);if(r.h.length>20)r.h.shift();
  try{localStorage.setItem('sl_skill',JSON.stringify(SKILL));}catch(e){}
  return level(mode,max)-before;
}
function levelFx(el,ch){
  if(!ch)return;
  el.classList.remove('pop','down');void el.offsetWidth;el.classList.add(ch>0?'pop':'down');
  if(ch>0)[660,880,1175].forEach((f,i)=>beep(f,i*0.08,0.2,'square',0.2));
}
/* =============================================================
   SPACED REPETITION (Leitner boxes), per language, shared by the
   Words and Listening tabs. Right on the first try → next box, so the
   word comes back later and later; any miss → back to box 1, so it
   comes back soon. New words are let in gradually: never more than
   8 "being learned" (box 1–2) at once.
============================================================= */
const SRS_DAYS=[0,0.007,1,3,7,21];            // box → days until due (0.007 d ≈ 10 min)
let SRS={};try{SRS=JSON.parse(localStorage.getItem('sl_srs')||'{}');}catch(e){}
const srsOf=(e,lg)=>((SRS[lg||lang]||{})[e]);
function srsRecord(item,ok){
  const L=SRS[lang]||(SRS[lang]={}),r=L[item.e]||(L[item.e]={b:0,d:0,n:0,ok:0});
  // a word he gets right the very first time he meets it is already known: skip ahead to box 3
  r.b=ok?(r.n===0?3:Math.min(5,r.b+1)):1;r.n++;if(ok)r.ok++;
  r.d=Date.now()+SRS_DAYS[r.b]*864e5;
  try{localStorage.setItem('sl_srs',JSON.stringify(SRS));}catch(e){}
}
/* pick what to practise: due words first (weakest first), then a new word if
   there is room, otherwise a random known word to keep it fresh */
function srsPick(pool){
  const now=Date.now(),seen=pool.filter(v=>srsOf(v.e)),fresh=pool.filter(v=>!srsOf(v.e));
  const due=seen.filter(v=>srsOf(v.e).d<=now).sort((a,b)=>srsOf(a.e).b-srsOf(b.e).b||Math.random()-.5);
  const learning=Object.values(SRS[lang]||{}).filter(r=>r.b>0&&r.b<=2).length;
  const r=Math.random();
  if(due.length&&r<0.65)return due[Math.floor(Math.random()*Math.min(3,due.length))];
  if(fresh.length&&learning<8&&r<0.9)return pick(fresh);
  if(due.length)return due[0];
  return pick(seen.length?seen:pool);
}
const srsMastered=lg=>Object.values(SRS[lg]||{}).filter(r=>r.b>=4).length;

/* =============================================================
   PRACTICE JOURNAL + COME-BACK QUEUE — shared by every quiz.
   Each answered round reports practice(mode, key, label, ok), with ok =
   right on the first try. Two things follow:
   · A miss comes back soon: after 2–3 other rounds of the same game, and
     if he gets it right then, once more about 6 rounds later. Only when
     it has been right on the first try twice since the miss, the second
     time in a later session, is it fixed.
     Unfixed misses of the last two weeks are asked early in the next
     session too. (Words and Listening also keep their Leitner boxes,
     which space the word out over days.)
   · The parent's weekly note: what he still mixes up, what he has
     learned since missing it, what is new — per language.
============================================================= */
let PJ={};try{PJ=JSON.parse(localStorage.getItem('sl_journal')||'{}')||{};}catch(e){}
const PJ_DAY=864e5;
function pjSave(){
  try{const now=Date.now(),keys=Object.keys(PJ);
    if(keys.length>1500)keys.sort((a,b)=>(PJ[a].at||0)-(PJ[b].at||0)).slice(0,keys.length-1500).forEach(k=>delete PJ[k]);
    keys.forEach(k=>{const r=PJ[k];if(r&&r.ms)r.ms=r.ms.filter(t=>now-t<60*PJ_DAY);});
    localStorage.setItem('sl_journal',JSON.stringify(PJ));}catch(e){}
}
const CB={},CB_TAKEN={},CB_SEEDED={};
function practice(mode,key,label,ok){
  if(key==null)return;
  const id=mode+'|'+lang+'|'+key,now=Date.now();
  const r=PJ[id]||(PJ[id]={m:mode,l:lang,k:String(key),first:now,seen:0,miss:0,ok1:0,ms:[],fix:2,fixAt:0});
  r.t=label||r.t||String(key);r.seen++;r.at=now;
  // fixed = right on the first try twice after the miss, the second time in a later session (4 h on),
  // so "he knows it now" is not just two answers in the same five minutes
  if(ok){r.ok1++;if(r.fix===0){r.fix=1;r.fix1=now;}else if(r.fix===1&&now-(r.fix1||0)>=4*36e5){r.fix=2;r.fixAt=now;}}
  else{r.miss++;r.ms.push(now);r.fix=0;r.fixAt=0;}
  pjSave();
  // the come-back queue (this session)
  const q=CB[mode]||(CB[mode]=[]),k=String(key),i=q.findIndex(x=>x.key===k&&x.l===lang);if(i>=0)q.splice(i,1);
  const taken=CB_TAKEN[mode];CB_TAKEN[mode]=null;
  if(!ok)q.push({key:k,l:lang,wait:2+Math.floor(Math.random()*2),stage:1});
  else if(taken&&taken.key===k&&taken.stage===1)q.push({key:k,l:lang,wait:5+Math.floor(Math.random()*3),stage:2});
}
/* At the start of a round: something missed that is due again (and allowed in this round), or null. */
function comeBack(mode,allowed){
  const q=CB[mode]||(CB[mode]=[]);
  if(!CB_SEEDED[mode+'|'+lang]){CB_SEEDED[mode+'|'+lang]=true;           // a new session: unfixed misses of the last 2 weeks first
    const now=Date.now();let w=1;
    Object.values(PJ).filter(r=>r.m===mode&&r.l===lang&&r.fix<2&&r.ms.length&&now-r.ms[r.ms.length-1]<14*PJ_DAY)
      .sort((a,b)=>b.ms.length-a.ms.length).slice(0,6)
      .forEach(r=>{if(!q.some(x=>x.key===r.k&&x.l===lang))q.push({key:r.k,l:lang,wait:w++,stage:1});});}
  const left=CB_TAKEN[mode];CB_TAKEN[mode]=null;                       // picked last round but never answered (skipped, left): keep it
  if(left&&!q.some(x=>x.key===left.key&&x.l===left.l))q.push({key:left.key,l:left.l,wait:2,stage:left.stage});
  q.forEach(x=>{if(x.l===lang)x.wait--;});
  const i=q.findIndex(x=>x.l===lang&&x.wait<=0&&(!allowed||allowed(x.key)));
  if(i<0)return null;
  const x=q.splice(i,1)[0];CB_TAKEN[mode]={key:x.key,l:x.l,stage:x.stage};return x.key;
}
/* the weekly note: last 7 days */
function pjWeek(){
  const now=Date.now(),wk=7*PJ_DAY,R=Object.values(PJ);
  const tricky=R.filter(r=>r.fix<2&&r.ms.some(t=>now-t<wk)).map(r=>({...r,n:r.ms.filter(t=>now-t<wk).length})).sort((a,b)=>b.n-a.n||b.at-a.at);
  const learned=R.filter(r=>r.fix>=2&&r.fixAt&&now-r.fixAt<wk).sort((a,b)=>b.fixAt-a.fixAt);
  const fresh=R.filter(r=>now-r.first<wk);
  return {tricky,learned,fresh};
}

/* words quiz levels: how many pictures, how many from the same
   category, then sound-alike distractors, then two things at once */
const WLVL=[null,{n:4,same:0},{n:4,same:1},{n:6,same:2},{n:6,same:5},{n:9,same:4},{n:9,same:8},
            {n:9,same:3,sound:1},{n:9,same:8,two:1}];
let target=null,targets=[],gotT=[],roundDone=false,options=[],misses=0,recent=[];
let stats=loadStats();
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

function loadStats(){try{return JSON.parse(localStorage.getItem('sl_stats')||'{}');}catch(e){return {};}}
function saveStats(){try{localStorage.setItem('sl_stats',JSON.stringify(stats));}catch(e){}}
function noteMiss(item){
  const k=lang+'|'+item[lang][1];
  stats[k]=(stats[k]||0)+1;saveStats();
}
const AND={es:'y',en:'and',de:'und'};
/* Grammatical gender in colour, always the same: der blue, die red, das
   green, plural orange (Spanish el/la get the same colours). Seeing the
   colour every time a noun appears is how the article gets remembered. */
function artClass(art,plural){
  const a=(art||'').split(' ')[0].toLowerCase();
  if(plural&&(a==='die'||a==='los'||a==='las'))return 'g-pl';
  return {der:'g-m',den:'g-m',dem:'g-m',die:'g-f',das:'g-n',el:'g-m',la:'g-f',los:'g-pl',las:'g-pl'}[a]||'';
}
function artTag(art,plural){
  const c=artClass(art,plural);if(!c)return art;
  const sp=art.indexOf(' ');
  return `<span class="art ${c}">${sp<0?art:art.slice(0,sp)}</span>${sp<0?'':art.slice(sp)}`;
}
const plOf=it=>!!it.p&&!(lang==='de'&&it.sgde);   // plural in this language? (die Brille is singular in German)
const nounHTML=it=>artTag(it[lang][0],plOf(it))+' '+it[lang][1];
let artMode=false;
function promptText(html){
  const A=it=>html?artTag(it[lang][0],plOf(it)):it[lang][0];
  if(artMode)return html?`<span class="art g-m">der</span>, <span class="art g-f">die</span> oder <span class="art g-n">das</span>?`
                        :`Der, die oder das: ${target.de[1]}?`;
  if(targets.length>1){const [a,b]=targets;
    if(lang==='es')return `¿Dónde están ${A(a)} ${a.es[1]} y ${A(b)} ${b.es[1]}?`;
    if(lang==='de')return `Wo sind ${A(a)} ${a.de[1]} und ${A(b)} ${b.de[1]}?`;
    return `Where are ${a.en.join(' ')} and ${b.en.join(' ')}?`;}
  const word=target[lang][1],art=A(target),pl=plOf(target);
  if(lang==='es')return `¿Dónde ${pl?'están':'está'} ${art} ${word}?`;
  if(lang==='de')return `Wo ${pl?'sind':'ist'} ${art} ${word}?`;
  return `Where ${pl?'are':'is'} ${art} ${word}?`;
}
function sayPrompt(){if(plMode){say(plQuestion());return;}if(!target)return;say(artMode?`Der, die oder das… ${target.de[1]}?`:promptText());}
let roundT=null;
function nextRound(ms){clearTimeout(roundT);roundT=setTimeout(()=>{if(activeTab==='words')newRound();else target=null;},ms);}
/* four pictures: 2×2 upright, one row of four on a wide landscape screen */
const wideScreen=()=>innerWidth>innerHeight&&innerWidth>=700;
function gridCols(g,n){const four=n===4&&wideScreen();g.classList.toggle('four',four);g.style.gridTemplateColumns=n===4?(four?'repeat(4,1fr)':'repeat(2,1fr)'):'repeat(3,1fr)';}
addEventListener('resize',()=>['grid','earGrid'].forEach(id=>{const g=$(id);if(g&&g.children.length===4&&!g.querySelector('.artBtn'))gridCols(g,4);}));
function newRound(){
  clearTimeout(roundT);
  misses=0;roundDone=false;gotT=[];artMode=false;plMode=null;
  const L=level('words',8),cfg=WLVL[L],SET=catPool();
  if(activeCat==='*'&&L>=4&&Math.random()<0.15){pluralRound(L);return;}
  if(lang==='de'&&L>=3&&Math.random()<0.2&&artRound(SET,L))return;
  let pool=SET.filter(v=>!recent.includes(v.e));
  if(pool.length<Math.min(8,SET.length)){const last=recent[recent.length-1];recent=[];pool=SET.filter(v=>v.e!==last);if(!pool.length)pool=SET.slice();}   // never the same picture twice in a row
  {const cb=comeBack('words',k=>SET.some(v=>v.e===k));target=cb?SET.find(v=>v.e===cb):srsPick(pool);}   // a missed word may come back although it was shown just nowrecent.push(target.e);if(recent.length>12)recent.shift();
  targets=[target];
  if(cfg.two)targets.push(srsPick(pool.filter(v=>v.e!==target.e)));
  const rest=SET.filter(v=>!targets.includes(v)),need=Math.min(cfg.n,SET.length)-targets.length;
  let picked=[];
  if(cfg.sound){                    // words that SOUND like the target, in this language
    const w=target[lang][1];
    picked=rest.map(v=>({v,s:soundScore(w,v[lang][1])})).sort((a,b)=>b.s-a.s).slice(0,cfg.n-1-cfg.same).map(x=>x.v);
  }
  const left=rest.filter(v=>!picked.includes(v));
  const same=shuffle(left.filter(v=>v.c===target.c)),other=shuffle(left.filter(v=>v.c!==target.c));
  for(let i=0;i<cfg.same&&picked.length<need;i++)if(same[i])picked.push(same[i]);
  let j=0;while(picked.length<need&&j<other.length)picked.push(other[j++]);
  let k=cfg.same;while(picked.length<need&&k<same.length)picked.push(same[k++]);
  options=shuffle([...targets,...picked]);
  gridCols(document.getElementById('grid'),options.length);
  document.getElementById('grid').classList.toggle('nine',options.length>6);
  document.getElementById('quizPrompt').innerHTML=promptText(true);
  document.getElementById('levelPill').textContent='🎯 '+L;
  const g=document.getElementById('grid');g.innerHTML='';
  options.forEach((o,i)=>{const b=document.createElement('div');b.className='card';b.textContent=o.e;
    b.style.animationDelay=(i*0.04)+'s';b.onclick=()=>choose(o,b);g.appendChild(b);});
  sayPrompt();
}
/* ---- plurals: "Wo sind drei Hunde?" — German plurals are irregular, so
   every form here is written out (and checked) by hand ---- */
const PLURALS=[
 ['🐶','der','Hund','Hunde','dog','dogs','el','perro','perros'],['🐱','die','Katze','Katzen','cat','cats','el','gato','gatos'],
 ['🐟','der','Fisch','Fische','fish','fish','el','pez','peces'],['🐦','der','Vogel','Vögel','bird','birds','el','pájaro','pájaros'],
 ['🐴','das','Pferd','Pferde','horse','horses','el','caballo','caballos'],['🐮','die','Kuh','Kühe','cow','cows','la','vaca','vacas'],
 ['🐷','das','Schwein','Schweine','pig','pigs','el','cerdo','cerdos'],['🐔','das','Huhn','Hühner','hen','hens','la','gallina','gallinas'],
 ['🐝','die','Biene','Bienen','bee','bees','la','abeja','abejas'],['🦋','der','Schmetterling','Schmetterlinge','butterfly','butterflies','la','mariposa','mariposas'],
 ['🐢','die','Schildkröte','Schildkröten','turtle','turtles','la','tortuga','tortugas'],['🦆','die','Ente','Enten','duck','ducks','el','pato','patos'],
 ['🐭','die','Maus','Mäuse','mouse','mice','el','ratón','ratones'],['🐑','das','Schaf','Schafe','sheep','sheep','la','oveja','ovejas'],
 ['🦁','der','Löwe','Löwen','lion','lions','el','león','leones'],['🐘','der','Elefant','Elefanten','elephant','elephants','el','elefante','elefantes'],
 ['🐸','der','Frosch','Frösche','frog','frogs','la','rana','ranas'],['🐌','die','Schnecke','Schnecken','snail','snails','el','caracol','caracoles'],
 ['🦕','der','Dinosaurier','Dinosaurier','dinosaur','dinosaurs','el','dinosaurio','dinosaurios'],
 ['🍎','der','Apfel','Äpfel','apple','apples','la','manzana','manzanas'],['🍌','die','Banane','Bananen','banana','bananas','el','plátano','plátanos'],
 ['🍓','die','Erdbeere','Erdbeeren','strawberry','strawberries','la','fresa','fresas'],['🥕','die','Karotte','Karotten','carrot','carrots','la','zanahoria','zanahorias'],
 ['🥚','das','Ei','Eier','egg','eggs','el','huevo','huevos'],['🍪','der','Keks','Kekse','cookie','cookies','la','galleta','galletas'],
 ['⭐','der','Stern','Sterne','star','stars','la','estrella','estrellas'],['🎈','der','Luftballon','Luftballons','balloon','balloons','el','globo','globos'],
 ['🚗','das','Auto','Autos','car','cars','el','coche','coches'],['🚂','der','Zug','Züge','train','trains','el','tren','trenes'],
 ['✈️','das','Flugzeug','Flugzeuge','plane','planes','el','avión','aviones'],['⚽','der','Ball','Bälle','ball','balls','la','pelota','pelotas'],
 ['🔑','der','Schlüssel','Schlüssel','key','keys','la','llave','llaves'],['📕','das','Buch','Bücher','book','books','el','libro','libros'],
 ['🌸','die','Blume','Blumen','flower','flowers','la','flor','flores'],['🌳','der','Baum','Bäume','tree','trees','el','árbol','árboles'],
 ['🍂','das','Blatt','Blätter','leaf','leaves','la','hoja','hojas'],['🎁','das','Geschenk','Geschenke','present','presents','el','regalo','regalos'],
 ['👟','der','Schuh','Schuhe','shoe','shoes','el','zapato','zapatos'],['🏠','das','Haus','Häuser','house','houses','la','casa','casas']
].map(([e,da,ds,dp,es1,ep1,ea,ss,sp])=>({e,de:[da,ds,dp],en:[es1,ep1],es:[ea,ss,sp]}));
const NUMW={de:['','ein','zwei','drei','vier'],en:['','a','two','three','four'],es:['','un','dos','tres','cuatro']};
let plMode=null;
function plPhrase(it,n,hl){
  hl=hl||(x=>x);
  if(lang==='de'){const one=it.de[0]==='die'?'eine':'ein';return n===1?`${hl(one)} ${it.de[1]}`:`${hl(NUMW.de[n])} ${hl(it.de[2])}`;}
  if(lang==='en'){const one=/^[aeiou]/.test(it.en[0])?'an':'a';return n===1?`${hl(one)} ${it.en[0]}`:`${hl(NUMW.en[n])} ${hl(it.en[1])}`;}
  /* la → una; anything else (el) → un. Feminine nouns with a stressed a/ha
     are stored as el (el hada, el agua, el águila) and take un, not una. */
  const one=it.es[0]==='la'?'una':'un';return n===1?`${hl(one)} ${it.es[1]}`:`${hl(NUMW.es[n])} ${hl(it.es[2])}`;
}
function plQuestion(){const {it,n}=plMode;
  if(lang==='de')return n===1?`Wo ist ${plPhrase(it,1)}?`:`Wo sind ${plPhrase(it,n)}?`;
  if(lang==='en')return n===1?`Where is ${plPhrase(it,1)}?`:`Where are ${plPhrase(it,n)}?`;
  return `¿Dónde hay ${plPhrase(it,n)}?`;}
function pluralRound(L){
  const it=pick(PLURALS),max=L>=5?4:3,counts=shuffle([1,2,3,4].slice(0,max)),n=counts[0];
  plMode={it,n};target=null;targets=[];
  const g=document.getElementById('grid');g.innerHTML='';g.classList.remove('nine');
  gridCols(g,max);
  shuffle(counts).forEach((k,i)=>{const b=document.createElement('div');b.className='card plCard pl'+k;
    b.textContent=Array(k).fill(it.e).join('');b.style.animationDelay=(i*0.05)+'s';b.onclick=()=>plChoose(k,b);g.appendChild(b);});
  document.getElementById('quizPrompt').textContent=plQuestion();
  document.getElementById('levelPill').textContent='🎯 '+L;
  say(plQuestion());
}
function plChoose(k,el){
  ac();if(roundDone)return;
  if(k===plMode.n){
    roundDone=true;el.classList.add('right');bigWin();award(misses);
    adapt('plural',3,misses===0);            // its own record: a hard plural round must not pull the picture level down
    showWin(Array(k).fill(plMode.it.e).join(''),plPhrase(plMode.it,k,x=>`<b>${x}</b>`),plPhrase(plMode.it,k),true);
    nextRound(2600);
  }else{misses++;nope();el.classList.add('wrong');setTimeout(()=>el.classList.remove('wrong'),450);
    if(misses>=2)[...document.querySelectorAll('#grid .plCard')].forEach(c=>{if(c.classList.contains('pl'+plMode.n))c.classList.add('hint');});
    say(plQuestion());}
}
function artRound(SET,L){
  const pool=SET.filter(v=>!(v.p&&!v.sgde)&&v.c!=='form'&&['der','die','das'].includes(v.de[0])&&!recent.includes(v.e));
  if(pool.length<3)return false;
  artMode=true;target=pick(pool);targets=[target];recent.push(target.e);if(recent.length>12)recent.shift();
  const g=document.getElementById('grid');g.innerHTML='';g.style.gridTemplateColumns='repeat(3,1fr)';g.classList.remove('nine','four');
  const pic=document.createElement('div');pic.className='card artPic';pic.textContent=target.e;g.appendChild(pic);
  [['der','g-m'],['die','g-f'],['das','g-n']].forEach(([a,c],i)=>{
    const b=document.createElement('div');b.className='card artBtn '+c;b.textContent=a;b.style.animationDelay=(0.15+i*0.07)+'s';
    b.onclick=()=>artChoose(a,b);g.appendChild(b);});
  document.getElementById('quizPrompt').innerHTML=promptText(true);
  document.getElementById('levelPill').textContent='🎯 '+L;
  say(`Der, die oder das… ${target.de[1]}?`);
  return true;
}
function artChoose(a,el){
  ac();if(roundDone)return;
  if(a===target.de[0]){
    roundDone=true;el.classList.add('right');bigWin();award(misses);
    adapt('art',3,misses===0);practice('art',target.e,target.de.join(' '),misses===0);   // der/die/das has its own record
    showWin(target.e,nounHTML(target),target.de.join(' '),true);
    nextRound(2600);
  }else{
    misses++;nope();el.classList.add('wrong');setTimeout(()=>el.classList.remove('wrong'),450);
    if(misses===1)say(`Der, die oder das… ${target.de[1]}?`);
    else{[...document.querySelectorAll('#grid .artBtn')].forEach(c=>{if(c.textContent===target.de[0])c.classList.add('hint');});say(target.de.join(' '));}
  }
}
function choose(o,el){
  ac();if(roundDone||el.classList.contains('right'))return;
  if(targets.includes(o)){
    el.classList.add('right');gotT.push(o);
    if(gotT.length<targets.length){beep(880,0,0.12,'triangle',0.16);say(o[lang][1]);return;}
    roundDone=true;bigWin();award(misses);targets.forEach(t=>{srsRecord(t,misses===0);practice('words',t.e,t[lang].join(' '),misses===0);});
    levelFx(document.getElementById('levelPill'),adapt('words',8,misses===0));
    const label=targets.map(nounHTML).join(' '+AND[lang]+' ');
    showWin(targets.map(t=>t.e).join(''),label,targets.map(t=>t[lang][1]).join(' '+AND[lang]+' '),true);
    nextRound(2600);
  }else{
    misses++;targets.forEach(noteMiss);
    el.classList.add('wrong');setTimeout(()=>el.classList.remove('wrong'),450);nope();
    const todo=targets.filter(t=>!gotT.includes(t));
    if(misses===1)sayPrompt();
    else if(misses===2&&lang!=='es')sayBridge(todo.map(t=>t[lang][1]).join(', ')+'…',todo.map(t=>t.es[1]).join(', '));
    else if(misses>=3){[...document.querySelectorAll('#grid .card')].forEach(c=>{
      if(todo.some(t=>t.e===c.textContent))c.classList.add('hint');});sayPrompt();}
  }
}
function showWin(emoji,label,speak,html){
  document.getElementById('quizFace').textContent=emoji;
  document.getElementById('quizWord')[html?'innerHTML':'textContent']=label;
  document.getElementById('quizWin').classList.add('on');
  if(speak)say(speak);
  setTimeout(()=>document.getElementById('quizWin').classList.remove('on'),2500);
}
/* =============================================================
   7. LISTENING — hear a word, choose the picture.

   The old version was broken in two ways and confused in a third:
   1. It fired three say() calls on timers, and say() cancels whatever
      is already speaking — so each word cut off the one before it and
      he heard fragments.
   2. Tapping a button to HEAR a word also committed it as his answer
      1.4s later, so exploring the options guaranteed a wrong answer.
   3. Numbered buttons made it a memory-and-matching puzzle rather than
      a listening one.
   Now: one word is spoken, four pictures are offered, no text is shown
   anywhere. Pure ear-to-meaning. Difficulty comes from how similar the
   wrong answers SOUND, which is a real listening skill and is the one
   thing the Palabras tab cannot teach.
============================================================= */
/* listening levels: number of pictures, and how alike they are —
   different category, same category, or words that SOUND alike */
const ELVL=[null,{n:3,m:'far'},{n:4,m:'far'},{n:4,m:'same'},{n:6,m:'same'},{n:4,m:'sound'},{n:6,m:'sound'}];
let earTarget=null,earMiss=0,earRecent=[],earDone=false,earFirst=null;
/* ---- first sounds: "Welches Wort fängt mit M an?" ----
   Only consonants whose letter reliably IS the sound in that language, and
   no words where it isn't (Sch-/Sp-/St- in German, Sh-/Th-/soft G in English,
   soft G in Spanish) — otherwise the game would teach the wrong link. */
const FIRST_OK='mbptdlnrfskg';
function firstLetter(it,lg){
  const w=it[lg][1].toLowerCase(),c=w[0];
  if(!FIRST_OK.includes(c))return '';
  if(lg==='de'&&/^(sch|sp|st|pf)/.test(w))return '';
  if(lg==='en'&&(/^(sh|th|ph|kn|gn|gh)/.test(w)||/^g[eiy]/.test(w)))return '';
  if(lg==='es'&&/^g[eiéí]/.test(w))return '';
  return c;
}
function firstQ(){const L=earFirst.toUpperCase();
  return lang==='de'?`Welches Wort fängt mit ${L} an?`:lang==='en'?`Which word starts with ${L}?`:`¿Qué palabra empieza por ${letterSpokenAny(earFirst)}?`;}
function letterSpokenAny(c){const ES={b:'be',d:'de',f:'efe',g:'ge',k:'ka',l:'ele',m:'eme',n:'ene',p:'pe',r:'erre',s:'ese',t:'te'};return lang==='es'?ES[c]:c.toUpperCase();}
function firstRound(L){
  const pool=VOCAB.filter(v=>v.c!=='form'&&firstLetter(v,lang));
  const t=pick(pool),c=firstLetter(t,lang),n=L>=4?4:3;
  const others=shuffle(pool.filter(v=>firstLetter(v,lang)!==c&&v.e!==t.e));
  const used=new Set([c]),opts=[t];
  for(const o of others){const oc=firstLetter(o,lang);if(!used.has(oc)){used.add(oc);opts.push(o);}if(opts.length>=n)break;}
  if(opts.length<n)return false;
  earTarget=t;earFirst=c;
  $('earLetter').textContent=c.toUpperCase()+c;$('earLetter').classList.add('on');
  const g=document.getElementById('earGrid');g.innerHTML='';gridCols(g,n);
  /* the written word under each picture, first letter big and coloured, so he can match it to the letter above */
  shuffle(opts).forEach((o,i)=>{const b=document.createElement('div');b.className='card withWord';b.dataset.e=o.e;b.style.animationDelay=(i*0.05)+'s';
    const w=o[lang][1],pic=document.createElement('span'),lab=document.createElement('span'),f=document.createElement('b');
    pic.className='cw';pic.textContent=o.e;lab.className='cl';f.textContent=w[0];lab.append(f,w.slice(1));b.append(pic,lab);
    b.onclick=()=>earPick(o,b);g.appendChild(b);});
  document.getElementById('earLevelPill').textContent='🎧 '+L;
  setTimeout(()=>{if(earFirst===c)sayAt(firstQ(),0.72);},400);   // the round may already be over
  return true;
}

/* edit distance on the written word — a rough but effective stand-in
   for phonetic similarity (Hund/Hand, cat/hat, gato/pato). */
function editDist(a,b){
  a=a.toLowerCase();b=b.toLowerCase();
  const m=[];
  for(let i=0;i<=b.length;i++)m[i]=[i];
  for(let j=0;j<=a.length;j++)m[0][j]=j;
  for(let i=1;i<=b.length;i++)for(let j=1;j<=a.length;j++)
    m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);
  return m[b.length][a.length];
}
function soundScore(a,b){
  const d=editDist(a,b), L=Math.max(a.length,b.length);
  let sc=1-d/L;                                  // 1 = identical
  if(a[0]===b[0]) sc+=0.25;                      // same opening sound
  if(a.slice(-2)===b.slice(-2)) sc+=0.20;        // same ending
  if(Math.abs(a.length-b.length)<=1) sc+=0.10;   // same rough length
  return sc;
}
function earSay(rate){
  if(!earTarget) return;
  const sp=document.getElementById('earAgain');
  sp.classList.add('playing');
  setTimeout(()=>sp.classList.remove('playing'),1600);
  sayAt(earFirst?firstQ():earTarget[lang][1], rate||0.72);
}
let earT=null;
function newEarRound(){
  clearTimeout(earT);
  earMiss=0;earDone=false;earFirst=null;$('earLetter').classList.remove('on');
  const L=level('ear',6),cfg=ELVL[L];
  if(L>=3&&Math.random()<0.25&&firstRound(L))return;
  let pool=VOCAB.filter(v=>!earRecent.includes(v.e));
  if(pool.length<10){earRecent=[];pool=VOCAB.slice();}
  {const cb=comeBack('ear',k=>VOCAB.some(v=>v.e===k));earTarget=cb?VOCAB.find(v=>v.e===cb):srsPick(pool);}
  earRecent.push(earTarget.e); if(earRecent.length>14) earRecent.shift();
  const w=earTarget[lang][1],rest=VOCAB.filter(v=>v.e!==earTarget.e),k=cfg.n-1;
  let others;
  if(cfg.m==='far') others=shuffle(rest.filter(v=>v.c!==earTarget.c)).slice(0,k);
  else if(cfg.m==='same'){
    others=shuffle(rest.filter(v=>v.c===earTarget.c)).slice(0,k);
    if(others.length<k) others=others.concat(shuffle(rest.filter(v=>!others.includes(v))).slice(0,k-others.length));
  }else others=rest.map(v=>({v,s:soundScore(w,v[lang][1])})).sort((a,b)=>b.s-a.s).slice(0,k).map(x=>x.v);
  const opts=shuffle([earTarget,...others]);
  document.getElementById('earLevelPill').textContent='🎧 '+L;
  const g=document.getElementById('earGrid');g.innerHTML='';
  gridCols(g,opts.length);
  opts.forEach((o,i)=>{
    const b=document.createElement('div');
    b.className='card'; b.textContent=o.e; b.style.animationDelay=(i*0.05)+'s';
    b.onclick=()=>earPick(o,b);                  // tapping a picture is the ANSWER
    g.appendChild(b);
  });
  setTimeout(()=>earSay(),450);
}
function earPick(o,el){
  ac();if(earDone)return;
  if(o.e===earTarget.e){
    earDone=true;el.classList.add('right');bigWin();award(earMiss);if(!earFirst){srsRecord(earTarget,earMiss===0);practice('ear',earTarget.e,earTarget[lang].join(' '),earMiss===0);}
    levelFx(document.getElementById('earLevelPill'),adapt('ear',6,earMiss===0));
    if(earFirst){const w=earTarget[lang][1],Lt=earFirst.toUpperCase(),ph=lang==='es'?`${letterSpokenAny(earFirst)} de ${w}`:lang==='de'?`${Lt} wie ${w}`:`${Lt} for ${w}`;
      showWin(earTarget.e,`<b>${w[0]}</b>${w.slice(1)}`,ph,true);}
    else showWin(earTarget.e,nounHTML(earTarget),earTarget[lang].join(' ')+'!',true);   // "der Fuchs!" once more
    earT=setTimeout(()=>{if(activeTab==='ear')newEarRound();},2800);
  }else{
    earMiss++;noteMiss(earTarget);nope();
    el.classList.add('wrong');setTimeout(()=>el.classList.remove('wrong'),450);
    if(earMiss===1) setTimeout(()=>earSay(),500);            // just say it again
    else if(earMiss===2) setTimeout(()=>earSay(0.5),500);    // slower
    else if(earMiss===3&&lang!=='es')
      setTimeout(()=>sayBridge(earTarget[lang][1]+'…',earTarget.es[1],0.6),500);
    else if(earMiss>=4){
      [...document.querySelectorAll('#earGrid .card')].forEach(c=>{
        if((c.dataset.e||c.textContent)===earTarget.e)c.classList.add('hint');});
      setTimeout(()=>earSay(0.55),400);
    }
  }
}
