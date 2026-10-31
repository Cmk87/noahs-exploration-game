/* =============================================================
   THE EDGES OF THE WORLD (loaded before js/city.js, which calls
   cityEdge(K)). Above the sky it slowly gets dark and space begins:
   stars, the Moon, Mars, Saturn, a satellite, a comet, an astronaut on
   a spacewalk. Below the sea it gets deeper, darker and colder, with
   animals at the depths where they really live: turtle, manta ray and a
   school of fish near the light; shark, sperm whale and jellyfish in the
   twilight; anglerfish, giant squid and glowing jellies in the dark; a
   shipwreck with a treasure chest and a little submarine on the seabed.
============================================================= */
function cityEdge(K){
const {rr,circ,ell,poly,ln,ent,ANIMALS,hit,fx,act,later,burst,textP,PARTS,SND,swp,sr,li,ST,TAP,VIEW,TAU,g}=K;
const ANI=(id,ic,n,l)=>{ANIMALS.push([id,ic,n,l]);ent(id,ic,n,l,{animal:1});};
const at=(id,b)=>{K.ENT[id].at=b;};
const inV=(x0,y0,x1,y1)=>x1>VIEW[0]&&x0<VIEW[2]&&y1>VIEW[1]&&y0<VIEW[3];
const flip=(x,y,f,fn)=>{g.save();g.translate(x,y);g.scale(f,1);fn();g.restore();};
const TT=()=>ST.T,L3=a=>a[li()];
const SKY0=-1700,SPACE0=-2600,DEEP0=2500,BED=4300;   // where the sky turns into space, where the deep sea and the seabed begin

/* ---------- words ---------- */
ent('sky','☁️',['der Himmel','the sky','el cielo'],['Der Himmel! Ganz hoch oben wird er dunkel – da beginnt das Weltall.','The sky! Very high up it gets dark – that is where space begins.','¡El cielo! Muy arriba se oscurece: allí empieza el espacio.']);
ent('space','✨',['das Weltall','space','el espacio'],['Das Weltall! Hier sind die Sterne, der Mond und die Planeten.','Space! Here are the stars, the moon and the planets.','¡El espacio! Aquí están las estrellas, la luna y los planetas.']);
ent('mars','🔴',['der Mars','Mars','Marte'],['Der Mars! Man nennt ihn den roten Planeten.','Mars! It is called the red planet.','¡Marte! Lo llaman el planeta rojo.'],{find:1});
ent('saturn','🪐',['der Saturn','Saturn','Saturno'],['Der Saturn! Er hat wunderschöne Ringe aus Eis und Stein.','Saturn! It has beautiful rings made of ice and rock.','¡Saturno! Tiene unos anillos preciosos de hielo y roca.'],{find:1});
ent('satellite','🛰️',['der Satellit','the satellite','el satélite'],['Ein Satellit! Er fliegt immer um die Erde herum.','A satellite! It flies round and round the Earth.','¡Un satélite! Da vueltas y vueltas alrededor de la Tierra.']);
ent('comet','☄️',['der Komet','the comet','el cometa'],['Ein Komet! Er hat einen langen, leuchtenden Schweif.','A comet! It has a long, glowing tail.','¡Un cometa! Tiene una cola larga y brillante.']);
ent('deepsea','🤿',['die Tiefsee','the deep sea','las profundidades del mar'],['Die Tiefsee! Je tiefer, desto dunkler und kälter wird das Wasser.','The deep sea! The deeper you go, the darker and colder the water gets.','¡Las profundidades! Cuanto más hondo, más oscura y fría está el agua.']);
ent('wreck','⚓',['das Schiffswrack','the shipwreck','el barco hundido'],['Ein altes Schiffswrack! Es liegt schon lange auf dem Meeresgrund.','An old shipwreck! It has lain on the seabed for a long time.','¡Un barco hundido! Lleva mucho tiempo en el fondo del mar.'],{find:1});
ent('chest','💰',['die Schatztruhe','the treasure chest','el cofre del tesoro'],['Eine Schatztruhe! Sie ist voller Gold.','A treasure chest! It is full of gold.','¡Un cofre del tesoro! Está lleno de oro.'],{find:1});
ent('sub','🟡',['das U-Boot','the submarine','el submarino'],['Das Tiefsee-U-Boot! Mit seinem Scheinwerfer erforscht es den Meeresgrund.','The deep-sea submarine! It explores the seabed with its searchlight.','¡El submarino! Explora el fondo del mar con su foco.']);
ent('fishschool','🐟',['der Fischschwarm','the school of fish','el banco de peces'],['Ein Fischschwarm! Ganz viele kleine Fische schwimmen zusammen.','A school of fish! Lots of little fish swim together.','¡Un banco de peces! Muchos pececitos nadan juntos.']);
ANI('manta','🐟',['der Mantarochen','the manta ray','la mantarraya'],['Der Mantarochen! Er gleitet durchs Wasser wie ein Vogel.','The manta ray! It glides through the water like a bird.','¡La mantarraya! Planea por el agua como un pájaro.']);
ANI('spermwhale','🐋',['der Pottwal','the sperm whale','el cachalote'],['Der Pottwal! Er taucht tiefer als fast alle anderen Tiere.','The sperm whale! It dives deeper than almost any other animal.','¡El cachalote! Bucea más hondo que casi ningún otro animal.']);
ANI('jellyfish','🪼',['die Qualle','the jellyfish','la medusa'],['Die Qualle! Sie leuchtet im dunklen Wasser.','The jellyfish! It glows in the dark water.','¡La medusa! Brilla en el agua oscura.']);
ANI('squid','🦑',['der Riesenkalmar','the giant squid','el calamar gigante'],['Der Riesenkalmar! Er lebt ganz tief unten und hat riesige Augen.','The giant squid! It lives very deep down and has huge eyes.','¡El calamar gigante! Vive muy hondo y tiene unos ojos enormes.']);
ANI('anglerfish','🐡',['der Anglerfisch','the anglerfish','el rape abisal'],['Der Anglerfisch! Mit seinem Lämpchen lockt er kleine Fische an.','The anglerfish! It uses its little light to catch small fish.','¡El rape abisal! Con su lucecita atrae a los peces pequeños.']);

/* ---------- ground: the sky turning into space, the sea turning into the deep ---------- */
const hash=(a,b)=>{let h=(a*374761393+b*668265263)|0;h=(h^(h>>>13))*1274126177|0;return ((h^(h>>>16))>>>0)/4294967296;};
K.GROUND0.push(()=>{const T=TT(),x0=VIEW[0],x1=VIEW[2];
  if(VIEW[1]<SKY0){const y1=Math.min(SKY0,VIEW[3]),gr=g.createLinearGradient(0,SKY0,0,-4500);
    gr.addColorStop(0,'#BFE3FA');gr.addColorStop(0.25,'#7AA8E6');gr.addColorStop(0.5,'#2E3F8F');gr.addColorStop(0.75,'#0E1440');gr.addColorStop(1,'#05060F');
    g.fillStyle=gr;g.fillRect(x0,VIEW[1],x1-x0,y1-VIEW[1]+2);
    // stars, more and brighter the higher you go
    const C=150;for(let cy=Math.floor(Math.max(VIEW[1],-9000)/C);cy*C<Math.min(SPACE0+300,VIEW[3]);cy++)for(let cx=Math.floor(x0/C);cx*C<x1;cx++){
      const h=hash(cx,cy),sx=cx*C+h*C,sy=cy*C+hash(cy,cx)*C;if(sy>SPACE0+300)continue;const a=Math.min(1,(SPACE0+300-sy)/1100);
      g.globalAlpha=a*(0.55+0.45*Math.sin(T*2+h*40));circ(sx,sy,1.2+h*2.4,h>0.85?'#FFE9A0':'#FFFFFF');}
    g.globalAlpha=1;}
  if(VIEW[3]>DEEP0){const y0=Math.max(DEEP0,VIEW[1]),gr=g.createLinearGradient(0,DEEP0,0,5000);
    gr.addColorStop(0,'#2A80C4');gr.addColorStop(0.16,'#1C5E9E');gr.addColorStop(0.36,'#123E73');gr.addColorStop(0.56,'#0A2347');gr.addColorStop(0.76,'#051226');gr.addColorStop(1,'#02060F');
    g.fillStyle=gr;g.fillRect(x0,y0-2,x1-x0,VIEW[3]-y0+4);
    // sunbeams reaching down into the blue
    if(VIEW[1]<3200){const rg=g.createLinearGradient(0,DEEP0-100,0,3200);rg.addColorStop(0,'rgba(255,255,255,0)');rg.addColorStop(0.35,'rgba(255,255,255,.09)');rg.addColorStop(1,'rgba(255,255,255,0)');
      for(let k=Math.floor(x0/600);k*600<x1;k++){const bx=k*600+Math.sin(T*0.3+k)*40;g.fillStyle=rg;g.beginPath();g.moveTo(bx-40,DEEP0-100);g.lineTo(bx+50,DEEP0-100);g.lineTo(bx+330,3200);g.lineTo(bx+180,3200);g.closePath();g.fill();}}
    // the seabed
    if(VIEW[3]>BED-80){g.fillStyle='#1B2433';g.beginPath();g.moveTo(x0,VIEW[3]+10);for(let x=Math.floor(x0/40)*40;x<=x1+40;x+=40)g.lineTo(x,BED+Math.sin(x/170)*18+Math.sin(x/53)*7);g.lineTo(x1+40,VIEW[3]+10);g.closePath();g.fill();
      for(let k=Math.floor(x0/230);k*230<x1;k++){const h=hash(k,7),rx=k*230+h*120,ry=BED+12+h*30;ell(rx,ry,18+h*26,9+h*8,'#283346');
        if(h>0.4){const sw=Math.sin(T*1.5+k)*6;g.strokeStyle='#2E6B4A';g.lineWidth=4;g.beginPath();g.moveTo(rx+30,ry);g.quadraticCurveTo(rx+30+sw,ry-30,rx+30+sw*1.6,ry-60-h*30);g.stroke();}}}}
});

/* ---------- space ---------- */
function planet(x,y,r,c1,c2,spots){const gr=g.createRadialGradient(x-r*0.35,y-r*0.35,r*0.1,x,y,r);gr.addColorStop(0,c1);gr.addColorStop(1,c2);g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();
  (spots||[]).forEach(([dx,dy,s,c])=>ell(x+dx*r,y+dy*r,s*r,s*r*0.8,c));}
K.DYN.push(L=>{if(VIEW[1]>SPACE0+200)return;const T=TT();
  // the Moon
  if(inV(500,-3800,900,-3400))L.push({y:-3600,f:()=>{planet(700,-3600,95,'#F4F4F0','#B9B9C2',[[-0.3,-0.2,0.18,'#C9C9D2'],[0.35,0.15,0.13,'#C2C2CC'],[0.05,0.45,0.1,'#CACAD4'],[-0.45,0.35,0.08,'#C2C2CC']]);
    hit('moon',605,-3695,795,-3505);}});
  // Mars
  if(inV(2240,-4160,2360,-4040))L.push({y:-4100,f:()=>{const t=fx('mars'),s=t<1?1+Math.sin(t*12)*0.06:1;planet(2300,-4100,42*s,'#F08A5A','#A8402A',[[-0.2,-0.3,0.2,'#C8603E'],[0.3,0.2,0.16,'#B9533A']]);
    ell(2300,-4138*1,14,5,'#F6E8E0');hit('mars',2255,-4145,2345,-4055);}});
  // Saturn with its rings
  if(inV(3950,-4000,4250,-3800))L.push({y:-3900,f:()=>{const t=fx('saturn'),tilt=-0.35+(t<2?Math.sin(t*6)*0.08:0);
    g.save();g.translate(4100,-3900);g.rotate(tilt);g.strokeStyle='#D9C08A';g.lineWidth=10;g.beginPath();g.ellipse(0,0,135,34,0,Math.PI,TAU);g.stroke();g.restore();
    planet(4100,-3900,72,'#F2DDA8','#B8945A',[[0,-0.25,0.9,'rgba(200,160,100,.25)'],[0,0.2,0.9,'rgba(170,130,80,.25)']]);
    g.save();g.translate(4100,-3900);g.rotate(tilt);g.strokeStyle='#E8D2A0';g.lineWidth=10;g.beginPath();g.ellipse(0,0,135,34,0,0,Math.PI);g.stroke();g.strokeStyle='rgba(120,90,50,.4)';g.lineWidth=2;g.beginPath();g.ellipse(0,0,118,28,0,0,Math.PI);g.stroke();g.restore();
    hit('saturn',3965,-3975,4235,-3825);}});
  // an astronaut on a spacewalk, on a safety line to a little space station
  {const ax=1500+Math.sin(T*0.4)*40,ay=-3150+Math.sin(T*0.6)*30,rot=Math.sin(T*0.3)*0.6+(fx('astronaut')<3?fx('astronaut')*4:0);
    if(inV(1350,-3400,1850,-3000))L.push({y:-3150,f:()=>{
      rr(1660,-3330,140,46,10,'#D9DEE8');rr(1600,-3322,60,30,4,'#3B7DE2');rr(1800,-3322,60,30,4,'#3B7DE2');circ(1730,-3308,9,'#8ED2F4');
      g.strokeStyle='#F4F7FB';g.lineWidth=2;g.beginPath();g.moveTo(1662,-3300);g.quadraticCurveTo(1580,-3230,ax+8,ay-6);g.stroke();
      g.save();g.translate(ax,ay);g.rotate(rot);rr(-9,-14,18,24,6,'#F4F7FB');rr(-13,-12,6,16,3,'#F4F7FB');rr(7,-12,6,16,3,'#F4F7FB');rr(-7,8,6,12,3,'#E3E8F0');rr(1,8,6,12,3,'#E3E8F0');
      circ(0,-22,11,'#F4F7FB');ell(2,-22,8,6.5,'#F2B23A');ell(4,-24,3,2,'rgba(255,255,255,.7)');rr(-6,-8,12,7,2,'#3B7DE2');g.restore();
      hit('astronaut',ax-22,ay-36,ax+22,ay+22,{moving:1,small:1});}});}
});
K.TOP.push(()=>{if(VIEW[1]>-2300)return;const T=TT();
  // a satellite crossing the sky
  {const sx=-1500+((T*45)%7200),sy=-2800+Math.sin(T*0.2)*60;if(inV(sx-60,sy-30,sx+60,sy+30)){
    rr(sx-12,sy-10,24,20,3,'#C9D0DB');rr(sx-58,sy-8,40,16,2,'#3B5BA8');rr(sx+18,sy-8,40,16,2,'#3B5BA8');ln('#9AA4B8',2,sx-18,sy,sx+18,sy);
    for(let k=1;k<4;k++){ln('#6E8AC8',1,sx-58+k*10,sy-8,sx-58+k*10,sy+8);ln('#6E8AC8',1,sx+18+k*10,sy-8,sx+18+k*10,sy+8);}
    circ(sx,sy-14,4,(Math.sin(T*6)>0)?'#FF5050':'#7A2A2A');hit('satellite',sx-60,sy-22,sx+60,sy+14,{moving:1,small:1});}}
  // a comet every now and then (or when space is tapped)
  {const t=(T%37)/37,u=t<0.18?t/0.18:-1;if(u>=0){const cx=5600-u*7400,cy=-4500+u*1300;if(inV(cx-400,cy-120,cx+60,cy+60)){
    const gr=g.createLinearGradient(cx,cy,cx+380,cy-70);gr.addColorStop(0,'rgba(200,240,255,.9)');gr.addColorStop(1,'rgba(200,240,255,0)');
    g.fillStyle=gr;g.beginPath();g.moveTo(cx,cy-12);g.lineTo(cx+380,cy-90);g.lineTo(cx+380,cy-50);g.lineTo(cx,cy+12);g.closePath();g.fill();
    circ(cx,cy,14,'#FFFFFF');circ(cx,cy,22,'rgba(200,240,255,.35)');hit('comet',cx-24,cy-24,cx+60,cy+24,{moving:1,small:1});}}}
});

/* ---------- the deep sea ---------- */
function manta(x,y,s,T){const fl=Math.sin(T*2.4)*14*s;g.save();g.translate(x,y);g.scale(s,s);
  poly('#3A4A6A',-10,0,-60,-8+fl/s,-30,10,0,14,30,10,60,-8+fl/s,10,0,0,-14);poly('#2E3B57',0,-14,10,0,0,14,-10,0);
  ln('#2E3B57',2,0,14,4,52);circ(-8,-8,2,'#F2EDE4');circ(8,-8,2,'#F2EDE4');g.restore();}
function shark(x,y,s,f){flip(x,y,f,()=>{g.scale(s,s);poly('#7E8CA3',-50,0,-20,-14,30,-12,52,0,30,12,-20,10);poly('#7E8CA3',-4,-12,6,-34,14,-12);
  poly('#7E8CA3',-48,0,-66,-18,-60,0,-66,16);poly('#C9D0DB',-20,6,30,6,44,2,30,11,-20,10);circ(38,-3,2,'#222');for(let k=0;k<3;k++)ln('#5A6478',1.2,22+k*4,-6,20+k*4,4);});}
function turtle(x,y,s,f,T){flip(x,y,f,()=>{g.scale(s,s);const p=Math.sin(T*2)*0.5;
  [[-14,-10,-1],[-14,10,1],[14,-10,-1],[14,10,1]].forEach(([fx_,fy,d])=>{g.save();g.translate(fx_,fy);g.rotate(d*(0.5+p));ell(0,d*8,6,10,'#7CB86A');g.restore();});
  ell(0,0,24,16,'#5B8E4A');ell(0,0,19,12,'#6FA35A');for(let k=-1;k<=1;k++)ell(k*10,0,5,6,'#5B8E4A');ell(28,-2,8,6,'#7CB86A');circ(31,-4,1.4,'#222');});}
function spermwhale(x,y,s,f,T){flip(x,y,f,()=>{g.scale(s,s);const tl=Math.sin(T*1.2)*8;
  g.fillStyle='#5A6478';g.beginPath();g.moveTo(90,-30);g.lineTo(90,26);g.quadraticCurveTo(40,34,-40,20);g.quadraticCurveTo(-90,10,-120,tl);g.quadraticCurveTo(-90,-16,-40,-26);g.quadraticCurveTo(20,-36,90,-30);g.fill();
  poly('#5A6478',-118,tl,-150,tl-26,-138,tl,-150,tl+24);ln('#3F4A5E',2,40,18,88,16);circ(56,-6,3,'#1A1A22');rr(-20,-26,26,6,3,'#4E586C');});}
function jelly(x,y,s,T,c,glow){const p=1+Math.sin(T*3+x)*0.12;
  if(glow){const gr=g.createRadialGradient(x,y,2,x,y,50*s);gr.addColorStop(0,c+'99');gr.addColorStop(1,c+'00');g.fillStyle=gr;g.beginPath();g.arc(x,y,50*s,0,TAU);g.fill();}
  g.globalAlpha=0.85;g.fillStyle=c;g.beginPath();g.ellipse(x,y,20*s*p,15*s/p,0,Math.PI,TAU);g.fill();g.globalAlpha=0.6;
  g.strokeStyle=c;g.lineWidth=2;for(let k=0;k<5;k++){const tx=x-14*s+k*7*s;g.beginPath();g.moveTo(tx,y);for(let j=1;j<=6;j++)g.lineTo(tx+Math.sin(T*3+j+k)*4*s,y+j*8*s);g.stroke();}g.globalAlpha=1;}
function squid(x,y,s,T){g.save();g.translate(x,y);g.scale(s,s);const w=Math.sin(T*1.5);
  g.strokeStyle='#C0473A';g.lineWidth=5;g.lineCap='round';for(let k=0;k<8;k++){const a=(k-3.5)*0.16;g.beginPath();g.moveTo(-8+k*2.4,30);g.quadraticCurveTo(-8+k*2.4+Math.sin(T*2+k)*10,70,-8+k*2.4+a*60+w*8,110);g.stroke();}
  g.lineWidth=3;[-1,1].forEach(d=>{g.beginPath();g.moveTo(d*6,30);g.quadraticCurveTo(d*30+w*10,110,d*20+Math.sin(T+d)*20,170);g.stroke();circ(d*20+Math.sin(T+d)*20,170,5,'#C0473A');});g.lineCap='butt';
  ell(0,-10,18,44,'#D9573E');poly('#C0473A',0,-60,-26,-34,26,-34);circ(-8,18,9,'#FFFFFF');circ(-8,18,5,'#1A1A22');circ(8,18,9,'#FFFFFF');circ(8,18,5,'#1A1A22');g.restore();}
function angler(x,y,s,T,f){flip(x,y,f,()=>{g.scale(s,s);const bob=Math.sin(T*2)*3;
  const gr=g.createRadialGradient(46,-46+bob,1,46,-46+bob,40);gr.addColorStop(0,'rgba(255,250,190,.95)');gr.addColorStop(1,'rgba(255,250,190,0)');g.fillStyle=gr;g.beginPath();g.arc(46,-46+bob,40,0,TAU);g.fill();
  g.strokeStyle='#4A4A5A';g.lineWidth=2;g.beginPath();g.moveTo(6,-30);g.quadraticCurveTo(30,-64,46,-46+bob);g.stroke();circ(46,-46+bob,6,'#FFF8C0');
  ell(0,0,36,30,'#2E2E3C');poly('#2E2E3C',-34,0,-56,-16,-50,0,-56,16);ell(20,10,18,10,'#1A1A24');
  for(let k=0;k<5;k++){poly('#F2EDE4',8+k*6,2,11+k*6,9,14+k*6,2);poly('#F2EDE4',8+k*6,18,11+k*6,11,14+k*6,18);}circ(12,-12,5,'#E8E8F0');circ(13,-12,2.4,'#1A1A22');});}
function fishSchool(cx,cy,T,n){for(let k=0;k<n;k++){const a=T*0.6+k/n*TAU,r=60+Math.sin(k*1.7)*20,x=cx+Math.cos(a)*r*1.6,y=cy+Math.sin(a)*r*0.6,d=-Math.sin(a)>0?1:-1;
  g.save();g.translate(x,y);g.scale(d,1);ell(0,0,9,4,'#BFE9FF');poly('#9FD8F5',-8,0,-14,-5,-14,5);circ(5,-1,1,'#123E73');g.restore();}}
function wreck(x,y){g.save();g.translate(x,y);g.rotate(-0.12);
  g.fillStyle='#5A3A2A';g.beginPath();g.moveTo(-150,-40);g.lineTo(150,-40);g.lineTo(120,10);g.lineTo(-130,10);g.closePath();g.fill();
  rr(-150,-46,300,8,2,'#7A4E33');for(let k=0;k<5;k++)circ(-90+k*45,-18,7,'#1A2433');ln('#7A4E33',7,-30,-46,-50,-170);ln('#7A4E33',4,-80,-130,10,-150);
  poly('rgba(220,220,200,.35)',-46,-160,-46,-80,10,-100);for(let k=0;k<4;k++)ell(-100+k*70,6,14,5,'#2E6B4A');g.restore();}
function chest(x,y,open){rr(x-26,y-26,52,26,4,'#8A5A3B');rr(x-26,y-20,52,4,0,'#C9A040');rr(x-3,y-24,6,10,1,'#FFD23F');
  if(open){const gr=g.createRadialGradient(x,y-34,4,x,y-34,70);gr.addColorStop(0,'rgba(255,220,90,.9)');gr.addColorStop(1,'rgba(255,220,90,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y-34,70,0,TAU);g.fill();
    for(let k=0;k<6;k++)circ(x-18+k*7,y-28-(k%2)*4,5,'#FFD23F');poly('#7A4E33',x-28,y-26,x+28,y-26,x+24,y-58,x-24,y-58);}
  else{g.fillStyle='#7A4E33';g.beginPath();g.moveTo(x-28,y-26);g.quadraticCurveTo(x,y-46,x+28,y-26);g.closePath();g.fill();rr(x-28,y-30,56,4,0,'#C9A040');}}
function sub(x,y,f,T){flip(x,y,f,()=>{
  g.globalAlpha=0.22;poly('#FFF5B0',38,-4,300,-70,300,70);g.globalAlpha=1;
  ell(0,0,46,22,'#FFC928');rr(-14,-36,30,18,6,'#FFC928');rr(-2,-46,4,12,1,'#7E889C');for(let k=0;k<3;k++){circ(-20+k*18,0,6,'#8ED2F4');circ(-20+k*18,0,6.5,'rgba(0,0,0,0)');}
  const p=Math.sin(T*20);rr(-54,-3,10,6,2,'#7E889C');ell(-58,0,3,12*Math.abs(p)+2,'#9AA4B8');circ(42,-4,5,'#FFF5B0');});}
const SUB={x:600,dir:1},SWIM=[
  {id:'turtle',y:2650,x0:-900,x1:1400,v:20,draw:(x,y,f,T)=>turtle(x,y,1.6,f,T),box:[40,26]},
  {id:'manta',y:2760,x0:1800,x1:4600,v:30,draw:(x,y,f,T)=>manta(x,y,1.4,T),box:[80,26]},
  {id:'shark',y:3050,x0:-1200,x1:2200,v:55,draw:(x,y,f,T)=>shark(x,y,1.5,f),box:[90,40]},
  {id:'spermwhale',y:3320,x0:2400,x1:5200,v:24,draw:(x,y,f,T)=>spermwhale(x,y,1.3,f,T),box:[190,50]}];
K.UPDATE.push(dt=>{SUB.x+=SUB.dir*dt*(fx('sub')<4?120:40);if(SUB.x>4900)SUB.dir=-1;if(SUB.x<-1000)SUB.dir=1;});
K.DYN.push(L=>{if(VIEW[3]<DEEP0)return;const T=TT();
  SWIM.forEach(o=>{const span=o.x1-o.x0,u=(T*o.v*(fx(o.id)<3?3:1)/span)%2,k=u<1?u:2-u,x=o.x0+k*span,f=u<1?1:-1,y=o.y+Math.sin(T*0.7+o.y)*12;
    if(!inV(x-o.box[0]-80,y-o.box[1]-40,x+o.box[0]+80,y+o.box[1]+40))return;
    L.push({y,f:()=>{o.draw(x,y,f,T);hit(o.id,x-o.box[0],y-o.box[1],x+o.box[0],y+o.box[1],{moving:1,small:1});}});});
  if(inV(3900,2550,4500,2850))L.push({y:2700,f:()=>{fishSchool(4200,2700,TT()*(fx('fishschool')<3?3:1),24);hit('fishschool',4080,2640,4320,2760,{small:1});}});
  [[-600,3150,'#E9A0FF',0],[300,3250,'#FFB0C8',0],[3200,3600,'#7CF0FF',1],[4600,3900,'#B0FFB0',1],[-1000,3800,'#7CF0FF',1]].forEach(([jx,jy,c,glow],i)=>{
    const y=jy+Math.sin(T*0.8+i)*30-(fx('jellyfish')<3?fx('jellyfish')*20:0);if(!inV(jx-60,y-60,jx+60,y+80))return;
    L.push({y,f:()=>{jelly(jx,y,1.3,T,c,glow);hit('jellyfish',jx-28,y-22,jx+28,y+40,{moving:1,small:1});}});});
  {const x=3800,y=3700+Math.sin(T*0.5)*20;if(inV(x-80,y-70,x+80,y+190))L.push({y,f:()=>{squid(x,y,1.2+(fx('squid')<2?Math.sin(fx('squid')*8)*0.06:0),T);hit('squid',x-30,y-70,x+30,y+120,{moving:1,small:1});}});}
  {const x=1600+Math.sin(T*0.25)*120,f=Math.cos(T*0.25)>0?1:-1,y=3850;if(inV(x-90,y-100,x+90,y+40))L.push({y,f:()=>{angler(x,y,1.4,T,f);hit('anglerfish',x-56,y-50,x+56,y+46,{moving:1,small:1});}});}
  for(let k=0;k<14;k++){const lx=-1200+k*480+Math.sin(T*0.4+k)*60,ly=3550+((k*137)%500);if(inV(lx-4,ly-4,lx+4,ly+4)&&Math.sin(T*3+k)>-0.3){circ(lx,ly,3,'#9FF7FF');}}   // tiny lanternfish
  if(inV(700,4100,1120,4360))L.push({y:4300,f:()=>{wreck(900,4300);hit('wreck',740,4120,1060,4300);}});
  if(inV(1050,4230,1180,4330))L.push({y:4310,f:()=>{chest(1110,4320,fx('chest')<5);hit('chest',1080,4280,1140,4322,{small:1});}});
  {const x=SUB.x,y=4120+Math.sin(T*0.6)*10;if(inV(x-80,y-60,x+320,y+80))L.push({y,f:()=>{sub(x,y,SUB.dir,T);hit('sub',x-50,y-48,x+50,y+24,{moving:1,small:1});}});}
  if(Math.random()<0.25){const bx=VIEW[0]+Math.random()*(VIEW[2]-VIEW[0]),by=Math.min(VIEW[3],BED)-10;if(by>DEEP0+100)PARTS.push({x:bx,y:by,vx:0,vy:-30,life:0,max:3,k:'smoke',r:2,c:'rgba(200,235,255,.5)'});}
});

/* ---------- taps and zones ---------- */
Object.assign(TAP,{
  sky:()=>{SND.whoosh();},space:(r,x,y)=>{burst(x,y,'star',10,'#FFFFFF',0.6);},
  mars:()=>{act('mars');SND.ding();},saturn:()=>{act('saturn');swp(300,600,0.5,'sine',0.06);},satellite:()=>{for(let i=0;i<4;i++)beep(1400,i*0.18,0.08,'square',0.05);},
  comet:()=>{SND.whoosh();},deepsea:(r,x,y)=>{burst(x,y,'drop',8,'#BFE9FF',0.5);},
  wreck:()=>{swp(160,80,1,'sawtooth',0.04);},chest:()=>{act('chest');[880,1175,1568].forEach((f,i)=>beep(f,i*0.1,0.18,'triangle',0.12));},
  sub:()=>{act('sub');for(let i=0;i<3;i++)beep(1000,i*0.6,0.12,'sine',0.08);},fishschool:()=>{act('fishschool');SND.splash();},
  manta:()=>{act('manta');SND.splash();},spermwhale:()=>{act('spermwhale');swp(140,60,1.4,'sine',0.1);},jellyfish:()=>{act('jellyfish');swp(600,1200,0.4,'sine',0.05);},
  squid:()=>{act('squid');SND.splash();},anglerfish:()=>{act('anglerfish');SND.ding();}});
K.ZONES.unshift((x,y)=>{if(y<SPACE0)return 'space';if(y<SKY0)return 'sky';if(y>DEEP0)return 'deepsea';return null;});
at('mars',[2255,-4145,2345,-4055]);at('saturn',[3965,-3975,4235,-3825]);at('wreck',[740,4120,1060,4300]);at('chest',[1080,4280,1140,4322]);
at('fishschool',[4080,2640,4320,2760]);
K.EDGE_Y=[-4700,4700];       // how far up and down the camera may go
}
