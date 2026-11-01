/* =============================================================
   3. VOICE
============================================================= */
const LANGTAG={es:'es-ES',en:'en-US',de:'de-DE'};
const IS_ANDROID=/Android/i.test(navigator.userAgent);
let voices=[],speechReady=false,keepAlive=null,lang='de';
function loadVoices(){try{voices=speechSynthesis.getVoices()||[];}catch(e){}}
if('speechSynthesis' in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices;}
/* Voice quality is whatever the device has installed. Prefer, in order:
   the voice chosen in the parent panel; Apple "Premium"/"Enhanced" and
   Siri voices; Google/Microsoft neural or online voices. Never Apple's
   novelty voices (Albert, Bubbles, Zarvox…) or the eSpeak/Pico robots. */
const NOVELTY=/\b(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|ralph|fred|kathy|deranged|hysterical|pipe organ|grandpa|grandma|rocko|shelley|reed|sandy|eddy|flo)\b/;
function voiceScore(v,L){
  const n=((v.name||'')+' '+(v.voiceURI||'')).toLowerCase(),l=(v.lang||'').replace('_','-').toLowerCase();let s=0;
  if(/premium/.test(n))s+=14; if(/enhanced|erweitert|mejorad/.test(n))s+=10; if(/siri/.test(n))s+=9;
  if(/neural|natural|wavenet|online/.test(n))s+=8; if(/google/.test(n))s+=5; if(!v.localService)s+=4;
  if(l===LANGTAG[L||lang].toLowerCase())s+=3; if(/compact|espeak|pico/.test(n))s-=10; if(NOVELTY.test(n))s-=30;
  return s;
}
function langVoices(L){L=L||lang;
  if(!voices.length) loadVoices();
  return voices.filter(v=>v.lang&&v.lang.replace('_','-').toLowerCase().startsWith(L)).sort((a,b)=>voiceScore(b,L)-voiceScore(a,L));
}
function pickVoice(L){L=L||lang;
  const list=langVoices(L);let want='';try{want=localStorage.getItem('sl_voice_'+L)||'';}catch(e){}
  return (want&&list.find(v=>v.voiceURI===want))||list[0]||null;
}
function utter(text,isRetry,rate,L,done){
  const synth=speechSynthesis;
  const u=new SpeechSynthesisUtterance(text);
  u.lang=LANGTAG[L||lang]; u.rate=rate||0.72; u.pitch=1.0; u.volume=1;
  const v=pickVoice(L); if(v) u.voice=v;
  u.onstart=()=>{speechReady=true;hideWarn();clearInterval(keepAlive);
    keepAlive=setInterval(()=>{try{synth.resume();}catch(e){}},4000);
    if(typeof done==='function')done('start');};
  u.onend=()=>{clearInterval(keepAlive); if(typeof done==='function')done('end');};
  u.onerror=e=>{clearInterval(keepAlive);
    if(e&&(e.error==='interrupted'||e.error==='canceled')){if(typeof done==='function')done('interrupted');return;}
    showWarn(); if(typeof done==='function')done('error');};
  try{synth.resume();synth.speak(u);}catch(e){showWarn();if(typeof done==='function')done('error');return;}
  if(!isRetry) setTimeout(()=>{
    if(!synth.speaking&&!synth.pending){loadVoices();
      const u2=new SpeechSynthesisUtterance(text);
      u2.lang=u.lang;u2.rate=u.rate;u2.pitch=u.pitch;u2.volume=u.volume;
      if(u.voice)u2.voice=u.voice;
      u2.onstart=u.onstart;u2.onend=u.onend;u2.onerror=u.onerror;
      try{synth.resume();synth.speak(u2);}catch(e){}}
  },450);
}
let rewardOpen=false;                 // while the prize pop-up is up, nothing else talks over it
let appStarted=false;                 // nothing is spoken before the "tap to start" (no letters chattering behind the start screen)
function sayAt(text,rate,force){
  bridgeStop();
  if(!appStarted) return;
  if(rewardOpen&&!force) return;
  if(!('speechSynthesis' in window)){showWarn();return;}
  const synth=speechSynthesis;
  try{
    const busy=synth.speaking||synth.pending;
    if(busy) synth.cancel();
    if(busy||IS_ANDROID) setTimeout(()=>utter(text,false,rate),130); else utter(text,false,rate);
  }catch(e){showWarn();}
}
function say(text){ sayAt(text,0.72); }
/* Word bridge: the same word in each ticked language, current language first,
   each with its own voice. Lessons stay monolingual; this is only for
   collecting and celebrating. sl_bridge is separate from sl_langs. */
var BRIDGE=['de','en','es'];
/* the flags offered next to a word: the bridge languages (set by a parent), minus the one being spoken */
function flagLangs(){return ['de','en','es'].filter(c=>c!==lang&&(BRIDGE||[]).includes(c));}
const BRIDGE_MARK={es:'🇪🇸',en:'🇬🇧',de:'🇩🇪'};
let bridgeGen=0,bridgeTimer=0,chainWatch=0;
function bridgeStop(){bridgeGen++;clearTimeout(bridgeTimer);clearTimeout(chainWatch);const el=document.getElementById('bridgeTag');if(el)el.classList.remove('on');}
/* How long a line may take. Generous on purpose: a new language voice on
   iPhone can spend a second just starting, and a too-short timer was cutting
   the second and third names off. The cap only moves the chain on if the
   phone never says the line ended; it does not call cancel(). */
function chainBudget(text){return Math.min(16000,2400+String(text||'').length*120);}
/* Speak one line and call done after it has really finished, plus a short
   pause. Does not cancel whatever is already speaking. An onend that arrives
   before the voice could have said the words (an iOS quirk) is ignored. */
function speakChained(text,L,rate,done,gen){
  gen=gen||bridgeGen;
  let settled=false,didStart=false,startedAt=0,extra=0;
  const finish=()=>{
    if(settled||gen!==bridgeGen)return;
    settled=true;clearTimeout(chainWatch);
    bridgeTimer=setTimeout(()=>{if(gen===bridgeGen&&done)done();},320);
  };
  const arm=ms=>{
    clearTimeout(chainWatch);
    chainWatch=setTimeout(()=>{
      if(settled||gen!==bridgeGen)return;
      let speaking=false;
      try{speaking=speechSynthesis.speaking||speechSynthesis.pending;}catch(e){}
      if(speaking&&extra<4){extra++;arm(1500);return;} // still talking: wait, never cancel
      finish();
    },ms);
  };
  utter(text,true,rate,L,why=>{
    if(gen!==bridgeGen||settled)return;
    if(why==='start'){didStart=true;startedAt=performance.now();return;}
    if(why==='interrupted')return;
    if(why==='end'){
      const elapsed=didStart?performance.now()-startedAt:0;
      if(!didStart||elapsed<240)return; // too early to be the real end
      finish();
    }else finish(); // the engine could not speak it
  });
  arm(chainBudget(text));
}
/* A new line the child just asked for. If something is already talking,
   stop that, then wait a moment: on iPhone, speak() straight after cancel()
   is itself cut off. */
function speakFresh(text,L,rate,done){
  let busy=false;
  try{busy=speechSynthesis.speaking||speechSynthesis.pending;}catch(e){}
  bridgeStop();
  if(busy){try{speechSynthesis.cancel();}catch(e){}}
  const gen=bridgeGen;
  bridgeTimer=setTimeout(()=>{
    if(gen!==bridgeGen)return;
    speakChained(text,L,rate,done||function(){},gen);
  },busy?200:0);
}
function bridgeOrder(prefer){
  prefer=prefer||lang;
  const on=(BRIDGE||[]).filter(c=>c==='es'||c==='en'||c==='de');
  const rest=['es','en','de'].filter(c=>on.includes(c)&&c!==prefer);
  if(on.includes(prefer))return [prefer,...rest];
  const list=['es','en','de'].filter(c=>on.includes(c));
  return list.length?list:[prefer];
}
function sayWordBridge(words,opt){
  opt=opt||{};
  if(!appStarted)return;
  if(rewardOpen&&!opt.force)return;
  const prefer=opt.prefer||lang;
  const tidy=s=>(s||'').replace(/^[¡¿\s]+/,'').replace(/[!?¡¿.\s]+$/,'').trim();
  const seq=[];
  bridgeOrder(prefer).forEach(L=>{
    const name=tidy(words&&words[L]);
    if(!name&&!(opt.lead&&L===prefer))return;
    seq.push({L,speak:(opt.lead&&L===prefer)?opt.lead:name,label:name||opt.lead});
  });
  if(opt.lead&&!seq.some(s=>s.L===prefer))seq.unshift({L:prefer,speak:opt.lead,label:tidy(words&&words[prefer])||opt.lead});
  if(!seq.length)return;
  let busy=false;
  try{busy=speechSynthesis.speaking||speechSynthesis.pending;}catch(e){}
  bridgeStop();
  const gen=bridgeGen;
  /* Only the line he just left is cancelled, and not in the same breath as
     the next speak(): iPhone applies cancel() late and chops the new voice. */
  if(busy){try{speechSynthesis.cancel();}catch(e){}}
  const tag=document.getElementById('bridgeTag');
  const step=i=>{
    if(gen!==bridgeGen)return;
    if(i>=seq.length){if(tag)tag.classList.remove('on');if(opt.then)opt.then();return;}
    const s=seq[i];
    if(tag){tag.textContent=BRIDGE_MARK[s.L]+' '+s.label;tag.classList.add('on');}
    speakChained(s.speak,s.L,0.72,()=>step(i+1),gen);
  };
  bridgeTimer=setTimeout(()=>{if(gen===bridgeGen)step(0);},busy?200:0);
}
/* "Hund… perro": the word in the current language, then the Spanish word read by a Spanish voice */
function sayBridge(own,es,rate){
  sayAt(own,rate||0.72);
  setTimeout(()=>{if(!rewardOpen)try{utter(es,true,rate||0.72,'es');}catch(e){}},IS_ANDROID?260:140);
}
function showWarn(msg){
  const w=document.getElementById('voiceWarn');
  w.textContent=msg||{
    es:'🔇 Sin voz. Ajustes → Idiomas → Síntesis de voz → instala la voz. Sube el volumen multimedia.',
    en:'🔇 No voice. Settings → Languages → Text-to-speech → install voice data. Raise the media volume.',
    de:'🔇 Keine Stimme. Einstellungen → Sprachen → Sprachausgabe → Sprachdaten installieren. Medienlautstärke erhöhen.'}[lang];
  w.style.display='block';
}
function hideWarn(){document.getElementById('voiceWarn').style.display='none';}

/* =============================================================
   4. SOUND FX
============================================================= */
let AC=null;
function ac(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();
  if(AC.state==='suspended'){const p=AC.resume();if(p&&p.catch)p.catch(function(){});}}catch(e){} return AC;}
function beep(f,when,dur=0.14,type='triangle',vol=0.22){
  const a=ac(); if(!a)return;
  const o=a.createOscillator(),g=a.createGain();
  o.type=type;o.frequency.value=f;o.connect(g);g.connect(a.destination);
  const t=a.currentTime+when;
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.02);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.start(t);o.stop(t+dur+0.02);
}
function noise(dur=0.25,vol=0.16){
  const a=ac(); if(!a)return;
  const n=Math.floor(a.sampleRate*dur),buf=a.createBuffer(1,n,a.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.5);
  const s=a.createBufferSource();s.buffer=buf;
  const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=1400;
  const g=a.createGain();g.gain.value=vol;
  s.connect(f);f.connect(g);g.connect(a.destination);s.start();
}
const blip=()=>beep(900+Math.random()*220,0,0.05,'square',0.07);
const strokeDone=()=>{beep(520,0,0.1,'square',0.16);beep(780,0.08,0.16,'square',0.16);noise(0.15,0.08);};
const bigWin=()=>{[392,523,659,784,1047].forEach((f,i)=>beep(f,i*0.09,0.3,'square',0.2));noise(0.5,0.22);};
const nope=()=>{beep(150,0,0.14,'sawtooth',0.10);if(typeof mascot==='function')mascot('hmm',1400);};
