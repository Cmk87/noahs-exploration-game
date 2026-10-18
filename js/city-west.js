/* =============================================================
   WEST OF THE WORLD (loaded before js/city.js, which calls
   cityWest(K)): Santa's snowy village in the north-west (toy factory
   you can see into, reindeer, a sleigh that flies around the world),
   a spooky Halloween corner in the south-west (vampire castle, bats,
   graveyard, witch), and boats sailing slowly across the whole sea.
============================================================= */
function cityWest(K){
const {rr,circ,ell,poly,ln,star,shade,FONT,sign,win,gableB,flatB,kid,SKIN,HAIR,ent,ANIMALS,S,hit,fx,act,later,puff,burst,textP,
  PARTS,LIGHTS,SND,swp,sr,sm,li,ST,TAP,VIEW,TAU,g,wheel}=K;
const ANI=(id,ic,n,l)=>{ANIMALS.push([id,ic,n,l]);ent(id,ic,n,l,{animal:1});};
const at=(id,b)=>{K.ENT[id].at=b;};
const inV=(x0,y0,x1,y1)=>x1>VIEW[0]&&x0<VIEW[2]&&y1>VIEW[1]&&y0<VIEW[3];
const flip=(x,y,f,fn)=>{g.save();g.translate(x,y);g.scale(f,1);fn();g.restore();};
const TT=()=>ST.T,L3=a=>a[li()];
const SNOWX0=-1400,SNOWX1=-30,SNOWY0=-300,SNOWY1=770,HX0=-1400,HX1=-30,HY0=830,HY1=1715;

/* ---------- words ---------- */
ent('northpole','🎅',['der Nordpol','the North Pole','el Polo Norte'],['Der Nordpol! Hier wohnt der Weihnachtsmann.','The North Pole! Santa lives here.','¡El Polo Norte! Aquí vive Papá Noel.'],{find:1});
ent('santa','🎅',['der Weihnachtsmann','Santa Claus','Papá Noel'],['Ho ho ho! Frohe Weihnachten!','Ho ho ho! Merry Christmas!','¡Jo jo jo! ¡Feliz Navidad!'],{find:1});
ent('santahouse','🏠',['das Haus vom Weihnachtsmann','Santa’s house','la casa de Papá Noel'],['Das Haus vom Weihnachtsmann! Drinnen ist es warm und gemütlich.','Santa’s house! It is warm and cosy inside.','¡La casa de Papá Noel! Dentro hace calor.'],{find:1});
ent('factory','🎁',['die Wichtelwerkstatt','the toy factory','la fábrica de juguetes'],['Die Wichtelwerkstatt! Die Wichtel packen Geschenke ein.','The toy factory! The elves are wrapping presents.','¡La fábrica de juguetes! Los duendes envuelven regalos.'],{find:1});
ent('elf','🧝',['der Wichtel','the elf','el duende'],['Ein Wichtel! Er hilft dem Weihnachtsmann.','An elf! It helps Santa.','¡Un duende! Ayuda a Papá Noel.'],{find:1});
ent('presents','🎁',['das Geschenk','the present','el regalo'],['Geschenke! So viele Geschenke!','Presents! So many presents!','¡Regalos! ¡Cuántos regalos!'],{find:1});
ent('sleigh','🛷',['der Schlitten','the sleigh','el trineo'],['Der Schlitten! Er fliegt los! Klingeling!','The sleigh! Off it flies! Jingle jingle!','¡El trineo! ¡Sale volando! ¡Tilín, tilín!'],{find:1});
ent('xmastree','🎄',['der Weihnachtsbaum','the Christmas tree','el árbol de Navidad'],['Der Weihnachtsbaum! Die Lichter funkeln.','The Christmas tree! The lights are twinkling.','¡El árbol de Navidad! Las luces brillan.'],{find:1});
ent('rink','⛸️',['die Eisbahn','the ice rink','la pista de hielo'],['Die Eisbahn! Die Kinder fahren Schlittschuh.','The ice rink! The children are skating.','¡La pista de hielo! Los niños patinan.'],{find:1});
ent('stable','🛖',['der Rentierstall','the reindeer stable','el establo de los renos'],null,{find:1});
ent('gingerbread','🍪',['das Lebkuchenhaus','the gingerbread house','la casita de jengibre'],['Das Lebkuchenhaus! Mmh, das kann man essen.','The gingerbread house! Mmm, you can eat it.','¡La casita de jengibre! Mmm, se puede comer.'],{find:1});
ent('snow','❄️',['der Schnee','the snow','la nieve'],['Der Schnee! Kalt und weiß.','The snow! Cold and white.','¡La nieve! Fría y blanca.'],{find:1});
ent('spooky','🎃',['die Gruselecke','the spooky corner','el rincón del miedo'],['Die Gruselecke! Huuu, wie gruselig!','The spooky corner! Woooo, how spooky!','¡El rincón del miedo! ¡Uuuh, qué miedo!'],{find:1});
ent('vampcastle','🏰',['das Vampirschloss','the vampire castle','el castillo del vampiro'],['Das Vampirschloss! Wer wohnt da wohl?','The vampire castle! Who lives there?','¡El castillo del vampiro! ¿Quién vivirá ahí?'],{find:1});
ent('vampire','🧛',['Graf Dracula','Count Dracula','el conde Drácula'],['Graf Dracula! Er sagt: Guten Abend! Und schwupp, wird er zur Fledermaus!','Count Dracula! He says: Good evening! And whoosh, he turns into a bat!','¡El conde Drácula! Dice: ¡Buenas noches! ¡Y zas, se convierte en murciélago!'],{find:1});
ent('graveyard','🪦',['der Friedhof','the graveyard','el cementerio'],['Der Friedhof! Da kommen Gespenster heraus! Buuh!','The graveyard! Ghosts are coming out! Boo!','¡El cementerio! ¡Salen fantasmas! ¡Buu!'],{find:1});
ent('ghost','👻',['das Gespenst','the ghost','el fantasma'],['Das Gespenst! Buuuh!','The ghost! Booooo!','¡El fantasma! ¡Buuuu!'],{find:1});
ent('skeleton','💀',['das Skelett','the skeleton','el esqueleto'],['Das Skelett! Klapper, klapper!','The skeleton! Rattle, rattle!','¡El esqueleto! ¡Cloc, cloc!'],{find:1});
ent('witch','🧙',['die Hexe','the witch','la bruja'],['Die Hexe! Sie fliegt auf ihrem Besen. Hihihi!','The witch! She flies on her broom. Hee hee hee!','¡La bruja! Vuela en su escoba. ¡Jijiji!'],{find:1});
ent('cauldron','🧪',['der Hexenkessel','the cauldron','el caldero'],['Der Hexenkessel! Blubb, blubb!','The cauldron! Bubble, bubble!','¡El caldero! ¡Blub, blub!'],{find:1});
ent('pumpkin','🎃',['der Kürbis','the pumpkin','la calabaza'],['Der Kürbis! Er hat ein lustiges Gesicht.','The pumpkin! It has a funny face.','¡La calabaza! Tiene una cara divertida.'],{find:1});
ent('moon','🌕',['der Mond','the moon','la luna'],['Der Mond! Er leuchtet in der Nacht.','The moon! It shines at night.','¡La luna! Brilla por la noche.'],{find:1});
ent('ferry','⛴️',['die Fähre','the ferry','el ferry'],['Die Fähre! Sie bringt Autos und Leute über das Meer.','The ferry! It carries cars and people across the sea.','¡El ferry! Lleva coches y gente por el mar.'],{find:1});
ent('fishing','🎣',['das Fischerboot','the fishing boat','el barco pesquero'],['Das Fischerboot! Es fängt Fische.','The fishing boat! It catches fish.','¡El barco pesquero! Pesca peces.'],{find:1});
ent('cargo','🚢',['das Containerschiff','the container ship','el buque de carga'],['Das Containerschiff! Es trägt viele bunte Kisten.','The container ship! It carries lots of colourful boxes.','¡El buque de carga! Lleva muchas cajas de colores.'],{find:1});
ent('speedboat','🚤',['das Schnellboot','the speedboat','la lancha'],['Das Schnellboot! Brrrumm, ist das schnell!','The speedboat! Vroom, it is fast!','¡La lancha! ¡Brum, qué rápida!'],{find:1});
ent('cruise','🛳️',['das Kreuzfahrtschiff','the cruise ship','el crucero'],['Das Kreuzfahrtschiff! Es ist riesig. Tuuut!','The cruise ship! It is huge. Toot toot!','¡El crucero! Es enorme. ¡Tuuut!'],{find:1});
ANI('reindeer','🦌',['das Rentier','the reindeer','el reno'],['Das Rentier! Es zieht den Schlitten vom Weihnachtsmann.','The reindeer! It pulls Santa’s sleigh.','¡El reno! Tira del trineo de Papá Noel.']);
ANI('polarbear','🐻‍❄️',['der Eisbär','the polar bear','el oso polar'],['Der Eisbär! Er ist weiß wie der Schnee.','The polar bear! It is white like the snow.','¡El oso polar! Es blanco como la nieve.']);
ANI('arcticfox','🦊',['der Polarfuchs','the arctic fox','el zorro ártico'],['Der Polarfuchs! Er hat sich im Schnee versteckt.','The arctic fox! It was hiding in the snow.','¡El zorro ártico! Estaba escondido en la nieve.']);
ANI('snowyowl','🦉',['die Schneeeule','the snowy owl','el búho nival'],['Die Schneeeule! Huhu!','The snowy owl! Hoo hoo!','¡El búho nival! ¡Uh, uh!']);
ANI('penguin','🐧',['der Pinguin','the penguin','el pingüino'],['Der Pinguin! Er watschelt. Watschel, watschel!','The penguin! It waddles. Waddle, waddle!','¡El pingüino! Camina así, de lado a lado.']);
ANI('bat','🦇',['die Fledermaus','the bat','el murciélago'],['Die Fledermaus! Sie fliegt in der Nacht.','The bat! It flies at night.','¡El murciélago! Vuela de noche.']);
ANI('raven','🐦‍⬛',['der Rabe','the raven','el cuervo'],['Der Rabe! Krah, krah!','The raven! Caw, caw!','¡El cuervo! ¡Cra, cra!']);
ANI('spider','🕷️',['die Spinne','the spider','la araña'],['Die Spinne! Sie klettert an ihrem Faden.','The spider! It climbs on its thread.','¡La araña! Sube por su hilo.']);
ANI('blackcat','🐈‍⬛',['die schwarze Katze','the black cat','el gato negro'],['Die schwarze Katze! Fauch!','The black cat! Hiss!','¡El gato negro! ¡Fffff!']);

/* ---------- sounds ---------- */
const S4={
  jingle:()=>{for(let i=0;i<12;i++)beep(2200+Math.random()*900,i*0.09,0.08,'triangle',0.05);},
  hoho:()=>{[0,0.3,0.6].forEach(t=>swp(220,150,0.25,'sawtooth',0.08,t));},
  bells:()=>{[1319,1319,1319,0,1319,1319,1319,0,1319,1568,1047,1175,1319].forEach((f,i)=>{if(f)beep(f,i*0.18,0.2,'triangle',0.09);});},
  machine:()=>{for(let i=0;i<8;i++)beep(i%2?320:240,i*0.12,0.08,'square',0.05);},
  boo:()=>{swp(300,180,1,'sine',0.14);swp(310,190,1,'sine',0.08);},
  bones:()=>{for(let i=0;i<10;i++)beep(1500+Math.random()*1500,i*0.06,0.03,'square',0.06);},
  cackle:()=>{for(let i=0;i<7;i++)swp(900,1200,0.08,'square',0.05,i*0.1);},
  bubble:()=>{for(let i=0;i<8;i++)swp(200+Math.random()*200,600+Math.random()*400,0.1,'sine',0.08,i*0.08);},
  squeak:()=>{for(let i=0;i<5;i++)beep(3500+Math.random()*600,i*0.07,0.04,'sine',0.06);},
  caw:()=>{[0,0.35].forEach(t=>swp(700,450,0.25,'sawtooth',0.07,t));},
  hiss:()=>noise(0.6,0.12),
  growl:()=>{swp(140,90,0.9,'sawtooth',0.09);},
  horn:()=>{beep(147,0,1,'sawtooth',0.08);beep(220,0,1,'sawtooth',0.05);},
  toot:()=>{beep(330,0,0.25,'square',0.07);beep(330,0.35,0.4,'square',0.07);},
  vroom:()=>{swp(120,420,0.9,'sawtooth',0.07);},
  organ:()=>{[[220,330,440],[208,311,415],[196,294,392]].forEach((ch,i)=>ch.forEach(f=>beep(f,i*0.6,0.6,'sawtooth',0.04)));}};

/* =============================================================
   GROUND: snow and the spooky dusk
============================================================= */
const SNOWBLOB=[],SPOOKBLOB=[],FLAKES=[];
for(let i=0;i<40;i++)SNOWBLOB.push([SNOWX0+sr()*1360,SNOWY0+sr()*1060,30+sr()*60]);
for(let i=0;i<30;i++)SPOOKBLOB.push([HX0+sr()*1360,HY0+sr()*870,30+sr()*60]);
for(let i=0;i<140;i++)FLAKES.push([sr(),sr(),0.6+sr()*0.8]);
K.GROUND0.push(()=>{
  if(inV(SNOWX0-20,SNOWY0-20,SNOWX1+20,SNOWY1+20)){
    g.fillStyle='#F2F7FD';g.beginPath();g.moveTo(SNOWX0-400,SNOWY0);
    for(let x=SNOWX0-400;x<=SNOWX1;x+=40)g.lineTo(x,SNOWY0-8+Math.sin(x/70)*8);
    g.lineTo(SNOWX1+10,SNOWY0);for(let y=SNOWY0;y<=SNOWY1;y+=40)g.lineTo(SNOWX1+12+Math.sin(y/50)*8,y);g.lineTo(SNOWX0-400,SNOWY1);g.closePath();g.fill();
    for(const [x,y,r] of SNOWBLOB)if(inV(x-r,y-r,x+r,y+r))ell(x,y,r,r*0.35,'#E3ECF7');
    ell(-450,130,150,60,'#BFE3F7');ell(-450,128,140,54,'#D8F0FC');g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=1.2;
    for(let k=0;k<5;k++){g.beginPath();g.ellipse(-450,128,40+k*20,14+k*8,0.1,0.2+k,1.6+k);g.stroke();}}
  if(inV(HX0-20,HY0-20,HX1+20,HY1+20)){
    g.fillStyle='#5A5272';g.beginPath();g.moveTo(HX0-400,HY0);for(let x=HX0-400;x<=HX1;x+=40)g.lineTo(x,HY0+Math.sin(x/60)*6);
    for(let y=HY0;y<=HY1;y+=40)g.lineTo(HX1+10+Math.sin(y/45)*8,y);g.lineTo(HX0-400,HY1+20);g.closePath();g.fill();
    for(const [x,y,r] of SPOOKBLOB)if(inV(x-r,y-r,x+r,y+r))ell(x,y,r,r*0.35,'#4C4562');
    ell(-1040,1150,250,95,'#463F5A');ell(-1040,1140,230,82,'#514A68');
    g.strokeStyle='#6E6684';g.lineWidth=16;g.lineCap='round';g.beginPath();g.moveTo(-60,1250);g.quadraticCurveTo(-400,1220,-600,1300);g.quadraticCurveTo(-800,1380,-1040,1220);g.stroke();g.lineCap='butt';
    rr(-1300,1390,300,170,20,'#5E4A3A');for(let k=0;k<6;k++)rr(-1290,1405+k*26,280,4,2,'#4E3A2E');}
});

/* =============================================================
   SANTA'S VILLAGE
============================================================= */
function snowRoof(x,Yr,Ye,w){rr(x-8,Yr-6,w+16,12,6,'#FFFFFF');for(let k=0;k<7;k++){const px=x-4+k*(w+8)/6;ell(px,Ye+3,5,4,'#FFFFFF');}rr(x-8,Ye-2,w+16,6,3,'#FFFFFF');}
S(242,[-1200,40,-990,244],()=>{const T=TT(),x=-1180,y=170,w=170,d=70,h=80,{Ye,Yr}=gableB(x,y,w,d,h,'#C8392D','#7A3A3A'),base=y+d;
  g.strokeStyle='rgba(0,0,0,.12)';g.lineWidth=1;g.beginPath();for(let yy=Ye+8;yy<base;yy+=8){g.moveTo(x,yy);g.lineTo(x+w,yy);}g.stroke();
  rr(x+w*0.72,Yr-14,16,24,2,'#8A5A4A');rr(x+w*0.72-2,Yr-18,20,6,2,'#FFFFFF');snowRoof(x,Yr,Ye,w);
  [x+16,x+w-44].forEach(wx=>{win(wx,Ye+16,28,22,'#FFFFFF');LIGHTS.push(wx+14,Ye+27,40,'#FFD27A');});
  rr(x+w/2-15,base-36,30,36,[14,14,0,0],'#2E7A34');g.strokeStyle='#2E7A34';g.lineWidth=5;g.beginPath();g.arc(x+w/2,base-24,9,0,TAU);g.stroke();
  circ(x+w/2,base-24,9,'rgba(0,0,0,0)');g.strokeStyle='#3E9A45';g.lineWidth=4;g.beginPath();g.arc(x+w/2,base-24,8,0,TAU);g.stroke();circ(x+w/2,base-15,3,'#E8443A');
  for(let k=0;k<10;k++)circ(x+6+k*(w-12)/9,Ye+4+Math.sin(k)*2,2.4,['#FF5A5F','#FFC928','#3CC8F5','#7ED957'][(k+Math.floor(T*2))%4]);
  hit('santahouse',x-8,Yr-18,x+w+8,base);});
S(282,[-1130,200,-1060,284],()=>{const T=TT(),t=fx('santa'),x=-1095,y=280,sh=t<2.5?Math.sin(t*20)*1.5:0,wave=t<3?Math.sin(t*10)*0.6:Math.sin(T*1.5)*0.15;
  ell(x,y+1,16,4,'rgba(0,0,0,.12)');g.save();g.translate(x+sh,y);
  rr(-8,-10,6,10,2,'#2B2233');rr(2,-10,6,10,2,'#2B2233');ell(0,-22,15,15,'#D9302A');rr(-15,-24,30,5,1,'#2B2233');rr(-4,-25,8,7,1,'#FFC928');
  rr(-15,-12,30,4,2,'#FFFFFF');g.save();g.translate(13,-30);g.rotate(-1.2+wave);rr(-3,-14,6,15,3,'#D9302A');circ(0,-14,3.4,'#FFFFFF');g.restore();rr(-19,-32,6,14,3,'#D9302A');
  circ(0,-42,10,'#F6D2B4');ell(0,-34,11,9,'#FFFFFF');ell(-4,-38,4,2,'#FFFFFF');ell(4,-38,4,2,'#FFFFFF');circ(0,-40,2.2,'#F0A0A0');
  circ(-3.5,-44,1.2,'#2B2233');circ(3.5,-44,1.2,'#2B2233');poly('#D9302A',-10,-48,10,-48,14,-64,-2,-60);circ(14,-64,3.4,'#FFFFFF');rr(-11,-50,22,5,2.5,'#FFFFFF');g.restore();
  if(t<2.5&&Math.random()<0.08)textP(x,y-75,'Ho ho ho!','#FFFFFF',13);
  hit('santa',x-20,y-70,x+20,y,{small:1});});
/* giant Christmas tree */
S(336,[-1370,140,-1230,340],()=>{const T=TT(),t=fx('xmastree'),x=-1300,y=336;
  ell(x+6,y+2,50,9,'rgba(0,0,0,.12)');rr(x-7,y-20,14,20,2,'#7A4E33');
  for(let k=0;k<5;k++){const yy=y-16-k*30,w=58-k*10;poly('#2F8F5B',x-w,yy,x+w,yy,x,yy-46);poly('#3E9A6A',x-w,yy,x,yy-46,x-w*0.2,yy);rr(x-w+4,yy-4,2*w-8,4,2,'#FFFFFF');}
  const lights=[];for(let k=0;k<26;k++){const lev=k%5,yy=y-30-lev*30-((k*7)%20),w=(50-lev*10)*(((k*37)%100)/100*1.6-0.8);lights.push([x+w,yy]);}
  lights.forEach(([lx,ly],k)=>{const on=(k+Math.floor(T*(t<4?8:2)))%3!==0,c=['#FF5A5F','#FFC928','#3CC8F5','#B78CFF'][k%4];circ(lx,ly,3,on?c:shade(c,-0.45));if(on)LIGHTS.push(lx,ly,14,c);});
  const sg=t<4?1.4+Math.sin(t*10)*0.2:1;star(x,y-176,12*sg,'#FFD23F');LIGHTS.push(x,y-176,60*sg,'#FFE680');
  [[x-40,y+4,'#E8443A'],[x+30,y+6,'#3CC8F5'],[x-8,y+10,'#7ED957']].forEach(([px,py,c])=>{rr(px-10,py-14,20,14,2,c);rr(px-2,py-14,4,14,0,'#FFD23F');rr(px-10,py-9,20,3,0,'#FFD23F');});
  hit('xmastree',x-60,y-190,x+60,y+10);});
/* reindeer stable and paddock */
S(120,[-870,-14,-700,122],()=>{const x=-860,y=58,w=150,d=62,h=60,{Ye,Yr}=gableB(x,y,w,d,h,'#9A6440','#6E3A2E');snowRoof(x,Yr,Ye,w);
  rr(x+20,Ye+14,w-40,h-14,[6,6,0,0],'#4A2E20');ell(x+w/2,y+d-6,40,8,'#E8C25A');sign(x+w/2,Ye+8,70,12,L3(['RENTIERE','REINDEER','RENOS']),'#FFFFFF','#8A3A2A');hit('stable',x-6,Yr-8,x+w+6,y+d);});
function reindeer(x,y,f,c,rud,t,i){const T=TT(),hop=t<1.2?Math.abs(Math.sin(t*8+i))*10:0;
  flip(x,y-hop,f,()=>{ell(0,hop+1,18,4,'rgba(0,0,0,.12)');[-10,-6,6,10].forEach(lx=>rr(lx-1.4,-13,2.8,13,1,shade(c,-0.25)));
    ell(0,-17,15,7.5,c);ell(-14,-18,3,2.4,'#F6EAD8');ell(2,-14,9,3.5,shade(c,0.3));
    g.save();g.translate(12,-22);rr(-2.5,-13,7,15,3,c);ell(5,-15,7,4.4,c);circ(3,-17,1.2,'#222');circ(11,-14,rud?2.6:1.6,rud?'#FF2A2A':'#3A2A20');
    g.strokeStyle='#C9A87A';g.lineWidth=1.6;g.lineCap='round';g.beginPath();g.moveTo(1,-18);g.lineTo(-3,-30);g.lineTo(-8,-34);g.moveTo(-3,-30);g.lineTo(1,-36);g.moveTo(4,-18);g.lineTo(8,-30);g.lineTo(6,-36);g.moveTo(8,-30);g.lineTo(13,-34);g.stroke();g.lineCap='butt';
    ell(-1,-20,2,3.4,c,-0.4);g.restore();
    rr(-8,-22,16,3,1,'#D9302A');circ(0,-20,1.6,'#FFD23F');});}
/* Santa's nine reindeer, each with its name (the names are the same in every language, only Rudolph is Rodolfo in Spanish) */
const RD=[['Rudolph','Rudolph','Rodolfo'],['Dasher'],['Dancer'],['Prancer'],['Vixen'],['Comet'],['Cupid'],['Donner'],['Blitzen']]
  .map((n,i)=>({n:n.length>1?n:[n[0],n[0],n[0]],c:['#A8784A','#9A6A40','#B08A5E','#8E623C','#A27448','#B48C62','#946640','#A07050','#8A5E3A'][i],
    x:-910+(i%3)*120+(i>>1&1)*10,y:200+Math.floor(i/3)*62,f:i%2?-1:1,tap:-9}));
const rdName=r=>r.n[li()];
let ROLL=-1;                                   // roll call running since this time
const rdHop=(r,i,T)=>{const a=T-r.tap,b=ROLL>=0?T-ROLL-i*0.8:9;return Math.max(a>=0&&a<1.2?Math.abs(Math.sin(a*8))*12:0,b>=0&&b<0.7?Math.abs(Math.sin(b*9))*12:0);};
RD.forEach((r,i)=>S(r.y,[r.x-40,r.y-60,r.x+40,r.y+6],()=>{if(SL.t>=0)return;        // out flying with the sleigh
  const T=TT(),t=fx('reindeer'),xx=r.x+Math.sin(T*0.3+i*2)*14,h=rdHop(r,i,T);
  reindeer(xx,r.y-h,r.f,r.c,i===0,t,i);
  if(i===0){const nx=xx+r.f*25,ny=r.y-h-37;LIGHTS.push(nx,ny,26,'#FF3030');}
  const rc=ROLL>=0?T-ROLL:99,tag=(rc>=i*0.8&&rc<9*0.8+2.5)||T-r.tap<2.5;      // name tag: during the roll call, or after a tap
  if(tag){const nm=rdName(r);g.font=FONT(11);sign(xx,r.y-h-68,g.measureText(nm).width+14,14,nm,'#FFFFFF','#8A3A2A');}
  hit('reindeer',xx-22,r.y-58,xx+24,r.y+2,{small:1,ref:{i,label:rdName(r)}});}));
/* paddock fence: back with gaps for the stable, sides, front */
S(140,[-990,120,-630,146],()=>{for(let x=-985;x<=-630;x+=21){if(x>-880&&x<-690)continue;rr(x,126,4,16,1,'#8A5A3B');}
  rr(-985,130,110,3,1,'#9A6440');rr(-985,138,110,3,1,'#9A6440');rr(-695,130,65,3,1,'#9A6440');rr(-695,138,65,3,1,'#9A6440');
  for(let y=150;y<=320;y+=22){rr(-989,y,4,14,1,'#8A5A3B');rr(-633,y,4,14,1,'#8A5A3B');}});
S(352,[-990,330,-630,356],()=>{for(let x=-985;x<=-630;x+=21){rr(x,336,4,16,1,'#8A5A3B');}rr(-989,340,360,3,1,'#9A6440');rr(-989,348,360,3,1,'#9A6440');});
/* the toy factory: the front is open so you can watch the elves */
function elf(x,y,c,arm,s){s=s||1;rr(x-4*s,y-11*s,8*s,10*s,3*s,c);rr(x-4*s,y-3*s,8*s,2.4*s,1,'#2B2233');circ(x,y-15*s,4.4*s,'#F6D2B4');
  poly('#F6D2B4',x-4.4*s,y-16*s,x-7.6*s,y-18*s,x-4*s,y-14*s);poly('#F6D2B4',x+4.4*s,y-16*s,x+7.6*s,y-18*s,x+4*s,y-14*s);
  poly(c,x-4.6*s,y-17*s,x+4.6*s,y-17*s,x+6*s,y-27*s);circ(x+6*s,y-27*s,1.6*s,'#FFD23F');circ(x-1.5*s,y-15*s,0.7*s,'#222');circ(x+1.5*s,y-15*s,0.7*s,'#222');
  ln('#F6D2B4',2*s,x+3*s,y-9*s,x+3*s+Math.cos(arm)*6*s,y-9*s+Math.sin(arm)*6*s);}
const PCOL=['#FF5A5F','#3CC8F5','#FFC928','#7ED957','#B78CFF'];
function present(x,y,s,c,wrapped){if(wrapped){rr(x-6*s,y-10*s,12*s,10*s,1.5,c);rr(x-1.2*s,y-10*s,2.4*s,10*s,0,'#FFFFFF');rr(x-6*s,y-6*s,12*s,2.4*s,0,'#FFFFFF');
  ell(x-2.4*s,y-11*s,2.6*s,1.8*s,'#FFFFFF',-0.5);ell(x+2.4*s,y-11*s,2.6*s,1.8*s,'#FFFFFF',0.5);}else{rr(x-6*s,y-10*s,12*s,10*s,1.5,'#C9A06A');ln('#A8804A',1,x-6*s,y-7*s,x+6*s,y-7*s);}}
S(602,[-1260,360,-800,604],()=>{const T=TT(),t=fx('factory'),spd=t<5?70:24,x=-1250,y=520,w=440,d=82,h=134,Ye=y+d-h,base=y+d;
  rr(x+6,base-5,w+8,10,5,'rgba(0,0,0,.12)');rr(x,y-h,w,d,4,'#B9C1CC');rr(x-6,y-h-6,w+12,14,7,'#FFFFFF');
  [[x+40],[x+w-80]].forEach(([cx])=>{rr(cx,y-h-30,22,40,2,'#9A6440');rr(cx-3,y-h-34,28,7,3,'#FFFFFF');if(Math.random()<0.05)puff(cx+11,y-h-36,{c:'#FFFFFF',r:5});});
  rr(x,Ye,w,h,[0,0,4,4],'#C8392D');g.fillStyle='rgba(255,255,255,.12)';for(let k=0;k<w;k+=22)g.fillRect(x+k,Ye,2,h);
  sign(x+w/2,Ye+14,200,18,L3(['WICHTEL-WERKSTATT','TOY FACTORY','FÁBRICA DE JUGUETES']),'#FFFFFF','#C8392D');
  const ix=x+20,iy=Ye+30,iw=w-40,ih=h-38;rr(ix-4,iy-4,iw+8,ih+8,8,'#7A3A2A');rr(ix,iy,iw,ih,6,'#FFF0D8');
  g.save();g.beginPath();g.rect(ix,iy,iw,ih);g.clip();
  rr(ix,iy,iw,24,0,'#F2DDB8');for(let k=0;k<6;k++){rr(ix+10+k*66,iy+6,50,4,1,'#9A6440');[0,1,2].forEach(j=>{const c=PCOL[(k+j)%5];if(j===0)circ(ix+20+k*66,iy+1,5,c);else if(j===1)rr(ix+30+k*66,iy-4,8,10,2,c);else{rr(ix+44+k*66,iy-2,6,8,1,'#C9A06A');}});}
  [[ix+60,iy+40],[ix+iw-80,iy+40]].forEach(([gx,gy],k)=>{g.save();g.translate(gx,gy);g.rotate(T*(k?-1:1)*(t<5?3:1));for(let a=0;a<8;a++){g.rotate(TAU/8);rr(-3,-15,6,6,1,'#9AA4B8');}circ(0,0,11,'#9AA4B8');circ(0,0,4,'#7E889C');g.restore();});
  const by=iy+ih-22;rr(ix,by,iw,10,3,'#4F5568');for(let k=0;k<iw;k+=14)circ(ix+7+((k+T*spd)%iw),by+5,2,'#7E889C');
  for(let k=0;k<9;k++){const px=ix+((k*52+T*spd)%(iw+40))-20,wrapped=px>ix+iw*0.45;present(px,by,1.3,PCOL[k%5],wrapped);}
  const arm=Math.sin(T*(t<5?14:6));elf(ix+iw*0.25,by-1+0,'#3E9A45',-1.2+arm*0.6,1.6);elf(ix+iw*0.47,by-1,'#D9302A',-1.4+arm*0.8,1.6);elf(ix+iw*0.72,by-1,'#3E9A45',-0.6-arm*0.6,1.6);
  rr(ix+iw*0.45-6,by-34,12,8,2,'#FFD23F');ln('#7E889C',2,ix+iw*0.45,by-26,ix+iw*0.45,by-10);
  g.restore();
  rr(x+w,base-40,40,10,3,'#9AA4B8');poly('#9AA4B8',x+w+40,base-40,x+w+60,base-14,x+w+50,base-10,x+w+34,base-30);
  hit('factory',x-6,y-h-34,x+w+6,base);
  hit('elf',ix,by-50,ix+iw,by+4,{small:1});});
S(624,[-800,560,-700,628],()=>{const T=TT(),t=fx('presents'),boost=t<3?1:0;
  [[-780,622,0],[-760,624,1],[-740,620,2],[-770,606,3],[-750,604,4],[-760,590,0],[-722,624,3]].forEach(([px,py,c],k)=>present(px,py-(boost?Math.abs(Math.sin(t*8+k))*8:0),1.4,PCOL[c],true));
  hit('presents',-796,570,-704,626,{small:1});});
/* elves walking with presents */
K.DYN.push(L=>{if(!inV(-820,600,-560,700))return;const T=TT();[0,1].forEach(i=>{const u=(T*0.08+i*0.5)%1,dir=u<0.5?1:-1,uu=u<0.5?u*2:(1-u)*2,x=-800+uu*220,y=660+i*16;
  L.push({y,f:()=>{elf(x,y,i?'#D9302A':'#3E9A45',-2.2,1.4);if(dir>0)present(x,y-26,0.9,PCOL[i+1],true);hit('elf',x-8,y-40,x+8,y,{moving:1,small:1});}});});});
/* the sleigh and its flight around the world */
const SL={t:-1},SLHOME=[-560,712];
const SLPATH=(()=>{const P=[SLHOME,[-420,560],[-100,200],[400,-150],[1300,-350],[2300,-100],[3300,300],[3700,1000],[2900,1500],[1800,1400],[900,1100],[200,1000],[-400,900],[-660,780],SLHOME],out=[];
  for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
    for(let k=0;k<10;k++){const t=k/10,t2=t*t,t3=t2*t;out.push([0,1].map(j=>0.5*((2*p1[j])+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)));}}
  out.push(SLHOME);return out;})();
function slState(){if(SL.t<0)return {x:SLHOME[0],y:SLHOME[1],f:1,air:0};const u=Math.min(1,SL.t/24),fp=u*(SLPATH.length-1),i=Math.min(SLPATH.length-2,fp|0),k=fp-i,a=SLPATH[i],b=SLPATH[i+1];
  return {x:a[0]+(b[0]-a[0])*k,y:a[1]+(b[1]-a[1])*k,f:b[0]>=a[0]?1:-1,air:u>0.01&&u<0.99};}
function drawSleigh(p){const T=TT(),s=p.air?1.4:1;g.save();g.translate(p.x,p.y);g.scale(p.f*s,s);
  if(!p.air)ell(10,1,60,6,'rgba(0,0,0,.12)');
  if(p.air)for(let r=0;r<2;r++)for(let c=0;c<5;c++){if(c===4&&r)continue;const lead=c===4,gx=34+c*30,gy=lead?-5:-2-r*6,run=Math.sin(T*10+c+r)*0.5,col=RD[lead?0:1+c*2+r].c;
    g.save();g.translate(gx,gy);[-8,-5,5,8].forEach((lx,k)=>{g.save();g.translate(lx,-9);g.rotate((k%2?run:-run));rr(-1,0,2.4,9,1,'#7A5235');g.restore();});
    ell(0,-12,11,5.5,col);g.save();g.translate(9,-15);rr(-2,-10,5,11,2,col);ell(4,-11,5,3.2,col);
    circ(8,-10.5,lead?2.4:1.2,lead?'#FF2A2A':'#3A2A20');ln('#C9A87A',1.2,1,-13,-2,-22);ln('#C9A87A',1.2,3,-13,6,-22);g.restore();g.restore();}
  if(p.air){ln('#C9A040',1.2,18,-14,154,-18);ln('#C9A040',1.2,18,-10,124,-12);}
  g.strokeStyle='#C9A040';g.lineWidth=2.4;g.beginPath();g.moveTo(-34,0);g.lineTo(18,0);g.quadraticCurveTo(28,0,26,-8);g.stroke();
  poly('#D9302A',-30,-4,14,-4,22,-22,-34,-26);poly('#B8261E',-34,-26,-26,-30,-22,-26);rr(-32,-26,48,4,2,'#FFD23F');
  ell(-22,-30,12,10,'#8A5A3B');[0,1,2].forEach(k=>rr(-30+k*7,-40,6,6,1,PCOL[k]));
  circ(2,-36,7,'#F6D2B4');ell(2,-31,7,5,'#FFFFFF');poly('#D9302A',-5,-40,9,-40,12,-50,0,-47);circ(12,-50,2.4,'#FFFFFF');rr(-6,-30,14,10,4,'#D9302A');
  g.restore();
  if(p.air){if(Math.random()<0.6)PARTS.push({x:p.x-p.f*40*s,y:p.y-14*s,vx:-p.f*rnd(10,30),vy:rnd(-10,10),life:0,max:1.2,k:'star',r:3,c:['#FFD23F','#FFFFFF'][Math.random()*2|0],gr:10});
    if(p.x>0&&p.x<1200&&p.y>0&&p.y<1500&&Math.random()<0.04)PARTS.push({x:p.x,y:p.y,vx:rnd(-20,20),vy:30,life:0,max:2.2,k:'emoji',t:'🎁',r:14,gr:60});
    LIGHTS.push(p.x+p.f*162*s,p.y-29*s,40,'#FF3030');}
  if(p.air)hit('sleigh',p.x+Math.min(-50*p.f,180*p.f)*s,p.y-56*s,p.x+Math.max(-50*p.f,180*p.f)*s,p.y+4*s,{moving:1,small:1});
  else hit('sleigh',p.x-50,p.y-56,p.x+40,p.y+4,{moving:1,small:1});}
K.UPDATE.push(dt=>{if(SL.t>=0){SL.t+=dt;if(SL.t>24)SL.t=-1;}});
K.DYN.push(L=>{const p=slState();if(p.air)return;if(inV(p.x-80,p.y-80,p.x+120,p.y+10))L.push({y:p.y,f:()=>drawSleigh(p)});});
K.TOP.push(()=>{const p=slState();if(p.air)drawSleigh(p);});
/* ice rink with skaters, penguins, polar bear, arctic fox, snowy owl, snowmen, gingerbread house */
S(184,[-600,70,-300,190],()=>{const T=TT(),t=fx('rink');for(let k=0;k<3;k++){const a=T*(t<4?1.4:0.6)+k*TAU/3,x=-450+Math.cos(a)*90,y=128+Math.sin(a)*32,sp=t<4&&k===0?T*12:0;
  g.save();g.translate(x,y);g.scale(Math.cos(sp)>=0?1:-1,1);kid(0,0,PCOL[k],SKIN[k],HAIR[k],1.3);rr(-6,-2,5,2,1,'#9AA4B8');rr(1,-2,5,2,1,'#9AA4B8');
  rr(-4,-20,8,3,1,PCOL[(k+2)%5]);g.restore();}hit('rink',-590,80,-310,180);});
const PENG=[[-300,214],[-276,224],[-322,232]];
PENG.forEach(([x,y],i)=>S(y,[x-14,y-26,x+14,y+2],()=>{const T=TT(),t=fx('penguin'),w=Math.sin(T*6+i)*(t<3?0.35:0.12),xx=x+(t<3?Math.sin(t*3+i)*10:0);
  g.save();g.translate(xx,y);g.rotate(w);ell(0,-10,7,10,'#2B2233');ell(0,-8,4.6,7.4,'#FFFFFF');circ(0,-19,5,'#2B2233');ell(-1.6,-19,1.6,1.8,'#FFFFFF');ell(1.6,-19,1.6,1.8,'#FFFFFF');
  circ(-1.6,-19,0.8,'#222');circ(1.6,-19,0.8,'#222');poly('#F2A33A',-2,-17,2,-17,0,-14);ell(-3,0,3,1.4,'#F2A33A');ell(3,0,3,1.4,'#F2A33A');g.restore();
  hit('penguin',xx-10,y-26,xx+10,y+2,{small:1});}));
S(-104,[-300,-170,-180,-100],()=>{const T=TT(),t=fx('polarbear'),x=-240,y=-104,st=t<2.5?1:0;
  ell(-240,-100,60,14,'#FFFFFF');g.save();g.translate(x,y);ell(0,1,26,5,'rgba(0,0,0,.1)');
  [-14,-8,8,14].forEach(lx=>rr(lx-3,-12,6,12,3,'#EEF0F2'));ell(0,-18,24,13,'#F6F7F9');
  g.save();g.translate(22,st?-30:-20);circ(0,0,9,'#F6F7F9');circ(-5,-7,3,'#F6F7F9');ell(7,2,5,4,'#F6F7F9');circ(10,1,1.6,'#222');circ(2,-2,1.2,'#222');if(st)ell(8,5,2,1.6,'#5A2A2A');g.restore();g.restore();
  hit('polarbear',x-28,y-42,x+34,y+2,{small:1});});
S(-150,[-1030,-180,-970,-140],()=>{const T=TT(),t=fx('arcticfox'),out=t<6,x=-1000,y=-150;ell(x,y,24,8,'#E3ECF7');ell(x,y-2,14,5,'#C8D6E8');
  if(out){const up=Math.min(1,t*2)*(t>5?6-t:1);g.save();g.beginPath();g.rect(x-30,y-50,60,48);g.clip();g.translate(x,y-up*12);
    ell(0,-4,9,9,'#FFFFFF');circ(0,-14,6,'#FFFFFF');poly('#FFFFFF',-5,-17,-4,-24,-1,-19);poly('#FFFFFF',5,-17,4,-24,1,-19);circ(-2,-15,1,'#222');circ(2,-15,1,'#222');circ(0,-12,1.2,'#222');g.restore();}
  else if((TT()%5)<0.8){circ(x-3,y-4,1,'#222');circ(x+3,y-4,1,'#222');}
  hit('arcticfox',x-20,y-24,x+20,y+4,{small:1});});
S(-40,[-720,-150,-640,-36],()=>{const T=TT(),t=fx('snowyowl'),x=-680,y=-40;
  rr(x-3,y-14,6,14,2,'#7A4E33');for(let k=0;k<4;k++){const yy=y-10-k*16,w=24-k*5;poly('#2F7A55',x-w,yy,x+w,yy,x,yy-24);rr(x-w+3,yy-3,2*w-6,3,1,'#FFFFFF');}
  const fl=t<1.5?Math.sin(t*20)*0.5:0,ox=x+4,oy=y-56;g.save();g.translate(ox,oy);
  ell(-7,-4,4,8,'#FFFFFF',-0.3-fl);ell(7,-4,4,8,'#FFFFFF',0.3+fl);ell(0,-6,8,10,'#FFFFFF');circ(-3,-9,1,'#2B2233');circ(3,-4,1,'#2B2233');
  circ(-3.4,-11,2.8,'#FFE14D');circ(3.4,-11,2.8,'#FFE14D');circ(-3.4,-11,1.3,'#222');circ(3.4,-11,1.3,'#222');poly('#2B2233',-1,-9,1,-9,0,-6);g.restore();
  hit('snowyowl',ox-12,oy-20,ox+12,oy+6,{small:1});});
[[-620,-150],[-140,290],[-1250,660]].forEach(([x,y])=>S(y,[x-20,y-56,x+20,y+4],()=>{ell(x,y-10,15,13,'#FFFFFF');ell(x,y-31,11,10,'#FFFFFF');ell(x,y-47,8,8,'#FFFFFF');
  circ(x-3,y-49,1.2,'#222');circ(x+3,y-49,1.2,'#222');poly('#FF8A3D',x,y-46,x+9,y-45,x,y-44);rr(x-10,y-40,20,4,2,'#D9302A');rr(x+4,y-40,4,12,2,'#D9302A');
  rr(x-8,y-57,16,4,1,'#2B2233');rr(x-5,y-66,10,10,1,'#2B2233');hit('snowman',x-16,y-66,x+16,y);}));
S(664,[-360,560,-230,666],()=>{const x=-350,y=620,w=110,d=44,h=50,{Ye,Yr}=gableB(x,y,w,d,h,'#C8823E','#A8642A');snowRoof(x,Yr,Ye,w);
  for(let k=0;k<6;k++)circ(x+10+k*18,Ye+8,3.6,PCOL[k%5]);rr(x+w/2-10,y+d-26,20,26,[10,10,0,0],'#7A4E33');
  [[x+12,Ye+20],[x+w-30,Ye+20]].forEach(([wx,wy])=>{rr(wx,wy,18,14,3,'#FFF6D8');ln('#FFFFFF',2,wx,wy+7,wx+18,wy+7);});
  for(let k=0;k<5;k++)rr(x+k*24,y+d-4,10,4,2,k%2?'#FFFFFF':'#D9302A');hit('gingerbread',x-8,Yr-8,x+w+8,y+d);});
S(440,[-160,380,-80,444],()=>{rr(-122,402,4,40,1,'#FFFFFF');for(let k=0;k<5;k++)rr(-122,404+k*8,4,4,0,'#D9302A');sign(-120,402,84,16,L3(['NORDPOL','NORTH POLE','POLO NORTE']),'#D9302A','#FFFFFF');hit('northpole',-164,390,-76,444);});
[[-990,420],[-640,420],[-300,420],[-990,760],[-500,760]].forEach(([x,y])=>S(y,[x-6,y-44,x+6,y+2],()=>{rr(x-2,y-38,4,38,2,'#FFFFFF');for(let k=0;k<5;k++)poly('#D9302A',x-2,y-36+k*8,x+2,y-38+k*8,x+2,y-34+k*8,x-2,y-32+k*8);
  circ(x,y-40,4,ST.NIGHT>0.3?'#FFF3B0':'#E9ECF2');LIGHTS.push(x,y-38,40,'#FFE9A0');}));
/* snow falling over the village */
K.TOP.push(()=>{if(!inV(SNOWX0,SNOWY0-300,SNOWX1,SNOWY1))return;const T=TT();g.fillStyle='rgba(255,255,255,.9)';
  for(const [fx0,fy0,s] of FLAKES){const x=SNOWX0+((fx0*1370+Math.sin(T*0.8+fy0*9)*14)%1370),y=SNOWY0-200+((fy0*1270+T*26*s)%1270);if(!inV(x-3,y-3,x+3,y+3))continue;
    g.beginPath();g.arc(x,y,1.8*s,0,TAU);g.fill();}});

/* =============================================================
   SPOOKY CORNER
============================================================= */
S(1000,[-1180,800,-920,1004],()=>{const T=TT();circ(-1050,880,70,'#FFF6C8');circ(-1072,862,12,'#EDE3B0');circ(-1030,900,9,'#EDE3B0');circ(-1040,860,6,'#EDE3B0');
  LIGHTS.push(-1050,880,140,'#FFF6C8');hit('moon',-1120,810,-980,950);});
S(1176,[-1200,940,-880,1180],()=>{const T=TT(),t=fx('vampcastle'),x=-1170,y=1110,w=260,base=1176;
  rr(x+6,base-6,w,10,4,'rgba(0,0,0,.2)');
  [[x-6,1.3],[x+w-30,1.1],[x+w/2-18,1.6]].forEach(([tx,s],k)=>{const th=110*s;rr(tx,base-th,36,th,[2,2,0,0],'#4A4458');poly('#5B3A7A',tx-6,base-th,tx+18,base-th-50*s,tx+42,base-th);
    ln('#2B2233',1.2,tx+18,base-th-50*s,tx+18,base-th-62*s);poly('#8E3A8A',tx+18,base-th-62*s,tx+30,base-th-58*s,tx+18,base-th-54*s);
    rr(tx+12,base-th+18,12,18,[6,6,0,0],'#FFC94A');LIGHTS.push(tx+18,base-th+27,30,'#FFC94A');GLOW.push([tx+18,base-th+27,26]);});
  rr(x,base-72,w,72,0,'#555068');for(let k=0;k<w;k+=20)rr(x+k,base-82,12,12,1,'#555068');
  for(let k=0;k<4;k++){const wx=x+24+k*60;if(k===2)continue;rr(wx,base-56,14,20,[7,7,0,0],'#FFC94A');GLOW.push([wx+7,base-46,22]);LIGHTS.push(wx+7,base-46,26,'#FFC94A');}
  rr(x+w/2-20,base-46,40,46,[20,20,0,0],'#2B1830');circ(x+w/2+12,base-22,2,'#C9A040');
  hit('vampcastle',x-12,base-260,x+w+12,base);});
/* Count Dracula in front of his castle: tap him and he spreads his cape, turns into a bat, flies a loop and comes back */
function dracula(x,y,spread,T){g.save();g.translate(x,y);const sw=Math.sin(T*1.6)*0.06;
  g.fillStyle='#1E1A2A';g.beginPath();g.moveTo(-6,-40);g.lineTo(-14-spread*26,-34-spread*8);g.lineTo(-18-spread*22,0);g.lineTo(18+spread*22,0);g.lineTo(14+spread*26,-34-spread*8);g.lineTo(6,-40);g.closePath();g.fill();
  g.fillStyle='#B8262E';g.beginPath();g.moveTo(-5,-38);g.lineTo(-11-spread*22,-31-spread*6);g.lineTo(-14-spread*18,-2);g.lineTo(14+spread*18,-2);g.lineTo(11+spread*22,-31-spread*6);g.lineTo(5,-38);g.closePath();g.fill();
  rr(-6,-12,4.6,12,1,'#1E1A2A');rr(1.4,-12,4.6,12,1,'#1E1A2A');rr(-7,-36,14,26,4,'#2B2233');poly('#FFFFFF',-3,-36,3,-36,0,-26);circ(0,-26,2.2,'#D9302A');
  poly('#1E1A2A',-12,-36,-7,-40,-6,-30);poly('#1E1A2A',12,-36,7,-40,6,-30);
  g.save();g.rotate(sw);ell(0,-46,7,8,'#E6E6F0');poly('#E6E6F0',-7,-47,-10,-51,-6,-44);poly('#E6E6F0',7,-47,10,-51,6,-44);
  g.fillStyle='#1E1A2A';g.beginPath();g.moveTo(-7.5,-47);g.quadraticCurveTo(-7,-56,0,-55);g.quadraticCurveTo(7,-56,7.5,-47);g.lineTo(3,-50);g.lineTo(0,-46);g.lineTo(-3,-50);g.closePath();g.fill();
  circ(-2.6,-46,1.2,'#2B2233');circ(2.6,-46,1.2,'#2B2233');ln('#2B2233',1,-4,-49,-1.4,-48.4);ln('#2B2233',1,4,-49,1.4,-48.4);
  g.strokeStyle='#2B2233';g.lineWidth=1;g.beginPath();g.arc(0,-42.5,2.6,0.2,Math.PI-0.2);g.stroke();poly('#FFFFFF',-1.8,-40.4,-1,-38.6,-0.4,-40.4);poly('#FFFFFF',0.4,-40.4,1,-38.6,1.8,-40.4);g.restore();
  g.restore();}
S(1206,[-1020,1130,-960,1210],()=>{const T=TT(),t=fx('vampire'),x=-990,y=1206;
  const spread=t<0.7?sm(t/0.7):t<3.6?1:t<4.2?1-sm((t-3.6)/0.6):0,gone=t>=0.9&&t<3.6;
  ell(x,y+1,14,4,'rgba(0,0,0,.25)');
  if(!gone)dracula(x,y,spread,T);
  else{const u=(t-0.9)/2.7,a=u*TAU,bx=x+Math.sin(a)*90,by=y-60-Math.sin(u*Math.PI)*90+Math.cos(a)*20,fl=Math.sin(T*18)*5;
    g.save();g.translate(bx,by);g.scale(1.6,1.6);poly('#1E1A2A',0,0,-12,-4-fl,-8,2,-14,3-fl*0.5,-4,4);poly('#1E1A2A',0,0,12,-4-fl,8,2,14,3-fl*0.5,4,4);ell(0,1,3.6,4.4,'#1E1A2A');
    circ(-1.2,0,0.8,'#FF3B3B');circ(1.2,0,0.8,'#FF3B3B');g.restore();}
  if((t>0.7&&t<1)||(t>3.4&&t<3.7))for(let k=0;k<3;k++)puff(x+rnd(-14,14),y-30+rnd(-14,14),{c:'#8E6AC8',r:6,vy:-10,max:0.9});
  hit('vampire',x-20,y-58,x+20,y+2,{small:1});});
/* bats circling the castle */
K.TOP.push(()=>{const T=TT(),t=fx('bat');if(!inV(-1300,700,-800,1200))return;
  for(let k=0;k<7;k++){const a=T*(0.6+k*0.07)+k,r=t<3?160+k*12:90+k*10,x=-1040+Math.cos(a)*r,y=960+Math.sin(a*1.3)*50-k*6,fl=Math.sin(T*16+k)*5;
    g.save();g.translate(x,y);poly('#2B2233',0,0,-12,-4-fl,-8,2,-14,3-fl*0.5,-4,4);poly('#2B2233',0,0,12,-4-fl,8,2,14,3-fl*0.5,4,4);ell(0,1,3.6,4.4,'#2B2233');
    poly('#2B2233',-2,-2,-3,-6,-0.5,-3);poly('#2B2233',2,-2,3,-6,0.5,-3);circ(-1.2,0,0.7,'#FFD23F');circ(1.2,0,0.7,'#FFD23F');g.restore();
    if(k===0)hit('bat',x-16,y-10,x+16,y+8,{moving:1,small:1});}});
/* graveyard */
const STONES=[[-620,1300],[-560,1290],[-500,1306],[-440,1294],[-600,1360],[-530,1370],[-460,1356],[-390,1368],[-340,1300]];
S(1420,[-660,1250,-300,1424],()=>{const T=TT(),t=fx('graveyard');
  for(let x=-660;x<=-300;x+=14){rr(x,1404,2.4,18,1,'#2B2233');poly('#2B2233',x-1.5,1404,x+1.2,1398,x+3.8,1404);}rr(-660,1408,362,2.4,1,'#2B2233');
  STONES.forEach(([x,y],k)=>{ell(x+4,y+2,14,4,'rgba(0,0,0,.2)');if(k%3===1){rr(x-3,y-30,6,30,1,'#8E8A9E');rr(x-11,y-23,22,6,1,'#8E8A9E');}
    else{rr(x-11,y-26,22,26,[11,11,2,2],'#9A96AA');rr(x-11,y-26,8,26,[11,0,0,2],'#ADA9BC');ln('#6E6A80',1.2,x-5,y-14,x+5,y-14);ln('#6E6A80',1.2,x-5,y-9,x+3,y-9);}
    ell(x,y+4,12,3,'#3E3852');});
  if(t<5){for(let k=0;k<4;k++){const [sx,sy]=STONES[k*2],u=Math.min(1,(t-k*0.2)/2);if(u<=0)continue;ghost(sx+Math.sin(T*2+k)*10,sy-20-u*60-(t>3?(t-3)*40:0),0.9,t>4?5-t:1);}}
  hit('graveyard',-660,1250,-300,1424);});
function ghost(x,y,s,a){const T=TT();g.globalAlpha=Math.max(0,Math.min(1,a))*0.9;g.fillStyle='#F4F2FF';g.beginPath();g.moveTo(x-12*s,y);g.arc(x,y-6*s,12*s,Math.PI,0);
  for(let k=0;k<=4;k++){const px=x+12*s-k*6*s,py=y+14*s+(k%2?-4:0)*s+Math.sin(T*6+k)*2;g.lineTo(px,py);}g.closePath();g.fill();
  ell(x-4*s,y-8*s,2.4*s,3.4*s,'#2B2233');ell(x+4*s,y-8*s,2.4*s,3.4*s,'#2B2233');ell(x,y,3*s,3.6*s,'#2B2233');g.globalAlpha=1;}
K.TOP.push(()=>{const T=TT(),x=-480+Math.sin(T*0.4)*160,y=1230+Math.sin(T*0.9)*30,t=fx('ghost');if(!inV(x-30,y-40,x+30,y+30))return;
  ghost(x,y-(t<2?Math.sin(t/2*Math.PI)*40:0),1.4,0.85);hit('ghost',x-18,y-26,x+18,y+20,{moving:1,small:1});});
S(1342,[-380,1300,-330,1346],()=>{const T=TT(),t=fx('skeleton'),up=t<4?Math.min(1,t*2)*(t>3.5?(4-t)*2:1):0,x=-354,y=1340;
  if(up>0.05){g.save();g.beginPath();g.rect(x-30,y-80,60,78);g.clip();g.translate(x,y+(1-up)*40);
    circ(0,-46,8,'#F2EDE4');circ(-3,-47,2.2,'#2B2233');circ(3,-47,2.2,'#2B2233');rr(-4,-41,8,3,1,'#2B2233');
    rr(-1.2,-38,2.4,22,1,'#F2EDE4');for(let k=0;k<4;k++)rr(-7,-34+k*5,14,2,1,'#F2EDE4');const wv=Math.sin(T*10)*0.6;
    g.save();g.translate(6,-34);g.rotate(-1.4+wv);rr(0,-1.2,14,2.4,1,'#F2EDE4');circ(14,0,2.4,'#F2EDE4');g.restore();ln('#F2EDE4',2.4,-6,-34,-12,-22);g.restore();}
  ell(x,y+2,14,4,'#3E3852');hit('skeleton',x-14,y-56,x+14,y+4,{small:1});});
/* dead trees, a raven and a spider */
function deadTree(x,y,s){g.strokeStyle='#2B2233';g.lineCap='round';g.lineWidth=7*s;g.beginPath();g.moveTo(x,y);g.lineTo(x+2*s,y-50*s);g.stroke();g.lineWidth=3.4*s;g.beginPath();
  g.moveTo(x+1*s,y-30*s);g.lineTo(x-18*s,y-50*s);g.lineTo(x-24*s,y-48*s);g.moveTo(x+2*s,y-44*s);g.lineTo(x+20*s,y-62*s);g.lineTo(x+28*s,y-60*s);g.moveTo(x+2*s,y-50*s);g.lineTo(x-4*s,y-70*s);g.moveTo(x+20*s,y-62*s);g.lineTo(x+22*s,y-74*s);g.stroke();g.lineCap='butt';
  ell(x+4,y+1,16*s,4*s,'rgba(0,0,0,.2)');}
const DEAD=[[-800,1000,1.2],[-260,980,1],[-1300,1300,1.1],[-860,1520,1.3],[-160,1560,1],[-700,1660,0.9],[-1360,960,0.9],[-560,1100,1]];
DEAD.forEach(([x,y,s])=>S(y,[x-34,y-80,x+34,y+4],()=>{deadTree(x,y,s);hit('spooky',x-24,y-70*s,x+24,y);}));
S(1101,[-590,1000,-530,1102],()=>{const T=TT(),t=fx('raven'),fly=t<3,x=-560+(fly?Math.sin(t/3*Math.PI)*50:0),y=1100-62-(fly?Math.sin(t/3*Math.PI)*60:0);
  g.save();g.translate(x,y);if(fly){const f=Math.sin(T*14)*5;poly('#1E1A2A',0,0,-14,-6-f,-6,2);poly('#1E1A2A',0,0,14,-6-f,6,2);}
  ell(0,0,6,4.6,'#1E1A2A');circ(5,-4,3.4,'#1E1A2A');poly('#3A3448',7,-4,12,-3,7,-2);circ(5.6,-4.6,0.8,'#FFD23F');poly('#1E1A2A',-5,0,-12,3,-5,3);g.restore();
  hit('raven',x-12,y-10,x+12,y+6,{small:1});});
S(1001,[-290,920,-230,1002],()=>{const T=TT(),t=fx('spider'),drop=t<4?Math.sin(Math.min(1,t/1.2)*Math.PI/2)*40*(t>3?(4-t):1):6+Math.sin(T)*4,x=-252,y0=948;
  g.strokeStyle='rgba(240,240,255,.7)';g.lineWidth=0.8;for(let k=0;k<6;k++){g.beginPath();g.moveTo(-262,y0-12);g.lineTo(-262+Math.cos(k/6*Math.PI-Math.PI)*18,y0-12+Math.sin(k/6*Math.PI-Math.PI)*18);g.stroke();}
  for(let r=5;r<18;r+=5){g.beginPath();g.arc(-262,y0-12,r,Math.PI,TAU);g.stroke();}
  ln('rgba(240,240,255,.8)',0.8,x,y0-30,x,y0+drop);const sy=y0+drop;circ(x,sy,4,'#2B2233');circ(x,sy-4,2.6,'#2B2233');
  for(let k=0;k<4;k++){ln('#2B2233',1,x,sy,x-7,sy-4+k*3);ln('#2B2233',1,x,sy,x+7,sy-4+k*3);}circ(x-1,sy-4.6,0.6,'#E8443A');circ(x+1,sy-4.6,0.6,'#E8443A');
  hit('spider',x-10,sy-10,x+10,sy+8,{small:1});});
S(1300,[-1040,1250,-980,1302],()=>{const T=TT(),t=fx('blackcat'),arch=t<3?1:0,x=-1010,y=1296;
  rr(x-24,y-14,48,14,2,'#6E6684');g.save();g.translate(x,y-14);
  g.strokeStyle='#1E1A2A';g.lineWidth=2.6;g.lineCap='round';g.beginPath();g.moveTo(-7,-4);g.quadraticCurveTo(-16,-14-arch*6,-12,-20);g.stroke();g.lineCap='butt';
  ell(0,-6-arch*4,9,6+arch*2,'#1E1A2A');circ(8,-12-arch*3,5,'#1E1A2A');poly('#1E1A2A',4,-15-arch*3,5,-21-arch*3,8,-16-arch*3);poly('#1E1A2A',9,-16-arch*3,12,-21-arch*3,12,-14-arch*3);
  circ(7,-12-arch*3,1.3,'#B5E61D');circ(10,-12-arch*3,1.3,'#B5E61D');g.restore();
  hit('blackcat',x-18,y-36,x+20,y,{small:1});});
/* pumpkin patch */
const PUMPK=[];for(let r=0;r<3;r++)for(let c=0;c<5;c++)PUMPK.push([-1280+c*58+(r%2)*26,1420+r*50,0.9+((r*5+c)%3)*0.15,(r+c)%3===0]);
PUMPK.forEach(([x,y,s,face],i)=>S(y,[x-16,y-24,x+16,y+4],()=>{const T=TT(),t=fx('pumpkin'),b=t<2?1.4:1;
  ell(x,y-9*s,14*s,10*s,'#F2862A');ell(x-6*s,y-9*s,6*s,9*s,'#E0761A');ell(x+6*s,y-9*s,6*s,9*s,'#E0761A');ell(x,y-9*s,5*s,10*s,'#F59A3A');rr(x-1.6*s,y-22*s,3.2*s,5*s,1,'#4C7A2E');
  if(face){const fl=0.7+Math.sin(T*9+i)*0.15;poly(`rgba(255,${200*fl|0},60,1)`,x-7*s,y-12*s,x-3*s,y-12*s,x-5*s,y-16*s);poly(`rgba(255,${200*fl|0},60,1)`,x+3*s,y-12*s,x+7*s,y-12*s,x+5*s,y-16*s);
    poly(`rgba(255,${200*fl|0},60,1)`,x-8*s,y-7*s,x+8*s,y-7*s,x+5*s,y-3*s,x+2*s,y-6*s,x,y-3*s,x-2*s,y-6*s,x-5*s,y-3*s);GLOW.push([x,y-9*s,20*b]);LIGHTS.push(x,y-9,30*b,'#FF9A2A');}
  hit('pumpkin',x-15*s,y-24*s,x+15*s,y+2,{small:1});}));
/* witch's hut with bubbling cauldron, and the witch flying on her broom */
S(1092,[-420,960,-240,1096],()=>{const T=TT(),x=-400,y=1050,w=110,d=40,h=56;
  g.save();g.translate(x+w/2,y+d);g.rotate(-0.04);const {Ye,Yr}=gableB(-w/2,-d,w,d,h,'#6E5A4A','#3E3352');g.restore();
  rr(x+w/2-10,y+d-26,20,26,[10,10,0,0],'#2B1E1A');rr(x+12,y+d-44,16,14,3,'#B5E61D');GLOW.push([x+20,y+d-37,20]);
  const cx=x+w+30,cy=y+d+4,ct=fx('cauldron'),b=ct<3?1:0.4;
  for(let k=0;k<3;k++)ln('#3A3448',3,cx-14+k*14,cy+2,cx-10+k*10,cy-6);
  poly('#FF7A2A',cx-10,cy+2,cx,cy-8,cx+10,cy+2);ell(cx,cy-14,18,12,'#2B2233');ell(cx,cy-22,17,5,'#7ED957');GLOW.push([cx,cy-22,26]);
  if(Math.random()<0.15*b*3){PARTS.push({x:cx+rnd(-10,10),y:cy-24,vx:rnd(-6,6),vy:rnd(-30,-15),life:0,max:1.2,k:'drop',r:rnd(4,8),c:['#9BE15D','#B5E61D','#C08AF0'][Math.random()*3|0],gr:-5});}
  hit('cauldron',cx-20,cy-30,cx+20,cy+4);hit('spooky',x-6,y-70,x+w+6,y+d);});
K.TOP.push(()=>{const T=TT(),t=fx('witch'),a=T*(t<3?0.6:0.25),x=-760+Math.cos(a)*520,y=1180+Math.sin(a)*260-60,f=-Math.sin(a)>0?1:-1;if(!inV(x-50,y-50,x+50,y+30))return;
  g.save();g.translate(x,y+Math.sin(T*3)*6);g.scale(f,1);ln('#8A5A3B',3,-30,6,26,0);for(let k=0;k<6;k++)ln('#C9A060',1.6,-30,6,-44,2+k*2.4);
  poly('#2B2233',-6,4,10,4,6,-12,-4,-12);circ(4,-18,6,'#9BE15D');poly('#9BE15D',8,-18,14,-16,9,-15);circ(5,-19,1,'#222');
  poly('#2B2233',-8,-22,16,-22,2,-46);rr(-10,-24,28,4,2,'#2B2233');rr(-2,-28,10,3,1,'#B78CFF');ln('#C9A060',1.4,-4,-22,-10,-12);
  ell(-16,0,5,4,'#1E1A2A');circ(-12,-4,3,'#1E1A2A');circ(-11,-4.6,0.6,'#B5E61D');g.restore();
  if(t<3&&Math.random()<0.5)PARTS.push({x:x-f*30,y:y+6,vx:-f*rnd(10,30),vy:rnd(-10,10),life:0,max:1,k:'star',r:3,c:['#B78CFF','#9BE15D'][Math.random()*2|0],gr:0});
  hit('witch',x-36,y-50,x+30,y+12,{moving:1,small:1});});
S(960,[-120,890,-40,964],()=>{rr(-82,920,4,40,1,'#5A3A2A');sign(-80,920,74,18,L3(['GRUSEL!','SPOOKY!','¡MIEDO!']),'#2B2233','#FF9A2A');hit('spooky',-120,900,-40,962);});
/* dusk over the spooky corner, drawn over everything there, then the glowing windows and pumpkins */
const GLOW=[];
K.TOP.push(()=>{if(!inV(HX0,HY0-400,HX1,HY1))return;const T=TT();
  g.save();g.fillStyle='rgba(40,16,70,.30)';g.beginPath();g.moveTo(HX0-400,HY0-30);g.lineTo(HX1+14,HY0-30);g.lineTo(HX1+14,HY1-20);g.lineTo(HX0-400,HY1-20);g.closePath();g.fill();
  for(let k=0;k<6;k++){const x=HX0+((k*260+T*12)%1500),y=HY0+300+k*90;g.globalAlpha=0.16;ell(x,y,140,26,'#FFFFFF');}g.globalAlpha=1;
  g.globalCompositeOperation='lighter';for(const [x,y,r] of GLOW){if(!inV(x-r,y-r,x+r,y+r))continue;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,170,60,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r);}
  g.globalCompositeOperation='source-over';g.restore();GLOW.length=0;});

/* =============================================================
   BOATS sailing slowly across the sea
============================================================= */
const BOATS=[
  {id:'ferry',x0:-1200,x1:1500,y:2010,v:16,L:120},{id:'fishing',x0:-1300,x1:500,y:2170,v:11,L:64},{id:'cargo',x0:200,x1:3700,y:2370,v:10,L:210},
  {id:'boat',x0:1350,x1:3000,y:2100,v:13,L:44,c:'#3CC8F5'},{id:'boat',x0:-900,x1:700,y:2290,v:12,L:44,c:'#B78CFF'},{id:'speedboat',x0:-1300,x1:3900,y:2230,v:70,L:40},
  {id:'cruise',x0:2500,x1:3900,y:2060,v:9,L:230},{id:'submarine',x0:-1100,x1:300,y:2120,v:12,L:80,red:1}];
BOATS.forEach((b,i)=>{b.u=sr();b.d=1;b.i=i;});
K.UPDATE.push(dt=>{BOATS.forEach(b=>{const boost=fx('boat#'+b.i)<4?3:1;b.u+=b.d*b.v*boost*dt/(b.x1-b.x0);if(b.u>1){b.u=1;b.d=-1;}if(b.u<0){b.u=0;b.d=1;}});});
function wake(x,y,f,L){const T=TT();g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=2;g.beginPath();g.moveTo(x-f*L*0.45,y+1);g.lineTo(x-f*(L*0.45+40),y-8+Math.sin(T*3)*2);
  g.moveTo(x-f*L*0.45,y+3);g.lineTo(x-f*(L*0.45+40),y+12+Math.sin(T*3)*2);g.stroke();}
function drawBoatK(b){const T=TT(),x=b.x0+(b.x1-b.x0)*b.u,y=b.y+Math.sin(T*1.4+b.i)*1.5,f=b.d,L=b.L;
  if(b.id!=='submarine')wake(x,y,f,L);
  g.save();g.translate(x,y);g.scale(f,1);g.rotate(Math.sin(T*1.2+b.i)*0.02);
  if(b.id==='ferry'){poly('#2F5FD0',-60,-8,60,-8,52,4,-56,4);rr(-58,-20,116,12,2,'#FFFFFF');rr(-46,-34,90,14,3,'#FFFFFF');for(let k=0;k<9;k++)rr(-42+k*10,-30,6,6,1,'#5A7FB0');
    for(let k=0;k<5;k++)rr(-54+k*20,-17,14,7,2,PCOL[k]);rr(14,-48,12,14,2,'#E8443A');rr(14,-48,12,4,1,'#2B2233');}
  else if(b.id==='fishing'){poly('#D9302A',-32,-8,32,-8,26,4,-28,4);rr(-6,-26,24,18,3,'#FFFFFF');rr(-2,-22,7,6,1,'#5A7FB0');rr(8,-22,7,6,1,'#5A7FB0');
    ln('#7A4E33',2,-18,-8,-18,-44);ln('#7A4E33',1.4,-18,-40,-40,-18);g.strokeStyle='rgba(60,60,60,.6)';g.lineWidth=0.8;for(let k=0;k<5;k++){g.beginPath();g.moveTo(-40+k*2,-18+k*2);g.lineTo(-36,-6);g.stroke();}
    circ(28,-12,3,'#FF8A3D');}
  else if(b.id==='cargo'){poly('#2B3A6B',-105,-14,105,-14,95,4,-100,4);rr(-105,-18,210,5,1,'#C0473A');
    for(let k=0;k<12;k++)for(let r=0;r<2;r++)rr(-90+k*13,-30-r*11,12,10,1,PCOL[(k+r*2)%5]);rr(70,-52,26,34,2,'#FFFFFF');for(let k=0;k<3;k++)rr(74+k*7,-48,5,4,1,'#5A7FB0');rr(84,-64,8,12,1,'#E8443A');}
  else if(b.id==='cruise'){poly('#FFFFFF',-115,-10,115,-10,104,6,-110,6);rr(-110,-26,214,16,3,'#FFFFFF');rr(-96,-40,180,14,3,'#FFFFFF');rr(-76,-52,130,12,3,'#FFFFFF');
    rr(-115,-2,230,4,0,'#2F5FD0');for(let r=0;r<3;r++)for(let k=0;k<14-r*3;k++)rr(-100+r*14+k*13,-22-r*13,7,5,1,'#5A7FB0');
    [[-30],[0]].forEach(([fx0])=>{rr(fx0,-72,16,22,3,'#2F5FD0');rr(fx0,-72,16,5,2,'#2B2233');});for(let k=0;k<6;k++)ell(-80+k*30,-27,8,3.4,'#FF8A3D');}
  else if(b.id==='speedboat'){poly('#FFFFFF',-20,-6,20,-6,24,-2,-18,4);rr(-20,-3,40,3,0,'#E8443A');poly('#BFE6FA',2,-6,10,-14,12,-6);circ(-4,-12,4,SKIN[1]);rr(-8,-8,8,4,2,'#3CC8F5');
    for(let k=0;k<3;k++)PARTS.length<400&&Math.random()<0.15&&PARTS.push({x:x-f*24,y:y,vx:-f*rnd(10,40),vy:rnd(-30,-5),life:0,max:0.6,k:'drop',r:3.4,c:'#FFFFFF',gr:120});}
  else if(b.id==='boat'){poly('#FFFFFF',-20,-4,20,-4,15,4,-16,4);ln('#7A5233',1.6,0,-4,0,-48);poly('#FFFFFF',2,-46,2,-8,22,-8);poly(b.c,-2,-42,-2,-10,-18,-10);}
  else if(b.id==='submarine'){const t=fx('boat#'+b.i),up=t<5?Math.min(1,t)*(t>4?5-t:1):0;
    g.save();g.beginPath();g.rect(-60,-60,120,60);g.clip();const yy=18-up*22;rr(-40,yy-14,80,26,13,'#D9302A');rr(-10,yy-30,24,18,6,'#D9302A');
    [-20,-2,16].forEach(px=>{circ(px,yy-2,4.4,'#7E889C');circ(px,yy-2,3,'#8ED2F4');});g.restore();ln('#7E889C',2,6,-10-up*20,6,-24-up*20);ln('#7E889C',2,6,-24-up*20,12,-24-up*20);
    ln('rgba(255,255,255,.7)',1.5,-34,1,34,1);}
  g.restore();
  hit(b.id==='boat'?'boat':b.id,x-L/2-6,y-(b.id==='cruise'?76:b.id==='cargo'?66:50),x+L/2+6,y+6,{moving:1,ref:'#'+b.i});}
K.DYN.push(L=>{for(const b of BOATS){const x=b.x0+(b.x1-b.x0)*b.u;if(inV(x-130,b.y-90,x+130,b.y+20))L.push({y:b.y,f:()=>drawBoatK(b)});}});
const boatTap=snd=>(r)=>{if(typeof r==='string'&&r[0]==='#')act('boat'+r);snd();};
const oldBoat=TAP.boat,oldSub=TAP.submarine;

/* =============================================================
   TAPS, ZONES
============================================================= */
Object.assign(TAP,{
  northpole:()=>S4.bells(),santa:()=>{act('santa');S4.hoho();},santahouse:()=>S4.bells(),factory:()=>{act('factory');S4.machine();},elf:()=>{act('factory');S4.jingle();},
  presents:()=>{act('presents');S4.jingle();},sleigh:()=>{if(SL.t<0){SL.t=0;S4.bells();}else S4.jingle();},xmastree:()=>{act('xmastree');S4.bells();},rink:()=>{act('rink');S4.jingle();},
  stable:()=>{if(SL.t>=0)return;ROLL=TT();S4.jingle();    say(RD.map(rdName).join(', ')+'!');return true;},gingerbread:()=>SND.ding(),snow:(r,x,y)=>burst(x,y,'drop',10,'#FFFFFF',0.6),
  reindeer:ref=>{S4.jingle();if(!ref)return;const r=RD[ref.i];r.tap=TT();
    return ref.i===0?L3(['Das ist Rudolph mit der roten Nase!','This is Rudolph, the red-nosed reindeer!','¡Este es Rodolfo, el reno de la nariz roja!'])
      :L3([`Das ist ${rdName(r)}!`,`This is ${rdName(r)}!`,`¡Este es ${rdName(r)}!`]);},polarbear:()=>{act('polarbear');S4.growl();},arcticfox:()=>{act('arcticfox');SND.squeak();},snowyowl:()=>{act('snowyowl');SND.hoot();},
  penguin:()=>{act('penguin');SND.squeak();},
  spooky:()=>S4.organ(),vampcastle:()=>{act('vampire');S4.organ();},vampire:()=>{act('vampire');S4.cackle();},graveyard:()=>{act('graveyard');S4.boo();},ghost:()=>{act('ghost');S4.boo();},
  skeleton:()=>{act('skeleton');S4.bones();},witch:()=>{act('witch');S4.cackle();},cauldron:()=>{act('cauldron');S4.bubble();},pumpkin:()=>{act('pumpkin');S4.boo();},moon:()=>S4.organ(),
  bat:()=>{act('bat');S4.squeak();},raven:()=>{act('raven');S4.caw();},spider:()=>{act('spider');SND.squeak();},blackcat:()=>{act('blackcat');S4.hiss();},
  ferry:boatTap(S4.horn),fishing:boatTap(S4.toot),cargo:boatTap(S4.horn),cruise:boatTap(S4.horn),speedboat:boatTap(S4.vroom),
  boat:(r,x,y)=>{if(typeof r==='string'&&r[0]==='#')act('boat'+r);oldBoat&&oldBoat(r,x,y);},
  submarine:(r,x,y)=>{if(typeof r==='string'&&r[0]==='#')act('boat'+r);oldSub&&oldSub(r,x,y);}});
K.ZONES.unshift((x,y)=>{if(x>-30)return null;
  if(y>-300&&y<770)return 'snow';
  if(y>=830&&y<1712)return 'spooky';
  return null;});
at('northpole',[-1300,0,-200,700]);at('snow',[-1300,-250,-200,700]);at('spooky',[-1300,900,-100,1650]);at('moon',[-1120,810,-980,950]);
}
