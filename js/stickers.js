/* =============================================================
   STICKER BOOK: every animal hidden in the town, grouped by area.
   Found ones are bright stickers (tap: hear the name, fly there);
   missing ones are dark silhouettes with a hint where to look.
   New stickers carry a "neu" badge until the book has been opened.
============================================================= */
const STK_AREAS=[
  ['town','🏙️',{es:'La ciudad',en:'The town',de:'Die Stadt'},[600,800],['cat','duck','frog']],
  ['forest','🌲',{es:'El bosque',en:'The forest',de:'Der Wald'},[1250,400],['bear','fox','owl','deer','squirrel','hedgehog','wolf','boar','badger','woodpecker','stag','beaver','snail','butterfly']],
  ['farm','🚜',{es:'La granja',en:'The farm',de:'Der Bauernhof'},[1040,1050],['rabbit','cow','pig','sheep','chicken']],
  ['mountains','🏔️',{es:'Las montañas',en:'The mountains',de:'Die Berge'},[800,-400],['ibex','marmot','eagle','chamois']],
  ['dino','🦕',{es:'El valle de los dinosaurios',en:'Dinosaur valley',de:'Das Dino-Tal'},[2200,200],['brachio','trex','trike','stego','ptera','babydino']],
  ['castle','🏰',{es:'El castillo',en:'The castle',de:'Die Burg'},[2000,1480],['dragon','horse']],
  ['sea','🏖️',{es:'La playa y el mar',en:'Beach and sea',de:'Strand und Meer'},[1200,2000],['crab','gull','starfish','seal','octopus','turtle','dolphin','whale','shark','parrot']],
  ['north','🎅',{es:'El Polo Norte',en:'The North Pole',de:'Der Nordpol'},[-700,250],['reindeer','polarbear','arcticfox','snowyowl','penguin']],
  ['spooky','🎃',{es:'El rincón del miedo',en:'The spooky corner',de:'Die Gruselecke'},[-700,1250],['bat','raven','spider','blackcat']],
  ['west','🤠',{es:'El Lejano Oeste',en:'The Wild West',de:'Der Wilde Westen'},[3400,1200],['bison','coyote','snake','roadrunner','vulture','lizard']],
  ['deep','🤿',{es:'Las profundidades del mar',en:'The deep sea',de:'Die Tiefsee'},[2000,3400],['manta','spermwhale','jellyfish','squid','anglerfish']],
  ['egypt','🏺',{es:'Egipto',en:'Egypt',de:'Ägypten'},[3450,630],['camel']],
  ['space','🚀',{es:'El centro espacial',en:'The space centre',de:'Das Raumfahrtzentrum'},[3500,100],['alien']],
  ['industry','🏭',{es:'La zona industrial',en:'The industrial area',de:'Das Industriegebiet'},[4700,800],['rat','policedog','elephant']]];
const STK_FALLBACK={jellyfish:'🎐',policedog:'🐩',beaver:'🦫',ptera:'🦅',raven:'🐦',blackcat:'🐈',polarbear:'🐻'};
let STK_SEEN=new Set();try{STK_SEEN=new Set(JSON.parse(localStorage.getItem('sl_stkseen')||'[]'));}catch(e){}
const stickersNew=()=>window.CITY?[...CITY.FOUND].filter(id=>!STK_SEEN.has(id)).length:0;
let stkOK={};
function stkIcon(id){const e=CITY.ENT[id];if(stkOK[e.ic]===undefined)stkOK[e.ic]=typeof emojiOK!=='function'||emojiOK(e.ic);
  return stkOK[e.ic]?e.ic:(STK_FALLBACK[id]||'🐾');}
function showStickers(){
  const F=CITY.FOUND,tot=CITY.total(),L={de:0,en:1,es:2}[lang];
  const round=CITY.round(),done=CITY.done(),left=tot-F.size;
  $('stkHead').innerHTML={es:`Mi álbum: ${F.size} de ${tot}`,en:`My stickers: ${F.size} of ${tot}`,de:`Mein Stickerbuch: ${F.size} von ${tot}`}[lang]
    +(round>1?`<div class="stkRound">${'🏆'.repeat(Math.min(done,5))}${done>5?'×'+done:''} ${{es:'Ronda',en:'Round',de:'Runde'}[lang]} ${round}</div>`:'');
  $('stkFill').style.width=(F.size/tot*100)+'%';
  const book=$('stkBook');book.innerHTML='';$('stkCard').classList.remove('on');
  if(left===0){   // the whole book: a big trophy, and the choice to start again from zero
    const top=document.createElement('div');top.className='stkFull';
    top.innerHTML=`<div class="stkFullCup">🏆</div><div class="stkFullT display">${{es:'¡Álbum completo!',en:'Sticker book complete!',de:'Stickerbuch voll!'}[lang]}</div>
      <button id="stkAgain" class="btn">🔄 ${{es:'¡Otra vez desde cero!',en:'Find them all again!',de:'Nochmal alle suchen!'}[lang]}</button>`;
    book.appendChild(top);
    top.querySelector('#stkAgain').onclick=()=>{ac();CITY.newRound();STK_SEEN=new Set();try{localStorage.setItem('sl_stkseen','[]');}catch(e){}
      if(typeof fanfare==='function')fanfare();if(typeof rainEmoji==='function')rainEmoji(['🐾','⭐','🦊','🐻','🦉'],26);
      showStickers();
      say({es:`¡Ronda ${CITY.round()}! El álbum está vacío otra vez. Esta vez las pegatinas son de oro. ¡A buscar!`,
           en:`Round ${CITY.round()}! The book is empty again. This time the stickers are gold. Off you go!`,
           de:`Runde ${CITY.round()}! Das Stickerbuch ist wieder leer. Diesmal gibt es goldene Sticker. Los geht's!`}[lang]);};
  }
  else if(left<=10){   // close to the end: say how many, and show where they still hide
    const areas=STK_AREAS.filter(A=>A[4].some(id=>CITY.ENT[id]&&!F.has(id)));
    const tip=document.createElement('div');tip.className='stkLeft';
    tip.innerHTML=`<b>${left===1?{es:'¡Solo falta uno!',en:'Only one left!',de:'Nur noch einer fehlt!'}[lang]:{es:`¡Solo faltan ${left}!`,en:`Only ${left} left!`,de:`Nur noch ${left} fehlen!`}[lang]}</b> `
      +areas.map(A=>`<button class="stkJump">${A[1]}</button>`).join('');
    book.appendChild(tip);
    [...tip.querySelectorAll('.stkJump')].forEach((b,i)=>b.onclick=()=>{ac();const A=areas[i],sec=book.querySelector(`[data-area="${A[0]}"]`);if(sec)sec.scrollIntoView({behavior:'smooth',block:'center'});say(A[2][lang]);});
  }
  for(const [k,ic,name,center,ids] of STK_AREAS){
    const have=ids.filter(id=>F.has(id)).length,sec=document.createElement('div');sec.className='stkArea'+(have===ids.length?' full':'');sec.dataset.area=k;
    sec.innerHTML=`<div class="stkTitle"><span>${ic} ${name[lang]}</span><span class="stkCount">${have===ids.length?'🏆 ':''}${have}/${ids.length}</span></div>`;
    const grid=document.createElement('div');grid.className='stkGrid';
    for(const id of ids){const e=CITY.ENT[id];if(!e)continue;const got=F.has(id),fresh=got&&!STK_SEEN.has(id);
      const b=document.createElement('button');b.className='stk'+(got?' got':' miss')+(got&&round>1?' gold':'')+(fresh?' fresh':'');
      b.innerHTML=`<span class="stkPic">${stkIcon(id)}</span><span class="stkName">${got?e.n[L]:'?'}</span>${fresh?`<span class="stkNew">${{es:'nuevo',en:'new',de:'neu'}[lang]}</span>`:''}`;
      b.onclick=()=>{ac();stkOpen(id,center,ic,name);};grid.appendChild(b);}
    sec.appendChild(grid);book.appendChild(sec);}
  stkMuseum(book);
  // what was new is now seen (the badges stay visible until the book is opened again)
  for(const id of F)STK_SEEN.add(id);try{localStorage.setItem('sl_stkseen',JSON.stringify([...STK_SEEN]));}catch(e){}
  const nw=stickersNew();
  say(left===0?{es:'¡Tu álbum está completo! ¿Quieres buscarlos todos otra vez?',en:'Your sticker book is complete! Do you want to find them all again?',de:'Dein Stickerbuch ist voll! Willst du alle nochmal suchen?'}[lang]
    :F.size&&left<=10?{es:`¡Tienes ${F.size} pegatinas! Solo faltan ${left}.`,en:`You have ${F.size} stickers! Only ${left} left.`,de:`Du hast schon ${F.size} Sticker! Nur noch ${left} fehlen.`}[lang]
    :F.size?{es:`¡Tienes ${F.size} pegatinas!`,en:`You have ${F.size} stickers!`,de:`Du hast schon ${F.size} Sticker!`}[lang]
    :{es:'Tu álbum está vacío. ¡Busca animales en la ciudad!',en:'Your book is empty. Look for animals in the town!',de:'Dein Stickerbuch ist noch leer. Suche Tiere in der Stadt!'}[lang]);
}
/* one language at a time: the card speaks the app language; small flags say the same in another */
const stkLangs=()=>flagLangs();
const STK_FLAG={de:'🇩🇪',en:'🇬🇧',es:'🇪🇸'};
function stkFlags(text){   // text: {de,en,es} → flag buttons that speak it
  return stkLangs().map(L=>{const b=document.createElement('button');b.type='button';b.className='stkFlag';b.textContent=STK_FLAG[L];
    b.onclick=()=>{ac();speakFresh(text[L],L,0.8);};return b;});
}
/* a dinosaur or a treasure from the museum, on the same card as a sticker */
function stkShow(pic,name,text){
  const c=$('stkCard');
  c.innerHTML=`<div class="stkBig"></div><div class="stkBigName"></div><div class="stkLine"></div><div class="stkBtns"><button id="stkSay">🔊</button><button id="stkX">✕</button></div>`;
  const big=c.querySelector('.stkBig');if(typeof pic==='string')big.textContent=pic;else{big.classList.add('stkPicCv');big.appendChild(pic.el);}
  c.querySelector('.stkBigName').textContent=name[lang].charAt(0).toUpperCase()+name[lang].slice(1);c.querySelector('.stkLine').textContent=text[lang]===name[lang]?'':text[lang].replace(name[lang],'').replace(/^[.!\s]+/,'');
  const btns=c.querySelector('.stkBtns');stkFlags(text).forEach(f=>btns.insertBefore(f,$('stkX')));
  c.classList.add('on');if(pic.draw)requestAnimationFrame(pic.draw);
  say(text[lang]);
  $('stkSay').onclick=()=>{ac();say(text[lang]);};
  $('stkX').onclick=()=>{ac();c.classList.remove('on');};
}
function stkOpen(id,center,ic,area){
  const e=CITY.ENT[id],got=CITY.FOUND.has(id),L={de:0,en:1,es:2}[lang],c=$('stkCard');
  const name=e.n[L].charAt(0).toUpperCase()+e.n[L].slice(1);
  c.innerHTML=got
    ?`<div class="stkBig">${stkIcon(id)}</div><div class="stkBigName">${name}</div><div class="stkLine">${e.l?e.l[L]:''}</div>
      <div class="stkBtns"><button id="stkSay">🔊</button><button id="stkGo">🔍 ${{es:'Mostrar en la ciudad',en:'Show me in town',de:'In der Stadt zeigen'}[lang]}</button><button id="stkX">✕</button></div>`
    :`<div class="stkBig miss">${stkIcon(id)}</div><div class="stkBigName">?</div><div class="stkLine">${{es:'Todavía no lo has encontrado. Busca aquí: ',en:'Not found yet. Look here: ',de:'Noch nicht gefunden. Suche hier: '}[lang]}${ic} ${area[lang]}</div>
      <div class="stkBtns"><button id="stkGo">🔍 ${{es:'¡Vamos a buscar!',en:"Let's go and look!",de:'Los, suchen!'}[lang]}</button><button id="stkX">✕</button></div>`;
  c.classList.add('on');
  const words={},IX={de:0,en:1,es:2};['de','en','es'].forEach(c=>{const i=IX[c];words[c]=e.l&&e.l[i]?e.l[i]:e.n[i].charAt(0).toUpperCase()+e.n[i].slice(1)+'!';});
  if(got){say(words[lang]);const btns=c.querySelector('.stkBtns');stkFlags(words).forEach(f=>btns.insertBefore(f,$('stkGo')));}
  else say({es:'Todavía no lo has encontrado. Búscalo en: ',en:'You have not found this one yet. Look in: ',de:'Den hast du noch nicht gefunden. Suche hier: '}[lang]+area[lang]);
  const s=$('stkSay');if(s)s.onclick=()=>{ac();say(words[lang]);};
  $('stkX').onclick=()=>{ac();c.classList.remove('on');};
  $('stkGo').onclick=()=>{ac();c.classList.remove('on');CITY.showAt(id,center,(STK_AREAS.find(A=>A[4].includes(id))||[])[4]);showTab('city');};
}
/* dinosaurs dug up in the prize game, and the little treasures that came with them.
   Same saved lists as before (sl_dinos / sl_treasure); they just live with the other finds. */
function stkMuseum(book){
  const have=DINOS.filter(d=>found.includes(d.k)).length;
  const sec=document.createElement('div');sec.className='stkArea'+(have===DINOS.length?' full':'');
  const title={es:'Museo de dinosaurios',en:'Dinosaur museum',de:'Dino-Museum'}[lang];
  const rd=typeof dinoRound!=='undefined'?dinoRound:1;
  sec.innerHTML=`<div class="stkTitle"><span>🏛️ ${title}${rd>1?` · ${{es:'Ronda',en:'Round',de:'Runde'}[lang]} ${rd}`:''}</span><span class="stkCount">${have===DINOS.length?'🏆 ':''}${have}/${DINOS.length}</span></div>`
    +(have===DINOS.length?`<div class="stkLine2">${{es:'¡Museo completo! La próxima excavación empieza una nueva ronda.',en:'Museum complete! The next dig starts a new round.',de:'Museum voll! Beim nächsten Graben beginnt eine neue Runde.'}[lang]}</div>`
      :DINOS.length-have<=5&&have?`<div class="stkLine2">${{es:`¡Solo faltan ${DINOS.length-have} dinosaurios!`,en:`Only ${DINOS.length-have} dinosaurs left!`,de:`Nur noch ${DINOS.length-have} Dinos fehlen!`}[lang]}</div>`:'');
  const grid=document.createElement('div');grid.className='stkDinos';
  DINOS.forEach(d=>{
    const got=found.includes(d.k);
    const b=document.createElement('button');b.type='button';b.className='stkDino'+(got?' got':'')+(got&&rd>1?' gold':'');
    const cn=document.createElement('canvas');b.appendChild(cn);
    const lb=document.createElement('span');lb.className='stkName';
    lb.textContent=got?d[lang][0].replace(/^(el|la|the|der|die|das)\s+/i,''):'?';
    b.appendChild(lb);
    b.onclick=()=>{ac();
      if(got){const cn=document.createElement('canvas');
        stkShow({el:cn,draw:()=>drawThumb(cn,d,false)},{de:d.de[0],en:d.en[0],es:d.es[0]},{de:d.de[0]+'. '+d.de[1],en:d.en[0]+'. '+d.en[1],es:d.es[0]+'. '+d.es[1]});}
      else say({es:'¿Quién será? ¡Sigue excavando!',en:'Who could it be? Keep digging!',de:'Wer das wohl ist? Grab weiter!'}[lang]);};
    grid.appendChild(b);
    requestAnimationFrame(()=>drawThumb(cn,d,!got));
  });
  sec.appendChild(grid);
  const tr=TREASURES.filter(t=>treasure[t.k]);
  if(tr.length){
    const line=document.createElement('div');line.className='stkTreasures';
    line.innerHTML=`<b>${{es:'Tesoros',en:'Treasures',de:'Schätze'}[lang]}:</b> `;
    tr.forEach(t=>{const b=document.createElement('button');b.type='button';b.className='stkTre';
      b.textContent=t.ic+(treasure[t.k]>1?'×'+treasure[t.k]:'');
      b.onclick=()=>{ac();const n={de:t.de.replace(/[!¡]/g,''),en:t.en.replace(/[!¡]/g,''),es:t.es.replace(/[!¡]/g,'')};stkShow(t.ic,n,{de:t.de,en:t.en,es:t.es});};line.appendChild(b);});
    sec.appendChild(line);
  }
  book.appendChild(sec);
}
