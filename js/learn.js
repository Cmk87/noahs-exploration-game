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
const SKILL_START={words:{es:4,en:2,de:2},ear:{es:2,en:1,de:1},act:{es:2,en:1,de:1},space:{es:1,en:1,de:1},geo:{es:1,en:1,de:1}};
const SKILL_MAX={words:8,ear:6,act:6,space:4,geo:2};
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
const nounHTML=it=>artTag(it[lang][0],it.p)+' '+it[lang][1];
let artMode=false;
function promptText(html){
  const A=it=>html?artTag(it[lang][0],it.p):it[lang][0];
  if(artMode)return html?`<span class="art g-m">der</span>, <span class="art g-f">die</span> oder <span class="art g-n">das</span>?`
                        :`Der, die oder das: ${target.de[1]}?`;
  if(targets.length>1){const [a,b]=targets;
    if(lang==='es')return `¿Dónde están ${A(a)} ${a.es[1]} y ${A(b)} ${b.es[1]}?`;
    if(lang==='de')return `Wo sind ${A(a)} ${a.de[1]} und ${A(b)} ${b.de[1]}?`;
    return `Where are ${a.en.join(' ')} and ${b.en.join(' ')}?`;}
  const word=target[lang][1],art=A(target),pl=!!target.p;
  if(lang==='es')return `¿Dónde ${pl?'están':'está'} ${art} ${word}?`;
  if(lang==='de')return `Wo ${pl?'sind':'ist'} ${art} ${word}?`;
  return `Where ${pl?'are':'is'} ${art} ${word}?`;
}
function sayPrompt(){if(plMode){say(plQuestion());return;}if(!target)return;say(artMode?`Der, die oder das… ${target.de[1]}?`:promptText());}
function newRound(){
  misses=0;roundDone=false;gotT=[];artMode=false;plMode=null;
  const L=level('words',8),cfg=WLVL[L],SET=catPool();
  if(activeCat==='*'&&L>=4&&Math.random()<0.15){pluralRound(L);return;}
  if(lang==='de'&&L>=3&&Math.random()<0.2&&artRound(SET,L))return;
  let pool=SET.filter(v=>!recent.includes(v.e));
  if(pool.length<Math.min(8,SET.length)){recent=[];pool=SET.slice();}
  target=srsPick(pool);recent.push(target.e);if(recent.length>12)recent.shift();
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
  document.getElementById('grid').style.gridTemplateColumns=options.length===4?'repeat(2,1fr)':'repeat(3,1fr)';
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
  g.style.gridTemplateColumns=max===4?'repeat(2,1fr)':'repeat(3,1fr)';
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
    levelFx(document.getElementById('levelPill'),adapt('words',8,misses===0));
    showWin(Array(k).fill(plMode.it.e).join(''),plPhrase(plMode.it,k,x=>`<b>${x}</b>`),plPhrase(plMode.it,k),true);
    setTimeout(newRound,2600);
  }else{misses++;nope();el.classList.add('wrong');setTimeout(()=>el.classList.remove('wrong'),450);
    if(misses>=2)[...document.querySelectorAll('#grid .plCard')].forEach(c=>{if(c.classList.contains('pl'+plMode.n))c.classList.add('hint');});
    say(plQuestion());}
}
function artRound(SET,L){
  const pool=SET.filter(v=>!v.p&&v.c!=='form'&&['der','die','das'].includes(v.de[0])&&!recent.includes(v.e));
  if(pool.length<3)return false;
  artMode=true;target=pick(pool);targets=[target];recent.push(target.e);if(recent.length>12)recent.shift();
  const g=document.getElementById('grid');g.innerHTML='';g.style.gridTemplateColumns='repeat(3,1fr)';g.classList.remove('nine');
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
    levelFx(document.getElementById('levelPill'),adapt('words',8,misses===0));
    showWin(target.e,nounHTML(target),target.de.join(' '),true);
    setTimeout(newRound,2600);
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
    roundDone=true;bigWin();award(misses);targets.forEach(t=>srsRecord(t,misses===0));
    levelFx(document.getElementById('levelPill'),adapt('words',8,misses===0));
    const label=targets.map(nounHTML).join(' '+AND[lang]+' ');
    showWin(targets.map(t=>t.e).join(''),label,targets.map(t=>t[lang][1]).join(' '+AND[lang]+' '),true);
    setTimeout(newRound,2600);
  }else{
    misses++;targets.forEach(noteMiss);
    el.classList.add('wrong');setTimeout(()=>el.classList.remove('wrong'),450);nope();
    const todo=targets.filter(t=>!gotT.includes(t));
    if(misses===1)sayPrompt();
    else if(misses===2&&lang!=='es')say(todo.map(t=>`${t[lang][1]}… ${t.es[1]}`).join(', '));
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
  const g=document.getElementById('earGrid');g.innerHTML='';g.style.gridTemplateColumns=n===4?'repeat(2,1fr)':'repeat(3,1fr)';
  shuffle(opts).forEach((o,i)=>{const b=document.createElement('div');b.className='card';b.textContent=o.e;b.style.animationDelay=(i*0.05)+'s';
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
function newEarRound(){
  earMiss=0;earDone=false;earFirst=null;$('earLetter').classList.remove('on');
  const L=level('ear',6),cfg=ELVL[L];
  if(L>=3&&Math.random()<0.25&&firstRound(L))return;
  let pool=VOCAB.filter(v=>!earRecent.includes(v.e));
  if(pool.length<10){earRecent=[];pool=VOCAB.slice();}
  earTarget=srsPick(pool);
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
  g.style.gridTemplateColumns=opts.length===4?'repeat(2,1fr)':'repeat(3,1fr)';
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
    earDone=true;el.classList.add('right');bigWin();award(earMiss);if(!earFirst)srsRecord(earTarget,earMiss===0);
    levelFx(document.getElementById('earLevelPill'),adapt('ear',6,earMiss===0));
    if(earFirst){const w=earTarget[lang][1],Lt=earFirst.toUpperCase(),ph=lang==='es'?`${letterSpokenAny(earFirst)} de ${w}`:lang==='de'?`${Lt} wie ${w}`:`${Lt} for ${w}`;
      showWin(earTarget.e,`<b>${w[0]}</b>${w.slice(1)}`,ph,true);}
    else showWin(earTarget.e,nounHTML(earTarget),null,true);
    setTimeout(newEarRound,2400);
  }else{
    earMiss++;noteMiss(earTarget);nope();
    el.classList.add('wrong');setTimeout(()=>el.classList.remove('wrong'),450);
    if(earMiss===1) setTimeout(()=>earSay(),500);            // just say it again
    else if(earMiss===2) setTimeout(()=>earSay(0.5),500);    // slower
    else if(earMiss===3&&lang!=='es')
      setTimeout(()=>sayAt(`${earTarget[lang][1]}… ${earTarget.es[1]}`,0.6),500);
    else if(earMiss>=4){
      [...document.querySelectorAll('#earGrid .card')].forEach(c=>{
        if(c.textContent===earTarget.e)c.classList.add('hint');});
      setTimeout(()=>earSay(0.55),400);
    }
  }
}
