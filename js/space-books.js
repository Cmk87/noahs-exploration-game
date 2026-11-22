/* Planets and famous pictures. The orrery stays the main view.
   These two screens are grids: the pictures stay put, and the one he
   taps grows above them and is spoken in the language he is learning. */
const SPACE_PLANETS=[
 {id:'sun',img:'space/sun.webp',
  en:['the Sun','The Sun is a star. It is a huge ball of hot gas, and its light keeps Earth warm.'],
  de:['die Sonne','Die Sonne ist ein Stern. Sie ist eine riesige Kugel aus heißem Gas, und ihr Licht wärmt die Erde.'],
  es:['el Sol','El Sol es una estrella. Es una bola enorme de gas caliente, y su luz calienta la Tierra.']},
 {id:'mercury',img:'space/mercury.webp',
  en:['Mercury','Mercury is the closest planet to the Sun. It is a small rocky world, burning hot in the day and freezing at night.'],
  de:['Merkur','Merkur ist der Sonne am nächsten. Er ist eine kleine Felswelt, tagsüber sehr heiß und nachts eiskalt.'],
  es:['Mercurio','Mercurio es el planeta más cercano al Sol. Es un mundo pequeño y rocoso, muy caliente de día y helado de noche.']},
 {id:'venus',img:'space/venus.webp',
  en:['Venus','Venus is wrapped in thick clouds. It is the hottest planet, even hotter than Mercury.'],
  de:['Venus','Venus ist in dicke Wolken gehüllt. Sie ist der heißeste Planet, noch heißer als Merkur.'],
  es:['Venus','Venus está envuelto en nubes espesas. Es el planeta más caliente, incluso más que Mercurio.']},
 {id:'earth',img:'space/earth.webp',
  en:['Earth','Earth is our home. It has air, oceans, and life.'],
  de:['die Erde','Die Erde ist unser Zuhause. Sie hat Luft, Meere und Leben.'],
  es:['la Tierra','La Tierra es nuestro hogar. Tiene aire, mares y vida.']},
 {id:'moon',img:'space/moon.webp',
  en:['the Moon','The Moon goes around Earth. It is a rocky ball with no air, and we see it shine with sunlight.'],
  de:['der Mond','Der Mond kreist um die Erde. Er ist eine Felskugel ohne Luft, und wir sehen ihn im Sonnenlicht leuchten.'],
  es:['la Luna','La Luna da vueltas alrededor de la Tierra. Es una bola de roca sin aire, y la vemos brillar con la luz del Sol.']},
 {id:'mars',img:'space/mars.webp',
  en:['Mars','Mars is a cold rocky planet. Its dust makes it look red.'],
  de:['der Mars','Der Mars ist ein kalter Felsplanet. Sein Staub lässt ihn rot aussehen.'],
  es:['Marte','Marte es un planeta rocoso y frío. Su polvo lo hace ver rojo.']},
 {id:'jupiter',img:'space/jupiter.webp',
  en:['Jupiter','Jupiter is the biggest planet. It is a giant ball of gas, with a storm bigger than Earth.'],
  de:['der Jupiter','Jupiter ist der größte Planet. Er ist eine riesige Gaskugel, mit einem Sturm, der größer ist als die Erde.'],
  es:['Júpiter','Júpiter es el planeta más grande. Es una bola gigante de gas, con una tormenta más grande que la Tierra.']},
 {id:'saturn',img:'space/saturn.webp',
  en:['Saturn','Saturn is a gas giant. Its wide rings are made of pieces of ice.'],
  de:['der Saturn','Saturn ist ein Gasriese. Seine breiten Ringe bestehen aus Eisstücken.'],
  es:['Saturno','Saturno es un gigante de gas. Sus anillos anchos están hechos de trozos de hielo.']},
 {id:'uranus',img:'space/uranus.webp',
  en:['Uranus','Uranus is an ice giant far from the Sun. It spins tipped over on its side.'],
  de:['der Uranus','Uranus ist ein Eisriese weit weg von der Sonne. Er dreht sich auf der Seite.'],
  es:['Urano','Urano es un gigante de hielo lejos del Sol. Gira tumbado de lado.']},
 {id:'neptune',img:'space/neptune.webp',
  en:['Neptune','Neptune is the farthest planet from the Sun. It is cold, dark blue, and very windy.'],
  de:['der Neptun','Neptun ist der Sonne am fernsten. Er ist kalt, dunkelblau und sehr windig.'],
  es:['Neptuno','Neptuno es el planeta más lejano al Sol. Es frío, azul oscuro y muy ventoso.']}
];
const SPACE_PICS=[
 {id:'andromeda',img:'space/andromeda.webp',
  en:['Andromeda','Andromeda is another galaxy, a huge family of stars, like our Milky Way but very far away.'],
  de:['Andromeda','Andromeda ist eine andere Galaxie, eine riesige Familie von Sternen, wie unsere Milchstraße, aber sehr weit weg.'],
  es:['Andrómeda','Andrómeda es otra galaxia, una familia enorme de estrellas, como nuestra Vía Láctea, pero muy lejos.']},
 {id:'m87',img:'space/m87.webp',
  en:['a black hole','This is a real picture of a black hole. The bright ring is hot gas around a dark middle that light cannot leave.'],
  de:['ein schwarzes Loch','Das ist ein echtes Bild von einem schwarzen Loch. Der helle Ring ist heißes Gas um eine dunkle Mitte, aus der kein Licht herauskommt.'],
  es:['un agujero negro','Esta es una foto de verdad de un agujero negro. El anillo brillante es gas caliente alrededor de un centro oscuro del que no sale la luz.']},
 {id:'pillars',img:'space/pillars.webp',
  en:['the Pillars of Creation','These tall clouds are gas and dust. New stars are being born inside them.'],
  de:['die Säulen der Schöpfung','Diese hohen Wolken sind Gas und Staub. Darin werden neue Sterne geboren.'],
  es:['los Pilares de la Creación','Estas nubes altas son gas y polvo. Dentro nacen estrellas nuevas.']},
 {id:'milky',img:'space/milky.webp',
  en:['the Milky Way','This is our own galaxy, seen from inside it. Earth lives on a planet around one of these stars.'],
  de:['die Milchstraße','Das ist unsere eigene Galaxie, von innen gesehen. Die Erde kreist um einen dieser Sterne.'],
  es:['la Vía Láctea','Esta es nuestra propia galaxia, vista desde dentro. La Tierra gira alrededor de una de estas estrellas.']},
 {id:'orion',img:'space/orion.webp',
  en:['the Orion Nebula','The Orion Nebula is a bright cloud where baby stars are switching on.'],
  de:['der Orionnebel','Der Orionnebel ist eine helle Wolke, in der junge Sterne angehen.'],
  es:['la nebulosa de Orión','La nebulosa de Orión es una nube brillante donde se encienden estrellas bebés.']},
 {id:'rings',img:'space/rings.webp',
  en:['Saturn\'s rings','A spacecraft called Cassini looked down on Saturn. The rings are billions of pieces of ice.'],
  de:['Saturns Ringe','Eine Sonde namens Cassini hat von oben auf den Saturn geschaut. Die Ringe sind Milliarden Eisstücke.'],
  es:['los anillos de Saturno','Una nave llamada Cassini miró Saturno desde arriba. Los anillos son miles de millones de trozos de hielo.']},
 {id:'earthrise',img:'space/earthrise.webp',
  en:['Earthrise','Astronauts on Apollo 8 saw Earth rise over the Moon. Our whole world is that blue ball.'],
  de:['Erdaufgang','Astronauten von Apollo 8 sahen die Erde über dem Mond aufgehen. Unsere ganze Welt ist diese blaue Kugel.'],
  es:['el amanecer de la Tierra','Los astronautas del Apolo 8 vieron la Tierra salir sobre la Luna. Todo nuestro mundo es esa bola azul.']},
 {id:'crab',img:'space/crab.webp',
  en:['the Crab Nebula','The Crab Nebula is the cloud left after a star exploded long ago.'],
  de:['der Krebsnebel','Der Krebsnebel ist die Wolke, die blieb, nachdem vor langer Zeit ein Stern explodiert ist.'],
  es:['la nebulosa del Cangrejo','La nebulosa del Cangrejo es la nube que quedó cuando una estrella explotó hace mucho tiempo.']},
 {id:'carina',img:'space/carina.webp',
  en:['the Carina Nebula','The James Webb telescope saw these cliffs of gas. Stars are being born along the edge.'],
  de:['der Carinanebel','Das James-Webb-Teleskop hat diese Klippen aus Gas gesehen. Am Rand werden Sterne geboren.'],
  es:['la nebulosa de Carina','El telescopio James Webb vio estos acantilados de gas. En el borde nacen estrellas.']},
 {id:'deep',img:'space/deep.webp',
  en:['the Hubble Deep Field','Hubble stared at a tiny dark patch of sky and found thousands of galaxies.'],
  de:['das Hubble Deep Field','Hubble hat lange auf ein winziges dunkles Fleckchen Himmel geschaut und Tausende Galaxien gefunden.'],
  es:['el campo profundo del Hubble','Hubble miró mucho tiempo un trocito oscuro del cielo y encontró miles de galaxias.']}
];
const SPACE_BOOKS={
  planets:{icon:'🪐',en:'Planets',de:'Planeten',es:'Planetas',items:SPACE_PLANETS},
  pics:{icon:'🌌',en:'Famous pictures',de:'Berühmte Bilder',es:'Fotos famosas',items:SPACE_PICS}
};
let SPACEBOOK=null, SPACEPICK=null;
function spaceTabLabel(id){
  if(id==='sky')return {en:'Sky',de:'Himmel',es:'Cielo'}[lang];
  return SPACE_BOOKS[id][lang];
}
function spaceTabs(){
  const box=$('spaceTabs');if(!box)return;
  box.querySelectorAll('[data-space]').forEach(b=>{
    const id=b.dataset.space;
    b.classList.toggle('on',(id==='sky'&&!SPACEBOOK)||id===SPACEBOOK);
    const lab=b.querySelector('span');if(lab)lab.textContent=spaceTabLabel(id);
    b.setAttribute('aria-label',spaceTabLabel(id));
  });
}
function spaceHome(){
  SPACEBOOK=null;SPACEPICK=null;
  const sky=$('spaceSky'),book=$('spaceBook');
  if(sky)sky.hidden=false;
  if(book)book.hidden=true;
  spaceTabs();
  if(typeof fitSky==='function')fitSky();
}
function spaceOpen(kind){
  const book=SPACE_BOOKS[kind];if(!book)return;
  SPACEBOOK=kind;SPACEPICK=null;
  $('spaceSky').hidden=true;$('spaceBook').hidden=false;
  spaceTabs();
  spaceRender();
  say(book[lang]);
}
function spaceRender(){
  const book=SPACE_BOOKS[SPACEBOOK];if(!book)return;
  $('spaceBookTitle').textContent=book.icon+' '+book[lang];
  const grid=$('spaceGrid');
  grid.innerHTML=book.items.map(it=>`<button type="button" class="phAn${SPACEPICK===it.id?' on':''}" data-space-id="${it.id}" aria-label="${it[lang][0]}"><img src="${it.img}" alt="" draggable="false"></button>`).join('');
  const now=$('spaceNow');
  const item=book.items.find(it=>it.id===SPACEPICK);
  if(!item){now.hidden=true;now.innerHTML='';return;}
  now.hidden=false;
  now.innerHTML=`<img src="${item.img}" alt=""><div class="phName">${item[lang][0]}</div><p>${item[lang][1]}</p>`;
}
function spacePick(id){
  const book=SPACE_BOOKS[SPACEBOOK];if(!book)return;
  const item=book.items.find(it=>it.id===id);if(!item)return;
  SPACEPICK=id;spaceRender();
  const el=$('spaceNow');if(el)el.scrollIntoView({block:'nearest'});
  say(item[lang][0]+'. '+item[lang][1]);
}
function spaceRelang(){
  spaceTabs();
  if(SPACEBOOK)spaceRender();
}
document.getElementById('spaceTabs').addEventListener('click',e=>{
  const b=e.target.closest('[data-space]');if(!b)return;
  ac();
  if(b.dataset.space==='sky'){spaceHome();if(!spaceQuiz)selectPlanet(selected);}
  else spaceOpen(b.dataset.space);
});
document.getElementById('spaceGrid').addEventListener('click',e=>{
  const b=e.target.closest('[data-space-id]');if(!b)return;
  ac();spacePick(b.dataset.spaceId);
});
document.getElementById('spaceBack').onclick=()=>{ac();spaceHome();};
