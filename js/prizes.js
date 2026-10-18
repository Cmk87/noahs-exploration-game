/* =============================================================
   PRIZES — what the ⚡ points buy.
   40 ⚡ (about 40 correct answers, ~8 minutes of real play) buys
   ONE prize game of his choice. Points are SPENT, so the counter
   means something, and they are saved so a reload loses nothing.
   The prize games have no fail state: difficulty belongs in
   earning the prize, not in enjoying it.
============================================================= */
const DIG_COST=40;                       // price of any prize game

/* ---------- the ⚡ counter ---------- */
function savePower(){try{localStorage.setItem('sl_power',String(power));}catch(e){}}
let lastTap={x:innerWidth/2,y:innerHeight/2};
document.addEventListener('pointerdown',e=>{lastTap={x:e.clientX,y:e.clientY};},true);
function renderPower(bump){
  const el=$('power'), ready=power>=DIG_COST;
  el.textContent=(ready?'🎁 ':'⚡ ')+power;
  el.style.setProperty('--pct',(ready?100:power/DIG_COST*100).toFixed(1)+'%');
  el.classList.toggle('ready',ready);
  if(bump){el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');}
  document.querySelectorAll('.hcard[data-id="dig"]').forEach(b=>b.classList.toggle('ready',ready));
}
$('power').addEventListener('animationend',e=>{if(e.animationName==='bump')$('power').classList.remove('bump');});
$('power').onclick=()=>{ac();if(power>=DIG_COST&&activeTab!=='dig')showTab('dig');};
/* a "+1 ⚡" flies from his finger to the counter, so he SEES where points go */
function flyBolt(n,label){
  const pill=$('power').getBoundingClientRect();
  const f=document.createElement('div');f.className='flyBolt';f.textContent=label||('+'+n+'⚡');
  f.style.left=lastTap.x+'px';f.style.top=lastTap.y+'px';
  document.body.appendChild(f);
  if(!f.animate){setTimeout(()=>f.remove(),50);return;}
  const dx=pill.left+pill.width/2-lastTap.x, dy=pill.top+pill.height/2-lastTap.y;
  f.animate([
    {transform:'translate(-50%,-50%) scale(.5)',opacity:0},
    {transform:`translate(calc(-50% + ${dx*.12}px),calc(-50% + ${dy*.12-55}px)) scale(1.6)`,opacity:1,offset:.3},
    {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.55)`,opacity:.85}
  ],{duration:820,easing:'cubic-bezier(.45,0,.7,1)'}).onfinish=()=>f.remove();
}
function addPower(n=1){
  const before=power; power+=n; savePower();
  flyBolt(n);
  setTimeout(()=>{renderPower(true);beep(1320,0,0.08,'triangle',0.12);},800);
  // crossing a multiple of 40 = a new prize: wait for the win overlay to finish first
  if(Math.floor(before/DIG_COST)<Math.floor(power/DIG_COST)) setTimeout(showReward,2800);
  if(activeTab==='dig'&&pane==='digLock') showDigLock();
}
/* Points must not reward guessing: a right answer on the first try is
   worth 1 ⚡, on the second try still 1, after that nothing (the round
   still ends happily). Five first-try answers in a row earn a 🔥 bonus. */
let fireStreak=0;
function award(misses,base){
  base=base||1;mascot('cheer');advTick(activeTab);
  {const d=logDay();if(misses===0)d.ok++;else d.miss++;logSave();}
  if(misses>=2){fireStreak=0;return 0;}
  if(misses===0){fireStreak++;}else fireStreak=0;
  addPower(base);
  if(fireStreak&&fireStreak%5===0)setTimeout(()=>{flyBolt(2,'🔥+2');addPowerQuiet(2);
    [880,1175,1568].forEach((f,i)=>beep(f,i*0.07,0.18,'triangle',0.18));},950);
  return base;
}
function addPowerQuiet(n){const before=power;power+=n;savePower();setTimeout(()=>renderPower(true),800);
  if(Math.floor(before/DIG_COST)<Math.floor(power/DIG_COST))setTimeout(showReward,2800);}
function spendPower(n){power=Math.max(0,power-n);savePower();renderPower(true);}

/* ---------- emoji rain (DOM, so it works over any tab) ---------- */
function rainEmoji(bits,n,box){
  box=box||$('rain');
  for(let i=0;i<n;i++){
    const s=document.createElement('span');s.className='rainBit';s.textContent=bits[i%bits.length];
    s.style.left=rnd(0,95)+'%';s.style.animationDelay=rnd(0,1.4)+'s';
    s.style.animationDuration=rnd(2.2,3.8)+'s';s.style.fontSize=rnd(18,44)+'px';
    box.appendChild(s);setTimeout(()=>s.remove(),5600);
  }
}

/* ---------- extra sound effects ---------- */
function sweep(f0,f1,dur,type,vol,when){
  const a=ac(); if(!a)return; const t=a.currentTime+(when||0);
  const o=a.createOscillator(),g=a.createGain(); o.type=type||'sine';
  o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||0.15,t+0.02);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+0.03);
}
const chime=()=>[1047,1319,1568].forEach((f,i)=>beep(f,i*0.07,0.25,'triangle',0.16));
const popFx=()=>{noise(0.12,0.3);sweep(900,2400,0.08,'square',0.08);};
const boomFx=()=>{noise(0.7,0.26);sweep(120,40,0.5,'sine',0.35);};
function fanfare(){
  [[523,0],[659,.12],[784,.24],[1047,.36],[784,.52],[1047,.64]].forEach(([f,t])=>beep(f,t,0.22,'square',0.15));
  [523,659,784,1047].forEach(f=>beep(f,.82,0.9,'triangle',0.13));
  noise(0.6,0.1);
}
/* a synthesised roar: two detuned saws, growling LFO, closing filter */
function roar(big){
  const a=ac(); if(!a)return; const t=a.currentTime;
  const f0=big?150:520, f1=big?62:240;
  const o=a.createOscillator(),o2=a.createOscillator(),lfo=a.createOscillator();
  o.type='sawtooth';o2.type='square';
  o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+1.1);
  o2.frequency.setValueAtTime(f0*1.03,t);o2.frequency.exponentialRampToValueAtTime(f1*1.03,t+1.1);
  lfo.frequency.value=big?26:38;const lg=a.createGain();lg.gain.value=big?35:90;
  lfo.connect(lg);lg.connect(o.frequency);lg.connect(o2.frequency);
  const lp=a.createBiquadFilter();lp.type='lowpass';
  lp.frequency.setValueAtTime(big?1100:3200,t);lp.frequency.exponentialRampToValueAtTime(big?260:700,t+1.25);
  const gn=a.createGain();gn.gain.setValueAtTime(0.0001,t);
  gn.gain.exponentialRampToValueAtTime(0.32,t+0.08);gn.gain.exponentialRampToValueAtTime(0.0001,t+1.3);
  o.connect(lp);o2.connect(lp);lp.connect(gn);gn.connect(a.destination);
  [o,o2,lfo].forEach(x=>{x.start(t);x.stop(t+1.35);});
  noise(big?0.9:0.4,0.1);
}

/* ---------- the "you won a prize" pop-up ---------- */
function showReward(){
  if(rewardOpen||activeTab==='dig'||activeTab==='parent'||power<DIG_COST) return;
  rewardOpen=true;
  const T={es:['¡Has ganado un premio!','¡Ya puedes elegir un juego!','¡Vamos!','Luego'],
           en:['You won a prize!','Now you can pick a game!',"Let's go!",'Later'],
           de:['Du hast einen Preis gewonnen!','Jetzt darfst du ein Spiel aussuchen!','Los geht\'s!','Später']}[lang];
  $('rwTitle').textContent=T[0];$('rwSub').textContent=T[1];
  $('rwGo').textContent='🎁 '+T[2];$('rwLater').textContent=T[3];
  const box=$('rwConf');box.innerHTML='';
  rainEmoji(['⭐','🦴','🦖','🎈','✨','🦕','🎆','⚡'],28,box);
  $('reward').classList.add('on');
  try{speechSynthesis.cancel();}catch(e){}
  fanfare();
  setTimeout(()=>{if(rewardOpen)sayAt(T[0]+' '+T[1],0.8,true);},900);
}
function closeReward(go){
  $('reward').classList.remove('on');rewardOpen=false;
  if(go) showTab('dig'); else resumeTab();
}
function resumeTab(){
  if(activeTab==='trace')sayCurrent();
  else if(activeTab==='words')sayPrompt();
  else if(activeTab==='ear')earSay();
  else if(activeTab==='act'&&actMode==='quiz'&&actTarget)actAsk();
}
$('rwGo').onclick=()=>{ac();closeReward(true);};
$('rwLater').onclick=()=>{ac();closeReward(false);};

/* =============================================================
   PRIZE HUB
============================================================= */
const GAMES=[
 {k:'dig',icon:'🦖',bg:'linear-gradient(160deg,#FFD25E,#FF9A1F)',es:'Excavar',en:'Dig',     de:'Graben'},
 {k:'mem',icon:'🃏',bg:'linear-gradient(160deg,#7DF0FF,#1FA8FF)',es:'Parejas',en:'Pairs',   de:'Paare'},
 {k:'bal',icon:'🎈',bg:'linear-gradient(160deg,#FFA3D1,#FF4F9A)',es:'Globos', en:'Balloons',de:'Ballons'},
 {k:'fw', icon:'🎆',bg:'linear-gradient(160deg,#A68BFF,#5B3DF5)',es:'Fuegos', en:'Fireworks',de:'Feuerwerk'},
 {k:'bag',icon:'🚜',bg:'linear-gradient(160deg,#FFE066,#E0A21A)',es:'Excavadora',en:'Digger',de:'Bagger'}
];
const PANES=['digLock','digPlay','memPlay','balPlay','fwPlay','bagPlay'];
let pane='digLock';
function showPane(id){pane=id;PANES.forEach(p=>$(p).classList.toggle('on',p===id));$('v-dig').scrollTop=0;}
let found=[];try{found=JSON.parse(localStorage.getItem('sl_dinos')||'[]');}catch(e){}
let treasure={};try{treasure=JSON.parse(localStorage.getItem('sl_treasure')||'{}');}catch(e){}
let lastDino='';
function showDigLock(){
  DIG=null;MEM=null;BAL=null;FW=null;BAG=null;$('quitSheet').classList.remove('on');
  showPane('digLock');
  const T={es:['¡Juegos de premio!','Te faltan','¡Elige tu premio!','Museo de dinosaurios','Tesoros'],
           en:['Prize games!','You still need','Pick your prize!','Dinosaur museum','Treasures'],
           de:['Preisspiele!','Dir fehlen noch','Such dir einen Preis aus!','Dino-Museum','Schätze']}[lang];
  const ready=power>=DIG_COST;
  $('lockText').textContent=ready?T[2]:`${T[1]} ${DIG_COST-power} ⚡`;
  $('meterFill').style.width=Math.min(100,power/DIG_COST*100).toFixed(0)+'%';
  $('meterLabel').textContent=`${Math.min(power,DIG_COST)} / ${DIG_COST} ⚡`+(power>=2*DIG_COST?`  ·  🎁×${Math.floor(power/DIG_COST)}`:'');
  const gg=$('gameGrid');gg.innerHTML='';
  GAMES.forEach(gm=>{
    const c=document.createElement('div');c.className='gcard'+(ready?'':' locked');c.style.background=gm.bg;
    c.innerHTML=`<div class="gc">${DIG_COST}⚡</div><div class="gi"></div><div class="gl"></div>`;
    c.querySelector('.gi').textContent=gm.icon;c.querySelector('.gl').textContent=gm[lang];
    c.onclick=()=>{ac();startGame(gm.k,c);};
    gg.appendChild(c);
  });
  $('museumTitle').textContent=`🏛️ ${T[3]}  ${found.filter(k=>DINOS.some(d=>d.k===k)).length}/${DINOS.length}`;
  const m=$('museum');m.innerHTML='';
  DINOS.forEach(d=>{
    const got=found.includes(d.k);
    const c=document.createElement('div');c.className='mcard'+(got?' got':'');
    const cn=document.createElement('canvas');c.appendChild(cn);
    const lb=document.createElement('div');lb.textContent=got?d[lang][0].replace(/^(el|la|the|der|die|das)\s+/i,''):'?';
    c.appendChild(lb);
    c.onclick=()=>{ac();
      if(got)say(d[lang][0]+'. '+d[lang][1]);
      else say({es:'¿Quién será? ¡Sigue excavando!',en:'Who could it be? Keep digging!',de:'Wer das wohl ist? Grab weiter!'}[lang]);};
    m.appendChild(c);
    requestAnimationFrame(()=>drawThumb(cn,d,!got));
  });
  const tr=TREASURES.filter(t=>treasure[t.k]);
  $('treasures').innerHTML=tr.length?`<b>${T[4]}:</b> `+tr.map(t=>`<span>${t.ic}×${treasure[t.k]}</span>`).join(' '):'';
}
function startGame(k,card){
  if(power<DIG_COST){
    nope();if(card){card.classList.remove('wrong');void card.offsetWidth;card.classList.add('wrong');}
    const n=DIG_COST-power;
    say({es:`Te faltan ${n} puntos`,en:`You need ${n} more points`,de:`Dir fehlen noch ${n} Punkte`}[lang]);
    return;
  }
  spendPower(DIG_COST);
  if(k==='dig')startDig();else if(k==='mem')startMem();else if(k==='bal')startBal();else if(k==='bag')startBag();else startFw();
}
function resumeGame(){
  digPtr=false;digLast=null;if(BAG)BAG.touch=null;          // a finger lifted while away never sent its pointerup
  const over=(pane==='digPlay'&&(!DIG||DIG.done))||(pane==='memPlay'&&(!MEM||MEM.done))||
             (pane==='balPlay'&&(!BAL||BAL.done))||(pane==='fwPlay'&&(!FW||FW.done))||(pane==='bagPlay'&&(!BAG||BAG.done));
  if(over){showDigLock();return;}            // a finished game is never resumed — back to the prize menu
  if(pane==='digPlay'&&DIG)requestAnimationFrame(digLoop);
  else if(pane==='balPlay'&&BAL){BAL.last=0;requestAnimationFrame(balLoop);}
  else if(pane==='fwPlay'&&FW){FW.last=0;FW.clear=true;requestAnimationFrame(fwLoop);}
  else if(pane==='bagPlay'&&BAG){BAG.last=0;requestAnimationFrame(bagLoop);}
  else if(pane!=='memPlay'||!MEM)showDigLock();
}
/* 🏠 in a running game asks: back to the prize games, or keep playing? Leaving a
   game that has hardly started gives the 40 ⚡ back, so he can pick another one;
   after half of it he keeps what he played. */
function gameProgress(){
  if(pane==='digPlay'&&DIG)return (DIG.parts.filter(p=>p.found).length+DIG.tre.filter(t=>t.found).length)/(DIG.parts.length+DIG.tre.length);   // treasures are kept, so they count
  if(pane==='memPlay'&&MEM)return 1-MEM.left/MEM.total;
  if(pane==='balPlay'&&BAL)return BAL.pops/BAL.goal;
  if(pane==='fwPlay'&&FW)return FW.shots/FW.goal;
  if(pane==='bagPlay'&&BAG)return BAG.items.filter(i=>i.found).length/BAG.items.length;
  return 1;}
function gameLive(){return (pane==='digPlay'&&DIG&&!DIG.done)||(pane==='memPlay'&&MEM&&!MEM.done)||
  (pane==='balPlay'&&BAL&&!BAL.done)||(pane==='fwPlay'&&FW&&!FW.done)||(pane==='bagPlay'&&BAG&&!BAG.done);}
function quitGuard(btn){
  btn.onclick=()=>{ac();
    if(!gameLive()){showDigLock();return;}
    const refund=gameProgress()<0.5,sh=$('quitSheet');
    $('qsTitle').textContent={es:'¿Quieres jugar a otra cosa?',en:'Do you want to play something else?',de:'Möchtest du etwas anderes spielen?'}[lang];
    $('qsLeave').textContent='↩️ '+{es:'Otros juegos',en:'Other games',de:'Andere Spiele'}[lang]+(refund?` (+${DIG_COST} ⚡)`:'');
    $('qsStay').textContent='▶ '+{es:'Seguir jugando',en:'Keep playing',de:'Weiterspielen'}[lang];
    sh.classList.add('on');say($('qsTitle').textContent);
    $('qsStay').onclick=()=>{ac();sh.classList.remove('on');};
    $('qsLeave').onclick=()=>{ac();sh.classList.remove('on');
      if(refund){power+=DIG_COST;savePower();flyBolt(DIG_COST,'+'+DIG_COST+'⚡');setTimeout(()=>renderPower(true),800);
        say({es:'¡Te devuelvo tus puntos! Elige otro juego.',en:'Here are your points back! Pick another game.',de:'Du bekommst deine Punkte zurück! Such dir ein anderes Spiel aus.'}[lang]);}
      showDigLock();};
  };
}
document.querySelectorAll('.quitBtn').forEach(quitGuard);

/* =============================================================
   FOSSIL DIG
   Skeletons are built from a handful of bone primitives. Units: the
   animal is ~1 unit long, head on the left, y pointing down, feet
   near y≈0.45. A skeleton is a list of PARTS (skull, jaw, neck,
   ribs, legs…) and each dig lays them out differently: articulated
   at a random angle, half washed apart, or scattered all over.
============================================================= */
const pB=(a,b,w)=>({t:'b',a,b,w}), pR=(a,c,b,w)=>({t:'r',a,c,b,w}),
      pP=(pts,holes)=>({t:'p',pts,holes:holes||[]}), pT=(a,b,w)=>({t:'t',a,b,w}),
      pM=pts=>({t:'m',pts}), pO=(x,y,r)=>({t:'o',x,y,r});
function qpt(p0,c,p1,t){const u=1-t;return [u*u*p0[0]+2*u*t*c[0]+t*t*p1[0],u*u*p0[1]+2*u*t*c[1]+t*t*p1[1]];}
/* a run of vertebrae along a curve; from/to lets one curve be split into parts */
function chain(p0,c,p1,n,r0,r1,from,to){
  from=from||0;if(to==null)to=n;
  const pts=[];for(let i=0;i<n;i++)pts.push(qpt(p0,c,p1,n>1?i/(n-1):0));
  const rr=i=>r0+(r1-r0)*(n>1?i/(n-1):0), pr=[];
  for(let i=from;i<to;i++){
    if(i>0){const a=i>from?pts[i-1]:[(pts[i-1][0]+pts[i][0])/2,(pts[i-1][1]+pts[i][1])/2];
      pr.push({t:'l',a,b:pts[i],w:rr(i)*0.9});}
    pr.push({t:'v',x:pts[i][0],y:pts[i][1],r:rr(i)});
  }
  return {pr,pts};
}
function mapPrim(p,f,s){
  const q=Object.assign({},p);
  if(p.a)q.a=f(p.a);if(p.b)q.b=f(p.b);if(p.c)q.c=f(p.c);
  if(p.w)q.w=p.w*s;if(p.r)q.r=p.r*s;
  if(p.t==='v'||p.t==='o'){const v=f([p.x,p.y]);q.x=v[0];q.y=v[1];}
  if(p.pts)q.pts=p.pts.map(f);
  if(p.holes)q.holes=p.holes.map(h=>{const v=f([h[0],h[1]]);return [v[0],v[1],h[2]*s];});
  return q;
}
/* skulls in local units: attached to the neck at (0,0), snout toward -x */
const SKULLS={
 trex:{up:[[0.01,-0.02],[-0.03,-0.075],[-0.12,-0.09],[-0.24,-0.075],[-0.30,-0.045],[-0.315,0],[-0.02,0.02]],
   jaw:[[-0.29,0.012],[-0.03,0.028],[0.015,0],[-0.02,0.07],[-0.11,0.075],[-0.27,0.038]],
   holes:[[-0.065,-0.045,0.017],[-0.155,-0.04,0.024]],teeth:[-0.29,-0.07,0,0.03,8]},
 raptor:{up:[[0.01,-0.015],[-0.04,-0.05],[-0.15,-0.05],[-0.25,-0.022],[-0.27,0],[-0.02,0.016]],
   jaw:[[-0.26,0.008],[-0.02,0.022],[0.01,0],[-0.02,0.045],[-0.22,0.028]],
   holes:[[-0.05,-0.027,0.015],[-0.135,-0.024,0.016]],teeth:[-0.26,-0.08,0.002,0.018,8]},
 trike:{back:[pP([[0.02,0.04],[-0.02,-0.05],[0.02,-0.15],[0.09,-0.21],[0.17,-0.18],[0.2,-0.08],[0.12,0.04]]),
     pT([0.05,-0.18],[0.04,-0.23],0.03),pT([0.12,-0.2],[0.13,-0.25],0.03),pT([0.18,-0.14],[0.23,-0.16],0.03),pT([0.2,-0.06],[0.25,-0.05],0.03)],
   up:[[0.03,-0.02],[-0.06,-0.065],[-0.17,-0.06],[-0.27,-0.02],[-0.31,0.03],[-0.25,0.055],[-0.02,0.06]],
   jaw:[[-0.25,0.058],[-0.03,0.062],[-0.01,0.1],[-0.19,0.1]],holes:[[-0.085,-0.025,0.016]],
   extra:[pT([-0.08,-0.05],[-0.2,-0.21],0.034),pT([-0.04,-0.045],[-0.15,-0.22],0.03),pT([-0.22,-0.03],[-0.255,-0.1],0.028)]},
 stego:{up:[[0,-0.015],[-0.05,-0.035],[-0.13,-0.022],[-0.165,0],[-0.01,0.02]],
   jaw:[[-0.155,0.006],[-0.01,0.02],[-0.03,0.036],[-0.13,0.022]],holes:[[-0.04,-0.012,0.011]]},
 brachio:{up:[[0,-0.02],[-0.025,-0.065],[-0.06,-0.07],[-0.09,-0.035],[-0.155,-0.018],[-0.165,0.01],[-0.01,0.02]],
   jaw:[[-0.155,0.012],[-0.01,0.02],[-0.03,0.036],[-0.13,0.03]],holes:[[-0.04,-0.022,0.012],[-0.07,-0.05,0.01]],
   teeth:[-0.15,-0.09,0.012,0.01,4]},
 diplo:{up:[[0,-0.015],[-0.04,-0.036],[-0.15,-0.022],[-0.185,0.004],[-0.01,0.02]],
   jaw:[[-0.175,0.008],[-0.01,0.02],[-0.03,0.034],[-0.15,0.024]],holes:[[-0.035,-0.014,0.011],[-0.08,-0.016,0.008]],
   teeth:[-0.18,-0.13,0.008,0.012,4]},
 anky:{up:[[0.015,-0.03],[-0.04,-0.06],[-0.14,-0.05],[-0.195,-0.012],[-0.185,0.03],[-0.02,0.04]],
   jaw:[[-0.17,0.03],[-0.02,0.04],[-0.04,0.062],[-0.14,0.056]],holes:[[-0.05,-0.025,0.014]],
   extra:[pT([0,-0.04],[0.055,-0.085],0.03),pT([0,0.025],[0.055,0.06],0.026),pT([-0.08,-0.055],[-0.09,-0.085],0.02)]},
 para:{up:[[0,-0.02],[-0.04,-0.05],[-0.14,-0.042],[-0.225,-0.012],[-0.235,0.015],[-0.02,0.025]],
   jaw:[[-0.22,0.018],[-0.02,0.028],[-0.03,0.05],[-0.19,0.04]],holes:[[-0.05,-0.025,0.014]],
   extra:[pP([[-0.08,-0.04],[-0.04,-0.066],[0.2,-0.2],[0.225,-0.175],[-0.01,-0.03]])]},
 spino:{up:[[0,-0.02],[-0.04,-0.055],[-0.1,-0.05],[-0.32,-0.022],[-0.35,0],[-0.02,0.015]],
   jaw:[[-0.335,0.006],[-0.02,0.02],[0.005,0],[-0.02,0.045],[-0.3,0.022]],holes:[[-0.05,-0.03,0.014]],
   teeth:[-0.33,-0.12,0.003,0.018,9],extra:[pT([-0.1,-0.048],[-0.12,-0.08],0.03)]},
 pachy:{up:[[0.025,0],[0.035,-0.05],[0,-0.1],[-0.07,-0.115],[-0.13,-0.075],[-0.175,-0.02],[-0.165,0.012],[-0.01,0.025]],
   jaw:[[-0.16,0.014],[-0.01,0.026],[-0.03,0.046],[-0.14,0.034]],holes:[[-0.07,-0.04,0.014]],
   knobs:[[0.035,-0.06],[0.03,-0.03],[0.02,-0.085],[-0.13,-0.08],[-0.15,-0.055]]},
 ptera:{up:[[0,-0.012],[-0.03,-0.03],[-0.31,-0.004],[-0.02,0.014]],jaw:[[-0.29,0.002],[-0.02,0.016],[-0.03,0.028]],
   holes:[[-0.035,-0.012,0.01]],extra:[pP([[0,-0.022],[0.04,-0.04],[0.21,-0.105],[0.19,-0.075],[0.02,-0.002]])]}
};
function mkSkull(key,o,s,ang){
  const d=SKULLS[key],c=Math.cos(ang||0),sn=Math.sin(ang||0);
  const f=p=>[o[0]+s*(p[0]*c-p[1]*sn),o[1]+s*(p[0]*sn+p[1]*c)];
  const sk=[...(d.back||[]),pP(d.up,d.holes),...(d.extra||[])];
  (d.knobs||[]).forEach(k=>sk.push(pO(k[0],k[1],0.013)));
  if(d.teeth){const [x0,x1,y,len,n]=d.teeth;
    for(let i=0;i<n;i++){const x=x0+(x1-x0)*i/(n-1);sk.push(pT([x,y],[x+0.004,y+len],len*0.7));}}
  return {skull:sk.map(p=>mapPrim(p,f,s)),jaw:[mapPrim(pP(d.jaw),f,s)]};
}
const PELVIS=h=>pP([[h[0]-0.09,h[1]-0.015],[h[0]+0.11,h[1]-0.02],[h[0]+0.08,h[1]+0.05],[h[0]+0.025,h[1]+0.12],
  [h[0]-0.015,h[1]+0.12],[h[0]-0.05,h[1]+0.05]],[[h[0]+0.015,h[1]+0.025,0.017]]);
/* two-legged: theropods, hadrosaurs, pachycephalosaurs */
function biped(o){
  const P=[],hip=[0.14,-0.02],n0=[-0.22,-0.03],L=o.leg||1,A=o.arm||0.5;
  const leg=(dx,dy,an,n)=>{
    const h=[0.15+dx,0.03+dy],k=[h[0]-0.06*L,h[1]+0.17*L],a=[h[0]+0.012*L,h[1]+0.32*L],f=[a[0]-0.035*L,a[1]+0.075*L];
    const pr=[pB(h,k,0.036),pB(k,a,0.028),pB(a,f,0.02),pT(f,[f[0]-0.075*L,f[1]+0.012],0.024),pT(f,[f[0]+0.035*L,f[1]+0.015],0.018)];
    if(o.sickle)pr.push(pT([f[0]-0.012,f[1]-0.006],[f[0]-0.05,f[1]-0.045],0.02));
    return {n,k:'leg',pr,pv:h,an};
  };
  P.push(leg(-0.05,-0.012,'legC','legFar'));
  const N=o.tailN||14,hN=Math.floor(N/2),tE=[hip[0]+o.tail,hip[1]+o.tailDrop],tc=[hip[0]+o.tail*0.45,hip[1]-0.035];
  const t1=chain(hip,tc,tE,N,0.027,0.007,0,hN),t2=chain(hip,tc,tE,N,0.027,0.007,hN,N);
  P.push({n:'tail1',k:'tail',pr:t1.pr,pv:hip,an:'tail'});
  P.push({n:'tail2',k:'tail',pr:t2.pr,pv:t1.pts[hN],an:'tail2',par:'tail1'});
  const bc=[-0.04,-0.075],back=chain(n0,bc,hip,7,0.03,0.03);
  if(o.sail){
    const tips=[],sp=[];
    back.pts.forEach((p,i)=>{if(i===0||i===6)return;const h=o.sail*Math.sin(Math.PI*i/6),tip=[p[0]+0.012,p[1]-h];
      tips.push(tip);sp.push(pR(p,[p[0]+0.006,p[1]-h*0.5],tip,0.013));});
    P.push({n:'sail',k:'sail',pr:[pM([back.pts[0],...tips,back.pts[6]]),...sp],pv:hip,an:'body'});
  }
  const rb=[];for(let i=0;i<6;i++){const p=qpt(n0,bc,hip,0.1+i*0.12),b=o.belly||1;
    rb.push(pR(p,[p[0]-0.05,p[1]+0.1*b],[p[0]-0.02,p[1]+0.19*b],0.013));}
  P.push({n:'ribs',k:'ribs',pr:rb,pv:hip,an:'body'});
  P.push({n:'back',k:'back',pr:back.pr,pv:hip,an:'body'});
  P.push({n:'pelvis',k:'hip',pr:[PELVIS(hip)],pv:hip,an:'body'});
  const nE=o.neckEnd||[-0.33,-0.16],nk=chain(n0,o.neckC||[-0.31,-0.05],nE,o.neckN||4,0.026,0.021);
  P.push({n:'neck',k:'neck',pr:nk.pr,pv:n0,an:'neck'});
  const sk=mkSkull(o.skull,nE,o.skullS||1,o.skullA||0);
  P.push({n:'jaw',k:'jaw',pr:sk.jaw,pv:nE,an:'jaw',par:'skull'});
  P.push({n:'skull',k:'head',pr:sk.skull,pv:nE,an:'head',par:'neck'});
  const ar=[];[[0.035,-0.012],[0,0]].forEach(([ox,oy])=>{
    const s=[-0.16+ox,0.03+oy],e=[s[0]+0.03*A,s[1]+0.11*A],h=[e[0]-0.065*A,e[1]+0.05*A],w=Math.max(A,0.6);
    ar.push(pB(s,e,0.018*w),pB(e,h,0.014*w),pT(h,[h[0]-0.035*A,h[1]+0.025*A],0.011),pT(h,[h[0]-0.02*A,h[1]+0.04*A],0.01));});
  P.push({n:'arms',k:'arm',pr:ar,pv:[-0.16,0.03],an:'arm'});
  P.push(leg(0,0,'legA','legNear'));
  return P;
}
/* four-legged: ceratopsians, stegosaurs, ankylosaurs, sauropods */
function quad(o){
  const P=[],fl=o.fl,bl=o.bl,th=o.thick||1,hip=[0.15,-0.02];
  const sh=[-0.2,hip[1]+0.36*(bl-fl)],bc=[-0.02,Math.min(hip[1],sh[1])+(o.arch||-0.07)];
  const fLeg=(dx,dy,an,n)=>{const j=[sh[0]+0.02+dx,sh[1]+0.045+dy],e=[j[0]+0.025,j[1]+0.17*fl],w=[j[0]-0.005,j[1]+0.335*fl],f=[w[0]-0.045,w[1]+0.03];
    return {n,k:'leg',pr:[pB(j,e,0.036*th),pB(e,w,0.03*th),pB(w,f,0.022*th),pT(f,[f[0]-0.03,f[1]+0.01],0.02)],pv:j,an};};
  const bLeg=(dx,dy,an,n)=>{const j=[hip[0]+dx,hip[1]+0.05+dy],k=[j[0]-0.03,j[1]+0.18*bl],a=[j[0]+0.01,j[1]+0.335*bl],f=[a[0]-0.05,a[1]+0.03];
    return {n,k:'leg',pr:[pB(j,k,0.04*th),pB(k,a,0.032*th),pB(a,f,0.024*th),pT(f,[f[0]-0.03,f[1]+0.01],0.022)],pv:j,an};};
  P.push(bLeg(-0.045,-0.012,'legA','legBackFar'),fLeg(-0.04,-0.012,'legC','legFrontFar'));
  const N=o.tailN||14,hN=Math.floor(N/2),tE=[hip[0]+o.tail,hip[1]+o.tailDrop],tc=[hip[0]+o.tail*0.45,hip[1]-0.02];
  const t1=chain(hip,tc,tE,N,0.03,0.008,0,hN),t2=chain(hip,tc,tE,N,0.03,0.008,hN,N);
  if(o.spikes){[N-4,N-3].forEach((i,j)=>{const p=t2.pts[i];
    t2.pr.push(pT(p,[p[0]+0.02+j*0.03,p[1]-0.09],0.022),pT(p,[p[0]+0.06+j*0.03,p[1]-0.06],0.02));});}
  if(o.club){const e=tE,el=[];for(let i=0;i<10;i++){const a=i/10*Math.PI*2;el.push([e[0]+Math.cos(a)*0.06,e[1]+Math.sin(a)*0.042]);}
    t2.pr.push(pP(el));}
  P.push({n:'tail1',k:'tail',pr:t1.pr,pv:hip,an:'tail'});
  P.push({n:'tail2',k:'tail',pr:t2.pr,pv:t1.pts[hN],an:'tail2',par:'tail1'});
  const back=chain(sh,bc,hip,8,0.032,0.032);
  if(o.plates){const pr=[],ps=[...back.pts.slice(1),t1.pts[1],t1.pts[2]];
    ps.forEach((p,i)=>{const t=i/(ps.length-1),sz=0.045+0.075*Math.sin(Math.PI*(0.15+0.8*t)),x=p[0]+(i%2?0.012:-0.012),y=p[1]-0.015;
      pr.push(pP([[x-sz*0.42,y],[x-sz*0.32,y-sz*0.75],[x+0.004,y-sz*1.15],[x+sz*0.36,y-sz*0.72],[x+sz*0.42,y]]));});
    P.push({n:'plates',k:'plates',pr,pv:hip,an:'body'});}
  const rb=[];for(let i=0;i<7;i++){const p=qpt(sh,bc,hip,0.08+i*0.11),b=o.belly||1;
    rb.push(pR(p,[p[0]-0.045,p[1]+0.11*b],[p[0]-0.015,p[1]+0.21*b],0.014));}
  P.push({n:'ribs',k:'ribs',pr:rb,pv:hip,an:'body'});
  P.push({n:'back',k:'back',pr:back.pr,pv:hip,an:'body'});
  if(o.armor){const pr=[];back.pts.forEach(p=>{pr.push(pT([p[0],p[1]-0.02],[p[0]+0.01,p[1]-0.065],0.04),pO(p[0]+0.012,p[1]+0.035,0.017));});
    pr.push(pT([sh[0]+0.02,sh[1]+0.03],[sh[0]-0.035,sh[1]+0.075],0.03));
    P.push({n:'armor',k:'armor',pr,pv:hip,an:'body'});}
  P.push({n:'pelvis',k:'hip',pr:[PELVIS(hip)],pv:hip,an:'body'});
  const nN=o.neckN||4,nE=o.neckEnd;let last='neck';
  if(nN>=8){const h=Math.floor(nN/2),a=chain(sh,o.neckC,nE,nN,0.032,0.018,0,h),b=chain(sh,o.neckC,nE,nN,0.032,0.018,h,nN);
    P.push({n:'neck',k:'neck',pr:a.pr,pv:sh,an:'neck'},{n:'neck2',k:'neck',pr:b.pr,pv:a.pts[h],an:'neck2',par:'neck'});last='neck2';}
  else P.push({n:'neck',k:'neck',pr:chain(sh,o.neckC,nE,nN,0.03,0.024).pr,pv:sh,an:'neck'});
  const sk=mkSkull(o.skull,nE,o.skullS||1,o.skullA||0);
  P.push({n:'jaw',k:'jaw',pr:sk.jaw,pv:nE,an:'jaw',par:'skull'});
  P.push({n:'skull',k:'head',pr:sk.skull,pv:nE,an:'head',par:last});
  P.push(bLeg(0,0,'legC','legBackNear'),fLeg(0,0,'legA','legFrontNear'));
  return P;
}
/* Pteranodon, in flight */
function ptera(){
  const P=[],sh=[-0.05,0];
  const wing=(e,w,tip,trail,n)=>({n,k:'wing',pv:sh,an:'wing',pr:[pM([sh,e,w,tip,...trail]),
    pB(sh,e,0.022),pB(e,w,0.02),pR(w,[(w[0]+tip[0])/2,(w[1]+tip[1])/2-0.02],tip,0.014),pT(w,[w[0]-0.02,w[1]-0.035],0.012)]});
  P.push(wing([0.02,0.08],[0.12,0.1],[0.47,0.14],[[0.3,0.13],[0.14,0.07],[0.07,0.02]],'wingFar'));
  P.push({n:'legs',k:'leg',pv:[0.07,0],an:'legA',pr:[pB([0.07,0],[0.11,0.1],0.016),pB([0.11,0.1],[0.1,0.17],0.013),
    pT([0.1,0.17],[0.07,0.19],0.012),pT([0.1,0.17],[0.12,0.195],0.012)]});
  P.push({n:'tail1',k:'tail',pv:[0.08,0],an:'tail',pr:chain([0.08,0],[0.12,0.01],[0.16,0.03],3,0.014,0.008).pr});
  const back=chain([-0.08,-0.02],[0,-0.035],[0.08,0],5,0.024,0.02);
  const rb=[];for(let i=0;i<4;i++){const p=qpt([-0.08,-0.02],[0,-0.035],[0.08,0],0.15+i*0.2);rb.push(pR(p,[p[0]-0.02,p[1]+0.04],[p[0]-0.01,p[1]+0.08],0.01));}
  P.push({n:'ribs',k:'ribs',pr:rb,pv:sh,an:'body'});
  P.push({n:'back',k:'back',pr:back.pr,pv:sh,an:'body'});
  const nE=[-0.17,-0.13];
  P.push({n:'neck',k:'neck',pr:chain([-0.08,-0.02],[-0.14,-0.07],nE,4,0.02,0.016).pr,pv:[-0.08,-0.02],an:'neck'});
  const sk=mkSkull('ptera',nE,1,0.15);
  P.push({n:'jaw',k:'jaw',pr:sk.jaw,pv:nE,an:'jaw',par:'skull'});
  P.push({n:'skull',k:'head',pr:sk.skull,pv:nE,an:'head',par:'neck'});
  P.push(wing([-0.02,-0.13],[0.1,-0.2],[0.46,-0.33],[[0.3,-0.18],[0.14,-0.06],[0.07,0]],'wingNear'));
  return P;
}
const DINOS=[
 {k:'trex',big:1,b:()=>biped({skull:'trex',tail:0.62,tailDrop:0.1,arm:0.42,leg:1}),
  es:['el Tiranosaurio Rex','Tenía dientes tan grandes como plátanos y unos brazos pequeñitos.'],
  en:['the Tyrannosaurus Rex','It had teeth as big as bananas and tiny little arms.'],
  de:['der Tyrannosaurus Rex','Er hatte Zähne so groß wie Bananen und winzige Ärmchen.']},
 {k:'raptor',b:()=>biped({skull:'raptor',skullS:0.85,neckEnd:[-0.31,-0.2],neckC:[-0.22,-0.17],tail:0.62,tailDrop:-0.01,arm:0.95,leg:0.92,sickle:1}),
  es:['el Velociraptor','Era del tamaño de un pavo, tenía plumas y una garra curva en cada pie.'],
  en:['the Velociraptor','It was as big as a turkey, had feathers and a curved claw on each foot.'],
  de:['der Velociraptor','Er war so groß wie ein Truthahn, hatte Federn und eine gebogene Kralle an jedem Fuß.']},
 {k:'trike',big:1,b:()=>quad({skull:'trike',skullS:1.1,neckEnd:[-0.27,0],neckC:[-0.24,0],neckN:3,fl:0.85,bl:1,tail:0.38,tailDrop:0.13,arch:-0.06,belly:1.1,thick:1.15}),
  es:['el Triceratops','Tenía tres cuernos y un gran escudo detrás de la cabeza.'],
  en:['the Triceratops','It had three horns and a big shield behind its head.'],
  de:['der Triceratops','Er hatte drei Hörner und einen großen Schild hinter dem Kopf.']},
 {k:'stego',big:1,b:()=>quad({skull:'stego',neckEnd:[-0.36,0.07],neckC:[-0.3,0],neckN:4,fl:0.72,bl:1.05,tail:0.5,tailDrop:0.06,arch:-0.16,plates:1,spikes:1}),
  es:['el Estegosaurio','Tenía placas en la espalda y pinchos en la cola.'],
  en:['the Stegosaurus','It had plates on its back and spikes on its tail.'],
  de:['der Stegosaurus','Er hatte Platten auf dem Rücken und Stacheln am Schwanz.']},
 {k:'brachio',big:1,b:()=>quad({skull:'brachio',skullS:0.9,neckEnd:[-0.38,-0.62],neckC:[-0.33,-0.28],neckN:9,fl:1.25,bl:1,tail:0.45,tailDrop:0.14,arch:-0.03,thick:1.3}),
  es:['el Braquiosaurio','Era más alto que una casa y comía hojas de los árboles altos.'],
  en:['the Brachiosaurus','It was taller than a house and ate leaves from tall trees.'],
  de:['der Brachiosaurus','Er war größer als ein Haus und fraß Blätter von hohen Bäumen.']},
 {k:'diplo',big:1,b:()=>quad({skull:'diplo',skullS:0.9,neckEnd:[-0.64,-0.2],neckC:[-0.45,-0.09],neckN:10,fl:0.92,bl:1.02,tail:0.85,tailDrop:0.12,tailN:20,arch:-0.06,thick:1.25}),
  es:['el Diplodocus','Era tan largo como dos autobuses y su cola era como un látigo.'],
  en:['the Diplodocus','It was as long as two buses and its tail was like a whip.'],
  de:['der Diplodocus','Er war so lang wie zwei Busse und sein Schwanz war wie eine Peitsche.']},
 {k:'anky',big:1,b:()=>quad({skull:'anky',neckEnd:[-0.29,0.05],neckC:[-0.26,0.02],neckN:3,fl:0.62,bl:0.68,tail:0.5,tailDrop:0.02,arch:-0.05,armor:1,club:1,belly:0.9,thick:1.2}),
  es:['el Anquilosaurio','Tenía una armadura en la espalda y un mazo en la punta de la cola.'],
  en:['the Ankylosaurus','It had armour on its back and a club at the end of its tail.'],
  de:['der Ankylosaurus','Er hatte einen Panzer auf dem Rücken und eine Keule am Schwanzende.']},
 {k:'para',big:1,b:()=>biped({skull:'para',neckEnd:[-0.34,-0.2],neckC:[-0.3,-0.06],tail:0.55,tailDrop:0.06,arm:0.85,leg:1}),
  es:['el Parasaurolophus','Tenía una cresta hueca en la cabeza y hacía sonidos como una trompeta.'],
  en:['the Parasaurolophus','It had a hollow crest on its head and made sounds like a trumpet.'],
  de:['der Parasaurolophus','Er hatte einen hohlen Kamm auf dem Kopf und tönte wie eine Trompete.']},
 {k:'spino',big:1,b:()=>biped({skull:'spino',neckEnd:[-0.33,-0.15],tail:0.62,tailDrop:0.08,arm:0.8,leg:0.85,sail:0.3}),
  es:['el Espinosaurio','Tenía una vela enorme en la espalda y comía peces.'],
  en:['the Spinosaurus','It had a huge sail on its back and ate fish.'],
  de:['der Spinosaurus','Er hatte ein riesiges Segel auf dem Rücken und fraß Fische.']},
 {k:'pachy',b:()=>biped({skull:'pachy',neckEnd:[-0.32,-0.15],tail:0.5,tailDrop:0.05,arm:0.6,leg:1}),
  es:['el Paquicefalosaurio','Tenía la cabeza muy dura, como un casco.'],
  en:['the Pachycephalosaurus','It had a very hard head, like a helmet.'],
  de:['der Pachycephalosaurus','Er hatte einen sehr harten Kopf, wie ein Helm.']},
 {k:'ptera',b:ptera,
  es:['el Pteranodon','No era un dinosaurio: era un reptil volador con alas enormes.'],
  en:['the Pteranodon','It was not a dinosaur: it was a flying reptile with huge wings.'],
  de:['der Pteranodon','Er war kein Dinosaurier, sondern ein Flugsaurier mit riesigen Flügeln.']}
];
/* every bone found gets named — body vocabulary for free */
const BONEWORD={
 head:{es:'¡La cabeza!',en:'The head!',de:'Der Kopf!'},   jaw:{es:'¡La mandíbula!',en:'The jaw!',de:'Der Kiefer!'},
 neck:{es:'¡El cuello!',en:'The neck!',de:'Der Hals!'},   back:{es:'¡La espalda!',en:'The back!',de:'Der Rücken!'},
 ribs:{es:'¡Las costillas!',en:'The ribs!',de:'Die Rippen!'}, hip:{es:'¡La cadera!',en:'The hip!',de:'Die Hüfte!'},
 tail:{es:'¡La cola!',en:'The tail!',de:'Der Schwanz!'},  leg:{es:'¡Una pata!',en:'A leg!',de:'Ein Bein!'},
 arm:{es:'¡Los brazos!',en:'The arms!',de:'Die Arme!'},   plates:{es:'¡Las placas!',en:'The plates!',de:'Die Platten!'},
 sail:{es:'¡La vela!',en:'The sail!',de:'Das Segel!'},    armor:{es:'¡La armadura!',en:'The armour!',de:'Der Panzer!'},
 wing:{es:'¡Un ala!',en:'A wing!',de:'Ein Flügel!'}
};
const TREASURES=[
 {k:'amm',  ic:'🐚',es:'¡Un amonites!',en:'An ammonite!',de:'Ein Ammonit!'},
 {k:'amber',ic:'🟠',es:'¡Ámbar!',en:'Amber!',de:'Bernstein!'},
 {k:'gem',  ic:'💎',es:'¡Un cristal!',en:'A crystal!',de:'Ein Kristall!'},
 {k:'tooth',ic:'🦈',es:'¡Un diente de tiburón!',en:'A shark tooth!',de:'Ein Haizahn!'},
 {k:'tri',  ic:'🪲',es:'¡Un trilobites!',en:'A trilobite!',de:'Ein Trilobit!'},
 {k:'gold', ic:'🪙',es:'¡Oro!',en:'Gold!',de:'Gold!'}
];

/* ---------- bone rendering ---------- */
const BONE='#F7EFD9',BONE_D='#4A3A22',HOLE='#3B2F1D';
function primPts(p){
  switch(p.t){
    case 'v':case 'o':return [[p.x,p.y]];
    case 'l':case 'b':case 't':return [p.a,p.b,[(p.a[0]+p.b[0])/2,(p.a[1]+p.b[1])/2]];
    case 'r':return [p.a,qpt(p.a,p.c,p.b,0.5),p.b];
    case 'p':return p.pts;
  }
  return [];
}
function primDraw(g,p,e,pass,o){
  switch(p.t){
    case 'v':g.beginPath();g.arc(p.x,p.y,p.r+e,0,7);g.fill();
      g.lineWidth=p.r*0.6+2*e;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+p.r*0.15,p.y-p.r*1.75);g.stroke();break;
    case 'o':g.beginPath();g.arc(p.x,p.y,p.r+e,0,7);g.fill();break;
    case 'l':g.lineWidth=p.w+2*e;g.beginPath();g.moveTo(p.a[0],p.a[1]);g.lineTo(p.b[0],p.b[1]);g.stroke();break;
    case 'r':g.lineWidth=p.w+2*e;g.beginPath();g.moveTo(p.a[0],p.a[1]);g.quadraticCurveTo(p.c[0],p.c[1],p.b[0],p.b[1]);g.stroke();break;
    case 'b':{g.lineWidth=p.w+2*e;g.beginPath();g.moveTo(p.a[0],p.a[1]);g.lineTo(p.b[0],p.b[1]);g.stroke();
      const dx=p.b[0]-p.a[0],dy=p.b[1]-p.a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L*p.w*0.42,ny=dx/L*p.w*0.42,kr=p.w*0.5+e;
      [p.a,p.b].forEach(q=>{g.beginPath();g.arc(q[0]+nx,q[1]+ny,kr,0,7);g.fill();g.beginPath();g.arc(q[0]-nx,q[1]-ny,kr,0,7);g.fill();});
      break;}
    case 't':{const dx=p.b[0]-p.a[0],dy=p.b[1]-p.a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L*p.w/2,ny=dx/L*p.w/2;
      g.beginPath();g.moveTo(p.a[0]+nx,p.a[1]+ny);g.lineTo(p.b[0],p.b[1]);g.lineTo(p.a[0]-nx,p.a[1]-ny);g.closePath();
      if(e){g.lineWidth=2*e;g.stroke();}g.fill();break;}
    case 'p':g.beginPath();p.pts.forEach((q,i)=>g[i?'lineTo':'moveTo'](q[0],q[1]));g.closePath();
      if(e){g.lineWidth=2*e;g.stroke();}g.fill();
      if(pass&&p.holes.length){const fs=g.fillStyle;g.fillStyle=o.hole||HOLE;
        p.holes.forEach(h=>{g.beginPath();g.ellipse(h[0],h[1],h[2]*1.15,h[2],0,0,7);g.fill();});g.fillStyle=fs;}
      break;
    case 'm':if(pass){const fs=g.fillStyle;g.fillStyle=o.mem||'rgba(222,176,120,.5)';
      g.beginPath();p.pts.forEach((q,i)=>g[i?'lineTo':'moveTo'](q[0],q[1]));g.closePath();g.fill();g.fillStyle=fs;}
      break;
  }
}
/* two passes — all outlines, then all fills — so touching bones merge cleanly */
function drawBones(g,parts,xf,o){
  o=o||{};
  for(let pass=0;pass<2;pass++){
    parts.forEach(pt=>{
      g.save();const k=xf(g,pt),e=pass?0:(o.out||2.2)/k,col=pass?(o.fill||BONE):(o.line||BONE_D);
      g.fillStyle=g.strokeStyle=col;g.lineCap='round';g.lineJoin='round';
      if(!pass&&pt.glow){g.shadowColor='#FFD400';g.shadowBlur=pt.glow;}
      pt.pr.forEach(p=>primDraw(g,p,e,pass,o));
      g.restore();
    });
  }
}
function prepParts(sp){
  const parts=sp.b();let bx0=1e9,by0=1e9,bx1=-1e9,by1=-1e9;
  const grow=q=>{bx0=Math.min(bx0,q[0]);bx1=Math.max(bx1,q[0]);by0=Math.min(by0,q[1]);by1=Math.max(by1,q[1]);};
  parts.forEach(pt=>{
    const pts=[];pt.pr.forEach(p=>{if(p.t==='m')p.pts.forEach(grow);else primPts(p).forEach(q=>pts.push(q));});
    let cx=0,cy=0;pts.forEach(q=>{cx+=q[0];cy+=q[1];grow(q);});cx/=pts.length;cy/=pts.length;
    let rad=0;pts.forEach(q=>{rad=Math.max(rad,Math.hypot(q[0]-cx,q[1]-cy));});
    pt.c=[cx,cy];pt.rad=rad+0.035;
    const step=Math.max(1,Math.floor(pts.length/18));pt.smp=pts.filter((q,i)=>i%step===0);
  });
  return {parts,box:[bx0-0.035,by0-0.035,bx1+0.035,by1+0.035]};
}
const thumbCache={};
function drawThumb(cn,d,silh){
  const r=cn.getBoundingClientRect();if(!r.width)return;const dpr=Math.min(window.devicePixelRatio||1,2);
  cn.width=r.width*dpr;cn.height=r.height*dpr;const g=cn.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);
  const {parts,box}=thumbCache[d.k]||(thumbCache[d.k]=prepParts(d));
  const K=Math.min(r.width*0.92/(box[2]-box[0]),r.height*0.9/(box[3]-box[1]));
  const ox=r.width/2-(box[0]+box[2])/2*K,oy=r.height/2-(box[1]+box[3])/2*K;
  drawBones(g,parts,gg=>{gg.translate(ox,oy);gg.scale(K,K);return K;},
    silh?{fill:'#2A3170',line:'#151A40',hole:'#2A3170',mem:'rgba(42,49,112,.6)',out:1.2}:{out:1.2});
}

/* ---------- the dig site ---------- */
const dg=$('dig'),dx=dg.getContext('2d');
let DS=340,DIG=null,digPtr=false,digLast=null;
const GRID=36,BR=0.07;               // erase grid resolution, brush radius (fraction of the site)
function fitDig(){
  const r=dg.getBoundingClientRect();if(!r.width)return;
  const dpr=Math.min(window.devicePixelRatio||1,2.5),w=Math.round(r.width*dpr);
  DS=r.width;dx.setTransform(1,0,0,1,0,0);
  if(dg.width!==w){
    dg.width=dg.height=w;
    if(DIG){                          // keep the dug-out holes when the screen size changes
      const nc=document.createElement('canvas');nc.width=nc.height=w;
      nc.getContext('2d').drawImage(DIG.cov,0,0,w,w);DIG.cov=nc;DIG.covG=nc.getContext('2d');DIG.bed=makeBed(w);
    }
  }
  dx.setTransform(dpr,0,0,dpr,0,0);
}
new ResizeObserver(fitDig).observe(dg);
function makeCover(n){
  const c=document.createElement('canvas');c.width=c.height=n;const g=c.getContext('2d');
  const cols=['#9A6A3A','#8A5A2E','#B07D46','#7A4C26','#A87443','#6E4422','#94643A'];
  g.fillStyle=cols[0];g.fillRect(0,0,n,n);
  let y=n*0.05,i=0;
  while(y<n){                                   // wavy rock strata
    const ph=rnd(0,6),amp=n*rnd(0.006,0.02),fr=rnd(5,9);
    g.fillStyle=cols[i++%cols.length];g.beginPath();g.moveTo(0,n);
    for(let x=0;x<=n;x+=n/30)g.lineTo(x,y+Math.sin(x/n*fr+ph)*amp);
    g.lineTo(n,n);g.closePath();g.fill();y+=n*rnd(0.07,0.15);
  }
  for(let k=0;k<1800;k++){g.fillStyle=Math.random()<0.5?'rgba(0,0,0,.13)':'rgba(255,240,200,.12)';
    const s=n*rnd(0.002,0.006);g.fillRect(Math.random()*n,Math.random()*n,s,s);}
  for(let k=0;k<45;k++){const x=Math.random()*n,y2=n*rnd(0.08,1),rx=n*rnd(0.008,0.022),ry=rx*rnd(0.6,0.9);
    g.fillStyle=pick(['#8d8173','#a39482','#6f655a','#b5a58c']);g.beginPath();g.ellipse(x,y2,rx,ry,rnd(0,3),0,7);g.fill();
    g.strokeStyle='rgba(40,30,15,.45)';g.lineWidth=Math.max(1,n*0.002);g.stroke();
    g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(x-rx*0.3,y2-ry*0.35,rx*0.35,ry*0.25,0,0,7);g.fill();}
  g.strokeStyle='rgba(50,30,10,.35)';g.lineWidth=Math.max(1,n*0.002);
  for(let k=0;k<10;k++){let x=Math.random()*n,y2=n*rnd(0.06,0.35);g.beginPath();g.moveTo(x,y2);
    for(let s=0;s<5;s++){x+=n*rnd(-0.02,0.02);y2+=n*rnd(0.01,0.03);g.lineTo(x,y2);}g.stroke();}
  g.fillStyle='#4CAF50';g.beginPath();g.moveTo(0,0);g.lineTo(n,0);       // grass on top
  for(let x=n;x>=0;x-=n/40)g.lineTo(x,n*0.05+Math.sin(x/n*40)*n*0.006);g.closePath();g.fill();
  g.strokeStyle='#2E8B3A';g.lineWidth=Math.max(1.5,n*0.004);
  for(let k=0;k<90;k++){const x=Math.random()*n;g.beginPath();g.moveTo(x,n*0.05);g.lineTo(x+n*rnd(-0.01,0.01),n*rnd(0.005,0.035));g.stroke();}
  return c;
}
function makeBed(n){
  const c=document.createElement('canvas');c.width=c.height=n;const g=c.getContext('2d');
  const gr=g.createLinearGradient(0,0,0,n);gr.addColorStop(0,'#F1DFB2');gr.addColorStop(1,'#D8B97E');
  g.fillStyle=gr;g.fillRect(0,0,n,n);
  for(let k=0;k<1400;k++){g.fillStyle=Math.random()<0.6?'rgba(120,80,30,.12)':'rgba(255,255,255,.18)';
    const s=n*rnd(0.002,0.005);g.fillRect(Math.random()*n,Math.random()*n,s,s);}
  g.strokeStyle='rgba(150,110,50,.18)';g.lineWidth=Math.max(1,n*0.003);
  for(let k=0;k<6;k++){const y=n*rnd(0.1,0.95);g.beginPath();g.moveTo(0,y);
    for(let x=0;x<=n;x+=n/20)g.lineTo(x,y+Math.sin(x/n*6+k)*n*0.01);g.stroke();}
  return c;
}
function drawTreasure(g,k,x,y,s,rot){
  g.save();g.translate(x,y);g.rotate(rot);g.lineJoin='round';g.lineWidth=Math.max(1.5,s*0.08);g.strokeStyle='#3B2F1D';
  if(k==='amm'){g.fillStyle='#CDB68A';g.beginPath();g.arc(0,0,s,0,7);g.fill();g.stroke();
    g.beginPath();for(let a=0;a<6*Math.PI;a+=0.2){const r=s*a/(6*Math.PI);g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.stroke();
    for(let a=0;a<6.28;a+=0.45){g.beginPath();g.moveTo(Math.cos(a)*s*0.66,Math.sin(a)*s*0.66);g.lineTo(Math.cos(a)*s,Math.sin(a)*s);g.stroke();}}
  else if(k==='amber'){const gr=g.createRadialGradient(-s*0.3,-s*0.3,s*0.1,0,0,s);gr.addColorStop(0,'#FFD27A');gr.addColorStop(1,'#D9780F');
    g.fillStyle=gr;g.beginPath();g.ellipse(0,0,s,s*0.75,0,0,7);g.fill();g.stroke();
    g.fillStyle='#3B2F1D';g.beginPath();g.ellipse(0,0,s*0.22,s*0.12,0.4,0,7);g.fill();g.lineWidth=1;
    for(let i=-1;i<=1;i++){g.beginPath();g.moveTo(i*s*0.1,0);g.lineTo(i*s*0.2,s*0.24);g.moveTo(i*s*0.1,0);g.lineTo(i*s*0.2,-s*0.22);g.stroke();}
    g.fillStyle='rgba(255,255,255,.6)';g.beginPath();g.ellipse(-s*0.4,-s*0.35,s*0.22,s*0.1,-0.6,0,7);g.fill();}
  else if(k==='gem'){const P=[[0,-s],[s*0.62,-s*0.4],[s*0.62,s*0.5],[0,s],[-s*0.62,s*0.5],[-s*0.62,-s*0.4]];
    g.fillStyle='#A66BFF';g.beginPath();P.forEach((q,i)=>g[i?'lineTo':'moveTo'](q[0],q[1]));g.closePath();g.fill();g.stroke();
    g.fillStyle='#D2B4FF';g.beginPath();g.moveTo(0,-s);g.lineTo(s*0.62,-s*0.4);g.lineTo(0,-s*0.1);g.lineTo(-s*0.62,-s*0.4);g.closePath();g.fill();
    g.lineWidth=1;g.beginPath();g.moveTo(0,-s*0.1);g.lineTo(0,s);g.stroke();}
  else if(k==='tooth'){g.fillStyle='#B8986A';g.beginPath();g.moveTo(-s*0.7,-s*0.3);g.lineTo(-s*0.5,-s*0.7);g.lineTo(s*0.5,-s*0.7);g.lineTo(s*0.7,-s*0.3);g.closePath();g.fill();g.stroke();
    g.fillStyle='#FAF6EA';g.beginPath();g.moveTo(-s*0.62,-s*0.3);g.lineTo(s*0.62,-s*0.3);g.lineTo(0,s);g.closePath();g.fill();g.stroke();}
  else if(k==='tri'){g.fillStyle='#8E8A80';g.beginPath();g.ellipse(0,s*0.1,s*0.62,s*0.9,0,0,7);g.fill();g.stroke();
    g.beginPath();g.arc(0,-s*0.55,s*0.55,Math.PI,0);g.fill();g.stroke();g.lineWidth=1;
    for(let i=-3;i<=4;i++){g.beginPath();g.moveTo(-s*0.55,i*s*0.17);g.lineTo(s*0.55,i*s*0.17);g.stroke();}
    g.beginPath();g.moveTo(-s*0.2,-s*0.6);g.lineTo(-s*0.2,s*0.9);g.moveTo(s*0.2,-s*0.6);g.lineTo(s*0.2,s*0.9);g.stroke();}
  else{const gr=g.createLinearGradient(-s,-s,s,s);gr.addColorStop(0,'#FFE680');gr.addColorStop(1,'#C8930C');g.fillStyle=gr;
    g.beginPath();[[-s,-s*0.2],[-s*0.5,-s*0.8],[s*0.3,-s*0.7],[s,-s*0.1],[s*0.6,s*0.7],[-s*0.4,s*0.8]].forEach((q,i)=>g[i?'lineTo':'moveTo'](q[0],q[1]));
    g.closePath();g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.ellipse(-s*0.3,-s*0.35,s*0.25,s*0.1,-0.5,0,7);g.fill();}
  g.restore();
}
function drawStar(g,x,y,r,c,rot){
  g.save();g.translate(x,y);g.rotate(rot||0);g.beginPath();
  for(let i=0;i<10;i++){const rr=i%2?r*0.42:r,a=i*Math.PI/5;g[i?'lineTo':'moveTo'](Math.cos(a)*rr,Math.sin(a)*rr);}
  g.closePath();g.fillStyle=c;g.fill();g.lineWidth=1.5;g.strokeStyle='rgba(5,6,15,.6)';g.stroke();g.restore();
}
function shakeEl(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}

/* layout helpers: a part's transform L = {x,y (fraction of site), r (rad), sx,sy (scale)} */
function ptAt(pt,q,L){L=L||pt.L;const ux=(q[0]-pt.c[0])*L.sx,uy=(q[1]-pt.c[1])*L.sy,c=Math.cos(L.r),s=Math.sin(L.r);
  return [L.x+ux*c-uy*s,L.y+ux*s+uy*c];}
const inBox=(p,m)=>p[0]>m&&p[0]<1-m&&p[1]>m&&p[1]<1-m;
const allIn=pt=>pt.smp.every(q=>inBox(ptAt(pt,q),0.03));
function scatterOne(pt,K,at){
  const f=Math.random()<0.5?1:-1;
  for(let t=0;t<14;t++){
    const p=at&&t<4?at:[rnd(0.15,0.85),rnd(0.15,0.85)];
    pt.L={x:p[0],y:p[1],r:rnd(0,Math.PI*2),sx:f*K,sy:K};
    if(allIn(pt))return;
    if(t>5)K*=0.88;
  }
}
function layoutDig(parts,box,home){
  const kind=pick(['art','scatter','mixed']),f=Math.random()<0.5?1:-1;
  if(kind==='scatter'){
    const n=parts.length,cols=Math.ceil(Math.sqrt(n)),rows=Math.ceil(n/cols),cells=shuffle([...Array(cols*rows).keys()]);
    parts.forEach((pt,i)=>{const ci=cells[i];
      scatterOne(pt,home.K*0.72,[(ci%cols+0.5+rnd(-0.3,0.3))/cols,(Math.floor(ci/cols)+0.5+rnd(-0.3,0.3))/rows]);});
    return kind;
  }
  const bcx=(box[0]+box[2])/2,bcy=(box[1]+box[3])/2;
  let K=home.K*(kind==='art'?0.95:0.82),th=rnd(-0.35,0.35);
  for(let tries=0;tries<8;tries++){
    const cx=0.5+rnd(-0.06,0.06),cy=0.5+rnd(-0.06,0.06),c=Math.cos(th),s=Math.sin(th);
    parts.forEach(pt=>{const vx=f*(pt.c[0]-bcx)*K,vy=(pt.c[1]-bcy)*K;pt.L={x:cx+vx*c-vy*s,y:cy+vx*s+vy*c,r:th,sx:f*K,sy:K};});
    if(parts.every(allIn))break;
    K*=0.9;th*=0.7;
  }
  if(kind==='mixed'){                // a flood washed a few bones away
    shuffle(parts.filter(p=>['head','jaw','leg','tail','arm','wing','neck'].includes(p.k)))
      .slice(0,2+Math.floor(Math.random()*2)).forEach(pt=>scatterOne(pt,K*0.95));
  }
  return kind;
}
function chooseDino(){
  const unseen=DINOS.filter(d=>!found.includes(d.k));
  const pool=unseen.length?unseen:DINOS.filter(d=>d.k!==lastDino);
  return pick(pool);
}
function startDig(){
  digPtr=false;digLast=null;const sp=chooseDino();lastDino=sp.k;
  const {parts,box}=prepParts(sp);
  const K=Math.min(0.88/(box[2]-box[0]),0.7/(box[3]-box[1]));
  const home={K,ox:0.5-(box[0]+box[2])/2*K,oy:0.53-(box[1]+box[3])/2*K};
  parts.forEach(pt=>{pt.H={x:home.ox+pt.c[0]*K,y:home.oy+pt.c[1]*K,r:0,sx:K,sy:K};});
  layoutDig(parts,box,home);
  const smp=[];parts.forEach(pt=>pt.smp.forEach(q=>smp.push(ptAt(pt,q))));
  const tre=shuffle(TREASURES).slice(0,3).map(t=>{
    let p;for(let i=0;i<30;i++){p=[rnd(0.08,0.92),rnd(0.12,0.92)];if(smp.every(s=>Math.hypot(s[0]-p[0],s[1]-p[1])>0.07))break;}
    return {t,x:p[0],y:p[1],rot:rnd(-0.6,0.6),found:false};});
  showPane('digPlay');fitDig();
  const n=dg.width||600,now=performance.now();
  DIG={sp,parts,home,tre,grid:new Float32Array(GRID*GRID).fill(100),open:0,cov:makeCover(n),bed:makeBed(n),
       phase:'dig',lastFound:now,fx:[],hint:null,roarT:-9,done:false};
  DIG.covG=DIG.cov.getContext('2d');
  $('dinoCard').classList.remove('on');
  $('digPrompt').textContent={es:'Frota para excavar',en:'Rub to dig',de:'Reibe zum Graben'}[lang];
  boneCount(false);
  say({es:'¡A excavar! ¿Qué dinosaurio habrá?',en:'Let us dig! Which dinosaur is hiding?',de:'Lass uns graben! Welcher Dino versteckt sich?'}[lang]);
  requestAnimationFrame(digLoop);
}
function boneCount(pop){
  const D=DIG;if(!D)return;
  const el=$('boneCount');
  el.textContent='🦴 '+D.parts.filter(p=>p.found).length+'/'+D.parts.length+' '+D.tre.filter(t=>t.found).map(t=>t.t.ic).join('');
  if(pop){el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}
}
function digXY(e){const r=dg.getBoundingClientRect();return [(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height];}
dg.addEventListener('pointerdown',e=>{
  e.preventDefault();ac();if(!DIG)return;
  if(DIG.phase==='alive'){DIG.roarT=(performance.now()-DIG.aliveT)/1000;roar(DIG.sp.big);shakeEl(dg);return;}
  if(digPtr!==false&&digPtr!==e.pointerId)return;          // one finger digs; a second one is ignored
  try{dg.setPointerCapture(e.pointerId);}catch(_){}
  digPtr=e.pointerId;digLast=null;digStroke(digXY(e));
});
dg.addEventListener('pointermove',e=>{if(digPtr===false||e.pointerId!==digPtr)return;e.preventDefault();digStroke(digXY(e));});
['pointerup','pointercancel','pointerleave'].forEach(ev=>dg.addEventListener(ev,e=>{if(e.pointerId!==digPtr)return;digPtr=false;digLast=null;}));
function digStroke(p){
  if(!DIG||DIG.phase!=='dig')return;
  const pts=[];
  if(digLast){const d=Math.hypot(p[0]-digLast[0],p[1]-digLast[1]),n=Math.min(30,Math.ceil(d/(BR*0.35)));
    for(let i=1;i<=n;i++)pts.push([digLast[0]+(p[0]-digLast[0])*i/n,digLast[1]+(p[1]-digLast[1])*i/n]);}
  else pts.push(p);
  digLast=p;pts.forEach(stamp);
  if(Math.random()<0.3)beep(160+Math.random()*140,0,0.05,'sawtooth',0.04);
  checkFinds();
}
function stamp(p){
  const D=DIG,n=D.cov.width,g=D.covG,x=p[0]*n,y=p[1]*n,R=BR*n*1.15;
  g.save();g.globalCompositeOperation='destination-out';
  const gr=g.createRadialGradient(x,y,0,x,y,R);
  gr.addColorStop(0,'rgba(0,0,0,.11)');gr.addColorStop(.55,'rgba(0,0,0,.07)');gr.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=gr;g.beginPath();g.arc(x,y,R,0,7);g.fill();g.restore();
  const cw=1/GRID,i0=Math.max(0,Math.floor((p[0]-BR)/cw)),i1=Math.min(GRID-1,Math.floor((p[0]+BR)/cw)),
        j0=Math.max(0,Math.floor((p[1]-BR)/cw)),j1=Math.min(GRID-1,Math.floor((p[1]+BR)/cw));
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){
    const d=Math.hypot((i+0.5)*cw-p[0],(j+0.5)*cw-p[1]);if(d>BR)continue;
    const k=j*GRID+i;if(D.grid[k]<=0)continue;
    D.grid[k]-=12*(1-d/BR)+2.5;if(D.grid[k]<=0){D.grid[k]=0;D.open++;}
  }
  if(Math.random()<0.5)D.fx.push({k:'dust',x:p[0]+rnd(-0.02,0.02),y:p[1]+rnd(-0.02,0.02),vx:rnd(-0.004,0.004),vy:rnd(-0.008,-0.002),
    t:performance.now(),c:pick(['#8A5A2E','#B07D46','#6E4422','#C9A06A'])});
}
const isOpen=p=>{const i=Math.floor(p[0]*GRID),j=Math.floor(p[1]*GRID);
  if(i<0||j<0||i>=GRID||j>=GRID)return true;return DIG.grid[j*GRID+i]<30;};
function sparkle(x,y,n,col){const now=performance.now();
  for(let i=0;i<n;i++){const a=Math.random()*6.28,s=rnd(0.004,0.012);DIG.fx.push({k:'star',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:now,c:col});}}
function checkFinds(){
  const D=DIG,now=performance.now();let newly=null;
  D.parts.forEach(pt=>{if(pt.found)return;
    let o=0;pt.smp.forEach(q=>{if(isOpen(ptAt(pt,q)))o++;});
    if(o/pt.smp.length>=0.5){pt.found=true;pt.foundAt=now;newly=pt;sparkle(pt.L.x,pt.L.y,16,'#FFD400');}});
  D.tre.forEach(t=>{if(t.found)return;let o=0;
    [[0,0],[0.02,0],[-0.02,0],[0,0.02],[0,-0.02]].forEach(d=>{if(isOpen([t.x+d[0],t.y+d[1]]))o++;});
    if(o>=3){t.found=true;t.at=now;sparkle(t.x,t.y,22,'#7DF9FF');
      beep(1568,0,0.12,'triangle',0.18);beep(2093,0.1,0.25,'triangle',0.18);say(t.t[lang]);
      treasure[t.t.k]=(treasure[t.t.k]||0)+1;try{localStorage.setItem('sl_treasure',JSON.stringify(treasure));}catch(e){}
      boneCount(true);}});
  if(newly){D.lastFound=now;D.hint=null;chime();boneCount(true);
    if(D.parts.some(p=>!p.found))say(BONEWORD[newly.k][lang]);}
  if(D.parts.every(p=>p.found))finishDig();
  else if(D.open/(GRID*GRID)>0.8){D.parts.forEach(p=>{if(!p.found){p.found=true;p.foundAt=now;}});finishDig();}
}
function finishDig(){
  const D=DIG;if(D.phase!=='dig')return;
  D.phase='reveal';D.revealT=performance.now();
  sweep(300,1200,0.6,'triangle',0.12);
  say({es:'¡Lo encontraste todo!',en:'You found everything!',de:'Du hast alles gefunden!'}[lang]);
  $('digPrompt').textContent={es:'¡Mira cómo se monta!',en:'Watch it come together!',de:'Schau, wie er zusammenpasst!'}[lang];
}
function goAlive(){
  const D=DIG;D.phase='alive';D.aliveT=performance.now();D.roarT=0;D.done=true;
  roar(D.sp.big);shakeEl(dg);
  D.parts.forEach(pt=>sparkle(pt.H.x,pt.H.y,5,pick(['#FFD400','#FFFFFF','#7DF9FF'])));
  setTimeout(()=>{bigWin();rainEmoji(['🦴','⭐','🦖','🦕','✨'],24);},1200);
  const nm=D.sp[lang];
  $('dinoName').textContent=nm[0];$('dinoFact').textContent=nm[1];$('dinoCard').classList.add('on');
  $('digPrompt').textContent=D.sp.k==='ptera'
    ?{es:'¡Tócalo para que chille!',en:'Tap it to make it screech!',de:'Tippe, damit er kreischt!'}[lang]
    :{es:'¡Tócalo para que ruja!',en:'Tap it to make it roar!',de:'Tippe, damit er brüllt!'}[lang];
  if(!found.includes(D.sp.k)){found.push(D.sp.k);try{localStorage.setItem('sl_dinos',JSON.stringify(found));}catch(e){}}
  setTimeout(()=>say(nm[0]+'. '+nm[1]),1500);
}
const easeOut=t=>1-Math.pow(1-clamp01(t),3);
const easeBack=t=>{t=clamp01(t);const c=1.4,u=t-1;return 1+(c+1)*u*u*u+c*u*u;};
function aliveXf(D,now,W){
  const t=(now-D.aliveT)/1000,H=D.home,rt=t-D.roarT;
  const jaw=rt>=0&&rt<1.4?Math.sin(Math.PI*rt/1.4)*0.32:0;
  const ang={head:0.06*Math.sin(t*2.2)+jaw*0.35,neck:0.035*Math.sin(t*2.2-0.6),neck2:0.035*Math.sin(t*2.2-1.2),jaw:-jaw,
    tail:0.06*Math.sin(t*2.6),tail2:0.1*Math.sin(t*2.6-0.9),legA:0.16*Math.sin(t*4.2),legC:-0.16*Math.sin(t*4.2),
    arm:0.18*Math.sin(t*4.2+1),wing:0.28*Math.sin(t*5)};
  const bob=-Math.abs(Math.sin(t*4.2))*0.012,map={};D.parts.forEach(p=>map[p.n]=p);
  return (g,pt)=>{
    g.translate(H.ox*W,(H.oy+bob)*W);g.scale(H.K*W,H.K*W);
    const ch=[];let q=pt;while(q){ch.unshift(q);q=q.par?map[q.par]:null;}
    ch.forEach(c=>{const a=ang[c.an]||0;if(a){g.translate(c.pv[0],c.pv[1]);g.rotate(a);g.translate(-c.pv[0],-c.pv[1]);}});
    return H.K*W;
  };
}
function digLoop(now){
  if(!DIG||pane!=='digPlay'||activeTab!=='dig')return;
  const D=DIG,W=DS;
  // phase transitions + assembly motion
  if(D.phase==='reveal'&&now-D.revealT>700){D.phase='assemble';D.asmT=now;D.parts.forEach(pt=>{pt.S=Object.assign({},pt.L);pt.arr=false;});}
  if(D.phase==='assemble'){
    let all=true;
    D.parts.forEach((pt,i)=>{
      const t=clamp01((now-D.asmT-i*70)/900);
      if(t<1)all=false;else if(!pt.arr){pt.arr=true;beep(260+i*30,0,0.06,'square',0.08);}
      const S=pt.S,H=pt.H,e=easeBack(t),e2=easeOut(t);
      const dr=((H.r-S.r+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
      pt.L={x:S.x+(H.x-S.x)*e,y:S.y+(H.y-S.y)*e-Math.sin(Math.PI*t)*0.07,r:S.r+dr*e2,sx:S.sx+(H.sx-S.sx)*e2,sy:S.sy+(H.sy-S.sy)*e2};
    });
    if(all)goAlive();
  }
  dx.clearRect(0,0,W,W);
  dx.drawImage(D.bed,0,0,W,W);
  D.tre.forEach(t=>{const pop=t.found?Math.max(0,1-(now-t.at)/600):0;
    drawTreasure(dx,t.t.k,t.x*W,t.y*W,W*0.04*(1+pop*0.5),t.rot);});
  D.parts.forEach(pt=>{pt.glow=pt.foundAt&&now-pt.foundAt<1400?22*(1-(now-pt.foundAt)/1400)+4:0;});
  const xf=D.phase==='alive'?aliveXf(D,now,W):(g,pt)=>{const L=pt.L;
    g.translate(L.x*W,L.y*W);g.rotate(L.r);g.scale(L.sx*W,L.sy*W);g.translate(-pt.c[0],-pt.c[1]);return Math.abs(L.sy*W);};
  drawBones(dx,D.parts,xf);
  const ca=D.phase==='dig'?1:D.phase==='reveal'?1-(now-D.revealT)/700:0;
  if(ca>0){dx.globalAlpha=Math.max(0,ca);dx.drawImage(D.cov,0,0,W,W);dx.globalAlpha=1;}
  if(D.phase==='dig'){
    dx.save();dx.strokeStyle='rgba(255,255,255,.3)';dx.lineWidth=1;dx.setLineDash([5,5]);   // the site's string grid
    for(let i=1;i<4;i++){dx.beginPath();dx.moveTo(i*W/4,0);dx.lineTo(i*W/4,W);dx.moveTo(0,i*W/4);dx.lineTo(W,i*W/4);dx.stroke();}
    dx.restore();
    if(now-D.lastFound>8000){                 // stuck? a star twinkles over a hidden bone
      if(!D.hint||D.hint.found)D.hint=pick(D.parts.filter(p=>!p.found));
      if(D.hint){dx.save();dx.globalAlpha=0.55+0.45*Math.sin(now/180);
        drawStar(dx,D.hint.L.x*W,D.hint.L.y*W,W*0.05*(0.7+0.3*Math.sin(now/180)),'#FFF7AE',now/600);dx.restore();}
    }
  }
  D.fx=D.fx.filter(f=>now-f.t<(f.k==='dust'?600:1000));
  D.fx.forEach(f=>{const life=(now-f.t)/(f.k==='dust'?600:1000);f.x+=f.vx;f.y+=f.vy;dx.globalAlpha=Math.max(0,1-life);
    if(f.k==='dust'){f.vy+=0.0006;dx.fillStyle=f.c;dx.beginPath();dx.arc(f.x*W,f.y*W,W*0.006,0,7);dx.fill();}
    else{f.vx*=0.94;f.vy*=0.94;drawStar(dx,f.x*W,f.y*W,W*0.018*(1-life*0.5),f.c,now/200);}});
  dx.globalAlpha=1;
  requestAnimationFrame(digLoop);
}
quitGuard($('digQuit'));

/* =============================================================
   MEMORY PAIRS — every flip says the word, so it is vocabulary too
============================================================= */
let MEM=null;
function startMem(){
  const c=pick(['animal','food','vehic','toy','space','nature','thing','people','music','place']);
  const items=shuffle(VOCAB.filter(v=>v.c===c)).slice(0,6),deck=shuffle(items.concat(items));
  MEM={first:null,lock:false,left:items.length,total:items.length,done:false};
  const g=$('memGrid');g.innerHTML='';
  deck.forEach(it=>{
    const d=document.createElement('div');d.className='mem';
    d.innerHTML='<div class="in"><div class="b">⭐</div><div class="f"></div></div>';
    d.querySelector('.f').textContent=it.e;d.onclick=()=>memFlip(d,it);g.appendChild(d);
  });
  const p={es:'Busca las parejas',en:'Find the pairs',de:'Finde die Paare'}[lang];
  $('memPrompt').textContent='🃏 '+p;showPane('memPlay');say(p);
}
function memFlip(d,it){
  ac();if(!MEM||MEM.lock||d.classList.contains('flip'))return;
  d.classList.add('flip');beep(700,0,0.06,'triangle',0.12);say(it[lang][1]);
  if(!MEM.first){MEM.first={d,it};return;}
  const a=MEM.first;MEM.first=null;
  if(a.it.e===it.e){
    setTimeout(()=>{a.d.classList.add('ok');d.classList.add('ok');chime();say(it[lang].join(' '));},350);
    if(--MEM.left===0){const m=MEM;setTimeout(()=>{if(MEM===m)memWin();},1500);}
  }else{
    MEM.lock=true;
    setTimeout(()=>{a.d.classList.remove('flip');d.classList.remove('flip');if(MEM)MEM.lock=false;beep(300,0,0.08,'triangle',0.08);},1100);
  }
}
function memWin(){
  if(!MEM||pane!=='memPlay')return;
  MEM.done=true;bigWin();rainEmoji(['⭐','🎉','🃏','✨'],26);
  const w={es:'¡Lo has conseguido!',en:'You did it!',de:'Geschafft!'}[lang];
  $('memPrompt').textContent='🏆 '+w;say(w);
}

/* =============================================================
   BALLOONS — pop them; each one says what is painted on it
============================================================= */
const bc=$('bal'),bx=bc.getContext('2d');let BAL=null;
const BCOL=['#FF3B30','#FFD400','#00C2FF','#2ED17A','#FF8A00','#B65CFF','#FF5BA8'];
function fitCv(cn,g){
  const r=cn.getBoundingClientRect();if(!r.width)return null;const dpr=Math.min(window.devicePixelRatio||1,2.5);
  const w=Math.round(r.width*dpr),h=Math.round(r.height*dpr);
  if(cn.width!==w||cn.height!==h){cn.width=w;cn.height=h;}
  g.setTransform(dpr,0,0,dpr,0,0);return {W:r.width,H:r.height};
}
function darker(hex){const n=parseInt(hex.slice(1),16),f=0.6;
  return `rgb(${(n>>16&255)*f|0},${(n>>8&255)*f|0},${(n&255)*f|0})`;}
function startBal(){
  BAL={b:[],fx:[],pops:0,goal:20,next:0,done:false,last:0,clouds:[0,1,2].map(i=>({x:Math.random(),y:0.08+i*0.13,s:rnd(0.6,1.1),v:rnd(0.01,0.03)}))};
  showPane('balPlay');balText();
  say({es:'¡Explota los globos!',en:'Pop the balloons!',de:'Lass die Ballons platzen!'}[lang]);
  requestAnimationFrame(balLoop);
}
function balText(){$('balPrompt').textContent=BAL.done?'🏆 '+{es:'¡Genial!',en:'Great!',de:'Super!'}[lang]:'🎈 '+BAL.pops+' / '+BAL.goal;}
function cloud(g,x,y,s){g.fillStyle='rgba(255,255,255,.92)';
  [[0,0,1],[0.9,-0.35,1.2],[1.9,0,1],[0.9,0.25,1.1]].forEach(([a,b,r])=>{g.beginPath();g.arc(x+a*s*22,y+b*s*22,r*s*22,0,7);g.fill();});}
function balLoop(now){
  if(!BAL||pane!=='balPlay'||activeTab!=='dig')return;
  const s=fitCv(bc,bx);if(!s){requestAnimationFrame(balLoop);return;}
  const {W,H}=s,dt=BAL.last?Math.min(0.05,(now-BAL.last)/1000):0;BAL.last=now;
  const gr=bx.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#4FC3FF');gr.addColorStop(1,'#CFF3FF');
  bx.fillStyle=gr;bx.fillRect(0,0,W,H);
  bx.fillStyle='#FFE45C';bx.beginPath();bx.arc(W*0.85,H*0.1,W*0.07,0,7);bx.fill();
  BAL.clouds.forEach(c=>{c.x+=c.v*dt;if(c.x>1.25)c.x=-0.3;cloud(bx,c.x*W,c.y*H,c.s*W/400);});
  bx.fillStyle='#6CD45B';bx.beginPath();bx.ellipse(W*0.25,H*1.02,W*0.5,H*0.1,0,0,7);bx.fill();
  bx.fillStyle='#4DBA45';bx.beginPath();bx.ellipse(W*0.8,H*1.04,W*0.55,H*0.12,0,0,7);bx.fill();
  if(!BAL.done&&now>BAL.next&&BAL.b.length<4){
    BAL.next=now+rnd(1050,1600);const r=W*rnd(0.085,0.11);   // slow enough that each word can be heard
    BAL.b.push({x:rnd(r,W-r),y:H+r*1.6,r,vy:H*rnd(0.085,0.14),ph:rnd(0,6),c:pick(BCOL),
      it:pick(VOCAB.filter(v=>v.c!=='form')),gold:Math.random()<0.08});
  }
  BAL.b.forEach(b=>{b.y-=b.vy*dt*(BAL.done?2.5:1);b.ph+=dt*2;});
  BAL.b=BAL.b.filter(b=>b.y>-b.r*3);
  BAL.b.forEach(b=>{
    const x=b.x+Math.sin(b.ph)*b.r*0.25,y=b.y,r=b.r,col=b.gold?'#FFD400':b.c;b.dx=x;
    bx.strokeStyle='rgba(60,60,60,.7)';bx.lineWidth=1.5;bx.beginPath();bx.moveTo(x,y+r*1.18);
    for(let i=1;i<=6;i++)bx.lineTo(x+Math.sin(b.ph*1.3+i)*r*0.12,y+r*1.18+i*r*0.28);bx.stroke();
    const g2=bx.createRadialGradient(x-r*0.35,y-r*0.4,r*0.08,x,y,r*1.2);
    g2.addColorStop(0,'#fff');g2.addColorStop(0.2,col);g2.addColorStop(1,darker(col));
    bx.fillStyle=g2;bx.beginPath();bx.ellipse(x,y,r*0.88,r,0,0,7);bx.fill();bx.lineWidth=3;bx.strokeStyle='#05060F';bx.stroke();
    bx.fillStyle=col;bx.beginPath();bx.moveTo(x,y+r*0.98);bx.lineTo(x-r*0.12,y+r*1.18);bx.lineTo(x+r*0.12,y+r*1.18);bx.closePath();bx.fill();bx.stroke();
    bx.font=`${r*0.95}px serif`;bx.textAlign='center';bx.textBaseline='middle';bx.fillText(b.gold?'⭐':b.it.e,x,y+r*0.05);
  });
  if(BAL.queue&&BAL.queue.length){let busy=true;try{busy=speechSynthesis.speaking||speechSynthesis.pending;}catch(e){busy=false;}
    if(!busy&&now>(BAL.qt||0)){BAL.qt=now+400;say(BAL.queue.shift());}}
  BAL.fx=BAL.fx.filter(f=>now-f.t<900);
  BAL.fx.forEach(f=>{const life=(now-f.t)/900;bx.globalAlpha=1-life;
    if(f.txt){f.y+=f.vy*dt;bx.font=`${W*0.12*(1+life*0.4)}px serif`;bx.fillText(f.txt,f.x,f.y);}
    else{f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=500*dt;bx.fillStyle=f.c;bx.save();bx.translate(f.x,f.y);bx.rotate(life*8+f.r);
      bx.fillRect(-f.r,-f.r*0.5,f.r*2,f.r);bx.restore();}});
  bx.globalAlpha=1;
  requestAnimationFrame(balLoop);
}
bc.addEventListener('pointerdown',e=>{
  e.preventDefault();ac();if(!BAL)return;
  const r=bc.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  for(let i=BAL.b.length-1;i>=0;i--){const b=BAL.b[i],u=(x-b.dx)/(b.r*0.95),v=(y-b.y)/(b.r*1.05);
    if(u*u+v*v<=1.35){balPop(b,i);return;}}
});
/* words wait their turn: a new pop never cuts off the word still being spoken */
function balSay(w){
  let busy=false;try{busy=speechSynthesis.speaking||speechSynthesis.pending;}catch(e){}
  if(busy){BAL.queue=(BAL.queue||[]).concat(w).slice(-2);}else say(w);
}
function balPop(b,i){
  BAL.b.splice(i,1);popFx();const now=performance.now();
  for(let k=0;k<(b.gold?40:18);k++){const a=rnd(0,6.28),s=rnd(80,260);
    BAL.fx.push({x:b.dx,y:b.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,c:b.gold?pick(BCOL):b.c,t:now,r:rnd(3,7)});}
  BAL.fx.push({x:b.dx,y:b.y,txt:b.gold?'⭐':b.it.e,t:now,vy:-60});
  if(b.gold){BAL.pops+=3;chime();say({es:'¡Estrella de oro!',en:'Gold star!',de:'Goldstern!'}[lang]);}
  else{BAL.pops++;balSay(b.it[lang][1]);}
  if(!BAL.done&&BAL.pops>=BAL.goal){BAL.done=true;BAL.pops=BAL.goal;
    const bl=BAL;setTimeout(()=>{if(BAL!==bl||pane!=='balPlay'||activeTab!=='dig')return;BAL.queue=[];bigWin();rainEmoji(['🎈','🎉','⭐'],28);
      say({es:'¡Genial! ¡Todos los globos!',en:'Great! All the balloons!',de:'Super! Alle Ballons!'}[lang]);},1600);}
  balText();
}

/* =============================================================
   FIREWORKS — tap the sky
============================================================= */
const fwc=$('fw'),fwx=fwc.getContext('2d');let FW=null;
const FWC=['#FF3B30','#FFD400','#00D4FF','#2ED17A','#FF5BA8','#B65CFF','#FF8A00','#FFFFFF'];
function startFw(){
  const city=[];let x=0;while(x<1){const w=rnd(0.06,0.13);city.push({x,w,h:rnd(0.08,0.22),win:Math.random()});x+=w;}
  FW={rk:[],sp:[],shots:0,goal:20,done:false,fin:0,nextFin:0,last:0,clear:true,city,
      stars:Array.from({length:70},()=>({x:Math.random(),y:Math.random()*0.7,p:rnd(0,6)}))};
  showPane('fwPlay');fwText();
  say({es:'¡Toca el cielo!',en:'Tap the sky!',de:'Tippe in den Himmel!'}[lang]);
  requestAnimationFrame(fwLoop);
}
function fwText(){$('fwPrompt').textContent=FW.done?'🏆 '+{es:'¡Qué bonito!',en:'So pretty!',de:'Wie schön!'}[lang]:'🎆 '+Math.max(0,FW.goal-FW.shots);}
function launch(x,y,W,H){
  FW.rk.push({x0:x+rnd(-0.08,0.08)*W,y0:H,x,y:Math.min(y,H*0.68),t:0,dur:rnd(0.55,0.8),
    c:[pick(FWC),pick(FWC)],kind:pick(['peony','ring','heart','willow','double']),k:W/400});
  sweep(300,1400,0.5,'sine',0.06);
}
function explode(r){
  const n=r.kind==='heart'?64:84;boomFx();
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2;let vx,vy;
    if(r.kind==='heart'){vx=16*Math.pow(Math.sin(a),3)*9;vy=-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))*9;}
    else if(r.kind==='ring'){vx=Math.cos(a)*150;vy=Math.sin(a)*150;}
    else{const s=rnd(40,190);vx=Math.cos(a+rnd(-0.1,0.1))*s;vy=Math.sin(a+rnd(-0.1,0.1))*s;}
    const w=r.kind==='willow';
    FW.sp.push({x:r.x,y:r.y,px:r.x,py:r.y,vx:vx*r.k,vy:vy*r.k,c:r.kind==='double'&&i%2?r.c[1]:r.c[0],t:0,
      life:w?2.2:rnd(1.1,1.6),g:(w?90:60)*r.k,drag:w?0.97:0.985});}
}
function fwLoop(now){
  if(!FW||pane!=='fwPlay'||activeTab!=='dig')return;
  const s=fitCv(fwc,fwx);if(!s){requestAnimationFrame(fwLoop);return;}
  const {W,H}=s,dt=FW.last?Math.min(0.05,(now-FW.last)/1000):0;FW.last=now;
  fwx.globalCompositeOperation='source-over';
  if(FW.clear){const g=fwx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#050826');g.addColorStop(1,'#1B1E5E');
    fwx.fillStyle=g;fwx.fillRect(0,0,W,H);FW.clear=false;}
  fwx.fillStyle='rgba(8,10,40,.26)';fwx.fillRect(0,0,W,H);           // fading trails
  FW.stars.forEach(st=>{fwx.fillStyle=`rgba(255,255,255,${0.35+0.35*Math.sin(now/400+st.p)})`;fwx.fillRect(st.x*W,st.y*H,1.6,1.6);});
  if(FW.done&&FW.fin<12&&now>FW.nextFin){FW.fin++;FW.nextFin=now+260;launch(rnd(0.1,0.9)*W,rnd(0.12,0.5)*H,W,H);}
  fwx.globalCompositeOperation='lighter';
  FW.rk=FW.rk.filter(r=>{r.t+=dt;const p=clamp01(r.t/r.dur),e=1-Math.pow(1-p,2),x=r.x0+(r.x-r.x0)*e,y=r.y0+(r.y-r.y0)*e;
    fwx.fillStyle='#FFE9A8';fwx.beginPath();fwx.arc(x,y,2.6,0,7);fwx.fill();
    fwx.fillStyle='rgba(255,180,80,.6)';fwx.beginPath();fwx.arc(x+rnd(-2,2),y+6,1.6,0,7);fwx.fill();
    if(p>=1){r.x=x;r.y=y;explode(r);return false;}return true;});
  FW.sp=FW.sp.filter(p=>{p.t+=dt;if(p.t>p.life)return false;
    p.px=p.x;p.py=p.y;p.vx*=p.drag;p.vy=p.vy*p.drag+p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
    fwx.globalAlpha=1-p.t/p.life;fwx.strokeStyle=p.c;fwx.lineWidth=2.6;fwx.beginPath();fwx.moveTo(p.px,p.py);fwx.lineTo(p.x,p.y);fwx.stroke();
    return true;});
  fwx.globalAlpha=1;fwx.globalCompositeOperation='source-over';
  FW.city.forEach(b=>{const bx0=b.x*W,bw=b.w*W+1,bh=b.h*H;fwx.fillStyle='#0A0D24';fwx.fillRect(bx0,H-bh,bw,bh);
    fwx.fillStyle='rgba(255,214,90,.75)';
    for(let wy=H-bh+8;wy<H-6;wy+=12)for(let wx=bx0+5;wx<bx0+bw-6;wx+=10)if(((wx*7+wy*13)|0)%5<2+b.win)fwx.fillRect(wx,wy,4,5);});
  requestAnimationFrame(fwLoop);
}
fwc.addEventListener('pointerdown',e=>{
  e.preventDefault();ac();if(!FW||FW.done)return;
  const r=fwc.getBoundingClientRect();launch(e.clientX-r.left,e.clientY-r.top,r.width,r.height);
  FW.shots++;
  if(FW.shots>=FW.goal){FW.done=true;FW.nextFin=performance.now()+900;
    setTimeout(()=>{rainEmoji(['🎆','✨','⭐','🎇'],26);bigWin();
      say({es:'¡Qué bonito!',en:'So pretty!',de:'Wie schön!'}[lang]);},3800);}
  fwText();
});

/* =============================================================
   DIGGER — rub the ground and the excavator digs there; lift the
   finger and it tips the dirt into the dump truck. Five things are
   buried; find them all. A full truck drives off and a new one comes.
============================================================= */
const bgc=$('bag'),bgx=bgc.getContext('2d');let BAG=null;
const BURIED=[
 {ic:'🦴',de:'Ein Knochen!',en:'A bone!',es:'¡Un hueso!'},{ic:'🪙',de:'Eine Goldmünze!',en:'A gold coin!',es:'¡Una moneda de oro!'},
 {ic:'💎',de:'Ein Edelstein!',en:'A gem!',es:'¡Una piedra preciosa!'},{ic:'🥚',de:'Ein Dino-Ei!',en:'A dinosaur egg!',es:'¡Un huevo de dinosaurio!'},
 {ic:'🔑',de:'Ein alter Schlüssel!',en:'An old key!',es:'¡Una llave antigua!'},{ic:'🧸',de:'Ein Teddy!',en:'A teddy bear!',es:'¡Un osito!'},
 {ic:'🚗',de:'Ein Spielzeugauto!',en:'A toy car!',es:'¡Un coche de juguete!'},{ic:'🏺',de:'Eine alte Vase!',en:'An old vase!',es:'¡Un jarrón antiguo!'},
 {ic:'👑',de:'Eine Krone!',en:'A crown!',es:'¡Una corona!'},{ic:'🐚',de:'Eine Muschel!',en:'A shell!',es:'¡Una concha!'},
 {ic:'💍',de:'Ein Ring!',en:'A ring!',es:'¡Un anillo!'},{ic:'⚓',de:'Ein Anker!',en:'An anchor!',es:'¡Un ancla!'}];
const BG_G=0.3;                                     // ground level, as a share of the height
function bagSoil(W,H){const dpr=Math.min(window.devicePixelRatio||1,2.5),c=document.createElement('canvas');c.width=Math.round(W*dpr);c.height=Math.round(H*dpr);
  const g=c.getContext('2d');g.scale(dpr,dpr);const G=H*BG_G;
  [[G,H*0.47,'#8A5A3B'],[H*0.47,H*0.66,'#B0703E'],[H*0.66,H*0.84,'#7A4E33'],[H*0.84,H+2,'#6E6A72']].forEach(([a,b,col])=>{g.fillStyle=col;g.fillRect(0,a,W,b-a);});
  for(let i=0;i<260;i++){const y=G+Math.random()*(H-G),x=Math.random()*W;g.fillStyle=`rgba(${y>H*0.84?'255,255,255':'0,0,0'},${0.08+Math.random()*0.1})`;g.beginPath();g.arc(x,y,1+Math.random()*3,0,7);g.fill();}
  for(let i=0;i<14;i++){const x=Math.random()*W,y=H*(0.5+Math.random()*0.45);g.fillStyle='#9AA4B8';g.beginPath();g.ellipse(x,y,6+Math.random()*10,4+Math.random()*6,Math.random(),0,7);g.fill();}
  g.fillStyle='#6CC04A';g.fillRect(0,G-4,W,10);g.fillStyle='#57A83A';for(let x=0;x<W;x+=6){g.beginPath();g.moveTo(x,G-3);g.lineTo(x+3,G-10);g.lineTo(x+6,G-3);g.fill();}
  return {c,g,dpr};}
function startBag(){
  showPane('bagPlay');const s=fitCv(bgc,bgx),W=s?s.W:360,H=s?s.H:450;
  const pool=BURIED.filter(b=>typeof emojiOK!=='function'||emojiOK(b.ic)),items=shuffle(pool).slice(0,5),pos=[];
  items.forEach(()=>{let p;for(let i=0;i<60;i++){p=[rnd(0.1,0.9),rnd(0.44,0.9)];if(pos.every(q=>Math.hypot(q[0]-p[0],(q[1]-p[1])*1.3)>0.2))break;}pos.push(p);});
  BAG={W,H,soil:bagSoil(W,H),items:items.map((it,i)=>({it,x:pos[i][0],y:pos[i][1],found:false,t:0})),ex:0.2,tx:0.2,bk:null,touch:null,dug:0,
    dumpT:-1,load:0,truck:0.84,truckGo:0,done:false,last:0,fx:[],nextCheck:0,crunchT:0,lastFind:performance.now()};
  bagText();say({es:'¡Cava con la excavadora! Hay cinco cosas escondidas.',en:'Dig with the digger! Five things are hidden.',de:'Grab mit dem Bagger! Fünf Sachen sind versteckt.'}[lang]);
  requestAnimationFrame(bagLoop);}
function bagText(){const n=BAG.items.filter(i=>i.found).length;$('bagPrompt').textContent=BAG.done?'🏆 '+{es:'¡Todo encontrado!',en:'All found!',de:'Alles gefunden!'}[lang]:'🚜 '+n+' / '+BAG.items.length;}
function bagErase(x,y,r){const S=BAG.soil.g;S.save();S.globalCompositeOperation='destination-out';const gr=S.createRadialGradient(x,y,r*0.4,x,y,r);
  gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');S.fillStyle=gr;S.beginPath();S.arc(x,y,r,0,7);S.fill();S.restore();}
function bagCheck(now){const {W,H,soil}=BAG,d=soil.dpr;
  for(const it of BAG.items){if(it.found)continue;const cx=it.x*W,cy=it.y*H,r=W*0.04;let open=0;
    for(const [ox,oy] of [[0,0],[-r,0],[r,0],[0,-r],[0,r]]){const a=soil.g.getImageData(Math.round((cx+ox)*d),Math.round((cy+oy)*d),1,1).data[3];if(a<150)open++;}
    if(open>=3){it.found=true;it.t=now;BAG.lastFind=now;chime();say(it.it[lang]);for(let k=0;k<14;k++)BAG.fx.push({x:cx,y:cy,vx:rnd(-120,120),vy:rnd(-200,-60),t:now,c:pick(['#FFD400','#FFFFFF','#FF8A00'])});
      bagText();if(BAG.items.every(i=>i.found)){const bg=BAG;setTimeout(()=>{if(BAG===bg)bagWin();},1400);}}}}
function bagWin(){if(!BAG||pane!=='bagPlay'||BAG.done)return;BAG.done=true;bigWin();rainEmoji(BAG.items.map(i=>i.it.ic).concat(['⭐','🎉']),28);bagText();
  say({es:'¡Lo encontraste todo! ¡Eres un gran excavador!',en:'You found everything! You are a great digger!',de:'Du hast alles gefunden! Du bist ein toller Baggerfahrer!'}[lang]);}
function bagArm(W,H){const G=H*BG_G,bx=BAG.ex*W;return {P0:[bx+W*0.05,G-H*0.1],L1:H*0.36,L2:H*0.34};}
function bagLoop(now){
  if(!BAG||pane!=='bagPlay'||activeTab!=='dig')return;
  const s=fitCv(bgc,bgx);if(!s){requestAnimationFrame(bagLoop);return;}
  const W=BAG.W,H=BAG.H,g=bgx,G=H*BG_G,dt=BAG.last?Math.min(0.05,(now-BAG.last)/1000):0;BAG.last=now;
  g.save();g.scale(s.W/W,s.H/H);
  const sky=g.createLinearGradient(0,0,0,G);sky.addColorStop(0,'#5BC0F8');sky.addColorStop(1,'#CFF0FF');g.fillStyle=sky;g.fillRect(0,0,W,G);
  g.fillStyle='#FFE45C';g.beginPath();g.arc(W*0.12,H*0.07,W*0.05,0,7);g.fill();
  g.fillStyle='#4A3426';g.fillRect(0,G,W,H-G);
  for(const it of BAG.items){const pop=it.found?Math.min(1,(now-it.t)/500):0,sc=1+Math.sin(pop*Math.PI)*0.4;
    g.font=`${W*0.085*sc}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif`;g.textAlign='center';g.textBaseline='middle';
    if(it.found&&now-it.t>900){const u=Math.min(1,(now-it.t-900)/700),i=BAG.items.filter(j=>j.found&&j.t<=it.t).length-1,tx=W*0.62+i*W*0.075,ty=H*0.05;
      g.fillText(it.it.ic,it.x*W+(tx-it.x*W)*u,it.y*H+(ty-it.y*H)*u);}else g.fillText(it.it.ic,it.x*W,it.y*H);}
  g.drawImage(BAG.soil.c,0,0,W,H);
  if(now-BAG.lastFind>15000){const h=BAG.items.find(i=>!i.found);if(h){const p=0.5+0.5*Math.sin(now/200);g.globalAlpha=0.5+0.5*p;g.fillStyle='#FFE45C';
    g.beginPath();for(let k=0;k<10;k++){const an=-Math.PI/2+k*Math.PI/5,rr=(k%2?0.4:1)*W*(0.03+0.01*p);g.lineTo(h.x*W+Math.cos(an)*rr,h.y*H+Math.sin(an)*rr);}g.fill();g.globalAlpha=1;}}   // a sparkle helps after a while
  for(let i=0;i<BAG.items.length;i++){const x=W*0.62+i*W*0.075,y=H*0.05;g.strokeStyle='rgba(255,255,255,.8)';g.setLineDash([3,3]);g.lineWidth=2;g.strokeRect(x-W*0.032,y-W*0.032,W*0.064,W*0.064);g.setLineDash([]);}
  // truck: fills up, drives away when full, a new one comes
  if(BAG.truckGo){BAG.truck+=dt*0.5*BAG.truckGo;if(BAG.truck>1.3){BAG.truckGo=-1;BAG.load=0;BAG.truck=1.3;}if(BAG.truckGo<0&&BAG.truck<=0.84){BAG.truck=0.84;BAG.truckGo=0;beep(392,0,0.2,'square',0.06);beep(494,0.25,0.2,'square',0.06);}}
  const tx=BAG.truck*W,ty=G;g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.ellipse(tx,ty+2,W*0.12,5,0,0,7);g.fill();
  g.fillStyle='#E0661A';g.beginPath();g.moveTo(tx-W*0.12,ty-H*0.09);g.lineTo(tx+W*0.03,ty-H*0.09);g.lineTo(tx+W*0.02,ty-H*0.03);g.lineTo(tx-W*0.11,ty-H*0.03);g.closePath();g.fill();
  if(BAG.load){g.fillStyle='#8A5A3B';g.beginPath();g.ellipse(tx-W*0.045,ty-H*0.09,W*0.075,H*0.012+BAG.load*H*0.008,0,Math.PI,0);g.fill();}
  g.fillStyle='#FFC928';g.fillRect(tx+W*0.035,ty-H*0.085,W*0.06,H*0.06);g.fillStyle='#BFE6FA';g.fillRect(tx+W*0.05,ty-H*0.078,W*0.035,H*0.025);
  g.fillStyle='#3A3F52';g.fillRect(tx-W*0.12,ty-H*0.035,W*0.22,H*0.012);[tx-W*0.09,tx-W*0.04,tx+W*0.07].forEach(wx=>{g.fillStyle='#2B2D3A';g.beginPath();g.arc(wx,ty-H*0.015,W*0.022,0,7);g.fill();g.fillStyle='#C9CED8';g.beginPath();g.arc(wx,ty-H*0.015,W*0.009,0,7);g.fill();});
  // excavator drives towards the finger and reaches with its arm
  if(BAG.touch)BAG.tx=Math.max(0.06,Math.min(0.56,BAG.touch[0]/W-0.24));BAG.ex+=(BAG.tx-BAG.ex)*Math.min(1,dt*2.5);
  const {P0,L1,L2}=bagArm(W,H),rest=[P0[0]+W*0.16,G-H*0.04],dumpP=[tx-W*0.05,G-H*0.14];
  let want=rest;if(BAG.dumpT>=0){const u=(now-BAG.dumpT)/1000;want=u<1.1?dumpP:rest;
    if(u>0.7&&!BAG.dumped){BAG.dumped=true;BAG.load=Math.min(4,BAG.load+1);noise(0.4,0.15);for(let k=0;k<10;k++)BAG.fx.push({x:dumpP[0],y:dumpP[1],vx:rnd(-40,40),vy:rnd(0,60),t:now,c:'#8A5A3B'});
      if(BAG.load>=4)setTimeout(()=>{if(BAG){BAG.truckGo=1;beep(392,0,0.2,'square',0.06);beep(494,0.25,0.2,'square',0.06);}},500);}
    if(u>1.6)BAG.dumpT=-1;}
  else if(BAG.touch)want=BAG.touch;else if(BAG.pend)want=BAG.pend;
  if(!BAG.bk)BAG.bk=rest.slice();BAG.bk[0]+=(want[0]-BAG.bk[0])*Math.min(1,dt*10);BAG.bk[1]+=(want[1]-BAG.bk[1])*Math.min(1,dt*10);
  let dx=BAG.bk[0]-P0[0],dy=BAG.bk[1]-P0[1],d=Math.hypot(dx,dy);const maxR=(L1+L2)*0.98;if(d>maxR){BAG.bk=[P0[0]+dx/d*maxR,P0[1]+dy/d*maxR];dx=BAG.bk[0]-P0[0];dy=BAG.bk[1]-P0[1];d=maxR;}
  const a=Math.atan2(dy,dx),al=Math.acos(Math.max(-1,Math.min(1,(L1*L1+d*d-L2*L2)/(2*L1*d)))),E=[P0[0]+Math.cos(a-al)*L1,P0[1]+Math.sin(a-al)*L1];
  if(BAG.touch&&BAG.dumpT<0&&Math.hypot(BAG.bk[0]-BAG.touch[0],BAG.bk[1]-BAG.touch[1])<W*0.05&&BAG.bk[1]>G-4){
    bagErase(BAG.bk[0],BAG.bk[1]+W*0.02,W*0.065);BAG.dug+=dt;
    if(now>BAG.crunchT){BAG.crunchT=now+180;noise(0.08,0.12);BAG.fx.push({x:BAG.bk[0],y:BAG.bk[1],vx:rnd(-60,60),vy:rnd(-120,-40),t:now,c:'#8A5A3B'});}
    if(now>BAG.nextCheck){BAG.nextCheck=now+150;bagCheck(now);}}
  /* a quick tap also digs: the bucket goes there, takes one big scoop and tips it into the truck */
  if(BAG.pend&&!BAG.touch&&BAG.dumpT<0&&Math.hypot(BAG.bk[0]-BAG.pend[0],BAG.bk[1]-BAG.pend[1])<W*0.04){
    bagErase(BAG.pend[0],BAG.pend[1]+W*0.02,W*0.08);noise(0.15,0.15);bagCheck(now);BAG.pend=null;BAG.dumpT=now+250;BAG.dumped=false;}
  const bxp=BAG.ex*W;g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.ellipse(bxp+W*0.05,G+2,W*0.13,5,0,0,7);g.fill();
  g.fillStyle='#3A3F52';g.beginPath();g.roundRect?g.roundRect(bxp-W*0.07,G-H*0.035,W*0.24,H*0.035,H*0.017):g.rect(bxp-W*0.07,G-H*0.035,W*0.24,H*0.035);g.fill();
  for(let k=0;k<6;k++){g.fillStyle='#6E748A';g.beginPath();g.arc(bxp-W*0.05+k*W*0.04,G-H*0.017,W*0.012,0,7);g.fill();}
  g.fillStyle='#F2B21F';g.fillRect(bxp-W*0.06,G-H*0.085,W*0.2,H*0.05);g.fillStyle='#E0A21A';g.fillRect(bxp-W*0.07,G-H*0.075,W*0.04,H*0.04);
  g.fillStyle='#F2B21F';g.fillRect(bxp,G-H*0.15,W*0.08,H*0.07);g.fillStyle='#BFE6FA';g.fillRect(bxp+W*0.01,G-H*0.14,W*0.055,H*0.045);
  g.fillStyle='#F6D2B4';g.beginPath();g.arc(bxp+W*0.035,G-H*0.115,W*0.014,0,7);g.fill();g.fillStyle='#FFC928';g.fillRect(bxp+W*0.02,G-H*0.135,W*0.03,H*0.01);
  g.lineCap='round';g.strokeStyle='#E0A21A';g.lineWidth=W*0.03;g.beginPath();g.moveTo(P0[0],P0[1]);g.lineTo(E[0],E[1]);g.stroke();
  g.lineWidth=W*0.022;g.beginPath();g.moveTo(E[0],E[1]);g.lineTo(BAG.bk[0],BAG.bk[1]);g.stroke();g.lineCap='butt';
  g.fillStyle='#3A3F52';[P0,E].forEach(p=>{g.beginPath();g.arc(p[0],p[1],W*0.012,0,7);g.fill();});
  g.save();g.translate(BAG.bk[0],BAG.bk[1]);g.rotate(BAG.dumpT>=0&&(now-BAG.dumpT)/1000>0.6?-1.2:0.3);g.fillStyle='#5A6074';g.beginPath();g.moveTo(-W*0.03,-W*0.01);g.lineTo(W*0.035,-W*0.015);g.lineTo(W*0.03,W*0.035);g.lineTo(-W*0.02,W*0.03);g.closePath();g.fill();
  if(BAG.dug>0.15||(BAG.dumpT>=0&&!BAG.dumped)){g.fillStyle='#8A5A3B';g.beginPath();g.arc(0,-W*0.005,W*0.022,Math.PI,0);g.fill();}
  for(let k=0;k<3;k++){g.fillStyle='#C9CED8';g.fillRect(-W*0.02+k*W*0.018,W*0.03,W*0.008,W*0.012);}g.restore();
  BAG.fx=BAG.fx.filter(f=>now-f.t<900);BAG.fx.forEach(f=>{f.vy+=500*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;g.globalAlpha=1-(now-f.t)/900;g.fillStyle=f.c;g.fillRect(f.x-3,f.y-3,6,6);});g.globalAlpha=1;
  g.restore();requestAnimationFrame(bagLoop);}
const bagXY=e=>{const r=bgc.getBoundingClientRect();return [(e.clientX-r.left)/r.width*BAG.W,(e.clientY-r.top)/r.height*BAG.H];};
bgc.addEventListener('pointerdown',e=>{e.preventDefault();ac();if(!BAG||BAG.done||(BAG.touch&&BAG.pid!==e.pointerId))return;try{bgc.setPointerCapture(e.pointerId);}catch(_){}BAG.pid=e.pointerId;BAG.touch=bagXY(e);});
bgc.addEventListener('pointermove',e=>{if(!BAG||!BAG.touch||e.pointerId!==BAG.pid)return;e.preventDefault();BAG.touch=bagXY(e);});
['pointerup','pointercancel'].forEach(ev=>bgc.addEventListener(ev,e=>{if(!BAG||!BAG.touch||e.pointerId!==BAG.pid)return;const pt=BAG.touch;BAG.touch=null;
  if(BAG.dug>0.15&&BAG.dumpT<0){BAG.dumpT=performance.now();BAG.dumped=false;beep(110,0,0.4,'square',0.05);}
  else if(BAG.dug<0.05&&pt[1]>BAG.H*BG_G)BAG.pend=pt;BAG.dug=0;}));
