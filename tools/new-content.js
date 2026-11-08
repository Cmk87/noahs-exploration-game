/* New photo-book entries. Applied by tools/apply-content.js.
   Names carry the article used by the voice. Two facts for animals,
   vehicles and things. Dinosaurs in the picture book have one sentence.
   The pictured black panther is a melanistic leopard. */
function n(enA, enN, esA, esN, esG, deA, deN, deG) {
  return {
    en: { article: enA, noun: enN, full: enA + ' ' + enN },
    es: { article: esA, noun: esN, full: esA + ' ' + esN, gender: esG },
    de: { article: deA, noun: deN, full: deA + ' ' + deN, gender: deG }
  };
}
function facts(rows) {
  return rows.map(r => ({ en: r[0], es: r[1], de: r[2] }));
}
function an(id, habitat, names, rows) {
  return { id, habitat, image: 'animals/' + id + '.webp', names, sound: null, facts: facts(rows) };
}
function veh(id, group, names, rows) {
  return { id, group, image: 'vehicles/' + id + '.webp', names, sound: null, facts: facts(rows) };
}
function thing(id, group, names, rows) {
  return { id, group, image: 'things/' + id + '.webp', names, facts: facts(rows) };
}
function dino(id, names, row) {
  return { id, image: 'dinos/' + id + '.webp', names, facts: [{ en: row[0], es: row[1], de: row[2] }] };
}

const animals = [
  an('donkey', 'farm', n('the', 'donkey', 'el', 'burro', 'm', 'der', 'Esel', 'm'), [
    ['A donkey has long ears and can carry a heavy pack on a rocky path.', 'El burro tiene las orejas largas y puede llevar una carga pesada por un camino de piedras.', 'Ein Esel hat lange Ohren und kann eine schwere Last über einen steinigen Weg tragen.'],
    ['A donkey can turn its ears to hear what is behind it.', 'El burro puede girar las orejas para oír lo que hay detrás.', 'Ein Esel kann die Ohren drehen und hört so, was hinter ihm ist.']
  ]),
  an('rooster', 'farm', n('the', 'rooster', 'el', 'gallo', 'm', 'der', 'Hahn', 'm'), [
    ['A rooster has a red comb on his head and long, shiny tail feathers.', 'El gallo tiene una cresta roja en la cabeza y plumas largas y brillantes en la cola.', 'Ein Hahn hat einen roten Kamm auf dem Kopf und lange, glänzende Schwanzfedern.'],
    ['The rooster stays with the hens and watches the farmyard.', 'El gallo se queda con las gallinas y vigila el corral.', 'Der Hahn bleibt bei den Hennen und passt auf den Hof auf.']
  ]),
  an('goose', 'farm', n('the', 'goose', 'el', 'ganso', 'm', 'die', 'Gans', 'f'), [
    ['A goose has a long neck and big webbed feet for swimming.', 'El ganso tiene el cuello largo y unas patas grandes con membrana para nadar.', 'Eine Gans hat einen langen Hals und große Schwimmfüße.'],
    ['When geese fly a long way, they travel together in a V shape.', 'Cuando los gansos vuelan muy lejos, van juntos formando una V.', 'Wenn Gänse weit fliegen, ziehen sie gemeinsam in einer V-Form.']
  ]),
  an('guinea-pig', 'pets', n('the', 'guinea pig', 'el', 'conejillo de indias', 'm', 'das', 'Meerschweinchen', 'n'), [
    ['A guinea pig is a small pet that likes to eat hay.', 'El conejillo de indias es una mascota pequeña a la que le gusta el heno.', 'Ein Meerschweinchen ist ein kleines Haustier und frisst gern Heu.'],
    ['A guinea pig’s teeth never stop growing, so hay helps wear them down.', 'Los dientes del conejillo de indias no dejan de crecer, y el heno ayuda a desgastarlos.', 'Die Zähne eines Meerschweinchens wachsen immer weiter, und Heu nutzt sie ab.']
  ]),
  an('goldfish', 'pets', n('the', 'goldfish', 'el', 'pez dorado', 'm', 'der', 'Goldfisch', 'm'), [
    ['A goldfish lives in water and steers with its fins.', 'El pez dorado vive en el agua y se dirige con las aletas.', 'Ein Goldfisch lebt im Wasser und steuert mit seinen Flossen.'],
    ['A goldfish can remember things for months.', 'Un pez dorado puede acordarse de las cosas durante meses.', 'Ein Goldfisch kann sich monatelang an Dinge erinnern.']
  ]),
  an('badger', 'forest', n('the', 'badger', 'el', 'tejón', 'm', 'der', 'Dachs', 'm'), [
    ['A badger has a white stripe on its head, so you can tell it is a badger.', 'El tejón tiene una raya blanca en la cabeza, y así se reconoce.', 'Ein Dachs hat einen weißen Streifen auf dem Kopf, daran erkennt man ihn.'],
    ['Badgers live in a big underground home with many tunnels.', 'Los tejones viven en una casa grande bajo tierra, con muchos túneles.', 'Dachse wohnen in einem großen Bau unter der Erde, mit vielen Gängen.']
  ]),
  an('wild-boar', 'forest', n('the', 'wild boar', 'el', 'jabalí', 'm', 'das', 'Wildschwein', 'n'), [
    ['A wild boar is a wild pig with a bristly coat and a long snout.', 'El jabalí es un cerdo salvaje con el pelo duro y un hocico largo.', 'Ein Wildschwein ist ein wildes Schwein mit borstigem Fell und einer langen Schnauze.'],
    ['Wild boars sniff the ground to find roots and nuts.', 'Los jabalíes olfatean el suelo para encontrar raíces y nueces.', 'Wildschweine schnüffeln am Boden und finden so Wurzeln und Nüsse.']
  ]),
  an('beaver', 'forest', n('the', 'beaver', 'el', 'castor', 'm', 'der', 'Biber', 'm'), [
    ['A beaver has big front teeth and a flat tail.', 'El castor tiene los dientes de delante muy grandes y la cola plana.', 'Ein Biber hat große Vorderzähne und einen flachen Schwanz.'],
    ['Beavers build a dam of sticks so their home sits in a quiet pond.', 'Los castores construyen una presa con palos para que su casa esté en un estanque tranquilo.', 'Biber bauen einen Damm aus Ästen, damit ihr Zuhause in einem ruhigen Teich liegt.']
  ]),
  an('bat', 'forest', n('the', 'bat', 'el', 'murciélago', 'm', 'die', 'Fledermaus', 'f'), [
    ['A bat is the only mammal that can really fly.', 'El murciélago es el único mamífero que puede volar de verdad.', 'Die Fledermaus ist das einzige Säugetier, das wirklich fliegen kann.'],
    ['Bats fly at night and find insects by listening to echoes.', 'Los murciélagos vuelan de noche y encuentran insectos escuchando los ecos.', 'Fledermäuse fliegen nachts und finden Insekten, indem sie auf Echos hören.']
  ]),
  an('leopard', 'jungle', n('the', 'leopard', 'el', 'leopardo', 'm', 'der', 'Leopard', 'm'), [
    ['A leopard has spots and can pull its food up into a tree.', 'El leopardo tiene manchas y puede subir su comida a un árbol.', 'Ein Leopard hat Flecken und kann sein Futter auf einen Baum ziehen.'],
    ['A black panther is this same cat, with black fur.', 'Una pantera negra es este mismo gato, con el pelo negro.', 'Ein schwarzer Panther ist dieselbe Katze, mit schwarzem Fell.']
  ]),
  an('black-panther', 'jungle', n('the', 'black panther', 'la', 'pantera negra', 'f', 'der', 'schwarze Panther', 'm'), [
    ['A black panther is a leopard with black fur.', 'Una pantera negra es un leopardo con el pelo negro.', 'Ein schwarzer Panther ist ein Leopard mit schwarzem Fell.'],
    ['A jaguar can be black too. The spots are still there if you look closely.', 'Un jaguar también puede ser negro. Las manchas siguen ahí si miras de cerca.', 'Ein Jaguar kann auch schwarz sein. Die Flecken sind noch da, wenn man genau hinschaut.']
  ]),
  an('toucan', 'jungle', n('the', 'toucan', 'el', 'tucán', 'm', 'der', 'Tukan', 'm'), [
    ['A toucan has a huge colourful beak that is lighter than it looks.', 'El tucán tiene un pico enorme y de colores, más ligero de lo que parece.', 'Ein Tukan hat einen riesigen bunten Schnabel, der leichter ist, als er aussieht.'],
    ['The beak helps the toucan reach fruit on thin branches.', 'El pico ayuda al tucán a alcanzar la fruta de las ramas finas.', 'Mit dem Schnabel erreicht der Tukan Früchte an dünnen Zweigen.']
  ]),
  an('bird-of-paradise', 'jungle', n('the', 'bird-of-paradise', 'el', 'ave del paraíso', 'm', 'der', 'Paradiesvogel', 'm'), [
    ['A male bird-of-paradise shows off bright feathers with a dance.', 'El ave del paraíso macho enseña sus plumas brillantes con un baile.', 'Ein männlicher Paradiesvogel zeigt seine leuchtenden Federn mit einem Tanz.'],
    ['These birds live in the rainforest.', 'Estas aves viven en la selva tropical.', 'Diese Vögel leben im Regenwald.']
  ]),
  an('sloth', 'jungle', n('the', 'sloth', 'el', 'perezoso', 'm', 'das', 'Faultier', 'n'), [
    ['A sloth moves very slowly and spends most of the day in the trees.', 'El perezoso se mueve muy despacio y pasa casi todo el día en los árboles.', 'Ein Faultier bewegt sich sehr langsam und verbringt den Tag meist in den Bäumen.'],
    ['A sloth’s fur can look a little green because tiny plants grow on it.', 'El pelo del perezoso puede verse un poco verde porque le crecen plantitas.', 'Das Fell eines Faultiers kann etwas grün aussehen, weil winzige Pflanzen darauf wachsen.']
  ]),
  an('orangutan', 'jungle', n('the', 'orangutan', 'el', 'orangután', 'm', 'der', 'Orang-Utan', 'm'), [
    ['An orangutan has long red hair and very long arms.', 'El orangután tiene el pelo largo y rojo, y los brazos muy largos.', 'Ein Orang-Utan hat langes rotes Haar und sehr lange Arme.'],
    ['Orangutans live in the trees and make a nest to sleep in.', 'Los orangutanes viven en los árboles y se hacen un nido para dormir.', 'Orang-Utans leben in den Bäumen und bauen sich ein Nest zum Schlafen.']
  ]),
  an('chameleon', 'jungle', n('the', 'chameleon', 'el', 'camaleón', 'm', 'das', 'Chamäleon', 'n'), [
    ['A chameleon can change colour, and its eyes look in different directions.', 'El camaleón puede cambiar de color, y sus ojos miran hacia lados distintos.', 'Ein Chamäleon kann die Farbe wechseln, und seine Augen schauen in verschiedene Richtungen.'],
    ['Its tongue shoots out very fast to catch an insect.', 'Su lengua sale disparada muy rápido para cazar un insecto.', 'Seine Zunge schnellt sehr schnell heraus und fängt ein Insekt.']
  ]),
  an('tarantula', 'jungle', n('the', 'tarantula', 'la', 'tarántula', 'f', 'die', 'Vogelspinne', 'f'), [
    ['A tarantula is a big spider with a hairy body and eight legs.', 'La tarántula es una araña grande, con el cuerpo peludo y ocho patas.', 'Eine Vogelspinne ist eine große Spinne mit einem haarigen Körper und acht Beinen.'],
    ['It lives in a burrow and waits quietly for insects.', 'Vive en una madriguera y espera quieta a los insectos.', 'Sie wohnt in einer Höhle und wartet still auf Insekten.']
  ]),
  an('tapir', 'jungle', n('the', 'tapir', 'el', 'tapir', 'm', 'der', 'Tapir', 'm'), [
    ['A tapir has a short trunk that is really a long nose.', 'El tapir tiene una trompa corta que en realidad es una nariz larga.', 'Ein Tapir hat einen kurzen Rüssel, der eigentlich eine lange Nase ist.'],
    ['Tapirs like the water and are good swimmers.', 'A los tapires les gusta el agua y nadan muy bien.', 'Tapire mögen das Wasser und können gut schwimmen.']
  ]),
  an('anteater', 'jungle', n('the', 'anteater', 'el', 'oso hormiguero', 'm', 'der', 'Ameisenbär', 'm'), [
    ['An anteater has a long snout and a very long sticky tongue.', 'El oso hormiguero tiene el hocico largo y una lengua muy larga y pegajosa.', 'Ein Ameisenbär hat eine lange Schnauze und eine sehr lange klebrige Zunge.'],
    ['It eats ants and termites, and it does not have teeth.', 'Come hormigas y termitas, y no tiene dientes.', 'Er frisst Ameisen und Termiten und hat keine Zähne.']
  ]),
  an('ostrich', 'savanna', n('the', 'ostrich', 'el', 'avestruz', 'm', 'der', 'Strauß', 'm'), [
    ['An ostrich is the biggest bird, and it cannot fly.', 'El avestruz es el ave más grande, y no puede volar.', 'Ein Strauß ist der größte Vogel und kann nicht fliegen.'],
    ['An ostrich runs very fast on its long, strong legs.', 'El avestruz corre muy rápido con sus patas largas y fuertes.', 'Ein Strauß rennt sehr schnell auf seinen langen, starken Beinen.']
  ]),
  an('meerkat', 'savanna', n('the', 'meerkat', 'la', 'suricata', 'f', 'das', 'Erdmännchen', 'n'), [
    ['Meerkats stand up tall to watch for danger.', 'Las suricatas se ponen de pie para vigilar si hay peligro.', 'Erdmännchen stellen sich hoch auf und halten nach Gefahr Ausschau.'],
    ['They live together, and they take turns as the lookout.', 'Viven juntas y se turnan para hacer de vigía.', 'Sie leben zusammen und wechseln sich als Wache ab.']
  ]),
  an('warthog', 'savanna', n('the', 'warthog', 'el', 'facóquero', 'm', 'das', 'Warzenschwein', 'n'), [
    ['A warthog has tusks and warts on its face.', 'El facóquero tiene colmillos y verrugas en la cara.', 'Ein Warzenschwein hat Hauer und Warzen im Gesicht.'],
    ['Warthogs kneel on their front knees to dig for food.', 'Los facóqueros se arrodillan sobre las patas delanteras para buscar comida.', 'Warzenschweine knien sich auf die Vorderbeine, um nach Futter zu graben.']
  ]),
  an('clownfish', 'ocean', n('the', 'clownfish', 'el', 'pez payaso', 'm', 'der', 'Clownfisch', 'm'), [
    ['A clownfish is orange with white stripes.', 'El pez payaso es naranja y tiene rayas blancas.', 'Ein Clownfisch ist orange und hat weiße Streifen.'],
    ['It lives among the tentacles of a sea anemone, where it is safe.', 'Vive entre los tentáculos de una anémona de mar, donde está a salvo.', 'Er lebt zwischen den Armen einer Seeanemone, und dort ist er sicher.']
  ]),
  an('seahorse', 'ocean', n('the', 'seahorse', 'el', 'caballito de mar', 'm', 'das', 'Seepferdchen', 'n'), [
    ['A seahorse has a head like a little horse and a curly tail.', 'El caballito de mar tiene la cabeza como un caballito y la cola rizada.', 'Ein Seepferdchen hat einen Kopf wie ein kleines Pferd und einen geringelten Schwanz.'],
    ['The father seahorse carries the babies in a pouch.', 'El papá caballito de mar lleva a las crías en una bolsa.', 'Der Vater der Seepferdchen trägt die Babys in einem Beutel.']
  ]),
  an('manta-ray', 'ocean', n('the', 'manta ray', 'la', 'mantarraya', 'f', 'der', 'Mantarochen', 'm'), [
    ['A manta ray has wide fins that look like wings.', 'La mantarraya tiene unas aletas anchas que parecen alas.', 'Ein Mantarochen hat breite Flossen, die wie Flügel aussehen.'],
    ['Mantas swim with their mouths open and eat tiny animals in the water.', 'Las mantarrayas nadan con la boca abierta y comen animalitos diminutos del agua.', 'Mantas schwimmen mit offenem Maul und fressen winzige Tiere im Wasser.']
  ]),
  an('starfish', 'ocean', n('the', 'starfish', 'la', 'estrella de mar', 'f', 'der', 'Seestern', 'm'), [
    ['A starfish has five arms and no head.', 'La estrella de mar tiene cinco brazos y no tiene cabeza.', 'Ein Seestern hat fünf Arme und keinen Kopf.'],
    ['Many starfish can grow a new arm if one is lost.', 'Muchas estrellas de mar pueden hacer crecer un brazo nuevo si pierden uno.', 'Viele Seesterne können einen neuen Arm wachsen lassen, wenn einer verloren geht.']
  ]),
  an('walrus', 'polar', n('the', 'walrus', 'la', 'morsa', 'f', 'das', 'Walross', 'n'), [
    ['A walrus has two long tusks and lots of whiskers.', 'La morsa tiene dos colmillos largos y muchos bigotes.', 'Ein Walross hat zwei lange Hauer und viele Schnurrhaare.'],
    ['The tusks help a walrus pull itself up onto the ice.', 'Los colmillos ayudan a la morsa a subirse al hielo.', 'Mit den Hauern zieht sich ein Walross auf das Eis.']
  ]),
  an('reindeer', 'polar', n('the', 'reindeer', 'el', 'reno', 'm', 'das', 'Rentier', 'n'), [
    ['Reindeer have antlers, and the females have them too.', 'Los renos tienen cornamenta, y las hembras también.', 'Rentiere haben ein Geweih, und die Weibchen auch.'],
    ['Their wide hooves help them walk on snow.', 'Sus pezuñas anchas les ayudan a caminar sobre la nieve.', 'Ihre breiten Hufe helfen ihnen, über Schnee zu laufen.']
  ]),
  an('arctic-fox', 'polar', n('the', 'arctic fox', 'el', 'zorro ártico', 'm', 'der', 'Polarfuchs', 'm'), [
    ['An arctic fox has a thick white coat in the snow.', 'El zorro ártico tiene un pelaje blanco y grueso en la nieve.', 'Ein Polarfuchs hat im Schnee ein dickes weißes Fell.'],
    ['In summer its coat turns brown, so it can hide among the rocks.', 'En verano el pelaje se vuelve marrón, y así se esconde entre las rocas.', 'Im Sommer wird das Fell braun, dann kann er sich zwischen den Steinen verstecken.']
  ]),
  an('peacock', 'birds', n('the', 'peacock', 'el', 'pavo real', 'm', 'der', 'Pfau', 'm'), [
    ['A peacock can fan out a huge tail covered in eye spots.', 'El pavo real puede abrir una cola enorme llena de ocelos.', 'Ein Pfau kann einen riesigen Schwanz aufschlagen, voller Augenflecken.'],
    ['The bright tail is how he shows off.', 'Con esa cola brillante se luce.', 'Mit dem leuchtenden Schwanz zeigt er sich.']
  ]),
  an('puffin', 'birds', n('the', 'puffin', 'el', 'frailecillo', 'm', 'der', 'Papageitaucher', 'm'), [
    ['A puffin has a colourful beak and black and white feathers.', 'El frailecillo tiene el pico de colores y plumas blancas y negras.', 'Ein Papageitaucher hat einen bunten Schnabel und schwarz-weiße Federn.'],
    ['A puffin can carry several fish in its beak at once.', 'Un frailecillo puede llevar varios peces en el pico a la vez.', 'Ein Papageitaucher kann mehrere Fische auf einmal im Schnabel tragen.']
  ]),
  an('pelican', 'birds', n('the', 'pelican', 'el', 'pelícano', 'm', 'der', 'Pelikan', 'm'), [
    ['A pelican has a big pouch under its beak.', 'El pelícano tiene una bolsa grande debajo del pico.', 'Ein Pelikan hat einen großen Beutel unter dem Schnabel.'],
    ['It scoops up fish in that pouch.', 'Recoge los peces con esa bolsa.', 'Mit dem Beutel schöpft er Fische.']
  ]),
  an('hummingbird', 'birds', n('the', 'hummingbird', 'el', 'colibrí', 'm', 'der', 'Kolibri', 'm'), [
    ['A hummingbird is tiny and can hover in one place.', 'El colibrí es diminuto y puede quedarse quieto en el aire.', 'Ein Kolibri ist winzig und kann an einer Stelle in der Luft stehen.'],
    ['It drinks nectar from flowers while it flies.', 'Bebe el néctar de las flores mientras vuela.', 'Er trinkt Nektar aus Blüten, während er fliegt.']
  ]),
  an('swan', 'birds', n('the', 'swan', 'el', 'cisne', 'm', 'der', 'Schwan', 'm'), [
    ['A swan has a long curved neck and white feathers.', 'El cisne tiene el cuello largo y curvado, y plumas blancas.', 'Ein Schwan hat einen langen gebogenen Hals und weiße Federn.'],
    ['Baby swans are grey, not white.', 'Los cisnes bebés son grises, no blancos.', 'Schwanenbabys sind grau, nicht weiß.']
  ]),
  an('snowy-owl', 'birds', n('the', 'snowy owl', 'el', 'búho nival', 'm', 'die', 'Schneeeule', 'f'), [
    ['A snowy owl is white, so it can hide in the snow.', 'El búho nival es blanco, y así se esconde en la nieve.', 'Eine Schneeeule ist weiß und kann sich so im Schnee verstecken.'],
    ['It has bright yellow eyes and often hunts in the daytime.', 'Tiene los ojos amarillos y brillantes, y a menudo caza de día.', 'Sie hat leuchtend gelbe Augen und jagt oft am Tag.']
  ]),
  an('garden-spider', 'bugs', n('the', 'garden spider', 'la', 'araña de jardín', 'f', 'die', 'Kreuzspinne', 'f'), [
    ['A garden spider builds a round web to catch flying insects.', 'La araña de jardín teje una tela redonda para cazar insectos que vuelan.', 'Eine Kreuzspinne baut ein rundes Netz und fängt damit fliegende Insekten.'],
    ['The pale cross on its back makes it easy to recognise.', 'La cruz clara de su espalda hace que sea fácil de reconocer.', 'Das helle Kreuz auf dem Rücken macht sie leicht zu erkennen.']
  ]),
  an('ant', 'bugs', n('the', 'ant', 'la', 'hormiga', 'f', 'die', 'Ameise', 'f'), [
    ['Ants live together in a big nest and work as a team.', 'Las hormigas viven juntas en un nido grande y trabajan en equipo.', 'Ameisen wohnen zusammen in einem großen Nest und arbeiten als Team.'],
    ['An ant can lift many times its own weight.', 'Una hormiga puede levantar mucho más de lo que pesa.', 'Eine Ameise kann ein Vielfaches ihres eigenen Gewichts heben.']
  ]),
  an('rhino-beetle', 'bugs', n('the', 'rhinoceros beetle', 'el', 'escarabajo rinoceronte', 'm', 'der', 'Nashornkäfer', 'm'), [
    ['A male rhinoceros beetle has a horn on its head.', 'El escarabajo rinoceronte macho tiene un cuerno en la cabeza.', 'Ein männlicher Nashornkäfer hat ein Horn auf dem Kopf.'],
    ['The horn is for pushing other beetles, not for hurting people.', 'El cuerno sirve para empujar a otros escarabajos, no para hacer daño a las personas.', 'Das Horn ist dazu da, andere Käfer wegzuschieben, nicht um Menschen wehzutun.']
  ]),
  an('dragonfly', 'bugs', n('the', 'dragonfly', 'la', 'libélula', 'f', 'die', 'Libelle', 'f'), [
    ['A dragonfly has four wings and huge eyes.', 'La libélula tiene cuatro alas y unos ojos enormes.', 'Eine Libelle hat vier Flügel und riesige Augen.'],
    ['Dragonflies are excellent fliers and catch insects in the air.', 'Las libélulas vuelan muy bien y cazan insectos en el aire.', 'Libellen fliegen ausgezeichnet und fangen Insekten in der Luft.']
  ]),
  an('camel', 'world', n('the', 'camel', 'el', 'camello', 'm', 'das', 'Kamel', 'n'), [
    ['This camel has one hump, which stores fat for times with little food.', 'Este camello tiene una joroba, que guarda grasa para cuando hay poca comida.', 'Dieses Kamel hat einen Höcker, der Fett speichert für Zeiten mit wenig Futter.'],
    ['Camels can walk for days in the desert.', 'Los camellos pueden caminar varios días por el desierto.', 'Kamele können tagelang durch die Wüste laufen.']
  ]),
  an('llama', 'world', n('the', 'llama', 'la', 'llama', 'f', 'das', 'Lama', 'n'), [
    ['A llama has a long neck and a woolly coat.', 'La llama tiene el cuello largo y un pelaje de lana.', 'Ein Lama hat einen langen Hals und ein wolliges Fell.'],
    ['Llamas live in the mountains and can carry a small pack.', 'Las llamas viven en las montañas y pueden llevar una carga pequeña.', 'Lamas leben in den Bergen und können ein kleines Gepäck tragen.']
  ]),
  an('platypus', 'world', n('the', 'platypus', 'el', 'ornitorrinco', 'm', 'das', 'Schnabeltier', 'n'), [
    ['A platypus has a beak like a duck, a tail like a beaver, and fur.', 'El ornitorrinco tiene el pico como un pato, la cola como un castor, y pelo.', 'Ein Schnabeltier hat einen Schnabel wie eine Ente, einen Schwanz wie ein Biber und Fell.'],
    ['It lays eggs, and it lives in rivers in Australia.', 'Pone huevos y vive en los ríos de Australia.', 'Es legt Eier und lebt in Flüssen in Australien.']
  ])
];

const vehicles = [
  veh('camper-van', 'road', n('the', 'camper van', 'la', 'autocaravana', 'f', 'das', 'Wohnmobil', 'n'), [
    ['A camper van is a little home on wheels, with a bed inside.', 'La autocaravana es una casita con ruedas y una cama dentro.', 'Ein Wohnmobil ist ein kleines Zuhause auf Rädern, mit einem Bett darin.'],
    ['You can cook and sleep in it while you travel.', 'Se puede cocinar y dormir dentro mientras se viaja.', 'Man kann darin kochen und schlafen, während man unterwegs ist.']
  ]),
  veh('racing-car', 'road', n('the', 'racing car', 'el', 'coche de carreras', 'm', 'der', 'Rennwagen', 'm'), [
    ['A racing car is built low and wide so it can go very fast.', 'El coche de carreras es bajito y ancho para poder ir muy rápido.', 'Ein Rennwagen ist niedrig und breit gebaut, damit er sehr schnell fahren kann.'],
    ['The driver wears a helmet and a seatbelt.', 'El piloto lleva casco y cinturón.', 'Der Fahrer trägt einen Helm und einen Gurt.']
  ]),
  veh('scooter', 'road', n('the', 'scooter', 'el', 'patinete', 'm', 'der', 'Roller', 'm'), [
    ['A scooter has a board for your feet and a tall handle.', 'El patinete tiene una tabla para los pies y un manillar alto.', 'Ein Roller hat ein Brett für die Füße und einen hohen Lenker.'],
    ['You push with one foot, and then you glide.', 'Se impulsa con un pie y luego se desliza.', 'Man stößt sich mit einem Fuß ab und rollt dann.']
  ]),
  veh('quad-bike', 'road', n('the', 'quad bike', 'el', 'quad', 'm', 'das', 'Quad', 'n'), [
    ['A quad bike has four wheels and big tyres for bumpy ground.', 'El quad tiene cuatro ruedas y neumáticos grandes para el terreno irregular.', 'Ein Quad hat vier Räder und große Reifen für holprigen Boden.'],
    ['A grown-up drives it, and the rider wears a helmet.', 'Lo conduce una persona mayor, y quien monta lleva casco.', 'Ein Erwachsener fährt es, und der Fahrer trägt einen Helm.']
  ]),
  veh('forklift', 'buildingSite', n('the', 'forklift', 'la', 'carretilla elevadora', 'f', 'der', 'Gabelstapler', 'm'), [
    ['A forklift picks up heavy loads with two metal forks.', 'La carretilla elevadora levanta cargas pesadas con dos horquillas de metal.', 'Ein Gabelstapler hebt schwere Lasten mit zwei Metallgabeln.'],
    ['A trained driver uses it in a warehouse.', 'La usa un conductor preparado, en un almacén.', 'Ein ausgebildeter Fahrer benutzt ihn in einem Lager.']
  ]),
  veh('road-roller', 'buildingSite', n('the', 'road roller', 'la', 'apisonadora', 'f', 'die', 'Walze', 'f'), [
    ['A road roller is very heavy and has a big smooth drum.', 'La apisonadora es muy pesada y tiene un rodillo grande y liso.', 'Eine Walze ist sehr schwer und hat eine große glatte Trommel.'],
    ['It presses a new road flat.', 'Aplana la carretera nueva.', 'Sie drückt eine neue Straße glatt.']
  ]),
  veh('cherry-picker', 'buildingSite', n('the', 'cherry picker', 'la', 'plataforma elevadora', 'f', 'die', 'Hebebühne', 'f'), [
    ['A cherry picker lifts a person up to a high window or a tree.', 'La plataforma elevadora sube a una persona hasta una ventana alta o un árbol.', 'Eine Hebebühne hebt einen Menschen zu einem hohen Fenster oder einem Baum.'],
    ['The basket keeps the person safe while they work up high.', 'La cesta mantiene a la persona segura mientras trabaja arriba.', 'Der Korb hält die Person sicher, während sie oben arbeitet.']
  ]),
  veh('metro', 'rails', n('the', 'underground train', 'el', 'metro', 'm', 'die', 'U-Bahn', 'f'), [
    ['An underground train travels through tunnels under the city.', 'El metro viaja por túneles debajo de la ciudad.', 'Eine U-Bahn fährt durch Tunnel unter der Stadt.'],
    ['The doors open at each station so people can get on.', 'Las puertas se abren en cada estación para que la gente pueda subir.', 'An jeder Station gehen die Türen auf, damit die Leute einsteigen können.']
  ]),
  veh('freight-train', 'rails', n('the', 'freight train', 'el', 'tren de mercancías', 'm', 'der', 'Güterzug', 'm'), [
    ['A freight train pulls many wagons full of goods.', 'El tren de mercancías arrastra muchos vagones llenos de cosas.', 'Ein Güterzug zieht viele Wagen voller Waren.'],
    ['One train can carry as much as lots of trucks.', 'Un solo tren puede llevar tanto como muchos camiones.', 'Ein Zug kann so viel tragen wie viele Lastwagen.']
  ]),
  veh('jet', 'air', n('the', 'jet', 'el', 'jet', 'm', 'der', 'Jet', 'm'), [
    ['A jet has swept-back wings and flies very fast.', 'El jet tiene las alas inclinadas hacia atrás y vuela muy rápido.', 'Ein Jet hat gepfeilte Flügel und fliegt sehr schnell.'],
    ['Hot air rushes out of the engines and pushes it forward.', 'El aire caliente sale de los motores y lo empuja hacia delante.', 'Heiße Luft strömt aus den Triebwerken und schiebt ihn nach vorn.']
  ]),
  veh('glider', 'air', n('the', 'glider', 'el', 'planeador', 'm', 'das', 'Segelflugzeug', 'n'), [
    ['A glider has long thin wings and no engine.', 'El planeador tiene las alas largas y finas, y no tiene motor.', 'Ein Segelflugzeug hat lange dünne Flügel und keinen Motor.'],
    ['It stays up by riding air that is rising.', 'Se mantiene en el aire montado en el aire que sube.', 'Es bleibt oben, indem es auf steigender Luft reitet.']
  ]),
  veh('airship', 'air', n('the', 'airship', 'el', 'dirigible', 'm', 'das', 'Luftschiff', 'n'), [
    ['An airship is a big balloon with a cabin underneath.', 'El dirigible es un globo grande con una cabina debajo.', 'Ein Luftschiff ist ein großer Ballon mit einer Kabine darunter.'],
    ['It floats because the balloon is full of a gas lighter than air.', 'Flota porque el globo está lleno de un gas más ligero que el aire.', 'Es schwebt, weil der Ballon mit einem Gas gefüllt ist, das leichter ist als Luft.']
  ]),
  veh('drone', 'air', n('the', 'drone', 'el', 'dron', 'm', 'die', 'Drohne', 'f'), [
    ['A drone is a small flying machine with spinning propellers.', 'El dron es una máquina pequeña que vuela con hélices que giran.', 'Eine Drohne ist eine kleine Flugmaschine mit drehenden Propellern.'],
    ['A grown-up flies it from the ground with a controller.', 'Una persona mayor lo hace volar desde el suelo con un mando.', 'Ein Erwachsener steuert sie vom Boden aus mit einer Fernbedienung.']
  ]),
  veh('ferry', 'water', n('the', 'ferry', 'el', 'ferry', 'm', 'die', 'Fähre', 'f'), [
    ['A ferry carries people and cars across the water.', 'El ferry lleva personas y coches al otro lado del agua.', 'Eine Fähre bringt Menschen und Autos über das Wasser.'],
    ['It has a big door so cars can drive on and off.', 'Tiene una puerta grande para que los coches entren y salgan.', 'Sie hat ein großes Tor, damit Autos hinein- und herausfahren können.']
  ]),
  veh('fishing-boat', 'water', n('the', 'fishing boat', 'el', 'barco pesquero', 'm', 'das', 'Fischerboot', 'n'), [
    ['A fishing boat goes out to sea to catch fish.', 'El barco pesquero sale al mar a pescar.', 'Ein Fischerboot fährt aufs Meer, um Fische zu fangen.'],
    ['Nets or lines bring the fish onto the boat.', 'Las redes o los sedales suben los peces al barco.', 'Netze oder Angeln holen die Fische an Bord.']
  ]),
  veh('cruise-ship', 'water', n('the', 'cruise ship', 'el', 'crucero', 'm', 'das', 'Kreuzfahrtschiff', 'n'), [
    ['A cruise ship is a huge ship with many windows and bedrooms.', 'El crucero es un barco enorme, con muchas ventanas y dormitorios.', 'Ein Kreuzfahrtschiff ist ein riesiges Schiff mit vielen Fenstern und Schlafzimmern.'],
    ['People travel on it for a holiday and visit different ports.', 'La gente viaja en él de vacaciones y visita puertos distintos.', 'Menschen machen damit Urlaub und besuchen verschiedene Häfen.']
  ]),
  veh('hovercraft', 'water', n('the', 'hovercraft', 'el', 'aerodeslizador', 'm', 'das', 'Luftkissenboot', 'n'), [
    ['A hovercraft floats on a cushion of air, over water or flat land.', 'El aerodeslizador flota sobre un colchón de aire, por el agua o por tierra llana.', 'Ein Luftkissenboot schwebt auf einem Luftkissen über Wasser oder flaches Land.'],
    ['A big skirt around the bottom holds the air in.', 'Una falda grande alrededor de la base mantiene el aire dentro.', 'Eine große Schürze unten hält die Luft fest.']
  ])
];

const thingGroups = [
  { id: 'building', en: 'Building', es: 'Construir', de: 'Bauen', emoji: '🔨' },
  { id: 'garden', en: 'Garden', es: 'El jardín', de: 'Der Garten', emoji: '🌱' },
  { id: 'kitchen', en: 'Kitchen', es: 'La cocina', de: 'Die Küche', emoji: '🍳' },
  { id: 'explore', en: 'Exploring and making', es: 'Mirar y crear', de: 'Schauen und basteln', emoji: '🔎' }
];
const things = [
  thing('hammer', 'building', n('the', 'hammer', 'el', 'martillo', 'm', 'der', 'Hammer', 'm'), [
    ['A hammer knocks nails into wood.', 'El martillo clava los clavos en la madera.', 'Ein Hammer schlägt Nägel ins Holz.'],
    ['The heavy head does the hitting, and a grown-up holds the handle.', 'La cabeza pesada es la que golpea, y una persona mayor sujeta el mango.', 'Der schwere Kopf schlägt, und ein Erwachsener hält den Stiel.']
  ]),
  thing('screwdriver', 'building', n('the', 'screwdriver', 'el', 'destornillador', 'm', 'der', 'Schraubendreher', 'm'), [
    ['A screwdriver turns screws.', 'El destornillador gira los tornillos.', 'Ein Schraubendreher dreht Schrauben.'],
    ['The tip fits the top of the screw, and a grown-up uses it.', 'La punta encaja en la cabeza del tornillo, y lo usa una persona mayor.', 'Die Spitze passt auf den Schraubenkopf, und ein Erwachsener benutzt ihn.']
  ]),
  thing('hand-saw', 'building', n('the', 'saw', 'el', 'serrucho', 'm', 'die', 'Säge', 'f'), [
    ['A saw has a row of sharp teeth for cutting wood.', 'El serrucho tiene una fila de dientes afilados para cortar madera.', 'Eine Säge hat eine Reihe scharfer Zähne zum Holzschneiden.'],
    ['Only a grown-up uses a saw.', 'El serrucho solo lo usa una persona mayor.', 'Eine Säge benutzt nur ein Erwachsener.']
  ]),
  thing('drill', 'building', n('the', 'drill', 'el', 'taladro', 'm', 'die', 'Bohrmaschine', 'f'), [
    ['A drill makes holes by spinning a metal bit.', 'El taladro hace agujeros girando una punta de metal.', 'Eine Bohrmaschine macht Löcher, indem sich ein Metallbohrer dreht.'],
    ['It is loud, and only a grown-up switches it on.', 'Hace ruido, y solo una persona mayor lo enciende.', 'Sie ist laut, und nur ein Erwachsener schaltet sie ein.']
  ]),
  thing('wrench', 'building', n('the', 'wrench', 'la', 'llave inglesa', 'f', 'der', 'Schraubenschlüssel', 'm'), [
    ['A wrench turns nuts and bolts.', 'La llave inglesa gira las tuercas y los tornillos.', 'Ein Schraubenschlüssel dreht Muttern und Bolzen.'],
    ['The opening fits around the bolt, and a grown-up uses it.', 'La boca encaja alrededor del tornillo, y la usa una persona mayor.', 'Die Öffnung passt um den Bolzen, und ein Erwachsener benutzt ihn.']
  ]),
  thing('tape-measure', 'building', n('the', 'tape measure', 'la', 'cinta métrica', 'f', 'das', 'Maßband', 'n'), [
    ['A tape measure shows how long something is.', 'La cinta métrica dice lo largo que es algo.', 'Ein Maßband zeigt, wie lang etwas ist.'],
    ['The metal tape rolls back into the case.', 'La cinta de metal se enrolla otra vez dentro de la caja.', 'Das Metallband rollt zurück in das Gehäuse.']
  ]),
  thing('ladder', 'building', n('the', 'ladder', 'la', 'escalera de mano', 'f', 'die', 'Leiter', 'f'), [
    ['A ladder helps a grown-up reach a high place.', 'La escalera de mano ayuda a una persona mayor a llegar a un sitio alto.', 'Eine Leiter hilft einem Erwachsenen, eine hohe Stelle zu erreichen.'],
    ['It stands on firm ground, and a grown-up is the one who climbs it.', 'Se apoya en suelo firme, y quien sube es una persona mayor.', 'Sie steht auf festem Boden, und ein Erwachsener steigt hinauf.']
  ]),
  thing('hard-hat', 'building', n('the', 'hard hat', 'el', 'casco de obra', 'm', 'der', 'Schutzhelm', 'm'), [
    ['A hard hat protects a builder’s head.', 'El casco de obra protege la cabeza de quien construye.', 'Ein Schutzhelm schützt den Kopf eines Bauarbeiters.'],
    ['The strong shell takes the bump instead of the head.', 'La cáscara dura recibe el golpe en lugar de la cabeza.', 'Die feste Schale fängt den Stoß ab, nicht der Kopf.']
  ]),
  thing('wheelbarrow', 'building', n('the', 'wheelbarrow', 'la', 'carretilla', 'f', 'die', 'Schubkarre', 'f'), [
    ['A wheelbarrow has one wheel and two handles.', 'La carretilla tiene una rueda y dos asas.', 'Eine Schubkarre hat ein Rad und zwei Griffe.'],
    ['It carries soil, bricks or tools.', 'Lleva tierra, ladrillos o herramientas.', 'Sie trägt Erde, Ziegel oder Werkzeug.']
  ]),
  thing('traffic-cone', 'building', n('the', 'traffic cone', 'el', 'cono', 'm', 'der', 'Leitkegel', 'm'), [
    ['An orange cone shows where not to walk or drive.', 'Un cono naranja indica por dónde no se camina ni se conduce.', 'Ein oranger Kegel zeigt, wo man nicht gehen oder fahren soll.'],
    ['The bright colour makes it easy to see.', 'El color vivo hace que se vea enseguida.', 'Die leuchtende Farbe macht ihn leicht zu sehen.']
  ]),
  thing('watering-can', 'garden', n('the', 'watering can', 'la', 'regadera', 'f', 'die', 'Gießkanne', 'f'), [
    ['A watering can holds water for plants.', 'La regadera guarda agua para las plantas.', 'Eine Gießkanne hält Wasser für die Pflanzen.'],
    ['The spout has little holes, so the water comes out gently.', 'El pico tiene agujeritos, y el agua sale con suavidad.', 'Die Tülle hat kleine Löcher, darum kommt das Wasser sanft heraus.']
  ]),
  thing('spade', 'garden', n('the', 'spade', 'la', 'pala', 'f', 'der', 'Spaten', 'm'), [
    ['A spade is for digging soil.', 'La pala sirve para cavar la tierra.', 'Ein Spaten ist zum Umgraben der Erde.'],
    ['A grown-up pushes it into the ground.', 'Una persona mayor la clava en el suelo.', 'Ein Erwachsener drückt ihn in den Boden.']
  ]),
  thing('rake', 'garden', n('the', 'rake', 'el', 'rastrillo', 'm', 'der', 'Rechen', 'm'), [
    ['A rake gathers leaves and smooths the soil.', 'El rastrillo junta las hojas y allana la tierra.', 'Ein Rechen sammelt Blätter und glättet die Erde.'],
    ['The long handle reaches the ground.', 'El mango largo llega hasta el suelo.', 'Der lange Stiel reicht bis zum Boden.']
  ]),
  thing('flowerpot', 'garden', n('the', 'flowerpot', 'la', 'maceta', 'f', 'der', 'Blumentopf', 'm'), [
    ['A flowerpot holds soil and a plant.', 'La maceta contiene tierra y una planta.', 'Ein Blumentopf hält Erde und eine Pflanze.'],
    ['A hole in the bottom lets extra water run out.', 'Un agujero en el fondo deja salir el agua que sobra.', 'Ein Loch unten lässt überschüssiges Wasser ablaufen.']
  ]),
  thing('hose', 'garden', n('the', 'hose', 'la', 'manguera', 'f', 'der', 'Gartenschlauch', 'm'), [
    ['A hose brings water from the tap to the garden.', 'La manguera lleva el agua del grifo al jardín.', 'Ein Gartenschlauch bringt Wasser vom Hahn in den Garten.'],
    ['The water comes out of the end so the plants can drink.', 'El agua sale por el extremo para que las plantas beban.', 'Das Wasser kommt am Ende heraus, damit die Pflanzen trinken können.']
  ]),
  thing('wooden-spoon', 'kitchen', n('the', 'wooden spoon', 'la', 'cuchara de madera', 'f', 'der', 'Holzlöffel', 'm'), [
    ['A wooden spoon stirs food in a pot.', 'La cuchara de madera remueve la comida en la olla.', 'Ein Holzlöffel rührt das Essen im Topf um.'],
    ['Wood stays cooler in the hand than a metal spoon.', 'La madera se queda más fresca en la mano que una cuchara de metal.', 'Holz bleibt in der Hand kühler als ein Metalllöffel.']
  ]),
  thing('whisk', 'kitchen', n('the', 'whisk', 'el', 'batidor', 'm', 'der', 'Schneebesen', 'm'), [
    ['A whisk mixes eggs or cream and puts air into them.', 'El batidor mezcla los huevos o la nata y les mete aire.', 'Ein Schneebesen mischt Eier oder Sahne und bringt Luft hinein.'],
    ['The wire loops move through the food.', 'Los aros de alambre se mueven por la comida.', 'Die Drahtschlaufen bewegen sich durch das Essen.']
  ]),
  thing('rolling-pin', 'kitchen', n('the', 'rolling pin', 'el', 'rodillo', 'm', 'das', 'Nudelholz', 'n'), [
    ['A rolling pin flattens dough for bread or biscuits.', 'El rodillo aplana la masa del pan o de las galletas.', 'Ein Nudelholz macht Teig für Brot oder Kekse flach.'],
    ['It rolls back and forth over the dough.', 'Se pasa adelante y atrás por encima de la masa.', 'Man rollt es vor und zurück über den Teig.']
  ]),
  thing('saucepan', 'kitchen', n('the', 'saucepan', 'la', 'cacerola', 'f', 'der', 'Kochtopf', 'm'), [
    ['A saucepan holds food on the cooker.', 'La cacerola contiene la comida sobre la cocina.', 'Ein Kochtopf hält das Essen auf dem Herd.'],
    ['The cooker is hot, so a grown-up does the cooking.', 'La cocina quema, así que cocina una persona mayor.', 'Der Herd ist heiß, darum kocht ein Erwachsener.']
  ]),
  thing('oven-mitt', 'kitchen', n('the', 'oven mitt', 'el', 'guante de horno', 'm', 'der', 'Topfhandschuh', 'm'), [
    ['An oven mitt is a thick glove for hot pans.', 'El guante de horno es un guante grueso para las ollas calientes.', 'Ein Topfhandschuh ist ein dicker Handschuh für heiße Töpfe.'],
    ['It keeps a grown-up’s hand safe when food comes out of the oven.', 'Protege la mano de una persona mayor cuando la comida sale del horno.', 'Er schützt die Hand eines Erwachsenen, wenn das Essen aus dem Ofen kommt.']
  ]),
  thing('magnifying-glass', 'explore', n('the', 'magnifying glass', 'la', 'lupa', 'f', 'die', 'Lupe', 'f'), [
    ['A magnifying glass makes small things look bigger.', 'La lupa hace que las cosas pequeñas se vean más grandes.', 'Eine Lupe lässt kleine Dinge größer aussehen.'],
    ['The curved glass bends the light.', 'El cristal curvado desvía la luz.', 'Das gewölbte Glas biegt das Licht.']
  ]),
  thing('binoculars', 'explore', n('the', 'binoculars', 'los', 'prismáticos', 'm', 'das', 'Fernglas', 'n'), [
    ['Binoculars make far-away birds and animals look closer.', 'Los prismáticos hacen que los pájaros y los animales lejanos se vean más cerca.', 'Ein Fernglas lässt weit entfernte Vögel und Tiere näher aussehen.'],
    ['You hold them up to both eyes.', 'Se sujetan delante de los dos ojos.', 'Man hält es vor beide Augen.']
  ]),
  thing('compass', 'explore', n('the', 'compass', 'la', 'brújula', 'f', 'der', 'Kompass', 'm'), [
    ['A compass shows which way is north.', 'La brújula indica dónde está el norte.', 'Ein Kompass zeigt, wo Norden ist.'],
    ['The needle always swings to point the same way.', 'La aguja siempre gira para señalar el mismo lado.', 'Die Nadel dreht sich immer so, dass sie in dieselbe Richtung zeigt.']
  ]),
  thing('crayon', 'explore', n('the', 'crayon', 'el', 'crayón', 'm', 'der', 'Buntstift', 'm'), [
    ['A crayon draws and colours on paper.', 'El crayón dibuja y colorea en el papel.', 'Ein Buntstift zeichnet und malt auf Papier.'],
    ['Each crayon is a different colour.', 'Cada crayón es de un color distinto.', 'Jeder Buntstift hat eine andere Farbe.']
  ])
];

/* One sentence each. Same species as the dig, except the pterosaur, which stays out of this book. */
const dinos = [
  dino('trex', n('the', 'Tyrannosaurus rex', 'el', 'Tiranosaurio rex', 'm', 'der', 'Tyrannosaurus rex', 'm'), [
    'It had teeth as big as bananas and tiny little arms.',
    'Tenía dientes tan grandes como plátanos y unos brazos pequeñitos.',
    'Er hatte Zähne so groß wie Bananen und winzige Ärmchen.'
  ]),
  dino('raptor', n('the', 'Velociraptor', 'el', 'Velociraptor', 'm', 'der', 'Velociraptor', 'm'), [
    'It was about as big as a turkey, had feathers, and a curved claw on each foot.',
    'Era más o menos del tamaño de un pavo, tenía plumas y una garra curva en cada pie.',
    'Er war ungefähr so groß wie ein Truthahn, hatte Federn und eine gebogene Kralle an jedem Fuß.'
  ]),
  dino('trike', n('the', 'Triceratops', 'el', 'Triceratops', 'm', 'der', 'Triceratops', 'm'), [
    'It had three horns and a big shield behind its head.',
    'Tenía tres cuernos y un gran escudo detrás de la cabeza.',
    'Er hatte drei Hörner und einen großen Schild hinter dem Kopf.'
  ]),
  dino('stego', n('the', 'Stegosaurus', 'el', 'Estegosaurio', 'm', 'der', 'Stegosaurus', 'm'), [
    'It had plates on its back and spikes on its tail.',
    'Tenía placas en la espalda y pinchos en la cola.',
    'Er hatte Platten auf dem Rücken und Stacheln am Schwanz.'
  ]),
  dino('brachio', n('the', 'Brachiosaurus', 'el', 'Braquiosaurio', 'm', 'der', 'Brachiosaurus', 'm'), [
    'It was taller than a house and ate leaves from tall trees.',
    'Era más alto que una casa y comía hojas de los árboles altos.',
    'Er war größer als ein Haus und fraß Blätter von hohen Bäumen.'
  ]),
  dino('diplo', n('the', 'Diplodocus', 'el', 'Diplodocus', 'm', 'der', 'Diplodocus', 'm'), [
    'It was as long as two buses, and its tail was like a whip.',
    'Era tan largo como dos autobuses, y su cola era como un látigo.',
    'Er war so lang wie zwei Busse, und sein Schwanz war wie eine Peitsche.'
  ]),
  dino('anky', n('the', 'Ankylosaurus', 'el', 'Anquilosaurio', 'm', 'der', 'Ankylosaurus', 'm'), [
    'It had armour on its back and a club at the end of its tail.',
    'Tenía una armadura en la espalda y un mazo en la punta de la cola.',
    'Er hatte einen Panzer auf dem Rücken und eine Keule am Schwanzende.'
  ]),
  dino('para', n('the', 'Parasaurolophus', 'el', 'Parasaurolophus', 'm', 'der', 'Parasaurolophus', 'm'), [
    'It had a long hollow crest on its head.',
    'Tenía una cresta larga y hueca en la cabeza.',
    'Er hatte einen langen hohlen Kamm auf dem Kopf.'
  ]),
  dino('spino', n('the', 'Spinosaurus', 'el', 'Espinosaurio', 'm', 'der', 'Spinosaurus', 'm'), [
    'It had a huge sail on its back and ate fish.',
    'Tenía una vela enorme en la espalda y comía peces.',
    'Er hatte ein riesiges Segel auf dem Rücken und fraß Fische.'
  ]),
  dino('pachy', n('the', 'Pachycephalosaurus', 'el', 'Paquicefalosaurio', 'm', 'der', 'Pachycephalosaurus', 'm'), [
    'It had a very hard, round head, like a helmet.',
    'Tenía la cabeza redonda y muy dura, como un casco.',
    'Er hatte einen sehr harten, runden Kopf, wie ein Helm.'
  ]),
  dino('carno', n('the', 'Carnotaurus', 'el', 'Carnotauro', 'm', 'der', 'Carnotaurus', 'm'), [
    'It had two horns over its eyes and even tinier arms than Tyrannosaurus.',
    'Tenía dos cuernos sobre los ojos y unos brazos aún más pequeños que el tiranosaurio.',
    'Er hatte zwei Hörner über den Augen und noch kleinere Ärmchen als der Tyrannosaurus.'
  ]),
  dino('dilo', n('the', 'Dilophosaurus', 'el', 'Dilofosaurio', 'm', 'der', 'Dilophosaurus', 'm'), [
    'It had two thin crests on its head, like two fans.',
    'Tenía dos crestas finas en la cabeza, como dos abanicos.',
    'Er hatte zwei dünne Kämme auf dem Kopf, wie zwei Fächer.'
  ]),
  dino('styraco', n('the', 'Styracosaurus', 'el', 'Estiracosaurio', 'm', 'der', 'Styracosaurus', 'm'), [
    'It had a long horn on its nose and a shield with lots of spikes.',
    'Tenía un cuerno largo en la nariz y un escudo con muchos pinchos.',
    'Er hatte ein langes Horn auf der Nase und einen Schild mit vielen Stacheln.'
  ]),
  dino('iguano', n('the', 'Iguanodon', 'el', 'Iguanodonte', 'm', 'der', 'Iguanodon', 'm'), [
    'It had a spike on each thumb.',
    'Tenía un pincho en cada pulgar.',
    'Er hatte einen Stachel an jedem Daumen.'
  ]),
  dino('theriz', n('the', 'Therizinosaurus', 'el', 'Terizinosaurio', 'm', 'der', 'Therizinosaurus', 'm'), [
    'It had giant claws, longer than your arm, and it ate plants.',
    'Tenía unas garras enormes, más largas que tu brazo, y comía plantas.',
    'Er hatte riesige Krallen, länger als dein Arm, und er fraß Pflanzen.'
  ])
];

module.exports = { animals, vehicles, thingGroups, things, dinos };
