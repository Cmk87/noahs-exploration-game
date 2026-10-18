/* =============================================================
   CITY (pilot). A little living town to explore: tap anything to hear
   its name and watch it do something, find the 14 hidden animals,
   🔎 asks "Where is …?", 🌙 switches to night.
   World: 1200 × 1600 units, y down. The ground is seen from above and
   buildings from the front ("2.5D"); things are drawn back to front by
   the y of their base, so nearer things cover farther ones.
============================================================= */
(()=>{
const CW=1200,CH=1600,TAU=Math.PI*2;          // the town
const WX0=-1400,WX1=5400,WY0=-900,WY1=2400;   // the whole world around it (js/city-wild.js, city-far.js, city-west.js, city-industry.js)
const cv=$('cityCv'),g=cv.getContext('2d'),probe=document.createElement('canvas').getContext('2d');
let T=0,NIGHT=0,nightOn=false,HITS=[];const LIT=[],LIGHTS=[],ST={T:0,NIGHT:0};
let seed=11;
const sr=()=>{seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const sm=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
const li=()=>({de:0,en:1,es:2})[lang];
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const FX={},fx=k=>T-(k in FX?FX[k]:-99),act=k=>{FX[k]=T;};
const LATER=[];const SPIN={ferris:0,carousel:0,turbine:0,coaster:0,crane:0,digger:0};const later=(s,f)=>LATER.push({at:T+s,f});

/* ---------- drawing primitives ---------- */
function rr(x,y,w,h,r,c){g.fillStyle=c;g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else g.rect(x,y,w,h);g.fill();}
function circ(x,y,r,c){g.fillStyle=c;g.beginPath();g.arc(x,y,Math.max(0,r),0,TAU);g.fill();}
function ell(x,y,rx,ry,c,rot){g.fillStyle=c;g.beginPath();g.ellipse(x,y,Math.max(0,rx),Math.max(0,ry),rot||0,0,TAU);g.fill();}
function poly(c,...p){g.fillStyle=c;g.beginPath();g.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)g.lineTo(p[i],p[i+1]);g.closePath();g.fill();}
function ln(c,w,...p){g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)g.lineTo(p[i],p[i+1]);g.stroke();}
function star(x,y,r,c){g.fillStyle=c;g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*0.45:r;g.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}g.fill();}
const SH={};
function shade(c,f){const k=c+f;if(SH[k])return SH[k];const n=parseInt(c.slice(1),16);let r=n>>16,gg=n>>8&255,b=n&255;
  if(f<0){r*=1+f;gg*=1+f;b*=1+f;}else{r+=(255-r)*f;gg+=(255-gg)*f;b+=(255-b)*f;}
  return SH[k]=`rgb(${r|0},${gg|0},${b|0})`;}
const FONT=s=>`800 ${s}px "Baloo 2",system-ui,sans-serif`;
function sign(cx,cy,w,h,txt,bg,fg){
  rr(cx-w/2,cy-h/2,w,h,h*0.3,bg);let fs=h*0.8;g.font=FONT(fs);const m=g.measureText(txt).width;
  if(m>w*0.88){fs*=w*0.88/m;g.font=FONT(fs);}
  g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';g.fillText(txt,cx,cy+fs*0.07);}
function win(x,y,w,h,frame){
  rr(x-1.5,y-1.5,w+3,h+3,3,frame||'#FFFFFF');rr(x,y,w,h,2,'#8ED2F4');
  poly('rgba(255,255,255,.55)',x+2,y+h-2,x+w*0.5,y+2,x+w*0.72,y+2,x+w*0.22+2,y+h-2);
  LIT.push(x,y,w,h);}
const shadowB=(x,y,w,d)=>rr(x+5,y+d-5,w+7,10,5,'rgba(20,60,20,.2)');
/* a building with a pitched roof (ridge left–right) seen from the front */
function gableB(x,y,w,d,h,wall,roof){
  const Ye=y+d-h,Yr=y+d/2-h-d*0.45,o=6;
  shadowB(x,y,w,d);
  rr(x,Ye,w,h,[0,0,3,3],wall);
  g.fillStyle='rgba(0,0,0,.07)';g.fillRect(x,Ye,w,7);
  rr(x-o+2,Yr-5,w+2*o-4,8,3,shade(roof,0.28));
  rr(x-o,Yr,w+2*o,Ye-Yr+5,[3,3,4,4],roof);
  g.strokeStyle=shade(roof,-0.16);g.lineWidth=1.3;g.beginPath();
  for(let yy=Yr+7;yy<Ye;yy+=7){g.moveTo(x-o+3,yy);g.lineTo(x+w+o-3,yy);}g.stroke();
  rr(x-o,Ye+1,w+2*o,5,2,shade(roof,-0.32));
  return {Ye,Yr};}
/* a flat-roofed building: roof seen from above, facade from the front */
function flatB(x,y,w,d,h,wall,top,trim){
  shadowB(x,y,w,d);
  rr(x,y-h,w,d,4,top);g.strokeStyle=shade(top,-0.14);g.lineWidth=3;g.strokeRect(x+1.5,y-h+1.5,w-3,d-3);
  rr(x,y+d-h,w,h,[0,0,3,3],wall);
  rr(x-1,y+d-h-2,w+2,6,2,trim||shade(wall,-0.15));
  return y+d-h;}
function kid(x,y,shirt,skin,hair,s){s=s||1;
  rr(x-4*s,y-11*s,8*s,10*s,3*s,shirt);circ(x,y-15*s,4.6*s,skin);
  g.fillStyle=hair;g.beginPath();g.arc(x,y-16*s,4.8*s,Math.PI,TAU);g.fill();
  circ(x-1.6*s,y-15*s,0.8*s,'#2B2233');circ(x+1.6*s,y-15*s,0.8*s,'#2B2233');}
const SKIN=['#F6D2B4','#D9A27E','#9C6B4E','#F1C7A0'],HAIR=['#5A3A22','#2B2233','#E0B04A','#A0502C'];

/* ---------- words ---------- */
const ENT={};
function ent(id,ic,n,l,o){ENT[id]=Object.assign({id,ic,n,l},o||{});}
ent('police','🚓',['die Polizei','the police station','la comisaría'],['Die Polizei! Sie passt auf uns auf.','The police station! The police keep us safe.','¡La comisaría! La policía nos cuida.'],{find:1});
ent('fire','🚒',['die Feuerwehr','the fire station','la estación de bomberos'],['Die Feuerwehr! Tatütata, das Feuerwehrauto fährt los!','The fire station! Nee-naw, here comes the fire engine!','¡Los bomberos! ¡Sale el camión de bomberos!'],{find:1});
ent('hospital','🏥',['das Krankenhaus','the hospital','el hospital'],['Das Krankenhaus! Hier werden Kranke wieder gesund.','The hospital! Doctors help sick people get better.','¡El hospital! Aquí curan a los enfermos.'],{find:1});
ent('school','🏫',['die Schule','the school','la escuela'],['Die Schule! Ding dong, die Glocke läutet.','The school! Ding dong, the bell is ringing.','¡La escuela! Din don, suena la campana.'],{find:1});
ent('playground','🛝',['der Spielplatz','the playground','el parque infantil'],['Der Spielplatz! Rutschen und schaukeln.','The playground! Slide and swing.','¡El parque infantil! A tirarse por el tobogán.'],{find:1});
ent('bakery','🥨',['die Bäckerei','the bakery','la panadería'],['Die Bäckerei! Mmh, frisches Brot und Brezeln.','The bakery! Mmm, fresh bread.','¡La panadería! Mmm, pan recién hecho.'],{find:1});
ent('fountain','⛲',['der Brunnen','the fountain','la fuente'],['Der Brunnen! Platsch!','The fountain! Splash!','¡La fuente! ¡Chof!'],{find:1});
ent('square','🏛️',['der Marktplatz','the town square','la plaza'],null);
ent('post','📮',['die Post','the post office','la oficina de correos'],['Die Post! Hier gibt es Briefe und Pakete.','The post office! Letters and parcels.','¡Correos! Cartas y paquetes.'],{find:1});
ent('house','🏠',['das Haus','the house','la casa'],['Das Haus. Hier wohnt eine Familie.','A house. A family lives here.','La casa. Aquí vive una familia.'],{find:1});
ent('ferris','🎡',['das Riesenrad','the Ferris wheel','la noria'],['Das Riesenrad! Hui, ganz nach oben!','The Ferris wheel! Wheee, up to the top!','¡La noria! ¡Arriba, muy alto!'],{find:1});
ent('carousel','🎠',['das Karussell','the carousel','el tiovivo'],['Das Karussell! Rundherum!','The carousel! Round and round!','¡El tiovivo! ¡Vueltas y vueltas!'],{find:1});
ent('coaster','🎢',['die Achterbahn','the roller coaster','la montaña rusa'],['Die Achterbahn! Juhuu!','The roller coaster! Woohoo!','¡La montaña rusa! ¡Yupi!'],{find:1});
ent('park','🎪',['der Freizeitpark','the amusement park','el parque de atracciones'],null);
ent('balloon','🎈',['der Luftballon','the balloon','el globo'],['Ein Luftballon! Er fliegt weg!','A balloon! It is flying away!','¡Un globo! ¡Se va volando!']);
ent('site','🚧',['die Baustelle','the building site','la obra'],['Die Baustelle! Hier wird ein Haus gebaut.','The building site! They are building a house.','¡La obra! Aquí construyen una casa.'],{find:1});
ent('crane','🏗️',['der Kran','the crane','la grúa'],['Der Kran! Er hebt schwere Sachen.','The crane! It lifts heavy things.','¡La grúa! Levanta cosas pesadas.'],{find:1});
ent('digger','🚜',['der Bagger','the digger','la excavadora'],['Der Bagger! Er gräbt ein Loch.','The digger! It digs a hole.','¡La excavadora! Hace un agujero.'],{find:1});
ent('station','🚉',['der Bahnhof','the train station','la estación de tren'],['Der Bahnhof! Von hier fährt der Zug in den Wilden Westen.','The train station! The train goes to the Wild West from here.','¡La estación de tren! De aquí sale el tren al Lejano Oeste.'],{find:1});
ent('train','🚂',['der Zug','the train','el tren'],['Der Zug! Tschu-tschu!','The train! Choo choo!','¡El tren! ¡Chu chu!']);
ent('rail','🛤️',['das Gleis','the railway','la vía del tren'],['Das Gleis! Hier fährt der Zug.','The railway! The train runs here.','¡La vía! Por aquí pasa el tren.']);
ent('power','⚡',['das Kraftwerk','the power station','la central eléctrica'],['Das Kraftwerk! Es macht Strom für die Lampen.','The power station! It makes electricity for the lights.','¡La central eléctrica! Hace la luz para las casas.'],{find:1});
ent('turbine','🌬️',['das Windrad','the wind turbine','el molino de viento'],['Das Windrad! Der Wind dreht es.','The wind turbine! The wind turns it.','¡El molino de viento! El viento lo mueve.'],{find:1});
ent('harbour','⚓',['der Hafen','the harbour','el puerto'],['Der Hafen! Hier legen die Schiffe an.','The harbour! Boats stop here.','¡El puerto! Aquí llegan los barcos.'],{find:1});
ent('ship','🚢',['das Schiff','the ship','el barco'],['Das Schiff! Tuuut!','The ship! Toot toot!','¡El barco! ¡Tuuut!'],{find:1});
ent('boat','⛵',['das Segelboot','the sailing boat','el velero'],['Das Segelboot! Der Wind schiebt es.','The sailing boat! The wind pushes it.','¡El velero! El viento lo empuja.']);
ent('lighthouse','🗼',['der Leuchtturm','the lighthouse','el faro'],['Der Leuchtturm! Sein Licht zeigt den Schiffen den Weg.','The lighthouse! Its light shows the ships the way.','¡El faro! Su luz guía a los barcos.'],{find:1});
ent('bridge','🌉',['die Brücke','the bridge','el puente'],['Die Brücke! Sie geht über den Fluss.','The bridge! It goes over the river.','¡El puente! Cruza el río.'],{find:1});
ent('river','🏞️',['der Fluss','the river','el río'],['Der Fluss! Das Wasser fließt in den See.','The river! The water flows into the lake.','¡El río! El agua va al lago.'],{find:1});
ent('lake','🌊',['der See','the lake','el lago'],['Der See! Da springt ein Fisch.','The lake! A fish is jumping.','¡El lago! Salta un pez.'],{find:1});
ent('forest','🌲',['der Wald','the forest','el bosque'],['Der Wald! Hier wohnen viele Tiere. Findest du sie?','The forest! Lots of animals live here. Can you find them?','¡El bosque! Aquí viven muchos animales. ¿Los encuentras?'],{find:1});
ent('tree','🌳',['der Baum','the tree','el árbol'],null);
ent('mountain','⛰️',['der Berg','the mountain','la montaña'],['Der Berg! Ganz oben liegt Schnee.','The mountain! There is snow on the top.','¡La montaña! Arriba hay nieve.'],{find:1});
ent('cave','🕳️',['die Höhle','the cave','la cueva'],['Die Höhle! Pssst, wer schläft da drin?','The cave! Shh, who is sleeping in there?','¡La cueva! Shhh, ¿quién duerme ahí?'],{find:1});
ent('farm','🐄',['der Bauernhof','the farm','la granja'],['Der Bauernhof! Kikeriki!','The farm! Cock-a-doodle-doo!','¡La granja! ¡Quiquiriquí!'],{find:1});
ent('field','🌾',['das Feld','the field','el campo'],null,{find:1});
ent('tractor','🚜',['der Traktor','the tractor','el tractor'],['Der Traktor! Brumm brumm!','The tractor! Brrm brrm!','¡El tractor! ¡Brum brum!'],{find:1});
ent('road','🛣️',['die Straße','the road','la calle'],['Die Straße! Erst links und rechts schauen.','The road! Look left and right first.','¡La calle! Primero mira a los dos lados.']);
ent('meadow','🌼',['die Wiese','the meadow','el prado'],null);
ent('lamp','💡',['die Straßenlaterne','the street lamp','la farola'],null);
ent('car','🚗',['das Auto','the car','el coche'],['Das Auto! Tut tut!','The car! Beep beep!','¡El coche! ¡Pi pi!']);
ent('bus','🚌',['der Bus','the bus','el autobús'],['Der Bus! Alle einsteigen!','The bus! All aboard!','¡El autobús! ¡Todos arriba!']);
ent('firetruck','🚒',['das Feuerwehrauto','the fire engine','el camión de bomberos'],['Das Feuerwehrauto! Tatütata!','The fire engine! Nee-naw!','¡El camión de bomberos! ¡Ninooo!']);
ent('policecar','🚓',['das Polizeiauto','the police car','el coche de policía'],['Das Polizeiauto! Tatütata!','The police car! Nee-naw!','¡El coche de policía! ¡Ninooo!']);
ent('ambulance','🚑',['der Krankenwagen','the ambulance','la ambulancia'],['Der Krankenwagen! Tatütata!','The ambulance! Nee-naw!','¡La ambulancia! ¡Ninooo!']);
ent('heli','🚁',['der Hubschrauber','the helicopter','el helicóptero'],['Der Hubschrauber! Er fliegt los!','The helicopter! Off it goes!','¡El helicóptero! ¡Despega!'],{find:1});
const ANIMALS=[
  ['bear','🐻',['der Bär','the bear','el oso'],['Der Bär! Er ist aufgewacht. Gäähn!','The bear! It woke up. Yaaawn!','¡El oso! Se ha despertado. ¡Aaah!']],
  ['fox','🦊',['der Fuchs','the fox','el zorro'],['Der Fuchs! Er hat sich im Busch versteckt.','The fox! It was hiding in the bush.','¡El zorro! Estaba escondido en el arbusto.']],
  ['owl','🦉',['die Eule','the owl','el búho'],['Die Eule! Huhu!','The owl! Hoo hoo!','¡El búho! ¡Uh, uh!']],
  ['deer','🦌',['das Reh','the deer','el corzo'],['Das Reh! Es springt durch den Wald.','The deer! It jumps through the forest.','¡El corzo! Salta por el bosque.']],
  ['squirrel','🐿️',['das Eichhörnchen','the squirrel','la ardilla'],['Das Eichhörnchen! Es sammelt Nüsse.','The squirrel! It collects nuts.','¡La ardilla! Recoge nueces.']],
  ['hedgehog','🦔',['der Igel','the hedgehog','el erizo'],['Der Igel! Er schläft unter den Blättern.','The hedgehog! It sleeps under the leaves.','¡El erizo! Duerme bajo las hojas.']],
  ['rabbit','🐰',['der Hase','the rabbit','el conejo'],['Der Hase! Hopp, hopp!','The rabbit! Hop, hop!','¡El conejo! ¡Salta, salta!']],
  ['cat','🐱',['die Katze','the cat','el gato'],['Die Katze! Miau!','The cat! Meow!','¡El gato! ¡Miau!']],
  ['frog','🐸',['der Frosch','the frog','la rana'],['Der Frosch! Quak!','The frog! Ribbit!','¡La rana! ¡Croac!']],
  ['duck','🦆',['die Ente','the duck','el pato'],['Die Ente und ihre Küken! Quak quak!','The duck and her ducklings! Quack quack!','¡El pato y sus patitos! ¡Cuac cuac!']],
  ['cow','🐄',['die Kuh','the cow','la vaca'],['Die Kuh! Muuuh!','The cow! Moooo!','¡La vaca! ¡Muuu!']],
  ['pig','🐷',['das Schwein','the pig','el cerdo'],['Das Schwein! Grunz, grunz!','The pig! Oink oink!','¡El cerdo! ¡Oinc, oinc!']],
  ['sheep','🐑',['das Schaf','the sheep','la oveja'],['Das Schaf! Mäh!','The sheep! Baa!','¡La oveja! ¡Beee!']],
  ['chicken','🐔',['das Huhn','the chicken','la gallina'],['Das Huhn! Gack, gack!','The chicken! Cluck cluck!','¡La gallina! ¡Coc, co, co!']]];
ANIMALS.forEach(([id,ic,n,l])=>ent(id,ic,n,l,{animal:1}));
const SIGN={police:['POLIZEI','POLICE','POLICÍA'],fire:['FEUERWEHR','FIRE STATION','BOMBEROS'],hospital:['KRANKENHAUS','HOSPITAL','HOSPITAL'],
  school:['SCHULE','SCHOOL','ESCUELA'],bakery:['BÄCKEREI','BAKERY','PANADERÍA'],station:['BAHNHOF','STATION','ESTACIÓN'],post:['POST','POST OFFICE','CORREOS']};
const W={found:['Gefunden!','Found it!','¡Lo encontraste!'],yes:['Ja, richtig!','Yes, well done!','¡Sí, muy bien!'],
  where:n=>[`Wo ist ${n}?`,`Where is ${n}?`,`¿Dónde está ${n}?`][li()],that:n=>[`Das ist ${n}.`,`That is ${n}.`,`Eso es ${n}.`][li()]};

/* ---------- saved progress ---------- */
let SAVE={found:[],stars:0};try{SAVE=Object.assign(SAVE,JSON.parse(localStorage.getItem('sl_city')||'{}'));}catch(e){}
const FOUND=new Set(SAVE.found);
const store=()=>{SAVE.found=[...FOUND];try{localStorage.setItem('sl_city',JSON.stringify(SAVE));}catch(e){}};
const paws=()=>{$('cPaws').textContent=`🐾 ${FOUND.size}/${ANIMALS.length}`;};

/* ---------- sounds ---------- */
function swp(f0,f1,dur,type,vol,when){const a=ac();if(!a)return;const t=a.currentTime+(when||0);
  const o=a.createOscillator(),gn=a.createGain();o.type=type||'sine';
  o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);
  gn.gain.setValueAtTime(0.0001,t);gn.gain.exponentialRampToValueAtTime(vol||0.12,t+0.03);gn.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(gn);gn.connect(a.destination);o.start(t);o.stop(t+dur+0.03);}
const SND={
  siren:()=>{for(let i=0;i<8;i++)beep(i%2?622:466,i*0.42,0.4,'triangle',0.1);},
  wail:()=>{for(let i=0;i<4;i++){swp(560,1050,0.5,'triangle',0.08,i*1.0);swp(1050,560,0.5,'triangle',0.08,i*1.0+0.5);}},
  horn:()=>{beep(392,0,0.16,'square',0.06);beep(494,0,0.16,'square',0.05);beep(392,0.22,0.2,'square',0.06);beep(494,0.22,0.2,'square',0.05);},
  whistle:()=>{beep(880,0,0.7,'sine',0.1);beep(1109,0,0.7,'sine',0.07);beep(880,0.85,0.4,'sine',0.1);beep(1109,0.85,0.4,'sine',0.07);},
  ship:()=>{beep(98,0,1.3,'sawtooth',0.09);beep(147,0,1.3,'sawtooth',0.05);},
  bell:()=>{[0,0.55,1.1].forEach(t=>{beep(1319,t,0.7,'sine',0.13);beep(988,t+0.27,0.7,'sine',0.11);});},
  ding:()=>{beep(1568,0,0.5,'sine',0.11);beep(2093,0.13,0.6,'sine',0.09);},
  moo:()=>{swp(170,115,1.1,'sawtooth',0.08);},
  oink:()=>{[0,0.2,0.4].forEach(t=>swp(380,230,0.13,'square',0.05,t));},
  baa:()=>{for(let i=0;i<7;i++)beep(430+(i%2)*35,i*0.08,0.09,'sawtooth',0.05);},
  cluck:()=>{[0,0.12,0.24,0.55,0.67].forEach(t=>beep(800,t,0.06,'square',0.045));},
  crow:()=>{swp(500,900,0.25,'sawtooth',0.06);swp(900,1000,0.3,'sawtooth',0.06,0.25);swp(1000,600,0.5,'sawtooth',0.06,0.55);},
  meow:()=>{swp(520,880,0.25,'sine',0.12);swp(880,540,0.4,'sine',0.12,0.25);},
  ribbit:()=>{beep(190,0,0.08,'square',0.09);beep(170,0.12,0.12,'square',0.09);},
  quack:()=>{[0,0.28].forEach(t=>swp(720,480,0.16,'sawtooth',0.06,t));},
  hoot:()=>{beep(420,0,0.35,'sine',0.14);beep(380,0.45,0.55,'sine',0.14);},
  yawn:()=>{swp(240,90,1.4,'sawtooth',0.07);noise(0.9,0.05);},
  squeak:()=>{[0,0.1,0.2].forEach(t=>beep(1900,t,0.05,'sine',0.07));},
  hop:()=>{[0,0.35,0.7].forEach(t=>swp(300,700,0.12,'sine',0.08,t));},
  splash:()=>{noise(0.5,0.14);},
  zap:()=>{swp(150,1800,0.35,'square',0.05);for(let i=0;i<5;i++)setTimeout(()=>noise(0.06,0.2),i*90);},
  whoosh:()=>{noise(0.9,0.07);},
  music:()=>{[523,659,784,659,523,659,784,1047,988,784].forEach((f,i)=>beep(f,i*0.18,0.25,'sine',0.09));},
  tune:()=>{[784,659,784,880,784,659,523,587,659,523].forEach((f,i)=>beep(f,i*0.22,0.3,'triangle',0.08));},
  motor:()=>{for(let i=0;i<10;i++)beep(70+(i%2)*8,i*0.09,0.09,'square',0.05);},
  chop:()=>{for(let i=0;i<14;i++)setTimeout(()=>noise(0.05,0.12),i*110);},
  yay:()=>{[784,988,1175,1568].forEach((f,i)=>beep(f,i*0.09,0.3,'triangle',0.13));},
  pop:()=>{noise(0.1,0.25);swp(900,2400,0.08,'square',0.06);}};

/* ---------- particles ---------- */
const PARTS=[];
function puff(x,y,o){PARTS.push(Object.assign({x,y,vx:rnd(-3,3),vy:-14,life:0,max:2.2,k:'smoke',r:4,c:'#FFFFFF'},o));}
function burst(x,y,k,n,c,sp){for(let i=0;i<n;i++){const a=rnd(0,TAU),v=rnd(30,90)*(sp||1);
  PARTS.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40*(sp||1),life:0,max:rnd(0.8,1.4),k,r:rnd(3,6),c:c||'#FFD23F',gr:90});}}
function textP(x,y,t,c,r){PARTS.push({x,y,vx:rnd(-4,4),vy:-16,life:0,max:2.2,k:'text',t,c:c||'#FFFFFF',r:r||14});}
function stepParts(dt){for(let i=PARTS.length-1;i>=0;i--){const p=PARTS[i];p.life+=dt;if(p.life>p.max){PARTS.splice(i,1);continue;}
  p.vy+=(p.gr||0)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.k==='smoke')p.vx+=5*dt;}}
function drawParts(){for(const p of PARTS){const a=1-p.life/p.max;
  if(p.k==='smoke'){g.globalAlpha=a*0.7;circ(p.x,p.y,p.r*(1+p.life*1.1),p.c);}
  else if(p.k==='star'){g.globalAlpha=Math.min(1,a*1.6);star(p.x,p.y,p.r*1.4,p.c);}
  else if(p.k==='drop'){g.globalAlpha=a;circ(p.x,p.y,p.r*0.5,p.c);}
  else if(p.k==='leaf'){g.globalAlpha=Math.min(1,a*2);ell(p.x,p.y,p.r,p.r*0.55,p.c,p.life*6);}
  else if(p.k==='text'){g.globalAlpha=Math.min(1,a*2);g.font=FONT(p.r);g.textAlign='center';g.textBaseline='middle';
    g.lineWidth=3;g.strokeStyle='rgba(29,35,80,.6)';g.strokeText(p.t,p.x,p.y);g.fillStyle=p.c;g.fillText(p.t,p.x,p.y);}
  else if(p.k==='emoji'){g.globalAlpha=Math.min(1,a*2);g.font=`${p.r}px sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillText(p.t,p.x,p.y);}
  else if(p.k==='balloon'){g.globalAlpha=Math.min(1,a*3);ln('rgba(80,80,80,.7)',0.8,p.x,p.y+p.r,p.x+Math.sin(p.life*3)*3,p.y+p.r+16);
    ell(p.x,p.y,p.r*0.85,p.r,p.c);circ(p.x-p.r*0.3,p.y-p.r*0.35,p.r*0.22,'rgba(255,255,255,.6)');}
  else if(p.k==='bird'){g.globalAlpha=Math.min(1,a*3);const f=Math.sin(p.life*18)*3;ln('#3A3F55',1.6,p.x-5,p.y-f,p.x,p.y,p.x+5,p.y-f);}
} g.globalAlpha=1;}

/* ---------- map layout ---------- */
function catmull(P,n){const out=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
  for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;out.push([0,1].map(j=>0.5*((2*p1[j])+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)));}}
  out.push(P[P.length-1]);return out;}
const RS=catmull([[822,-330],[808,-200],[815,-40],[798,120],[836,300],[808,480],[826,650],[815,800],[832,960],[806,1110],[818,1255],[805,1380]],10);
const RIVER=new Path2D(),RIVC=new Path2D();
(()=>{const L=[],R=[];RS.forEach((p,i)=>{const a=RS[Math.max(0,i-1)],b=RS[Math.min(RS.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,
  w=42+Math.max(0,(i/RS.length-0.86))*260;L.push([p[0]-dy/d*w,p[1]+dx/d*w]);R.push([p[0]+dy/d*w,p[1]-dx/d*w]);});
  L.concat(R.reverse()).forEach((p,i)=>i?RIVER.lineTo(p[0],p[1]):RIVER.moveTo(p[0],p[1]));RIVER.closePath();
  RS.forEach((p,i)=>i?RIVC.lineTo(p[0],p[1]):RIVC.moveTo(p[0],p[1]));})();
const riverAt=u=>{const f=Math.max(0,Math.min(1,u))*(RS.length-1),i=Math.min(RS.length-2,f|0),t=f-i;
  return [RS[i][0]+(RS[i+1][0]-RS[i][0])*t,RS[i][1]+(RS[i+1][1]-RS[i][1])*t];};
const LAKE=new Path2D();
for(let i=0;i<=64;i++){const a=i/64*TAU,r=1+0.06*Math.sin(3*a+1)+0.04*Math.cos(5*a);const x=915+Math.cos(a)*370*r,y=1490+Math.sin(a)*205*r;i?LAKE.lineTo(x,y):LAKE.moveTo(x,y);}
LAKE.closePath();
const inLake=(x,y)=>probe.isPointInPath(LAKE,x,y),inRiver=(x,y)=>probe.isPointInPath(RIVER,x,y);

const ROADS=[[WX0-40,380,740,380],[WX0-40,800,WX1+40,800],[250,-40,250,1150],[520,-40,520,800],[250,1150,600,1150]];
const ROADP=new Path2D();ROADS.forEach(r=>{ROADP.moveTo(r[0],r[1]);ROADP.lineTo(r[2],r[3]);});
const segD=(px,py,r)=>{const dx=r[2]-r[0],dy=r[3]-r[1],t=Math.max(0,Math.min(1,((px-r[0])*dx+(py-r[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(px-r[0]-dx*t,py-r[1]-dy*t);};
const onRoad=(x,y,w)=>ROADS.some(r=>segD(x,y,r)<(w||30));
const RECT={square:[282,412,488,768],park:[282,832,756,1118],site:[6,834,218,1116],field:[1046,838,1196,1004],pasture:[888,1028,1198,1230],
  farmyard:[888,830,1046,1028],forest:[872,0,1200,778],power:[14,1290,520,1600]};
const inR=(x,y,r)=>x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3];

/* random but fixed scenery */
const PATCH=[],FLOWERS=[],GLINT=[],TREES=[];
for(let i=0;i<70;i++)PATCH.push([sr()*CW,sr()*CH,30+sr()*60,14+sr()*26,sr()<0.5?'#9FDB7B':'#89CB65']);
for(let i=0;i<900&&FLOWERS.length<240;i++){const x=sr()*CW,y=sr()*CH;
  if(onRoad(x,y,36)||inLake(x,y)||inRiver(x,y)||Math.abs(y-1255)<22||inR(x,y,RECT.square)||inR(x,y,RECT.park)||inR(x,y,RECT.site)||inR(x,y,RECT.field)||inR(x,y,[14,1290,264,1402]))continue;
  FLOWERS.push([x,y,['#FFFFFF','#FFE14D','#FF8FB1','#B78CFF','#FF6B5E'][sr()*5|0]]);}
for(let i=0;i<26;i++){const a=sr()*TAU,r=sr()*0.8;GLINT.push([915+Math.cos(a)*300*r,1490+Math.sin(a)*160*r,sr()*6]);}
const TCOL=['#4FAE4A','#5CBF52','#45A048','#69C45A'];
/* forest: keep clear of the animals' hiding places and the cave */
const CLEAR=[[965,530,34],[1150,440,40],[930,380,30],[1035,665,38],[1115,722,30],[1065,300,50]];
for(let i=0;i<500&&TREES.length<52;i++){const x=885+sr()*310,y=250+sr()*515;
  if(CLEAR.some(c=>Math.hypot(x-c[0],y-c[1])<c[2]+16))continue;if(TREES.some(t=>Math.hypot(x-t[0],y-t[1])<34))continue;
  if(y<300&&Math.abs(x-1065)<70)continue;
  TREES.push([x,y,0.9+sr()*0.35,y<420||sr()<0.3?1:0,TCOL[sr()*4|0]]);}
[[40,160,0.8],[180,170,0.75],[205,320,0.8],[62,330,0.7],[300,70,1],[470,80,0.95],[385,40,0.85],[296,578,0.8],[476,578,0.8],
 [550,560,0.9],[740,540,0.85],[640,530,0.8],[205,580,0.8],[30,600,0.75],[290,1108,0.75],[740,1112,0.8],[230,1265,0],[500,1330,0.95],
 [470,1600,1],[520,1560,0.85],[30,1600,0.9],[255,1600,0.8],[745,190,0.8],[748,100,0.75],[560,40,0.85],[650,30,0.8],
 [205,1035,0.7],[1190,1030,0],[880,1220,0.8],[60,1590,0.9],[150,1600,0.8],[240,1440,0.75],[350,1600,0.9],[520,1440,0.8],[300,1380,0.75],[380,1440,0.7]].forEach(t=>{if(t[2])TREES.push([t[0],t[1],t[2],0,TCOL[sr()*4|0]]);});

/* =============================================================
   STATIC SCENERY — each item: base y (for sorting), bounds, draw
============================================================= */
const STATIC=[],VIEW=[0,0,CW,CH];
const S=(y,b,f)=>STATIC.push({y,b,f});
function hit(id,x0,y0,x1,y1,o){const h={id,b:[x0,y0,x1,y1]};if(o)Object.assign(h,o);HITS.push(h);if(!ENT[id].at&&!(o&&o.moving))ENT[id].at=h.b;}

/* trees */
function tree(x,y,s,kind,c){
  if(ST.zoom<0.75){ell(x+4*s,y+1,12*s,4*s,'rgba(20,70,20,.22)');rr(x-2.5*s,y-12*s,5*s,12*s,1,'#8A5A3B');       // far away: a simpler tree
    if(kind)poly(c,x-15*s,y-6*s,x,y-44*s,x+15*s,y-6*s);else circ(x,y-26*s,16*s,c);hit('tree',x-15*s,y-45*s,x+15*s,y+2);return;}
  ell(x+5*s,y+1,15*s,5*s,'rgba(20,70,20,.22)');
  const sw=Math.sin(T*1.3+x*0.05)*1.1*s+(fx('tree'+(x|0))<1.2?Math.sin(fx('tree'+(x|0))*30)*3*(1.2-fx('tree'+(x|0))):0);
  if(kind){
    rr(x-2.5*s,y-10*s,5*s,10*s,1.5,'#7A4E33');
    for(let i=0;i<3;i++){const yy=y-7*s-i*11*s,w=(16-i*4)*s,o=sw*0.35*(i+1);
      poly(c,x-w+o,yy,x+w+o,yy,x+o,yy-19*s);poly(shade(c,0.2),x-w+o,yy,x+o,yy-19*s,x-w*0.25+o,yy);}
    hit('tree',x-15*s,y-50*s,x+15*s,y+2);
  } else {
    rr(x-3*s,y-16*s,6*s,16*s,2,'#8A5A3B');
    circ(x-9*s+sw,y-22*s,11*s,shade(c,-0.1));circ(x+9*s+sw,y-22*s,11*s,shade(c,-0.1));
    circ(x+sw,y-29*s,15*s,c);circ(x-5*s+sw,y-34*s,7*s,shade(c,0.22));
    hit('tree',x-20*s,y-45*s,x+20*s,y+2);
  }}
TREES.forEach(t=>S(t[1],[t[0]-25*t[2],t[1]-55*t[2],t[0]+25*t[2],t[1]+5],()=>tree(t[0],t[1],t[2],t[3],t[4])));
/* a tap on a tree shakes it and drops leaves */
function shakeTree(x,y){let best=null,bd=1e9;for(const t of TREES){const d=Math.hypot(t[0]-x,t[1]-25-y);if(d<bd){bd=d;best=t;}}
  if(best){act('tree'+(best[0]|0));for(let i=0;i<6;i++)PARTS.push({x:best[0]+rnd(-12,12),y:best[1]-30*best[2],vx:rnd(-12,12),vy:rnd(-10,5),life:0,max:1.6,k:'leaf',r:3.5,c:best[3]?'#3E9A5E':'#7CC85A',gr:30});}}

/* houses: [x,y,w,d,h,wall,roof,chimney] */
const HOUSES=[[14,62,92,54,54,'#FFE3B3','#E2574C',1],[118,70,92,50,50,'#CDE7FF','#7E5BD6',0],[14,226,92,54,56,'#D8F5C8','#E98A2E',0],
  [118,232,92,50,52,'#FFD1DC','#4D7CD6',1],[16,436,92,52,52,'#FFD1DC','#7E5BD6',1],[120,446,92,50,56,'#CDE7FF','#E2574C',0]];
const roofTop=hs=>hs[1]+hs[3]/2-hs[4]-hs[3]*0.45;
HOUSES.forEach((hs,i)=>S(hs[1]+hs[3],[hs[0]-10,roofTop(hs)-30,hs[0]+hs[2]+10,hs[1]+hs[3]+20],()=>{
  const [x,y,w,d,h,wall,roof,chim]=hs,{Ye,Yr}=gableB(x,y,w,d,h,wall,roof),base=y+d;
  if(chim){rr(x+w*0.7,Yr-10,11,18,2,'#B5523B');rr(x+w*0.7-1.5,Yr-13,14,5,2,'#8E3B2A');}
  win(x+10,Ye+11,18,15);win(x+w-28,Ye+11,18,15);
  rr(x+9,Ye+28,20,4,2,'#9A6440');circ(x+13,Ye+27,2.4,'#FF6B8B');circ(x+19,Ye+26,2.4,'#FFD23F');circ(x+25,Ye+27,2.4,'#FF6B8B');
  const open=fx('house'+i)<3.5;
  rr(x+w/2-8,base-24,16,24,[7,7,0,0],open?'#3A2A30':'#9A6440');
  if(open){kid(x+w/2,base-1,['#FF6B5E','#3CC8F5','#FFC928'][i%3],SKIN[i%4],HAIR[i%4],1.15);
    if(Math.sin(fx('house'+i)*10)>0)rr(x+w/2+4,base-20,2,6,1,SKIN[i%4]);}
  else circ(x+w/2+4,base-12,1.5,'#FFD54A');
  if(i<4){rr(x+w/2-5,base,10,12,2,'#E9DCC2');
    g.fillStyle='#FFFFFF';for(let px=x-4;px<x+w+4;px+=7){if(Math.abs(px+2-(x+w/2))<9)continue;g.fillRect(px,base+5,4,12);}
    rr(x-4,base+8,w/2-6,2.5,1,'#FFFFFF');rr(x+w/2+8,base+8,w/2-4,2.5,1,'#FFFFFF');}
  if(i===1)drawCat(x+w*0.3,Ye-6,Yr);
  hit('house',x-6,Yr-6,x+w+6,base,{ref:i});
}));
function drawCat(x,y,Yr){
  const t=fx('cat'),up=t<3?Math.sin(Math.min(t,0.4)/0.4*Math.PI/2)*4:0,tail=Math.sin(T*2.2)*0.5;
  g.save();g.translate(x,y-up);
  g.strokeStyle='#F0A04B';g.lineWidth=2.6;g.lineCap='round';g.beginPath();g.moveTo(5,-3);g.quadraticCurveTo(13,-4+tail*6,11,-13+tail*4);g.stroke();g.lineCap='butt';
  ell(0,-5,7,6,'#F0A04B');circ(0,-13,5.5,'#F0A04B');
  poly('#F0A04B',-5,-15,-4,-21,-1,-17);poly('#F0A04B',5,-15,4,-21,1,-17);
  poly('#FFB6C1',-4.2,-16,-3.8,-19,-2,-17);poly('#FFB6C1',4.2,-16,3.8,-19,2,-17);
  rr(-3.4,-9,6.8,6,3,'#FFF2DF');
  if(t<3){circ(-2,-13.5,1.1,'#2B2233');circ(2,-13.5,1.1,'#2B2233');}else{ln('#2B2233',0.9,-3,-13,-1,-13);ln('#2B2233',0.9,1,-13,3,-13);}
  circ(0,-11.5,0.9,'#E37B8B');
  g.restore();
  hit('cat',x-9,y-26,x+15,y+2,{small:1});}

/* school with clock tower and playground */
S(260,[284,60,486,262],()=>{
  const x=290,y=186,w=190,d=74,h=80,{Ye,Yr}=gableB(x,y,w,d,h,'#FFD36E','#E25C4B'),cx=x+w/2,base=y+d;
  rr(cx-15,Yr-46,30,52,[2,2,0,0],'#FFD36E');poly('#E25C4B',cx-20,Yr-45,cx,Yr-68,cx+20,Yr-45);poly(shade('#E25C4B',0.2),cx-20,Yr-45,cx,Yr-68,cx-4,Yr-45);
  rr(cx-8,Yr-41,16,15,[8,8,0,0],'#5A3A2E');
  const bt=fx('school'),sw=bt<2.5?Math.sin(bt*12)*0.5*(2.5-bt)/2.5:0;
  g.save();g.translate(cx,Yr-39);g.rotate(sw);poly('#F2C24A',-5,10,5,10,3,2,-3,2);circ(0,2,3,'#F2C24A');circ(0,11,1.6,'#B8862A');g.restore();
  circ(cx,Yr-14,9,'#FFFFFF');circ(cx,Yr-14,9.5,'rgba(0,0,0,0)');g.strokeStyle='#5A3A2E';g.lineWidth=1.4;g.beginPath();g.arc(cx,Yr-14,9,0,TAU);g.stroke();
  const now=new Date(),hr=(now.getHours()%12+now.getMinutes()/60)/12*TAU,mn=now.getMinutes()/60*TAU;
  ln('#2B2233',1.8,cx,Yr-14,cx+Math.sin(hr)*5,Yr-14-Math.cos(hr)*5);ln('#2B2233',1.2,cx,Yr-14,cx+Math.sin(mn)*7.5,Yr-14-Math.cos(mn)*7.5);
  [x+12,x+44,x+w-66,x+w-34].forEach(wx=>win(wx,Ye+12,22,18));
  sign(cx,base-36,64,13,SIGN.school[li()],'#3B6FD8','#FFFFFF');
  rr(cx-14,base-27,28,27,[4,4,0,0],'#8E5B3A');ln('#6E4228',1.5,cx,base-27,cx,base);
  hit('school',x-6,Yr-68,x+w+6,base);
});
S(342,[290,262,486,350],()=>{
  rr(296,292,52,40,6,'#B88A5A');rr(299,295,46,34,5,'#F0D58C');ell(312,312,7,4,'#E2C171');rr(322,305,8,6,1,'#FF6B5E');
  // swing
  const sa=Math.sin(T*2.4)*(0.45+(fx('playground')<4?0.35:0)),px=388,py=292;
  ln('#3B6FD8',3,362,342,370,290,406,290,414,342);ln('#3B6FD8',3,370,290,406,290);
  const sx=px+Math.sin(sa)*36,sy=py+Math.cos(sa)*36;ln('#555',1,px-4,py,sx-4,sy);ln('#555',1,px+4,py,sx+4,sy);
  rr(sx-6,sy-1,12,3,1,'#E2574C');kid(sx,sy,'#FF6B5E',SKIN[0],HAIR[2],1);
  // slide
  ln('#9AA4B8',2.4,436,342,436,300);ln('#9AA4B8',2.4,446,342,446,300);for(let yy=306;yy<340;yy+=8)ln('#9AA4B8',1.6,436,yy,446,yy);
  rr(432,296,18,6,2,'#FFC928');poly('#FF6B5E',446,298,478,338,478,344,446,304);
  const st=fx('playground'),u=st<1.6?sm(st/1.6):(T%5)/5<0.3?0:-1;
  if(u>=0){kid(452+u*24,302+u*36,'#3CC8F5',SKIN[2],HAIR[1],1);}else kid(441,300,'#3CC8F5',SKIN[2],HAIR[1],1);
  hit('playground',292,282,482,346);
});
/* hospital with helipad */
S(330,[552,110,748,352],()=>{
  const x=558,y=212,w=184,d=118,h=90,Fy=flatB(x,y,w,d,h,'#F4F7FB','#D3DAE5','#4FA8EE'),base=y+d;
  circ(x+w/2,y-h+d/2,30,'#5F6B80');circ(x+w/2,y-h+d/2,26,'#6E7A90');g.strokeStyle='#FFD23F';g.lineWidth=3;g.beginPath();g.arc(x+w/2,y-h+d/2,24,0,TAU);g.stroke();
  g.font=FONT(30);g.fillStyle='#FFFFFF';g.textAlign='center';g.textBaseline='middle';g.fillText('H',x+w/2,y-h+d/2+2);
  for(let r=0;r<2;r++)for(let c=0;c<5;c++){if(r===1&&(c===2))continue;win(x+12+c*35,Fy+10+r*32,22,18);}
  rr(x+w/2-11,Fy+8,22,22,4,'#FFFFFF');rr(x+w/2-3.5,Fy+11,7,16,1,'#E8443A');rr(x+w/2-8,Fy+15.5,16,7,1,'#E8443A');
  sign(x+w/2,base-32,96,12,SIGN.hospital[li()],'#E8443A','#FFFFFF');
  rr(x+w/2-16,base-24,32,24,2,'#BFE6FA');ln('#9AA4B8',1.5,x+w/2,base-24,x+w/2,base);
  rr(560,332,182,16,4,'#CBD0DB');
  if(!VEH.some(v=>v.kind==='ambulance'))vehicle(712,346,'W',VKIND.ambulance);
  hit('hospital',x-4,y-h,x+w+4,base);
});
/* police */
S(712,[10,566,218,770],()=>{
  const x=16,y=652,w=196,d=60,h=80,Fy=flatB(x,y,w,d,h,'#EEF3FA','#C8D0DC','#2F5FD0'),base=y+d;
  rr(x,Fy+30,w,6,0,'#2F5FD0');
  sign(x+w/2,Fy+15,92,15,SIGN.police[li()],'#2F5FD0','#FFFFFF');
  [x+12,x+42,x+w-64,x+w-34].forEach(wx=>win(wx,Fy+42,22,16));
  rr(x+w/2-15,base-28,30,28,[3,3,0,0],'#7FB3F2');ln('#2F5FD0',1.5,x+w/2,base-28,x+w/2,base);
  const on=fx('police')<6&&Math.sin(T*16)>0;circ(x+w-18,y-h+8,5,on?'#4D8BFF':'#9DB8E8');if(on)LIGHTS.push(x+w-18,y-h+8,30,'#4D8BFF');
  rr(16,722,196,40,4,'#C5CAD6');g.fillStyle='#FFFFFF';[60,104,148].forEach(px=>g.fillRect(px,724,2,30));
  if(!VEH.some(v=>v.kind==='police'))vehicle(170,754,'W',VKIND.police);
  hit('police',x-4,y-h,x+w+4,base);
});
/* town square: bakery, fountain, benches, pigeons */
S(514,[290,396,480,516],()=>{
  const x=300,y=470,w=170,d=44,h=66,{Ye,Yr}=gableB(x,y,w,d,h,'#FFF1DA','#C7643C'),base=y+d,cx=x+w/2;
  sign(cx,Ye+10,84,14,SIGN.bakery[li()],'#8E4A2A','#FFE9C2');
  for(let i=0;i<10;i++)rr(x+4+i*16.2,Ye+19,16.2,12,[0,0,6,6],i%2?'#FFFFFF':'#E8443A');
  rr(x+10,base-30,60,26,3,'#FFFFFF');rr(x+12,base-28,56,22,2,'#F7E1B5');
  ell(x+24,base-12,9,4,'#C8823E');ell(x+42,base-12,8,5,'#D9964C');ell(x+58,base-12,8,4,'#C8823E');
  g.strokeStyle='#B5652A';g.lineWidth=2.4;g.beginPath();g.arc(x+33,base-22,4,0,TAU);g.arc(x+41,base-22,4,0,TAU);g.stroke();
  rr(x+100,base-30,60,26,3,'#FFFFFF');rr(x+102,base-28,56,22,2,'#F7E1B5');[0,1,2].forEach(i=>ell(x+113+i*17,base-13,6,5,['#E2B46E','#F2D398','#C8823E'][i]));
  const bt=fx('bakery'),op=bt<2.5;rr(x+77,base-26,16,26,[7,7,0,0],op?'#5A3A2E':'#8E5B3A');
  if(op&&Math.random()<0.25)puff(x+85+rnd(-6,6),base-24,{c:'#FFFFFF',r:3,max:1.6,vy:-20});
  ln('#555',1.4,x+w-2,Ye+4,x+w+12,Ye+4);ln('#555',1,x+w+9,Ye+4,x+w+9,Ye+8);
  g.save();g.translate(x+w+9,Ye+13+Math.sin(T*1.5)*0.5);g.strokeStyle='#C8823E';g.lineWidth=2.6;g.beginPath();
  g.arc(-3,0,4,0,TAU);g.moveTo(7,0);g.arc(3,0,4,0,TAU);g.stroke();g.restore();
  hit('bakery',x-6,Yr-6,x+w+16,base);
});
const PIGEONS=[[350,690],[420,700],[338,600],[440,612]];
S(662,[320,575,450,690],()=>{
  const cx=385,cy=640,ft=fx('fountain');
  ell(cx+4,cy+6,62,25,'rgba(0,0,0,.12)');ell(cx,cy,58,23,'#AAB4C8');ell(cx,cy-3,58,23,'#C9D1DF');ell(cx,cy-2,50,18,'#5DBDF0');
  ell(cx,cy-2,42,14,'rgba(255,255,255,.18)');
  rr(cx-5,cy-36,10,34,3,'#C9D1DF');ell(cx,cy-36,18,6,'#AAB4C8');ell(cx,cy-38,16,5,'#C9D1DF');ell(cx,cy-38,13,3.5,'#5DBDF0');
  const big=ft<2?1.6:1;g.strokeStyle='rgba(220,245,255,.85)';g.lineWidth=2;
  for(let i=0;i<8;i++){const a=i/8*TAU+0.2,ex=cx+Math.cos(a)*34,ey=cy-2+Math.sin(a)*12;g.beginPath();g.moveTo(cx,cy-40);
    g.quadraticCurveTo(cx+Math.cos(a)*18,cy-62*big-Math.sin(T*6+i)*2,ex,ey);g.stroke();}
  ln('rgba(220,245,255,.9)',3,cx,cy-38,cx,cy-56*big);
  for(let i=0;i<3;i++){const r=((T*0.6+i/3)%1);g.globalAlpha=1-r;g.strokeStyle='#FFFFFF';g.lineWidth=1;g.beginPath();g.ellipse(cx,cy-2,14+r*30,5+r*10,0,0,TAU);g.stroke();}g.globalAlpha=1;
  hit('fountain',cx-60,cy-62,cx+60,cy+24);
});
PIGEONS.forEach((p,i)=>S(p[1],[p[0]-30,p[1]-120,p[0]+30,p[1]+5],()=>{
  const ft=fx('fountain'),fly=ft<4?Math.min(1,ft/1.2):0,ret=ft<4?0:0;
  const x=p[0]+fly*(i%2?50:-50)*Math.min(1,ft/2),y=p[1]-fly*(70+i*10)*(ft<3?1:Math.max(0,(4-ft)));
  if(fly>0&&ft<4){const f=Math.sin(T*20+i)*3;ell(x,y-4,4.5,3,'#8E96A8');ln('#6E7688',1.6,x-6,y-4-f,x,y-4,x+6,y-4-f);}
  else{const pk=Math.sin(T*3+i*2)>0.6?2:0;ell(x,y-4,5,3.6,'#9AA2B4');circ(x+4,y-7+pk,2.4,'#7E8698');circ(x+5,y-7.5+pk,0.7,'#222');poly('#E8A33E',x+6,y-7+pk,x+8.5,y-6.5+pk,x+6,y-6+pk);
    ln('#E8A33E',0.8,x-1,y-1,x-1,y+1);ln('#E8A33E',0.8,x+1,y-1,x+1,y+1);}
}));
[[296,732],[436,732]].forEach(([bx,by])=>S(by+6,[bx,by-16,bx+52,by+8],()=>{
  rr(bx+2,by-2,4,8,1,'#6E4A33');rr(bx+44,by-2,4,8,1,'#6E4A33');rr(bx,by-6,52,5,2,'#B07A4E');rr(bx,by-14,52,4,2,'#C48A5A');rr(bx,by-20,52,4,2,'#C48A5A');}));
/* post office + fire station */
S(498,[556,380,742,512],()=>{
  const x=566,y=452,w=170,d=46,h=56,{Ye,Yr}=gableB(x,y,w,d,h,'#FFE27A','#3F6FD8'),base=y+d;
  sign(x+w/2,Ye+12,56,14,SIGN.post[li()],'#2B2233','#FFE27A');
  win(x+14,Ye+22,24,16);win(x+w-38,Ye+22,24,16);
  rr(x+w/2-12,base-26,24,26,[4,4,0,0],'#3F6FD8');ln('#2E57B0',1.4,x+w/2,base-26,x+w/2,base);
  rr(x+w-12,base-14,12,18,[4,4,1,1],'#FFC928');rr(x+w-10,base-10,8,2,1,'#2B2233');
  if(fx('post')<2.2&&Math.random()<0.18)PARTS.push({x:x+w/2,y:base-20,vx:rnd(-40,40),vy:rnd(-60,-30),life:0,max:1.6,k:'emoji',t:'✉️',r:12,gr:20});
  hit('post',x-6,Yr-6,x+w+6,base);
});
S(716,[548,500,760,720],()=>{
  // hose tower
  const tx=718;rr(tx+5,670-145,34,5,2,'#B8392A');
  rr(tx,670-140,34,140,[3,3,0,0],'#E2533F');rr(tx-2,670-148,38,10,3,'#B8392A');
  [0,1,2].forEach(i=>win(tx+10,670-128+i*30,14,14));
  const on=fx('fire')<8&&Math.sin(T*14)>0;circ(tx+17,670-153,5,on?'#FF3B30':'#E89A90');if(on)LIGHTS.push(tx+17,670-153,34,'#FF3B30');
  const x=556,y=654,w=196,d=62,h=84,Fy=flatB(x,y,w,d,h,'#E2533F','#B9C1CC','#FFFFFF'),base=y+d;
  g.strokeStyle='rgba(120,30,20,.18)';g.lineWidth=1;g.beginPath();for(let yy=Fy+8;yy<base;yy+=7){g.moveTo(x,yy);g.lineTo(x+w,yy);}g.stroke();
  sign(x+w/2-10,Fy+15,112,16,SIGN.fire[li()],'#FFFFFF','#C8301F');
  const ft=fx('fire'),open=ft<1?sm(ft):ft<9?1:ft<10?1-sm(ft-9):0;
  [x+16,x+104].forEach((dx,j)=>{rr(dx-3,base-56,78,56,[5,5,0,0],'#FFFFFF');rr(dx,base-53,72,53,[3,3,0,0],'#3A3340');
    if(j===0&&open>0.3&&ft<1.8)vehicleFront(dx+36,base-1,VKIND.firetruck);
    if(j===1)vehicleFront(dx+36,base-1,VKIND.firetruck);
    const dh=53*(j===0?1-open:1);rr(dx,base-53,72,dh,[3,3,0,0],'#F3F4F7');
    g.strokeStyle='#C9CED8';g.lineWidth=1;g.beginPath();for(let yy=base-53+6;yy<base-53+dh;yy+=6){g.moveTo(dx+2,yy);g.lineTo(dx+70,yy);}g.stroke();
    if(dh>20)for(let k=0;k<4;k++)rr(dx+5+k*17,base-46,13,8,2,'#8ED2F4');});
  hit('fire',x-4,670-158,x+w+4,base);
});
/* building site */
S(1112,[0,850,220,1120],()=>{
  // crane
  const cx=40,base=1104,top=868,ang=Math.sin(SPIN.crane*0.5)*1.2+0.5;
  g.strokeStyle='#F2B21F';g.lineWidth=2;
  ln('#E0A21A',3,cx-7,base,cx-7,top);ln('#E0A21A',3,cx+7,base,cx+7,top);
  g.beginPath();for(let yy=base;yy>top;yy-=16){g.moveTo(cx-7,yy);g.lineTo(cx+7,yy-16);g.moveTo(cx+7,yy);g.lineTo(cx-7,yy-16);}g.stroke();
  const L=150,jx=cx+Math.cos(ang)*L,jy=top-8+Math.sin(ang)*L*0.28,bx=cx-Math.cos(ang)*45,by=top-8-Math.sin(ang)*45*0.28;
  ln('#E0A21A',5,bx,by,jx,jy);rr(bx-9,by-4,18,12,2,'#7A8296');
  rr(cx-9,top-20,18,14,3,'#E0A21A');rr(cx-6,top-17,12,7,2,'#BFE6FA');
  const tr=0.75,hx=cx+(jx-cx)*tr,hy=top-8+(jy-top+8)*tr,drop=60+Math.sin(SPIN.crane)*40;
  ln('#555',1,hx,hy,hx,hy+drop);rr(hx-10,hy+drop,20,10,1,'#C0473A');ln('#8E3B2A',1,hx-10,hy+drop+5,hx+10,hy+drop+5);
  hit('crane',cx-14,top-24,cx+20,base,{small:1});
  // barrier
  for(let i=0;i<5;i++){const bx2=12+i*42;rr(bx2,1106,34,7,2,'#FFFFFF');for(let k=0;k<3;k++)rr(bx2+3+k*11,1106,6,7,1,'#E8443A');
    rr(bx2+2,1113,3,6,1,'#666');rr(bx2+29,1113,3,6,1,'#666');}
});
S(1046,[90,920,214,1050],()=>{
  const x=100,y=990,w=104,d=56,h=60;shadowB(x,y,w,d);
  rr(x,y-h,w,d,3,'#B9C0CC');rr(x,y+d-h,w,h,0,'#C9CED8');g.fillStyle='rgba(0,0,0,.08)';g.fillRect(x,y+d-h,w,h/2);
  for(let r=0;r<2;r++)for(let c=0;c<3;c++)rr(x+10+c*32,y+d-h+8+r*26,18,16,1,'#5A6074');
  g.strokeStyle='#E0A21A';g.lineWidth=1.8;g.beginPath();
  for(let px=x-4;px<=x+w+4;px+=27){g.moveTo(px,y+d);g.lineTo(px,y+d-h-12);}
  for(let yy=y+d-4;yy>y+d-h-12;yy-=24){g.moveTo(x-4,yy);g.lineTo(x+w+4,yy);}g.stroke();
  for(let px=x-4;px<x+w;px+=27){rr(px,y+d-28,27,3,1,'#9A6440');}
  hit('site',x-6,y-h,x+w+6,y+d);
});
S(1100,[60,1040,214,1112],()=>{
  ell(100,1100,32,10,'rgba(0,0,0,.12)');ell(96,1094,30,14,'#D9A65E');ell(92,1088,20,10,'#E8BC74');ell(86,1084,8,4,'#F2CF8E');
  // excavator
  const dt=fx('digger'),ph=Math.sin(SPIN.digger),x=170,y=1102;
  ell(x+2,y+1,26,5,'rgba(0,0,0,.18)');rr(x-22,y-9,44,10,5,'#3A3F52');for(let k=0;k<5;k++)circ(x-16+k*8,y-4,3,'#6E748A');
  rr(x-18,y-24,34,15,3,'#F2B21F');rr(x-14,y-38,18,15,[4,4,0,0],'#F2B21F');rr(x-11,y-35,12,9,2,'#BFE6FA');rr(x+6,y-30,10,6,1,'#3A3F52');
  const a1=-2.3+ph*0.25,ax=x-12,ay=y-26,l1=30,ex=ax+Math.cos(a1)*l1,ey=ay+Math.sin(a1)*l1,a2=a1-1.9+ph*0.5,l2=24,bx=ex+Math.cos(a2)*l2,by=ey+Math.sin(a2)*l2;
  ln('#E0A21A',5,ax,ay,ex,ey);ln('#E0A21A',4,ex,ey,bx,by);
  g.save();g.translate(bx,by);g.rotate(a2+ph*0.6);poly('#5A6074',0,-5,10,-4,8,6,0,4);g.restore();
  if(dt<5&&Math.random()<0.15)PARTS.push({x:bx,y:by,vx:rnd(-20,20),vy:rnd(-40,-10),life:0,max:0.8,k:'drop',r:5,c:'#C8954E',gr:120});
  hit('digger',x-26,y-56,x+24,y+2,{small:1});
  [[20,1092],[40,1096]].forEach(([qx,qy])=>{poly('#FF7A1A',qx-5,qy,qx+5,qy,qx,qy-14);rr(qx-3,qy-8,6,2.5,1,'#FFFFFF');});
});
/* amusement park */
S(1084,[285,860,470,1090],()=>{
  const cx=375,cy=962,R=82,ft=fx('ferris'),rot=SPIN.ferris;
  rr(326,1076,98,10,4,'#9AA4B8');
  ln('#7E889C',6,cx,cy,cx-44,1080);ln('#7E889C',6,cx,cy,cx+44,1080);ln('#7E889C',3,cx-26,1030,cx+26,1030);
  g.strokeStyle='#FFFFFF';g.lineWidth=1.5;g.beginPath();for(let i=0;i<16;i++){const a=rot+i/16*TAU;g.moveTo(cx,cy);g.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);}g.stroke();
  g.lineWidth=5;g.strokeStyle='#FF6FA8';g.beginPath();g.arc(cx,cy,R,0,TAU);g.stroke();
  g.lineWidth=2.5;g.strokeStyle='#FFC94A';g.beginPath();g.arc(cx,cy,R-12,0,TAU);g.stroke();
  for(let i=0;i<16;i++){const a=rot+i/16*TAU,on=((i+Math.floor(T*4))%3)===0;circ(cx+Math.cos(a)*R,cy+Math.sin(a)*R,2.2,on?'#FFF59A':'#FFD3E6');
    if(on)LIGHTS.push(cx+Math.cos(a)*R,cy+Math.sin(a)*R,12,'#FFE07A');}
  circ(cx,cy,9,'#FF6FA8');circ(cx,cy,4,'#FFFFFF');
  const GC=['#3CC8F5','#FFC928','#7ED957','#FF8A3D','#B78CFF','#FF5A5F','#3CC8F5','#FFC928'];
  for(let i=0;i<8;i++){const a=rot+i/8*TAU,px=cx+Math.cos(a)*R,py=cy+Math.sin(a)*R;
    ln('#7E889C',1.4,px,py,px,py+5);rr(px-10,py+4,20,15,[3,3,7,7],GC[i]);rr(px-11,py+2,22,4,2,shade(GC[i],-0.25));rr(px-7,py+7,14,6,2,'#E9F6FF');
    if(i%2===0)circ(px,py+10,2.6,SKIN[i%4]);}
  hit('ferris',cx-R-12,cy-R-6,cx+R+12,1086);
});
const CO=u=>[548+u*204,912-Math.abs(Math.sin(u*Math.PI*2.5))*58*(1-0.35*u)];
S(934,[540,840,760,936],()=>{
  for(let u=0;u<=1.001;u+=0.05){const [x,y]=CO(u);ln('#C9CED8',2,x,y,x,932);}
  g.strokeStyle='#FF5A5F';g.lineWidth=4;g.beginPath();for(let u=0;u<=1.001;u+=0.01){const [x,y]=CO(u);u?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();
  g.strokeStyle='#FFFFFF';g.lineWidth=1;g.stroke();
  const ct=fx('coaster'),ph=SPIN.coaster%2,u=ph<1?ph:2-ph;
  for(let k=0;k<2;k++){const uu=Math.max(0,Math.min(1,u-(ph<1?k*0.05:-k*0.05))),[x,y]=CO(uu),[x2,y2]=CO(Math.min(1,uu+0.01)),a=Math.atan2(y2-y,x2-x);
    g.save();g.translate(x,y);g.rotate(a);rr(-9,-11,18,10,3,'#3CC8F5');circ(-3,-13,3,SKIN[k]);circ(4,-13,3,SKIN[k+2]);circ(-5,-1,2,'#333');circ(5,-1,2,'#333');g.restore();}
  if(ct<1.5&&Math.random()<0.1)textP(CO(u)[0],CO(u)[1]-20,['Juhuu!','Woohoo!','¡Yupi!'][li()],'#FFFFFF',12);
  hit('coaster',540,846,760,934);
});
S(1092,[585,975,725,1096],()=>{
  const cx=655,by=1084,ct=fx('carousel'),rot=SPIN.carousel,HC=['#FFFFFF','#FFB6D9','#9FDCF7','#FFE38A','#C9F2A6','#E4CCFF'];
  ell(cx+3,by+4,64,17,'rgba(0,0,0,.14)');ell(cx,by,60,16,'#E05A8A');ell(cx,by-4,60,16,'#F7D8A8');
  const H=[];for(let i=0;i<6;i++){const a=rot+i/6*TAU;H.push({a,s:Math.sin(a),i});}
  const horse=h=>{const x=cx+Math.cos(h.a)*44,y=by-4+h.s*11,bob=Math.sin(T*3+h.i)*4,fc=Math.cos(h.a+Math.PI/2)>0?1:-1;
    ln('#F2C24A',1.6,x,1012+h.s*6,x,y);g.save();g.translate(x,y-14+bob);g.scale(fc*(0.85+h.s*0.15),0.85+h.s*0.15);
    ell(0,0,10,5.5,HC[h.i]);rr(6,-11,5,10,2,HC[h.i]);ell(11,-11,5,3.4,HC[h.i]);ln(shade(HC[h.i],-0.3),1.5,-6,3,-7,9);ln(shade(HC[h.i],-0.3),1.5,6,3,7,9);
    ln('#E05A8A',2,6,-12,4,-6);circ(11.5,-12,0.9,'#333');g.restore();};
  H.filter(h=>h.s<0).forEach(horse);
  rr(cx-4,1010,8,by-1010,2,'#F2C24A');
  H.filter(h=>h.s>=0).forEach(horse);
  const RC=['#FF5A5F','#FFFFFF'];for(let i=0;i<12;i++){const a0=i/12*Math.PI,a1=(i+1)/12*Math.PI;
    poly(RC[i%2],cx,980,cx+Math.cos(a0)*66,1012+Math.sin(a0)*4,cx+Math.cos(a1)*66,1012+Math.sin(a1)*4);}
  for(let i=0;i<12;i++){const x=cx-66+i*12;g.fillStyle=RC[i%2];g.beginPath();g.arc(x+6,1013,6,0,Math.PI);g.fill();}
  circ(cx,978,4,'#F2C24A');ln('#7E889C',1,cx,978,cx,966);poly('#3CC8F5',cx,966,cx+11,969,cx,972);
  for(let i=0;i<6;i++){const on=((i+Math.floor(T*3))%2)===0;circ(cx-60+i*24,1016,1.8,on?'#FFF59A':'#FFD3E6');if(on)LIGHTS.push(cx-60+i*24,1016,12,'#FFE07A');}
  hit('carousel',cx-68,964,cx+68,by+16);
});
const BALC=['#FF5A5F','#FFC928','#3CC8F5','#7ED957','#B78CFF'];
S(1104,[488,1030,545,1106],()=>{
  const x=515,y=1104;
  for(let i=0;i<5;i++){const bx=x-14+i*7+Math.sin(T*1.6+i)*2,by=y-56-(i%2)*10;if(fx('balloon'+i)<9)continue;
    ln('rgba(80,80,80,.6)',0.8,x+6,y-24,bx,by+9);ell(bx,by,7,9,BALC[i]);circ(bx-2.4,by-3,1.8,'rgba(255,255,255,.6)');}
  kid(x,y,'#7ED957',SKIN[1],HAIR[0],1.3);rr(x+4,y-26,2,10,1,SKIN[1]);
  hit('balloon',x-20,y-72,x+22,y-30,{small:1});hit('park',x-10,y-30,x+10,y);
});
/* bunting over the park */
S(842,[280,820,540,850],()=>{const P=[[286,830],[400,844],[536,832]];
  ln('#7E889C',1,P[0][0],P[0][1],P[1][0],P[1][1],P[2][0],P[2][1]);
  for(let i=0;i<18;i++){const u=i/17,seg=u<0.5?0:1,t=(u-seg*0.5)*2,x=P[seg][0]+(P[seg+1][0]-P[seg][0])*t,y=P[seg][1]+(P[seg+1][1]-P[seg][1])*t;
    poly(BALC[i%5],x-4,y,x+4,y,x,y+9);}});
/* station */
S(1208,[330,1090,530,1210],()=>{
  const x=340,y=1176,w=180,d=32,h=66,{Ye,Yr}=gableB(x,y,w,d,h,'#F0C89A','#8C4A3C'),base=y+d,cx=x+w/2;
  circ(cx,Ye+13,9,'#FFFFFF');g.strokeStyle='#5A3A2E';g.lineWidth=1.4;g.beginPath();g.arc(cx,Ye+13,9,0,TAU);g.stroke();
  const now=new Date(),hr=(now.getHours()%12+now.getMinutes()/60)/12*TAU,mn=now.getMinutes()/60*TAU;
  ln('#2B2233',1.8,cx,Ye+13,cx+Math.sin(hr)*5,Ye+13-Math.cos(hr)*5);ln('#2B2233',1.2,cx,Ye+13,cx+Math.sin(mn)*7.5,Ye+13-Math.cos(mn)*7.5);
  sign(cx,Ye+32,72,13,SIGN.station[li()],'#2F5FD0','#FFFFFF');
  [x+14,x+44,x+w-66,x+w-36].forEach(wx=>{rr(wx-1.5,Ye+20,25,28,[11,11,1,1],'#FFFFFF');rr(wx,Ye+21.5,22,25,[10,10,1,1],'#8ED2F4');LIT.push(wx,Ye+22,22,24);});
  rr(cx-12,base-22,24,22,[10,10,0,0],'#8E5B3A');
  hit('station',x-6,Yr-6,x+w+6,base+30);
});
S(1236,[310,1190,592,1238],()=>{
  rr(312,1210,276,24,3,'#D9D3C7');rr(312,1230,276,3,1,'#FFD23F');
  [330,450,570].forEach(px=>rr(px-1.5,1196,3,28,1,'#5A6074'));rr(318,1190,264,8,3,'#4F78B0');rr(318,1196,264,3,1,'#3A5F95');
  [[380,1226,0],[520,1226,2]].forEach(([px,py,k])=>{if(!(TRAIN.dwell&&TRAIN.leg===1&&TRAIN.t>0.8))kid(px,py,['#B78CFF','#FF8A3D','#3CC8F5'][k],SKIN[k],HAIR[k],1.15);});
});
/* power station, chimney, solar panels, wind turbines */
S(1390,[20,1270,190,1392],()=>{
  const x=30,y=1340,w=150,d=50,h=66,Fy=flatB(x,y,w,d,h,'#D98A4E','#A9B0BE','#B86A35'),base=y+d;
  rr(x+w/2-16,Fy+14,32,32,8,'#FFFFFF');poly('#FFC928',x+w/2+3,Fy+17,x+w/2-9,Fy+32,x+w/2-1,Fy+32,x+w/2-4,Fy+43,x+w/2+9,Fy+27,x+w/2+1,Fy+27);
  win(x+12,Fy+16,22,16);win(x+w-34,Fy+16,22,16);rr(x+12,base-18,22,18,[3,3,0,0],'#6E4A33');
  rr(x+w-36,base-24,26,24,2,'#7E889C');for(let k=0;k<4;k++)rr(x+w-34,base-22+k*5,22,2,1,'#5A6074');
  hit('power',x-4,y-h,x+w+4,base);
});
S(1394,[192,1230,222,1396],()=>{
  const x=207,b=1394,top=1250;poly('#E9ECF2',x-11,b,x+11,b,x+7,top,x-7,top);
  for(let k=0;k<4;k++){const y0=top+k*36,y1=y0+16,w0=7+4*(y0-top)/(b-top),w1=7+4*(y1-top)/(b-top);poly('#E8443A',x-w0,y0,x+w0,y0,x+w1,y1,x-w1,y1);}
  rr(x-9,top-4,18,6,2,'#9AA4B8');
  hit('power',x-12,top-6,x+12,b);
});
S(1560,[24,1430,236,1566],()=>{
  for(let r=0;r<3;r++)for(let c=0;c<4;c++){const x=30+c*50,y=1450+r*38;
    rr(x+18,y+20,3,12,1,'#7E889C');poly('#2F5FA8',x,y+22,x+44,y+22,x+38,y,x+6,y);
    g.strokeStyle='rgba(180,210,255,.55)';g.lineWidth=0.8;g.beginPath();g.moveTo(x+22,y);g.lineTo(x+22,y+22);g.moveTo(x+3,y+11);g.lineTo(x+41,y+11);g.stroke();
    poly('rgba(255,255,255,.25)',x+8,y+2,x+16,y+2,x+12,y+10,x+5,y+10);}
  hit('power',24,1440,236,1566);
});
[[300,1520,1],[400,1585,1.15],[455,1440,0.9]].forEach(([x,y,s],i)=>S(y,[x-55*s,y-180*s,x+55*s,y+5],()=>{
  const tt=fx('turbine'),H=120*s,hy=y-H,rot=SPIN.turbine+i*1.3;
  ell(x+3,y+1,8*s,3*s,'rgba(0,0,0,.15)');poly('#F4F6FA',x-4*s,y,x+4*s,y,x+2*s,hy,x-2*s,hy);poly('#D8DDE6',x+1*s,y,x+4*s,y,x+2*s,hy,x+0.6*s,hy);
  for(let k=0;k<3;k++){const a=rot+k*TAU/3;g.save();g.translate(x,hy);g.rotate(a);poly('#FFFFFF',-2.6*s,0,2.6*s,0,1.4*s,-46*s,-0.4*s,-48*s);poly('#D8DDE6',0.4*s,0,2.6*s,0,1.4*s,-46*s);g.restore();}
  circ(x,hy,4*s,'#E9ECF2');circ(x,hy,1.6*s,'#9AA4B8');
  hit('turbine',x-50*s,hy-50*s,x+50*s,y);
}));
/* harbour: pier, lighthouse island */
S(1442,[566,1310,610,1444],()=>{
  rr(574,1316,30,124,2,'#B98B5E');g.strokeStyle='#9A6E45';g.lineWidth=1;g.beginPath();for(let y=1322;y<1440;y+=8){g.moveTo(574,y);g.lineTo(604,y);}g.stroke();
  [1330,1380,1430].forEach(y=>{rr(570,y,5,12,1,'#7A5233');rr(603,y,5,12,1,'#7A5233');});
  ell(589,1436,9,3,'rgba(0,0,0,.2)');rr(582,1424,14,6,3,'#E8443A');
  hit('harbour',560,1300,612,1446);
});
S(1412,[1050,1270,1160,1420],()=>{
  const x=1105,y=1405,lt=fx('lighthouse');
  ell(x,y+4,44,14,'#8E96A8');ell(x-4,y,38,12,'#A8B0C0');ell(x-10,y-3,16,6,'#BFC6D3');
  for(let k=0;k<5;k++){const y0=y-k*20,y1=y0-20,w0=13-k*1.3,w1=13-(k+1)*1.3;poly(k%2?'#FFFFFF':'#E8443A',x-w0,y0,x+w0,y0,x+w1,y1,x-w1,y1);}
  rr(x-10,y-106,20,5,2,'#3A3F52');rr(x-7,y-120,14,14,3,'#FFF3B0');poly('#E8443A',x-9,y-120,x+9,y-120,x,y-132);
  const a=T*(lt<6?3:1.2),br=lt<6?0.9:0.35+0.5*NIGHT;
  g.save();g.globalAlpha=br*Math.max(0,Math.cos(a))*0.6;g.fillStyle='#FFF7C2';g.beginPath();g.moveTo(x,y-113);
  const dir=Math.sin(a)>0?1:-1;g.lineTo(x+dir*170,y-140);g.lineTo(x+dir*170,y-86);g.closePath();g.fill();g.restore();
  LIGHTS.push(x,y-113,28,'#FFF3B0');
  hit('lighthouse',x-20,y-134,x+20,y+8);
});
/* bridges: front railings sit in front of the traffic */
S(829,[752,820,888,840],()=>{rr(756,824,128,5,2,'#FFFFFF');for(let px=760;px<=880;px+=12)rr(px,820,3,10,1,'#FFFFFF');hit('bridge',752,768,888,836);});
S(1271,[760,1262,880,1278],()=>{rr(762,1266,116,6,2,'#C0473A');g.strokeStyle='#C0473A';g.lineWidth=1.6;g.beginPath();
  for(let px=764;px<876;px+=14){g.moveTo(px,1266);g.lineTo(px+7,1272);g.lineTo(px+14,1266);}g.stroke();});
/* mountain with cave and sleeping bear */
S(286,[870,-20,1240,300],()=>{
  const M=[[1000,48,880,1130],[1130,6,1000,1270]];
  M.forEach(([px,py,l,r],k)=>{const c=k?'#8C98B0':'#9AA6BD';poly(c,l,286,px,py,r,286);poly(shade(c,0.18),l,286,px,py,px-6,286);
    poly('#FFFFFF',px-(px-l)*0.24,py+(286-py)*0.24,px,py,px+(r-px)*0.24,py+(286-py)*0.24,px+(r-px)*0.12,py+(286-py)*0.2,px,py+(286-py)*0.26,px-(px-l)*0.12,py+(286-py)*0.19);});
  ell(960,250,16,7,'#7E8AA2');ell(1180,230,20,8,'#7A869E');
  const cx=1065,cy=286;g.fillStyle='#2C2533';g.beginPath();g.moveTo(cx-36,cy);g.lineTo(cx-36,cy-22);g.ellipse(cx,cy-22,36,30,0,Math.PI,TAU);g.lineTo(cx+36,cy);g.closePath();g.fill();
  g.save();g.clip();ell(cx,cy-6,32,14,'#3A3142');drawBear(cx,cy-2);g.restore();
  ell(cx-40,cy,12,6,'#7E8AA2');ell(cx+42,cy,14,6,'#7E8AA2');
  hit('mountain',880,10,1240,250);hit('cave',cx-38,cy-54,cx+38,cy);
});
function drawBear(x,y){
  const t=fx('bear'),awake=t<6;
  if(!awake){g.save();g.translate(x,y);const br=Math.sin(T*1.6)*0.8;
    ell(0,-10,24,12+br,'#8A5A3C');circ(18,-10,10,'#8A5A3C');circ(13,-19,4,'#8A5A3C');circ(23,-19,4,'#8A5A3C');ell(25,-7,5,4,'#C89A72');circ(29,-8,1.8,'#2B1B12');
    ln('#2B1B12',1,15,-11,18,-11);ln('#2B1B12',1,21,-11,24,-11);rr(4,-4,12,5,2.5,'#7A4E33');g.restore();
    if(Math.random()<0.012)textP(x+24,y-30,'z','#FFFFFF',10+rnd(0,6));
    hit('bear',x-26,y-28,x+30,y,{small:1});return;}
  const up=Math.min(1,t/0.6),yawn=t>0.7&&t<2.6?Math.sin((t-0.7)/1.9*Math.PI):0;
  g.save();g.translate(x,y);g.scale(0.9+up*0.1,0.9+up*0.1);
  ell(0,-20,20,22*up+8,'#8A5A3C');ell(0,-16,12,13*up+5,'#B07A55');
  const hy=-44*up-14*(1-up);circ(0,hy,14,'#8A5A3C');circ(-11,hy-11,5.5,'#8A5A3C');circ(11,hy-11,5.5,'#8A5A3C');circ(-11,hy-11,2.6,'#C89A72');circ(11,hy-11,2.6,'#C89A72');
  ell(0,hy+5,7,5.5,'#C89A72');circ(0,hy+2,2.4,'#2B1B12');
  if(yawn>0.1){ell(0,hy+8,4,4*yawn+1,'#5A2A2A');ln('#2B1B12',1.2,-7,hy-3,-3,hy-3);ln('#2B1B12',1.2,3,hy-3,7,hy-3);}
  else{circ(-5,hy-3,1.8,'#2B1B12');circ(5,hy-3,1.8,'#2B1B12');circ(-4.4,hy-3.6,0.6,'#FFF');circ(5.6,hy-3.6,0.6,'#FFF');}
  const wave=t>2.6&&t<5?Math.sin(t*8)*0.5:0;g.save();g.translate(14,-26);g.rotate(-0.6+wave-yawn*0.8);rr(-4,-16,8,18,4,'#8A5A3C');g.restore();
  rr(-18,-30,8,16,4,'#8A5A3C');
  g.restore();hit('bear',x-24,y-62,x+24,y,{small:1});}
/* forest animals and their hiding places */
S(540,[935,490,1000,545],()=>{
  const x=965,y=538,t=fx('fox'),out=t<6;
  if(!out){const w=Math.sin(T*3)*0.35;g.save();g.translate(x+20,y-9);g.rotate(-0.3+w);ell(10,0,13,5.5,'#F08A2C');ell(20,0,4,3.6,'#FFFFFF');g.restore();}
  else{const fxp=x+34,j=Math.max(0,Math.sin(Math.min(t,0.5)/0.5*Math.PI))*14;g.save();g.translate(fxp,y-j);
    const w=Math.sin(T*4)*0.3;g.save();g.translate(-6,-4);g.rotate(0.5+w);ell(0,-9,5,12,'#F08A2C');ell(0,-19,3.4,4,'#FFFFFF');g.restore();
    ell(0,-9,8,10,'#F08A2C');ell(0,-7,4.5,6,'#FFF2E2');circ(0,-23,8,'#F08A2C');poly('#F08A2C',-7,-27,-5,-37,-1,-29);poly('#F08A2C',7,-27,5,-37,1,-29);
    poly('#3A2A2A',-6,-33,-5,-37,-3.8,-33);poly('#3A2A2A',6,-33,5,-37,3.8,-33);
    poly('#FFF2E2',-7,-21,0,-15,7,-21,0,-19);circ(0,-16,1.8,'#2B1B12');circ(-3.4,-24,1.4,'#2B1B12');circ(3.4,-24,1.4,'#2B1B12');
    rr(-6,-2,4,3,1.5,'#3A2A2A');rr(2,-2,4,3,1.5,'#3A2A2A');g.restore();hit('fox',fxp-12,y-42,fxp+12,y,{small:1});}
  ell(x+4,y+1,26,6,'rgba(20,70,20,.22)');circ(x-12,y-12,13,'#3F9A45');circ(x+12,y-12,13,'#3F9A45');circ(x,y-20,15,'#4CAF50');circ(x-5,y-25,6,'#6CC46A');
  [[x-10,y-16],[x+8,y-22],[x+14,y-8]].forEach(([bx,by])=>circ(bx,by,2.2,'#E8443A'));
  if(!out)hit('fox',x-24,y-34,x+38,y,{small:1});
});
S(440,[1110,350,1195,445],()=>{
  const x=1150,y=440,s=1.45,t=fx('owl');tree(x,y,s,0,'#4E9E48');
  const hx=x,hy=y-30*s;ell(hx,hy,8,10,'#3A2A20');
  if(t>=5){const bl=(T%4)<0.15;if(!bl){circ(hx-3,hy-1,2.6,'#FFE14D');circ(hx+3,hy-1,2.6,'#FFE14D');circ(hx-3,hy-1,1.2,'#222');circ(hx+3,hy-1,1.2,'#222');}
    hit('owl',hx-10,hy-12,hx+10,hy+12,{small:1});}
  else{const ox=hx,oy=y-50*s,fl=t<1.5?Math.sin(t*20)*0.6:0;g.save();g.translate(ox,oy);
    g.save();g.translate(-8,-8);g.rotate(-0.3-fl);ell(0,0,4,9,'#7A5235');g.restore();g.save();g.translate(8,-8);g.rotate(0.3+fl);ell(0,0,4,9,'#7A5235');g.restore();
    ell(0,-8,9,12,'#9A6A45');ell(0,-5,6,8,'#E8D2B0');poly('#9A6A45',-8,-17,-6,-24,-3,-18);poly('#9A6A45',8,-17,6,-24,3,-18);
    circ(-3.8,-13,3.6,'#FFFFFF');circ(3.8,-13,3.6,'#FFFFFF');circ(-3.8,-13,1.8,'#222');circ(3.8,-13,1.8,'#222');poly('#F2A33A',-1.5,-10,1.5,-10,0,-6.5);
    ln('#F2A33A',1,-3,4,-3,6);ln('#F2A33A',1,3,4,3,6);g.restore();hit('owl',ox-12,oy-26,ox+12,oy+6,{small:1});}
});
S(380,[900,310,965,385],()=>{
  const x=930,y=380,s=1.15;tree(x,y,s,0,'#5CBF52');
  const t=fx('squirrel'),u=t<3?Math.sin(t/3*Math.PI):0,sx=x+6,sy=y-6-u*26;
  g.save();g.translate(sx,sy);const w=Math.sin(T*5)*0.2;
  g.save();g.translate(4,-2);g.rotate(w);ell(4,-6,4.5,8,'#C8642A');ell(5,-11,3,4,'#D9783A');g.restore();
  ell(0,-4,4,5.5,'#C8642A');circ(-1,-10,3.6,'#C8642A');poly('#C8642A',-3,-12,-2.2,-16,-0.6,-13);circ(-2.4,-10.5,0.8,'#222');ell(-1.4,-6,2,2.6,'#F2D3B0');
  if(t<3)circ(-4,-6,1.8,'#8A5A3B');g.restore();
  hit('squirrel',sx-8,sy-18,sx+12,sy+1,{small:1});
});
S(665,[995,610,1075,670],()=>{
  const x=1035,y=665,t=fx('deer'),j=t<1.2?Math.sin(t/1.2*Math.PI)*22:0,graze=t>=1.2&&Math.sin(T*0.7)>0.4?1:0;
  ell(x,y+1,16,4,'rgba(20,70,20,.2)');g.save();g.translate(x,y-j);
  [[-9,0],[-5,1],[6,0],[10,1]].forEach(([lx,o])=>rr(lx-1.2,-14+o,2.6,14-o,1,'#9A6440'));
  ell(0,-18,14,7,'#B5774A');ell(-13,-19,3,2.5,'#FFFFFF');[[-4,-20],[2,-21],[6,-18],[-1,-17]].forEach(([sx,sy])=>circ(sx,sy,1,'#F6E7D2'));
  g.save();g.translate(11,-22);g.rotate(graze?1.0:0);rr(-2,-12,6,14,3,'#B5774A');ell(3,-14,6,4,'#B5774A');circ(8,-14,1.4,'#2B1B12');circ(4,-15.5,1,'#2B1B12');
  ell(0,-18,2,4,'#B5774A',-0.4);ln('#8A5A3B',1.2,2,-17,0,-24,-2,-27);ln('#8A5A3B',1.2,0,-24,3,-27);g.restore();
  g.restore();hit('deer',x-18,y-44-j,x+20,y,{small:1});
});
S(722,[1090,700,1140,726],()=>{
  const x=1115,y=722,t=fx('hedgehog'),out=t<6;
  if(out){const wx=x+Math.min(t,2)*6-Math.max(0,t-4)*6;g.save();g.translate(wx,y);
    ell(0,-5,10,6.5,'#7A5A44');for(let k=0;k<9;k++){const a=Math.PI+k/8*Math.PI;poly('#5A3E2C',Math.cos(a)*8,-5+Math.sin(a)*5,Math.cos(a+0.2)*13,-5+Math.sin(a+0.2)*10,Math.cos(a+0.35)*8,-5+Math.sin(a+0.35)*5);}
    ell(8,-3,5,3.5,'#E8C9A0');circ(12.5,-3.5,1.3,'#222');circ(8.5,-5,0.9,'#222');g.restore();}
  const LC=['#E2803A','#C8502A','#F2B23A','#A8642A'];for(let k=0;k<9;k++)ell(x-12+(k%5)*6-(out?(k-4)*3:0),y-3-(k>4?4:0)-(out?6:0)*(k%2),5,2.6,LC[k%4],k);
  if(!out)for(let k=0;k<4;k++)poly('#5A3E2C',x-6+k*4,y-6,x-4+k*4,y-11,x-2+k*4,y-6);
  hit('hedgehog',x-16,y-14,x+20,y+2,{small:1});
});
/* farm */
S(926,[886,800,1050,928],()=>{
  const x=898,y=880,w=112,d=46,h=58,{Ye,Yr}=gableB(x,y,w,d,h,'#D9473B','#6F4A3A'),base=y+d,cx=x+w/2,bt=fx('farm');
  g.strokeStyle='rgba(0,0,0,.1)';g.lineWidth=1;g.beginPath();for(let px=x+6;px<x+w;px+=8){g.moveTo(px,Ye+6);g.lineTo(px,base);}g.stroke();
  rr(cx-10,Ye+6,20,12,2,'#FFFFFF');rr(cx-8,Ye+8,16,8,1,'#5A3A2E');
  const op=bt<4?sm(bt*2):0;rr(cx-20,base-32,40,32,1,'#3A2A2A');
  [[-1,cx-20],[1,cx]].forEach(([s2,dx])=>{const ww=20*(1-op*0.8),xx=s2<0?dx:dx+20-ww;rr(xx,base-32,ww,32,1,'#FFFFFF');rr(xx+2,base-30,ww-4,28,1,'#C8392D');
    ln('#FFFFFF',2,xx+2,base-30,xx+ww-2,base-2);ln('#FFFFFF',2,xx+ww-2,base-30,xx+2,base-2);});
  // rooster on the roof ridge
  const rx=x+18,ry=Yr-4,cr=bt<2?1:0;g.save();g.translate(rx,ry);ell(0,-5,5,4,'#FFFFFF');circ(4,-10-cr*2,3,'#FFFFFF');poly('#E8443A',3,-13-cr*2,5,-16-cr*2,6,-12-cr*2);
  poly('#F2A33A',7,-10-cr*2,10,-9-cr*2+cr*2,7,-8-cr*2);poly('#3A6FD8',-4,-6,-10,-12,-8,-3);ln('#F2A33A',1,0,-1,0,1);g.restore();
  // silo
  rr(1016,846,30,80,[15,15,3,3],'#C9CFD9');rr(1016,846,10,80,[15,0,0,3],'#DDE2EA');for(let k=0;k<4;k++)rr(1016,862+k*16,30,2,0,'#A9B0BE');
  hit('farm',x-6,Yr-8,1048,base);
});
const FIELD_ROWS=[856,878,900,922,944,966,988];
S(1004,[1046,838,1196,1004],()=>{});
const TRAC={row:0,x:1060,dir:1};
const RABBIT=[1092,955];
S(970,[1070,920,1115,972],()=>{
  const [x,y]=RABBIT,t=fx('rabbit');let j=0,dx=0;if(t<3){const k=Math.floor(t/0.6),u=(t%0.6)/0.6;j=Math.sin(u*Math.PI)*14;dx=k%2?8-u*16:-8+u*16;}
  g.save();g.translate(x+dx,y-j);
  if(t<3){ell(0,-6,8,6,'#D9CFC4');circ(7,-11,5,'#D9CFC4');ell(5,-20,2,6,'#D9CFC4',-0.2);ell(9,-20,2,6,'#D9CFC4',0.2);ell(5,-20,0.9,4,'#FFB6C1',-0.2);
    circ(9,-11,1.2,'#222');circ(11.6,-10,0.9,'#E37B8B');circ(-7,-6,3,'#FFFFFF');}
  else{const tw=Math.sin(T*3)>0.7?0.25:0;ell(-2,-12,2,7,'#D9CFC4',-0.2+tw);ell(3,-12,2,7,'#D9CFC4',0.2-tw);ell(-2,-12,0.9,4.5,'#FFB6C1',-0.2+tw);ell(3,-12,0.9,4.5,'#FFB6C1',0.2-tw);}
  g.restore();
  for(let k=-1;k<=1;k++){const cx=x+k*12;[[-3,0],[0,-3],[3,0]].forEach(([ox,oy])=>ell(cx+ox,y+2+oy,3,5,'#5DB04A'));}
  hit('rabbit',x-14,y-28,x+16,y+4,{small:1});
});
const FARM=[{k:'cow',x:950,y:1110,f:1},{k:'cow',x:1110,y:1172,f:-1},{k:'sheep',x:1028,y:1196,f:1},{k:'sheep',x:1160,y:1086,f:-1},{k:'pig',x:950,y:1196,f:1}];
FARM.forEach((a,i)=>S(a.y,[a.x-26,a.y-34,a.x+26,a.y+4],()=>{
  const t=fx(a.k),hop=t<0.6?Math.sin(t/0.6*Math.PI)*6:0,graze=t>1.5&&Math.sin(T*0.5+i*2)>0;
  g.save();g.translate(a.x,a.y-hop);g.scale(a.f,1);
  if(a.k==='cow'){ell(0,1,20,4,'rgba(0,0,0,.15)');[-13,-7,8,13].forEach(lx=>rr(lx-2,-10,4,10,1.5,'#4A4A4A'));
    ell(0,-16,18,10,'#FFFFFF');ell(-6,-19,6,4,'#2E2E2E');ell(7,-13,5,3.5,'#2E2E2E');ell(-12,-11,3,2.5,'#2E2E2E');
    const sw=Math.sin(T*2+i)*3;ln('#FFFFFF',1.6,-17,-18,-21,-8+sw);circ(-21,-7+sw,1.8,'#2E2E2E');ell(0,-7,4,2.5,'#F6B7B7');
    g.save();g.translate(17,graze?-12:-21);ell(3,0,7.5,7,'#FFFFFF');ell(7,3,5,4,'#F6B7B7');circ(6,3,0.8,'#7A4A4A');circ(8.5,3,0.8,'#7A4A4A');circ(2.5,-2,1.4,'#222');
    ell(-3,-5,4,2,'#FFFFFF',-0.5);poly('#E8D8A8',0,-6,1,-11,2.5,-6);g.restore();}
  else if(a.k==='sheep'){ell(0,1,15,3.5,'rgba(0,0,0,.15)');[-8,-4,4,8].forEach(lx=>rr(lx-1.2,-8,2.4,8,1,'#3A3A3A'));
    [[-8,-13],[-2,-16],[5,-15],[9,-12],[0,-10],[-6,-9],[6,-9]].forEach(([cx,cy])=>circ(cx,cy,5.5,'#FFFFFF'));
    g.save();g.translate(12,graze?-8:-14);ell(2,0,4.5,5.5,'#3A3A3A');ell(-1,-3,3,1.6,'#3A3A3A',-0.5);circ(3.5,-1,1,'#FFFFFF');g.restore();}
  else{ell(0,1,15,3.5,'rgba(0,0,0,.15)');ell(-6,2,18,5,'#8A6A4A');[-8,-4,4,8].forEach(lx=>rr(lx-1.5,-7,3,7,1,'#F2A0A8'));
    ell(0,-11,13,8,'#F6B0B8');ln('#F6B0B8',1.4,-13,-12,-16,-14,-14,-16);
    g.save();g.translate(12,graze?-7:-12);circ(0,0,6,'#F6B0B8');ell(5,1,3,2.6,'#F28E9A');circ(4.5,1,0.6,'#8A4A4A');circ(6,1,0.6,'#8A4A4A');circ(1,-2,1,'#222');
    poly('#F28E9A',-3,-4,-1,-8,1,-5);g.restore();}
  g.restore();hit(a.k,a.x-20,a.y-30,a.x+20,a.y+2,{small:1});
}));
S(1214,[1140,1196,1182,1216],()=>{rr(1146,1196,32,18,6,'#E8C25A');ln('#C9A040',1,1150,1200,1174,1200);ln('#C9A040',1,1150,1208,1174,1208);});
S(1231,[886,1220,1200,1236],()=>{for(let px=890;px<=1196;px+=24)rr(px,1214,4,18,1,'#B07A4E');rr(888,1218,310,3,1,'#C48A5A');rr(888,1226,310,3,1,'#C48A5A');});
/* street lamps */
const LAMPS=[[205,850],[470,850],[700,850],[930,830],[1140,830],[300,428],[700,428],[200,330],[470,352],[300,770],[200,1120],[570,1185],[1000,830]];
LAMPS.forEach(([x,y])=>S(y,[x-8,y-44,x+8,y+2],()=>{ell(x+2,y+1,5,2,'rgba(0,0,0,.18)');rr(x-1.5,y-38,3,38,1,'#4F5568');rr(x-5,y-44,10,8,[5,5,2,2],'#4F5568');
  circ(x,y-38,3.2,NIGHT>0.3?'#FFF3B0':'#E9ECF2');LIGHTS.push(x,y-36,46,'#FFE9A0');}));

/* =============================================================
   VEHICLES
============================================================= */
const VKIND={car:{k:'car',L:34,H:16,W:20},bus:{k:'bus',L:62,H:26,W:24,col:'#FFC43D'},
  firetruck:{k:'firetruck',L:58,H:25,W:26,col:'#E8443A'},police:{k:'police',L:36,H:17,W:21,col:'#FFFFFF'},
  ambulance:{k:'ambulance',L:42,H:22,W:23,col:'#FFFFFF'}};
const ENT_OF={car:'car',bus:'bus',firetruck:'firetruck',police:'policecar',ambulance:'ambulance'};
function wheel(x,y,r,spin){circ(x,y,r,'#2B2D3A');circ(x,y,r*0.45,'#C9CED8');ln('#8C93A3',0.8,x,y,x+Math.cos(spin)*r*0.45,y+Math.sin(spin)*r*0.45);}
function vehicle(x,y,dir,o,col,flash,spin){
  col=col||o.col;spin=spin||0;const L=o.L,H=o.H;
  g.save();g.translate(x,y);
  if(dir==='E'||dir==='W'){if(dir==='W')g.scale(-1,1);
    ell(0,1,L*0.55,4,'rgba(0,0,0,.2)');
    if(o.k==='bus'){rr(-L/2,-H,L,H*0.86,6,col);for(let i=0;i<5;i++)rr(-L/2+5+i*10.5,-H+4,8,8,2,'#BFE6FA');rr(L/2-9,-H+4,6,13,2,'#BFE6FA');rr(-L/2,-H*0.4,L,2.5,1,shade(col,-0.25));}
    else if(o.k==='firetruck'){rr(-L/2,-H*0.82,L*0.66,H*0.7,3,col);rr(L*0.16,-H,L*0.34,H*0.88,[3,7,3,3],col);rr(L*0.24,-H+3,L*0.2,H*0.36,2,'#BFE6FA');
      ln('#C9CED8',2,-L/2+2,-H*0.9,L*0.14,-H*0.9);for(let k=0;k<6;k++)ln('#C9CED8',1.2,-L/2+5+k*6,-H*0.95,-L/2+5+k*6,-H*0.85);
      rr(-L/2+3,-H*0.55,L*0.5,3,1,'#FFFFFF');}
    else if(o.k==='ambulance'){rr(-L/2,-H,L*0.66,H*0.88,4,col);rr(L*0.16,-H*0.72,L*0.34,H*0.6,[3,8,3,3],col);rr(L*0.24,-H*0.66,L*0.18,H*0.26,2,'#BFE6FA');
      rr(-L/2,-H*0.45,L,3,1,'#E8443A');rr(-L*0.25,-H*0.88,4,11,1,'#E8443A');rr(-L*0.25-3.5,-H*0.88+3.5,11,4,1,'#E8443A');}
    else{rr(-L/2,-H*0.62,L,H*0.5,[5,7,4,4],col);rr(-L*0.28,-H,L*0.52,H*0.45,[6,6,0,0],col);rr(-L*0.22,-H*0.92,L*0.18,H*0.32,2,'#BFE6FA');rr(L*0.0,-H*0.92,L*0.18,H*0.32,2,'#BFE6FA');
      if(o.k==='police'){rr(-L/2,-H*0.42,L,4,1,'#2F5FD0');}}
    if(flash!==undefined){const on=Math.sin(T*18)>0;rr(-4,-H-4,4,4,1,on?'#FF3B30':'#7A2A2A');rr(0,-H-4,4,4,1,on?'#5B2A2A':'#3B7BFF');}
    rr(L/2-3,-H*0.5,3,3,1,'#FFE680');rr(-L/2,-H*0.5,2.5,3,1,'#FF6B5E');
    wheel(-L*0.3,-H*0.13,H*0.2,spin);wheel(L*0.3,-H*0.13,H*0.2,spin);
  } else {const Wd=o.W,big=o.k!=='car'&&o.k!=='police';
    ell(0,1,Wd*0.7,4,'rgba(0,0,0,.2)');rr(-Wd/2-1,-5,4,6,1,'#2B2D3A');rr(Wd/2-3,-5,4,6,1,'#2B2D3A');
    if(big)rr(-Wd/2,-H,Wd,H*0.9,5,col);else{rr(-Wd/2,-H*0.62,Wd,H*0.52,4,col);rr(-Wd*0.38,-H,Wd*0.76,H*0.44,[5,5,0,0],col);}
    rr(-Wd*0.32,big?-H+3:-H*0.94,Wd*0.64,big?H*0.34:H*0.3,2,dir==='S'?'#BFE6FA':'#A9D8F2');
    if(o.k==='police')rr(-Wd/2,-H*0.42,Wd,3,1,'#2F5FD0');if(o.k==='ambulance')rr(-Wd/2,-H*0.42,Wd,3,1,'#E8443A');
    const lc=dir==='S'?'#FFE680':'#FF6B5E';circ(-Wd*0.32,-H*0.3,2.2,lc);circ(Wd*0.32,-H*0.3,2.2,lc);
    if(flash!==undefined){const on=Math.sin(T*18)>0;rr(-5,-H-4,5,4,1,on?'#FF3B30':'#7A2A2A');rr(0,-H-4,5,4,1,on?'#5B2A2A':'#3B7BFF');}}
  g.restore();
  if(flash!==undefined&&Math.sin(T*18)>0)LIGHTS.push(x,y-H,26,'#FF5A50');
}
function vehicleFront(x,y,o){vehicle(x,y,'S',o,o.col);}
const RN={a:[250,-40],b:[520,-40],c:[WX0-40,380],d:[250,380],e:[520,380],f:[740,380],h0:[WX0-40,800],h:[250,800],i:[520,800],j:[WX1+40,800],k:[250,1150],l:[600,1150]};
const RE=[['a','d'],['b','e'],['c','d'],['d','e'],['e','f'],['h0','h'],['h','i'],['i','j'],['d','h'],['e','i'],['h','k'],['k','l']];
const NB={};RE.forEach(([p,q])=>{(NB[p]=NB[p]||[]).push(q);(NB[q]=NB[q]||[]).push(p);});
const CARCOL=['#FF5A5F','#3CC8F5','#7ED957','#B78CFF','#FF8A3D','#2F5FD0'];
const VEH=[];
function addVeh(kind,a,b,t,o){const v=Object.assign({kind,a,b,t,v:kind==='car'?rnd(48,62):kind==='bus'?40:105,col:VKIND[kind].col||CARCOL[VEH.length%CARCOL.length],spin:0,age:0,life:Infinity},o);VEH.push(v);return v;}
[['h','i',0.2],['d','e',0.5],['i','e',0.3],['k','l',0.4],['j','i',0.6],['c','d',0.7]].forEach(([a,b,t],i)=>addVeh('car',a,b,t,{col:CARCOL[i]}));
addVeh('bus','e','d',0.1);
function stepVeh(dt){
  for(let n=VEH.length-1;n>=0;n--){const v=VEH[n];v.age+=dt;
    if(v.age>v.life+1.2){VEH.splice(n,1);continue;}
    const A=RN[v.a],B=RN[v.b],len=Math.hypot(B[0]-A[0],B[1]-A[1]);
    let sp=v.v;for(const o of VEH){if(o!==v&&o.a===v.a&&o.b===v.b&&o.t>v.t&&(o.t-v.t)*len<(VKIND[v.kind].L+VKIND[o.kind].L)/2+10){sp=0;break;}}
    v.t+=sp*dt/len;v.spin+=sp*dt/4;
    if(v.t>=1){const opts=NB[v.b].filter(q=>q!==v.a),next=opts.length?opts[Math.random()*opts.length|0]:v.a;v.a=v.b;v.b=next;v.t=0;}
  }}
function vehPos(v){const A=RN[v.a],B=RN[v.b],dx=B[0]-A[0],dy=B[1]-A[1],d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d;
  return {x:A[0]+dx*v.t-uy*11,y:A[1]+dy*v.t+ux*11,dir:Math.abs(ux)>Math.abs(uy)?(ux>0?'E':'W'):(uy>0?'S':'N')};}
function emergency(kind,a,b,x){const A=RN[a],B=RN[b],t=Math.abs(x-A[0])/Math.abs(B[0]-A[0]);addVeh(kind,a,b,t,{flash:1,life:16});}

/* train */
/* The train shuttles along the whole railway: west end → town station →
   Wild West station → east end and back. Tapping a station while the train
   waits there means "all aboard": the camera rides along to the next stop. */
const TLEN=74+3*68,STOP_TOWN=450,STOP_WEST=3550;
const LEGS=[{to:STOP_WEST,dw:8},{to:STOP_TOWN,dw:8}];
const TRAIN={c:STOP_TOWN,dir:1,leg:1,from:STOP_TOWN,t:0,dur:1,dwell:true,ride:false};
function nextLeg(){const s=TRAIN;s.leg=(s.leg+1)%LEGS.length;s.from=s.c;const L=LEGS[s.leg];s.dir=L.to>s.c?1:-1;s.dur=Math.max(5,Math.abs(L.to-s.c)/210);s.t=0;s.dwell=false;SND.whistle();}
function stepTrain(dt){const s=TRAIN,L=LEGS[s.leg];s.t+=dt;
  if(s.dwell){if(s.t>L.dw)nextLeg();return;}
  if(s.t<0)return;
  const u=Math.min(1,s.t/s.dur),e=u<0.5?2*u*u:1-Math.pow(-2*u+2,2)/2;s.c=s.from+(L.to-s.from)*e;
  if(u>=1){s.dwell=true;s.t=0;if(s.ride){s.ride=false;K.onArrive&&K.onArrive(L.to);}}
  else if(Math.random()<dt*7)puff(s.c+s.dir*(TLEN/2-19),1205,{c:'#F4F4F6',r:5,vy:-18,max:1.8});}
const atStation=x=>TRAIN.dwell&&Math.abs(TRAIN.c-x)<5;
function rideTrain(x){             // tapped a station at x
  const s=TRAIN;
  if(atStation(x)){s.ride=true;say(['Alle einsteigen! Tschu-tschu!','All aboard! Choo choo!','¡Todos al tren! ¡Chu chu!'][li()]);s.t=LEGS[s.leg].dw;return true;}
  SND.whistle();return false;}
function drawTrainAny(){const s=TRAIN,x0=s.c+TLEN/2;
  if(s.dir>0){drawTrain(x0);return;}
  g.save();g.translate(2*s.c,0);g.scale(-1,1);drawTrain(x0);g.restore();}
function drawTrain(x0){const y=1262;if(x0<-5||x0-TLEN>WX1+20)return;
  const cols=['#3F8CE8','#FFB938','#3DBB7A'],sp=x0/7;
  for(let i=2;i>=0;i--){const re=x0-76-i*68,x=re-62,c=cols[i];
    ell(x+31,y,34,3,'rgba(0,0,0,.18)');rr(x,y-37,62,28,6,c);rr(x-1,y-40,64,6,3,shade(c,-0.22));
    for(let w=0;w<3;w++){rr(x+6+w*19,y-32,13,11,3,'#E9F6FF');if((w+i)%2===0)circ(x+12.5+w*19,y-25,3.4,SKIN[(w+i)%4]);LIT.push(x+6+w*19,y-32,13,11);}
    rr(x,y-13,62,4,1,shade(c,-0.3));wheel(x+12,y-5,5,sp);wheel(x+50,y-5,5,sp);rr(re,y-13,6,3,1,'#444');}
  const L=74,x=x0-L;ell(x+37,y,38,3,'rgba(0,0,0,.18)');
  rr(x,y-46,24,38,[4,4,0,0],'#2E5FB8');rr(x-3,y-49,30,6,3,'#22448A');rr(x+5,y-42,14,12,3,'#E9F6FF');circ(x+12,y-34,3.6,SKIN[0]);
  rr(x+21,y-36,L-27,25,[4,12,12,4],'#E2463A');rr(x+36,y-36,3,25,0,'#B8392A');rr(x+52,y-36,3,25,0,'#B8392A');
  rr(x0-24,y-52,10,18,2,'#2E2F3A');rr(x0-27,y-56,16,6,2,'#2E2F3A');circ(x+46,y-37,5,'#F2C24A');
  rr(x,y-13,L,5,1,'#2E2F3A');poly('#2E2F3A',x0-6,y-12,x0+5,y-2,x0-6,y-2);circ(x0-4,y-27,3,'#FFE680');LIGHTS.push(x0,y-27,40,'#FFE9A0');
  wheel(x+14,y-8,8,sp);wheel(x+36,y-8,8,sp);wheel(x+58,y-5,5,sp);
  ln('#B9BFCA',2,x+14+Math.cos(sp)*4,y-8+Math.sin(sp)*4,x+36+Math.cos(sp)*4,y-8+Math.sin(sp)*4);
  hit('train',x0-TLEN-2,y-58,x0+6,y,{moving:1,small:1});}

/* boats, ducks, frog, fish, tractor, chickens, helicopter, clouds, birds */
const TUG={t:-1},DOCK=[632,1452];
const tugPos=()=>{if(TUG.t<0)return {x:DOCK[0],y:DOCK[1],f:1};const u=TUG.t/14,a=Math.PI+u*TAU;return {x:752+Math.cos(a)*120,y:DOCK[1]+Math.sin(a)*-55,f:Math.sin(a)>0?1:-1};};
function drawTug(){const p=tugPos();g.save();g.translate(p.x,p.y);g.scale(p.f,1);
  ell(0,2,24,5,'rgba(255,255,255,.35)');poly('#E8443A',-22,-6,22,-6,16,3,-18,3);rr(-22,-9,44,4,2,'#2E2F3A');
  rr(-12,-22,18,13,3,'#FFFFFF');rr(-9,-19,5,5,1,'#8ED2F4');rr(-2,-19,5,5,1,'#8ED2F4');rr(8,-28,6,19,2,'#FFC928');rr(8,-30,6,3,1,'#2E2F3A');
  g.restore();if(TUG.t>=0&&Math.random()<0.06)puff(p.x+11*p.f,p.y-30,{c:'#E9ECF2',r:4});hit('ship',p.x-24,p.y-32,p.x+24,p.y+4,{moving:1,small:1});}
let boatA=0;
function drawBoat(){const x=905+Math.cos(boatA)*190,y=1505+Math.sin(boatA)*62,f=-Math.sin(boatA)>0?1:-1,rock=Math.sin(T*2)*0.05;
  g.save();g.translate(x,y);g.rotate(rock);g.scale(f,1);ell(0,2,22,4,'rgba(255,255,255,.35)');poly('#FFFFFF',-18,-4,18,-4,13,3,-14,3);rr(-18,-6,36,3,1,'#3F6FD8');
  ln('#7A5233',1.6,0,-6,0,-46);poly('#FFFFFF',1,-44,1,-8,20,-8);poly('#FF5A5F',-1,-40,-1,-10,-16,-10);poly('#FFC928',0,-46,8,-43,0,-40);g.restore();
  hit('boat',x-22,y-48,x+22,y+4,{moving:1,small:1});}
let duckU=0.3,duckD=1;
function drawDucks(){for(let k=3;k>=0;k--){const u=duckU-duckD*k*0.012,[x,y]=riverAt(u),s=k?0.6:1;const bob=Math.sin(T*3+k)*0.8;
  g.save();g.translate(x+(k%2?5:-3),y+bob);g.scale(duckD>0?1:-1,1);
  ell(0,1,10*s,3*s,'rgba(255,255,255,.35)');ell(0,-3*s,8*s,5*s,k?'#FFE45C':'#FFFFFF');circ(6*s,-8*s,4*s,k?'#FFE45C':'#2E8B57');poly('#F2A33A',9*s,-8*s,13*s,-7*s,9*s,-6*s);circ(7*s,-9*s,0.9*s,'#222');
  if(!k)ell(-2,-3,4,2.4,'#D9DDE6');g.restore();}
  const [x,y]=riverAt(duckU);hit('duck',x-14,y-14,x+14,y+6,{moving:1,small:1});}
const PADS=[[668,1478],[700,1500],[640,1505],[690,1530]];let FROG={p:0,from:0,t:9};
function drawPads(){PADS.forEach(([x,y],i)=>{ell(x,y,13,5,'#3E9A45');poly('#5BBDEE',x,y,x+13,y-2,x+13,y+2);if(i===2){circ(x-4,y-2,2.6,'#FF8FB1');circ(x-4,y-2,1.1,'#FFE14D');}});
  const u=Math.min(1,FROG.t/0.7),A=PADS[FROG.from],B=PADS[FROG.p],x=A[0]+(B[0]-A[0])*u,y=A[1]+(B[1]-A[1])*u-Math.sin(u*Math.PI)*22;
  g.save();g.translate(x,y-2);ell(0,-3,7,4.5,'#5DBB46');circ(-3.5,-7,2.8,'#5DBB46');circ(3.5,-7,2.8,'#5DBB46');circ(-3.5,-7.5,1.3,'#222');circ(3.5,-7.5,1.3,'#222');
  ln('#2E7A2E',0.8,-3,-2,3,-2);ell(-6,0,3,1.5,'#4CA83A');ell(6,0,3,1.5,'#4CA83A');g.restore();hit('frog',x-10,y-14,x+10,y+3,{moving:1,small:1});}
const FISH=[];
function fishJump(x,y){FISH.push({x,y,t:0,f:Math.random()<0.5?1:-1});SND.splash();}
function drawFish(){for(let i=FISH.length-1;i>=0;i--){const f=FISH[i];f.t+=1/60;const u=f.t/0.9;if(u>1){FISH.splice(i,1);continue;}
  const x=f.x+f.f*(u-0.5)*36,y=f.y-Math.sin(u*Math.PI)*26,a=Math.atan2(-Math.cos(u*Math.PI)*26*Math.PI,f.f*36);
  g.save();g.translate(x,y);g.rotate(a);g.scale(f.f,1);ell(0,0,8,4,'#FF8A3D');poly('#FF8A3D',-6,0,-12,-4,-12,4);circ(4,-1,1,'#222');g.restore();
  if(u<0.08||u>0.92)for(let k=0;k<2;k++)PARTS.push({x,y:f.y,vx:rnd(-20,20),vy:rnd(-50,-20),life:0,max:0.6,k:'drop',r:4,c:'#FFFFFF',gr:150});}}
function drawTractor(){const y=FIELD_ROWS[TRAC.row]+8,x=TRAC.x,sp=x/5;
  g.save();g.translate(x,y);g.scale(TRAC.dir,1);ell(0,1,18,3.5,'rgba(0,0,0,.18)');
  rr(-6,-17,22,10,3,'#3DAA4A');rr(-12,-26,12,15,[3,3,0,0],'#3DAA4A');rr(-10,-24,8,7,2,'#BFE6FA');rr(8,-22,2.5,7,1,'#555');
  wheel(-8,-8,8,sp);wheel(11,-5,5,sp);circ(-8,-8,3.4,'#F2C24A');circ(11,-5,2,'#F2C24A');g.restore();
  if(Math.random()<0.04)puff(x+9*TRAC.dir,y-30,{c:'#B9BFCA',r:2.5,max:1.2});hit('tractor',x-18,y-30,x+18,y+2,{moving:1,small:1});}
const CHICKS=[0,1,2].map(i=>({x:930+i*30,y:960+i*12,tx:950,ty:970,f:1}));
function drawChicks(){CHICKS.forEach((c,i)=>{const peck=Math.sin(T*6+i*2)>0.5?2:0,ct=fx('chicken'),j=ct<0.5?Math.sin(ct/0.5*Math.PI)*8:0;
  g.save();g.translate(c.x,c.y-j);g.scale(c.f,1);ell(0,1,7,2,'rgba(0,0,0,.15)');ln('#F2A33A',1,-1,-4,-1,0);ln('#F2A33A',1,2,-4,2,0);
  ell(0,-7,7,5,'#FFFFFF');poly('#FFFFFF',-7,-8,-11,-13,-5,-10);circ(5,-12+peck,3.6,'#FFFFFF');poly('#E8443A',4,-15+peck,6,-18+peck,7,-14.5+peck);
  poly('#F2A33A',8,-12+peck,11,-11+peck,8,-10+peck);circ(6,-12.5+peck,0.8,'#222');ell(6.5,-9.5+peck,1,1.6,'#E8443A');g.restore();
  hit('chicken',c.x-10,c.y-20,c.x+10,c.y+2,{moving:1,small:1});});}
const HELI={t:-1};
function heliPos(){if(HELI.t<0)return {x:650,y:172,alt:0,f:1};const t=HELI.t;
  if(t<1.5)return {x:650,y:172,alt:sm(t/1.5)*60,f:1};
  if(t<9.5){const a=(t-1.5)/8*TAU;return {x:560+Math.cos(a)*120+30*(1-Math.cos(a)),y:172+Math.sin(a)*70,alt:60,f:-Math.sin(a)>=0?1:-1};}
  return {x:650,y:172,alt:60*(1-sm((t-9.5)/1.5)),f:1};}
function drawHeli(){const p=heliPos(),y=p.y-p.alt,spin=HELI.t>=0?T*40:T*0.3;
  if(p.alt>2)ell(p.x,p.y+p.alt*0.9,14,4,'rgba(0,0,0,.15)');
  g.save();g.translate(p.x,y);g.scale(p.f,1);
  rr(-30,-12,22,4,2,'#E8443A');poly('#E8443A',-30,-12,-34,-22,-27,-12);ln('#555',1,-32,-16,-32,-8);
  ell(0,-10,14,9,'#E8443A');ell(6,-12,6.5,5,'#BFE6FA');rr(-3,-20,6,3,1,'#555');
  ln('#555',1.4,-10,0,10,0);ln('#555',1.2,-6,0,-6,-3);ln('#555',1.2,6,0,6,-3);
  const r=30*Math.abs(Math.cos(spin));ln('#3A3F52',2,-r,-21,r,-21);if(HELI.t>=0)ell(0,-21,30,2.2,'rgba(60,60,70,.25)');
  g.restore();hit('heli',p.x-26,y-24,p.x+20,y+2,{moving:1,small:1});}
const CLOUDS=[[4400,300,1.2],[5000,1300,1.1],[4700,2100,1.2],[-900,100,1.2],[-600,1200,1.1],[-1100,2000,1.3],[3100,200,1.2],[3600,1300,1.1],[3300,2100,1.3],[150,300,1.1],[700,700,1.3],[300,1250,1],[1000,1100,1.2],[1500,-500,1.4],[2300,100,1.2],[1800,900,1.1],[2500,1500,1.3],[600,2050,1.2],[1900,2200,1],[400,-300,1]].map(([x,y,s])=>({x,y,s}));
function drawClouds(){const z=CAM.k/kFit(),ca=Math.max(0,Math.min(0.8,(1.7-z)*1.4))*(1-NIGHT*0.7);if(ca<=0.01)return;
  for(const c of CLOUDS){g.globalAlpha=ca*0.5;ell(c.x+40*c.s,c.y+80*c.s,55*c.s,16*c.s,'rgba(30,70,40,.25)');
    g.globalAlpha=ca;[[0,0,24],[-26,6,17],[26,6,18],[-10,-12,17],[12,-10,19]].forEach(([dx,dy,r])=>circ(c.x+dx*c.s,c.y+dy*c.s,r*c.s,'#FFFFFF'));
    ell(c.x,c.y+14*c.s,44*c.s,7*c.s,'#E6EEF8');}g.globalAlpha=1;}

/* =============================================================
   GROUND
============================================================= */
function drawGround(){
  g.fillStyle='#93D46F';g.fillRect(WX0-400,WY0-400,WX1-WX0+800,WY1-WY0+800);
  for(const f of K.GROUND0)f();
  for(const p of PATCH)ell(p[0],p[1],p[2],p[3],p[4]);
  ell(1040,520,190,290,'#86C866');
  rr(4,6,214,342,18,'#A4DD82');rr(4,420,214,92,16,'#A4DD82');
  rr(282,412,206,356,22,'#F1E3C8');ell(385,642,92,40,'#E9D7B6');ell(385,642,78,32,'#F1E3C8');
  g.strokeStyle='rgba(180,150,110,.25)';g.lineWidth=1;g.beginPath();for(let x=292;x<488;x+=18){g.moveTo(x,416);g.lineTo(x,764);}g.stroke();
  rr(282,832,474,286,22,'#F7E7C6');
  for(let i=0;i<40;i++){const x=300+(i*97)%440,y=850+(i*61)%250;circ(x,y,2.2,BALC[i%5]);}
  rr(6,834,212,282,14,'#D7BC8E');ell(70,960,40,18,'#CDB080');ell(160,1070,30,12,'#CDB080');
  rr(1046,838,150,166,12,'#B98352');FIELD_ROWS.forEach(y=>{rr(1052,y-3,138,6,3,'#A5703F');for(let x=1058;x<1188;x+=10)ell(x,y-3,4,4.5,'#6CC04A');});
  rr(888,1028,310,202,14,'#A8E182');ell(955,1206,24,9,'#8A6A4A');
  rr(888,836,156,184,14,'#D9C49A');
  rr(14,1290,250,112,14,'#C9CED8');
  for(const [x,y,c] of FLOWERS)if(CAM.k>kFit()*1.4){circ(x,y,2.4,c);circ(x,y,0.9,'#FFE14D');}
  // water
  g.lineJoin='round';g.strokeStyle='#EAD9A2';g.lineWidth=18;g.stroke(LAKE);g.stroke(RIVER);
  g.fillStyle='#5BBDEE';g.fill(LAKE);g.fill(RIVER);
  g.save();g.clip(LAKE);ell(930,1530,270,130,'#4CB0E6');g.restore();
  g.setLineDash([12,30]);g.lineDashOffset=-T*26;g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=3;g.stroke(RIVC);g.setLineDash([]);
  for(const s of GLINT){g.globalAlpha=(0.5+0.5*Math.sin(T*1.5+s[2]))*0.7;ln('#FFFFFF',2,s[0]-7,s[1],s[0],s[1]-3,s[0]+7,s[1]);}g.globalAlpha=1;
  // roads
  g.lineCap='round';g.strokeStyle='#E4E6EE';g.lineWidth=58;g.stroke(ROADP);g.strokeStyle='#646B7F';g.lineWidth=44;g.stroke(ROADP);
  g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=2.5;g.setLineDash([14,14]);g.stroke(ROADP);g.setLineDash([]);g.lineCap='butt';
  for(let i=0;i<5;i++){rr(372,362+i*8,26,4.5,1,'#FFFFFF');rr(372,782+i*8,26,4.5,1,'#FFFFFF');rr(502+i*8,600,4.5,26,1,'#FFFFFF');rr(232+i*8,660,4.5,26,1,'#FFFFFF');}
  rr(752,772,136,4,2,'#FFFFFF');for(let px=760;px<=880;px+=12)rr(px,766,3,8,1,'#FFFFFF');
  rr(766,826,108,8,2,'rgba(0,40,80,.22)');
  // railway
  const RX=3790;              // the railway ends just past the Wild West stationrr(-40,1243,RX+40,24,0,'#BDB1A0');g.fillStyle='#7B5B45';for(let x=Math.max(-40,VIEW[0]-20);x<Math.min(RX,VIEW[2]+20);x+=13)g.fillRect(x,1245,5,20);
  ln('#8F96A3',3,-40,1249,RX,1249);ln('#8F96A3',3,-40,1261,RX,1261);ln('#DDE2EA',1,-40,1248,RX,1248);ln('#DDE2EA',1,-40,1260,RX,1260);
  for(const f of K.GROUND1)f();
  rr(762,1238,116,5,2,'#C0473A');
}

/* =============================================================
   CAMERA + TOUCH
============================================================= */
let VW=360,VH=600,CAM={x:0,y:0,k:0.3},camAnim=null;
const kFit=()=>Math.min(VW/CW,VH/CH),kMin=()=>Math.min(VW/(WX1-WX0),VH/(WY1-WY0));
function viewOf(x0,y0,x1,y1,pad){const k=Math.min(VW/(x1-x0),VH/(y1-y0))*(pad||0.92);return {x:(x0+x1)/2-VW/2/k,y:(y0+y1)/2-VH/2/k,k};}
const homeView=()=>viewOf(0,0,CW,CH,1),worldView=()=>viewOf(WX0,WY0,WX1,WY1,1);
function clampCam(c){c.k=Math.max(kMin()*0.95,Math.min(kFit()*7,c.k));const vw=VW/c.k,vh=VH/c.k,W=WX1-WX0,H=WY1-WY0;
  c.x=vw>=W?WX0+(W-vw)/2:Math.max(WX0-20,Math.min(WX1+20-vw,c.x));c.y=vh>=H?WY0+(H-vh)/2:Math.max(WY0-20,Math.min(WY1+20-vh,c.y));return c;}
function flyTo(v,ms){camAnim={from:{...CAM},to:clampCam({...v}),t0:performance.now(),d:ms||700};}
const toW=(sx,sy)=>[CAM.x+sx/CAM.k,CAM.y+sy/CAM.k];
function zoomAt(sx,sy,f){const [wx,wy]=toW(sx,sy);CAM.k*=f;CAM.x=wx-sx/CAM.k;CAM.y=wy-sy/CAM.k;clampCam(CAM);}
let firstFit=true;
function fit(){const r=cv.getBoundingClientRect();if(!r.width)return;const dpr=Math.min(window.devicePixelRatio||1,2);
  VW=r.width;VH=r.height;cv.width=Math.round(VW*dpr);cv.height=Math.round(VH*dpr);
  if(firstFit){Object.assign(CAM,homeView());firstFit=false;}clampCam(CAM);}
new ResizeObserver(fit).observe(cv);
const ptr=new Map();let gs=null,lastTap=0,lastXY=[0,0];
const pxy=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
cv.addEventListener('pointerdown',e=>{e.preventDefault();ac();try{cv.setPointerCapture(e.pointerId);}catch(_){}
  ptr.set(e.pointerId,pxy(e));camAnim=null;
  if(ptr.size===1)gs={t:performance.now(),p:pxy(e),moved:false,cam:{...CAM}};
  if(ptr.size===2){const [a,b]=[...ptr.values()];gs={pinch:true,d:Math.hypot(a[0]-b[0],a[1]-b[1]),mid:[(a[0]+b[0])/2,(a[1]+b[1])/2],cam:{...CAM},moved:true};}});
cv.addEventListener('pointermove',e=>{if(!ptr.has(e.pointerId)||!gs)return;e.preventDefault();ptr.set(e.pointerId,pxy(e));
  if(ptr.size>=2&&gs.pinch){const [a,b]=[...ptr.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]),mid=[(a[0]+b[0])/2,(a[1]+b[1])/2],C0=gs.cam;
    const wx=C0.x+gs.mid[0]/C0.k,wy=C0.y+gs.mid[1]/C0.k;CAM.k=C0.k*d/gs.d;CAM.x=wx-mid[0]/CAM.k;CAM.y=wy-mid[1]/CAM.k;clampCam(CAM);return;}
  if(ptr.size===1&&!gs.pinch){const p=pxy(e),dx=p[0]-gs.p[0],dy=p[1]-gs.p[1];if(Math.hypot(dx,dy)>8)gs.moved=true;
    if(gs.moved){TRAIN.ride=false;CAM.x=gs.cam.x-dx/CAM.k;CAM.y=gs.cam.y-dy/CAM.k;clampCam(CAM);}}});
const pend=e=>{if(!ptr.has(e.pointerId))return;const p=ptr.get(e.pointerId);ptr.delete(e.pointerId);
  if(gs&&gs.pinch){if(ptr.size===1){gs={t:0,p:[...ptr.values()][0],moved:true,cam:{...CAM}};}else if(!ptr.size)gs=null;return;}
  if(gs&&!gs.moved&&performance.now()-gs.t<600){const now=performance.now();
    if(now-lastTap<300&&Math.hypot(p[0]-lastXY[0],p[1]-lastXY[1])<30){lastTap=0;flyTo({k:CAM.k*2,x:CAM.x+p[0]/CAM.k-p[0]/(CAM.k*2),y:CAM.y+p[1]/CAM.k-p[1]/(CAM.k*2)},300);}
    else{lastTap=now;lastXY=p;tapAt(p[0],p[1]);}}
  if(!ptr.size)gs=null;};
['pointerup','pointercancel'].forEach(ev=>cv.addEventListener(ev,pend));
cv.addEventListener('wheel',e=>{e.preventDefault();const p=pxy(e);camAnim=null;zoomAt(p[0],p[1],e.deltaY<0?1.2:1/1.2);},{passive:false});
$('cZin').onclick=()=>{ac();camAnim=null;flyTo({k:CAM.k*1.6,x:CAM.x+VW/2/CAM.k-VW/2/(CAM.k*1.6),y:CAM.y+VH/2/CAM.k-VH/2/(CAM.k*1.6)},250);};
$('cZout').onclick=()=>{ac();camAnim=null;flyTo({k:CAM.k/1.6,x:CAM.x+VW/2/CAM.k-VW/2*1.6/CAM.k,y:CAM.y+VH/2/CAM.k-VH/2*1.6/CAM.k},250);};
$('cHome').onclick=()=>{ac();flyTo(CAM.k>kMin()*1.3?worldView():homeView(),900);};

/* =============================================================
   WHAT A TAP DOES
============================================================= */
const TAP={
  fire:()=>{if(fx('fire')<10)return;act('fire');SND.siren();later(1.1,()=>emergency('firetruck','j','i',632));},
  firetruck:()=>SND.siren(),policecar:()=>SND.wail(),ambulance:()=>SND.siren(),
  police:()=>{if(VEH.some(v=>v.kind==='police'))return;act('police');SND.wail();emergency('police','h0','h',170);},
  hospital:()=>{if(VEH.some(v=>v.kind==='ambulance'))return;act('hospital');SND.siren();emergency('ambulance','f','e',712);},
  heli:()=>{if(HELI.t<0){HELI.t=0;SND.chop();}},
  school:()=>{act('school');SND.bell();},playground:()=>{act('playground');SND.hop();},
  bakery:()=>{act('bakery');SND.ding();},fountain:()=>{act('fountain');SND.splash();burst(385,600,'drop',30,'#BFE9FF',1.2);},
  post:()=>{act('post');SND.ding();},
  house:(i)=>{act('house'+i);SND.ding();},
  ferris:()=>{act('ferris');SND.music();},carousel:()=>{act('carousel');SND.tune();},coaster:()=>{act('coaster');SND.whoosh();},
  balloon:()=>{for(let i=0;i<5;i++)if(fx('balloon'+i)>=9){act('balloon'+i);PARTS.push({x:515-14+i*7,y:1104-56-(i%2)*10,vx:rnd(-8,8),vy:-38,life:0,max:7,k:'balloon',r:9,c:BALC[i]});SND.pop();break;}},
  crane:()=>{act('crane');SND.motor();},digger:()=>{act('digger');SND.motor();},site:()=>{act('digger');act('crane');SND.motor();},
  station:()=>rideTrain(STOP_TOWN),train:()=>{SND.whistle();},rail:()=>{SND.whistle();},
  power:()=>{act('power');SND.zap();zapStart();},turbine:()=>{act('turbine');SND.whoosh();},
  harbour:()=>{if(TUG.t<0){TUG.t=0;SND.ship();}},ship:()=>{if(TUG.t<0)TUG.t=0;SND.ship();},boat:()=>{SND.whoosh();},
  lighthouse:()=>{act('lighthouse');SND.ship();},
  river:(r,x,y)=>fishJump(x,y),lake:(r,x,y)=>fishJump(x,y),
  tree:(r,x,y)=>{shakeTree(x,y);SND.whoosh();},
  forest:(r,x,y)=>{for(let i=0;i<5;i++)PARTS.push({x:x+rnd(-30,30),y:y-20,vx:rnd(-60,60),vy:rnd(-70,-40),life:0,max:2.5,k:'bird'});SND.cluck();},
  cave:()=>{act('bear');SND.yawn();},mountain:()=>{},meadow:(r,x,y)=>{burst(x,y,'star',6,'#FFE14D',0.5);blip();},
  farm:()=>{act('farm');SND.crow();},tractor:()=>SND.motor(),field:()=>{act('rabbit');SND.hop();},
  car:()=>SND.horn(),bus:()=>SND.horn(),road:()=>SND.horn(),
  bear:()=>{act('bear');SND.yawn();},fox:()=>{act('fox');SND.squeak();},owl:()=>{act('owl');SND.hoot();},deer:()=>{act('deer');SND.hop();},
  squirrel:()=>{act('squirrel');SND.squeak();},hedgehog:()=>{act('hedgehog');SND.squeak();
    for(let i=0;i<8;i++)PARTS.push({x:1115+rnd(-10,10),y:715,vx:rnd(-50,50),vy:rnd(-60,-20),life:0,max:1.3,k:'leaf',r:4,c:['#E2803A','#C8502A','#F2B23A'][i%3],gr:60});},
  rabbit:()=>{act('rabbit');SND.hop();},cat:()=>{act('cat');SND.meow();},frog:()=>{if(FROG.t>=0.7){FROG.from=FROG.p;FROG.p=(FROG.p+1+(Math.random()*3|0))%PADS.length;FROG.t=0;}SND.ribbit();},
  duck:()=>SND.quack(),cow:()=>{act('cow');SND.moo();},pig:()=>{act('pig');SND.oink();},sheep:()=>{act('sheep');SND.baa();},chicken:()=>{act('chicken');SND.cluck();}};
function callTrain(){rideTrain(STOP_TOWN);}
/* power station: lightning runs to the houses and every window lights up */
const ZAP_TO=[[60,40],[165,50],[385,120],[650,240],[110,620],[385,420],[650,640],[650,420],[60,420],[430,1140]];
let ZAPS=[];function zapStart(){ZAPS=ZAP_TO.map(([x,y],i)=>({x,y,d:i*0.08}));}
function drawZaps(){const t=fx('power');if(t>1.6)return;g.lineCap='round';
  for(const z of ZAPS){const u=Math.min(1,Math.max(0,(t-z.d)/0.5));if(u<=0)continue;const x0=207,y0=1250,x1=x0+(z.x-x0)*u,y1=y0+(z.y-y0)*u;
    g.strokeStyle=`rgba(255,240,120,${1-t/1.6})`;g.lineWidth=4;g.beginPath();g.moveTo(x0,y0);
    for(let k=1;k<=8;k++){const f=k/8;g.lineTo(x0+(x1-x0)*f+(k<8?rnd(-10,10):0),y0+(y1-y0)*f+(k<8?rnd(-10,10):0));}g.stroke();
    if(u>=1)LIGHTS.push(z.x,z.y,40,'#FFF07A');}g.lineCap='butt';}

function zoneAt(x,y){
  for(const z of K.ZONES){const id=z(x,y);if(id)return id;}
  if(inLake(x,y))return 'lake';if(inRiver(x,y))return 'river';if(Math.abs(y-1255)<14)return 'rail';if(onRoad(x,y,26))return 'road';
  if(inR(x,y,RECT.field))return 'field';if(inR(x,y,RECT.square))return 'square';if(inR(x,y,RECT.park))return 'park';if(inR(x,y,RECT.site))return 'site';
  if(inR(x,y,RECT.pasture)||inR(x,y,RECT.farmyard))return 'farm';if(inR(x,y,RECT.forest))return 'forest';if(inR(x,y,RECT.power))return 'power';return 'meadow';}
const ZONE_AT={lake:[700,1360,1150,1620],river:[780,420,860,700],forest:[890,320,1190,760],field:RECT.field,square:RECT.square,park:RECT.park,site:RECT.site,road:[260,780,500,820]};
for(const k in ZONE_AT)ENT[k].at=ZONE_AT[k];

function tapAt(sx,sy){
  const [x,y]=toW(sx,sy);let best=null;
  for(const h of HITS){const b=h.b;if(x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3]){const a=(b[2]-b[0])*(b[3]-b[1])*(h.small?0.5:1);if(!best||a<best.a)best={h,a};}}
  if(!best){const pad=16/CAM.k;let bd=pad;for(const h of HITS){if(!h.small)continue;const b=h.b,dx=Math.max(b[0]-x,0,x-b[2]),dy=Math.max(b[1]-y,0,y-b[3]),d=Math.hypot(dx,dy);if(d<bd){bd=d;best={h};}}}
  const h=best?best.h:{id:zoneAt(x,y),b:[x-20,y-20,x+20,y+20]};
  trigger(h.id,h.b,x,y,h.ref);}
function lineFor(e){return e.l?e.l[li()]:cap(e.n[li()])+'!';}
function trigger(id,b,x,y,ref){
  const e=ENT[id];if(!e)return;
  if(FIND){findTap(e,b,x,y,ref);return;}
  const quiet=TAP[id]&&TAP[id](ref,x,y)===true;
  let line=quiet?'':lineFor(e);
  if(e.animal&&!FOUND.has(id)){FOUND.add(id);store();paws();line+=' '+W.found[li()];burst((b[0]+b[2])/2,b[1],'star',14,'#FFD23F');SND.yay();
    if(typeof addPower==='function')addPower(2);
    if(FOUND.size===ANIMALS.length)later(2.5,()=>{burst(x,y,'star',40,'#FFD23F',1.5);say(['Du hast alle Tiere gefunden! Super!','You found all the animals! Amazing!','¡Encontraste todos los animales! ¡Genial!'][li()]);});}
  if(line)say(line);bubble(e,b);
  if(CAM.k<kFit()*1.8){const cx=(b[0]+b[2])/2,cy=(b[1]+b[3])/2,k=kFit()*2.8;flyTo({k,x:cx-VW/2/k,y:cy-VH/2/k});}}

/* name bubble that follows its object */
let BUB=null;
function bubble(e,b){BUB={e,b,t:T};const el=$('cityBub');el.textContent=e.ic+' '+cap(e.n[li()]);el.classList.add('on');}
function placeBubble(){const el=$('cityBub');if(!BUB)return;if(T-BUB.t>3){el.classList.remove('on');BUB=null;return;}
  const b=BUB.b,sx=((b[0]+b[2])/2-CAM.x)*CAM.k,sy=(b[1]-CAM.y)*CAM.k-10,w=el.offsetWidth/2+6;
  el.style.left=Math.max(w,Math.min(VW-w,sx))+'px';el.style.top=Math.max(el.offsetHeight+4,sy)+'px';}

/* =============================================================
   FIND IT: "Where is …?"
============================================================= */
let FIND=null,findHist=[];
function findNext(){
  const vis=b=>b[2]>CAM.x&&b[0]<CAM.x+VW/CAM.k&&b[3]>CAM.y&&b[1]<CAM.y+VH/CAM.k;
  let pool=Object.values(ENT).filter(e=>(e.find||(e.animal&&FOUND.has(e.id)))&&e.at&&!findHist.includes(e.id));
  const here=pool.filter(e=>vis(e.at));if(here.length>=3)pool=here;else flyTo(homeView());   // ask about what is on screen
  const e=pool[Math.random()*pool.length|0];findHist.push(e.id);if(findHist.length>6)findHist.shift();
  FIND={id:e.id,miss:0};showQ();say(W.where(e.n[li()]));}
function showQ(){const q=$('cityQ');if(!FIND){q.classList.remove('on');return;}const e=ENT[FIND.id];
  q.innerHTML='';const s=document.createElement('span');s.textContent=W.where(e.n[li()])+' 🔊';const st=document.createElement('span');st.className='st';st.textContent='⭐ '+SAVE.stars;
  q.append(s,st);q.classList.add('on');}
$('cityQ').onclick=()=>{if(FIND)say(W.where(ENT[FIND.id].n[li()]));};
function findTap(e,b,x,y,ref){
  if(FIND.done)return;
  if(e.id===FIND.id){FIND.done=true;SAVE.stars++;store();showQ();if(typeof award==='function')award(Math.min(FIND.miss,2),1);TAP[e.id]&&TAP[e.id](ref,x,y);
    burst((b[0]+b[2])/2,(b[1]+b[3])/2,'star',22,'#FFD23F');SND.yay();bubble(e,b);say(W.yes[li()]+' '+cap(e.n[li()])+'!');later(3,()=>{if(FIND)findNext();});}
  else{FIND.miss++;nope();bubble(e,b);say(W.that(e.n[li()])+' '+W.where(ENT[FIND.id].n[li()]));}}
$('cFind').onclick=()=>{ac();if(FIND){FIND=null;$('cFind').classList.remove('on');showQ();return;}$('cFind').classList.add('on');findNext();};
function drawHint(){if(!FIND||FIND.miss<2||FIND.done)return;const b=ENT[FIND.id].at;if(!b)return;
  const cx=(b[0]+b[2])/2,cy=(b[1]+b[3])/2,r=Math.max(b[2]-b[0],b[3]-b[1])/2+14+Math.sin(T*6)*5;
  g.strokeStyle='rgba(255,210,40,.95)';g.lineWidth=5/CAM.k*0.6+3;g.setLineDash([12,8]);g.lineDashOffset=-T*30;g.beginPath();g.arc(cx,cy,r,0,TAU);g.stroke();g.setLineDash([]);}

/* =============================================================
   NIGHT, LANGUAGE
============================================================= */
$('cNight').onclick=()=>{ac();nightOn=!nightOn;$('cNight').textContent=nightOn?'☀️':'🌙';$('cNight').classList.toggle('on',nightOn);
  say(nightOn?['Gute Nacht, Stadt!','Good night, town!','¡Buenas noches, ciudad!'][li()]:['Guten Morgen!','Good morning!','¡Buenos días!'][li()]);};
/* called by the app when the language changes or the tab opens */
function onLang(){if(FIND){showQ();say(W.where(ENT[FIND.id].n[li()]));}else if(BUB)bubble(BUB.e,BUB.b);}
function show(){fit();paws();say(['Willkommen in der Stadt! Tippe auf alles.','Welcome to the town! Tap on anything.','¡Bienvenido a la ciudad! Toca todo.'][li()]);}

/* =============================================================
   MAIN LOOP
============================================================= */
function update(dt){
  for(let i=LATER.length-1;i>=0;i--)if(T>=LATER[i].at){const f=LATER[i].f;LATER.splice(i,1);f();}
  NIGHT+=((nightOn?1:0)-NIGHT)*Math.min(1,dt*1.5);
  const fast=(k,a,b)=>dt*(fx(k)<5?a:b);
  SPIN.ferris+=fast('ferris',0.9,0.22);SPIN.carousel+=fast('carousel',1.6,0.5);SPIN.turbine+=fast('turbine',5,1.4);
  SPIN.coaster+=fast('coaster',0.5,0.16);SPIN.crane+=fast('crane',1.6,0.35);SPIN.digger+=fast('digger',3,1.2);
  stepVeh(dt);stepTrain(dt);stepParts(dt);for(const f of K.UPDATE)f(dt);K.shake=Math.max(0,K.shake-dt*6);
  if(TUG.t>=0){TUG.t+=dt;if(TUG.t>14)TUG.t=-1;}
  if(HELI.t>=0){HELI.t+=dt;if(HELI.t>11)HELI.t=-1;}
  if(FROG.t<5)FROG.t+=dt;
  boatA+=dt*0.07;
  duckU+=duckD*dt*0.006;if(duckU>0.8)duckD=-1;if(duckU<0.25)duckD=1;
  TRAC.x+=TRAC.dir*dt*16;if(TRAC.x>1182||TRAC.x<1062){TRAC.dir*=-1;TRAC.row=(TRAC.row+1)%FIELD_ROWS.length;TRAC.x=Math.max(1062,Math.min(1182,TRAC.x));}
  CHICKS.forEach(c=>{const dx=c.tx-c.x,dy=c.ty-c.y,d=Math.hypot(dx,dy);if(d<2){c.tx=900+Math.random()*130;c.ty=940+Math.random()*70;}
    else{c.x+=dx/d*dt*12;c.y+=dy/d*dt*12;c.f=dx>0?1:-1;}});
  CLOUDS.forEach(c=>{c.x+=dt*6*c.s;if(c.x>WX1+160)c.x=WX0-160;});
  if(Math.random()<dt*0.5)HOUSES.forEach(hs=>{if(hs[7])puff(hs[0]+hs[2]*0.7+5.5,roofTop(hs)-14,{c:'#EEF1F6',r:3});});
  if(Math.random()<dt*1.2)puff(207+rnd(-4,4),1244,{c:'#F2F4F8',r:6,vy:-16,max:2.6});
  if(Math.random()<dt*0.15&&!FISH.length){const u=rnd(0.1,0.9);const [x,y]=Math.random()<0.5?riverAt(u):[rnd(700,1100),rnd(1420,1560)];fishJump(x,y);}
  if(NIGHT>0.5&&Math.random()<dt*3)PARTS.push({x:rnd(890,1190),y:rnd(320,760),vx:rnd(-6,6),vy:rnd(-6,6),life:0,max:3,k:'firefly',r:3,c:'#FFF27A'});
}
function render(now){
  if(TRAIN.ride&&!camAnim){const k=Math.max(kFit()*1.3,Math.min(CAM.k,kFit()*2.2)),tx=TRAIN.c-VW/2/k,ty=1190-VH/2/k;
    CAM.x+=(tx-CAM.x)*0.08;CAM.y+=(ty-CAM.y)*0.08;CAM.k+=(k-CAM.k)*0.08;clampCam(CAM);}
  if(camAnim){const t=Math.min(1,(now-camAnim.t0)/camAnim.d),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,A=camAnim.from,B=camAnim.to;
    CAM.k=Math.exp(Math.log(A.k)+(Math.log(B.k)-Math.log(A.k))*e);
    const cxA=A.x+VW/2/A.k,cyA=A.y+VH/2/A.k,cxB=B.x+VW/2/B.k,cyB=B.y+VH/2/B.k;
    CAM.x=cxA+(cxB-cxA)*e-VW/2/CAM.k;CAM.y=cyA+(cyB-cyA)*e-VH/2/CAM.k;if(t>=1)camAnim=null;}
  const dpr=cv.width/VW;HITS=[];LIT.length=0;LIGHTS.length=0;ST.T=T;ST.NIGHT=NIGHT;ST.zoom=CAM.k/kFit();
  g.setTransform(1,0,0,1,0,0);g.fillStyle='#93D46F';g.fillRect(0,0,cv.width,cv.height);
  const shx=K.shake?rnd(-1,1)*K.shake:0,shy=K.shake?rnd(-1,1)*K.shake:0;
  g.setTransform(dpr*CAM.k,0,0,dpr*CAM.k,(-CAM.x*CAM.k+shx)*dpr,(-CAM.y*CAM.k+shy)*dpr);
  const vx0=CAM.x-60,vy0=CAM.y-60,vx1=CAM.x+VW/CAM.k+60,vy1=CAM.y+VH/CAM.k+200;VIEW[0]=vx0;VIEW[1]=vy0;VIEW[2]=vx1;VIEW[3]=vy1;
  drawGround();drawPads();
  const L=[];
  for(const s of STATIC)if(s.b[2]>vx0&&s.b[0]<vx1&&s.b[3]>vy0&&s.b[1]<vy1)L.push(s);
  for(const v of VEH){const p=vehPos(v);L.push({y:p.y,f:()=>{if(v.age>v.life)g.globalAlpha=Math.max(0,1-(v.age-v.life));
    vehicle(p.x,p.y,p.dir,VKIND[v.kind],v.col,v.flash,v.spin);g.globalAlpha=1;const o=VKIND[v.kind];
    hit(ENT_OF[v.kind],p.x-o.L/2,p.y-o.H-4,p.x+o.L/2,p.y+2,{moving:1,small:1});
    if(NIGHT>0.2&&p.dir!=='N')LIGHTS.push(p.x+(p.dir==='E'?o.L/2:p.dir==='W'?-o.L/2:0),p.y-o.H*0.4,20,'#FFE9A0');}});}
  L.push({y:1262,f:drawTrainAny});
  L.push({y:tugPos().y,f:drawTug});L.push({y:1505+Math.sin(boatA)*62,f:drawBoat});
  L.push({y:riverAt(duckU)[1],f:drawDucks});L.push({y:FIELD_ROWS[TRAC.row]+8,f:drawTractor});
  L.push({y:990,f:drawChicks});
  L.push({y:HELI.t<0?331:WY1+500,f:drawHeli});
  for(const f of K.DYN)f(L);
  L.sort((a,b)=>a.y-b.y);for(const o of L)o.f();
  drawFish();drawParts();drawZaps();for(const f of K.TOP)f();drawClouds();drawHint();
  // night
  const zap=fx('power')<7?Math.min(1,fx('power')/1.2)*(fx('power')>5.5?(7-fx('power'))/1.5:1):0,lit=Math.max(NIGHT,zap);
  if(NIGHT>0.01){g.fillStyle=`rgba(10,16,58,${0.64*NIGHT})`;g.fillRect(vx0-100,vy0-100,vx1-vx0+200,vy1-vy0+200);}
  if(lit>0.01){g.fillStyle=`rgba(255,214,110,${0.92*lit})`;for(let i=0;i<LIT.length;i+=4)g.fillRect(LIT[i],LIT[i+1],LIT[i+2],LIT[i+3]);}
  if(NIGHT>0.05||zap>0){g.globalCompositeOperation='lighter';
    for(let i=0;i<LIGHTS.length;i+=4){const x=LIGHTS[i],y=LIGHTS[i+1],r=LIGHTS[i+2],c=LIGHTS[i+3];
      const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=0.75*Math.max(NIGHT,zap*0.6);g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}
    for(const p of PARTS)if(p.k==='firefly'){g.globalAlpha=NIGHT*(0.5+0.5*Math.sin(T*8+p.x));circ(p.x,p.y,2.2,'#FFF27A');}
    g.globalAlpha=1;g.globalCompositeOperation='source-over';}
  placeBubble();
}
let last=performance.now();
function frame(now){requestAnimationFrame(frame);if(document.hidden||activeTab!=='city'){last=now;return;}
  const dt=Math.min(0.05,(now-last)/1000);last=now;T+=dt;update(dt);render(now);}
const K={rr,circ,ell,poly,ln,star,shade,FONT,sign,win,gableB,flatB,kid,SKIN,HAIR,ent,ENT,ANIMALS,S,hit,fx,act,later,puff,burst,textP,PARTS,LIT,LIGHTS,
  SND,swp,tree,TCOL,sr,sm,li,ST,TAP,VIEW,TAU,wheel,shakeTree,g,rideTrain,TRAIN,STOP_WEST,flyTo,viewOf,
  GROUND0:[],GROUND1:[],UPDATE:[],DYN:[],TOP:[],ZONES:[],shake:0};
if(typeof cityWild==='function')cityWild(K);
if(typeof cityFar==='function')cityFar(K);
if(typeof cityWest==='function')cityWest(K);
if(typeof cityIndustry==='function')cityIndustry(K);
paws();
if(document.fonts)document.fonts.load(FONT(20)).catch(()=>{});
requestAnimationFrame(frame);
window.CITY={total:()=>ANIMALS.length,worldView,homeView,show,onLang,ENT,FOUND,HITS:()=>HITS,trigger,tapAt,toScreen:(x,y)=>[(x-CAM.x)*CAM.k,(y-CAM.y)*CAM.k],flyTo,viewOf,CAM,TRAIN,VEH,
  setNight:v=>{nightOn=v;NIGHT=v?1:0;},act,FIND:()=>FIND,findNext,callTrain};
})();
