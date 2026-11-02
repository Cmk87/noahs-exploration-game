/* =============================================================
   JOBS — who does what, and who helps whom. Ten jobs, each as a woman
   and as a man (die Ärztin / der Arzt, la bombera / el bombero), drawn
   in code. Three games:
   🆘 "Wer hilft?"  a little problem (the house is on fire) — pick who helps;
   🔧 "Wem gehört das?"  a thing (the stethoscope) — pick whose it is;
   🎮 "Ein Tag als …"  pick a job and do its work: put out fires, bake
      and count pretzels, deliver letters to the right house number …
   A right answer in the first two also opens that job's little game.
============================================================= */
const JOBS=[
 {k:'fire',c:'#3A3F52',n:{de:['der Feuerwehrmann','die Feuerwehrfrau'],en:['the firefighter','the firefighter'],es:['el bombero','la bombera']},
  scene:'🏠🔥',fixed:'🏠💧',thing:'🧯',
  need:{de:'Oh nein, das Haus brennt! Wer hilft?',en:'Oh no, the house is on fire! Who can help?',es:'¡Oh no, la casa se quema! ¿Quién ayuda?'},
  help:{de:'{P} löscht das Feuer!',en:'{P} puts out the fire!',es:'¡{P} apaga el fuego!'},
  use:{de:'{P} löscht mit dem Feuerlöscher das Feuer.',en:'{P} puts out fires with the fire extinguisher.',es:'{P} apaga el fuego con el extintor.'}},
 {k:'police',c:'#2F4F9A',n:{de:['der Polizist','die Polizistin'],en:['the police officer','the police officer'],es:['el policía','la policía']},
  scene:'🚗🚦🚙',fixed:'🚦👍',thing:'🚨',
  need:{de:'Auf der Kreuzung gibt es ein Durcheinander! Wer hilft?',en:'There is a muddle at the crossroads! Who can help?',es:'¡Hay un lío en el cruce! ¿Quién ayuda?'},
  help:{de:'{P} regelt den Verkehr!',en:'{P} directs the traffic!',es:'¡{P} dirige el tráfico!'},
  use:{de:'{P} fährt mit Blaulicht zum Einsatz.',en:'{P} drives to help with flashing lights.',es:'{P} va a ayudar con la sirena puesta.'}},
 {k:'doctor',c:'#FFFFFF',n:{de:['der Arzt','die Ärztin'],en:['the doctor','the doctor'],es:['el médico','la médica']},
  scene:'🤒',fixed:'😊',thing:'🩺',
  need:{de:'Das Kind ist krank. Wer hilft?',en:'The child is ill. Who can help?',es:'El niño está enfermo. ¿Quién ayuda?'},
  help:{de:'{P} macht das Kind wieder gesund!',en:'{P} makes the child well again!',es:'¡{P} cura al niño!'},
  use:{de:'{P} hört mit dem Stethoskop das Herz ab.',en:'{P} listens to your heart with the stethoscope.',es:'{P} escucha el corazón con el estetoscopio.'}},
 {k:'vet',c:'#3E9A6A',n:{de:['der Tierarzt','die Tierärztin'],en:['the vet','the vet'],es:['el veterinario','la veterinaria']},
  scene:'🐶🤕',fixed:'🐶💖',thing:'🐾',
  need:{de:'Der Hund hat sich die Pfote verletzt. Wer hilft?',en:'The dog has hurt its paw. Who can help?',es:'El perro se ha hecho daño en la pata. ¿Quién ayuda?'},
  help:{de:'{P} verbindet die Pfote!',en:'{P} bandages the paw!',es:'¡{P} le venda la pata!'},
  use:{de:'{P} hilft kranken Tieren.',en:'{P} helps sick animals.',es:'{P} ayuda a los animales enfermos.'}},
 {k:'baker',c:'#F2EDE4',n:{de:['der Bäcker','die Bäckerin'],en:['the baker','the baker'],es:['el panadero','la panadera']},
  scene:'😋🍽️',fixed:'😋🥖',thing:'🥨',
  need:{de:'Die Familie hat Hunger auf frisches Brot. Wer hilft?',en:'The family is hungry for fresh bread. Who can help?',es:'La familia tiene hambre de pan recién hecho. ¿Quién ayuda?'},
  help:{de:'{P} backt frisches Brot!',en:'{P} bakes fresh bread!',es:'¡{P} hornea pan fresco!'},
  use:{de:'{P} backt Brezeln.',en:'{P} bakes pretzels.',es:'{P} hornea pretzels.'}},
 {k:'builder',c:'#FF8A3D',n:{de:['der Bauarbeiter','die Bauarbeiterin'],en:['the builder','the builder'],es:['el albañil','la albañil']},
  scene:'🏚️',fixed:'🏠✨',thing:'🧱',
  need:{de:'Das Haus ist kaputt. Wer hilft?',en:'The house is broken. Who can help?',es:'La casa está rota. ¿Quién ayuda?'},
  help:{de:'{P} baut das Haus wieder auf!',en:'{P} builds the house up again!',es:'¡{P} vuelve a construir la casa!'},
  use:{de:'{P} baut mit Ziegelsteinen eine Mauer.',en:'{P} builds a wall with bricks.',es:'{P} construye un muro con ladrillos.'}},
 {k:'teacher',c:'#9A6ACF',n:{de:['der Lehrer','die Lehrerin'],en:['the teacher','the teacher'],es:['el maestro','la maestra']},
  scene:'🧒❓',fixed:'🧒💡',thing:'📖',
  need:{de:'Die Kinder wollen lesen lernen. Wer hilft?',en:'The children want to learn to read. Who can help?',es:'Los niños quieren aprender a leer. ¿Quién ayuda?'},
  help:{de:'{P} bringt den Kindern das Lesen bei!',en:'{P} teaches the children to read!',es:'¡{P} enseña a leer a los niños!'},
  use:{de:'{P} liest mit den Kindern ein Buch.',en:'{P} reads a book with the children.',es:'{P} lee un libro con los niños.'}},
 {k:'mail',c:'#FFC928',n:{de:['der Briefträger','die Briefträgerin'],en:['the postman','the postwoman'],es:['el cartero','la cartera']},
  scene:'✉️👵',fixed:'👵💌',thing:'✉️',
  need:{de:'Der Brief soll zur Oma. Wer hilft?',en:'The letter has to get to Grandma. Who can help?',es:'La carta tiene que llegar a la abuela. ¿Quién ayuda?'},
  help:{de:'{P} bringt den Brief zur Oma!',en:'{P} takes the letter to Grandma!',es:'¡{P} lleva la carta a la abuela!'},
  use:{de:'{P} bringt Briefe und Pakete.',en:'{P} brings letters and parcels.',es:'{P} trae cartas y paquetes.'}},
 {k:'farmer',c:'#3B6FB6',n:{de:['der Bauer','die Bäuerin'],en:['the farmer','the farmer'],es:['el granjero','la granjera']},
  scene:'🐄😢',fixed:'🐄🌾',thing:'🚜',
  need:{de:'Die Kühe haben Hunger. Wer hilft?',en:'The cows are hungry. Who can help?',es:'Las vacas tienen hambre. ¿Quién ayuda?'},
  help:{de:'{P} füttert die Kühe!',en:'{P} feeds the cows!',es:'¡{P} da de comer a las vacas!'},
  use:{de:'{P} fährt mit dem Traktor aufs Feld.',en:'{P} drives the tractor to the field.',es:'{P} va al campo en tractor.'}},
 {k:'pilot',c:'#22305A',n:{de:['der Pilot','die Pilotin'],en:['the pilot','the pilot'],es:['el piloto','la piloto']},
  scene:'🧳🌍',fixed:'✈️🌍',thing:'✈️',
  need:{de:'Die Familie will in den Urlaub fliegen. Wer hilft?',en:'The family wants to fly on holiday. Who can help?',es:'La familia quiere volar de vacaciones. ¿Quién ayuda?'},
  help:{de:'{P} fliegt das Flugzeug!',en:'{P} flies the plane!',es:'¡{P} pilota el avión!'},
  use:{de:'{P} fliegt das Flugzeug.',en:'{P} flies the plane.',es:'{P} pilota el avión.'}}];
const JT={
  modes:{need:{de:'Wer hilft?',en:'Who helps?',es:'¿Quién ayuda?'},thing:{de:'Wem gehört das?',en:'Whose is it?',es:'¿De quién es?'},play:{de:'Ein Tag als …',en:'A day as …',es:'Un día de …'}},
  thingQ:{de:'Wem gehört das?',en:'Who does this belong to?',es:'¿De quién es esto?'},
  pick:{de:'Was möchtest du heute sein?',en:'What do you want to be today?',es:'¿Qué quieres ser hoy?'},
  isA:{de:'Das ist {P}.',en:'That is {P}.',es:'Ese es {P}.'},isAf:{de:'Das ist {P}.',en:'That is {P}.',es:'Esa es {P}.'},
  play:{de:'Mitspielen!',en:'Play!',es:'¡Jugar!'},again:{de:'Nochmal',en:'Again',es:'Otra vez'},other:{de:'Andere Arbeit',en:'Another job',es:'Otro trabajo'}};
SKILL_START.jobs={de:1,en:1,es:1};SKILL_MAX.jobs=3;
const jcap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const jName=(j,fem,L)=>j.n[L||lang][fem?1:0];
const jSay=(t,j,fem)=>t[lang].replace('{P}',jcap(jName(j,fem)));
const JTHING_OK={};const jThing=j=>{if(JTHING_OK[j.k]===undefined)JTHING_OK[j.k]=emojiOK(j.thing);return JTHING_OK[j.k]?j.thing:{doctor:'💊',fire:'🚒',builder:'🔨'}[j.k]||j.thing;};

/* ---------- drawing a worker (100×120 units) ---------- */
function drawWorker(cv,j,fem,skin){
  const r=cv.getBoundingClientRect(),W=r.width||120,H=r.height||144,dpr=DPRX(3);cv.width=W*dpr;cv.height=H*dpr;
  const g=cv.getContext('2d');g.setTransform(dpr*W/100,0,0,dpr*H/120,0,0);g.lineJoin='round';g.lineCap='round';
  const S=['#F6D2B4','#D9A27E','#9C6B4E','#F1C7A0'][skin%4],HC=['#5A3A22','#2B2233','#E0B04A','#A0502C'][(skin+1)%4],k=j.k,ink='#1D2350';
  const R=(x,y,w,h,rad,c)=>{g.fillStyle=c;g.beginPath();g.roundRect(x,y,w,h,rad);g.fill();};
  const C=(x,y,rad,c)=>{g.fillStyle=c;g.beginPath();g.arc(x,y,rad,0,7);g.fill();};
  const E=t=>{g.font='16px serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t[0],t[1],t[2]);};
  g.fillStyle='rgba(0,0,0,.12)';g.beginPath();g.ellipse(50,114,24,4,0,0,7);g.fill();
  // legs and shoes
  const pants={fire:'#3A3F52',police:'#22305A',doctor:'#5A7AB0',vet:'#3E9A6A',baker:'#E9E2D4',builder:'#3B5A8A',teacher:'#5A4A6A',mail:'#22305A',farmer:'#3B6FB6',pilot:'#22305A'}[k];
  if(fem&&(k==='teacher'||k==='pilot'))g.fillStyle=pants,g.beginPath(),g.moveTo(38,76),g.lineTo(62,76),g.lineTo(66,98),g.lineTo(34,98),g.closePath(),g.fill();
  R(39,76,9,34,4,pants);R(52,76,9,34,4,pants);R(36,106,13,6,3,'#2B2233');R(51,106,13,6,3,'#2B2233');
  // body
  const body={fire:'#C9A76A',police:'#2F4F9A',doctor:'#FFFFFF',vet:'#3E9A6A',baker:'#FFFFFF',builder:'#4A6A9A',teacher:'#9A6ACF',mail:'#FFC928',farmer:'#C0473A',pilot:'#22305A'}[k];
  R(33,46,34,36,10,body);if(k==='doctor'||k==='baker'){g.strokeStyle='#D9DEE8';g.lineWidth=1.2;g.beginPath();g.moveTo(50,48);g.lineTo(50,80);g.stroke();}
  if(k==='fire'){R(33,62,34,4,0,'#FFE14D');R(33,72,34,4,0,'#FFE14D');}
  if(k==='builder'){R(33,46,34,36,10,'#FF8A3D');R(33,60,34,4,0,'#E9ECF2');R(33,70,34,4,0,'#E9ECF2');}
  if(k==='farmer'){R(37,58,26,24,4,'#3B6FB6');R(40,46,5,14,2,'#3B6FB6');R(55,46,5,14,2,'#3B6FB6');g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=1;for(let i=0;i<4;i++){g.beginPath();g.moveTo(33,50+i*7);g.lineTo(37,50+i*7);g.stroke();}}
  if(k==='police'){R(46,52,8,6,2,'#FFD23F');R(33,62,34,3,0,'#FFFFFF');}
  if(k==='pilot'){R(33,76,9,3,0,'#FFD23F');R(58,76,9,3,0,'#FFD23F');C(42,54,1.6,'#FFD23F');C(42,62,1.6,'#FFD23F');}
  if(k==='mail'){g.strokeStyle='#7A4E33';g.lineWidth=3;g.beginPath();g.moveTo(36,48);g.lineTo(64,76);g.stroke();R(56,70,16,14,3,'#8A5A3B');R(58,72,12,6,1,'#FFFFFF');}
  if(k==='baker'){R(37,62,26,20,4,'#E9E2D4');}
  // arms
  const arm=body==='#FFFFFF'?'#F4F7FB':k==='builder'?'#FF8A3D':body;R(26,48,9,26,4,arm);R(65,48,9,26,4,arm);C(30,76,4.5,S);C(70,76,4.5,S);
  // neck, head, face
  R(46,40,8,8,2,S);
  if(fem){const hat=k==='fire'||k==='builder'||k==='pilot'||k==='police';g.fillStyle=HC;g.beginPath();g.ellipse(50,28,14.5,14,0,0,7);g.fill();   // hair behind the head, never below the chin
    if(hat){g.beginPath();g.ellipse(64,36,4.5,9,0.3,0,7);g.fill();}else{R(35.5,26,7,24,4,HC);R(57.5,26,7,24,4,HC);}}
  C(50,30,12,S);C(45.5,30,1.6,ink);C(54.5,30,1.6,ink);g.strokeStyle=ink;g.lineWidth=1.3;g.beginPath();g.arc(50,33,4,0.3,Math.PI-0.3);g.stroke();
  C(43,35,2.4,'rgba(255,120,120,.35)');C(57,35,2.4,'rgba(255,120,120,.35)');
  if(!fem){g.fillStyle=HC;g.beginPath();g.arc(50,26,12.4,Math.PI*1.05,Math.PI*1.95);g.fill();}
  else{g.fillStyle=HC;g.beginPath();g.arc(50,27,12.4,Math.PI*1.02,Math.PI*1.98);g.fill();}
  if(k==='teacher'){g.strokeStyle=ink;g.lineWidth=1;g.beginPath();g.arc(45.5,30,3.2,0,7);g.arc(54.5,30,3.2,0,7);g.moveTo(48.7,30);g.lineTo(51.3,30);g.stroke();}
  // hats
  if(k==='fire'){R(34,14,32,10,5,'#E8443A');R(30,22,40,4,2,'#C0392B');R(46,10,8,6,2,'#FFD23F');}
  if(k==='police'){R(37,15,26,8,3,'#22305A');R(35,21,32,3,1.5,'#111A33');C(50,18,2,'#FFD23F');}
  if(k==='doctor'){g.strokeStyle='#7E889C';g.lineWidth=1.6;g.beginPath();g.moveTo(43,46);g.quadraticCurveTo(42,60,50,62);g.quadraticCurveTo(58,60,57,46);g.stroke();C(50,63,2.6,'#9AA4B8');}
  if(k==='vet'){R(39,16,22,6,3,'#3E9A6A');}
  if(k==='baker'){g.strokeStyle='#B9C1CC';g.lineWidth=2.4;[[42,8,6],[50,4,7],[58,8,6]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,7);g.stroke();});g.strokeRect(38,6,24,14);   // the tall white chef's hat, outlined so it shows on white
    R(38,4,24,16,6,'#FFFFFF');C(42,8,6,'#FFFFFF');C(50,4,7,'#FFFFFF');C(58,8,6,'#FFFFFF');R(37,17,26,4,1,'#E9E2D4');}
  if(k==='builder'){g.fillStyle='#FFC928';g.beginPath();g.arc(50,22,13,Math.PI,0);g.fill();R(35,20,30,4,2,'#E8A317');}
  if(k==='mail'){R(38,15,24,8,3,'#22305A');R(48,20,18,3,1.5,'#22305A');}
  if(k==='farmer'){g.fillStyle='#E2C27A';g.beginPath();g.ellipse(50,21,20,4,0,0,7);g.fill();R(40,12,20,10,4,'#E2C27A');R(40,18,20,2,0,'#C0473A');}
  if(k==='pilot'){R(37,14,26,8,3,'#22305A');R(35,20,32,3,1.5,'#111A33');R(45,15,10,3,1,'#FFD23F');}
  // things in hand
  if(k==='fire'){g.strokeStyle='#C0392B';g.lineWidth=4;g.beginPath();g.moveTo(70,78);g.quadraticCurveTo(86,74,88,60);g.stroke();R(84,54,8,8,2,'#7E889C');}
  if(k==='police'){R(66,80,10,4,2,'#FFFFFF');}
  if(k==='vet'){C(76,72,8,'#C98A4E');C(71,66,3,'#8A5A3B');C(81,66,3,'#8A5A3B');C(74,72,1.2,'#222');C(78,72,1.2,'#222');C(76,75,1.4,'#3A2A20');}
  if(k==='baker')E(['🥨',76,72]);
  if(k==='builder'){g.strokeStyle='#7A4E33';g.lineWidth=3;g.beginPath();g.moveTo(70,80);g.lineTo(80,64);g.stroke();R(75,59,12,6,2,'#7E889C');}
  if(k==='teacher'){R(62,66,18,14,2,'#C0473A');R(70,66,2,14,0,'#8A2A20');}
  if(k==='farmer'){g.strokeStyle='#8A5A3B';g.lineWidth=2.4;g.beginPath();g.moveTo(74,104);g.lineTo(74,52);g.stroke();g.lineWidth=1.6;[70,74,78].forEach(x=>{g.beginPath();g.moveTo(x,52);g.lineTo(x,44);g.stroke();});g.beginPath();g.moveTo(70,52);g.lineTo(78,52);g.stroke();}
  if(k==='pilot'){R(68,70,14,10,3,'#5A3A2A');}
}
function workerCard(j,fem,skin,onTap){
  const b=document.createElement('button');b.className='jCard';const cv=document.createElement('canvas');b.appendChild(cv);
  const lab=document.createElement('span');lab.className='jLab';b.appendChild(lab);b.onclick=()=>onTap(b);
  requestAnimationFrame(()=>drawWorker(cv,j,fem,skin));return b;}

/* ---------- state ---------- */
let JM='need',JR=null,jobT=null;
const jLive=r=>JR===r&&activeTab==='jobs';
function buildJobModes(){const box=$('jobModes');box.innerHTML='';
  [['need','🆘'],['thing','🔧'],['play','🎮']].forEach(([m,ic])=>{const b=document.createElement('button');b.className='seg modeBtn'+(JM===m?' on':'');
    b.textContent=ic+' '+JT.modes[m][lang];b.onclick=()=>{ac();JM=m;jobRound();};box.appendChild(b);});}
function jobRound(){
  clearTimeout(jobT);buildJobModes();const st=$('jobStage');st.innerHTML='';st.className='';$('jobPlay').style.display='none';
  if(JM==='play'){jobPicker();return;}
  const L=level('jobs',3),n=L>=2?4:3,pool=shuffle(JOBS),cb=comeBack('jobs:'+JM,k=>JOBS.some(x=>x.k===k));   // a job he missed comes back soon
  if(cb){const i=pool.findIndex(x=>x.k===cb);pool.unshift(pool.splice(i,1)[0]);}
  const j=pool[0],opts=shuffle(pool.slice(0,n));
  JR={kind:JM,j,miss:0,done:false,fem:Math.random()<0.5,opts:opts.map(o=>({j:o,fem:o===j?null:Math.random()<0.5,skin:Math.floor(Math.random()*4)}))};
  JR.opts.forEach(o=>{if(o.fem===null)o.fem=JR.fem;});
  const top=document.createElement('div');top.className='jTop';top.textContent=JM==='need'?j.scene:jThing(j);st.appendChild(top);
  const grid=document.createElement('div');grid.className='jGrid n'+n;st.appendChild(grid);
  JR.opts.forEach(o=>grid.appendChild(workerCard(o.j,o.fem,o.skin,el=>jobPick(o,el))));
  $('jobPrompt').textContent=JM==='need'?j.need[lang]:JT.thingQ[lang];say($('jobPrompt').textContent);
}
function jobPick(o,el){
  ac();const r=JR;if(!r||r.done)return;
  if(o.j===r.j){r.done=true;el.classList.add('right');bigWin();award(r.miss);levelFx($('jobPrompt'),adapt('jobs',3,r.miss===0));
    if(r.kind==='need'||r.kind==='thing')practice('jobs:'+r.kind,r.j.k,jcap(jName(r.j,r.fem)),r.miss===0);
    el.querySelector('.jLab').textContent=jcap(jName(o.j,o.fem));
    if(r.kind==='need'){const top=$('jobStage').querySelector('.jTop');top.textContent=r.j.fixed;top.classList.add('fixed');}
    const line=jSay(r.kind==='need'?r.j.help:r.j.use,r.j,o.fem);$('jobPrompt').textContent=line;say(line);
    const pb=$('jobPlay');pb.textContent='🎮 '+JT.play[lang];pb.style.display='';pb.onclick=()=>{ac();clearTimeout(jobT);jobTask(r.j,o.fem,o.skin);};
    jobT=setTimeout(()=>{if(jLive(r))jobRound();},6500);}
  else{r.miss++;nope();el.classList.remove('wrong');void el.offsetWidth;el.classList.add('wrong');
    el.querySelector('.jLab').textContent=jcap(jName(o.j,o.fem));
    say((o.fem?JT.isAf:JT.isA)[lang].replace('{P}',jName(o.j,o.fem))+' '+(r.kind==='need'?r.j.need[lang]:JT.thingQ[lang]));
    if(r.miss>=2)[...$('jobStage').querySelectorAll('.jCard')].forEach((c,i)=>{if(r.opts[i].j===r.j)c.classList.add('hint');});}
}
$('jobHear').onclick=()=>{ac();say($('jobPrompt').textContent);};
$('jobNext').onclick=()=>{ac();jobRound();};
function showJobs(){jobRound();}
/* a mini-game still being played (the end card is not up yet) */
function jobBusy(){return !!(JR&&JR.kind==='task'&&!document.querySelector('#jobStage .jEnd'));}
const mailAsk=w=>({de:`Bring den Brief zu Haus Nummer ${jNum(w)}!`,en:`Take the letter to house number ${jNum(w)}!`,es:`¡Lleva la carta a la casa número ${jNum(w)}!`}[lang]);
/* language switch: keep the round he is in the middle of, just say it in the new language */
function jobOnLang(){
  buildJobModes();const r=JR;
  if(!r||r.kind==='pick'||(r.kind!=='task'&&r.done)){jobRound();return;}
  if(r.kind!=='task'){$('jobPrompt').textContent=r.kind==='need'?r.j.need[lang]:JT.thingQ[lang];say($('jobPrompt').textContent);return;}
  const T=TASKS[r.j.k],end=document.querySelector('#jobStage .jEnd');
  if(end){const btns=[...end.children];if(btns[0])btns[0].textContent=JT.again[lang];if(btns[1])btns[1].textContent=JT.other[lang];
    $('jobPrompt').textContent=T.done[lang];return;}
  if(T.houses)$('jobPrompt').textContent=mailAsk(r.want);
  else if(T.letters){const L=document.querySelector('.jBoard');
    if(L){const c=L.textContent.toLowerCase();L.textContent=lang==='de'?c.toUpperCase():c;}
    $('jobPrompt').textContent=T.go[lang]+(L?' '+L.textContent:'');}
  else $('jobPrompt').textContent=T.go[lang];
  say($('jobPrompt').textContent);
}

/* ---------- 🎮 a day as …: pick a job, then do its work ---------- */
function jobPicker(){
  JR={kind:'pick'};const st=$('jobStage'),grid=document.createElement('div');grid.className='jGrid pick';st.appendChild(grid);
  JOBS.forEach((j,i)=>{const fem=i%2===0,c=workerCard(j,fem,i,()=>jobTask(j,fem,i));c.querySelector('.jLab').textContent=jcap(jName(j,fem).replace(/^(der|die|the|el|la) /,''));grid.appendChild(c);});
  $('jobPrompt').textContent=JT.pick[lang];say(JT.pick[lang]);
}
const jNum=n=>NUMWORD[lang][n]||String(n);
/* every task: a scene, things to tap, what they turn into, and the words */
const TASKS={
  fire:{bg:'#BFE6FA',deco:[['🏠',50,58,120]],targets:[[34,40],[60,32],[46,62],[66,58],[30,66]],from:'🔥',to:'💨',count:1,
    go:{de:'Lösch alle Feuer! Tippe auf die Flammen.',en:'Put out all the fires! Tap the flames.',es:'¡Apaga todos los fuegos! Toca las llamas.'},
    done:{de:'Alle Feuer sind gelöscht! Danke, Feuerwehr!',en:'All the fires are out! Thank you, firefighters!',es:'¡Todos los fuegos apagados! ¡Gracias, bomberos!'}},
  police:{bg:'#C9D0DB',deco:[['🚦',50,22,46]],targets:[[18,48],[18,64],[18,80]],from:['🚗','🚙','🚕'],to:'',drive:1,count:1,
    go:{de:'Winke die Autos über die Kreuzung! Tippe auf jedes Auto.',en:'Wave the cars across the crossroads! Tap each car.',es:'¡Haz pasar los coches por el cruce! Toca cada coche.'},
    done:{de:'Alle Autos sind sicher über die Kreuzung!',en:'All the cars got safely across!',es:'¡Todos los coches cruzaron sin peligro!'}},
  doctor:{bg:'#EAF6FF',deco:[['🧸',50,55,130]],targets:[[38,46],[60,62],[44,76]],from:'🔴',to:'🩹',count:1,
    go:{de:'Der Teddy hat drei Aua-Stellen. Klebe Pflaster drauf!',en:'Teddy has three sore spots. Put plasters on them!',es:'El osito tiene tres heridas. ¡Ponle tiritas!'},
    done:{de:'Der Teddy ist wieder gesund!',en:'Teddy is better again!',es:'¡El osito ya está bien!'}},
  vet:{bg:'#E6F4E6',deco:[],targets:[[25,55],[50,55],[75,55]],from:['🐶','🐱','🐰'],to:'💖',keep:1,count:1,
    go:{de:'Drei Tiere sind krank. Tippe sie an und mach sie gesund!',en:'Three animals are sick. Tap them to make them better!',es:'Tres animales están enfermos. ¡Tócalos para curarlos!'},
    done:{de:'Alle Tiere sind gesund! Wuff! Miau!',en:'All the animals are well! Woof! Miaow!',es:'¡Todos los animales están sanos! ¡Guau! ¡Miau!'}},
  baker:{bg:'#FFF0D8',deco:[['🧑‍🍳',12,20,40]],targets:[[25,45],[50,45],[75,45],[37,70],[63,70]],from:'⚪',to:'🥨',count:1,
    go:{de:'Back fünf Brezeln! Tippe auf den Teig.',en:'Bake five pretzels! Tap the dough.',es:'¡Hornea cinco pretzels! Toca la masa.'},
    done:{de:'Fünf Brezeln! Mmh, lecker!',en:'Five pretzels! Yum!',es:'¡Cinco pretzels! ¡Qué ricos!'}},
  builder:{bg:'#DCEBFA',deco:[['🏗️',86,30,60]],targets:[[30,80],[50,80],[70,80],[40,66],[60,66],[50,52]],from:'⬜',to:'🧱',count:1,
    go:{de:'Bau die Mauer! Tippe auf die leeren Stellen.',en:'Build the wall! Tap the empty spaces.',es:'¡Construye el muro! Toca los huecos.'},
    done:{de:'Die Mauer ist fertig! Toll gebaut!',en:'The wall is finished! Great building!',es:'¡El muro está terminado! ¡Muy bien construido!'}},
  teacher:{bg:'#2E5E46',letters:1,
    go:{de:'Was fängt so an?',en:'What starts like this?',es:'¿Qué empieza así?'},
    done:{de:'Super! Du kannst schon Buchstaben!',en:'Super! You know your letters!',es:'¡Genial! ¡Ya conoces las letras!'}},
  mail:{bg:'#E6F2FF',houses:5,
    done:{de:'Alle Briefe sind angekommen!',en:'All the letters have arrived!',es:'¡Todas las cartas han llegado!'}},
  farmer:{bg:'#CDEBB0',deco:[['🌾',12,22,40],['🚜',86,22,44]],targets:[[25,50],[50,50],[75,50],[50,78]],from:['🐄','🐖','🐑','🐔'],to:'🌾',keep:1,sounds:1,
    go:{de:'Füttere alle Tiere!',en:'Feed all the animals!',es:'¡Da de comer a todos los animales!'},
    done:{de:'Alle Tiere sind satt!',en:'All the animals are full!',es:'¡Todos los animales están llenos!'}},
  pilot:{bg:'#BFE6FA',deco:[['✈️',12,50,54,'plane']],targets:[[40,24],[62,62],[86,34]],from:'⭐',to:'',fly:1,count:1,
    go:{de:'Flieg zu allen Sternen! Tippe auf die Sterne.',en:'Fly to all the stars! Tap the stars.',es:'¡Vuela hasta todas las estrellas! Toca las estrellas.'},
    done:{de:'Wir sind gelandet! Gute Reise!',en:'We have landed! Have a good trip!',es:'¡Hemos aterrizado! ¡Buen viaje!'}}};
const ANIMAL_SAYS={de:['Muh!','Oink!','Mäh!','Gack!'],en:['Moo!','Oink!','Baa!','Cluck!'],es:['¡Muu!','¡Oinc!','¡Bee!','¡Coc!']};
function jobTask(j,fem,skin){
  clearTimeout(jobT);const T=TASKS[j.k],r={kind:'task',j,fem,skin,n:0};JR=r;
  $('jobPlay').style.display='none';const st=$('jobStage');st.innerHTML='';
  const sc=document.createElement('div');sc.className='jScene';sc.style.background=T.bg;st.appendChild(sc);
  const me=document.createElement('canvas');me.className='jMe';sc.appendChild(me);requestAnimationFrame(()=>drawWorker(me,j,fem,skin));
  (T.deco||[]).forEach(([e,x,y,s,id])=>{const d=document.createElement('div');d.className='jDeco';d.textContent=e;d.style.left=x+'%';d.style.top=y+'%';d.style.fontSize=s/4+'vmin';if(id)d.id='jDeco_'+id;sc.appendChild(d);});
  const finish=()=>{if(!jLive(r))return;bigWin();award(0);const line=T.done[lang];$('jobPrompt').textContent=line;say(line);
    const bar=document.createElement('div');bar.className='jEnd';[[JT.again[lang],()=>jobTask(j,fem,skin)],[JT.other[lang],()=>{JM='play';jobRound();}]].forEach(([t,f])=>{const b=document.createElement('button');b.className='btn';b.textContent=t;b.onclick=()=>{ac();f();};bar.appendChild(b);});
    st.appendChild(bar);};
  const tgt=(e,x,y,onTap)=>{const b=document.createElement('button');b.className='jT';b.textContent=e;b.style.left=x+'%';b.style.top=y+'%';b.onclick=()=>{ac();onTap(b);};sc.appendChild(b);return b;};
  if(T.letters){   // the teacher: a letter on the blackboard, which picture starts with it?
    const words=Object.entries(LETTERWORD[lang]).filter(([l,w])=>/^[a-z]$/.test(l)&&emojiOK(w[0]));let round=0;
    const board=document.createElement('div');board.className='jBoard';sc.appendChild(board);
    const ask=()=>{if(!jLive(r))return;[...sc.querySelectorAll('.jT')].forEach(b=>b.remove());if(round>=3){finish();return;}
      const pick3=shuffle(words).slice(0,3),[L,w]=pick3[0];board.textContent=lang==='de'?L.toUpperCase():L;
      r.lock=false;shuffle(pick3).forEach(([l2,w2],i)=>tgt(w2[0],22+i*28,70,b=>{if(r.lock)return;if(l2===L){r.lock=true;b.classList.add('ok');beep(880,0,0.12,'triangle',0.16);sayAt(w2[1],0.75);round++;setTimeout(ask,1300);}
        else{nope();b.classList.remove('wrong');void b.offsetWidth;b.classList.add('wrong');sayAt(w2[1],0.75);}}));
      const q=T.go[lang]+' '+(lang==='de'?L.toUpperCase():L);$('jobPrompt').textContent=q;say(q);};
    ask();return;}
  if(T.houses){    // the mail carrier: bring each letter to the house with the right number
    const houses=[];for(let i=1;i<=T.houses;i++){const h=tgt('🏠',10+(i-1)*20,62,b=>{if(r.lock)return;if(r.want===i){r.lock=true;b.classList.add('ok');beep(880,0,0.12,'triangle',0.16);sayAt(jNum(i),0.8);r.n++;setTimeout(next,1200);}
        else{nope();b.classList.remove('wrong');void b.offsetWidth;b.classList.add('wrong');sayAt(jNum(i),0.8);}});
      const num=document.createElement('span');num.className='jNum';num.textContent=i;h.appendChild(num);houses.push(h);}
    const letter=document.createElement('div');letter.className='jDeco jLetter';letter.textContent='✉️';sc.appendChild(letter);
    const next=()=>{if(!jLive(r))return;r.lock=false;houses.forEach(h=>h.classList.remove('ok'));if(r.n>=3){finish();return;}
      let w;do{w=1+Math.floor(Math.random()*T.houses);}while(w===r.want);r.want=w;letter.innerHTML='✉️<b>'+w+'</b>';
      const q=mailAsk(w);$('jobPrompt').textContent=q;say(q);};
    next();return;}
  const total=T.targets.length;
  T.targets.forEach(([x,y],i)=>{const e=Array.isArray(T.from)?T.from[i%T.from.length]:T.from;
    tgt(e,x,y,b=>{if(b.classList.contains('done'))return;b.classList.add('done');r.n++;
      if(T.drive){b.classList.add('drive');}
      else if(T.fly){const p=$('jDeco_plane');if(p){p.style.left=x+'%';p.style.top=y+'%';}b.classList.add('pop');}
      else if(T.keep){const s=document.createElement('span');s.className='jPlus';s.textContent=T.to;b.appendChild(s);}
      else{b.textContent=T.to;b.classList.add('pop');}
      beep(660+r.n*90,0,0.12,'triangle',0.16);
      if(T.sounds)sayAt(ANIMAL_SAYS[lang][i],0.8);else if(T.count)sayAt(jNum(r.n),0.8);
      if(r.n>=total)setTimeout(finish,900);});});
  $('jobPrompt').textContent=T.go[lang];say(T.go[lang]);
}
