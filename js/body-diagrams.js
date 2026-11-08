/* One zoomable diagram per body group. Hotspots are percentages of the
   picture, so they stay on the part when the picture is scaled or moved.
   Major parts only — the same ids the body book already speaks. */
const BODY_VB = { w: 600, h: 1120 };
function bodyPct(x, y, w, h) {
  return {
    x: +(x / BODY_VB.w * 100).toFixed(2),
    y: +(y / BODY_VB.h * 100).toFixed(2),
    w: +(w / BODY_VB.w * 100).toFixed(2),
    h: +(h / BODY_VB.h * 100).toFixed(2)
  };
}
function bodySpot(id, x, y, w, h) {
  return Object.assign({ id: id }, bodyPct(x, y, w, h));
}
function bodySvg(inner) {
  return `<svg viewBox="0 0 ${BODY_VB.w} ${BODY_VB.h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="600" height="1120" fill="#E5F3FC"/>
    <ellipse cx="300" cy="1048" rx="168" ry="22" fill="#D3E3F0"/>
    ${inner}
  </svg>`;
}

/* A whole child, front view, with no clothes details and no gore.
   The same outline sits behind every system so the picture stays one body. */
const BODY_PERSON = `
  <g fill="#F6C9A8" stroke="#E2B092" stroke-width="3" stroke-linejoin="round">
    <path d="M214 292 Q150 330 124 430 Q108 500 136 575" fill="none" stroke="#F6C9A8" stroke-width="48" stroke-linecap="round"/>
    <path d="M386 292 Q450 330 476 430 Q492 500 464 575" fill="none" stroke="#F6C9A8" stroke-width="48" stroke-linecap="round"/>
    <path d="M248 590 Q228 740 232 900" fill="none" stroke="#F6C9A8" stroke-width="58" stroke-linecap="round"/>
    <path d="M352 590 Q372 740 368 900" fill="none" stroke="#F6C9A8" stroke-width="58" stroke-linecap="round"/>
    <path d="M206 250 C206 430 188 520 214 590 L386 590 C412 520 394 430 394 250 Q300 228 206 250 Z"/>
    <ellipse cx="132" cy="592" rx="30" ry="34"/>
    <ellipse cx="468" cy="592" rx="30" ry="34"/>
    <ellipse cx="214" cy="948" rx="42" ry="20"/>
    <ellipse cx="386" cy="948" rx="42" ry="20"/>
    <rect x="268" y="236" width="64" height="46" rx="22"/>
    <ellipse cx="300" cy="156" rx="100" ry="116"/>
  </g>
  <path d="M214 92 Q250 36 300 32 Q352 36 388 96 Q360 78 300 74 Q242 78 214 92" fill="#6B4423"/>
  <path d="M210 118 Q196 150 208 190" fill="none" stroke="#6B4423" stroke-width="16" stroke-linecap="round"/>
  <path d="M390 118 Q404 150 392 190" fill="none" stroke="#6B4423" stroke-width="16" stroke-linecap="round"/>
  <ellipse cx="262" cy="150" rx="14" ry="16" fill="#fff"/>
  <ellipse cx="338" cy="150" rx="14" ry="16" fill="#fff"/>
  <circle cx="266" cy="152" r="6" fill="#3A4668"/>
  <circle cx="334" cy="152" r="6" fill="#3A4668"/>
  <path d="M300 166 Q294 188 300 196 Q306 188 300 166" fill="#E7A090"/>
  <path d="M274 214 Q300 232 326 214" fill="none" stroke="#C47A62" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="198" cy="168" rx="16" ry="24" fill="#F3C0A0" stroke="#E2B092"/>
  <ellipse cx="402" cy="168" rx="16" ry="24" fill="#F3C0A0" stroke="#E2B092"/>
  <circle cx="300" cy="470" r="7" fill="#E2B092"/>
`;

const BODY_SKELETON = `
  <g fill="#F7F3E6" stroke="#8D7348" stroke-width="3" stroke-linejoin="round">
    <ellipse cx="300" cy="150" rx="78" ry="90"/>
    <path d="M250 168 Q300 196 350 168 Q346 214 300 214 Q254 214 250 168" fill="#EFE8D4"/>
    <ellipse cx="274" cy="142" rx="16" ry="18" fill="#3A4668" stroke="none"/>
    <ellipse cx="326" cy="142" rx="16" ry="18" fill="#3A4668" stroke="none"/>
    <path d="M300 158 L292 184 L308 184 Z" fill="#C9B48A" stroke="none"/>
    <path d="M268 206 H332" stroke="#8D7348" stroke-width="4"/>
    <path d="M276 206 V216 M288 206 V218 M300 206 V218 M312 206 V218 M324 206 V216" stroke="#fff" stroke-width="3"/>
    <path d="M262 292 Q300 276 338 292" fill="none" stroke="#E7D7B0" stroke-width="10" stroke-linecap="round"/>
    <g fill="#F7F3E6">
      <ellipse cx="300" cy="268" rx="11" ry="8"/>
      <ellipse cx="300" cy="292" rx="12" ry="8"/>
      <ellipse cx="300" cy="318" rx="13" ry="9"/>
      <ellipse cx="300" cy="346" rx="13" ry="9"/>
      <ellipse cx="300" cy="374" rx="13" ry="9"/>
      <ellipse cx="300" cy="402" rx="13" ry="9"/>
      <ellipse cx="300" cy="430" rx="13" ry="9"/>
      <ellipse cx="300" cy="458" rx="12" ry="8"/>
      <ellipse cx="300" cy="484" rx="12" ry="8"/>
      <ellipse cx="300" cy="510" rx="12" ry="8"/>
    </g>
    <path d="M300 300 Q232 318 214 360 Q232 392 300 400" fill="none"/>
    <path d="M300 300 Q368 318 386 360 Q368 392 300 400" fill="none"/>
    <path d="M300 318 Q226 334 210 372 Q230 400 300 408" fill="none"/>
    <path d="M300 318 Q374 334 390 372 Q370 400 300 408" fill="none"/>
    <path d="M300 336 Q230 348 216 380 Q234 404 300 412" fill="none"/>
    <path d="M300 336 Q370 348 384 380 Q366 404 300 412" fill="none"/>
    <path d="M248 430 Q214 470 230 530 Q268 548 300 536 Q332 548 370 530 Q386 470 352 430 Q300 454 248 430"/>
    <path d="M214 300 Q150 330 132 410" fill="none" stroke-width="12" stroke-linecap="round"/>
    <path d="M386 300 Q450 330 468 410" fill="none" stroke-width="12" stroke-linecap="round"/>
    <path d="M132 410 Q118 470 140 530" fill="none" stroke-width="10" stroke-linecap="round"/>
    <path d="M468 410 Q482 470 460 530" fill="none" stroke-width="10" stroke-linecap="round"/>
    <path d="M236 548 Q228 680 232 760" fill="none" stroke-width="16" stroke-linecap="round"/>
    <path d="M364 548 Q372 680 368 760" fill="none" stroke-width="16" stroke-linecap="round"/>
    <circle cx="232" cy="548" r="16" fill="#F7F3E6"/>
    <circle cx="368" cy="548" r="16" fill="#F7F3E6"/>
    <circle cx="232" cy="768" r="15" fill="#F7F3E6"/>
    <circle cx="368" cy="768" r="15" fill="#F7F3E6"/>
    <path d="M232 768 Q220 860 226 930" fill="none" stroke-width="12" stroke-linecap="round"/>
    <path d="M368 768 Q380 860 374 930" fill="none" stroke-width="12" stroke-linecap="round"/>
  </g>
`;

const BODY_DIAGRAMS = {
  bones: {
    svg: bodySvg(`<g opacity=".35">${BODY_PERSON}</g>${BODY_SKELETON}`),
    spots: [
      bodySpot('spine', 262, 236, 76, 300),
      bodySpot('femur', 196, 530, 80, 250),
      bodySpot('femur', 324, 530, 80, 250),
      bodySpot('ribs', 196, 286, 208, 150),
      bodySpot('skull', 214, 52, 172, 196)
    ]
  },
  muscles: {
    svg: bodySvg(BODY_PERSON + `
      <g fill="#E07A78" opacity=".92">
        <path d="M250 196 Q300 214 350 196 Q336 228 300 234 Q264 228 250 196"/>
        <path d="M168 318 Q132 348 124 410 Q156 392 176 350 Z"/>
        <path d="M432 318 Q468 348 476 410 Q444 392 424 350 Z"/>
        <path d="M248 390 H352 V430 H248 Z M256 438 H344 V476 H256 Z M264 484 H336 V520 H264 Z"/>
        <path d="M214 800 Q196 860 206 930 Q232 910 236 840 Z"/>
        <path d="M386 800 Q404 860 394 930 Q368 910 364 840 Z"/>
      </g>
      <path d="M274 214 Q300 232 326 214" fill="none" stroke="#A84848" stroke-width="4" stroke-linecap="round"/>
    `),
    spots: [
      bodySpot('tummy-muscles', 236, 376, 128, 156),
      bodySpot('biceps', 108, 300, 84, 130),
      bodySpot('biceps', 408, 300, 84, 130),
      bodySpot('calf', 186, 790, 62, 160),
      bodySpot('calf', 352, 790, 62, 160),
      bodySpot('smile', 244, 184, 112, 56)
    ]
  },
  heart: {
    svg: bodySvg(`<g opacity=".45">${BODY_PERSON}</g>
      <path d="M300 250 V430" fill="none" stroke="#E07A78" stroke-width="14" stroke-linecap="round"/>
      <path d="M300 340 H430 M300 360 H168" fill="none" stroke="#E07A78" stroke-width="12" stroke-linecap="round"/>
      <path d="M300 390 L250 470 M300 400 L360 500" fill="none" stroke="#E07A78" stroke-width="12" stroke-linecap="round"/>
      <path d="M318 300 C292 300 286 338 318 392 C360 332 352 300 318 300" fill="#E24B4B" stroke="#A32E38" stroke-width="4"/>
    `),
    spots: [
      bodySpot('blood-vessels', 150, 300, 290, 220),
      bodySpot('heart', 276, 286, 96, 120)
    ]
  },
  lungs: {
    svg: bodySvg(`<g opacity=".4">${BODY_PERSON}</g>
      <rect x="286" y="248" width="28" height="70" rx="14" fill="#F2C1CE" stroke="#C47A8C" stroke-width="3"/>
      <ellipse cx="236" cy="390" rx="62" ry="86" fill="#F4B7C8" stroke="#C47A8C" stroke-width="4"/>
      <ellipse cx="364" cy="390" rx="62" ry="86" fill="#F4B7C8" stroke="#C47A8C" stroke-width="4"/>
    `),
    spots: [
      bodySpot('lungs', 168, 300, 264, 190),
      bodySpot('windpipe', 270, 236, 60, 90)
    ]
  },
  brain: {
    svg: bodySvg(`<g opacity=".4">${BODY_PERSON}</g>
      <path d="M232 78 Q248 52 300 48 Q356 52 370 82 Q378 130 340 156 Q300 172 262 156 Q224 128 232 78" fill="#F0A8C8" stroke="#C46B90" stroke-width="4"/>
      <path d="M300 70 Q312 96 300 124 M270 78 Q286 104 274 132 M332 78 Q316 104 328 132" fill="none" stroke="#C46B90" stroke-width="3"/>
      <rect x="286" y="210" width="28" height="280" rx="14" fill="#F0A8C8" stroke="#C46B90" stroke-width="3"/>
    `),
    spots: [
      bodySpot('spinal-cord', 268, 200, 64, 300),
      bodySpot('brain', 220, 44, 164, 136)
    ]
  },
  tummy: {
    svg: bodySvg(`<g opacity=".45">${BODY_PERSON}</g>
      <ellipse cx="300" cy="214" rx="28" ry="16" fill="#C47A62"/>
      <path d="M292 230 Q300 300 292 390" fill="none" stroke="#E7A090" stroke-width="8" stroke-linecap="round"/>
      <path d="M176 400 Q210 376 250 400 Q268 460 210 478 Q168 456 176 400" fill="#C45A4A" stroke="#8E3A32" stroke-width="3"/>
      <ellipse cx="372" cy="430" rx="48" ry="40" fill="#F0B06A" stroke="#C4843A" stroke-width="3"/>
      <path d="M200 490 Q300 470 400 500 Q410 560 300 574 Q190 560 200 500 Z" fill="#E89A7A" stroke="#C46B4A" stroke-width="3"/>
      <path d="M230 510 Q270 500 300 518 Q340 500 370 516 Q350 546 300 548 Q250 546 230 510" fill="none" stroke="#C46B4A" stroke-width="3"/>
    `),
    spots: [
      bodySpot('intestines', 190, 478, 220, 110),
      bodySpot('liver', 164, 368, 120, 120),
      bodySpot('stomach', 320, 386, 108, 96),
      bodySpot('mouth', 260, 196, 80, 40)
    ]
  },
  senses: {
    svg: bodySvg(`
      <ellipse cx="300" cy="300" rx="168" ry="190" fill="#F6C9A8"/>
      <path d="M150 210 Q168 120 300 108 Q440 120 456 214 Q400 160 300 154 Q206 160 150 210" fill="#6B4423"/>
      <path d="M156 250 Q132 300 150 360" fill="none" stroke="#F6C9A8" stroke-width="36" stroke-linecap="round"/>
      <path d="M444 250 Q468 300 450 360" fill="none" stroke="#F6C9A8" stroke-width="36" stroke-linecap="round"/>
      <ellipse cx="168" cy="300" rx="28" ry="40" fill="#F0B898" stroke="#E2B092" stroke-width="3"/>
      <ellipse cx="432" cy="300" rx="28" ry="40" fill="#F0B898" stroke="#E2B092" stroke-width="3"/>
      <ellipse cx="236" cy="280" rx="36" ry="26" fill="#fff" stroke="#3A4668" stroke-width="4"/>
      <ellipse cx="364" cy="280" rx="36" ry="26" fill="#fff" stroke="#3A4668" stroke-width="4"/>
      <circle cx="244" cy="282" r="12" fill="#3A4668"/>
      <circle cx="356" cy="282" r="12" fill="#3A4668"/>
      <path d="M300 310 Q290 360 300 372 Q310 360 300 310" fill="#E7A090"/>
      <path d="M250 410 Q300 454 350 410 Q300 470 250 410" fill="#E07A7A"/>
      <path d="M300 430 Q300 448 300 452" stroke="#C45A5A" stroke-width="3"/>
      <g fill="#F6C9A8" stroke="#E2B092" stroke-width="3">
        <path d="M150 760 Q120 820 170 900 Q230 860 210 760 Z"/>
        <rect x="168" y="860" width="22" height="70" rx="10"/>
        <rect x="194" y="844" width="22" height="86" rx="10"/>
        <rect x="220" y="836" width="22" height="94" rx="10"/>
        <rect x="246" y="848" width="22" height="82" rx="10"/>
      </g>
    `),
    spots: [
      bodySpot('fingertips', 160, 820, 120, 130),
      bodySpot('ear', 400, 250, 70, 120),
      bodySpot('eye', 196, 246, 208, 70),
      bodySpot('nose', 274, 300, 52, 80),
      bodySpot('tongue', 244, 400, 112, 76)
    ]
  },
  skin: {
    svg: bodySvg(BODY_PERSON + `
      <path d="M214 92 Q250 36 300 32 Q352 36 388 96 Q360 78 300 74 Q242 78 214 92" fill="#6B4423"/>
      <rect x="276" y="208" width="48" height="16" rx="4" fill="#fff" stroke="#D5D8E0" stroke-width="2"/>
      <path d="M284 210 H292 M300 210 H308 M316 210 H324" stroke="#C9D0DB" stroke-width="2"/>
      <path d="M118 560 Q132 548 148 562" fill="none" stroke="#F4E4D4" stroke-width="5" stroke-linecap="round"/>
    `),
    spots: [
      bodySpot('skin', 210, 280, 180, 280),
      bodySpot('hair', 200, 24, 200, 100),
      bodySpot('teeth', 268, 200, 64, 32),
      bodySpot('fingernail', 108, 544, 48, 32)
    ]
  },
  touch: {
    svg: bodySvg(BODY_PERSON),
    spots: [
      bodySpot('head', 196, 36, 208, 210),
      bodySpot('shoulders', 160, 250, 280, 70),
      bodySpot('arm', 90, 280, 100, 200),
      bodySpot('knee', 196, 730, 80, 80),
      bodySpot('foot', 176, 910, 80, 50),
      bodySpot('elbow', 96, 400, 70, 70),
      bodySpot('hand', 96, 552, 72, 72),
      bodySpot('belly-button', 274, 444, 52, 52),
      bodySpot('toes', 176, 948, 80, 36)
    ]
  }
};
