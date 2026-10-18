/* =============================================================
   9. TABS / LANGUAGE / PARENT
============================================================= */
const TABS=[
  {id:'adv',   icon:'🗺️', es:'Aventura',en:'Adventure',de:'Abenteuer'},
  {id:'trace', icon:'✍️', es:'Escribir',en:'Write',   de:'Schreiben'},
  {id:'words', icon:'🖼️', es:'Palabras',en:'Words',   de:'Wörter'},
  {id:'ear',   icon:'👂', es:'Escucha', en:'Listen',  de:'Hören'},
  {id:'act',   icon:'🦖', es:'Dino Show',en:'Dino Show',de:'Dino-Show'},
  {id:'space', icon:'🪐', es:'Espacio', en:'Space',   de:'Weltall'},
  {id:'city',  icon:'🏙️', es:'Ciudad',  en:'Town',    de:'Stadt'},
  {id:'geo',   icon:'🌍', es:'Mundo',   en:'World',   de:'Welt'},
  {id:'dig',   icon:'🎁', es:'Premios', en:'Prizes',  de:'Preise'}
];
const ALLVIEWS=['home','adv','trace','words','ear','act','city','space','geo','dig','parent'];
activeTab='trace';                 // declared in core.js so early animation loops can read it
/* The home screen: one big card per section. 🏠 in the header always comes back here. */
const CARD_COL={adv:['#FFB938','#FF8A3D'],trace:['#FF7A7A','#E8445A'],words:['#4FC3F7','#2F7FE0'],ear:['#B58CFF','#7A5AE0'],
  act:['#6FD86A','#2EA84F'],city:['#3DD6C0','#1C9E9A'],geo:['#4FD1F5','#2A8BD0'],space:['#7A7FF0','#4A3FB8'],dig:['#FF8FC8','#E0559A']};
function buildHome(){
  const box=$('homeGrid');box.innerHTML='';
  $('homeHello').textContent=kidName?{es:'¡Hola, ',en:'Hi, ',de:'Hallo, '}[lang]+kidName+'!':{es:'¿Qué jugamos?',en:'What shall we play?',de:'Was spielen wir?'}[lang];
  TABS.forEach(t=>{
    const b=document.createElement('button'),c=CARD_COL[t.id];
    b.className='hcard'+(t.id==='adv'?' wide':'')+(t.id==='dig'&&power>=DIG_COST?' ready':'');b.dataset.id=t.id;
    b.style.background=`linear-gradient(150deg,${c[0]},${c[1]})`;b.style.setProperty('--edge',c[1]);
    let extra='';
    if(t.id==='adv'&&ADV)extra=ADV.done?'✅':`${ADV.idx+1} / ${ADV.plan.length}`;
    if(t.id==='dig')extra=power>=DIG_COST?'🎁 !':`${power} / ${DIG_COST} ⚡`;
    if(t.id==='city'&&window.CITY)extra='🐾 '+CITY.FOUND.size+' / '+CITY.total();
    b.innerHTML=`<span class="hi">${t.icon}</span><span class="hl">${t[lang]}</span>${extra?`<span class="hx">${extra}</span>`:''}`;
    b.setAttribute('aria-label',t[lang]);
    b.onclick=()=>{ac();say(t[lang]);showTab(t.id);};
    box.appendChild(b);
  });
}
$('homeBtn').onclick=()=>{ac();if(activeTab!=='home')showTab('home');};
function showTab(id){
  activeTab=id;$('homeBtn').classList.toggle('on',id==='home');if(id==='home')buildHome();window.scrollTo(0,0);if(typeof renderAdvBar==='function')renderAdvBar();
  const vEl=document.getElementById('v-'+id);if(vEl)vEl.scrollTop=0;
  ALLVIEWS.forEach(v=>document.getElementById('v-'+v).classList.toggle('on',v===id));
  if(id==='adv'){renderAdv();}
  if(id==='trace'){fit();sayCurrent();}
  if(id==='words'){buildChips();if(!target)newRound();else sayPrompt();}
  if(id==='ear'){newEarRound();}
  if(id==='act'){showAct();}
  if(id==='space'){fitSky();selectPlanet(selected);}
  if(id==='geo'){showGeo();}
  if(id==='city'){CITY.show();}
  if(id==='dig'){if(pane==='digLock')showDigLock();else resumeGame();}
  if(id==='parent'){renderParent();}
}
function setLang(code,btn){
  lang=code;
  document.querySelectorAll('.lang button').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');ac();
  if(activeTab==='home')buildHome();gateText();
  if(mode==='abc')playlist=ALPHA[lang];
  else if(mode==='ABC')playlist=CAPS[lang];
  if(!playlist.includes(cur))cur=playlist[0];
  resetTrace();buildBar();
  if(activeTab==='trace')sayCurrent();
  else if(activeTab==='words'){buildChips();newRound();}
  else if(activeTab==='ear')newEarRound();
  else if(activeTab==='act')showAct();
  else if(activeTab==='space')selectPlanet(selected);
  else if(activeTab==='geo'){if(GEO.mode!=='explore')setGeoMode(GEO.mode);else showGeo();}
  else if(activeTab==='city')CITY.onLang();
  else if(activeTab==='home'){}
  else if(activeTab==='dig'){if(pane==='digLock')showDigLock();}
  else if(activeTab==='adv')renderAdv();
  else renderParent();
}
['es','en','de'].forEach(c=>document.getElementById(c).onclick=e=>setLang(c,e.currentTarget));
/* Parents choose which languages the child may switch to. Switched-off flags
   disappear from the header; with only one language left the switch is hidden. */
let LANGS_ON=['de','en','es'];
try{const v=(localStorage.getItem('sl_langs')||'').split(',').filter(c=>['de','en','es'].includes(c));if(v.length)LANGS_ON=v;}catch(e){}
function applyLangs(){
  ['es','en','de'].forEach(c=>{$(c).style.display=LANGS_ON.includes(c)?'':'none';});
  document.querySelector('header .lang').style.display=LANGS_ON.length>1?'':'none';
  if(!LANGS_ON.includes(lang)){const c=LANGS_ON.includes('de')?'de':LANGS_ON[0];setLang(c,$(c));}
}
applyLangs();

function renderParent(){
  const L={es:['Nombre para la pestaña 🦸','Niveles','Palabras que más falla','Borrar'],
           en:['Name for the 🦸 tab','Levels','Most-missed words','Reset'],
           de:['Name für den 🦸 Tab','Level','Meist verfehlte Wörter','Zurücksetzen']}[lang];
  document.getElementById('pNameTitle').textContent=L[0];
  renderVoices();
  /* ---- this week ---- */
  $('pReportTitle').textContent={es:'📊 Esta semana',en:'📊 This week',de:'📊 Diese Woche'}[lang];
  const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d);}
  const key=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
  const recs=days.map(d=>LOG[key(d)]||{sec:0,ok:0,miss:0,adv:0}),maxMin=Math.max(10,...recs.map(r=>r.sec/60));
  const loc={es:'es-ES',en:'en-GB',de:'de-DE'}[lang];
  $('repBars').innerHTML=recs.map((r,i)=>{const m=Math.round(r.sec/60);
    return `<div class="repDay${i===6?' today':''}"><span>${m?m+'′':''}</span><div class="repBar" style="height:${Math.round(m/maxMin*88)}px"></div></div>`;}).join('')+'';
  $('repBars').insertAdjacentHTML('afterend','');
  const labels=recs.map((r,i)=>{const t=r.ok+r.miss,acc=t?Math.round(r.ok/t*100)+'%':'–';
    return `<div>${days[i].toLocaleDateString(loc,{weekday:'short'})}<br><small>${acc}</small></div>`;}).join('');
  let lab=$('repLabels');if(!lab){lab=document.createElement('div');lab.id='repLabels';$('repBars').after(lab);}lab.innerHTML=labels;
  const wk=recs.reduce((a,r)=>({min:a.min+r.sec/60,adv:a.adv+(r.adv||0)}),{min:0,adv:0});
  const W={es:['seguras','aprendiendo','min en total','aventuras'],en:['known','learning','min in total','adventures'],de:['sicher','am Lernen','Min. insgesamt','Abenteuer']}[lang];
  $('repWords').innerHTML=`<b>${Math.round(wk.min)} ${W[2]} · 🗺️ ${wk.adv} ${W[3]}</b><br>`+
    [['🇩🇪','de'],['🇬🇧','en'],['🇪🇸','es']].map(([f,c])=>{const R=Object.values(SRS[c]||{});
      return `${f} ${W[0]}: <b>${R.filter(r=>r.b>=4).length}</b> · ${W[1]}: <b>${R.filter(r=>r.b>0&&r.b<=2).length}</b>`;}).join('<br>')+
    `<br><small>${{es:'% = acertadas a la primera',en:'% = right on the first try',de:'% = beim ersten Versuch richtig'}[lang]}</small>`;
  $('pLangTitle').textContent={es:'🗣️ Idiomas disponibles',en:'🗣️ Languages to choose from',de:'🗣️ Sprachen zur Auswahl'}[lang];
  const lgb=$('langBtns');lgb.innerHTML='';
  [['de','🇩🇪',{es:'Alemán',en:'German',de:'Deutsch'}],['en','🇬🇧',{es:'Inglés',en:'English',de:'Englisch'}],['es','🇪🇸',{es:'Español',en:'Spanish',de:'Spanisch'}]].forEach(([c,f,n])=>{
    const b=document.createElement('button'),on=LANGS_ON.includes(c);b.className='seg'+(on?' on':'');b.textContent=(on?'✅ ':'⛔ ')+f+' '+n[lang];
    b.onclick=()=>{ac();if(on&&LANGS_ON.length===1){$('langInfo').textContent={es:'Al menos un idioma tiene que quedar activo.',en:'At least one language has to stay on.',de:'Mindestens eine Sprache muss an bleiben.'}[lang];return;}
      LANGS_ON=on?LANGS_ON.filter(x=>x!==c):['de','en','es'].filter(x=>x===c||LANGS_ON.includes(x));
      try{localStorage.setItem('sl_langs',LANGS_ON.join(','));}catch(e){}applyLangs();renderParent();};
    lgb.appendChild(b);});
  $('langInfo').textContent={es:'Los idiomas apagados desaparecen de arriba.',en:'Languages switched off disappear from the top bar.',de:'Ausgeschaltete Sprachen verschwinden oben aus der Leiste.'}[lang];
  $('pLimitTitle').textContent={es:'⏰ Tiempo de juego al día',en:'⏰ Play time per day',de:'⏰ Spielzeit pro Tag'}[lang];
  const lb=$('limitBtns');lb.innerHTML='';
  [0,15,20,30,45].forEach(m=>{const b=document.createElement('button');b.className='seg'+(timeLimit===m?' on':'');
    b.textContent=m?m+' min':{es:'Sin límite',en:'No limit',de:'Kein Limit'}[lang];
    b.onclick=()=>{timeLimit=m;warned5=false;try{localStorage.setItem('sl_limit',String(m));}catch(e){}renderParent();};lb.appendChild(b);});
  $('limitInfo').textContent={es:'Hoy: ',en:'Today: ',de:'Heute: '}[lang]+Math.round(logDay().sec/60)+' min';
  $('pAdvTitle').textContent={es:'🗺️ Largo de la aventura diaria',en:'🗺️ Daily adventure length',de:'🗺️ Länge des täglichen Abenteuers'}[lang];
  const sz=$('advSizes');sz.innerHTML='';
  [['short',{es:'Corta (4)',en:'Short (4)',de:'Kurz (4)'}],['normal',{es:'Normal (6)',en:'Normal (6)',de:'Normal (6)'}],['long',{es:'Larga (8)',en:'Long (8)',de:'Lang (8)'}]].forEach(([k,l])=>{
    const b=document.createElement('button');b.className='seg'+(advSize===k?' on':'');b.textContent=l[lang];
    b.onclick=()=>{advSize=k;try{localStorage.setItem('sl_advsize',k);}catch(e){}if(ADV&&!ADV.started)advEnsure(true);renderParent();};sz.appendChild(b);});
  $('pBackupTitle').textContent={es:'💾 Copia de seguridad',en:'💾 Backup',de:'💾 Sicherung'}[lang];
  $('pBackupText').textContent={es:'Todo el progreso vive solo en este móvil. Guarda una copia de vez en cuando (Archivos, Drive, WhatsApp…) y cárgala en un móvil nuevo.',
    en:'All progress lives only on this phone. Save a copy now and then (Files, Drive, WhatsApp…) and load it on a new phone.',
    de:'Der ganze Fortschritt liegt nur auf diesem Handy. Ab und zu eine Kopie speichern (Dateien, Drive, WhatsApp…) und auf einem neuen Handy laden.'}[lang];
  $('pBackupText').textContent+=' '+(storageSafe?{es:'✅ Este móvil guarda el progreso de forma protegida.',en:'✅ This phone keeps the progress in protected storage.',de:'✅ Dieses Handy speichert den Fortschritt geschützt.'}[lang]:'');
  $('backupSave').textContent={es:'💾 Guardar',en:'💾 Save',de:'💾 Speichern'}[lang];
  $('backupLoad').textContent={es:'📂 Cargar',en:'📂 Load',de:'📂 Laden'}[lang];
  $('pLevelTitle').textContent={es:'Niveles automáticos (aciertos a la primera, últimas 20)',en:'Automatic levels (first-try right, last 20)',de:'Automatische Level (beim ersten Versuch richtig, letzte 20)'}[lang];
  document.getElementById('pMissTitle').textContent=L[2];
  document.getElementById('resetStats').textContent=L[3];
  document.getElementById('backBtn').textContent={es:'← Volver al juego',en:'← Back to the game',de:'← Zurück zum Spiel'}[lang];
  document.getElementById('nameInput').value=kidName;
  $('pPowerTitle').textContent={es:'Puntos de premio (40 ⚡ = 1 premio)',en:'Prize points (40 ⚡ = 1 prize)',de:'Preispunkte (40 ⚡ = 1 Preis)'}[lang];
  $('pPowerVal').textContent='⚡ '+power;
  const lr=document.getElementById('levelRows');lr.innerHTML='';
  const MN={words:'🖼️',ear:'👂',act:'🦖',space:'🪐',geo:'🌍'};
  [['🇪🇸','es'],['🇬🇧','en'],['🇩🇪','de']].forEach(([f,c])=>{
    const cells=Object.keys(MN).map(m=>{const r=skillRec(m,c),acc=r.h.length?Math.round(r.h.reduce((a,b)=>a+b,0)/r.h.length*100)+'%':'–';
      return `${MN[m]} ${level(m,SKILL_MAX[m],c)}/${SKILL_MAX[m]} <small>(${acc})</small>`;}).join(' &nbsp;');
    lr.insertAdjacentHTML('beforeend',`<div class="row"><span>${f}</span><span>${cells}</span></div>`);
  });
  const rows=Object.entries(stats).sort((a,b)=>b[1]-a[1]).slice(0,12);
  const mr=document.getElementById('missRows');
  mr.innerHTML=rows.length?rows.map(([k,v])=>{
    const [lc,w]=k.split('|');const f={es:'🇪🇸',en:'🇬🇧',de:'🇩🇪'}[lc]||'';
    return `<div class="row"><span>${f} ${w}</span><span>${v}×</span></div>`;
  }).join(''):'<div class="row"><span>—</span><span>0</span></div>';
}
document.getElementById('saveName').onclick=()=>{
  kidName=(document.getElementById('nameInput').value||'').trim();
  try{localStorage.setItem('sl_name',kidName);}catch(e){}
  if(mode==='name')setMode('name');
  beep(880,0,0.15,'square',0.2);
};
$('pPlus').onclick=()=>{power+=10;savePower();renderPower(true);renderParent();};
$('pZero').onclick=()=>{power=0;savePower();renderPower(true);renderParent();};
function renderVoices(){
  const sel=$('voiceSel'),list=langVoices(),cur=pickVoice();
  $('pVoiceTitle').textContent={es:'🔊 Voz (español)',en:'🔊 Voice (English)',de:'🔊 Stimme (Deutsch)'}[lang];
  sel.innerHTML=list.length?list.map(v=>`<option value="${v.voiceURI.replace(/"/g,'&quot;')}">${v.name} (${v.lang})${v.localService?'':' ☁'}</option>`).join('')
    :'<option>—</option>';
  if(cur)sel.value=cur.voiceURI;
  $('voiceTip').textContent={
    es:'La voz es la del móvil. Para que suene natural, instala una voz de alta calidad. iPhone: Ajustes → Accesibilidad → Contenido leído → Voces → elige una voz "Premium" o "Mejorada". Android: Ajustes → Idiomas → Síntesis de voz → Google → Instalar datos de voz. Luego elígela aquí.',
    en:'The voice is the phone\'s own. To sound natural, install a high-quality voice. iPhone: Settings → Accessibility → Spoken Content → Voices → pick a "Premium" or "Enhanced" voice. Android: Settings → Languages → Text-to-speech → Google → Install voice data. Then choose it here.',
    de:'Die Stimme kommt vom Handy. Für eine natürliche Stimme eine hochwertige Stimme installieren. iPhone: Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → eine „Premium“- oder „Erweitert“-Stimme laden. Android: Einstellungen → Sprachen → Sprachausgabe → Google → Sprachdaten installieren. Dann hier auswählen.'}[lang];
}
$('voiceSel').onchange=e=>{try{localStorage.setItem('sl_voice_'+lang,e.target.value);}catch(err){}
  say({es:'Hola, soy tu dinosaurio.',en:'Hello, I am your dinosaur.',de:'Hallo, ich bin dein Dinosaurier.'}[lang]);};
$('voiceTest').onclick=()=>{ac();say({es:'Hola, soy tu dinosaurio.',en:'Hello, I am your dinosaur.',de:'Hallo, ich bin dein Dinosaurier.'}[lang]);};
if('speechSynthesis' in window)speechSynthesis.addEventListener&&speechSynthesis.addEventListener('voiceschanged',()=>{if(activeTab==='parent')renderVoices();});
/* ---- backup: every sl_* key in one JSON file ---- */
function backupData(){const d={app:'the-little-explorer',v:1,saved:new Date().toISOString(),data:{}};
  try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('sl_'))d.data[k]=localStorage.getItem(k);}}catch(e){}
  return d;}
$('backupSave').onclick=async()=>{
  const d=backupData(),name='explorer-backup-'+d.saved.slice(0,10)+'.json';
  const blob=new Blob([JSON.stringify(d)],{type:'application/json'});
  const file=new File([blob],name,{type:'application/json'});
  try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:name});
      $('backupMsg').textContent='✅';return;}}catch(e){if(e&&e.name==='AbortError')return;}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},2000);$('backupMsg').textContent='✅ '+name;
};
$('backupLoad').onclick=()=>$('backupFile').click();
$('backupFile').onchange=e=>{
  const f=e.target.files&&e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{try{const d=JSON.parse(r.result);if(!d||!['the-little-explorer','noahs-exploration-game'].includes(d.app)||!d.data)throw 0;
      if(!confirm({es:'¿Reemplazar el progreso actual con esta copia?',en:'Replace the current progress with this backup?',de:'Aktuellen Fortschritt durch diese Sicherung ersetzen?'}[lang]))return;
      Object.keys(localStorage).filter(k=>k.startsWith('sl_')).forEach(k=>localStorage.removeItem(k));
      Object.entries(d.data).forEach(([k,v])=>{if(k.startsWith('sl_'))localStorage.setItem(k,v);});
      location.reload();
    }catch(err){$('backupMsg').textContent={es:'❌ Ese archivo no es una copia válida',en:'❌ That file is not a valid backup',de:'❌ Das ist keine gültige Sicherung'}[lang];}};
  r.readAsText(f);e.target.value='';
};
$('resetLevels').onclick=()=>{SKILL={};try{localStorage.removeItem('sl_skill');}catch(e){}renderParent();};
document.getElementById('resetStats').onclick=()=>{
  stats={};saveStats();renderParent();
};
try{kidName=localStorage.getItem('sl_name')||'';}catch(e){}

/* ---- buttons ---- */
document.getElementById('sayBtn').onclick=()=>{ac();sayCurrent();};
document.getElementById('againBtn').onclick=()=>{ac();resetTrace();sayCurrent();};
document.getElementById('nextBtn').onclick=()=>{ac();advance();};
document.getElementById('repeatBtn').onclick=()=>{ac();sayPrompt();};
document.getElementById('skipBtn').onclick=()=>{ac();newRound();};
/* 🔊 repeats the word; pressed again straight away, it says it slowly */
let earAgainT=0;
document.getElementById('earAgain').onclick=()=>{ac();const now=performance.now(),slow=now-earAgainT<4000;earAgainT=slow?0:now;earSay(slow?0.45:undefined);};
document.getElementById('earSkip').onclick=()=>{ac();newEarRound();};
(function(){
  const g=document.getElementById('gearBtn');
  // a parent HOLDS it for one second (the ring fills); a quick tap from a child just shows "hold"
  let timer=null,raf=null,t0=0;
  const fill=()=>{const p=Math.min(100,(performance.now()-t0)/10);g.style.setProperty('--hold',p+'%');if(p<100)raf=requestAnimationFrame(fill);};
  const start=()=>{t0=performance.now();fill();timer=setTimeout(()=>{stop();ac();showTab('parent');},1000);};
  const stop=()=>{clearTimeout(timer);cancelAnimationFrame(raf);
    if(performance.now()-t0<900&&activeTab!=='parent'){const tip=$('gearTip');
      tip.textContent={es:'⚙ Mantén pulsado (padres)',en:'⚙ Press and hold (parents)',de:'⚙ Gedrückt halten (Eltern)'}[lang];
      tip.classList.add('on');clearTimeout(tip._t);tip._t=setTimeout(()=>tip.classList.remove('on'),1600);}
    g.style.setProperty('--hold','0%');};
  g.addEventListener('pointerdown',e=>{e.preventDefault();start();});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>g.addEventListener(ev,()=>{if(timer)stop();timer=null;}));
})();
document.getElementById('backBtn').onclick=()=>{ac();showTab('home');};
document.getElementById('zoomIn').onclick=()=>{ac();setZoom(zoom*1.45);};
document.getElementById('zoomOut').onclick=()=>{ac();setZoom(zoom/1.45);};
document.getElementById('zoomReset').onclick=()=>{ac();zoom=1;camX=0;camY=0;};
document.getElementById('pauseBtn').onclick=()=>{ac();paused=!paused;
  document.getElementById('pauseBtn').textContent=paused?'▶':'⏸';};
document.getElementById('spaceQuizBtn').onclick=()=>{ac();spaceAsk();};
document.getElementById('spaceSayBtn').onclick=()=>{ac();
  if(spaceQuiz)say(spaceQText);
  else selectPlanet(selected);};

function gateText(){
  const T={es:['¡Toca para empezar!','Activa el sonido y la voz'],
           en:['Tap to start!','Turns on sound and voice'],
           de:['Tippe zum Starten!','Schaltet Ton und Stimme ein']}[lang];
  document.getElementById('gateText').textContent=T[0];
  document.getElementById('gateSub').textContent=T[1];
}
const gate=document.getElementById('gate');
function unlock(e){
  e.preventDefault();ac();loadVoices();
  gate.style.display='none';
  advEnsure();showTab('home');
  if(timeLimit&&logDay().sec>=(timeLimit+(logDay().extra||0))*60){goToSleep();return;}
  const hello=ADV.done?{es:'¡Hola! Ya has hecho tu aventura de hoy.',en:'Hi! You already did today\'s adventure.',de:'Hallo! Dein Abenteuer heute hast du schon geschafft.'}[lang]
    :{es:'¡Hola! ¿Empezamos la aventura?',en:'Hi! Shall we start the adventure?',de:'Hallo! Wollen wir das Abenteuer starten?'}[lang];
  say(hello);
  setTimeout(()=>{loadVoices();if(!speechReady)say(hello);},900);
  setTimeout(()=>{if(!speechReady)showWarn();},3000);
  fit();fitSky();
}
/* coming back to the app (switching apps, screen off) always lands on the home screen;
   games keep their state, so nothing is lost */
let hiddenAt=0;
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){hiddenAt=Date.now();return;}
  if(hiddenAt&&Date.now()-hiddenAt>2000&&gate.style.display==='none'&&activeTab!=='home'&&!$('sleep').classList.contains('on'))showTab('home');
  hiddenAt=0;
});
window.addEventListener('pageshow',e=>{if(e.persisted&&gate.style.display==='none'&&activeTab!=='home')showTab('home');});
gate.addEventListener('pointerdown',unlock,{once:true});
gate.addEventListener('click',unlock,{once:true});

/* ---- ask the browser to keep our saved progress even when the phone is low on space ---- */
let storageSafe=false;
if(navigator.storage&&navigator.storage.persist)
  navigator.storage.persisted().then(p=>p||navigator.storage.persist()).then(p=>{storageSafe=!!p;}).catch(()=>{});

/* ---- the page itself must never scroll (only the tabs' content does) ---- */
window.addEventListener('scroll',()=>{if(window.scrollY||window.scrollX)window.scrollTo(0,0);});
document.body.addEventListener('scroll',()=>{if(document.body.scrollTop)document.body.scrollTop=0;});

/* =============================================================
   DAILY ADVENTURE — a guided path through the learning tabs, so a
   four-year-old doesn't have to choose (and doesn't only pick his
   favourite). Each stop has a small goal; the path ends in a chest.
   The first adventure of the day pays a bonus.
============================================================= */
const ADV_GOAL={trace:2,words:4,ear:3,act:4};
const ADV_LEN={short:4,normal:6,long:8};
let ADV=null,advSize='normal';
try{ADV=JSON.parse(localStorage.getItem('sl_adv')||'null');advSize=localStorage.getItem('sl_advsize')||'normal';}catch(e){}
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();};
const advSave=()=>{try{localStorage.setItem('sl_adv',JSON.stringify(ADV));}catch(e){}};
function advPlan(){
  const n=ADV_LEN[advSize]||6,bag=['words','act','trace','ear','act','words','ear','trace'];
  let plan;do{plan=shuffle(bag).slice(0,n);}while(plan.some((t,i)=>i&&t===plan[i-1]));
  return plan.map(tab=>({tab,got:0}));
}
function advEnsure(fresh){
  if(fresh||!ADV||ADV.date!==today()||!ADV.plan)ADV={date:today(),plan:advPlan(),idx:0,started:false,done:false,bonus:ADV&&ADV.date===today()?ADV.bonus:false};
  advSave();
}
const advCur=()=>ADV&&!ADV.done?ADV.plan[ADV.idx]:null;
const TABICON=id=>(TABS.find(t=>t.id===id)||{}).icon||'⭐';
function renderAdv(){
  advEnsure();
  $('advTitle').textContent={es:'Tu aventura de hoy',en:"Today's adventure",de:'Dein Abenteuer heute'}[lang];
  const m=$('advMap'),n=ADV.plan.length,X=[28,72,34,70,30,68,36,70,50],stepY=92,H=60+(n+1)*stepY;
  m.style.height=H+'px';m.innerHTML='';
  const pts=ADV.plan.map((p,i)=>[X[i],50+i*stepY]).concat([[50,50+n*stepY]]);
  let d=`M ${pts[0][0]} ${pts[0][1]}`;
  for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],my=(a[1]+b[1])/2;d+=` C ${a[0]} ${my}, ${b[0]} ${my}, ${b[0]} ${b[1]}`;}
  m.insertAdjacentHTML('beforeend',`<svg viewBox="0 0 100 ${H}" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="#FFD400" stroke-width="2.4" stroke-dasharray="3 3" vector-effect="non-scaling-stroke" style="stroke-width:6px"/></svg>`);
  pts.forEach(([x,y],i)=>{
    const el=document.createElement('div');el.style.left=x+'%';el.style.top=y+'px';
    if(i===n){el.className='advStop chest';el.textContent=ADV.done?'🏆':'🎁';}
    else{const st=ADV.plan[i];el.className='advStop'+(i<ADV.idx||ADV.done?' done':i===ADV.idx?' now':'');el.textContent=TABICON(st.tab);
      if(i===ADV.idx&&!ADV.done)el.onclick=()=>{ac();advGo();};}
    m.appendChild(el);
    if((i===ADV.idx&&!ADV.done)||(i===n&&ADV.done)){const r=document.createElement('div');r.className='advRexi';r.textContent='🦖';r.style.left=x+'%';r.style.top=y+'px';m.appendChild(r);}
  });
  $('advGo').textContent=ADV.done?{es:'🏆 ¡Lo has conseguido!',en:'🏆 You did it!',de:'🏆 Geschafft!'}[lang]
    :ADV.idx?{es:'▶ ¡Seguimos!',en:'▶ Keep going!',de:'▶ Weiter!'}[lang]:{es:'▶ ¡Vamos!',en:"▶ Let's go!",de:"▶ Los geht's!"}[lang];
  $('advAgain').style.display=ADV.done?'block':'none';
  $('advAgain').textContent={es:'🔁 Otra aventura',en:'🔁 Another adventure',de:'🔁 Noch ein Abenteuer'}[lang];
}
function advGo(){
  if(ADV.done){say({es:'¡Lo has conseguido! ¡Hasta mañana!',en:'You did it! See you tomorrow!',de:'Geschafft! Bis morgen!'}[lang]);return;}
  ADV.started=true;advSave();
  const st=advCur();if(st.tab==='act'&&typeof actMode!=='undefined'&&actMode!=='quiz')actMode='quiz';
  showTab(st.tab);
}
function renderAdvBar(){
  const st=advCur(),bar=$('advBar');
  const on=!!(st&&ADV.started&&activeTab===st.tab);bar.classList.toggle('on',on);
  if(!on)return;const goal=ADV_GOAL[st.tab];
  bar.innerHTML=`🗺️ ${ADV.idx+1}/${ADV.plan.length} <span class="stars">${'⭐'.repeat(Math.min(st.got,goal))}${'☆'.repeat(Math.max(0,goal-st.got))}</span>`;
}
function advTick(tab){
  const st=advCur();if(!st||!ADV.started||st.tab!==tab)return;
  st.got++;advSave();renderAdvBar();
  if(st.got<ADV_GOAL[tab])return;
  ADV.idx++;if(ADV.idx>=ADV.plan.length)ADV.done=true;advSave();
  setTimeout(()=>{
    rainEmoji(['⭐','🗺️','✨'],16);[784,988,1175,1568].forEach((f,i)=>beep(f,i*0.09,0.2,'triangle',0.16));
    if(ADV.done){showTab('adv');setTimeout(advFinish,600);}
    else{say({es:'¡Parada conseguida! ¡Sigamos!',en:'Stop done! On we go!',de:'Station geschafft! Weiter geht\'s!'}[lang]);showTab('adv');}
  },2700);                                  // let the answer's own celebration finish first
}
function advFinish(){
  fanfare();rainEmoji(['🏆','⭐','🦖','🎉','✨'],34);
  if(!ADV.bonus){ADV.bonus=true;advSave();flyBolt(10,'+10⚡');addPowerQuiet(10);}
  say({es:'¡Aventura completada! ¡Eres un campeón!',en:'Adventure complete! You are a champion!',de:'Abenteuer geschafft! Du bist ein Champion!'}[lang]);
  logDay().adv++;logSave();
}
$('advGo').onclick=()=>{ac();advGo();};
$('advAgain').onclick=()=>{ac();advEnsure(true);renderAdv();say({es:'¡Una nueva aventura!',en:'A new adventure!',de:'Ein neues Abenteuer!'}[lang]);};
$('advBar').onclick=()=>{ac();showTab('adv');};

/* =============================================================
   DAILY LOG + TIME LIMIT. Minutes played and first-try right/wrong per
   day (for the parent report). With a limit set, Rexi warns at 5 minutes
   left, then falls asleep and the app rests until tomorrow; a parent can
   hold a button for 2 s to add 15 minutes.
============================================================= */
let LOG={};try{LOG=JSON.parse(localStorage.getItem('sl_log')||'{}');}catch(e){}
const logDay=()=>LOG[today()]||(LOG[today()]={sec:0,ok:0,miss:0,adv:0,extra:0});
const logSave=()=>{try{const keys=Object.keys(LOG).sort();while(keys.length>60)delete LOG[keys.shift()];
  localStorage.setItem('sl_log',JSON.stringify(LOG));}catch(e){}};
let timeLimit=0;try{timeLimit=+localStorage.getItem('sl_limit')||0;}catch(e){}
let warned5=false;
setInterval(()=>{
  if(document.hidden||gate.style.display!=='none'||$('sleep').classList.contains('on'))return;
  const d=logDay();d.sec+=5;logSave();
  if(!timeLimit)return;
  const left=(timeLimit+(d.extra||0))*60-d.sec;
  if(left<=300&&left>295-5&&!warned5){warned5=true;mascot('wave',2500);
    say({es:'¡Quedan cinco minutos!',en:'Five more minutes!',de:'Noch fünf Minuten!'}[lang]);}
  if(left<=0)goToSleep();
},5000);
function goToSleep(){
  if($('sleep').classList.contains('on'))return;
  closeRewardIfOpen();$('sleep').classList.add('on');
  $('sleepTitle').textContent={es:'¡Buenas noches!',en:'Good night!',de:'Gute Nacht!'}[lang];
  $('sleepSub').textContent={es:'Rexi está cansado. ¡Hasta mañana!',en:'Rexi is tired. See you tomorrow!',de:'Rexi ist müde. Bis morgen!'}[lang];
  $('sleepMore').textContent={es:'⚙ Padres: mantener 2 s para +15 min',en:'⚙ Parents: hold 2 s for +15 min',de:'⚙ Eltern: 2 s halten für +15 Min.'}[lang];
  say({es:'¡Buenas noches! Rexi está cansado. ¡Hasta mañana!',en:'Good night! Rexi is tired. See you tomorrow!',de:'Gute Nacht! Rexi ist müde. Bis morgen!'}[lang]);
  [523,440,392,330].forEach((f,i)=>beep(f,i*0.45,0.6,'sine',0.12));
  const cn=$('sleepCv');(function loop(){if(!$('sleep').classList.contains('on'))return;
    const r=cn.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2.5),w=Math.round(r.width*dpr);
    if(w&&cn.width!==w){cn.width=w;cn.height=w;}const g=cn.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);
    drawDino(g,r.width,r.width,{verb:'sleep'},performance.now()/1000);requestAnimationFrame(loop);})();
}
function closeRewardIfOpen(){if(rewardOpen)closeReward(false);}
(function(){const b=$('sleepMore');let t0=0,raf=0,timer=0;
  const fill=()=>{b.style.setProperty('--hold',Math.min(100,(performance.now()-t0)/20)+'%');raf=requestAnimationFrame(fill);};
  b.addEventListener('pointerdown',e=>{e.preventDefault();t0=performance.now();fill();
    timer=setTimeout(()=>{const d=logDay();d.extra=(d.extra||0)+15;logSave();warned5=false;$('sleep').classList.remove('on');
      cancelAnimationFrame(raf);b.style.setProperty('--hold','0%');},2000);});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>{clearTimeout(timer);cancelAnimationFrame(raf);b.style.setProperty('--hold','0%');}));
})();

/* ---- Rexi, the mascot: cheers on right answers, puzzles on misses, waves when tapped ---- */
const mascotCv=$('mascot'),mascotG=mascotCv.getContext('2d');
let mascotState='idle',mascotUntil=0,mascotRun=false;
const MASCOT_TABS=[];               // Rexi is switched off for now (too busy on screen); list tabs here to bring him back
function mascot(state,ms){mascotState=state;mascotUntil=performance.now()+(ms||1700);}
function mascotLoop(){
  const show=MASCOT_TABS.includes(activeTab)&&gate.style.display==='none'&&!rewardOpen;
  mascotCv.classList.toggle('on',show);
  if(show){
    const dpr=Math.min(window.devicePixelRatio||1,2.5),W=78,w=Math.round(W*dpr);
    if(mascotCv.width!==w){mascotCv.width=w;mascotCv.height=w;}
    const g=mascotG,now=performance.now(),t=now/1000;
    if(now>mascotUntil)mascotState='idle';
    g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,w,w);g.setTransform(dpr*W/100,0,0,dpr*W/100,0,0);
    g.save();g.translate(-8,-14);g.scale(1.16,1.16);
    const st={verb:{cheer:'jump',wave:'wave',hmm:'stand',idle:'stand'}[mascotState],noScene:1,seed:0,
              mood:mascotState==='hmm'?'surprised':mascotState==='cheer'?'happy':''};
    drawDino(g,100,100,st,t,true);g.restore();
    if(mascotState==='hmm')txt(g,'?',84,20,22,'#FFD400',0.15);
  }
  requestAnimationFrame(mascotLoop);
}
requestAnimationFrame(mascotLoop);
mascotCv.addEventListener('pointerdown',e=>{e.preventDefault();ac();mascot('wave',2200);
  say(pick({es:['¡Hola! Soy Rexi.','¡Tú puedes!','¡Sigue así!','¡Qué bien lo haces!'],
            en:['Hi! I am Rexi!','You can do it!','Keep going!','You are doing great!'],
            de:['Hallo! Ich bin Rexi!','Du schaffst das!','Weiter so!','Das machst du toll!']}[lang]));});

/* ---- installable app: offline cache + auto-update (only when served over http/https) ---- */
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))
  window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));

/* ---- boot ---- */
gateText();renderPower(false);setMode('abc');fit();fitSky();draw();drawSky();
