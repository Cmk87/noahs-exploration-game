/* =============================================================
   5. TRACING ENGINE
============================================================= */
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
let S=100,DPR=1,power=0;
try{power=Math.max(0,parseInt(localStorage.getItem('sl_power')||'0',10)||0);}catch(e){}
let mode='abc';                    // abc | ABC | 123 | words
let traceScreen='menu';            // menu first; play once he picks a card
let playlist=[],cur='a',strokeIdx=0,cpIdx=0,tracing=false,trail=[];
let nameIdx=0,kidName='',spokenPhrase='';
const t0=performance.now();
const HERO=['💥','⚡','🚀','🔥','🛡️','🏆','💪','🦖'];

function fit(){
  const r=cv.getBoundingClientRect(); if(!r.width) return;
  DPR=DPRX(3);
  cv.width=r.width*DPR;cv.height=r.height*DPR;S=r.width;
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
new ResizeObserver(fit).observe(cv);
const PAD=0.075;
const X=x=>S*(PAD+x/100*(1-2*PAD));
const Y=y=>S*(PAD+y/100*(1-2*PAD));
const tol=()=>S*0.115, startTol=()=>S*0.16;

function draw(){
  const now=performance.now(),beat=(now-t0)/1000;
  if(!S||!SHAPES[cur]){requestAnimationFrame(draw);return;}
  ctx.clearRect(0,0,S,S);
  ctx.save();ctx.translate(S/2,S/2);
  for(let i=0;i<28;i++){ctx.rotate(Math.PI*2/28);
    ctx.fillStyle=i%2?'rgba(27,42,91,.05)':'rgba(27,42,91,.02)';
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(S,-S*0.05);ctx.lineTo(S,S*0.05);ctx.fill();}
  ctx.restore();

  ctx.save();ctx.lineWidth=2;ctx.setLineDash([7,7]);ctx.strokeStyle='#C3CEEA';
  [12,38].forEach(y=>{ctx.beginPath();ctx.moveTo(S*0.05,Y(y));ctx.lineTo(S*0.95,Y(y));ctx.stroke();});
  ctx.setLineDash([]);ctx.strokeStyle='#8FA3D0';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(S*0.05,Y(78));ctx.lineTo(S*0.95,Y(78));ctx.stroke();ctx.restore();

  const d=SHAPES[cur];
  ctx.lineCap='round';ctx.lineJoin='round';
  d.pts.forEach(p=>{ctx.strokeStyle='#D6DDF0';ctx.lineWidth=S*0.14;poly(p,p.length-1);ctx.stroke();});
  for(let i=0;i<strokeIdx;i++) beam(d.pts[i],d.pts[i].length-1);

  if(strokeIdx<d.pts.length){
    const p=d.pts[strokeIdx];
    ctx.save();ctx.setLineDash([S*0.03,S*0.035]);ctx.lineDashOffset=-beat*S*0.09;
    ctx.strokeStyle='#1B2A5B';ctx.globalAlpha=.35;ctx.lineWidth=S*0.05;poly(p,p.length-1);ctx.stroke();ctx.restore();
    if(cpIdx>0) beam(p,cpIdx);
    if(cpIdx===0){bolt(X(p[0][0]),Y(p[0][1]),S*0.075*(1+0.12*Math.sin(beat*6)));arrow(p[0],p[4],beat);}
    else if(cpIdx<p.length){
      const t=p[cpIdx];
      ctx.save();ctx.shadowColor='#00D4FF';ctx.shadowBlur=S*0.05;
      ctx.beginPath();ctx.arc(X(t[0]),Y(t[1]),S*0.028*(1+0.25*Math.sin(beat*9)),0,7);
      ctx.fillStyle='#FFD400';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#05060F';ctx.stroke();ctx.restore();
    }
  }
  if(trail.length>1){
    ctx.lineWidth=S*0.05;ctx.strokeStyle='rgba(5,6,15,.18)';
    ctx.beginPath();ctx.moveTo(trail[0].x,trail[0].y);
    for(let i=1;i<trail.length;i++)ctx.lineTo(trail[i].x,trail[i].y);ctx.stroke();
  }
  drawConfetti(now);
  requestAnimationFrame(draw);
}
function poly(p,upto){ctx.beginPath();ctx.moveTo(X(p[0][0]),Y(p[0][1]));
  for(let i=1;i<=upto;i++)ctx.lineTo(X(p[i][0]),Y(p[i][1]));}
function beam(p,upto){
  ctx.save();
  ctx.strokeStyle='#05060F';ctx.lineWidth=S*0.135;poly(p,upto);ctx.stroke();
  const g=ctx.createLinearGradient(X(p[0][0]),Y(p[0][1]),X(p[upto][0]),Y(p[upto][1]));
  g.addColorStop(0,'#00D4FF');g.addColorStop(.55,'#3B6BFF');g.addColorStop(1,'#FFD400');
  ctx.shadowColor='rgba(0,212,255,.9)';ctx.shadowBlur=S*0.045;
  ctx.strokeStyle=g;ctx.lineWidth=S*0.10;poly(p,upto);ctx.stroke();
  ctx.shadowBlur=0;ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=S*0.022;poly(p,upto);ctx.stroke();
  ctx.restore();
}
function bolt(cx,cy,r){
  const pts=[[0,-1],[-.42,.12],[-.05,.12],[-.3,1],[.45,-.15],[.06,-.15],[.28,-1]];
  ctx.save();ctx.translate(cx,cy);ctx.beginPath();
  pts.forEach((p,i)=>ctx[i?'lineTo':'moveTo'](p[0]*r,p[1]*r));ctx.closePath();
  ctx.shadowColor='rgba(255,212,0,.95)';ctx.shadowBlur=r*0.9;ctx.fillStyle='#FFD400';ctx.fill();
  ctx.shadowBlur=0;ctx.lineWidth=4;ctx.strokeStyle='#05060F';ctx.stroke();ctx.restore();
}
function arrow(a,b,beat){
  const ax=X(a[0]),ay=Y(a[1]),ang=Math.atan2(Y(b[1])-ay,X(b[0])-ax);
  const k=S*0.115+Math.sin(beat*6)*S*0.014;
  ctx.save();ctx.translate(ax+Math.cos(ang)*k,ay+Math.sin(ang)*k);ctx.rotate(ang);
  ctx.beginPath();ctx.moveTo(S*0.032,0);ctx.lineTo(-S*0.02,S*0.024);ctx.lineTo(-S*0.02,-S*0.024);ctx.closePath();
  ctx.fillStyle='#FF3B30';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#05060F';ctx.stroke();ctx.restore();
}
let conf=[];
function boom(n=110,ox=S/2,oy=S/2,spread=1){
  for(let i=0;i<n;i++) conf.push({x:ox,y:oy,
    vx:(Math.random()-.5)*S*0.024*spread,vy:(Math.random()-.95)*S*0.026*spread,
    c:['#FFD400','#FF3B30','#00D4FF','#3B6BFF','#FFFFFF','#FF8A00'][i%6],
    r:S*0.016+Math.random()*S*0.016,face:i%4===0?HERO[Math.floor(Math.random()*HERO.length)]:null,
    size:S*0.045+Math.random()*S*0.035,a:Math.random()*7,spin:(Math.random()-.5)*.32,born:performance.now()});
}
function drawConfetti(now){
  conf=conf.filter(p=>now-p.born<2600&&p.y<S*1.3);
  ctx.textAlign='center';ctx.textBaseline='middle';
  conf.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=S*0.0007;p.vx*=0.995;p.a+=p.spin;
    const life=(now-p.born)/2600;
    ctx.save();ctx.globalAlpha=Math.max(0,1-life*life);ctx.translate(p.x,p.y);ctx.rotate(p.a);
    if(p.face){ctx.font=p.size+'px serif';ctx.fillText(p.face,0,0);}
    else{ctx.fillStyle=p.c;ctx.strokeStyle='#05060F';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(0,-p.r);ctx.lineTo(p.r*.6,0);ctx.lineTo(0,p.r*.8);ctx.lineTo(-p.r*.6,0);
      ctx.closePath();ctx.fill();ctx.stroke();}
    ctx.restore();
  });
  ctx.globalAlpha=1;
}
function pos(e){const r=cv.getBoundingClientRect();const t=e.touches?e.touches[0]:e;
  return {x:t.clientX-r.left,y:t.clientY-r.top};}
const near=(p,cp,rad)=>Math.hypot(p.x-X(cp[0]),p.y-Y(cp[1]))<rad;

cv.addEventListener('pointerdown',e=>{
  e.preventDefault();ac();
  const d=SHAPES[cur];if(!d)return;const path=d.pts[strokeIdx];if(!path)return;
  const p=pos(e);
  if(cpIdx===0){
    if(near(p,path[0],startTol())){
      tracing=true;cpIdx=1;trail=[p];blip();
      while(cpIdx<path.length&&near(p,path[cpIdx],tol()))cpIdx++;
      if(cpIdx>=path.length)finishStroke();
    }else{nope();shake();}
  }else if(near(p,path[cpIdx-1],startTol()*1.2)){tracing=true;trail=[p];}
  else{nope();shake();}
});
cv.addEventListener('pointermove',e=>{
  if(!tracing)return;e.preventDefault();
  const p=pos(e);trail.push(p);if(trail.length>60)trail.shift();
  const path=SHAPES[cur].pts[strokeIdx];if(!path)return;
  let hit=false;
  while(cpIdx<path.length&&near(p,path[cpIdx],tol())){cpIdx++;hit=true;}
  if(hit&&cpIdx%4===0)blip();
  if(cpIdx>=path.length)finishStroke();
});
['pointerup','pointercancel','pointerleave'].forEach(ev=>
  cv.addEventListener(ev,()=>{tracing=false;trail=[];}));
function shake(){const w=document.getElementById('wrap');
  w.classList.remove('shake');void w.offsetWidth;w.classList.add('shake');}

function finishStroke(){
  tracing=false;trail=[];
  const path=SHAPES[cur].pts[strokeIdx],last=path[path.length-1];
  strokeIdx++;cpIdx=0;
  if(strokeIdx>=SHAPES[cur].pts.length) finishItem();
  else{strokeDone();boom(26,X(last[0]),Y(last[1]),.6);}
}
function finishItem(){
  /* a word is one picture: each letter just moves on, and the party waits
     until the whole word is written */
  if(mode==='words'&&nameIdx<playlist.length-1){
    strokeDone();boom(34);
    nameIdx++;
    loadItem(playlist[nameIdx],false);
    setTimeout(()=>{if(activeTab==='trace'&&mode==='words'&&traceScreen==='play')say(letterSpoken(cur));},220);
    return;
  }
  bigWin();boom();
  setTimeout(()=>boom(70,S*0.25,S*0.58,.9),240);
  setTimeout(()=>boom(70,S*0.75,S*0.58,.9),440);
  addPower(3);mascot('cheer');advTick('trace');

  const faceEl=document.getElementById('face'),wordEl=document.getElementById('wordText');
  faceEl.classList.remove('small');

  if(mode==='123'){
    const n=parseInt(cur,10);
    faceEl.textContent=cur;                 // just the numeral, nothing to decode
    wordEl.textContent=NUMWORD[lang][n];
    spokenPhrase=NUMWORD[lang][n]; say(spokenPhrase);
  }else if(mode==='words'){
    faceEl.textContent=writeCur.e;
    wordEl.textContent=writeCur[lang];
    spokenPhrase=writeCur[lang]; say(spokenPhrase);
    rainEmoji([writeCur.e,'⭐','✨'],18);
  }else{
    const key=cur.toLowerCase();
    const w=(LETTERWORD[lang]&&LETTERWORD[lang][key])||['⭐',key];
    faceEl.textContent=w[0];
    wordEl.textContent=cur+' · '+w[1];
    spokenPhrase = lang==='es'?`${letterSpoken(cur)} de ${w[1]}`
      :lang==='de'?`${letterSpoken(cur)} wie ${w[1]}`:`${letterSpoken(cur)} for ${w[1]}`;
    say(spokenPhrase);
  }
  document.getElementById('praise').style.display='flex';
  /* Hold just long enough for the phrase being spoken. A flat delay either
     clipped "i griega de yate" or left three seconds of dead air after "a".
     ~170ms per character at rate 0.72, plus engine start-up, clamped. */
  const hold=Math.max(2400,Math.min(3600,300+(spokenPhrase||'').length*190));
  clearTimeout(holdT);holdT=setTimeout(()=>{document.getElementById('praise').style.display='none';advance();},hold);
}
function letterSpoken(ch){
  if(mode==='123') return NUMWORD[lang][parseInt(ch,10)];
  const c=ch.toLowerCase();
  const ES={a:'a',b:'be',c:'ce',d:'de',e:'e',f:'efe',g:'ge',h:'hache',i:'i',j:'jota',k:'ka',l:'ele',m:'eme',
    n:'ene','ñ':'eñe',o:'o',p:'pe',q:'cu',r:'erre',s:'ese',t:'te',u:'u',v:'uve',w:'uve doble',x:'equis',
    y:'i griega',z:'zeta'};
  const EN={a:'ay',b:'bee',c:'see',d:'dee',e:'ee',f:'eff',g:'jee',h:'aitch',i:'eye',j:'jay',k:'kay',l:'el',
    m:'em',n:'en','ñ':'enyay',o:'oh',p:'pee',q:'cue',r:'ar',s:'ess',t:'tee',u:'you',v:'vee',w:'double you',
    x:'ex',y:'why',z:'zee'};
  if(lang==='de') return c;                 // German engines read the bare letter correctly
  return (lang==='es'?ES[c]:EN[c])||c;
}
function sayCurrent(){
  if(traceScreen!=='play') return;
  if(mode==='words'&&writeCur) say(writeCur[lang]);
  else say(letterSpoken(cur));
}

function resetTrace(){strokeIdx=0;cpIdx=0;trail=[];tracing=false;}
let holdT=null;              // the praise pause; a letter picked during it wins over the automatic next one
function loadItem(k,speak){clearTimeout(holdT);document.getElementById('praise').style.display='none';cur=k;resetTrace();buildBar();if(speak)sayCurrent();}
const sayHere=()=>{if(activeTab==='trace'&&traceScreen==='play')sayCurrent();};
function advance(){
  if(mode==='words'){
    nameIdx++;
    if(nameIdx>=playlist.length){writeFresh(activeTab==='trace'&&traceScreen==='play');return;}
    loadItem(playlist[nameIdx],false);
    setTimeout(()=>{if(activeTab==='trace'&&mode==='words'&&traceScreen==='play')say(letterSpoken(cur));},250);
    return;
  }
  const i=playlist.indexOf(cur);
  loadItem(playlist[(i+1)%playlist.length],false);
  setTimeout(sayHere,250);
}
function buildBar(){
  const bar=document.getElementById('letterbar');bar.innerHTML='';
  const seq=mode==='words';
  playlist.forEach((k,idx)=>{
    const b=document.createElement('button');
    b.textContent=k;
    if(seq?idx===nameIdx:k===cur) b.className='on';
    b.onclick=()=>{
      ac();
      if(seq)nameIdx=idx;
      loadItem(k,mode!=='words');
      if(mode==='words')say(letterSpoken(k));
    };
    bar.appendChild(b);
    if(seq?idx===nameIdx:k===cur)
      setTimeout(()=>{try{bar.scrollTo({left:b.offsetLeft-bar.clientWidth/2+b.offsetWidth/2,behavior:'smooth'});}catch(e){}},0);
  });
  if(mode==='words')renderWordHead();
}
function setMode(m){
  clearTimeout(holdT);document.getElementById('praise').style.display='none';
  if(m!=='abc'&&m!=='ABC'&&m!=='123'&&m!=='words') m='abc';
  mode=m;nameIdx=0;
  if(m==='ABC') playlist=CAPS[lang];
  else if(m==='123') playlist=DIGITS;
  else if(m==='words'){
    if(!writeCur||!writeWordOk(writeCur[lang])) writeCur=nextWriteWord(writeCur);
    playlist=[...writeCur[lang]];
  }else playlist=ALPHA[lang];
  const v=document.getElementById('v-trace');
  if(v) v.classList.toggle('words',m==='words');
  setTraceIcon(m);
  loadItem(playlist[0],activeTab==='trace'&&traceScreen==='play');
}

/* The writing menu: four equal cards, same idea as the home screen. */
const TRACE_MODES=[
  {id:'words',icon:'✏️',es:'Palabras',en:'Words',de:'Wörter',bg:['#FFB938','#FF8A3D'],ex:'🐱🐶☀️'},
  {id:'abc',icon:'abc',es:'Minúsculas',en:'Lowercase',de:'Kleinbuchstaben',bg:['#FF8A8A','#E8455C']},
  {id:'ABC',icon:'ABC',es:'Mayúsculas',en:'Uppercase',de:'Großbuchstaben',bg:['#7EB6FF','#3A6FE0']},
  {id:'123',icon:'123',es:'Números',en:'Numbers',de:'Zahlen',bg:['#6FD86A','#2EA84F']}
];
const TRACE_ASK={es:'¿Qué escribimos?',en:'What shall we write?',de:'Was schreibst du?'};
const TRACE_BACK={es:'Volver',en:'Back',de:'Zurück'};
const FLAG_NAME={es:'Español',en:'English',de:'Deutsch'};
function letterIcon(icon){return icon.length<=3&&/[a-z0-9]/i.test(icon);}
function setTraceIcon(m){
  const t=TRACE_MODES.find(x=>x.id===m),el=document.getElementById('traceModeIcon');
  if(!el)return;
  el.textContent=t?t.icon:'';
  el.classList.toggle('letters',!!(t&&letterIcon(t.icon)));
  const back=document.getElementById('traceBack');
  if(back) back.setAttribute('aria-label',TRACE_BACK[lang]);
}
function renderTraceMenu(){
  const hello=document.getElementById('traceHello'),grid=document.getElementById('traceGrid');
  if(!hello||!grid)return;
  hello.textContent=TRACE_ASK[lang];
  grid.innerHTML='';
  TRACE_MODES.forEach(t=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='wcard'+(t.wide?' wide':'');
    b.dataset.mode=t.id;
    b.style.background=`linear-gradient(150deg,${t.bg[0]},${t.bg[1]})`;
    b.style.setProperty('--edge',t.bg[1]);
    b.setAttribute('aria-label',t[lang]);
    const icon=document.createElement('span');
    icon.className='wi'+(letterIcon(t.icon)?' letters':'');
    icon.textContent=t.icon;
    const lab=document.createElement('span');
    lab.className='wl';lab.textContent=t[lang];
    b.append(icon,lab);
    if(t.ex){const ex=document.createElement('span');ex.className='wex';ex.textContent=t.ex;b.append(ex);}
    b.onclick=()=>{ac();enterTrace(t.id);};
    grid.appendChild(b);
  });
}
function showTrace(speak){
  clearTimeout(holdT);
  const p=document.getElementById('praise');if(p)p.style.display='none';
  tracing=false;trail=[];
  traceScreen='menu';
  const v=document.getElementById('v-trace');if(v)v.classList.remove('words');
  document.getElementById('traceMenu').classList.add('on');
  document.getElementById('tracePlay').classList.remove('on');
  renderTraceMenu();
  if(speak) say(TRACE_ASK[lang]);
}
function enterTrace(m){
  traceScreen='play';
  document.getElementById('traceMenu').classList.remove('on');
  document.getElementById('tracePlay').classList.add('on');
  setMode(m);
  requestAnimationFrame(fit);
}
function renderWordFlags(){
  const box=document.getElementById('wordFlags');if(!box)return;
  box.innerHTML='';
  if(mode!=='words')return;
  ['es','en','de'].filter(c=>LANGS_ON.includes(c)).forEach(c=>{
    const b=document.createElement('button');
    b.type='button';b.className='wflag'+(c===lang?' on':'');b.dataset.lang=c;
    b.textContent=BRIDGE_MARK[c];
    b.setAttribute('aria-label',FLAG_NAME[c]);
    b.onclick=()=>{ac();if(c!==lang)setLang(c,document.getElementById(c));else if(writeCur)say(writeCur[lang]);};
    box.appendChild(b);
  });
}
function renderWordHead(){
  if(mode!=='words'||!writeCur){renderWordFlags();return;}
  const emo=document.getElementById('wordEmoji');if(emo)emo.textContent=writeCur.e;
  const box=document.getElementById('wordSpell');if(!box)return;
  box.innerHTML='';
  playlist.forEach((ch,idx)=>{
    const b=document.createElement('button');
    b.type='button';b.textContent=ch;
    b.className=(idx<nameIdx?'done ':'')+(idx===nameIdx?'on':'');
    b.setAttribute('aria-label',ch);
    b.onclick=()=>{ac();nameIdx=idx;loadItem(playlist[idx],false);say(letterSpoken(ch));};
    box.appendChild(b);
  });
  renderWordFlags();
}
/* the same picture, spelled in the language he just picked, from the first letter */
function writeFresh(speak){
  writeCur=nextWriteWord(writeCur);
  nameIdx=0;
  playlist=[...writeCur[lang]];
  loadItem(playlist[0],false);
  if(speak) say(writeCur[lang]);
}
document.getElementById('traceBack').onclick=()=>{ac();showTrace(false);};
