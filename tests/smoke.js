/* Smoke test: opens the app in a phone-sized browser and plays through every
   tab and game, failing on any JavaScript error or broken layout.
   Run:  npm test        (needs `npx playwright install chromium` once) */
const path = require('path');
const { chromium } = require('playwright');

const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
let failures = 0;
const check = (ok, what) => { console.log((ok ? '  ✓ ' : '  ✗ ') + what); if (!ok) failures++; };

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/speech|voice/i.test(m.text())) errors.push(m.text()); });

  await page.goto(URL);
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem('sl_advsize', 'short'); });
  await page.reload();
  // every line handed to the voice is kept, to catch a message object passed instead of its text
  const hookSay = () => page.evaluate(() => { const o = sayAt; sayAt = (t, r, f) => { const a = JSON.parse(sessionStorage.getItem('ALLSAID') || '[]'); a.push(String(t)); sessionStorage.setItem('ALLSAID', JSON.stringify(a)); return o(t, r, f); }; });
  await hookSay();
  await page.mouse.click(180, 320);
  await page.waitForTimeout(300);
  check(await page.evaluate(() => activeTab === 'home' && $('homeGrid').children.length === 19 && !document.querySelector('#homeGrid [data-id="play"]')), 'opens on the home screen with 19 sections and no Play card');
  check(await page.evaluate(() => lang === 'de'), 'starts in German');

  console.log('Layout');
  for (const t of ['home', 'adv', 'city', 'stickers', 'king', 'dinos', 'things', 'folk', 'ride', 'baby', 'body', 'trace', 'words', 'ear', 'act', 'space', 'geo', 'dig', 'parent']) {
    await page.evaluate(t => showTab(t), t);
    await page.waitForTimeout(150);
    await page.evaluate(() => { window.scrollTo(0, 500); const v = document.querySelector('.view.on'); v.lastElementChild && v.lastElementChild.scrollIntoView(); });
    const top = await page.evaluate(() => Math.round(document.querySelector('header').getBoundingClientRect().top));
    check(top === 0, `header stays on screen in ${t}`);
  }

  console.log('Quizzes');
  const answerWords = () => page.evaluate(() => {
    if (plMode) document.querySelector('#grid .pl' + plMode.n).click();
    else if (artMode) [...document.querySelectorAll('.artBtn')].find(b => b.textContent === target.de[0]).click();
    else targets.forEach(t => [...document.querySelectorAll('#grid .card')].find(c => c.textContent === t.e && !c.classList.contains('right')).click());
  });
  await page.evaluate(() => showTab('words'));
  for (const L of [1, 3, 5, 8]) {
    await page.evaluate(L => { SKILL['words|de'] = { s: L + 0.2, n: 10, h: [] }; newRound(); }, L);
    await answerWords();
  }
  check(true, 'words quiz levels 1–8 (incl. der/die/das and plurals)');
  await page.evaluate(() => { for (let i = 0; i < 30; i++) { SKILL['words|de'] = { s: 5.2, n: 10, h: [] }; pluralRound(5); } artRound(VOCAB, 4); });
  check(await page.evaluate(() => artMode && !!target), 'der/die/das round builds');
  check(await page.evaluate(() => {
    const prev = lang; lang = 'es';
    const need = ['hada', 'agua', 'águila'];
    const arts = Object.fromEntries(VOCAB.filter(v => need.includes(v.es[1])).map(v => [v.es[1], v.es[0]]));
    const one = w => plPhrase({ es: ['el', w, w + 's'], de: ['die', 'x', 'xs'], en: ['x', 'xs'] }, 1);
    const ok = need.every(w => arts[w] === 'el') && one('hada') === 'un hada' && one('agua') === 'un agua' && one('águila') === 'un águila'
      && plPhrase({ es: ['la', 'casa', 'casas'], de: ['das', 'Haus', 'Häuser'], en: ['house', 'houses'] }, 1) === 'una casa';
    lang = prev; return ok;
  }), 'feminine nouns with a stressed a/ha keep el and un (el hada, el agua, el águila)');

  await page.evaluate(() => showTab('ear'));
  for (const L of [1, 4, 6]) {
    await page.evaluate(L => { SKILL['ear|de'] = { s: L + 0.2, n: 10, h: [] }; newEarRound(); }, L);
    await page.evaluate(() => [...document.querySelectorAll('#earGrid .card')].find(c => (c.dataset.e || c.textContent) === earTarget.e).click());
  }
  await page.evaluate(() => firstRound(4));
  check(await page.evaluate(() => !!earFirst), 'first-sound round builds');
  check(await page.evaluate(() => [...document.querySelectorAll('#earGrid .card .cl')].every(l => l.textContent.length > 1)), 'first-sound cards show the written word');

  await page.evaluate(() => showTab('act'));
  const kinds = new Set();
  for (let i = 0; i < 400; i++) {
    const k = await page.evaluate(i => { SKILL['act|de'] = { s: 1 + (i % 6) + 0.2, n: 10, h: [] }; actRound = i % 25 === 24 ? 5 : 1; newActRound(); return actTarget.kind; }, i);
    kinds.add(k);
  }
  for (const k of ['verb', 'adj', 'obj', 'combo', 'combo3', 'count', 'neg', 'prep', 'opp', 'tpr']) check(kinds.has(k), `Dino Show round type: ${k}`);
  await page.evaluate(() => { actRound = 1; newActRound(); if (actTarget.kind !== 'tpr') $('actGrid').querySelector('[data-ok="1"]').click(); });
  await page.evaluate(() => setActMode('play'));
  await page.evaluate(() => document.querySelector('.pverb').click());
  check(await page.evaluate(() => $('playSentence').textContent.length > 5), 'free play builds a sentence');
  await page.evaluate(() => setActMode('parrot'));
  check(await page.evaluate(() => !!PARROT && PARROT.text.length > 2), 'parrot mode shows a phrase');
  await page.evaluate(() => setActMode('story'));
  await page.evaluate(() => { for (let i = 0; i < 4; i++) storyAdvance(); });
  check(await page.evaluate(() => STORY.phase === 'quiz' && $('storyGrid').children.length === 4), 'story mode tells 4 scenes, then asks');
  await page.evaluate(() => [...$('storyGrid').children].forEach((c, i) => { if (i === 0) c.click(); }));
  await page.evaluate(() => setActMode('quiz'));

  await page.evaluate(() => { showTab('space'); SKILL['space|de'] = { s: 4.2, n: 10, h: [] }; spaceAsk(); spaceAnswer(spaceTargetIdx); });
  await page.evaluate(() => { showTab('geo'); SKILL['geoK|de'] = { s: 2.2, n: 10, h: [] }; SKILL['geoF|de'] = { s: 2.2, n: 10, h: [] };
    for (const m of ['continents', 'countries', 'flags', 'oceans']) setGeoMode(m);
    setGeoMode('countries'); answerCountry(C_BY[GEO.target]);
    setGeoMode('flags'); answerFlag(GEO.glow, document.querySelector('.flagBtn')); setGeoMode('explore'); });
  check(true, 'space and world quizzes');
  const books = await page.evaluate(() => {
    showTab('home'); showTab('space');
    const sky = !document.getElementById('spaceSky').hidden && document.getElementById('spaceBook').hidden;
    document.querySelector('#spaceTabs [data-space="planets"]').click();
    const planets = document.querySelectorAll('#spaceGrid .phAn').length;
    document.querySelector('#spaceGrid .phAn[data-space-id="moon"]').click();
    const moon = document.getElementById('spaceNow').textContent;
    document.getElementById('spaceBack').click();
    const back = !document.getElementById('spaceSky').hidden;
    document.querySelector('#spaceTabs [data-space="pics"]').click();
    const pics = document.querySelectorAll('#spaceGrid .phAn').length;
    document.querySelector('#spaceGrid .phAn[data-space-id="m87"]').click();
    const hole = document.getElementById('spaceNow').textContent;
    power = 80; savePower(); showDigLock();
    const road = [...document.querySelectorAll('#gameGrid .gcard')].find(c => /Straße|Road|Camino/.test(c.textContent));
    return { sky, planets, moon: moon.length > 30, back, pics, hole: /Loch|hole|agujero/i.test(hole), road: !!(road && road.querySelector('svg') && !/✏/.test(road.textContent)) };
  });
  check(books.sky && books.planets === 10 && books.moon && books.back && books.pics === 10 && books.hole && books.road,
    'the sky stays first, planets and famous pictures open in place, and the road prize shows a car ' + JSON.stringify(books));
  const geoOpen = await page.evaluate(() => {
    showTab('home'); showTab('geo');
    const opened = GEO.mode === 'countries' && /^Wo ist /.test(GEO.q) && document.querySelectorAll('#geoModes .modeBtn').length === 5;
    const gaps = geoQuizGaps();
    setGeoMode('continents');
    GEO.target = 'AN';
    const ice = iceAt(0, -75);
    answerContinent(ice);
    return { opened, gaps, ice, solved: GEO.selCont === 'AN' && !GEO.target };
  });
  check(geoOpen.opened && geoOpen.ice === 'AN' && geoOpen.solved && geoOpen.gaps.length === 0,
    'geography opens on a country question, and every prompt including Antarctica is on the map ' + JSON.stringify(geoOpen));

  console.log('Points and prizes');
  await page.waitForTimeout(1500);                       // let earlier bonus points land first
  const p0 = await page.evaluate(() => power);
  await page.evaluate(() => { showTab('words'); SKILL['words|de'] = { s: 1.2, n: 10, h: [] }; fireStreak = 0; newRound(); for (let i = 0; i < 3; i++) [...document.querySelectorAll('#grid .card')].find(c => !targets.some(t => t.e === c.textContent))?.click(); });
  await answerWords();
  await page.waitForTimeout(900);
  check(await page.evaluate(p0 => power === p0, p0), 'guessing (3 misses) earns no points');
  await page.evaluate(() => { power = 480; savePower(); showTab('dig'); });
  for (const g of ['dig', 'mem', 'bal', 'fw', 'bag', 'aq', 'fed', 'rp', 'sup', 'road']) {
    await page.evaluate(g => { showDigLock(); startGame(g); }, g);
    await page.waitForTimeout(300);
    check(await page.evaluate(g => pane === { dig: 'digPlay', mem: 'memPlay', bal: 'balPlay', fw: 'fwPlay', bag: 'bagPlay', aq: 'aqPlay', fed: 'fedPlay', rp: 'rpPlay', sup: 'supPlay', road: 'roadPlay' }[g], g), `prize game starts: ${g}`);
  }
  await page.evaluate(() => { power = 160; savePower(); showDigLock(); startGame('fed');
    [...document.querySelectorAll('#fedAnimals .fedAn')].find((b, i) => FED.opts[i] !== FED.want).click(); });
  check(await page.evaluate(() => FED && FED.n === 0), 'feeding the wrong animal does not end the round');
  await page.evaluate(() => [...document.querySelectorAll('#fedAnimals .fedAn')].find((b, i) => FED.opts[i] === FED.want).click());
  check(await page.evaluate(() => FED && FED.n === 1), 'feeding the animal he heard counts');
  // fireworks: wild tapping only gets 5 rockets out at once (the launcher reloads)
  {const n = await page.evaluate(() => { const p0 = power; power = 999; showDigLock(); startGame('fw'); power = p0; savePower(); const r = $('fw').getBoundingClientRect();
     for (let i = 0; i < 20; i++) $('fw').dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + r.width / 2, clientY: r.top + r.height / 3, bubbles: true }));
     return FW.shots; });
   check(n === 5, 'fireworks: 20 quick taps launch the 5 rockets that are loaded, not 20 (' + n + ')');}
  // caterpillar: it crawls to where he touches and eats the fruit there
  {const r = await page.evaluate(async () => {
     const p0 = power; power = 999; showDigLock(); startGame('rp'); power = p0; savePower(); const f = RP.fruits[0]; RP.tgt = [f.x, f.y]; const e0 = RP.eaten;
     for (let i = 0; i < 60 && RP.eaten === e0; i++) { RP.tgt = [f.x, f.y]; await new Promise(res => setTimeout(res, 100)); }
     return { ate: RP.eaten === e0 + 1, longer: RP.len === 5 };
   });
   check(r.ate && r.longer, 'caterpillar: crawls to the finger, eats the fruit and grows ' + JSON.stringify(r));}
  await page.evaluate(() => { showDigLock(); startGame('aq'); });
  await page.waitForTimeout(500);
  check(await page.evaluate(() => pane === 'aqPlay' && AQ && AQ.fish.length > 0 && AQ.goal === 18 && document.getElementById('aqPrompt').textContent.indexOf('0 / 18') >= 0), 'aquarium fish swim in, and the round counts to 18');
  {const r = await page.evaluate(() => {
     const p0 = power; power = 999; savePower(); showDigLock(); startGame('sup'); power = p0; savePower();
     slingLayout(360, 480);
     const rest = slingRest();
     SLING.holding = true;
     slingSetPull({ x: rest.x, y: rest.y + 150 });
     const preview = slingPreview().length;
     SLING.pull = { x: rest.x + 4, y: rest.y + 6 };
     const tiny = slingRelease();
     const t = SLING.targets[0];
     const de = slingPhrase(t.w);
     SLING.flying = true; SLING.x = t.x; SLING.y = t.y; SLING.vx = 0; SLING.vy = 0;
     slingTick(0.05);
     const hit = { left: SLING.targets.filter(x => x.alive).length, phrase: SLING.phrase, shown: document.getElementById('supWord').textContent, de };
     lang = 'en';
     const u = SLING.targets.find(x => x.alive);
     const en = slingPhrase(u.w);
     SLING.flying = true; SLING.x = u.x; SLING.y = u.y; SLING.vx = 0; SLING.vy = 0;
     slingTick(0.05);
     SLING.targets.forEach(x => { if (!x.alive) return; SLING.flying = true; SLING.x = x.x; SLING.y = x.y; SLING.vx = 0; SLING.vy = 0; slingTick(0.05); });
     lang = 'de';
     const round1 = SLING.deck.slice(0, 6).map(w => w.en);
     return { goal: SLING.goal, n: SLING.targets.length, preview, tiny, hit, en, word: u.w.en, done: SLING.done, got: SLING.got, between: SLING.between, round1 };
   });
   check(r.goal === 12 && r.n === 6 && r.preview >= 4 && r.tiny === false && r.hit.left === 5 && r.hit.phrase === r.hit.shown && r.hit.phrase === r.hit.de && /^(der|die|das) /.test(r.hit.phrase) && r.en === r.word && !r.done && r.got === 6 && r.between,
     'superman sling previews the arc, names a hit, and the first round is six of twelve ' + JSON.stringify(r));
   const rounds = await page.evaluate(() => {
     const first = SLING.deck.slice(0, 6).map(w => w.en);
     slingBeginRound(2);
     const second = SLING.targets.map(t => t.w.en);
     const overlap = second.filter(w => first.includes(w));
     SLING.targets.forEach(x => { SLING.flying = true; SLING.x = x.x; SLING.y = x.y; SLING.vx = 0; SLING.vy = 0; slingTick(0.05); });
     const sizes = [[360, 480], [390, 520], [320, 427], [520, 693], [693, 520]];
     const missed = [];
     sizes.forEach(([W, H]) => SLING_SPOTS.forEach(s => {
       if (!slingSpotReachable(W, H, s.x, s.y, 1)) missed.push('full ' + W + 'x' + H + ' ' + s.y);
       if (s.y >= 0.3 && !slingSpotReachable(W, H, s.x, s.y, 0.55)) missed.push('mid ' + W + 'x' + H + ' ' + s.y);
     }));
     return { second: second.length, overlap: overlap.length, unique: new Set(SLING.deck.map(w => w.en)).size, done: SLING.done, got: SLING.got, missed };
   });
   check(rounds.second === 6 && rounds.overlap === 0 && rounds.unique === 12 && rounds.done && rounds.got === 12 && rounds.missed.length === 0,
     'two rounds, no repeated picture, and every spot is reachable ' + JSON.stringify(rounds));}
  await page.evaluate(() => { power = 45; savePower(); showDigLock(); startGame('mem'); document.querySelector('#memPlay .quitBtn').click(); $('qsLeave').click(); });
  check(await page.evaluate(() => power === 45 && pane === 'digLock'), 'leaving a prize game right after starting gives the points back');
  await page.evaluate(() => { DINOS.forEach(d => prepParts(d)); showDigLock(); });
  check(true, 'all 11 dinosaur skeletons build');
  await page.evaluate(() => { power = 40; savePower(); showTab('dig'); startGame('bal'); });
  await page.waitForTimeout(300);
  const bal = await page.evaluate(() => {
    const H = bc.getBoundingClientRect().height, b = BAL && BAL.b[0];
    return { goal: BAL && BAL.goal, ratio: b && H ? b.vy / H : 0 };
  });
  check(bal.goal === 30 && bal.ratio > 0.11 && bal.ratio < 0.21, 'balloon round is longer and the balloons rise faster');
  await page.evaluate(() => showTab('home'));

  console.log('Adventure');
  await page.evaluate(() => { advEnsure(true); showTab('adv'); advGo(); });
  for (let n = 0; n < 40 && !(await page.evaluate(() => ADV.done)); n++) {
    await page.evaluate(() => {
      const st = advCur(); if (!st) return; if (activeTab !== st.tab) showTab(st.tab);
      for (let i = 0; i < ADV_GOAL[st.tab]; i++) advTick(st.tab);
    });
    await page.waitForTimeout(2900);
    await page.evaluate(() => { if (!ADV.done && activeTab === 'adv') advGo(); });
  }
  check(await page.evaluate(() => ADV.done), 'a whole adventure can be finished');
  await page.evaluate(() => { advEnsure(true); showTab('adv'); });
  await page.waitForTimeout(200);
  const pts = await page.evaluate(() => { const m = $('advMap').getBoundingClientRect(), out = [];
    for (let k = 0; k <= 16; k++) { const q = advBez(ADVP[0], ADVP[1], k / 16); out.push([m.left + q[0] / 100 * m.width, m.top + q[1]]); } return out; });
  await page.mouse.move(pts[0][0], pts[0][1]); await page.mouse.down();
  for (const [x, y] of pts.slice(1)) await page.mouse.move(x, y, { steps: 2 });
  await page.mouse.up(); await page.waitForTimeout(800);
  check(await page.evaluate(() => ADV.started && activeTab === ADV.plan[0].tab), 'dragging the dino along the path opens the first stop');

  console.log('Parent panel');
  await page.evaluate(() => showTab('parent'));
  check(await page.evaluate(() => $('repBars').children.length === 7), 'weekly report shows 7 days');
  check(await page.evaluate(() => !!$('syncCreate') && !!$('syncJoin') && /Familiencode|family code|código familiar/.test($('syncBody').textContent)), 'sync is ready in parent settings');
  await page.evaluate(() => { [...$('langBtns').children].find(b => b.textContent.includes('🇪🇸')).click(); });
  check(await page.evaluate(() => $('es').style.display === 'none' && localStorage.getItem('sl_langs') === 'de,en'), 'parent can switch Spanish off');
  await page.evaluate(() => { setLang('en', $('en')); [...$('langBtns').children].find(b => b.textContent.includes('🇬🇧')).click(); });
  check(await page.evaluate(() => lang === 'de' && document.querySelector('header .lang').style.display === 'none'), 'switching off the current language moves to one still on; one left hides the switch');
  await page.evaluate(() => { [...$('langBtns').children].find(b => b.textContent.includes('🇩🇪')).click(); });
  check(await page.evaluate(() => localStorage.getItem('sl_langs') === 'de'), 'the last language cannot be switched off');
  await page.evaluate(() => { localStorage.setItem('sl_langs', 'en,es'); });
  await page.reload(); await page.mouse.click(180, 320); await page.waitForTimeout(300); await hookSay();
  check(await page.evaluate(() => lang === 'en' && $('de').style.display === 'none'), 'with German off the app starts in an allowed language');
  await page.evaluate(() => { localStorage.removeItem('sl_langs'); });

  console.log('City');
  await page.evaluate(() => showTab('city'));
  await page.waitForTimeout(400);
  check(await page.evaluate(() => CITY.HITS().length > 50), 'city: the town is drawn');
  // visit each quarter of the world so everything is drawn once, and tap everything there
  for (const v of [[-1400, 2400, 1400, 3500], [1400, 2400, 5400, 3500], [-1400, 3400, 1400, 4500], [1400, 3400, 5400, 4500], [-1400, -900, 0, 700], [-1400, 700, 0, 2400], [0, -900, 1400, 700], [1400, -900, 2800, 700], [2800, -900, 4000, 700], [0, 700, 1400, 2400], [1400, 700, 2800, 2400], [2800, 700, 4000, 2400], [4000, -900, 5400, 700], [4000, 700, 5400, 2400]]) {
    for (let k = 0; k < 3; k++) { await page.evaluate(v => { CITY.TRAIN.ride = false; Object.assign(CITY.CAM, CITY.viewOf(...v, 1)); }, v); await page.waitForTimeout(400); }
    await page.evaluate(() => { const seen = new Set(); CITY.HITS().forEach(h => { if (seen.has(h.id)) return; seen.add(h.id);
      CITY.trigger(h.id, h.b, (h.b[0] + h.b[2]) / 2, (h.b[1] + h.b[3]) / 2, h.ref); }); });
    await page.waitForTimeout(1000);
  }
  // the elephant only comes out when a warehouse gate is opened
  await page.evaluate(() => { Object.assign(CITY.CAM, CITY.viewOf(4700, -320, 5150, 0, 1)); });
  await page.waitForTimeout(400);
  await page.evaluate(() => { [1, 2].forEach(k => { const h = CITY.HITS().find(h => h.id === 'gate' && h.ref === k); CITY.trigger('gate', h.b, h.b[0], h.b[1], k); }); });
  await page.waitForTimeout(2500);
  check(await page.evaluate(() => { const h = CITY.HITS().find(h => h.id === 'elephant'); if (h) CITY.trigger('elephant', h.b, h.b[0], h.b[1]); return !!h; }), 'city: a warehouse gate opens and the elephant walks out');
  await page.evaluate(() => { if (rewardOpen) closeReward(false); });
  check(await page.evaluate(() => CITY.FOUND.size === CITY.total() && CITY.total() >= 40), 'city: every animal in the whole world can be found');
  await page.evaluate(() => { Object.assign(CITY.CAM, CITY.viewOf(250, 1000, 700, 1350, 1)); });
  await page.waitForTimeout(300);
  const boarded = await page.evaluate(() => { const t = CITY.TRAIN; t.c = 450; t.leg = 1; t.dwell = true; t.t = 0;
    CITY.trigger('station', CITY.ENT.station.at, 450, 1200); return t.ride; });
  check(boarded, 'city: tapping the station while the train waits starts a ride');
  await page.click('#cFind');
  check(await page.evaluate(() => !!CITY.FIND() && !!CITY.ENT[CITY.FIND().id].at), 'city: "where is …?" picks a target');
  await page.evaluate(() => showTab('stickers'));
  check(await page.evaluate(() => document.querySelectorAll('#stkBook .stk').length === CITY.total() && document.querySelectorAll('#stkBook .stk.got').length === CITY.FOUND.size), 'sticker book shows every animal, found ones as stickers');
  check(await page.evaluate(() => !document.getElementById('museum') && document.querySelectorAll('#stkBook .stkDino').length === DINOS.length), 'dinosaur museum lives in the sticker book, not on the prize screen');
  await page.evaluate(() => { if (!found.includes('trex')) found.push('trex'); try { localStorage.setItem('sl_dinos', JSON.stringify(found)); } catch (e) {} showStickers(); });
  check(await page.evaluate(() => [...document.querySelectorAll('#stkBook .stkDino.got')].some(b => /Tyrannosaurus|Tiranosaurio/i.test(b.textContent) && b.querySelector('img') && /trex\.webp/.test(b.querySelector('img').getAttribute('src')))), 'a dinosaur saved earlier shows its living picture');
  check(await page.evaluate(() => {
    const locked = [...document.querySelectorAll('#stkBook .stkDino:not(.got)')];
    return locked.length === DINOS.length - 1 && locked.every(b => b.querySelector('canvas') && !b.querySelector('img') && b.textContent.trim() === '?');
  }), 'dinosaurs not yet dug stay as silhouettes without a picture');
  check(await page.evaluate(() => {
    const before = found.slice();
    showTab('dinos');
    const n = document.querySelectorAll('#v-dinos .phAn').length;
    document.querySelector('#v-dinos .phAn[data-id="stego"]').click();
    const on = document.querySelector('#v-dinos .phAn.on')?.dataset.id === 'stego';
    const clean = found.length === before.length && !found.includes('stego') && !document.querySelector('#v-dinos .phHero');
    showTab('stickers');
    return n === 15 && on && clean && !document.querySelector('#stkBook .stkDino.got img[src*="stego"]');
  }), 'browsing the dinosaur pictures does not unlock the museum');
  check(await page.evaluate(() => {
    const ids = STK_AREAS.flatMap(A => A[4]);
    const bad = ids.filter(id => { const e = CITY.ENT[id]; return !e || !e.n || e.n.length < 3 || e.n.some(s => !String(s).trim()); });
    const dinoBad = DINOS.filter(d => !(d.es && d.es[0]) || !(d.en && d.en[0]) || !(d.de && d.de[0])).map(d => d.k);
    const treBad = TREASURES.filter(t => !t.es || !t.en || !t.de).map(t => t.k);
    window._missingBridge = { bad, dinoBad, treBad };
    return !bad.length && !dinoBad.length && !treBad.length;
  }), 'every sticker, dinosaur and treasure has a word in es, en and de');
  await page.evaluate(() => {
    window.BRIDGE_LOG = [];
    if (!window._speak0) {
      window._speak0 = speechSynthesis.speak.bind(speechSynthesis);
      speechSynthesis.speak = function (u) { window.BRIDGE_LOG.push({ text: u.text, lang: u.lang, voice: (u.voice && u.voice.lang) || '' }); try { return window._speak0(u); } catch (e) {} };
    }
  });
  // one language at a time: a sticker speaks the app language; a flag for each bridge language says it in that language
  const tapCat = () => page.evaluate(() => {
    const e = CITY.ENT.cat, L = { de: 0, en: 1, es: 2 };
    const btn = [...document.querySelectorAll('#stkBook .stk.got')].find(b => b.textContent.includes(e.n[L[lang]]));
    window.BRIDGE_LOG = []; btn.click();
    return { lang, flags: [...document.querySelectorAll('#stkCard .stkFlag')].map(b => b.textContent), want: flagLangs() };
  });
  await page.waitForTimeout(700);
  let cat = await tapCat();
  await page.waitForTimeout(1500);
  check(await page.evaluate(L => window.BRIDGE_LOG.length >= 1 && window.BRIDGE_LOG.every(g => g.lang.slice(0, 2) === L), cat.lang)
    && cat.flags.length === cat.want.length && cat.want.length >= 1, 'tapping a collected sticker speaks only the app language, with a flag for each other bridge language');
  await page.evaluate(() => { window.BRIDGE_LOG = []; document.querySelector('#stkCard .stkFlag').click(); });
  await page.waitForTimeout(800);
  check(await page.evaluate(L => window.BRIDGE_LOG.length >= 1 && window.BRIDGE_LOG.every(g => g.lang.slice(0, 2) === L), cat.want[0]), 'a flag says the sticker in its own language');
  check(await page.evaluate(() => BRIDGE.includes('de') && $('de').style.display === 'none'), 'the flags can include a language that is switched off for learning');
  await page.evaluate(() => { showTab('parent'); document.querySelector('#bridgeBtns button[data-l="en"]').click(); });
  check(await page.evaluate(() => !BRIDGE.includes('en') && localStorage.getItem('sl_bridge').split(',').indexOf('en') < 0), 'a parent can turn one flag language off');
  await page.evaluate(() => showTab('stickers'));
  await page.waitForTimeout(700);
  cat = await tapCat();
  check(!cat.flags.includes('🇬🇧'), 'with English off, the sticker card has no English flag');
  await page.evaluate(() => { showTab('parent'); document.querySelector('#bridgeBtns button[data-l="en"]').click(); });
  await page.evaluate(() => { document.querySelector('#stkBook .stk.got').click(); $('stkGo').click(); });
  await page.waitForTimeout(300);
  check(await page.evaluate(() => activeTab === 'city'), 'a sticker can show its animal in the town');
  await page.click('#homeBtn');
  check(await page.evaluate(() => activeTab === 'home'), '🏠 goes back to the home screen');
  // interruptions: a short break resumes in place and repeats the question; a long one goes home
  const away = async ms => {
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
    await page.evaluate(ms => { hiddenAt = Date.now() - ms; Object.defineProperty(document, 'hidden', { value: false, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }, ms);
    await page.waitForTimeout(700);
  };
  await page.evaluate(() => { showTab('words'); window.SAID = []; const o = window.say; window.say = t => { SAID.push(t); o(t); }; });
  await away(60 * 1000);
  check(await page.evaluate(() => activeTab === 'words' && SAID.some(t => /\?/.test(t))), 'a 1-minute break: back exactly where he was, and the question is asked again');
  await away(6 * 60 * 1000);
  check(await page.evaluate(() => activeTab === 'home'), 'a 6-minute break: back on the home screen');

  {const p2 = await browser.newPage({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });
   await p2.goto(page.url().split('#')[0]); await p2.waitForTimeout(400);
   await p2.touchscreen.tap(100, 600); await p2.waitForTimeout(600);
   check(await p2.evaluate(() => activeTab === 'home'), 'the "tap to start" touch does not fall through to a home card'); await p2.close();}

  for (const [w, h, what] of [[800, 1280, 'tablet upright'], [1280, 800, 'tablet on its side']]) {
    const t = await browser.newPage({ viewport: { width: w, height: h - 60 }, screen: { width: w, height: h }, isMobile: true, hasTouch: true });
    await t.goto(page.url().split('#')[0]); await t.waitForTimeout(300); await t.touchscreen.tap(w / 2, h / 3); await t.waitForTimeout(500);
    const r = await t.evaluate(() => { const v = $('v-home'); return { s: UISCALE, fits: v.scrollHeight <= v.clientHeight + 2 }; });
    check(r.fits && (w < h ? r.s > 1.2 : true), `${what}: home screen fits${w < h ? ' and is scaled up (' + r.s.toFixed(2) + '×)' : ''}`);
    for (const tab of ['read', 'jobs', 'words', 'ear', 'space', 'geo', 'city']) {
      await t.evaluate(tb => showTab(tb), tab); await t.waitForTimeout(500);
      const ok = await t.evaluate(() => { const v = $('v-' + activeTab); return v.scrollHeight <= v.clientHeight + 2; });
      if (!ok) check(false, `${what}: ${tab} fits without scrolling`);
    }
    await t.close();
  }

  // reading: build a word by pulling the pieces together, then read one and pick its picture
  for (const lg of ['de', 'es', 'en']) {
    const r = await page.evaluate(async lg => {
      if (lang !== lg) $(lg).click(); showTab('read'); skillRec('read').s = 3;
      for (let k = 0; k < 80 && RD.kind !== 'build'; k++) readRound();
      await new Promise(res => setTimeout(res, 200));
      while (document.querySelector('.rGap')) document.querySelector('.rGap').click();
      const built = RD.done, word = RD.word.text;
      for (let k = 0; k < 80 && RD.kind !== 'read'; k++) readRound();
      document.querySelectorAll('#readGrid .rOpt')[RD.opts.indexOf(RD.word)].click();
      return { built, word, read: RD.done };
    }, lg);
    check(r.built && r.read, `reading (${lg}): "${r.word}" built from its pieces, and a word read and matched to its picture`);
  }
  await page.evaluate(() => { $('de').click(); showTab('home'); });

  for (const langs of ['', 'en,es']) {   // nothing may talk behind the "tap to start" screen
    const q = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const qerr = []; q.on('pageerror', e => qerr.push(e.message));
    await q.addInitScript(l => { if (l) localStorage.setItem('sl_langs', l); window.SPOKEN = []; speechSynthesis.speak = u => SPOKEN.push(u.text); }, langs);
    await q.goto(page.url().split('#')[0]); await q.waitForTimeout(1500);
    const said = await q.evaluate(() => SPOKEN.slice());
    check(!said.length && !qerr.length, `silent before the start tap${langs ? ' (languages ' + langs + ')' : ''}` + (said.length ? ': ' + said.join(' | ') : '') + (qerr.length ? ' ' + qerr[0] : ''));
    await q.close();
  }

  // the run is long: count it as touched now, so the window getting focus back is not taken as a 5-minute break
  await page.evaluate(() => { lastTouch = Date.now(); });
  {const q = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
   await q.addInitScript(() => { if (!sessionStorage.getItem('x')) { sessionStorage.setItem('x', 1); localStorage.setItem('sl_power', '5'); localStorage.setItem('sl_pgame', 'bal'); } });
   await q.goto(page.url().split('#')[0]); await q.waitForTimeout(400);
   check(await q.evaluate(() => power === 45 && !localStorage.getItem('sl_pgame')), 'a prize game cut off by the system gives its points back');
   await q.close();}

  // jobs: a 'who helps?' round answered right, and every job's little game played to the end.
  // Wait until the house / letter / end card is actually there (a fixed sleep raced the round).
  {const r = await page.evaluate(async () => {
     lastTouch = Date.now(); showTab('jobs'); ADV.started = false; JM = 'need'; jobRound();
     const i = JR.opts.findIndex(o => o.j === JR.j); document.querySelectorAll('#jobStage .jCard')[i].click();
     const ok = JR.done;
     const sleep = ms => new Promise(res => setTimeout(res, ms));
     const waitFor = async (fn, ms = 5000) => { const t0 = performance.now(); while (performance.now() - t0 < ms) { const v = fn(); if (v) return v; await sleep(40); } return null; };
     const ends = [];
     for (const j of JOBS) {
       jobTask(j, true, 1); const T = TASKS[j.k];
       for (let s = 0; s < 12 && !document.querySelector('.jEnd'); s++) {
         if (T.houses) {
           const btn = await waitFor(() => {
             if (document.querySelector('.jEnd')) return 'end';
             if (!JR || JR.kind !== 'task' || JR.lock || JR.want == null) return null;
             return [...document.querySelectorAll('.jScene .jT')].find(b => { const n = b.querySelector('.jNum'); return n && n.textContent == JR.want; }) || null;
           });
           if (!btn || btn === 'end') break; btn.click();
         } else if (T.letters) {
           const btn = await waitFor(() => {
             if (document.querySelector('.jEnd')) return 'end';
             const board = document.querySelector('.jBoard'); if (!board) return null;
             const w = (LETTERWORD[lang][board.textContent.toLowerCase()] || [])[0]; if (!w) return null;
             return [...document.querySelectorAll('.jScene .jT')].find(b => !b.classList.contains('ok') && b.textContent === w) || null;
           });
           if (!btn || btn === 'end') break; btn.click();
         } else {
           const btn = await waitFor(() => document.querySelector('.jEnd') ? 'end' : ([...document.querySelectorAll('.jScene .jT')].find(b => !b.classList.contains('done')) || null));
           if (!btn || btn === 'end') break; btn.click();
         }
       }
       if (await waitFor(() => document.querySelector('.jEnd'))) ends.push(j.k);
     }
     showTab('home'); return { ok, ends: ends.length };
   });
   check(r.ok && r.ends === 10, `jobs: a "who helps?" answer, and all ${r.ends}/10 job games finished`);}

  console.log('Parent gate');
  // a short press only shows the tip; holding the gear for 4 seconds opens the parent section
  const gear = (ev) => page.evaluate(ev => document.getElementById('gearBtn').dispatchEvent(new PointerEvent(ev, { bubbles: true, cancelable: true })), ev);
  await page.evaluate(() => showTab('home'));
  await gear('pointerdown'); await page.waitForTimeout(1500); await gear('pointerup');
  check(await page.evaluate(() => activeTab !== 'parent' && $('gearTip').classList.contains('on')), 'a short press on the gear only shows "hold for 4 seconds"');
  await gear('pointerdown'); await page.waitForTimeout(4300);
  check(await page.evaluate(() => activeTab === 'parent'), 'holding the gear for 4 seconds opens parent settings');
  await gear('pointerup');

  // photo books: habitats, a full-screen animal, people, both mini-games, passport stamps
  {const photo = await page.evaluate(async () => {
     const sleep = ms => new Promise(res => setTimeout(res, ms));
     const waitFor = async fn => { for (let i = 0; i < 50; i++) { if (fn()) return true; await sleep(100); } return false; };
     window.PHOTO_SAID = [];
     if (!window._utter0) window._utter0 = utter;
     utter = function () { PHOTO_SAID.push(String(arguments[0])); return window._utter0.apply(null, arguments); };
     if (rewardOpen) closeReward(false);
     power = 5; savePower();
     if (lang !== 'de') $('de').click();
     const keepBridge = BRIDGE.slice();
     BRIDGE = ['de'];
     showTab('king');
     const quizFirst = PH.screen === 'hide' && PUZ && PUZ.item && /^Wo ist /.test(findQ(PUZ.item)) && document.querySelectorAll('#v-king .phChoice').length >= 3 && !document.querySelector('#v-king .phLive');
     document.querySelector('#v-king [data-act="gallery"]').click();
     const habs = document.querySelectorAll('#v-king .phHab').length;
     const lazy = [...document.querySelectorAll('#v-king .phHab img')].every(img => img.getAttribute('loading') === 'lazy');
     document.querySelector('#v-king .phHab[data-id="farm"]').click();
     const farmN = document.querySelectorAll('#v-king .phAn').length;
     document.querySelector('#v-king .phAn[data-id="cow"]').click();
     const cow = PHOTO_PACK.animals.find(a => a.id === 'cow');
     const root = document.getElementById('v-king');
     const opened = root.querySelectorAll('.phAn').length === farmN && root.querySelector('.phAn.on')?.dataset.id === 'cow' && !root.querySelector('.phHero') && !root.querySelector('[data-act="prev"]');
     const saidName = await waitFor(() => PHOTO_SAID.some(t => t === cow.names.de.full));
     const saidFact = await waitFor(() => PHOTO_SAID.some(t => t === cow.facts[0].de));
     const noNoise = !PHOTO_SAID.some(t => t === 'muh');
     const firstSaid = PHOTO_SAID.slice(0, 6).map(t => String(t).slice(0, 48));
     const y = root.scrollTop;
     PHOTO_SAID = [];
     document.querySelector('#v-king .phAn[data-id="cow"]').click();
     const saidOther = await waitFor(() => PHOTO_SAID.some(t => t === cow.facts[1].de));
     const held = root.scrollTop === y;
     $('es').click();
     showTab('king');
     document.querySelector('#v-king [data-act="gallery"]').click();
     document.querySelector('#v-king .phHab[data-id="birds"]').click();
     document.querySelector('#v-king .phAn[data-id="eagle"]').click();
     const eagleName = document.querySelector('#v-king .phName') && document.querySelector('#v-king .phName').textContent;
     $('de').click();
     showTab('folk');
     const groups = document.querySelectorAll('#v-folk .phGrp').length;
     document.querySelector('#v-folk .phGrp').click();
     const peopleN = document.querySelectorAll('#v-folk .phAn').length;
     document.querySelector('#v-folk .phAn').click();
     const person = document.querySelector('#v-folk .phHero');
     const personOk = !!(person && /people\/.+\.webp/.test(person.getAttribute('src')));
     const pass = JSON.parse(localStorage.getItem('sl_passport') || '{}');
     BRIDGE = keepBridge;
     showTab('home');
     return { quizFirst, habs, lazy, farmN, opened, saidName, saidFact, saidOther, noNoise, held, eagleName, groups, peopleN, personOk,
       lang, reward: rewardOpen, firstSaid,
       stamped: pass.a && pass.a.includes('cow') && pass.a.includes('eagle') && pass.p && pass.p.length === 1 };
   });
   check(photo.quizFirst && photo.habs === 10 && photo.lazy, 'animals open on the guessing quiz, and the gallery still has 10 habitats');
   check(photo.farmN === 10 && photo.opened && photo.held, 'a habitat stays on its picture grid, and a tap highlights that animal without scrolling away');
   check(photo.saidName && photo.saidFact && photo.saidOther && photo.noNoise, 'the animal says the name, then one fact, the other fact on the next tap, and no animal noise'
     + (photo.saidName && photo.saidFact && photo.saidOther ? '' : ' ' + JSON.stringify({ n: photo.saidName, f: photo.saidFact, o: photo.saidOther, lang: photo.lang, reward: photo.reward, said: photo.firstSaid })));
   check(photo.eagleName === 'el águila', 'the card uses the Spanish article from the photo pack (el águila)');
   check(photo.groups === 2 && photo.peopleN >= 10 && photo.personOk, 'people of the world opens long ago and today, then a person');
   check(photo.stamped, 'the first look at an animal or a person earns one passport stamp');
   const hide = await page.evaluate(() => {
     showTab('king');
     const cats = [];
     for (let i = 0; i < PHOTO_PACK.habitats.length; i++) { cats.push(PUZ.item.habitat); if (i < PHOTO_PACK.habitats.length - 1) findRound(); }
     const choices = document.querySelectorAll('#v-king .phChoice').length;
     const said = document.querySelectorAll('#v-king [data-act="findSay"]').length === 1;
     const p0 = power;
     document.querySelector(`#v-king .phChoice:not([data-id="${PUZ.item.id}"])`).click();
     const held = power === p0;
     document.querySelector(`#v-king .phChoice[data-id="${PUZ.item.id}"]`).click();
     showTab('things');
     const thingQuiz = PH.kind === 't' && PH.screen === 'hide' && /^Wo ist /.test(findQ(PUZ.item));
     const groups = [];
     for (let i = 0; i < thingGroups().length; i++) { groups.push(PUZ.item.group); if (i < thingGroups().length - 1) findRound(); }
     document.querySelector('#v-things [data-act="gallery"]').click();
     const gallery = document.querySelectorAll('#v-things .phHab').length;
     return { choices, said, held, up: power === p0 + 1, cats: new Set(cats).size, need: PHOTO_PACK.habitats.length, thingQuiz, groups: new Set(groups).size, gneed: thingGroups().length, gallery, noHouse: !document.querySelector('.phLive') };
   });
   check(hide.choices >= 3 && hide.said && hide.held && hide.up && hide.cats === hide.need && hide.noHouse, "animals quiz asks where something is, visits every category, and the house game is gone");
   check(hide.thingQuiz && hide.groups === hide.gneed && hide.gallery === hide.gneed, "things open on the guessing quiz and the gallery is still there");
  }

  {const more = await page.evaluate(async () => {
     const sleep = ms => new Promise(res => setTimeout(res, ms));
     const waitFor = async fn => { for (let i = 0; i < 60; i++) { if (fn()) return true; await sleep(100); } return false; };
     if (rewardOpen) closeReward(false);
     if (lang !== 'de') $('de').click();
     BRIDGE = ['de'];
     window.PHOTO_SAID = [];
     showTab('ride');
     const quizFirst = PH.screen === 'hide' && PUZ && PUZ.item && /^Wo ist /.test(findQ(PUZ.item)) && !!document.querySelector('#v-ride [data-act="gallery"]');
     const vehGroups = [];
     for (let i = 0; i < vehicleGroups().length; i++) { vehGroups.push(PUZ.item.group); if (i < vehicleGroups().length - 1) findRound(); }
     document.querySelector('#v-ride [data-act="gallery"]').click();
     const ids = [...document.querySelectorAll('#v-ride .phHab')].map(b => b.dataset.id);
     const lazy = [...document.querySelectorAll('#v-ride .phHab img')].every(img => img.getAttribute('loading') === 'lazy');
     document.querySelector('#v-ride .phHab[data-id="helpers"]').click();
     const n = document.querySelectorAll('#v-ride .phAn').length;
     document.querySelector('#v-ride .phAn[data-id="fire-truck"]').click();
     const ft = PHOTO_PACK.vehicles.find(x => x.id === 'fire-truck');
     const ride = document.getElementById('v-ride');
     const opened = ride.querySelectorAll('.phAn').length === n && ride.querySelector('.phAn.on')?.dataset.id === 'fire-truck' && !ride.querySelector('.phHero') && !ride.querySelector('[data-act="next"]');
     const saidName = await waitFor(() => PHOTO_SAID.some(t => t === ft.names.de.full));
     const saidSound = await waitFor(() => PHOTO_SAID.some(t => t === ft.sound.de));
     const saidFact = await waitFor(() => PHOTO_SAID.some(t => t === ft.facts[0].de));
     $('es').click();
     const esName = document.querySelector('#v-ride .phName') && document.querySelector('#v-ride .phName').textContent;
     const amb = PHOTO_PACK.vehicles.find(x => x.id === 'ambulance').names.es.full;
     $('de').click();
     showTab('ride');
     const choices = document.querySelectorAll('#v-ride .phChoice').length;
     const blurred = !!(PUZ && PUZ.item) && document.querySelectorAll('#v-ride [data-act="findSay"]').length === 1;
     const p0 = power;
     document.querySelector(`#v-ride .phChoice:not([data-id="${PUZ.item.id}"])`).click();
     const held = power === p0;
     document.querySelector(`#v-ride .phChoice[data-id="${PUZ.item.id}"]`).click();
     document.querySelector(`#v-ride .phChoice[data-id="${PUZ.item.id}"]`).click();
     const hideUp = power === p0 + 1;
     showTab('baby');
     const pairs = document.querySelectorAll('#v-baby .phAn').length;
     const pairLazy = [...document.querySelectorAll('#v-baby .phAn img')].every(img => img.getAttribute('loading') === 'lazy');
     PHOTO_SAID = [];
     document.querySelector('#v-baby .phAn[data-id="dog"]').click();
     const babyImg = document.querySelector('#v-baby .phMorphTop');
     const adultImg = document.querySelector('#v-baby .phAdult');
     const morph = !!(babyImg && adultImg && /dog-baby/.test(babyImg.getAttribute('src')) && /dog-adult/.test(adultImg.getAttribute('src')));
     const saidBaby = await waitFor(() => PHOTO_SAID.some(t => t === 'der Welpe'));
     const saidAdult = await waitFor(() => PHOTO_SAID.some(t => t === 'der Hund'));
     const dog = PHOTO_PACK.pairs.find(p => p.id === 'dog');
     const saidGrow = await waitFor(() => PHOTO_SAID.some(t => t === dog.facts[0].de));
     const slid = document.querySelector('#v-baby .phMorphTop') && document.querySelector('#v-baby .phMorphTop').classList.contains('gone');
     document.querySelector('#v-baby .phReplay').click();
     const replayReset = !!(document.querySelector('#v-baby .phMorphTop') && !document.querySelector('#v-baby .phMorphTop').classList.contains('gone') && document.querySelector('#v-baby .phName').textContent === 'der Welpe');
     showTab('king');
     document.querySelector('#v-king [data-act="gallery"]').click();
     document.querySelector('#v-king [data-id="polar"]').click();
     const pk = document.getElementById('v-king');
     const max = pk.scrollHeight - pk.clientHeight;
     const before = max > 20 ? 20 : 0;
     pk.scrollTop = before;
     const buttons = [...pk.querySelectorAll('.phAn')];
     buttons[0].click();
     const firstName = pk.querySelector('.phName').textContent;
     buttons[1].click();
     const switched = firstName !== pk.querySelector('.phName').textContent && pk.querySelector('.phAn.on')?.dataset.id === buttons[1].dataset.id && pk.querySelectorAll('.phAn.on').length === 1;
     const scrollHeld = pk.scrollTop === before && !pk.querySelector('[data-act="prev"]');
     const wrapped = switched;
     const stillCard = scrollHeld;
     showTab('baby');
     document.querySelector('#v-baby .phGrow').click();
     const gChoices = document.querySelectorAll('#v-baby .phChoice').length;
     const babyShown = !!document.querySelector('#v-baby .phClear');
     const gp0 = power;
     document.querySelector('#v-baby .phChoice[data-ok="0"]').click();
     const gHeld = power === gp0;
     document.querySelector('#v-baby .phChoice[data-ok="1"]').click();
     const pass = JSON.parse(localStorage.getItem('sl_passport') || '{}');
     showTab('home');
     return { quizFirst, vehGroups: new Set(vehGroups).size, vehNeed: vehicleGroups().length, ids, lazy, n, opened, saidName, saidSound, saidFact, esName, amb, choices, blurred, held, up: power >= p0 + 1,
       pairs, pairLazy, morph, saidBaby, saidAdult, saidGrow, slid, replayReset, wrapped, stillCard, gChoices, babyShown, gHeld, hideUp, gUp: power === gp0 + 1,
       stamped: pass.v && pass.v.includes('fire-truck') && pass.b && pass.b.includes('dog') };
   });
   check(more.quizFirst && more.vehGroups === more.vehNeed && more.ids.join() === 'helpers,buildingSite,road,rails,air,water' && more.lazy, 'vehicles open on the guessing quiz, visit every group, and the gallery is still there');
   check(more.n === 6 && more.opened && more.saidName && more.saidSound && more.saidFact, 'a vehicle stays on the grid and says the name, the sound, and a fact');
   check(more.esName === 'el camión de bomberos' && more.amb === 'la ambulancia', 'vehicle cards use the Spanish article from the photo pack');
   check(more.choices >= 3 && more.blurred && more.held && more.hideUp, "listen and find works for vehicles");
   check(more.pairs === 16 && more.pairLazy && more.morph && more.saidBaby && more.saidAdult && more.saidGrow && more.slid && more.replayReset, 'a baby photo slides to the grown-up, and replay starts from the baby again');
   check(more.wrapped && more.stillCard, 'tapping another animal switches the explanation and leaves the grid where it was');
   check(more.gChoices === 3 && more.babyShown && more.gHeld && more.gUp, 'matching a baby to its grown-up: a wrong tap keeps the point');
   check(more.stamped, 'the first vehicle and the first baby earn a passport stamp');
  }

  {const body = await page.evaluate(async () => {
     const sleep = ms => new Promise(res => setTimeout(res, ms));
     const waitFor = async fn => { for (let i = 0; i < 60; i++) { if (fn()) return true; await sleep(100); } return false; };
     if (rewardOpen) closeReward(false);
     if (lang !== 'de') $('de').click();
     BRIDGE = ['de'];
     window.PHOTO_SAID = window.PHOTO_SAID || [];
     if (!window._utter0) { window._utter0 = utter; utter = function () { PHOTO_SAID.push(String(arguments[0])); return window._utter0.apply(null, arguments); }; }
     PHOTO_SAID.length = 0;
     showTab('body');
     const ids = [...document.querySelectorAll('#v-body .phHab')].map(b => b.dataset.id);
     const lazy = [...document.querySelectorAll('#v-body .phHab img')].every(img => img.getAttribute('loading') === 'lazy');
     document.querySelector('#v-body .phHab[data-id="bones"]').click();
     const diagram = !!document.querySelector('#v-body .phMap img[src="body/skeleton.webp"]') && !document.querySelector('#v-body .phAn') && !document.querySelector('#v-body .phMap svg');
     const skull = document.querySelector('#v-body .phHot[data-id="skull"]');
     if (skull) skull.click();
     const sk = PHOTO_PACK.body.find(x => x.id === 'skull');
     const opened = !!(diagram && skull && document.querySelector('#v-body .phHot.on') && document.querySelector('#v-body .phHot.on').dataset.id === 'skull');
     const saidName = await waitFor(() => PHOTO_SAID.some(t => t === sk.names.de.full));
     const saidFact = await waitFor(() => PHOTO_SAID.some(t => t === sk.facts[0].de));
     showTab('body');
     document.querySelector('#v-body .phHab[data-id="heart"]').click();
     PHOTO_SAID.length = 0;
     document.querySelector('#v-body .phHot[data-id="heart"]').click();
     const heart = PHOTO_PACK.body.find(x => x.id === 'heart');
     const saidHeart = await waitFor(() => PHOTO_SAID.some(t => t === heart.names.de.full));
     const saidSound = await waitFor(() => PHOTO_SAID.some(t => t === heart.sound.de));
     showTab('body');
     document.querySelector('#v-body .phTouch').click();
     const part = document.querySelector('#v-body .phHero');
     const shown = !!(part && /body\/.+\.webp/.test(part.getAttribute('src')) && document.querySelector('#v-body .phTouchGo'));
     const p0 = power;
     document.querySelector('#v-body [data-act="touched"]').click();
     document.querySelector('#v-body [data-act="touched"]').click();
     const once = power === p0 + 1;
     const pass = JSON.parse(localStorage.getItem('sl_passport') || '{}');
     showTab('home');
     return { ids: ids.join(), lazy, opened, saidName, saidFact, saidHeart, saidSound, shown, once, stamped: pass.y && pass.y.includes('skull') && pass.y.includes('heart') };
   });
   check(body.ids === 'bones,muscles,heart,lungs,brain,tummy,senses,skin,touch' && body.lazy, 'my body shows nine groups, photos loaded lazily');
   check(body.opened && body.saidName && body.saidFact, 'the skeleton diagram stays one picture, and the skull says its name and a fact');
   check(body.saidHeart && body.saidSound, 'a body card with a sound says the sound too');
   check(body.shown && body.once, 'touch your body: one tap cheers and earns a single point');
   check(body.stamped, 'body cards earn passport stamps');
  }

  // collecting again: a full sticker book starts round 2 from zero; a full museum starts a new round at the next dig
  {const r = await page.evaluate(() => { const keep = [...CITY.FOUND]; CITY.animals().forEach(id => CITY.FOUND.add(id)); showTab('stickers');
     const full = !!document.getElementById('stkAgain'); document.getElementById('stkAgain').click();
     const ok = full && CITY.FOUND.size === 0 && CITY.round() >= 2; keep.forEach(id => CITY.FOUND.add(id));
     found = DINOS.map(d => d.k); power = 99; savePower(); showTab('dig'); showDigLock(); startGame('dig');
     const dig = found.length === 0 && dinoRound >= 2; showDigLock(); showTab('home'); return ok && dig; });
   check(r, 'a full sticker book and a full dino museum both start a new round from zero');}
  // photo books: back returns to the same place in a long list; a card speaks only the app language,
  // the other languages only when their flag is tapped
  {const r = await page.evaluate(async () => {
     const sleep = ms => new Promise(res => setTimeout(res, ms));
     const keepB = BRIDGE; BRIDGE = ['de', 'en', 'es'];
     showTab('folk'); photoRoot().querySelectorAll('[data-act="grp"]')[1].click(); await sleep(50);
     const root = photoRoot(); root.scrollTop = 400; const top = root.scrollTop;
     const said = []; const o = speechSynthesis.speak.bind(speechSynthesis);
     speechSynthesis.speak = u => { said.push(u.lang); try { o(u); } catch (e) {} };
     [...root.querySelectorAll('[data-act="open"]')].find(t => t.getBoundingClientRect().top > root.getBoundingClientRect().top).click();
     await sleep(1500);
     const flags = document.querySelectorAll('#v-folk .phLang').length;
     const oneLang = said.length > 0 && said.every(l => /^de/i.test(l));
     document.querySelector('#v-folk [data-act="back"]').click(); await sleep(50);
     const kept = Math.abs(photoRoot().scrollTop - top) < 2;
     speechSynthesis.speak = o; BRIDGE = keepB; showTab('home');
     return { flags, oneLang, kept, top, said };
   });
   check(r.kept && r.top > 0, 'photo books: back from a card returns to the same place in the list' + (r.kept ? '' : ' ' + JSON.stringify(r)));
   check(r.flags === 2 && (r.oneLang || r.said.length === 0), 'photo cards speak the app language only, with flags for the other two' + (r.flags === 2 && (r.oneLang || r.said.length === 0) ? '' : ' ' + JSON.stringify(r)));}
  // something missed comes back 2–3 rounds later in the same game; the parent's weekly note lists it
  {const r = await page.evaluate(() => {
     showTab('words'); const order = [], cards = () => [...document.querySelectorAll('#grid .card')]; let missed = null;
     for (let i = 0; i < 9; i++) {
       newRound(); if (!target || artMode || plMode) { i--; continue; }
       const t = target; order.push(t.e);
       if (i === 1) { missed = t.e; cards().find(c => !c.textContent.includes(t.e)).click(); }
       cards().find(c => c.textContent.includes(t.e)).click(); clearTimeout(roundT);
     }
     const back = order.indexOf(missed, 2);
     showTab('parent'); const note = document.getElementById('repNote').textContent; showTab('home');
     const w = VOCAB.find(v => v.e === missed);
     return { back, inNote: note.includes(w[lang].join(' ')), order: order.join(' ') };
   });
   check(r.back >= 3 && r.back <= 4, 'a missed word comes back 2–3 rounds later' + (r.back >= 3 && r.back <= 4 ? '' : ' ' + JSON.stringify(r)));
   check(r.inNote, 'the weekly note in the parent section lists what he still finds hard');}
  // the map: the space station has its own name (not just "space"), and a tap only comes a little closer
  {const r = await page.evaluate(async () => {
     const fr = () => new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
     showTab('city'); await fr(); if (CITY.FIND()) document.getElementById('cFind').click();   // an earlier check left the find game on
     Object.assign(CITY.CAM, CITY.viewOf(3150, -3600, 3450, -3300, 1)); await fr();
     const hits = CITY.HITS(), at = (x, y) => { let best = null; for (const h of hits) { const b = h.b; if (x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3]) { const a = (b[2] - b[0]) * (b[3] - b[1]); if (!best || a < best.a) best = { id: h.id, a }; } } return best && best.id; };
     const station = at(3300, -3450);
     Object.assign(CITY.CAM, CITY.worldView()); await fr();   // zoomed right out
     const k0 = CITY.CAM.k, b = CITY.ENT.bakery.at, [sx, sy] = CITY.toScreen((b[0] + b[2]) / 2, (b[1] + b[3]) / 2);
     CITY.tapAt(sx, sy); await new Promise(res => setTimeout(res, 1300));
     const ratio = CITY.CAM.k / k0; showTab('home');
     return { station, ratio };
   });
   check(r.station === 'spacestation', 'tapping the space station names the space station' + (r.station === 'spacestation' ? '' : ' (got ' + r.station + ')'));
   check(r.ratio > 1.05 && r.ratio <= 1.55, 'a tap on the map zooms in only a little (at most 1.5×)' + ' ' + r.ratio.toFixed(2));}
  console.log('Writing');
  {
    const menu = await page.evaluate(() => {
      LANGS_ON = ['de', 'en', 'es'];
      try { localStorage.setItem('sl_langs', 'de,en,es'); } catch (e) {}
      applyLangs();
      setLang('de', document.getElementById('de'));
      showTab('trace');
      const cards = [...document.querySelectorAll('#traceGrid [data-mode]')];
      return {
        menu: document.getElementById('traceMenu').classList.contains('on'),
        play: document.getElementById('tracePlay').classList.contains('on'),
        modes: cards.map(b => b.dataset.mode),
        wordsLabel: cards.find(b => b.dataset.mode === 'words').getAttribute('aria-label'),
        hello: document.getElementById('traceHello').textContent,
        noSegs: !document.getElementById('segs'),
        back: document.getElementById('traceBack').classList.contains('phBack')
      };
    });
    check(menu.menu && !menu.play && menu.noSegs, 'writing opens on a menu, with no mode buttons above the canvas');
    check(menu.modes.join() === 'words,abc,ABC,123' && menu.wordsLabel === 'Wörter' && menu.hello === 'Was schreibst du?',
      'the menu offers words, lowercase, uppercase and numbers (' + menu.modes.join() + ')');
    check(menu.back, 'writing practice uses the same back button as the picture books');
    const letters = await page.evaluate(() => {
      document.querySelector('#traceGrid [data-mode="abc"]').click();
      const bar = [...document.querySelectorAll('#letterbar button')].map(b => b.textContent);
      return {
        mode, play: document.getElementById('tracePlay').classList.contains('on'),
        menu: document.getElementById('traceMenu').classList.contains('on'),
        words: document.getElementById('v-trace').classList.contains('words'),
        bar: bar.join(''), alpha: ALPHA.de.join(''), cur, shape: !!SHAPES[cur]
      };
    });
    check(letters.mode === 'abc' && letters.play && !letters.menu && !letters.words && letters.bar === letters.alpha && letters.shape,
      'lowercase still traces the German alphabet, one letter at a time');
    await page.evaluate(() => document.getElementById('traceBack').click());
    check(await page.evaluate(() => document.getElementById('traceMenu').classList.contains('on') && !document.getElementById('tracePlay').classList.contains('on')),
      'back from a letter returns to the writing menu');
    const words = await page.evaluate(() => {
      const bad = [];
      WRITE_WORDS.forEach(w => ['en', 'de', 'es'].forEach(L => {
        const cs = [...w[L]];
        if (cs.length < 2 || cs.length > 5 || cs.some(ch => !SHAPES[ch])) bad.push(L + ':' + w[L]);
      }));
      document.querySelector('#traceGrid [data-mode="words"]').click();
      const spelled = [...document.querySelectorAll('#wordSpell button')].map(b => b.textContent).join('');
      const flags = [...document.querySelectorAll('#wordFlags button')].map(b => b.dataset.lang);
      return {
        bad, spelled, word: writeCur.de, emoji: document.getElementById('wordEmoji').textContent,
        shown: writeCur.e, flags: flags.join(), on: document.querySelector('#wordFlags .on').dataset.lang,
        wordsClass: document.getElementById('v-trace').classList.contains('words'),
        letterbar: getComputedStyle(document.getElementById('letterbar')).display
      };
    });
    check(words.bad.length === 0, 'every writing word is 2–5 traceable letters in English, German and Spanish' + (words.bad.length ? ': ' + words.bad.slice(0, 4).join(', ') : ''));
    check(words.wordsClass && words.spelled === words.word && words.emoji === words.shown && words.emoji.length > 0 && words.letterbar === 'none',
      'words mode shows the picture and the spelling, letter by letter');
    check(words.flags === 'es,en,de' && words.on === 'de', 'words mode shows a big flag for each language, with German on');
    const switched = await page.evaluate(() => {
      const emoji = writeCur.e;
      document.querySelector('#wordFlags [data-lang="en"]').click();
      const spelled = [...document.querySelectorAll('#wordSpell button')].map(b => b.textContent).join('');
      return { lang, spelled, word: writeCur.en, emoji, still: document.getElementById('wordEmoji').textContent, header: document.getElementById('en').classList.contains('on') };
    });
    check(switched.lang === 'en' && switched.spelled === switched.word && switched.still === switched.emoji && switched.header,
      'the flag switches the spelling and keeps the same picture (' + switched.word + ')');
    const finished = await page.evaluate(() => {
      power = 5;
      const word = writeCur.en, emoji = writeCur.e, steps = playlist.length;
      for (let i = 0; i < steps; i++) finishItem();
      const praised = document.getElementById('wordText').textContent;
      const face = document.getElementById('face').textContent;
      clearTimeout(holdT);
      document.getElementById('praise').style.display = 'none';
      showTab('home');
      setLang('de', document.getElementById('de'));
      return { word, emoji, praised, face };
    });
    check(finished.praised === finished.word && finished.face === finished.emoji, 'finishing the last letter celebrates the whole word');
    check(await page.evaluate(() => !document.querySelector('#traceGrid [data-mode="name"]')), 'the writing menu has no name card');
    const reward = await page.evaluate(() => {
      setLang('de', document.getElementById('de'));
      showTab('trace');
      document.querySelector('#traceGrid [data-mode="words"]').click();
      for (let i = 0; i < playlist.length; i++) finishItem();
      const offered = document.getElementById('wordLaunch').classList.contains('on');
      const btn = document.getElementById('wlBtn');
      btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 7, buttons: 1 }));
      WL.base = 0; WL.holdAt = performance.now() - 4000; WL.phase = 'hold'; WL.holding = true;
      const launched = pumpTick(WL);
      if (launched) wlGo();
      return { offered, launched, celebrated: !!WL.celebrated };
    });
    check(reward.offered && reward.launched && reward.celebrated, 'finishing a word offers the hold-to-launch reward');
    const tracked = await page.evaluate(() => {
      setLang('de', document.getElementById('de'));
      showTab('trace');
      document.querySelector('#traceGrid [data-mode="words"]').click();
      writeTrackClear();
      const en = writeCur.en;
      const cv = document.getElementById('c');
      const r = cv.getBoundingClientRect();
      const start = SHAPES[cur].pts[0][0];
      const sx = X(start[0]), sy = Y(start[1]);
      const x = sx < r.width / 2 ? r.right - 6 : r.left + 6;
      const y = sy < r.height / 2 ? r.bottom - 6 : r.top + 6;
      cv.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y, pointerId: 9, buttons: 1 }));
      cv.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: x, clientY: y, pointerId: 9 }));
      document.getElementById('againBtn').click();
      document.getElementById('nextBtn').click();
      const mid = Object.assign({}, WRITE_TRACK['de|' + en] || {});
      writeFresh(false);
      const doneEn = writeCur.en;
      for (let i = 0; i < playlist.length; i++) finishItem();
      const ok = (WRITE_TRACK['de|' + doneEn] || {}).ok || 0;
      const stored = localStorage.getItem('sl_write') || '';
      /* Spanish is his home language and is switched off. English and German stay on.
         A word that is only hard in Spanish must not be chosen; one that is hard in English must. */
      LANGS_ON = ['de', 'en'];
      lang = 'de';
      WRITE_TRACK = {
        'es|cat': { miss: 20, retry: 0, ok: 0 },
        'en|dog': { miss: 6, retry: 0, ok: 0 },
        'de|sun': { miss: 5, retry: 0, ok: 0 },
        'de|house': { miss: 4, retry: 0, ok: 0 },
        'de|ball': { miss: 3, retry: 0, ok: 0 },
        'de|hat': { miss: 1, retry: 0, ok: 0 },
        'de|moon': { miss: 0, retry: 0, ok: 5 }
      };
      const off = { cat: writeWeakScore('cat'), dog: writeWeakScore('dog') };
      const picks = slingChoose().map(w => w.en);
      LANGS_ON = ['es'];
      WRITE_TRACK = { 'es|rose': { miss: 4, retry: 0, ok: 0 }, 'de|rose': { miss: 9, retry: 0, ok: 0 }, 'en|bee': { miss: 8, retry: 0, ok: 0 } };
      const onlyEs = { rose: writeWeakScore('rose'), bee: writeWeakScore('bee'), picks: slingChoose().map(w => w.en) };
      WRITE_TRACK = {};
      const fresh = slingChoose().map(w => w.en);
      LANGS_ON = ['de', 'en', 'es'];
      try { localStorage.setItem('sl_langs', 'de,en,es'); } catch (e) {}
      applyLangs();
      setLang('de', document.getElementById('de'));
      return { w: Math.round(r.width), en, mid, ok, stored: stored.indexOf('de|') >= 0, off, picks, onlyEs, fresh };
    });
    check(tracked.w > 50 && tracked.mid.miss >= 1 && tracked.mid.retry >= 1 && tracked.mid.skip >= 1 && tracked.ok >= 1 && tracked.stored,
      'writing a word records a miss, a retry, a skip and a success on this device ' + JSON.stringify(tracked.mid) + ' ok=' + tracked.ok);
    check(tracked.off.cat === 0 && tracked.off.dog === 6 && tracked.picks.length === 12 && ['dog', 'sun', 'house', 'ball'].every(w => tracked.picks.includes(w)) && new Set(tracked.picks).size === 12,
      'with Spanish switched off, the sling uses German and English trouble only ' + tracked.picks.join(','));
    check(tracked.onlyEs.rose === 4 && tracked.onlyEs.bee === 0 && tracked.onlyEs.picks.includes('rose') && new Set(tracked.fresh).size === 12,
      'a language that is the only one switched on is the only one that chooses pictures');
  }

  console.log('Road');
  {
    const track = await page.evaluate(() => {
      showTab('dig');
      const p0 = power; power = 999; savePower(); showDigLock(); startGame('road'); power = p0; savePower();
      const cv = document.getElementById('trackCv');
      const r = cv.getBoundingClientRect();
      const fire = (type, x, y) => cv.dispatchEvent(new PointerEvent(type, {
        bubbles: true, clientX: r.left + x, clientY: r.top + y, pointerId: 3, buttons: type === 'pointerup' ? 0 : 1
      }));
      fire('pointerdown', r.width * 0.12, r.height * 0.72);
      fire('pointermove', r.width * 0.4, r.height * 0.5);
      fire('pointermove', r.width * 0.78, r.height * 0.28);
      fire('pointerup', r.width * 0.78, r.height * 0.28);
      const riding = TRACK.phase === 'ride' && TRACK.road && TRACK.road.len > 48;
      const veh = document.querySelector('#trackVehs .trackVeh.on');
      if (riding) { TRACK.dur = 0.01; trackFrame(1); }
      TRACK.phase = 'draw'; TRACK.raw = []; TRACK.full = false; TRACK.ptr = 1;
      for (let i = 0; i < 5000; i++) trackPush({ x: (i % 80) * 4, y: 40 + (i % 50) });
      const kept = TRACK.raw.length > 20 && TRACK.raw[0].x < 30 && trackLen(TRACK.raw) <= TRACK_MAX + 1 && TRACK.full;
      const scenes = {};
      ['car', 'steam-train', 'airplane', 'sailboat', 'tractor'].forEach(id => { TRACK.veh = id; scenes[id] = trackMeta().scene; });
      return { w: Math.round(r.width), h: Math.round(r.height), riding, arrived: TRACK.celebrated, veh: veh && veh.dataset.veh, kept, scenes, pane };
    });
    check(track.pane === 'roadPlay' && track.w > 100 && track.h > 100 && track.riding && track.arrived && track.veh === 'car' && track.kept
      && track.scenes.car === 'town' && track.scenes['steam-train'] === 'rails' && track.scenes.airplane === 'sky' && track.scenes.sailboat === 'water' && track.scenes.tractor === 'field',
      'the road is a prize, a long line keeps its start, and the background follows the vehicle ' + JSON.stringify(track));
  }

  {const bad = await page.evaluate(() => JSON.parse(sessionStorage.getItem('ALLSAID') || '[]').filter(t => /\[object|undefined|null/.test(t)));
   check(bad.length === 0, 'the voice never reads out "[object Object]", "undefined" or "null"' + (bad.length ? ': ' + bad.slice(0, 3).join(' | ') : ''));}
  check(errors.length === 0, 'no JavaScript errors' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
  await browser.close();
  console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
  process.exit(failures ? 1 : 0);
})();
