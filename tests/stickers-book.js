/* Sticker book matches town discoveries, and nothing else.
   A stray saved id must not look like a find or finish the book.
   A photo-book stamp and a dug dinosaur must not fill the other collection. */
const path = require('path');
const { chromium } = require('playwright');
const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
let failures = 0;
const check = (ok, what) => { console.log((ok ? '  ✓ ' : '  ✗ ') + what); if (!ok) failures++; };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(URL);
  await page.mouse.click(200, 320);
  await page.waitForTimeout(400);

  const map = await page.evaluate(() => {
    const town = CITY.animals();
    const slots = STK_AREAS.flatMap(A => A[4]);
    const setT = new Set(town), setS = new Set(slots);
    return {
      same: town.length === slots.length && town.every(id => setS.has(id)) && slots.every(id => setT.has(id)),
      dup: slots.filter((id, i) => slots.indexOf(id) !== i)
    };
  });
  check(map.same && map.dup.length === 0, 'every town animal has one sticker slot, and every slot is that animal');

  const partial = await page.evaluate(() => {
    gateEat = 0;
    CITY.FOUND.clear();
    CITY.FOUND.add('cat');
    CITY.FOUND.add('not-a-real-animal');
    const saved = JSON.parse(localStorage.getItem('sl_city') || '{"found":[]}');
    saved.found = [...CITY.FOUND];
    localStorage.setItem('sl_city', JSON.stringify(saved));
    showStickers();
    const got = [...document.querySelectorAll('#stkBook .stk.got')].map(b => b.querySelector('.stkName').textContent);
    const cat = [...document.querySelectorAll('#stkBook .stk')].find(b => (b.querySelector('.stkName').textContent || '').includes('Katze'));
    const duck = [...document.querySelectorAll('#stkBook .stk')].find(b => b.querySelector('.stkPic').textContent === '🦆');
    const head = document.getElementById('stkHead').textContent;
    const sums = [...document.querySelectorAll('#stkBook .stkCount')].map(el => el.textContent);
    const lit = sums.reduce((n, t) => n + Number((t.match(/(\d+)\//) || [])[1] || 0), 0);
    const complete = !!document.getElementById('stkAgain');
    return {
      got, catGot: !!(cat && cat.classList.contains('got')), duckMiss: !!(duck && cat !== duck && duck.classList.contains('miss') && !duck.classList.contains('got')),
      head, lit, buttons: document.querySelectorAll('#stkBook .stk').length, complete,
      paws: document.getElementById('cPaws').textContent, stored: JSON.parse(localStorage.getItem('sl_city')).found
    };
  });
  check(partial.catGot && partial.got.length === 1, 'the cat that was found is the only lit town sticker' + (partial.catGot ? '' : ' ' + JSON.stringify(partial.got)));
  check(partial.duckMiss, 'the duck that was not found stays a silhouette');
  check(partial.lit === 1 && partial.buttons === partial.stored.filter(id => id !== 'not-a-real-animal').length + (partial.buttons - 1) && !partial.complete, 'a stray saved id does not add a sticker or finish the book');
  check(partial.head.includes('1 von 69'), 'the book title counts the cat, not the stray id (' + partial.head + ')');
  check(partial.stored.includes('cat') && partial.stored.includes('not-a-real-animal'), 'the save still keeps the cat and the unknown id');

  await page.reload();
  await page.mouse.click(200, 320);
  await page.waitForTimeout(400);
  const again = await page.evaluate(() => {
    gateEat = 0;
    showStickers();
    const cat = [...document.querySelectorAll('#stkBook .stk.got')].map(b => b.querySelector('.stkName').textContent);
    const duck = [...document.querySelectorAll('#stkBook .stk.miss')].some(b => b.querySelector('.stkPic').textContent === '🦆');
    const stored = JSON.parse(localStorage.getItem('sl_city')).found;
    return { cat, duck, stored, head: document.getElementById('stkHead').textContent };
  });
  check(again.cat.length === 1 && again.cat[0].includes('Katze') && again.duck && again.stored.includes('not-a-real-animal'), 'after reload the cat is still earned, the duck is not, and the old id is still saved');

  const separate = await page.evaluate(() => {
    gateEat = 0;
    if (typeof photoStamp === 'function') photoStamp('a', 'horse');
    const horseBefore = CITY.FOUND.has('horse');
    showStickers();
    const horse = [...document.querySelectorAll('#stkBook .stk')].find(b => (b.querySelector('.stkName').textContent || '').includes('Pferd') || b.querySelector('.stkPic').textContent === '🐴');
    const horseMiss = horse && horse.classList.contains('miss');
    CITY.FOUND.add('trex');
    showStickers();
    const townTrex = [...document.querySelectorAll('#stkBook .stk.got')].some(b => (b.querySelector('.stkName').textContent || '').includes('T-Rex') || (b.querySelector('.stkName').textContent || '').includes('T. rex'));
    const museumTrex = [...document.querySelectorAll('#stkBook .stkDino.got')].length;
    const dig = found.slice();
    found.push('raptor');
    showStickers();
    const museumRaptor = [...document.querySelectorAll('#stkBook .stkDino.got')].some(b => /Velociraptor/.test(b.textContent));
    const townRaptor = [...document.querySelectorAll('#stkBook .stk.got')].some(b => /Velociraptor|Raptor/.test(b.querySelector('.stkName').textContent || ''));
    return { horseBefore, horseMiss, townTrex, museumTrex, museumRaptor, townRaptor, dig };
  });
  check(separate.horseMiss && !separate.horseBefore, 'a photo-book horse stamp does not fill the town horse sticker');
  check(separate.townTrex && separate.museumTrex === 0, 'finding the town T. rex does not open its museum picture');
  check(separate.museumRaptor && !separate.townRaptor, 'digging a Velociraptor does not light a town sticker');
  check(errors.length === 0, 'no JavaScript errors' + (errors[0] ? ': ' + errors[0] : ''));

  await browser.close();
  console.log(failures ? `\n${failures} check(s) failed` : '\nSticker book passed');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
