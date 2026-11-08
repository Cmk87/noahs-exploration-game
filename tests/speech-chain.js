/* The word bridge must let every language finish.
   WebKit plus a stand-in for speechSynthesis: each line really lasts past the
   old too-short timer, and iOS's early onend is fired as well. A normal animal
   card may not cancel a line before that line has finished. */
const path = require('path');
const { webkit } = require('playwright');

const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
let failures = 0;
const check = (ok, what) => { console.log((ok ? '  ✓ ' : '  ✗ ') + what); if (!ok) failures++; };

const FAKE = () => {
  const DUR = 1600;
  window.__SPEECH = [];
  let current = null;
  const synth = window.speechSynthesis;
  try {
    Object.defineProperty(synth, 'speaking', { configurable: true, get() { return !!(current && !current.done); } });
    Object.defineProperty(synth, 'pending', { configurable: true, get() { return false; } });
  } catch (e) { window.__SPEECH_LOCK = String(e); }
  synth.getVoices = () => [];
  synth.resume = () => {};
  synth.cancel = () => {
    const now = performance.now();
    if (current && !current.done) {
      const early = now < current.endAt - 30;
      window.__SPEECH.push({ ev: 'cancel', text: current.text, early, at: now });
      current.done = true;
      clearTimeout(current.timer);
      const u = current.u;
      current = null;
      try { if (u.onerror) u.onerror({ error: 'interrupted', utterance: u }); } catch (e) {}
    }
  };
  synth.speak = (u) => {
    const now = performance.now();
    const rec = { text: String(u.text), lang: u.lang || '', u, start: now, endAt: now + DUR, done: false };
    window.__SPEECH.push({ ev: 'speak', text: rec.text, lang: rec.lang, at: now, endAt: rec.endAt });
    current = rec;
    setTimeout(() => { if (!rec.done && u.onstart) u.onstart(); }, 20);
    // iOS sometimes reports the end immediately, while the voice is still talking.
    setTimeout(() => { if (!rec.done && u.onend) u.onend(); }, 40);
    rec.timer = setTimeout(() => {
      if (rec.done) return;
      rec.done = true;
      if (current === rec) current = null;
      try { if (u.onend) u.onend(); } catch (e) {}
    }, DUR);
  };
};

(async () => {
  const browser = await webkit.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(FAKE);
  await page.goto(URL);
  await page.mouse.click(195, 500);
  await page.waitForTimeout(800);

  const runCard = async (label) => page.evaluate(async (label) => {
    window.__SPEECH.length = 0;
    const fox = PHOTO_PACK.animals.find(a => a.id === 'fox');
    const person = PHOTO_PACK.people.find(p => p.id === 'egyptians');
    const truck = PHOTO_PACK.vehicles.find(v => v.id === 'fire-truck');
    const pup = PHOTO_PACK.pairs.find(p => p.id === 'dog');
    let want;
    if (label === 'fox') {
      showTab('king');
      document.querySelector('#v-king [data-id="forest"]').click();
      document.querySelector('#v-king [data-id="fox"]').click();
      want = [fox.names.de.full, fox.facts[0].de];
    } else if (label === 'person') {
      showTab('folk');
      document.querySelector('#v-folk [data-id="' + person.group + '"]').click();
      document.querySelector('#v-folk [data-id="' + person.id + '"]').click();
      want = [person.names.de.full, person.where.de, person.facts[0].de];
    } else if (label === 'truck') {
      showTab('ride');
      document.querySelector('#v-ride [data-id="' + truck.group + '"]').click();
      document.querySelector('#v-ride [data-id="' + truck.id + '"]').click();
      want = [truck.names.de.full, truck.sound.de, truck.facts[0].de];
    } else {
      showTab('baby');
      document.querySelector('#v-baby [data-id="dog"]').click();
      want = [pup.baby.names.de.full, pup.adult.names.de.full, pup.facts[0].de];
    }
    const deadline = performance.now() + 22000;
    while (performance.now() < deadline) {
      const said = window.__SPEECH.filter(e => e.ev === 'speak').map(e => e.text);
      if (want.every(w => said.includes(w))) break;
      await new Promise(r => setTimeout(r, 80));
    }
    const speaks = window.__SPEECH.filter(e => e.ev === 'speak');
    const early = window.__SPEECH.filter(e => e.ev === 'cancel' && e.early && want.includes(e.text)).map(e => e.text);
    const order = want.map(w => speaks.findIndex(s => s.text === w));
    let startedEarly = false;
    for (let i = 1; i < order.length; i++) {
      if (order[i] < 0 || order[i - 1] < 0) { startedEarly = true; break; }
      if (speaks[order[i]].at < speaks[order[i - 1]].endAt - 20) startedEarly = true;
    }
    return { want, said: speaks.map(s => s.text), early, order, startedEarly };
  }, label);

  for (const label of ['fox', 'person', 'truck', 'pup']) {
    const r = await runCard(label);
    const inOrder = r.order.every((n, i) => n >= 0 && (i === 0 || n > r.order[i - 1]));
    check(inOrder && !r.startedEarly && r.early.length === 0,
      label + ': each language plays out before the next line starts'
      + (inOrder && !r.startedEarly && !r.early.length ? '' : ' ' + JSON.stringify({ want: r.want, said: r.said, early: r.early, startedEarly: r.startedEarly })));
  }
  const cut = await page.evaluate(async () => {
    showTab('king');
    document.querySelector('#v-king [data-id="forest"]').click();
    window.__SPEECH.length = 0;
    document.querySelector('#v-king [data-id="fox"]').click();
    await new Promise(r => setTimeout(r, 80));
    document.querySelector('#v-king [data-id="bear"]').click();
    const deadline = performance.now() + 8000;
    const bear = PHOTO_PACK.animals.find(a => a.id === 'bear');
    while (performance.now() < deadline) {
      const said = window.__SPEECH.filter(e => e.ev === 'speak').map(e => e.text);
      if (said.includes(bear.names.de.full)) break;
      await new Promise(r => setTimeout(r, 40));
    }
    const speaks = window.__SPEECH.filter(e => e.ev === 'speak');
    const cancels = window.__SPEECH.filter(e => e.ev === 'cancel');
    const foxFact = PHOTO_PACK.animals.find(a => a.id === 'fox').facts[0].de;
    const factAfterBear = (() => {
      const i = speaks.findIndex(s => s.text === bear.names.de.full);
      return i >= 0 && speaks.slice(i).some(s => s.text === foxFact);
    })();
    return { said: speaks.map(s => s.text), cancelled: cancels.length > 0, factAfterBear, on: document.querySelector('#v-king .phAn.on')?.dataset.id };
  });
  check(cut.cancelled && cut.said.includes('der Bär') && !cut.factAfterBear && cut.on === 'bear',
    'a new animal tap cancels the previous explanation'
    + (cut.cancelled && cut.on === 'bear' && !cut.factAfterBear ? '' : ' ' + JSON.stringify(cut)));
  check(errors.length === 0, 'no JavaScript errors' + (errors.length ? ': ' + errors[0] : ''));
  await browser.close();
  console.log(failures ? `\n${failures} check(s) failed` : '\nSpeech chain passed');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
