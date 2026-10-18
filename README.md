# Noah's Exploration Game

A trilingual (🇪🇸 Spanish · 🇬🇧 English · 🇩🇪 German) learning app for a four-year-old, in a single
self-contained `index.html`. No build step and no server: open the file in Chrome (Android/desktop) or
Safari (iOS). On a phone, use **Add to Home Screen** so it runs full-screen.

## Tabs

| Tab | What it does |
| --- | --- |
| ✍️ Write | Trace lowercase, capitals, digits, or his own name, with stroke order and arrows |
| 🖼️ Words | "Where is the …?" picture quiz with adaptive difficulty, 15 categories, ~370 words |
| 👂 Listen | Hear a word, tap the picture; level 3 uses distractors that sound alike |
| 🤸 Actions | Adjective pairs, verbs, and act-it-out commands |
| 🪐 Space | Orrery of the solar system with facts and a quiz |
| 🌍 World | The seven continents with facts and a quiz |
| 🎁 Prizes | Spend 40 ⚡ on a prize game (see below) |
| ⚙ (hold) | Parent panel: name, levels, most-missed words, prize points |

## Points and prizes

Every correct answer earns **1 ⚡**: a `+1⚡` flies from his finger to the counter. Each time the counter
crosses a multiple of 40, a full-screen **"You won a prize!"** pop-up appears. The ⚡ counter and the
🎁 tab glow while a prize is available. Points are saved in the browser, so a reload loses nothing.

Prize games (40 ⚡ each, no way to fail):

- **🦖 Dig.** 11 different skeletons: T-Rex, Velociraptor, Triceratops, Stegosaurus, Brachiosaurus,
  Diplodocus, Ankylosaurus, Parasaurolophus, Spinosaurus, Pachycephalosaurus and Pteranodon. Each dig
  lays the bones out differently: whole at a random angle, partly washed apart, or scattered. Each bone
  found is named aloud (head, ribs, tail…). There are also hidden treasures to find (ammonite, amber,
  crystal, shark tooth, trilobite, gold). Once everything is found, the bones fly together, the
  skeleton comes alive and roars, and it goes into the museum. Undiscovered dinosaurs appear as
  silhouettes.
- **🃏 Pairs.** Memory game with 6 pairs; every flip says the word.
- **🎈 Balloons.** Pop 20 balloons; each one says the picture painted on it. Gold balloons count ×3.
- **🎆 Fireworks.** Tap the night sky 20 times, then watch the finale.

Leaving an unfinished prize game takes two taps on 🏠, so a stray tap cannot waste 40 ⚡.

## Saved data (localStorage)

`sl_power` (⚡ points), `sl_dinos` (museum), `sl_treasure` (treasure counts), `sl_name`, `sl_stats`
(missed words).
