/* =============================================================
   WORLD — a real, zoomable map.
   Pinch with two fingers (or ➕ ➖) to zoom, drag to move, double-tap
   to zoom in. Tap a continent to fly into it; zoomed in, every country
   shows its flag and name, and tapping one says it. Quizzes: continents,
   "Wo ist Spanien?", flags, and the five oceans. A wrong tap teaches the
   name of what was tapped ("Das ist Frankreich").
   Projection: Miller cylindrical — shapes stay recognisable when zoomed.
============================================================= */
const CONTINENTS=[
 {k:'AF',col:'#F2A93B',lab:[20,6],view:[-20,-36,52,38],
  es:['África','Aquí viven los leones y los elefantes.'],en:['Africa','Lions and elephants live here.'],de:['Afrika','Hier leben Löwen und Elefanten.']},
 {k:'EU',col:'#6FD08C',lab:[15,53],view:[-25,35,45,71],
  es:['Europa','Aquí están España y Alemania.'],en:['Europe','Spain and Germany are here.'],de:['Europa','Hier sind Spanien und Deutschland.']},
 {k:'AS',col:'#F07B7B',lab:[90,45],view:[25,-11,150,62],
  es:['Asia','Es el continente más grande de todos.'],en:['Asia','It is the biggest continent of all.'],de:['Asien','Es ist der größte Kontinent von allen.']},
 {k:'NA',col:'#64B8F0',lab:[-100,47],view:[-170,7,-52,83],
  es:['América del Norte','Aquí están Canadá y Estados Unidos.'],en:['North America','Canada and the United States are here.'],de:['Nordamerika','Hier sind Kanada und die USA.']},
 {k:'SA',col:'#C890F0',lab:[-60,-15],view:[-84,-56,-33,13],
  es:['América del Sur','Aquí está la selva del Amazonas.'],en:['South America','The Amazon rainforest is here.'],de:['Südamerika','Hier ist der Amazonas-Regenwald.']},
 {k:'OC',col:'#F0D85A',lab:[134,-25],view:[110,-48,180,-5],
  es:['Oceanía','Aquí están Australia y los canguros.'],en:['Oceania','Australia and the kangaroos are here.'],de:['Ozeanien','Hier sind Australien und die Kängurus.']},
 {k:'AN',col:'#E4F0F6',lab:[0,-75],view:[-180,-85,180,-60],
  es:['la Antártida','Es el lugar más frío, lleno de pingüinos.'],en:['Antarctica','It is the coldest place, full of penguins.'],de:['die Antarktis','Der kälteste Ort, voller Pinguine.']}
];
const OCEANS=[
 {k:'atl',lab:[[-37,28],[-14,-30]],de:['der Atlantik','Atlantik'],en:['the Atlantic Ocean','Atlantic'],es:['el océano Atlántico','Atlántico']},
 {k:'pac',lab:[[-140,8],[168,18]],de:['der Pazifik','Pazifik'],en:['the Pacific Ocean','Pacific'],es:['el océano Pacífico','Pacífico']},
 {k:'ind',lab:[[78,-22]],de:['der Indische Ozean','Indischer Ozean'],en:['the Indian Ocean','Indian Ocean'],es:['el océano Índico','Índico']},
 {k:'arc',lab:[[-10,79]],de:['das Nordpolarmeer','Nordpolarmeer'],en:['the Arctic Ocean','Arctic Ocean'],es:['el océano Ártico','Ártico']},
 {k:'sou',lab:[[40,-62]],de:['das Südpolarmeer','Südpolarmeer'],en:['the Southern Ocean','Southern Ocean'],es:['el océano Antártico','Antártico']}
];
/* countries a four-year-old may have heard of first, then more */
const FAMOUS1=['ES','DE','FR','IT','GB','PT','US','CA','MX','BR','AR','CN','IN','JP','RU','AU','EG','ZA','MA','CL'];
const FAMOUS2=FAMOUS1.concat(['NL','BE','CH','AT','PL','SE','NO','FI','DK','IE','GR','TR','CO','PE','VE','CU','SA','IR','TH','VN','ID','KR','NZ','NG','KE','ET','DZ','UA','IS','GL','MG','PH','PK','KZ','MN']);
const GEO_Q=[
 {a:'OC',es:'¿Dónde viven los canguros?',en:'Where do kangaroos live?',de:'Wo leben Kängurus?'},
 {a:'SA',es:'¿Dónde está la selva del Amazonas?',en:'Where is the Amazon rainforest?',de:'Wo ist der Amazonas-Regenwald?'},
 {a:'AS',es:'¿Dónde viven los pandas?',en:'Where do pandas live?',de:'Wo leben Pandas?'},
 {a:'AS',es:'¿Dónde viven los tigres?',en:'Where do tigers live?',de:'Wo leben Tiger?'},
 {a:'AF',es:'¿Dónde viven las cebras?',en:'Where do zebras live?',de:'Wo leben Zebras?'},
 {a:'AF',es:'¿Dónde están las pirámides de Egipto?',en:'Where are the pyramids of Egypt?',de:'Wo sind die Pyramiden von Ägypten?'},
 {a:'AN',es:'¿Cuál es el lugar más frío?',en:'Where is the coldest place?',de:'Wo ist es am kältesten?'},
 {a:'AS',es:'¿Cuál es el continente más grande?',en:'Which is the biggest continent?',de:'Welcher ist der größte Kontinent?'}
];

/* ---------- projection + data ---------- */
const DEG=Math.PI/180;
const projY=lat=>-1.25*Math.log(Math.tan(Math.PI/4+0.4*Math.max(-85,Math.min(85,lat))*DEG))/DEG;
const unprojY=y=>(Math.atan(Math.exp(-y*DEG/1.25))-Math.PI/4)/0.4/DEG;
const flagOf=a2=>String.fromCodePoint(...[...a2].map(c=>0x1F1E6+c.charCodeAt(0)-65));
const COUNTRIES=WORLD_COUNTRIES.map(([a2,cont,enc])=>{
  let bx0=1e9,by0=1e9,bx1=-1e9,by1=-1e9,best=null,bestA=-1;
  const rings=enc.split(';').map(r=>{
    const v=r.split(',').map(Number),pts=new Float32Array(v.length);let x=0,y=0;
    for(let i=0;i<v.length;i+=2){x+=v[i];y+=v[i+1];const px=x/WORLD_Q,py=projY(y/WORLD_Q);pts[i]=px;pts[i+1]=py;
      if(px<bx0)bx0=px;if(px>bx1)bx1=px;if(py<by0)by0=py;if(py>by1)by1=py;}
    let A=0,cx=0,cy=0;for(let i=0;i<pts.length;i+=2){const j=(i+2)%pts.length,c=pts[i]*pts[j+1]-pts[j]*pts[i+1];A+=c;cx+=(pts[i]+pts[j])*c;cy+=(pts[i+1]+pts[j+1])*c;}
    if(Math.abs(A)>bestA){bestA=Math.abs(A);best=A?[cx/(3*A),cy/(3*A)]:[pts[0],pts[1]];}
    return pts;
  });
  const path=new Path2D();rings.forEach(p=>{path.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)path.lineTo(p[i],p[i+1]);path.closePath();});
  let h=0;for(const ch of a2)h=h*31+ch.charCodeAt(0);
  return {a2,cont,rings,path,box:[bx0,by0,bx1,by1],lab:best,area:bestA/2,shade:(h%7)/7};
});
const C_BY=Object.fromEntries(COUNTRIES.map(c=>[c.a2,c]));
const cName=c=>(WORLD_NAMES[lang]&&WORLD_NAMES[lang][c.a2])||c.a2;
/* countries that take an article (and sometimes a plural verb) in a sentence */
const C_ART={
 de:{NL:['die',1],US:['die',1],AE:['die',1],PH:['die',1],BS:['die',1],SB:['die',1],CH:['die'],TR:['die'],UA:['die'],MN:['die'],SK:['die'],
     DO:['die'],CG:['die'],GM:['die'],IR:['der'],IQ:['der'],SD:['der'],SS:['der'],TD:['der'],LB:['der'],YE:['der'],CD:['der'],VA:['der'],NE:['der']},
 en:{NL:['the',1],US:['the'],GB:['the'],PH:['the',1],BS:['the',1],SB:['the',1],AE:['the'],DO:['the'],VA:['the'],GM:['the'],CD:['the'],CG:['the']},
 es:{NL:['los',1],GB:['el'],AE:['los',1]}};
function cNP(c){const a=(C_ART[lang]||{})[c.a2];return {np:(a?a[0]+' ':'')+cName(c),pl:!!(a&&a[1])};}
const deDel=t=>t.replace(/\bde el\b/g,'del');
const contOf=k=>CONTINENTS.find(c=>c.k===k);
const WX0=-180,WX1=180,WY0=projY(84),WY1=projY(-72);   // world frame (Antarctica partly)
let FLAGS_OK=true;
function pointIn(c,x,y){
  if(x<c.box[0]||x>c.box[2]||y<c.box[1]||y>c.box[3])return false;
  let inside=false;
  for(const p of c.rings){for(let i=0,j=p.length-2;i<p.length;j=i,i+=2){
    const yi=p[i+1],yj=p[j+1];if((yi>y)!==(yj>y)&&x<(p[j]-p[i])*(y-yi)/(yj-yi)+p[i])inside=!inside;}}
  return inside;
}
const countryAt=(x,y)=>{let hit=null;for(const c of COUNTRIES)if(pointIn(c,x,y)&&(!hit||c.area<hit.area))hit=c;return hit;};
function oceanAt(lon,lat){
  if(lat>66)return 'arc';if(lat<-58)return 'sou';
  if(lon>=20&&lon<=100&&lat<=30)return 'ind';
  if(lon>100&&lon<=147&&lat<-10)return 'ind';
  if(lat>=10&&lon>=-100&&lon<=40)return 'atl';
  if(lat>=0&&lat<10&&lon>=-80&&lon<=20)return 'atl';
  if(lat<0&&lon>=-68&&lon<=20)return 'atl';
  return 'pac';
}

/* ---------- camera ---------- */
const mapC=$('map'),mx=mapC.getContext('2d');
let MW=360,MH=360,CAM={x:0,y:0,k:1},camAnim=null,mapDirty=false;
const kWorld=()=>Math.min(MW/(WX1-WX0),MH/(WY1-WY0));
function viewOf(x0,y0,x1,y1,pad){const k=Math.min(MW/(x1-x0),MH/(y1-y0))*(pad||0.92);return {x:(x0+x1)/2-MW/2/k,y:(y0+y1)/2-MH/2/k,k};}
const viewLL=(l0,a0,l1,a1)=>viewOf(l0,projY(a1),l1,projY(a0));
const worldView=()=>viewOf(WX0,WY0,WX1,WY1,1);
function clampCam(c){
  const kmin=kWorld()*0.9;c.k=Math.max(kmin,Math.min(kWorld()*60,c.k));
  const vw=MW/c.k,vh=MH/c.k;
  c.x=Math.max(WX0-vw*0.4,Math.min(WX1-vw*0.6,c.x));c.y=Math.max(WY0-vh*0.4,Math.min(projY(-85)-vh*0.6,c.y));return c;
}
function flyTo(v,ms){const from={...CAM},to=clampCam({...v}),t0=performance.now(),d=ms||650;
  camAnim={from,to,t0,d};redraw();}
const toWorld=(sx,sy)=>[CAM.x+sx/CAM.k,CAM.y+sy/CAM.k];
function zoomAt(sx,sy,f){const [wx,wy]=toWorld(sx,sy);CAM.k*=f;CAM.x=wx-sx/CAM.k;CAM.y=wy-sy/CAM.k;clampCam(CAM);redraw();}
function fitMap(){
  const r=mapC.getBoundingClientRect();if(!r.width)return;
  const dpr=Math.min(window.devicePixelRatio||1,2.5),w=Math.round(r.width*dpr),h=Math.round(r.height*dpr);
  const first=!MW||MW===360&&MH===360;MW=r.width;MH=r.height;
  if(mapC.width!==w||mapC.height!==h){mapC.width=w;mapC.height=h;}
  if(first||CAM.k<kWorld()*0.5)Object.assign(CAM,worldView());clampCam(CAM);redraw();
}
new ResizeObserver(fitMap).observe(mapC);

/* ---------- drawing ---------- */
let GEO={mode:'explore',sel:null,selCont:null,flash:null,target:null,q:'',miss:0,glow:null};
function redraw(){if(!mapDirty){mapDirty=true;requestAnimationFrame(drawMap);}}
function drawMap(now){
  mapDirty=false;if(typeof activeTab==='undefined'||activeTab!=='geo')return;
  now=now||performance.now();
  if(camAnim){const t=Math.min(1,(now-camAnim.t0)/camAnim.d),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,A=camAnim.from,B=camAnim.to;
    const lk=Math.log(A.k)+(Math.log(B.k)-Math.log(A.k))*e;CAM.k=Math.exp(lk);
    const cxA=A.x+MW/2/A.k,cyA=A.y+MH/2/A.k,cxB=B.x+MW/2/B.k,cyB=B.y+MH/2/B.k;
    CAM.x=cxA+(cxB-cxA)*e-MW/2/CAM.k;CAM.y=cyA+(cyB-cyA)*e-MH/2/CAM.k;if(t>=1)camAnim=null;}
  const g=mx,dpr=mapC.width/MW;
  g.setTransform(dpr,0,0,dpr,0,0);
  const sea=g.createLinearGradient(0,0,0,MH);sea.addColorStop(0,'#2C86D9');sea.addColorStop(1,'#165FAE');g.fillStyle=sea;g.fillRect(0,0,MW,MH);
  g.save();g.setTransform(dpr*CAM.k,0,0,dpr*CAM.k,-CAM.x*CAM.k*dpr,-CAM.y*CAM.k*dpr);
  const vx0=CAM.x,vy0=CAM.y,vx1=CAM.x+MW/CAM.k,vy1=CAM.y+MH/CAM.k,zoomed=CAM.k>kWorld()*1.7;
  const pulse=0.5+0.5*Math.sin(now/180);
  for(const c of COUNTRIES){
    if(c.box[2]<vx0||c.box[0]>vx1||c.box[3]<vy0||c.box[1]>vy1)continue;
    const base=contOf(c.cont).col;
    let fill=zoomed?shadeCol(base,c.shade):base;
    if(GEO.selCont===c.cont&&!zoomed)fill=shadeCol(base,-0.6);
    if(GEO.glow===c.a2)fill=`rgba(255,212,0,${0.55+0.45*pulse})`;
    if(GEO.sel===c.a2)fill='#FFD400';
    if(GEO.flash&&GEO.flash.a2===c.a2&&now<GEO.flash.until)fill=GEO.flash.ok?'#2ED17A':'#FF6B5E';
    g.fillStyle=fill;g.fill(c.path);
  }
  g.lineJoin='round';g.strokeStyle='rgba(5,6,15,.55)';g.lineWidth=(zoomed?1:0.6)/CAM.k;
  for(const c of COUNTRIES){if(c.box[2]<vx0||c.box[0]>vx1||c.box[3]<vy0||c.box[1]>vy1)continue;g.stroke(c.path);}
  const hot=GEO.sel||GEO.glow;if(hot&&C_BY[hot]){g.strokeStyle='#05060F';g.lineWidth=3/CAM.k;g.stroke(C_BY[hot].path);}
  g.restore();
  /* labels in screen space */
  const S=(x,y)=>[(x-CAM.x)*CAM.k,(y-CAM.y)*CAM.k];
  g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
  const label=(t,x,y,size,col,italic)=>{g.font=`${italic?'italic ':''}bold ${size}px "Trebuchet MS",Verdana,sans-serif`;
    g.lineWidth=Math.max(3,size*0.28);g.strokeStyle='rgba(5,6,15,.85)';g.strokeText(t,x,y);g.fillStyle=col;g.fillText(t,x,y);};
  /* while a question is open, the map must not show the answer */
  const asking=GEO.mode!=='explore'&&(GEO.target||GEO.glow);
  if(!zoomed){
    if(!(asking&&GEO.mode==='oceans'))OCEANS.forEach(o=>o.lab.forEach(([lo,la])=>{const [x,y]=S(lo,projY(la));label(o[lang][1],x,y,Math.max(10,Math.min(15,MW/30)),'#BFE4FF',true);}));
    if(!(asking&&GEO.mode==='continents'))CONTINENTS.forEach(c=>{const [x,y]=S(c.lab[0],projY(c.lab[1]));label(c[lang][0].replace(/^(la|die|the)\s+/i,''),x,y,Math.max(12,Math.min(19,MW/22)),'#fff');});
  }else if(!asking){
    const placed=[];
    const cand=COUNTRIES.map(c=>{const w=(c.box[2]-c.box[0])*CAM.k,h=(c.box[3]-c.box[1])*CAM.k;return {c,w,h};})
      .filter(o=>o.w>34&&o.h>16&&o.c.box[2]>vx0&&o.c.box[0]<vx1&&o.c.box[3]>vy0&&o.c.box[1]<vy1).sort((a,b)=>b.c.area-a.c.area);
    for(const {c,w} of cand){
      const [x,y]=S(c.lab[0],c.lab[1]),fs=Math.max(15,Math.min(34,w*0.28)),ts=Math.max(10,Math.min(15,w*0.12));
      const name=cName(c),tw=name.length*ts*0.55,bw=Math.max(fs,tw),bh=fs+ts+4,R=[x-bw/2,y-bh/2,x+bw/2,y+bh/2];
      if(placed.some(q=>R[0]<q[2]&&R[2]>q[0]&&R[1]<q[3]&&R[3]>q[1]))continue;placed.push(R);
      if(FLAGS_OK){g.font=`${fs}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif`;g.fillText(flagOf(c.a2),x,y-ts*0.6);}
      label(name,x,y+fs*0.45,ts,c.a2===GEO.sel?'#FFD400':'#fff');
    }
  }
  if(camAnim||GEO.glow||(GEO.flash&&now<GEO.flash.until))redraw();
}
function shadeCol(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16&255,g=n>>8&255,b=n&255;
  if(f<0){f=-f;r*=1-f*0.35;g*=1-f*0.35;b*=1-f*0.35;}else{const m=0.82+f*0.3;r=Math.min(255,r*m+20*f);g=Math.min(255,g*m+20*f);b=Math.min(255,b*m+20*f);}
  return `rgb(${r|0},${g|0},${b|0})`;}

/* ---------- touch: pinch, drag, tap, double-tap ---------- */
const mPtr=new Map();let gStart=null,lastTapT=0,lastTapXY=[0,0];
const mxy=e=>{const r=mapC.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
mapC.addEventListener('pointerdown',e=>{e.preventDefault();ac();try{mapC.setPointerCapture(e.pointerId);}catch(_){}
  mPtr.set(e.pointerId,mxy(e));camAnim=null;
  if(mPtr.size===1)gStart={t:performance.now(),p:mxy(e),moved:false,cam:{...CAM}};
  if(mPtr.size===2){const [a,b]=[...mPtr.values()];gStart={pinch:true,d:Math.hypot(a[0]-b[0],a[1]-b[1]),mid:[(a[0]+b[0])/2,(a[1]+b[1])/2],cam:{...CAM},moved:true};}
});
mapC.addEventListener('pointermove',e=>{
  if(!mPtr.has(e.pointerId)||!gStart)return;e.preventDefault();mPtr.set(e.pointerId,mxy(e));
  if(mPtr.size>=2&&gStart.pinch){const [a,b]=[...mPtr.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]),mid=[(a[0]+b[0])/2,(a[1]+b[1])/2],C0=gStart.cam;
    const wx=C0.x+gStart.mid[0]/C0.k,wy=C0.y+gStart.mid[1]/C0.k;CAM.k=C0.k*d/gStart.d;CAM.x=wx-mid[0]/CAM.k;CAM.y=wy-mid[1]/CAM.k;clampCam(CAM);redraw();return;}
  if(mPtr.size===1&&!gStart.pinch){const p=mxy(e),dx=p[0]-gStart.p[0],dy=p[1]-gStart.p[1];
    if(Math.hypot(dx,dy)>8)gStart.moved=true;
    if(gStart.moved){CAM.x=gStart.cam.x-dx/CAM.k;CAM.y=gStart.cam.y-dy/CAM.k;clampCam(CAM);redraw();}}
});
const mEnd=e=>{
  if(!mPtr.has(e.pointerId))return;const p=mPtr.get(e.pointerId);mPtr.delete(e.pointerId);
  if(gStart&&gStart.pinch){if(mPtr.size===1){const q=[...mPtr.values()][0];gStart={t:0,p:q,moved:true,cam:{...CAM}};}else if(!mPtr.size)gStart=null;return;}
  if(gStart&&!gStart.moved&&performance.now()-gStart.t<500){
    const now=performance.now();
    if(now-lastTapT<320&&Math.hypot(p[0]-lastTapXY[0],p[1]-lastTapXY[1])<30){lastTapT=0;flyTo({...CAM,k:CAM.k*2,x:CAM.x+p[0]/CAM.k-p[0]/(CAM.k*2),y:CAM.y+p[1]/CAM.k-p[1]/(CAM.k*2)},300);}
    else{lastTapT=now;lastTapXY=p;geoTap(p[0],p[1]);}
  }
  if(!mPtr.size)gStart=null;
};
['pointerup','pointercancel'].forEach(ev=>mapC.addEventListener(ev,mEnd));
mapC.addEventListener('wheel',e=>{e.preventDefault();const p=mxy(e);zoomAt(p[0],p[1],e.deltaY<0?1.2:1/1.2);},{passive:false});
$('geoZin').onclick=()=>{ac();camAnim=null;zoomAt(MW/2,MH/2,1.6);};
$('geoZout').onclick=()=>{ac();camAnim=null;zoomAt(MW/2,MH/2,1/1.6);};
$('geoHome').onclick=()=>{ac();GEO.selCont=null;GEO.sel=null;flyTo(worldView());geoInfo(null);};

/* ---------- what a tap means ---------- */
function geoTap(sx,sy){
  const [wx,wy]=toWorld(sx,sy),lon=wx,lat=unprojY(wy),c=countryAt(wx,wy),zoomed=CAM.k>kWorld()*1.7;
  const m=GEO.mode;
  if(m==='countries'&&GEO.target)return answerCountry(c);
  if(m==='continents'&&GEO.target)return answerContinent(c&&c.cont);
  if(m==='oceans'&&GEO.target)return answerOcean(c?null:oceanAt(lon,lat),c);
  if(m==='flags')return;
  if(!c){const o=OCEANS.find(o=>o.k===oceanAt(lon,lat));geoInfo({ocean:o});say(o[lang][0]);return;}
  if(!zoomed){const ct=contOf(c.cont);GEO.selCont=ct.k;GEO.sel=null;flyTo(viewLL(...ct.view));geoInfo({cont:ct});say(ct[lang][0]+'. '+ct[lang][1]);beep(660,0,0.12,'square',0.14);return;}
  GEO.sel=c.a2;redraw();geoInfo({country:c});say(cName(c));beep(880,0,0.1,'triangle',0.14);
}
function geoInfo(o){
  const N=$('geoName'),T=$('geoText');
  if(!o){N.textContent='🌍';T.textContent={es:'Toca un continente. Pellizca con dos dedos para el zoom.',en:'Tap a continent. Pinch with two fingers to zoom.',de:'Tippe auf einen Kontinent. Mit zwei Fingern zoomen.'}[lang];return;}
  if(o.cont){N.textContent=o.cont[lang][0];T.textContent=o.cont[lang][1];return;}
  if(o.ocean){N.textContent='🌊 '+o.ocean[lang][1];T.textContent=capFirst(o.ocean[lang][0]);return;}
  if(o.country){const c=o.country;N.innerHTML=`<span class="geoFlag">${FLAGS_OK?flagOf(c.a2):''}</span> ${cName(c)}`;T.textContent=contOf(c.cont)[lang][0].replace(/^(la|die|the)\s+/i,'');}
}

/* ---------- quizzes ---------- */
const GEO_MODES=[['explore','🔍'],['continents','🌍'],['countries','📍'],['flags','🏳️'],['oceans','🌊']];
function buildGeoModes(){
  const box=$('geoModes');box.innerHTML='';
  GEO_MODES.forEach(([m,ic])=>{const b=document.createElement('button');b.className='seg modeBtn'+(GEO.mode===m?' on':'');b.textContent=ic;
    b.title={explore:{es:'Explorar',en:'Explore',de:'Entdecken'},continents:{es:'Continentes',en:'Continents',de:'Kontinente'},countries:{es:'Países',en:'Countries',de:'Länder'},
      flags:{es:'Banderas',en:'Flags',de:'Flaggen'},oceans:{es:'Océanos',en:'Oceans',de:'Ozeane'}}[m][lang];
    b.onclick=()=>{ac();setGeoMode(m);};box.appendChild(b);});
}
function setGeoMode(m){
  GEO.mode=m;GEO.target=null;GEO.sel=null;GEO.glow=null;GEO.selCont=null;buildGeoModes();$('geoFlags').innerHTML='';$('geoFlags').classList.remove('on');
  $('geoLevel').style.visibility=m==='explore'?'hidden':'visible';
  if(m==='explore'){$('geoQ').textContent='';$('geoQ').classList.remove('on');flyTo(worldView());geoInfo(null);
    say({es:'¡Explora el mundo!',en:'Explore the world!',de:'Entdecke die Welt!'}[lang]);return;}
  geoAsk();
}
function geoQSet(q){GEO.q=q;$('geoQ').textContent=q;$('geoQ').classList.add('on');say(q);}
function countryPool(L){
  const list=L<=1?FAMOUS1:L===2?FAMOUS2:COUNTRIES.filter(c=>c.area>4&&c.cont!=='AN').map(c=>c.a2);
  return list.filter(a=>C_BY[a]);
}
function geoAsk(){
  const L=level('geo',3);GEO.miss=0;GEO.sel=null;GEO.glow=null;$('geoLevel').textContent='🎯 '+L;
  const W=(n,de)=>lang==='es'?`¿Dónde está ${n}?`:lang==='de'?`Wo ist ${n}?`:`Where is ${n}?`;
  if(GEO.mode==='continents'){
    if(L>=2&&Math.random()<0.5){const q=pick(GEO_Q);GEO.target=q.a;flyTo(worldView());geoInfo(null);geoQSet(q[lang]);return;}
    const ct=pick(CONTINENTS.filter(c=>c.k!==GEO.target));GEO.target=ct.k;flyTo(worldView());geoInfo(null);geoQSet(W(ct[lang][0]));return;
  }
  if(GEO.mode==='oceans'){const o=pick(OCEANS.filter(o=>o.k!==GEO.target));GEO.target=o.k;flyTo(worldView());geoInfo(null);geoQSet(W(o[lang][0]));return;}
  const pool=countryPool(L).filter(a=>a!==GEO.target),c=C_BY[pick(pool)];GEO.target=c.a2;
  const ct=contOf(c.cont);flyTo(viewLL(...ct.view));
  if(GEO.mode==='countries'){geoInfo(null);$('geoName').innerHTML=L===1&&FLAGS_OK?`<span class="geoFlag">${flagOf(c.a2)}</span>`:'📍';
    $('geoText').textContent=ct[lang][0].replace(/^(la|die|the)\s+/i,'');const n=cNP(c);
    geoQSet(n.pl?(lang==='es'?`¿Dónde están ${n.np}?`:lang==='de'?`Wo sind ${n.np}?`:`Where are ${n.np}?`):W(n.np));return;}
  /* flags: the country glows on the map; pick its flag */
  GEO.glow=c.a2;redraw();geoInfo({country:c});$('geoName').innerHTML=cName(c);
  const n=L===1?3:4,same=L===3;
  const others=shuffle(countryPool(Math.max(2,L)).filter(a=>a!==c.a2&&(!same||C_BY[a].cont===c.cont)));
  const opts=shuffle([c.a2,...others.slice(0,n-1)]);
  const box=$('geoFlags');box.innerHTML='';box.classList.add('on');
  opts.forEach(a=>{const b=document.createElement('button');b.className='flagBtn';b.textContent=FLAGS_OK?flagOf(a):a;b.onclick=()=>answerFlag(a,b);box.appendChild(b);});
  const fn=cNP(c);
  geoQSet(lang==='es'?deDel(`¿Cuál es la bandera de ${fn.np}?`):lang==='de'?`Welche Flagge ${fn.pl?'haben':'hat'} ${fn.np}?`:`Which flag belongs to ${fn.np}?`);
}
const isNow=(lg,pl)=>pl?{es:'Estos son ',en:'These are ',de:'Das sind '}[lg]:{es:'Esto es ',en:'This is ',de:'Das ist '}[lg];
function geoRight(){bigWin();award(GEO.miss);levelFx($('geoLevel'),adapt('geo',3,GEO.miss===0));setTimeout(()=>{if(activeTab==='geo'&&GEO.mode!=='explore')geoAsk();},2600);}
function geoWrong(what,pl){GEO.miss++;nope();if(what)say(isNow(lang,pl)+what+'. '+GEO.q);else if(GEO.miss>=2)say(GEO.q);}
function answerCountry(c){
  if(!c)return geoWrong(null);
  if(c.a2===GEO.target){GEO.sel=c.a2;GEO.flash={a2:c.a2,ok:true,until:performance.now()+900};geoInfo({country:c});say(cName(c)+'!');
    flyTo(viewOf(c.box[0],c.box[1],c.box[2],c.box[3],0.5));GEO.target=null;geoRight();}
  else{GEO.flash={a2:c.a2,ok:false,until:performance.now()+900};redraw();const n=cNP(c);geoWrong(n.np,n.pl);
    if(GEO.miss>=3){GEO.glow=GEO.target;redraw();}}
}
function answerContinent(k){
  if(!k)return geoWrong(null);
  const ct=contOf(k);
  if(k===GEO.target){GEO.selCont=k;GEO.target=null;geoInfo({cont:ct});say(ct[lang][0]+'. '+ct[lang][1]);redraw();geoRight();}
  else geoWrong(ct[lang][0]);
}
function answerOcean(k,c){
  if(c){const n=cNP(c);return geoWrong(n.np,n.pl);}
  const o=OCEANS.find(x=>x.k===k);
  if(k===GEO.target){GEO.target=null;geoInfo({ocean:o});say(capFirst(o[lang][0])+'!');geoRight();}
  else geoWrong(o[lang][0]);
}
function answerFlag(a,b){
  ac();if(!GEO.glow)return;
  if(a===GEO.glow){b.classList.add('right');GEO.sel=a;const c=C_BY[a];GEO.glow=null;say(cName(c)+'!');geoInfo({country:c});
    flyTo(viewOf(c.box[0],c.box[1],c.box[2],c.box[3],0.5));geoRight();}
  else{b.classList.remove('wrong');void b.offsetWidth;b.classList.add('wrong');GEO.miss++;nope();
    say(deDel(isNow(lang)+({es:'la bandera de ',en:'the flag of ',de:'die Flagge von '}[lang])+cNP(C_BY[a]).np)+'. '+GEO.q);}
}
$('geoSay').onclick=()=>{ac();if(GEO.mode!=='explore'&&GEO.q)say(GEO.q);else{const t=$('geoName').textContent+'. '+$('geoText').textContent;say(t);}};
function showGeo(){
  FLAGS_OK=emojiOK('🇩🇪');buildGeoModes();fitMap();
  if(GEO.mode==='explore'){geoInfo(GEO.sel&&C_BY[GEO.sel]?{country:C_BY[GEO.sel]}:null);$('geoLevel').style.visibility='hidden';}
  else if(GEO.q)say(GEO.q);
  redraw();
}
