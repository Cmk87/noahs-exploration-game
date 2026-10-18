/* Tiny helpers shared by every file. All scripts are classic (non-module)
   scripts loaded in order, so top-level names are shared between them. */
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a);
const clamp01=v=>v<0?0:v>1?1:v;
