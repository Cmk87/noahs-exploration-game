/* =============================================================
   THE WILD WORLD AROUND THE TOWN (loaded before js/city.js, which
   calls cityWild(K) with its drawing helpers).
   North: a mountain range with a waterfall, cable car, hut, ibex,
   marmot and eagle. North-east: a volcano above a dinosaur valley.
   East: a deep forest (pond with beaver, tree house, wolf, boar…),
   a campsite and an airport. South-east: a castle with a dragon and
   horses. South: the beach and the sea with dolphins, a whale, an
   island with treasure, a pirate ship and a submarine.
============================================================= */
function cityWild(K){
const {rr,circ,ell,poly,ln,star,shade,FONT,sign,win,gableB,flatB,kid,SKIN,HAIR,ent,ANIMALS,S,hit,fx,act,later,puff,burst,textP,
  PARTS,LIGHTS,SND,swp,tree,TCOL,sr,sm,li,ST,TAP,VIEW,TAU,g,wheel}=K;
const ANI=(id,ic,n,l)=>{ANIMALS.push([id,ic,n,l]);ent(id,ic,n,l,{animal:1});};
const at=(id,b)=>{ENT_(id).at=b;};const ENT_=id=>K.ENT[id];
const inV=(x0,y0,x1,y1)=>x1>VIEW[0]&&x0<VIEW[2]&&y1>VIEW[1]&&y0<VIEW[3];
const flip=(x,y,f,fn)=>{g.save();g.translate(x,y);g.scale(f,1);fn();g.restore();};
const TT=()=>ST.T;
const near=(x,y,list,d)=>list.some(p=>Math.hypot(x-p[0],y-p[1])<(p[2]||d));

/* ---------- words ---------- */
ent('waterfall','💦',['der Wasserfall','the waterfall','la cascada'],['Der Wasserfall! Hier beginnt der Fluss.','The waterfall! This is where the river starts.','¡La cascada! Aquí nace el río.'],{find:1});
ent('cablecar','🚡',['die Seilbahn','the cable car','el teleférico'],['Die Seilbahn! Sie fährt auf den Berg.','The cable car! It goes up the mountain.','¡El teleférico! Sube a la montaña.'],{find:1});
ent('hut','🛖',['die Berghütte','the mountain hut','el refugio'],['Die Berghütte! Hier machen Wanderer Pause.','The mountain hut! Hikers rest here.','¡El refugio! Aquí descansan los excursionistas.'],{find:1});
ent('snowman','⛄',['der Schneemann','the snowman','el muñeco de nieve'],['Der Schneemann! Brrr, ist das kalt!','The snowman! Brrr, it is cold!','¡El muñeco de nieve! ¡Brrr, qué frío!'],{find:1});
ent('alp','🏔️',['die Alm','the mountain meadow','el prado de montaña'],null);
ent('volcano','🌋',['der Vulkan','the volcano','el volcán'],['Der Vulkan! Achtung, er bricht aus! Bumm!','The volcano! Watch out, it is erupting! Boom!','¡El volcán! ¡Cuidado, entra en erupción! ¡Bum!'],{find:1});
ent('dinovalley','🦕',['das Dino-Tal','the dinosaur valley','el valle de los dinosaurios'],['Das Dino-Tal! Hier wohnen die Dinosaurier.','The dinosaur valley! The dinosaurs live here.','¡El valle de los dinosaurios! Aquí viven los dinosaurios.'],{find:1});
ent('nest','🥚',['das Dino-Nest','the dinosaur nest','el nido de dinosaurio'],['Das Nest! Da schlüpft ein Baby!','The nest! A baby is hatching!','¡El nido! ¡Sale un bebé!'],{find:1});
ent('pond','🪷',['der Teich','the pond','el estanque'],null,{find:1});
ent('treehouse','🌳',['das Baumhaus','the tree house','la casa del árbol'],['Das Baumhaus! Hallo da oben!','The tree house! Hello up there!','¡La casa del árbol! ¡Hola, ahí arriba!'],{find:1});
ent('campsite','🏕️',['der Campingplatz','the campsite','el camping'],['Der Campingplatz! Hier schlafen die Leute im Zelt.','The campsite! People sleep in tents here.','¡El camping! Aquí la gente duerme en tiendas.'],{find:1});
ent('tent','⛺',['das Zelt','the tent','la tienda de campaña'],null,{find:1});
ent('campfire','🔥',['das Lagerfeuer','the campfire','la hoguera'],['Das Lagerfeuer! Knister, knister. Wir grillen Marshmallows.','The campfire! Crackle, crackle. We are toasting marshmallows.','¡La hoguera! Cric, cric. Asamos nubes.'],{find:1});
ent('caravan','🚐',['der Wohnwagen','the caravan','la caravana'],null,{find:1});
ent('airport','🛫',['der Flughafen','the airport','el aeropuerto'],['Der Flughafen! Hier starten die Flugzeuge.','The airport! Planes take off here.','¡El aeropuerto! Aquí despegan los aviones.'],{find:1});
ent('plane','✈️',['das Flugzeug','the plane','el avión'],['Das Flugzeug! Es hebt ab!','The plane! It is taking off!','¡El avión! ¡Despega!'],{find:1});
ent('castle','🏰',['die Burg','the castle','el castillo'],['Die Burg! Die Zugbrücke geht auf.','The castle! The drawbridge is opening.','¡El castillo! Se abre el puente levadizo.'],{find:1});
ent('knight','🛡️',['der Ritter','the knight','el caballero'],['Der Ritter! Er winkt dir zu.','The knight! He is waving to you.','¡El caballero! Te saluda.'],{find:1});
ent('sunflower','🌻',['die Sonnenblume','the sunflower','el girasol'],null,{find:1});
ent('beach','🏖️',['der Strand','the beach','la playa'],['Der Strand! Hier bauen wir Sandburgen.','The beach! We build sandcastles here.','¡La playa! Aquí hacemos castillos de arena.'],{find:1});
ent('sea','🌊',['das Meer','the sea','el mar'],['Das Meer! Das Wasser ist salzig.','The sea! The water is salty.','¡El mar! El agua es salada.'],{find:1});
ent('sandcastle','🏰',['die Sandburg','the sandcastle','el castillo de arena'],null,{find:1});
ent('icecream','🍦',['das Eis','the ice cream','el helado'],['Das Eis! Mmh, lecker!','Ice cream! Mmm, yummy!','¡El helado! ¡Mmm, qué rico!'],{find:1});
ent('ball','⚽',['der Ball','the ball','la pelota'],['Der Ball! Hoch in die Luft!','The ball! Up in the air!','¡La pelota! ¡Arriba!']);
ent('umbrella','⛱️',['der Sonnenschirm','the sun umbrella','la sombrilla'],null,{find:1});
ent('island','🏝️',['die Insel','the island','la isla'],['Die Insel! Rundherum ist Wasser.','The island! There is water all around it.','¡La isla! Tiene agua por todos lados.'],{find:1});
ent('palm','🌴',['die Palme','the palm tree','la palmera'],null);
ent('treasure','💰',['die Schatzkiste','the treasure chest','el cofre del tesoro'],['Die Schatzkiste! Lauter Gold!','The treasure chest! So much gold!','¡El cofre del tesoro! ¡Cuánto oro!'],{find:1});
ent('pirate','🏴‍☠️',['das Piratenschiff','the pirate ship','el barco pirata'],['Das Piratenschiff! Ahoi!','The pirate ship! Ahoy!','¡El barco pirata! ¡Ahoy!'],{find:1});
ent('submarine','🟡',['das U-Boot','the submarine','el submarino'],['Das U-Boot! Es taucht auf.','The submarine! It is coming up.','¡El submarino! Sale a la superficie.'],{find:1});
ANI('brachio','🦕',['der Brachiosaurus','the Brachiosaurus','el braquiosaurio'],['Der Brachiosaurus! Er hat einen ganz langen Hals und frisst Blätter.','The Brachiosaurus! It has a very long neck and eats leaves.','¡El braquiosaurio! Tiene el cuello muy largo y come hojas.']);
ANI('trex','🦖',['der T-Rex','the T. rex','el tiranosaurio'],['Der T-Rex! Roaaar!','The T. rex! Roaaar!','¡El tiranosaurio! ¡Grrroaar!']);
ANI('trike','🦏',['der Triceratops','the Triceratops','el tricerátops'],['Der Triceratops! Er hat drei Hörner.','The Triceratops! It has three horns.','¡El tricerátops! Tiene tres cuernos.']);
ANI('stego','🦕',['der Stegosaurus','the Stegosaurus','el estegosaurio'],['Der Stegosaurus! Er hat Platten auf dem Rücken.','The Stegosaurus! It has plates on its back.','¡El estegosaurio! Tiene placas en la espalda.']);
ANI('ptera','🪽',['der Flugsaurier','the pterosaur','el pterosaurio'],['Der Flugsaurier! Er fliegt um den Vulkan.','The pterosaur! It flies around the volcano.','¡El pterosaurio! Vuela alrededor del volcán.']);
ANI('babydino','🐣',['das Dino-Baby','the baby dinosaur','el bebé dinosaurio'],['Ein Dino-Baby! Es ist gerade geschlüpft.','A baby dinosaur! It just hatched.','¡Un bebé dinosaurio! Acaba de nacer.']);
ANI('ibex','🐐',['der Steinbock','the ibex','la cabra montés'],['Der Steinbock! Er klettert auf die Felsen.','The ibex! It climbs on the rocks.','¡La cabra montés! Trepa por las rocas.']);
ANI('marmot','🐹',['das Murmeltier','the marmot','la marmota'],['Das Murmeltier! Es pfeift. Piiiep!','The marmot! It whistles. Eeeep!','¡La marmota! Silba. ¡Fiiii!']);
ANI('eagle','🦅',['der Adler','the eagle','el águila'],['Der Adler! Er fliegt hoch über den Bergen.','The eagle! It flies high above the mountains.','¡El águila! Vuela muy alto sobre las montañas.']);
ANI('wolf','🐺',['der Wolf','the wolf','el lobo'],['Der Wolf! Auuuuu!','The wolf! Awooooo!','¡El lobo! ¡Auuuuu!']);
ANI('boar','🐗',['das Wildschwein','the wild boar','el jabalí'],['Das Wildschwein und seine Frischlinge!','The wild boar and its piglets!','¡El jabalí y sus rayones!']);
ANI('badger','🦡',['der Dachs','the badger','el tejón'],['Der Dachs! Er wohnt in einer Höhle unter der Erde.','The badger! It lives in a hole under the ground.','¡El tejón! Vive en una madriguera.']);
ANI('woodpecker','🐦',['der Specht','the woodpecker','el pájaro carpintero'],['Der Specht! Tock, tock, tock!','The woodpecker! Tock, tock, tock!','¡El pájaro carpintero! ¡Toc, toc, toc!']);
ANI('stag','🦌',['der Hirsch','the stag','el ciervo'],['Der Hirsch! Er hat ein großes Geweih.','The stag! It has big antlers.','¡El ciervo! Tiene una gran cornamenta.']);
ANI('beaver','🦫',['der Biber','the beaver','el castor'],['Der Biber! Er baut einen Damm aus Holz.','The beaver! It builds a dam out of wood.','¡El castor! Construye un dique de madera.']);
ANI('snail','🐌',['die Schnecke','the snail','el caracol'],['Die Schnecke! Sie ist ganz langsam.','The snail! It is very slow.','¡El caracol! Es muy lento.']);
ANI('butterfly','🦋',['der Schmetterling','the butterfly','la mariposa'],['Der Schmetterling! Er flattert davon.','The butterfly! It flutters away.','¡La mariposa! Se va volando.']);
ANI('dragon','🐉',['der Drache','the dragon','el dragón'],['Der Drache! Er spuckt Feuer!','The dragon! It breathes fire!','¡El dragón! ¡Echa fuego!']);
ANI('horse','🐴',['das Pferd','the horse','el caballo'],['Das Pferd! Hüa!','The horse! Neigh!','¡El caballo! ¡Arre!']);
ANI('crab','🦀',['die Krabbe','the crab','el cangrejo'],['Die Krabbe! Sie läuft seitwärts.','The crab! It walks sideways.','¡El cangrejo! Camina de lado.']);
ANI('gull','🐦',['die Möwe','the seagull','la gaviota'],['Die Möwe! Kreisch!','The seagull! Squawk!','¡La gaviota! ¡Cuac!']);
ANI('starfish','⭐',['der Seestern','the starfish','la estrella de mar'],['Der Seestern! Er hat fünf Arme.','The starfish! It has five arms.','¡La estrella de mar! Tiene cinco brazos.']);
ANI('seal','🦭',['die Robbe','the seal','la foca'],['Die Robbe! Sie klatscht mit den Flossen.','The seal! It claps its flippers.','¡La foca! Aplaude con las aletas.']);
ANI('octopus','🐙',['der Tintenfisch','the octopus','el pulpo'],['Der Tintenfisch! Er hat acht Arme.','The octopus! It has eight arms.','¡El pulpo! Tiene ocho brazos.']);
ANI('turtle','🐢',['die Schildkröte','the turtle','la tortuga'],['Die Meeresschildkröte! Sie schwimmt ganz ruhig.','The sea turtle! It swims very calmly.','¡La tortuga marina! Nada muy tranquila.']);
ANI('dolphin','🐬',['der Delfin','the dolphin','el delfín'],['Der Delfin! Er springt aus dem Wasser.','The dolphin! It jumps out of the water.','¡El delfín! Salta fuera del agua.']);
ANI('whale','🐳',['der Wal','the whale','la ballena'],['Der Wal! Er ist das größte Tier der Welt.','The whale! It is the biggest animal in the world.','¡La ballena! Es el animal más grande del mundo.']);
ANI('shark','🦈',['der Hai','the shark','el tiburón'],['Der Hai! Seine Flosse schaut aus dem Wasser.','The shark! Its fin sticks out of the water.','¡El tiburón! Se le ve la aleta.']);
const SIGN2={airport:['FLUGHAFEN','AIRPORT','AEROPUERTO'],camp:['CAMPING','CAMPSITE','CAMPING'],dino:['DINO-TAL','DINO VALLEY','VALLE DINO']};

/* ---------- sounds ---------- */
const S2={
  rumble:()=>{noise(1.6,0.22);swp(90,35,1.8,'sawtooth',0.14);setTimeout(()=>noise(0.8,0.25),600);},
  roarT:()=>{if(typeof roar==='function')roar(true);else{swp(160,60,1.2,'sawtooth',0.14);noise(1,0.1);}},
  snort:()=>{noise(0.25,0.15);setTimeout(()=>noise(0.2,0.12),300);},
  munch:()=>{[0,0.2,0.4,0.6].forEach(t=>beep(140,t,0.08,'square',0.05));},
  screech:()=>{swp(1400,900,0.4,'sawtooth',0.06);swp(1500,1000,0.3,'sawtooth',0.05,0.45);},
  crack:()=>{[0,0.25,0.5].forEach(t=>beep(2200,t,0.04,'square',0.07));},
  howl:()=>{swp(320,640,0.7,'sine',0.13);swp(640,470,1.3,'sine',0.13,0.7);},
  grunt:()=>{[0,0.22,0.44].forEach(t=>swp(160,110,0.15,'sawtooth',0.07,t));},
  knock:()=>{for(let i=0;i<6;i++)beep(900,i*0.09,0.04,'square',0.08);},
  bellow:()=>{swp(150,95,1.4,'sawtooth',0.09);},
  slap:()=>{noise(0.3,0.25);},
  whistleM:()=>{swp(1800,2600,0.25,'sine',0.11);swp(2600,1800,0.35,'sine',0.11,0.3);},
  neigh:()=>{for(let i=0;i<8;i++)beep(700+(i%2)*120-i*30,i*0.07,0.08,'sawtooth',0.05);},
  fire:()=>{noise(1.2,0.2);swp(300,80,1,'sawtooth',0.08);},
  plane:()=>{swp(120,240,3,'sawtooth',0.05);noise(2.5,0.08);},
  crackle:()=>{for(let i=0;i<8;i++)setTimeout(()=>noise(0.04,0.12),i*120+Math.random()*80);},
  arf:()=>{[0,0.3,0.6].forEach(t=>swp(500,300,0.15,'square',0.06,t));},
  click:()=>{for(let i=0;i<10;i++)beep(2500+Math.random()*800,i*0.05,0.02,'square',0.05);},
  spout:()=>{noise(1,0.18);},
  cannon:()=>{noise(0.6,0.3);swp(110,40,0.5,'sine',0.3);},
  coins:()=>{[1568,1760,2093,2349,2637].forEach((f,i)=>beep(f,i*0.08,0.25,'triangle',0.1));},
  snip:()=>{[0,0.15].forEach(t=>beep(3000,t,0.03,'square',0.07));},
  bubbles:()=>{for(let i=0;i<6;i++)swp(400+Math.random()*400,900+Math.random()*500,0.08,'sine',0.06,i*0.1);},
  gondola:()=>{beep(660,0,0.4,'sine',0.1);beep(880,0.3,0.6,'sine',0.1);}};

/* =============================================================
   GEOGRAPHY: mountain range, sea, beach
============================================================= */
const seaY=x=>1898+12*Math.sin(x/130)+7*Math.sin(x/47);
const sandY=x=>1712+9*Math.sin(x/90)+5*Math.sin(x/37);
const SEA=new Path2D(),SAND=new Path2D();
SEA.moveTo(-400,seaY(-400));for(let x=-400;x<=4400;x+=20)SEA.lineTo(x,seaY(x));SEA.lineTo(4400,4000);SEA.lineTo(-400,4000);SEA.closePath();
SAND.moveTo(-400,sandY(-400));for(let x=-400;x<=4400;x+=20)SAND.lineTo(x,sandY(x));for(let x=4400;x>=-400;x-=20)SAND.lineTo(x,seaY(x)+10);SAND.closePath();
const PEAKS_B=[[140,-840,-260,520],[620,-900,260,1000],[1080,-830,700,1420],[1530,-880,1120,1920],[1880,-720,1560,2120]];
const PEAKS_F=[[340,-650,20,720],[870,-720,500,1200],[1320,-640,980,1640],[1760,-590,1470,2010]];
function peak([px,py,l,r],c,base){
  poly(c,l,base,px,py,r,base);poly(shade(c,0.17),l,base,px,py,px-(px-l)*0.08,base);
  const P=(f,side)=>side<0?[px-(px-l)*f,py+(base-py)*f]:[px+(r-px)*f,py+(base-py)*f];
  const a=P(0.27,-1),b=P(0.27,1);
  poly('#FFFFFF',a[0],a[1],px,py,b[0],b[1],px+(r-px)*0.15,py+(base-py)*0.21,px+(r-px)*0.05,py+(base-py)*0.29,px-(px-l)*0.07,py+(base-py)*0.2,px-(px-l)*0.17,py+(base-py)*0.26);
  poly('#E4ECF6',px,py,b[0],b[1],px+(r-px)*0.15,py+(base-py)*0.21,px+(r-px)*0.05,py+(base-py)*0.29,px,py+(base-py)*0.18);}
/* volcano */
const VX=2360,VTOP=-600,VBASE=-10;
const LAVA=[[[2340,-596],[2318,-470],[2338,-340],[2306,-200],[2326,-40]],[[2372,-596],[2410,-460],[2440,-300],[2500,-120]],[[2324,-596],[2260,-450],[2200,-260],[2150,-60]]];
let BOMBS=[];
/* ground layer 0: everything flat outside the town, drawn under the town's own ground */
K.GROUND0.push(()=>{
  const T=TT();
  // alpine meadow and mountain range
  if(VIEW[1]<0){
    const sky=g.createLinearGradient(0,-1000,0,-300);sky.addColorStop(0,'#BFE3FA');sky.addColorStop(1,'#E3F3FC');g.fillStyle=sky;g.fillRect(-400,-1700,4900,1400);
    rr(-400,-300,2420,300,0,'#A3DA80');
    PEAKS_B.forEach(p=>peak(p,'#AEB9D0',-300));PEAKS_F.forEach(p=>peak(p,'#94A2BE',-232));
    for(let x=-60;x<2040;x+=95)ell(x,-232,82,24,'#A3DA80');
    for(const [x,y,c] of ALPFL)if(inV(x-3,y-3,x+3,y+3)){circ(x,y,2.4,c);circ(x,y,0.9,'#FFE14D');}
    // volcano
    rr(1960,-300,2500,300,0,'#A3DA80');[[2180,-930,1880,2520],[2660,-880,2330,3000],[3120,-900,2760,3480],[3560,-850,3200,3920],[3960,-910,3620,4320]].forEach(p=>peak(p,'#AEB9D0',-300));
    for(let x=1990;x<4440;x+=95)ell(x,-300,82,24,'#A3DA80');
    poly('#7A5A4E',1990,VBASE,VX-80,VTOP,VX+80,VTOP,2760,VBASE);poly('#93746A',1990,VBASE,VX-80,VTOP,VX-30,VTOP,2220,VBASE);
    ell(2200,-150,40,12,'#6A4C42');ell(2560,-250,30,9,'#6A4C42');ell(2450,-80,46,12,'#6A4C42');
    const vt=fx('volcano'),hot=vt<7?1:0,glow=0.75+0.25*Math.sin(T*3);
    g.lineCap='round';g.lineJoin='round';
    LAVA.forEach((pts,i)=>{g.strokeStyle='#C2441E';g.lineWidth=hot?14:8;g.beginPath();pts.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();
      g.strokeStyle='#FF8A2A';g.lineWidth=hot?9:4.5;g.setLineDash([16,12]);g.lineDashOffset=-T*(hot?60:14);g.stroke();g.setLineDash([]);
      pts.forEach((p,k)=>{if(k%2===0)LIGHTS.push(p[0],p[1],hot?70:36,'#FF7A2A');});});
    g.lineCap='butt';
    ell(VX,VTOP,82,16,'#4A3030');ell(VX,VTOP+2,64,10,`rgba(255,${110+60*glow|0},40,1)`);LIGHTS.push(VX,VTOP,hot?160:80,'#FF6A2A');
    // jungle floor of the dinosaur valley
    rr(1700,-10,1500,600,24,'#7CC25A');for(const [x,y,r] of JUNGLEBLOB)ell(x,y,r,r*0.4,'#70B44E');
  }
  // forest floor east, campsite, airport, castle meadow
  if(inV(1190,-300,1720,800)){rr(1190,-280,520,1070,30,'#8BCC6A');}
  if(inV(1240,830,1900,1235)){rr(1246,836,640,394,20,'#A6DE84');g.strokeStyle='#E6D3A8';g.lineWidth=14;g.lineCap='round';g.beginPath();g.moveTo(1560,822);g.lineTo(1540,960);g.lineTo(1430,1060);g.moveTo(1540,960);g.lineTo(1700,1060);g.stroke();g.lineCap='butt';}
  if(inV(1950,826,2800,1235)){
    rr(1960,830,840,395,10,'#C2C8D3');rr(1972,1100,820,60,4,'#5F6679');
    g.fillStyle='#FFFFFF';for(let x=2060;x<2730;x+=50)g.fillRect(x,1128,26,4);for(let k=0;k<6;k++){g.fillRect(1984,1106+k*8,18,4);g.fillRect(2768,1106+k*8,18,4);}
    g.strokeStyle='#FFD23F';g.lineWidth=3;g.beginPath();g.moveTo(2150,1052);g.lineTo(2150,1090);g.quadraticCurveTo(2150,1102,2138,1102);g.stroke();}
  if(inV(1300,1290,2800,1720)){
    ell(2160,1520,270,120,'#97D474');ell(2160,1508,250,104,'#A5DC82');
    g.strokeStyle='#5BBDEE';g.lineWidth=18;g.beginPath();g.ellipse(2160,1500,185,66,0,0,TAU);g.stroke();
    g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;g.setLineDash([10,22]);g.lineDashOffset=-T*10;g.stroke();g.setLineDash([]);
    rr(1440,1360,330,250,16,'#B4E494');
    rr(1800,1330,160,130,10,'#8A6A3A');}
  // sand and sea
  if(VIEW[3]>1650){
    g.fillStyle='#F3DFA2';g.fill(SAND);
    g.fillStyle='#45A8E2';g.fill(SEA);
    g.save();g.clip(SEA);const gr=g.createLinearGradient(0,1900,0,2500);gr.addColorStop(0,'#6CC6F0');gr.addColorStop(0.25,'#45A8E2');gr.addColorStop(1,'#2A80C4');
    g.fillStyle=gr;g.fillRect(VIEW[0],1880,VIEW[2]-VIEW[0],2200);g.restore();
    g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=4;g.beginPath();
    for(let x=Math.floor(VIEW[0]/20)*20;x<=VIEW[2];x+=20){const y=seaY(x)+2+Math.sin(T*1.6+x/60)*2.5;x===Math.floor(VIEW[0]/20)*20?g.moveTo(x,y):g.lineTo(x,y);}g.stroke();
    g.strokeStyle='#E5CB86';g.lineWidth=3;g.beginPath();for(let x=Math.floor(VIEW[0]/20)*20;x<=VIEW[2];x+=20){const y=seaY(x)-6;x===Math.floor(VIEW[0]/20)*20?g.moveTo(x,y):g.lineTo(x,y);}g.stroke();
    for(const [x,y,ph] of WAVES)if(inV(x-12,y-6,x+12,y+6)){g.globalAlpha=0.35+0.35*Math.sin(T*1.3+ph);ln('#FFFFFF',2.4,x-11,y,x-4,y-4,x+3,y,x+10,y-4);}g.globalAlpha=1;
    for(const [x,y] of SHELLS)if(inV(x-4,y-4,x+4,y+4)){ell(x,y,3.6,2.6,'#FFE3D3');ln('#E9B7A0',0.8,x-2,y+1,x,y-2,x+2,y+1);}
  }
});
/* ground layer 1: drawn after the town's water, roads and railway */
K.GROUND1.push(()=>{
  if(!inV(860,1600,980,1940))return;
  g.fillStyle='#EAD9A2';g.fillRect(866,1640,98,280);g.fillStyle='#5BBDEE';g.fillRect(876,1640,78,280);
  const T=TT();g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=3;g.setLineDash([12,30]);g.lineDashOffset=-T*26;g.beginPath();g.moveTo(915,1650);g.lineTo(915,1910);g.stroke();g.setLineDash([]);
  // a little wooden footbridge over the channel for the beach path
  rr(858,1752,114,18,3,'#B98B5E');g.strokeStyle='#9A6E45';g.lineWidth=1;g.beginPath();for(let x=862;x<970;x+=8){g.moveTo(x,1752);g.lineTo(x,1770);}g.stroke();
  rr(858,1748,114,3,1,'#8A5E3A');
});
/* scenery seeds */
const ALPFL=[],JUNGLEBLOB=[],WAVES=[],SHELLS=[];
for(let i=0;i<160;i++)ALPFL.push([sr()*1950,-300+sr()*290,['#FFFFFF','#FFE14D','#B78CFF','#FF8FB1','#5DA9FF'][sr()*5|0]]);
for(let i=0;i<30;i++)JUNGLEBLOB.push([1720+sr()*1060,10+sr()*560,20+sr()*50]);
for(let i=0;i<200;i++){const x=sr()*4000;WAVES.push([x,seaY(x)+40+sr()*480,sr()*6]);}
for(let i=0;i<70;i++){const x=sr()*4000;if(Math.abs(x-915)<70)continue;SHELLS.push([x,sandY(x)+30+sr()*(seaY(x)-sandY(x)-50)]);}

/* =============================================================
   NORTH: waterfall, cable car, hut, snowman, alpine animals
============================================================= */
S(-320,[740,-470,900,-300],()=>{const T=TT();
  poly('#8E98AE',740,-300,760,-430,800,-470,870,-462,905,-420,900,-300);poly('#A4AEC2',740,-300,760,-430,800,-470,805,-300);
  rr(800,-440,46,120,6,'#7FD0F5');g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=3;g.setLineDash([14,10]);
  for(let k=0;k<4;k++){g.lineDashOffset=-T*80-k*7;g.beginPath();g.moveTo(806+k*11,-440);g.lineTo(806+k*11,-322);g.stroke();}g.setLineDash([]);
  ell(822,-318,40,12,'#FFFFFF');ell(822,-318,30,7,'#BFE9FF');
  if(Math.random()<0.4)PARTS.push({x:822+rnd(-30,30),y:-322,vx:rnd(-20,20),vy:rnd(-40,-15),life:0,max:0.7,k:'drop',r:4,c:'#FFFFFF',gr:80});
  hit('waterfall',790,-450,858,-300);
});
const CAB={u:0},CB0=[440,-96],CB1=[338,-676];
S(-60,[400,-110,480,-40],()=>{gableB(404,-96,72,36,40,'#E8D3B0','#C0473A');rr(434,-78,14,18,[6,6,0,0],'#8E5B3A');hit('cablecar',400,-130,480,-60);});
S(-655,[300,-720,380,-650],()=>{gableB(312,-690,56,30,32,'#E8D3B0','#C0473A');hit('cablecar',300,-730,372,-660);});
K.TOP.push(()=>{if(!inV(300,-720,500,-40))return;
  const mid=[(CB0[0]+CB1[0])/2,(CB0[1]+CB1[1])/2];
  rr(mid[0]-4,mid[1]-6,8,90,2,'#7E889C');ln('#7E889C',3,mid[0]-12,mid[1],mid[0]+12,mid[1]);
  [[-6,'#4F5568'],[6,'#4F5568']].forEach(([o,c])=>ln(c,1.6,CB0[0]+o,CB0[1],mid[0]+o,mid[1]-2,CB1[0]+o,CB1[1]));
  [[CAB.u,'#E8443A',-6],[1-CAB.u,'#FFC928',6]].forEach(([u,c,o])=>{const x=CB0[0]+(CB1[0]-CB0[0])*u+o,y=CB0[1]+(CB1[1]-CB0[1])*u;
    ln('#4F5568',1.4,x,y,x,y+10);rr(x-11,y+10,22,18,[4,4,6,6],c);rr(x-8,y+13,16,8,2,'#E9F6FF');circ(x-3,y+18,2.6,SKIN[0]);circ(x+3.5,y+18,2.6,SKIN[2]);
    hit('cablecar',x-13,y+6,x+13,y+30,{moving:1,small:1});});});
K.UPDATE.push(dt=>{CAB.u+=dt*(fx('cablecar')<8?0.07:0.025)*CAB.d;if(CAB.u>1){CAB.u=1;CAB.d=-1;}if(CAB.u<0){CAB.u=0;CAB.d=1;}});CAB.d=1;
S(-122,[600,-210,720,-110],()=>{const T=TT();
  const {Ye,Yr}=gableB(610,-170,96,48,46,'#B07A4E','#7A4A3A');
  g.strokeStyle='rgba(0,0,0,.12)';g.lineWidth=1;g.beginPath();for(let y=Ye+6;y<-122;y+=6){g.moveTo(610,y);g.lineTo(706,y);}g.stroke();
  win(620,Ye+10,18,14,'#7A4A3A');win(678,Ye+10,18,14,'#7A4A3A');rr(651,-146,14,24,[6,6,0,0],'#5A3A2E');
  rr(618,Ye+26,22,4,2,'#7A4A3A');[0,1,2].forEach(i=>circ(622+i*7,Ye+25,2.6,['#FF5A5F','#FFFFFF','#FF5A5F'][i]));
  ln('#7E889C',1.5,712,-122,712,-176);poly(fx('hut')<4?'#FF5A5F':'#E8443A',712,-176,712+16+Math.sin(T*4)*2,-171,712,-166);
  rr(600,-116,28,4,1,'#8A5A3B');rr(602,-112,3,6,1,'#6E4A33');rr(622,-112,3,6,1,'#6E4A33');
  hit('hut',600,Yr-6,716,-120);});
S(-470,[490,-540,560,-460],()=>{const T=TT(),t=fx('snowman'),w=t<3?Math.sin(t*10)*0.4:0;
  ell(522,-468,48,14,'#FFFFFF');ell(522,-476,15,13,'#F6FAFF');ell(522,-498,11,10,'#F6FAFF');ell(522,-515,8,8,'#F6FAFF');
  circ(519,-517,1.2,'#222');circ(525,-517,1.2,'#222');poly('#FF8A3D',522,-514,532,-512,522,-511);
  rr(514,-529,16,4,1,'#2B2233');rr(517,-538,10,10,1,'#2B2233');[0,1,2].forEach(i=>circ(522,-500+i*6,1.2,'#2B2233'));
  ln('#7A4E33',1.6,510,-500,498,-508+w*10);ln('#7A4E33',1.6,534,-500,546,-510-w*10);rr(515,-509,14,3,1,'#E8443A');
  hit('snowman',500,-540,546,-462);});
const IBEX_R=[[1180,-430],[1240,-470]];
S(-420,[1140,-520,1290,-410],()=>{const T=TT(),t=fx('ibex');
  IBEX_R.forEach(([x,y])=>{poly('#8E98AE',x-34,y+10,x-24,y-10,x+18,y-14,x+36,y+10);poly('#A4AEC2',x-34,y+10,x-24,y-10,x-6,y-12,x-10,y+10);});
  const k=t<1?sm(t):t<4?1:t<5?1-sm(t-4):0,A=IBEX_R[0],B=IBEX_R[1],x=A[0]+(B[0]-A[0])*k,y=A[1]+(B[1]-A[1])*k-12-Math.sin(Math.min(1,t)*Math.PI)*(t<1||t>4&&t<5?24:0);
  flip(x,y,1,()=>{[-7,-3,5,9].forEach(lx=>rr(lx-1.2,-9,2.4,9,1,'#6E5A4A'));ell(0,-13,12,6,'#9A8268');ell(-3,-10,6,3,'#D9C7AE');
    rr(8,-24,6,12,3,'#9A8268');ell(13,-24,5.5,4,'#9A8268');circ(14,-25,0.9,'#222');ln('#6E5A4A',1.2,15,-21,15,-17);
    g.strokeStyle='#6E5A4A';g.lineWidth=2.4;g.lineCap='round';g.beginPath();g.moveTo(10,-27);g.quadraticCurveTo(2,-44,-6,-32);g.stroke();g.lineCap='butt';});
  hit('ibex',x-16,y-46,x+20,y+2,{small:1});});
S(-120,[955,-170,1005,-112],()=>{const T=TT(),t=fx('marmot'),cyc=(T%7)/7,up=t<4?1:cyc>0.55&&cyc<0.85?Math.sin((cyc-0.55)/0.3*Math.PI):0;
  ell(980,-118,20,7,'#7A5A3A');ell(980,-119,13,4.5,'#3A2A20');
  if(up>0.05){g.save();g.beginPath();g.rect(950,-200,60,82);g.clip();const y=-118+(1-up)*30;
    ell(980,y-14,9,15,'#B08A5E');ell(980,y-10,5.5,9,'#E3C9A0');circ(980,y-30,7,'#B08A5E');circ(975,y-36,2.4,'#B08A5E');circ(985,y-36,2.4,'#B08A5E');
    circ(977,y-31,1.1,'#222');circ(983,y-31,1.1,'#222');ell(980,y-27,2.4,1.6,'#5A3A2E');if(t<4){rr(972,y-20,4,6,2,'#B08A5E');rr(984,y-20,4,6,2,'#B08A5E');}g.restore();}
  hit('marmot',962,-160,998,-110,{small:1});});
K.TOP.push(()=>{const T=TT(),t=fx('eagle'),a=T*0.25,x=700+Math.cos(a)*240,y=-620+Math.sin(a)*90,fl=t<2?Math.sin(t*14):Math.sin(T*1.2)*0.25;
  if(!inV(x-50,y-30,x+50,y+30))return;
  g.save();g.translate(x,y);g.scale(-Math.sin(a)>0?1:-1,1);
  poly('#6E4A33',-4,0,-34,-6-fl*14,-28,4,-10,6);poly('#6E4A33',4,0,34,-6-fl*14,28,4,10,6);poly('#5A3A2A',-4,0,-34,-6-fl*14,-30,-3-fl*12);
  ell(0,2,9,6,'#7A5235');poly('#7A5235',-8,4,-16,8,-8,8);circ(9,-1,5,'#FFFFFF');poly('#FFC928',13,-2,18,0,13,1);circ(10,-2,0.9,'#222');g.restore();
  hit('eagle',x-36,y-20,x+36,y+14,{moving:1,small:1});});
/* pine trees on the alpine meadow */
const ALPTREES=[];
for(let i=0;i<300&&ALPTREES.length<38;i++){const x=20+sr()*1930,y=-280+sr()*265;
  if(near(x,y,[[420,-80,60],[650,-140,90],[822,-200,70],[980,-130,40],[815,-60,40],[522,-490,50]],0))continue;
  if(Math.abs((x-CB0[0])/(CB1[0]-CB0[0])-(y-CB0[1])/(CB1[1]-CB0[1]))<0.12&&y<-80)continue;
  if(ALPTREES.some(t=>Math.hypot(x-t[0],y-t[1])<40))continue;ALPTREES.push([x,y,0.9+sr()*0.4]);}
ALPTREES.forEach(([x,y,s])=>S(y,[x-25,y-60,x+25,y+5],()=>tree(x,y,s,1,'#2F8F5B')));

/* =============================================================
   NORTH-EAST: volcano and dinosaur valley
============================================================= */
S(-600,[2250,-660,2470,-560],()=>{hit('volcano',2050,-620,2680,-30);});
K.UPDATE.push(dt=>{const t=fx('volcano');
  if(Math.random()<dt*(t<7?10:1.6))puff(VX+rnd(-30,30),VTOP-6,{c:t<7?'#6E6670':'#9A949E',r:t<7?12:8,vy:-24-(t<7?30:0),max:3.4,vx:rnd(-6,6)});
  for(let i=BOMBS.length-1;i>=0;i--){const b=BOMBS[i];b.vy+=170*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.life+=dt;if(b.y>b.floor||b.life>4){BOMBS.splice(i,1);puff(b.x,b.y,{c:'#6E6670',r:5,max:1});}}
  if(K.autoErupt===undefined)K.autoErupt=40;K.autoErupt-=dt;if(K.autoErupt<0){K.autoErupt=45+Math.random()*30;for(let i=0;i<10;i++)puff(VX+rnd(-30,30),VTOP,{c:'#7E7680',r:10,vy:-50,max:3});}});
function erupt(){act('volcano');K.shake=7;S2.rumble();
  for(let i=0;i<46;i++)BOMBS.push({x:VX+rnd(-40,40),y:VTOP,vx:rnd(-160,160),vy:rnd(-260,-120),life:0,floor:VTOP+rnd(120,560),r:rnd(4,9)});
  for(let i=0;i<24;i++)puff(VX+rnd(-40,40),VTOP,{c:'#5E5660',r:rnd(10,18),vy:rnd(-80,-40),vx:rnd(-20,20),max:4});
  later(1.2,()=>{act('trex');S2.roarT();});}
K.TOP.push(()=>{for(const b of BOMBS){if(!inV(b.x-10,b.y-10,b.x+10,b.y+10))continue;circ(b.x,b.y,b.r,'#FF7A2A');circ(b.x-b.r*0.3,b.y-b.r*0.3,b.r*0.45,'#FFD05A');LIGHTS.push(b.x,b.y,b.r*5,'#FF7A2A');}});
/* jungle plants */
const JUNGLE=[];
for(let i=0;i<400&&JUNGLE.length<46;i++){const x=1720+sr()*1060,y=30+sr()*530;
  if(near(x,y,[[2010,330,90],[2420,380,90],[1830,420,60],[2200,470,70],[2620,440,50],[1760,560,40],[2105,330,30]],0))continue;
  if(JUNGLE.some(t=>Math.hypot(x-t[0],y-t[1])<38))continue;JUNGLE.push([x,y,0.8+sr()*0.5,sr()<0.5?0:1]);}
function cycad(x,y,s){if(ST.zoom<0.75){rr(x-3*s,y-26*s,6*s,26*s,2,'#8A6A3A');ell(x,y-28*s,22*s,9*s,'#4CAF50');return;}const T=TT(),sw=Math.sin(T+x)*1.5;ell(x+4,y+1,14*s,4*s,'rgba(20,60,20,.22)');
  rr(x-3*s,y-26*s,6*s,26*s,3,'#8A6A3A');for(let k=0;k<4;k++)ln('#6E522E',1,x-3*s,y-6*s-k*6*s,x+3*s,y-8*s-k*6*s);
  for(let k=0;k<7;k++){const a=-Math.PI+k/6*Math.PI;g.save();g.translate(x,y-26*s);g.rotate(a+sw*0.02);ell(14*s,0,15*s,4*s,k%2?'#3E9A45':'#4CAF50');g.restore();}}
function fern(x,y,s){if(ST.zoom<0.75){ell(x,y-6*s,13*s,7*s,'#4C9E3E');return;}ell(x,y+1,14*s,4*s,'rgba(20,60,20,.2)');for(let k=0;k<5;k++){const a=-Math.PI*0.85+k/4*Math.PI*0.7;g.save();g.translate(x,y);g.rotate(a);ell(12*s,0,13*s,3.5*s,k%2?'#5DB04A':'#4C9E3E');g.restore();}}
JUNGLE.forEach(([x,y,s,k])=>S(y,[x-30,y-60,x+30,y+5],()=>k?cycad(x,y,s):fern(x,y,s)));
S(560,[1700,520,1770,565],()=>{rr(1733,532,4,30,1,'#7A4E33');sign(1735,532,62,16,SIGN2.dino[li()],'#8A5A3B','#FFE9C2');hit('dinovalley',1700,520,1770,565);});
/* Brachiosaurus eating from a tall tree */
S(332,[1900,110,2150,340],()=>{const T=TT(),t=fx('brachio'),x=2010,y=330,c='#86A9D6',cd=shade(c,-0.15);
  // tall tree
  rr(2101,180,10,150,3,'#7A4E33');circ(2106,170,30,'#3E9A45');circ(2088,182,20,'#4CAF50');circ(2124,182,20,'#4CAF50');circ(2100,160,12,'#69C45A');
  ell(x-4,y+1,60,8,'rgba(20,60,20,.2)');
  g.fillStyle=c;g.beginPath();g.moveTo(x-40,y-62);g.quadraticCurveTo(x-80,y-50,x-112,y-20+Math.sin(T*1.5)*4);g.quadraticCurveTo(x-78,y-36,x-36,y-40);g.fill();
  [[-28,cd],[18,cd]].forEach(([lx,cc])=>rr(x+lx+6,y-46,13,46,5,cc));
  ell(x,y-60,50,27,c);ell(x+4,y-48,36,12,shade(c,0.25));[[-18,-70],[0,-76],[16,-66],[-30,-60]].forEach(([sx,sy])=>circ(x+sx,y+sy,4,cd));
  [[-28,c],[18,c]].forEach(([lx,cc])=>{rr(x+lx,y-44,14,44,5,cc);rr(x+lx-1,y-4,16,5,2,shade(c,-0.3));});
  const reach=t<3?Math.sin(t/3*Math.PI)*12:0,sw=Math.sin(T*0.8)*5;
  const P0=[x+32,y-68],P1=[x+72,y-118],P2=[x+70+sw+reach,y-176-reach*0.5];
  for(let k=0;k<=24;k++){const u=k/24,a=(1-u)*(1-u),b=2*(1-u)*u,d=u*u,px=a*P0[0]+b*P1[0]+d*P2[0],py=a*P0[1]+b*P1[1]+d*P2[1];circ(px,py,15-u*7,c);}
  const hx=P2[0],hy=P2[1],chew=Math.sin(T*8)*1.5;ell(hx+8,hy,15,9,c);ell(hx+18,hy+3+chew*0.3,8,4,shade(c,0.12));circ(hx+6,hy-4,2,'#222');circ(hx+6.6,hy-4.6,0.7,'#FFF');
  g.strokeStyle='#2B2233';g.lineWidth=1.2;g.beginPath();g.arc(hx+16,hy+3,5,0.2,1.2);g.stroke();
  if(Math.random()<0.02)PARTS.push({x:hx+22,y:hy,vx:rnd(-8,8),vy:rnd(-5,5),life:0,max:1.6,k:'leaf',r:3,c:'#4CAF50',gr:40});
  hit('brachio',x-90,hy-14,hx+28,y,{small:1});});
/* T. rex pacing */
S(382,[2330,280,2520,390],()=>{const T=TT(),t=fx('trex'),wx=2420+Math.sin(T*0.25)*60,f=Math.cos(T*0.25)>0?1:-1,x=wx,y=382,c='#5DAE5A',cd=shade(c,-0.2);
  const roarO=t<2.5?Math.min(1,t*4)*(t>2?(2.5-t)*2:1):0,step=Math.sin(T*3)*(roarO?0:1);
  ell(x,y+1,34,6,'rgba(20,60,20,.2)');
  flip(x,y,f,()=>{
    poly(c,-14,-54,-74,-36+Math.sin(T*2)*3,-12,-36);
    g.save();g.translate(4,-36);g.rotate(-step*0.25);ell(0,8,9,14,cd);rr(-4,16,8,18,3,cd);rr(-6,32,18,5,2,cd);g.restore();
    ell(0,-48,30,21,c);ell(6,-40,20,11,shade(c,0.25));
    g.save();g.translate(-6,-36);g.rotate(step*0.25);ell(0,8,10,15,c);rr(-4,18,9,18,3,c);rr(-6,32,20,5,2,cd);g.restore();
    ln(cd,3,22,-48,30,-40);ln(cd,3,18,-46,24,-38);
    g.save();g.translate(22,-70);rr(0,-14,40,22,9,c);rr(28,-12,10,6,3,shade(c,0.1));circ(14,-6,3.2,'#FFF');circ(15,-6,1.8,'#222');ln(cd,2,10,-12,18,-11);
    g.save();g.translate(4,6);g.rotate(roarO*0.6);rr(0,-2,34,9,5,c);for(let k=0;k<4;k++)poly('#FFFFFF',8+k*6,-2,11+k*6,-2,9.5+k*6,2);g.restore();
    for(let k=0;k<4;k++)poly('#FFFFFF',12+k*6,8,15+k*6,8,13.5+k*6,4);if(roarO>0.3)ell(30,10,8,6*roarO,'#8A2A2A');g.restore();});
  if(t<1.6&&Math.random()<0.15)textP(x+f*50,y-110,'ROAR!','#FFFFFF',16);
  hit('trex',x-40,y-96,x+44,y,{small:1});});
/* Triceratops */
S(422,[1760,370,1890,430],()=>{const T=TT(),t=fx('trike'),dx=t<2?Math.sin(t/2*Math.PI)*36:0,x=1820+dx,y=422,c='#E8964A',cd=shade(c,-0.18);
  ell(x,y+1,34,5,'rgba(20,60,20,.2)');
  flip(x,y,1,()=>{poly(c,-26,-28,-50,-16,-24,-18);[-20,-10,12,22].forEach((lx,i)=>rr(lx-4,-14,9,14,3,i%2?c:cd));
    ell(0,-24,30,17,c);ell(2,-17,22,7,shade(c,0.25));
    circ(28,-32,19,'#D9783A');for(let k=0;k<7;k++){const a=-Math.PI*0.95+k/6*Math.PI*0.9;circ(28+Math.cos(a)*17,-32+Math.sin(a)*17,2.6,'#F2C24A');}
    ell(40,-22,14,10,c);poly('#FFF6E0',36,-30,58,-46,40,-26);poly('#FFF6E0',44,-28,62,-38,46,-23);poly('#FFF6E0',50,-20,56,-27,52,-18);
    poly(cd,52,-18,58,-15,51,-13);circ(41,-25,2,'#222');circ(41.6,-25.6,0.7,'#FFF');});
  if(t<0.3&&Math.random()<0.5)puff(x+60,y-12,{c:'#FFFFFF',r:3,max:0.8});
  hit('trike',x-48,y-52,x+62,y,{small:1});});
/* Stegosaurus */
S(472,[2140,420,2270,480],()=>{const T=TT(),t=fx('stego'),x=2200,y=472,c='#9A86D6',cd=shade(c,-0.18),sw=t<2?Math.sin(t*10)*0.5:Math.sin(T)*0.1;
  ell(x,y+1,40,5,'rgba(20,60,20,.2)');
  flip(x,y,-1,()=>{g.save();g.translate(-28,-22);g.rotate(sw);poly(c,0,-6,-40,2,0,6);poly('#F2E6C9',-30,-1,-38,-12,-33,0);poly('#F2E6C9',-34,1,-44,-6,-37,2);poly('#F2E6C9',-30,3,-36,12,-33,3);g.restore();
    [-18,-8,12,22].forEach((lx,i)=>rr(lx-4,-16,9,16,3,i%2?c:cd));
    for(let k=0;k<6;k++){const px=-22+k*9,py=-36-Math.sin((k+0.5)/6*Math.PI)*10;poly(k%2?'#F2A33A':'#E8843A',px-6,py+8,px,py-10,px+6,py+8);}
    ell(0,-26,30,17,c);ell(2,-18,22,6,shade(c,0.25));ell(34,-16,10,7,c);circ(38,-18,1.6,'#222');});
  hit('stego',x-50,y-50,x+50,y,{small:1});});
/* pterosaur circling the volcano */
K.TOP.push(()=>{const T=TT(),t=fx('ptera'),a=T*(t<4?0.8:0.4),x=VX+Math.cos(a)*300,y=-430+Math.sin(a)*110,fl=Math.sin(T*(t<4?14:5));
  if(!inV(x-50,y-30,x+50,y+30))return;
  g.save();g.translate(x,y);g.scale(-Math.sin(a)>0?1:-1,1);
  poly('#C9653E',-2,-2,-42,-10-fl*16,-30,4);poly('#C9653E',2,-2,42,-10-fl*16,30,4);poly('#E8956A',-2,-2,-42,-10-fl*16,-24,-4-fl*8);
  ell(0,0,10,5,'#D9734A');circ(10,-4,5,'#D9734A');poly('#D9734A',8,-8,-6,-14,6,-4);poly('#F2C24A',13,-5,28,-2,13,-1);circ(11,-5,1,'#222');g.restore();
  hit('ptera',x-40,y-22,x+40,y+12,{moving:1,small:1});});
/* nest with eggs; one hatches */
S(450,[2590,410,2660,460],()=>{const T=TT(),t=fx('babydino'),open=t<9;
  ell(2622,448,30,10,'#8A6A3A');ell(2622,445,24,7,'#6E522E');
  [[2610,438],[2634,438]].forEach(([ex,ey])=>{ell(ex,ey,7,9,'#F4ECD8');circ(ex-2,ey-3,1.4,'#D9C7AE');circ(ex+2,ey+2,1.2,'#D9C7AE');});
  if(open){const up=Math.min(1,t*2);ell(2622,442,8,5,'#F4ECD8');poly('#F4ECD8',2614,436,2617,430,2620,435,2624,429,2627,435,2630,431,2630,438);
    g.save();g.translate(2622,436-up*8);circ(0,-4,7,'#7ED957');circ(3,-6,1.8,'#FFF');circ(3.4,-6,1,'#222');ln('#2B2233',0.9,2,-1,6,-1);poly('#F4ECD8',-6,-10,0,-14,6,-10,4,-7,-4,-7);g.restore();
    hit('babydino',2610,420,2636,446,{small:1});}
  else{ell(2622,436,7,9,'#F4ECD8');circ(2620,433,1.4,'#D9C7AE');const wob=Math.sin(T*9)*(Math.sin(T*0.9)>0.8?0.2:0);g.save();g.translate(2622,436);g.rotate(wob);g.restore();}
  hit('nest',2592,422,2652,458);});

/* =============================================================
   EAST: deep forest
============================================================= */
const FOREST2=[];
const SPOTS=[[1450,290,95],[1335,620,50],[1600,120,40],[1290,430,50],[1620,560,40],[1240,180,30],[1500,720,45],[1385,742,26],[1560,420,60]];
for(let i=0;i<900&&FOREST2.length<78;i++){const x=1215+sr()*480,y=-250+sr()*1015;if(near(x,y,SPOTS,0))continue;
  if(FOREST2.some(t=>Math.hypot(x-t[0],y-t[1])<36))continue;FOREST2.push([x,y,0.9+sr()*0.4,y<200||sr()<0.35?1:0,TCOL[sr()*4|0]]);}
FOREST2.forEach(t=>S(t[1],[t[0]-25,t[1]-55,t[0]+25,t[1]+5],()=>tree(t[0],t[1],t[2],t[3],t[3]?'#2F8F5B':t[4])));
const MUSH=[];for(let i=0;i<24;i++){const x=1220+sr()*470,y=-200+sr()*960;if(!near(x,y,SPOTS,0))MUSH.push([x,y]);}
MUSH.forEach(([x,y])=>S(y,[x-6,y-10,x+6,y+2],()=>{if(ST.zoom<0.75)return;rr(x-1.6,y-6,3.2,6,1,'#F6EAD8');g.fillStyle='#E8443A';g.beginPath();g.arc(x,y-6,5,Math.PI,TAU);g.fill();circ(x-2,y-8,0.9,'#FFF');circ(x+2,y-9,0.8,'#FFF');}));
/* pond with beaver dam */
S(300,[1350,240,1550,330],()=>{const T=TT(),t=fx('beaver');
  ell(1450,292,92,40,'#EAD9A2');ell(1450,290,84,34,'#5BBDEE');ell(1440,286,50,16,'rgba(255,255,255,.18)');
  [[1400,300],[1480,280]].forEach(([x,y])=>{ell(x,y,11,4.5,'#3E9A45');circ(x-3,y-2,2.4,'#FF8FB1');});
  for(let k=0;k<8;k++)ln(k%2?'#8A5A3B':'#7A4E33',4,1512+k*3,322-k*7,1546-k*2,312-k*7);
  const x=1525,y=286,sl=t<1?Math.sin(t*Math.PI*3):0;
  g.save();g.translate(x,y);ell(-14,2+sl*-4,10,4,'#3A2A20',sl*0.5);ell(0,-4,12,8,'#8A5A3B');circ(10,-9,6,'#8A5A3B');circ(7,-14,2,'#8A5A3B');circ(12,-10,1.1,'#222');
  rr(13,-7,3,4,1,'#FFF6E0');circ(15.5,-9,1.2,'#3A2A20');g.restore();
  if(t<0.5&&Math.random()<0.6)PARTS.push({x:x-14,y:y,vx:rnd(-30,30),vy:rnd(-60,-20),life:0,max:0.7,k:'drop',r:4,c:'#FFFFFF',gr:150});
  hit('beaver',x-26,y-20,x+20,y+6,{small:1});hit('pond',1366,256,1534,326);});
/* tree house */
S(622,[1290,500,1380,626],()=>{const T=TT(),t=fx('treehouse'),x=1335,y=622;
  ell(x+6,y+1,30,7,'rgba(20,70,20,.22)');rr(x-8,y-90,16,90,4,'#8A5A3B');
  circ(x-26,y-110,24,'#45A048');circ(x+26,y-110,24,'#45A048');circ(x,y-128,30,'#5CBF52');
  rr(x-30,y-96,60,6,2,'#9A6440');rr(x-24,y-128,48,34,3,'#C48A5A');poly('#C0473A',x-30,y-126,x,y-146,x+30,y-126);
  rr(x-6,y-120,12,12,2,'#5A3A2E');kid(x+(t<4?0:0),y-97,'#FF8A3D',SKIN[1],HAIR[0],1.2);if(t<4&&Math.sin(t*10)>0)rr(x+5,y-116,2,6,1,SKIN[1]);
  ln('#C9A040',1.2,x+18,y-90,x+18,y-4);ln('#C9A040',1.2,x+26,y-90,x+26,y-4);for(let yy=y-84;yy<y;yy+=10)ln('#C9A040',1.4,x+18,yy,x+26,yy);
  hit('treehouse',x-34,y-150,x+34,y);});
S(122,[1570,70,1640,128],()=>{const T=TT(),t=fx('wolf'),x=1600,y=124,howl=t<2.5?1:0;
  ell(x,y+1,16,4,'rgba(20,60,20,.2)');poly('#7E889C',x-20,y+2,x-6,y-14,x+12,y-6,x+16,y+2);
  flip(x,y,1,()=>{ell(-12,-6,8,4,'#8E96A8',0.6);ell(0,-12,10,12,'#8E96A8');ell(2,-9,5,8,'#D9DDE6');
    g.save();g.translate(2,-24);g.rotate(howl?-0.6:0);circ(0,0,7,'#8E96A8');poly('#8E96A8',-5,-4,-3,-13,1,-6);poly('#8E96A8',3,-5,6,-13,7,-4);
    ell(7,2,5,3,'#8E96A8');circ(11,1.6,1.3,'#222');circ(2,-2,1,'#E8C24A');if(howl)ell(9,4,2,1.6,'#5A2A2A');g.restore();
    rr(-4,-2,4,4,1.5,'#7E889C');rr(4,-2,4,4,1.5,'#7E889C');});
  if(howl&&ST.NIGHT>0.3)LIGHTS.push(x,y-40,60,'#D9E6FF');
  hit('wolf',x-18,y-36,x+18,y+2,{small:1});});
S(432,[1250,400,1340,440],()=>{const T=TT(),t=fx('boar'),run=t<2?Math.sin(t*12)*2:0,x=1290+(t<2?t*12:0),y=432;
  flip(x,y,1,()=>{ell(0,1,18,4,'rgba(20,60,20,.2)');[-10,-5,6,11].forEach(lx=>rr(lx-1.5,-8+(lx>0?run:-run)*0.3,3,8,1,'#3A2A20'));
    ell(0,-12,16,9,'#5A4030');for(let k=0;k<6;k++)poly('#3A2A20',-10+k*4,-19,-8+k*4,-24,-6+k*4,-19);
    ell(15,-9,8,6,'#5A4030');ell(22,-8,3.4,3,'#8A6A5A');poly('#FFF6E0',18,-6,21,-12,20,-5);circ(16,-12,1.1,'#222');poly('#5A4030',10,-14,12,-20,14,-14);});
  for(let k=0;k<2;k++){const px=x-30-k*16,py=y+2+(k?3:0),j=t<2?Math.abs(Math.sin(t*10+k))*4:0;
    flip(px,py-j,1,()=>{ell(0,-5,8,4.5,'#B08A5E');for(let s=0;s<3;s++)ln('#E6D3A8',1,-5+s*4,-9,-5+s*4,-1);ell(7,-4,3.6,3,'#B08A5E');circ(7,-6,0.8,'#222');});}
  hit('boar',x-56,y-28,x+28,y+4,{small:1});});
S(566,[1590,530,1650,570],()=>{const T=TT(),t=fx('badger'),out=t<6;
  ell(1620,566,24,8,'#8A6A4A');ell(1620,563,13,6,'#3A2A20');
  if(out){const up=Math.min(1,t*2)*(t>5?(6-t):1);g.save();g.beginPath();g.rect(1595,520,50,46);g.clip();g.translate(1620,566-up*14);
    ell(0,-4,12,8,'#9AA0AA');circ(0,-12,7,'#FFFFFF');rr(-1.4,-19,2.8,14,1,'#2B2233');rr(-6,-17,2.6,9,1,'#2B2233');rr(3.4,-17,2.6,9,1,'#2B2233');
    circ(-3.5,-12,1,'#FFF');circ(3.5,-12,1,'#FFF');circ(0,-6,1.4,'#222');g.restore();}
  else if((T%5)<0.6){circ(1617,562,1,'#FFF');circ(1623,562,1,'#FFF');}
  hit('badger',1596,540,1644,572,{small:1});});
S(190,[1225,120,1265,195],()=>{const T=TT(),t=fx('woodpecker'),peck=t<1.5||((T%4)<0.6)?Math.sin(T*40)*2:0;
  tree(1240,190,1.15,0,'#45A048');const x=1245,y=168;
  g.save();g.translate(x+peck*0.5,y);ell(0,0,4,7,'#2B2233');ell(1,1,2.6,5,'#FFFFFF');circ(1,-8,3.6,'#2B2233');circ(1,-10,2.6,'#E8443A');poly('#5A5A5A',3,-8,8+peck,-7.5,3,-6.5);circ(1.5,-8.5,0.7,'#FFF');rr(-2,6,2,6,1,'#2B2233');g.restore();
  if(t<1.5&&Math.random()<0.3)PARTS.push({x:x+6,y:y-8,vx:rnd(10,30),vy:rnd(-20,0),life:0,max:0.8,k:'drop',r:3,c:'#C8954E',gr:120});
  hit('woodpecker',x-8,y-16,x+12,y+12,{small:1});});
S(722,[1460,640,1550,726],()=>{const T=TT(),t=fx('stag'),x=1500,y=722,lift=t<2.5?1:0;
  ell(x,y+1,18,4,'rgba(20,60,20,.2)');g.save();g.translate(x,y);
  [[-10,0],[-6,1],[7,0],[11,1]].forEach(([lx,o])=>rr(lx-1.4,-16+o,3,16-o,1,'#7A5235'));
  ell(0,-21,16,8,'#9A6440');ell(-15,-22,3,2.4,'#F6E7D2');
  g.save();g.translate(13,-26);g.rotate(-lift*0.4);rr(-2.5,-14,7,16,3,'#9A6440');ell(4,-16,7,4.5,'#9A6440');circ(9,-16,1.4,'#2B1B12');circ(5,-17.5,1,'#2B1B12');
  ell(-1,-20,2.2,4,'#9A6440',-0.4);
  g.strokeStyle='#C9A87A';g.lineWidth=1.8;g.lineCap='round';g.beginPath();g.moveTo(2,-20);g.lineTo(-2,-34);g.lineTo(-8,-42);g.moveTo(-2,-34);g.lineTo(4,-42);g.moveTo(0,-28);g.lineTo(-7,-31);
  g.moveTo(5,-20);g.lineTo(10,-33);g.lineTo(8,-42);g.moveTo(10,-33);g.lineTo(16,-39);g.stroke();g.lineCap='butt';g.restore();g.restore();
  hit('stag',x-20,y-70,x+30,y,{small:1});});
S(742,[1365,722,1405,746],()=>{const T=TT(),t=fx('snail'),out=t<6||(T%9)<3,x=1385,y=742;
  ell(x,y-2,16,6,'#5DB04A',0.2);
  if(out){ell(x+6,y-4,9,3,'#D9C7AE');ln('#B8A88E',1,x+12,y-6,x+15,y-13);ln('#B8A88E',1,x+10,y-6,x+11,y-13);circ(x+15,y-13,1.2,'#2B2233');circ(x+11,y-13,1.2,'#2B2233');}
  circ(x-1,y-8,7,'#D9864A');g.strokeStyle='#A8582A';g.lineWidth=1.2;g.beginPath();for(let a=0;a<TAU*2;a+=0.3){const r=6-a*0.4;g.lineTo(x-1+Math.cos(a)*r,y-8+Math.sin(a)*r);}g.stroke();
  hit('snail',x-12,y-18,x+18,y+2,{small:1});});
const BFLY=[[1560,420,'#FF8FB1'],[1580,440,'#5DA9FF'],[1545,445,'#FFC928']];
K.DYN.push(L=>{if(!inV(1480,340,1650,500))return;const T=TT(),t=fx('butterfly');
  BFLY.forEach(([cx,cy,c],i)=>{const sp=t<3?3:1,x=cx+Math.sin(T*0.7*sp+i*2)*40+(t<3?Math.sin(t)*20:0),y=cy+Math.sin(T*1.1*sp+i)*24-(t<3?t*20:0),fl=Math.abs(Math.sin(T*12+i));
    L.push({y:y+30,f:()=>{g.save();g.translate(x,y);g.scale(fl*0.8+0.2,1);ell(-4,-3,5,4,c);ell(4,-3,5,4,c);ell(-3,2,3.4,3,shade(c,-0.15));ell(3,2,3.4,3,shade(c,-0.15));g.restore();
      ln('#2B2233',1.2,x,y-4,x,y+4);hit('butterfly',x-9,y-9,x+9,y+8,{moving:1,small:1});}});});
  if(!K._fl){K._fl=1;}});
S(500,[1530,470,1590,500],()=>{[[1540,488,'#FFFFFF'],[1556,494,'#FFE14D'],[1572,486,'#FF8FB1'],[1562,478,'#B78CFF']].forEach(([x,y,c])=>{ln('#4C9E3E',1,x,y,x,y+8);circ(x,y,3,c);circ(x,y,1.2,'#FFC928');});});

/* =============================================================
   EAST: campsite and airport
============================================================= */
const TENTS=[[1330,930,'#FF8A3D'],[1470,898,'#3CC8F5'],[1700,940,'#7ED957']];
TENTS.forEach(([x,y,c])=>S(y,[x-34,y-40,x+34,y+4],()=>{ell(x+4,y+1,34,6,'rgba(20,60,20,.2)');poly(shade(c,-0.18),x-32,y,x,y-38,x+4,y-38,x+36,y-4);poly(c,x-32,y,x,y-38,x+28,y);
  poly('#3A2A30',x-8,y,x,y-20,x+8,y);ln('#7E889C',1,x,y-38,x,y-44);poly('#FFC928',x,y-44,x+8,y-41,x,y-38);hit('tent',x-34,y-44,x+36,y);}));
S(1062,[1480,1010,1570,1070],()=>{const T=TT(),t=fx('campfire'),x=1525,y=1060,big=t<3?1.5:1;
  for(let k=0;k<8;k++){const a=k/8*TAU;ell(x+Math.cos(a)*18,y-4+Math.sin(a)*7,5,3.6,'#9AA4B8');}
  ln('#7A4E33',5,x-12,y-2,x+12,y-8);ln('#6E4228',5,x-12,y-8,x+12,y-2);
  for(let k=0;k<3;k++){const fl=Math.sin(T*12+k*2)*3,h=(16+k*4)*big;poly(['#FF5A2A','#FF9A2A','#FFE14D'][k],x-9+k*3,y-6,x+fl,y-6-h+k*4,x+9-k*3,y-6);}
  LIGHTS.push(x,y-14,ST.NIGHT>0.3?110:40,'#FF9A3A');
  if(Math.random()<(t<3?0.5:0.06))PARTS.push({x:x+rnd(-5,5),y:y-20,vx:rnd(-12,12),vy:rnd(-60,-30),life:0,max:1,k:'drop',r:2.6,c:'#FFD05A',gr:-10});
  [[x-34,y+2,0],[x+34,y,2],[x,y+20,1]].forEach(([kx,ky,i])=>{kid(kx,ky,['#B78CFF','#FF5A5F','#3CC8F5'][i],SKIN[i],HAIR[i],1.1);
    ln('#8A5A3B',1,kx+(kx<x?4:-4),ky-8,kx+(kx<x?16:-16),ky-14);circ(kx+(kx<x?17:-17),ky-15,2.2,'#FFF6E0');});
  hit('campfire',x-24,y-30,x+24,y+4);});
S(1135,[1730,1080,1840,1140],()=>{const x=1740,y=1135;ell(x+48,y+1,50,5,'rgba(0,0,0,.18)');rr(x,y-44,90,38,[14,14,4,4],'#FFFFFF');rr(x,y-22,90,6,0,'#3CC8F5');
  win(x+10,y-38,22,12);rr(x+56,y-38,16,30,3,'#C9CED8');circ(x+68,y-22,1.2,'#555');ln('#555',2,x+90,y-10,x+102,y-6);
  for(const wx of [x+26])wheel(wx,y-5,6,0);hit('caravan',x-2,y-48,x+104,y);});
S(1180,[1300,1150,1390,1185],()=>{rr(1305,1160,70,8,2,'#B07A4E');rr(1305,1172,70,4,2,'#9A6440');rr(1310,1168,4,14,1,'#7A5235');rr(1366,1168,4,14,1,'#7A5235');
  rr(1325,1154,20,5,1,'#FFFFFF');for(let k=0;k<4;k++)rr(1325+k*5,1154,2.5,5,0,'#E8443A');circ(1355,1157,3,'#E8443A');});
S(855,[1530,820,1600,860],()=>{rr(1563,832,4,24,1,'#7A4E33');sign(1565,832,64,15,SIGN2.camp[li()],'#3DAA4A','#FFFFFF');hit('campsite',1250,840,1880,1225);});
at('campsite',[1250,840,1880,1225]);
/* airport: terminal, tower, hangar, a plane that takes off and flies a loop */
S(940,[1990,790,2280,942],()=>{const x=2000,y=880,w=260,d=60,h=72,Fy=flatB(x,y,w,d,h,'#E9EEF5','#C9D0DB','#3B7DE2');
  rr(x+10,Fy+26,w-20,28,3,'#8ED2F4');for(let k=0;k<9;k++){g.fillStyle='#FFFFFF';g.fillRect(x+10+k*30,Fy+26,3,28);}poly('rgba(255,255,255,.35)',x+30,Fy+54,x+70,Fy+26,x+90,Fy+26,x+50,Fy+54);
  for(let k=0;k<8;k++)K.LIT.push(x+14+k*30,Fy+28,24,24);
  sign(x+w/2,Fy+12,120,16,SIGN2.airport[li()],'#3B7DE2','#FFFFFF');
  rr(x+w/2-14,y+d-22,28,22,2,'#BFE6FA');ln('#9AA4B8',1.4,x+w/2,y+d-22,x+w/2,y+d);
  hit('airport',x-4,y-h,x+w+4,y+d);});
S(1000,[2310,820,2360,1002],()=>{const T=TT(),x=2335;rr(x-8,880,16,120,3,'#E9EEF5');rr(x-5,880,4,120,0,'#D3DAE5');
  poly('#3B4D6B',x-20,862,x+20,862,x+16,884,x-16,884);rr(x-18,866,36,14,3,'#8ED2F4');rr(x-22,858,44,6,2,'#E9EEF5');ln('#9AA4B8',1.4,x,858,x,838);
  const on=Math.sin(T*4)>0;circ(x,836,3,on?'#FF3B30':'#8A3A3A');if(on)LIGHTS.push(x,836,30,'#FF3B30');hit('airport',x-22,834,x+22,1000);});
S(970,[2470,860,2680,972],()=>{const x=2480,y=900,w=190,h=70;shadowB2(x,y+70,w);rr(x,y,w,70,[0,0,3,3],'#B9C1CC');g.fillStyle='#A3ACBA';g.beginPath();g.ellipse(x+w/2,y,w/2,30,0,Math.PI,TAU);g.fill();
  g.strokeStyle='#8E98AE';g.lineWidth=1.4;g.beginPath();for(let k=1;k<8;k++){const a=Math.PI+k/8*Math.PI;g.moveTo(x+w/2+Math.cos(a)*w/2,y+Math.sin(a)*30);g.lineTo(x+w/2+Math.cos(a)*w/2,y);}g.stroke();
  rr(x+30,y+18,w-60,52,2,'#3A3F52');rr(x+30,y+18,w-60,8,0,'#5F6679');hit('airport',x,y-30,x+w,y+70);});
function shadowB2(x,y,w){rr(x+5,y-5,w+7,10,5,'rgba(20,60,20,.2)');}
const PLANE={t:-1};
const FLIGHT=(()=>{const P=[[2700,1050],[2780,600],[2600,0],[2000,-500],[1000,-650],[200,-300],[60,500],[300,1500],[900,2000],[1500,1900],[1900,1500],[1850,1200],[1960,1136]],out=[];
  for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
    for(let k=0;k<12;k++){const t=k/12,t2=t*t,t3=t2*t;out.push([0,1].map(j=>0.5*((2*p1[j])+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)));}}
  out.push(P[P.length-1]);return out;})();
function planeState(){const t=PLANE.t,GATE=[2150,1030];
  if(t<0)return {x:GATE[0],y:GATE[1],f:1,alt:0,air:0};
  if(t<3){const u=sm(t/3);return {x:GATE[0]+(2000-GATE[0])*u,y:GATE[1]+(1140-GATE[1])*u,f:-1,alt:0,air:0};}
  if(t<4)return {x:2000,y:1140,f:1,alt:0,air:0};
  if(t<8){const u=(t-4)/4,x=2000+700*u*u,alt=u>0.55?((u-0.55)/0.45)*90:0;return {x,y:1140-alt,f:1,alt,air:alt>2};}
  if(t<26){const u=(t-8)/18,f=u*(FLIGHT.length-1),i=Math.min(FLIGHT.length-2,f|0),k=f-i,a=FLIGHT[i],b=FLIGHT[i+1];
    return {x:a[0]+(b[0]-a[0])*k,y:a[1]+(b[1]-a[1])*k,f:b[0]>=a[0]?1:-1,alt:u>0.9?(1-u)*900:90,air:1,big:1};}
  if(t<30){const u=sm((t-26)/4);return {x:1960+(2400-1960)*u,y:1140,f:1,alt:0,air:0};}
  if(t<33){const u=sm((t-30)/3);return {x:2400+(GATE[0]-2400)*u,y:1140+(GATE[1]-1140)*u,f:-1,alt:0,air:0};}
  PLANE.t=-1;return {x:GATE[0],y:GATE[1],f:1,alt:0,air:0};}
function drawPlane(p){const s=p.big?1.5:1;g.save();g.translate(p.x,p.y);g.scale(p.f*s,s);
  if(!p.air)ell(0,1,40,5,'rgba(0,0,0,.2)');
  poly('#3B7DE2',-34,-12,-44,-34,-36,-34,-24,-12);ell(0,-12,40,9,'#FFFFFF');poly('#FFFFFF',34,-18,46,-12,34,-5);
  rr(-30,-11,66,3,1,'#3B7DE2');for(let k=0;k<8;k++)circ(-20+k*7,-15,1.6,'#5A7FB0');rr(30,-18,7,5,2,'#5A7FB0');
  poly('#C9D0DB',-6,-8,14,-8,-14,10,-22,10);rr(-4,-4,14,6,3,'#9AA4B8');
  if(!p.air){ln('#555',1.4,-10,-4,-10,0);ln('#555',1.4,20,-4,20,0);circ(-10,0,2.6,'#2B2D3A');circ(20,0,2.6,'#2B2D3A');}
  g.restore();
  if(ST.NIGHT>0.2){const on=Math.sin(TT()*6)>0;if(on)LIGHTS.push(p.x-20*p.f*s,p.y-30*s,24,'#FF3B30');}
  hit('plane',p.x-46*s,p.y-36*s,p.x+46*s,p.y+12*s,{moving:1,small:1});}
K.UPDATE.push(dt=>{if(PLANE.t>=0)PLANE.t+=dt;});
K.DYN.push(L=>{const p=planeState();if(p.air&&p.big)return;L.push({y:p.air?p.y+p.alt:p.y,f:()=>drawPlane(p)});});
K.TOP.push(()=>{const p=planeState();if(p.air&&p.big){if(p.alt>40)ell(p.x+30,p.y+120,30,5,'rgba(0,0,0,.08)');drawPlane(p);}});

/* =============================================================
   SOUTH-EAST: castle with dragon, horses, sunflowers
============================================================= */
S(1532,[1960,1300,2360,1560],()=>{const T=TT(),t=fx('castle'),open=t<1?sm(t):t<8?1:t<9?1-sm(t-8):0,x=2020,y=1460,w=280;
  // keep
  rr(2130,1330,60,110,[2,2,0,0],'#BFB8AC');for(let k=0;k<4;k++)rr(2130+k*16,1322,10,10,1,'#BFB8AC');
  win(2150,1350,20,24,'#9A9286');rr(2124,1308,72,6,2,'#2F5FD0');poly('#2F5FD0',2126,1310,2160,1268,2194,1310);
  // walls
  rr(x,y-50,w,70,[0,0,3,3],'#D3CDC2');g.fillStyle='rgba(0,0,0,.06)';for(let k=0;k<6;k++)g.fillRect(x,y-44+k*12,w,1.5);
  for(let k=0;k<w;k+=20)rr(x+k,y-60,12,12,1,'#D3CDC2');
  // gate and drawbridge
  rr(x+w/2-22,y-26,44,46,[22,22,0,0],'#3A2A30');
  g.strokeStyle='#5A5A5A';g.lineWidth=2;g.beginPath();for(let k=0;k<5;k++){g.moveTo(x+w/2-16+k*8,y-22-open*30);g.lineTo(x+w/2-16+k*8,y+20-open*40);}g.stroke();
  if(open>0.5){kid(x+w/2,y+18,'#9AA4B8',SKIN[0],'#9AA4B8',1.4);rr(x+w/2-12,y+2,6,10,2,'#C0473A');ln('#C9CED8',1.4,x+w/2+8,y-6,x+w/2+8,y-22);
    if(Math.sin(T*8)>0)rr(x+w/2+5,y-8,2,6,1,SKIN[0]);hit('knight',x+w/2-12,y-12,x+w/2+12,y+20,{small:1});}
  const bh=44*(1-open);rr(x+w/2-22,y+20-bh*0+0,44,Math.max(4,44*open),2,'#9A6440');
  if(open<0.5)rr(x+w/2-22,y-24,44,bh,[22,22,0,0],'#9A6440');
  // towers
  [[x-10,1],[x+w-26,1]].forEach(([tx])=>{rr(tx,y-96,36,116,[3,3,3,3],'#C9C3B8');for(let k=0;k<3;k++)rr(tx+k*13,y-104,9,10,1,'#C9C3B8');
    poly('#C0473A',tx-4,y-104,tx+18,y-146,tx+40,y-104);ln('#555',1.2,tx+18,y-146,tx+18,y-160);poly('#FFC928',tx+18,y-160,tx+32+Math.sin(T*4+tx)*2,y-156,tx+18,y-152);
    win(tx+11,y-80,14,18,'#9A9286');});
  hit('castle',x-14,1266,x+w+14,y+20);
  // dragon on the keep
  const dt=fx('dragon'),fire=dt<2.5,dx=2160,dy=1300,flap=Math.sin(T*(fire?10:1.5))*(fire?0.5:0.15);
  g.save();g.translate(dx,dy);
  g.save();g.rotate(-0.3-flap);poly('#3E9A45',0,-6,-46,-40,-34,-16,-40,-6,-20,-4);poly('#7ED957',0,-6,-46,-40,-30,-14);g.restore();
  g.save();g.scale(-1,1);g.rotate(-0.3-flap);poly('#3E9A45',0,-6,-46,-40,-34,-16,-40,-6,-20,-4);poly('#7ED957',0,-6,-46,-40,-30,-14);g.restore();
  ell(0,-4,14,12,'#4CAF50');ell(0,0,8,8,'#FFE38A');ln('#4CAF50',4,-10,4,-24,10,-30,4);poly('#4CAF50',-30,4,-38,0,-32,10);
  circ(10,-20,9,'#4CAF50');ell(18,-17,7,5,'#4CAF50');poly('#F2E6C9',4,-27,2,-36,8,-28);poly('#F2E6C9',12,-28,14,-37,16,-27);
  circ(11,-23,2,'#FFF');circ(11.6,-23,1.1,'#222');circ(22,-18,0.9,'#2B2233');if(fire)ell(22,-14,3,2,'#8A2A2A');
  for(let k=0;k<4;k++)poly('#2E7A34',-6+k*4,-14+k*2,-4+k*4,-20+k*2,-2+k*4,-14+k*2);g.restore();
  if(fire&&dt>0.3){for(let k=0;k<3;k++)PARTS.push({x:dx+24,y:dy-14,vx:rnd(80,160),vy:rnd(-20,30),life:0,max:0.6,k:'drop',r:rnd(6,10),c:['#FF5A2A','#FF9A2A','#FFE14D'][k],gr:0});LIGHTS.push(dx+60,dy-10,90,'#FF8A2A');}
  hit('dragon',dx-30,dy-40,dx+30,dy+8,{small:1});});
S(1608,[1440,1360,1770,1612],()=>{const T=TT();
  for(let x=1440;x<=1770;x+=22){rr(x,1356,4,16,1,'#B07A4E');rr(x,1596,4,16,1,'#B07A4E');}rr(1440,1360,334,3,1,'#C48A5A');rr(1440,1600,334,3,1,'#C48A5A');
  for(let y=1360;y<=1600;y+=24){rr(1438,y,4,14,1,'#B07A4E');rr(1772,y,4,14,1,'#B07A4E');}
  gableB2(1460,1380,90,40,46,'#C0473A','#7A4A3A');});
function gableB2(x,y,w,d,h,wall,roof){const r=gableB(x,y,w,d,h,wall,roof);rr(x+w/2-14,y+d-30,28,30,1,'#3A2A30');ln('#FFFFFF',1.6,x+w/2-14,y+d-30,x+w/2+14,y+d);ln('#FFFFFF',1.6,x+w/2+14,y+d-30,x+w/2-14,y+d);return r;}
[[1600,1500,1,'#8A5A3B'],[1700,1560,-1,'#F2EDE4']].forEach(([hx,hy,f,c],i)=>S(hy,[hx-30,hy-40,hx+30,hy+4],()=>{const T=TT(),t=fx('horse'),hop=t<1.2?Math.abs(Math.sin(t*8))*8:0,graze=t>1.2&&Math.sin(T*0.4+i*2)>0.2;
  flip(hx,hy-hop,f,()=>{ell(0,hop+1,22,4,'rgba(0,0,0,.15)');[-13,-8,8,13].forEach(lx=>rr(lx-1.6,-14,3.2,14,1,shade(c,-0.2)));
    ell(0,-18,17,8,c);ln(shade(c,-0.35),3,-16,-20,-22,-10+Math.sin(T*2)*2);
    g.save();g.translate(13,-22);g.rotate(graze?1.1:-0.2);rr(-3,-16,8,18,4,c);ell(4,-18,8,4.6,c);circ(2,-20,1.2,'#222');ell(-1,-24,2,4,c,-0.3);
    for(let k=0;k<4;k++)ell(-3,-14+k*4,2.4,3,shade(c,-0.35));g.restore();});
  hit('horse',hx-24,hy-40,hx+24,hy+2,{small:1});}));
S(1452,[1800,1320,1962,1455],()=>{const T=TT();for(let r=0;r<4;r++)for(let c=0;c<6;c++){const x=1812+c*26+(r%2)*10,y=1350+r*28;ln('#4C9E3E',2,x,y,x,y-18);ell(x+4,y-8,4,2,'#5DB04A',0.5);
  const sw=Math.sin(T+c+r)*1;for(let k=0;k<10;k++){const a=k/10*TAU;ell(x+sw+Math.cos(a)*6,y-22+Math.sin(a)*6,3.4,1.8,'#FFC928',a);}circ(x+sw,y-22,4,'#7A4E33');}
  hit('sunflower',1800,1310,1962,1452);});

/* =============================================================
   SOUTH: beach and sea
============================================================= */
const UMB=[[150,1790,'#FF5A5F'],[440,1800,'#3CC8F5'],[1180,1790,'#FFC928'],[1420,1810,'#7ED957'],[1960,1795,'#B78CFF'],[2460,1805,'#FF8A3D']];
UMB.forEach(([x,y,c],i)=>S(y,[x-34,y-50,x+40,y+16],()=>{rr(x-4,y-2,34,14,2,i%2?'#FFFFFF':'#FFD23F');for(let k=0;k<4;k++)rr(x-4+k*9,y-2,4,14,0,i%2?'#3CC8F5':'#FF8FB1');
  ln('#9A9286',2,x,y,x,y-44);for(let k=0;k<6;k++){const a0=Math.PI+k/6*Math.PI,a1=Math.PI+(k+1)/6*Math.PI;poly(k%2?'#FFFFFF':c,x,y-44,x+Math.cos(a0)*32,y-36+Math.sin(a0)*6,x+Math.cos(a1)*32,y-36+Math.sin(a1)*6);}
  hit('umbrella',x-32,y-50,x+32,y-30);}));
S(1806,[290,1760,380,1810],()=>{const T=TT(),x=330,y=1806;ell(x,y,44,10,'#E6CC88');
  [[-26,24,18],[22,24,18],[-4,34,22]].forEach(([dx,h,w])=>{rr(x+dx-w/2,y-h,w,h,2,'#E8C878');for(let k=0;k<3;k++)rr(x+dx-w/2+k*(w/3),y-h-5,w/4,5,1,'#E8C878');});
  rr(x-8,y-14,10,14,[5,5,0,0],'#B89858');ln('#7A4E33',1,x-4,y-34,x-4,y-50);poly('#FF5A5F',x-4,y-50,x+8+Math.sin(T*4)*2,y-46,x-4,y-42);
  kid(x+40,y+6,'#FF8FB1',SKIN[3],HAIR[2],1.1);rr(x+46,y-4,8,7,2,'#3CC8F5');hit('sandcastle',x-40,y-52,x+44,y+8);});
const BALL={t:-1};
S(1830,[1220,1720,1300,1836],()=>{const T=TT(),t=fx('ball'),h=t<2?Math.abs(Math.sin(t/2*Math.PI*2))*(80-t*30):Math.abs(Math.sin(T*3))*10,x=1260,y=1828;
  ell(x,y,9,3,'rgba(0,0,0,.15)');const by=y-10-h;circ(x,by,10,'#FFFFFF');g.save();g.beginPath();g.arc(x,by,10,0,TAU);g.clip();
  rr(x-10,by-10,7,20,0,'#FF5A5F');rr(x+3,by-10,7,20,0,'#3CC8F5');g.restore();circ(x-3,by-4,2.4,'rgba(255,255,255,.7)');
  kid(x-26,y,'#7ED957',SKIN[2],HAIR[1],1.1);kid(x+28,y+2,'#FFC928',SKIN[0],HAIR[2],1.1);hit('ball',x-12,by-12,x+12,by+12,{small:1});});
S(1770,[1520,1700,1590,1772],()=>{const x=1525,y=1770;rr(x,y-40,60,40,[0,0,3,3],'#FFF1DA');for(let k=0;k<6;k++)rr(x+k*10,y-46,10,10,[0,0,5,5],k%2?'#FFFFFF':'#FF8FB1');
  rr(x+8,y-30,44,14,2,'#8ED2F4');ln('#7A4E33',1.4,x+30,y-46,x+30,y-60);poly('#E8B06A',x+24,y-68,x+36,y-68,x+30,y-56);circ(x+27,y-71,5,'#FFB6D9');circ(x+33,y-71,5,'#FFF1DA');circ(x+30,y-76,4.6,'#B5774A');
  hit('icecream',x-2,y-80,x+62,y);});
S(1784,[2170,1700,2240,1786],()=>{const T=TT(),x=2200,y=1784;ln('#B07A4E',3,x-14,y,x-10,y-36);ln('#B07A4E',3,x+14,y,x+10,y-36);ln('#B07A4E',2,x-12,y-14,x+12,y-26);
  rr(x-16,y-56,32,22,3,'#FF5A5F');rr(x-12,y-52,24,10,2,'#FFFFFF');ln('#555',1.2,x+16,y-56,x+16,y-74);poly('#FF5A5F',x+16,y-74,x+28+Math.sin(T*5)*2,y-70,x+16,y-66);});
/* crab, gull, starfish */
S(1858,[560,1830,700,1862],()=>{const T=TT(),t=fx('crab'),x=630+Math.sin(T*(t<3?2.5:0.6))*50,y=1856,sn=t<3?Math.abs(Math.sin(t*12)):0;
  ell(x,y,12,3,'rgba(0,0,0,.12)');for(let k=0;k<3;k++){const o=Math.sin(T*10+k)*1.5;ln('#C8301F',1.4,x-8,y-4,x-16,y-1+k*2+o);ln('#C8301F',1.4,x+8,y-4,x+16,y-1+k*2-o);}
  ell(x,y-6,11,7,'#E8443A');ln('#C8301F',1.2,x-3,y-12,x-4,y-17);ln('#C8301F',1.2,x+3,y-12,x+4,y-17);circ(x-4,y-17,1.6,'#FFF');circ(x+4,y-17,1.6,'#FFF');circ(x-4,y-17,0.8,'#222');circ(x+4,y-17,0.8,'#222');
  [[-1],[1]].forEach(([s])=>{g.save();g.translate(x+s*14,y-12);g.scale(s,1);ell(2,0,5,4,'#E8443A');poly('#FFFFFF',4,-1-sn*3,8,-2-sn*3,6,0);g.restore();});
  hit('crab',x-22,y-24,x+22,y+2,{small:1});});
S(1790,[1660,1700,1760,1794],()=>{const T=TT(),t=fx('gull'),fly=t<5,x=1700+(fly?Math.sin(t/5*Math.PI)*60:0),y=1790-(fly?Math.sin(t/5*Math.PI)*90:0);
  g.save();g.translate(x,y);if(fly){const f=Math.sin(T*14)*6;poly('#9AA4B8',-2,-6,-22,-12-f,-10,-4);poly('#9AA4B8',2,-6,22,-12-f,10,-4);ell(0,-6,8,4,'#FFFFFF');circ(7,-9,3.4,'#FFFFFF');poly('#FFC928',9,-9,14,-8,9,-7);}
  else{ln('#F2A33A',1,-2,-4,-2,0);ln('#F2A33A',1,2,-4,2,0);ell(0,-9,8,5.5,'#FFFFFF');ell(-2,-10,6,3.4,'#9AA4B8');circ(6,-14,3.6,'#FFFFFF');poly('#FFC928',9,-14,14,-13,9,-12);circ(7,-15,0.8,'#222');}
  g.restore();hit('gull',x-14,y-22,x+16,y+2,{small:1});});
S(1858,[2030,1838,2070,1862],()=>{const T=TT(),t=fx('starfish'),x=2050,y=1856,out=t<6;
  if(out){g.save();g.translate(x,y-4);g.rotate(Math.sin(T*3)*0.15);star(0,0,13,'#FF8A3D');star(0,0,6,'#FFB06A');circ(-2,-2,1,'#222');circ(2,-2,1,'#222');g.restore();}
  else{ell(x,y,12,4,'#E6CC88');poly('#FF8A3D',x-6,y-1,x-3,y-7,x,y-1);poly('#FF8A3D',x+2,y-1,x+6,y-6,x+7,y);}
  hit('starfish',x-14,y-18,x+14,y+4,{small:1});});
/* sea creatures */
S(1992,[240,1950,370,2000],()=>{const T=TT(),t=fx('seal'),clap=t<2.5?Math.sin(t*16):0,x=300,y=1992;
  ell(305,1994,58,14,'#7E889C');ell(300,1988,50,11,'#9AA4B8');ell(330,1990,22,8,'#8E98AE');
  g.save();g.translate(x,y-8);ell(0,0,22,9,'#8E96A8');ell(2,3,16,5,'#B9BFCA');poly('#7E889C',-20,0,-32,-6,-32,6);
  g.save();g.translate(14,-8);g.rotate(-0.4);ell(0,-6,7,8,'#8E96A8');circ(4,-8,1.2,'#222');circ(-1,-8,1.2,'#222');ell(4,-3,3,2,'#6E7688');g.restore();
  g.save();g.translate(6,2);g.rotate(-0.8+clap*0.6);ell(0,6,3,7,'#7E889C');g.restore();g.save();g.translate(12,2);g.rotate(0.6-clap*0.6);ell(0,6,3,7,'#7E889C');g.restore();g.restore();
  hit('seal',x-28,y-34,x+30,y+2,{small:1});});
S(1975,[2570,1930,2680,1990],()=>{const T=TT(),t=fx('octopus'),out=t<6,x=2620,y=1972;
  ell(2625,1978,50,12,'#7E889C');ell(2620,1972,40,10,'#9AA4B8');
  if(out){const up=Math.min(1,t*2)*(t>5?(6-t):1);g.save();g.translate(x,y-6-up*12);for(let k=0;k<6;k++){const a=-Math.PI+k/5*Math.PI;g.strokeStyle='#B06AD9';g.lineWidth=4;g.lineCap='round';
      g.beginPath();g.moveTo(Math.cos(a)*6,6);g.quadraticCurveTo(Math.cos(a)*18,10+Math.sin(T*6+k)*5,Math.cos(a)*22,2);g.stroke();}g.lineCap='butt';
    ell(0,-6,12,13,'#C07AE8');circ(-4,-6,3,'#FFF');circ(4,-6,3,'#FFF');circ(-4,-6,1.5,'#222');circ(4,-6,1.5,'#222');g.restore();}
  else{g.strokeStyle='#B06AD9';g.lineWidth=3;g.lineCap='round';g.beginPath();g.moveTo(x-20,y-4);g.quadraticCurveTo(x-30,y-14+Math.sin(T*3)*3,x-24,y-20);g.moveTo(x+18,y-4);g.quadraticCurveTo(x+28,y-12+Math.cos(T*3)*3,x+22,y-18);g.stroke();g.lineCap='butt';}
  hit('octopus',x-34,y-30,x+34,y+4,{small:1});});
K.DYN.push(L=>{const T=TT();
  // turtle
  {const a=T*0.12,x=900+Math.cos(a)*170,y=2120+Math.sin(a)*60,f=-Math.sin(a)>0?1:-1;if(inV(x-30,y-20,x+30,y+20))L.push({y,f:()=>{const pd=Math.sin(T*4)*0.5;
    flip(x,y,f,()=>{[[-10,-1],[10,-1]].forEach(([lx,s])=>{g.save();g.translate(lx,4);g.rotate(pd*(lx>0?1:-1));ell(0,4,4,9,'#6CC04A');g.restore();});
      ell(0,0,16,11,'#3E8A45');ell(0,-1,12,8,'#5DB04A');for(let k=0;k<4;k++)circ(-6+k*4,-1,2,'#3E8A45');circ(19,-2,6,'#6CC04A');circ(21,-4,1.2,'#222');});
    hit('turtle',x-24,y-14,x+28,y+14,{moving:1,small:1});}});}
  // dolphins: a dorsal fin cruises, then jumps
  {const t=fx('dolphin');for(let k=0;k<2;k++){const cyc=(T*0.25+k*0.5)%1,cx=1700+k*90+Math.sin(T*0.2+k)*60,cy=2040+k*30;
    const jump=t<2?Math.sin(Math.min(1,(t-k*0.3)/1.4)*Math.PI)*(t-k*0.3>0?1:0):cyc<0.3?Math.sin(cyc/0.3*Math.PI):0;
    const x=cx+(t<2?(t-k*0.3)*40:cyc<0.3?cyc/0.3*60:0),y=cy-jump*(t<2?70:46);
    if(!inV(x-40,y-40,x+40,y+20))continue;
    L.push({y:cy,f:()=>{if(jump>0.02){g.save();g.translate(x,y);g.rotate(-Math.cos(jump*Math.PI)*0.5+(t<2?0:0));
        ell(0,0,22,8,'#5A8FC8');ell(2,3,16,4,'#CFE3F5');poly('#5A8FC8',-2,-6,-10,-16,6,-7);poly('#5A8FC8',-20,0,-30,-7,-28,6);poly('#5A8FC8',20,-2,30,0,20,3);circ(14,-2,1.2,'#222');g.restore();
        if(Math.random()<0.2)PARTS.push({x,y:cy,vx:rnd(-30,30),vy:rnd(-60,-20),life:0,max:0.6,k:'drop',r:4,c:'#FFFFFF',gr:150});}
      else{poly('#5A8FC8',x-6,cy,x+2,cy-12,x+8,cy);ln('rgba(255,255,255,.7)',1.5,x-12,cy+1,x+12,cy+1);}
      hit('dolphin',x-26,Math.min(y,cy)-16,x+30,cy+6,{moving:1,small:1});}});}}
  // whale
  {const x=2300+Math.sin(T*0.05)*80,y=2180,t=fx('whale'),sp=t<3||(T%12)<2.2;if(inV(x-80,y-100,x+80,y+30))L.push({y,f:()=>{
    ell(x,y,64,14,'#3A6FA8');ell(x-6,y-6,50,12,'#4A7FB8');ell(x+30,y-8,4,3,'#2A4F80');circ(x+40,y-6,1.6,'#FFF');
    const tl=t<3?Math.sin(t*3):0;g.save();g.translate(x-70,y-4-tl*20);poly('#3A6FA8',0,0,-14,-14,-4,-4,6,-16,4,0);g.restore();
    if(sp){for(let k=0;k<4;k++)PARTS.push({x:x+28+rnd(-3,3),y:y-14,vx:rnd(-18,18),vy:rnd(-140,-90)*(t<3?1.3:1),life:0,max:1,k:'drop',r:5,c:'#E6F6FF',gr:160});}
    hit('whale',x-80,y-26,x+70,y+16,{moving:1});}});}
  // shark fin
  {const t=fx('shark'),a=T*0.3,x=1250+Math.cos(a)*120,y=2250+Math.sin(a)*40,dive=t<3?Math.sin(t/3*Math.PI):0,f=-Math.sin(a)>0?1:-1;if(inV(x-30,y-30,x+30,y+10))L.push({y,f:()=>{
    if(dive<0.8){g.save();g.translate(x,y);g.scale(f,1);poly('#6E7A90',-10,0,2,-22*(1-dive),12,0);poly('#8E98AE',-10,0,2,-22*(1-dive),-2,0);g.restore();}
    ln('rgba(255,255,255,.75)',1.5,x-16,y+1,x+16,y+1);hit('shark',x-20,y-26,x+20,y+4,{moving:1,small:1});}});}
  // submarine surfaces now and then
  {const t=fx('submarine'),cyc=(T%24)/24,up=t<6?Math.min(1,t)*(t>5?6-t:1):cyc<0.25?Math.sin(cyc/0.25*Math.PI):0,x=650,y=2280;if(inV(x-60,y-60,x+60,y+20))L.push({y,f:()=>{
    if(up>0.05){g.save();g.beginPath();g.rect(x-70,y-80,140,80);g.clip();const yy=y+20-up*24;rr(x-44,yy-16,88,30,15,'#FFC928');rr(x-14,yy-34,30,22,6,'#FFC928');ln('#7E889C',2,x+8,yy-34,x+8,yy-46);ln('#7E889C',2,x+8,yy-46,x+14,yy-46);
      [-24,-6,12].forEach(px=>{circ(x+px,yy-4,5,'#7E889C');circ(x+px,yy-4,3.4,'#8ED2F4');});poly('#E0A21A',x-44,yy-2,x-56,yy-12,x-56,yy+8);g.restore();}
    else{ln('#7E889C',2,x+8,y-10,x+8,y-22);ln('#7E889C',2,x+8,y-22,x+14,y-22);}
    ln('rgba(255,255,255,.7)',1.5,x-40,y+1,x+40,y+1);hit('submarine',x-48,y-40,x+48,y+6,{moving:1});}});}
});
/* island with treasure, pirate ship */
function palm(x,y,s){const T=TT(),sw=Math.sin(T*0.8+x)*0.06;ell(x+6,y+1,16*s,4*s,'rgba(0,0,0,.15)');
  g.strokeStyle='#A8763E';g.lineWidth=6*s;g.lineCap='round';g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+8*s,y-30*s,x+4*s,y-58*s);g.stroke();g.lineCap='butt';
  for(let k=0;k<6;k++){const a=-Math.PI*0.95+k/5*Math.PI*0.9+sw;g.save();g.translate(x+4*s,y-58*s);g.rotate(a);ell(18*s,4*s,20*s,5*s,k%2?'#3E9A45':'#4CAF50',0.25);g.restore();}
  circ(x+2*s,y-56*s,3*s,'#7A4E33');circ(x+7*s,y-55*s,3*s,'#7A4E33');}
S(2290,[1920,2180,2180,2300],()=>{const T=TT(),t=fx('treasure');
  ell(2050,2286,124,32,'#EAD9A2');ell(2050,2282,112,26,'#F3DFA2');ell(2050,2286,124,32,'rgba(0,0,0,0)');
  palm(2010,2276,1.1);palm(2090,2268,0.9);
  const x=2060,y=2290,open=t<6;rr(x-14,y-14,28,16,2,'#8A5A3B');rr(x-14,y-10,28,3,0,'#F2C24A');rr(x-2,y-12,4,6,1,'#F2C24A');
  if(open){g.save();g.translate(x-14,y-14);g.rotate(-1.1);rr(0,-8,28,8,[4,4,0,0],'#9A6440');g.restore();ell(x,y-14,12,4,'#FFD23F');circ(x-5,y-16,2.4,'#FFE680');circ(x+4,y-17,2.4,'#FFE680');
    if(Math.random()<0.15)PARTS.push({x:x+rnd(-8,8),y:y-18,vx:rnd(-30,30),vy:rnd(-70,-40),life:0,max:1,k:'star',r:3,c:'#FFD23F',gr:80});LIGHTS.push(x,y-16,40,'#FFE680');}
  else rr(x-14,y-22,28,8,[4,4,0,0],'#9A6440');
  hit('treasure',x-18,y-26,x+18,y+4,{small:1});hit('island',1930,2250,2170,2310);});
S(2340,[2420,2200,2620,2350],()=>{const T=TT(),t=fx('pirate'),x=2520,y=2336,rk=Math.sin(T*1.2)*0.04;
  g.save();g.translate(x,y);g.rotate(rk);ell(0,2,80,8,'rgba(255,255,255,.3)');
  poly('#7A4E33',-70,-24,70,-24,56,0,-58,0);rr(-70,-28,140,6,2,'#5A3A2A');for(let k=0;k<5;k++)circ(-44+k*22,-14,3,'#3A2A20');rr(46,-44,24,18,2,'#7A4E33');
  [[-30,-120,80],[16,-140,100]].forEach(([mx,top,h])=>{ln('#5A3A2A',3,mx,-28,mx,top);rr(mx-24,top+14,48,h*0.45,3,'#F2EDE4');rr(mx-20,top+20+h*0.45,40,h*0.3,3,'#F2EDE4');});
  ln('#5A3A2A',2,16,-140,16,-156);rr(16,-156,22,14,1,'#2B2233');circ(27,-150,3,'#FFFFFF');ln('#FFFFFF',1,23,-145,31,-145);g.restore();
  if(fx('pirate')<1.5&&Math.random()<0.4)puff(x+70,y-14,{c:'#E9ECF2',r:6,vx:30,max:1.4});
  hit('pirate',x-72,y-160,x+72,y+4);});

/* =============================================================
   TAPS, ZONES, FIND TARGETS
============================================================= */
Object.assign(TAP,{
  waterfall:()=>{SND.splash();burst(822,-320,'drop',20,'#FFFFFF');},cablecar:()=>{act('cablecar');S2.gondola();},hut:()=>{act('hut');SND.bell();},
  snowman:()=>{act('snowman');SND.whoosh();},volcano:()=>erupt(),dinovalley:()=>{act('trex');S2.roarT();},nest:()=>{act('babydino');S2.crack();},
  brachio:()=>{act('brachio');S2.munch();},trex:()=>{act('trex');S2.roarT();},trike:()=>{act('trike');S2.snort();},stego:()=>{act('stego');SND.whoosh();},
  ptera:()=>{act('ptera');S2.screech();},babydino:()=>{act('babydino');SND.squeak();},
  ibex:()=>{act('ibex');SND.hop();},marmot:()=>{act('marmot');S2.whistleM();},eagle:()=>{act('eagle');S2.screech();},
  wolf:()=>{act('wolf');S2.howl();},boar:()=>{act('boar');S2.grunt();},badger:()=>{act('badger');SND.squeak();},woodpecker:()=>{act('woodpecker');S2.knock();},
  stag:()=>{act('stag');S2.bellow();},beaver:()=>{act('beaver');S2.slap();},snail:()=>{act('snail');SND.squeak();},butterfly:()=>{act('butterfly');SND.whoosh();},
  pond:()=>{SND.splash();},treehouse:()=>{act('treehouse');SND.ding();},campsite:()=>{act('campfire');S2.crackle();},tent:()=>{SND.whoosh();},
  campfire:()=>{act('campfire');S2.crackle();},caravan:()=>SND.horn(),
  airport:()=>{if(PLANE.t<0){PLANE.t=0;S2.plane();}},plane:()=>{if(PLANE.t<0)PLANE.t=0;S2.plane();},
  castle:()=>{act('castle');SND.music();},knight:()=>{act('castle');SND.bell();},dragon:()=>{act('dragon');S2.fire();},horse:()=>{act('horse');S2.neigh();},
  sunflower:()=>{blip();},beach:(r,x,y)=>burst(x,y,'drop',8,'#F3DFA2',0.5),sea:(r,x,y)=>{SND.splash();burst(x,y,'drop',12,'#FFFFFF',0.7);},
  sandcastle:()=>{SND.ding();},icecream:()=>{SND.ding();},ball:()=>{act('ball');SND.pop();},umbrella:()=>{SND.whoosh();},island:()=>{SND.whoosh();},palm:()=>{SND.whoosh();},
  treasure:()=>{act('treasure');S2.coins();},pirate:()=>{act('pirate');S2.cannon();},submarine:()=>{act('submarine');S2.bubbles();},
  crab:()=>{act('crab');S2.snip();},gull:()=>{act('gull');S2.screech();},starfish:()=>{act('starfish');SND.squeak();},seal:()=>{act('seal');S2.arf();},
  octopus:()=>{act('octopus');S2.bubbles();},turtle:()=>{SND.splash();},dolphin:()=>{act('dolphin');S2.click();},whale:()=>{act('whale');S2.spout();},shark:()=>{act('shark');SND.splash();}});
K.ZONES.push((x,y)=>{
  if(y>seaY(x))return 'sea';
  if(y>sandY(x)&&!(x>866&&x<964&&y<1910))return 'beach';
  if(y<-236&&x<2010)return 'mountain';
  if(x>1980&&y<0&&y>-620&&Math.abs(x-VX)<(y-VTOP)*0.68+80)return 'volcano';
  if(x>1700&&y>-20&&y<590)return 'dinovalley';
  if(y<0&&x<1990)return 'alp';
  if(x>1190&&x<1710&&y>-290&&y<776)return 'forest';
  if(x>1246&&x<1886&&y>836&&y<1230)return 'campsite';
  if(x>1960&&y>830&&y<1225)return 'airport';
  if(((x-2160)/270)**2+((y-1520)/120)**2<1)return 'castle';
  return null;});
at('sea',[1200,1950,1700,2300]);at('beach',[100,1730,800,1880]);at('volcano',[2150,-600,2560,-60]);at('dinovalley',[1800,100,2700,550]);
at('airport',[2000,820,2700,1160]);at('castle',[2000,1280,2310,1500]);at('pond',[1366,256,1534,326]);
}
