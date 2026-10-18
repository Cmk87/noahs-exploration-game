/* =============================================================
   FAR EAST: INDUSTRIAL AREA AND JAIL (loaded before js/city.js,
   which calls cityIndustry(K)). A see-through car factory with robot
   arms, a waste incinerator with a grab crane over the fire, recycling
   containers, a warehouse with a forklift, a container crane and a
   garbage truck; south of the road a jail you can look into, with
   robbers in their cells, a guard, watchtowers, an exercise yard and a
   police van that brings in a new robber.
============================================================= */
function cityIndustry(K){
const {rr,circ,ell,poly,ln,star,shade,FONT,sign,win,gableB,flatB,kid,SKIN,HAIR,ent,ANIMALS,S,hit,fx,act,later,puff,burst,textP,
  PARTS,LIGHTS,SND,swp,sr,sm,li,ST,TAP,VIEW,TAU,g,wheel}=K;
const ANI=(id,ic,n,l)=>{ANIMALS.push([id,ic,n,l]);ent(id,ic,n,l,{animal:1});};
const at=(id,b)=>{K.ENT[id].at=b;};
const inV=(x0,y0,x1,y1)=>x1>VIEW[0]&&x0<VIEW[2]&&y1>VIEW[1]&&y0<VIEW[3];
const flip=(x,y,f,fn)=>{g.save();g.translate(x,y);g.scale(f,1);fn();g.restore();};
const TT=()=>ST.T,L3=a=>a[li()];
const IX0=4046,IX1=5376;

/* ---------- words ---------- */
ent('industry','🏭',['das Industriegebiet','the industrial area','la zona industrial'],['Das Industriegebiet! Hier wird gearbeitet.','The industrial area! People work hard here.','¡La zona industrial! Aquí se trabaja mucho.'],{find:1});
ent('works','🏭',['die Fabrik','the factory','la fábrica'],['Die Fabrik! Tuuut, Feierabend!','The factory! Toot, home time!','¡La fábrica! ¡Tuuut, hora de irse a casa!'],{find:1});
ent('carfactory','🚗',['die Autofabrik','the car factory','la fábrica de coches'],['Die Autofabrik! Die Roboter bauen Autos.','The car factory! Robots are building cars.','¡La fábrica de coches! Los robots construyen coches.'],{find:1});
ent('robot','🤖',['der Roboter','the robot','el robot'],['Der Roboter! Er schweißt. Zisch!','The robot! It is welding. Zzzt!','¡El robot! Está soldando. ¡Zzzz!'],{find:1});
ent('incinerator','🔥',['die Müllverbrennung','the waste incinerator','la incineradora'],['Die Müllverbrennung! Hier wird Müll verbrannt, und daraus wird Strom.','The incinerator! Rubbish is burned here to make electricity.','¡La incineradora! Aquí se quema la basura y se hace electricidad.'],{find:1});
ent('trash','🗑️',['der Müll','the rubbish','la basura'],null,{find:1});
ent('garbagetruck','🚛',['das Müllauto','the garbage truck','el camión de la basura'],['Das Müllauto! Es holt den Müll ab.','The garbage truck! It collects the rubbish.','¡El camión de la basura! Recoge la basura.'],{find:1});
ent('recycling','♻️',['der Wertstoffhof','the recycling centre','el punto limpio'],['Der Wertstoffhof! Hier wird Müll sortiert.','The recycling centre! Rubbish gets sorted here.','¡El punto limpio! Aquí se separa la basura.'],{find:1});
ent('glass','🍾',['das Altglas','the glass','el vidrio'],['Altglas! Hier kommen Flaschen und Gläser rein. Klirr!','Glass! Bottles and jars go in here. Clink!','¡Vidrio! Aquí van las botellas y los tarros. ¡Clinc!'],{find:1});
ent('paper','📦',['das Altpapier','the paper','el papel'],['Altpapier! Zeitungen und Kartons.','Paper! Newspapers and boxes.','¡Papel! Periódicos y cajas.'],{find:1});
ent('plastic','🥤',['der Plastikmüll','the plastic','el plástico'],['Plastik! Joghurtbecher und Plastikflaschen.','Plastic! Yoghurt pots and plastic bottles.','¡Plástico! Vasos de yogur y botellas de plástico.'],{find:1});
ent('metal','🥫',['das Metall','the metal','el metal'],['Metall! Dosen und Deckel.','Metal! Cans and lids.','¡Metal! Latas y tapas.'],{find:1});
ent('biowaste','🍌',['der Biomüll','the food waste','la basura orgánica'],['Biomüll! Bananenschalen und Apfelreste.','Food waste! Banana peels and apple cores.','¡Orgánico! Cáscaras de plátano y restos de manzana.'],{find:1});
ent('warehouse','🏬',['die Lagerhalle','the warehouse','el almacén'],null,{find:1});
ent('forklift','🛻',['der Gabelstapler','the forklift','la carretilla elevadora'],['Der Gabelstapler! Er hebt schwere Paletten.','The forklift! It lifts heavy pallets.','¡La carretilla elevadora! Levanta palés pesados.'],{find:1});
ent('portcrane','🏗️',['der Containerkran','the container crane','la grúa de contenedores'],['Der Containerkran! Er hebt riesige Kisten.','The container crane! It lifts giant boxes.','¡La grúa de contenedores! Levanta cajas gigantes.'],{find:1});
ent('jail','🚔',['das Gefängnis','the jail','la cárcel'],['Das Gefängnis! Hier müssen die Räuber bleiben.','The jail! The robbers have to stay here.','¡La cárcel! Aquí se quedan los ladrones.'],{find:1});
ent('robber','🦹',['der Räuber','the robber','el ladrón'],['Der Räuber! Er hat Bonbons geklaut. Jetzt muss er hierbleiben.','The robber! He stole some sweets. Now he has to stay here.','¡El ladrón! Robó caramelos. Ahora tiene que quedarse aquí.'],{find:1});
ent('cell','🔒',['die Zelle','the cell','la celda'],null,{find:1});
ent('guard','👮',['der Wärter','the guard','el guardia'],['Der Wärter! Er hat alle Schlüssel.','The guard! He has all the keys.','¡El guardia! Tiene todas las llaves.'],{find:1});
ent('watchtower','🗼',['der Wachturm','the watchtower','la torre de vigilancia'],['Der Wachturm! Von hier sieht man alles.','The watchtower! You can see everything from here.','¡La torre de vigilancia! Desde aquí se ve todo.'],{find:1});
ent('policevan','🚐',['der Polizeibus','the police van','el furgón policial'],['Der Polizeibus! Er bringt einen neuen Räuber.','The police van! It brings a new robber.','¡El furgón policial! Trae a un nuevo ladrón.'],{find:1});
ent('jailyard','🏀',['der Gefängnishof','the jail yard','el patio de la cárcel'],['Der Gefängnishof! Hier spielen die Räuber Basketball.','The jail yard! The robbers play basketball here.','¡El patio de la cárcel! Aquí los ladrones juegan al baloncesto.'],{find:1});
ANI('rat','🐀',['die Ratte','the rat','la rata'],['Die Ratte! Sie sucht Essensreste im Müll.','The rat! It looks for food in the rubbish.','¡La rata! Busca comida en la basura.']);
ANI('policedog','🐕',['der Polizeihund','the police dog','el perro policía'],['Der Polizeihund! Wuff, wuff!','The police dog! Woof, woof!','¡El perro policía! ¡Guau, guau!']);
const PCOL=['#FF5A5F','#3CC8F5','#FFC928','#7ED957','#B78CFF'];

/* ---------- sounds ---------- */
const S5={
  horn:()=>{beep(196,0,1.1,'sawtooth',0.08);beep(247,0,1.1,'sawtooth',0.06);},
  weld:()=>{for(let i=0;i<10;i++)setTimeout(()=>noise(0.05,0.15),i*60);swp(2000,3000,0.5,'square',0.03);},
  fire:()=>{noise(1.2,0.2);swp(200,60,1,'sawtooth',0.07);},
  clink:()=>{[2600,3100,2800].forEach((f,i)=>beep(f,i*0.12,0.25,'sine',0.08));},
  rustle:()=>noise(0.4,0.12),
  crunch:()=>{for(let i=0;i<5;i++)setTimeout(()=>noise(0.07,0.18),i*80);},
  clang:()=>{beep(520,0,0.5,'square',0.06);beep(780,0,0.5,'triangle',0.06);},
  splat:()=>{noise(0.2,0.2);swp(300,100,0.2,'sine',0.1);},
  beep:()=>{for(let i=0;i<4;i++)beep(1000,i*0.3,0.15,'square',0.07);},
  keys:()=>{for(let i=0;i<8;i++)beep(3000+Math.random()*1500,i*0.06,0.05,'triangle',0.05);},
  harmonica:()=>{[392,440,494,440,392,330,392].forEach((f,i)=>{beep(f,i*0.22,0.22,'sawtooth',0.04);beep(f*2,i*0.22,0.22,'triangle',0.03);});},
  bounce:()=>{[0,0.3,0.6].forEach(t=>beep(140,t,0.08,'sine',0.15));},
  woof:()=>{[0,0.3].forEach(t=>swp(500,250,0.14,'sawtooth',0.09,t));},
  squeak:()=>{for(let i=0;i<3;i++)beep(3200,i*0.1,0.05,'sine',0.07);},
  alarm:()=>{for(let i=0;i<6;i++){beep(700,i*0.35,0.17,'square',0.05);beep(900,i*0.35+0.17,0.17,'square',0.05);}}};

/* =============================================================
   GROUND
============================================================= */
K.GROUND0.push(()=>{
  if(inV(IX0,-300,IX1,790)){
    rr(IX0,-290,IX1-IX0,1070,26,'#CDD1D8');
    g.fillStyle='#BCC1CA';for(let x=IX0+20;x<IX1;x+=60)for(let y=-270;y<770;y+=60)g.fillRect(x,y,58,1.2);
    rr(4680,-120,44,900,4,'#646B7F');rr(4060,410,1300,44,4,'#646B7F');
    g.fillStyle='rgba(255,255,255,.8)';for(let y=-110;y<770;y+=28)g.fillRect(4700,y,3,14);for(let x=4070;x<5350;x+=28)g.fillRect(x,431,14,3);
    rr(4560,290,104,110,6,'#B9BEC8');g.fillStyle='#FFFFFF';for(let k=0;k<4;k++)g.fillRect(4562,300+k*26,100,2);}
  if(inV(IX0,820,IX1,1710)){
    rr(IX0,830,IX1-IX0,880,26,'#A8D88A');rr(4130,890,1180,770,10,'#C9C3B8');
    rr(4330,1250,520,270,8,'#D98A5A');g.strokeStyle='#FFFFFF';g.lineWidth=3;g.strokeRect(4340,1260,500,250);g.beginPath();g.moveTo(4590,1260);g.lineTo(4590,1510);g.stroke();
    g.beginPath();g.arc(4590,1385,40,0,TAU);g.stroke();
    rr(4900,1300,180,140,8,'#7A5A3A');for(let r=0;r<4;r++)for(let c=0;c<6;c++){ell(4920+c*28,1320+r*32,8,4,'#5DB04A');}
    rr(4720,840,44,60,0,'#646B7F');}
});

/* =============================================================
   INDUSTRY
============================================================= */
/* old brick factory with a sawtooth roof and three chimneys */
S(-130,[4080,-330,4420,-128],()=>{const T=TT(),x=4090,y=-200,w=320,d=70,h=96,base=y+d;
  [[4130],[4210],[4290]].forEach(([cx],k)=>{rr(cx,y-h-110,24,120,[3,3,0,0],'#A8503A');rr(cx-3,y-h-116,30,8,2,'#7A3A2A');for(let j=0;j<4;j++)rr(cx,y-h-90+j*26,24,3,0,'#8A402E');
    if(Math.random()<(fx('works')<5?0.5:0.12))puff(cx+12,y-h-118,{c:'#B9BEC8',r:7,vy:-20,max:3});});
  rr(x+6,base-5,w+6,10,5,'rgba(0,0,0,.15)');rr(x,y-h,w,d,2,'#9AA4B8');
  for(let k=0;k<8;k++){const sx=x+k*40;poly('#B9C1CC',sx,y-h+d,sx,y-h+10,sx+40,y-h+d);poly('#8ED2F4',sx,y-h+10,sx+6,y-h+20,sx+6,y-h+d,sx,y-h+d);}
  rr(x,base-h,w,h,[0,0,3,3],'#B85A3E');g.strokeStyle='rgba(0,0,0,.08)';g.lineWidth=1;g.beginPath();for(let yy=base-h+6;yy<base;yy+=7){g.moveTo(x,yy);g.lineTo(x+w,yy);}g.stroke();
  for(let k=0;k<6;k++)win(x+14+k*50,base-h+30,32,26,'#7A3A2A');sign(x+w/2,base-h+14,110,16,L3(['FABRIK','FACTORY','FÁBRICA']),'#2B2233','#FFFFFF');
  rr(x+w/2-24,base-30,48,30,[3,3,0,0],'#5A6074');hit('works',x-4,y-h-120,x+w+4,base);});
/* warehouse with a forklift in front */
S(-110,[4770,-300,5090,-108],()=>{const x=4780,y=-190,w=300,d=80,h=80,Fy=flatB(x,y,w,d,h,'#7EA0C8','#B9C1CC','#5A7FB0'),base=y+d;
  for(let k=0;k<3;k++){rr(x+20+k*96,Fy+20,76,h-20,[3,3,0,0],'#E9ECF2');for(let j=0;j<6;j++)rr(x+20+k*96,Fy+24+j*9,76,2,0,'#C9D0DB');}
  sign(x+w/2,Fy+10,110,13,L3(['LAGER','WAREHOUSE','ALMACÉN']),'#FFFFFF','#2B3A6B');hit('warehouse',x-4,y-h,x+w+4,base);});
const PALS=[[4820,40],[4860,40],[4820,0]];
S(60,[4800,-20,5200,64],()=>{PALS.forEach(([px,py],k)=>{rr(px-14,py-4,28,4,1,'#B07A4E');rr(px-12,py-22,24,18,2,PCOL[k+1]);});
  rr(5100,0,90,40,4,'#E9ECF2');rr(5180,8,24,32,4,'#E8443A');rr(5186,12,14,10,2,'#8ED2F4');circ(5120,42,7,'#2B2D3A');circ(5190,42,7,'#2B2D3A');});
K.DYN.push(L=>{if(!inV(4780,-40,5200,80))return;const T=TT(),t=fx('forklift'),ph=(T*0.12)%1,go=ph<0.5,u=go?sm(ph*2):sm((1-ph)*2),x=4880+u*180,y=56,lift=t<3?Math.sin(t/3*Math.PI)*22:(go?6:0);
  L.push({y,f:()=>{flip(x,y,go?1:-1,()=>{rr(-16,-20,30,16,4,'#FFC928');rr(-12,-36,18,16,[4,4,0,0],'rgba(0,0,0,0)');ln('#2B2233',2,-12,-20,-12,-38);ln('#2B2233',2,6,-20,6,-38);ln('#2B2233',2,-12,-38,6,-38);
      kid(-3,-18,'#FF8A3D',SKIN[1],HAIR[0],0.9);rr(14,-40,4,36,1,'#5A6074');rr(14,-8-lift,22,3,1,'#5A6074');if(go||t<3)rr(18,-26-lift,20,18,2,PCOL[2]);
      circ(-10,-4,6,'#2B2D3A');circ(8,-4,5,'#2B2D3A');circ(-12,-30,0,'#000');});
    if(Math.sin(T*6)>0)LIGHTS.push(x-6,y-40,20,'#FF9A2A');hit('forklift',x-22,y-46,x+40,y+2,{moving:1,small:1});}});});
/* car factory: open front, robots weld car bodies on the line, finished cars roll into the car park */
const CARC=['#FF5A5F','#3CC8F5','#7ED957','#FFC928','#B78CFF'];
function carShell(x,y,stage,c){const L=34,H=16;
  if(stage===0){rr(x-L/2,y-H*0.5,L,H*0.35,2,'#9AA4B8');ln('#7E889C',2,x-L*0.3,y-H*0.5,x-L*0.15,y-H);ln('#7E889C',2,x+L*0.2,y-H*0.5,x+L*0.1,y-H);ln('#7E889C',2,x-L*0.15,y-H,x+L*0.1,y-H);return;}
  const col=stage===1?'#C9CED8':c;rr(x-L/2,y-H*0.62,L,H*0.5,[5,7,4,4],col);rr(x-L*0.28,y-H,L*0.52,H*0.45,[6,6,0,0],col);
  if(stage>=2){rr(x-L*0.22,y-H*0.92,L*0.18,H*0.32,2,'#BFE6FA');rr(x,y-H*0.92,L*0.18,H*0.32,2,'#BFE6FA');wheel(x-L*0.3,y-H*0.13,H*0.2,0);wheel(x+L*0.3,y-H*0.13,H*0.2,0);}}
function robotArm(x,y,a,ph){g.lineCap='round';rr(x-10,y-8,20,8,2,'#5A6074');const s1=-1.9+Math.sin(ph)*0.35,s2=0.9+Math.cos(ph*1.3)*0.4;
  const ex=x+Math.cos(s1)*26,ey=y-8+Math.sin(s1)*26,hx=ex+Math.cos(s1+s2)*22,hy=ey+Math.sin(s1+s2)*22;
  ln('#F2862A',8,x,y-8,ex,ey);ln('#F2862A',6,ex,ey,hx,hy);circ(x,y-8,5,'#3A3F52');circ(ex,ey,4,'#3A3F52');circ(hx,hy,3,'#3A3F52');g.lineCap='butt';return [hx,hy];}
const LOT=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++)LOT.push([4580+c*34,322+r*26,CARC[(r*3+c)%5]]);let lotN=5;
S(272,[4080,90,4560,274],()=>{const T=TT(),t=fx('carfactory'),spd=t<5?50:18,x=4090,y=180,w=440,d=90,h=140,Ye=y+d-h,base=y+d;
  rr(x+6,base-5,w+8,10,5,'rgba(0,0,0,.15)');rr(x,y-h,w,d,4,'#B9C1CC');for(let k=0;k<5;k++)rr(x+30+k*80,y-h+20,50,30,3,'#8ED2F4');
  rr(x,Ye,w,h,[0,0,4,4],'#E9ECF2');rr(x,Ye,w,8,0,'#3B7DE2');sign(x+w/2,Ye+22,160,18,L3(['AUTOFABRIK','CAR FACTORY','FÁBRICA DE COCHES']),'#3B7DE2','#FFFFFF');
  const ix=x+16,iy=Ye+38,iw=w-32,ih=h-46;rr(ix-4,iy-4,iw+8,ih+8,8,'#7E889C');rr(ix,iy,iw,ih,6,'#F4F0E6');
  g.save();g.beginPath();g.rect(ix,iy,iw,ih);g.clip();
  for(let k=0;k<5;k++)rr(ix+10+k*84,iy+6,60,18,3,'#E3DFD3');for(let k=0;k<4;k++)circ(ix+50+k*96,iy+12,5,'#FFE680');
  const by=iy+ih-14;rr(ix,by,iw,10,3,'#4F5568');for(let k=0;k<iw;k+=16)circ(ix+8+((k+T*spd)%iw),by+5,2,'#7E889C');
  for(let k=0;k<6;k++){const px=ix+((k*72+T*spd)%(iw+60))-30,stage=px<ix+iw*0.3?0:px<ix+iw*0.6?1:px<ix+iw*0.8?2:3;carShell(px,by,stage,CARC[k%5]);}
  [[ix+iw*0.3],[ix+iw*0.55],[ix+iw*0.78]].forEach(([rx],k)=>{const [hx,hy]=robotArm(rx,iy+34,0,T*(t<5?6:3)+k*2);
    if(Math.sin(T*(t<5?6:3)+k*2)>0.3){for(let s=0;s<2;s++)PARTS.push({x:hx,y:hy,vx:rnd(-40,40),vy:rnd(-40,10),life:0,max:0.4,k:'drop',r:2.6,c:'#FFE14D',gr:150});LIGHTS.push(hx,hy,24,'#FFE680');}});
  kid(ix+iw*0.15,by-1,'#3B7DE2',SKIN[0],HAIR[1],1.4);rr(ix+iw*0.15-5,by-26,10,4,2,'#FFC928');kid(ix+iw*0.92,by-1,'#3B7DE2',SKIN[2],HAIR[0],1.4);rr(ix+iw*0.92-5,by-26,10,4,2,'#FFC928');
  g.restore();rr(x+w-2,base-34,20,34,2,'#5A6074');
  hit('carfactory',x-4,y-h,x+w+4,base);hit('robot',ix+iw*0.2,iy,ix+iw*0.9,iy+60,{small:1});});
S(400,[4560,300,4670,404],()=>{LOT.forEach(([cx,cy,c],k)=>{if(k>=lotN)return;g.save();g.translate(cx,cy+12);ell(0,1,16,3,'rgba(0,0,0,.2)');
  rr(-17,-10,34,8,[5,7,4,4],c);rr(-9,-16,18,7,[6,6,0,0],c);rr(-7,-15,6,5,2,'#BFE6FA');rr(1,-15,6,5,2,'#BFE6FA');circ(-10,-2,3,'#2B2D3A');circ(10,-2,3,'#2B2D3A');g.restore();});
  hit('carfactory',4560,300,4670,404);});
/* waste incinerator: grab crane over the bunker, fire, tall chimney */
S(352,[4770,10,5200,354],()=>{const T=TT(),t=fx('incinerator'),hot=t<4?1:0,x=4780,y=260,w=300,d=90,h=124,Ye=y+d-h,base=y+d;
  const cx=5150;rr(cx-14,base-330,28,330,[3,3,0,0],'#C9CED8');for(let k=0;k<3;k++)rr(cx-14,base-320+k*16,28,8,0,k%2?'#C9CED8':'#E8443A');
  if(Math.random()<(hot?0.6:0.2))puff(cx,base-336,{c:'#E9ECF2',r:8,vy:-22,max:3.4});
  rr(x+6,base-5,w+6,10,5,'rgba(0,0,0,.15)');rr(x,y-h,w,d,4,'#9AA4B8');rr(x,Ye,w,h,[0,0,4,4],'#5F7A6A');
  sign(x+w/2,Ye+16,180,17,L3(['MÜLLVERBRENNUNG','INCINERATOR','INCINERADORA']),'#FFFFFF','#2E5A40');
  const ix=x+14,iy=Ye+34,iw=w-28,ih=h-42;rr(ix-4,iy-4,iw+8,ih+8,8,'#3A4A40');rr(ix,iy,iw,ih,6,'#E9E2D0');
  g.save();g.beginPath();g.rect(ix,iy,iw,ih);g.clip();
  rr(ix,iy+ih-34,iw*0.62,34,0,'#8A7A6A');const TR=['#7ED957','#FF5A5F','#3CC8F5','#FFC928','#9A6440','#B78CFF'];for(let k=0;k<26;k++)ell(ix+8+(k*37)%(iw*0.6),iy+ih-26+((k*13)%22),7,5,TR[k%6],k);
  const fx0=ix+iw*0.68;rr(fx0,iy+ih-40,iw*0.32,40,0,'#3A2A2A');for(let k=0;k<6;k++){const fl=Math.sin(T*14+k)*5,hh=(18+(k%3)*8)*(hot?1.6:1);
    poly(['#FF5A2A','#FF9A2A','#FFE14D'][k%3],fx0+6+k*13,iy+ih,fx0+12+k*13+fl,iy+ih-hh,fx0+18+k*13,iy+ih);}LIGHTS.push(fx0+40,iy+ih-20,hot?140:80,'#FF7A2A');
  const cy0=iy+8,ph=(T*(hot?0.5:0.2))%1,cxp=ix+iw*(ph<0.5?0.15+ph*1.2:0.75-(ph-0.5)*1.2),drop=Math.abs(Math.sin(ph*TAU))*24;
  rr(ix,cy0-4,iw,6,1,'#5A6074');rr(cxp-10,cy0,20,8,2,'#FFC928');ln('#3A3F52',1.4,cxp,cy0+8,cxp,cy0+20+drop);
  const open=ph<0.5?(ph>0.4?1:0):(ph>0.9?1:0);poly('#7E889C',cxp-12,cy0+20+drop,cxp-2,cy0+18+drop,cxp-2,cy0+32+drop+open*4,cxp-14+open*-6,cy0+30+drop);poly('#7E889C',cxp+12,cy0+20+drop,cxp+2,cy0+18+drop,cxp+2,cy0+32+drop+open*4,cxp+14+open*6,cy0+30+drop);
  if(ph<0.5){ell(cxp,cy0+28+drop,7,5,'#7ED957');}
  g.restore();rr(x+20,base-28,60,28,[3,3,0,0],'#3A4A40');
  hit('incinerator',x-4,y-h-10,cx+16,base);hit('trash',ix,iy+ih-40,ix+iw*0.62,iy+ih,{small:1});});
/* container crane over a stack of boxes */
S(740,[4760,470,5360,744],()=>{const T=TT(),t=fx('portcrane'),x0=4800,x1=5320;
  for(let r=0;r<3;r++)for(let c=0;c<6;c++){if((r+c)%5===4)continue;const cx=x0+40+c*72,cy=700-r*24;rr(cx,cy-22,66,22,2,PCOL[(r+c*2)%5]);g.fillStyle='rgba(0,0,0,.15)';for(let k=1;k<6;k++)g.fillRect(cx+k*11,cy-22,1.5,22);}
  const ph=(T*(t<5?0.3:0.1))%1,u=ph<0.5?ph*2:2-ph*2,tx=x0+60+u*360,lift=Math.abs(Math.sin(ph*TAU*2))*40;
  [[x0],[x1-20]].forEach(([lx])=>{rr(lx,520,14,224,2,'#FFC928');ln('#E0A21A',2,lx,560,lx+14,600);ln('#E0A21A',2,lx+14,560,lx,600);});
  rr(x0,510,x1-x0,16,2,'#FFC928');rr(tx-14,504,28,24,2,'#E0A21A');ln('#3A3F52',1.4,tx-6,528,tx-6,580+lift*0);ln('#3A3F52',1.4,tx+6,528,tx+6,580);
  rr(tx-34,580-lift,68,22,2,PCOL[Math.floor(T*0.1)%5]);rr(tx-34,576-lift,68,5,1,'#5A6074');
  hit('portcrane',x0,500,x1,744);});
/* recycling containers */
const BINS=[['glass','#3E9A45','🍾',['GLAS','GLASS','VIDRIO']],['paper','#3B7DE2','📦',['PAPIER','PAPER','PAPEL']],['plastic','#FFC928','🥤',['PLASTIK','PLASTIC','PLÁSTICO']],
  ['metal','#9AA4B8','🥫',['METALL','METAL','METAL']],['biowaste','#8A5A3B','🍌',['BIO','FOOD','ORGÁNICO']]];
BINS.forEach(([id,c,ic,lab],k)=>{const x=4110+k*104,y=700;S(y,[x-6,y-110,x+96,y+4],()=>{const T=TT(),t=fx(id),lid=t<1.5?Math.sin(t/1.5*Math.PI)*0.9:0;
  rr(x+4,y-4,92,8,4,'rgba(0,0,0,.15)');rr(x,y-70,90,70,[4,4,6,6],c);rr(x,y-70,90,6,2,shade(c,-0.2));
  g.save();g.translate(x,y-70);g.rotate(-lid);rr(-2,-8,94,10,4,shade(c,-0.25));g.restore();
  circ(x+45,y-40,17,'#FFFFFF');g.font='22px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(ic,x+45,y-39);
  sign(x+45,y-12,74,13,L3(lab),'#FFFFFF','#2B2233');
  if(t<1.5&&Math.random()<0.3)PARTS.push({x:x+45,y:y-90,vx:rnd(-10,10),vy:rnd(20,40),life:0,max:0.8,k:'emoji',t:ic,r:14,gr:120});
  hit(id,x,y-80,x+90,y);});});
S(704,[4108,470,4640,706],()=>{sign(4370,500,220,22,L3(['WERTSTOFFHOF','RECYCLING CENTRE','PUNTO LIMPIO']),'#3E9A45','#FFFFFF');rr(4366,510,6,24,1,'#5A6074');hit('recycling',4100,480,4640,540);});
/* a rat by the bins */
S(720,[4620,690,4660,722],()=>{const T=TT(),t=fx('rat'),out=t<4||(T%7)<1.5,x=4640;
  if(out){const dx=t<4?Math.sin(t*3)*14:0;g.save();g.translate(x+dx,716);ell(0,-4,8,5,'#8E8A9E');circ(7,-7,4,'#8E8A9E');circ(6,-11,2.2,'#C9A6B6');circ(9,-8,0.9,'#222');circ(11,-6,0.8,'#E89AA8');
    g.strokeStyle='#C9A6B6';g.lineWidth=1.2;g.beginPath();g.moveTo(-8,-3);g.quadraticCurveTo(-16,-10,-20,-2);g.stroke();g.restore();}
  hit('rat',x-24,700,x+24,722,{small:1});});
/* garbage truck going back and forth on the works road */
const GT={x:4200,d:1};
K.UPDATE.push(dt=>{const v=fx('garbagetruck')<4?120:45;GT.x+=GT.d*v*dt;if(GT.x>5280){GT.x=5280;GT.d=-1;}if(GT.x<4120){GT.x=4120;GT.d=1;}});
K.DYN.push(L=>{const x=GT.x,y=446;if(!inV(x-60,y-60,x+60,y+10))return;L.push({y,f:()=>{const T=TT(),t=fx('garbagetruck'),tip=t<3?Math.sin(t/3*Math.PI)*0.5:0;
  flip(x,y,GT.d,()=>{ell(0,1,34,4,'rgba(0,0,0,.2)');g.save();g.translate(-30,-10);g.rotate(-tip);rr(0,-28,46,28,4,'#E0661A');for(let k=0;k<3;k++)rr(4+k*14,-24,10,20,2,'#F2862A');g.restore();
    rr(16,-30,20,26,[3,8,3,3],'#E0661A');rr(22,-26,10,10,2,'#BFE6FA');rr(-30,-8,66,5,1,'#3A3F52');
    wheel(-20,-4,6,x/6);wheel(26,-4,6,x/6);circ(0,-34,3,Math.sin(T*8)>0?'#FFC928':'#B89A3A');rr(-32,-12,6,10,1,'#FFFFFF');kid(-34,-2,'#FF8A3D',SKIN[2],HAIR[1],0.9);});
  if(tip>0.2&&Math.random()<0.3)PARTS.push({x:x-GT.d*36,y:y-20,vx:-GT.d*rnd(10,40),vy:rnd(-30,0),life:0,max:0.8,k:'drop',r:5,c:PCOL[Math.random()*5|0],gr:200});
  hit('garbagetruck',x-36,y-42,x+38,y+2,{moving:1,small:1});}});});
S(780,[4060,760,5370,790],()=>{rr(4060,770,1310,6,2,'#9AA4B8');for(let x=4060;x<5370;x+=40)rr(x,756,3,22,1,'#9AA4B8');hit('industry',4060,-280,5370,770);});

/* =============================================================
   JAIL
============================================================= */
const JX0=4140,JX1=5300,JY0=890,JY1=1660;
function barbed(x0,y0,x1){g.strokeStyle='#7E889C';g.lineWidth=1;for(let x=x0;x<x1;x+=9){g.beginPath();g.arc(x,y0,4.5,0,TAU);g.stroke();}}
S(JY0,[JX0-20,JY0-60,JX1+20,JY0+4],()=>{rr(JX0,JY0-34,560,34,0,'#B9B4AA');rr(4800,JY0-34,JX1-4800,34,0,'#B9B4AA');rr(JX0,JY0-38,JX1-JX0,5,2,'#9A958C');barbed(JX0,JY0-42,4710);barbed(4790,JY0-42,JX1);
  const t=fx('policevan'),open=t<8?Math.min(1,t*2)*(t>7?(8-t):1):0;rr(4710+open*70,JY0-30,80,28,2,'#7E889C');g.strokeStyle='#5A6074';g.lineWidth=2;g.beginPath();for(let k=0;k<8;k++){g.moveTo(4714+open*70+k*10,JY0-30);g.lineTo(4714+open*70+k*10,JY0-2);}g.stroke();
  rr(4800,JY0-64,40,30,3,'#E9ECF2');rr(4806,JY0-58,28,12,2,'#8ED2F4');circ(4820,JY0-52,4,SKIN[1]);rr(4800,JY0-68,40,6,2,'#2F5FD0');
  sign(4640,JY0-58,130,18,L3(['GEFÄNGNIS','JAIL','CÁRCEL']),'#2F5FD0','#FFFFFF');rr(4636,JY0-48,6,16,1,'#5A6074');
  hit('jail',JX0,JY0-70,JX1,JY0);});
S(JY1,[JX0-20,JY1-60,JX1+20,JY1+6],()=>{rr(JX0,JY1-34,JX1-JX0,34,[0,0,3,3],'#C9C4BA');rr(JX0,JY1-38,JX1-JX0,5,2,'#9A958C');barbed(JX0,JY1-42,JX1);
  g.fillStyle='rgba(0,0,0,.06)';for(let x=JX0+60;x<JX1;x+=60)g.fillRect(x,JY1-34,2,34);});
[[JX0,JY0],[JX1,JY0],[JX0,JY1],[JX1,JY1]].forEach(([wx,wy],i)=>S(wy+2,[wx-30,wy-150,wx+30,wy+4],()=>{const T=TT(),t=fx('watchtower');
  ln('#7E889C',4,wx-14,wy,wx-10,wy-90);ln('#7E889C',4,wx+14,wy,wx+10,wy-90);ln('#7E889C',2,wx-12,wy-30,wx+12,wy-60);ln('#7E889C',2,wx+12,wy-30,wx-12,wy-60);
  rr(wx-20,wy-118,40,28,3,'#E9ECF2');rr(wx-16,wy-112,32,12,2,'#8ED2F4');poly('#5A6074',wx-24,wy-118,wx,wy-136,wx+24,wy-118);
  const a=T*(t<4?2:0.6)+i*1.6,lx=wx+Math.cos(a)*14,ly=wy-106;circ(lx,ly,4,'#FFF6C8');
  g.save();g.globalAlpha=0.06+0.4*ST.NIGHT+(t<4?0.15:0);g.fillStyle='#FFF6C8';g.beginPath();g.moveTo(lx,ly);
  const tx=(JX0+JX1)/2+Math.cos(a)*300,ty=1300+Math.sin(a*0.8)*160;g.lineTo(tx-40,ty);g.lineTo(tx+40,ty+20);g.closePath();g.fill();g.restore();
  LIGHTS.push(lx,ly,40,'#FFF6C8');hit('watchtower',wx-24,wy-140,wx+24,wy);}));
/* cell block, open front: two floors of cells */
function robber(x,y,pose,s,T,i){s=s||1;const by=pose==='sleep'?0:0;
  if(pose==='sleep'){g.save();g.translate(x,y);rr(-14*s,-6*s,28*s,6*s,2,'#F2EDE4');for(let k=0;k<4;k++)rr(-12*s+k*7*s,-6*s,3.5*s,6*s,0,'#2B2233');circ(16*s,-5*s,5*s,SKIN[(i+1)%4]);
    rr(12*s,-7*s,9*s,3*s,1,'#2B2233');g.restore();if(Math.random()<0.01)textP(x+20,y-14,'z','#FFFFFF',10);return;}
  const push=pose==='push'?Math.abs(Math.sin(T*4))*5:0,wave=pose==='wave';
  g.save();g.translate(x,y+push);rr(-6*s,-16*s,12*s,15*s,3*s,'#F2EDE4');for(let k=0;k<4;k++)rr(-6*s,-15*s+k*4*s,12*s,2*s,0,'#2B2233');
  rr(-5*s,-2*s,4*s,4*s,1,'#2B2233');rr(1*s,-2*s,4*s,4*s,1,'#2B2233');circ(0,-22*s,6*s,SKIN[(i+1)%4]);
  rr(-6.4*s,-25*s,12.8*s,4*s,2*s,'#2B2233');circ(-2.4*s,-23*s,1.1*s,'#FFFFFF');circ(2.4*s,-23*s,1.1*s,'#FFFFFF');circ(-2.4*s,-23*s,0.6*s,'#222');circ(2.4*s,-23*s,0.6*s,'#222');
  g.fillStyle=HAIR[i%4];g.beginPath();g.arc(0,-24*s,6*s,Math.PI,TAU);g.fill();
  if(pose==='harmonica'){rr(-4*s,-19*s,8*s,3*s,1,'#9AA4B8');if(Math.random()<0.03)textP(x+10,y-30,'♪','#FFFFFF',12);}
  if(wave){g.save();g.translate(5*s,-14*s);g.rotate(-2.2+Math.sin(T*10)*0.4);rr(-1.5*s,0,3*s,10*s,1.5*s,SKIN[(i+1)%4]);g.restore();}
  if(pose==='read'){rr(-7*s,-14*s,14*s,9*s,1,'#FF8A3D');ln('#FFFFFF',1,0,-14*s,0,-5*s);}
  g.restore();}
const POSES=['sleep','read','harmonica','push','wave','read','sleep','wave'];
const CELL={open:-1};
S(1132,[4320,890,4900,1134],()=>{const T=TT(),x=4320,y=1040,w=580,d=92,h=176,Ye=y+d-h,base=y+d,ct=fx('cell');
  rr(x+6,base-5,w+8,10,5,'rgba(0,0,0,.15)');rr(x,y-h,w,d,4,'#B9B4AA');rr(x,Ye,w,h,[0,0,3,3],'#D3CDC2');rr(x,Ye,w,8,0,'#2F5FD0');
  sign(x+w/2,Ye+20,150,18,L3(['GEFÄNGNIS','JAIL','CÁRCEL']),'#2F5FD0','#FFFFFF');
  const ix=x+14,iy=Ye+36,iw=w-28,ih=h-44,cw=iw/4,fh=ih/2;rr(ix-4,iy-4,iw+8,ih+8,6,'#8E8A80');rr(ix,iy,iw,ih,4,'#EDE7DA');
  g.save();g.beginPath();g.rect(ix,iy,iw,ih);g.clip();
  for(let f=0;f<2;f++)for(let c=0;c<4;c++){const cx=ix+c*cw,cy=iy+f*fh,i=f*4+c;rr(cx+2,cy+2,cw-4,fh-4,2,i%2?'#E3DACB':'#DCD2C2');
    rr(cx+cw/2-8,cy+8,16,12,2,'#8ED2F4');for(let k=0;k<3;k++)ln('#5A6074',1.4,cx+cw/2-5+k*5,cy+8,cx+cw/2-5+k*5,cy+20);
    rr(cx+6,cy+fh-22,cw*0.45,6,2,'#9A6440');rr(cx+6,cy+fh-28,cw*0.45,6,2,'#3CC8F5');rr(cx+6,cy+fh-16,3,14,1,'#7A4E33');
    ell(cx+cw-16,cy+fh-10,7,4,'#FFFFFF');rr(cx+cw-20,cy+fh-12,8,10,2,'#FFFFFF');
    const pose=POSES[i];if(pose==='sleep')robber(cx+6+cw*0.22,cy+fh-28,'sleep',1.2,T,i);else robber(cx+cw*0.5,cy+fh-4,CELL.open===i&&ct<3?'wave':pose,1.2,T,i);
    const open=CELL.open===i&&ct<3?Math.sin(Math.min(1,ct)*Math.PI/2)*(ct>2.5?(3-ct)*2:1):0;
    g.strokeStyle='#4F5568';g.lineWidth=2.6;g.beginPath();for(let k=0;k<=12;k++){const bx=cx+3+k*(cw-6)/12;const slide=k>=7&&k<=11?open*(cw*0.35):0;g.moveTo(bx-slide,cy+2);g.lineTo(bx-slide,cy+fh-2);}g.stroke();
    rr(cx+2,cy+2,cw-4,4,1,'#4F5568');rr(cx+2,cy+fh/2,cw-4,3,1,'#4F5568');
    hit('robber',cx+cw*0.2,cy+10,cx+cw*0.8,cy+fh,{small:1,ref:i});}
  rr(ix,iy+fh-2,iw,5,1,'#8E8A80');
  const gx=ix+40+((T*24)%(iw-80)),gd=Math.floor(T*24/(iw-80))%2;const gxx=gd?ix+iw-40-((T*24)%(iw-80)):gx;
  g.restore();
  g.save();g.translate(gxx,iy+ih+2);kid(0,0,'#2F5FD0',SKIN[2],'#2B2233',1.5);rr(-7,-26,14,4,2,'#1E3F8A');rr(-5,-30,10,5,2,'#1E3F8A');circ(6,-8,2.4,'#FFC928');
  if(fx('guard')<2)for(let k=0;k<3;k++)ln('#FFC928',1,6,-8,9+k,-3);g.restore();
  hit('guard',gxx-12,iy+ih-34,gxx+12,iy+ih+4,{moving:1,small:1});
  hit('jail',x-4,y-h,x+w+4,base);});
/* exercise yard: basketball, laundry line, vegetable patch */
S(1390,[4400,1270,4790,1394],()=>{const T=TT(),t=fx('jailyard'),hx=4800,hy=1330;
  rr(hx,hy-90,6,90,1,'#7E889C');rr(hx-30,hy-110,40,26,2,'#FFFFFF');rr(hx-30,hy-110,40,26,2,'rgba(0,0,0,0)');ln('#E8443A',2,hx-20,hy-96,hx-2,hy-96);ell(hx-11,hy-84,10,3,'rgba(0,0,0,0)');
  g.strokeStyle='#E8443A';g.lineWidth=2;g.beginPath();g.ellipse(hx-11,hy-84,10,3,0,0,TAU);g.stroke();for(let k=0;k<4;k++)ln('rgba(255,255,255,.8)',1,hx-19+k*5,hy-84,hx-17+k*4,hy-72);
  const ph=t<2?t/2:((T*0.5)%1),shot=t<2;
  const P=[[4620,1380,0],[4700,1360,1],[4540,1370,2]];P.forEach(([px,py,i])=>{const j=Math.abs(Math.sin(T*3+i))*(shot?8:3);robber(px,py-j,i===0&&shot?'wave':'stand',1.4,T,i+3);});
  let bx,by;if(shot){bx=4620+(hx-11-4620)*ph;by=1350-Math.sin(ph*Math.PI)*110+(hy-84-1350)*ph;}else{bx=4620+Math.sin(T*2)*60;by=1380-Math.abs(Math.sin(T*6))*30;}
  circ(bx,by-10,6,'#F2862A');ln('#2B2233',0.8,bx-6,by-10,bx+6,by-10);
  hit('jailyard',4330,1250,4850,1520);});
S(1600,[4300,1540,4560,1604],()=>{const T=TT();ln('#7E889C',2,4310,1600,4310,1560);ln('#7E889C',2,4550,1600,4550,1560);
  g.strokeStyle='#5A6074';g.lineWidth=1;g.beginPath();g.moveTo(4310,1562);g.quadraticCurveTo(4430,1574,4550,1562);g.stroke();
  for(let k=0;k<6;k++){const x=4330+k*36,sw=Math.sin(T*2+k)*2;rr(x+sw,1566,24,22,2,'#F2EDE4');for(let j=0;j<4;j++)rr(x+sw,1568+j*5,24,2.4,0,'#2B2233');}});
/* police van brings in a new robber now and then; the police dog waits by the gate */
const VAN={t:-1};
K.UPDATE.push(dt=>{if(VAN.t>=0){VAN.t+=dt;if(VAN.t>14)VAN.t=-1;}else if(Math.random()<dt/40){VAN.t=0;act('policevan');}});
K.DYN.push(L=>{if(VAN.t<0||!inV(4600,760,4900,1100))return;const t=VAN.t;let x=4742,y;
  if(t<3)y=760+sm(t/3)*260;else if(t<9)y=1020;else y=1020-sm((t-9)/3)*260;const dir=t<6?'S':'N';
  L.push({y,f:()=>{const T=TT();g.save();g.translate(x,y);ell(0,1,18,4,'rgba(0,0,0,.2)');rr(-13,-26,26,24,5,'#FFFFFF');rr(-13,-14,26,4,0,'#2F5FD0');
    rr(-10,dir==='S'?-23:-22,20,8,2,dir==='S'?'#BFE6FA':'#A9D8F2');const on=Math.sin(T*16)>0;rr(-7,-30,7,4,1,on?'#3B7BFF':'#1E3F8A');rr(0,-30,7,4,1,on?'#1E3F8A':'#3B7BFF');
    rr(-14,-4,4,6,1,'#2B2D3A');rr(10,-4,4,6,1,'#2B2D3A');g.restore();if(on)LIGHTS.push(x,y-28,30,'#3B7BFF');
    if(t>3.5&&t<6){const u=(t-3.5)/2.5;robber(x+20,y-u*40,'stand',1.3,T,5);}
    hit('policevan',x-16,y-34,x+16,y+2,{moving:1,small:1});}});});
S(880,[4860,840,4920,882],()=>{const T=TT(),t=fx('policedog'),x=4890,y=878,bark=t<2&&Math.sin(t*12)>0;
  g.save();g.translate(x,y);ell(0,1,14,3,'rgba(0,0,0,.15)');[-8,-4,5,9].forEach(lx=>rr(lx-1.4,-10,2.8,10,1,'#5A3A2A'));ell(0,-13,12,6,'#8A5A3B');ell(-4,-15,6,4,'#3A2A20');
  ln('#8A5A3B',2.4,-11,-14,-16,-20+Math.sin(T*8)*3);g.save();g.translate(11,-19);circ(0,0,6,'#8A5A3B');ell(6,2,5,3.4,'#8A5A3B');circ(10,1,1.4,'#222');circ(1,-1.6,1,'#222');
  poly('#3A2A20',-4,-3,-2,-11,2,-4);if(bark)ell(8,5,3,2,'#5A2A2A');g.restore();rr(-2,-18,10,3,1,'#2F5FD0');g.restore();
  if(bark&&Math.random()<0.2)textP(x+24,y-30,'Wuff!','#FFFFFF',12);hit('policedog',x-16,y-30,x+22,y+2,{small:1});});

/* =============================================================
   TAPS, ZONES
============================================================= */
Object.assign(TAP,{
  industry:()=>S5.horn(),works:()=>{act('works');S5.horn();},carfactory:()=>{act('carfactory');S5.weld();if(lotN<LOT.length)later(1.5,()=>{lotN++;SND.horn();});else lotN=3;},
  robot:()=>{act('carfactory');S5.weld();},incinerator:()=>{act('incinerator');S5.fire();},trash:()=>{act('incinerator');S5.crunch();},
  garbagetruck:()=>{act('garbagetruck');S5.crunch();},recycling:()=>S5.clink(),glass:()=>{act('glass');S5.clink();},paper:()=>{act('paper');S5.rustle();},
  plastic:()=>{act('plastic');S5.rustle();},metal:()=>{act('metal');S5.clang();},biowaste:()=>{act('biowaste');S5.splat();},
  warehouse:()=>S5.beep(),forklift:()=>{act('forklift');S5.beep();},portcrane:()=>{act('portcrane');S5.beep();},
  jail:()=>{act('guard');S5.keys();},guard:()=>{act('guard');S5.keys();},watchtower:()=>{act('watchtower');S5.alarm();},
  robber:(i)=>{CELL.open=typeof i==='number'?i:-1;act('cell');POSES[i]==='harmonica'?S5.harmonica():S5.keys();},
  cell:()=>S5.keys(),jailyard:()=>{act('jailyard');S5.bounce();},policevan:()=>{if(VAN.t<0){VAN.t=0;act('policevan');}SND.wail();},
  rat:()=>{act('rat');S5.squeak();},policedog:()=>{act('policedog');S5.woof();}});
K.ZONES.unshift((x,y)=>{if(x<IX0||y>1715)return null;if(y>-300&&y<790)return 'industry';if(y>=830)return x>JX0&&x<JX1&&y>JY0-40&&y<JY1?'jail':'meadow';return null;});
at('industry',[4100,-250,5300,760]);at('jail',[4300,900,4900,1140]);
}
