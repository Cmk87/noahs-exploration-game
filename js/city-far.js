/* =============================================================
   FAR EAST OF THE WORLD (loaded before js/city.js, which calls
   cityFar(K)): a space centre with a space shuttle and a rocket that
   launch when tapped, and a Wild West town in the desert. The train
   from the town station ends at the Wild West station.
============================================================= */
function cityFar(K){
const {rr,circ,ell,poly,ln,star,shade,FONT,sign,win,gableB,flatB,kid,SKIN,HAIR,ent,ANIMALS,S,hit,fx,act,later,puff,burst,textP,
  PARTS,LIGHTS,SND,swp,sr,sm,li,ST,TAP,VIEW,TAU,g,wheel,rideTrain,TRAIN,STOP_WEST}=K;
const ANI=(id,ic,n,l)=>{ANIMALS.push([id,ic,n,l]);ent(id,ic,n,l,{animal:1});};
const at=(id,b)=>{K.ENT[id].at=b;};
const inV=(x0,y0,x1,y1)=>x1>VIEW[0]&&x0<VIEW[2]&&y1>VIEW[1]&&y0<VIEW[3];
const flip=(x,y,f,fn)=>{g.save();g.translate(x,y);g.scale(f,1);fn();g.restore();};
const TT=()=>ST.T;
const L3=a=>a[li()];

/* ---------- words ---------- */
ent('spacecenter','🛰️',['das Raumfahrtzentrum','the space centre','el centro espacial'],['Das Raumfahrtzentrum! Von hier fliegen Raketen ins Weltall.','The space centre! Rockets fly into space from here.','¡El centro espacial! Desde aquí los cohetes van al espacio.'],{find:1});
ent('shuttle','🚀',['das Space Shuttle','the space shuttle','el transbordador espacial'],null,{find:1});
ent('rocket','🚀',['die Rakete','the rocket','el cohete'],null,{find:1});
ent('control','🧑‍🚀',['das Trainingszentrum','the astronaut training centre','el centro de entrenamiento'],['Das Trainingszentrum! Hier üben die Astronauten für den Flug ins Weltall.','The training centre! Astronauts practise for their trip to space here.','¡El centro de entrenamiento! Aquí los astronautas practican para ir al espacio.'],{find:1});
ent('grandstand','👀',['die Zuschauertribüne','the viewing stand','la tribuna'],['Die Zuschauer! Sie warten auf den Raketenstart.','The visitors! They are waiting for the launch.','¡El público! Esperan el despegue.'],{find:1});
ent('ufo','🛸',['das Ufo','the UFO','el ovni'],['Ein Ufo! Bieb, bieb, bieb!','A UFO! Beep, beep, beep!','¡Un ovni! ¡Bip, bip, bip!'],{find:1});
ent('buggy','🚙',['das Mondauto','the moon buggy','el coche lunar'],['Das Mondauto! Damit fährt man auf dem Mond.','The moon buggy! You drive it on the moon.','¡El coche lunar! Con él se conduce en la Luna.'],{find:1});
ent('jetpack','🚀',['der Raketenrucksack','the jetpack','la mochila cohete'],['Ein Astronaut mit Raketenrucksack! Er fliegt!','An astronaut with a jetpack! He is flying!','¡Un astronauta con mochila cohete! ¡Vuela!'],{find:1});
ANI('alien','👽',['das Alien','the alien','el extraterrestre'],['Ein Alien! Es sagt: Hallo, Erdling!','An alien! It says: Hello, Earthling!','¡Un extraterrestre! Dice: ¡Hola, terrícola!']);
ent('dish','📡',['die Satellitenschüssel','the satellite dish','la antena parabólica'],['Die Satellitenschüssel! Sie spricht mit den Raketen.','The satellite dish! It talks to the rockets.','¡La antena! Habla con los cohetes.'],{find:1});
ent('astronaut','👩‍🚀',['der Astronaut','the astronaut','el astronauta'],['Der Astronaut! Im Weltall kann man ganz hoch springen.','The astronaut! In space you can jump really high.','¡El astronauta! En el espacio se salta muy alto.'],{find:1});
ent('wildwest','🤠',['der Wilde Westen','the Wild West','el Lejano Oeste'],['Der Wilde Westen! Yeehaw!','The Wild West! Yeehaw!','¡El Lejano Oeste! ¡Yijaa!'],{find:1});
ent('desert','🏜️',['die Wüste','the desert','el desierto'],['Die Wüste! Hier ist es heiß und trocken.','The desert! It is hot and dry here.','¡El desierto! Aquí hace calor y está seco.'],{find:1});
ent('weststation','🚉',['der Wildwest-Bahnhof','the Wild West station','la estación del Oeste'],['Der Wildwest-Bahnhof! Hier hält der Zug.','The Wild West station! The train stops here.','¡La estación del Oeste! Aquí para el tren.'],{find:1});
ent('saloon','🍹',['der Saloon','the saloon','el salón'],['Der Saloon! Hier gibt es Limonade und Klaviermusik.','The saloon! Lemonade and piano music.','¡El salón! Limonada y música de piano.'],{find:1});
ent('sheriff','⭐',['der Sheriff','the sheriff','el sheriff'],['Der Sheriff! Er passt auf die Stadt auf.','The sheriff! The sheriff looks after the town.','¡El sheriff! Cuida del pueblo.'],{find:1});
ent('store','🛒',['der Laden','the store','la tienda'],['Der Laden! Hier gibt es Bohnen, Seile und Hüte.','The store! Beans, ropes and hats.','¡La tienda! Hay judías, cuerdas y sombreros.'],{find:1});
ent('hotel','🏨',['das Hotel','the hotel','el hotel'],null,{find:1});
ent('cowboy','🤠',['der Cowboy','the cowboy','el vaquero'],['Der Cowboy! Yeehaw! Er wirft sein Lasso.','The cowboy! Yeehaw! He throws his lasso.','¡El vaquero! ¡Yijaa! Lanza su lazo.'],{find:1});
ent('stagecoach','🐎',['die Postkutsche','the stagecoach','la diligencia'],['Die Postkutsche! Hü, ihr Pferde!','The stagecoach! Giddy-up, horses!','¡La diligencia! ¡Arre, caballos!'],{find:1});
ent('watertower','💧',['der Wasserturm','the water tower','el depósito de agua'],['Der Wasserturm! Hier trinkt die Dampflok.','The water tower! The steam train drinks here.','¡El depósito de agua! Aquí bebe la locomotora.'],{find:1});
ent('windpump','🌀',['das Windrad','the windmill','el molino'],null);
ent('mine','⛏️',['die Goldmine','the gold mine','la mina de oro'],['Die Goldmine! Da kommt ein Wagen voll Gold!','The gold mine! Here comes a cart full of gold!','¡La mina de oro! ¡Sale un carro lleno de oro!'],{find:1});
ent('cactus','🌵',['der Kaktus','the cactus','el cactus'],['Der Kaktus! Autsch, der ist stachelig.','The cactus! Ouch, it is prickly.','¡El cactus! ¡Ay, pincha!'],{find:1});
ent('mesa','⛰️',['der Tafelberg','the mesa','la meseta'],['Der Tafelberg! Oben ist er ganz flach.','The mesa! It is flat on top.','¡La meseta! Arriba es plana.'],{find:1});
ent('tumbleweed','🌾',['der Steppenläufer','the tumbleweed','la planta rodadora'],['Der Steppenläufer! Der Wind rollt ihn durch die Wüste.','The tumbleweed! The wind rolls it through the desert.','¡La planta rodadora! El viento la lleva.']);
ANI('bison','🦬',['der Bison','the bison','el bisonte'],['Der Bison! Er ist groß und stark.','The bison! It is big and strong.','¡El bisonte! Es grande y fuerte.']);
ANI('coyote','🐺',['der Kojote','the coyote','el coyote'],['Der Kojote! Ahuuu!','The coyote! Ahooo!','¡El coyote! ¡Auuu!']);
ANI('snake','🐍',['die Klapperschlange','the rattlesnake','la serpiente de cascabel'],['Die Klapperschlange! Rassel, rassel!','The rattlesnake! Rattle, rattle!','¡La serpiente de cascabel! ¡Chis, chis!']);
ANI('roadrunner','🐦',['der Rennkuckuck','the roadrunner','el correcaminos'],['Der Rennkuckuck! Er rennt ganz schnell. Miep miep!','The roadrunner! It runs really fast. Beep beep!','¡El correcaminos! Corre muy rápido. ¡Bip bip!']);
ANI('vulture','🦅',['der Geier','the vulture','el buitre'],['Der Geier! Er kreist über der Wüste.','The vulture! It circles over the desert.','¡El buitre! Da vueltas sobre el desierto.']);
ANI('lizard','🦎',['die Eidechse','the lizard','la lagartija'],['Die Eidechse! Sie sonnt sich auf dem Stein.','The lizard! It is sunbathing on the rock.','¡La lagartija! Toma el sol en la piedra.']);

/* ---------- sounds ---------- */
const S3={
  count:()=>{[0,1,2].forEach(t=>beep(880,t,0.15,'square',0.08));beep(1320,3,0.4,'square',0.1);},
  launch:()=>{noise(3.5,0.25);swp(70,30,4,'sawtooth',0.16);setTimeout(()=>noise(3,0.2),1500);},
  cheer:()=>{noise(1.2,0.08);[784,988,1175].forEach((f,i)=>beep(f,i*0.12,0.3,'triangle',0.09));},
  piano:()=>{[523,659,784,659,587,698,880,698,523,659,784,1047].forEach((f,i)=>{beep(f,i*0.15,0.14,'square',0.06);beep(f/2,i*0.15,0.14,'triangle',0.05);});},
  yeehaw:()=>{swp(500,1100,0.3,'sawtooth',0.06);swp(1100,700,0.4,'sawtooth',0.06,0.3);},
  whip:()=>{noise(0.12,0.3);},
  rattle:()=>{for(let i=0;i<16;i++)setTimeout(()=>noise(0.03,0.12),i*45);},
  meep:()=>{beep(1300,0,0.12,'sine',0.12);beep(1300,0.18,0.12,'sine',0.12);},
  snort:()=>{noise(0.4,0.18);swp(120,80,0.5,'sawtooth',0.07);},
  howl:()=>{swp(400,800,0.6,'sine',0.12);swp(800,600,1,'sine',0.12,0.6);},
  coins:()=>{[1568,1760,2093,2349].forEach((f,i)=>beep(f,i*0.09,0.25,'triangle',0.1));},
  trot:()=>{for(let i=0;i<10;i++)beep(i%2?260:200,i*0.16,0.05,'square',0.06);},
  splash:()=>noise(0.6,0.15),
  boing:()=>{swp(200,700,0.35,'sine',0.12);},
  ufo:()=>{for(let i=0;i<4;i++){swp(600,1400,0.18,'sine',0.08,i*0.22);swp(1400,600,0.18,'sine',0.08,i*0.22+0.11);}}};

/* =============================================================
   GROUND
============================================================= */
const DUNES=[],PEBBLES=[];
for(let i=0;i<40;i++)DUNES.push([2860+sr()*1140,620+sr()*1080,30+sr()*70]);
for(let i=0;i<120;i++)PEBBLES.push([2860+sr()*1140,620+sr()*1080]);
K.GROUND0.push(()=>{const T=TT();
  if(inV(2820,-300,4040,600)){
    rr(2826,-290,1214,880,26,'#C7DBA3');
    rr(3300,190,330,240,14,'#D3D7DE');rr(3690,210,280,220,14,'#D3D7DE');
    g.strokeStyle='#BFC3CC';g.lineWidth=26;g.beginPath();g.moveTo(3130,330);g.lineTo(3300,330);g.moveTo(3630,330);g.lineTo(3690,330);g.stroke();
    rr(3400,402,120,12,3,'#8E96A8');rr(3770,402,120,12,3,'#8E96A8');}
  if(inV(2820,580,4040,1740)){
    rr(2826,590,1214,1150,26,'#EBCB8B');
    for(const [x,y,r] of DUNES)if(inV(x-r,y-r,x+r,y+r))ell(x,y,r,r*0.35,'#E2BE7A');
    for(const [x,y] of PEBBLES)if(inV(x-3,y-3,x+3,y+3))ell(x,y,2.4,1.6,'#C8A068');
    rr(2880,1004,1080,60,10,'#D9B27A');g.strokeStyle='rgba(150,100,50,.25)';g.lineWidth=2;g.beginPath();g.moveTo(2890,1022);g.lineTo(3950,1022);g.moveTo(2890,1046);g.lineTo(3950,1046);g.stroke();
    rr(3420,1210,260,26,3,'#C9A57A');g.fillStyle='#A8845A';for(let x=3424;x<3680;x+=10)g.fillRect(x,1210,2,26);rr(3420,1232,260,3,1,'#FFD23F');}
});
K.GROUND1.push(()=>{if(!inV(2820,770,4040,830))return;
  rr(2826,778,1214,44,0,'#D2A86A');g.strokeStyle='rgba(140,90,40,.3)';g.lineWidth=2;g.beginPath();g.moveTo(2830,792);g.lineTo(4040,792);g.moveTo(2830,808);g.lineTo(4040,808);g.stroke();
  rr(3770,1238,10,34,2,'#C0473A');rr(3764,1240,22,8,2,'#E8443A');});

/* =============================================================
   SPACE CENTRE
============================================================= */
function astro(x,y,f,s,pose,T){s=s||1;flip(x,y,f,()=>{g.scale(s,s);const st=pose==='walk'?Math.sin(T*6)*3:0;
  rr(-7,-26,14,20,5,'#F4F7FB');rr(-6,-8+st*0.3,5,8,2,'#E3E8F0');rr(1,-8-st*0.3,5,8,2,'#E3E8F0');rr(-12,-24,6,14,3,'#F4F7FB');rr(6,-24,6,14,3,'#F4F7FB');
  rr(-6,-22,12,8,2,'#3B7DE2');circ(0,-34,10,'#F4F7FB');ell(2,-34,7,6,'#F2B23A');ell(4,-36,2.6,1.8,'rgba(255,255,255,.7)');rr(-10,-28,4,8,2,'#C9D0DB');
  if(pose==='wave'){g.save();g.translate(8,-22);g.rotate(-2.4+Math.sin(T*9)*0.4);rr(-3,0,6,12,3,'#F4F7FB');g.restore();}});}
/* astronaut training centre with an open front: centrifuge, water tank, mission control */
S(282,[2860,40,3190,284],()=>{const T=TT(),t=fx('control'),fast=t<5?2.5:1,x=2870,y=190,w=310,d=92,h=140,Ye=y+d-h,base=y+d;
  rr(x+6,base-5,w+8,10,5,'rgba(0,0,0,.15)');rr(x,y-h,w,d,4,'#C9D0DB');ln('#9AA4B8',2,x+w-30,y-h+10,x+w-30,y-h-26);circ(x+w-30,y-h-28,3,Math.sin(T*4)>0?'#E8443A':'#8A3A3A');
  rr(x,Ye,w,h,[0,0,4,4],'#F4F7FB');rr(x,Ye,w,8,0,'#3B7DE2');sign(x+w/2,Ye+22,200,18,L3(['TRAININGSZENTRUM','TRAINING CENTRE','ENTRENAMIENTO']),'#3B7DE2','#FFFFFF');
  const ix=x+14,iy=Ye+38,iw=w-28,ih=h-46,rw=iw/3;rr(ix-4,iy-4,iw+8,ih+8,8,'#7E889C');
  g.save();g.beginPath();g.rect(ix,iy,iw,ih);g.clip();
  rr(ix,iy,rw,ih,0,'#EAF2FB');const cx=ix+rw/2,cy=iy+ih/2+4,a=T*2.2*fast;ln('#7E889C',4,cx,cy,cx+Math.cos(a)*30,cy+Math.sin(a)*30*0.5);circ(cx,cy,6,'#5A6074');
  g.save();g.translate(cx+Math.cos(a)*30,cy+Math.sin(a)*30*0.5);circ(0,0,10,'#FFC928');circ(0,-1,5,'#F2B23A');g.restore();rr(cx-16,iy+ih-6,32,6,2,'#5A6074');
  rr(ix+rw,iy,rw,ih,0,'#DCEAF6');rr(ix+rw+6,iy+18,rw-12,ih-22,4,'#7FD0F5');for(let k=0;k<4;k++)circ(ix+rw+14+k*14,iy+ih-10-((T*20+k*13)%(ih-30)),2,'rgba(255,255,255,.8)');
  g.save();g.translate(ix+rw*1.5,iy+ih/2+6+Math.sin(T*1.5)*4);g.rotate(Math.sin(T*0.7)*0.4);astro(0,10,1,0.8,'float',T);g.restore();
  rr(ix+2*rw,iy,rw,ih,0,'#EEF1F6');for(let k=0;k<3;k++){rr(ix+2*rw+6+k*28,iy+8,24,16,2,'#2B2D3A');const sc=['#7ED957','#3CC8F5','#FF8A3D'][k];
    for(let j=0;j<3;j++)rr(ix+2*rw+9+k*28,iy+11+j*4,(6+((Math.floor(T*3)+j+k)%3)*5),2,0,sc);}
  rr(ix+2*rw+4,iy+ih-22,rw-8,8,2,'#9AA4B8');[[ix+2*rw+22,0],[ix+2*rw+60,2]].forEach(([px,i])=>{kid(px,iy+ih-14,'#3B7DE2',SKIN[i],HAIR[i],1.1);rr(px-3,iy+ih-30,6,2,1,'#2B2233');});
  g.restore();
  hit('control',x-4,y-h-30,x+w+4,base);hit('astronaut',ix+rw,iy,ix+2*rw,iy+ih,{small:1});});
S(206,[3200,70,3290,208],()=>{const T=TT(),x=3245,y=206,a=Math.sin(T*0.3)*0.9;
  rr(x-6,y-50,12,50,2,'#C9D0DB');rr(x-16,y-6,32,8,2,'#9AA4B8');
  g.save();g.translate(x,y-70);g.scale(Math.cos(a)*0.9+0.1,1);g.fillStyle='#F4F7FB';g.beginPath();g.ellipse(0,0,36,26,0,0,TAU);g.fill();
  g.strokeStyle='#C9D0DB';g.lineWidth=3;g.stroke();g.fillStyle='#E3E8F0';g.beginPath();g.ellipse(4,2,26,18,0,0,TAU);g.fill();ln('#9AA4B8',2,0,0,22,-18);circ(22,-18,3,'#E8443A');g.restore();
  hit('dish',x-40,y-100,x+40,y);});
[[3700,140],[3790,140]].forEach(([x,y])=>S(y+30,[x-30,y-30,x+30,y+32],()=>{[-18,0,18].forEach(o=>rr(x+o-2,y,4,30,1,'#9AA4B8'));circ(x,y,26,'#F4F7FB');circ(x-8,y-8,9,'#FFFFFF');}));
/* a covered viewing stand for visitors, who cheer at every launch */
S(562,[2970,440,3250,566],()=>{const T=TT(),cheer=fx('shuttle')<12&&fx('shuttle')>4||fx('rocket')<12&&fx('rocket')>4;
  for(let r=0;r<3;r++){rr(2990,504+r*20,240,8,2,'#9AA4B8');for(let k=0;k<8;k++){const kx=3004+k*30+(r%2)*12,j=cheer?Math.abs(Math.sin(T*8+k+r))*5:0,c=['#FF5A5F','#3CC8F5','#FFC928','#7ED957','#B78CFF'][(k+r)%5];
    kid(kx,504+r*20-j,c,SKIN[(k+r)%4],HAIR[(k*3+r)%4],1);if((k+r)%3===0){ln('#7E889C',1,kx+5,498+r*20-j,kx+5,486+r*20-j);rr(kx+5,486+r*20-j,8,5,1,c);}}}
  [[2984],[3236]].forEach(([px])=>rr(px,470,4,90,1,'#7E889C'));poly('#E8443A',2976,474,3244,474,3236,458,2984,458);for(let k=0;k<9;k++)rr(2984+k*28,458,14,16,0,'rgba(255,255,255,.55)');
  sign(3110,448,140,16,L3(['ZUSCHAUER','VISITORS','VISITANTES']),'#2B2D3A','#FFFFFF');ln('#9AA4B8',2,2990,558,3230,558);hit('grandstand',2976,440,3244,562);});
/* astronauts walking around, one in a moon buggy, one flying with a jetpack */
[[3060,330,0.55,0],[3210,380,0.4,2],[2950,420,0.35,4]].forEach(([cx,y,sp,ph],i)=>S(y,[cx-90,y-60,cx+90,y+4],()=>{const T=TT(),t=fx('astronaut'),x=cx+Math.sin(T*sp+ph)*70,
  j=t<2.5?Math.sin(t/2.5*Math.PI)*60:0,f=Math.cos(T*sp+ph)>0?1:-1;ell(x,y+1,10,3,'rgba(0,0,0,.15)');astro(x,y-j,f,1,i===1&&Math.sin(T*0.5)>0.6?'wave':'walk',T);
  hit('astronaut',x-14,y-46-j,x+14,y,{small:1});}));
K.DYN.push(L=>{const T=TT(),t=fx('buggy'),u=(T*(t<4?0.25:0.08))%2,k=u<1?u:2-u,x=2900+k*340,y=460,f=u<1?1:-1;if(!inV(x-40,y-50,x+40,y+6))return;
  L.push({y,f:()=>{flip(x,y,f,()=>{ell(0,1,30,4,'rgba(0,0,0,.15)');rr(-26,-14,52,8,3,'#C9D0DB');rr(-20,-20,22,6,2,'#9AA4B8');ln('#7E889C',1.6,16,-14,20,-34);g.fillStyle='#F4F7FB';g.beginPath();g.ellipse(20,-36,7,3,0,0,TAU);g.fill();
    [-18,0,18].forEach(wx=>{circ(wx,-4,6,'#3A3F52');circ(wx,-4,2.4,'#9AA4B8');});g.save();g.translate(-8,-14);g.scale(0.8,0.8);astro(0,0,1,1,'sit',T);g.restore();});
    if(Math.random()<0.15)puff(x-f*28,y-2,{c:'#D9DCE3',r:3,max:0.8});hit('buggy',x-30,y-44,x+30,y+2,{moving:1,small:1});}});});
K.TOP.push(()=>{const T=TT(),t=fx('jetpack'),a=T*(t<4?0.9:0.35),x=3460+Math.cos(a)*240,y=60+Math.sin(a*1.3)*80-(t<4?40:0),f=-Math.sin(a)>0?1:-1;if(!inV(x-30,y-60,x+30,y+60))return;
  g.save();g.translate(x,y);g.rotate(Math.sin(T*2)*0.15);rr(-10,-26,8,18,3,'#9AA4B8');for(let k=0;k<2;k++){const fl=10+Math.sin(T*30+k)*3;poly(k?'#FFE14D':'#FF7A2A',-10+k*2,-8,-6,-8+fl,-2-k*2,-8);}
  astro(0,0,f,0.9,'wave',T);g.restore();LIGHTS.push(x-6,y,30,'#FF9A2A');hit('jetpack',x-18,y-40,x+18,y+6,{moving:1,small:1});});

/* =============================================================
   UFOS AND ALIENS behind the launch pads
============================================================= */
function ufoBody(x,y,s,T,col){g.save();g.translate(x,y);g.scale(s,s);
  ell(0,0,46,12,'#9AA4B8');ell(0,-3,46,10,'#C9D0DB');ell(0,-12,22,16,'rgba(150,230,255,.75)');ell(-6,-18,6,4,'rgba(255,255,255,.7)');
  for(let k=0;k<8;k++){const on=((k+Math.floor(T*6))%3)===0,c=['#FF5A5F','#FFE14D','#7ED957','#3CC8F5'][k%4];circ(-38+k*11,2,2.6,on?c:shade(c,-0.5));}
  if(col)LIGHTS.push(x,y,60*s,col);g.restore();}
function alien(x,y,c,s,T,i,wave){g.save();g.translate(x,y);g.scale(s,s);const b=Math.abs(Math.sin(T*4+i))*2;
  rr(-6,-14-b,12,13,5,c);rr(-6,-2,4,3,1,c);rr(2,-2,4,3,1,c);ell(0,-22-b,9,8,c);
  ln(c,1.4,-4,-29-b,-7,-37-b);ln(c,1.4,4,-29-b,7,-37-b);circ(-7,-37-b,2.2,'#FFE14D');circ(7,-37-b,2.2,'#FFE14D');
  if(i%2){circ(0,-23-b,4.4,'#FFFFFF');circ(0,-23-b,2.2,'#2B2233');}else{ell(-3.4,-23-b,2.6,3.2,'#2B2233');ell(3.4,-23-b,2.6,3.2,'#2B2233');}
  g.strokeStyle='#2B2233';g.lineWidth=1;g.beginPath();g.arc(0,-19-b,3,0.2,Math.PI-0.2);g.stroke();
  if(wave){g.save();g.translate(6,-12-b);g.rotate(-2.3+Math.sin(T*10)*0.5);rr(-1.6,0,3.2,9,1.6,c);g.restore();}g.restore();}
S(40,[3380,-120,3640,44],()=>{const T=TT(),t=fx('ufo'),x=3500,y=-20;
  g.strokeStyle='rgba(120,160,90,.5)';g.lineWidth=3;for(let r=24;r<90;r+=16){g.beginPath();g.ellipse(x,y+30,r*1.4,r*0.45,0,0,TAU);g.stroke();}
  [[-28],[28]].forEach(([o])=>ln('#7E889C',3,x+o,y+4,x+o*1.3,y+30));poly('#9AA4B8',x+10,y+6,x+34,y+40,x+50,y+40,x+22,y+6);
  ufoBody(x,y,1.2,T,'#9BE15D');alien(x,y-14,'#7ED957',0.6,T,1,false);
  hit('ufo',x-60,y-40,x+60,y+30);});
const ALIENS=[[3560,46,'#7ED957'],[3600,58,'#B78CFF'],[3430,52,'#7ED957'],[3470,70,'#9BE15D']];
ALIENS.forEach(([ax,ay,c],i)=>S(ay,[ax-30,ay-50,ax+30,ay+4],()=>{const T=TT(),t=fx('alien'),j=t<2?Math.abs(Math.sin(t*6+i))*18:0,x=ax+Math.sin(T*0.6+i*2)*16;
  ell(x,ay+1,8,2.4,'rgba(0,0,0,.15)');alien(x,ay-j,c,1.1,T,i,t<3||i===0);hit('alien',x-12,ay-46-j,x+12,ay+2,{small:1});}));
/* a second UFO hovers and beams a cow up and down */
K.TOP.push(()=>{const T=TT(),t=fx('ufo2'),x=3820+Math.sin(T*0.3)*80,y=-160+Math.sin(T*0.9)*12;if(!inV(x-80,y-40,x+80,y+220))return;
  const beam=t<6,up=beam?Math.sin(Math.min(1,t/3)*Math.PI/2)*(t>4.5?(6-t)/1.5:1):0;
  if(beam){g.save();g.globalAlpha=0.35;g.fillStyle='#E6FFB0';g.beginPath();g.moveTo(x-16,y+8);g.lineTo(x+16,y+8);g.lineTo(x+46,y+190);g.lineTo(x-46,y+190);g.closePath();g.fill();g.restore();}
  const cy=y+186-up*150;g.save();g.translate(x,cy);g.rotate(beam?Math.sin(T*3)*0.4:0);ell(0,-10,16,8,'#FFFFFF');ell(-5,-12,5,3.4,'#2E2E2E');ell(6,-8,4,3,'#2E2E2E');
  [-10,-5,6,11].forEach(lx=>rr(lx-1.5,-4,3,7,1,'#4A4A4A'));circ(15,-14,6,'#FFFFFF');ell(19,-12,3.4,2.6,'#F6B7B7');circ(14,-16,1.1,'#222');g.restore();
  ufoBody(x,y,1,T,beam?'#E6FFB0':null);hit('ufo',x-50,y-24,x+50,y+16,{moving:1,small:1,ref:'beam'});});
/* a tiny UFO zips across the sky now and then */
K.TOP.push(()=>{const T=TT(),ph=(T%18)/18;if(ph>0.3)return;const u=ph/0.3,x=2900+u*1200,y=-260+Math.sin(u*TAU*2)*40;if(!inV(x-30,y-20,x+30,y+20))return;
  ufoBody(x,y,0.5,T,'#7FE0FF');hit('ufo',x-26,y-14,x+26,y+10,{moving:1,small:1});});

/* the two launch pads */
const PADS3={shuttle:{x:3460,base:404,col:'#C0473A'},rocket:{x:3830,base:404,col:'#3B7DE2'}};
function rise(id){const t=fx(id);if(t>=40)return 0;if(t<3.6)return 0;const tt=t-3.6;return 22*tt*tt;}
function flying(id){const t=fx(id);return t>=3.6&&t<16;}
function gone(id){const t=fx(id);return t>=16&&t<22;}
function gantry(P,id){const t=fx(id),arm=t<40&&t>2?Math.min(1,(t-2)/1.2):0,x=P.x+52,top=P.base-230;
  g.strokeStyle=P.col;g.lineWidth=2;ln(P.col,3,x,P.base,x,top);ln(P.col,3,x+22,P.base,x+22,top);g.beginPath();
  for(let y=P.base;y>top;y-=18){g.moveTo(x,y);g.lineTo(x+22,y-18);g.moveTo(x+22,y);g.lineTo(x,y-18);}g.stroke();
  rr(x-4,top-6,30,8,2,P.col);circ(x+11,top-10,3,Math.sin(TT()*4)>0?'#FF3B30':'#8A3A3A');LIGHTS.push(x+11,top-10,24,'#FF3B30');
  g.save();g.translate(x,P.base-150);g.rotate(-arm*1.2);rr(-34,-4,34,6,2,P.col);g.restore();}
function shuttle(cx,by){
  rr(cx-15,by-206,30,180,[15,15,4,4],'#E8843A');for(let k=0;k<5;k++)rr(cx-15,by-180+k*30,30,2,0,'#D0702A');
  [[-31],[19]].forEach(([o])=>{rr(cx+o,by-186,12,168,[6,6,2,2],'#F4F6FA');rr(cx+o,by-186,12,10,[6,6,0,0],'#D3DAE5');poly('#7E889C',cx+o+1,by-18,cx+o+11,by-18,cx+o+13,by-8,cx+o-1,by-8);});
  poly('#FFFFFF',cx-12,by-90,cx-40,by-36,cx-40,by-28,cx-12,by-36);poly('#FFFFFF',cx+12,by-90,cx+40,by-36,cx+40,by-28,cx+12,by-36);
  ln('#2B2D3A',2,cx-12,by-90,cx-40,by-36);ln('#2B2D3A',2,cx+12,by-90,cx+40,by-36);
  rr(cx-12,by-156,24,128,[12,12,4,4],'#FFFFFF');g.fillStyle='#2B2D3A';g.beginPath();g.ellipse(cx,by-146,12,12,0,Math.PI,TAU);g.fill();rr(cx-12,by-146,24,4,0,'#2B2D3A');
  [[-6],[0],[6]].forEach(([o])=>rr(cx+o-2,by-140,4,4,1,'#2B2D3A'));rr(cx-8,by-110,16,8,2,'#3B7DE2');rr(cx-8,by-102,16,3,0,'#E8443A');
  [[-6],[6]].forEach(([o])=>poly('#9AA4B8',cx+o-3,by-28,cx+o+3,by-28,cx+o+5,by-20,cx+o-5,by-20));}
function rocketB(cx,by){
  rr(cx-14,by-220,28,200,[4,4,3,3],'#F4F6FA');[[0],[70],[140]].forEach(([o])=>rr(cx-14,by-200+o,28,10,0,'#2B2D3A'));
  poly('#E8443A',cx-14,by-220,cx,by-262,cx+14,by-220);rr(cx-5,by-178,10,10,5,'#8ED2F4');
  poly('#E8443A',cx-14,by-60,cx-28,by-24,cx-14,by-30);poly('#E8443A',cx+14,by-60,cx+28,by-24,cx+14,by-30);
  poly('#7E889C',cx-10,by-20,cx+10,by-20,cx+14,by-8,cx-14,by-8);}
function flame(cx,by,w,big){const T=TT();for(let k=0;k<3;k++){const h=(30+k*16)*big*(1+Math.sin(T*30+k)*0.12);poly(['#FFE14D','#FF9A2A','#FF5A2A'][2-k],cx-w*(1-k*0.25),by,cx,by+h*(1.3-k*0.25),cx+w*(1-k*0.25),by);}
  LIGHTS.push(cx,by+30,150*big,'#FF9A2A');}
function drawCraft(id,P,dy,alpha){g.globalAlpha=alpha;if(id==='shuttle')shuttle(P.x,P.base-dy);else rocketB(P.x,P.base-dy);g.globalAlpha=1;}
['shuttle','rocket'].forEach(id=>{const P=PADS3[id];
  S(P.base,[P.x-60,P.base-280,P.x+90,P.base+10],()=>{const t=fx(id);gantry(P,id);
    if(gone(id))return;
    if(!flying(id)){const re=t>=22&&t<25?(t-22)/3:1;drawCraft(id,P,0,t>=22&&t<40?re:1);
      if(t>=3&&t<3.6){flame(P.x,P.base-10,14,0.6);}
      hit(id,P.x-42,P.base-265,P.x+42,P.base);}});
});
K.TOP.push(()=>{['shuttle','rocket'].forEach(id=>{if(!flying(id))return;const P=PADS3[id],dy=rise(id),y=P.base-dy;
  if(!inV(P.x-60,y-280,P.x+60,y+200))return;
  if(id==='shuttle'){flame(P.x-25,y-12,7,1.3);flame(P.x+25,y-12,7,1.3);flame(P.x,y-20,9,1);}else flame(P.x,y-8,12,1.4);
  drawCraft(id,P,dy,1);hit(id,P.x-42,y-265,P.x+42,y,{moving:1});});});
K.UPDATE.push(dt=>{['shuttle','rocket'].forEach(id=>{const t=fx(id),P=PADS3[id];if(t>=40)return;
  if(t>3&&t<9&&Math.random()<dt*40)puff(P.x+rnd(-40,40),P.base-4,{c:'#F4F4F6',r:rnd(10,18),vx:rnd(-70,70),vy:rnd(-25,-5),max:4});
  if(flying(id)&&Math.random()<dt*30){const y=P.base-rise(id);puff(P.x+rnd(-10,10),y+40,{c:'#EEF0F4',r:rnd(8,13),vx:rnd(-10,10),vy:rnd(0,10),max:3});}});});
function launch(id){const t=fx(id);if(t<25)return true;act(id);S3.count();
  say(L3(['Drei, zwei, eins, Start!','Three, two, one, lift-off!','¡Tres, dos, uno, despegue!']));
  const P=PADS3[id];['3','2','1'].forEach((n,i)=>later(i,()=>textP(P.x,P.base-290,n,'#FFFFFF',34)));
  later(3,()=>{S3.launch();K.shake=5;});later(5,()=>S3.cheer());
  later(4.5,()=>{K.flyTo(K.viewOf(P.x-260,-700,P.x+260,P.base+120,1),1600);});return true;}

/* =============================================================
   WILD WEST
============================================================= */
const MESAS=[[2900,3080,760,130],[3150,3420,775,160],[3560,3760,765,120],[3800,3990,770,140]];
MESAS.forEach(([x0,x1,b,h])=>S(b,[x0-20,b-h-10,x1+20,b+4],()=>{const m=(x1-x0)*0.12;
  poly('#C8643A',x0,b,x0+m,b-h,x1-m,b-h,x1,b);poly('#DA7A4E',x0,b,x0+m,b-h,x0+m+(x1-x0)*0.25,b-h,x0+(x1-x0)*0.3,b);
  rr(x0+m-4,b-h-4,x1-x0-2*m+8,8,3,'#B8562E');g.fillStyle='rgba(120,50,20,.18)';for(let k=1;k<4;k++)g.fillRect(x0+m*(1-k/4),b-h+k*h/4,x1-x0-2*m*(1-k/4),3);
  hit('mesa',x0,b-h-6,x1,b);}));
function westFront(x,w,h,wall,txt,signBg){const base=992;
  rr(x+6,base-6,w,10,4,'rgba(80,50,20,.18)');
  rr(x,base-h,w,h,[0,0,2,2],wall);g.strokeStyle=shade(wall,-0.15);g.lineWidth=1;g.beginPath();for(let px=x+8;px<x+w;px+=8){g.moveTo(px,base-h);g.lineTo(px,base);}g.stroke();
  rr(x-3,base-h-4,w+6,6,2,shade(wall,-0.3));
  sign(x+w/2,base-h+16,w*0.8,18,txt,signBg||'#F2E6C9','#5A3A2A');
  rr(x-6,base-36,w+12,6,2,'#8A5A3B');[x-4,x+w/2-2,x+w].forEach(px=>rr(px,base-32,4,32,1,'#7A4E33'));
  rr(x-8,base-2,w+16,8,2,'#A8784A');return base;}
S(994,[2900,880,3090,1000],()=>{const T=TT(),x=2920,w=160,base=westFront(x,w,104,'#B5774A','SALOON','#FFC928');
  win(x+12,base-74,26,20,'#7A4E33');win(x+w-38,base-74,26,20,'#7A4E33');
  const sw=fx('saloon')<3?Math.sin(fx('saloon')*12)*0.6:0;rr(x+w/2-18,base-34,36,32,1,'#3A2A20');
  g.save();g.translate(x+w/2-17,base-28);g.scale(Math.cos(sw),1);rr(0,0,16,20,2,'#D9A06A');g.restore();
  g.save();g.translate(x+w/2+17,base-28);g.scale(-Math.cos(sw),1);rr(0,0,16,20,2,'#D9A06A');g.restore();
  if(fx('saloon')<3&&Math.random()<0.1)textP(x+w/2,base-60,'♪','#FFFFFF',16);
  LIGHTS.push(x+w/2,base-20,50,'#FFC870');hit('saloon',x-6,base-110,x+w+6,base);});
S(994,[3100,890,3250,1000],()=>{const x=3110,w=130,base=westFront(x,w,92,'#C9A87A',L3(['SHERIFF','SHERIFF','SHERIFF']),'#2B2233');
  g.fillStyle='#FFC928';star(x+w/2,base-56,10,'#FFC928');win(x+10,base-62,22,18,'#7A4E33');win(x+w-32,base-62,22,18,'#7A4E33');rr(x+w/2-11,base-32,22,30,[3,3,0,0],'#6E4A33');
  hit('sheriff',x-6,base-100,x+w+6,base);});
S(994,[3260,890,3430,1000],()=>{const x=3270,w=150,base=westFront(x,w,96,'#A8B87A',L3(['LADEN','STORE','TIENDA']));
  win(x+10,base-64,30,22,'#7A4E33');win(x+w-40,base-64,30,22,'#7A4E33');rr(x+w/2-11,base-32,22,30,[3,3,0,0],'#6E4A33');
  [[x-2,base+10],[x+16,base+12]].forEach(([bx,by])=>{rr(bx,by-18,14,18,4,'#8A5A3B');rr(bx,by-12,14,2,0,'#5A3A2A');});rr(x+w-10,base-6,18,16,2,'#B07A4E');
  hit('store',x-6,base-104,x+w+6,base);});
S(994,[3440,860,3640,1000],()=>{const x=3450,w=180,base=westFront(x,w,130,'#D9C29A',L3(['HOTEL','HOTEL','HOTEL']),'#8A3A3A');
  for(let k=0;k<4;k++){win(x+12+k*42,base-100,24,20,'#7A4E33');win(x+12+k*42,base-68,24,20,'#7A4E33');}rr(x-4,base-80,w+8,4,1,'#8A5A3B');
  rr(x+w/2-12,base-32,24,30,[3,3,0,0],'#6E4A33');hit('hotel',x-6,base-140,x+w+6,base);});
/* sheriff on the porch, horse at the hitching post, the cowboy with a lasso */
S(998,[3160,950,3200,1000],()=>{const T=TT();kid(3180,996,'#5A3A2A',SKIN[1],'#5A3A2A',1.4);rr(3170,966,20,4,2,'#3A2A20');rr(3174,958,12,9,3,'#3A2A20');star(3182,980,3,'#FFC928');});
S(1030,[3070,990,3150,1032],()=>{rr(3080,1004,4,24,1,'#7A4E33');rr(3136,1004,4,24,1,'#7A4E33');rr(3078,1004,64,4,1,'#8A5A3B');
  const T=TT();flip(3112,1030,-1,()=>{[-11,-7,7,11].forEach(lx=>rr(lx-1.4,-13,2.8,13,1,'#5A3A2A'));ell(0,-16,15,7,'#8A5A3B');g.save();g.translate(11,-20);g.rotate(Math.sin(T*0.5)>0.3?1:-0.2);
    rr(-3,-14,7,16,3,'#8A5A3B');ell(3,-16,7,4,'#8A5A3B');circ(1,-18,1,'#222');g.restore();rr(-6,-22,12,4,2,'#C0473A');});});
S(1050,[3020,960,3120,1052],()=>{const T=TT(),t=fx('cowboy'),x=3060,y=1050,throwL=t<2;
  kid(x,y,'#3B7DE2',SKIN[2],'#5A3A2A',1.5);rr(x-11,y-34,22,4,2,'#8A5A3B');rr(x-6,y-42,12,9,3,'#8A5A3B');rr(x-7,y-8,6,8,1,'#2E4A7A');rr(x+1,y-8,6,8,1,'#2E4A7A');
  g.strokeStyle='#C9A060';g.lineWidth=1.6;
  if(!throwL){const a=T*8;ln('#C9A060',1.4,x+5,y-20,x+8,y-38);g.beginPath();g.ellipse(x+8,y-40,14,4,0,0,TAU);g.stroke();
    circ(x+8+Math.cos(a)*14,y-40+Math.sin(a)*4,1.6,'#C9A060');}
  else{const r=10+t*30;g.beginPath();g.moveTo(x+5,y-20);g.quadraticCurveTo(x+20+t*30,y-40,x+30+t*40,y-30);g.stroke();g.beginPath();g.ellipse(x+30+t*40,y-30,r*0.4,r*0.25,0,0,TAU);g.stroke();}
  hit('cowboy',x-14,y-46,x+20,y+2,{small:1});});
/* the stagecoach drives up and down Main Street */
const COACH={x:3800,dir:-1};
K.UPDATE.push(dt=>{COACH.x+=COACH.dir*dt*(fx('stagecoach')<4?90:38);if(COACH.x<2960){COACH.dir=1;}if(COACH.x>3900){COACH.dir=-1;}});
K.DYN.push(L=>{const x=COACH.x,y=1044;if(!inV(x-90,y-60,x+90,y+10))return;L.push({y,f:()=>{const T=TT(),sp=x/6;
  flip(x,y,COACH.dir,()=>{ell(0,1,60,5,'rgba(80,50,20,.2)');
    [[28],[52]].forEach(([hx],i)=>{const st=Math.sin(T*10+i)*3;[-8,-4,6,10].forEach((lx,k)=>rr(hx+lx-1.2,-12+(k%2?st:-st)*0.3,2.4,12,1,'#3A2A20'));ell(hx,-15,12,6,i?'#F2EDE4':'#8A5A3B');
      rr(hx+8,-26,6,13,3,i?'#F2EDE4':'#8A5A3B');ell(hx+13,-27,6,3.6,i?'#F2EDE4':'#8A5A3B');});
    ln('#5A3A2A',1.4,0,-18,46,-20);
    rr(-34,-46,46,30,5,'#C0473A');rr(-34,-46,46,5,3,'#8A2A2A');rr(-28,-40,14,12,2,'#F2E6C9');rr(-10,-40,14,12,2,'#F2E6C9');rr(-36,-50,50,5,2,'#5A3A2A');
    kid(14,-28,'#5A3A2A',SKIN[0],'#5A3A2A',1);rr(8,-44,12,3,1,'#3A2A20');
    wheel(-26,-10,10,sp);wheel(4,-10,10,sp);circ(-26,-10,4,'#F2C24A');circ(4,-10,4,'#F2C24A');});
  hit('stagecoach',x-40,y-56,x+68,y+2,{moving:1,small:1});}});});
/* water tower and wind pump by the station; Wild West station */
S(1196,[3700,1060,3780,1200],()=>{const x=3740,b=1196,t=fx('watertower');
  [[-22],[16]].forEach(([o])=>ln('#7A4E33',4,x+o,b,x+o*0.6,b-70));ln('#7A4E33',2,x-22,b-20,x+16,b-50);ln('#7A4E33',2,x+16,b-20,x-22,b-50);
  rr(x-26,b-118,52,50,4,'#9A6440');for(let k=0;k<3;k++)rr(x-26,b-108+k*16,52,3,0,'#5A3A2A');poly('#7A4E33',x-30,b-118,x,b-136,x+30,b-118);
  ln('#5A5A5A',3,x+26,b-90,x+40,b-90,x+40,b-70);if(t<2.5&&Math.random()<0.7)PARTS.push({x:x+40,y:b-68,vx:rnd(-6,6),vy:rnd(0,20),life:0,max:0.8,k:'drop',r:4,c:'#8ED2F4',gr:200});
  hit('watertower',x-30,b-138,x+44,b);});
S(1200,[2960,1080,3040,1204],()=>{const T=TT(),x=3000,b=1200,a=T*2;
  ln('#9AA4B8',2,x-14,b,x,b-100);ln('#9AA4B8',2,x+14,b,x,b-100);for(let k=1;k<5;k++)ln('#9AA4B8',1,x-14+k*2.8,b-k*20,x+14-k*2.8,b-k*20);
  for(let k=0;k<12;k++){const ang=a+k/12*TAU;g.save();g.translate(x,b-104);g.rotate(ang);poly(k%2?'#E9ECF2':'#C9D0DB',0,0,24,-4,24,4);g.restore();}
  circ(x,b-104,4,'#7E889C');poly('#C9D0DB',x+2,b-104,x+26,b-112,x+26,b-96);hit('windpump',x-28,b-130,x+28,b);});
S(1208,[3460,1120,3650,1210],()=>{const {Ye,Yr}=gableB(3470,1172,170,36,56,'#C9965A','#7A4A3A'),base=1208;
  sign(3555,Ye+12,90,14,L3(['BAHNHOF','STATION','ESTACIÓN']),'#5A3A2A','#FFE9C2');rr(3543,base-24,24,24,[10,10,0,0],'#6E4A33');
  win(3484,Ye+22,22,16,'#7A4A3A');win(3612,Ye+22,22,16,'#7A4A3A');
  [[3430,1232,0],[3660,1230,3]].forEach(([px,py,k])=>{if(!(TRAIN.dwell&&TRAIN.leg===0&&TRAIN.t>0.8))kid(px,py,['#FF8A3D','#7ED957','#3CC8F5','#B78CFF'][k],SKIN[k],HAIR[k],1.15);});
  hit('weststation',3460,Yr-6,3650,base+28);});
/* desert: cacti, bison, gold mine, coyote, snake, lizard, roadrunner, vulture, tumbleweeds */
function cactus(x,y,s){ell(x+4,y+1,10*s,3*s,'rgba(80,50,20,.2)');rr(x-5*s,y-48*s,10*s,48*s,5*s,'#4C9E3E');
  rr(x-17*s,y-34*s,7*s,16*s,3.5*s,'#4C9E3E');rr(x-17*s,y-24*s,14*s,6*s,3*s,'#4C9E3E');rr(x+10*s,y-40*s,7*s,18*s,3.5*s,'#4C9E3E');rr(x+3*s,y-28*s,14*s,6*s,3*s,'#4C9E3E');
  ln('#3E8A35',1,x,y-44*s,x,y-4);ln('#3E8A35',1,x-2.5*s,y-44*s,x-2.5*s,y-4);hit('cactus',x-18*s,y-50*s,x+18*s,y);}
const CACTI=[];for(let i=0;i<300&&CACTI.length<26;i++){const x=2870+sr()*1110,y=640+sr()*1060;
  if(y>600&&y<830||y>930&&y<1280||Math.hypot(x-3800,y-1430)<110||Math.hypot(x-3080,y-1460)<120||Math.hypot(x-3550,y-1370)<50)continue;
  if(CACTI.some(c=>Math.hypot(x-c[0],y-c[1])<70))continue;CACTI.push([x,y,0.7+sr()*0.5]);}
CACTI.forEach(([x,y,s])=>S(y,[x-20,y-60,x+20,y+4],()=>cactus(x,y,s)));
[[3050,1420,1],[3130,1468,-1],[2995,1500,1]].forEach(([x,y,f],i)=>S(y,[x-34,y-40,x+34,y+4],()=>{const T=TT(),t=fx('bison'),st=t<1.5?Math.sin(t*14)*2:0,graze=t>1.5&&Math.sin(T*0.4+i*2)>0;
  flip(x,y,f,()=>{ell(0,1,26,5,'rgba(80,50,20,.2)');[-14,-8,8,14].forEach(lx=>rr(lx-2,-12+st*0.5,4,12,1,'#3A2A20'));
    ell(-4,-16,20,11,'#6E4A33');ell(10,-20,14,13,'#5A3A2A');ln('#5A3A2A',2,-22,-18,-26,-8);
    g.save();g.translate(22,graze?-10:-16);ell(0,0,7,7,'#4A3020');poly('#F2E6C9',-4,-5,-8,-12,-2,-7);circ(3,-1,1,'#222');ell(5,4,3,2,'#3A2A20');g.restore();});
  hit('bison',x-30,y-34,x+32,y+2,{small:1});}));
S(1470,[3700,1340,3900,1472],()=>{const T=TT(),t=fx('mine');
  ell(3800,1440,110,60,'#B86A3E');ell(3790,1430,90,48,'#C8784A');ell(3780,1416,40,20,'#D98A5A');
  rr(3772,1416,46,50,[22,22,0,0],'#2B2233');rr(3766,1410,6,58,1,'#8A5A3B');rr(3818,1410,6,58,1,'#8A5A3B');rr(3764,1406,62,8,2,'#8A5A3B');
  ln('#7E889C',2,3700,1464,3790,1464);ln('#7E889C',2,3700,1470,3790,1470);for(let x=3704;x<3790;x+=10)ln('#6E4A33',2,x,1462,x,1472);
  const out=t<6?Math.sin(Math.min(1,t/6)*Math.PI):0,cx=3790-out*80;
  if(out>0.05){rr(cx-16,1446,32,16,3,'#7E889C');for(let k=0;k<5;k++)circ(cx-10+k*5,1446-(k%2)*3,4,'#FFC928');circ(cx-9,1464,4,'#3A3F52');circ(cx+9,1464,4,'#3A3F52');
    if(Math.random()<0.1)PARTS.push({x:cx+rnd(-10,10),y:1440,vx:rnd(-20,20),vy:rnd(-50,-30),life:0,max:0.9,k:'star',r:3,c:'#FFD23F',gr:60});LIGHTS.push(cx,1446,30,'#FFE680');}
  hit('mine',3700,1380,3900,1472);});
S(1372,[3510,1300,3600,1374],()=>{const T=TT(),t=fx('coyote'),howl=t<2.5||ST.NIGHT>0.5&&(T%8)<2,x=3555,y=1356;
  poly('#C8784A',3515,1374,3530,1352,3580,1350,3596,1374);
  flip(x,y,1,()=>{ell(-12,-6,8,3.6,'#C99A6A',0.5);ell(0,-12,9,11,'#C99A6A');ell(2,-9,4,7,'#F2E3C9');g.save();g.translate(2,-23);g.rotate(howl?-0.7:0);
    circ(0,0,6,'#C99A6A');poly('#C99A6A',-4,-3,-3,-12,1,-5);poly('#C99A6A',2,-4,5,-12,6,-3);ell(6,2,5,2.6,'#C99A6A');circ(10,1.6,1.1,'#222');circ(2,-1,0.9,'#222');g.restore();});
  hit('coyote',x-18,y-34,x+16,y+2,{small:1});});
S(1600,[3270,1570,3340,1604],()=>{const T=TT(),t=fx('snake'),x=3300,y=1598,up=t<3?1:0,rt=(t<3?Math.sin(T*40):Math.sin(T*3)*0.3)*2;
  ell(x,y-3,14,5,'#9A8A3A');ell(x,y-6,10,4,'#B8A848');ell(x,y-9,6,3,'#9A8A3A');for(let k=0;k<5;k++)circ(x-10+k*5,y-4,1.4,'#5A4A1A');
  g.save();g.translate(x+12,y-6);g.rotate(rt*0.1);rr(0,-2,8,4,2,'#C9B868');g.restore();
  g.save();g.translate(x-4,y-10);g.rotate(up?-1.1:-0.3);rr(-2,-12,5,12,2.5,'#9A8A3A');ell(0,-13,4,3,'#9A8A3A');circ(1,-14,0.8,'#222');if(up)ln('#E8443A',1,0,-16,0,-20);g.restore();
  hit('snake',x-18,y-28,x+22,y+2,{small:1});});
S(1660,[3420,1630,3500,1664],()=>{const T=TT(),t=fx('lizard'),x=3460,y=1650,dx=t<2?Math.sin(t*6)*8:0;
  ell(x,y+4,26,8,'#B8A090');ell(x-4,y,22,7,'#C9B4A2');
  g.save();g.translate(x+dx,y-6);ln('#5DB04A',3,-10,0,-22,4);ell(0,0,10,3.6,'#5DB04A');circ(11,-1,3,'#5DB04A');circ(12,-2,0.9,'#222');
  [[-6,1],[6,1]].forEach(([lx,s])=>{ln('#4C9E3E',1.4,lx,0,lx-3,5);ln('#4C9E3E',1.4,lx,0,lx+3,-4);});g.restore();
  hit('lizard',x-24,y-14,x+20,y+4,{small:1});});
const RR={x:3300,dir:1};
K.UPDATE.push(dt=>{RR.x+=RR.dir*dt*(fx('roadrunner')<3?260:90);if(RR.x>3720)RR.dir=-1;if(RR.x<3150)RR.dir=1;});
K.DYN.push(L=>{const x=RR.x,y=1540;if(!inV(x-30,y-40,x+30,y+4))return;L.push({y,f:()=>{const T=TT(),st=Math.sin(T*30);
  flip(x,y,RR.dir,()=>{ln('#E8A33A',1.4,-2,-10,-4+st*4,0);ln('#E8A33A',1.4,2,-10,4-st*4,0);ell(0,-14,10,5,'#5A6E9A',-0.2);ln('#3A4A6A',3,-8,-14,-22,-22);
    circ(9,-22,5,'#5A6E9A');poly('#3A4A6A',6,-26,2,-34,10,-27);poly('#E8A33A',13,-22,22,-21,13,-19);circ(10,-23,1.1,'#FFF');circ(10.4,-23,0.6,'#222');});
  if(fx('roadrunner')<3&&Math.random()<0.4)puff(x-RR.dir*10,y-2,{c:'#E2C08A',r:3,max:0.7});
  hit('roadrunner',x-16,y-34,x+20,y+2,{moving:1,small:1});}});});
K.TOP.push(()=>{const T=TT(),t=fx('vulture'),a=T*0.22,x=3400+Math.cos(a)*260,y=1300+Math.sin(a)*90,fl=t<2?Math.sin(t*14):Math.sin(T)*0.15;
  if(!inV(x-50,y-30,x+50,y+30))return;
  g.save();g.translate(x,y);g.scale(-Math.sin(a)>0?1:-1,1);poly('#3A2A2A',-4,0,-36,-4-fl*12,-30,6,-10,6);poly('#3A2A2A',4,0,36,-4-fl*12,30,6,10,6);
  for(let k=0;k<3;k++){ln('#2A1A1A',1.4,-30-k*2,2,-38-k*2,-2-fl*10+k*3);ln('#2A1A1A',1.4,30+k*2,2,38+k*2,-2-fl*10+k*3);}
  ell(0,2,8,5,'#4A3A3A');circ(9,-2,3.6,'#E8A0A0');poly('#E8D8B8',11,-2,16,0,11,1);ell(4,-1,4,3,'#F2EDE4');g.restore();
  hit('vulture',x-36,y-20,x+36,y+12,{moving:1,small:1});});
const TUMB=[{x:3900,y:1340,s:1},{x:3400,y:1680,s:0.8}];
K.UPDATE.push(dt=>{TUMB.forEach(tw=>{tw.x-=dt*(fx('tumbleweed')<3?120:40)*tw.s;if(tw.x<2860)tw.x=3980;});});
K.DYN.push(L=>{const T=TT();TUMB.forEach(tw=>{const b=Math.abs(Math.sin(T*3+tw.x*0.02))*10*tw.s,x=tw.x,y=tw.y;if(!inV(x-20,y-30,x+20,y+4))return;
  L.push({y,f:()=>{ell(x,y,10*tw.s,3,'rgba(80,50,20,.18)');g.save();g.translate(x,y-12*tw.s-b);g.rotate(-x/12);g.strokeStyle='#A8844A';g.lineWidth=1.2;
    for(let k=0;k<7;k++){g.beginPath();g.ellipse(0,0,12*tw.s,8*tw.s,k/7*Math.PI,0,TAU);g.stroke();}g.restore();
    hit('tumbleweed',x-14,y-28,x+14,y+2,{moving:1,small:1});}});});});
S(1580,[3600,1560,3650,1584],()=>{ell(3625,1576,12,6,'#F2EDE4');circ(3619,1574,2,'#5A4A3A');circ(3631,1574,2,'#5A4A3A');ln('#F2EDE4',2.4,3614,1572,3604,1564,3600,1568);ln('#F2EDE4',2.4,3636,1572,3646,1564,3650,1568);});

/* =============================================================
   TAPS, TRAIN ARRIVALS, ZONES
============================================================= */
Object.assign(TAP,{
  shuttle:()=>launch('shuttle'),rocket:()=>launch('rocket'),control:()=>{act('control');S3.count();},dish:()=>{SND.whoosh();},astronaut:()=>{act('astronaut');S3.boing();},
  grandstand:()=>S3.cheer(),buggy:()=>{act('buggy');SND.motor();},jetpack:()=>{act('jetpack');S3.launch();},
  ufo:(r)=>{if(r==='beam')act('ufo2');else act('ufo');S3.ufo();},alien:()=>{act('alien');S3.ufo();},
  spacecenter:()=>{S3.count();},
  weststation:()=>rideTrain(STOP_WEST),wildwest:()=>{S3.yeehaw();},desert:(r,x,y)=>burst(x,y,'drop',8,'#E2BE7A',0.5),
  saloon:()=>{act('saloon');S3.piano();},sheriff:()=>{SND.whistle();},store:()=>{SND.ding();},hotel:()=>{SND.ding();},
  cowboy:()=>{act('cowboy');S3.yeehaw();setTimeout(()=>S3.whip(),400);},stagecoach:()=>{act('stagecoach');S3.trot();},
  watertower:()=>{act('watertower');S3.splash();},windpump:()=>{SND.whoosh();},mine:()=>{act('mine');S3.coins();},
  cactus:()=>{SND.squeak();},mesa:()=>{SND.whoosh();},tumbleweed:()=>{act('tumbleweed');SND.whoosh();},
  bison:()=>{act('bison');S3.snort();},coyote:()=>{act('coyote');S3.howl();},snake:()=>{act('snake');S3.rattle();},
  roadrunner:()=>{act('roadrunner');S3.meep();},vulture:()=>{act('vulture');swp(1200,700,0.4,'sawtooth',0.05);},lizard:()=>{act('lizard');SND.squeak();}});
const prev=K.onArrive;
K.onArrive=to=>{if(prev)prev(to);
  if(to===STOP_WEST){later(0.3,()=>{say(L3(['Willkommen im Wilden Westen! Yeehaw!','Welcome to the Wild West! Yeehaw!','¡Bienvenido al Lejano Oeste! ¡Yijaa!']));S3.yeehaw();});}
  else later(0.3,()=>say(L3(['Wir sind wieder in der Stadt!','We are back in town!','¡Ya estamos de vuelta en la ciudad!'])));};
K.ZONES.unshift((x,y)=>{
  if(x<2826||y>1720)return null;
  if(y<590&&y>-290)return 'spacecenter';
  if(y>=590&&y<1740){if(x>2880&&x<3960&&y>860&&y<1070)return 'wildwest';return 'desert';}
  return null;});
at('spacecenter',[2900,120,3950,420]);at('wildwest',[2900,880,3700,1060]);at('desert',[2900,1300,3900,1700]);
}
