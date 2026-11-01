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
  $('stkHead').textContent={es:`Mi álbum: ${F.size} de ${tot}`,en:`My stickers: ${F.size} of ${tot}`,de:`Mein Stickerbuch: ${F.size} von ${tot}`}[lang];
  $('stkFill').style.width=(F.size/tot*100)+'%';
  const book=$('stkBook');book.innerHTML='';$('stkCard').classList.remove('on');
  for(const [k,ic,name,center,ids] of STK_AREAS){
    const have=ids.filter(id=>F.has(id)).length,sec=document.createElement('div');sec.className='stkArea'+(have===ids.length?' full':'');
    sec.innerHTML=`<div class="stkTitle"><span>${ic} ${name[lang]}</span><span class="stkCount">${have===ids.length?'🏆 ':''}${have}/${ids.length}</span></div>`;
    const grid=document.createElement('div');grid.className='stkGrid';
    for(const id of ids){const e=CITY.ENT[id];if(!e)continue;const got=F.has(id),fresh=got&&!STK_SEEN.has(id);
      const b=document.createElement('button');b.className='stk'+(got?' got':' miss')+(fresh?' fresh':'');
      b.innerHTML=`<span class="stkPic">${stkIcon(id)}</span><span class="stkName">${got?e.n[L]:'?'}</span>${fresh?`<span class="stkNew">${{es:'nuevo',en:'new',de:'neu'}[lang]}</span>`:''}`;
      b.onclick=()=>{ac();stkOpen(id,center,ic,name);};grid.appendChild(b);}
    sec.appendChild(grid);book.appendChild(sec);}
  stkMuseum(book);
  // what was new is now seen (the badges stay visible until the book is opened again)
  for(const id of F)STK_SEEN.add(id);try{localStorage.setItem('sl_stkseen',JSON.stringify([...STK_SEEN]));}catch(e){}
  const nw=stickersNew();
  say(F.size?{es:`¡Tienes ${F.size} pegatinas!`,en:`You have ${F.size} stickers!`,de:`Du hast schon ${F.size} Sticker!`}[lang]
    :{es:'Tu álbum está vacío. ¡Busca animales en la ciudad!',en:'Your book is empty. Look for animals in the town!',de:'Dein Stickerbuch ist noch leer. Suche Tiere in der Stadt!'}[lang]);
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
  say(got?(e.l?e.l[L]:name):{es:'Todavía no lo has encontrado. Búscalo en: ',en:'You have not found this one yet. Look in: ',de:'Den hast du noch nicht gefunden. Suche hier: '}[lang]+area[lang]);
  const s=$('stkSay');if(s)s.onclick=()=>{ac();say(e.l?e.l[L]:name);};
  $('stkX').onclick=()=>{ac();c.classList.remove('on');};
  $('stkGo').onclick=()=>{ac();c.classList.remove('on');CITY.showAt(id,center,(STK_AREAS.find(A=>A[4].includes(id))||[])[4]);showTab('city');};
}
/* dinosaurs dug up in the prize game, and the little treasures that came with them.
   Same saved lists as before (sl_dinos / sl_treasure); they just live with the other finds. */
function stkMuseum(book){
  const have=DINOS.filter(d=>found.includes(d.k)).length;
  const sec=document.createElement('div');sec.className='stkArea'+(have===DINOS.length?' full':'');
  const title={es:'Museo de dinosaurios',en:'Dinosaur museum',de:'Dino-Museum'}[lang];
  sec.innerHTML=`<div class="stkTitle"><span>🏛️ ${title}</span><span class="stkCount">${have===DINOS.length?'🏆 ':''}${have}/${DINOS.length}</span></div>`;
  const grid=document.createElement('div');grid.className='stkDinos';
  DINOS.forEach(d=>{
    const got=found.includes(d.k);
    const b=document.createElement('button');b.type='button';b.className='stkDino'+(got?' got':'');
    const cn=document.createElement('canvas');b.appendChild(cn);
    const lb=document.createElement('span');lb.className='stkName';
    lb.textContent=got?d[lang][0].replace(/^(el|la|the|der|die|das)\s+/i,''):'?';
    b.appendChild(lb);
    b.onclick=()=>{ac();
      if(got)say(d[lang][0]+'. '+d[lang][1]);
      else say({es:'¿Quién será? ¡Sigue excavando!',en:'Who could it be? Keep digging!',de:'Wer das wohl ist? Grab weiter!'}[lang]);};
    grid.appendChild(b);
    requestAnimationFrame(()=>drawThumb(cn,d,!got));
  });
  sec.appendChild(grid);
  const tr=TREASURES.filter(t=>treasure[t.k]);
  if(tr.length){
    const line=document.createElement('div');line.className='stkTreasures';
    line.innerHTML=`<b>${{es:'Tesoros',en:'Treasures',de:'Schätze'}[lang]}:</b> `+tr.map(t=>`<span>${t.ic}×${treasure[t.k]}</span>`).join(' ');
    sec.appendChild(line);
  }
  book.appendChild(sec);
}
