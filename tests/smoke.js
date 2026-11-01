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
  check(await page.evaluate(() => activeTab === 'home' && $('homeGrid').children.length === 12), 'opens on the home screen with 12 sections');
  check(await page.evaluate(() => lang === 'de'), 'starts in German');

  console.log('Layout');
  for (const t of ['home', 'adv', 'city', 'stickers', 'trace', 'words', 'ear', 'act', 'space', 'geo', 'dig', 'parent']) {
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

  console.log('Points and prizes');
  await page.waitForTimeout(1500);                       // let earlier bonus points land first
  const p0 = await page.evaluate(() => power);
  await page.evaluate(() => { showTab('words'); SKILL['words|de'] = { s: 1.2, n: 10, h: [] }; fireStreak = 0; newRound(); for (let i = 0; i < 3; i++) [...document.querySelectorAll('#grid .card')].find(c => !targets.some(t => t.e === c.textContent))?.click(); });
  await answerWords();
  await page.waitForTimeout(900);
  check(await page.evaluate(p0 => power === p0, p0), 'guessing (3 misses) earns no points');
  await page.evaluate(() => { power = 400; savePower(); showTab('dig'); });
  for (const g of ['dig', 'mem', 'bal', 'fw', 'bag', 'aq', 'fed', 'cake']) {
    await page.evaluate(g => { showDigLock(); startGame(g); }, g);
    await page.waitForTimeout(300);
    check(await page.evaluate(g => pane === { dig: 'digPlay', mem: 'memPlay', bal: 'balPlay', fw: 'fwPlay', bag: 'bagPlay', aq: 'aqPlay', fed: 'fedPlay', cake: 'cakePlay' }[g], g), `prize game starts: ${g}`);
  }
  await page.evaluate(() => { power = 160; savePower(); showDigLock(); startGame('fed');
    [...document.querySelectorAll('#fedAnimals .fedAn')].find((b, i) => FED.opts[i] !== FED.want).click(); });
  check(await page.evaluate(() => FED && FED.n === 0), 'feeding the wrong animal does not end the round');
  await page.evaluate(() => [...document.querySelectorAll('#fedAnimals .fedAn')].find((b, i) => FED.opts[i] === FED.want).click());
  check(await page.evaluate(() => FED && FED.n === 1), 'feeding the animal he heard counts');
  await page.evaluate(() => { showDigLock(); startGame('cake'); document.querySelector('#cakeTray .cakeBit').click(); });
  check(await page.evaluate(() => CAKE && CAKE.n === 1 && $('cakePile').children.length === 1), 'a cake topping lands on the cake');
  await page.evaluate(() => { showDigLock(); startGame('aq'); });
  await page.waitForTimeout(500);
  check(await page.evaluate(() => pane === 'aqPlay' && AQ && AQ.fish.length > 0), 'aquarium fish swim in');
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
  check(await page.evaluate(() => [...document.querySelectorAll('#stkBook .stkDino.got')].some(b => /Tyrannosaurus|Tiranosaurio/i.test(b.textContent))), 'a dinosaur saved earlier still shows as found');
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
  const bridgeOf = () => page.evaluate(() => {
    const e = CITY.ENT.cat, L = { de: 0, en: 1, es: 2 };
    const order = bridgeOrder();
    const btn = [...document.querySelectorAll('#stkBook .stk.got')].find(b => b.textContent.includes(e.n[L[lang]]));
    window.BRIDGE_LOG = [];
    btn.click();
    return order.map(c => ({ lang: { es: 'es-ES', en: 'en-US', de: 'de-DE' }[c], bit: e.n[L[c]] }));
  });
  await page.waitForTimeout(700);
  let expect = await bridgeOf();
  await page.waitForFunction(n => window.BRIDGE_LOG.length >= n, expect.length, { timeout: 8000 });
  check(await page.evaluate(exp => {
    const got = window.BRIDGE_LOG.slice(0, exp.length);
    const tag = document.getElementById('bridgeTag');
    return got.length === exp.length && got.every((g, i) => g.lang === exp[i].lang && g.text.includes(exp[i].bit) && (!g.voice || g.voice.toLowerCase().startsWith(exp[i].lang.slice(0, 2))))
      && tag && tag.classList.contains('on') && /🇪🇸|🇬🇧|🇩🇪/.test(tag.textContent);
  }, expect), 'tapping a collected sticker says the word in each bridge language, current one first');
  check(await page.evaluate(() => BRIDGE.includes('de') && $('de').style.display === 'none'), 'the word bridge can include a language that is switched off for learning');
  await page.evaluate(() => { showTab('parent'); document.querySelector('#bridgeBtns button[data-l="en"]').click(); });
  check(await page.evaluate(() => !BRIDGE.includes('en') && localStorage.getItem('sl_bridge').split(',').indexOf('en') < 0), 'a parent can turn one bridge language off');
  await page.evaluate(() => showTab('stickers'));
  await page.waitForTimeout(700);
  expect = await bridgeOf();
  await page.waitForFunction(n => window.BRIDGE_LOG.length >= n, expect.length, { timeout: 8000 });
  await page.waitForTimeout(1500);
  check(await page.evaluate(exp => window.BRIDGE_LOG.length === exp.length && window.BRIDGE_LOG.every((g, i) => g.lang === exp[i].lang) && !window.BRIDGE_LOG.some(g => g.lang === 'en-US'), expect), 'with English off the bridge, the sticker no longer says the English word');
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
  await page.evaluate(() => document.getElementById('gearBtn').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true })));
  await page.waitForTimeout(1200);
  const sum = await page.evaluate(() => { const q = document.querySelector('#grown.on .grownQ'); return q ? q.textContent : ''; });
  const parts = sum.match(/(\d+)\s*×\s*(\d+)/);
  check(!!parts, 'holding the gear asks a grown-up sum before parent settings');
  await page.evaluate(() => { const b = [...document.querySelectorAll('#grown .grownKeys button')].find(x => x.textContent === '1'); b.click();
    [...document.querySelectorAll('#grown .grownKeys button')].find(x => x.textContent === '✓').click(); });
  check(await page.evaluate(() => !!document.querySelector('#grown.on') && activeTab !== 'parent'), 'a wrong sum does not open parent settings');
  if (parts) {
    const digits = String(Number(parts[1]) * Number(parts[2]));
    for (const d of digits) await page.evaluate(d => [...document.querySelectorAll('#grown .grownKeys button')].find(x => x.textContent === d).click(), d);
    await page.evaluate(() => [...document.querySelectorAll('#grown .grownKeys button')].find(x => x.textContent === '✓').click());
  }
  check(await page.evaluate(() => activeTab === 'parent' && !document.querySelector('#grown.on')), 'the right sum opens parent settings');

  // collecting again: a full sticker book starts round 2 from zero; a full museum starts a new round at the next dig
  {const r = await page.evaluate(() => { const keep = [...CITY.FOUND]; CITY.animals().forEach(id => CITY.FOUND.add(id)); showTab('stickers');
     const full = !!document.getElementById('stkAgain'); document.getElementById('stkAgain').click();
     const ok = full && CITY.FOUND.size === 0 && CITY.round() >= 2; keep.forEach(id => CITY.FOUND.add(id));
     found = DINOS.map(d => d.k); power = 99; savePower(); showTab('dig'); showDigLock(); startGame('dig');
     const dig = found.length === 0 && dinoRound >= 2; showDigLock(); showTab('home'); return ok && dig; });
   check(r, 'a full sticker book and a full dino museum both start a new round from zero');}
  {const bad = await page.evaluate(() => JSON.parse(sessionStorage.getItem('ALLSAID') || '[]').filter(t => /\[object|undefined|null/.test(t)));
   check(bad.length === 0, 'the voice never reads out "[object Object]", "undefined" or "null"' + (bad.length ? ': ' + bad.slice(0, 3).join(' | ') : ''));}
  check(errors.length === 0, 'no JavaScript errors' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
  await browser.close();
  console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
  process.exit(failures ? 1 : 0);
})();
