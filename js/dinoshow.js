/* =============================================================
   ADJECTIVES, VERBS AND PHYSICAL COMMANDS
   Nouns work as flashcards because a noun is a picture. Adjectives
   are not — so every adjective round shows the SAME object twice,
   differing in exactly one property. He cannot win by recognising
   the object, only by parsing the word. Drawn on canvas rather than
   with emoji, because emoji leak clues through size and colour.
============================================================= */
const ADJ=[
 {k:'big',   es:['grande','pequeño'],      en:['big','small'],       de:['groß','klein']},
 {k:'long',  es:['largo','corto'],         en:['long','short'],      de:['lang','kurz']},
 {k:'full',  es:['lleno','vacío'],         en:['full','empty'],      de:['voll','leer']},
 {k:'open',  es:['abierto','cerrado'],     en:['open','closed'],     de:['offen','zu']},
 {k:'up',    es:['arriba','abajo'],        en:['up','down'],         de:['oben','unten']},
 {k:'happy', es:['contento','triste'],     en:['happy','sad'],       de:['fröhlich','traurig']},
 {k:'dirty', es:['sucio','limpio'],        en:['dirty','clean'],     de:['schmutzig','sauber']},
 {k:'many',  es:['muchos','pocos'],        en:['many','few'],        de:['viele','wenige'], plural:1},
 {k:'hot',   es:['caliente','frío'],       en:['hot','cold'],        de:['heiß','kalt']},
 {k:'fast',  es:['rápido','lento'],        en:['fast','slow'],       de:['schnell','langsam'], anim:1},
 {k:'loud',  es:['fuerte','silencioso'],   en:['loud','quiet'],      de:['laut','leise'], sound:1}
];
let actAnim=[];

/* ---- canvas drawings for the object adjective pairs ---- */
function drawAdj(cx2,W,H,key,yes,t){
  const g=cx2, cxp=W/2, cyp=H/2, U=Math.min(W,H);
  g.clearRect(0,0,W,H); g.lineJoin='round'; g.lineCap='round';
  const ink='#05060F';
  const disc=(x,y,r,col)=>{g.beginPath();g.arc(x,y,r,0,7);g.fillStyle=col;g.fill();
    g.lineWidth=3;g.strokeStyle=ink;g.stroke();};
  switch(key){
    case 'big': disc(cxp,cyp,U*(yes?0.36:0.14),'#FF3B30'); break;
    case 'long':{
      const w=U*(yes?0.78:0.28),h=U*0.16;
      g.fillStyle='#25B7FF';g.strokeStyle=ink;g.lineWidth=3;
      g.beginPath();g.roundRect(cxp-w/2,cyp-h/2,w,h,h/2);g.fill();g.stroke();break;}
    case 'full':{
      const w=U*0.34,h=U*0.46,x=cxp-w/2,y=cyp-h/2;
      const lv=yes?0.86:0.08;
      g.fillStyle='#FF8A00';g.fillRect(x+4,y+h-h*lv,w-8,h*lv-3);
      g.strokeStyle=ink;g.lineWidth=4;g.strokeRect(x,y,w,h);break;}
    case 'open':{
      const w=U*0.5,h=U*0.3,x=cxp-w/2,y=cyp;
      g.fillStyle='#C68A52';g.strokeStyle=ink;g.lineWidth=4;
      g.fillRect(x,y,w,h);g.strokeRect(x,y,w,h);
      g.save();g.translate(x,y);
      if(yes)g.rotate(-0.9);
      g.fillStyle='#8B5E32';g.fillRect(0,-U*0.07,w,U*0.07);
      g.strokeRect(0,-U*0.07,w,U*0.07);g.restore();break;}
    case 'up':{
      const y=yes?cyp-U*0.18:cyp+U*0.18;
      disc(cxp,y,U*0.14,'#FFD400');
      g.strokeStyle=ink;g.lineWidth=5;
      g.beginPath();g.moveTo(cxp,cyp+(yes?U*0.05:-U*0.05));
      g.lineTo(cxp,y+(yes?U*0.14:-U*0.14));g.stroke();
      g.beginPath();g.moveTo(cxp-U*0.3,cyp+U*0.34);g.lineTo(cxp+U*0.3,cyp+U*0.34);g.stroke();break;}
    case 'happy':{
      disc(cxp,cyp,U*0.3,'#FFD400');
      g.fillStyle=ink;
      g.beginPath();g.arc(cxp-U*0.1,cyp-U*0.08,U*0.035,0,7);g.fill();
      g.beginPath();g.arc(cxp+U*0.1,cyp-U*0.08,U*0.035,0,7);g.fill();
      g.strokeStyle=ink;g.lineWidth=5;g.beginPath();
      if(yes)g.arc(cxp,cyp+U*0.04,U*0.14,0.25*Math.PI,0.75*Math.PI);
      else g.arc(cxp,cyp+U*0.22,U*0.14,1.25*Math.PI,1.75*Math.PI);
      g.stroke();break;}
    case 'dirty':{
      const w=U*0.44,h=U*0.44;
      g.fillStyle='#fff';g.strokeStyle=ink;g.lineWidth=4;
      g.beginPath();g.roundRect(cxp-w/2,cyp-h/2,w,h,10);g.fill();g.stroke();
      if(yes){g.fillStyle='#7A5230';
        [[-.12,-.1,.07],[.1,.05,.05],[-.04,.14,.06],[.13,-.13,.04]].forEach(([a,b,r])=>{
          g.beginPath();g.arc(cxp+a*U,cyp+b*U,r*U,0,7);g.fill();});}
      break;}
    case 'many':{
      const n=yes?12:3;
      for(let i=0;i<n;i++){
        const a=i*2.399,rr=U*0.06+ (i/n)*U*0.26;
        disc(cxp+Math.cos(a)*rr,cyp+Math.sin(a)*rr,U*0.05,'#2ED17A');}
      break;}
    case 'hot':{
      const w=U*0.3,h=U*0.34;
      g.fillStyle=yes?'#FF7043':'#7EC8E3';g.strokeStyle=ink;g.lineWidth=4;
      g.beginPath();g.roundRect(cxp-w/2,cyp-h/4,w,h,8);g.fill();g.stroke();
      g.strokeStyle=yes?'#FF3B30':'#25B7FF';g.lineWidth=5;
      for(let i=-1;i<=1;i++){
        g.beginPath();
        if(yes){g.moveTo(cxp+i*U*0.09,cyp-U*0.16);
          g.quadraticCurveTo(cxp+i*U*0.09+U*0.06,cyp-U*0.26,cxp+i*U*0.09,cyp-U*0.36);}
        else{g.moveTo(cxp+i*U*0.09-U*0.04,cyp-U*0.24);g.lineTo(cxp+i*U*0.09+U*0.04,cyp-U*0.24);
          g.moveTo(cxp+i*U*0.09,cyp-U*0.28);g.lineTo(cxp+i*U*0.09,cyp-U*0.2);}
        g.stroke();}
      break;}
    case 'fast':{
      const sp=yes?2.4:0.55;
      const x=cxp+Math.sin(t*sp)*U*0.26;
      g.strokeStyle='rgba(5,6,15,.28)';g.lineWidth=4;
      for(let i=1;i<=3;i++){g.beginPath();
        g.moveTo(x-U*0.14-i*U*0.07,cyp-U*0.06+i*U*0.06);
        g.lineTo(x-U*0.05-i*U*0.07,cyp-U*0.06+i*U*0.06);g.stroke();}
      disc(x,cyp,U*0.13,'#7A3FF2');break;}
    case 'loud':{
      const amp=yes?1:0.36;
      disc(cxp-U*0.12,cyp,U*0.1,'#FFD400');
      g.strokeStyle=ink;g.lineWidth=4;
      for(let i=1;i<=3;i++){
        const on=yes?true:i===1;
        if(!on)continue;
        g.globalAlpha=0.35+0.25*i*amp+0.2*Math.abs(Math.sin(t*4));
        g.beginPath();g.arc(cxp-U*0.05,cyp,U*(0.1+i*0.09*amp+0.05),-0.8,0.8);g.stroke();}
      g.globalAlpha=1;break;}
  }
}
function makeCard(drawFn){
  const wrap=document.createElement('div'); wrap.className='acard';
  const cn=document.createElement('canvas');
  wrap.appendChild(cn);
  requestAnimationFrame(()=>{
    const r=cn.getBoundingClientRect();
    const dpr=Math.min(window.devicePixelRatio||1,3);
    cn.width=r.width*dpr; cn.height=r.height*dpr;
    const g=cn.getContext('2d'); g.setTransform(dpr,0,0,dpr,0,0);
    const rec={g,w:r.width,h:r.height,draw:drawFn};
    actAnim.push(rec);
    drawFn(g,r.width,r.height,0);
  });
  return wrap;
}
function animLoop(){
  const t=performance.now()/1000;
  if(activeTab==='act')actAnim.forEach(a=>{try{a.draw(a.g,a.w,a.h,t);}catch(e){}});
  requestAnimationFrame(animLoop);
}
requestAnimationFrame(animLoop);

/* =============================================================
   DINO SHOW — verbs and adjectives, acted out.
   Nouns are pictures; verbs and adjectives are not. So one cartoon
   dino ACTS them out. Within a round every card shows the same dino
   and changes only the thing being asked about, so he can only win
   by understanding the word. Every correct answer is echoed back as
   a full sentence ("Der kleine rote Dino springt!") so German verb
   endings, word order and adjective endings are heard in context
   again and again. 🎮 free play lets him build those sentences
   himself: pick how the dino looks, pick what it does, hear it.
============================================================= */
const DVERBS=[
 {k:'jump',  ic:'🤸',easy:1,es:'saltando',          en:'jumping',          de:['springt','springt'],               imp:{es:'Salta',en:'Jump',de:'Spring'},dp:'springen'},
 {k:'run',   ic:'🏃',easy:1,es:'corriendo',         en:'running',          de:['rennt','rennt'],                   imp:{es:'Corre',en:'Run',de:'Renn'},dp:'rennen'},
 {k:'walk',  ic:'🚶',       es:'andando',           en:'walking',          de:['geht','geht'],                     imp:{es:'Anda',en:'Walk',de:'Geh'},dp:'gehen'},
 {k:'sleep', ic:'😴',easy:1,es:'durmiendo',         en:'sleeping',         de:['schläft','schläft'],               imp:{es:'Duerme',en:'Sleep',de:'Schlaf'},dp:'schlafen'},
 {k:'eat',   ic:'🍎',easy:1,es:'comiendo',          en:'eating',           de:['isst','isst'],dp:'essen'},
 {k:'drink', ic:'🥤',easy:1,es:'bebiendo',          en:'drinking',         de:['trinkt','trinkt'],dp:'trinken'},
 {k:'swim',  ic:'🏊',easy:1,es:'nadando',           en:'swimming',         de:['schwimmt','schwimmt'],             imp:{es:'Nada',en:'Swim',de:'Schwimm'},dp:'schwimmen'},
 {k:'dance', ic:'💃',easy:1,es:'bailando',          en:'dancing',          de:['tanzt','tanzt'],                   imp:{es:'Baila',en:'Dance',de:'Tanz'},dp:'tanzen'},
 {k:'sing',  ic:'🎤',       es:'cantando',          en:'singing',          de:['singt','singt'],                   imp:{es:'Canta',en:'Sing',de:'Sing'},dp:'singen'},
 {k:'laugh', ic:'😂',easy:1,es:'riendo',            en:'laughing',         de:['lacht','lacht'],                   imp:{es:'Ríete',en:'Laugh',de:'Lach'},dp:'lachen'},
 {k:'cry',   ic:'😭',easy:1,es:'llorando',          en:'crying',           de:['weint','weint'],dp:'weinen'},
 {k:'wave',  ic:'👋',easy:1,es:'saludando',         en:'waving',           de:['winkt','winkt'],                   imp:{es:'Saluda',en:'Wave',de:'Wink'},dp:'winken'},
 {k:'fly',   ic:'🕊️',      es:'volando',           en:'flying',           de:['fliegt','fliegt'],                 imp:{es:'Vuela',en:'Fly',de:'Flieg'},dp:'fliegen'},
 {k:'read',  ic:'📖',       es:'leyendo',           en:'reading',          de:['liest','liest'],dp:'lesen'},
 {k:'paint', ic:'🎨',       es:'pintando',          en:'painting',         de:['malt','malt'],dp:'malen'},
 {k:'throw', ic:'⚾',       es:'tirando la pelota', en:'throwing the ball',de:['wirft den Ball','den Ball wirft'],dp:'werfen den Ball',dn:'wirft den Ball nicht'},
 {k:'catch', ic:'🧤',       es:'atrapando la pelota',en:'catching the ball',de:['fängt den Ball','den Ball fängt'],dp:'fangen den Ball',dn:'fängt den Ball nicht'},
 {k:'climb', ic:'🪜',       es:'trepando',          en:'climbing',         de:['klettert','klettert'],             imp:{es:'Trepa',en:'Climb',de:'Klettere'},dp:'klettern'},
 {k:'sit',   ic:'🪑',       es:'sentado',           en:'sitting',          de:['sitzt','sitzt'],                   imp:{es:'Siéntate',en:'Sit down',de:'Setz dich'},dp:'sitzen',ep:'sentados'},
 {k:'shower',ic:'🚿',       es:'duchándose',        en:'having a shower',  de:['duscht','duscht'],dp:'duschen'},
 {k:'sneeze',ic:'🤧',       es:'estornudando',      en:'sneezing',         de:['niest','niest'],                   imp:{es:'Estornuda',en:'Sneeze',de:'Nies'},dp:'niesen'},
 {k:'yawn',  ic:'🥱',       es:'bostezando',        en:'yawning',          de:['gähnt','gähnt'],                   imp:{es:'Bosteza',en:'Yawn',de:'Gähn'},dp:'gähnen'},
 {k:'cook',  ic:'🍳',       es:'cocinando',         en:'cooking',          de:['kocht','kocht'],dp:'kochen'},
 {k:'drum',  ic:'🥁',       es:'tocando el tambor', en:'playing the drum', de:['trommelt','trommelt'],             imp:{es:'Toca el tambor',en:'Play the drum',de:'Trommle'},dp:'trommeln'},
 {k:'dig',   ic:'⛏️',      es:'cavando',           en:'digging',          de:['gräbt','gräbt'],dp:'graben'},
 {k:'fish',  ic:'🎣',       es:'pescando',          en:'fishing',          de:['angelt','angelt'],dp:'angeln'},
 {k:'bike',  ic:'🚲',       es:'montando en bici',  en:'riding a bike',    de:['fährt Fahrrad','Fahrrad fährt'],dp:'fahren Fahrrad',dn:'fährt nicht Fahrrad'},
 {k:'teeth', ic:'🪥',es:'lavándose los dientes',en:'brushing its teeth',enp:'brushing their teeth',de:['putzt sich die Zähne','sich die Zähne putzt'],dp:'putzen sich die Zähne',dn:'putzt sich nicht die Zähne',imp:{es:'Lávate los dientes',en:'Brush your teeth',de:'Putz dir die Zähne'}},
 {k:'bubbles',ic:'🧼',es:'haciendo pompas',   en:'blowing bubbles',  de:['macht Seifenblasen','Seifenblasen macht'],dp:'machen Seifenblasen',dn:'macht keine Seifenblasen'},
 {k:'swing', ic:'🪢',es:'columpiándose',     en:'swinging',         de:['schaukelt','schaukelt'],dp:'schaukeln'},
 {k:'slide', ic:'🛝',es:'tirándose por el tobogán',en:'going down the slide',de:['rutscht','rutscht'],dp:'rutschen'},
 {k:'skate', ic:'🛹',es:'patinando',         en:'skateboarding',    de:['fährt Skateboard','Skateboard fährt'],dp:'fahren Skateboard',dn:'fährt nicht Skateboard'},
 {k:'ski',   ic:'🎿',es:'esquiando',         en:'skiing',           de:['fährt Ski','Ski fährt'],dp:'fahren Ski',dn:'fährt nicht Ski'},
 {k:'kick',  ic:'⚽',es:'chutando la pelota',en:'kicking the ball', de:['schießt den Ball','den Ball schießt'],dp:'schießen den Ball',dn:'schießt den Ball nicht'},
 {k:'water', ic:'🌷',es:'regando las flores',en:'watering the flowers',de:['gießt die Blumen','die Blumen gießt'],dp:'gießen die Blumen',dn:'gießt die Blumen nicht'},
 {k:'carry', ic:'📦',es:'llevando una caja', en:'carrying a box',   de:['trägt eine Kiste','eine Kiste trägt'],dp:'tragen eine Kiste',dn:'trägt keine Kiste'},
 {k:'sweep', ic:'🧹',es:'barriendo',         en:'sweeping',         de:['fegt','fegt'],dp:'fegen',imp:{es:'Barre',en:'Sweep',de:'Feg'}},
 {k:'push',  ic:'🛒',es:'empujando el carro',en:'pushing the cart', de:['schiebt den Wagen','den Wagen schiebt'],dp:'schieben den Wagen',dn:'schiebt den Wagen nicht'},
 {k:'pull',  ic:'🛷',es:'tirando del carro', en:'pulling the cart', de:['zieht den Wagen','den Wagen zieht'],dp:'ziehen den Wagen',dn:'zieht den Wagen nicht'},
 {k:'spin',  ic:'🌀',es:'dando vueltas',     en:'spinning',         de:['dreht sich','sich dreht'],dp:'drehen sich',dn:'dreht sich nicht',imp:{es:'Da vueltas',en:'Spin around',de:'Dreh dich'}},
 {k:'hide',  ic:'🌳',es:'escondiéndose',     en:'hiding',           de:['versteckt sich','sich versteckt'],dp:'verstecken sich',dn:'versteckt sich nicht',imp:{es:'Escóndete',en:'Hide',de:'Versteck dich'}},
 {k:'smell', ic:'🌸',es:'oliendo la flor',   en:'smelling the flower',de:['riecht an der Blume','an der Blume riecht'],dp:'riechen an der Blume',dn:'riecht nicht an der Blume'},
 {k:'guitar',ic:'🎸',es:'tocando la guitarra',en:'playing the guitar',de:['spielt Gitarre','Gitarre spielt'],dp:'spielen Gitarre',dn:'spielt nicht Gitarre',imp:{es:'Toca la guitarra',en:'Play the guitar',de:'Spiel Gitarre'}}
];
/* es: [word, copula] — ser for what it IS, estar for how it IS RIGHT NOW.
   de: the stem; endings are added for "der kleine" / "den kleinen". */
const DADJ=[
 {k:'big',      dim:'size', es:['grande','es'],       en:'big',      de:'groß',      st:{size:1.1}},
 {k:'small',    dim:'size', es:['pequeño','es'],      en:'small',    de:'klein',     st:{size:0.62}},
 {k:'happy',    dim:'mood', es:['contento','está'],   en:'happy',    de:'fröhlich',  st:{mood:'happy'}},
 {k:'sad',      dim:'mood', es:['triste','está'],     en:'sad',      de:'traurig',   st:{mood:'sad'}},
 {k:'angry',    dim:'mood', es:['enfadado','está'],   en:'angry',    de:'wütend',    st:{mood:'angry'}},
 {k:'scared',   dim:'mood', es:['asustado','está'],   en:'scared',   de:'ängstlich', st:{mood:'scared'}},
 {k:'surprised',dim:'mood', es:['sorprendido','está'],en:'surprised',de:'überrascht',st:{mood:'surprised'}},
 {k:'tired',    dim:'mood', es:['cansado','está'],    en:'tired',    de:'müde',      st:{mood:'tired'}},
 {k:'wet',      dim:'wet',  es:['mojado','está'],     en:'wet',      de:'nass',      st:{wet:1}},
 {k:'dry',      dim:'wet',  es:['seco','está'],       en:'dry',      de:'trocken',   st:{wet:-1}},
 {k:'dirty',    dim:'dirt', es:['sucio','está'],      en:'dirty',    de:'schmutzig', st:{dirt:1}},
 {k:'clean',    dim:'dirt', es:['limpio','está'],     en:'clean',    de:'sauber',    st:{dirt:-1}},
 {k:'old',      dim:'age',  es:['viejo','es'],        en:'old',      de:'alt',       st:{age:1}},
 {k:'young',    dim:'age',  es:['joven','es'],        en:'young',    de:'jung',      st:{age:-1}},
 {k:'fast',     dim:'speed',es:['rápido','es'],       en:'fast',     de:'schnell',   st:{verb:'run',speed:2.3}},
 {k:'slow',     dim:'speed',es:['lento','es'],        en:'slow',     de:'langsam',   st:{verb:'walk',speed:0.3}},
 {k:'loud',     dim:'loud', es:['ruidoso','es'],      en:'loud',     de:'laut',      st:{verb:'roar'}},
 {k:'quiet',    dim:'loud', es:['silencioso','es'],   en:'quiet',    de:'leise',     st:{verb:'shh'}},
 {k:'red',      dim:'color',es:['rojo','es'],         en:'red',      de:'rot',       st:{color:'red'}},
 {k:'blue',     dim:'color',es:['azul','es'],         en:'blue',     de:'blau',      st:{color:'blue'}},
 {k:'yellow',   dim:'color',es:['amarillo','es'],     en:'yellow',   de:'gelb',      st:{color:'yellow'}},
 {k:'green',    dim:'color',es:['verde','es'],        en:'green',    de:'grün',      st:{color:'green'}}
];
const DA=k=>DADJ.find(a=>a.k===k);
/* verbs whose own face or setting would fight a mood, wetness or dirt */
const FACE_VERBS=['sleep','laugh','cry','sing','sneeze','yawn','eat','drink','swim','shower','teeth','bubbles','smell','hide'];

/* ---------- drawing the dino (100×100 design space, feet on y=88) ---------- */
const INK='#05060F';
const DCOL={green:['#5BD06B','#3A9E4C','#E9F8B9','#FF8A3D'],red:['#FF6B5E','#C9443A','#FFE0C2','#FFD43B'],
            blue:['#5B9BFF','#3768C8','#DDEBFF','#FFD43B'],yellow:['#FFD43B','#D6A915','#FFF6C9','#FF8A3D']};
const SAYS={sneeze:{es:'¡Achís!',en:'Achoo!',de:'Hatschi!'},laugh:{es:'¡JA JA!',en:'HA HA!',de:'HA HA!'},
            roar:{es:'¡GRRR!',en:'ROAR!',de:'RAAAH!'},shh:{es:'Chsss…',en:'Shh…',de:'Pssst…'}};
function txt(g,s,x,y,size,col,rot){g.save();g.translate(x,y);g.rotate(rot||0);g.font=`bold ${size}px Impact,"Arial Black",sans-serif`;
  g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.lineWidth=size*0.28;g.strokeStyle=INK;g.strokeText(s,0,0);
  g.fillStyle=col||'#fff';g.fillText(s,0,0);g.restore();}
function note(g,x,y,s,col){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle=col||INK;g.strokeStyle=INK;g.lineWidth=1.4;
  g.beginPath();g.ellipse(0,0,2.6,2,-0.4,0,7);g.fill();g.beginPath();g.moveTo(2.3,-0.6);g.lineTo(2.3,-9);g.lineTo(6,-7);g.stroke();g.restore();}
function drop(g,x,y,s,col){g.fillStyle=col||'#5AB8FF';g.strokeStyle=INK;g.lineWidth=0.9;g.beginPath();g.moveTo(x,y-3*s);
  g.quadraticCurveTo(x+2.4*s,y+0.5*s,x,y+1.8*s);g.quadraticCurveTo(x-2.4*s,y+0.5*s,x,y-3*s);g.fill();g.stroke();}
function ball(g,x,y,r){g.fillStyle='#FF4F4F';g.strokeStyle=INK;g.lineWidth=1.4;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.stroke();
  g.strokeStyle='#fff';g.lineWidth=1;g.beginPath();g.arc(x,y,r*0.6,0.3,2.2);g.stroke();}
function twinkle(g,x,y,s,a){g.save();g.translate(x,y);g.rotate(a||0);g.fillStyle='#FFF7AE';g.strokeStyle=INK;g.lineWidth=0.8;g.beginPath();
  for(let i=0;i<8;i++){const r=i%2?s*0.35:s,an=i*Math.PI/4;g.lineTo(Math.cos(an)*r,Math.sin(an)*r);}g.closePath();g.fill();g.stroke();g.restore();}
function limb(g,x,y,len,w,ang,col,foot){
  g.save();g.translate(x,y);g.rotate(ang);g.fillStyle=col;g.strokeStyle=INK;g.lineWidth=2.2;
  g.beginPath();g.roundRect(-w/2,-w/2,w,len+w/2,w/2);g.fill();g.stroke();
  g.beginPath();if(foot)g.ellipse(w*0.35,len,w*0.78,w*0.42,0,0,7);else g.arc(0,len,w*0.62,0,7);g.fill();g.stroke();
  g.restore();
}
/* what each verb looks like at time t (seconds) */
function dpose(v,t,st){
  const P={dx:0,dy:0,rot:0,sq:1,head:0,l1:0,l2:0,a1:-0.25,a2:-0.15,tail:Math.sin(t*3)*0.12,eyes:null,mouth:null,
           hold:null,pre:null,post:null,scroll:0,shadow:1},c=t*(st.speed||1),L=lang;
  switch(v){
    case 'stand':P.dy=Math.sin(t*2)*0.6;P.a1=-0.25+Math.sin(t*2)*0.1;break;
    case 'jump':{const ph=(c*1.3)%1,air=Math.sin(Math.PI*ph);P.dy=-air*20;P.sq=ph<0.07||ph>0.93?0.86:1+air*0.05;
      P.l1=P.l2=air*0.6;P.a1=P.a2=-0.4-air*2.2;P.shadow=1-air*0.5;P.mouth='grin';P.eyes='happy';break;}
    case 'run':{const f=c*9;P.dy=-Math.abs(Math.sin(f))*3;P.l1=Math.sin(f)*0.85;P.l2=-Math.sin(f)*0.85;P.a1=-0.7+Math.sin(f)*0.6;
      P.a2=-0.7-Math.sin(f)*0.6;P.rot=0.1;P.tail=0.05;P.scroll=c*40;
      P.post=g=>{g.strokeStyle='rgba(5,6,15,.35)';g.lineWidth=1.6;for(let i=0;i<3;i++){const y=50+i*9+P.dy,o=(c*60+i*7)%10;
        g.beginPath();g.moveTo(8-o,y);g.lineTo(20-o,y);g.stroke();}};break;}
    case 'walk':{const f=c*4.5;P.dy=-Math.abs(Math.sin(f))*1.5;P.l1=Math.sin(f)*0.45;P.l2=-Math.sin(f)*0.45;P.a1=-0.3+Math.sin(f)*0.3;
      P.a2=-0.3-Math.sin(f)*0.3;P.scroll=c*14;break;}
    case 'sleep':P.dy=9;P.l1=P.l2=-1.45;P.a1=-0.9;P.a2=-0.9;P.head=0.5;P.eyes='closed';P.mouth='flat';P.sq=1+Math.sin(t*1.6)*0.035;
      P.tail=0.25;P.post=g=>{for(let i=0;i<3;i++){const ph=(t*0.45+i/3)%1;g.globalAlpha=1-ph;
        txt(g,'z',80+ph*12+i*2,32-ph*26,6+ph*6,'#BFD7FF',-0.2);}g.globalAlpha=1;};break;
    case 'eat':{const ch=(Math.sin(t*9)+1)/2;P.a1=P.a2=-2.05;P.head=0.08;P.mouth=ch>0.5?'open':'flat';P.hold='apple';
      P.eyes='happy';P.post=g=>{if(ch>0.8){g.fillStyle='#FFE08A';g.fillRect(88+Math.random()*4,46+Math.random()*6,1.5,1.5);}};break;}
    case 'drink':P.a1=P.a2=-2.2;P.head=-0.28;P.eyes='closed';P.mouth='flat';P.hold='cup';P.dy=Math.sin(t*6)*0.5;break;
    case 'swim':{const f=t*5;P.dy=8+Math.sin(t*2)*2;P.l1=Math.sin(f)*0.7;P.l2=-Math.sin(f)*0.7;P.a1=-1.3+Math.sin(f)*0.9;
      P.a2=-1.3-Math.sin(f)*0.9;P.shadow=0;P.mouth='smile';P.tail=Math.sin(f)*0.3;
      P.post=g=>{g.fillStyle='rgba(60,170,255,.55)';g.beginPath();g.moveTo(-50,74);
        for(let x=-50;x<=150;x+=5)g.lineTo(x,74+Math.sin(x/7+t*3)*1.8);g.lineTo(150,200);g.lineTo(-50,200);g.closePath();g.fill();
        g.strokeStyle='#fff';g.lineWidth=1.6;g.beginPath();for(let x=-50;x<=150;x+=5)g[x===-50?'moveTo':'lineTo'](x,74+Math.sin(x/7+t*3)*1.8);g.stroke();
        for(let i=0;i<4;i++){const ph=(t*0.6+i/4)%1;g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=0.9;g.beginPath();
          g.arc(30+i*16,86-ph*14,1.6+i*0.3,0,7);g.stroke();}};break;}
    case 'dance':P.rot=Math.sin(c*4)*0.18;P.dy=-Math.abs(Math.sin(c*8))*4;P.a1=-2.5+Math.sin(c*8)*0.5;P.a2=-2.5-Math.sin(c*8)*0.5;
      P.l1=Math.sin(c*8)*0.35;P.l2=-Math.sin(c*8)*0.35;P.eyes='happy';P.mouth='grin';P.tail=Math.sin(c*8)*0.35;
      P.post=g=>{for(let i=0;i<3;i++){const ph=(t*0.5+i/3)%1;g.globalAlpha=1-ph;
        note(g,15+i*30+Math.sin(ph*6)*4,30-ph*22,1.2,['#FFD43B','#FF5BA8','#5AD8FF'][i]);}g.globalAlpha=1;};break;
    case 'sing':P.head=-0.18+Math.sin(t*3)*0.06;P.mouth='o';P.a1=-1.9;P.hold='mic';P.eyes='closed';
      P.post=g=>{for(let i=0;i<3;i++){const ph=(t*0.55+i/3)%1;g.globalAlpha=1-ph;note(g,92+ph*6,30-ph*26+i,1.1,'#FFD43B');}g.globalAlpha=1;};break;
    case 'laugh':P.eyes='happy';P.mouth='grin';P.dy=-Math.abs(Math.sin(t*14))*2;P.rot=Math.sin(t*14)*0.03;P.a1=P.a2=-0.55;
      P.post=g=>{const ph=(t*0.8)%1;g.globalAlpha=1-ph*0.6;txt(g,SAYS.laugh[L],80,16-ph*8,8,'#FFD43B',-0.15);g.globalAlpha=1;};break;
    case 'cry':P.eyes='sad';P.mouth='frown';P.dx=Math.sin(t*20)*0.5;P.head=0.12;P.tears=1;
      P.pre=g=>{g.fillStyle='rgba(90,184,255,.6)';g.beginPath();g.ellipse(76,89,10,2.2,0,0,7);g.fill();};break;
    case 'wave':P.a1=-2.65+Math.sin(t*9)*0.45;P.mouth='smile';P.eyes='happy';
      P.post=g=>{g.strokeStyle=INK;g.lineWidth=1.2;for(let i=0;i<2;i++){g.beginPath();g.arc(70,32,13+i*4,-1.2,-0.5);g.stroke();}};break;
    case 'fly':P.wings=Math.sin(t*12);P.dy=-15+Math.sin(t*3)*3;P.rot=0.15;P.l1=P.l2=0.7;P.a1=P.a2=-1.4;P.shadow=0.35;
      P.mouth='grin';P.eyes='happy';break;
    case 'read':P.a1=-1.55;P.a2=-1.45;P.head=0.28;P.eyes='down';P.mouth='smile';P.hold='book';break;
    case 'paint':{P.dx=-8;P.a1=-1.6+Math.sin(t*5)*0.45;P.hold='brush';P.mouth='smile';
      P.pre=g=>{g.fillStyle='#A4683A';g.strokeStyle=INK;g.lineWidth=1.6;[[80,50,74,89],[94,50,100,89]].forEach(([a,b,c2,d])=>{
        g.beginPath();g.moveTo(a,b);g.lineTo(c2,d);g.stroke();});g.fillStyle='#fff';g.fillRect(74,30,24,26);g.strokeRect(74,30,24,26);
        const n=Math.floor(t*1.5)%7;['#FF5A4F','#FFD43B','#5B9BFF','#5BD06B','#B65CFF','#FF8A3D','#00C2C2'].slice(0,n+1).forEach((cl,i)=>{
          g.strokeStyle=cl;g.lineWidth=2.4;g.beginPath();g.moveTo(77,34+i*3.2);g.quadraticCurveTo(86,30+i*3.6,95,35+i*3);g.stroke();});};break;}
    case 'throw':{const ph=(c*0.6)%1;P.a1=ph<0.35?0.9*(ph/0.35):ph<0.45?0.9-3.3*((ph-0.35)/0.1):-2.4+((ph-0.45)/0.55)*2.1;
      if(ph<0.42)P.hold='ball';P.mouth='grin';
      P.post=g=>{if(ph>=0.42){const u=(ph-0.42)/0.58;ball(g,72+u*40,44-Math.sin(u*Math.PI)*28+u*10,3.4);}};break;}
    case 'catch':{const ph=(c*0.55)%1;P.a1=P.a2=-2.2;P.mouth=ph<0.65?'o':'grin';P.eyes=ph<0.65?'wide':'happy';
      if(ph>=0.65)P.hold='ball';P.post=g=>{if(ph<0.65){const u=ph/0.65;ball(g,112-u*40,20+Math.sin(u*Math.PI)*-16+u*22,3.4);}};break;}
    case 'climb':{const ph=(c*0.22)%1,f=c*6;P.dy=-ph*34;P.a1=-2.6+Math.sin(f)*0.35;P.a2=-2.6-Math.sin(f)*0.35;
      P.l1=-0.5+Math.sin(f)*0.4;P.l2=-0.5-Math.sin(f)*0.4;P.shadow=1-ph*0.6;P.dx=-6;
      P.pre=g=>{g.strokeStyle='#A4683A';g.lineWidth=2.6;g.beginPath();g.moveTo(62,4);g.lineTo(62,89);g.moveTo(78,4);g.lineTo(78,89);g.stroke();
        g.lineWidth=2;for(let y=10;y<88;y+=9){g.beginPath();g.moveTo(62,y);g.lineTo(78,y);g.stroke();}};break;}
    case 'sit':P.dy=7;P.l1=P.l2=-1.35;P.a1=-0.5;P.mouth='smile';
      P.pre=g=>{g.fillStyle='#B07D46';g.strokeStyle=INK;g.lineWidth=2;g.beginPath();g.roundRect(30,76,30,13,3);g.fill();g.stroke();
        g.fillStyle='#D9A877';g.beginPath();g.ellipse(45,76,15,3.6,0,0,7);g.fill();g.stroke();};break;
    case 'shower':P.eyes='closed';P.mouth='smile';P.a1=-2.4+Math.sin(t*8)*0.4;P.a2=-1.0-Math.sin(t*8)*0.4;
      P.pre=g=>{g.strokeStyle='#8896A6';g.lineWidth=3;g.beginPath();g.moveTo(100,4);g.lineTo(76,4);g.quadraticCurveTo(70,4,70,9);g.stroke();
        g.fillStyle='#B6C2CF';g.strokeStyle=INK;g.lineWidth=1.4;g.beginPath();g.ellipse(70,10,7,2.4,0,0,7);g.fill();g.stroke();};
      P.post=g=>{g.strokeStyle='rgba(90,184,255,.8)';g.lineWidth=1.2;for(let i=0;i<9;i++){const x=64+i*1.6,o=(t*90+i*13)%30;
          g.beginPath();g.moveTo(x,13+o);g.lineTo(x-1,19+o);g.stroke();}
        g.strokeStyle='#fff';g.lineWidth=0.9;[[40,52],[48,46],[56,60],[36,64]].forEach(([x,y],i)=>{g.beginPath();g.arc(x,y,1.8+(i%2),0,7);g.stroke();});};break;
    case 'sneeze':{const ph=(t*0.38)%1;
      if(ph<0.55){const u=ph/0.55;P.head=-0.4*u;P.mouth='o';P.eyes='squint';
        P.post=g=>{txt(g,(L==='de'?'Ha… ':'A… ')+(u>0.5?(L==='de'?'ha…':'a…'):''),76,12,6,'#fff');};}
      else if(ph<0.72){P.head=0.3;P.mouth='open';P.eyes='closed';P.dx=2;
        P.post=g=>{txt(g,SAYS.sneeze[L],78,12,9,'#FFD43B',-0.12);g.fillStyle='rgba(150,220,255,.85)';
          for(let i=0;i<10;i++){const a=-0.5+i*0.11,r=6+((ph-0.55)/0.17)*16;g.beginPath();g.arc(92+Math.cos(a)*r,48+Math.sin(a)*r,1.2,0,7);g.fill();}};}
      else{P.mouth='smile';}break;}
    case 'yawn':{const ph=(t*0.3)%1,u=Math.sin(Math.min(1,ph/0.7)*Math.PI);P.mouth='yawn';P.yawn=u;P.eyes=u>0.2?'closed':'half';
      P.a1=-0.3-u*2.5;P.a2=-0.2-u*2.4;P.head=-0.25*u;P.post=g=>{if(u>0.4){g.globalAlpha=u;txt(g,'Aaah…',80,12,7,'#fff');g.globalAlpha=1;}};break;}
    case 'cook':P.dx=-8;P.a1=-1.3+Math.sin(t*4)*0.25;P.hold='spoon';P.hat='chef';P.mouth='smile';P.head=0.12;
      P.pre=g=>{g.fillStyle='#8B8F99';g.strokeStyle=INK;g.lineWidth=1.8;g.fillRect(70,74,28,15);g.strokeRect(70,74,28,15);
        g.fillStyle='#4A4E58';g.beginPath();g.roundRect(73,60,22,14,3);g.fill();g.stroke();
        g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=1.6;for(let i=0;i<3;i++){const ph=(t*0.6+i/3)%1;g.globalAlpha=1-ph;
          g.beginPath();g.moveTo(78+i*6,58-ph*20);g.quadraticCurveTo(82+i*6,52-ph*20,78+i*6,46-ph*20);g.stroke();}g.globalAlpha=1;};break;
    case 'drum':{const h1=Math.max(0,Math.sin(t*10)),h2=Math.max(0,-Math.sin(t*10));P.dx=-9;P.a1=-1.1-h1*0.9;P.a2=-1.1-h2*0.9;
      P.hold='stick';P.mouth='grin';P.eyes='happy';
      P.pre=g=>{g.fillStyle='#FF5A4F';g.strokeStyle=INK;g.lineWidth=1.8;g.beginPath();g.rect(70,70,24,18);g.fill();g.stroke();
        g.fillStyle='#F4F4F4';g.beginPath();g.ellipse(82,70,12,3.6,0,0,7);g.fill();g.stroke();
        g.strokeStyle='#FFD43B';g.lineWidth=1.5;g.beginPath();for(let x=70;x<=94;x+=6){g.lineTo(x,(x/6)%2?72:86);}g.stroke();};
      P.post=g=>{if(h1>0.9||h2>0.9)txt(g,'BUM',84,52,6,'#FFD43B',0.2);};break;}
    case 'dig':{const ph=(t*0.9)%1;P.a1=-0.7+Math.sin(ph*Math.PI*2)*0.6;P.hold='shovel';P.head=0.2;P.rot=0.08;P.mouth='smile';
      P.pre=g=>{g.fillStyle='#8A5A2E';g.strokeStyle=INK;g.lineWidth=1.6;g.beginPath();g.ellipse(22,89,14,5+Math.min(4,t%8*0.6),0,Math.PI,0);g.fill();g.stroke();};
      P.post=g=>{if(ph>0.5){const u=(ph-0.5)*2;g.fillStyle='#8A5A2E';for(let i=0;i<5;i++)g.fillRect(74-u*50-i*2,70-Math.sin(u*Math.PI)*24+i*1.5,2.2,2.2);}};break;}
    case 'fish':{P.dy=7;P.l1=P.l2=-1.35;P.a1=-1.5;P.mouth='smile';P.dx=-12;const ph=(t*0.3)%1;
      P.pre=g=>{g.fillStyle='#8D8173';g.strokeStyle=INK;g.lineWidth=1.8;g.beginPath();g.ellipse(32,86,16,6,0,Math.PI,0);g.fill();g.stroke();
        g.fillStyle='rgba(60,170,255,.75)';g.beginPath();g.ellipse(92,90,22,6,0,0,7);g.fill();};
      P.post=g=>{g.strokeStyle='#7A4C26';g.lineWidth=1.8;g.beginPath();g.moveTo(56,64);g.lineTo(90,22);g.stroke();
        g.strokeStyle=INK;g.lineWidth=0.7;g.beginPath();g.moveTo(90,22);g.lineTo(92+Math.sin(t*2),86);g.stroke();
        if(ph>0.6){const u=(ph-0.6)/0.4;g.save();g.translate(84+u*14,88-Math.sin(u*Math.PI)*22);g.rotate(-1.2+u*2.4);
          g.fillStyle='#FF8A3D';g.strokeStyle=INK;g.lineWidth=1;g.beginPath();g.ellipse(0,0,5,2.6,0,0,7);g.fill();g.stroke();
          g.beginPath();g.moveTo(-4.5,0);g.lineTo(-8,-2.6);g.lineTo(-8,2.6);g.closePath();g.fill();g.stroke();g.restore();}};break;}
    case 'bike':{const f=c*7;P.dy=-9;P.l1=-0.6+Math.sin(f)*0.6;P.l2=-0.6-Math.sin(f)*0.6;P.a1=P.a2=-1.45;P.rot=0.05;P.scroll=c*30;
      P.mouth='grin';P.shadow=0;
      P.pre=g=>{g.strokeStyle=INK;g.lineWidth=2;[[26,79],[68,79]].forEach(([x,y])=>{g.fillStyle='#fff';g.beginPath();g.arc(x,y,10,0,7);g.stroke();
          g.lineWidth=0.8;for(let i=0;i<4;i++){const a=f*0.5+i*Math.PI/4;g.beginPath();g.moveTo(x-Math.cos(a)*10,y-Math.sin(a)*10);
            g.lineTo(x+Math.cos(a)*10,y+Math.sin(a)*10);g.stroke();}g.lineWidth=2;});
        g.strokeStyle='#FF5A4F';g.lineWidth=2.6;g.beginPath();g.moveTo(26,79);g.lineTo(44,79);g.lineTo(40,62);g.lineTo(26,79);
        g.moveTo(44,79);g.lineTo(64,62);g.lineTo(68,79);g.moveTo(40,62);g.lineTo(64,62);g.moveTo(64,62);g.lineTo(62,54);g.stroke();
        g.strokeStyle=INK;g.lineWidth=2;g.beginPath();g.moveTo(58,54);g.lineTo(66,54);g.moveTo(35,61);g.lineTo(45,61);g.stroke();};break;}
    case 'teeth':P.a1=-2.15+Math.sin(t*14)*0.12;P.hold='toothbrush';P.mouth='grin';P.eyes='happy';
      P.post=g=>{g.fillStyle='#fff';g.strokeStyle='rgba(5,6,15,.4)';g.lineWidth=0.6;for(let i=0;i<4;i++){const ph=(t*0.8+i/4)%1;g.globalAlpha=1-ph;
        g.beginPath();g.arc(90+i*1.5,44-ph*10,1.4+ph,0,7);g.fill();g.stroke();}g.globalAlpha=1;};break;
    case 'bubbles':P.a1=-1.9;P.hold='wand';P.mouth='o';P.head=-0.1;
      P.post=g=>{for(let i=0;i<6;i++){const ph=(t*0.35+i/6)%1,x=88+ph*10+Math.sin(ph*9+i)*5,y=34-ph*32,r=2+(i*7)%5;g.globalAlpha=1-ph*0.7;
        g.strokeStyle='rgba(90,180,255,.95)';g.lineWidth=0.9;g.fillStyle='rgba(200,240,255,.3)';g.beginPath();g.arc(x,y,r,0,7);g.fill();g.stroke();
        g.fillStyle='rgba(255,255,255,.9)';g.beginPath();g.arc(x-r*0.35,y-r*0.35,r*0.25,0,7);g.fill();}g.globalAlpha=1;};break;
    case 'swing':{const a=Math.sin(t*2.4)*0.55,L=70;P.dx=4+Math.sin(a)*L;P.dy=-10-(1-Math.cos(a))*L;P.rot=a*0.5;P.l1=P.l2=-1.35;P.a1=P.a2=-2.4;
      P.mouth='grin';P.eyes='happy';P.shadow=0.5;
      P.pre=g=>{g.strokeStyle='#A4683A';g.lineWidth=3;g.beginPath();g.moveTo(8,89);g.lineTo(22,2);g.lineTo(80,2);g.lineTo(94,89);g.stroke();
        const sx=50+Math.sin(a)*L,sy=2+Math.cos(a)*L,c=Math.cos(a)*10,d=Math.sin(a)*10;
        g.strokeStyle='#555';g.lineWidth=1.2;g.beginPath();g.moveTo(40,2);g.lineTo(sx-c,sy-d);g.moveTo(60,2);g.lineTo(sx+c,sy+d);g.stroke();
        g.save();g.translate(sx,sy);g.rotate(a);g.fillStyle='#FF5A4F';g.strokeStyle=INK;g.lineWidth=1;g.fillRect(-12,0,24,3);g.strokeRect(-12,0,24,3);g.restore();};break;}
    case 'slide':{const ph=(t*0.45)%1,u=Math.min(1,ph/0.75);P.dx=-32+u*48;P.dy=-46+u*44;P.rot=u<1?0.55:0;P.l1=P.l2=-1.4;P.a1=P.a2=-2.5;
      P.mouth='grin';P.eyes='happy';P.shadow=u<1?0:1;
      P.pre=g=>{g.strokeStyle='#888';g.lineWidth=2;g.beginPath();g.moveTo(4,34);g.lineTo(4,89);g.moveTo(11,34);g.lineTo(11,89);g.stroke();
        g.lineWidth=1.4;for(let y=42;y<89;y+=8){g.beginPath();g.moveTo(4,y);g.lineTo(11,y);g.stroke();}
        g.fillStyle='#FFD43B';g.strokeStyle=INK;g.lineWidth=1.6;g.beginPath();g.moveTo(3,33);g.lineTo(12,33);g.lineTo(86,86);g.lineTo(76,89);g.closePath();g.fill();g.stroke();};break;}
    case 'skate':P.dy=-6+Math.sin(t*3)*0.5;P.rot=-0.04+Math.sin(t*1.5)*0.05;P.a1=-1.7+Math.sin(t*2)*0.2;P.a2=-1.3;P.scroll=t*35;P.mouth='grin';P.shadow=0.8;
      P.post=g=>{const y=83+P.dy*0.2;g.fillStyle='#B65CFF';g.strokeStyle=INK;g.lineWidth=1.4;g.beginPath();g.roundRect(26,y,42,3.4,1.7);g.fill();g.stroke();
        g.fillStyle='#FFD43B';[[32,y+5],[62,y+5]].forEach(([x,yy])=>{g.beginPath();g.arc(x,yy,2.4,0,7);g.fill();g.stroke();});};break;
    case 'ski':P.dy=-3;P.rot=0.12;P.a1=-0.9+Math.sin(t*4)*0.3;P.a2=-0.9-Math.sin(t*4)*0.3;P.hold='pole';P.scroll=t*40;P.mouth='grin';P.l1=-0.2;P.l2=0.1;
      P.post=g=>{g.strokeStyle='#FF5A4F';g.lineWidth=2.4;g.beginPath();g.moveTo(24,86);g.lineTo(72,86);g.quadraticCurveTo(77,86,78,82);g.stroke();};break;
    case 'kick':{const ph=(t*0.6)%1;P.l1=ph<0.4?0.9*(ph/0.4):ph<0.5?0.9-2.2*((ph-0.4)/0.1):-1.3+((ph-0.5)/0.5)*1.3;P.a1=-0.8;P.a2=-1.2;P.mouth='grin';
      P.post=g=>{const u=(ph-0.45)/0.55;ball(g,ph<0.45?67:67+u*50,ph<0.45?85:85-Math.sin(u*Math.PI)*30,3.6);};break;}
    case 'water':P.dx=-8;P.a1=-1.1;P.hold='can';P.mouth='smile';P.head=0.15;
      P.pre=g=>{[[82,'#FF5A4F'],[93,'#FFD43B']].forEach(([x,c])=>{g.strokeStyle='#2E8B3A';g.lineWidth=1.6;g.beginPath();g.moveTo(x,89);g.lineTo(x,75);g.stroke();
        g.fillStyle=c;g.strokeStyle=INK;g.lineWidth=0.8;for(let i=0;i<5;i++){const a=i*1.26;g.beginPath();g.arc(x+Math.cos(a)*2.6,73+Math.sin(a)*2.6,2,0,7);g.fill();g.stroke();}
        g.fillStyle='#FFE45C';g.beginPath();g.arc(x,73,1.4,0,7);g.fill();});};
      P.post=g=>{for(let i=0;i<5;i++){const ph=(t*1.6+i/5)%1;drop(g,70+ph*14,60+ph*12,0.6);}};break;
    case 'carry':{const f=t*4;P.l1=Math.sin(f)*0.4;P.l2=-Math.sin(f)*0.4;P.a1=P.a2=-1.75;P.hold='box';P.scroll=t*12;P.dy=-Math.abs(Math.sin(f))*1.2;P.mouth='flat';break;}
    case 'sweep':{const w=Math.sin(t*4);P.a1=0.15+w*0.45;P.hold='broom';P.head=0.2;P.mouth='smile';
      P.post=g=>{g.fillStyle='rgba(180,150,110,.6)';for(let i=0;i<3;i++){const ph=(t*1.3+i/3)%1;g.globalAlpha=1-ph;g.beginPath();g.arc(66+w*8+ph*10,87-ph*6,1.5+ph*3,0,7);g.fill();}g.globalAlpha=1;};break;}
    case 'push':{const f=t*4;P.l1=Math.sin(f)*0.45;P.l2=-Math.sin(f)*0.45;P.rot=0.18;P.a1=P.a2=-1.45;P.scroll=t*12;P.dx=-10;P.mouth='flat';P.eyes='squint';
      P.post=g=>{g.strokeStyle=INK;g.lineWidth=1.6;g.fillStyle='rgba(180,190,205,.85)';g.beginPath();g.moveTo(66,64);g.lineTo(96,64);g.lineTo(92,80);g.lineTo(70,80);g.closePath();g.fill();g.stroke();
        g.lineWidth=0.7;for(let x=70;x<94;x+=4){g.beginPath();g.moveTo(x,64);g.lineTo(x,80);g.stroke();}g.lineWidth=1.8;g.beginPath();g.moveTo(66,64);g.lineTo(62,58);g.stroke();
        g.fillStyle='#333';[[72,85],[90,85]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,3,0,7);g.fill();});};break;}
    case 'pull':{const f=t*4;P.l1=Math.sin(f)*0.45;P.l2=-Math.sin(f)*0.45;P.rot=0.12;P.dx=14;P.a1=0.9;P.scroll=t*12;P.mouth='flat';P.eyes='squint';
      P.pre=g=>{g.strokeStyle=INK;g.lineWidth=1.4;g.beginPath();g.moveTo(22,76);g.lineTo(68,67);g.stroke();g.fillStyle='#FF5A4F';g.lineWidth=1.6;
        g.beginPath();g.rect(1,70,22,12);g.fill();g.stroke();g.fillStyle='#333';[[6,85],[18,85]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,3.4,0,7);g.fill();});};break;}
    case 'spin':P.flip=Math.cos(t*6);P.a1=P.a2=-1.6;P.mouth='grin';P.eyes='happy';
      P.post=g=>{g.strokeStyle='rgba(5,6,15,.45)';g.lineWidth=1.4;for(let i=0;i<2;i++){g.beginPath();g.ellipse(46,60,30+i*5,8,0,t*3+i,t*3+i+2.2);g.stroke();}};break;
    case 'hide':{const ph=(t*0.4)%1,peek=ph>0.5&&ph<0.85?Math.sin((ph-0.5)/0.35*Math.PI):0;P.dy=24-peek*14;P.eyes='wide';P.mouth='smile';P.shadow=0;
      P.post=g=>{g.fillStyle='#3FA650';g.strokeStyle=INK;g.lineWidth=1.6;const B=[[16,80,13],[34,70,16],[56,68,17],[76,76,15],[46,84,18]];
        B.forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,7);g.stroke();});B.forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,7);g.fill();});
        g.fillStyle='#5BD06B';[[28,66],[50,60],[70,70],[40,78]].forEach(([x,y])=>{g.beginPath();g.ellipse(x,y,3,1.8,0.6,0,7);g.fill();});};break;}
    case 'smell':P.dx=-6;P.head=0.38;P.eyes='closed';P.mouth='smile';P.a1=-0.6;
      P.pre=g=>{g.strokeStyle='#2E8B3A';g.lineWidth=1.8;g.beginPath();g.moveTo(92,89);g.lineTo(92,64);g.stroke();
        g.fillStyle='#5BD06B';g.beginPath();g.ellipse(96,78,4,1.8,-0.5,0,7);g.fill();
        g.fillStyle='#FF5BA8';g.strokeStyle=INK;g.lineWidth=0.9;for(let i=0;i<6;i++){const a=i*1.047;g.beginPath();g.arc(92+Math.cos(a)*3.4,61+Math.sin(a)*3.4,2.6,0,7);g.fill();g.stroke();}
        g.fillStyle='#FFE45C';g.beginPath();g.arc(92,61,2,0,7);g.fill();};
      P.post=g=>{for(let i=0;i<2;i++){const ph=(t*0.6+i/2)%1;g.globalAlpha=1-ph;txt(g,'♥',80+i*8,40-ph*22,5+ph*3,'#FF5BA8');}g.globalAlpha=1;};break;
    case 'guitar':P.a1=-1.0+Math.sin(t*10)*0.25;P.head=Math.sin(t*4)*0.08;P.eyes='closed';P.mouth='grin';P.dy=-Math.abs(Math.sin(t*4));
      P.mid=g=>{g.save();g.translate(55,66);g.rotate(-0.45);g.fillStyle='#E07B39';g.strokeStyle=INK;g.lineWidth=1.3;
        g.beginPath();g.arc(-6,0,6.5,0,7);g.fill();g.stroke();g.beginPath();g.arc(2,0,5,0,7);g.fill();g.stroke();
        g.fillStyle='#5B3A1E';g.fillRect(4,-1.4,20,2.8);g.strokeRect(4,-1.4,20,2.8);g.fillRect(23,-2.4,4,4.8);
        g.fillStyle=INK;g.beginPath();g.arc(-2,0,1.8,0,7);g.fill();g.restore();};
      P.post=g=>{for(let i=0;i<2;i++){const ph=(t*0.6+i/2)%1;g.globalAlpha=1-ph;note(g,80+ph*10,40-ph*24,1.1,'#FFD43B');}g.globalAlpha=1;};break;
    case 'roar':P.mouth='roar';P.head=-0.2+Math.sin(t*16)*0.03;P.a1=P.a2=-1.2;P.eyes='angry';
      P.post=g=>{g.strokeStyle=INK;g.lineWidth=1.6;for(let i=0;i<3;i++){const r=8+i*6+(t*20)%6;g.globalAlpha=0.8-i*0.2;
        g.beginPath();g.arc(92,40,r,-0.7,0.7);g.stroke();}g.globalAlpha=1;txt(g,SAYS.roar[L],76,10,9,'#FF5A4F',-0.1);};break;
    case 'shh':P.a1=-2.45;P.mouth='flat';P.eyes='half';P.head=0.05;
      P.post=g=>{g.globalAlpha=0.7;txt(g,SAYS.shh[L],84,16,5,'#fff');g.globalAlpha=1;};break;
  }
  return P;
}
const MOOD_FACE={happy:['happy','grin'],sad:['sad','frown'],angry:['angry','frown'],scared:['wide','wobble'],
                 surprised:['wide','o'],tired:['half','flat']};
function dface(g,P,st,t,C){
  const m=MOOD_FACE[st.mood]||[],ey=P.eyes||m[0]||'open',mo=P.mouth||m[1]||'smile',ex=73,eyy=28;
  g.strokeStyle=INK;g.lineCap='round';g.lineWidth=1.8;
  const blink=(t+st.seed)%3.7<0.13&&(ey==='open'||ey==='down'||ey==='sad'||ey==='angry');
  if(blink||ey==='closed'){g.beginPath();g.arc(ex,eyy,3.6,0.15*Math.PI,0.85*Math.PI);g.stroke();}
  else if(ey==='happy'){g.beginPath();g.arc(ex,eyy+2.2,3.6,1.15*Math.PI,1.85*Math.PI);g.stroke();}
  else if(ey==='squint'){g.beginPath();g.moveTo(ex-3,eyy-2.5);g.lineTo(ex+2,eyy);g.lineTo(ex-3,eyy+2.5);g.stroke();}
  else{
    const r=ey==='wide'?5.6:4.6,pr=ey==='wide'?1.5:2.4,py=ey==='down'?2:0.4;
    g.fillStyle='#fff';g.beginPath();g.arc(ex,eyy,r,0,7);g.fill();g.stroke();
    g.fillStyle=INK;g.beginPath();g.arc(ex+1.5,eyy+py,pr,0,7);g.fill();
    g.fillStyle='#fff';g.beginPath();g.arc(ex+2.2,eyy+py-0.9,pr*0.35,0,7);g.fill();
    if(ey==='half'){g.save();g.beginPath();g.arc(ex,eyy,r+0.3,0,7);g.clip();g.fillStyle=C[0];g.fillRect(ex-6,eyy-6,12,6.4);g.restore();
      g.beginPath();g.moveTo(ex-r,eyy+0.4);g.lineTo(ex+r,eyy+0.4);g.stroke();g.beginPath();g.arc(ex,eyy,r,0,7);g.stroke();}
  }
  g.lineWidth=2;
  if(ey==='sad'){g.beginPath();g.moveTo(ex-4,eyy-5.2);g.lineTo(ex+4,eyy-7.8);g.stroke();}
  if(ey==='angry'){g.lineWidth=2.6;g.beginPath();g.moveTo(ex-4.5,eyy-8);g.lineTo(ex+4.5,eyy-4.2);g.stroke();}
  if(st.age>0){g.strokeStyle='#fff';g.lineWidth=2.2;g.beginPath();g.moveTo(ex-4,eyy-7);g.quadraticCurveTo(ex,eyy-9,ex+4.5,eyy-6.5);g.stroke();
    g.strokeStyle=INK;g.lineWidth=1.3;g.beginPath();g.arc(ex,eyy,6,0,7);g.stroke();g.beginPath();g.moveTo(ex+6,eyy);g.lineTo(84,eyy+3);g.stroke();
    g.fillStyle='#EEE';g.beginPath();g.moveTo(80,43);g.quadraticCurveTo(83,51,87,43);g.closePath();g.fill();g.lineWidth=1;g.stroke();}
  g.fillStyle=INK;g.beginPath();g.arc(88.5,32.5,0.9,0,7);g.fill();                      // nostril
  g.strokeStyle=INK;g.lineWidth=1.8;const mx=85,my=40;
  if(mo==='smile'){g.beginPath();g.moveTo(79,39.5);g.quadraticCurveTo(85,43.5,90.5,38.5);g.stroke();}
  else if(mo==='frown'){g.beginPath();g.moveTo(80,42);g.quadraticCurveTo(85,38,90,41);g.stroke();}
  else if(mo==='flat'){g.beginPath();g.moveTo(80,40.5);g.lineTo(90,39.5);g.stroke();}
  else if(mo==='wobble'){g.beginPath();g.moveTo(79,41);for(let i=1;i<=6;i++)g.lineTo(79+i*1.9,41+(i%2?-1.2:1.2));g.stroke();}
  else if(mo==='o'){g.fillStyle='#7A1E2A';g.beginPath();g.ellipse(mx+3,my,2.6,3.2,0,0,7);g.fill();g.stroke();}
  else if(mo==='open'||mo==='grin'){g.fillStyle='#7A1E2A';g.beginPath();g.moveTo(78.5,39);g.lineTo(91.5,37.5);
    g.quadraticCurveTo(88,47,80,43);g.closePath();g.fill();g.stroke();g.fillStyle='#FF7A8A';g.beginPath();g.ellipse(84,43.2,3,1.5,0,0,7);g.fill();}
  else if(mo==='roar'){g.fillStyle='#7A1E2A';g.beginPath();g.moveTo(77,38);g.lineTo(94,34);g.lineTo(91,49);g.lineTo(79,46);g.closePath();g.fill();g.stroke();
    g.fillStyle='#fff';for(let i=0;i<4;i++){g.beginPath();g.moveTo(80+i*3.4,37.6-i*0.8);g.lineTo(81.7+i*3.4,41-i*0.8);g.lineTo(83.4+i*3.4,37-i*0.8);g.fill();}}
  else if(mo==='yawn'){const u=P.yawn||0;g.fillStyle='#7A1E2A';g.beginPath();g.ellipse(85,41,3+u*4,1.5+u*5,-0.1,0,7);g.fill();g.stroke();}
  if(['happy','grin'].includes(m[1])||ey==='happy'||st.age<0){g.fillStyle='rgba(255,110,150,.45)';g.beginPath();g.arc(76,37.5,3,0,7);g.fill();}
  if(st.mood==='angry'){g.fillStyle='rgba(255,40,40,.25)';g.beginPath();g.ellipse(74,32,11,9,0,0,7);g.fill();}
  if(P.tears||st.mood==='sad'){for(let i=0;i<2;i++){const ph=(t*0.9+i/2)%1;drop(g,75+ph*1.5,33+ph*14,0.9,'#7CC8FF');}}
  if(st.mood==='scared'){drop(g,62,22+Math.sin(t*3),1.1,'#BFE6FF');}
  if(st.age<0){g.fillStyle='#FF5A4F';g.strokeStyle=INK;g.lineWidth=1.6;g.beginPath();g.arc(70,22,8,Math.PI,0);g.closePath();g.fill();g.stroke();
    g.beginPath();g.ellipse(60,22,6,1.8,0,0,7);g.fill();g.stroke();}
  else if(P.hat==='chef'){g.fillStyle='#fff';g.strokeStyle=INK;g.lineWidth=1.6;g.beginPath();g.rect(64,13,13,7);g.fill();g.stroke();
    [[65,11],[70.5,8],[76,11]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,4.2,0,7);g.fill();g.stroke();});g.fillRect(64.8,11,11.4,8);}
}
function holdProp(g,k,t,y){
  g.strokeStyle=INK;g.lineWidth=1.4;
  if(k==='apple'){g.fillStyle='#FF4F4F';g.beginPath();g.arc(1,y+2,4,0,7);g.fill();g.stroke();g.strokeStyle='#5B3A1E';g.beginPath();g.moveTo(1,y-2);g.lineTo(2,y-4.5);g.stroke();}
  else if(k==='cup'){g.fillStyle='#5B9BFF';g.beginPath();g.rect(-3,y-1,7,8);g.fill();g.stroke();}
  else if(k==='book'){g.fillStyle='#FF8A3D';g.beginPath();g.rect(-2,y-3,13,9);g.fill();g.stroke();g.fillStyle='#fff';g.fillRect(-1,y-2,5.2,7);g.fillRect(4.8,y-2,5.2,7);
    g.beginPath();g.moveTo(4.5,y-3);g.lineTo(4.5,y+6);g.stroke();}
  else if(k==='mic'){g.fillStyle='#555';g.beginPath();g.rect(-1.2,y-1,2.4,8);g.fill();g.fillStyle='#BBB';g.beginPath();g.arc(0,y-2.5,2.6,0,7);g.fill();g.stroke();}
  else if(k==='brush'){g.strokeStyle='#A4683A';g.lineWidth=1.6;g.beginPath();g.moveTo(0,y);g.lineTo(0,y+12);g.stroke();g.fillStyle='#5B9BFF';g.beginPath();g.ellipse(0,y+13,1.4,2.4,0,0,7);g.fill();}
  else if(k==='ball')ball(g,1,y+2,3.4);
  else if(k==='spoon'){g.strokeStyle='#A4683A';g.lineWidth=1.6;g.beginPath();g.moveTo(0,y);g.lineTo(0,y+14);g.stroke();}
  else if(k==='stick'){g.strokeStyle='#A4683A';g.lineWidth=1.4;g.beginPath();g.moveTo(0,y);g.lineTo(2,y+12);g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(2,y+12,1.4,0,7);g.fill();}
  else if(k==='shovel'){g.strokeStyle='#A4683A';g.lineWidth=1.8;g.beginPath();g.moveTo(0,y-6);g.lineTo(0,y+14);g.stroke();
    g.fillStyle='#9AA3AD';g.beginPath();g.moveTo(-3.5,y+14);g.lineTo(3.5,y+14);g.lineTo(0,y+21);g.closePath();g.fill();g.lineWidth=1;g.strokeStyle=INK;g.stroke();}
  else if(k==='toothbrush'){g.strokeStyle='#5B9BFF';g.lineWidth=1.8;g.beginPath();g.moveTo(0,y);g.lineTo(0,y+10);g.stroke();
    g.fillStyle='#fff';g.strokeStyle=INK;g.lineWidth=0.8;g.fillRect(-1.6,y+9,3.2,4);g.strokeRect(-1.6,y+9,3.2,4);}
  else if(k==='wand'){g.strokeStyle='#FF5BA8';g.lineWidth=1.4;g.beginPath();g.moveTo(0,y);g.lineTo(0,y+8);g.stroke();g.beginPath();g.arc(0,y+10.5,2.6,0,7);g.stroke();}
  else if(k==='pole'){g.strokeStyle='#555';g.lineWidth=1.2;g.beginPath();g.moveTo(0,y-2);g.lineTo(0,y+24);g.stroke();g.beginPath();g.moveTo(-2,y+21);g.lineTo(2,y+21);g.stroke();}
  else if(k==='box'){g.fillStyle='#C68A52';g.beginPath();g.rect(-5,y-6,15,12);g.fill();g.stroke();g.strokeStyle='#8B5E32';g.beginPath();g.moveTo(2.5,y-6);g.lineTo(2.5,y+6);g.stroke();}
  else if(k==='broom'){g.strokeStyle='#A4683A';g.lineWidth=1.6;g.beginPath();g.moveTo(0,y-5);g.lineTo(0,y+19);g.stroke();
    g.fillStyle='#E8C25A';g.strokeStyle=INK;g.lineWidth=1;g.beginPath();g.moveTo(-2,y+19);g.lineTo(2,y+19);g.lineTo(4,y+25);g.lineTo(-4,y+25);g.closePath();g.fill();g.stroke();}
  else if(k==='can'){g.fillStyle='#2ED17A';g.beginPath();g.rect(-3,y-2,9,8);g.fill();g.stroke();g.strokeStyle='#2ED17A';g.lineWidth=1.8;g.beginPath();g.moveTo(6,y);g.lineTo(12,y-4);g.stroke();}
  else if(k==='cane'){g.strokeStyle='#7A4C26';g.lineWidth=1.8;g.beginPath();g.moveTo(0,y);g.lineTo(0,y+20);g.stroke();
    g.beginPath();g.arc(-2.5,y,2.5,0,Math.PI,true);g.stroke();}
}
function dscene(g,v,t,st,P){
  let top='#BFEAFF',bot='#EFFAFF',ground='#7CD36B';
  if(v==='sleep'){top='#141B4D';bot='#34397F';ground='#2F6B3D';}
  else if(v==='dance'){top='#2A1257';bot='#6A35D8';ground='#4B2499';}
  else if(v==='shower'){top='#E3F4FA';bot='#CBE9F4';ground='#9FD3E6';}
  else if(v==='swim'||v==='fish'){bot='#D7F3FF';}
  else if(v==='ski'){top='#CFE3F7';bot='#F2F8FF';ground='#FFFFFF';}
  if(st.wet>0){top='#8FA5BA';bot='#C7D3DE';}
  const gr=g.createLinearGradient(0,0,0,100);gr.addColorStop(0,top);gr.addColorStop(1,bot);g.fillStyle=gr;g.fillRect(0,0,100,100);
  if(v==='sleep'){g.fillStyle='#FFF4C2';g.beginPath();g.arc(16,16,7,0,7);g.fill();g.fillStyle=top;g.beginPath();g.arc(19.5,13.5,6,0,7);g.fill();
    g.fillStyle='#fff';[[40,10],[70,18],[88,8],[55,26],[30,30]].forEach(([x,y],i)=>{g.globalAlpha=0.5+0.5*Math.sin(t*2+i);g.fillRect(x,y,1.4,1.4);});g.globalAlpha=1;}
  if(v==='dance'){for(let i=0;i<5;i++){const a=t*0.8+i*1.26;g.fillStyle=['rgba(255,90,90,.18)','rgba(255,212,59,.18)','rgba(90,216,255,.18)','rgba(91,208,107,.18)','rgba(255,91,168,.18)'][i];
      g.beginPath();g.moveTo(50,0);g.lineTo(50+Math.cos(a)*140,Math.abs(Math.sin(a))*140);g.lineTo(50+Math.cos(a+0.25)*140,Math.abs(Math.sin(a+0.25))*140);g.fill();}
    g.fillStyle='#ddd';g.beginPath();g.arc(50,4,4,0,7);g.fill();}
  if(v==='shower'){g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=0.6;for(let x=0;x<=100;x+=12){g.beginPath();g.moveTo(x,0);g.lineTo(x,88);g.stroke();}
    for(let y=0;y<=88;y+=12){g.beginPath();g.moveTo(0,y);g.lineTo(100,y);g.stroke();}}
  if(v==='ski'){g.fillStyle='#fff';for(let i=0;i<14;i++){const x=(i*37+t*8)%100,y=(i*23+t*14)%88;g.beginPath();g.arc(x,y,0.9,0,7);g.fill();}}
  if(v==='fly'){g.fillStyle='rgba(255,255,255,.95)';for(let i=0;i<3;i++){const x=((i*45-t*30)%140+140)%140-20,y=18+i*24;
      [[0,0,6],[6,-3,7],[12,0,6]].forEach(([a,b,r])=>{g.beginPath();g.arc(x+a,y+b,r,0,7);g.fill();});}ground=null;}
  if(ground){g.fillStyle=ground;g.fillRect(0,88,100,12);g.fillStyle='rgba(0,0,0,.12)';
    for(let i=0;i<6;i++){const x=((i*22-P.scroll)%132+132)%132-16;g.fillRect(x,91+(i%2)*4,6,1.6);}}
}
function drawDino(g,W,H,st,t,inner){
  st=Object.assign({verb:'stand',size:1,color:'green',mood:'',wet:0,dirt:0,age:0,speed:1,seed:0,toff:0},st);t+=st.toff;
  const v=st.verb,P=dpose(v,t,st),C=DCOL[st.color]||DCOL.green;
  if(st.mood&&!FACE_VERBS.includes(v)&&v!=='roar'&&v!=='shh'){P.eyes=null;P.mouth=null;}  // the asked-about mood wins
  if(st.mood==='scared')P.dx+=Math.sin(t*45)*0.7;
  if(st.mood==='angry')P.dx+=Math.sin(t*30)*0.4;
  if(st.mood==='surprised'&&v==='stand'){P.dy-=Math.max(0,Math.sin(t*3))*4;P.a1=P.a2=-1.9;}
  if((st.mood==='sad'||st.mood==='tired')&&v==='stand'){P.head=0.18;P.tail=0.25;P.a1=P.a2=0.1;}
  if(st.age>0&&v==='stand'){P.hold='cane';P.a1=-0.35;P.head=0.1;P.rot=0.04;}
  if(!inner){g.save();g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,g.canvas.width,g.canvas.height);g.restore();}
  g.save();if(!inner)g.scale(W/100,H/100);g.lineJoin='round';g.lineCap='round';
  if(!st.noScene)dscene(g,v,t,st,P);
  if(st.wet<0){g.save();g.translate(84,13);g.rotate(t*0.4);g.fillStyle='#FFD43B';g.strokeStyle=INK;g.lineWidth=1.2;
    for(let i=0;i<8;i++){g.rotate(Math.PI/4);g.beginPath();g.moveTo(7,-1.5);g.lineTo(11,0);g.lineTo(7,1.5);g.fill();}
    g.beginPath();g.arc(0,0,6,0,7);g.fill();g.stroke();g.restore();}
  if(st.wet>0){g.fillStyle='#E9EEF3';g.strokeStyle=INK;g.lineWidth=1.3;[[34,10,7],[44,7,9],[55,10,7]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,7);g.fill();g.stroke();});
    g.fillRect(30,10,30,6);g.strokeStyle='rgba(60,140,230,.8)';g.lineWidth=1;
    for(let i=0;i<10;i++){const x=30+i*3.2,o=(t*70+i*17)%60;g.beginPath();g.moveTo(x,18+o);g.lineTo(x-1,22+o);g.stroke();}}
  g.translate(52,88);g.scale(st.size,st.size);g.translate(-52,-88);
  if(P.shadow){g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(46+P.dx,89,22*P.shadow,3.2*P.shadow,0,0,7);g.fill();}
  if(st.wet>0){g.fillStyle='rgba(90,160,230,.45)';g.beginPath();g.ellipse(46,89.5,28,3.5,0,0,7);g.fill();}
  if(P.pre)P.pre(g);
  g.save();g.translate(46+P.dx,88+P.dy);g.rotate(P.rot);g.scale(P.flip==null?1:P.flip,P.sq);g.translate(-46,-88);
  const [col,dark,belly,spk]=C;
  limb(g,40,71,13.5,8.5,P.l2,dark,1);
  limb(g,57,58,9,5,P.a2,dark,0);
  if(P.wings!=null){g.fillStyle='#fff';g.strokeStyle=INK;g.lineWidth=1.6;g.save();g.translate(44,48);g.rotate(-0.6-P.wings*0.5);
    g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(-8,-22,-22,-20);g.quadraticCurveTo(-12,-10,0,0);g.fill();g.stroke();g.restore();}
  g.fillStyle=spk;g.strokeStyle=INK;g.lineWidth=2;
  [[28,52,-0.55],[35,48,-0.3],[43,46.3,0],[51,46.8,0.2],[57,43,0.45]].forEach(([x,y,a])=>{g.save();g.translate(x,y);g.rotate(a);
    g.beginPath();g.moveTo(-3.6,2.5);g.lineTo(0,-5);g.lineTo(3.6,2.5);g.closePath();g.fill();g.stroke();g.restore();});
  const headT=q=>{q.translate(62,48);q.rotate(P.head);q.translate(-62,-48);};
  const sil=[
    q=>{q.save();q.translate(30,62);q.rotate(P.tail);q.moveTo(2,-8);q.quadraticCurveTo(-14,-6,-27,6);q.quadraticCurveTo(-12,8,3,9);q.closePath();q.restore();},
    q=>q.ellipse(46,62,21,16,0,0,7),
    q=>{q.save();headT(q);q.moveTo(52,52);q.lineTo(61,33);q.lineTo(74,36);q.lineTo(67,61);q.closePath();q.restore();},
    q=>{q.save();headT(q);q.ellipse(71,31,13,11,0,0,7);q.restore();},
    q=>{q.save();headT(q);q.ellipse(81,36,11,7.5,-0.1,0,7);q.restore();}
  ];
  g.strokeStyle=INK;g.lineWidth=4.4;sil.forEach(f=>{g.beginPath();f(g);g.stroke();});
  g.fillStyle=col;sil.forEach(f=>{g.beginPath();f(g);g.fill();});
  g.fillStyle=belly;g.beginPath();g.ellipse(50,67,13,9,-0.15,0,7);g.fill();
  if(st.dirt>0){g.fillStyle='#7A5230';[[36,58,4],[50,55,3],[44,71,3.4],[29,65,2.4],[58,66,2.6]].forEach(([x,y,r])=>{g.beginPath();g.ellipse(x,y,r,r*0.8,0.5,0,7);g.fill();});}
  if(st.wet>0||st.dirt<0){g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=1.6;g.beginPath();g.arc(42,58,11,3.6,4.4);g.stroke();}
  limb(g,51,72,13.5,9,P.l1,col,1);
  g.save();headT(g);dface(g,P,st,t,C);
  if(st.dirt>0){g.fillStyle='#7A5230';g.beginPath();g.ellipse(66,30,2.6,2,0,0,7);g.fill();}
  g.restore();
  if(P.mid)P.mid(g);
  g.save();g.translate(61,60);g.rotate(P.a1);limb(g,0,0,9,5.5,0,col,0);if(P.hold)holdProp(g,P.hold,t,9);g.restore();
  g.restore();
  if(P.post)P.post(g);
  if(st.wet>0)for(let i=0;i<4;i++){const ph=(t*1.2+i/4)%1;drop(g,32+i*10+P.dx,78+P.dy+ph*10,0.8);}
  if(st.dirt>0)for(let i=0;i<3;i++){const a=t*(3+i)+i*2;g.fillStyle=INK;g.beginPath();g.arc(46+P.dx+Math.cos(a)*(18+i*4),44+P.dy+Math.sin(a*1.3)*10,1.2,0,7);g.fill();
    g.strokeStyle='rgba(5,6,15,.5)';g.lineWidth=0.6;g.beginPath();g.arc(46+P.dx+Math.cos(a)*(18+i*4),42.6+P.dy+Math.sin(a*1.3)*10,1,0,7);g.stroke();}
  if(st.dirt<0)for(let i=0;i<4;i++){const s=2+2*Math.abs(Math.sin(t*3+i*1.7));twinkle(g,[24,66,40,74][i]+P.dx,[46,50,34,70][i]+P.dy,s,t+i);}
  if(st.mood==='angry'&&!FACE_VERBS.includes(v))for(let i=0;i<2;i++){const ph=(t*1.2+i/2)%1;g.globalAlpha=1-ph;g.fillStyle='#fff';
    g.beginPath();g.arc(70+i*8+P.dx,14-ph*10+P.dy,2.5+ph*3,0,7);g.fill();g.globalAlpha=1;}
  if(st.speed&&st.speed<1){g.font='13px serif';g.textAlign='center';g.fillText('🐌',86,84);}
  if(st.speed>1){g.fillStyle='rgba(200,170,120,.7)';for(let i=0;i<3;i++){const ph=(t*3+i/3)%1;g.globalAlpha=1-ph;g.beginPath();g.arc(30-ph*22,86-ph*4,2+ph*4,0,7);g.fill();}g.globalAlpha=1;}
  if(st.mood==='surprised')txt(g,'!',86+P.dx,12+P.dy,11,'#FFD43B',0.15);
  if(st.mood==='tired'&&v==='stand'){const ph=(t*0.5)%1;g.globalAlpha=1-ph;txt(g,'z',84,24-ph*14,5+ph*4,'#fff');g.globalAlpha=1;}
  if(st.mood==='scared'){g.strokeStyle=INK;g.lineWidth=1.2;[[18,40],[16,48],[20,56]].forEach(([x,y])=>{g.beginPath();g.moveTo(x+P.dx,y);g.lineTo(x-5+P.dx,y-1);g.stroke();});}
  g.restore();
}

/* several dinos in one picture, each in its own little scene — for "how many?" */
function drawCrowd(g,W,H,slots,t){
  g.save();g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,g.canvas.width,g.canvas.height);g.restore();
  const cols=slots.length>4?3:2,rows=2,cw=W/cols,ch=H/rows;
  slots.forEach((st,i)=>{const x=(i%cols)*cw,y=Math.floor(i/cols)*ch;
    g.save();g.beginPath();g.rect(x,y,cw,ch);g.clip();g.translate(x,y);g.scale(cw/100,ch/100);drawDino(g,100,100,st,t,true);g.restore();
    g.strokeStyle=INK;g.lineWidth=3;g.strokeRect(x,y,cw,ch);});
}

/* ---------- prepositions: where is the dino? ---------- */
const PREPS={on:{de:'auf',en:'on',es:'encima de'},under:{de:'unter',en:'under',es:'debajo de'},in:{de:'in',en:'in',es:'dentro de'},
  next:{de:'neben',en:'next to',es:'al lado de'},behind:{de:'hinter',en:'behind',es:'detrás de'},front:{de:'vor',en:'in front of',es:'delante de'}};
/* German takes the dative here: die Kiste → in der Kiste, der Tisch → unter dem Tisch */
const POBJ={box:{preps:['on','in','next','behind','front'],de:'der Kiste',en:'the box',es:'la caja'},
            table:{preps:['on','under','next','front'],de:'dem Tisch',en:'the table',es:'la mesa'}};
function drawPrep(g,W,H,obj,pk,t,seed){
  g.save();g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,g.canvas.width,g.canvas.height);g.restore();
  g.save();g.scale(W/100,H/100);g.lineJoin='round';g.lineCap='round';
  const gr=g.createLinearGradient(0,0,0,100);gr.addColorStop(0,'#BFEAFF');gr.addColorStop(1,'#EFFAFF');g.fillStyle=gr;g.fillRect(0,0,100,100);
  g.fillStyle='#8EDB7E';g.fillRect(0,74,100,26);g.fillStyle='#7CD36B';g.fillRect(0,88,100,12);
  const dino=(fx,fy,sz)=>{g.save();g.translate(fx-52,fy-88);drawDino(g,100,100,{verb:'stand',size:sz,seed,toff:seed,noScene:1},t,true);g.restore();};
  g.strokeStyle=INK;g.lineWidth=1.8;
  const table=()=>{g.fillStyle='#A4683A';g.fillRect(42,61,4,27);g.strokeRect(42,61,4,27);g.fillRect(84,61,4,27);g.strokeRect(84,61,4,27);
    g.fillStyle='#C68A52';g.fillRect(36,55,58,6);g.strokeRect(36,55,58,6);};
  const box=(front)=>{g.fillStyle='#D9A06A';
    if(front!==true){g.fillStyle='#B07D46';g.fillRect(45,58,40,30);g.strokeRect(45,58,40,30);if(front===false)return;}
    g.fillStyle='#D9A06A';g.fillRect(45,64,40,24);g.strokeRect(45,64,40,24);g.strokeStyle='#8B5E32';g.lineWidth=1.2;
    g.beginPath();g.moveTo(45,70);g.lineTo(85,70);g.moveTo(45,82);g.lineTo(85,82);g.stroke();g.strokeStyle=INK;g.lineWidth=1.8;
    if(front===true){g.fillStyle='#E8B985';g.beginPath();g.moveTo(45,64);g.lineTo(38,56);g.lineTo(52,56);g.lineTo(59,64);g.closePath();g.fill();g.stroke();
      g.beginPath();g.moveTo(85,64);g.lineTo(92,56);g.lineTo(78,56);g.lineTo(71,64);g.closePath();g.fill();g.stroke();}};
  if(obj==='table'){
    if(pk==='behind'){dino(64,76,0.42);table();}
    else if(pk==='under'){table();dino(64,88,0.38);}
    else if(pk==='on'){table();dino(66,55,0.42);}
    else if(pk==='next'){table();dino(22,88,0.42);}
    else{table();dino(62,97,0.5);}
  }else{
    if(pk==='in'){box(false);dino(64,80,0.42);box(true);}
    else if(pk==='behind'){dino(64,76,0.42);box();}
    else if(pk==='on'){box();dino(64,58,0.42);}
    else if(pk==='next'){box();dino(22,88,0.42);}
    else{box();dino(62,97,0.5);}
  }
  g.restore();
}

/* ---------- words and sentences ---------- */
const capFirst=s=>s.charAt(0).toUpperCase()+s.slice(1);
const deAdj=(stem,acc)=>stem+(stem.endsWith('e')?(acc?'n':''):(acc?'en':'e'));
const ADJ_ORDER={mood:0,size:1,age:2,wet:3,dirt:3,color:4,speed:5,loud:5};
const aW=a=>lang==='es'?a.es[0]:a[lang];
const vW=v=>lang==='de'?v.de[0]:v[lang];
function nounPhrase(adjs,acc,hl,cap){
  const html=!!hl;hl=hl||(x=>x);adjs=adjs.slice().sort((a,b)=>ADJ_ORDER[a.dim]-ADJ_ORDER[b.dim]);
  const C=w=>cap?capFirst(w):w,T=w=>html&&lang!=='en'?`<span class="art g-m">${C(w)}</span>`:C(w);
  if(lang==='de')return T(acc?'den':'der')+' '+adjs.map(a=>hl(deAdj(a.de,acc))+' ').join('')+'Dino';
  if(lang==='en')return C('the')+' '+adjs.map(a=>hl(a.en)+' ').join('')+'dino';
  const w=adjs.map(a=>hl(a.es[0]));
  return T('el')+' dino'+(w.length?' '+(w.length>1?w.slice(0,-1).join(', ')+' y '+w[w.length-1]:w[0]):'');
}
/* "Der kleine rote Dino springt!" — adjs attributive, verb conjugated */
function dSentence(adjs,v,hl){
  const np=nounPhrase(adjs,false,hl,true);hl=hl||(x=>x);
  if(!v)return '';
  if(lang==='de')return `${np} ${hl(v.de[0])}!`;
  if(lang==='en')return `${np} is ${hl(v.en)}!`;
  return `¡${np} está ${hl(v.es)}!`;
}
/* "Der Dino ist klein!" — predicative, no ending */
function dIs(a,hl){
  const html=!!hl;hl=hl||(x=>x);const T=w=>html?`<span class="art g-m">${w}</span>`:w;
  if(lang==='de')return `${T('Der')} Dino ist ${hl(a.de)}!`;
  if(lang==='en')return `The dino is ${hl(a.en)}!`;
  return `¡${T('El')} dino ${a.es[1]} ${hl(a.es[0])}!`;
}
const stripTags=s=>s.replace(/<[^>]+>/g,'');

/* ---------- the quiz ---------- */
const ACT_MAX=6;
let actRound=0,actTarget=null,actMiss=0,actDone=false,actMode='quiz',actLastVerb='';
const BODY_VERBS=DVERBS.filter(v=>!FACE_VERBS.includes(v.k));
function pickVerbs(n,pool){
  pool=shuffle((pool||DVERBS).filter(v=>v.k!==actLastVerb));
  const out=pool.slice(0,n);actLastVerb=out[0].k;return out;
}
function stOf(v,adjs,seed){const s={verb:v?v.k:'stand',seed,toff:seed*0.37};adjs.forEach(a=>Object.assign(s,a.st));return s;}
function newActRound(){
  actMiss=0;actDone=false;actAnim=[];actRound++;
  const grid=$('actGrid'),tpr=$('tprBox');grid.innerHTML='';grid.className='';$('actSentence').innerHTML='';
  const L=level('act',ACT_MAX);$('actLevel').textContent='🎯 '+L;
  if(actRound%6===0){                       // act-it-out break: he moves, the dino shows how
    const v=pick(DVERBS.filter(x=>x.imp));actTarget={kind:'tpr',v};
    grid.style.display='none';tpr.classList.add('on');
    const holder=$('tprStage');holder.innerHTML='';
    const card=makeCard((g,w,h,t)=>drawDino(g,w,h,{verb:v.k},t));card.classList.add('tprCard');holder.appendChild(card);
    actAsk();return;
  }
  tpr.classList.remove('on');grid.style.display='grid';
  const r=Math.random();let kind;
  if(L===1)kind='verb';
  else if(L===2)kind=r<0.6?'verb':'adj';
  else if(L===3)kind=r<0.3?'verb':r<0.6?'adj':r<0.68?'obj':r<0.82?'count':'prep';
  else if(L===4)kind=r<0.25?'verb':r<0.5?'adj':r<0.58?'obj':r<0.7?'count':r<0.82?'neg':'prep';
  else if(L===5)kind=r<0.4?'combo':r<0.52?'verb':r<0.6?'adj':r<0.72?'count':r<0.84?'neg':'prep';
  else kind=r<0.3?'combo3':r<0.5?'combo':r<0.67?'neg':r<0.83?'count':'prep';
  let opts=[],ti=0;
  if(kind==='verb'){
    const n=L===1?2:L===2?3:4,vs=pickVerbs(n,L===1?DVERBS.filter(v=>v.easy):DVERBS);
    actTarget={kind,v:vs[0],adjs:[]};opts=vs.map((v,i)=>stOf(v,[],i*1.3));
  }else if(kind==='adj'){
    const dims=L===2?['size','mood','color','wet','dirt']:['size','mood','color','wet','dirt','age','speed','loud'];
    const dim=pick(dims);let vals=DADJ.filter(a=>a.dim===dim);
    if(dim==='mood')vals=L===2?[DA('happy'),DA('sad')]:shuffle(vals).slice(0,L===3?3:4);
    else if(dim==='color')vals=shuffle(vals).slice(0,L===2?2:L===3?3:4);
    vals=shuffle(vals);actTarget={kind,a:vals[0],adjs:[vals[0]]};opts=vals.map((a,i)=>stOf(null,[a],i*1.3));
  }else if(kind==='obj'){
    const def=pick(ADJ.filter(a=>['long','full','open','up','many','hot'].includes(a.k))),yes=Math.random()<0.5;
    actTarget={kind,def,yes,word:def[lang][yes?0:1]};
    [true,false].sort(()=>Math.random()-.5).forEach(isYes=>{
      const card=makeCard((g,w,h,t)=>drawAdj(g,w,h,def.k,isYes,t));
      card.dataset.ok=isYes===yes?'1':'0';card.onclick=()=>actChoose(isYes===yes,card);grid.appendChild(card);});
    actAsk();return;
  }else if(kind==='count'){                  // "Wie viele Dinos springen?" — plural verb forms
    const n=L>=5?6:4,maxK=L>=5?5:3,k=1+Math.floor(Math.random()*maxK);
    const pool=DVERBS.filter(v=>!['climb','swing','slide','hide','fly','pull','push'].includes(v.k));
    const v=pickVerbs(1,pool)[0],others=shuffle(pool.filter(x=>x.k!==v.k)).slice(0,n-k);
    const slots=shuffle([...Array(k).fill(v),...others]).map((x,i)=>({verb:x.k,seed:i*1.7,toff:i*0.41}));
    actTarget={kind,v,k};grid.classList.add('countMode');
    const card=makeCard((g,w,h,t)=>drawCrowd(g,w,h,slots,t));card.style.aspectRatio=n>4?'3/2':'1/1';card.style.cursor='default';
    grid.appendChild(card);
    const row=document.createElement('div');row.className='numRow';
    for(let i=1;i<=maxK+1;i++){const b=document.createElement('button');b.className='numBtn';b.innerHTML=`${i}<small>${'●'.repeat(i)}</small>`;
      b.dataset.ok=i===k?'1':'0';b.onclick=()=>actChoose(i===k,b);row.appendChild(b);}
    grid.appendChild(row);actAsk();return;
  }else if(kind==='prep'){                   // "Welcher Dino ist unter dem Tisch?"
    const obj=Math.random()<0.5?'box':'table',ps=shuffle(POBJ[obj].preps).slice(0,L===3?3:4);
    actTarget={kind,obj,p:ps[0]};
    const order=shuffle(ps.map((x,i)=>i));grid.classList.toggle('three',ps.length===3);
    order.forEach(i=>{const card=makeCard((g,w,h,t)=>drawPrep(g,w,h,obj,ps[i],t,i*1.3));
      card.dataset.ok=i===0?'1':'0';card.onclick=()=>actChoose(i===0,card);grid.appendChild(card);});
    actAsk();return;
  }else if(kind==='neg'){                    // "Wer springt nicht?" — the odd one out
    const [v,o]=pickVerbs(2,DVERBS);actTarget={kind,v,o};
    opts=[stOf(o,[],0),stOf(v,[],1.3),stOf(v,[],2.6),stOf(v,[],3.9)];
  }else{                                     // a verb AND one or two adjectives must all match
    const dimsOk=['size','color','mood','wet','dirt','age'];
    const nd=kind==='combo3'?2:1,dims=shuffle(dimsOk).slice(0,nd);
    const pairs=dims.map(d=>d==='mood'?shuffle([DA('happy'),DA('sad')]):shuffle(DADJ.filter(a=>a.dim===d)).slice(0,2));
    const vs=pickVerbs(2,BODY_VERBS),tA=pairs.map(p=>p[0]);
    actTarget={kind,v:vs[0],adjs:tA};
    if(nd===1)opts=[[vs[0],[pairs[0][0]]],[vs[0],[pairs[0][1]]],[vs[1],[pairs[0][0]]],[vs[1],[pairs[0][1]]]];
    else opts=[[vs[0],tA],[vs[1],tA],[vs[0],[pairs[0][1],tA[1]]],[vs[0],[tA[0],pairs[1][1]]]];
    opts=opts.map(([v,a],i)=>stOf(v,a,i*1.3));
  }
  const order=shuffle(opts.map((o,i)=>i));
  grid.classList.toggle('three',order.length===3);
  order.forEach(i=>{
    const card=makeCard((g,w,h,t)=>drawDino(g,w,h,opts[i],t));
    card.dataset.ok=i===ti?'1':'0';card.onclick=()=>actChoose(i===ti,card);grid.appendChild(card);
  });
  actAsk();
}
function actQuestion(){
  const T=actTarget;
  if(T.kind==='tpr'){const im=T.v.imp[lang];return lang==='de'?`${im} wie der Dino!`:lang==='en'?`${im} like the dino!`:`¡${im} como el dino!`;}
  if(T.kind==='verb'){const v=T.v;return lang==='de'?`Wer ${v.de[0]}?`:lang==='en'?`Who is ${v.en}?`:`¿Quién está ${v.es}?`;}
  if(T.kind==='adj'){const a=T.a;return lang==='de'?`Welcher Dino ist ${a.de}?`:lang==='en'?`Which dino is ${a.en}?`:`¿Qué dino ${a.es[1]} ${a.es[0]}?`;}
  if(T.kind==='prep'){const P=PREPS[T.p][lang],O=POBJ[T.obj][lang];
    return lang==='de'?`Welcher Dino ist ${P} ${O}?`:lang==='en'?`Which dino is ${P} ${O}?`:`¿Qué dino está ${P} ${O}?`;}
  if(T.kind==='neg'){const v=T.v;return lang==='de'?`Wer ${v.dn||v.de[0]+' nicht'}?`:lang==='en'?`Who is not ${v.en}?`:`¿Quién no está ${v.es}?`;}
  if(T.kind==='count'){const v=T.v;return lang==='de'?`Wie viele Dinos ${v.dp}?`:lang==='en'?`How many dinos are ${v.enp||v.en}?`:`¿Cuántos dinos están ${v.ep||v.es}?`;}
  if(T.kind==='obj'){const w=T.word,many=T.def.plural;
    if(many)return lang==='es'?`¿Dónde hay ${w}?`:lang==='de'?`Wo sind ${w}?`:`Which one has ${w}?`;
    const cop=['long'].includes(T.def.k)?'es':'está';
    return lang==='es'?`¿Cuál ${cop} ${w}?`:lang==='de'?`Welches ist ${w}?`:`Which one is ${w}?`;}
  const v=T.v,np=nounPhrase(T.adjs,true);
  return lang==='de'?`Finde ${np}, der ${v.de[1]}!`:lang==='en'?`Find ${np} that is ${v.en}!`:`¡Busca ${np} que está ${v.es}!`;
}
function actAsk(){
  if(!actTarget)return;
  const q=actQuestion();$('actPrompt').textContent=q;say(q);
}
function actAnswerHTML(){
  const T=actTarget,hl=x=>`<b>${x}</b>`;
  if(T.kind==='verb'||T.kind==='combo'||T.kind==='combo3')return dSentence(T.adjs,T.v,hl);
  if(T.kind==='adj')return dIs(T.a,hl);
  if(T.kind==='prep'){const P=PREPS[T.p][lang],O=POBJ[T.obj][lang],A=w=>`<span class="art g-m">${w}</span>`;
    if(lang==='de')return `${A('Der')} Dino ist ${hl(P+' '+O)}!`;
    if(lang==='en')return `The dino is ${hl(P)} ${O}!`;
    return `¡${A('El')} dino está ${hl(P)} ${O}!`;}
  if(T.kind==='neg'){const v=T.v,o=T.o;
    if(lang==='de')return `Er ${hl(v.dn||v.de[0]+' nicht')} – er ${hl(o.de[0])}!`;
    if(lang==='en')return `It is ${hl('not '+v.en)} – it is ${hl(o.en)}!`;
    return `¡${hl('No está '+v.es)}, está ${hl(o.es)}!`;}
  if(T.kind==='count'){const v=T.v,k=T.k,N={de:['','Ein','Zwei','Drei','Vier','Fünf'],en:['','One','Two','Three','Four','Five'],es:['','Un','Dos','Tres','Cuatro','Cinco']}[lang][k];
    if(lang==='de')return k===1?`${hl(N)} Dino ${hl(v.de[0])}!`:`${hl(N)} Dinos ${hl(v.dp)}!`;
    if(lang==='en')return k===1?`${hl(N)} dino is ${hl(v.en)}!`:`${hl(N)} dinos are ${hl(v.enp||v.en)}!`;
    return k===1?`¡${hl(N)} dino está ${hl(v.es)}!`:`¡${hl(N)} dinos están ${hl(v.ep||v.es)}!`;}
  return hl(T.word);
}
function actChoose(correct,el){
  ac();if(actDone)return;
  if(correct){
    actDone=true;el.classList.add('right');
    [...el.parentElement.children].forEach(c=>{if(c!==el)c.classList.add('dim');});
    bigWin();award(actMiss);
    const ch=adapt('act',ACT_MAX,actMiss===0);levelFx($('actLevel'),ch);
    const html=actAnswerHTML();$('actSentence').innerHTML=html;
    const plain=stripTags(html);say(plain);
    setTimeout(()=>{if(activeTab==='act'&&actMode==='quiz')newActRound();},Math.max(2800,700+plain.length*85));
  }else{
    actMiss++;nope();el.classList.remove('wrong');void el.offsetWidth;el.classList.add('wrong');
    const T=actTarget;
    if(actMiss===1){const w=T.kind==='prep'?PREPS[T.p][lang]:T.kind==='adj'?aW(T.a):T.kind==='obj'?T.word:T.v?vW(T.v):'';
      if(w){const k=lang+'|🦖 '+w;stats[k]=(stats[k]||0)+1;saveStats();}}
    if(actMiss===1)actAsk();
    else if(actMiss===2&&lang!=='es'){       // bridge through his strong language
      const own=T.kind==='prep'?PREPS[T.p][lang]:T.kind==='adj'?aW(T.a):T.kind==='obj'?T.word:vW(T.v),
            es=T.kind==='prep'?PREPS[T.p].es:T.kind==='adj'?T.a.es[0]:T.kind==='obj'?T.def.es[T.yes?0:1]:T.v.es;
      say(`${own}… ${es}`);
    }else if(actMiss>=3){
      $('actGrid').querySelectorAll('[data-ok="1"]').forEach(c=>c.classList.add('hint'));
      actAsk();
    }
  }
}
$('tprDone').onclick=()=>{ac();bigWin();addPower();advTick('act');setTimeout(newActRound,900);};
$('actAgain').onclick=()=>{ac();if(actMode==='play')playSay();else actAsk();};
$('actSkip').onclick=()=>{ac();if(actMode==='quiz')newActRound();};

/* ---------- free play: he builds the sentence ---------- */
const PLAY={verb:'stand',adjs:{}};let playAnim=null;
function playAdjs(){return Object.values(PLAY.adjs).map(k=>DA(k));}
function playState(){return stOf(PLAY.verb==='stand'?null:DVERBS.find(v=>v.k===PLAY.verb),playAdjs(),0);}
function playSay(){
  const v=DVERBS.find(x=>x.k===PLAY.verb),hl=x=>`<b>${x}</b>`;
  const html=v?dSentence(playAdjs(),v,hl):nounPhrase(playAdjs(),false,hl,true)+'.';
  $('playSentence').innerHTML=html;say(stripTags(html));
}
function buildPlay(){
  const groups=[['size',['small','big']],['color',['red','blue','yellow','green']],
                ['mood',['happy','sad','angry','scared','surprised','tired']],['wet',['wet']],['dirt',['dirty','clean']],['age',['old','young']]];
  const IC={small:'🐭',big:'🐘',red:'🟥',blue:'🟦',yellow:'🟨',green:'🟩',happy:'😀',sad:'😢',angry:'😠',scared:'😱',
            surprised:'😮',tired:'😴',wet:'💧',dirty:'🟫',clean:'✨',old:'👴',young:'🧢'};
  const box=$('playAdj');box.innerHTML='';
  groups.forEach(([dim,keys])=>keys.forEach(k=>{
    const b=document.createElement('button');b.className='pchip'+(PLAY.adjs[dim]===k?' on':'');b.textContent=IC[k];
    b.onclick=()=>{ac();if(PLAY.adjs[dim]===k)delete PLAY.adjs[dim];else{PLAY.adjs[dim]=k;say(dIs(DA(k)));}
      buildPlay();$('playSentence').innerHTML=PLAY.verb==='stand'?dIs(DA(k),x=>`<b>${x}</b>`):dSentence(playAdjs(),DVERBS.find(v=>v.k===PLAY.verb),x=>`<b>${x}</b>`);};
    box.appendChild(b);}));
  const vb=$('playVerbs');vb.innerHTML='';
  DVERBS.forEach(v=>{const b=document.createElement('button');b.className='pverb'+(PLAY.verb===v.k?' on':'');b.textContent=v.ic;
    b.onclick=()=>{ac();PLAY.verb=v.k;buildPlay();playSay();};vb.appendChild(b);});
}
function playLoop(){
  if(activeTab!=='act'||(actMode!=='play'&&actMode!=='parrot')){playAnim=null;return;}
  const cn=$(actMode==='play'?'playCv':'parrotCv'),r=cn.getBoundingClientRect();
  if(r.width){const dpr=Math.min(window.devicePixelRatio||1,2.5),w=Math.round(r.width*dpr);
    if(cn.width!==w){cn.width=w;cn.height=w;}const g=cn.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);
    const t=performance.now()/1000;if(actMode==='play')drawDino(g,r.width,r.width,playState(),t);else drawParrot(g,r.width,t);}
  playAnim=requestAnimationFrame(playLoop);
}
$('playCv').onclick=()=>{ac();playSay();};

/* ---------- 🦜 parrot: hear it, say it, hear yourself ----------
   No grading — speech recognition is unreliable with children's voices.
   Hearing his own voice right after the model voice is the useful part. */
let PARROT=null,recorder=null,recTimer=null,recT0=0;
function parrotNext(){
  stopRec(true);
  if(Math.random()<0.6){
    const v=pick(DVERBS),dims=FACE_VERBS.includes(v.k)?['size','color']:['size','color','mood'];
    const adjs=Math.random()<0.55?[pick(DADJ.filter(a=>dims.includes(a.dim)))]:[];
    const html=dSentence(adjs,v,x=>`<b>${x}</b>`);PARROT={kind:'dino',st:stOf(v,adjs,0),html};
  }else{const it=pick(VOCAB.filter(x=>x.c!=='form'));PARROT={kind:'noun',e:it.e,html:nounHTML(it)};}
  PARROT.text=stripTags(PARROT.html);PARROT.cheer=0;
  $('parrotText').innerHTML=PARROT.html;$('parrotMsg').textContent='';
  setTimeout(()=>say(PARROT.text),250);
}
function parrotMsg(k){$('parrotMsg').textContent={
  you:{es:'🎤 ¡Ahora tú!',en:'🎤 Now you!',de:'🎤 Jetzt du!'},
  nomic:{es:'🎤 El micrófono no está disponible aquí.',en:'🎤 The microphone is not available here.',de:'🎤 Das Mikrofon ist hier nicht verfügbar.'},
  short:{es:'¡Mantén pulsado un poco más!',en:'A little longer!',de:'Ein bisschen länger!'}}[k][lang];}
async function startRec(){
  if(recorder)return;
  if(!navigator.mediaDevices||!window.MediaRecorder){parrotMsg('nomic');return;}
  try{speechSynthesis.cancel();}catch(e){}
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    const chunks=[];recorder=new MediaRecorder(stream);
    recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data);};
    recorder.onstop=()=>{
      stream.getTracks().forEach(t=>t.stop());               // release the mic straight away
      const dur=performance.now()-recT0,type=(recorder&&recorder.mimeType)||'audio/mp4';recorder=null;
      $('parrotRec').classList.remove('rec');$('parrotRec').textContent='🎤';
      if(recorder===null&&recT0<0)return;                    // cancelled
      if(dur<500||!chunks.length){parrotMsg('short');return;}
      const a=new Audio(URL.createObjectURL(new Blob(chunks,{type})));
      // recordings often carry no duration, so "ended" may never fire: fall back to a timer
      let done=false;const cheer=()=>{if(done||!PARROT)return;done=true;PARROT.cheer=performance.now();bigWin();
        say({es:'¡Muy bien!',en:'Well done!',de:'Super gemacht!'}[lang]);
        if(!PARROT.paid){PARROT.paid=1;addPower(1);}};
      a.onended=cheer;setTimeout(cheer,dur+700);
      a.play().catch(cheer);
    };
    recT0=performance.now();recorder.start();
    $('parrotRec').classList.add('rec');$('parrotRec').textContent='⏹';$('parrotMsg').textContent='';
    clearTimeout(recTimer);recTimer=setTimeout(()=>stopRec(),7000);
  }catch(e){recorder=null;parrotMsg('nomic');}
}
function stopRec(cancel){
  clearTimeout(recTimer);
  if(recorder&&recorder.state==='recording'){if(cancel)recT0=-1;recorder.stop();}
  $('parrotRec').classList.remove('rec');$('parrotRec').textContent='🎤';
}
$('parrotRec').onclick=()=>{ac();if(recorder&&recorder.state==='recording')stopRec();else startRec();};
$('parrotHear').onclick=()=>{ac();if(PARROT)say(PARROT.text);};
$('parrotNext').onclick=()=>{ac();parrotNext();};
function drawParrot(g,W,t){
  const P=PARROT;if(!P)return;
  const cheering=P.cheer&&performance.now()-P.cheer<2200;
  if(P.kind==='dino')drawDino(g,W,W,cheering?Object.assign({},P.st,{verb:'jump'}):P.st,t);
  else{drawDino(g,W,W,{verb:cheering?'jump':'stand',size:0.55},t);
    g.save();g.font=`${W*0.34}px serif`;g.textAlign='center';g.textBaseline='middle';g.fillText(P.e,W*0.3,W*0.32+Math.sin(t*2)*W*0.01);g.restore();}
}
function setActMode(m){
  if(actMode==='parrot'&&m!=='parrot')stopRec(true);
  actMode=m;
  $('actQuiz').classList.toggle('on',m==='quiz');$('actPlay').classList.toggle('on',m==='play');$('actParrot').classList.toggle('on',m==='parrot');
  $('actLevel').style.visibility=m==='quiz'?'visible':'hidden';$('actSkip').style.display=m==='quiz'?'':'none';
  $('actTools').style.display=m==='parrot'?'none':'';
  buildActModes();
  if(m==='parrot'){actAnim=[];parrotNext();if(!playAnim)playAnim=requestAnimationFrame(playLoop);return;}
  if(m==='play'){actAnim=[];buildPlay();$('playSentence').innerHTML='';if(!playAnim)playAnim=requestAnimationFrame(playLoop);
    say({es:'¡Elige qué hace el dino!',en:'Choose what the dino does!',de:'Such aus, was der Dino macht!'}[lang]);}
  else newActRound();
}
function buildActModes(){
  const box=$('actModes');box.innerHTML='';
  [['quiz','🎯 '+{es:'Juego',en:'Quiz',de:'Quiz'}[lang]],['play','🎮 '+{es:'Libre',en:'Play',de:'Spielen'}[lang]],['parrot','🦜']].forEach(([m,l])=>{
    const b=document.createElement('button');b.className='seg'+(actMode===m?' on':'');b.textContent=l;
    b.onclick=()=>{ac();if(actMode!==m)setActMode(m);};box.appendChild(b);});
}
function showAct(){buildActModes();if(actMode==='parrot'){if(!PARROT)parrotNext();if(!playAnim)playAnim=requestAnimationFrame(playLoop);}else if(actMode==='play'){buildPlay();if(!playAnim)playAnim=requestAnimationFrame(playLoop);}else newActRound();}
