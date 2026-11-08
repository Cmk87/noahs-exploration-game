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
const {rr,circ,ell,poly,ln,ent,ANIMALS,hit,fx,act,later,burst,textP,PARTS,LIGHTS,SND,swp,sr,sm,li,ST,TAP,VIEW,TAU,g}=K;
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
ent('spacestation','🛰️',['die Raumstation','the space station','la estación espacial'],['Die Raumstation! Hier wohnen Astronauten, hoch über der Erde. Der Astronaut macht gerade einen Weltraumspaziergang.','The space station! Astronauts live up here, high above the Earth. The astronaut is out on a spacewalk.','¡La estación espacial! Aquí viven astronautas, muy por encima de la Tierra. El astronauta está dando un paseo espacial.']);
ent('satellite','🛰️',['der Satellit','the satellite','el satélite'],['Ein Satellit! Er fliegt immer um die Erde herum.','A satellite! It flies round and round the Earth.','¡Un satélite! Da vueltas y vueltas alrededor de la Tierra.']);
ent('comet','☄️',['der Komet','the comet','el cometa'],['Ein Komet! Er hat einen langen, leuchtenden Schweif.','A comet! It has a long, glowing tail.','¡Un cometa! Tiene una cola larga y brillante.']);
ent('deepsea','🤿',['die Tiefsee','the deep sea','las profundidades del mar'],['Die Tiefsee! Je tiefer, desto dunkler und kälter wird das Wasser.','The deep sea! The deeper you go, the darker and colder the water gets.','¡Las profundidades! Cuanto más hondo, más oscura y fría está el agua.']);
ent('wreck','🏴‍☠️',['das gesunkene Piratenschiff','the sunken pirate ship','el barco pirata hundido'],['Ein gesunkenes Piratenschiff! Überall liegen Goldmünzen.','A sunken pirate ship! There are gold coins everywhere.','¡Un barco pirata hundido! Hay monedas de oro por todas partes.'],{find:1});
ent('coins','🪙',['die Goldmünzen','the gold coins','las monedas de oro'],['Goldmünzen! Ganz viele glänzende Goldmünzen.','Gold coins! Lots and lots of shiny gold coins.','¡Monedas de oro! Muchísimas monedas brillantes.']);
ent('clam','🦪',['die Riesenmuschel','the giant clam','la almeja gigante'],['Eine Riesenmuschel! Darin liegt eine Perle.','A giant clam! There is a pearl inside.','¡Una almeja gigante! Dentro hay una perla.'],{find:1});
ent('cannon','💣',['die Kanone','the cannon','el cañón'],['Eine alte Piratenkanone! Bumm – nur Blubberblasen.','An old pirate cannon! Boom – only bubbles.','¡Un viejo cañón pirata! ¡Bum! Solo burbujas.']);
ent('castaway','🧔',['der Schiffbrüchige','the castaway','el náufrago'],['Der Schiffbrüchige! Er winkt: Hallo! Holt mich bitte von der Insel ab!','The castaway! He waves: Hello! Please come and get me off the island!','¡El náufrago! Saluda: ¡Hola! ¡Venid a buscarme a la isla!'],{find:1});
ent('bottle','🍾',['die Flaschenpost','the message in a bottle','el mensaje en una botella'],['Eine Flaschenpost! Darin steht: Ich bin auf der kleinen Insel. Viele Grüße!','A message in a bottle! It says: I am on the little island. Best wishes!','¡Un mensaje en una botella! Dice: Estoy en la islita. ¡Saludos!']);
ANI('parrot','🦜',['der Papagei','the parrot','el loro'],['Der Papagei! Er ruft: Ahoi! Ahoi!','The parrot! It calls: Ahoy! Ahoy!','¡El loro! Grita: ¡Ahoy! ¡Ahoy!']);
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
  if(inV(200,-3750,800,-3150))L.push({y:-3450,f:()=>{planet(500,-3450,300,'#F4F4F0','#B9B9C2',[[-0.3,-0.2,0.18,'#C9C9D2'],[0.35,0.15,0.13,'#C2C2CC'],[0.05,0.45,0.1,'#CACAD4'],[-0.45,0.35,0.08,'#C2C2CC']]);
    hit('moon',210,-3740,790,-3160);}});
  // Mars
  if(inV(2060,-4300,2340,-4020))L.push({y:-4160,f:()=>{const t=fx('mars'),s=t<1?1+Math.sin(t*12)*0.06:1;planet(2200,-4160,140*s,'#F08A5A','#A8402A',[[-0.2,-0.3,0.2,'#C8603E'],[0.3,0.2,0.16,'#B9533A']]);
    ell(2200,-4280,46,15,'#F6E8E0');hit('mars',2060,-4300,2340,-4020);}});
  // Saturn with its rings
  if(inV(3780,-3960,4620,-3440))L.push({y:-3700,f:()=>{const t=fx('saturn'),tilt=-0.35+(t<2?Math.sin(t*6)*0.08:0);
    g.save();g.translate(4200,-3700);g.rotate(tilt);g.strokeStyle='#D9C08A';g.lineWidth=30;g.beginPath();g.ellipse(0,0,410,104,0,Math.PI,TAU);g.stroke();g.restore();
    planet(4200,-3700,215,'#F2DDA8','#B8945A',[[0,-0.25,0.9,'rgba(200,160,100,.25)'],[0,0.2,0.9,'rgba(170,130,80,.25)']]);
    g.save();g.translate(4200,-3700);g.rotate(tilt);g.strokeStyle='#E8D2A0';g.lineWidth=30;g.beginPath();g.ellipse(0,0,410,104,0,0,Math.PI);g.stroke();g.strokeStyle='rgba(120,90,50,.4)';g.lineWidth=2;g.beginPath();g.ellipse(0,0,360,86,0,0,Math.PI);g.stroke();g.restore();
    hit('saturn',3800,-3940,4600,-3460);}});
  // an astronaut on a spacewalk, on a safety line to a little space station
  {const ax=2600+Math.sin(T*0.4)*90,ay=-3250+Math.sin(T*0.6)*50,rot=Math.sin(T*0.3)*0.6+(fx('astronaut')<3?fx('astronaut')*4:0);
    if(inV(2350,-3700,3500,-3000))L.push({y:-3150,f:()=>{
      g.save();g.translate(3100,-3450);g.scale(3,3);g.translate(-1730,3308);rr(1660,-3330,140,46,10,'#D9DEE8');rr(1600,-3322,60,30,4,'#3B7DE2');rr(1800,-3322,60,30,4,'#3B7DE2');circ(1730,-3308,9,'#8ED2F4');g.restore();hit('spacestation',2700,-3530,3500,-3370);
      g.strokeStyle='#F4F7FB';g.lineWidth=5;g.beginPath();g.moveTo(2900,-3420);g.quadraticCurveTo(2760,-3300,ax+20,ay-18);g.stroke();
      g.save();g.translate(ax,ay);g.rotate(rot);g.scale(3,3);rr(-9,-14,18,24,6,'#F4F7FB');rr(-13,-12,6,16,3,'#F4F7FB');rr(7,-12,6,16,3,'#F4F7FB');rr(-7,8,6,12,3,'#E3E8F0');rr(1,8,6,12,3,'#E3E8F0');
      circ(0,-22,11,'#F4F7FB');ell(2,-22,8,6.5,'#F2B23A');ell(4,-24,3,2,'rgba(255,255,255,.7)');rr(-6,-8,12,7,2,'#3B7DE2');g.restore();
      hit('astronaut',ax-66,ay-110,ax+66,ay+66,{moving:1,small:1});}});}
});
K.TOP.push(()=>{if(VIEW[1]>-2300)return;const T=TT();
  // a satellite crossing the sky
  {const sx=-1500+((T*45)%7200),sy=-2800+Math.sin(T*0.2)*60;if(inV(sx-180,sy-80,sx+180,sy+80)){g.save();g.translate(sx,sy);g.scale(3,3);g.translate(-sx,-sy);
    rr(sx-12,sy-10,24,20,3,'#C9D0DB');rr(sx-58,sy-8,40,16,2,'#3B5BA8');rr(sx+18,sy-8,40,16,2,'#3B5BA8');ln('#9AA4B8',2,sx-18,sy,sx+18,sy);
    for(let k=1;k<4;k++){ln('#6E8AC8',1,sx-58+k*10,sy-8,sx-58+k*10,sy+8);ln('#6E8AC8',1,sx+18+k*10,sy-8,sx+18+k*10,sy+8);}
    circ(sx,sy-14,4,(Math.sin(T*6)>0)?'#FF5050':'#7A2A2A');g.restore();hit('satellite',sx-176,sy-66,sx+176,sy+42,{moving:1,small:1});}}
  // a comet every now and then (or when space is tapped)
  {const t=(T%37)/37,u=t<0.18?t/0.18:-1;if(u>=0){const cx=5600-u*7400,cy=-4500+u*1300;if(inV(cx-400,cy-120,cx+60,cy+60)){
    const gr=g.createLinearGradient(cx,cy,cx+380,cy-70);gr.addColorStop(0,'rgba(200,240,255,.9)');gr.addColorStop(1,'rgba(200,240,255,0)');
    g.fillStyle=gr;g.beginPath();g.moveTo(cx,cy-12);g.lineTo(cx+380,cy-90);g.lineTo(cx+380,cy-50);g.lineTo(cx,cy+12);g.closePath();g.fill();
    circ(cx,cy,34,'#FFFFFF');circ(cx,cy,54,'rgba(200,240,255,.35)');hit('comet',cx-24,cy-24,cx+60,cy+24,{moving:1,small:1});}}}
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
/* the sunken pirate ship: broken in two, torn sails with a skull, portholes (an octopus lives in one) */
function wreck(x,y){const T=TT();
  // the back half, lying apart
  g.save();g.translate(x+330,y);g.rotate(0.22);g.fillStyle='#4A3022';g.beginPath();g.moveTo(-10,-70);g.lineTo(150,-90);g.lineTo(140,0);g.lineTo(-20,6);g.closePath();g.fill();
  rr(-10,-78,160,10,3,'#6A4430');for(let k=0;k<3;k++)circ(30+k*40,-38,9,'#141C29');rr(110,-130,40,44,4,'#5A3A2A');rr(116,-122,10,10,2,'#141C29');rr(132,-122,10,10,2,'#141C29');g.restore();
  // the front half
  g.save();g.translate(x,y);g.rotate(-0.1);g.fillStyle='#5A3A2A';g.beginPath();g.moveTo(-230,-60);g.quadraticCurveTo(-260,-80,-270,-110);g.lineTo(-200,-72);g.lineTo(200,-80);g.lineTo(215,-30);g.lineTo(190,4);g.lineTo(150,-14);g.lineTo(130,10);g.lineTo(-200,8);g.closePath();g.fill();
  g.strokeStyle='#3E281C';g.lineWidth=2;for(let k=1;k<4;k++){g.beginPath();g.moveTo(-210,-60+k*17);g.lineTo(195,-66+k*17);g.stroke();}
  rr(-215,-84,420,12,3,'#7A4E33');for(let k=0;k<6;k++)circ(-150+k*55,-42,10,'#141C29');
  // masts, a torn sail with a skull, the flag
  ln('#6A4430',9,-60,-80,-90,-330);ln('#6A4430',7,90,-80,110,-260);ln('#6A4430',5,-160,-250,20,-290);
  const sw=Math.sin(T*0.8)*8;g.fillStyle='rgba(30,30,40,.85)';g.beginPath();g.moveTo(-150,-252);g.lineTo(12,-286);g.quadraticCurveTo(20+sw,-200,-6,-130);g.lineTo(-40,-150);g.lineTo(-70,-125);g.lineTo(-110,-150);g.quadraticCurveTo(-140+sw,-200,-150,-252);g.fill();
  circ(-60,-215,22,'#F2EDE4');rr(-72,-200,24,14,4,'#F2EDE4');circ(-68,-217,6,'#1E1E28');circ(-52,-217,6,'#1E1E28');for(let k=0;k<3;k++)rr(-68+k*7,-196,4,7,1,'#1E1E28');
  ln('#F2EDE4',5,-90,-178,-30,-160);ln('#F2EDE4',5,-90,-160,-30,-178);
  poly('#1E1E28',-90,-330,-40,-322+sw*0.5,-44,-306+sw*0.5,-90,-300);circ(-66,-316,5,'#F2EDE4');
  // the wheel, fallen on the deck
  g.strokeStyle='#8A5A3B';g.lineWidth=4;g.beginPath();g.arc(150,-104,22,0,TAU);g.stroke();for(let k=0;k<8;k++){const a=k/8*TAU+0.3;ln('#8A5A3B',3,150,-104,150+Math.cos(a)*30,-104+Math.sin(a)*30);}
  for(let k=0;k<5;k++)ell(-170+k*80,6,22,7,'#2E6B4A');g.restore();}
function coinPile(x,y,s,T){g.save();g.translate(x,y);g.scale(s,s);
  for(let r=0;r<4;r++)for(let k=0;k<5-r;k++){const cx=-24+k*12+r*6,cy=-r*7;ell(cx,cy,8,4,'#E8B820');ell(cx,cy-1.5,8,4,'#FFD23F');}
  if(Math.sin(T*3+x)>0.6){const sx=-10+((T*30+x)%30),sy=-22;ln('#FFFFFF',2,sx-5,sy,sx+5,sy);ln('#FFFFFF',2,sx,sy-5,sx,sy+5);}g.restore();}
function clam(x,y,open,T){const o=open?0.9:0.12+Math.abs(Math.sin(T*0.6))*0.08;
  ell(x,y,34,10,'#7A6A9A');g.save();g.translate(x-34,y);g.rotate(-o);g.fillStyle='#9A8ABA';g.beginPath();g.ellipse(34,0,34,12,0,Math.PI,TAU);g.fill();
  g.strokeStyle='#7A6A9A';g.lineWidth=2;for(let k=1;k<6;k++){g.beginPath();g.moveTo(34,0);g.lineTo(34+Math.cos(Math.PI+k*0.52)*34,Math.sin(Math.PI+k*0.52)*12);g.stroke();}g.restore();
  if(open){const gr=g.createRadialGradient(x,y-6,1,x,y-6,26);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y-6,26,0,TAU);g.fill();}
  circ(x,y-5,6,'#F6F2FF');}
function cannon(x,y){ell(x,y+2,40,6,'rgba(0,0,0,.3)');g.save();g.translate(x,y-12);g.rotate(-0.25);rr(-34,-9,68,18,8,'#3A3F4E');rr(30,-11,8,22,3,'#2A2F3C');circ(-34,0,9,'#2A2F3C');g.restore();
  circ(x-16,y-4,10,'#5A3A2A');circ(x+16,y-4,10,'#5A3A2A');circ(x-16,y-4,4,'#3E281C');circ(x+16,y-4,4,'#3E281C');}
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
  if(inV(500,3940,1560,4380)){
    L.push({y:4300,f:()=>{wreck(800,4290);hit('wreck',560,3960,1300,4300);
      const op=Math.sin(T*0.5)>0.3||fx('octopus')<4;if(op){const ox=805,oy=4248-Math.abs(Math.sin(T*1.2))*4;circ(ox,oy,9,'#E8743A');circ(ox-3,oy-2,2,'#FFF');circ(ox+3,oy-2,2,'#FFF');circ(ox-3,oy-2,1,'#222');circ(ox+3,oy-2,1,'#222');
        for(let k=0;k<3;k++)ln('#E8743A',3,ox-6+k*6,oy+6,ox-8+k*8+Math.sin(T*3+k)*4,oy+18);hit('octopus',ox-14,oy-14,ox+14,oy+20,{moving:1,small:1});}}});
    L.push({y:4318,f:()=>{const t=fx('coins');[[1180,4318,1.4],[1260,4326,1],[620,4322,1.1],[980,4330,0.9]].forEach(([x,y,s],i)=>coinPile(x,y,s*(t<2&&i===0?1+Math.sin(t*12)*0.05:1),T));
      hit('coins',1140,4290,1300,4330,{small:1});hit('coins',590,4300,660,4326,{small:1});}});
    L.push({y:4322,f:()=>{chest(1370,4320,fx('chest')<5);hit('chest',1340,4280,1400,4322,{small:1});}});
    L.push({y:4326,f:()=>{clam(1470,4326,fx('clam')<5,T);hit('clam',1436,4300,1504,4332,{small:1});}});
    L.push({y:4328,f:()=>{cannon(520,4328);hit('cannon',480,4300,560,4332,{small:1});}});}
  {const x=SUB.x,y=4120+Math.sin(T*0.6)*10;if(inV(x-80,y-60,x+320,y+80))L.push({y,f:()=>{sub(x,y,SUB.dir,T);hit('sub',x-50,y-48,x+50,y+24,{moving:1,small:1});}});}
  if(Math.random()<0.25){const bx=VIEW[0]+Math.random()*(VIEW[2]-VIEW[0]),by=Math.min(VIEW[3],BED)-10;if(by>DEEP0+100)PARTS.push({x:bx,y:by,vx:0,vy:-30,life:0,max:3,k:'smoke',r:2,c:'rgba(200,235,255,.5)'});}
});

/* ---------- around the little island ---------- */
K.DYN.push(L=>{if(!inV(1700,2100,2420,2400))return;const T=TT();
  L.push({y:2300,f:()=>{g.save();g.translate(1960,2302);g.scale(1,0.45);g.font='800 34px "Baloo 2",sans-serif';g.textAlign='center';g.textBaseline='middle';
    g.lineWidth=5;g.strokeStyle='#8E8A80';g.strokeText('SOS',0,0);g.fillStyle='#B8B2A6';g.fillText('SOS',0,0);g.restore();}});
  {const t=fx('castaway'),x=2150,y=2302,jump=t<3?Math.abs(Math.sin(t*8))*8:0;L.push({y,f:()=>{
    ell(x,y+1,12,3,'rgba(0,0,0,.15)');rr(x-5,y-12-jump,4,12,1,'#F1C7A0');rr(x+1,y-12-jump,4,12,1,'#F1C7A0');rr(x-7,y-13-jump,14,5,1,'#5A7AB0');
    rr(x-6,y-26-jump,12,14,3,'#E8E0C8');ln('#B0A890',1,x-6,y-16-jump,x+6,y-20-jump);circ(x,y-31-jump,5.5,'#F1C7A0');ell(x,y-27-jump,5,3.6,'#8A6A4A');circ(x+2,y-32-jump,0.9,'#222');
    ell(x,y-36-jump,9,2.4,'#E2C27A');rr(x-4.5,y-41-jump,9,5,2,'#E2C27A');
    const wv=t<4?Math.sin(T*12)*0.5:Math.sin(T*2)*0.2;g.save();g.translate(x+5,y-24-jump);g.rotate(-2.6+wv);ln('#8A5A3B',2,0,0,0,24);poly('#FFFFFF',0,18,12,20,10,26,0,24);g.restore();
    hit('castaway',x-12,y-46,x+14,y+2,{small:1});}});}
  {const t=fx('parrot'),fly=t<4,a=t*2.2,px=fly?2060+Math.cos(a)*120:2014,py=fly?2190+Math.sin(a)*30-20:2216,f=fly?(-Math.sin(a)>0?1:-1):1;L.push({y:fly?2400:2280,f:()=>{
    flip(px,py,f,()=>{const fl=fly?Math.sin(T*20)*6:0;ell(0,0,7,9,'#E8443A');poly('#3CC8F5',-2,-2,-12,-6-fl,-8,4);poly('#FFD23F',-4,6,-8,16,0,8);circ(2,-8,5,'#E8443A');circ(3.6,-9,1.4,'#FFF');circ(4,-9,0.7,'#222');poly('#2B2233',6,-8,10,-6,6,-4);});
    hit('parrot',px-12,py-16,px+12,py+14,{moving:1,small:1});}});}
  {const bx=2300+Math.sin(T*0.3)*50,by=2330+Math.sin(T*1.4)*4,t=fx('bottle'),bob=t<3?Math.sin(t*10)*4:0;L.push({y:by,f:()=>{
    g.save();g.translate(bx,by+bob);g.rotate(0.3+Math.sin(T*1.4)*0.15);rr(-12,-5,22,10,4,'rgba(170,230,200,.85)');rr(10,-3,6,6,1,'rgba(170,230,200,.85)');rr(16,-3,3,6,1,'#8A5A3B');rr(-8,-2.5,14,5,1,'#F2EDE4');g.restore();
    hit('bottle',bx-16,by-12,bx+20,by+12,{moving:1,small:1});}});}
  // two dolphins jump in arcs next to the island
  [0,1].forEach(i=>{const ph=((T+i*1.1)%6)/6;if(ph>0.3)return;const u=ph/0.3,dx=1800-i*50+u*160,dy=2330-Math.sin(u*Math.PI)*80;
    L.push({y:2340,f:()=>{g.save();g.translate(dx,dy);g.rotate(-Math.cos(u*Math.PI)*0.9);ell(0,0,22,8,'#6E8FBF');poly('#6E8FBF',-20,0,-30,-8,-30,8);poly('#6E8FBF',-2,-6,4,-16,8,-6);ell(18,2,8,4,'#6E8FBF');ell(4,4,12,3,'#DDE6F2');circ(14,-2,1.2,'#222');g.restore();
      hit('dolphin',dx-26,dy-14,dx+26,dy+12,{moving:1,small:1});}});});
});

/* ---------- the mountains: a ski slope in the west; in the east an old plane wreck (a marmot lives
   in it now), climbers on their way to the summit, an ice cave with a friendly yeti, an avalanche,
   a crystal cave, a chamois; a paraglider over the peaks ---------- */
ent('planecrash','✈️',['das alte Flugzeugwrack','the old plane wreck','el viejo avión estrellado'],['Ein altes Flugzeug ist hier vor langer Zeit gelandet. Den Piloten geht es gut – jetzt wohnt ein Murmeltier darin!','An old plane landed here a long time ago. The pilots are fine – now a marmot lives in it!','Un avión viejo aterrizó aquí hace mucho. Los pilotos están bien, ¡ahora vive una marmota dentro!'],{find:1});
ent('climbers','🧗',['die Bergsteiger','the climbers','los alpinistas'],['Die Bergsteiger! Sie klettern bis ganz nach oben auf den Gipfel.','The climbers! They climb all the way up to the summit.','¡Los alpinistas! Escalan hasta la cima.']);
ent('icecave','🧊',['die Eishöhle','the ice cave','la cueva de hielo'],['Die Eishöhle! Wer wohnt denn da drin?','The ice cave! Who lives in there?','¡La cueva de hielo! ¿Quién vive ahí dentro?'],{find:1});
ent('yeti','🦍',['der Yeti','the yeti','el yeti'],['Der Yeti! Er wohnt in der Eishöhle und ist ganz lieb. Huhu!','The yeti! It lives in the ice cave and is very friendly. Hello!','¡El yeti! Vive en la cueva de hielo y es muy simpático. ¡Hola!']);
ent('crystals','💎',['die Kristallhöhle','the crystal cave','la cueva de cristales'],['Die Kristallhöhle! Hier glitzern lila Kristalle.','The crystal cave! Purple crystals sparkle in here.','¡La cueva de cristales! Aquí brillan cristales morados.'],{find:1});
ent('paraglider','🪂',['der Gleitschirmflieger','the paraglider','el parapentista'],['Der Gleitschirmflieger! Er schwebt wie ein Vogel über die Berge.','The paraglider! He glides over the mountains like a bird.','¡El parapentista! Planea sobre las montañas como un pájaro.']);
ent('skier','⛷️',['die Skifahrerin','the skier','la esquiadora'],['Die Skifahrerin saust den Berg hinunter! Hui!','The skier whizzes down the mountain! Wheee!','¡La esquiadora baja la montaña a toda velocidad! ¡Yuju!']);
ent('skilift','🚡',['der Sessellift','the chairlift','el telesilla'],['Der Sessellift! Er bringt die Skifahrer nach oben.','The chairlift! It takes the skiers up.','¡El telesilla! Sube a los esquiadores.'],{find:1});
ANI('chamois','🐐',['die Gämse','the chamois','el rebeco'],['Die Gämse! Sie springt sicher von Fels zu Fels.','The chamois! It leaps safely from rock to rock.','¡El rebeco! Salta seguro de roca en roca.']);
const S=K.S,CLIMB={done:false};
// the old plane wreck on the slope, half in the snow
S(-520,[2870,-650,3150,-500],()=>{const T=TT(),t=fx('planecrash'),x=3000,y=-548;
  g.save();g.translate(x,y);g.rotate(-0.42);
  rr(-70,-14,130,28,14,'#C9D0DB');rr(-70,-14,130,8,6,'#E3E8F0');for(let k=0;k<4;k++)circ(-40+k*24,-2,5,'#5A7AB0');
  poly('#B9C1CC',-66,-8,-96,-44,-80,-44,-50,-8);poly('#D9302A',-90,-44,-80,-44,-70,-30,-84,-30);
  poly('#AEB6C2',-10,10,40,10,70,36,10,30);poly('#9AA4B8',-14,-12,20,-12,10,-46,-8,-40);
  circ(64,0,7,'#7E889C');g.strokeStyle='#5A6074';g.lineWidth=4;g.beginPath();g.moveTo(64,0);g.quadraticCurveTo(76,-18,70,-30);g.moveTo(64,0);g.quadraticCurveTo(80,14,74,26);g.stroke();
  const peek=t<4?Math.min(1,t*2):0;if(peek){circ(30,-2-peek*8,6,'#B48A5A');circ(28,-4-peek*8,1.2,'#222');circ(32,-4-peek*8,1.2,'#222');circ(26,-8-peek*8,2,'#9A7048');circ(34,-8-peek*8,2,'#9A7048');}
  g.restore();ell(x+20,y+30,90,16,'#F4F7FB');ell(x-40,y+36,60,12,'#E9EEF5');
  hit('planecrash',x-80,y-60,x+80,y+40);});
// climbers: a tent halfway up; tapped, they rope up to the summit and plant a flag
const CL0=[3330,-430],CL1=[3548,-826];
S(-462,[3340,-530,3460,-455],()=>{poly('#FF8A3D',3350,-462,3400,-522,3450,-462);poly('#E0601E',3400,-522,3450,-462,3418,-462);poly('#5A3A22',3392,-462,3400,-490,3408,-462);ln('#5A3A22',3,3400,-522,3400,-534);});
K.DYN.push(L=>{if(!inV(3250,-900,3650,-400))return;const T=TT(),t=fx('climbers'),u=t<10?Math.min(1,0.15+t/10*0.85):(CLIMB.done?1:0.15);if(t>=10&&t<11)CLIMB.done=true;
  L.push({y:-440,f:()=>{const pts=[0,1,2].map(i=>{const v=Math.max(0,u-i*0.06),x=CL0[0]+(CL1[0]-CL0[0])*v,y=CL0[1]+(CL1[1]-CL0[1])*v;return [x,y];});
    g.strokeStyle='#E8443A';g.lineWidth=2.6;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y-18):g.moveTo(x,y-18));g.stroke();
    pts.forEach(([x,y],i)=>{const st=t<10?Math.sin(T*8+i)*2:0;g.save();g.translate(x,y);g.scale(1.8,1.8);g.translate(-x,-y);rr(x-4,y-16+st*0.3,8,10,3,['#3B7DE2','#FFC928','#7ED957'][i]);circ(x,y-20,4,SKIN0[i]);rr(x-4.5,y-25,9,4,2,['#D9302A','#2B2233','#FF8A3D'][i]);rr(x-3,y-6,2,6,1,'#2B2233');rr(x+1,y-6,2,6,1,'#2B2233');rr(x+3,y-15,4,9,2,'#8A5A3B');g.restore();});
    if(u>=1){ln('#5A3A22',3,CL1[0]+4,CL1[1],CL1[0]+4,CL1[1]-60);poly('#E8443A',CL1[0]+5,CL1[1]-60,CL1[0]+44,CL1[1]-50+Math.sin(T*4)*3,CL1[0]+5,CL1[1]-40);}
    hit('climbers',Math.min(pts[2][0],pts[0][0])-24,pts[0][1]-50,Math.max(pts[2][0],pts[0][0])+24,pts[2][1]+4,{moving:1,small:1});}});});
const SKIN0=['#F6D2B4','#D9A27E','#9C6B4E'];
// the ice cave and its yeti
S(-405,[3880,-520,4060,-398],()=>{const T=TT(),t=fx('icecave'),x=3965,y=-405;
  ell(x,y,82,62,'#BFE6FA');ell(x,y+4,62,48,'#7FC4EE');g.fillStyle='#1E4A6A';g.beginPath();g.ellipse(x,y+10,40,34,0,Math.PI,TAU);g.fill();rr(x-40,y+8,80,4,0,'#1E4A6A');
  for(let k=0;k<7;k++)poly('#E9F6FF',x-70+k*22,y-44+Math.abs(k-3)*6,x-62+k*22,y-44+Math.abs(k-3)*6,x-66+k*22,y-26+Math.abs(k-3)*6);
  const out=t<6?(t<1?t:t<5?1:6-t):0;
  if(!out){const bl=(T%4)<0.15;if(!bl){circ(x-8,y-6,2.6,'#FFE14D');circ(x+8,y-6,2.6,'#FFE14D');}}
  else{const yy=y+8-out*16,wv=Math.sin(T*10)*0.5;circ(x,yy-26,18,'#F4F7FB');circ(x-14,yy-10,14,'#F4F7FB');circ(x+14,yy-10,14,'#F4F7FB');ell(x,yy-24,10,9,'#8FB8E8');
    circ(x-4,yy-27,2,'#1D2350');circ(x+4,yy-27,2,'#1D2350');g.strokeStyle='#1D2350';g.lineWidth=1.6;g.beginPath();g.arc(x,yy-22,4,0.3,Math.PI-0.3);g.stroke();
    g.save();g.translate(x+20,yy-18);g.rotate(-2.2+wv);rr(-5,0,10,22,5,'#F4F7FB');g.restore();
    hit('yeti',x-30,yy-46,x+34,yy+4,{moving:1,small:1});}
  hit('icecave',x-80,y-60,x+80,y+40);});
// the avalanche (tap the next peak)
K.DYN.push(L=>{const t=fx('avalanche');if(t>5||!inV(4100,-900,4750,-250))return;const T=TT();
  L.push({y:-250,f:()=>{for(let k=0;k<14;k++){const u=Math.min(1,Math.max(0,(t-k*0.08)/2.6)),x=4400+(k%2?-1:1)*(40+k*12)*u,y=-840+u*(400+((k*37)%40));
    if(u<=0)continue;g.globalAlpha=Math.max(0,1-Math.max(0,t-3.4)/1.6);circ(x,y,16+k*2,'#FFFFFF');circ(x+10,y-6,10+k,'#EEF4FA');g.globalAlpha=1;}}});});
// the crystal cave
S(-372,[4730,-470,4890,-368],()=>{const T=TT(),t=fx('crystals'),x=4810,y=-375;
  ell(x,y,72,46,'#8E96A8');g.fillStyle='#2A2238';g.beginPath();g.ellipse(x,y+6,48,36,0,Math.PI,TAU);g.fill();rr(x-48,y+4,96,4,0,'#2A2238');
  [[-26,0,10],[-10,-4,16],[8,-2,12],[22,2,9],[0,4,8]].forEach(([dx,dy,h],i)=>{const c=['#B78CFF','#9B6BFF','#D9B8FF','#7FE0FF','#FF9BE0'][i],gl=t<4?1:0.4+0.4*Math.sin(T*3+i);
    g.globalAlpha=0.6+0.4*gl;poly(c,x+dx-5,y+dy+6,x+dx,y+dy-h*2,x+dx+5,y+dy+6);g.globalAlpha=1;if(gl>0.7)LIGHTS.push(x+dx,y+dy-h,26,c);});
  if(t<4&&Math.random()<0.3)PARTS.push({x:x+(Math.random()-0.5)*80,y:y-10,vx:0,vy:-20,life:0,max:1,k:'star',r:2.5,c:'#E9D8FF'});
  hit('crystals',x-70,y-46,x+70,y+30);});
// the chamois leaps between rocks
const ROCKS=[[5130,-520],[5200,-610],[5270,-700],[5330,-600]];
ROCKS.forEach(([x,y])=>S(y+6,[x-34,y-14,x+34,y+14],()=>{ell(x,y+4,32,13,'#8E96A8');ell(x-5,y-1,24,9,'#A8B0C0');}));
K.DYN.push(L=>{if(!inV(5080,-780,5380,-480))return;const T=TT(),t=fx('chamois'),sp=t<4?2.5:1,ph=(T*0.35*sp)%ROCKS.length,i=Math.floor(ph),u=ph-i,k=u<0.6?0:sm((u-0.6)/0.4);
  const a=ROCKS[i],b=ROCKS[(i+1)%ROCKS.length],x=a[0]+(b[0]-a[0])*k,y=a[1]+(b[1]-a[1])*k-Math.sin(k*Math.PI)*50,f=b[0]>=a[0]?1:-1;
  L.push({y:y+4,f:()=>{flip(x,y-6,f,()=>{g.scale(1.7,1.7);g.translate(0,-4);const c='#8A5A3B';[-8,-4,4,8].forEach(lx=>rr(lx-1.2,0,2.4,10,1,'#5A3A22'));ell(0,-2,12,6,c);rr(8,-14,6,12,3,c);ell(14,-14,6,4,c);
    rr(13,-14,2,6,0,'#F2EDE4');g.strokeStyle='#2B2233';g.lineWidth=1.6;g.beginPath();g.moveTo(12,-18);g.quadraticCurveTo(12,-26,8,-24);g.moveTo(15,-18);g.quadraticCurveTo(16,-26,12,-25);g.stroke();circ(16,-15,1,'#222');});
    hit('chamois',x-28,y-52,x+30,y+8,{moving:1,small:1});}});});
// the ski slope in the west: a piste, a chairlift and two skiers
const PISTE=[[-850,-860],[-760,-760],[-930,-660],[-760,-560],[-920,-460],[-800,-340]];
K.GROUND0.push(()=>{if(!inV(-1000,-900,-480,-300))return;g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=26;g.lineJoin='round';g.beginPath();PISTE.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();
  g.strokeStyle='rgba(120,160,220,.35)';g.lineWidth=2;g.setLineDash([8,8]);g.stroke();g.setLineDash([]);});
const LIFT0=[-560,-330],LIFT1=[-820,-850];
S(-322,[-840,-870,-540,-300],()=>{const T=TT();[[0],[0.33],[0.66],[1]].forEach(([u])=>{const x=LIFT0[0]+(LIFT1[0]-LIFT0[0])*u,y=LIFT0[1]+(LIFT1[1]-LIFT0[1])*u;rr(x-3,y-46,6,46,1,'#7E889C');rr(x-10,y-48,20,4,1,'#5A6074');});
  ln('#3A3F52',1.6,LIFT0[0],LIFT0[1]-46,LIFT1[0],LIFT1[1]-46);
  for(let k=0;k<6;k++){const u=((T*0.03+k/6)%1),x=LIFT0[0]+(LIFT1[0]-LIFT0[0])*u,y=LIFT0[1]+(LIFT1[1]-LIFT0[1])*u-46;ln('#3A3F52',1.2,x,y,x,y+14);rr(x-7,y+12,14,4,2,'#D9302A');
    if(k%2===0){circ(x,y+6,3.5,SKIN0[k%3]);rr(x-3,y+8,6,6,2,['#3B7DE2','#FF8A3D','#7ED957'][k%3]);}}
  hit('skilift',-830,-900,-540,-310);});
K.DYN.push(L=>{if(!inV(-1000,-900,-480,-300))return;const T=TT(),t=fx('skier');
  [0,0.5].forEach((o,i)=>{const sp=t<4?2.2:1,u=((T*0.05*sp)+o)%1,n=PISTE.length-1,fp=u*n,j=Math.min(n-1,Math.floor(fp)),k=fp-j,a=PISTE[j],b=PISTE[j+1],x=a[0]+(b[0]-a[0])*k,y=a[1]+(b[1]-a[1])*k,f=b[0]>=a[0]?1:-1;
    L.push({y,f:()=>{flip(x,y,f,()=>{g.scale(1.7,1.7);ln('#2B2233',2.4,-12,0,12,-3);rr(-4,-14,8,10,3,i?'#E8443A':'#3B7DE2');circ(0,-18,4,SKIN0[i]);rr(-4.5,-23,9,4,2,i?'#FFC928':'#FFFFFF');ln('#7E889C',1.4,4,-10,10,0);ln('#7E889C',1.4,-4,-10,-8,0);});
      if(Math.random()<0.2)PARTS.push({x:x-f*8,y:y,vx:-f*20,vy:-10,life:0,max:0.6,k:'smoke',r:3,c:'#FFFFFF'});hit('skier',x-24,y-44,x+24,y+5,{moving:1,small:1});}});});});
// a paraglider drifting over the peaks
K.TOP.push(()=>{const T=TT(),t=fx('paraglider'),x=2700+((T*(t<4?60:25))%2700),y=-1000+Math.sin(T*0.5)*50;if(!inV(x-60,y-50,x+60,y+70))return;
  g.save();g.translate(x,y);g.fillStyle='#FF5A8A';g.beginPath();g.ellipse(0,0,48,16,0,Math.PI,TAU);g.fill();for(let k=0;k<5;k++){g.fillStyle=['#FFC928','#3CC8F5','#7ED957','#FF8A3D','#B78CFF'][k];g.beginPath();g.ellipse(-38+k*19,-2,8,12,0,Math.PI,TAU);g.fill();}
  g.strokeStyle='rgba(60,60,80,.6)';g.lineWidth=0.8;[-44,-20,20,44].forEach(dx=>{g.beginPath();g.moveTo(dx,0);g.lineTo(0,40);g.stroke();});
  rr(-5,38,10,12,3,'#3B7DE2');circ(0,34,4.5,SKIN0[0]);rr(-5,29,10,4,2,'#FFFFFF');g.restore();hit('paraglider',x-50,y-20,x+50,y+54,{moving:1,small:1});});

/* ---------- taps and zones ---------- */
Object.assign(TAP,{
  sky:()=>{SND.whoosh();},
  planecrash:()=>{act('planecrash');SND.squeak();},climbers:()=>{if(fx('climbers')>10){act('climbers');CLIMB.done=false;}SND.yay();},
  icecave:()=>{if(fx('icecave')>6)act('icecave');swp(200,120,0.8,'sine',0.08);later(1,()=>say(L3(K.ENT.yeti.l)));return L3(K.ENT.icecave.l);},
  yeti:()=>{act('icecave');swp(160,260,0.5,'sawtooth',0.05);},crystals:()=>{act('crystals');[1568,2093,2637,3136].forEach((f,i)=>beep(f,i*0.09,0.2,'sine',0.08));},
  chamois:()=>{act('chamois');SND.hop&&SND.hop();},paraglider:()=>{act('paraglider');SND.whoosh();},skier:()=>{act('skier');SND.whoosh();},skilift:()=>{SND.ding();},
  mountain:(r,x,y)=>{if(x>4150&&x<4650&&fx('avalanche')>5){act('avalanche');noise(2.2,0.12);return L3(['Eine Lawine! Der Schnee rutscht den Berg hinunter. Zum Glück ist da niemand.','An avalanche! The snow slides down the mountain. Luckily nobody is there.','¡Un alud! La nieve baja por la montaña. Por suerte no hay nadie.']);}},space:(r,x,y)=>{burst(x,y,'star',10,'#FFFFFF',0.6);},
  mars:()=>{act('mars');SND.ding();},saturn:()=>{act('saturn');swp(300,600,0.5,'sine',0.06);},satellite:()=>{for(let i=0;i<4;i++)beep(1400,i*0.18,0.08,'square',0.05);},
  comet:()=>{SND.whoosh();},deepsea:(r,x,y)=>{burst(x,y,'drop',8,'#BFE9FF',0.5);},
  wreck:()=>{swp(160,80,1,'sawtooth',0.04);},coins:(r,x,y)=>{act('coins');burst(x,y,'star',14,'#FFD23F',0.8);[1568,2093,2637].forEach((f,i)=>beep(f,i*0.08,0.12,'triangle',0.1));},
  clam:()=>{act('clam');swp(800,1600,0.4,'sine',0.06);},cannon:(r,x,y)=>{noise(0.3,0.25);for(let i=0;i<14;i++)PARTS.push({x:575,y:4300,vx:40+Math.random()*80,vy:-30-Math.random()*60,life:0,max:2,k:'smoke',r:4,c:'rgba(220,240,255,.7)'});},
  castaway:()=>{act('castaway');SND.yay();},bottle:()=>{act('bottle');SND.splash();},parrot:()=>{act('parrot');for(let i=0;i<2;i++)swp(1800,2600,0.15,'square',0.04);later(0.3,()=>textP(2014,2140,'Ahoi!','#FFFFFF',14));},chest:()=>{act('chest');[880,1175,1568].forEach((f,i)=>beep(f,i*0.1,0.18,'triangle',0.12));},
  sub:()=>{act('sub');for(let i=0;i<3;i++)beep(1000,i*0.6,0.12,'sine',0.08);},fishschool:()=>{act('fishschool');SND.splash();},
  manta:()=>{act('manta');SND.splash();},spermwhale:()=>{act('spermwhale');swp(140,60,1.4,'sine',0.1);},jellyfish:()=>{act('jellyfish');swp(600,1200,0.4,'sine',0.05);},
  squid:()=>{act('squid');SND.splash();},anglerfish:()=>{act('anglerfish');SND.ding();}});
K.ZONES.unshift((x,y)=>{if(y<SPACE0)return 'space';if(y<SKY0)return 'sky';if(y>DEEP0)return 'deepsea';
  if(y<-940&&y>=SKY0)return 'sky';if(y<-300&&y>=-940&&!(x>2100&&x<2620))return 'mountain';return null;});   // the whole mountain range, not only its western half
at('planecrash',[2920,-608,3080,-508]);at('icecave',[3885,-465,4045,-365]);at('crystals',[4740,-421,4880,-345]);at('skilift',[-830,-900,-540,-310]);
at('mars',[2060,-4300,2340,-4020]);at('saturn',[3800,-3940,4600,-3460]);at('wreck',[560,3960,1300,4300]);at('chest',[1340,4280,1400,4322]);
at('fishschool',[4080,2640,4320,2760]);at('clam',[1436,4300,1504,4332]);at('castaway',[2136,2256,2164,2304]);
K.EDGE_Y=[-4700,4700];       // how far up and down the camera may go
}
