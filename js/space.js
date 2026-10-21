/* =============================================================
   Top-down orrery. Real orbits, but with the distances compressed
   so the outer planets aren't off-screen — the ordering and the
   relative speeds (inner planets race, Neptune crawls) are honest.
   Drag to pan, pinch or use +/- to zoom, tap a planet to hear it.
============================================================= */
const PLANETS=[
 {sun:1,orb:0,   size:0.62,per:0,   col:'#FFB612',col2:'#FFF3B0',
  es:['el Sol','El Sol es una estrella gigante.'],
  en:['the Sun','The Sun is a giant star.'],
  de:['die Sonne','Die Sonne ist ein riesiger Stern.']},
 {orb:1.30, size:0.13,per:0.24,col:'#9E9188',col2:'#D3C9C0',
  es:['Mercurio','Es el más pequeño y el más rápido.'],
  en:['Mercury','It is the smallest and the fastest.'],
  de:['Merkur','Er ist der kleinste und der schnellste.']},
 {orb:1.95, size:0.20,per:0.62,col:'#D9954A',col2:'#F7DCA9',
  es:['Venus','Es el planeta más caliente.'],
  en:['Venus','It is the hottest planet.'],
  de:['Venus','Sie ist der heißeste Planet.']},
 {orb:2.65, size:0.21,per:1.00,col:'#2E6FC4',col2:'#84CDEA',earth:1,moon:1,
  es:['la Tierra','Aquí vivimos nosotros.'],
  en:['Earth','This is where we live.'],
  de:['die Erde','Hier leben wir.']},
 {orb:3.40, size:0.17,per:1.88,col:'#B24328',col2:'#EB8A62',
  es:['Marte','Es el planeta rojo.'],
  en:['Mars','It is the red planet.'],
  de:['der Mars','Er ist der rote Planet.']},
 {orb:4.60, size:0.44,per:11.9,col:'#C68A52',col2:'#EFCC9E',bands:1,
  es:['Júpiter','Es el planeta más grande.'],
  en:['Jupiter','It is the biggest planet.'],
  de:['der Jupiter','Er ist der größte Planet.']},
 {orb:5.80, size:0.38,per:29.5,col:'#D4B978',col2:'#F5E7BE',ring:1,bands:1,
  es:['Saturno','Tiene anillos de hielo.'],
  en:['Saturn','It has rings made of ice.'],
  de:['der Saturn','Er hat Ringe aus Eis.']},
 {orb:6.90, size:0.29,per:84,  col:'#79C6CE',col2:'#C6EFF2',
  es:['Urano','Gira tumbado de lado.'],
  en:['Uranus','It spins on its side.'],
  de:['der Uranus','Er dreht sich auf der Seite.']},
 {orb:7.95, size:0.28,per:165, col:'#2F55B8',col2:'#87A3EC',
  es:['Neptuno','Es el más lejano y muy ventoso.'],
  en:['Neptune','It is the farthest away and very windy.'],
  de:['der Neptun','Er ist am weitesten weg und sehr windig.']}
];
const BELT={inner:3.85,outer:4.20};

const sky=document.getElementById('sky'),sx=sky.getContext('2d');
let SS=340, selected=0, spaceQuiz=false, spaceTargetIdx=-1, stars=[];
let zoom=1, camX=0, camY=0, paused=false;
let clock=0, lastT=performance.now();
const MINZ=0.55, MAXZ=7;

function fitSky(){
  const r=sky.getBoundingClientRect(); if(!r.width) return;
  const dpr=DPRX(3);
  SS=r.width; sky.width=SS*dpr; sky.height=SS*dpr;
  sx.setTransform(dpr,0,0,dpr,0,0);
  if(!stars.length) for(let i=0;i<110;i++)
    stars.push({x:Math.random()*2-1,y:Math.random()*2-1,s:Math.random()*1.5+0.4,t:Math.random()*7});
}
new ResizeObserver(fitSky).observe(sky);

const baseScale=()=>SS/18;                 // fits Neptune's orbit at zoom 1
const w2s=(wx,wy)=>{const k=baseScale()*zoom;
  return {x:SS/2+(wx-camX)*k, y:SS/2+(wy-camY)*k*0.82};};   // slight tilt
const worldR=r=>r*baseScale()*zoom;
/* Real periods span 0.24 to 165 years — at true ratios Neptune would look
   frozen. Compressing with ^0.6 keeps the ordering (inner fast, outer slow)
   while letting every planet visibly move: Earth laps in 12s, Neptune ~4min. */
const periodSecs=p=>Math.pow(p.per,0.6)*12;
function angleOf(p,i){ return p.per? clock*(2*Math.PI/periodSecs(p))+i*1.9 : 0; }
function bodyPos(i){
  const p=PLANETS[i];
  if(p.sun) return {x:0,y:0};
  const a=angleOf(p,i);
  return {x:Math.cos(a)*p.orb, y:Math.sin(a)*p.orb};
}

function drawSky(){
  const now=performance.now(); const dt=(now-lastT)/1000; lastT=now;
  if(!paused) clock+=dt;
  if(!SS){requestAnimationFrame(drawSky);return;}
  sx.clearRect(0,0,SS,SS);
  sx.fillStyle='#040718'; sx.fillRect(0,0,SS,SS);

  stars.forEach(s=>{                        // parallax starfield
    const p=w2s(s.x*11+camX*0.75, s.y*11+camY*0.75);
    if(p.x<0||p.x>SS||p.y<0||p.y>SS)return;
    sx.globalAlpha=.3+.5*Math.abs(Math.sin(now/1000*1.4+s.t));
    sx.fillStyle='#fff';sx.beginPath();sx.arc(p.x,p.y,s.s,0,7);sx.fill();
  });
  sx.globalAlpha=1;

  const c=w2s(0,0), k=baseScale()*zoom;
  PLANETS.forEach(p=>{                      // orbit rings
    if(p.sun)return;
    sx.strokeStyle='rgba(255,255,255,.15)';sx.lineWidth=1;
    sx.beginPath();sx.ellipse(c.x,c.y,p.orb*k,p.orb*k*0.82,0,0,7);sx.stroke();
  });
  sx.globalAlpha=.6;                        // asteroid belt
  for(let i=0;i<90;i++){
    const a=i*2.399, rr=BELT.inner+((i*37)%100)/100*(BELT.outer-BELT.inner);
    const q=w2s(Math.cos(a)*rr,Math.sin(a)*rr);
    sx.fillStyle='#9a9a9a';sx.beginPath();sx.arc(q.x,q.y,Math.max(0.7,1.1*zoom*0.6),0,7);sx.fill();
  }
  sx.globalAlpha=1;

  PLANETS.forEach((p,i)=>drawBody(i,now));
  requestAnimationFrame(drawSky);
}
function drawBody(i,now){
  const p=PLANETS[i], wp=bodyPos(i), q=w2s(wp.x,wp.y);
  let r=worldR(p.size); r=Math.max(r,p.sun?9:3.2);
  if(q.x<-80||q.x>SS+80||q.y<-80||q.y>SS+80) return;

  if(p.ring){
    sx.save();sx.translate(q.x,q.y);sx.rotate(-0.35);
    sx.strokeStyle='rgba(226,205,150,.9)';sx.lineWidth=Math.max(1,r*0.30);
    sx.beginPath();sx.ellipse(0,0,r*1.9,r*0.6,0,Math.PI,Math.PI*2);sx.stroke();sx.restore();
  }
  if(p.sun){
    const g=sx.createRadialGradient(q.x,q.y,r*0.1,q.x,q.y,r);
    g.addColorStop(0,'#FFF7CE');g.addColorStop(.55,p.col2);g.addColorStop(1,p.col);
    sx.shadowColor='rgba(255,182,18,.9)';sx.shadowBlur=r*0.8;
    sx.fillStyle=g;sx.beginPath();sx.arc(q.x,q.y,r,0,7);sx.fill();sx.shadowBlur=0;
  }else{
    const g=sx.createRadialGradient(q.x-r*0.35,q.y-r*0.35,r*0.1,q.x,q.y,r);
    g.addColorStop(0,p.col2);g.addColorStop(1,p.col);
    sx.fillStyle=g;sx.beginPath();sx.arc(q.x,q.y,r,0,7);sx.fill();
    if(p.bands&&r>7){
      sx.save();sx.beginPath();sx.arc(q.x,q.y,r,0,7);sx.clip();
      sx.globalAlpha=.2;sx.fillStyle='#5C3A1E';
      for(let b=-2;b<=2;b++) sx.fillRect(q.x-r,q.y+b*r*0.36-r*0.07,r*2,r*0.15);
      sx.restore();sx.globalAlpha=1;
    }
    if(p.earth&&r>6){
      sx.save();sx.beginPath();sx.arc(q.x,q.y,r,0,7);sx.clip();sx.fillStyle='#3E9A4E';
      sx.beginPath();sx.ellipse(q.x-r*0.25,q.y-r*0.2,r*0.42,r*0.28,0.4,0,7);sx.fill();
      sx.beginPath();sx.ellipse(q.x+r*0.35,q.y+r*0.3,r*0.34,r*0.22,-0.3,0,7);sx.fill();
      sx.restore();
    }
    if(p.moon&&zoom>2.2){                    // our moon appears when you zoom in
      const ma=clock*2.2, md=r*2.6;
      sx.fillStyle='#CFCFCF';sx.beginPath();
      sx.arc(q.x+Math.cos(ma)*md,q.y+Math.sin(ma)*md*0.82,Math.max(1.5,r*0.27),0,7);sx.fill();
    }
    sx.save();sx.beginPath();sx.arc(q.x,q.y,r,0,7);sx.clip();
    const sh=sx.createLinearGradient(q.x-r,q.y,q.x+r,q.y);
    sh.addColorStop(0,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(0,0,0,.4)');
    sx.fillStyle=sh;sx.fillRect(q.x-r,q.y-r,r*2,r*2);sx.restore();
  }
  if(p.ring){
    sx.save();sx.translate(q.x,q.y);sx.rotate(-0.35);
    sx.strokeStyle='rgba(242,228,186,.95)';sx.lineWidth=Math.max(1,r*0.30);
    sx.beginPath();sx.ellipse(0,0,r*1.9,r*0.6,0,0,Math.PI);sx.stroke();sx.restore();
  }
  if(i===selected&&!spaceQuiz){
    sx.strokeStyle='#FFD400';sx.lineWidth=2.5;
    sx.beginPath();sx.arc(q.x,q.y,r+8+Math.sin(now/250)*2,0,7);sx.stroke();
  }
  const name=p[lang][0].replace(/^(el|la|the|der|die|das)\s+/i,'');
  sx.font='600 '+Math.max(9,Math.min(14,SS*0.032))+'px Trebuchet MS, sans-serif';
  sx.textAlign='center';sx.textBaseline='top';
  sx.fillStyle=i===selected?'#FFD400':'rgba(255,255,255,.85)';
  sx.fillText(name,q.x,q.y+r+5);
}

/* ---- pan / pinch / tap ---- */
const ptrs=new Map();
let dragged=false,pinchStart=0,zoomStart=1,lastMid=null;
sky.addEventListener('pointerdown',e=>{
  e.preventDefault(); ac(); sky.setPointerCapture&&sky.setPointerCapture(e.pointerId);
  ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY});
  dragged=false;
  if(ptrs.size===2){
    const [a,b]=[...ptrs.values()];
    pinchStart=Math.hypot(a.x-b.x,a.y-b.y); zoomStart=zoom;
    lastMid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
  }
});
sky.addEventListener('pointermove',e=>{
  if(!ptrs.has(e.pointerId))return; e.preventDefault();
  const p=ptrs.get(e.pointerId), dx=e.clientX-p.x, dy=e.clientY-p.y;
  p.x=e.clientX;p.y=e.clientY;
  if(Math.hypot(e.clientX-p.sx,e.clientY-p.sy)>8) dragged=true;
  const k=baseScale()*zoom;
  if(ptrs.size===1){ camX-=dx/k; camY-=dy/(k*0.82); }
  else if(ptrs.size===2){
    const [a,b]=[...ptrs.values()];
    const d=Math.hypot(a.x-b.x,a.y-b.y);
    if(pinchStart>0) setZoom(zoomStart*(d/pinchStart));
    const mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
    if(lastMid){const kk=baseScale()*zoom;
      camX-=(mid.x-lastMid.x)/kk; camY-=(mid.y-lastMid.y)/(kk*0.82);}
    lastMid=mid; dragged=true;
  }
});
['pointerup','pointercancel','pointerleave'].forEach(ev=>sky.addEventListener(ev,e=>{
  const was=ptrs.size;
  ptrs.delete(e.pointerId);
  if(ptrs.size<2){pinchStart=0;lastMid=null;}
  if(was===1&&!dragged) tapAt(e);
}));
function tapAt(e){
  const r=sky.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
  let best=-1,bd=1e9;
  PLANETS.forEach((p,i)=>{
    const wp=bodyPos(i),q=w2s(wp.x,wp.y);
    const rad=Math.max(worldR(p.size),p.sun?9:3.2);
    const d=Math.hypot(px-q.x,py-q.y);
    if(d<Math.max(rad+18,28)&&d<bd){bd=d;best=i;}
  });
  if(best<0)return;
  if(spaceQuiz) spaceAnswer(best); else selectPlanet(best);
}
function setZoom(z,keepCentre){
  zoom=Math.max(MINZ,Math.min(MAXZ,z));
}
function selectPlanet(i){
  selected=i;const p=PLANETS[i];
  document.getElementById('factName').textContent=p[lang][0];
  document.getElementById('factText').textContent=p[lang][1];
  say(p[lang][0]+'. '+p[lang][1]);
  beep(660,0,0.12,'square',0.14);
}
/* Space quiz levels: 1 the easy planets by name, 2 every planet by name,
   3 "which is the hottest / has rings / …", 4 order from the Sun. */
const SPACE_Q=[
 {L:3,a:5,es:'¿Cuál es el planeta más grande?',en:'Which is the biggest planet?',de:'Welcher ist der größte Planet?'},
 {L:3,a:1,es:'¿Cuál es el planeta más pequeño?',en:'Which is the smallest planet?',de:'Welcher ist der kleinste Planet?'},
 {L:3,a:2,es:'¿Cuál es el planeta más caliente?',en:'Which is the hottest planet?',de:'Welcher ist der heißeste Planet?'},
 {L:3,a:6,es:'¿Qué planeta tiene anillos grandes?',en:'Which planet has big rings?',de:'Welcher Planet hat große Ringe?'},
 {L:3,a:4,es:'¿Cuál es el planeta rojo?',en:'Which is the red planet?',de:'Welcher ist der rote Planet?'},
 {L:3,a:3,es:'¿Dónde vivimos nosotros?',en:'Where do we live?',de:'Wo leben wir?'},
 {L:3,a:0,es:'¿Cuál es una estrella?',en:'Which one is a star?',de:'Welches ist ein Stern?'},
 {L:3,a:8,es:'¿Cuál es el planeta más lejano?',en:'Which planet is the farthest away?',de:'Welcher Planet ist am weitesten weg?'},
 {L:3,a:7,es:'¿Qué planeta gira tumbado?',en:'Which planet spins on its side?',de:'Welcher Planet dreht sich auf der Seite?'},
 {L:4,a:1,es:'¿Cuál es el planeta más cercano al Sol?',en:'Which planet is closest to the Sun?',de:'Welcher Planet ist der Sonne am nächsten?'},
 {L:4,a:4,es:'¿Qué planeta viene después de la Tierra?',en:'Which planet comes after Earth?',de:'Welcher Planet kommt nach der Erde?'},
 {L:4,a:2,es:'¿Qué planeta viene antes de la Tierra?',en:'Which planet comes before Earth?',de:'Welcher Planet kommt vor der Erde?'},
 {L:4,a:5,es:'¿Qué planeta está entre Marte y Saturno?',en:'Which planet is between Mars and Saturn?',de:'Welcher Planet ist zwischen Mars und Saturn?'},
 {L:4,a:7,es:'¿Qué planeta viene después de Saturno?',en:'Which planet comes after Saturn?',de:'Welcher Planet kommt nach dem Saturn?'}
];
let spaceQText='',spaceMiss=0;
function spaceAsk(){
  spaceQuiz=true;spaceMiss=0;
  const L=level('space',4);
  if(L>=3&&Math.random()<0.75){
    const q=pick(SPACE_Q.filter(x=>x.L<=L&&x.a!==spaceTargetIdx));spaceTargetIdx=q.a;spaceQText=q[lang];
  }else{
    const pool=L===1?[0,3,4,5,6]:PLANETS.map((p,i)=>i).filter(i=>!PLANETS[i].sun);
    spaceTargetIdx=pick(pool.filter(i=>i!==spaceTargetIdx));
    const name=PLANETS[spaceTargetIdx][lang][0];
    spaceQText=lang==='es'?`¿Dónde está ${name}?`:lang==='de'?`Wo ist ${name}?`:`Where is ${name}?`;
  }
  document.getElementById('factName').textContent='🎯 '+L;
  document.getElementById('factText').textContent=spaceQText;
  say(spaceQText);
}
function spaceAnswer(i){
  if(i===spaceTargetIdx){
    spaceQuiz=false;bigWin();award(spaceMiss);adapt('space',4,spaceMiss===0);
    selected=i;const p=PLANETS[i];
    document.getElementById('factName').textContent=p[lang][0];
    document.getElementById('factText').textContent=p[lang][1];
    say(p[lang][0]+'. '+p[lang][1]);
  }else{nope();spaceMiss++;if(spaceMiss===2)say(spaceQText);}
}
