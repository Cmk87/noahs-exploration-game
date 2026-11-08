/* Body groups open one zoomable diagram. A hotspot stays on its part
   when the picture grows, a tap speaks, and a drag does not. */
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
  const r = await page.evaluate(async () => {
    gateEat = 0;
    speechReady = true;
    if (lang !== 'de') document.getElementById('de').click();
    window.PHOTO_SAID = [];
    const prev = utter;
    utter = function () { PHOTO_SAID.push(String(arguments[0])); return prev.apply(null, arguments); };
    const want = { bones: 10, muscles: 9, heart: 2, lungs: 2, brain: 3, tummy: 5, senses: 4, skin: 3, touch: 6 };
    const counts = {};
    const crowded = [];
    const idsOk = Object.keys(BODY_DIAGRAMS).every(g => {
      const items = (PHOTO_PACK.body || []).filter(b => b.group === g);
      const hero = items.find(b => b.overview) || items[0];
      const spots = BODY_DIAGRAMS[g].spots;
      const ids = spots.map(s => s.id);
      counts[g] = new Set(ids).size;
      if (new Set(ids).size !== ids.length) crowded.push(g + ' duplicate');
      for (let i = 0; i < spots.length; i++) for (let j = i + 1; j < spots.length; j++) {
        const d = Math.hypot(spots[i].x - spots[j].x, spots[i].y - spots[j].y);
        if (d < 7) crowded.push(g + ' ' + spots[i].id + '/' + spots[j].id + ' ' + d.toFixed(1));
      }
      const mapped = spots.every(s => {
        const b = items.find(x => x.id === s.id);
        if (!b || !(b.facts || []).length) return false;
        return ['en', 'es', 'de'].every(L => {
          const n = (b.part || b.names)[L];
          return n && n.full && b.names[L] && b.names[L].full && b.facts.every(f => f[L] && f[L].length > 12);
        });
      });
      return BODY_DIAGRAMS[g].image === hero.image && mapped && counts[g] === want[g];
    });
    const oldQuiz = (PHOTO_PACK.body || []).filter(b => !b.diagram);
    PH.kind = 'y';
    const pool = findPool();
    const quizOk = pool.length === oldQuiz.length && pool.every(x => !x.diagram) && pool.some(x => x.id === 'skull') && pool.some(x => x.id === 'biceps');
    showTab('body');
    document.querySelector('#v-body .phHab[data-id="bones"]').click();
    await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
    const rel = id => {
      const s = document.getElementById('phMap').getBoundingClientRect();
      const h = document.querySelector('#v-body .phHot[data-id="' + id + '"]').getBoundingClientRect();
      return { x: (h.left + h.width / 2 - s.left) / s.width, y: (h.top + h.height / 2 - s.top) / s.height, sw: s.width, sh: s.height };
    };
    /* The image-rectangle check catches a circle that has slipped off the
       picture. It does not prove the circle sits on the right bone or muscle. */
    const onImage = () => {
      const img = document.querySelector('#v-body .phMap img').getBoundingClientRect();
      return BODY_DIAGRAMS.bones.spots.every(s => {
        const h = document.querySelector('#v-body .phHot[data-id="' + s.id + '"]').getBoundingClientRect();
        const x = (h.left + h.width / 2 - img.left) / img.width * 100;
        const y = (h.top + h.height / 2 - img.top) / img.height * 100;
        return Math.abs(x - s.x) < 1.5 && Math.abs(y - s.y) < 1.5;
      });
    };
    const sticksFit = onImage();
    const sticksEvery = {};
    for (const g of Object.keys(BODY_DIAGRAMS)) {
      showTab('body');
      document.querySelector('#v-body .phHab[data-id="' + g + '"]').click();
      await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
      const img = document.querySelector('#v-body .phMap img').getBoundingClientRect();
      sticksEvery[g] = BODY_DIAGRAMS[g].spots.every(s => {
        const h = document.querySelector('#v-body .phHot[data-id="' + s.id + '"]').getBoundingClientRect();
        const x = (h.left + h.width / 2 - img.left) / img.width * 100;
        const y = (h.top + h.height / 2 - img.top) / img.height * 100;
        return Math.abs(x - s.x) < 1.5 && Math.abs(y - s.y) < 1.5;
      });
    }
    showTab('body');
    document.querySelector('#v-body .phHab[data-id="bones"]').click();
    await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
    const before = rel('skull');
    bodyZoom(2);
    const after = rel('skull');
    const boxes = () => [...document.querySelectorAll('#v-body .phHot')].map(h => h.getBoundingClientRect());
    const pile = list => {
      let n = 0;
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j];
        const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (w > 2 && h > 2) n++;
      }
      return n;
    };
    const clearFit = pile(boxes()) === 0;
    const aligned = Math.abs(before.x - after.x) < 0.03 && Math.abs(before.y - after.y) < 0.03 && after.sw > before.sw;
    const clearZoom = pile(boxes()) === 0;
    const sticksZoom = onImage();
    const said0 = PHOTO_SAID.length;
    const box = document.getElementById('phZoom');
    box.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 1, clientX: 120, clientY: 200, bubbles: true }));
    box.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, clientX: 180, clientY: 280, bubbles: true }));
    box.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, clientX: 180, clientY: 280, bubbles: true }));
    const quiet = PHOTO_SAID.length === said0;
    document.querySelector('#v-body .phHot[data-id="skull"]').click();
    await new Promise(res => setTimeout(res, 40));
    const dragClickSilent = PHOTO_SAID.length === said0;
    PHOTO_SAID.length = 0;
    document.querySelector('#v-body .phHot[data-id="skull"]').click();
    await new Promise(res => setTimeout(res, 40));
    const skull = PHOTO_PACK.body.find(x => x.id === 'skull');
    const waitLine = async (line) => {
      for (let i = 0; i < 50; i++) { if (PHOTO_SAID.includes(line)) return true; await new Promise(res => setTimeout(res, 80)); }
      return false;
    };
    const said = await waitLine(skull.names.de.full) && await waitLine(skull.facts[0].de);
    PHOTO_SAID.length = 0;
    document.querySelector('#v-body .phHot[data-id="skull"]').click();
    const saidNext = await waitLine(skull.names.de.full) && await waitLine(skull.facts[1].de) && !PHOTO_SAID.includes(skull.facts[0].de);
    const en = document.querySelector('#v-body .phLang[data-l="en"]');
    PHOTO_SAID.length = 0;
    if (en) en.click();
    const saidEn = await waitLine(skull.names.en.full);
    const zoomed = rel('skull');
    document.querySelector('#v-body [data-act="zin"]').click();
    const zoomBtn = rel('skull');
    const btnAligned = Math.abs(zoomed.x - zoomBtn.x) < 0.03 && Math.abs(zoomed.y - zoomBtn.y) < 0.03 && zoomBtn.sw > zoomed.sw;
    showTab('body');
    document.querySelector('#v-body .phHab[data-id="muscles"]').click();
    await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
    PHOTO_SAID.length = 0;
    document.querySelector('#v-body .phHot[data-id="biceps"]').click();
    await new Promise(res => setTimeout(res, 40));
    const muscle = PHOTO_PACK.body.find(x => x.id === 'biceps');
    const saidMuscle = PHOTO_SAID.includes(muscle.names.de.full);
    const tap = document.querySelector('#v-body .phHot[data-id="biceps"]');
    const box2 = tap.getBoundingClientRect();
    PHOTO_SAID.length = 0;
    tap.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 7, clientX: box2.left + 8, clientY: box2.top + 8, bubbles: true, button: 0 }));
    tap.dispatchEvent(new PointerEvent('pointerup', { pointerId: 7, clientX: box2.left + 8, clientY: box2.top + 8, bubbles: true, button: 0 }));
    tap.click();
    await new Promise(res => setTimeout(res, 40));
    const once = PHOTO_SAID.filter(t => t === muscle.names.de.full).length === 1;
    const saidBeforePinch = PHOTO_SAID.length;
    const zoom = document.getElementById('phZoom');
    zoom.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 3, clientX: 80, clientY: 180, bubbles: true, button: 0 }));
    zoom.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 4, clientX: 180, clientY: 180, bubbles: true, button: 0 }));
    zoom.dispatchEvent(new PointerEvent('pointermove', { pointerId: 4, clientX: 260, clientY: 260, bubbles: true, button: 0 }));
    zoom.dispatchEvent(new PointerEvent('pointerup', { pointerId: 3, clientX: 80, clientY: 180, bubbles: true, button: 0 }));
    zoom.dispatchEvent(new PointerEvent('pointerup', { pointerId: 4, clientX: 260, clientY: 260, bubbles: true, button: 0 }));
    await new Promise(res => setTimeout(res, 40));
    const pinchQuiet = PHOTO_SAID.length === saidBeforePinch;
    showTab('body');
    document.querySelector('#v-body .phHab[data-id="bones"]').click();
    await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
    const pan = document.getElementById('phZoom');
    pan.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 9, clientX: 40, clientY: 40, bubbles: true, button: 0 }));
    pan.dispatchEvent(new PointerEvent('pointermove', { pointerId: 9, clientX: 140, clientY: 160, bubbles: true, button: 0 }));
    pan.dispatchEvent(new PointerEvent('pointerup', { pointerId: 9, clientX: 140, clientY: 160, bubbles: true, button: 0 }));
    await new Promise(res => setTimeout(res, 120));
    PHOTO_SAID.length = 0;
    document.querySelector('#v-body .phHot[data-id="skull"]').click();
    await new Promise(res => setTimeout(res, 40));
    const afterDrag = PHOTO_SAID.includes(skull.names.de.full);
    const pic = document.querySelector('#v-body .phMap img');
    const onePicture = !!(pic && pic.getAttribute('src') === 'body/skeleton.webp' && !document.querySelector('#v-body .phGrid') && !document.querySelector('#v-body svg'));
    const groups = document.querySelectorAll('#v-body .phHab').length;
    return { idsOk, quizOk, counts, crowded, clearFit, clearZoom, sticksFit, sticksZoom, sticksEvery, aligned, before, after, quiet, dragClickSilent, said, saidNext, saidEn, btnAligned, saidMuscle, once, pinchQuiet, afterDrag, onePicture, groups };
  });
  check(r.idsOk && r.quizOk && !r.crowded.length, 'each picture has its own visible parts, named in es, en and de, and the old quiz still skips the new dots' + (r.idsOk && r.quizOk && !r.crowded.length ? '' : ' ' + JSON.stringify({ counts: r.counts, crowded: r.crowded, quiz: r.quizOk })));
  const every = r.sticksEvery && Object.keys(r.sticksEvery).every(g => r.sticksEvery[g]);
  check(r.clearFit && r.clearZoom && r.sticksFit && r.sticksZoom && every, 'circles stay on their picture coordinates when fitted or zoomed, and do not cover each other' + (every ? '' : ' ' + JSON.stringify(r.sticksEvery)));
  check(r.onePicture && r.aligned, 'the skull stays on the same part of the picture when it is zoomed' + (r.aligned ? '' : ' ' + JSON.stringify(r)));
  check(r.quiet && r.dragClickSilent, 'dragging the picture does not start the voice');
  check(r.said && r.saidNext && r.saidEn, 'tapping the skull says its name, then the other fact, and a flag says it in English');
  check(r.saidMuscle && r.once && r.pinchQuiet, 'a muscle tap speaks once, and a pinch does not');
  check(r.btnAligned && r.afterDrag && r.groups === 0, 'zoom stays on the skull, and a later tap still speaks after a drag');
  check(errors.length === 0, 'no JavaScript errors' + (errors[0] ? ': ' + errors[0] : ''));
  await browser.close();
  console.log(failures ? `\n${failures} check(s) failed` : '\nBody diagrams passed');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
