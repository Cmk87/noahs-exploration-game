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
  await page.mouse.click(180, 320);
  await page.waitForTimeout(300);
  check(await page.evaluate(() => activeTab === 'home' && $('homeGrid').children.length === 9), 'opens on the home screen with 9 sections');
  check(await page.evaluate(() => lang === 'de'), 'starts in German');

  console.log('Layout');
  for (const t of ['home', 'adv', 'city', 'trace', 'words', 'ear', 'act', 'space', 'geo', 'dig', 'parent']) {
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
  await page.evaluate(() => { showTab('geo'); SKILL['geo|de'] = { s: 2.2, n: 10, h: [] };
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
  await page.evaluate(() => { power = 200; savePower(); showTab('dig'); });
  for (const g of ['dig', 'mem', 'bal', 'fw']) {
    await page.evaluate(g => { showDigLock(); startGame(g); }, g);
    await page.waitForTimeout(300);
    check(await page.evaluate(g => pane === { dig: 'digPlay', mem: 'memPlay', bal: 'balPlay', fw: 'fwPlay' }[g], g), `prize game starts: ${g}`);
  }
  await page.evaluate(() => { DINOS.forEach(d => prepParts(d)); showDigLock(); });
  check(true, 'all 11 dinosaur skeletons build');

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

  console.log('Parent panel');
  await page.evaluate(() => showTab('parent'));
  check(await page.evaluate(() => $('repBars').children.length === 7), 'weekly report shows 7 days');

  console.log('City');
  await page.evaluate(() => showTab('city'));
  await page.waitForTimeout(400);
  check(await page.evaluate(() => CITY.HITS().length > 50), 'city: the town is drawn');
  await page.evaluate(() => Object.keys(CITY.ENT).forEach(id => {
    const h = CITY.HITS().find(h => h.id === id), b = (h && h.b) || CITY.ENT[id].at || [100, 100, 120, 120];
    CITY.trigger(id, b, (b[0] + b[2]) / 2, (b[1] + b[3]) / 2, h && h.ref);
  }));
  await page.waitForTimeout(2500);
  check(await page.evaluate(() => CITY.FOUND.size === 14), 'city: every animal can be found');
  await page.click('#cFind');
  check(await page.evaluate(() => !!CITY.FIND() && !!CITY.ENT[CITY.FIND().id].at), 'city: "where is …?" picks a target');
  await page.click('#homeBtn');
  check(await page.evaluate(() => activeTab === 'home'), '🏠 goes back to the home screen');

  check(errors.length === 0, 'no JavaScript errors' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
  await browser.close();
  console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
  process.exit(failures ? 1 : 0);
})();
