/* =============================================================
   PLAY
   Three free-play toys behind one home card, so the home screen
   gains a single tile instead of three. No words are required:
   every control is a picture, and the voice names whatever he taps.
============================================================= */
const TOY_ASK={es:'¿A qué jugamos?',en:'What shall we play?',de:'Was spielen wir?'};
const TOY_BACK={es:'Volver',en:'Back',de:'Zurück'};
const TOY_MODES=[
  {id:'track',icon:'✏️',es:'Pista',en:'Track',de:'Strecke',wide:true,bg:['#5EB0FF','#2A6FD0'],ex:'🚗 🚂 ✈️'},
  {id:'dress',icon:'🎩',es:'Disfraz',en:'Dress up',de:'Verkleiden',bg:['#FFB347','#E07B1A']},
  {id:'launch',icon:'🚀',es:'Lanzar',en:'Launch',de:'Start',bg:['#C9A6FF','#7A5AE0']}
];
const TOY={screen:'menu'};

/* ---- shared "hold to fill" pump. Release early and it sags back. ---- */
function pumpMake(rate,leak){
  return {fill:0,base:0,holding:false,phase:'idle',holdAt:0,relAt:0,relFill:0,fx:0,rate:rate||2.4,leak:leak||1.8};
}
function pumpDown(p){
  if(p.phase==='fly')return;
  p.holding=true;p.phase='hold';p.holdAt=performance.now();p.base=p.fill;
}
function pumpUp(p){
  if(!p.holding)return;
  p.holding=false;
  if(p.phase==='fly')return;
  p.phase='deflate';p.relAt=performance.now();p.relFill=p.fill;
}
/* true once this tick filled it completely */
function pumpTick(p){
  const now=performance.now();
  if(p.phase==='hold'){
    p.fill=Math.min(1,p.base+(now-p.holdAt)/1000/p.rate);
    if(now-(p.fx||0)>150){p.fx=now;beep(260+p.fill*620,0,0.06,'square',0.055);}
    if(p.fill>=1){p.fill=1;p.holding=false;p.phase='fly';return true;}
  }else if(p.phase==='deflate'){
    p.fill=Math.max(0,p.relFill-(now-p.relAt)/1000/p.leak);
    if(p.fill<=0){p.fill=0;p.phase='idle';}
  }
  return false;
}

let playRaf=0,playLast=0;
function playNeeds(){
  if(WL.on&&WL.phase!=='idle')return true;
  if(activeTab==='play'&&TOY.screen==='track')return true;
  if(activeTab==='play'&&TOY.screen==='launch'&&LAUNCH.phase!=='idle')return true;
  return false;
}
function playKick(){
  if(playRaf)return;
  playLast=performance.now();
  const loop=now=>{
    const dt=Math.min(0.05,(now-playLast)/1000)||0;playLast=now;
    if(activeTab==='play'&&TOY.screen==='track')trackFrame(dt);
    if(activeTab==='play'&&TOY.screen==='launch'&&LAUNCH.phase!=='idle'){if(pumpTick(LAUNCH))launchGo();launchFrame();}
    if(WL.on&&WL.phase!=='idle'){if(pumpTick(WL))wlGo();wlFrame();}
    if(playNeeds())playRaf=requestAnimationFrame(loop);
    else playRaf=0;
  };
  playRaf=requestAnimationFrame(loop);
}
function playStopLoops(){if(playRaf){cancelAnimationFrame(playRaf);playRaf=0;}}

function showPlay(){
  TOY.screen='menu';
  ['playMenu','trackPlay','dressPlay','launchPlay'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.classList.toggle('on',id==='playMenu');
  });
  renderPlayMenu();
  if(appStarted)say(TOY_ASK[lang]);
}
function renderPlayMenu(){
  const hello=document.getElementById('playHello'),grid=document.getElementById('playGrid');
  if(!hello||!grid)return;
  hello.textContent=TOY_ASK[lang];
  grid.innerHTML='';
  TOY_MODES.forEach(t=>{
    const b=document.createElement('button');
    b.type='button';b.className='wcard'+(t.wide?' wide':'');b.dataset.play=t.id;
    b.style.background=`linear-gradient(150deg,${t.bg[0]},${t.bg[1]})`;
    b.style.setProperty('--edge',t.bg[1]);
    b.setAttribute('aria-label',t[lang]);
    const icon=document.createElement('span');icon.className='wi';icon.textContent=t.icon;
    const lab=document.createElement('span');lab.className='wl';lab.textContent=t[lang];
    b.append(icon,lab);
    if(t.ex){const ex=document.createElement('span');ex.className='wex';ex.textContent=t.ex;b.append(ex);}
    b.onclick=()=>{ac();playOpen(t.id);};
    grid.appendChild(b);
  });
}
function playOpen(id){
  TOY.screen=id;
  ['playMenu','trackPlay','dressPlay','launchPlay'].forEach(k=>{
    document.getElementById(k).classList.toggle('on',k===(id==='track'?'trackPlay':id==='dress'?'dressPlay':'launchPlay'));
  });
  document.querySelectorAll('#v-play .phBack').forEach(b=>b.setAttribute('aria-label',TOY_BACK[lang]));
  if(id==='track')trackOpen();
  else if(id==='dress')dressOpen();
  else launchOpen();
}
function playBack(){ac();playStopLoops();TOY.screen='menu';
  ['playMenu','trackPlay','dressPlay','launchPlay'].forEach(id=>{
    document.getElementById(id).classList.toggle('on',id==='playMenu');
  });
  renderPlayMenu();
}
function playHide(){playStopLoops();TRACK.ptr=null;if(LAUNCH.holding)pumpUp(LAUNCH);}
function playOnLang(){
  if(TOY.screen==='menu')renderPlayMenu();
  else{
    document.querySelectorAll('#v-play .phBack').forEach(b=>b.setAttribute('aria-label',TOY_BACK[lang]));
    if(TOY.screen==='track')trackLabels();
    if(TOY.screen==='dress')dressLabels();
    if(TOY.screen==='launch')launchLabels();
  }
}
['trackBack','dressBack','launchBack'].forEach(id=>{
  const b=document.getElementById(id);if(b)b.onclick=playBack;
});

/* =============================================================
   DRAW A ROAD, THEN THE VEHICLE DRIVES IT
   The vehicle pictures are full scenes, not cut-out sprites, so
   the chosen picture rides along as a tile. An arrow shows which
   way it is heading; the photo itself stays upright and readable.
============================================================= */
const TRACK_IDS=[
  {id:'car',fx:'beep',emoji:'🚗'},
  {id:'steam-train',fx:'chug',emoji:'🚂'},
  {id:'city-bus',fx:'beep',emoji:'🚌'},
  {id:'fire-truck',fx:'siren',emoji:'🚒'},
  {id:'airplane',fx:'whoosh',emoji:'✈️'},
  {id:'helicopter',fx:'chop',emoji:'🚁'},
  {id:'sailboat',fx:'splash',emoji:'⛵'},
  {id:'tractor',fx:'chug',emoji:'🚜'}
];
const TRACK_SAY={es:'¡Dibuja un camino!',en:'Draw a road!',de:'Mal eine Straße!'};
const TRACK_YAY={es:'¡Lo lograste!',en:'You did it!',de:'Geschafft!'};
const TRACK={veh:'car',raw:[],road:null,phase:'draw',t:0,dur:2,celebrated:false,ptr:null,clock:0,fxAt:0};
const trackCv=$('trackCv'),trackG=trackCv.getContext('2d');
const trackImgs={};
function trackVeh(id){return (PHOTO_PACK.vehicles||[]).find(v=>v.id===(id||TRACK.veh));}
function trackMeta(id){return TRACK_IDS.find(v=>v.id===(id||TRACK.veh))||TRACK_IDS[0];}
function trackImg(id){
  const v=trackVeh(id);if(!v)return null;
  if(!trackImgs[v.image]){
    const im=new Image();im.src=v.image;trackImgs[v.image]=im;
    im.onload=()=>{if(TOY.screen==='track')trackFrame(0);};
  }
  return trackImgs[v.image];
}
function trackOpen(){
  TRACK.phase='draw';TRACK.raw=[];TRACK.road=null;TRACK.celebrated=false;TRACK.ptr=null;
  trackLabels();
  TRACK_IDS.forEach(v=>trackImg(v.id));
  say(TRACK_SAY[lang]);
  trackFrame(0);requestAnimationFrame(()=>{if(TOY.screen==='track')trackFrame(0);});playKick();
}
function trackLabels(){
  const box=document.getElementById('trackVehs');if(!box)return;
  box.innerHTML='';
  TRACK_IDS.forEach(meta=>{
    const v=trackVeh(meta.id);if(!v)return;
    const b=document.createElement('button');
    b.type='button';b.className='trackVeh'+(meta.id===TRACK.veh?' on':'');
    b.dataset.veh=meta.id;
    b.setAttribute('aria-label',v.names[lang].full);
    const img=document.createElement('img');img.alt='';img.draggable=false;img.src=v.image;
    b.appendChild(img);
    b.onclick=()=>{
      ac();TRACK.veh=meta.id;trackLabels();
      say(v.names[lang].full);
      if(TOY.screen==='track')trackFrame(0);
    };
    box.appendChild(b);
  });
}
function trackPos(e){
  const r=trackCv.getBoundingClientRect();
  return {x:e.clientX-r.left,y:e.clientY-r.top};
}
function trackLen(pts){
  let n=0;for(let i=1;i<pts.length;i++)n+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);return n;
}
function trackSmooth(pts){
  if(pts.length<3)return pts.map(p=>({x:p.x,y:p.y}));
  const o=[{x:pts[0].x,y:pts[0].y}];
  for(let i=1;i<pts.length-1;i++)o.push({x:(pts[i-1].x+pts[i].x*2+pts[i+1].x)/4,y:(pts[i-1].y+pts[i].y*2+pts[i+1].y)/4});
  o.push({x:pts[pts.length-1].x,y:pts[pts.length-1].y});
  return o;
}
/* even steps, so a scribble and a slow careful line are driven at the same speed */
function trackResample(pts,step){
  if(pts.length<2)return pts.map(p=>({x:p.x,y:p.y}));
  const out=[{x:pts[0].x,y:pts[0].y}];let ax=pts[0].x,ay=pts[0].y,acc=0;
  for(let i=1;i<pts.length;i++){
    let bx=pts[i].x,by=pts[i].y,seg=Math.hypot(bx-ax,by-ay);
    if(seg<0.001)continue;
    while(acc+seg>=step){
      const t=(step-acc)/seg;ax=ax+(bx-ax)*t;ay=ay+(by-ay)*t;
      out.push({x:ax,y:ay});seg=Math.hypot(bx-ax,by-ay);acc=0;
    }
    acc+=seg;ax=bx;ay=by;
  }
  const last=pts[pts.length-1],p=out[out.length-1];
  if(Math.hypot(last.x-p.x,last.y-p.y)>1)out.push({x:last.x,y:last.y});
  return out;
}
function trackAt(pts,dist){
  let left=dist;
  for(let i=1;i<pts.length;i++){
    const a=pts[i-1],b=pts[i],seg=Math.hypot(b.x-a.x,b.y-a.y)||0.0001;
    if(left<=seg){const t=left/seg;return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,ang:Math.atan2(b.y-a.y,b.x-a.x)};}
    left-=seg;
  }
  const a=pts[Math.max(0,pts.length-2)],b=pts[pts.length-1];
  return {x:b.x,y:b.y,ang:Math.atan2(b.y-a.y,b.x-a.x)};
}
trackCv.addEventListener('pointerdown',e=>{
  if(TOY.screen!=='track')return;
  if(TRACK.ptr!=null)return;
  e.preventDefault();
  TRACK.ptr=e.pointerId;
  try{trackCv.setPointerCapture(e.pointerId);}catch(err){}
  TRACK.phase='draw';TRACK.road=null;TRACK.celebrated=false;TRACK.raw=[trackPos(e)];
  trackFrame(0);
});
trackCv.addEventListener('pointermove',e=>{
  if(e.pointerId!==TRACK.ptr||TRACK.phase!=='draw')return;
  e.preventDefault();
  const p=trackPos(e),prev=TRACK.raw[TRACK.raw.length-1];
  if(prev&&Math.hypot(p.x-prev.x,p.y-prev.y)<3)return;
  TRACK.raw.push(p);
  if(TRACK.raw.length>800)TRACK.raw.shift();
  trackFrame(0);
});
function trackLift(e){
  if(e.pointerId!==TRACK.ptr)return;
  TRACK.ptr=null;
  const len=trackLen(TRACK.raw);
  if(TRACK.raw.length<2||len<48){TRACK.raw=[];nope();trackFrame(0);return;}
  const road=trackResample(trackSmooth(TRACK.raw),8);
  TRACK.road={pts:road,len:trackLen(road)};
  TRACK.raw=[];
  TRACK.phase='ride';TRACK.t=0;
  TRACK.dur=Math.max(1.35,Math.min(6.5,TRACK.road.len/150));
  TRACK.fxAt=0;
  const v=trackVeh();
  const noise=v&&v.sound&&v.sound[lang];
  if(noise)say(noise);
  playKick();
}
trackCv.addEventListener('pointerup',trackLift);
trackCv.addEventListener('pointercancel',trackLift);
function trackFx(kind){
  if(kind==='siren'){beep(760,0,0.09,'square',0.06);beep(540,0.1,0.09,'square',0.06);}
  else if(kind==='chug'){beep(98,0,0.07,'sawtooth',0.07);noise(0.05,0.04);}
  else if(kind==='whoosh')sweep(380,980,0.22,'sine',0.05);
  else if(kind==='chop'){beep(160,0,0.04,'square',0.05);beep(210,0.07,0.04,'square',0.05);}
  else if(kind==='splash')noise(0.12,0.05);
  else if(kind==='ring'){beep(880,0,0.08,'sine',0.07);beep(1320,0.09,0.1,'sine',0.05);}
  else beep(560,0,0.05,'square',0.05);
}
function trackArrive(){
  if(TRACK.celebrated)return;
  TRACK.phase='celebrate';TRACK.celebrated=true;TRACK.t=1;
  bigWin();boom(90);
  const v=trackVeh();
  rainEmoji([trackMeta().emoji,'⭐','✨'],16);
  if(typeof mascot==='function')mascot('cheer');
  say(TRACK_YAY[lang]+(v?' '+v.names[lang].noun:''));
  setTimeout(()=>{if(TRACK.phase==='celebrate'){TRACK.phase='draw';if(TOY.screen==='track')trackFrame(0);}},1700);
}
function trackRoadStroke(g,pts,w){
  if(!pts||pts.length<2)return;
  g.lineCap='round';g.lineJoin='round';
  g.strokeStyle='#6B3A16';g.lineWidth=w+10;
  g.beginPath();g.moveTo(pts[0].x,pts[0].y);
  for(let i=1;i<pts.length;i++)g.lineTo(pts[i].x,pts[i].y);
  g.stroke();
  g.strokeStyle='#F6C945';g.lineWidth=w;g.stroke();
  g.strokeStyle='rgba(255,255,255,.92)';g.lineWidth=Math.max(2,w*0.16);
  g.setLineDash([w*0.55,w*0.85]);g.stroke();g.setLineDash([]);
}
function trackScene(g,W,H,clock){
  const sky=g.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#6EB6FF');sky.addColorStop(0.46,'#D4F0FF');sky.addColorStop(0.46,'#8ED36A');sky.addColorStop(1,'#3C9A45');
  g.fillStyle=sky;g.fillRect(0,0,W,H);
  g.fillStyle='#FFE14A';g.beginPath();g.arc(W*0.84,H*0.16,Math.min(W,H)*0.075,0,7);g.fill();
  g.fillStyle='rgba(255,255,255,.92)';
  const cloud=(x,y,s)=>{[[0,0,1],[0.85,-0.28,0.82],[1.6,0.05,0.95]].forEach(([a,b,r])=>{g.beginPath();g.arc(x+a*s,y+b*s,r*s*0.55,0,7);g.fill();});};
  cloud((0.12+clock*0.012)%1.3*W-W*0.1,H*0.16,46);
  cloud((0.55+clock*0.008)%1.3*W-W*0.1,H*0.28,34);
  g.fillStyle='#67B85A';g.beginPath();g.moveTo(0,H*0.62);g.quadraticCurveTo(W*0.3,H*0.48,W*0.55,H*0.58);g.quadraticCurveTo(W*0.8,H*0.68,W,H*0.5);g.lineTo(W,H*0.72);g.lineTo(0,H*0.72);g.fill();
  g.fillStyle='#2F8A48';
  g.beginPath();g.moveTo(W*0.08,H*0.78);g.lineTo(W*0.08,H*0.62);g.lineTo(W*0.2,H*0.5);g.lineTo(W*0.32,H*0.62);g.lineTo(W*0.32,H*0.78);g.fill();
  g.fillStyle='#C96B4A';g.fillRect(W*0.16,H*0.66,W*0.08,H*0.1);
  g.fillStyle='#7EC8FF';g.fillRect(W*0.175,H*0.69,W*0.05,H*0.045);
}
function trackToken(g,x,y){
  const meta=trackMeta(),im=trackImg(meta.id),s=78;
  g.save();g.translate(x,y+6);
  g.fillStyle='rgba(10,16,40,.28)';g.beginPath();g.ellipse(0,8,s*0.42,s*0.16,0,0,7);g.fill();
  g.fillStyle='#fff';g.beginPath();g.roundRect(-s/2,-s/2,s,s,18);g.fill();
  g.save();g.beginPath();g.roundRect(-s/2+4,-s/2+4,s-8,s-8,14);g.clip();
  if(im&&im.complete&&im.naturalWidth)g.drawImage(im,-s/2+4,-s/2+4,s-8,s-8);
  else{g.fillStyle='#FFF6D0';g.fillRect(-s/2,-s/2,s,s);g.font='48px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(meta.emoji,0,2);}
  g.restore();g.restore();
}
function trackArrow(g,x,y,ang){
  g.save();g.translate(x,y);g.rotate(ang);
  g.fillStyle='#fff';g.strokeStyle='#1A2348';g.lineWidth=3;
  g.beginPath();g.moveTo(58,0);g.lineTo(34,-13);g.lineTo(34,13);g.closePath();g.fill();g.stroke();
  g.restore();
}
function trackFrame(dt){
  if(!trackCv)return;
  TRACK.clock+=dt||0;
  const box=fitCv(trackCv,trackG);if(!box)return;
  const {W,H}=box;
  if(TRACK.phase==='ride'&&TRACK.road){
    TRACK.t+=dt/TRACK.dur;
    const now=performance.now();
    if(now-TRACK.fxAt>280){TRACK.fxAt=now;trackFx(trackMeta().fx);}
    if(TRACK.t>=1){TRACK.t=1;trackArrive();}
  }
  trackScene(trackG,W,H,TRACK.clock);
  const drawing=TRACK.phase==='draw'?TRACK.raw:(TRACK.road&&TRACK.road.pts);
  trackRoadStroke(trackG,drawing,18);
  let pos=null;
  if(TRACK.road&&TRACK.phase!=='draw')pos=trackAt(TRACK.road.pts,TRACK.road.len*Math.min(1,TRACK.t));
  else if(TRACK.raw.length)pos={x:TRACK.raw[TRACK.raw.length-1].x,y:TRACK.raw[TRACK.raw.length-1].y,ang:0};
  if(pos){
    const bob=TRACK.phase==='ride'?Math.sin(TRACK.t*18)*3:0;
    if(TRACK.phase!=='draw'&&TRACK.road)trackArrow(trackG,pos.x,pos.y+bob,pos.ang);
    trackToken(trackG,pos.x,pos.y+bob);
  }else if(TRACK.phase==='draw'){
    const y=H*0.62+Math.sin(TRACK.clock*3)*8;
    trackG.font='54px sans-serif';trackG.textAlign='center';trackG.globalAlpha=0.9;
    trackG.fillText('👆',W*0.5,y);trackG.globalAlpha=1;
  }
  if(TRACK.phase==='celebrate'&&pos){
    trackG.font='42px sans-serif';trackG.textAlign='center';
    trackG.fillText('⭐',pos.x-36,pos.y-56);trackG.fillText('✨',pos.x+40,pos.y-48);
  }
}

/* =============================================================
   DRESS AN ANIMAL
   Anchors are percentages of the square photo, tuned per animal
   so a hat lands on that animal's head. One sticker per place:
   a new hat replaces the old hat.
============================================================= */
const DRESS_ANIMALS=[
  {id:'cat',    head:[50,24],face:[50,36],neck:[50,54],side:[20,34],glow:[50,32]},
  {id:'dog',    head:[50,13],face:[50,30],neck:[50,50],side:[18,32],glow:[50,28]},
  {id:'rabbit', head:[42,20],face:[40,40],neck:[44,58],side:[24,22],glow:[42,36]},
  {id:'panda',  head:[50,16],face:[50,32],neck:[50,50],side:[78,28],glow:[50,28]},
  {id:'owl',    head:[47,16],face:[47,34],neck:[47,54],side:[74,32],glow:[47,30]},
  {id:'frog',   head:[50,30],face:[50,42],neck:[50,56],side:[74,40],glow:[50,40]},
  {id:'monkey', head:[48,16],face:[48,30],neck:[48,46],side:[72,24],glow:[48,26]},
  {id:'bear',   head:[54,20],face:[56,32],neck:[52,46],side:[74,28],glow:[54,30]}
];
const DRESS_ITEMS=[
  {id:'hat',emoji:'🎩',slot:'head',en:'hat',de:'Hut',es:'sombrero'},
  {id:'crown',emoji:'👑',slot:'head',en:'crown',de:'Krone',es:'corona'},
  {id:'cap',emoji:'🧢',slot:'head',en:'cap',de:'Mütze',es:'gorra'},
  {id:'glasses',emoji:'👓',slot:'face',en:'glasses',de:'Brille',es:'gafas'},
  {id:'sun',emoji:'🕶️',slot:'face',en:'sunglasses',de:'Sonnenbrille',es:'gafas de sol'},
  {id:'scarf',emoji:'🧣',slot:'neck',en:'scarf',de:'Schal',es:'bufanda'},
  {id:'bow',emoji:'🎀',slot:'side',en:'bow',de:'Schleife',es:'lazo'},
  {id:'flower',emoji:'🌸',slot:'side',en:'flower',de:'Blume',es:'flor'},
  {id:'red',slot:'glow',color:'#FF4B4B',en:'red',de:'rot',es:'rojo'},
  {id:'blue',slot:'glow',color:'#3D8BFF',en:'blue',de:'blau',es:'azul'},
  {id:'yellow',slot:'glow',color:'#FFD000',en:'yellow',de:'gelb',es:'amarillo'},
  {id:'green',slot:'glow',color:'#3DDC6A',en:'green',de:'grün',es:'verde'},
  {id:'pink',slot:'glow',color:'#FF7AB8',en:'pink',de:'rosa',es:'rosa'}
];
const DRESS_HI={es:'¡Vístelo!',en:'Dress it up!',de:'Zieh es an!'};
const DRESS_YAY={es:'¡Qué guapo!',en:'So fancy!',de:'So hübsch!'};
const DRESS={id:'cat',worn:{},celebrated:false};
function dressAnimal(){return (PHOTO_PACK.animals||[]).find(a=>a.id===DRESS.id);}
function dressAnchor(){return DRESS_ANIMALS.find(a=>a.id===DRESS.id)||DRESS_ANIMALS[0];}
function dressItem(id){return DRESS_ITEMS.find(it=>it.id===id);}
function dressOpen(){
  DRESS.celebrated=false;
  dressLabels();dressRender();
  say(DRESS_HI[lang]);
  const a=dressAnimal();if(a)setTimeout(()=>{if(TOY.screen==='dress')say(a.names[lang].full);},700);
}
function dressLabels(){
  const animals=document.getElementById('dressAnimals');
  const tray=document.getElementById('dressTray');
  if(!animals||!tray)return;
  animals.innerHTML='';
  DRESS_ANIMALS.forEach(meta=>{
    const a=(PHOTO_PACK.animals||[]).find(x=>x.id===meta.id);if(!a)return;
    const b=document.createElement('button');
    b.type='button';b.className='dressAn'+(meta.id===DRESS.id?' on':'');
    b.dataset.animal=meta.id;
    b.setAttribute('aria-label',a.names[lang].full);
    const img=document.createElement('img');img.alt='';img.draggable=false;img.src=a.image;
    b.appendChild(img);
    b.onclick=()=>{
      ac();if(DRESS.id!==meta.id){DRESS.id=meta.id;DRESS.worn={};DRESS.celebrated=false;}
      dressLabels();dressRender();say(a.names[lang].full);
    };
    animals.appendChild(b);
  });
  tray.innerHTML='';
  DRESS_ITEMS.forEach(it=>{
    const on=DRESS.worn[it.slot]===it.id;
    const b=document.createElement('button');
    b.type='button';b.className='dressBit'+(it.color?' swatch':'')+(on?' on':'');
    b.dataset.dress=it.id;
    b.setAttribute('aria-label',it[lang]);
    b.setAttribute('aria-pressed',on?'true':'false');
    if(it.color)b.style.background=it.color;
    else b.textContent=it.emoji;
    b.onclick=()=>dressTap(it.id);
    tray.appendChild(b);
  });
  const reset=document.getElementById('dressReset'),done=document.getElementById('dressDone');
  if(reset)reset.setAttribute('aria-label',{es:'Otra vez',en:'Again',de:'Nochmal'}[lang]);
  if(done)done.setAttribute('aria-label',{es:'Listo',en:'Done',de:'Fertig'}[lang]);
}
function dressTap(id){
  ac();
  const it=dressItem(id);if(!it)return;
  if(DRESS.worn[it.slot]===id)delete DRESS.worn[it.slot];
  else DRESS.worn[it.slot]=id;
  DRESS.celebrated=false;
  blip();say(it[lang]);
  dressLabels();dressRender();
}
function dressPlace(el,pt){el.style.left=pt[0]+'%';el.style.top=pt[1]+'%';}
function dressRender(){
  const a=dressAnimal(),img=document.getElementById('dressPhoto'),box=document.getElementById('dressStickers');
  if(!a||!img||!box)return;
  if(img.getAttribute('src')!==a.image)img.src=a.image;
  img.alt=a.names[lang].full;
  const anchor=dressAnchor();
  box.innerHTML='';
  if(DRESS.worn.glow){
    const it=dressItem(DRESS.worn.glow);
    const s=document.createElement('div');s.className='dressGlow';s.style.background=it.color;
    dressPlace(s,anchor.glow||anchor.head);box.appendChild(s);
  }
  ['head','face','neck','side'].forEach(slot=>{
    const id=DRESS.worn[slot];if(!id)return;
    const it=dressItem(id);
    const s=document.createElement('div');s.className='dressSticker pop';s.textContent=it.emoji;
    dressPlace(s,anchor[slot]||[50,40]);box.appendChild(s);
  });
}
document.getElementById('dressReset').onclick=()=>{
  ac();DRESS.worn={};DRESS.celebrated=false;blip();dressLabels();dressRender();
};
document.getElementById('dressDone').onclick=()=>{
  ac();DRESS.celebrated=true;
  bigWin();boom(80);
  const bits=['⭐','✨'];
  Object.keys(DRESS.worn).forEach(slot=>{const it=dressItem(DRESS.worn[slot]);if(it&&it.emoji)bits.push(it.emoji);});
  rainEmoji(bits,18);
  if(typeof mascot==='function')mascot('cheer');
  const a=dressAnimal();
  say(DRESS_YAY[lang]+(a?' '+a.names[lang].noun:''));
};

/* =============================================================
   HOLD TO LAUNCH
   The meter climbs only while the big button is held. Letting go
   early lets it sink. Full sends the rocket (or balloon) off.
============================================================= */
const LAUNCH=pumpMake(2.35,1.7);
LAUNCH.kind='rocket';
const LAUNCH_SAY={es:'¡Aprieta!',en:'Hold it!',de:'Festhalten!'};
const LAUNCH_WORDS={
  rocket:{es:'cohete',en:'rocket',de:'Rakete',go:{es:'¡Despegue!',en:'Liftoff!',de:'Abflug!'}},
  balloon:{es:'globo',en:'balloon',de:'Ballon',go:{es:'¡Vuela, globo!',en:'Fly, balloon!',de:'Flieg, Ballon!'}}
};
function launchOpen(){
  LAUNCH.phase='idle';LAUNCH.fill=0;LAUNCH.holding=false;
  const craft=document.getElementById('launchCraft');
  if(craft)craft.classList.remove('fly');
  launchLabels();launchFrame();
  say(LAUNCH_SAY[lang]);
}
function launchLabels(){
  const box=document.getElementById('launchPick');if(!box)return;
  box.innerHTML='';
  [['rocket','🚀'],['balloon','🎈']].forEach(([id,emoji])=>{
    const b=document.createElement('button');
    b.type='button';b.className='lk'+(LAUNCH.kind===id?' on':'');
    b.dataset.kind=id;b.textContent=emoji;
    b.setAttribute('aria-label',LAUNCH_WORDS[id][lang]);
    b.onclick=()=>{
      if(LAUNCH.phase==='fly')return;
      ac();LAUNCH.kind=id;LAUNCH.fill=0;LAUNCH.phase='idle';LAUNCH.holding=false;
      launchLabels();launchFrame();say(LAUNCH_WORDS[id][lang]);
    };
    box.appendChild(b);
  });
  const title=document.getElementById('launchTitle');
  if(title)title.textContent=LAUNCH.kind==='balloon'?'🎈':'🚀';
  const btn=document.getElementById('launchBtn');
  if(btn)btn.setAttribute('aria-label',LAUNCH_SAY[lang]);
}
function launchFrame(){
  const craft=document.getElementById('launchCraft'),fill=document.getElementById('launchFill'),btn=document.getElementById('launchBtn');
  if(!craft||!fill)return;
  fill.style.height=(LAUNCH.fill*100)+'%';
  craft.textContent=LAUNCH.kind==='balloon'?'🎈':'🚀';
  craft.classList.toggle('balloon',LAUNCH.kind==='balloon');
  if(btn)btn.classList.toggle('pump',!!LAUNCH.holding);
  if(LAUNCH.phase==='fly')return;
  const s=LAUNCH.kind==='balloon'?(0.55+LAUNCH.fill*0.85):(0.85+LAUNCH.fill*0.35);
  const lift=LAUNCH.kind==='rocket'?-LAUNCH.fill*90:-LAUNCH.fill*16;
  const wob=LAUNCH.holding?Math.sin(performance.now()/45)*(2+LAUNCH.fill*8):0;
  craft.style.transform=`translateY(${lift}px) scale(${s}) rotate(${wob}deg)`;
}
function launchGo(){
  const craft=document.getElementById('launchCraft');
  if(craft){craft.style.transform='';craft.classList.add('fly');}
  LAUNCH.flights=(LAUNCH.flights||0)+1;LAUNCH.celebrated=true;
  bigWin();boom(120);fanfare();
  rainEmoji(LAUNCH.kind==='balloon'?['🎈','⭐','✨']:['🚀','⭐','✨'],20);
  if(typeof mascot==='function')mascot('cheer',2200);
  say(LAUNCH_WORDS[LAUNCH.kind].go[lang]);
  setTimeout(()=>{
    LAUNCH.phase='idle';LAUNCH.fill=0;LAUNCH.holding=false;LAUNCH.celebrated=false;
    if(craft)craft.classList.remove('fly');
    if(TOY.screen==='launch')launchFrame();
  },2000);
}
const launchBtn=document.getElementById('launchBtn');
function launchPointerDown(e){
  if(TOY.screen!=='launch')return;
  if(LAUNCH.phase==='fly')return;
  e.preventDefault();
  try{launchBtn.setPointerCapture(e.pointerId);}catch(err){}
  ac();pumpDown(LAUNCH);launchFrame();playKick();
}
function launchPointerUp(e){
  if(!LAUNCH.holding)return;
  pumpUp(LAUNCH);launchFrame();playKick();
}
launchBtn.addEventListener('pointerdown',launchPointerDown);
launchBtn.addEventListener('pointerup',launchPointerUp);
launchBtn.addEventListener('pointercancel',launchPointerUp);

/* =============================================================
   WORD REWARD
   The same pump, small, under the picture when a whole word has
   been traced. Ignoring it changes nothing: the usual pause still
   moves on. Holding it pauses that pause until he lets go or launches.
============================================================= */
const WL=pumpMake(1.7,1.5);
WL.on=false;
const WL_YAY={es:'¡Bien!',en:'Yay!',de:'Juhu!'};
function wordLaunchOffer(){
  const box=document.getElementById('wordLaunch');if(!box)return;
  WL.on=true;WL.fill=0;WL.holding=false;WL.phase='idle';WL.celebrated=false;
  box.classList.add('on');
  wlFrame();
}
function wordLaunchHide(){
  WL.on=false;WL.holding=false;WL.phase='idle';WL.fill=0;
  const box=document.getElementById('wordLaunch');if(box)box.classList.remove('on');
}
function wordLaunchArm(){
  clearTimeout(holdT);
  holdT=setTimeout(()=>{
    const p=document.getElementById('praise');if(p)p.style.display='none';
    wordLaunchHide();
    if(typeof advance==='function')advance();
  },1400);
}
function wlFrame(){
  const fill=document.getElementById('wlFill'),btn=document.getElementById('wlBtn');
  if(fill)fill.style.height=(WL.fill*100)+'%';
  if(btn){
    btn.classList.toggle('pump',!!WL.holding);
    const s=1+WL.fill*0.18;
    btn.style.transform=WL.phase==='fly'?'':`scale(${s})`;
  }
}
function wlGo(){
  clearTimeout(holdT);
  WL.celebrated=true;
  bigWin();beep(880,0,0.12,'square',0.12);
  rainEmoji(['🚀','⭐'],10);
  say(WL_YAY[lang]);
  const btn=document.getElementById('wlBtn');if(btn)btn.classList.add('fly');
  setTimeout(()=>{
    if(btn)btn.classList.remove('fly');
    wordLaunchHide();
    const p=document.getElementById('praise');if(p)p.style.display='none';
    clearTimeout(holdT);
    if(activeTab==='trace'&&typeof advance==='function')advance();
  },900);
}
const wlBtn=document.getElementById('wlBtn');
wlBtn.addEventListener('pointerdown',e=>{
  if(!WL.on||WL.phase==='fly')return;
  e.preventDefault();e.stopPropagation();
  try{wlBtn.setPointerCapture(e.pointerId);}catch(err){}
  ac();clearTimeout(holdT);pumpDown(WL);wlFrame();playKick();
});
function wlUp(){
  if(!WL.holding)return;
  pumpUp(WL);wlFrame();
  if(WL.phase!=='fly')wordLaunchArm();
  playKick();
}
wlBtn.addEventListener('pointerup',wlUp);
wlBtn.addEventListener('pointercancel',wlUp);
