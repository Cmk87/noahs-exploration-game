# Noah's Exploration Game

A trilingual (🇪🇸 Spanish · 🇬🇧 English · 🇩🇪 German) learning app for a four-year-old, in a single
self-contained `index.html`. No build step and no server: open the file in Chrome (Android/desktop) or
Safari (iOS). On a phone, use **Add to Home Screen** so it runs full-screen.

## Tabs

| Tab | What it does |
| --- | --- |
| ✍️ Write | Trace lowercase, capitals, digits, or his own name, with stroke order and arrows |
| 🖼️ Words | "Where is the …?" picture quiz, 15 categories, ~370 words, 8 difficulty levels |
| 👂 Listen | Hear a word, tap the picture, 6 levels up to sound-alike distractors |
| 🦖 Dino Show | Verbs and adjectives acted out by an animated dino (27 verbs, 22 adjectives); answers echoed as full sentences; 🎮 free-play sentence builder; act-it-out breaks |
| 🪐 Space | Orrery of the solar system with facts and a quiz |
| 🌍 World | The seven continents with facts and a quiz |
| 🎁 Prizes | Spend 40 ⚡ on a prize game (see below) |
| ⚙ (hold) | Parent panel: name, voice picker, levels, most-missed words, prize points |

## Automatic difficulty

Words, Listen and Dino Show share one engine: a weighted up-down staircase. A round solved on the first
try adds ⅓ of a level; any miss drops a full level. This settles where he gets about **3 in 4 right**.
The first 6 rounds of each mode move a whole level per answer, so it finds his level quickly. Levels
are saved per mode and per language. The parent panel shows each level and his first-try accuracy over
the last 20 rounds, and has a ↺ reset button.

| Level | Words (max 8) | Listen (max 6) | Dino Show (max 6) |
| --- | --- | --- | --- |
| 1 | 4 pictures, mixed categories | 3, mixed | verbs, 2 choices |
| 2–4 | 4–6 pictures, more from the same category | 4–6, same category | 3–4 verbs; adjectives; object pairs |
| 5–6 | 9 pictures, all one category | sound-alike words | verb + adjective ("the small dino that is jumping") |
| 7 | sound-alike words | | verb + 2 adjectives |
| 8 | find TWO things at once | | |

## Install on a phone

The repo contains a web-app manifest and a service worker. Once the game is served over https (see
the hosting note in the session), open the URL in Chrome (Android) or Safari (iPhone) and choose
**Add to Home Screen**. It then opens full-screen from its own 🦖 icon, works offline, and updates
itself whenever you push to `main`. Opening `index.html` directly as a file still works, but without
offline caching.

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

`sl_power` (⚡ points), `sl_skill` (difficulty levels), `sl_dinos` (museum), `sl_treasure` (treasure counts), `sl_name`, `sl_stats`
(missed words).
