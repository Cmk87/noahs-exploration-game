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
const NOVELTY=/albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|ralph|fred|kathy|deranged|hysterical|pipe organ|grandpa|grandma|rocko|shelley|reed|sandy|eddy|flo/;
function voiceScore(v){
  const n=((v.name||'')+' '+(v.voiceURI||'')).toLowerCase(),l=(v.lang||'').replace('_','-').toLowerCase();let s=0;
  if(/premium/.test(n))s+=14; if(/enhanced|erweitert|mejorad/.test(n))s+=10; if(/siri/.test(n))s+=9;
  if(/neural|natural|wavenet|online/.test(n))s+=8; if(/google/.test(n))s+=5; if(!v.localService)s+=4;
  if(l===LANGTAG[lang].toLowerCase())s+=3; if(/compact|espeak|pico/.test(n))s-=10; if(NOVELTY.test(n))s-=30;
  return s;
}
function langVoices(){
  if(!voices.length) loadVoices();
  return voices.filter(v=>v.lang&&v.lang.replace('_','-').toLowerCase().startsWith(lang)).sort((a,b)=>voiceScore(b)-voiceScore(a));
}
function pickVoice(){
  const list=langVoices();let want='';try{want=localStorage.getItem('sl_voice_'+lang)||'';}catch(e){}
  return (want&&list.find(v=>v.voiceURI===want))||list[0]||null;
}
function utter(text,isRetry,rate){
  const synth=speechSynthesis;
  const u=new SpeechSynthesisUtterance(text);
  u.lang=LANGTAG[lang]; u.rate=rate||0.72; u.pitch=1.0; u.volume=1;
  const v=pickVoice(); if(v) u.voice=v;
  u.onstart=()=>{speechReady=true;hideWarn();clearInterval(keepAlive);
    keepAlive=setInterval(()=>{try{synth.resume();}catch(e){}},4000);};
  u.onend=()=>clearInterval(keepAlive);
  u.onerror=e=>{clearInterval(keepAlive); if(e&&e.error==='interrupted')return; showWarn();};
  try{synth.resume();synth.speak(u);}catch(e){showWarn();return;}
  if(!isRetry) setTimeout(()=>{
    if(!synth.speaking&&!synth.pending){loadVoices();
      const u2=new SpeechSynthesisUtterance(text);
      u2.lang=u.lang;u2.rate=rate||0.72;u2.pitch=1.0;u2.volume=1;
      u2.onstart=u.onstart;u2.onend=u.onend;u2.onerror=u.onerror;
      try{synth.resume();synth.speak(u2);}catch(e){}}
  },450);
}
let rewardOpen=false;                 // while the prize pop-up is up, nothing else talks over it
function sayAt(text,rate,force){
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
  if(AC.state==='suspended')AC.resume();}catch(e){} return AC;}
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
