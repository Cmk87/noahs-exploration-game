#!/usr/bin/env python3
"""Build body/<id>.webp (512x512 q70) + body/body.json + contact-sheet.jpg for the 'My Body' section.
Same item schema as vehicles.json / people.json (names.full used by js/photo.js), plus optional
"overview": true (group cover / system overview) and "touchable": true (child can touch/feel it)."""
import json, os, unicodedata
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
SRC, OUT = os.path.join(HERE, "src"), os.path.join(HERE, "body")

GROUPS = [
 ("bones","Bones","Los huesos","Die Knochen","🦴"),
 ("muscles","Muscles","Los músculos","Die Muskeln","💪"),
 ("heart","Heart & blood","El corazón y la sangre","Herz und Blut","❤️"),
 ("lungs","Breathing","La respiración","Die Atmung","🌬️"),
 ("brain","Brain & nerves","El cerebro y los nervios","Gehirn und Nerven","🧠"),
 ("tummy","Tummy & food","La barriga y la comida","Bauch und Essen","🍎"),
 ("senses","Five senses","Los cinco sentidos","Die fünf Sinne","👀"),
 ("skin","Skin, hair & teeth","La piel, el pelo y los dientes","Haut, Haare und Zähne","🪥"),
 ("touch","Touch your body","Toca tu cuerpo","Berühr deinen Körper","👆"),
]

S = {  # sound keys -> TTS text (en, es, de)
 "heartbeat": ("ba-dum ba-dum","pum-pum pum-pum","bumm-bumm bumm-bumm"),
 "breathing": ("whoosh","fuuuu","puuuh"),
 "yawn":      ("aaah","aaah","aaah"),
 "rumble":    ("grumble rumble","gruuu gruuu","grummel grummel"),
 "sneeze":    ("achoo","achís","hatschi"),
 "chewing":   ("chomp chomp","ñam ñam","mampf mampf"),
 "snore":     ("zzz","zzz","chrrr"),
}

# (id, group, en_noun, (es_art, es_noun, es_gender[, 'pl']), (de_art, de_noun, de_gender[, 'pl']),
#  sound_key|None, flags, [fact1(en,es,de), fact2(en,es,de)])   flags: o=overview t=touchable
C = [
# ---------------- bones
("skeleton","bones","skeleton",("el","esqueleto","m"),("das","Skelett","n"),None,"o",[
 ("Your skeleton holds you up – without it you would be floppy like jelly!","Tu esqueleto te sostiene: ¡sin él estarías blandito como una gelatina!","Dein Skelett hält dich aufrecht – ohne es wärst du wabbelig wie Wackelpudding!"),
 ("Grown-ups have about 206 bones. Babies are born with about 300, and some join together as they grow.","Los adultos tienen unos 206 huesos. Los bebés nacen con unos 300, y algunos se unen al crecer.","Erwachsene haben etwa 206 Knochen. Babys kommen mit etwa 300 auf die Welt, und manche wachsen zusammen.")]),
("skull","bones","skull",("el","cráneo","m"),("der","Schädel","m"),None,"",[
 ("Your skull is a strong helmet made of bone that keeps your brain safe.","Tu cráneo es un casco fuerte de hueso que protege tu cerebro.","Dein Schädel ist ein starker Helm aus Knochen, der dein Gehirn schützt."),
 ("A baby's skull has soft spots that slowly close up as the baby grows.","El cráneo de un bebé tiene partes blanditas que se cierran poco a poco al crecer.","Der Schädel eines Babys hat weiche Stellen, die sich beim Wachsen langsam schließen.")]),
("ribs","bones","ribs",("las","costillas","f","pl"),("die","Rippen","pl","pl"),None,"t",[
 ("Your ribs make a cage that protects your heart and lungs.","Tus costillas forman una jaula que protege tu corazón y tus pulmones.","Deine Rippen bilden einen Korb, der dein Herz und deine Lunge schützt."),
 ("Most people have 24 ribs – 12 on each side.","La mayoría de las personas tiene 24 costillas: 12 a cada lado.","Die meisten Menschen haben 24 Rippen – 12 auf jeder Seite.")]),
("spine","bones","spine",("la","columna vertebral","f"),("die","Wirbelsäule","f"),None,"t",[
 ("Your spine is made of many small bones stacked up like a tower of blocks.","Tu columna está hecha de muchos huesitos apilados como una torre de bloques.","Deine Wirbelsäule besteht aus vielen kleinen Knochen, gestapelt wie ein Turm aus Bauklötzen."),
 ("Your spine lets you bend, twist and touch your toes.","Tu columna te deja doblarte, girar y tocarte los dedos de los pies.","Mit deiner Wirbelsäule kannst du dich bücken, drehen und deine Zehen berühren.")]),
("femur","bones","thigh bone",("el","fémur","m"),("der","Oberschenkelknochen","m"),None,"t",[
 ("The thigh bone is the longest bone in your body.","El fémur es el hueso más largo de tu cuerpo.","Der Oberschenkelknochen ist der längste Knochen in deinem Körper."),
 ("It is also super strong – it carries you when you walk, run and jump.","También es súper fuerte: te sostiene cuando caminas, corres y saltas.","Er ist auch super stark – er trägt dich beim Gehen, Rennen und Springen.")]),
# ---------------- muscles
("muscles","muscles","muscles",("los","músculos","m","pl"),("die","Muskeln","pl","pl"),None,"o",[
 ("You have more than 600 muscles that help you move.","Tienes más de 600 músculos que te ayudan a moverte.","Du hast mehr als 600 Muskeln, die dir helfen, dich zu bewegen."),
 ("Muscles pull on your bones to move them, like the strings on a puppet.","Los músculos tiran de los huesos para moverlos, como los hilos de una marioneta.","Muskeln ziehen an deinen Knochen und bewegen sie, wie die Fäden einer Marionette.")]),
("biceps","muscles","biceps",("el","bíceps","m"),("der","Bizeps","m"),None,"t",[
 ("Your biceps is the muscle at the front of your upper arm. Bend your arm to feel it!","El bíceps es el músculo de la parte delantera del brazo. ¡Dobla el brazo para sentirlo!","Der Bizeps ist der Muskel vorne an deinem Oberarm. Beug deinen Arm und fühl ihn!"),
 ("It gets shorter and fatter when it pulls your arm up.","Se hace más corto y gordito cuando sube tu brazo.","Er wird kürzer und dicker, wenn er deinen Arm hochzieht.")]),
("tummy-muscles","muscles","tummy muscles",("los","abdominales","m","pl"),("die","Bauchmuskeln","pl","pl"),None,"t",[
 ("Your tummy muscles help you sit up and stand tall.","Los abdominales te ayudan a sentarte y a estar derecho.","Deine Bauchmuskeln helfen dir beim Aufsetzen und halten dich aufrecht."),
 ("They squeeze when you laugh, cough or sneeze!","¡Se aprietan cuando te ríes, toses o estornudas!","Sie spannen sich an, wenn du lachst, hustest oder niest!")]),
("smile","muscles","smile",("la","sonrisa","f"),("das","Lächeln","n"),None,"t",[
 ("Your face has lots of little muscles that help you smile, frown and make funny faces.","Tu cara tiene muchos musculitos que te ayudan a sonreír, fruncir el ceño y poner caras graciosas.","Dein Gesicht hat viele kleine Muskeln zum Lächeln, Stirnrunzeln und Grimassenschneiden."),
 ("Smiles are catching – when you smile at someone, they often smile back!","Las sonrisas se contagian: cuando sonríes a alguien, ¡muchas veces te sonríe también!","Lächeln steckt an – wenn du jemanden anlächelst, lächelt er oft zurück!")]),
("calf","muscles","calf",("la","pantorrilla","f"),("die","Wade","f"),None,"t",[
 ("Your calf is the muscle at the back of your leg, below the knee.","La pantorrilla es el músculo de la parte de atrás de la pierna, debajo de la rodilla.","Die Wade ist der Muskel hinten an deinem Bein, unter dem Knie."),
 ("It lifts your heels so you can stand on tiptoe and jump.","Levanta tus talones para que te pongas de puntillas y saltes.","Sie hebt deine Fersen, damit du auf Zehenspitzen stehen und springen kannst.")]),
# ---------------- heart & blood
("blood","heart","blood",("la","sangre","f"),("das","Blut","n"),"heartbeat","o",[
 ("Blood travels all around your body, carrying food and air to every part.","La sangre viaja por todo tu cuerpo llevando comida y aire a cada parte.","Blut reist durch deinen ganzen Körper und bringt Nahrung und Luft überallhin."),
 ("Your blood is red because of tiny red blood cells.","Tu sangre es roja por unas células diminutas: los glóbulos rojos.","Dein Blut ist rot wegen winziger roter Blutkörperchen.")]),
("heart","heart","heart",("el","corazón","m"),("das","Herz","n"),"heartbeat","t",[
 ("Your heart is a muscle about the size of your fist.","Tu corazón es un músculo más o menos del tamaño de tu puño.","Dein Herz ist ein Muskel, ungefähr so groß wie deine Faust."),
 ("It pumps blood all day and all night, even while you sleep.","Bombea sangre todo el día y toda la noche, incluso mientras duermes.","Es pumpt Tag und Nacht Blut, sogar wenn du schläfst.")]),
("heartbeat","heart","heartbeat",("el","latido","m"),("der","Herzschlag","m"),"heartbeat","t",[
 ("Your heart beats about 100,000 times every day!","¡Tu corazón late unas 100.000 veces cada día!","Dein Herz schlägt etwa 100.000 Mal am Tag!"),
 ("Doctors listen to your heartbeat with a stethoscope. When you run, it beats faster.","Los médicos escuchan tu latido con un estetoscopio. Cuando corres, late más rápido.","Ärzte hören deinen Herzschlag mit einem Stethoskop ab. Wenn du rennst, schlägt es schneller.")]),
("blood-vessels","heart","blood vessels",("los","vasos sanguíneos","m","pl"),("die","Blutgefäße","pl","pl"),None,"",[
 ("Blood vessels are tiny tubes that carry blood all over your body, like roads.","Los vasos sanguíneos son tubitos que llevan la sangre por todo el cuerpo, como carreteras.","Blutgefäße sind kleine Röhren, die Blut durch den ganzen Körper bringen, wie Straßen."),
 ("You can see some of them as bluish lines under the skin of your wrist.","Puedes ver algunos como líneas azuladas bajo la piel de tu muñeca.","Manche kannst du als bläuliche Linien unter der Haut an deinem Handgelenk sehen.")]),
("red-blood-cells","heart","red blood cells",("los","glóbulos rojos","m","pl"),("die","roten Blutkörperchen","pl","pl"),None,"",[
 ("Red blood cells are so tiny that you need a microscope to see them.","Los glóbulos rojos son tan pequeños que necesitas un microscopio para verlos.","Rote Blutkörperchen sind so winzig, dass man ein Mikroskop braucht, um sie zu sehen."),
 ("They carry air (oxygen) from your lungs to the rest of your body.","Llevan el aire (oxígeno) de tus pulmones al resto del cuerpo.","Sie bringen Luft (Sauerstoff) von deiner Lunge in den ganzen Körper.")]),
# ---------------- lungs & breathing
("breathing","lungs","breathing",("la","respiración","f"),("die","Atmung","f"),"breathing","o",[
 ("You breathe air in through your nose and mouth, all day and all night.","Respiras aire por la nariz y la boca todo el día y toda la noche.","Du atmest Tag und Nacht Luft durch Nase und Mund ein."),
 ("You breathe without even thinking about it – even when you sleep!","Respiras sin pensar en ello, ¡incluso cuando duermes!","Du atmest, ohne darüber nachzudenken – sogar im Schlaf!")]),
("lungs","lungs","lungs",("los","pulmones","m","pl"),("die","Lunge","f"),"breathing","",[
 ("Your lungs fill up with air like two balloons when you breathe in.","Tus pulmones se llenan de aire como dos globos cuando respiras.","Deine Lunge füllt sich beim Einatmen mit Luft wie zwei Luftballons."),
 ("Your left lung is a little smaller, to make room for your heart.","El pulmón izquierdo es un poco más pequeño para dejar sitio al corazón.","Der linke Lungenflügel ist etwas kleiner, damit Platz für dein Herz ist.")]),
("windpipe","lungs","windpipe",("la","tráquea","f"),("die","Luftröhre","f"),None,"t",[
 ("The windpipe is the tube that carries air from your nose and mouth down to your lungs.","La tráquea es el tubo que lleva el aire de la nariz y la boca a los pulmones.","Die Luftröhre ist das Rohr, das Luft von Nase und Mund zur Lunge bringt."),
 ("It has strong rings that keep it open, like a bendy straw.","Tiene anillos fuertes que la mantienen abierta, como una pajita que se dobla.","Sie hat feste Ringe, die sie offen halten, wie ein Knickstrohhalm.")]),
("breath","lungs","breath",("el","aliento","m"),("der","Atem","m"),"breathing","",[
 ("When you blow, air comes out of your lungs – that's how you blow a dandelion!","Cuando soplas, el aire sale de tus pulmones: ¡así soplas un diente de león!","Wenn du pustest, kommt Luft aus deiner Lunge – so pustest du eine Pusteblume!"),
 ("On a cold day you can see your breath, like a little cloud.","En un día frío puedes ver tu aliento, como una nubecita.","An kalten Tagen kannst du deinen Atem sehen, wie eine kleine Wolke.")]),
("yawn","lungs","yawn",("el","bostezo","m"),("das","Gähnen","n"),"yawn","",[
 ("You often yawn when you are tired or sleepy.","Muchas veces bostezas cuando estás cansado o tienes sueño.","Du gähnst oft, wenn du müde bist."),
 ("Yawns are catching – seeing someone yawn can make you yawn too!","Los bostezos se contagian: ¡ver a alguien bostezar puede hacerte bostezar!","Gähnen steckt an – wenn du jemanden gähnen siehst, musst du oft auch gähnen!")]),
# ---------------- brain & nerves
("nerves","brain","nerves",("los","nervios","m","pl"),("die","Nerven","pl","pl"),None,"o",[
 ("Nerves are like tiny wires that carry messages between your brain and your body.","Los nervios son como cables diminutos que llevan mensajes entre tu cerebro y tu cuerpo.","Nerven sind wie winzige Kabel, die Nachrichten zwischen Gehirn und Körper tragen."),
 ("Their messages arrive faster than you can blink!","¡Sus mensajes llegan más rápido que un parpadeo!","Ihre Nachrichten kommen schneller an, als du blinzeln kannst!")]),
("brain","brain","brain",("el","cerebro","m"),("das","Gehirn","n"),None,"",[
 ("Your brain is the boss of your body – it helps you think, remember, feel and move.","Tu cerebro es el jefe de tu cuerpo: te ayuda a pensar, recordar, sentir y moverte.","Dein Gehirn ist der Chef deines Körpers – es hilft dir zu denken, dich zu erinnern, zu fühlen und dich zu bewegen."),
 ("Your brain uses about one fifth of all your body's energy.","Tu cerebro usa más o menos una quinta parte de toda la energía de tu cuerpo.","Dein Gehirn verbraucht etwa ein Fünftel der ganzen Energie deines Körpers.")]),
("spinal-cord","brain","spinal cord",("la","médula espinal","f"),("das","Rückenmark","n"),None,"",[
 ("The spinal cord is a long bundle of nerves that runs down inside your spine.","La médula espinal es un largo manojo de nervios que baja por dentro de tu columna.","Das Rückenmark ist ein langer Strang aus Nerven, der in deiner Wirbelsäule nach unten läuft."),
 ("It carries messages between your brain and the rest of your body.","Lleva mensajes entre tu cerebro y el resto del cuerpo.","Es trägt Nachrichten zwischen deinem Gehirn und dem restlichen Körper.")]),
("neuron","brain","nerve cell",("la","neurona","f"),("die","Nervenzelle","f"),None,"",[
 ("Nerve cells pass messages along. Your brain has billions of them!","Las neuronas pasan mensajes. ¡Tu cerebro tiene miles de millones!","Nervenzellen geben Nachrichten weiter. Dein Gehirn hat Milliarden davon!"),
 ("They send their messages with tiny sparks of electricity.","Mandan sus mensajes con chispitas de electricidad.","Sie schicken ihre Nachrichten mit winzigen elektrischen Signalen.")]),
("sleep","brain","sleep",("el","sueño","m"),("der","Schlaf","m"),"snore","",[
 ("While you sleep, your brain tidies up everything you learned during the day.","Mientras duermes, tu cerebro ordena todo lo que aprendiste durante el día.","Während du schläfst, sortiert dein Gehirn alles, was du am Tag gelernt hast."),
 ("Children need more sleep than grown-ups because they are growing.","Los niños necesitan dormir más que los adultos porque están creciendo.","Kinder brauchen mehr Schlaf als Erwachsene, weil sie wachsen.")]),
# ---------------- tummy & digestion
("tummy","tummy","tummy",("la","barriga","f"),("der","Bauch","m"),"rumble","ot",[
 ("Your tummy turns food into energy so you can play.","Tu barriga convierte la comida en energía para que puedas jugar.","Dein Bauch macht aus Essen Energie, damit du spielen kannst."),
 ("Food takes a long trip through your body – it can take a day or more!","La comida hace un viaje largo por tu cuerpo: ¡puede tardar un día o más!","Essen macht eine lange Reise durch deinen Körper – das kann einen Tag oder länger dauern!")]),
("mouth","tummy","mouth",("la","boca","f"),("der","Mund","m"),"chewing","t",[
 ("Eating starts in your mouth: your teeth chop food into little pieces.","La digestión empieza en la boca: tus dientes cortan la comida en trocitos.","Die Verdauung beginnt im Mund: Deine Zähne zerkleinern das Essen."),
 ("Spit (saliva) makes food soft and slippery so it is easy to swallow.","La saliva hace la comida blandita y resbaladiza para tragarla fácilmente.","Spucke macht das Essen weich und glitschig, damit du es leicht schlucken kannst.")]),
("stomach","tummy","stomach",("el","estómago","m"),("der","Magen","m"),"rumble","",[
 ("Your stomach is a stretchy bag that mashes up your food.","Tu estómago es una bolsa elástica que tritura la comida.","Dein Magen ist ein dehnbarer Beutel, der dein Essen zermatscht."),
 ("When your stomach is empty it can rumble – that means you're hungry!","Cuando tu estómago está vacío puede hacer ruido: ¡eso es que tienes hambre!","Wenn dein Magen leer ist, kann er knurren – dann hast du Hunger!")]),
("intestines","tummy","intestines",("los","intestinos","m","pl"),("der","Darm","m"),None,"",[
 ("Your intestines are a very long tube, all folded up inside your tummy.","Los intestinos son un tubo larguísimo, todo doblado dentro de tu barriga.","Dein Darm ist ein sehr langer Schlauch, der in deinem Bauch zusammengefaltet ist."),
 ("The small intestine is several metres long – much longer than your bed!","El intestino delgado mide varios metros, ¡mucho más que tu cama!","Der Dünndarm ist mehrere Meter lang – viel länger als dein Bett!")]),
("liver","tummy","liver",("el","hígado","m"),("die","Leber","f"),None,"",[
 ("The liver is the biggest organ inside your body.","El hígado es el órgano más grande dentro de tu cuerpo.","Die Leber ist das größte Organ im Inneren deines Körpers."),
 ("It works like a cleaner, taking away things your body doesn't need.","Trabaja como un limpiador, quitando lo que tu cuerpo no necesita.","Sie arbeitet wie eine Putzkraft und räumt weg, was dein Körper nicht braucht.")]),
# ---------------- five senses
("senses","senses","five senses",("los","cinco sentidos","m","pl"),("die","fünf Sinne","pl","pl"),None,"o",[
 ("You have five senses: seeing, hearing, smelling, tasting and touching.","Tienes cinco sentidos: la vista, el oído, el olfato, el gusto y el tacto.","Du hast fünf Sinne: Sehen, Hören, Riechen, Schmecken und Fühlen."),
 ("Your senses send messages to your brain about the world around you.","Tus sentidos mandan mensajes a tu cerebro sobre el mundo que te rodea.","Deine Sinne schicken deinem Gehirn Nachrichten über die Welt um dich herum.")]),
("eye","senses","eye",("el","ojo","m"),("das","Auge","n"),None,"",[
 ("Your eyes help you see colours, shapes and things that move.","Tus ojos te ayudan a ver colores, formas y cosas que se mueven.","Deine Augen helfen dir, Farben, Formen und Bewegungen zu sehen."),
 ("You blink many times every minute to keep your eyes clean and wet.","Parpadeas muchas veces cada minuto para mantener tus ojos limpios y húmedos.","Du blinzelst jede Minute viele Male, damit deine Augen sauber und feucht bleiben.")]),
("ear","senses","ear",("la","oreja","f"),("das","Ohr","n"),None,"t",[
 ("The smallest bone in your body is inside your ear – it is smaller than a grain of rice!","El hueso más pequeño de tu cuerpo está dentro del oído: ¡es más pequeño que un grano de arroz!","Der kleinste Knochen deines Körpers sitzt in deinem Ohr – er ist kleiner als ein Reiskorn!"),
 ("Your ears also help you keep your balance.","Tus oídos también te ayudan a mantener el equilibrio.","Deine Ohren helfen dir auch, das Gleichgewicht zu halten.")]),
("nose","senses","nose",("la","nariz","f"),("die","Nase","f"),"sneeze","t",[
 ("Your nose can tell apart thousands of different smells.","Tu nariz puede distinguir miles de olores diferentes.","Deine Nase kann tausende verschiedene Gerüche unterscheiden."),
 ("A sneeze blows tickly dust out of your nose – achoo!","Un estornudo saca el polvo que te hace cosquillas en la nariz: ¡achís!","Ein Niesen pustet kitzeligen Staub aus deiner Nase – hatschi!")]),
("tongue","senses","tongue",("la","lengua","f"),("die","Zunge","f"),None,"",[
 ("Your tongue has thousands of tiny taste buds for sweet, salty, sour and bitter.","Tu lengua tiene miles de papilas gustativas para lo dulce, lo salado, lo ácido y lo amargo.","Deine Zunge hat tausende winzige Geschmacksknospen für süß, salzig, sauer und bitter."),
 ("Your tongue helps you talk and moves food around when you chew.","Tu lengua te ayuda a hablar y mueve la comida cuando masticas.","Deine Zunge hilft dir beim Sprechen und schiebt beim Kauen das Essen herum.")]),
("fingertips","senses","fingertips",("las","yemas de los dedos","f","pl"),("die","Fingerspitzen","pl","pl"),None,"t",[
 ("Your fingertips are extra good at feeling soft, rough, hot and cold.","Las yemas de tus dedos sienten muy bien lo suave, lo áspero, lo caliente y lo frío.","Deine Fingerspitzen können besonders gut fühlen: weich, rau, warm und kalt."),
 ("People who cannot see can read with their fingertips, using bumpy dots called Braille.","Las personas ciegas pueden leer con las yemas de los dedos, con puntitos en relieve llamados braille.","Blinde Menschen können mit den Fingerspitzen lesen – mit kleinen erhabenen Punkten, der Brailleschrift.")]),
# ---------------- skin, hair & teeth
("skin","skin","skin",("la","piel","f"),("die","Haut","f"),None,"ot",[
 ("Your skin is the biggest organ of your body.","La piel es el órgano más grande de tu cuerpo.","Deine Haut ist das größte Organ deines Körpers."),
 ("It keeps germs out – and it needs sunscreen to stay safe in the sun.","Te protege de los gérmenes, y necesita crema solar para cuidarse del sol.","Sie hält Keime fern – und braucht Sonnencreme, um in der Sonne geschützt zu sein.")]),
("hair","skin","hair",("el","pelo","m"),("die","Haare","pl","pl"),None,"t",[
 ("Your hair grows about 1 centimetre every month.","Tu pelo crece más o menos 1 centímetro cada mes.","Deine Haare wachsen etwa 1 Zentimeter im Monat."),
 ("A haircut doesn't hurt, because hair has no feeling.","Cortarte el pelo no duele, porque el pelo no siente.","Haareschneiden tut nicht weh, weil Haare nichts spüren.")]),
("teeth","skin","teeth",("los","dientes","m","pl"),("die","Zähne","pl","pl"),"chewing","t",[
 ("Children have 20 baby teeth. Later they fall out and grown-up teeth grow in.","Los niños tienen 20 dientes de leche. Luego se caen y salen los dientes definitivos.","Kinder haben 20 Milchzähne. Später fallen sie aus und die bleibenden Zähne wachsen nach."),
 ("Brushing your teeth twice a day keeps them strong and clean.","Cepillarte los dientes dos veces al día los mantiene fuertes y limpios.","Zweimal am Tag Zähneputzen hält deine Zähne stark und sauber.")]),
("fingernail","skin","fingernail",("la","uña","f"),("der","Fingernagel","m"),None,"t",[
 ("Fingernails grow faster than toenails.","Las uñas de las manos crecen más rápido que las de los pies.","Fingernägel wachsen schneller als Fußnägel."),
 ("Nails are made of the same stuff as your hair, called keratin.","Las uñas están hechas del mismo material que el pelo: la queratina.","Nägel bestehen aus dem gleichen Stoff wie deine Haare: Keratin.")]),
("fingerprint","skin","fingerprint",("la","huella dactilar","f"),("der","Fingerabdruck","m"),None,"t",[
 ("Nobody else in the whole world has the same fingerprints as you – not even twins!","Nadie en el mundo tiene las mismas huellas que tú, ¡ni siquiera los gemelos!","Niemand auf der ganzen Welt hat die gleichen Fingerabdrücke wie du – nicht einmal Zwillinge!"),
 ("Your fingerprints were already there before you were born.","Tus huellas ya estaban ahí antes de que nacieras.","Deine Fingerabdrücke waren schon da, bevor du geboren wurdest.")]),
# ---------------- touch your body
("head","touch","head",("la","cabeza","f"),("der","Kopf","m"),None,"t",[
 ("Your head holds your brain, and it has your eyes, ears, nose and mouth.","Tu cabeza guarda tu cerebro, y en ella están tus ojos, orejas, nariz y boca.","In deinem Kopf ist dein Gehirn, und an ihm sind Augen, Ohren, Nase und Mund."),
 ("Babies have big heads compared to their bodies. The body catches up as you grow!","Los bebés tienen la cabeza grande comparada con su cuerpo. ¡El cuerpo la alcanza al crecer!","Babys haben im Vergleich zum Körper einen großen Kopf. Der Körper holt beim Wachsen auf!")]),
("shoulders","touch","shoulders",("los","hombros","m","pl"),("die","Schultern","pl","pl"),None,"t",[
 ("Your shoulders let your arms swing round in a big circle.","Tus hombros dejan que tus brazos giren en un círculo grande.","Mit deinen Schultern kannst du deine Arme im großen Kreis schwingen."),
 ("Shrug your shoulders up and down – that means \"I don't know!\"","Sube y baja los hombros: ¡eso significa «no sé»!","Zieh die Schultern hoch – das heißt „Weiß ich nicht!“")]),
("arm","touch","arm",("el","brazo","m"),("der","Arm","m"),None,"t",[
 ("Each arm has an upper arm, an elbow, a forearm and a hand.","Cada brazo tiene una parte de arriba, el codo, el antebrazo y la mano.","Jeder Arm hat einen Oberarm, einen Ellbogen, einen Unterarm und eine Hand."),
 ("Your arms help you hug, throw, climb and wave.","Tus brazos te ayudan a abrazar, lanzar, trepar y saludar.","Mit deinen Armen kannst du umarmen, werfen, klettern und winken.")]),
("elbow","touch","elbow",("el","codo","m"),("der","Ellbogen","m"),None,"t",[
 ("Your elbow bends like a door on a hinge.","Tu codo se dobla como una puerta con bisagra.","Dein Ellbogen beugt sich wie eine Tür im Scharnier."),
 ("Try to lick your elbow – almost nobody can do it!","Intenta chuparte el codo: ¡casi nadie puede!","Versuch mal, deinen Ellbogen abzulecken – das schafft fast niemand!")]),
("hand","touch","hand",("la","mano","f"),("die","Hand","f"),None,"t",[
 ("Each hand has five fingers: a thumb and four more.","Cada mano tiene cinco dedos: un pulgar y cuatro más.","Jede Hand hat fünf Finger: einen Daumen und vier weitere."),
 ("Your thumb can touch all your other fingers, so you can pick up tiny things.","Tu pulgar puede tocar todos los demás dedos, así puedes coger cosas pequeñitas.","Dein Daumen kann alle anderen Finger berühren – so kannst du winzige Dinge aufheben.")]),
("belly-button","touch","belly button",("el","ombligo","m"),("der","Bauchnabel","m"),"rumble","t",[
 ("Your belly button is where you were joined to your mum before you were born.","El ombligo es donde estabas unido a tu mamá antes de nacer.","Am Bauchnabel warst du mit deiner Mama verbunden, bevor du geboren wurdest."),
 ("Everybody has a belly button – some go in and some poke out.","Todo el mundo tiene ombligo: unos hacia dentro y otros hacia fuera.","Jeder hat einen Bauchnabel – manche gehen nach innen, manche nach außen.")]),
("knee","touch","knee",("la","rodilla","f"),("das","Knie","n"),None,"t",[
 ("Your knee bends so you can sit, kick and climb stairs.","Tu rodilla se dobla para que puedas sentarte, dar patadas y subir escaleras.","Dein Knie beugt sich, damit du sitzen, treten und Treppen steigen kannst."),
 ("A little round bone called the kneecap protects the front of your knee.","Un huesito redondo llamado rótula protege la parte de delante de tu rodilla.","Ein kleiner runder Knochen, die Kniescheibe, schützt dein Knie vorne.")]),
("foot","touch","foot",("el","pie","m"),("der","Fuß","m"),None,"t",[
 ("Each foot has 26 bones – that's a lot of bones!","Cada pie tiene 26 huesos, ¡muchísimos!","Jeder Fuß hat 26 Knochen – ganz schön viele!"),
 ("Your feet carry you everywhere: walking, running, hopping and dancing.","Tus pies te llevan a todas partes: a caminar, correr, saltar y bailar.","Deine Füße tragen dich überallhin: beim Gehen, Rennen, Hüpfen und Tanzen.")]),
("toes","touch","toes",("los","dedos de los pies","m","pl"),("die","Zehen","pl","pl"),None,"t",[
 ("You have five toes on each foot – ten altogether!","Tienes cinco dedos en cada pie: ¡diez en total!","Du hast fünf Zehen an jedem Fuß – zusammen zehn!"),
 ("Your toes help you balance and push off when you walk.","Tus dedos de los pies te ayudan a mantener el equilibrio y a impulsarte al caminar.","Deine Zehen helfen dir, das Gleichgewicht zu halten und dich beim Gehen abzustoßen.")]),
]

def es_article(art, noun, gender, plural):
    """Spanish: feminine singular nouns starting with a stressed a-/ha- take 'el' (el agua, el alma, el hacha)."""
    if gender == "f" and not plural and art == "la":
        n = unicodedata.normalize("NFD", noun.lower())
        first = noun.split()[0].lower()
        stressed_a = first in {"agua","alma","águila","aula","hacha","hambre","área","arma","ala","ama","asma","ave","haba","hada","habla","alga","ancla","ansia","arca","arpa","aspa","acta","asa"}
        if stressed_a or first.startswith(("á","há")):
            return "el"
    return art

def name_es(t):
    art, noun, g = t[0], t[1], t[2]; pl = len(t) > 3
    art = es_article(art, noun, g, pl)
    d = {"article": art, "noun": noun, "full": f"{art} {noun}", "gender": g}
    if pl: d["number"] = "pl"
    return d

def name_de(t):
    art, noun, g = t[0], t[1], t[2]; pl = len(t) > 3
    d = {"article": art, "noun": noun, "full": f"{art} {noun}", "gender": g}
    if pl: d["number"] = "pl"
    return d

def build():
    os.makedirs(OUT, exist_ok=True)
    items = []
    for cid, grp, en, es, de, snd, flags, facts in C:
        im = Image.open(os.path.join(SRC, cid + ".jpg")).convert("RGB")
        w, h = im.size; s = min(w, h)
        im = im.crop(((w-s)//2, (h-s)//2, (w-s)//2+s, (h-s)//2+s)).resize((512, 512), Image.LANCZOS)
        im.save(os.path.join(OUT, cid + ".webp"), "WEBP", quality=70, method=6)
        it = {"id": cid, "group": grp, "image": f"body/{cid}.webp",
              "names": {"en": {"article": "the", "noun": en, "full": f"the {en}"},
                        "es": name_es(es), "de": name_de(de)}}
        if snd: it["sound"] = dict(zip(("en","es","de"), S[snd])); it["soundKey"] = snd
        if "o" in flags: it["overview"] = True
        if "t" in flags: it["touchable"] = True
        it["facts"] = [dict(zip(("en","es","de"), f)) for f in facts]
        items.append(it)
    data = {"version": 1, "imageSize": 512, "format": "webp",
            "groups": [dict(id=g, en=a, es=b, de=c, emoji=e) for g, a, b, c, e in GROUPS],
            "body": items}
    with open(os.path.join(OUT, "body.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    return data

def validate(data):
    ids = set(); gids = {g["id"] for g in data["groups"]}
    for it in data["body"]:
        assert it["id"] not in ids, it["id"]; ids.add(it["id"])
        assert it["group"] in gids
        assert os.path.exists(os.path.join(HERE, it["image"])), it["image"]
        assert len(it["facts"]) == 2 and all(set(f) == {"en","es","de"} and all(f.values()) for f in it["facts"]), it["id"]
        es, de = it["names"]["es"], it["names"]["de"]
        pl = es.get("number") == "pl"
        exp = {("m",False):{"el"},("f",False):{"la","el"},("m",True):{"los"},("f",True):{"las"}}[(es["gender"],pl)]
        assert es["article"] in exp, it["id"]
        dexp = {"m":"der","f":"die","n":"das","pl":"die"}[de["gender"]]
        assert de["article"] == dexp, it["id"]
        assert (de["gender"] == "pl") == (de.get("number") == "pl"), it["id"]
    for g in data["groups"]:
        first = [i for i in data["body"] if i["group"] == g["id"]][0]
        print(f'{g["id"]:8s} {sum(1 for i in data["body"] if i["group"]==g["id"]):2d} cards  cover={first["id"]}')
    assert es_article("la", "agua", "f", False) == "el" and es_article("la", "almohada", "f", False) == "la"
    print("TOTAL", len(data["body"]), "OK")

def contact_sheet(data):
    T, P, LBL = 220, 10, 44
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15) if os.path.exists("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf") else ImageFont.load_default()
    bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22) if os.path.exists("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf") else font
    COLS = 6; rows = []
    for g in data["groups"]:
        its = [i for i in data["body"] if i["group"] == g["id"]]
        rows.append(("h", f'{g["en"]} · {g["es"]} · {g["de"]}  ({len(its)})'))
        for k in range(0, len(its), COLS): rows.append(("t", its[k:k+COLS]))
    W = P + COLS*(T+P); H = P + sum(36 if r[0]=="h" else T+LBL+P for r in rows)
    sheet = Image.new("RGB", (W, H), (250, 248, 242)); d = ImageDraw.Draw(sheet); y = P
    for kind, v in rows:
        if kind == "h":
            d.text((P, y+4), v, fill=(40,40,60), font=bold); y += 36; continue
        for c, it in enumerate(v):
            x = P + c*(T+P)
            sheet.paste(Image.open(os.path.join(HERE, it["image"])).resize((T, T)), (x, y))
            tag = ("★ " if it.get("overview") else "") + it["id"] + (" [touch]" if it.get("touchable") else "") + (" ♪" if it.get("sound") else "")
            d.text((x+2, y+T+2), tag, fill=(20,20,20), font=font)
            d.text((x+2, y+T+21), f'{it["names"]["es"]["full"]} / {it["names"]["de"]["full"]}'[:30], fill=(90,90,90), font=font)
        y += T+LBL+P
    sheet.save(os.path.join(HERE, "contact-sheet.jpg"), quality=85)
    print("contact sheet", W, H)

if __name__ == "__main__":
    data = build(); validate(data); contact_sheet(data)
