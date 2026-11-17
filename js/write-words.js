/* =============================================================
   WORDS TO TRACE
   One line per picture. en / de / es is exactly what he writes:
   2–5 letters, and only letters the tracing canvas knows
   (a–z, A–Z, ä ö ü Ä Ö Ü — see SHAPES in shapes.js).
   German nouns keep their capital letter. Spanish and English
   stay lowercase, so no accents: "leon" is not a word here,
   "gato" is.
   Add a word by adding one line. A letter the canvas cannot
   draw, or a word of the wrong length, stops the app on purpose
   so a typo is caught immediately.
============================================================= */
const WRITE_WORDS=[
  {e:'🐱', en:'cat',   de:'Katze', es:'gato'},
  {e:'🐶', en:'dog',   de:'Hund',  es:'perro'},
  {e:'☀️', en:'sun',   de:'Sonne', es:'sol'},
  {e:'🏠', en:'house', de:'Haus',  es:'casa'},
  {e:'⚽', en:'ball',  de:'Ball',  es:'bola'},
  {e:'🌕', en:'moon',  de:'Mond',  es:'luna'},
  {e:'🐟', en:'fish',  de:'Fisch', es:'pez'},
  {e:'🦆', en:'duck',  de:'Ente',  es:'pato'},
  {e:'🐮', en:'cow',   de:'Kuh',   es:'vaca'},
  {e:'🐻', en:'bear',  de:'Bär',   es:'oso'},
  {e:'🦊', en:'fox',   de:'Fuchs', es:'zorro'},
  {e:'🐺', en:'wolf',  de:'Wolf',  es:'lobo'},
  {e:'🐝', en:'bee',   de:'Biene', es:'abeja'},
  {e:'🚗', en:'car',   de:'Auto',  es:'coche'},
  {e:'🚂', en:'train', de:'Zug',   es:'tren'},
  {e:'⛵', en:'boat',  de:'Boot',  es:'barco'},
  {e:'📖', en:'book',  de:'Buch',  es:'libro'},
  {e:'✋', en:'hand',  de:'Hand',  es:'mano'},
  {e:'👃', en:'nose',  de:'Nase',  es:'nariz'},
  {e:'👀', en:'eye',   de:'Auge',  es:'ojo'},
  {e:'🧢', en:'hat',   de:'Hut',   es:'gorro'},
  {e:'🛏️', en:'bed',   de:'Bett',  es:'cama'},
  {e:'🥚', en:'egg',   de:'Ei',    es:'huevo'},
  {e:'🥛', en:'milk',  de:'Milch', es:'leche'},
  {e:'🍞', en:'bread', de:'Brot',  es:'pan'},
  {e:'🔥', en:'fire',  de:'Feuer', es:'fuego'},
  {e:'👑', en:'king',  de:'König', es:'rey'},
  {e:'👩', en:'mom',   de:'Mama',  es:'mama'},
  {e:'👨', en:'dad',   de:'Papa',  es:'papa'},
  {e:'☕', en:'cup',   de:'Tasse', es:'taza'},
  {e:'🌹', en:'rose',  de:'Rose',  es:'rosa'},
  {e:'🍃', en:'leaf',  de:'Blatt', es:'hoja'},
  {e:'🏖️', en:'sand',  de:'Sand',  es:'arena'},
  {e:'🌊', en:'sea',   de:'Meer',  es:'mar'},
  {e:'🪨', en:'rock',  de:'Stein', es:'roca'},
  {e:'🪺', en:'nest',  de:'Nest',  es:'nido'},
  {e:'💪', en:'arm',   de:'Arm',   es:'brazo'},
  {e:'👂', en:'ear',   de:'Ohr',   es:'oreja'},
  {e:'💇', en:'hair',  de:'Haar',  es:'pelo'},
  {e:'🐞', en:'bug',   de:'Käfer', es:'bicho'},
  {e:'☁️', en:'cloud', de:'Wolke', es:'nube'},
  {e:'🏞️', en:'lake',  de:'See',   es:'lago'},
  {e:'⛰️', en:'hill',  de:'Berg',  es:'monte'},
  {e:'🥜', en:'nut',   de:'Nuss',  es:'nuez'},
  {e:'🥣', en:'soup',  de:'Suppe', es:'sopa'},
  {e:'🍚', en:'rice',  de:'Reis',  es:'arroz'},
  {e:'🍐', en:'pear',  de:'Birne', es:'pera'},
  {e:'🥝', en:'kiwi',  de:'Kiwi',  es:'kiwi'},
  {e:'🥷', en:'ninja', de:'Ninja', es:'ninja'},
  {e:'🍕', en:'pizza', de:'Pizza', es:'pizza'},
  {e:'🌮', en:'taco',  de:'Taco',  es:'taco'},
  {e:'🐴', en:'pony',  de:'Pony',  es:'poni'},
  {e:'🚲', en:'bike',  de:'Rad',   es:'bici'},
  {e:'🎮', en:'game',  de:'Spiel', es:'juego'},
  {e:'🌱', en:'grass', de:'Gras',  es:'pasto'},
  {e:'🚌', en:'bus',   de:'Bus',   es:'bus'},
  {e:'🧊', en:'ice',   de:'Eis',   es:'hielo'},
  {e:'🐦', en:'bird',  de:'Vogel', es:'ave'}
];

/* true when every letter of this spelling can be traced */
function writeWordOk(text){
  const cs=[...String(text||'')];
  return cs.length>=2&&cs.length<=5&&cs.every(ch=>SHAPES[ch]);
}
let writeCur=null,writeBag=[];
/* a fresh word, not the one he just finished, until the bag runs out */
function nextWriteWord(prev){
  const all=WRITE_WORDS.filter(w=>writeWordOk(w.en)&&writeWordOk(w.de)&&writeWordOk(w.es));
  if(!writeBag.length){
    writeBag=all.slice();
    for(let i=writeBag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=writeBag[i];writeBag[i]=writeBag[j];writeBag[j]=t;}
    if(prev&&writeBag.length>1&&writeBag[writeBag.length-1]===prev){const t=writeBag[0];writeBag[0]=writeBag[writeBag.length-1];writeBag[writeBag.length-1]=t;}
  }
  let w=writeBag.pop();
  if(prev&&w===prev&&writeBag.length){writeBag.unshift(w);w=writeBag.pop();}
  return w;
}

WRITE_WORDS.forEach(w=>{
  ['en','de','es'].forEach(L=>{
    if(!writeWordOk(w[L])) throw new Error('Writing word needs 2–5 traceable letters: '+L+' '+w[L]);
  });
});

/* How the writing-words practice is going, one record per learning language.
   Nothing on screen changes, and nothing leaves the device: a wrong start,
   a retry, a skip, a slow finish and a completed word are counted in
   localStorage so the sling can prefer words that are still hard.
   The key is the language plus the English spelling, which stays the same
   picture in German, English or Spanish. A language the parent has switched
   off (Spanish is often off, because that is the language he already speaks)
   is still stored, but it is not used until it is switched on again. */
let WRITE_TRACK={};
try{WRITE_TRACK=JSON.parse(localStorage.getItem('sl_write')||'{}')||{};}catch(e){WRITE_TRACK={};}
if(!WRITE_TRACK||typeof WRITE_TRACK!=='object')WRITE_TRACK={};
function writeTrackSave(){try{localStorage.setItem('sl_write',JSON.stringify(WRITE_TRACK));}catch(e){}}
function writeTrackClear(){WRITE_TRACK={};writeTrackSave();}
function writeLangsOn(){
  const all=['de','en','es'];
  const on=(typeof LANGS_ON!=='undefined'&&Array.isArray(LANGS_ON)?LANGS_ON:all).filter(c=>all.includes(c));
  return on.length?on:all;
}
function writeTrackKey(word,L){word=word||(typeof writeCur!=='undefined'?writeCur:null);L=L||lang;return word&&word.en?L+'|'+word.en:'';}
let writeSit={id:'',t0:0,done:false};
function writeSitBegin(){writeSit={id:writeTrackKey(),t0:performance.now(),done:false};}
function writeTrackAdd(field){
  if(typeof mode!=='undefined'&&mode!=='words')return;
  if(typeof traceScreen!=='undefined'&&traceScreen!=='play')return;
  if(!writeLangsOn().includes(lang))return;
  const id=writeTrackKey();if(!id)return;
  const r=WRITE_TRACK[id]||(WRITE_TRACK[id]={miss:0,retry:0,skip:0,slow:0,ok:0});
  r[field]=(r[field]||0)+1;r.at=Date.now();
  writeTrackSave();
}
function writeTrackDone(){
  const id=writeTrackKey();if(!id)return;
  writeSit.done=true;
  writeTrackAdd('ok');
  const letters=(typeof playlist!=='undefined'&&playlist.length)||String((writeCur&&writeCur[lang])||'').length||1;
  if(writeSit.id===id&&performance.now()-writeSit.t0>Math.max(12000,letters*8000))writeTrackAdd('slow');
}
function writeWeakOne(en,L){
  const r=WRITE_TRACK[L+'|'+en];
  if(!r)return 0;
  return (r.miss||0)+(r.retry||0)*2+(r.skip||0)+(r.slow||0)-(r.ok||0);
}
/* One language, or the sum across every learning language that is switched on. */
function writeWeakScore(en,L){
  if(L)return writeWeakOne(en,L);
  return writeLangsOn().reduce((s,c)=>s+writeWeakOne(en,c),0);
}
