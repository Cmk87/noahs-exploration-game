/* =============================================================
   READING — sound blending, the way reading is taught at school:
   German and Spanish by syllables (m + a → ma, Ma + ma → Mama),
   English by start sound + word ending (c + at → cat).
   Rounds: BUILD (slide the pieces together, hear them melt into the
   word, the picture appears), HEAR (which syllable/word did you hear?),
   READ (read the word alone and pick its picture). Syllables are
   coloured blue/red like in German first readers.
============================================================= */
/* a word: [picture, piece, piece, …]; a piece "x=y" is written x and spoken y */
const RWORDS={
  de:{two:[['👩','Ma','ma'],['👨','Pa','pa'],['👵','O','ma'],['👴','O','pa'],['🦙','La','ma'],['🛋️','So','fa'],['🦖','Di','no'],
      ['🐇','Ha','se'],['👃','Na','se'],['🌹','Ro','se'],['👖','Ho','se'],['🥫','Do','se'],['🔍','Lu','pe'],['🥤','Li','mo'],
      ['🦁','Lö','we'],['🪚','Sä','ge'],['🦓','Ze','bra']],
    long:[['🐯','Ti','ger'],['🦔','I','gel'],['🐪','Ka','mel'],['🍯','Ho','nig'],['🍝','Nu','del'],['🏴‍☠️','Pi','rat'],
      ['🍅','To','ma','te'],['🍌','Ba','na','ne'],['🚀','Ra','ke','te'],['🍉','Me','lo','ne'],['🤖','Ro','bo','ter'],
      ['📷','Ka','me','ra'],['🦜','Pa','pa','gei'],['🚓','Po','li','zei']]},
  es:{two:[['👩','ma','má'],['👨','pa','pá'],['🌙','lu','na'],['🏠','ca','sa'],['🦆','pa','to'],['🐱','ga','to'],['🍲','so','pa'],
      ['🐒','mo','no'],['🐄','va','ca'],['🦭','fo','ca'],['🐸','ra','na'],['🔍','lu','pa'],['☁️','nu','be'],['👢','bo','ta'],
      ['☕','ta','za'],['🍐','pe','ra'],['🍇','u','va'],['🐻','o','so'],['✋','ma','no'],['🎲','da','do'],['🏍️','mo','to'],
      ['🐺','lo','bo'],['🛏️','ca','ma'],['🌲','pi','no']],
    long:[['🍅','to','ma','te'],['👕','ca','mi','sa'],['⚽','pe','lo','ta'],['🥔','pa','ta','ta'],['🍌','ba','na','na'],
      ['🕊️','pa','lo','ma'],['🐰','co','ne','jo'],['🐢','tor','tu','ga'],['🍎','man','za','na'],['👞','za','pa','to'],
      ['🍦','he','la','do'],['🐌','ca','ra','col'],['🚀','co','he','te']]},
  en:{two:[['🐱','c=kuh','at'],['🎩','h=huh','at'],['🦇','b=buh','at'],['🐀','r=ruh','at'],['🐶','d=duh','og'],['🪵','l=luh','og'],
      ['☀️','s=suh','un'],['🐷','p=puh','ig=igg'],['🐔','h=huh','en'],['🖊️','p=puh','en'],['🔟','t=tuh','en'],['🦊','f=fuh','ox'],
      ['📦','b=buh','ox'],['🐛','b=buh','ug=ugg'],['🛏️','b=buh','ed'],['🔴','r=ruh','ed'],['🚐','v=vuh','an'],['🍳','p=puh','an'],
      ['🥫','c=kuh','an'],['🗺️','m=muh','ap=app'],['🧢','c=kuh','ap=app'],['🚌','b=buh','us=uss'],['🥅','n=nuh','et'],
      ['🕸️','w=wuh','eb=ebb'],['🧦','s=suh','ock'],['🦆','d=duh','uck'],['🐟','f=fuh','ish'],['🚢','sh=shh','ip']],
    long:[['🐰','rab','bit'],['🤖','ro=roe','bot'],['🎃','pump','kin'],['🚀','rock','et=it'],['🍋','lem','on=un'],['🧺','pic','nic'],
      ['🌇','sun','set'],['🧁','cup','cake'],['🍿','pop','corn'],['🌭','hot','dog'],['🧲','mag','net']]}};
/* first-step syllables: consonant + vowel (German and Spanish) */
const RSYL={de:{c:['m','l','s','n','r','f','p','t'],v:['a','e','i','o','u']},es:{c:['m','p','s','l','t','n','d'],v:['a','e','i','o','u']}};
const RT={
  build:{de:'Schieb die Silben zusammen!',en:'Push the pieces together!',es:'¡Junta las sílabas!'},
  buildSyl:{de:'Schieb die Buchstaben zusammen!',en:'Push the letters together!',es:'¡Junta las letras!'},
  hear:{de:'Welche Silbe hörst du?',en:'Which word do you hear?',es:'¿Qué sílaba oyes?'},
  read:{de:'Lies das Wort! Welches Bild passt?',en:'Read the word! Which picture is it?',es:'¡Lee la palabra! ¿Qué dibujo es?'}};
SKILL_START.read={de:1,en:1,es:1};SKILL_MAX.read=4;
const piece=s=>{const k=s.indexOf('=');return k<0?{t:s,say:s}:{t:s.slice(0,k),say:s.slice(k+1)};};
const rword=w=>({pic:w[0],parts:w.slice(1).map(piece),get text(){return this.parts.map(p=>p.t).join('');}});
let RD=null,readRecent=[],readT=null;
const rlist=k=>RWORDS[lang][k].filter(w=>typeof emojiOK!=='function'||emojiOK(w[0])).map(rword);
const RCOL=['#2F6FE0','#E8445A'];
/* say several pieces one after another, then the whole thing */
function readSaySlow(parts,whole,onPiece,done){
  clearTimeout(readT);let k=0;const step=()=>{if(RD===null)return;
    if(k<parts.length){onPiece&&onPiece(k);sayAt(parts[k].say,0.6);k++;readT=setTimeout(step,850);}
    else{onPiece&&onPiece(-1);if(whole)sayAt(whole,0.75);done&&(readT=setTimeout(done,whole?1100:0));}};
  step();}

function readRound(){
  clearTimeout(readT);if(RD)clearTimeout(RD.hintT);const L=level('read',4),de_es=lang!=='en',r=Math.random();let kind;
  if(L===1)kind=de_es?(r<0.55?'buildSyl':'hearSyl'):'build';
  else if(L===2)kind=de_es?(r<0.6?'build':'hearSyl'):(r<0.5?'build':'hearWord');
  else kind=r<0.4?'build':'read';
  const pool=L>=4&&Math.random()<0.6?rlist('long'):rlist('two');
  const fresh=pool.filter(w=>!readRecent.includes(w.text)),src=fresh.length>2?fresh:pool;
  const w=pick(src);
  RD={kind,miss:0,done:false};
  if(kind==='buildSyl'){const c=pick(RSYL[lang].c),v=pick(RSYL[lang].v);RD.word={pic:null,parts:[{t:c,say:c,cons:1},{t:v,say:v}],text:c+v,syl:1};}
  else if(kind==='hearSyl'){const S=RSYL[lang],c=pick(S.c),v=pick(S.v),sameC=Math.random()<0.6;
    const opts=sameC?[v,...shuffle(S.v.filter(x=>x!==v)).slice(0,2)].map(x=>c+x):[c,...shuffle(S.c.filter(x=>x!==c)).slice(0,2)].map(x=>x+v);
    RD.word={text:c+v,parts:[{t:c+v,say:c+v}]};RD.opts=shuffle(opts);}
  else{RD.word=w;readRecent.push(w.text);if(readRecent.length>8)readRecent.shift();
    if(kind==='read'||kind==='hearWord'){const end=x=>x.parts[x.parts.length-1].t,cand=pool.filter(x=>x.text!==w.text&&x.pic!==w.pic);
      const rhyme=kind==='hearWord'?shuffle(cand.filter(x=>end(x)===end(w))):[];           // hat / cat / bat: only the first sound differs
      const others=rhyme.concat(shuffle(cand.filter(x=>!rhyme.includes(x)))).slice(0,2);RD.opts=shuffle([w,...others]);}}
  readDraw();
}
function readDraw(){
  const k=RD.kind,w=RD.word;
  $('readPrompt').textContent=RT[k==='buildSyl'?'buildSyl':k==='hearSyl'||k==='hearWord'?'hear':k][lang];
  const pic=$('readPic'),hear=k==='hearSyl'||k==='hearWord';pic.innerHTML='';pic.classList.toggle('on',k==='build'||hear);pic.classList.remove('show');pic.onclick=null;
  if(k==='build')pic.innerHTML=`<span class="q">?</span><span class="p">${w.pic}</span>`;
  if(hear){pic.innerHTML='<span class="ear">👂</span>';pic.onclick=()=>{ac();sayAt(w.text,0.6);pic.classList.remove('hop');void pic.offsetWidth;pic.classList.add('hop');};}   // tap the ear: hear it again
  $('readTrack').innerHTML='';$('readWord').innerHTML='';$('readGrid').innerHTML='';$('readGrid').className='';
  if(k==='build'||k==='buildSyl'){buildTrack(w);say(RT[k==='buildSyl'?'buildSyl':'build'][lang]);}
  else if(k==='hearSyl'){RD.opts.forEach((s,i)=>{const b=document.createElement('button');b.className='rOpt syl';b.textContent=s;b.style.color=RCOL[0];
      b.onclick=()=>readPick(s===w.text,b,{t:s,say:s});$('readGrid').appendChild(b);});
    $('readGrid').className='syls';say(RT.hear[lang]);readT=setTimeout(()=>sayAt(w.text,0.6),1300);}
  else if(k==='hearWord'){RD.opts.forEach(o=>{const b=document.createElement('button');b.className='rOpt syl';b.innerHTML=wordHTML(o);
      b.onclick=()=>readPick(o===w,b,null);$('readGrid').appendChild(b);});
    $('readGrid').className='syls';say(RT.hear[lang]);readT=setTimeout(()=>sayAt(w.text,0.7),1300);}
  else{ // read: the word alone, three pictures
    $('readWord').innerHTML=wordHTML(w,true);
    $('readWord').querySelectorAll('span').forEach((s,i)=>s.onclick=()=>{ac();sayAt(w.parts[i].say,0.6);s.classList.remove('hop');void s.offsetWidth;s.classList.add('hop');});
    RD.opts.forEach(o=>{const b=document.createElement('button');b.className='rOpt pic';b.textContent=o.pic;
      b.onclick=()=>readPick(o===w,b,o);$('readGrid').appendChild(b);});
    say(RT.read[lang]);}
}
const wordHTML=(w,tap)=>w.parts.map((p,i)=>`<span style="color:${RCOL[i%2]}" class="${tap?'tp':''}">${p.t}</span>`).join('');

/* ---------- BUILD: tiles on a track, slide them together ---------- */
function buildTrack(w){
  const tr=$('readTrack'),n=w.parts.length,rd=RD;
  tr.innerHTML='<div id="readHand">👆</div>';
  RD.tiles=w.parts.map((p,i)=>{const d=document.createElement('div');d.className='rTile'+(p.cons?' cons':'');d.textContent=p.t;
    d.style.color=w.syl?'var(--ink)':RCOL[i%2];tr.appendChild(d);return {el:d,p,x:0,w:0,g:i};});
  requestAnimationFrame(()=>{if(RD!==rd)return;const W=tr.clientWidth,ws=RD.tiles.map(t=>t.el.offsetWidth),sum=ws.reduce((a,b)=>a+b,0);
    const gap=Math.max(18,Math.min(130,(W-sum-20)/(n-1||1)));let x=(W-sum-gap*(n-1))/2;
    RD.tiles.forEach((t,i)=>{t.w=ws[i];t.x=x;x+=t.w+gap;});readPlace();readGaps();});
  RD.tiles.forEach((t,i)=>{
    t.el.onpointerdown=e=>{e.preventDefault();ac();try{t.el.setPointerCapture(e.pointerId);}catch(_){}RD.drag={i,x0:e.clientX,moved:false,start:RD.tiles.map(q=>q.x)};readHint(false);};
    t.el.onpointermove=e=>{const D=RD.drag;if(!D||D.i!==i)return;const dx=e.clientX-D.x0;if(Math.abs(dx)>6)D.moved=true;if(!D.moved)return;readMove(i,dx);};
    t.el.onpointerup=t.el.onpointercancel=()=>{const D=RD.drag;if(!D||D.i!==i)return;RD.drag=null;
      if(!D.moved){const grp=RD.tiles.filter(q=>q.g===t.g),lw=(LETTERWORD[lang]||{})[t.p.t];
        if(t.p.cons&&grp.length===1&&lw)sayAt(lang==='de'?`${t.p.t.toUpperCase()} wie ${lw[1]}`:`${t.p.t}, de ${lw[1]}`,0.75);   // a lone consonant: its sound word
        else sayAt(grp.map(q=>q.p.say).join(''),0.6);                                                                     // a tap reads the piece
        t.el.classList.remove('hop');void t.el.offsetWidth;t.el.classList.add('hop');}
      readSnap();};});
  readHint(true);
}
function readPlace(){RD.tiles.forEach(t=>{t.el.style.transform=`translateX(${t.x}px)`;});}
/* move the dragged tile's whole group; groups keep their order and stop at their neighbours */
function readMove(i,dx){
  const T=RD.tiles,g=T[i].g,mine=T.filter(t=>t.g===g),D=RD.drag;
  const first=T.indexOf(mine[0]),last=T.indexOf(mine[mine.length-1]);
  const lo=first>0?T[first-1].x+T[first-1].w-D.start[first]:-D.start[first]+4;
  const hi=last<T.length-1?T[last+1].x-(D.start[last]+T[last].w):$('readTrack').clientWidth-(D.start[last]+T[last].w)-4;
  const d=Math.max(lo,Math.min(hi,dx));mine.forEach(t=>{t.x=D.start[T.indexOf(t)]+d;});readPlace();
  if(d===lo&&first>0)readJoin(first-1,first);else if(d===hi&&last<T.length-1)readJoin(last,last+1);
}
function readSnap(){const T=RD.tiles;for(let k=0;k<T.length-1;k++)if(T[k].g!==T[k+1].g&&T[k+1].x-(T[k].x+T[k].w)<26){readJoin(k,k+1);return;}readGaps();}
function readJoin(a,b){
  const T=RD.tiles;if(T[a].g===T[b].g)return;const ga=T[a].g,gb=T[b].g;
  T.forEach(t=>{if(t.g===gb)t.g=ga;});RD.drag=null;
  // close the gap: the right group slides onto the left one
  let x=T[a].x+T[a].w;T.slice(b).filter(t=>t.g===ga).forEach(t=>{t.x=x;x+=t.w;});readPlace();
  beep(660,0,0.08,'triangle',0.16);beep(990,0.07,0.1,'triangle',0.14);
  T.filter(t=>t.g===ga).forEach(t=>t.el.classList.add('joined'));
  readGaps();
  if(T.every(t=>t.g===T[0].g))readBuilt();
  else{const grp=T.filter(t=>t.g===ga);sayAt(grp.map(q=>q.p.say).join(''),0.6);}
}
/* arrows between groups; tapping one pulls the two together (for a child who taps rather than drags) */
function readGaps(){
  const tr=$('readTrack');tr.querySelectorAll('.rGap').forEach(e=>e.remove());const T=RD.tiles;
  for(let k=0;k<T.length-1;k++)if(T[k].g!==T[k+1].g){const L=T[k].x+T[k].w,R=T[k+1].x;if(R-L<14)continue;
    const a=document.createElement('button');a.className='rGap';a.textContent='⟷';a.style.left=(L+R)/2+'px';
    a.onclick=()=>{ac();readHint(false);readJoin(k,k+1);};tr.appendChild(a);}
}
function readBuilt(){
  if(RD.done)return;RD.done=true;readHint(false);const w=RD.word,T=RD.tiles;
  // centre the finished word, then read it slowly piece by piece and once more as a whole
  const tr=$('readTrack'),tot=T.reduce((s,t)=>s+t.w,0);let x=(tr.clientWidth-tot)/2;T.forEach(t=>{t.x=x;x+=t.w;});readPlace();
  if(w.syl)T.forEach(t=>{t.el.style.color=RCOL[0];});
  const whole=w.syl?w.text:w.parts.map(p=>p.t).join('');
  setTimeout(()=>readSaySlow(w.syl?[{say:w.text}]:w.parts,whole,k=>{T.forEach((t,i)=>t.el.classList.toggle('lit',i===k||(w.syl&&k===0)));},()=>{
    T.forEach(t=>t.el.classList.remove('lit'));$('readPic').classList.add('show');bigWin();award(0);adapt('read',4,true);
    readT=setTimeout(()=>{if(activeTab==='read')readRound();},2200);}),350);
}
/* a ghost hand that shows the sliding until the child has tried */
function readHint(on){const h=$('readHand');if(!h)return;if(!on){h.classList.remove('on');clearTimeout(RD&&RD.hintT);return;}
  const rd=RD;RD.hintT=setTimeout(()=>{if(RD!==rd||!RD.tiles||RD.done||activeTab!=='read')return;const T=RD.tiles,k=T.findIndex((t,i)=>i&&t.g!==T[i-1].g);if(k<1)return;
    h.style.setProperty('--x0',(T[k].x+T[k].w/2)+'px');h.style.setProperty('--x1',(T[k-1].x+T[k-1].w)+'px');h.classList.add('on');},3500);}

/* ---------- HEAR and READ answers ---------- */
function readPick(ok,el,o){
  ac();if(RD.done)return;
  if(ok){RD.done=true;el.classList.add('right');bigWin();award(RD.miss);levelFx($('readPrompt'),adapt('read',4,RD.miss===0));
    const w=RD.word;
    if(RD.kind==='read')readSaySlow(w.parts,w.text,k=>$('readWord').querySelectorAll('span').forEach((s,i)=>s.classList.toggle('lit',i===k)));
    else sayAt(w.text,0.7);
    readT=setTimeout(()=>{if(activeTab==='read')readRound();},RD.kind==='read'?3600:2200);}
  else{RD.miss++;nope();el.classList.remove('wrong');void el.offsetWidth;el.classList.add('wrong');
    const w=RD.word;
    if(RD.kind==='read'){if(RD.miss>=2)readSaySlow(w.parts,null,k=>$('readWord').querySelectorAll('span').forEach((s,i)=>s.classList.toggle('lit',i===k)));
      if(RD.miss>=3)[...$('readGrid').children].forEach(b=>{if(b.textContent===w.pic)b.classList.add('hint');});}
    else{sayAt(w.text,0.55);if(RD.miss>=2)[...$('readGrid').children].forEach((b,i)=>{if(RD.opts[i]===w.text||RD.opts[i]===w)b.classList.add('hint');});}}
}
$('readHear').onclick=()=>{ac();if(!RD)return;const w=RD.word;
  if(RD.kind==='read')readSaySlow(w.parts,null,k=>$('readWord').querySelectorAll('span').forEach((s,i)=>s.classList.toggle('lit',i===k)));
  else if(RD.kind==='hearSyl'||RD.kind==='hearWord')sayAt(w.text,0.6);
  else say(RT[RD.kind==='buildSyl'?'buildSyl':'build'][lang]);};
$('readNext').onclick=()=>{ac();readRound();};
function showRead(){readRound();}
