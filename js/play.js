/* =============================================================
   DRAW A ROAD, and the little rocket after a written word.
   The road is a prize game. The rocket is only the extra cheer
   under a finished word, not its own activity.
============================================================= */
/* ---- shared "hold to fill" pump, used by the little rocket after a written word. ---- */
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
function roadOn(){return activeTab==='dig'&&pane==='roadPlay';}
function playNeeds(){
  if(WL.on&&WL.phase!=='idle')return true;
  if(roadOn())return true;
  return false;
}
function playKick(){
  if(playRaf)return;
  playLast=performance.now();
  const loop=now=>{
    const dt=Math.min(0.05,(now-playLast)/1000)||0;playLast=now;
    if(roadOn())trackFrame(dt);
    if(WL.on&&WL.phase!=='idle'){if(pumpTick(WL))wlGo();wlFrame();}
    if(playNeeds())playRaf=requestAnimationFrame(loop);
    else playRaf=0;
  };
  playRaf=requestAnimationFrame(loop);
}
function playStopLoops(){if(playRaf){cancelAnimationFrame(playRaf);playRaf=0;}}
function playHide(){playStopLoops();if(typeof TRACK!=='undefined')TRACK.ptr=null;}

/* =============================================================
   DRAW A ROAD, THEN THE VEHICLE DRIVES IT
   The vehicle pictures are full scenes, not cut-out sprites, so
   the chosen picture rides along as a tile. An arrow shows which
   way it is heading; the photo itself stays upright and readable.
============================================================= */
const TRACK_IDS=[
  {id:'car',fx:'beep',emoji:'🚗',scene:'town'},
  {id:'steam-train',fx:'chug',emoji:'🚂',scene:'rails'},
  {id:'city-bus',fx:'beep',emoji:'🚌',scene:'town'},
  {id:'fire-truck',fx:'siren',emoji:'🚒',scene:'town'},
  {id:'airplane',fx:'whoosh',emoji:'✈️',scene:'sky'},
  {id:'helicopter',fx:'chop',emoji:'🚁',scene:'sky'},
  {id:'sailboat',fx:'splash',emoji:'⛵',scene:'water'},
  {id:'tractor',fx:'chug',emoji:'🚜',scene:'field'}
];
const TRACK_MAX=2400;
const TRACK_SAY={es:'¡Dibuja un camino!',en:'Draw a road!',de:'Mal eine Straße!'};
const TRACK_YAY={es:'¡Lo lograste!',en:'You did it!',de:'Geschafft!'};
const TRACK={veh:'car',raw:[],road:null,phase:'draw',t:0,dur:2,celebrated:false,ptr:null,clock:0,fxAt:0,full:false,trips:0};
const trackCv=$('trackCv'),trackG=trackCv.getContext('2d');
const trackImgs={};
function trackVeh(id){return (PHOTO_PACK.vehicles||[]).find(v=>v.id===(id||TRACK.veh));}
function trackMeta(id){return TRACK_IDS.find(v=>v.id===(id||TRACK.veh))||TRACK_IDS[0];}
function trackImg(id){
  const v=trackVeh(id);if(!v)return null;
  if(!trackImgs[v.image]){
    const im=new Image();im.src=v.image;trackImgs[v.image]=im;
    im.onload=()=>{if(roadOn())trackFrame(0);};
  }
  return trackImgs[v.image];
}
function trackOpen(){
  TRACK.phase='draw';TRACK.raw=[];TRACK.road=null;TRACK.celebrated=false;TRACK.ptr=null;TRACK.full=false;TRACK.trips=0;
  trackLabels();
  TRACK_IDS.forEach(v=>trackImg(v.id));
  const p=$('roadPrompt');if(p)p.textContent=TRACK_SAY[lang];
  say(TRACK_SAY[lang]);
  trackFrame(0);requestAnimationFrame(()=>{if(roadOn())trackFrame(0);});playKick();
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
      if(roadOn())trackFrame(0);
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
/* Stop accepting more ink once the road is long enough. The start of the
   line stays put: shifting old points off made a long scribble look like it reset. */
function trackPush(p){
  const prev=TRACK.raw[TRACK.raw.length-1];
  if(!prev){TRACK.raw.push(p);return;}
  const d=Math.hypot(p.x-prev.x,p.y-prev.y);
  if(d<3)return;
  const have=trackLen(TRACK.raw);
  if(have>=TRACK_MAX){TRACK.full=true;return;}
  if(have+d>=TRACK_MAX){
    const t=(TRACK_MAX-have)/d;
    TRACK.raw.push({x:prev.x+(p.x-prev.x)*t,y:prev.y+(p.y-prev.y)*t});
    if(!TRACK.full){TRACK.full=true;chime();}
    return;
  }
  TRACK.raw.push(p);
}
trackCv.addEventListener('pointerdown',e=>{
  if(!roadOn())return;
  if(TRACK.ptr!=null)return;
  e.preventDefault();
  TRACK.ptr=e.pointerId;
  try{trackCv.setPointerCapture(e.pointerId);}catch(err){}
  TRACK.phase='draw';TRACK.road=null;TRACK.celebrated=false;TRACK.full=false;TRACK.raw=[trackPos(e)];
  trackFrame(0);
});
trackCv.addEventListener('pointermove',e=>{
  if(e.pointerId!==TRACK.ptr||TRACK.phase!=='draw')return;
  e.preventDefault();
  trackPush(trackPos(e));
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
  TRACK.trips=(TRACK.trips||0)+1;
  setTimeout(()=>{if(TRACK.phase==='celebrate'){TRACK.phase='draw';if(roadOn())trackFrame(0);}},1700);
}
function trackRoadStroke(g,pts,w){
  if(!pts||pts.length<2)return;
  const scene=trackMeta().scene;
  const ink=scene==='sky'?'#16325C':scene==='water'?'#14506A':'#6B3A16';
  const fill=scene==='sky'?'#FFFFFF':scene==='water'?'#F4FEFF':'#F6C945';
  g.lineCap='round';g.lineJoin='round';
  g.strokeStyle=ink;g.lineWidth=w+10;
  g.beginPath();g.moveTo(pts[0].x,pts[0].y);
  for(let i=1;i<pts.length;i++)g.lineTo(pts[i].x,pts[i].y);
  g.stroke();
  g.strokeStyle=fill;g.lineWidth=w;g.stroke();
  g.strokeStyle='rgba(255,255,255,.92)';g.lineWidth=Math.max(2,w*0.16);
  g.setLineDash([w*0.55,w*0.85]);g.stroke();g.setLineDash([]);
}
function trackCloud(g,x,y,s){
  g.beginPath();
  [[0,0,1],[0.9,-0.25,0.85],[1.7,0.08,0.95]].forEach(([a,b,r])=>{g.moveTo(x+a*s+r*s*0.5,y+b*s);g.arc(x+a*s,y+b*s,r*s*0.5,0,7);});
  g.fill();
}
function trackScene(g,W,H,clock){
  const scene=trackMeta().scene;
  const sky=g.createLinearGradient(0,0,0,H);
  if(scene==='sky'){
    sky.addColorStop(0,'#4FA0F0');sky.addColorStop(1,'#D7F3FF');
    g.fillStyle=sky;g.fillRect(0,0,W,H);
    g.fillStyle='#FFE14A';g.beginPath();g.arc(W*0.82,H*0.16,Math.min(W,H)*0.07,0,7);g.fill();
    g.fillStyle='rgba(255,255,255,.95)';
    trackCloud(g,(0.1+clock*0.02)%1.4*W-W*0.15,H*0.28,42);
    trackCloud(g,(0.55+clock*0.012)%1.4*W-W*0.15,H*0.48,34);
    trackCloud(g,(0.3+clock*0.016)%1.4*W-W*0.15,H*0.7,28);
    return;
  }
  if(scene==='water'){
    sky.addColorStop(0,'#7EC8FF');sky.addColorStop(0.42,'#E4F6FF');sky.addColorStop(0.42,'#2E9FE0');sky.addColorStop(1,'#1668A8');
    g.fillStyle=sky;g.fillRect(0,0,W,H);
    g.fillStyle='#FFE14A';g.beginPath();g.arc(W*0.84,H*0.14,Math.min(W,H)*0.06,0,7);g.fill();
    g.fillStyle='rgba(255,255,255,.9)';trackCloud(g,W*0.2,H*0.16,30);
    g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=3;
    for(let i=0;i<4;i++){
      const y=H*(0.55+i*0.1);
      g.beginPath();g.moveTo(0,y);
      for(let x=0;x<=W;x+=24)g.lineTo(x,y+Math.sin((x/40)+clock*2+i)*4);
      g.stroke();
    }
    return;
  }
  if(scene==='field'){
    sky.addColorStop(0,'#8ED0FF');sky.addColorStop(0.4,'#E7F8C8');sky.addColorStop(0.4,'#C6E36A');sky.addColorStop(1,'#7CB342');
    g.fillStyle=sky;g.fillRect(0,0,W,H);
    g.fillStyle='#FFE14A';g.beginPath();g.arc(W*0.16,H*0.14,Math.min(W,H)*0.06,0,7);g.fill();
    g.strokeStyle='rgba(90,140,40,.45)';g.lineWidth=8;
    for(let y=H*0.48;y<H;y+=H*0.08){g.beginPath();g.moveTo(0,y);g.lineTo(W,y+8);g.stroke();}
    g.fillStyle='#C96B4A';g.fillRect(W*0.72,H*0.28,W*0.16,H*0.14);
    g.fillStyle='#8B3A2A';g.beginPath();g.moveTo(W*0.70,H*0.28);g.lineTo(W*0.80,H*0.18);g.lineTo(W*0.90,H*0.28);g.fill();
    return;
  }
  if(scene==='rails'){
    sky.addColorStop(0,'#7EC8FF');sky.addColorStop(0.5,'#E7F6FF');sky.addColorStop(0.5,'#8FCB6A');sky.addColorStop(1,'#3E9A48');
    g.fillStyle=sky;g.fillRect(0,0,W,H);
    g.fillStyle='#67B85A';g.beginPath();g.moveTo(0,H*0.55);g.quadraticCurveTo(W*0.4,H*0.4,W,H*0.52);g.lineTo(W,H*0.62);g.lineTo(0,H*0.62);g.fill();
    g.fillStyle='#C96B4A';g.fillRect(W*0.08,H*0.4,W*0.18,H*0.16);
    g.fillStyle='#7EC8FF';g.fillRect(W*0.12,H*0.44,W*0.05,H*0.06);g.fillRect(W*0.19,H*0.44,W*0.05,H*0.06);
    const y=H*0.72;
    g.strokeStyle='#5C4632';g.lineWidth=4;g.beginPath();g.moveTo(0,y-10);g.lineTo(W,y-10);g.moveTo(0,y+10);g.lineTo(W,y+10);g.stroke();
    g.strokeStyle='#8B6844';g.lineWidth=5;
    for(let x=8;x<W;x+=22){g.beginPath();g.moveTo(x,y-16);g.lineTo(x,y+16);g.stroke();}
    return;
  }
  sky.addColorStop(0,'#7EC8FF');sky.addColorStop(0.48,'#E7F4FF');sky.addColorStop(0.48,'#B9C4CE');sky.addColorStop(1,'#8E99A6');
  g.fillStyle=sky;g.fillRect(0,0,W,H);
  g.fillStyle='#FFE14A';g.beginPath();g.arc(W*0.86,H*0.14,Math.min(W,H)*0.055,0,7);g.fill();
  g.fillStyle='rgba(255,255,255,.92)';trackCloud(g,W*0.18,H*0.16,26);
  [[0.08,'#F07A6A',0.22],[0.38,'#F2C14E',0.3],[0.62,'#7EB6E0',0.18]].forEach(([x,c,h])=>{
    g.fillStyle=c;g.fillRect(W*x,H*(0.48-h),W*0.16,H*h);
    g.fillStyle='#fff';g.fillRect(W*(x+0.03),H*(0.5-h*0.6),W*0.04,H*0.05);
  });
  g.fillStyle='#6E7784';g.fillRect(0,H*0.78,W,H*0.08);
  g.strokeStyle='#F6E27A';g.lineWidth=3;g.setLineDash([16,14]);
  g.beginPath();g.moveTo(0,H*0.82);g.lineTo(W,H*0.82);g.stroke();g.setLineDash([]);
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
  if(TRACK.full&&TRACK.phase==='draw'&&TRACK.raw.length){
    const end=TRACK.raw[TRACK.raw.length-1];
    trackG.fillStyle='#FFD24A';trackG.beginPath();trackG.arc(end.x,end.y,10+Math.sin(TRACK.clock*6)*2,0,7);trackG.fill();
  }
}
function startRoad(){
  showPane('roadPlay');
  trackOpen();
}

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
